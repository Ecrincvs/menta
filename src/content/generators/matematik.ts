/**
 * MATEMATİK içerik üreticileri — MEB Maarif İlkokul Matematik programı (docs/meb/matematik-1-4.txt).
 * Sınırlar program açıklamalarından: ör. 1. sınıf toplama 20'ye kadar ELDESİZ, çıkarma ONLUK BOZMADAN;
 * 2. sınıf 100'e kadar eldeli/onluk bozarak, çarpım tablosu 5'e kadar, kalansız bölme 20'ye kadar;
 * 3. sınıf 1000'e kadar, çarpım tablosu 10'a kadar, bölme 100'e kadar kalanlı;
 * 4. sınıf altı basamaklı sayılar, yuvarlama ≤4 basamak, bölme 1000'e kadar tek basamaklı bölen.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { choice, numChoice, sayiOku, saatAcc, saatDat, sort, type Gen } from './helpers'
import type { ShapeKind, SolidKind } from '../../games/quiz/types'

const tr = (n: number) => n.toLocaleString('tr-TR')

/* ============================ SAYI DEDEKTİFİ ============================ */
const OBJ = ['apple', 'star', 'ball', 'flower', 'fish', 'balloon', 'strawberry', 'duck']

export const sayiDedektifi: Gen = (rng, grade, level) => {
  if (grade === 1) {
    const t = pick(rng, level === 1 ? ['say', 'karsilastir', 'sonra'] : ['say', 'karsilastir', 'ritmik', 'oruntu', 'sonra'])
    if (t === 'say') {
      const n = randInt(rng, level === 1 ? 3 : 6, level === 1 ? 10 : 20)
      const img = pick(rng, OBJ)
      return numChoice(rng, { prompt: 'Kaç tane var? Say bakalım!', answer: n, visual: { kind: 'objects', img, count: n }, explain: `Tek tek sayarız: 1, 2, 3 … ${n}. Toplam ${n} tane.` })
    }
    if (t === 'karsilastir') {
      const a = randInt(rng, 2, level === 1 ? 8 : 15)
      let b = randInt(rng, 2, level === 1 ? 8 : 15)
      if (rng() < 0.2) b = a
      const img = pick(rng, OBJ)
      const ans = a > b ? 'Soldaki grup' : a < b ? 'Sağdaki grup' : 'İkisi eşit'
      return choice(rng, {
        prompt: 'Hangi grupta daha çok var?',
        correct: ans,
        wrong: ['Soldaki grup', 'Sağdaki grup', 'İkisi eşit'],
        visual: { kind: 'compare', left: { img, count: a }, right: { img, count: b } },
        keepOrder: false,
        explain: `Solda ${a}, sağda ${b} tane var. ${a === b ? 'Sayılar eşit.' : `${Math.max(a, b)}, ${Math.min(a, b)}'den daha çoktur.`}`,
      })
    }
    if (t === 'sonra') {
      const n = randInt(rng, 1, level === 1 ? 9 : 19)
      const before = rng() < 0.4 && n > 1
      return numChoice(rng, {
        prompt: before ? `${n} sayısından hemen ÖNCE gelen sayı hangisi?` : `${n} sayısından hemen SONRA gelen sayı hangisi?`,
        answer: before ? n - 1 : n + 1,
        explain: before ? `${n - 1}, ${n} sayısından bir eksiktir.` : `${n + 1}, ${n} sayısından bir fazladır.`,
      })
    }
    // ritmik / örüntü (programda: 1, 5, 10 ile 100'e; 2 ile 20'ye ileri; 1 ve 2 ile 20'den geri)
    const step = pick(rng, t === 'oruntu' ? [2, 5, 10] : [1, 2, 5, 10])
    const max = step === 2 ? 20 : step === 1 ? 20 : 100
    const back = step <= 2 && rng() < 0.3
    const startMax = max - step * 4
    const s0 = back ? randInt(rng, step * 4, 20) : step === 1 ? randInt(rng, 1, startMax) : step * randInt(rng, 0, Math.floor(startMax / step))
    const seq = Array.from({ length: 4 }, (_, i) => (back ? s0 - i * step : s0 + i * step))
    const ans = back ? s0 - 4 * step : s0 + 4 * step
    return numChoice(rng, {
      prompt: `Örüntüyü tamamla: ${back ? 'geriye' : 'ileriye'} doğru ${step}'er sayıyoruz.`,
      answer: ans,
      visual: { kind: 'sequence', items: [...seq, '?'] },
      near: [ans + 1, ans - 1, ans + step, ans - step].filter((x) => x !== ans),
      explain: `Her adımda ${step} ${back ? 'azalıyor' : 'artıyor'}: ${seq.join(', ')}, ${ans}.`,
    })
  }
  if (grade === 2) {
    const t = pick(rng, ['basamak', 'blok', 'yuvarla', 'ritmik', 'sirala'])
    if (t === 'basamak' || t === 'blok') {
      const n = randInt(rng, 11, 99)
      const tens = Math.floor(n / 10)
      const ones = n % 10
      if (t === 'blok') return numChoice(rng, { prompt: 'Onluk ve birlik bloklarıyla gösterilen sayı kaçtır?', answer: n, visual: { kind: 'blocks', hundreds: 0, tens, ones }, near: [tens + ones * 10, n + 10, n - 10, n + 1].filter((x) => x > 0 && x !== n), explain: `${tens} onluk = ${tens * 10}, ${ones} birlik = ${ones}. ${tens * 10} + ${ones} = ${n}.` })
      const askTens = rng() < 0.5
      return numChoice(rng, { prompt: `${n} sayısında kaç ${askTens ? 'onluk' : 'birlik'} vardır?`, answer: askTens ? tens : ones, near: [askTens ? ones : tens, (askTens ? tens : ones) + 1, Math.max(0, (askTens ? tens : ones) - 1)], explain: `${n} = ${tens} onluk + ${ones} birlik.` })
    }
    if (t === 'yuvarla') {
      let n = randInt(rng, 11, 98)
      if (n % 10 === 0) n++
      const r = Math.round(n / 10) * 10
      return numChoice(rng, { prompt: `${n} sayısını en yakın onluğa yuvarla.`, answer: r, near: [Math.floor(n / 10) * 10, Math.ceil(n / 10) * 10, r + 10].filter((x) => x !== r), explain: `Birler basamağı ${n % 10}. ${n % 10 >= 5 ? '5 ve üzeri olduğu için yukarı' : '5’ten küçük olduğu için aşağı'} yuvarlanır: ${r}.` })
    }
    if (t === 'sirala') {
      const nums = shuffle(rng, Array.from(new Set(Array.from({ length: 6 }, () => randInt(rng, 10, 99))))).slice(0, 4)
      const big = rng() < 0.5
      const ans = big ? Math.max(...nums) : Math.min(...nums)
      return choice(rng, { prompt: `Hangisi en ${big ? 'büyük' : 'küçük'} sayıdır?`, correct: tr(ans), wrong: nums.filter((x) => x !== ans).map(tr), max: 4, explain: `Önce onluklara bakarız; onluklar eşitse birliklere. En ${big ? 'büyük' : 'küçük'} sayı ${ans}.` })
    }
    const step = pick(rng, [2, 3, 4, 5, 10])
    const lim = step === 2 ? 20 : step === 3 ? 30 : step === 4 ? 40 : 100
    const s0 = step * randInt(rng, 0, Math.floor(lim / step) - 4)
    const seq = Array.from({ length: 4 }, (_, i) => s0 + i * step)
    const ans = s0 + 4 * step
    return numChoice(rng, { prompt: `${step}'er ritmik sayıyoruz. Sıradaki sayı hangisi?`, answer: ans, visual: { kind: 'sequence', items: [...seq, '?'] }, near: [ans + 1, ans - 1, ans + step].filter((x) => x !== ans), explain: `Her adımda ${step} artıyor: ${seq.join(', ')}, ${ans}.` })
  }
  if (grade === 3) {
    const t = pick(rng, ['basamakdeger', 'yuvarla', 'tekcift', 'blok', 'ritmik'])
    if (t === 'tekcift') {
      const nums = shuffle(rng, Array.from(new Set(Array.from({ length: 10 }, () => randInt(rng, 1, level === 1 ? 50 : 999))))).slice(0, 6)
      return sort(rng, {
        prompt: 'Sayıları TEK ve ÇİFT kutularına yerleştir!',
        bins: [{ id: 'tek', label: 'Tek', color: '#ff9a2e' }, { id: 'cift', label: 'Çift', color: '#2ec4c9' }],
        items: nums.map((n) => ({ label: tr(n), bin: n % 2 ? 'tek' : 'cift' })),
        explain: 'Birler basamağı 0, 2, 4, 6 veya 8 olan sayılar çifttir; 1, 3, 5, 7 veya 9 olanlar tektir.',
      })
    }
    if (t === 'blok') {
      const h = randInt(rng, 1, 3)
      const tt = randInt(rng, 0, 9)
      const o = randInt(rng, 0, 9)
      const n = h * 100 + tt * 10 + o
      return numChoice(rng, { prompt: 'Bloklarla gösterilen sayı kaçtır?', answer: n, visual: { kind: 'blocks', hundreds: h, tens: tt, ones: o }, near: [n + 100, n - 10, n + 10, h * 100 + o * 10 + tt].filter((x) => x > 0 && x !== n), explain: `${h} yüzlük + ${tt} onluk + ${o} birlik = ${h * 100} + ${tt * 10} + ${o} = ${n}.` })
    }
    if (t === 'basamakdeger') {
      const n = randInt(rng, 102, 987)
      const digits = String(n).split('').map(Number)
      const pos = randInt(rng, 0, 2)
      const d = digits[pos]
      const val = d * [100, 10, 1][pos]
      if (d === 0) return sayiDedektifi(rng, grade, level, [])
      return numChoice(rng, { prompt: `${n} sayısında ${d} rakamının basamak değeri kaçtır?`, answer: val, near: [d, d * 10, d * 100].filter((x) => x !== val), explain: `${d}, ${['yüzler', 'onlar', 'birler'][pos]} basamağında. Basamak değeri ${val}.` })
    }
    if (t === 'yuvarla') {
      const toH = rng() < 0.5
      let n = randInt(rng, 110, 989)
      if (n % 10 === 0) n++
      const u = toH ? 100 : 10
      const r = Math.round(n / u) * u
      return numChoice(rng, { prompt: `${n} sayısını en yakın ${toH ? 'yüzlüğe' : 'onluğa'} yuvarla.`, answer: r, near: [Math.floor(n / u) * u, Math.ceil(n / u) * u, r + u].filter((x) => x !== r), explain: `${toH ? 'Onlar' : 'Birler'} basamağına bakarız: ${toH ? Math.floor((n % 100) / 10) : n % 10}. ${(toH ? Math.floor((n % 100) / 10) : n % 10) >= 5 ? 'Yukarı' : 'Aşağı'} yuvarlanır: ${r}.` })
    }
    const step = pick(rng, [10, 100])
    const s0 = step === 10 ? randInt(rng, 10, 900) : 100 * randInt(rng, 0, 5)
    const seq = Array.from({ length: 4 }, (_, i) => s0 + i * step)
    const ans = s0 + 4 * step
    return numChoice(rng, { prompt: `${step}'er ileri sayıyoruz. Sıradaki sayı?`, answer: ans, visual: { kind: 'sequence', items: [...seq, '?'] }, near: [ans + 1, ans - step, ans + step].filter((x) => x !== ans), explain: `Her adımda ${step} artıyor.` })
  }
  // 4. SINIF
  const t = pick(rng, ['okunus', 'basamak', 'bolukler', 'yuvarla'])
  if (t === 'okunus') {
    const n = randInt(rng, 10000, level === 1 ? 99999 : 999999)
    const wrongs = [n + 1000, n - 100, Number(String(n).split('').reverse().join('')) % 1000000].filter((x) => x !== n && x > 0)
    return choice(rng, { prompt: `“${sayiOku(n)}” sayısı hangisidir?`, correct: tr(n), wrong: wrongs.map(tr), max: 3, layout: 'wide', explain: `${sayiOku(n)} = ${tr(n)}. Sayılar bölüklere ayrılarak okunur.` })
  }
  if (t === 'basamak') {
    const n = randInt(rng, 100000, 999999)
    const s = String(n)
    const pos = randInt(rng, 0, 5)
    const names = ['yüz binler', 'on binler', 'binler', 'yüzler', 'onlar', 'birler']
    return choice(rng, { prompt: `${tr(n)} sayısında ${s[pos]} rakamı (soldan ${pos + 1}.) hangi basamaktadır?`, correct: names[pos], wrong: names.filter((x) => x !== names[pos]), max: 4, explain: `Altı basamaklı sayıda soldan sağa: yüz binler, on binler, binler, yüzler, onlar, birler.` })
  }
  if (t === 'bolukler') {
    const n = randInt(rng, 100000, 999999)
    const binler = Math.floor(n / 1000)
    return numChoice(rng, { prompt: `${tr(n)} sayısının BİNLER bölüğündeki sayı kaçtır?`, answer: binler, near: [n % 1000, binler + 1, Math.floor(binler / 10)].filter((x) => x !== binler), explain: `Sayıyı sağdan üçerli ayırırız: ${tr(n)} → binler bölüğü ${binler}, birler bölüğü ${n % 1000}.` })
  }
  const unit = pick(rng, [10, 100, 1000])
  let n = randInt(rng, 1001, 9998)
  if (n % unit === 0) n += 7
  const r = Math.round(n / unit) * unit
  return numChoice(rng, { prompt: `${tr(n)} sayısını en yakın ${unit === 10 ? 'onluğa' : unit === 100 ? 'yüzlüğe' : 'binliğe'} yuvarla.`, answer: r, near: [Math.floor(n / unit) * unit, Math.ceil(n / unit) * unit, r + unit].filter((x) => x !== r), explain: `Yuvarlanacak basamağın sağındaki rakam 5 veya büyükse yukarı, değilse aşağı yuvarlanır: ${tr(r)}.` })
}

/* ============================ İŞLEM ROBOTU ============================ */
function addEldesiz(rng: Rng, max: number) {
  // birler toplamı < 10 (eldesiz)
  for (;;) {
    const a = randInt(rng, 1, max - 1)
    const b = randInt(rng, 1, max - a)
    if ((a % 10) + (b % 10) < 10) return [a, b]
  }
}
function subNoBorrow(rng: Rng, max: number) {
  for (;;) {
    const a = randInt(rng, 2, max)
    const b = randInt(rng, 1, a - 1)
    if (a % 10 >= b % 10) return [a, b]
  }
}

export const islemRobotu: Gen = (rng, grade, level) => {
  const sub = rng() < 0.5
  let a: number, b: number
  let missing = false
  if (grade === 1) {
    const max = level === 1 ? 10 : 20
    ;[a, b] = sub ? subNoBorrow(rng, max) : addEldesiz(rng, max)
    missing = level === 3 && rng() < 0.4
  } else if (grade === 2) {
    if (sub) {
      a = randInt(rng, 21, 99)
      b = level === 1 ? randInt(rng, 2, 9) : randInt(rng, 11, a - 5)
    } else {
      a = randInt(rng, 11, 79)
      b = level === 1 ? randInt(rng, 2, 9) : randInt(rng, 11, 99 - a)
    }
    missing = level === 3 && rng() < 0.3
  } else if (grade === 3) {
    if (sub) {
      a = randInt(rng, 200, 999)
      b = randInt(rng, 100, a - 50)
    } else {
      a = randInt(rng, 100, 700)
      b = randInt(rng, 100, 999 - a)
    }
  } else {
    if (sub) {
      a = randInt(rng, 2000, 9999)
      b = randInt(rng, 1000, a - 100)
    } else {
      a = randInt(rng, 1000, 6000)
      b = randInt(rng, 1000, 9999 - a)
    }
    if (level === 1) {
      a = Math.round(a / 100) * 100
      b = Math.round(b / 100) * 100
    }
  }
  const res = sub ? a - b : a + b
  const op = sub ? '−' : '+'
  if (missing && !sub) {
    return numChoice(rng, {
      prompt: 'Verilmeyen sayıyı bul!',
      answer: b,
      visual: { kind: 'equation', text: `${a} + ? = ${res}` },
      explain: `${res}'den ${a} çıkarırsak bilinmeyeni buluruz: ${res} − ${a} = ${b}. Toplama ile çıkarma ters işlemlerdir.`,
    })
  }
  const how =
    grade <= 2
      ? sub
        ? `${a}'den ${b} çıkarırız. ${a % 10 < b % 10 ? 'Birler yetmediği için bir onluğu bozarız. ' : ''}Sonuç ${res}.`
        : `Önce birleri, sonra onlukları toplarız. ${(a % 10) + (b % 10) >= 10 ? 'Birlerin toplamı 10’u geçince 1 onluk elde ederiz. ' : ''}Sonuç ${res}.`
      : `Basamakları alt alta yazıp birlerden başlayarak işlem yaparız: ${tr(a)} ${op} ${tr(b)} = ${tr(res)}.`
  return numChoice(rng, {
    prompt: sub ? 'Çıkarma işleminin sonucu kaç?' : 'Toplama işleminin sonucu kaç?',
    answer: res,
    visual: { kind: 'equation', text: `${tr(a)} ${op} ${tr(b)} = ?` },
    near: [res + 10, res - 10, res + 1, res - 1, sub ? a + b : Math.abs(a - b)].filter((x) => x >= 0 && x !== res),
    explain: how,
  })
}

/* ============================ ÇARPMA YARIŞI ============================ */
export const carpmaYarisi: Gen = (rng, grade, level) => {
  if (grade === 2) {
    const a = randInt(rng, 2, 5)
    const b = randInt(rng, 1, level === 1 ? 5 : 10)
    const img = pick(rng, ['apple', 'star', 'strawberry', 'candy', 'balloon'])
    return numChoice(rng, {
      prompt: `${b} grupta ${a}'er tane var. Toplam kaç tane? (${b} × ${a})`,
      answer: a * b,
      visual: { kind: 'groups', img, groups: b, per: a },
      near: [a * b + a, a * b - a, a + b].filter((x) => x > 0 && x !== a * b),
      explain: `Tekrarlı toplama: ${Array(b).fill(a).join(' + ')} = ${a * b}. Yani ${b} × ${a} = ${a * b}.`,
    })
  }
  if (grade === 3) {
    if (level === 3 && rng() < 0.5) {
      const a = randInt(rng, 12, 45)
      const b = randInt(rng, 2, 5)
      return numChoice(rng, { prompt: 'Çarpma işleminin sonucu kaç?', answer: a * b, visual: { kind: 'equation', text: `${a} × ${b} = ?` }, near: [a * b + b, a * b - 10, a * b + 10].filter((x) => x !== a * b), explain: `${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b}) = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${a * b}.` })
    }
    const a = randInt(rng, 2, 10)
    const b = randInt(rng, 2, 10)
    return numChoice(rng, { prompt: 'Çarpım tablosu yarışı! Sonuç kaç?', answer: a * b, visual: { kind: 'equation', text: `${a} × ${b} = ?` }, near: [a * b + a, a * b - b, a * (b + 1), (a + 1) * b].filter((x) => x !== a * b), explain: `${a} × ${b} = ${a * b}. ${b} tane ${a}’ü toplarsak da ${a * b} buluruz.` })
  }
  // 4. sınıf: 10/100/1000 ile kısa yol ve 3 basamaklı × 1 basamaklı
  if (rng() < 0.5) {
    const a = randInt(rng, 2, level === 1 ? 99 : 999)
    const m = pick(rng, [10, 100, 1000])
    return numChoice(rng, { prompt: `Kısa yoldan çarp!`, answer: a * m, visual: { kind: 'equation', text: `${tr(a)} × ${tr(m)} = ?` }, near: [a * m * 10, a * Math.max(10, m / 10), a + m].filter((x) => x !== a * m), explain: `${tr(m)} ile çarparken sayının sağına ${String(m).length - 1} sıfır ekleriz: ${tr(a * m)}.` })
  }
  const a = randInt(rng, 101, 999)
  const b = randInt(rng, 2, 9)
  return numChoice(rng, { prompt: 'Çarpma işleminin sonucu kaç?', answer: a * b, visual: { kind: 'equation', text: `${tr(a)} × ${b} = ?` }, near: [a * b + 10, a * b - b, a * b + 100].filter((x) => x !== a * b), explain: `Birlerden başlayarak çarparız: ${tr(a)} × ${b} = ${tr(a * b)}.` })
}

/* ============================ BÖLME İLE PAYLAŞMA ============================ */
export const bolmePaylasma: Gen = (rng, grade, level) => {
  if (grade === 2) {
    const d = randInt(rng, 2, 5)
    const q = randInt(rng, 1, Math.floor(20 / d))
    const img = pick(rng, ['candy', 'cupcake', 'apple', 'cookie', 'lollipop'])
    return numChoice(rng, {
      prompt: `${d * q} tane yiyeceği ${d} arkadaşa eşit paylaştırırsak her birine kaç tane düşer?`,
      answer: q,
      visual: { kind: 'share', img, total: d * q, plates: d },
      explain: `Her arkadaşa birer birer dağıtırız ya da ${d * q} − ${d} − ${d}… diye ardışık çıkarırız: ${d * q} ÷ ${d} = ${q}.`,
    })
  }
  if (grade === 3) {
    const d = randInt(rng, 2, 9)
    const q = randInt(rng, 2, Math.floor(99 / d))
    const r = level === 1 ? 0 : randInt(rng, 0, d - 1)
    const n = d * q + r
    if (n > 100) return bolmePaylasma(rng, grade, level, [])
    if (r === 0) return numChoice(rng, { prompt: 'Bölme işleminin sonucu kaç?', answer: q, visual: { kind: 'equation', text: `${n} ÷ ${d} = ?` }, near: [q + 1, q - 1, q + 2].filter((x) => x > 0), explain: `${d} × ${q} = ${n} olduğu için ${n} ÷ ${d} = ${q}.` })
    const fmt = (a: number, b: number) => `${a}, kalan ${b}`
    return choice(rng, {
      prompt: 'Bölüm ve kalan kaçtır?',
      visual: { kind: 'equation', text: `${n} ÷ ${d} = ?` },
      correct: fmt(q, r),
      wrong: [fmt(q + 1, 0), fmt(q - 1, r + d < 10 ? r + d : r), fmt(q, Math.max(0, r - 1)) === fmt(q, r) ? fmt(q, r + 1) : fmt(q, Math.max(0, r - 1))],
      max: 3,
      explain: `${d} × ${q} = ${d * q}. ${n} − ${d * q} = ${r}. Bölüm ${q}, kalan ${r}. Kalan her zaman bölenden küçüktür.`,
    })
  }
  // 4. sınıf
  if (rng() < 0.25) {
    const d = randInt(rng, 3, 9)
    const wrong = [d, d + 1, d + 3]
    return choice(rng, { prompt: `Bir sayı ${d}'e bölündüğünde kalan EN FAZLA kaç olabilir?`, correct: String(d - 1), wrong: wrong.map(String), max: 3, explain: `Kalan her zaman bölenden küçüktür; en fazla ${d - 1} olabilir.` })
  }
  const d = randInt(rng, 2, 9)
  const q = randInt(rng, 12, Math.floor(999 / d))
  const r = randInt(rng, 0, d - 1)
  const n = d * q + r
  if (n > 1000) return bolmePaylasma(rng, grade, level, [])
  const fmt = (a: number, b: number) => (b ? `${a}, kalan ${b}` : `${a}`)
  return choice(rng, {
    prompt: 'Bölüm (ve varsa kalan) kaçtır?',
    visual: { kind: 'equation', text: `${n} ÷ ${d} = ?` },
    correct: fmt(q, r),
    wrong: [fmt(q + 1, r), fmt(q - 1, r), fmt(q, r ? 0 : 1), fmt(q + 10, r)],
    max: 3,
    explain: `${d} × ${q} = ${d * q}${r ? `, ${n} − ${d * q} = ${r}` : ''}. Sonuç: ${fmt(q, r)}.`,
  })
}

/* ============================ GEOMETRİ ============================ */
const SHAPE_NAME: Record<ShapeKind, string> = { ucgen: 'Üçgen', kare: 'Kare', dikdortgen: 'Dikdörtgen', cember: 'Çember', daire: 'Daire', besgen: 'Beşgen', altigen: 'Altıgen', sekizgen: 'Sekizgen' }
const CORNERS: Partial<Record<ShapeKind, number>> = { ucgen: 3, kare: 4, dikdortgen: 4, cember: 0, besgen: 5, altigen: 6, sekizgen: 8 }
const SOLID_NAME: Record<SolidKind, string> = { kup: 'Küp', kure: 'Küre', silindir: 'Silindir', 'kare-prizma': 'Kare prizma', 'dikdortgen-prizma': 'Dikdörtgen prizma', 'ucgen-prizma': 'Üçgen prizma' }

export const geometri: Gen = (rng, grade) => {
  if (grade === 1) {
    const shapes: ShapeKind[] = ['ucgen', 'kare', 'dikdortgen', 'cember']
    const s = pick(rng, shapes)
    if (rng() < 0.6)
      return choice(rng, { prompt: 'Bu şeklin adı nedir?', correct: SHAPE_NAME[s], wrong: shapes.filter((x) => x !== s).map((x) => SHAPE_NAME[x]), visual: { kind: 'shape', shape: s }, explain: `${SHAPE_NAME[s]}${CORNERS[s] ? `: ${CORNERS[s]} köşesi ve ${CORNERS[s]} kenarı vardır.` : ': köşesi yoktur, yuvarlaktır.'}` })
    if (rng() < 0.5)
      return choice(rng, { prompt: 'Hangisinin hiç köşesi yoktur?', correct: { visual: { kind: 'shape', shape: 'cember' } }, wrong: (['ucgen', 'kare', 'dikdortgen'] as ShapeKind[]).map((x) => ({ visual: { kind: 'shape' as const, shape: x } })), max: 3, explain: 'Çember yuvarlaktır; köşesi yoktur.' })
    const t = pick(rng, ['ucgen', 'kare', 'dikdortgen'] as ShapeKind[])
    return numChoice(rng, { prompt: 'Bu şeklin kaç köşesi var?', answer: CORNERS[t]!, visual: { kind: 'shape', shape: t }, near: [3, 4, 5, 0].filter((x) => x !== CORNERS[t]), explain: `Köşeleri tek tek sayalım: ${CORNERS[t]} köşe.` })
  }
  if (grade === 2) {
    const solids: SolidKind[] = ['kup', 'kure', 'silindir', 'kare-prizma', 'dikdortgen-prizma', 'ucgen-prizma']
    const real: [string, string, SolidKind][] = [['ball', 'Top', 'kure'], ['earth', 'Dünya modeli', 'kure'], ['candle', 'Mum', 'silindir'], ['gift', 'Hediye kutusu', 'kup']]
    if (rng() < 0.3) {
      const r = pick(rng, real.filter((x) => x[0] !== 'gift'))
      return choice(rng, { prompt: `${r[1]} hangi geometrik cisme benzer?`, correct: SOLID_NAME[r[2]], wrong: solids.filter((x) => x !== r[2]).map((x) => SOLID_NAME[x]), visual: { kind: 'image', img: r[0], size: 150 }, max: 3, explain: `${r[1]} ${SOLID_NAME[r[2]].toLocaleLowerCase('tr-TR')} şeklindedir.` })
    }
    const s = pick(rng, solids)
    return choice(rng, { prompt: 'Bu geometrik cismin adı nedir?', correct: SOLID_NAME[s], wrong: solids.filter((x) => x !== s).map((x) => SOLID_NAME[x]), visual: { kind: 'solid', solid: s }, max: 3, explain: `Bu cisim bir ${SOLID_NAME[s].toLocaleLowerCase('tr-TR')}.` })
  }
  if (grade === 3) {
    const shapes: ShapeKind[] = ['ucgen', 'kare', 'besgen', 'altigen', 'sekizgen']
    const s = pick(rng, shapes)
    if (rng() < 0.3) {
      const q = pick(rng, [['yüzü', 6], ['köşesi', 8], ['ayrıtı', 12]] as [string, number][])
      return numChoice(rng, { prompt: `Küpün kaç ${q[0]} vardır?`, answer: q[1], visual: { kind: 'solid', solid: 'kup' }, near: [6, 8, 12, 4].filter((x) => x !== q[1]), explain: 'Küpün 6 yüzü, 8 köşesi ve 12 ayrıtı vardır.' })
    }
    if (rng() < 0.5) return numChoice(rng, { prompt: 'Bu şeklin kaç kenarı vardır?', answer: CORNERS[s]!, visual: { kind: 'shape', shape: s }, near: [3, 4, 5, 6, 8].filter((x) => x !== CORNERS[s]), explain: `Kenarları sayarız: ${CORNERS[s]} kenar. Şeklin adı ${SHAPE_NAME[s]}.` })
    return choice(rng, { prompt: 'Kenar sayısına göre bu şeklin adı nedir?', correct: SHAPE_NAME[s === 'kare' ? 'kare' : s], wrong: shapes.filter((x) => x !== s).map((x) => SHAPE_NAME[x]), visual: { kind: 'shape', shape: s }, max: 4, explain: `${CORNERS[s]} kenarlı şekle ${SHAPE_NAME[s].toLocaleLowerCase('tr-TR')} denir.` })
  }
  // 4. sınıf: açılar ve şekil özellikleri
  if (rng() < 0.7) {
    const kind = pick(rng, ['dar', 'dik', 'genis'] as const)
    const deg = kind === 'dik' ? 90 : kind === 'dar' ? randInt(rng, 25, 70) : randInt(rng, 110, 160)
    const name = { dar: 'Dar açı', dik: 'Dik açı', genis: 'Geniş açı' }
    return choice(rng, { prompt: 'Bu açı hangi türdendir?', correct: name[kind], wrong: Object.values(name).filter((x) => x !== name[kind]), visual: { kind: 'angle', deg }, max: 3, keepOrder: false, explain: 'Dik açıyı ölçü alırız: dik açıdan küçükse dar, büyükse geniş açıdır.' })
  }
  const q = pick(rng, [
    ['Karenin kenarları için hangisi doğrudur?', 'Dört kenarı da eşittir.', ['Sadece iki kenarı eşittir.', 'Hiçbir kenarı eşit değildir.'], 'Karenin dört kenarı eşit uzunluktadır ve dört köşesi de dik açıdır.', 'kare'],
    ['Dikdörtgen için hangisi doğrudur?', 'Karşılıklı kenarları eşittir.', ['Bütün kenarları farklıdır.', 'Üç kenarı vardır.'], 'Dikdörtgenin karşılıklı kenarları eşittir ve dört köşesi dik açıdır.', 'dikdortgen'],
    ['Üçgenin kaç köşesi ve kaç kenarı vardır?', '3 köşe, 3 kenar', ['4 köşe, 4 kenar', '3 köşe, 4 kenar'], 'Üçgenin 3 köşesi ve 3 kenarı vardır.', 'ucgen'],
  ] as [string, string, string[], string, ShapeKind][])
  return choice(rng, { prompt: q[0], correct: q[1], wrong: q[2], max: 3, explain: q[3], visual: { kind: 'shape', shape: q[4] } })
}

/* ============================ SAAT VE ZAMAN ============================ */
export const saatZaman: Gen = (rng, grade, level) => {
  if (grade === 2) {
    if (rng() < 0.3) {
      const u = pick(rng, [['1 saat kaç dakikadır?', 60], ['1 gün kaç saattir?', 24], ['1 hafta kaç gündür?', 7], ['1 yıl kaç aydır?', 12], ['1 yılda kaç mevsim vardır?', 4]] as [string, number][])
      return numChoice(rng, { prompt: u[0], answer: u[1], near: [u[1] + 1, u[1] - 2, u[1] * 2, 30, 10].filter((x) => x !== u[1]), explain: u[0].replace('kaç', String(u[1])).replace('?', '.') })
    }
    const h = randInt(rng, 1, 12)
    const m = pick(rng, level === 1 ? [0, 30] : [0, 15, 30, 45])
    const say = (hh: number, mm: number) => (mm === 0 ? `Saat ${hh}` : mm === 30 ? `Saat ${hh} buçuk` : mm === 15 ? `Saat ${saatAcc(hh)} çeyrek geçiyor` : `Saat ${saatDat((hh % 12) + 1)} çeyrek var`)
    const correct = say(h, m)
    const wrong = [say((h % 12) + 1, m), say(h, m === 0 ? 30 : 0), say(h, m === 15 ? 45 : 15)].filter((x) => x !== correct)
    return choice(rng, { prompt: 'Saat kaçı gösteriyor?', correct, wrong, visual: { kind: 'clock', h, m }, max: 3, explain: `Kısa (kırmızı) akrep saati, uzun (mavi) yelkovan dakikayı gösterir. ${correct}.` })
  }
  // 3. sınıf
  const t = pick(rng, ['analog', 'dijital', 'donusum', 'oglesonra'])
  if (t === 'donusum') {
    const q = pick(rng, [['2 saat kaç dakikadır?', 120], ['3 saat kaç dakikadır?', 180], ['1 dakika kaç saniyedir?', 60], ['2 dakika kaç saniyedir?', 120], ['90 dakika kaç saat kaç dakikadır?', -1]] as [string, number][])
    if (q[1] === -1) return choice(rng, { prompt: q[0], correct: '1 saat 30 dakika', wrong: ['1 saat 90 dakika', '9 saat', '2 saat'], max: 3, explain: '60 dakika 1 saattir; 90 − 60 = 30. Yani 1 saat 30 dakika.' })
    return numChoice(rng, { prompt: q[0], answer: q[1], near: [q[1] - 60, q[1] + 60, q[1] / 2].filter((x) => x > 0 && x !== q[1]), explain: '1 saat = 60 dakika, 1 dakika = 60 saniye.' })
  }
  if (t === 'oglesonra') {
    const h = randInt(rng, 13, 23)
    return numChoice(rng, { prompt: `Saat ${h}.00 öğleden sonra saat kaçtır?`, answer: h - 12, near: [h - 10, h - 11, 24 - h].filter((x) => x > 0 && x !== h - 12), explain: `Öğleden sonraki saatlerden 12 çıkarırız: ${h} − 12 = ${h - 12}.` })
  }
  const h = randInt(rng, 1, 12)
  const m = 5 * randInt(rng, 0, 11)
  const fmt = (hh: number, mm: number) => `${hh}.${String(mm).padStart(2, '0')}`
  return choice(rng, {
    prompt: t === 'analog' ? 'Saat kaçı gösteriyor?' : 'Dijital saat kaçı gösteriyor? Analog karşılığını seç.',
    correct: t === 'analog' ? fmt(h, m) : { visual: { kind: 'clock', h, m } },
    wrong: t === 'analog' ? [fmt(h, (m + 15) % 60), fmt((h % 12) + 1, m), fmt(h, m === 0 ? 30 : 60 - m)] : [{ visual: { kind: 'clock', h: (h % 12) + 1, m } }, { visual: { kind: 'clock', h, m: (m + 20) % 60 } }],
    visual: t === 'analog' ? { kind: 'clock', h, m } : { kind: 'digital', h, m },
    max: 3,
    explain: `Yelkovan her rakamda 5 dakika ilerler. Saat ${fmt(h, m)}.`,
  })
}

/* ============================ KESİRLER ============================ */
export const kesirler: Gen = (rng, grade, level) => {
  if (grade === 2) {
    if (rng() < 0.35) {
      const q = pick(rng, [['Bir bütün kaç yarımdan oluşur?', 2], ['Bir bütün kaç çeyrekten oluşur?', 4], ['Bir yarım kaç çeyrektir?', 2]] as [string, number][])
      return numChoice(rng, { prompt: q[0], answer: q[1], near: [1, 3, 4, 2].filter((x) => x !== q[1]), explain: 'Bir bütün = 2 yarım = 4 çeyrek. Bir yarım = 2 çeyrek.' })
    }
    const k = pick(rng, [['Bütün', 1, 1], ['Yarım', 1, 2], ['Çeyrek', 1, 4]] as [string, number, number][])
    return choice(rng, { prompt: 'Pizzanın ne kadarı turuncu boyalı?', correct: k[0], wrong: ['Bütün', 'Yarım', 'Çeyrek'], visual: { kind: 'fraction', n: k[1], d: k[2], shape: 'pie' }, max: 3, explain: k[2] === 1 ? 'Pizzanın tamamı boyalı: bütün.' : k[2] === 2 ? '2 eş parçadan biri boyalı: yarım.' : '4 eş parçadan biri boyalı: çeyrek.' })
  }
  if (grade === 3) {
    if (rng() < 0.3) {
      const n = randInt(rng, 1, 7)
      const d = randInt(rng, n + 1, 10)
      const askPay = rng() < 0.5
      return numChoice(rng, { prompt: `${n}/${d} kesrinde ${askPay ? 'PAY' : 'PAYDA'} kaçtır?`, answer: askPay ? n : d, near: [askPay ? d : n, n + d].filter((x) => x !== (askPay ? n : d)), explain: `Kesir çizgisinin üstü pay (${n}), altı paydadır (${d}). Payda, bütünün kaç eş parçaya bölündüğünü gösterir.` })
    }
    const d = randInt(rng, 2, level === 1 ? 6 : 10)
    return choice(rng, { prompt: 'Boyalı kısmı hangi birim kesir gösterir?', correct: `1/${d}`, wrong: [`1/${d + 1}`, `1/${d - 1 || 3}`, `${d}/1`], visual: { kind: 'fraction', n: 1, d, shape: rng() < 0.5 ? 'pie' : 'bar' }, max: 3, explain: `Bütün ${d} eş parçaya bölünmüş, 1 parçası boyalı: 1/${d}.` })
  }
  // 4. sınıf
  const t = pick(rng, ['goster', 'denk', 'karsilastir', 'birimKars', 'cokluk', 'topla'])
  if (t === 'goster') {
    const d = randInt(rng, 3, 8)
    const n = randInt(rng, 1, d - 1)
    return choice(rng, { prompt: 'Boyalı kısmı hangi kesir gösterir?', correct: `${n}/${d}`, wrong: [`${d - n}/${d}`, `${n}/${d + 1}`, `${d}/${n}`], visual: { kind: 'fraction', n, d, shape: 'bar' }, max: 3, explain: `${d} eş parçadan ${n} tanesi boyalı: ${n}/${d}.` })
  }
  if (t === 'denk') {
    const [n, d] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]])
    const k = randInt(rng, 2, 4)
    return choice(rng, { prompt: `${n}/${d} kesrine DENK olan kesir hangisidir?`, correct: `${n * k}/${d * k}`, wrong: [`${n + k}/${d + k}`, `${n * k}/${d}`, `${n}/${d * k}`], max: 3, explain: `Pay ve paydayı aynı sayıyla (${k}) çarparsak denk kesir buluruz: ${n * k}/${d * k}.` })
  }
  if (t === 'karsilastir') {
    const d = randInt(rng, 5, 12)
    const [a, b] = shuffle(rng, Array.from({ length: d - 1 }, (_, i) => i + 1)).slice(0, 2)
    const big = Math.max(a, b)
    return choice(rng, { prompt: `Hangisi daha büyüktür: ${a}/${d} mi, ${b}/${d} mi?`, correct: `${big}/${d}`, wrong: [`${Math.min(a, b)}/${d}`, 'İkisi eşittir'], max: 3, explain: `Paydaları eşit kesirlerde payı büyük olan daha büyüktür: ${big}/${d}.` })
  }
  if (t === 'birimKars') {
    const [a, b] = shuffle(rng, [2, 3, 4, 5, 6, 8]).slice(0, 2)
    const big = Math.min(a, b)
    return choice(rng, { prompt: `Hangisi daha büyüktür: 1/${a} mi, 1/${b} mi?`, correct: `1/${big}`, wrong: [`1/${Math.max(a, b)}`, 'İkisi eşittir'], max: 3, explain: `Birim kesirlerde payda büyüdükçe parça küçülür. Bu yüzden 1/${big} daha büyüktür.` })
  }
  if (t === 'cokluk') {
    const d = pick(rng, [2, 3, 4, 5, 6])
    const tot = d * randInt(rng, 2, 12)
    return numChoice(rng, { prompt: `${tot} elmanın 1/${d}'i kaç elmadır?`, answer: tot / d, near: [tot / d + 1, tot - tot / d, d].filter((x) => x !== tot / d), explain: `${tot}'u ${d} eş parçaya böleriz: ${tot} ÷ ${d} = ${tot / d}.` })
  }
  const d = randInt(rng, 5, 10)
  const a = randInt(rng, 1, d - 2)
  const b = randInt(rng, 1, d - a - 1)
  const sub = rng() < 0.4 && a > b
  const r = sub ? a - b : a + b
  return choice(rng, { prompt: `${a}/${d} ${sub ? '−' : '+'} ${b}/${d} = ?`, correct: `${r}/${d}`, wrong: [`${r}/${d * 2}`, `${r + 1}/${d}`, `${sub ? a + b : Math.abs(a - b)}/${d}`], max: 3, explain: `Paydalar eşitse payları ${sub ? 'çıkarır' : 'toplar'}, paydayı aynen yazarız: ${r}/${d}.` })
}

/* ============================ PARALARIMIZ ============================ */
export const para: Gen = (rng, grade) => {
  if (grade === 1) {
    const notes = [1, 5, 10, 20, 50, 100, 200]
    const v = pick(rng, notes)
    if (rng() < 0.6) return choice(rng, { prompt: 'Bu para kaç lira?', correct: `${v} TL`, wrong: notes.filter((x) => x !== v).map((x) => `${x} TL`), visual: { kind: 'money', items: [v] }, max: 3, explain: `Bu ${v} Türk lirasıdır.` })
    const [a, b] = shuffle(rng, notes).slice(0, 2)
    return choice(rng, { prompt: 'Hangisi daha çok para?', correct: { visual: { kind: 'money', items: [Math.max(a, b)] } }, wrong: [{ visual: { kind: 'money', items: [Math.min(a, b)] } }], max: 2, explain: `${Math.max(a, b)} TL, ${Math.min(a, b)} TL'den daha çoktur.` })
  }
  if (grade === 2) {
    const q = pick(rng, [
      ['1 TL kaç kuruştur?', '100 kuruş', ['10 kuruş', '50 kuruş'], '1 TL = 100 kuruş.', [1]],
      ['2 tane 50 kuruş kaç eder?', '1 TL', ['50 kuruş', '2 TL'], '50 + 50 = 100 kuruş = 1 TL.', [0.5, 0.5]],
      ['4 tane 25 kuruş kaç eder?', '1 TL', ['25 kuruş', '4 TL'], '25 + 25 + 25 + 25 = 100 kuruş = 1 TL.', [0.25, 0.25, 0.25, 0.25]],
      ['2 tane 25 kuruş kaç kuruş eder?', '50 kuruş', ['25 kuruş', '1 TL'], '25 + 25 = 50 kuruş.', [0.25, 0.25]],
      ['Bu paralar toplam kaç kuruş?', '60 kuruş', ['35 kuruş', '1 TL'], '50 + 10 = 60 kuruş.', [0.5, 0.1]],
      ['5 tane 10 kuruş kaç kuruş eder?', '50 kuruş', ['15 kuruş', '1 TL'], '10 + 10 + 10 + 10 + 10 = 50 kuruş.', [0.1, 0.1, 0.1, 0.1, 0.1]],
    ] as [string, string, string[], string, number[]][])
    return choice(rng, { prompt: q[0], correct: q[1], wrong: q[2], visual: { kind: 'money', items: q[4] }, max: 3, explain: q[3] })
  }
  // 3. sınıf
  if (rng() < 0.5) {
    const items = shuffle(rng, [5, 10, 20, 50, 100]).slice(0, randInt(rng, 2, 3))
    const sum = items.reduce((a, b) => a + b, 0)
    return numChoice(rng, { prompt: 'Toplam kaç TL var?', answer: sum, visual: { kind: 'money', items }, near: [sum + 10, sum - 5, sum + 5].filter((x) => x > 0 && x !== sum), fmt: (n) => `${n} TL`, explain: `${items.join(' + ')} = ${sum} TL.` })
  }
  const paid = pick(rng, [50, 100, 200])
  const price = randInt(rng, 5, paid / 5 - 1) * 5
  return numChoice(rng, { prompt: `${paid} TL ile ${price} TL'lik bir kitap aldın. Kaç TL para üstü alırsın?`, answer: paid - price, near: [paid - price + 5, paid - price - 5, paid - price + 10].filter((x) => x > 0), fmt: (n) => `${n} TL`, explain: `${paid} − ${price} = ${paid - price} TL para üstü.` })
}

/* ============================ OLASILIK (4) ============================ */
const OLAY: [string, 'imkansiz' | 'olabilir' | 'kesin'][] = [
  ['Zar atınca 7 gelmesi', 'imkansiz'], ['Bir haftanın 8 gün olması', 'imkansiz'], ['Kedimin uçması', 'imkansiz'], ['Bir yılın 13 ay olması', 'imkansiz'],
  ['Yarın yağmur yağması', 'olabilir'], ['Yazı tura atınca yazı gelmesi', 'olabilir'], ['Zar atınca 6 gelmesi', 'olabilir'], ['Kırmızı ve mavi topların olduğu torbadan kırmızı top çekmek', 'olabilir'],
  ['Pazartesiden sonra salının gelmesi', 'kesin'], ['Sadece mavi topların olduğu torbadan mavi top çekmek', 'kesin'], ['Ocak ayından sonra şubat ayının gelmesi', 'kesin'], ['Zar atınca 1 ile 6 arasında bir sayı gelmesi', 'kesin'],
]
export const olasilik: Gen = (rng) =>
  sort(rng, {
    prompt: 'Olayları doğru kutulara yerleştir!',
    bins: [
      { id: 'imkansiz', label: 'İmkânsız', color: '#e8463c' },
      { id: 'olabilir', label: 'Olabilir', color: '#ffb020' },
      { id: 'kesin', label: 'Kesin', color: '#5bc236' },
    ],
    items: OLAY.map(([label, bin]) => ({ label, bin })),
    count: 5,
    explain: 'Hiç gerçekleşemeyen olay imkânsız, bazen gerçekleşen olay olabilir, her zaman gerçekleşen olay kesindir.',
  })
