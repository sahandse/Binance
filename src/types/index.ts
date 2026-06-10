export interface CryptoPrice {
  symbol: string
  nameFA: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  icon: string
}

export interface MetalPrice {
  symbol: string
  nameFA: string
  unit: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  icon: string
}

export interface CurrencyRate {
  code: string
  nameFA: string
  flag: string
  rateToUSD: number
}

export interface GoldCoin {
  id: string
  nameFA: string
  totalGrams: number
  purity: number
  pureGoldGrams: number
}

export interface GlobalMarketData {
  btcDominance: number
  totalMarketCap: number
  totalVolume24h: number
}

export interface FearGreedData {
  value: number
  label: string
}

export type KlineData = number[]

export interface PortfolioItem {
  id: string
  symbol: string
  nameFA: string
  amount: number
  buyPrice: number
  icon: string
}

export interface PriceAlert {
  id: string
  symbol: string
  nameFA: string
  targetPrice: number
  direction: 'above' | 'below'
  triggered: boolean
}

export type TabId = 'home' | 'crypto' | 'gold' | 'portfolio' | 'tools'

export interface MarketData {
  cryptos: CryptoPrice[]
  metals: MetalPrice[]
  currencies: CurrencyRate[]
  lastUpdate: Date | null
  loading: boolean
  cryptoError: string | null
  metalError: string | null
  currencyError: string | null
}
