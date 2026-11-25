/**
 * 1. SINIF TÜRKÇE TEMALARI YOLU — Türkçe ders kitabının 5–8. temaları (ilk okuma-yazma kitabından sonra).
 * Her tema bir "ada": dinleme (metin ekranda yazmaz, sesli okunur), konuşma (selamlaşma, hitap, söz alma),
 * okuma (kısa özgün metinler, başlıktan tahmin) ve yazma (büyük harf, noktalama, boşluk, mı/mi, dikte, cümle kurma)
 * etkinlikleri + sonda 2 oyun.
 * Kaynak: docs/meb-kitaplar/analiz/turkce-1.md §2–§5; kazanımlar docs/meb/turkce-ek1-ogrenme-ciktilari.txt (1. sınıf).
 * Kitap metinleri kopyalanmadı; aynı konularda kısa, özgün metinler yazıldı.
 * 1. sınıf sınırları: eş/zıt anlam yok; cümleler çok kısa. Kişisel veri istenmez (ad, adres, telefon, okul yok).
 */
import { pick, shuffle } from '../../learning/rng'
import { input, order, type Gen } from './helpers'
import type { SortQ } from '../../games/quiz/types'
import { wordSearch } from './harfEtkinlik'
import { ch, dinle, fresh, img, karma, mem, mkChoice, mt, ord, pop, rot, srt, tf, type Alan, type Dinleme, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

/* ============================ yerel üreticiler ============================ */
/** Okuma metni + soruları (metin sorunun üstünde gösterilir) */
interface Metin {
  t: string
  text: string
  img: string
  qs: Q[]
}
const oku = (...ms: Metin[]): Gen => (rng, _g, l, h) => {
  const all = ms.flatMap((m) => m.qs.map((q) => ({ m, q })))
  const it = fresh(rng, all, h, (x) => x.q.q)
  return { ...mkChoice(rng, it.q, l), passage: { title: it.m.t, text: it.m.text, img: it.m.img } }
}
/** Resimli seçmeli soru: a ve w = [etiket, simge] */
const qi = (q: string, a: [string, string], w: [string, string][], ex: string, im?: string): Q => ({ q, a: a[0], w: w.map((x) => x[0]), ex, img: im, o: Object.fromEntries([a, ...w]) })
/** son birkaç soruda olmayan bir öğe seç (soru metni aynı kalan üreticiler için) */
function tazeOge<T>(rng: Parameters<Gen>[0], bank: T[], h: Parameters<Gen>[3], key: (t: T) => string, qkey: (q: Parameters<Gen>[3][number]) => string): T {
  const recent = new Set(h.slice(-Math.min(3, bank.length - 1)).map(qkey))
  const pool = bank.filter((x) => !recent.has(key(x)))
  return pick(rng, pool.length ? pool : bank)
}
const sirasi = (q: Parameters<Gen>[3][number]) => (q.type === 'order' ? q.pieces.join('|') : '')
/** Karışık sözcüklerden cümle kur (T.Y.1.3.a) */
const cumle = (bank: string[][], im?: string): Gen => (rng, _g, _l, h) => {
  const w = tazeOge(rng, bank, h, (x) => x.join('|'), sirasi)
  return order({ prompt: 'Sözcükleri sırala, cümle kur.', explain: `Doğru cümle: “${w.join(' ')}” Cümle büyük harfle başlar, noktayla biter.`, pieces: w, joiner: ' ', style: 'train', img: im })
}
/** Heceleri birleştirip sözcük kur */
const hece = (bank: string[][], im?: string): Gen => (rng, _g, _l, h) => {
  const w = tazeOge(rng, bank, h, (x) => x.join('|'), sirasi)
  return order({ prompt: 'Heceleri sırala, sözcüğü bul.', explain: `${w.join('-')}: “${w.join('')}”`, pieces: w, joiner: '', style: 'train', img: im })
}
/** Dikte: söylenen cümleyi sözcük kartlarıyla kur (cümle yazılmaz, sesli okunur) (T.Y.1.1.e) */
const dikteCumle = (bank: string[][]): Gen => (rng, _g, _l, h) => {
  const w = tazeOge(rng, bank, h, (x) => x.join('|'), sirasi)
  const s = w.join(' ')
  return order({ prompt: 'Dinle! Duyduğun cümleyi kur.', spoken: `Dinle: ${s} Bir daha: ${s} Şimdi cümleyi kur.`, explain: `Duyduğun cümle: “${s}”`, pieces: w, joiner: ' ', style: 'train' })
}
const ABC = 'abcçdefgğhıijklmnoöprsştuüvyz'.split('')
/** Dikte: söylenen sözcüğü harf tuşlarıyla yaz (T.Y.1.1.e). [sözcük, simge] — 1. seviyede resim ipucu gösterilir */
const dikte = (bank: [string, string][]): Gen => (rng, _g, l, h) => {
  const [w, im] = tazeOge(rng, bank, h, (x) => x[0], (q) => (q.type === 'input' ? q.answer : ''))
  const harf = [...new Set(w.split(''))]
  const ekstra = shuffle(rng, ABC.filter((c) => !harf.includes(c))).slice(0, l === 1 ? 2 : l === 2 ? 4 : 6)
  return input({ prompt: 'Dinle! Duyduğun sözcüğü yaz.', spoken: `Dinle ve yaz: ${w}. Bir daha: ${w}.`, answer: w, keys: shuffle(rng, [...harf, ...ekstra]), visual: l === 1 ? img(im) : undefined, explain: `“${w}” böyle yazılır: ${w.split('').join(' - ')}.` })
}
/** Görselden dinleme metni tahmini (T.D.1.2.c): soru aynı, resim değişir */
const tahmin = (bank: Q[]): Gen => (rng, _g, l, h) =>
  mkChoice(rng, tazeOge(rng, bank, h, (x) => x.img ?? '', (q) => (q.type === 'choice' && q.visual?.kind === 'image' ? q.visual.img : '')), l)
const TAHMIN_Q = 'Resme bak. Dinleyeceğimiz metin ne anlatıyor olabilir?'
/** Resimlerin ilk harflerinden sözcük (DK T6) */
interface Ilk {
  imgs: string[]
  adlar: string[]
  a: string
  w: string[]
}
const ilkHarf = (bank: Ilk[]): Gen => (rng, _g, l, h) => {
  const it = tazeOge(rng, bank, h, (x) => x.a, (q) => (q.type === 'choice' ? (q.options[q.answer]?.label ?? '') : ''))
  const base = mkChoice(rng, { q: 'Resimlerin adlarının ilk harflerini birleştir. Hangi sözcük çıkar?', a: it.a, w: it.w, ex: `${it.adlar.map((x) => `${x} → ${x[0]}`).join(', ')}: “${it.a}”` }, l)
  return { ...base, spoken: `${it.adlar.join(', ')}. Bu adların ilk harflerini birleştir. Hangi sözcük çıkar?`, visual: { kind: 'images', imgs: it.imgs } }
}
/** Kelime avı (en çok 7 harflik sözcükler) */
const avi = (words: string[], prompt: string): Gen => (rng) => wordSearch(rng, shuffle(rng, words).slice(0, 4), ABC, prompt)

const T = 6 // tur sayısı
const OYUN = 8

/* ---------------- ortak bankalar ---------------- */
const NOKTA = 'Nokta (.)'
const SORU = 'Soru işareti (?)'
const UNLEM = 'Ünlem (!)'
const VIRGUL = 'Virgül (,)'
const KESME = 'Kesme işareti (’)'

/* ================================================================================================
 * TEMA 5 · YETENEKLERİMİZİ KEŞFEDİYORUZ
 * ================================================================================================ */
const D5_BAHCE: Dinleme = {
  t: 'Bahçede Oyun Saati',
  img: 'ball',
  text: 'Teneffüs zili çaldı. Çocuklar bahçeye koştu. Ece ile Mert seksek oynadı. Elif ip atladı. Sonra hep birlikte saklambaç oynadılar. Herkes çok eğlendi.',
  qs: [
    { q: 'Ece ile Mert hangi oyunu oynadı?', a: 'Seksek', w: ['Saklambaç', 'Körebe', 'İp atlama'], ex: 'Ece ile Mert seksek oynadı.' },
    { q: 'Elif ne yaptı?', a: 'İp atladı', w: ['Resim yaptı', 'Kitap okudu', 'Uyudu'], ex: 'Elif bahçede ip atladı.' },
    { q: 'Bu metin ne anlatıyor?', a: 'Çocukların oyunlarını', w: ['Bir hayvanı', 'Yağmurlu bir günü', 'Bir yemeği'], ex: 'Metin, çocukların bahçedeki oyunlarını anlatıyor.' },
    { q: 'Çocuklar en son hangi oyunu oynadı?', a: 'Saklambaç', w: ['Seksek', 'Körebe', 'Yakan top'], ex: 'En son hep birlikte saklambaç oynadılar.' },
    qi('Çocuklar nereye koştu?', ['Bahçeye', 'tree'], [['Eve', 'house'], ['Markete', 'store'], ['Otobüse', 'bus']], 'Zil çalınca çocuklar bahçeye koştu.'),
  ],
}
const D5_UCURTMA: Dinleme = {
  t: 'Rüzgârlı Gün',
  img: 'kite',
  text: 'Rüzgârlı bir gündü. Ayşe ile kardeşi tepeye çıktı. Kırmızı uçurtmalarını rüzgâra bıraktılar. Uçurtma kuşlar gibi yükseldi. İkisi de sevinçle el salladı.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Uçurtma uçurmak', w: ['Denizde yüzmek', 'Kek yapmak', 'Ders çalışmak'], ex: 'Ayşe ile kardeşi uçurtma uçurdu.' },
    { q: 'Uçurtma ne renkti?', a: 'Kırmızı', w: ['Mavi', 'Yeşil', 'Sarı'], ex: 'Kırmızı uçurtmalarını rüzgâra bıraktılar.' },
    qi('Ayşe ile kardeşi nereye çıktı?', ['Tepeye', 'mountain'], [['Denize', 'wave'], ['Okula', 'school'], ['Eve', 'house']], 'İkisi tepeye çıktı.'),
    { q: 'Uçurtma neler gibi yükseldi?', a: 'Kuşlar gibi', w: ['Balıklar gibi', 'Taşlar gibi', 'Kediler gibi'], ex: 'Uçurtma kuşlar gibi yükseldi.' },
  ],
}
const D5_KEMAN: Dinleme = {
  t: 'Sahnedeki Keman',
  img: 'violin',
  text: 'Ada sahneye çıktı. Kemanını çenesine yerleştirdi. Güzel bir ezgi çaldı. Salondaki herkes onu alkışladı. Ada çok mutluydu.',
  qs: [
    { q: 'Ada sahneye çıkmadan önce ne yapmış olabilir?', a: 'Keman çalışmış', w: ['Hiç çalışmamış', 'Kemanını kaybetmiş', 'Bütün gün uyumuş'], ex: 'Güzel çalabilmek için önceden çok çalışmış olmalı.' },
    qi('Ada sahnede ne çaldı?', ['Keman', 'violin'], [['Davul', 'drum'], ['Gitar', 'guitar'], ['Zil', 'bell']], 'Ada sahnede keman çaldı.'),
    { q: 'Ada neden mutluydu?', a: 'Herkes onu alkışladı', w: ['Kemanı kırıldı', 'Salon boştu', 'Sahneye çıkamadı'], ex: 'Salondaki herkes Ada’yı alkışladı.' },
  ],
}
const D5_SERGI: Dinleme = {
  t: 'Sergi Günü',
  img: 'palette',
  text: 'Şirin okulda bir resim sergisi açtı. Duvarda rengârenk kuş resimleri vardı. Arkadaşları resimlere hayranlıkla baktı. Öğretmeni Şirin’i kutladı.',
  qs: [
    { q: 'Sergiden önce Şirin ne yapmış olabilir?', a: 'Kuş resimleri çizmiş', w: ['Top oynamış', 'Yemek pişirmiş', 'Uyumuş'], ex: 'Sergi açmak için önce resimleri çizmiş olmalı.' },
    { q: 'Şirin resimleri çizmeden önce ne yapmış olabilir?', a: 'Kuşları izlemiş', w: ['Balık tutmuş', 'Şarkı söylemiş', 'Bisiklete binmiş'], ex: 'Kuş resmi yapan biri önce kuşları dikkatle izler.' },
    qi('Duvarda hangi resimler vardı?', ['Kuş resimleri', 'bird'], [['Kedi resimleri', 'cat'], ['Araba resimleri', 'car'], ['Balık resimleri', 'fish']], 'Duvarda rengârenk kuş resimleri vardı.'),
    { q: 'Şirin’i kim kutladı?', a: 'Öğretmeni', w: ['Komşusu', 'Doktoru', 'Kimse'], ex: 'Öğretmeni Şirin’i kutladı.' },
  ],
}
const TAHMIN5: Q[] = [
  qi(TAHMIN_Q, ['Uçurtma uçurmayı', 'kite'], [['Yüzmeyi', 'wave'], ['Yemek yapmayı', 'cook'], ['Uyumayı', 'bed']], 'Resimde uçurtma var. Metin uçurtma uçurmayı anlatıyor olabilir.', 'kite'),
  qi(TAHMIN_Q, ['Resim yapmayı', 'palette'], [['Top oynamayı', 'ball'], ['Uçağa binmeyi', 'airplane'], ['Uyumayı', 'bed']], 'Resimde boya paleti var. Metin resim yapmayı anlatıyor olabilir.', 'palette'),
  qi(TAHMIN_Q, ['Müzik yapmayı', 'guitar'], [['Ders çalışmayı', 'notebook'], ['Yemek yemeyi', 'forkplate'], ['Koşmayı', 'running']], 'Resimde gitar var. Metin müzik yapmayı anlatıyor olabilir.', 'guitar'),
  qi(TAHMIN_Q, ['Top oynamayı', 'ball'], [['Kitap okumayı', 'book'], ['Resim yapmayı', 'palette'], ['Uyumayı', 'bed']], 'Resimde top var. Metin top oynamayı anlatıyor olabilir.', 'ball'),
  qi(TAHMIN_Q, ['Kitap okumayı', 'openbook'], [['Yüzmeyi', 'wave'], ['Top oynamayı', 'ball'], ['Uçurtma uçurmayı', 'kite']], 'Resimde açık bir kitap var. Metin kitap okumayı anlatıyor olabilir.', 'openbook'),
  qi(TAHMIN_Q, ['Sahnede gösteri yapmayı', 'theater'], [['Bahçe sulamayı', 'droplet'], ['Alışveriş yapmayı', 'cart'], ['Diş fırçalamayı', 'toothbrush']], 'Resimde tiyatro maskeleri var. Metin bir gösteriyi anlatıyor olabilir.', 'theater'),
]
const SELAM5: Q[] = [
  { q: 'Sabah sınıfa girdin. Öğretmenine ne dersin?', a: 'Günaydın öğretmenim', w: ['Hey sen', 'Çekil', 'Hiçbir şey demem'], ex: 'Sabah “Günaydın öğretmenim.” diyerek selam veririz.', img: 'teacher' },
  { q: 'Yeni bir arkadaşla tanıştın. Ne dersin?', a: 'Merhaba, tanıştığıma sevindim', w: ['Git buradan', 'Sana ne', 'Sus'], ex: 'Tanışırken “Merhaba.” der, gülümseriz.', img: 'handshake' },
  { q: 'Kendini tanıtırken ne söyleyebilirsin?', a: 'Ben resim yapmayı severim', w: ['Ev adresim şurası', 'Telefon numaram şu', 'Hiç konuşmam'], ex: 'Kendimizi tanıtırken neyi sevdiğimizi anlatırız. Adres ve telefon gibi bilgileri paylaşmayız.', img: 'palette' },
  { q: 'Okuldan çıkarken arkadaşına ne dersin?', a: 'Hoşça kal, yarın görüşürüz', w: ['Günaydın', 'Afiyet olsun', 'Hoş geldin'], ex: 'Ayrılırken “Hoşça kal.” deriz.', img: 'wave2' },
  { q: 'Sahneye çıktın. Dinleyenlere ilk ne dersin?', a: 'Merhaba arkadaşlar', w: ['Hoşça kalın', 'İyi geceler', 'Afiyet olsun'], ex: 'Konuşmaya selamla başlarız: “Merhaba arkadaşlar.”', img: 'microphone' },
  { q: 'Komşu teyzeyle karşılaştın. Ne dersin?', a: 'Merhaba teyzeciğim', w: ['Çekil yolumdan', 'Ne bakıyorsun', 'Hiçbir şey demem'], ex: 'Büyüklerimize selam verir, “teyzeciğim” gibi sevgiyle sesleniriz.', img: 'woman' },
]
const SOZ5_TF: TF[] = [
  ['Arkadaşım konuşurken sözünü keserim.', false, 'Arkadaşımızın sözünü bitirmesini bekleriz.'],
  ['Söz almak için parmak kaldırırım.', true, 'Parmak kaldırıp sıramızı bekleriz.'],
  ['Sınıfta herkes aynı anda bağırarak konuşur.', false, 'Sırayla ve duyulacak bir sesle konuşuruz.'],
  ['Sıram gelince konuşurum.', true, 'Sırası gelen konuşur, diğerleri dinler.'],
  ['Konuşurken dinleyenlerin yüzüne bakarım.', true, 'Konuşurken göz teması kurarız.'],
  ['Arkadaşım anlatırken başka yere koşarım.', false, 'Anlatan arkadaşımızı dikkatle dinleriz.'],
]
const YETENEK: Metin = {
  t: 'Herkesin Bir Yeteneği Var',
  img: 'star',
  text: 'Sınıfta herkes farklıdır. Ali güzel resim yapar. Ela şarkı söyler. Can hızlı koşar. Zeynep bilmece bilir. Her çocuk bir şeyi iyi yapar.',
  qs: [
    qi('Ali ne yapar?', ['Resim yapar', 'palette'], [['Şarkı söyler', 'music'], ['Hızlı koşar', 'running'], ['Bilmece bilir', 'thinking']], 'Ali güzel resim yapar.'),
    qi('Ela ne yapar?', ['Şarkı söyler', 'music'], [['Resim yapar', 'palette'], ['Hızlı koşar', 'running'], ['Bilmece bilir', 'thinking']], 'Ela şarkı söyler.'),
    qi('Kim hızlı koşar?', ['Can', 'running'], [['Ali', 'palette'], ['Ela', 'music'], ['Zeynep', 'thinking']], 'Can hızlı koşar.'),
    { q: 'Bu metnin konusu ne?', a: 'Herkesin yeteneği farklıdır', w: ['Okulun bahçesi', 'Bir yemek tarifi', 'Yağmurlu bir gün'], ex: 'Metin, her çocuğun farklı bir yeteneği olduğunu anlatıyor.' },
    { q: 'Zeynep ne bilir?', a: 'Bilmece', w: ['Masal', 'Yemek', 'Oyun'], ex: 'Zeynep bilmece bilir.' },
  ],
}
const HAYAL: Metin = {
  t: 'Ne Olacağım?',
  img: 'thinking',
  text: 'Ege yatağında hayal kurdu. Önce pilot oldu, gökte uçtu. Sonra aşçı oldu, çorba pişirdi. En sonunda doktor oldu, hastalara baktı. Babası “Hayal kurmak güzeldir.” dedi.',
  qs: [
    qi('Ege önce ne oldu?', ['Pilot', 'airplane'], [['Aşçı', 'cook'], ['Doktor', 'doctor'], ['Öğretmen', 'teacher']], 'Ege önce pilot oldu.'),
    qi('Ege en sonunda ne oldu?', ['Doktor', 'doctor'], [['Pilot', 'airplane'], ['Aşçı', 'cook'], ['Çiftçi', 'farmer']], 'En sonunda doktor oldu.'),
    { q: 'Ege nerede hayal kurdu?', a: 'Yatağında', w: ['Bahçede', 'Okulda', 'Parkta'], ex: 'Ege yatağında hayal kurdu.' },
    { q: 'Babası ne dedi?', a: 'Hayal kurmak güzeldir', w: ['Hemen uyu', 'Pilot ol', 'Çorba pişir'], ex: 'Babası “Hayal kurmak güzeldir.” dedi.' },
    { q: 'Bu metin ne anlatıyor?', a: 'Ege’nin hayallerini', w: ['Ege’nin okulunu', 'Bir uçak yolculuğunu', 'Bir yemek tarifini'], ex: 'Metin, Ege’nin ne olacağını hayal etmesini anlatıyor.' },
  ],
}
const BASLIK5: Q[] = [
  qi('“Uçurtma Şenliği” adlı metin ne anlatır?', ['Uçurtma uçurmayı', 'kite'], [['Balık tutmayı', 'fish'], ['Kek yapmayı', 'cake'], ['Uyumayı', 'bed']], 'Başlık ve resim bize konuyu söyler: uçurtma.', 'kite'),
  qi('“Minik Ressam” adlı metin ne anlatır?', ['Resim yapan bir çocuğu', 'palette'], [['Uzaya giden bir roketi', 'rocket'], ['Bir futbol maçını', 'ball'], ['Bir trenle yolculuğu', 'train']], 'Ressam resim yapan kişidir.', 'artist'),
  qi('“Davulcu Kardeşim” adlı metin ne anlatır?', ['Davul çalan bir kardeşi', 'drum'], [['Kitap okuyan bir dedeyi', 'book'], ['Uçan bir kuşu', 'bird'], ['Yüzen bir balığı', 'fish']], 'Başlıkta “davulcu” sözcüğü var.', 'drum'),
  qi('“Koşu Yarışı” adlı metin ne anlatır?', ['Koşan çocukları', 'running'], [['Uyuyan bir kediyi', 'cat'], ['Yağan karı', 'snowflake'], ['Bir doğum gününü', 'cake']], 'Başlık bir yarışı anlatıyor.', 'medal'),
  qi('“Şarkı Söyleyen Kız” adlı metin ne anlatır?', ['Şarkı söyleyen bir kızı', 'music'], [['Bisiklete binen bir kızı', 'bicycle'], ['Kek yapan bir kızı', 'cake'], ['Uyuyan bir kızı', 'bed']], 'Başlık metnin konusunu söyler.', 'microphone'),
]
const OYUN5_Q: Q[] = [
  { q: 'Tek ayak üstünde zıplanır, taşla oynanır. Bu hangi oyun?', a: 'Seksek', w: ['Saklambaç', 'Körebe', 'Yakan top'], ex: 'Seksekte çizgilere taş atar, tek ayakla zıplarız.' },
  { q: 'Biri gözlerini kapatıp sayar, diğerleri saklanır. Bu hangi oyun?', a: 'Saklambaç', w: ['Seksek', 'İp atlama', 'Yakan top'], ex: 'Saklambaçta ebe sayar, diğerleri saklanır.' },
  { q: 'Ebenin gözleri bağlanır, arkadaşlarını yakalamaya çalışır. Bu hangi oyun?', a: 'Körebe', w: ['Seksek', 'Saklambaç', 'İp atlama'], ex: 'Körebede ebenin gözleri kapalıdır.' },
  { q: 'İki kişi ipi çevirir, biri üstünden atlar. Bu hangi oyun?', a: 'İp atlama', w: ['Körebe', 'Seksek', 'Saklambaç'], ex: 'İp atlamada ip dönerken zıplarız.' },
  qi('Rüzgârda gökyüzüne uçurulur, ipi elimizde tutarız. Bu nedir?', ['Uçurtma', 'kite'], [['Balon', 'balloon'], ['Top', 'ball'], ['Kuş', 'bird']], 'Uçurtmayı rüzgârda uçururuz.'),
  { q: 'Topu atıp karşı takımdakileri vurmaya çalışırız. Bu hangi oyun?', a: 'Yakan top', w: ['Körebe', 'Seksek', 'İp atlama'], ex: 'Yakan topta top değen oyuncu oyundan çıkar.' },
]
const HECE5_Q: Q[] = [
  { q: '“çiçek” sözcüğü kaç hecelidir?', a: '2', w: ['1', '3', '4'], ex: 'çi-çek: 2 hece.', img: 'flower' },
  { q: '“kuş” sözcüğü kaç hecelidir?', a: '1', w: ['2', '3', '4'], ex: 'kuş: 1 hece.', img: 'bird' },
  { q: '“uçurtma” sözcüğü kaç hecelidir?', a: '3', w: ['1', '2', '4'], ex: 'u-çurt-ma: 3 hece.', img: 'kite' },
  { q: '“çiçek” sözcüğünde kaç harf var?', a: '5', w: ['3', '4', '6'], ex: 'ç-i-ç-e-k: 5 harf.', img: 'flower' },
  { q: '“top” sözcüğünde kaç harf var?', a: '3', w: ['2', '4', '5'], ex: 't-o-p: 3 harf.', img: 'ball' },
  { q: '“resim” sözcüğü kaç hecelidir?', a: '2', w: ['1', '3', '4'], ex: 're-sim: 2 hece.', img: 'palette' },
  { q: '“kalem” sözcüğünde kaç harf var?', a: '5', w: ['3', '4', '6'], ex: 'k-a-l-e-m: 5 harf.', img: 'pencil' },
  { q: '“davul” sözcüğü kaç hecelidir?', a: '2', w: ['1', '3', '4'], ex: 'da-vul: 2 hece.', img: 'drum' },
]
const HECE5: string[][] = [['re', 'sim'], ['u', 'çurt', 'ma'], ['şar', 'kı'], ['ke', 'man'], ['gi', 'tar'], ['sak', 'lam', 'baç'], ['ki', 'tap'], ['da', 'vul']]
const HECE5_BINS: SortQ['bins'] = [
  { id: 'bir', label: '1 hece', color: '#3b82f6' },
  { id: 'iki', label: '2 hece', color: '#f97316' },
]
const HECE5_ITEMS: SortQ['items'] = [
  { label: 'kuş', img: 'bird', bin: 'bir' },
  { label: 'top', img: 'ball', bin: 'bir' },
  { label: 'göz', img: 'eye', bin: 'bir' },
  { label: 'süt', img: 'milk', bin: 'bir' },
  { label: 'ay', img: 'moon', bin: 'bir' },
  { label: 'el', img: 'hand', bin: 'bir' },
  { label: 'kedi', img: 'cat', bin: 'iki' },
  { label: 'elma', img: 'apple', bin: 'iki' },
  { label: 'kitap', img: 'book', bin: 'iki' },
  { label: 'balon', img: 'balloon', bin: 'iki' },
  { label: 'davul', img: 'drum', bin: 'iki' },
  { label: 'çiçek', img: 'flower', bin: 'iki' },
]
const T5_O: O[] = [
  { q: 'Ege’nin hayallerini sırala.', s: ['Pilot oldu', 'Aşçı oldu', 'Doktor oldu'], ex: 'Önce pilot, sonra aşçı, en sonunda doktor.', img: 'thinking' },
  { q: 'Uçurtma gününü sırala.', s: ['Tepeye çıktılar', 'Uçurtmayı bıraktılar', 'Uçurtma yükseldi', 'El salladılar'], ex: 'Olaylar bu sırayla oldu.', img: 'kite' },
  { q: 'Şirin’in sergisini sırala.', s: ['Kuşları izledi', 'Resimleri çizdi', 'Duvara astı', 'Sergiyi açtı'], ex: 'Önce izledi, sonra çizdi, en sonunda sergiyi açtı.', img: 'palette' },
  { q: 'Bahçedeki oyunu sırala.', s: ['Zil çaldı', 'Bahçeye koştular', 'Seksek oynadılar', 'Saklambaç oynadılar'], ex: 'Olaylar bu sırayla oldu.', img: 'ball' },
]
const T5_C: string[][] = [
  ['Ali', 'güzel', 'resim', 'yapar.'],
  ['Ela', 'sahnede', 'şarkı', 'söyledi.'],
  ['Kardeşim', 'uçurtma', 'uçurdu.'],
  ['Her', 'çocuğun', 'bir', 'yeteneği', 'var.'],
  ['Biz', 'bahçede', 'seksek', 'oynadık.'],
  ['Can', 'çok', 'hızlı', 'koşar.'],
]
const BOSLUK5: Q[] = [
  qi('Ayşe gökyüzüne ___ uçurdu.', ['uçurtma', 'kite'], [['balık', 'fish'], ['kitap', 'book'], ['elma', 'apple']], 'Ayşe gökyüzüne uçurtma uçurdu.'),
  qi('Şirin fırçayla güzel bir ___ yaptı.', ['resim', 'palette'], [['top', 'ball'], ['süt', 'milk'], ['kedi', 'cat']], 'Fırçayla resim yapılır.'),
  qi('Can sahnede ___ çaldı.', ['gitar', 'guitar'], [['elma', 'apple'], ['kedi', 'cat'], ['şemsiye', 'umbrella']], 'Gitar çalınır.'),
  qi('Elif kütüphaneden bir ___ aldı.', ['kitap', 'book'], [['balık', 'fish'], ['bulut', 'cloud'], ['ayakkabı', 'shoe']], 'Kütüphaneden kitap alınır.'),
  qi('Mert bahçede ___ oynadı.', ['top', 'ball'], [['süt', 'milk'], ['kalem', 'pencil'], ['ekmek', 'bread']], 'Mert bahçede top oynadı.'),
  qi('Ada sahnede ___ çaldı.', ['keman', 'violin'], [['çorba', 'bowl'], ['kek', 'cake'], ['yaprak', 'leaf']], 'Keman bir müzik aletidir.'),
]
const YAZIM5: Q[] = [
  { q: '“ali resim yaptı” Doğru yazılışı hangisi?', a: 'Ali resim yaptı.', w: ['ali resim yaptı.', 'Ali resim yaptı', 'ali Resim yaptı.'], ex: 'Cümle büyük harfle başlar, noktayla biter.' },
  { q: '“ela şarkı söyledi” Doğru yazılışı hangisi?', a: 'Ela şarkı söyledi.', w: ['ela şarkı söyledi.', 'Ela şarkı söyledi', 'ela Şarkı söyledi'], ex: 'Cümle büyük harfle başlar, sonuna nokta konur.' },
  { q: '“bugün seksek oynadık” Doğru yazılışı hangisi?', a: 'Bugün seksek oynadık.', w: ['bugün seksek oynadık.', 'Bugün seksek oynadık', 'bugün Seksek oynadık.'], ex: 'Cümlenin ilk harfi büyük yazılır, sonuna nokta konur.' },
  { q: '“can hızlı koşar” Doğru yazılışı hangisi?', a: 'Can hızlı koşar.', w: ['can hızlı koşar.', 'Can hızlı koşar', 'can Hızlı koşar.'], ex: 'Cümle büyük harfle başlar, noktayla biter.' },
  { q: '“kuşlar uçtu” Doğru yazılışı hangisi?', a: 'Kuşlar uçtu.', w: ['kuşlar uçtu.', 'Kuşlar uçtu', 'kuşlar Uçtu.'], ex: 'Cümle büyük harfle başlar, noktayla biter.' },
  { q: '“uçurtmam yükseldi” Doğru yazılışı hangisi?', a: 'Uçurtmam yükseldi.', w: ['uçurtmam yükseldi.', 'Uçurtmam yükseldi', 'uçurtmam Yükseldi.'], ex: 'Cümle büyük harfle başlar, noktayla biter.' },
]
const MEM5: P[] = [
  ['uçurtma', 'Uçurtma', undefined, 'kite'],
  ['gitar', 'Gitar', undefined, 'guitar'],
  ['davul', 'Davul', undefined, 'drum'],
  ['palet', 'Palet', undefined, 'palette'],
  ['top', 'Top', undefined, 'ball'],
  ['keman', 'Keman', undefined, 'violin'],
]
const IKI_HECE = ['kedi', 'elma', 'kitap', 'balon', 'davul', 'gitar', 'çiçek']
const BIR_HECE = ['kuş', 'top', 'göz', 'süt', 'ay']
const HECE_IMG: Record<string, string> = { kedi: 'cat', elma: 'apple', kitap: 'book', balon: 'balloon', davul: 'drum', gitar: 'guitar', çiçek: 'flower', kuş: 'bird', top: 'ball', göz: 'eye', süt: 'milk', ay: 'moon' }

/* ================================================================================================
 * TEMA 6 · MİNİK KÂŞİFLER
 * ================================================================================================ */
const D6_BISIKLET: Dinleme = {
  t: 'Bisiklet Şenliği',
  img: 'bicycle',
  text: 'Parkta bisiklet şenliği vardı. Arda’nın bisikleti tek tekerlekliydi. Selin’in bisikleti kırmızı ve büyüktü. Efe’nin bisikleti küçük ve maviydi. Hepsi sırayla yarıştı.',
  qs: [
    { q: 'Kimin bisikleti tek tekerlekliydi?', a: 'Arda’nın', w: ['Selin’in', 'Efe’nin', 'Öğretmenin'], ex: 'Arda’nın bisikleti tek tekerlekliydi.' },
    { q: 'Selin’in bisikleti ne renkti?', a: 'Kırmızı', w: ['Mavi', 'Yeşil', 'Sarı'], ex: 'Selin’in bisikleti kırmızı ve büyüktü.' },
    { q: 'Hangi bisiklet küçüktü?', a: 'Efe’nin bisikleti', w: ['Selin’in bisikleti', 'Arda’nın bisikleti', 'Hiçbiri'], ex: 'Efe’nin bisikleti küçük ve maviydi.' },
    { q: 'Büyük ve kırmızı bisiklet kimindi?', a: 'Selin’in', w: ['Efe’nin', 'Arda’nın', 'Babasının'], ex: 'Büyük ve kırmızı bisiklet Selin’indi.' },
    { q: 'Efe’nin bisikleti ne renkti?', a: 'Mavi', w: ['Kırmızı', 'Mor', 'Turuncu'], ex: 'Efe’nin bisikleti maviydi.' },
  ],
}
const D6_TAS: Dinleme = {
  t: 'Taş Kutusu',
  img: 'rock',
  text: 'Zeynep dere kenarında taş topladı. Bazı taşlar büyük ve ağırdı. Bazıları küçük ve hafifti. Beyaz taşları bir kutuya koydu. Gri taşları başka bir kutuya koydu.',
  qs: [
    { q: 'Zeynep taşları neye göre iki kutuya ayırdı?', a: 'Rengine göre', w: ['Kokusuna göre', 'Sesine göre', 'Adına göre'], ex: 'Beyazları bir kutuya, grileri başka kutuya koydu: rengine göre.' },
    { q: 'Büyük taşlar nasıldı?', a: 'Ağır', w: ['Hafif', 'Yumuşak', 'Sıcak'], ex: 'Büyük taşlar ağırdı.' },
    { q: 'Küçük taşlar nasıldı?', a: 'Hafif', w: ['Ağır', 'Islak', 'Sıcak'], ex: 'Küçük taşlar hafifti.' },
    qi('Zeynep taşları nerede topladı?', ['Dere kenarında', 'droplet'], [['Okulda', 'school'], ['Mutfakta', 'cook'], ['Uçakta', 'airplane']], 'Zeynep dere kenarında taş topladı.'),
  ],
}
const D6_BUYUTEC: Dinleme = {
  t: 'Büyüteçle Bahçede',
  img: 'magnifier',
  text: 'Ece ile abisi bahçeye çıktı. Ellerinde bir büyüteç vardı. Önce bir uğur böceğine baktılar. Sonra bir yaprağı incelediler. Büyüteçle her şey kocaman göründü.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Büyüteçle bahçeyi incelemek', w: ['Bahçeyi sulamak', 'Top oynamak', 'Ağaç dikmek'], ex: 'Ece ile abisi büyüteçle böcek ve yaprak inceledi.' },
    qi('Önce neye baktılar?', ['Uğur böceğine', 'ladybug'], [['Kelebeğe', 'butterfly'], ['Karıncaya', 'ant'], ['Arıya', 'bee']], 'Önce bir uğur böceğine baktılar.'),
    { q: 'Büyüteçle her şey nasıl göründü?', a: 'Kocaman', w: ['Minicik', 'Kapkara', 'Bulanık'], ex: 'Büyüteç küçük şeyleri büyük gösterir.' },
    qi('Ellerinde ne vardı?', ['Büyüteç', 'magnifier'], [['Teleskop', 'telescope'], ['Kamera', 'camera'], ['Makas', 'scissors']], 'Ellerinde bir büyüteç vardı.'),
  ],
}
const D6_GECE: Dinleme = {
  t: 'Gökyüzü Gecesi',
  img: 'telescope',
  text: 'Akşam olunca aile bahçeye çıktı. Babası teleskobu kurdu. Ay kocaman ve parlaktı. Çocuklar yıldızları saydı. Gökyüzünü izlemek çok güzeldi.',
  qs: [
    { q: 'Bu metin ne anlatıyor?', a: 'Gökyüzünü izlemeyi', w: ['Denizde yüzmeyi', 'Kek yapmayı', 'Okula gitmeyi'], ex: 'Aile teleskopla gökyüzünü izledi.' },
    qi('Babası neyi kurdu?', ['Teleskobu', 'telescope'], [['Çadırı', 'camping'], ['Masayı', 'forkplate'], ['Salıncağı', 'tree']], 'Babası teleskobu kurdu.'),
    { q: 'Ay nasıldı?', a: 'Kocaman ve parlak', w: ['Küçük ve soluk', 'Hiç yoktu', 'Kırmızı'], ex: 'Ay kocaman ve parlaktı.' },
    qi('Çocuklar neyi saydı?', ['Yıldızları', 'star'], [['Kuşları', 'bird'], ['Ağaçları', 'tree'], ['Bulutları', 'cloud']], 'Çocuklar yıldızları saydı.'),
  ],
}
const SERT_BINS: SortQ['bins'] = [
  { id: 'yumusak', label: 'Yumuşak', img: 'teddy', color: '#ec4899' },
  { id: 'sert', label: 'Sert', img: 'rock', color: '#64748b' },
]
const SERT_ITEMS: SortQ['items'] = [
  { label: 'Oyuncak ayı', img: 'teddy', bin: 'yumusak' },
  { label: 'Sünger', img: 'sponge', bin: 'yumusak' },
  { label: 'Tişört', img: 'tshirt', bin: 'yumusak' },
  { label: 'Eldiven', img: 'gloves', bin: 'yumusak' },
  { label: 'Ekmek içi', img: 'bread', bin: 'yumusak' },
  { label: 'Taş', img: 'rock', bin: 'sert' },
  { label: 'Odun', img: 'wood', bin: 'sert' },
  { label: 'Anahtar', img: 'key', bin: 'sert' },
  { label: 'Bardak', img: 'glass', bin: 'sert' },
  { label: 'Kaya', img: 'stone', bin: 'sert' },
]
const TAHMIN6: Q[] = [
  qi(TAHMIN_Q, ['Gökyüzünü izlemeyi', 'star'], [['Yüzmeyi', 'wave'], ['Yemek yapmayı', 'cook'], ['Top oynamayı', 'ball']], 'Resimde teleskop var. Metin gökyüzünü izlemeyi anlatıyor olabilir.', 'telescope'),
  qi(TAHMIN_Q, ['Böcekleri incelemeyi', 'ladybug'], [['Uçağa binmeyi', 'airplane'], ['Şarkı söylemeyi', 'music'], ['Uyumayı', 'bed']], 'Resimde büyüteç var. Metin küçük canlıları incelemeyi anlatıyor olabilir.', 'magnifier'),
  qi(TAHMIN_Q, ['Uzaya gitmeyi', 'planet'], [['Bahçe sulamayı', 'droplet'], ['Alışverişi', 'cart'], ['Diş fırçalamayı', 'toothbrush']], 'Resimde roket var. Metin uzay yolculuğunu anlatıyor olabilir.', 'rocket'),
  qi(TAHMIN_Q, ['Bisiklet yarışını', 'bicycle'], [['Kitap okumayı', 'book'], ['Kek yapmayı', 'cake'], ['Uyumayı', 'bed']], 'Resimde bisiklet var. Metin bisiklet yarışını anlatıyor olabilir.', 'bicycle'),
  qi(TAHMIN_Q, ['Robot yapmayı', 'gear'], [['Balık tutmayı', 'fish'], ['Çiçek dikmeyi', 'flower'], ['Uyumayı', 'bed']], 'Resimde robot var. Metin robot yapmayı anlatıyor olabilir.', 'robot'),
  qi(TAHMIN_Q, ['Deniz canlılarını', 'fish'], [['Çöldeki kumları', 'desert'], ['Karlı dağları', 'snowflake'], ['Uzaydaki yıldızları', 'star']], 'Resimde balina var. Metin denizdeki canlıları anlatıyor olabilir.', 'whale'),
]
const SELAM6: Q[] = [
  { q: 'Şenlikte bir görevli sana yardım etti. Ne dersin?', a: 'Teşekkür ederim', w: ['Çekil', 'Ne var', 'Hiçbir şey demem'], ex: 'Bize yardım edene teşekkür ederiz.', img: 'handshake' },
  { q: 'Akşam eve döndün. Ailene ne dersin?', a: 'İyi akşamlar', w: ['Günaydın', 'Hoşça kal', 'Afiyet olsun'], ex: 'Akşam “İyi akşamlar.” deriz.', img: 'house' },
  { q: 'Sınıfa misafir bir bilim insanı geldi. Ne dersin?', a: 'Hoş geldiniz', w: ['Güle güle', 'İyi geceler', 'Hey sen'], ex: 'Misafiri “Hoş geldiniz.” diyerek karşılarız.', img: 'scientist' },
  { q: 'Öğretmenine soru sormak istiyorsun. Nasıl seslenirsin?', a: 'Öğretmenim, bir sorum var', w: ['Hey, bana bak', 'Sus da dinle', 'Bağırarak sorarım'], ex: 'Öğretmenimize “Öğretmenim” diye kibarca sesleniriz.', img: 'raisedhand' },
  { q: 'Gece yatmadan önce ailene ne dersin?', a: 'İyi geceler', w: ['Günaydın', 'Hoş geldiniz', 'Afiyet olsun'], ex: 'Yatarken “İyi geceler.” deriz.', img: 'moon' },
  { q: 'Arkadaşın yarışmayı kazandı. Ne dersin?', a: 'Tebrik ederim', w: ['Bana ne', 'Hiç sevinmedim', 'Git buradan'], ex: 'Kazanan arkadaşımızı tebrik ederiz.', img: 'trophy' },
]
const SOZAL6_TF: TF[] = [
  ['Dinlerken soru sormak için konuşmanın bitmesini beklerim.', true, 'Konuşma bitince söz alırız.'],
  ['Anlatan kişi konuşurken bağırarak soru sorarım.', false, 'Önce elimizi kaldırır, sıramızı bekleriz.'],
  ['Söz almak için elimi kaldırırım.', true, 'El kaldırmak söz istemenin kibar yoludur.'],
  ['Dinlerken arkadaşımla fısıldaşırım.', false, 'Dinlerken sessiz oluruz.'],
  ['Söz bana gelince kısa ve anlaşılır konuşurum.', true, 'Kısa ve anlaşılır konuşmak dinleyeni mutlu eder.'],
  ['Herkes konuşurken ben de araya girerim.', false, 'Araya girmeden sıramızı bekleriz.'],
]
const ASTRONOT: Metin = {
  t: 'Uzay Yolcusu',
  img: 'rocket',
  text: 'Mira büyüyünce astronot olmak istiyor. Odasının tavanında parlayan yıldızlar var. Her gece onlara bakıp hayal kuruyor. Hayalinde roketle Ay’a gidiyor. Ay’dan Dünya’ya el sallıyor.',
  qs: [
    qi('Mira ne olmak istiyor?', ['Astronot', 'rocket'], [['Aşçı', 'cook'], ['Çiftçi', 'farmer'], ['Ressam', 'artist']], 'Mira büyüyünce astronot olmak istiyor.'),
    qi('Mira hayalinde nereye gidiyor?', ['Ay’a', 'moon'], [['Denize', 'wave'], ['Ormana', 'tree'], ['Çöle', 'desert']], 'Hayalinde roketle Ay’a gidiyor.'),
    { q: 'Odasının tavanında ne var?', a: 'Parlayan yıldızlar', w: ['Uçan kuşlar', 'Renkli balonlar', 'Büyük bir saat'], ex: 'Tavanda parlayan yıldızlar var.' },
    { q: 'Bu metin ne anlatıyor?', a: 'Uzaya gitme hayalini', w: ['Bir okul gezisini', 'Bir yemek tarifini', 'Bir futbol maçını'], ex: 'Metin, Mira’nın uzaya gitme hayalini anlatıyor.' },
    { q: 'Mira hayalinde Ay’dan kime el sallıyor?', a: 'Dünya’ya', w: ['Güneş’e', 'Yıldızlara', 'Bulutlara'], ex: 'Ay’dan Dünya’ya el sallıyor.' },
  ],
}
const UCAK: Metin = {
  t: 'Ablamın Uçağı',
  img: 'airplane',
  text: 'Ablam küçük bir model uçak yaptı. Ben de ona yardım ettim. Kanatlarını birlikte boyadık. Uçak bilim şenliğinde uçtu. Herkes alkışladı. Ablamla gurur duydum.',
  qs: [
    qi('Abla ne yaptı?', ['Model uçak', 'airplane'], [['Robot', 'robot'], ['Gemi', 'ship'], ['Araba', 'car']], 'Abla küçük bir model uçak yaptı.'),
    { q: 'Kanatları birlikte ne yaptılar?', a: 'Boyadılar', w: ['Kırdılar', 'Sakladılar', 'Yıkadılar'], ex: 'Kanatlarını birlikte boyadılar.' },
    { q: 'Uçak nerede uçtu?', a: 'Bilim şenliğinde', w: ['Mutfakta', 'Okul servisinde', 'Banyoda'], ex: 'Uçak bilim şenliğinde uçtu.' },
    { q: 'Anlatan çocuk sonunda ne hissetti?', a: 'Gurur duydu', w: ['Korktu', 'Kızdı', 'Sıkıldı'], ex: '“Ablamla gurur duydum.” diyor.' },
    { q: 'Bu metnin konusu ne?', a: 'Ablaya yardım etmek', w: ['Uçakla tatile gitmek', 'Resim sergisi', 'Bisiklet yarışı'], ex: 'Çocuk, model uçak yapan ablasına yardım ediyor.' },
  ],
}
const BASLIK6: Q[] = [
  qi('“Büyüteçle Bahçede” adlı metin ne anlatır?', ['Böcekleri incelemeyi', 'ladybug'], [['Yüzmeyi', 'wave'], ['Yemek yapmayı', 'cook'], ['Uyumayı', 'bed']], 'Büyüteçle küçük canlıları inceleriz.', 'magnifier'),
  qi('“Gökyüzü Gecesi” adlı metin ne anlatır?', ['Yıldızları izlemeyi', 'star'], [['Top oynamayı', 'ball'], ['Kek yapmayı', 'cake'], ['Diş fırçalamayı', 'toothbrush']], 'Gece gökyüzünde yıldızlar görünür.', 'telescope'),
  qi('“Uzay Yolcusu” adlı metin ne anlatır?', ['Uzaya gitmeyi', 'planet'], [['Denizde yüzmeyi', 'fish'], ['Ağaç dikmeyi', 'seedling'], ['Alışverişi', 'cart']], 'Uzay yolcusu uzaya gider.', 'rocket'),
  qi('“Robot Dostum” adlı metin ne anlatır?', ['Bir robotu', 'robot'], [['Bir kediyi', 'cat'], ['Bir çiçeği', 'flower'], ['Bir pastayı', 'cake']], 'Başlıkta “robot” sözcüğü var.', 'robot2'),
  qi('“Deniz Kâşifi” adlı metin ne anlatır?', ['Denizdeki canlıları', 'whale'], [['Çöldeki kumları', 'desert'], ['Uzaydaki yıldızları', 'star'], ['Ormandaki ağaçları', 'tree']], 'Deniz kâşifi denizi keşfeder.', 'dolphin'),
  qi('“Ablamın Uçağı” adlı metin ne anlatır?', ['Bir model uçağı', 'airplane'], [['Bir bisikleti', 'bicycle'], ['Bir gemiyi', 'ship'], ['Bir treni', 'train']], 'Başlıkta “uçak” sözcüğü var.', 'airplane'),
]
const BOSLUK6: Q[] = [
  { q: '“Kuşağaçtaötüyor.” Doğru yazılışı hangisi?', a: 'Kuş ağaçta ötüyor.', w: ['Kuşağaçta ötüyor.', 'Kuş ağaçtaötüyor.', 'Ku şağaçta ötüyor.'], ex: 'Sözcüklerin arasında boşluk bırakırız.', img: 'bird' },
  { q: '“Ecebüyüteçlebaktı.” Doğru yazılışı hangisi?', a: 'Ece büyüteçle baktı.', w: ['Ecebüyüteçle baktı.', 'Ece büyüteçlebaktı.', 'Ece bü yüteçle baktı.'], ex: 'Her sözcükten sonra bir boşluk bırakırız.', img: 'magnifier' },
  { q: '“Aybugecekocaman.” Doğru yazılışı hangisi?', a: 'Ay bu gece kocaman.', w: ['Aybu gece kocaman.', 'Ay bugece kocaman.', 'Ay bu gecekocaman.'], ex: 'Sözcükleri ayrı ayrı yazarız.', img: 'fullmoon' },
  { q: '“Roketuzayauçtu.” Doğru yazılışı hangisi?', a: 'Roket uzaya uçtu.', w: ['Roketuzaya uçtu.', 'Roket uzayauçtu.', 'Ro ket uzaya uçtu.'], ex: 'Sözcüklerin arasında boşluk olur.', img: 'rocket' },
  { q: '“Bisikletimkırmızı.” Doğru yazılışı hangisi?', a: 'Bisikletim kırmızı.', w: ['Bisi kletim kırmızı.', 'Bisikletimkır mızı.', 'Bisikletim kır mızı.'], ex: 'İki sözcüğün arasına boşluk koyarız.', img: 'bicycle' },
  { q: '“Yıldızlarıbirliktesaydık.” Doğru yazılışı hangisi?', a: 'Yıldızları birlikte saydık.', w: ['Yıldızlarıbirlikte saydık.', 'Yıldızları birliktesaydık.', 'Yıldız ları birlikte saydık.'], ex: 'Her sözcüğü ayrı yazarız.', img: 'star' },
]
const NOKTA6: Q[] = [
  { q: 'Ne kadar güzel bir gece( ) Sona hangi işaret gelir?', a: UNLEM, w: [SORU, NOKTA, VIRGUL], ex: 'Sevinç ve şaşkınlık bildiren cümlenin sonuna ünlem konur.', img: 'shootingstar' },
  { q: 'Büyüteci nereye koydun( ) Sona hangi işaret gelir?', a: SORU, w: [UNLEM, NOKTA, VIRGUL], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'magnifier' },
  { q: 'Ay bu gece çok parlak( ) Sona hangi işaret gelir?', a: NOKTA, w: [SORU, UNLEM, VIRGUL], ex: 'Bir şeyi bildiren cümlenin sonuna nokta konur.', img: 'fullmoon' },
  { q: 'Yaşasın, kazandık( ) Sona hangi işaret gelir?', a: UNLEM, w: [SORU, NOKTA, VIRGUL], ex: 'Sevinç bildiren cümlenin sonuna ünlem konur.', img: 'trophy' },
  { q: 'Yıldızları saydın mı( ) Sona hangi işaret gelir?', a: SORU, w: [UNLEM, NOKTA, VIRGUL], ex: '“mı” ile sorulan cümlenin sonuna soru işareti konur.', img: 'star' },
  { q: 'Dikkat et, düşeceksin( ) Sona hangi işaret gelir?', a: UNLEM, w: [SORU, NOKTA, VIRGUL], ex: 'Uyarı cümlesinin sonuna ünlem konur.', img: 'bicycle' },
  { q: 'Uçurtmamız gökyüzünde( ) Sona hangi işaret gelir?', a: NOKTA, w: [SORU, UNLEM, VIRGUL], ex: 'Bildiren cümlenin sonuna nokta konur.', img: 'kite' },
]
const ILK6: Ilk[] = [
  { imgs: ['tree', 'star'], adlar: ['ağaç', 'yıldız'], a: 'ay', w: ['at', 'ok', 'el'] },
  { imgs: ['apple', 'lemon'], adlar: ['elma', 'limon'], a: 'el', w: ['ay', 'at', 'ok'] },
  { imgs: ['bus', 'cat'], adlar: ['otobüs', 'kedi'], a: 'ok', w: ['ay', 'el', 'su'] },
  { imgs: ['bee', 'ball'], adlar: ['arı', 'top'], a: 'at', w: ['ok', 'el', 'su'] },
  { imgs: ['clock', 'airplane'], adlar: ['saat', 'uçak'], a: 'su', w: ['ay', 'at', 'ok'] },
  { imgs: ['cat', 'airplane', 'umbrella'], adlar: ['kedi', 'uçak', 'şemsiye'], a: 'kuş', w: ['kar', 'top', 'süt'] },
  { imgs: ['chicken', 'bus', 'cheese'], adlar: ['tavuk', 'otobüs', 'peynir'], a: 'top', w: ['kuş', 'süt', 'kar'] },
]
const BILMECE6: Q[] = [
  qi('Uzaktaki yıldızları yakına getirir. Bu nedir?', ['Teleskop', 'telescope'], [['Büyüteç', 'magnifier'], ['Kamera', 'camera'], ['Saat', 'clock']], 'Teleskopla uzaktaki gök cisimlerini izleriz.'),
  qi('Küçük şeyleri büyük gösterir. Bu nedir?', ['Büyüteç', 'magnifier'], [['Teleskop', 'telescope'], ['Makas', 'scissors'], ['Cetvel', 'ruler']], 'Büyüteç küçük şeyleri büyütür.'),
  qi('Kırmızı sırtında siyah benekler var. Bu kim?', ['Uğur böceği', 'ladybug'], [['Karınca', 'ant'], ['Arı', 'bee'], ['Kelebek', 'butterfly']], 'Uğur böceğinin kırmızı sırtında siyah benekler vardır.'),
  qi('Ateş saçarak gökyüzüne fırlar, uzaya gider. Bu nedir?', ['Roket', 'rocket'], [['Uçak', 'airplane'], ['Gemi', 'ship'], ['Tren', 'train']], 'Roket uzaya gider.'),
  qi('İki tekerleği var, pedalla gider. Bu nedir?', ['Bisiklet', 'bicycle'], [['Araba', 'car'], ['Otobüs', 'bus'], ['Tren', 'train']], 'Bisikleti pedal çevirerek sürmeye çalışırız.'),
  qi('Geceleri gökte parlar, bazen yuvarlak bazen hilal olur. Bu nedir?', ['Ay', 'moon'], [['Güneş', 'sun'], ['Bulut', 'cloud'], ['Gökkuşağı', 'rainbow']], 'Ay bazen dolunay, bazen hilal görünür.'),
  qi('Kanatları renkli, çiçekten çiçeğe konar. Bu kim?', ['Kelebek', 'butterfly'], [['Karınca', 'ant'], ['Salyangoz', 'snail'], ['Solucan', 'worm']], 'Kelebek çiçekten çiçeğe uçar.'),
]
const DIKTE6: [string, string][] = [['kuş', 'bird'], ['ay', 'moon'], ['roket', 'rocket'], ['böcek', 'bug'], ['yıldız', 'star'], ['top', 'ball'], ['gemi', 'ship'], ['yaprak', 'leaf']]
const DIKTE6_C: string[][] = [
  ['Ay', 'çok', 'parlak.'],
  ['Kuş', 'dalda', 'ötüyor.'],
  ['Ece', 'böcek', 'buldu.'],
  ['Roket', 'uzaya', 'uçtu.'],
  ['Biz', 'yıldız', 'saydık.'],
  ['Abim', 'yaprağa', 'baktı.'],
]
const T6_C: string[][] = [
  ['Ablam', 'model', 'uçak', 'yaptı.'],
  ['Büyüteçle', 'yaprağa', 'baktık.'],
  ['Mira', 'astronot', 'olmak', 'istiyor.'],
  ['Teleskopla', 'yıldızları', 'izledik.'],
  ['Bisikletim', 'mavi', 'renkli.'],
  ['Uğur', 'böceği', 'yaprağa', 'kondu.'],
]
const MEM6: P[] = [
  ['teleskop', 'Yıldızları gösterir', 'telescope'],
  ['büyüteç', 'Küçüğü büyütür', 'magnifier'],
  ['roket', 'Uzaya gider', 'rocket'],
  ['pusula', 'Yön gösterir', 'compass'],
  ['kamera', 'Fotoğraf çeker', 'camera'],
  ['harita', 'Yolu gösterir', 'map'],
]
const KASIF_AV = ['roket', 'ay', 'yıldız', 'böcek', 'yaprak', 'gemi', 'kuş']

/* ================================================================================================
 * TEMA 7 · ATALARIMIZIN İZLERİ
 * ================================================================================================ */
const D7_CIRIT: Dinleme = {
  t: 'Atlı Oyun',
  img: 'horse',
  text: 'Köyde bayram şenliği vardı. Atlılar meydanda cirit oynadı. Cirit, at üstünde oynanan eski bir oyundur. Bir atlı yere düştü. Rakibi atından inip ona yardım etti. Herkes onu alkışladı.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Atalarımızın cirit oyunu', w: ['Bir futbol maçı', 'Bir okul gezisi', 'Bir yemek yarışması'], ex: 'Metin, atla oynanan eski bir oyunu, ciriti anlatıyor.' },
    qi('Cirit hangi hayvanla oynanır?', ['At', 'horse'], [['İnek', 'cow'], ['Koyun', 'sheep'], ['Köpek', 'dog']], 'Cirit at üstünde oynanır.'),
    { q: 'Rakibi, düşen atlıya ne yaptı?', a: 'Yardım etti', w: ['Güldü', 'Kızdı', 'Kaçtı'], ex: 'Rakibi atından inip ona yardım etti.' },
    { q: 'Atlılar nerede oynadı?', a: 'Meydanda', w: ['Denizde', 'Sınıfta', 'Mutfakta'], ex: 'Atlılar meydanda cirit oynadı.' },
    { q: 'Herkes neden alkışladı?', a: 'Rakibine yardım ettiği için', w: ['Atından düştüğü için', 'Oyunu bıraktığı için', 'Bağırdığı için'], ex: 'Yardım eden atlıyı herkes alkışladı.' },
  ],
}
const D7_NISAN: Dinleme = {
  t: '23 Nisan Sabahı',
  img: 'trflag',
  text: 'Bugün 23 Nisan. Okulun bahçesi bayraklarla süslü. Çocuklar sahnede. Hep birlikte şiir okuyup halk oyunu oynuyorlar. Aileler sevinçle alkışlıyor.',
  qs: [
    { q: 'Bu günden önce çocuklar ne yapmış olabilir?', a: 'Şiir ve oyun çalışmış', w: ['Hiç hazırlanmamış', 'Tatile gitmiş', 'Bütün gün uyumuş'], ex: 'Sahnede güzel bir gösteri için önceden çalışmış olmalılar.' },
    { q: 'Bahçeyi önceden kimler süslemiş olabilir?', a: 'Öğretmenler ve öğrenciler', w: ['Kuşlar', 'Kediler', 'Rüzgâr'], ex: 'Bahçeyi okuldakiler birlikte süslemiş olabilir.' },
    { q: 'Çocuklar sahnede ne yapıyor?', a: 'Şiir okuyor', w: ['Uyuyor', 'Yemek yiyor', 'Ders çalışıyor'], ex: 'Şiir okuyup halk oyunu oynuyorlar.' },
    qi('Bahçe neyle süslü?', ['Bayraklarla', 'trflag'], [['Çiçeklerle', 'flower'], ['Yapraklarla', 'leaf'], ['Kardan adamlarla', 'snowman']], 'Okulun bahçesi bayraklarla süslü.'),
  ],
}
const D7_SANDIK: Dinleme = {
  t: 'Eski Sandık',
  img: 'package',
  text: 'Dedem tavan arasından eski bir sandık indirdi. Sandığı birlikte açtık. İçinden tahta bir at ve bir topaç çıktı. Dedem “Bunlar babanın oyuncakları.” dedi. Babam onları görünce gülümsedi.',
  qs: [
    { q: 'Sandık tavan arasına nasıl gitmiş olabilir?', a: 'Yıllar önce oraya kaldırılmış', w: ['Kendi kendine uçmuş', 'Kuşlar taşımış', 'Az önce düşmüş'], ex: 'Eski eşyalar saklanmak için yıllar önce tavan arasına kaldırılır.' },
    { q: 'Oyuncaklar sandığa girmeden önce ne olmuş olabilir?', a: 'Babası onlarla oynamış', w: ['Hiç oynanmamış', 'Dükkândan yeni gelmiş', 'Denizde yüzmüş'], ex: 'Bunlar babasının çocukken oynadığı oyuncaklarmış.' },
    qi('Sandıktan neler çıktı?', ['Tahta at ve topaç', 'horse'], [['Top ve bebek', 'ball'], ['Kitap ve kalem', 'book'], ['Robot ve araba', 'robot']], 'İçinden tahta bir at ve bir topaç çıktı.'),
    { q: 'Oyuncaklar kimindi?', a: 'Babasının', w: ['Dedesinin', 'Ninesinin', 'Kardeşinin'], ex: 'Dedesi “Bunlar babanın oyuncakları.” dedi.' },
  ],
}
const TAHMIN7: Q[] = [
  qi(TAHMIN_Q, ['At üstünde oynanan oyunu', 'horse'], [['Denizde yüzmeyi', 'wave'], ['Uzaya gitmeyi', 'rocket'], ['Kek yapmayı', 'cake']], 'Resimde at var. Metin atla oynanan bir oyunu anlatıyor olabilir.', 'horse'),
  qi(TAHMIN_Q, ['Bayram kutlamasını', 'confetti'], [['Diş fırçalamayı', 'toothbrush'], ['Uyumayı', 'bed'], ['Balık tutmayı', 'fish']], 'Resimde bayrağımız var. Metin bir bayramı anlatıyor olabilir.', 'trflag'),
  qi(TAHMIN_Q, ['Eski oyuncakları', 'teddy'], [['Uçak yolculuğunu', 'airplane'], ['Yağmuru', 'rain'], ['Bir futbol maçını', 'ball']], 'Resimde bir sandık var. İçinden eski eşyalar çıkabilir.', 'package'),
  qi(TAHMIN_Q, ['Bayram ziyaretini', 'gift'], [['Bir bilim deneyini', 'testtube'], ['Bir koşu yarışını', 'running'], ['Bir orman gezisini', 'tree']], 'Resimde nine var. Metin büyükleri ziyareti anlatıyor olabilir.', 'oldwoman'),
  qi(TAHMIN_Q, ['Telefonla konuşmayı', 'telephone'], [['Resim yapmayı', 'palette'], ['Yüzmeyi', 'wave'], ['Bahçe sulamayı', 'droplet']], 'Resimde telefon var. Metin bir telefon konuşmasını anlatıyor olabilir.', 'telephone'),
]
const TELEFON7: Q[] = [
  { q: 'Telefon çaldı, açtın. İlk ne dersin?', a: 'Alo, merhaba', w: ['Ne var', 'Kimsin sen', 'Hiçbir şey demem'], ex: 'Telefonu açınca “Alo, merhaba.” deriz.', img: 'telephone' },
  { q: 'Bayramda dedeni aradın. Ne dersin?', a: 'İyi bayramlar dedeciğim', w: ['Hey, naber', 'Ne yapıyorsun sen', 'Kapatıyorum'], ex: 'Büyüklerimizin bayramını sevgiyle kutlarız.', img: 'oldman' },
  { q: 'Telefonu kapatırken ne dersin?', a: 'Hoşça kal, görüşürüz', w: ['Günaydın', 'Hoş geldin', 'Afiyet olsun'], ex: 'Konuşmayı “Hoşça kal.” diyerek bitiririz.', img: 'phone' },
  { q: 'Bayram ziyaretinde büyüklerine ne dersin?', a: 'Bayramınız kutlu olsun', w: ['Kolay gelsin', 'İyi geceler', 'Geçmiş olsun'], ex: 'Bayramda “Bayramınız kutlu olsun.” deriz.', img: 'gift' },
  { q: 'Ninenin hatırını sorarken ne dersin?', a: 'Nasılsın nineciğim?', w: ['Ne istiyorsun?', 'Sana ne?', 'Çabuk söyle!'], ex: 'Büyüklerimize “nineciğim, dedeciğim” diye sevgiyle sesleniriz.', img: 'oldwoman' },
  { q: 'Telefonda tanımadığın biri adresini sordu. Ne yaparsın?', a: 'Söylemem, bir büyüğüme veririm', w: ['Adresimi söylerim', 'Okulumun adını söylerim', 'Bütün bilgilerimi söylerim'], ex: 'Tanımadığımız kişilere adres, okul gibi bilgileri vermeyiz. Telefonu bir büyüğümüze veririz.', img: 'shield' },
]
const BAYRAM7_TF: TF[] = [
  ['Bayramda büyüklerimizi ziyaret ederiz.', true, 'Bayramda büyüklerimizi ziyaret edip bayramlarını kutlarız.'],
  ['Misafir gelince odama kapanırım.', false, 'Misafirleri “Hoş geldiniz.” diyerek karşılarız.'],
  ['Büyüklerimizle konuşurken kibar sözler kullanırız.', true, 'Büyüklerimize saygıyla konuşuruz.'],
  ['Dedeme “Hey, naber!” diye seslenirim.', false, 'Büyüklerimize “Dedeciğim, nasılsın?” gibi kibar sözlerle sesleniriz.'],
  ['Bayram kartına “İyi bayramlar” yazabiliriz.', true, 'Kartlarımızı güzel dileklerle başlatırız.'],
  ['Arkadaşlarımızla konuşur gibi öğretmenimize de “Hey!” deriz.', false, 'Öğretmenimize “Öğretmenim” diye sesleniriz.'],
]
const BAYRAM: Metin = {
  t: 'Bayram Ziyareti',
  img: 'gift',
  text: 'Bayram sabahı Elif erkenden uyandı. Ailesiyle ninesine gitti. Ninesinin elini öptü. Ninesi ona şeker ikram etti. Elif akşam kuzenine bir bayram kartı gönderdi.',
  qs: [
    qi('Elif kime gitti?', ['Ninesine', 'oldwoman'], [['Öğretmenine', 'teacher'], ['Doktora', 'doctor'], ['Markete', 'store']], 'Elif ailesiyle ninesine gitti.'),
    qi('Ninesi ne ikram etti?', ['Şeker', 'candy'], [['Pasta', 'cake'], ['Elma', 'apple'], ['Dondurma', 'icecream']], 'Ninesi ona şeker ikram etti.'),
    { q: 'Elif akşam ne gönderdi?', a: 'Bayram kartı', w: ['Bir paket', 'Bir oyuncak', 'Bir çiçek'], ex: 'Elif kuzenine bayram kartı gönderdi.' },
    { q: 'Bu metin ne anlatıyor?', a: 'Bayramlaşmayı', w: ['Bir okul gezisini', 'Bir doğum gününü', 'Bir futbol maçını'], ex: 'Metin, Elif’in bayramda büyüklerini ziyaret etmesini anlatıyor.' },
    { q: 'Elif ne zaman uyandı?', a: 'Erkenden', w: ['Öğlen', 'Gece yarısı', 'Akşam'], ex: 'Bayram sabahı erkenden uyandı.' },
  ],
}
const BAYRAK: Metin = {
  t: 'Al Bayrağım',
  img: 'trflag',
  text: 'Bayrağımız kırmızı ve beyazdır. Üstünde ay ve yıldız vardır. Bayramlarda evleri ve okulları süsler. Rüzgârda dalgalanınca çok güzel görünür. Bayrağımızı çok severiz.',
  qs: [
    { q: 'Bayrağımız hangi renklerden oluşur?', a: 'Kırmızı ve beyaz', w: ['Mavi ve sarı', 'Yeşil ve mor', 'Siyah ve turuncu'], ex: 'Bayrağımız kırmızı ve beyazdır.' },
    qi('Bayrağın üstünde ne var?', ['Ay ve yıldız', 'crescent'], [['Güneş', 'sun'], ['Çiçek', 'flower'], ['Kuş', 'bird']], 'Bayrağımızda ay ve yıldız vardır.'),
    { q: 'Bu metnin konusu ne?', a: 'Bayrağımız', w: ['Bir oyuncak', 'Bir yemek', 'Bir hayvan'], ex: 'Metin bayrağımızı anlatıyor.' },
    { q: 'Bayrak ne zaman dalgalanır?', a: 'Rüzgâr esince', w: ['Yağmur dinince', 'Güneş batınca', 'Kar erirken'], ex: 'Bayrak rüzgârda dalgalanır.' },
    { q: 'Bayramlarda bayraklar nereleri süsler?', a: 'Evleri ve okulları', w: ['Yalnızca denizi', 'Hiçbir yeri', 'Yalnızca ormanı'], ex: 'Bayramlarda evleri ve okulları süsler.' },
  ],
}
const BASLIK7: Q[] = [
  qi('“Dedemin Sandığı” adlı metin ne anlatır?', ['Eski eşyaları', 'teddy'], [['Uzay yolculuğunu', 'rocket'], ['Bir yüzme yarışını', 'wave'], ['Bir orman gezisini', 'tree']], 'Sandıkta eski eşyalar saklanır.', 'package'),
  qi('“Bayram Sabahı” adlı metin ne anlatır?', ['Bayramlaşmayı', 'handshake'], [['Diş fırçalamayı', 'toothbrush'], ['Kar yağmasını', 'snowflake'], ['Balık tutmayı', 'fish']], 'Bayram sabahı büyüklerimizle bayramlaşırız.', 'gift'),
  qi('“Al Bayrağım” adlı metin ne anlatır?', ['Bayrağımızı', 'trflag'], [['Bir oyuncağı', 'teddy'], ['Bir meyveyi', 'apple'], ['Bir arabayı', 'car']], 'Başlıkta “bayrak” sözcüğü var.', 'trflag'),
  qi('“Atlı Oyun” adlı metin ne anlatır?', ['Atla oynanan bir oyunu', 'horse'], [['Bir kedi oyununu', 'cat'], ['Bir bilgisayar oyununu', 'videogame'], ['Bir kart oyununu', 'puzzle']], 'Başlıkta “atlı” sözcüğü var.', 'horse'),
  qi('“23 Nisan Şenliği” adlı metin ne anlatır?', ['Çocuk bayramını', 'party'], [['Kış tatilini', 'snowman'], ['Bir doktor ziyaretini', 'doctor'], ['Bir alışverişi', 'cart']], '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’dır.', 'balloon'),
  qi('“Ninemin Masalı” adlı metin ne anlatır?', ['Ninenin anlattığı masalı', 'openbook'], [['Bir futbol maçını', 'ball'], ['Bir trafik kazasını', 'car'], ['Bir deneyi', 'testtube']], 'Başlıkta “nine” ve “masal” sözcükleri var.', 'oldwoman'),
]
const T7_O: O[] = [
  { q: 'Sandığın hikâyesini sırala.', s: ['Dedem sandığı indirdi', 'Sandığı açtık', 'Oyuncakları bulduk', 'Babam gülümsedi'], ex: 'Olaylar bu sırayla oldu.', img: 'package' },
  { q: 'Elif’in bayramını sırala.', s: ['Erkenden uyandı', 'Ninesine gitti', 'Elini öptü', 'Kart gönderdi'], ex: 'Önce uyandı, sonra ziyaret etti, akşam kart gönderdi.', img: 'gift' },
  { q: 'Cirit oyununu sırala.', s: ['Atlılar meydana geldi', 'Cirit oynadılar', 'Bir atlı düştü', 'Rakibi ona yardım etti'], ex: 'Olaylar bu sırayla oldu.', img: 'horse' },
  { q: '23 Nisan gününü sırala.', s: ['Bahçeyi süsledik', 'Sahneye çıktık', 'Şiir okuduk', 'Aileler alkışladı'], ex: 'Olaylar bu sırayla oldu.', img: 'trflag' },
]
const BUYUK7: Q[] = [
  { q: '“ankara” sözcüğünün doğru yazılışı hangisi?', a: 'Ankara', w: ['ankara', 'anKara', 'ankarA'], ex: 'Şehir adları büyük harfle başlar.', img: 'cityscape' },
  { q: '“elif” adının doğru yazılışı hangisi?', a: 'Elif', w: ['elif', 'eLif', 'elİf'], ex: 'Kişi adları büyük harfle başlar.', img: 'girl' },
  { q: '“türkiye” sözcüğünün doğru yazılışı hangisi?', a: 'Türkiye', w: ['türkiye', 'türKiye', 'TürkiyE'], ex: 'Ülke adları büyük harfle başlar.', img: 'trflag' },
  { q: '“atatürk” adının doğru yazılışı hangisi?', a: 'Atatürk', w: ['atatürk', 'AtaTürk', 'atAtürk'], ex: 'Kişi adları büyük harfle başlar.', img: 'star' },
  { q: 'Köpeğin adı “karabaş”. Doğru yazılışı hangisi?', a: 'Karabaş', w: ['karabaş', 'KaraBaş', 'karaBaş'], ex: 'Hayvanlara verilen adlar büyük harfle başlar.', img: 'dog' },
  { q: '“dedem sandığı açtı.” cümlesinin doğru yazılışı hangisi?', a: 'Dedem sandığı açtı.', w: ['dedem sandığı açtı.', 'Dedem Sandığı açtı.', 'dedem Sandığı Açtı.'], ex: 'Cümle büyük harfle başlar.', img: 'package' },
]
const OZEL7_BINS: SortQ['bins'] = [
  { id: 'buyuk', label: 'Büyük harfle başlar', img: 'crown', color: '#8b5cf6' },
  { id: 'kucuk', label: 'Küçük harfle başlar', img: 'pencil', color: '#22c55e' },
]
const OZEL7_ITEMS: SortQ['items'] = [
  { label: 'elif (kız adı)', img: 'girl', bin: 'buyuk' },
  { label: 'ankara (şehir)', img: 'cityscape', bin: 'buyuk' },
  { label: 'türkiye (ülke)', img: 'trflag', bin: 'buyuk' },
  { label: 'karabaş (köpeğin adı)', img: 'dog', bin: 'buyuk' },
  { label: 'mert (erkek adı)', img: 'boy', bin: 'buyuk' },
  { label: 'masa', img: 'forkplate', bin: 'kucuk' },
  { label: 'kalem', img: 'pencil', bin: 'kucuk' },
  { label: 'kedi', img: 'cat', bin: 'kucuk' },
  { label: 'elma', img: 'apple', bin: 'kucuk' },
  { label: 'oyuncak', img: 'teddy', bin: 'kucuk' },
]
const NOKTA7: Q[] = [
  { q: 'Ankara( )ya gittik. Boşluğa hangi işaret gelir?', a: KESME, w: [NOKTA, SORU, UNLEM], ex: 'Özel adlara gelen ekleri kesme işaretiyle ayırırız: Ankara’ya.', img: 'cityscape' },
  { q: 'Dedem bize masal anlattı( ) Sona hangi işaret gelir?', a: NOKTA, w: [SORU, UNLEM, VIRGUL], ex: 'Bildiren cümlenin sonuna nokta konur.', img: 'oldman' },
  { q: 'Sandıkta ne var( ) Sona hangi işaret gelir?', a: SORU, w: [NOKTA, UNLEM, VIRGUL], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'package' },
  { q: 'Yaşasın, bayram geldi( ) Sona hangi işaret gelir?', a: UNLEM, w: [NOKTA, SORU, VIRGUL], ex: 'Sevinç bildiren cümlenin sonuna ünlem konur.', img: 'confetti' },
  { q: 'Elif( ) Ece ve Can geldi. Boşluğa hangi işaret gelir?', a: VIRGUL, w: [NOKTA, SORU, UNLEM], ex: 'Sıralanan adların arasına virgül konur.', img: 'friends' },
  { q: 'Atatürk( )ü çok severiz. Boşluğa hangi işaret gelir?', a: KESME, w: [NOKTA, VIRGUL, UNLEM], ex: 'Özel ada gelen eki kesme işaretiyle ayırırız: Atatürk’ü.', img: 'star' },
  { q: 'Bayram kartını aldın mı( ) Sona hangi işaret gelir?', a: SORU, w: [NOKTA, UNLEM, KESME], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'memo' },
]
const MI7: Q[] = [
  { q: '“buldumu” nasıl yazılır?', a: 'buldu mu', w: ['buldumu', 'bul dumu', 'buldum u'], ex: 'Soru eki mı, mi, mu, mü ayrı yazılır: buldu mu?' },
  { q: '“geldimi” nasıl yazılır?', a: 'geldi mi', w: ['geldimi', 'gel dimi', 'geldim i'], ex: 'Soru eki ayrı yazılır: geldi mi?' },
  { q: '“gördünmü” nasıl yazılır?', a: 'gördün mü', w: ['gördünmü', 'gör dünmü', 'gördü nmü'], ex: 'Soru eki ayrı yazılır: gördün mü?' },
  { q: '“oynadınmı” nasıl yazılır?', a: 'oynadın mı', w: ['oynadınmı', 'oyna dınmı', 'oynadı nmı'], ex: 'Soru eki ayrı yazılır: oynadın mı?' },
  { q: '“okudunmu” nasıl yazılır?', a: 'okudun mu', w: ['okudunmu', 'oku dunmu', 'okudu nmu'], ex: 'Soru eki ayrı yazılır: okudun mu?' },
  { q: '“sevdinmi” nasıl yazılır?', a: 'sevdin mi', w: ['sevdinmi', 'sev dinmi', 'sevdi nmi'], ex: 'Soru eki ayrı yazılır: sevdin mi?' },
]
const BENZ7: Q[] = [
  qi('“Bulutlar pamuk gibi yumuşak.” Bulutlar neye benzetiliyor?', ['Pamuğa', 'cloud'], [['Taşa', 'rock'], ['Suya', 'droplet'], ['Ateşe', 'fire']], 'Bulutlar “pamuk gibi” denerek pamuğa benzetiliyor.'),
  qi('“Bayrağım ateş gibi kırmızı.” Bayrak neye benzetiliyor?', ['Ateşe', 'fire'], [['Kara', 'snowflake'], ['Suya', 'droplet'], ['Yaprağa', 'leaf']], 'Bayrağın rengi ateşe benzetiliyor.'),
  qi('“Dedemin saçları kar gibi beyaz.” Saçlar neye benzetiliyor?', ['Kara', 'snowflake'], [['Ateşe', 'fire'], ['Bala', 'honey'], ['Yaprağa', 'leaf']], 'Beyaz saçlar kara benzetiliyor.'),
  qi('“Ninemin sesi bal gibi tatlı.” Ses neye benzetiliyor?', ['Bala', 'honey'], [['Taşa', 'rock'], ['Kara', 'snowflake'], ['Ateşe', 'fire']], 'Tatlı ses bala benzetiliyor.'),
  qi('“Elif’in yanakları elma gibi kırmızı.” Yanaklar neye benzetiliyor?', ['Elmaya', 'apple'], [['Kara', 'snowflake'], ['Suya', 'droplet'], ['Taşa', 'rock']], 'Kırmızı yanaklar elmaya benzetiliyor.'),
  qi('“At rüzgâr gibi koştu.” At neye benzetiliyor?', ['Rüzgâra', 'cloud'], [['Kaplumbağaya', 'turtle'], ['Salyangoza', 'snail'], ['Taşa', 'rock']], 'Çok hızlı koşan at rüzgâra benzetiliyor.'),
]
const EKSIK7: Q[] = [
  { q: '“k_rm_z_” sözcüğünün doğrusu hangisi?', a: 'kırmızı', w: ['karmazı', 'kirmizi', 'kurmuzu'], ex: 'k-ı-r-m-ı-z-ı: kırmızı.', img: 'apple' },
  { q: '“b_yr_k” sözcüğünün doğrusu hangisi?', a: 'bayrak', w: ['beyrek', 'buyruk', 'bıyrık'], ex: 'b-a-y-r-a-k: bayrak.', img: 'trflag' },
  { q: '“s_nd_k” sözcüğünün doğrusu hangisi?', a: 'sandık', w: ['sondak', 'sındık', 'sundek'], ex: 's-a-n-d-ı-k: sandık.', img: 'package' },
  { q: '“b_yr_m” sözcüğünün doğrusu hangisi?', a: 'bayram', w: ['beyram', 'buyrum', 'bıyram'], ex: 'b-a-y-r-a-m: bayram.', img: 'confetti' },
  { q: '“d_d_” sözcüğünün doğrusu hangisi?', a: 'dede', w: ['dada', 'dudu', 'dıdı'], ex: 'd-e-d-e: dede.', img: 'oldman' },
  { q: '“oy_nc_k” sözcüğünün doğrusu hangisi?', a: 'oyuncak', w: ['oyancak', 'oyincek', 'oyuncuk'], ex: 'o-y-u-n-c-a-k: oyuncak.', img: 'teddy' },
]
const T7_C: string[][] = [
  ['Dedem', 'sandığı', 'açtı.'],
  ['Bayrakları', 'bahçeye', 'astık.'],
  ['Elif', 'ninesinin', 'elini', 'öptü.'],
  ['Atlılar', 'meydanda', 'cirit', 'oynadı.'],
  ['Bayramda', 'büyüklerimizi', 'ziyaret', 'ederiz.'],
  ['Çocuklar', 'sahnede', 'şiir', 'okudu.'],
]
const BENZ7_P: P[] = [
  ['pamuk gibi', 'yumuşak', 'cloud'],
  ['kar gibi', 'beyaz', 'snowflake'],
  ['bal gibi', 'tatlı', 'honey'],
  ['ateş gibi', 'kırmızı', 'fire'],
  ['buz gibi', 'soğuk', 'ice'],
  ['rüzgâr gibi', 'hızlı', 'horse'],
]
const OZEL_HIT = ['Ankara', 'Elif', 'Türkiye', 'Atatürk', 'Karabaş', 'Mert']
const OZEL_WRONG = ['masa', 'kalem', 'sandık', 'bayrak', 'kedi']

/* ================================================================================================
 * TEMA 8 · SORUMLULUKLARIMIZIN FARKINDAYIZ
 * ================================================================================================ */
const D8_TAVUK: Dinleme = {
  t: 'Kayıp Tavuklar',
  img: 'chicken',
  text: 'Bilge’nin üç tavuğu kaybolmuştu. Biri beyaz, biri kahverengi, biri benekliydi. Bilge yerde tüyler buldu. Tüyleri izleyip samanlığa gitti. Tavuklar orada yumurtluyordu!',
  qs: [
    { q: 'Tavuklar nerede çıktı?', a: 'Samanlıkta', w: ['Okulda', 'Denizde', 'Ağacın tepesinde'], ex: 'Bilge tüyleri izleyip samanlığa gitti.' },
    { q: 'Bilge yerde ne buldu?', a: 'Tüyler', w: ['Taşlar', 'Yapraklar', 'Oyuncaklar'], ex: 'Bilge yerde tüyler buldu ve onları izledi.' },
    { q: 'Tavuklardan biri nasıldı?', a: 'Benekli', w: ['Mor', 'Çizgili', 'Yeşil'], ex: 'Biri beyaz, biri kahverengi, biri benekliydi.' },
    qi('Tavuklar kaç ayaklıdır?', ['İki ayaklı', 'chicken'], [['Dört ayaklı', 'cow'], ['Altı ayaklı', 'ant'], ['Ayaksız', 'snail']], 'Tavuklar iki ayaklıdır.'),
    qi('Tavuklar samanlıkta ne yapıyordu?', ['Yumurtluyordu', 'egg'], [['Uyuyordu', 'sleepy'], ['Yüzüyordu', 'wave'], ['Uçuyordu', 'bird']], 'Tavuklar samanlıkta yumurtluyordu.'),
  ],
}
const D8_CIFTLIK: Dinleme = {
  t: 'Çiftlikte Sayım',
  img: 'tractor',
  text: 'Çiftlikte bir köpek, bir kedi ve iki ördek var. Köpek ve kedi dört ayaklı. Ördekler iki ayaklı ve kanatlı. Kedinin tüyleri yumuşak. Köpeğin kulakları uzun.',
  qs: [
    qi('Hangisi iki ayaklı?', ['Ördek', 'duck'], [['Köpek', 'dog'], ['Kedi', 'cat'], ['İnek', 'cow']], 'Ördekler iki ayaklıdır.'),
    qi('Hangisi dört ayaklı?', ['Kedi', 'cat'], [['Ördek', 'duck'], ['Tavuk', 'chicken'], ['Kuş', 'bird']], 'Kedi dört ayaklıdır.'),
    qi('Hangisinin kanatları var?', ['Ördeğin', 'duck'], [['Köpeğin', 'dog'], ['Kedinin', 'cat'], ['Atın', 'horse']], 'Ördekler kanatlıdır.'),
    qi('Kimin kulakları uzun?', ['Köpeğin', 'dog'], [['Kedinin', 'cat'], ['Ördeğin', 'duck'], ['Balığın', 'fish']], 'Köpeğin kulakları uzun.'),
    { q: 'Kedinin tüyleri nasıl?', a: 'Yumuşak', w: ['Sert', 'Islak', 'Dikenli'], ex: 'Kedinin tüyleri yumuşak.' },
  ],
}
const D8_SAKSI: Dinleme = {
  t: 'Kırık Saksı',
  img: 'plantpot',
  text: 'Ahmet top oynarken saksıyı devirdi. Saksı kırıldı, Ahmet çok üzüldü. Hemen annesine gidip olanı anlattı. Annesi “Doğruyu söylediğin için teşekkürler.” dedi. Birlikte çiçeği yeni saksıya diktiler.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Hatasını söyleyen bir çocuk', w: ['Bir futbol maçı', 'Bir doğum günü', 'Bir yolculuk'], ex: 'Ahmet hatasını saklamadı, annesine anlattı.' },
    { q: 'Ahmet neden üzüldü?', a: 'Saksıyı kırdığı için', w: ['Topu kaybolduğu için', 'Yağmur yağdığı için', 'Okula geç kaldığı için'], ex: 'Saksı kırılınca Ahmet çok üzüldü.' },
    { q: 'Ahmet ne yaptı?', a: 'Annesine olanı anlattı', w: ['Saklandı', 'Saksıyı gizledi', 'Kardeşini suçladı'], ex: 'Hemen annesine gidip doğruyu söyledi.' },
    qi('Sonunda ne yaptılar?', ['Çiçeği yeni saksıya diktiler', 'plantpot'], [['Çiçeği attılar', 'trash'], ['Top oynadılar', 'ball'], ['Uyudular', 'bed']], 'Birlikte çiçeği yeni saksıya diktiler.'),
  ],
}
const D8_PAZAR: Dinleme = {
  t: 'Yağmurlu Pazar',
  img: 'rain',
  text: 'Pazar sabahı yağmur yağıyordu. Ece parka gidemedi. Biraz üzüldü ama bir plan yaptı. Önce odasını topladı. Sonra kitabını eline aldı.',
  qs: [
    qi('Ece bundan sonra ne yapacak olabilir?', ['Kitap okuyacak', 'book'], [['Denize girecek', 'wave'], ['Kardan adam yapacak', 'snowman'], ['Parkta koşacak', 'running']], 'Kitabını eline aldığına göre kitap okuyacak.'),
    { q: 'Ece neden parka gidemedi?', a: 'Yağmur yağıyordu', w: ['Hastaydı', 'Park kapalıydı', 'Uyuyordu'], ex: 'Pazar sabahı yağmur yağıyordu.' },
    qi('Ece önce ne yaptı?', ['Odasını topladı', 'broom'], [['Kek yaptı', 'cake'], ['Top oynadı', 'ball'], ['Uyudu', 'bed']], 'Önce odasını topladı.'),
  ],
}
const D8_PIKNIK: Dinleme = {
  t: 'Piknik Dönüşü',
  img: 'camping',
  text: 'Sınıfça pikniğe gittik. Yemeğimizi yedik, oyunlar oynadık. Dönme vakti geldi. Öğretmenimiz herkese çöp poşeti dağıttı.',
  qs: [
    qi('Bundan sonra ne olur?', ['Çöpleri toplarız', 'wastebasket'], [['Çöpleri yere atarız', 'trash'], ['Poşetleri uçururuz', 'balloon'], ['Hemen uyuruz', 'bed']], 'Öğretmen çöp poşeti dağıttığına göre çöpleri toplayacağız.'),
    { q: 'Öğretmen ne dağıttı?', a: 'Çöp poşeti', w: ['Şeker', 'Kitap', 'Top'], ex: 'Öğretmenimiz herkese çöp poşeti dağıttı.' },
    { q: 'Çocuklar pikniğe kiminle gitti?', a: 'Sınıfça', w: ['Yalnız', 'Komşularla', 'Kedileriyle'], ex: 'Sınıfça pikniğe gittiler.' },
  ],
}
const SELAM8: Q[] = [
  { q: 'Apartmanda komşu amcayla karşılaştın. Ne dersin?', a: 'Merhaba amca', w: ['Çekil', 'Ne bakıyorsun', 'Hiçbir şey demem'], ex: 'Komşularımıza selam veririz.', img: 'oldman' },
  { q: 'Öğretmenine seslenirken ne dersin?', a: 'Öğretmenim', w: ['Hey', 'Baksana', 'Sen'], ex: 'Öğretmenimize “Öğretmenim” diye sesleniriz.', img: 'teacher' },
  { q: 'Arkadaşına yardım etmek istiyorsun. Nasıl sorarsın?', a: 'Yardım edebilir miyim?', w: ['Çekil, ben yaparım', 'Beceremiyorsun', 'Sana ne'], ex: 'Yardım teklif ederken kibarca sorarız.', img: 'handshake' },
  { q: 'Biri sana teşekkür etti. Ne dersin?', a: 'Rica ederim', w: ['Hoşça kal', 'Günaydın', 'Geçmiş olsun'], ex: 'Teşekküre “Rica ederim.” diye karşılık veririz.', img: 'happy' },
  { q: 'Yemek başlarken sofradakilere ne dersin?', a: 'Afiyet olsun', w: ['İyi geceler', 'Hoşça kal', 'Kolay gelsin'], ex: 'Sofrada “Afiyet olsun.” deriz.', img: 'forkplate' },
  { q: 'Annenden su isterken ne dersin?', a: 'Anneciğim, su verir misin lütfen?', w: ['Su ver!', 'Çabuk su!', 'Hiçbir şey demem'], ex: 'Bir şey isterken “lütfen” deriz, sevgiyle sesleniriz.', img: 'glass' },
]
const ONERI8: Q[] = [
  { q: 'Arkadaşın çöpü yere attı. Ne dersin?', a: 'Gel, çöpü kutuya atalım.', w: ['Ben de atarım.', 'Sana ne!', 'Hiçbir şey demem.'], ex: 'Uygun olmayan bir davranışa nazikçe öneride bulunuruz.', img: 'wastebasket' },
  { q: 'Kardeşin dişlerini fırçalamak istemiyor. Ne önerirsin?', a: 'Gel, birlikte fırçalayalım.', w: ['Fırçalama, boş ver.', 'Bana ne!', 'Ağlarsan fırçalama.'], ex: 'Birlikte yapmayı önermek güzel bir yoldur.', img: 'toothbrush' },
  { q: 'Arkadaşın oyunda sıra beklemiyor. Ne dersin?', a: 'Hadi sırayla oynayalım.', w: ['Ben de sırayı bozarım.', 'Oyundan çık!', 'Hiç konuşmam.'], ex: 'Sırayla oynamayı nazikçe öneririz.', img: 'raisedhand' },
  { q: 'Parkta biri çiçekleri koparıyor. Ne dersin?', a: 'Koparmayalım, çiçekler de canlı.', w: ['Ben de koparırım.', 'Hepsini kopar!', 'Bana ne!'], ex: 'Çiçekleri korumayı öneririz.', img: 'flower' },
  { q: 'Arkadaşın musluğu açık bıraktı. Ne dersin?', a: 'Musluğu kapatalım, su boşa akmasın.', w: ['Aksın, bana ne.', 'Daha çok açalım!', 'Hiçbir şey demem.'], ex: 'Suyu boşa harcamamayı öneririz.', img: 'droplet' },
  { q: 'Arkadaşın kütüphanede yüksek sesle konuşuyor. Ne dersin?', a: 'Biraz daha sessiz konuşalım mı?', w: ['Ben daha çok bağırırım!', 'Sus artık!', 'Bana ne!'], ex: 'Kibar bir soruyla öneride bulunuruz.', img: 'shush' },
]
const SORUM_BINS: SortQ['bins'] = [
  { id: 'evet', label: 'Sorumlu davranış', img: 'happy', color: '#22c55e' },
  { id: 'hayir', label: 'Sorumsuz davranış', img: 'sad', color: '#f97316' },
]
const SORUM_ITEMS: SortQ['items'] = [
  { label: 'Odamı toplarım', img: 'broom', bin: 'evet' },
  { label: 'Çiçekleri sularım', img: 'plantpot', bin: 'evet' },
  { label: 'Dişlerimi fırçalarım', img: 'toothbrush', bin: 'evet' },
  { label: 'Çöpü kutuya atarım', img: 'wastebasket', bin: 'evet' },
  { label: 'Ödevimi yaparım', img: 'notebook', bin: 'evet' },
  { label: 'Çöpü yere atarım', img: 'trash', bin: 'hayir' },
  { label: 'Ödevimi unuturum', img: 'thinking', bin: 'hayir' },
  { label: 'Oyuncakları dağınık bırakırım', img: 'teddy', bin: 'hayir' },
  { label: 'Suyu boşa akıtırım', img: 'shower', bin: 'hayir' },
  { label: 'Kitabımı yırtarım', img: 'book', bin: 'hayir' },
]
const GOREV: Metin = {
  t: 'Benim Görevlerim',
  img: 'broom',
  text: 'Benim evde görevlerim var. Sabah yatağımı toplarım. Okul çantamı kendim hazırlarım. Akşam sofrayı toplamaya yardım ederim. Yatmadan önce dişlerimi fırçalarım.',
  qs: [
    { q: 'Bu metnin konusu ne?', a: 'Evdeki görevler', w: ['Bir okul gezisi', 'Bir futbol maçı', 'Bir hayvanat bahçesi'], ex: 'Metin, çocuğun evdeki görevlerini anlatıyor.' },
    qi('Çocuk sabah ne yapar?', ['Yatağını toplar', 'bed'], [['Dişini fırçalar', 'toothbrush'], ['Sofrayı toplar', 'forkplate'], ['Çiçek sular', 'plantpot']], 'Sabah yatağını toplar.'),
    qi('Çocuk yatmadan önce ne yapar?', ['Dişlerini fırçalar', 'toothbrush'], [['Yatağını toplar', 'bed'], ['Top oynar', 'ball'], ['Çiçek sular', 'plantpot']], 'Yatmadan önce dişlerini fırçalar.'),
    { q: 'Okul çantasını kim hazırlar?', a: 'Kendisi', w: ['Annesi', 'Öğretmeni', 'Kardeşi'], ex: '“Okul çantamı kendim hazırlarım.” diyor.' },
    qi('Akşam neye yardım eder?', ['Sofrayı toplamaya', 'forkplate'], [['Araba yıkamaya', 'car'], ['Ağaç dikmeye', 'seedling'], ['Bahçe sulamaya', 'droplet']], 'Akşam sofrayı toplamaya yardım eder.'),
  ],
}
const PARK: Metin = {
  t: 'Temiz Park',
  img: 'recycle',
  text: 'Sınıfça parka gittik. Park çok kirliydi. Eldivenlerimizi taktık. Çöpleri topladık. Şişeleri geri dönüşüm kutusuna attık. Park pırıl pırıl oldu.',
  qs: [
    { q: 'Park önce nasıldı?', a: 'Kirli', w: ['Temiz', 'Kapalı', 'Karlı'], ex: 'Park çok kirliydi.' },
    qi('Çocuklar şişeleri nereye attı?', ['Geri dönüşüm kutusuna', 'recycle'], [['Yere', 'trash'], ['Göle', 'water2'], ['Ağacın dibine', 'tree']], 'Şişeleri geri dönüşüm kutusuna attılar.'),
    qi('Çocuklar ellerine ne taktı?', ['Eldiven', 'gloves'], [['Gözlük', 'glasses'], ['Taç', 'crown'], ['Saat', 'clock']], 'Eldivenlerini taktılar.'),
    { q: 'Bu metin ne anlatıyor?', a: 'Parkı temizlemeyi', w: ['Parkta top oynamayı', 'Parkta piknik yapmayı', 'Parkta uyumayı'], ex: 'Çocuklar sınıfça parkı temizledi.' },
    { q: 'Sonunda park nasıl oldu?', a: 'Pırıl pırıl', w: ['Daha kirli', 'Çamurlu', 'Karanlık'], ex: 'Park pırıl pırıl oldu.' },
  ],
}
const BASLIK8: Q[] = [
  qi('“Temiz Park” adlı metin ne anlatır?', ['Parkı temizlemeyi', 'recycle'], [['Uzaya gitmeyi', 'rocket'], ['Kek yapmayı', 'cake'], ['Yüzmeyi', 'wave']], 'Başlıkta “temiz” ve “park” sözcükleri var.', 'broom'),
  qi('“Kayıp Tavuklar” adlı metin ne anlatır?', ['Kaybolan tavukları aramayı', 'chicken'], [['Bir doğum gününü', 'cake'], ['Bir tren yolculuğunu', 'train'], ['Bir resim sergisini', 'palette']], 'Başlıkta “kayıp” ve “tavuk” sözcükleri var.', 'chicken'),
  qi('“Benim Görevlerim” adlı metin ne anlatır?', ['Evdeki görevleri', 'broom'], [['Uçak yolculuğunu', 'airplane'], ['Bir maçı', 'ball'], ['Bir masalı', 'castle']], 'Başlık, görevlerimizi anlatacağını söylüyor.', 'house'),
  qi('“Dişlerimi Fırçalıyorum” adlı metin ne anlatır?', ['Diş temizliğini', 'toothbrush'], [['Ağaç dikmeyi', 'seedling'], ['Bisiklete binmeyi', 'bicycle'], ['Şarkı söylemeyi', 'music']], 'Başlıkta “diş” ve “fırçalamak” var.', 'tooth'),
  qi('“Su Damlası” adlı metin ne anlatır?', ['Suyu boşa harcamamayı', 'droplet'], [['Ateş yakmayı', 'fire'], ['Uzayı', 'planet'], ['Bir oyuncağı', 'teddy']], 'Başlıkta “su” sözcüğü var.', 'droplet'),
  qi('“Sokaktaki Kedi” adlı metin ne anlatır?', ['Hayvanlara iyi davranmayı', 'cat'], [['Bir uçak yarışını', 'airplane'], ['Bir kar tatilini', 'snowman'], ['Bir yemek tarifini', 'cook']], 'Başlıkta “kedi” sözcüğü var.', 'cat'),
]
const HAK8_P: P[] = [
  ['Eğitim hakkı', 'Okula gidip öğrenmek', 'school'],
  ['Sağlık hakkı', 'Hastalanınca tedavi olmak', 'hospital'],
  ['Oyun hakkı', 'Arkadaşlarla oynamak', 'ball'],
  ['Beslenme hakkı', 'Sağlıklı yemek yemek', 'apple'],
  ['Düşünce hakkı', 'Fikrini söylemek', 'thinking'],
  ['Barınma hakkı', 'Güvenli bir evde yaşamak', 'house'],
]
const MIMU8: Q[] = [
  { q: 'Ali geldi ___? Boşluğa hangisi gelir?', a: 'mi', w: ['mı', 'mu', 'mü'], ex: '“geldi” sözcüğünün son sesli harfi i; bu yüzden “mi” gelir: geldi mi?' },
  { q: 'Kitabı okudun ___? Boşluğa hangisi gelir?', a: 'mu', w: ['mı', 'mi', 'mü'], ex: '“okudun” sözcüğünün son sesli harfi u; bu yüzden “mu” gelir: okudun mu?' },
  { q: 'Çöpü attın ___? Boşluğa hangisi gelir?', a: 'mı', w: ['mi', 'mu', 'mü'], ex: '“attın” sözcüğünün son sesli harfi ı; bu yüzden “mı” gelir: attın mı?' },
  { q: 'Kediyi gördün ___? Boşluğa hangisi gelir?', a: 'mü', w: ['mı', 'mi', 'mu'], ex: '“gördün” sözcüğünün son sesli harfi ü; bu yüzden “mü” gelir: gördün mü?' },
  { q: 'Sütünü içtin ___? Boşluğa hangisi gelir?', a: 'mi', w: ['mı', 'mu', 'mü'], ex: '“içtin” sözcüğünün son sesli harfi i; bu yüzden “mi” gelir: içtin mi?' },
  { q: 'Odanı topladın ___? Boşluğa hangisi gelir?', a: 'mı', w: ['mi', 'mu', 'mü'], ex: '“topladın” sözcüğünün son sesli harfi ı; bu yüzden “mı” gelir: topladın mı?' },
  { q: 'Köpek uyudu ___? Boşluğa hangisi gelir?', a: 'mu', w: ['mı', 'mi', 'mü'], ex: '“uyudu” sözcüğünün son sesli harfi u; bu yüzden “mu” gelir: uyudu mu?' },
  { q: 'Bu senin gözlüğün ___? Boşluğa hangisi gelir?', a: 'mü', w: ['mı', 'mi', 'mu'], ex: '“gözlüğün” sözcüğünün son sesli harfi ü; bu yüzden “mü” gelir: gözlüğün mü?' },
]
const OZEL8: Q[] = [
  { q: '“bilge tavukları buldu.” Doğru yazılışı hangisi?', a: 'Bilge tavukları buldu.', w: ['bilge tavukları buldu.', 'Bilge Tavukları buldu.', 'bilge Tavukları Buldu.'], ex: 'Kişi adları ve cümlenin ilk harfi büyük yazılır.', img: 'chicken' },
  { q: '“özlem parka gitti.” Doğru yazılışı hangisi?', a: 'Özlem parka gitti.', w: ['özlem parka gitti.', 'Özlem Parka gitti.', 'özlem Parka Gitti.'], ex: 'Kişi adları büyük harfle başlar.', img: 'girl' },
  { q: '“kedimizin adı pamuk.” Doğru yazılışı hangisi?', a: 'Kedimizin adı Pamuk.', w: ['kedimizin adı pamuk.', 'Kedimizin adı pamuk.', 'kedimizin Adı Pamuk.'], ex: 'Cümle büyük harfle başlar. Hayvana verilen ad da büyük harfle yazılır.', img: 'cat' },
  { q: '“biz izmir’e gittik.” Doğru yazılışı hangisi?', a: 'Biz İzmir’e gittik.', w: ['Biz izmir’e gittik.', 'biz İzmir’e gittik.', 'biz izmir’e gittik.'], ex: 'Şehir adları büyük harfle başlar.', img: 'cityscape' },
  { q: '“ahmet ile ece arkadaştır.” Doğru yazılışı hangisi?', a: 'Ahmet ile Ece arkadaştır.', w: ['Ahmet ile ece arkadaştır.', 'ahmet ile Ece arkadaştır.', 'ahmet ile ece arkadaştır.'], ex: 'Kişi adlarının ilk harfi büyük yazılır.', img: 'friends' },
]
const NOKTA8: Q[] = [
  { q: 'Ödevin bitti mi( ) Sona hangi işaret gelir?', a: SORU, w: [NOKTA, UNLEM, VIRGUL], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'notebook' },
  { q: 'Ben odamı topladım( ) Sona hangi işaret gelir?', a: NOKTA, w: [SORU, UNLEM, VIRGUL], ex: 'Bildiren cümlenin sonuna nokta konur.', img: 'broom' },
  { q: 'Dikkat, yer ıslak( ) Sona hangi işaret gelir?', a: UNLEM, w: [SORU, NOKTA, VIRGUL], ex: 'Uyarı cümlesinin sonuna ünlem konur.', img: 'droplet' },
  { q: 'Tavuklar nerede( ) Sona hangi işaret gelir?', a: SORU, w: [NOKTA, UNLEM, VIRGUL], ex: '“nerede” ile soru sorarız, sonuna soru işareti koyarız.', img: 'chicken' },
  { q: 'Kâğıt( ) şişe ve pil topladık. Boşluğa hangi işaret gelir?', a: VIRGUL, w: [NOKTA, SORU, UNLEM], ex: 'Sıralanan sözcüklerin arasına virgül konur.', img: 'recycle' },
  { q: 'Bilge( )nin tavukları kayboldu. Boşluğa hangi işaret gelir?', a: KESME, w: [NOKTA, VIRGUL, SORU], ex: 'Kişi adına gelen eki kesme işaretiyle ayırırız: Bilge’nin.', img: 'detective' },
]
const FAZLA8: Q[] = [
  { q: '“Ben – odamı – balık – topladım.” Hangi sözcük fazla?', a: 'balık', w: ['Ben', 'odamı', 'topladım'], ex: 'Cümle: “Ben odamı topladım.” “balık” fazla.', img: 'broom' },
  { q: '“Ece – çiçekleri – uçak – suladı.” Hangi sözcük fazla?', a: 'uçak', w: ['Ece', 'çiçekleri', 'suladı'], ex: 'Cümle: “Ece çiçekleri suladı.” “uçak” fazla.', img: 'plantpot' },
  { q: '“Dişlerimi – bulut – her – gece – fırçalarım.” Hangi sözcük fazla?', a: 'bulut', w: ['Dişlerimi', 'gece', 'fırçalarım'], ex: 'Cümle: “Dişlerimi her gece fırçalarım.” “bulut” fazla.', img: 'toothbrush' },
  { q: '“Çöpü – ayakkabı – kutuya – attık.” Hangi sözcük fazla?', a: 'ayakkabı', w: ['Çöpü', 'kutuya', 'attık'], ex: 'Cümle: “Çöpü kutuya attık.” “ayakkabı” fazla.', img: 'wastebasket' },
  { q: '“Bilge – tavukları – limon – buldu.” Hangi sözcük fazla?', a: 'limon', w: ['Bilge', 'tavukları', 'buldu'], ex: 'Cümle: “Bilge tavukları buldu.” “limon” fazla.', img: 'chicken' },
  { q: '“Musluğu – zürafa – kapattım.” Hangi sözcük fazla?', a: 'zürafa', w: ['Musluğu', 'kapattım'], ex: 'Cümle: “Musluğu kapattım.” “zürafa” fazla.', img: 'droplet' },
]
const T8_C: string[][] = [
  ['Ben', 'odamı', 'toplarım.'],
  ['Çöpleri', 'kutuya', 'attık.'],
  ['Bilge', 'tavukları', 'buldu.'],
  ['Dişlerimi', 'her', 'gece', 'fırçalarım.'],
  ['Çiçekleri', 'birlikte', 'suladık.'],
  ['Herkesin', 'oyun', 'hakkı', 'var.'],
]
const DIKTE8: [string, string][] = [['ev', 'house'], ['çöp', 'trash'], ['su', 'droplet'], ['tavuk', 'chicken'], ['diş', 'tooth'], ['çiçek', 'flower'], ['kedi', 'cat'], ['saksı', 'plantpot']]
const DEGER_AV = ['saygı', 'sevgi', 'yardım', 'dürüst', 'temiz', 'görev']
const NAZIK_HIT = ['Lütfen', 'Teşekkürler', 'Rica ederim', 'Günaydın', 'Özür dilerim']
const NAZIK_WRONG = ['Çekil!', 'Sus!', 'Sana ne!', 'Ver şunu!']

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
export const TR1_ADALAR: Alan[] = [
  {
    id: 't5',
    no: 5,
    title: 'Yeteneklerimizi Keşfediyoruz',
    color: '#f0504a',
    dark: '#b8302c',
    icon: 'star',
    acts: [
      { kind: 'dinle-oyun', title: 'Dinle: Oyun Saati', icon: 'ear', total: T, meb: 'T.D.1.3.c', gen: dinle(D5_BAHCE, D5_UCURTMA), ders: 'Metni dikkatle dinle. Kimler var? Ne yapıyorlar? Metin ne anlatıyor?', points: ['Kulağını aç, sessizce dinle', 'Kim, ne yaptı?', 'Metin ne anlatıyor?'], visual: img('ear') },
      { kind: 'dinle-oncesi', title: 'Daha Önce Ne Oldu?', icon: 'hourglass', total: T, meb: 'T.D.1.2.e', gen: dinle(D5_KEMAN, D5_SERGI), ders: 'Dinle ve düşün: Bu olaydan önce ne olmuş olabilir?', visual: img('hourglass') },
      { kind: 'tahmin-resim', title: 'Resimden Tahmin', icon: 'eyes', total: T, meb: 'T.D.1.2.c', gen: tahmin(TAHMIN5), ders: 'Dinlemeden önce resme bak. Resim bize metnin konusunu ipucu olarak verir.', visual: img('eyes') },
      { kind: 'selam', title: 'Merhaba Demek', icon: 'wave2', total: T, meb: 'T.K.1.1.ç', gen: ch(SELAM5), ders: 'Konuşmaya selamla başlarız: Günaydın, merhaba, hoşça kal. Kendimizi tanıtırken neyi sevdiğimizi söyleriz.', points: ['Günaydın öğretmenim', 'Merhaba arkadaşlar', 'Hoşça kal'], visual: img('wave2') },
      { kind: 'soz-sirasi', title: 'Söz Sırası', icon: 'raisedhand', total: T, meb: 'T.K.1.1.c', gen: tf(SOZ5_TF, 'raisedhand'), ders: 'Konuşmak için parmak kaldırır, sıramızı bekleriz. Arkadaşımızın sözünü kesmeyiz.', visual: img('raisedhand') },
      { kind: 'oku-yetenek', title: 'Herkesin Bir Yeteneği Var', icon: 'star', total: T, meb: 'T.O.1.3.a', gen: oku(YETENEK), ders: 'Metni oku. Her çocuk ne yapıyor? Metin ne anlatıyor?', visual: img('star') },
      { kind: 'oku-hayal', title: 'Ne Olacağım?', icon: 'thinking', total: T, meb: 'T.O.1.1.c', gen: oku(HAYAL), ders: 'Ege hayal kuruyor. Kısa cümleleri dikkatle oku.', visual: img('thinking') },
      { kind: 'baslik-tahmin', title: 'Başlıktan Tahmin', icon: 'openbook', total: T, meb: 'T.O.1.2.c', gen: ch(BASLIK5), ders: 'Okumadan önce başlığa ve resme bak. Metin ne anlatıyor olabilir?', visual: img('openbook') },
      { kind: 'oyun-bilmece', title: 'Bu Hangi Oyun?', icon: 'puzzle', total: T, meb: 'T.O.1.2.a', gen: ch(OYUN5_Q), ders: 'Bildiğin oyunları düşün. Anlatılan oyun hangisi?', visual: img('puzzle') },
      { kind: 'hece-say', title: 'Harf ve Hece Say', icon: 'abc', total: T, meb: 'T.O.1.1.a', gen: ch(HECE5_Q), ders: 'Sözcüğü yavaşça söyle, ellerinle hecele: çi-çek. 2 hece! Harfleri tek tek say: ç-i-ç-e-k. 5 harf!', points: ['çi-çek: 2 hece', 'kuş: 1 hece', 'u-çurt-ma: 3 hece'], visual: img('abc') },
      { kind: 'hece-tren', title: 'Hece Treni', icon: 'train', total: T, meb: 'T.Y.1.1.c', gen: hece(HECE5), ders: 'Heceleri doğru sıraya diz, sözcüğü oluştur.', visual: img('train') },
      { kind: 'hece-sepet', title: 'Bir mi, İki mi?', icon: 'basket', total: 4, meb: 'T.O.1.1.b', gen: srt('Sözcükleri hece sayısına göre ayır.', 'Sözcüğü söyleyip el çırparak heceleri sayarız.', HECE5_BINS, HECE5_ITEMS), ders: 'Her sözcüğü söyle, el çırp. Kaç kez çırptın? O kadar hece!', visual: img('basket') },
      { kind: 'sirala', title: 'Önce, Sonra', icon: 'link', total: T, meb: 'T.Y.1.2.e', gen: ord(T5_O), ders: 'Olaylar bir sırayla olur: önce, sonra, en sonunda.', visual: img('link') },
      { kind: 'cumle-kur', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.Y.1.3.a', gen: cumle(T5_C, 'train'), ders: 'Sözcükleri doğru sıraya dizince anlamlı bir cümle olur. Cümle büyük harfle başlar, noktayla biter.', visual: img('train') },
      { kind: 'bosluk', title: 'Boşluğu Doldur', icon: 'pencil', total: T, meb: 'T.Y.1.2.b', gen: ch(BOSLUK5), ders: 'Cümledeki boşluğa hangi sözcük uyar? Resimlere bak, düşün.', visual: img('pencil') },
      { kind: 'buyuk-nokta', title: 'Büyük Harf ve Nokta', icon: 'memo', total: T, meb: 'T.Y.1.3.d', gen: ch(YAZIM5), ders: 'Cümlenin ilk harfi büyük yazılır. Kişi adları büyük harfle başlar. Cümlenin sonuna nokta koyarız.', points: ['Ali resim yaptı.', 'Kuşlar uçtu.'], visual: img('memo') },
      { kind: 'oyun-sahne', title: 'Yetenek Sahnesi', icon: 'trophy', total: OYUN, meb: 'T.D.1.3.c', oyun: true, gen: karma(dinle(D5_BAHCE, D5_UCURTMA), oku(YETENEK, HAYAL), ch(BOSLUK5), cumle(T5_C)), ders: 'Fındık sahneye çıkıyor! Her soruda bir yıldız kazan, alkışları topla.', visual: img('trophy') },
      { kind: 'oyun-hafiza', title: 'Hece Balonları', icon: 'balloon', total: 4, meb: 'T.O.1.1.a', oyun: true, gen: rot(pop('İki heceli sözcüklerin balonlarını patlat!', 'Bu sözcükler iki hecelidir.', IKI_HECE, BIR_HECE, HECE_IMG), mem('Sözcüğü resmiyle eşleştir!', 'Sözcükler ve resimleri.', MEM5), ord(T5_O)), ders: 'Balonları patlat, kartları eşleştir!', visual: img('balloon') },
    ],
  },
  {
    id: 't6',
    no: 6,
    title: 'Minik Kâşifler',
    color: '#2ec4c9',
    dark: '#149aa0',
    icon: 'magnifier',
    acts: [
      { kind: 'dinle-bisiklet', title: 'Dinle: Bisiklet Şenliği', icon: 'bicycle', total: T, meb: 'T.D.1.2.ğ', gen: dinle(D6_BISIKLET, D6_TAS), ders: 'Dinlerken renklere, büyüklüğe ve ağırlığa dikkat et. Nesneleri özelliklerine göre ayırabilir misin?', points: ['Büyük – küçük', 'Ağır – hafif', 'Renkleri'], visual: img('bicycle') },
      { kind: 'dinle-kesif', title: 'Dinle: Kâşif Kardeşler', icon: 'ear', total: T, meb: 'T.D.1.3.c', gen: dinle(D6_BUYUTEC, D6_GECE), ders: 'Metni dikkatle dinle. Metin ne anlatıyor?', visual: img('ear') },
      { kind: 'yumusak-sert', title: 'Yumuşak mı, Sert mi?', icon: 'teddy', total: 4, meb: 'T.K.1.2.f', gen: srt('Nesneleri sepetlere ayır.', 'Dokunduğumuzda yumuşak ya da sert olan nesneler.', SERT_BINS, SERT_ITEMS), ders: 'Nesneleri anlatırken özelliklerini söyleriz: Oyuncak ayı yumuşaktır. Taş serttir.', visual: img('teddy') },
      { kind: 'tahmin-resim', title: 'Resimden Tahmin', icon: 'eyes', total: T, meb: 'T.D.1.2.c', gen: tahmin(TAHMIN6), ders: 'Dinlemeden önce resme bak. Metin ne anlatıyor olabilir?', visual: img('eyes') },
      { kind: 'selam', title: 'Kibar Sözler', icon: 'handshake', total: T, meb: 'T.K.1.1.ç', gen: ch(SELAM6), ders: 'Günün saatine ve kişiye göre selam veririz: Günaydın, iyi akşamlar, hoş geldiniz.', points: ['Günaydın', 'İyi akşamlar', 'Hoş geldiniz'], visual: img('handshake') },
      { kind: 'soz-al', title: 'Dinlerken Söz Almak', icon: 'raisedhand', total: T, meb: 'T.D.1.1.ç', gen: tf(SOZAL6_TF, 'raisedhand'), ders: 'Bir şey sormak istersen konuşma bitince elini kaldır. Söz sana gelince konuş.', visual: img('raisedhand') },
      { kind: 'oku-astronot', title: 'Uzay Yolcusu', icon: 'rocket', total: T, meb: 'T.O.1.3.a', gen: oku(ASTRONOT), ders: 'Mira’nın hayalini oku. Metin ne anlatıyor?', visual: img('rocket') },
      { kind: 'oku-ucak', title: 'Ablamın Uçağı', icon: 'airplane', total: T, meb: 'T.O.1.1.c', gen: oku(UCAK), ders: 'Kısa cümleleri dikkatle oku. Kim, ne yaptı?', visual: img('airplane') },
      { kind: 'baslik-tahmin', title: 'Başlıktan Tahmin', icon: 'openbook', total: T, meb: 'T.O.1.2.c', gen: ch(BASLIK6), ders: 'Başlık ve resim metnin konusunu gösterir. Okumadan önce tahmin et!', visual: img('openbook') },
      { kind: 'bosluk-ac', title: 'Boşluk Bırak', icon: 'ruler', total: T, meb: 'T.Y.1.3.ç', gen: ch(BOSLUK6), ders: 'Sözcükleri yazarken aralarına boşluk bırakırız. Bitişik yazılınca okunmaz!', points: ['Kuş ağaçta ötüyor.'], visual: img('ruler') },
      { kind: 'unlem', title: 'Nokta, Soru, Ünlem', icon: 'surprised', total: T, meb: 'T.Y.1.3.k', gen: ch(NOKTA6), ders: 'Bildiren cümleye nokta (.), soru cümlesine soru işareti (?), sevinç ve uyarıya ünlem (!) koyarız.', points: ['Ay parlak.', 'Saydın mı?', 'Yaşasın!'], visual: img('surprised') },
      { kind: 'ilk-harf', title: 'İlk Harf Şifresi', icon: 'key', total: T, meb: 'T.Y.1.1.c', gen: ilkHarf(ILK6), ders: 'Resimlerin adlarını söyle. İlk harflerini sırayla birleştir: ağaç + yıldız → ay!', visual: img('key') },
      { kind: 'bilmece', title: 'Kâşif Bilmeceleri', icon: 'detective', total: T, meb: 'T.O.1.2.a', gen: ch(BILMECE6), ders: 'Bilmeceyi dinle, ipuçlarını düşün, resmi bul!', visual: img('detective') },
      { kind: 'dikte', title: 'Dinle, Yaz', icon: 'headphone', total: T, meb: 'T.Y.1.1.e', gen: dikte(DIKTE6), ders: 'Sözcüğü dinle. Harfleri tek tek düşün ve sırayla yaz.', visual: img('headphone') },
      { kind: 'dikte-cumle', title: 'Duyduğun Cümle', icon: 'speaker', total: T, meb: 'T.Y.1.1.e', gen: dikteCumle(DIKTE6_C), ders: 'Cümleyi dikkatle dinle. Sözcük kartlarını duyduğun sırayla diz.', visual: img('speaker') },
      { kind: 'cumle-kur', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.Y.1.3.a', gen: cumle(T6_C, 'train'), ders: 'Sözcükleri sıraya diz, anlamlı ve kurallı bir cümle kur.', visual: img('train') },
      { kind: 'oyun-uzay', title: 'Uzay Yolculuğu', icon: 'rocket', total: OYUN, meb: 'T.Y.1.3.k', oyun: true, gen: karma(dinle(D6_BUYUTEC, D6_GECE), ch(NOKTA6), ch(BOSLUK6), ch(BILMECE6)), ders: 'Fındık roketle uzaya gidiyor! Her doğru cevap roketi bir yıldıza taşır.', visual: img('rocket') },
      { kind: 'oyun-kesif', title: 'Kâşif Çantası', icon: 'backpack', total: 4, meb: 'T.O.1.1.b', oyun: true, gen: rot(mem('Kâşif aracını işiyle eşleştir!', 'Kâşiflerin araçları.', MEM6), avi(KASIF_AV, 'Kâşif sözcüklerini bul!'), dikte(DIKTE6)), ders: 'Kâşif çantanı hazırla: kartları eşleştir, sözcükleri bul!', visual: img('backpack') },
    ],
  },
  {
    id: 't7',
    no: 7,
    title: 'Atalarımızın İzleri',
    color: '#e0a21b',
    dark: '#a8730a',
    icon: 'trflag',
    acts: [
      { kind: 'dinle-cirit', title: 'Dinle: Atlı Oyun', icon: 'horse', total: T, meb: 'T.D.1.3.c', gen: dinle(D7_CIRIT), ders: 'Atalarımızın oyunlarından biri: cirit. Dinle, metnin konusunu bul.', visual: img('horse') },
      { kind: 'dinle-oncesi', title: 'Daha Önce Ne Oldu?', icon: 'hourglass', total: T, meb: 'T.D.1.2.e', gen: dinle(D7_NISAN, D7_SANDIK), ders: 'Dinle ve düşün: Bu olaylardan önce neler olmuş olabilir?', visual: img('hourglass') },
      { kind: 'tahmin-resim', title: 'Resimden Tahmin', icon: 'eyes', total: T, meb: 'T.D.1.2.c', gen: tahmin(TAHMIN7), ders: 'Resme bak. Dinleyeceğimiz metin ne anlatıyor olabilir?', visual: img('eyes') },
      { kind: 'telefon', title: 'Alo, Merhaba!', icon: 'telephone', total: T, meb: 'T.K.1.1.ç', gen: ch(TELEFON7), ders: 'Telefonda önce selam veririz: “Alo, merhaba.” Büyüklerimize “dedeciğim, nineciğim” diye sesleniriz. Tanımadığımız kişilere bilgi vermeyiz.', points: ['Alo, merhaba', 'İyi bayramlar dedeciğim', 'Hoşça kal'], visual: img('telephone') },
      { kind: 'bayramlasma', title: 'Bayramlaşma', icon: 'gift', total: T, meb: 'T.K.1.1.a', gen: tf(BAYRAM7_TF, 'gift'), ders: 'Büyüklerimizle saygılı, arkadaşlarımızla sevgiyle konuşuruz. Kime, nasıl konuşacağımızı düşünürüz.', visual: img('gift') },
      { kind: 'oku-bayram', title: 'Bayram Ziyareti', icon: 'candy', total: T, meb: 'T.O.1.3.a', gen: oku(BAYRAM), ders: 'Elif’in bayramını oku. Kime gitti? Ne yaptı?', visual: img('candy') },
      { kind: 'oku-bayrak', title: 'Al Bayrağım', icon: 'trflag', total: T, meb: 'T.O.1.1.c', gen: oku(BAYRAK), ders: 'Bayrağımızı anlatan kısa cümleleri oku.', visual: img('trflag') },
      { kind: 'baslik-tahmin', title: 'Başlıktan Tahmin', icon: 'openbook', total: T, meb: 'T.O.1.2.c', gen: ch(BASLIK7), ders: 'Başlığa ve resme bak. Metin ne anlatıyor olabilir?', visual: img('openbook') },
      { kind: 'sirala', title: 'Olay Sırası', icon: 'link', total: T, meb: 'T.Y.1.2.e', gen: ord(T7_O), ders: 'Olayları oluş sırasına göre diz: önce, sonra, en sonunda.', visual: img('link') },
      { kind: 'buyuk-harf', title: 'Büyük Harf Avcısı', icon: 'crown', total: T, meb: 'T.Y.1.3.ı', gen: ch(BUYUK7), ders: 'Kişi, hayvan, şehir ve ülke adları büyük harfle başlar. Cümlenin ilk harfi de büyük yazılır.', points: ['Elif, Mert', 'Ankara, Türkiye', 'Karabaş'], visual: img('crown') },
      { kind: 'ozel-sepet', title: 'Büyük mü, Küçük mü?', icon: 'basket', total: 4, meb: 'T.Y.1.3.d', gen: srt('Hangileri büyük harfle başlar? Sepetlere ayır.', 'Özel adlar büyük harfle başlar.', OZEL7_BINS, OZEL7_ITEMS), ders: 'Bir kişinin, hayvanın, şehrin ya da ülkenin adı mı? O zaman büyük harfle başlar!', visual: img('basket') },
      { kind: 'noktalama', title: 'Noktalama Kutusu', icon: 'pencil', total: T, meb: 'T.Y.1.3.k', gen: ch(NOKTA7), ders: 'Nokta (.), soru işareti (?), ünlem (!), virgül (,) ve kesme işareti (’) cümlede farklı görevler yapar.', points: ['Ankara’ya gittik.', 'Elif, Ece ve Can', 'Ne var?'], visual: img('pencil') },
      { kind: 'mi-ayri', title: 'Mı, Mi Ayrı Yazılır', icon: 'scissors', total: T, meb: 'T.Y.1.3.j', gen: ch(MI7), ders: 'Soru eki mı, mi, mu, mü her zaman ayrı yazılır: buldu mu, geldi mi.', visual: img('scissors') },
      { kind: 'benzetme', title: 'Gibi Gibi', icon: 'sparkles', total: T, meb: 'T.Y.1.2.h', gen: ch(BENZ7), ders: '“gibi” sözcüğü benzetme yapar: Kar pamuk gibi beyaz. Neye benzetildiğini bul!', points: ['bal gibi tatlı', 'buz gibi soğuk'], visual: img('sparkles') },
      { kind: 'eksik-harf', title: 'Eksik Harfler', icon: 'magnifier', total: T, meb: 'T.Y.1.2.b', gen: ch(EKSIK7), ders: 'Sözcükte bazı harfler eksik. Doğru sözcüğü bul!', visual: img('magnifier') },
      { kind: 'cumle-kur', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.Y.1.3.a', gen: cumle(T7_C, 'train'), ders: 'Sözcükleri sıraya diz, anlamlı bir cümle kur. İlk sözcük büyük harfle başlar.', visual: img('train') },
      { kind: 'oyun-bayram', title: 'Bayram Yolu', icon: 'trophy', total: OYUN, meb: 'T.Y.1.3.ı', oyun: true, gen: karma(ch(BUYUK7), ch(NOKTA7), ch(MI7), oku(BAYRAM, BAYRAK)), ders: 'Fındık bayram yolunda! Her doğru cevap bir bayrak kazandırır.', visual: img('trophy') },
      { kind: 'oyun-sandik', title: 'Sihirli Sandık', icon: 'package', total: 4, meb: 'T.Y.1.2.h', oyun: true, gen: rot(mem('Benzetmeleri eşleştir!', 'Pamuk gibi yumuşak, kar gibi beyaz.', BENZ7_P), pop('Büyük harfle başlayan özel adları patlat!', 'Özel adlar büyük harfle başlar.', OZEL_HIT, OZEL_WRONG), ord(T7_O)), ders: 'Sandığı aç: kartları eşleştir, balonları patlat!', visual: img('package') },
    ],
  },
  {
    id: 't8',
    no: 8,
    title: 'Sorumluluklarımızın Farkındayız',
    color: '#22a06b',
    dark: '#137347',
    icon: 'recycle',
    acts: [
      { kind: 'dinle-tavuk', title: 'Dinle: Kayıp Tavuklar', icon: 'chicken', total: T, meb: 'T.D.1.2.ğ', gen: dinle(D8_TAVUK, D8_CIFTLIK), ders: 'Dinlerken hayvanların özelliklerine dikkat et: kaç ayaklı, kanatlı mı, tüyleri nasıl?', points: ['İki ayaklı – dört ayaklı', 'Kanatlı', 'Rengi'], visual: img('chicken') },
      { kind: 'dinle-saksi', title: 'Dinle: Kırık Saksı', icon: 'plantpot', total: T, meb: 'T.D.1.3.c', gen: dinle(D8_SAKSI), ders: 'Dinle ve metnin konusunu bul. Ahmet ne yaptı?', visual: img('plantpot') },
      { kind: 'dinle-sonra', title: 'Sonra Ne Olacak?', icon: 'thinking', total: T, meb: 'T.D.1.2.f', gen: dinle(D8_PAZAR, D8_PIKNIK), ders: 'Dinle ve tahmin et: Bundan sonra ne olacak?', visual: img('thinking') },
      { kind: 'selam', title: 'Selam ve Hitap', icon: 'wave', total: T, meb: 'T.K.1.1.ç', gen: ch(SELAM8), ders: 'Selam verir, kişilere uygun sözlerle sesleniriz: öğretmenim, anneciğim, amca. “Lütfen” ve “rica ederim” demeyi unutmayız.', visual: img('wave') },
      { kind: 'oneri', title: 'Nazikçe Öner', icon: 'handshake', total: T, meb: 'T.K.1.2.ğ', gen: ch(ONERI8), ders: 'Doğru bulmadığın bir şey mi var? Kızmadan, nazikçe öneride bulun: “Gel, birlikte yapalım.”', visual: img('handshake') },
      { kind: 'sorumluluk', title: 'Benim Sorumluluklarım', icon: 'broom', total: 4, meb: 'T.K.1.2.c', gen: srt('Davranışları sepetlere ayır.', 'Sorumluluklarımızı yerine getiririz.', SORUM_BINS, SORUM_ITEMS), ders: 'Evde ve okulda sorumluluklarımız var. Sen evde hangi görevleri yapıyorsun? Anlat!', visual: img('broom') },
      { kind: 'oku-gorev', title: 'Benim Görevlerim', icon: 'bed', total: T, meb: 'T.O.1.3.a', gen: oku(GOREV), ders: 'Metni oku. Çocuk hangi görevleri yapıyor?', visual: img('bed') },
      { kind: 'oku-park', title: 'Temiz Park', icon: 'recycle', total: T, meb: 'T.O.1.1.c', gen: oku(PARK), ders: 'Sınıfın parkta ne yaptığını oku.', visual: img('recycle') },
      { kind: 'baslik-tahmin', title: 'Başlıktan Tahmin', icon: 'openbook', total: T, meb: 'T.O.1.2.c', gen: ch(BASLIK8), ders: 'Başlığa ve resme bak. Metin ne anlatıyor olabilir?', visual: img('openbook') },
      { kind: 'haklar', title: 'Haklarımız', icon: 'shield', total: T, meb: 'T.O.1.2.b', gen: mt('Hakkı doğru durumla eşleştir.', 'Her çocuğun hakları vardır.', HAK8_P), ders: 'Her çocuğun eğitim, sağlık, oyun, beslenme ve düşüncesini söyleme hakkı vardır.', visual: img('shield') },
      { kind: 'mi-mu', title: 'Mı, Mi, Mu, Mü?', icon: 'surprised', total: T, meb: 'T.Y.1.3.j', gen: ch(MIMU8), ders: 'Sözcüğün son sesli harfine bak: a, ı → mı; e, i → mi; o, u → mu; ö, ü → mü. Soru eki ayrı yazılır.', points: ['attın mı?', 'geldi mi?', 'okudun mu?', 'gördün mü?'], visual: img('surprised') },
      { kind: 'ozel-ad', title: 'Adları Düzelt', icon: 'crown', total: T, meb: 'T.Y.1.3.ı', gen: ch(OZEL8), ders: 'Kişi, hayvan ve şehir adları büyük harfle başlar. Cümlenin ilk harfi de büyük yazılır.', visual: img('crown') },
      { kind: 'noktalama', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.1.3.k', gen: ch(NOKTA8), ders: 'Cümlenin sonuna nokta, soru işareti ya da ünlem gelir. Sıralanan sözcüklerin arasına virgül konur.', visual: img('pencil') },
      { kind: 'fazla-kelime', title: 'Fazla Sözcük', icon: 'wastebasket', total: T, meb: 'T.Y.1.3.ğ', gen: ch(FAZLA8), ders: 'Bir sözcük cümleye uymuyor. Onu bul, kalanlarla anlamlı bir cümle kur.', visual: img('wastebasket') },
      { kind: 'cumle-kur', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.Y.1.3.a', gen: cumle(T8_C, 'train'), ders: 'Sözcükleri sıraya diz, anlamlı ve kurallı bir cümle kur.', visual: img('train') },
      { kind: 'dikte', title: 'Dinle, Yaz', icon: 'headphone', total: T, meb: 'T.Y.1.1.e', gen: dikte(DIKTE8), ders: 'Sözcüğü dinle. Harfleri sırayla yaz.', visual: img('headphone') },
      { kind: 'oyun-gorev', title: 'Görev Yolu', icon: 'trophy', total: OYUN, meb: 'T.Y.1.3.j', oyun: true, gen: karma(dinle(D8_TAVUK, D8_SAKSI), ch(MIMU8), ch(OZEL8), oku(GOREV, PARK)), ders: 'Fındık görev yolunda! Her doğru cevap bir görev rozeti kazandırır.', visual: img('trophy') },
      { kind: 'oyun-avci', title: 'Değer Avcısı', icon: 'medal', total: 4, meb: 'T.O.1.1.b', oyun: true, gen: rot(avi(DEGER_AV, 'Değer sözcüklerini bul!'), mem('Hakkı durumla eşleştir!', 'Çocuk hakları.', HAK8_P), pop('Nazik sözlerin balonlarını patlat!', 'Bunlar nazik sözlerdir.', NAZIK_HIT, NAZIK_WRONG)), ders: 'Sözcükleri bul, kartları eşleştir, balonları patlat!', visual: img('medal') },
    ],
  },
]
