import { describe, expect, it } from 'vitest'
import { BADGES, badgesFor, newlyEarned, streakDays, type BadgeCtx } from './badges'
import { STICKER_PAGES } from './stickers'
import { isBedtime, screenTimeState, trimUsage, DEFAULT_LIMITS } from '../state/screenTime'
import { PETS, BACKGROUNDS } from '../characters/avatarTypes'
import fs from 'node:fs'
import path from 'node:path'

const base: BadgeCtx = { grade: 1, stars: 0, letterIdx: 0, sessions: [], gameResults: {}, owned: [], treasureCount: 0, today: '2026-11-19' }
const objects = new Set(fs.readdirSync(path.resolve(__dirname, '../../public/assets/objects')).map((f) => f.replace(/\.png$/, '')))

describe('Rozetler', () => {
  it('kimliklar benzersiz, ödüller pozitif, ikonlar mevcut', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length)
    for (const b of BADGES) {
      expect(b.reward, b.id).toBeGreaterThan(0)
      expect(objects.has(b.icon), `${b.id} ikonu: ${b.icon}`).toBe(true)
    }
  })

  it('hiç oynamamış çocuk rozet kazanmaz', () => {
    expect(newlyEarned(base, {})).toEqual([])
  })

  it('ilk oyun ve 3 yıldız rozetleri kazanılır, tekrar verilmez', () => {
    const c: BadgeCtx = { ...base, stars: 3, sessions: [{ gameId: 'harf-avi', date: '2026-11-19T10:00:00Z', stars: 3 }], gameResults: { 'harf-avi': { best: 3, plays: 1 } } }
    const ids = newlyEarned(c, {}).map((b) => b.id)
    expect(ids).toContain('ilk-adim')
    expect(ids).toContain('uc-yildiz')
    expect(newlyEarned(c, Object.fromEntries(ids.map((i) => [i, 'x'])))).toEqual([])
  })

  it('okuma yazma rozetleri yalnızca 1. sınıfta', () => {
    expect(badgesFor(1).some((b) => b.id === 'harf-6')).toBe(true)
    expect(badgesFor(3).some((b) => b.id === 'harf-6')).toBe(false)
    expect(newlyEarned({ ...base, letterIdx: 5 }, {}).map((b) => b.id)).toContain('harf-6')
  })

  it('seri: art arda günler sayılır, boşluk seriyi bozar', () => {
    const d = (x: string) => ({ date: `${x}T09:00:00Z` })
    expect(streakDays([d('2026-11-17'), d('2026-11-18'), d('2026-11-19')], '2026-11-19')).toBe(3)
    expect(streakDays([d('2026-11-16'), d('2026-11-18')], '2026-11-19')).toBe(1) // dünden başlar
    expect(streakDays([d('2026-11-10')], '2026-11-19')).toBe(0)
  })

  it('albüm sayfası tamamlanınca koleksiyon rozeti', () => {
    const owned = STICKER_PAGES[0].items.map((i) => `st:${i.id}`)
    const ids = newlyEarned({ ...base, owned }, {}).map((b) => b.id)
    expect(ids).toContain('sayfa-1')
  })
})

describe('Çıkartma albümü ve fiyatlar', () => {
  it('her çıkartmanın görseli var, kimlikler benzersiz', () => {
    const all = STICKER_PAGES.flatMap((p) => p.items.map((i) => i.id))
    expect(new Set(all).size).toBe(all.length)
    for (const id of all) expect(objects.has(id), id).toBe(true)
  })
  it('ücretsiz başlangıç seçenekleri var (çocuk hiçbir şey almadan da seçebilir)', () => {
    expect(PETS.filter((p) => p.cost === 0).length).toBeGreaterThanOrEqual(4)
    expect(BACKGROUNDS.filter((b) => b.cost === 0).length).toBeGreaterThanOrEqual(3)
  })
})

describe('Ekran süresi', () => {
  const at = (h: number, m = 0) => new Date(2026, 10, 19, h, m)
  it('varsayılan: sınırsız, 20 dakikada bir mola', () => {
    const s = screenTimeState({ limits: DEFAULT_LIMITS, usedToday: 3600, extraMin: 0, sinceBreak: 20 * 60, now: at(15) })
    expect(s.blocked).toBeNull()
    expect(s.secondsLeft).toBeNull()
    expect(s.needBreak).toBe(true)
  })
  it('günlük sınır dolunca kilit; ebeveyn ek süresi açar', () => {
    const limits = { dailyMin: 30, breakEvery: 0, bedtime: '' }
    expect(screenTimeState({ limits, usedToday: 29 * 60, extraMin: 0, sinceBreak: 0, now: at(15) }).secondsLeft).toBe(60)
    expect(screenTimeState({ limits, usedToday: 30 * 60, extraMin: 0, sinceBreak: 0, now: at(15) }).blocked).toBe('limit')
    expect(screenTimeState({ limits, usedToday: 30 * 60, extraMin: 15, sinceBreak: 0, now: at(15) }).blocked).toBeNull()
  })
  it('uyku saati: akşam ve sabah 06:00 öncesi kilitli, gündüz açık', () => {
    expect(isBedtime(at(20, 30), '20:30')).toBe(true)
    expect(isBedtime(at(5, 59), '20:30')).toBe(true)
    expect(isBedtime(at(6, 0), '20:30')).toBe(false)
    expect(isBedtime(at(20, 29), '20:30')).toBe(false)
    expect(isBedtime(at(23), '')).toBe(false)
  })
  it('kilitliyken mola istenmez', () => {
    const s = screenTimeState({ limits: { dailyMin: 15, breakEvery: 15, bedtime: '' }, usedToday: 16 * 60, extraMin: 0, sinceBreak: 16 * 60, now: at(15) })
    expect(s.blocked).toBe('limit')
    expect(s.needBreak).toBe(false)
  })
  it('kullanım kaydı son 14 günle sınırlı', () => {
    const u = trimUsage({ '2026-11-19': 10, '2026-11-06': 5, '2026-11-05': 7, '2025-01-01': 1 }, '2026-11-19')
    expect(Object.keys(u).sort()).toEqual(['2026-11-06', '2026-11-19'])
  })
})
