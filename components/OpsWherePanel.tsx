'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ArgentinaMap from '@/components/ArgentinaMap'
import type { BlockPhoto, OperationsBlock } from '@/lib/content-fetch'

const EXPLORACION = new Set(['cerro'])

/** Figma trata Chañares + PPC como una sola card. */
const MAP_TO_CARD: Record<string, string> = {
  ppc: 'chanares',
  chanares: 'chanares',
  tordillo: 'tordillo',
  piedra: 'piedra',
  cerro: 'cerro',
}

/** Figma bottom photos per selección (Operaciones variants). */
const FALLBACK_PHOTOS: Record<string, string> = {
  tordillo: '/operaciones/block-tordillo.webp',
  piedra: '/operaciones/block-piedra.webp',
  chanares: '/operaciones/block-chanares.webp',
  cerro: '/operaciones/block-cerro.webp',
}

function highlightBlocks(activeId: string | null): string[] {
  if (activeId === 'chanares') return ['chanares', 'ppc']
  if (!activeId) return []
  return [activeId]
}

export default function OpsWherePanel({
  blocks,
  lang,
  photosBySlug = {},
}: {
  blocks: OperationsBlock[]
  lang: 'es' | 'en'
  photosBySlug?: Record<string, BlockPhoto[]>
}) {
  const cardBlocks = useMemo(
    () => blocks.filter(b => b.slug !== 'ppc'),
    [blocks],
  )
  const defaultId =
    cardBlocks.find(b => b.slug === 'tordillo')?.slug ?? cardBlocks[0]?.slug ?? null
  const [activeId, setActiveId] = useState<string | null>(defaultId)

  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const mapped = MAP_TO_CARD[hash] ?? hash
      if (cardBlocks.some(b => b.slug === mapped)) setActiveId(mapped)
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [cardBlocks])

  const active = useMemo(
    () => cardBlocks.find(b => b.slug === activeId) ?? cardBlocks[0] ?? null,
    [cardBlocks, activeId],
  )

  function selectBlock(mapId: string) {
    const cardId = MAP_TO_CARD[mapId] ?? mapId
    if (!cardBlocks.some(b => b.slug === cardId)) return
    setActiveId(cardId)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${cardId}`)
    }
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const el = (e.target as Element).closest('[data-block]')
    const id = el?.getAttribute('data-block')
    if (id) selectBlock(id)
  }

  const isExploracion = active ? EXPLORACION.has(active.slug) : false
  const titleLines = (active?.titulo ?? '')
    .split(/[·•–—|/]+/)
    .map(s => s.trim())
    .filter(Boolean)
  const chips = Array.isArray(active?.chips)
    ? active!.chips
    : typeof active?.chips === 'string'
      ? (() => {
          try {
            return JSON.parse(active!.chips as unknown as string) as string[]
          } catch {
            return []
          }
        })()
      : []

  const slug = active?.slug ?? 'tordillo'
  const cmsPhoto = photosBySlug[slug]?.[0]
  const photoSrc = cmsPhoto?.url || FALLBACK_PHOTOS[slug] || FALLBACK_PHOTOS.tordillo
  const photoAlt =
    cmsPhoto?.alt ||
    (lang === 'es'
      ? `Vista del yacimiento ${active?.titulo ?? ''}`
      : `View of the ${active?.titulo ?? ''} field`)

  const activeMapBlocks = highlightBlocks(activeId)
  const hi = activeMapBlocks.length
    ? `:is(${activeMapBlocks.map(id => `.ops-map-visual [data-block="${id}"]`).join(', ')})`
    : '.ops-map-visual [data-block="__none__"]'

  return (
    <div className="ops-where-grid">
      <div>
        <p className="ops-where-result">
          <span className="lang-es" aria-hidden={lang !== 'es'}>1 resultado</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>1 result</span>
        </p>
        {active && (
          <article className="ops-card" id={active.slug} aria-live="polite">
            <div className="ops-card-tags">
              <p className="ops-card-tag">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  {isExploracion ? 'Áreas exploratorias' : 'Áreas productivas'}
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  {isExploracion ? 'Exploration areas' : 'Producing areas'}
                </span>
              </p>
              <p className="ops-card-tag ops-card-tag--accent">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  {isExploracion ? 'Exploración' : 'Explotación'}
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  {isExploracion ? 'Exploration' : 'Production'}
                </span>
              </p>
            </div>

            <p className="ops-card-eyebrow">{active.eyebrow}</p>
            <h3 className="ops-card-title">
              {titleLines.length > 1
                ? titleLines.map((line, i) => (
                    <span key={i} style={{ display: 'block' }}>{line}</span>
                  ))
                : active.titulo}
            </h3>

            <p className="ops-card-lede">
              <span className="lang-es" aria-hidden={lang !== 'es'}>{active.lede_es}</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>{active.lede_en}</span>
            </p>

            {chips.length > 0 && (
              <div className="ops-card-chips">
                {chips.map((chip, i) => (
                  <span className="ops-card-chip" key={i}>{chip}</span>
                ))}
              </div>
            )}

            <p className="ops-card-body-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                {active.card_title_es || (isExploracion ? 'Detalle del bloque' : 'Producción consolidada')}
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                {active.card_title_en || (isExploracion ? 'Block detail' : 'Consolidated production')}
              </span>
            </p>
            <div className="ops-card-body">
              {(lang === 'es' ? (active.body_es ?? []) : (active.body_en ?? [])).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {(active.stats ?? []).length > 0 && (
              <>
                <hr className="ops-card-divider" />
                <ul className="ops-card-stats">
                  {(active.stats ?? []).map((stat, i) => (
                    <li key={i}>
                      <span className="label">
                        <span className="lang-es" aria-hidden={lang !== 'es'}>{stat.label_es}</span>
                        <span className="lang-en" aria-hidden={lang !== 'en'}>{stat.label_en}</span>
                      </span>
                      {': '}
                      <span>{stat.val}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        )}
      </div>

      <div className="ops-map-col">
        <div
          className="ops-map-visual"
          onClick={handleMapClick}
          role="group"
          aria-label={lang === 'es' ? 'Mapa de yacimientos' : 'Field map'}
        >
          <style>{`
            ${hi} .ar-dot {
              filter: brightness(1.2);
              stroke: #ceef7b;
              stroke-width: 2;
            }
            ${hi} .ar-callout-frame {
              opacity: 1;
            }
            ${hi} .ar-label,
            ${hi} .ar-label--stack {
              text-decoration: underline;
              text-underline-offset: 3px;
              text-decoration-color: #ceef7b;
            }
          `}</style>
          <ArgentinaMap />
        </div>
        <div className="ops-map-photo">
          <Image
            key={photoSrc}
            src={photoSrc}
            alt={photoAlt}
            fill
            sizes="(max-width: 1100px) 100vw, 624px"
            className="ops-map-photo-img"
          />
        </div>
      </div>
    </div>
  )
}
