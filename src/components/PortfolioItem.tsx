import type { PortfolioItem as PortfolioItemType } from '../types'
import { formatUSD, formatCompactToman, toPersianDigits } from '../utils/format'

interface PortfolioItemProps {
  item: PortfolioItemType
  currentPrice: number
  usdToToman: number
  onRemove: (id: string) => void
}

export function PortfolioItemRow({ item, currentPrice, usdToToman, onRemove }: PortfolioItemProps) {
  const currentValueUSD = item.amount * currentPrice
  const costBasisUSD = item.amount * item.buyPrice
  const pnlUSD = currentValueUSD - costBasisUSD
  const pnlPct = costBasisUSD > 0 ? (pnlUSD / costBasisUSD) * 100 : 0
  const isUp = pnlUSD >= 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: '#1e1e26', color: '#aaa' }}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{item.nameFA}</div>
            <div className="text-xs c-muted">
              {toPersianDigits(item.amount)} {item.symbol}
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs c-red hover:bg-red-900"
          style={{ background: 'rgba(255,68,85,0.1)' }}
          aria-label="حذف"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-3"
          style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
        >
          <div className="text-xs c-muted mb-1">ارزش فعلی</div>
          <div className="text-sm font-bold text-white" dir="ltr">{formatUSD(currentValueUSD)}</div>
          <div className="text-xs c-gold">{formatCompactToman(currentValueUSD * usdToToman)} تومان</div>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
        >
          <div className="text-xs c-muted mb-1">سود / زیان</div>
          <div className={`text-sm font-bold ${isUp ? 'c-green' : 'c-red'}`} dir="ltr">
            {isUp ? '+' : ''}{formatUSD(pnlUSD)}
          </div>
          <div className={`text-xs ${isUp ? 'c-green' : 'c-red'}`}>
            {isUp ? '+' : ''}{toPersianDigits(pnlPct.toFixed(2))}٪
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs c-muted mt-3 pt-3" style={{ borderTop: '1px solid #1f1f24' }}>
        <span>قیمت خرید: <span className="text-white" dir="ltr">{formatUSD(item.buyPrice)}</span></span>
        <span>قیمت فعلی: <span className="text-white" dir="ltr">{currentPrice > 0 ? formatUSD(currentPrice) : '---'}</span></span>
      </div>
    </div>
  )
}
