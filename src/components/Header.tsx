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
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(12,12,14,.95)', borderColor: '#1f1f24', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="c-gold font-bold text-lg tracking-tight">بازار زنده</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
        </div>

        {/* Clock – desktop only */}
        <div className="hidden sm:flex flex-col items-center leading-none gap-0.5">
          <span className="text-sm font-bold text-white tabular-nums">{formatTime(now)}</span>
          <span className="text-xs c-muted">{formatDate(now)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="hidden md:block text-xs c-dim">
              آخرین: {formatTime(lastUpdate)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
            style={{ background: '#1f1f28', color: '#aaa', border: '1px solid #2a2a34' }}
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? '...' : 'رفرش'}
          </button>
        </div>
      </div>
    </header>
  )
}
