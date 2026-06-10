import { formatCompactToman, formatUSD, toPersianDigits } from '../utils/format'
import { GOLD_PURITIES } from '../constants/market'

interface GoldPurityCardProps {
  goldPerGramUSD: number
  usdToToman: number
}

export function GoldPurityCard({ goldPerGramUSD, usdToToman }: GoldPurityCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: 'rgba(255,170,0,0.12)' }}
        >
          ✨
        </div>
        <div>
          <div className="text-sm font-semibold text-white">قیمت طلا بر اساس عیار</div>
          <div className="text-xs c-muted">قیمت هر گرم آلیاژ</div>
        </div>
      </div>

      <div className="space-y-3">
        {GOLD_PURITIES.map(p => {
          const priceUSD = goldPerGramUSD * p.multiplier
          const priceToman = priceUSD * usdToToman
          return (
            <div
              key={p.key}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
            >
              <div>
                <div className="text-sm font-semibold text-white">{p.label}</div>
                <div className="text-xs c-muted">ضریب {toPersianDigits(p.multiplier.toString())}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold c-gold">{formatCompactToman(priceToman)} تومان</div>
                <div className="text-xs c-dim" dir="ltr">{formatUSD(priceUSD)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
