/**
 * 3. SINIF MATEMATİK YOLU — kitabın 6 teması, her tema bir ada (kaynak: docs/meb-kitaplar/analiz/matematik-3.md).
 * KİTAP SINIRLARI (aşılmaz): sayılar 0–1000 (alıştırmada ≤ 999), birler/onlar/yüzler, < > = kullanılır;
 * yuvarlama en yakın onluk/yüzlük; ritmik sayma 6'şar ≤ 60, 7'şer ≤ 70, 8'er ≤ 80, 9'ar ≤ 90, onar/yüzer ≤ 1000; tahmin ≤ 100 nesne;
 * kesir: 1/1, 1/2, 1/4, birim kesir ve basit kesir (payda ≤ 10), karşılaştırma yok; saat dakikasına kadar, okunuş "…geçiyor",
 * öğleden sonra 13–23; saniye/dakika/saat/gün/hafta/ay/yıl; Romen I–XXIV; uzunluk m↔cm (km yalnız tanıma), kütle kg↔g (ton yalnız tanıma);
 * para TL + kuruş (1 TL = 100 kr); toplama/çıkarma üç basamaklı, eldeli/onluk bozmalı, sonuç ≤ 999; tahmin en yakın onlukla;
 * çarpım tablosu 10 × 10, iki/üç basamaklı × bir basamaklı (çarpım ≤ 999), 10 ve 100 ile kısa yol; bölmede bölünen ≤ 99, bölen 2–9, kalanlı olabilir;
 * problemler en çok 3 adım; cisimlerde köşe/yüz/ayrıt, çokgenler 3/4/5/6/8 kenar, köşegen, çevre (cm), sıvı L ve yarım L (mL yok), alan ve açı yok;
 * simetri: kare 4, dikdörtgen 2, daire sonsuz; veri: çetele, sıklık tablosu, şekil grafiği (ölçek 1–3), nokta grafiği; sıklık ≤ 12.
 */
import { pick, randInt, shuffle, type Rng } from '../../learning/rng'
import { choice, input, numChoice, order, sayiOku, sort, type Gen } from './helpers'
import type { PopQ, Question, ShapeKind, SolidKind, Visual } from '../../games/quiz/types'
import { ch, img, karma, mem, mt, pop, rot, srt, tf, type Alan, type P, type Q, type TF } from './yolKit'
import { yolBulmaca } from './mat1'

const inp = (prompt: string, answer: number, explain: string, visual?: Visual, unit?: string): Question => input({ prompt, answer: String(answer), keys: 'digits', explain, visual, unit })
const uniq = (xs: number[], ans: number, lo = 0, hi = 999) => [...new Set(xs)].filter((x) => x >= lo && x <= hi && x !== ans)
const near3 = (n: number, lo = 0, hi = 999) => uniq([n + 1, n - 1, n + 10, n - 10, n + 100, n - 100], n, lo, hi)
const buyukHarf = (s: string) => s[0].toLocaleUpperCase('tr-TR') + s.slice(1)
const DAG: Record<number, string> = { 2: 'ikişer', 3: 'üçer', 4: 'dörder', 5: 'beşer', 6: 'altışar', 7: 'yedişer', 8: 'sekizer', 9: 'dokuzar', 10: 'onar', 100: 'yüzer' }
const pad = (n: number) => String(n).padStart(2, '0')

/* ================================================================ 1. TEMA · SAYILAR VE NİCELİKLER (1) */
const rakamDegis = (n: number) => { const s = String(n); return Number(s[0] + s[2] + s[1]) }
const sayiOku3: Gen = (rng) => {
  const n = randInt(rng, 101, 999)
  const w = uniq([rakamDegis(n), n + 10, n - 10, n + 100, n - 100, n + 1], n, 100, 999)
  return rng() < 0.5
    ? choice(rng, { prompt: `“${sayiOku(n)}” sayısı hangisi?`, correct: String(n), wrong: w.map(String), explain: `${sayiOku(n)} = ${n}`, max: 3 })
    : choice(rng, { prompt: `${n} nasıl okunur?`, correct: sayiOku(n), wrong: w.map((x) => sayiOku(x)), explain: `${n} “${sayiOku(n)}” diye okunur.`, max: 3 })
}
const okunusYaz: Gen = (rng) => {
  const n = randInt(rng, 100, 999)
  return inp(`“${sayiOku(n)}” sayısını rakamla yaz.`, n, `${sayiOku(n)} = ${n}`)
}
const okunusEsle: Gen = (rng) => {
  const nums = shuffle(rng, Array.from({ length: 899 }, (_, i) => i + 101)).slice(0, 4)
  return mt('Sayıyı okunuşuyla eşleştir.', 'Önce yüzleri, sonra onları, en son birleri okuruz.', nums.map((n): P => [String(n), sayiOku(n)]), 4)(rng, 3, 2, [])
}
const bloklar3: Gen = (rng) => {
  const h = randInt(rng, 1, 9), t = randInt(rng, 0, 9), o = randInt(rng, 0, 9)
  const n = h * 100 + t * 10 + o
  return rng() < 0.5
    ? inp('Taban blokları hangi sayıyı gösteriyor?', n, `${h} yüzlük + ${t} onluk + ${o} birlik = ${h * 100} + ${t * 10} + ${o} = ${n}`, { kind: 'blocks', hundreds: h, tens: t, ones: o })
    : numChoice(rng, { prompt: `${h} yüzlük, ${t} onluk ve ${o} birlik kaç eder?`, answer: n, explain: `${h * 100} + ${t * 10} + ${o} = ${n}`, near: uniq([o * 100 + t * 10 + h, h * 100 + o * 10 + t, n + 100, n - 10], n, 0, 999) })
}
const cozumle: Gen = (rng) => {
  const h = randInt(rng, 1, 9), t = randInt(rng, 1, 9), o = randInt(rng, 0, 9)
  const n = h * 100 + t * 10 + o
  const v = randInt(rng, 0, 2)
  if (v === 0) return inp(`${n} = ${h * 100} + □ + ${o}. Kutuya hangi sayı gelir?`, t * 10, `${n} sayısında onlar basamağının değeri ${t * 10}.`, { kind: 'equation', text: `${n} = ${h * 100} + □ + ${o}` })
  if (v === 1) return inp(`${n} = □ + ${t * 10} + ${o}. Kutuya hangi sayı gelir?`, h * 100, `${n} sayısında yüzler basamağının değeri ${h * 100}.`, { kind: 'equation', text: `${n} = □ + ${t * 10} + ${o}` })
  return choice(rng, { prompt: `${n} sayısının çözümlenmiş hâli hangisi?`, correct: `${h * 100} + ${t * 10} + ${o}`, wrong: [`${h} + ${t} + ${o}`, `${h * 10} + ${t * 100} + ${o}`, `${h * 100} + ${t} + ${o * 10}`], explain: `${n} = ${h} yüzlük ${t} onluk ${o} birlik = ${h * 100} + ${t * 10} + ${o}`, max: 3 })
}
const BAS_AD = ['birler', 'onlar', 'yüzler']
const basamak3: Gen = (rng) => {
  const ds = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
  const n = ds[0] * 100 + ds[1] * 10 + ds[2]
  const k = randInt(rng, 0, 2)
  const d = ds[2 - k]
  const deger = d * 10 ** k
  return rng() < 0.6
    ? numChoice(rng, { prompt: `${n} sayısında ${d} rakamının basamak değeri kaçtır?`, answer: deger, explain: `${d}, ${BAS_AD[k]} basamağında; basamak değeri ${deger}.`, near: uniq([d, d * 10, d * 100], deger) })
    : choice(rng, { prompt: `${n} sayısında ${d} rakamı hangi basamaktadır?`, correct: `${buyukHarf(BAS_AD[k])} basamağı`, wrong: BAS_AD.filter((_, i) => i !== k).map((x) => `${buyukHarf(x)} basamağı`), explain: `${n} = ${ds[0]} yüzlük ${ds[1]} onluk ${ds[2]} birlik.`, max: 3 })
}
const bilmece3: Gen = (rng) => {
  const h = randInt(rng, 1, 9), t = randInt(rng, 0, 9), o = randInt(rng, 0, 9)
  const v = randInt(rng, 0, 1)
  if (v === 0) return inp(`Yüzler basamağının değeri ${h * 100}, onlar basamağının değeri ${t * 10}, birler basamağında ${o} var. Sayı kaç?`, h * 100 + t * 10 + o, `${h * 100} + ${t * 10} + ${o} = ${h * 100 + t * 10 + o}`, img('detective'))
  return inp(`Yüzler basamağında ${h}, onlar basamağında en küçük rakam, birler basamağında ${o} var. Sayı kaç?`, h * 100 + o, `En küçük rakam 0'dır: ${h}0${o} = ${h * 100 + o}`, img('detective'))
}
const karsilastir: Gen = (rng) => {
  const a = randInt(rng, 100, 999)
  const b = rng() < 0.12 ? a : rng() < 0.5 ? rakamDegis(a) === a ? a + 10 > 999 ? a - 10 : a + 10 : rakamDegis(a) : randInt(rng, 100, 999)
  const s = a < b ? '<' : a > b ? '>' : '='
  const oku = s === '<' ? `${a} küçüktür ${b}` : s === '>' ? `${a} büyüktür ${b}` : `${a} eşittir ${b}`
  return choice(rng, { prompt: `${a} □ ${b}. Kutuya hangi işaret gelir?`, visual: { kind: 'equation', text: `${a} □ ${b}` }, correct: s, wrong: ['<', '>', '='], explain: `Önce yüzler basamağına, eşitse onlara, sonra birlere bakarız: ${oku}.`, max: 3, layout: 'tiles' })
}
const sirala3: Gen = (rng) => {
  const nums = shuffle(rng, Array.from({ length: 900 }, (_, i) => i + 100)).slice(0, 4)
  const buyuk = rng() < 0.5
  const s = [...nums].sort((a, b) => (buyuk ? b - a : a - b))
  return order({ prompt: `Sayıları ${buyuk ? 'büyükten küçüğe' : 'küçükten büyüğe'} sırala.`, pieces: s.map(String), joiner: ' ', explain: s.join(buyuk ? ' > ' : ' < '), style: 'chain' })
}
const yuvarlaOnluk: Gen = (rng) => {
  let n = randInt(rng, 101, 994)
  if (n % 10 === 0) n++
  const alt = Math.floor(n / 10) * 10, ust = alt + 10
  const c = n % 10 < 5 ? alt : ust
  return choice(rng, { prompt: `${n} sayısını en yakın onluğa yuvarla.`, visual: { kind: 'sequence', items: [alt, '…', n, '…', ust] }, correct: String(c), wrong: uniq([c === alt ? ust : alt, Math.round(n / 100) * 100], c, 0, 1000).map(String), explain: `Birler basamağı ${n % 10}; ${n % 10 < 5 ? '5’ten küçük, kendi onluğuna' : '5 ya da büyük, sonraki onluğa'} yuvarlanır: ${c}.`, max: 3 })
}
const yuvarlaYuzluk: Gen = (rng) => {
  let n = randInt(rng, 101, 989)
  if (n % 100 === 0) n += 7
  const alt = Math.floor(n / 100) * 100, ust = alt + 100
  const t = Math.floor(n / 10) % 10
  const c = t < 5 ? alt : ust
  return choice(rng, { prompt: `${n} sayısını en yakın yüzlüğe yuvarla.`, visual: { kind: 'sequence', items: [alt, '…', n, '…', ust] }, correct: String(c), wrong: uniq([c === alt ? ust : alt, Math.round(n / 10) * 10], c, 0, 1000).map(String), explain: `Onlar basamağı ${t}; ${t < 5 ? '5’ten küçük, kendi yüzlüğüne' : '5 ya da büyük, sonraki yüzlüğe'} yuvarlanır: ${c}.`, max: 3 })
}
const yuvarlaBalon: Gen = (rng) => {
  const c = randInt(rng, 12, 98) * 10
  const hits = Array.from({ length: 10 }, (_, i) => c - 5 + i).map(String)
  const wrongs = [c - 8, c - 7, c - 6, c + 5, c + 6, c + 7, c + 12].map(String)
  return pop(`En yakın onluğa yuvarlanınca ${c} olan sayıları patlat!`, `${c - 5} ile ${c + 4} arasındaki sayılar ${c}’a yuvarlanır.`, hits, wrongs)(rng, 3, 2, [])
}
const RITIM3 = [6, 7, 8, 9, 10, 100]
const ritmikDizi = (rng: Rng) => {
  const adim = pick(rng, RITIM3)
  let bas: number
  if (adim <= 9) bas = randInt(rng, 0, 5) * adim
  else if (adim === 10) bas = randInt(rng, 1, 90) * 10 + pick(rng, [0, 0, 5, 3])
  else bas = randInt(rng, 0, 5) * 100 + pick(rng, [0, 0, 20, 50])
  let dizi = Array.from({ length: 5 }, (_, i) => bas + i * adim)
  const geri = rng() < 0.35
  if (geri) dizi = dizi.reverse()
  return { adim, dizi, geri }
}
const ritmik3: Gen = (rng) => {
  const { adim, dizi, geri } = ritmikDizi(rng)
  const g = randInt(rng, 2, 4)
  const cevap = dizi[g]
  const vis: Visual = { kind: 'sequence', items: dizi.map((x, i) => (i === g ? '?' : x)) }
  const p = `${geri ? 'Geriye doğru ' : ''}${DAG[adim]} sayıyoruz. Boş yere hangi sayı gelir?`
  return rng() < 0.5 ? inp(p, cevap, dizi.join(', '), vis) : numChoice(rng, { prompt: p, answer: cevap, visual: vis, explain: dizi.join(', '), near: uniq([cevap + 1, cevap - 1, cevap + adim + 1, cevap - adim + 1], cevap, 0, 1000) })
}
const ritmikBalon3: Gen = (rng) => {
  const adim = pick(rng, [6, 7, 8, 9])
  const hits = Array.from({ length: 10 }, (_, i) => (i + 1) * adim).map(String)
  const wrongs = shuffle(rng, Array.from({ length: adim * 10 }, (_, i) => i + 1).filter((x) => x % adim !== 0 && x > adim)).slice(0, 5).map(String)
  return pop(`${DAG[adim][0].toLocaleUpperCase('tr-TR') + DAG[adim].slice(1)} sayarken söylediğimiz sayıları patlat!`, `${hits.join(', ')}`, hits, wrongs)(rng, 3, 2, [])
}
const tekMi = (n: number) => n % 2 === 1
const tekCiftSort: Gen = (rng, _g, l) => {
  const nums = shuffle(rng, Array.from({ length: 980 }, (_, i) => i + 11)).slice(0, 12)
  return sort(rng, { prompt: 'Sayıları tek ve çift olarak sepetlere ayır.', explain: 'Birler basamağı 1, 3, 5, 7, 9 olanlar tek; 0, 2, 4, 6, 8 olanlar çifttir.', bins: [{ id: 'tek', label: 'Tek', img: 'star', color: '#f59e0b' }, { id: 'cift', label: 'Çift', img: 'heart', color: '#3b82f6' }], items: nums.map((n) => ({ label: String(n), bin: tekMi(n) ? 'tek' : 'cift' })), count: l === 1 ? 4 : 6 })
}
const tekCiftBalon: Gen = (rng) => {
  const tek = rng() < 0.5
  const nums = shuffle(rng, Array.from({ length: 980 }, (_, i) => i + 11))
  const hits = nums.filter((n) => tekMi(n) === tek).slice(0, 8).map(String)
  const wrongs = nums.filter((n) => tekMi(n) !== tek).slice(0, 6).map(String)
  return pop(`${tek ? 'Tek' : 'Çift'} sayıları patlat!`, tek ? 'Birler basamağı 1, 3, 5, 7, 9 olan sayılar tektir.' : 'Birler basamağı 0, 2, 4, 6, 8 olan sayılar çifttir.', hits, wrongs)(rng, 3, 2, [])
}
const tekCiftToplam: Gen = (rng) => {
  const a = randInt(rng, 11, 79), b = randInt(rng, 3, 20)
  const s = a + b
  const ad = (n: number) => (tekMi(n) ? 'tek' : 'çift')
  return choice(rng, { prompt: `${a} + ${b} toplamı tek mi, çift mi? (İşlem yapmadan düşün.)`, correct: buyukHarf(ad(s)), wrong: [buyukHarf(ad(s + 1))], explain: `${a} ${ad(a)}, ${b} ${ad(b)}. ${ad(a) === ad(b) ? 'Aynı türden iki sayının toplamı çifttir.' : 'Tek ile çiftin toplamı tektir.'} ${a} + ${b} = ${s}`, max: 2, layout: 'tiles' })
}
const TEKCIFT_TF: TF[] = [
  ['Tek sayı ile tek sayının toplamı çifttir.', true, 'Örneğin 15 + 7 = 22.'],
  ['Çift sayı ile çift sayının toplamı tektir.', false, 'Çift + çift = çift: 12 + 8 = 20.'],
  ['Tek sayı ile çift sayının toplamı tektir.', true, 'Örneğin 13 + 6 = 19.'],
  ['En küçük tek sayı 1’dir.', true, '1 ikiye eşit paylaşılamaz; en küçük tek sayıdır.'],
  ['En büyük iki basamaklı çift sayı 99’dur.', false, '99 tektir; en büyük iki basamaklı çift sayı 98’dir.'],
  ['En küçük iki basamaklı çift sayı 10’dur.', true, '10’un birler basamağı 0; çifttir.'],
  ['Çift sayılar ikiye eşit paylaştırılabilir.', true, 'Çift sayıda nesne iki kişiye artmadan paylaşılır.'],
  ['345 çift bir sayıdır.', false, 'Birler basamağı 5; 345 tektir.'],
  ['780 çift bir sayıdır.', true, 'Birler basamağı 0; çifttir.'],
]
const oruntu3: Gen = (rng) => {
  const fark = pick(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 100])
  const azalan = rng() < 0.4
  const bas = fark === 100 ? randInt(rng, 1, 5) * 100 + randInt(rng, 1, 99) : azalan ? randInt(rng, fark * 5, 99) : randInt(rng, 1, 60)
  const dizi = Array.from({ length: 5 }, (_, i) => (azalan ? bas - i * fark : bas + i * fark))
  if (dizi.some((x) => x < 0 || x > 999)) return oruntu3(rng, 3, 2, [])
  const kural = (f: number, az: boolean) => `Her adımda ${f} ${az ? 'azalır' : 'artar'}`
  if (rng() < 0.5)
    return numChoice(rng, { prompt: `Örüntüde sıradaki sayı kaç? ${dizi.slice(0, 4).join(', ')}, ?`, answer: dizi[4], visual: { kind: 'sequence', items: [...dizi.slice(0, 4), '?'] }, explain: `Başlangıç ${bas}; ${kural(fark, azalan).toLocaleLowerCase('tr-TR')}: ${dizi.join(', ')}`, near: uniq([dizi[4] + 1, dizi[4] - 1, dizi[4] + (azalan ? -fark : fark)], dizi[4]) })
  return choice(rng, { prompt: `${dizi.slice(0, 4).join(', ')}… Bu örüntünün kuralı hangisi?`, correct: kural(fark, azalan), wrong: [kural(fark, !azalan), kural(fark + 1, azalan), kural(fark === 2 ? 3 : fark - 1, azalan)], explain: `${dizi[0]} → ${dizi[1]}: ${fark} ${azalan ? 'azalmış' : 'artmış'}.`, max: 3 })
}
const sekilOruntu: Gen = (rng) => {
  const a = randInt(rng, 1, 5), d = randInt(rng, 2, 5)
  const s = (k: number) => a + (k - 1) * d
  const o = pick(rng, ['star', 'heart', 'apple', 'flower'])
  const ad = { star: 'yıldız', heart: 'kalp', apple: 'elma', flower: 'çiçek' }[o]
  return inp(`1. adımda ${s(1)}, 2. adımda ${s(2)}, 3. adımda ${s(3)} ${ad} var. 4. adımda kaç ${ad} olur?`, s(4), `Her adımda ${d} ${ad} eklenir: ${s(3)} + ${d} = ${s(4)}`, { kind: 'objects', img: o, count: s(3) })
}
const tahmin3: Gen = (rng) => {
  const n = randInt(rng, 24, 86)
  const o = pick(rng, ['fish', 'leaf', 'lemon', 'bird', 'pencil'])
  const y = Math.round(n / 10) * 10
  return choice(rng, { prompt: 'Saymadan tahmin et: yaklaşık kaç tane var?', visual: { kind: 'objects', img: o, count: n }, correct: `Yaklaşık ${y}`, wrong: uniq([y + 20, y - 20, y + 40, y - 40], y, 10, 100).map((x) => `Yaklaşık ${x}`), explain: `Tam olarak ${n} tane var; ${y}’a yakın. Önce bir grubu sayıp gerisini ona göre tahmin edebiliriz.`, max: 3 })
}
const TAHMIN3_Q: Q[] = [
  { q: 'Tahminim 60, saydığımda 54 çıktı. Tahminim nasıldı?', a: 'Fazla', w: ['Eksik', 'Eşit'], ex: '60, 54’ten fazladır.', img: 'thinking' },
  { q: 'Tahminim 35, saydığımda 41 çıktı. Tahminim nasıldı?', a: 'Eksik', w: ['Fazla', 'Eşit'], ex: '35, 41’den azdır.', img: 'thinking' },
  { q: 'Bir kavanozda 20 şeker var. Aynı büyüklükte 3 kavanozda yaklaşık kaç şeker olur?', a: 'Yaklaşık 60', w: ['Yaklaşık 20', 'Yaklaşık 90'], ex: '20 + 20 + 20 = 60', img: 'jar' },
  { q: 'Akvaryumun yarısında 25 balık var. Bütün akvaryumda yaklaşık kaç balık vardır?', a: 'Yaklaşık 50', w: ['Yaklaşık 25', 'Yaklaşık 100'], ex: 'Yarısı 25 ise bütünü yaklaşık 50.', img: 'fish' },
  { q: 'Sepetin dörtte birinde 10 limon var. Sepette yaklaşık kaç limon vardır?', a: 'Yaklaşık 40', w: ['Yaklaşık 10', 'Yaklaşık 20'], ex: '4 tane 10 = 40.', img: 'lemon' },
]

/* ================================================================ 2. TEMA · SAYILAR VE NİCELİKLER (2) */
const KESIR_AD: Record<number, string> = { 1: 'Bütün', 2: 'Yarım', 4: 'Çeyrek' }
const PAYDA_OKU = ['', 'Birde', 'İkide', 'Üçte', 'Dörtte', 'Beşte', 'Altıda', 'Yedide', 'Sekizde', 'Dokuzda', 'Onda']
const SAY_OKU = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on']
const kesirOku = (n: number, d: number) => `${PAYDA_OKU[d]} ${SAY_OKU[n]}`
const kesirGoster: Gen = (rng) => {
  const d = pick(rng, [1, 2, 4])
  const v = randInt(rng, 0, 2)
  const vis: Visual = { kind: 'fraction', n: 1, d, shape: rng() < 0.5 ? 'pie' : 'bar' }
  if (v === 0) return choice(rng, { prompt: 'Boyalı kısmı gösteren kesir hangisi?', visual: vis, correct: `1/${d}`, wrong: ['1/1', '1/2', '1/4', `${d}/1`].filter((x) => x !== `1/${d}`), explain: `${d} eş parçanın 1’i boyalı: 1/${d} (${kesirOku(1, d).toLocaleLowerCase('tr-TR')}).`, max: 3 })
  if (v === 1) return choice(rng, { prompt: `1/${d} kesri neyi gösterir?`, visual: vis, correct: KESIR_AD[d], wrong: ['Bütün', 'Yarım', 'Çeyrek'].filter((x) => x !== KESIR_AD[d]), explain: '1/1 bütün, 1/2 yarım, 1/4 çeyrektir.', max: 3 })
  return choice(rng, { prompt: `“${KESIR_AD[d]}” kesirle nasıl gösterilir?`, correct: `1/${d}`, wrong: ['1/1', '1/2', '1/4'].filter((x) => x !== `1/${d}`), explain: `${KESIR_AD[d]} = 1/${d}. Kesir çizgisinin altına toplam parça, üstüne boyalı parça sayısı yazılır.`, max: 3 })
}
const KESIR_P: P[] = [
  ['1/2', 'İkide bir'], ['1/4', 'Dörtte bir'], ['1/1', 'Birde bir'], ['3/4', 'Dörtte üç'], ['2/3', 'Üçte iki'], ['1/3', 'Üçte bir'],
  ['5/8', 'Sekizde beş'], ['1/10', 'Onda bir'], ['2/5', 'Beşte iki'], ['4/6', 'Altıda dört'], ['9/10', 'Onda dokuz'], ['3/7', 'Yedide üç'],
]
const birimKesir: Gen = (rng) => {
  const d = randInt(rng, 2, 10)
  const vis: Visual = { kind: 'fraction', n: 1, d, shape: d <= 8 && rng() < 0.5 ? 'pie' : 'bar' }
  if (rng() < 0.5) return choice(rng, { prompt: 'Bütün eş parçalara bölünmüş. Boyalı parça hangi birim kesirdir?', visual: vis, correct: `1/${d}`, wrong: uniq([d - 1, d + 1, d + 2], d, 2, 12).map((x) => `1/${x}`).concat(`${d}/1`), explain: `Bütün ${d} eş parçaya bölünmüş; her parça 1/${d}.`, max: 3 })
  return inp(`Bir bütün 1/${d} birim kesirlerinden kaç tanesiyle oluşur?`, d, `${d} tane 1/${d} bir bütün eder.`, vis)
}
const payPayda: Gen = (rng) => {
  const d = randInt(rng, 3, 10), n = randInt(rng, 2, d - 1)
  const vis: Visual = { kind: 'fraction', n, d, shape: d <= 8 && rng() < 0.5 ? 'pie' : 'bar' }
  const v = randInt(rng, 0, 2)
  if (v === 0) return inp('Boyalı kısmı gösteren kesrin PAYI kaçtır?', n, `Pay boyalı parça sayısıdır: ${n}. Kesir ${n}/${d}.`, vis)
  if (v === 1) return inp('Boyalı kısmı gösteren kesrin PAYDASI kaçtır?', d, `Payda bütünün parça sayısıdır: ${d}. Kesir ${n}/${d}.`, vis)
  return choice(rng, { prompt: 'Boyalı kısmı gösteren kesir hangisi?', visual: vis, correct: `${n}/${d}`, wrong: [`${d}/${n}`, `${d - n}/${d}`, `${n}/${d + 1}`, `1/${d}`].filter((x) => x !== `${n}/${d}`), explain: `${d} eş parçanın ${n} tanesi boyalı: ${n}/${d} (${kesirOku(n, d).toLocaleLowerCase('tr-TR')}).`, max: 3 })
}
const birimKesriNe: Gen = (rng) => {
  const d = randInt(rng, 3, 10), n = randInt(rng, 2, d - 1)
  return choice(rng, { prompt: `${n}/${d} kesrinin birim kesri hangisi?`, correct: `1/${d}`, wrong: [`1/${n}`, `${d}/${n}`, `1/${d + 1}`].filter((x) => x !== `1/${d}`), explain: `${n}/${d}, ${n} tane 1/${d} demektir. Birim kesri 1/${d}.`, max: 3 })
}
const SAAT_ACC = ['', 'biri', 'ikiyi', 'üçü', 'dördü', 'beşi', 'altıyı', 'yediyi', 'sekizi', 'dokuzu', 'onu', 'on biri', 'on ikiyi']
const saatOku = (h: number, m: number) => buyukHarf(`${SAAT_ACC[h]} ${sayiOku(m)} geçiyor`)
const saat3: Gen = (rng) => {
  const h = randInt(rng, 1, 12), m = randInt(rng, 1, 59)
  const wh = (h % 12) + 1
  const v = randInt(rng, 0, 2)
  const wm = uniq([m + 5, m - 5, m + 10, (m * 7) % 60], m, 1, 59)
  if (v === 0) return choice(rng, { prompt: 'Saat kaç? Dijital gösterimi seç.', visual: { kind: 'clock', h, m }, correct: `${pad(h)}.${pad(m)}`, wrong: [`${pad(wh)}.${pad(m)}`, ...wm.map((x) => `${pad(h)}.${pad(x)}`)], explain: `Akrep ${h} ile ${wh} arasında, yelkovan ${m}. dakikada: ${pad(h)}.${pad(m)}`, max: 3 })
  if (v === 1) return choice(rng, { prompt: 'Dijital saat hangi zamanı gösteriyor?', visual: { kind: 'digital', h, m }, correct: saatOku(h, m), wrong: [saatOku(wh, m), ...wm.map((x) => saatOku(h, x))], explain: `${pad(h)}.${pad(m)}: ${saatOku(h, m).toLocaleLowerCase('tr-TR')}.`, max: 3 })
  return choice(rng, { prompt: `“${saatOku(h, m)}” hangi saattir?`, correct: { visual: { kind: 'clock', h, m } }, wrong: [{ visual: { kind: 'clock', h: wh, m } }, { visual: { kind: 'clock', h, m: wm[0] } }], explain: `${saatOku(h, m)}: ${pad(h)}.${pad(m)}`, max: 3 })
}
const ogledenSonra: Gen = (rng) => {
  const h = randInt(rng, 1, 11), m = randInt(rng, 0, 59)
  if (rng() < 0.5) return inp(`Öğleden sonra saat ${pad(h)}.${pad(m)}. 24 saatlik dijital saatte saat bölümüne kaç yazılır?`, h + 12, `Öğleden sonra akrebin gösterdiği saate 12 eklenir: ${h} + 12 = ${h + 12}. Saat ${h + 12}.${pad(m)}`, { kind: 'clock', h, m })
  return choice(rng, { prompt: `Dijital saat ${h + 12}.${pad(m)} gösteriyor. Analog saatte akrep hangi sayıya göre okunur?`, visual: { kind: 'digital', h: h + 12, m }, correct: String(h), wrong: uniq([h + 1, h + 2, h - 1, 12], h, 1, 12).map(String), explain: `${h + 12} − 12 = ${h}. Öğleden sonra saat ${h}.`, max: 3 })
}
const zamanDonus: Gen = (rng) => {
  const v = randInt(rng, 0, 6)
  if (v === 0) { const s = randInt(rng, 61, 99); return inp(`${s} saniye = 1 dakika □ saniye. Kutuya ne gelir?`, s - 60, `1 dakika 60 saniye: ${s} − 60 = ${s - 60}`, img('stopwatch'), 'saniye') }
  if (v === 1) { const s = randInt(rng, 1, 59); return inp(`1 dakika ${s} saniye kaç saniyedir?`, 60 + s, `60 + ${s} = ${60 + s} saniye`, img('stopwatch'), 'saniye') }
  if (v === 2) { const d = randInt(rng, 61, 99); return inp(`${d} dakika = 1 saat □ dakika. Kutuya ne gelir?`, d - 60, `1 saat 60 dakika: ${d} − 60 = ${d - 60}`, img('clock'), 'dakika') }
  if (v === 3) { const k = randInt(rng, 2, 5); return inp(`${k} dakika kaç saniyedir?`, k * 60, `${k} × 60 = ${k * 60} saniye`, img('stopwatch'), 'saniye') }
  if (v === 4) { const k = randInt(rng, 2, 5); return inp(`${k} hafta kaç gündür?`, k * 7, `1 hafta 7 gün: ${k} × 7 = ${k * 7}`, img('calendar'), 'gün') }
  if (v === 5) { const k = randInt(rng, 2, 4); return inp(`${k} gün kaç saattir?`, k * 24, `1 gün 24 saat: ${k} × 24 = ${k * 24}`, img('sun'), 'saat') }
  const k = randInt(rng, 2, 5); return inp(`${k} yıl kaç aydır?`, k * 12, `1 yıl 12 ay: ${k} × 12 = ${k * 12}`, img('calendar'), 'ay')
}
const ZAMAN3_P: P[] = [
  ['1 dakika', '60 saniye', 'stopwatch'], ['1 saat', '60 dakika', 'clock'], ['1 gün', '24 saat', 'sun'], ['1 hafta', '7 gün', 'calendar'],
  ['1 ay', 'Yaklaşık 30 gün'], ['1 yıl', '12 ay'], ['Yarım saat', '30 dakika'], ['Çeyrek saat', '15 dakika'], ['Yarım dakika', '30 saniye'],
]
const ZAMAN3_TF: TF[] = [
  ['1 yıl 7 aya eşittir.', false, '1 yıl 12 aydır.'],
  ['1 ay yaklaşık 4 haftadır.', true, '1 ay yaklaşık 4 hafta ya da 30 gündür.'],
  ['60 saniye 1 saate eşittir.', false, '60 saniye 1 dakikadır.'],
  ['1 yıl yaklaşık 365 gündür.', true, '1 yıl 52 hafta, yaklaşık 365 gündür.'],
  ['Şubat ayı çoğu yıl 28 gündür.', true, 'Şubat 28 gün çeker (bazı yıllarda 29).'],
  ['Nisan 31 gündür.', false, 'Nisan, haziran, eylül ve kasım 30 gündür.'],
  ['Saniye kısaca “s” ile gösterilir.', true, 'Örneğin 45 s.'],
  ['Hafta sonu cumartesi ve pazar günleridir.', true, 'Hafta içi 5, hafta sonu 2 gündür.'],
]
const ROMEN: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
const romen = (n: number) => { let s = ''; for (const [v, r] of ROMEN) while (n >= v) { s += r; n -= v } return s }
const romen3: Gen = (rng) => {
  const n = randInt(rng, 1, 24)
  const w = uniq([n + 1, n - 1, n + 5, n - 5, n + 10, n - 10], n, 1, 24)
  const v = randInt(rng, 0, 2)
  if (v === 0) return choice(rng, { prompt: `${romen(n)} Romen rakamı hangi sayıyı gösterir?`, correct: String(n), wrong: w.map(String), explain: `${romen(n)} = ${n}. I = 1, V = 5, X = 10; küçük rakam büyüğün solundaysa çıkarılır.`, max: 3, layout: 'tiles' })
  if (v === 1) return choice(rng, { prompt: `${n} sayısı Romen rakamıyla nasıl yazılır?`, correct: romen(n), wrong: w.map(romen), explain: `${n} = ${romen(n)}`, max: 3, layout: 'tiles' })
  const ctx = pick(rng, ['Kitabın □. cildi', 'Okulumuzun □. bilgi yarışması', 'Saat kadranındaki □ rakamı'])
  return inp(`${ctx.replace('□', romen(n))} yazıyor. ${romen(n)} kaçtır?`, n, `${romen(n)} = ${n}`, img('scroll'))
}
const romenEsle: Gen = (rng) => {
  const nums = shuffle(rng, Array.from({ length: 24 }, (_, i) => i + 1)).slice(0, 4)
  return mt('Romen rakamını sayıyla eşleştir.', 'I = 1, V = 5, X = 10.', nums.map((n): P => [romen(n), String(n)]), 4)(rng, 3, 2, [])
}
const SURE3_Q: Q[] = [
  { q: 'Hangisi daha uzun sürer?', a: 'Bir ders', w: ['Bir teneffüs', 'El yıkamak'], ex: 'Ders 40 dakika, teneffüs 10 dakika sürer.', img: 'school' },
  { q: 'Hangisi bir dakikadan kısa sürer?', a: 'Göz kırpmak', w: ['Kahvaltı etmek', 'Okula yürümek'], ex: 'Göz kırpmak bir saniye bile sürmez.', img: 'eye' },
  { q: '100 metre koşusu yaklaşık ne kadar sürer?', a: '20 saniye', w: ['20 saat', '20 gün'], ex: 'Kısa koşular saniyeyle ölçülür.', img: 'running' },
  { q: 'Gece uykusu yaklaşık ne kadar sürer?', a: '9 saat', w: ['9 dakika', '9 saniye'], ex: 'Çocuklar gece yaklaşık 9–10 saat uyur.', img: 'bed' },
  { q: 'Yaz tatili yaklaşık ne kadar sürer?', a: '3 ay', w: ['3 gün', '3 saat'], ex: 'Yaz tatili haziran, temmuz, ağustos.', img: 'sun' },
  { q: 'Bir fidanın ağaç olması ne kadar sürer?', a: 'Birkaç yıl', w: ['Birkaç saniye', 'Birkaç dakika'], ex: 'Ağaçlar yıllar içinde büyür.', img: 'tree' },
  { q: 'Süreyi saniyesine kadar ölçmek için hangisini kullanırız?', a: 'Kronometre', w: ['Takvim', 'Terazi'], ex: 'Kronometre saniyeleri gösterir.', img: 'stopwatch' },
]
const SURE_SORT: Parameters<typeof srt>[3] = [
  { label: 'Ayakkabı bağlamak', img: 'shoe', bin: 'kisa' }, { label: 'Zıplamak', img: 'running', bin: 'kisa' }, { label: 'Hapşırmak', img: 'sneeze', bin: 'kisa' }, { label: 'El çırpmak', img: 'clap', bin: 'kisa' },
  { label: 'Ders', img: 'school', bin: 'uzun' }, { label: 'Film izlemek', img: 'television', bin: 'uzun' }, { label: 'Gece uykusu', img: 'bed', bin: 'uzun' }, { label: 'Kek pişirmek', img: 'cake', bin: 'uzun' },
]
const uzunluk3: Gen = (rng) => {
  const m = randInt(rng, 1, 9), c = randInt(rng, 1, 9) * 10 + (rng() < 0.3 ? 5 : 0)
  const v = randInt(rng, 0, 3)
  if (v === 0) return inp(`${m} m ${c} cm kaç santimetredir?`, m * 100 + c, `1 m = 100 cm. ${m * 100} + ${c} = ${m * 100 + c} cm`, img('ruler'), 'cm')
  if (v === 1) return inp(`${m * 100 + c} cm = □ m ${c} cm. Kutuya ne gelir?`, m, `${m * 100} cm = ${m} m. ${m * 100 + c} cm = ${m} m ${c} cm`, img('ruler'), 'm')
  if (v === 2) return inp(`${m} m kaç santimetredir?`, m * 100, `${m} × 100 = ${m * 100} cm`, img('ruler'), 'cm')
  return choice(rng, { prompt: '1 m uzunluğu hangisi oluşturur?', correct: pick(rng, ['2 tane 50 cm', '10 tane 10 cm']), wrong: ['3 tane 30 cm', '5 tane 10 cm', '2 tane 30 cm'], explain: '1 m = 100 cm = 50 + 50 = 10 × 10 cm.', max: 3 })
}
const BIRIM3_SORT: Parameters<typeof srt>[3] = [
  { label: 'Kalem', img: 'pencil', bin: 'cm' }, { label: 'Silgi', img: 'crayon', bin: 'cm' }, { label: 'Defter', img: 'notebook', bin: 'cm' },
  { label: 'Sınıf kapısı', img: 'school', bin: 'm' }, { label: 'Ağaç boyu', img: 'tree', bin: 'm' }, { label: 'Otobüs', img: 'bus', bin: 'm' },
  { label: 'İki şehir arası yol', img: 'map', bin: 'km' }, { label: 'Uzun bir nehir', img: 'wave', bin: 'km' }, { label: 'Tren yolculuğu', img: 'train', bin: 'km' },
]
const kutle3: Gen = (rng) => {
  const v = randInt(rng, 0, 3)
  if (v === 0) { const t = randInt(rng, 1, 9) * 100; const say = Math.floor(t / 500) + (t % 500) / 100; return inp(`Terazide 500 g ve 100 g’lık ağırlıklar var. ${t} g için en az kaç ağırlık kullanırız?`, say, t >= 500 ? `${t} = 500 + ${(t - 500) / 100} × 100 → ${say} ağırlık` : `${t} = ${t / 100} × 100 → ${say} ağırlık`, { kind: 'balance', left: { text: `${t} g` }, right: { text: '?' }, tilt: 0 }) }
  if (v === 1) return inp('1 kilogram kaç gramdır?', 1000, '1 kg = 1000 g', img('scale'), 'g')
  if (v === 2) return inp('Yarım kilogram kaç gramdır?', 500, '1 kg = 1000 g; yarısı 500 g.', img('scale'), 'g')
  return pick(rng, [() => inp('1 kg kaç tane 100 g eder?', 10, '10 × 100 = 1000 g = 1 kg', img('scale')), () => inp('1 kg kaç tane yarım kg eder?', 2, '500 g + 500 g = 1 kg', img('scale'))])()
}
const KUTLE3_SORT: Parameters<typeof srt>[3] = [
  { label: 'Çilek', img: 'strawberry', bin: 'g' }, { label: 'Silgi', img: 'crayon', bin: 'g' }, { label: 'Bir dilim ekmek', img: 'bread', bin: 'g' },
  { label: 'Karpuz', img: 'watermelon', bin: 'kg' }, { label: 'Çocuk', img: 'boy', bin: 'kg' }, { label: 'Bir çuval patates', img: 'package', bin: 'kg' },
  { label: 'Tır', img: 'truck', bin: 't' }, { label: 'Gemi', img: 'ship', bin: 't' }, { label: 'Fil', img: 'elephant', bin: 't' },
]
const OLCU3_TF: TF[] = [
  ['1 m 100 santimetreye eşittir.', true, '1 m = 100 cm.'],
  ['1000 gram üç tane 500 gramdır.', false, '1000 g = 2 × 500 g.'],
  ['Şehirler arası uzaklığı kilometreyle ölçeriz.', true, 'Uzun yollar km ile ölçülür.'],
  ['Ton, çok ağır yükler için kullanılır.', true, 'Tır, gemi gibi yükler ton (t) ile ölçülür.'],
  ['Kilometre kısaca “km” ile gösterilir.', true, 'Örneğin 14 km.'],
  ['Cetvelle ölçerken iki ölçü arasında boşluk bırakılabilir.', false, 'Boşluk ya da üst üste binme olmadan ölçeriz.'],
]
const para3: Gen = (rng) => {
  const v = randInt(rng, 0, 3)
  if (v === 0) { const tl = randInt(rng, 1, 9), kr = pick(rng, [25, 50, 75]); return inp(`${tl} lira ${kr} kuruş kaç kuruştur?`, tl * 100 + kr, `1 TL = 100 kuruş. ${tl * 100} + ${kr} = ${tl * 100 + kr} kuruş`, img('coin'), 'kuruş') }
  if (v === 1) { const tl = randInt(rng, 1, 9), kr = pick(rng, [25, 50, 75]); return inp(`${tl * 100 + kr} kuruş = □ lira ${kr} kuruş. Kutuya ne gelir?`, tl, `${tl * 100} kuruş = ${tl} lira.`, img('coin'), 'lira') }
  if (v === 2) {
    let items: number[]
    do items = shuffle(rng, [200, 100, 50, 50, 20, 20, 10, 10, 5, 1]).slice(0, randInt(rng, 3, 5))
    while (items.reduce((s, x) => s + x, 0) > 500)
    const t = items.reduce((s, x) => s + x, 0)
    return inp('Toplam kaç TL var?', t, `${items.sort((a, b) => b - a).join(' + ')} = ${t} TL`, { kind: 'money', items }, 'TL')
  }
  const coins = shuffle(rng, [0.25, 0.25, 0.5, 0.5, 1, 0.25]).slice(0, randInt(rng, 3, 4))
  const kr = Math.round(coins.reduce((s, x) => s + x, 0) * 100)
  return inp('Madenî paraların toplamı kaç kuruş?', kr, `${coins.map((c) => `${Math.round(c * 100)}`).join(' + ')} = ${kr} kuruş`, { kind: 'money', items: coins }, 'kuruş')
}
const NOTLAR = [200, 100, 50, 20, 10, 5, 1]
const parcala = (n: number) => { const out: number[] = []; for (const p of NOTLAR) while (n >= p) { out.push(p); n -= p } return out }
const enAzPara: Gen = (rng) => {
  const t = pick(rng, [60, 75, 130, 170, 180, 260, 315, 375, 420, 465, 85, 240])
  const d = parcala(t)
  if (rng() < 0.5) return inp(`${t} TL’yi en az sayıda kâğıt ve madenî parayla ödemek için kaç para gerekir?`, d.length, `${d.join(' + ')} = ${t} TL → ${d.length} para`, img('banknote'))
  const alt1 = parcala(t - 10).concat(5, 5)
  const alt2 = parcala(t + 10)
  return choice(rng, { prompt: `Hangisi tam ${t} TL eder?`, correct: { visual: { kind: 'money', items: d } }, wrong: [{ visual: { kind: 'money', items: alt2 } }, { visual: { kind: 'money', items: parcala(t - 5) } }, { visual: { kind: 'money', items: alt1.slice(1) } }], explain: `${d.join(' + ')} = ${t} TL`, max: 3 })
}
const PARA3_P: P[] = [
  ['4 tane 25 kuruş', '1 TL'], ['2 tane 50 kuruş', '100 kuruş'], ['5 tane 1 TL', '5 TL'], ['2 tane 100 TL', '200 TL'], ['5 tane 10 TL', '50 TL'], ['3 tane 25 kuruş', '75 kuruş'], ['10 tane 10 TL', '100 TL'],
]

/* ================================================================ 3. TEMA · İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */
const onluk = (n: number) => Math.floor((n + 5) / 10) * 10
const tahminTop: Gen = (rng) => {
  const top = rng() < 0.55
  const a = randInt(rng, 150, 690), b = top ? randInt(rng, 110, 999 - a - 10) : randInt(rng, 101, a - 20)
  const t = top ? onluk(a) + onluk(b) : onluk(a) - onluk(b)
  const g = top ? a + b : a - b
  const op = top ? '+' : '−'
  if (rng() < 0.5) return choice(rng, { prompt: `${a} ${op} ${b} işleminin sonucunu sayıları en yakın onluğa yuvarlayarak tahmin et.`, correct: String(t), wrong: uniq([t + 10, t - 10, t + 100, t - 100], t).map(String), explain: `${a} ≈ ${onluk(a)}, ${b} ≈ ${onluk(b)}; ${onluk(a)} ${op} ${onluk(b)} = ${t}. Gerçek sonuç ${g}.`, max: 3 })
  return inp(`${a} ${op} ${b} için tahminin ${t}, gerçek sonuç ${g}. Aradaki fark kaç?`, Math.abs(t - g), `${Math.max(t, g)} − ${Math.min(t, g)} = ${Math.abs(t - g)}`)
}
const zihinden3: Gen = (rng) => {
  const v = randInt(rng, 0, 3)
  const a = randInt(rng, 110, 680)
  if (v === 0) { const b = randInt(rng, 1, 3) * 100; return numChoice(rng, { prompt: `Zihinden hesapla: ${a} + ${b}`, answer: a + b, explain: `Yalnız yüzler değişir: ${a} + ${b} = ${a + b}`, near: near3(a + b) }) }
  if (v === 1) { const b = randInt(rng, 2, 9) * 10; return numChoice(rng, { prompt: `Zihinden hesapla: ${a} − ${b}`, answer: a - b, explain: `Geriye onar sayarız: ${a} − ${b} = ${a - b}`, near: near3(a - b) }) }
  if (v === 2) { const b = pick(rng, [99, 199, 98]); return numChoice(rng, { prompt: `Zihinden hesapla: ${a} + ${b}`, answer: a + b, explain: `${b} ≈ ${b + (100 - (b % 100))}: ${a} + ${b + (100 - (b % 100))} − ${100 - (b % 100)} = ${a + b}`, near: near3(a + b) }) }
  const b = randInt(rng, 11, 89); return numChoice(rng, { prompt: `Zihinden hesapla: ${a} + ${b}`, answer: a + b, explain: `${b} = ${Math.floor(b / 10) * 10} + ${b % 10}; ${a} + ${Math.floor(b / 10) * 10} = ${a + Math.floor(b / 10) * 10}; + ${b % 10} = ${a + b}`, near: near3(a + b) })
}
const toplama3: Gen = (rng) => {
  let a: number, b: number
  do { a = randInt(rng, 105, 780); b = randInt(rng, 105, 999 - a) } while (a % 10 + (b % 10) < 10 && rng() < 0.7)
  return inp(`${a} + ${b} = ?`, a + b, `Önce birler, sonra onlar, en son yüzler toplanır. 10 ya da fazlası olunca elde bir sonraki basamağa eklenir. Sonuç ${a + b}.`, { kind: 'column', a, b, op: '+' })
}
const cikarma3: Gen = (rng) => {
  let a: number, b: number
  do { a = randInt(rng, 300, 999); b = randInt(rng, 101, a - 50) } while (a % 10 >= b % 10 && rng() < 0.7)
  return inp(`${a} − ${b} = ?`, a - b, `Birlerden başlarız; çıkmayan basamakta bir önceki basamaktan onluk alırız. Sonuç ${a - b}.`, { kind: 'column', a, b, op: '−' })
}
const ucToplanan3: Gen = (rng) => {
  const a = randInt(rng, 100, 350), b = randInt(rng, 100, 300), c = randInt(rng, 20, 999 - a - b)
  return inp(`${a} + ${b} + ${c} = ?`, a + b + c, `${a} + ${b} = ${a + b}; ${a + b} + ${c} = ${a + b + c}`)
}
const eksikOge3: Gen = (rng) => {
  const t = randInt(rng, 0, 3)
  const a = randInt(rng, 120, 560), b = randInt(rng, 101, 420)
  if (t === 0) return inp(`□ + ${b} = ${a + b}. Kutuya hangi sayı gelir?`, a, `Toplamdan bir toplanan çıkarılınca diğeri bulunur: ${a + b} − ${b} = ${a}`, { kind: 'equation', text: `□ + ${b} = ${a + b}` })
  if (t === 1) return inp(`${a} + □ = ${a + b}. Kutuya hangi sayı gelir?`, b, `${a + b} − ${a} = ${b}`, { kind: 'equation', text: `${a} + □ = ${a + b}` })
  if (t === 2) return inp(`□ − ${b} = ${a}. Kutuya hangi sayı gelir?`, a + b, `Eksilen = fark + çıkan: ${a} + ${b} = ${a + b}`, { kind: 'equation', text: `□ − ${b} = ${a}` })
  return inp(`${a + b} − □ = ${a}. Kutuya hangi sayı gelir?`, b, `Çıkan = eksilen − fark: ${a + b} − ${a} = ${b}`, { kind: 'equation', text: `${a + b} − □ = ${a}` })
}
const TERIM3_Q: Q[] = [
  { q: '245 + 312 = 557 işleminde 557’ye ne denir?', a: 'Toplam', w: ['Fark', 'Toplanan'], ex: 'Toplama işleminin sonucu toplamdır.' },
  { q: '648 − 363 = 285 işleminde 648’e ne denir?', a: 'Eksilen', w: ['Çıkan', 'Fark'], ex: 'Kendisinden çıkarılan sayı eksilendir.' },
  { q: '648 − 363 = 285 işleminde 285’e ne denir?', a: 'Fark', w: ['Toplam', 'Eksilen'], ex: 'Çıkarmanın sonucu farktır.' },
  { q: '7 × 8 = 56 işleminde 7 ve 8’e ne denir?', a: 'Çarpan', w: ['Çarpım', 'Bölen'], ex: 'Çarpılan sayılar çarpandır.' },
  { q: '38 ÷ 7 işleminde bölüm 5, kalan 3. 7’ye ne denir?', a: 'Bölen', w: ['Bölünen', 'Kalan'], ex: 'Kaça böldüğümüz sayı bölendir.' },
  { q: '38 ÷ 7 işleminde bölüm 5, kalan 3. 38’e ne denir?', a: 'Bölünen', w: ['Bölen', 'Bölüm'], ex: 'Bölme işleminde en büyük öge bölünendir.' },
  { q: '38 ÷ 7 işleminde 3’e ne denir?', a: 'Kalan', w: ['Bölüm', 'Çarpan'], ex: 'Eşit paylaşımdan artan kalandır; bölenden küçüktür.' },
]
const degisme3: Gen = (rng) => {
  const a = randInt(rng, 101, 400), b = randInt(rng, 101, 400), c = randInt(rng, 11, 99)
  const x = randInt(rng, 2, 9), y = randInt(rng, 11, 99)
  return mt('Sonucu aynı olan işlemleri eşleştir.', 'Toplananların ya da çarpanların yeri değişince sonuç değişmez; toplananlar farklı gruplanabilir.', [
    [`${a} + ${b}`, `${b} + ${a}`],
    [`(${a} + ${c}) + ${b}`, `${a} + (${c} + ${b})`],
    [`${x} × ${y}`, `${y} × ${x}`],
    [`${b} + ${c}`, `${c} + ${b}`],
  ], 4)(rng, 3, 2, [])
}
const carpimTablo: Gen = (rng) => {
  const a = randInt(rng, 2, 10), b = randInt(rng, 2, 10)
  return rng() < 0.5
    ? numChoice(rng, { prompt: `${a} × ${b} = ?`, answer: a * b, explain: `${a} tane ${b}: ${a * b}`, near: uniq([a * b + a, a * b - b, a * b + 1, a + b], a * b) })
    : inp(`${a} × ${b} = ?`, a * b, `${b} × ${a} = ${a * b} (çarpanların yeri değişse de sonuç aynı)`, { kind: 'groups', img: pick(rng, ['cookie', 'apple', 'star', 'strawberry']), groups: a, per: b })
}
const carpimBalon3: Gen = (rng) => {
  const hedef = pick(rng, [12, 18, 24, 36, 20, 30, 40, 16, 48])
  const all: [string, number][] = []
  for (let a = 2; a <= 10; a++) for (let b = 2; b <= 10; b++) all.push([`${a} × ${b}`, a * b])
  const hits = shuffle(rng, all.filter(([, v]) => v === hedef).map(([t]) => t)).slice(0, 5)
  const wrongs = shuffle(rng, all.filter(([, v]) => v !== hedef && Math.abs(v - hedef) <= 6).map(([t]) => t)).slice(0, 5)
  const q: PopQ = { type: 'pop', prompt: `Sonucu ${hedef} olan çarpmaları patlat!`, explain: `${hits.join(', ')} = ${hedef}`, target: hits[0], items: shuffle(rng, [...hits, ...wrongs]), need: Math.min(3, hits.length), hits }
  return q
}
const kat: Gen = (rng) => {
  const a = randInt(rng, 2, 10), k = randInt(rng, 2, 9)
  return rng() < 0.6
    ? inp(`${a} sayısının ${k} katı kaçtır?`, a * k, `${k} katı: ${k} × ${a} = ${a * k}`, { kind: 'sequence', items: [...Array.from({ length: Math.min(k, 6) }, (_, i): number | string => a * (i + 1)), ...(k > 6 ? ['…'] : [])] })
    : inp(`${a} sayısının kaç katı ${a * k} eder?`, k, `${a * k} ÷ ${a} = ${k}`)
}
const onYuz: Gen = (rng) => {
  const v = randInt(rng, 0, 2)
  if (v === 0) { const n = randInt(rng, 2, 99); return numChoice(rng, { prompt: `${n} × 10 = ?`, answer: n * 10, explain: `10 ile çarparken sayının sağına bir sıfır ekleriz: ${n * 10}`, near: uniq([n * 100, n + 10, n * 10 + 10, n], n * 10) }) }
  if (v === 1) { const n = randInt(rng, 1, 9); return numChoice(rng, { prompt: `${n} × 100 = ?`, answer: n * 100, explain: `100 ile çarparken sağına iki sıfır ekleriz: ${n * 100}`, near: uniq([n * 10, n + 100, n * 100 + 10], n * 100) }) }
  const n = randInt(rng, 1, 10) * 10; return numChoice(rng, { prompt: `${n} ÷ 10 = ?`, answer: n / 10, explain: `Birler basamağı 0 olan sayıyı 10’a bölerken sağdan bir sıfır sileriz: ${n / 10}`, near: uniq([n, n / 10 + 1, n / 10 + 10, n * 10], n / 10) })
}
const carpma3: Gen = (rng) => {
  const b = randInt(rng, 2, 9)
  const a = rng() < 0.5 ? randInt(rng, 11, 99) : randInt(rng, 101, Math.floor(999 / b))
  if (a * b > 999) return carpma3(rng, 3, 2, [])
  const birler = (a % 10) * b
  const kalanKisim = (a - (a % 10)) * b
  return inp(`${a} × ${b} = ?`, a * b, `Basamaklara ayırarak: ${a - (a % 10)} × ${b} = ${kalanKisim}, ${a % 10} × ${b} = ${birler}; ${kalanKisim} + ${birler} = ${a * b}`, { kind: 'equation', text: `${a} × ${b} = ?` })
}
const carpmaTahmin: Gen = (rng) => {
  const b = randInt(rng, 2, 9), a = randInt(rng, 12, Math.min(99, Math.floor(999 / b)))
  if (a % 10 === 0) return carpmaTahmin(rng, 3, 2, [])
  const t = onluk(a) * b
  return choice(rng, { prompt: `${a} × ${b} işleminin sonucunu, ${a} sayısını en yakın onluğa yuvarlayarak tahmin et.`, correct: String(t), wrong: uniq([t + b * 10, t - b * 10, t + 100], t).map(String), explain: `${a} ≈ ${onluk(a)}; ${onluk(a)} × ${b} = ${t}. Gerçek sonuç ${a * b}.`, max: 3 })
}
const bolme3: Gen = (rng) => {
  const bolen = randInt(rng, 2, 9)
  const bolum = randInt(rng, 2, Math.floor(99 / bolen) - 1)
  const kalan = rng() < 0.6 ? randInt(rng, 1, bolen - 1) : 0
  const n = bolen * bolum + kalan
  const kont = `Sağlama: ${bolen} × ${bolum}${kalan ? ` + ${kalan}` : ''} = ${n}`
  const v = randInt(rng, 0, 2)
  if (v === 0 || !kalan) return inp(`${n} ÷ ${bolen} işleminde bölüm kaçtır?`, bolum, `${n} ÷ ${bolen} = ${bolum}${kalan ? `, kalan ${kalan}` : ''}. ${kont}`, n <= 30 && bolen <= 5 ? { kind: 'share', img: pick(rng, ['cookie', 'apple', 'candy']), total: n, plates: bolen } : { kind: 'equation', text: `${n} ÷ ${bolen}` })
  if (v === 1) return inp(`${n} ÷ ${bolen} işleminde kalan kaçtır?`, kalan, `${bolen} × ${bolum} = ${bolen * bolum}; ${n} − ${bolen * bolum} = ${kalan}. Kalan bölenden küçüktür.`, { kind: 'equation', text: `${n} ÷ ${bolen}` })
  return choice(rng, { prompt: `${n} ÷ ${bolen} = ?`, correct: `${bolum}, kalan ${kalan}`, wrong: [`${bolum + 1}, kalan ${kalan}`, `${bolum}, kalan ${kalan + bolen}`, `${Math.max(1, bolum - 1)}, kalan ${kalan + 1}`], explain: kont, max: 3 })
}
const kalanKural: Gen = (rng) => {
  const b = randInt(rng, 3, 9)
  return numChoice(rng, { prompt: `Böleni ${b} olan bir bölmede kalan en çok kaç olabilir?`, answer: b - 1, explain: `Kalan her zaman bölenden küçüktür: en çok ${b - 1}.`, near: uniq([b, b + 1, b - 2], b - 1) })
}
const sagla3: Gen = (rng) => {
  const b = randInt(rng, 3, 9), q = randInt(rng, 3, Math.floor(99 / b) - 1), k = randInt(rng, 1, b - 1)
  const n = b * q + k
  if (rng() < 0.5) return choice(rng, { prompt: `${n} ÷ ${b} = ${q}, kalan ${k}. Sağlaması hangisi?`, correct: `${b} × ${q} + ${k} = ${n}`, wrong: [`${b} × ${k} + ${q} = ${b * k + q}`, `${n} + ${b} = ${n + b}`, `${q} + ${k} = ${q + k}`], explain: 'Bölmenin sağlaması: bölen × bölüm + kalan = bölünen.', max: 3 })
  const a = randInt(rng, 11, 40), c = randInt(rng, 2, 9)
  return choice(rng, { prompt: `${a} × ${c} = ${a * c}. Sağlaması hangisi?`, correct: `${a * c} ÷ ${c} = ${a}`, wrong: [`${a * c} − ${c} = ${a * c - c}`, `${a} + ${c} = ${a + c}`, `${a * c} ÷ ${a * c} = 1`], explain: 'Çarpmanın sağlaması: çarpım bir çarpana bölünür, diğer çarpan bulunur.', max: 3 })
}
const yonerge: Gen = (rng) => {
  for (let t = 0; t < 30; t++) {
    let x = randInt(rng, 10, 60)
    const adim = [`1. adım: ${x} sayısıyla başla.`]
    const ex = [String(x)]
    for (let i = 2; i <= 4; i++) {
      const tur = pick(rng, [...(x % 2 === 0 ? ['yari'] : []), ...(x >= 5 ? ['eksik'] : []), 'fazla', 'kat'])
      if (tur === 'fazla') { const k = randInt(rng, 3, 20); x += k; adim.push(`${i}. adım: ${k} fazlasını bul.`); ex.push(`+${k} → ${x}`) }
      else if (tur === 'eksik') { const k = randInt(rng, 2, Math.min(15, x - 1)); x -= k; adim.push(`${i}. adım: ${k} eksiğini bul.`); ex.push(`−${k} → ${x}`) }
      else if (tur === 'yari') { x /= 2; adim.push(`${i}. adım: yarısını al.`); ex.push(`÷2 → ${x}`) }
      else { const k = randInt(rng, 2, 3); x *= k; adim.push(`${i}. adım: ${k} katını bul.`); ex.push(`×${k} → ${x}`) }
    }
    if (x > 0 && x <= 999) return inp(`Yönergeyi takip et. ${adim.join(' ')} Sonuç kaç?`, x, ex.join(', '), img('memo'))
  }
  return inp('Yönergeyi takip et. 1. adım: 20 ile başla. 2. adım: 5 fazlasını bul. Sonuç kaç?', 25, '20 + 5 = 25', img('memo'))
}
const SAYI_BILMECE: [string, number, string][] = [
  ['Rakamları birbirinden farklı en küçük üç basamaklı sayı kaçtır?', 102, '1, 0, 2 → 102'],
  ['Üç basamaklı en büyük sayı kaçtır?', 999, 'Her basamakta en büyük rakam 9: 999.'],
  ['Üç basamaklı en küçük tek sayı kaçtır?', 101, '100 çift, 101 tek.'],
  ['İki basamaklı en büyük çift sayı kaçtır?', 98, '99 tek, 98 çift.'],
  ['4, 3, 1, 6 rakamlarıyla yazılabilen, rakamları farklı en büyük üç basamaklı sayı kaçtır?', 643, 'Büyük rakamlar başa: 643.'],
  ['4, 3, 1, 6 rakamlarıyla yazılabilen, rakamları farklı en küçük üç basamaklı sayı kaçtır?', 134, 'Küçük rakamlar başa: 134.'],
  ['Onlar basamağı 9 olan en küçük üç basamaklı sayı kaçtır?', 190, '1 yüzlük, 9 onluk, 0 birlik.'],
  ['Rakamları birbirinden farklı en büyük üç basamaklı sayı kaçtır?', 987, '9, 8, 7 → 987'],
]
const sayiBilmece: Gen = (rng, _g, _l, h) => {
  const recent = new Set(h.slice(-4).map((x) => x.prompt))
  const pool = SAYI_BILMECE.filter((x) => !recent.has(x[0]))
  const [q, a, ex] = pick(rng, pool.length ? pool : SAYI_BILMECE)
  return inp(q, a, ex, img('detective'))
}
const PROBLEM3 = (rng: Rng): [string, number, string] => {
  const t = randInt(rng, 0, 7)
  if (t === 0) { const p = randInt(rng, 20, 40), q = randInt(rng, 10, 20), k = randInt(rng, 2, 4); return [`Kantinde bir tost ${p} TL, bir ayran ${q} TL. ${k} tost ve 1 ayran kaç TL tutar?`, k * p + q, `${k} × ${p} = ${k * p}; ${k * p} + ${q} = ${k * p + q} TL`] }
  if (t === 1) { const a = randInt(rng, 250, 500), b = randInt(rng, 100, a - 50), c = randInt(rng, 50, 200); return [`Fırın sabah ${a} ekmek çıkardı. Öğlene kadar ${b} ekmek satıldı, sonra ${c} ekmek daha pişti. Fırında kaç ekmek var?`, a - b + c, `${a} − ${b} = ${a - b}; ${a - b} + ${c} = ${a - b + c}`] }
  if (t === 2) { const p = randInt(rng, 6, 12), g = randInt(rng, 3, 9), r = randInt(rng, 5, p * g - 1); return [`Her kutuda ${p} kalem olan ${g} kutu var. ${r} kalem dağıtıldı. Kaç kalem kaldı?`, p * g - r, `${g} × ${p} = ${p * g}; ${p * g} − ${r} = ${p * g - r}`] }
  if (t === 3) { const b = randInt(rng, 2, 9), q = randInt(rng, 3, Math.floor(99 / b)); return [`${b * q} ceviz ${b} tabağa eşit paylaştırıldı. Bir tabakta kaç ceviz olur?`, q, `${b * q} ÷ ${b} = ${q}`] }
  if (t === 4) { const d = randInt(rng, 5, 15), x = randInt(rng, 5, 7 * d - 1); return [`Kumbarama her gün ${d} TL atıyorum. Bir hafta sonra biriken paradan ${x} TL harcarsam kaç TL kalır?`, 7 * d - x, `1 hafta 7 gün: 7 × ${d} = ${7 * d}; ${7 * d} − ${x} = ${7 * d - x} TL`] }
  if (t === 5) { const a = randInt(rng, 120, 300), s = randInt(rng, 10, 40); return [`Kitaplıkta ${a} kitap var. ${s} öğrencinin her biri 2 kitap ödünç aldı. Kitaplıkta kaç kitap kaldı?`, a - 2 * s, `2 × ${s} = ${2 * s}; ${a} − ${2 * s} = ${a - 2 * s}`] }
  if (t === 6) { const c = randInt(rng, 2, 6), q = randInt(rng, 4, Math.floor(99 / c)), a = randInt(rng, 1, c * q - 1); return [`Duru’nun ${a}, Efe’nin ${c * q - a} bilyesi var. Bilyeleri birleştirip ${c} arkadaşa eşit paylaştırıyorlar. Her biri kaç bilye alır?`, q, `${a} + ${c * q - a} = ${c * q}; ${c * q} ÷ ${c} = ${q}`] }
  const k = randInt(rng, 3, 8), o = randInt(rng, 30, 60); return [`Bir otobüste ${o} yolcu var. Durakta ${k} kişi indi, ${k * 2} kişi bindi. Otobüste kaç yolcu oldu?`, o - k + 2 * k, `${o} − ${k} + ${2 * k} = ${o + k}`]
}
const problem3: Gen = (rng) => {
  const [q, a, ex] = PROBLEM3(rng)
  return rng() < 0.6 ? inp(q, a, ex, img('memo')) : numChoice(rng, { prompt: q, answer: a, explain: ex, near: near3(a) })
}
const kalanliProblem: Gen = (rng) => {
  const b = pick(rng, [4, 5, 6]), q = randInt(rng, 3, Math.floor(99 / b) - 1), k = randInt(rng, 1, b - 1)
  const n = b * q + k
  return rng() < 0.5
    ? inp(`${n} yumurtayı her viyole ${b} yumurta gelecek şekilde yerleştiriyoruz. Kaç viyol tam dolar?`, q, `${n} ÷ ${b} = ${q}, kalan ${k}. ${q} viyol dolar.`, img('egg'))
    : inp(`${n} yumurtayı her viyole ${b} yumurta gelecek şekilde yerleştiriyoruz. Kaç yumurta artar?`, k, `${b} × ${q} = ${b * q}; ${n} − ${b * q} = ${k} yumurta artar.`, img('egg'))
}
const ISLEM_Q: Q[] = [
  { q: 'Her rafta 9 kitap olan 6 raf var. Toplam kitap sayısını hangi işlemle buluruz?', a: 'Çarpma', w: ['Çıkarma', 'Bölme'], ex: 'Eşit gruplar: 6 × 9.', img: 'books' },
  { q: '72 fidan 8 sıraya eşit dikilecek. Bir sırada kaç fidan olduğunu hangi işlemle buluruz?', a: 'Bölme', w: ['Toplama', 'Çarpma'], ex: 'Eşit paylaştırma: 72 ÷ 8.', img: 'seedling' },
  { q: '450 TL’lik montun 120 TL indirimli fiyatını hangi işlemle buluruz?', a: 'Çıkarma', w: ['Toplama', 'Çarpma'], ex: 'Azalma: 450 − 120.', img: 'tshirt' },
  { q: 'Bir sınıfta 28, diğerinde 31 öğrenci var. Toplam öğrenci sayısını hangi işlemle buluruz?', a: 'Toplama', w: ['Bölme', 'Çıkarma'], ex: 'Birleştirme: 28 + 31.', img: 'friends' },
  { q: '“Üç katı” ifadesi hangi işlemi anlatır?', a: '3 ile çarpma', w: ['3 ekleme', '3’e bölme'], ex: 'Bir sayının 3 katı, 3 ile çarpımıdır.', img: 'thinking' },
  { q: '“Yarısı” ifadesi hangi işlemi anlatır?', a: '2’ye bölme', w: ['2 ile çarpma', '2 çıkarma'], ex: 'Yarısını almak 2’ye bölmektir.', img: 'thinking' },
]
const ESIT_SOL: [string, number][] = [['11 + 13', 24], ['20 + 18', 38], ['36 ÷ 4', 9], ['28 × 2', 56], ['96 − 36', 60], ['90 ÷ 3', 30], ['20 + 28', 48], ['64 ÷ 4', 16], ['6 × 4', 24], ['26 + 13', 39]]
const ESIT_SAG: [string, number][] = [['72 ÷ 3', 24], ['76 ÷ 2', 38], ['12 − 3', 9], ['25 + 31', 56], ['12 × 5', 60], ['15 × 2', 30], ['16 × 3', 48], ['34 − 18', 16], ['8 × 3', 24], ['13 × 3', 39]]
const esitlik3: Gen = (rng) => {
  const i = randInt(rng, 0, ESIT_SOL.length - 1)
  const dogru = rng() < 0.5
  const sag = dogru ? ESIT_SAG[i] : pick(rng, ESIT_SAG.filter((x) => x[1] !== ESIT_SOL[i][1]))
  return tf([[`${ESIT_SOL[i][0]} = ${sag[0]}`, ESIT_SOL[i][1] === sag[1], `${ESIT_SOL[i][0]} = ${ESIT_SOL[i][1]}; ${sag[0]} = ${sag[1]}.`]], 'balance')(rng, 3, 2, [])
}
const esitlikEsle: Gen = (rng) => {
  const idx = shuffle(rng, ESIT_SOL.map((_, i) => i)).filter((i, k, arr) => arr.findIndex((j) => ESIT_SOL[j][1] === ESIT_SOL[i][1]) === k).slice(0, 4)
  return mt('Sonucu eşit olan işlemleri eşleştir.', '“=” işareti, iki yanın sonucunun aynı olduğunu gösterir.', idx.map((i): P => [ESIT_SOL[i][0], ESIT_SAG[i][0]]), 4)(rng, 3, 2, [])
}
const teraziEksik: Gen = (rng) => {
  const a = randInt(rng, 2, 6), b = randInt(rng, 2, 6), c = randInt(rng, 1, 5)
  const sol = a + b + c
  const d = randInt(rng, 1, sol - 1)
  return inp(`Terazi dengede. Sol kefede ${a} kg, ${b} kg ve ${c} kg; sağ kefede ${d} kg ve bir paket var. Paket kaç kg?`, sol - d, `Sol: ${a} + ${b} + ${c} = ${sol} kg. ${sol} − ${d} = ${sol - d} kg`, { kind: 'balance', left: { text: `${a} + ${b} + ${c} kg` }, right: { text: `${d} kg + ?` }, tilt: 0 }, 'kg')
}

/* ================================================================ 4. TEMA · NESNELERİN GEOMETRİSİ (1) */
const SOLID_AD: Record<SolidKind, string> = { kup: 'Küp', kure: 'Küre', silindir: 'Silindir', 'kare-prizma': 'Kare prizma', 'dikdortgen-prizma': 'Dikdörtgen prizma', 'ucgen-prizma': 'Üçgen prizma' }
const SOLIDS = Object.keys(SOLID_AD) as SolidKind[]
const KYA: Partial<Record<SolidKind, [number, number, number]>> = { kup: [8, 6, 12], 'kare-prizma': [8, 6, 12], 'dikdortgen-prizma': [8, 6, 12], 'ucgen-prizma': [6, 5, 9] }
const cisimAdi3: Gen = (rng) => {
  const s = pick(rng, SOLIDS)
  return choice(rng, { prompt: 'Bu geometrik cismin adı nedir?', visual: { kind: 'solid', solid: s }, correct: SOLID_AD[s], wrong: SOLIDS.filter((x) => x !== s).map((x) => SOLID_AD[x]), explain: `Bu bir ${SOLID_AD[s].toLocaleLowerCase('tr-TR')}.`, max: 3 })
}
const koseYuzAyrit: Gen = (rng) => {
  const s = pick(rng, Object.keys(KYA) as SolidKind[])
  const [k, y, a] = KYA[s]!
  const v = randInt(rng, 0, 2)
  const ans = [k, y, a][v]
  const ne = ['köşesi', 'yüzü', 'ayrıtı'][v]
  return numChoice(rng, { prompt: `Bu cismin kaç ${ne} var? (${SOLID_AD[s]})`, visual: { kind: 'solid', solid: s }, answer: ans, explain: `${SOLID_AD[s]}: ${k} köşe, ${y} yüz, ${a} ayrıt. Ayrıt, iki yüzün birleştiği çizgidir; köşe, ayrıtların buluştuğu noktadır.`, near: uniq([k, y, a, ans + 1, ans - 1], ans, 1, 20) })
}
const OZELLIK_Q: Q[] = [
  { q: 'Beş yüzü ve dokuz ayrıtı olan cisim hangisi?', a: 'Üçgen prizma', w: ['Küp', 'Silindir', 'Küre'], ex: 'Üçgen prizmanın 2 üçgen, 3 dikdörtgen yüzü vardır.' },
  { q: 'Köşesi ve ayrıtı olmayan cisim hangisi?', a: 'Küre', w: ['Küp', 'Üçgen prizma', 'Kare prizma'], ex: 'Küre tamamen eğri bir yüzeydir.' },
  { q: 'Bütün yüzleri eş kare olan cisim hangisi?', a: 'Küp', w: ['Dikdörtgen prizma', 'Üçgen prizma', 'Silindir'], ex: 'Küpün 6 eş kare yüzü vardır.' },
  { q: 'İki düz daire yüzü ve bir eğri yüzü olan cisim hangisi?', a: 'Silindir', w: ['Küre', 'Küp', 'Kare prizma'], ex: 'Konserve kutusu silindire benzer.' },
  { q: 'Altı köşesi olan cisim hangisi?', a: 'Üçgen prizma', w: ['Küp', 'Dikdörtgen prizma', 'Küre'], ex: 'Üçgen prizmanın 6 köşesi vardır.' },
  { q: 'Küpün kaç ayrıtı vardır?', a: '12', w: ['6', '8', '9'], ex: 'Küp: 8 köşe, 6 yüz, 12 ayrıt.' },
  { q: 'İki yüzün birleştiği çizgiye ne denir?', a: 'Ayrıt', w: ['Köşe', 'Yüz', 'Köşegen'], ex: 'Ayrıtlar köşelerde buluşur.' },
]
const CISIM_P: P[] = [['Küre', 'Köşesi yok'], ['Üçgen prizma', '5 yüz'], ['Küp', '6 eş kare yüz'], ['Silindir', '2 daire yüz'], ['Dikdörtgen prizma', '6 dikdörtgen yüz']]
const SEKIL3: { s: ShapeKind; ad: string; k: number }[] = [
  { s: 'ucgen', ad: 'Üçgen', k: 3 }, { s: 'kare', ad: 'Kare', k: 4 }, { s: 'dikdortgen', ad: 'Dikdörtgen', k: 4 }, { s: 'besgen', ad: 'Beşgen', k: 5 }, { s: 'altigen', ad: 'Altıgen', k: 6 }, { s: 'sekizgen', ad: 'Sekizgen', k: 8 },
]
const kenarSekil: Gen = (rng) => {
  const it = pick(rng, SEKIL3)
  const vis: Visual = { kind: 'shape', shape: it.s, color: pick(rng, ['#ff7aa8', '#5aa8ff', '#5bc236', '#ffb020']) }
  if (rng() < 0.5) return numChoice(rng, { prompt: 'Bu şeklin kaç kenarı var?', visual: vis, answer: it.k, explain: `${it.ad}: ${it.k} kenar, ${it.k} köşe.`, near: uniq([3, 4, 5, 6, 8], it.k, 3, 8) })
  return choice(rng, { prompt: 'Kenar sayısına göre bu şeklin adı nedir?', visual: vis, correct: it.ad, wrong: SEKIL3.filter((x) => x.k !== it.k).map((x) => x.ad), explain: `${it.k} kenarlı şekil: ${it.ad.toLocaleLowerCase('tr-TR')}.`, max: 3 })
}
const KENAR_SORT: Parameters<typeof srt>[3] = [
  { label: 'Üçgen trafik levhası', img: 'construction', bin: 'u3' }, { label: '3 kenarlı şekil', bin: 'u3' }, { label: 'Üçgen', bin: 'u3' },
  { label: 'Kare', bin: 'd4' }, { label: 'Dikdörtgen', bin: 'd4' }, { label: 'Defter kapağı', img: 'notebook', bin: 'd4' },
  { label: 'Beşgen', bin: 'c5' }, { label: 'Altıgen petek gözü', img: 'honey', bin: 'c5' }, { label: 'Sekizgen dur levhası', img: 'stopsign', bin: 'c5' },
]
const KOSEGEN_TF: TF[] = [
  ['Karenin iki köşegeni vardır.', true, 'Karşılıklı köşeleri birleştiren iki köşegen çizilir.'],
  ['Üçgenin köşegeni yoktur.', true, 'Üçgende her köşe diğer köşelere komşudur.'],
  ['Dikdörtgenin köşegenlerinin uzunlukları eşittir.', true, 'Dikdörtgenin iki köşegeni eşit uzunluktadır.'],
  ['Köşegen, komşu iki köşeyi birleştirir.', false, 'Köşegen komşu olmayan köşeleri birleştirir; komşu köşeleri kenar birleştirir.'],
  ['Geometrik şekillerin köşeleri büyük harflerle adlandırılır.', true, 'Örneğin ABC üçgeni.'],
  ['Beşgenin 5 kenarı vardır.', true, 'Beşgen 5 kenarlı, 5 köşelidir.'],
  ['Altıgenin 8 kenarı vardır.', false, 'Altıgenin 6 kenarı vardır; 8 kenarlı şekil sekizgendir.'],
]
const ARAC_P: P[] = [
  ['Cetvel', 'Düz çizgi çizer, uzunluk ölçer', 'ruler'], ['Mezura', 'Esnek şerit metre'], ['Kırık metre', 'Katlanabilir metre'], ['Şerit metre', 'Sarılabilen metal şerit'], ['Kareli kâğıt', 'Kenarları eşit çizmeye yardım eder', 'notebook'],
]
const cevre3: Gen = (rng) => {
  const v = randInt(rng, 0, 2)
  if (v === 0) { const a = randInt(rng, 2, 12); return inp(`Bir kenarı ${a} cm olan karenin çevresi kaç cm?`, 4 * a, `Ç = ${a} + ${a} + ${a} + ${a} = ${4 * a} cm`, { kind: 'shape', shape: 'kare', color: '#5aa8ff' }, 'cm') }
  if (v === 1) { const a = randInt(rng, 4, 12), b = randInt(rng, 2, a - 1); return inp(`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin çevresi kaç cm?`, 2 * (a + b), `Ç = ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm`, { kind: 'shape', shape: 'dikdortgen', color: '#5bc236' }, 'cm') }
  const a = randInt(rng, 3, 10), b = randInt(rng, 3, 10), c = randInt(rng, Math.abs(a - b) + 1, a + b - 1)
  return inp(`Kenarları ${a} cm, ${b} cm ve ${c} cm olan üçgenin çevresi kaç cm?`, a + b + c, `Ç = ${a} + ${b} + ${c} = ${a + b + c} cm`, { kind: 'shape', shape: 'ucgen', color: '#ffb020' }, 'cm')
}
const cevreBirim: Gen = (rng) => {
  if (rng() < 0.5) { const k = randInt(rng, 2, 5); return numChoice(rng, { prompt: `Kare halının bir kenarı ${k} adım. 1 adım yaklaşık 40 cm ise halının çevresi yaklaşık kaç cm?`, answer: 4 * k * 40, explain: `Çevre ${4 * k} adım; ${4 * k} × 40 = ${4 * k * 40} cm`, near: uniq([k * 40, 2 * k * 40, 4 * k * 40 + 40], 4 * k * 40) }) }
  const a = randInt(rng, 6, 15), b = randInt(rng, 4, a - 1)
  return inp(`Defterin uzun kenarı ${a} ataş, kısa kenarı ${b} ataş. Defterin çevresi kaç ataş?`, 2 * (a + b), `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} ataş. Her kenar bir kez ölçülür.`, img('paperclip'))
}
const CEVRE_Q: Q[] = [
  { q: 'Bir şeklin çevresi nasıl bulunur?', a: 'Bütün kenarları toplanır', w: ['En uzun kenar ölçülür', 'Köşeler sayılır'], ex: 'Çevre, tüm kenar uzunluklarının toplamıdır.', img: 'ruler' },
  { q: 'Çevre ölçerken her kenar kaç kez ölçülür?', a: 'Bir kez', w: ['İki kez', 'Hiç'], ex: 'Her kenar bir defa ölçülür.', img: 'ruler' },
  { q: 'Sınıf panosunun çevresini ölçmek için en uygun araç hangisi?', a: 'Şerit metre', w: ['Terazi', 'Kronometre'], ex: 'Uzun kenarları şerit metreyle ölçeriz.', img: 'ruler' },
  { q: 'Kalemin çevresini ölçmek için ipi sarıp sonra neyle ölçeriz?', a: 'Cetvelle', w: ['Terazi ile', 'Saatle'], ex: 'İpi açıp cetvelle uzunluğunu ölçeriz.', img: 'pencil' },
]
const sivi3: Gen = (rng) => {
  const k = randInt(rng, 1, 8)
  return rng() < 0.6
    ? inp(`${k} litre kaç yarım litredir?`, 2 * k, `1 L = 2 yarım litre; ${k} × 2 = ${2 * k}`, img('droplet'))
    : inp(`${2 * k} tane yarım litrelik şişe kaç litre eder?`, k, `2 yarım litre = 1 L; ${2 * k} ÷ 2 = ${k} L`, img('bottle'), 'L')
}
const SIVI_SORT: Parameters<typeof srt>[3] = [
  { label: 'Kova', img: 'wastebasket', bin: 'fazla' }, { label: 'Damacana', img: 'droplet', bin: 'fazla' }, { label: 'Küvet', img: 'bathtub', bin: 'fazla' }, { label: 'Büyük tencere', img: 'bowl', bin: 'fazla' },
  { label: 'Çay bardağı', img: 'glass', bin: 'az' }, { label: 'Kaşık', img: 'forkplate', bin: 'az' }, { label: 'Fincan', img: 'teapot', bin: 'az' }, { label: 'Küçük meyve suyu kutusu', img: 'can', bin: 'az' },
]
const SIVI3_TF: TF[] = [
  ['Bir litre iki yarım litreye eşittir.', true, '1 L = yarım L + yarım L.'],
  ['4 yarım litre bir litre eder.', false, '4 yarım litre 2 litredir.'],
  ['Bir litre su bir çay bardağı sudan azdır.', false, 'Bir litre birçok bardak su eder.'],
  ['Litre kısaca “L” ile gösterilir.', true, 'Örneğin 5 L.'],
  ['Bir kova bir litreden fazla su alır.', true, 'Kovalar genellikle birkaç litre alır.'],
]

/* ================================================================ 5. TEMA · NESNELERİN GEOMETRİSİ (2) */
const SIM_SAY: { s: ShapeKind; ad: string; c: string }[] = [{ s: 'kare', ad: 'Kare', c: '4' }, { s: 'dikdortgen', ad: 'Dikdörtgen', c: '2' }, { s: 'daire', ad: 'Daire', c: 'Sonsuz' }]
const simetriSay: Gen = (rng) => {
  const it = pick(rng, SIM_SAY)
  return choice(rng, { prompt: `${it.ad} şeklinin kaç simetri doğrusu vardır?`, visual: { kind: 'shape', shape: it.s, color: '#ff7aa8' }, correct: it.c, wrong: ['1', '2', '4', 'Sonsuz', '3'].filter((x) => x !== it.c), explain: 'Karenin 4, dikdörtgenin 2 simetri doğrusu vardır; dairenin simetri doğrusu sonsuz sayıdadır.', max: 3, layout: 'tiles' })
}
const SIMETRI3_TF: TF[] = [
  ['Bir şekli iki eş parçaya ayıran doğruya simetri doğrusu denir.', true, 'İki parça birbirinin aynası gibidir.'],
  ['Dikdörtgenin köşegeni bir simetri doğrusudur.', false, 'Köşegen boyunca katlayınca parçalar üst üste gelmez.'],
  ['Karenin köşegenleri simetri doğrusudur.', true, 'Kareyi köşegenden katlayınca parçalar çakışır.'],
  ['Simetri doğrusuyla ayrılan parçalar birbirine eştir.', true, 'Renk, büyüklük ve yön korunur.'],
  ['Dairenin yalnızca bir simetri doğrusu vardır.', false, 'Merkezden geçen her doğru simetri doğrusudur.'],
  ['Simetrik şekli tamamlarken parçaların rengi değişebilir.', false, 'Renk, büyüklük ve yön aynı kalmalıdır.'],
  ['Kilim desenlerinde simetri çok kullanılır.', true, 'Motifler simetri doğrusuna göre tekrar eder.'],
]
const SIMETRI3_SORT: Parameters<typeof srt>[3] = [
  { label: 'Kelebek', img: 'butterfly', bin: 'evet' }, { label: 'Kalp', img: 'heart', bin: 'evet' }, { label: 'Kar tanesi', img: 'snowflake', bin: 'evet' }, { label: 'Kare', bin: 'evet' }, { label: 'H harfi', bin: 'evet' },
  { label: 'Salyangoz', img: 'snail', bin: 'hayir' }, { label: 'F harfi', bin: 'hayir' }, { label: 'G harfi', bin: 'hayir' }, { label: 'Tek ayakkabı', img: 'shoe', bin: 'hayir' }, { label: '7 rakamı', bin: 'hayir' },
]
const DIKEY_HARF = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'Y', 'W']
const YATAY_HARF = ['B', 'C', 'D', 'E', 'H', 'K', 'O', 'X']
const HIC_HARF = ['F', 'G', 'J', 'L', 'N', 'R', 'S', 'Z', 'P']
const harfBalon: Gen = (rng) => {
  const dikey = rng() < 0.5
  const hits = dikey ? DIKEY_HARF : YATAY_HARF
  return pop(`${dikey ? 'Dikey' : 'Yatay'} simetri doğrusu olan harfleri patlat!`, `${hits.join(', ')} harflerinin ${dikey ? 'dikey' : 'yatay'} simetri doğrusu vardır.`, hits, HIC_HARF)(rng, 3, 2, [])
}
const YON: Record<string, string> = { sag: 'sağa', sol: 'sola', yuk: 'yukarı', asa: 'aşağı' }
const yansit = (d: string, dikey: boolean) => (dikey ? ({ sag: 'sol', sol: 'sag' } as Record<string, string>)[d] ?? d : ({ yuk: 'asa', asa: 'yuk' } as Record<string, string>)[d] ?? d)
const yansima: Gen = (rng) => {
  const dikey = rng() < 0.5
  const d = pick(rng, dikey ? ['sag', 'sol'] : ['yuk', 'asa'])
  const n = randInt(rng, 1, 6)
  return choice(rng, { prompt: `Şeklin bir parçası “${n} birim ${YON[d]}” çizildi. ${dikey ? 'Dikey' : 'Yatay'} simetri doğrusuna göre öbür parçada bu adım nasıl olur?`, correct: `${n} birim ${YON[yansit(d, dikey)]}`, wrong: [`${n} birim ${YON[d]}`, `${n + 1} birim ${YON[yansit(d, dikey)]}`, `${n} birim ${YON[dikey ? 'yuk' : 'sag']}`], explain: dikey ? 'Dikey simetri doğrusunda sağ ile sol yer değiştirir; yukarı ve aşağı aynı kalır.' : 'Yatay simetri doğrusunda yukarı ile aşağı yer değiştirir; sağ ve sol aynı kalır.', max: 3 })
}
const yonergeYansit: Gen = (rng) => {
  const dikey = rng() < 0.5
  const ana = dikey ? 'sag' : 'yuk'
  const dirs = [ana, ...shuffle(rng, ['sag', 'sol', 'yuk', 'asa']).slice(0, 2)]
  const adim = shuffle(rng, dirs).map((d) => [randInt(rng, 1, 5), d] as [number, string])
  const yaz = (xs: [number, string][]) => xs.map(([n, d]) => `${n} ${YON[d]}`).join(', ')
  const dogru = adim.map(([n, d]) => [n, yansit(d, dikey)] as [number, string])
  const ters = adim.map(([n, d]) => [n, yansit(d, !dikey)] as [number, string])
  return choice(rng, { prompt: `Yönerge: ${yaz(adim)} (birim). ${dikey ? 'Dikey' : 'Yatay'} simetri doğrusuna göre simetrisini çizmek için hangi yönergeyi izleriz?`, correct: yaz(dogru), wrong: [yaz(adim), yaz(ters), yaz(dogru.map(([n, d]) => [n + 1, d]))], explain: dikey ? 'Dikey doğruda sağa ↔ sola değişir, yukarı/aşağı aynı kalır.' : 'Yatay doğruda yukarı ↔ aşağı değişir, sağa/sola aynı kalır.', max: 3 })
}
const tamamla: Gen = (rng) => {
  const n = randInt(rng, 2, 7)
  const it = pick(rng, [
    { ad: 'Kelebeğin sol kanadında', ne: 'benek', o: 'butterfly', yer: 'sağ kanadında' },
    { ad: 'Kilim motifinin sol yarısında', ne: 'üçgen', o: 'puzzle', yer: 'sağ yarısında' },
    { ad: 'Kalbin sol yarısında', ne: 'yıldız', o: 'heart', yer: 'sağ yarısında' },
  ])
  return numChoice(rng, { prompt: `${it.ad} ${n} ${it.ne} var. Dikey simetri doğrusuna göre tamamlanınca ${it.yer} kaç ${it.ne} olur?`, answer: n, visual: img(it.o), explain: `Simetrik parçalar eştir: öbür yanda da ${n} ${it.ne}. Toplam ${2 * n}.`, near: uniq([n + 1, n - 1, 2 * n], n, 1, 20) })
}

/* ================================================================ 6. TEMA · VERİYE DAYALI ARAŞTIRMA */
const ARASTIRMA3_TF: TF[] = [
  ['Araştırma sorusu herkesin aynı şekilde anlayacağı kadar açık olmalıdır.', true, 'Belirsiz sorular farklı cevaplar getirir.'],
  ['Araştırmada kime soru soracağımızı planlamamız gerekmez.', false, 'Plan: nasıl, kimden ve ne zaman veri toplanacak?'],
  ['Nokta grafiğinde her nokta bir veriyi gösterir.', true, 'Noktalar sayılarak sıklık bulunur.'],
  ['Şekil grafiğinde bir şekil birden fazla veriyi gösterebilir.', true, 'Grafiğin notunda “Her şekil 2 kişi” gibi yazar.'],
  ['Çetele tablosunda 5 çizgi bir demet yapar.', true, '4 dik çizgi ve üzerinden 1 çapraz çizgi: 5.'],
  ['Sıklık tablosunda veriler çizgiyle gösterilir.', false, 'Sıklık tablosunda sayılar yazılır; çizgiler çetelededir.'],
]
const SORU_SORT: Parameters<typeof srt>[3] = [
  { label: 'Sınıfımızdaki öğrenciler en çok hangi meyveyi sever?', bin: 'uygun' },
  { label: '3/A’daki öğrenciler okula nasıl geliyor?', bin: 'uygun' },
  { label: 'Arkadaşlarımız en çok hangi zekâ oyununu oynuyor?', bin: 'uygun' },
  { label: 'Okulumuzdaki çocuklar hangi kulübü seçti?', bin: 'uygun' },
  { label: 'Bu sabah kaç kuş uçtu?', bin: 'degil' },
  { label: 'Herkes ne düşünüyor?', bin: 'degil' },
  { label: 'Yarın kaç kişi güler?', bin: 'degil' },
  { label: 'Hangi renk?', bin: 'degil' },
]
const VERI3 = [
  { soru: 'En sevdiğiniz zekâ oyunu', items: [['Satranç', 'puzzle'], ['Mangala', 'gem'], ['Dama', 'checkered'], ['Yapboz', 'puzzle']] },
  { soru: 'Aralık ayında hava', items: [['Güneşli', 'sun'], ['Yağmurlu', 'rain'], ['Bulutlu', 'cloud'], ['Karlı', 'snowflake']] },
  { soru: 'Bahçeye dikilen çiçekler', items: [['Papatya', 'flower'], ['Gül', 'rose'], ['Lale', 'tulip'], ['Ayçiçeği', 'sunflower']] },
  { soru: 'En sevdiğiniz evcil hayvan', items: [['Kedi', 'cat'], ['Köpek', 'dog'], ['Kuş', 'bird'], ['Balık', 'fish']] },
]
const sekilGrafigi3: Gen = (rng) => {
  const k = pick(rng, VERI3)
  const olcek = pick(rng, [1, 2, 3])
  const rows = k.items.map(([label, im]) => ({ label, img: im, count: randInt(rng, 1, Math.floor(12 / olcek)) }))
  const r = pick(rng, rows)
  const v = randInt(rng, 0, 2)
  if (v === 0) return inp(`“${k.soru}” şekil grafiği. Her şekil ${olcek} veriyi gösteriyor. ${r.label} kaç?`, r.count * olcek, `${r.count} şekil × ${olcek} = ${r.count * olcek}`, { kind: 'pictograph', rows })
  const mx = Math.max(...rows.map((x) => x.count))
  if (v === 1 && rows.filter((x) => x.count === mx).length === 1) return choice(rng, { prompt: `“${k.soru}” grafiğine göre en çok hangisi var?`, visual: { kind: 'pictograph', rows }, correct: rows.find((x) => x.count === mx)!.label, wrong: rows.filter((x) => x.count !== mx).map((x) => x.label), explain: `En çok şekil ${rows.find((x) => x.count === mx)!.label} satırında: ${mx * olcek}.`, max: 3 })
  const top = rows.reduce((s, x) => s + x.count, 0) * olcek
  return inp(`“${k.soru}” grafiği. Her şekil ${olcek} veriyi gösteriyor. Toplam kaç veri toplanmış?`, top, `${rows.map((x) => x.count * olcek).join(' + ')} = ${top}`, { kind: 'pictograph', rows })
}
const cetele3: Gen = (rng) => {
  const k = pick(rng, VERI3)
  const rows = k.items.slice(0, 3).map(([label, im]) => ({ label, img: im, count: randInt(rng, 2, 12) }))
  const [a, b] = shuffle(rng, rows)
  if (rng() < 0.5 || a.count === b.count) return inp(`“${k.soru}” çetele tablosu. ${a.label} kaç kez işaretlenmiş?`, a.count, `Her demet 5: ${a.label} = ${a.count}`, { kind: 'tally', rows })
  const [x, y] = a.count > b.count ? [a, b] : [b, a]
  return inp(`Çetele tablosuna göre ${x.label}, ${y.label} sayısından kaç fazla?`, x.count - y.count, `${x.count} − ${y.count} = ${x.count - y.count}`, { kind: 'tally', rows })
}
const siklik: Gen = (rng) => {
  const k = pick(rng, VERI3)
  const rows = k.items.map(([label]) => ({ label, n: randInt(rng, 1, 12) }))
  const tablo = rows.map((r) => `${r.label} ${r.n}`).join(', ')
  const v = randInt(rng, 0, 1)
  const mn = Math.min(...rows.map((r) => r.n))
  if (v === 0 && rows.filter((r) => r.n === mn).length === 1) return choice(rng, { prompt: `Sıklık tablosu (${k.soru.toLocaleLowerCase('tr-TR')}): ${tablo}. En az hangisi var?`, correct: rows.find((r) => r.n === mn)!.label, wrong: rows.filter((r) => r.n !== mn).map((r) => r.label), explain: `En küçük sıklık ${mn}.`, max: 3 })
  const [a, b] = shuffle(rng, rows)
  return inp(`Sıklık tablosu: ${tablo}. ${a.label} ve ${b.label} toplam kaç?`, a.n + b.n, `${a.n} + ${b.n} = ${a.n + b.n}`, img('chart'))
}
const noktaGrafigi: Gen = (rng) => {
  const yas = [7, 8, 9, 10]
  const rows = yas.map((y) => ({ label: `${y} yaş`, img: 'glowstar', count: randInt(rng, 1, 9) }))
  const r = pick(rng, rows)
  return inp(`Kulüp üyelerinin yaşlarını gösteren nokta grafiği. Her nokta 1 kişi. ${r.label}ında kaç kişi var?`, r.count, `${r.label}: ${r.count} nokta = ${r.count} kişi`, { kind: 'pictograph', rows })
}
const KARAR_Q: Q[] = [
  { q: 'Sınıfta en çok satranç seçildi. Kulüp için hangi kararı vermek uygundur?', a: 'Satranç takımı kurmak', w: ['En az seçilen oyunu oynamak', 'Hiç oyun oynamamak'], ex: 'Veriye dayalı karar, çoğunluğun tercihini dikkate alır.', img: 'puzzle' },
  { q: 'Hava günlüğünde aralıkta en çok karlı gün var. Gezi için ne almalıyız?', a: 'Mont ve bere', w: ['Şort ve şapka', 'Mayo'], ex: 'Verilere göre hava soğuk ve karlı.', img: 'snowman' },
  { q: 'Bahçede en az lale dikildi. Bahçeyi dengelemek için ne yapılabilir?', a: 'Daha çok lale dikmek', w: ['Laleleri sökmek', 'Hiçbir şey dikmemek'], ex: 'En az olanı artırarak denge sağlanır.', img: 'tulip' },
  { q: 'Grafiği okuduktan sonra ne yaparız?', a: 'Verileri yorumlar, karar veririz', w: ['Grafiği sileriz', 'Yeni soru sormayız'], ex: 'Araştırma: soru → plan → veri toplama → gösterme → yorumlama → karar.', img: 'chart' },
]

/* ================================================================ ADALAR */
const T = 6
const OYUN = 8
export const MAT3_ADALAR: Alan[] = [
  {
    id: 't1', no: 1, title: 'Sayılar ve Nicelikler 1', color: '#ff9a2e', dark: '#d8670b', icon: 'numbers',
    acts: [
      { kind: 'sayi-oku', title: '1000’e Kadar Sayılar', icon: 'numbers', total: T, meb: 'MAT.3.1.1', gen: rot(sayiOku3, okunusEsle), ders: '1000’e kadar sayıları okur ve yazarız: 476 “dört yüz yetmiş altı” diye okunur.', visual: { kind: 'sequence', items: [474, 475, 476, 477] } },
      { kind: 'rakamla-yaz', title: 'Rakamla Yaz', icon: 'pencil', total: T, meb: 'MAT.3.1.1', gen: okunusYaz, ders: 'Okunuşu verilen sayıyı rakamla yazarız: “iki yüz kırk” = 240.', visual: img('pencil') },
      { kind: 'bloklar', title: 'Yüzlük, Onluk, Birlik', icon: 'abacus', total: T, meb: 'MAT.3.1.2', gen: bloklar3, ders: '10 onluk bir araya gelince 1 yüzlük olur. 352 = 3 yüzlük, 5 onluk, 2 birlik.', visual: { kind: 'blocks', hundreds: 3, tens: 5, ones: 2 } },
      { kind: 'cozumle', title: 'Sayıyı Çözümle', icon: 'puzzle', total: T, meb: 'MAT.3.1.2', gen: cozumle, ders: 'Üç basamaklı sayıyı basamak değerlerine ayırırız: 142 = 100 + 40 + 2.', visual: { kind: 'equation', text: '142 = 100 + 40 + 2' } },
      { kind: 'basamak', title: 'Basamak Değeri', icon: 'target', total: T, meb: 'MAT.3.1.2', gen: rot(basamak3, bilmece3), ders: 'Üç basamaklı sayılar birler, onlar ve yüzler basamağından oluşur. Rakamın bulunduğu basamağa göre aldığı değer basamak değeridir.', points: ['738’de 7 → 700', '738’de 3 → 30', '738’de 8 → 8'], visual: { kind: 'blocks', hundreds: 7, tens: 3, ones: 8 } },
      { kind: 'karsilastir', title: 'Büyüktür, Küçüktür', icon: 'balance', total: T, meb: 'MAT.3.1.3', gen: karsilastir, ders: '“<” küçüktür, “>” büyüktür, “=” eşittir demektir. 220 < 260 “220 küçüktür 260’tan” diye okunur.', visual: { kind: 'equation', text: '220 < 260 < 290' } },
      { kind: 'sirala', title: 'Sayıları Sırala', icon: 'train', total: T, meb: 'MAT.3.1.3', gen: sirala3, ders: 'Sayıları önce yüzlerine, sonra onlarına, sonra birlerine bakarak sıralarız.', visual: { kind: 'sequence', items: [193, 493, 793] } },
      { kind: 'yuvarla-onluk', title: 'En Yakın Onluk', icon: 'target', total: T, meb: 'MAT.3.1.3', gen: rot(yuvarlaOnluk, yuvarlaBalon), ders: 'Birler basamağı 5’ten küçükse kendi onluğuna, 5 ya da büyükse bir sonraki onluğa yuvarlarız: 114 ≈ 110, 115 ≈ 120.', visual: { kind: 'sequence', items: [110, '…', 114, '…', 120] } },
      { kind: 'yuvarla-yuzluk', title: 'En Yakın Yüzlük', icon: 'mountain', total: T, meb: 'MAT.3.1.3', gen: yuvarlaYuzluk, ders: 'Onlar basamağı 5’ten küçükse kendi yüzlüğüne, 5 ya da büyükse sonraki yüzlüğe yuvarlarız: 749 ≈ 700, 750 ≈ 800.', visual: { kind: 'sequence', items: [700, '…', 749, '…', 800] } },
      { kind: 'ritmik', title: 'Ritmik Sayma', icon: 'music', total: T, meb: 'MAT.3.1.4', gen: ritmik3, ders: 'Altışar 60’a, yedişer 70’e, sekizer 80’e, dokuzar 90’a; onar ve yüzer 1000’e kadar ileri ve geri sayarız.', visual: { kind: 'sequence', items: [7, 14, 21, 28, '?'] } },
      { kind: 'ritmik-balon', title: 'Ritim Balonları', icon: 'balloon', total: 4, meb: 'MAT.3.1.4', gen: ritmikBalon3, ders: 'Sekizer sayarken 8, 16, 24, 32… deriz.', visual: img('balloon') },
      { kind: 'tek-cift', title: 'Tek mi, Çift mi?', icon: 'star', total: T, meb: 'MAT.3.1.5', gen: rot(tekCiftSort, tekCiftBalon), ders: 'Birler basamağında 1, 3, 5, 7, 9 olan sayılar tek; 0, 2, 4, 6, 8 olan sayılar çifttir. Çift sayılar ikiye eşit paylaşılır.', visual: { kind: 'sequence', items: [1, 2, 3, 4, 5, 6] } },
      { kind: 'tek-cift-toplam', title: 'Tek ve Çift Toplamı', icon: 'sparkles', total: T, meb: 'MAT.3.1.6', gen: rot(tekCiftToplam, tf(TEKCIFT_TF, 'numbers')), ders: 'Tek + tek = çift, çift + çift = çift, tek + çift = tek.', points: ['15 + 7 = 22 (çift)', '12 + 8 = 20 (çift)', '13 + 6 = 19 (tek)'], visual: { kind: 'equation', text: 'tek + çift = tek' } },
      { kind: 'oruntu', title: 'Sayı Örüntüleri', icon: 'sparkles', total: T, meb: 'MAT.3.1.7', gen: oruntu3, ders: 'Örüntünün kuralını buluruz: 12’den başlayıp yedişer artan örüntü 12, 19, 26, 33…', visual: { kind: 'sequence', items: [12, 19, 26, '?'] } },
      { kind: 'sekil-oruntu', title: 'Şekil Örüntüleri', icon: 'star', total: T, meb: 'MAT.3.1.7', gen: sekilOruntu, ders: 'Şekil örüntülerinde her adımdaki şekil sayısı bir sayı örüntüsü oluşturur: 3, 5, 7, 9…', visual: { kind: 'objects', img: 'star', count: 5 } },
      { kind: 'tahmin', title: 'Tahmin Et', icon: 'eye', total: T, meb: 'MAT.3.1.8', gen: rot(tahmin3, ch(TAHMIN3_Q)), ders: 'Bir grubu sayıp bütününü tahmin ederiz. Sonra sayar, tahminimizin az, çok ya da eşit olduğunu söyleriz.', visual: img('eye') },
      { kind: 'oyun-ralli', title: 'Sayı Şehri Rallisi', icon: 'trophy', total: OYUN, meb: 'MAT.3.1.3', oyun: true, gen: karma(sayiOku3, bloklar3, karsilastir, yuvarlaOnluk, ritmik3, oruntu3), ders: 'Robo ile sayı şehrinde yarış: oku, karşılaştır, yuvarla, say!', visual: img('trophy') },
      { kind: 'oyun-ritim', title: 'Ritim Festivali', icon: 'music', total: 4, meb: 'MAT.3.1.4', oyun: true, gen: rot(ritmikBalon3, tekCiftBalon, sirala3), ders: 'Balonları patlat, sayıları sıraya diz!', visual: img('music') },
    ],
  },
  {
    id: 't2', no: 2, title: 'Sayılar ve Nicelikler 2', color: '#ffb020', dark: '#c98400', icon: 'clock',
    acts: [
      { kind: 'kesir-gosterim', title: 'Bütün, Yarım, Çeyrek', icon: 'pizza', total: T, meb: 'MAT.3.1.9', gen: kesirGoster, ders: 'Bütün 1/1, yarım 1/2, çeyrek 1/4 ile gösterilir. Kesir çizgisinin altına toplam parça sayısı, üstüne alınan parça sayısı yazılır.', points: ['1/2 → ikide bir', '1/4 → dörtte bir'], visual: { kind: 'fraction', n: 1, d: 4, shape: 'pie' } },
      { kind: 'birim-kesir', title: 'Birim Kesir', icon: 'cake', total: T, meb: 'MAT.3.1.10', gen: birimKesir, ders: 'Bütünün eş parçalarından her birine birim kesir denir: 1/3, 1/5, 1/8…', visual: { kind: 'fraction', n: 1, d: 5, shape: 'bar' } },
      { kind: 'pay-payda', title: 'Pay ve Payda', icon: 'pizza', total: T, meb: 'MAT.3.1.11', gen: rot(payPayda, birimKesriNe), ders: 'Modelin parça sayısı paydayı, boyanan parça sayısı payı gösterir. 3/4 “dörtte üç” diye okunur.', points: ['Pay: boyalı parça', 'Payda: bütün parça'], visual: { kind: 'fraction', n: 3, d: 4, shape: 'pie' } },
      { kind: 'kesir-oku', title: 'Kesir Okuma', icon: 'openbook', total: T, meb: 'MAT.3.1.11', gen: rot(mt('Kesri okunuşuyla eşleştir.', 'Önce paydayı, sonra payı okuruz: 2/3 “üçte iki”.', KESIR_P), mem('Kesir kartlarını eşleştir!', 'Kesir ve okunuşu.', KESIR_P)), ders: 'Kesri okurken önce paydayı, sonra payı söyleriz: 5/8 “sekizde beş”.', visual: img('openbook') },
      { kind: 'saat', title: 'Saat Kaç?', icon: 'clock', total: T, meb: 'MAT.3.1.12', gen: saat3, ders: 'Yelkovan dakikaları, akrep saati gösterir. 02.05 “ikiyi beş geçiyor”, 06.50 “altıyı elli geçiyor” diye okunur.', visual: { kind: 'clock', h: 3, m: 27 } },
      { kind: 'ogleden-sonra', title: 'Öğleden Sonra', icon: 'sun', total: T, meb: 'MAT.3.1.12', gen: ogledenSonra, ders: 'Bir gün 24 saattir. Öğleden sonra akrebin gösterdiği saate 12 ekleriz: 4.15 → 16.15.', visual: { kind: 'digital', h: 16, m: 15 } },
      { kind: 'saniye', title: 'Saniye, Dakika, Saat', icon: 'stopwatch', total: T, meb: 'MAT.3.1.13', gen: zamanDonus, ders: '1 dakika 60 saniye, 1 saat 60 dakikadır. 70 saniye = 1 dakika 10 saniye.', points: ['1 gün = 24 saat', '1 hafta = 7 gün', '1 yıl = 12 ay'], visual: img('stopwatch') },
      { kind: 'zaman-birim', title: 'Zaman Birimleri', icon: 'calendar', total: T, meb: 'MAT.3.1.13', gen: rot(mem('Zaman kartlarını eşleştir!', 'Zaman ölçü birimleri.', ZAMAN3_P), tf(ZAMAN3_TF, 'calendar'), mt('Eşit süreleri eşleştir.', '1 yıl = 12 ay = 52 hafta ≈ 365 gün.', ZAMAN3_P)), ders: '1 ay yaklaşık 4 hafta ya da 30 gün; 1 yıl 12 ay, 52 hafta, yaklaşık 365 gündür.', visual: img('calendar') },
      { kind: 'romen', title: 'Romen Rakamları', icon: 'scroll', total: T, meb: 'MAT.3.1.13', gen: rot(romen3, romenEsle), ders: 'I = 1, V = 5, X = 10. Küçük rakam büyüğün sağındaysa eklenir (VI = 6), solundaysa çıkarılır (IV = 4). 1’den 24’e kadar yazarız.', visual: img('scroll') },
      { kind: 'sure', title: 'Ne Kadar Sürer?', icon: 'hourglass', total: T, meb: 'MAT.3.1.14', gen: rot(ch(SURE3_Q), srt('Bir dakikadan kısa mı, uzun mu sürer?', 'Kısa işler saniyeler, uzun işler dakikalar ya da saatler sürer.', [{ id: 'kisa', label: '1 dakikadan kısa', img: 'stopwatch', color: '#22c55e' }, { id: 'uzun', label: '1 dakikadan uzun', img: 'hourglass', color: '#ef4444' }], SURE_SORT)), ders: 'Olayların sürelerini tahmin eder, sonra saatle ölçüp karşılaştırırız.', visual: img('hourglass') },
      { kind: 'uzunluk', title: 'Metre ve Santimetre', icon: 'ruler', total: T, meb: 'MAT.3.1.15', gen: uzunluk3, ders: '1 m = 100 cm. 120 cm = 1 m 20 cm; 2 m 40 cm = 240 cm.', visual: { kind: 'lengths', items: [{ color: '#5aa8ff', len: 10, label: '1 m = 100 cm' }] } },
      { kind: 'birim-sec', title: 'cm, m, km?', icon: 'map', total: T, meb: 'MAT.3.1.15', gen: rot(srt('Hangi birimle ölçülür? Sepetlere ayır.', 'Kısa uzunluklar cm, orta uzunluklar m, şehirler arası gibi uzun yollar km ile ölçülür.', [{ id: 'cm', label: 'cm', img: 'pencil', color: '#3b82f6' }, { id: 'm', label: 'm', img: 'school', color: '#f59e0b' }, { id: 'km', label: 'km', img: 'map', color: '#22c55e' }], BIRIM3_SORT), tf(OLCU3_TF, 'ruler')), ders: 'Kilometre (km) çok uzun mesafeleri ölçer: şehirler arası yollar, nehirler.', visual: img('map') },
      { kind: 'kutle', title: 'Kilogram ve Gram', icon: 'scale', total: T, meb: 'MAT.3.1.15', gen: kutle3, ders: '1 kg = 1000 g. Yarım kilogram 500 gramdır; 1 kg = 2 tane yarım kg = 10 tane 100 g.', visual: img('scale') },
      { kind: 'ton', title: 'g, kg, ton', icon: 'truck', total: T, meb: 'MAT.3.1.15', gen: srt('Hangi birimle tartılır? Sepetlere ayır.', 'Hafifler gram, orta ağırlıklar kilogram, çok ağır yükler ton (t) ile ölçülür.', [{ id: 'g', label: 'g', img: 'strawberry', color: '#22c55e' }, { id: 'kg', label: 'kg', img: 'watermelon', color: '#f59e0b' }, { id: 't', label: 'ton', img: 'truck', color: '#ef4444' }], KUTLE3_SORT), ders: 'Tır, gemi gibi çok ağır yükleri ton ile ölçeriz. Ton kısaca “t” ile gösterilir.', visual: img('truck') },
      { kind: 'para', title: 'Lira ve Kuruş', icon: 'coin', total: T, meb: 'MAT.3.1.16', gen: rot(para3, mt('Eşit değerleri eşleştir.', '1 TL = 100 kuruş.', PARA3_P)), ders: '100 kuruş 1 TL’dir. 4 lira 25 kuruş = 425 kuruş; 750 kuruş = 7 lira 50 kuruş.', visual: { kind: 'money', items: [5, 1, 0.5, 0.25] } },
      { kind: 'en-az-para', title: 'En Az Parayla Öde', icon: 'banknote', total: T, meb: 'MAT.3.1.16', gen: enAzPara, ders: 'Aynı miktarı farklı paralarla gösterebiliriz: 130 TL = 100 + 20 + 10 = 50 + 50 + 10 + 10 + 10. En az parayla ödemek için büyük paralardan başlarız.', visual: { kind: 'money', items: [100, 20, 10] } },
      { kind: 'oyun-zaman', title: 'Zaman Makinesi', icon: 'trophy', total: OYUN, meb: 'MAT.3.1.12', oyun: true, gen: karma(saat3, zamanDonus, romen3, kesirGoster, uzunluk3, para3), ders: 'Zaman makinesiyle yolculuk: saati oku, birimleri çevir, Romen rakamlarını çöz!', visual: img('rocket') },
      { kind: 'oyun-pazar', title: 'Pazar Tezgâhı', icon: 'store', total: 4, meb: 'MAT.3.1.16', oyun: true, gen: rot(mem('Eşit paraları bul!', 'Paralar.', PARA3_P), mt('Kesri okunuşuyla eşleştir.', 'Kesirler.', KESIR_P), enAzPara), ders: 'Tezgâhtaki kartları eşleştir, doğru parayı ver!', visual: img('store') },
    ],
  },
  {
    id: 't3', no: 3, title: 'İşlemlerden Cebirsel Düşünmeye', color: '#9b6ef3', dark: '#6b43c4', icon: 'abacus',
    acts: [
      { kind: 'tahmin-islem', title: 'Tahmin Et, Hesapla', icon: 'thinking', total: T, meb: 'MAT.3.2.1', gen: tahminTop, ders: 'Sayıları en yakın onluğa yuvarlayıp işlemin sonucunu tahmin ederiz: 134 + 353 ≈ 130 + 350 = 480. Gerçek sonuç 487; fark 7.', visual: { kind: 'equation', text: '134 + 353 ≈ 480' } },
      { kind: 'zihinden', title: 'Zihinden İşlem', icon: 'thinking', total: T, meb: 'MAT.3.2.1', gen: zihinden3, ders: 'Sayıları basamaklarına ayırarak ya da onar geri sayarak zihinden işlem yaparız: 255 − 60 → 245, 235, … 195.', visual: img('thinking') },
      { kind: 'terimler', title: 'İşlemin Ögeleri', icon: 'memo', total: T, meb: 'MAT.3.2.1', gen: ch(TERIM3_Q), ders: 'Toplananlar ve toplam; eksilen, çıkan ve fark; çarpanlar ve çarpım; bölünen, bölen, bölüm ve kalan.', visual: img('memo') },
      { kind: 'eldeli', title: 'Eldeli Toplama', icon: 'abacus', total: T, meb: 'MAT.3.2.2', gen: toplama3, ders: 'Önce birler, sonra onlar, en son yüzler toplanır. 10 ya da daha fazlası olunca elde bir sonraki basamağa eklenir: 148 + 264 = 412.', visual: { kind: 'column', a: 148, b: 264, op: '+' } },
      { kind: 'onluk-bozma', title: 'Bozarak Çıkarma', icon: 'abacus', total: T, meb: 'MAT.3.2.2', gen: cikarma3, ders: 'Çıkmayan basamakta bir önceki basamaktan onluk alırız: 593 − 346 = 247.', visual: { kind: 'column', a: 593, b: 346, op: '−' } },
      { kind: 'uc-toplanan', title: 'Üç Toplanan', icon: 'package', total: T, meb: 'MAT.3.2.2', gen: rot(ucToplanan3, degisme3), ders: 'Toplananların yeri değişse ya da farklı gruplansa da toplam değişmez: (25 + 12) + 36 = 25 + (12 + 36).', visual: { kind: 'equation', text: '(25 + 12) + 36 = 73' } },
      { kind: 'kayip-sayi', title: 'Kayıp Sayı', icon: 'detective', total: T, meb: 'MAT.3.2.2', gen: eksikOge3, ders: 'Toplamdan bir toplanan çıkarılınca diğer toplanan bulunur. Eksilen, fark ile çıkanın toplamıdır.', visual: { kind: 'equation', text: '□ + 450 = 858' } },
      { kind: 'carpim-tablosu', title: 'Çarpım Tablosu', icon: 'star', total: T, meb: 'MAT.3.2.3', gen: rot(carpimTablo, carpimBalon3), ders: 'Aynı sayıların toplanmasının kısa yolu çarpmadır. 10 × 10’a kadar çarpım tablosunu öğreniriz.', visual: { kind: 'groups', img: 'cookie', groups: 4, per: 7 } },
      { kind: 'kat', title: 'Kat Kavramı', icon: 'gift', total: T, meb: 'MAT.3.2.3', gen: kat, ders: 'Bir sayının katı, o sayının bir sayı ile çarpımıdır: 6’nın 5 katı 30’dur.', visual: { kind: 'sequence', items: [6, 12, 18, 24, 30] } },
      { kind: 'on-yuz', title: '10 ve 100 ile', icon: 'zap', total: T, meb: 'MAT.3.2.3', gen: onYuz, ders: '10 ile çarparken sağa bir sıfır, 100 ile çarparken iki sıfır ekleriz. Sonu 0 olan sayıyı 10’a bölerken bir sıfır sileriz.', points: ['71 × 10 = 710', '8 × 100 = 800', '70 ÷ 10 = 7'], visual: { kind: 'equation', text: '71 × 10 = 710' } },
      { kind: 'carpma-tahmin', title: 'Çarpmada Tahmin', icon: 'eye', total: T, meb: 'MAT.3.2.3', gen: carpmaTahmin, ders: 'Bir çarpanı en yakın onluğa yuvarlayıp tahmin ederiz: 22 × 4 ≈ 20 × 4 = 80.', visual: { kind: 'equation', text: '22 × 4 ≈ 80' } },
      { kind: 'carpma', title: 'Çarpma Yapalım', icon: 'abacus', total: T, meb: 'MAT.3.2.4', gen: carpma3, ders: 'Çarpmaya birlerden başlarız; elde bir sonraki çarpıma eklenir. 62 × 7 = 420 + 14 = 434.', visual: { kind: 'equation', text: '62 × 7 = 420 + 14' } },
      { kind: 'bolme', title: 'Kalanlı Bölme', icon: 'cookie', total: T, meb: 'MAT.3.2.4', gen: rot(bolme3, kalanKural), ders: 'Eşit paylaştırınca artan sayı kalandır. Kalan her zaman bölenden küçüktür: 18 ÷ 4 = 4, kalan 2.', visual: { kind: 'share', img: 'cookie', total: 18, plates: 4 } },
      { kind: 'sagla', title: 'Sağlama', icon: 'thumbsup', total: T, meb: 'MAT.3.2.4', gen: sagla3, ders: 'Bölmenin sağlaması: bölen × bölüm + kalan = bölünen. Çarpmanın sağlaması: çarpım bir çarpana bölünür.', visual: { kind: 'equation', text: '7 × 5 + 3 = 38' } },
      { kind: 'yonerge', title: 'Yönergeyi Takip Et', icon: 'compass', total: T, meb: 'MAT.3.2.5', gen: rot(yonerge, sayiBilmece), ders: 'Yönergeleri sırayla uygularız: “4 fazlasını bul, yarısını al, 5 eksiğini bul…”', visual: img('compass') },
      { kind: 'problem', title: 'Problem Çözelim', icon: 'memo', total: T, meb: 'MAT.3.2.6', gen: rot(problem3, kalanliProblem), ders: 'Problemi anla, plan yap, tahmin et, çöz, kontrol et.', points: ['Verilenler', 'İstenenler', 'Plan ve tahmin', 'Çözüm ve kontrol'], visual: img('memo') },
      { kind: 'islem-sec', title: 'Hangi İşlem?', icon: 'puzzle', total: T, meb: 'MAT.3.2.7', gen: ch(ISLEM_Q), ders: 'Problemdeki anahtar sözcükler işlemi seçmemize yardım eder: “katı” çarpma, “eşit paylaştır” bölme, “kaldı” çıkarma.', visual: img('puzzle') },
      { kind: 'esitlik', title: 'Eşitlik Terazisi', icon: 'balance', total: T, meb: 'MAT.3.2.8', gen: rot(esitlik3, esitlikEsle, teraziEksik), ders: 'Dengedeki terazide iki kefe eşittir. “=” sonucu aynı iki işlemi bağlar: 11 + 13 = 72 ÷ 3.', visual: { kind: 'balance', left: { text: '3 + 3 + 4 kg' }, right: { text: '5 + 5 kg' }, tilt: 0 } },
      { kind: 'oyun-kale', title: 'Dört İşlem Kalesi', icon: 'castle', total: OYUN, meb: 'MAT.3.2.6', oyun: true, gen: karma(toplama3, cikarma3, carpma3, bolme3, problem3, eksikOge3), ders: 'Her doğru işlem kalenin bir kapısını açar!', visual: img('castle') },
      { kind: 'oyun-kapi', title: 'Şifreli Kapı', icon: 'key2', total: 4, meb: 'MAT.3.2.8', oyun: true, gen: rot(carpimBalon3, esitlikEsle, yonerge), ders: 'Balonları patlat, eşitlikleri bul, şifreyi çöz!', visual: img('key2') },
    ],
  },
  {
    id: 't4', no: 4, title: 'Nesnelerin Geometrisi 1', color: '#2ec4c9', dark: '#149aa0', icon: 'puzzle',
    acts: [
      { kind: 'cisim-adi', title: 'Cisimleri Tanı', icon: 'package', total: T, meb: 'MAT.3.3.1', gen: cisimAdi3, ders: 'Küp, kare prizma, dikdörtgen prizma, üçgen prizma, silindir ve küre geometrik cisimlerdir.', visual: { kind: 'solid', solid: 'ucgen-prizma' } },
      { kind: 'kose-yuz-ayrit', title: 'Köşe, Yüz, Ayrıt', icon: 'puzzle', total: T, meb: 'MAT.3.3.1', gen: koseYuzAyrit, ders: 'Cisimlerin düz yüzeyleri yüz, iki yüzün birleştiği çizgi ayrıt, ayrıtların buluştuğu nokta köşedir. Küp: 8 köşe, 6 yüz, 12 ayrıt.', points: ['Küp: 8 köşe', 'Küp: 6 yüz', 'Küp: 12 ayrıt'], visual: { kind: 'solid', solid: 'kup' } },
      { kind: 'cisim-ozellik', title: 'Özelliğe Göre Cisim', icon: 'detective', total: T, meb: 'MAT.3.3.1', gen: rot(ch(OZELLIK_Q), mem('Cismi özelliğiyle eşleştir!', 'Cisimlerin özellikleri.', CISIM_P)), ders: 'Üçgen prizmanın 5 yüzü, 6 köşesi, 9 ayrıtı vardır. Kürenin köşesi ve ayrıtı yoktur.', visual: { kind: 'solid', solid: 'kure' } },
      { kind: 'kenar-sekil', title: 'Kenar Sayısı', icon: 'star', total: T, meb: 'MAT.3.3.2', gen: rot(kenarSekil, srt('Kenar sayısına göre sepetlere ayır.', '3 kenarlı üçgen, 4 kenarlı dörtgen; beşgen, altıgen, sekizgen daha çok kenarlıdır.', [{ id: 'u3', label: '3 kenar', color: '#f59e0b' }, { id: 'd4', label: '4 kenar', color: '#3b82f6' }, { id: 'c5', label: '5 ya da daha çok', color: '#22c55e' }], KENAR_SORT)), ders: 'Şekilleri kenar sayılarına göre adlandırırız: üçgen (3), dörtgen (4), beşgen (5), altıgen (6), sekizgen (8). Kare ve dikdörtgen birer dörtgendir.', visual: { kind: 'shape', shape: 'altigen', color: '#5bc236' } },
      { kind: 'kosegen', title: 'Köşegen', icon: 'sparkles', total: T, meb: 'MAT.3.3.2', gen: tf(KOSEGEN_TF, 'puzzle'), ders: 'Komşu olmayan iki köşeyi birleştiren doğru parçası köşegendir. Karenin ve dikdörtgenin iki eşit köşegeni vardır; üçgenin köşegeni yoktur.', visual: { kind: 'shape', shape: 'kare', color: '#5aa8ff' } },
      { kind: 'cizim', title: 'Çizim Araçları', icon: 'ruler', total: T, meb: 'MAT.3.3.3', gen: rot(mt('Aracı işiyle eşleştir.', 'Cetvel, mezura, şerit metre ve kırık metre ölçme ve çizme araçlarıdır.', ARAC_P), kenarSekil), ders: 'Şekilleri cetvelle, kareli ya da noktalı kâğıtta çizeriz. Köşeleri büyük harflerle adlandırırız: ABC üçgeni.', visual: img('ruler') },
      { kind: 'cevre', title: 'Çevre Uzunluğu', icon: 'ruler', total: T, meb: 'MAT.3.3.4', gen: rot(cevre3, ch(CEVRE_Q)), ders: 'Bir şeklin çevresi, bütün kenarlarının uzunlukları toplamıdır: Ç = 5 + 3 + 5 + 3 = 16 cm.', visual: { kind: 'shape', shape: 'dikdortgen', color: '#5bc236' } },
      { kind: 'cevre-birim', title: 'Karışla, Ataşla', icon: 'paperclip', total: T, meb: 'MAT.3.3.4', gen: cevreBirim, ders: 'Çevreyi karış, ataş, adım gibi birimlerle de tahmin eder, sonra cetvelle ölçeriz.', visual: img('paperclip') },
      { kind: 'litre', title: 'Litre ve Yarım Litre', icon: 'droplet', total: T, meb: 'MAT.3.3.5', gen: rot(sivi3, tf(SIVI3_TF, 'droplet')), ders: 'Sıvıları litre (L) ile ölçeriz. 1 litre 2 yarım litreye eşittir.', visual: img('bottle') },
      { kind: 'sivi-tahmin', title: 'Sıvıyı Tahmin Et', icon: 'glass', total: T, meb: 'MAT.3.3.5', gen: srt('1 litreden fazla mı, az mı alır? Sepetlere ayır.', 'Büyük kaplar 1 litreden fazla, küçük kaplar 1 litreden az sıvı alır.', [{ id: 'fazla', label: '1 L’den fazla', img: 'wastebasket', color: '#3b82f6' }, { id: 'az', label: '1 L’den az', img: 'glass', color: '#f59e0b' }], SIVI_SORT), ders: '1 litrelik bir şişeyi ölçü alarak kapların ne kadar sıvı aldığını tahmin ederiz.', visual: img('glass') },
      { kind: 'oyun-atolye', title: 'Geometri Atölyesi', icon: 'tools', total: OYUN, meb: 'MAT.3.3.2', oyun: true, gen: karma(cisimAdi3, koseYuzAyrit, kenarSekil, cevre3, sivi3), ders: 'Atölyede cisimler kur, şekiller çiz, çevreleri ölç!', visual: img('tools') },
      { kind: 'oyun-hafiza', title: 'Şekil Hafızası', icon: 'magnifier', total: 4, meb: 'MAT.3.3.1', oyun: true, gen: rot(mem('Cismi özelliğiyle eşleştir!', 'Cisimler.', CISIM_P), srt('Kenar sayısına göre ayır.', 'Kenarları say.', [{ id: 'u3', label: '3 kenar', color: '#f59e0b' }, { id: 'd4', label: '4 kenar', color: '#3b82f6' }, { id: 'c5', label: '5 ya da daha çok', color: '#22c55e' }], KENAR_SORT)), ders: 'Kartları çevir, eşleri bul!', visual: img('magnifier') },
    ],
  },
  {
    id: 't5', no: 5, title: 'Nesnelerin Geometrisi 2', color: '#ff7aa8', dark: '#d84c7e', icon: 'butterfly',
    acts: [
      { kind: 'simetri-dogrusu', title: 'Simetri Doğrusu', icon: 'butterfly', total: T, meb: 'MAT.3.3.6', gen: rot(simetriSay, tf(SIMETRI3_TF, 'butterfly')), ders: 'Bir şekli iki eş parçaya ayıran doğruya simetri doğrusu denir. Karenin 4, dikdörtgenin 2 simetri doğrusu vardır; dairenin sonsuz sayıda vardır.', visual: { kind: 'shape', shape: 'kare', color: '#ff7aa8' } },
      { kind: 'simetrik-mi', title: 'Simetrik mi?', icon: 'heart', total: T, meb: 'MAT.3.3.6', gen: srt('Simetrik mi? Sepetlere ayır.', 'Simetri doğrusuyla ikiye ayrılınca iki eş parça oluşuyorsa simetriktir.', [{ id: 'evet', label: 'Simetrik', img: 'butterfly', color: '#22c55e' }, { id: 'hayir', label: 'Simetrik değil', img: 'snail', color: '#ef4444' }], SIMETRI3_SORT), ders: 'Kelebek, kalp ve kar tanesi simetriktir; salyangoz simetrik değildir.', visual: img('heart') },
      { kind: 'harf-simetri', title: 'Yatay ve Dikey', icon: 'abc', total: 4, meb: 'MAT.3.3.7', gen: harfBalon, ders: 'Bazı harflerin dikey (A, H, M, T), bazılarının yatay (B, C, D, E) simetri doğrusu vardır.', visual: img('abc') },
      { kind: 'tamamla', title: 'Simetriği Tamamla', icon: 'palette', total: T, meb: 'MAT.3.3.7', gen: rot(tamamla, tf(SIMETRI3_TF, 'palette')), ders: 'Simetrik şekli tamamlarken renk, büyüklük ve yön aynı kalır; iki parça birbirine eştir.', visual: img('palette') },
      { kind: 'yansima', title: 'Ayna Adımı', icon: 'sparkles', total: T, meb: 'MAT.3.3.8', gen: yansima, ders: 'Dikey simetri doğrusunda sağa ile sola yer değiştirir; yatay simetri doğrusunda yukarı ile aşağı yer değiştirir.', visual: img('sparkles') },
      { kind: 'kodlama', title: 'Simetri Kodlama', icon: 'robot', total: T, meb: 'MAT.3.3.8', gen: rot(yonergeYansit, yolBulmaca), ders: '“2 birim yukarı, 3 birim sağa…” gibi yönergelerle şekil çizeriz. Simetrisini çizmek için yönergeyi simetri doğrusuna göre çeviririz.', points: ['Dikey: sağa ↔ sola', 'Yatay: yukarı ↔ aşağı'], visual: img('robot') },
      { kind: 'ok-kodu', title: 'Ok Kodları', icon: 'compass', total: T, meb: 'MAT.3.3.8', gen: yolBulmaca, ders: 'Okları takip ederek ızgarada yol alırız: sağa, sola, yukarı, aşağı.', visual: img('compass') },
      { kind: 'oyun-ayna', title: 'Ayna Labirenti', icon: 'trophy', total: OYUN, meb: 'MAT.3.3.6', oyun: true, gen: karma(simetriSay, yansima, yonergeYansit, tamamla, yolBulmaca), ders: 'Aynalı labirentte yolunu simetriyle bul!', visual: img('trophy') },
      { kind: 'oyun-kilim', title: 'Kilim Ustası', icon: 'palette', total: 4, meb: 'MAT.3.3.7', oyun: true, gen: rot(harfBalon, srt('Simetrik mi?', 'İki eş parça.', [{ id: 'evet', label: 'Simetrik', img: 'butterfly', color: '#22c55e' }, { id: 'hayir', label: 'Simetrik değil', img: 'snail', color: '#ef4444' }], SIMETRI3_SORT)), ders: 'Kilim motiflerini simetriyle tamamla!', visual: img('palette') },
    ],
  },
  {
    id: 't6', no: 6, title: 'Veriye Dayalı Araştırma', color: '#4f9bff', dark: '#2f6fd1', icon: 'chart',
    acts: [
      { kind: 'arastirma', title: 'Araştırma Sorusu', icon: 'thinking', total: T, meb: 'MAT.3.4.1', gen: rot(tf(ARASTIRMA3_TF, 'chart'), srt('Araştırma sorusu olarak uygun mu?', 'İyi bir araştırma sorusu açık olmalı, kime sorulacağı belli olmalı ve cevaplanabilmelidir.', [{ id: 'uygun', label: 'Uygun', img: 'thumbsup', color: '#22c55e' }, { id: 'degil', label: 'Uygun değil', img: 'thumbsdown', color: '#ef4444' }], SORU_SORT, 4)), ders: 'Araştırma sorusu açık ve net olmalı, kime sorulacağı belli olmalı, cevaplanabilmelidir.', visual: img('thinking') },
      { kind: 'cetele', title: 'Çetele Tablosu', icon: 'memo', total: T, meb: 'MAT.3.4.1', gen: cetele3, ders: 'Çetelede her veri bir çizgidir; 5 çizgi bir demet yapar.', visual: { kind: 'tally', rows: [{ label: 'Satranç', count: 8 }] } },
      { kind: 'siklik', title: 'Sıklık Tablosu', icon: 'numbers', total: T, meb: 'MAT.3.4.1', gen: siklik, ders: 'Sıklık tablosunda her seçeneğin kaç kez seçildiği sayıyla yazılır.', visual: img('chart') },
      { kind: 'sekil-grafigi', title: 'Şekil Grafiği', icon: 'chart', total: T, meb: 'MAT.3.4.1', gen: sekilGrafigi3, ders: 'Şekil grafiğinde her şekil belirli sayıda veriyi gösterir: “Her şekil 2 günü gösterir.”', visual: img('chart') },
      { kind: 'nokta-grafigi', title: 'Nokta Grafiği', icon: 'glowstar', total: T, meb: 'MAT.3.4.1', gen: noktaGrafigi, ders: 'Nokta grafiğinde her nokta bir veriyi gösterir. Noktaları sayarak sıklığı buluruz.', visual: img('glowstar') },
      { kind: 'karar', title: 'Veriyle Karar Ver', icon: 'target', total: T, meb: 'MAT.3.4.1', gen: rot(ch(KARAR_Q), sekilGrafigi3, cetele3), ders: 'Verileri yorumlayarak karar veririz: en çok seçilen, en az seçilen, aradaki fark.', visual: img('target') },
      { kind: 'oyun-anket', title: 'Okul Anketi', icon: 'chart', total: OYUN, meb: 'MAT.3.4.1', oyun: true, gen: karma(sekilGrafigi3, cetele3, siklik, noktaGrafigi, tf(ARASTIRMA3_TF)), ders: 'Okulda anket yap, verileri grafiğe dök!', visual: img('chart') },
      { kind: 'oyun-hava', title: 'Hava Günlüğü', icon: 'cloudsun', total: 4, meb: 'MAT.3.4.1', oyun: true, gen: rot(sekilGrafigi3, cetele3, ch(KARAR_Q)), ders: 'Bir ayın hava durumunu kaydet, grafiği oku!', visual: img('cloudsun') },
    ],
  },
]

/* ================================================================ EK ETKİNLİKLER (bölümlere ikinci/üçüncü biçim) */
const EK3: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'sayi-bilmece', title: 'Sayı Bilmecesi', icon: 'detective', total: T, meb: 'MAT.3.1.2', gen: rot(bilmece3, sayiBilmece), ders: 'Basamak ipuçlarını birleştirerek sayıyı buluruz.', visual: img('detective') },
    { kind: 'tek-cift-dy', title: 'Tek-Çift Doğru mu?', icon: 'thumbsup', total: T, meb: 'MAT.3.1.5', gen: tf(TEKCIFT_TF, 'numbers'), ders: 'Tek ve çift sayılarla ilgili ifadeleri sınarız.', visual: img('thumbsup') },
  ],
  t2: [
    { kind: 'kesir-birim-esle', title: 'Birim Kesir Bul', icon: 'cake', total: T, meb: 'MAT.3.1.10', gen: rot(birimKesriNe, birimKesir), ders: 'Her kesir, birim kesirlerinden oluşur: 3/5 = 3 tane 1/5.', visual: { kind: 'fraction', n: 3, d: 5, shape: 'bar' } },
  ],
  t3: [
    { kind: 'kalanli-problem', title: 'Artan Ne Kadar?', icon: 'egg', total: T, meb: 'MAT.3.2.6', gen: kalanliProblem, ders: 'Eşit gruplara ayırırken artanlar kalandır.', visual: img('egg') },
  ],
  t4: [
    { kind: 'kosegen-sekil', title: 'Şekil Doğruları', icon: 'thumbsup', total: T, meb: 'MAT.3.3.2', gen: rot(tf(KOSEGEN_TF, 'star'), kenarSekil), ders: 'Kenar, köşe ve köşegenle ilgili ifadeleri sınarız.', visual: img('star') },
  ],
  t5: [
    { kind: 'simetri-dy', title: 'Simetri Doğru mu?', icon: 'thumbsup', total: T, meb: 'MAT.3.3.6', gen: tf(SIMETRI3_TF, 'butterfly'), ders: 'Simetri doğrusu ile ilgili ifadeleri sınarız.', visual: img('butterfly') },
  ],
  t6: [
    { kind: 'veri-dy', title: 'Veri Doğru mu?', icon: 'thumbsup', total: T, meb: 'MAT.3.4.1', gen: tf(ARASTIRMA3_TF, 'chart'), ders: 'Tablo ve grafiklerle ilgili ifadeleri sınarız.', visual: img('chart') },
  ],
}
// Ek etkinlikleri kitap bölümüne (kazanım koduna) göre yerleştir; oyunlar en sonda kalır
const kodSira = (m: string) => m.split('.').map((x) => x.padStart(3, '0')).join('.')
for (const t of MAT3_ADALAR) {
  const acts = [...t.acts.filter((a) => !a.oyun), ...(EK3[t.id] ?? [])]
  const sirali = acts.map((a, i) => ({ a, i })).sort((x, y) => kodSira(x.a.meb).localeCompare(kodSira(y.a.meb)) || x.i - y.i)
  t.acts = [...sirali.map((x) => x.a), ...t.acts.filter((a) => a.oyun)]
}
