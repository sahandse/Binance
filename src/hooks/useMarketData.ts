import { useState, useEffect, useCallback, useRef } from 'react'
import type { MarketData, KlineData } from '../types'
import { fetchCoinMarkets } from '../api/coingecko'
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
  const [klines, setKlines] = useState<Record<string, KlineData>>({})
  const isMountedRef = useRef(true)

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchCoinMarkets(),          // CoinGecko: prices + sparklines
      fetchMetals(),               // Frankfurter: XAU/XAG
      fetchFrankfurterRates(),     // Frankfurter: EUR/GBP/…
      fetchExtraRates(),           // ExchangeRate.host: AED/TRY
    ])

    if (!isMountedRef.current) return

    const [cgResult, metalResult, currencyResult, extraResult] = results

    // Crypto: CoinGecko primary, Binance fallback
    let cryptos = data.cryptos
    let newKlines = klines
    let cryptoError: string | null = null

    if (cgResult.status === 'fulfilled') {
      cryptos = cgResult.value.cryptos
      newKlines = cgResult.value.klines
    } else {
      cryptoError = 'خطا در دریافت قیمت‌ها'
      // Fallback to Binance
      try {
        cryptos = await fetchBinancePrices()
      } catch {
        // keep previous cryptos
      }
    }

    const currencies = [
      ...(currencyResult.status === 'fulfilled' ? currencyResult.value : []),
      ...(extraResult.status === 'fulfilled' ? extraResult.value : []),
    ]

    if (isMountedRef.current) {
      setKlines(newKlines)
      setData(prev => ({
        cryptos,
        metals: metalResult.status === 'fulfilled' ? metalResult.value : prev.metals,
        currencies: currencies.length > 0 ? currencies : prev.currencies,
        lastUpdate: new Date(),
        loading: false,
        cryptoError,
        metalError: metalResult.status === 'rejected' ? 'خطا در دریافت قیمت فلزات' : null,
        currencyError: currencyResult.status === 'rejected' ? 'خطا در دریافت نرخ ارزها' : null,
      }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  return { ...data, klines, refresh: fetchAll }
}
