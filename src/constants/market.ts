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
]

export const COIN_META: Record<string, { nameFA: string; icon: string }> = {
  BTC: { nameFA: 'بیت‌کوین', icon: '₿' },
  ETH: { nameFA: 'اتریوم', icon: 'Ξ' },
  BNB: { nameFA: 'بایننس کوین', icon: '◈' },
  SOL: { nameFA: 'سولانا', icon: '◎' },
  XRP: { nameFA: 'ریپل', icon: '✕' },
  DOGE: { nameFA: 'دوج‌کوین', icon: 'Ð' },
  ADA: { nameFA: 'کاردانو', icon: '₳' },
  AVAX: { nameFA: 'آوالانچ', icon: '🔺' },
  DOT: { nameFA: 'پولکادات', icon: '●' },
  TON: { nameFA: 'تون‌کوین', icon: '💎' },
}

export const CURRENCY_META: Record<string, { nameFA: string; flag: string }> = {
  EUR: { nameFA: 'یورو', flag: '🇪🇺' },
  GBP: { nameFA: 'پوند انگلیس', flag: '🇬🇧' },
  CHF: { nameFA: 'فرانک سوئیس', flag: '🇨🇭' },
  JPY: { nameFA: 'ین ژاپن', flag: '🇯🇵' },
  CAD: { nameFA: 'دلار کانادا', flag: '🇨🇦' },
  AUD: { nameFA: 'دلار استرالیا', flag: '🇦🇺' },
  CNY: { nameFA: 'یوان چین', flag: '🇨🇳' },
  AED: { nameFA: 'درهم امارات', flag: '🇦🇪' },
  TRY: { nameFA: 'لیر ترکیه', flag: '🇹🇷' },
}

export const FRANKFURTER_CURRENCIES = ['EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'CNY']

export const DEFAULT_USD_TO_TOMAN = 87000

export const REFRESH_INTERVAL_MS = 30000
