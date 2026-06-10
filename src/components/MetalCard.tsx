import { useEffect, useRef, useState } from 'react'
import type { MetalPrice } from '../types'
import { formatUSD, formatToman, formatChange } from '../utils/format'

interface MetalCardProps {
  metal: MetalPrice
  usdToToman: number
}

export function MetalCard({ metal, usdToToman }: MetalCardProps) {
  const [flash, setFlash] = useState('')
  const prev = useRef(metal.price)

  useEffect(() => {
    if (prev.current && prev.current !== metal.price) {
      const cls = metal.price > prev.current ? 'flash-g' : 'flash-r'
      setFlash(cls)
      const t = setTimeout(() => setFlash(''), 550)
      prev.current = metal.price
      return () => clearTimeout(t)
    }
    prev.current = metal.price
  }, [metal.price])

  const up = metal.change24h >= 0
  const perGram = metal.price / 31.1035
  const perMithqal = perGram * 4.608

  return (
    <div className={`card ${flash}`}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: metal.symbol === 'XAU' ? 'rgba(255,170,0,.12)' : 'rgba(148,163,184,.1)' }}
          >
            {metal.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{metal.nameFA}</div>
            <div className="text-xs c-muted">{metal.symbol} · هر اونس</div>
          </div>
        </div>
        <span className={`badge ${up ? 'badge-up' : 'badge-down'}`}>
          {up ? '▲' : '▼'} {formatChange(metal.change24h)}
        </span>
      </div>

      {/* Main price – per ounce */}
      <div className="text-2xl font-bold text-white tabular-nums mb-0.5" dir="ltr">
        {formatUSD(metal.price)}
      </div>
      <div className="text-sm c-gold font-medium mb-3">
        {formatToman(metal.price, usdToToman)} تومان
      </div>

      {/* Per-gram rows */}
      <div
        className="rounded-xl p-3 mb-3 space-y-2 text-sm"
        style={{ background: '#0e0e10', border: '1px solid #1a1a1f' }}
      >
        <div className="flex justify-between items-center">
          <span className="c-dim">هر گرم</span>
          <div className="text-right">
            <span className="text-white font-semibold tabular-nums" dir="ltr">{formatUSD(perGram)}</span>
            <span className="text-xs c-gold mr-2">{formatToman(perGram, usdToToman)} تومان</span>
          </div>
        </div>
        {metal.symbol === 'XAU' && (
          <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid #1f1f24' }}>
            <span className="c-dim">مثقال (۴.۶گ)</span>
            <div className="text-right">
              <span className="text-white font-semibold tabular-nums" dir="ltr">{formatUSD(perMithqal)}</span>
              <span className="text-xs c-gold mr-2">{formatToman(perMithqal, usdToToman)} تومان</span>
            </div>
          </div>
        )}
      </div>

      {/* High / Low */}
      <hr className="divider" />
      <div className="flex gap-4 text-xs">
        <span className="c-dim">بالا: <span className="c-green" dir="ltr">{formatUSD(metal.high24h)}</span></span>
        <span className="c-dim">پایین: <span className="c-red" dir="ltr">{formatUSD(metal.low24h)}</span></span>
        <span className="c-muted mr-auto text-xs">Kraken</span>
      </div>
    </div>
  )
}

export function MetalCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="skel w-8 h-8 rounded-lg" />
        <div className="space-y-1.5">
          <div className="skel w-16 h-3.5" />
          <div className="skel w-24 h-3" />
        </div>
      </div>
      <div className="skel w-32 h-7 mb-1" />
      <div className="skel w-40 h-4 mb-3" />
      <div className="skel w-full h-16 rounded-xl mb-3" />
      <hr className="divider" />
      <div className="flex gap-4">
        <div className="skel w-20 h-3" />
        <div className="skel w-20 h-3" />
      </div>
    </div>
  )
}
