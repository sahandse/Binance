import { useState, useEffect, useCallback, useRef } from 'react'
import type { MarketData } from '../types'
import { fetchBinancePrices } from '../api/binance'
import { fetchKrakenMetals } from '../api/kraken'
import { fetchFrankfurterRates } from '../api/frankfurter'
import { fetchOpenExchangeRates } from '../api/openexchange'
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
      fetchKrakenMetals(),
      fetchFrankfurterRates(),
      fetchOpenExchangeRates(),
    ])

    if (!isMountedRef.current) return

    const [cryptoResult, metalResult, currencyResult, openErResult] = results

    const currencies = [
      ...(currencyResult.status === 'fulfilled' ? currencyResult.value : []),
      ...(openErResult.status === 'fulfilled' ? openErResult.value : []),
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
