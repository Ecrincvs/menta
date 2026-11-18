/**
 * 1. SINIF TÜRKÇE — MEB İlk Okuma Yazma Kitabı (1–2) ve Türkçe Ders Kitabı (1–2) etkinlik türlerine göre.
 * Kaynak analiz: docs/meb-kitaplar/analiz/turkce-1.md (şablon #1–37).
 * KURAL: İlk okuma yazma etkinliklerinde her öğe yalnızca öğrenilmiş harflerden oluşur (learnedIdx).
 * Kitaptaki metinler kopyalanmaz; cümle ve metinler özgündür, harf kuralı otomatik denetlenir.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { choice, numChoice, order, type Gen } from './helpers'
import { LETTER_ORDER, MILESTONE, heceler, isAllowed, learnedIdx, learnedLetters, requiredIdx } from '../letters'
import { LETTER_SOUNDS } from '../../audio/speech'
import { upperTR } from '../words'
import { WEB_SENTENCES } from '../webBank'
import type { Question } from '../../games/quiz/types'

/* ---------------- resimli kelime bankası (görselli, kitapla uyumlu) ---------------- */
export const PIC: [string, string][] = [
  ['at', 'horse'], ['el', 'hand'], ['lale', 'tulip'], ['inek', 'cow'], ['okul', 'school'], ['kulak', 'ear'], ['kalem', 'pencil'], ['armut', 'pear'], ['elma', 'apple'],
  ['mum', 'candle'], ['limon', 'lemon'], ['ekmek', 'bread'], ['arı', 'bee'], ['süt', 'milk'], ['saat', 'clock'], ['aslan', 'lion'], ['ay', 'moon'], ['ayı', 'bear'],
  ['yumurta', 'egg'], ['kedi', 'cat'], ['ördek', 'duck'], ['domates', 'tomato'], ['dondurma', 'icecream'], ['üzüm', 'grapes'], ['muz', 'banana'], ['mantar', 'mushroom'],
  ['maymun', 'monkey'], ['tren', 'train'], ['roket', 'rocket'], ['yıldız', 'star'], ['dinozor', 'dino'], ['salyangoz', 'snail'], ['zebra', 'zebra'], ['zürafa', 'giraffe'],
  ['çiçek', 'flower'], ['çilek', 'strawberry'], ['çanta', 'backpack'], ['uçak', 'airplane'], ['balık', 'fish'], ['balon', 'balloon'], ['otobüs', 'bus'], ['araba', 'car'],
  ['kelebek', 'butterfly'], ['bisiklet', 'bicycle'], ['gemi', 'ship'], ['gözlük', 'glasses'], ['güneş', 'sun'], ['civciv', 'chick'], ['köpek', 'dog'], ['kuş', 'bird'],
  ['şemsiye', 'umbrella'], ['kitap', 'book'], ['top', 'ball'], ['pasta', 'cake'], ['portakal', 'orange'], ['peynir', 'cheese'], ['penguen', 'penguin'], ['horoz', 'rooster'],
  ['havuç', 'carrot'], ['tavşan', 'rabbit'], ['tavuk', 'chicken'], ['ağaç', 'tree'], ['kurbağa', 'frog'], ['kaplumbağa', 'turtle'], ['fare', 'mouse'], ['fil', 'elephant'],
  ['eldiven', 'gloves'], ['ev', 'house'], ['bal', 'honey'], ['baykuş', 'owl'], ['karpuz', 'watermelon'], ['kurt', 'wolf'], ['koyun', 'sheep'], ['göz', 'eyes'],
]
const picAllowed = (idx = learnedIdx()) => PIC.filter(([w]) => isAllowed(w, idx))
const cap = (s: string) => upperTR(s.charAt(0)) + s.slice(1)

/** öğrenilmiş harflere göre ad listesi (kitaptaki gibi her harfle yeni bir çocuk adı) */
const NAMES = ['Ela', 'Nil', 'Ali', 'Onat', 'Okan', 'İlke', 'Utku', 'Rana', 'Anıl', 'Mine', 'Ümit', 'Suna', 'Ömer', 'Oya', 'Dilek', 'Zeki', 'Çetin', 'Burak', 'Gamze', 'Can', 'Şule', 'Pınar', 'Hasan', 'Fatma', 'Jale']
const namesAllowed = () => NAMES.filter((n) => isAllowed(n))

/* ============================ A. SES VE HARF ============================ */
const LOOKALIKE: Record<string, string[]> = { b: ['d', 'p'], d: ['b'], p: ['b', 'r'], n: ['m', 'u'], m: ['n'], u: ['n', 'ü'], ı: ['i', 'l'], i: ['ı', 'l'], l: ['i', 'ı'], o: ['ö'], ö: ['o'], u2: [], c: ['ç'], ç: ['c'], s: ['ş'], ş: ['s'], g: ['ğ'], ğ: ['g'] }

/** Harf Avı: dinle → harfi yakala (küçük/büyük), benzer harfler çeldirici */
export const harfAvi1: Gen = (rng, _g, level) => {
  const letters = learnedLetters()
  const recent = letters.slice(-6)
  const target = rng() < 0.6 ? pick(rng, recent) : pick(rng, letters)
  const upper = level >= 2 && rng() < 0.4
  const show = (c: string) => (upper ? upperTR(c) : c)
  const n = level === 1 ? 3 : 4
  const similar = (LOOKALIKE[target] ?? []).filter((c) => letters.includes(c))
  const others = [...similar, ...shuffle(rng, letters.filter((c) => c !== target && !similar.includes(c)))].slice(0, n - 1)
  return choice(rng, {
    prompt: `“${show(target)}” harfini yakala!`,
    spoken: `${LETTER_SOUNDS[target] ?? target} sesini yakala!`,
    correct: show(target),
    wrong: others.map(show),
    max: n,
    layout: 'bubbles',
    explain: `Bu sesin harfi: küçük “${target}”, büyük “${upperTR(target)}”.`,
  })
}

/** Sesi Bul: hangi resmin adında bu ses var? (T.D.1.1.a) */
export const sesiBul: Gen = (rng) => {
  const words = picAllowed()
  const letters = learnedLetters()
  for (let t = 0; t < 30; t++) {
    const target = pick(rng, letters.slice(-8))
    const yes = words.filter(([w]) => w.includes(target))
    const no = words.filter(([w]) => !w.includes(target))
    if (!yes.length || no.length < 2) continue
    const [w, img] = pick(rng, yes)
    const pos = w.startsWith(target) ? 'başında' : w.endsWith(target) ? 'sonunda' : 'içinde'
    return choice(rng, {
      prompt: `Adında “${target}” sesi olan resmi bul!`,
      spoken: `Adında ${LETTER_SOUNDS[target] ?? target} sesi olan resmi bul!`,
      correct: { img, label: w },
      wrong: shuffle(rng, no).slice(0, 2).map(([l, i]) => ({ img: i, label: l })),
      max: 3,
      explain: `${cap(w)} kelimesinin ${pos} “${target}” sesi var: ${heceler(w).join(' - ')}.`,
    })
  }
  return harfAvi1(rng, 1, 1, [])
}

/** Büyük–küçük harf eşleştir */
export const buyukKucuk: Gen = (rng) => {
  const letters = learnedLetters()
  const t = pick(rng, letters)
  const toUpper = rng() < 0.6
  const others = shuffle(rng, letters.filter((c) => c !== t))
  // ı/i çifti ancak ikisi de öğrenildiyse çeldirici olur
  const twin = t === 'ı' ? 'i' : t === 'i' ? 'ı' : null
  const pairs = twin && letters.includes(twin) ? [twin, ...others] : others
  return choice(rng, {
    prompt: toUpper ? `“${t}” harfinin BÜYÜK hâli hangisi?` : `“${upperTR(t)}” harfinin küçük hâli hangisi?`,
    spoken: toUpper ? `${LETTER_SOUNDS[t] ?? t} harfinin büyük hâli hangisi?` : `${LETTER_SOUNDS[t] ?? t} harfinin küçük hâli hangisi?`,
    correct: toUpper ? upperTR(t) : t,
    wrong: pairs.filter((c) => c !== t).slice(0, 2).map((c) => (toUpper ? upperTR(c) : c)),
    max: 3,
    explain: `Küçük “${t}” → büyük “${upperTR(t)}”.${t === 'i' ? ' Noktalı i’nin büyüğü İ, noktasız ı’nın büyüğü I’dır.' : ''}`,
  })
}

/* ============================ B. HECE ============================ */
/** Hece birleştir: "k + a = ?" ve kapalı/açık hece */
export const heceBirlestir: Gen = (rng, _g, level) => {
  const letters = learnedLetters()
  const vowels = letters.filter((c) => 'aeıioöuü'.includes(c))
  const cons = letters.filter((c) => !'aeıioöuü'.includes(c))
  if (level >= 2 && rng() < 0.5) {
    // eksik hece: resimli kelime
    const words = picAllowed().filter(([w]) => heceler(w).length >= 2)
    if (words.length >= 3) {
      const [w, img] = pick(rng, words)
      const h = heceler(w)
      const i = randInt(rng, 0, h.length - 1)
      const masked = h.map((x, k) => (k === i ? '__' : x)).join('')
      const pool = words.flatMap(([x]) => heceler(x)).filter((x) => x !== h[i])
      return choice(rng, { prompt: `Eksik heceyi bul: ${masked}`, visual: { kind: 'image', img, size: 130 }, correct: h[i], wrong: shuffle(rng, Array.from(new Set(pool))).slice(0, 2), max: 3, explain: `${cap(w)}: ${h.join(' - ')}.` })
    }
  }
  const c = pick(rng, cons.length ? cons : ['n'])
  const v = pick(rng, vowels)
  const closed = rng() < 0.4 // kitap: önce kapalı hece (an), sonra açık (na)
  const ans = closed ? v + c : c + v
  const wrong = [closed ? c + v : v + c, pick(rng, cons) + pick(rng, vowels), v + pick(rng, cons)]
  return choice(rng, {
    prompt: closed ? `“${v}” ile “${c}” sesini birleştir: ${v} + ${c} = ?` : `“${c}” ile “${v}” sesini birleştir: ${c} + ${v} = ?`,
    spoken: closed ? `${v}, ${LETTER_SOUNDS[c] ?? c}. Birleştir!` : `${LETTER_SOUNDS[c] ?? c}, ${v}. Birleştir!`,
    correct: ans,
    wrong: wrong.filter((x) => x !== ans),
    max: 3,
    explain: `Sesleri art arda söyleriz: ${closed ? `${v} + ${c}` : `${c} + ${v}`} = “${ans}”.`,
  })
}

/** Hece Treni: resmin adını hecelerle kur (yalnızca öğrenilmiş harfler) */
export const heceTreni1: Gen = (rng, _g, level, history) => {
  const words = picAllowed().filter(([w]) => heceler(w).length >= 2 && !w.includes(' '))
  const recent = new Set(history.map((h) => ('img' in h ? h.img : '')))
  const pool = words.filter(([, i]) => !recent.has(i))
  const [w, img] = pick(rng, pool.length ? pool : words.length ? words : [['elma', 'apple']])
  const h = heceler(w)
  const extraPool = words.flatMap(([x]) => heceler(x)).filter((s) => !h.includes(s))
  return order({
    prompt: 'Hece Treni',
    spoken: `${w}. Heceleri sırayla diz.`,
    img,
    pieces: h,
    extra: level >= 2 ? shuffle(rng, Array.from(new Set(extraPool))).slice(0, level === 3 ? 2 : 1) : [],
    joiner: '',
    style: 'train',
    explain: `${cap(w)}: ${h.join(' - ')}.`,
  })
}

/* ============================ C. KELİME ============================ */
/** Kayıp Harf: k_lem (T.Y.1.2.b) */
export const kayipHarf: Gen = (rng) => {
  const words = picAllowed().filter(([w]) => w.length >= 3)
  const [w, img] = pick(rng, words.length ? words : [['elma', 'apple']])
  const i = randInt(rng, 0, w.length - 1)
  const letters = learnedLetters()
  const wrongs = shuffle(rng, letters.filter((c) => c !== w[i])).slice(0, 2)
  return choice(rng, {
    prompt: 'Kelimedeki eksik harf hangisi?',
    spoken: `${w}. Eksik harfi bul!`,
    visual: { kind: 'word', img, word: w, hide: [i] },
    correct: w[i],
    wrong: wrongs,
    max: 3,
    explain: `${cap(w)} kelimesinde eksik olan harf “${w[i]}”.`,
  })
}

/** Resim–Kelime: resme bakıp doğru kelimeyi oku */
export const resimKelime: Gen = (rng) => {
  const words = picAllowed()
  const [w, img] = pick(rng, words)
  const sameStart = words.filter(([x]) => x !== w && x[0] === w[0])
  const others = [...sameStart, ...shuffle(rng, words.filter(([x]) => x !== w))].map(([x]) => x)
  return choice(rng, { prompt: 'Resmin adını oku ve seç!', visual: { kind: 'image', img, size: 160 }, correct: w, wrong: Array.from(new Set(others)).slice(0, 2), max: 3, explain: `Bu ${w}: ${heceler(w).join(' - ')}.` })
}

/** Karışık Harf: "kşu" → kuş (harfleri sırala) */
export const karisikHarf: Gen = (rng) => {
  const words = picAllowed().filter(([w]) => w.length >= 3 && w.length <= 5 && !w.includes(' '))
  const [w, img] = pick(rng, words.length ? words : [['elma', 'apple']])
  return order({ prompt: 'Harfleri sırala, resmin adını yaz!', spoken: `${w}. Harfleri sırala.`, img, pieces: [...w], joiner: '', style: 'train', explain: `${cap(w)}: ${[...w].join(' - ')}.` })
}

/* ============================ D. CÜMLE ============================ */
const SENTENCES = [
  'Ela lale al.', 'Onat o otel.', 'Lale olta al.', 'Okan kek al.', 'İlke toka al.', 'Kaan iki kek al.', 'Utku kutu al.', 'Rana nar al.', 'Eren erik al.', 'Anıl atkı al.',
  'Mine elma al.', 'Kemal limon al.', 'Mete ekmek al.', 'Ülkü süt al.', 'Suna simit al.', 'Ömer önlük al.', 'Oya ile Ayla oyun oynar.', 'Kedi süt istedi.', 'Zeki üzüm yedi.',
  'Azra muz yedi.', 'Çetin çay içti.', 'Burak balık tuttu.', 'Gamze gözlük taktı.', 'Can cama baktı.', 'Şule kuşa baktı.', 'Pınar pasta yedi.', 'Hasan halıya oturdu.',
  'Yağmur yağdı.', 'Fatma defter aldı.', 'Jale pijama giydi.', 'Annem bana kitap okudu.', 'Kuşlar ağaçta ötüyor.', 'Bugün parka gittik.', 'Dede kediye su verdi.',
]
const ALL_SENTENCES = Array.from(new Set([...SENTENCES, ...Object.values(WEB_SENTENCES).flat().filter((s) => s.split(' ').length >= 2 && s.split(' ').length <= 6)]))
const sentencesAllowed = () => ALL_SENTENCES.filter((s) => isAllowed(s))

/** Cümle Kur: karışık kelimeleri sırala (o harfinden itibaren) */
export const cumleKur: Gen = (rng, _g, _l, history) => {
  const list = sentencesAllowed()
  const used = new Set(history.map((h) => ('pieces' in h ? h.pieces.join(' ') : '')))
  const s = pick(rng, list.filter((x) => !used.has(x)).length ? list.filter((x) => !used.has(x)) : list)
  const words = s.split(' ')
  return order({ prompt: 'Kelimeleri sırala, cümle kur!', spoken: 'Kelimeleri sırala ve cümle kur.', pieces: words, joiner: ' ', style: 'chain', explain: `Cümle büyük harfle başlar, sonuna nokta konur: “${s}”` })
}

/** Resimle Cümle Tamamla: "Ela ___ al." */
export const resimleTamamla: Gen = (rng) => {
  const names = namesAllowed()
  const words = picAllowed()
  const name = pick(rng, names.length ? names : ['Ela'])
  const [w, img] = pick(rng, words)
  return choice(rng, { prompt: `${name} ___ al. Resme bak, boşluğu tamamla!`, spoken: `${name} ... al. Resme bak, boşluğu tamamla.`, visual: { kind: 'image', img, size: 140 }, correct: w, wrong: shuffle(rng, words.filter(([x]) => x !== w)).slice(0, 2).map(([x]) => x), max: 3, explain: `Cümle: “${name} ${w} al.”` })
}

/* ============================ E. NOKTALAMA (kitaptaki açılış sırasıyla) ============================ */
const STATEMENTS = SENTENCES.map((s) => s.replace(/\.$/, ''))
const QUESTIONS = ['Okan o ne', 'Bu kalem kimin', 'Utku okula geldi mi', 'Kedi nerede', 'Bu kitap senin mi', 'Anneni sevdin mi', 'Bugün parka gidecek miyiz', 'Kim geldi']
const EXCLAIMS = ['Ah, elim acıdı', 'Yaşasın, kar yağıyor', 'Aman, dikkat et', 'Vay, çok güzel', 'Eyvah, süt döküldü', 'Of, çok yoruldum']

export const noktalama1: Gen = (rng) => {
  const idx = learnedIdx()
  const marks: ('.' | '?' | '!')[] = ['.']
  if (idx >= MILESTONE.question) marks.push('?')
  if (idx >= MILESTONE.exclamation) marks.push('!')
  const extra = []
  if (idx >= MILESTONE.comma) extra.push('virgul')
  if (idx >= MILESTONE.apostrophe) extra.push('kesme')
  const kind = pick(rng, [...marks, ...extra] as string[])
  if (kind === 'virgul') {
    const items = shuffle(rng, picAllowed().map(([w]) => w)).slice(0, 3)
    if (items.length === 3) {
      // yalnızca öğrenilmiş harflerle: "Lale, el, at al."
      const ok = `${cap(items[0])}, ${items[1]}, ${items[2]} al.`
      return choice(rng, { prompt: 'Hangi cümlede virgül doğru yerde?', correct: ok, wrong: [`${cap(items[0])} ${items[1]}, ${items[2]}, al.`, `${cap(items[0])}, ${items[1]} ${items[2]} al.`], max: 3, layout: 'wide', explain: 'Sıralanan kelimelerin arasına virgül konur.' })
    }
  }
  if (kind === 'kesme') {
    // 'y' öğrenilmeden ünlüyle biten adlar kullanılmaz (Utku'ya → y)
    const yOk = isAllowed('y')
    const names = namesAllowed().filter((x) => yOk || !'aeıioöuü'.includes(x.slice(-1).toLocaleLowerCase('tr-TR')))
    const n = pick(rng, names.length ? names : ['Anıl'])
    const last = [...n.toLocaleLowerCase('tr-TR')].reverse().find((c) => 'aeıioöuü'.includes(c))!
    const ek = 'aıou'.includes(last) ? 'a' : 'e'
    const vowelEnd = 'aeıioöuü'.includes(n.slice(-1).toLocaleLowerCase('tr-TR'))
    const suffix = vowelEnd ? `y${ek}` : ek
    return choice(rng, { prompt: `Hangisi doğru yazılmış?`, correct: `${n}'${suffix} kek al.`, wrong: [`${n}${suffix} kek al.`, `${n.toLocaleLowerCase('tr-TR')}'${suffix} kek al.`], max: 3, explain: 'Kişi adlarına gelen ekler kesme işaretiyle (’) ayrılır ve ad büyük harfle başlar.' })
  }
  const bank = kind === '?' ? QUESTIONS : kind === '!' ? EXCLAIMS : STATEMENTS
  const ok = bank.filter((s) => isAllowed(s))
  const s = pick(rng, ok.length ? ok : STATEMENTS.filter((x) => isAllowed(x)))
  const mark = ok.length ? (kind as '.' | '?' | '!') : '.'
  return choice(rng, {
    prompt: `“${s} ___” Cümlenin sonuna hangi işaret gelir?`,
    correct: { label: mark },
    // yalnızca öğrenilmiş işaretler çeldirici olur; tek işaret öğrenildiyse virgül (k'den sonra) eklenir
    wrong: [...(marks as string[]).filter((m) => m !== mark), ...(marks.length < 3 && idx >= MILESTONE.comma ? [','] : [])].map((m) => ({ label: m })),
    max: 3,
    explain: mark === '.' ? 'Bir şey bildiren cümlenin sonuna nokta konur.' : mark === '?' ? 'Soru soran cümlenin sonuna soru işareti konur.' : 'Sevinç, korku, acı gibi duyguları anlatan cümlenin sonuna ünlem konur.',
  })
}

/* ============================ F. MİNİ METİN (kim / ne / nerede) ============================ */
interface Mini { t: string; text: string; img: string; q: string; a: string; w: string[] }
const MINI: Mini[] = [
  { t: 'Nil ile Ela', text: 'Nil ile Ela. Ela lale al. Nil nane al.', img: 'tulip', q: 'Ela ne aldı?', a: 'lale', w: ['nane', 'olta'] },
  { t: 'Okan', text: 'Okan kek al. Ela kek al. Okan ile Ela iki kek al.', img: 'cake', q: 'Okan ile Ela kaç kek aldı?', a: 'iki', w: ['on', 'tek'] },
  { t: 'Market', text: 'Mine limon al. Rana marul al. Mine ile Rana marketten elma al.', img: 'lemon', q: 'Rana ne aldı?', a: 'marul', w: ['limon', 'kalem'] },
  { t: 'Utku', text: 'Utku okula koştu. Okulda kutu var. Kutuda kalem var.', img: 'pencil', q: 'Kutuda ne var?', a: 'kalem', w: ['kek', 'top'] },
  { t: 'Mine', text: 'Mine marketten elma ile limon aldı. Elmalar kırmızı. Limonlar sarı.', img: 'lemon', q: 'Limonlar ne renk?', a: 'sarı', w: ['kırmızı', 'mor'] },
  { t: 'Kedi', text: 'Dilek bir kedi buldu. Kedi çok açtı. Dilek kediye süt verdi. Kedi sütü içti ve uyudu.', img: 'cat', q: 'Dilek kediye ne verdi?', a: 'süt', w: ['su', 'et'] },
  { t: 'Uçurtma', text: 'Burak ile Ayça bahçeye çıktı. Rüzgâr esiyordu. Çocuklar uçurtma uçurdu. Uçurtma bulutlara kadar yükseldi.', img: 'kite', q: 'Çocuklar nerede uçurtma uçurdu?', a: 'bahçede', w: ['okulda', 'evde'] },
  { t: 'Yağmur', text: 'Sabah yağmur yağıyordu. Pınar şemsiyesini aldı. Okula giderken su birikintilerinden atlamadı. Okula kuru ayakkabılarla vardı.', img: 'umbrella', q: 'Pınar neden ıslanmadı?', a: 'Şemsiyesini aldığı için', w: ['Evde kaldığı için', 'Güneş açtığı için'] },
  { t: 'Piknik', text: 'Hafta sonu ailecek pikniğe gittik. Babam ateş yaktı. Ben ve kardeşim top oynadık. Dönerken bütün çöpleri topladık.', img: 'ball', q: 'Dönerken ne yaptılar?', a: 'Çöpleri topladılar', w: ['Ateş yaktılar', 'Uyudular'] },
]
export const miniMetin: Gen = (rng, _g, _l, history) => {
  // soru sesli okunur; metin ve seçenekler öğrenilmiş harflerden olmalı
  const ok = MINI.filter((m) => isAllowed(m.text + m.a + m.w.join('')))
  const used = new Set(history.map((h) => ('passage' in h && h.passage ? h.passage.title : '')))
  const pool = ok.filter((m) => !used.has(m.t))
  const m = pick(rng, pool.length ? pool : ok.length ? ok : MINI.slice(0, 1))
  return choice(rng, { prompt: m.q, correct: m.a, wrong: m.w, max: 3, layout: 'wide', passage: { title: m.t, text: m.text, img: m.img }, spoken: `${m.text} Soru: ${m.q}`, explain: `Metinde cevabı buluruz: ${m.a}.` })
}

/* ============================ TÜRKÇE DERS KİTABI (Tema 5–8, tüm harfler öğrenildikten sonra) ============================ */
/** Harf ve hece sayma (Tema 5) */
export const harfHeceSay: Gen = (rng) => {
  const [w, img] = pick(rng, PIC.filter(([x]) => !x.includes(' ')))
  const askHece = rng() < 0.5
  const ans = askHece ? heceler(w).length : w.length
  return numChoice(rng, { prompt: `“${w}” kelimesinde kaç ${askHece ? 'HECE' : 'HARF'} var?`, visual: { kind: 'image', img, size: 120 }, answer: ans, near: [ans + 1, ans - 1, askHece ? w.length : heceler(w).length].filter((x) => x > 0 && x !== ans), explain: askHece ? `Heceler: ${heceler(w).join(' - ')} → ${heceler(w).length} hece.` : `Harfler: ${[...w].join(' - ')} → ${w.length} harf.` })
}

/** Olay sıralama (Tema 7) — özgün kısa olaylar */
const EVENTS: string[][] = [
  ['Ece tohum ekti.', 'Tohumu her gün suladı.', 'Tohumdan filiz çıktı.', 'Filiz büyüyüp çiçek açtı.'],
  ['Can uyandı.', 'Dişlerini fırçaladı.', 'Kahvaltı yaptı.', 'Okula gitti.'],
  ['Annem un ve yumurta aldı.', 'Hamuru yoğurdu.', 'Keki fırına koydu.', 'Hep birlikte keki yedik.'],
  ['Kar yağmaya başladı.', 'Çocuklar bahçeye çıktı.', 'Kardan adam yaptılar.', 'Eve dönüp sıcak çorba içtiler.'],
  ['Ali bir kitap seçti.', 'Kitabı okudu.', 'Kitabı arkadaşına anlattı.', 'Kitabı kütüphaneye geri verdi.'],
]
export const olaySirala: Gen = (rng, _g, level) => {
  const ev = pick(rng, EVENTS)
  const pieces = level === 1 ? ev.slice(0, 3) : ev
  return order({ prompt: 'Olayları oluş sırasına göre diz!', spoken: 'Olayları oluş sırasına göre diz.', pieces, joiner: ' ', style: 'chain', explain: `Doğru sıra: ${pieces.map((p, i) => `${i + 1}) ${p}`).join(' ')}` })
}

/** mı/mi/mu/mü — ünlü uyumu ve ayrı yazım (Tema 7–8) */
const VERBS = ['geldi', 'gitti', 'okudu', 'gördü', 'aldı', 'yazdı', 'buldu', 'güldü', 'koştu', 'uyudu', 'baktı', 'içti', 'oynadı', 'döndü', 'yüzdü', 'sordu']
const qEk = (verb: string) => {
  const last = [...verb].reverse().find((c) => 'aeıioöuü'.includes(c))!
  return 'aı'.includes(last) ? 'mı' : 'ei'.includes(last) ? 'mi' : 'ou'.includes(last) ? 'mu' : 'mü'
}
export const miMi: Gen = (rng) => {
  const v = pick(rng, VERBS)
  const n = pick(rng, NAMES.slice(0, 18))
  const ek = qEk(v)
  if (rng() < 0.55)
    return choice(rng, { prompt: `${n} okula ${v} ___ ?`, correct: ek, wrong: ['mı', 'mi', 'mu', 'mü'].filter((x) => x !== ek), max: 3, explain: `Soru eki “${v}” kelimesinin son ünlüsüne uyar: ${v} ${ek}?` })
  return choice(rng, { prompt: 'Hangisi doğru yazılmış?', correct: `${n} okula ${v} ${ek}?`, wrong: [`${n} okula ${v}${ek}?`, `${n} okula ${v} ${ek}.`], max: 3, layout: 'wide', explain: '“mı, mi, mu, mü” soru eki her zaman ayrı yazılır ve cümlenin sonuna soru işareti konur.' })
}

/** Büyük harf (Tema 7–8) */
const BUYUK: [string, string[], string][] = [
  ['Özlem Ankara’ya gitti.', ['özlem Ankara’ya gitti.', 'Özlem ankara’ya gitti.'], 'Cümle büyük harfle başlar; kişi ve şehir adları büyük harfle yazılır.'],
  ['Kedimin adı Pamuk.', ['kedimin adı Pamuk.', 'Kedimin adı pamuk.'], 'Hayvanlara verilen özel adlar büyük harfle başlar.'],
  ['Biz Türkiye’de yaşıyoruz.', ['Biz türkiye’de yaşıyoruz.', 'biz Türkiye’de yaşıyoruz.'], 'Ülke adları ve cümlenin ilk harfi büyük yazılır.'],
  ['Atatürk Samsun’a gitti.', ['atatürk Samsun’a gitti.', 'Atatürk samsun’a gitti.'], 'Kişi ve yer adları büyük harfle başlar.'],
  ['Bugün Ali ile parka gittik.', ['bugün Ali ile parka gittik.', 'Bugün ali ile parka gittik.'], 'Cümlenin ilk harfi ve kişi adları büyük yazılır.'],
]
export const buyukHarf: Gen = (rng) => {
  const [ok, wrong, ex] = pick(rng, BUYUK)
  return choice(rng, { prompt: 'Hangisi doğru yazılmış?', correct: ok, wrong, max: 3, layout: 'wide', explain: ex })
}

/** Benzetme (T.Y.1.2.h) */
const BENZETME: [string, string, string[]][] = [
  ['Kar pamuk gibi beyazdı.', 'pamuk', ['kar', 'beyaz']],
  ['Kardeşim tavşan gibi hızlı koştu.', 'tavşan', ['kardeşim', 'hızlı']],
  ['Annemin elleri ipek gibi yumuşak.', 'ipek', ['annem', 'el']],
  ['Bulutlar pamuk şeker gibiydi.', 'pamuk şeker', ['bulut', 'gökyüzü']],
  ['Dedem arı gibi çalışkan.', 'arı', ['dedem', 'çalışkan']],
  ['Bebeğin yanakları elma gibi kırmızı.', 'elma', ['bebek', 'yanak']],
]
export const benzetme: Gen = (rng) => {
  const [s, a, w] = pick(rng, BENZETME)
  return choice(rng, { prompt: `“${s}” Burada neye benzetme yapılmış?`, correct: a, wrong: w, max: 3, explain: `“gibi” kelimesinden önce gelen “${a}”, benzetilen şeydir.` })
}

/** Boşlukları aç (Tema 6, T.Y.1.3.ç) */
const BITISIK = ['Salı günü parka gittik.', 'Kedim süt içti.', 'Annem bana kitap aldı.', 'Okulda resim yaptık.', 'Kuşlar ağaçta ötüyor.']
export const boslukAc: Gen = (rng) => {
  const s = pick(rng, BITISIK)
  const w = s.split(' ')
  const wrong1 = [w.slice(0, 2).join(''), ...w.slice(2)].join(' ')
  const wrong2 = [w[0], w.slice(1).join('')].join(' ')
  return choice(rng, { prompt: `“${s.replace(/ /g, '')}” Kelimeleri doğru ayıran hangisi?`, correct: s, wrong: [wrong1, wrong2], max: 3, layout: 'wide', explain: 'Kelimeler arasında boşluk bırakılır.' })
}

/** Anlamsız cümleyi bul (b harfinden sonra, DK) */
const ANLAMSIZ: [string, string[]][] = [
  ['Babam börek boyadı.', ['Babam börek yaptı.', 'Annem çorba pişirdi.']],
  ['Kedi ağaçta yüzdü.', ['Kedi ağaca tırmandı.', 'Balık suda yüzdü.']],
  ['Kalemle ekmek içtim.', ['Kalemle resim çizdim.', 'Bardakla su içtim.']],
  ['Güneş gece doğdu.', ['Güneş sabah doğdu.', 'Ay gece parladı.']],
]
export const anlamsizCumle: Gen = (rng) => {
  const [bad, good] = pick(rng, ANLAMSIZ)
  return choice(rng, { prompt: 'Hangi cümle ANLAMSIZ?', correct: bad, wrong: good, max: 3, layout: 'wide', explain: `“${bad}” cümlesi gerçek hayatta olamaz; anlamı uymuyor.` })
}

export const _check = (q: Question) => requiredIdx(JSON.stringify(q)) <= LETTER_ORDER.length
export { type Rng }
