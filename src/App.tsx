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

export default function App() {
  const [usdToToman, setUsdToToman] = useState(DEFAULT_USD_TO_TOMAN)
  const { cryptos, metals, currencies, loading, lastUpdate, cryptoError, metalError, currencyError, refresh } = useMarketData()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header lastUpdate={lastUpdate} loading={loading} onRefresh={refresh} />
      <TickerBar cryptos={cryptos} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Toman Rate */}
        <TomanRateBar usdToToman={usdToToman} onChange={setUsdToToman} />

        {/* Crypto Section */}
        <section>
          <SectionHeader
            title="ارزهای دیجیتال"
            subtitle="قیمت لحظه‌ای از Binance"
            icon="₿"
            color="blue"
            error={cryptoError}
          />
          <div className="prices-grid">
            {loading && cryptos.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <CryptoCardSkeleton key={i} />)
              : cryptos.map(c => (
                  <CryptoCard key={c.symbol} crypto={c} usdToToman={usdToToman} />
                ))
            }
          </div>
        </section>

        {/* Metals Section */}
        <section>
          <SectionHeader
            title="فلزات گرانبها"
            subtitle="قیمت لحظه‌ای از Kraken"
            icon="🏅"
            color="gold"
            error={metalError}
          />
          <div className="prices-grid">
            {loading && metals.length === 0
              ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
              : metals.map(m => (
                  <MetalCard key={m.symbol} metal={m} usdToToman={usdToToman} />
                ))
            }
          </div>
        </section>

        {/* Currency Section */}
        <section>
          <SectionHeader
            title="ارزهای جهانی"
            subtitle="نرخ برابری از Frankfurter.app"
            icon="🌍"
            color="green"
            error={currencyError}
          />
          {/* USD Card special */}
          <div className="mb-4 glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-2xl bg-white/5">
                🇺🇸
              </div>
              <div>
                <div className="font-bold text-white text-lg">دلار آمریکا</div>
                <div className="text-slate-500 text-xs">USD · ارز پایه</div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-slate-400 text-xs mb-0.5">ارزش فعلی</div>
                <div className="text-white font-bold text-2xl">$۱</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs mb-0.5">معادل تومانی</div>
                <div className="text-amber-400 font-bold text-2xl">
                  {usdToToman.toLocaleString('fa-IR')} تومان
                </div>
              </div>
            </div>
          </div>
          <div className="prices-grid">
            {loading && currencies.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <CurrencyCardSkeleton key={i} />)
              : currencies.map(c => (
                  <CurrencyCard key={c.code} currency={c} usdToToman={usdToToman} />
                ))
            }
          </div>
        </section>

        {/* Calculator */}
        <section>
          <SectionHeader
            title="ماشین‌حساب"
            subtitle="تبدیل هر دارایی به تومان"
            icon="🧮"
            color="purple"
          />
          <Calculator usdToToman={usdToToman} cryptos={cryptos} metals={metals} />
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs py-4 border-t border-white/5 space-y-1">
          <p>داده‌ها از Binance، Kraken و Frankfurter.app دریافت می‌شوند</p>
          <p>نرخ تومان تقریبی است و بر اساس نرخ بازار آزاد می‌باشد · هر ۳۰ ثانیه به‌روز می‌شود</p>
          <p className="text-slate-700">بازار زنده © ۱۴۰۴</p>
        </footer>
      </main>
    </div>
  )
}
