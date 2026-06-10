import type { GoldCoin } from '../types'
import { formatCompactToman, formatUSD, toPersianDigits } from '../utils/format'
import { calcCoinPrice } from '../utils/goldCoins'

interface GoldCoinCardProps {
  coin: GoldCoin
  goldPerGramUSD: number
  usdToToman: number
  marketPriceToman?: number | null
}

export function GoldCoinCard({ coin, goldPerGramUSD, usdToToman, marketPriceToman }: GoldCoinCardProps) {
  const meltToman = calcCoinPrice(coin.pureGoldGrams, goldPerGramUSD, usdToToman)
  const meltUSD = coin.pureGoldGrams * goldPerGramUSD
  const hasMarket = marketPriceToman != null && marketPriceToman > 0
  const premium = hasMarket ? ((marketPriceToman! - meltToman) / meltToman) * 100 : null

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'rgba(255,170,0,0.12)' }}
          >
            🪙
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{coin.nameFA}</div>
            <div className="text-xs c-muted">
              {toPersianDigits(coin.pureGoldGrams.toFixed(3))} گرم طلای خالص
            </div>
          </div>
        </div>
        {hasMarket ? (
          <span
            className="text-xs px-2 py-0.5 rounded-lg font-semibold"
            style={{ background: 'rgba(0,204,136,0.1)', color: '#00cc88', border: '1px solid rgba(0,204,136,0.2)' }}
          >
            بازار
          </span>
        ) : (
          <span
            className="text-xs px-2 py-0.5 rounded-lg"
            style={{ background: '#1a1a1f', color: '#555', border: '1px solid #222' }}
          >
            ذاتی
          </span>
        )}
      </div>

      {/* Main price */}
      <div className="text-xl font-bold c-gold mb-0.5">
        {formatCompactToman(hasMarket ? marketPriceToman! : meltToman)} تومان
      </div>
      <div className="text-sm c-dim mb-3" dir="ltr">
        {formatUSD(hasMarket ? marketPriceToman! / usdToToman : meltUSD)}
      </div>

      {/* Details */}
      <div
        className="rounded-lg px-3 py-2 space-y-1.5"
        style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
      >
        {hasMarket && (
          <div className="flex items-center justify-between text-xs">
            <span className="c-muted">ارزش ذاتی</span>
            <span className="text-white">{formatCompactToman(meltToman)} تومان</span>
          </div>
        )}
        {premium !== null && (
          <div className="flex items-center justify-between text-xs">
            <span className="c-muted">حق ضرب</span>
            <span className="font-bold" style={{ color: premium > 0 ? '#ffaa00' : '#00cc88' }}>
              {premium > 0 ? '+' : ''}{toPersianDigits(premium.toFixed(1))}٪
            </span>
          </div>
        )}
        {!hasMarket && (
          <div className="text-xs c-muted">ارزش ذاتی · بدون اجرت ساخت</div>
        )}
      </div>
    </div>
  )
}
