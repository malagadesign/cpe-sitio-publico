import Link from 'next/link'
import Image from 'next/image'
import ObfuscatedEmail from './ObfuscatedEmail'

export default function Footer({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid footer-grid--figma">
          <div className="footer-brand">
            {lang === 'en' ? (
              <Image
                src="/logo-en.png"
                alt="Crown Point Energy Inc."
                className="footer-logo footer-logo--svg"
                width={176}
                height={83}
              />
            ) : (
              <>
                <Image
                  src="/shared/logo/logo-crown-point.svg"
                  alt="Crown Point Energía S.A."
                  className="footer-logo footer-logo--svg footer-logo--on-dark"
                  width={183}
                  height={106}
                  unoptimized
                />
                <Image
                  src="/shared/logo/logo-crown-point-navy.svg"
                  alt="Crown Point Energía S.A."
                  className="footer-logo footer-logo--svg footer-logo--on-light"
                  width={183}
                  height={106}
                  unoptimized
                />
              </>
            )}
            <p className="lang-es" aria-hidden={lang !== 'es'}>
              <strong>Crown Point Energía S.A.</strong>{' '}
              Empresa argentina con más de 20 años de trayectoria dedicada a la exploración y producción de petróleo y gas en yacimientos convencionales maduros.
            </p>
            <p className="lang-en" aria-hidden={lang !== 'en'}>
              <strong>Crown Point Energy Inc.</strong>{' '}
              Argentine company with more than 20 years of experience in exploration and production of oil and gas in mature conventional fields.
            </p>
          </div>

          <div className="footer-col">
            <h5><span className="lang-es" aria-hidden={lang !== 'es'}>Compañía</span><span className="lang-en" aria-hidden={lang !== 'en'}>Company</span></h5>
            <ul>
              <li><Link href="/operaciones"><span className="lang-es" aria-hidden={lang !== 'es'}>Operaciones</span><span className="lang-en" aria-hidden={lang !== 'en'}>Operations</span></Link></li>
              <li><a href="https://crown-point-energia.vercel.app/portal/login" target="_blank" rel="noopener noreferrer"><span className="lang-es" aria-hidden={lang !== 'es'}>Portal de inversores</span><span className="lang-en" aria-hidden={lang !== 'en'}>Investor portal</span></a></li>
              <li><Link href="/contacto"><span className="lang-es" aria-hidden={lang !== 'es'}>Contacto</span><span className="lang-en" aria-hidden={lang !== 'en'}>Contact</span></Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5><span className="lang-es" aria-hidden={lang !== 'es'}>Los yacimientos</span><span className="lang-en" aria-hidden={lang !== 'en'}>The fields</span></h5>
            <ul>
              <li><Link href="/operaciones#cerro">Cerro de Los Leones</Link></li>
              <li><Link href="/operaciones#tordillo">El Tordillo · La Tapera</Link></li>
              <li><Link href="/operaciones#chanares">Chañares Herrados / PPCO</Link></li>
              <li><Link href="/operaciones#piedra">Piedra Clavada – Koluel Kaike</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5><Link href="/inversores" className="footer-col-heading-link"><span className="lang-es" aria-hidden={lang !== 'es'}>Invertir</span><span className="lang-en" aria-hidden={lang !== 'en'}>Invest</span></Link></h5>
            <ul>
              <li><Link href="/inversores/reportes"><span className="lang-es" aria-hidden={lang !== 'es'}>Reportes</span><span className="lang-en" aria-hidden={lang !== 'en'}>Reports</span></Link></li>
              <li><Link href="/inversores/financieros"><span className="lang-es" aria-hidden={lang !== 'es'}>Estados financieros</span><span className="lang-en" aria-hidden={lang !== 'en'}>Financial statements</span></Link></li>
              <li><Link href="/inversores/asambleas"><span className="lang-es" aria-hidden={lang !== 'es'}>Asambleas</span><span className="lang-en" aria-hidden={lang !== 'en'}>Meetings</span></Link></li>
              <li><Link href="/inversores/gobierno"><span className="lang-es" aria-hidden={lang !== 'es'}>Gobierno corporativo</span><span className="lang-en" aria-hidden={lang !== 'en'}>Corporate governance</span></Link></li>
              <li><Link href="/inversores/directorios"><span className="lang-es" aria-hidden={lang !== 'es'}>Directorios</span><span className="lang-en" aria-hidden={lang !== 'en'}>Boards</span></Link></li>
              <li><Link href="/inversores/estrategia"><span className="lang-es" aria-hidden={lang !== 'es'}>Estrategia</span><span className="lang-en" aria-hidden={lang !== 'en'}>Strategy</span></Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5><span className="lang-es" aria-hidden={lang !== 'es'}>Contacto directo</span><span className="lang-en" aria-hidden={lang !== 'en'}>Direct contact</span></h5>
            <ul>
              <li>Godoy Cruz 2769, Piso&nbsp;4</li>
              <li>C1425FQK, Buenos Aires</li>
              <li><ObfuscatedEmail user="ir" domain="crownpointenergy.com" /></li>
              <li>+54 11-5032-5600</li>
            </ul>
            <div className="footer-social">
              <a
                className="footer-social-btn footer-social-btn--icon"
                href="https://www.linkedin.com/company/crown-point-energia-sa"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                className="footer-social-btn"
                href="https://www.sedarplus.ca"
                target="_blank"
                rel="noreferrer"
              >
                SEDAR+
              </a>
              <a
                className="footer-social-btn"
                href="https://www.cnv.gov.ar"
                target="_blank"
                rel="noreferrer"
              >
                CNV
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-legal-band">
        <div className="container">
          <div className="footer-bottom-bar">
            <p className="footer-copy">
              © {new Date().getFullYear()} Crown Point Energy Inc. · TSXV: CWV
            </p>
            <nav className="footer-legal-links" aria-label={lang === 'es' ? 'Enlaces legales' : 'Legal links'}>
              <Link href="/legal/terminos">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Términos y condiciones</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Terms and conditions</span>
              </Link>
              <Link href="/legal/privacidad">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Privacidad y cookies</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Privacy and cookies</span>
              </Link>
              <Link href="/legal/avisos">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Avisos legales</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Legal notices</span>
              </Link>
              <Link href="/legal/accesibilidad">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Accesibilidad</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Accessibility</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
