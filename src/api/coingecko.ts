import type { GlobalMarketData, CryptoPrice, KlineData, DEXPool, NFTCollection } from '../types'
import { CG_COIN_IDS, CG_API_KEY, COIN_META } from '../constants/market'

const BASE = 'https://api.coingecko.com/api/v3'
const HEADERS = { 'x-cg-demo-api-key': CG_API_KEY }

function cgFetch(path: string, timeout = 12000): Promise<Response> {
  return fetch(`${BASE}${path}`, { headers: HEADERS, signal: AbortSignal.timeout(timeout) })
}

function downsample(prices: number[], target: number): number[] {
  if (prices.length <= target) return prices
  const step = prices.length / target
  return Array.from({ length: target }, (_, i) => prices[Math.floor(i * step)])
}

// ─── Global market data ──────────────────────────────────────────────────────

interface CoinGeckoGlobal {
  data: {
    market_cap_percentage: Record<string, number>
    total_market_cap: Record<string, number>
    total_volume: Record<string, number>
  }
}

export async function fetchGlobalData(): Promise<GlobalMarketData> {
  const res = await cgFetch('/global')
  if (!res.ok) throw new Error(`CoinGecko global HTTP ${res.status}`)
  const json: CoinGeckoGlobal = await res.json()
  const d = json.data
  return {
    btcDominance: d.market_cap_percentage['btc'] ?? 0,
    totalMarketCap: d.total_market_cap['usd'] ?? 0,
    totalVolume24h: d.total_volume['usd'] ?? 0,
  }
}

// ─── Coin markets (prices + sparklines in one call) ──────────────────────────

interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  current_price: number
  high_24h: number
  low_24h: number
  total_volume: number
  price_change_percentage_24h: number
  sparkline_in_7d?: { price: number[] }
}

const CG_IDS = Object.values(CG_COIN_IDS).join(',')

export async function fetchCoinMarkets(): Promise<{
  cryptos: CryptoPrice[]
  klines: Record<string, KlineData>
}> {
  const path = `/coins/markets?vs_currency=usd&ids=${CG_IDS}&order=market_cap_desc&per_page=50&sparkline=true&price_change_percentage=24h`
  const res = await cgFetch(path, 15000)
  if (!res.ok) throw new Error(`CoinGecko markets HTTP ${res.status}`)

  const coins: CoinGeckoCoin[] = await res.json()
  const cryptos: CryptoPrice[] = []
  const klines: Record<string, KlineData> = {}

  for (const coin of coins) {
    const sym = coin.symbol.toUpperCase()
    const meta = COIN_META[sym] ?? { nameFA: coin.name, icon: '●' }

    cryptos.push({
      symbol: sym,
      nameFA: meta.nameFA,
      price: coin.current_price ?? 0,
      change24h: coin.price_change_percentage_24h ?? 0,
      high24h: coin.high_24h ?? 0,
      low24h: coin.low_24h ?? 0,
      volume24h: coin.total_volume ?? 0,
      icon: meta.icon,
    })

    const sparkline = coin.sparkline_in_7d?.price
    if (sparkline && sparkline.length > 0) {
      klines[sym] = downsample(sparkline, 7)
    }
  }

  return { cryptos, klines }
}

// ─── Trending DEX pools ──────────────────────────────────────────────────────

interface RawPool {
  id: string
  attributes: {
    name: string
    base_token_price_usd: string
    fdv_usd: string
    volume_usd: { h24: string }
    price_change_percentage: { h24: string }
  }
  relationships?: { network?: { data?: { id: string } } }
}

export async function fetchTrendingDEX(): Promise<DEXPool[]> {
  const res = await cgFetch('/onchain/trending/pools?include=base_token,quote_token&page=1')
  if (!res.ok) throw new Error(`CoinGecko DEX HTTP ${res.status}`)
  const json = await res.json()
  const pools: RawPool[] = json.data ?? []

  return pools.slice(0, 10).map(p => ({
    id: p.id,
    name: p.attributes.name,
    network: p.relationships?.network?.data?.id ?? 'unknown',
    priceUSD: parseFloat(p.attributes.base_token_price_usd ?? '0') || 0,
    volume24h: parseFloat(p.attributes.volume_usd?.h24 ?? '0') || 0,
    priceChange24h: parseFloat(p.attributes.price_change_percentage?.h24 ?? '0') || 0,
    fdvUSD: parseFloat(p.attributes.fdv_usd ?? '0') || 0,
  }))
}

// ─── NFT markets ─────────────────────────────────────────────────────────────

interface RawNFT {
  id: string
  name: string
  symbol: string
  floor_price_in_usd: number
  market_cap_usd: number
  volume_24h_usd: number
  floor_price_24h_percentage_change: number
  native_currency: string
}

export async function fetchTrendingNFTs(): Promise<NFTCollection[]> {
  const res = await cgFetch('/nfts/markets?vs_currency=usd&order=market_cap_usd_desc&per_page=10&page=1')
  if (!res.ok) throw new Error(`CoinGecko NFT HTTP ${res.status}`)
  const data: RawNFT[] = await res.json()
  return data.map(n => ({
    id: n.id,
    name: n.name,
    symbol: n.symbol,
    floorPriceUSD: n.floor_price_in_usd ?? 0,
    marketCapUSD: n.market_cap_usd ?? 0,
    volume24h: n.volume_24h_usd ?? 0,
    priceChange24h: n.floor_price_24h_percentage_change ?? 0,
    nativeCurrency: n.native_currency ?? 'eth',
  }))
}
