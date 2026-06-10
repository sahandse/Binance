import type { CurrencyRate } from '../types'
import { formatToman, toPersianDigits } from '../utils/format'

interface CurrencyCardProps {
  currency: CurrencyRate
  usdToToman: number
}

export function CurrencyCard({ currency, usdToToman }: CurrencyCardProps) {
  const priceInUSD = 1 / currency.rateToUSD

  const rateStr = currency.rateToUSD >= 100
    ? toPersianDigits(Math.round(currency.rateToUSD).toLocaleString('en-US'))
    : toPersianDigits(currency.rateToUSD.toFixed(4))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base"
            style={{ background: '#1e1e26' }}
          >
            {currency.flag}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{currency.nameFA}</div>
            <div className="text-xs c-muted">{currency.code}</div>
          </div>
        </div>
        <div className="text-xs c-dim text-left" dir="ltr">
          1 USD = {rateStr} {currency.code}
        </div>
      </div>

      <div
        className="rounded-xl p-3 space-y-2 text-sm"
        style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
      >
        <div className="flex justify-between">
          <span className="c-dim">ارزش ۱ {currency.nameFA}</span>
          <span className="text-white font-semibold tabular-nums" dir="ltr">
            ${toPersianDigits(priceInUSD.toFixed(priceInUSD >= 0.01 ? 4 : 6))}
          </span>
        </div>
        <div className="flex justify-between pt-2" style={{ borderTop: '1px solid #1f1f24' }}>
          <span className="c-dim">معادل تومانی</span>
          <span className="c-gold font-semibold">
            {formatToman(priceInUSD, usdToToman)} تومان
          </span>
        </div>
      </div>
    </div>
  )
}

export function CurrencyCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="skel w-8 h-8 rounded-full" />
        <div className="space-y-1.5">
          <div className="skel w-24 h-3.5" />
          <div className="skel w-10 h-3" />
        </div>
      </div>
      <div className="skel w-full h-16 rounded-xl" />
    </div>
  )
}
