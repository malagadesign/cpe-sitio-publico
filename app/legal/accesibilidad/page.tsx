import LegalPageShell from '@/components/LegalPageShell'
import { getEffectiveLang } from '@/lib/lang'

export const metadata = {
  title: 'Accesibilidad — Crown Point Energy',
  description: 'Compromiso de accesibilidad del sitio web de Crown Point Energy.',
  alternates: { canonical: 'https://crownpointenergy.com/legal/accesibilidad' },
}

export default async function AccesibilidadPage() {
  const lang = await getEffectiveLang('es')
  return (
    <LegalPageShell
      lang={lang}
      section="accesibilidad"
      titleEs="Accesibilidad"
      titleEn="Accessibility"
      ledeEs="Trabajamos para que el sitio sea usable por la mayor cantidad de personas posible."
      ledeEn="We work to make this site usable by as many people as possible."
    >
      <div className="lang-es" aria-hidden={lang !== 'es'}>
        <h2>Nuestro compromiso</h2>
        <p>
          Crown Point Energía S.A. busca que la información pública de este sitio sea comprensible y operable. El
          diseño actual prioriza contraste, tipografía legible, estructura semántica y navegación por teclado en las
          páginas principales.
        </p>

        <h2>Estándares de referencia</h2>
        <p>
          Tomamos como referencia las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 nivel AA, en la
          medida en que aplica a un sitio corporativo con contenido editorial, formularios y documentos
          descargables.
        </p>

        <h2>Limitaciones conocidas</h2>
        <p>
          Algunos documentos PDF históricos o materiales de terceros pueden no cumplir plenamente con criterios de
          accesibilidad. Mapas interactivos y contenidos embebidos pueden requerir alternativas textuales o
          asistencia adicional.
        </p>

        <h2>Contacto</h2>
        <p>
          Si encontrás una barrera de acceso o necesitás el contenido en un formato alternativo, escribinos a{' '}
          <a href="mailto:info@crownpointenergy.com">info@crownpointenergy.com</a>. Vamos a responder a la brevedad
          y a priorizar las correcciones cuando corresponda.
        </p>
      </div>

      <div className="lang-en" aria-hidden={lang !== 'en'}>
        <h2>Our commitment</h2>
        <p>
          Crown Point Energy aims to keep public information on this site understandable and operable. The current
          design prioritizes contrast, readable typography, semantic structure and keyboard navigation across core
          pages.
        </p>

        <h2>Reference standards</h2>
        <p>
          We use the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA as a reference, as applicable to a
          corporate site with editorial content, forms and downloadable documents.
        </p>

        <h2>Known limitations</h2>
        <p>
          Some historical PDFs or third-party materials may not fully meet accessibility criteria. Interactive maps
          and embedded content may require text alternatives or additional assistance.
        </p>

        <h2>Contact</h2>
        <p>
          If you encounter an access barrier or need content in an alternative format, email{' '}
          <a href="mailto:info@crownpointenergy.com">info@crownpointenergy.com</a>. We will respond promptly and
          prioritize fixes where appropriate.
        </p>
      </div>
    </LegalPageShell>
  )
}