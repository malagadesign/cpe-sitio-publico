import type { ReactNode } from 'react'
import Link from 'next/link'

export type LegalSection = 'terminos' | 'privacidad' | 'avisos' | 'accesibilidad'

const NAV: { id: LegalSection; href: string; es: string; en: string }[] = [
  { id: 'terminos', href: '/legal/terminos', es: 'Términos y condiciones', en: 'Terms and conditions' },
  { id: 'privacidad', href: '/legal/privacidad', es: 'Privacidad y cookies', en: 'Privacy and cookies' },
  { id: 'avisos', href: '/legal/avisos', es: 'Avisos legales', en: 'Legal notices' },
  { id: 'accesibilidad', href: '/legal/accesibilidad', es: 'Accesibilidad', en: 'Accessibility' },
]

export default function LegalPageShell({
  lang,
  section,
  titleEs,
  titleEn,
  ledeEs,
  ledeEn,
  children,
}: {
  lang: 'es' | 'en'
  section: LegalSection
  titleEs: string
  titleEn: string
  ledeEs?: string
  ledeEn?: string
  children: ReactNode
}) {
  return (
    <div className="legal-page">
      <section className="legal-hero" aria-labelledby="legal-heading">
        <div className="container">
          <p className="legal-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Legal</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Legal</span>
          </p>
          <h1 id="legal-heading" className="legal-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>{titleEs}</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>{titleEn}</span>
          </h1>
          {(ledeEs || ledeEn) && (
            <p className="legal-lede">
              <span className="lang-es" aria-hidden={lang !== 'es'}>{ledeEs}</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>{ledeEn}</span>
            </p>
          )}
        </div>
      </section>

      <div className="container">
        <nav className="legal-nav" aria-label={lang === 'es' ? 'Secciones legales' : 'Legal sections'}>
          {NAV.map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={item.id === section ? 'is-active' : undefined}
              aria-current={item.id === section ? 'page' : undefined}
            >
              <span className="lang-es" aria-hidden={lang !== 'es'}>{item.es}</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>{item.en}</span>
            </Link>
          ))}
        </nav>
      </div>

      <section className="legal-body-wrap">
        <div className="container">
          <div className="legal-body">{children}</div>
        </div>
      </section>
    </div>
  )
}
