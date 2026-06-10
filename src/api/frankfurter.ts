import type { CurrencyRate } from '../types'
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

  const currencies: CurrencyRate[] = FRANKFURTER_CURRENCIES
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

  return currencies
}
