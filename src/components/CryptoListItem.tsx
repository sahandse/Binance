import type { CryptoPrice, KlineData } from '../types'
import { formatUSD, formatToman, formatChange, toPersianDigits } from '../utils/format'
import { Sparkline } from './Sparkline'

interface CryptoListItemProps {
  crypto: CryptoPrice
  usdToToman: number
  klineData?: KlineData
  isFavorite?: boolean
  onToggleFavorite?: (symbol: string) => void
  rank?: number
  marketPriceToman?: number | null
}

export function CryptoListItem({ crypto, usdToToman, klineData, isFavorite, onToggleFavorite, rank, marketPriceToman }: CryptoListItemProps) {
  const up = crypto.change24h >= 0
  const hasMarket = marketPriceToman != null && marketPriceToman > 0

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b"
      style={{ borderColor: '#1a1a1f' }}
    >
      {/* Rank */}
      {rank != null && (
        <div className="text-xs c-muted w-5 text-center flex-shrink-0">{rank}</div>
      )}

      {/* Icon + name */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: '#1e1e26', color: '#aaa' }}
        >
          {crypto.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{crypto.nameFA}</div>
          <div className="text-xs c-muted">{crypto.symbol}</div>
        </div>
      </div>

      {/* Sparkline */}
      {klineData && klineData.length > 1 && (
        <div className="flex-shrink-0 hidden sm:block">
          <Sparkline data={klineData} width={60} height={24} />
        </div>
      )}

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold text-white tabular-nums" dir="ltr">{formatUSD(crypto.price)}</div>
        {hasMarket ? (
          <div className="text-xs flex items-center gap-1 justify-end">
            <span style={{ color: '#00cc88', fontSize: '0.6rem' }}>●</span>
            <span className="c-gold">{toPersianDigits(marketPriceToman!.toLocaleString('en-US'))} ت</span>
          </div>
        ) : (
          <div className="text-xs c-gold">{formatToman(crypto.price, usdToToman)}</div>
        )}
      </div>

      {/* Change */}
      <div className="flex-shrink-0">
        <span className={`badge ${up ? 'badge-up' : 'badge-down'} text-xs`}>
          {up ? '▲' : '▼'} {formatChange(crypto.change24h)}
        </span>
      </div>

      {/* Star */}
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(crypto.symbol)}
          className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ background: isFavorite ? 'rgba(255,170,0,0.15)' : 'transparent' }}
          aria-label="علاقه‌مندی"
        >
          <span style={{ color: isFavorite ? '#ffaa00' : '#333' }}>★</span>
        </button>
      )}
    </div>
  )
}
