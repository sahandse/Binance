import { useApp } from '../context/AppContext'
import { MetalCard, MetalCardSkeleton } from '../components/MetalCard'
import { GoldCoinCard } from '../components/GoldCoinCard'
import { GoldPurityCard } from '../components/GoldPurityCard'
import { CurrencyCard, CurrencyCardSkeleton } from '../components/CurrencyCard'
import { SectionHeader } from '../components/SectionHeader'
import { formatCompactToman, toPersianDigits } from '../utils/format'
import { GOLD_COINS_ARRAY } from '../constants/market'
import type { GoldCoin } from '../types'

export function GoldPage() {
  const {
    metals, currencies, loading, metalError, currencyError,
    usdToToman, setUsdToToman,
    iranMarket,
  } = useApp()

  const gold = metals.find(m => m.symbol === 'XAU')
  const goldPerGram = gold ? gold.price / 31.1035 : 0
  const goldCoins: GoldCoin[] = GOLD_COINS_ARRAY

  // Prefer live bazaar USD rate from BRS API
  const liveUsd = iranMarket?.usdToToman ?? null
  const effectiveUsd = liveUsd ?? usdToToman

  // Coin market prices from BRS API
  const coinPrices: Record<string, number | null> = {
    taman: iranMarket?.sekkeTama ?? null,
    nim: iranMarket?.sekkeNim ?? null,
    rob: iranMarket?.sekkeRob ?? null,
    gerami: iranMarket?.sekkeGerami ?? null,
    emami: iranMarket?.sekkeEmami ?? null,
  }

  // Live 18k gold from BRS API (per gram in Toman)
  const live18k = iranMarket?.gold18PerGram ?? null
  const live24k = iranMarket?.gold24PerGram ?? null

  return (
    <div className="page-content space-y-6">
      <h1 className="text-lg font-bold text-white">طلا، سکه و ارز</h1>

      {/* BRS live rate banner */}
      {liveUsd && (
        <div
          className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(0,204,136,0.06)', border: '1px solid rgba(0,204,136,0.2)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00cc88' }} />
            <div>
              <div className="text-xs font-semibold" style={{ color: '#00cc88' }}>قیمت زنده بازار</div>
              <div className="text-xs c-muted">brsapi.ir · بازار آزاد</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">
              {toPersianDigits(liveUsd.toLocaleString('en-US'))} تومان
            </div>
            <button
              onClick={() => setUsdToToman(liveUsd)}
              className="text-xs mt-0.5"
              style={{ color: '#00cc88' }}
            >
              اعمال نرخ ←
            </button>
          </div>
        </div>
      )}

      {/* Live gold prices from BRS */}
      {(live18k || live24k) && (
        <section>
          <SectionHeader title="قیمت طلا بازار" subtitle="brsapi.ir · تومان" icon="✨" />
          <div className="card p-0 overflow-hidden">
            {[
              { label: 'طلای ۱۸ عیار', sub: 'هر گرم', val: live18k },
              { label: 'طلای ۲۴ عیار', sub: 'هر گرم', val: live24k },
              iranMarket?.goldMeltedPerGram
                ? { label: 'طلای آب شده', sub: 'هر گرم', val: iranMarket.goldMeltedPerGram }
                : null,
              iranMarket?.goldMithqal
                ? { label: 'مثقال طلا', sub: '۴.۶۰۸ گرم', val: iranMarket.goldMithqal }
                : null,
            ].filter(Boolean).map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid #1a1a1f' }}
              >
                <div>
                  <div className="text-sm font-semibold text-white">{row!.label}</div>
                  <div className="text-xs c-muted">{row!.sub}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold c-gold">
                    {formatCompactToman(row!.val!)} تومان
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* International spot price (Kraken) */}
      <section>
        <SectionHeader title="فلزات گرانبها" subtitle="Kraken · قیمت جهانی" icon="🏅" error={metalError} />
        <div className="price-grid">
          {loading && metals.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <MetalCardSkeleton key={i} />)
            : metals.map(m => <MetalCard key={m.symbol} metal={m} usdToToman={effectiveUsd} />)
          }
        </div>
      </section>

      {/* Gold Purity (calculated from spot) */}
      {goldPerGram > 0 && (
        <section>
          <SectionHeader title="قیمت محاسباتی هر گرم" subtitle="از قیمت جهانی" icon="⚖️" />
          <GoldPurityCard goldPerGramUSD={goldPerGram} usdToToman={effectiveUsd} />
        </section>
      )}

      {/* Gold Coins */}
      <section>
        <SectionHeader
          title="سکه‌های طلا"
          subtitle={liveUsd ? 'قیمت بازار · brsapi.ir' : 'ارزش ذاتی'}
          icon="🪙"
        />
        <div className="price-grid">
          {goldCoins.map(coin => (
            <GoldCoinCard
              key={coin.id}
              coin={coin}
              goldPerGramUSD={goldPerGram}
              usdToToman={effectiveUsd}
              marketPriceToman={coinPrices[coin.id]}
            />
          ))}
          {/* Emami coin – not in our static list, add if available */}
          {iranMarket?.sekkeEmami && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(255,170,0,0.12)' }}>🪙</div>
                  <div>
                    <div className="text-sm font-semibold text-white">سکه امامی</div>
                    <div className="text-xs c-muted">Emami Coin</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ background: 'rgba(0,204,136,0.1)', color: '#00cc88', border: '1px solid rgba(0,204,136,0.2)' }}>بازار</span>
              </div>
              <div className="text-xl font-bold c-gold mb-0.5">
                {formatCompactToman(iranMarket.sekkeEmami)} تومان
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Currencies */}
      <section>
        <SectionHeader title="ارزهای جهانی" subtitle="Frankfurter.app + OpenER" icon="🌍" error={currencyError} />

        <div className="card mb-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full text-base flex items-center justify-center" style={{ background: '#1e1e26' }}>🇺🇸</div>
            <div>
              <div className="text-sm font-semibold text-white">دلار آمریکا</div>
              <div className="text-xs c-muted">USD · {liveUsd ? 'بازار آزاد' : 'دستی'}</div>
            </div>
          </div>
          <div className="font-bold c-gold">
            {toPersianDigits(effectiveUsd.toLocaleString('en-US'))} تومان
          </div>
        </div>

        <div className="price-grid">
          {loading && currencies.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <CurrencyCardSkeleton key={i} />)
            : currencies.map(c => <CurrencyCard key={c.code} currency={c} usdToToman={effectiveUsd} />)
          }
        </div>
      </section>
    </div>
  )
}
