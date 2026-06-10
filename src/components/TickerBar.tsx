import type { CryptoPrice } from '../types'
import { formatUSD, formatChange } from '../utils/format'

interface TickerBarProps {
  cryptos: CryptoPrice[]
}

export function TickerBar({ cryptos }: TickerBarProps) {
  if (cryptos.length === 0) return null
  const items = [...cryptos, ...cryptos]

  return (
    <div className="ticker-wrap border-b py-2" style={{ background: '#0e0e11', borderColor: '#1a1a1f' }}>
      <div className="ticker-track">
        {items.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-6 text-xs">
            <span className="c-dim font-medium">{c.symbol}</span>
            <span className="text-white font-bold tabular-nums" dir="ltr">{formatUSD(c.price)}</span>
            <span className={c.change24h >= 0 ? 'c-green' : 'c-red'}>
              {formatChange(c.change24h)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
