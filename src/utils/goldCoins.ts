export interface GoldCoinSpec {
  id: string
  nameFA: string
  totalGrams: number
  purity: number
  pureGoldGrams: number
}

export const GOLD_COIN_SPECS: GoldCoinSpec[] = [
  {
    id: 'taman',
    nameFA: 'سکه تمام بهار آزادی',
    totalGrams: 8.136,
    purity: 0.9,
    pureGoldGrams: 7.322,
  },
  {
    id: 'nim',
    nameFA: 'نیم سکه',
    totalGrams: 4.068,
    purity: 0.9,
    pureGoldGrams: 3.661,
  },
  {
    id: 'rob',
    nameFA: 'ربع سکه',
    totalGrams: 2.034,
    purity: 0.9,
    pureGoldGrams: 1.831,
  },
  {
    id: 'gerami',
    nameFA: 'سکه گرمی',
    totalGrams: 1.017,
    purity: 0.9,
    pureGoldGrams: 0.915,
  },
]

/**
 * Calculate melt value of a gold coin.
 * @param pureGoldGrams - grams of pure gold in the coin
 * @param goldPerGramUSD - price of 1 gram of pure gold in USD
 * @param usdToToman - exchange rate
 * @returns melt value in Toman
 */
export function calcCoinPrice(pureGoldGrams: number, goldPerGramUSD: number, usdToToman: number): number {
  return pureGoldGrams * goldPerGramUSD * usdToToman
}
