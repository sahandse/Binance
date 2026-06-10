import type { CryptoPrice } from '../types'
import { BINANCE_SYMBOLS, COIN_META } from '../constants/market'

interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  quoteVolume: string
}

export async function fetchBinancePrices(): Promise<CryptoPrice[]> {
  const symbols = JSON.stringify(BINANCE_SYMBOLS)
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}&type=MINI`

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`Binance HTTP ${res.status}`)

  const data: BinanceTicker[] = await res.json()

  return data.map(t => {
    const base = t.symbol.replace('USDT', '')
    const meta = COIN_META[base] ?? { nameFA: base, icon: '●' }
    return {
      symbol: base,
      nameFA: meta.nameFA,
      price: parseFloat(t.lastPrice),
      change24h: parseFloat(t.priceChangePercent),
      high24h: parseFloat(t.highPrice),
      low24h: parseFloat(t.lowPrice),
      volume24h: parseFloat(t.quoteVolume),
      icon: meta.icon,
    }
  }).sort((a, b) => b.volume24h - a.volume24h)
}
