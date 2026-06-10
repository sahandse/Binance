import { useState, useEffect, useRef } from 'react'
import { fetchIranMarket, type IranMarketData } from '../api/brsapi'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useIranMarket() {
  const [iranMarket, setIranMarket] = useState<IranMarketData | null>(null)
  const [iranMarketLoading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      try {
        const data = await fetchIranMarket()
        if (isMounted.current) setIranMarket(data)
      } catch {
        // silently ignore — API is Iran-IP restricted
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

  return { iranMarket, iranMarketLoading }
}
