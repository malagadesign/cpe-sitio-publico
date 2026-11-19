import type { CSSProperties } from 'react'
import ArgentinaMapPaths from '@/components/argentina-map-paths'

/**
 * Exact Figma composition (Operaciones frame 37:203).
 * Origin (1018, 1768) = top-left of REFERENCIAS cluster.
 * Map paths = Group 14 (345:775).
 */
const VB = { x: 1018, y: 1768, w: 578, h: 746 } as const

const COLORS = {
  neuquinaNorte: '#466BD1',
  cuyana: '#638AE7',
  neuquinaSjN: '#66C44F',
  golfoSjS: '#1E7115',
  tordilloDot: '#60B753',
  label: '#DBD9E4',
  sublabel: '#7F85B9',
  legendTitle: '#FFFFFF',
} as const

/** Borde derecho común de todos los textos de los callouts (justo antes del conector). */
const RIGHT = 1222

function nx(x: number) {
  return x - VB.x
}
function ny(y: number) {
  return y - VB.y
}

export default function ArgentinaMap({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`ar-map ar-map--figma${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Mapa de Argentina con bloques operativos de Crown Point Energy"
      style={style}
    >
      {/* Provincial outline — exact Figma Group 14 */}
      <g transform={`translate(${nx(1257.945)} ${ny(1775.967)})`}>
        <ArgentinaMapPaths />
      </g>

      {/* REFERENCIAS */}
      <g className="ar-legend" aria-hidden="true">
        <text x={nx(1034.2)} y={ny(1768.066)} className="ar-legend-title" dominantBaseline="text-before-edge">
          REFERENCIAS
        </text>

        <circle cx={nx(1032.711) + 5.634} cy={ny(1804.047) + 5.634} r={5.634} fill={COLORS.neuquinaNorte} />
        <text x={nx(1050.52)} y={ny(1798.023)} className="ar-legend-text" dominantBaseline="text-before-edge">
          Neuquina Norte
        </text>

        <circle cx={nx(1032.711) + 5.634} cy={ny(1827.195) + 5.634} r={5.634} fill={COLORS.cuyana} />
        <text x={nx(1050.52)} y={ny(1820.463)} className="ar-legend-text" dominantBaseline="text-before-edge">
          Cuyana
        </text>

        <circle cx={nx(1032.711) + 5.634} cy={ny(1850.075) + 5.634} r={5.634} fill={COLORS.neuquinaSjN} />
        <text x={nx(1050.52)} y={ny(1843.343)} className="ar-legend-text" dominantBaseline="text-before-edge">
          Neuquina / San Jorge N.
        </text>

        <circle cx={nx(1032.711) + 5.634} cy={ny(1872.985) + 5.634} r={5.634} fill={COLORS.golfoSjS} />
        <text x={nx(1050.52)} y={ny(1866.253)} className="ar-legend-text" dominantBaseline="text-before-edge">
          Golfo San Jorge S.
        </text>
      </g>

      {/* —— Puesto Pozo Cercado —— */}
      <g className="ar-block" data-block="ppc">
        <rect
          className="ar-callout-frame"
          x={nx(1038.613) - 8}
          y={ny(1973.785) - 6}
          width={210}
          height={52}
          rx={4}
          fill="none"
          stroke="#CEEF7B"
          strokeWidth={1}
          opacity={0}
        />
        <path
          className="ar-leader"
          d={`M${nx(1226.5)} ${ny(2000.736) + 0.5} H${nx(1226.5) + 76} V${ny(2000.736) + 32.622}`}
          stroke={COLORS.cuyana}
          fill="none"
        />
        <circle
          className="ar-dot"
          cx={nx(1298.461) + 3.532}
          cy={ny(2030.986) + 3.532}
          r={3.532}
          fill={COLORS.cuyana}
        />
        <circle className="ar-hit" cx={nx(1298.461) + 3.532} cy={ny(2030.986) + 3.532} r={14} fill="transparent" />
        <text x={nx(RIGHT)} y={ny(1973.785)} textAnchor="end" className="ar-label" dominantBaseline="text-before-edge">
          Puesto Pozo Cercado
        </text>
        <text x={nx(RIGHT)} y={ny(2000.228)} textAnchor="end" className="ar-sublabel" dominantBaseline="text-before-edge">
          Cuenca Cuyana • Mendoza
        </text>
      </g>

      {/* —— Chañares Herrados —— */}
      <g className="ar-block" data-block="chanares">
        <rect
          className="ar-callout-frame"
          x={nx(1038.613) - 8}
          y={ny(2047.653) - 6}
          width={210}
          height={48}
          rx={4}
          fill="none"
          stroke="#CEEF7B"
          strokeWidth={1}
          opacity={0}
        />
        <path
          className="ar-leader"
          d={`M${nx(1225.5)} ${ny(2063.746)} H${nx(1299.594) + 3.532}`}
          stroke={COLORS.cuyana}
          fill="none"
        />
        <circle
          className="ar-dot"
          cx={nx(1299.594) + 3.532}
          cy={ny(2060.752) + 3.532}
          r={3.532}
          fill={COLORS.cuyana}
        />
        <circle className="ar-hit" cx={nx(1299.594) + 3.532} cy={ny(2060.752) + 3.532} r={14} fill="transparent" />
        <text x={nx(RIGHT)} y={ny(2047.653)} textAnchor="end" className="ar-label" dominantBaseline="text-before-edge">
          Chañares Herrados
        </text>
        <text x={nx(RIGHT)} y={ny(2074.096)} textAnchor="end" className="ar-sublabel" dominantBaseline="text-before-edge">
          Cuenca Cuyana • Mendoza
        </text>
      </g>

      {/* —— Cerro de Los Leones —— */}
      <g className="ar-block" data-block="cerro">
        <rect
          className="ar-callout-frame"
          x={nx(1017.965) - 8}
          y={ny(2109.137) - 6}
          width={220}
          height={52}
          rx={4}
          fill="none"
          stroke="#CEEF7B"
          strokeWidth={1}
          opacity={0}
        />
        <path
          className="ar-leader"
          d={`M${nx(1225.492) + 75.03} ${ny(2079.498)} V${ny(2079.498) + 49.191} H${nx(1225.492)}`}
          stroke={COLORS.neuquinaNorte}
          fill="none"
        />
        <circle
          className="ar-dot"
          cx={nx(1296.988) + 3.532}
          cy={ny(2077.986) + 3.532}
          r={3.532}
          fill={COLORS.neuquinaNorte}
        />
        <circle className="ar-hit" cx={nx(1296.988) + 3.532} cy={ny(2077.986) + 3.532} r={14} fill="transparent" />
        <text x={nx(RIGHT)} y={ny(2109.137)} textAnchor="end" className="ar-label" dominantBaseline="text-before-edge">
          Cerro de Los Leones
        </text>
        <text x={nx(RIGHT)} y={ny(2137.287)} textAnchor="end" className="ar-sublabel" dominantBaseline="text-before-edge">
          Cuenca Neuquina • Mendoza
        </text>
      </g>

      {/* —— El Tordillo / La Tapera / P. Quiroga —— */}
      <g className="ar-block" data-block="tordillo">
        <rect
          className="ar-callout-frame"
          x={nx(1109.211) - 8}
          y={ny(2175.96) - 6}
          width={127}
          height={78}
          rx={4}
          fill="none"
          stroke="#CEEF7B"
          strokeWidth={1}
          opacity={0}
        />
        <path
          className="ar-leader"
          d={`M${nx(1225.492)} ${ny(2243.065) + 0.5} H${nx(1225.492) + 110.349} V${ny(2243.065) + 49.226}`}
          stroke={COLORS.tordilloDot}
          fill="none"
        />
        <circle
          className="ar-dot"
          cx={nx(1332.309) + 3.532}
          cy={ny(2291.79) + 3.532}
          r={3.532}
          fill={COLORS.tordilloDot}
        />
        <circle className="ar-hit" cx={nx(1332.309) + 3.532} cy={ny(2291.79) + 3.532} r={14} fill="transparent" />
        <text
          x={nx(RIGHT)}
          y={ny(2175.96)}
          textAnchor="end"
          className="ar-label ar-label--stack"
          dominantBaseline="text-before-edge"
        >
          <tspan x={nx(RIGHT)} dy="0">
            • El Tordillo
          </tspan>
          <tspan x={nx(RIGHT)} dy="22">
            • La Tapera
          </tspan>
          <tspan x={nx(RIGHT)} dy="22">
            • P. Quiroga
          </tspan>
        </text>
        <text x={nx(RIGHT)} y={ny(2247.569)} textAnchor="end" className="ar-sublabel" dominantBaseline="text-before-edge">
          Golfo San Jorge • Chubut
        </text>
      </g>

      {/* —— Piedra Clavada / Koluel Kaike —— */}
      <g className="ar-block" data-block="piedra">
        <rect
          className="ar-callout-frame"
          x={nx(1072) - 8}
          y={ny(2284.718) - 6}
          width={160}
          height={56}
          rx={4}
          fill="none"
          stroke="#CEEF7B"
          strokeWidth={1}
          opacity={0}
        />
        <path
          className="ar-leader"
          d={`M${nx(1225.5)} ${ny(2306.5)} H${nx(1327.91) + 3.532} V${ny(2323.469) + 3.532}`}
          stroke={COLORS.golfoSjS}
          fill="none"
        />
        <circle
          className="ar-dot"
          cx={nx(1327.91) + 3.532}
          cy={ny(2323.469) + 3.532}
          r={3.532}
          fill={COLORS.golfoSjS}
        />
        <circle className="ar-hit" cx={nx(1327.91) + 3.532} cy={ny(2323.469) + 3.532} r={14} fill="transparent" />
        <text
          x={nx(RIGHT)}
          y={ny(2284.718)}
          textAnchor="end"
          className="ar-label ar-label--stack"
          dominantBaseline="text-before-edge"
        >
          <tspan x={nx(RIGHT)} dy="0">
            • Piedra Clavada
          </tspan>
          <tspan x={nx(RIGHT)} dy="22">
            • Koluel Kaike
          </tspan>
        </text>
        <text x={nx(RIGHT)} y={ny(2331.911)} textAnchor="end" className="ar-sublabel" dominantBaseline="text-before-edge">
          Golfo San Jorge • Santa Cruz
        </text>
      </g>
    </svg>
  )
}
