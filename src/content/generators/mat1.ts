/**
 * 1. SINIF MATEMATİK — MEB 1. sınıf Matematik ders kitabının (1. ve 2. kitap) temalarına göre.
 * Kaynak analiz: docs/meb-kitaplar/analiz/matematik-1.md (soru türü kataloğu #1–57).
 * Kitap 3 şıklı çoktan seçmeli ve Doğru/Yanlış biçimini tercih eder → burada da öyle.
 * Sınırlar: sayılar 0–20 (ritmik sayma 100'e), toplama/çıkarma ≤ 20, alt alta işlemde eldesiz/onluk bozmadan,
 * para 1–200 TL (para üstü yok), veri ≤ 14.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { choice, fromBank, numChoice, order, sort, type BankItem, type Gen } from './helpers'
import type { Option, Question, Relation, ShapeKind } from '../../games/quiz/types'
import type { Level } from '../../learning/mastery'

const DY = (rng: Rng, p: { prompt: string; truth: boolean; explain: string; visual?: Parameters<typeof choice>[1]['visual'] }) =>
  choice(rng, { prompt: p.prompt, correct: p.truth ? 'Doğru' : 'Yanlış', wrong: [p.truth ? 'Yanlış' : 'Doğru'], explain: p.explain, visual: p.visual, keepOrder: false, max: 2 })

/* ============================ 1. TEMA · NESNELERİN GEOMETRİSİ 1 ============================ */
const ANIMALS: [string, string][] = [
  ['cat', 'Kedi'], ['dog', 'Köpek'], ['rabbit', 'Tavşan'], ['duck', 'Ördek'], ['chick', 'Civciv'], ['ball', 'Top'], ['teddy', 'Oyuncak ayı'], ['frog', 'Kurbağa'],
]
// referans nesne: [görsel, ad (tamlayan ekiyle)], uygun ilişkiler
const REFS: { img: string; gen: string; rels: Relation[] }[] = [
  { img: 'basket', gen: 'sepetin', rels: ['icinde', 'disinda', 'ustunde', 'onunde', 'arkasinda', 'saginda', 'solunda'] },
  { img: 'tree', gen: 'ağacın', rels: ['altinda', 'onunde', 'arkasinda', 'saginda', 'solunda'] },
  { img: 'house', gen: 'evin', rels: ['onunde', 'arkasinda', 'saginda', 'solunda', 'ustunde'] },
  { img: 'car', gen: 'arabanın', rels: ['ustunde', 'onunde', 'arkasinda', 'saginda', 'solunda'] },
  { img: 'bed', gen: 'yatağın', rels: ['ustunde', 'altinda', 'onunde', 'saginda', 'solunda'] },
  { img: 'umbrella', gen: 'şemsiyenin', rels: ['altinda', 'saginda', 'solunda'] },
]
const REL_TXT: Record<Relation, string> = {
  ustunde: 'üstünde', altinda: 'altında', icinde: 'içinde', disinda: 'dışında', onunde: 'önünde', arkasinda: 'arkasında', saginda: 'sağında', solunda: 'solunda', yaninda: 'yanında', arasinda: 'arasında',
}
const OPP: Partial<Record<Relation, Relation>> = { ustunde: 'altinda', altinda: 'ustunde', icinde: 'disinda', disinda: 'icinde', onunde: 'arkasinda', arkasinda: 'onunde', saginda: 'solunda', solunda: 'saginda' }
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1)

export const konumKasifi: Gen = (rng, _g, level) => {
  const [aImg, aName] = pick(rng, ANIMALS)
  if (level >= 2 && rng() < 0.2) {
    return choice(rng, {
      prompt: `${aName} nerede?`,
      visual: { kind: 'position', subject: aImg, ref: 'tree', third: 'house', rel: 'arasinda' },
      correct: 'Ağaç ile evin arasında',
      wrong: ['Ağacın üstünde', 'Evin içinde'],
      explain: `${aName} ağaç ile evin arasında duruyor.`,
      max: 3,
    })
  }
  const ref = pick(rng, REFS)
  const pool = level === 1 ? ref.rels.filter((r) => r !== 'saginda' && r !== 'solunda') : ref.rels
  const rel = pick(rng, pool)
  const sideNote = rel === 'saginda' || rel === 'solunda' ? ' (sana göre)' : ''
  const t = rng()
  if (t < 0.45) {
    const wrongRels = shuffle(rng, [OPP[rel], ...ref.rels].filter((r): r is Relation => !!r && r !== rel))
    return choice(rng, {
      prompt: `${aName} nerede?${sideNote}`,
      visual: { kind: 'position', subject: aImg, ref: ref.img, rel },
      correct: `${cap(ref.gen)} ${REL_TXT[rel]}`,
      wrong: wrongRels.map((r) => `${cap(ref.gen)} ${REL_TXT[r]}`),
      max: 3,
      explain: `${aName}, ${ref.gen} ${REL_TXT[rel]}.${sideNote ? ' Sağ ve sol, resme bakan sana göredir.' : ''}`,
    })
  }
  if (t < 0.8) {
    const others = shuffle(rng, ref.rels.filter((r) => r !== rel)).slice(0, 2)
    return choice(rng, {
      prompt: `Hangi resimde ${aName.toLocaleLowerCase('tr-TR')} ${ref.gen} ${REL_TXT[rel]}?${sideNote}`,
      correct: { visual: { kind: 'position', subject: aImg, ref: ref.img, rel } },
      wrong: others.map((r) => ({ visual: { kind: 'position' as const, subject: aImg, ref: ref.img, rel: r } })),
      max: 3,
      explain: `${aName} ${ref.gen} ${REL_TXT[rel]} olan resmi buluruz.`,
    })
  }
  const shown = rng() < 0.5 ? rel : (pick(rng, ref.rels.filter((r) => r !== rel)) as Relation)
  return DY(rng, {
    prompt: `“${aName} ${ref.gen} ${REL_TXT[rel]}.” Bu cümle resme göre doğru mu?${sideNote}`,
    truth: shown === rel,
    visual: { kind: 'position', subject: aImg, ref: ref.img, rel: shown },
    explain: `Resimde ${aName.toLocaleLowerCase('tr-TR')} ${ref.gen} ${REL_TXT[shown]}.`,
  })
}

const GRID_ITEMS: [string, string][] = [['apple', 'Elma'], ['star', 'Yıldız'], ['ball', 'Top'], ['house', 'Ev'], ['flower', 'Çiçek'], ['car', 'Araba'], ['balloon', 'Balon']]
const DIR: Record<string, [number, number, string]> = { R: [1, 0, 'sağa'], L: [-1, 0, 'sola'], U: [0, -1, 'yukarı'], D: [0, 1, 'aşağı'] }

export const yolBulmaca: Gen = (rng, _g, level) => {
  const cols = 5
  const rows = 4
  for (let tries = 0; tries < 50; tries++) {
    const start: [number, number] = [randInt(rng, 0, cols - 1), randInt(rng, 0, rows - 1)]
    const segs = level === 1 ? 1 : level === 2 ? 2 : 3
    let [x, y] = start
    const path: [number, number][] = []
    const steps: string[] = []
    let last = ''
    let ok = true
    for (let s = 0; s < segs; s++) {
      const dirs = Object.keys(DIR).filter((d) => d !== last && !(d === 'R' && last === 'L') && !(d === 'L' && last === 'R') && !(d === 'U' && last === 'D') && !(d === 'D' && last === 'U'))
      const d = pick(rng, dirs)
      const [dx, dy, word] = DIR[d]
      const max = dx ? (dx > 0 ? cols - 1 - x : x) : dy > 0 ? rows - 1 - y : y
      if (max < 1) {
        ok = false
        break
      }
      const n = randInt(rng, 1, Math.min(3, max))
      for (let k = 0; k < n; k++) {
        x += dx
        y += dy
        path.push([x, y])
      }
      steps.push(`${n} kare ${word}`)
      last = d
    }
    if (!ok || (x === start[0] && y === start[1])) continue
    const items = shuffle(rng, GRID_ITEMS).slice(0, 4)
    const free: [number, number][] = []
    for (let yy = 0; yy < rows; yy++) for (let xx = 0; xx < cols; xx++) if (!(xx === start[0] && yy === start[1]) && !path.some(([px, py]) => px === xx && py === yy)) free.push([xx, yy])
    const spots = shuffle(rng, free).slice(0, 3)
    const placed = [{ img: items[0][0], at: [x, y] as [number, number] }, ...spots.map((at, i) => ({ img: items[i + 1][0], at }))]
    return choice(rng, {
      prompt: `Fındık ${steps.join(', ')} giderse hangi nesneye ulaşır?`,
      visual: { kind: 'grid', cols, rows, start, items: placed },
      correct: { img: items[0][0], label: items[0][1] },
      wrong: items.slice(1, 3).map(([img, label]) => ({ img, label })),
      max: 3,
      explain: `Fındık'ı adım adım götürelim: ${steps.join(', ')}. Vardığı karede ${items[0][1].toLocaleLowerCase('tr-TR')} var.`,
    })
  }
  return konumKasifi(rng, 1, level, [])
}

const SHAPES_G1: ShapeKind[] = ['ucgen', 'kare', 'dikdortgen', 'daire']
const COLORS = ['#ff9a2e', '#2ec4c9', '#5bc236', '#ff7aa8', '#9b6ef3', '#ffd23f']
export const esiniBul: Gen = (rng, _g, level) => {
  const shape = pick(rng, SHAPES_G1)
  const color = pick(rng, COLORS)
  const scale = 0.8
  const variants: Option[] = [
    { visual: { kind: 'shape', shape, color: pick(rng, COLORS.filter((c) => c !== color)), scale } },
    { visual: { kind: 'shape', shape: pick(rng, SHAPES_G1.filter((s) => s !== shape)), color, scale } },
    { visual: { kind: 'shape', shape, color, scale: 0.5 } },
  ]
  if (level >= 2 && rng() < 0.5) {
    const odd = pick(rng, variants)
    return choice(rng, {
      prompt: 'Eşi olmayan hangisi? Farklı olanı bul!',
      correct: odd,
      wrong: [{ visual: { kind: 'shape', shape, color, scale } }, { visual: { kind: 'shape', shape, color, scale: 0.8001 } }],
      max: 3,
      explain: 'Eş nesnelerin rengi, biçimi ve büyüklüğü aynıdır. Biri bu özelliklerden birinde farklı.',
    })
  }
  return choice(rng, {
    prompt: 'Yukarıdaki şeklin eşi hangisi?',
    visual: { kind: 'shape', shape, color, scale },
    correct: { visual: { kind: 'shape', shape, color, scale } },
    wrong: variants,
    max: 3,
    explain: 'Eş olması için rengi, biçimi ve büyüklüğü tamamen aynı olmalı. Yalnızca sayıları eşit olan şeyler eş değildir.',
  })
}

/* ============================ 2. TEMA · SAYILAR VE NİCELİKLER 1 ============================ */
const OBJ = ['apple', 'strawberry', 'star', 'fish', 'duck', 'balloon', 'flower', 'ball', 'cupcake', 'bee']
const consecutive = (n: number) => [n - 1, n + 1].filter((x) => x >= 0)

export const sayiAvcisi1: Gen = (rng, _g, level) => {
  const t = rng()
  if (level >= 2 && t < 0.2) {
    const digit = randInt(rng, 0, 9)
    return choice(rng, { prompt: 'Hangisi bir RAKAMDIR?', correct: String(digit), wrong: [String(randInt(rng, 10, 15)), String(randInt(rng, 16, 20))], max: 3, explain: '0, 1, 2, … 9 işaretleri rakamdır; 10 tane rakam vardır. 12 gibi sayılar iki rakamla yazılır.' })
  }
  if (t < 0.35) {
    const n = randInt(rng, 2, level === 1 ? 9 : 15)
    const img = pick(rng, OBJ)
    const nums = shuffle(rng, [n, ...consecutive(n)]).slice(0, 3)
    return choice(rng, {
      prompt: `Hangi grupta ${n} tane var?`,
      correct: { visual: { kind: 'objects', img, count: n } },
      wrong: nums.filter((x) => x !== n && x > 0).map((c) => ({ visual: { kind: 'objects' as const, img, count: c } })),
      max: 3,
      explain: `Her grubu tek tek sayarız. ${n} tane olan grubu buluruz.`,
    })
  }
  const n = level === 1 ? randInt(rng, 1, 9) : level === 2 ? randInt(rng, 0, 10) : randInt(rng, 10, 20)
  const img = pick(rng, OBJ)
  return numChoice(rng, {
    prompt: n === 0 ? 'Tabakta kaç tane var?' : 'Kaç tane var? Sayalım!',
    answer: n,
    visual: n === 0 ? { kind: 'image', img: 'plate', size: 140 } : { kind: 'objects', img, count: n },
    near: consecutive(n),
    explain: n === 0 ? 'Hiç yok demek 0 (sıfır) demektir.' : `Tek tek sayarız: 1, 2, 3 … ${n}.`,
  })
}

export const onlukBirlik: Gen = (rng, _g, level) => {
  const n = randInt(rng, 11, 20)
  const t = n === 20 ? 2 : 1
  const o = n === 20 ? 0 : n - 10
  const kind = pick(rng, level === 3 ? ['blok', 'coz', 'birlestir', 'yanlis'] : ['blok', 'coz', 'birlestir'])
  if (kind === 'blok') return numChoice(rng, { prompt: 'Bloklarla gösterilen sayı kaçtır?', answer: n, visual: { kind: 'blocks', hundreds: 0, tens: t, ones: o }, near: consecutive(n), explain: `${t} onluk ve ${o} birlik = ${n}. 10 birlik bir araya gelince 1 onluk olur.` })
  const fmt = (a: number, b: number) => `${a} onluk ${b} birlik`
  if (kind === 'coz') return choice(rng, { prompt: `${n} sayısı kaç onluk, kaç birliktir?`, correct: fmt(t, o), wrong: [fmt(o, t), fmt(t, Math.max(0, o - 1)), fmt(t, o + 1)], max: 3, explain: `${n} = ${fmt(t, o)}.` })
  if (kind === 'birlestir') return numChoice(rng, { prompt: `${fmt(t, o)} kaç eder?`, answer: n, near: consecutive(n), explain: `${t} onluk = ${t * 10}, ${o} birlik eklersek ${n}.` })
  const wrongO = o === 0 ? 1 : o - 1
  const truth = rng() < 0.5
  return DY(rng, { prompt: `“${n} = ${fmt(t, truth ? o : wrongO)}” Bu çözümleme doğru mu?`, truth, explain: `${n} = ${fmt(t, o)}.` })
}

const ROW_ANIMALS: [string, string][] = [['cat', 'kedi'], ['dog', 'köpek'], ['rabbit', 'tavşan'], ['duck', 'ördek'], ['chick', 'civciv'], ['frog', 'kurbağa'], ['bear', 'ayı'], ['lion', 'aslan'], ['owl', 'baykuş'], ['penguin', 'penguen']]
export const kacinci: Gen = (rng, _g, level) => {
  const len = level === 1 ? 5 : level === 2 ? 7 : 9
  const animals = shuffle(rng, ROW_ANIMALS).slice(0, len)
  const i = randInt(rng, 0, len - 1)
  const t = rng()
  const ord = (k: number) => `${k}.`
  if (t < 0.45)
    return choice(rng, { prompt: 'Sarı çerçevedeki hayvan baştan kaçıncı sırada?', visual: { kind: 'row', imgs: animals.map((a) => a[0]), highlight: i, arrow: 'ltr' }, correct: ord(i + 1), wrong: [ord(i), ord(i + 2), ord(i + 3)].filter((x) => x !== '0.'), max: 3, keepOrder: false, explain: `Baştan sayarız: 1., 2., 3. … ${animals[i][1]} ${i + 1}. sırada.` })
  if (t < 0.8)
    return choice(rng, {
      prompt: `Baştan ${i + 1}. sıradaki hayvan hangisi?`,
      visual: { kind: 'row', imgs: animals.map((a) => a[0]), arrow: 'ltr' },
      correct: { img: animals[i][0], label: cap(animals[i][1]) },
      wrong: animals.filter((_, k) => k !== i).slice(0, 4).map((a) => ({ img: a[0], label: cap(a[1]) })),
      max: 3,
      explain: `Baştan ${i + 1}'e kadar sayarız: ${animals[i][1]}.`,
    })
  const j = Math.min(len - 2, i)
  return choice(rng, { prompt: `${cap(animals[j][1])}tan hemen SONRA gelen hayvan kaçıncı?`.replace(/tan hemen/, `'dan hemen`), visual: { kind: 'row', imgs: animals.map((a) => a[0]), arrow: 'ltr' }, correct: ord(j + 2), wrong: [ord(j + 1), ord(j + 3)].concat(j > 0 ? [ord(j)] : []), max: 3, explain: `${cap(animals[j][1])} ${j + 1}. sırada; hemen sonraki ${j + 2}. sırada.` })
}

export const cokAz: Gen = (rng, _g, level) => {
  const img1 = pick(rng, OBJ)
  const img2 = pick(rng, OBJ.filter((o) => o !== img1))
  const t = rng()
  if (t < 0.5) {
    const a = randInt(rng, 2, level === 1 ? 9 : 15)
    let b = randInt(rng, 2, level === 1 ? 9 : 15)
    if (a === b && rng() < 0.7) b = a + 1
    const askMore = rng() < 0.5
    const ans = a === b ? 'İkisi eşit' : (askMore ? a > b : a < b) ? 'Soldaki grup' : 'Sağdaki grup'
    return choice(rng, { prompt: `Hangi grupta daha ${askMore ? 'ÇOK' : 'AZ'} var?`, visual: { kind: 'compare', left: { img: img1, count: a }, right: { img: img2, count: b } }, correct: ans, wrong: ['Soldaki grup', 'Sağdaki grup', 'İkisi eşit'], max: 3, explain: `Solda ${a}, sağda ${b} tane var. Bire bir eşleştirirsek ${a === b ? 'hepsi eşleşir: eşit.' : `${Math.abs(a - b)} tane eşsiz kalır.`}` })
  }
  if (t < 0.75) {
    const a = randInt(rng, 3, 9)
    const b = a + randInt(rng, 1, 4)
    return numChoice(rng, { prompt: 'İki grubun eşit olması için soldakine kaç tane eklemeliyiz?', visual: { kind: 'compare', left: { img: img1, count: a }, right: { img: img1, count: b } }, answer: b - a, near: [b - a + 1, b - a - 1].filter((x) => x > 0), explain: `Solda ${a}, sağda ${b} var. ${b} − ${a} = ${b - a} tane eklersek eşit olur.` })
  }
  const n = randInt(rng, 4, 16)
  const truthMore = n > 10
  const say = rng() < 0.5 ? 'çoktur' : 'azdır'
  return DY(rng, { prompt: `“Buradakiler 10'dan ${say}.” Doğru mu?`, visual: { kind: 'objects', img: img1, count: n === 10 ? 11 : n }, truth: say === 'çoktur' ? truthMore || (n === 10 && true) : !truthMore && n !== 10, explain: `Burada ${n === 10 ? 11 : n} tane var. ${n === 10 ? 11 : n} sayısı 10'dan ${(n === 10 ? 11 : n) > 10 ? 'çoktur' : 'azdır'}.` })
}

const PATTERNS: [string[], string][] = [['AB', 'ikili'], ['AAB', 'üçlü'], ['ABB', 'üçlü'], ['ABC', 'üçlü']].map(([p, s]) => [p.split(''), s])
const PAT_IMGS = ['star', 'apple', 'ball', 'flower', 'car', 'airplane', 'heart', 'moon', 'fish']
export const ritmikOruntu: Gen = (rng, _g, level) => {
  const t = rng()
  if (t < 0.35) {
    const [pat] = pick(rng, level === 1 ? PATTERNS.slice(0, 1) : PATTERNS)
    const imgs = shuffle(rng, PAT_IMGS).slice(0, 3)
    const map: Record<string, string> = { A: imgs[0], B: imgs[1], C: imgs[2] }
    const seq = Array.from({ length: pat.length * 2 + 1 }, (_, i) => map[pat[i % pat.length]])
    const ans = seq[seq.length - 1]
    const name = (img: string) => ({ star: 'Yıldız', apple: 'Elma', ball: 'Top', flower: 'Çiçek', car: 'Araba', airplane: 'Uçak', heart: 'Kalp', moon: 'Ay', fish: 'Balık' })[img] ?? img
    return choice(rng, {
      prompt: 'Örüntüde ? yerine hangisi gelir?',
      visual: { kind: 'pattern', items: [...seq.slice(0, -1), null] },
      correct: { img: ans, label: name(ans) },
      wrong: Object.values(map).filter((x) => x !== ans).map((img) => ({ img, label: name(img) })),
      max: 3,
      explain: `Her örüntünün bir kuralı vardır: ${pat.map((p) => name(map[p])).join(' – ')} tekrar ediyor.`,
    })
  }
  // sayı: ileri 1/5/10 → 100, ikişer → 20; geri birer/ikişer 20'den
  const opts = level === 1 ? [[1, 20, false], [10, 100, false]] : [[1, 100, false], [5, 100, false], [10, 100, false], [2, 20, false], [1, 20, true], [2, 20, true]]
  const [step, max, back] = pick(rng, opts) as [number, number, boolean]
  const len = 5
  let start: number
  if (back) start = randInt(rng, step * (len - 1), 20)
  else start = step === 1 ? randInt(rng, 1, max - len + 1) : step * randInt(rng, step === 2 ? 0 : 1, max / step - len + 1)
  const seq = Array.from({ length: len }, (_, i) => (back ? start - i * step : start + i * step))
  const hole = randInt(rng, 1, len - 1)
  const ans = seq[hole]
  if (level >= 2 && rng() < 0.25) {
    const rule = `${back ? 'Geriye' : 'İleriye'} ${step === 1 ? 'birer' : step === 2 ? 'ikişer' : step === 5 ? 'beşer' : 'onar'} sayılıyor`
    return choice(rng, { prompt: 'Bu ritmik saymanın kuralı nedir?', visual: { kind: 'sequence', items: seq }, correct: rule, wrong: ['İleriye birer sayılıyor', 'İleriye ikişer sayılıyor', 'İleriye beşer sayılıyor', 'İleriye onar sayılıyor', 'Geriye birer sayılıyor'].filter((x) => x !== rule), max: 3, explain: `Her adımda ${step} ${back ? 'azalıyor' : 'artıyor'}.` })
  }
  return numChoice(rng, { prompt: `Ritmik sayma: ? yerine hangi sayı gelir?`, visual: { kind: 'sequence', items: seq.map((x, i) => (i === hole ? '?' : x)) }, answer: ans, near: [ans + 1, ans - 1, ans + step].filter((x) => x !== ans && x >= 0), explain: `Kural: ${back ? 'geriye' : 'ileriye'} ${step}'er sayıyoruz. ${seq.join(', ')}.` })
}

export const tahmin: Gen = (rng, _g, level) => {
  const img = pick(rng, OBJ)
  if (rng() < 0.5) {
    const ref = level === 1 ? 5 : 10
    let n = randInt(rng, ref - 4, ref + 6)
    if (n === ref) n++
    return choice(rng, { prompt: `Saymadan tahmin et: ${ref}'den az mı, çok mu?`.replace("5'den", "5'ten"), visual: { kind: 'objects', img, count: n }, correct: n > ref ? `${ref}'dan çok`.replace("5'dan", "5'ten").replace("10'dan", "10'dan") : `${ref}'dan az`.replace("5'dan", "5'ten"), wrong: [n > ref ? `${ref}'dan az`.replace("5'dan", "5'ten") : `${ref}'dan çok`.replace("5'dan", "5'ten")], max: 2, explain: `Sayınca ${n} çıkıyor; ${n}, ${ref}'${ref === 5 ? 'ten' : 'dan'} ${n > ref ? 'çoktur' : 'azdır'}.` })
  }
  const n = randInt(rng, 7, 18)
  const guesses = shuffle(rng, [n - 1, n - 4, n + 5]).filter((x) => x > 0)
  return choice(rng, { prompt: `Burada ${n} tane var. Hangi tahmin gerçeğe EN YAKIN?`, visual: { kind: 'objects', img, count: n }, correct: String(n - 1), wrong: guesses.filter((x) => x !== n - 1).map(String), max: 3, explain: `${n - 1} ile ${n} arasında yalnızca 1 fark var; diğer tahminler daha uzak.` })
}

/* ============================ 3. TEMA · SAYILAR VE NİCELİKLER 2 (ÖLÇME) ============================ */
const BAR_COLORS = ['#e8463c', '#2a7fd4', '#5bc236', '#ffb020', '#9b6ef3']
export const uzunluk: Gen = (rng, _g, level) => {
  const t = rng()
  const n = level === 1 ? 3 : 4
  const lens = shuffle(rng, [3, 4, 5, 6, 7, 8, 9]).slice(0, n)
  const labels = ['A', 'B', 'C', 'D']
  const items = lens.map((len, i) => ({ color: BAR_COLORS[i], len, label: labels[i] }))
  if (t < 0.4) {
    const longest = rng() < 0.5
    const target = longest ? Math.max(...lens) : Math.min(...lens)
    const idx = lens.indexOf(target)
    return choice(rng, { prompt: `En ${longest ? 'UZUN' : 'KISA'} kalem hangisi?`, visual: { kind: 'lengths', items }, correct: labels[idx], wrong: labels.slice(0, n).filter((_, i) => i !== idx), max: 3, explain: `Kalemlerin başlangıçları aynı hizada; en ${longest ? 'uzağa' : 'kısa'} uzanan ${labels[idx]} kalemidir.` })
  }
  if (t < 0.6 && level >= 2) {
    const sorted = [...items].sort((a, b) => a.len - b.len).map((x) => x.label)
    return order({ prompt: 'Kalemleri KISADAN UZUNA sırala!', pieces: sorted, joiner: ' ', style: 'chain', explain: `En kısadan en uzuna: ${sorted.join(', ')}.` })
  }
  if (t < 0.8) {
    const k = randInt(rng, 3, 8)
    return numChoice(rng, { prompt: 'Kırmızı kurdele kaç ataş uzunluğunda?', visual: { kind: 'lengths', items: [{ color: BAR_COLORS[0], len: k }], unit: { img: 'paperclip', count: [k] } }, answer: k, near: [k + 1, k - 1], explain: `Ataşları baştan, aralarında boşluk bırakmadan dizip sayarız: ${k} ataş.` })
  }
  const u = pick(rng, [
    ['Bir silginin uzunluğunu', 'Parmak'],
    ['Sıranın (masanın) uzunluğunu', 'Karış'],
    ['Sınıfın uzunluğunu', 'Adım'],
    ['Bir kitabın uzunluğunu', 'Karış'],
    ['Okul bahçesinin uzunluğunu', 'Adım'],
  ] as [string, string][])
  return choice(rng, { prompt: `${u[0]} ölçmek için en uygun birim hangisi?`, correct: u[1], wrong: ['Parmak', 'Karış', 'Adım', 'Kulaç'].filter((x) => x !== u[1]), max: 3, explain: 'Küçük şeyleri parmakla, orta büyüklükteki şeyleri karışla, uzun mesafeleri adımla ölçeriz.' })
}

const MASS: [string, string, number][] = [['elephant', 'Fil', 9], ['horse', 'At', 8], ['cow', 'İnek', 8], ['dog', 'Köpek', 5], ['cat', 'Kedi', 4], ['rabbit', 'Tavşan', 3], ['mouse', 'Fare', 1], ['watermelon', 'Karpuz', 6], ['apple', 'Elma', 2], ['strawberry', 'Çilek', 1]]
export const terazi: Gen = (rng) => {
  const t = rng()
  const [a, b] = shuffle(rng, MASS).filter((x, i, arr) => arr.findIndex((y) => y[2] === x[2]) === i).slice(0, 2)
  if (t < 0.45) {
    const heavier = a[2] > b[2] ? a : b
    return choice(rng, { prompt: 'Terazide hangisi daha AĞIR?', visual: { kind: 'balance', left: { img: a[0] }, right: { img: b[0] }, tilt: a[2] > b[2] ? -1 : 1 }, correct: { img: heavier[0], label: heavier[1] }, wrong: [{ img: (heavier === a ? b : a)[0], label: (heavier === a ? b : a)[1] }], max: 2, explain: 'Eşit kollu terazide aşağıda kalan kefe daha ağırdır.' })
  }
  if (t < 0.75) {
    const k = randInt(rng, 2, 6)
    return numChoice(rng, { prompt: 'Terazi dengede. 1 karpuz kaç elmaya denk geliyor?', visual: { kind: 'balance', left: { img: 'watermelon', count: 1 }, right: { img: 'apple', count: k }, tilt: 0 }, answer: k, near: [k + 1, k - 1], explain: `Kefeler aynı hizada olduğunda terazi dengededir: 1 karpuz = ${k} elma.` })
  }
  const three = shuffle(rng, MASS.filter((m) => m[0] !== 'watermelon' && m[0] !== 'apple' && m[0] !== 'strawberry')).filter((x, i, arr) => arr.findIndex((y) => y[2] === x[2]) === i).slice(0, 3)
  const light = three.reduce((m, x) => (x[2] < m[2] ? x : m))
  return choice(rng, { prompt: 'Hangisi EN HAFİF?', correct: { img: light[0], label: light[1] }, wrong: three.filter((x) => x !== light).map((x) => ({ img: x[0], label: x[1] })), max: 3, explain: `${light[1]} bu üç canlı arasında en hafif olanıdır.` })
}

/* ============================ 4. TEMA · İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE ============================ */
const NAMES = ['Ayşe', 'Ali', 'Zeynep', 'Mert', 'Elif', 'Can', 'Defne', 'Ege']
const THINGS: [string, string][] = [['kalem', 'pencil'], ['elma', 'apple'], ['balon', 'balloon'], ['kitap', 'book'], ['top', 'ball'], ['çiçek', 'flower']]

export const islem1: Gen = (rng, _g, level) => {
  const kind = pick(rng, level === 1 ? ['artma', 'yanyana', 'yanyana', 'sifir', 'altalta'] : level === 2 ? ['yanyana', 'altalta', 'sozel', 'ona', 'sifir'] : ['yanyana', 'ona', 'tahmin', 'sozel', 'altalta'])
  if (kind === 'artma') {
    const nm = pick(rng, NAMES)
    const [th] = pick(rng, THINGS)
    const up = rng() < 0.5
    const a = randInt(rng, 3, 8)
    const b = randInt(rng, 1, 3)
    return choice(rng, { prompt: up ? `${nm}'in ${a} ${th}i vardı. ${b} ${th} daha aldı. Bu bir artma mı, azalma mı?` : `${nm}'in ${a} ${th}i vardı. ${b} ${th}i kardeşine verdi. Bu bir artma mı, azalma mı?`, correct: up ? 'Artma' : 'Azalma', wrong: [up ? 'Azalma' : 'Artma'], max: 2, explain: up ? 'Eklemek, almak sayıyı artırır: toplama yaparız.' : 'Vermek, gitmek sayıyı azaltır: çıkarma yaparız.' })
  }
  if (kind === 'sifir') {
    const a = randInt(rng, 3, 20)
    const f = pick(rng, [[`${a} + 0`, a], [`${a} − 0`, a], [`${a} − ${a}`, 0]] as [string, number][])
    return numChoice(rng, { prompt: 'İşlemin sonucu kaç?', visual: { kind: 'equation', text: `${f[0]} = ?` }, answer: f[1], near: [f[1] + 1, a === f[1] ? 0 : a].filter((x) => x !== f[1]), explain: f[1] === 0 ? 'Bir sayıdan kendisini çıkarırsak sonuç 0 olur.' : 'Bir sayıya 0 eklersek ya da 0 çıkarırsak sayı değişmez.' })
  }
  if (kind === 'altalta') {
    // alt alta: eldesiz toplama / onluk bozmadan çıkarma (≤20)
    const sub = rng() < 0.5
    let a: number, b: number
    do {
      a = randInt(rng, sub ? 11 : 10, sub ? 19 : 18)
      b = randInt(rng, 1, 9)
    } while (sub ? a % 10 < b : (a % 10) + b >= 10 || a + b > 20)
    const r = sub ? a - b : a + b
    return numChoice(rng, { prompt: 'Alt alta işlemi yap. Sonuç kaç?', visual: { kind: 'column', a, b, op: sub ? '−' : '+' }, answer: r, near: consecutive(r).concat(sub ? [a + b] : [a - b]).filter((x) => x >= 0 && x !== r), explain: `Önce birlikleri ${sub ? 'çıkarırız' : 'toplarız'}: ${a % 10} ${sub ? '−' : '+'} ${b} = ${sub ? (a % 10) - b : (a % 10) + b}. Onluk aynen iner: ${r}.` })
  }
  if (kind === 'ona') {
    const a = randInt(rng, 6, 9)
    const b = randInt(rng, 11 - a, 9)
    if (rng() < 0.5) return numChoice(rng, { prompt: `${a} + ${b} işlemini 10'a tamamlayarak yapalım: önce ${a}'e kaç eklersek 10 olur?`.replace(`${a}'e`, `${a}'${a === 6 || a === 9 ? 'ya' : 'e'}`), answer: 10 - a, near: [10 - a + 1, 10 - a - 1].filter((x) => x > 0), explain: `${a} + ${10 - a} = 10. Kalan ${b - (10 - a)}'i de ekleriz: 10 + ${b - (10 - a)} = ${a + b}.` })
    return numChoice(rng, { prompt: 'Zihinden yap: sonuç kaç?', visual: { kind: 'equation', text: `${a} + ${b} = ?` }, answer: a + b, near: [a + b - 1, a + b + 1, a + b - 10].filter((x) => x > 0), explain: `10'a tamamla: ${a} + ${10 - a} = 10, sonra 10 + ${b - (10 - a)} = ${a + b}.` })
  }
  if (kind === 'tahmin') {
    const a = randInt(rng, 4, 9)
    const b = randInt(rng, 3, 9)
    const r = a + b
    return choice(rng, { prompt: `${a} + ${b} işleminin sonucuna EN YAKIN tahmin hangisi?`, correct: String(r + 1), wrong: [String(r - 5), String(r + 6)].filter((x) => Number(x) > 0), max: 3, explain: `Gerçek sonuç ${r}. ${r + 1} ile arasında sadece 1 fark var.` })
  }
  if (kind === 'sozel') {
    const sub = rng() < 0.5
    const nm = pick(rng, NAMES)
    const [th, img] = pick(rng, THINGS)
    const a = sub ? randInt(rng, 6, 15) : randInt(rng, 3, 12)
    const b = sub ? randInt(rng, 2, Math.min(9, a - 1)) : randInt(rng, 2, Math.min(8, 20 - a))
    return numChoice(rng, {
      prompt: sub ? `${nm}'in ${a} ${th}i vardı. ${b} tanesini arkadaşına verdi. Kaç ${th}i kaldı?` : `${nm}'in ${a} ${th}i vardı. ${b} ${th} daha aldı. Şimdi kaç ${th}i var?`,
      visual: { kind: 'image', img, size: 110 },
      answer: sub ? a - b : a + b,
      near: [sub ? a + b : a - b, (sub ? a - b : a + b) + 1, (sub ? a - b : a + b) - 1].filter((x) => x >= 0),
      explain: sub ? `Verince azalır: ${a} − ${b} = ${a - b}. “${a}'den ${b} çıktı, ${a - b} kaldı.”` : `Alınca artar: ${a} + ${b} = ${a + b}. “${a}'in ${b} fazlası ${a + b}.”`,
    })
  }
  // yan yana (≤20, 10'u geçebilir)
  const sub = rng() < 0.45
  const a = sub ? randInt(rng, 5, 20) : randInt(rng, 1, level === 1 ? 9 : 15)
  const b = sub ? randInt(rng, 1, Math.min(level === 1 ? 5 : 9, a)) : randInt(rng, 1, Math.min(9, (level === 1 ? 10 : 20) - a))
  const r = sub ? a - b : a + b
  return numChoice(rng, { prompt: 'İşlemin sonucu kaç?', visual: { kind: 'equation', text: `${a} ${sub ? '−' : '+'} ${b} = ?` }, answer: r, near: consecutive(r).concat([sub ? a + b : Math.abs(a - b)]).filter((x) => x !== r && x >= 0), explain: sub ? `${a}'den geriye doğru ${b} sayarız: sonuç ${r}.` : `Büyük sayıdan başlayıp ileri doğru sayarız: ${Math.max(a, b)}, … ${r}.` })
}

export const esitlik1: Gen = (rng, _g, level) => {
  const kind = pick(rng, level === 1 ? ['terazi', 'bilinmeyen', 'dy'] : ['terazi', 'bilinmeyen', 'aile', 'dy', 'bilinmeyen'])
  if (kind === 'terazi') {
    const total = randInt(rng, 5, 10)
    const a = randInt(rng, 1, total - 1)
    const c = randInt(rng, 1, total - 1)
    return numChoice(rng, { prompt: 'Terazinin dengede kalması için ? yerine hangi sayı gelmeli?', visual: { kind: 'balance', left: { text: `${a} + ${total - a}` }, right: { text: `${c} + ?` }, tilt: 0 }, answer: total - c, near: [total - c + 1, total - c - 1, total].filter((x) => x >= 0 && x !== total - c), explain: `Sol kefe: ${a} + ${total - a} = ${total}. Sağda da ${total} olmalı: ${c} + ${total - c} = ${total}.` })
  }
  if (kind === 'bilinmeyen') {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 2, 9)
    const c = a + b
    const f = pick(rng, [[`? + ${b} = ${c}`, a, `${c} − ${b} = ${a}`], [`${a} + ? = ${c}`, b, `${c} − ${a} = ${b}`], [`${c} − ? = ${a}`, b, `${c} − ${a} = ${b}`], [`? − ${b} = ${a}`, c, `${a} + ${b} = ${c}`]] as [string, number, string][])
    return numChoice(rng, { prompt: 'Verilmeyen sayıyı bul!', visual: { kind: 'equation', text: f[0] }, answer: f[1], near: [f[1] + 1, f[1] - 1, c].filter((x) => x > 0 && x !== f[1]), explain: `Toplama ve çıkarma birbirinin tersidir: ${f[2]}.` })
  }
  if (kind === 'aile') {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, a + 1, 9)
    const c = a + b
    return choice(rng, { prompt: `${a}, ${b} ve ${c} sayılarıyla hangi işlem YAZILAMAZ?`, correct: `${b} − ${a} = ${c}`, wrong: [`${a} + ${b} = ${c}`, `${c} − ${a} = ${b}`, `${c} − ${b} = ${a}`, `${b} + ${a} = ${c}`], max: 3, explain: `İşlem ailesi: ${a} + ${b} = ${c}, ${b} + ${a} = ${c}, ${c} − ${a} = ${b}, ${c} − ${b} = ${a}.` })
  }
  const x = randInt(rng, 1, 5)
  const y = randInt(rng, 1, 5)
  const s = x + y
  const truth = rng() < 0.5
  const z = truth ? s - 1 : s
  return DY(rng, { prompt: `“${x} + ${y} = ${z} + 1” Bu eşitlik doğru mu?`, truth: z + 1 === s, explain: `Sol: ${x} + ${y} = ${s}. Sağ: ${z} + 1 = ${z + 1}. ${s === z + 1 ? 'İki taraf eşit.' : 'İki taraf eşit değil.'}` })
}

/* ============================ 5. TEMA · PARALARIMIZ ============================ */
const NOTES = [5, 10, 20, 50, 100, 200]
export const para1: Gen = (rng, _g, level) => {
  const kind = pick(rng, level === 1 ? ['tani', 'tani', 'madeni', 'buyuk'] : ['tani', 'toplam', 'ode', 'denk', 'buyuk'])
  if (kind === 'tani') {
    const v = pick(rng, [1, ...NOTES])
    return choice(rng, { prompt: 'Bu para kaç lira?', visual: { kind: 'money', items: [v] }, correct: `${v} TL`, wrong: [1, ...NOTES].filter((x) => x !== v).map((x) => `${x} TL`), max: 3, explain: `Bu ${v} Türk lirasıdır (${v} ₺).` })
  }
  if (kind === 'madeni') return choice(rng, { prompt: 'Hangisi MADENÎ paradır?', correct: { visual: { kind: 'money', items: [1] } }, wrong: shuffle(rng, NOTES).slice(0, 2).map((v) => ({ visual: { kind: 'money' as const, items: [v] } })), max: 3, explain: '1 TL madenî paradır; 5, 10, 20, 50, 100 ve 200 TL kâğıt paradır.' })
  if (kind === 'buyuk') {
    const [a, b, c] = shuffle(rng, NOTES).slice(0, 3)
    const big = Math.max(a, b, c)
    return choice(rng, { prompt: 'Hangi para EN DEĞERLİ?', correct: { visual: { kind: 'money', items: [big] } }, wrong: [a, b, c].filter((x) => x !== big).map((v) => ({ visual: { kind: 'money' as const, items: [v] } })), max: 3, explain: `${big} TL bu paraların en büyüğüdür.` })
  }
  if (kind === 'toplam') {
    const items = shuffle(rng, [5, 10, 10, 20, 20, 50]).slice(0, randInt(rng, 2, 3)).sort((x, y) => y - x)
    const sum = items.reduce((s, x) => s + x, 0)
    return numChoice(rng, { prompt: 'Cüzdanda toplam kaç TL var?', visual: { kind: 'money', items }, answer: sum, near: [sum + 5, sum - 5, sum + 10].filter((x) => x > 0), fmt: (n) => `${n} TL`, explain: `${items.join(' + ')} = ${sum} TL.` })
  }
  if (kind === 'ode') {
    const combos = [[20, 10, 5], [20, 20], [10, 10, 5], [50, 20], [20, 5], [50, 10, 5]]
    const right = pick(rng, combos)
    const price = right.reduce((s, x) => s + x, 0)
    const wrongs = combos.filter((c) => c.reduce((s, x) => s + x, 0) !== price).slice(0, 2)
    return choice(rng, { prompt: `${price} TL'lik oyuncağı almak için hangi paraları vermeliyiz? (para üstü yok)`, correct: { visual: { kind: 'money', items: right } }, wrong: shuffle(rng, wrongs).map((w) => ({ visual: { kind: 'money' as const, items: w } })), max: 3, explain: `${right.join(' + ')} = ${price} TL.` })
  }
  const d = pick(rng, [[50, 10, 5], [20, 5, 4], [10, 5, 2], [100, 50, 2], [20, 10, 2]])
  const truth = rng() < 0.5
  const k = truth ? d[2] : d[2] + 1
  return DY(rng, { prompt: `“${d[0]} TL = ${k} tane ${d[1]} TL” Doğru mu?`, truth: k * d[1] === d[0], explain: `${d[2]} tane ${d[1]} TL = ${d[0]} TL.` })
}

/* ============================ 6. TEMA · NESNELERİN GEOMETRİSİ 2 ============================ */
const NAME1: Record<string, string> = { ucgen: 'Üçgen', kare: 'Kare', dikdortgen: 'Dikdörtgen', cember: 'Çember', daire: 'Çember' }
export const sekiller1: Gen = (rng, _g, level) => {
  const kind = pick(rng, level === 1 ? ['ad', 'nesne', 'kose'] : ['ad', 'nesne', 'kose', 'sort', 'ozellik'])
  const shapes: ShapeKind[] = ['ucgen', 'kare', 'dikdortgen', 'cember']
  if (kind === 'ad') {
    const s = pick(rng, shapes)
    return choice(rng, { prompt: 'Bu şeklin adı nedir?', visual: { kind: 'shape', shape: s }, correct: NAME1[s], wrong: shapes.filter((x) => x !== s).map((x) => NAME1[x]), max: 3, explain: s === 'cember' ? 'Çemberin kenarı ve köşesi yoktur, içi boştur.' : `${NAME1[s]}: ${s === 'ucgen' ? '3 kenar, 3 köşe' : s === 'kare' ? '4 eşit kenar, 4 köşe' : '4 kenar, 4 köşe; karşılıklı kenarlar eşit'}.` })
  }
  if (kind === 'nesne') {
    const o = pick(rng, [['pizza', 'Pizza dilimi', 'ucgen'], ['coin', 'Para', 'cember'], ['book', 'Kitap', 'dikdortgen'], ['clock', 'Saat', 'cember'], ['laptop', 'Bilgisayar ekranı', 'dikdortgen']] as [string, string, ShapeKind][])
    return choice(rng, { prompt: `${o[1]} hangi şekle benzer?`, visual: { kind: 'image', img: o[0], size: 140 }, correct: { visual: { kind: 'shape', shape: o[2], scale: 0.7 } }, wrong: shapes.filter((x) => x !== o[2]).slice(0, 2).map((x) => ({ visual: { kind: 'shape' as const, shape: x, scale: 0.7 } })), max: 3, explain: `${o[1]} ${NAME1[o[2]].toLocaleLowerCase('tr-TR')} biçimindedir.` })
  }
  if (kind === 'kose') {
    const s = pick(rng, ['ucgen', 'kare', 'dikdortgen', 'cember'] as ShapeKind[])
    const corners = s === 'ucgen' ? 3 : s === 'cember' ? 0 : 4
    const askEdge = rng() < 0.5
    return numChoice(rng, { prompt: `Bu şeklin kaç ${askEdge ? 'kenarı' : 'köşesi'} var?`, visual: { kind: 'shape', shape: s }, answer: corners, near: [3, 4, 0, 5].filter((x) => x !== corners), explain: 'Şekli sınırlayan çizgiler kenar, kenarların birleştiği noktalar köşedir.' })
  }
  if (kind === 'ozellik') return choice(rng, { prompt: 'Kenarı ve köşesi OLMAYAN şekil hangisi?', correct: { visual: { kind: 'shape', shape: 'cember', scale: 0.7 } }, wrong: (['ucgen', 'kare', 'dikdortgen'] as ShapeKind[]).map((x) => ({ visual: { kind: 'shape' as const, shape: x, scale: 0.7 } })), max: 3, explain: 'Çemberin kenarı ve köşesi yoktur.' })
  return sort(rng, {
    prompt: 'Nesneleri KÖŞELİ ve KÖŞESİZ diye ayır!',
    bins: [
      { id: 'koseli', label: 'Köşeli', color: '#ff9a2e' },
      { id: 'kosesiz', label: 'Köşesiz', color: '#2ec4c9' },
    ],
    items: [
      { img: 'book', label: 'Kitap', bin: 'koseli' }, { img: 'pizza', label: 'Pizza dilimi', bin: 'koseli' }, { img: 'laptop', label: 'Bilgisayar', bin: 'koseli' }, { img: 'calendar', label: 'Takvim', bin: 'koseli' },
      { img: 'coin', label: 'Para', bin: 'kosesiz' }, { img: 'ball', label: 'Top', bin: 'kosesiz' }, { img: 'orange', label: 'Portakal', bin: 'kosesiz' }, { img: 'clock', label: 'Saat', bin: 'kosesiz' },
    ],
    explain: 'Köşesi olan nesneler köşeli, yuvarlak olanlar köşesizdir.',
  })
}

/* ============================ 7. TEMA · VERİYE DAYALI ARAŞTIRMA ============================ */
const CATS: [string, string][] = [['apple', 'Elma'], ['banana', 'Muz'], ['strawberry', 'Çilek'], ['grapes', 'Üzüm'], ['orange', 'Portakal']]
const ANI2: [string, string][] = [['duck', 'Ördek'], ['chicken', 'Tavuk'], ['cow', 'İnek'], ['sheep', 'Koyun']]
export const veri1: Gen = (rng, _g, level) => {
  const set = rng() < 0.5 ? CATS : ANI2
  const n = level === 1 ? 3 : 4
  const cats = shuffle(rng, set).slice(0, n)
  let counts = cats.map(() => randInt(rng, 2, level === 1 ? 7 : 10))
  // en çok/en az tek olsun
  while (new Set(counts).size !== counts.length) counts = cats.map(() => randInt(rng, 2, 10))
  const rows = cats.map(([img, label], i) => ({ img, label, count: counts[i] }))
  const tally = rng() < 0.35
  const visual = tally ? ({ kind: 'tally', rows } as const) : ({ kind: 'pictograph', rows } as const)
  const kind = pick(rng, level === 1 ? ['cok', 'az', 'kac'] : ['cok', 'az', 'fark', 'toplam', 'kac'])
  if (kind === 'cok' || kind === 'az') {
    const target = kind === 'cok' ? Math.max(...counts) : Math.min(...counts)
    const i = counts.indexOf(target)
    return choice(rng, { prompt: `${tally ? 'Çetele tablosuna' : 'Nesne grafiğine'} göre EN ${kind === 'cok' ? 'ÇOK' : 'AZ'} hangisi seçilmiş?`, visual, correct: cats[i][1], wrong: cats.filter((_, k) => k !== i).map((c) => c[1]), max: 3, explain: `${cats.map(([, l], k) => `${l} ${counts[k]}`).join(', ')}. En ${kind === 'cok' ? 'çok' : 'az'}: ${cats[i][1]}.` })
  }
  if (kind === 'kac') {
    const i = randInt(rng, 0, n - 1)
    return numChoice(rng, { prompt: `${cats[i][1]} kaç kişi tarafından seçilmiş?`, visual, answer: counts[i], near: consecutive(counts[i]), explain: tally ? `Çetelede 5'li demetleri ve tek çizgileri sayarız: ${counts[i]}.` : `${cats[i][1]} satırındaki resimleri sayarız: ${counts[i]}.` })
  }
  const [i, j] = [0, 1]
  if (kind === 'fark') {
    const d = Math.abs(counts[i] - counts[j])
    const more = counts[i] > counts[j] ? i : j
    return numChoice(rng, { prompt: `${cats[more][1]}, ${cats[more === i ? j : i][1].toLocaleLowerCase('tr-TR')}dan kaç fazla seçilmiş?`.replace(/([aıou][^aeıioöuü]*)dan kaç/, '$1dan kaç'), visual, answer: d, near: [d + 1, d - 1, counts[more]].filter((x) => x >= 0 && x !== d), explain: `${counts[more]} − ${counts[more === i ? j : i]} = ${d}.` })
  }
  const sum = counts[i] + counts[j]
  return numChoice(rng, { prompt: `${cats[i][1]} ve ${cats[j][1].toLocaleLowerCase('tr-TR')} toplam kaç kez seçilmiş?`, visual, answer: sum, near: [sum + 1, sum - 1, sum + 2], explain: `${counts[i]} + ${counts[j]} = ${sum}.` })
}

/* ============================ TEMA DEĞERLENDİRME ============================ */
/** Kitaptaki gibi: tema sonunda o temanın tüm bölümlerinden karışık sorular */
export const temaDegerlendirme = (gens: Gen[]): Gen => (rng, g, l, h) => {
  const used = h.length
  return gens[(used + Math.floor(rng() * gens.length)) % gens.length](rng, g, Math.max(2, l) as Level, h)
}

export const _unused: BankItem[] = []
export type { Question }
export { fromBank }
