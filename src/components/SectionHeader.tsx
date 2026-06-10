interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon: string
  error?: string | null
}

export function SectionHeader({ title, subtitle, icon, error }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        <div>
          <h2 className="font-bold text-white text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-xs c-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {error && (
        <span className="text-xs c-red flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}
