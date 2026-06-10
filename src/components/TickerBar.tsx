import type { CryptoPrice } from '../types'
import { formatUSD, formatChange } from '../utils/format'

interface TickerBarProps {
  cryptos: CryptoPrice[]
}

export function TickerBar({ cryptos }: TickerBarProps) {
  if (cryptos.length === 0) return null

  const items = [...cryptos, ...cryptos]

  return (
    <div className="bg-black/30 border-b border-white/5 py-2 overflow-hidden">
      <div className="ticker-content flex gap-8 items-center">
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 font-medium text-sm">{c.symbol}</span>
            <span className="text-white font-bold text-sm">{formatUSD(c.price)}</span>
            <span className={`text-xs font-medium ${c.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatChange(c.change24h)}
            </span>
            <span className="text-slate-600">·</span>
          </div>
        ))}
      </div>
    </div>
  )
}
