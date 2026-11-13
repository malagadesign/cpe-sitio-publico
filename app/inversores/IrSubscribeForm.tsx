'use client'

import { useState } from 'react'
import HoneypotFields from '@/components/HoneypotFields'
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from '@/lib/antispam'

type State = 'idle' | 'submitting' | 'done' | 'error'

export default function IrSubscribeForm({
  lang,
  variant = 'default',
}: {
  lang: 'es' | 'en'
  variant?: 'default' | 'figma'
}) {
  const [state, setState] = useState<State>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrMsg('')

    const form = e.currentTarget
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement)?.value ?? ''
    const apellido = (form.elements.namedItem('apellido') as HTMLInputElement)?.value ?? ''
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value ?? ''
    const hp = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement)?.value ?? ''
    const ts = (form.elements.namedItem(TIMESTAMP_FIELD) as HTMLInputElement)?.value ?? ''
    const fullName = [nombre, apellido].filter(Boolean).join(' ').trim() || nombre

    try {
      const res = await fetch('/api/ir-subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nombre: fullName, email, [HONEYPOT_FIELD]: hp, [TIMESTAMP_FIELD]: ts }),
      })
      if (!res.ok) throw new Error('Error')
      setState('done')
    } catch {
      setErrMsg(lang === 'es' ? 'Error al suscribir. Intenta nuevamente.' : 'Subscription failed. Please try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className={variant === 'figma' ? 'inv-form-done' : undefined} style={variant === 'figma' ? {
        padding: '24px',
        border: '1px solid rgba(108,174,82,0.35)',
        borderRadius: 16,
        textAlign: 'center',
      } : {
        padding: 'var(--s-6)',
        background: 'rgba(108,174,82,0.12)',
        border: '1px solid rgba(108,174,82,0.3)',
        borderRadius: 'var(--r-lg)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#8BD478', fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>
          <span className="lang-es" aria-hidden={lang !== 'es'}>Suscripción confirmada</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Subscription confirmed</span>
        </p>
        <p style={{ color: 'rgba(236,238,251,0.6)', fontSize: 13, margin: 0 }}>
          <span className="lang-es" aria-hidden={lang !== 'es'}>Recibirás los comunicados de prensa y resultados trimestrales en tu casilla.</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>You&apos;ll receive press releases and quarterly results in your inbox.</span>
        </p>
      </div>
    )
  }

  if (variant === 'figma') {
    return (
      <form className="inv-form" onSubmit={handleSubmit}>
        <HoneypotFields />
        {errMsg && (
          <div style={{ gridColumn: '1 / -1', fontSize: 13, color: '#FF8A80' }}>{errMsg}</div>
        )}
        <div className="field">
          <label htmlFor="inv-nombre">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Nombre</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>First name</span>
          </label>
          <input id="inv-nombre" type="text" name="nombre" required placeholder={lang === 'es' ? 'Tu nombre*' : 'Your first name*'} />
        </div>
        <div className="field">
          <label htmlFor="inv-apellido">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Apellido</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Last name</span>
          </label>
          <input id="inv-apellido" type="text" name="apellido" placeholder={lang === 'es' ? 'Tu apellido*' : 'Your last name*'} />
        </div>
        <div className="field">
          <label htmlFor="inv-email">Email</label>
          <input id="inv-email" type="email" name="email" required placeholder="correo@ejemplo.com" />
        </div>
        <div className="field">
          <label htmlFor="inv-tel">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Teléfono</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Phone</span>
          </label>
          <input id="inv-tel" type="tel" name="telefono" placeholder="+54 9 …" />
        </div>
        <div className="inv-form-actions">
          <button type="submit" className="inv-btn inv-btn--solid" disabled={state === 'submitting'}>
            {state === 'submitting' ? (
              <span className="lang-es" aria-hidden={lang !== 'es'}>Enviando…</span>
            ) : (
              <>
                <span className="lang-es" aria-hidden={lang !== 'es'}>Suscribirme</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Subscribe</span>
                <svg width="18" height="12" viewBox="0 0 29 15" fill="none" aria-hidden>
                  <path d="M1 7.5H27M21 1L27.5 7.5L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form className="ir-subscribe" onSubmit={handleSubmit}>
      <HoneypotFields />
      {errMsg && (
        <div style={{ fontSize: 13, color: '#FF8A80', padding: '8px 12px', background: 'rgba(179,59,46,0.15)', borderRadius: 'var(--r-md)' }}>
          {errMsg}
        </div>
      )}
      <div className="form-row">
        <label style={{ color: 'rgba(236,238,251,0.7)' }}><span className="lang-es" aria-hidden={lang !== 'es'}>Nombre</span><span className="lang-en" aria-hidden={lang !== 'en'}>Name</span></label>
        <input type="text" name="nombre" required placeholder="—" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
      </div>
      <div className="form-row">
        <label style={{ color: 'rgba(236,238,251,0.7)' }}>Email</label>
        <input type="email" name="email" required placeholder="you@firm.com" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={state === 'submitting'}
        style={{ background: 'var(--cp-green)', color: 'var(--cp-navy-darker)', marginTop: 8 }}
      >
        {state === 'submitting' ? (
          <><span className="lang-es" aria-hidden={lang !== 'es'}>Enviando…</span><span className="lang-en" aria-hidden={lang !== 'en'}>Sending…</span></>
        ) : (
          <><span className="lang-es" aria-hidden={lang !== 'es'}>Suscribirme</span><span className="lang-en" aria-hidden={lang !== 'en'}>Subscribe</span></>
        )}
      </button>
    </form>
  )
}
