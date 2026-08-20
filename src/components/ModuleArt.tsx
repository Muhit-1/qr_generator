import { CornerDotType, CornerSquareType, DotType } from '@/types/qr.types'

function roundedPath(
  x: number,
  y: number,
  size: number,
  radii: [number, number, number, number]
): string {
  const [tl, tr, br, bl] = radii.map((r) => Math.min(r, size / 2)) as [
    number,
    number,
    number,
    number,
  ]
  return [
    `M${x + tl},${y}`,
    `H${x + size - tr}`,
    tr ? `A${tr},${tr} 0 0 1 ${x + size},${y + tr}` : `V${y}`,
    `V${y + size - br}`,
    br ? `A${br},${br} 0 0 1 ${x + size - br},${y + size}` : `H${x + size}`,
    `H${x + bl}`,
    bl ? `A${bl},${bl} 0 0 1 ${x},${y + size - bl}` : `V${y + size}`,
    `V${y + tl}`,
    tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : `H${x}`,
    'Z',
  ].join(' ')
}

function moduleRadii(type: DotType, unit: number): [number, number, number, number] {
  switch (type) {
    case 'rounded':
      return [unit * 0.3, unit * 0.3, unit * 0.3, unit * 0.3]
    case 'dots':
      return [unit / 2, unit / 2, unit / 2, unit / 2]
    case 'classy':
      return [unit / 2, 0, unit / 2, 0]
    case 'classy-rounded':
      return [unit / 2, unit * 0.25, unit / 2, unit * 0.25]
    case 'extra-rounded':
      return [unit * 0.45, unit * 0.45, unit * 0.45, unit * 0.45]
    default:
      return [0, 0, 0, 0]
  }
}

const SAMPLE_GRID: [number, number][] = [
  [0, 0],
  [0, 2],
  [0, 3],
  [1, 1],
  [1, 3],
  [2, 0],
  [2, 2],
  [3, 1],
  [3, 2],
]

export function DotSample({ type, size = 34 }: { type: DotType; size?: number }) {
  const cells = 4
  const unit = size / cells
  const radii = moduleRadii(type, unit)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {SAMPLE_GRID.map(([row, col]) => (
        <path
          key={`${row}-${col}`}
          d={roundedPath(col * unit, row * unit, unit, radii)}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

export function CornerSquareSample({
  type,
  size = 30,
}: {
  type: CornerSquareType
  size?: number
}) {
  const stroke = size / 7
  const inset = stroke / 2
  const box = size - stroke
  const radius = type === 'square' ? 0 : type === 'dot' ? size / 2 : size * 0.28

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect
        x={inset}
        y={inset}
        width={box}
        height={box}
        rx={radius}
        ry={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <rect
        x={size * 0.34}
        y={size * 0.34}
        width={size * 0.32}
        height={size * 0.32}
        rx={type === 'dot' ? size * 0.16 : size * 0.05}
        fill="currentColor"
      />
    </svg>
  )
}

export function CornerDotSample({ type, size = 30 }: { type: CornerDotType; size?: number }) {
  const box = size * 0.56
  const offset = (size - box) / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect
        x={offset}
        y={offset}
        width={box}
        height={box}
        rx={type === 'dot' ? box / 2 : box * 0.08}
        fill="currentColor"
      />
    </svg>
  )
}

export function QRMark({ size = 40 }: { size?: number }) {
  const unit = size / 11

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      {[
        [0, 0],
        [0, 7],
        [7, 0],
      ].map(([row, col]) => (
        <g key={`${row}-${col}`}>
          <rect
            x={col * unit + unit * 0.5}
            y={row * unit + unit * 0.5}
            width={unit * 3}
            height={unit * 3}
            rx={unit * 0.9}
            fill="none"
            stroke="currentColor"
            strokeWidth={unit}
          />
          <rect
            x={col * unit + unit * 1.6}
            y={row * unit + unit * 1.6}
            width={unit * 0.8}
            height={unit * 0.8}
            rx={unit * 0.4}
            fill="currentColor"
          />
        </g>
      ))}
      {[
        [6, 6],
        [6, 9],
        [8, 8],
        [9, 6],
        [9, 10],
        [10, 8],
      ].map(([row, col]) => (
        <rect
          key={`d-${row}-${col}`}
          x={col * unit * 0.9}
          y={row * unit * 0.9}
          width={unit * 0.9}
          height={unit * 0.9}
          rx={unit * 0.45}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

export function PlaceholderQR({
  foreground,
  background,
  size = 260,
}: {
  foreground: string
  background: string
  size?: number
}) {
  const cells = 25
  const unit = size / cells

  const finderOrigins: [number, number][] = [
    [0, 0],
    [0, 18],
    [18, 0],
  ]

  const data: [number, number][] = [
    [8, 0], [8, 2], [8, 4], [8, 6], [8, 8], [8, 10], [8, 12], [8, 14], [8, 16], [8, 18], [8, 20], [8, 22], [8, 24],
    [0, 8], [2, 8], [4, 8], [6, 8], [10, 8], [12, 8], [14, 8], [16, 8], [18, 8], [20, 8], [22, 8], [24, 8],
    [9, 9], [9, 11], [9, 13], [9, 15], [9, 17], [9, 19], [9, 21], [9, 23],
    [10, 10], [10, 12], [10, 14], [10, 16], [10, 18], [10, 20], [10, 22],
    [11, 9], [11, 11], [11, 13], [11, 17], [11, 19], [11, 21], [11, 23],
    [12, 10], [12, 14], [12, 16], [12, 20], [12, 22],
    [13, 9], [13, 11], [13, 13], [13, 15], [13, 19], [13, 21], [13, 23],
    [14, 10], [14, 12], [14, 16], [14, 18], [14, 20], [14, 22],
    [15, 9], [15, 13], [15, 15], [15, 17], [15, 19], [15, 23],
    [16, 10], [16, 12], [16, 14], [16, 18], [16, 20], [16, 22],
    [17, 9], [17, 11], [17, 13], [17, 15], [17, 17], [17, 21], [17, 23],
    [18, 10], [18, 14], [18, 16], [18, 20], [18, 22],
    [19, 9], [19, 11], [19, 13], [19, 17], [19, 19], [19, 21], [19, 23],
    [20, 10], [20, 12], [20, 14], [20, 16], [20, 18], [20, 22],
    [21, 9], [21, 11], [21, 15], [21, 19], [21, 21], [21, 23],
    [22, 10], [22, 12], [22, 14], [22, 16], [22, 20], [22, 22],
    [23, 9], [23, 11], [23, 13], [23, 15], [23, 17], [23, 21], [23, 23],
    [24, 10], [24, 12], [24, 14], [24, 18], [24, 20], [24, 22],
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Example QR code pattern"
      style={{ display: 'block' }}
    >
      <rect width={size} height={size} fill={background} />
      {finderOrigins.map(([row, col]) => (
        <g key={`finder-${row}-${col}`}>
          <rect
            x={col * unit + unit * 0.5}
            y={row * unit + unit * 0.5}
            width={unit * 6}
            height={unit * 6}
            rx={unit * 1.6}
            fill="none"
            stroke={foreground}
            strokeWidth={unit}
          />
          <rect
            x={(col + 2) * unit}
            y={(row + 2) * unit}
            width={unit * 3}
            height={unit * 3}
            rx={unit}
            fill={foreground}
          />
        </g>
      ))}
      {data.map(([row, col]) => (
        <rect
          key={`data-${row}-${col}`}
          x={col * unit}
          y={row * unit}
          width={unit}
          height={unit}
          rx={unit * 0.3}
          fill={foreground}
        />
      ))}
    </svg>
  )
}
