'use client'

import { useState } from 'react'
import Image from 'next/image'

const BASINS = [
  { id: 'cuyana', num: '01', name: 'Cuyana', es: 'Cuyo, Mendoza', en: 'Cuyo, Mendoza' },
  { id: 'neuquina', num: '02', name: 'Neuquina', es: 'Mendoza Sur', en: 'Southern Mendoza' },
  { id: 'gsj', num: '03', name: 'Golfo San Jorge', es: 'Chubut, Santa Cruz', en: 'Chubut, Santa Cruz' },
] as const

export default function BasinsCard({
  lang,
  imageSrc,
}: {
  lang: 'es' | 'en'
  imageSrc: string
}) {
  const [active, setActive] = useState(0)

  return (
    <section className="basins-card-section" aria-label="Cuencas de operación" data-cpe-section="basinsStrip">
      <div className="container">
        <div className="basins-card">
          <div className="basins-card-bar">
            <span className="basins-card-label">
              <span className="lang-es" aria-hidden={lang !== 'es'}>3 cuencas clave</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>3 key basins</span>
            </span>
            <div className="basins-tabs" role="tablist" aria-label={lang === 'es' ? 'Cuencas' : 'Basins'}>
              {BASINS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  className={`basins-tab${active === i ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="basins-tab-num">{b.num}</span>
                  <span className="basins-tab-text">
                    <strong>{b.name}</strong>
                    <span className="lang-es" aria-hidden={lang !== 'es'}>{b.es}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>{b.en}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="basins-card-media">
            <Image
              src={imageSrc}
              alt={lang === 'es' ? 'Operaciones en cuencas productoras' : 'Operations across producing basins'}
              fill
              sizes="(max-width: 1200px) 100vw, 1373px"
              style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
