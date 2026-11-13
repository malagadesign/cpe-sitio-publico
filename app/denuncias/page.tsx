import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import { getEffectiveLang } from '@/lib/lang'
import DenunciaForm from './DenunciaForm'

export const metadata = {
  title: 'Línea ética — Denuncias | Crown Point Energy',
  description:
    'Canal confidencial para reportar conductas contrarias al Código de Ética de Crown Point Energía.',
  robots: { index: false, follow: false },
}

export default async function DenunciasPage() {
  const s = await getCmsState()
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')
  const ethicsPhone = s.fields['contact.ethics.phone'] || '+54 9 11 5263-0361'
  const ethicsEmail = s.fields['contact.ethics.email'] || 'etica@crownpointenergy.com'

  return (
    <div className="den-page">
      <section className="den-hero" aria-labelledby="den-heading">
        <div className="container">
          <p className="den-eyebrow">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Cumplimiento</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Compliance</span>
          </p>
          <h1 id="den-heading" className="den-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Línea ética</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Ethics hotline</span>
          </h1>
          <p className="den-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Canal confidencial para reportar conductas contrarias al Código de Ética, políticas de anticorrupción,
              uso de información privilegiada u otras irregularidades. Podés enviarla de forma completamente anónima.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Confidential channel to report conduct contrary to the Code of Ethics, anti-corruption policies,
              insider trading rules or other irregularities. You may submit a report completely anonymously.
            </span>
          </p>
        </div>
      </section>

      <div className="container">
        <div className="den-points">
          <div>
            <p className="den-point-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Confidencial</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Confidential</span>
            </p>
            <p className="den-point-body">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Solo el equipo de cumplimiento accede a las denuncias.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Only the compliance team can access reports.
              </span>
            </p>
          </div>
          <div>
            <p className="den-point-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Sin represalias</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>No retaliation</span>
            </p>
            <p className="den-point-body">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Está prohibida cualquier represalia contra quien denuncie de buena fe.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Retaliation against anyone who reports in good faith is prohibited.
              </span>
            </p>
          </div>
          <div>
            <p className="den-point-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Anónimo si querés</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Anonymous if you prefer</span>
            </p>
            <p className="den-point-body">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                No es obligatorio dejar tu nombre ni contacto.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                You do not have to share your name or contact details.
              </span>
            </p>
          </div>
        </div>

        <div className="den-main">
          <DenunciaForm lang={lang} />

          <aside className="den-aside">
            <h2 className="den-aside-title">
              <span className="lang-es" aria-hidden={lang !== 'es'}>Otros canales</span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>Other channels</span>
            </h2>
            <p className="den-aside-body">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Si preferís un canal directo, también podés escribir a{' '}
                <a href={`mailto:${ethicsEmail}`}>{ethicsEmail}</a>
                {' '}o llamar al{' '}
                <a href={`tel:${ethicsPhone.replace(/\s/g, '')}`}>{ethicsPhone}</a>.
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                Prefer a direct channel? Email{' '}
                <a href={`mailto:${ethicsEmail}`}>{ethicsEmail}</a>
                {' '}or call{' '}
                <a href={`tel:${ethicsPhone.replace(/\s/g, '')}`}>{ethicsPhone}</a>.
              </span>
            </p>
            <p className="den-aside-body">
              <span className="lang-es" aria-hidden={lang !== 'es'}>
                Si preferís denunciar por fuera de la empresa, la Comisión Nacional de Valores (CNV) tiene un canal
                externo:{' '}
                <a href="https://www.cnv.gov.ar/SitioWeb/Denuncias" target="_blank" rel="noreferrer">
                  cnv.gov.ar/SitioWeb/Denuncias
                </a>
                .
              </span>
              <span className="lang-en" aria-hidden={lang !== 'en'}>
                You may also report externally via Argentina&apos;s National Securities Commission (CNV):{' '}
                <a href="https://www.cnv.gov.ar/SitioWeb/Denuncias" target="_blank" rel="noreferrer">
                  cnv.gov.ar/SitioWeb/Denuncias
                </a>
                .
              </span>
            </p>
            <p className="den-aside-body">
              <Link href="/esg">
                <span className="lang-es" aria-hidden={lang !== 'es'}>Volver a Sustentabilidad</span>
                <span className="lang-en" aria-hidden={lang !== 'en'}>Back to Sustainability</span>
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
