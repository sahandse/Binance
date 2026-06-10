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
  lastUpdate: Date
}

const DIRECT = 'https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency_v2.json'
const PROXY  = 'https://corsproxy.io/?url=' + encodeURIComponent(DIRECT)

function find(items: BrsItem[], ...terms: string[]): number | null {
  const item = items.find(i =>
    terms.some(t => i.name.includes(t) || i.symbol?.toUpperCase() === t.toUpperCase())
  )
  return item ? item.price : null
}

async function fetchJson(): Promise<BrsResponse> {
  // Try direct first (works for Iranian IPs with CORS); fall back to proxy
  for (const url of [DIRECT, PROXY]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (res.ok) return res.json()
    } catch {
      // next
    }
  }
  throw new Error('BRS API unreachable')
}

export async function fetchIranMarket(): Promise<IranMarketData> {
  const data = await fetchJson()

  const gold = data.gold ?? []
  const currency = data.currency ?? []

  return {
    usdToToman: find(currency, 'دلار', 'USD'),
    eurToToman: find(currency, 'یورو', 'EUR'),
    gbpToToman: find(currency, 'پوند', 'GBP'),
    aedToToman: find(currency, 'درهم', 'AED'),
    gold18PerGram: find(gold, '18 عیار', '۱۸ عیار', 'گرم طلای 18', 'طلا 18', 'geram18'),
    gold24PerGram: find(gold, '24 عیار', '۲۴ عیار', 'گرم طلای 24', 'طلا 24', 'geram24'),
    goldMeltedPerGram: find(gold, 'آب شده', 'مذاب', 'مذاب'),
    goldMithqal: find(gold, 'مثقال'),
    sekkeTama: find(gold, 'بهار آزادی', 'تمام سکه', 'سکه تمام', 'sekke', 'SEKKE_TAMA'),
    sekkeNim: find(gold, 'نیم سکه', 'nim_sekke', 'SEKKE_NIM'),
    sekkeRob: find(gold, 'ربع سکه', 'rob_sekke', 'SEKKE_ROB'),
    sekkeGerami: find(gold, 'سکه گرمی', 'گرمی', 'gerami', 'SEKKE_GERAMI'),
    sekkeEmami: find(gold, 'امامی', 'emami', 'SEKKE_EMAMI'),
    lastUpdate: new Date(),
  }
}
