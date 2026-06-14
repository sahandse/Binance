import { useState, useEffect, useRef } from 'react'
import type { DEXPool, NFTCollection } from '../types'
import { fetchTrendingDEX, fetchTrendingNFTs } from '../api/coingecko'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useDEXNFT() {
  const [dexPools, setDexPools] = useState<DEXPool[]>([])
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([])
  const [dexLoading, setDexLoading] = useState(true)
  const [nftLoading, setNftLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      const [dexResult, nftResult] = await Promise.allSettled([
        fetchTrendingDEX(),
        fetchTrendingNFTs(),
      ])

      if (!isMounted.current) return

      if (dexResult.status === 'fulfilled') setDexPools(dexResult.value)
      setDexLoading(false)

      if (nftResult.status === 'fulfilled') setNftCollections(nftResult.value)
      setNftLoading(false)
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

  return { dexPools, nftCollections, dexLoading, nftLoading }
}
