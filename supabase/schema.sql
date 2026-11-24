-- Schema para el sitio público de Crown Point Energía (standalone)
-- Ejecutar en el SQL Editor de un proyecto Supabase NUEVO y propio.
-- Armado a partir de las tablas que efectivamente usa el código del sitio público.

-- ───────────────────────────────────────────────────────────────
-- cms-schema.sql
-- ───────────────────────────────────────────────────────────────
-- CMS tables for Crown Point Energy corporate website
-- Run once against your Supabase project (SQL Editor or migration runner)

-- ── Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_settings (
  id         SMALLINT PRIMARY KEY DEFAULT 1,
  direction  TEXT NOT NULL DEFAULT 'corporativo',
  theme      TEXT NOT NULL DEFAULT 'light',
  lang       TEXT NOT NULL DEFAULT 'es',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cms_settings_single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS cms_sections (
  key        TEXT PRIMARY KEY,
  visible    BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_fields (
  key        TEXT PRIMARY KEY,
  value_es   TEXT NOT NULL DEFAULT '',
  value_en   TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_fields   ENABLE ROW LEVEL SECURITY;

-- Public can read
DROP POLICY IF EXISTS "public select settings" ON cms_settings;
DROP POLICY IF EXISTS "public select sections" ON cms_sections;
DROP POLICY IF EXISTS "public select fields"   ON cms_fields;
CREATE POLICY "public select settings" ON cms_settings FOR SELECT USING (true);
CREATE POLICY "public select sections" ON cms_sections FOR SELECT USING (true);
CREATE POLICY "public select fields"   ON cms_fields   FOR SELECT USING (true);

-- Authenticated users can write (admin email check is done in the API route)
DROP POLICY IF EXISTS "auth insert/update settings" ON cms_settings;
DROP POLICY IF EXISTS "auth insert/update sections" ON cms_sections;
DROP POLICY IF EXISTS "auth insert/update fields"   ON cms_fields;
CREATE POLICY "auth insert/update settings" ON cms_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth insert/update sections" ON cms_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth insert/update fields"   ON cms_fields   FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Seed default data ──────────────────────────────────────────────────────

INSERT INTO cms_settings (id, direction, theme, lang) VALUES (1, 'corporativo', 'light', 'es')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_sections (key, visible) VALUES
  ('ticker',              true),
  ('hero',                true),
  ('basinsStrip',         true),
  ('kpis',                true),
  ('ops',                 true),
  ('investor',            true),
  ('investor.quotePanel', true),
  ('investor.sparkline',  true),
  ('investor.beta',       true),
  ('investor.vol30',      true),
  ('investor.high52',     true),
  ('investor.low52',      true),
  ('investor.cap',        true),
  ('investor.shares',     true),
  ('press',               true),
  ('contact',             true)
ON CONFLICT (key) DO NOTHING;

INSERT INTO cms_fields (key, value_es, value_en) VALUES
  ('kpi.production.value', '8.672',   '8.672'),
  ('kpi.production.unit',  'boe/d',   'boe/d'),
  ('kpi.production.delta', '1Q 2026', '1Q 2026'),
  ('kpi.reserves.value',   '36.996',       '36.996'),
  ('kpi.reserves.unit',    'MMboe',        'MMboe'),
  ('kpi.reserves.delta',   'P1 Sproule',   'P1 Sproule'),
  ('kpi.ebitda.value',     'US$18M',  'US$18M'),
  ('kpi.ebitda.unit',      'LTM',     'LTM'),
  ('kpi.ebitda.delta',     '+23% YoY','+23% YoY'),
  ('kpi.blocks.value',     '6',       '6'),
  ('kpi.blocks.unit',      'bloques', 'blocks'),
  ('kpi.blocks.delta',     '4 cuencas','4 basins'),
  ('stock.price',          'CA $0.205','CA $0.205'),
  ('stock.delta',          '+0.00%',  '+0.00%'),
  ('stock.beta',           '0.93',    '0.93'),
  ('stock.vol30',          '14,210',  '14,210'),
  ('stock.high52',         'CA $0.310','CA $0.310'),
  ('stock.low52',          'CA $0.150','CA $0.150'),
  ('stock.cap',            'CA $18.4M','CA $18.4M'),
  ('stock.shares',         '89.7M',   '89.7M')
ON CONFLICT (key) DO NOTHING;

-- ───────────────────────────────────────────────────────────────
-- docs-schema.sql
-- ───────────────────────────────────────────────────────────────
-- Additional schema for document storage and maintenance mode
-- Run AFTER cms-schema.sql

-- ── Maintenance mode ───────────────────────────────────────────────────────

ALTER TABLE cms_settings ADD COLUMN IF NOT EXISTS maintenance BOOLEAN NOT NULL DEFAULT false;

-- ── Documents ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS documentos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_es    TEXT NOT NULL DEFAULT '',
  titulo_en    TEXT NOT NULL DEFAULT '',
  tipo         TEXT NOT NULL DEFAULT 'financiero',
  periodo      TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL DEFAULT '',
  file_name    TEXT NOT NULL DEFAULT '',
  file_size    BIGINT,
  publico      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public select documentos" ON documentos;
DROP POLICY IF EXISTS "auth all documentos"      ON documentos;

-- Anyone can read publicly-listed documents
CREATE POLICY "public select documentos" ON documentos
  FOR SELECT USING (publico = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "auth all documentos" ON documentos
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Storage bucket ─────────────────────────────────────────────────────────
-- NOTE: Storage policies need RLS enabled on storage.objects (done automatically
-- by Supabase). Run the INSERT first; if the bucket already exists the ON CONFLICT
-- clause silently skips it.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800,
  ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg'
  ]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read documents"  ON storage.objects;
DROP POLICY IF EXISTS "auth upload documents"  ON storage.objects;
DROP POLICY IF EXISTS "auth delete documents"  ON storage.objects;
DROP POLICY IF EXISTS "auth update documents"  ON storage.objects;

CREATE POLICY "public read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "auth upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "auth delete documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "auth update documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents');

-- ───────────────────────────────────────────────────────────────
-- editable-content-schema.sql
-- ───────────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════
-- Editable Content Schema — Crown Point Energía
-- Run this file in Supabase SQL Editor to create all CMS-editable tables.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. IR Calendar Events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ir_events (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha      DATE    NOT NULL,
  tipo       TEXT    NOT NULL DEFAULT 'results',  -- 'results' | 'agm' | 'other'
  titulo_es  TEXT    NOT NULL DEFAULT '',
  titulo_en  TEXT    NOT NULL DEFAULT '',
  nota_es    TEXT    NOT NULL DEFAULT '',
  nota_en    TEXT    NOT NULL DEFAULT '',
  activo     BOOLEAN NOT NULL DEFAULT true,
  orden      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ir_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select ir_events" ON ir_events;
DROP POLICY IF EXISTS "auth all ir_events"      ON ir_events;
CREATE POLICY "public select ir_events" ON ir_events FOR SELECT USING (activo = true);
CREATE POLICY "auth all ir_events"      ON ir_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO ir_events (fecha, tipo, titulo_es, titulo_en, nota_es, nota_en, activo, orden) VALUES
  ('2026-06-25', 'results', 'Resultados Q1 2026',       'Q1 2026 Results',       'MD&A + estados trimestrales', 'MD&A + quarterly financials', true, 1),
  ('2026-08-14', 'results', 'Resultados Q2 2026',       'Q2 2026 Results',       'MD&A + estados trimestrales', 'MD&A + quarterly financials', true, 2),
  ('2026-09-03', 'agm',     'Asamblea General Anual',   'Annual General Meeting','TSX Venture · Calgary',       'TSX Venture · Calgary',       true, 3),
  ('2026-11-13', 'results', 'Resultados Q3 2026',       'Q3 2026 Results',       'MD&A + estados trimestrales', 'MD&A + quarterly financials', true, 4)
ON CONFLICT DO NOTHING;


-- ── 2. Analyst Coverage ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ir_analysts (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  analyst    TEXT    NOT NULL DEFAULT '',
  firm       TEXT    NOT NULL DEFAULT '',
  rating_es  TEXT    NOT NULL DEFAULT '',
  rating_en  TEXT    NOT NULL DEFAULT '',
  target     TEXT    NOT NULL DEFAULT '',
  activo     BOOLEAN NOT NULL DEFAULT true,
  orden      INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ir_analysts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select ir_analysts" ON ir_analysts;
DROP POLICY IF EXISTS "auth all ir_analysts"      ON ir_analysts;
CREATE POLICY "public select ir_analysts" ON ir_analysts FOR SELECT USING (activo = true);
CREATE POLICY "auth all ir_analysts"      ON ir_analysts FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO ir_analysts (analyst, firm, rating_es, rating_en, target, activo, orden) VALUES
  ('James Harrington', 'Canaccord Genuity', 'Comprar especulativo', 'Speculative Buy', 'CA $0.45', true, 1),
  ('María López',      'Echevarría Tuesta', 'Mantener',             'Hold',            'CA $0.22', true, 2)
ON CONFLICT DO NOTHING;


-- ── 3. Obligaciones Negociables ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS obligaciones_negociables (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  serie       TEXT    NOT NULL DEFAULT '',
  monto       TEXT    NOT NULL DEFAULT '',   -- e.g. 'USD 12.5M'
  vencimiento TEXT    NOT NULL DEFAULT '',   -- e.g. '15/03/2028'
  tasa        TEXT    NOT NULL DEFAULT '',   -- e.g. '9.5% fija'
  isin        TEXT    NOT NULL DEFAULT '',
  bolsa       TEXT    NOT NULL DEFAULT '',
  activo      BOOLEAN NOT NULL DEFAULT true,
  orden       INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE obligaciones_negociables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select ons" ON obligaciones_negociables;
DROP POLICY IF EXISTS "auth all ons"      ON obligaciones_negociables;
CREATE POLICY "public select ons" ON obligaciones_negociables FOR SELECT USING (activo = true);
CREATE POLICY "auth all ons"      ON obligaciones_negociables FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO obligaciones_negociables (serie, monto, vencimiento, tasa, isin, bolsa, activo, orden) VALUES
  ('Serie I',  'USD 10.0M', '15/09/2026', '9.0% fija anual', 'ARG420810GVA5', 'MAE · BYMA', true, 1),
  ('Serie II', 'USD 12.5M', '15/03/2028', '9.5% fija anual', 'ARG420810GVB3', 'MAE · BYMA', true, 2)
ON CONFLICT DO NOTHING;


-- ── 4. Operations Blocks ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operations_blocks (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT    UNIQUE NOT NULL,
  orden         INTEGER NOT NULL DEFAULT 0,
  commodity     TEXT    NOT NULL DEFAULT 'oil',  -- 'oil' | 'gas' | 'mixed'
  eyebrow       TEXT    NOT NULL DEFAULT '',
  titulo        TEXT    NOT NULL DEFAULT '',
  lede_es       TEXT    NOT NULL DEFAULT '',
  lede_en       TEXT    NOT NULL DEFAULT '',
  card_title_es TEXT    NOT NULL DEFAULT '',
  card_title_en TEXT    NOT NULL DEFAULT '',
  chips         JSONB   NOT NULL DEFAULT '[]',   -- string[]
  body_es       TEXT[]  NOT NULL DEFAULT '{}',
  body_en       TEXT[]  NOT NULL DEFAULT '{}',
  stats         JSONB   NOT NULL DEFAULT '[]',   -- [{label_es,label_en,val_es,val_en}]
  map_stats     JSONB   NOT NULL DEFAULT '[]',   -- [{label_es,label_en,val}] for popup
  activo        BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE operations_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select ops_blocks" ON operations_blocks;
DROP POLICY IF EXISTS "auth all ops_blocks"      ON operations_blocks;
CREATE POLICY "public select ops_blocks" ON operations_blocks FOR SELECT USING (activo = true);
CREATE POLICY "auth all ops_blocks"      ON operations_blocks FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO operations_blocks (slug, orden, commodity, eyebrow, titulo, lede_es, lede_en, card_title_es, card_title_en, chips, body_es, body_en, stats, map_stats) VALUES
(
  'ppc', 1, 'oil',
  '01 · Cuenca Cuyana',
  'Puesto Pozo Cercado Oriental',
  'Concesión productiva contigua a Chañares Herrados, en el centro de Mendoza. Crown Point participa con el 50% del working interest; el operador es Tango Energy Argentina S.A.',
  'Producing concession adjacent to Chañares Herrados, in central Mendoza. Crown Point holds a 50% working interest; operator is Tango Energy Argentina S.A.',
  'Crudo liviano', 'Light crude',
  '["Light crude · Crudo liviano", "50% WI", "JV · Tango Energy Argentina", "Mendoza / Cuyana"]',
  ARRAY[
    'Crown Point participa con el 50% del working interest en este bloque ubicado en la Cuenca Cuyana, provincia de Mendoza, colindante con la concesión Chañares Herrados. El operador es Tango Energy Argentina S.A. El bloque produce crudo liviano de 33.7° API con infraestructura integrada en la zona.',
    'Producción 1Q 2026: 67 bbl/d de petróleo. El programa de workover 2026 contempla la intervención de pozos productores para incrementar la producción del área.'
  ],
  ARRAY[
    'Crown Point holds a 50% working interest in this block in the Cuyana Basin, Mendoza province, adjacent to the Chañares Herrados concession. Operator is Tango Energy Argentina S.A. The block produces 33.7° API light crude with integrated area infrastructure.',
    'Q1 2026 production: 67 bbl/d of oil. The 2026 workover program targets well interventions to increase production across the area.'
  ],
  '[{"label_es":"Participación WI","label_en":"Working interest","val":"50%"},{"label_es":"Operador","label_en":"Operator","val":"Tango Energy Argentina S.A."},{"label_es":"Calidad de crudo","label_en":"Crude quality","val":"33.7° API · Light"},{"label_es":"Provincia","label_en":"Province","val":"Mendoza / Cuyana"}]',
  '[{"label_es":"WI","label_en":"WI","val":"50%"},{"label_es":"Operador","label_en":"Operator","val":"Tango Energy"},{"label_es":"Tipo","label_en":"Type","val":"Light crude"},{"label_es":"Cuenca","label_en":"Basin","val":"Cuyana"}]'
),
(
  'chanares', 2, 'oil',
  '02 · Cuenca Cuyana',
  'Chañares Herrados',
  'Concesión productiva en el centro de Mendoza, con crudo mediano (31.94° API). Crown Point participa con el 50% del working interest; el operador es Tango Energy Argentina S.A.',
  'Producing oil concession located in the Cuyana Basin, Mendoza Province, medium crude (31.94° API). Crown Point holds a 50% working interest; operator is Tango Energy Argentina S.A. Net 10.5 km² (2.520 net acres).',
  'Crudo mediano', 'Medium crude',
  '["Medium crude · Crudo mediano", "50% WI", "JV · Tango Energy Argentina", "Mendoza / Cuyana"]',
  ARRAY[
    'Crown Point participa con el 50% del working interest en este bloque ubicado en la Cuenca Cuyana, provincia de Mendoza. El operador es Tango Energy Argentina S.A. El bloque produce crudo mediano de 31.94° API con infraestructura conectada al oleoducto Allanito–Luján de Cuyo.',
    'Producción 1Q 2026: 415 bbl/d de petróleo. El programa de workover 2026 contempla la intervención de pozos productores con un objetivo de incremento de producción.'
  ],
  ARRAY[
    'Crown Point holds a 50% working interest in this block located in the Cuyana Basin, Mendoza province. Operator is Tango Energy Argentina S.A. The block produces 31.94° API medium crude with infrastructure connected to the Allanito–Luján de Cuyo pipeline.',
    'Q1 2026 production: 415 bbl/d of oil. The 2026 workover program targets well interventions for production uplift.'
  ],
  '[{"label_es":"Participación WI","label_en":"Working interest","val":"50%"},{"label_es":"Operador","label_en":"Operator","val":"Tango Energy Argentina S.A."},{"label_es":"Calidad de crudo","label_en":"Crude quality","val":"31.94° API"},{"label_es":"Superficie","label_en":"Acreage","val":"2.520 acres · 10.5 km²"},{"label_es":"Provincia","label_en":"Province","val":"Mendoza / Cuyana"}]',
  '[{"label_es":"WI","label_en":"WI","val":"50%"},{"label_es":"Operador","label_en":"Operator","val":"Tango Energy"},{"label_es":"Calidad","label_en":"Quality","val":"31.94° API"},{"label_es":"Cuenca","label_en":"Basin","val":"Cuyana"}]'
),
(
  'cerro', 6, 'oil',
  '03 · Cuenca Neuquina',
  'Cerro de Los Leones',
  'Bloque exploratorio de 101.208 hectáreas en el norte de la Cuenca Neuquina, provincia de Mendoza, con potencial convencional y no convencional.',
  '101.208-hectare exploration block in the northern Neuquén Basin, Mendoza province, with both conventional and unconventional potential.',
  'Estructura del bloque', 'Block structure',
  '["100% Operador / Operator", "Exploratorio / Exploration"]',
  ARRAY[
    'El área se encuentra en la parte norte del play Vaca Muerta, con prospectos convencionales en formaciones Tordillo, Quintuco y Mulichinco. Los estudios sísmicos 3D adquiridos en 2023 confirmaron presencia de hidrocarburos en cuatro estructuras independientes.',
    'Permiso CLL: el 18 de mayo de 2026, el Ministerio de Energía y Ambiente de la Provincia de Mendoza emitió la Resolución N.° 86/2026, que otorga una prórroga de un año del plazo del Permiso CLL hasta el 18 de mayo de 2027, sujeta a que la Compañía cumpla con todas las condiciones vigentes del permiso, incluida la presentación de un programa de trabajo revisado.'
  ],
  ARRAY[
    'The area sits within the northern extension of the unconventional Vaca Muerta shale play; conventional prospects are found in the Tordillo, Quintuco and Mulichinco formations. 3D seismic acquired in 2023 identified indicators of hydrocarbon presence across four independent structures.',
    'CLL Permit: On May 18, 2026, the Ministry of Energy and Environment of the Province of Mendoza issued Resolution No. 86/2026, which grants a one-year extension of the term of the CLL Permit until May 18, 2027 subject to the Company complying with all existing conditions under the permit including the submission of a revised work program.'
  ],
  '[{"label_es":"Superficie","label_en":"Acreage","val":"101.208 ha"},{"label_es":"Profundidad objetivo","label_en":"Target depth","val":"2.800–3.600 m"},{"label_es":"Producción actual","label_en":"Current production","val":"—"},{"label_es":"Prórroga permiso","label_en":"Permit extension","val":"May 2027"},{"label_es":"Provincia","label_en":"Province","val":"Mendoza"}]',
  '[{"label_es":"WI","label_en":"WI","val":"100%"},{"label_es":"Superficie","label_en":"Acreage","val":"101.208 ha"},{"label_es":"Estado","label_en":"Status","val":"Exploratorio / Exploration"},{"label_es":"Prórroga permiso","label_en":"Permit extension","val":"May 2027"}]'
),
(
  'tordillo', 3, 'mixed',
  '04 · Golfo San Jorge · Chubut',
  'El Tordillo · La Tapera · Puesto Quiroga',
  'Tres concesiones contiguas en el flanco norte de la Cuenca del Golfo San Jorge, provincia de Chubut. Crown Point opera con el 95% del working interest. El bloque productivo más grande de la compañía.',
  'Three contiguous concessions on the northern flank of the San Jorge Gulf Basin, Chubut province. Crown Point operates with a 95% working interest. The company''s largest producing block.',
  'Producción consolidada', 'Consolidated production',
  '["95 % WI", "Operador / Operator", "Crudo & Gas / Oil & Gas"]',
  ARRAY[
    'Tres concesiones operadas por Crown Point Energía S.A. con el 95% del working interest: El Tordillo, La Tapera y Puesto Quiroga, en la provincia de Chubut, flanco norte de la Cuenca del Golfo San Jorge. Área total de 430 km² netos.',
    'Producción 1Q 2026: 4.164 bbl/d de petróleo y 3.451 Mcf/d de gas natural (4.739 boe/d totales). Cuenta con 264 pozos activos y 88 pozos inyectores. La concesión vence el 14/11/2027 con extensión acordada por 20 años (hasta noviembre de 2047).'
  ],
  ARRAY[
    'Three concessions operated by Crown Point Energía S.A. with a 95% working interest: El Tordillo, La Tapera and Puesto Quiroga, in Chubut province, northern flank of the San Jorge Gulf Basin. Total net area of 430 km².',
    'Q1 2026 production: 4.164 bbl/d of oil and 3.451 Mcf/d of natural gas (4.739 boe/d total). The block has 264 active producers and 88 injector wells. Concession expires 14/11/2027 with an agreed 20-year extension (to November 2047).'
  ],
  '[{"label_es":"Producción petróleo","label_en":"Oil production","val":"4.164 bbl/d"},{"label_es":"Producción gas","label_en":"Gas production","val":"3.451 Mcf/d"},{"label_es":"Producción total boe","label_en":"Total boe","val":"4.739 boe/d"},{"label_es":"Pozos activos","label_en":"Active wells","val":"264"},{"label_es":"Pozos inyectores","label_en":"Injector wells","val":"88"},{"label_es":"Superficie","label_en":"Acreage","val":"113.325 acres · 430 km²"},{"label_es":"Vencimiento","label_en":"Expiry","val":"Nov 2047 (ext.)"}]',
  '[{"label_es":"WI","label_en":"WI","val":"95%"},{"label_es":"Prod. petróleo","label_en":"Oil prod.","val":"4.164 bbl/d"},{"label_es":"Prod. gas","label_en":"Gas prod.","val":"3.451 Mcf/d"},{"label_es":"Pozos activos","label_en":"Active wells","val":"264"}]'
),
(
  'piedra', 4, 'oil',
  '04 · Golfo San Jorge · Santa Cruz',
  'Piedra Clavada – Koluel Kaike',
  'Concesión de explotación operada al 100% en la Cuenca del Golfo San Jorge, provincia de Santa Cruz. Crown Point busca aumentar la producción mediante perforaciones, workovers y optimización de instalaciones.',
  '100%-operated exploitation concession in the San Jorge Basin, Santa Cruz province. Crown Point targets production growth through drilling, workovers and facilities optimisation.',
  'Activo de crecimiento', 'Growth asset',
  '["100% WI", "Operador / Operator", "Crudo pesado / Heavy crude"]',
  ARRAY[
    'Crown Point tiene una participación operada del 100% en la Concesión de Explotación Piedra Clavada Koluel Kaike, que representa un total de 71.660 acres netos en la Cuenca del Golfo San Jorge. La estrategia de Crown Point es aumentar la producción a través de perforaciones y workovers de pozos, y optimización de instalaciones.',
    'El crudo se entrega a compradores locales conectados a la infraestructura de la Cuenca del Golfo San Jorge en la provincia de Santa Cruz. Producción 1Q 2026: 2.568 bbl/d de petróleo.'
  ],
  ARRAY[
    'Crown Point holds a 100% operated working interest in the Piedra Clavada Koluel Kaike Exploitation Concession, representing a total of net 290 km² (71.660 net acres) in the San Jorge Basin. Crown Point''s strategy is to increase production through well drilling and workovers, and facilities optimisation.',
    'Crude is delivered to local buyers connected to the San Jorge Basin infrastructure in Santa Cruz province. Q1 2026 production: 2.568 bbl/d of oil.'
  ],
  '[{"label_es":"Producción petróleo","label_en":"Oil production","val":"2.568 bbl/d"},{"label_es":"Pozos activos","label_en":"Active wells","val":"403"},{"label_es":"Pozos inyectores","label_en":"Injector wells","val":"143"},{"label_es":"Superficie","label_en":"Acreage","val":"8.840 ha"},{"label_es":"Calidad de crudo","label_en":"Crude quality","val":"21° API"},{"label_es":"Vencimiento","label_en":"Expiry","val":"2049"}]',
  '[{"label_es":"WI","label_en":"WI","val":"100%"},{"label_es":"Prod. petróleo","label_en":"Oil prod.","val":"2.568 bbl/d"},{"label_es":"Pozos activos","label_en":"Active wells","val":"403"},{"label_es":"Vencimiento","label_en":"Expiry","val":"2049"}]'
),
(
  'tdf', 5, 'mixed',
  '05 · Cuenca Austral · Tierra del Fuego',
  'Río Cullen · Las Violetas · La Angostura',
  'Tres concesiones de explotación en la Cuenca Austral de Tierra del Fuego. Crown Point tiene una participación no operada del 48.3275%, con producción de petróleo y gas.',
  'Three exploitation concessions in the Austral Basin of Tierra del Fuego. Crown Point holds a 48.3275% non-operated working interest, producing oil and gas.',
  'Operación productiva', 'Producing operation',
  '["48.3275% WI", "Participación / Working interest", "Petróleo & Gas / Oil & Gas", "Vence Ago 2026 / Expires Aug 2026"]',
  ARRAY[
    'Crown Point tiene una participación no operada del 48.3275% en las 3 concesiones de explotación de Río Cullen, La Angostura y Las Violetas en la Cuenca Austral de Tierra del Fuego, lo que representa un total de 489.000 acres brutos (169.880 acres netos). La estrategia de Crown Point es aumentar la producción de sus activos en Tierra del Fuego mediante perforación de exploración y desarrollo, respaldada por una amplia cobertura sísmica 3D.',
    'Las plantas de tratamiento están conectadas al sistema TGS para entrega de gas, y al oleoducto regional para crudo y condensado. Producción 1Q 2026: 242 bbl/d de petróleo, 4 bbl/d de LPG, 3.821 Mcf/d de gas natural (883 boe/d total).'
  ],
  ARRAY[
    'Crown Point holds a 48.3275% non-operated working interest in the 3 exploitation concessions of Río Cullen, La Angostura and Las Violetas in the Austral Basin of Tierra del Fuego, representing a total of 688 km² (169.880 net acres). Crown Point''s strategy is to grow production from its Tierra del Fuego assets through exploration and development drilling, supported by extensive 3D seismic coverage.',
    'The processing plants are connected to the TGS gas pipeline system and to the regional crude and condensate pipeline. Q1 2026 production: 242 bbl/d of oil, 4 bbl/d of LPG, 3.821 Mcf/d of natural gas (883 boe/d total).'
  ],
  '[{"label_es":"Producción petróleo","label_en":"Oil production","val":"242 bbl/d"},{"label_es":"Producción LPG","label_en":"LPG production","val":"4 bbl/d"},{"label_es":"Producción gas","label_en":"Gas production","val":"3.821 Mcf/d"},{"label_es":"Producción total boe","label_en":"Total boe","val":"883 boe/d"},{"label_es":"Superficie bruta","label_en":"Gross acreage","val":"489.000 acres"},{"label_es":"Superficie neta","label_en":"Net acreage","val":"169.880 acres"},{"label_es":"Vencimiento","label_en":"Expiry","val":"Aug 2026"}]',
  '[{"label_es":"WI","label_en":"WI","val":"48.3275%"},{"label_es":"Prod. petróleo","label_en":"Oil prod.","val":"242 bbl/d"},{"label_es":"Prod. gas","label_en":"Gas prod.","val":"3.821 Mcf/d"},{"label_es":"Total boe","label_en":"Total boe","val":"883 boe/d"},{"label_es":"Vencimiento","label_en":"Expiry","val":"Aug 2026"}]'
)
ON CONFLICT (slug) DO NOTHING;

-- Normalise eyebrow numbering and orden per BJM22 doc (idempotent — safe to re-run)
UPDATE operations_blocks SET eyebrow = '01 · Golfo San Jorge · Chubut',           orden = 1 WHERE slug = 'tordillo';
UPDATE operations_blocks SET eyebrow = '02 · Golfo San Jorge · Santa Cruz',       orden = 2 WHERE slug = 'piedra';
UPDATE operations_blocks SET eyebrow = '03 · Cuenca Cuyana',                      orden = 3 WHERE slug = 'chanares';
UPDATE operations_blocks SET eyebrow = '04 · Cuenca Cuyana',                      orden = 4 WHERE slug = 'ppc';
UPDATE operations_blocks SET eyebrow = '05 · Cuenca Austral · Tierra del Fuego',  orden = 5 WHERE slug = 'tdf';
UPDATE operations_blocks SET eyebrow = '06 · Cuenca Neuquina · Exploratorio',     orden = 6 WHERE slug = 'cerro';


-- ── 5. Team Members (Management + Board) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT    NOT NULL DEFAULT '',
  role_es      TEXT    NOT NULL DEFAULT '',
  role_en      TEXT    NOT NULL DEFAULT '',
  bio_es       TEXT    NOT NULL DEFAULT '',
  bio_en       TEXT    NOT NULL DEFAULT '',
  initials     TEXT    NOT NULL DEFAULT '',
  bg           TEXT    NOT NULL DEFAULT 'linear-gradient(135deg,#1F2566,#4F5478)',
  tipo         TEXT    NOT NULL DEFAULT 'management', -- 'management' | 'board'
  cargo_board  TEXT    NOT NULL DEFAULT '',  -- Board-only: 'Chairman', 'Director', etc.
  independiente BOOLEAN,
  orden        INTEGER NOT NULL DEFAULT 0,
  activo       BOOLEAN NOT NULL DEFAULT true,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select team" ON team_members;
DROP POLICY IF EXISTS "auth all team"      ON team_members;
CREATE POLICY "public select team" ON team_members FOR SELECT USING (activo = true);
CREATE POLICY "auth all team"      ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO team_members (name, role_es, role_en, bio_es, bio_en, initials, bg, tipo, cargo_board, independiente, orden) VALUES
  ('Andrés Suárez', 'CEO & Presidente', 'CEO & President', '25 años en upstream argentino. Ingeniero en Petróleo (UBA), MBA IAE.', '25 years in Argentine upstream. Petroleum Engineer (UBA), IAE MBA.', 'AS', 'linear-gradient(135deg,#1F2566,#4F5478)', 'management', '', NULL, 1),
  ('Mariano Vega',  'CFO',              'CFO',             '18 años en mercados de capital. Ex Macro Securities, ex YPF Treasury.',  '18 years in capital markets. Ex Macro Securities, ex YPF Treasury.',  'MV', 'linear-gradient(135deg,#6CAE52,#4E8A38)', 'management', '', NULL, 2),
  ('Laura Ramos',   'COO',              'COO',             '22 años de experiencia operativa en Cuenca Neuquina y Cuyana.',          '22 years of operational experience in the Neuquén and Cuyana basins.', 'LR', 'linear-gradient(135deg,#B05E2A,#8A3F1A)', 'management', '', NULL, 3),
  ('Diego García',  'VP Operaciones',   'VP Operations',   'Ex Pluspetrol. Geólogo (UNLP). Especialista en Golfo San Jorge.',       'Ex Pluspetrol. Geologist (UNLP). San Jorge specialist.',              'DG', 'linear-gradient(135deg,#C9A24A,#A37F2C)', 'management', '', NULL, 4),
  ('Brian Moss',     '', '', '', '', 'BM', 'linear-gradient(135deg,#1F2566,#4F5478)', 'board', 'Chairman', true,  1),
  ('Andrés Suárez',  '', '', '', '', 'AS', 'linear-gradient(135deg,#1F2566,#4F5478)', 'board', 'CEO & Director', false, 2),
  ('Camila Pereyra', '', '', '', '', 'CP', 'linear-gradient(135deg,#6CAE52,#4E8A38)', 'board', 'Director', true,  3),
  ('Edward Brown',   '', '', '', '', 'EB', 'linear-gradient(135deg,#2FA08A,#1A7D68)', 'board', 'Director', true,  4),
  ('Roberto Cuevas', '', '', '', '', 'RC', 'linear-gradient(135deg,#C9A24A,#A37F2C)', 'board', 'Director', true,  5)
ON CONFLICT DO NOTHING;


-- ── 6. Strategy Cards ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS strategy_cards (
  id       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  num      TEXT    NOT NULL DEFAULT '01',
  title_es TEXT    NOT NULL DEFAULT '',
  title_en TEXT    NOT NULL DEFAULT '',
  body_es  TEXT    NOT NULL DEFAULT '',
  body_en  TEXT    NOT NULL DEFAULT '',
  orden    INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE strategy_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select strategy" ON strategy_cards;
DROP POLICY IF EXISTS "auth all strategy"      ON strategy_cards;
CREATE POLICY "public select strategy" ON strategy_cards FOR SELECT USING (true);
CREATE POLICY "auth all strategy"      ON strategy_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO strategy_cards (num, title_es, title_en, body_es, body_en, orden) VALUES
  ('01', 'Producción base',      'Base production',       'Sostener y optimizar la producción existente con workovers y recuperación secundaria. La base genera el cash flow que financia el crecimiento.', 'Sustain and optimize existing production with workovers and secondary recovery. The base generates the cash flow that funds growth.', 1),
  ('02', 'Disciplina de capital','Capital discipline',    'Solo aprobamos proyectos con TIR esperada > 30% a precios conservadores. Mantenemos Net Debt/EBITDA por debajo de 1,5x en todo momento.', 'We only approve projects with expected IRR > 30% at conservative prices. We keep Net Debt/EBITDA below 1.5x at all times.', 2),
  ('03', 'Adquisición selectiva','Selective acquisition', 'Crecemos por adquisición de bloques productivos con upside operativo identificable, priorizando cuencas donde ya operamos.', 'We grow by acquiring producing blocks with identifiable operational upside, prioritizing basins where we already operate.', 3),
  ('04', 'Vinculación honesta',  'Honest engagement',     'Reportamos con transparencia. Cumplimos con NI 51-101 y NI 52-110. Trabajamos cerca de comunidades locales en cada bloque.', 'We report transparently. We comply with NI 51-101 and NI 52-110. We work closely with local communities at every block.', 4)
ON CONFLICT DO NOTHING;


-- ── 7. Open Positions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS open_positions (
  id       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  area     TEXT    NOT NULL DEFAULT '',
  location TEXT    NOT NULL DEFAULT '',
  tipo     TEXT    NOT NULL DEFAULT 'Full-time',
  activo   BOOLEAN NOT NULL DEFAULT true,
  orden    INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE open_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select positions" ON open_positions;
DROP POLICY IF EXISTS "auth all positions"      ON open_positions;
CREATE POLICY "public select positions" ON open_positions FOR SELECT USING (activo = true);
CREATE POLICY "auth all positions"      ON open_positions FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO open_positions (area, location, tipo, activo, orden) VALUES
  ('Ingeniería de yacimientos', 'Buenos Aires / Chubut',  'Full-time', true, 1),
  ('Geología & geofísica',      'Buenos Aires / Mendoza', 'Full-time', true, 2),
  ('HSE & ESG Coordinator',     'Buenos Aires',           'Full-time', true, 3),
  ('Finance & IR Analyst',      'Buenos Aires',           'Full-time', true, 4)
ON CONFLICT DO NOTHING;


-- ── 8. Culture Cards (Carreras) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS culture_cards (
  id       UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT    NOT NULL DEFAULT '',
  title_en TEXT    NOT NULL DEFAULT '',
  desc_es  TEXT    NOT NULL DEFAULT '',
  desc_en  TEXT    NOT NULL DEFAULT '',
  color    TEXT    NOT NULL DEFAULT '#C9A24A',
  icon_key TEXT    NOT NULL DEFAULT 'shield',  -- 'shield' | 'sun' | 'people' | 'chart'
  orden    INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE culture_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select culture" ON culture_cards;
DROP POLICY IF EXISTS "auth all culture"      ON culture_cards;
CREATE POLICY "public select culture" ON culture_cards FOR SELECT USING (true);
CREATE POLICY "auth all culture"      ON culture_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO culture_cards (title_es, title_en, desc_es, desc_en, color, icon_key, orden) VALUES
  ('Seguridad primero', 'Safety first',        'Ningún trabajo justifica poner en riesgo la integridad de las personas. Trabajamos con permisos de trabajo, análisis de riesgo y cultura de stop-work authority.', 'No job justifies putting people at risk. We operate with work permits, risk analysis and a stop-work authority culture.', '#C9A24A', 'shield',  1),
  ('Innovación aplicada', 'Applied innovation','Resolvemos desafíos técnicos reales: desde sísmica 3D en zonas remotas hasta optimización de inyección de agua con machine learning.', 'We solve real technical challenges: from 3D seismic in remote areas to waterflood optimisation with machine learning.', '#6CAE52', 'sun',     2),
  ('Equipo diverso',    'Diverse team',         'Nuestro equipo combina trayectorias locales e internacionales en geología, ingeniería, finanzas y ESG. Valoramos perspectivas distintas.', 'Our team combines local and international backgrounds in geology, engineering, finance and ESG. We value different perspectives.', '#2FA08A', 'people',  3),
  ('Impacto medible',   'Measurable impact',    'Trabajamos con métricas claras: producción, costos, reservas, emisiones. Cada área tiene objetivos cuantificables y visibility en los resultados de la compañía.', 'We work with clear metrics: production, costs, reserves, emissions. Every area has quantifiable goals and visibility into company results.', '#1F2566', 'chart',   4)
ON CONFLICT DO NOTHING;


-- ── 9. ESG Pillar Data ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS esg_pillar_data (
  pilar          TEXT    PRIMARY KEY,  -- 'ambiental' | 'social' | 'gobernanza'
  color          TEXT    NOT NULL DEFAULT '#2FA08A',
  lede_es        TEXT    NOT NULL DEFAULT '',
  lede_en        TEXT    NOT NULL DEFAULT '',
  metrics        JSONB   NOT NULL DEFAULT '[]',   -- [{labelEs, labelEn, val}]
  initiatives_es TEXT[]  NOT NULL DEFAULT '{}',
  initiatives_en TEXT[]  NOT NULL DEFAULT '{}',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE esg_pillar_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select esg" ON esg_pillar_data;
DROP POLICY IF EXISTS "auth all esg"      ON esg_pillar_data;
CREATE POLICY "public select esg" ON esg_pillar_data FOR SELECT USING (true);
CREATE POLICY "auth all esg"      ON esg_pillar_data FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO esg_pillar_data (pilar, color, lede_es, lede_en, metrics, initiatives_es, initiatives_en) VALUES
(
  'ambiental', '#2FA08A',
  'Operamos con un enfoque de minimización de impactos y reducción progresiva de emisiones en todos nuestros bloques.',
  'We operate with a focus on minimising impacts and progressively reducing emissions across all our blocks.',
  '[{"labelEs":"Reducción de emisiones (2024 vs. 2022)","labelEn":"Emissions reduction (2024 vs. 2022)","val":"−18%"},{"labelEs":"Gas antorcha quemado (% de producción)","labelEn":"Gas flared (% of production)","val":"<2.1%"},{"labelEs":"Agua reinyectada / producida","labelEn":"Water reinjected / produced","val":"94%"},{"labelEs":"Pozos remediados 2024","labelEn":"Remediated wells 2024","val":"11"}]',
  ARRAY[
    'Programa de monitoreo continuo de emisiones fugitivas en todas las instalaciones de superficie.',
    'Electrificación progresiva de compresores en Tordillo con generación fotovoltaica solar.',
    'Sistema de gestión ambiental certificado bajo ISO 14001 en las operaciones de Tierra del Fuego.'
  ],
  ARRAY[
    'Continuous fugitive emission monitoring programme at all surface facilities.',
    'Progressive electrification of Tordillo compressors with solar photovoltaic generation.',
    'Environmental management system certified under ISO 14001 for Tierra del Fuego operations.'
  ]
),
(
  'social', '#6CAE52',
  'Las comunidades donde operamos son parte de nuestra estrategia. Generamos empleo local, apoyamos educación técnica y mantenemos estándares de salud y seguridad de primer nivel.',
  'The communities where we operate are part of our strategy. We generate local employment, support technical education and maintain world-class health and safety standards.',
  '[{"labelEs":"Empleados directos","labelEn":"Direct employees","val":"328"},{"labelEs":"Empleados locales (en provincia)","labelEn":"Local employees (in province)","val":"71%"},{"labelEs":"Horas de capacitación / empleado","labelEn":"Training hours / employee","val":"42h"},{"labelEs":"Tasa de accidentes (TRIR)","labelEn":"Accident rate (TRIR)","val":"0.87"}]',
  ARRAY[
    'Programa de becas universitarias para hijos de colaboradores y estudiantes de comunidades aledañas a los bloques operativos.',
    'Acuerdos con institutos técnicos en Mendoza, Chubut y Tierra del Fuego para formación de técnicos en petróleo y gas.',
    'Clínicas móviles de salud y audiciones periódicas en localidades cercanas a los bloques en zonas remotas.'
  ],
  ARRAY[
    'University scholarship programme for employees'' children and students from communities near operating blocks.',
    'Agreements with technical institutes in Mendoza, Chubut and Tierra del Fuego for oil and gas technician training.',
    'Mobile health clinics and periodic health screenings in communities near remote operating blocks.'
  ]
),
(
  'gobernanza', '#C9A24A',
  'Reportamos bajo estándares canadienses con directorio mayoritariamente independiente, política anti-corrupción, línea ética y divulgación completa en SEDAR+.',
  'We report under Canadian standards with a majority-independent board, anti-corruption policy, ethics hotline and full disclosure on SEDAR+.',
  '[{"labelEs":"Directores independientes","labelEn":"Independent directors","val":"4/5"},{"labelEs":"Directoras mujeres","labelEn":"Female directors","val":"2"},{"labelEs":"Auditores externos","labelEn":"External auditors","val":"KPMG"},{"labelEs":"Cotización regulatoria","labelEn":"Regulatory listing","val":"TSXV · CNV"}]',
  ARRAY[
    'Código de Ética aplicable a todos los directores, ejecutivos, empleados y contratistas, con línea de reporte confidencial.',
    'Política de anti-corrupción y anti-soborno conforme a la Ley Canadiense de Corrupción de Funcionarios Extranjeros (CFPOA).',
    'Política de diversidad en el directorio con objetivo del 30% de representación de géneros no predominantes para 2027.'
  ],
  ARRAY[
    'Code of Ethics applicable to all directors, officers, employees and contractors, with a confidential reporting hotline.',
    'Anti-corruption and anti-bribery policy in compliance with the Canadian Corruption of Foreign Public Officials Act (CFPOA).',
    'Board diversity policy with a target of 30% non-predominant gender representation by 2027.'
  ]
)
ON CONFLICT (pilar) DO NOTHING;


-- ── 10. Seed hero text into cms_fields ─────────────────────────────────────
-- These are all page hero texts — h1 and lede paragraph (bilingual)

INSERT INTO cms_fields (key, value_es, value_en) VALUES
  -- Inversores
  ('page.inversores.h1',   'Una historia sólida<br/>de creación de valor.',              'A solid story<br/>of value creation.'),
  ('page.inversores.lede', 'Crown Point Energía S.A. es una empresa dedicada al petróleo y gas con cobertura internacional que opera en el mercado argentino. Su empresa holding Crown Point Energy Inc. cotiza en el TSX Venture Exchange (TSXV) bajo el símbolo "CWV". La Compañía está constituida en Canadá y tiene su sede central en Buenos Aires, Argentina.',
                            'Crown Point Energy Inc. is a public company incorporated in Alberta, Canada and listed on the TSX Venture Exchange (TSXV) under the symbol "CWV". Crown Point operates in Argentina through its wholly owned subsidiary Crown Point Energía S.A. headquartered in Buenos Aires.'),
  -- Operaciones
  ('page.operaciones.h1',   'Once concesiones.<br/>Cuatro cuencas.<br/>Un país.',            'Eleven concessions.<br/>Four basins.<br/>One country.'),
  ('page.operaciones.lede', 'Una cartera diversificada de áreas productivas y exploratorias, distribuidas estratégicamente entre el centro y el sur de Argentina.',
                             'A diversified portfolio of producing assets with development and exploration upside, strategically distributed across central and southern Argentina.'),
  -- Acerca de
  ('page.acerca.h1',   'Producción real,<br/>base sólida,<br/>visión de largo plazo.',  'Real production,<br/>solid foundation,<br/>long-term vision.'),
  ('page.acerca.lede', 'Crown Point Energía S.A. opera en el mercado argentino con casa matriz internacional. Dedicada al petróleo y gas con sede en Buenos Aires, genera flujo de caja de su propia producción y mantiene una cartera de oportunidades en las cuencas Austral, Neuquina y Cuyana. La empresa holding Crown Point Energy Inc. cotiza en TSXV: CWV.',
                        'Crown Point Energy Inc. is listed on TSX Venture Exchange: CWV. The Company operates in Argentina through its wholly owned subsidiary, Crown Point Energía S.A. (CPESA), headquartered in Buenos Aires.'),
  -- ESG
  ('page.esg.h1',   'Operar responsablemente.<br/>Reportar con claridad.',  'Operate responsibly.<br/>Report with clarity.'),
  ('page.esg.lede', 'Nuestra estrategia ESG integra la responsabilidad ambiental, el compromiso social y la gobernanza robusta como pilares de creación de valor a largo plazo.',
                     'Our ESG strategy integrates environmental responsibility, social commitment and robust governance as pillars of long-term value creation.'),
  -- Carreras
  ('page.carreras.h1',   'Construimos el futuro<br/>del energético argentino.',          'Building Argentina''s<br/>energy future.'),
  ('page.carreras.lede', 'Crown Point opera en cuatro cuencas. Buscamos profesionales que quieran dejar huella en la industria energética con un equipo técnico de alto nivel.',
                          'Crown Point operates across four basins. We look for professionals who want to make a mark in the energy industry alongside a top-tier technical team.'),
  -- Contacto
  ('page.contacto.h1',   'Hablemos.',        'Let''s talk.'),
  ('page.contacto.lede', 'Inversores, medios de comunicación, empleo, proveedores y comunidades. Encontrá el contacto correcto para tu consulta.',
                          'Investors, media, employment, suppliers and communities. Find the right contact for your enquiry.')
ON CONFLICT (key) DO NOTHING;

-- ───────────────────────────────────────────────────────────────
-- comunicados-schema.sql
-- ───────────────────────────────────────────────────────────────
-- Schema for press releases (comunicados de prensa)
-- Run AFTER docs-schema.sql

CREATE TABLE IF NOT EXISTS comunicados (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha       DATE NOT NULL,
  titulo_es   TEXT NOT NULL DEFAULT '',
  titulo_en   TEXT NOT NULL DEFAULT '',
  resumen_es  TEXT NOT NULL DEFAULT '',
  resumen_en  TEXT NOT NULL DEFAULT '',
  url         TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL DEFAULT '',
  file_name   TEXT NOT NULL DEFAULT '',
  tipo        TEXT NOT NULL DEFAULT 'general',
  publicado   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public select comunicados" ON comunicados;
DROP POLICY IF EXISTS "auth all comunicados"      ON comunicados;

CREATE POLICY "public select comunicados" ON comunicados
  FOR SELECT USING (publicado = true);

CREATE POLICY "auth all comunicados" ON comunicados
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Index for year-based queries
CREATE INDEX IF NOT EXISTS comunicados_fecha_idx ON comunicados (fecha DESC);

-- ───────────────────────────────────────────────────────────────
-- contact-ir-schema.sql
-- ───────────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════
-- Contact Submissions + IR Subscribers — Crown Point Energía
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Contact form submissions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo         TEXT    NOT NULL DEFAULT '',
  nombre       TEXT    NOT NULL DEFAULT '',
  organizacion TEXT    NOT NULL DEFAULT '',
  email        TEXT    NOT NULL DEFAULT '',
  telefono     TEXT    NOT NULL DEFAULT '',
  mensaje      TEXT    NOT NULL DEFAULT '',
  estado       TEXT    NOT NULL DEFAULT 'nueva',  -- 'nueva' | 'respondida' | 'archivada'
  notas        TEXT    NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "auth all contact" ON contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── IR mailing list subscribers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ir_subscribers (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     TEXT    NOT NULL DEFAULT '',
  email      TEXT    UNIQUE NOT NULL,
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ir_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert ir_sub" ON ir_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "public update ir_sub" ON ir_subscribers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "auth all ir_sub" ON ir_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ───────────────────────────────────────────────────────────────
-- ir-documents-schema-and-seed.sql
-- ───────────────────────────────────────────────────────────────
-- Crown Point Energy -- IR Documents schema + seed
-- Source: crownpointenergy.com · Scraped 2026-06-29
-- Financial CPI: 74, CPESA: 26, AGM: 11, ESTMA: 10, Governance: 9
-- URLs are direct PDF links (documents from Supabase are NOT duplicated here)
-- Safe to re-run: ON CONFLICT (url) DO NOTHING

CREATE TABLE IF NOT EXISTS ir_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria   TEXT NOT NULL,
  entidad     TEXT NOT NULL DEFAULT 'CPI',
  fecha       DATE,
  periodo     TEXT NOT NULL DEFAULT '',
  tipo        TEXT NOT NULL DEFAULT '',
  titulo_en   TEXT NOT NULL DEFAULT '',
  titulo_es   TEXT NOT NULL DEFAULT '',
  url         TEXT NOT NULL DEFAULT '',
  publicado   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ir_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public select ir_documents" ON ir_documents;
CREATE POLICY "public select ir_documents" ON ir_documents
  FOR SELECT USING (publicado = true);
DROP POLICY IF EXISTS "auth all ir_documents" ON ir_documents;
CREATE POLICY "auth all ir_documents" ON ir_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS ir_documents_categoria_idx ON ir_documents (categoria);
CREATE INDEX IF NOT EXISTS ir_documents_fecha_idx ON ir_documents (fecha DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ir_documents_url_key'
  ) THEN
    ALTER TABLE ir_documents ADD CONSTRAINT ir_documents_url_key UNIQUE (url);
  END IF;
END $$;

INSERT INTO ir_documents (categoria, entidad, fecha, periodo, tipo, titulo_en, titulo_es, url, publicado)
VALUES
  ('financiero', 'CPI', '2026-01-01', 'Dec 31, 2025', 'MDA', 'December 31, 2025 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2026/05/2025-Annual-MDA-Crown-Point-Energy-Inc_.pdf', true),
  ('financiero', 'CPI', '2026-01-01', 'Dec 31, 2025', 'FS', 'Annual Financial Statements 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2026/05/2025-Audited-Annual-Financial-Statements-Crown-Point-Energy-Inc_.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Jun 30, 2025', 'MDA', 'June 30, 2025 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2025/08/2-Crown-Point-MDA-Jun-2025-FINAL.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Jun 30, 2025', 'FS', 'Condensed Interim FS — Jun 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2025/08/1-Crown-Point-FS-Jun-2025-FINAL.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Mar 31, 2025', 'MDA', 'March 31, 2025 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2025/05/Crown-Point-MDA-Mar-2025-FINAL.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Mar 31, 2025', 'FS', 'Condensed Interim FS — Mar 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2025/05/Crown-Point-FS-Mar-2025-FINAL.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Dec 31, 2024', 'MDA', 'December 31, 2024 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2025/04/2-Crown-Point-MDA-Dec-2024-FINAL.pdf', true),
  ('financiero', 'CPI', '2025-01-01', 'Dec 31, 2024', 'FS', 'Annual Financial Statements 2024', '', 'https://crownpointenergy.com/wp-content/uploads/2025/04/Crown-Point-Energy-Inc.-December-31-2024-Consolidated-Financial-Statements-SEDAR.pdf', true),
  ('financiero', 'CPI', '2024-01-01', 'Mar 31, 2024', 'MDA', 'March 31, 2024 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2024/06/Crown-Point-MDA-March-31-2024.pdf', true),
  ('financiero', 'CPI', '2024-01-01', 'Mar 31, 2024', 'FS', 'Condensed Interim FS — Mar 2024', '', 'https://crownpointenergy.com/wp-content/uploads/2024/06/Crown-Point-FS-March-31-2024.pdf', true),
  ('financiero', 'CPI', '2024-01-01', 'Dec 31, 2023', 'MDA', 'December 31, 2023 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2024/03/2-Crown-Point-MDA-Dec-2023.pdf', true),
  ('financiero', 'CPI', '2024-01-01', 'Dec 31, 2023', 'FS', 'Annual Financial Statements 2023', '', 'https://crownpointenergy.com/wp-content/uploads/2024/03/1-Crown-Point-FS-Dec-2023.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Sep 30, 2023', 'MDA', 'September 30, 2023 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2023/11/2-Crown-Point-MDA-Sep-2023-final.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Sep 30, 2023', 'FS', 'Condensed Interim FS — Sep 2023', '', 'https://crownpointenergy.com/wp-content/uploads/2023/11/1-Crown-Point-FS-Sept-2023-final.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Jun 30, 2023', 'MDA', 'June 30, 2023 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2023/08/2-Crown-Point-MDA-Jun-2023-Final.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Jun 30, 2023', 'FS', 'Condensed Interim FS — Jun 2023', '', 'https://crownpointenergy.com/wp-content/uploads/2023/08/1-Crown-Point-FS-Jun-2023-FINAL.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Mar 31, 2023', 'MDA', 'March 31, 2023 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2023/05/Crown-Point-MDA-March-2023.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Mar 31, 2023', 'FS', 'Condensed Interim FS — Mar 2023', '', 'https://crownpointenergy.com/wp-content/uploads/2023/05/Crown-Point-FS-March-2023.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Dec 31, 2022', 'MDA', 'December 31, 2022 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2023/03/Crown-Point-MDA-Dec-2022-final.pdf', true),
  ('financiero', 'CPI', '2023-01-01', 'Dec 31, 2022', 'FS', 'Annual Financial Statements 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2023/03/Crown-Point-FS-Dec-2022-SEDAR.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Sep 30, 2022', 'MDA', 'September 30, 2022 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2022/11/2-Crown-Point-MDA-Sep-2022-FINAL.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Sep 30, 2022', 'FS', 'Condensed Interim FS — Sep 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2022/11/1-Crown-Point-FS-Sep-2022-FINAL.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Jun 30, 2022', 'MDA', 'June 30, 2022 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2022/08/MDAQ2.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Jun 30, 2022', 'FS', 'Condensed Interim FS — Jun 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2022/08/FinancialsQ2.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Mar 31, 2022', 'MDA', 'March 31, 2022 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2022/05/Crown-Point-MDA-Mar-2022-Final.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Mar 31, 2022', 'FS', 'Condensed Interim FS — Mar 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2022/05/1-Crown-Point-FS-Mar-2022-Final.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Dec 31, 2021', 'MDA', 'December 31, 2021 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2022/03/MDA.pdf', true),
  ('financiero', 'CPI', '2022-01-01', 'Dec 31, 2021', 'FS', 'Annual Financial Statements 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2022/03/Financials.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Sep 30, 2021', 'MDA', 'September 30, 2021 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2021/11/Crown-Point-MDA-Sep-2021.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Sep 30, 2021', 'FS', 'Condensed Interim FS — Sep 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2021/11/Crown-Point-FS-Sep-2021.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Jun 30, 2021', 'MDA', 'June 30, 2021 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2021/08/2-Crown-Point-MDA-Jun-2021-final.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Jun 30, 2021', 'FS', 'Condensed Interim FS — Jun 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2021/08/Crown-Point-FS-Jun-2021.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Mar 31, 2021', 'MDA', 'March 31, 2021 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2021/05/MDA.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Mar 31, 2021', 'FS', 'Condensed Interim FS — Mar 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2021/05/Financials.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Dec 31, 2020', 'MDA', 'December 31, 2020 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2021/03/2-Crown-Point-MDA-Dec-2020-final.pdf', true),
  ('financiero', 'CPI', '2021-01-01', 'Dec 31, 2020', 'FS', 'Annual Financial Statements 2020', '', 'https://crownpointenergy.com/wp-content/uploads/2021/03/1-Crown-Point-FS-Dec-2020-final-w-audit-report.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Sep 30, 2020', 'MDA', 'September 30, 2020 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2020/11/Crown-Point-MDA-Sep-2020.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Sep 30, 2020', 'FS', 'Condensed Interim FS — Sep 2020', '', 'https://crownpointenergy.com/wp-content/uploads/2020/11/Crown-Point-FS-Sep-2020.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Jun 30, 2020', 'MDA', 'June 30, 2020 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2020/08/Crown-Point-MDA-Jun-2020.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Jun 30, 2020', 'FS', 'Condensed Interim FS — Jun 2020', '', 'https://crownpointenergy.com/wp-content/uploads/2020/08/1-Crown-Point-FS-Jun-2020-final.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Mar 31, 2020', 'MDA', 'March 31, 2020 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2020/05/2-Crown-Point-MDA-Mar-2020-final.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Mar 31, 2020', 'FS', 'Condensed Interim FS — Mar 2020', '', 'https://crownpointenergy.com/wp-content/uploads/2020/05/1-Crown-Point-FS-Mar-2020-final.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Dec 31, 2019', 'MDA', 'December 31, 2019 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2020/04/2-Crown-Point-MDA-Dec-2019-FINAL_10145304_1.pdf', true),
  ('financiero', 'CPI', '2020-01-01', 'Dec 31, 2019', 'FS', 'Annual Financial Statements 2019–2018', '', 'https://crownpointenergy.com/wp-content/uploads/2020/04/Financial-Statements-FINAL_10145966_1.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Sep 30, 2019', 'MDA', 'September 30, 2019 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2019/11/Crown-Point-MDA-Sep-2019-9896492_1.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Sep 30, 2019', 'FS', 'Condensed Interim FS — Sep 2019', '', 'https://crownpointenergy.com/wp-content/uploads/2019/11/Crown-Point-FS-Sep-2019-9896496_1.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Jun 30, 2019', 'MDA', 'June 30, 2019 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2019/08/Crown-Point-MDA-Jun-2019.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Jun 30, 2019', 'FS', 'Condensed Interim FS — Jun 2019', '', 'https://crownpointenergy.com/wp-content/uploads/2019/08/Crown-Point-FS-Jun-2019.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Mar 31, 2019', 'MDA', 'March 31, 2019 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2019/05/MDA.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Mar 31, 2019', 'FS', 'Condensed Interim FS — Mar 2019', '', 'https://crownpointenergy.com/wp-content/uploads/2019/05/Financials.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Dec 31, 2018', 'MDA', 'December 31, 2018 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2019/04/Crown-Point-MDA-Dec-2018-final.pdf', true),
  ('financiero', 'CPI', '2019-01-01', 'Dec 31, 2018', 'FS', 'Annual Financial Statements 2018', '', 'https://crownpointenergy.com/wp-content/uploads/2019/04/Crown-Point-FS-Dec-2018-final.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Sep 30, 2018', 'MDA', 'September 30, 2018 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2018/11/CWV-Q3-2018-MDA.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Sep 30, 2018', 'FS', 'Condensed Interim FS — Sep 2018', '', 'https://crownpointenergy.com/wp-content/uploads/2018/11/CWV-Q3-2018-FS.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Jun 30, 2018', 'MDA', 'June 30, 2018 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2018/08/CWV-Q2-2018-MDA.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Jun 30, 2018', 'FS', 'Condensed Interim FS — Jun 2018', '', 'https://crownpointenergy.com/wp-content/uploads/2018/08/CWV-Q2-2018-FS.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Mar 31, 2018', 'MDA', 'March 31, 2018 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2018/06/CWV-MDA-Q1-2018.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Mar 31, 2018', 'FS', 'Condensed Interim FS — Mar 2018', '', 'https://crownpointenergy.com/wp-content/uploads/2018/06/CWV-FS-Q1-2018.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Dec 31, 2017', 'MDA', 'December 31, 2017 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2018/03/Crown-Point-MDA-Dec-2017-final.pdf', true),
  ('financiero', 'CPI', '2018-01-01', 'Dec 31, 2017', 'FS', 'Annual Financial Statements 2017', '', 'https://crownpointenergy.com/wp-content/uploads/2018/03/Crown-Point-FS-Dec-2017-final-w-audit-rpt.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Sep 30, 2017', 'MDA', 'September 30, 2017 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2017/12/CWV-Q3-2017-MDA.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Sep 30, 2017', 'FS', 'Condensed Interim FS — Sep 2017', '', 'https://crownpointenergy.com/wp-content/uploads/2017/12/CWV-Q3-2017-FS.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Jun 30, 2017', 'MDA', 'June 30, 2017 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2017/08/CWV-Q2-2017-MDA.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Jun 30, 2017', 'FS', 'Condensed Interim FS — Jun 2017', '', 'https://crownpointenergy.com/wp-content/uploads/2017/08/CWV-Q2-2017-FS.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Mar 31, 2017', 'MDA', 'March 31, 2017 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2017/05/Crown-Point-MDA-Mar-2017.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Mar 31, 2017', 'FS', 'Condensed Interim FS — Mar 2017', '', 'https://crownpointenergy.com/wp-content/uploads/2017/05/Crown-Point-FS-Mar-2017.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Dec 31, 2016', 'MDA', 'December 31, 2016 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2017/03/CWP-Q4-2016-MDA.pdf', true),
  ('financiero', 'CPI', '2017-01-01', 'Dec 31, 2016', 'FS', 'Annual Financial Statements 2016', '', 'https://crownpointenergy.com/wp-content/uploads/2017/03/CWP-Q4-2016-Financials.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Sep 30, 2016', 'MDA', 'September 30, 2016 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2016/11/Q3-2016-CWP-MDA.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Sep 30, 2016', 'FS', 'Condensed Interim FS — Sep 2016', '', 'https://crownpointenergy.com/wp-content/uploads/2016/11/Q3-2016-CWP-FS.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Jun 30, 2016', 'MDA', 'June 30, 2016 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2016/08/Crown-Point-MDA-Jun-2016-final.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Jun 30, 2016', 'FS', 'Condensed Interim FS — Jun 2016', '', 'https://crownpointenergy.com/wp-content/uploads/2016/08/Crown-Point-FS-Jun-2016-final.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Mar 31, 2016', 'MDA', 'March 31, 2016 MD&A', '', 'https://crownpointenergy.com/wp-content/uploads/2016/05/Crown-Point-MDA-Mar-2016-final.pdf', true),
  ('financiero', 'CPI', '2016-01-01', 'Mar 31, 2016', 'FS', 'Condensed Interim FS — Mar 2016', '', 'https://crownpointenergy.com/wp-content/uploads/2016/05/Crown-Point-FS-Mar-2016-final.pdf', true),
  ('financiero', 'CPESA', '2026-01-01', 'Mar 31, 2026', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2026', 'https://crownpointenergy.com/wp-content/uploads/2026/05/Crown-Point-Energia-S.A.-estados-financieros-al-31-03-2026-LEGALIZADOS_compressed.pdf', true),
  ('financiero', 'CPESA', '2026-01-01', 'Dic 31, 2025', 'Anual', '', 'Memoria y Estados Financieros 2025', 'https://crownpointenergy.com/wp-content/uploads/2026/04/CROWN-POINT-ENERGIA-SA-EEFF-AL-31122025-LEGALIZADO_compressed.pdf', true),
  ('financiero', 'CPESA', '2025-01-01', 'Sep 30, 2025', 'Trimestral', '', 'EEFF Condensados Intermedios — Sep 2025', 'https://crownpointenergy.com/wp-content/uploads/2025/11/CPESA-Estados-Financieros-30-09-20025-Certificado_comprimido.pdf', true),
  ('financiero', 'CPESA', '2025-01-01', 'Jun 30, 2025', 'Trimestral', '', 'EEFF Condensados Intermedios — Jun 2025', 'https://crownpointenergy.com/wp-content/uploads/2025/08/EEFF-CPESA-30062025-Certificado-comprimido.pdf', true),
  ('financiero', 'CPESA', '2025-01-01', 'Mar 31, 2025', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2025', 'https://crownpointenergy.com/wp-content/uploads/2025/05/EEFF-CPESA-31.03.2025-Legalizado-comprimido.pdf', true),
  ('financiero', 'CPESA', '2025-01-01', 'Dic 31, 2024', 'Anual', '', 'Memoria y Estados Financieros 2024', 'https://crownpointenergy.com/wp-content/uploads/2025/03/EEFF-CPESA-31.12.2024-Informe-de-Auditoria-FIRMADOS-comprimido-web.pdf', true),
  ('financiero', 'CPESA', '2024-01-01', 'Sep 30, 2024', 'Trimestral', '', 'EEFF Condensados Intermedios — Sep 2024', 'https://crownpointenergy.com/wp-content/uploads/2024/11/EEFF-CPESA-30092024-Firmado-Certificado_.pdf', true),
  ('financiero', 'CPESA', '2024-01-01', 'Jun 30, 2024', 'Trimestral', '', 'EEFF Condensados Intermedios — Jun 2024', 'https://crownpointenergy.com/wp-content/uploads/2024/08/EEFF-CPESA-30062024-firmado-digital.pdf', true),
  ('financiero', 'CPESA', '2024-01-01', 'Mar 31, 2024', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2024', 'https://crownpointenergy.com/wp-content/uploads/2024/06/EEFF-CPESA-31032024-Firmado-Final.pdf', true),
  ('financiero', 'CPESA', '2024-01-01', 'Dic 31, 2023', 'Anual', '', 'Memoria y Estados Financieros 2023', 'https://crownpointenergy.com/wp-content/uploads/2024/03/EEFF-CPESA-31.12.2023-firmado.pdf', true),
  ('financiero', 'CPESA', '2023-01-01', 'Sep 30, 2023', 'Trimestral', '', 'EEFF Condensados Intermedios — Sep 2023', 'https://crownpointenergy.com/wp-content/uploads/2023/11/EEFF-CPESA-30092023-FINAL-FIRMADO.pdf', true),
  ('financiero', 'CPESA', '2023-01-01', 'Jun 30, 2023', 'Trimestral', '', 'EEFF Condensados Intermedios — Jun 2023', 'https://crownpointenergy.com/wp-content/uploads/2023/08/EEFF-CPESA-Financials-Q2-2023.pdf', true),
  ('financiero', 'CPESA', '2023-01-01', 'Mar 31, 2023', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2023', 'https://crownpointenergy.com/wp-content/uploads/2023/05/CWV-CPESA-Financials-Q1-2023.pdf', true),
  ('financiero', 'CPESA', '2023-01-01', 'Dic 31, 2022', 'Anual', '', 'Memoria y Estados Financieros 2022', 'https://crownpointenergy.com/wp-content/uploads/2023/03/EEFF-CPESA-31.12.2022-firmado.pdf', true),
  ('financiero', 'CPESA', '2022-01-01', 'Sep 30, 2022', 'Trimestral', '', 'EEFF Condensados Intermedios — Sep 2022', 'https://crownpointenergy.com/wp-content/uploads/2023/02/EEFF_CPESA_30.09.22_firmados.pdf', true),
  ('financiero', 'CPESA', '2022-01-01', 'Jun 30, 2022', 'Trimestral', '', 'EEFF Condensados Intermedios — Jun 2022', 'https://crownpointenergy.com/wp-content/uploads/2023/02/EEFF_CPESA_30062022_signedfinal_firmado.pdf', true),
  ('financiero', 'CPESA', '2022-01-01', 'Mar 31, 2022', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2022', 'https://crownpointenergy.com/wp-content/uploads/2022/05/EEFF-CPESA-31_03_2022.pdf', true),
  ('financiero', 'CPESA', '2022-01-01', 'Dic 31, 2021', 'Anual', '', 'Memoria y Estados Financieros 2021', 'https://crownpointenergy.com/wp-content/uploads/2022/03/EEFF-CPESA-31.12.2021.pdf', true),
  ('financiero', 'CPESA', '2021-01-01', 'Sep 30, 2021', 'Trimestral', '', 'EEFF Condensados Intermedios — Sep 2021', 'https://crownpointenergy.com/wp-content/uploads/2021/11/EEFF-CPESA-30092021-Final.pdf', true),
  ('financiero', 'CPESA', '2021-01-01', 'Jun 30, 2021', 'Trimestral', '', 'EEFF Condensados Intermedios — Jun 2021', 'https://crownpointenergy.com/wp-content/uploads/2021/08/EEFF-CPESA-30.06.2021-VF-signed.pdf', true),
  ('financiero', 'CPESA', '2021-01-01', 'Mar 31, 2021', 'Trimestral', '', 'EEFF Condensados Intermedios — Mar 2021', 'https://crownpointenergy.com/wp-content/uploads/2021/05/EEFF-CPESA-31.03.2021-FINAL.pdf', true),
  ('financiero', 'CPESA', '2021-01-01', 'Dic 31, 2020', 'Anual', '', 'Memoria y Estados Financieros 2020', 'https://crownpointenergy.com/wp-content/uploads/2021/04/EEFF-CPESA-31-12-20-NIIF-FINAL.pdf', true),
  ('financiero', 'CPESA', '2020-01-01', 'Sep 30, 2020', 'Trimestral', '', 'EEFF Especiales Intermedios — Sep 2020', 'https://crownpointenergy.com/wp-content/uploads/2021/02/CPESA-EF-30-septiembre-2020.pdf', true),
  ('financiero', 'CPESA', '2020-01-01', 'Dic 31, 2019', 'Trimestral', '', 'Estados Financieros Consolidados — Dic 2019', 'https://crownpointenergy.com/wp-content/uploads/2021/02/CPESA-EF-31-diciembre-2019.pdf', true),
  ('financiero', 'CPESA', '2019-01-01', 'Dic 31, 2018', 'Anual', '', 'Memoria y Estados Contables 2018', 'https://crownpointenergy.com/wp-content/uploads/2021/02/CPESA-EC-31-diciembre-2018.pdf', true),
  ('financiero', 'CPESA', '2018-01-01', 'Dic 31, 2017', 'Anual', '', 'Memoria y Estados Contables 2017', 'https://crownpointenergy.com/wp-content/uploads/2021/02/CPESA-EC-31-diciembre-2017.pdf', true),
  ('agm', 'CPI', '2025-11-25', '', 'Circular', 'Management Information Circular — AGM 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2025/11/Circular-CWV-2025-AGM.pdf', true),
  ('agm', 'CPI', '2025-11-25', '', 'Notice', 'Notice and Access Notification — AGM 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2025/11/Notice-and-Access-Crown-Point-AGM-2025.pdf', true),
  ('agm', 'CPI', '2025-11-18', '', 'Proxy', 'Form of Proxy — AGM 2025', '', 'https://crownpointenergy.com/wp-content/uploads/2025/11/Form-of-Proxy-Crown-Point-AGM-2025.pdf', true),
  ('agm', 'CPI', '2024-08-01', '', 'Circular', 'Management Information Circular — AGM 2024', '', 'https://crownpointenergy.com/wp-content/uploads/2024/08/Informal-Circular-2024-AGM-CWV-Compiled.pdf', true),
  ('agm', 'CPI', '2024-08-01', '', 'Notice', 'Notice and Access Notification — AGM 2024', '', 'https://crownpointenergy.com/wp-content/uploads/2024/08/Notice-and-Access-Notification-Crown-Point-AGM-2024.pdf', true),
  ('agm', 'CPI', '2023-09-01', '', 'Circular', 'Management Information Circular — AGM 2023', '', 'https://crownpointenergy.com/wp-content/uploads/2023/09/Information-Circular-2023.pdf', true),
  ('agm', 'CPI', '2022-06-01', '', 'Circular', 'Management Information Circular — AGM 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2022/06/InformationCircular.pdf', true),
  ('agm', 'CPI', '2022-06-01', '', 'Notice', 'Notice of Annual General Meeting 2022', '', 'https://crownpointenergy.com/wp-content/uploads/2022/06/NoticeofMeeting.pdf', true),
  ('agm', 'CPI', '2021-06-01', '', 'Circular', 'Management Information Circular — AGM 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2021/06/CWV-Circular.pdf', true),
  ('agm', 'CPI', '2021-06-01', '', 'Notice', 'Notice and Access Notification — AGM 2021', '', 'https://crownpointenergy.com/wp-content/uploads/2021/06/CWV-notice-of-NA.pdf', true),
  ('agm', 'CPI', '2018-07-01', '', 'Circular', 'Management Information Circular — AGM 2018', '', 'https://crownpointenergy.com/wp-content/uploads/2018/07/CWV-Information-Circular-2018-06-FINAL_9181520_1.pdf', true),
  ('estma', 'CPI', '2026-01-01', '', 'ESTMA', '2025 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2026/04/E986627-CROWN-POINT-ENERGY-INC.-2025-ESTMA-Report-filed.pdf', true),
  ('estma', 'CPI', '2025-01-01', '', 'ESTMA', '2024 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2025/03/CPE-ESTMA-Report-2024.pdf', true),
  ('estma', 'CPI', '2024-01-01', '', 'ESTMA', '2023 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2024/02/CPE-ESTMA-Report-2023.pdf', true),
  ('estma', 'CPI', '2023-01-01', '', 'ESTMA', '2022 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2023/03/CPE-ESTMA-Report-2022.pdf', true),
  ('estma', 'CPI', '2022-01-01', '', 'ESTMA', '2021 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2022/03/CPE-ESTMA-Report-2021-1.pdf', true),
  ('estma', 'CPI', '2021-01-01', '', 'ESTMA', '2020 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2021/05/CPE-ESTMA-Report-2020.pdf', true),
  ('estma', 'CPI', '2020-01-01', '', 'ESTMA', '2019 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2020/05/ESTMA-Reporting-CPE-INC-2019-1.pdf', true),
  ('estma', 'CPI', '2019-01-01', '', 'ESTMA', '2018 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2019/05/ESTMA-Reporting-CPE-INC-2018-1.pdf', true),
  ('estma', 'CPI', '2018-01-01', '', 'ESTMA', '2017 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2018/04/CWV-2017-ESTMA.pdf', true),
  ('estma', 'CPI', '2017-01-01', '', 'ESTMA', '2016 ESTMA Report', '', 'https://crownpointenergy.com/wp-content/uploads/2017/05/CWV-2016-ESTMA.pdf', true),
  ('gobernanza', 'CPI', NULL, '', 'governance', 'Audit Committee Mandate', '', 'https://crownpointenergy.com/wp-content/uploads/2015/01/CWV-Audit-Committee-Mandate.pdf', true),
  ('gobernanza', 'CPI', NULL, '', 'governance', 'Compensation Committee Mandate', '', 'https://crownpointenergy.com/wp-content/uploads/2016/11/Compensation-Committee-Mandate-draft-amendment-March-7-2016_7433875_2....pdf', true),
  ('gobernanza', 'CPI', NULL, '', 'governance', 'Reserves, Health, Safety and Environment Committee Mandate', '', 'https://crownpointenergy.com/wp-content/uploads/2015/01/CWV-Reserves-and-Health-Safety-and-Environment-Committee-Mandate.pdf', true),
  ('gobernanza', 'CPI', NULL, '', 'governance', 'Whistleblower Policy', '', 'https://crownpointenergy.com/wp-content/uploads/2014/12/CWV-Whistleblower-Policy.pdf', true),
  ('gobernanza', 'CPESA', NULL, '', 'governance', '', 'Política Anticorrupción', 'https://crownpointenergy.com/wp-content/uploads/2021/01/01.Politica-Anticorrupcion-Final-ESP.pdf', true),
  ('gobernanza', 'CPESA', NULL, '', 'governance', '', 'Código de Conducta y Ética Empresarial', 'https://crownpointenergy.com/wp-content/uploads/2021/01/02.Codigo-de-Conducta-y-Etica-Empresarial-Final-ESP.pdf', true),
  ('gobernanza', 'CPESA', NULL, '', 'governance', '', 'Política de Uso de Información Privilegiada', 'https://crownpointenergy.com/wp-content/uploads/2021/01/03.Politica-de-Uso-de-Informacion-Privilegiada-Final-ESP.pdf', true),
  ('gobernanza', 'CPESA', NULL, '', 'governance', '', 'Política de Denuncia de Irregularidades', 'https://crownpointenergy.com/wp-content/uploads/2021/01/04.Politica-de-denuncia-de-irregularidades-Final-ESP.pdf', true),
  ('gobernanza', 'CPESA', NULL, '', 'governance', '', 'Formulario de Denuncias e Irregularidades', 'https://forms.gle/L8AmmZ8NeSKQxMGC7', true)
ON CONFLICT (url) DO NOTHING;
-- Total: 130 documents

-- ───────────────────────────────────────────────────────────────
-- shareholder-meetings-schema.sql
-- ───────────────────────────────────────────────────────────────
-- shareholder-meetings-schema.sql
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS shareholder_meetings (
  id          BIGSERIAL PRIMARY KEY,
  tipo        TEXT NOT NULL DEFAULT 'agm' CHECK (tipo IN ('agm', 'egm')),
  fecha       DATE NOT NULL,
  hora_local  TEXT,                        -- e.g. "10:00 AM MST"
  zona_es     TEXT,                        -- e.g. "Hora de Calgary, Alberta"
  zona_en     TEXT,                        -- e.g. "Calgary, Alberta time"
  formato     TEXT NOT NULL DEFAULT 'hibrida' CHECK (formato IN ('presencial', 'virtual', 'hibrida')),
  lugar_es    TEXT,
  lugar_en    TEXT,
  titulo_es   TEXT NOT NULL,
  titulo_en   TEXT NOT NULL,
  nota_es     TEXT,
  nota_en     TEXT,
  record_date DATE,
  sedar_url   TEXT,
  activo      BOOLEAN NOT NULL DEFAULT true,
  orden       SMALLINT NOT NULL DEFAULT 0
);

ALTER TABLE shareholder_meetings ENABLE ROW LEVEL SECURITY;

-- Public can read active meetings
CREATE POLICY "public_select_meetings" ON shareholder_meetings
  FOR SELECT USING (activo = true);

-- Service role has full access
CREATE POLICY "service_all_meetings" ON shareholder_meetings
  FOR ALL USING (auth.role() = 'service_role');

-- ── Sample data — replace with real dates ────────────────────────────────────
INSERT INTO shareholder_meetings
  (tipo, fecha, hora_local, zona_es, zona_en, formato, lugar_es, lugar_en,
   titulo_es, titulo_en, nota_es, nota_en, record_date, sedar_url, activo, orden)
VALUES
  (
    'agm',
    '2026-09-15',
    '10:00 AM MST',
    'Hora de Calgary, Alberta (Canada)',
    'Calgary, Alberta (Canada) time',
    'hibrida',
    'Calgary, Alberta, Canada (con participación virtual disponible)',
    'Calgary, Alberta, Canada (virtual participation available)',
    'Asamblea General Anual 2026 — Crown Point Energy Inc.',
    '2026 Annual General Meeting — Crown Point Energy Inc.',
    'Elección de directores, designación de auditores y demás asuntos propios de la Asamblea. La documentación de la reunión se publicará en SEDAR+ con al menos 21 días de anticipación.',
    'Election of directors, appointment of auditors and any other business properly before the meeting. Meeting materials will be filed on SEDAR+ at least 21 days in advance.',
    '2026-08-14',
    'https://www.sedarplus.ca',
    true,
    1
  );

-- ───────────────────────────────────────────────────────────────
-- 20260721_block_photos.sql
-- ───────────────────────────────────────────────────────────────
-- Photo gallery per operations block (up to 5 photos each), replacing the
-- single img.ops.<slug> CMS field with an ordered set of rows so the
-- operaciones page can render a carousel instead of one static photo.
CREATE TABLE IF NOT EXISTS operations_block_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_slug TEXT NOT NULL,
  url        TEXT NOT NULL,
  alt        TEXT NOT NULL DEFAULT '',
  orden      INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS operations_block_photos_slug_orden_idx
  ON operations_block_photos (block_slug, orden);

ALTER TABLE operations_block_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public select block photos" ON operations_block_photos;
CREATE POLICY "public select block photos" ON operations_block_photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth manage block photos" ON operations_block_photos;
CREATE POLICY "auth manage block photos" ON operations_block_photos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- One-time backfill: carry over the existing single photo per block (if any)
-- from cms_fields so nothing goes blank after the migration.
INSERT INTO operations_block_photos (block_slug, url, orden)
SELECT substring(key from 9), value_es, 0
FROM cms_fields
WHERE key LIKE 'img.ops.%' AND key NOT LIKE '%.map' AND key NOT LIKE '%.alt' AND value_es <> '';

-- ───────────────────────────────────────────────────────────────
-- 20260717_candidatos_refactor.sql
-- ───────────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════
-- CV/RRHH database refactor — Crown Point Energía
--
-- job_applications was a single flat table with no candidate identity: the
-- same person applying twice created two unrelated rows, and several columns
-- used throughout the app code (datos, score, ai_summary, ai_analyzed_at)
-- were never in a tracked migration. This splits it into:
--   candidatos     — one row per person, deduped by email
--   postulaciones  — one row per application, links to candidatos and
--                    (optionally) to open_positions
-- job_applications is renamed to job_applications_legacy (kept, not dropped)
-- and a job_applications_view exposes the same flat shape the app already
-- reads, so existing GET endpoints don't need to change their column list.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS candidatos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL DEFAULT '',
  email       CITEXT NOT NULL,
  telefono    TEXT NOT NULL DEFAULT '',
  linkedin    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS candidatos_email_unique ON candidatos (email);

CREATE TABLE IF NOT EXISTS postulaciones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id  UUID NOT NULL REFERENCES candidatos (id) ON DELETE CASCADE,
  position_id   UUID REFERENCES open_positions (id) ON DELETE SET NULL,
  area          TEXT NOT NULL DEFAULT '',   -- free-text area at time of application (positions can change/disappear)
  mensaje       TEXT NOT NULL DEFAULT '',
  datos         JSONB NOT NULL DEFAULT '{}',
  cv_path       TEXT,
  cv_name       TEXT,
  cv_size       INTEGER,
  estado        TEXT NOT NULL DEFAULT 'nueva', -- 'nueva' | 'revisada' | 'contactada' | 'descartada'
  notas         TEXT NOT NULL DEFAULT '',
  score         INTEGER,
  ai_summary    TEXT,
  ai_analyzed_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS postulaciones_candidato_idx ON postulaciones (candidato_id);
CREATE INDEX IF NOT EXISTS postulaciones_created_idx   ON postulaciones (created_at DESC);

CREATE TABLE IF NOT EXISTS candidato_documentos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES candidatos (id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL DEFAULT 'cv', -- 'cv' | 'carta' | 'portfolio' | 'otro'
  storage_path TEXT NOT NULL,
  file_name    TEXT,
  file_size    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS candidato_documentos_candidato_idx ON candidato_documentos (candidato_id);

-- ── Backfill from job_applications (idempotent: skip if already migrated) ──
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications_legacy')
  THEN
    INSERT INTO candidatos (nombre, email, telefono, linkedin, created_at)
    SELECT DISTINCT ON (lower(email))
      nombre, email, telefono, linkedin, created_at
    FROM job_applications
    WHERE email <> ''
    ORDER BY lower(email), created_at ASC
    ON CONFLICT (email) DO NOTHING;

    INSERT INTO postulaciones (id, candidato_id, area, mensaje, datos, cv_path, cv_name, cv_size, estado, notas, score, ai_summary, ai_analyzed_at, created_at, updated_at)
    SELECT
      ja.id,
      c.id,
      ja.area, ja.mensaje,
      COALESCE(ja.datos, '{}'::jsonb),
      ja.cv_path, ja.cv_name, ja.cv_size,
      ja.estado, ja.notas, ja.score, ja.ai_summary, ja.ai_analyzed_at,
      ja.created_at, ja.updated_at
    FROM job_applications ja
    JOIN candidatos c ON lower(c.email) = lower(ja.email)
    ON CONFLICT (id) DO NOTHING;

    ALTER TABLE job_applications RENAME TO job_applications_legacy;
  END IF;
END $$;

-- ── Compatibility view — same flat shape the RRHH admin UI already reads ──
CREATE OR REPLACE VIEW job_applications_view AS
SELECT
  p.id, c.nombre, c.email, c.telefono, c.linkedin,
  p.area, p.mensaje, p.datos, p.cv_path, p.cv_name, p.cv_size,
  p.estado, p.notas, p.score, p.ai_summary, p.ai_analyzed_at,
  p.created_at, p.updated_at, p.candidato_id, p.position_id
FROM postulaciones p
JOIN candidatos c ON c.id = p.candidato_id;

-- ── RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE candidatos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE postulaciones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidato_documentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth select candidatos" ON candidatos;
CREATE POLICY "auth select candidatos" ON candidatos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "public insert candidatos" ON candidatos;
CREATE POLICY "public insert candidatos" ON candidatos FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth update candidatos" ON candidatos;
CREATE POLICY "auth update candidatos" ON candidatos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth select postulaciones" ON postulaciones;
CREATE POLICY "auth select postulaciones" ON postulaciones FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "public insert postulaciones" ON postulaciones;
CREATE POLICY "public insert postulaciones" ON postulaciones FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth all postulaciones" ON postulaciones;
CREATE POLICY "auth all postulaciones" ON postulaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth select candidato_documentos" ON candidato_documentos;
CREATE POLICY "auth select candidato_documentos" ON candidato_documentos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth all candidato_documentos" ON candidato_documentos;
CREATE POLICY "auth all candidato_documentos" ON candidato_documentos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ───────────────────────────────────────────────────────────────
-- 20260718_denuncias_etica.sql
-- ───────────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════
-- Canal de denuncias e irregularidades — Línea ética
--
-- Reemplaza el Google Form externo (que quedó mal configurado, exigiendo
-- login de Google — rompiendo el anonimato) por un formulario propio dentro
-- del sitio, con opción real de anonimato total.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS denuncias_etica (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria      TEXT NOT NULL DEFAULT 'otro',
    -- 'anticorrupcion' | 'informacion_privilegiada' | 'conflicto_interes' |
    -- 'acoso_discriminacion' | 'fraude_financiero' | 'seguridad_ambiente' | 'otro'
  descripcion    TEXT NOT NULL DEFAULT '',
  fecha_incidente DATE,
  anonimo        BOOLEAN NOT NULL DEFAULT true,
  nombre         TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL DEFAULT '',
  telefono       TEXT NOT NULL DEFAULT '',
  evidencia_path TEXT,
  evidencia_name TEXT,
  evidencia_size INTEGER,
  estado         TEXT NOT NULL DEFAULT 'nueva', -- 'nueva' | 'en_revision' | 'cerrada'
  notas          TEXT NOT NULL DEFAULT '',       -- internal-only, never shown to the reporter
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS denuncias_etica_created_idx ON denuncias_etica (created_at DESC);

ALTER TABLE denuncias_etica ENABLE ROW LEVEL SECURITY;

-- Anyone can submit — this is the whole point of the channel
DROP POLICY IF EXISTS "public insert denuncias" ON denuncias_etica;
CREATE POLICY "public insert denuncias" ON denuncias_etica FOR INSERT WITH CHECK (true);

-- NOTA: en el proyecto original, la lectura/gestión de denuncias estaba
-- restringida a un rol "admin" propio (tabla user_roles, que no existe en
-- este proyecto nuevo). El endpoint público solo necesita el INSERT de
-- arriba; si arman un panel propio para revisar denuncias, agreguen su
-- propia política de lectura acá según su sistema de usuarios.

-- Private storage bucket for optional evidence attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'denuncias-evidencia', 'denuncias-evidencia', false, 20971520,
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public insert denuncias-evidencia storage" ON storage.objects;
CREATE POLICY "public insert denuncias-evidencia storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'denuncias-evidencia');

-- Lectura de evidencia: sin política de admin acá por la misma razón de
-- arriba -- agreguen la suya si hace falta.

-- ───────────────────────────────────────────────────────────────
-- ip-blacklist-schema.sql
-- ───────────────────────────────────────────────────────────────
-- ============================================================
-- Blacklist escalada de IPs por reincidencia en el rate limit
-- ============================================================
-- El rate limit por endpoint (lib/ratelimit.ts) devuelve 429 y ahí termina:
-- una IP puede chocar contra el límite indefinidamente, y rotar de endpoint
-- para seguir probando. Esta capa cuenta las violaciones POR IP, sin importar
-- en qué endpoint ocurran, y escala el bloqueo:
--
--   3ª violación en 24 hs  →  1 hora
--   6ª violación en 24 hs  →  24 horas
--   10ª violación en 24 hs →  7 días
--
-- Se separa en dos tablas a propósito. El log permite responder "por qué está
-- bloqueada esta IP" — que es la pregunta que aparece cuando el bloqueado
-- resulta ser un cliente real detrás de un NAT corporativo — y permite contar
-- con una ventana móvil de 24 hs de verdad, no una ventana fija que se
-- reinicia sola.

-- ─── Log de violaciones ───────────────────────────────────────────────────
create table if not exists ip_violaciones (
  id         bigint generated always as identity primary key,
  ip         text not null,
  endpoint   text not null,
  creada_en  timestamptz not null default now()
);

create index if not exists ip_violaciones_ip_fecha_idx
  on ip_violaciones (ip, creada_en desc);

comment on table ip_violaciones is
  'Cada vez que una IP choca contra el rate limit. Sirve para contar la ventana móvil de 24 hs y para auditar por qué se bloqueó una IP.';

alter table ip_violaciones enable row level security;
-- Sin políticas: sólo el service-role (server-side) escribe y lee. Nadie
-- autenticado debería poder ver ni borrar su propio historial.

-- ─── Bloqueos vigentes ────────────────────────────────────────────────────
create table if not exists ip_bloqueos (
  ip               text primary key,
  bloqueada_hasta  timestamptz not null,
  nivel            int not null check (nivel between 1 and 3),
  violaciones      int not null default 0,
  motivo           text,
  ultimo_endpoint  text,
  total_bloqueos   int not null default 1,
  creado_en        timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists ip_bloqueos_hasta_idx on ip_bloqueos (bloqueada_hasta);

comment on table ip_bloqueos is
  'Bloqueos vigentes por IP. nivel 1 = 1 hora · 2 = 24 horas · 3 = 7 días.';
comment on column ip_bloqueos.total_bloqueos is
  'Cuántas veces se bloqueó esta IP históricamente. No se reinicia: sirve para detectar reincidencia crónica.';

alter table ip_bloqueos enable row level security;

-- ─── Operación ────────────────────────────────────────────────────────────
-- Ver quién está bloqueado ahora:
--   select ip, bloqueada_hasta, nivel, violaciones, ultimo_endpoint, motivo
--   from ip_bloqueos where bloqueada_hasta > now() order by bloqueada_hasta desc;
--
-- Ver qué hizo una IP antes de que la bloquearan:
--   select endpoint, creada_en from ip_violaciones
--   where ip = 'x.x.x.x' order by creada_en desc limit 50;
--
-- Desbloquear a mano (un cliente real detrás de un NAT compartido, por ejemplo):
--   delete from ip_bloqueos where ip = 'x.x.x.x';
--   delete from ip_violaciones where ip = 'x.x.x.x';
--
-- Limpieza del log. El código borra oportunísticamente lo que pasa de 30 días,
-- pero si el log creció mucho conviene correrlo a mano una vez:
--   delete from ip_violaciones where creada_en < now() - interval '30 days';

