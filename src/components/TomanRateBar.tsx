import { useState } from 'react'
import { toPersianDigits } from '../utils/format'

interface TomanRateBarProps {
  usdToToman: number
  onChange: (rate: number) => void
}

export function TomanRateBar({ usdToToman, onChange }: TomanRateBarProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(String(usdToToman))

  const handleSave = () => {
    const parsed = parseInt(inputVal.replace(/,/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) {
      onChange(parsed)
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="bg-gradient-to-l from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
            ﷼
          </div>
          <div>
            <div className="font-bold text-amber-300 text-base">نرخ تبدیل دلار به تومان</div>
            <p className="text-slate-500 text-xs mt-0.5">
              نرخ بازار آزاد · قابل ویرایش
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-36 bg-black/40 border border-amber-500/40 rounded-lg px-3 py-2 text-white text-base text-right outline-none focus:border-amber-400"
                placeholder="مقدار تومان"
                dir="ltr"
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-amber-500 text-black font-bold rounded-lg text-sm hover:bg-amber-400 transition-colors"
              >
                ذخیره
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-2 bg-white/5 text-slate-400 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                لغو
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {toPersianDigits(usdToToman.toLocaleString('en-US'))}
                  <span className="text-amber-400 text-lg mr-1">تومان</span>
                </div>
                <div className="text-slate-500 text-xs">به ازای هر ۱ دلار</div>
              </div>
              <button
                onClick={() => { setInputVal(String(usdToToman)); setEditing(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm hover:bg-amber-500/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                ویرایش
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
