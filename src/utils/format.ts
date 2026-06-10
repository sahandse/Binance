const FA = new Intl.NumberFormat('fa-IR')
const FA2 = new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const FA4 = new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
const FA8 = new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
}

export function formatUSD(price: number): string {
  if (price === 0) return '$۰'
  if (price >= 1000) {
    return '$' + toPersianDigits(new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(price))
  }
  if (price >= 1) {
    return '$' + toPersianDigits(FA2.format(price))
  }
  if (price >= 0.0001) {
    return '$' + toPersianDigits(FA4.format(price))
  }
  return '$' + toPersianDigits(FA8.format(price))
}

export function formatToman(usdPrice: number, usdToToman: number): string {
  const toman = usdPrice * usdToToman
  if (toman >= 1_000_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(toman / 1_000_000_000_000)) + ' هزار میلیارد'
  }
  if (toman >= 1_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(toman / 1_000_000_000)) + ' میلیارد'
  }
  if (toman >= 1_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(toman / 1_000_000)) + ' میلیون'
  }
  if (toman >= 1_000) {
    return toPersianDigits(FA.format(Math.round(toman / 1000))) + ' هزار'
  }
  return toPersianDigits(FA.format(Math.round(toman)))
}

export function formatCompactToman(toman: number): string {
  if (toman >= 1_000_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(toman / 1_000_000_000_000)) + ' هزار میلیارد'
  }
  if (toman >= 1_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(toman / 1_000_000_000)) + ' میلیارد'
  }
  if (toman >= 1_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(toman / 1_000_000)) + ' میلیون'
  }
  if (toman >= 1_000) {
    return toPersianDigits(FA.format(Math.round(toman / 1000))) + ' هزار'
  }
  return toPersianDigits(FA.format(Math.round(toman)))
}

export function formatChange(change: number): string {
  const abs = Math.abs(change)
  const fmt = toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(abs))
  return (change >= 0 ? '+' : '-') + fmt + '٪'
}

export function formatVolume(vol: number): string {
  if (vol >= 1_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(vol / 1_000_000_000)) + 'B'
  }
  if (vol >= 1_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(vol / 1_000_000)) + 'M'
  }
  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(vol))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCurrencyRate(rateToUSD: number): string {
  const perOne = 1 / rateToUSD
  if (perOne >= 100) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(rateToUSD))
  }
  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 4 }).format(rateToUSD))
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(cap / 1_000_000_000_000)) + ' تریلیون'
  }
  if (cap >= 1_000_000_000) {
    return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(cap / 1_000_000_000)) + ' میلیارد'
  }
  return toPersianDigits(new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(cap / 1_000_000)) + ' میلیون'
}
