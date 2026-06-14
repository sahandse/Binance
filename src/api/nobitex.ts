// Nobitex (primary) + Wallex (fallback) — Iranian crypto exchanges
// Prices returned in Toman

const NOBITEX_URL = 'https://api.nobitex.ir/market/stats'
const WALLEX_URL  = 'https://api.wallex.ir/v1/markets'

const NOBITEX_SYMBOLS = ['btc','eth','usdt','bnb','xrp','doge','ada','sol','dot','link','ltc','atom','avax','uni','matic']

// Nobitex returns prices in Rial → ÷10 for Toman
async function fetchNobitex(): Promise<Record<string, number>> {
  const src = NOBITEX_SYMBOLS.join(',')
  const res = await fetch(`${NOBITEX_URL}?srcCurrency=${src}&dstCurrency=rls`, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Nobitex HTTP ${res.status}`)

  const json = await res.json()
  if (json.status !== 'ok') throw new Error('Nobitex error')

  const result: Record<string, number> = {}
  for (const [pair, data] of Object.entries(json.stats as Record<string, { latest: string }>)) {
    const sym = pair.split('-')[0].toUpperCase()
    const priceRls = parseFloat(data.latest)
    if (priceRls > 0) result[sym] = Math.round(priceRls / 10)  // Rial → Toman
  }
  return result
}

// Wallex returns prices in Toman directly (IRT label is Toman)
async function fetchWallex(): Promise<Record<string, number>> {
  const res = await fetch(WALLEX_URL, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Wallex HTTP ${res.status}`)

  const json = await res.json()
  const symbols: Record<string, { stats: { lastPrice: string } }> = json.result?.symbols ?? {}

  const result: Record<string, number> = {}
  for (const [pair, data] of Object.entries(symbols)) {
    if (!pair.endsWith('IRT')) continue
    const sym = pair.replace('IRT', '')
    const price = parseFloat(data.stats?.lastPrice ?? '0')
    if (price > 0) result[sym] = Math.round(price)
  }
  return result
}

// Returns map of symbol → Toman price. Tries Nobitex, falls back to Wallex.
export async function fetchIranianCryptoPrices(): Promise<Record<string, number>> {
  try {
    const prices = await fetchNobitex()
    if (Object.keys(prices).length > 0) return prices
  } catch { /* fall through */ }

  try {
    return await fetchWallex()
  } catch { /* both failed */ }

  return {}
}
