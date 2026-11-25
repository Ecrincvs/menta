/**
 * 2. SINIF MATEMATİK YOLU — kitabın 6 teması, her tema bir ada (kaynak: docs/meb-kitaplar/analiz/matematik-2.md).
 * KİTAP SINIRLARI (aşılmaz): sayılar 0–100 (< > sembolü yok); toplam/eksilen ≤ 100, eldeli ve onluk bozmalı olabilir;
 * problemler en çok 2 işlem; çarpmada bir çarpan 0–5, diğeri 0–10 (çarpım ≤ 50); bölmede bölünen ≤ 20, bölen 2–5, kalansız;
 * kesir yalnız bütün/yarım/çeyrek (½ yazımı yok); para: kâğıt 5–200 TL, madenî 25 kr/50 kr/1 TL/5 TL, toplam ≤ 100, para üstü yok;
 * saat: tam, buçuk, çeyrek geçiyor, çeyrek var; uzunluk m/cm (1 m = 100 cm), kütle kg/g (dönüşüm yok), sıvı standart dışı;
 * cisimler: küp, prizmalar, silindir, küre (koni yok); tek simetri çizgisi; veri: en çok 2 grup, grafik değeri ≤ 10.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { choice, input, numChoice, order, type Gen } from './helpers'
import type { Option, PopQ, Question, ShapeKind, SolidKind, Visual } from '../../games/quiz/types'
import { ch, img, karma, mem, mt, pop, rot, srt, tf, type Alan, type P, type Q, type TF } from './yolKit'
import { yolBulmaca } from './mat1'

const near = (n: number, lo = 0, hi = 100) => [n - 1, n + 1, n - 10, n + 10, n + 2, n - 2].filter((x) => x >= lo && x <= hi && x !== n)
const inp = (prompt: string, answer: number, explain: string, visual?: Visual, unit?: string): Question => input({ prompt, answer: String(answer), keys: 'digits', explain, visual, unit })
const OKU = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
const ONLAR = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan']
const okunus = (n: number) => (n === 100 ? 'yüz' : n < 10 ? OKU[n] : `${ONLAR[Math.floor(n / 10)]}${n % 10 ? ' ' + OKU[n % 10] : ''}`)

/* ================================================================ 1. TEMA · NESNELERİN GEOMETRİSİ (1) */
const SOLID_AD: Record<SolidKind, string> = { kup: 'Küp', kure: 'Küre', silindir: 'Silindir', 'kare-prizma': 'Kare prizma', 'dikdortgen-prizma': 'Dikdörtgen prizma', 'ucgen-prizma': 'Üçgen prizma' }
const SOLIDS = Object.keys(SOLID_AD) as SolidKind[]
const cisimAdi: Gen = (rng) => {
  const s = pick(rng, SOLIDS)
  return choice(rng, { prompt: 'Bu geometrik cismin adı nedir?', visual: { kind: 'solid', solid: s }, correct: SOLID_AD[s], wrong: SOLIDS.filter((x) => x !== s).map((x) => SOLID_AD[x]), explain: `Bu bir ${SOLID_AD[s].toLocaleLowerCase('tr-TR')}.`, max: 3 })
}
const NESNE_CISIM: P[] = [
  ['Futbol topu', 'Küre', 'ball'],
  ['Konserve kutusu', 'Silindir', 'can'],
  ['Zar', 'Küp', 'puzzle'],
  ['Süt kutusu', 'Dikdörtgen prizma', 'milk'],
  ['Çadır', 'Üçgen prizma', 'camping'],
  ['Pil', 'Silindir', 'battery'],
  ['Portakal', 'Küre', 'orange'],
  ['Kitap', 'Dikdörtgen prizma', 'book'],
]
const KOSELI: Parameters<typeof srt>[3] = [
  { label: 'Zar', img: 'puzzle', bin: 'koseli' },
  { label: 'Kitap', img: 'book', bin: 'koseli' },
  { label: 'Hediye kutusu', img: 'gift', bin: 'koseli' },
  { label: 'Süt kutusu', img: 'milk', bin: 'koseli' },
  { label: 'Paket', img: 'package', bin: 'koseli' },
  { label: 'Top', img: 'ball', bin: 'yuvarlak' },
  { label: 'Portakal', img: 'orange', bin: 'yuvarlak' },
  { label: 'Dünya', img: 'globe', bin: 'yuvarlak' },
  { label: 'Konserve', img: 'can', bin: 'yuvarlak' },
  { label: 'Pil', img: 'battery', bin: 'yuvarlak' },
]
const SHAPE_AD: Partial<Record<ShapeKind, string>> = { ucgen: 'Üçgen', kare: 'Kare', dikdortgen: 'Dikdörtgen', cember: 'Çember', daire: 'Daire' }
const SEKILLER = Object.keys(SHAPE_AD) as ShapeKind[]
const sekilAdi: Gen = (rng) => {
  const s = pick(rng, SEKILLER)
  const scale = pick(rng, [0.6, 0.8, 1])
  return choice(rng, { prompt: rng() < 0.5 ? 'Bu şeklin adı nedir?' : 'Şekil küçülse ya da dönse de adı değişmez. Bu hangi şekil?', visual: { kind: 'shape', shape: s, scale, color: pick(rng, ['#ff7aa8', '#5aa8ff', '#5bc236', '#ffb020']) }, correct: SHAPE_AD[s]!, wrong: SEKILLER.filter((x) => x !== s).map((x) => SHAPE_AD[x]!), explain: `Bu bir ${SHAPE_AD[s]!.toLocaleLowerCase('tr-TR')}. Yeri, yönü ya da büyüklüğü değişse de biçimi değişmez.`, max: 3 })
}
const GEO1_TF: TF[] = [
  ['Köşesi olmayan cisimlere yuvarlak cisim denir.', true, 'Top, küre gibi cisimlerin köşesi yoktur.'],
  ['Kare döndürülünce üçgen olur.', false, 'Döndürmek biçimi değiştirmez; kare yine karedir.'],
  ['Çemberin içini boyarsak daire olur.', true, 'Çember çizgidir, içi boyanınca daire olur.'],
  ['Konserve kutusu silindire benzer.', true, 'Konserve kutusu silindir biçimindedir.'],
  ['Küp yuvarlak bir cisimdir.', false, 'Küpün köşeleri vardır, köşeli bir cisimdir.'],
  ['Büyütülen üçgen yine üçgendir.', true, 'Büyüklük değişse de biçim aynı kalır.'],
]
const SIVI_Q: Q[] = [
  { q: 'Kovayı en az sayıda doldurmak için hangisini kullanırız?', a: 'Sürahi', w: ['Çay kaşığı', 'Çay bardağı'], ex: 'Büyük kapla daha az sayıda doldururuz.', img: 'droplet' },
  { q: 'Bir sürahiyi hangisiyle doldurursak daha çok sayıda kullanırız?', a: 'Kaşık', w: ['Şişe', 'Kova'], ex: 'Küçük araçla daha çok sayıda doldururuz.', img: 'droplet' },
  { q: 'Hangisi daha çok su alır?', a: 'Kova', w: ['Fincan', 'Çay bardağı'], ex: 'Büyük kap daha çok sıvı alır.', img: 'droplet' },
  { q: '2 bidon = 6 şişe ise 1 bidon kaç şişe eder?', a: '3', w: ['2', '6'], ex: '6 şişe iki bidona eşit paylaşılır: 1 bidon = 3 şişe.', img: 'droplet' },
  { q: 'Bence sürahi 8 bardakla dolar. Ölçünce 6 bardak çıktı. Tahminim nasıldı?', a: 'Fazla', w: ['Eksik', 'Eşit'], ex: '8, 6’dan fazladır; fazla tahmin etmişim.', img: 'thinking' },
  { q: 'Bence şişe 4 bardakla dolar. Ölçünce 5 bardak çıktı. Tahminim nasıldı?', a: 'Eksik', w: ['Fazla', 'Eşit'], ex: '4, 5’ten azdır; eksik tahmin etmişim.', img: 'thinking' },
]
const kacSekil: Gen = (rng) => {
  const sekil = pick(rng, ['Daire', 'Kare', 'Üçgen'] as const)
  const n = randInt(rng, 2, 6)
  const icons = { Daire: 'wheel', Kare: 'package', Üçgen: 'construction' }
  return numChoice(rng, { prompt: `Kamyonun çiziminde ${sekil.toLocaleLowerCase('tr-TR')} biçiminde ${n} parça var. Resimde kaç tane görüyorsun?`, answer: n, visual: { kind: 'objects', img: icons[sekil], count: n }, explain: `${n} tane ${sekil.toLocaleLowerCase('tr-TR')}.`, near: [n - 1, n + 1, n + 2].filter((x) => x > 0) })
}

/* ================================================================ 2. TEMA · SAYILAR VE NİCELİKLER (1) */
const sayOku: Gen = (rng) => {
  const n = randInt(rng, 11, 100)
  return rng() < 0.5
    ? choice(rng, { prompt: `“${okunus(n)}” sayısı hangisi?`, correct: String(n), wrong: [String(n % 10 * 10 + Math.floor(n / 10)), String(n + 1), String(n - 10), String(n + 10)].filter((x) => Number(x) >= 0 && Number(x) <= 100), explain: `${okunus(n)} = ${n}`, max: 3, keepOrder: false })
    : choice(rng, { prompt: `${n} nasıl okunur?`, correct: okunus(n), wrong: [okunus(Math.min(100, n + 1)), okunus(Math.max(0, n - 10)), okunus((n % 10) * 10 + Math.floor(n / 10))].filter((x) => x !== okunus(n)), explain: `${n} “${okunus(n)}” diye okunur.`, max: 3 })
}
const okunusEsle: Gen = (rng) => {
  const nums = shuffle(rng, Array.from({ length: 89 }, (_, i) => i + 11)).slice(0, 4)
  return mt('Sayıyı okunuşuyla eşleştir.', 'Onlar ve birler basamağını oku.', nums.map((n): P => [String(n), okunus(n)]), 4)(rng, 2, 2, [])
}
const bloklar: Gen = (rng) => {
  const t = randInt(rng, 1, 9)
  const o = randInt(rng, 0, 9)
  const n = t * 10 + o
  return rng() < 0.5
    ? inp('Bloklar hangi sayıyı gösteriyor?', n, `${t} onluk ve ${o} birlik = ${n}`, { kind: 'blocks', hundreds: 0, tens: t, ones: o })
    : numChoice(rng, { prompt: `${t} onluk ve ${o} birlik kaç eder?`, answer: n, explain: `${t * 10} + ${o} = ${n}`, near: [o * 10 + t, n + 10, n - 1].filter((x) => x !== n && x >= 0 && x <= 100) })
}
const basamak: Gen = (rng) => {
  const n = randInt(rng, 21, 99)
  const t = Math.floor(n / 10)
  const o = n % 10
  if (o === 0 || o === t) return basamak(rng, 2, 2, [])
  const v = rng() < 0.5
  return v
    ? numChoice(rng, { prompt: `${n} sayısında ${t} rakamının basamak değeri kaçtır?`, answer: t * 10, explain: `${t}, onlar basamağında; değeri ${t * 10}.`, near: [t, o, o * 10].filter((x) => x !== t * 10) })
    : choice(rng, { prompt: `${n} sayısının onlar basamağındaki rakam hangisi?`, correct: String(t), wrong: [String(o), String(t * 10)], explain: `${n} = ${t} onluk ${o} birlik; onlar basamağında ${t} var.`, max: 3 })
}
const bilmece: Gen = (rng) => {
  const t = randInt(rng, 1, 9)
  const o = randInt(rng, 0, 9)
  return inp(`Onlar basamağının değeri ${t * 10}, birler basamağının değeri ${o}. Sayı kaç?`, t * 10 + o, `${t * 10} + ${o} = ${t * 10 + o}`)
}
const sirala: Gen = (rng) => {
  const nums = shuffle(rng, Array.from({ length: 90 }, (_, i) => i + 10)).slice(0, 4)
  const buyuk = rng() < 0.5
  const s = [...nums].sort((a, b) => (buyuk ? b - a : a - b))
  return order({ prompt: `Sayıları ${buyuk ? 'büyükten küçüğe' : 'küçükten büyüğe'} sırala.`, pieces: s.map(String), joiner: ' ', explain: s.join(', '), style: 'chain' })
}
const yakinOnluk: Gen = (rng) => {
  let n = randInt(rng, 11, 99)
  if (n % 10 === 5 || n % 10 === 0) n++
  const alt = Math.floor(n / 10) * 10
  const ust = alt + 10
  const c = n % 10 < 5 ? alt : ust
  return choice(rng, { prompt: `${n} hangi onluğa daha yakındır?`, visual: { kind: 'sequence', items: [alt, '…', n, '…', ust] }, correct: String(c), wrong: [String(c === alt ? ust : alt)], explain: `${n}, ${c}’a daha yakın. ${n} ≈ ${c}`, max: 2 })
}
const arasinda: Gen = (rng) => {
  const a = randInt(rng, 10, 96)
  return inp(`${a} ile ${a + 2} arasındaki sayı kaçtır?`, a + 1, `${a}, ${a + 1}, ${a + 2}`, { kind: 'sequence', items: [a, '?', a + 2] })
}
const RITIM = [
  { adim: 2, ust: 20 },
  { adim: 3, ust: 30 },
  { adim: 4, ust: 40 },
  { adim: 5, ust: 100 },
  { adim: 10, ust: 100 },
]
const ritmik: Gen = (rng) => {
  const r = pick(rng, RITIM)
  const geri = rng() < 0.35
  const bas = randInt(rng, 0, r.ust - r.adim * 5)
  let dizi = Array.from({ length: 5 }, (_, i) => bas + i * r.adim)
  if (geri) dizi = dizi.reverse()
  const g = randInt(rng, 2, 4)
  const cevap = dizi[g]
  const ad = { 2: 'ikişer', 3: 'üçer', 4: 'dörder', 5: 'beşer', 10: 'onar' }[r.adim as 2]
  return rng() < 0.5
    ? inp(`${geri ? 'Geriye doğru ' : ''}${ad} sayıyoruz. Boş yere hangi sayı gelir?`, cevap, `${dizi.join(', ')}`, { kind: 'sequence', items: dizi.map((x, i) => (i === g ? '?' : x)) })
    : numChoice(rng, { prompt: `${geri ? 'Geriye doğru ' : ''}${ad} sayıyoruz. Boş yere hangi sayı gelir?`, answer: cevap, visual: { kind: 'sequence', items: dizi.map((x, i) => (i === g ? '?' : x)) }, explain: dizi.join(', '), near: [cevap + 1, cevap - 1, cevap + r.adim].filter((x) => x >= 0 && x !== cevap) })
}
const ritmikBalon: Gen = (rng) => {
  const adim = pick(rng, [2, 5, 10])
  const bas = adim === 2 ? randInt(rng, 0, 1) : adim === 5 ? pick(rng, [0, 3, 5]) : pick(rng, [0, 7, 4])
  const ust = adim === 2 ? 20 : 100
  const hits = Array.from({ length: 30 }, (_, i) => bas + i * adim).filter((x) => x <= ust).slice(1, 7).map(String)
  const wrongs = shuffle(rng, Array.from({ length: 20 }, (_, i) => bas + 1 + i * adim).filter((x) => x <= ust && !hits.includes(String(x)))).slice(0, 4).map(String)
  const ad = { 2: 'ikişer', 5: 'beşer', 10: 'onar' }[adim as 2]
  return pop(`${bas}’dan başlayıp ${ad} sayarken söylediğimiz sayıları patlat!`, `${bas}, ${hits.join(', ')}…`, hits, wrongs)(rng, 2, 2, [])
}
const oruntu: Gen = (rng) => {
  const fark = pick(rng, [2, 3, 4, 5])
  const azalan = rng() < 0.35
  const bas = azalan ? randInt(rng, fark * 4, 30) : randInt(rng, 1, 10)
  const dizi = Array.from({ length: 4 }, (_, i) => (azalan ? bas - i * fark : bas + i * fark))
  if (dizi.some((x) => x < 0)) return oruntu(rng, 2, 2, [])
  return numChoice(rng, { prompt: `Örüntüde sıradaki sayı kaç? ${dizi.slice(0, 3).join(', ')}, ?`, answer: dizi[3], visual: { kind: 'sequence', items: [...dizi.slice(0, 3), '?'] }, explain: `${bas}’ten başlayıp ${fark} ${azalan ? 'azalır' : 'artar'}: ${dizi.join(', ')}`, near: [dizi[3] + 1, dizi[3] - 1, dizi[3] + fark].filter((x) => x >= 0 && x !== dizi[3]) })
}
const tahmin2: Gen = (rng) => {
  const n = randInt(rng, 12, 40)
  const o = pick(rng, ['apple', 'star', 'balloon', 'duck', 'fish'])
  const yuvar = Math.round(n / 10) * 10
  return choice(rng, { prompt: 'Saymadan tahmin et: yaklaşık kaç tane var?', visual: { kind: 'objects', img: o, count: n }, correct: `Yaklaşık ${yuvar}`, wrong: [`Yaklaşık ${yuvar + 20}`, `Yaklaşık ${Math.max(10, yuvar - 20) === yuvar ? yuvar + 30 : Math.max(10, yuvar - 20)}`, 'Yaklaşık 90'].filter((x) => x !== `Yaklaşık ${yuvar}`), explain: `Tam olarak ${n} tane var; ${yuvar}’a yakın.`, max: 3 })
}

/* ================================================================ 3. TEMA · İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */
const toplama: Gen = (rng, _g, l) => {
  const elde = l >= 2 || rng() < 0.5
  let a: number, b: number
  do {
    a = randInt(rng, 11, 79)
    b = randInt(rng, 5, 99 - a)
  } while (elde !== a % 10 + (b % 10) >= 10 || a + b > 100)
  return rng() < 0.6
    ? inp(`${a} + ${b} = ?`, a + b, elde ? `Birler: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}, 1 onluk elde. Sonuç ${a + b}.` : `${a} + ${b} = ${a + b}`, { kind: 'column', a, b, op: '+' })
    : numChoice(rng, { prompt: `${a} + ${b} kaç eder?`, answer: a + b, explain: `${a} + ${b} = ${a + b}`, near: [a + b - 10, a + b + 10, a + b + 1].filter((x) => x >= 0 && x <= 100) })
}
const cikarma: Gen = (rng, _g, l) => {
  const boz = l >= 2 || rng() < 0.5
  let a: number, b: number
  do {
    a = randInt(rng, 20, 100)
    b = randInt(rng, 5, a - 1)
  } while (boz !== a % 10 < b % 10)
  return rng() < 0.6
    ? inp(`${a} − ${b} = ?`, a - b, boz ? `Birlerden çıkmayınca onluk bozarız. ${a} − ${b} = ${a - b}` : `${a} − ${b} = ${a - b}`, { kind: 'column', a, b, op: '−' })
    : numChoice(rng, { prompt: `${a} − ${b} kaç eder?`, answer: a - b, explain: `${a} − ${b} = ${a - b}`, near: [a - b + 10, a - b - 10, a - b + 1].filter((x) => x >= 0) })
}
const DESTE_Q = (rng: Rng): Question => {
  const v = randInt(rng, 0, 3)
  if (v === 0) { const n = randInt(rng, 1, 5); return numChoice(rng, { prompt: `${n} deste kalem kaç tanedir?`, answer: n * 10, explain: `1 deste = 10 tane. ${n} deste = ${n * 10}`, near: [n * 12, n, n * 10 + 2] }) }
  if (v === 1) { const n = randInt(rng, 1, 3); return numChoice(rng, { prompt: `${n} düzine yumurta kaç tanedir?`, answer: n * 12, explain: `1 düzine = 12 tane. ${n} düzine = ${n * 12}`, near: [n * 10, n * 12 + 2, n] }) }
  if (v === 2) return numChoice(rng, { prompt: '3 düzine kalemden 1 deste kalem verdim. Kaç kalem kaldı?', answer: 26, explain: '3 düzine = 36; 36 − 10 = 26', near: [24, 36, 16] })
  return numChoice(rng, { prompt: '49 cevizden 2 desteyi yedik. Kaç ceviz kaldı?', answer: 29, explain: '2 deste = 20; 49 − 20 = 29', near: [47, 39, 27] })
}
const PROBLEM: (rng: Rng) => [string, number, string] = (rng) => {
  const t = randInt(rng, 0, 5)
  if (t === 0) { const a = randInt(rng, 30, 60), b = randInt(rng, 5, 15), c = randInt(rng, 5, a - b - 1); return [`Aykut’un ${a} TL’si vardı. ${b} TL ile vapura, ${c} TL ile metroya bindi. Kaç TL’si kaldı?`, a - b - c, `${a} − ${b} − ${c} = ${a - b - c}`] }
  if (t === 1) { const a = randInt(rng, 20, 45), b = randInt(rng, 2, 8); return [`Elif ${a} kg. Kardeşi ondan ${b} kg hafif. İkisi toplam kaç kg?`, a + a - b, `${a} + (${a} − ${b}) = ${a + a - b}`] }
  if (t === 2) { const a = randInt(rng, 10, 40), b = randInt(rng, 10, 40); return [`Sınıfta ${a} mavi, ${b} kırmızı kalem var. Toplam kaç kalem var?`, a + b, `${a} + ${b} = ${a + b}`] }
  if (t === 3) { const a = randInt(rng, 40, 99), b = randInt(rng, 10, a - 5); return [`Kütüphanede ${a} kitap vardı. ${b} kitap ödünç verildi. Kaç kitap kaldı?`, a - b, `${a} − ${b} = ${a - b}`] }
  if (t === 4) { const a = randInt(rng, 20, 50), b = randInt(rng, 5, 20), c = randInt(rng, 5, 20); return [`Bahçede ${a} çiçek vardı. ${b} çiçek daha dikildi, sonra ${c} çiçek koparıldı. Kaç çiçek oldu?`, a + b - c, `${a} + ${b} − ${c} = ${a + b - c}`] }
  const a = randInt(rng, 50, 90), b = randInt(rng, 10, 30), c = randInt(rng, 5, a - b - 5); return [`${a} m’lik yolun ${b} m’sini sabah, ${c} m’sini öğlen yürüdük. Kaç m kaldı?`, a - b - c, `${a} − ${b} − ${c} = ${a - b - c}`]
}
const problem: Gen = (rng) => {
  const [q, a, ex] = PROBLEM(rng)
  return rng() < 0.6 ? inp(q, a, ex) : numChoice(rng, { prompt: q, answer: a, explain: ex, near: near(a) })
}
const tahminIslem: Gen = (rng) => {
  const a = randInt(rng, 11, 59), b = randInt(rng, 11, 39)
  if (a % 10 === 5 || b % 10 === 5) return tahminIslem(rng, 2, 2, [])
  const ya = Math.round(a / 10) * 10, yb = Math.round(b / 10) * 10
  const t = ya + yb
  return choice(rng, { prompt: `${a} + ${b} işleminin sonucunu en yakın onluklarla tahmin et.`, correct: String(t), wrong: [String(t + 10), String(t - 10), String(t + 20)], explain: `${a} ≈ ${ya}, ${b} ≈ ${yb}; ${ya} + ${yb} = ${t}. Gerçek sonuç ${a + b}.`, max: 3 })
}
const eksikOge: Gen = (rng) => {
  const t = randInt(rng, 0, 3)
  const a = randInt(rng, 10, 60), b = randInt(rng, 5, 35)
  if (t === 0) return inp(`□ + ${b} = ${a + b}. Kutuya hangi sayı gelir?`, a, `□ = ${a + b} − ${b} = ${a}`, { kind: 'equation', text: `□ + ${b} = ${a + b}` })
  if (t === 1) return inp(`${a} + □ = ${a + b}. Kutuya hangi sayı gelir?`, b, `□ = ${a + b} − ${a} = ${b}`, { kind: 'equation', text: `${a} + □ = ${a + b}` })
  if (t === 2) return inp(`□ − ${b} = ${a}. Kutuya hangi sayı gelir?`, a + b, `Eksilen = fark + çıkan = ${a} + ${b} = ${a + b}`, { kind: 'equation', text: `□ − ${b} = ${a}` })
  return inp(`${a + b} − □ = ${a}. Kutuya hangi sayı gelir?`, b, `Çıkan = eksilen − fark = ${a + b} − ${a} = ${b}`, { kind: 'equation', text: `${a + b} − □ = ${a}` })
}
const CARP_IMG = ['cookie', 'apple', 'star', 'strawberry', 'candy', 'flower']
const carpma: Gen = (rng) => {
  const g = randInt(rng, 2, 5), p = randInt(rng, 1, 10)
  const [grup, adet] = rng() < 0.5 ? [g, p] : [p, g]
  if (grup * adet > 50 || grup > 6) return carpma(rng, 2, 2, [])
  const o = pick(rng, CARP_IMG)
  const v = randInt(rng, 0, 2)
  if (v === 0) return inp(`${grup} tabakta ${adet}’er tane var. ${grup} tane ${adet} kaç eder?`, grup * adet, `${grup} × ${adet} = ${grup * adet}`, { kind: 'groups', img: o, groups: grup, per: adet })
  if (v === 1) return numChoice(rng, { prompt: `${grup} × ${adet} = ?`, answer: grup * adet, explain: `${grup} tane ${adet}: ${Array(grup).fill(adet).join(' + ')} = ${grup * adet}`, near: [grup + adet, grup * adet + adet, grup * adet - adet].filter((x) => x >= 0 && x !== grup * adet) })
  return choice(rng, { prompt: `${Array(grup).fill(adet).join(' + ')} toplamını çarpma ile nasıl yazarız?`, correct: `${grup} × ${adet}`, wrong: [`${adet} + ${grup}`, `${grup} × ${grup}`, `${grup + 1} × ${adet}`], explain: `${grup} tane ${adet} = ${grup} × ${adet}`, max: 3 })
}
const bolme: Gen = (rng) => {
  const bolen = randInt(rng, 2, 5)
  const bolum = randInt(rng, 1, Math.floor(20 / bolen))
  const bolunen = bolen * bolum
  const o = pick(rng, ['carrot', 'apple', 'cookie', 'strawberry'])
  const v = randInt(rng, 0, 2)
  if (v === 0) return inp(`${bolunen} tane ${bolen} tabağa eşit paylaştırılıyor. Bir tabakta kaç tane olur?`, bolum, `${bolunen} ÷ ${bolen} = ${bolum}`, { kind: 'share', img: o, total: bolunen, plates: bolen })
  if (v === 1) return numChoice(rng, { prompt: `${bolunen} ÷ ${bolen} = ?`, answer: bolum, explain: `${bolen} × ${bolum} = ${bolunen}, öyleyse ${bolunen} ÷ ${bolen} = ${bolum}`, near: [bolum + 1, bolum - 1, bolen].filter((x) => x > 0 && x !== bolum) })
  return inp(`${bolunen} tokayı ${bolen}’erli kutulara koyuyoruz. Kaç kutu olur?`, bolum, `${bolunen} ÷ ${bolen} = ${bolum}`)
}
const carpimBalon: Gen = (rng) => {
  const hedef = pick(rng, [10, 12, 20, 6, 8, 15])
  const all: [string, number][] = []
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 5; b++) all.push([`${a}×${b}`, a * b])
  const hits = shuffle(rng, all.filter(([, v]) => v === hedef).map(([t]) => t)).slice(0, 4)
  const wrongs = shuffle(rng, all.filter(([, v]) => v !== hedef && Math.abs(v - hedef) <= 4).map(([t]) => t)).slice(0, 4)
  if (hits.length < 2) return carpimBalon(rng, 2, 2, [])
  const q: PopQ = { type: 'pop', prompt: `Sonucu ${hedef} olan çarpmaları patlat!`, explain: `${hits.join(', ')} = ${hedef}`, target: hits[0], items: shuffle(rng, [...hits, ...wrongs]), need: Math.min(3, hits.length), hits }
  return q
}
const esitlik: Gen = (rng) => {
  const SOL: [string, number][] = [['21 + 17', 38], ['16 ÷ 4', 4], ['34 − 19', 15], ['18 ÷ 3', 6], ['8 × 4', 32], ['45 + 39', 84], ['3 × 8', 24], ['35 − 28', 7], ['2 × 5', 10], ['20 ÷ 5', 4]]
  const SAG: [string, number][] = [['19 + 19', 38], ['62 − 58', 4], ['5 × 3', 15], ['82 − 76', 6], ['91 − 59', 32], ['100 − 16', 84], ['4 × 6', 24], ['14 ÷ 2', 7], ['20 ÷ 2', 10], ['2 × 2', 4]]
  const i = randInt(rng, 0, SOL.length - 1)
  const dogru = rng() < 0.5
  const sag = dogru ? SAG[i] : pick(rng, SAG.filter((x) => x[1] !== SOL[i][1]))
  return tf([[`${SOL[i][0]} = ${sag[0]}`, SOL[i][1] === sag[1], `${SOL[i][0]} = ${SOL[i][1]}; ${sag[0]} = ${sag[1]}.`]])(rng, 2, 2, [])
}

/* ================================================================ 4. TEMA · SAYILAR VE NİCELİKLER (2) */
const kesir: Gen = (rng) => {
  const v = randInt(rng, 0, 3)
  if (v === 0) { const d = pick(rng, [1, 2, 4]); const ad = d === 1 ? 'Bütün' : d === 2 ? 'Yarım' : 'Çeyrek'; return choice(rng, { prompt: 'Boyalı kısım ne kadardır?', visual: { kind: 'fraction', n: 1, d, shape: rng() < 0.5 ? 'pie' : 'bar' }, correct: ad, wrong: ['Bütün', 'Yarım', 'Çeyrek'].filter((x) => x !== ad), explain: d === 1 ? 'Tamamı boyalı: bütün.' : d === 2 ? '2 eş parçadan biri: yarım.' : '4 eş parçadan biri: çeyrek.', max: 3 }) }
  if (v === 1) return choice(rng, { prompt: '1 bütün kaç çeyrektir?', correct: '4 çeyrek', wrong: ['2 çeyrek', '3 çeyrek', '1 çeyrek'], explain: 'Bütünü 4 eş parçaya böleriz: 4 çeyrek.', max: 3, visual: { kind: 'fraction', n: 4, d: 4, shape: 'pie' } })
  if (v === 2) return choice(rng, { prompt: '2 çeyrek kaç yarım eder?', correct: '1 yarım', wrong: ['2 yarım', '1 bütün', '4 yarım'], explain: '2 çeyrek = 1 yarım.', max: 3, visual: { kind: 'fraction', n: 2, d: 4, shape: 'pie' } })
  return choice(rng, { prompt: 'Lahmacunu 4 eş parçaya böldüm, 3 parçasını yedim. Ne kadarını yedim?', correct: '3 çeyrek', wrong: ['1 yarım', '1 bütün', '1 çeyrek'], explain: '4 eş parçanın 3’ü: 3 çeyrek.', max: 3, visual: { kind: 'fraction', n: 3, d: 4, shape: 'pie' } })
}
const KESIR_SORT: Parameters<typeof srt>[3] = [
  { label: 'Bütün elma', img: 'apple', bin: 'butun' },
  { label: 'Bütün karpuz', img: 'watermelon', bin: 'butun' },
  { label: 'Bütün pide', img: 'bread', bin: 'butun' },
  { label: '2 eş parçanın biri', img: 'orange', bin: 'yarim' },
  { label: 'Yarım simit', img: 'donut', bin: 'yarim' },
  { label: 'İkiye bölünmüş tostun biri', img: 'sandwich', bin: 'yarim' },
  { label: '4 eş parçanın biri', img: 'pizza', bin: 'ceyrek' },
  { label: 'Çeyrek kek', img: 'cake', bin: 'ceyrek' },
  { label: 'Dörde bölünmüş elmanın biri', img: 'apple_green', bin: 'ceyrek' },
]
const PARALAR = [5, 10, 20, 50, 100, 200]
const paraTopla: Gen = (rng) => {
  let items: number[]
  do items = shuffle(rng, [5, 5, 10, 10, 20, 20, 50, 1, 1]).slice(0, randInt(rng, 2, 4))
  while (items.reduce((s, x) => s + x, 0) > 100)
  const t = items.reduce((s, x) => s + x, 0)
  return rng() < 0.6 ? inp('Toplam kaç TL var?', t, items.join(' + ') + ` = ${t} TL`, { kind: 'money', items: items.sort((a, b) => b - a) }, 'TL') : numChoice(rng, { prompt: 'Toplam kaç TL var?', answer: t, visual: { kind: 'money', items }, explain: `${items.join(' + ')} = ${t} TL`, near: near(t) })
}
const paraOde: Gen = (rng) => {
  const fiyat = pick(rng, [15, 25, 30, 35, 45, 55, 60, 70, 75, 85])
  const parca = (n: number) => { const out: number[] = []; for (const p of [50, 20, 10, 5]) while (n >= p) { out.push(p); n -= p } return out }
  const dogru = parca(fiyat)
  const yanlis1 = parca(fiyat + 10), yanlis2 = parca(fiyat - 5 > 0 ? fiyat - 5 : fiyat + 5)
  const opt = (x: number[]): Option => ({ visual: { kind: 'money', items: x } })
  return choice(rng, { prompt: `Oyuncak ${fiyat} TL. Para üstü almadan hangi paralarla öderiz?`, correct: opt(dogru), wrong: [opt(yanlis1), opt(yanlis2)], explain: `${dogru.join(' + ')} = ${fiyat} TL`, max: 3 })
}
const PARA_P: P[] = [
  ['2 tane 50 kr', '1 TL'],
  ['4 tane 25 kr', '1 TL'],
  ['2 tane 25 kr', '50 kr'],
  ['2 tane 5 TL', '10 TL'],
  ['2 tane 10 TL', '20 TL'],
  ['5 tane 1 TL', '5 TL'],
]
const paraSirala: Gen = (rng) => {
  const s = shuffle(rng, PARALAR).slice(0, 4).sort((a, b) => a - b)
  return order({ prompt: 'Paraları küçükten büyüğe sırala.', pieces: s.map((x) => `${x} TL`), joiner: ' ', explain: s.map((x) => `${x} TL`).join(' < ').replaceAll('<', ','), style: 'chain' })
}
const SAAT_OKU = (h: number, m: number) => {
  const sonraki = (h % 12) + 1
  const AD = ['on iki', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on', 'on bir', 'on iki']
  const ACC = ['on ikiyi', 'biri', 'ikiyi', 'üçü', 'dördü', 'beşi', 'altıyı', 'yediyi', 'sekizi', 'dokuzu', 'onu', 'on biri', 'on ikiyi']
  const DAT = ['on ikiye', 'bire', 'ikiye', 'üçe', 'dörde', 'beşe', 'altıya', 'yediye', 'sekize', 'dokuza', 'ona', 'on bire', 'on ikiye']
  if (m === 0) return `Saat ${AD[h]}`
  if (m === 30) return `${AD[h][0].toLocaleUpperCase('tr-TR')}${AD[h].slice(1)} buçuk`
  if (m === 15) return `${ACC[h][0].toLocaleUpperCase('tr-TR')}${ACC[h].slice(1)} çeyrek geçiyor`
  return `${DAT[sonraki][0].toLocaleUpperCase('tr-TR')}${DAT[sonraki].slice(1)} çeyrek var`
}
const saat2: Gen = (rng) => {
  const h = randInt(rng, 1, 12)
  const m = pick(rng, [0, 15, 30, 45])
  const v = randInt(rng, 0, 2)
  const wrongs = [[h, (m + 15) % 60], [h % 12 + 1, m], [h, (m + 30) % 60]].map(([a, b]) => SAAT_OKU(a, b))
  if (v === 0) return choice(rng, { prompt: 'Saat kaç?', visual: { kind: 'clock', h, m }, correct: SAAT_OKU(h, m), wrong: wrongs, explain: `Akrep saati, yelkovan dakikayı gösterir: ${SAAT_OKU(h, m)}.`, max: 3 })
  if (v === 1) return choice(rng, { prompt: `“${SAAT_OKU(h, m)}” hangi saattir?`, correct: { visual: { kind: 'clock', h, m } }, wrong: [{ visual: { kind: 'clock', h, m: (m + 30) % 60 } }, { visual: { kind: 'clock', h: h % 12 + 1, m } }], explain: `${SAAT_OKU(h, m)}: ${h}.${String(m).padStart(2, '0')}`, max: 3 })
  return choice(rng, { prompt: 'Dijital saat hangi saati gösteriyor?', visual: { kind: 'digital', h, m }, correct: SAAT_OKU(h, m), wrong: wrongs, explain: `${h}.${String(m).padStart(2, '0')} = ${SAAT_OKU(h, m)}`, max: 3 })
}
const ZAMAN_P: P[] = [
  ['1 saat', '60 dakika', 'clock'],
  ['1 gün', '24 saat', 'sun'],
  ['1 hafta', '7 gün', 'calendar'],
  ['1 yıl', '12 ay', 'calendar'],
  ['1 mevsim', '3 ay', 'cherryblossom'],
  ['1 yıl', '4 mevsim'],
  ['Yarım saat', '30 dakika'],
  ['Çeyrek saat', '15 dakika'],
]
const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const takvim: Gen = (rng) => {
  const i = randInt(rng, 0, 6)
  const n = pick(rng, [1, 2, 3, 7])
  const c = GUNLER[(i + n) % 7]
  return choice(rng, { prompt: n === 7 ? `Bugün ${GUNLER[i].toLocaleLowerCase('tr-TR')}. Bir hafta sonra hangi gün olur?` : `Bugün ${GUNLER[i].toLocaleLowerCase('tr-TR')}. ${n} gün sonra hangi gün olur?`, correct: c, wrong: GUNLER.filter((x) => x !== c), explain: n === 7 ? 'Bir hafta 7 gündür; aynı gün tekrar gelir.' : `${GUNLER.slice(i, i + n + 1).concat(GUNLER).slice(0, n + 1).join(' → ')}`, max: 3, visual: { kind: 'image', img: 'calendar' } })
}
const SURE_Q: Q[] = [
  { q: 'Hangisi daha uzun sürer?', a: 'Gece uykusu', w: ['Diş fırçalama', 'Teneffüs'], ex: 'Uyku yaklaşık 9 saat, diş fırçalama 2 dakika sürer.', img: 'bed' },
  { q: 'Bir ders saati yaklaşık ne kadar sürer?', a: '40 dakika', w: ['2 dakika', '9 saat'], ex: 'Bir ders 40 dakikadır.', img: 'school' },
  { q: 'Dişlerimizi fırçalamak yaklaşık ne kadar sürer?', a: '2 dakika', w: ['2 saat', '2 gün'], ex: 'Dişler yaklaşık 2 dakika fırçalanır.', img: 'toothbrush' },
  { q: 'Hangisi zaman ölçme aracıdır?', a: 'Kum saati', w: ['Cetvel', 'Terazi'], ex: 'Kum saati, çalar saat, dijital saat zamanı ölçer.', img: 'hourglass' },
  { q: 'Akrep neyi gösterir?', a: 'Saati', w: ['Dakikayı', 'Günü'], ex: 'Kısa kol akrep saati, uzun kol yelkovan dakikayı gösterir.', img: 'clock' },
]
const BIRIM_SORT: Parameters<typeof srt>[3] = [
  { label: 'Silgi', img: 'crayon', bin: 'cm' },
  { label: 'Kalem', img: 'pencil', bin: 'cm' },
  { label: 'Makas', img: 'scissors', bin: 'cm' },
  { label: 'Defter', img: 'notebook', bin: 'cm' },
  { label: 'Koridor', img: 'school', bin: 'm' },
  { label: 'Ağaç boyu', img: 'tree', bin: 'm' },
  { label: 'Otobüs', img: 'bus', bin: 'm' },
  { label: 'Futbol sahası', img: 'ball', bin: 'm' },
]
const KUTLE_SORT: Parameters<typeof srt>[3] = [
  { label: 'Fındık', img: 'seedling', bin: 'g' },
  { label: 'Silgi', img: 'crayon', bin: 'g' },
  { label: 'Oyuncak araba', img: 'car', bin: 'g' },
  { label: 'Çilek', img: 'strawberry', bin: 'g' },
  { label: 'Karpuz', img: 'watermelon', bin: 'kg' },
  { label: 'Bir çuval un', img: 'wheat', bin: 'kg' },
  { label: 'Köpek', img: 'dog', bin: 'kg' },
  { label: 'Çocuk', img: 'boy', bin: 'kg' },
]
const OLCU_Q: Q[] = [
  { q: '1 metre kaç santimetredir?', a: '100 cm', w: ['10 cm', '50 cm'], ex: '1 m = 100 cm.', img: 'ruler' },
  { q: 'Ataş yaklaşık 5 cm. Makas 3 ataş boyunda. Makas yaklaşık kaç cm?', a: '15 cm', w: ['5 cm', '30 cm'], ex: '5 + 5 + 5 = 15 cm.', img: 'scissors' },
  { q: 'Bir elmanın kütlesi yaklaşık ne kadardır?', a: '80 g', w: ['80 kg', '8 g'], ex: 'Elma hafiftir, gramla ölçülür: yaklaşık 80 g.', img: 'apple' },
  { q: 'Bir karpuzun kütlesi yaklaşık ne kadardır?', a: '8 kg', w: ['8 g', '80 kg'], ex: 'Karpuz yaklaşık 8 kg gelir.', img: 'watermelon' },
  { q: 'Sınıf kapısının boyu yaklaşık ne kadardır?', a: '2 m', w: ['2 cm', '20 cm'], ex: 'Kapı metreyle ölçülür, yaklaşık 2 m.', img: 'house' },
  { q: 'Hangisiyle kütle ölçeriz?', a: 'Terazi', w: ['Cetvel', 'Saat'], ex: 'Terazi, el kantarı, baskül kütle ölçer.', img: 'scale' },
  { q: 'Terzi kumaşı hangisiyle ölçer?', a: 'Mezura', w: ['Terazi', 'Kum saati'], ex: 'Mezura esnek bir şerit metredir.', img: 'ruler' },
  { q: '90 cm’lik bir çocuk 1 m’den kısa mıdır?', a: 'Evet, kısadır', w: ['Hayır, uzundur', 'Eşittir'], ex: '1 m = 100 cm; 90 cm daha kısadır.', img: 'ruler' },
]
const uzunlukOlc: Gen = (rng) => {
  const a = randInt(rng, 3, 14), b = randInt(rng, 3, 14)
  if (a === b) return uzunlukOlc(rng, 2, 2, [])
  return inp(`Mavi kalem ${a} cm, kırmızı kalem ${b} cm. Uzun olan, kısa olandan kaç cm uzun?`, Math.abs(a - b), `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} cm`, { kind: 'lengths', items: [{ color: '#5aa8ff', len: a, label: `${a} cm` }, { color: '#ff6b6b', len: b, label: `${b} cm` }] }, 'cm')
}

/* ================================================================ 5. TEMA · NESNELERİN GEOMETRİSİ (2) */
const KONUM_Q: Q[] = [
  { q: 'Kroki: Fırın, Alya’nın evi ile marketin arasında. Fırının bir yanında ne var?', a: 'Market', w: ['Okul', 'Park'], ex: 'Fırın, ev ile marketin arasındadır.', img: 'map' },
  { q: 'Okulun sağında park var. Parka okuldan bakınca hangi yöne gideriz?', a: 'Sağa', w: ['Sola', 'Aşağı'], ex: 'Park okulun sağındadır.', img: 'school' },
  { q: 'Kuş ağacın yükseğinde, kedi ağacın dibinde. Hangisi daha alçakta?', a: 'Kedi', w: ['Kuş', 'İkisi de aynı'], ex: 'Ağacın dibi alçaktadır.', img: 'tree' },
  { q: 'Top kutunun içinde değil. Top nerede olabilir?', a: 'Kutunun dışında', w: ['Kutunun içinde', 'Kutunun ta ortasında'], ex: 'İçinde değilse dışındadır.', img: 'package' },
  { q: 'Çocuklar ağacın çevresinde el ele dönüyor. Çocuklar ağacın neresinde?', a: 'Etrafında', w: ['İçinde', 'Altında'], ex: 'Bir şeyin çevresini sarmak: etrafında.', img: 'tree' },
]
const YON_TF: TF[] = [
  ['Yukarı ve aşağı birbirinin tersidir.', true, 'Yukarının tersi aşağıdır.'],
  ['Sağa giden biri sola dönerse geldiği yöne gider.', true, 'Sağın tersi soldur.'],
  ['Engelli kareden geçebiliriz.', false, 'İçi dolu kareler engeldir, üzerinden geçilmez.'],
  ['Krokide yerlerin birbirine göre konumu gösterilir.', true, 'Kroki, bir yerin basit çizimidir.'],
]
const SIMETRI_SORT: Parameters<typeof srt>[3] = [
  { label: 'Kelebek', img: 'butterfly', bin: 'evet' },
  { label: 'Kalp', img: 'heart', bin: 'evet' },
  { label: 'Yıldız', img: 'star', bin: 'evet' },
  { label: 'A harfi', bin: 'evet' },
  { label: 'Kar tanesi', img: 'snowflake', bin: 'evet' },
  { label: 'F harfi', bin: 'hayir' },
  { label: 'Salyangoz', img: 'snail', bin: 'hayir' },
  { label: 'G harfi', bin: 'hayir' },
  { label: 'Ayakkabı (tek)', img: 'shoe', bin: 'hayir' },
]
const SIMETRI_TF: TF[] = [
  ['Simetri çizgisi görseli iki eş parçaya ayırır.', true, 'İki yan birbirinin yansımasıdır.'],
  ['Kelebeğin kanatları simetriktir.', true, 'Ortadan katlanınca kanatlar üst üste gelir.'],
  ['F harfi ortadan katlanınca iki eş parça olur.', false, 'F harfinin simetri çizgisi yoktur.'],
  ['Kilim ve çinilerde simetrik desenler vardır.', true, 'Sanatçılar simetriyi çok kullanır.'],
  ['Suya yansıyan manzarada simetri görürüz.', true, 'Su ayna gibi yansıtır.'],
]
const SIMETRI_HIT = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'Y', 'İ']
const SIMETRI_WRONG = ['F', 'G', 'J', 'K', 'L', 'N', 'R', 'S', 'Z']

/* ================================================================ 6. TEMA · VERİYE DAYALI ARAŞTIRMA */
const VERI_KAT = [
  { soru: 'En sevdiğiniz meyve?', items: [['Elma', 'apple'], ['Muz', 'banana'], ['Çilek', 'strawberry'], ['Üzüm', 'grapes']] },
  { soru: 'En sevdiğiniz hayvan?', items: [['Kedi', 'cat'], ['Köpek', 'dog'], ['Kuş', 'bird'], ['Balık', 'fish']] },
  { soru: 'Okula nasıl geliyorsunuz?', items: [['Yürüyerek', 'walking'], ['Servisle', 'bus'], ['Arabayla', 'car'], ['Bisikletle', 'bicycle']] },
]
const grafik: Gen = (rng) => {
  const k = pick(rng, VERI_KAT)
  const rows = k.items.slice(0, randInt(rng, 3, 4)).map(([label, im]) => ({ label, img: im, count: randInt(rng, 1, 10) }))
  const v = randInt(rng, 0, 3)
  const mx = Math.max(...rows.map((r) => r.count)), mn = Math.min(...rows.map((r) => r.count))
  if (v === 0 && rows.filter((r) => r.count === mx).length === 1) return choice(rng, { prompt: `“${k.soru}” Grafiğe göre en çok hangisi seçildi?`, visual: { kind: 'pictograph', rows }, correct: rows.find((r) => r.count === mx)!.label, wrong: rows.filter((r) => r.count !== mx).map((r) => r.label), explain: `${mx} kişiyle en çok seçilen.`, max: 3 })
  if (v === 1 && rows.filter((r) => r.count === mn).length === 1) return choice(rng, { prompt: `“${k.soru}” Grafiğe göre en az hangisi seçildi?`, visual: { kind: 'pictograph', rows }, correct: rows.find((r) => r.count === mn)!.label, wrong: rows.filter((r) => r.count !== mn).map((r) => r.label), explain: `${mn} kişiyle en az seçilen.`, max: 3 })
  const [a, b] = shuffle(rng, rows).slice(0, 2)
  if (v === 2 && a.count !== b.count) { const [x, y] = a.count > b.count ? [a, b] : [b, a]; return inp(`${x.label} seçenler, ${y.label} seçenlerden kaç fazla?`, x.count - y.count, `${x.count} − ${y.count} = ${x.count - y.count}`, { kind: 'pictograph', rows }) }
  return inp(`${a.label} ve ${b.label} seçenler toplam kaç kişi?`, a.count + b.count, `${a.count} + ${b.count} = ${a.count + b.count}`, { kind: 'pictograph', rows })
}
const cetele: Gen = (rng) => {
  const rows = [['Kırmızı', 'apple'], ['Mavi', 'droplet'], ['Yeşil', 'leaf']].map(([label, im]) => ({ label, img: im, count: randInt(rng, 2, 12) }))
  const r = pick(rng, rows)
  return inp(`Çetele tablosuna göre ${r.label.toLocaleLowerCase('tr-TR')} rengi kaç kişi seçti?`, r.count, `Her 5’li demet 5 eder. ${r.label}: ${r.count}`, { kind: 'tally', rows })
}
const ARASTIRMA_TF: TF[] = [
  ['Sadece bir arkadaşıma soru sormak bir araştırmadır.', false, 'Araştırma sorusu bir gruba sorulur.'],
  ['Araştırma sorusu açık ve net olmalıdır.', true, 'Herkes aynı şeyi anlamalı.'],
  ['Çetele tablosunda her 5 çizgi bir demet yapar.', true, '4 çizgi ve üstüne çapraz 1 çizgi: 5.'],
  ['Şekil grafiğinde her şekil belirli sayıda veriyi gösterir.', true, 'Grafiğin notunda yazar: Her ○ 1 kişi gibi.'],
  ['Sıklık tablosunda veriler sayıyla yazılır.', true, 'Çetelede çizgi, sıklık tablosunda sayı vardır.'],
]
const VERI_SORT: Parameters<typeof srt>[3] = [
  { label: 'Saklambaç', img: 'eyes', bin: 'oyun' },
  { label: 'İp atlama', img: 'running', bin: 'oyun' },
  { label: 'Seksek', img: 'star', bin: 'oyun' },
  { label: 'Körebe', img: 'hug', bin: 'oyun' },
  { label: 'Elma', img: 'apple', bin: 'degil' },
  { label: 'Mavi', img: 'droplet', bin: 'degil' },
  { label: 'Okul çantası', img: 'backpack', bin: 'degil' },
  { label: 'Salıncağa binmek', img: 'ball', bin: 'degil' },
]

/* ================================================================ ADALAR */
const T = 6
const OYUN = 8
export const MAT2_ADALAR: Alan[] = [
  {
    id: 't1', no: 1, title: 'Nesnelerin Geometrisi 1', color: '#2ec4c9', dark: '#149aa0', icon: 'puzzle',
    acts: [
      { kind: 'koseli-yuvarlak', title: 'Köşeli mi, Yuvarlak mı?', icon: 'package', total: 4, meb: 'MAT.2.3.1', gen: srt('Köşeli mi, yuvarlak mı? Sepetlere ayır.', 'Köşesi olmayan cisimler yuvarlak, köşesi olanlar köşelidir.', [{ id: 'koseli', label: 'Köşeli', img: 'package', color: '#3b82f6' }, { id: 'yuvarlak', label: 'Yuvarlak', img: 'ball', color: '#f59e0b' }], KOSELI), ders: 'Köşesi olmayan nesneler yuvarlak cisimlerdir. Köşesi olan nesneler köşeli cisimlerdir.', visual: img('package') },
      { kind: 'cisim-adi', title: 'Cismin Adı', icon: 'puzzle', total: T, meb: 'MAT.2.3.1', gen: cisimAdi, ders: 'Küp, kare prizma, dikdörtgen prizma, üçgen prizma, silindir ve küre geometrik cisimlerdir.', points: ['Top → küre', 'Konserve → silindir', 'Süt kutusu → dikdörtgen prizma'], visual: { kind: 'solid', solid: 'silindir' } },
      { kind: 'nesne-cisim', title: 'Nesne ve Cisim', icon: 'can', total: T, meb: 'MAT.2.3.1', gen: rot(mt('Nesneyi benzediği cisimle eşleştir.', 'Çevremizdeki nesneler geometrik cisimlere benzer.', NESNE_CISIM), mem('Nesne–cisim kartlarını eşleştir!', 'Nesne ve benzediği cisim.', NESNE_CISIM)), ders: 'Futbol topu küreye, zar küpe, konserve silindire benzer.', visual: img('can') },
      { kind: 'sekil-adi', title: 'Şekiller', icon: 'star', total: T, meb: 'MAT.2.3.3', gen: rot(sekilAdi, kacSekil), ders: 'Kare, dikdörtgen, üçgen, çember ve daire geometrik şekillerdir. Çemberin içini boyayınca daire olur.', visual: { kind: 'shape', shape: 'daire', color: '#ffb020' } },
      { kind: 'bicim', title: 'Biçim Değişmez', icon: 'sparkles', total: T, meb: 'MAT.2.3.4', gen: rot(tf(GEO1_TF, 'puzzle'), sekilAdi), ders: 'Geometrik şekil ve cisimlerin yeri, yönü ya da büyüklüğü değişse de biçimleri değişmez.', visual: img('sparkles') },
      { kind: 'sivi', title: 'Sıvıyı Tahmin Et', icon: 'droplet', total: T, meb: 'MAT.2.3.5', gen: ch(SIVI_Q), ders: 'Sıvıları bardak, kaşık, şişe, kova gibi araçlarla ölçebiliriz. Küçük araçla daha çok sayıda doldururuz.', points: ['Büyük kap daha çok sıvı alır', 'Tahmin et, ölç, karşılaştır'], visual: img('droplet') },
      { kind: 'oyun-mimar', title: 'Mimar Robo', icon: 'trophy', total: OYUN, meb: 'MAT.2.3.1', oyun: true, gen: karma(cisimAdi, sekilAdi, mt('Nesneyi cisimle eşleştir.', 'Nesneler ve cisimler.', NESNE_CISIM), ch(SIVI_Q)), ders: 'Cisimleri ve şekilleri tanı, Robo’nun yapısını tamamla!', visual: img('trophy') },
      { kind: 'oyun-avi', title: 'Gizli Şekil Avı', icon: 'magnifier', total: 4, meb: 'MAT.2.3.3', oyun: true, gen: rot(mem('Nesne–cisim kartlarını eşleştir!', 'Nesneler ve cisimler.', NESNE_CISIM), srt('Köşeli mi, yuvarlak mı?', 'Köşe var mı?', [{ id: 'koseli', label: 'Köşeli', img: 'package', color: '#3b82f6' }, { id: 'yuvarlak', label: 'Yuvarlak', img: 'ball', color: '#f59e0b' }], KOSELI)), ders: 'Kartları çevir, eşleri bul!', visual: img('magnifier') },
    ],
  },
  {
    id: 't2', no: 2, title: 'Sayılar ve Nicelikler 1', color: '#ff9a2e', dark: '#d8670b', icon: 'numbers',
    acts: [
      { kind: 'sayi-oku', title: '100’e Kadar Sayılar', icon: 'numbers', total: T, meb: 'MAT.2.1.1', gen: rot(sayOku, okunusEsle), ders: '100’e kadar sayıları okur ve yazarız: 63 “altmış üç” diye okunur.', visual: { kind: 'sequence', items: [61, 62, 63, 64] } },
      { kind: 'bloklar', title: 'Onluk ve Birlik', icon: 'abacus', total: T, meb: 'MAT.2.1.2', gen: bloklar, ders: '10 birlik bir araya gelince 1 onluk olur. 36 = 3 onluk ve 6 birlik.', visual: { kind: 'blocks', hundreds: 0, tens: 3, ones: 6 } },
      { kind: 'basamak', title: 'Basamak Değeri', icon: 'target', total: T, meb: 'MAT.2.1.2', gen: rot(basamak, bilmece), ders: 'Rakamlar yazıldıkları basamağa göre değer alır. 94’te 9’un basamak değeri 90, 4’ün basamak değeri 4.', visual: { kind: 'equation', text: '90 + 4 = 94' } },
      { kind: 'sirala', title: 'Sayıları Sırala', icon: 'ruler', total: T, meb: 'MAT.2.1.3', gen: rot(sirala, arasinda), ders: 'Sayıları küçükten büyüğe ya da büyükten küçüğe sıralarız. Sayı doğrusunda sayılar eşit aralıklarla dizilir.', visual: { kind: 'sequence', items: [10, 20, 30, 40, 50] } },
      { kind: 'yakin-onluk', title: 'En Yakın Onluk', icon: 'target', total: T, meb: 'MAT.2.1.3', gen: yakinOnluk, ders: '87, 90’a daha yakındır. Sayıları en yakın onluğa yuvarlayabiliriz.', visual: { kind: 'sequence', items: [80, '…', 87, '…', 90] } },
      { kind: 'ritmik', title: 'Ritmik Sayma', icon: 'music', total: T, meb: 'MAT.2.1.4', gen: rot(ritmik, ritmikBalon), ders: 'İkişer 20’ye, üçer 30’a, dörder 40’a, beşer ve onar 100’e kadar sayarız. İstediğimiz sayıdan başlayabiliriz.', visual: { kind: 'sequence', items: [3, 8, 13, 18, '?'] } },
      { kind: 'oruntu', title: 'Sayı Örüntüleri', icon: 'sparkles', total: T, meb: 'MAT.2.1.5', gen: oruntu, ders: '“3’ten başlayıp 2 artar” örüntünün kuralıdır: 3, 5, 7, 9…', visual: { kind: 'sequence', items: [3, 5, 7, '?'] } },
      { kind: 'tahmin', title: 'Tahmin Et', icon: 'eye', total: T, meb: 'MAT.2.1.6', gen: tahmin2, ders: 'Önce tahmin eder, sonra sayarız. Tahminimiz fazla, eksik ya da eşit olabilir.', visual: img('eye') },
      { kind: 'oyun-tuttum', title: 'Aklımdan Sayı Tuttum', icon: 'thinking', total: OYUN, meb: 'MAT.2.1.3', oyun: true, gen: karma(sayOku, bloklar, yakinOnluk, ritmik, oruntu), ders: 'Robo’nun tuttuğu sayıları bul: oku, yuvarla, say!', visual: img('thinking') },
      { kind: 'oyun-fabrika', title: 'Onluk Fabrikası', icon: 'factory', total: 4, meb: 'MAT.2.1.2', oyun: true, gen: rot(ritmikBalon, okunusEsle, bloklar), ders: 'Balonları patlat, sayıları eşleştir!', visual: img('factory') },
    ],
  },
  {
    id: 't3', no: 3, title: 'İşlemlerden Cebirsel Düşünmeye', color: '#9b6ef3', dark: '#6b43c4', icon: 'abacus',
    acts: [
      { kind: 'eldeli', title: 'Eldeli Toplama', icon: 'abacus', total: T, meb: 'MAT.2.2.1', gen: toplama, ders: 'Alt alta toplarken birler birlerin, onlar onların altına gelir. 8 + 5 = 13: 3 birlere yazılır, 1 onluk elde onlara eklenir.', visual: { kind: 'column', a: 38, b: 25, op: '+' } },
      { kind: 'onluk-bozma', title: 'Onluk Bozarak Çıkarma', icon: 'abacus', total: T, meb: 'MAT.2.2.1', gen: cikarma, ders: '2 birlikten 7 birlik çıkmaz; onlardan 1 onluk alıp 10 birlik olarak ekleriz.', visual: { kind: 'column', a: 32, b: 27, op: '−' } },
      { kind: 'deste', title: 'Deste ve Düzine', icon: 'egg', total: T, meb: 'MAT.2.2.1', gen: DESTE_Q, ders: 'Aynı türden 10 nesne 1 deste, 12 nesne 1 düzinedir.', visual: img('egg') },
      { kind: 'problem', title: 'Problem Çözelim', icon: 'memo', total: T, meb: 'MAT.2.2.1', gen: problem, ders: 'Problemi oku: verilenleri ve istenenleri bul, çöz, kontrol et.', points: ['Verilenler', 'İstenenler', 'Çözüm', 'Kontrol'], visual: img('memo') },
      { kind: 'tahmin-islem', title: 'Sonucu Tahmin Et', icon: 'thinking', total: T, meb: 'MAT.2.2.2', gen: tahminIslem, ders: 'Sayıları en yakın onluğa yuvarlayıp toplarsak sonucu tahmin ederiz: 36 + 13 ≈ 40 + 10 = 50.', visual: img('thinking') },
      { kind: 'eksik-oge', title: 'Kayıp Sayı', icon: 'detective', total: T, meb: 'MAT.2.2.3', gen: eksikOge, ders: 'Toplama ve çıkarma ters işlemlerdir: 70 + 15 = 85 ise 85 − 70 = 15.', visual: { kind: 'equation', text: '18 + □ = 30' } },
      { kind: 'carpma', title: 'Çarpma', icon: 'cookie', total: T, meb: 'MAT.2.2.4', gen: carpma, ders: '“6 tane 4” = 6 × 4: 6 grup, her grupta 4. Çarpma tekrarlı toplamadır.', points: ['Grup sayısı × bir gruptaki sayı', '3 × 4 = 4 × 3'], visual: { kind: 'groups', img: 'cookie', groups: 3, per: 4 } },
      { kind: 'bolme', title: 'Bölme', icon: 'carrot', total: T, meb: 'MAT.2.2.4', gen: bolme, ders: 'Bölme eşit paylaştırmadır: 15 havuç 5 sepete → her sepette 3. 15 ÷ 5 = 3.', visual: { kind: 'share', img: 'carrot', total: 12, plates: 3 } },
      { kind: 'carpim-balon', title: 'Çarpım Balonları', icon: 'balloon', total: 4, meb: 'MAT.2.2.5', gen: carpimBalon, ders: 'Aynı sonucu veren farklı çarpmalar vardır: 4 × 5 = 5 × 4 = 10 × 2.', visual: img('balloon') },
      { kind: 'esitlik', title: 'Eşitlik Terazisi', icon: 'balance', total: T, meb: 'MAT.2.2.6', gen: esitlik, ders: '“=” işareti sonuçları eşit iki işlem arasında kullanılır: 3 × 8 = 4 × 6.', visual: img('balance') },
      { kind: 'oyun-sandik', title: 'Şifreli Sandık', icon: 'key2', total: OYUN, meb: 'MAT.2.2.4', oyun: true, gen: karma(toplama, cikarma, carpma, bolme, eksikOge), ders: 'Her doğru işlem sandığın bir şifresini açar!', visual: img('key2') },
      { kind: 'oyun-torba', title: 'Sayı Torbası', icon: 'gift', total: 4, meb: 'MAT.2.2.6', oyun: true, gen: rot(carpimBalon, esitlik, problem), ders: 'Torbadan çıkan sayıya giden işlemleri bul!', visual: img('gift') },
    ],
  },
  {
    id: 't4', no: 4, title: 'Sayılar ve Nicelikler 2', color: '#ffb020', dark: '#c98400', icon: 'coin',
    acts: [
      { kind: 'kesir', title: 'Bütün, Yarım, Çeyrek', icon: 'pizza', total: T, meb: 'MAT.2.1.7', gen: rot(kesir, srt('Bütün mü, yarım mı, çeyrek mi?', 'Bütünü 2 eş parçaya bölünce yarım, 4 eş parçaya bölünce çeyrek olur.', [{ id: 'butun', label: 'Bütün', img: 'apple', color: '#22c55e' }, { id: 'yarim', label: 'Yarım', img: 'orange', color: '#f59e0b' }, { id: 'ceyrek', label: 'Çeyrek', img: 'pizza', color: '#ef4444' }], KESIR_SORT)), ders: 'Bir bütünü iki eş parçaya bölünce her biri yarım, dört eş parçaya bölünce her biri çeyrektir. 1 bütün = 2 yarım = 4 çeyrek.', visual: { kind: 'fraction', n: 1, d: 4, shape: 'pie' } },
      { kind: 'para-topla', title: 'Paralarımız', icon: 'banknote', total: T, meb: 'MAT.2.1.8', gen: rot(paraTopla, paraSirala), ders: 'Kâğıt paralarımız 5, 10, 20, 50, 100, 200 TL; madenî paralarımız 25 kr, 50 kr, 1 TL, 5 TL.', visual: { kind: 'money', items: [20, 10, 5] } },
      { kind: 'para-ode', title: 'Fiyat Kadar Öde', icon: 'cart', total: T, meb: 'MAT.2.1.8', gen: rot(paraOde, mt('Eşit değerleri eşleştir.', '1 TL = 100 kuruş: 2 × 50 kr = 1 TL, 4 × 25 kr = 1 TL.', PARA_P)), ders: 'Para üstü almadan, fiyat kadar parayı seçeriz. 1 TL = 2 tane 50 kr = 4 tane 25 kr.', visual: { kind: 'money', items: [0.5, 0.25, 0.25] } },
      { kind: 'saat', title: 'Saat Kaç?', icon: 'clock', total: T, meb: 'MAT.2.1.9', gen: saat2, ders: 'Kısa kol akrep saati, uzun kol yelkovan dakikayı gösterir. Yelkovan 12’de tam, 6’da buçuk, 3’te çeyrek geçiyor, 9’da çeyrek var.', points: ['8.30 → sekiz buçuk', '9.15 → dokuzu çeyrek geçiyor', '5.45 → altıya çeyrek var'], visual: { kind: 'clock', h: 9, m: 15 } },
      { kind: 'takvim', title: 'Takvim Dedektifi', icon: 'calendar', total: T, meb: 'MAT.2.1.9', gen: rot(takvim, mem('Zaman kartlarını eşleştir!', '1 saat = 60 dakika, 1 hafta = 7 gün…', ZAMAN_P), ch(SURE_Q)), ders: '1 hafta 7 gün, 1 yıl 12 ay, 1 gün 24 saat, 1 saat 60 dakikadır.', visual: img('calendar') },
      { kind: 'uzunluk', title: 'Metre ve Santimetre', icon: 'ruler', total: T, meb: 'MAT.2.1.10', gen: rot(srt('cm ile mi, m ile mi ölçülür?', 'Kısa uzunlukları cm, uzun uzunlukları m ile ölçeriz.', [{ id: 'cm', label: 'cm', img: 'ruler', color: '#3b82f6' }, { id: 'm', label: 'm', img: 'school', color: '#f59e0b' }], BIRIM_SORT), uzunlukOlc), ders: 'Uzunluk birimi metredir (m). 1 m’den kısalar için santimetre (cm) kullanırız. 1 m = 100 cm.', visual: { kind: 'lengths', items: [{ color: '#5aa8ff', len: 10, label: '10 cm' }] } },
      { kind: 'kutle', title: 'Kilogram ve Gram', icon: 'scale', total: T, meb: 'MAT.2.1.10', gen: rot(srt('g ile mi, kg ile mi ölçülür?', 'Hafif nesneler gram, ağır nesneler kilogramla ölçülür.', [{ id: 'g', label: 'g', img: 'strawberry', color: '#22c55e' }, { id: 'kg', label: 'kg', img: 'watermelon', color: '#ef4444' }], KUTLE_SORT), ch(OLCU_Q)), ders: 'Kütle birimi kilogramdır (kg). 1 kg’dan hafif nesneler için gram (g) kullanırız.', visual: img('scale') },
      { kind: 'olcu-tahmin', title: 'Ölçmede Tahmin', icon: 'ruler', total: T, meb: 'MAT.2.1.11', gen: ch(OLCU_Q), ders: 'Bildiğimiz bir nesneyle karşılaştırarak tahmin ederiz: ataş yaklaşık 5 cm, cetvel 30 cm.', visual: img('ruler') },
      { kind: 'oyun-pazar', title: 'Robo’nun Pazar Günü', icon: 'store', total: OYUN, meb: 'MAT.2.1.8', oyun: true, gen: karma(paraTopla, paraOde, saat2, ch(OLCU_Q), kesir), ders: 'Pazarda alışveriş yap, saate yetiş, doğru birimi seç!', visual: img('store') },
      { kind: 'oyun-sofra', title: 'Lahmacun Sofrası', icon: 'pizza', total: 4, meb: 'MAT.2.1.7', oyun: true, gen: rot(kesir, mem('Zaman kartlarını eşleştir!', 'Zaman birimleri.', ZAMAN_P), mt('Eşit değerleri eşleştir.', 'Paralar.', PARA_P)), ders: 'Dilimleri doğru tabaklara dağıt!', visual: img('pizza') },
    ],
  },
  {
    id: 't5', no: 5, title: 'Nesnelerin Geometrisi 2', color: '#ff7aa8', dark: '#d84c7e', icon: 'map',
    acts: [
      { kind: 'konum', title: 'Nerede?', icon: 'map', total: T, meb: 'MAT.2.3.6', gen: rot(ch(KONUM_Q), tf(YON_TF, 'map')), ders: 'Altında, üstünde, arasında, yakında, uzakta, etrafında, sağında, solunda… Krokide yerlerin konumunu buluruz.', visual: img('map') },
      { kind: 'izgara', title: 'Izgarada Yol', icon: 'compass', total: T, meb: 'MAT.2.3.6', gen: yolBulmaca, ders: 'Yukarı, aşağı, sağa, sola kaç kare gideceğimizi söyleyerek yol tarif ederiz.', points: ['4 kare sağa', '1 kare yukarı'], visual: img('compass') },
      { kind: 'simetri', title: 'Simetri', icon: 'butterfly', total: T, meb: 'MAT.2.3.7', gen: rot(srt('Simetrik mi? Sepetlere ayır.', 'Ortadan katlanınca iki eş parça oluşuyorsa simetriktir.', [{ id: 'evet', label: 'Simetrik', img: 'butterfly', color: '#22c55e' }, { id: 'hayir', label: 'Simetrik değil', img: 'snail', color: '#ef4444' }], SIMETRI_SORT), tf(SIMETRI_TF, 'butterfly')), ders: 'Ortadan katlandığında iki eş parça oluşuyorsa bu çizgi simetri çizgisidir. Kelebek kanatları simetriktir.', visual: img('butterfly') },
      { kind: 'simetri-harf', title: 'Simetrik Harfler', icon: 'abc', total: 3, meb: 'MAT.2.3.7', gen: pop('Ortadan dikey katlanınca iki eş parça olan harfleri patlat!', 'A, H, M, O, T, U, V, Y harfleri dikey simetri çizgisine sahiptir.', SIMETRI_HIT, SIMETRI_WRONG), ders: 'Bazı harfler simetriktir: A, H, M, O, T…', visual: img('abc') },
      { kind: 'oyun-hazine', title: 'Hazine Haritası', icon: 'map', total: OYUN, meb: 'MAT.2.3.6', oyun: true, gen: karma(yolBulmaca, ch(KONUM_Q), tf(SIMETRI_TF)), ders: 'İpuçlarıyla hazineyi bul!', visual: img('map') },
      { kind: 'oyun-ayna', title: 'Ayna Atölyesi', icon: 'sparkles', total: 4, meb: 'MAT.2.3.7', oyun: true, gen: rot(pop('Simetrik harfleri patlat!', 'Dikey simetri çizgisi olan harfler.', SIMETRI_HIT, SIMETRI_WRONG), srt('Simetrik mi?', 'İki eş parça.', [{ id: 'evet', label: 'Simetrik', img: 'butterfly', color: '#22c55e' }, { id: 'hayir', label: 'Simetrik değil', img: 'snail', color: '#ef4444' }], SIMETRI_SORT)), ders: 'Simetriyi bul, deseni tamamla!', visual: img('sparkles') },
    ],
  },
  {
    id: 't6', no: 6, title: 'Veriye Dayalı Araştırma', color: '#4f9bff', dark: '#2f6fd1', icon: 'chart',
    acts: [
      { kind: 'arastirma', title: 'Araştırma Sorusu', icon: 'thinking', total: T, meb: 'MAT.2.4.1', gen: rot(tf(ARASTIRMA_TF, 'chart'), srt('Hangi cevap “Geleneksel çocuk oyunu” sorusuna uygun?', 'Uygun olmayan cevapları ayıklarız.', [{ id: 'oyun', label: 'Geleneksel oyun', img: 'puzzle', color: '#22c55e' }, { id: 'degil', label: 'Uygun değil', img: 'noentry', color: '#ef4444' }], VERI_SORT)), ders: 'Araştırma sorusu açık ve net olmalı, uygun bir gruba sorulmalıdır.', visual: img('thinking') },
      { kind: 'cetele', title: 'Çetele Tablosu', icon: 'memo', total: T, meb: 'MAT.2.4.1', gen: cetele, ders: 'Çetelede her veri bir çizgidir; 5 çizgi bir demet yapar.', visual: { kind: 'tally', rows: [{ label: 'Elma', count: 7 }] } },
      { kind: 'sekil-grafigi', title: 'Şekil Grafiği', icon: 'chart', total: T, meb: 'MAT.2.4.1', gen: grafik, ders: 'Verilerin şekillerle gösterilmesine şekil grafiği denir; her şekil belirli sayıda veriyi gösterir.', visual: img('chart') },
      { kind: 'karar', title: 'Veriyle Karar Ver', icon: 'target', total: T, meb: 'MAT.2.4.1', gen: rot(grafik, cetele), ders: 'Grafiğe bakarak en çok, en az, kaç fazla gibi sorulara cevap verir, karar alırız.', visual: img('target') },
      { kind: 'oyun-anket', title: 'Ada Anketi', icon: 'chart', total: OYUN, meb: 'MAT.2.4.1', oyun: true, gen: karma(grafik, cetele, tf(ARASTIRMA_TF)), ders: 'Adadaki hayvanlara soru sor, cevapları grafiğe dök!', visual: img('chart') },
      { kind: 'oyun-koy', title: 'İki Köy Yarışı', icon: 'houses', total: 4, meb: 'MAT.2.4.1', oyun: true, gen: rot(grafik, grafik, cetele), ders: 'İki köyün grafiklerini karşılaştır!', visual: img('houses') },
    ],
  },
]

/* ================================================================ EK ETKİNLİKLER (her bölüme ikinci/üçüncü biçim) */
const sayiDogrusu: Gen = (rng) => {
  const adim = pick(rng, [1, 2, 10])
  const bas = adim === 10 ? 0 : randInt(rng, 0, adim === 1 ? 14 : 8)
  const dizi = Array.from({ length: 6 }, (_, i) => bas + i * adim)
  const g = randInt(rng, 1, 4)
  return inp(`Sayı doğrusunda ${adim === 1 ? 'birer' : adim === 2 ? 'ikişer' : 'onar'} artıyor. Boş kutuya hangi sayı gelir?`, dizi[g], dizi.join(', '), { kind: 'sequence', items: dizi.map((x, i) => (i === g ? '?' : x)) })
}
const onceSonra: Gen = (rng) => {
  const n = randInt(rng, 2, 99)
  const once = rng() < 0.5
  return numChoice(rng, { prompt: `${n} sayısından hemen ${once ? 'önce' : 'sonra'} hangi sayı gelir?`, answer: once ? n - 1 : n + 1, explain: `${n - 1}, ${n}, ${n + 1}`, near: [once ? n + 1 : n - 1, n + 10, n - 10].filter((x) => x >= 0 && x <= 100) })
}
const SIRA_AD = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı']
const siraSayisi: Gen = (rng) => {
  const renkler = shuffle(rng, ['kırmızı', 'mavi', 'sarı', 'yeşil', 'mor', 'turuncu'])
  const i = randInt(rng, 0, 5)
  return choice(rng, { prompt: `Balonlar sırayla: ${renkler.join(', ')}. ${renkler[i][0].toLocaleUpperCase('tr-TR')}${renkler[i].slice(1)} balon kaçıncı sırada?`, correct: SIRA_AD[i], wrong: SIRA_AD.filter((_, k) => k !== i), explain: `${renkler[i]} balon ${i + 1}. sırada: ${SIRA_AD[i]}.`, max: 3 })
}
const TERIM_Q: Q[] = [
  { q: '38 + 25 = 63 işleminde 63’e ne denir?', a: 'Toplam', w: ['Fark', 'Çarpım'], ex: 'Toplama işleminin sonucu toplamdır.' },
  { q: '85 − 25 = 60 işleminde 60’a ne denir?', a: 'Fark', w: ['Toplam', 'Bölüm'], ex: 'Çıkarma işleminin sonucu farktır.' },
  { q: '85 − 25 = 60 işleminde 85’e ne denir?', a: 'Eksilen', w: ['Çıkan', 'Toplanan'], ex: 'Kendisinden çıkarılan sayı eksilendir.' },
  { q: '4 × 5 = 20 işleminde 20’ye ne denir?', a: 'Çarpım', w: ['Toplam', 'Bölüm'], ex: 'Çarpma işleminin sonucu çarpımdır.' },
  { q: '12 ÷ 3 = 4 işleminde 4’e ne denir?', a: 'Bölüm', w: ['Bölen', 'Çarpım'], ex: 'Bölme işleminin sonucu bölümdür.' },
  { q: '12 ÷ 3 = 4 işleminde 3’e ne denir?', a: 'Bölen', w: ['Bölünen', 'Fark'], ex: 'Kaça böldüğümüz sayı bölendir.' },
]
const degisme: Gen = (rng) => {
  const a = randInt(rng, 11, 45), b = randInt(rng, 5, 40)
  const c = randInt(rng, 2, 5), d = randInt(rng, 2, 9)
  return mt('Sonucu aynı olan işlemleri eşleştir.', 'Toplananların ya da çarpanların yeri değişince sonuç değişmez.', [
    [`${a} + ${b}`, `${b} + ${a}`],
    [`${c} × ${d}`, `${d} × ${c}`],
    [`${a + 1} + ${b}`, `${b} + ${a + 1}`],
    [`${c} × ${d + 1}`, `${d + 1} × ${c}`],
  ], 4)(rng, 2, 2, [])
}
const sagla: Gen = (rng) => {
  const a = randInt(rng, 2, 5), b = randInt(rng, 2, 4)
  return choice(rng, { prompt: `${a} × ${b} = ${a * b} işlemini hangi bölme ile sağlarız?`, correct: `${a * b} ÷ ${b} = ${a}`, wrong: [`${a * b} ÷ ${a * b} = 1`, `${a * b} − ${b} = ${a * b - b}`, `${a} + ${b} = ${a + b}`], explain: `Çarpmanın sağlaması bölmeyle yapılır: ${a * b} ÷ ${b} = ${a}.`, max: 3 })
}
const ardisikCikarma: Gen = (rng) => {
  const b = randInt(rng, 2, 5), k = randInt(rng, 2, Math.floor(20 / b))
  const n = b * k
  return inp(`${n}’den kaç kez ${b} çıkarırsak 0’a ulaşırız?`, k, `${n} ÷ ${b} = ${k}`, { kind: 'equation', text: `${n} − ${b} − ${b} − … = 0` })
}
const ucToplanan: Gen = (rng) => {
  const a = randInt(rng, 5, 30), b = randInt(rng, 5, 30), c = randInt(rng, 5, 100 - a - b)
  return inp(`${a} + ${b} + ${c} = ?`, a + b + c, `${a} + ${b} = ${a + b}; ${a + b} + ${c} = ${a + b + c}`)
}
const zihinden: Gen = (rng) => {
  const a = randInt(rng, 2, 8) * 10
  const b = randInt(rng, 1, 9) * (rng() < 0.5 ? 1 : 10)
  if (rng() < 0.5 && a + b <= 100) return numChoice(rng, { prompt: `Zihinden hesapla: ${a} + ${b}`, answer: a + b, explain: `${a} + ${b} = ${a + b}`, near: near(a + b) })
  const c = Math.min(b, a)
  return numChoice(rng, { prompt: `Zihinden hesapla: ${a} − ${c}`, answer: a - c, explain: `${a} − ${c} = ${a - c}`, near: near(a - c) })
}
const KURUS_Q: Q[] = [
  { q: '1 TL kaç kuruştur?', a: '100 kuruş', w: ['10 kuruş', '50 kuruş'], ex: '1 TL = 100 kr.', img: 'coin' },
  { q: 'Kaç tane 50 kuruş 1 TL eder?', a: '2', w: ['4', '5'], ex: '50 + 50 = 100 kr = 1 TL.', img: 'coin' },
  { q: 'Kaç tane 25 kuruş 1 TL eder?', a: '4', w: ['2', '3'], ex: '25 + 25 + 25 + 25 = 100 kr = 1 TL.', img: 'coin' },
  { q: 'Hangisi kâğıt paradır?', a: '20 TL', w: ['25 kuruş', '50 kuruş'], ex: 'Kâğıt paralar 5, 10, 20, 50, 100, 200 TL.', img: 'banknote' },
  { q: 'En değerli kâğıt paramız hangisi?', a: '200 TL', w: ['100 TL', '50 TL'], ex: 'En büyük kâğıt paramız 200 TL.', img: 'banknote' },
  { q: 'Harçlığımın bir kısmını kumbaraya atarsam ne yapmış olurum?', a: 'Tasarruf', w: ['İsraf', 'Borç'], ex: 'Biriktirmek tasarruftur.', img: 'coin' },
]
const GUN_BOLUM = ['Sabah', 'Öğleden önce', 'Öğle', 'Öğleden sonra', 'Akşam', 'Gece']
const gununBolumleri: Gen = (rng) => {
  const n = rng() < 0.5 ? 4 : 6
  return order({ prompt: 'Günün bölümlerini sırala.', pieces: GUN_BOLUM.slice(0, n), joiner: ' ', explain: GUN_BOLUM.join(' → '), style: 'chain' })
}
const MEVSIM_P: P[] = [
  ['Kış', 'Aralık, ocak, şubat', 'snowman'],
  ['İlkbahar', 'Mart, nisan, mayıs', 'cherryblossom'],
  ['Yaz', 'Haziran, temmuz, ağustos', 'sun'],
  ['Sonbahar', 'Eylül, ekim, kasım', 'fallenleaf'],
]
const kutleKarsilastir: Gen = (rng) => {
  const a = randInt(rng, 18, 40)
  let b = randInt(rng, 18, 40)
  if (a === b) b = a + 3
  return inp(`Ali ${a} kg, Can ${b} kg. Ağır olan, hafif olandan kaç kg fazla?`, Math.abs(a - b), `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} kg`, { kind: 'balance', left: { text: `${a} kg` }, right: { text: `${b} kg` }, tilt: a > b ? -1 : 1 }, 'kg')
}
const SIMETRI_CIZGI_Q: Q[] = [
  { q: 'Simetri çizgisi görseli kaç eş parçaya ayırır?', a: '2', w: ['3', '4'], ex: 'Simetri çizgisi iki eş parça oluşturur.', img: 'butterfly' },
  { q: 'Kelebeğin simetri çizgisi nerededir?', a: 'Tam ortasında', w: ['Kanadının ucunda', 'Başının üstünde'], ex: 'Gövdesinin ortasından geçer.', img: 'butterfly' },
  { q: 'Hangisinin simetri çizgisi vardır?', a: 'Kalp', w: ['F harfi', 'Salyangoz'], ex: 'Kalp ortadan katlanınca iki eş parça olur.', img: 'heart' },
  { q: 'Bir kâğıdı ikiye katlayıp kesince açtığımızda ne görürüz?', a: 'Simetrik bir şekil', w: ['Hiçbir şey', 'Üç parça'], ex: 'Kat çizgisi simetri çizgisi olur.', img: 'scissors' },
  { q: 'Suya yansıyan dağ ile gerçek dağ arasında ne vardır?', a: 'Simetri', w: ['Toplama', 'Ölçme'], ex: 'Su yüzeyi bir simetri çizgisi gibidir.', img: 'mountain' },
]
const KULUP = ['Resim', 'Müzik', 'Spor']
const ikiGrup: Gen = (rng) => {
  const i = randInt(rng, 0, 2)
  const a = randInt(rng, 3, 10), b = randInt(rng, 3, 10)
  return inp(`2/A’da ${a}, 2/B’de ${b} kişi ${KULUP[i].toLocaleLowerCase('tr-TR')} kulübünü seçti. İki sınıfta toplam kaç kişi seçti?`, a + b, `${a} + ${b} = ${a + b}`, { kind: 'pictograph', rows: [{ label: `2/A ${KULUP[i]}`, img: 'star', count: a }, { label: `2/B ${KULUP[i]}`, img: 'heart', count: b }] })
}
const KAP_P: P[] = [
  ['Kova', 'Büyük kap', 'wastebasket'],
  ['Kaşık', 'Çok küçük', 'bowl'],
  ['Sürahi', 'Orta boy', 'teapot'],
  ['Bardak', 'Küçük kap', 'glass'],
  ['Damacana', 'Çok büyük', 'droplet'],
]

const EK2: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'cisim-dy', title: 'Cisim Doğruları', icon: 'puzzle', total: T, meb: 'MAT.2.3.2', gen: rot(tf(GEO1_TF, 'puzzle'), cisimAdi), ders: 'Yapılarda ve oyuncaklarda geometrik cisimler vardır: kule silindire, kubbe küreye benzer.', visual: { kind: 'solid', solid: 'kup' } },
    { kind: 'kac-sekil', title: 'Kaç Şekil Var?', icon: 'construction', total: T, meb: 'MAT.2.3.3', gen: kacSekil, ders: 'Modellerdeki şekilleri sayarız: kamyonda kareler, daireler, üçgenler.', visual: img('truck') },
    { kind: 'sivi-hafiza', title: 'Kaplar', icon: 'glass', total: 4, meb: 'MAT.2.3.5', gen: mem('Kabı büyüklüğüyle eşleştir!', 'Büyük ve küçük kaplar.', KAP_P), ders: 'Kaplar büyüklüklerine göre farklı miktarda sıvı alır.', visual: img('glass') },
  ],
  t2: [
    { kind: 'sayi-dogrusu', title: 'Sayı Doğrusu', icon: 'ruler', total: T, meb: 'MAT.2.1.3', gen: sayiDogrusu, ders: 'Sayı doğrusu 0’dan başlar, sayılar eşit aralıklarla yerleşir.', visual: { kind: 'sequence', items: [0, 10, 20, 30, 40] } },
    { kind: 'once-sonra', title: 'Önce ve Sonra', icon: 'numbers', total: T, meb: 'MAT.2.1.3', gen: rot(onceSonra, siraSayisi), ders: 'Bir sayıdan hemen önce bir eksiği, hemen sonra bir fazlası gelir.', visual: { kind: 'sequence', items: [46, 47, 48] } },
    { kind: 'ritmik-geri', title: 'İleri ve Geri Say', icon: 'music', total: T, meb: 'MAT.2.1.4', gen: ritmik, ders: 'Ritmik saymayı geriye doğru da yaparız: 40, 36, 32, 28…', visual: { kind: 'sequence', items: [40, 36, 32, '?'] } },
    { kind: 'sayi-bilmece', title: 'Sayı Bilmecesi', icon: 'detective', total: T, meb: 'MAT.2.1.2', gen: rot(bilmece, basamak), ders: 'Basamak değerlerini toplayarak sayıyı buluruz: 90 + 9 = 99.', visual: img('detective') },
  ],
  t3: [
    { kind: 'terimler', title: 'İşlemin Parçaları', icon: 'memo', total: T, meb: 'MAT.2.2.2', gen: ch(TERIM_Q), ders: 'Toplananlar ve toplam; eksilen, çıkan ve fark; çarpanlar ve çarpım; bölünen, bölen ve bölüm.', visual: img('memo') },
    { kind: 'uc-toplanan', title: 'Zihinden İşlem', icon: 'abacus', total: T, meb: 'MAT.2.2.2', gen: rot(ucToplanan, zihinden), ders: 'Onlukları zihinden kolayca toplar, çıkarırız. Üç sayıyı toplarken önce ikisini toplarız.', visual: img('abacus') },
    { kind: 'degisme', title: 'Yer Değiştirme', icon: 'sparkles', total: T, meb: 'MAT.2.2.2', gen: degisme, ders: '15 + 12 = 12 + 15 ve 3 × 4 = 4 × 3. Yer değişse de sonuç aynı.', visual: { kind: 'equation', text: '3 × 4 = 4 × 3' } },
    { kind: 'sagla', title: 'Sağlama', icon: 'thumbsup', total: T, meb: 'MAT.2.2.5', gen: rot(sagla, ardisikCikarma), ders: 'Çarpmanın sağlaması bölmeyle yapılır: 5 × 4 = 20 → 20 ÷ 4 = 5.', visual: { kind: 'equation', text: '20 ÷ 4 = 5' } },
    { kind: 'carpim-tablosu', title: 'Çarpım Tablosu', icon: 'star', total: T, meb: 'MAT.2.2.5', gen: rot(carpma, carpimBalon), ders: '5’e kadar çarpım tablosunu öğreniriz: 5 × 1 = 5, 5 × 2 = 10…', visual: img('star') },
  ],
  t4: [
    { kind: 'kurus', title: 'Lira ve Kuruş', icon: 'coin', total: T, meb: 'MAT.2.1.8', gen: rot(ch(KURUS_Q), mt('Eşit değerleri eşleştir.', '1 TL = 100 kr.', PARA_P)), ders: 'Değeri 1 TL’den küçük paralara kuruş denir: 25 kr, 50 kr. 1 TL = 100 kr.', visual: { kind: 'money', items: [0.25, 0.5, 1] } },
    { kind: 'gunun-bolumleri', title: 'Günün Bölümleri', icon: 'sunrise', total: 4, meb: 'MAT.2.1.9', gen: gununBolumleri, ders: 'Gün sabahla başlar: sabah, öğleden önce, öğle, öğleden sonra, akşam, gece.', visual: img('sunrise') },
    { kind: 'mevsimler', title: 'Mevsimler ve Aylar', icon: 'cherryblossom', total: T, meb: 'MAT.2.1.9', gen: rot(mt('Mevsimi aylarıyla eşleştir.', '1 mevsim 3 aydır.', MEVSIM_P), mem('Zaman kartlarını eşleştir!', 'Zaman birimleri.', ZAMAN_P)), ders: '1 yıl 4 mevsim, 1 mevsim 3 aydır.', visual: img('cherryblossom') },
    { kind: 'sure', title: 'Ne Kadar Sürer?', icon: 'hourglass', total: T, meb: 'MAT.2.1.9', gen: rot(ch(SURE_Q), takvim), ders: 'Bir ders 40 dakika, teneffüs 10 dakika, diş fırçalama 2 dakika sürer.', visual: img('hourglass') },
    { kind: 'kutle-karsilastir', title: 'Ağır mı, Hafif mi?', icon: 'balance', total: T, meb: 'MAT.2.1.10', gen: rot(kutleKarsilastir, uzunlukOlc), ders: 'Kütleleri ve uzunlukları karşılaştırır, farkı buluruz.', visual: img('balance') },
  ],
  t5: [
    { kind: 'kroki', title: 'Kroki Oku', icon: 'map', total: T, meb: 'MAT.2.3.6', gen: ch(KONUM_Q), ders: 'Kroki bir yerin basit çizimidir; yerlerin birbirine göre konumunu gösterir.', visual: img('map') },
    { kind: 'yon-tarifi', title: 'Yol Tarifi', icon: 'compass', total: T, meb: 'MAT.2.3.6', gen: rot(yolBulmaca, tf(YON_TF, 'compass')), ders: 'Yön sözcükleri: yukarı, aşağı, sağa, sola. Engelli karelerden geçilmez.', visual: img('compass') },
    { kind: 'simetri-cizgisi', title: 'Simetri Çizgisi', icon: 'heart', total: T, meb: 'MAT.2.3.7', gen: rot(ch(SIMETRI_CIZGI_Q), tf(SIMETRI_TF, 'butterfly')), ders: 'Simetri çizgisinin iki yanı birbirinin yansımasıdır.', visual: img('heart') },
  ],
  t6: [
    { kind: 'iki-grup', title: 'İki Sınıfı Karşılaştır', icon: 'friends', total: T, meb: 'MAT.2.4.1', gen: ikiGrup, ders: 'İki grubun verilerini karşılaştırır, toplar ve farkını buluruz.', visual: img('friends') },
    { kind: 'grafik-oku', title: 'Grafik Oku', icon: 'chart', total: T, meb: 'MAT.2.4.1', gen: rot(grafik, tf(ARASTIRMA_TF, 'chart')), ders: 'Şekil grafiğinde her şekil bir kişiyi gösterir; en çok ve en az olanları buluruz.', visual: img('chart') },
  ],
}
// Ek etkinlikleri kitap bölümüne (kazanım koduna) göre yerleştir; oyunlar en sonda kalır
const kodSira = (m: string) => m.split('.').map((x) => x.padStart(3, '0')).join('.')
for (const t of MAT2_ADALAR) {
  const acts = [...t.acts.filter((a) => !a.oyun), ...(EK2[t.id] ?? [])]
  const sirali = acts.map((a, i) => ({ a, i })).sort((x, y) => kodSira(x.a.meb).localeCompare(kodSira(y.a.meb)) || x.i - y.i)
  t.acts = [...sirali.map((x) => x.a), ...t.acts.filter((a) => a.oyun)]
}
