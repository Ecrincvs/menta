/**
 * EKRAN SÜRESİ — ebeveynin belirlediği sınırlar (saf fonksiyonlar, test edilebilir).
 * - Günlük süre sınırı: dolunca "bugünlük bu kadar" (ek süreyi yalnızca ebeveyn kapısıyla bir yetişkin verir)
 * - Mola hatırlatıcısı: belirli aralıkla 1 dakikalık göz/esneme molası
 * - Uyku saati: belirlenen saatten sabah 06:00'ya kadar oyun kapalı
 * Oyun ortasında kesmeyiz: kilit/mola, açık oyun bitip ekran değişince gösterilir.
 */
export interface Limits {
  /** 0 = sınırsız */
  dailyMin: number
  /** 0 = kapalı */
  breakEvery: number
  /** '' = kapalı, 'SS:DD' */
  bedtime: string
}

export const DEFAULT_LIMITS: Limits = { dailyMin: 0, breakEvery: 20, bedtime: '' }

export const DAILY_OPTIONS = [0, 15, 20, 30, 45, 60]
export const BREAK_OPTIONS = [0, 15, 20, 30]
export const BEDTIME_OPTIONS = ['', '19:30', '20:00', '20:30', '21:00']

/** Uyarının verileceği kalan süre (saniye) */
export const WARN_AT = 120
/** Mola süresi (saniye) */
export const BREAK_SECONDS = 60

export const dayKey = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

export function isBedtime(now: Date, bedtime: string) {
  if (!bedtime) return false
  const [h, m] = bedtime.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= h * 60 + m || mins < 6 * 60
}

export interface TimeInput {
  limits: Limits
  usedToday: number
  extraMin: number
  sinceBreak: number
  now: Date
}

export interface TimeState {
  blocked: null | 'limit' | 'bedtime'
  needBreak: boolean
  /** günlük sınır yoksa null */
  secondsLeft: number | null
}

export function screenTimeState({ limits, usedToday, extraMin, sinceBreak, now }: TimeInput): TimeState {
  const secondsLeft = limits.dailyMin > 0 ? limits.dailyMin * 60 + extraMin * 60 - usedToday : null
  const blocked = isBedtime(now, limits.bedtime) && extraMin === 0 ? 'bedtime' : secondsLeft !== null && secondsLeft <= 0 ? 'limit' : null
  const needBreak = !blocked && limits.breakEvery > 0 && sinceBreak >= limits.breakEvery * 60
  return { blocked, needBreak, secondsLeft }
}

/** Son 14 günü tut */
export function trimUsage(u: Record<string, number>, today = dayKey()) {
  const keep = new Set(Array.from({ length: 14 }, (_, i) => {
    const d = new Date(`${today}T12:00:00`)
    d.setDate(d.getDate() - i)
    return dayKey(d)
  }))
  return Object.fromEntries(Object.entries(u).filter(([k]) => keep.has(k)))
}
