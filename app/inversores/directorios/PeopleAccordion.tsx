'use client'

import { useState } from 'react'

export type PersonRow = {
  id: string
  name: string
  role: string
  bio?: string
}

export default function PeopleAccordion({
  people,
  variant = 'exec',
  lang,
}: {
  people: PersonRow[]
  variant?: 'exec' | 'board'
  lang: 'es' | 'en'
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <ul className="dir-list">
      {people.map(p => {
        const open = openId === p.id
        const hasBio = Boolean(p.bio?.trim())
        return (
          <li key={p.id} className={`dir-row${variant === 'board' ? ' dir-row--board' : ''}${open ? ' is-open' : ''}`}>
            <button
              type="button"
              className="dir-row-btn"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : p.id)}
            >
              <p className="dir-row-name">{p.name}</p>
              <p className="dir-row-role">{p.role}</p>
              <span className="dir-row-more">
                <img src="/inversores/directorios/chevron.svg" alt="" width={29} height={15} />
                <span className="lang-es" aria-hidden={lang !== 'es'}>{open ? 'Ver menos' : 'Ver más'}</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>{open ? 'Show less' : 'See more'}</span>
              </span>
            </button>
            {hasBio && (
              <div className="dir-row-panel" hidden={!open}>
                <p>{p.bio}</p>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
