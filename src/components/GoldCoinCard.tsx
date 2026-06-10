import type { GoldCoin } from '../types'
import { formatCompactToman, formatUSD, toPersianDigits } from '../utils/format'
import { calcCoinPrice } from '../utils/goldCoins'

interface GoldCoinCardProps {
  coin: GoldCoin
  goldPerGramUSD: number
  usdToToman: number
}

export function GoldCoinCard({ coin, goldPerGramUSD, usdToToman }: GoldCoinCardProps) {
  const meltValueToman = calcCoinPrice(coin.pureGoldGrams, goldPerGramUSD, usdToToman)
  const meltValueUSD = coin.pureGoldGrams * goldPerGramUSD

  return (
    <div className="card">
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
      </div>

      <div className="text-xl font-bold c-gold mb-0.5">
        {formatCompactToman(meltValueToman)} تومان
      </div>
      <div className="text-sm c-dim mb-3" dir="ltr">{formatUSD(meltValueUSD)}</div>

      <div
        className="rounded-lg px-3 py-2 text-xs c-muted"
        style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
      >
        ارزش ذاتی (بدون اجرت)
      </div>
    </div>
  )
}
