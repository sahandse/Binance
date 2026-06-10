import { useState } from 'react'
import { toPersianDigits } from '../utils/format'

interface TomanRateBarProps {
  usdToToman: number
  onChange: (rate: number) => void
}

export function TomanRateBar({ usdToToman, onChange }: TomanRateBarProps) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(usdToToman))

  const save = () => {
    const n = parseInt(val.replace(/,/g, ''), 10)
    if (!isNaN(n) && n > 0) onChange(n)
    setEditing(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
      style={{ background: 'rgba(255,170,0,.05)', border: '1px solid rgba(255,170,0,.15)' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
          style={{ background: 'rgba(255,170,0,.12)', color: '#ffaa00' }}
        >
          ﷼
        </div>
        <div>
          <div className="text-sm font-semibold c-gold">نرخ دلار به تومان</div>
          <div className="text-xs c-muted">بازار آزاد · قابل ویرایش</div>
        </div>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            className="w-32 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
            style={{ background: '#1a1a20', border: '1px solid rgba(255,170,0,.4)' }}
          />
          <button
            onClick={save}
            className="px-3 py-1.5 rounded-lg text-sm font-bold text-black"
            style={{ background: '#ffaa00' }}
          >
            ذخیره
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 rounded-lg text-sm c-dim"
            style={{ background: '#1e1e24' }}
          >
            لغو
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-bold text-white">
              {toPersianDigits(usdToToman.toLocaleString('en-US'))}
            </span>
            <span className="c-gold text-sm mr-1">تومان</span>
          </div>
          <button
            onClick={() => { setVal(String(usdToToman)); setEditing(true) }}
            className="px-2.5 py-1.5 rounded-lg text-xs c-dim flex items-center gap-1"
            style={{ background: '#1e1e24', border: '1px solid #2a2a30' }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            ویرایش
          </button>
        </div>
      )}
    </div>
  )
}
