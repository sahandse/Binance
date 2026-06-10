import { useState, useEffect, useRef } from 'react'
import type { GlobalMarketData, FearGreedData } from '../types'
import { fetchGlobalData } from '../api/coingecko'
import { fetchFearGreed } from '../api/feargreed'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useGlobalData() {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null)
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null)
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const load = async () => {
      const [globalResult, fearResult] = await Promise.allSettled([
        fetchGlobalData(),
        fetchFearGreed(),
      ])

      if (!isMountedRef.current) return

      if (globalResult.status === 'fulfilled') setGlobalData(globalResult.value)
      if (fearResult.status === 'fulfilled') setFearGreed(fearResult.value)
      setLoading(false)
    }

    load()

    const interval = setInterval(() => {
      if (!document.hidden) load()
    }, SLOW_REFRESH_MS)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  return { globalData, fearGreed, globalLoading: loading }
}
