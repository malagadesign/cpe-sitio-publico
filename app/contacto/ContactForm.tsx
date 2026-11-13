'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import HoneypotFields from '@/components/HoneypotFields'
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from '@/lib/antispam'

type FormState = 'idle' | 'submitting' | 'done' | 'error'

const TIPO_COMERCIAL = 'Comercial'

const TIPOS_ES = [
  { value: 'Relaciones con Inversores', label: 'Relaciones con Inversores' },
  { value: TIPO_COMERCIAL, label: 'Comercial' },
  { value: 'Operaciones y alianzas', label: 'Operaciones y alianzas' },
  { value: 'Proveedores y compras', label: 'Proveedores y compras' },
  { value: 'Prensa y medios', label: 'Prensa y medios' },
  { value: 'Corporativo / general', label: 'Corporativo / general' },
]

const TIPOS_EN = [
  { value: 'Relaciones con Inversores', label: 'Investor Relations' },
  { value: TIPO_COMERCIAL, label: 'Commercial' },
  { value: 'Operaciones y alianzas', label: 'Operations & partnerships' },
  { value: 'Proveedores y compras', label: 'Procurement & suppliers' },
  { value: 'Prensa y medios', label: 'Press & media' },
  { value: 'Corporativo / general', label: 'Corporate / general' },
]

const PRODUCTOS_ES = [
  { value: 'Petróleo crudo (Medanito)', label: 'Petróleo crudo (Medanito)' },
  { value: 'Gas natural', label: 'Gas natural' },
  { value: 'Gas + petróleo', label: 'Gas + petróleo' },
]

const PRODUCTOS_EN = [
  { value: 'Petróleo crudo (Medanito)', label: 'Crude oil (Medanito)' },
  { value: 'Gas natural', label: 'Natural gas' },
  { value: 'Gas + petróleo', label: 'Gas + crude' },
]

/** Query `?tipo=` → valor del select */
const TIPO_FROM_QUERY: Record<string, string> = {
  ir: 'Relaciones con Inversores',
  'relaciones-con-inversores': 'Relaciones con Inversores',
  inversores: 'Relaciones con Inversores',
  comercial: TIPO_COMERCIAL,
  comercializacion: TIPO_COMERCIAL,
  proveedores: 'Proveedores y compras',
  compras: 'Proveedores y compras',
}

function resolveTipoFromQuery(raw: string | null): string {
  if (!raw) return ''
  const key = raw.trim().toLowerCase()
  if (TIPO_FROM_QUERY[key]) return TIPO_FROM_QUERY[key]
  const all = [...TIPOS_ES, ...TIPOS_EN]
  const match = all.find(t => t.value.toLowerCase() === key || t.label.toLowerCase() === key)
  return match?.value ?? ''
}

function ContactFormInner({ lang }: { lang: 'es' | 'en' }) {
  const searchParams = useSearchParams()
  const initialTipo = useMemo(
    () => resolveTipoFromQuery(searchParams.get('tipo')),
    [searchParams],
  )

  const [state, setState] = useState<FormState>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [tipo, setTipo] = useState(initialTipo)
  const tipos = lang === 'en' ? TIPOS_EN : TIPOS_ES
  const productos = lang === 'en' ? PRODUCTOS_EN : PRODUCTOS_ES
  const isComercial = tipo === TIPO_COMERCIAL

  useEffect(() => {
    setTipo(initialTipo)
  }, [initialTipo])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrMsg('')

    const form = e.currentTarget
    const tipoVal = (form.elements.namedItem('tipo') as HTMLSelectElement)?.value ?? ''
    const producto = (form.elements.namedItem('producto') as HTMLSelectElement | null)?.value ?? ''
    const volumen = (form.elements.namedItem('volumen') as HTMLInputElement | null)?.value ?? ''
    const mensajeRaw = (form.elements.namedItem('mensaje') as HTMLTextAreaElement)?.value ?? ''
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement)?.value?.trim() ?? ''
    const apellido = (form.elements.namedItem('apellido') as HTMLInputElement)?.value?.trim() ?? ''

    const mensaje =
      tipoVal === TIPO_COMERCIAL
        ? [`Producto: ${producto}`, `Volumen estimado: ${volumen}`, '', mensajeRaw].join('\n').trim()
        : mensajeRaw

    const data = {
      tipo: tipoVal,
      nombre: [nombre, apellido].filter(Boolean).join(' '),
      organizacion: '',
      email: (form.elements.namedItem('email') as HTMLInputElement)?.value ?? '',
      telefono: (form.elements.namedItem('telefono') as HTMLInputElement)?.value ?? '',
      mensaje,
      [HONEYPOT_FIELD]: (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement)?.value ?? '',
      [TIMESTAMP_FIELD]: (form.elements.namedItem(TIMESTAMP_FIELD) as HTMLInputElement)?.value ?? '',
    }

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Error al enviar')
      setState('done')
    } catch (err) {
      setErrMsg((err as Error).message)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="con-form-done">
        <h3>
          <span className="lang-es" aria-hidden={lang !== 'es'}>¡Gracias!</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Thank you!</span>
        </h3>
        <p>
          <span className="lang-es" aria-hidden={lang !== 'es'}>
            Recibimos tu consulta. Nuestro equipo te responderá en un plazo máximo de 2 días hábiles.
          </span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>
            We&apos;ve received your enquiry. Our team will reply within 2 business days.
          </span>
        </p>
      </div>
    )
  }

  return (
    <form className="con-form" onSubmit={handleSubmit} noValidate={false}>
      <HoneypotFields />
      {errMsg && <div className="con-form-error" role="alert">{errMsg}</div>}

      <div className="con-form-row">
        <div className="con-field">
          <label htmlFor="con-nombre">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Nombre</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>First name</span>
          </label>
          <input
            id="con-nombre"
            type="text"
            name="nombre"
            required
            placeholder={lang === 'es' ? 'Tu nombre*' : 'Your first name*'}
            autoComplete="given-name"
          />
        </div>
        <div className="con-field">
          <label htmlFor="con-apellido">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Apellido</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Last name</span>
          </label>
          <input
            id="con-apellido"
            type="text"
            name="apellido"
            required
            placeholder={lang === 'es' ? 'Tu apellido*' : 'Your last name*'}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="con-form-row">
        <div className="con-field">
          <label htmlFor="con-email">Email</label>
          <input
            id="con-email"
            type="email"
            name="email"
            required
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />
        </div>
        <div className="con-field">
          <label htmlFor="con-tel">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Teléfono</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Phone</span>
          </label>
          <input
            id="con-tel"
            type="tel"
            name="telefono"
            placeholder="+54 …"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="con-form-row">
        <div className="con-field con-field--full">
          <label htmlFor="con-tipo">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Tipo de consulta</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Enquiry type</span>
          </label>
          <select
            id="con-tipo"
            name="tipo"
            required
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className={tipo ? 'con-select--filled' : undefined}
          >
            <option value="" disabled>
              {lang === 'es' ? 'Seleccionar tipo de consulta' : 'Select enquiry type'}
            </option>
            {tipos.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isComercial && (
        <div className="con-form-row">
          <div className="con-field">
            <label htmlFor="con-producto">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Producto de interés</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Product of interest</span>
            </label>
            <select
              id="con-producto"
              name="producto"
              required
              defaultValue=""
              onChange={e => {
                e.currentTarget.classList.toggle('con-select--filled', Boolean(e.currentTarget.value))
              }}
            >
              <option value="" disabled>
                {lang === 'es' ? 'seleccioná una opción' : 'select an option'}
              </option>
              {productos.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="con-field">
            <label htmlFor="con-volumen">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Volumen estimado</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Estimated volume</span>
            </label>
            <input
              id="con-volumen"
              type="text"
              name="volumen"
              placeholder="ej. 500 bbl/d / 1 MMcf/d"
            />
          </div>
        </div>
      )}

      <div className="con-form-row">
        <div className="con-field con-field--full">
          <label htmlFor="con-msg">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Mensaje</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Message</span>
          </label>
          <textarea
            id="con-msg"
            name="mensaje"
            required
            rows={2}
            placeholder={
              lang === 'es' ? 'Cuéntanos brevemente qué necesitás' : 'Tell us briefly what you need'
            }
          />
        </div>
      </div>

      <div className="con-form-footer">
        <div className="con-checks">
          <label className="con-check">
            <input type="checkbox" name="novedades" />
            <span>
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Quiero recibir novedades e información
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                I want to receive news and updates
              </span>
            </span>
          </label>
          <label className="con-check">
            <input type="checkbox" name="terminos" required />
            <span>
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Acepto{' '}
                <Link href="/legal/terminos">términos y condiciones</Link>
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                I accept the{' '}
                <Link href="/legal/terminos">terms and conditions</Link>
              </span>
            </span>
          </label>
        </div>
        <button type="submit" className="con-submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? (
            <>
              <span className="lang-es" aria-hidden={lang !== 'es'}>Enviando…</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Sending…</span>
            </>
          ) : (
            <>
              <span className="lang-es" aria-hidden={lang !== 'es'}>Enviar</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Send</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/contacto/send-arrow.svg" alt="" width={29} height={15} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function ContactForm({ lang }: { lang: 'es' | 'en' }) {
  return (
    <Suspense fallback={<div className="con-form" aria-hidden />}>
      <ContactFormInner lang={lang} />
    </Suspense>
  )
}
