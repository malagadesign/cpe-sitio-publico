'use client'

import { useEffect, useState } from 'react'

type Props = { lang?: 'es' | 'en' }

function pad(n: number) { return String(n).padStart(2, '0') }

export function DroneHud({ lang = 'es' }: Props) {
  const [visible, setVisible] = useState(false)
  const [recOn, setRecOn]     = useState(true)
  const [ts, setTs]           = useState('')

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) return
    const t = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) return
    function tick() {
      const d = new Date()
      setTs(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} UTC-3`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) return
    const id = setInterval(() => setRecOn(v => !v), 900)
    return () => clearInterval(id)
  }, [])

  const isEs = lang === 'es'

  return (
    <div
      className="drone-hud"
      style={{
        position: 'absolute', inset: 0, zIndex: 2,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.2s ease',
        fontFamily: 'var(--font-mono, monospace)',
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="hud-top">
        {/* REC + time */}
        <div className="hud-cell hud-rec">
          <span className="hud-dot" style={{ opacity: recOn ? 1 : 0 }} />
          <span>REC</span>
          <span className="hud-sep">·</span>
          <span>{ts}</span>
        </div>

        {/* Center label */}
        <div className="hud-cell hud-center-top">
          <span>{isEs ? 'CUENCA GOLFO SAN JORGE' : 'SAN JORGE GULF BASIN'}</span>
          <span className="hud-sep">·</span>
          <span>{isEs ? 'PATAGONIA · ARG' : 'PATAGONIA · ARG'}</span>
        </div>

        {/* GPS + alt */}
        <div className="hud-cell hud-right">
          <span>45°51′20″S · 67°43′12″O</span>
          <span className="hud-sep">|</span>
          <span>ALT <strong>248 m</strong></span>
        </div>
      </div>

      {/* ── Corner brackets ─────────────────────────────────────── */}
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

      {/* ── Right-side telemetry ─────────────────────────────────── */}
      <div className="hud-telem">
        <div className="hud-telem-row">
          <span className="hud-telem-key">HDG</span>
          <span className="hud-telem-val">218° SW</span>
        </div>
        <div className="hud-telem-row">
          <span className="hud-telem-key">GND</span>
          <span className="hud-telem-val">0.0 m/s</span>
        </div>
        <div className="hud-telem-row">
          <span className="hud-telem-key">VERT</span>
          <span className="hud-telem-val">−0.3 m/s</span>
        </div>
        <div className="hud-telem-row">
          <span className="hud-telem-key">BATT</span>
          <span className="hud-telem-val">87%</span>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <div className="hud-bottom">
        <div className="hud-cell">
          <span className="hud-area-dot" />
          <span>{isEs ? 'Yacimiento El Tordillo · Chubut' : 'El Tordillo Field · Chubut'}</span>
        </div>
        <div className="hud-cell">
          <span>{isEs ? 'Cuencas productoras:' : 'Producing basins:'}</span>
          <span className="hud-sep">·</span>
          <span>GSJ · NEUQUINA · CUYANA</span>
        </div>
        <div className="hud-cell">
          <span>TSXV: CWV</span>
          <span className="hud-sep">|</span>
          <span className="lang-es" aria-hidden={lang !== 'es'}>Crown Point Energía S.A.</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Crown Point Energy Inc.</span>
        </div>
      </div>

    </div>
  )
}
