/**
 * Akıllı öğrenme sistemi — beceri bazlı ustalık takibi ve uyarlanabilir zorluk.
 *
 * Kural özeti (bkz. educational-game-designer skill):
 *  - Son 5 denemenin ≥4'ü doğruysa seviye atlar (en çok 3).
 *  - Son 4 denemenin ≥3'ü yanlışsa seviye düşer ve `needsReview` işaretlenir:
 *    oyun açılırken önce kısa bir "yeniden anlatım" (animasyonlu örnek) gösterilir.
 *  - Ustalık = son 10 denemenin ağırlıklı doğruluğu (yeni denemeler daha ağır).
 */
export type Level = 1 | 2 | 3

export interface SkillStat {
  attempts: number
  correct: number
  /** 1 = doğru, 0 = yanlış; en yeni sonda, en fazla 10 */
  recent: number[]
  level: Level
  needsReview: boolean
  /** ISO tarih */
  lastPlayed: string | null
  /** Son 14 günün günlük doğruluk geçmişi (ebeveyn paneli grafiği için) */
  history: { day: string; attempts: number; correct: number }[]
}

export const emptySkill = (): SkillStat => ({
  attempts: 0,
  correct: 0,
  recent: [],
  level: 1,
  needsReview: false,
  lastPlayed: null,
  history: [],
})

const WINDOW = 10

export function updateSkill(prev: SkillStat | undefined, correct: boolean, now = new Date()): SkillStat {
  const s = prev ?? emptySkill()
  const recent = [...s.recent, correct ? 1 : 0].slice(-WINDOW)
  let level = s.level
  let needsReview = s.needsReview
  let window = recent

  const last5 = recent.slice(-5)
  const last4 = recent.slice(-4)
  if (last5.length === 5 && last5.filter(Boolean).length >= 4 && level < 3) {
    level = (level + 1) as Level
    needsReview = false
    window = [] // yeni seviyede pencere sıfırlanır, ardışık atlamalar engellenir
  } else if (last4.length === 4 && last4.filter((x) => x === 0).length >= 3) {
    if (level > 1) level = (level - 1) as Level
    needsReview = true
    window = []
  } else if (correct && needsReview && last4.length >= 3 && last4.slice(-3).every(Boolean)) {
    needsReview = false
  }

  const day = now.toISOString().slice(0, 10)
  const history = [...s.history]
  const last = history[history.length - 1]
  if (last && last.day === day) {
    history[history.length - 1] = { ...last, attempts: last.attempts + 1, correct: last.correct + (correct ? 1 : 0) }
  } else {
    history.push({ day, attempts: 1, correct: correct ? 1 : 0 })
  }

  return {
    attempts: s.attempts + 1,
    correct: s.correct + (correct ? 1 : 0),
    recent: window,
    level,
    needsReview,
    lastPlayed: now.toISOString(),
    history: history.slice(-14),
  }
}

/** 0..1 arası ağırlıklı ustalık puanı */
export function mastery(s: SkillStat | undefined): number {
  if (!s || s.attempts === 0) return 0
  const r = s.recent
  if (r.length === 0) {
    // pencere yeni sıfırlandıysa genel doğruluğu ve seviyeyi birlikte kullan
    return Math.min(1, (s.correct / s.attempts) * 0.6 + (s.level - 1) * 0.2)
  }
  let w = 0
  let sum = 0
  r.forEach((v, i) => {
    const wi = 1 + i * 0.25
    w += wi
    sum += v * wi
  })
  const recentAcc = sum / w
  return Math.min(1, recentAcc * 0.7 + (s.level - 1) * 0.15)
}

export function starsFor(correctFirstTry: number, total: number): 1 | 2 | 3 {
  const acc = total === 0 ? 0 : correctFirstTry / total
  if (acc >= 0.9) return 3
  if (acc >= 0.65) return 2
  return 1
}

export function rewardsFor(stars: number, correct: number, firstCompletion: boolean) {
  return {
    coins: stars * 10 + (firstCompletion ? 20 : 0),
    xp: correct * 4,
  }
}

/** Kaşif seviyesi: her seviye bir öncekinden biraz daha fazla XP ister */
export function levelFromXp(xp: number) {
  let level = 1
  let need = 60
  let rest = xp
  while (rest >= need) {
    rest -= need
    level++
    need = Math.round(need * 1.2)
  }
  return { level, progress: rest / need, need, rest }
}
