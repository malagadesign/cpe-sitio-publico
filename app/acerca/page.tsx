import Image from 'next/image'
import { getCmsState } from '@/lib/cms'
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
  const s = await getCmsState()

  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const heroImg = s.fields['hero.acerca.img'] || '/somos/hero.webp'

  return (
    <div className="somos-page">
      <section className="hero somos-hero" data-cpe-section="hero">
        <div className="somos-hero-media">
          <Image
            src={heroImg}
            alt={lang === 'es' ? 'Operaciones de Crown Point Energía en campo argentino' : 'Crown Point field operations in Argentina'}
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
                alt={lang === 'es' ? 'Equipo de Crown Point Energía en yacimiento' : 'Crown Point team at the field'}
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
    </div>
  )
}
