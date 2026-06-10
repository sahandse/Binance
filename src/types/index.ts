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
