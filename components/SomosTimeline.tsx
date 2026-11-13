'use client'

import { useRef } from 'react'

export type TimelineEntry = {
  year: string
  es: string
  en: string
  /** Ancho útil del texto en Figma (px). Si falta, se estima por largo del copy. */
  width?: number
}

/** Anchos Figma (nodos 30:3451–3454) + estimación para el resto. */
function itemContentWidth(e: TimelineEntry): number {
  if (e.width) return e.width
  const len = Math.max(e.es.length, e.en.length)
  if (len < 40) return 185
  if (len < 90) return 280
  return 312
}

export default function SomosTimeline({
  items,
  lang,
}: {
  items: TimelineEntry[]
  lang: 'es' | 'en'
}) {
  const scroller = useRef<HTMLDivElement>(null)

  function scrollByDir(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    const amount = Math.min(360, el.clientWidth * 0.7)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className="somos-timeline-wrap">
      <button
        type="button"
        className="somos-timeline-nav"
        aria-label={lang === 'es' ? 'Anterior' : 'Previous'}
        onClick={() => scrollByDir(-1)}
      >
        <svg width="18" height="12" viewBox="0 0 29 15" fill="none" aria-hidden>
          <path d="M28 7.5H2M8 1L1.5 7.5L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="somos-timeline" ref={scroller}>
        {items.map((e, i) => (
          <article
            className="somos-timeline-item"
            key={`${e.year}-${i}`}
            style={{ ['--item-w' as string]: `${itemContentWidth(e)}px` }}
          >
            <p className="somos-timeline-year">{e.year}</p>
            <p className="somos-timeline-text">
              <span className="lang-es" aria-hidden={lang !== 'es'}>{e.es}</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>{e.en}</span>
            </p>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="somos-timeline-nav"
        aria-label={lang === 'es' ? 'Siguiente' : 'Next'}
        onClick={() => scrollByDir(1)}
      >
        <svg width="18" height="12" viewBox="0 0 29 15" fill="none" aria-hidden>
          <path d="M1 7.5H27M21 1L27.5 7.5L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
