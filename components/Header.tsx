'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

type MenuLink = { href: string; es: string; en: string; external?: boolean }
type MenuDivider = { divider: true; es: string; en: string }
type MenuItem = MenuLink | MenuDivider
type MenuColumns = { columns: MenuLink[][] }

const NAV: {
  key: string
  href: string
  es: string
  en: string
  menu: MenuItem[] | MenuColumns | null
  cta?: boolean
}[] = [
  { key: 'somos', href: '/acerca', es: 'Somos', en: 'About', menu: null },
  {
    key: 'operaciones', href: '/operaciones', es: 'Operaciones', en: 'Operations',
    menu: {
      columns: [
        [
          { href: '/operaciones#tordillo', es: 'El Tordillo · La Tapera', en: 'El Tordillo · La Tapera' },
          { href: '/operaciones#piedra', es: 'Piedra Clavada – Koluel Kaike', en: 'Piedra Clavada – Koluel Kaike' },
          { href: '/operaciones#chanares', es: 'Chañares Herrados / PPCO', en: 'Chañares Herrados / PPCO' },
          { href: '/operaciones#cerro', es: 'Cerro de Los Leones', en: 'Cerro de Los Leones' },
        ],
      ],
    },
  },
  {
    key: 'invertir', href: '/inversores', es: 'Invertir', en: 'Invest',
    menu: {
      columns: [
        [
          { href: '/inversores/reportes', es: 'Reportes', en: 'Reports' },
          { href: '/inversores/financieros', es: 'Estados financieros', en: 'Financial statements' },
          { href: '/inversores/asambleas', es: 'Asambleas', en: 'Meetings' },
        ],
        [
          { href: '/inversores/gobierno', es: 'Gobierno corporativo', en: 'Corporate governance' },
          { href: '/inversores/directorios', es: 'Directorios', en: 'Boards' },
          { href: '/inversores/estrategia', es: 'Estrategia', en: 'Strategy' },
        ],
      ],
    },
  },
  { key: 'sustentabilidad', href: '/esg', es: 'Sustentabilidad', en: 'Sustainability', menu: null },
  { key: 'contacto', href: '/contacto', es: 'Contacto', en: 'Contact', menu: null },
]

const INGRESAR_MENU: MenuLink[] = [
  { href: '/portal', es: 'Intranet', en: 'Intranet' },
  { href: '/portal', es: 'Personal', en: 'Personnel' },
  {
    href: 'https://portal-prd-wz-jjj48h3j.launchpad.cfapps.us10.hana.ondemand.com/site?siteId=46512124-2cbc-41d8-8d70-001d6718bd39#portal-display?sap-ui-app-id-hint=saas_approuter_crown.portal',
    es: 'Portal de proveedores',
    en: 'Supplier portal',
    external: true,
  },
  { href: '/biblioteca', es: 'Virtual Room', en: 'Virtual Room' },
]

type Props = {
  fields: Record<string, string>
  show: Record<string, boolean>
  lang: 'es' | 'en'
  theme?: string
}

function isActiveHref(pathname: string, href: string) {
  // Exact path only (ignore hash siblings like /operaciones#…)
  return pathname === href.split('#')[0]
}

function SubmenuLink({
  m,
  lang,
  pathname,
}: {
  m: MenuLink
  lang: 'es' | 'en'
  pathname: string
}) {
  const active = isActiveHref(pathname, m.href)
  return (
    <Link href={m.href} className={active ? 'is-active' : undefined}>
      <span className="lang-es" aria-hidden={lang !== 'es'}>{m.es}</span>
      <span className="lang-en" aria-hidden={lang !== 'en'}>{m.en}</span>
    </Link>
  )
}

export default function Header({ lang }: Props) {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const activeKey =
    NAV.slice()
      .sort((a, b) => b.href.length - a.href.length)
      .find(it => pathname === it.href || pathname.startsWith(it.href + '/'))?.key ?? ''

  function handleLangSwitch(newLang: string) {
    document.cookie = `cpe_lang=${newLang};path=/;max-age=31536000`
    document.documentElement.setAttribute('data-lang', newLang)
    window.location.reload()
  }

  useEffect(() => {
    const toggle = document.querySelector('.menu-toggle') as HTMLButtonElement | null
    const nav = navRef.current
    if (!toggle || !nav) return
    const handler = () => nav.classList.toggle('open')
    toggle.addEventListener('click', handler)
    return () => toggle.removeEventListener('click', handler)
  }, [])

  // Sticky header stays; close open submenus on scroll so they don't float over content.
  useEffect(() => {
    let timer = 0
    const onScroll = () => {
      const active = document.activeElement as HTMLElement | null
      if (active?.closest('.nav-item.has-menu')) active.blur()
      document.documentElement.classList.add('nav-scrolling')
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        document.documentElement.classList.remove('nav-scrolling')
      }, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      document.documentElement.classList.remove('nav-scrolling')
    }
  }, [])

  return (
    <header className="site-header">
      <div className="container">
        <Link className="brand" href="/" aria-label="Crown Point Energy">
          {lang === 'en' ? (
            <Image
              src="/logo-en.png"
              alt="Crown Point Energy Inc."
              className="brand-logo brand-logo--svg"
              width={176}
              height={83}
              style={{ height: 56, width: 'auto' }}
              priority
            />
          ) : (
            <>
              <Image
                src="/shared/logo/logo-crown-point-navy.svg"
                alt="Crown Point Energía S.A."
                className="brand-logo brand-logo--svg brand-logo--on-light"
                width={183}
                height={106}
                style={{ height: 56, width: 'auto' }}
                priority
                unoptimized
              />
              <Image
                src="/shared/logo/logo-crown-point.svg"
                alt="Crown Point Energía S.A."
                className="brand-logo brand-logo--svg brand-logo--on-dark"
                width={183}
                height={106}
                style={{ height: 56, width: 'auto' }}
                priority
                unoptimized
              />
            </>
          )}
        </Link>

        <nav className="primary-nav" ref={navRef}>
          {NAV.map(it => {
            const hasMenu = !!it.menu
            const cols = it.menu && 'columns' in it.menu ? it.menu.columns : null
            const flat = it.menu && Array.isArray(it.menu) ? it.menu : null

            return (
              <div
                key={it.key}
                className={`nav-item${hasMenu ? ' has-menu' : ''}${it.key === activeKey ? ' active' : ''}`}
                tabIndex={hasMenu ? 0 : undefined}
              >
                {hasMenu ? (
                  <>
                    <Link href={it.href} className="nav-label">
                      <span className="lang-es" aria-hidden={lang !== 'es'}>{it.es}</span>
                      <span className="lang-en" aria-hidden={lang !== 'en'}>{it.en}</span>
                    </Link>
                    <div
                      className={`nav-submenu${cols ? ' nav-submenu--figma' : ''}${cols?.length === 1 ? ' nav-submenu--stack' : ''}`}
                    >
                      {cols ? (
                        cols.map((col, ci) => (
                          <div key={ci} className="nav-submenu-col">
                            {col.map(m => (
                              <SubmenuLink key={m.href} m={m} lang={lang} pathname={pathname} />
                            ))}
                          </div>
                        ))
                      ) : (
                        flat?.map((m, mi) => (
                          'divider' in m ? (
                            <span key={`d${mi}`} className="nav-submenu-divider">
                              <span className="lang-es" aria-hidden={lang !== 'es'}>{m.es}</span>
                              <span className="lang-en" aria-hidden={lang !== 'en'}>{m.en}</span>
                            </span>
                          ) : (
                            <SubmenuLink key={m.href} m={m} lang={lang} pathname={pathname} />
                          )
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <Link href={it.href} className="nav-label">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>{it.es}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>{it.en}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        <div className="header-utils">
          <Link href="/buscar" className="header-search" aria-label="Buscar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              data-lang-btn="es"
              className={lang === 'es' ? 'active' : ''}
              aria-pressed={lang === 'es'}
              aria-label="Cambiar idioma a español"
              onClick={() => handleLangSwitch('es')}
            >ES</button>
            <button
              data-lang-btn="en"
              className={lang === 'en' ? 'active' : ''}
              aria-pressed={lang === 'en'}
              aria-label="Switch language to English"
              onClick={() => handleLangSwitch('en')}
            >EN</button>
          </div>

          <div className="nav-item has-menu ingresar-wrap" tabIndex={0}>
            <span className="btn-ingresar">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Ingresar</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Sign in</span>
            </span>
            <div className="nav-submenu nav-submenu--right nav-submenu--panel">
              {INGRESAR_MENU.map(m => (
                m.external ? (
                  <a key={`${m.href}-${m.es}`} href={m.href} target="_blank" rel="noreferrer noopener">
                    <span className="lang-es" aria-hidden={lang !== 'es'}>{m.es}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>{m.en}</span>
                  </a>
                ) : (
                  <Link key={`${m.href}-${m.es}`} href={m.href}>
                    <span className="lang-es" aria-hidden={lang !== 'es'}>{m.es}</span>
                    <span className="lang-en" aria-hidden={lang !== 'en'}>{m.en}</span>
                  </Link>
                )
              ))}
            </div>
          </div>

          <button className="menu-toggle" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
