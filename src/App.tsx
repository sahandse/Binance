import { useState } from 'react'
import { useMarketData } from './hooks/useMarketData'
import { Header } from './components/Header'
import { TickerBar } from './components/TickerBar'
import { TomanRateBar } from './components/TomanRateBar'
import { CryptoCard, CryptoCardSkeleton } from './components/CryptoCard'
import { MetalCard, MetalCardSkeleton } from './components/MetalCard'
import { CurrencyCard, CurrencyCardSkeleton } from './components/CurrencyCard'
import { Calculator } from './components/Calculator'
import { SectionHeader } from './components/SectionHeader'
import { DEFAULT_USD_TO_TOMAN } from './constants/market'
import { toPersianDigits } from './utils/format'

export default function App() {
  const [usdToToman, setUsdToToman] = useState(DEFAULT_USD_TO_TOMAN)
  const { cryptos, metals, currencies, loading, lastUpdate, cryptoError, metalError, currencyError, refresh } = useMarketData()

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      <Header lastUpdate={lastUpdate} loading={loading} onRefresh={refresh} />
      <TickerBar cryptos={cryptos} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Toman rate */}
        <TomanRateBar usdToToman={usdToToman} onChange={setUsdToToman} />

        {/* ── Cryptos ─────────────────── */}
        <section>
          <SectionHeader
            title="ارزهای دیجیتال"
            subtitle="داده از Binance"
            icon="₿"
            error={cryptoError}
          />
          <div className="price-grid">
            {loading && cryptos.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <CryptoCardSkeleton key={i} />)
              : cryptos.map(c => <CryptoCard key={c.symbol} crypto={c} usdToToman={usdToToman} />)
            }
          </div>
        </section>

        {/* ── Metals ──────────────────── */}
        <section>
          <SectionHeader
            title="فلزات گرانبها"
            subtitle="داده از Kraken"
            icon="🏅"
            error={metalError}
          />
          <div className="price-grid">
            {loading && metals.length === 0
              ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
              : metals.map(m => <MetalCard key={m.symbol} metal={m} usdToToman={usdToToman} />)
            }
          </div>
        </section>

        {/* ── Currencies ──────────────── */}
        <section>
          <SectionHeader
            title="ارزهای جهانی"
            subtitle="داده از Frankfurter.app"
            icon="🌍"
            error={currencyError}
          />

          {/* USD card */}
          <div className="card mb-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full text-base flex items-center justify-center" style={{ background: '#1e1e26' }}>🇺🇸</div>
              <div>
                <div className="text-sm font-semibold text-white">دلار آمریکا</div>
                <div className="text-xs c-muted">USD</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs c-muted mb-0.5">قیمت</div>
                <div className="font-bold text-white" dir="ltr">$1</div>
              </div>
              <div>
                <div className="text-xs c-muted mb-0.5">تومان</div>
                <div className="font-bold c-gold">{toPersianDigits(usdToToman.toLocaleString('en-US'))} تومان</div>
              </div>
            </div>
          </div>

          <div className="price-grid">
            {loading && currencies.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <CurrencyCardSkeleton key={i} />)
              : currencies.map(c => <CurrencyCard key={c.code} currency={c} usdToToman={usdToToman} />)
            }
          </div>
        </section>

        {/* ── Calculator ──────────────── */}
        <section>
          <SectionHeader title="ماشین‌حساب" subtitle="تبدیل به تومان" icon="🧮" />
          <Calculator usdToToman={usdToToman} cryptos={cryptos} metals={metals} />
        </section>

        <footer className="text-center text-xs c-muted pb-4 space-y-1">
          <p>Binance · Kraken · Frankfurter.app · هر ۳۰ ثانیه به‌روز می‌شود</p>
          <p style={{ color: '#2a2a30' }}>بازار زنده © ۱۴۰۴</p>
        </footer>
      </main>
    </div>
  )
}
