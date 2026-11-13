import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import ContactForm from './ContactForm'
import { UbicacionesMap } from './UbicacionesMap'
import { getEffectiveLang } from '@/lib/lang'
import ObfuscatedEmail from '@/components/ObfuscatedEmail'

export const revalidate = 60

export const metadata = {
  title: 'Contacto | Crown Point Energy',
  description:
    'Contactá a Crown Point Energy — oficinas en Argentina y Canadá, relaciones con inversores y consultas comerciales.',
  alternates: { canonical: 'https://crownpointenergy.com/contacto' },
}

export default async function ContactoPage() {
  const s = await getCmsState()
  const f = s.fields
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')

  const irName = f['contact.ir.name'] || 'María Teresa Zappino'
  const irRole = f['contact.ir.role'] || 'Responsable de Relaciones con el Mercado'
  const irEmail = f['contact.ir.email'] || 'ir@crownpointenergy.com'
  const arAddress = f['contact.ar.address'] || 'Godoy Cruz 2769, Piso 4\nC1425FQK, Buenos Aires'
  const arPhone = f['contact.ar.phone'] || '+54 11-5032-5600'
  const arEmail = f['contact.ar.email'] || 'notificaciones@crownpointenergy.com'
  const caAddress = f['contact.ca.address'] || 'PO Box 1562 Station M.\nCalgary, Alberta T2P 3B9'
  const caPhone = f['contact.ca.phone'] || '+1 403-232-1150'
  const caEmail = f['contact.ca.email'] || 'info@crownpointenergy.com'
  const taName = f['contact.ta.name'] || 'Olympia Trust Company'
  const taAddress = f['contact.ta.address'] || '4000, 520-3rd Avenue SW\nCalgary, AB T2P 0R3'
  const taPhone = f['contact.ta.phone'] || '+1 587-774-2340'
  const taUrl = f['contact.ta.url'] || 'https://www.olympiatrust.com'
  const taUrlLabel = taUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  const ethicsPhone = f['contact.ethics.phone'] || '+54 9 11 5263-0361'
  const ethicsEmail = f['contact.ethics.email'] || 'etica@crownpointenergy.com'

  return (
    <div className="con-page">
      <section className="con-top" aria-labelledby="con-heading">
        <div className="container">
          <div className="con-top-grid">
            <div>
              <h1 id="con-heading" className="con-title">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Estamos para responder</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>We&apos;re here to answer</span>
              </h1>
              <p className="con-lede">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Completá el formulario y nuestro equipo de comercialización te contactará.
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Complete the form and our commercial team will get in touch.
                </span>
              </p>
              <p className="con-direct-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>contacto directo</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>direct contact</span>
              </p>
              <a className="con-direct-email" href="mailto:comercial@crownpointenergy.com">
                comercial@crownpointenergy.com
              </a>
            </div>

            <div id="formulario">
              <ContactForm lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <section className="con-offices" aria-labelledby="con-offices-heading">
        <div className="container">
          <h2 id="con-offices-heading" className="con-offices-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Nuestras Oficinas</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Our Offices</span>
          </h2>
          <UbicacionesMap lang={lang} />
        </div>
      </section>

      <section className="con-dir" aria-label={lang === 'es' ? 'Directorio de contactos' : 'Contact directory'}>
        <div className="container">
          <div className="con-dir-card">
            <div className="con-dir-col">
              <p className="con-dir-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Ética</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Ethics</span>
              </p>
              <p className="con-dir-body">
                <ObfuscatedEmail user={ethicsEmail.split('@')[0]} domain={ethicsEmail.split('@')[1]} />
                <br />
                <a href={`tel:${ethicsPhone.replace(/\s/g, '')}`}>{ethicsPhone}</a>
              </p>
            </div>
            <div className="con-dir-col">
              <p className="con-dir-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Recursos humanos</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Human resources</span>
              </p>
              <p className="con-dir-body">
                <ObfuscatedEmail user="rrhh" domain="crownpointenergy.com" />
              </p>
            </div>
            <div className="con-dir-col">
              <p className="con-dir-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Agente de transferencia</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Transfer agent</span>
              </p>
              <p className="con-dir-body">
                {taName}
                <br />
                {taAddress.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <a href={`tel:${taPhone.replace(/\s/g, '')}`}>{taPhone}</a>
                <br />
                <a href={taUrl} target="_blank" rel="noreferrer">
                  {taUrlLabel}
                </a>
              </p>
            </div>
            <div className="con-dir-col">
              <p className="con-dir-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Relaciones con inversores</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Investor relations</span>
              </p>
              <p className="con-dir-body">
                {irName}
                <br />
                <span className="lang-es" aria-hidden={lang !== 'es'}>{irRole}</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  {f['contact.ir.role_en'] || 'Investor Relations Officer'}
                </span>
                <br />
                <span className="con-dir-ticker">TSXV: CWV</span>
                <br />
                <ObfuscatedEmail user={irEmail.split('@')[0]} domain={irEmail.split('@')[1]} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="con-hq" aria-label={lang === 'es' ? 'Sedes' : 'Headquarters'}>
        <div className="container">
          <div className="con-hq-card">
            <div className="con-hq-col">
              <p className="con-hq-label">Argentina</p>
              <p className="con-hq-body">
                {arAddress.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <a href={`tel:${arPhone.replace(/\s/g, '')}`}>{arPhone}</a>
                <br />
                <ObfuscatedEmail user={arEmail.split('@')[0]} domain={arEmail.split('@')[1]} />
              </p>
            </div>
            <div className="con-hq-col">
              <p className="con-hq-label">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Canadá</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Canada</span>
              </p>
              <p className="con-hq-body">
                Crown Point Energy Inc.
                <br />
                {caAddress.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <a href={`tel:${caPhone.replace(/\s/g, '')}`}>{caPhone}</a>
                <br />
                <ObfuscatedEmail user={caEmail.split('@')[0]} domain={caEmail.split('@')[1]} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="con-inst" aria-labelledby="con-inst-heading">
        <div className="container">
          <p className="con-inst-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Contacto institucional</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Institutional contact</span>
          </p>
          <h2 id="con-inst-heading" className="con-inst-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              ¿Sos analista,
              <br />
              inversor o socio?
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Are you an analyst,
              <br />
              investor or partner?
            </span>
          </h2>
          <p className="con-inst-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Nuestro equipo de Investor Relations responde consultas, agenda reuniones one-on-one y comparte materiales
              complementarios bajo NDA.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Our Investor Relations team answers enquiries, schedules one-on-one meetings and shares complementary
              materials under NDA.
            </span>
          </p>
          <ul className="con-inst-links">
            <li>
              <Link href="/contacto?tipo=ir#formulario">
                Investor
                <br />
                Relations
              </Link>
            </li>
            <li>
              <Link href="/contacto?tipo=comercial#formulario">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Comercialización
                  <br />
                  hidrocarburos
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Hydrocarbon
                  <br />
                  marketing
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contacto?tipo=proveedores#formulario">
                <span className="lang-es" aria-hidden={lang !== 'es'}>
                  Proveedores
                  <br />
                  &amp; compras
                </span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>
                  Suppliers
                  <br />
                  &amp; procurement
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
