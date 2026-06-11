import { useApp } from '../context/AppContext'
import { FearGreedWidget } from '../components/FearGreedWidget'
import { CryptoCard, CryptoCardSkeleton } from '../components/CryptoCard'
import { MetalCard, MetalCardSkeleton } from '../components/MetalCard'
import { SectionHeader } from '../components/SectionHeader'
import { toPersianDigits, formatMarketCap, formatUSD, formatChange, formatCompactToman } from '../utils/format'

// ─── helpers ────────────────────────────────────────────────────────────────

function PriceRow({
  icon, label, sub, value, unit = 'تومان', last = false,
}: {
  icon: string; label: string; sub?: string; value: number | null; unit?: string; last?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={last ? {} : { borderBottom: '1px solid #1a1a1f' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        <div>
          <div className="text-sm text-white">{label}</div>
          {sub && <div className="text-xs c-muted">{sub}</div>}
        </div>
      </div>
      <div className="text-right">
        {value != null ? (
          <div className="text-sm font-bold c-gold">
            {toPersianDigits(value.toLocaleString('en-US'))} {unit}
          </div>
        ) : (
          <div className="h-4 w-24 rounded-md" style={{ background: '#1f1f24' }} />
        )}
      </div>
    </div>
  )
}

function CompactPriceRow({
  icon, label, value, last = false,
}: {
  icon: string; label: string; value: number | null; last?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={last ? {} : { borderBottom: '1px solid #1a1a1f' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-sm text-white">{label}</span>
      </div>
      {value != null ? (
        <span className="text-sm font-bold c-gold">
          {formatCompactToman(value)} تومان
        </span>
      ) : (
        <div className="h-4 w-28 rounded-md" style={{ background: '#1f1f24' }} />
      )}
    </div>
  )
}

// ─── component ──────────────────────────────────────────────────────────────

export function Dashboard() {
  const {
    cryptos, metals, loading, cryptoError,
    globalData, fearGreed, globalLoading,
    klines, usdToToman,
    iranMarket,
    toggleFavorite, isFavorite,
  } = useApp()

  const liveUsd = iranMarket?.usdToToman ?? null

  // Top 4 movers (by absolute change)
  const topMovers = [...cryptos]
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 4)

  const btc = cryptos.find(c => c.symbol === 'BTC')
  const eth = cryptos.find(c => c.symbol === 'ETH')
  const featuredCryptos = [btc, eth].filter(Boolean) as typeof cryptos

  return (
    <div className="page-content space-y-6">

      {/* ── Global stats bar ────────────────────────────────────── */}
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

      {/* ── Live USD banner (when BRS data available) ───────────── */}
      {liveUsd && (
        <div
          className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(0,204,136,0.06)', border: '1px solid rgba(0,204,136,0.2)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00cc88' }} />
            <div>
              <div className="text-xs font-semibold" style={{ color: '#00cc88' }}>قیمت زنده بازار آزاد</div>
              <div className="text-xs c-muted">brsapi.ir · tgju.org</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">
              {toPersianDigits(liveUsd.toLocaleString('en-US'))} تومان
            </div>
            <div className="text-xs c-muted">نرخ دلار بازار</div>
          </div>
        </div>
      )}

      {/* ── Currencies ──────────────────────────────────────────── */}
      <section>
        <SectionHeader title="نرخ ارز" subtitle="brsapi.ir · tgju.org · بازار آزاد" icon="💱" />
        <div className="card p-0 overflow-hidden">
          <PriceRow icon="🇺🇸" label="دلار آمریکا"  value={iranMarket?.usdToToman ?? null} />
          <PriceRow icon="🇪🇺" label="یورو"          value={iranMarket?.eurToToman ?? null} />
          <PriceRow icon="🇬🇧" label="پوند انگلیس"  value={iranMarket?.gbpToToman ?? null} />
          <PriceRow icon="🇦🇪" label="درهم امارات"  value={iranMarket?.aedToToman ?? null} last />
        </div>
      </section>

      {/* ── Gold prices ──────────────────────────────────────────── */}
      <section>
        <SectionHeader title="قیمت طلا" subtitle="brsapi.ir · تومان · هر گرم" icon="✨" />
        <div className="card p-0 overflow-hidden">
          <CompactPriceRow icon="🥇" label="طلای ۱۸ عیار"  value={iranMarket?.gold18PerGram ?? null} />
          <CompactPriceRow icon="🥇" label="طلای ۲۴ عیار"  value={iranMarket?.gold24PerGram ?? null} />
          {(iranMarket?.goldMeltedPerGram ?? null) !== null && (
            <CompactPriceRow icon="💧" label="طلای آب شده"  value={iranMarket!.goldMeltedPerGram} />
          )}
          <CompactPriceRow icon="⚖️" label="مثقال طلا" value={iranMarket?.goldMithqal ?? null} last />
        </div>
      </section>

      {/* ── Coins ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="سکه‌های طلا" subtitle="brsapi.ir · قیمت بازار" icon="🪙" />
        <div className="card p-0 overflow-hidden">
          <CompactPriceRow icon="🪙" label="سکه تمام بهار آزادی" value={iranMarket?.sekkeTama    ?? null} />
          <CompactPriceRow icon="🪙" label="نیم سکه"              value={iranMarket?.sekkeNim     ?? null} />
          <CompactPriceRow icon="🪙" label="ربع سکه"              value={iranMarket?.sekkeRob     ?? null} />
          <CompactPriceRow icon="🪙" label="سکه گرمی"             value={iranMarket?.sekkeGerami  ?? null} />
          <CompactPriceRow icon="🪙" label="سکه امامی"            value={iranMarket?.sekkeEmami   ?? null} last />
        </div>
      </section>

      {/* ── Fear & Greed ─────────────────────────────────────────── */}
      <FearGreedWidget data={fearGreed} loading={globalLoading} />

      {/* ── Featured: BTC + ETH ──────────────────────────────────── */}
      <section>
        <SectionHeader title="ارزهای برتر" subtitle="بیت‌کوین و اتریوم" icon="₿" error={cryptoError} />
        <div className="price-grid">
          {loading && featuredCryptos.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <CryptoCardSkeleton key={i} />)
            : featuredCryptos.map(c => (
                <CryptoCard
                  key={c.symbol}
                  crypto={c}
                  usdToToman={liveUsd ?? usdToToman}
                  klineData={klines[c.symbol]}
                  isFavorite={isFavorite(c.symbol)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
          }
        </div>
      </section>

      {/* ── Top Movers ───────────────────────────────────────────── */}
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

      {/* ── Metals (XAU / XAG) ──────────────────────────────────── */}
      <section>
        <SectionHeader title="فلزات گرانبها" subtitle="Frankfurter.app · قیمت جهانی" icon="🏅" />
        <div className="price-grid">
          {loading && metals.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
            : metals.map(m => <MetalCard key={m.symbol} metal={m} usdToToman={liveUsd ?? usdToToman} />)
          }
        </div>
      </section>

    </div>
  )
}
