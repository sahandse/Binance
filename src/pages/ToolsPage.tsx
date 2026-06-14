import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Calculator } from '../components/Calculator'
import { AlertItem } from '../components/AlertItem'
import { TomanRateBar } from '../components/TomanRateBar'
import { SectionHeader } from '../components/SectionHeader'
import { formatUSD, formatMarketCap, toPersianDigits } from '../utils/format'

const NETWORK_LABELS: Record<string, string> = {
  eth: 'Ethereum', bsc: 'BSC', polygon_pos: 'Polygon',
  solana: 'Solana', arbitrum: 'Arbitrum', base: 'Base',
  optimism: 'Optimism', avalanche: 'Avalanche',
}

export function ToolsPage() {
  const {
    cryptos, metals, usdToToman, setUsdToToman,
    alerts, addAlert, removeAlert,
    dexPools, nftCollections, dexLoading, nftLoading,
    defiProtocols, defiYields, defiLoading,
  } = useApp()

  const [alertSymbol, setAlertSymbol] = useState('')
  const [alertPrice, setAlertPrice] = useState('')
  const [alertDir, setAlertDir] = useState<'above' | 'below'>('above')
  const [showAlertForm, setShowAlertForm] = useState(false)

  const priceMap: Record<string, number> = {}
  for (const c of cryptos) priceMap[c.symbol] = c.price

  const handleAddAlert = () => {
    const crypto = cryptos.find(c => c.symbol === alertSymbol)
    if (!crypto) return
    const price = parseFloat(alertPrice)
    if (!price || price <= 0) return

    addAlert({
      symbol: crypto.symbol,
      nameFA: crypto.nameFA,
      targetPrice: price,
      direction: alertDir,
    })

    setAlertSymbol('')
    setAlertPrice('')
    setShowAlertForm(false)
  }

  const handleResetAlert = (id: string) => {
    // Reset by removing + re-adding is not ideal; we just leave triggered state
    // For simplicity in this hook, we'll handle via the remove function
    // Users can delete and re-add
    removeAlert(id)
  }

  const activeAlerts = alerts.filter(a => !a.triggered)
  const triggeredAlerts = alerts.filter(a => a.triggered)

  return (
    <div className="page-content space-y-6">
      <h1 className="text-lg font-bold text-white">ابزارها</h1>

      {/* Settings */}
      <section>
        <SectionHeader title="تنظیمات" icon="⚙️" />
        <TomanRateBar usdToToman={usdToToman} onChange={setUsdToToman} />
      </section>

      {/* Calculator */}
      <section>
        <SectionHeader title="ماشین‌حساب تومانی" subtitle="تبدیل به تومان" icon="🧮" />
        <Calculator usdToToman={usdToToman} cryptos={cryptos} metals={metals} />
      </section>

      {/* DEX Trending Pools */}
      <section>
        <SectionHeader title="پول‌های داغ DEX" subtitle="CoinGecko Onchain · ۲۴ساعت" icon="🔥" />
        {dexLoading && dexPools.length === 0 ? (
          <div className="card p-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1f' }}>
                <div className="h-4 w-32 rounded-md" style={{ background: '#1f1f24' }} />
                <div className="h-4 w-24 rounded-md" style={{ background: '#1f1f24' }} />
              </div>
            ))}
          </div>
        ) : dexPools.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            {dexPools.map((pool, i) => {
              const up = pool.priceChange24h >= 0
              return (
                <div
                  key={pool.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < dexPools.length - 1 ? '1px solid #1a1a1f' : 'none' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{pool.name}</div>
                    <div className="text-xs c-muted">{NETWORK_LABELS[pool.network] ?? pool.network}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs c-muted">حجم ۲۴ساعت</div>
                    <div className="text-sm font-bold text-white">${formatMarketCap(pool.volume24h)}</div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg font-bold flex-shrink-0"
                    style={{
                      background: up ? 'rgba(0,204,136,0.1)' : 'rgba(255,68,85,0.1)',
                      color: up ? '#00cc88' : '#ff4455',
                    }}
                  >
                    {up ? '▲' : '▼'} {toPersianDigits(Math.abs(pool.priceChange24h).toFixed(2))}٪
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-6 c-muted text-sm">داده‌ای در دسترس نیست</div>
        )}
      </section>

      {/* NFT Markets */}
      <section>
        <SectionHeader title="بازار NFT" subtitle="CoinGecko · برترین مجموعه‌ها" icon="🖼️" />
        {nftLoading && nftCollections.length === 0 ? (
          <div className="card p-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1f' }}>
                <div className="h-4 w-32 rounded-md" style={{ background: '#1f1f24' }} />
                <div className="h-4 w-24 rounded-md" style={{ background: '#1f1f24' }} />
              </div>
            ))}
          </div>
        ) : nftCollections.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            {nftCollections.map((nft, i) => {
              const up = nft.priceChange24h >= 0
              return (
                <div
                  key={nft.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < nftCollections.length - 1 ? '1px solid #1a1a1f' : 'none' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: '#1e1e26' }}>🖼️</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{nft.name}</div>
                    <div className="text-xs c-muted">{nft.nativeCurrency.toUpperCase()}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-white">{formatUSD(nft.floorPriceUSD)}</div>
                    <div className="text-xs c-muted">کف قیمت</div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg font-bold flex-shrink-0"
                    style={{
                      background: up ? 'rgba(0,204,136,0.1)' : 'rgba(255,68,85,0.1)',
                      color: up ? '#00cc88' : '#ff4455',
                    }}
                  >
                    {up ? '▲' : '▼'} {toPersianDigits(Math.abs(nft.priceChange24h).toFixed(1))}٪
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-6 c-muted text-sm">داده‌ای در دسترس نیست</div>
        )}
      </section>

      {/* DeFiLlama Protocols */}
      <section>
        <SectionHeader title="برترین پروتکل‌های دیفای" subtitle="DeFiLlama · TVL" icon="🏦" />
        {defiLoading && defiProtocols.length === 0 ? (
          <div className="card p-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1f' }}>
                <div className="h-4 w-32 rounded-md" style={{ background: '#1f1f24' }} />
                <div className="h-4 w-24 rounded-md" style={{ background: '#1f1f24' }} />
              </div>
            ))}
          </div>
        ) : defiProtocols.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            {defiProtocols.map((p, i) => {
              const up = p.change24h >= 0
              return (
                <div
                  key={p.slug}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < defiProtocols.length - 1 ? '1px solid #1a1a1f' : 'none' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                    <div className="text-xs c-muted">{p.category} · {p.chain}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs c-muted">TVL</div>
                    <div className="text-sm font-bold text-white">${formatMarketCap(p.tvl)}</div>
                  </div>
                  {p.change24h !== 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-lg font-bold flex-shrink-0"
                      style={{
                        background: up ? 'rgba(0,204,136,0.1)' : 'rgba(255,68,85,0.1)',
                        color: up ? '#00cc88' : '#ff4455',
                      }}
                    >
                      {up ? '▲' : '▼'} {toPersianDigits(Math.abs(p.change24h).toFixed(1))}٪
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-6 c-muted text-sm">داده‌ای در دسترس نیست</div>
        )}
      </section>

      {/* DeFiLlama Yields */}
      <section>
        <SectionHeader title="بهترین بازدهی‌های دیفای" subtitle="DeFiLlama · APY بالاتر از میانگین" icon="📈" />
        {defiLoading && defiYields.length === 0 ? (
          <div className="card p-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1f' }}>
                <div className="h-4 w-32 rounded-md" style={{ background: '#1f1f24' }} />
                <div className="h-4 w-24 rounded-md" style={{ background: '#1f1f24' }} />
              </div>
            ))}
          </div>
        ) : defiYields.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            {defiYields.map((y, i) => (
              <div
                key={y.pool}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < defiYields.length - 1 ? '1px solid #1a1a1f' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{y.symbol}</div>
                  <div className="text-xs c-muted">{y.project} · {y.chain}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs c-muted">TVL</div>
                  <div className="text-sm text-white">${formatMarketCap(y.tvlUsd)}</div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-lg font-bold flex-shrink-0"
                  style={{ background: 'rgba(0,204,136,0.1)', color: '#00cc88' }}
                >
                  {toPersianDigits(y.apy.toFixed(1))}٪
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-6 c-muted text-sm">داده‌ای در دسترس نیست</div>
        )}
      </section>

      {/* Price Alerts */}
      <section>
        <SectionHeader title="هشدار قیمت" subtitle="اعلان هنگام رسیدن به قیمت هدف" icon="🔔" />

        {/* Add alert button */}
        <button
          onClick={() => setShowAlertForm(v => !v)}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mb-4"
          style={{
            background: showAlertForm ? '#1e1e24' : 'rgba(59,130,246,0.1)',
            color: showAlertForm ? '#888' : '#60a5fa',
            border: `1px solid ${showAlertForm ? '#2a2a30' : 'rgba(59,130,246,0.25)'}`,
          }}
        >
          {showAlertForm ? '✕ بستن' : '+ هشدار جدید'}
        </button>

        {/* Alert form */}
        {showAlertForm && (
          <div className="card space-y-4 mb-4">
            <h3 className="text-sm font-bold text-white">هشدار جدید</h3>

            <div>
              <label className="text-xs c-dim block mb-1.5">رمزارز</label>
              <select
                value={alertSymbol}
                onChange={e => setAlertSymbol(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none"
                style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
              >
                <option value="">انتخاب رمزارز...</option>
                {cryptos.map(c => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.icon} {c.nameFA} — {formatUSD(c.price)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs c-dim block mb-1.5">جهت هشدار</label>
              <div className="grid grid-cols-2 gap-2">
                {(['above', 'below'] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => setAlertDir(dir)}
                    className="py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: alertDir === dir ? (dir === 'above' ? 'rgba(0,204,136,0.15)' : 'rgba(255,68,85,0.15)') : '#1e1e24',
                      color: alertDir === dir ? (dir === 'above' ? '#00cc88' : '#ff4455') : '#666',
                      border: `1px solid ${alertDir === dir ? (dir === 'above' ? 'rgba(0,204,136,0.3)' : 'rgba(255,68,85,0.3)') : '#2a2a30'}`,
                    }}
                  >
                    {dir === 'above' ? '▲ بالاتر از' : '▼ پایین‌تر از'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs c-dim block mb-1.5">قیمت هدف (دلار)</label>
              <input
                type="number"
                value={alertPrice}
                onChange={e => setAlertPrice(e.target.value)}
                placeholder={alertSymbol ? String(priceMap[alertSymbol] ?? '') : '0'}
                min="0"
                step="any"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: '#0e0e11', border: '1px solid #1f1f24' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddAlert}
                disabled={!alertSymbol || !alertPrice}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                افزودن هشدار
              </button>
              <button
                onClick={() => setShowAlertForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm c-dim"
                style={{ background: '#1e1e24', border: '1px solid #2a2a30' }}
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {/* Triggered alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-3">
            <div className="text-xs c-gold font-semibold mb-2">⚡ هشدارهای فعال‌شده</div>
            <div className="space-y-2">
              {triggeredAlerts.map(a => (
                <AlertItem
                  key={a.id}
                  alert={a}
                  currentPrice={priceMap[a.symbol]}
                  onRemove={removeAlert}
                  onReset={handleResetAlert}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active alerts */}
        {activeAlerts.length > 0 ? (
          <div className="space-y-2">
            {activeAlerts.map(a => (
              <AlertItem
                key={a.id}
                alert={a}
                currentPrice={priceMap[a.symbol]}
                onRemove={removeAlert}
              />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-10 c-muted">
            <div className="text-3xl mb-2">🔕</div>
            <div className="text-sm">هیچ هشداری تنظیم نشده</div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
