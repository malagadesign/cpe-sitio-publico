import type { OperationsBlock } from '@/lib/content-fetch'

/** Contenido Figma / seed cuando Supabase no tiene bloques (dev local). */
export const OPS_BLOCKS_FALLBACK: OperationsBlock[] = [
  {
    id: 'fb-tordillo',
    slug: 'tordillo',
    orden: 1,
    commodity: 'mixed',
    eyebrow: '01 · Golfo San Jorge · Chubut',
    titulo: 'El Tordillo · La Tapera · Puesto Quiroga',
    lede_es: 'El bloque productivo más grande de la compañía. Opera con el 95% del working interest.',
    lede_en: "The company's largest producing block. Operates with a 95% working interest.",
    card_title_es: 'Producción consolidada',
    card_title_en: 'Consolidated production',
    chips: ['95 WI', 'Operador', 'Crudo & Gas'],
    body_es: [
      'Tres concesiones operadas por Crown Point Energía S.A.: El Tordillo, La Tapera y Puesto Quiroga, en la provincia de Chubut, flanco norte de la Cuenca del Golfo San Jorge. Área total de 430 km² netos.',
      'Producción 1Q 2026: 4.164 Bbl/d de petróleo y 3.451 Mcf/d de gas natural (4.739 boe/d totales). Cuenta con 264 pozos activos y 88 pozos inyectores. La concesión vence el 14/11/2027 con extensión acordada por 20 años (hasta noviembre de 2047).',
    ],
    body_en: [
      'Three concessions operated by Crown Point Energía S.A.: El Tordillo, La Tapera and Puesto Quiroga, in Chubut province, northern flank of the San Jorge Gulf Basin. Total net area of 430 km².',
      'Q1 2026 production: 4,164 Bbl/d of oil and 3,451 Mcf/d of natural gas (4,739 boe/d total). The block has 264 active producers and 88 injector wells. Concession expires 14/11/2027 with an agreed 20-year extension (to November 2047).',
    ],
    stats: [
      { label_es: 'Producción petróleo', label_en: 'Oil production', val: '4,164 Bbl/d' },
      { label_es: 'Producción gas', label_en: 'Gas production', val: '3,451 Mcf/d' },
      { label_es: 'Producción total', label_en: 'Total production', val: '4,739 Boe/d' },
      { label_es: 'Pozos activos', label_en: 'Active wells', val: '264' },
      { label_es: 'Pozos inyectores', label_en: 'Injector wells', val: '88' },
      { label_es: 'Superficie', label_en: 'Acreage', val: '113,325 acres · 430 km²' },
      { label_es: 'Vencimiento', label_en: 'Expiry', val: 'Nov 2047 (ext.)' },
    ],
    map_stats: [],
    activo: true,
  },
  {
    id: 'fb-piedra',
    slug: 'piedra',
    orden: 2,
    commodity: 'oil',
    eyebrow: '02 · Golfo San Jorge · Santa Cruz',
    titulo: 'Piedra Clavada · Koluel Kaike',
    lede_es:
      'Concesión de explotación operada al 100% en la Cuenca San Jorge, provincia de Santa Cruz. Crown Point busca aumentar la producción mediante perforaciones, workovers y optimización de instalaciones.',
    lede_en:
      '100%-operated exploitation concession in the San Jorge Basin, Santa Cruz province. Crown Point aims to grow production through drilling, workovers and facilities optimisation.',
    card_title_es: 'Activo de crecimiento',
    card_title_en: 'Growth asset',
    chips: ['100% WI', 'Operador', 'Crudo pesado'],
    body_es: [
      'Crown Point tiene una participación operada en la Concesión de Explotación Piedra Clavada Koluel Kaike, que representa un total de 71.660 acres netos en la Cuenca San Jorge. La estrategia de Crown Point es aumentar la producción a través de perforaciones y workovers de pozos, y optimización de instalaciones.',
      'Producción 1Q 2026: 2.568 Bbl/d de petróleo. El bloque cuenta con 403 pozos productores activos y 143 pozos inyectores.',
    ],
    body_en: [
      'Crown Point holds an operated interest in the Piedra Clavada Koluel Kaike Exploitation Concession, totaling 71,660 net acres in the San Jorge Basin. Strategy targets production growth through drilling, workovers and facilities optimisation.',
      'Q1 2026 production: 2,568 Bbl/d of oil. The block has 403 active producers and 143 injector wells.',
    ],
    stats: [
      { label_es: 'Producción petróleo', label_en: 'Oil production', val: '2,568 Bbl/d' },
      { label_es: 'Pozos activos', label_en: 'Active wells', val: '403' },
      { label_es: 'Pozos inyectores', label_en: 'Injector wells', val: '143' },
      { label_es: 'Superficie', label_en: 'Acreage', val: '8,840 ha' },
      { label_es: 'Calidad de crudo', label_en: 'Crude quality', val: '21° API' },
      { label_es: 'Vencimiento', label_en: 'Expiry', val: '2049' },
    ],
    map_stats: [],
    activo: true,
  },
  {
    id: 'fb-chanares',
    slug: 'chanares',
    orden: 3,
    commodity: 'oil',
    eyebrow: '03 · Cuenca Cuyana',
    titulo: 'Chañares Herrados / PPCO',
    lede_es:
      'Dos concesiones productivas contiguas en el centro de Mendoza — Chañares Herrados (crudo mediano, 31.94° API) y Puesto Pozo Cercado Oriental (crudo liviano, 33.7° API). Crown Point participa con el 50% del working interest en ambas; el operador es Tango Energy Argentina S.A.',
    lede_en:
      'Two contiguous producing concessions in central Mendoza — Chañares Herrados (medium crude, 31.94° API) and Puesto Pozo Cercado Oriental (light crude, 33.7° API). Crown Point holds a 50% working interest in both; operator is Tango Energy Argentina S.A.',
    card_title_es: 'Producción consolidada',
    card_title_en: 'Consolidated production',
    chips: ['2 concesiones', '50% WI', 'JV · Tango Energy Argentina', 'Mendoza / Cuyana'],
    body_es: [
      'Crown Point participa del working interest en este bloque ubicado en la Cuenca Cuyana, provincia de Mendoza. El operador es Tango Energy Argentina S.A. El bloque produce crudo mediano de 31.94° API con infraestructura conectada al oleoducto Allanito–Luján de Cuyo.',
      'Producción 1Q 2026: 415 Bbl/d de petróleo. El programa de workover 2026 contempla la intervención de pozos productores con un objetivo de incremento de producción.',
    ],
    body_en: [
      'Crown Point holds working interest in this Cuyana Basin block in Mendoza province. Operator is Tango Energy Argentina S.A. The block produces 31.94° API medium crude with infrastructure tied into the Allanito–Luján de Cuyo pipeline.',
      'Q1 2026 production: 415 Bbl/d of oil. The 2026 workover program targets producer wells to lift output.',
    ],
    stats: [
      { label_es: 'Producción petróleo (consolidada)', label_en: 'Oil production (consolidated)', val: '482 Bbl/d' },
      { label_es: 'Pozos activos', label_en: 'Active wells', val: '39' },
      { label_es: 'Pozos inyectores', label_en: 'Injector wells', val: '4' },
      { label_es: 'Participación', label_en: 'Working interest', val: 'WI 50%' },
      { label_es: 'Operador', label_en: 'Operator', val: 'Tango Energy Argentina S.A.' },
      { label_es: 'Calidad de crudo (consolidada)', label_en: 'Crude quality (consolidated)', val: '32.82° API' },
      { label_es: 'Provincia', label_en: 'Province', val: 'Mendoza / Cuyana' },
    ],
    map_stats: [],
    activo: true,
  },
  {
    id: 'fb-cerro',
    slug: 'cerro',
    orden: 4,
    commodity: 'oil',
    eyebrow: '04 · Cuenca Neuquina',
    titulo: 'Cerro de Los Leones',
    lede_es:
      'Bloque exploratorio de 101.208 hectáreas en el norte de la Cuenca Neuquina, provincia de Mendoza. El área se encuentra en la parte norte del play Vaca Muerta, con prospectos convencionales en formaciones Tordillo, Quintuco y Mulichinco.',
    lede_en:
      '101,208-hectare exploration block in the northern Neuquén Basin, Mendoza province. The area sits within the northern extension of the Vaca Muerta play, with conventional prospects in the Tordillo, Quintuco and Mulichinco formations.',
    card_title_es: 'Estructura del bloque',
    card_title_en: 'Block structure',
    chips: ['100% WI', 'Operador', 'Exploratorio', 'Mendoza / Neuquina'],
    body_es: [
      'El permiso CLL fue prorrogado hasta el 18 de mayo de 2027. La estrategia apunta a madurar prospectos convencionales en el flanco norte de Vaca Muerta.',
    ],
    body_en: [
      'The CLL Permit was extended until May 18, 2027. Strategy focuses on maturing conventional prospects on the northern flank of Vaca Muerta.',
    ],
    stats: [
      { label_es: 'Superficie', label_en: 'Acreage', val: '101,208 ha' },
      { label_es: 'Prórroga permiso', label_en: 'Permit extension', val: 'May 2027' },
      { label_es: 'Participación', label_en: 'Working interest', val: '100% WI' },
      { label_es: 'Provincia', label_en: 'Province', val: 'Mendoza / Neuquina' },
    ],
    map_stats: [],
    activo: true,
  },
]
