import { useState, useEffect } from 'react'
import { formatTime, formatDate } from '../utils/format'

interface HeaderProps {
  lastUpdate: Date | null
  loading: boolean
  onRefresh: () => void
}

export function Header({ lastUpdate, loading, onRefresh }: HeaderProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="border-b border-white/8 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-500/20">
            ب
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text leading-none">بازار زنده</h1>
            <p className="text-xs text-slate-500 mt-0.5">قیمت لحظه‌ای بازار</p>
          </div>
        </div>

        {/* Clock */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-2xl font-bold text-slate-200 font-persian tabular-nums">
            {formatTime(now)}
          </span>
          <span className="text-xs text-slate-500">{formatDate(now)}</span>
        </div>

        {/* Status + Refresh */}
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot inline-block" />
              <span>آخرین به‌روزرسانی: {formatTime(lastUpdate)}</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-all disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? 'در حال بارگذاری...' : 'به‌روزرسانی'}
          </button>
        </div>
      </div>
    </header>
  )
}
