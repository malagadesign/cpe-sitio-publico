'use client'

import { useMemo, useState } from 'react'

export type SearchDoc = {
  id: string
  title: string
  periodo: string
  entidad: string
  url: string
}

export function OnDocsSearch({ docs, lang }: { docs: SearchDoc[]; lang: 'es' | 'en' }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return docs.slice(0, 3)
    return docs.filter(d =>
      `${d.title} ${d.periodo} ${d.entidad}`.toLowerCase().includes(needle)
    ).slice(0, 8)
  }, [docs, q])

  return (
    <div className="rep-on-search">
      <div className="rep-search-bar">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar por título, período o tipo...' : 'Search by title, period or type...'}
          aria-label={lang === 'es' ? 'Buscar documentos ON' : 'Search notes documents'}
        />
        <SearchIcon />
      </div>
      <p className="rep-search-count">
        {filtered.length}{' '}
        <span className="lang-es" aria-hidden={lang !== 'es'}>
          {filtered.length === 1 ? 'resultado' : 'resultados'}
        </span>
        <span className="lang-en" aria-hidden={lang !== 'en'}>
          {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </p>
      {filtered.map(d => (
        <div key={d.id} className="rep-doc-row" style={{ marginBottom: 12 }}>
          <div>
            <strong>{d.title}</strong>
            <span style={{ display: 'block', marginTop: 4, opacity: 0.85 }}>{d.periodo}</span>
          </div>
          <span>{d.entidad}</span>
          <span>{d.periodo}</span>
          <a className="rep-doc-dl" href={d.url} target="_blank" rel="noopener noreferrer">
            <DownloadIcon />
            <span className="lang-es" aria-hidden={lang !== 'es'}>Descargar</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Download</span>
          </a>
        </div>
      ))}
    </div>
  )
}

export function EstmaSearch({ docs, lang }: { docs: SearchDoc[]; lang: 'es' | 'en' }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return docs
    return docs.filter(d => d.title.toLowerCase().includes(needle) || d.periodo.toLowerCase().includes(needle))
  }, [docs, q])

  return (
    <div className="rep-estma-box">
      <div className="rep-search-bar">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar por título o año...' : 'Search by title or year...'}
          aria-label={lang === 'es' ? 'Buscar reportes ESTMA' : 'Search ESTMA reports'}
        />
        <SearchIcon dark />
      </div>
      <ul className="rep-estma-list">
        {filtered.map(d => (
          <li key={d.id} className="rep-estma-item">
            <div className="rep-estma-item-title">
              <FileIcon />
              <span>{d.title}</span>
            </div>
            <a className="rep-estma-dl" href={d.url} target="_blank" rel="noopener noreferrer">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Descargar</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Download</span>
              <UploadIcon />
            </a>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ padding: '12px 4px', color: 'var(--cp-navy-deep)', opacity: 0.7 }}>
            <span className="lang-es" aria-hidden={lang !== 'es'}>Sin resultados</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>No results</span>
          </li>
        )}
      </ul>
    </div>
  )
}

function SearchIcon({ dark }: { dark?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke={dark ? '#0d1237' : '#0d1237'} strokeWidth="1.6" />
      <path d="M16.5 16.5L21 21" stroke={dark ? '#0d1237' : '#0d1237'} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
      <path d="M7 1v10M3 8l4 4 4-4M1 15h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
      <path d="M7 15V5M3 8l4-4 4 4M1 1h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
      <path d="M13 1H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-7-7Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 1v7h7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
