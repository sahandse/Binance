import { useEffect, useRef, useState } from 'react'
import type { MetalPrice } from '../types'
import { formatUSD, formatToman, formatChange } from '../utils/format'
import { toPersianDigits } from '../utils/format'

interface MetalCardProps {
  metal: MetalPrice
  usdToToman: number
}

export function MetalCard({ metal, usdToToman }: MetalCardProps) {
  const [flashClass, setFlashClass] = useState('')
  const prevPriceRef = useRef(metal.price)

  useEffect(() => {
    if (prevPriceRef.current !== metal.price && prevPriceRef.current !== 0) {
      const cls = metal.price > prevPriceRef.current ? 'flash-green' : 'flash-red'
      setFlashClass(cls)
      const t = setTimeout(() => setFlashClass(''), 700)
      prevPriceRef.current = metal.price
      return () => clearTimeout(t)
    }
    prevPriceRef.current = metal.price
  }, [metal.price])

  const isGold = metal.symbol === 'XAU'
  const isPositive = metal.change24h >= 0

  // Gold per gram (1 troy ounce = 31.1035 grams)
  const pricePerGram = metal.price / 31.1035

  const accentColor = isGold
    ? 'from-amber-500/20 to-yellow-500/10 border-amber-500/30'
    : 'from-slate-500/20 to-gray-500/10 border-slate-500/30'
  const iconBg = isGold ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-500/10 border-slate-500/30'
  const priceColor = isGold ? 'text-amber-300' : 'text-slate-300'

  return (
    <div className={`rounded-2xl p-4 card-hover border bg-gradient-to-br ${accentColor} ${flashClass}`}
      style={{ backdropFilter: 'blur(12px)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${iconBg}`}>
            {metal.icon}
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">{metal.nameFA}</div>
            <div className="text-slate-500 text-xs mt-0.5">{metal.symbol} · {metal.unit}</div>
          </div>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
              d={isPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
          </svg>
          {formatChange(metal.change24h)}
        </div>
      </div>

      {/* Main price */}
      <div className={`text-3xl font-bold mb-1 ${priceColor}`} dir="ltr">
        {formatUSD(metal.price)}
      </div>
      <div className="text-amber-400 font-semibold text-sm mb-3">
        {formatToman(metal.price, usdToToman)} تومان
      </div>

      {/* Per gram (for gold/silver) */}
      <div className="bg-black/20 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">قیمت هر گرم</span>
          <div className="text-right">
            <div className={`font-bold text-base ${priceColor}`} dir="ltr">
              {formatUSD(pricePerGram)}
            </div>
            <div className="text-amber-400 text-xs">
              {formatToman(pricePerGram, usdToToman)} تومان
            </div>
          </div>
        </div>
        {isGold && (
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
            <span className="text-slate-400 text-sm">مثقال طلا (۴.۶۰۸گ)</span>
            <div className="text-right">
              <div className={`font-bold text-sm ${priceColor}`} dir="ltr">
                {formatUSD(pricePerGram * 4.608)}
              </div>
              <div className="text-amber-400 text-xs">
                {formatToman(pricePerGram * 4.608, usdToToman)} تومان
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High/Low */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-slate-500 mb-1">بالاترین ۲۴ساعت</div>
          <div className="text-emerald-400 font-bold" dir="ltr">{formatUSD(metal.high24h)}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <div className="text-slate-500 mb-1">پایین‌ترین ۲۴ساعت</div>
          <div className="text-red-400 font-bold" dir="ltr">{formatUSD(metal.low24h)}</div>
        </div>
      </div>

      {isGold && (
        <div className="mt-2 text-center text-xs text-slate-600">
          منبع: Kraken · {toPersianDigits('1')} اونس تروی = {toPersianDigits('31.1035')} گرم
        </div>
      )}
    </div>
  )
}

export function MetalCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton w-20 h-5" />
          <div className="skeleton w-16 h-3" />
        </div>
      </div>
      <div className="skeleton w-36 h-8 mb-2" />
      <div className="skeleton w-44 h-4 mb-3" />
      <div className="skeleton w-full h-16 rounded-xl mb-3" />
      <div className="grid grid-cols-2 gap-2">
        <div className="skeleton h-12 rounded-lg" />
        <div className="skeleton h-12 rounded-lg" />
      </div>
    </div>
  )
}
