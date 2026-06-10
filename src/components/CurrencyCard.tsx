import type { CurrencyRate } from '../types'
import { formatToman, toPersianDigits } from '../utils/format'

interface CurrencyCardProps {
  currency: CurrencyRate
  usdToToman: number
}

export function CurrencyCard({ currency, usdToToman }: CurrencyCardProps) {
  // rateToUSD = how many of this currency per 1 USD
  // Price of 1 unit of this currency in USD
  const priceInUSD = 1 / currency.rateToUSD

  const formatRate = (r: number): string => {
    if (r >= 100) return toPersianDigits(Math.round(r).toLocaleString('en-US'))
    if (r >= 1) return toPersianDigits(r.toFixed(4))
    return toPersianDigits(r.toFixed(6))
  }

  return (
    <div className="glass-card rounded-2xl p-4 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xl bg-white/5">
            {currency.flag}
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">{currency.nameFA}</div>
            <div className="text-slate-500 text-xs mt-0.5">{currency.code}</div>
          </div>
        </div>
        <div className="text-left" dir="ltr">
          <div className="text-slate-400 text-xs mb-0.5">۱ دلار =</div>
          <div className="font-bold text-white text-base">{formatRate(currency.rateToUSD)} {currency.code}</div>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">قیمت ۱ {currency.nameFA}</span>
          <div className="text-right">
            <div className="text-white font-bold text-sm" dir="ltr">
              ${toPersianDigits(priceInUSD.toFixed(priceInUSD >= 0.01 ? 4 : 6))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-slate-400 text-sm">معادل تومانی</span>
          <div className="text-amber-400 font-semibold text-sm">
            {formatToman(priceInUSD, usdToToman)} تومان
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-center text-slate-600">
        منبع: Frankfurter.app
      </div>
    </div>
  )
}

export function CurrencyCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton w-24 h-4" />
          <div className="skeleton w-10 h-3" />
        </div>
      </div>
      <div className="skeleton w-full h-20 rounded-xl" />
    </div>
  )
}
