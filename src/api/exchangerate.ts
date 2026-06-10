import type { CurrencyRate } from '../types'
import { CURRENCY_META } from '../constants/market'

const EXTRA_CURRENCIES = ['AED', 'TRY']

async function fetchRatesJSON(): Promise<Record<string, number>> {
  const urls = [
    'https://api.exchangerate.host/latest?base=USD',
    'https://open.er-api.com/v6/latest/USD',
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json() as { rates?: Record<string, number> }
      if (data?.rates && Object.keys(data.rates).length > 0) return data.rates
    } catch {
      // try next
    }
  }
  throw new Error('ExchangeRate API unreachable')
}

export async function fetchExtraRates(): Promise<CurrencyRate[]> {
  const rates = await fetchRatesJSON()
  return EXTRA_CURRENCIES
    .filter(code => rates[code] != null)
    .map(code => ({
      code,
      nameFA: CURRENCY_META[code]?.nameFA ?? code,
      flag: CURRENCY_META[code]?.flag ?? '🏳',
      rateToUSD: rates[code],
    }))
}
