import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Grade, SubjectId } from '../content/types'
import type { AvatarConfig } from '../characters/avatarTypes'
import { DEFAULT_AVATAR } from '../characters/avatarTypes'
import { updateSkill, type SkillStat } from '../learning/mastery'
import { newlyEarned } from '../rewards/badges'
import { DEFAULT_LIMITS, dayKey, trimUsage, type Limits } from './screenTime'

export type Screen =
  | { name: 'welcome' }
  | { name: 'grade' }
  | { name: 'world' }
  | { name: 'subject'; subject: SubjectId }
  | { name: 'game'; gameId: string }
  | { name: 'avatar' }
  | { name: 'parent' }
  | { name: 'okuma-yazma' }
  | { name: 'harf'; letter: string }
  | { name: 'matematik-yolu' }
  | { name: 'tema'; tema: string }
  | { name: 'hazine'; tab?: 'rozet' | 'album' }

export type Quality = 'low' | 'medium' | 'high'

export interface Settings {
  voice: boolean
  sfx: boolean
  calm: boolean
  quality: Quality
  /** true: prosedürel 3D dünya, false: boyanmış dünya (varsa) */
  world3d: boolean
}

export interface GameResult {
  best: number
  plays: number
  lastAccuracy: number
}

export interface SessionLog {
  gameId: string
  date: string
  stars: number
  accuracy: number
  seconds: number
}

interface PersistedState {
  nickname: string
  grade: Grade | null
  avatar: AvatarConfig
  stars: number
  coins: number
  xp: number
  gameResults: Record<string, GameResult>
  skills: Record<string, SkillStat>
  sessions: SessionLog[]
  treasures: { day: string; found: string[] }
  settings: Settings
  /** 1. sınıf ilk okuma yazma: öğrenilen son harfin sırası (src/content/letters.ts) */
  letterIdx: number
  /** altınla alınanlar: 'st:<çıkartma>', 'pet:<id>', 'bg:<id>' */
  owned: string[]
  /** kazanılan rozetler → tarih */
  badges: Record<string, string>
  treasureCount: number
  /** gün → oynanan saniye (son 14 gün) */
  usage: Record<string, number>
  /** ebeveynin bugün verdiği ek süre */
  extra: { day: string; min: number }
  /** ebeveyn sınırları (ebeveyn panelinden) */
  limits: Limits
}

interface State extends PersistedState {
  screen: Screen
  history: Screen[]
  go: (s: Screen) => void
  back: () => void
  home: () => void
  setGrade: (g: Grade) => void
  setAvatar: (a: AvatarConfig) => void
  setNickname: (n: string) => void
  recordAttempt: (skill: string, correct: boolean) => void
  finishGame: (r: { gameId: string; stars: number; accuracy: number; seconds: number; coins: number; xp: number }) => void
  findTreasure: (id: string, coins: number) => boolean
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void
  setLetterIdx: (i: number) => void
  resetProgress: () => void
  /** altınla satın al (yalnızca kazanılmış altın) — yetmezse false */
  buy: (key: string, price: number) => boolean
  /** silent: kutlama göstermeden ver (ilk açılışta eski ilerlemeden gelen rozetler) */
  checkBadges: (silent?: boolean) => void
  /** gösterilmeyi bekleyen yeni rozetler (kalıcı değil) */
  badgeQueue: string[]
  popBadge: () => void
  /** son moladan beri geçen saniye (kalıcı değil) */
  sinceBreak: number
  addUsage: (sec: number) => void
  takeBreak: () => void
  grantExtra: (min: number) => void
  setLimits: (p: Partial<Limits>) => void
  /** binaya giriş geçişi: ekranı kaplayan ışık rengi (dünya kaybolurken boşluk görünmesin; kalıcı değil) */
  veil: string | null
  setVeil: (c: string | null) => void
}

const today = () => new Date().toISOString().slice(0, 10)

const initial: PersistedState = {
  nickname: 'Kaşif',
  grade: null,
  avatar: DEFAULT_AVATAR,
  stars: 0,
  coins: 0,
  xp: 0,
  gameResults: {},
  skills: {},
  sessions: [],
  treasures: { day: today(), found: [] },
  letterIdx: 11,
  owned: [],
  badges: {},
  treasureCount: 0,
  usage: {},
  extra: { day: '', min: 0 },
  limits: DEFAULT_LIMITS,
  settings: {
    voice: true,
    sfx: true,
    calm: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    quality: 'high',
    world3d: false,
  },
}

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      screen: { name: 'welcome' },
      history: [],
      badgeQueue: [],
      sinceBreak: 0,
      veil: null,
      setVeil: (c) => set({ veil: c }),
      go: (s) => set((st) => ({ history: [...st.history, st.screen].slice(-20), screen: s })),
      back: () =>
        set((st) => {
          const h = [...st.history]
          const prev = h.pop() ?? { name: 'world' as const }
          return { screen: prev, history: h }
        }),
      home: () => set({ screen: { name: 'world' }, history: [] }),
      setGrade: (g) => set({ grade: g }),
      setAvatar: (a) => set({ avatar: a }),
      setNickname: (n) => set({ nickname: n.slice(0, 16) }),
      recordAttempt: (skill, correct) =>
        set((st) => ({ skills: { ...st.skills, [skill]: updateSkill(st.skills[skill], correct) } })),
      finishGame: ({ gameId, stars, accuracy, seconds, coins, xp }) => {
        set((st) => {
          const prev = st.gameResults[gameId]
          return {
            stars: st.stars + stars,
            coins: st.coins + coins,
            xp: st.xp + xp,
            gameResults: {
              ...st.gameResults,
              [gameId]: { best: Math.max(prev?.best ?? 0, stars), plays: (prev?.plays ?? 0) + 1, lastAccuracy: accuracy },
            },
            sessions: [...st.sessions, { gameId, date: new Date().toISOString(), stars, accuracy, seconds }].slice(-100),
          }
        })
        get().checkBadges()
      },
      findTreasure: (id, coins) => {
        const st = get()
        const t = st.treasures.day === today() ? st.treasures : { day: today(), found: [] }
        if (t.found.includes(id)) return false
        set({ treasures: { day: t.day, found: [...t.found, id] }, coins: st.coins + coins, treasureCount: st.treasureCount + 1 })
        get().checkBadges()
        return true
      },
      setSetting: (k, v) => set((st) => ({ settings: { ...st.settings, [k]: v } })),
      setLetterIdx: (i) => {
        set({ letterIdx: i })
        get().checkBadges()
      },
      buy: (key, price) => {
        const st = get()
        if (st.owned.includes(key)) return true
        if (st.coins < price) return false
        set({ coins: st.coins - price, owned: [...st.owned, key] })
        get().checkBadges()
        return true
      },
      checkBadges: (silent = false) => {
        const st = get()
        const won = newlyEarned(
          { grade: st.grade, stars: st.stars, letterIdx: st.letterIdx, sessions: st.sessions, gameResults: st.gameResults, owned: st.owned, treasureCount: st.treasureCount },
          st.badges,
        )
        if (!won.length) return
        const date = new Date().toISOString()
        set({
          badges: { ...st.badges, ...Object.fromEntries(won.map((b) => [b.id, date])) },
          coins: st.coins + won.reduce((a, b) => a + b.reward, 0),
          badgeQueue: silent ? st.badgeQueue : [...st.badgeQueue, ...won.map((b) => b.id)],
        })
      },
      popBadge: () => set((st) => ({ badgeQueue: st.badgeQueue.slice(1) })),
      addUsage: (sec) =>
        set((st) => {
          const d = dayKey()
          return { usage: trimUsage({ ...st.usage, [d]: (st.usage[d] ?? 0) + sec }, d), sinceBreak: st.sinceBreak + sec }
        }),
      takeBreak: () => set({ sinceBreak: 0 }),
      grantExtra: (min) =>
        set((st) => {
          const d = dayKey()
          return { extra: { day: d, min: (st.extra.day === d ? st.extra.min : 0) + min } }
        }),
      setLimits: (p) => set((st) => ({ limits: { ...st.limits, ...p } })),
      // sıfırlama ilerlemeyi siler ama ebeveyn sınırlarını korur
      resetProgress: () => set((st) => ({ ...initial, limits: st.limits, screen: { name: 'welcome' }, history: [], badgeQueue: [], sinceBreak: 0 })),
    }),
    {
      name: 'minik-kasifler-v1',
      // yalnızca veri alanlarını sakla (ekran/geçmiş kalıcı değil)
      partialize: (st) => {
        const out: Record<string, unknown> = {}
        for (const k of Object.keys(initial)) out[k] = (st as unknown as Record<string, unknown>)[k]
        return out as unknown as PersistedState
      },
    },
  ),
)

// yalnızca geliştirme: uçtan uca testler durumu doğrudan ayarlayabilsin (üretim derlemesinde yok)
if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __mkStore: typeof useGame }).__mkStore = useGame
