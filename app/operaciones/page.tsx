import Image from 'next/image'
import { getCmsState } from '@/lib/cms'
import { fetchBlockPhotosBySlug, fetchOperationsBlocks, sumWellsFromBlocks } from '@/lib/content-fetch'
import { OPS_BLOCKS_FALLBACK } from '@/lib/ops-blocks-fallback'
import { getEffectiveLang } from '@/lib/lang'
import { PRODUCTION_1Q2026, productionMixRatio } from '@/lib/production'
import OpsWherePanel from '@/components/OpsWherePanel'

export const revalidate = 60

export const metadata = {
  title: 'Operaciones | Crown Point Energy',
  description: 'Ocho concesiones en tres cuencas. Explotación y exploración de gas natural y crudo liviano en Argentina.',
  alternates: { canonical: 'https://crownpointenergy.com/operaciones' },
}

export default async function OperacionesPage() {
  const [s, fetchedBlocks, photosBySlug] = await Promise.all([
    getCmsState(),
    fetchOperationsBlocks(),
    fetchBlockPhotosBySlug(),
  ])
  const allBlocks = fetchedBlocks.length > 0 ? fetchedBlocks : OPS_BLOCKS_FALLBACK

  const wells = sumWellsFromBlocks(fetchedBlocks)
  const f = s.fields
  const fe = s.fieldsEn
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const heroImg = f['hero.operaciones.img'] || '/operaciones/hero.webp'

  const kpis = [
    {
      labelEs: 'Operación',
      labelEn: 'Operations',
      val: f['ops.kpi.acreage'] || '372k',
      unitEs: 'hectáreas',
      unitEn: 'hectares',
      metaEs: `${f['kpi.blocks.value'] || '8'} concesiones`,
      metaEn: `${f['kpi.blocks.value'] || '8'} concessions`,
    },
    {
      labelEs: 'Pozos productores',
      labelEn: 'Producing wells',
      val: String(wells.activos || 706),
      unitEs: 'activos',
      unitEn: 'active',
      metaEs: `+${wells.inyectores || 235} inyectores en operación`,
      metaEn: `+${wells.inyectores || 235} injectors in operation`,
    },
    {
      labelEs: 'Producción promedio',
      labelEn: 'Average production',
      val: f['ops.kpi.production'] || PRODUCTION_1Q2026.avgBoePerDay,
      unitEs: PRODUCTION_1Q2026.unit,
      unitEn: PRODUCTION_1Q2026.unit,
      metaEs: f['ops.kpi.production.meta'] || `Producción · Q1 2026`,
      metaEn: fe['ops.kpi.production.meta'] || `Production · Q1 2026`,
    },
    {
      labelEs: 'Mix producción',
      labelEn: 'Production mix',
      val: f['ops.kpi.mix'] || productionMixRatio(),
      unitEs: 'gas / petróleo',
      unitEn: 'gas / oil',
      metaEs: 'Balance gas/petróleo',
      metaEn: 'Gas/oil balance',
    },
  ]

  return (
    <div className="ops-page">
      <section className="hero ops-hero" data-cpe-section="hero">
        <div className="ops-hero-media">
          <Image
            src={heroImg}
            alt={lang === 'es' ? 'Yacimiento y operaciones de Crown Point Energía en Argentina' : 'Crown Point oilfield operations in Argentina'}
            fill
            priority
            className="ops-hero-img"
            sizes="100vw"
          />
          <div className="ops-hero-veil" />
        </div>
        <div className="container ops-hero-content">
          <p className="ops-hero-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Escala</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Scale</span>
          </p>
          <h1 className="ops-hero-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Ocho concesiones en tres cuencas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Eight concessions across three basins</span>
          </h1>
          <p className="ops-hero-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              {f['page.operaciones.lede'] ||
                'Explotaciones y exploraciones de gas natural y crudo liviano en áreas estratégicas de la región centro y sur de Argentina.'}
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              {fe['page.operaciones.lede'] ||
                'Natural gas and light crude production and exploration in strategic areas of central and southern Argentina.'}
            </span>
          </p>
        </div>
      </section>

      <section className="ops-kpis" data-cpe-section="kpis">
        <div className="container">
          <div className="ops-kpi-grid">
            {kpis.map((k, i) => (
              <div className="ops-kpi" key={i}>
                <p className="ops-kpi-label">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>{k.labelEs}</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>{k.labelEn}</span>
                </p>
                <p className="ops-kpi-value">{k.val}</p>
                <p className="ops-kpi-unit">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>{k.unitEs}</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>{k.unitEn}</span>
                </p>
                <p className="ops-kpi-meta">
                  <span className="lang-es" aria-hidden={lang !== 'es'}>{k.metaEs}</span>
                  <span className="lang-en" aria-hidden={lang !== 'en'}>{k.metaEn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ops-where" id="mapa" data-cpe-section="mapa">
        <div className="container">
          <div className="ops-where-frame">
            <h2 className="ops-where-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Dónde estamos</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Where we are</span>
            </h2>
            <p className="ops-where-hint">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Haz clic sobre los yacimientos para más información.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Click the fields for more information.
              </span>
            </p>
            <OpsWherePanel blocks={allBlocks} lang={lang} photosBySlug={photosBySlug} />
          </div>
        </div>
      </section>
    </div>
  )
}
