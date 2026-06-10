import type { CurrencyRate, MetalPrice } from '../types'
import { FRANKFURTER_CURRENCIES, CURRENCY_META } from '../constants/market'

interface FrankfurterResponse {
  base: string
  date: string
  rates: Record<string, number>
}

export async function fetchFrankfurterRates(): Promise<CurrencyRate[]> {
  const to = FRANKFURTER_CURRENCIES.join(',')
  const url = `https://api.frankfurter.app/latest?from=USD&to=${to}`

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`)

  const data: FrankfurterResponse = await res.json()

  return FRANKFURTER_CURRENCIES
    .filter(code => data.rates[code] !== undefined)
    .map(code => {
      const meta = CURRENCY_META[code] ?? { nameFA: code, flag: '🏳' }
      return {
        code,
        nameFA: meta.nameFA,
        flag: meta.flag,
        rateToUSD: data.rates[code],
      }
    })
}

function getPrevDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export async function fetchMetals(): Promise<MetalPrice[]> {
  const [todayRes, prevRes] = await Promise.all([
    fetch('https://api.frankfurter.app/latest?from=USD&to=XAU,XAG', { signal: AbortSignal.timeout(10000) }),
    fetch(`https://api.frankfurter.app/${getPrevDate()}?from=USD&to=XAU,XAG`, { signal: AbortSignal.timeout(10000) }),
  ])

  if (!todayRes.ok) throw new Error(`Frankfurter metals HTTP ${todayRes.status}`)
  const today: FrankfurterResponse = await todayRes.json()
  const prev: FrankfurterResponse | null = prevRes.ok ? await prevRes.json() : null

  const defs = [
    { key: 'XAU', nameFA: 'طلا', icon: '🪙' },
    { key: 'XAG', nameFA: 'نقره', icon: '⬜' },
  ]

  return defs
    .filter(d => today.rates[d.key] != null)
    .map(d => {
      const price = 1 / today.rates[d.key]
      const prevRate = prev?.rates[d.key]
      const prevPrice = prevRate ? 1 / prevRate : price
      const change24h = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0
      return {
        symbol: d.key,
        nameFA: d.nameFA,
        unit: 'هر اونس',
        price,
        change24h,
        high24h: 0,
        low24h: 0,
        icon: d.icon,
      }
    })
}
