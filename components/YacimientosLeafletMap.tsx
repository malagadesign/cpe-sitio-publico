'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { YacimientoPin } from '@/lib/block-coords'

export type { YacimientoPin }

const COMMODITY_COLOR: Record<YacimientoPin['commodity'], string> = {
  oil:   '#1F2566',
  gas:   '#4a8a3a',
  mixed: '#6CAE52',
}

function divIcon(L: typeof import('leaflet'), color: string) {
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.9 14 22 14 22s14-12.1 14-22C28 6.27 21.73 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5.5" fill="white" opacity="0.9"/>
  </svg>`
  return L.divIcon({ className: '', html, iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -38] })
}

export default function YacimientosLeafletMap({ pins, height = 520 }: { pins: YacimientoPin[]; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinsRef = useRef(pins)
  pinsRef.current = pins
  const pinsKey = pins.map(p => `${p.id}:${p.lat}:${p.lon}:${p.commodity}:${p.title}:${p.subtitle}`).join('|')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const mapEl: HTMLElement = container

    let cancelled = false
    let map: import('leaflet').Map | null = null

    async function init() {
      const L = (await import('leaflet')).default
      if (cancelled) return

      // Prevent Leaflet from trying to load default marker PNGs (breaks in webpack)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      // React Strict Mode runs this effect twice. The first init is async, so
      // its cleanup can run before Leaflet tags the node — and the second
      // L.map() then throws "Map container is already initialized".
      const tagged = mapEl as HTMLElement & { _leaflet_id?: number }
      if (tagged._leaflet_id != null) {
        tagged.replaceChildren()
        delete tagged._leaflet_id
      }

      map = L.map(mapEl, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      })
      if (cancelled) {
        map.remove()
        map = null
        return
      }

      // Remove "Leaflet" branding link — keep OSM credit
      map.attributionControl.setPrefix(false)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      const bounds: [number, number][] = []

      for (const pin of pinsRef.current) {
        const icon = divIcon(L, COMMODITY_COLOR[pin.commodity])
        const marker = L.marker([pin.lat, pin.lon], { icon }).addTo(map)
        marker.bindPopup(
          `<div style="font-family:system-ui,sans-serif;min-width:160px">
            <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:3px">${pin.subtitle}</div>
            <div style="font-size:14px;font-weight:600;color:#111;line-height:1.3">${pin.title}</div>
          </div>`,
          { maxWidth: 260 }
        )
        bounds.push([pin.lat, pin.lon])
      }

      if (bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds as [number, number][]), { padding: [40, 40] })
      } else {
        // Default: show all Argentina
        map.setView([-40, -65], 4)
      }

      // Re-check container size after layout settles (sticky/grid parents can defer sizing)
      const settled = map
      setTimeout(() => {
        if (!cancelled) settled.invalidateSize()
      }, 150)
    }

    init()

    return () => {
      cancelled = true
      map?.remove()
      map = null
      const tagged = container as HTMLElement & { _leaflet_id?: number }
      if (tagged._leaflet_id != null) delete tagged._leaflet_id
    }
  }, [pinsKey])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: 'var(--r-lg)', overflow: 'hidden', zIndex: 0 }}
    />
  )
}
