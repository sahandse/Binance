import type { FearGreedData } from '../types'
import { toPersianDigits } from '../utils/format'

interface FearGreedWidgetProps {
  data: FearGreedData | null
  loading?: boolean
}

function getColor(value: number): string {
  if (value <= 25) return '#ff4455'
  if (value <= 45) return '#ff8c42'
  if (value <= 55) return '#ffcc00'
  if (value <= 75) return '#66cc66'
  return '#00cc88'
}

export function FearGreedWidget({ data, loading }: FearGreedWidgetProps) {
  if (loading || !data) {
    return (
      <div className="card flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
        <div className="skel w-24 h-24 rounded-full mb-2" />
        <div className="skel w-20 h-4" />
      </div>
    )
  }

  const { value, label } = data
  const color = getColor(value)
  const pct = toPersianDigits(value)

  // Semicircle: radius=44, center=(60,60)
  const cx = 60, cy = 60, r = 44
  const startAngle = Math.PI          // 180° – left
  const endAngle = 0                  // 0° – right
  const arcLength = Math.PI * r       // half circumference

  // needle angle
  const needleAngle = Math.PI - (value / 100) * Math.PI
  const nx = cx + (r - 6) * Math.cos(needleAngle)
  const ny = cy - (r - 6) * Math.sin(needleAngle)

  // background arc path
  const bgX1 = cx + r * Math.cos(startAngle)
  const bgY1 = cy - r * Math.sin(startAngle)
  const bgX2 = cx + r * Math.cos(endAngle)
  const bgY2 = cy - r * Math.sin(endAngle)

  // value arc  (stroke-dasharray trick)
  const dashLen = (value / 100) * arcLength

  return (
    <div className="card flex flex-col items-center py-4">
      <div className="text-xs c-dim mb-3">شاخص ترس و طمع</div>
      <svg width="120" height="70" viewBox="0 0 120 70" style={{ overflow: 'visible' }}>
        {/* background arc */}
        <path
          d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`}
          fill="none"
          stroke="#1f1f24"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dashLen} ${arcLength}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {/* needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill={color} />
        {/* value text */}
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={color}
          fontFamily="Vazirmatn, sans-serif"
        >
          {pct}
        </text>
      </svg>
      <div className="text-sm font-bold mt-1" style={{ color }}>{label}</div>
      <div className="flex justify-between w-full px-2 mt-2 text-xs c-muted">
        <span>ترس شدید</span>
        <span>طمع شدید</span>
      </div>
    </div>
  )
}
