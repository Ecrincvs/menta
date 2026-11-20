/**
 * MATEMATİK YOLU — 1. sınıf Matematik ders kitabının 7 teması, her tema bir "ada":
 * bölüm bölüm sıralı, ayrıntılı etkinlikler + sonda oyun(lar). Kaynak: docs/meb-kitaplar/analiz/matematik-1.md
 * Kitap sınırları: sayılar 0–20 (ritmik sayma 100'e), toplama/çıkarma ≤ 20, alt alta eldesiz/onluk bozmadan,
 * para 1–200 TL (para üstü yok), veri ≤ 14. Her etkinlikte birkaç soru biçimi dönüşümlü gelir.
 */
import { pick, randInt, shuffle } from '../../learning/rng'
import { choice, match, memory, numChoice, order, sort, type Gen } from './helpers'
import type { Option, PopQ, Question, Relation, ShapeKind, TraceQ, Visual } from '../../games/quiz/types'
import type { Level } from '../../learning/mastery'
import { ANIMALS, DY, MASS, OBJ, REFS, REL_TXT, OPP, cokAz, esiniBul, esitlik1, islem1, kacinci, onlukBirlik, para1, ritmikOruntu, sekiller1, tahmin, terazi, uzunluk, veri1, yolBulmaca } from './mat1'
import { problemMix } from './problem1'

export interface Act {
  kind: string
  title: string
  icon: string
  total: number
  gen: Gen
  /** etkinlik başındaki kısa "Öğrenelim" anlatımı */
  ders: string
  points?: string[]
  visual?: Visual
  meb: string
  oyun?: boolean
}
export interface Tema {
  id: string
  no: number
  title: string
  color: string
  dark: string
  icon: string
  acts: Act[]
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1)
const near = (n: number, lo = 0, hi = 20) => [n - 1, n + 1, n + 2, n - 2].filter((x) => x >= lo && x <= hi && x !== n)
/** Bir üreticiden yalnızca istenen biçimdeki soruları al (kitap bölümüne odaklanmak için) */
const only = (gen: Gen, pred: (q: Question) => boolean, level: Level = 2): Gen => (rng, g, _l, h) => {
  let q = gen(rng, g, level, h)
  for (let i = 0; i < 40 && !pred(q); i++) q = gen(rng, g, level, h)
  return q
}
const has = (s: string) => (q: Question) => q.prompt.includes(s)
/** Soru sırasına göre biçim döndür (aynı etkinlikte çeşit) */
const rot = (...gens: Gen[]): Gen => (rng, g, l, h) => gens[h.length % gens.length](rng, g, l, h)

/* ============================ 1. TEMA · NESNELERİN GEOMETRİSİ 1 ============================ */
const posGen = (rels: Relation[]): Gen => (rng, _g, _l, h) => {
  const [aImg, aName] = pick(rng, ANIMALS)
  const ref = pick(rng, REFS.filter((r) => rels.filter((x) => r.rels.includes(x)).length >= 1 && r.rels.filter((x) => rels.includes(x) || OPP[x] && rels.includes(OPP[x]!)).length >= 2))
  const mine = rels.filter((x) => ref.rels.includes(x))
  const rel = pick(rng, mine)
  const side = rel === 'saginda' || rel === 'solunda' ? ' (sana göre)' : ''
  const alts = shuffle(rng, ref.rels.filter((r) => r !== rel && (rels.includes(r) || OPP[rel] === r)))
  const wrongs = alts.length ? alts : shuffle(rng, ref.rels.filter((r) => r !== rel))
  const v = h.length % 3
  if (v === 0)
    return choice(rng, { prompt: `${aName} nerede?${side}`, visual: { kind: 'position', subject: aImg, ref: ref.img, rel }, correct: `${cap(ref.gen)} ${REL_TXT[rel]}`, wrong: wrongs.map((r) => `${cap(ref.gen)} ${REL_TXT[r]}`), max: 3, explain: `${aName}, ${ref.gen} ${REL_TXT[rel]}.${side ? ' Sağ ve sol, resme bakan sana göredir.' : ''}` })
  if (v === 1)
    return choice(rng, { prompt: `Hangi resimde ${aName.toLocaleLowerCase('tr-TR')} ${ref.gen} ${REL_TXT[rel]}?${side}`, correct: { visual: { kind: 'position', subject: aImg, ref: ref.img, rel } }, wrong: wrongs.slice(0, 2).map((r) => ({ visual: { kind: 'position' as const, subject: aImg, ref: ref.img, rel: r } })), max: 3, explain: `${aName} ${ref.gen} ${REL_TXT[rel]} olan resmi buluruz.` })
  const shown = rng() < 0.5 ? rel : wrongs[0]
  return DY(rng, { prompt: `“${aName} ${ref.gen} ${REL_TXT[rel]}.” Resme göre doğru mu?${side}`, truth: shown === rel, visual: { kind: 'position', subject: aImg, ref: ref.img, rel: shown }, explain: `Resimde ${aName.toLocaleLowerCase('tr-TR')} ${ref.gen} ${REL_TXT[shown]}.` })
}
const PAIRS: { a: string; aNom: string; b: string; bGen: string }[] = [
  { a: 'tree', aNom: 'ağaç', b: 'house', bGen: 'evin' },
  { a: 'house', aNom: 'ev', b: 'tree', bGen: 'ağacın' },
  { a: 'car', aNom: 'araba', b: 'tree', bGen: 'ağacın' },
  { a: 'basket', aNom: 'sepet', b: 'house', bGen: 'evin' },
]
const arasinda: Gen = (rng, _g, _l, h) => {
  const [aImg, aName] = pick(rng, ANIMALS)
  const p = pick(rng, PAIRS)
  const v = h.length % 2
  if (v === 0)
    return choice(rng, { prompt: `Hangi resimde ${aName.toLocaleLowerCase('tr-TR')}, ${p.aNom} ile ${p.bGen} arasında?`, correct: { visual: { kind: 'position', subject: aImg, ref: p.a, third: p.b, rel: 'arasinda' } }, wrong: (['onunde', 'ustunde'] as Relation[]).map((r) => ({ visual: { kind: 'position' as const, subject: aImg, ref: p.a, rel: r } })), max: 3, explain: `İki nesnenin ortasında duran, onların arasındadır.` })
  return DY(rng, { prompt: `“${aName}, ${p.aNom} ile ${p.bGen} arasında.” Doğru mu?`, truth: true, visual: { kind: 'position', subject: aImg, ref: p.a, third: p.b, rel: 'arasinda' }, explain: `${aName} iki nesnenin ortasında: arasında.` })
}
const SH: ShapeKind[] = ['ucgen', 'kare', 'dikdortgen', 'daire']
const COL = ['#ff9a2e', '#2ec4c9', '#5bc236', '#ff7aa8', '#9b6ef3', '#ffd23f']
const esEsle: Gen = (rng) => {
  const shapes = shuffle(rng, SH).slice(0, 3)
  const cols = shuffle(rng, COL).slice(0, 3)
  const pairs = shapes.map((s, i) => ({ left: { visual: { kind: 'shape' as const, shape: s, color: cols[i], scale: 0.6 } }, right: { visual: { kind: 'shape' as const, shape: s, color: cols[i], scale: 0.6001 } } }))
  return match({ prompt: 'Eş şekilleri eşleştir!', spoken: 'Rengi, biçimi ve büyüklüğü aynı olan şekilleri eşleştir.', pairs, explain: 'Eş nesnelerin rengi, biçimi ve büyüklüğü aynıdır.' })
}
const T1: Tema = {
  id: 't1', no: 1, title: 'Nesnelerin Geometrisi', color: '#2ec4c9', dark: '#149aa0', icon: 'map',
  acts: [
    { kind: 'ust-alt', title: 'Üstünde mi, Altında mı?', icon: 'umbrella', total: 6, gen: posGen(['ustunde', 'altinda']), meb: 'MAT.1.3.1', ders: 'Bir şeyin üstünde olan yukarıda, altında olan aşağıdadır. Resme dikkatle bak!' },
    { kind: 'on-arka', title: 'Önünde mi, Arkasında mı?', icon: 'house', total: 6, gen: posGen(['onunde', 'arkasinda']), meb: 'MAT.1.3.1', ders: 'Önünde olanı tamamen görürüz; arkasında olanın bir kısmı saklanır.' },
    { kind: 'ic-dis', title: 'İçinde mi, Dışında mı?', icon: 'basket', total: 6, gen: posGen(['icinde', 'disinda']), meb: 'MAT.1.3.1', ders: 'Sepetin içindeki sepette durur; dışındaki sepetin yanında durur.' },
    { kind: 'sag-sol', title: 'Sağında mı, Solunda mı?', icon: 'hand', total: 6, gen: posGen(['saginda', 'solunda']), meb: 'MAT.1.3.1', ders: 'Sağ ve sol, resme bakan SANA göredir. Kalem tuttuğun el çoğunlukla sağ elindir.' },
    { kind: 'arasinda', title: 'Arasında', icon: 'tree', total: 5, gen: arasinda, meb: 'MAT.1.3.1', ders: 'İki nesnenin ortasında duran şey, o iki nesnenin arasındadır.' },
    { kind: 'yol-kisa', title: 'Kareli Yol', icon: 'map', total: 6, gen: (r, g, _l, h) => yolBulmaca(r, g, 1, h), meb: 'MAT.1.3.1', ders: 'Oklar yönü, sayı kaç kare gideceğimizi gösterir: “2 kare sağa”.' },
    { kind: 'yol-uzun', title: 'Uzun Yol', icon: 'compass', total: 6, gen: (r, g, _l, h) => yolBulmaca(r, g, 3, h), meb: 'MAT.1.3.1', ders: 'Yönergeleri sırayla takip et. Her adımda nerede olduğunu parmağınla göster.' },
    { kind: 'es-bul', title: 'Eşini Bul', icon: 'puzzle', total: 6, gen: only(esiniBul, has('eşi hangisi'), 1), meb: 'MAT.1.3.2', ders: 'Eş nesnelerin rengi, biçimi ve büyüklüğü aynıdır.' },
    { kind: 'es-yok', title: 'Eşi Olmayan', icon: 'magnifier', total: 6, gen: only(esiniBul, has('Eşi olmayan'), 3), meb: 'MAT.1.3.2', ders: 'Gruptaki farklı olanı bul: rengi, biçimi ya da büyüklüğü farklı olabilir.' },
    { kind: 'es-esle', title: 'Eşleri Eşleştir', icon: 'link', total: 5, gen: esEsle, meb: 'MAT.1.3.2', ders: 'Her şeklin eşini bul ve eşleştir.' },
    { kind: 'oyun', title: 'Hazine Haritası', icon: 'map', total: 4, gen: (r, g, _l, h) => yolBulmaca(r, g, 3, h), meb: 'MAT.1.3.1', ders: 'Hazine avı başlıyor! Yönergeleri takip et, hazineye ulaş.', oyun: true },
  ],
}

/* ============================ 2. TEMA · SAYILAR VE NİCELİKLER 1 ============================ */
const sayGen = (lo: number, hi: number): Gen => (rng, _g, _l, h) => {
  const n = randInt(rng, lo, hi)
  const img = pick(rng, OBJ)
  const v = h.length % 3
  if (v === 0) return numChoice(rng, { prompt: 'Kaç tane var? Sayalım!', answer: n, visual: { kind: 'objects', img, count: n }, near: near(n, Math.max(0, lo - 1)), explain: `Tek tek sayarız: ${Array.from({ length: Math.min(n, 5) }, (_, i) => i + 1).join(', ')}${n > 5 ? ` … ${n}` : ''}.` })
  if (v === 1) {
    const others = shuffle(rng, near(n, Math.max(1, lo - 1), hi + 2)).slice(0, 2)
    return choice(rng, { prompt: `Hangi grupta ${n} tane var?`, correct: { visual: { kind: 'objects', img, count: n } }, wrong: others.map((c) => ({ visual: { kind: 'objects' as const, img, count: c } })), max: 3, explain: `Her grubu sayarız; ${n} tane olanı buluruz.` })
  }
  const nums = shuffle(rng, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, 3)
  if (nums.length < 2) nums.push(hi + 1)
  return match({ prompt: 'Sayıyı nesne grubuyla eşleştir!', spoken: 'Her sayıyı aynı sayıda nesne olan grupla eşleştir.', pairs: nums.map((k) => ({ left: { label: String(k) }, right: { visual: { kind: 'objects' as const, img, count: k } } })), explain: 'Grupları sayıp sayılarla eşleştiririz.' })
}
const sifir: Gen = (rng, _g, _l, h) => {
  const img = pick(rng, OBJ)
  const v = h.length % 3
  if (v === 0) return numChoice(rng, { prompt: 'Tabakta kaç tane var?', answer: 0, visual: { kind: 'image', img: 'plate', size: 140 }, near: [1, 2], explain: 'Hiç yok demek 0 (sıfır) demektir.' })
  if (v === 1) return choice(rng, { prompt: 'Hangisinde HİÇ yok?', correct: { visual: { kind: 'image', img: 'plate', size: 90 } }, wrong: [1, 2].map((c) => ({ visual: { kind: 'objects' as const, img, count: c } })), max: 3, explain: 'Boş tabakta hiç yok: 0.' })
  const k = randInt(rng, 1, 4)
  return numChoice(rng, { prompt: `${k} elmanın ${k} tanesi de yenildi. Kaç elma kaldı?`, answer: 0, visual: { kind: 'objects', img: 'apple', count: k }, near: [1, k], explain: `${k} − ${k} = 0. Hiç kalmadı.` })
}
const rakamYaz: Gen = (_rng, _g, _l, h) => {
  const order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const d = String(order[h.length % order.length])
  const q: TraceQ = { type: 'trace', letter: d, prompt: `${d} rakamını parmağınla yaz!`, spoken: `${d} rakamını parmağınla yaz. Yukarıdan başla.`, explain: 'Rakamları yukarıdan başlayarak yazarız.' }
  return q
}
const onceSonra: Gen = (rng, _g, _l, h) => {
  const n = randInt(rng, 2, 19)
  const v = h.length % 3
  if (v === 0) return numChoice(rng, { prompt: `${n} sayısından hemen SONRA hangi sayı gelir?`, answer: n + 1, visual: { kind: 'sequence', items: [n, '?'] }, near: [n - 1, n + 2, n], explain: `Sayarken ${n}'den sonra ${n + 1} gelir. Sonraki sayı 1 fazladır.` })
  if (v === 1) return numChoice(rng, { prompt: `${n} sayısından hemen ÖNCE hangi sayı gelir?`, answer: n - 1, visual: { kind: 'sequence', items: ['?', n] }, near: [n + 1, n - 2, n], explain: `Önceki sayı 1 eksiktir: ${n - 1}.` })
  return numChoice(rng, { prompt: 'İki sayının arasındaki sayı hangisi?', answer: n, visual: { kind: 'sequence', items: [n - 1, '?', n + 1] }, near: [n - 1, n + 1, n + 2], explain: `${n - 1}, ${n}, ${n + 1}: arada ${n} var.` })
}
const buyukKucuk: Gen = (rng, _g, _l, h) => {
  const v = h.length % 3
  const [a, b, c] = shuffle(rng, Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 3)
  if (v === 2) {
    const s = [a, b, c].sort((x, y) => x - y).map(String)
    return order({ prompt: 'Sayıları KÜÇÜKTEN BÜYÜĞE sırala!', pieces: s, joiner: ' ', style: 'chain', explain: `Küçükten büyüğe: ${s.join(', ')}.` })
  }
  const big = v === 0
  const t = big ? Math.max(a, b, c) : Math.min(a, b, c)
  return choice(rng, { prompt: `Hangisi en ${big ? 'BÜYÜK' : 'KÜÇÜK'} sayı?`, correct: String(t), wrong: [a, b, c].filter((x) => x !== t).map(String), max: 3, explain: `Sayarken en ${big ? 'sonra' : 'önce'} gelen sayı en ${big ? 'büyüktür' : 'küçüktür'}: ${t}.` })
}
const ritmik = (step: number, back = false): Gen => (rng, _g, _l, h) => {
  const len = 5
  const max = step === 1 && !back ? 100 : step === 2 || back ? 20 : 100
  let start: number
  if (back) start = randInt(rng, step * (len - 1), 20)
  else if (step === 1) start = randInt(rng, 1, Math.min(max, h.length < 3 ? 20 : 100) - len + 1)
  else start = step * randInt(rng, step === 2 ? 0 : 1, Math.floor(max / step) - len + 1)
  const seq = Array.from({ length: len }, (_, i) => (back ? start - i * step : start + i * step))
  const hole = h.length % 2 === 0 ? len - 1 : randInt(rng, 1, len - 2)
  const ans = seq[hole]
  const word = step === 1 ? 'birer' : step === 2 ? 'ikişer' : step === 5 ? 'beşer' : 'onar'
  return numChoice(rng, { prompt: `${back ? 'Geriye' : 'İleriye'} ${word} sayalım: ? yerine hangi sayı gelir?`, visual: { kind: 'sequence', items: seq.map((x, i) => (i === hole ? '?' : x)) }, answer: ans, near: [ans + 1, ans - 1, back ? ans - step : ans + step].filter((x) => x >= 0 && x !== ans), explain: `Kural: her adımda ${step} ${back ? 'azalır' : 'artar'}. ${seq.join(', ')}.` })
}
const oruntuSayi: Gen = (rng, _g, _l, h) => {
  if (h.length % 2 === 0) {
    const n = randInt(rng, 2, 19)
    const m = randInt(rng, 1, 20)
    const seq = [n, m, n, m, n, '?']
    return numChoice(rng, { prompt: 'Sayı örüntüsünde ? yerine hangi sayı gelir?', visual: { kind: 'sequence', items: seq }, answer: m, near: [n, m + 1, m - 1].filter((x) => x >= 0 && x !== m), explain: `Kural: ${n}, ${m} tekrar ediyor.` })
  }
  const step = pick(rng, [2, 3])
  const s = randInt(rng, 0, 6)
  const seq = [s, s + step, s + 2 * step, s + 3 * step]
  return numChoice(rng, { prompt: `Örüntü ${step}'er artıyor. Sıradaki sayı kaç?`, visual: { kind: 'sequence', items: [...seq, '?'] }, answer: s + 4 * step, near: [s + 4 * step + 1, s + 4 * step - 1, s + 3 * step + 1], explain: `${seq.join(', ')} ve ${s + 4 * step}: her seferinde ${step} ekleriz.` })
}
const sayiBalon: Gen = (rng, _g, _l, h) => {
  const mode = h.length % 3
  const pool = shuffle(rng, Array.from({ length: 20 }, (_, i) => i + 1))
  const rule = mode === 0 ? (x: number) => x > 10 : mode === 1 ? (x: number) => x < 5 : (x: number) => x % 2 === 0
  const hitsAll = pool.filter(rule)
  const miss = pool.filter((x) => !rule(x))
  const items = shuffle(rng, [...hitsAll.slice(0, 4), ...miss.slice(0, 6)]).map(String)
  const q: PopQ = { type: 'pop', target: '', hits: hitsAll.map(String), items, need: 4, prompt: mode === 0 ? "10'dan BÜYÜK sayıları patlat!" : mode === 1 ? "5'ten KÜÇÜK sayıları patlat!" : 'İkişer sayarken söylediğimiz sayıları patlat!', explain: mode === 2 ? 'İkişer sayma: 2, 4, 6, 8, 10 …' : 'Sayıları karşılaştırarak bulduk!' }
  return q
}
const sayiHafiza: Gen = (rng) => {
  const nums = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
  const img = pick(rng, OBJ)
  return memory({ prompt: 'Sayının nesne grubunu bul!', spoken: 'Kartları çevir. Her sayıyı aynı sayıda nesne olan kartla eşleştir.', pairs: nums.map((n) => ({ a: { label: String(n) }, b: { visual: { kind: 'objects' as const, img, count: n } } })), explain: 'Harika hafıza!' })
}
const T2: Tema = {
  id: 't2', no: 2, title: 'Sayılar ve Nicelikler', color: '#ff9a2e', dark: '#d8670b', icon: 'numbers',
  acts: [
    { kind: 'say-1-5', title: "1'den 5'e Sayalım", icon: 'apple', total: 6, gen: sayGen(1, 5), meb: 'MAT.1.1.1', ders: 'Nesneleri tek tek, parmağınla göstererek say. Son söylediğin sayı, kaç tane olduğunu söyler.' },
    { kind: 'say-6-9', title: "6'dan 9'a Sayalım", icon: 'strawberry', total: 6, gen: sayGen(6, 9), meb: 'MAT.1.1.1', ders: 'Saydıklarını ayırırsan hiçbirini iki kez saymazsın.' },
    { kind: 'sifir', title: 'Sıfır: Hiç Yok', icon: 'plate', total: 5, gen: sifir, meb: 'MAT.1.1.1', ders: 'Hiç yoksa 0 (sıfır) deriz. 0 da bir rakamdır.' },
    { kind: 'rakam-yaz', title: 'Rakamları Yazalım', icon: 'pencil', total: 10, gen: rakamYaz, meb: 'MAT.1.1.1', ders: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9: bunlar 10 rakamımızdır. Parmağınla yazalım!', visual: { kind: 'sequence', items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } },
    { kind: 'say-10-20', title: "10'dan 20'ye", icon: 'star', total: 6, gen: sayGen(10, 20), meb: 'MAT.1.1.1', ders: '10’dan sonra 11, 12, 13 … 20 gelir. 14’ü 1 ve 4 rakamlarıyla yazarız.' },
    { kind: 'onluk', title: 'Onluk ve Birlik', icon: 'abacus', total: 6, gen: (r, g, _l, h) => onlukBirlik(r, g, 3, h), meb: 'MAT.1.1.2', ders: '10 birlik bir araya gelince 1 onluk olur. 13 = 1 onluk 3 birlik.', visual: { kind: 'blocks', hundreds: 0, tens: 1, ones: 3 } },
    { kind: 'once-sonra', title: 'Önce ve Sonra', icon: 'train', total: 6, gen: onceSonra, meb: 'MAT.1.1.1', ders: 'Bir sayıdan hemen sonra gelen sayı 1 fazladır, hemen önce gelen sayı 1 eksiktir.' },
    { kind: 'buyuk-kucuk', title: 'Büyük mü, Küçük mü?', icon: 'balance', total: 6, gen: buyukKucuk, meb: 'MAT.1.1.4', ders: 'Sayarken sonra gelen sayı daha büyüktür.' },
    { kind: 'sira', title: 'Kaçıncı?', icon: 'medal', total: 6, gen: (r, g, _l, h) => kacinci(r, g, ((h.length % 3) + 1) as Level, h), meb: 'MAT.1.1.3', ders: 'Sıra sayıları “1., 2., 3.” diye yazılır: birinci, ikinci, üçüncü.' },
    { kind: 'cok-az', title: 'Çok mu, Az mı?', icon: 'balance', total: 6, gen: (r, g, _l, h) => cokAz(r, g, 2, h), meb: 'MAT.1.1.4', ders: 'Grupları bire bir eşleştir: eşi kalmayanlar hangi taraftaysa o grup daha çoktur.' },
    { kind: 'ritmik-1', title: 'Birer Sayalım', icon: 'walking', total: 6, gen: ritmik(1), meb: 'MAT.1.1.5', ders: 'Birer sayarken her seferinde 1 ekleriz: 1, 2, 3, 4 …' },
    { kind: 'ritmik-2', title: 'İkişer Sayalım', icon: 'rabbit', total: 6, gen: ritmik(2), meb: 'MAT.1.1.5', ders: 'İkişer sayarken birini atlarız: 2, 4, 6, 8, 10 …' },
    { kind: 'ritmik-5', title: 'Beşer Sayalım', icon: 'hand', total: 6, gen: ritmik(5), meb: 'MAT.1.1.5', ders: 'Beşer sayma: 5, 10, 15, 20 … Bir elimizde 5 parmak var!' },
    { kind: 'ritmik-10', title: 'Onar Sayalım', icon: 'numbers', total: 6, gen: ritmik(10), meb: 'MAT.1.1.5', ders: 'Onar sayma: 10, 20, 30 … 100.' },
    { kind: 'geri', title: 'Geriye Sayalım', icon: 'rocket', total: 6, gen: rot(ritmik(1, true), ritmik(2, true)), meb: 'MAT.1.1.5', ders: 'Geriye sayarken her seferinde azaltırız: 10, 9, 8 … Roket kalkışı gibi!' },
    { kind: 'oruntu-sekil', title: 'Şekil Örüntüsü', icon: 'star', total: 6, gen: only(ritmikOruntu, has('Örüntüde'), 3), meb: 'MAT.1.1.6', ders: 'Her örüntünün bir kuralı vardır. Neyin tekrar ettiğini bul!' },
    { kind: 'oruntu-sayi', title: 'Sayı Örüntüsü', icon: 'sparkles', total: 6, gen: oruntuSayi, meb: 'MAT.1.1.6', ders: 'Sayı örüntüleri de bir kurala göre ilerler: tekrar edebilir ya da her seferinde artabilir.' },
    { kind: 'tahmin', title: 'Tahmin Et', icon: 'target', total: 6, gen: (r, g, _l, h) => tahmin(r, g, ((h.length % 2) + 1) as Level, h), meb: 'MAT.1.1.7', ders: 'Önce saymadan tahmin et, sonra sayıp tahminini kontrol et.' },
    { kind: 'oyun', title: 'Sayı Balonları', icon: 'balloon', total: 3, gen: sayiBalon, meb: 'MAT.1.1.4', ders: 'Kurala uyan sayıların balonlarını patlat!', oyun: true },
    { kind: 'oyun2', title: 'Sayı Hafızası', icon: 'puzzle', total: 2, gen: sayiHafiza, meb: 'MAT.1.1.1', ders: 'Kartları çevir, sayıyı nesne grubuyla eşleştir!', oyun: true },
  ],
}

/* ============================ 3. TEMA · ÖLÇME ============================ */
const BARC = ['#e8463c', '#2a7fd4', '#5bc236', '#ffb020']
const uzunKisa: Gen = (rng) => {
  const [a, b] = shuffle(rng, [3, 4, 5, 6, 7, 8, 9]).slice(0, 2)
  const longQ = rng() < 0.5
  const ans = (longQ ? a > b : a < b) ? 'A' : 'B'
  return choice(rng, { prompt: `Hangisi daha ${longQ ? 'UZUN' : 'KISA'}?`, visual: { kind: 'lengths', items: [{ color: BARC[0], len: a, label: 'A' }, { color: BARC[1], len: b, label: 'B' }] }, correct: ans, wrong: [ans === 'A' ? 'B' : 'A'], max: 2, explain: 'Başlangıçları aynı hizada olan çubukları karşılaştırırız: daha ileri uzanan daha uzundur.' })
}
const enAgir: Gen = (rng, _g, _l, h) => {
  const three = shuffle(rng, MASS.filter((m) => !['watermelon', 'apple', 'strawberry'].includes(m[0]))).filter((x, i, arr) => arr.findIndex((y) => y[2] === x[2]) === i).slice(0, 3)
  const heavy = h.length % 2 === 0
  const t = three.reduce((m, x) => ((heavy ? x[2] > m[2] : x[2] < m[2]) ? x : m))
  return choice(rng, { prompt: `Hangisi EN ${heavy ? 'AĞIR' : 'HAFİF'}?`, correct: { img: t[0], label: t[1] }, wrong: three.filter((x) => x !== t).map((x) => ({ img: x[0], label: x[1] })), max: 3, explain: `${t[1]} bu üçü arasında en ${heavy ? 'ağır' : 'hafif'} olanıdır.` })
}
const T3: Tema = {
  id: 't3', no: 3, title: 'Ölçme', color: '#5bc236', dark: '#3a8f1d', icon: 'ruler',
  acts: [
    { kind: 'uzun-kisa', title: 'Uzun mu, Kısa mı?', icon: 'ruler', total: 6, gen: uzunKisa, meb: 'MAT.1.1.8', ders: 'Karşılaştırırken nesneleri aynı yerden başlatırız.' },
    { kind: 'en-uzun', title: 'En Uzun, En Kısa', icon: 'pencil', total: 6, gen: only(uzunluk, has('En '), 3), meb: 'MAT.1.1.8', ders: 'Uzun – daha uzun – en uzun; kısa – daha kısa – en kısa.' },
    { kind: 'sirala', title: 'Boya Göre Sırala', icon: 'chart', total: 5, gen: only(uzunluk, has('sırala'), 3), meb: 'MAT.1.1.8', ders: 'En kısadan en uzuna doğru sıralayalım.' },
    { kind: 'atas', title: 'Ataşla Ölç', icon: 'paperclip', total: 6, gen: only(uzunluk, has('ataş'), 3), meb: 'MAT.1.1.8', ders: 'Ölçerken baştan başla ve aralarında boşluk bırakma.' },
    { kind: 'birim', title: 'Hangi Birimle?', icon: 'hand', total: 5, gen: only(uzunluk, has('birim'), 3), meb: 'MAT.1.1.8', ders: 'Küçük şeyleri parmakla, orta büyüklükteki şeyleri karışla, uzun mesafeleri adımla ölçeriz.' },
    { kind: 'agir-hafif', title: 'Ağır mı, Hafif mi?', icon: 'balance', total: 6, gen: only(terazi, has('AĞIR')), meb: 'MAT.1.1.8', ders: 'Eşit kollu terazide aşağıda kalan kefe daha ağırdır.' },
    { kind: 'denge', title: 'Terazi Dengede', icon: 'balance', total: 6, gen: only(terazi, has('dengede')), meb: 'MAT.1.1.8', ders: 'Kefeler aynı hizadaysa terazi dengededir: iki taraf eşit ağırlıktadır.' },
    { kind: 'en-agir', title: 'En Ağır, En Hafif', icon: 'elephant', total: 6, gen: enAgir, meb: 'MAT.1.1.8', ders: 'Ağır – daha ağır – en ağır; hafif – daha hafif – en hafif.' },
    { kind: 'oyun', title: 'Terazi Oyunu', icon: 'balance', total: 4, gen: rot(only(terazi, has('AĞIR')), only(esitlik1, has('Terazinin')), only(terazi, has('dengede'))), meb: 'MAT.1.1.8', ders: 'Teraziyi dengele, ağır olanı bul!', oyun: true },
  ],
}

/* ============================ 4. TEMA · İŞLEMLER ============================ */
const toplamaNesne: Gen = (rng) => {
  const img = pick(rng, OBJ)
  const a = randInt(rng, 1, 6)
  const b = randInt(rng, 1, Math.min(6, 10 - a))
  return numChoice(rng, { prompt: 'İki grubu bir araya getirelim. Hepsi kaç tane?', visual: { kind: 'compare', left: { img, count: a }, right: { img, count: b } }, answer: a + b, near: near(a + b, 1), explain: `${a} ile ${b} bir araya gelince ${a + b} olur: ${a} + ${b} = ${a + b}. Büyük sayıdan başlayıp ileri say!` })
}
const toplama = (max: number): Gen => (rng, _g, _l, h) => {
  const a = randInt(rng, 1, max - 1)
  const b = randInt(rng, 1, Math.min(9, max - a))
  const r = a + b
  if (h.length % 3 === 2) return numChoice(rng, { prompt: `${a}'in ${b} fazlası kaçtır?`.replace(/(\d)'in/, (_, d) => `${d}'${['1', '5', '8'].includes(d) ? 'in' : ['2', '7'].includes(d) ? 'nin' : ['3', '4'].includes(d) ? 'ün' : d === '6' ? 'nın' : d === '9' ? 'un' : 'ın'}`), answer: r, near: near(r, 1), explain: `${a} + ${b} = ${r}.` })
  return numChoice(rng, { prompt: 'Toplama işlemini yap!', visual: { kind: 'equation', text: `${a} + ${b} = ?` }, answer: r, near: near(r, 1).concat([Math.abs(a - b)]).filter((x) => x !== r), explain: `Büyük sayıdan başlayıp küçük sayı kadar ileri sayarız: ${Math.max(a, b)}, … ${r}.` })
}
const cikarmaNesne: Gen = (rng) => {
  const img = pick(rng, ['bird', 'balloon', 'apple', 'fish', 'duck', 'cupcake'])
  const a = randInt(rng, 4, 10)
  const b = randInt(rng, 1, a - 1)
  const verb: Record<string, string> = { bird: 'uçup gitti', balloon: 'patladı', apple: 'yenildi', fish: 'yüzüp gitti', duck: 'göle girdi', cupcake: 'yenildi' }
  return numChoice(rng, { prompt: `Burada ${a} tane var. ${b} tanesi ${verb[img]}. Kaç tane kaldı?`, visual: { kind: 'objects', img, count: a }, answer: a - b, near: near(a - b, 0).concat([a + b]).filter((x) => x !== a - b), explain: `Azaldı, çıkarma yaparız: ${a} − ${b} = ${a - b}. “${a}'dan ${b} çıktı, ${a - b} kaldı.”`.replace(/(\d)'dan/, (_, d) => `${d}'${['1', '2', '7', '8'].includes(d) ? 'den' : ['3', '4', '5'].includes(d) ? 'ten' : d === '6' ? 'dan' : d === '9' ? 'dan' : 'dan'}`) })
}
const cikarma = (max: number): Gen => (rng, _g, _l, h) => {
  const a = randInt(rng, max === 10 ? 3 : 11, max)
  const b = randInt(rng, 1, Math.min(9, a - (max === 10 ? 0 : 1)))
  const r = a - b
  if (h.length % 3 === 2) return numChoice(rng, { prompt: `${a} ile ${b} sayılarının FARKI kaçtır?`, answer: r, near: near(r).concat([a + b]).filter((x) => x !== r && x <= 20), explain: `Fark çıkarma işlemiyle bulunur: ${a} − ${b} = ${r}.` })
  return numChoice(rng, { prompt: 'Çıkarma işlemini yap!', visual: { kind: 'equation', text: `${a} − ${b} = ?` }, answer: r, near: near(r).concat([a + b]).filter((x) => x !== r && x <= 20), explain: `${a}'den geriye doğru ${b} sayarız: ${r}.`.replace(/(\d)'den/, (_, d) => `${d}'${['3', '4', '5'].includes(d) ? 'ten' : ['6', '9', '0'].includes(d) ? 'dan' : 'den'}`) })
}
const sifirEtkisi: Gen = (rng, _g, _l, h) => {
  const a = randInt(rng, 2, 20)
  const f = ([[`${a} + 0`, a], [`${a} − 0`, a], [`${a} − ${a}`, 0], [`0 + ${a}`, a]] as [string, number][])[h.length % 4]
  return numChoice(rng, { prompt: 'Sonuç kaç?', visual: { kind: 'equation', text: `${f[0]} = ?` }, answer: f[1], near: [f[1] + 1, f[1] === 0 ? a : 0].filter((x) => x !== f[1]), explain: f[1] === 0 ? 'Bir sayıdan kendisini çıkarırsak sonuç 0 olur.' : 'Bir sayıya 0 eklersek ya da 0 çıkarırsak sayı değişmez.' })
}
const onaTamamla: Gen = (rng, _g, _l, h) => {
  if (h.length % 2 === 0) {
    const a = randInt(rng, 1, 9)
    return numChoice(rng, { prompt: `${a} + ? = 10`, visual: { kind: 'equation', text: `${a} + ? = 10` }, answer: 10 - a, near: near(10 - a, 0, 10), explain: `${a}'dan 10'a kadar ileri sayarız: ${10 - a} adım. ${a} + ${10 - a} = 10.`.replace(/(\d)'dan/, (_, d) => `${d}'${['1', '2', '7', '8'].includes(d) ? 'den' : ['3', '4', '5'].includes(d) ? 'ten' : 'dan'}`) })
  }
  const a = randInt(rng, 6, 9)
  const b = randInt(rng, 11 - a, 9)
  return numChoice(rng, { prompt: `10'a tamamlayarak yap: ${a} + ${b} = ?`, visual: { kind: 'equation', text: `${a} + ${b} = ?` }, answer: a + b, near: near(a + b, 1).concat([a + b - 10]).filter((x) => x !== a + b), explain: `${a} + ${10 - a} = 10, kalan ${b - (10 - a)}: 10 + ${b - (10 - a)} = ${a + b}.` })
}
const zihinden: Gen = (rng, _g, _l, h) => {
  const a = randInt(rng, 1, 9)
  if (h.length % 2 === 0) return numChoice(rng, { prompt: `İkiz toplama: ${a} + ${a} = ?`, visual: { kind: 'equation', text: `${a} + ${a} = ?` }, answer: 2 * a, near: near(2 * a, 1), explain: `Aynı sayıyı iki kez toplamak ikişer saymak gibidir: ${a} + ${a} = ${2 * a}.` })
  const b = Math.min(10, a + 1)
  return numChoice(rng, { prompt: `${a} + ${a} = ${2 * a} biliyorsun. Peki ${a} + ${b} = ?`, visual: { kind: 'equation', text: `${a} + ${b} = ?` }, answer: a + b, near: near(a + b, 1), explain: `${a} + ${a} = ${2 * a}; bir fazlası: ${a + b}.` })
}
const aile2: Gen = (rng) => {
  const a = randInt(rng, 2, 8)
  const b = randInt(rng, 2, 9)
  const c = a + b
  return numChoice(rng, { prompt: `${a} + ${b} = ${c} ise ${c} − ${b} = ?`, visual: { kind: 'equation', text: `${c} − ${b} = ?` }, answer: a, near: near(a, 1).concat([c]).filter((x) => x !== a), explain: `Toplama ve çıkarma birbirinin tersidir: ${c} − ${b} = ${a}.` })
}
const EXPR10 = ['1 + 9', '2 + 8', '3 + 7', '4 + 6', '5 + 5', '6 + 4', '7 + 3', '8 + 2', '12 − 2', '15 − 5', '10 + 0', '11 − 1']
const NOT10 = ['2 + 6', '3 + 5', '4 + 4', '6 + 6', '7 + 2', '9 − 1', '12 − 1', '5 + 4', '3 + 3', '8 + 3', '13 − 2', '6 + 2']
const islemBalon: Gen = (rng) => {
  const hits = shuffle(rng, EXPR10).slice(0, 4)
  const items = shuffle(rng, [...hits, ...shuffle(rng, NOT10).slice(0, 5)])
  const q: PopQ = { type: 'pop', target: '10', hits, items, need: 4, prompt: 'Sonucu 10 olan işlemleri patlat!', spoken: 'Sonucu on olan işlemlerin balonlarını patlat!', explain: `Sonucu 10 olanlar: ${hits.join(', ')}.` }
  return q
}
const islemHafiza: Gen = (rng) => {
  const res = shuffle(rng, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4)
  return memory({ prompt: 'İşlemi sonucuyla eşleştir!', spoken: 'Kartları çevir. Her işlemi sonucuyla eşleştir.', pairs: res.map((r) => { const a = randInt(rng, 1, r - 1); return { a: { label: `${a} + ${r - a}` }, b: { label: String(r) } } }), explain: 'Harika hafıza!' })
}
const T4: Tema = {
  id: 't4', no: 4, title: 'Toplama ve Çıkarma', color: '#9b6ef3', dark: '#6b43c4', icon: 'abacus',
  acts: [
    { kind: 'artma-azalma', title: 'Artma mı, Azalma mı?', icon: 'chart', total: 6, gen: only(islem1, has('artma mı'), 1), meb: 'MAT.1.2.1', ders: 'Almak, eklemek, gelmek sayıyı ARTIRIR. Vermek, yemek, gitmek sayıyı AZALTIR.' },
    { kind: 'toplama-nesne', title: 'Nesnelerle Toplama', icon: 'apple', total: 6, gen: toplamaNesne, meb: 'MAT.1.2.1', ders: 'Toplama, grupları bir araya getirmektir. “3 artı 2 eşittir 5.”', visual: { kind: 'equation', text: '3 + 2 = 5' } },
    { kind: 'toplama-10', title: "10'a Kadar Toplama", icon: 'hand', total: 6, gen: toplama(10), meb: 'MAT.1.2.1', ders: 'Büyük sayıdan başla, küçük sayı kadar ileri say.' },
    { kind: 'toplama-20', title: "20'ye Kadar Toplama", icon: 'star', total: 6, gen: toplama(20), meb: 'MAT.1.2.1', ders: 'Toplananların yeri değişse de toplam değişmez: 3 + 5 = 5 + 3.' },
    { kind: 'cikarma-nesne', title: 'Nesnelerle Çıkarma', icon: 'bird', total: 6, gen: cikarmaNesne, meb: 'MAT.1.2.1', ders: 'Çıkarma, bir gruptan ayırmak, azaltmaktır. “8’den 5 çıktı, 3 kaldı.”' },
    { kind: 'cikarma-10', title: "10'dan Çıkarma", icon: 'balloon', total: 6, gen: cikarma(10), meb: 'MAT.1.2.1', ders: 'Büyük sayıdan geriye doğru say.' },
    { kind: 'cikarma-20', title: "20'ye Kadar Çıkarma", icon: 'rocket', total: 6, gen: cikarma(20), meb: 'MAT.1.2.1', ders: 'Çıkarmanın sonucuna FARK denir.' },
    { kind: 'sifir', title: 'Sıfırın Etkisi', icon: 'plate', total: 4, gen: sifirEtkisi, meb: 'MAT.1.2.1', ders: 'Bir sayıya 0 eklemek ya da çıkarmak sayıyı değiştirmez. Bir sayıdan kendisini çıkarırsak 0 kalır.' },
    { kind: 'ona-tamamla', title: "10'a Tamamla", icon: 'target', total: 6, gen: onaTamamla, meb: 'MAT.1.2.2', ders: '10’u oluşturan ikililer: 1 ve 9, 2 ve 8, 3 ve 7, 4 ve 6, 5 ve 5. Önce 10’a tamamla, sonra kalanı ekle.' },
    { kind: 'alt-alta', title: 'Alt Alta İşlem', icon: 'memo', total: 6, gen: only(islem1, has('Alt alta'), 2), meb: 'MAT.1.2.1', ders: 'Alt alta işlemde önce birlikler, sonra onluklar işlenir.' },
    { kind: 'zihinden', title: 'Zihinden İşlem', icon: 'bulb', total: 6, gen: zihinden, meb: 'MAT.1.2.2', ders: 'İkiz toplamaları bilirsen (3 + 3, 4 + 4) yakınlarını da kolayca bulursun.' },
    { kind: 'tahmin', title: 'Sonucu Tahmin Et', icon: 'target', total: 5, gen: only(islem1, has('EN YAKIN tahmin'), 3), meb: 'MAT.1.2.2', ders: 'Önce sonucu tahmin et, sonra işlemi yap ve karşılaştır.' },
    { kind: 'esitlik', title: 'Denge Terazisi', icon: 'balance', total: 6, gen: only(esitlik1, has('Terazinin')), meb: 'MAT.1.2.3', ders: 'Farklı işlemler aynı sonucu verebilir: 2 + 6 = 4 + 4.' },
    { kind: 'eksik-sayi', title: 'Eksik Sayı', icon: 'puzzle', total: 6, gen: only(esitlik1, has('Verilmeyen')), meb: 'MAT.1.2.4', ders: 'Eksik sayıyı bulmak için ters işlemi kullanırız.' },
    { kind: 'islem-ailesi', title: 'İşlem Ailesi', icon: 'house', total: 6, gen: rot(aile2, only(esitlik1, has('YAZILAMAZ'))), meb: 'MAT.1.2.4', ders: 'Toplama ve çıkarma birbirinin tersidir: 3 + 7 = 10, 10 − 7 = 3.' },
    { kind: 'problem', title: 'Problem Çözme', icon: 'testtube', total: 6, gen: problemMix, meb: 'MAT.1.2.1', ders: 'Önce olayı anla: arttı mı, azaldı mı? Sonra işlemi yap ve kontrol et.' },
    { kind: 'oyun', title: 'İşlem Balonları', icon: 'balloon', total: 3, gen: islemBalon, meb: 'MAT.1.2.2', ders: 'Sonucu 10 olan işlemlerin balonlarını patlat!', oyun: true },
    { kind: 'oyun2', title: 'İşlem Hafızası', icon: 'puzzle', total: 2, gen: islemHafiza, meb: 'MAT.1.2.1', ders: 'Kartları çevir, işlemi sonucuyla eşleştir!', oyun: true },
  ],
}

/* ============================ 5. TEMA · PARALARIMIZ ============================ */
const madeniKagit: Gen = (rng) => sort(rng, {
  prompt: 'Paraları MADENÎ ve KÂĞIT diye ayır!',
  bins: [{ id: 'm', label: 'Madenî', color: '#ffb020' }, { id: 'k', label: 'Kâğıt', color: '#5bc236' }],
  items: [
    { label: '1 TL', bin: 'm' }, { label: '50 kuruş', bin: 'm' }, { label: '25 kuruş', bin: 'm' },
    { label: '5 TL', bin: 'k' }, { label: '10 TL', bin: 'k' }, { label: '20 TL', bin: 'k' }, { label: '50 TL', bin: 'k' }, { label: '100 TL', bin: 'k' }, { label: '200 TL', bin: 'k' },
  ],
  explain: '1 TL ve kuruşlar madenî paradır; 5, 10, 20, 50, 100 ve 200 TL kâğıt paradır.',
})
const ihtiyac: Gen = (rng) => sort(rng, {
  prompt: 'İhtiyaç mı, istek mi? Ayır!',
  bins: [{ id: 'i', label: 'İhtiyaç', color: '#2ec4c9' }, { id: 's', label: 'İstek', color: '#ff7aa8' }],
  items: [
    { img: 'bread', label: 'Ekmek', bin: 'i' }, { img: 'milk', label: 'Süt', bin: 'i' }, { img: 'toothbrush', label: 'Diş fırçası', bin: 'i' }, { img: 'apple', label: 'Elma', bin: 'i' }, { img: 'soap', label: 'Sabun', bin: 'i' },
    { img: 'videogame', label: 'Oyun konsolu', bin: 's' }, { img: 'candy', label: 'Şeker', bin: 's' }, { img: 'teddy', label: 'Oyuncak ayı', bin: 's' }, { img: 'balloon', label: 'Balon', bin: 's' }, { img: 'lollipop', label: 'Lolipop', bin: 's' },
  ],
  explain: 'Önce ihtiyaçlarımızı (yemek, temizlik) alırız; isteklerimiz için para biriktiririz.',
})
const ITEMS: [string, string, number][] = [['ball', 'Top', 15], ['book', 'Kitap', 20], ['teddy', 'Oyuncak ayı', 50], ['kite', 'Uçurtma', 25], ['pencil', 'Kalem', 5], ['icecream', 'Dondurma', 10], ['backpack', 'Çanta', 100], ['bicycle', 'Bisiklet', 200]]
const market: Gen = (rng) => {
  const wallet = pick(rng, [[10, 5], [20], [20, 10], [50], [10, 10, 5]])
  const w = wallet.reduce((a, b) => a + b, 0)
  const ok = shuffle(rng, ITEMS.filter((x) => x[2] <= w))
  const no = shuffle(rng, ITEMS.filter((x) => x[2] > w)).slice(0, 2)
  const t = ok[0]
  return choice(rng, { prompt: `Cüzdanında ${w} TL var. Hangisini alabilirsin?`, visual: { kind: 'money', items: wallet }, correct: { img: t[0], label: `${t[1]} · ${t[2]} TL` }, wrong: no.map((x) => ({ img: x[0], label: `${x[1]} · ${x[2]} TL` })), max: 3, explain: `${w} TL ile fiyatı ${w} TL ya da daha az olanı alabiliriz: ${t[1]} ${t[2]} TL.` })
}
const T5: Tema = {
  id: 't5', no: 5, title: 'Paralarımız', color: '#ffb020', dark: '#c98400', icon: 'coin',
  acts: [
    { kind: 'tani', title: 'Paraları Tanı', icon: 'banknote', total: 6, gen: only(para1, has('kaç lira'), 1), meb: 'MAT.1.1.9', ders: 'Paralarımız: 1, 5, 10, 20, 50, 100 ve 200 Türk lirası. TL ya da ₺ diye yazılır.', visual: { kind: 'money', items: [1, 5, 10, 20] } },
    { kind: 'madeni-kagit', title: 'Madenî mi, Kâğıt mı?', icon: 'coin', total: 3, gen: madeniKagit, meb: 'MAT.1.1.9', ders: 'Bazı paralar madenî (metal), bazıları kâğıttır.' },
    { kind: 'en-degerli', title: 'En Değerli Para', icon: 'gem', total: 5, gen: only(para1, has('EN DEĞERLİ'), 1), meb: 'MAT.1.1.9', ders: 'Paranın üzerindeki sayı büyükse o para daha değerlidir.' },
    { kind: 'toplam', title: 'Kaç TL Var?', icon: 'banknote', total: 6, gen: only(para1, has('toplam kaç TL'), 2), meb: 'MAT.1.1.9', ders: 'Paraları büyükten küçüğe doğru toplayarak sayarız.' },
    { kind: 'odeme', title: 'Ödeme Yap', icon: 'cart', total: 6, gen: only(para1, has('hangi paraları'), 2), meb: 'MAT.1.1.9', ders: 'Fiyatı tam karşılayan paraları seçeriz (para üstü almıyoruz).' },
    { kind: 'denk', title: 'Denk Paralar', icon: 'balance', total: 5, gen: only(para1, has('Doğru mu'), 2), meb: 'MAT.1.1.9', ders: '1 tane 10 TL = 2 tane 5 TL. Farklı paralarla aynı değeri oluşturabiliriz.' },
    { kind: 'ihtiyac', title: 'İhtiyaç mı, İstek mi?', icon: 'basket', total: 3, gen: ihtiyac, meb: 'MAT.1.1.9', ders: 'Bilinçli tüketici önce ihtiyaçlarını alır, istekleri için tasarruf eder.' },
    { kind: 'oyun', title: 'Market Oyunu', icon: 'store', total: 4, gen: market, meb: 'MAT.1.1.9', ders: 'Markete hoş geldin! Paran neye yeter?', oyun: true },
  ],
}

/* ============================ 6. TEMA · ŞEKİLLER ============================ */
const ozellik: Gen = (rng, _g, _l, h) => {
  const q = ([
    ['3 kenarı ve 3 köşesi olan şekil hangisi?', 'ucgen', 'Üçgenin 3 kenarı ve 3 köşesi vardır.'],
    ['4 kenarı birbirine EŞİT olan şekil hangisi?', 'kare', 'Karenin 4 kenarı da eşittir.'],
    ['Karşılıklı kenarları eşit, 4 köşeli şekil hangisi?', 'dikdortgen', 'Dikdörtgenin karşılıklı kenarları eşittir.'],
    ['Kenarı ve köşesi OLMAYAN şekil hangisi?', 'cember', 'Çemberin kenarı ve köşesi yoktur.'],
  ] as [string, ShapeKind, string][])[h.length % 4]
  const shapes: ShapeKind[] = ['ucgen', 'kare', 'dikdortgen', 'cember']
  const wrong = shuffle(rng, shapes.filter((s) => s !== q[1])).slice(0, 2)
  return choice(rng, { prompt: q[0], correct: { visual: { kind: 'shape', shape: q[1], scale: 0.7 } }, wrong: wrong.map((s) => ({ visual: { kind: 'shape' as const, shape: s, scale: 0.7 } })), max: 3, explain: q[2] })
}
const siniflandir: Gen = (rng) => sort(rng, {
  prompt: 'Şekilleri köşe sayısına göre ayır!',
  bins: [{ id: '3', label: '3 köşeli', color: '#ff9a2e' }, { id: '4', label: '4 köşeli', color: '#2ec4c9' }, { id: '0', label: 'Köşesiz', color: '#9b6ef3' }],
  items: [
    { label: 'Üçgen', bin: '3' }, { img: 'pizza', label: 'Pizza dilimi', bin: '3' },
    { label: 'Kare', bin: '4' }, { label: 'Dikdörtgen', bin: '4' }, { img: 'book', label: 'Kitap', bin: '4' }, { img: 'calendar', label: 'Takvim', bin: '4' },
    { label: 'Çember', bin: '0' }, { img: 'coin', label: 'Para', bin: '0' }, { img: 'clock', label: 'Saat', bin: '0' },
  ],
  count: 7,
  explain: 'Üçgen 3 köşeli; kare ve dikdörtgen 4 köşeli; çember köşesizdir.',
})
const sekilBalon: Gen = (rng, _g, _l, h) => {
  const SYM: Record<string, string> = { ucgen: '▲', kare: '■', cember: '●', dikdortgen: '▬' }
  const names: Record<string, string> = { ucgen: 'üçgenleri', kare: 'kareleri', cember: 'çemberleri', dikdortgen: 'dikdörtgenleri' }
  const t = (['ucgen', 'kare', 'cember'] as const)[h.length % 3]
  const others = Object.keys(SYM).filter((k) => k !== t).map((k) => SYM[k])
  const items = shuffle(rng, [...Array(4).fill(SYM[t]), ...Array.from({ length: 6 }, (_, i) => others[i % others.length])])
  const q: PopQ = { type: 'pop', target: SYM[t], hits: [SYM[t]], items, need: 4, prompt: `Bütün ${names[t]} patlat!`, explain: 'Şekilleri tanıdın, harika!' }
  return q
}
const T6: Tema = {
  id: 't6', no: 6, title: 'Şekiller', color: '#ff7aa8', dark: '#d84c7e', icon: 'puzzle',
  acts: [
    { kind: 'koseli', title: 'Köşeli mi, Köşesiz mi?', icon: 'book', total: 3, gen: only(sekiller1, (q) => q.type === 'sort', 3), meb: 'MAT.1.3.3', ders: 'Kitabın köşeleri vardır; top ve para yuvarlaktır, köşesi yoktur.' },
    { kind: 'sekil-ad', title: 'Şeklin Adı', icon: 'puzzle', total: 6, gen: only(sekiller1, has('adı nedir'), 1), meb: 'MAT.1.3.5', ders: 'Üçgen, kare, dikdörtgen ve çemberi tanıyalım.' },
    { kind: 'kenar-kose', title: 'Kenar ve Köşe Say', icon: 'pencil', total: 6, gen: only(sekiller1, has('kaç '), 1), meb: 'MAT.1.3.5', ders: 'Şekli sınırlayan çizgiler KENAR, kenarların birleştiği noktalar KÖŞE’dir.' },
    { kind: 'nesne-sekil', title: 'Hangi Şekle Benzer?', icon: 'pizza', total: 6, gen: only(sekiller1, has('hangi şekle'), 1), meb: 'MAT.1.3.4', ders: 'Çevremizdeki nesneler şekillere benzer: saat çembere, kitap dikdörtgene.' },
    { kind: 'ozellik', title: 'Özelliği Bul', icon: 'magnifier', total: 4, gen: ozellik, meb: 'MAT.1.3.5', ders: 'Şekilleri kenar ve köşe sayılarına göre tanırız.' },
    { kind: 'siniflandir', title: 'Sınıflandır', icon: 'basket', total: 3, gen: siniflandir, meb: 'MAT.1.3.5', ders: 'Şekilleri köşe sayısına göre gruplara ayıralım.' },
    { kind: 'oyun', title: 'Şekil Avı', icon: 'target', total: 3, gen: sekilBalon, meb: 'MAT.1.3.5', ders: 'İstenen şekillerin balonlarını patlat!', oyun: true },
  ],
}

/* ============================ 7. TEMA · VERİ ============================ */
const ceteleYap: Gen = (rng) => {
  const n = randInt(rng, 3, 12)
  const wrong = shuffle(rng, near(n, 1, 14)).slice(0, 2)
  const v = (k: number): Option => ({ visual: { kind: 'tally', rows: [{ label: 'Sayı', count: k }] } })
  return choice(rng, { prompt: `Hangi çetele ${n} sayısını gösterir?`, correct: v(n), wrong: wrong.map(v), max: 3, explain: `Çetelede her 5 çizgi bir demet yapılır. ${n} = ${Math.floor(n / 5)} demet ve ${n % 5} çizgi.` })
}
const veriTopla: Gen = (rng) => {
  const kinds = shuffle(rng, ['apple', 'banana', 'strawberry', 'grapes']).slice(0, 3)
  const counts = kinds.map(() => randInt(rng, 1, 5))
  const imgs = shuffle(rng, kinds.flatMap((k, i) => Array(counts[i]).fill(k)))
  const i = randInt(rng, 0, kinds.length - 1)
  const names: Record<string, string> = { apple: 'elma', banana: 'muz', strawberry: 'çilek', grapes: 'üzüm' }
  return numChoice(rng, { prompt: `Resimde kaç tane ${names[kinds[i]]} var?`, visual: { kind: 'images', imgs }, answer: counts[i], near: near(counts[i], 0, 10), explain: `Yalnızca ${names[kinds[i]]}ları sayarız: ${counts[i]}. Bu bilgiye VERİ denir.` })
}
const grafikEsle: Gen = (rng) => {
  const nums = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
  return match({ prompt: 'Çeteleyi sayıyla eşleştir!', spoken: 'Her çeteleyi gösterdiği sayıyla eşleştir.', pairs: nums.map((n) => ({ left: { visual: { kind: 'tally' as const, rows: [{ label: 'Sayı', count: n }] } }, right: { label: String(n) } })), explain: 'Çetelede beşli demetleri ve tek çizgileri sayarız.' })
}
const T7: Tema = {
  id: 't7', no: 7, title: 'Veri', color: '#4f9bff', dark: '#2f6fd1', icon: 'chart',
  acts: [
    { kind: 'veri-topla', title: 'Veri Topla', icon: 'basket', total: 6, gen: veriTopla, meb: 'MAT.1.4.1', ders: 'Topladığımız bilgiye VERİ denir. Önce aynı türden olanları sayarız.' },
    { kind: 'cetele-yap', title: 'Çetele Yap', icon: 'memo', total: 6, gen: ceteleYap, meb: 'MAT.1.4.1', ders: 'Çetelede her nesne için bir çizgi çekeriz; 5. çizgi demeti bağlar.' },
    { kind: 'cetele-oku', title: 'Çetele Oku', icon: 'chart', total: 6, gen: only(veri1, (q) => q.prompt.includes('kaç kişi') && JSON.stringify(q).includes('tally'), 2), meb: 'MAT.1.4.1', ders: 'Beşli demetleri 5, 10 diye sayar, kalan çizgileri ekleriz.' },
    { kind: 'grafik-oku', title: 'Grafik Oku', icon: 'chart', total: 6, gen: only(veri1, (q) => q.prompt.includes('kaç kişi') && JSON.stringify(q).includes('pictograph'), 2), meb: 'MAT.1.4.1', ders: 'Nesne grafiğinde her resim bir kişiyi gösterir.' },
    { kind: 'en-cok-az', title: 'En Çok, En Az', icon: 'trophy', total: 6, gen: only(veri1, has('EN '), 2), meb: 'MAT.1.4.1', ders: 'En uzun satır en çok, en kısa satır en azdır.' },
    { kind: 'fark-toplam', title: 'Kaç Fazla, Toplam Kaç?', icon: 'abacus', total: 6, gen: only(veri1, (q) => q.prompt.includes('fazla') || q.prompt.includes('toplam'), 3), meb: 'MAT.1.4.1', ders: 'İki sayının farkını çıkarma ile, toplamını toplama ile buluruz.' },
    { kind: 'oyun', title: 'Çetele Eşleştir', icon: 'puzzle', total: 3, gen: grafikEsle, meb: 'MAT.1.4.1', ders: 'Çeteleleri sayılarla eşleştir!', oyun: true },
  ],
}

export const TEMALAR: Tema[] = [T1, T2, T3, T4, T5, T6, T7]
export const temaById = (id: string) => TEMALAR.find((t) => t.id === id)
