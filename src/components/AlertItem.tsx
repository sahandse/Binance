import type { PriceAlert } from '../types'
import { formatUSD } from '../utils/format'

interface AlertItemProps {
  alert: PriceAlert
  currentPrice?: number
  onRemove: (id: string) => void
  onReset?: (id: string) => void
}

export function AlertItem({ alert, currentPrice, onRemove, onReset }: AlertItemProps) {
  const directionLabel = alert.direction === 'above' ? 'بالاتر از' : 'پایین‌تر از'
  const directionIcon = alert.direction === 'above' ? '▲' : '▼'

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: alert.triggered ? 'rgba(255,170,0,0.08)' : '#141416',
        border: `1px solid ${alert.triggered ? 'rgba(255,170,0,0.3)' : '#1f1f24'}`,
      }}
    >
      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: alert.triggered ? '#ffaa00' : '#2a2a30' }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{alert.nameFA}</div>
        <div className="text-xs c-muted">
          {directionIcon} {directionLabel} <span dir="ltr">{formatUSD(alert.targetPrice)}</span>
        </div>
        {currentPrice != null && currentPrice > 0 && (
          <div className="text-xs c-dim">
            قیمت فعلی: <span dir="ltr">{formatUSD(currentPrice)}</span>
          </div>
        )}
      </div>

      {/* Status badge */}
      {alert.triggered && (
        <span className="badge" style={{ background: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.3)', fontSize: '11px' }}>
          تریگر شد
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        {alert.triggered && onReset && (
          <button
            onClick={() => onReset(alert.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs"
            style={{ background: 'rgba(255,170,0,0.1)', color: '#ffaa00' }}
            title="بازنشانی"
          >
            ↺
          </button>
        )}
        <button
          onClick={() => onRemove(alert.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs"
          style={{ background: 'rgba(255,68,85,0.1)', color: '#ff4455' }}
          aria-label="حذف"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
