import type { FearGreedData } from '../types'

interface FearGreedResponse {
  data: Array<{
    value: string
    value_classification: string
  }>
}

export async function fetchFearGreed(): Promise<FearGreedData> {
  const url = 'https://api.alternative.me/fng/?limit=1'
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`FearGreed HTTP ${res.status}`)

  const data: FearGreedResponse = await res.json()
  const item = data.data[0]

  const labelMap: Record<string, string> = {
    'Extreme Fear': 'ترس شدید',
    'Fear': 'ترس',
    'Neutral': 'خنثی',
    'Greed': 'طمع',
    'Extreme Greed': 'طمع شدید',
  }

  return {
    value: parseInt(item.value, 10),
    label: labelMap[item.value_classification] ?? item.value_classification,
  }
}
