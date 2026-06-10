import { useEffect, useRef, useState } from 'react'
import type { CryptoPrice } from '../types'
import { formatUSD, formatToman, formatChange, formatVolume } from '../utils/format'

interface CryptoCardProps {
  crypto: CryptoPrice
  usdToToman: number
}

export function CryptoCard({ crypto, usdToToman }: CryptoCardProps) {
  const [flashClass, setFlashClass] = useState('')
  const prevPriceRef = useRef(crypto.price)

  useEffect(() => {
    if (prevPriceRef.current !== crypto.price && prevPriceRef.current !== 0) {
      const cls = crypto.price > prevPriceRef.current ? 'flash-green' : 'flash-red'
      setFlashClass(cls)
      const t = setTimeout(() => setFlashClass(''), 700)
      prevPriceRef.current = crypto.price
      return () => clearTimeout(t)
    }
    prevPriceRef.current = crypto.price
  }, [crypto.price])

  const isPositive = crypto.change24h >= 0

  return (
    <div className={`glass-card rounded-2xl p-4 card-hover ${flashClass}`}>
      <div className="flex items-start justify-between mb-3">
        {/* Coin info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
            {crypto.icon}
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">{crypto.nameFA}</div>
            <div className="text-slate-500 text-xs mt-0.5">{crypto.symbol}</div>
          </div>
        </div>

        {/* 24h change badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
              d={isPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
            />
          </svg>
          {formatChange(crypto.change24h)}
        </div>
      </div>

      {/* Price USD */}
      <div className="mb-1">
        <div className="text-2xl font-bold text-white ltr tabular-nums" dir="ltr">
          {formatUSD(crypto.price)}
        </div>
      </div>

      {/* Price Toman */}
      <div className="text-amber-400 font-semibold text-sm mb-3">
        {formatToman(crypto.price, usdToToman)} تومان
      </div>

      {/* Stats row */}
      <div className="border-t border-white/5 pt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-slate-500 mb-1">بالاترین</div>
          <div className="text-emerald-400 font-medium" dir="ltr">{formatUSD(crypto.high24h)}</div>
        </div>
        <div>
          <div className="text-slate-500 mb-1">پایین‌ترین</div>
          <div className="text-red-400 font-medium" dir="ltr">{formatUSD(crypto.low24h)}</div>
        </div>
        <div>
          <div className="text-slate-500 mb-1">حجم (۲۴س)</div>
          <div className="text-slate-300 font-medium">${formatVolume(crypto.volume24h)}</div>
        </div>
      </div>
    </div>
  )
}

export function CryptoCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton w-24 h-4" />
          <div className="skeleton w-12 h-3" />
        </div>
      </div>
      <div className="skeleton w-32 h-7 mb-2" />
      <div className="skeleton w-40 h-4 mb-3" />
      <div className="border-t border-white/5 pt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="space-y-1">
            <div className="skeleton w-16 h-3" />
            <div className="skeleton w-20 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
