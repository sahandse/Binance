import { useState, useEffect, useRef } from 'react'
import type { KlineData } from '../types'
import { fetchKlines } from '../api/binance'
import { BINANCE_SYMBOLS, SLOW_REFRESH_MS } from '../constants/market'

const SYMBOLS = BINANCE_SYMBOLS.map(s => s.replace('USDT', ''))

export function useKlines() {
  const [klines, setKlines] = useState<Record<string, KlineData>>({})
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const load = async () => {
      try {
        const data = await fetchKlines(SYMBOLS)
        if (isMountedRef.current) {
          setKlines(data)
          setLoading(false)
        }
      } catch {
        if (isMountedRef.current) setLoading(false)
      }
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

  return { klines, klinesLoading: loading }
}
