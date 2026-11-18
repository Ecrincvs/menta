/**
 * TÜRKÇE içerik üreticileri — MEB Maarif Türkçe programı (docs/meb/turkce-ek1-ogrenme-ciktilari.txt).
 * 1. sınıf: ses grupları sırası ve "hecelerde büyük harf yok" kuralı.
 * 2. sınıf: zıt anlam, metin unsurları, büyük harf, noktalama.
 * 3. sınıf: eş/zıt anlam, ana fikir, gerçek/mecaz, atasözü.
 * 4. sınıf: eş/zıt/eş sesli, ana fikir, gerçek/mecaz/yan anlam, deyim ve atasözü.
 */
import { SOUND_GROUPS, WORDS, upperTR } from '../words'
import { LETTER_SOUNDS } from '../../audio/speech'
import { pick, shuffle } from '../../learning/rng'
import { C, choice, fromBank, order, type BankItem, type Gen } from './helpers'

/* ============================ HARF AVI (1. sınıf) ============================ */
/** Seviye ilerledikçe yeni ses grupları açılır (1: 1. grup … 3: 1–3. gruplar; seri ilerledikçe 5'e kadar) */
export function lettersFor(level: number, plays = 0) {
  const groups = Math.min(5, level + Math.floor(plays / 4))
  return SOUND_GROUPS.slice(0, groups).flat()
}

export const harfAvi: Gen = (rng, _g, level, history) => {
  const allowed = lettersFor(level, history.length)
  const words = WORDS.filter((w) => allowed.includes(w.word[0]) && !w.word.includes(' '))
  const usePicture = words.length > 0 && rng() < 0.45
  const target = usePicture ? pick(rng, words).word[0] : pick(rng, allowed)
  const word = usePicture ? pick(rng, words.filter((w) => w.word[0] === target)) : null
  const n = level === 1 ? 3 : level === 2 ? 4 : 5
  const others = shuffle(rng, allowed.filter((l) => l !== target)).slice(0, n - 1)
  const sound = LETTER_SOUNDS[target] ?? target
  if (word) {
    return choice(rng, {
      prompt: 'Bu resim hangi sesle başlıyor? Baloncuğu yakala!',
      spoken: `${word.word}. ${word.word} hangi sesle başlıyor?`,
      correct: target,
      wrong: others,
      max: n,
      layout: 'bubbles',
      visual: { kind: 'image', img: word.img, size: 170 },
      explain: `${upperTR(word.word[0])}${word.word.slice(1)} kelimesi “${target}” sesiyle başlar: ${[...word.word].join(' - ')}`,
    })
  }
  return choice(rng, {
    prompt: `“${target}” sesini yakala!`,
    spoken: `${sound} sesini yakala!`,
    correct: target,
    wrong: others,
    max: n,
    layout: 'bubbles',
    explain: `Bu ses “${target}” harfiyle yazılır. Büyük hâli: ${upperTR(target)}`,
  })
}

/* ============================ HECE TRENİ (1–2) ============================ */
const HECE: { w: string; h: string[]; img: string }[] = [
  { w: 'elma', h: ['el', 'ma'], img: 'apple' },
  { w: 'lale', h: ['la', 'le'], img: 'tulip' },
  { w: 'kalem', h: ['ka', 'lem'], img: 'pencil' },
  { w: 'limon', h: ['li', 'mon'], img: 'lemon' },
  { w: 'inek', h: ['i', 'nek'], img: 'cow' },
  { w: 'ekmek', h: ['ek', 'mek'], img: 'bread' },
  { w: 'kale', h: ['ka', 'le'], img: 'castle' },
  { w: 'üzüm', h: ['ü', 'züm'], img: 'grapes' },
  { w: 'saat', h: ['sa', 'at'], img: 'clock' },
  { w: 'ördek', h: ['ör', 'dek'], img: 'duck' },
  { w: 'domates', h: ['do', 'ma', 'tes'], img: 'tomato' },
  { w: 'dondurma', h: ['don', 'dur', 'ma'], img: 'icecream' },
  { w: 'yıldız', h: ['yıl', 'dız'], img: 'star' },
  { w: 'zebra', h: ['zeb', 'ra'], img: 'zebra' },
  { w: 'balık', h: ['ba', 'lık'], img: 'fish' },
  { w: 'balon', h: ['ba', 'lon'], img: 'balloon' },
  { w: 'çilek', h: ['çi', 'lek'], img: 'strawberry' },
  { w: 'çiçek', h: ['çi', 'çek'], img: 'flower' },
  { w: 'güneş', h: ['gü', 'neş'], img: 'sun' },
  { w: 'gemi', h: ['ge', 'mi'], img: 'ship' },
  { w: 'civciv', h: ['civ', 'civ'], img: 'chick' },
  { w: 'çanta', h: ['çan', 'ta'], img: 'backpack' },
  { w: 'şemsiye', h: ['şem', 'si', 'ye'], img: 'umbrella' },
  { w: 'kitap', h: ['ki', 'tap'], img: 'book' },
  { w: 'pasta', h: ['pas', 'ta'], img: 'cake' },
  { w: 'havuç', h: ['ha', 'vuç'], img: 'carrot' },
  { w: 'fare', h: ['fa', 're'], img: 'mouse' },
  { w: 'horoz', h: ['ho', 'roz'], img: 'rooster' },
  { w: 'araba', h: ['a', 'ra', 'ba'], img: 'car' },
  { w: 'tavşan', h: ['tav', 'şan'], img: 'rabbit' },
  { w: 'zürafa', h: ['zü', 'ra', 'fa'], img: 'giraffe' },
  { w: 'yumurta', h: ['yu', 'mur', 'ta'], img: 'egg' },
  { w: 'maymun', h: ['may', 'mun'], img: 'monkey' },
  { w: 'mantar', h: ['man', 'tar'], img: 'mushroom' },
  { w: 'otobüs', h: ['o', 'to', 'büs'], img: 'bus' },
  { w: 'dinozor', h: ['di', 'no', 'zor'], img: 'dino' },
  { w: 'portakal', h: ['por', 'ta', 'kal'], img: 'orange' },
  { w: 'salyangoz', h: ['sal', 'yan', 'goz'], img: 'snail' },
  { w: 'penguen', h: ['pen', 'gu', 'en'], img: 'penguin' },
  { w: 'kaplumbağa', h: ['kap', 'lum', 'ba', 'ğa'], img: 'turtle' },
  { w: 'uğur böceği', h: ['u', 'ğur', ' ', 'bö', 'ce', 'ği'], img: 'ladybug' },
]

export const heceTreni: Gen = (rng, grade, level, history) => {
  const allowed = grade === 1 ? lettersFor(level + 1, history.length) : null
  const recent = new Set(history.map((h) => h.prompt + ('img' in h ? h.img : '')))
  let pool = HECE.filter((x) => !x.h.includes(' ') && (allowed ? [...x.w].every((c) => allowed.includes(c)) : true))
  if (grade === 2) pool = pool.filter((x) => x.h.length >= (level >= 2 ? 3 : 2))
  if (pool.length === 0) pool = HECE.filter((x) => !x.h.includes(' ') && x.h.length <= 2)
  const fresh = pool.filter((x) => !recent.has('Hece Treni' + x.img))
  const item = pick(rng, fresh.length ? fresh : pool)
  const extraPool = HECE.flatMap((x) => x.h).filter((s) => s !== ' ' && !item.h.includes(s))
  const extra = level >= 2 ? shuffle(rng, extraPool).slice(0, level === 3 ? 2 : 1) : []
  return order({
    prompt: 'Hece Treni',
    spoken: `${item.w}. Heceleri sırayla diz: ${item.h.join(', ')}`,
    img: item.img,
    pieces: item.h,
    extra,
    joiner: '',
    style: 'train',
    explain: `${upperTR(item.w[0])}${item.w.slice(1)} kelimesinin heceleri: ${item.h.join(' - ')}`,
  })
}

/* ============================ OKUMA HİKÂYESİ ============================ */
type Story = { t: string; text: string; img: string; q: string; a: string; w: string[]; ex: string }
const STORIES: Record<1 | 2 | 3 | 4, Story[]> = {
  1: [
    { t: 'Lale', text: 'Nil, annesiyle bahçeye çıktı. Bahçede kırmızı laleler vardı. Nil laleleri suladı.', img: 'tulip', q: 'Nil ne yaptı?', a: 'Laleleri suladı.', w: ['Top oynadı.', 'Kitap okudu.', 'Uyudu.'], ex: 'Metinde “Nil laleleri suladı.” yazıyor.' },
    { t: 'Kedi', text: 'Ali okuldan eve geldi. Kapıda küçük bir kedi gördü. Kediye süt verdi.', img: 'cat', q: 'Ali kediye ne verdi?', a: 'Süt', w: ['Ekmek', 'Elma', 'Su'], ex: 'Metinde “Kediye süt verdi.” yazıyor.' },
    { t: 'Yağmur', text: 'Dışarıda yağmur yağıyordu. Elif şemsiyesini aldı. Yağmurda ıslanmadı.', img: 'umbrella', q: 'Elif neden ıslanmadı?', a: 'Şemsiyesini aldığı için', w: ['Evde kaldığı için', 'Koştuğu için', 'Güneş açtığı için'], ex: 'Elif şemsiyesini aldı, bu yüzden ıslanmadı.' },
    { t: 'Kuş', text: 'Ağacın dalında bir kuş vardı. Kuş, yavrularına yem getirdi. Yavrular çok mutlu oldu.', img: 'bird', q: 'Kuş nerede duruyordu?', a: 'Ağacın dalında', w: ['Çatıda', 'Suyun içinde', 'Evin önünde'], ex: 'Metinde “Ağacın dalında bir kuş vardı.” yazıyor.' },
    { t: 'Pasta', text: 'Bugün Can’ın doğum günü. Annesi ona çilekli pasta yaptı. Can arkadaşlarıyla pastayı paylaştı.', img: 'cake', q: 'Bu metin neyi anlatıyor?', a: 'Can’ın doğum gününü', w: ['Okulun ilk gününü', 'Bir parkı', 'Yağmurlu bir günü'], ex: 'Metnin konusu Can’ın doğum günü.' },
    { t: 'Tren', text: 'Okan dedesiyle trene bindi. Tren hızla ilerledi. Okan pencereden inekleri izledi.', img: 'train', q: 'Okan pencereden neleri izledi?', a: 'İnekleri', w: ['Balıkları', 'Uçakları', 'Arabaları'], ex: 'Metinde “Okan pencereden inekleri izledi.” yazıyor.' },
    { t: 'Fidan', text: 'Ece ile babası bahçeye bir fidan dikti. Her gün fidanı suladılar. Fidan büyüdü ve ağaç oldu.', img: 'seedling', q: 'Fidan neden büyüdü?', a: 'Her gün sulandığı için', w: ['Kış geldiği için', 'Kesildiği için', 'Kimse bakmadığı için'], ex: 'Ece ile babası fidanı her gün suladı.' },
  ],
  2: [
    { t: 'Kayıp Kalem', text: 'Mert, sınıfta kalemini bulamadı. Çok üzüldü. Sıra arkadaşı Zeynep, kendi kalemini ona ödünç verdi. Mert teşekkür etti. Teneffüste kalemini çantasının dibinde buldu.', img: 'pencil', q: 'Mert’e kim yardım etti?', a: 'Zeynep', w: ['Öğretmeni', 'Annesi', 'Kimse'], ex: 'Sıra arkadaşı Zeynep kalemini ödünç verdi.' },
    { t: 'Kelebek', text: 'İlkbaharda bahçedeki çiçekler açtı. Rengârenk bir kelebek çiçekten çiçeğe kondu. Defne kelebeği yakalamak istemedi; onu uzaktan izlemeyi seçti.', img: 'butterfly', q: 'Olay hangi mevsimde geçiyor?', a: 'İlkbaharda', w: ['Kışın', 'Sonbaharda', 'Yazın'], ex: 'Metin “İlkbaharda bahçedeki çiçekler açtı.” diye başlıyor.' },
    { t: 'Kütüphane', text: 'Ayşe, hafta sonu babasıyla kütüphaneye gitti. Hayvanlarla ilgili bir kitap seçti. Kitabı okuyunca penguenlerin uçamadığını ama çok iyi yüzdüğünü öğrendi.', img: 'penguin', q: 'Ayşe kitaptan ne öğrendi?', a: 'Penguenlerin iyi yüzdüğünü', w: ['Kuşların uçtuğunu', 'Kedilerin süt içtiğini', 'Balıkların uyuduğunu'], ex: 'Ayşe, penguenlerin uçamadığını ama iyi yüzdüğünü öğrendi.' },
    { t: 'Futbol Maçı', text: 'Okulda futbol maçı vardı. Emre’nin takımı maçı kaybetti. Emre önce üzüldü, sonra rakip takımı tebrik etti. Öğretmeni, Emre’nin bu davranışını çok beğendi.', img: 'ball', q: 'Emre maçtan sonra ne yaptı?', a: 'Rakip takımı tebrik etti', w: ['Ağladı ve eve gitti', 'Topu kaçırdı', 'Hakeme kızdı'], ex: 'Emre üzülse de rakip takımı tebrik etti.' },
    { t: 'Tohum', text: 'Elif saksıya bir fasulye tohumu ekti. Saksıyı güneş alan pencerenin önüne koydu. Birkaç gün sonra tohumdan küçük bir filiz çıktı.', img: 'plant', q: 'Elif saksıyı nereye koydu?', a: 'Güneş alan pencerenin önüne', w: ['Karanlık dolaba', 'Buzdolabına', 'Bahçe kapısına'], ex: 'Metinde “güneş alan pencerenin önüne koydu” yazıyor.' },
    { t: 'Deniz', text: 'Yaz tatilinde Kerem ailesiyle denize gitti. Kumsalda kumdan bir kale yaptı. Dalgalar kaleyi yıkınca güldü ve yeniden yaptı.', img: 'wave', q: 'Kerem kumsalda ne yaptı?', a: 'Kumdan kale yaptı', w: ['Balık tuttu', 'Kitap okudu', 'Uçurtma uçurdu'], ex: 'Kerem kumsalda kumdan bir kale yaptı.' },
  ],
  3: [
    { t: 'Damla Damla', text: 'Selin her gün kumbarasına bir lira atıyordu. Arkadaşları bunun çok az olduğunu söylüyordu. Yılın sonunda kumbarayı açtığında, istediği kitap setini alacak kadar para biriktirdiğini gördü. Küçük adımların büyük sonuçlar doğurduğunu anladı.', img: 'coin', q: 'Metnin ana fikri nedir?', a: 'Küçük birikimler zamanla büyük sonuçlar doğurur.', w: ['Kitap okumak sıkıcıdır.', 'Para harcamak eğlencelidir.', 'Arkadaşlar her zaman haklıdır.'], ex: 'Selin her gün az biriktirdi ama sonunda istediğini aldı: küçük adımlar büyük sonuç doğurur.' },
    { t: 'Ortak Bahçe', text: 'Mahalledeki boş arsa çöplerle doluydu. Çocuklar bir araya gelip burayı temizlemeye karar verdi. Kimi çöpleri topladı, kimi çiçek dikti. Birkaç hafta sonra arsa, herkesin oynadığı güzel bir bahçeye dönüştü.', img: 'sunflower', q: 'Metnin ana fikri nedir?', a: 'Birlikte çalışınca güzel işler başarılır.', w: ['Çiçekler çabuk solar.', 'Çöpler kendiliğinden yok olur.', 'Çocuklar oyun oynamamalıdır.'], ex: 'Çocuklar iş birliği yaparak arsayı bahçeye dönüştürdü.' },
    { t: 'Yeni Öğrenci', text: 'Sınıfa yeni bir öğrenci geldi. Adı Ali’ydi ve başka bir şehirden taşınmıştı. Teneffüste yalnız oturuyordu. Deniz, yanına gidip onu oyuna çağırdı. Ali o gün ilk kez gülümsedi.', img: 'school', q: 'Bu metinden hangi duyguyu çıkarırız?', a: 'Yardımseverlik ve arkadaşlık', w: ['Kıskançlık', 'Korku', 'Öfke'], ex: 'Deniz, yalnız kalan arkadaşına yardım etti: metin arkadaşlık ve yardımseverliği anlatıyor.' },
    { t: 'Arıların Dansı', text: 'Bal arıları yiyecek bulduklarında kovana dönüp özel bir dans yapar. Bu dansla diğer arılara çiçeklerin hangi yönde ve ne kadar uzakta olduğunu anlatırlar. Böylece bütün kovan yiyeceğe kolayca ulaşır.', img: 'bee', q: 'Arılar dansı neden yapar?', a: 'Çiçeklerin yerini diğer arılara anlatmak için', w: ['Eğlenmek için', 'Kovanı temizlemek için', 'Uyumak için'], ex: 'Dans, yiyeceğin yönünü ve uzaklığını diğer arılara anlatır.' },
    { t: 'Dede ile Ağaç', text: 'Yaşlı bir dede bahçesine ceviz fidanı dikiyordu. Bir çocuk “Bu ağaç büyüyüp meyve verene kadar çok yıllar geçecek.” dedi. Dede gülümsedi: “Ben de başkalarının diktiği ağaçların meyvesini yedim. Şimdi sıra bende.”', img: 'tree', q: 'Metnin ana fikri nedir?', a: 'Gelecek nesilleri düşünerek iyilik yapmalıyız.', w: ['Ceviz ağacı çabuk büyür.', 'Yaşlılar bahçe sevmez.', 'Ağaç dikmek gereksizdir.'], ex: 'Dede, kendisinden sonrakiler için ağaç dikiyor: gelecek nesilleri düşünmeliyiz.' },
  ],
  4: [
    { t: 'Kütüphanenin Sesi', text: 'Okulun kütüphanesi uzun süredir boş kalıyordu. Dördüncü sınıflar bir “Kitap Kulübü” kurdu. Her hafta bir kitap seçip hakkında konuştular, okudukları kitaplardan küçük tiyatrolar hazırladılar. Bir dönem sonra kütüphane, teneffüslerde en kalabalık yer oldu. Okumanın paylaşıldıkça büyüyen bir mutluluk olduğunu herkes fark etti.', img: 'books', q: 'Metnin ana fikri nedir?', a: 'Okuma sevgisi paylaşıldıkça yayılır.', w: ['Kütüphaneler sessiz olmalıdır.', 'Tiyatro kitaptan daha önemlidir.', 'Teneffüste oyun oynanmamalıdır.'], ex: 'Kitap kulübü sayesinde okuma herkese yayıldı: okuma sevgisi paylaşıldıkça büyür.' },
    { t: 'Su Damlası', text: 'Bir damla su, okyanustan buharlaşarak gökyüzüne yükseldi. Bulutlarda arkadaşlarıyla buluştu, sonra yağmur olup bir dağa yağdı. Dereye, oradan nehre karıştı ve sonunda yeniden okyanusa ulaştı. Damla, bu yolculuğun hiç bitmediğini anladı.', img: 'droplet', q: 'Metinde anlatılan yolculuk neyi gösterir?', a: 'Suyun doğadaki döngüsünü', w: ['Bir geminin seyahatini', 'Bir balığın göçünü', 'Bulutların renk değiştirmesini'], ex: 'Buharlaşma, yağış, akış ve okyanusa dönüş: su döngüsü.' },
    { t: 'Mucit Çocuk', text: 'Kerem, yaşlı komşusunun çiçeklerini sulamakta zorlandığını gördü. Pet şişeler ve bir hortumla basit bir damla sulama düzeneği tasarladı. İlk denemede su fazla aktı; Kerem pes etmedi, delikleri küçülttü. Sonunda düzenek çalıştı ve komşusu çok sevindi.', img: 'plant', q: 'Kerem’in davranışından hangi sonuca ulaşırız?', a: 'Sorunlara çözüm ararken sabırlı olmak başarı getirir.', w: ['İlk denemede her şey başarılı olur.', 'Çiçekler suya ihtiyaç duymaz.', 'Komşulara yardım etmek gereksizdir.'], ex: 'Kerem ilk denemede başaramadı ama pes etmeyip düzeneği geliştirdi.' },
    { t: 'Göçmen Kuşlar', text: 'Leylekler her sonbaharda binlerce kilometre yol alarak sıcak ülkelere göç eder. Yolculuk sırasında sıcak hava akımlarını kullanarak az enerji harcarlar. İlkbaharda yeniden eski yuvalarına dönerler. Bilim insanları, leyleklerin yönlerini bulmak için Güneş’ten ve yer şekillerinden yararlandığını düşünmektedir.', img: 'bird', q: 'Leylekler yolculukta az enerji harcamak için neyi kullanır?', a: 'Sıcak hava akımlarını', w: ['Gemileri', 'Ağaç dallarını', 'Yağmur bulutlarını'], ex: 'Metinde “sıcak hava akımlarını kullanarak az enerji harcarlar” yazıyor.' },
    { t: 'Söz Hakkı', text: 'Sınıf başkanı seçimi öncesinde her aday, sınıfa yapmak istediklerini anlattı. Öğrenciler adayları dinledi, sorular sordu ve gizli oyla seçimlerini yaptı. Seçimi kaybeden Elif, kazanan arkadaşını tebrik etti ve ona yardım edeceğini söyledi.', img: 'trophy', q: 'Elif’in davranışı hangi değeri gösterir?', a: 'Demokratik olgunluk ve saygı', w: ['Kıskançlık', 'Bencillik', 'Umursamazlık'], ex: 'Elif sonuca saygı gösterip kazananı tebrik etti.' },
  ],
}

export const okumaHikayesi: Gen = (rng, grade, _l, history) => {
  const list = STORIES[grade]
  const used = new Set(history.map((h) => ('passage' in h && h.passage ? h.passage.title : '')))
  const s = pick(rng, list.filter((x) => !used.has(x.t)).length ? list.filter((x) => !used.has(x.t)) : list)
  return choice(rng, {
    prompt: s.q,
    correct: s.a,
    wrong: s.w,
    explain: s.ex,
    passage: { title: s.t, text: s.text, img: s.img },
    spoken: `${s.t}. ${s.text} Soru: ${s.q}`,
    layout: 'wide',
  })
}

/* ============================ KELİME HAZİNESİ ============================ */
const ZIT: [string, string][] = [
  ['büyük', 'küçük'], ['uzun', 'kısa'], ['sıcak', 'soğuk'], ['açık', 'kapalı'], ['hızlı', 'yavaş'], ['yeni', 'eski'], ['temiz', 'kirli'],
  ['dolu', 'boş'], ['ağır', 'hafif'], ['gece', 'gündüz'], ['kalın', 'ince'], ['tatlı', 'acı'], ['iyi', 'kötü'], ['ön', 'arka'],
  ['aşağı', 'yukarı'], ['erken', 'geç'], ['sert', 'yumuşak'], ['geniş', 'dar'], ['zengin', 'yoksul'], ['gelmek', 'gitmek'], ['güzel', 'çirkin'],
]
const ES: [string, string][] = [
  ['kırmızı', 'al'], ['siyah', 'kara'], ['beyaz', 'ak'], ['cevap', 'yanıt'], ['okul', 'mektep'], ['doktor', 'hekim'], ['hediye', 'armağan'],
  ['yaşlı', 'ihtiyar'], ['sınav', 'imtihan'], ['nehir', 'ırmak'], ['şehir', 'kent'], ['arkadaş', 'dost'], ['millet', 'ulus'], ['vatan', 'yurt'],
  ['misafir', 'konuk'], ['kelime', 'sözcük'], ['hatıra', 'anı'], ['akıl', 'us'], ['kuvvet', 'güç'], ['ödül', 'mükâfat'], ['örnek', 'misal'],
]
const ESSESLI: { w: string; s: string; a: string; wrong: string[] }[] = [
  { w: 'gül', s: 'Bahçede kırmızı bir gül açtı.', a: 'bir çiçek', wrong: ['gülmek eylemi', 'bir renk', 'bir meyve'] },
  { w: 'yüz', s: 'Sınıfımızda yüz kitap var.', a: 'bir sayı', wrong: ['surat', 'suda yüzmek', 'bir renk'] },
  { w: 'çay', s: 'Köyün yanından küçük bir çay akıyor.', a: 'küçük akarsu', wrong: ['bir içecek', 'bir bitki yaprağı', 'bir oyun'] },
  { w: 'dolu', s: 'Dün akşam şiddetli dolu yağdı.', a: 'buz taneleri hâlinde yağış', wrong: ['boş olmayan', 'bir oyun', 'bir meyve'] },
  { w: 'yaz', s: 'Bu yaz denize gideceğiz.', a: 'bir mevsim', wrong: ['yazmak eylemi', 'bir yön', 'bir hayvan'] },
  { w: 'at', s: 'Topu bana at, lütfen!', a: 'fırlatmak eylemi', wrong: ['bir hayvan', 'bir renk', 'bir sayı'] },
  { w: 'ekmek', s: 'Çiftçi tarlaya buğday ekmek için hazırlandı.', a: 'tohumu toprağa atmak', wrong: ['bir yiyecek', 'bir meslek', 'bir mevsim'] },
  { w: 'kır', s: 'Hafta sonu kırda piknik yaptık.', a: 'şehir dışındaki açık alan', wrong: ['kırmak eylemi', 'bir renk', 'bir sayı'] },
  { w: 'bin', s: 'Haydi, otobüse bin!', a: 'bir araca binmek eylemi', wrong: ['bir sayı', 'bir hayvan', 'bir renk'] },
  { w: 'ay', s: 'Bu ay okulda gezi yapacağız.', a: 'takvimdeki zaman dilimi', wrong: ['gök cismi', 'bir hayvan', 'bir meyve'] },
]

export const kelimeHazinesi: Gen = (rng, grade, level) => {
  const type = grade === 2 ? 'zit' : grade === 3 ? (rng() < 0.5 ? 'zit' : 'es') : pick(rng, ['zit', 'es', 'essesli'] as const)
  if (type === 'essesli') {
    const e = pick(rng, ESSESLI)
    return choice(rng, {
      prompt: `“${e.s}” cümlesinde “${e.w}” kelimesi hangi anlamda kullanılmıştır?`,
      correct: e.a,
      wrong: e.wrong,
      explain: `“${e.w}” eş sesli bir kelimedir: yazılışı aynı, anlamı farklıdır. Bu cümlede “${e.a}” anlamındadır.`,
      layout: 'wide',
    })
  }
  const list = type === 'zit' ? ZIT : ES
  const [a, b] = pick(rng, list)
  const flip = rng() < 0.5
  const q = flip ? b : a
  const ans = flip ? a : b
  const wrongs = shuffle(rng, list.flat().filter((x) => x !== q && x !== ans))
  return choice(rng, {
    prompt: type === 'zit' ? `“${q}” kelimesinin zıt anlamlısı hangisidir?` : `“${q}” kelimesinin eş anlamlısı hangisidir?`,
    correct: ans,
    wrong: wrongs,
    max: level === 1 ? 3 : 4,
    explain: type === 'zit' ? `“${q}” ile “${ans}” zıt anlamlıdır: anlamları birbirinin tersidir.` : `“${q}” ile “${ans}” eş anlamlıdır: farklı yazılır ama aynı anlama gelir.`,
  })
}

/* ============================ NOKTALAMA VE YAZIM ============================ */
const PUNCT_OPTS = ['.', '?', '!']
const punct = (g: (1 | 2 | 3 | 4)[], sentence: string, mark: '.' | '?' | '!', ex: string): BankItem => ({
  g,
  make: (rng) =>
    choice(rng, {
      prompt: `“${sentence} ___” Cümlenin sonuna hangi işaret gelir?`,
      correct: { label: mark },
      wrong: PUNCT_OPTS.filter((m) => m !== mark).map((m) => ({ label: m })),
      explain: ex,
      max: 3,
    }),
})
const NOKTALAMA: BankItem[] = [
  punct([1, 2], 'Anne lale al', '.', 'Bildirme cümlesinin sonuna nokta konur.'),
  punct([1, 2], 'Okan o ne', '?', 'Soru soran cümlenin sonuna soru işareti konur.'),
  punct([1, 2, 3], 'Ah, elim acıdı', '!', 'Acı, sevinç, şaşkınlık gibi duyguları anlatan cümlenin sonuna ünlem konur.'),
  punct([1, 2], 'Eda okula gitti', '.', 'Bildirme cümlesinin sonuna nokta konur.'),
  punct([1, 2, 3], 'Bu kalem senin mi', '?', 'Soru cümlesinin sonuna soru işareti konur.'),
  punct([2, 3, 4], 'Yaşasın, tatil başladı', '!', 'Sevinç bildiren cümlenin sonuna ünlem konur.'),
  punct([2, 3, 4], 'Yarın müzeye kimler gelecek', '?', 'Soru cümlesinin sonuna soru işareti konur.'),
  C([1, 2], 'Hangisi doğru yazılmıştır?', 'Ali okula gitti.', ['ali okula gitti.', 'Ali Okula gitti.'], 'Cümle büyük harfle başlar; kişi adları da büyük harfle başlar.'),
  C([1, 2], 'Hangisi doğru yazılmıştır?', 'Bu top senin mi?', ['Bu top seninmi?', 'Bu top senin mi.'], '“mı, mi, mu, mü” ayrı yazılır ve soru cümlesinin sonuna soru işareti konur.'),
  C([2, 3], 'Hangisi doğru yazılmıştır?', 'Yazın Antalya’ya gittik.', ['Yazın antalya’ya gittik.', 'Yazın Antalyaya gittik.'], 'Şehir adları büyük harfle başlar; özel isimlere gelen ekler kesme işaretiyle ayrılır.'),
  C([2, 3], 'Hangisi doğru yazılmıştır?', 'Pazardan elma, armut ve muz aldık.', ['Pazardan elma armut, ve muz aldık.', 'Pazardan elma. armut ve muz aldık.'], 'Sıralanan kelimeler virgülle ayrılır.'),
  C([2, 3, 4], 'Hangi kelimede kesme işareti doğru kullanılmıştır?', 'Ece’nin', ['okul’a', 'kalem’i'], 'Kesme işareti yalnızca özel isimlere gelen ekleri ayırır: Ece’nin. “okula, kalemi” yazılır.'),
  C([3, 4], 'Hangisinde iki nokta (:) doğru kullanılmıştır?', 'Çantamda şunlar var: kalem, silgi, defter.', ['Çantamda: şunlar var kalem, silgi, defter.', 'Çantamda şunlar var kalem: silgi, defter.'], 'Örnek ya da açıklama verilecek sözlerden önce iki nokta konur.'),
  C([3, 4], 'Hangisinde tırnak işareti doğru kullanılmıştır?', 'Öğretmenimiz “Kitap okumak ufkumuzu açar.” dedi.', ['Öğretmenimiz Kitap “okumak ufkumuzu” açar dedi.', '“Öğretmenimiz” Kitap okumak ufkumuzu açar dedi.'], 'Başkasından aynen aktarılan sözler tırnak içine alınır.'),
  C([3, 4], 'Hangisi doğru yazılmıştır?', 'Atatürk 19 Mayıs 1919’da Samsun’a çıktı.', ['atatürk 19 mayıs 1919’da samsun’a çıktı.', 'Atatürk 19 Mayıs 1919da Samsuna çıktı.'], 'Kişi ve yer adları ile belirli tarihlerdeki ay adları büyük harfle başlar; özel isimlere gelen ekler kesmeyle ayrılır.'),
  C([4], 'Hangi cümlede “de” doğru yazılmıştır?', 'Ben de seninle geleceğim.', ['Bende seninle geleceğim.', 'Ben-de seninle geleceğim.'], '“Da/de” bağlacı “dahi, bile” anlamı katar ve ayrı yazılır: Ben de geleceğim.'),
  C([4], 'Hangi cümlede “de” ek olarak doğru yazılmıştır?', 'Kitap masada duruyor.', ['Kitap masa da duruyor.', 'Kitap masa’da duruyor.'], 'Bulunma eki “-da/-de” kelimeye bitişik yazılır: masada.'),
  C([4], 'Hangisi doğru yazılmıştır?', 'Öyle yorgunum ki hemen uyuyacağım.', ['Öyle yorgunumki hemen uyuyacağım.', 'Öyle yorgunum-ki hemen uyuyacağım.'], 'Bağlaç olan “ki” ayrı yazılır.'),
]
export const noktalama: Gen = (rng, grade, level, history) => fromBank(NOKTALAMA, rng, grade, level, history)

/* ============================ ATASÖZÜ VE DEYİM ============================ */
const ATASOZU: [string, string, string[]][] = [
  ['Damlaya damlaya göl olur.', 'Küçük birikimler zamanla büyür.', ['Yağmur çok yağar.', 'Göller çabuk kurur.']],
  ['Ağaç yaşken eğilir.', 'İyi alışkanlıklar küçük yaşta kazanılır.', ['Ağaçlar rüzgârda eğilir.', 'Yaşlı ağaçlar kesilmelidir.']],
  ['Bugünün işini yarına bırakma.', 'Yapılacak işi ertelememeliyiz.', ['Yarın tatil yapmalıyız.', 'İşleri yavaş yapmalıyız.']],
  ['Birlikten kuvvet doğar.', 'Birlikte hareket edenler güçlü olur.', ['Tek başına çalışmak en iyisidir.', 'Kuvvetli olan her zaman kazanır.']],
  ['Tatlı dil yılanı deliğinden çıkarır.', 'Güzel söz en zor işi bile çözer.', ['Yılanlar tatlı sever.', 'Çok konuşmak zararlıdır.']],
  ['Sakla samanı, gelir zamanı.', 'Gereksiz görünen şeyler bir gün işe yarayabilir.', ['Samanı hayvanlara vermeliyiz.', 'Eski eşyalar atılmalıdır.']],
  ['Ayağını yorganına göre uzat.', 'Harcamalarını gelirine göre ayarla.', ['Uyurken yorgan örtülmelidir.', 'Ayakkabı numarası önemlidir.']],
  ['Komşu komşunun külüne muhtaçtır.', 'İnsanlar birbirine her zaman ihtiyaç duyar.', ['Komşular kül biriktirir.', 'Komşularla konuşmamalıyız.']],
  ['Acele işe şeytan karışır.', 'Aceleyle yapılan işte hata olur.', ['Hızlı olan her zaman kazanır.', 'İşleri geç bitirmek gerekir.']],
]
const DEYIM: [string, string, string[]][] = [
  ['kulak asmamak', 'söylenenleri önemsememek', ['dikkatle dinlemek', 'kulağı ağrımak']],
  ['göz atmak', 'kısaca bakmak', ['bir şeyi fırlatmak', 'gözünü kapatmak']],
  ['eli açık', 'cömert', ['eli boş', 'çok çalışkan']],
  ['ağzı kulaklarında', 'çok mutlu', ['çok yorgun', 'çok aç']],
  ['dili tutulmak', 'heyecandan konuşamamak', ['dil yarası olmak', 'çok konuşmak']],
  ['etekleri zil çalmak', 'çok sevinmek', ['dans etmek', 'korkmak']],
  ['kulağına küpe olmak', 'bir olaydan ders almak', ['küpe takmak', 'iyi duymak']],
  ['göz kulak olmak', 'korumak, gözetmek', ['uyumak', 'gözlük takmak']],
  ['pire için yorgan yakmak', 'küçük bir şey için büyük zarara girmek', ['yorgan temizlemek', 'çok üşümek']],
  ['burnu havada', 'kendini beğenmiş', ['nezle olmuş', 'çok mutlu']],
]
export const deyimAtasozu: Gen = (rng, grade, level) => {
  const useDeyim = grade === 4 && rng() < 0.55
  const [s, a, w] = pick(rng, useDeyim ? DEYIM : ATASOZU)
  const others = (useDeyim ? DEYIM : ATASOZU).filter((x) => x[0] !== s).map((x) => x[1])
  return choice(rng, {
    prompt: useDeyim ? `“${s}” deyiminin anlamı nedir?` : `“${s}” atasözü ne anlatır?`,
    correct: a,
    wrong: [...w, ...shuffle(rng, others).slice(0, 1)],
    max: level === 1 ? 3 : 4,
    layout: 'wide',
    explain: `${useDeyim ? 'Deyim' : 'Atasözü'}: “${s}” → ${a}.`,
  })
}

/* ============================ ANLAM DEDEKTİFİ ============================ */
const MECAZ: { w: string; mecaz: string; gercek: string[] }[] = [
  { w: 'tatlı', mecaz: 'Kardeşim çok tatlı bir çocuk.', gercek: ['Bu pasta çok tatlı.', 'Tatlı çilekleri yedik.'] },
  { w: 'sert', mecaz: 'Babam bana sert bir sesle seslendi.', gercek: ['Ceviz kabuğu çok serttir.', 'Bu taş çok sert.'] },
  { w: 'soğuk', mecaz: 'Yeni komşumuz bize çok soğuk davrandı.', gercek: ['Kışın hava çok soğuk olur.', 'Soğuk su içtim.'] },
  { w: 'kırılmak', mecaz: 'Arkadaşımın sözlerine çok kırıldım.', gercek: ['Bardak yere düşünce kırıldı.', 'Pencerenin camı kırıldı.'] },
  { w: 'ağır', mecaz: 'Ağır sözler insanı üzer.', gercek: ['Bu çanta çok ağır.', 'Ağır kutuyu birlikte taşıdık.'] },
  { w: 'parlak', mecaz: 'Elif çok parlak bir öğrencidir.', gercek: ['Güneş bugün çok parlak.', 'Parlak bir taş buldum.'] },
  { w: 'aydınlanmak', mecaz: 'Öğretmenimin anlatımıyla konu kafamda aydınlandı.', gercek: ['Sabah olunca oda aydınlandı.', 'Lamba yanınca salon aydınlandı.'] },
]
export const anlamDedektifi: Gen = (rng, grade) => {
  const m = pick(rng, MECAZ)
  const askMecaz = rng() < 0.6 || grade === 3
  if (askMecaz)
    return choice(rng, {
      prompt: `Hangi cümlede “${m.w}” kelimesi MECAZ (gerçek olmayan) anlamda kullanılmıştır?`,
      correct: m.mecaz,
      wrong: m.gercek,
      layout: 'wide',
      max: 3,
      explain: `“${m.mecaz}” cümlesinde “${m.w}” kelimesi gerçek anlamından uzaklaşmış, mecaz anlam kazanmıştır.`,
    })
  const g = pick(rng, m.gercek)
  return choice(rng, {
    prompt: `Hangi cümlede “${m.w}” kelimesi GERÇEK anlamıyla kullanılmıştır?`,
    correct: g,
    wrong: [m.mecaz, pick(rng, MECAZ.filter((x) => x.w !== m.w)).mecaz],
    layout: 'wide',
    max: 3,
    explain: `“${g}” cümlesinde kelime ilk ve temel anlamıyla, yani gerçek anlamıyla kullanılmıştır.`,
  })
}

