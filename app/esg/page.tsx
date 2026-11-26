import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import { createSupabaseServerAdminClient } from '@/lib/supabase'
import { getEffectiveLang } from '@/lib/lang'

type PoliticaDoc = {
  id: string
  titulo_es: string
  titulo_en: string
  storage_path: string
  file_name: string
}

export const revalidate = 60

export const metadata = {
  title: 'Sustentabilidad | Crown Point Energy',
  description:
    'Responsabilidad ambiental, social y de gobierno corporativo de Crown Point Energy, y políticas corporativas públicas.',
  alternates: { canonical: 'https://crownpointenergy.com/esg' },
}

const SUPABASE_POLITICA =
  'https://zmxlykfvbuadsuqjppqr.supabase.co/storage/v1/object/public/documents/politica'

function politicaKey(title: string) {
  const key = title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  if (key === 'politica de sas' || key === 'politica de seguridad, ambiente y salud') return 'politica-sas'
  return key
}

function presentPolitica(es: string, en: string) {
  if (politicaKey(es) === 'politica-sas') {
    return {
      es: 'Política de seguridad, ambiente y salud',
      en: 'Safety, environment and health policy',
    }
  }
  return { es, en: en || es }
}

const FALLBACK_DOCS = [
  {
    id: 'consumo',
    es: 'Política de prevención de consumo',
    en: 'Substance use prevention policy',
    href: `${SUPABASE_POLITICA}/1784752745757-POLITICA_de_prevencion_de_consumo_.pdf`,
    tag: 'PDF' as const,
  },
  {
    id: 'sas',
    es: 'Política de seguridad, ambiente y salud',
    en: 'Safety, environment and health policy',
    href: `${SUPABASE_POLITICA}/1784752815320-POLITICA_DE_SAS_.pdf`,
    tag: 'PDF' as const,
  },
  {
    id: 'detencion',
    es: 'Política de detención de tareas',
    en: 'Stop-work policy',
    href: `${SUPABASE_POLITICA}/1784752872437-POLITICA_detencion_de_tareas.pdf`,
    tag: 'PDF' as const,
  },
  {
    id: 'anti',
    es: 'Política anticorrupción',
    en: 'Anti-corruption policy',
    href: '/biblioteca?cat=gobierno-corporativo',
    tag: 'PDF' as const,
  },
  {
    id: 'codigo',
    es: 'Código de conducta y ética empresarial',
    en: 'Code of conduct & business ethics',
    href: '/biblioteca?cat=gobierno-corporativo',
    tag: 'PDF' as const,
  },
  {
    id: 'insider',
    es: 'Política de uso de información privilegiada',
    en: 'Insider trading policy',
    href: '/biblioteca?cat=gobierno-corporativo',
    tag: 'PDF' as const,
  },
  {
    id: 'whistle',
    es: 'Política de denuncia de irregularidades',
    en: 'Whistleblower policy',
    href: '/biblioteca?cat=gobierno-corporativo',
    tag: 'PDF' as const,
  },
  {
    id: 'form',
    es: 'Formulario de denuncias e irregularidades',
    en: 'Reporting form',
    href: '/denuncias',
    tag: 'FORMULARIO' as const,
  },
]

export default async function EsgPage() {
  const db = createSupabaseServerAdminClient()
  const [s, politicasRes] = await Promise.all([
    getCmsState(),
    db
      .from('documentos')
      .select('id,titulo_es,titulo_en,storage_path,file_name')
      .eq('tipo', 'politica')
      .eq('publico', true)
      .order('titulo_es'),
  ])
  const politicas = (politicasRes.data ?? []) as PoliticaDoc[]
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const politicaTitles = new Set(politicas.map(p => politicaKey(p.titulo_es)).filter(Boolean))
  const fallbackDocs = FALLBACK_DOCS.filter(doc => !politicaTitles.has(politicaKey(doc.es)))

  const f = s.fields
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const ethicsPhone = f['contact.ethics.phone'] || '+54 9 11 5263-0361'
  const ethicsEmail = f['contact.ethics.email'] || 'etica@crownpointenergy.com'
  /* Hero Figma = oil-rig; la fauna va en la sección inferior */
  const heroSrc = '/esg/hero-rig.webp'

  return (
    <div className="esg-page">
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      <section className="hero esg-hero" aria-labelledby="esg-heading">
        <div className="esg-hero-media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroSrc} alt="" fetchPriority="high" />
          <div className="esg-hero-veil" />
        </div>
        <div className="container esg-hero-content">
          <p className="esg-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Responsabilidad corporativa</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Corporate responsibility</span>
          </p>
          <h1 id="esg-heading" className="esg-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Un compromiso
              <br />
              compartido con las personas
              <br />
              y el medioambiente
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              A shared
              <br />
              commitment to people
              <br />
              and the environment
            </span>
          </h1>
          <p className="esg-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Integramos el cuidado del ambiente, la seguridad de las personas y el desarrollo de las comunidades a
              nuestra forma de trabajar, con una mirada puesta en el largo plazo.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              We integrate environmental care, people&apos;s safety and community development into how we work, with a
              long-term view.
            </span>
          </p>
        </div>
      </section>

      <section className="esg-gov" aria-labelledby="esg-gov-heading">
        <div className="container">
          <div className="esg-gov-grid">
            <div>
              <h2 id="esg-gov-heading" className="esg-gov-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Gobierno corporativo</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Corporate governance</span>
              </h2>
              <ul className="esg-docs">
                {politicas.map(doc => {
                  const href = `${supabaseUrl}/storage/v1/object/public/documents/${doc.storage_path}`
                  const title = presentPolitica(doc.titulo_es, doc.titulo_en)
                  return (
                    <li key={doc.id}>
                      <a className="esg-doc" href={href} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/esg/doc-icon.svg" alt="" width={17} height={22} />
                        <span>
                          <span className="lang-es" aria-hidden={lang !== 'es'}>{title.es}</span>
                          <span className="lang-en" aria-hidden={lang !== 'en'}>
                            {title.en}
                          </span>
                        </span>
                        <span className="esg-doc-tag">PDF</span>
                      </a>
                    </li>
                  )
                })}
                {fallbackDocs.map(doc => {
                  const external = doc.href.startsWith('http')
                  const content = (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/esg/doc-icon.svg" alt="" width={17} height={22} />
                      <span>
                        <span className="lang-es" aria-hidden={lang !== 'es'}>{doc.es}</span>
                        <span className="lang-en" aria-hidden={lang !== 'en'}>{doc.en}</span>
                      </span>
                      <span className="esg-doc-tag">{doc.tag}</span>
                    </>
                  )
                  return (
                    <li key={doc.id}>
                      {external ? (
                        <a className="esg-doc" href={doc.href} target="_blank" rel="noreferrer">
                          {content}
                        </a>
                      ) : (
                        <Link className="esg-doc" href={doc.href}>
                          {content}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <aside className="esg-ethics">
              <div className="esg-ethics-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/esg/ethics-shield.svg" alt="" width={50} height={61} />
              </div>
              <h3 className="esg-ethics-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Línea ética</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Ethics hotline</span>
              </h3>
              <p className="esg-ethics-body">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Canal confidencial para reportar conductas contrarias al Código de Ética. Las denuncias pueden
                  realizarse de forma anónima. Todas son tratadas con absoluta reserva.
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Confidential channel to report conduct contrary to the Code of Ethics. Reports may be submitted
                  anonymously. All are handled with complete confidentiality.
                </span>
              </p>
              <Link href="/denuncias" className="esg-ethics-cta">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/esg/arrow.svg" alt="" width={29} height={15} />
                <span className="lang-es" aria-hidden={lang !== 'es'}>Hacer una denuncia</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>File a report</span>
              </Link>
              <p className="esg-ethics-meta">
                <a href={`tel:${ethicsPhone.replace(/\s/g, '')}`}>{ethicsPhone}</a>
                <br />
                <a href={`mailto:${ethicsEmail}`}>{ethicsEmail}</a>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="esg-photo" aria-label={lang === 'es' ? 'Compromiso ambiental' : 'Environmental commitment'}>
        <div className="container">
          <div className="esg-photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/esg/wildlife.webp"
              alt={
                lang === 'es'
                  ? 'Fauna patagónica en el entorno de nuestras operaciones'
                  : 'Patagonian wildlife in the areas where we operate'
              }
              width={1600}
              height={1067}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
