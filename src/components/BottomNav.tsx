import type { TabId } from '../types'

interface NavItem {
  id: TabId
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',      label: 'خانه',       icon: '🏠' },
  { id: 'crypto',    label: 'رمزارز',     icon: '₿' },
  { id: 'gold',      label: 'طلا و ارز',  icon: '🪙' },
  { id: 'portfolio', label: 'پورتفولیو',  icon: '📊' },
  { id: 'tools',     label: 'ابزار',      icon: '🔧' },
]

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
            {isActive && <span className="bottom-nav-dot" />}
          </button>
        )
      })}
    </nav>
  )
}
