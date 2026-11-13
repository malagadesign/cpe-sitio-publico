import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'
import FinDocsSearch, { type FinDoc } from './FinDocsSearch'

export const revalidate = 60

export const metadata = {
  title: 'Estados financieros | Inversores | Crown Point Energy',
  description:
    'Estados financieros auditados según IFRS y estados contables de Crown Point Energía S.A. ante la CNV.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/financieros' },
}

type IrDoc = {
  id: string
  categoria: string
  entidad: string
  periodo: string
  titulo_es: string
  titulo_en: string
  url: string
  fecha: string | null
  tipo: string
}

const FIN_FALLBACK: FinDoc[] = [
  {
    id: 'fin-memoria-2025',
    title: 'Memoria y Estados Financieros 2025',
    periodo: 'Dic 31, 2025',
    entidad: 'CPESA',
    url: 'https://crownpointenergy.com/wp-content/uploads/2026/04/CROWN-POINT-ENERGIA-SA-EEFF-AL-31122025-LEGALIZADO_compressed.pdf',
  },
  {
    id: 'fin-sep-2025',
    title: 'EEFF Condensados Intermedios — Sep 2025',
    periodo: 'Sep 30, 2025',
    entidad: 'CPESA',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/11/1-Crown-Point-FS-Sept-2025-final.pdf',
  },
  {
    id: 'fin-jun-2025',
    title: 'EEFF Condensados Intermedios — Jun 2025',
    periodo: 'Jun 30, 2025',
    entidad: 'CPESA',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/08/1-Crown-Point-FS-Jun-2025-FINAL.pdf',
  },
]

function entidadLabel(entidad: string): string {
  if (entidad === 'CPI') return 'CPI'
  if (entidad === 'CPESA') return 'CPESA'
  return entidad || 'CPESA'
}

export default async function FinancierosPage() {
  const db = createSupabaseServerAdminClient()
  let lang: 'es' | 'en' = 'es'
  let docs: FinDoc[] = []

  try {
    const [s, docsRes] = await Promise.all([
      getCmsState(),
      db
        .from('ir_documents')
        .select('id,categoria,entidad,periodo,titulo_es,titulo_en,url,fecha,tipo')
        .eq('publicado', true)
        .eq('categoria', 'financiero')
        .order('fecha', { ascending: false, nullsFirst: false }),
    ])
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
    const rows = (docsRes.data ?? []) as IrDoc[]
    docs = rows.map(d => ({
      id: d.id,
      title: lang === 'es' ? d.titulo_es || d.titulo_en : d.titulo_en || d.titulo_es,
      periodo: d.periodo || (d.fecha ?? ''),
      entidad: entidadLabel(d.entidad),
      url: d.url,
    }))
  } catch {
    const s = await getCmsState()
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
  }

  if (docs.length === 0) docs = FIN_FALLBACK

  return (
    <div className="fin-page">
      <section className="fin-hero" aria-labelledby="fin-heading">
        <div className="container">
          <p className="fin-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Reportes recientes</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Recent reports</span>
          </p>
          <h1 id="fin-heading" className="fin-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Estados financieros</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Financial statements</span>
          </h1>
          <p className="fin-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Reportes auditados según IFRS (International Financial Reporting Standards) y estados contables de
              CPESA ante la CNV.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Audited reports under IFRS (International Financial Reporting Standards) and CPESA financial
              statements filed with the CNV.
            </span>
          </p>
        </div>
      </section>

      <section
        className="fin-panel-wrap"
        aria-label={lang === 'es' ? 'Documentos financieros' : 'Financial documents'}
      >
        <div className="container">
          <FinDocsSearch docs={docs} lang={lang} />
        </div>
      </section>
    </div>
  )
}
