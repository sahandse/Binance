import type { GlobalMarketData } from '../types'

interface CoinGeckoGlobal {
  data: {
    market_cap_percentage: Record<string, number>
    total_market_cap: Record<string, number>
    total_volume: Record<string, number>
  }
}

export async function fetchGlobalData(): Promise<GlobalMarketData> {
  const url = 'https://api.coingecko.com/api/v3/global'
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`)

  const json: CoinGeckoGlobal = await res.json()
  const d = json.data

  return {
    btcDominance: d.market_cap_percentage['btc'] ?? 0,
    totalMarketCap: d.total_market_cap['usd'] ?? 0,
    totalVolume24h: d.total_volume['usd'] ?? 0,
  }
}
