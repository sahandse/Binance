export const BINANCE_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'DOGEUSDT',
  'ADAUSDT',
  'AVAXUSDT',
  'DOTUSDT',
  'TONUSDT',
  'LINKUSDT',
  'MATICUSDT',
  'UNIUSDT',
  'LTCUSDT',
  'ATOMUSDT',
]

export const COIN_META: Record<string, { nameFA: string; icon: string }> = {
  BTC:   { nameFA: 'بیت‌کوین',      icon: '₿' },
  ETH:   { nameFA: 'اتریوم',         icon: 'Ξ' },
  BNB:   { nameFA: 'بایننس کوین',   icon: '◈' },
  SOL:   { nameFA: 'سولانا',         icon: '◎' },
  XRP:   { nameFA: 'ریپل',           icon: '✕' },
  DOGE:  { nameFA: 'دوج‌کوین',       icon: 'Ð' },
  ADA:   { nameFA: 'کاردانو',        icon: '₳' },
  AVAX:  { nameFA: 'آوالانچ',        icon: '▲' },
  DOT:   { nameFA: 'پولکادات',       icon: '●' },
  TON:   { nameFA: 'تون‌کوین',       icon: '◆' },
  LINK:  { nameFA: 'چین‌لینک',       icon: '⬡' },
  MATIC: { nameFA: 'پالیگان',        icon: '♦' },
  UNI:   { nameFA: 'یونی‌سواپ',      icon: 'U' },
  LTC:   { nameFA: 'لایت‌کوین',      icon: 'Ł' },
  ATOM:  { nameFA: 'کازموس',         icon: '⚛' },
}

export const CURRENCY_META: Record<string, { nameFA: string; flag: string }> = {
  EUR: { nameFA: 'یورو',            flag: '🇪🇺' },
  GBP: { nameFA: 'پوند انگلیس',    flag: '🇬🇧' },
  CHF: { nameFA: 'فرانک سوئیس',    flag: '🇨🇭' },
  JPY: { nameFA: 'ین ژاپن',        flag: '🇯🇵' },
  CAD: { nameFA: 'دلار کانادا',    flag: '🇨🇦' },
  AUD: { nameFA: 'دلار استرالیا',  flag: '🇦🇺' },
  CNY: { nameFA: 'یوان چین',       flag: '🇨🇳' },
  AED: { nameFA: 'درهم امارات',    flag: '🇦🇪' },
  TRY: { nameFA: 'لیر ترکیه',      flag: '🇹🇷' },
  USD: { nameFA: 'دلار آمریکا',    flag: '🇺🇸' },
}

export const FRANKFURTER_CURRENCIES = ['EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'CNY']
export const OPEN_ER_CURRENCIES = ['AED', 'TRY']

export const DEFAULT_USD_TO_TOMAN = 87000
export const REFRESH_INTERVAL_MS = 30000
export const SLOW_REFRESH_MS = 300000 // 5 min

export const GOLD_PURITIES = [
  { label: '۲۴ عیار (۹۹۹)', key: '24k', multiplier: 1.0 },
  { label: '۲۱ عیار (۸۷۵)', key: '21k', multiplier: 0.875 },
  { label: '۱۸ عیار (۷۵۰)', key: '18k', multiplier: 0.75 },
]

export const GOLD_COINS_ARRAY = [
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
