import type { KlineData } from '../types'

interface SparklineProps {
  data: KlineData
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 80, height = 32, color }: SparklineProps) {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  // Determine color from first/last price if not provided
  const lineColor = color ?? (data[data.length - 1] >= data[0] ? '#00cc88' : '#ff4455')

  // Build fill area
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`
  const fillColor = data[data.length - 1] >= data[0]
    ? 'rgba(0,204,136,0.08)'
    : 'rgba(255,68,85,0.08)'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={fillColor} />
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
