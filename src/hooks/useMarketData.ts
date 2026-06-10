import { useState, useEffect, useCallback, useRef } from 'react'
import type { MarketData } from '../types'
import { fetchBinancePrices } from '../api/binance'
import { fetchFrankfurterRates, fetchMetals } from '../api/frankfurter'
import { fetchExtraRates } from '../api/exchangerate'
import { REFRESH_INTERVAL_MS } from '../constants/market'

const initialState: MarketData = {
  cryptos: [],
  metals: [],
  currencies: [],
  lastUpdate: null,
  loading: true,
  cryptoError: null,
  metalError: null,
  currencyError: null,
}

export function useMarketData() {
  const [data, setData] = useState<MarketData>(initialState)
  const isMountedRef = useRef(true)

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchBinancePrices(),
      fetchMetals(),
      fetchFrankfurterRates(),
      fetchExtraRates(),
    ])

    if (!isMountedRef.current) return

    const [cryptoResult, metalResult, currencyResult, extraResult] = results

    const currencies = [
      ...(currencyResult.status === 'fulfilled' ? currencyResult.value : []),
      ...(extraResult.status === 'fulfilled' ? extraResult.value : []),
    ]

    setData(prev => ({
      cryptos: cryptoResult.status === 'fulfilled' ? cryptoResult.value : prev.cryptos,
      metals: metalResult.status === 'fulfilled' ? metalResult.value : prev.metals,
      currencies: currencies.length > 0 ? currencies : prev.currencies,
      lastUpdate: new Date(),
      loading: false,
      cryptoError: cryptoResult.status === 'rejected' ? 'خطا در دریافت قیمت رمزارزها' : null,
      metalError: metalResult.status === 'rejected' ? 'خطا در دریافت قیمت فلزات' : null,
      currencyError: currencyResult.status === 'rejected' ? 'خطا در دریافت نرخ ارزها' : null,
    }))
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchAll()

    const interval = setInterval(() => {
      if (!document.hidden) fetchAll()
    }, REFRESH_INTERVAL_MS)

    const onVisible = () => { if (!document.hidden) fetchAll() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchAll])

  return { ...data, refresh: fetchAll }
}
