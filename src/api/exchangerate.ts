import type { CurrencyRate } from '../types'
import { CURRENCY_META } from '../constants/market'

// ExchangeRate-API free tier — all major currencies, no key required
const PRIMARY = 'https://open.er-api.com/v6/latest/USD'
const FALLBACK = 'https://api.exchangerate-api.com/v4/latest/USD'

// Currencies not covered by Frankfurter (AED, TRY) + USD itself for reference
const EXTRA_CURRENCIES = ['AED', 'TRY', 'USD']

async function fetchRates(): Promise<Record<string, number>> {
  for (const url of [PRIMARY, FALLBACK]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json() as {
        result?: string
        rates?: Record<string, number>
      }
      if (data?.rates && Object.keys(data.rates).length > 0) return data.rates
    } catch {
      // try next
    }
  }
  throw new Error('ExchangeRate-API unreachable')
}

export async function fetchExtraRates(): Promise<CurrencyRate[]> {
  const rates = await fetchRates()
  return EXTRA_CURRENCIES
    .filter(code => rates[code] != null)
    .map(code => ({
      code,
      nameFA: CURRENCY_META[code]?.nameFA ?? code,
      flag: CURRENCY_META[code]?.flag ?? '🏳',
      rateToUSD: rates[code],
    }))
}
