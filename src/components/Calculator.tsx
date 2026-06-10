import { Fragment, useState } from 'react'
import type { CryptoPrice, MetalPrice } from '../types'
import { formatUSD, toPersianDigits } from '../utils/format'

interface CalculatorProps {
  usdToToman: number
  cryptos: CryptoPrice[]
  metals: MetalPrice[]
}

type Asset = {
  id: string
  nameFA: string
  symbol: string
  priceUSD: number
  icon: string
}

export function Calculator({ usdToToman, cryptos, metals }: CalculatorProps) {
  const [amount, setAmount] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<string>('USD')

  const assets: Asset[] = [
    { id: 'USD', nameFA: 'دلار آمریکا', symbol: 'USD', priceUSD: 1, icon: '💵' },
    ...cryptos.map(c => ({
      id: c.symbol,
      nameFA: c.nameFA,
      symbol: c.symbol,
      priceUSD: c.price,
      icon: c.icon,
    })),
    ...metals.map(m => ({
      id: m.symbol,
      nameFA: m.nameFA + ' (اونس)',
      symbol: m.symbol,
      priceUSD: m.price,
      icon: m.icon,
    })),
    ...metals.map(m => ({
      id: m.symbol + '_GRAM',
      nameFA: m.nameFA + ' (گرم)',
      symbol: m.symbol + '/g',
      priceUSD: m.price / 31.1035,
      icon: m.icon,
    })),
  ]

  const chosen = assets.find(a => a.id === selectedAsset) ?? assets[0]
  const numAmount = parseFloat(amount) || 0
  const usdValue = numAmount * chosen.priceUSD
  const tomanValue = usdValue * usdToToman

  const presets = [1, 5, 10, 100, 1000]

  const formatResult = (val: number): string => {
    if (val === 0) return '۰'
    if (val >= 1_000_000_000_000) {
      return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(val / 1_000_000_000_000)) + ' هزار میلیارد'
    }
    if (val >= 1_000_000_000) {
      return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(val / 1_000_000_000)) + ' میلیارد'
    }
    if (val >= 1_000_000) {
      return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(val / 1_000_000)) + ' میلیون'
    }
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(val))
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl">
          🧮
        </div>
        <div>
          <h2 className="font-bold text-white text-lg">ماشین‌حساب تومان</h2>
          <p className="text-slate-500 text-xs">تبدیل ارز و رمزارز به تومان</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input side */}
        <div className="space-y-3">
          {/* Asset selector */}
          <div>
            <label className="text-slate-400 text-sm mb-1 block">نوع دارایی</label>
            <select
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-base outline-none focus:border-purple-500/50 cursor-pointer"
              dir="rtl"
            >
              <optgroup label="ارزهای فیات">
                <option value="USD">💵 دلار آمریکا</option>
              </optgroup>
              <optgroup label="رمزارزها">
                {cryptos.map(c => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.icon} {c.nameFA} ({c.symbol})
                  </option>
                ))}
              </optgroup>
              <optgroup label="فلزات گرانبها">
                {metals.map(m => (
                  <Fragment key={m.symbol}>
                    <option value={m.symbol}>
                      {m.icon} {m.nameFA} - هر اونس
                    </option>
                    <option value={m.symbol + '_GRAM'}>
                      {m.icon} {m.nameFA} - هر گرم
                    </option>
                  </Fragment>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-slate-400 text-sm mb-1 block">مقدار</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="مقدار را وارد کنید"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-base outline-none focus:border-purple-500/50"
                dir="ltr"
                min="0"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                {chosen.symbol}
              </div>
            </div>
          </div>

          {/* Preset amounts */}
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors"
              >
                {toPersianDigits(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Result side */}
        <div className="bg-black/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-sm mb-2">نتیجه تبدیل</div>

            {numAmount > 0 && (
              <>
                {/* USD value */}
                <div className="mb-3 pb-3 border-b border-white/5">
                  <div className="text-slate-400 text-xs mb-1">ارزش به دلار</div>
                  <div className="text-white font-bold text-xl" dir="ltr">
                    ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(usdValue)}
                  </div>
                </div>

                {/* Toman value */}
                <div>
                  <div className="text-slate-400 text-xs mb-1">ارزش به تومان</div>
                  <div className="text-amber-400 font-bold text-2xl">
                    {formatResult(tomanValue)}
                    <span className="text-amber-500 text-lg mr-1">تومان</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    {toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(tomanValue))} تومان
                  </div>
                </div>
              </>
            )}

            {numAmount === 0 && (
              <div className="text-slate-600 text-center py-4">
                <div className="text-3xl mb-2">🧮</div>
                <div>مقدار را وارد کنید</div>
              </div>
            )}
          </div>

          {numAmount > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>نرخ دلار:</span>
                <span>{toPersianDigits(usdToToman.toLocaleString())} تومان</span>
              </div>
              {selectedAsset !== 'USD' && (
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>قیمت {chosen.nameFA}:</span>
                  <span dir="ltr">{formatUSD(chosen.priceUSD)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
