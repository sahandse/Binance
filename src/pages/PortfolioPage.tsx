import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PortfolioItemRow } from '../components/PortfolioItem'
import { formatUSD, formatCompactToman } from '../utils/format'

export function PortfolioPage() {
  const { portfolio, addToPortfolio, removeFromPortfolio, cryptos, usdToToman } = useApp()

  const [showAdd, setShowAdd] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [amount, setAmount] = useState('')
  const [buyPrice, setBuyPrice] = useState('')

  const priceMap: Record<string, number> = {}
  for (const c of cryptos) priceMap[c.symbol] = c.price

  const totalUSD = portfolio.reduce((sum, item) => {
    const price = priceMap[item.symbol] ?? 0
    return sum + item.amount * price
  }, 0)

  const costBasisUSD = portfolio.reduce((sum, item) => sum + item.amount * item.buyPrice, 0)
  const totalPnlUSD = totalUSD - costBasisUSD

  const handleAdd = () => {
    const crypto = cryptos.find(
      c => c.symbol.toLowerCase() === symbol.trim().toUpperCase() ||
           c.nameFA.includes(symbol.trim())
    )
    if (!crypto) return alert('رمزارز یافت نشد')
    const amt = parseFloat(amount)
    const buy = parseFloat(buyPrice)
    if (!amt || amt <= 0) return alert('مقدار نادرست')
    if (!buy || buy <= 0) return alert('قیمت خرید نادرست')

    addToPortfolio({
      symbol: crypto.symbol,
      nameFA: crypto.nameFA,
      amount: amt,
      buyPrice: buy,
      icon: crypto.icon,
    })
    setSymbol('')
    setAmount('')
    setBuyPrice('')
    setShowAdd(false)
  }

  return (
    <div className="page-content space-y-5">
      <h1 className="text-lg font-bold text-white">پورتفولیو</h1>

      {/* Summary */}
      {portfolio.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ background: '#141416', border: '1px solid #1f1f24' }}
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs c-muted mb-1">ارزش کل (دلار)</div>
              <div className="text-base font-bold text-white" dir="ltr">{formatUSD(totalUSD)}</div>
            </div>
            <div style={{ borderRight: '1px solid #1f1f24', borderLeft: '1px solid #1f1f24' }}>
              <div className="text-xs c-muted mb-1">ارزش کل (تومان)</div>
              <div className="text-base font-bold c-gold">{formatCompactToman(totalUSD * usdToToman)}</div>
            </div>
            <div>
              <div className="text-xs c-muted mb-1">سود / زیان کل</div>
              <div className={`text-base font-bold ${totalPnlUSD >= 0 ? 'c-green' : 'c-red'}`} dir="ltr">
                {totalPnlUSD >= 0 ? '+' : ''}{formatUSD(totalPnlUSD)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add button */}
      <button
        onClick={() => setShowAdd(v => !v)}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        style={{ background: showAdd ? '#1e1e24' : 'rgba(255,170,0,0.12)', color: showAdd ? '#888' : '#ffaa00', border: `1px solid ${showAdd ? '#2a2a30' : 'rgba(255,170,0,0.3)'}` }}
      >
        {showAdd ? '✕ بستن' : '+ افزودن دارایی'}
      </button>

      {/* Add form */}
      {showAdd && (
        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-white">افزودن دارایی جدید</h3>

          <div>
            <label className="text-xs c-dim block mb-1.5">نماد رمزارز</label>
            <select
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none"
              style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
            >
              <option value="">انتخاب رمزارز...</option>
              {cryptos.map(c => (
                <option key={c.symbol} value={c.symbol}>
                  {c.icon} {c.nameFA} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs c-dim block mb-1.5">مقدار</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.001"
              min="0"
              step="any"
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
            />
          </div>

          <div>
            <label className="text-xs c-dim block mb-1.5">قیمت خرید (دلار)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={e => setBuyPrice(e.target.value)}
              placeholder={symbol ? String(priceMap[symbol] ?? '') : '0'}
              min="0"
              step="any"
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black"
              style={{ background: '#ffaa00' }}
            >
              افزودن
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 rounded-xl text-sm c-dim"
              style={{ background: '#1e1e24', border: '1px solid #2a2a30' }}
            >
              لغو
            </button>
          </div>
        </div>
      )}

      {/* Portfolio items */}
      {portfolio.length === 0 ? (
        <div className="text-center py-16 c-muted">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-sm">پورتفولیو خالی است</div>
          <div className="text-xs mt-1">دارایی‌های خود را اضافه کنید</div>
        </div>
      ) : (
        <div className="space-y-3">
          {portfolio.map(item => (
            <PortfolioItemRow
              key={item.id}
              item={item}
              currentPrice={priceMap[item.symbol] ?? 0}
              usdToToman={usdToToman}
              onRemove={removeFromPortfolio}
            />
          ))}
        </div>
      )}
    </div>
  )
}
