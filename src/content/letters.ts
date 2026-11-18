/**
 * İlk okuma yazma harf ilerlemesi (MEB 1. sınıf İlk Okuma Yazma Kitabı sırası, docs/meb-kitaplar/analiz/turkce-1.md).
 * Kitap kuralı: öğrenci içeriği YALNIZCA o ana kadar öğrenilmiş harflerden oluşur.
 */
export const LETTER_ORDER = ['a', 'n', 'e', 't', 'i', 'l', 'o', 'k', 'u', 'r', 'ı', 'm', 'ü', 's', 'ö', 'y', 'd', 'z', 'ç', 'b', 'g', 'c', 'ş', 'p', 'h', 'v', 'ğ', 'f', 'j']
export const LAST = LETTER_ORDER.length - 1

/** Kitapta özelliklerin açıldığı harfler */
export const MILESTONE = {
  sentence: LETTER_ORDER.indexOf('o'), // ilk cümleler + nokta
  comma: LETTER_ORDER.indexOf('k'), // virgül, mini metinler
  question: LETTER_ORDER.indexOf('u'), // soru işareti
  apostrophe: LETTER_ORDER.indexOf('ı'), // kesme işareti
  longText: LETTER_ORDER.indexOf('ç'), // uzun metinler
  exclamation: LETTER_ORDER.indexOf('v'), // ünlem
}

/** Uygulama içinde geçerli ilerleme (store ile senkron; testlerde doğrudan ayarlanır) */
let current = LETTER_ORDER.indexOf('m')
export const learnedIdx = () => current
export const setLearnedIdx = (i: number) => {
  current = Math.max(0, Math.min(LAST, i))
}

const lower = (s: string) => s.toLocaleLowerCase('tr-TR').replace(/[âÂ]/g, 'a').replace(/[îÎ]/g, 'i').replace(/[ûÛ]/g, 'u')

/** Metnin gerektirdiği en ileri harf sırası (harf olmayanlar yok sayılır) */
export function requiredIdx(text: string): number {
  let max = 0
  for (const ch of lower(text)) {
    const i = LETTER_ORDER.indexOf(ch)
    if (i > max) max = i
  }
  return max
}

export const isAllowed = (text: string, idx = current) => requiredIdx(text) <= idx

export const learnedLetters = (idx = current) => LETTER_ORDER.slice(0, idx + 1)

/* ---------------- Türkçe heceleme (kurallı: her hecede bir ünlü) ---------------- */
const V = 'aeıioöuü'
const isV = (c: string) => V.includes(c)
/** "kaplumbağa" → ["kap","lum","ba","ğa"] */
export function heceler(word: string): string[] {
  const w = lower(word)
  const idx: number[] = []
  for (let i = 0; i < w.length; i++) if (isV(w[i])) idx.push(i)
  if (idx.length <= 1) return [w]
  const out: string[] = []
  let start = 0
  for (let k = 0; k < idx.length - 1; k++) {
    const a = idx[k]
    const b = idx[k + 1]
    const cons = b - a - 1 // iki ünlü arasındaki ünsüz sayısı
    const cut = cons === 0 ? a + 1 : b - 1 // V-V → böl; V C V → V-CV; V CC V → VC-CV; V CCC V → VCC-CV
    out.push(w.slice(start, cut))
    start = cut
  }
  out.push(w.slice(start))
  return out
}
