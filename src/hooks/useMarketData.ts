import { useState, useEffect, useCallback, useRef } from 'react'
import type { MarketData, KlineData } from '../types'
import { fetchCoinMarkets } from '../api/coingecko'
import { fetchBinancePrices } from '../api/binance'
import { fetchFrankfurterRates, fetchMetals } from '../api/frankfurter'
import { fetchExtraRates } from '../api/exchangerate'
import { BINANCE_SYMBOLS, REFRESH_INTERVAL_MS } from '../constants/market'

const WS_URL =
  'wss://stream.binance.com:9443/stream?streams=' +
  BINANCE_SYMBOLS.map(s => `${s.toLowerCase()}@miniTicker`).join('/')

interface MiniTicker {
  s: string  // symbol e.g. BTCUSDT
  c: string  // close (last price)
  h: string  // high
  l: string  // low
  q: string  // quote volume
}

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
  const [wsOverride, setWsOverride] = useState<Record<string, Partial<{ price: number; high24h: number; low24h: number; volume24h: number }>>>({})
  const isMountedRef = useRef(true)
  const wsRef = useRef<WebSocket | null>(null)

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchCoinMarkets(),
      fetchMetals(),
      fetchFrankfurterRates(),
      fetchExtraRates(),
    ])

    if (!isMountedRef.current) return

    const [cgResult, metalResult, currencyResult, extraResult] = results

    let cryptos = data.cryptos
    let newKlines = klines
    let cryptoError: string | null = null

    if (cgResult.status === 'fulfilled') {
      cryptos = cgResult.value.cryptos
      newKlines = cgResult.value.klines
    } else {
      cryptoError = 'خطا در دریافت قیمت‌ها'
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

  // Binance WebSocket — real-time price overlay
  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout> | null = null
    let retries = 0
    const MAX_RETRIES = 3

    function connect() {
      try {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onmessage = (event) => {
          try {
            const msg: { stream: string; data: MiniTicker } = JSON.parse(event.data)
            const t = msg.data
            if (!t?.s) return
            const sym = t.s.replace('USDT', '')
            setWsOverride(prev => ({
              ...prev,
              [sym]: {
                price: parseFloat(t.c),
                high24h: parseFloat(t.h),
                low24h: parseFloat(t.l),
                volume24h: parseFloat(t.q),
              },
            }))
          } catch {
            // malformed frame — ignore
          }
        }

        ws.onopen = () => { retries = 0 }

        ws.onerror = () => { ws.close() }

        ws.onclose = () => {
          wsRef.current = null
          if (!isMountedRef.current || retries >= MAX_RETRIES) return
          retries++
          const delay = 2000 * retries
          retryTimeout = setTimeout(connect, delay)
        }
      } catch {
        // WebSocket unavailable (e.g. blocked in Iran) — skip silently
      }
    }

    connect()

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
        wsRef.current = null
      }
    }
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

  // Merge real-time WS prices on top of CoinGecko base prices
  const cryptos = data.cryptos.map(c => {
    const ov = wsOverride[c.symbol]
    if (!ov) return c
    return { ...c, ...ov }
  })

  return { ...data, cryptos, klines, refresh: fetchAll }
}
