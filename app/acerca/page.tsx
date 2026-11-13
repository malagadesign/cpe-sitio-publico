import Link from 'next/link'
import Image from 'next/image'
import { getCmsState } from '@/lib/cms'
import { fetchTeamMembers, fetchStrategyCards } from '@/lib/content-fetch'
import SomosTimeline from '@/components/SomosTimeline'
import { getEffectiveLang } from '@/lib/lang'

export const revalidate = 60

export const metadata = {
  title: 'Somos | Crown Point Energy',
  description: 'Quiénes somos, misión, visión, principios e historia de Crown Point Energía S.A.',
  alternates: { canonical: 'https://crownpointenergy.com/acerca' },
}

const TIMELINE = [
  { year: '2005', width: 183, es: 'Creación de Crown Point Energía', en: 'Crown Point Energía founded' },
  { year: '2010', width: 168, es: 'Adquisición de Antrim Energy Ltd.', en: 'Acquisition of Antrim Energy Ltd.' },
  { year: '2014–15', width: 291, es: 'Ingreso de Liminar Energía S.A. como accionista mayoritario en Crown Point Energy Inc.', en: 'Liminar Energía S.A. joins as majority shareholder of Crown Point Energy Inc.' },
  { year: '2014–17', width: 312, es: 'Puesta en valor: evaluación, cambio de management, reducción de costos y nuevo modelo de negocio', en: 'Value creation: evaluation, management change, cost reduction and new business model' },
  { year: '2017–19', width: 300, es: 'Incremento al 34,74% de la participación en la UTE RCLV — Provincia de Tierra del Fuego', en: 'Increase to 34.74% in the RCLV JV — Tierra del Fuego Province' },
  { year: '2021', width: 300, es: 'Adquisición del 50% de participación en la UTE Chañares Herrados — Provincia de Mendoza', en: 'Acquisition of 50% stake in Chañares Herrados JV — Mendoza Province' },
  { year: '2021', width: 185, es: 'Ingreso al régimen de oferta pública CNV', en: 'Listed on the CNV public offering regime' },
  { year: '2022', width: 300, es: 'Adquisición del 50% de participación en Puesto Pozo Cercado Oriental — Provincia de Mendoza', en: 'Acquisition of 50% stake in Puesto Pozo Cercado Oriental — Mendoza Province' },
  { year: '2024', width: 300, es: 'Adquisición del 100% de Piedra Clavada y Koluel Kaike — Provincia de Santa Cruz', en: 'Acquisition of 100% of Piedra Clavada and Koluel Kaike — Santa Cruz Province' },
  { year: '2025', width: 300, es: 'Adquisición del 95% de El Tordillo, La Tapera y Puesto Quiroga — Provincia de Chubut', en: 'Acquisition of 95% of El Tordillo, La Tapera and Puesto Quiroga — Chubut Province' },
]

export default async function AcercaPage() {
  const [s, management, board, strategyCards] = await Promise.all([
    getCmsState(),
    fetchTeamMembers('management'),
    fetchTeamMembers('board'),
    fetchStrategyCards(),
  ])

  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const heroImg = s.fields['hero.acerca.img'] || '/somos/hero.webp'

  const isCPI = (m: { entidad?: string }) => m.entidad === 'CPI'
  const mgmtCPI = management.filter(isCPI)
  const mgmtCPESA = management.filter(m => !isCPI(m))
  const boardCPI = board.filter(isCPI)
  const boardCPESA = board.filter(m => !isCPI(m))
  const BOARD_CATEGORIES = ['Director Titular', 'Director Suplente', 'Síndico Titular', 'Síndico Suplente']
  const dirTitulares = boardCPESA.filter(d => d.cargo_board === 'Director Titular')
  const dirSuplentes = boardCPESA.filter(d => d.cargo_board === 'Director Suplente')
  const sindTitulares = boardCPESA.filter(d => d.cargo_board === 'Síndico Titular')
  const sindSuplentes = boardCPESA.filter(d => d.cargo_board === 'Síndico Suplente')
  const boardOther = boardCPESA.filter(d => !BOARD_CATEGORIES.includes(d.cargo_board))

  return (
    <div className="somos-page">
      <section className="hero somos-hero" data-cpe-section="hero">
        <div className="somos-hero-media">
          <Image
            src={heroImg}
            alt={lang === 'es' ? 'Operaciones de Crown Point en campo argentino' : 'Crown Point field operations in Argentina'}
            fill
            priority
            className="somos-hero-img"
            sizes="100vw"
          />
          <div className="somos-hero-veil" />
        </div>
        <div className="container somos-hero-content">
          <p className="somos-hero-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Conocenos</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Get to know us</span>
          </p>
          <h1 className="somos-hero-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Potenciamos lo que hace crecer al país</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>We power what makes the country grow</span>
          </h1>
          <p className="somos-hero-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Contribuimos con la actividad regional, generando empleo e impulsando la economía nacional.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              We contribute to regional activity, creating jobs and driving the national economy.
            </span>
          </p>
        </div>
      </section>

      <section className="somos-block" id="nosotros" data-cpe-section="nosotros">
        <div className="container">
          <div className="somos-split">
            <div>
              <h2 className="somos-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Quiénes somos</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Who we are</span>
              </h2>
              <div className="somos-copy">
                <p className="lang-es" aria-hidden={lang !== 'es'}>
                  Somos Crown Point Energía, una empresa argentina con más de 20 años de trayectoria dedicada a la exploración y producción de petróleo y gas en yacimientos convencionales maduros.
                </p>
                <p className="lang-es" aria-hidden={lang !== 'es'}>
                  A través de la inversión y la incorporación de nuevas tecnologías, extendemos su vida útil y recuperamos volúmenes que todavía tienen un gran potencial. Así, contribuimos a sostener la actividad regional, generar empleo e impulsar la economía nacional.
                </p>
                <p className="lang-es" aria-hidden={lang !== 'es'}>
                  Actualmente, operamos en Mendoza, Chubut y Santa Cruz, con foco en incrementar y sostener nuestros niveles de producción a través de nuevas perforaciones, workovers, optimización de instalaciones y mejoras operativas.
                </p>
                <p className="lang-es" aria-hidden={lang !== 'es'}>
                  Formamos parte del Grupo ST, un grupo inversor multisectorial, con presencia en sectores estratégicos como energía, finanzas, seguros, industria automotriz, ganadería y tecnología.
                </p>
                <p className="lang-es" aria-hidden={lang !== 'es'}>
                  Compartimos una visión de largo plazo orientada a maximizar el potencial de cada activo, impulsando una gestión más eficiente y el desarrollo productivo de la Argentina.
                </p>
                <p className="lang-en" aria-hidden={lang !== 'en'}>
                  We are Crown Point Energía, an Argentine company with more than 20 years of experience in exploration and production of oil and gas in mature conventional fields.
                </p>
                <p className="lang-en" aria-hidden={lang !== 'en'}>
                  Through investment and new technologies, we extend field life and recover volumes that still hold great potential—supporting regional activity, jobs and the national economy.
                </p>
                <p className="lang-en" aria-hidden={lang !== 'en'}>
                  We operate in Mendoza, Chubut and Santa Cruz, focused on sustaining and growing production through new wells, workovers, facility optimization and operational improvements.
                </p>
                <p className="lang-en" aria-hidden={lang !== 'en'}>
                  We are part of Grupo ST, a multi-sector investment group with presence in energy, finance, insurance, automotive, livestock and technology.
                </p>
                <p className="lang-en" aria-hidden={lang !== 'en'}>
                  We share a long-term vision to maximize each asset&apos;s potential and drive productive development in Argentina.
                </p>
              </div>
            </div>
            <div className="somos-circle">
              <Image
                src="/somos/quienes-circle.webp"
                alt={lang === 'es' ? 'Instalaciones y producción de Crown Point Energía' : 'Crown Point Energía facilities and production'}
                fill
                sizes="(max-width: 960px) 90vw, 520px"
                className="somos-circle-img somos-circle-img--quienes"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="somos-block somos-block--alt" id="mision" data-cpe-section="mision">
        <div className="container">
          <div className="somos-split somos-split--reverse">
            <div className="somos-mvp">
              <div className="somos-mvp-item">
                <h3 className="somos-mvp-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Misión</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Mission</span>
                </h3>
                <p>
                  <span className="lang-es" aria-hidden={lang !== 'es'}>
                    Explorar, desarrollar y producir petróleo y gas de manera eficiente, maximizando el potencial de nuestros activos mediante inversión, tecnología y excelencia operativa, generando valor sostenible que acelere el pulso productivo de la Argentina
                  </span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>
                    Explore, develop and produce oil and gas efficiently, maximizing asset potential through investment, technology and operational excellence—creating sustainable value that accelerates Argentina&apos;s productive pulse.
                  </span>
                </p>
              </div>
              <div className="somos-mvp-item">
                <h3 className="somos-mvp-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Visión</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Vision</span>
                </h3>
                <p>
                  <span className="lang-es" aria-hidden={lang !== 'es'}>
                    Potenciar el valor de los yacimientos argentinos para que produzcan más, mejor y por más tiempo.
                  </span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>
                    Unlock the value of Argentine fields so they produce more, better and for longer.
                  </span>
                </p>
              </div>
              <div className="somos-mvp-item">
                <h3 className="somos-mvp-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>Principios</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>Principles</span>
                </h3>
                <ul>
                  <li><span className="lang-es" aria-hidden={lang !== 'es'}>Ética e integridad</span><span className="lang-en" aria-hidden={lang !== 'en'}>Ethics and integrity</span></li>
                  <li><span className="lang-es" aria-hidden={lang !== 'es'}>Profesionalismo y responsabilidad</span><span className="lang-en" aria-hidden={lang !== 'en'}>Professionalism and responsibility</span></li>
                  <li><span className="lang-es" aria-hidden={lang !== 'es'}>Transparencia y acceso a la información</span><span className="lang-en" aria-hidden={lang !== 'en'}>Transparency and access to information</span></li>
                  <li><span className="lang-es" aria-hidden={lang !== 'es'}>Respeto por el medioambiente</span><span className="lang-en" aria-hidden={lang !== 'en'}>Respect for the environment</span></li>
                </ul>
              </div>
            </div>
            <div className="somos-circle">
              <Image
                src="/somos/workers-circle.webp"
                alt={lang === 'es' ? 'Equipo de Crown Point en yacimiento' : 'Crown Point team at the field'}
                fill
                sizes="(max-width: 960px) 90vw, 520px"
                className="somos-circle-img somos-circle-img--workers"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="somos-history" id="evolucion" data-cpe-section="evolucion">
        <div className="container">
          <p className="somos-history-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Historia</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>History</span>
          </p>
          <h2 className="somos-history-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Evolución de la Compañía</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Company milestones</span>
          </h2>
          <SomosTimeline items={TIMELINE} lang={lang} />
        </div>
      </section>

      {/* CMS-backed sections — keep until Equipo Figma frame is implemented */}
      <section className="somos-legacy" id="equipo">
        <div className="container">
          <style>{`
            .strat-grid { list-style: none; padding: 0; margin: var(--s-6) 0 0; }
            .strat-card { padding: var(--s-6) 0; border-bottom: 1px solid rgba(255,255,255,0.12); display: grid; grid-template-columns: 64px 1fr; gap: var(--s-6); align-items: start; }
            .strat-card:last-child { border-bottom: 0; }
            .strat-card .num { font-family: var(--font-mono); font-size: 22px; color: var(--cp-green); font-weight: 600; }
            .strat-card h4 { font-family: var(--font-display); font-size: 22px; font-weight: 600; margin: 0 0 8px; color: #fff; }
            .strat-card p { color: var(--cp-muted-soft); font-size: 14px; line-height: 1.55; margin: 0; }
            .people-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--s-6); }
            .person { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--r-lg); padding: var(--s-6); }
            .avatar { width: 56px; height: 56px; border-radius: 50%; color: #fff; display: grid; place-items: center; font-family: var(--font-display); font-weight: 600; font-size: 20px; margin-bottom: var(--s-3); }
            .person strong { display: block; font-family: var(--font-display); font-size: 22px; font-weight: 600; color: #fff; }
            .person .role { display: block; font-size: 13px; color: var(--cp-green); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; margin-top: 4px; }
            .person p { font-size: 14px; color: var(--cp-muted-soft); line-height: 1.55; margin: 12px 0 0; }
            .director-list { list-style: none; padding: 0; margin: 0; }
            .director-list li { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.12); display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; font-size: 16px; color: var(--cp-muted-soft); }
            .director-list li:last-child { border-bottom: 0; }
            .director-list strong { font-family: var(--font-display); font-size: 20px; font-weight: 600; color: #fff; }
            .director-list span { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; }
            @media (max-width: 720px) { .people-grid { grid-template-columns: 1fr; } }
          `}</style>

          {strategyCards.length > 0 && (
            <div className="section-block" id="estrategia">
              <span className="eyebrow"><span className="lang-es" aria-hidden={lang !== 'es'}>Estrategia</span><span className="lang-en" aria-hidden={lang !== 'en'}>Strategy</span></span>
              <h2 style={{ marginTop: 8, color: '#fff' }}>
                <span className="lang-es" aria-hidden={lang !== 'es'}>Crecimiento disciplinado con activos reales.</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Disciplined growth with real assets.</span>
              </h2>
              <div className="strat-grid">
                {strategyCards.map(c => (
                  <div className="strat-card" key={c.id}>
                    <span className="num">{c.num}</span>
                    <div>
                      <h4>
                        <span className="lang-es" aria-hidden={lang !== 'es'}>{c.title_es}</span>
                        <span className="lang-en" aria-hidden={lang !== 'en'}>{c.title_en}</span>
                      </h4>
                      <p>
                        <span className="lang-es" aria-hidden={lang !== 'es'}>{c.body_es}</span>
                        <span className="lang-en" aria-hidden={lang !== 'en'}>{c.body_en}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="section-block" id="management">
            <span className="eyebrow">Management</span>
            <h2 style={{ marginTop: 8, color: '#fff' }}>
              <span className="lang-es" aria-hidden={lang !== 'es'}>Equipo ejecutivo</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Executive team</span>
            </h2>
            {[
              { label: 'Crown Point Energy Inc.', list: mgmtCPI, esOnly: false },
              { label: 'Crown Point Energía S.A. (CPESA)', list: mgmtCPESA, esOnly: true },
            ].filter(g => g.list.length > 0).map(g => (
              <div key={g.label} className={g.esOnly ? 'lang-es' : undefined} style={{ marginTop: 'var(--s-6)' }}>
                <h3 style={{ fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cp-green)', fontWeight: 700, marginBottom: 'var(--s-4)' }}>{g.label}</h3>
                <ul className="people-grid">
                  {g.list.map(p => (
                    <li className="person" key={p.id}>
                      <div className="avatar" style={{ background: p.bg }}>{p.initials}</div>
                      <strong>{p.name}</strong>
                      <span className="role">
                        <span className="lang-es" aria-hidden={lang !== 'es'}>{p.role_es}</span>
                        <span className="lang-en" aria-hidden={lang !== 'en'}>{p.role_en}</span>
                      </span>
                      {(p.bio_es || p.bio_en) && (
                        <p>
                          <span className="lang-es" aria-hidden={lang !== 'es'}>{p.bio_es}</span>
                          <span className="lang-en" aria-hidden={lang !== 'en'}>{p.bio_en}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {boardCPI.length > 0 && (
            <div className="section-block" id="directorio-cpi">
              <span className="eyebrow">Crown Point Energy Inc.</span>
              <h2 style={{ marginTop: 8, color: '#fff' }}>
                <span className="lang-es" aria-hidden={lang !== 'es'}>Directorio — CPE Inc.</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Board — CPE Inc.</span>
              </h2>
              <ul className="people-grid">
                {boardCPI.map(p => (
                  <li className="person" key={p.id}>
                    <div className="avatar" style={{ background: p.bg }}>{p.initials}</div>
                    <strong>{p.name}</strong>
                    <span className="role">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{p.role_es}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{p.role_en}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {boardCPESA.length > 0 && (
            <div className="section-block lang-es" id="directorio">
              <span className="eyebrow">Crown Point Energía S.A.</span>
              <h2 style={{ marginTop: 8, color: '#fff' }}>Directorio — CPESA</h2>
              <ul className="director-list">
                {dirTitulares.map(d => (
                  <li key={d.id}>
                    <strong>{d.name}</strong>
                    {d.independiente === true && <span>Independiente</span>}
                  </li>
                ))}
                {dirSuplentes.map(d => (
                  <li key={d.id}>
                    <strong>{d.name}</strong>
                    {d.independiente === true && <span>Independiente</span>}
                  </li>
                ))}
                {sindTitulares.map(d => (
                  <li key={d.id}><strong>{d.name}</strong></li>
                ))}
                {sindSuplentes.map(d => (
                  <li key={d.id}><strong>{d.name}</strong></li>
                ))}
                {boardOther.map(d => (
                  <li key={d.id}>
                    <strong>{d.name}</strong>
                    {d.cargo_board && <> · {d.cargo_board}</>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="section-block" id="esg" style={{ borderBottom: 0 }}>
            <span className="eyebrow">ESG</span>
            <h2 style={{ marginTop: 8, color: '#fff' }}>
              <span className="lang-es" aria-hidden={lang !== 'es'}>Responsabilidad corporativa</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Corporate responsibility</span>
            </h2>
            <p className="lede" style={{ color: 'var(--cp-muted-soft)' }}>
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Operar de forma responsable es la condición para operar a largo plazo.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Operating responsibly is the condition for operating long-term.
              </span>
            </p>
            <div style={{ marginTop: 'var(--s-6)' }}>
              <Link href="/esg" className="btn btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <span className="lang-es" aria-hidden={lang !== 'es'}>Ver reporte ESG completo</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Full ESG report</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
