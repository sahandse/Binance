interface SearchSortProps {
  search: string
  onSearch: (v: string) => void
  sortBy: 'price' | 'change' | 'volume'
  onSort: (v: 'price' | 'change' | 'volume') => void
  filter: 'all' | 'favorites'
  onFilter: (v: 'all' | 'favorites') => void
}

const SORT_OPTIONS: Array<{ key: 'price' | 'change' | 'volume'; label: string }> = [
  { key: 'price',   label: 'قیمت' },
  { key: 'change',  label: 'تغییر' },
  { key: 'volume',  label: 'حجم' },
]

export function SearchSort({ search, onSearch, sortBy, onSort, filter, onFilter }: SearchSortProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="جستجوی رمزارز..."
          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          style={{ background: '#141416', border: '1px solid #1f1f24' }}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 c-muted text-sm pointer-events-none">🔍</span>
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter buttons */}
        <button
          onClick={() => onFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'text-black' : 'c-dim'}`}
          style={{ background: filter === 'all' ? '#ffaa00' : '#1e1e24', border: '1px solid transparent' }}
        >
          همه
        </button>
        <button
          onClick={() => onFilter('favorites')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'favorites' ? 'text-black' : 'c-dim'}`}
          style={{ background: filter === 'favorites' ? '#ffaa00' : '#1e1e24', border: '1px solid transparent' }}
        >
          ★ علاقه‌مندی‌ها
        </button>

        <div className="flex-1" />

        {/* Sort buttons */}
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => onSort(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === opt.key ? 'text-white' : 'c-dim'}`}
            style={{
              background: sortBy === opt.key ? '#1f1f2a' : 'transparent',
              border: `1px solid ${sortBy === opt.key ? '#3a3a4a' : 'transparent'}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
