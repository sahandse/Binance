import { useApp } from '../context/AppContext'
import { FearGreedWidget } from '../components/FearGreedWidget'
import { CryptoCard, CryptoCardSkeleton } from '../components/CryptoCard'
import { MetalCard, MetalCardSkeleton } from '../components/MetalCard'
import { SectionHeader } from '../components/SectionHeader'
import { toPersianDigits, formatMarketCap, formatUSD, formatChange, formatToman } from '../utils/format'

export function Dashboard() {
  const {
    cryptos, metals, loading, cryptoError,
    globalData, fearGreed, globalLoading,
    klines, usdToToman,
    toggleFavorite, isFavorite,
  } = useApp()

  // Top 2 movers (by absolute change)
  const topMovers = [...cryptos]
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 4)

  // BTC + ETH featured
  const btc = cryptos.find(c => c.symbol === 'BTC')
  const eth = cryptos.find(c => c.symbol === 'ETH')
  const featuredCryptos = [btc, eth].filter(Boolean) as typeof cryptos

  const gold = metals.find(m => m.symbol === 'XAU')
  const goldPerGram = gold ? gold.price / 31.1035 : null

  return (
    <div className="page-content space-y-6">
      {/* Global stats bar */}
      {!globalLoading && globalData && (
        <div
          className="rounded-2xl p-4 grid grid-cols-3 gap-3 text-center"
          style={{ background: '#141416', border: '1px solid #1f1f24' }}
        >
          <div>
            <div className="text-xs c-muted mb-1">مارکت‌کپ کل</div>
            <div className="text-sm font-bold text-white">${formatMarketCap(globalData.totalMarketCap)}</div>
          </div>
          <div style={{ borderRight: '1px solid #1f1f24', borderLeft: '1px solid #1f1f24' }}>
            <div className="text-xs c-muted mb-1">سلطه بیت‌کوین</div>
            <div className="text-sm font-bold c-gold">
              {toPersianDigits(globalData.btcDominance.toFixed(1))}٪
            </div>
          </div>
          <div>
            <div className="text-xs c-muted mb-1">حجم ۲۴ساعته</div>
            <div className="text-sm font-bold text-white">${formatMarketCap(globalData.totalVolume24h)}</div>
          </div>
        </div>
      )}

      {/* Fear & Greed + Gold summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FearGreedWidget data={fearGreed} loading={globalLoading} />

        {/* Gold & USD summary card */}
        <div className="card space-y-3">
          <div className="text-xs c-muted font-semibold mb-2">خلاصه بازار</div>

          {/* USD / Toman */}
          <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1f1f24' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🇺🇸</span>
              <span className="text-sm text-white">دلار آمریکا</span>
            </div>
            <span className="text-sm font-bold c-gold">
              {toPersianDigits(usdToToman.toLocaleString('en-US'))} تومان
            </span>
          </div>

          {/* Gold */}
          {gold && (
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1f1f24' }}>
              <div className="flex items-center gap-2">
                <span className="text-base">🪙</span>
                <div>
                  <div className="text-sm text-white">طلا (هر اونس)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white" dir="ltr">{formatUSD(gold.price)}</div>
                <div className="text-xs c-gold">{formatToman(gold.price, usdToToman)} تومان</div>
              </div>
            </div>
          )}

          {/* Gold per gram */}
          {goldPerGram != null && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="text-sm text-white">طلا (هر گرم)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white" dir="ltr">{formatUSD(goldPerGram)}</div>
                <div className="text-xs c-gold">{formatToman(goldPerGram, usdToToman)} تومان</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured: BTC + ETH */}
      <section>
        <SectionHeader title="ارزهای برتر" subtitle="بیت‌کوین و اتریوم" icon="₿" error={cryptoError} />
        <div className="price-grid">
          {loading && featuredCryptos.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <CryptoCardSkeleton key={i} />)
            : featuredCryptos.map(c => (
                <CryptoCard
                  key={c.symbol}
                  crypto={c}
                  usdToToman={usdToToman}
                  klineData={klines[c.symbol]}
                  isFavorite={isFavorite(c.symbol)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
          }
        </div>
      </section>

      {/* Top Movers */}
      {topMovers.length > 0 && (
        <section>
          <SectionHeader title="بیشترین تغییر ۲۴ساعت" icon="📈" />
          <div className="card p-0 overflow-hidden">
            {topMovers.map((c, i) => (
              <div
                key={c.symbol}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < topMovers.length - 1 ? '1px solid #1f1f24' : 'none' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: '#1e1e26', color: '#aaa' }}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{c.nameFA}</div>
                  <div className="text-xs c-muted">{c.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white tabular-nums" dir="ltr">{formatUSD(c.price)}</div>
                </div>
                <span className={`badge ${c.change24h >= 0 ? 'badge-up' : 'badge-down'} text-xs`}>
                  {c.change24h >= 0 ? '▲' : '▼'} {formatChange(c.change24h)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Metals summary */}
      <section>
        <SectionHeader title="فلزات گرانبها" subtitle="Kraken" icon="🏅" />
        <div className="price-grid">
          {loading && metals.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
            : metals.map(m => <MetalCard key={m.symbol} metal={m} usdToToman={usdToToman} />)
          }
        </div>
      </section>
    </div>
  )
}
