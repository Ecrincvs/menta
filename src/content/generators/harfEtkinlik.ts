/**
 * HARF ADASI ETKİNLİKLERİ — her harf için ayrıntılı ilk okuma yazma etkinlikleri + sonda harf oyunu.
 * Akış (MEB İlk Okuma Yazma kitabının sayfa sırası): ses → harf → yazma → hece → kelime → cümle → metin.
 * Kural: öğrencinin OKUDUĞU her öğe (seçenek, parça, tuş, metin) yalnızca o harfe kadar öğrenilmiş harflerden oluşur (testli).
 * Yönergeler sesli okunur (öğrenci okumak zorunda değildir).
 */
import { pick, shuffle, type Rng } from '../../learning/rng'
import { choice, input, match, memory, order, type Gen } from './helpers'
import { LETTER_ORDER, heceler, isAllowed } from '../letters'
import { STAGES, stageOf } from '../okumaYazma'
import { PIC } from './tr1'
import { LETTER_SOUNDS } from '../../audio/speech'
import { upperTR } from '../words'
import type { PopQ, Question, SearchQ, TraceQ } from '../../games/quiz/types'

export type HarfKind = 'dinle' | 'nerede' | 'avi' | 'yaz' | 'tablo' | 'hece' | 'tren' | 'resim' | 'kayip' | 'dikte' | 'cumle' | 'okuma' | 'oyun'

export const KIND_INFO: Record<HarfKind, { title: string; icon: string; total: number; blurb: string }> = {
  dinle: { title: 'Sesi Dinle', icon: 'ear', total: 5, blurb: 'Sesi duy, resmi bul' },
  nerede: { title: 'Ses Nerede?', icon: 'magnifier', total: 5, blurb: 'Başta mı, ortada mı, sonda mı?' },
  avi: { title: 'Harf Avı', icon: 'target', total: 6, blurb: 'Küçük ve büyük harfi yakala' },
  yaz: { title: 'Yazalım', icon: 'pencil', total: 4, blurb: 'Harfi parmağınla yaz' },
  tablo: { title: 'Hece Tablosu', icon: 'puzzle', total: 6, blurb: 'Sesleri birleştir, hece yap' },
  hece: { title: 'Hece Oku', icon: 'speaker', total: 6, blurb: 'Duyduğun heceyi bul' },
  tren: { title: 'Kelime Treni', icon: 'train', total: 5, blurb: 'Heceleri diz, kelime kur' },
  resim: { title: 'Resim ve Kelime', icon: 'paint', total: 5, blurb: 'Kelimeyi resmiyle eşleştir' },
  kayip: { title: 'Kayıp Harf', icon: 'key', total: 5, blurb: 'Eksik harfi tamamla' },
  dikte: { title: 'Dikte', icon: 'memo', total: 5, blurb: 'Duyduğunu harflerle yaz' },
  cumle: { title: 'Cümle Kur', icon: 'link', total: 5, blurb: 'Kelimeleri sırala' },
  okuma: { title: 'Okuyorum', icon: 'openbook', total: 5, blurb: 'Cümle ve metin oku' },
  oyun: { title: 'Harf Oyunu', icon: 'videogame', total: 3, blurb: 'Ödül oyunu!' },
}

const VOWELS = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']
const LOOKALIKE: Record<string, string[]> = { b: ['d', 'p'], d: ['b'], p: ['b'], n: ['m', 'u'], m: ['n'], u: ['n', 'ü'], ü: ['u'], ı: ['i', 'l'], i: ['ı', 'l'], l: ['i', 't'], o: ['ö'], ö: ['o'], c: ['ç'], ç: ['c'], s: ['ş'], ş: ['s'], g: ['ğ'], ğ: ['g'], e: ['a'], a: ['e', 'o'], t: ['l'], k: ['t'], r: ['n'], y: ['v'], v: ['y'], z: ['s'], h: ['n'], f: ['t'], j: ['i'] }
const lower = (s: string) => s.toLocaleLowerCase('tr-TR')
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1)
const uniq = <T,>(a: T[]) => Array.from(new Set(a))
const isName = (w: string) => w.charAt(0) !== lower(w.charAt(0))

/** Harfe kadar öğrenilmiş her şey */
function ctx(letter: string) {
  const idx = LETTER_ORDER.indexOf(letter)
  const learned = LETTER_ORDER.slice(0, idx + 1)
  const st = STAGES.slice(0, idx + 1)
  const cur = stageOf(letter)
  const ok = (t: string) => isAllowed(t, idx)
  const vs = learned.filter((c) => VOWELS.includes(c))
  const cs = learned.filter((c) => !VOWELS.includes(c))
  // hece tablosu: harf + öğrenilmiş ünlüler (ünlüyse: öğrenilmiş ünsüzler); ğ hece başında olmaz
  const combos = VOWELS.includes(letter)
    ? cs.flatMap((c) => [c + letter, letter + c])
    : vs.flatMap((v) => (letter === 'ğ' ? [v + letter] : [letter + v, v + letter]))
  const allWords = uniq(st.flatMap((s) => s.kelimeler)).filter(ok)
  const words = uniq(cur.kelimeler).filter(ok)
  const withL = (w: string) => lower(w).includes(letter)
  const pics = PIC.filter(([w]) => ok(w))
  return {
    idx,
    learned,
    cur,
    sound: LETTER_SOUNDS[letter] ?? letter,
    combos: uniq([...cur.heceler, ...combos]).filter(ok),
    allHece: uniq([...st.flatMap((s) => s.heceler)]).filter(ok),
    words: words.filter(withL).length ? words.filter(withL) : words,
    allWords,
    lowerWords: allWords.filter((w) => !isName(w)),
    sentences: uniq(st.flatMap((s) => s.cumleler ?? [])).filter(ok),
    picsWith: PIC.filter(([w]) => w.includes(letter)),
    picsWithout: PIC.filter(([w]) => !w.includes(letter)),
    readPics: pics,
  }
}

/** Bu harfte hangi etkinlikler var? (içerik yetmeyenler kendiliğinden atlanır) */
export function harfEtkinlikleri(letter: string): HarfKind[] {
  const c = ctx(letter)
  const k: HarfKind[] = []
  if (c.picsWith.length >= 2 && c.picsWithout.length >= 2) k.push('dinle')
  if (positionWords(letter).length >= 2) k.push('nerede')
  k.push('avi', 'yaz')
  if (c.combos.length >= 2) k.push('tablo', 'hece')
  if (c.words.filter((w) => heceler(w).length >= 2).length >= 1) k.push('tren')
  if (c.readPics.length >= 3) k.push('resim')
  if (c.words.some((w) => withLetterIdx(w, letter) >= 0 && w.length >= 3)) k.push('kayip')
  if (dikteItems(letter).length >= 3) k.push('dikte')
  if (c.cur.cumleler?.length) k.push('cumle')
  if (c.sentences.length >= 3) k.push('okuma')
  k.push('oyun')
  return k
}

const withLetterIdx = (w: string, l: string) => lower(w).indexOf(l)
const positionWords = (letter: string) => ctx(letter).allWords.filter((w) => lower(w).split(letter).length === 2 && w.length >= 2)
function dikteItems(letter: string) {
  const c = ctx(letter)
  const ws = c.lowerWords.filter((w) => w.length <= 5 && lower(w).includes(letter))
  return uniq([...c.combos, ...ws])
}

/** Daha önce sorulmamış öğeyi seç */
function fresh<T>(rng: Rng, list: T[], used: Set<string>, key: (t: T) => string): T {
  const left = list.filter((x) => !used.has(key(x)))
  return pick(rng, left.length ? left : list)
}
const usedFrom = (history: Question[]) => new Set(history.map((h) => (h as { tag?: string }).tag ?? h.prompt + JSON.stringify((h as { answer?: unknown }).answer)))
const tag = <Q extends Question>(q: Q, t: string): Q => Object.assign(q, { tag: t })

function make(letter: string, kind: HarfKind, rng: Rng, history: Question[]): Question {
  const c = ctx(letter)
  const L = letter
  const U = upperTR(letter)
  const used = usedFrom(history)
  const i = history.length

  switch (kind) {
    case 'dinle': {
      // (1) bu sesi içeren resmi bul  (2) bu ses OLMAYAN resmi bul
      if (i % 3 === 2 && c.picsWith.length >= 2) {
        const [w, img] = fresh(rng, c.picsWithout, used, ([x]) => x)
        const yes = shuffle(rng, c.picsWith).slice(0, 2)
        return tag(choice(rng, { prompt: `Hangisinin adında “${L}” sesi YOK?`, spoken: `Dikkat! Hangisinin adında ${c.sound} sesi yok? Resimlerin adını içinden söyle.`, correct: { img }, wrong: yes.map(([, im]) => ({ img: im })), max: 3, explain: `${cap(w)} kelimesinde “${L}” sesi yok.` }), w)
      }
      const [w, img] = fresh(rng, c.picsWith, used, ([x]) => x)
      const wrong = shuffle(rng, c.picsWithout).slice(0, 2)
      return tag(choice(rng, { prompt: `Adında “${L}” sesi olan resim hangisi?`, spoken: `Adında ${c.sound} sesi olan resmi bul! Resimlerin adını içinden söyle.`, correct: { img }, wrong: wrong.map(([, im]) => ({ img: im })), max: 3, explain: `${cap(w)}: ${heceler(w).join(' - ')}. Bu kelimede “${L}” sesi var.` }), w)
    }
    case 'nerede': {
      const w = fresh(rng, positionWords(L), used, (x) => x)
      const lw = lower(w)
      const pos = lw.indexOf(L)
      const ans = pos === 0 ? 'Başında' : pos === lw.length - 1 ? 'Sonunda' : 'Ortasında'
      // seçenekler yazı değil şema: ■□□ başında · □■□ ortasında · □□■ sonunda (sesli okunur)
      const POS: Record<string, string[]> = { Başında: ['■', '□', '□'], Ortasında: ['□', '■', '□'], Sonunda: ['□', '□', '■'] }
      const opt = (k: string) => ({ visual: { kind: 'sequence' as const, items: POS[k] } })
      const pic = PIC.find(([x]) => x === lw)
      return tag(
        choice(rng, {
          prompt: `“${w}” kelimesinde “${L}” sesi nerede?`,
          spoken: `${w}. Bu kelimede ${c.sound} sesi nerede? Başında mı, ortasında mı, sonunda mı?`,
          visual: { kind: 'word', word: lw, hide: [], img: pic?.[1] },
          correct: opt(ans),
          wrong: ['Başında', 'Ortasında', 'Sonunda'].filter((x) => x !== ans).map(opt),
          keepOrder: true,
          max: 3,
          explain: `${w}: ${lw.split('').join(' - ')}. “${L}” sesi kelimenin ${ans === 'Başında' ? 'başında' : ans === 'Sonunda' ? 'sonunda' : 'ortasında'}.`,
        }),
        w,
      )
    }
    case 'avi': {
      // (1) küçük harf baloncukları (2) büyük harf (3) küçük–büyük eşleştir
      if (i % 3 === 2 && c.learned.length >= 3) {
        const set = uniq([L, ...shuffle(rng, c.learned.filter((x) => x !== L))]).slice(0, 4)
        return tag(match({ prompt: 'Küçük harfi büyük harfiyle eşleştir!', spoken: 'Her küçük harfi büyük harfiyle eşleştir.', pairs: set.map((x) => ({ left: { label: x }, right: { label: upperTR(x) } })), explain: set.map((x) => `${x} – ${upperTR(x)}`).join(', ') }), `m${i}`)
      }
      const up = i % 3 === 1
      const show = (x: string) => (up ? upperTR(x) : x)
      const sim = (LOOKALIKE[L] ?? []).filter((x) => c.learned.includes(x))
      let others = uniq([...sim, ...shuffle(rng, c.learned.filter((x) => x !== L && !sim.includes(x)))]).slice(0, 4)
      if (!others.length) others = L === 'a' ? [] : ['a']
      if (others.length < 1) {
        // yalnızca "a" öğrenildi: aynı harfin küçük ve büyük biçimi
        return tag(choice(rng, { prompt: `Büyük “${U}” hangisi?`, spoken: `Büyük ${c.sound} harfini bul!`, correct: U, wrong: [L], max: 2, layout: 'bubbles', explain: `Küçük harf “${L}”, büyük harf “${U}”.` }), `a${i}`)
      }
      return tag(choice(rng, { prompt: `“${show(L)}” harfini yakala!`, spoken: `${up ? 'Büyük' : 'Küçük'} ${c.sound} harfini yakala!`, correct: show(L), wrong: others.map(show), max: 5, layout: 'bubbles', explain: `“${c.sound}” sesinin harfi: ${L} – ${U}.` }), `b${i}`)
    }
    case 'yaz': {
      const ch = i % 2 === 0 ? L : U
      const q: TraceQ = { type: 'trace', letter: ch, prompt: `“${ch}” harfini parmağınla yaz! Çizginin üstünden geç.`, spoken: `${i % 2 === 0 ? 'Küçük' : 'Büyük'} ${c.sound} harfini parmağınla yaz. Yukarıdan başla.`, explain: 'Harfi yazarken yukarıdan aşağıya ve soldan sağa doğru ilerleriz.' }
      return q
    }
    case 'tablo': {
      const h = fresh(rng, c.combos, used, (x) => x)
      const [a, b] = [h.slice(0, h.length - 1), h.slice(-1)]
      const swap = h.split('').reverse().join('')
      const other = c.combos.filter((x) => x !== h && x !== swap)
      const wrong = uniq([swap, ...shuffle(rng, other)]).filter((x) => x !== h && isAllowed(x, c.idx)).slice(0, 2)
      return tag(choice(rng, { prompt: `${a} + ${b} = ?`, spoken: `${a} ile ${b} birleşince hangi hece olur?`, visual: { kind: 'equation', text: `${a} + ${b} = ?` }, correct: h, wrong: wrong.length ? wrong : [L + L], max: 3, explain: `${a} ve ${b} sesleri birleşince “${h}” hecesi olur.` }), h)
    }
    case 'hece': {
      const h = fresh(rng, c.combos, used, (x) => x)
      const wrong = shuffle(rng, uniq([...c.combos, ...c.allHece]).filter((x) => x !== h))
      return tag(choice(rng, { prompt: 'Duyduğun heceyi bul! 🔊', spoken: `${h}. Duyduğun heceyi bul: ${h}`, correct: h, wrong: wrong.length ? wrong : [h.split('').reverse().join('')], max: 3, explain: `Duyduğun hece “${h}”.` }), h)
    }
    case 'tren': {
      const list = c.words.filter((w) => heceler(w).length >= 2)
      const w = fresh(rng, list, used, (x) => x)
      const pic = PIC.find(([x]) => x === lower(w))
      const parts = heceler(w)
      const pieces = isName(w) ? [cap(parts[0]), ...parts.slice(1)] : parts
      return tag(order({ prompt: 'Hece Treni', spoken: `${w}. Heceleri sırayla diz.`, img: pic?.[1], pieces, joiner: '', style: 'train', explain: `${w}: ${parts.join(' - ')}.` }), w)
    }
    case 'resim': {
      // (1) resme bak, kelimeyi seç  (2) üç kelimeyi resimleriyle eşleştir
      const pics = c.readPics
      if (i % 2 === 1 && pics.length >= 3) {
        const set = shuffle(rng, pics).slice(0, 3)
        return tag(match({ prompt: 'Kelimeleri resimleriyle eşleştir!', spoken: 'Her kelimeyi oku ve resmiyle eşleştir.', pairs: set.map(([w, img]) => ({ left: { label: w }, right: { img } })), explain: set.map(([w]) => w).join(', ') }), `m${i}`)
      }
      const pref = pics.filter(([w]) => w.includes(L))
      const [w, img] = fresh(rng, pref.length ? pref : pics, used, ([x]) => x)
      const wrong = shuffle(rng, pics.filter(([x]) => x !== w)).slice(0, 2).map(([x]) => x)
      return tag(choice(rng, { prompt: 'Bu resmin adını oku ve bul!', spoken: 'Resme bak. Adı hangi kelime? Oku ve bul.', visual: { kind: 'image', img, size: 140 }, correct: w, wrong, max: 3, explain: `Resimdeki: ${w} (${heceler(w).join(' - ')}).` }), w)
    }
    case 'kayip': {
      const list = c.words.filter((w) => withLetterIdx(w, L) >= 0 && w.length >= 3)
      const w = fresh(rng, list, used, (x) => x)
      const at = withLetterIdx(w, L)
      const wrong = uniq([...(LOOKALIKE[L] ?? []).filter((x) => c.learned.includes(x)), ...shuffle(rng, c.learned.filter((x) => x !== L))]).filter((x) => x !== L)
      const pic = PIC.find(([x]) => x === lower(w))
      return tag(choice(rng, { prompt: 'Kelimedeki kayıp harfi bul!', spoken: `${w}. Kayıp harfi bul.`, visual: { kind: 'word', word: lower(w), hide: [at], img: pic?.[1] }, correct: L, wrong, max: 3, explain: `${w} kelimesinde kayıp harf “${L}”.` }), w)
    }
    case 'dikte': {
      const items = dikteItems(L)
      const ans = lower(fresh(rng, items, used, (x) => x))
      const extra = shuffle(rng, c.learned.filter((x) => !ans.includes(x))).slice(0, Math.max(2, 7 - uniq(ans.split('')).length))
      const keys = shuffle(rng, uniq([...ans.split(''), ...extra])).slice(0, 9)
      for (const ch of ans) if (!keys.includes(ch)) keys.push(ch)
      return tag(input({ prompt: 'Duyduğunu harflerle yaz! 🔊', spoken: `${ans}. Duyduğunu harflerle yaz: ${ans}`, answer: ans, keys, explain: `Yazılışı: ${ans.split('').join(' - ')}.`, hint: 'Yavaşça söyle ve her sesi sırayla yaz.' }), ans)
    }
    case 'cumle': {
      const list = uniq([...(c.cur.cumleler ?? []), ...c.sentences]).filter((s) => s.split(' ').length >= 2 && s.split(' ').length <= 6)
      const s = fresh(rng, list, used, (x) => x)
      return tag(order({ prompt: 'Kelimeleri sırala, cümleyi kur!', spoken: s, pieces: s.split(' '), joiner: ' ', style: 'chain', explain: `Cümle: “${s}”. Cümle büyük harfle başlar, nokta ile biter.` }), s)
    }
    case 'okuma': {
      // son soru: metin (varsa); diğerleri: duyduğun cümleyi bul
      if (c.cur.metin && i === KIND_INFO.okuma.total - 1) {
        const m = c.cur.metin
        return tag(choice(rng, { prompt: m.q, correct: m.a, wrong: m.w, max: 3, layout: 'wide', passage: { title: `${U} Metni`, text: m.text }, spoken: `${m.text} Soru: ${m.q}`, explain: `Cevap metinde: ${m.a}.` }), 'metin')
      }
      const s = fresh(rng, c.sentences, used, (x) => x)
      const wrong = shuffle(rng, c.sentences.filter((x) => x !== s)).slice(0, 2)
      return tag(choice(rng, { prompt: 'Duyduğun cümleyi bul ve oku! 🔊', spoken: `${s} Duyduğun cümleyi bul.`, correct: s, wrong, max: 3, layout: 'wide', explain: `Duyduğun cümle: “${s}”` }), s)
    }
    case 'oyun':
      return game(letter, rng, history)
  }
}

/** Harf oyunu türü: harfe göre dönüşümlü (Balon Patlat · Hafıza · Kelime Avı) */
export function oyunTuru(letter: string): 'pop' | 'memory' | 'search' {
  const idx = LETTER_ORDER.indexOf(letter)
  const t = (['pop', 'memory', 'search'] as const)[idx % 3]
  if (t === 'search' && searchWords(letter).length < 3) return 'pop'
  if (t === 'memory' && ctx(letter).learned.length < 3) return 'pop'
  return t
}
const searchWords = (letter: string) => ctx(letter).lowerWords.filter((w) => w.length >= 3 && w.length <= 5)

function game(letter: string, rng: Rng, history: Question[]): Question {
  const c = ctx(letter)
  const L = letter
  const i = history.length
  const t = oyunTuru(letter)
  if (t === 'memory') {
    if (i === 1 && c.readPics.length >= 3) {
      const set = shuffle(rng, c.readPics).slice(0, 4)
      return memory({ prompt: 'Kelime ile resmin eşini bul!', spoken: 'Kartları çevir. Her kelimeyi resmiyle eşleştir.', pairs: set.map(([w, img]) => ({ a: { label: w }, b: { img } })), explain: 'Harika hafıza!' })
    }
    const set = uniq([L, ...shuffle(rng, c.learned.filter((x) => x !== L))]).slice(0, i === 2 ? 5 : 4)
    return memory({ prompt: 'Küçük harfin büyük eşini bul!', spoken: 'Kartları çevir. Her küçük harfi büyük harfiyle eşleştir.', pairs: set.map((x) => ({ a: { label: x }, b: { label: upperTR(x) } })), explain: 'Harika hafıza!' })
  }
  if (t === 'search') {
    const words = shuffle(rng, searchWords(letter)).slice(0, i === 0 ? 3 : 4).map(lower)
    return wordSearch(rng, words, c.learned, `Tablodaki ${words.length} kelimeyi bul!`)
  }
  // Balon Patlat: 1 küçük harf · 2 büyük harf · 3 hece (varsa)
  const heceOthers = c.allHece.filter((h) => !h.includes(L))
  if (i === 2 && c.combos.length >= 2 && heceOthers.length >= 3) {
    const targets = shuffle(rng, c.combos).slice(0, 3)
    const others = shuffle(rng, heceOthers).slice(0, 5)
    const items = [...targets, ...targets.slice(0, 1), ...others]
    const need = items.filter((x) => x.includes(L)).length
    const q: PopQ = { type: 'pop', target: L, items: shuffle(rng, items), need, prompt: `İçinde “${L}” olan heceleri patlat!`, spoken: `İçinde ${c.sound} sesi olan heceleri patlat!`, explain: `“${L}” sesi olan heceler: ${uniq(targets).join(', ')}.` }
    return q
  }
  const up = i % 2 === 1
  const show = (x: string) => (up ? upperTR(x) : x)
  const others = c.learned.filter((x) => x !== L)
  // yalnızca “a” öğrenildiyse çeldirici olarak harf değil şekil (öğrenilmemiş harf gösterilmez)
  const fill = others.length ? others : ['★', '●', '■']
  const items = shuffle(rng, [...Array(4).fill(show(L)), ...Array.from({ length: 6 }, (_, k) => show(fill[k % fill.length]))])
  const q: PopQ = { type: 'pop', target: show(L), items, need: 4, prompt: `“${show(L)}” balonlarını patlat!`, spoken: `${up ? 'Büyük' : 'Küçük'} ${c.sound} harfi olan balonları patlat!`, explain: `Bütün “${show(L)}” balonlarını buldun!` }
  return q
}

/** Kelime avı tablosu: kelimeler yatay (soldan sağa) veya dikey (yukarıdan aşağı), çakışmasız */
export function wordSearch(rng: Rng, words: string[], letters: string[], prompt: string): SearchQ {
  const size = Math.max(5, Math.min(7, Math.max(...words.map((w) => w.length)) + 2))
  for (let attempt = 0; attempt < 60; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
    const placed: SearchQ['placed'] = []
    let ok = true
    for (const w of words) {
      let done = false
      for (let t = 0; t < 60 && !done; t++) {
        const dir = rng() < 0.5 ? 'h' : 'v'
        const r = Math.floor(rng() * (dir === 'v' ? size - w.length + 1 : size))
        const c0 = Math.floor(rng() * (dir === 'h' ? size - w.length + 1 : size))
        const cells = w.split('').map((_, k) => (dir === 'h' ? [r, c0 + k] : [r + k, c0]) as [number, number])
        if (cells.every(([y, x], k) => grid[y][x] === null || grid[y][x] === w[k])) {
          cells.forEach(([y, x], k) => (grid[y][x] = w[k]))
          placed.push({ word: w, cells })
          done = true
        }
      }
      if (!done) ok = false
    }
    if (!ok) continue
    const fillers = letters.length ? letters : ['a']
    const g = grid.map((row) => row.map((ch) => ch ?? pick(rng, fillers)))
    return { type: 'search', prompt, spoken: `Tabloda saklanan kelimeleri bul: ${words.join(', ')}. Kelimenin ilk harfine dokun ve parmağını kaydır.`, grid: g, words, placed, explain: `Bulduğun kelimeler: ${words.join(', ')}.` }
  }
  throw new Error('kelime avı yerleşmedi')
}

/** Etkinlik üreticisi: oy-<harf>-<tür> */
export const harfGen = (letter: string, kind: HarfKind): Gen => (rng, _g, _l, history) => make(letter, kind, rng, history)
