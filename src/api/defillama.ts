import type { DefiProtocol, DefiYield } from '../types'

interface LlamaProtocol {
  name: string
  slug: string
  tvl: number
  change_1d: number
  category: string
  chain: string
  chains: string[]
}

interface LlamaYield {
  pool: string
  project: string
  chain: string
  symbol: string
  apy: number
  tvlUsd: number
}

export async function fetchDefiProtocols(): Promise<DefiProtocol[]> {
  const res = await fetch('https://api.llama.fi/protocols', {
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`DeFiLlama protocols HTTP ${res.status}`)

  const data: LlamaProtocol[] = await res.json()

  return data
    .filter(p => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 15)
    .map(p => ({
      name: p.name,
      slug: p.slug,
      tvl: p.tvl,
      change24h: p.change_1d ?? 0,
      category: p.category ?? '',
      chain: p.chains?.[0] ?? p.chain ?? '',
    }))
}

export async function fetchDefiYields(): Promise<DefiYield[]> {
  const res = await fetch('https://yields.llama.fi/pools', {
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`DeFiLlama yields HTTP ${res.status}`)

  const json = await res.json()
  const data: LlamaYield[] = json.data ?? []

  return data
    .filter(p => p.apy > 0 && p.tvlUsd > 1_000_000)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 15)
    .map(p => ({
      pool: p.pool,
      project: p.project,
      chain: p.chain,
      symbol: p.symbol,
      apy: p.apy,
      tvlUsd: p.tvlUsd,
    }))
}
