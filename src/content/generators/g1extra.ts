/**
 * 1. sınıf: EŞLEŞTİRME, SORU–CEVAP (tuş takımı) ve HAFIZA soruları.
 * Kitapların "Eşleştirelim", "Yazalım", "Bulalım" etkinliklerinin oyunlaştırılmış hâli.
 * Türkçe öğeler yine yalnızca öğrenilmiş harflerden oluşur.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { input, match, memory, type Gen } from './helpers'
import { heceler, isAllowed, learnedLetters } from '../letters'
import { upperTR } from '../words'
import { PIC } from './tr1'
import type { Option, ShapeKind } from '../../games/quiz/types'

const OBJ = ['apple', 'strawberry', 'star', 'fish', 'duck', 'balloon', 'flower', 'ball', 'cupcake']
const distinct = (rng: Rng, n: number, lo: number, hi: number) => shuffle(rng, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, n)
const picOk = () => PIC.filter(([w]) => isAllowed(w))

/* ============================ MATEMATİK ============================ */
/** Say ve yaz (soru–cevap) */
export const sayYaz: Gen = (rng, _g, level) => {
  const n = randInt(rng, level === 1 ? 2 : 5, level === 1 ? 9 : level === 2 ? 14 : 20)
  return input({ prompt: 'Kaç tane var? Say ve sayıyı yaz!', visual: { kind: 'objects', img: pick(rng, OBJ), count: n }, answer: String(n), keys: 'digits', explain: `Tek tek sayarız: 1, 2, 3 … ${n}. Rakamla “${n}” yazarız.` })
}

/** Sayı ↔ nesne grubu eşleştir */
export const sayiGrupEsle: Gen = (rng, _g, level) => {
  const nums = distinct(rng, level === 1 ? 3 : 4, 2, level === 1 ? 9 : 12)
  const img = pick(rng, OBJ)
  return match({ prompt: 'Her sayıyı aynı sayıdaki grupla eşleştir!', pairs: nums.map((n) => ({ left: { label: String(n) }, right: { visual: { kind: 'objects' as const, img, count: n } } })), explain: 'Grubu tek tek sayarız ve aynı sayıyı buluruz.' })
}

/** Onluk-birlik ↔ sayı eşleştir */
export const onlukEsle: Gen = (rng) => {
  const nums = distinct(rng, 4, 11, 19)
  return match({ prompt: 'Sayıyı onluk ve birlik hâliyle eşleştir!', pairs: nums.map((n) => ({ left: { label: String(n) }, right: { label: `1 onluk ${n - 10} birlik` } })), explain: '10 birlik 1 onluk eder. 14 = 1 onluk 4 birlik.' })
}
/** Blok → sayı yaz */
export const blokYaz: Gen = (rng) => {
  const n = randInt(rng, 11, 20)
  return input({ prompt: 'Bloklarla gösterilen sayıyı yaz!', visual: { kind: 'blocks', hundreds: 0, tens: n === 20 ? 2 : 1, ones: n === 20 ? 0 : n - 10 }, answer: String(n), keys: 'digits', explain: `Çubuk 1 onluk (10), küpler birliktir: ${n}.` })
}

/** İşlem ↔ sonuç eşleştir / işlem yaz / hafıza */
function ops(rng: Rng, n: number, level: number) {
  const out: { t: string; r: number }[] = []
  const seen = new Set<number>()
  while (out.length < n) {
    const sub = rng() < 0.4
    const a = sub ? randInt(rng, 5, level === 1 ? 10 : 20) : randInt(rng, 1, level === 1 ? 7 : 12)
    const b = sub ? randInt(rng, 1, Math.min(9, a - 1)) : randInt(rng, 1, Math.min(9, (level === 1 ? 10 : 20) - a))
    const r = sub ? a - b : a + b
    if (seen.has(r)) continue
    seen.add(r)
    out.push({ t: `${a} ${sub ? '−' : '+'} ${b}`, r })
  }
  return out
}
export const islemEsle: Gen = (rng, _g, level) => {
  const list = ops(rng, 4, level)
  return match({ prompt: 'Her işlemi sonucuyla eşleştir!', pairs: list.map((o) => ({ left: { label: o.t }, right: { label: String(o.r) } })), explain: list.map((o) => `${o.t} = ${o.r}`).join(' · ') })
}
export const islemYaz: Gen = (rng, _g, level) => {
  const [o] = ops(rng, 1, level)
  return input({ prompt: 'İşlemi yap, sonucu yaz!', visual: { kind: 'equation', text: `${o.t} = ?` }, answer: String(o.r), keys: 'digits', explain: o.t.includes('+') ? `Büyük sayıdan başlayıp ileri sayarız: ${o.t} = ${o.r}.` : `Geriye doğru sayarız: ${o.t} = ${o.r}.` })
}
export const islemHafiza: Gen = (rng, _g, level) => {
  const list = ops(rng, level === 1 ? 3 : 4, level)
  return memory({ prompt: 'Hafıza oyunu: işlemi ve sonucunu eşleştir!', pairs: list.map((o) => ({ a: { label: o.t }, b: { label: String(o.r) } })), explain: list.map((o) => `${o.t} = ${o.r}`).join(' · ') })
}
export const bilinmeyenYaz: Gen = (rng) => {
  const a = randInt(rng, 2, 9)
  const b = randInt(rng, 2, 9)
  const f = pick(rng, [[`? + ${b} = ${a + b}`, a], [`${a} + ? = ${a + b}`, b], [`${a + b} − ? = ${a}`, b]] as [string, number][])
  return input({ prompt: 'Kayıp sayıyı bul ve yaz!', visual: { kind: 'equation', text: f[0] }, answer: String(f[1]), keys: 'digits', explain: 'Toplama ile çıkarma birbirinin tersidir; kayıp sayıyı ters işlemle buluruz.' })
}

/** Ritmik sayma: eksik sayıyı yaz */
export const ritmikYaz: Gen = (rng, _g, level) => {
  const step = pick(rng, level === 1 ? [1, 10] : [1, 2, 5, 10])
  const max = step === 2 || step === 1 ? 20 : 100
  const s0 = step === 1 ? randInt(rng, 1, max - 5) : step * randInt(rng, step === 2 ? 0 : 1, max / step - 5)
  const seq = Array.from({ length: 5 }, (_, i) => s0 + i * step)
  const hole = randInt(rng, 1, 4)
  return input({ prompt: `${step}'er ileri sayıyoruz. Eksik sayıyı yaz!`, visual: { kind: 'sequence', items: seq.map((x, i) => (i === hole ? '?' : x)) }, answer: String(seq[hole]), keys: 'digits', explain: `Kural: her adımda ${step} ekleriz. ${seq.join(', ')}.` })
}

/** Karşılaştırma: kaç fazla? */
export const farkYaz: Gen = (rng) => {
  const a = randInt(rng, 3, 9)
  const b = a + randInt(rng, 1, 5)
  const img = pick(rng, OBJ)
  return input({ prompt: 'Sağdaki grupta soldakinden kaç tane FAZLA var?', visual: { kind: 'compare', left: { img, count: a }, right: { img, count: b } }, answer: String(b - a), keys: 'digits', explain: `Bire bir eşleştiririz: sağda ${b - a} tane eşsiz kalır. ${b} − ${a} = ${b - a}.` })
}

/** Uzunluk: kaç ataş? */
export const atasYaz: Gen = (rng) => {
  const k = randInt(rng, 3, 9)
  return input({ prompt: 'Kurdele kaç ataş uzunluğunda? Say ve yaz!', visual: { kind: 'lengths', items: [{ color: '#2a7fd4', len: k }], unit: { img: 'paperclip', count: [k] } }, answer: String(k), keys: 'digits', explain: `Ataşları baştan, boşluk bırakmadan sayarız: ${k}.` })
}

/** Para: para ↔ değer eşleştir, toplam yaz */
export const paraEsle: Gen = (rng) => {
  const vals = shuffle(rng, [1, 5, 10, 20, 50, 100, 200]).slice(0, 4)
  return match({ prompt: 'Her parayı değeriyle eşleştir!', pairs: vals.map((v) => ({ left: { visual: { kind: 'money' as const, items: [v] } }, right: { label: `${v} TL` } })), explain: 'Paraların üzerindeki sayılar değerlerini gösterir.' })
}
export const paraToplamYaz: Gen = (rng) => {
  const items = shuffle(rng, [5, 10, 10, 20, 20, 50]).slice(0, randInt(rng, 2, 3)).sort((a, b) => b - a)
  const sum = items.reduce((s, x) => s + x, 0)
  return input({ prompt: 'Cüzdanda toplam kaç lira var? Yaz!', visual: { kind: 'money', items }, answer: String(sum), keys: 'digits', unit: 'TL', explain: `${items.join(' + ')} = ${sum} TL.` })
}

/** Geometri: şekil ↔ adı hafıza; nesne ↔ şekil eşleştir */
const SH: [ShapeKind, string][] = [['ucgen', 'Üçgen'], ['kare', 'Kare'], ['dikdortgen', 'Dikdörtgen'], ['cember', 'Çember']]
export const sekilHafiza: Gen = () => memory({ prompt: 'Hafıza oyunu: şekli ve adını eşleştir!', pairs: SH.map(([s, n]) => ({ a: { visual: { kind: 'shape' as const, shape: s, scale: 0.45 } }, b: { label: n } })), explain: 'Üçgen 3, kare ve dikdörtgen 4 köşelidir; çemberin köşesi yoktur.' })
export const nesneSekilEsle: Gen = (rng) => {
  const items = shuffle(rng, [['pizza', 'ucgen'], ['coin', 'cember'], ['book', 'dikdortgen'], ['clock', 'cember'], ['laptop', 'dikdortgen']] as [string, ShapeKind][])
  const used = new Set<string>()
  const pick3 = items.filter(([, s]) => (used.has(s) ? false : (used.add(s), true))).slice(0, 3)
  return match({ prompt: 'Her nesneyi benzediği şekille eşleştir!', pairs: pick3.map(([img, s]) => ({ left: { img }, right: { visual: { kind: 'shape' as const, shape: s, scale: 0.4 } } })), explain: 'Pizza dilimi üçgene, para ve saat çembere, kitap dikdörtgene benzer.' })
}
export const koseYaz: Gen = (rng) => {
  const [s, n] = pick(rng, [['ucgen', 3], ['kare', 4], ['dikdortgen', 4]] as [ShapeKind, number][])
  return input({ prompt: 'Bu şeklin kaç köşesi var? Yaz!', visual: { kind: 'shape', shape: s }, answer: String(n), keys: 'digits', explain: 'Kenarların birleştiği noktalar köşedir. Tek tek sayarız.' })
}

/** Veri: grafikten okuyup yaz */
export const grafikYaz: Gen = (rng) => {
  const cats = shuffle(rng, [['apple', 'Elma'], ['banana', 'Muz'], ['strawberry', 'Çilek'], ['grapes', 'Üzüm']] as [string, string][]).slice(0, 3)
  const counts = cats.map(() => randInt(rng, 2, 9))
  const i = randInt(rng, 0, 2)
  const tally = rng() < 0.5
  const rows = cats.map(([img, label], k) => ({ img, label, count: counts[k] }))
  return input({ prompt: `${cats[i][1]} kaç kez seçilmiş? Yaz!`, visual: tally ? { kind: 'tally', rows } : { kind: 'pictograph', rows }, answer: String(counts[i]), keys: 'digits', explain: tally ? 'Çetelede her 5 çizgi bir demettir; demetleri ve tek çizgileri sayarız.' : 'Satırdaki resimleri tek tek sayarız.' })
}

/* ============================ TÜRKÇE (öğrenilmiş harflerle) ============================ */
/** Büyük ↔ küçük harf eşleştir / hafıza */
export const buyukKucukEsle: Gen = (rng) => {
  const ls = shuffle(rng, learnedLetters().filter((c) => !(c === 'ı' && !learnedLetters().includes('i')))).slice(0, 4)
  return match({ prompt: 'Küçük harfleri büyük hâlleriyle eşleştir!', pairs: ls.map((c) => ({ left: { label: c }, right: { label: upperTR(c) } })), explain: ls.map((c) => `${c} → ${upperTR(c)}`).join(' · ') })
}
export const harfHafiza: Gen = (rng, _g, level) => {
  const ls = shuffle(rng, learnedLetters()).slice(0, level === 1 ? 3 : 4)
  return memory({ prompt: 'Hafıza oyunu: küçük ve büyük harfi eşleştir!', pairs: ls.map((c) => ({ a: { label: c }, b: { label: upperTR(c) } })), explain: 'Her küçük harfin bir büyük hâli vardır.' })
}

/** Resim ↔ kelime eşleştir / hafıza */
export const resimKelimeEsle: Gen = (rng, _g, level) => {
  const words = shuffle(rng, picOk()).slice(0, level === 1 ? 3 : 4)
  if (words.length < 2) return buyukKucukEsle(rng, 1, level, [])
  return match({ prompt: 'Resimleri adlarıyla eşleştir! Kelimeleri oku.', pairs: words.map(([w, img]) => ({ left: { img }, right: { label: w } })), explain: words.map(([w]) => w).join(', ') })
}
export const resimKelimeHafiza: Gen = (rng, _g, level) => {
  const words = shuffle(rng, picOk()).slice(0, level === 1 ? 3 : 4)
  if (words.length < 2) return harfHafiza(rng, 1, level, [])
  return memory({ prompt: 'Hafıza oyunu: resmi ve adını bul!', pairs: words.map(([w, img]) => ({ a: { img } as Option, b: { label: w } })), explain: words.map(([w]) => w).join(', ') })
}

/** Kayıp harfi yaz (harf klavyesi) */
export const kayipHarfYaz: Gen = (rng) => {
  const words = picOk().filter(([w]) => w.length >= 3)
  const [w, img] = pick(rng, words.length ? words : [['lale', 'tulip']])
  const i = randInt(rng, 0, w.length - 1)
  const keys = shuffle(rng, Array.from(new Set([w[i], ...shuffle(rng, learnedLetters()).slice(0, 7)]))).slice(0, 8)
  if (!keys.includes(w[i])) keys[0] = w[i]
  return input({ prompt: 'Eksik harfi klavyeden yaz!', spoken: `${w}. Eksik harfi yaz.`, visual: { kind: 'word', img, word: w, hide: [i] }, answer: w[i], keys: shuffle(rng, keys), explain: `${upperTR(w[0])}${w.slice(1)} kelimesinde eksik harf “${w[i]}”.` })
}

/** Kelimeyi heceleriyle eşleştir */
export const heceEsle: Gen = (rng) => {
  const words = shuffle(rng, picOk().filter(([w]) => heceler(w).length >= 2)).slice(0, 3)
  if (words.length < 2) return buyukKucukEsle(rng, 1, 1, [])
  return match({ prompt: 'Resimleri heceleriyle eşleştir!', pairs: words.map(([w, img]) => ({ left: { img }, right: { label: heceler(w).join(' - ') } })), explain: words.map(([w]) => heceler(w).join('-')).join(' · ') })
}

/** Harf / hece sayısını yaz (DK) */
export const heceSayYaz: Gen = (rng) => {
  const [w, img] = pick(rng, PIC)
  const askHece = rng() < 0.5
  const ans = askHece ? heceler(w).length : w.length
  return input({ prompt: `“${w}” kelimesinde kaç ${askHece ? 'hece' : 'harf'} var? Yaz!`, visual: { kind: 'image', img, size: 120 }, answer: String(ans), keys: 'digits', explain: askHece ? `${heceler(w).join(' - ')} → ${ans} hece.` : `${[...w].join(' - ')} → ${ans} harf.` })
}
