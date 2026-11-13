'use client'

import { useRef, useState } from 'react'
import HoneypotFields from '@/components/HoneypotFields'
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from '@/lib/antispam'

type FormState = 'idle' | 'submitting' | 'done' | 'error'

const CATEGORIAS_ES = [
  { value: 'anticorrupcion', label: 'Anticorrupción / soborno' },
  { value: 'informacion_privilegiada', label: 'Uso de información privilegiada' },
  { value: 'conflicto_interes', label: 'Conflicto de interés' },
  { value: 'acoso_discriminacion', label: 'Acoso o discriminación' },
  { value: 'fraude_financiero', label: 'Fraude o irregularidad financiera' },
  { value: 'seguridad_ambiente', label: 'Seguridad, salud o medio ambiente' },
  { value: 'otro', label: 'Otro' },
]

const CATEGORIAS_EN = [
  { value: 'anticorrupcion', label: 'Anti-corruption / bribery' },
  { value: 'informacion_privilegiada', label: 'Insider trading' },
  { value: 'conflicto_interes', label: 'Conflict of interest' },
  { value: 'acoso_discriminacion', label: 'Harassment or discrimination' },
  { value: 'fraude_financiero', label: 'Fraud or financial irregularity' },
  { value: 'seguridad_ambiente', label: 'Health, safety or environment' },
  { value: 'otro', label: 'Other' },
]

export default function DenunciaForm({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [state, setState] = useState<FormState>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [anonimo, setAnonimo] = useState(true)
  const [categoria, setCategoria] = useState('')
  const formTs = useRef(Date.now())
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const categorias = lang === 'en' ? CATEGORIAS_EN : CATEGORIAS_ES

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrMsg('')

    const form = e.currentTarget
    const fd = new FormData()
    fd.append('categoria', (form.elements.namedItem('categoria') as HTMLSelectElement).value)
    fd.append('descripcion', (form.elements.namedItem('descripcion') as HTMLTextAreaElement).value)
    fd.append('fecha_incidente', (form.elements.namedItem('fecha_incidente') as HTMLInputElement)?.value ?? '')
    fd.append('anonimo', String(anonimo))
    if (!anonimo) {
      fd.append('nombre', (form.elements.namedItem('nombre') as HTMLInputElement)?.value ?? '')
      fd.append('email', (form.elements.namedItem('email') as HTMLInputElement)?.value ?? '')
      fd.append('telefono', (form.elements.namedItem('telefono') as HTMLInputElement)?.value ?? '')
    }
    const file = fileRef.current?.files?.[0]
    if (file) fd.append('evidencia', file)
    fd.append(
      HONEYPOT_FIELD,
      (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? '',
    )
    fd.append(TIMESTAMP_FIELD, String(formTs.current))

    try {
      const res = await fetch('/api/denuncias', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? (lang === 'es' ? 'Error al enviar' : 'Failed to submit'))
      }
      setState('done')
    } catch (err) {
      setErrMsg((err as Error).message)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="den-done">
        <h3>
          <span className="lang-es" aria-hidden={lang !== 'es'}>Denuncia recibida</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Report received</span>
        </h3>
        <p>
          <span className="lang-es" aria-hidden={lang !== 'es'}>
            Gracias por reportarlo. Nuestro equipo de cumplimiento la va a revisar con confidencialidad.
            {anonimo
              ? ' Como enviaste la denuncia de forma anónima, no vamos a poder contactarte para pedir más información.'
              : ' Te vamos a contactar si necesitamos más información.'}
          </span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>
            Thank you for reporting it. Our compliance team will review it confidentially.
            {anonimo
              ? ' Because you submitted anonymously, we will not be able to contact you for more information.'
              : ' We will contact you if we need more information.'}
          </span>
        </p>
      </div>
    )
  }

  return (
    <form className="den-form" onSubmit={handleSubmit}>
      <HoneypotFields />
      {errMsg && (
        <div className="den-error" role="alert">
          {errMsg}
        </div>
      )}

      <div className="den-field">
        <label htmlFor="den-categoria">
          <span className="lang-es" aria-hidden={lang !== 'es'}>Categoría *</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Category *</span>
        </label>
        <select
          id="den-categoria"
          name="categoria"
          required
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          className={categoria ? 'den-select--filled' : undefined}
        >
          <option value="" disabled>
            {lang === 'es' ? 'Seleccioná una categoría' : 'Select a category'}
          </option>
          {categorias.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="den-field">
        <label htmlFor="den-desc">
          <span className="lang-es" aria-hidden={lang !== 'es'}>¿Qué pasó? *</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>What happened? *</span>
        </label>
        <textarea
          id="den-desc"
          name="descripcion"
          required
          minLength={20}
          rows={6}
          placeholder={
            lang === 'es'
              ? 'Describí la situación con la mayor precisión posible: qué, quién, cuándo, dónde.'
              : 'Describe the situation as precisely as possible: what, who, when, where.'
          }
        />
      </div>

      <div className="den-field">
        <label htmlFor="den-fecha">
          <span className="lang-es" aria-hidden={lang !== 'es'}>Fecha aproximada del hecho (opcional)</span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>Approximate date of the incident (optional)</span>
        </label>
        <input
          id="den-fecha"
          type="date"
          name="fecha_incidente"
          max={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="den-field den-field--file">
        <label htmlFor="den-file">
          <span className="lang-es" aria-hidden={lang !== 'es'}>
            Evidencia adjunta (opcional — PDF, imagen o Word, máx. 20 MB)
          </span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>
            Supporting evidence (optional — PDF, image or Word, max 20 MB)
          </span>
        </label>
        <input
          id="den-file"
          type="file"
          ref={fileRef}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={e => setFileName(e.target.files?.[0]?.name ?? '')}
        />
        {fileName && <span className="den-file-name">{fileName}</span>}
      </div>

      <div className="den-anon">
        <label className="den-check">
          <input type="checkbox" checked={anonimo} onChange={e => setAnonimo(e.target.checked)} />
          <span>
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Quiero enviar esta denuncia de forma anónima
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              I want to submit this report anonymously
            </span>
          </span>
        </label>
        <p className="den-anon-hint">
          <span className="lang-es" aria-hidden={lang !== 'es'}>
            Si dejás esto marcado, no vamos a pedirte ni guardar ningún dato de contacto tuyo.
          </span>
          <span className="lang-en" aria-hidden={lang !== 'en'}>
            If checked, we will not ask for or store any of your contact details.
          </span>
        </p>
      </div>

      {!anonimo && (
        <>
          <div className="den-field">
            <label htmlFor="den-nombre">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Nombre</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Name</span>
            </label>
            <input id="den-nombre" type="text" name="nombre" autoComplete="name" />
          </div>
          <div className="den-field">
            <label htmlFor="den-email">Email</label>
            <input id="den-email" type="email" name="email" autoComplete="email" />
          </div>
          <div className="den-field">
            <label htmlFor="den-tel">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Teléfono (opcional)</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Phone (optional)</span>
            </label>
            <input id="den-tel" type="tel" name="telefono" autoComplete="tel" />
          </div>
        </>
      )}

      <button type="submit" className="den-submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? (
          <>
            <span className="lang-es" aria-hidden={lang !== 'es'}>Enviando…</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Sending…</span>
          </>
        ) : (
          <>
            <span className="lang-es" aria-hidden={lang !== 'es'}>Enviar denuncia</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Submit report</span>
          </>
        )}
      </button>
    </form>
  )
}
