import { useLocalStorage } from './useLocalStorage'
import type { PortfolioItem } from '../types'

export function usePortfolio() {
  const [portfolio, setPortfolio] = useLocalStorage<PortfolioItem[]>('bazaar-portfolio', [])

  const add = (item: Omit<PortfolioItem, 'id'>) => {
    setPortfolio(prev => [...prev, { ...item, id: Date.now().toString(36) }])
  }

  const remove = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id))
  }

  const update = (id: string, changes: Partial<Omit<PortfolioItem, 'id'>>) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  return { portfolio, add, remove, update }
}
