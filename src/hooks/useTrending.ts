import { useState, useEffect, useRef } from 'react'
import type { TrendingCoin } from '../types'
import { fetchTrending } from '../api/coingecko'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useTrending() {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([])
  const [trendingLoading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      try {
        const coins = await fetchTrending()
        if (isMounted.current) setTrendingCoins(coins)
      } catch {
        // silently ignore
      } finally {
        if (isMounted.current) setLoading(false)
      }
    }

    load()
    const interval = setInterval(() => {
      if (!document.hidden) load()
    }, SLOW_REFRESH_MS)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [])

  return { trendingCoins, trendingLoading }
}
