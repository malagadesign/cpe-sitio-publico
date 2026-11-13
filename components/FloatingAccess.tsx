'use client'

const WA_URL = 'https://wa.me/541150325600'
const MAIL_URL = 'mailto:ir@crownpointenergy.com'

export default function FloatingAccess() {
  return (
    <aside className="float-access" aria-label="Accesos directos">
      <a
        className="float-access__btn"
        href={WA_URL}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20.5 11.5c0 4.7-3.9 8.5-8.6 8.5-1.5 0-2.9-.4-4.1-1l-4.3 1.1 1.2-4.1A8.4 8.4 0 0 1 3.4 11.5C3.4 6.8 7.2 3 11.9 3s8.6 3.8 8.6 8.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.2.6l-.4.4c-.1.1-.2.3-.1.5.3.6 1 1.3 1.7 1.7.2.1.4 0 .5-.1l.4-.4c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.5.7-.4.2-1.1.4-1.8.2-1.7-.4-3.6-1.9-4.7-3.6-1-1.5-.9-2.6-.7-3.1Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <a className="float-access__btn" href={MAIL_URL} aria-label="Email">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 7.5 12 13l8-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </a>

      <button
        type="button"
        className="float-access__btn"
        aria-label="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 14.5 12 8.5l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </aside>
  )
}
