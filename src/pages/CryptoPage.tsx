import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { SearchSort } from '../components/SearchSort'
import { CryptoListItem } from '../components/CryptoListItem'
import { CryptoCardSkeleton } from '../components/CryptoCard'

export function CryptoPage() {
  const { cryptos, loading, klines, usdToToman, toggleFavorite, isFavorite, favorites, iranMarket } = useApp()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume'>('volume')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const filtered = useMemo(() => {
    let list = [...cryptos]

    // Filter favorites
    if (filter === 'favorites') {
      list = list.filter(c => favorites.includes(c.symbol))
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c =>
        c.symbol.toLowerCase().includes(q) ||
        c.nameFA.includes(q)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price':
        list.sort((a, b) => b.price - a.price)
        break
      case 'change':
        list.sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
        break
      case 'volume':
      default:
        list.sort((a, b) => b.volume24h - a.volume24h)
        break
    }

    return list
  }, [cryptos, search, sortBy, filter, favorites])

  return (
    <div className="page-content">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-white mb-4">رمزارزها</h1>
        <SearchSort
          search={search}
          onSearch={setSearch}
          sortBy={sortBy}
          onSort={setSortBy}
          filter={filter}
          onFilter={setFilter}
        />
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#141416', border: '1px solid #1f1f24' }}
      >
        {loading && cryptos.length === 0 ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <CryptoCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 c-muted">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm">نتیجه‌ای یافت نشد</div>
          </div>
        ) : (
          filtered.map((c, i) => (
            <CryptoListItem
              key={c.symbol}
              crypto={c}
              usdToToman={usdToToman}
              klineData={klines[c.symbol]}
              isFavorite={isFavorite(c.symbol)}
              onToggleFavorite={toggleFavorite}
              rank={i + 1}
              marketPriceToman={iranMarket?.cryptoToman[c.symbol] ?? null}
            />
          ))
        )}
      </div>
    </div>
  )
}
