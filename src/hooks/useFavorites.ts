import { useLocalStorage } from './useLocalStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('bazaar-favorites', [])

  const toggle = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const isFavorite = (symbol: string) => favorites.includes(symbol)

  return { favorites, toggle, isFavorite }
}
