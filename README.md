# Crown Point Energía — Sitio público

Copia independiente del sitio público de crownpointenergy.com, pensada para que la trabajen
sin acceso al sistema interno de la empresa (portal de empleados, admin, reportes).
No comparte base de datos ni credenciales con el sistema original — es un proyecto aparte.

## Qué incluye

Todas las páginas públicas del sitio: inicio, Acerca, Operaciones, Inversores, Comunicados,
ESG, Carreras, Contacto, Comercial, Línea Ética (denuncias), Búsqueda y legales. Con sus
formularios, mapas y el componente de cotización de la acción.

## Qué NO incluye (a propósito)

El portal interno de empleados, el panel de administración/CMS, los reportes financieros,
y cualquier endpoint o tabla que no use directamente una página pública. Este repo no tiene
ni necesita ninguna credencial del sistema interno de Crown Point.

## Puesta en marcha

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com) (gratis para empezar).
2. En el SQL Editor de ESE proyecto, corré en orden:
   - `supabase/schema.sql` — todas las tablas que necesita el sitio.
   - `supabase/seed-equipo.sql`, `supabase/seed-comunicados.sql`, `supabase/seed-campos-contacto.sql`
     — contenido real de referencia para no arrancar con todo vacío (opcional, pero recomendado).
3. Copiá `.env.local.example` a `.env.local` y completá con las credenciales de tu proyecto
   Supabase (Project Settings → API) y de [resend.com](https://resend.com) para los emails
   de confirmación de los formularios.
4. `npm install`
5. `npm run dev` → http://localhost:3000

## Nota sobre el contenido editable (CMS)

El contenido de texto del sitio (textos de cada sección, hero, KPIs, etc.) vive en las
tablas `cms_settings` / `cms_sections` / `cms_fields` de Supabase — se edita directo en la
tabla o armando una pantalla de administración propia sobre esas tablas (no viene incluida
acá, el admin original es parte del sistema interno que no se compartió).

## Stack

Next.js 14 (App Router) + Supabase + Chart.js (cotización de la acción) + Leaflet (mapa de
operaciones). TypeScript estricto. `npm run build` para producción, deployable en Vercel u
otro hosting compatible con Next.js.
