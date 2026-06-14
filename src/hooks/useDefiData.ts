import { useState, useEffect, useRef } from 'react'
import type { DefiProtocol, DefiYield } from '../types'
import { fetchDefiProtocols, fetchDefiYields } from '../api/defillama'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useDefiData() {
  const [protocols, setProtocols] = useState<DefiProtocol[]>([])
  const [yields, setYields] = useState<DefiYield[]>([])
  const [defiLoading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      const [protoResult, yieldResult] = await Promise.allSettled([
        fetchDefiProtocols(),
        fetchDefiYields(),
      ])

      if (!isMounted.current) return

      if (protoResult.status === 'fulfilled') setProtocols(protoResult.value)
      if (yieldResult.status === 'fulfilled') setYields(yieldResult.value)
      setLoading(false)
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

  return { protocols, yields, defiLoading }
}
