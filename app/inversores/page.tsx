import Image from 'next/image'
import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'
import { PRODUCTION_1Q2026 } from '@/lib/production'
import { SPROULE_2P_2025, totalReserves } from '@/lib/reserves'
import { formatDecimal, formatNumber } from '@/lib/format'
import IrSubscribeForm from './IrSubscribeForm'

export const revalidate = 60

export const metadata = {
  title: 'Inversores | Crown Point Energy (TSXV: CWV)',
  description: 'Resumen del inversor: tesis de inversión, reservas 2P, calificación crediticia y alertas IR. Crown Point Energy Inc. cotiza en TSXV: CWV.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores' },
}

const FIX_MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
function fmtFixDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso
  const [, y, mo, d] = m
  return `${d}-${FIX_MESES[parseInt(mo, 10) - 1]}-${y.slice(2)}`
}

type CalificacionLocal = { plazo: string; fecha: string; rating: string; perspectiva: string; accion: string }

export default async function InversoresPage() {
  const db = createSupabaseServerAdminClient()
  let s = await getCmsState()
  let calificacionLocal: CalificacionLocal[] = []

  try {
    const [sResult, calRes] = await Promise.all([
      getCmsState(),
      db.from('fix_calificacion_local').select('plazo,fecha,rating,perspectiva,accion').order('plazo'),
    ])
    s = sResult
    calificacionLocal = (calRes.data ?? []) as CalificacionLocal[]
  } catch {
    /* keep defaults */
  }

  const f = s.fields
  const fe = s.fieldsEn
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const heroImg = f['hero.inversores.img'] || '/inversores/hero.webp'

  const reserves = SPROULE_2P_2025
  const total = totalReserves(reserves)
  const reserveRows = [...reserves.categories, total]

  const credit = calificacionLocal[0] ?? {
    plazo: 'Largo plazo',
    fecha: '2026-08-26',
    rating: 'BBB+(arg)',
    perspectiva: 'Positiva',
    accion: 'CONFIRMA',
  }

  return (
    <div className="inv-page">
      <section className="hero inv-hero" data-cpe-section="hero">
        <div className="inv-hero-media">
          <Image
            src={heroImg}
            alt={lang === 'es' ? 'Operaciones upstream de Crown Point Energía' : 'Crown Point Energy upstream operations'}
            fill
            priority
            className="inv-hero-img"
            sizes="100vw"
          />
          <div className="inv-hero-veil" />
        </div>
        <div className="container inv-hero-content">
          <p className="inv-hero-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Resumen del inversor</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Investor overview</span>
          </p>
          <h1 className="inv-hero-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Una historia sólida de creación de valor</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>A solid track record of value creation</span>
          </h1>
          <p className="inv-hero-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              {(f['page.inversores.lede'] ||
                'Crown Point Energía S.A. es una empresa dedicada al petróleo y gas con cobertura internacional que opera en el mercado argentino. Su empresa holding Crown Point Energy Inc. cotiza en el TSX Venture Exchange (TSXV) bajo el símbolo "CWV". La Compañía está constituida en Canadá y tiene su sede central en Buenos Aires, Argentina.')
                .replaceAll('Toronto Stock Exchange Venture', 'TSX Venture Exchange')}
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              {(fe['page.inversores.lede'] ||
                'Crown Point Energía S.A. is an oil and gas company with international coverage operating in the Argentine market. Its holding company, Crown Point Energy Inc., trades on the TSX Venture Exchange (TSXV) under the symbol "CWV". The Company is incorporated in Canada and headquartered in Buenos Aires, Argentina.')
                .replaceAll('Toronto Stock Exchange Venture', 'TSX Venture Exchange')}
            </span>
          </p>
        </div>
      </section>

      <section className="inv-motivos" id="tesis" data-cpe-section="tesis">
        <div className="container">
          <div className="inv-motivos-grid">
            <div className="inv-photo">
              <Image
                src="/inversores/motivos.webp"
                alt={lang === 'es' ? 'Infraestructura de producción de Crown Point Energía' : 'Crown Point production infrastructure'}
                fill
                sizes="(max-width: 960px) 90vw, 684px"
                className="inv-photo-img"
              />
            </div>
            <div>
              <p className="inv-eyebrow">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Tesis de inversión</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Investment thesis</span>
              </p>
              <h2 className="inv-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Tres motivos para mirar Crown Point Energía</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Three reasons to look at Crown Point</span>
              </h2>

              <div className="inv-metric">
                <p className="inv-metric-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>01 · Producción</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>01 · Production</span>
                </p>
                <div className="inv-metric-row">
                  <p className="inv-metric-value">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>{formatNumber(PRODUCTION_1Q2026.avgBoePerDay, 'es')}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>{formatNumber(PRODUCTION_1Q2026.avgBoePerDay, 'en')}</span>
                  </p>
                  <span className="inv-metric-unit">{PRODUCTION_1Q2026.unit}</span>
                </div>
                <div className="inv-metric-meta">
                  <span className="inv-pill">1Q 2026</span>
                  <p className="inv-metric-note">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>
                      {PRODUCTION_1Q2026.oilPct}% líquidos · {PRODUCTION_1Q2026.gasPct}% gas · Producción
                    </span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>
                      {PRODUCTION_1Q2026.oilPct}% liquids · {PRODUCTION_1Q2026.gasPct}% gas · Production
                    </span>
                  </p>
                </div>
              </div>

              <div className="inv-metric">
                <p className="inv-metric-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>02 · Costos</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>02 · Costs</span>
                </p>
                <div className="inv-metric-row">
                  <p className="inv-metric-value">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>US${formatDecimal(38.8, 'es', 1)}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>US${formatDecimal(38.8, 'en', 1)}</span>
                  </p>
                  <span className="inv-metric-unit">/boe</span>
                </div>
                <div className="inv-metric-meta">
                  <span className="inv-pill">1Q 2026</span>
                  <p className="inv-metric-note">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>Opex total</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>Total opex</span>
                  </p>
                </div>
              </div>

              <div className="inv-metric">
                <p className="inv-metric-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>03 · Pipeline</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>03 · Pipeline</span>
                </p>
                <div className="inv-metric-row">
                  <p className="inv-metric-value">12</p>
                  <span className="inv-metric-unit">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>pozos planeados</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>wells planned</span>
                  </span>
                </div>
                <div className="inv-metric-meta">
                  <p className="inv-metric-note">2026–2027</p>
                </div>
              </div>
            </div>
          </div>

          <div className="inv-reserves">
            <div className="inv-reserves-hd">
              <p>
                <span className="lang-es" aria-hidden={lang !== 'es'}>Reservas 2P Certificadas — {reserves.certifier}</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Certified 2P Reserves — {reserves.certifier}</span>
              </p>
              <p className="total">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Total bruto {formatDecimal(total.gross, 'es', 2)} MMboe
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Total gross {formatDecimal(total.gross, 'en', 2)} MMboe
                </span>
              </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>
                    <span className="lang-es" aria-hidden={lang !== 'es'}>Categoría</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>Category</span>
                  </th>
                  <th className="num">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>Bruto (MMboe)</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>Gross (MMboe)</span>
                  </th>
                  <th className="num">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>Neto (MMboe)</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>Net (MMboe)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reserveRows.map(r => (
                  <tr key={r.category}>
                    <td>
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{r.category}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>
                        {r.category === 'Total Probadas' ? 'Total Proved' : r.category === 'Total Probables' ? 'Total Probable' : r.category}
                      </span>
                    </td>
                    <td className="num">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{formatDecimal(r.gross, 'es', 2)}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{formatDecimal(r.gross, 'en', 2)}</span>
                    </td>
                    <td className="num">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{formatDecimal(r.net, 'es', 2)}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{formatDecimal(r.net, 'en', 2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="inv-reserves-note">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Certificadas al 31/12/2025 bajo NI 51-101. Volúmenes en MMboe (millones de barriles de petróleo equivalente).
                Bruto = participación de trabajo bruta; Neto = porción correspondiente a Crown Point Energía después de regalías.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Certified as of 31/12/2025 under NI 51-101. Volumes in MMboe. Gross = working interest before royalties; Net = Crown Point share after royalties.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="inv-quote" data-cpe-section="quote">
        <div className="container">
          <blockquote>
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              “Ocho concesiones en tres cuencas — diversificación geológica real en un solo país.”
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              “Eight concessions across three basins — real geological diversification in a single country.”
            </span>
          </blockquote>
          <cite>
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Cifras gerenciales no auditadas en base a los estados contables de CPE Inc. Para detalle ver{' '}
              <Link href="/inversores/financieros">Estados financieros</Link>.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Unaudited management figures based on CPE Inc. financial statements. See{' '}
              <Link href="/inversores/financieros">Financial statements</Link> for detail.
            </span>
          </cite>
        </div>
      </section>

      <section className="inv-valor" id="activos" data-cpe-section="activos">
        <div className="container">
          <div className="inv-valor-grid">
            <div className="inv-valor-copy">
              <p className="inv-eyebrow">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Para inversores</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>For investors</span>
              </p>
              <h2 className="inv-valor-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Una historia de valor respaldada por activos reales</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>A value story backed by real assets</span>
              </h2>
              <div className="inv-valor-body">
                <div className="lang-es" aria-hidden={lang !== 'es'}>
                  <p>
                    Reservas certificadas bajo NI 51-101 (norma canadiense), contratos de suministro energético en USD y moneda local indexada, y un equipo con más de 20 años de experiencia en el upstream.
                  </p>
                  <p className="inv-valor-heading">Producción base diversificada</p>
                  <p>Mix balanceado de gas natural, crudo y NGL en cinco bloques y tres cuencas.</p>
                  <p className="inv-valor-heading">Pipeline de crecimiento</p>
                  <p>Plan de 12 pozos para 2026–2027 enfocados en gas y crudo de bajo punto de equilibrio.</p>
                </div>
                <div className="lang-en" aria-hidden={lang !== 'en'}>
                  <p>
                    Reserves certified under NI 51-101 (a Canadian regulation), energy supply contracts in USD and indexed local currency, and a team with 20+ years of upstream experience.
                  </p>
                  <p className="inv-valor-heading">Diversified base production</p>
                  <p>A balanced mix of natural gas, crude and NGLs across five blocks and three basins.</p>
                  <p className="inv-valor-heading">Growth pipeline</p>
                  <p>A 12-well plan for 2026–2027 focused on low-breakeven gas and crude.</p>
                </div>
              </div>
              <div className="inv-ctas">
                <Link href="/inversores/reportes" className="inv-btn inv-btn--solid">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Ver resumen completo</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>View full summary</span>
                </Link>
                <Link href="/inversores/financieros" className="inv-btn inv-btn--ghost">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Últimos estados financieros</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Latest financial statements</span>
                </Link>
              </div>
            </div>
            <div className="inv-photo">
              <Image
                src="/inversores/valor.webp"
                alt={lang === 'es' ? 'Activos y operaciones de campo de Crown Point Energía' : 'Crown Point field assets and operations'}
                fill
                sizes="(max-width: 960px) 90vw, 684px"
                className="inv-photo-img inv-photo-img--center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="inv-credit" id="calificacion" data-cpe-section="calificacion">
        <div className="container">
          <p className="inv-eyebrow inv-eyebrow--center">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Deuda local</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Local debt</span>
          </p>
          <h2 className="inv-credit-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Calificación crediticia</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Credit rating</span>
          </h2>
          <p className="inv-credit-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Calificación otorgada por FIX SCR (afiliada de Fitch Ratings en Argentina) sobre obligaciones de largo plazo.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Rating granted by FIX SCR (Fitch Ratings affiliate in Argentina) on long-term obligations.
            </span>
          </p>
          <table className="inv-credit-table">
            <caption className="sr-only">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Calificación crediticia de deuda local FIX SCR</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Local debt credit rating by FIX SCR</span>
            </caption>
            <thead>
              <tr>
                <th><span className="lang-es" aria-hidden={lang !== 'es'}>Fecha</span><span className="lang-en" aria-hidden={lang !== 'en'}>Date</span></th>
                <th><span className="lang-es" aria-hidden={lang !== 'es'}>Plazo</span><span className="lang-en" aria-hidden={lang !== 'en'}>Term</span></th>
                <th>Rating</th>
                <th><span className="lang-es" aria-hidden={lang !== 'es'}>Perspectiva</span><span className="lang-en" aria-hidden={lang !== 'en'}>Outlook</span></th>
                <th><span className="lang-es" aria-hidden={lang !== 'es'}>Acción</span><span className="lang-en" aria-hidden={lang !== 'en'}>Action</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{fmtFixDate(credit.fecha)}</td>
                <td>{credit.plazo.replace('Largo Plazo', 'Largo plazo')}</td>
                <td><span className="inv-credit-rating">{credit.rating}</span></td>
                <td>{credit.perspectiva}</td>
                <td>{credit.accion}</td>
              </tr>
            </tbody>
          </table>
          <a
            className="inv-credit-link"
            href="https://www.fixscr.com/emisor/view?type=emisor&id=4052"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Ver ficha completa en <span className="inv-credit-link-accent">fixscr.com →</span>
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              View full profile on <span className="inv-credit-link-accent">fixscr.com →</span>
            </span>
          </a>
        </div>
      </section>

      <section className="inv-subscribe" id="alertas" data-cpe-section="alertas">
        <div className="container">
          <div className="inv-subscribe-grid">
            <div>
              <p className="inv-eyebrow">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Alertas para inversores</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Investor alerts</span>
              </p>
              <h2 className="inv-subscribe-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Información actualizada</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Stay up to date</span>
              </h2>
              <p className="inv-subscribe-lede">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Suscribite a nuestra lista de IR para recibir comunicados de prensa, resultados trimestrales y eventos relevantes en tu casilla de correo.
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Subscribe to our IR list to receive press releases, quarterly results and relevant events in your inbox.
                </span>
              </p>
            </div>
            <IrSubscribeForm lang={lang} variant="figma" />
          </div>
        </div>
      </section>
    </div>
  )
}
