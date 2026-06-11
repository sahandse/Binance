import type { IranMarketData } from './brsapi'

interface TgjuItem {
  indicator: string
  data: string
  change_percent?: string
  min?: string
  max?: string
}

interface TgjuResponse {
  status: string
  data?: { items?: TgjuItem[] }
}

const DIRECT = 'https://api.tgju.org/v1/market/indicator/summary-table-data/?lang=fa'
const PROXY  = 'https://corsproxy.io/?url=' + encodeURIComponent(DIRECT)

// TGJU prices are in Rial → divide by 10 for Toman
function rial(s: string | undefined): number | null {
  if (!s) return null
  const n = parseFloat(s.replace(/,/g, ''))
  return isFinite(n) && n > 0 ? Math.round(n / 10) : null
}

// TGJU indicator → IranMarketData field mapping
const MAP: Record<string, keyof Omit<IranMarketData, 'cryptoToman' | 'lastUpdate'>> = {
  price_dollar_rl:  'usdToToman',
  price_eur:        'eurToToman',
  price_gbp:        'gbpToToman',
  price_dirham:     'aedToToman',
  geram18:          'gold18PerGram',
  geram24:          'gold24PerGram',
  gold_melted_unit: 'goldMeltedPerGram',
  mesghal:          'goldMithqal',
  sekke_full:       'sekkeTama',
  sekke_nim:        'sekkeNim',
  rob_sekke:        'sekkeRob',
  sekke_gerami:     'sekkeGerami',
  emami:            'sekkeEmami',
}

export async function fetchTgjuMarket(): Promise<Partial<IranMarketData> | null> {
  for (const url of [DIRECT, PROXY]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const json: TgjuResponse = await res.json()
      if (json.status !== 'ok' || !json.data?.items?.length) continue

      const result: Partial<IranMarketData> = {}
      for (const item of json.data.items) {
        const field = MAP[item.indicator]
        if (field) {
          const val = rial(item.data)
          if (val !== null) (result as Record<string, unknown>)[field] = val
        }
      }
      return result
    } catch { /* try next */ }
  }
  return null
}
