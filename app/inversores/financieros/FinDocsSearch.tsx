'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

export type FinDoc = {
  id: string
  title: string
  periodo: string
  entidad: string
  url: string
}

export default function FinDocsSearch({ docs, lang }: { docs: FinDoc[]; lang: 'es' | 'en' }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return docs
    return docs.filter(d =>
      `${d.title} ${d.periodo} ${d.entidad}`.toLowerCase().includes(needle)
    )
  }, [docs, q])

  return (
    <div className="fin-panel">
      <div className="fin-search">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar por título, período o tipo...' : 'Search by title, period or type...'}
          aria-label={lang === 'es' ? 'Buscar estados financieros' : 'Search financial statements'}
        />
        <svg className="fin-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <p className="fin-count" aria-live="polite">
        {filtered.length}{' '}
        <span className="lang-es" aria-hidden={lang !== 'es'}>
          {filtered.length === 1 ? 'resultado' : 'resultados'}
        </span>
        <span className="lang-en" aria-hidden={lang !== 'en'}>
          {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </p>

      {filtered.length === 0 ? (
        <p className="fin-empty">
          <span className="lang-es" aria-hidden={lang !== 'es'}>Sin resultados</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>No results</span>
        </p>
      ) : (
        <ul className="fin-list">
          {filtered.map(doc => (
            <li key={doc.id} className="fin-row">
              <Image
                src="/inversores/financieros/doc-icon.svg"
                alt=""
                width={18}
                height={22}
                className="fin-row-icon"
                unoptimized
              />
              <div className="fin-row-main">
                <p className="fin-row-title">{doc.title}</p>
                <p className="fin-row-sub">{doc.periodo}</p>
              </div>
              <p className="fin-row-meta fin-row-meta--entidad">{doc.entidad}</p>
              <p className="fin-row-meta fin-row-meta--fecha">{doc.periodo}</p>
              <a
                className="fin-row-dl"
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/inversores/financieros/download-icon.svg"
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
