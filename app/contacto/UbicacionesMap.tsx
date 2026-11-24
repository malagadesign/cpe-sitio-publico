'use client'

import { useState } from 'react'

const LOCATIONS = [
  {
    id: 'sede',
    name: 'Sede',
    address: 'Godoy Cruz 2769, Piso 4, C1425FQK, Ciudad Autónoma de Buenos Aires, AR',
    mapsQuery: 'Godoy+Cruz+2769+Buenos+Aires+Argentina',
  },
  {
    id: 'koluel',
    name: 'Unidad de Gestión Golfo San Jorge (Koluel Kaike – Distrito IV)',
    address: 'Ruta Provincial 43, km 87,6, Santa Cruz, AR',
    mapsQuery: 'Ruta+Provincial+43+km+87.6+Koluel+Kaike+Santa+Cruz+Argentina',
  },
  {
    id: 'piedra',
    name: 'Unidad de Gestión Golfo San Jorge (Piedra Clavada)',
    address: 'Ruta Provincial 43, km 102, Santa Cruz, AR',
    mapsQuery: 'Ruta+Provincial+43+km+102+Piedra+Clavada+Santa+Cruz+Argentina',
  },
  {
    id: 'tordillo',
    name: 'Yacimiento El Tordillo',
    address: 'Ruta Nacional 26, km 11 desvío El Tordillo, Comodoro Rivadavia, Chubut U9000, AR',
    mapsQuery: 'Ruta+Nacional+26+km+11+desvio+El+Tordillo+Comodoro+Rivadavia+Chubut+Argentina',
  },
  {
    id: 'calgary',
    name: 'Crown Point Energy Inc.',
    address: '4000, 520 – 3rd Avenue SW, Calgary, Alberta T2P 0R3, CA',
    mapsQuery: '520+3rd+Avenue+SW+Calgary+Alberta+Canada',
  },
] as const

export function UbicacionesMap({ lang }: { lang: 'es' | 'en' }) {
  const [active, setActive] = useState(0)

  return (
    <div className="con-offices-panel">
      <div className="con-loc-list" role="list">
        {LOCATIONS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            role="listitem"
            className={`con-loc-item${i === active ? ' con-loc-item--active' : ''}`}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            <span className="con-loc-inner">
              <strong className="con-loc-name">{l.name}</strong>
              <span className="con-loc-addr">{l.address}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${l.mapsQuery}`}
                target="_blank"
                rel="noreferrer noopener"
                className="con-loc-dir"
                onClick={e => e.stopPropagation()}
              >
                <span className="lang-es" aria-hidden={lang !== 'es'}>Cómo llegar</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Get directions</span>
              </a>
            </span>
          </button>
        ))}
      </div>

      <div className="con-loc-map">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/contacto/map.webp"
          alt={lang === 'es' ? 'Mapa de ubicaciones Crown Point Energía' : 'Crown Point locations map'}
        />
      </div>
    </div>
  )
}
