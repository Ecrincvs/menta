/**
 * 2. SINIF TÜRKÇE YOLU — 2. sınıf Türkçe ders kitabının 8 teması, her tema bir "ada":
 * okuma parçaları, sözlük, dil becerileri (noktalama, büyük harf, zıt anlam, benzetme, mı/mi, kısaltma,
 * kesme işareti, bağlaçlar, neden–sonuç), olay sıralama, cümle kurma + sonda 2 oyun.
 * Kaynak: docs/meb-kitaplar/analiz/turkce-2.md. Okuma parçaları analizin §4'teki özgün metinleridir;
 * kitap metni kopyalanmadı.
 * 2. sınıf sınırları (§3): eş anlam, eş sesli, atasözü/deyim terimi, sözcük türleri YOK.
 * Hassas konular (§5): kişisel veri istenmez (mektup/e-posta adları hayalî), savaş/şiddet görseli yok,
 * afetler yalnızca önlem diliyle, sokak hayvanına bir büyükle ve uzaktan yardım, 4 basamaklı yıl yok.
 */
import { pick, shuffle } from '../../learning/rng'
import { order, type Gen } from './helpers'
import type { SortQ } from '../../games/quiz/types'
import { wordSearch } from './harfEtkinlik'
import { ch, dinle, fresh, img, karma, mem, mkChoice, mt, ord, pop, rot, srt, tf, type Alan, type Dinleme, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

/* ============================ yerel üreticiler ============================ */
/** Okuma parçası + soruları (parça sorunun üstünde gösterilir) */
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
/** son birkaç soruda olmayan bir sıralama öğesi seç */
function taze(rng: Parameters<Gen>[0], bank: string[][], h: Parameters<Gen>[3]): string[] {
  const recent = new Set(h.slice(-3).map((q) => (q.type === 'order' ? q.pieces.join('|') : '')))
  const pool = bank.filter((w) => !recent.has(w.join('|')))
  return pick(rng, pool.length ? pool : bank)
}
/** Karışık sözcüklerden cümle kur */
const cumle = (bank: string[][], im?: string): Gen => (rng, _g, _l, h) => {
  const w = taze(rng, bank, h)
  return order({ prompt: 'Sözcükleri sırala, cümle kur.', explain: `Doğru cümle: “${w.join(' ')}”`, pieces: w, joiner: ' ', style: 'train', img: im })
}
/** Heceleri birleştirip sözcük kur */
const hece = (bank: string[][], im?: string): Gen => (rng, _g, _l, h) => {
  const w = taze(rng, bank, h)
  return order({ prompt: 'Heceleri sırala, sözcüğü bul.', explain: `${w.join('-')}: “${w.join('')}”`, pieces: w, joiner: '', style: 'train', img: im })
}
const ABC = 'abcçdefgğhıijklmnoöprsştuüvyz'.split('')
/** Kelime avı (en çok 7 harflik sözcükler) */
const avi = (words: string[], prompt: string): Gen => (rng) => wordSearch(rng, shuffle(rng, words).slice(0, 4), ABC, prompt)

const T = 6 // tur sayısı
const OYUN = 8

/* ================================================================================================
 * TEMA 1 · DEĞERLERİMİZLE VARIZ
 * ================================================================================================ */
const SEMSIYE: Metin = {
  t: 'Paylaşılan Şemsiye',
  img: 'umbrella',
  text: 'Okul çıkışında birden yağmur başladı. Ece’nin şemsiyesi vardı ama arkadaşı Kaan’ın yoktu. Ece, “Gel, ikimiz de sığarız.” dedi. İki arkadaş yan yana yürüyüp eve kuru vardı. Kaan, “Teşekkür ederim, çok naziksin.” dedi.',
  qs: [
    { q: 'Kimin şemsiyesi yoktu?', a: 'Kaan’ın', w: ['Ece’nin', 'Öğretmenin', 'Annesinin'], ex: 'Kaan’ın şemsiyesi yoktu. Ece şemsiyesini paylaştı.' },
    { q: 'Ece ne yaptı?', a: 'Şemsiyesini paylaştı', w: ['Eve koştu', 'Şemsiyesini kapattı', 'Kaan’ı bekletti'], ex: 'Ece, “Gel, ikimiz de sığarız.” diyerek şemsiyesini paylaştı.' },
    { q: 'Paylaşılan Şemsiye metni en çok neyi anlatıyor?', a: 'Arkadaşa yardım etmeyi', w: ['Yağmurun yağmasını', 'Okulun bitmesini', 'Şemsiye almayı'], ex: 'Metnin konusu arkadaşa yardım etmektir.' },
    { q: 'Kaan, Ece’ye ne dedi?', a: 'Teşekkür ederim', w: ['Hoşça kal', 'Günaydın', 'Afiyet olsun'], ex: 'Kaan nazik davranıp teşekkür etti.' },
    { q: 'Yağmur ne zaman başladı?', a: 'Okul çıkışında', w: ['Sabah erkenden', 'Teneffüste', 'Gece yarısı'], ex: 'Yağmur okul çıkışında başladı.' },
  ],
}
const DEFNE: Metin = {
  t: 'Defne’nin Görevi',
  img: 'fish',
  text: 'Defne’nin evdeki görevi akvaryumdaki balıkları beslemekti. Bir sabah servise geç kalacağını düşündü. Yine de durdu ve balıklara yemlerini verdi. Sonra hızlı adımlarla servise yetişti. Akşam balıklar onu neşeyle karşıladı.',
  qs: [
    { q: 'Defne’nin evdeki görevi neydi?', a: 'Balıkları beslemek', w: ['Çiçek sulamak', 'Sofrayı kurmak', 'Kediyi beslemek'], ex: 'Defne akvaryumdaki balıkları besliyordu.' },
    { q: 'Defne geç kalacakken ne yaptı?', a: 'Önce balıkları besledi', w: ['Balıkları unuttu', 'Servisi kaçırdı', 'Okula gitmedi'], ex: 'Geç kalacak olsa da görevini yaptı.' },
    { q: 'Balıklar akşam Defne’yi nasıl karşıladı?', a: 'Neşeyle', w: ['Üzgün', 'Kızgın', 'Uykulu'], ex: 'Balıklar onu neşeyle karşıladı.' },
    { q: 'Defne’nin hikâyesi en çok neyi anlatıyor?', a: 'Sorumluluk almayı', w: ['Servise binmeyi', 'Balık türlerini', 'Sabah kahvaltısını'], ex: 'Defne sorumluluğunu yerine getirdi.' },
    { q: 'Defne servise nasıl yetişti?', a: 'Hızlı adımlarla', w: ['Bisikletle', 'Arabayla', 'Uçarak'], ex: 'Hızlı adımlarla yürüyüp servise yetişti.' },
  ],
}
const DEGER_P: P[] = [
  ['Saygı', 'Başkalarına değer vermek', 'handshake'],
  ['Nezaket', 'Kibar ve ince davranmak', 'heart'],
  ['Sorumluluk', 'Görevini yerine getirmek', 'key'],
  ['Sevgi', 'Birini içten sevmek', 'hug'],
  ['Çalışkanlık', 'Emek vermeyi sevmek', 'ant'],
  ['Öz denetim', 'Kendini kontrol etmek', 'stopsign'],
  ['Azim', 'Pes etmeden çalışmak', 'biceps'],
]
const SOZ1_Q: Q[] = [
  { q: 'Kuş, gagasıyla tohumu aldı. “Gaga” ne demek?', a: 'Kuşun ağzı', w: ['Kuşun kanadı', 'Kuşun yuvası', 'Kuşun ayağı'], ex: 'Gaga, kuşun ağzıdır.', img: 'bird' },
  { q: 'Ninem kardeşime ninni söyledi. “Ninni” ne demek?', a: 'Bebeği uyutan ezgi', w: ['Bir oyun', 'Bir yemek', 'Bir oyuncak'], ex: 'Ninni, bebeği uyutmak için söylenir.', img: 'baby' },
  { q: 'Tavuklar akşam kümese girdi. “Kümes” ne demek?', a: 'Tavukların evi', w: ['Kuşların yuvası', 'Atların ahırı', 'Balıkların gölü'], ex: 'Kümes, tavukların barındığı yerdir.', img: 'chicken' },
  { q: 'Hava soğuktu, montunu giydi. “Mont” ne demek?', a: 'Kalın dış giysi', w: ['Yazlık şapka', 'Ayakkabı', 'Pijama'], ex: 'Mont, soğukta giydiğimiz kalın giysidir.', img: 'snowflake' },
  { q: 'Can düştü ama pes etmedi. “Pes etmek” ne demek?', a: 'Vazgeçmek', w: ['Koşmak', 'Gülmek', 'Sevinmek'], ex: 'Pes etmek, vazgeçmek demektir.', img: 'bicycle' },
  { q: 'Bahçeye tohum ektik. “Tohum” ne demek?', a: 'Ekilince filizlenen tane', w: ['Bir meyve suyu', 'Bahçe kapısı', 'Bir çiçek adı'], ex: 'Tohum toprağa ekilince filizlenir.', img: 'seedling' },
]
const SOZ1_P: P[] = [
  ['tohum', 'Ekilince filizlenen tane'],
  ['ninni', 'Bebeği uyutan ezgi'],
  ['mont', 'Kalın dış giysi'],
  ['gaga', 'Kuşun ağzı'],
  ['kümes', 'Tavukların evi'],
  ['pes etmek', 'Vazgeçmek'],
  ['sevinç', 'Mutluluk duygusu'],
]
const NOKTA1_Q: Q[] = [
  { q: 'Ben 2( ) sınıftayım. Boşluğa ne gelir?', a: 'Nokta', w: ['Virgül', 'Soru işareti', 'Ünlem'], ex: 'Sıra bildiren sayıdan sonra nokta konur: 2. sınıf.', img: 'school' },
  { q: 'Ders saat 10( )30’da başlar. Boşluğa ne gelir?', a: 'Nokta', w: ['Virgül', 'Soru işareti', 'Ünlem'], ex: 'Saat ile dakika arasına nokta konur: 10.30.', img: 'clock' },
  { q: 'Hale( ) Zeynep ve Mehmet geldi. Boşluğa ne gelir?', a: 'Virgül', w: ['Nokta', 'Soru işareti', 'Ünlem'], ex: 'Sıralanan adların arasına virgül konur.', img: 'friends' },
  { q: 'Sevgili Çocuklar( ) hoş geldiniz. Boşluğa ne gelir?', a: 'Virgül', w: ['Nokta', 'Soru işareti', 'İki nokta'], ex: 'Hitap sözünden sonra virgül konur.', img: 'teacher' },
  { q: 'Bugün parkta oynadık( ) Sona ne gelir?', a: 'Nokta', w: ['Virgül', 'Soru işareti', 'Tırnak işareti'], ex: 'Bildiren cümlenin sonuna nokta konur.', img: 'ball' },
  { q: 'Başkasının sözünü yazarken hangi işaret kullanılır?', a: 'Tırnak işareti', w: ['Virgül', 'Nokta', 'Soru işareti'], ex: 'Başkasının sözü tırnak içinde yazılır.', img: 'memo' },
  { q: 'Bebeğe biberon( ) patik ve tulum aldık. Boşluğa ne gelir?', a: 'Virgül', w: ['Nokta', 'Soru işareti', 'Ünlem'], ex: 'Sıralanan sözcüklerin arasına virgül konur.', img: 'baby' },
  { q: 'Yarışmada 1( ) oldum. Boşluğa ne gelir?', a: 'Nokta', w: ['Virgül', 'Soru işareti', 'Tırnak işareti'], ex: 'Sıra bildiren sayıdan sonra nokta konur: 1. oldum.', img: 'trophy' },
]
const NAZIK_ITEMS: SortQ['items'] = [
  { label: 'Sıra beklemek', img: 'raisedhand', bin: 'nazik' },
  { label: 'Selam almak', img: 'wave2', bin: 'nazik' },
  { label: 'Özür dilemek', img: 'hug', bin: 'nazik' },
  { label: 'Teşekkür etmek', img: 'heart', bin: 'nazik' },
  { label: '“Lütfen” demek', img: 'handshake', bin: 'nazik' },
  { label: 'Söz kesmek', img: 'shush', bin: 'kaba' },
  { label: 'Bağırmak', img: 'angry', bin: 'kaba' },
  { label: 'İzinsiz eşya almak', img: 'noentry', bin: 'kaba' },
  { label: 'Sırayı bozmak', img: 'running', bin: 'kaba' },
  { label: 'Selamı duymazdan gelmek', img: 'thumbsdown', bin: 'kaba' },
]
const NAZIK_BINS: SortQ['bins'] = [
  { id: 'nazik', label: 'Nazik davranış', img: 'happy', color: '#22c55e' },
  { id: 'kaba', label: 'Kaba davranış', img: 'sad', color: '#f97316' },
]
const NAZIK_HIT = ['Teşekkür ederim', 'Lütfen', 'Özür dilerim', 'Rica ederim', 'Günaydın', 'Hoş geldin']
const NAZIK_WRONG = ['Çekil!', 'Sana ne!', 'Ver şunu!', 'Bana karışma!', 'Sus!']
const T1_O: O[] = [
  { q: 'İyilik zincirini sırala.', s: ['Biri iyilik yapar', 'İyilik gören sevinir', 'O da iyilik yapar', 'Dünya güzelleşir'], ex: 'İyilik çoğaldıkça dünya güzelleşir.', img: 'heart' },
  { q: 'Defne’nin sabahını sırala.', s: ['Balıkları besledi', 'Servise koştu', 'Akşam eve döndü', 'Balıklar onu karşıladı'], ex: 'Önce görev, sonra servis!', img: 'fish' },
  { q: 'İki kardeşin hikâyesini sırala.', s: ['Dayıları bisiklet aldı', 'Binmeyi denediler', 'Defalarca düştüler', 'Pes etmeyip başardılar'], ex: 'Azimle çalışan başarır.', img: 'bicycle' },
  { q: 'Horozun gününü sırala.', s: ['Erkenden uyandı', 'Fırtınada yola çıktı', 'Öttüğü yere ulaştı', 'Işıklar yanana kadar öttü'], ex: 'Horoz görevini zorluğa rağmen tamamladı.', img: 'rooster' },
]
const T1_C: string[][] = [
  ['Ece', 'şemsiyesini', 'arkadaşıyla', 'paylaştı.'],
  ['Nazik', 'sözler', 'içimizi', 'ısıtır.'],
  ['Defne', 'balıklarını', 'her', 'sabah', 'besler.'],
  ['Büyüklerimize', 'saygı', 'gösteririz.'],
  ['Kardeşler', 'bisiklete', 'binmeyi', 'öğrendi.'],
  ['Horoz', 'sabahı', 'yüksek', 'sesle', 'duyurdu.'],
]
const T1_TF: TF[] = [
  ['Sırada beklemek nazik bir davranıştır.', true, 'Sıramızı sabırla bekleriz.'],
  ['Konuşanın sözünü keseriz.', false, 'Konuşan kişinin sözünü bitirmesini bekleriz.'],
  ['Hata yapınca özür dileriz.', true, 'Özür dilemek nezakettir.'],
  ['Başkasının eşyasını izinsiz alırız.', false, 'Eşyaları izin isteyerek kullanırız.'],
  ['Horoz fırtına çıkınca görevini bıraktı.', false, 'Horoz zorlansa da görevini tamamladı.'],
  ['İki kardeş düşünce pes etmedi.', true, 'Azimle çalışıp bisiklete binmeyi öğrendiler.'],
  ['Hitap sözünden sonra virgül konur.', true, 'Sevgili Arkadaşım, ...'],
  ['Saat ile dakika arasına virgül konur.', false, 'Saat ile dakika arasına nokta konur: 10.30.'],
]
const HECE_Q: Q[] = [
  { q: '“gemi” sözcüğü kaç hecelidir?', a: '2', w: ['1', '3', '4'], ex: 'ge-mi: 2 hece.', img: 'ship' },
  { q: '“çanta” sözcüğü kaç hecelidir?', a: '2', w: ['1', '3', '4'], ex: 'çan-ta: 2 hece.', img: 'backpack' },
  { q: '“kalp” sözcüğü kaç hecelidir?', a: '1', w: ['2', '3', '4'], ex: 'kalp: 1 hece.', img: 'heart' },
  { q: '“otobüs” sözcüğü kaç hecelidir?', a: '3', w: ['1', '2', '4'], ex: 'o-to-büs: 3 hece.', img: 'bus' },
  { q: '“papatya” sözcüğü kaç hecelidir?', a: '3', w: ['1', '2', '4'], ex: 'pa-pat-ya: 3 hece.', img: 'flower' },
  { q: '“kaplumbağa” sözcüğü kaç hecelidir?', a: '4', w: ['1', '2', '3'], ex: 'kap-lum-ba-ğa: 4 hece.', img: 'turtle' },
]
const HECE1: string[][] = [['ge', 'mi'], ['o', 'to', 'büs'], ['pa', 'pat', 'ya'], ['ke', 'le', 'bek'], ['kap', 'lum', 'ba', 'ğa'], ['çan', 'ta']]

/* ================================================================================================
 * TEMA 2 · ATATÜRK VE ÇOCUK
 * ================================================================================================ */
const BAYRAK: Metin = {
  t: 'Balkondaki Bayrak',
  img: 'trflag',
  text: '29 Ekim sabahı Yusuf erkenden uyandı. Babasıyla birlikte balkona bayrak astılar. Karşı evdeki komşular da bayraklarını asmıştı. Sokak kırmızı beyaza büründü. Yusuf okulda Cumhuriyet ile ilgili bir şiir okudu.',
  qs: [
    { q: 'Bu olay hangi gün oldu?', a: '29 Ekim', w: ['23 Nisan', '19 Mayıs', '30 Ağustos'], ex: 'Olay 29 Ekim sabahı, Cumhuriyet Bayramı’nda oldu.' },
    { q: 'Yusuf babasıyla ne yaptı?', a: 'Balkona bayrak astı', w: ['Pasta yaptı', 'Parka gitti', 'Kitap okudu'], ex: 'Babasıyla balkona bayrak astılar.' },
    { q: 'Yusuf okulda ne yaptı?', a: 'Şiir okudu', w: ['Resim yaptı', 'Top oynadı', 'Şarkı dinledi'], ex: 'Cumhuriyet ile ilgili bir şiir okudu.' },
    { q: 'Sokak hangi renklere büründü?', a: 'Kırmızı beyaz', w: ['Mavi yeşil', 'Sarı mor', 'Siyah turuncu'], ex: 'Bayraklarla sokak kırmızı beyaza büründü.' },
    { q: '29 Ekim hangi bayramdır?', a: 'Cumhuriyet Bayramı', w: ['Zafer Bayramı', 'Çocuk Bayramı', 'Gençlik ve Spor Bayramı'], ex: '29 Ekim Cumhuriyet Bayramı’dır.' },
  ],
}
const ZEHRA: Metin = {
  t: 'Zehra’nın Sınıfı',
  img: 'teddy',
  text: 'Zehra her akşam oyuncak ayılarını sıraya dizer. Onlara harfleri ve sayıları anlatır. Dedesi gülümseyerek “Sen iyi bir öğretmen olursun!” der. Zehra okumayı çok sever. Büyüyünce çocuklara okumayı öğretmek istiyor.',
  qs: [
    { q: 'Zehra oyuncak ayılarına neler anlatır?', a: 'Harfleri ve sayıları', w: ['Masalları', 'Yemek tariflerini', 'Şarkıları'], ex: 'Ayılarına harfleri ve sayıları anlatır.' },
    { q: 'Dedesinin sözünün sonunda hangi işaret var?', a: 'Ünlem', w: ['Soru işareti', 'Virgül', 'İki nokta'], ex: '“Sen iyi bir öğretmen olursun!” Sonunda ünlem var.' },
    { q: 'Zehra büyüyünce ne olmak istiyor?', a: 'Öğretmen', w: ['Doktor', 'Pilot', 'Aşçı'], ex: 'Çocuklara okumayı öğretmek istiyor.' },
    { q: 'Zehra ayılarını ne zaman sıraya dizer?', a: 'Her akşam', w: ['Her sabah', 'Teneffüste', 'Bayramda'], ex: 'Her akşam ayılarını sıraya dizer.' },
    { q: 'Zehra neyi çok sever?', a: 'Okumayı', w: ['Uyumayı', 'Koşmayı', 'Bağırmayı'], ex: 'Zehra okumayı çok sever.' },
  ],
}
const SOZ2_P: P[] = [
  ['şenlik', 'Eğlenceli kutlama'],
  ['vatan', 'Yaşadığımız, sevdiğimiz ülke'],
  ['zafer', 'Kazanılan büyük başarı'],
  ['marş', 'Topluca söylenen coşkulu ezgi'],
  ['istasyon', 'Tren durağı'],
  ['toplum', 'Bir arada yaşayan insanlar'],
  ['kahraman', 'Cesur, yararlık gösteren kişi'],
]
const BUYUK_Q: Q[] = [
  { q: 'Ülke adı hangisinde doğru yazılmış?', a: 'Türkiye', w: ['türkiye', 'tÜrkiye', 'türKiye'], ex: 'Ülke adları büyük harfle başlar.', img: 'trflag' },
  { q: 'Şehir adı hangisinde doğru yazılmış?', a: 'Sivas', w: ['sivas', 'siVas', 'sİvas'], ex: 'Şehir adları büyük harfle başlar.', img: 'cityscape' },
  { q: '“dedemle çanakkale’ye gittik.” Hangileri büyük harfle başlamalı?', a: 'İkisi de', w: ['Yalnız dedemle', 'Yalnız çanakkale’ye', 'Hiçbiri'], ex: 'Cümle başı ve yer adı büyük harfle başlar: Dedemle Çanakkale’ye gittik.', img: 'map' },
  { q: 'Bayram adı hangisinde doğru yazılmış?', a: 'Cumhuriyet Bayramı', w: ['cumhuriyet bayramı', 'Cumhuriyet bayramı', 'cumhuriyet Bayramı'], ex: 'Bayram adlarının her sözcüğü büyük harfle başlar.', img: 'trflag' },
  { q: 'Kurum adı hangisinde doğru yazılmış?', a: 'Türkiye Büyük Millet Meclisi', w: ['türkiye büyük millet meclisi', 'Türkiye büyük millet meclisi', 'Türkiye Büyük millet meclisi'], ex: 'Kurum adlarının her sözcüğü büyük harfle başlar.', img: 'classical' },
  { q: 'Kedimizin adı Pamuk. Hangisi doğru yazılmış?', a: 'Pamuk', w: ['pamuk', 'pAmuk', 'paMuk'], ex: 'Hayvanlara verilen adlar büyük harfle başlar.', img: 'cat' },
  { q: 'Hangi sözcük büyük harfle başlamaz?', a: 'kalem', w: ['Ankara', 'Türkiye', 'Anıtkabir'], ex: 'kalem bir özel ad değildir.', img: 'pencil' },
]
const OZEL_ITEMS: SortQ['items'] = [
  { label: 'Ankara', img: 'cityscape', bin: 'buyuk' },
  { label: 'Türkiye', img: 'trflag', bin: 'buyuk' },
  { label: 'Azerbaycan', img: 'globe', bin: 'buyuk' },
  { label: 'Anıtkabir', img: 'classical', bin: 'buyuk' },
  { label: 'Mırmır (kedi adı)', img: 'cat', bin: 'buyuk' },
  { label: 'kalem', img: 'pencil', bin: 'kucuk' },
  { label: 'kedi', img: 'paw', bin: 'kucuk' },
  { label: 'kitap', img: 'book', bin: 'kucuk' },
  { label: 'okul', img: 'school', bin: 'kucuk' },
  { label: 'şehir', img: 'houses', bin: 'kucuk' },
]
const OZEL_BINS: SortQ['bins'] = [
  { id: 'buyuk', label: 'Büyük harfle başlar', img: 'star', color: '#ef4444' },
  { id: 'kucuk', label: 'Küçük harfle başlar', img: 'pencil', color: '#3b82f6' },
]
const OZEL_HIT = ['Ankara', 'Türkiye', 'Sivas', 'Anıtkabir', 'Mardin', 'Kıbrıs']
const OZEL_WRONG = ['kalem', 'okul', 'bayrak', 'kedi', 'defter']
const ZIT2_P: P[] = [
  ['acı', 'tatlı'],
  ['ağır', 'hafif'],
  ['ileri', 'geri'],
  ['yukarı', 'aşağı'],
  ['boş', 'dolu'],
  ['düzenli', 'dağınık'],
  ['hasta', 'sağlıklı'],
  ['üzgün', 'mutlu'],
  ['zayıf', 'güçlü'],
  ['kısa', 'uzun'],
  ['çirkin', 'güzel'],
]
const ZIT2_HIT = ['acı – tatlı', 'boş – dolu', 'ileri – geri', 'kısa – uzun', 'zayıf – güçlü', 'hasta – sağlıklı']
const ZIT2_WRONG = ['acı – ağır', 'boş – kısa', 'ileri – yukarı', 'uzun – güzel', 'mutlu – dolu']
const UNLEM_Q: Q[] = [
  { q: 'Yaşasın( ) Boşluğa hangi işaret gelir?', a: 'Ünlem', w: ['Soru işareti', 'Virgül', 'İki nokta'], ex: 'Sevinç bildiren sözden sonra ünlem konur.', img: 'party' },
  { q: 'Ezberledin mi( ) Boşluğa hangi işaret gelir?', a: 'Soru işareti', w: ['Ünlem', 'Nokta', 'Virgül'], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'thinking' },
  { q: 'Dur( ) Yol çok kaygan. İlk boşluğa ne gelir?', a: 'Ünlem', w: ['Soru işareti', 'Virgül', 'İki nokta'], ex: 'Uyarı sözünden sonra ünlem konur.', img: 'stopsign' },
  { q: 'Nasılsın( ) Boşluğa hangi işaret gelir?', a: 'Soru işareti', w: ['Ünlem', 'Nokta', 'Virgül'], ex: 'Soru soruyorsak soru işareti koyarız.', img: 'wave2' },
  { q: 'Bayrağımızın renkleri( ) kırmızı ve beyaz. Boşluğa ne gelir?', a: 'İki nokta', w: ['Ünlem', 'Soru işareti', 'Virgül'], ex: 'Açıklamadan önce iki nokta konur.', img: 'trflag' },
  { q: 'Harika( ) Boşluğa hangi işaret gelir?', a: 'Ünlem', w: ['Soru işareti', 'Virgül', 'İki nokta'], ex: 'Sevinç ve şaşkınlık bildiren sözden sonra ünlem konur.', img: 'sparkles' },
]
const NEDEN2_Q: Q[] = [
  { q: 'Bayram olduğu için ... Hangisi gelir?', a: 'sokaklar bayraklarla süslendi', w: ['kalemim kırıldı', 'kedi uyudu', 'kar yağdı'], ex: 'Neden: bayram olması. Sonuç: sokakların süslenmesi.', img: 'trflag' },
  { q: 'Ali geç yattığı için ... Hangisi gelir?', a: 'sabah uyanamadı', w: ['erken uyandı', 'çok dinlendi', 'kahvaltı hazırladı'], ex: 'Geç yatmak, sabah uyanamamaya neden olur.', img: 'bed' },
  { q: 'Zehra çok kitap okuduğu için ... Hangisi gelir?', a: 'yeni sözcükler öğrendi', w: ['kitapları kaybetti', 'okumayı unuttu', 'kitaplara küstü'], ex: 'Okumak yeni sözcükler kazandırır.', img: 'books' },
  { q: 'Yağmur yağdığı için ... Hangisi gelir?', a: 'şemsiyemizi açtık', w: ['güneş gözlüğü taktık', 'denize girdik', 'kardan adam yaptık'], ex: 'Yağmur, şemsiye açmamızın nedenidir.', img: 'umbrella' },
  { q: 'Kerem neden üşüdü?', a: 'Montunu giymediği için', w: ['Çok su içtiği için', 'Kitap okuduğu için', 'Şarkı söylediği için'], ex: 'Soğukta mont giymezsek üşürüz.', img: 'snowflake' },
  { q: 'Çiçekler neden soldu?', a: 'Sulanmadığı için', w: ['Resmi yapıldığı için', 'Şarkı söylendiği için', 'Koklandığı için'], ex: 'Su verilmeyen çiçekler solar.', img: 'tulip' },
]
const BAYRAM2_P: P[] = [
  ['29 Ekim', 'Cumhuriyet Bayramı'],
  ['23 Nisan', 'Ulusal Egemenlik ve Çocuk Bayramı'],
  ['19 Mayıs', 'Gençlik ve Spor Bayramı'],
  ['30 Ağustos', 'Zafer Bayramı'],
  ['24 Kasım', 'Öğretmenler Günü'],
]
const MESLEK2_Q: Q[] = [
  { q: 'Hastaları muayene ederim. Ben kimim?', a: 'Doktor', w: ['Manav', 'Şoför', 'Ressam'], ex: 'Doktor hastaları muayene eder.', img: 'stethoscope' },
  { q: 'Meyve ve sebze satarım. Ben kimim?', a: 'Manav', w: ['Polis', 'Doktor', 'Öğretmen'], ex: 'Manav meyve ve sebze satar.', img: 'basket' },
  { q: 'Fırçamla tablo yaparım. Ben kimim?', a: 'Ressam', w: ['Şoför', 'Manav', 'Polis'], ex: 'Ressam resim yapar.', img: 'palette' },
  { q: 'Otobüsü ben kullanırım. Ben kimim?', a: 'Şoför', w: ['Ressam', 'Doktor', 'Öğretmen'], ex: 'Şoför aracı kullanır.', img: 'bus' },
  { q: 'Güvenliğimizi korurum. Ben kimim?', a: 'Polis', w: ['Manav', 'Ressam', 'Doktor'], ex: 'Polis güvenliğimizi korur.', img: 'policeofficer' },
  { q: 'Sınıfta ders anlatırım. Ben kimim?', a: 'Öğretmen', w: ['Şoför', 'Manav', 'Polis'], ex: 'Öğretmen bize ders anlatır.', img: 'teacher' },
]
const T2_O: O[] = [
  { q: 'Hafta sonu sabahını sırala.', s: ['Erken kalktı', 'Kahvaltı yaptı', 'Annesine yardım etti', 'Oyun oynadı', 'Masal kitabı okudu'], ex: 'Güne erken başlayan çok şey yapar.', img: 'sunrise' },
  { q: 'Yusuf’un bayram sabahını sırala.', s: ['Yusuf erkenden uyandı', 'Balkona bayrak astılar', 'Sokak kırmızı beyaz oldu', 'Okulda şiir okudu'], ex: 'Bayram sabahı bayraklar asıldı.', img: 'trflag' },
  { q: 'Zehra’nın akşamını sırala.', s: ['Ayılarını sıraya dizdi', 'Harfleri anlattı', 'Dedesi gülümsedi', '“İyi öğretmen olursun!” dedi'], ex: 'Zehra öğretmencilik oynadı.', img: 'teddy' },
]
const T2_C: string[][] = [
  ['Atatürk', 'çocukları', 'çok', 'severdi.'],
  ['Yusuf', 'balkona', 'bayrak', 'astı.'],
  ['Zehra', 'öğretmen', 'olmak', 'istiyor.'],
  ['Bayramda', 'sokaklar', 'bayraklarla', 'süslendi.'],
  ['Çocuklar', 'geleceğin', 'güvencesidir.'],
]
const T2_TF: TF[] = [
  ['Ülke adları büyük harfle başlar.', true, 'Türkiye, Azerbaycan gibi.'],
  ['Şehir adları küçük harfle başlar.', false, 'Şehir adları büyük harfle başlar: Ankara.'],
  ['Sevinç bildiren cümlenin sonuna ünlem konur.', true, 'Yaşasın!'],
  ['Soru cümlesinin sonuna nokta konur.', false, 'Soru cümlesinin sonuna soru işareti konur.'],
  ['“Ağır” sözcüğünün zıttı “hafif”tir.', true, 'Ağır ve hafif zıt anlamlıdır.'],
  ['“Boş” sözcüğünün zıttı “kısa”dır.', false, '“Boş” sözcüğünün zıttı “dolu”dur.'],
  ['29 Ekim Cumhuriyet Bayramı’dır.', true, 'Cumhuriyet Bayramı’nı coşkuyla kutlarız.'],
  ['Atatürk çocuklara çok güvenirdi.', true, 'Atatürk çocukları geleceğin güvencesi olarak görürdü.'],
]

/* ================================================================================================
 * TEMA 3 · DOĞADA NELER OLUYOR?
 * ================================================================================================ */
const KAVANOZ: Metin = {
  t: 'Kavanozdan Saksı',
  img: 'jar',
  text: 'Mert boş bir reçel kavanozunu çöpe atmak üzereydi. Ablası, “Dur! Onu saksı yapabiliriz.” dedi. Kavanoza toprak doldurup nane diktiler. Kavanoz pencerenin önünde yeşerdi. Mert artık hiçbir kavanozu hemen atmıyor.',
  qs: [
    { q: 'Mert neyi atmak üzereydi?', a: 'Boş bir kavanozu', w: ['Eski bir kitabı', 'Bir plastik şişeyi', 'Kırık bir kalemi'], ex: 'Mert boş bir reçel kavanozunu atacaktı.' },
    { q: 'Kavanoza ne diktiler?', a: 'Nane', w: ['Domates', 'Lale', 'Fasulye'], ex: 'Kavanoza toprak doldurup nane diktiler.' },
    { q: 'Kavanozdan Saksı metni en çok neyi anlatıyor?', a: 'Eşyaları yeniden kullanmayı', w: ['Reçel yapmayı', 'Çöpü dökmeyi', 'Kavanoz satmayı'], ex: 'Eski eşyalar yeniden kullanılabilir.' },
    { q: '“Dur!” diyen kimdi?', a: 'Ablası', w: ['Annesi', 'Öğretmeni', 'Arkadaşı'], ex: 'Ablası, “Dur! Onu saksı yapabiliriz.” dedi.' },
    { q: 'Kavanoz nerede yeşerdi?', a: 'Pencerenin önünde', w: ['Bahçede', 'Okulda', 'Dolabın içinde'], ex: 'Kavanoz pencerenin önünde yeşerdi.' },
  ],
}
const KAR: Metin = {
  t: 'Kar Sabahı',
  img: 'snowman',
  text: 'Elif sabah perdeyi açınca şaşırdı. Bahçe pamuk gibi bembeyazdı. Ağaçların dalları şeker serpilmiş gibi parlıyordu. Elif kalın montunu giyip dışarı koştu. Bir kardan adam yaptı ve ona havuçtan burun taktı.',
  qs: [
    { q: 'Bahçe neye benzetilmiş?', a: 'Pamuğa', w: ['Kömüre', 'Çamura', 'Denize'], ex: '“Bahçe pamuk gibi bembeyazdı.”' },
    { q: 'Elif dışarı çıkmadan önce ne giydi?', a: 'Kalın montunu', w: ['Mayosunu', 'Şortunu', 'Terliklerini'], ex: 'Kalın montunu giyip dışarı koştu.' },
    { q: 'Bu olay hangi mevsimde oluyor?', a: 'Kış', w: ['Yaz', 'İlkbahar', 'Sonbahar'], ex: 'Kar yağdığına göre mevsim kış.' },
    { q: 'Kardan adamın burnu neydi?', a: 'Havuç', w: ['Elma', 'Taş', 'Kalem'], ex: 'Kardan adama havuçtan burun taktı.' },
    { q: 'Elif perdeyi açınca ne hissetti?', a: 'Şaşırdı', w: ['Kızdı', 'Korktu', 'Üzüldü'], ex: 'Bembeyaz bahçeyi görünce şaşırdı.' },
  ],
}
const SOZ3_P: P[] = [
  ['sürpriz', 'Beklenmedik sevindirici şey'],
  ['fide', 'Dikilecek küçük bitki'],
  ['atölye', 'Ustanın çalıştığı yer'],
  ['fesleğen', 'Güzel kokulu bir bitki'],
  ['atık', 'Kullanılıp atılan şey'],
  ['mikrop', 'Hastalık yapan küçük canlı'],
  ['cömert', 'Paylaşmayı seven'],
  ['yamaç', 'Dağın eğimli yanı'],
]
const BENZ3_Q: Q[] = [
  { q: 'Kar ___ gibi bembeyazdı. Hangisi gelir?', a: 'pamuk', w: ['kömür', 'çamur', 'gece'], ex: 'Kar, beyazlığıyla pamuğa benzetilir.', img: 'snowflake' },
  { q: 'Yanakları ___ gibi kıpkırmızıydı. Hangisi gelir?', a: 'kiraz', w: ['limon', 'yaprak', 'bulut'], ex: 'Kırmızı yanaklar kiraza benzetilir.', img: 'happy' },
  { q: 'Ali ___ gibi çalışkandır. Hangisi gelir?', a: 'karınca', w: ['yastık', 'taş', 'bulut'], ex: 'Karınca çalışkanlığıyla bilinir.', img: 'ant' },
  { q: 'Çınar ağacı ___ gibi kocamandı. Hangisi gelir?', a: 'dev', w: ['karınca', 'fındık', 'düğme'], ex: 'Büyük şeyleri deve benzetiriz.', img: 'tree' },
  { q: 'Kirazlar ___ gibi tatlıydı. Hangisi gelir?', a: 'bal', w: ['limon', 'tuz', 'biber'], ex: 'Bal çok tatlıdır.', img: 'honey' },
  { q: 'Saçları ___ gibi sapsarıydı. Hangisi gelir?', a: 'altın', w: ['kömür', 'çimen', 'gece'], ex: 'Sarı saç altına benzetilir.', img: 'sun' },
  { q: 'Tavşanın tüyleri ___ gibi yumuşacıktı. Hangisi gelir?', a: 'pamuk', w: ['taş', 'diken', 'demir'], ex: 'Pamuk yumuşacıktır.', img: 'rabbit' },
]
const BENZ3_P: P[] = [
  ['kar', 'pamuk', 'snowflake'],
  ['yanak', 'kiraz', 'happy'],
  ['saç', 'altın', 'sun'],
  ['çınar', 'dev', 'tree'],
  ['çalışkan çocuk', 'karınca', 'ant'],
  ['tatlı kiraz', 'bal', 'honey'],
]
const MI_Q: Q[] = [
  { q: 'Çiçek sulama sorusu: hangisi doğru yazılmış?', a: 'Çiçekleri suladın mı?', w: ['Çiçekleri suladınmı?', 'Çiçekleri suladın mı.', 'Çiçekleri suladın-mı?'], ex: '“mı” ayrı yazılır, sonuna soru işareti konur.', img: 'tulip' },
  { q: 'Yardım isteme sorusu: hangisi doğru yazılmış?', a: 'Bana yardım eder misin?', w: ['Bana yardım edermisin?', 'Bana yardım eder mi sin?', 'Bana yardım eder misin.'], ex: '“misin” ayrı ama kendi içinde bitişik yazılır.', img: 'hug' },
  { q: 'Süt içme sorusu: hangisi doğru yazılmış?', a: 'Kardeşin süt içiyor mu?', w: ['Kardeşin süt içiyormu?', 'Kardeşin süt içiyor mu.', 'Kardeşin süt içiyor-mu?'], ex: '“mu” ayrı yazılır.', img: 'milk' },
  { q: 'Fidanı dikelim ___? Boşluğa hangisi gelir?', a: 'mi', w: ['misin', 'musun', 'mü'], ex: '“Fidanı dikelim mi?”', img: 'seedling' },
  { q: 'Çöpü attın ___? Boşluğa hangisi gelir?', a: 'mı', w: ['musun', 'misin', 'mü'], ex: '“Çöpü attın mı?”', img: 'wastebasket' },
  { q: 'Soru eki “mı, mi, mu, mü” nasıl yazılır?', a: 'Ayrı', w: ['Bitişik', 'Hiç yazılmaz'], ex: 'Soru eki her zaman ayrı yazılır.', img: 'memo' },
  { q: 'Kar yağıyor ___? Boşluğa hangisi gelir?', a: 'mu', w: ['mı', 'mi', 'mü'], ex: '“Kar yağıyor mu?”', img: 'snowflake' },
]
const ATIK_ITEMS: SortQ['items'] = [
  { label: 'Cam şişe', img: 'glass', bin: 'cam' },
  { label: 'Reçel kavanozu', img: 'jar', bin: 'cam' },
  { label: 'Cam bardak', img: 'glass', bin: 'cam' },
  { label: 'Gazete', img: 'newspaper', bin: 'kagit' },
  { label: 'Karton kutu', img: 'package', bin: 'kagit' },
  { label: 'Eski defter', img: 'notebook', bin: 'kagit' },
  { label: 'Su şişesi', img: 'bottle', bin: 'plastik' },
  { label: 'Yoğurt kabı', img: 'bowl', bin: 'plastik' },
  { label: 'Plastik oyuncak', img: 'teddy', bin: 'plastik' },
]
const ATIK_BINS: SortQ['bins'] = [
  { id: 'cam', label: 'Cam', img: 'glass', color: '#22c55e' },
  { id: 'kagit', label: 'Kâğıt', img: 'newspaper', color: '#3b82f6' },
  { id: 'plastik', label: 'Plastik', img: 'bottle', color: '#f59e0b' },
]
const DOGA_HIT = ['Matara kullanmak', 'Kâğıt geri dönüşüm', 'Atığı ayırmak', 'Fidan dikmek', 'Suyu boşa akıtma', 'Kavanozu saksı yap']
const DOGA_WRONG = ['Çöpü yere atmak', 'Musluğu açık bırak', 'Ağaç dalı kırmak', 'Poşeti doğaya at']
const MEYVE = ['erik', 'incir', 'elma', 'ayva', 'kiraz', 'nar', 'muz', 'armut']
const AFET_P: P[] = [
  ['Deprem', 'Eşyaları duvara sabitle', 'house'],
  ['Sel', 'Dere yatağından uzak dur', 'rain'],
  ['Çığ', 'Yamaçları ağaçlandır', 'mountain'],
  ['Fırtına', 'Çatıyı sağlam yap', 'storm'],
  ['Orman yangını', 'Ormanda ateş yakma', 'evergreen'],
]
const T3_O: O[] = [
  { q: 'Portakal suyu yapalım. Sırala.', s: ['Portakalı yıka', 'Bir büyüğünle kes', 'Portakalı sık', 'Suyu bardağa dök'], ex: 'Bıçağı bir büyüğümüzle kullanırız.', img: 'orange' },
  { q: 'Kavanozdan saksı hikâyesini sırala.', s: ['Mert kavanozu atacaktı', 'Ablası onu durdurdu', 'Nane diktiler', 'Kavanoz yeşerdi'], ex: 'Kavanoz çöpe değil saksıya dönüştü.', img: 'jar' },
  { q: 'Elif’in kar sabahını sırala.', s: ['Perdeyi açtı', 'Bembeyaz bahçeyi gördü', 'Montunu giydi', 'Kardan adam yaptı'], ex: 'Önce baktı, sonra giyindi, sonra oynadı.', img: 'snowman' },
  { q: 'Eski çaydanlığın yolculuğunu sırala.', s: ['Çaydanlık eskidi', 'Kalemlik oldu', 'Saksı oldu', 'Kuşlar içine yuva yaptı'], ex: 'Eski eşyalar yeni işlere yarar.', img: 'teapot' },
]
const T3_C: string[][] = [
  ['İlkbaharda', 'ağaçlar', 'çiçek', 'açar.'],
  ['Yazın', 'bol', 'meyve', 'yeriz.'],
  ['Sonbaharda', 'ağaçlar', 'yapraklarını', 'döker.'],
  ['Kış', 'mevsiminde', 'kar', 'yağar.'],
  ['Mert', 'kavanoza', 'nane', 'dikti.'],
  ['Elif', 'kardan', 'adam', 'yaptı.'],
]
const T3_TF: TF[] = [
  ['Dişlerimizi düzenli fırçalamalıyız.', true, 'Dişlerimiz böyle sağlıklı kalır.'],
  ['Spor yapmak bizi boşa yorar.', false, 'Spor bize enerji verir.'],
  ['Meyve ve sebze yemek sağlıklıdır.', true, 'Her gün meyve ve sebze yeriz.'],
  ['Yalnızca hasta olunca doktora gideriz.', false, 'Kontrol için de doktora gideriz.'],
  ['Kâğıdın arka yüzünü de kullanabiliriz.', true, 'Böylece daha az atık çıkar.'],
  ['Plastik şişe yerine matara kullanabiliriz.', true, 'Matara tekrar tekrar kullanılır.'],
  ['Her öğün aynı yemeği yemeliyiz.', false, 'Farklı besinler yemeliyiz.'],
  ['“mı, mi” soru eki ayrı yazılır.', true, 'Suladın mı? Gelir mi?'],
]

/* ================================================================================================
 * TEMA 4 · OKUMA SERÜVENİMİZ
 * ================================================================================================ */
const ODUNC: Metin = {
  t: 'Ödünç Kitap',
  img: 'books',
  text: 'Ada kütüphaneden dinozorlarla ilgili bir kitap ödünç aldı. Kitabı iki hafta içinde geri getirmesi gerekiyordu. Her akşam yatmadan önce birkaç sayfa okudu. Kitabı bitirince zamanında teslim etti. Görevli ona yeni bir kitap seçmesinde yardım etti.',
  qs: [
    { q: 'Ada kitabı nereden aldı?', a: 'Kütüphaneden', w: ['Kırtasiyeden', 'Arkadaşından', 'Marketten'], ex: 'Ada kitabı kütüphaneden ödünç aldı.' },
    { q: 'Kitabı ne zaman geri getirmeliydi?', a: 'İki hafta içinde', w: ['Bir yıl sonra', 'Ertesi gün', 'Hiç getirmeyecekti'], ex: 'Kitabı iki hafta içinde geri getirmeliydi.' },
    { q: 'Ada kitabı ne zaman okudu?', a: 'Her akşam yatmadan önce', w: ['Derste', 'Kahvaltıda', 'Yalnızca bayramda'], ex: 'Her akşam yatmadan önce birkaç sayfa okudu.' },
    { q: 'Kitap neyle ilgiliydi?', a: 'Dinozorlarla', w: ['Uzayla', 'Denizlerle', 'Arılarla'], ex: 'Dinozorlarla ilgili bir kitaptı.' },
    { q: 'Ada’ya yeni kitap seçmede kim yardım etti?', a: 'Görevli', w: ['Annesi', 'Kardeşi', 'Komşusu'], ex: 'Kütüphane görevlisi yardım etti.' },
  ],
}
const BERK: Metin = {
  t: 'Berk’in Kelime Kutusu',
  img: 'package',
  text: 'Berk duyduğu her yeni kelimeyi küçük bir karta yazıyor. Kartları renkli bir kutuda saklıyor. Bugün kutuya “kâşif” kartını ekledi. Akşam babasına bu kelimeyle bir cümle kurdu. Kutusu doldukça Berk’in anlattıkları da zenginleşiyor.',
  qs: [
    { q: 'Berk yeni kelimeleri nereye yazıyor?', a: 'Küçük kartlara', w: ['Duvara', 'Tahtaya', 'Elinin üstüne'], ex: 'Her yeni kelimeyi küçük bir karta yazıyor.' },
    { q: 'Bugün kutuya hangi kelimeyi ekledi?', a: 'kâşif', w: ['macera', 'hazine', 'masal'], ex: 'Bugün “kâşif” kartını ekledi.' },
    { q: 'Berk kartları nerede saklıyor?', a: 'Renkli bir kutuda', w: ['Çantasında', 'Yastığın altında', 'Cebinde'], ex: 'Kartları renkli bir kutuda saklıyor.' },
    { q: 'Berk akşam kime cümle kurdu?', a: 'Babasına', w: ['Ablasına', 'Öğretmenine', 'Kedisine'], ex: 'Akşam babasına bu kelimeyle cümle kurdu.' },
    { q: 'Kelime kutusu Berk’e ne kazandırıyor?', a: 'Zengin anlatmayı', w: ['Çok para', 'Yeni oyuncak', 'Uzun uyku'], ex: 'Kelimeleri çoğaldıkça daha zengin anlatıyor.' },
  ],
}
const SOZ4_P: P[] = [
  ['keşfetmek', 'İlk kez bulmak'],
  ['hazine', 'Çok değerli şeyler'],
  ['yazar', 'Kitap yazan kişi'],
  ['macera', 'Heyecanlı olaylar'],
  ['koleksiyon', 'Biriktirilmiş aynı tür şeyler'],
  ['kaptan', 'Gemiyi yöneten kişi'],
  ['güverte', 'Geminin üstündeki açık alan'],
  ['ilham', 'İçe doğan yaratıcı fikir'],
]
const KISA_P: P[] = [
  ['TDK', 'Türk Dil Kurumu'],
  ['TBMM', 'Türkiye Büyük Millet Meclisi'],
  ['MEB', 'Millî Eğitim Bakanlığı'],
  ['THY', 'Türk Hava Yolları'],
  ['KKTC', 'Kuzey Kıbrıs Türk Cumhuriyeti'],
  ['T.C.', 'Türkiye Cumhuriyeti'],
  ['G', 'Güney'],
]
const KISA_Q: Q[] = [
  { q: 'Türk Dil Kurumu nasıl kısaltılır?', a: 'TDK', w: ['Tdk', 'tdk', 'TdK'], ex: 'Her sözcüğün ilk harfi büyük yazılır: TDK.', img: 'books' },
  { q: 'Millî Eğitim Bakanlığı nasıl kısaltılır?', a: 'MEB', w: ['Meb', 'meb', 'MeB'], ex: 'Millî Eğitim Bakanlığı: MEB.', img: 'school' },
  { q: 'Türk Hava Yolları nasıl kısaltılır?', a: 'THY', w: ['Thy', 'thy', 'ThY'], ex: 'Türk Hava Yolları: THY.', img: 'airplane' },
  { q: 'Güney yönü nasıl kısaltılır?', a: 'G', w: ['g', 'Gü', 'GN'], ex: 'Yön adları da kısaltılır: G.', img: 'compass' },
  { q: 'Kısaltmalarda her sözcüğün hangi harfi alınır?', a: 'İlk harfi', w: ['Son harfi', 'Ortadaki harfi', 'Hiçbir harfi'], ex: 'Her sözcüğün ilk harfi büyük olarak alınır.', img: 'abc' },
  { q: 'Türkiye Cumhuriyeti nasıl kısaltılır?', a: 'T.C.', w: ['tc', 'Tc', 't.c.'], ex: 'Türkiye Cumhuriyeti: T.C.', img: 'trflag' },
]
const ZIT4_P: P[] = [
  ['eski', 'yeni'],
  ['ilk', 'son'],
  ['pahalı', 'ucuz'],
  ['yumuşak', 'sert'],
  ['kolay', 'zor'],
  ['erken', 'geç'],
  ['açık', 'kapalı'],
]
const NEDEN4_Q: Q[] = [
  { q: '“Erken yattığım için erken uyandım.” Neden hangisi?', a: 'Erken yatmak', w: ['Erken uyanmak', 'Kahvaltı etmek', 'Okula gitmek'], ex: 'Erken yatmak nedendir, erken uyanmak sonuçtur.', img: 'bed' },
  { q: '“Meyveyi yıkamadan yediği için hasta oldu.” Sonuç hangisi?', a: 'Hasta olmak', w: ['Meyveyi yıkamamak', 'Meyve almak', 'Meyve sevmek'], ex: 'Yıkamadan yemek neden, hasta olmak sonuçtur.', img: 'apple' },
  { q: '“Dişini fırçalamadığı için dişi çürüdü.” Neden hangisi?', a: 'Dişini fırçalamamak', w: ['Dişinin çürümesi', 'Su içmek', 'Erken yatmak'], ex: 'Diş fırçalamamak diş çürümesine neden olur.', img: 'tooth' },
  { q: '“Spor yaptığı için güçlendi.” Sonuç hangisi?', a: 'Güçlenmek', w: ['Spor yapmak', 'Top almak', 'Uyumak'], ex: 'Spor yapmak neden, güçlenmek sonuçtur.', img: 'biceps' },
  { q: '“Dengeli beslendiği için sağlıklı.” Neden hangisi?', a: 'Dengeli beslenmek', w: ['Sağlıklı olmak', 'Çok uyumak', 'Hasta olmak'], ex: 'Dengeli beslenmek sağlığın nedenidir.', img: 'salad' },
]
const HATA_Q: Q[] = [
  { q: '“en sevdiğim kitap bu.” Hata nedir?', a: 'Büyük harfle başlamamış', w: ['Sonuna soru işareti gerekir', 'Hata yok', 'Virgül eksik'], ex: 'Cümle büyük harfle başlar: En sevdiğim kitap bu.', img: 'book' },
  { q: '“Kitabı okudun mu.” Hata nedir?', a: 'Sonuna soru işareti gerekir', w: ['Büyük harfle başlamamış', 'Hata yok', 'Şehir adı küçük yazılmış'], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'thinking' },
  { q: '“Ayşe ankara’ya gitti.” Hata nedir?', a: 'Şehir adı küçük yazılmış', w: ['Sonunda nokta yok', 'Hata yok', 'Sonuna soru işareti gerekir'], ex: 'Şehir adları büyük harfle başlar: Ankara’ya.', img: 'cityscape' },
  { q: '“Babam bana kitap aldı.” Hata nedir?', a: 'Hata yok', w: ['Büyük harfle başlamamış', 'Sonuna soru işareti gerekir', 'Şehir adı küçük yazılmış'], ex: 'Bu cümle doğru yazılmış.', img: 'thumbsup' },
  { q: '“23 Nisan çocuk bayramı.” Hata nedir?', a: 'Bayram adı küçük yazılmış', w: ['Hata yok', 'Sonuna soru işareti gerekir', 'Şehir adı küçük yazılmış'], ex: 'Bayram adı büyük harfle yazılır: Çocuk Bayramı.', img: 'balloon' },
]
const KUTUP_ITEMS: SortQ['items'] = [
  { label: 'Sessiz okumak', img: 'openbook', bin: 'evet' },
  { label: 'Kitabı zamanında getirmek', img: 'calendar', bin: 'evet' },
  { label: 'Kitaba özen göstermek', img: 'books', bin: 'evet' },
  { label: 'Görevliden yardım istemek', img: 'raisedhand', bin: 'evet' },
  { label: 'Yüksek sesle konuşmak', img: 'speaker', bin: 'hayir' },
  { label: 'Yemek yemek', img: 'sandwich', bin: 'hayir' },
  { label: 'Telefonla konuşmak', img: 'phone', bin: 'hayir' },
  { label: 'Kitabı izinsiz götürmek', img: 'noentry', bin: 'hayir' },
]
const KUTUP_BINS: SortQ['bins'] = [
  { id: 'evet', label: 'Kütüphanede yapılır', img: 'thumbsup', color: '#22c55e' },
  { id: 'hayir', label: 'Kütüphanede yapılmaz', img: 'thumbsdown', color: '#ef4444' },
]
const T4_TF: TF[] = [
  ['Kitabı yüzüme çok yakın tutarım.', false, 'Kitabı gözümüzden uygun uzaklıkta tutarız.'],
  ['Noktalamaya dikkat ederek okurum.', true, 'Noktada durur, soruyu soru gibi okuruz.'],
  ['Aydınlık bir yerde okurum.', true, 'Karanlıkta okumak gözümüzü yorar.'],
  ['Satır atlamadan okurum.', true, 'Dikkatle, satır satır okuruz.'],
  ['Kütüphanede yüksek sesle konuşurum.', false, 'Kütüphanede sessiz oluruz.'],
  ['Ödünç kitabı zamanında geri veririm.', true, 'Başkaları da okuyabilsin diye.'],
  ['Kısaltmalarda her sözcüğün son harfi alınır.', false, 'Her sözcüğün ilk harfi alınır.'],
  ['“Eski” sözcüğünün zıttı “yeni”dir.', true, 'Eski ve yeni zıt anlamlıdır.'],
]
const KITAP_KELIME = ['kitap', 'masal', 'şiir', 'yazar', 'macera', 'hazine', 'kaptan']
const KITAP_HIT = ['yazar', 'sayfa', 'kapak', 'masal', 'şiir', 'kütüphane']
const KITAP_WRONG = ['tencere', 'çorap', 'kaşık', 'süpürge']
const T4_O: O[] = [
  { q: 'Kütüphaneden kitap alma adımlarını sırala.', s: ['Kütüphaneye git', 'Kitabını seç', 'Görevliye kaydettir', 'Evde oku', 'Zamanında geri getir'], ex: 'Ödünç kitabı zamanında geri getiririz.', img: 'books' },
  { q: 'Sandviç yapalım. Sırala.', s: ['Ellerini yıka', 'Ekmeği al', 'Peynir ve domates koy', 'Ekmeği kapat'], ex: 'Önce temizlik, sonra hazırlık!', img: 'sandwich' },
  { q: 'Ada’nın hikâyesini sırala.', s: ['Kitabı ödünç aldı', 'Her akşam okudu', 'Kitabı bitirdi', 'Zamanında teslim etti'], ex: 'Ada sorumluluğunu yerine getirdi.', img: 'openbook' },
]
const HECE4: string[][] = [['ma', 'sal'], ['ki', 'tap'], ['ma', 'ce', 'ra'], ['kü', 'tüp', 'ha', 'ne'], ['ya', 'zar'], ['ha', 'zi', 'ne'], ['kap', 'tan']]
const T4_C: string[][] = [
  ['Ada', 'kütüphaneden', 'kitap', 'aldı.'],
  ['Kitaplar', 'bizi', 'her', 'yere', 'götürür.'],
  ['Berk', 'yeni', 'kelimeler', 'topluyor.'],
  ['Kütüphanede', 'sessiz', 'oluruz.'],
  ['Her', 'akşam', 'kitap', 'okurum.'],
]

/* ================================================================================================
 * TEMA 5 · YETENEKLERİMİZİ TANIYORUZ
 * ================================================================================================ */
const TOPAC: Metin = {
  t: 'Dedemin Topacı',
  img: 'oldman',
  text: 'Dedem bana tahtadan bir topaç yaptı. İpini sarıp yere fırlattım ama topaç hemen devrildi. Dedem gülümseyip “Bir daha dene.” dedi. Beşinci denemede topaç fır fır döndü. İkimiz de sevinçle alkışladık.',
  qs: [
    { q: 'Topacı kim yaptı?', a: 'Dede', w: ['Anne', 'Öğretmen', 'Kardeş'], ex: 'Topacı dede yaptı.' },
    { q: 'Topaç kaçıncı denemede döndü?', a: 'Beşinci', w: ['Birinci', 'İkinci', 'Onuncu'], ex: 'Beşinci denemede fır fır döndü.' },
    { q: 'Dedemin Topacı metni bize ne söylüyor?', a: 'Pes etmeden denemeliyiz', w: ['Topaç kolay döner', 'Hemen vazgeçmeliyiz', 'Oyuncak almalıyız'], ex: 'Denemeye devam eden başarır.' },
    { q: 'Topaç neyden yapılmıştı?', a: 'Tahtadan', w: ['Camdan', 'Kâğıttan', 'Kumaştan'], ex: 'Dede tahtadan bir topaç yaptı.' },
    { q: 'İlk atışta topaca ne oldu?', a: 'Hemen devrildi', w: ['Fır fır döndü', 'Kırıldı', 'Kayboldu'], ex: 'İlk atışta topaç hemen devrildi.' },
  ],
}
const RESSAM: Metin = {
  t: 'Sınıfın Ressamı',
  img: 'palette',
  text: 'Mina resim yapmayı çok seviyor. Sınıf panosundaki ağaç resmini o çizdi. Arda ise şarkı söylemekte çok iyi. Öğretmenleri ikisine de bir görev verdi. Mina afişi çizdi, Arda da gösteride şarkıyı söyledi.',
  qs: [
    { q: 'Mina’nın yeteneği nedir?', a: 'Resim yapmak', w: ['Şarkı söylemek', 'Top oynamak', 'Yüzmek'], ex: 'Mina resim yapmayı çok seviyor.' },
    { q: 'Arda neyi iyi yapıyor?', a: 'Şarkı söylemeyi', w: ['Resim yapmayı', 'Koşmayı', 'Yemek yapmayı'], ex: 'Arda şarkı söylemekte çok iyi.' },
    { q: 'Panodaki ağaç resmini kim çizdi?', a: 'Mina', w: ['Arda', 'Öğretmen', 'Müdür'], ex: 'Ağaç resmini Mina çizdi.' },
    { q: 'Mina hangi görevi yaptı?', a: 'Afişi çizdi', w: ['Şarkıyı söyledi', 'Sahneyi süpürdü', 'Davetiye yazdı'], ex: 'Mina afişi çizdi.' },
    { q: 'Sınıfın Ressamı metni en çok neyi anlatıyor?', a: 'Herkesin bir yeteneği vardır', w: ['Resim yapmak zordur', 'Şarkılar uzundur', 'Gösteriler sıkıcıdır'], ex: 'Mina’nın da Arda’nın da yeteneği var.' },
  ],
}
const SOZ5_P: P[] = [
  ['maket', 'Bir şeyin küçük modeli'],
  ['müze', 'Değerli eşyaların sergilendiği yer'],
  ['hayal', 'Zihinde canlandırılan şey'],
  ['özen', 'Dikkat ve titizlik'],
  ['kil', 'Biçim verilebilen toprak'],
  ['efsane', 'Dilden dile anlatılan hikâye'],
  ['hamle', 'Oyunda bir hareket'],
]
const KESME_Q: Q[] = [
  { q: 'Ayşe___ resmi çok güzel. Hangisi doğru?', a: 'Ayşe’nin', w: ['Ayşenin', 'Ayşe-nin', 'ayşe’nin'], ex: 'Kişi adına gelen ek kesme işaretiyle ayrılır.', img: 'palette' },
  { q: 'Şehir adına gelen ek: hangisi doğru?', a: 'Ankara’ya', w: ['Ankaraya', 'Ankara-ya', 'ankara’ya'], ex: 'Şehir adına gelen ek kesmeyle ayrılır.', img: 'cityscape' },
  { q: 'Ülke adına gelen ek: hangisi doğru?', a: 'Türkiye’de', w: ['Türkiyede', 'Türkiye-de', 'türkiye’de'], ex: 'Ülke adına gelen ek kesmeyle ayrılır.', img: 'trflag' },
  { q: 'Kişi adına gelen ek: hangisi doğru?', a: 'Mert’in', w: ['Mertin', 'Mert-in', 'mert’in'], ex: 'Mert’in kalemi.', img: 'boy' },
  { q: 'Hangisinde kesme işareti gerekmez?', a: 'okula', w: ['Ada’nın', 'İzmir’e', 'Kıbrıs’a'], ex: '“okul” özel ad değildir, kesme almaz.', img: 'school' },
  { q: 'Kesme işareti neyi ayırır?', a: 'Özel ada gelen eki', w: ['Cümleleri', 'Soruları', 'Satırları'], ex: 'Kesme işareti özel adlara gelen ekleri ayırır.', img: 'memo' },
]
const KESME_HIT = ['Ankara’ya', 'Mert’in', 'Türkiye’de', 'Ada’nın', 'İzmir’e', 'Kıbrıs’a']
const KESME_WRONG = ['okul’a', 'kalem’in', 'Mertin', 'Türkiyede', 'ev’de']
const SATIR_Q: Q[] = [
  { q: '“kelebek” satıra sığmadı. Doğru bölünüş hangisi?', a: 'kele-bek', w: ['kel-ebek', 'keleb-ek', 'kelebe-k'], ex: 'Sözcük heceden bölünür: ke-le-bek.', img: 'butterfly' },
  { q: '“yolculuk” satıra sığmadı. Doğru bölünüş hangisi?', a: 'yolcu-luk', w: ['yo-lculuk', 'yolc-uluk', 'yolcul-uk'], ex: 'yol-cu-luk: heceden böleriz.', img: 'bus' },
  { q: '“yakın” satıra sığmadı. Doğru bölünüş hangisi?', a: 'ya-kın', w: ['yak-ın', 'y-akın', 'yakı-n'], ex: 'ya-kın: iki hece.', img: 'walking' },
  { q: '“pencere” satıra sığmadı. Doğru bölünüş hangisi?', a: 'pen-cere', w: ['pe-ncere', 'penc-ere', 'pencer-e'], ex: 'pen-ce-re: heceden böleriz.', img: 'house' },
  { q: '“oyuncak” satıra sığmadı. Doğru bölünüş hangisi?', a: 'oyun-cak', w: ['oy-uncak', 'oyu-ncak', 'oyunc-ak'], ex: 'o-yun-cak: heceden böleriz.', img: 'teddy' },
  { q: 'Satır sonunda bölünen sözcüğe hangi işaret konur?', a: 'Kısa çizgi', w: ['Virgül', 'Nokta', 'Kesme işareti'], ex: 'Satır sonunda kısa çizgi (-) kullanılır.', img: 'pencil' },
]
const HECE5: string[][] = [['sak', 'lam', 'baç'], ['kö', 're', 'be'], ['to', 'paç'], ['çem', 'ber'], ['mü', 'ze'], ['mis', 'ket']]
const MESLEK5_P: P[] = [
  ['Veteriner', 'Hayvanları iyileştirir', 'paw'],
  ['Mimar', 'Binaları tasarlar', 'house'],
  ['Öğretmen', 'Ders anlatır', 'teacher'],
  ['Bahçıvan', 'Bitkileri büyütür', 'seedling'],
  ['Ozan', 'Türkü söyler', 'guitar'],
  ['Aşçı', 'Yemek pişirir', 'cook'],
  ['Pilot', 'Uçak kullanır', 'airplane'],
]
const MEKTUP5_Q: Q[] = [
  { q: 'Mektuba nasıl başlarız?', a: 'Sevgili Dedeciğim,', w: ['Hoşça kal.', 'Görüşürüz.', 'Saygılarımla.'], ex: 'Mektuba hitapla başlarız.', img: 'memo' },
  { q: 'Mektubu nasıl bitiririz?', a: 'Sevgiyle kal.', w: ['Sevgili Ninem,', 'Merhaba,', 'Konu:'], ex: 'Mektubu güzel bir dilekle bitiririz.', img: 'heart' },
  { q: 'Mektupta hitap sözünden sonra hangi işaret gelir?', a: 'Virgül', w: ['Soru işareti', 'Ünlem', 'Kısa çizgi'], ex: 'Sevgili Dedeciğim, ...', img: 'pencil' },
  { q: 'Tebrik kartına ne yazarız?', a: 'Tebrik ederim!', w: ['Geçmiş olsun.', 'Özür dilerim.', 'Afiyet olsun.'], ex: 'Başarıyı tebrik ederiz.', img: 'gift' },
  { q: 'Keman yarışmasını kazanan arkadaşına ne yazarsın?', a: 'Başarını kutlarım!', w: ['Hiç önemli değil.', 'Ben daha iyi çalarım.', 'Bir dahaki sefere.'], ex: 'Arkadaşımızın başarısına seviniriz.', img: 'violin' },
]
const OYUNCAK_ITEMS: SortQ['items'] = [
  { label: 'Topaç', img: 'target', bin: 'eski' },
  { label: 'Bez bebek', img: 'teddy', bin: 'eski' },
  { label: 'Tahta at', img: 'horse', bin: 'eski' },
  { label: 'Çember', img: 'wheel', bin: 'eski' },
  { label: 'Misket', img: 'gem', bin: 'eski' },
  { label: 'Tablet oyunu', img: 'videogame', bin: 'yeni' },
  { label: 'Kumandalı araba', img: 'racecar', bin: 'yeni' },
  { label: 'Robot oyuncak', img: 'robot', bin: 'yeni' },
  { label: 'Bilgisayar oyunu', img: 'laptop', bin: 'yeni' },
]
const OYUNCAK_BINS: SortQ['bins'] = [
  { id: 'eski', label: 'Eski oyuncak', img: 'hourglass', color: '#a16207' },
  { id: 'yeni', label: 'Yeni oyuncak', img: 'sparkles', color: '#7c3aed' },
]
const OYUN_ADI = ['körebe', 'seksek', 'topaç', 'beştaş', 'çember', 'misket']
const T5_O: O[] = [
  { q: 'Saklambaç oyununu sırala.', s: ['Ebe seçilir', 'Ebe gözünü kapar', 'Diğerleri saklanır', 'Ebe arkadaşlarını arar'], ex: 'Oyunların da bir sırası vardır.', img: 'eyes' },
  { q: 'Dedemin topacı hikâyesini sırala.', s: ['Dede topaç yaptı', 'İpini sardım', 'Topaç devrildi', 'Beşinci denemede döndü'], ex: 'Denemeye devam ettik ve başardık.', img: 'oldman' },
  { q: 'Kilden kuş yapalım. Sırala.', s: ['Kili yoğur', 'Kuş biçimi ver', 'Kurumasını bekle', 'Boyayla süsle'], ex: 'Sabırla çalışınca güzel bir eser çıkar.', img: 'paint' },
]
const T5_C: string[][] = [
  ['Mina', 'resim', 'yapmayı', 'seviyor.'],
  ['Dedem', 'bana', 'topaç', 'yaptı.'],
  ['Her', 'mesleğe', 'saygı', 'duyarız.'],
  ['Arda', 'gösteride', 'şarkı', 'söyledi.'],
  ['Birlikten', 'kuvvet', 'doğar.'],
]
const T5_TF: TF[] = [
  ['“Birlikten kuvvet doğar” sözü, birlikte olunca güçlü oluruz demektir.', true, 'Birlikte çalışınca işler kolaylaşır.'],
  ['Özel adlara gelen ekler kesme işaretiyle ayrılır.', true, 'Ankara’ya, Ada’nın gibi.'],
  ['“okula” sözcüğünde kesme işareti kullanılır.', false, '“okul” özel ad olmadığı için kesme almaz.'],
  ['Satır sonuna sığmayan sözcük heceden bölünür.', true, 'kele-bek gibi.'],
  ['Her mesleğe saygı duyarız.', true, 'Her meslek değerlidir.'],
  ['Yetenekler çalıştıkça gelişir.', true, 'Emek vermek yeteneği büyütür.'],
  ['Mektuba “Hoşça kal” diye başlarız.', false, 'Mektuba hitapla başlarız: Sevgili ...,'],
  ['Topaç ilk denemede döndü.', false, 'Topaç beşinci denemede döndü.'],
]

/* ================================================================================================
 * TEMA 6 · MUCİT ÇOCUK
 * ================================================================================================ */
const OLCER: Metin = {
  t: 'Yağmur Ölçer',
  img: 'rain',
  text: 'Zeynep yağmurun ne kadar yağdığını merak etti. Boş bir şişenin üstünü babasıyla birlikte kesti. Şişenin yanına eşit aralıklı çizgiler çizdi. Şişeyi bahçeye koydu. Akşam su ikinci çizgiye gelmişti ve Zeynep sonucu defterine yazdı.',
  qs: [
    { q: 'Zeynep neyi merak etti?', a: 'Yağmurun ne kadar yağdığını', w: ['Bulutların rengini', 'Güneşin doğuşunu', 'Kuşların sesini'], ex: 'Yağmurun ne kadar yağdığını merak etti.' },
    { q: 'Zeynep şişeyi kiminle kesti?', a: 'Babasıyla', w: ['Tek başına', 'Öğretmeniyle', 'Arkadaşıyla'], ex: 'Şişeyi babasıyla birlikte kesti.' },
    { q: 'Akşam su hangi çizgiye gelmişti?', a: 'İkinci çizgiye', w: ['Birinci çizgiye', 'Beşinci çizgiye', 'Hiçbir çizgiye'], ex: 'Su ikinci çizgiye gelmişti.' },
    { q: 'Zeynep şişeyi nereye koydu?', a: 'Bahçeye', w: ['Buzdolabına', 'Çantasına', 'Yatağın altına'], ex: 'Şişeyi bahçeye koydu.' },
    { q: 'Zeynep sonucu nereye yazdı?', a: 'Defterine', w: ['Duvara', 'Tahtaya', 'Şişenin üstüne'], ex: 'Sonucu defterine yazdı.' },
  ],
}
const FISTIK: Metin = {
  t: 'Robot Fıstık',
  img: 'robot',
  text: 'Can’ın küçük bir oyuncak robotu var, adı Fıstık. Fıstık ileri gidebiliyor ama geri gidemiyor. Can, “Fıstık neden geri gitmiyor?” diye düşündü. Kardeşiyle birlikte kullanma kitabını okudular. Bir düğmeye basınca Fıstık geri de gitmeye başladı.',
  qs: [
    { q: 'Robotun adı ne?', a: 'Fıstık', w: ['Pırıl', 'Badem', 'Ceviz'], ex: 'Robotun adı Fıstık.' },
    { q: 'Metinde “ileri” sözcüğünün zıttı hangisi?', a: 'Geri', w: ['Yukarı', 'Hızlı', 'Küçük'], ex: 'İleri ve geri zıt anlamlıdır.' },
    { q: 'Can sorunu nasıl çözdü?', a: 'Kullanma kitabını okudu', w: ['Robotu attı', 'Yeni robot aldı', 'Robotu kırdı'], ex: 'Kardeşiyle kullanma kitabını okuyup düğmeye bastı.' },
    { q: 'Can kitabı kiminle okudu?', a: 'Kardeşiyle', w: ['Annesiyle', 'Dedesiyle', 'Arkadaşıyla'], ex: 'Kardeşiyle birlikte okudular.' },
    { q: 'Fıstık başta neyi yapamıyordu?', a: 'Geri gitmeyi', w: ['İleri gitmeyi', 'Işık yakmayı', 'Ses çıkarmayı'], ex: 'Fıstık geri gidemiyordu.' },
  ],
}
const SOZ6_P: P[] = [
  ['batarya', 'Pil grubu'],
  ['astronot', 'Uzaya giden kişi'],
  ['gezegen', 'Güneş’in çevresinde dolanan gök cismi'],
  ['uydu', 'Gökte dolaşan araç'],
  ['mucit', 'Yeni bir şey bulan kişi'],
  ['icat', 'Yeni bulunan şey'],
  ['robot', 'İnsanın işini yapan makine'],
  ['ekran', 'Görüntünün çıktığı yüzey'],
]
const BAGLAC_Q: Q[] = [
  { q: 'Robotu açtım ___ çalışmadı. Hangisi gelir?', a: 'ama', w: ['ve', 'çünkü', 'ile'], ex: '“ama” karşıt iki durumu bağlar.', img: 'robot' },
  { q: 'Yiğit annesine sarıldı ___ onu çok özlemişti. Hangisi gelir?', a: 'çünkü', w: ['ama', 'ile', 've'], ex: '“çünkü” nedenini anlatır.', img: 'hug' },
  { q: 'Kalem ___ defter aldım. Hangisi gelir?', a: 've', w: ['ama', 'çünkü'], ex: '“ve” iki sözcüğü bağlar.', img: 'notebook' },
  { q: 'Zeynep babası ___ şişeyi kesti. Hangisi gelir?', a: 'ile', w: ['ama', 'çünkü', 've'], ex: '“ile” birlikte yapılan işi anlatır.', img: 'bottle' },
  { q: 'Şemsiye aldım ___ yağmur yağıyordu. Hangisi gelir?', a: 'çünkü', w: ['ama', 'ile'], ex: 'Şemsiye almamın nedeni yağmurdu.', img: 'umbrella' },
  { q: 'Uçurtmam çok güzeldi ___ rüzgâr yoktu. Hangisi gelir?', a: 'ama', w: ['çünkü', 'ile'], ex: '“ama” karşıt durumu anlatır.', img: 'kite' },
]
const ZIT6_P: P[] = [
  ['küçük', 'büyük'],
  ['soru', 'cevap'],
  ['ön', 'arka'],
  ['az', 'çok'],
  ['hızlı', 'yavaş'],
  ['ileri', 'geri'],
  ['açık', 'kapalı'],
]
const MERAK_HIT = ['Kuşlar neden uçar?', 'Ay neden parlar?', 'Kar nasıl oluşur?', 'Robot nasıl yürür?', 'Uydu ne yapar?', 'Su neden donar?']
const MERAK_WRONG = ['Kuşlar uçar.', 'Ay parlar.', 'Kar yağdı.', 'Robot yürür.', 'Su dondu.']
const ROBOT_ITEMS: SortQ['items'] = [
  { label: 'Sarılmak', img: 'hug', bin: 'insan' },
  { label: 'Duygu hissetmek', img: 'heart', bin: 'insan' },
  { label: 'Hayal kurmak', img: 'thinking', bin: 'insan' },
  { label: 'Gülümsemek', img: 'happy', bin: 'insan' },
  { label: 'Yük taşımak', img: 'package', bin: 'robot' },
  { label: 'Ses çıkarmak', img: 'speaker', bin: 'robot' },
  { label: 'Hareket etmek', img: 'robot2', bin: 'robot' },
  { label: 'Işık yakmak', img: 'bulb', bin: 'robot' },
]
const ROBOT_BINS: SortQ['bins'] = [
  { id: 'insan', label: 'Yalnız insan yapar', img: 'person', color: '#ec4899' },
  { id: 'robot', label: 'Robot da yapabilir', img: 'robot', color: '#06b6d4' },
]
const ZAMAN_ITEMS: SortQ['items'] = [
  { label: 'At arabası', img: 'horse', bin: 'gecmis' },
  { label: 'Posta güvercini', img: 'bird', bin: 'gecmis' },
  { label: 'Kandil', img: 'candle', bin: 'gecmis' },
  { label: 'Kâğıt mektup', img: 'scroll', bin: 'gecmis' },
  { label: 'Akıllı telefon', img: 'phone', bin: 'bugun' },
  { label: 'Uçak', img: 'airplane', bin: 'bugun' },
  { label: 'Görüntülü konuşma', img: 'laptop', bin: 'bugun' },
  { label: 'Elektrikli araba', img: 'car', bin: 'bugun' },
]
const ZAMAN_BINS: SortQ['bins'] = [
  { id: 'gecmis', label: 'Geçmişte', img: 'hourglass', color: '#a16207' },
  { id: 'bugun', label: 'Günümüzde', img: 'satellite', color: '#0ea5e9' },
]
const BILIM = ['robot', 'uzay', 'uydu', 'mucit', 'icat', 'gezegen', 'ekran']
const HECE6: string[][] = [['me', 'rak', 'lı'], ['a', 'raş', 'tır', 'ma'], ['mu', 'cit'], ['i', 'cat'], ['ro', 'bot'], ['as', 'tro', 'not']]
const T6_O: O[] = [
  { q: 'Yağmur ölçer yapalım. Sırala.', s: ['Bir büyüğünle şişeyi kes', 'Çizgiler çiz', 'Şişeyi bahçeye koy', 'Suyun yüksekliğine bak', 'Sonucu deftere yaz'], ex: 'Bilim insanları da gözlem yapıp not alır.', img: 'rain' },
  { q: 'Robot Fıstık hikâyesini sırala.', s: ['Fıstık geri gitmedi', 'Can merak etti', 'Kullanma kitabını okudular', 'Düğmeye bastılar', 'Fıstık geri gitti'], ex: 'Merak edip araştırınca sorunu çözdüler.', img: 'robot' },
  { q: 'Kâğıttan kayık yapalım. Sırala.', s: ['Kâğıdı ikiye katla', 'Köşeleri içe kıvır', 'Kenarları kaldır', 'Kayığı aç ve biçimlendir'], ex: 'Yönergeyi adım adım uygularız.', img: 'ship' },
]
const T6_C: string[][] = [
  ['Zeynep', 'yağmuru', 'merak', 'etti.'],
  ['Robot', 'ileri', 'gidebiliyor.'],
  ['Merak', 'öğrenmenin', 'başlangıcıdır.'],
  ['Can', 'kardeşiyle', 'kitabı', 'okudu.'],
  ['Bilim', 'insanları', 'çok', 'çalışır.'],
]
const T6_TF: TF[] = [
  ['Astronot olmak için fen ve matematik önemlidir.', true, 'Hayallere çalışarak ulaşılır.'],
  ['“Az” sözcüğünün zıttı “çok”tur.', true, 'Az ve çok zıt anlamlıdır.'],
  ['“Soru” sözcüğünün zıttı “cevap”tır.', true, 'Soru sorar, cevap alırız.'],
  ['“Küçük” sözcüğünün zıttı “az”dır.', false, '“Küçük” sözcüğünün zıttı “büyük”tür.'],
  ['Merak eden çocuk soru sorar.', true, 'Merak öğrenmenin başlangıcıdır.'],
  ['Bilgiyi güvenilir kaynaktan aramalıyız.', true, 'Kitaplardan ve bir büyüğümüzle araştırırız.'],
  ['Robotlar sarılıp duygularımızı paylaşır.', false, 'Duygu hissetmek insana özgüdür.'],
  ['“ama” sözcüğü karşıt iki durumu bağlar.', true, 'Robotu açtım ama çalışmadı.'],
]

/* ================================================================================================
 * TEMA 7 · KÜLTÜR HAZİNEMİZ
 * ================================================================================================ */
const BAYRAM_SABAHI: Metin = {
  t: 'Bayram Sabahı',
  img: 'gift',
  text: 'Bayram sabahı herkes erkenden kalktı. Ela en sevdiği elbisesini giydi. Önce dedesinin, sonra ninesinin elini öptü. Ninesi ona işlemeli bir mendil içinde şeker verdi. Ela şekerleri kardeşiyle paylaştı.',
  qs: [
    { q: 'Ela önce kimin elini öptü?', a: 'Dedesinin', w: ['Ninesinin', 'Annesinin', 'Teyzesinin'], ex: 'Önce dedesinin, sonra ninesinin elini öptü.' },
    { q: 'Ninesi Ela’ya ne verdi?', a: 'Mendil içinde şeker', w: ['Bir kitap', 'Yeni bir top', 'Bir oyuncak'], ex: 'İşlemeli bir mendil içinde şeker verdi.' },
    { q: 'Ela şekerleri ne yaptı?', a: 'Kardeşiyle paylaştı', w: ['Hepsini yedi', 'Sakladı', 'Ninesine geri verdi'], ex: 'Ela şekerleri kardeşiyle paylaştı.' },
    { q: 'Ela bayram sabahı ne giydi?', a: 'En sevdiği elbiseyi', w: ['Pijamasını', 'Okul önlüğünü', 'Yağmurluğunu'], ex: 'En sevdiği elbisesini giydi.' },
    { q: 'Bayram sabahı herkes ne yaptı?', a: 'Erkenden kalktı', w: ['Geç uyandı', 'Okula gitti', 'Uyumaya devam etti'], ex: 'Herkes erkenden kalktı.' },
  ],
}
const HALAY: Metin = {
  t: 'Halay Provası',
  img: 'music',
  text: 'Kerem ve arkadaşları okul gösterisi için halay çalışıyor. İlk gün adımları karıştırdılar. Öğretmenleri adımları tek tek sayarak gösterdi. Bir hafta sonra hepsi el ele, aynı anda adım attı. Gösteri günü salon alkışlarla doldu.',
  qs: [
    { q: 'Çocuklar ne için halay çalışıyor?', a: 'Okul gösterisi için', w: ['Düğün için', 'Yarışma için', 'Doğum günü için'], ex: 'Okul gösterisi için çalışıyorlar.' },
    { q: 'Provanın ilk günü ne oldu?', a: 'Adımları karıştırdılar', w: ['Hemen başardılar', 'Gösteri yapıldı', 'Okul tatil oldu'], ex: 'İlk gün adımları karıştırdılar.' },
    { q: 'Öğretmen nasıl yardım etti?', a: 'Adımları sayarak gösterdi', w: ['Müziği kapattı', 'Çocukları gönderdi', 'Gösteriyi erteledi'], ex: 'Adımları tek tek sayarak gösterdi.' },
    { q: 'Bir hafta sonra ne oldu?', a: 'Aynı anda adım attılar', w: ['Yine karıştırdılar', 'Halayı bıraktılar', 'Salondan çıktılar'], ex: 'Hepsi el ele, aynı anda adım attı.' },
    { q: 'Gösteri günü salon neyle doldu?', a: 'Alkışlarla', w: ['Balonlarla', 'Sessizlikle', 'Yağmurla'], ex: 'Salon alkışlarla doldu.' },
  ],
}
const SOZ7_P: P[] = [
  ['çanak', 'Topraktan yapılmış kap'],
  ['bilge', 'Bilgili ve olgun kişi'],
  ['stadyum', 'Spor karşılaşmalarının yeri'],
  ['egemenlik', 'Yönetme gücüne sahip olmak'],
  ['billur', 'Çok berrak, saydam'],
  ['şaheser', 'Çok güzel eser'],
  ['bağımsız', 'Kimseye bağlı olmayan'],
  ['kürsü', 'Konuşma yapılan yüksek yer'],
]
const SOZGRUP_Q: Q[] = [
  { q: '“Gözlerini fal taşı gibi açmak” ne demek?', a: 'Şaşkınlıkla bakmak', w: ['Çok acıkmak'], ex: 'Şaşırınca gözlerimiz kocaman açılır.', img: 'surprised' },
  { q: '“Göz hapsine almak” ne demek?', a: 'Gözünü ondan ayırmamak', w: ['Gözlerini kapatmak'], ex: 'Birini sürekli izlemek demektir.', img: 'eyes' },
  { q: 'Ninesi bayramda dedeye bir çanak çorba verdi. “Çanak” ne demek?', a: 'Topraktan yapılmış kap', w: ['Bir kaşık', 'Bir masa', 'Bir sepet'], ex: 'Çanak, topraktan yapılmış çukur kaptır.', img: 'bowl' },
  { q: 'Irmağın suyu billur gibiydi. “Billur” ne demek?', a: 'Çok berrak, saydam', w: ['Çok bulanık', 'Çok sıcak', 'Çok tuzlu'], ex: 'Billur gibi su tertemiz ve saydamdır.', img: 'droplet' },
  { q: 'Bilge kişi herkese akıl verdi. “Bilge” ne demek?', a: 'Bilgili ve olgun kişi', w: ['Çok küçük çocuk', 'Yorgun kişi', 'Kızgın kişi'], ex: 'Bilge, bilgili ve olgun kişidir.', img: 'oldman' },
]
const BENZ7_Q: Q[] = [
  { q: 'Deniz ___ gibi dümdüzdü. Hangisi gelir?', a: 'çarşaf', w: ['dağ', 'ateş', 'orman'], ex: 'Dalgasız deniz çarşafa benzetilir.', img: 'ship' },
  { q: 'Güneş ___ gibi parlıyordu. Hangisi gelir?', a: 'altın', w: ['kömür', 'toprak', 'gölge'], ex: 'Parlak güneş altına benzetilir.', img: 'sun' },
  { q: 'Su ___ gibi soğuktu. Hangisi gelir?', a: 'buz', w: ['ateş', 'çay', 'güneş'], ex: 'Soğuk su buza benzetilir.', img: 'ice' },
  { q: 'Irmaklar ___ gibi berraktı. Hangisi gelir?', a: 'billur', w: ['çamur', 'kömür', 'duman'], ex: 'Berrak su billura benzetilir.', img: 'droplet' },
  { q: 'Ninemin elleri ___ gibi yumuşacık. Hangisi gelir?', a: 'pamuk', w: ['taş', 'diken', 'demir'], ex: 'Yumuşak eller pamuğa benzetilir.', img: 'oldwoman' },
  { q: 'Baklava ___ gibi kızardı. Hangisi gelir?', a: 'nar', w: ['kar', 'süt', 'bulut'], ex: 'Kırmızımsı renk nara benzetilir.', img: 'cake' },
  { q: 'Sarmalar ___ gibi inceydi. Hangisi gelir?', a: 'kalem', w: ['davul', 'fıçı', 'dağ'], ex: 'İnce sarmalar kaleme benzetilir.', img: 'pencil' },
]
const BENZ7_P: P[] = [
  ['güneş', 'altın', 'sun'],
  ['su', 'buz', 'ice'],
  ['ırmak', 'billur', 'droplet'],
  ['eller', 'pamuk', 'hand'],
  ['çalışkan çocuk', 'arı', 'bee'],
  ['deniz', 'çarşaf', 'ship'],
]
const ALFABE_O: O[] = [
  { q: 'Bu sözcükleri sözlük sırasına diz.', s: ['bilge', 'fıkra', 'göl', 'şenlik', 'tiyatro'], ex: 'Sözlükte sözcükler alfabe sırasıyla dizilir.', img: 'books' },
  { q: 'Meyveleri alfabe sırasına diz.', s: ['armut', 'elma', 'kiraz', 'muz'], ex: 'a, e, k, m sırası.', img: 'apple' },
  { q: 'Kültür sözcüklerini alfabe sırasına diz.', s: ['bayrak', 'halay', 'kilim', 'türkü'], ex: 'b, h, k, t sırası.', img: 'trflag' },
  { q: 'Mutfak sözcüklerini alfabe sırasına diz.', s: ['ayran', 'börek', 'çorba', 'pilav'], ex: 'a, b, ç, p sırası.', img: 'bowl' },
  { q: 'Müzik sözcüklerini alfabe sırasına diz.', s: ['davul', 'kaval', 'saz', 'zurna'], ex: 'd, k, s, z sırası.', img: 'drum' },
]
const KULTUR_Q: Q[] = [
  { q: 'Hangisi millî bayramdır?', a: 'Cumhuriyet Bayramı', w: ['Ramazan Bayramı', 'Kurban Bayramı'], ex: 'Cumhuriyet Bayramı millî bayramımızdır.', img: 'trflag' },
  { q: 'Hangisi dinî bayramdır?', a: 'Ramazan Bayramı', w: ['Zafer Bayramı', 'Cumhuriyet Bayramı', 'Çocuk Bayramı'], ex: 'Ramazan Bayramı dinî bayramdır.', img: 'crescent' },
  { q: '23 Nisan kimlere armağan edildi?', a: 'Dünya çocuklarına', w: ['Yalnız öğretmenlere', 'Sporculara', 'Yalnız büyüklere'], ex: '23 Nisan dünya çocuklarına armağan edildi.', img: 'balloon' },
  { q: 'Halay nedir?', a: 'Bir halk oyunu', w: ['Bir yemek', 'Bir çiçek', 'Bir oyuncak'], ex: 'Halay el ele oynanan bir halk oyunudur.', img: 'music' },
  { q: 'Mantı nedir?', a: 'Geleneksel bir yemek', w: ['Bir halk oyunu', 'Bir müzik aleti', 'Bir şehir'], ex: 'Mantı sevilen geleneksel bir yemeğimizdir.', img: 'bowl' },
  { q: 'Nasreddin Hoca’nın anlattıkları nedir?', a: 'Fıkra', w: ['Şarkı', 'Haber', 'Tarif'], ex: 'Nasreddin Hoca fıkralarıyla bilinir.', img: 'grin' },
  { q: 'Kilim nedir?', a: 'El dokuması yer örtüsü', w: ['Bir meyve', 'Bir kuş', 'Bir oyun'], ex: 'Kilim elde dokunan bir örtüdür.', img: 'framed' },
]
const BAYRAM7_ITEMS: SortQ['items'] = [
  { label: 'El öpmek', img: 'hand', bin: 'evet' },
  { label: 'Bayramlık giymek', img: 'tshirt', bin: 'evet' },
  { label: 'Büyükleri ziyaret etmek', img: 'oldwoman', bin: 'evet' },
  { label: 'Şeker ikram etmek', img: 'candy', bin: 'evet' },
  { label: 'Bisiklet tamiri', img: 'bicycle', bin: 'hayir' },
  { label: 'Diş fırçalamak', img: 'toothbrush', bin: 'hayir' },
  { label: 'Ödev kontrolü', img: 'memo', bin: 'hayir' },
  { label: 'Yağmurda şemsiye açmak', img: 'umbrella', bin: 'hayir' },
]
const BAYRAM7_BINS: SortQ['bins'] = [
  { id: 'evet', label: 'Bayramla ilgili', img: 'gift', color: '#f97316' },
  { id: 'hayir', label: 'Bayramla ilgisiz', img: 'thinking', color: '#64748b' },
]
const KULTUR_HIT = ['Halay', 'Mantı', 'Kilim', 'Türkü', 'Fıkra', 'Ebru', 'Karagöz']
const KULTUR_WRONG = ['Robot', 'Uydu', 'Tablet', 'Ekran', 'Batarya']
const KULTUR_KELIME = ['mantı', 'halay', 'fıkra', 'türkü', 'kilim', 'bayrak', 'davul']
const T7_TF: TF[] = [
  ['23 Nisan dünya çocuklarına armağan edilmiştir.', true, 'Bütün dünya çocukları bu bayramı paylaşır.'],
  ['İstiklâl Marşı’nı saygıyla dinleriz.', true, 'Millî marşımızı ayakta, saygıyla dinleriz.'],
  ['Bayramda büyüklerimizi ziyaret ederiz.', true, 'Bayramlar aileyi bir araya getirir.'],
  ['Halay bir yemek adıdır.', false, 'Halay bir halk oyunudur.'],
  ['“Deniz çarşaf gibi” bir benzetmedir.', true, 'Deniz çarşafa benzetilmiş.'],
  ['Sözlükte sözcükler alfabe sırasıyla dizilir.', true, 'Önce a ile başlayanlar gelir.'],
  ['29 Ekim dinî bir bayramdır.', false, 'Cumhuriyet Bayramı millî bir bayramdır.'],
  ['Benzetme yaparken “gibi” sözcüğünü kullanabiliriz.', true, 'Pamuk gibi, bal gibi...'],
]
const T7_O: O[] = [
  { q: 'Bayram sabahını sırala.', s: ['Erkenden kalk', 'Bayramlığını giy', 'Büyüklerinin elini öp', 'Şekerini paylaş'], ex: 'Bayram sevgiyi ve paylaşmayı büyütür.', img: 'gift' },
  { q: 'Halay provasını sırala.', s: ['Adımları karıştırdılar', 'Öğretmen adımları gösterdi', 'El ele adım attılar', 'Alkışlandılar'], ex: 'Çalışarak başardılar.', img: 'music' },
  { q: 'Yoğurt mayalayalım. Sırala.', s: ['Sütü bir büyüğünle ısıt', 'Ilımasını bekle', 'Mayayı ekle', 'Üstünü örtüp beklet'], ex: 'Ocağı bir büyüğümüzle kullanırız.', img: 'milk' },
]
const T7_C: string[][] = [
  ['Ela', 'şekerleri', 'kardeşiyle', 'paylaştı.'],
  ['Bayramda', 'büyüklerimizi', 'ziyaret', 'ederiz.'],
  ['Deniz', 'çarşaf', 'gibi', 'dümdüzdü.'],
  ['Çocuklar', 'okulda', 'halay', 'çalıştı.'],
  ['Anadolu', 'her', 'mevsim', 'güzeldir.'],
]

/* ================================================================================================
 * TEMA 8 · HAKLARIMIZI BİLİYORUZ
 * ================================================================================================ */
const SALINCAK: Metin = {
  t: 'Salıncak Sırası',
  img: 'friends',
  text: 'Parkta tek bir salıncak vardı. Elif, Can ve Mina sallanmak istiyordu. Can, “Herkes on kez sallansın, sonra sıra değişsin.” dedi. Üçü de bu fikri beğendi. Böylece kimse küsmedi ve hepsi eğlendi.',
  qs: [
    { q: 'Parkta kaç salıncak vardı?', a: 'Bir', w: ['İki', 'Üç', 'Beş'], ex: 'Parkta tek bir salıncak vardı.' },
    { q: 'Can ne önerdi?', a: 'Sırayla sallanmayı', w: ['Eve gitmeyi', 'Yalnız sallanmayı', 'Başka parka gitmeyi'], ex: 'Herkes on kez sallanıp sırayı değiştirecekti.' },
    { q: 'Salıncak Sırası metni en çok neyi anlatıyor?', a: 'Hakça paylaşmayı', w: ['Salıncak yapmayı', 'Parkı temizlemeyi', 'Küsmeyi'], ex: 'Hakça paylaşınca herkes eğlenir.' },
    { q: 'Parkta kimler vardı?', a: 'Elif, Can ve Mina', w: ['Ece ve Kaan', 'Ada ve Berk', 'Zehra ve Yusuf'], ex: 'Elif, Can ve Mina sallanmak istiyordu.' },
    { q: 'Salıncak hikâyesinin sonunda ne oldu?', a: 'Hepsi eğlendi', w: ['Hepsi küstü', 'Salıncak kırıldı', 'Park kapandı'], ex: 'Kimse küsmedi, hepsi eğlendi.' },
  ],
}
const KEDI: Metin = {
  t: 'Kediye Su',
  img: 'cat',
  text: 'Çok sıcak bir gündü. Emir apartmanın önünde susamış bir kedi gördü. Annesiyle birlikte temiz bir kaba su koydular. Emir kediye dokunmadan uzaktan izledi. Kedi suyu içip gölgeye uzandı.',
  qs: [
    { q: 'O gün hava nasıldı?', a: 'Çok sıcaktı', w: ['Karlıydı', 'Yağmurluydu', 'Çok soğuktu'], ex: 'Çok sıcak bir gündü.' },
    { q: 'Emir kiminle su koydu?', a: 'Annesiyle', w: ['Dedesiyle', 'Arkadaşıyla', 'Tek başına'], ex: 'Annesiyle birlikte su koydular.' },
    { q: 'Emir kediye dokundu mu?', a: 'Hayır, uzaktan izledi', w: ['Evet, kucağına aldı', 'Evet, eve götürdü', 'Evet, okşadı'], ex: 'Sokak hayvanlarına dokunmadan, uzaktan yardım ederiz.' },
    { q: 'Kedi suyu içince ne yaptı?', a: 'Gölgeye uzandı', w: ['Kaçıp gitti', 'Ağaca tırmandı', 'Suyu döktü'], ex: 'Kedi suyu içip gölgeye uzandı.' },
    { q: 'Kediye Su metni en çok neyi anlatıyor?', a: 'Hayvanlara merhameti', w: ['Sıcak havayı', 'Apartmanları', 'Su içmeyi'], ex: 'Hayvanlara merhametle yardım ederiz.' },
  ],
}
const SOZ8_P: P[] = [
  ['sözleşme', 'Uyulacak yazılı anlaşma'],
  ['barış', 'Kavga ve savaş olmaması'],
  ['muhtar', 'Mahallenin seçilmiş yöneticisi'],
  ['emek', 'Bir iş için harcanan çaba'],
  ['program', 'Önceden yapılan plan'],
  ['hak', 'Bir kimseye tanınan şey'],
  ['proje', 'Yapılması planlanan iş'],
]
const HAK_P: P[] = [
  ['Eğitim hakkı', 'Okula gitmek', 'school'],
  ['Oyun hakkı', 'Parkta oynamak', 'ball'],
  ['Sağlık hakkı', 'Doktora gitmek', 'stethoscope'],
  ['Görüş bildirme hakkı', 'Fikrini söylemek', 'raisedhand'],
  ['Barınma hakkı', 'Bir evde yaşamak', 'house'],
  ['Yaşama hakkı', 'Güvenle büyümek', 'seedling'],
]
const HAK_HIT = ['Eğitim', 'Oyun', 'Sağlık', 'Barınma', 'Görüş bildirme', 'Güvenle yaşama']
const HAK_WRONG = ['Kavga', 'Lakap takmak', 'Dışlamak', 'Kırıcı söz']
const CANLI_ITEMS: SortQ['items'] = [
  { label: 'Kedi', img: 'cat', bin: 'canli' },
  { label: 'Ağaç', img: 'tree', bin: 'canli' },
  { label: 'Çocuk', img: 'girl', bin: 'canli' },
  { label: 'Kuş', img: 'bird', bin: 'canli' },
  { label: 'Balık', img: 'fish', bin: 'canli' },
  { label: 'Top', img: 'ball', bin: 'cansiz' },
  { label: 'Kitap', img: 'book', bin: 'cansiz' },
  { label: 'Taş', img: 'rock', bin: 'cansiz' },
  { label: 'Bisiklet', img: 'bicycle', bin: 'cansiz' },
  { label: 'Oyuncak tren', img: 'train', bin: 'cansiz' },
]
const CANLI_BINS: SortQ['bins'] = [
  { id: 'canli', label: 'Canlı', img: 'seedling', color: '#22c55e' },
  { id: 'cansiz', label: 'Cansız', img: 'rock', color: '#64748b' },
]
const DURUM_Q: Q[] = [
  { q: 'Arkadaşın salıncağı paylaşmıyor. Ne yaparsın?', a: 'Kibarca sıra isterim', w: ['Onu iterim', 'Ağlayıp bağırırım', 'Salıncağı çekerim'], ex: 'Hakkımızı kibarca ve sakince isteriz.', img: 'friends' },
  { q: 'Sınıf başkanı oldun ama görev zor geldi. Ne yaparsın?', a: 'Elimden geleni yaparım', w: ['Hemen bırakırım', 'Kimseyle konuşmam', 'Görevi unuturum'], ex: 'Üstlendiğimiz görevi yarıda bırakmayız.', img: 'medal' },
  { q: 'Bir arkadaşın oyuna alınmadı. Ne yaparsın?', a: 'Onu da oyuna çağırırım', w: ['Ona gülerim', 'Görmezden gelirim', 'Uzaklaşırım'], ex: 'Herkesin oyun hakkı vardır.', img: 'hug' },
  { q: 'Yaz tatilini nasıl geçirirsin?', a: 'Plan yapıp kitap okurum', w: ['Hep ekrana bakarım', 'Hiç uyumam', 'Her şeyi ertelerim'], ex: 'Planlı bir tatil hem eğlenceli hem verimli olur.', img: 'calendar' },
  { q: 'Susamış bir sokak kedisi gördün. Ne yaparsın?', a: 'Büyüğümle su koyarım', w: ['Kucağıma alırım', 'Eve götürürüm', 'Kovalarım'], ex: 'Bir büyüğümüzle su koyar, uzaktan izleriz.', img: 'cat' },
  { q: 'Tanımadığın biri e-postayla adresini soruyor. Ne yaparsın?', a: 'Yazmam, aileme söylerim', w: ['Hemen yazarım', 'Telefonumu da yazarım', 'Okulumu da yazarım'], ex: 'Kişisel bilgilerimizi tanımadığımız kişilerle paylaşmayız.', img: 'shield' },
]
const MEKTUP8_Q: Q[] = [
  { q: 'Mektubu nasıl bitiririz?', a: 'Hoşça kal, seni seven arkadaşın.', w: ['Sevgili Sena,', 'Konu:', 'Merhaba,'], ex: 'Mektubu güzel bir dilekle bitiririz.', img: 'heart' },
  { q: 'E-postada konuyu nereye yazarız?', a: 'Konu bölümüne', w: ['Tarih bölümüne', 'İmzanın altına', 'Hiçbir yere'], ex: 'E-postada “Konu” bölümü vardır.', img: 'laptop' },
  { q: 'Hangisi bir hitap sözüdür?', a: 'Sevgili Ayşe,', w: ['Saygılarımla.', 'Hoşça kal.', 'Görüşmek üzere.'], ex: 'Mektuba hitapla başlarız.', img: 'memo' },
  { q: 'Belediyeye öneri yazarken nasıl başlarız?', a: 'Sayın Yetkililer,', w: ['Hey millet!', 'Selam dostum,', 'Bana bakın!'], ex: 'Resmî yazıda saygılı hitap kullanırız.', img: 'classical' },
  { q: 'Resmî bir yazıyı nasıl bitiririz?', a: 'Saygılarımla.', w: ['Hadi bay bay!', 'Sevgili Ayşe,', 'Konu:'], ex: 'Resmî yazıyı “Saygılarımla.” diye bitiririz.', img: 'pencil' },
]
const NOKTA8_Q: Q[] = [
  { q: 'Sevgili Miray( ) Boşluğa ne gelir?', a: 'Virgül', w: ['Soru işareti', 'Ünlem', 'Nokta'], ex: 'Hitaptan sonra virgül konur.', img: 'memo' },
  { q: 'İyi misin( ) Boşluğa ne gelir?', a: 'Soru işareti', w: ['Ünlem', 'Nokta', 'Virgül'], ex: 'Soru cümlesinin sonuna soru işareti konur.', img: 'thinking' },
  { q: 'Miray( )ı çok özledim. Boşluğa ne gelir?', a: 'Kesme işareti', w: ['Virgül', 'Nokta', 'Kısa çizgi'], ex: 'Kişi adına gelen ek kesmeyle ayrılır: Miray’ı.', img: 'girl' },
  { q: 'Görüşmek üzere, hoşça kal( ) Sona ne gelir?', a: 'Nokta', w: ['Soru işareti', 'Virgül', 'Kısa çizgi'], ex: 'Bildiren cümlenin sonuna nokta konur.', img: 'wave2' },
  { q: 'Satır sonunda “tatilinde” bölündü: tatilin( )de. Ne gelir?', a: 'Kısa çizgi', w: ['Kesme işareti', 'Virgül', 'Nokta'], ex: 'Satır sonunda kısa çizgi kullanılır.', img: 'pencil' },
  { q: 'Yaşasın, tatil başladı( ) Sona ne gelir?', a: 'Ünlem', w: ['Soru işareti', 'Virgül', 'Kısa çizgi'], ex: 'Sevinç bildiren cümlenin sonuna ünlem konur.', img: 'party' },
]
const HAK_KELIME = ['hak', 'barış', 'emek', 'muhtar', 'proje', 'sevgi', 'eşitlik']
const T8_O: O[] = [
  { q: 'E-postanın bölümlerini sırala.', s: ['Kime', 'Konu', 'Sayın Yetkililer,', 'Mesaj', 'Saygılarımla'], ex: 'Önce alıcı ve konu, sonra hitap, mesaj ve kapanış.', img: 'laptop' },
  { q: 'Mektubun bölümlerini sırala.', s: ['Tarih', 'Sevgili Ayşe,', 'Merhaba, nasılsın?', 'Haberlerim', 'Hoşça kal'], ex: 'Mektup tarihle ve hitapla başlar.', img: 'memo' },
  { q: 'Oyun gününü sırala.', s: ['Heyecanlandık', 'Kurallar hatırlatıldı', 'Oyun başladı', 'Oyun berabere bitti'], ex: 'Kurallara uyunca herkes eğlenir.', img: 'ball' },
  { q: 'Salıncak hikâyesini sırala.', s: ['Üç çocuk salıncağa geldi', 'Can bir fikir söyledi', 'Herkes sırayla sallandı', 'Hepsi eğlendi'], ex: 'Hakça paylaşmak herkesi mutlu eder.', img: 'friends' },
  { q: 'Kediye su hikâyesini sırala.', s: ['Emir kediyi gördü', 'Annesiyle su koydu', 'Uzaktan izledi', 'Kedi gölgeye uzandı'], ex: 'Bir büyüğümüzle yardım ederiz.', img: 'cat' },
]
const T8_C: string[][] = [
  ['Her', 'çocuğun', 'oyun', 'hakkı', 'vardır.'],
  ['Salıncağı', 'sırayla', 'kullandık.'],
  ['Emir', 'kediye', 'su', 'koydu.'],
  ['Barış', 'dolu', 'bir', 'dünya', 'isteriz.'],
  ['Görevimi', 'yarıda', 'bırakmam.'],
]
const T8_TF: TF[] = [
  ['Sınıf başkanı sıkılınca görevini bırakabilir.', false, 'Üstlendiğimiz görevi yarıda bırakmayız.'],
  ['Her çocuğun oyun hakkı vardır.', true, 'Oyun çocukların hakkıdır.'],
  ['Sokak kedisine bir büyüğümüzle uzaktan yardım ederiz.', true, 'Dokunmadan, uzaktan izleriz.'],
  ['Salıncağı sırayla kullanırız.', true, 'Paylaşınca herkes eğlenir.'],
  ['Hakkımızı isterken bağırırız.', false, 'Kibarca ve sakin konuşuruz.'],
  ['Yaz tatilinde her gün biraz kitap okuyabiliriz.', true, 'Okumak tatili güzelleştirir.'],
  ['Tanımadığım birine e-postayla adresimi yazarım.', false, 'Kişisel bilgilerimizi paylaşmayız.'],
  ['Haklarımızla birlikte sorumluluklarımız da vardır.', true, 'Hak ve sorumluluk birlikte yürür.'],
]

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
export const TR2_ADALAR: Alan[] = [
  {
    id: 't1',
    no: 1,
    title: 'Değerlerimizle Varız',
    color: '#f0504a',
    dark: '#b8302c',
    icon: 'heart',
    acts: [
      { kind: 'okuma-semsiye', title: 'Paylaşılan Şemsiye', icon: 'umbrella', total: T, meb: 'T.O.2.3.b', gen: oku(SEMSIYE), ders: 'Metni dikkatle oku. Kim, ne yaptı? Metin en çok neyi anlatıyor?', points: ['Önce başlığa ve resme bak', 'Sonra metni oku', 'Soruyu metinde ara'], visual: img('umbrella') },
      { kind: 'okuma-defne', title: 'Defne’nin Görevi', icon: 'fish', total: T, meb: 'T.O.2.3.a', gen: oku(DEFNE), ders: 'Defne’nin bir görevi var. Metni oku, olayları ve kahramanı tanı.', visual: img('fish') },
      { kind: 'degerler', title: 'Değer Sözcükleri', icon: 'hug', total: T, meb: 'T.K.2.3.ç', gen: mt('Değeri anlamıyla eşleştir.', 'Değerlerimiz bizi güzel insan yapar.', DEGER_P), ders: 'Saygı, sevgi, nezaket, sorumluluk, azim, çalışkanlık ve öz denetim değerlerimizdir.', points: ['Saygı: değer vermek', 'Nezaket: kibar olmak', 'Azim: pes etmemek'], visual: img('hug') },
      { kind: 'sozluk', title: 'Sözlük Özgürlüktür', icon: 'openbook', total: T, meb: 'T.Y.2.2.c', gen: rot(ch(SOZ1_Q), mt('Sözcüğü anlamıyla eşleştir.', 'Bilmediğimiz sözcüğün anlamını cümleden tahmin ederiz.', SOZ1_P)), ders: 'Bilmediğin bir sözcük mü var? Cümleye bak, anlamını tahmin et, sonra sözlükten kontrol et.', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.2.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Sözcükler ve anlamları.', SOZ1_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'noktalama', title: 'Nokta mı, Virgül mü?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: ch(NOKTA1_Q), ders: 'Nokta cümle sonuna, sıra sayısından sonra ve saatte konur. Virgül hitaptan sonra ve sıralanan sözcüklerin arasına konur.', points: ['2. sınıf, 10.30', 'Sevgili Çocuklar,', 'Hale, Zeynep ve Mehmet'], visual: img('pencil') },
      { kind: 'nazik-sepet', title: 'Nazik mi, Kaba mı?', icon: 'happy', total: 4, meb: 'T.K.2.2.ç', gen: srt('Davranışları sepetlere ayır.', 'Nazik davranışlar herkesi mutlu eder.', NAZIK_BINS, NAZIK_ITEMS), ders: 'Sıra beklemek, teşekkür etmek, özür dilemek naziktir. Söz kesmek ve bağırmak kırıcıdır.', visual: img('happy') },
      { kind: 'nazik-balon', title: 'Sihirli Sözler', icon: 'balloon', total: 3, meb: 'T.K.2.1.e', gen: pop('Nazik sözlerin balonlarını patlat!', 'Bunlar nazik sözlerdir.', NAZIK_HIT, NAZIK_WRONG), ders: 'Lütfen, teşekkür ederim, özür dilerim: sihirli sözler!', visual: img('balloon') },
      { kind: 'hece', title: 'Hece Tablosu', icon: 'abc', total: T, meb: 'T.O.2.1.c', gen: rot(ch(HECE_Q), hece(HECE1)), ders: 'Sözcükleri hecelerine ayırarak okuruz. Her hecede bir sesli harf vardır.', points: ['ge-mi: 2 hece', 'o-to-büs: 3 hece'], visual: img('abc') },
      { kind: 'sirala', title: 'Önce, Sonra', icon: 'link', total: T, meb: 'T.Y.2.2.g', gen: ord(T1_O), ders: 'Olaylar bir sırayla olur: önce, sonra, daha sonra, en sonunda.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T1_C, 'train'), ders: 'Sözcükleri doğru sıraya dizince anlamlı bir cümle olur. Cümle büyük harfle başlar, noktayla biter.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.2.3.a', gen: tf(T1_TF, 'heart'), ders: 'Her cümleyi dikkatle dinle. Doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-kopru', title: 'Nezaket Köprüsü', icon: 'trophy', total: OYUN, meb: 'T.Y.2.3.ğ', oyun: true, gen: karma(tf(T1_TF), ch(NOKTA1_Q), ch(SOZ1_Q), oku(SEMSIYE, DEFNE)), ders: 'Fındık köprüden geçiyor! Her tahta bir soru. Doğru cevapla karşıya ulaş.', visual: img('trophy') },
      { kind: 'oyun-zincir', title: 'İyilik Zinciri', icon: 'heart', total: 4, meb: 'T.Y.2.2.g', oyun: true, gen: rot(ord(T1_O), pop('Nazik sözleri patlat!', 'Nazik sözler iyilik zincirini büyütür.', NAZIK_HIT, NAZIK_WRONG), mem('Değer kartlarını eşleştir!', 'Değerler ve anlamları.', DEGER_P)), ders: 'Halkaları sırala, zinciri büyüt!', visual: img('heart') },
    ],
  },
  {
    id: 't2',
    no: 2,
    title: 'Atatürk ve Çocuk',
    color: '#e8a317',
    dark: '#b07600',
    icon: 'trflag',
    acts: [
      { kind: 'okuma-bayrak', title: 'Balkondaki Bayrak', icon: 'trflag', total: T, meb: 'T.O.2.3.a', gen: oku(BAYRAK), ders: 'Yusuf’un bayram sabahını oku. Ne zaman, kim, ne yaptı?', visual: img('trflag') },
      { kind: 'okuma-zehra', title: 'Zehra’nın Sınıfı', icon: 'teddy', total: T, meb: 'T.O.2.3.b', gen: oku(ZEHRA), ders: 'Zehra’nın hayalini oku. Noktalama işaretlerine de dikkat et!', visual: img('teddy') },
      { kind: 'sozluk', title: 'Bayram Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.2.c', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ2_P), ders: 'Şenlik, vatan, zafer, marş... Sözcüklerin anlamlarını öğrenelim.', visual: img('openbook') },
      { kind: 'buyuk-harf', title: 'Büyük Harf Avcısı', icon: 'abc', total: T, meb: 'T.Y.2.3.f', gen: ch(BUYUK_Q), ders: 'Cümle başı, kişi, hayvan, şehir, ülke, kurum ve bayram adları büyük harfle başlar.', points: ['Ankara, Türkiye', 'Cumhuriyet Bayramı', 'Türkiye Büyük Millet Meclisi'], visual: img('abc') },
      { kind: 'ozel-ad', title: 'Büyük mü, Küçük mü?', icon: 'star', total: 4, meb: 'T.Y.2.3.f', gen: srt('Sözcükleri sepetlere ayır.', 'Özel adlar büyük harfle başlar.', OZEL_BINS, OZEL_ITEMS), ders: 'Özel adlar büyük harfle, diğer sözcükler küçük harfle başlar.', visual: img('star') },
      { kind: 'zit-anlam', title: 'Zıt Anlam Terazisi', icon: 'balance', total: T, meb: 'T.O.2.2.f', gen: mt('Zıt anlamlı sözcükleri eşleştir.', 'Anlamları birbirinin karşıtı olan sözcüklere zıt anlamlı denir.', ZIT2_P), ders: 'Anlamları birbirinin karşıtı olan sözcükler zıt anlamlıdır: acı – tatlı, boş – dolu.', points: ['ağır – hafif', 'yukarı – aşağı', 'üzgün – mutlu'], visual: img('balance') },
      { kind: 'zit-balon', title: 'Zıt Balonlar', icon: 'balloon', total: 3, meb: 'T.O.2.2.f', gen: pop('Zıt anlamlı çiftleri patlat!', 'Bu çiftler zıt anlamlıdır.', ZIT2_HIT, ZIT2_WRONG), ders: 'Yalnızca zıt anlamlı çiftlerin balonlarını patlat.', visual: img('balloon') },
      { kind: 'unlem-soru', title: 'Ünlem mi, Soru mu?', icon: 'surprised', total: T, meb: 'T.Y.2.3.ğ', gen: ch(UNLEM_Q), ders: 'Sevinç ve uyarı sözlerinden sonra ünlem (!), soru cümlesinden sonra soru işareti (?) konur. Açıklamadan önce iki nokta (:) gelir.', visual: img('surprised') },
      { kind: 'neden-sonuc', title: 'Neden Oldu?', icon: 'thinking', total: T, meb: 'T.Y.2.2.m', gen: ch(NEDEN2_Q), ders: 'Her olayın bir nedeni vardır. “... için” ve “çünkü” sözcükleri nedeni anlatır.', visual: img('thinking') },
      { kind: 'bayramlar', title: 'Bayramlar ve Meslekler', icon: 'calendar', total: T, meb: 'T.K.2.3.ç', gen: rot(mt('Tarihi bayramla eşleştir.', 'Millî bayramlarımız ve özel günlerimiz.', BAYRAM2_P), ch(MESLEK2_Q)), ders: 'Millî bayramlarımızı ve meslekleri tanıyalım. Bilmeceleri çöz!', visual: img('calendar') },
      { kind: 'sirala', title: 'Bayram Sabahı Sırası', icon: 'sunrise', total: T, meb: 'T.K.2.2.b', gen: ord(T2_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('sunrise') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T2_C, 'train'), ders: 'Sözcükleri doğru sıraya diz, anlamlı bir cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.Y.2.3.f', gen: tf(T2_TF, 'trflag'), ders: 'Büyük harf, ünlem, zıt anlam ve bayramlar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-bayrak-yolu', title: 'Bayrak Yolu', icon: 'trophy', total: OYUN, meb: 'T.Y.2.3.f', oyun: true, gen: karma(ch(BUYUK_Q), ch(UNLEM_Q), mt('Zıt anlamlıları eşleştir.', 'Zıt anlamlı sözcükler.', ZIT2_P), tf(T2_TF)), ders: 'Fındık bayrak direğine yürüyor! Her adımda bir soru seni bekliyor.', visual: img('trophy') },
      { kind: 'oyun-terazi', title: 'Zıt Anlam Hafızası', icon: 'balance', total: 4, meb: 'T.K.2.2.d', oyun: true, gen: rot(mem('Zıt anlamlı kartları eşleştir!', 'Zıt anlamlı sözcükler.', ZIT2_P), pop('Büyük harfle başlayan özel adları patlat!', 'Özel adlar büyük harfle başlar.', OZEL_HIT, OZEL_WRONG), pop('Zıt anlamlı çiftleri patlat!', 'Bunlar zıt anlamlıdır.', ZIT2_HIT, ZIT2_WRONG)), ders: 'Kartları çevir, balonları patlat!', visual: img('balance') },
    ],
  },
  {
    id: 't3',
    no: 3,
    title: 'Doğada Neler Oluyor?',
    color: '#4caf50',
    dark: '#2e7d32',
    icon: 'tree',
    acts: [
      { kind: 'okuma-kavanoz', title: 'Kavanozdan Saksı', icon: 'jar', total: T, meb: 'T.O.2.3.b', gen: oku(KAVANOZ), ders: 'Mert’in kavanozu çöpe mi gitti, saksı mı oldu? Oku ve öğren.', visual: img('jar') },
      { kind: 'okuma-kar', title: 'Kar Sabahı', icon: 'snowman', total: T, meb: 'T.O.2.3.a', gen: oku(KAR), ders: 'Elif’in kar sabahını oku. Benzetmelere dikkat et!', visual: img('snowman') },
      { kind: 'sozluk', title: 'Doğa Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.2.c', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ3_P), ders: 'Fide, atık, fesleğen, cömert... Sözcükleri anlamlarıyla tanıyalım.', visual: img('openbook') },
      { kind: 'benzetme', title: 'Gibi Gibi', icon: 'sparkles', total: T, meb: 'T.Y.2.2.k', gen: ch(BENZ3_Q), ders: 'Benzetmede bir varlık başka bir varlığa “gibi” ile benzetilir: Kar pamuk gibi bembeyaz.', points: ['pamuk gibi yumuşak', 'bal gibi tatlı', 'karınca gibi çalışkan'], visual: img('sparkles') },
      { kind: 'benzetme-esle', title: 'Neye Benziyor?', icon: 'link', total: T, meb: 'T.Y.2.2.k', gen: mt('Benzeyeni benzetildiği şeyle eşleştir.', 'Benzeyen ve benzetilen.', BENZ3_P), ders: 'Benzeyen ve kendisine benzetilen varlıkları eşleştir.', visual: img('link') },
      { kind: 'mi-mi', title: 'mı, mi, mu, mü', icon: 'thinking', total: T, meb: 'T.Y.2.3.d', gen: ch(MI_Q), ders: 'Soru eki “mı, mi, mu, mü” her zaman ayrı yazılır. Cümlenin sonuna soru işareti konur.', points: ['Suladın mı?', 'Yardım eder misin?'], visual: img('thinking') },
      { kind: 'atik-sepet', title: 'Atıkları Ayır', icon: 'recycle', total: 4, meb: 'T.O.2.2.e', gen: srt('Atıkları doğru kutuya at.', 'Atıkları ayırırsak geri dönüştürülür.', ATIK_BINS, ATIK_ITEMS), ders: 'Cam, kâğıt ve plastik atıkları ayrı kutulara atarız.', visual: img('recycle') },
      { kind: 'doga-balon', title: 'Doğaya Yardım', icon: 'balloon', total: 3, meb: 'T.O.2.2.g', gen: pop('Doğaya yardım eden davranışları patlat!', 'Bu davranışlar doğayı korur.', DOGA_HIT, DOGA_WRONG), ders: 'Az atık çıkar, suyu boşa akıtma, fidan dik!', visual: img('balloon') },
      { kind: 'meyve-avi', title: 'Meyve Avı', icon: 'basket', total: 3, meb: 'T.D.2.2.g', gen: avi(MEYVE, 'Tablodaki meyveleri bul!'), ders: 'Tabloda saklanan meyve adlarını bul.', visual: img('basket') },
      { kind: 'afet', title: 'Hazırlıklı Olalım', icon: 'shield', total: T, meb: 'T.K.2.2.ğ', gen: mt('Doğa olayını önlemiyle eşleştir.', 'Önlem alırsak zararı azaltırız.', AFET_P), ders: 'Doğa olaylarına önceden hazırlanırız. Önlem almak bizi korur.', visual: img('shield') },
      { kind: 'sirala', title: 'Adım Adım', icon: 'orange', total: T, meb: 'T.Y.2.2.ğ', gen: ord(T3_O), ders: 'Yönergeleri ve olayları sırasıyla diz.', visual: img('orange') },
      { kind: 'cumle', title: 'Mevsim Cümleleri', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T3_C, 'train'), ders: 'Karışık sözcüklerden anlamlı cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.2.2.g', gen: tf(T3_TF, 'seedling'), ders: 'Sağlık ve doğa cümlelerini dinle. Doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-kova', title: 'Eski Kovanın Yolculuğu', icon: 'trophy', total: OYUN, meb: 'T.Y.2.2.k', oyun: true, gen: karma(srt('Atıkları doğru kutuya at.', 'Atıkları ayırırız.', ATIK_BINS, ATIK_ITEMS), ch(BENZ3_Q), ch(MI_Q), tf(T3_TF)), ders: 'Eski kova durak durak ilerliyor. Her durakta bir soru var!', visual: img('trophy') },
      { kind: 'oyun-bahce', title: 'Benzetme Bahçesi', icon: 'flower', total: 4, meb: 'T.K.2.2.g', oyun: true, gen: rot(mem('Benzetme kartlarını eşleştir!', 'Benzeyen ve benzetilen.', BENZ3_P), pop('Doğaya yardım eden davranışları patlat!', 'Doğayı koruyoruz.', DOGA_HIT, DOGA_WRONG), avi(MEYVE, 'Bahçedeki meyveleri bul!')), ders: 'Her doğru cevap bir çiçek açtırır!', visual: img('flower') },
    ],
  },
  {
    id: 't4',
    no: 4,
    title: 'Okuma Serüvenimiz',
    color: '#3b82f6',
    dark: '#1d4ed8',
    icon: 'books',
    acts: [
      { kind: 'okuma-odunc', title: 'Ödünç Kitap', icon: 'books', total: T, meb: 'T.O.2.3.a', gen: oku(ODUNC), ders: 'Ada kütüphaneden kitap aldı. Oku ve soruları cevapla.', visual: img('books') },
      { kind: 'okuma-berk', title: 'Kelime Kutusu', icon: 'package', total: T, meb: 'T.O.2.3.b', gen: oku(BERK), ders: 'Berk kelime topluyor. Sen de onunla kelime avına çık!', visual: img('package') },
      { kind: 'sozluk', title: 'Kitap Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.3.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Okudukça sözcüklerimiz çoğalır.', SOZ4_P), ders: 'Hazine, macera, kaptan, ilham... Sözcüklerin anlamlarını öğren.', visual: img('openbook') },
      { kind: 'kisaltma', title: 'Kısaltmalar', icon: 'abc', total: T, meb: 'T.Y.2.3.e', gen: ch(KISA_Q), ders: 'Kısaltmalarda her sözcüğün ilk harfi büyük yazılır: Türk Dil Kurumu → TDK.', points: ['TBMM', 'MEB', 'THY'], visual: img('abc') },
      { kind: 'kisaltma-esle', title: 'Kısaltma Eşleştir', icon: 'link', total: T, meb: 'T.Y.2.3.e', gen: mt('Kısaltmayı açılımıyla eşleştir.', 'Kısaltmalar ve açılımları.', KISA_P), ders: 'Her kısaltmanın bir açılımı vardır.', visual: img('link') },
      { kind: 'zit-anlam', title: 'Zıt Etiketler', icon: 'balance', total: T, meb: 'T.O.2.2.f', gen: mt('Zıt anlamlı sözcükleri eşleştir.', 'Zıt anlamlı sözcükler.', ZIT4_P), ders: 'eski – yeni, ilk – son, pahalı – ucuz: zıt anlamlı sözcükler!', visual: img('balance') },
      { kind: 'neden-sonuc', title: 'Neden, Sonuç', icon: 'thinking', total: T, meb: 'T.Y.2.2.m', gen: ch(NEDEN4_Q), ders: 'Neden önce olur, sonuç ondan sonra gelir: Erken yattığım için (neden) erken uyandım (sonuç).', visual: img('thinking') },
      { kind: 'hata-bul', title: 'Hata Dedektifi', icon: 'detective', total: T, meb: 'T.Y.2.5.a', gen: ch(HATA_Q), ders: 'Cümlede hata var mı? Büyük harfe ve noktalamaya bak.', visual: img('detective') },
      { kind: 'kutuphane', title: 'Kütüphane Kuralları', icon: 'books', total: 4, meb: 'T.O.2.4.b', gen: srt('Davranışları sepetlere ayır.', 'Kütüphanede sessiz ve özenli oluruz.', KUTUP_BINS, KUTUP_ITEMS), ders: 'Kütüphanede sessiz okur, kitaplara özen gösterir, zamanında geri getiririz.', visual: img('books') },
      { kind: 'kelime-avi', title: 'Kelime Avı', icon: 'magnifier', total: 3, meb: 'T.Y.2.3.c', gen: avi(KITAP_KELIME, 'Tablodaki kitap kelimelerini bul!'), ders: 'Tabloda saklanan kelimeleri bul.', visual: img('magnifier') },
      { kind: 'kelime-toplama', title: 'Hece Hece Kelime', icon: 'abc', total: T, meb: 'T.O.2.1.c', gen: rot(hece(HECE4), pop('Kitapla ilgili sözcükleri patlat!', 'Bunlar kitap dünyasından sözcükler.', KITAP_HIT, KITAP_WRONG)), ders: 'Heceleri birleştir, kelimeleri topla!', visual: img('abc') },
      { kind: 'sirala', title: 'Kitap Yolculuğu', icon: 'openbook', total: T, meb: 'T.Y.2.2.ğ', gen: ord(T4_O), ders: 'Adımları ve olayları sırasıyla diz.', visual: img('openbook') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T4_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Okuma Kuralları', icon: 'thumbsup', total: T, meb: 'T.O.2.1.c', gen: tf(T4_TF, 'openbook'), ders: 'Okurken nelere dikkat ederiz? Doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-toplayici', title: 'Kelime Toplayıcısı', icon: 'trophy', total: OYUN, meb: 'T.Y.2.3.e', oyun: true, gen: karma(hece(HECE4), ch(KISA_Q), ch(HATA_Q), oku(ODUNC, BERK)), ders: 'Fındık’ın defterine kelime topla! Her doğru cevap yeni bir kelime.', visual: img('trophy') },
      { kind: 'oyun-raflar', title: 'Kütüphane Rafları', icon: 'books', total: 4, meb: 'T.O.2.4.b', oyun: true, gen: rot(srt('Davranışları rafa koy.', 'Kütüphane kuralları.', KUTUP_BINS, KUTUP_ITEMS), mem('Kısaltma kartlarını eşleştir!', 'Kısaltmalar ve açılımları.', KISA_P), avi(KITAP_KELIME, 'Raflarda saklanan kelimeleri bul!')), ders: 'Rafları düzenle, kartları eşleştir!', visual: img('books') },
    ],
  },
  {
    id: 't5',
    no: 5,
    title: 'Yeteneklerimizi Tanıyoruz',
    color: '#a855f7',
    dark: '#7e22ce',
    icon: 'palette',
    acts: [
      { kind: 'okuma-topac', title: 'Dedemin Topacı', icon: 'oldman', total: T, meb: 'T.O.2.3.b', gen: oku(TOPAC), ders: 'Topaç hemen dönmedi. Oku, bakalım ne oldu?', visual: img('oldman') },
      { kind: 'okuma-ressam', title: 'Sınıfın Ressamı', icon: 'palette', total: T, meb: 'T.O.2.3.c', gen: oku(RESSAM), ders: 'Mina ve Arda’nın yeteneklerini oku. Benzer ve farklı yönleri ne?', visual: img('palette') },
      { kind: 'sozluk', title: 'Sanat Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.3.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ5_P), ders: 'Maket, müze, hayal, kil... Sözcüklerin anlamlarını öğren.', visual: img('openbook') },
      { kind: 'kesme', title: 'Kesme İşareti', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: ch(KESME_Q), ders: 'Özel adlara gelen ekler kesme işaretiyle ( ’ ) ayrılır: Ankara’ya, Ada’nın.', points: ['Türkiye’de', 'Mert’in', 'okula (kesme yok)'], visual: img('pencil') },
      { kind: 'kesme-balon', title: 'Kesme Balonları', icon: 'balloon', total: 3, meb: 'T.Y.2.3.ğ', gen: pop('Doğru yazılmış sözcükleri patlat!', 'Kesme işareti yalnızca özel adlara gelen ekleri ayırır.', KESME_HIT, KESME_WRONG), ders: 'Kesme işareti doğru kullanılmış balonları bul.', visual: img('balloon') },
      { kind: 'satir-sonu', title: 'Satır Sonu', icon: 'ruler', total: T, meb: 'T.Y.2.3.g', gen: ch(SATIR_Q), ders: 'Satıra sığmayan sözcük heceden bölünür ve satır sonuna kısa çizgi (-) konur: kele-bek.', visual: img('ruler') },
      { kind: 'heceler', title: 'Oyun Heceleri', icon: 'abc', total: T, meb: 'T.Y.2.3.g', gen: hece(HECE5), ders: 'Oyun adlarını heceleri birleştirerek bul.', visual: img('abc') },
      { kind: 'meslekler', title: 'Meslekler', icon: 'tools', total: T, meb: 'T.K.2.3.ç', gen: mt('Mesleği yaptığı işle eşleştir.', 'Her meslek değerlidir.', MESLEK5_P), ders: 'Meslekler insanlar kadar çoktur. Her mesleğe ve emeğe saygı duyarız.', visual: img('tools') },
      { kind: 'mektup', title: 'Mektup ve Tebrik', icon: 'memo', total: T, meb: 'T.Y.2.1.c', gen: ch(MEKTUP5_Q), ders: 'Mektuba hitapla başlar (Sevgili ...,), güzel bir dilekle bitiririz.', visual: img('memo') },
      { kind: 'oyuncak-sepet', title: 'Eski mi, Yeni mi?', icon: 'teddy', total: 4, meb: 'T.Y.2.2.e', gen: srt('Oyuncakları sepetlere ayır.', 'Eski ve yeni oyuncaklar.', OYUNCAK_BINS, OYUNCAK_ITEMS), ders: 'Dedelerimiz topaç ve misketle oynardı. Bugün kumandalı arabalar var!', visual: img('teddy') },
      { kind: 'oyun-adlari', title: 'Oyun Adları Avı', icon: 'magnifier', total: 3, meb: 'T.D.2.3.a', gen: avi(OYUN_ADI, 'Tablodaki oyun adlarını bul!'), ders: 'Geleneksel oyunlarımızın adlarını tabloda bul.', visual: img('magnifier') },
      { kind: 'sirala', title: 'Oyun Yönergesi', icon: 'eyes', total: T, meb: 'T.K.2.2.e', gen: ord(T5_O), ders: 'Yönergeleri ve olayları sırasıyla diz.', visual: img('eyes') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T5_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.Y.2.3.ğ', gen: tf(T5_TF, 'palette'), ders: 'Kesme, satır sonu ve yetenekler: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-sahne', title: 'Yetenek Sahnesi', icon: 'trophy', total: OYUN, meb: 'T.Y.2.3.ğ', oyun: true, gen: karma(ch(KESME_Q), ch(SATIR_Q), tf(T5_TF), ch(MEKTUP5_Q)), ders: 'Sahnenin ışıklarını yak! Her doğru cevap bir spot ışığı.', visual: img('trophy') },
      { kind: 'oyun-muze', title: 'Oyuncak Müzesi', icon: 'framed', total: 4, meb: 'T.Y.2.2.e', oyun: true, gen: rot(srt('Vitrinleri doldur: eski mi, yeni mi?', 'Eski ve yeni oyuncaklar.', OYUNCAK_BINS, OYUNCAK_ITEMS), mem('Sözcük kartlarını eşleştir!', 'Sözcükler ve anlamları.', SOZ5_P), pop('Doğru yazılmış sözcükleri patlat!', 'Kesme işareti özel adlara gelen ekleri ayırır.', KESME_HIT, KESME_WRONG)), ders: 'Müzeyi gez, vitrinleri doldur!', visual: img('framed') },
    ],
  },
  {
    id: 't6',
    no: 6,
    title: 'Mucit Çocuk',
    color: '#06b6d4',
    dark: '#0e7490',
    icon: 'robot',
    acts: [
      { kind: 'okuma-olcer', title: 'Yağmur Ölçer', icon: 'rain', total: T, meb: 'T.O.2.3.a', gen: oku(OLCER), ders: 'Zeynep bir icat yaptı! Oku ve öğren.', visual: img('rain') },
      { kind: 'okuma-fistik', title: 'Robot Fıstık', icon: 'robot', total: T, meb: 'T.O.2.2.ç', gen: oku(FISTIK), ders: 'Can’ın robotu neden geri gitmiyor? Oku ve bul.', visual: img('robot') },
      { kind: 'sozluk', title: 'Bilim Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.3.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Bilim ve teknoloji sözcükleri.', SOZ6_P), ders: 'Mucit, icat, astronot, uydu... Sözcüklerin anlamlarını öğren.', visual: img('openbook') },
      { kind: 'baglac', title: 've, ile, ama, çünkü', icon: 'link', total: T, meb: 'T.K.2.3.f', gen: ch(BAGLAC_Q), ders: '“ve, ile” birleştirir; “ama” karşıt durumu, “çünkü” nedeni anlatır.', points: ['Kalem ve defter', 'Açtım ama çalışmadı', 'Sarıldı çünkü özlemişti'], visual: img('link') },
      { kind: 'zit-anlam', title: 'Zıt Anlam Atölyesi', icon: 'balance', total: T, meb: 'T.K.2.2.d', gen: mt('Zıt anlamlı sözcükleri eşleştir.', 'Zıt anlamlı sözcükler.', ZIT6_P), ders: 'küçük – büyük, soru – cevap, az – çok: zıt anlamlı sözcükler.', visual: img('balance') },
      { kind: 'merak-balon', title: 'Merak Soruları', icon: 'balloon', total: 3, meb: 'T.Y.2.3.ğ', gen: pop('Soru cümlelerini patlat!', 'Soru cümlelerinin sonunda soru işareti vardır.', MERAK_HIT, MERAK_WRONG), ders: 'Merak eden soru sorar! Soru cümlelerini bul.', visual: img('balloon') },
      { kind: 'robot-insan', title: 'Robot mu, İnsan mı?', icon: 'robot2', total: 4, meb: 'T.Y.2.2.d', gen: srt('Bunu kim yapabilir? Sepetlere ayır.', 'Robotlar iş yapar, duygular insana özgüdür.', ROBOT_BINS, ROBOT_ITEMS), ders: 'Robotlar yük taşır, ses çıkarır. Sarılmak ve hayal kurmak ise insana özgüdür.', visual: img('robot2') },
      { kind: 'gecmis-bugun', title: 'Geçmiş ve Bugün', icon: 'hourglass', total: 4, meb: 'T.Y.2.2.e', gen: srt('Araçları sepetlere ayır.', 'Teknoloji zamanla değişti.', ZAMAN_BINS, ZAMAN_ITEMS), ders: 'Geçmişte at arabası ve posta güvercini vardı; bugün uçak ve akıllı telefon var.', visual: img('hourglass') },
      { kind: 'bilim-avi', title: 'Bilim Kelime Avı', icon: 'magnifier', total: 3, meb: 'T.Y.2.3.c', gen: avi(BILIM, 'Tablodaki bilim kelimelerini bul!'), ders: 'Tabloda saklanan bilim kelimelerini bul.', visual: img('magnifier') },
      { kind: 'heceler', title: 'Hece Yolu', icon: 'abc', total: T, meb: 'T.O.2.1.c', gen: hece(HECE6), ders: 'Heceleri birleştir: me-rak-lı, mu-cit!', visual: img('abc') },
      { kind: 'sirala', title: 'Mucit Adımları', icon: 'gear', total: T, meb: 'T.Y.2.2.ğ', gen: ord(T6_O), ders: 'Bir icat adım adım yapılır. Sırala!', visual: img('gear') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T6_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.2.3.a', gen: tf(T6_TF, 'rocket'), ders: 'Bilim, zıt anlam ve bağlaçlar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-atolye', title: 'Mucit Atölyesi', icon: 'trophy', total: OYUN, meb: 'T.K.2.3.f', oyun: true, gen: karma(ch(BAGLAC_Q), mt('Zıt anlamlıları eşleştir.', 'Zıt anlamlı sözcükler.', ZIT6_P), tf(T6_TF), hece(HECE6)), ders: 'Parçaları topla, icadını tamamla! Her doğru cevap bir parça.', visual: img('trophy') },
      { kind: 'oyun-uzay', title: 'Uzay Yolculuğu', icon: 'rocket', total: 4, meb: 'T.Y.2.2.e', oyun: true, gen: rot(avi(BILIM, 'Uzaydaki kelimeleri bul!'), mem('Bilim kartlarını eşleştir!', 'Sözcükler ve anlamları.', SOZ6_P), srt('Araçları sepetlere ayır.', 'Geçmiş ve günümüz.', ZAMAN_BINS, ZAMAN_ITEMS)), ders: 'Roket her doğru cevapta yeni bir gezegene uçar!', visual: img('rocket') },
    ],
  },
  {
    id: 't7',
    no: 7,
    title: 'Kültür Hazinemiz',
    color: '#f97316',
    dark: '#c2410c',
    icon: 'gem',
    acts: [
      { kind: 'okuma-bayram', title: 'Bayram Sabahı', icon: 'gift', total: T, meb: 'T.O.2.3.a', gen: oku(BAYRAM_SABAHI), ders: 'Ela’nın bayram sabahını oku. Olaylar hangi sırayla oldu?', visual: img('gift') },
      { kind: 'okuma-halay', title: 'Halay Provası', icon: 'music', total: T, meb: 'T.O.2.3.b', gen: oku(HALAY), ders: 'Kerem ve arkadaşları halay çalışıyor. Oku ve öğren.', visual: img('music') },
      { kind: 'sozluk', title: 'Hazine Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.2.c', gen: rot(mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ7_P), ch(SOZGRUP_Q)), ders: 'Çanak, bilge, billur, şaheser... Sözcüklerin ve sözcük gruplarının anlamlarını öğren.', visual: img('openbook') },
      { kind: 'benzetme', title: 'Gibi Gibi', icon: 'sparkles', total: T, meb: 'T.K.2.2.g', gen: ch(BENZ7_Q), ders: 'Deniz çarşaf gibi, su buz gibi: benzetme anlatımı güzelleştirir.', visual: img('sparkles') },
      { kind: 'benzetme-esle', title: 'Neye Benziyor?', icon: 'link', total: T, meb: 'T.K.2.2.g', gen: mt('Benzeyeni benzetildiği şeyle eşleştir.', 'Benzeyen ve benzetilen.', BENZ7_P), ders: 'Benzeyen ve benzetilen varlıkları eşleştir.', visual: img('link') },
      { kind: 'alfabe', title: 'Sözlük Sırası', icon: 'books', total: T, meb: 'T.Y.2.3.b', gen: ord(ALFABE_O), ders: 'Sözlükte sözcükler alfabe sırasıyla dizilir. İlk harflere bak!', points: ['a, b, c, ç, d, e...'], visual: img('books') },
      { kind: 'kultur', title: 'Kültür Çantası', icon: 'gem', total: T, meb: 'T.O.2.2.a', gen: ch(KULTUR_Q), ders: 'Bayramlarımız, halk oyunlarımız, yemeklerimiz ve fıkralarımız kültür hazinemizdir.', visual: img('gem') },
      { kind: 'bayram-sepet', title: 'Bayramla İlgili mi?', icon: 'gift', total: 4, meb: 'T.O.2.2.e', gen: srt('Davranışları sepetlere ayır.', 'Bayram gelenekleri.', BAYRAM7_BINS, BAYRAM7_ITEMS), ders: 'Bayramda el öper, büyüklerimizi ziyaret eder, şeker ikram ederiz.', visual: img('gift') },
      { kind: 'kultur-balon', title: 'Hazine Balonları', icon: 'balloon', total: 3, meb: 'T.O.2.2.e', gen: pop('Geleneksel kültürümüzden olanları patlat!', 'Bunlar kültür hazinemizden.', KULTUR_HIT, KULTUR_WRONG), ders: 'Kültürümüze ait olanları bul.', visual: img('balloon') },
      { kind: 'kultur-avi', title: 'Kültür Kelime Avı', icon: 'magnifier', total: 3, meb: 'T.Y.2.3.c', gen: avi(KULTUR_KELIME, 'Tablodaki kültür kelimelerini bul!'), ders: 'Tabloda saklanan kelimeleri bul.', visual: img('magnifier') },
      { kind: 'sirala', title: 'Bayram ve Halay', icon: 'calendar', total: T, meb: 'T.Y.2.2.ğ', gen: ord(T7_O), ders: 'Olayları ve yönergeleri sırasıyla diz.', visual: img('calendar') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T7_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.2.3.a', gen: tf(T7_TF, 'gem'), ders: 'Bayramlar, benzetme ve sözlük sırası: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-cark', title: 'Kültür Çarkı', icon: 'trophy', total: OYUN, meb: 'T.K.2.2.g', oyun: true, gen: karma(ch(KULTUR_Q), ch(BENZ7_Q), tf(T7_TF), ord(ALFABE_O)), ders: 'Çarkı çevir! Gelen sorudan kültür kartı kazan.', visual: img('trophy') },
      { kind: 'oyun-gezi', title: 'Anadolu Gezisi', icon: 'bus', total: 4, meb: 'T.O.2.2.e', oyun: true, gen: rot(mem('Benzetme kartlarını eşleştir!', 'Benzeyen ve benzetilen.', BENZ7_P), avi(KULTUR_KELIME, 'Gezide saklanan kelimeleri bul!'), pop('Geleneksel kültürümüzden olanları patlat!', 'Kültür hazinemiz.', KULTUR_HIT, KULTUR_WRONG)), ders: 'Otobüs durak durak Anadolu’yu geziyor!', visual: img('bus') },
    ],
  },
  {
    id: 't8',
    no: 8,
    title: 'Haklarımızı Biliyoruz',
    color: '#ec4899',
    dark: '#be185d',
    icon: 'balance',
    acts: [
      { kind: 'okuma-salincak', title: 'Salıncak Sırası', icon: 'friends', total: T, meb: 'T.O.2.3.b', gen: oku(SALINCAK), ders: 'Parkta tek salıncak var. Çocuklar ne yaptı? Oku ve öğren.', visual: img('friends') },
      { kind: 'okuma-kedi', title: 'Kediye Su', icon: 'cat', total: T, meb: 'T.O.2.3.a', gen: oku(KEDI), ders: 'Emir susamış bir kediye yardım etti. Oku ve soruları cevapla.', visual: img('cat') },
      { kind: 'sozluk', title: 'Hak Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.2.3.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ8_P), ders: 'Hak, barış, emek, muhtar... Sözcüklerin anlamlarını öğren.', visual: img('openbook') },
      { kind: 'haklar', title: 'Çocuk Hakları', icon: 'balance', total: T, meb: 'T.K.2.3.ç', gen: mt('Hakkı örneğiyle eşleştir.', 'Her çocuğun hakları vardır.', HAK_P), ders: 'Her çocuğun eğitim, oyun, sağlık ve görüş bildirme hakkı vardır.', visual: img('balance') },
      { kind: 'hak-balon', title: 'Hak Balonları', icon: 'balloon', total: 3, meb: 'T.O.2.2.e', gen: pop('Çocuk haklarını patlat!', 'Bunlar her çocuğun hakkıdır.', HAK_HIT, HAK_WRONG), ders: 'Çocuk haklarını bul, balonları patlat!', visual: img('balloon') },
      { kind: 'canli-cansiz', title: 'Canlı mı, Cansız mı?', icon: 'seedling', total: 4, meb: 'T.D.2.2.g', gen: srt('Varlıkları sepetlere ayır.', 'Canlılar büyür, beslenir, solunum yapar.', CANLI_BINS, CANLI_ITEMS), ders: 'Kedi, ağaç ve çocuk canlıdır. Top, kitap ve taş cansızdır.', visual: img('seedling') },
      { kind: 'durumlar', title: 'Ne Yaparsın?', icon: 'thinking', total: T, meb: 'T.Y.2.2.ı', gen: ch(DURUM_Q), ders: 'Hakkımızı kibarca isteriz, görevimizi yarıda bırakmayız, hayvanlara merhamet ederiz.', visual: img('thinking') },
      { kind: 'mektup', title: 'Mektup ve E-posta', icon: 'memo', total: T, meb: 'T.Y.2.2.j', gen: ch(MEKTUP8_Q), ders: 'Mektup hitapla başlar, dilekle biter. E-postanın “Kime” ve “Konu” bölümleri vardır. Gerçek adres yazmayız!', visual: img('memo') },
      { kind: 'noktalama', title: 'Mektuptaki İşaretler', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: ch(NOKTA8_Q), ders: 'Virgül, soru işareti, kesme, nokta, kısa çizgi ve ünlem: hepsini mektupta kullanırız.', visual: img('pencil') },
      { kind: 'hak-avi', title: 'Hak Kelime Avı', icon: 'magnifier', total: 3, meb: 'T.Y.2.3.c', gen: avi(HAK_KELIME, 'Tablodaki kelimeleri bul!'), ders: 'Tabloda saklanan kelimeleri bul.', visual: img('magnifier') },
      { kind: 'sirala', title: 'Sırayla', icon: 'link', total: T, meb: 'T.Y.2.2.g', gen: ord(T8_O), ders: 'Mektubun, e-postanın ve olayların bölümlerini sırala.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.2.3.e', gen: cumle(T8_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.2.3.a', gen: tf(T8_TF, 'balance'), ders: 'Haklar ve sorumluluklar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-durak', title: 'Çocuk Hakları Durağı', icon: 'trophy', total: OYUN, meb: 'T.Y.2.2.ı', oyun: true, gen: karma(mt('Hakkı örneğiyle eşleştir.', 'Çocuk hakları.', HAK_P), ch(DURUM_Q), tf(T8_TF), oku(SALINCAK, KEDI)), ders: 'Mahallemize bir durak yapıyoruz! Her doğru cevap durağa yeni bir parça ekler.', visual: img('trophy') },
      { kind: 'oyun-posta', title: 'Mektup Postası', icon: 'memo', total: 4, meb: 'T.Y.2.3.ğ', oyun: true, gen: rot(mem('Sözcük kartlarını eşleştir!', 'Sözcükler ve anlamları.', SOZ8_P), srt('Varlıkları sepetlere ayır.', 'Canlı ve cansız.', CANLI_BINS, CANLI_ITEMS), avi(HAK_KELIME, 'Mektupta saklanan kelimeleri bul!')), ders: 'Mektubu tamamla, zarfa koy, postala! (Gerçek gönderim yapılmaz.)', visual: img('memo') },
    ],
  },
]

/* ================================================================================================
 * EK · NOKTALAMA VE YAZIM — her temaya: hangi işaret, işaret sepetleri, doğru yazım + temanın kendi yazım kuralı
 * (2. sınıf: nokta, soru, ünlem, virgül, tırnak, büyük harf, mı/mi ayrı yazımı, kesme işareti, mektupta noktalama)
 * ================================================================================================ */
/** [işaretsiz cümle, işaret, cümledeki özel ad (varsa)] */
type Cumle = [string, '.' | '?' | '!', string?]
const ISARET_AD = { '.': 'Nokta (.)', '?': 'Soru işareti (?)', '!': 'Ünlem işareti (!)' } as const
const ISARET_NEDEN = { '.': 'Bilgi veren, anlatan cümlelerin sonuna nokta koyarız.', '?': 'Soru soran cümlelerin sonuna soru işareti koyarız.', '!': 'Sevinç, şaşkınlık, korku gibi duyguları ya da seslenmeyi ünlemle gösteririz.' } as const
const kucuk = (s: string) => s.charAt(0).toLocaleLowerCase('tr-TR') + s.slice(1)

const isaretSec = (bank: Cumle[]): Gen => (rng, _g, l, h) => {
  const [c, m] = fresh(rng, bank, h, (x) => `“${x[0]} …” Cümlenin sonuna hangi işaret gelir?`)
  return mkChoice(rng, { q: `“${c} …” Cümlenin sonuna hangi işaret gelir?`, a: ISARET_AD[m], w: Object.values(ISARET_AD).filter((x) => x !== ISARET_AD[m]), ex: ISARET_NEDEN[m] }, l)
}
const isaretSepet = (bank: Cumle[]): Gen =>
  srt('Cümleleri sonlarına gelecek işarete göre ayır.', 'Anlatan cümle nokta, soran cümle soru işareti, duygu ya da seslenme bildiren cümle ünlem işareti alır.', [
    { id: '.', label: 'Nokta (.)', color: '#3b82f6' },
    { id: '?', label: 'Soru (?)', color: '#f59e0b' },
    { id: '!', label: 'Ünlem (!)', color: '#ef4444' },
  ], bank.map(([c, m]) => ({ label: `${c} …`, bin: m })), 6)
const dogruYazim = (bank: Cumle[]): Gen => (rng, _g, l, h) => {
  const [c, m, ozel] = fresh(rng, bank, h, (x) => `Hangisi doğru yazılmış? (${x[0]})`)
  const dogru = `${c}${m}`
  const wrong = [`${kucuk(c)}${m}`, c, ozel ? `${c.replace(ozel, kucuk(ozel))}${m}` : `${c}${m === '.' ? '?' : '.'}`]
  return mkChoice(rng, { q: 'Hangi cümle doğru yazılmış?', a: dogru, w: [...new Set(wrong)].filter((x) => x !== dogru), ex: `Cümle büyük harfle başlar${ozel ? `, özel adlar (${ozel}) büyük harfle yazılır` : ''} ve sonuna uygun işaret konur: ${dogru}` }, l)
}
/** virgül: üç öge "A, B ve C" */
const virgul = (frames: [string, string, string, string][]): Gen => (rng, _g, l, h) => {
  const [on, a, b, c] = fresh(rng, frames, h, (x) => `Virgül nereye? ${x[0]}`)
  const yaz = (x: string) => `${on} ${x}.`.replace(/^./, (k) => k.toLocaleUpperCase('tr-TR'))
  return { ...mkChoice(rng, { q: 'Virgül doğru kullanılmış cümle hangisi?', a: yaz(`${a}, ${b} ve ${c}`), w: [yaz(`${a} ${b}, ve ${c}`), yaz(`${a} ${b} ve ${c}`), yaz(`${a}, ${b}, ve ${c}`)], ex: `Sıralanan sözcükleri virgülle ayırırız; “ve”den önce virgül koymayız: ${a}, ${b} ve ${c}.` }, l), prompt: `Virgül nereye? “${on.charAt(0).toLocaleUpperCase('tr-TR') + on.slice(1)} …”` }
}
/** mı/mi soru eki ayrı yazılır */
const miAyri = (bank: [string, string][]): Gen => (rng, _g, l, h) => {
  const [govde, ek] = fresh(rng, bank, h, (x) => `Hangisi doğru yazılmış? ${x[0]} ${x[1]}`)
  const diger = { mı: 'mi', mi: 'mı', mu: 'mü', mü: 'mu' }[ek] ?? 'mi'
  return { ...mkChoice(rng, { q: 'Soru eki doğru yazılmış cümle hangisi?', a: `${govde} ${ek}?`, w: [`${govde}${ek}?`, `${govde} ${diger}?`, `${govde} ${ek}.`], ex: `Soru eki “${ek}” kendinden önceki sözcükten ayrı yazılır ve cümle soru işaretiyle biter: ${govde} ${ek}?` }, l), prompt: `Hangisi doğru yazılmış? (${govde} … ${ek})` }
}
/** kesme işareti: özel ada gelen ek */
const kesme = (bank: [string, string, string][]): Gen => (rng, _g, l, h) => {
  const [ad, ek, cumle] = fresh(rng, bank, h, (x) => `Kesme: ${x[0]}${x[1]}`)
  const yaz = (x: string) => cumle.replace('#', x)
  return { ...mkChoice(rng, { q: 'Kesme işareti doğru kullanılmış cümle hangisi?', a: yaz(`${ad}’${ek}`), w: [yaz(`${ad}${ek}`), yaz(`${kucuk(ad)}’${ek}`), yaz(`${ad} ${ek}`)], ex: `Özel adlara gelen ekleri kesme işaretiyle ayırırız: ${ad}’${ek}.` }, l), prompt: `Kesme işareti nerede? (${ad} + ${ek})` }
}

/* ---------- tema cümleleri ---------- */
const C1: Cumle[] = [
  ['Ece şemsiyesini Kaan ile paylaştı', '.', 'Kaan'],
  ['Arkadaşına yardım ettin mi', '?'],
  ['Ne güzel bir davranış', '!'],
  ['Defne sınıfta çiçekleri suladı', '.', 'Defne'],
  ['İyilik yapmak seni mutlu eder mi', '?'],
  ['Teşekkür ederim, çok naziksin', '!'],
  ['Kardeşimle oyuncaklarımı paylaştım', '.'],
  ['Neden yardım etmeliyiz', '?'],
]
const C2: Cumle[] = [
  ['Atatürk çocukları çok severdi', '.', 'Atatürk'],
  ['Yaşasın Cumhuriyet', '!', 'Cumhuriyet'],
  ['Atatürk Samsun’a ne zaman gitti', '?', 'Atatürk'],
  ['Cumhuriyet Bayramı’nda okulumuzu süsledik', '.', 'Cumhuriyet Bayramı'],
  ['Ne güzel bir tören', '!'],
  ['Anıtkabir Ankara’dadır', '.', 'Ankara'],
  ['Bayrağımızın rengi nedir', '?'],
  ['Mustafa Kemal matematiği çok severdi', '.', 'Mustafa Kemal'],
]
const C3: Cumle[] = [
  ['Yağmur yağınca toprak kokar', '.'],
  ['Bahar geldi mi', '?'],
  ['Eyvah, yağmur başladı', '!'],
  ['Atıkları ayırarak doğayı koruruz', '.'],
  ['Kuşlar nereye göç eder', '?'],
  ['Ne kadar güzel bir gökkuşağı', '!'],
  ['Elif kâğıtları mavi kutuya attı', '.', 'Elif'],
  ['Ağaçlar neden yaprak döker', '?'],
]
const C4: Cumle[] = [
  ['Her akşam kitap okurum', '.'],
  ['En sevdiğin kitap hangisi', '?'],
  ['Bu hikâye çok heyecanlı', '!'],
  ['Mert kütüphaneden iki kitap aldı', '.', 'Mert'],
  ['Kitabı ne zaman geri getireceksin', '?'],
  ['Yaşasın, yeni kitabım geldi', '!'],
  ['Okuduğum kitabı arkadaşıma anlattım', '.'],
  ['Masalın sonu nasıl bitti', '?'],
]
const C5: Cumle[] = [
  ['Zeynep çok güzel resim yapar', '.', 'Zeynep'],
  ['Sen hangi enstrümanı çalıyorsun', '?'],
  ['Harika bir şarkı söyledin', '!'],
  ['Ali okul takımında futbol oynuyor', '.', 'Ali'],
  ['Hangi yeteneğini geliştirmek istersin', '?'],
  ['Bravo, çok güzel dans ettin', '!'],
  ['Kardeşim kilden bir vazo yaptı', '.'],
  ['Müzeye ne zaman gideceğiz', '?'],
]
const C6: Cumle[] = [
  ['Mucitler yeni şeyler icat eder', '.'],
  ['Ampulü kim buldu', '?'],
  ['Robotum çalıştı', '!'],
  ['Kaan kartondan bir uçak yaptı', '.', 'Kaan'],
  ['Bu makine nasıl çalışır', '?'],
  ['Vay, ne ilginç bir buluş', '!'],
  ['Deneyden önce plan yaptık', '.'],
  ['Telefonu kim icat etti', '?'],
]
const C7: Cumle[] = [
  ['Nasreddin Hoca’nın fıkraları çok eğlencelidir', '.', 'Nasreddin Hoca'],
  ['Hiç seksek oynadın mı', '?'],
  ['Ne güzel bir halk oyunu', '!'],
  ['Dedem bize masal anlattı', '.'],
  ['Karagöz ile Hacivat neden tartıştı', '?', 'Karagöz'],
  ['Hadi, mendil kapmaca oynayalım', '!'],
  ['Kapadokya’da peri bacaları var', '.', 'Kapadokya'],
  ['Bayramda kimleri ziyaret edersin', '?'],
]
const C8: Cumle[] = [
  ['Her çocuğun eğitim hakkı vardır', '.'],
  ['Oyun oynamak bir hak mıdır', '?'],
  ['Çocuklar mutlu olsun', '!'],
  ['Ayşe öğretmenine bir mektup yazdı', '.', 'Ayşe'],
  ['Sağlıklı büyümek için neye ihtiyacımız var', '?'],
  ['Yaşasın çocuk hakları', '!'],
  ['Herkesin fikrine saygı duyarız', '.'],
  ['Mektubunu kime yazdın', '?'],
]
const TIRNAK_Q: Q[] = [
  { q: 'Hangisinde konuşma doğru gösterilmiş?', a: 'Ece, “Gel, ikimiz de sığarız.” dedi.', w: ['Ece, Gel, ikimiz de sığarız. dedi.', 'Ece “Gel, ikimiz de sığarız. dedi.”', '“Ece, gel” ikimiz de sığarız dedi.'], ex: 'Birinin söylediğini aynen aktarırken tırnak işareti kullanırız.' },
  { q: 'Tırnak işaretini ne zaman kullanırız?', a: 'Birinin sözünü aynen aktarırken', w: ['Her cümlenin sonunda', 'Sayıları yazarken'], ex: 'Başkasının sözünü değiştirmeden yazarken tırnak içine alırız.' },
  { q: 'Hangisinde virgül doğru kullanılmış?', a: 'Annem, “Kahvaltı hazır.” dedi.', w: ['Annem “Kahvaltı, hazır.” dedi.', 'Annem “Kahvaltı hazır,” dedi.'], ex: 'Konuşanın adından sonra virgül koyarız.' },
  { q: 'Kaan ne dedi? Doğru yazılmış olanı seç.', a: 'Kaan, “Teşekkür ederim.” dedi.', w: ['Kaan “teşekkür ederim” dedi.', 'Kaan, teşekkür ederim dedi.'], ex: 'Aktarılan söz büyük harfle başlar ve tırnak içine alınır.' },
  { q: 'Hangisi doğru yazılmış?', a: 'Öğretmenimiz, “Kitaplarınızı açın.” dedi.', w: ['Öğretmenimiz, kitaplarınızı açın dedi.', 'öğretmenimiz “kitaplarınızı açın.” dedi.'], ex: 'Cümle büyük harfle başlar, aktarılan söz tırnak içindedir.' },
]
const OZEL_HIT_2 = ['ankara', 'atatürk', 'samsun', 'türkiye', 'zübeyde hanım', 'çanakkale', 'mehmet âkif']
const OZEL_WRONG_2 = ['okul', 'bayrak', 'şehir', 'çocuk', 'öğretmen']
const OZEL_HIT_7 = ['istanbul', 'kapadokya', 'nasreddin hoca', 'karagöz', 'anadolu', 'konya']
const OZEL_WRONG_7 = ['davul', 'halı', 'masal', 'oyun', 'kilim']
const MI_3: [string, string][] = [
  ['Yağmur yağacak', 'mı'],
  ['Bahar geldi', 'mi'],
  ['Kuşlar göç etti', 'mi'],
  ['Atıkları ayırdın', 'mı'],
  ['Hava soğuk', 'mu'],
  ['Çiçekler açtı', 'mı'],
  ['Kar yağdı', 'mı'],
  ['Su tasarrufu önemli', 'mi'],
]
const MI_4: [string, string][] = [
  ['Kitabını bitirdin', 'mi'],
  ['Masalı sevdin', 'mi'],
  ['Kütüphaneye gittin', 'mi'],
  ['Hikâye uzun', 'mu'],
  ['Şiiri ezberledin', 'mi'],
  ['Kitap okumak güzel', 'mi'],
]
const KESME_5: [string, string, string][] = [
  ['Ankara', 'ya', '# gittik.'],
  ['İzmir', 'de', 'Teyzem # oturuyor.'],
  ['Zeynep', 'in', '# resmi sergide.'],
  ['Konya', 'da', 'Müzeyi # gezdik.'],
  ['Ali', 'nin', '# topu kırmızı.'],
  ['Türkiye', 'nin', '# başkenti Ankara’dır.'],
  ['Ece', 'yle', '# şarkı söyledik.'],
  ['Van', 'da', 'Dedem # yaşıyor.'],
]
const VIRGUL_1: [string, string, string, string][] = [
  ['pazardan', 'elma', 'armut', 'muz aldık'],
  ['sofraya', 'tabak', 'kaşık', 'bardak koyduk'],
  ['bahçede', 'Ece', 'Kaan', 'Defne oynadı'],
  ['çantama', 'kalem', 'silgi', 'defter koydum'],
]
const VIRGUL_6: [string, string, string, string][] = [
  ['robotu yapmak için', 'kutu', 'pil', 'tel kullandık'],
  ['mucitler', 'ampulü', 'telefonu', 'uçağı buldu'],
  ['deney için', 'su', 'tuz', 'yumurta getirdik'],
  ['atölyede', 'makas', 'yapıştırıcı', 'karton vardı'],
]
const MEKTUP_NOKTA_Q: Q[] = [
  { q: 'Mektupta “Sevgili Ayşe” hitabından sonra hangi işaret gelir?', a: 'Virgül (,)', w: ['Soru işareti (?)', 'Nokta (.)'], ex: 'Mektuptaki hitaptan sonra virgül koyarız: Sevgili Ayşe,' },
  { q: 'Hangisi doğru yazılmış bir hitaptır?', a: 'Sevgili Öğretmenim,', w: ['sevgili öğretmenim.', 'Sevgili öğretmenim?'], ex: 'Hitap büyük harfle başlar ve virgülle biter.' },
  { q: 'Mektubun sonuna ne yazarız?', a: 'Sevgilerle ve adımızla', w: ['Hiçbir şey', 'Sadece bir soru işareti'], ex: 'Mektup bir dilekle ve adımızla biter.' },
  { q: 'E-posta yazarken hangisini paylaşmamalıyız?', a: 'Ev adresimizi', w: ['Selam sözümüzü', 'Güzel dileklerimizi'], ex: 'Kişisel bilgilerimizi bilmediğimiz kişilerle paylaşmayız.' },
  { q: 'Mektupta tarihi nereye yazarız?', a: 'Sağ üst köşeye', w: ['Ortasına', 'En alta, adımızdan sonra'], ex: 'Tarih mektubun sağ üst köşesine yazılır.' },
]
const YAZIM_TF: TF[] = [
  ['Cümleler büyük harfle başlar.', true, 'Her cümlenin ilk harfi büyük yazılır.'],
  ['Özel adlar küçük harfle yazılır.', false, 'Kişi, şehir, ülke adları büyük harfle başlar.'],
  ['Soru eki “mi” kendinden önceki sözcüğe bitişik yazılır.', false, 'Soru eki ayrı yazılır: Geldin mi?'],
  ['Sıralanan sözcükler arasına virgül koyarız.', true, 'Elma, armut ve muz.'],
  ['Özel adlara gelen ekler kesme işaretiyle ayrılır.', true, 'Ankara’ya, Ece’nin.'],
  ['Soru soran cümlenin sonuna nokta koyarız.', false, 'Soru cümlesi soru işaretiyle biter.'],
]

const YAZIM_EK: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C1), isaretSepet(C1)), ders: 'Anlatan cümle nokta, soran cümle soru işareti, duygu bildiren cümle ünlem işaretiyle biter.', points: ['. anlatır', '? sorar', '! duygu ya da seslenme'], visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C1), ders: 'Cümle büyük harfle başlar, özel adlar büyük harfle yazılır, sonuna uygun işaret konur.', visual: img('memo') },
    { kind: 'virgul-tirnak', title: 'Virgül ve Tırnak', icon: 'scroll', total: T, meb: 'T.Y.2.3.ğ', gen: rot(virgul(VIRGUL_1), ch(TIRNAK_Q)), ders: 'Sıralanan sözcükleri virgülle ayırırız. Birinin sözünü aynen aktarırken tırnak işareti kullanırız.', visual: img('scroll') },
  ],
  t2: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C2), isaretSepet(C2)), ders: '“Yaşasın Cumhuriyet!” gibi coşku bildiren cümleler ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C2), ders: 'Atatürk, Ankara, Samsun gibi özel adlar büyük harfle başlar.', visual: img('memo') },
    { kind: 'ozel-ad-balon', title: 'Büyük Harf Balonları', icon: 'balloon', total: 4, meb: 'T.Y.2.3.f', gen: pop('Büyük harfle yazılması gerekenleri patlat!', 'Kişi, yer, ülke adları büyük harfle başlar: Ankara, Atatürk, Türkiye.', OZEL_HIT_2, OZEL_WRONG_2), ders: 'Özel adları bul: bunlar büyük harfle başlamalı!', visual: img('balloon') },
  ],
  t3: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C3), isaretSepet(C3)), ders: 'Doğayı anlatan cümleler noktayla, sorular soru işaretiyle, şaşkınlık ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C3), ders: 'Cümle büyük harfle başlar ve uygun işaretle biter.', visual: img('memo') },
    { kind: 'mi-ayri', title: 'mı, mi Ayrı Yazılır', icon: 'thinking', total: T, meb: 'T.Y.2.3.d', gen: rot(miAyri(MI_3), tf(YAZIM_TF, 'thinking')), ders: 'Soru eki “mı, mi, mu, mü” kendinden önceki sözcükten ayrı yazılır: Bahar geldi mi?', visual: img('thinking') },
  ],
  t4: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C4), isaretSepet(C4)), ders: 'Okuduğun cümlenin ne anlattığına bak: bilgi mi, soru mu, duygu mu?', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C4), ders: 'Kitaplardaki gibi düzgün yazarız: büyük harf, özel ad, işaret.', visual: img('memo') },
    { kind: 'mi-ayri', title: 'Soru Ekini Yaz', icon: 'thinking', total: T, meb: 'T.Y.2.3.d', gen: miAyri(MI_4), ders: 'Kitabını bitirdin mi? Soru eki ayrı yazılır.', visual: img('thinking') },
  ],
  t5: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C5), isaretSepet(C5)), ders: '“Bravo, çok güzel dans ettin!” Övgü ve sevinç ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C5), ders: 'Zeynep, Ali gibi kişi adları büyük harfle başlar.', visual: img('memo') },
    { kind: 'kesme-yazim', title: 'Kesme İşareti', icon: 'scroll', total: T, meb: 'T.Y.2.3.ğ', gen: kesme(KESME_5), ders: 'Özel adlara gelen ekleri kesme işaretiyle ayırırız: Ankara’ya, Zeynep’in.', visual: img('scroll') },
  ],
  t6: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C6), isaretSepet(C6)), ders: '“Robotum çalıştı!” Sevinci ünlemle gösteririz.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C6), ders: 'Cümle büyük harfle başlar ve uygun işaretle biter.', visual: img('memo') },
    { kind: 'virgul-liste', title: 'Virgülle Sırala', icon: 'gear', total: T, meb: 'T.Y.2.3.ğ', gen: virgul(VIRGUL_6), ders: 'Malzemeleri sıralarken araya virgül koyarız; “ve”den önce virgül gelmez.', visual: img('gear') },
  ],
  t7: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C7), isaretSepet(C7)), ders: '“Hadi, mendil kapmaca oynayalım!” Seslenme ve istek ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C7), ders: 'Nasreddin Hoca, Karagöz, Kapadokya gibi özel adlar büyük harfle başlar.', visual: img('memo') },
    { kind: 'ozel-ad-balon', title: 'Büyük Harf Balonları', icon: 'balloon', total: 4, meb: 'T.Y.2.3.f', gen: pop('Büyük harfle yazılması gerekenleri patlat!', 'Yer ve kişi adları büyük harfle başlar: İstanbul, Nasreddin Hoca.', OZEL_HIT_7, OZEL_WRONG_7), ders: 'Kültür hazinemizdeki özel adları bul!', visual: img('balloon') },
  ],
  t8: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.2.3.ğ', gen: rot(isaretSec(C8), isaretSepet(C8)), ders: '“Yaşasın çocuk hakları!” Coşku ünlemle, soru soru işaretiyle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.2.3.f', gen: dogruYazim(C8), ders: 'Cümle büyük harfle başlar ve uygun işaretle biter.', visual: img('memo') },
    { kind: 'mektup-yazim', title: 'Mektupta Noktalama', icon: 'memo', total: T, meb: 'T.Y.2.3.ğ', gen: rot(ch(MEKTUP_NOKTA_Q), tf(YAZIM_TF, 'pencil')), ders: 'Mektupta hitaptan sonra virgül koyarız: Sevgili Ayşe, … Tarih sağ üste yazılır.', visual: img('memo') },
  ],
}
/* ================================================================================================
 * EK · DİNLEME, KONUŞMA, OKUMA VE YAZMA SÜREÇLERİ — kitaptaki karekodlu dinleme/izleme metinlerinin yerine
 * özgün kısa dinleme metinleri (sesli okunur, ekranda yazmaz), konuşma kuralları ve durumları,
 * okuma/yazma hazırlığı, ortamı, planı ve öz değerlendirmesi. Kodlar programın tema tablolarına göre yerleştirildi.
 * Sözlü performans (hız, tonlama, jest) gerçek konuşma yerine durum–seçim ile değerlendirilir.
 * ================================================================================================ */

/* ---------- Tema 1 ---------- */
const IYILIK_D: Dinleme = {
  t: 'İyilik Zinciri',
  img: 'heart',
  text: 'Sabah otobüste Ayşe Teyze’nin elindeki elmalar yere döküldü. Küçük Mert hemen eğilip elmaları topladı. Ayşe Teyze çok sevindi ve öğlen yaşlı komşusuna sıcak çorba götürdü. Komşusu da akşam parkta bir çocuğun kaybolan topunu buldu. Bir iyilik, başka bir iyiliği getirmişti.',
  qs: [
    { q: 'Dinlediğin metin en çok neyi anlatıyor?', a: 'İyiliğin iyilik getirmesini', w: ['Otobüs yolculuğunu', 'Elma toplamayı', 'Parkta top oynamayı'], ex: 'Metnin konusu: Bir iyilik başka bir iyiliği getirir.' },
    { q: 'Dinlediğin metnin ana fikri hangisi?', a: 'İyilik yaptıkça iyilik çoğalır', w: ['Elmalar yere düşmemeli', 'Çorba sıcak içilmeli', 'Top kaybolmamalı'], ex: 'İyilik zincir gibi büyür.' },
    { q: 'Dinlediğin metne en uygun başlık hangisi?', a: 'İyilik Zinciri', w: ['Kırmızı Elmalar', 'Sıcak Çorba', 'Kayıp Top'], ex: 'Başlık metnin konusunu göstermeli: iyilikler zincir gibi birbirine bağlandı.' },
    { q: 'Metinde ilk iyiliği kim yaptı?', a: 'Mert', w: ['Ayşe Teyze', 'Yaşlı komşu', 'Parktaki çocuk'], ex: 'Mert elmaları toplayarak ilk iyiliği yaptı.' },
  ],
}
const NEZAKET_D: Dinleme = {
  t: 'Kibar Kumru',
  img: 'bird',
  text: 'Soğuk bir günde küçük bir serçe dala kondu. Yanındaki kumruya “Yer aç!” diye bağırdı. Kumru gülümsedi ve “Kibarca istersen sana yer açarım.” dedi. Serçe utandı, “Lütfen biraz yer açar mısın?” diye sordu. Kumru kanadını açtı, iki kuş birlikte ısındı.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Kibar konuşmanın güzelliği', w: ['Kışın kar yağması', 'Kuşların yuva yapması', 'Dalların kırılması'], ex: 'Serçe kibarca istemeyi öğrendi.' },
    { q: 'Serçe ilk başta nasıl konuştu?', a: 'Kaba', w: ['Kibar', 'Sessiz', 'Neşeli'], ex: 'Serçe “Yer aç!” diye bağırdı; bu kaba bir konuşmaydı.' },
    { q: 'Kumru serçeye neyi öğretti?', a: 'Kibarca istemeyi', w: ['Uçmayı', 'Yuva yapmayı', 'Şarkı söylemeyi'], ex: 'Serçe sonunda “Lütfen” diyerek istedi.' },
  ],
}
const ONCESI_D: Dinleme[] = [
  {
    t: 'Islak Ayakkabılar',
    img: 'umbrella',
    text: 'Can eve girdiğinde ayakkabıları sırılsıklamdı. Saçlarından su damlıyordu. Annesi ona hemen bir havlu uzattı. Can kuru giysilerini giyip ısındı.',
    qs: [
      { q: 'Can eve gelmeden önce ne olmuş olabilir?', a: 'Yağmura yakalanmış', w: ['Uyuyakalmış', 'Kitap okumuş', 'Resim yapmış'], ex: 'Ayakkabısı ve saçı ıslaktı; yağmura yakalanmış olabilir.' },
      { q: 'Can eve gelmeden önce hava nasıl olabilir?', a: 'Yağmurlu', w: ['Güneşli', 'Sıcak ve kuru', 'Bulutsuz'], ex: 'Islak saçlar yağmurlu bir havayı gösterir.' },
    ],
  },
  {
    t: 'Doğum Günü Akşamı',
    img: 'cake',
    text: 'Akşam Zeynep’in evinde herkes çok neşeliydi. Masada mumları sönmüş bir pasta vardı. Zeynep, arkadaşlarının getirdiği paketleri tek tek açıyordu. Herkes ona “Nice mutlu yıllara!” diyordu.',
    qs: [
      { q: 'Mumlar sönmeden önce ne olmuş olabilir?', a: 'Zeynep mumları üflemiş', w: ['Zeynep okula gitmiş', 'Pasta yere düşmüş', 'Herkes uyumuş'], ex: 'Doğum gününde mumları üfleriz.' },
      { q: 'Zeynep paketleri açmadan önce ne olmuş olabilir?', a: 'Arkadaşları hediye getirmiş', w: ['Zeynep markete gitmiş', 'Pasta bitmiş', 'Herkes evden çıkmış'], ex: 'Paketler arkadaşlarının getirdiği hediyelerdir.' },
    ],
  },
  {
    t: 'Dağınık Oda',
    img: 'teddy',
    text: 'Kardeşler odaya baktı ve şaşırdı. Yerde oyuncaklar, yatakta boya kalemleri vardı. Hemen kolları sıvadılar. Biri oyuncakları kutuya koydu, öteki kalemleri topladı.',
    qs: [
      { q: 'Kardeşler gelmeden önce odada ne olmuş olabilir?', a: 'Oyun oynanmış', w: ['Oda boyanmış', 'Oda yeni temizlenmiş', 'Odaya kimse girmemiş'], ex: 'Yerdeki oyuncaklar oyun oynandığını gösterir.' },
    ],
  },
]
const DINLE_SEC_Q: Q[] = [
  { q: 'Kuşların nasıl yuva yaptığını öğrenmek istiyorsun. Ne izlersin?', a: 'Kuşlarla ilgili bir belgesel', w: ['Bir futbol maçı', 'Bir yemek programı', 'Bir çizgi film şarkısı'], ex: 'Amacımıza uygun olanı seçeriz: kuşları öğrenmek için kuş belgeseli.', img: 'bird' },
  { q: 'Uyumadan önce dinlenmek istiyorsun. Ne dinlersin?', a: 'Sakin bir masal', w: ['Hızlı bir yarış', 'Hava durumu haberi', 'Yüksek sesli bir maç'], ex: 'Dinlenmek için sakin bir masal uygundur.', img: 'moon' },
  { q: 'Yarın hava yağmurlu mu, öğrenmek istiyorsun. Ne dinlersin?', a: 'Hava durumunu', w: ['Bir ninniyi', 'Bir fıkrayı', 'Bir türküyü'], ex: 'Havayı öğrenmek için hava durumu dinlenir.', img: 'cloudsun' },
  { q: 'Halk oyunlarını merak ediyorsun. Ne izlersin?', a: 'Halay gösterisini', w: ['Uzay belgeselini', 'Yemek tarifini', 'Trafik haberini'], ex: 'İlgi alanına uygun olanı seçeriz.', img: 'drum' },
  { q: 'Yeni bir çocuk şarkısı öğrenmek istiyorsun. Ne dinlersin?', a: 'Çocuk şarkısını', w: ['Hava durumunu', 'Bir haberi', 'Bir maç anlatımını'], ex: 'Şarkı öğrenmek için şarkıyı dinleriz.', img: 'music' },
  { q: 'Kek yapmayı öğrenmek istiyorsun. Bir büyüğünle ne izlersin?', a: 'Kek tarifi videosunu', w: ['Hayvan belgeselini', 'Bir futbol maçını', 'Bir masal çizgi filmini'], ex: 'Amacımız kek yapmak; tarif videosu uygundur.', img: 'cupcake' },
]
const DINLEME_BINS: SortQ['bins'] = [
  { id: 'evet', label: 'Dinlerken yaparım', img: 'ear', color: '#22c55e' },
  { id: 'hayir', label: 'Dinlerken yapmam', img: 'noentry', color: '#f97316' },
]
const DINLEME_ITEMS: SortQ['items'] = [
  { label: 'Konuşana bakarım', img: 'eyes', bin: 'evet' },
  { label: 'Sessizce dinlerim', img: 'shush', bin: 'evet' },
  { label: 'Söz için parmak kaldırırım', img: 'raisedhand', bin: 'evet' },
  { label: 'Anlamadığımı sonra sorarım', img: 'thinking', bin: 'evet' },
  { label: 'Dikkatimi toplarım', img: 'ear2', bin: 'evet' },
  { label: 'Konuşanın sözünü keserim', img: 'thumbsdown', bin: 'hayir' },
  { label: 'Yerimde dönüp dururum', img: 'running', bin: 'hayir' },
  { label: 'Başka işle uğraşırım', img: 'videogame', bin: 'hayir' },
  { label: 'Gürültü yaparım', img: 'drum', bin: 'hayir' },
]
const DINLEME_TF: TF[] = [
  ['Dinlerken konuşan kişiye bakarız.', true, 'Göz teması dikkatle dinlediğimizi gösterir.'],
  ['Konuşanın sözünü kesebiliriz.', false, 'Konuşma bitince söz alırız.'],
  ['Söz almak için parmak kaldırırız.', true, 'Sıramızı bekleriz.'],
  ['Dinlerken oyuncakla oynamak dikkatimizi artırır.', false, 'Başka işle uğraşırsak dikkatimiz dağılır.'],
  ['Anlamadığımız yeri konuşma bitince sorabiliriz.', true, 'Uygun zamanda soru sorarız.'],
  ['Dinlerken arkadaşımızla fısıldaşırız.', false, 'Fısıldaşmak konuşanı ve dinleyenleri rahatsız eder.'],
]
const GOZ_Q: Q[] = [
  { q: 'Sınıfa bir şey anlatıyorsun. Nereye bakarsın?', a: 'Arkadaşlarımın yüzüne', w: ['Yere', 'Pencereden dışarı', 'Tavana'], ex: 'Konuşurken dinleyicilerle göz teması kurarız.', img: 'teacher' },
  { q: 'Konuşurken göz teması kurmak ne demek?', a: 'Dinleyenlere bakarak konuşmak', w: ['Gözlerini kapatmak', 'Arkanı dönmek', 'Etrafa bakınmak'], ex: 'Göz teması, dinleyenlere bakarak konuşmaktır.', img: 'eyes' },
  { q: 'Mert anlatırken hep yere baktı. Ona ne önerirsin?', a: 'Dinleyenlere bakarak anlat.', w: ['Daha hızlı konuş.', 'Hiç konuşma.', 'Arkanı dön.'], ex: 'Dinleyenlere bakınca onlar da bizi daha iyi dinler.', img: 'boy' },
  { q: 'Konuşurken neden dinleyenlere bakarız?', a: 'Onlarla iletişim kurmak için', w: ['Onları şaşırtmak için', 'Saati görmek için', 'Sözümüzü unutmak için'], ex: 'Göz teması iletişimi güçlendirir.', img: 'friends' },
  { q: 'Hangisi göz teması kuran bir konuşmacıdır?', a: 'Arkadaşlarına bakarak anlatan Ela', w: ['Kâğıdın arkasına saklanan Ali', 'Sürekli tavana bakan Can', 'Sırtını dönen Su'], ex: 'Ela dinleyenlerine bakıyor.', img: 'girl' },
]
const OKU_HAZIR_O: O[] = [
  { q: 'Okumaya nasıl hazırlanırız? Sırala.', s: ['Başlığı okurum', 'Resimleri incelerim', 'Konuyu tahmin ederim', 'Metni okurum'], ex: 'Önce başlık ve görseller incelenir, konu tahmin edilir, sonra metin okunur.', img: 'openbook' },
  { q: 'Bir hikâye kitabına başlarken sırala.', s: ['Kitabın adını okurum', 'Kapaktaki resmi incelerim', 'Ne anlattığını tahmin ederim', 'Okumaya başlarım'], ex: 'Kapak bize kitabın konusu hakkında ipucu verir.', img: 'book' },
]
const OKU_HAZIR_Q: Q[] = [
  { q: 'Bir metni okumadan önce ilk neye bakarız?', a: 'Başlığına ve resimlerine', w: ['Son sayfasına', 'Sayfa sayısına', 'Kapağın rengine'], ex: 'Başlık ve görseller konuyu tahmin etmemize yardım eder.', img: 'openbook' },
  { q: 'Başlık “Uçurtma Şenliği”, resimde uçurtmalar var. Bunları incelemek ne işe yarar?', a: 'Konuyu tahmin etmemizi sağlar', w: ['Metni kısaltır', 'Okumayı gereksiz yapar', 'Sözcükleri değiştirir'], ex: 'Başlık ve resim, metnin uçurtmalarla ilgili olduğunu düşündürür.', img: 'kite' },
  { q: 'Ece resme ve başlığa bakmadan hemen okumaya başladı. Neyi unuttu?', a: 'Başlık ve görselleri incelemeyi', w: ['Kalem almayı', 'Su içmeyi', 'Ayağa kalkmayı'], ex: 'Okumadan önce başlık ve görseller incelenir.', img: 'girl' },
  { q: 'Başlık ve resim bize ne hakkında ipucu verir?', a: 'Metnin konusu hakkında', w: ['Yazarın yaşı hakkında', 'Kitabın ağırlığı hakkında', 'Hava durumu hakkında'], ex: 'Başlık ve resim konuyu gösterir.', img: 'magnifier' },
]
const YAZ_HAZIR_O: O[] = [
  { q: 'Dedene mektup yazacaksın. Hazırlığı sırala.', s: ['Ne yazacağımı düşünürüm', 'Aklıma gelenleri not alırım', 'Mektubu yazarım', 'Okuyup hatalarımı düzeltirim'], ex: 'Yazmadan önce düşünür ve not alırız; yazınca kontrol ederiz.', img: 'memo' },
  { q: 'Okul panosuna yazı yazacaksın. Sırala.', s: ['Konumu seçerim', 'Konuyla ilgili bilgi toplarım', 'Yazımı yazarım', 'Yazımı kontrol ederim'], ex: 'Hazırlık yaparak yazarız.', img: 'newspaper' },
  { q: 'Bir hikâye yazmaya hazırlan. Sırala.', s: ['Kahramanımı belirlerim', 'Olayı düşünürüm', 'Hikâyemi yazarım', 'Okuyup kontrol ederim'], ex: 'Kahraman ve olay hazır olunca yazmak kolaylaşır.', img: 'pencil' },
]
const YAZ_HAZIR_Q: Q[] = [
  { q: 'Yazmaya başlamadan önce ne yaparız?', a: 'Ne yazacağımızı düşünürüz', w: ['Hemen son cümleyi yazarız', 'Kâğıdı katlarız', 'Kalemi saklarız'], ex: 'Yazmadan önce konuyu düşünür, plan yaparız.', img: 'thinking' },
  { q: 'Yazacağın konu hakkında bilgi toplamak için ne yapabilirsin?', a: 'Kitaplardan araştırırım', w: ['Uyurum', 'Oyun oynarım', 'Kâğıdı atarım'], ex: 'Kitaplar ve büyüklerimiz bilgi kaynağıdır.', img: 'books' },
  { q: 'Yazmaya hazırlanırken hangisi gerekli değildir?', a: 'Televizyonu açmak', w: ['Kalem ve kâğıt hazırlamak', 'Konuyu belirlemek', 'Not almak'], ex: 'Televizyon dikkatimizi dağıtır.', img: 'pencil' },
]
const EKSIK_CUMLE_Q: Q[] = [
  { q: '“Ali’nin çiçeği solmuştu. ___ Ertesi gün çiçek yeniden dikleşti.” Boşluğa hangi cümle gelir?', a: 'Ali çiçeğini suladı.', w: ['Ali çiçeğini kopardı.', 'Ali çiçeğini unuttu.', 'Ali dışarı çıktı.'], ex: 'Solan çiçek sulanınca dikleşir.', img: 'plantpot' },
  { q: '“Teneffüs zili çaldı. ___ Herkes bahçede neşeyle oynadı.” Boşluğa hangi cümle gelir?', a: 'Çocuklar bahçeye çıktı.', w: ['Çocuklar uyudu.', 'Ders yeniden başladı.', 'Okul tatil oldu.'], ex: 'Zil çalınca çocuklar bahçeye çıkar ve oynar.', img: 'bell' },
  { q: '“Elif boya kalemini evde unutmuştu. ___ Elif ona teşekkür etti.” Boşluğa hangi cümle gelir?', a: 'Arkadaşı kalemini paylaştı.', w: ['Arkadaşı ona güldü.', 'Öğretmen dersi bitirdi.', 'Elif resim yapmadı.'], ex: 'Elif paylaşıldığı için teşekkür etti.', img: 'crayon' },
  { q: '“Yavru kedi ağacın dalında kalmıştı. ___ Yavru güvenle yere indi.” Boşluğa hangi cümle gelir?', a: 'Bir büyük ona yardım etti.', w: ['Yavru daha yükseğe çıktı.', 'Kedi uyudu.', 'Herkes evine gitti.'], ex: 'Yardım edilince yavru güvenle indi.', img: 'cat' },
  { q: '“Komşumuzun poşetleri çok ağırdı. ___ Komşumuz bize gülümsedi.” Boşluğa hangi cümle gelir?', a: 'Poşetleri taşımasına yardım ettik.', w: ['Poşetleri yere bıraktık.', 'Ona hiç bakmadık.', 'Hızlıca uzaklaştık.'], ex: 'Yardım ettiğimiz için komşumuz gülümsedi.', img: 'oldwoman' },
  { q: '“Sabah erkenden kalktım. ___ Sonra okula gittim.” Boşluğa hangi cümle gelir?', a: 'Kahvaltımı yaptım.', w: ['Uyumaya gittim.', 'Akşam yemeği yedim.', 'Pijamamı giydim.'], ex: 'Sabah kalkınca kahvaltı yapar, sonra okula gideriz.', img: 'sunrise' },
]
const YARIM_METIN_Q: Q[] = [
  { q: '“Deniz halk oyunları kursunu bırakmak istiyordu. Öğretmeni bir hafta daha denemesini söyledi…” (Konu: azim) Hikâye nasıl sürmeli?', a: 'Deniz çalıştı ve adımları öğrendi.', w: ['Deniz bir kuşa dönüşüp uçtu.', 'Deniz kursa bir daha hiç gitmedi.', 'Kurs denizin içine taşındı.'], ex: 'Konu azim olduğu için Deniz pes etmeden çalışmalı.', img: 'music' },
  { q: '“Arda ödevini yapmadan uyumuştu. Sabah defteri boştu…” (Konu: dürüstlük) Hikâye nasıl sürmeli?', a: 'Arda durumu öğretmenine dürüstçe anlattı.', w: ['Arkadaşının defterini izinsiz aldı.', 'Defteri saklayıp başka şey söyledi.', 'Defter kendi kendine doldu.'], ex: 'Dürüst olmak ve sorumluluğu üstlenmek doğru davranıştır.', img: 'notebook' },
  { q: '“Rüzgâr çok sert esiyordu. Genç horoz yine de öteceği tepeye yürüdü…” (Konu: sorumluluk) Hikâye nasıl sürmeli?', a: 'Zorlukla tepeye ulaşıp öttü.', w: ['Hemen kümese dönüp uyudu.', 'Rüzgârla uçup gitti.', 'Ötmeyi tamamen unuttu.'], ex: 'Sorumluluk sahibi horoz görevini tamamlar.', img: 'rooster' },
  { q: '“İki kardeş yeni bisikletlerine binmeyi deniyordu. İkisi de defalarca düştü…” (Konu: azim) Hikâye nasıl sürmeli?', a: 'Pes etmeden denediler ve başardılar.', w: ['Bisikletler kendi kendine uçtu.', 'Bisikletleri bir köşeye attılar.', 'Hemen vazgeçip eve girdiler.'], ex: 'Azimli olan pes etmez.', img: 'bicycle' },
  { q: '“Bebek kardeşi eve gelince Selin önce biraz kıskandı…” (Konu: kardeş sevgisi) Hikâye nasıl sürmeli?', a: 'Kardeşi parmağını tutunca onu çok sevdi.', w: ['Kardeşiyle hiç konuşmadı.', 'Evden uzaklara taşındı.', 'Kardeşinin oyuncaklarını sakladı.'], ex: 'Konu kardeş sevgisi; Selin kardeşini sevmeye başlar.', img: 'baby' },
]

/* ---------- Tema 2 ---------- */
const GORSEL_TAHMIN_Q: Q[] = [
  { q: 'Resimde bayraklarla süslü bir okul ve şarkı söyleyen çocuklar var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Bir bayram kutlaması', w: ['Bir kış tatili', 'Bir uzay yolculuğu', 'Bir diş muayenesi'], ex: 'Bayraklar ve şarkılar bir bayram kutlamasını düşündürür.', img: 'trflag' },
  { q: 'Resimde bir öğretmen ve tahtada harfler var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Okulda bir ders', w: ['Denizde balık tutmak', 'Ormanda kamp', 'Bir doğum günü'], ex: 'Öğretmen ve tahta okulu gösterir.', img: 'teacher' },
  { q: 'Resimde yağmur ve şemsiyeli çocuklar var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Yağmurlu bir gün', w: ['Karlı bir dağ', 'Sıcak bir plaj', 'Bir uzay gemisi'], ex: 'Şemsiye ve yağmur yağmurlu bir günü anlatır.', img: 'umbrella' },
  { q: 'Resimde rüzgârda uçan uçurtmalar var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Uçurtma uçurmak', w: ['Gece yıldız saymak', 'Mutfakta yemek yapmak', 'Kütüphanede kitap okumak'], ex: 'Resimdeki uçurtmalar konuyu ele verir.', img: 'kite' },
  { q: 'Resimde çiçek bırakan çocuklar ve Atatürk’ün fotoğrafı var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Atatürk’ü anmak', w: ['Pazardan meyve almak', 'Denizde yüzmek', 'Kar topu oynamak'], ex: 'Çiçek bırakmak anma törenlerinde yapılır.', img: 'rose' },
  { q: 'Resimde bir tren istasyonu ve el sallayan insanlar var. Dinleyeceğin metin ne hakkında olabilir?', a: 'Bir karşılama ya da uğurlama', w: ['Bir futbol maçı', 'Bir resim yarışması', 'Bir yemek tarifi'], ex: 'İstasyonda el sallamak karşılama ya da uğurlamayı gösterir.', img: 'train' },
]
const BAYRAM_D: Dinleme = {
  t: 'Cumhuriyet Şarkısı',
  img: 'trflag',
  text: 'Ekimin son günlerinde okulumuz bayraklarla süslendi. Duru ve arkadaşları Cumhuriyet Bayramı için bir şarkı çalıştı. Tören günü hep birlikte coşkuyla söylediler. Veliler onları alkışladı. Duru, “Cumhuriyet bizim en güzel armağanımız!” dedi.',
  qs: [
    { q: 'Dinlediğin metinle ilgili hangisi bir düşünce bildirir?', a: 'Bence bu tören çok güzeldi.', w: ['Okul bayraklarla süslendi.', 'Çocuklar şarkı söyledi.', 'Veliler alkışladı.'], ex: '“Bence” ile başlayan cümle düşüncemizi bildirir; ötekiler metinde olanları anlatır.' },
    { q: 'Duru’nun sözüne katılan biri hangi düşüncesini söyler?', a: 'Ben de Cumhuriyet’in çok değerli olduğunu düşünüyorum.', w: ['Okulun bahçesi büyüktü.', 'Şarkı kısa sürdü.', 'Tören sabah başladı.'], ex: 'Düşüncemizi “Ben de … düşünüyorum.” diye söyleyebiliriz.' },
    { q: 'Metni dinledikten sonra duygunu en iyi anlatan cümle hangisi?', a: 'Bu metni dinleyince ben de coştum.', w: ['Metinde beş cümle var.', 'Okulun kapısı büyüktür.', 'Tören ekimde yapıldı.'], ex: 'Dinlediğimiz hakkında duygu ve düşüncemizi söyleriz.' },
  ],
}
const ZAFER_D: Dinleme = {
  t: 'Penceredeki Bayrak',
  img: 'trflag',
  text: 'Sabah televizyonda bayram törenini izledik. Annem bana bu günün bir zafer günü olduğunu anlattı. Ben de pencereme küçük bir bayrak astım. Sokaktan geçenler bayrağımı görünce gülümsedi.',
  qs: [
    { q: 'Bu metinle ilgili hangisi bir düşünce bildirir?', a: 'Bence bayrak asmak çok güzel bir fikir.', w: ['Televizyonda tören vardı.', 'Bayrak pencereye asıldı.', 'Annesi bilgi verdi.'], ex: '“Bence” düşüncemizi bildirir.' },
    { q: 'Dinlediğin metin için hangisi senin düşünceni anlatan bir cümledir?', a: 'Bayramları böyle kutlamayı seviyorum.', w: ['Anne bilgi verdi.', 'Bayrak küçüktü.', 'İnsanlar gülümsedi.'], ex: 'Sevdiğimizi, düşündüğümüzü söyleyen cümleler düşünce bildirir.' },
  ],
}
const YASANTI_D: Dinleme[] = [
  {
    t: 'Dedemin Okulu',
    img: 'school',
    text: 'Ayla’nın dedesi çocukken köydeki tek sınıflı bir okula gitmiş. Kışın okula karların arasından yürüyerek gidermiş. Sınıfta bir soba yanar, öğrenciler sırayla odun getirirmiş. Dedesi, “Öğretmenimiz bize okumayı sevdirdi.” diyor.',
    qs: [
      { q: 'Dedenin okulu ile bugünkü okullar arasında hangisi farklıdır?', a: 'Sınıfın sobayla ısınması', w: ['Öğretmenin olması', 'Okumayı öğrenmek', 'Öğrencilerin ders yapması'], ex: 'Bildiklerimizle karşılaştırırız: bugün çoğu okul kaloriferle ısınır.' },
      { q: 'Bugünkü okullar ile dedenin okulunda ortak olan nedir?', a: 'Öğretmenin okumayı öğretmesi', w: ['Sobaya odun taşımak', 'Tek sınıf olması', 'Karda uzun yürümek'], ex: 'Öğretmenler o zaman da bugün de okumayı öğretir.' },
      { q: 'Dede okula giderken neden zorlanmış olabilir?', a: 'Yol karlı ve uzun olduğu için', w: ['Okul evinin yanında olduğu için', 'Servis olduğu için', 'Hava hep sıcak olduğu için'], ex: 'Karda yürümek zordur; bunu kendi yaşantımızdan biliriz.' },
    ],
  },
  {
    t: 'Masadaki Kartlar',
    img: 'teacher',
    text: 'Sabah sınıfa girdiğimizde öğretmenimizin masasında renkli kartlar vardı. Kartları biz hazırlamıştık. Öğretmenimiz kartları okurken gözleri doldu. “Siz benim en güzel hediyemsiniz.” dedi.',
    qs: [
      { q: 'Öğretmenin gözleri neden dolmuş olabilir?', a: 'Çok duygulandığı için', w: ['Uykusu geldiği için', 'Kartları beğenmediği için', 'Sınıf soğuk olduğu için'], ex: 'Sevindiğimizde ya da duygulandığımızda da gözlerimiz dolabilir.' },
      { q: 'Bu olay hangi günde olmuş olabilir?', a: 'Öğretmenler Günü’nde', w: ['Yılbaşında', 'Yaz tatilinde', 'Bir pazar gününde'], ex: 'Öğretmenimize kart hazırladığımız gün Öğretmenler Günü’dür.' },
    ],
  },
]
const IKI_ARKADAS: Metin = {
  t: 'İki Arkadaş',
  img: 'friends',
  text: 'Ela resim yapmayı sever, en sevdiği renk mavidir ve yüzmeye gider. Kerem de resim yapmayı sever ama en sevdiği renk yeşildir, futbol oynar. Ela’nın bir kedisi, Kerem’in bir köpeği var. İkisi de elmalı kek sever.',
  qs: [
    { q: 'Ela ile Kerem’in benzer yönü hangisi?', a: 'İkisi de resim yapmayı sever', w: ['İkisi de futbol oynar', 'İkisinin de kedisi var', 'İkisi de maviyi sever'], ex: 'Metinde “Kerem de resim yapmayı sever” deniyor.' },
    { q: 'Ela ile Kerem’in farklı yönü hangisi?', a: 'Sevdikleri renkler', w: ['Sevdikleri kek', 'Resim yapmayı sevmeleri', 'Arkadaş olmaları'], ex: 'Ela maviyi, Kerem yeşili sever.' },
    { q: 'Hangisi yalnızca Kerem için doğrudur?', a: 'Köpeği var', w: ['Kedisi var', 'Yüzmeye gider', 'Maviyi sever'], ex: 'Köpek Kerem’in, kedi Ela’nın.' },
    { q: 'Hangisi yalnızca Ela için doğrudur?', a: 'Yüzmeye gider', w: ['Futbol oynar', 'Köpeği var', 'Yeşili sever'], ex: 'Ela yüzmeye, Kerem futbola gider.' },
    { q: 'Hangisi ikisi için de doğrudur?', a: 'Elmalı kek sever', w: ['Futbol oynar', 'Kedisi var', 'Yeşili sever'], ex: 'İkisi de elmalı kek sever.' },
  ],
}
const EKSIK_METIN_Q: Q[] = [
  { q: '“Gökyüzü karardı, şimşekler çaktı. Biraz sonra ___ başladı.” Boşluğu tahmin et.', a: 'yağmur yağmaya', w: ['güneş açmaya', 'çiçekler açmaya', 'kuşlar ötmeye'], ex: 'Kara bulut ve şimşek yağmuru haber verir.', img: 'storm' },
  { q: '“Ali Zafer Bayramı’nda pencereye ___ astı. Rüzgârda dalgalanınca çok sevindi.” Boşluğu tahmin et.', a: 'bayrak', w: ['ayakkabı', 'tencere', 'kitap'], ex: 'Bayramlarda pencereye bayrak asarız.', img: 'trflag' },
  { q: '“Atatürk çocukları çok severdi. Onlara ___ armağan etti.” Boşluğu tahmin et.', a: '23 Nisan’ı', w: ['30 Ağustos’u', 'Yılbaşını', 'Hafta sonunu'], ex: 'Atatürk 23 Nisan’ı çocuklara armağan etti.', img: 'balloon' },
  { q: '“İstasyonda bekleyen kız, Atatürk’ü görünce çok ___. Ona çiçek verdi.” Boşluğu tahmin et.', a: 'sevindi', w: ['uyudu', 'acıktı', 'üşüdü'], ex: 'Çiçek vermek sevinci gösterir.', img: 'train' },
  { q: '“Ders bitince öğretmenimize ___ dedik ve sınıftan çıktık.” Boşluğu tahmin et.', a: '“Hoşça kalın”', w: ['“Günaydın”', '“Afiyet olsun”', '“Geçmiş olsun”'], ex: 'Ayrılırken “Hoşça kalın.” deriz.', img: 'teacher' },
  { q: '“Cumhuriyet Bayramı için okulumuzu ___ süsledik.” Boşluğu tahmin et.', a: 'bayraklarla', w: ['çamurla', 'tuzla', 'unla'], ex: 'Bayramda okullar bayraklarla süslenir.', img: 'school' },
]
const ORNEK_Q: Q[] = [
  { q: '“Millî bayramlarımız çok değerlidir. Örneğin ___” Hangisi uygun bir örnektir?', a: 'Cumhuriyet Bayramı', w: ['Yılbaşı gecesi', 'Doğum günüm', 'Karne günü'], ex: 'Cumhuriyet Bayramı millî bir bayramdır.', img: 'trflag' },
  { q: '“Atatürk çocuklara değer verirdi. Örneğin ___” Hangisi uygun bir örnektir?', a: 'okullarda çocuklarla sohbet ederdi.', w: ['sabahları erken kalkardı.', 'ata binerdi.', 'yürüyüş yapardı.'], ex: 'Çocuklarla sohbet etmek, onlara değer verdiğini gösterir.', img: 'school' },
  { q: '“Meslekler çok çeşitlidir. Örneğin ___” Hangisi uygun bir örnektir?', a: 'doktorluk, öğretmenlik, şoförlük', w: ['elma, armut, muz', 'kedi, köpek, kuş', 'kırmızı, mavi, sarı'], ex: 'Meslekler için meslek örnekleri veririz.', img: 'doctor' },
  { q: '“Cesur insanlar zor işlerden kaçmaz. Örneğin ___” Hangisi uygun bir örnektir?', a: 'itfaiyeciler yangına gider.', w: ['kediler süt içer.', 'güneş doğudan doğar.', 'çiçekler baharda açar.'], ex: 'İtfaiyecilerin işi cesaret ister.', img: 'firefighter' },
  { q: 'Hangi cümlede örnek verilmiştir?', a: 'Yer adları büyük harfle başlar; örneğin Ankara, Sivas.', w: ['Yer adları büyük harfle başlar.', 'Ankara büyük bir şehirdir.', 'Sivas’a gittik.'], ex: '“Örneğin” sözcüğünden sonra örnekler sıralanır.', img: 'map' },
  { q: 'Yazımızda örnek verirken hangi sözcüğü kullanırız?', a: 'örneğin', w: ['ama', 'çünkü', 'sonra'], ex: '“Örneğin” sözcüğü örnek vereceğimizi gösterir.', img: 'pencil' },
]
const ILETI_Q: Q[] = [
  { q: 'Kerem, “Cumhuriyet Bayramı yazın kutlanır.” dedi. Bildiklerine göre bu doğru mu?', a: 'Hayır, sonbaharda, 29 Ekim’de kutlanır.', w: ['Evet, yazın kutlanır.', 'Evet, kışın kutlanır.', 'Hayır, ilkbaharda kutlanır.'], ex: 'Cumhuriyet Bayramı 29 Ekim’dedir; ekim sonbahar ayıdır.', img: 'trflag' },
  { q: 'Bir yazıda “Bayrağımız mavi ve sarıdır.” yazıyor. Bildiklerine göre bu doğru mu?', a: 'Hayır, kırmızı ve beyazdır.', w: ['Evet, mavi ve sarıdır.', 'Hayır, yeşil ve beyazdır.', 'Evet, tek renklidir.'], ex: 'Bayrağımız kırmızı beyazdır; üzerinde ay yıldız vardır.', img: 'trflag' },
  { q: 'Metinde “Atatürk çocukları çok severdi.” yazıyor. Bildiklerinle karşılaştır.', a: 'Doğru, 23 Nisan’ı çocuklara armağan etti.', w: ['Yanlış, çocuklarla hiç ilgilenmezdi.', 'Yanlış, okulları hiç ziyaret etmezdi.', 'Doğru, çünkü hiç okula gitmedi.'], ex: 'Metindeki bilgiyi bildiklerimizle karşılaştırırız.', img: 'balloon' },
  { q: 'Bir yazıda “Anıtkabir İzmir’dedir.” yazıyor. Bildiklerine göre bu doğru mu?', a: 'Hayır, Anıtkabir Ankara’dadır.', w: ['Evet, İzmir’dedir.', 'Hayır, Sivas’tadır.', 'Evet, Samsun’dadır.'], ex: 'Anıtkabir başkentimiz Ankara’dadır.', img: 'map' },
  { q: 'Metinde “Zafer Bayramı 30 Ağustos’ta kutlanır.” yazıyor. Bildiklerine göre bu doğru mu?', a: 'Evet, doğru.', w: ['Hayır, 1 Ocak’ta kutlanır.', 'Hayır, 23 Nisan’da kutlanır.', 'Hayır, hiç kutlanmaz.'], ex: 'Zafer Bayramı 30 Ağustos’tadır.', img: 'calendar' },
  { q: 'Metinde “Öğretmenler Günü 24 Kasım’dadır.” yazıyor. Bildiklerine göre bu doğru mu?', a: 'Evet, doğru.', w: ['Hayır, 23 Nisan’dadır.', 'Hayır, 19 Mayıs’tadır.', 'Hayır, 29 Ekim’dedir.'], ex: 'Öğretmenler Günü 24 Kasım’da kutlanır.', img: 'teacher' },
]
const HIZ_Q: Q[] = [
  { q: 'Can sınıfta çok hızlı konuştu, kimse anlamadı. Ne yapmalı?', a: 'Daha yavaş ve anlaşılır konuşmalı', w: ['Daha da hızlanmalı', 'Fısıldamalı', 'Hiç durmadan konuşmalı'], ex: 'Konuşma hızımızı dinleyenlerin anlayacağı gibi ayarlarız.', img: 'stopwatch' },
  { q: 'Çok yavaş konuşursak ne olabilir?', a: 'Dinleyenler sıkılabilir', w: ['Herkes daha çok güler', 'Konuşma kısalır', 'Sözcükler değişir'], ex: 'Çok yavaş konuşmak da dinleyeni sıkar.', img: 'sleepy' },
  { q: 'Şiir okurken konuşma hızımız nasıl olmalı?', a: 'Ne çok hızlı ne çok yavaş', w: ['Olabildiğince hızlı', 'Çok çok yavaş', 'Bir koşar bir durur gibi'], ex: 'Uygun hızda okuruz.', img: 'openbook' },
  { q: 'Önemli bir bilgiyi anlatırken ne yaparız?', a: 'Biraz yavaşlayıp açıkça söyleriz', w: ['Hızla geçeriz', 'Sesimizi çok kısarız', 'Konuyu değiştiririz'], ex: 'Önemli yerlerde yavaşlarsak dinleyen iyi anlar.', img: 'bulb' },
  { q: 'Hangisi konuşma hızını iyi ayarlayan bir çocuktur?', a: 'Herkesin anlayacağı hızda anlatan Ece', w: ['Nefes almadan anlatan Ali', 'Her sözcükte uzun duran Su', 'Hızlanıp yavaşlayan Can'], ex: 'Ece’nin hızı dinleyenlere uygun.', img: 'girl' },
]

/* ---------- Tema 3 ---------- */
const AGAC_D: Dinleme = {
  t: 'Sürprizli Ağaç',
  img: 'tree',
  text: 'Bahçedeki ağaç ilkbaharda beyaz çiçeklerle süslendi. Yazın yaprakları yemyeşil oldu, kuşlar dallarında öttü. Sonbaharda bazı yaprakları sarardı. Kış gelince dallarında turuncu, mis kokulu meyveler belirdi. Çocuklar, “Bu ağaç bize sürpriz yaptı!” diye sevindi.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Bir ağacın mevsimlerle değişmesi', w: ['Kuşların göç etmesi', 'Bir bahçe kapısı', 'Kar topu oynamak'], ex: 'Metin ağacın mevsim mevsim değişmesini anlatıyor.' },
    { q: 'Ağaç hangi mevsimde meyve verdi?', a: 'Kışın', w: ['Yazın', 'İlkbaharda', 'Hiç vermedi'], ex: 'Kış gelince turuncu meyveler belirdi.' },
    { q: 'Ağacın meyvesi hangisi olabilir?', a: 'Mandalina', w: ['Kiraz', 'Karpuz', 'Üzüm'], ex: 'Kışın olgunlaşan turuncu, mis kokulu meyve mandalinadır.' },
    { q: 'Ağaç ilkbaharda nasıldı?', a: 'Çiçekliydi', w: ['Karlıydı', 'Yapraksızdı', 'Meyveliydi'], ex: 'İlkbaharda beyaz çiçeklerle süslendi.' },
  ],
}
const ATIK_D: Dinleme = {
  t: 'Sıfır Atık Günü',
  img: 'recycle',
  text: 'Bugün sınıfça sıfır atık günü yaptık. Herkes beslenmesini kapaklı kutuda getirdi. Su için matara kullandık. Kâğıtların arka yüzüne resim çizdik. Akşam çöp kutumuz neredeyse boştu.',
  qs: [
    { q: 'Dinlediğin metnin konusu ne?', a: 'Az atık çıkarmak', w: ['Resim yarışması', 'Matara satın almak', 'Beslenme saati'], ex: 'Sınıf az atık çıkarmaya çalıştı.' },
    { q: 'Çocuklar su için ne kullandı?', a: 'Matara', w: ['Plastik şişe', 'Karton bardak', 'Poşet'], ex: 'Matarayı tekrar tekrar kullanırız.' },
    { q: 'Akşam çöp kutusu nasıldı?', a: 'Neredeyse boştu', w: ['Taşmıştı', 'Kırılmıştı', 'Kaybolmuştu'], ex: 'Az atık çıkarınca çöp kutusu boş kaldı.' },
  ],
}
const AMAC_Q: Q[] = [
  { q: 'Arkadaşının doğum gününü kutlamak istiyorsun. Ne dersin?', a: 'Doğum günün kutlu olsun!', w: ['Geçmiş olsun!', 'Kolay gelsin!', 'Afiyet olsun!'], ex: 'Amacımız kutlamak; kutlama sözü seçeriz.', img: 'cake' },
  { q: 'Öğretmeninden izin istiyorsun. Hangisi uygun?', a: 'Öğretmenim, su içebilir miyim?', w: ['Su içmeye gidiyorum!', 'Ben gidiyorum.', 'Hemen su getirin!'], ex: 'İzin isterken soru biçiminde ve kibarca konuşuruz.', img: 'teacher' },
  { q: 'Sınıfa geri dönüşüm hakkında bilgi vereceksin. Nasıl başlarsın?', a: 'Size geri dönüşümü anlatacağım.', w: ['Bugün çok uykum var.', 'Teneffüse çıkalım mı?', 'Benim kedim çok tatlı.'], ex: 'Bilgi vermek için konuyu söyleyerek başlarız.', img: 'recycle' },
  { q: 'Arkadaşını parka davet etmek istiyorsun. Ne dersin?', a: 'Yarın parka gelir misin?', w: ['Park çok uzak.', 'Dün parka gittim.', 'Parkta ağaç var.'], ex: 'Davet ederken soru sorarız.', img: 'friends' },
  { q: 'Bir yanlışın için özür dilemek istiyorsun. Ne dersin?', a: 'Özür dilerim, bir daha olmayacak.', w: ['Bana ne!', 'Senin hatan.', 'Unut gitsin.'], ex: 'Amacımız özür dilemek; içtenlikle söyleriz.', img: 'hug' },
  { q: 'Arkadaşın çöpü yere atmasın istiyorsun. Hangisi onu ikna eder?', a: 'Çöpü kutuya atarsak doğa temiz kalır.', w: ['Çöp at, ne olacak!', 'Bana sorma.', 'Sen bilirsin.'], ex: 'İkna etmek için nedenini söyleriz.', img: 'trash' },
]
const DUZELT_Q: Q[] = [
  { q: 'Ece “Ben dün parka gideceğim.” dedi, sonra yanlışını fark etti. Nasıl düzeltmeli?', a: 'Ben dün parka gittim.', w: ['Ben yarın parka gittim.', 'Ben dün parka gideceğim.', 'Dün ben parka gidiyorum.'], ex: '“Dün” geçmişi anlatır: gittim.', img: 'girl' },
  { q: 'Arda “Kuşlar suda yüzer, balıklar gökte uçar.” dedi. Nasıl düzeltmeli?', a: 'Kuşlar gökte uçar, balıklar suda yüzer.', w: ['Kuşlar suda uçar, balıklar gökte yüzer.', 'Kuşlar ve balıklar gökte uçar.', 'Balıklar ve kuşlar suda yüzer.'], ex: 'Hatamızı fark edince doğrusunu söyleriz.', img: 'bird' },
  { q: 'Su “Yarın kar yağdı.” dedi. Nasıl düzeltmeli?', a: 'Yarın kar yağacak.', w: ['Yarın kar yağdı.', 'Dün kar yağacak.', 'Yarın kar yağmıştı.'], ex: '“Yarın” gelecek zamanı gösterir: yağacak.', img: 'snowflake' },
  { q: 'Konuşurken bir sözcüğü yanlış söylediğini fark edersen ne yaparsın?', a: 'Durup doğrusunu söylerim', w: ['Hiç fark etmemiş gibi yaparım', 'Konuşmayı bırakıp giderim', 'Daha hızlı konuşurum'], ex: 'Konuşmamızdaki hatayı düzeltiriz.', img: 'thinking' },
  { q: 'Mert “Sonbaharda ağaçlar çiçek açar.” dedi. Nasıl düzeltmeli?', a: 'İlkbaharda ağaçlar çiçek açar.', w: ['Sonbaharda ağaçlar çiçek açar.', 'Kışın ağaçlar çiçek açar.', 'Sonbaharda ağaçlar meyve açar.'], ex: 'Ağaçlar ilkbaharda çiçeklenir.', img: 'tree' },
  { q: 'Ela “Kâğıtları cam kutusuna atarız.” dedi. Nasıl düzeltmeli?', a: 'Kâğıtları kâğıt kutusuna atarız.', w: ['Kâğıtları cam kutusuna atarız.', 'Camları kâğıt kutusuna atarız.', 'Kâğıtları yere atarız.'], ex: 'Her atık kendi kutusuna atılır.', img: 'recycle' },
]
const GORSEL_DESTEK_Q: Q[] = [
  { q: 'Geri dönüşüm yazına hangi resmi eklersin?', a: 'Geri dönüşüm işareti', w: ['Doğum günü pastası', 'Futbol topu', 'Gitar'], ex: 'Resim yazının konusuna uygun olmalı.', o: { 'Geri dönüşüm işareti': 'recycle', 'Doğum günü pastası': 'cake', 'Futbol topu': 'ball', Gitar: 'guitar' } },
  { q: 'Sağlıklı beslenme yazına hangi resim uygun?', a: 'Salata', w: ['Şeker', 'Gazlı içecek', 'Patates kızartması'], ex: 'Sağlıklı besin resmi yazıyı destekler.', o: { Salata: 'salad', Şeker: 'candy', 'Gazlı içecek': 'soda', 'Patates kızartması': 'fries' } },
  { q: 'Mevsimler yazının “kış” bölümüne hangi resmi koyarsın?', a: 'Kardan adam', w: ['Güneş gözlüğü', 'Ayçiçeği', 'Karpuz'], ex: 'Kardan adam kışı anlatır.', o: { 'Kardan adam': 'snowman', 'Güneş gözlüğü': 'sunglasses', Ayçiçeği: 'sunflower', Karpuz: 'watermelon' } },
  { q: 'Su tasarrufu yazına hangi resim uygun?', a: 'Su damlası', w: ['Roket', 'Pizza', 'Davul'], ex: 'Su damlası yazının konusunu gösterir.', o: { 'Su damlası': 'droplet', Roket: 'rocket', Pizza: 'pizza', Davul: 'drum' } },
  { q: 'Fidan dikme şenliği yazına hangi resmi eklersin?', a: 'Fidan', w: ['Televizyon', 'Araba', 'Telefon'], ex: 'Fidan resmi yazıyı destekler.', o: { Fidan: 'seedling', Televizyon: 'television', Araba: 'car', Telefon: 'phone' } },
  { q: 'Yazımıza konuya uygun bir resim eklemek ne işe yarar?', a: 'Yazıyı daha anlaşılır yapar', w: ['Yazıyı gizler', 'Yazıyı bozar', 'Hiçbir işe yaramaz'], ex: 'Görseller yazılı anlatımı destekler.', img: 'framed' },
]
const EPOSTA_Q: Q[] = [
  { q: 'Arkadaşına sıfır atık gününü haber veren hangi ileti açık ve anlaşılır?', a: 'Yarın sıfır atık günü. Beslenmeni kapaklı kutuda getir. Suyunu da matarayla al.', w: ['Yarın şey var, getir.', 'Kutu.', 'Sıfır atık, matara, kutu, yarın!'], ex: 'Mesajımızı birden çok cümleyle açıkça anlatırız.', img: 'laptop' },
  { q: 'Öğretmenine ödevini soran hangi e-posta açık ve anlaşılır?', a: 'Sayın Öğretmenim, doğa ödevimi bitirdim. Yarın sınıfa getirebilir miyim? Saygılarımla.', w: ['Ödev bitti.', 'Ne zaman?', 'Ödev getireyim mi bilmem.'], ex: 'Hitap, açık cümleler ve uygun bir kapanış kullanırız.', img: 'memo' },
  { q: 'Dedene fidanları anlatan hangi ileti daha açık?', a: 'Sevgili Dedeciğim, bahçeye iki fidan diktik. Her akşam onları suluyorum. Gelince sana göstereceğim.', w: ['Fidan.', 'Diktik işte.', 'Bahçe bahçe fidan fidan.'], ex: 'Birden çok cümle ile ne olduğunu anlatırız.', img: 'seedling' },
  { q: 'E-postada “Konu” kısmına ne yazılır?', a: 'İletinin ne hakkında olduğu', w: ['Ev adresimiz', 'Telefon numaramız', 'Şifremiz'], ex: 'Konu kısmı iletinin konusunu söyler. Adres, telefon, şifre gibi bilgileri yazmayız.', img: 'laptop' },
  { q: 'Hangi ileti birden çok cümleyle açıkça anlatıyor?', a: 'Kalemliğimi eski bir kavanozdan yaptım. Üstünü boyadım. Çok güzel oldu.', w: ['Kavanoz.', 'Yaptım.', 'Boya!'], ex: 'Tek sözcük yerine açık cümleler yazarız.', img: 'jar' },
]

/* ---------- Tema 4 ---------- */
const HARF_D: Dinleme = {
  t: 'Harflerin Rüyası',
  img: 'abc',
  text: 'Elif bir gün odasında harf kartlarıyla oynuyordu. Kartları yan yana dizince “kitap” sözcüğü çıktı. O gece rüyasında harfler kanatlanıp kelebek gibi uçtu. Sabah uyandığında kartlar yine masanın üstündeydi. Elif o gün kütüphaneden iki kitap aldı.',
  qs: [
    { q: 'Metindeki hangi olay gerçekte olabilir?', a: 'Elif’in kütüphaneden kitap alması', w: ['Harflerin kanatlanıp uçması', 'Harflerin kelebeğe dönüşmesi', 'Harflerin konuşması'], ex: 'Kütüphaneden kitap almak gerçek bir olaydır; uçan harfler hayaldir.' },
    { q: 'Metindeki hangi olay hayal ürünüdür?', a: 'Harflerin kelebek gibi uçması', w: ['Elif’in kartlarla oynaması', 'Elif’in kitap alması', 'Kartların masada durması'], ex: 'Harfler gerçekte uçmaz; bu bir rüyaydı.' },
    { q: 'Harfler gerçekten uçtu mu?', a: 'Hayır, Elif rüyasında gördü', w: ['Evet, odada uçtular', 'Evet, kütüphaneye uçtular', 'Hayır, kartlar kayboldu'], ex: 'Sabah kartlar masanın üstündeydi.' },
  ],
}
const KAPTAN_D: Dinleme = {
  t: 'Kitaptaki Kaptan',
  img: 'ship',
  text: 'Can bir macera kitabı okuyordu. Kitapta bir kaptan, gemisini dalgaların arasından kıyıya getiriyordu. Can, kaptanın kitaptan çıkıp kendisiyle konuştuğunu hayal etti. Hafta sonu babasıyla limana gidip gerçek gemileri izledi.',
  qs: [
    { q: 'Metindeki hangi olay gerçektir?', a: 'Can’ın babasıyla limana gitmesi', w: ['Kaptanın kitaptan çıkması', 'Kaptanın Can’la konuşması', 'Kitabın gemiye dönüşmesi'], ex: 'Limana gitmek gerçek; kaptanın kitaptan çıkması hayal.' },
    { q: 'Kaptanın Can’la konuşması gerçek mi?', a: 'Hayır, Can bunu hayal etti', w: ['Evet, kaptan odaya geldi', 'Evet, kaptan kapıyı çaldı', 'Hayır, kaptan uyuyordu'], ex: 'Metinde “hayal etti” deniyor.' },
  ],
}
const DINLEME_ORTAM_Q: Q[] = [
  { q: 'Bir masal dinleyeceksin. Hangi ortam en uygun?', a: 'Sessiz ve rahat bir oda', w: ['Gürültülü bir pazar yeri', 'Televizyonun açık olduğu salon', 'Kalabalık bir durak'], ex: 'Sessiz ortamda daha iyi dinleriz.', img: 'ear' },
  { q: 'Dinleme yapacaksın ama televizyon açık. Ne yaparsın?', a: 'Kapatılmasını rica ederim', w: ['Sesini daha da açarım', 'Hem izler hem dinlerim', 'Dinlemekten vazgeçerim'], ex: 'Dinlemeden önce ortamı uygun hâle getiririz.', img: 'television' },
  { q: 'Sınıfta dinleme metni açılacak, dışarıdan yüksek ses geliyor. Ne yapılabilir?', a: 'Pencere kapatılabilir', w: ['Herkes bağırabilir', 'Herkes ayağa kalkabilir', 'Ses daha da kısılabilir'], ex: 'Gürültüyü azaltırsak daha iyi dinleriz.', img: 'school' },
  { q: 'Hangisi dinlemeyi zorlaştırır?', a: 'Etrafta gürültü olması', w: ['Sessiz bir ortam', 'Rahat oturmak', 'Sesin iyi duyulması'], ex: 'Gürültü dikkatimizi dağıtır.', img: 'speaker' },
  { q: 'Dinlemeden önce ortamı neden gözden geçiririz?', a: 'Dikkatimiz dağılmasın diye', w: ['Uykumuz gelsin diye', 'Gürültü artsın diye', 'Metin kısalsın diye'], ex: 'Uygun ortam iyi dinlemeyi sağlar.', img: 'thinking' },
  { q: 'Kulaklıkla dinlerken ses nasıl olmalı?', a: 'Kulağı incitmeyecek düzeyde', w: ['Olabildiğince yüksek', 'Bir çok yüksek bir çok kısık', 'Sonuna kadar açık'], ex: 'Çok yüksek ses kulaklarımıza zarar verir.', img: 'headphone' },
]
const DINLEME_HATA_Q: Q[] = [
  { q: 'Ali dinleme metni çalarken arkadaşıyla konuştu, soruları yanıtlayamadı. Hatası neydi?', a: 'Dinlerken konuşmak', w: ['Soruları okumak', 'Sessiz oturmak', 'Konuşana bakmak'], ex: 'Dinlerken konuşursak metni kaçırırız.', img: 'boy' },
  { q: 'Ela dinlerken pencereden dışarı baktı, olayları karıştırdı. Hatası neydi?', a: 'Dikkatini başka yere vermek', w: ['Metni dikkatle dinlemek', 'Not almak', 'Soru sormak'], ex: 'Dikkatimizi dinlediğimize veririz.', img: 'girl' },
  { q: 'Mert anlamadığı bir yer olunca konuşanın sözünü kesti. Ne yapmalıydı?', a: 'Konuşma bitince sormalıydı', w: ['Daha yüksek sesle kesmeliydi', 'Hiç dinlememeliydi', 'Sınıftan çıkmalıydı'], ex: 'Uygun zamanda söz alırız.', img: 'raisedhand' },
  { q: 'Zeynep dinlerken uyuklayıp metni kaçırdı. Bir dahaki sefere ne yapmalı?', a: 'Dinlenmiş ve dikkatli başlamalı', w: ['Yine uyumalı', 'Metni hiç dinlememeli', 'Gözlerini kapatmalı'], ex: 'Hatamızı fark edip düzeltiriz.', img: 'sleepy' },
  { q: 'Dinledikten sonra kendine hangi soruyu sorarsın?', a: '“Dikkatle dinledim mi?”', w: ['“Kaç sayfa okudum?”', '“Ne yemek yiyeceğim?”', '“Saat kaç oldu?”'], ex: 'Kendimizi değerlendirip hatalarımızı buluruz.', img: 'ear2' },
]
const JEST_Q: Q[] = [
  { q: 'Şaşırdığını anlatırken yüzün nasıl olur?', a: 'Şaşkın yüz', w: ['Uykulu yüz', 'Kızgın yüz', 'Gülen yüz'], ex: 'Yüz ifademiz (mimik) sözümüzü destekler.', o: { 'Şaşkın yüz': 'surprised', 'Uykulu yüz': 'sleepy', 'Kızgın yüz': 'angry', 'Gülen yüz': 'grin' } },
  { q: 'Sevindirici bir haberi anlatırken hangi yüz ifadesi uygun?', a: 'Gülen yüz', w: ['Üzgün yüz', 'Kızgın yüz', 'Uykulu yüz'], ex: 'Sevinci gülen yüzle gösteririz.', o: { 'Gülen yüz': 'grin', 'Üzgün yüz': 'sad', 'Kızgın yüz': 'angry', 'Uykulu yüz': 'sleepy' } },
  { q: 'Arkadaşına “Harika!” derken hangi el hareketi uygun?', a: 'Başparmak yukarı', w: ['Başparmak aşağı', 'Sus işareti', 'Kızgın yüz'], ex: 'Başparmak yukarı beğeniyi gösterir (jest).', o: { 'Başparmak yukarı': 'thumbsup', 'Başparmak aşağı': 'thumbsdown', 'Sus işareti': 'shush', 'Kızgın yüz': 'angry' } },
  { q: 'Uzaktaki arkadaşına “Merhaba!” derken ne yaparsın?', a: 'El sallarım', w: ['Başparmağımı aşağı indiririm', 'Sus işareti yaparım', 'Kaşlarımı çatarım'], ex: 'El sallamak selamlaşma jestidir.', o: { 'El sallarım': 'wave', 'Başparmağımı aşağı indiririm': 'thumbsdown', 'Sus işareti yaparım': 'shush', 'Kaşlarımı çatarım': 'angry' } },
  { q: 'Hikâyedeki üzgün kahramanı anlatırken yüz ifaden nasıl olur?', a: 'Üzgün yüz', w: ['Gülen yüz', 'Uykulu yüz', 'Kızgın yüz'], ex: 'Mimiklerimiz anlattığımız duyguya uygun olmalı.', o: { 'Üzgün yüz': 'sad', 'Gülen yüz': 'grin', 'Uykulu yüz': 'sleepy', 'Kızgın yüz': 'angry' } },
  { q: 'Sessiz sinemada “kitap okuyorum” demek için ne yaparsın?', a: 'Ellerimi kitap gibi açarım', w: ['Ellerimi çırparım', 'Ayağımı yere vururum', 'Gözlerimi kapatırım'], ex: 'Jestlerle anlatırız: açılan eller kitabı gösterir.', img: 'theater' },
]
const TONLAMA_Q: Q[] = [
  { q: '“Yaşasın, kitabımı bitirdim!” cümlesini nasıl söyleriz?', a: 'Sevinçli bir sesle', w: ['Üzgün bir sesle', 'Fısıldayarak', 'Sıkılmış bir sesle'], ex: 'Sevinç bildiren cümleyi sevinçle söyleriz.', img: 'happy' },
  { q: '“Kitabımı kim aldı?” cümlesini nasıl söyleriz?', a: 'Soran bir sesle', w: ['Emir veren bir sesle', 'Şarkı söyler gibi', 'Hiç ses tonunu değiştirmeden'], ex: 'Soru cümlesinin sonunda sesimiz yükselir.', img: 'thinking' },
  { q: '“Dikkat, basamak var!” cümlesini nasıl söyleriz?', a: 'Uyaran, güçlü bir sesle', w: ['Uykulu bir sesle', 'Gülerek', 'Fısıltıyla'], ex: 'Uyarı sözlerini vurgulu söyleriz.', img: 'stopsign' },
  { q: 'Kütüphanede arkadaşına bir şey sorarken sesin nasıl olmalı?', a: 'Alçak ve sakin', w: ['Çok yüksek', 'Bağırarak', 'Şarkı söyler gibi'], ex: 'Ortama göre ses tonumuzu ayarlarız.', img: 'books' },
  { q: '“Kitabı ben okudum.” Kimin okuduğunu vurgulamak için hangi sözcüğü güçlü söyleriz?', a: 'ben', w: ['kitabı', 'okudum', 'hiçbirini'], ex: 'Vurgulamak istediğimiz sözcüğü daha güçlü söyleriz.', img: 'book' },
  { q: 'Şiir okurken sesimiz nasıl olmalı?', a: 'Duyguya göre inip çıkan', w: ['Hep aynı ve düz', 'Hep bağıran', 'Hep fısıldayan'], ex: 'Tonlama şiire duygu katar.', img: 'openbook' },
]
const BROSUR: Metin = {
  t: 'Çocuk Kütüphanesi Broşürü',
  img: 'books',
  text: 'Kütüphanemiz pazartesiden cumartesiye açıktır, pazar günü kapalıdır. Çocuk bölümü ikinci kattadır. Kitaplar 15 gün süreyle ödünç verilir. Her cumartesi saat 11.00’de masal saati vardır.',
  qs: [
    { q: 'Broşüre göre çocuk bölümü nerede?', a: 'İkinci katta', w: ['Birinci katta', 'Bahçede', 'Çatıda'], ex: 'Broşürde “Çocuk bölümü ikinci kattadır.” yazıyor.' },
    { q: 'Broşüre göre masal saati ne zaman?', a: 'Cumartesi 11.00’de', w: ['Pazar 11.00’de', 'Pazartesi 10.30’da', 'Her akşam'], ex: 'Masal saati cumartesi 11.00’dedir.' },
    { q: 'Broşüre göre bir kitap kaç gün ödünç alınır?', a: '15 gün', w: ['3 gün', '30 gün', '1 gün'], ex: 'Kitaplar 15 gün ödünç verilir.' },
    { q: 'Broşüre göre kütüphane hangi gün kapalıdır?', a: 'Pazar', w: ['Pazartesi', 'Çarşamba', 'Cumartesi'], ex: 'Pazar günü kapalıdır.' },
  ],
}
const OKUMA_TABLO: Metin = {
  t: 'Sınıfımızın Okuma Tablosu',
  img: 'chart',
  text: 'Tabloda her okunan kitap bir yıldızla gösterildi. Ali’nin satırında 3 yıldız var. Ece’nin satırında 5 yıldız var. Can’ın satırında 2 yıldız var.',
  qs: [
    { q: 'Tabloya göre en çok kitabı kim okudu?', a: 'Ece', w: ['Ali', 'Can', 'Hepsi eşit'], ex: 'En çok yıldız Ece’nin satırında: 5.' },
    { q: 'Tabloya göre Can kaç kitap okudu?', a: '2', w: ['3', '5', '1'], ex: 'Can’ın satırında 2 yıldız var.' },
    { q: 'Tablodaki yıldızlar neyi gösteriyor?', a: 'Okunan kitapları', w: ['Hava durumunu', 'Gökteki yıldızları', 'Kazanılan maçları'], ex: 'Her yıldız bir kitaptır.' },
  ],
}

/* ---------- Tema 5 ---------- */
const OYUNLAR_D: Dinleme = {
  t: 'Dedemin Oyunları',
  img: 'oldman',
  text: 'Mete yeni oyuncak arabasını dedesine gösterdi. Dedesi gülümseyip, “Biz çocukken oyuncaklarımızı kendimiz yapardık.” dedi. Tahtadan topaç, eski kumaştan top yaparlarmış. Akşamları sokakta körebe ve saklambaç oynarlarmış. Mete, “Bana da topaç yapmayı öğretir misin?” diye sordu.',
  qs: [
    { q: 'Dinlediğini anlatırken ön bilgisini kullanan çocuk hangisi?', a: '“Ben de saklambacı bilirim; biri sayar, ötekiler saklanır.”', w: ['“Metin bitti.”', '“Mete bir çocuk.”', '“Dinlemedim, bilmiyorum.”'], ex: 'Bildiklerimizi dinlediklerimize ekleyerek anlatırız.' },
    { q: 'Körebeyi bilen biri dedenin anlattıklarına ne ekleyebilir?', a: 'Ebenin gözü bağlanır, ötekileri yakalamaya çalışır.', w: ['Körebe suda oynanır.', 'Körebede topa vurulur.', 'Körebe tek başına oynanır.'], ex: 'Ön bilgimizi kullanarak oyunu açıklarız.' },
    { q: 'Topaç nedir? Bildiklerini kullan.', a: 'Döndürülerek oynanan oyuncak', w: ['Bir meyve', 'Bir kuş', 'Bir müzik aleti'], ex: 'Topaç fırıl fırıl döndürülür.' },
    { q: 'Dedenin çocukken oynadığı oyun hangisi?', a: 'Saklambaç', w: ['Tablet oyunu', 'Robot yarışı', 'Uzay oyunu'], ex: 'Dede akşamları körebe ve saklambaç oynarmış.' },
    { q: 'Mete dedesinden ne istedi?', a: 'Topaç yapmayı öğretmesini', w: ['Yeni araba almasını', 'Ona masal okumasını', 'Parka gitmelerini'], ex: 'Mete topaç yapmayı öğrenmek istedi.' },
  ],
}
const KPLAN_O: O[] = [
  { q: 'Konuşmana hazırlan. Sırala.', s: ['Konumu belirlerim', 'Anahtar sözcükleri yazarım', 'Prova yaparım', 'Konuşmamı yaparım'], ex: 'Konuşma planı hazırlarız, sonra prova edip konuşuruz.', img: 'microphone' },
  { q: '“Unutulan oyunlar” konuşmanı planla. Sırala.', s: ['Konuyu belirlerim', 'Büyüklerime oyunları sorarım', 'Önemli noktaları not alırım', 'Sınıfa anlatırım'], ex: 'Bilgi toplar, not alır, sonra anlatırız.', img: 'memo' },
]
const KPLAN_Q: Q[] = [
  { q: 'Konuşma planında hangisi yer almaz?', a: 'Ev adresim', w: ['Konu', 'Dinleyiciler', 'Anahtar sözcükler'], ex: 'Planda konu, dinleyiciler, süre ve anahtar sözcükler olur. Kişisel bilgi yazılmaz.', img: 'memo' },
  { q: 'Konuşma planında “Dinleyiciler” bölümüne ne yazılır?', a: 'Kimlere konuşacağım', w: ['Konuşmanın süresi', 'Konunun adı', 'En sevdiğim renk'], ex: 'Dinleyiciler: konuşmamızı kimlerin dinleyeceği.', img: 'friends' },
  { q: '“Resim yapma yeteneğim” konuşması için hangisi anahtar sözcük olabilir?', a: 'boya, fırça, tuval', w: ['yağmur, bulut, şemsiye', 'araba, tekerlek, yol', 'balık, deniz, kum'], ex: 'Anahtar sözcükler konuyla ilgili olmalı.', img: 'palette' },
  { q: 'Konuşma planı neden hazırlanır?', a: 'Ne anlatacağımı unutmamak için', w: ['Konuşmayı uzatmak için', 'Dinleyicileri sıkmak için', 'Konuşmamak için'], ex: 'Plan, konuşmamızı düzenli yapar.', img: 'thinking' },
]
const PLANA_UYGUN_Q: Q[] = [
  { q: 'Anaokulundaki çocuklara bir oyun anlatacaksın. Nasıl konuşursun?', a: 'Kısa ve kolay sözcüklerle', w: ['Çok uzun ve zor sözcüklerle', 'Hiç örnek vermeden', 'Çok hızlı'], ex: 'Dinleyicilere uygun konuşuruz.', img: 'teddy' },
  { q: 'Planında üç oyun var: körebe, seksek, topaç. Konuşurken ne yaparsın?', a: 'Üç oyunu sırayla anlatırım', w: ['Yalnızca uzayı anlatırım', 'Planı unutup başka konuya geçerim', 'Hiçbirini anlatmam'], ex: 'Hazırladığımız plana uygun konuşuruz.', img: 'memo' },
  { q: 'Dedene ve ninene yeteneğini anlatırken hangisi uygun?', a: 'Saygılı ve açık konuşmak', w: ['Onlara bağırmak', 'Sözlerini kesmek', 'Arkamı dönerek konuşmak'], ex: 'Büyüklerimize saygıyla konuşuruz.', img: 'oldman' },
  { q: 'Konuşma süren 2 dakika. Ne yaparsın?', a: 'Planıma uyup sözümü zamanında bitiririm', w: ['Yarım saat konuşurum', 'Hiç başlamam', 'Sürekli konu değiştiririm'], ex: 'Plandaki süreye uyarız.', img: 'stopwatch' },
  { q: 'Sınıfa bir oyunu anlatıyorsun. Hangisi plana uygun bir başlangıçtır?', a: '“Bugün size bir oyun anlatacağım.”', w: ['“Dün yemekte makarna vardı.”', '“Benim kedim uyuyor.”', '“Hadi teneffüse çıkalım.”'], ex: 'Konuşmaya konuyu söyleyerek başlarız.', img: 'raisedhand' },
]
const YAZ_ORTAM_Q: Q[] = [
  { q: 'Mektup yazacaksın. Hangi ortam uygun?', a: 'Aydınlık ve sessiz bir masa', w: ['Karanlık bir köşe', 'Sallanan bir otobüs', 'Gürültülü bir oyun alanı'], ex: 'Yazmak için aydınlık ve sessiz bir yer seçeriz.', img: 'notebook' },
  { q: 'Yazarken nasıl otururuz?', a: 'Sırtımız dik, defter karşımızda', w: ['Yere uzanıp', 'Ayakta sallanarak', 'Başımızı masaya koyup'], ex: 'Doğru oturuş elimizi ve gözümüzü yormaz.', img: 'seat' },
  { q: 'Yazı yazacaksın ama masan dağınık. Ne yaparsın?', a: 'Önce masamı toplarım', w: ['Dağınıklığın üstüne yazarım', 'Yazmaktan vazgeçerim', 'Masayı daha da dağıtırım'], ex: 'Düzenli bir masa yazmayı kolaylaştırır.', img: 'broom' },
  { q: 'Oda karanlıksa yazmadan önce ne yaparsın?', a: 'Işığı açarım', w: ['Gözlerimi kısarım', 'Perdeyi kapatırım', 'Karanlıkta yazarım'], ex: 'Yeterli ışık gözlerimizi korur.', img: 'bulb' },
  { q: 'Yazmaya başlamadan önce hangi araçları hazırlarız?', a: 'Kalem, silgi ve defter', w: ['Top, ip ve misket', 'Tabak, kaşık ve bardak', 'Şapka, eldiven ve atkı'], ex: 'Yazı araçlarımız hazır olmalı.', img: 'pencil' },
  { q: 'Yazarken televizyon açıksa ne olur?', a: 'Dikkatimiz dağılır', w: ['Daha güzel yazarız', 'Yazımız uzar', 'Kalemimiz hızlanır'], ex: 'Sessiz ortamda daha iyi yazarız.', img: 'television' },
]
const ANLAMLI_Q: Q[] = [
  { q: '“Ozan küçükken ___ çalmayı öğrendi.” Hangi sözcük cümleyi anlamlı yapar?', a: 'saz', w: ['tencere', 'pencere', 'kapı'], ex: 'Saz bir müzik aletidir; çalınır.', img: 'guitar' },
  { q: '“Bez bebeğimin saçlarını ___ ile yaptım.” Hangi sözcük cümleyi anlamlı yapar?', a: 'iplik', w: ['çorba', 'yağmur', 'su'], ex: 'Bez bebeğin saçı iplikten yapılır.', img: 'teddy' },
  { q: '“Saklambaçta ebe gözlerini kapatıp ___.” Hangi sözcük cümleyi anlamlı yapar?', a: 'sayar', w: ['uçar', 'yüzer', 'pişirir'], ex: 'Ebe gözünü kapatıp sayar.', img: 'eyes' },
  { q: '“Ressam tablosunu ___ ile boyadı.” Hangi sözcük cümleyi anlamlı yapar?', a: 'fırça', w: ['kaşık', 'çekiç', 'tarak'], ex: 'Resim fırçayla boyanır.', img: 'palette' },
  { q: '“Müzede eski oyuncakları ___.” Hangi sözcük cümleyi anlamlı yapar?', a: 'inceledik', w: ['yedik', 'suladık', 'pişirdik'], ex: 'Müzede eşyaları inceleriz.', img: 'framed' },
  { q: '“Yarışmayı kazanan arkadaşıma tebrik kartı ___.” Hangi sözcük cümleyi anlamlı yapar?', a: 'yazdım', w: ['içtim', 'uyudum', 'ektim'], ex: 'Kart yazılır.', img: 'violin' },
]

/* ---------- Tema 6 ---------- */
const YARIS_D: Dinleme = {
  t: 'Uçan Araç Yarışı',
  img: 'airplane',
  text: 'Kırmızı takım uçan aracını pistin başına koydu. Düğmeye bastılar ama araç çalışmadı. Takımdan biri, “Eyvah, bataryayı takmayı unuttuk!” dedi. Bataryayı takınca araç vınlayarak havalandı. Yarış bitince mavi takım, “Ustaca uçtunuz, tebrikler!” diyerek onları alkışladı.',
  qs: [
    { q: '“Eyvah, bataryayı takmayı unuttuk!” sözü hangi resimle ilgilidir?', a: 'Pil', w: ['Kupa', 'Alkış', 'Roket'], ex: 'Batarya, pil grubudur.', o: { Pil: 'battery', Kupa: 'trophy', Alkış: 'clap', Roket: 'rocket' } },
    { q: '“Ustaca uçtunuz, tebrikler!” sözüne hangi resim uyar?', a: 'Alkış', w: ['Pil', 'Uykulu yüz', 'Kızgın yüz'], ex: 'Tebrik ederken alkışlarız.', o: { Alkış: 'clap', Pil: 'battery', 'Uykulu yüz': 'sleepy', 'Kızgın yüz': 'angry' } },
    { q: '“Araç vınlayarak havalandı.” cümlesine hangi resim uyar?', a: 'Uçan araç', w: ['Tren', 'Bisiklet', 'Gemi'], ex: 'Havalanan bir uçan araçtır.', o: { 'Uçan araç': 'airplane', Tren: 'train', Bisiklet: 'bicycle', Gemi: 'ship' } },
    { q: 'Mavi takımın kırmızı takımı kutlaması hangi resimle anlatılır?', a: 'El sıkışma', w: ['Kızgın yüz', 'Başparmak aşağı', 'Uykulu yüz'], ex: 'Rakibini kutlamak centilmenliktir.', o: { 'El sıkışma': 'handshake', 'Kızgın yüz': 'angry', 'Başparmak aşağı': 'thumbsdown', 'Uykulu yüz': 'sleepy' } },
  ],
}
const KAYIK_D: Dinleme = {
  t: 'Kâğıttan Kayık',
  img: 'ship',
  text: 'Ece bir kâğıdı ikiye katladı. Köşelerini kıvırıp küçük bir kayık yaptı. Kayığı bahçedeki su birikintisine bıraktı. Rüzgâr esince kayık yavaşça yüzdü. Ece, “Kayığım bir kaptan gibi yol alıyor!” diye güldü.',
  qs: [
    { q: '“Ece bir kâğıdı ikiye katladı.” cümlesine hangi resim uyar?', a: 'Kâğıt', w: ['Top', 'Pizza', 'Saat'], ex: 'Kayık kâğıttan yapıldı.', o: { Kâğıt: 'memo', Top: 'ball', Pizza: 'pizza', Saat: 'clock' } },
    { q: '“Rüzgâr esince kayık yüzdü.” cümlesine hangi resim uyar?', a: 'Kayık', w: ['Uçak', 'Araba', 'Tren'], ex: 'Suda yüzen bir kayıktır.', o: { Kayık: 'ship', Uçak: 'airplane', Araba: 'car', Tren: 'train' } },
    { q: 'Ece’nin son sözüne hangi resim uyar?', a: 'Gülen yüz', w: ['Üzgün yüz', 'Kızgın yüz', 'Uykulu yüz'], ex: 'Ece güldü; sevinçliydi.', o: { 'Gülen yüz': 'grin', 'Üzgün yüz': 'sad', 'Kızgın yüz': 'angry', 'Uykulu yüz': 'sleepy' } },
  ],
}
const KONUSMA_ORTAM_Q: Q[] = [
  { q: 'Sınıfa sunum yapacaksın. Ortam nasıl olmalı?', a: 'Sessiz ve herkesin seni görebileceği', w: ['Gürültülü ve karanlık', 'Herkesin arkasını döndüğü', 'Müziğin çok yüksek olduğu'], ex: 'Konuşmadan önce ortamın uygun olup olmadığına bakarız.', img: 'microphone' },
  { q: 'Konuşma yapacağın yer çok gürültülüyse ne yaparsın?', a: 'Gürültü azalınca başlarım', w: ['Bağırarak konuşurum', 'Hiç konuşmam', 'Fısıldarım'], ex: 'Ortam uygun olunca konuşmaya başlarız.', img: 'speaker' },
  { q: 'Büyük bir salonda konuşacaksın, arkadakiler duymuyor. Ne kullanılabilir?', a: 'Mikrofon', w: ['Şemsiye', 'Kumbara', 'El feneri'], ex: 'Mikrofon sesimizi herkese ulaştırır.', img: 'microphone' },
  { q: 'Konuşmaya başlamadan önce neyi kontrol edersin?', a: 'Dinleyicilerin beni duyup görebildiğini', w: ['Ayakkabımın rengini', 'Hava durumunu', 'Ne yemek yiyeceğimi'], ex: 'Herkes duyup görebilmeli.', img: 'eyes' },
  { q: 'Hastanede bir yakınını ziyaret ederken nasıl konuşursun?', a: 'Alçak sesle ve kısa', w: ['Bağırarak', 'Şarkı söyleyerek', 'Uzun uzun ve yüksek sesle'], ex: 'Hastanede hastaları rahatsız etmeyiz.', img: 'hospital' },
  { q: 'Bebek uyurken evde nasıl konuşuruz?', a: 'Alçak sesle, sessizce', w: ['Yüksek sesle', 'Bağırarak', 'Şarkı söyleyerek'], ex: 'Ortama göre konuşuruz.', img: 'baby' },
]
const BASLIK_Q: Q[] = [
  { q: 'Başlık: “Uzaya Giden Kız”. Resimde bir roket var. Metin ne hakkında olabilir?', a: 'Bir kızın uzay yolculuğu', w: ['Bir kızın pasta yapması', 'Denizde balık tutmak', 'Bir köpeğin kaybolması'], ex: 'Başlık ve roket resmi uzayı düşündürür.', img: 'rocket' },
  { q: 'Başlık: “Robot Arkadaşım”. Metin ne hakkında olabilir?', a: 'Bir çocuk ile robotun arkadaşlığı', w: ['Bir çiftlikteki inekler', 'Yağmurlu bir gün', 'Bir futbol maçı'], ex: 'Başlık bize konuyu söyler.', img: 'robot' },
  { q: 'Başlık: “Mucit Dedem”. Resimde dişliler var. Metin ne hakkında olabilir?', a: 'İcat yapan bir dede', w: ['Bahçede çiçek eken bir nine', 'Denizde yüzen bir balık', 'Kar yağan bir köy'], ex: 'Mucit ve dişliler icadı düşündürür.', img: 'gear' },
  { q: 'Başlık: “Teleskopla Bir Gece”. Metin ne hakkında olabilir?', a: 'Gökyüzünü gözlemek', w: ['Sabah kahvaltısı', 'Denizde tatil', 'Okulda resim dersi'], ex: 'Teleskopla gökyüzü gözlenir.', img: 'telescope' },
  { q: 'Başlık: “Büyüteçli Dedektif”. Metin ne hakkında olabilir?', a: 'Bir ipucunun peşine düşmek', w: ['Mutfakta çorba pişirmek', 'Bir yüzme yarışı', 'Kış uykusuna yatan ayı'], ex: 'Dedektif ve büyüteç ipucu aramayı düşündürür.', img: 'magnifier' },
  { q: 'Başlık: “Laboratuvarda Bir Gün”. Metin ne hakkında olabilir?', a: 'Deney yapmak', w: ['Kamp ateşi yakmak', 'Pazardan meyve almak', 'Halay çekmek'], ex: 'Laboratuvarda deney yapılır.', img: 'lab' },
]
const OLAY_TAHMIN_Q: Q[] = [
  { q: 'Başlık: “Pil Bitince”. Resimde durmuş bir robot var. Metinde hangi olay geçebilir?', a: 'Robotun pili bitip durması', w: ['Robotun denizde yüzmesi', 'Robotun pasta yemesi', 'Robotun kar topu atması'], ex: 'Başlık ve resim pilin bittiğini düşündürür.', img: 'battery' },
  { q: 'Başlık: “Kâğıt Kayık Yarışı”. Resimde su ve kayıklar var. Metinde hangi olay geçebilir?', a: 'Çocukların kayıklarını yüzdürmesi', w: ['Kayıkların uzaya uçması', 'Kayıkların fırında pişmesi', 'Kayıkların karda kayması'], ex: 'Su ve kayık bir yarışı düşündürür.', img: 'ship' },
  { q: 'Başlık: “Aklımdaki Sorular”. Resimde düşünen bir çocuk var. Metinde hangi olay geçebilir?', a: 'Çocuğun merak ettiklerini sorması', w: ['Çocuğun uyuyakalması', 'Çocuğun koşu yarışını kazanması', 'Çocuğun yemek pişirmesi'], ex: 'Başlık sorulardan söz ediyor.', img: 'thinking' },
  { q: 'Başlık: “Yağmurda Robot”. Resimde şemsiyeli bir robot var. Metinde hangi olay geçebilir?', a: 'Robotun yağmurdan korunması', w: ['Robotun kumda oynaması', 'Robotun güneşlenmesi', 'Robotun kar topu atması'], ex: 'Şemsiye ve yağmur ipucu verir.', img: 'umbrella' },
  { q: 'Başlık: “Uçurtma Makinesi”. Resimde dişliler ve uçurtma var. Metinde hangi olay geçebilir?', a: 'Birinin uçurtma yapan bir makine icat etmesi', w: ['Uçurtmanın denize düşüp balık olması', 'Bir kedinin uyuması', 'Bir trenin rayda gitmesi'], ex: 'Başlık ve resim bir icadı düşündürür.', img: 'kite' },
]

/* ---------- Tema 7 ---------- */
const USLUP_Q: Q[] = [
  { q: 'Bayram sevincini anlatırken nasıl konuşursun?', a: 'Neşeli ve coşkulu', w: ['Üzgün ve sessiz', 'Kızgın', 'Sıkılmış'], ex: 'Konunun özelliğine göre konuşuruz: bayram neşelidir.', img: 'party' },
  { q: 'İstiklâl Marşı’nı okurken nasıl bir tavır uygun?', a: 'Saygılı ve ciddi', w: ['Gülerek ve şakayla', 'Bağırarak ve koşarak', 'Fısıldayarak ve sıkılarak'], ex: 'Millî marşımızı saygıyla okuruz.', img: 'trflag' },
  { q: 'Bir fıkra anlatırken nasıl konuşursun?', a: 'Eğlenceli ve canlı', w: ['Çok ciddi ve donuk', 'Ağlamaklı', 'Hiç ses çıkarmadan'], ex: 'Fıkra güldürür; canlı anlatılır.', img: 'grin' },
  { q: 'Hasta bir komşuya “Geçmiş olsun.” derken nasıl konuşursun?', a: 'Nazik ve yumuşak', w: ['Gülerek ve bağırarak', 'Kızgın', 'Alaycı'], ex: 'Konuya uygun, nazik bir üslup seçeriz.', img: 'oldman' },
  { q: 'Tarihî bir yeri tanıtırken nasıl konuşursun?', a: 'Açık ve bilgi veren bir dille', w: ['Şarkı söyler gibi', 'Hep şaka yaparak', 'Çok hızlı ve karışık'], ex: 'Bilgi verirken açık konuşuruz.', img: 'castle' },
  { q: 'Bayram ziyaretinde ninene nasıl seslenirsin?', a: '“Bayramınız kutlu olsun nineciğim.”', w: ['“Ne var ne yok?”', '“Hey sen!”', '“Çabuk şeker ver!”'], ex: 'Büyüklerimize saygılı bir dille konuşuruz.', img: 'oldwoman' },
]
const FIKRA_D: Dinleme = {
  t: 'Ya Tutarsa',
  img: 'thinking',
  text: 'Bir gün Nasreddin Hoca göl kenarına gelmiş. Elindeki mayayı azar azar göle katmaya başlamış. Görenler, “Hocam, göl hiç yoğurt olur mu?” diye sormuş. Hoca gülümseyip, “Ya tutarsa!” demiş.',
  qs: [
    { q: 'Hoca’nın “Ya tutarsa!” düşüncesine katılan biri nedenini nasıl söyler?', a: '“Katılıyorum, çünkü denemeden bilemeyiz.”', w: ['“Katılıyorum.”', '“Göl mavidir.”', '“Bilmem.”'], ex: 'Görüşümüzü nedeniyle birlikte söyleriz: “çünkü …”' },
    { q: 'Hoca’nın düşüncesine katılmayan biri nedenini nasıl söyler?', a: '“Katılmıyorum, çünkü göl suyu yoğurt olmaz.”', w: ['“Katılmıyorum.”', '“Hoca göle gitti.”', '“Maya beyazdır.”'], ex: 'Katılmasak da nedenini kibarca söyleriz.' },
    { q: 'Fıkradaki “Ya tutarsa!” sözü neyi anlatır?', a: 'Umudu kaybetmemeyi', w: ['Gölü kirletmeyi', 'Yoğurdu sevmemeyi', 'Yüzmeyi'], ex: 'Hoca umudunu kaybetmiyor.' },
  ],
}
const BAYRAM_SOZ_D: Dinleme = {
  t: 'Bayram Sofrası',
  img: 'party',
  text: 'Bayram sabahı herkes erkenden kalktı. Bayramlıklarımızı giyip büyüklerimizin elini öptük. Komşularımız bize şeker ikram etti. Annem, “Bayramlar insanları birleştirir.” dedi.',
  qs: [
    { q: 'Annenin “Bayramlar insanları birleştirir.” görüşüne katılan biri ne der?', a: '“Katılıyorum, çünkü bayramda herkes bir araya gelir.”', w: ['“Katılıyorum.”', '“Şeker tatlıdır.”', '“Sabah erken oldu.”'], ex: 'Görüşe katılırken nedenini de söyleriz.' },
    { q: 'Görüşümüzün nedenini söylerken hangi sözcüğü kullanırız?', a: 'çünkü', w: ['sonra', 'ile', 've'], ex: '“Çünkü” nedeni bildirir.' },
  ],
}
const GORUS_YAZ_Q: Q[] = [
  { q: '“Kültürümüzü yaşatmalıyız.” görüşüne katıldığını en iyi yazan cümle hangisi?', a: 'Katılıyorum, çünkü kültürümüz bizi biz yapar.', w: ['Katılıyorum.', 'Kültür.', 'Bilmiyorum.'], ex: 'Görüşümüzü nedeniyle yazarız.', img: 'scroll' },
  { q: '“Bayramlarda büyükler ziyaret edilmeli.” görüşüne katıldığını en iyi yazan cümle hangisi?', a: 'Katılıyorum, çünkü büyüklerimiz bizi görünce sevinir.', w: ['Katılıyorum.', 'Bayram üç gün sürer.', 'Büyükler.'], ex: '“Çünkü” ile nedenini yazarız.', img: 'oldwoman' },
  { q: '“Kitap okumak sıkıcıdır.” görüşüne katılmadığını en iyi yazan cümle hangisi?', a: 'Katılmıyorum, çünkü kitaplar bizi yeni yerlere götürür.', w: ['Katılmıyorum.', 'Kitap kâğıttan yapılır.', 'Sıkıcı.'], ex: 'Katılmadığımızda da nedenini yazarız.', img: 'book' },
  { q: '“Türkülerimizi öğrenmeliyiz.” görüşüne katıldığını en iyi yazan cümle hangisi?', a: 'Katılıyorum, çünkü türküler atalarımızdan kalan bir mirastır.', w: ['Katılıyorum.', 'Türkü.', 'Saz çalmak.'], ex: 'Neden önemli olduğunu yazarız.', img: 'guitar' },
  { q: '“Fıkralar yalnızca büyükler içindir.” görüşüne katılmadığını en iyi yazan cümle hangisi?', a: 'Katılmıyorum, çünkü fıkralar çocukları da güldürür ve düşündürür.', w: ['Katılmıyorum.', 'Hoca eşeğe binerdi.', 'Fıkra kısadır.'], ex: 'Görüşümüzü gerekçesiyle yazarız.', img: 'grin' },
]
const OKUMA_HATA_Q: Q[] = [
  { q: 'Ali okurken satır atladı, metni anlamadı. Hatası neydi?', a: 'Satır atlamak', w: ['Başlığı okumak', 'Noktalamaya dikkat etmek', 'Uygun hızda okumak'], ex: 'Satır atlarsak anlam bozulur.', img: 'openbook' },
  { q: 'Ece soru işaretine dikkat etmeden düz okudu. Hatası neydi?', a: 'Noktalama işaretine dikkat etmemek', w: ['Yavaş okumak', 'Başlığa bakmak', 'Resmi incelemek'], ex: 'Noktalama işaretleri okuyuşumuzu yönlendirir.', img: 'pencil' },
  { q: 'Can çok hızlı okudu, ne okuduğunu hatırlamadı. Hatası neydi?', a: 'Çok hızlı okumak', w: ['Dikkatli okumak', 'Başlığa bakmak', 'Resmi incelemek'], ex: 'Uygun hızda okuruz.', img: 'stopwatch' },
  { q: 'Su sesli okurken o kadar kısık okudu ki kimse duymadı. Hatası neydi?', a: 'Sesini çok kısık tutmak', w: ['Başlığı okumak', 'Sözcükleri doğru okumak', 'Dik oturmak'], ex: 'Sesli okumada herkesin duyacağı bir ses kullanırız.', img: 'speaker' },
  { q: 'Mert sözcükleri tek tek heceleyerek okudu. Ne yapmalı?', a: 'Sözcükleri bütün olarak okumaya çalışmalı', w: ['Daha çok hecelemeli', 'Okumayı bırakmalı', 'Gözlerini kapatmalı'], ex: '2. sınıfta sözcükleri hecelemeden okumaya çalışırız.', img: 'boy' },
]
const OKUMA_TF: TF[] = [
  ['Okurken noktalama işaretlerine dikkat ederiz.', true, 'Noktalama okuyuşumuzu yönlendirir.'],
  ['Anlamak için olabildiğince hızlı okumalıyız.', false, 'Anlamak için uygun hızda okuruz.'],
  ['Sesli okurken herkesin duyacağı bir sesle okuruz.', true, 'Anlaşılır bir ses kullanırız.'],
  ['Okurken parmağımızla satırı takip edebiliriz.', true, 'Böylece satır atlamayız.'],
  ['Kitabı gözümüze çok yaklaştırarak okuruz.', false, 'Kitapla gözümüz arasında uygun bir uzaklık olmalı.'],
]

/* ---------- Tema 8 ---------- */
const TUR_Q: Q[] = [
  { q: 'Sınıf başkanlığına aday oldun. Seçim konuşmanda ne söylersin?', a: '“Seçilirsem sınıfımıza bir kitap köşesi kuracağım.”', w: ['“Dün parka gittim.”', '“En sevdiğim yemek mantı.”', '“Kedim çok uyur.”'], ex: 'Seçim konuşmasında ne yapacağımızı anlatırız.', img: 'raisedhand' },
  { q: 'Seçim konuşması nasıl bitirilir?', a: '“Beni seçerseniz sınıfımız için çalışacağım.”', w: ['“Neyse, ben gidiyorum.”', '“Bana ne!”', '“Hiç ilgilenmiyorum.”'], ex: 'Seçim konuşmasını bir söz ve teşekkürle bitiririz.', img: 'medal' },
  { q: 'Bir arkadaşınla sohbet ederken nasıl konuşursun?', a: 'Sırayla, karşılıklı konuşarak', w: ['Onu hiç dinlemeden', 'Tek başıma durmadan', 'Kâğıttan okuyarak'], ex: 'Sohbette karşılıklı ve sırayla konuşuruz.', img: 'friends' },
  { q: 'Röportaj yaparken ne yaparız?', a: 'Sorular sorup cevapları dinleriz', w: ['Hiç soru sormayız', 'Sadece biz konuşuruz', 'Şarkı söyleriz'], ex: 'Röportaj soru–cevap biçiminde yapılır.', img: 'microphone' },
  { q: 'Sınıfa bir kitabı tanıtıyorsun. Ne söylersin?', a: 'Kitabın adını, konusunu ve neden sevdiğimi', w: ['Kitabın kaç gram olduğunu', 'Dün ne yediğimi', 'Hiçbir şey söylemem'], ex: 'Tanıtım konuşmasında ad, konu ve görüşümüzü söyleriz.', img: 'book' },
  { q: 'Bir teşekkür konuşması yapıyorsun. Hangisi uygun?', a: '“Bana yardım ettiğiniz için hepinize teşekkür ederim.”', w: ['“Hadi dağılın!”', '“Bugün hava güzel.”', '“Benim kalemim mavi.”'], ex: 'Teşekkür konuşması teşekkür sözüyle yapılır.', img: 'heart' },
]
const OKUMA_ORTAM_Q: Q[] = [
  { q: 'Hangi ortam okumayı kolaylaştırır?', a: 'Aydınlık ve sessiz bir oda', w: ['Karanlık bir köşe', 'Gürültülü bir pazar', 'Sallanan bir salıncak'], ex: 'Aydınlık ve sessiz ortam okumayı kolaylaştırır.', img: 'bulb' },
  { q: 'Ece gürültülü bir yerde okudu, metni anlamadı. Neden?', a: 'Gürültü dikkatini dağıttı', w: ['Kitap çok güzeldi', 'Oda aydınlıktı', 'Ortam sessizdi'], ex: 'Ortam okumamızı etkiler.', img: 'speaker' },
  { q: 'Loş ışıkta okumak gözlerimize ne yapar?', a: 'Gözlerimizi yorar', w: ['Gözlerimizi dinlendirir', 'Daha hızlı okutur', 'Hiçbir şey yapmaz'], ex: 'Yeterli ışıkta okuruz.', img: 'eye' },
  { q: 'Çok sıcak ve havasız bir odada okursak ne olabilir?', a: 'Çabuk yorulur, uykumuz gelir', w: ['Daha iyi anlarız', 'Hiç yorulmayız', 'Kitap kısalır'], ex: 'Odayı havalandırırsak daha iyi okuruz.', img: 'thermometer' },
  { q: 'Rahat bir sandalye okumayı nasıl etkiler?', a: 'Rahatça uzun süre okumamızı sağlar', w: ['Okumayı zorlaştırır', 'Gözümüzü yorar', 'Uykumuzu kaçırır'], ex: 'Doğru oturuş okumayı kolaylaştırır.', img: 'seat' },
  { q: 'Kütüphanede neden sessiz olunur?', a: 'Herkes dikkatle okuyabilsin diye', w: ['Kitaplar uyusun diye', 'Işıklar sönsün diye', 'Kütüphane kapansın diye'], ex: 'Sessizlik okuma ortamını güzelleştirir.', img: 'books' },
]
const OLUMLU_Q: Q[] = [
  { q: 'Ali başlığı ve resmi inceleyince metni daha iyi anladı. Bir sonraki okumasında ne yapmalı?', a: 'Yine önce başlığı ve resmi incelemeli', w: ['Başlığı hiç okumamalı', 'Resimleri kapatmalı', 'Sondan başlamalı'], ex: 'İşe yarayan davranışı sonraki okumalarda da sürdürürüz.', img: 'openbook' },
  { q: 'Ece parmağıyla satırı takip edince hiç satır atlamadı. Bundan sonra ne yapmalı?', a: 'Bu yolu sonraki okumalarında da kullanmalı', w: ['Bir daha hiç yapmamalı', 'Gözlerini kapatarak okumalı', 'Satırları atlayarak okumalı'], ex: 'Olumlu davranışlarımızı sürdürürüz.', img: 'hand' },
  { q: 'Can bilmediği sözcüğe sözlükten bakınca metni anladı. Bundan sonra ne yapar?', a: 'Bilmediği sözcüklere yine sözlükten bakar', w: ['Bilmediği sözcükleri atlar', 'Okumayı bırakır', 'Sözlüğü saklar'], ex: 'Sözlük kullanma alışkanlığı okumamızı güçlendirir.', img: 'magnifier' },
  { q: 'Zeynep sesli okurken noktalamaya dikkat edince çok güzel okudu. Ne yapmalı?', a: 'Her okumasında bunu sürdürmeli', w: ['Bunu hemen unutmalı', 'Noktalamaya bakmamalı', 'Bir daha sesli okumamalı'], ex: 'Güzel okuma alışkanlığımızı sürdürürüz.', img: 'girl' },
  { q: 'Okurken işe yarayan iyi alışkanlıklarımızı ne yaparız?', a: 'Sonraki okumalarımızda da uygularız', w: ['Unuturuz', 'Bir kez yapıp bırakırız', 'Başkasına veririz'], ex: 'İyi alışkanlıklar okumamızı geliştirir.', img: 'star' },
]
const YPLAN_O: O[] = [
  { q: 'Yazma planı hazırla. Sırala.', s: ['Konuyu belirlerim', 'Ana düşünceleri not alırım', 'Plana göre yazarım', 'Yazımı gözden geçiririm'], ex: 'Önce plan, sonra yazı, en sonda kontrol.', img: 'notebook' },
  { q: 'Muhtarlığa öneri yazısı için sırala.', s: ['Önerimi belirlerim', 'Nedenlerini not alırım', 'Yazımı yazarım', 'Okuyup düzeltirim'], ex: 'Planlı yazarsak düşüncelerimiz düzenli olur.', img: 'memo' },
]
const YPLAN_Q: Q[] = [
  { q: 'Yazma planında “Kime” bölümüne ne yazılır?', a: 'Yazıyı kimin okuyacağı', w: ['Yazının tarihi', 'Yazının konusu', 'Kalemin rengi'], ex: 'Kime: yazımızı kime yazdığımız.', img: 'memo' },
  { q: 'Yazma planında hangisi yer almaz?', a: 'Telefon numaram', w: ['Konu', 'Kime yazacağım', 'Ana düşünceler'], ex: 'Planda kişisel bilgi olmaz; konu, kime ve ana düşünceler olur.', img: 'notebook' },
  { q: '“Sokak hayvanlarına yardım” yazısının planında hangisi ana düşünce olabilir?', a: 'Bir büyükle birlikte su kabı koyabiliriz.', w: ['Futbol takımım çok iyi.', 'Dün yağmur yağdı.', 'Pizzayı çok severim.'], ex: 'Ana düşünceler konuyla ilgili olmalı.', img: 'cat' },
  { q: 'Yazma planı neden hazırlanır?', a: 'Yazacaklarımızı düzenli sıralamak için', w: ['Yazıyı karıştırmak için', 'Hiç yazmamak için', 'Kâğıdı süslemek için'], ex: 'Plan yazımızı düzenler.', img: 'thinking' },
]
const HEDEF_Q: Q[] = [
  { q: 'Muhtara öneri yazısı yazıyorsun. Nasıl başlarsın?', a: 'Sayın Muhtarımız,', w: ['Hey muhtar,', 'Kanka,', 'Selam dostum,'], ex: 'Okuyacak kişiye uygun, saygılı bir hitap seçeriz.', img: 'memo' },
  { q: 'Küçük kardeşine not yazıyorsun. Nasıl yazarsın?', a: 'Kısa ve kolay cümlelerle', w: ['Çok uzun ve zor sözcüklerle', 'Anlaşılmayacak biçimde', 'Hiç cümle kurmadan'], ex: 'Okuyacak kişiye göre yazarız.', img: 'baby' },
  { q: 'Okul müdürüne yazdığın mektubu nasıl bitirirsin?', a: 'Saygılarımla,', w: ['Bay bay!', 'Görüşürüz kanka!', 'Hadi eyvallah!'], ex: 'Büyüklerimize yazarken saygılı bir kapanış kullanırız.', img: 'school' },
  { q: 'Planında çocuk hakları üzerine üç düşünce var. Yazarken ne yaparsın?', a: 'Üç düşünceyi plandaki sırayla yazarım', w: ['Planı bir kenara atarım', 'Yalnızca başlığı yazarım', 'Başka bir konuyu yazarım'], ex: 'Hazırladığımız plana uygun yazarız.', img: 'notebook' },
  { q: 'Arkadaşına tatil önerisi yazıyorsun. Hangisi uygun?', a: 'Sevgili Ada, tatilde birlikte kitap okuyalım mı?', w: ['Sayın Yetkililer, kitap okuyalım mı?', 'Tatil.', 'Kitap oku!'], ex: 'Arkadaşımıza sıcak bir hitapla yazarız.', img: 'sun' },
]

const DKY_EK: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'dinle-iyilik', title: 'Dinle: İyilik Zinciri', icon: 'ear', total: T, meb: 'T.D.2.3.b', gen: dinle(IYILIK_D, NEZAKET_D), ders: 'Metin sesli okunacak, ekranda yazmaz. Dikkatle dinle: Metin ne anlatıyor?', points: ['Konuşana kulak ver', 'Kim, ne yaptı?', 'Metin en çok neyi anlatıyor?'], visual: img('ear') },
    { kind: 'dinle-oncesi', title: 'Dinle: Önce Ne Oldu?', icon: 'thinking', total: 5, meb: 'T.D.2.2.c', gen: dinle(...ONCESI_D), ders: 'Dinlediğin olaydan önce neler olmuş olabilir? İpuçlarını yakala, tahmin et.', visual: img('thinking') },
    { kind: 'dinle-sec', title: 'Ne Dinlesem?', icon: 'headphone', total: 5, meb: 'T.D.2.1.a', gen: ch(DINLE_SEC_Q), ders: 'Ne öğrenmek istediğine göre dinleyeceğini ya da izleyeceğini seç. İzlerken bir büyüğün yanında olsun.', visual: img('headphone') },
    { kind: 'dinleme-kurali', title: 'Dinleme Kuralları', icon: 'ear2', total: 5, meb: 'T.D.2.1.b', gen: rot(srt('Dinlerken ne yaparsın? Sepetlere ayır.', 'İyi dinleyici konuşana bakar, sessizce dinler, sözü bitince söz alır.', DINLEME_BINS, DINLEME_ITEMS), tf(DINLEME_TF, 'ear')), ders: 'Dinlerken konuşana bakarız, sözünü kesmeyiz, söz almak için parmak kaldırırız.', points: ['Konuşana bak', 'Sözü kesme', 'Parmak kaldır'], visual: img('ear2') },
    { kind: 'goz-temasi', title: 'Göz Teması', icon: 'eyes', total: 5, meb: 'T.K.2.1.ç', gen: ch(GOZ_Q), ders: 'Konuşurken dinleyenlere bakarız. Göz teması iletişimi güçlendirir.', visual: img('eyes') },
    { kind: 'okumaya-hazirlik', title: 'Okumaya Hazırlık', icon: 'openbook', total: 5, meb: 'T.O.2.1.a', gen: rot(ord(OKU_HAZIR_O), ch(OKU_HAZIR_Q)), ders: 'Okumadan önce başlığı ve resimleri incele, konuyu tahmin et.', visual: img('openbook') },
    { kind: 'yazmaya-hazirlik', title: 'Yazmaya Hazırlık', icon: 'memo', total: 5, meb: 'T.Y.2.1.a', gen: rot(ord(YAZ_HAZIR_O), ch(YAZ_HAZIR_Q)), ders: 'Yazmadan önce düşün, not al; yazdıktan sonra kontrol et.', visual: img('memo') },
    { kind: 'eksik-cumle', title: 'Eksik Cümle', icon: 'puzzle', total: T, meb: 'T.Y.2.2.a', gen: ch(EKSIK_CUMLE_Q), ders: 'Metinde bir cümle eksik. Önceki ve sonraki cümlelere bak, boşluğa uyanı seç.', visual: img('puzzle') },
    { kind: 'yarim-metin', title: 'Yarım Hikâye', icon: 'scroll', total: 5, meb: 'T.Y.2.2.b', gen: ch(YARIM_METIN_Q), ders: 'Hikâye yarım kaldı. Konusuna en uygun devamı seç.', visual: img('scroll') },
  ],
  t2: [
    { kind: 'gorselden-tahmin', title: 'Resimden Tahmin', icon: 'framed', total: 5, meb: 'T.D.2.2.b', gen: ch(GORSEL_TAHMIN_Q), ders: 'Dinlemeden önce resme bak. Metin ne hakkında olabilir?', visual: img('framed') },
    { kind: 'dinle-dusunce', title: 'Dinle: Ne Düşünüyorum?', icon: 'ear', total: 5, meb: 'T.D.2.2.ğ', gen: dinle(BAYRAM_D, ZAFER_D), ders: 'Metni dinle. Sonra dinlediğin hakkında düşünceni bildiren cümleyi bul. “Bence …” düşünce bildirir.', visual: img('ear') },
    { kind: 'dinle-yasanti', title: 'Dinle ve Karşılaştır', icon: 'school', total: 5, meb: 'T.D.2.2.a', gen: dinle(...YASANTI_D), ders: 'Dinlediklerini kendi yaşadıklarınla ve bildiklerinle karşılaştır.', visual: img('school') },
    { kind: 'benzer-farkli', title: 'Benzer mi, Farklı mı?', icon: 'friends', total: 5, meb: 'T.K.2.2.c', gen: oku(IKI_ARKADAS), ders: 'İki arkadaşı oku. Hangi yönleri benzer, hangi yönleri farklı?', visual: img('friends') },
    { kind: 'eksik-metin', title: 'Boşluğu Tahmin Et', icon: 'puzzle', total: T, meb: 'T.Y.2.2.ç', gen: ch(EKSIK_METIN_Q), ders: 'Metindeki ipuçlarına bak, eksik yeri tahmin et.', visual: img('puzzle') },
    { kind: 'ornek-ver', title: 'Örnek Verelim', icon: 'bulb', total: 5, meb: 'T.Y.2.2.l', gen: ch(ORNEK_Q), ders: 'Yazılarımızı örneklerle güçlendiririz: “Örneğin …”', visual: img('bulb') },
    { kind: 'ileti-karsilastir', title: 'Bildiklerimle Karşılaştır', icon: 'magnifier', total: 5, meb: 'T.O.2.2.d', gen: ch(ILETI_Q), ders: 'Okuduğun bilgi doğru mu? Bildiklerinle karşılaştır.', visual: img('magnifier') },
    { kind: 'konusma-hizi', title: 'Konuşma Hızı', icon: 'stopwatch', total: 5, meb: 'T.K.2.3.a', gen: ch(HIZ_Q), ders: 'Ne çok hızlı ne çok yavaş: herkesin anlayacağı hızda konuşuruz.', visual: img('stopwatch') },
  ],
  t3: [
    { kind: 'dinle-agac', title: 'Dinle: Sürprizli Ağaç', icon: 'ear', total: T, meb: 'T.D.2.3.b', gen: dinle(AGAC_D, ATIK_D), ders: 'Metni dikkatle dinle. Konusu ne? Neler oldu?', visual: img('ear') },
    { kind: 'konusma-amaci', title: 'Ne İçin Konuşuyorum?', icon: 'microphone', total: 5, meb: 'T.K.2.1.c', gen: ch(AMAC_Q), ders: 'Kutlamak, izin istemek, bilgi vermek, davet etmek: amacımıza göre konuşuruz.', visual: img('microphone') },
    { kind: 'konusma-duzelt', title: 'Hatamı Düzeltiyorum', icon: 'thinking', total: 5, meb: 'T.K.2.5.a', gen: ch(DUZELT_Q), ders: 'Konuşurken bir yanlış yaptığını fark edersen dur ve doğrusunu söyle.', visual: img('thinking') },
    { kind: 'gorselle-destek', title: 'Yazıma Resim Seç', icon: 'framed', total: 5, meb: 'T.Y.2.2.i', gen: ch(GORSEL_DESTEK_Q), ders: 'Yazımızı konuya uygun bir resimle destekleriz.', visual: img('framed') },
    { kind: 'acik-ileti', title: 'Açık ve Anlaşılır İleti', icon: 'laptop', total: 5, meb: 'T.Y.2.3.ç', gen: ch(EPOSTA_Q), ders: 'E-posta ve iletilerde mesajımızı birden çok cümleyle açıkça yazarız. Adres, telefon gibi kişisel bilgileri yazmayız.', visual: img('laptop') },
  ],
  t4: [
    { kind: 'dinle-gercek', title: 'Dinle: Gerçek mi, Hayal mi?', icon: 'ear', total: 5, meb: 'T.D.2.2.f', gen: dinle(HARF_D, KAPTAN_D), ders: 'Metni dinle. Hangi olaylar gerçek, hangileri hayal?', visual: img('ear') },
    { kind: 'dinleme-ortami', title: 'Dinleme Ortamı', icon: 'headphone', total: 5, meb: 'T.D.2.4.a', gen: ch(DINLEME_ORTAM_Q), ders: 'Dinlemeden önce ortamı gözden geçiririz: sessiz mi, rahat mı?', visual: img('headphone') },
    { kind: 'dinleme-hatalari', title: 'Dinlerken Hata Yaptım mı?', icon: 'ear2', total: 5, meb: 'T.D.2.5.a', gen: ch(DINLEME_HATA_Q), ders: 'Dinledikten sonra kendimize sorarız: Dikkatle dinledim mi? Hatam neydi?', visual: img('ear2') },
    { kind: 'jest-mimik', title: 'Jest ve Mimik', icon: 'theater', total: 5, meb: 'T.K.2.3.g', gen: ch(JEST_Q), ders: 'Konuşurken yüz ifademiz (mimik) ve el hareketlerimiz (jest) sözümüzü destekler.', visual: img('theater') },
    { kind: 'vurgu-tonlama', title: 'Vurgu ve Tonlama', icon: 'speaker', total: 5, meb: 'T.K.2.3.c', gen: ch(TONLAMA_Q), ders: 'Sevinci sevinçle, soruyu soran sesle, uyarıyı güçlü sesle söyleriz.', visual: img('speaker') },
    { kind: 'brosur-tablo', title: 'Broşür ve Tablo Okuyorum', icon: 'chart', total: 5, meb: 'T.O.2.3.ç', gen: oku(BROSUR, OKUMA_TABLO), ders: 'Broşür ve tablolardaki bilgileri dikkatle oku, soruları yanıtla.', visual: img('chart') },
  ],
  t5: [
    { kind: 'dinle-oyunlar', title: 'Dinle: Dedemin Oyunları', icon: 'ear', total: 5, meb: 'T.K.2.2.a', gen: dinle(OYUNLAR_D), ders: 'Metni dinle. Anlatırken bildiklerini de kullan.', visual: img('ear') },
    { kind: 'konusma-plani', title: 'Konuşma Planı', icon: 'memo', total: 5, meb: 'T.K.2.1.f', gen: rot(ord(KPLAN_O), ch(KPLAN_Q)), ders: 'Konuşma planında konu, dinleyiciler, süre ve anahtar sözcükler bulunur.', visual: img('memo') },
    { kind: 'plana-uygun', title: 'Dinleyicime Göre Konuşurum', icon: 'microphone', total: 5, meb: 'T.K.2.3.b', gen: ch(PLANA_UYGUN_Q), ders: 'Planımıza ve dinleyicilerimize uygun konuşuruz.', visual: img('microphone') },
    { kind: 'yazma-ortami', title: 'Yazma Ortamım', icon: 'notebook', total: 5, meb: 'T.Y.2.4.a', gen: ch(YAZ_ORTAM_Q), ders: 'Yazmadan önce ortamı gözden geçiririz: aydınlık, sessiz, düzenli mi?', visual: img('notebook') },
    { kind: 'anlamli-sozcuk', title: 'Doğru Sözcük', icon: 'pencil', total: T, meb: 'T.Y.2.2.f', gen: ch(ANLAMLI_Q), ders: 'Yazılarımızda cümleye uyan, anlamlı sözcükler kullanırız.', visual: img('pencil') },
  ],
  t6: [
    { kind: 'dinle-sahne', title: 'Dinle: Söz ve Resim', icon: 'ear', total: T, meb: 'T.D.2.3.ç', gen: dinle(YARIS_D, KAYIK_D), ders: 'Metni dinle. Duyduğun söz hangi resimle ilgili?', visual: img('ear') },
    { kind: 'konusma-ortami', title: 'Konuşma Ortamı', icon: 'microphone', total: 5, meb: 'T.K.2.4.a', gen: ch(KONUSMA_ORTAM_Q), ders: 'Konuşmadan önce ortama bakarız: Herkes duyabiliyor mu? Gürültü var mı?', visual: img('microphone') },
    { kind: 'baslik-tahmin', title: 'Başlıktan Konu Tahmini', icon: 'magnifier', total: 5, meb: 'T.O.2.2.b', gen: ch(BASLIK_Q), ders: 'Başlık ve resim, metnin konusu hakkında ipucu verir.', visual: img('magnifier') },
    { kind: 'olay-tahmin', title: 'Neler Olacak?', icon: 'thinking', total: 5, meb: 'T.O.2.2.c', gen: ch(OLAY_TAHMIN_Q), ders: 'Başlığa ve resme bakarak metinde geçebilecek olayları tahmin et.', visual: img('thinking') },
  ],
  t7: [
    { kind: 'konusma-uslubu', title: 'Konuya Göre Konuşurum', icon: 'microphone', total: 5, meb: 'T.K.2.1.a', gen: ch(USLUP_Q), ders: 'Bayramı neşeyle, marşı saygıyla, fıkrayı eğlenceyle anlatırız.', visual: img('microphone') },
    { kind: 'dinle-gorus', title: 'Dinle: Katılıyor muyum?', icon: 'ear', total: 5, meb: 'T.K.2.2.f', gen: dinle(FIKRA_D, BAYRAM_SOZ_D), ders: 'Metni dinle. Görüşe katılıyor musun? Nedenini “çünkü” ile söyle.', visual: img('ear') },
    { kind: 'gorus-yaz', title: 'Görüşümü Yazıyorum', icon: 'scroll', total: 5, meb: 'T.Y.2.2.h', gen: ch(GORUS_YAZ_Q), ders: 'Bir görüşe katılıp katılmadığımızı nedeniyle yazarız.', visual: img('scroll') },
    { kind: 'okuma-hatalari', title: 'Okurken Hata Yaptım mı?', icon: 'openbook', total: 5, meb: 'T.O.2.5.a', gen: rot(ch(OKUMA_HATA_Q), tf(OKUMA_TF, 'openbook')), ders: 'Okuduktan sonra kendimize sorarız: Satır atladım mı? Noktalamaya dikkat ettim mi?', visual: img('openbook') },
  ],
  t8: [
    { kind: 'konusma-turu', title: 'Seçim Konuşması', icon: 'raisedhand', total: 5, meb: 'T.K.2.1.b', gen: ch(TUR_Q), ders: 'Seçim konuşması, sohbet, röportaj, tanıtım: her konuşma türünde farklı konuşuruz.', visual: img('raisedhand') },
    { kind: 'okuma-ortami', title: 'Okuma Ortamım', icon: 'bulb', total: 5, meb: 'T.O.2.4.a', gen: ch(OKUMA_ORTAM_Q), ders: 'Işık, sessizlik ve rahat oturuş okumamızı kolaylaştırır.', visual: img('bulb') },
    { kind: 'iyi-aliskanlik', title: 'İyi Okuma Alışkanlıkları', icon: 'star', total: 5, meb: 'T.O.2.5.c', gen: ch(OLUMLU_Q), ders: 'Okurken işe yarayan davranışları sonraki okumalarımızda da sürdürürüz.', visual: img('star') },
    { kind: 'yazma-plani', title: 'Yazma Planı', icon: 'notebook', total: 5, meb: 'T.Y.2.1.d', gen: rot(ord(YPLAN_O), ch(YPLAN_Q)), ders: 'Yazma planında konu, kime yazdığımız ve ana düşünceler bulunur.', visual: img('notebook') },
    { kind: 'kime-yaziyorum', title: 'Kime Yazıyorum?', icon: 'memo', total: 5, meb: 'T.Y.2.3.a', gen: ch(HEDEF_Q), ders: 'Yazıyı okuyacak kişiye ve planımıza uygun yazarız.', visual: img('memo') },
  ],
}
/** Temanın büyük oyununa (ilk oyun) eklenen dinleme/konuşma soruları */
const DKY_OYUN: Record<string, Gen> = {
  t1: dinle(IYILIK_D, NEZAKET_D),
  t2: dinle(BAYRAM_D, ZAFER_D),
  t3: dinle(AGAC_D, ATIK_D),
  t4: dinle(HARF_D, KAPTAN_D),
  t5: dinle(OYUNLAR_D),
  t6: dinle(YARIS_D, KAYIK_D),
  t7: dinle(FIKRA_D, BAYRAM_SOZ_D),
  t8: ch(TUR_Q),
}

for (const t of TR2_ADALAR) {
  const ek = [...(YAZIM_EK[t.id] ?? []), ...(DKY_EK[t.id] ?? [])]
  const kinds = new Set(t.acts.map((a) => a.kind))
  const yeni = ek.map((a) => (kinds.has(a.kind) ? { ...a, kind: `${a.kind}-2` } : a))
  const ekOyun = DKY_OYUN[t.id]
  const oyunlar = t.acts.filter((a) => a.oyun).map((a, i) => (i === 0 && ekOyun ? { ...a, gen: karma(a.gen, ekOyun) } : a))
  t.acts = [...t.acts.filter((a) => !a.oyun), ...yeni, ...oyunlar]
}
