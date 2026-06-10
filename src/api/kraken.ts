import type { MetalPrice } from '../types'

interface KrakenTickerData {
  c: [string, string]
  h: [string, string]
  l: [string, string]
  o: string
}

interface KrakenResponse {
  error: string[]
  result: Record<string, KrakenTickerData>
}

export async function fetchKrakenMetals(): Promise<MetalPrice[]> {
  const url = 'https://api.kraken.com/0/public/Ticker?pair=XAUUSD,XAGUSD'
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`Kraken HTTP ${res.status}`)

  const data: KrakenResponse = await res.json()
  if (data.error.length > 0) throw new Error(data.error[0])

  const metals: MetalPrice[] = []

  for (const [key, ticker] of Object.entries(data.result)) {
    const isGold = key.includes('XAU')
    const isSilver = key.includes('XAG')
    if (!isGold && !isSilver) continue

    const lastPrice = parseFloat(ticker.c[0])
    const openPrice = parseFloat(ticker.o)
    const change24h = openPrice > 0 ? ((lastPrice - openPrice) / openPrice) * 100 : 0

    metals.push({
      symbol: isGold ? 'XAU' : 'XAG',
      nameFA: isGold ? 'طلا' : 'نقره',
      unit: isGold ? 'هر اونس' : 'هر اونس',
      price: lastPrice,
      change24h,
      high24h: parseFloat(ticker.h[1]),
      low24h: parseFloat(ticker.l[1]),
      icon: isGold ? '🪙' : '⬜',
    })
  }

  // Sort gold first
  return metals.sort((a) => (a.symbol === 'XAU' ? -1 : 1))
}

export async function fetchKrakenBitcoin(): Promise<{ price: number; change24h: number } | null> {
  try {
    const url = 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD'
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data: KrakenResponse = await res.json()
    const ticker = Object.values(data.result)[0]
    if (!ticker) return null
    const lastPrice = parseFloat(ticker.c[0])
    const openPrice = parseFloat(ticker.o)
    return {
      price: lastPrice,
      change24h: openPrice > 0 ? ((lastPrice - openPrice) / openPrice) * 100 : 0,
    }
  } catch {
    return null
  }
}
