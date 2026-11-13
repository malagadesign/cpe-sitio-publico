import Image from 'next/image'
import Link from 'next/link'
import { getCmsState } from '@/lib/cms'
import { getEffectiveLang } from '@/lib/lang'
import { fetchTeamMembers, type TeamMember } from '@/lib/content-fetch'
import PeopleAccordion, { type PersonRow } from './PeopleAccordion'

export const revalidate = 60

export const metadata = {
  title: 'Directorios | Inversores | Crown Point Energy',
  description:
    'Equipo ejecutivo y directorios de Crown Point Energía S.A. y Crown Point Energy Inc.',
  alternates: { canonical: 'https://crownpointenergy.com/inversores/directorios' },
}

const EXEC_FALLBACK: PersonRow[] = [
  { id: 'exec-1', name: 'Andrés Peralta', role: 'Presidente', bio: '' },
  { id: 'exec-2', name: 'Eduardo Rubén Oliver', role: 'Vicepresidente', bio: '' },
  { id: 'exec-3', name: 'Marco Esteves', role: 'CFO', bio: '' },
  { id: 'exec-4', name: 'Mauricio Orue', role: 'Gerente General', bio: '' },
]

const CPESA_FALLBACK: PersonRow[] = [
  { id: 'cpesa-1', name: 'Andrés Peralta', role: 'Director Titular' },
  { id: 'cpesa-2', name: 'Eduardo Rubén Oliver', role: 'Director Titular' },
  { id: 'cpesa-3', name: 'Isela Angélica Constantini', role: 'Director Titular' },
  { id: 'cpesa-4', name: 'Matías Agustín Peralta', role: 'Director Titular' },
  { id: 'cpesa-5', name: 'Juan Manuel Llado', role: 'Director Titular' },
  { id: 'cpesa-6', name: 'Julián Andrés Racauchi', role: 'Director Titular' },
  { id: 'cpesa-7', name: 'Rodolfo Eduardo Moresi', role: 'Comisión Fiscalizadora — Síndicos Titulares' },
  { id: 'cpesa-8', name: 'Fabiana Lucía García', role: 'Comisión Fiscalizadora — Síndicos Titulares' },
  { id: 'cpesa-9', name: 'Raúl Alberto Muñoz', role: 'Comisión Fiscalizadora — Síndicos Titulares' },
  { id: 'cpesa-10', name: 'Pablo Gastón Muñoz', role: 'Síndicos Suplentes' },
  { id: 'cpesa-11', name: 'Carlos Eduardo González', role: 'Síndicos Suplentes' },
  { id: 'cpesa-12', name: 'Analía Silvia Padín', role: 'Síndicos Suplentes' },
]

const CPI_FALLBACK: PersonRow[] = [
  { id: 'cpi-1', name: 'Pablo Bernardo Peralta', role: 'Director no independiente' },
  { id: 'cpi-2', name: 'Brian Moss', role: 'Director no independiente' },
  { id: 'cpi-3', name: 'Juan Llado', role: 'Director no independiente' },
]

function mapMember(m: TeamMember, lang: 'es' | 'en'): PersonRow {
  const role =
    m.tipo === 'board' && m.cargo_board
      ? m.cargo_board
      : lang === 'es'
        ? m.role_es || m.role_en
        : m.role_en || m.role_es
  return {
    id: m.id,
    name: m.name,
    role,
    bio: lang === 'es' ? m.bio_es || m.bio_en : m.bio_en || m.bio_es,
  }
}

function looksLikeFigmaData(members: TeamMember[]): boolean {
  const names = new Set(members.map(m => m.name.toLowerCase()))
  return names.has('andrés peralta') || names.has('andres peralta')
}

export default async function DirectoriosPage() {
  const [s, management, board] = await Promise.all([
    getCmsState(),
    fetchTeamMembers('management'),
    fetchTeamMembers('board'),
  ])
  const lang = await getEffectiveLang(s.lang as 'es' | 'en')

  const useCms = looksLikeFigmaData([...management, ...board])

  const mgmtCPESA = management.filter(m => m.entidad !== 'CPI')
  const boardCPI = board.filter(m => m.entidad === 'CPI')
  const boardCPESA = board.filter(m => m.entidad !== 'CPI')

  const exec: PersonRow[] = useCms && mgmtCPESA.length
    ? mgmtCPESA.map(m => mapMember(m, lang))
    : EXEC_FALLBACK.map(p => ({
        ...p,
        role:
          lang === 'en'
            ? ({ Presidente: 'President', Vicepresidente: 'Vice President', CFO: 'CFO', 'Gerente General': 'General Manager' } as Record<string, string>)[p.role] || p.role
            : p.role,
      }))

  const cpesa: PersonRow[] = useCms && boardCPESA.length
    ? boardCPESA.map(m => mapMember(m, lang))
    : CPESA_FALLBACK.map(p => ({
        ...p,
        role:
          lang === 'en'
            ? p.role
                .replace('Director Titular', 'Director')
                .replace('Comisión Fiscalizadora — Síndicos Titulares', 'Statutory Auditors — Titular')
                .replace('Síndicos Suplentes', 'Alternate Statutory Auditors')
            : p.role,
      }))

  const cpi: PersonRow[] = useCms && boardCPI.length
    ? boardCPI.map(m => mapMember(m, lang))
    : CPI_FALLBACK.map(p => ({
        ...p,
        role: lang === 'en' ? 'Non-independent director' : p.role,
      }))

  return (
    <div className="dir-page">
      <section className="dir-section" aria-labelledby="dir-exec-heading">
        <div className="container">
          <h1 id="dir-exec-heading" className="dir-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Equipo ejecutivo (S.A.)</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Executive team (S.A.)</span>
          </h1>
          <p className="dir-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Profesionales con más de 20 años de experiencia en upstream.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Professionals with more than 20 years of upstream experience.
            </span>
          </p>
          <PeopleAccordion people={exec} variant="exec" lang={lang} />
        </div>
      </section>

      <section className="dir-section dir-section--tight" aria-labelledby="dir-cpesa-heading">
        <div className="container">
          <p className="dir-eyebrow">Crown Point Energía S.A.</p>
          <h2 id="dir-cpesa-heading" className="dir-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Directorio CPESA</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>CPESA Board</span>
          </h2>
          <p className="dir-lede">
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Directorio y Comisión Fiscalizadora de la entidad operadora argentina.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              Board and statutory audit commission of the Argentine operating entity.
            </span>
          </p>
          <PeopleAccordion people={cpesa} variant="board" lang={lang} />
        </div>
      </section>

      <div className="dir-photo">
        <div className="container">
          <Image
            src="/inversores/directorios/photo-field.webp"
            alt={
              lang === 'es'
                ? 'Ingenieros en sitio de operaciones de Crown Point'
                : 'Engineers at a Crown Point operations site'
            }
            width={1448}
            height={1086}
            sizes="(max-width: 1400px) 100vw, 1379px"
          />
        </div>
      </div>

      <section className="dir-section dir-section--tight" aria-labelledby="dir-cpi-heading">
        <div className="container">
          <h2 id="dir-cpi-heading" className="dir-title">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Directorio CPE Inc.</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>CPE Inc. Board</span>
          </h2>
          <PeopleAccordion people={cpi} variant="board" lang={lang} />
        </div>
      </section>

      <section className="dir-esg" aria-labelledby="dir-esg-heading">
        <div className="container">
          <p className="dir-eyebrow">ESG</p>
          <h2 id="dir-esg-heading" className="dir-title dir-title--deep">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Responsabilidad corporativa</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>Corporate responsibility</span>
          </h2>
          <p className="dir-lede" style={{ color: 'var(--cp-navy-deep)' }}>
            <span className="lang-es" aria-hidden={lang !== 'es'}>
              Reportamos métricas ambientales, sociales y de gobierno bajo criterios SASB para upstream oil &amp; gas
              y las recomendaciones del TCFD.
            </span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>
              We report environmental, social and governance metrics under SASB criteria for upstream oil &amp; gas and
              TCFD recommendations.
            </span>
          </p>
          <Link href="/esg" className="dir-esg-cta">
            <span className="lang-es" aria-hidden={lang !== 'es'}>Ver reporte ESG</span>
            <span className="lang-en" aria-hidden={lang !== 'en'}>View ESG report</span>
          </Link>
          <div className="dir-esg-photo">
            <Image
              src="/inversores/directorios/photo-rig.webp"
              alt={
                lang === 'es'
                  ? 'Equipo de perforación en operaciones de Crown Point'
                  : 'Drilling rig at Crown Point operations'
              }
              width={1600}
              height={897}
              sizes="(max-width: 1400px) 100vw, 1379px"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
