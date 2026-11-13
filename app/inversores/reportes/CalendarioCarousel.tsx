'use client'

import { useMemo, useState } from 'react'

export type CalEvent = {
  id: string
  fecha: string
  tipo: string
  titulo: string
  nota: string
}

export default function CalendarioCarousel({
  events,
  lang,
}: {
  events: CalEvent[]
  lang: 'es' | 'en'
}) {
  const [index, setIndex] = useState(0)
  const maxStart = Math.max(0, events.length - 1)

  const visible = useMemo(() => {
    if (events.length === 0) return []
    const out: CalEvent[] = []
    for (let i = 0; i < 3; i++) {
      const ev = events[index + i]
      if (ev) out.push(ev)
    }
    return out
  }, [events, index])

  function tipoLabel(tipo: string) {
    if (tipo === 'agm') return lang === 'es' ? 'Asamblea' : 'Meeting'
    if (tipo === 'other') return lang === 'es' ? 'Evento' : 'Event'
    return lang === 'es' ? 'Resultados' : 'Results'
  }

  const pages = Math.max(1, events.length)

  return (
    <>
      <div className="rep-cal-track-wrap">
        <button
          type="button"
          className="rep-cal-nav"
          aria-label={lang === 'es' ? 'Anterior' : 'Previous'}
          disabled={index <= 0}
          onClick={() => setIndex(i => Math.max(0, i - 1))}
        >
          <Arrow dir="left" />
        </button>

        <div className="rep-cal-track">
          {visible.map((ev, i) => (
            <article key={ev.id} className={`rep-cal-card${i === 0 ? ' is-visible' : ''}`}>
              <div className="rep-cal-pill">{tipoLabel(ev.tipo)}</div>
              <p>{ev.fecha}</p>
              <p>{ev.titulo}</p>
              <p>{ev.nota}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="rep-cal-nav"
          aria-label={lang === 'es' ? 'Siguiente' : 'Next'}
          disabled={index >= maxStart}
          onClick={() => setIndex(i => Math.min(maxStart, i + 1))}
        >
          <Arrow dir="right" />
        </button>
      </div>

      <div className="rep-cal-dots" role="tablist" aria-label={lang === 'es' ? 'Eventos del calendario' : 'Calendar events'}>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`rep-cal-dot${i === index ? ' is-active' : ''}`}
            aria-label={`${lang === 'es' ? 'Evento' : 'Event'} ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  )
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden
      style={{ transform: dir === 'right' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M17 6H2M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
