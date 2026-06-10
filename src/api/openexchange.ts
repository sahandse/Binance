import type { CurrencyRate } from '../types'
import { CURRENCY_META } from '../constants/market'

interface OpenERResponse {
  base: string
  rates: Record<string, number>
}

export async function fetchOpenExchangeRates(): Promise<CurrencyRate[]> {
  const url = 'https://open.er-api.com/v6/latest/USD'

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`OpenER HTTP ${res.status}`)

  const data: OpenERResponse = await res.json()

  return ['AED', 'TRY']
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
