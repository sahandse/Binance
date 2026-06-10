import { useApp } from '../context/AppContext'
import { MetalCard, MetalCardSkeleton } from '../components/MetalCard'
import { GoldCoinCard } from '../components/GoldCoinCard'
import { GoldPurityCard } from '../components/GoldPurityCard'
import { CurrencyCard, CurrencyCardSkeleton } from '../components/CurrencyCard'
import { SectionHeader } from '../components/SectionHeader'
import { toPersianDigits } from '../utils/format'
import { GOLD_COINS_ARRAY } from '../constants/market'
import type { GoldCoin } from '../types'

export function GoldPage() {
  const { metals, currencies, loading, metalError, currencyError, usdToToman } = useApp()

  const gold = metals.find(m => m.symbol === 'XAU')
  const goldPerGram = gold ? gold.price / 31.1035 : 0

  const goldCoins: GoldCoin[] = GOLD_COINS_ARRAY

  return (
    <div className="page-content space-y-6">
      <h1 className="text-lg font-bold text-white">طلا، سکه و ارز</h1>

      {/* Metals */}
      <section>
        <SectionHeader title="فلزات گرانبها" subtitle="داده از Kraken" icon="🏅" error={metalError} />
        <div className="price-grid">
          {loading && metals.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
            : metals.map(m => <MetalCard key={m.symbol} metal={m} usdToToman={usdToToman} />)
          }
        </div>
      </section>

      {/* Gold Purity */}
      {goldPerGram > 0 && (
        <section>
          <SectionHeader title="قیمت طلا بر اساس عیار" subtitle="قیمت هر گرم" icon="✨" />
          <GoldPurityCard goldPerGramUSD={goldPerGram} usdToToman={usdToToman} />
        </section>
      )}

      {/* Gold Coins */}
      {goldPerGram > 0 && (
        <section>
          <SectionHeader title="سکه‌های طلا" subtitle="ارزش ذاتی (مثقالی)" icon="🪙" />
          <div className="price-grid">
            {goldCoins.map(coin => (
              <GoldCoinCard
                key={coin.id}
                coin={coin}
                goldPerGramUSD={goldPerGram}
                usdToToman={usdToToman}
              />
            ))}
          </div>
        </section>
      )}

      {/* Currencies */}
      <section>
        <SectionHeader title="ارزهای جهانی" subtitle="Frankfurter.app + OpenER" icon="🌍" error={currencyError} />

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
              <div className="font-bold text-white" dir="ltr">$۱</div>
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
    </div>
  )
}
