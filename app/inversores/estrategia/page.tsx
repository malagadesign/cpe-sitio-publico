import { getCmsState } from '@/lib/cms'
import { getEffectiveLang } from '@/lib/lang'

export const revalidate = 60

export const metadata = {
  title: 'Estrategia | Inversores | Crown Point Energy',
  description:
    'Estrategia de crecimiento sostenible de Crown Point Energía: optimización de producción, disciplina financiera, crecimiento estratégico y transparencia.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/estrategia' },
}

const PILLARS = [
  {
    num: '01',
    title_es: 'Optimización de la producción',
    title_en: 'Production optimization',
    body_es:
      'Trabajamos para maximizar el potencial de nuestros yacimientos a través de mejoras operativas, intervenciones en pozos y recuperación secundaria, para sostener la producción y extender la vida útil de nuestros activos.',
    body_en:
      'We work to maximize the potential of our fields through operational improvements, well interventions and secondary recovery, to sustain production and extend the life of our assets.',
  },
  {
    num: '02',
    title_es: 'Disciplina financiera',
    title_en: 'Financial discipline',
    body_es:
      'Evaluamos cada inversión con criterios rigurosos de rentabilidad y eficiencia, aprobando únicamente proyectos con TIR > 30% a precios conservadores. Mantenemos Net Debt/EBITDA por debajo de 1,5x en todo momento.',
    body_en:
      'We evaluate every investment with rigorous return and efficiency criteria, approving only projects with IRR > 30% at conservative prices. We keep Net Debt/EBITDA below 1.5x at all times.',
  },
  {
    num: '03',
    title_es: 'Crecimiento estratégico',
    title_en: 'Strategic growth',
    body_es:
      'Buscamos oportunidades de adquisición y desarrollo de activos que complementen nuestras operaciones, aprovechando el propio expertise y conocimiento de las cuencas donde operamos.',
    body_en:
      'We pursue acquisition and development opportunities that complement our operations, leveraging our expertise and knowledge of the basins where we operate.',
  },
  {
    num: '04',
    title_es: 'Transparencia y compromiso',
    title_en: 'Transparency and commitment',
    body_es:
      'Promovemos una gestión transparente y relaciones de confianza con nuestros inversores, colaboradores, autoridades y comunidades, basadas en el cumplimiento de nuestros compromisos y una visión de largo plazo. Cumplimos con NI 51-101 y NI 52-110.',
    body_en:
      'We promote transparent management and trusted relationships with investors, employees, authorities and communities, grounded in meeting our commitments and a long-term view. We comply with NI 51-101 and NI 52-110.',
  },
] as const

export default async function EstrategiaPage() {
  const s = await getCmsState()
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')

  return (
    <div className="est-page">
      <section className="est-hero" aria-labelledby="est-heading">
        <div className="container">
          <p className="est-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Lineamientos</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Guidelines</span>
          </p>
          <h1 id="est-heading" className="est-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Una estrategia de crecimiento sostenible y a largo plazo
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              A sustainable, long-term growth strategy
            </span>
          </h1>
          <p className="est-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Trabajamos para potenciar los activos existentes, optimizar la producción e identificar nuevas
              oportunidades de inversión que nos permitan consolidar nuestra presencia en las cuencas energéticas
              argentinas.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              We work to strengthen existing assets, optimize production and identify new investment opportunities
              that consolidate our presence in Argentina&apos;s energy basins.
            </span>
          </p>
        </div>
      </section>

      <section
        className="est-pillars"
        aria-label={lang === 'es' ? 'Pilares de la estrategia' : 'Strategy pillars'}
      >
        <div className="container">
          <ul className="est-pillars-grid">
            {PILLARS.map(p => (
              <li key={p.num} className="est-pillar">
                <div className="est-pillar-frame">
                  <img
                    src="/inversores/estrategia/pillar-ring.svg"
                    alt=""
                    width={375}
                    height={375}
                    className="est-pillar-ring"
                  />
                  <div className="est-pillar-content">
                    <span className="est-pillar-num">{p.num}</span>
                    <h2 className="est-pillar-title">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{p.title_es}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{p.title_en}</span>
                    </h2>
                    <p className="est-pillar-body">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{p.body_es}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{p.body_en}</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
