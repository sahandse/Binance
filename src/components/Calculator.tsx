import { Fragment, useState } from 'react'
import type { CryptoPrice, MetalPrice } from '../types'
import { formatUSD, toPersianDigits } from '../utils/format'

interface CalculatorProps {
  usdToToman: number
  cryptos: CryptoPrice[]
  metals: MetalPrice[]
}

type Asset = { id: string; nameFA: string; symbol: string; priceUSD: number; icon: string }

function formatTomanResult(toman: number): string {
  if (toman <= 0) return '۰'
  if (toman >= 1e12) return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(toman / 1e12)) + ' هزار میلیارد تومان'
  if (toman >= 1e9)  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(toman / 1e9))  + ' میلیارد تومان'
  if (toman >= 1e6)  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(toman / 1e6))  + ' میلیون تومان'
  if (toman >= 1e3)  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(toman / 1e3))  + ' هزار تومان'
  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(toman)) + ' تومان'
}

export function Calculator({ usdToToman, cryptos, metals }: CalculatorProps) {
  const [amount, setAmount] = useState('')
  const [assetId, setAssetId] = useState('USD')

  const assets: Asset[] = [
    { id: 'USD', nameFA: 'دلار آمریکا', symbol: 'USD', priceUSD: 1, icon: '💵' },
    ...cryptos.map(c => ({ id: c.symbol, nameFA: c.nameFA, symbol: c.symbol, priceUSD: c.price, icon: c.icon })),
    ...metals.flatMap(m => [
      { id: m.symbol,          nameFA: `${m.nameFA} (اونس)`, symbol: m.symbol,       priceUSD: m.price,            icon: m.icon },
      { id: m.symbol + '_GR',  nameFA: `${m.nameFA} (گرم)`,  symbol: m.symbol + '/g', priceUSD: m.price / 31.1035, icon: m.icon },
    ]),
  ]

  const chosen = assets.find(a => a.id === assetId) ?? assets[0]
  const num = parseFloat(amount) || 0
  const usdVal = num * chosen.priceUSD
  const tomanVal = usdVal * usdToToman

  return (
    <div className="card">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Left – inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs c-dim block mb-1.5">نوع دارایی</label>
            <select
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer"
              style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
            >
              <optgroup label="فیات">
                <option value="USD">💵 دلار آمریکا</option>
              </optgroup>
              <optgroup label="رمزارز">
                {cryptos.map(c => (
                  <option key={c.symbol} value={c.symbol}>{c.icon} {c.nameFA}</option>
                ))}
              </optgroup>
              <optgroup label="فلزات">
                {metals.map(m => (
                  <Fragment key={m.symbol}>
                    <option value={m.symbol}>{m.icon} {m.nameFA} — اونس</option>
                    <option value={m.symbol + '_GR'}>{m.icon} {m.nameFA} — گرم</option>
                  </Fragment>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-xs c-dim block mb-1.5">مقدار</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
                min="0"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs c-muted pointer-events-none">
                {chosen.symbol}
              </span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {[1, 10, 100, 1000].map(p => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="px-3 py-1 rounded-lg text-xs c-dim"
                style={{ background: '#1a1a20', border: '1px solid #2a2a30' }}
              >
                {toPersianDigits(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Right – result */}
        <div
          className="rounded-xl p-4 flex flex-col justify-center"
          style={{ background: '#0e0e11', border: '1px solid #1a1a1f' }}
        >
          {num > 0 ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs c-muted mb-1">ارزش به دلار</div>
                <div className="text-lg font-bold text-white tabular-nums" dir="ltr">
                  ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(usdVal)}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #1f1f24', paddingTop: '12px' }}>
                <div className="text-xs c-muted mb-1">معادل تومانی</div>
                <div className="text-xl font-bold c-gold">
                  {formatTomanResult(tomanVal)}
                </div>
                <div className="text-xs c-muted mt-1">
                  {toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(tomanVal))} تومان
                </div>
              </div>
              {assetId !== 'USD' && (
                <div className="text-xs c-muted" style={{ borderTop: '1px solid #1f1f24', paddingTop: '8px' }}>
                  قیمت {chosen.nameFA}: {formatUSD(chosen.priceUSD)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center c-muted py-4">
              <div className="text-2xl mb-1">🧮</div>
              <div className="text-sm">مقدار را وارد کنید</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
