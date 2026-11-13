import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'
import GobDocsSearch, { type GobDoc } from './GobDocsSearch'

export const revalidate = 60

export const metadata = {
  title: 'Gobierno corporativo | Inversores | Crown Point Energy',
  description:
    'Documentos de gobierno corporativo de Crown Point Energy Inc.: mandatos de comités, políticas y códigos de conducta.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/gobierno' },
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

const GOB_FALLBACK: GobDoc[] = [
  {
    id: 'gob-audit',
    title: 'Mandato del Comité de Auditoría',
    url: 'https://crownpointenergy.com/wp-content/uploads/2015/01/CWV-Audit-Committee-Mandate.pdf',
  },
  {
    id: 'gob-comp',
    title: 'Mandato del Comité de Compensaciones',
    url: 'https://crownpointenergy.com/wp-content/uploads/2016/11/Compensation-Committee-Mandate-draft-amendment-March-7-2016_7433875_2....pdf',
  },
  {
    id: 'gob-hse',
    title: 'Mandato del Comité de Reservas, Salud, Seguridad y Ambiente',
    url: 'https://crownpointenergy.com/wp-content/uploads/2015/01/CWV-Reserves-and-Health-Safety-and-Environment-Committee-Mandate.pdf',
  },
  {
    id: 'gob-whistle',
    title: 'Política de Denuncia de Irregularidades',
    url: 'https://crownpointenergy.com/wp-content/uploads/2014/12/CWV-Whistleblower-Policy.pdf',
  },
]

export default async function GobiernoPage() {
  const db = createSupabaseServerAdminClient()
  let lang: 'es' | 'en' = 'es'
  let docs: GobDoc[] = []

  try {
    const [s, docsRes] = await Promise.all([
      getCmsState(),
      db
        .from('ir_documents')
        .select('id,categoria,entidad,titulo_es,titulo_en,url,fecha')
        .eq('publicado', true)
        .eq('categoria', 'gobernanza')
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

  if (docs.length === 0) {
    docs =
      lang === 'en'
        ? [
            {
              id: 'gob-audit',
              title: 'Audit Committee Mandate',
              url: GOB_FALLBACK[0].url,
            },
            {
              id: 'gob-comp',
              title: 'Compensation Committee Mandate',
              url: GOB_FALLBACK[1].url,
            },
            {
              id: 'gob-hse',
              title: 'Reserves, Health, Safety and Environment Committee Mandate',
              url: GOB_FALLBACK[2].url,
            },
            {
              id: 'gob-whistle',
              title: 'Whistleblower Policy',
              url: GOB_FALLBACK[3].url,
            },
          ]
        : GOB_FALLBACK
  }

  return (
    <div className="gob-page">
      <section className="gob-hero" aria-labelledby="gob-heading">
        <div className="container">
          <p className="gob-eyebrow">Compliance &amp; ESG</p>
          <h1 id="gob-heading" className="gob-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Gobierno corporativo</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Corporate governance</span>
          </h1>
          <p className="gob-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Crown Point Energy Inc. cotiza en TSX Venture Exchange y reporta bajo las normas canadienses para
              emisores junior.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Crown Point Energy Inc. trades on the TSX Venture Exchange and reports under Canadian rules for junior
              issuers.
            </span>
          </p>
        </div>
      </section>

      <section
        className="gob-panel-wrap"
        aria-label={lang === 'es' ? 'Documentos de gobierno corporativo' : 'Corporate governance documents'}
      >
        <div className="container">
          <GobDocsSearch docs={docs} lang={lang} />
        </div>
      </section>
    </div>
  )
}
