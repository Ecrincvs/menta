/**
 * ROZETLER — öğrenme davranışına bağlı başarımlar (saf fonksiyonlar, test edilebilir).
 * İlke: rozetler süre/tıklama değil ÖĞRENME ilerlemesini ödüllendirir (oyun tamamlama, yıldız, harf, süreklilik).
 * Her rozet bir kez kazanılır ve bonus altın verir; ilerleme çubuğu çocuğa "ne kadar kaldı"yı gösterir.
 */
import { gameById } from '../content/games'
import { STICKER_PAGES } from './stickers'

export type Tier = 'bronz' | 'gumus' | 'altin'

export interface BadgeCtx {
  grade: number | null
  stars: number
  letterIdx: number
  sessions: { gameId: string; date: string; stars: number }[]
  gameResults: Record<string, { best: number; plays: number }>
  owned: string[]
  treasureCount: number
  /** "bugün" (testlerde sabitlemek için) */
  today?: string
}

export interface Badge {
  id: string
  title: string
  desc: string
  icon: string
  tier: Tier
  group: 'Başlangıç' | 'Türkçe' | 'Matematik' | 'Okuma Yazma' | 'Süreklilik' | 'Koleksiyon'
  reward: number
  /** yalnızca bu sınıflarda gösterilir (ör. okuma yazma → 1. sınıf) */
  grades?: number[]
  progress: (c: BadgeCtx) => { cur: number; target: number }
}

const played = (c: BadgeCtx, subject?: string) =>
  c.sessions.filter((s) => !subject || gameById(s.gameId)?.subject === subject).length

/** Tamamlanan oyun sayısı: oturum kaydı son 100 ile sınırlı → gameResults.plays toplamı esas alınır */
const totalPlays = (c: BadgeCtx, subject?: string) => {
  let n = 0
  for (const [id, r] of Object.entries(c.gameResults)) if (!subject || gameById(id)?.subject === subject) n += r.plays
  return Math.max(n, played(c, subject))
}

const perfectGames = (c: BadgeCtx) => Object.values(c.gameResults).filter((r) => r.best === 3).length

/** Art arda oynanan gün sayısı (bugün ya da dün biten seri) */
export function streakDays(sessions: { date: string }[], today = new Date().toISOString().slice(0, 10)) {
  const days = new Set(sessions.map((s) => s.date.slice(0, 10)))
  const step = (d: string, k: number) => {
    const t = new Date(`${d}T12:00:00Z`)
    t.setUTCDate(t.getUTCDate() + k)
    return t.toISOString().slice(0, 10)
  }
  let cur = days.has(today) ? today : step(today, -1)
  let n = 0
  while (days.has(cur)) {
    n++
    cur = step(cur, -1)
  }
  return n
}

const stickerCount = (c: BadgeCtx) => c.owned.filter((o) => o.startsWith('st:')).length
const fullPages = (c: BadgeCtx) => STICKER_PAGES.filter((p) => p.items.every((it) => c.owned.includes(`st:${it.id}`))).length
const subjectsPlayed = (c: BadgeCtx) => new Set(Object.keys(c.gameResults).map((id) => gameById(id)?.subject).filter(Boolean)).size

export const BADGES: Badge[] = [
  // ── Başlangıç
  { id: 'ilk-adim', title: 'İlk Adım', desc: 'İlk oyununu tamamla', icon: 'walking', tier: 'bronz', group: 'Başlangıç', reward: 10, progress: (c) => ({ cur: totalPlays(c), target: 1 }) },
  { id: 'uc-yildiz', title: 'Parlayan Yıldız', desc: 'Bir oyunda 3 yıldız kazan', icon: 'glowstar', tier: 'bronz', group: 'Başlangıç', reward: 15, progress: (c) => ({ cur: perfectGames(c), target: 1 }) },
  { id: 'kasif-10', title: 'Meraklı Kaşif', desc: '10 oyun tamamla', icon: 'compass', tier: 'gumus', group: 'Başlangıç', reward: 30, progress: (c) => ({ cur: totalPlays(c), target: 10 }) },
  { id: 'kasif-50', title: 'Usta Kaşif', desc: '50 oyun tamamla', icon: 'trophy', tier: 'altin', group: 'Başlangıç', reward: 80, progress: (c) => ({ cur: totalPlays(c), target: 50 }) },
  { id: 'yildiz-50', title: 'Yıldız Toplayıcı', desc: '50 yıldız topla', icon: 'star', tier: 'gumus', group: 'Başlangıç', reward: 30, progress: (c) => ({ cur: c.stars, target: 50 }) },
  { id: 'yildiz-150', title: 'Yıldız Ustası', desc: '150 yıldız topla', icon: 'star2', tier: 'altin', group: 'Başlangıç', reward: 80, progress: (c) => ({ cur: c.stars, target: 150 }) },
  { id: 'mukemmel-5', title: 'Kusursuz', desc: '5 farklı oyunda 3 yıldız al', icon: 'medal', tier: 'gumus', group: 'Başlangıç', reward: 40, progress: (c) => ({ cur: perfectGames(c), target: 5 }) },
  { id: 'cok-yonlu', title: 'Çok Yönlü', desc: '3 farklı dersin dünyasında oyna', icon: 'globe', tier: 'gumus', group: 'Başlangıç', reward: 30, progress: (c) => ({ cur: subjectsPlayed(c), target: 3 }) },

  // ── Türkçe
  { id: 'turkce-5', title: 'Kelime Avcısı', desc: '5 Türkçe oyunu tamamla', icon: 'openbook', tier: 'bronz', group: 'Türkçe', reward: 20, progress: (c) => ({ cur: totalPlays(c, 'turkce'), target: 5 }) },
  { id: 'turkce-25', title: 'Kitap Kurdu', desc: '25 Türkçe oyunu tamamla', icon: 'books', tier: 'altin', group: 'Türkçe', reward: 60, progress: (c) => ({ cur: totalPlays(c, 'turkce'), target: 25 }) },

  // ── Matematik
  { id: 'mat-5', title: 'Sayı Dostu', desc: '5 Matematik oyunu tamamla', icon: 'abacus', tier: 'bronz', group: 'Matematik', reward: 20, progress: (c) => ({ cur: totalPlays(c, 'matematik'), target: 5 }) },
  { id: 'mat-25', title: 'Matematik Dehası', desc: '25 Matematik oyunu tamamla', icon: 'numbers', tier: 'altin', group: 'Matematik', reward: 60, progress: (c) => ({ cur: totalPlays(c, 'matematik'), target: 25 }) },

  // ── Okuma Yazma (1. sınıf; harf sırası a n e t i l / o k u r ı m / ...)
  { id: 'harf-6', title: 'İlk Sesler', desc: 'İlk 6 harfi (a n e t i l) öğren', icon: 'abc', tier: 'bronz', group: 'Okuma Yazma', reward: 20, grades: [1], progress: (c) => ({ cur: Math.min(6, c.letterIdx + 1), target: 6 }) },
  { id: 'harf-12', title: 'Hece Ustası', desc: '12 harf öğren', icon: 'memo', tier: 'gumus', group: 'Okuma Yazma', reward: 40, grades: [1], progress: (c) => ({ cur: Math.min(12, c.letterIdx + 1), target: 12 }) },
  { id: 'harf-29', title: 'Okuyorum!', desc: 'Bütün harfleri öğren', icon: 'scroll', tier: 'altin', group: 'Okuma Yazma', reward: 100, grades: [1], progress: (c) => ({ cur: Math.min(29, c.letterIdx + 1), target: 29 }) },

  // ── Süreklilik (her gün biraz)
  { id: 'seri-3', title: 'Düzenli Kaşif', desc: '3 gün üst üste oyna', icon: 'calendar', tier: 'bronz', group: 'Süreklilik', reward: 25, progress: (c) => ({ cur: streakDays(c.sessions, c.today), target: 3 }) },
  { id: 'seri-7', title: 'Bir Hafta Boyunca', desc: '7 gün üst üste oyna', icon: 'sunrise', tier: 'altin', group: 'Süreklilik', reward: 70, progress: (c) => ({ cur: streakDays(c.sessions, c.today), target: 7 }) },

  // ── Koleksiyon
  { id: 'hazine', title: 'Hazine Avcısı', desc: 'Dünyada gizli bir hazine sandığı bul', icon: 'key', tier: 'bronz', group: 'Koleksiyon', reward: 15, progress: (c) => ({ cur: c.treasureCount, target: 1 }) },
  { id: 'cikartma-10', title: 'Koleksiyoncu', desc: '10 çıkartma topla', icon: 'paperclip', tier: 'gumus', group: 'Koleksiyon', reward: 30, progress: (c) => ({ cur: stickerCount(c), target: 10 }) },
  { id: 'sayfa-1', title: 'Albüm Sayfası', desc: 'Bir albüm sayfasını tamamla', icon: 'book2', tier: 'altin', group: 'Koleksiyon', reward: 50, progress: (c) => ({ cur: fullPages(c), target: 1 }) },
]

export const badgeById = (id: string) => BADGES.find((b) => b.id === id)

/** Bu sınıfta gösterilecek rozetler */
export const badgesFor = (grade: number | null) => BADGES.filter((b) => !b.grades || (grade !== null && b.grades.includes(grade)))

/** Yeni kazanılan rozetler (zaten kazanılmışlar hariç) */
export function newlyEarned(c: BadgeCtx, earned: Record<string, string>) {
  return badgesFor(c.grade).filter((b) => {
    if (earned[b.id]) return false
    const p = b.progress(c)
    return p.cur >= p.target
  })
}
