import Image from 'next/image'
import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'
import {
  fetchIrEvents,
  fetchShareholderMeetings,
  type ShareholderMeeting,
} from '@/lib/content-fetch'
import { OnDocsSearch, EstmaSearch, type SearchDoc } from './DocsSearch'
import CalendarioCarousel, { type CalEvent } from './CalendarioCarousel'

export const revalidate = 60

export const metadata = {
  title: 'Reportes | Inversores | Crown Point Energy',
  description:
    'Hechos relevantes CNV, obligaciones negociables, ESTMA, asambleas y calendario financiero de Crown Point Energy.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/reportes' },
}

type CnvHecho = {
  doc_id: number
  fecha: string
  hora: string
  tipo: string
  descripcion: string
  pdf_url: string | null
}

type OnVigente = {
  isin: string
  concepto: string
  fecha: string
  rating: string
  perspectiva: string
  accion: string
}

type IrDoc = {
  id: string
  categoria: string
  entidad: string
  fecha: string | null
  periodo: string
  tipo: string
  titulo_es: string
  titulo_en: string
  url: string
}

const MESES_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MESES_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function fmtHechoDate(iso: string, lang: 'es' | 'en'): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const [, y, mo, d] = m
  const month = parseInt(mo, 10) - 1
  if (lang === 'en') return `${y}-${mo}-${d}`
  return `${d} de ${MESES_LONG[month]} de ${y}`.replace(/^0/, '')
}

function fmtOnDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const [, y, mo, d] = m
  return `${d}-${MESES_ES[parseInt(mo, 10) - 1]}-${y.slice(2)}`
}

function fmtLongDate(iso: string, lang: 'es' | 'en'): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const [, y, mo, d] = m
  const day = String(parseInt(d, 10))
  const month = parseInt(mo, 10) - 1
  if (lang === 'en') {
    const en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${en[month]} ${day}, ${y}`
  }
  return `${day} de ${MESES_LONG[month]} de ${y}`
}

function fmtRecordDate(iso: string | null, lang: 'es' | 'en'): string {
  if (!iso) return ''
  return fmtLongDate(iso, lang)
}

const HECHOS_FALLBACK: CnvHecho[] = [
  {
    doc_id: 1,
    fecha: '2026-09-01',
    hora: '',
    tipo: 'hecho_relevante',
    descripcion: 'FEC. CELEB.: 01-09-2026 - TEMA: 3 - ACTA DE ÓRGANO DE ADMINISTRACIÓN (DIRECTORIO)',
    pdf_url: null,
  },
  {
    doc_id: 2,
    fecha: '2026-09-01',
    hora: '',
    tipo: 'hecho_relevante',
    descripcion: 'FECHA: 01-09-2026 - OBLIGACIONES NEGOCIABLES (ON) - ART. 10 LON',
    pdf_url: null,
  },
  {
    doc_id: 3,
    fecha: '2026-09-01',
    hora: '',
    tipo: 'hecho_relevante',
    descripcion: '2 - - AVISO DE RESULTADO DE COLOCACIÓN',
    pdf_url: null,
  },
]

const ON_FALLBACK: OnVigente[] = [
  {
    concepto: 'Obligaciones Negociables Clase VI Garantizadas POR HASTA USD 20 MILLONES AMPLIABLE A USD 30 MILLONES',
    fecha: '2026-08-10',
    isin: 'AR0134464806',
    rating: 'A(arg)',
    perspectiva: 'Positiva',
    accion: 'SUBE',
  },
  {
    concepto: 'Obligaciones Negociables Clase VII Por hasta USD 10 MM ampliables por hasta USD 25 MM de manera conjunta con las ON clase VIII',
    fecha: '2026-08-10',
    isin: 'AR0370555119',
    rating: 'BBB+(arg)',
    perspectiva: 'Positiva',
    accion: 'SUBE',
  },
  {
    concepto: 'Obligaciones Negociables Clase IX Garantizadas Por hasta USD 15 millones ampliables hasta USD 30 millones',
    fecha: '2026-08-10',
    isin: 'AR0764757453',
    rating: 'A(arg)',
    perspectiva: 'Positiva',
    accion: 'SUBE',
  },
]

const ON_DOCS_FALLBACK: SearchDoc[] = [
  {
    id: 'on-aviso-vii',
    title: 'ON Clase VII y VIII — Aviso de Resultados',
    periodo: 'Jul 2025',
    entidad: 'CPESA',
    url: 'https://www.argentina.gob.ar/cnv',
  },
]

const ESTMA_FALLBACK: SearchDoc[] = [
  {
    id: 'estma-2025',
    title: '2025 ESTMA Report',
    periodo: '2025',
    entidad: 'CPI',
    url: 'https://crownpointenergy.com/wp-content/uploads/2026/04/E986627-CROWN-POINT-ENERGY-INC.-2025-ESTMA-Report-filed.pdf',
  },
  {
    id: 'estma-2024',
    title: '2024 ESTMA Report',
    periodo: '2024',
    entidad: 'CPI',
    url: 'https://crownpointenergy.com/wp-content/uploads/2025/03/CPE-ESTMA-Report-2024.pdf',
  },
]

const MEETING_FALLBACK: ShareholderMeeting = {
  id: 0,
  tipo: 'agm',
  fecha: '2025-12-17',
  hora_local: '10:00',
  zona_es: 'Hora de Calgary (MST)',
  zona_en: 'Calgary time (MST)',
  formato: 'presencial',
  lugar_es: 'Calgary, Alberta, Canadá',
  lugar_en: 'Calgary, Alberta, Canada',
  titulo_es: 'Asamblea General Anual',
  titulo_en: 'Annual General Meeting',
  nota_es:
    'Convocatoria, Notice & Access y Formulario de Proxy disponibles en la sección AGM. Materiales presentados ante SEDAR+.',
  nota_en:
    'Notice of Meeting, Notice & Access and Proxy Form available in the AGM section. Materials filed on SEDAR+.',
  record_date: '2025-11-17',
  sedar_url: 'https://www.sedarplus.ca/',
}

const CAL_FALLBACK: CalEvent[] = [
  { id: 'c1', fecha: '2026-06-25', tipo: 'results', titulo: 'Resultados Q1 2026', nota: 'MD&A + estados trimestrales' },
  { id: 'c2', fecha: '2026-08-14', tipo: 'results', titulo: 'Resultados Q2 2026', nota: 'MD&A + estados trimestrales' },
  { id: 'c3', fecha: '2026-11-13', tipo: 'results', titulo: 'Resultados Q3 2026', nota: 'MD&A + estados trimestrales' },
]

export default async function ReportesPage() {
  const db = createSupabaseServerAdminClient()
  let lang: 'es' | 'en' = 'es'
  let hechos: CnvHecho[] = []
  let onVigentes: OnVigente[] = []
  let irDocs: IrDoc[] = []
  let meetings: ShareholderMeeting[] = []
  let calEvents: CalEvent[] = []

  try {
    const [s, cnvRes, onRes, docsRes, mtgs, evts] = await Promise.all([
      getCmsState(),
      db
        .from('cnv_hechos')
        .select('doc_id,fecha,hora,tipo,descripcion,pdf_url')
        .eq('tipo', 'hecho_relevante')
        .order('fecha', { ascending: false })
        .limit(12),
      db.from('fix_on_vigentes').select('isin,concepto,fecha,rating,perspectiva,accion').order('orden'),
      db
        .from('ir_documents')
        .select('id,categoria,entidad,fecha,periodo,tipo,titulo_es,titulo_en,url')
        .eq('publicado', true)
        .order('fecha', { ascending: false, nullsFirst: false }),
      fetchShareholderMeetings(),
      fetchIrEvents(),
    ])
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
    hechos = (cnvRes.data ?? []) as CnvHecho[]
    onVigentes = (onRes.data ?? []) as OnVigente[]
    irDocs = (docsRes.data ?? []) as IrDoc[]
    meetings = mtgs
    calEvents = evts.map(e => ({
      id: e.id,
      fecha: e.fecha,
      tipo: e.tipo,
      titulo: lang === 'es' ? e.titulo_es : e.titulo_en,
      nota: lang === 'es' ? e.nota_es : e.nota_en,
    }))
  } catch {
    const s = await getCmsState()
    lang = await getEffectiveLang(s.lang as 'es' | 'en')
  }

  if (hechos.length === 0) hechos = HECHOS_FALLBACK
  if (onVigentes.length === 0) onVigentes = ON_FALLBACK
  if (calEvents.length === 0) calEvents = CAL_FALLBACK

  const meeting = meetings[0] ?? MEETING_FALLBACK

  const estmaDocs: SearchDoc[] = irDocs
    .filter(d => d.categoria === 'estma')
    .map(d => ({
      id: d.id,
      title: lang === 'es' ? d.titulo_es || d.titulo_en : d.titulo_en || d.titulo_es,
      periodo: d.periodo || (d.fecha ? d.fecha.slice(0, 4) : ''),
      entidad: d.entidad,
      url: d.url,
    }))
  const estma = estmaDocs.length > 0 ? estmaDocs : ESTMA_FALLBACK

  const onDocs: SearchDoc[] = irDocs
    .filter(d => /on|obligacion|aviso|prospecto|suplemento/i.test(`${d.categoria} ${d.tipo} ${d.titulo_es} ${d.titulo_en}`))
    .slice(0, 12)
    .map(d => ({
      id: d.id,
      title: lang === 'es' ? d.titulo_es || d.titulo_en : d.titulo_en || d.titulo_es,
      periodo: d.periodo || (d.fecha ? d.fecha.slice(0, 7) : ''),
      entidad: d.entidad === 'CPI' ? 'CPI' : 'CPESA',
      url: d.url,
    }))
  const onSearchDocs = onDocs.length > 0 ? onDocs : ON_DOCS_FALLBACK

  const formatoLabel =
    meeting.formato === 'presencial'
      ? lang === 'es' ? 'Presencial' : 'In person'
      : meeting.formato === 'virtual'
        ? lang === 'es' ? 'Virtual' : 'Virtual'
        : lang === 'es' ? 'Híbrida' : 'Hybrid'

  return (
    <div className="rep-page">
      <section className="rep-hechos" id="hechos" data-cpe-section="hechos">
        <div className="container">
          <div className="rep-hechos-grid">
            <div className="rep-photo">
              <Image
                src="/inversores/reportes-hero.webp"
                alt={lang === 'es' ? 'Bombas extractoras al atardecer en yacimiento' : 'Pump jacks at sunset in an oilfield'}
                fill
                sizes="(max-width: 960px) 90vw, 684px"
                className="rep-photo-img"
                priority
              />
            </div>
            <div>
              <p className="rep-eyebrow">CNV · AIF</p>
              <h1 className="rep-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Hechos relevantes</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Material facts</span>
              </h1>
              <p className="rep-lede">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Información presentada por Crown Point Energía S.A. ante la Comisión Nacional de Valores.
                  Actualizado automáticamente desde la{' '}
                  <a
                    href="https://www.cnv.gov.ar/SitioWeb/Empresas/Empresa/30709346268"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AIF de la CNV
                  </a>
                  .
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Information filed by Crown Point Energía S.A. with the Argentine Securities Commission.
                  Automatically updated from the{' '}
                  <a
                    href="https://www.cnv.gov.ar/SitioWeb/Empresas/Empresa/30709346268"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNV AIF
                  </a>
                  .
                </span>
              </p>
              <div className="rep-hechos-card">
                {hechos.slice(0, 6).map((h, i) => {
                  const inner = (
                    <>
                      <p className="rep-hecho-date">{fmtHechoDate(h.fecha, lang)}</p>
                      <p className="rep-hecho-desc">{h.descripcion}</p>
                    </>
                  )
                  const cls = `rep-hecho${i === 1 ? ' rep-hecho--active' : ''}`
                  return h.pdf_url ? (
                    <a key={h.doc_id} className={cls} href={h.pdf_url} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={h.doc_id} className={cls}>
                      {inner}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rep-on" id="on" data-cpe-section="on">
        <div className="container">
          <p className="rep-eyebrow rep-eyebrow--green">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Programa global</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Global program</span>
          </p>
          <h2 className="rep-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Obligaciones negociables activas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Outstanding notes</span>
          </h2>
          <p className="rep-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Calificaciones otorgadas por{' '}
              <a href="https://www.fixscr.com/emisor/view?type=emisor&id=4052" target="_blank" rel="noopener noreferrer">
                FIX SCR
              </a>{' '}
              (afiliada de Fitch Ratings en Argentina). Programa global de emisión autorizado por CNV.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Ratings granted by{' '}
              <a href="https://www.fixscr.com/emisor/view?type=emisor&id=4052" target="_blank" rel="noopener noreferrer">
                FIX SCR
              </a>{' '}
              (Fitch Ratings affiliate in Argentina). Global notes program authorized by the CNV.
            </span>
          </p>

          <div className="rep-on-table-wrap">
            <table className="rep-on-table">
              <caption className="sr-only">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Obligaciones negociables activas y calificaciones FIX SCR</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Outstanding notes and FIX SCR ratings</span>
              </caption>
              <thead>
                <tr>
                  <th><span className="lang-es" aria-hidden={lang !== 'es'}>Instrumento</span><span className="lang-en" aria-hidden={lang !== 'en'}>Instrument</span></th>
                  <th><span className="lang-es" aria-hidden={lang !== 'es'}>Fecha</span><span className="lang-en" aria-hidden={lang !== 'en'}>Date</span></th>
                  <th>ISIN</th>
                  <th>Rating</th>
                  <th><span className="lang-es" aria-hidden={lang !== 'es'}>Perspectiva</span><span className="lang-en" aria-hidden={lang !== 'en'}>Outlook</span></th>
                  <th><span className="lang-es" aria-hidden={lang !== 'es'}>Acción</span><span className="lang-en" aria-hidden={lang !== 'en'}>Action</span></th>
                </tr>
              </thead>
              <tbody>
                {onVigentes.map(on => (
                  <tr key={on.isin}>
                    <td className="rep-on-instrumento">{on.concepto}</td>
                    <td>{fmtOnDate(on.fecha)}</td>
                    <td>{on.isin}</td>
                    <td><span className="rep-on-rating">{on.rating}</span></td>
                    <td>{on.perspectiva}</td>
                    <td className="rep-on-accion">{on.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <a
            className="rep-on-link"
            href="https://www.fixscr.com/emisor/view?type=emisor&id=4052"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Ver ficha completa en <span>fixscr.com →</span>
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              View full profile on <span>fixscr.com →</span>
            </span>
          </a>

          <OnDocsSearch docs={onSearchDocs} lang={lang} />
        </div>
      </section>

      <section className="rep-estma" id="estma" data-cpe-section="estma">
        <div className="container">
          <p className="rep-eyebrow rep-eyebrow--green">ESTMA</p>
          <h2 className="rep-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Reportes ESTMA</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>ESTMA reports</span>
          </h2>
          <p className="rep-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Reportes de pagos a gobiernos bajo la Extractive Sector Transparency Measures Act (ESTMA) de Canadá.
              Crown Point Energy Inc. reporta sus pagos a gobiernos argentinos anualmente.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Reports of payments to governments under Canada’s Extractive Sector Transparency Measures Act (ESTMA).
              Crown Point Energy Inc. reports its payments to Argentine governments annually.
            </span>
          </p>
          <EstmaSearch docs={estma} lang={lang} />
        </div>
      </section>

      <section className="rep-asambleas" id="asambleas" data-cpe-section="asambleas">
        <div className="container">
          <p className="rep-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Accionistas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Shareholders</span>
          </p>
          <h2 className="rep-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Asambleas de accionistas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Shareholder meetings</span>
          </h2>
          <p className="rep-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Información sobre próximas asambleas de Crown Point Energy Inc. Los materiales de cada reunión se
              publican en{' '}
              <a href="https://www.sedarplus.ca/" target="_blank" rel="noopener noreferrer">
                SEDAR+
              </a>{' '}
              con al menos 21 días de anticipación.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Information on upcoming Crown Point Energy Inc. meetings. Materials for each meeting are filed on{' '}
              <a href="https://www.sedarplus.ca/" target="_blank" rel="noopener noreferrer">
                SEDAR+
              </a>{' '}
              at least 21 days in advance.
            </span>
          </p>

          <article className="rep-agm-card">
            <div className="rep-agm-top">
              <span className="rep-agm-pill">
                {lang === 'es' ? (meeting.titulo_es || 'Asamblea General Anual') : (meeting.titulo_en || 'Annual General Meeting')}
              </span>
              <p className="rep-agm-date">{fmtLongDate(meeting.fecha, lang)}</p>
            </div>
            <div className="rep-agm-meta">
              <div>
                <p className="rep-agm-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Hora</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Time</span>
                </p>
                <p className="rep-agm-value">{meeting.hora_local || '—'}</p>
                <p className="rep-agm-sub">
                  {lang === 'es' ? meeting.zona_es : meeting.zona_en}
                </p>
              </div>
              <div>
                <p className="rep-agm-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Lugar</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Venue</span>
                </p>
                <p className="rep-agm-value">
                  {lang === 'es' ? meeting.lugar_es : meeting.lugar_en}
                </p>
              </div>
            </div>
            <div className="rep-agm-agenda">
              <p className="rep-agm-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Agenda / Asuntos</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Agenda / Business</span>
              </p>
              <p className="rep-agm-sub" style={{ color: '#4b76b5' }}>
                {lang === 'es' ? meeting.nota_es : meeting.nota_en}
              </p>
            </div>
            <div className="rep-agm-foot">
              <div>
                <p>{formatoLabel}</p>
                {meeting.record_date && (
                  <p>
                    <span className="lang-es" aria-hidden={lang !== 'es'}>
                      Fecha de registro: {fmtRecordDate(meeting.record_date, lang)}
                    </span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>
                      Record date: {fmtRecordDate(meeting.record_date, lang)}
                    </span>
                  </p>
                )}
              </div>
              <a
                href={meeting.sedar_url || 'https://www.sedarplus.ca/'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lang-es" aria-hidden={lang !== 'es'}>Documentos en SEDAR+</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Documents on SEDAR+</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="rep-calendario" id="calendario" data-cpe-section="calendario">
        <div className="container">
          <p className="rep-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Accionistas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Shareholders</span>
          </p>
          <h2 className="rep-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Calendario financiero</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Financial calendar</span>
          </h2>
          <p className="rep-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Fechas tentativas para resultados trimestrales y eventos corporativos. Sujeto a cambio — confirmación
              en SEDAR+ con al menos 2 semanas de anticipación.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Tentative dates for quarterly results and corporate events. Subject to change — confirmation on SEDAR+
              at least 2 weeks in advance.
            </span>
          </p>
          <CalendarioCarousel events={calEvents} lang={lang} />
          <p style={{ marginTop: 28 }}>
            <Link href="/inversores" style={{ color: 'var(--cp-navy-deep)', fontSize: 16 }}>
              <span className="lang-es" aria-hidden={lang !== 'es'}>← Volver a Invertir</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>← Back to Invest</span>
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
