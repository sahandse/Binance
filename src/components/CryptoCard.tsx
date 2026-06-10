import { useEffect, useRef, useState } from 'react'
import type { CryptoPrice, KlineData } from '../types'
import { formatUSD, formatToman, formatChange, formatVolume } from '../utils/format'
import { Sparkline } from './Sparkline'

interface CryptoCardProps {
  crypto: CryptoPrice
  usdToToman: number
  klineData?: KlineData
  isFavorite?: boolean
  onToggleFavorite?: (symbol: string) => void
}

export function CryptoCard({ crypto, usdToToman, klineData, isFavorite, onToggleFavorite }: CryptoCardProps) {
  const [flash, setFlash] = useState('')
  const prev = useRef(crypto.price)

  useEffect(() => {
    if (prev.current && prev.current !== crypto.price) {
      const cls = crypto.price > prev.current ? 'flash-g' : 'flash-r'
      setFlash(cls)
      const t = setTimeout(() => setFlash(''), 550)
      prev.current = crypto.price
      return () => clearTimeout(t)
    }
    prev.current = crypto.price
  }, [crypto.price])

  const up = crypto.change24h >= 0

  return (
    <div className={`card ${flash}`}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: '#1e1e26', color: '#aaa' }}
          >
            {crypto.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">{crypto.nameFA}</div>
            <div className="text-xs c-muted">{crypto.symbol}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${up ? 'badge-up' : 'badge-down'}`}>
            {up ? '▲' : '▼'} {formatChange(crypto.change24h)}
          </span>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(crypto.symbol)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ background: isFavorite ? 'rgba(255,170,0,0.15)' : '#1e1e26' }}
              aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            >
              <span style={{ color: isFavorite ? '#ffaa00' : '#444' }}>★</span>
            </button>
          )}
        </div>
      </div>

      {/* Sparkline */}
      {klineData && klineData.length > 1 && (
        <div className="mb-2 flex justify-end">
          <Sparkline data={klineData} width={80} height={32} />
        </div>
      )}

      {/* Price */}
      <div className="text-2xl font-bold text-white tabular-nums mb-0.5" dir="ltr">
        {formatUSD(crypto.price)}
      </div>
      <div className="text-sm font-medium c-gold mb-3">
        {formatToman(crypto.price, usdToToman)} تومان
      </div>

      {/* Stats */}
      <hr className="divider" />
      <div className="flex items-center gap-4 text-xs">
        <span className="c-dim">بالا: <span className="c-green" dir="ltr">{formatUSD(crypto.high24h)}</span></span>
        <span className="c-dim">پایین: <span className="c-red" dir="ltr">{formatUSD(crypto.low24h)}</span></span>
        <span className="c-muted mr-auto">حجم: ${formatVolume(crypto.volume24h)}</span>
      </div>
    </div>
  )
}

export function CryptoCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="skel w-8 h-8 rounded-lg" />
        <div className="space-y-1.5">
          <div className="skel w-20 h-3.5" />
          <div className="skel w-10 h-3" />
        </div>
      </div>
      <div className="skel w-28 h-6 mb-1" />
      <div className="skel w-36 h-4 mb-3" />
      <hr className="divider" />
      <div className="flex gap-4">
        <div className="skel w-20 h-3" />
        <div className="skel w-20 h-3" />
      </div>
    </div>
  )
}
