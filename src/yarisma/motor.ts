/**
 * YARIŞMA MOTORU — saf fonksiyonlar (puanlama, sıralama, karakter rakipler, oda kodu).
 * Ekrandan ve ağdan bağımsızdır; hem tek cihazda hem sınıf ağında aynı kurallar geçerli.
 */
import type { Option, Visual } from '../games/quiz/types'

export type Kategori = 'matematik' | 'turkce' | 'fen' | 'hayat' | 'mantik' | 'kultur'
export type Mod = 'canli' | 'takim' | 'sinif' | 'duello' | 'turnuva'

/** Yarışma sorusu: 2–4 seçenekli, doğru cevap + kısa açıklama */
export interface YSoru {
  prompt: string
  spoken?: string
  options: Option[]
  answer: number
  explain: string
  visual?: Visual
  /** sorunun geldiği konu/etkinlik adı (sonuç ekranında "öğrenilen konular") */
  konu: string
}

export interface Ayar {
  ad: string
  kategori: Kategori
  sinif: 1 | 2 | 3 | 4
  soruSayisi: number
  /** soru başına süre (sn) */
  sure: number
  mod: Mod
  /** takım modunda takım adları */
  takimlar?: [string, string]
}

export interface Cevap {
  secim: number
  ms: number
  dogru: boolean
  kazanc: number
}

export interface Oyuncu {
  id: string
  ad: string
  /** kaşif hazır karakteri, 'findik' veya 'robo' */
  avatar: string
  takim?: 0 | 1
  /** karakter rakip (tek cihaz) */
  bot?: { isabet: number; hiz: number }
  puan: number
  seri: number
  dogru: number
  cevaplar: Record<number, Cevap>
}

/* ----------------------------------------------------------------------------- puanlama */
export const TABAN = 500
export const HIZ_BONUS = 300
export const SERI_BONUS = 50
export const SERI_TAVAN = 4

/**
 * Doğru cevap 500 puan; hız en fazla +300 (öğrenme önde, hız ikinci planda);
 * art arda doğru serisi her adımda +50 (en fazla +200). Yanlış: 0 (eksi puan yok).
 */
export function puanHesapla(dogru: boolean, ms: number, sureMs: number, seri: number) {
  if (!dogru) return 0
  const hiz = Math.max(0, Math.min(1, 1 - ms / sureMs))
  return TABAN + Math.round(HIZ_BONUS * hiz) + Math.min(Math.max(seri - 1, 0), SERI_TAVAN) * SERI_BONUS
}

/** Oyuncunun bir soruya cevabını işler (aynı soruya ikinci cevap yok sayılır) */
export function cevapIsle(o: Oyuncu, soruNo: number, secim: number, ms: number, soru: YSoru, sureMs: number): Oyuncu {
  if (o.cevaplar[soruNo]) return o
  const dogru = secim === soru.answer
  const seri = dogru ? o.seri + 1 : 0
  const kazanc = puanHesapla(dogru, ms, sureMs, seri)
  return { ...o, seri, puan: o.puan + kazanc, dogru: o.dogru + (dogru ? 1 : 0), cevaplar: { ...o.cevaplar, [soruNo]: { secim, ms, dogru, kazanc } } }
}

/** Süre bitti, cevap vermeyenlerin serisi sıfırlanır */
export function cevapsizIsle(o: Oyuncu, soruNo: number): Oyuncu {
  return o.cevaplar[soruNo] ? o : { ...o, seri: 0 }
}

/** Sıralama: puan, sonra doğru sayısı, sonra ad */
export function sirala<T extends { puan: number; dogru: number; ad: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => b.puan - a.puan || b.dogru - a.dogru || a.ad.localeCompare(b.ad, 'tr'))
}

/** Takım puanı: üye ortalaması (kalabalık takım avantaj kazanmasın) */
export function takimPuanlari(list: Oyuncu[]): [number, number] {
  const t = [0, 1].map((k) => {
    const m = list.filter((o) => o.takim === k)
    return m.length ? Math.round(m.reduce((s, o) => s + o.puan, 0) / m.length) : 0
  })
  return [t[0], t[1]]
}

/* ----------------------------------------------------------------------------- ödül */
export function odul(o: Oyuncu, toplam: number, sira: number) {
  const oran = toplam ? o.dogru / toplam : 0
  const yildiz = oran >= 0.9 ? 3 : oran >= 0.6 ? 2 : o.dogru > 0 ? 1 : 0
  const xp = o.dogru * 10 + (sira === 1 ? 30 : sira === 2 ? 20 : sira === 3 ? 10 : 0)
  const altin = o.dogru * 2 + (sira === 1 ? 10 : sira <= 3 ? 5 : 0)
  return { yildiz, xp, altin, oran }
}

/* ----------------------------------------------------------------------------- karakter rakipler */
export const KARAKTERLER: { ad: string; avatar: string }[] = [
  { ad: 'Fındık', avatar: 'findik' },
  { ad: 'Robo', avatar: 'robo' },
  { ad: 'Maceracı', avatar: 'kasif-pembe' },
  { ad: 'Gezgin', avatar: 'kasif-lacivert' },
  { ad: 'Bilim İnsanı', avatar: 'kasif-bilim' },
  { ad: 'Sporcu', avatar: 'kasif-sporcu' },
  { ad: 'Astronot', avatar: 'kasif-uzay' },
  { ad: 'Doğa Kaşifi', avatar: 'kasif-doga' },
]
/** zorluk 1 (kolay) – 3 (zor) */
export function botYap(i: number, zorluk: 1 | 2 | 3, rng: () => number, haric: string[] = []): Oyuncu {
  const havuz = KARAKTERLER.filter((k) => !haric.includes(k.avatar))
  const k = havuz[i % havuz.length]
  const isabet = [0.5, 0.68, 0.82][zorluk - 1] + (rng() - 0.5) * 0.12
  const hiz = [0.75, 0.55, 0.4][zorluk - 1] + (rng() - 0.5) * 0.1
  return { id: `bot-${k.avatar}`, ad: k.ad, avatar: k.avatar, bot: { isabet, hiz }, puan: 0, seri: 0, dogru: 0, cevaplar: {} }
}
/** karakter rakibin bu soruya cevabı: [seçim, ms] */
export function botCevap(b: Oyuncu, soru: YSoru, sureMs: number, rng: () => number): [number, number] {
  const p = b.bot!
  const dogru = rng() < p.isabet
  const yanlislar = soru.options.map((_, i) => i).filter((i) => i !== soru.answer)
  const secim = dogru ? soru.answer : yanlislar[Math.floor(rng() * yanlislar.length)]
  const ms = Math.round(sureMs * Math.min(0.92, Math.max(0.12, p.hiz + (rng() - 0.5) * 0.3)))
  return [secim, ms]
}

/* ----------------------------------------------------------------------------- oda kodu ve takma ad */
export const kodUret = (rng: () => number, kullanilan: Set<string> = new Set()) => {
  for (let i = 0; i < 50; i++) {
    const k = String(1000 + Math.floor(rng() * 9000))
    if (!kullanilan.has(k)) return k
  }
  return String(10000 + Math.floor(rng() * 90000))
}
/** Takma adı güvenli hâle getir: yalnızca harf, rakam ve boşluk; en çok 14 karakter */
export function adTemizle(s: string) {
  const t = s.replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 14)
  return t || 'Kaşif'
}
/** Aynı adlar: "Ece", "Ece 2" … */
export function adBenzersiz(ad: string, mevcut: string[]) {
  if (!mevcut.includes(ad)) return ad
  for (let i = 2; i < 99; i++) if (!mevcut.includes(`${ad} ${i}`)) return `${ad} ${i}`
  return `${ad} ${mevcut.length + 1}`
}

/* ----------------------------------------------------------------------------- ekran görünümü (ağ üzerinden de gönderilir) */
export type Evre = 'lobi' | 'hazir' | 'soru' | 'cevap' | 'siralama' | 'sonuc'
export interface Gorunum {
  kod: string
  ayar: Ayar
  evre: Evre
  no: number
  toplam: number
  /** soru (cevap evresinden önce doğru şık gönderilmez) */
  soru: Omit<YSoru, 'answer' | 'explain'> | null
  dogru?: number
  aciklama?: string
  /** evrenin bitmesine kalan süre (ms) — alıcı kendi saatine göre hesaplar */
  kalanMs: number
  oyuncular: { id: string; ad: string; avatar: string; takim?: 0 | 1; puan: number; dogru: number; seri: number; cevapladi: boolean; son?: Cevap; bot?: boolean }[]
  /** cevap evresinde: her şıkka kaç kişi */
  dagilim?: number[]
  kilitli?: boolean
  takimPuan?: [number, number]
  /** sonuçta: konular ve sorular (yanlışları tekrar çalışmak için) */
  sorular?: YSoru[]
}
