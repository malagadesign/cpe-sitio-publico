import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'
import AgmDocsSearch, { type AgmDoc } from './AgmDocsSearch'

export const revalidate = 60

export const metadata = {
  title: 'Asambleas | Inversores | Crown Point Energy',
  description:
    'Materiales de asamblea de Crown Point Energy Inc.: circulares, noticias y formularios de proxy archivados en SEDAR+.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/asambleas' },
}

type IrDoc = {
  id: string
  categoria: string
  entidad: string
  titulo_es: string
  titulo_en: string
  url: string
  fecha: string | null
}

const AGM_FALLBACK: AgmDoc[] = [
  {
    id: 'agm-circular-2025',
    title: 'Management Information Circular — AGM 2025',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/11/Circular-CWV-2025-AGM.pdf',
  },
  {
    id: 'agm-notice-2025',
    title: 'Notice and Access Notification — AGM 2025',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/11/Notice-and-Access-Crown-Point-AGM-2025.pdf',
  },
  {
    id: 'agm-proxy-2025',
    title: 'Form of Proxy — AGM 2025',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/11/Form-of-Proxy-Crown-Point-AGM-2025.pdf',
  },
]

export default async function AsambleasPage() {
  const db = createSupabaseServerAdminClient()
  let lang: 'es' | 'en' = 'es'
  let docs: AgmDoc[] = []

  try {
    const [s, docsRes] = await Promise.all([
      getCmsState(),
      db
        .from('ir_documents')
        .select('id,categoria,entidad,titulo_es,titulo_en,url,fecha')
        .eq('publicado', true)
        .eq('categoria', 'agm')
        .order('fecha', { ascending: false, nullsFirst: false }),
    ])
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
    const rows = (docsRes.data ?? []) as IrDoc[]
    docs = rows.map(d => ({
      id: d.id,
      title: lang === 'es' ? d.titulo_es || d.titulo_en : d.titulo_en || d.titulo_es,
      url: d.url,
    }))
  } catch {
    const s = await getCmsState()
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
  }

  if (docs.length === 0) docs = AGM_FALLBACK

  return (
    <div className="asm-page">
      <section className="asm-hero" aria-labelledby="asm-heading">
        <div className="container">
          <p className="asm-eyebrow">CPI · AGM</p>
          <h1 id="asm-heading" className="asm-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Materiales de asamblea — CPI</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Meeting materials — CPI</span>
          </h1>
          <p className="asm-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Circulares de información, noticias y formularios de proxy de las asambleas anuales de Crown Point Energy Inc.
              Archivados en{' '}
              <a href="https://www.sedarplus.ca/" target="_blank" rel="noopener noreferrer">
                SEDAR+
              </a>
              .
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Information circulars, notices and proxy forms for Crown Point Energy Inc. annual meetings. Filed on{' '}
              <a href="https://www.sedarplus.ca/" target="_blank" rel="noopener noreferrer">
                SEDAR+
              </a>
              .
            </span>
          </p>
        </div>
      </section>

      <section className="asm-panel-wrap" aria-label={lang === 'es' ? 'Documentos de asamblea' : 'Meeting documents'}>
        <div className="container">
          <AgmDocsSearch docs={docs} lang={lang} />
        </div>
      </section>
    </div>
  )
}
