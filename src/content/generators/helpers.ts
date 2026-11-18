import type { Grade } from '../types'
import type { Level } from '../../learning/mastery'
import { pick, shuffle, type Rng } from '../../learning/rng'
import type { ChoiceQ, InputQ, MatchQ, MemoryQ, Option, OrderQ, Question, SortQ, Visual } from '../../games/quiz/types'

export type Gen = (rng: Rng, grade: Grade, level: Level, history: Question[]) => Question

/** Seçmeli soru: doğru + yanlışlar karıştırılır, cevap indeksi hesaplanır */
export function choice(
  rng: Rng,
  p: {
    prompt: string
    correct: string | Option
    wrong: (string | Option)[]
    explain: string
    spoken?: string
    visual?: Visual
    layout?: ChoiceQ['layout']
    passage?: ChoiceQ['passage']
    max?: number
    keepOrder?: boolean
  },
): ChoiceQ {
  const norm = (o: string | Option): Option => (typeof o === 'string' ? { label: o } : o)
  const key = (o: Option) => o.label ?? o.img ?? JSON.stringify(o.visual)
  const c = norm(p.correct)
  const seen = new Set([key(c)])
  const wrong: Option[] = []
  for (const w of shuffle(rng, p.wrong.map(norm))) {
    if (seen.has(key(w))) continue
    seen.add(key(w))
    wrong.push(w)
    if (wrong.length >= (p.max ?? 4) - 1) break
  }
  const all = p.keepOrder ? [c, ...wrong] : shuffle(rng, [c, ...wrong])
  const options = p.keepOrder ? sortOptions(all) : all
  return {
    type: 'choice',
    prompt: p.prompt,
    spoken: p.spoken,
    explain: p.explain,
    visual: p.visual,
    layout: p.layout,
    passage: p.passage,
    options,
    answer: options.findIndex((o) => key(o) === key(c)),
  }
}

/** Sayı seçeneklerini küçükten büyüğe sırala (çocuk için daha okunaklı) */
function sortOptions(o: Option[]) {
  return [...o].sort((a, b) => Number(a.label) - Number(b.label))
}

/** Sayısal seçmeli soru: yakın çeldiriciler */
export function numChoice(rng: Rng, p: { prompt: string; answer: number; explain: string; visual?: Visual; spoken?: string; near?: number[]; fmt?: (n: number) => string; max?: number }) {
  const fmt = p.fmt ?? ((n: number) => n.toLocaleString('tr-TR'))
  const near = (p.near ?? [p.answer - 1, p.answer + 1, p.answer + 2, p.answer - 2, p.answer + 10, p.answer - 10]).filter((n) => n >= 0 && n !== p.answer)
  return choice(rng, { prompt: p.prompt, correct: fmt(p.answer), wrong: near.map(fmt), explain: p.explain, visual: p.visual, spoken: p.spoken, keepOrder: true, max: p.max ?? 3 })
}

export function order(p: Omit<OrderQ, 'type'>): OrderQ {
  return { type: 'order', ...p }
}

export function sort(rng: Rng, p: Omit<SortQ, 'type' | 'items'> & { items: SortQ['items']; count?: number }): SortQ {
  // her kutudan en az bir öğe olacak şekilde seç
  const byBin = p.bins.map((b) => shuffle(rng, p.items.filter((i) => i.bin === b.id)))
  const picked: SortQ['items'] = []
  const n = p.count ?? 6
  let k = 0
  while (picked.length < n && byBin.some((x) => x.length)) {
    const list = byBin[k % byBin.length]
    const it = list.shift()
    if (it) picked.push(it)
    k++
  }
  return { type: 'sort', prompt: p.prompt, spoken: p.spoken, explain: p.explain, bins: p.bins, items: shuffle(rng, picked) }
}

/** Banka sorusu: belirli sınıflara ait, statik içerik */
export interface BankItem {
  g: Grade[]
  make: (rng: Rng, level: Level) => Question
}

/** Bankadan, son sorularla tekrar etmeyen bir soru seç */
export function fromBank(bank: BankItem[], rng: Rng, grade: Grade, level: Level, history: Question[]): Question {
  const pool = bank.filter((b) => b.g.includes(grade))
  const recent = new Set(history.slice(-12).map((h) => h.prompt + ('options' in h ? h.options.map((o) => o.label).join() : '')))
  const fresh = shuffle(rng, pool)
  for (const b of fresh) {
    const q = b.make(rng, level)
    if (!recent.has(q.prompt + ('options' in q ? q.options.map((o) => o.label).join() : ''))) return q
  }
  return pick(rng, pool).make(rng, level)
}

/** Kısa yol: statik seçmeli banka sorusu */
export const C = (g: Grade[], prompt: string, correct: string | Option, wrong: (string | Option)[], explain: string, visual?: Visual): BankItem => ({
  g,
  make: (rng, level) => choice(rng, { prompt, correct, wrong, explain, visual, max: level === 1 ? 3 : 4 }),
})

/* ---------- sayıların Türkçe okunuşu (4. sınıf büyük sayılar) ---------- */
const ONES = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan']
function under1000(n: number): string {
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10
  return [h === 0 ? '' : h === 1 ? 'yüz' : `${ONES[h]} yüz`, TENS[t], ONES[o]].filter(Boolean).join(' ')
}
export function sayiOku(n: number): string {
  if (n === 0) return 'sıfır'
  const th = Math.floor(n / 1000)
  const rest = n % 1000
  const thText = th === 0 ? '' : th === 1 ? 'bin' : `${under1000(th)} bin`
  return [thText, under1000(rest)].filter(Boolean).join(' ')
}

/** "3'ü", "4'e" gibi rakam + ek (saat okuma) */
const ACC: Record<number, string> = { 1: "1'i", 2: "2'yi", 3: "3'ü", 4: "4'ü", 5: "5'i", 6: "6'yı", 7: "7'yi", 8: "8'i", 9: "9'u", 10: "10'u", 11: "11'i", 12: "12'yi" }
const DAT: Record<number, string> = { 1: "1'e", 2: "2'ye", 3: "3'e", 4: "4'e", 5: "5'e", 6: "6'ya", 7: "7'ye", 8: "8'e", 9: "9'a", 10: "10'a", 11: "11'e", 12: "12'ye" }
export const saatAcc = (h: number) => ACC[((h - 1) % 12) + 1]
export const saatDat = (h: number) => DAT[((h - 1) % 12) + 1]

/* ---------- yeni etkileşim türleri ---------- */
export const match = (p: Omit<MatchQ, 'type'>): MatchQ => ({ type: 'match', ...p })
export const input = (p: Omit<InputQ, 'type'>): InputQ => ({ type: 'input', ...p })
export const memory = (p: Omit<MemoryQ, 'type'>): MemoryQ => ({ type: 'memory', ...p })

/** Bir üreticiye çeşit kat: belirli olasılıkla eşleştirme / cevap yazma / hafıza sorusu gelir */
export function vary(base: Gen, extras: Gen[], p = 0.4): Gen {
  return (rng, grade, level, history) => {
    if (!extras.length) return base(rng, grade, level, history)
    const last = history[history.length - 1]
    const lastExtra = last && last.type !== 'choice'
    if (!lastExtra && rng() < p) return extras[Math.floor(rng() * extras.length)](rng, grade, level, history)
    return base(rng, grade, level, history)
  }
}
