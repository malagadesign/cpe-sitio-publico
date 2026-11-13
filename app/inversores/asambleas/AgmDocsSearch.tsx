'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

export type AgmDoc = {
  id: string
  title: string
  url: string
}

export default function AgmDocsSearch({ docs, lang }: { docs: AgmDoc[]; lang: 'es' | 'en' }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return docs
    return docs.filter(d => d.title.toLowerCase().includes(needle))
  }, [docs, q])

  return (
    <div className="asm-panel">
      <div className="asm-search">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar por título, período o tipo...' : 'Search by title, period or type...'}
          aria-label={lang === 'es' ? 'Buscar materiales de asamblea' : 'Search meeting materials'}
        />
        <svg className="asm-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <p className="asm-count" aria-live="polite">
        {filtered.length}{' '}
        <span className="lang-es" aria-hidden={lang !== 'es'}>
          {filtered.length === 1 ? 'resultado' : 'resultados'}
        </span>
        <span className="lang-en" aria-hidden={lang !== 'en'}>
          {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </p>

      {filtered.length === 0 ? (
        <p className="asm-empty">
          <span className="lang-es" aria-hidden={lang !== 'es'}>Sin resultados</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>No results</span>
        </p>
      ) : (
        <ul className="asm-list">
          {filtered.map(doc => (
            <li key={doc.id} className="asm-row">
              <Image
                src="/inversores/asambleas/doc-icon.svg"
                alt=""
                width={18}
                height={22}
                className="asm-row-icon"
                unoptimized
              />
              <p className="asm-row-title">{doc.title}</p>
              <a
                className="asm-row-dl"
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/inversores/asambleas/download-icon.svg"
                  alt=""
                  width={13}
                  height={16}
                  unoptimized
                />
                <span className="lang-es" aria-hidden={lang !== 'es'}>Descargar</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Download</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
