export interface BrsItem {
  date: string
  time: string
  symbol: string
  name: string
  price: number
  change_percent: number
  unit: string
}

export interface BrsResponse {
  gold: BrsItem[]
  currency: BrsItem[]
  cryptocurrency: BrsItem[]
}

export interface IranMarketData {
  // currencies in Toman
  usdToToman: number | null
  eurToToman: number | null
  gbpToToman: number | null
  aedToToman: number | null
  // gold in Toman
  gold18PerGram: number | null
  gold24PerGram: number | null
  goldMeltedPerGram: number | null
  goldMithqal: number | null  // مثقال (4.608g)
  // coins in Toman
  sekkeTama: number | null    // سکه تمام بهار آزادی
  sekkeNim: number | null     // نیم سکه
  sekkeRob: number | null     // ربع سکه
  sekkeGerami: number | null  // سکه گرمی
  sekkeEmami: number | null   // سکه امامی
  // crypto prices in Toman (symbol → Toman)
  cryptoToman: Record<string, number>
  lastUpdate: Date
}

// Gold + Currency + Crypto endpoint
const GOLD_DIRECT = 'https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency_v2.json'
const GOLD_PROXY  = 'https://corsproxy.io/?url=' + encodeURIComponent(GOLD_DIRECT)

// Dedicated crypto endpoint (may return richer data)
const CRYPTO_DIRECT = 'https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Crypto_v2.json'
const CRYPTO_PROXY  = 'https://corsproxy.io/?url=' + encodeURIComponent(CRYPTO_DIRECT)

function find(items: BrsItem[], ...terms: string[]): number | null {
  const item = items.find(i =>
    terms.some(t => i.name.includes(t) || i.symbol?.toUpperCase() === t.toUpperCase())
  )
  return item ? item.price : null
}

function toToman(item: BrsItem): number {
  // BRS prices may be in Rial — divide by 10 to normalise to Toman
  return item.unit?.includes('ریال') ? item.price / 10 : item.price
}

async function fetchGoldJson(): Promise<BrsResponse> {
  for (const url of [GOLD_DIRECT, GOLD_PROXY]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (res.ok) return res.json()
    } catch { /* next */ }
  }
  throw new Error('BRS gold/currency API unreachable')
}

async function fetchCryptoItems(): Promise<BrsItem[]> {
  // Try dedicated crypto endpoint first; fall back to crypto array in gold endpoint
  for (const url of [CRYPTO_DIRECT, CRYPTO_PROXY]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json()
      // Dedicated endpoint might return {cryptocurrency:[...]} or just an array
      const items: BrsItem[] = Array.isArray(data) ? data : (data.cryptocurrency ?? [])
      if (items.length > 0) return items
    } catch { /* next */ }
  }
  // Fall back: use crypto array already in gold/currency response
  try {
    const data = await fetchGoldJson()
    return data.cryptocurrency ?? []
  } catch { /* ignore */ }
  return []
}

export async function fetchIranMarket(): Promise<IranMarketData> {
  // Fetch gold/currency and crypto in parallel
  const [goldData, cryptoItems] = await Promise.all([
    fetchGoldJson(),
    fetchCryptoItems().catch(() => [] as BrsItem[]),
  ])

  const gold = goldData.gold ?? []
  const currency = goldData.currency ?? []

  // Build crypto Toman map: symbol → Toman price
  const cryptoSrc = cryptoItems.length > 0 ? cryptoItems : (goldData.cryptocurrency ?? [])
  const cryptoToman: Record<string, number> = {}
  for (const item of cryptoSrc) {
    const sym = item.symbol?.toUpperCase()
    if (sym && item.price > 0) {
      cryptoToman[sym] = toToman(item)
    }
  }

  return {
    usdToToman: find(currency, 'دلار', 'USD'),
    eurToToman: find(currency, 'یورو', 'EUR'),
    gbpToToman: find(currency, 'پوند', 'GBP'),
    aedToToman: find(currency, 'درهم', 'AED'),
    gold18PerGram: find(gold, '18 عیار', '۱۸ عیار', 'گرم طلای 18', 'طلا 18', 'geram18'),
    gold24PerGram: find(gold, '24 عیار', '۲۴ عیار', 'گرم طلای 24', 'طلا 24', 'geram24'),
    goldMeltedPerGram: find(gold, 'آب شده', 'مذاب'),
    goldMithqal: find(gold, 'مثقال'),
    sekkeTama: find(gold, 'بهار آزادی', 'تمام سکه', 'سکه تمام', 'sekke', 'SEKKE_TAMA'),
    sekkeNim: find(gold, 'نیم سکه', 'nim_sekke', 'SEKKE_NIM'),
    sekkeRob: find(gold, 'ربع سکه', 'rob_sekke', 'SEKKE_ROB'),
    sekkeGerami: find(gold, 'سکه گرمی', 'گرمی', 'gerami', 'SEKKE_GERAMI'),
    sekkeEmami: find(gold, 'امامی', 'emami', 'SEKKE_EMAMI'),
    cryptoToman,
    lastUpdate: new Date(),
  }
}
