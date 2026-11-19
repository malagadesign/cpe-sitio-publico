import Link from 'next/link'
import Image from 'next/image'
import { getCmsState } from '@/lib/cms'
import { getEffectiveLang } from '@/lib/lang'
import ArgentinaMap from '@/components/ArgentinaMap'
import { sumWellsFromBlocks, fetchOperationsBlocks } from '@/lib/content-fetch'
import BasinsCard from '@/components/BasinsCard'

export const revalidate = 60

export default async function HomePage() {
  const [s, opsBlocksFull] = await Promise.all([
    getCmsState(),
    fetchOperationsBlocks(),
  ])

  const wells = sumWellsFromBlocks(opsBlocksFull)
  const lang = getEffectiveLang(s.lang as 'es' | 'en')
  const f = s.fields
  const show = s.show

  const heroImg = f['hero.home.img'] || '/home/hero.png'
  const heroTitleEs = f['hero.title.es'] || ''
  const heroTitleEn = f['hero.title.en'] || ''
  const heroLedeEs = f['hero.lede.es'] || ''
  const heroLedeEn = f['hero.lede.en'] || ''
  const heroSubEs = f['hero.sub.es'] || 'Desarrollo que trasciende'
  const heroSubEn = f['hero.sub.en'] || 'Development that transcends'

  const stats = [
    { val: f['stats.anios'] || '25+', es: 'años en upstream arg.', en: 'yrs Argentine upstream' },
    { val: f['stats.ha'] || '372k', es: 'hectáreas operadas', en: 'operated hectares' },
    { val: f['stats.cuencas'] || '3', es: 'cuencas de interés', en: 'basins of interest' },
    { val: String(wells.activos || f['stats.pozos'] || '706'), es: 'pozos productivos', en: 'producing wells' },
    { val: String(wells.inyectores || f['stats.inyectores'] || '235'), es: 'pozos inyectores', en: 'injection wells' },
  ]

  return (
    <>
      {show['hero'] !== false && (
        <section className="hero" data-cpe-section="hero">
          <div className="hero-media">
            <Image
              src={heroImg}
              alt={f['hero.home.img.alt'] || 'Operaciones Crown Point Energía'}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-veil" />
          </div>
          <div className="container hero-content">
            <h1 className="hero-title">
              {heroTitleEs
                ? <span className="lang-es" aria-hidden={lang !== 'es'}>{heroTitleEs}</span>
                : (
                  <span className="lang-es" aria-hidden={lang !== 'es'}>
                    Energía que sostiene la matriz productiva Argentina
                  </span>
                )}
              {heroTitleEn
                ? <span className="lang-en" aria-hidden={lang !== 'en'}>{heroTitleEn}</span>
                : (
                  <span className="lang-en" aria-hidden={lang !== 'en'}>
                    Energy that sustains Argentina&apos;s productive matrix
                  </span>
                )}
            </h1>
            <p className="hero-subtitle">
              <span className="lang-es" aria-hidden={lang !== 'es'}>{heroSubEs}</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>{heroSubEn}</span>
            </p>
            <p className="hero-lede">
              {heroLedeEs
                ? <span className="lang-es" aria-hidden={lang !== 'es'}>{heroLedeEs}</span>
                : (
                  <span className="lang-es" aria-hidden={lang !== 'es'}>
                    Producimos gas y petróleo en tres de las cuencas más importantes de la Argentina con una gestión pensada para el largo plazo.
                  </span>
                )}
              {heroLedeEn
                ? <span className="lang-en" aria-hidden={lang !== 'en'}>{heroLedeEn}</span>
                : (
                  <span className="lang-en" aria-hidden={lang !== 'en'}>
                    We produce gas and oil in three of Argentina&apos;s most important basins with a long-term management approach.
                  </span>
                )}
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary btn-hero-cta" href="#mapa">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Dónde estamos</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Where we operate</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {show['basinsStrip'] !== false && (
        <BasinsCard lang={lang} imageSrc="/home/basins-photo.jpg" />
      )}

      <section className="nums-strip nums-strip--figma" aria-label="Crown Point Energía en números">
        <div className="container">
          <div className="nums-grid">
            {stats.map(item => (
              <div className="nums-item" key={item.es}>
                <span className="nums-val num">{item.val}</span>
                <span className="nums-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>{item.es}</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>{item.en}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {show['ops'] !== false && (
        <section className="scale-map-section" id="mapa" data-cpe-section="ops">
          <div className="container">
            <div className="scale-map-card">
              <div className="scale-map-copy">
                <h2 className="scale-map-title">
                  <span className="scale-map-title-line">
                    <span className="scale-map-title-cap">W</span>ork
                  </span>
                  <span className="scale-map-title-line">in interest</span>
                </h2>
              </div>
              <div className="scale-map-visual">
                <ArgentinaMap />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
