/**
 * YOL KİTİ — kitap yollarının (ada → sıralı etkinlikler + oyunlar) ortak tipleri ve soru kurucuları.
 * Seçmeli banka (ch), doğru/yanlış (tf), sepet (srt), eşleştirme (mt), hafıza (mem), balon (pop), sıralama (ord), karışım (rot/karma).
 */
import { pick, shuffle, type Rng } from '../../learning/rng'
import { match, memory, order, sort, type Gen } from './helpers'
import type { ChoiceQ, Option, PopQ, Question, SortQ, Visual } from '../../games/quiz/types'
import type { Level } from '../../learning/mastery'

export interface Act {
  kind: string
  title: string
  icon: string
  total: number
  gen: Gen
  ders: string
  points?: string[]
  visual?: Visual
  meb: string
  oyun?: boolean
}
export interface Alan {
  id: string
  no: number
  title: string
  color: string
  dark: string
  icon: string
  acts: Act[]
}

/* ============================ ortak yardımcılar ============================ */
export const img = (i: string): Visual => ({ kind: 'image', img: i })
/** son sorularda olmayan bir öğe seç */
export function fresh<T>(rng: Rng, list: T[], history: Question[], key: (t: T) => string): T {
  const recent = new Set(history.slice(-Math.min(8, Math.max(1, list.length - 2))).map((h) => h.prompt))
  const pool = list.filter((t) => !recent.has(key(t)))
  return pick(rng, pool.length ? pool : list)
}
export const rot = (...gens: Gen[]): Gen => (rng, g, l, h) => gens[h.length % gens.length](rng, g, l, h)

/** Seçmeli soru (bankadan). o: seçenek etiketi → simge */
export interface Q {
  q: string
  a: string
  w: string[]
  ex: string
  img?: string
  o?: Record<string, string>
}
export function mkChoice(rng: Rng, it: Q, level: Level): ChoiceQ {
  const opt = (s: string): Option => (it.o?.[s] ? { label: s, img: it.o[s] } : { label: s })
  const wrong = shuffle(rng, it.w).slice(0, level === 1 ? 2 : 3)
  const options = shuffle(rng, [opt(it.a), ...wrong.map(opt)])
  return { type: 'choice', prompt: it.q, explain: it.ex, visual: it.img ? img(it.img) : undefined, options, answer: options.findIndex((o) => o.label === it.a), layout: it.o ? 'tiles' : 'wide' }
}
export const ch = (bank: Q[]): Gen => (rng, _g, l, h) => mkChoice(rng, fresh(rng, bank, h, (x) => x.q), l)

/** Doğru mu, yanlış mı? (kitaptaki mutlu/üzgün yüz, yıldız boyama) — [ifade, doğru mu, açıklama] */
export type TF = [string, boolean, string]
export const tfPrompt = (s: string) => `“${s}” Bu doğru mu?`
export const tf = (bank: TF[], icon?: string): Gen => (rng, _g, _l, h) => {
  const [s, ok, ex] = fresh(rng, bank, h, (x) => tfPrompt(x[0]))
  const options: Option[] = [
    { label: 'Doğru', img: 'thumbsup' },
    { label: 'Yanlış', img: 'thumbsdown' },
  ]
  return { type: 'choice', prompt: tfPrompt(s), spoken: `${s}. Bu doğru mu, yanlış mı?`, explain: (ok ? 'Evet, doğru! ' : 'Bu yanlış. ') + ex, visual: icon ? img(icon) : undefined, options, answer: ok ? 0 : 1, layout: 'tiles' }
}

/** Sepetlere ayır */
export const srt = (prompt: string, explain: string, bins: SortQ['bins'], items: SortQ['items'], count = 6): Gen => (rng, _g, l) =>
  sort(rng, { prompt, explain, bins, items, count: l === 1 ? Math.min(count, 4) : l === 3 ? count + 1 : count })

/** Eşleştir: [sol, sağ, solSimge?, sağSimge?] */
export type P = [string, string, string?, string?]
export const side = (t: string, i?: string): Option => (i ? { label: t, img: i } : { label: t })
export const mt = (prompt: string, explain: string, pairs: P[], n = 4): Gen => (rng, _g, l) => {
  const ps = pickPairs(rng, pairs, l === 1 ? Math.min(n, 3) : n)
  return match({ prompt, explain, pairs: ps.map(([a, b, ia, ib]) => ({ left: side(a, ia), right: side(b, ib) })) })
}
/** sol ve sağ tarafı benzersiz çiftler seç */
export function pickPairs(rng: Rng, pairs: P[], n: number): P[] {
  const out: P[] = []
  for (const p of shuffle(rng, pairs)) {
    if (out.some((o) => o[0] === p[0] || o[1] === p[1])) continue
    out.push(p)
    if (out.length >= n) break
  }
  return out
}
/** Hafıza kartları */
export const mem = (prompt: string, explain: string, pairs: P[], n = 4): Gen => (rng, _g, l) => {
  const ps = pickPairs(rng, pairs, l === 1 ? 3 : l === 3 ? n + 1 : n)
  return memory({ prompt, explain, pairs: ps.map(([a, b, ia, ib]) => ({ a: side(a, ia), b: side(b, ib) })) })
}

/** Balon patlat: doğruların hepsini bul */
export const pop = (prompt: string, explain: string, hits: string[], wrongs: string[], imgs?: Record<string, string>): Gen => (rng, _g, l) => {
  const need = l === 1 ? 3 : 4
  const h = shuffle(rng, hits).slice(0, need + 1)
  const w = shuffle(rng, wrongs).slice(0, l === 1 ? 3 : 4)
  const items = shuffle(rng, [...h, ...w])
  const q: PopQ = { type: 'pop', prompt, explain, target: h[0], items, need: Math.min(need, h.length), hits: h }
  if (imgs) q.imgs = Object.fromEntries(items.filter((x) => imgs[x]).map((x) => [x, imgs[x]]))
  return q
}

/** Adımları sırala */
export interface O {
  q: string
  s: string[]
  ex: string
  img?: string
}
export const ord = (bank: O[]): Gen => (rng, _g, l, h) => {
  const it = fresh(rng, bank, h, (x) => x.q)
  const steps = l === 1 && it.s.length > 4 ? it.s.slice(0, 4) : it.s
  // uzun listelerde resim ekrana sığmayı zorlaştırır
  return order({ prompt: it.q, explain: it.ex, pieces: steps, joiner: ' ', style: 'chain', img: steps.length <= 4 ? it.img : undefined })
}

/** Alan sonu oyunu: verilen üreticileri karıştırır */
export const karma = (...gens: Gen[]): Gen => (rng, g, l, h) => gens[(h.length + Math.floor(rng() * 2)) % gens.length](rng, g, l, h)

/**
 * Model Kur (fen): çizimdeki yuvalara doğru etiketleri yerleştir.
 * sahne: src/games/quiz/modeller.tsx anahtarı; yuvalar: [yuvaKimliği, doğruEtiket][]; celdirici: fazladan etiketler.
 * Seviye 1'de en çok 3 yuva sorulur (kalanlar hazır gelmez, sadece sorulmaz).
 */
export const model = (prompt: string, explain: string, sahne: string, yuvalar: [string, string][], celdirici: string[]): Gen => (rng, _g, l) => {
  const ys = l === 1 && yuvalar.length > 3 ? shuffle(rng, yuvalar).slice(0, 3) : yuvalar
  const ekstra = shuffle(rng, celdirici).slice(0, l === 1 ? 1 : 2)
  return { type: 'model', prompt, explain, sahne, yuvalar: ys.map(([id, dogru]) => ({ id, dogru })), etiketler: [...ys.map(([, d]) => d), ...ekstra] }
}

/**
 * Dinleme metni (kitaptaki karekodlu dinleme/izleme metinleri yerine): metin ekranda yazmaz,
 * sesli okunur; çocuk dinlediğine göre cevaplar. Metin kısa (en çok ~6 cümle) olmalı.
 */
export interface Dinleme {
  t: string
  text: string
  img?: string
  qs: Q[]
}
export const dinle = (...ms: Dinleme[]): Gen => (rng, _g, l, h) => {
  const all = ms.flatMap((m) => m.qs.map((q) => ({ m, q })))
  const it = fresh(rng, all, h, (x) => x.q.q)
  return { ...mkChoice(rng, it.q, l), passage: { title: it.m.t, text: it.m.text, img: it.m.img, dinle: true } }
}
