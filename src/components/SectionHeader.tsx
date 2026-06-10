interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon: string
  color: 'blue' | 'gold' | 'green' | 'purple'
  error?: string | null
}

const colorMap = {
  blue: {
    icon: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    title: 'text-blue-300',
    line: 'bg-gradient-to-r from-blue-500 to-transparent',
  },
  gold: {
    icon: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    title: 'text-amber-300',
    line: 'bg-gradient-to-r from-amber-500 to-transparent',
  },
  green: {
    icon: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    title: 'text-emerald-300',
    line: 'bg-gradient-to-r from-emerald-500 to-transparent',
  },
  purple: {
    icon: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    title: 'text-purple-300',
    line: 'bg-gradient-to-r from-purple-500 to-transparent',
  },
}

export function SectionHeader({ title, subtitle, icon, color, error }: SectionHeaderProps) {
  const c = colorMap[color]

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>
        <div>
          <h2 className={`text-xl font-bold ${c.title}`}>{title}</h2>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        </div>
        {error && (
          <div className="mr-auto flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
      <div className={`section-line ${c.line} w-24`} />
    </div>
  )
}
