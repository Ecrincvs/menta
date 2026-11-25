/**
 * YARIŞMA SORU HAVUZU
 *  - Matematik, Türkçe, Fen Bilimleri, Hayat Bilgisi: oyundaki MEB uyumlu soru üreticilerinden
 *    (sınıfa göre) seçmeli sorular alınır — havuz etkinlik eklendikçe kendiliğinden büyür.
 *  - Mantık ve Genel Kültür: yarışma için yazılmış özgün sorular (sınıf düzeyine göre).
 * Yeni kategori eklemek için KATEGORILER listesine bir kayıt ve bir `uret` fonksiyonu yeterli.
 */
import { GAMES } from '../content/games'
import { GENERATORS } from '../content/generators'
import { makeRng, pick, shuffle, type Rng } from '../learning/rng'
import type { ChoiceQ, Option, Question } from '../games/quiz/types'
import type { Kategori, YSoru } from './motor'

type Sinif = 1 | 2 | 3 | 4

export interface KategoriBilgi {
  id: Kategori
  ad: string
  icon: string
  renk: string
  siniflar: Sinif[]
}
export const KATEGORILER: KategoriBilgi[] = [
  { id: 'matematik', ad: 'Matematik', icon: 'abacus', renk: '#9b6ef3', siniflar: [1, 2, 3, 4] },
  { id: 'turkce', ad: 'Türkçe', icon: 'openbook', renk: '#f0504a', siniflar: [1, 2, 3, 4] },
  { id: 'fen', ad: 'Fen Bilimleri', icon: 'microscope', renk: '#2ec4c9', siniflar: [3, 4] },
  { id: 'hayat', ad: 'Hayat Bilgisi', icon: 'housegarden', renk: '#ff9a2e', siniflar: [1, 2, 3] },
  { id: 'mantik', ad: 'Mantık', icon: 'puzzle', renk: '#5bc236', siniflar: [1, 2, 3, 4] },
  { id: 'kultur', ad: 'Genel Kültür', icon: 'globe', renk: '#4f9bff', siniflar: [1, 2, 3, 4] },
]
export const kategoriBilgi = (k: Kategori) => KATEGORILER.find((x) => x.id === k)!
export const kategorilerFor = (s: Sinif) => KATEGORILER.filter((k) => k.siniflar.includes(s))

/* ---------------------------------------------------------------- ders sorularından seçmeli soru */
const anahtar = (o: Option) => o.label ?? o.img ?? JSON.stringify(o.visual)
function secmeliMi(q: Question): q is ChoiceQ {
  return q.type === 'choice' && q.options.length >= 2 && q.options.length <= 4 && !q.passage && q.options.every((o) => o.label || o.img || o.visual)
}
function dersSorulari(kat: Kategori, sinif: Sinif, n: number, rng: Rng): YSoru[] {
  const oyunlar = GAMES.filter((g) => g.subject === kat && g.grades.includes(sinif) && g.available && GENERATORS[g.id])
  const out: YSoru[] = []
  const gorulen = new Set<string>()
  const gecmis: Record<string, Question[]> = {}
  for (let deneme = 0; out.length < n && deneme < n * 30 && oyunlar.length; deneme++) {
    const g = pick(rng, oyunlar)
    const h = (gecmis[g.id] ??= [])
    let q: Question
    try {
      q = GENERATORS[g.id](rng, sinif, 2, h)
    } catch {
      continue
    }
    h.push(q)
    if (!secmeliMi(q)) continue
    const key = q.prompt + '|' + q.options.map(anahtar).join(',')
    if (gorulen.has(key)) continue
    gorulen.add(key)
    out.push({ prompt: q.prompt, spoken: q.spoken, options: q.options, answer: q.answer, explain: q.explain, visual: q.visual, konu: g.title })
  }
  return out
}

/* ---------------------------------------------------------------- MANTIK */
const sec = (rng: Rng, prompt: string, dogru: string | Option, yanlis: (string | Option)[], explain: string, konu: string, extra: Partial<YSoru> = {}): YSoru => {
  const norm = (o: string | Option): Option => (typeof o === 'string' ? { label: o } : o)
  const d = norm(dogru)
  const w: Option[] = []
  for (const y of shuffle(rng, yanlis.map(norm))) if (anahtar(y) !== anahtar(d) && !w.some((x) => anahtar(x) === anahtar(y)) && w.length < 3) w.push(y)
  const options = shuffle(rng, [d, ...w])
  return { prompt, options, answer: options.findIndex((o) => anahtar(o) === anahtar(d)), explain, konu, ...extra }
}

const GRUPLAR: { ad: string; items: [string, string][] }[] = [
  { ad: 'meyve', items: [['Elma', 'apple'], ['Muz', 'banana'], ['Çilek', 'strawberry'], ['Armut', 'pear'], ['Üzüm', 'grapes'], ['Karpuz', 'watermelon']] },
  { ad: 'hayvan', items: [['Kedi', 'cat'], ['Köpek', 'dog'], ['Aslan', 'lion'], ['Fil', 'elephant'], ['Tavşan', 'rabbit'], ['Zürafa', 'giraffe']] },
  { ad: 'taşıt', items: [['Otobüs', 'bus'], ['Araba', 'car'], ['Tren', 'train'], ['Uçak', 'airplane'], ['Gemi', 'ship'], ['Bisiklet', 'bicycle']] },
  { ad: 'okul eşyası', items: [['Kalem', 'pencil'], ['Kitap', 'book'], ['Cetvel', 'ruler'], ['Makas', 'scissors'], ['Çanta', 'backpack'], ['Defter', 'notebook']] },
  { ad: 'müzik aleti', items: [['Gitar', 'guitar'], ['Davul', 'drum'], ['Keman', 'violin'], ['Mikrofon', 'microphone']] },
]
function farkli(rng: Rng): YSoru {
  const [a, b] = shuffle(rng, GRUPLAR).slice(0, 2)
  const uc = shuffle(rng, a.items).slice(0, 3)
  const tek = pick(rng, b.items)
  const opt = (x: [string, string]): Option => ({ label: x[0], img: x[1] })
  return sec(rng, 'Hangisi diğerlerinden farklı?', opt(tek), uc.map(opt), `${uc.map((x) => x[0]).join(', ')} birer ${a.ad}; ${tek[0]} ise ${b.ad}.`, 'Farklı olanı bul')
}
function sayiOruntu(rng: Rng, s: Sinif): YSoru {
  const adim = pick(rng, s <= 1 ? [1, 2, 5, 10] : s === 2 ? [2, 3, 5, 10] : [3, 4, 6, 25, 50])
  const azalan = s >= 2 && rng() < 0.35
  const bas = azalan ? adim * (6 + Math.floor(rng() * 4)) : adim * Math.floor(rng() * (s <= 1 ? 3 : 6))
  const dizi = Array.from({ length: 5 }, (_, i) => (azalan ? bas - i * adim : bas + i * adim))
  const gizli = 3 + Math.floor(rng() * 2)
  const cevap = dizi[gizli]
  const goster = dizi.map((x, i) => (i === gizli ? '?' : String(x))).join(', ')
  return sec(rng, `Örüntüyü tamamla: ${goster}`, String(cevap), [cevap + adim, cevap - adim, cevap + 1, cevap - 1].filter((x) => x >= 0).map(String), `Sayılar ${adim}'er ${azalan ? 'azalıyor' : 'artıyor'}.`, 'Sayı örüntüsü')
}
const SEKIL: [string, string][] = [['Üçgen', '▲'], ['Daire', '●'], ['Kare', '■'], ['Yıldız', '★']]
function sekilOruntu(rng: Rng): YSoru {
  const [a, b, c] = shuffle(rng, SEKIL)
  const kalip = rng() < 0.5 ? [a, b] : [a, b, c]
  const dizi = Array.from({ length: kalip.length * 2 + 1 }, (_, i) => kalip[i % kalip.length])
  const cevap = kalip[dizi.length % kalip.length]
  return sec(rng, `Sıradaki şekil hangisi? ${dizi.map((x) => x[1]).join(' ')} ?`, `${cevap[1]} ${cevap[0]}`, SEKIL.map((x) => `${x[1]} ${x[0]}`), `Kalıp tekrar ediyor: ${kalip.map((x) => x[1]).join(' ')}.`, 'Şekil örüntüsü')
}
const BILMECE: { g: Sinif[]; q: string; a: string; w: string[]; ex: string }[] = [
  { g: [1, 2], q: 'Ali, Ece’den uzun. Ece, Can’dan uzun. En kısa kim?', a: 'Can', w: ['Ali', 'Ece'], ex: 'Ali > Ece > Can, en kısa Can.' },
  { g: [1, 2], q: 'Bir kutuda 3 kırmızı, 1 mavi top var. Gözü kapalı en kolay hangi rengi çekeriz?', a: 'Kırmızı', w: ['Mavi', 'Yeşil'], ex: 'Kırmızı top daha çok, çekme olasılığı daha yüksek.' },
  { g: [1, 2, 3], q: 'Bugün pazartesi ise yarın hangi gün?', a: 'Salı', w: ['Pazar', 'Çarşamba', 'Cuma'], ex: 'Pazartesiden sonra salı gelir.' },
  { g: [1, 2, 3], q: 'Dün cuma idi. Bugün hangi gün?', a: 'Cumartesi', w: ['Perşembe', 'Pazar', 'Cuma'], ex: 'Cumadan sonra cumartesi gelir.' },
  { g: [1, 2], q: 'Hangisi hem uçar hem yüzer?', a: 'Ördek', w: ['Kedi', 'Balık', 'Fil'], ex: 'Ördek hem uçabilir hem yüzebilir.' },
  { g: [1, 2], q: 'Sınıfta önümde 2, arkamda 2 kişi var. Sırada kaç kişiyiz?', a: '5', w: ['4', '3', '6'], ex: '2 + ben + 2 = 5 kişi.' },
  { g: [2, 3, 4], q: 'Bir sayı düşündüm, 5 ekleyince 12 oldu. Sayı kaç?', a: '7', w: ['17', '5', '8'], ex: '12 − 5 = 7.' },
  { g: [2, 3, 4], q: 'Bir çiftlikte 3 tavuk var. Toplam kaç ayak vardır?', a: '6', w: ['3', '9', '12'], ex: 'Her tavuğun 2 ayağı var: 3 × 2 = 6.' },
  { g: [3, 4], q: 'Bir çiftlikte 2 inek ve 3 tavuk var. Toplam kaç ayak vardır?', a: '14', w: ['10', '12', '20'], ex: '2 × 4 + 3 × 2 = 8 + 6 = 14.' },
  { g: [3, 4], q: 'Ayşe, Berk’ten büyük; Berk, Cem’den büyük; Cem, Deniz’den büyük. En büyük kim?', a: 'Ayşe', w: ['Berk', 'Cem', 'Deniz'], ex: 'Sıra: Ayşe > Berk > Cem > Deniz.' },
  { g: [3, 4], q: 'Saat 3’te başlayan film 2 saat sürdü. Film kaçta bitti?', a: '5’te', w: ['4’te', '6’da', '1’de'], ex: '3 + 2 = 5.' },
  { g: [3, 4], q: 'Bir ipi 3 yerden kesersek kaç parça olur?', a: '4', w: ['3', '5', '6'], ex: 'Her kesim parça sayısını bir artırır: 1 + 3 = 4.' },
  { g: [2, 3, 4], q: 'Bir merdivenin her basamağı 2 adım. 4 basamak kaç adım?', a: '8', w: ['6', '4', '10'], ex: '4 × 2 = 8.' },
  { g: [1, 2], q: 'Elimde 3 elma var, 1 tanesini arkadaşıma verdim. Kaç elmam kaldı?', a: '2', w: ['4', '1', '3'], ex: '3 − 1 = 2.' },
  { g: [3, 4], q: '“Bütün kediler hayvandır. Pamuk bir kedidir.” Buna göre hangisi doğru?', a: 'Pamuk bir hayvandır', w: ['Pamuk bir kuştur', 'Bütün hayvanlar kedidir', 'Pamuk bir bitkidir'], ex: 'Pamuk kedi, kediler de hayvan; öyleyse Pamuk bir hayvandır.' },
  { g: [2, 3, 4], q: 'Hangi sayı tek sayıdır?', a: '7', w: ['4', '10', '8'], ex: '7 ikiye tam bölünmez, tek sayıdır.' },
]
function mantik(rng: Rng, s: Sinif, n: number): YSoru[] {
  const out: YSoru[] = []
  const bilmeceler = shuffle(rng, BILMECE.filter((b) => b.g.includes(s)))
  const gorulen = new Set<string>()
  for (let i = 0; out.length < n && i < n * 20; i++) {
    const t = i % 4
    const q =
      t === 0 ? farkli(rng) : t === 1 ? sayiOruntu(rng, s) : t === 2 ? sekilOruntu(rng) : bilmeceler.length ? (() => { const b = bilmeceler.pop()!; return sec(rng, b.q, b.a, b.w, b.ex, 'Bilmece') })() : farkli(rng)
    if (gorulen.has(q.prompt + q.options.map(anahtar).join())) continue
    gorulen.add(q.prompt + q.options.map(anahtar).join())
    out.push(q)
  }
  return out
}

/* ---------------------------------------------------------------- GENEL KÜLTÜR */
const KULTUR: { g: Sinif[]; q: string; a: string; w: string[]; ex: string; img?: string }[] = [
  { g: [1, 2], q: 'Gökkuşağında hangi renk yoktur?', a: 'Siyah', w: ['Kırmızı', 'Mavi', 'Sarı'], ex: 'Gökkuşağında siyah yoktur.', img: 'rainbow' },
  { g: [1, 2], q: 'Bir haftada kaç gün vardır?', a: '7', w: ['5', '10', '12'], ex: 'Pazartesiden pazara 7 gün.', img: 'calendar' },
  { g: [1, 2], q: 'Hangi hayvan “miyav” der?', a: 'Kedi', w: ['Köpek', 'İnek', 'Koyun'], ex: 'Kedi miyavlar.', img: 'cat' },
  { g: [1, 2], q: 'Arılar ne yapar?', a: 'Bal', w: ['Süt', 'Yumurta', 'Ekmek'], ex: 'Arılar çiçeklerden bal yapar.', img: 'bee' },
  { g: [1, 2, 3], q: 'Kışın gökyüzünden ne yağabilir?', a: 'Kar', w: ['Kum', 'Yaprak', 'Şeker'], ex: 'Kışın soğukta kar yağar.', img: 'snowflake' },
  { g: [1, 2, 3], q: 'Başkentimiz neresidir?', a: 'Ankara', w: ['İstanbul', 'İzmir', 'Bursa'], ex: 'Türkiye’nin başkenti Ankara’dır.', img: 'classical' },
  { g: [1, 2, 3], q: 'Bayrağımızın renkleri nelerdir?', a: 'Kırmızı ve beyaz', w: ['Mavi ve sarı', 'Yeşil ve beyaz', 'Siyah ve kırmızı'], ex: 'Kırmızı zemin üzerinde beyaz ay yıldız.', img: 'trflag' },
  { g: [1, 2], q: 'Hangisi bir mevsimdir?', a: 'İlkbahar', w: ['Pazartesi', 'Ocak', 'Sabah'], ex: 'Mevsimler: ilkbahar, yaz, sonbahar, kış.', img: 'cherryblossom' },
  { g: [1, 2], q: 'Penguenler nerede yaşar?', a: 'Soğuk buzullarda', w: ['Sıcak çölde', 'Ormanda ağaçta', 'Evde'], ex: 'Penguenler soğuk yerlerde yaşar.', img: 'penguin' },
  { g: [1, 2, 3], q: 'Hangi hayvanın boynu çok uzundur?', a: 'Zürafa', w: ['Tavşan', 'Fare', 'Kurbağa'], ex: 'Zürafa en uzun boyunlu hayvandır.', img: 'giraffe' },
  { g: [2, 3, 4], q: 'Bir yılda kaç ay vardır?', a: '12', w: ['10', '7', '24'], ex: 'Ocaktan aralığa 12 ay.', img: 'calendar' },
  { g: [2, 3, 4], q: 'Güneş hangi yönden doğar?', a: 'Doğu', w: ['Batı', 'Kuzey', 'Güney'], ex: 'Güneş doğudan doğar, batıdan batar.', img: 'sunrise' },
  { g: [2, 3, 4], q: 'Dünyanın en büyük okyanusu hangisidir?', a: 'Büyük Okyanus', w: ['Hint Okyanusu', 'Atlas Okyanusu', 'Akdeniz'], ex: 'En büyük okyanus Büyük (Pasifik) Okyanus’tur.', img: 'wave' },
  { g: [2, 3, 4], q: 'Hangisi bir gezegendir?', a: 'Mars', w: ['Ay', 'Güneş', 'Bulut'], ex: 'Mars bir gezegendir; Güneş bir yıldız, Ay ise uydudur.', img: 'planet' },
  { g: [2, 3, 4], q: 'İstiklâl Marşı’nın şairi kimdir?', a: 'Mehmet Âkif Ersoy', w: ['Yunus Emre', 'Nasreddin Hoca', 'Karacaoğlan'], ex: 'İstiklâl Marşı’nı Mehmet Âkif Ersoy yazdı.', img: 'scroll' },
  { g: [2, 3, 4], q: 'Hangi hayvan memelidir?', a: 'Yunus', w: ['Köpek balığı', 'Kartal', 'Kurbağa'], ex: 'Yunuslar memelidir, yavrularını sütle besler.', img: 'dolphin' },
  { g: [3, 4], q: 'Türkiye’nin kaç tarafı denizlerle çevrilidir?', a: 'Üç', w: ['Bir', 'İki', 'Dört'], ex: 'Ülkemizin üç tarafı denizlerle çevrilidir.', img: 'map' },
  { g: [3, 4], q: 'Dünyanın uydusu hangisidir?', a: 'Ay', w: ['Mars', 'Güneş', 'Venüs'], ex: 'Ay, Dünya’nın uydusudur.', img: 'fullmoon' },
  { g: [3, 4], q: 'Su kaç derecede donar?', a: '0 derece', w: ['10 derece', '50 derece', '100 derece'], ex: 'Su 0 derecede donar, 100 derecede kaynar.', img: 'ice' },
  { g: [3, 4], q: 'Hangi kıtada yaşıyoruz? (Türkiye’nin büyük kısmı)', a: 'Asya', w: ['Afrika', 'Avustralya', 'Güney Amerika'], ex: 'Anadolu Asya kıtasındadır; Trakya ise Avrupa’dadır.', img: 'globe' },
  { g: [3, 4], q: 'Ülkemizin en kalabalık şehri hangisidir?', a: 'İstanbul', w: ['Ankara', 'Van', 'Bolu'], ex: 'En kalabalık şehrimiz İstanbul’dur.', img: 'cityscape' },
  { g: [3, 4], q: 'Bitkiler besinlerini üretmek için neye ihtiyaç duyar?', a: 'Güneş ışığına', w: ['Karanlığa', 'Gürültüye', 'Plastiğe'], ex: 'Bitkiler güneş ışığıyla besin üretir.', img: 'seedling' },
  { g: [1, 2], q: 'Hangisini yazmak için kullanırız?', a: 'Kalem', w: ['Kaşık', 'Tarak', 'Top'], ex: 'Kalemle yazarız.', img: 'pencil' },
  { g: [1, 2], q: 'Hangi meyvenin içi kırmızı, kabuğu yeşildir?', a: 'Karpuz', w: ['Muz', 'Portakal', 'Limon'], ex: 'Karpuzun kabuğu yeşil, içi kırmızıdır.', img: 'watermelon' },
  { g: [1, 2, 3], q: 'Hangi araç havada uçar?', a: 'Uçak', w: ['Tren', 'Gemi', 'Otobüs'], ex: 'Uçaklar havada uçar.', img: 'airplane' },
  { g: [2, 3, 4], q: 'Bir saatte kaç dakika vardır?', a: '60', w: ['30', '100', '24'], ex: '1 saat = 60 dakika.', img: 'clock' },
  { g: [3, 4], q: 'Bir günde kaç saat vardır?', a: '24', w: ['12', '60', '7'], ex: '1 gün = 24 saat.', img: 'clock' },
  { g: [3, 4], q: 'Hangisi yenilenebilir enerji kaynağıdır?', a: 'Güneş', w: ['Kömür', 'Petrol', 'Doğal gaz'], ex: 'Güneş ve rüzgâr tükenmeyen enerji kaynaklarıdır.', img: 'sun' },
]
function kultur(rng: Rng, s: Sinif, n: number): YSoru[] {
  return shuffle(rng, KULTUR.filter((k) => k.g.includes(s)))
    .slice(0, n)
    .map((k) => sec(rng, k.q, k.a, k.w, k.ex, 'Genel kültür', k.img ? { visual: { kind: 'image', img: k.img } } : {}))
}

/** Bir yarışma için soru seti üret */
export function soruSeti(kat: Kategori, sinif: Sinif, n: number, seed = Date.now()): YSoru[] {
  const rng = makeRng(seed)
  const qs = kat === 'mantik' ? mantik(rng, sinif, n) : kat === 'kultur' ? kultur(rng, sinif, n) : dersSorulari(kat, sinif, n, rng)
  // genel kültür havuzu küçük kalırsa mantıkla tamamla
  if (qs.length < n && kat === 'kultur') qs.push(...mantik(rng, sinif, n - qs.length))
  return shuffle(rng, qs).slice(0, n)
}
