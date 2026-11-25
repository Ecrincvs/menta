/**
 * 3. SINIF TÜRKÇE YOLU — 3. sınıf Türkçe ders kitabının 8 teması, her tema bir "ada":
 * okuma parçaları, sözlük, dil becerileri (eş/zıt anlam, gerçek/mecaz, atasözü, deyim, benzetme,
 * neden–sonuç, bağlama ögeleri, zaman ifadeleri, çıkarım, pekiştirme, kısaltma ekleri, büyük harf),
 * olay sıralama, cümle kurma + temaya özel NOKTALAMA VE YAZIM bloğu + sonda 2 oyun.
 * Kaynak: docs/meb-kitaplar/analiz/turkce-3.md. Okuma parçaları analizin §4'teki özgün metinleridir;
 * kitap metni kopyalanmadı.
 * 3. sınıf sınırları (§3): eş sesli, -de/-ki, sözcük türleri, hece YOK.
 * Hassas konular (§5): kişisel veri istenmez, savaş/şiddet görseli yok, afetler yalnızca tanım/önlem,
 * gerçek kişilerin ağzına söz konmaz, 4 basamaklı yıl yok.
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
const ABC = 'abcçdefgğhıijklmnoöprsştuüvyz'.split('')
/** Kelime avı (en çok 7 harflik sözcükler) */
const avi = (words: string[], prompt: string): Gen => (rng) => wordSearch(rng, shuffle(rng, words).slice(0, 4), ABC, prompt)
/** Kısaltmaya gelen ek: [kısaltma, doğru ek, yanlış ekler, cümle (# = boşluk), açıklama] */
type Kis = [string, string, string[], string, string]
const kisaltma = (bank: Kis[]): Gen => (rng, _g, l, h) => {
  const [k, ek, yanlis, c, ac] = fresh(rng, bank, h, (x) => `Boşluğa hangisi gelir? “${x[3].replace('#', `${x[0]} …`)}”`)
  const a = `${k}’${ek}`
  const w = [...new Set([...yanlis.map((e) => `${k}’${e}`), `${k}${ek}`])].filter((x) => x !== a)
  return mkChoice(rng, { q: `Boşluğa hangisi gelir? “${c.replace('#', `${k} …`)}”`, a, w, ex: `${ac} Kısaltmaya gelen ek kesme işaretiyle ayrılır: ${c.replace('#', a)}` }, l)
}
/** Pekiştirme sorusu kalıbı */
const pekQ = (k: string, a: string, w: string[]): Q => ({ q: `“${k}” sözcüğünün pekiştirmeli hâli hangisi?`, a, w, ex: `${k} → ${a}. Pekiştirme anlamı kuvvetlendirir ve bitişik yazılır.` })

const T = 6 // tur sayısı
const OYUN = 8

/* ================================================================================================
 * TEMA 1 · DEĞERLERİMİZLE YAŞIYORUZ
 * ================================================================================================ */
const KAPI: Metin = {
  t: 'Kapıyı Tıklatan Kardeş',
  img: 'house',
  text: 'Zeynep, ağabeyi Mert’in odasından boya kalemi almak istedi. Kapı aralıktı ama Zeynep içeri hemen girmedi. Önce kapıyı tıklattı ve “Girebilir miyim?” diye sordu. Mert, “Gel tabii, sorduğun için teşekkür ederim.” dedi. Zeynep işi bitince kalemi yerine geri koydu. Akşam Mert de Zeynep’in odasına girerken kapıyı tıklattı. İki kardeş, birbirine saygı göstermenin evi daha huzurlu yaptığını fark etti.',
  qs: [
    { q: 'Zeynep içeri girmeden önce ne yaptı?', a: 'Kapıyı tıklattı', w: ['Hemen içeri girdi', 'Ağabeyini çağırdı', 'Kapıyı kapattı'], ex: 'Zeynep önce kapıyı tıklatıp izin istedi.' },
    { q: 'Mert, Zeynep’e neden teşekkür etti?', a: 'İzin istediği için', w: ['Kalem verdiği için', 'Odayı topladığı için', 'Ödevine yardım ettiği için'], ex: 'Mert, “sorduğun için teşekkür ederim” dedi.' },
    { q: 'Zeynep kalemi kullandıktan sonra ne yaptı?', a: 'Yerine geri koydu', w: ['Kendi çantasına koydu', 'Masada bıraktı', 'Arkadaşına verdi'], ex: 'Ödünç aldığımızı yerine koyarız.' },
    { q: 'Kapıyı Tıklatan Kardeş metninin ana fikri nedir?', a: 'Başkasının alanına saygı göstermeliyiz', w: ['Boya kalemleri çok renklidir', 'Kardeşler hep tartışır', 'Akşamları resim yapılır'], ex: 'Metin, kişisel alana saygıyı anlatıyor.' },
    { q: 'Bu metne başka hangi başlık uygun olur?', a: 'Önce İzin İste', w: ['Renkli Kalemler', 'Akşam Yemeği', 'Kayıp Oyuncak'], ex: 'Başlık metnin ana fikrine uygun olmalı.' },
  ],
}
const PARA: Metin = {
  t: 'Bahçedeki Para',
  img: 'coin',
  text: 'Emir, teneffüste okul bahçesinde katlanmış bir para buldu. Arkadaşı Kerem, “Kimse görmedi, sende kalsın.” dedi. Emir bir an düşündü, sonra parayı nöbetçi öğretmene götürdü. Öğretmen, parayı kaybeden öğrenciyi zil çalmadan buldu. Parası kaybolan küçük Ela, sevinçle Emir’e teşekkür etti. Kerem de “Doğru olanı sen yaptın.” diyerek arkadaşına gülümsedi.',
  qs: [
    { q: 'Emir bahçede ne buldu?', a: 'Para', w: ['Kalem', 'Top', 'Anahtar'], ex: 'Emir katlanmış bir para buldu.' },
    { q: 'Kerem, Emir’e ne önerdi?', a: 'Parayı saklamayı', w: ['Parayı öğretmene vermeyi', 'Parayı paylaşmayı', 'Parayı yere atmayı'], ex: 'Kerem “sende kalsın” dedi ama bu doğru değildi.' },
    { q: 'Emir parayı kime götürdü?', a: 'Nöbetçi öğretmene', w: ['Kantine', 'Annesine', 'Kerem’e'], ex: 'Bulduğumuzu bir büyüğe teslim ederiz.' },
    { q: 'Ela neden sevindi?', a: 'Parasına kavuştuğu için', w: ['Yeni para bulduğu için', 'Ödül aldığı için', 'Zil çaldığı için'], ex: 'Kaybettiği parası ona geri verildi.' },
    { q: 'Bahçedeki Para metninin ana fikri nedir?', a: 'Dürüst olmak herkesi mutlu eder', w: ['Teneffüs çok kısadır', 'Para her yerde bulunur', 'Arkadaşlar hep haklıdır'], ex: 'Emir’in dürüstlüğü herkesi mutlu etti.' },
  ],
}
const SOZ1_P: P[] = [
  ['kibir', 'Kendini üstün görme'],
  ['şen şakrak', 'Çok neşeli'],
  ['mis gibi', 'Çok güzel kokan'],
  ['avuç', 'Elin iç bölümü'],
  ['bilge', 'Çok bilgili ve akıllı'],
  ['gelip çatmak', 'Zamanı gelmek'],
  ['mütevazı', 'Alçak gönüllü'],
]
const SOZ1_Q: Q[] = [
  { q: 'Kelebek kibirli davranıp lavantaya yardım etmedi. “Kibir” ne demek?', a: 'Kendini üstün görme', w: ['Yardımseverlik', 'Utangaçlık', 'Korkaklık'], ex: 'Kibir, kendini başkalarından üstün görmektir.', img: 'butterfly' },
  { q: 'Serçeler şen şakrak ötüşüyordu. “Şen şakrak” ne demek?', a: 'Çok neşeli', w: ['Çok üzgün', 'Çok yorgun', 'Çok sessiz'], ex: 'Şen şakrak, çok neşeli demektir.', img: 'bird' },
  { q: 'Bahçe mis gibi kokuyordu. “Mis gibi” ne demek?', a: 'Çok güzel kokan', w: ['Kötü kokan', 'Hiç kokmayan', 'Çok soğuk'], ex: 'Mis gibi, çok güzel kokan demektir.', img: 'flower' },
  { q: 'Sonbahar gelip çattı, yapraklar döküldü. “Gelip çatmak” ne demek?', a: 'Zamanı gelmek', w: ['Çok uzakta olmak', 'Geri dönmek', 'Kaybolmak'], ex: 'Gelip çatmak, bir şeyin zamanının gelmesidir.', img: 'fallenleaf' },
  { q: 'Yaşlı ve bilge çınar, genç çama öğüt verdi. “Bilge” ne demek?', a: 'Çok bilgili ve akıllı', w: ['Çok genç', 'Çok kızgın', 'Çok küçük'], ex: 'Bilge, çok bilgili ve akıllı kişidir.', img: 'tree' },
  { q: 'Avucuna küçük bir taş aldı. “Avuç” ne demek?', a: 'Elin iç bölümü', w: ['Ayağın altı', 'Kolun üstü', 'Başın arkası'], ex: 'Avuç, elin iç bölümüdür.', img: 'hand' },
  { q: 'Çam ağacı gözyaşlarına hâkim olamadı. “Hâkim olamamak” ne demek?', a: 'Tutamamak', w: ['Saklamak', 'Silmek', 'Unutmak'], ex: 'Gözyaşlarına hâkim olamamak, onları tutamamaktır.', img: 'evergreen' },
]
const ZIT1_P: P[] = [
  ['güzel', 'çirkin'],
  ['kirletmek', 'temizlemek'],
  ['açmak', 'kapatmak'],
  ['erken', 'geç'],
  ['uyumak', 'uyanmak'],
  ['kibirli', 'alçak gönüllü'],
  ['gelmek', 'gitmek'],
  ['mutlu', 'üzgün'],
]
const SAYGI_BINS: SortQ['bins'] = [
  { id: 'saygi', label: 'Saygılı davranış', img: 'handshake', color: '#22c55e' },
  { id: 'saygisiz', label: 'Saygısız davranış', img: 'noentry', color: '#f97316' },
]
const SAYGI_ITEMS: SortQ['items'] = [
  { label: 'Kapıyı tıklatıp girmek', bin: 'saygi' },
  { label: 'İzin isteyerek almak', bin: 'saygi' },
  { label: 'Selam vermek', bin: 'saygi' },
  { label: 'Özür dilemek', bin: 'saygi' },
  { label: 'Sırasını beklemek', bin: 'saygi' },
  { label: 'Eşyayı yerine koymak', bin: 'saygi' },
  { label: 'İzinsiz odaya girmek', bin: 'saygisiz' },
  { label: 'Başkasının çantasını karıştırmak', bin: 'saygisiz' },
  { label: 'Söz kesmek', bin: 'saygisiz' },
  { label: 'Selamı almamak', bin: 'saygisiz' },
  { label: 'Bulduğunu saklamak', bin: 'saygisiz' },
]
const SAYGI_HIT = ['Girebilir miyim?', 'Teşekkür ederim', 'Özür dilerim', 'Günaydın', 'Lütfen', 'Rica ederim']
const SAYGI_WRONG = ['Çekil!', 'Ver şunu!', 'Sana ne!', 'Karışma!', 'Sus!']
const BUYUK1_Q: Q[] = [
  { q: 'Ülke adı hangisinde doğru yazılmış?', a: 'Lavanta Türkiye’de de yetişir.', w: ['Lavanta türkiye’de de yetişir.', 'lavanta Türkiye’de de yetişir.', 'Lavanta Türkiye’De de yetişir.'], ex: 'Cümle büyük harfle başlar; ülke adları büyük harfle yazılır: Türkiye.' },
  { q: '“ben” sözcüğü hangisinde doğru yazılmış?', a: 'Arda, Neşe ve ben metni dinledik.', w: ['Arda, Neşe ve Ben metni dinledik.', 'arda, neşe ve ben metni dinledik.'], ex: 'Cümle ortasındaki “ben” küçük harfle, kişi adları büyük harfle yazılır.' },
  { q: 'Şehir adı hangisinde doğru yazılmış?', a: 'Bilim insanı Ankara’ya geldi.', w: ['Bilim insanı ankara’ya geldi.', 'bilim insanı Ankara’ya geldi.', 'Bilim İnsanı ankara’ya geldi.'], ex: 'Şehir adları büyük harfle başlar: Ankara.' },
  { q: 'Dergi adı hangisinde doğru yazılmış?', a: 'Bilim Çocuk dergisini okudum.', w: ['bilim çocuk dergisini okudum.', 'Bilim çocuk Dergisini okudum.'], ex: 'Dergi adları büyük harfle başlar: Bilim Çocuk dergisi.' },
  { q: 'Hangisinde büyük harf yanlış kullanılmış?', a: 'Kelebek Çiçek tarlasında uçtu.', w: ['Kelebek çiçek tarlasında uçtu.', 'Ayşe çiçek tarlasında koştu.', 'Bahçede kelebekler uçtu.'], ex: '“çiçek” özel ad değildir; cümle ortasında küçük harfle yazılır.' },
  { q: 'Kişi adı hangisinde doğru yazılmış?', a: 'Nermin teyze bize su verdi.', w: ['nermin teyze bize su verdi.', 'Nermin Teyze Bize su verdi.'], ex: 'Kişi adı büyük harfle başlar: Nermin. “teyze” sözü küçük yazılır.' },
  { q: 'Okul adı hangisinde doğru yazılmış?', a: 'Papatya İlkokulunda okuyorum.', w: ['papatya ilkokulunda okuyorum.', 'Papatya ilkokulunda okuyorum.'], ex: 'Okul adlarının her sözcüğü büyük harfle başlar: Papatya İlkokulu.' },
]
const DUYGU1_Q: Q[] = [
  { q: '“Uyan artık, gün doğdu bak!” diyen serçe nasıl bir duygu içinde?', a: 'Neşe', w: ['Öfke', 'Korku', 'Üzüntü'], ex: 'Serçe cıvıl cıvıl, neşeyle sesleniyor.', img: 'bird' },
  { q: '“Seni böyle bırakamam.” diyen çocuk kuş yavrusuna ne duyuyor?', a: 'Merhamet', w: ['Kıskançlık', 'Öfke', 'Sıkıntı'], ex: 'Zor durumdaki canlıya acımak merhamettir.', img: 'chick' },
  { q: 'Kuşlar dallarına konunca çam ağacı ne hissetti?', a: 'Sevinç', w: ['Korku', 'Kızgınlık', 'Utanç'], ex: 'Çam ağacı çok sevindi.', img: 'evergreen' },
  { q: 'Kelebek hatasını anlayıp özür dilerken ne hissediyordu?', a: 'Pişmanlık', w: ['Gurur', 'Neşe', 'Kibir'], ex: 'Hatasını anlayan kişi pişmanlık duyar.', img: 'butterfly' },
  { q: 'Yardım ettiği komşusu teşekkür edince Bilge ne hissetti?', a: 'Mutluluk', w: ['Üzüntü', 'Korku', 'Yorgunluk'], ex: 'Yardım etmek insanı mutlu eder.', img: 'happy' },
  { q: 'Kuş yavrusu doğaya uçup gidince Elif ne hissetti?', a: 'Hem hüzün hem sevinç', w: ['Yalnızca öfke', 'Yalnızca korku', 'Hiçbir şey'], ex: 'Ayrıldığı için hüzünlü, kuş özgür kaldığı için sevinçliydi.', img: 'bird2' },
]
const ALFABE_O: O[] = [
  { q: 'Sözcükleri alfabetik sıraya diz.', s: ['günaydın', 'menekşe', 'selam', 'serçe'], ex: 'g, m, s… “selam” ile “serçe”de üçüncü harfe bakarız: l, r’den önce gelir.', img: 'abc' },
  { q: 'Doğa sözcüklerini alfabetik sıraya diz.', s: ['çınar', 'horoz', 'kelebek', 'lavanta'], ex: 'ç, h, k, l sırası.', img: 'abc' },
  { q: 'Değer sözcüklerini alfabetik sıraya diz.', s: ['adalet', 'saygı', 'sevgi', 'sorumluluk'], ex: 's ile başlayanlarda ikinci harfe bakarız: a, e, o.', img: 'abc' },
  { q: 'Bu sözcükleri alfabetik sıraya diz.', s: ['avuç', 'bilge', 'çam', 'dost'], ex: 'a, b, ç, d sırası.', img: 'abc' },
  { q: 'Ev sözcüklerini alfabetik sıraya diz.', s: ['kapı', 'kitap', 'oda', 'sürahi'], ex: '“kapı” ile “kitap”ta ikinci harfe bakarız: a, i’den önce gelir.', img: 'abc' },
]
const T1_O: O[] = [
  { q: 'Kapıyı Tıklatan Kardeş: olayları sırala.', s: ['Zeynep kalem almak istedi', 'Kapıyı tıklatıp izin istedi', 'Kalemi kullandı', 'Kalemi yerine koydu'], ex: 'Önce izin, sonra kullanım, en sonunda yerine koyma.', img: 'house' },
  { q: 'Bahçedeki Para: olayları sırala.', s: ['Emir parayı buldu', 'Kerem saklamasını söyledi', 'Emir öğretmene götürdü', 'Ela parasına kavuştu'], ex: 'Dürüstlük sonunda herkesi mutlu etti.', img: 'coin' },
  { q: 'Çam ağacının hikâyesini sırala.', s: ['Kuşlar çama konmuyordu', 'Çınarın yaprakları döküldü', 'Kuşlar kışın çama sığındı', 'Çam ağacı çok sevindi'], ex: 'Kış gelince çamın değeri anlaşıldı.', img: 'evergreen' },
  { q: 'Susayan çocukların hikâyesini sırala.', s: ['Kaykay yarışı yaptılar', 'Çok susadılar', 'Komşunun kapısına gittiler', 'İzinsiz girmeyip beklediler', 'Komşu su getirdi'], ex: 'Kapı açık olsa da izinsiz girmediler.', img: 'glass' },
  { q: 'Kuş yavrusunun hikâyesini sırala.', s: ['Elif yavru kuşu buldu', 'Annesiyle ona yuva hazırladı', 'Kuş iyileşti', 'Elif onu doğaya bıraktı'], ex: 'Merhametli davranış kuşu kurtardı.', img: 'bird' },
]
const T1_C: string[][] = [
  ['Kapıyı', 'tıklatıp', 'izin', 'isteriz.'],
  ['Dürüst', 'insanlar', 'güven', 'verir.'],
  ['Bulduğumuz', 'eşyayı', 'sahibine', 'veririz.'],
  ['Serçe', 'sabah', 'neşeyle', 'öttü.'],
  ['Büyüklerimize', 'saygıyla', 'selam', 'veririz.'],
  ['Çam', 'ağacı', 'kuşları', 'soğuktan', 'korudu.'],
]
const T1_TF: TF[] = [
  ['Başkasının odasına girmeden önce kapıyı tıklatırız.', true, 'İzin istemek saygının göstergesidir.'],
  ['Bulduğumuz bir eşyayı saklamak doğru bir davranıştır.', false, 'Bulduğumuz eşyayı sahibine ya da bir büyüğe veririz.'],
  ['Kibirli davranmak arkadaşlarımızı üzebilir.', true, 'Kendini üstün görmek ilişkileri bozar.'],
  ['Selam vermek güne neşeyle başlamamızı sağlar.', true, 'Selam insanları birbirine yaklaştırır.'],
  ['Hatasını anlayan birini asla affetmemeliyiz.', false, 'Özür dileyeni affetmek güzel bir davranıştır.'],
  ['Çam ağacının yaprakları kışın dökülmez.', true, 'Çamın iğne yaprakları kışın da dalda kalır.'],
  ['Komşumuzun kapısı açıksa izin almadan girebiliriz.', false, 'Kapı açık olsa bile izinsiz girmeyiz.'],
  ['Yaşlı komşumuza yardım etmek yardımseverliktir.', true, 'Yardım etmek hem onu hem bizi mutlu eder.'],
]

/* ================================================================================================
 * TEMA 2 · ATATÜRK VE KAHRAMANLARIMIZ
 * ================================================================================================ */
const FENER: Metin = {
  t: 'Bayram Fenerleri',
  img: 'candle',
  text: 'Cumhuriyet Bayramı’ndan bir gün önce sınıfça kâğıttan fenerler yaptık. Her fenerin üzerine bayrağımızın ay yıldızını çizdik. Akşam olunca ailelerimizle okul bahçesinde toplandık. Fenerlerimizi yakıp marşlar söyleyerek yürüdük. Dedem, “Cumhuriyet, bize emanet edilen en güzel armağandır.” dedi. O gece gökyüzü de fenerlerimiz gibi ışıl ışıldı.',
  qs: [
    { q: 'Çocuklar fenerleri ne için yaptı?', a: 'Cumhuriyet Bayramı için', w: ['Doğum günü için', 'Okul gezisi için', 'Kermes için'], ex: 'Fenerler Cumhuriyet Bayramı için yapıldı.' },
    { q: 'Fenerlerin üzerine ne çizdiler?', a: 'Ay yıldız', w: ['Güneş', 'Çiçek', 'Ağaç'], ex: 'Bayrağımızın ay yıldızını çizdiler.' },
    { q: 'Fener alayı ne zaman yapıldı?', a: 'Akşam', w: ['Sabah erkenden', 'Öğle arasında', 'Teneffüste'], ex: 'Akşam olunca bahçede toplandılar.' },
    { q: 'Dede cumhuriyeti neye benzetti?', a: 'Emanet edilen armağana', w: ['Parlak bir fenere', 'Büyük bir okula', 'Uzun bir yola'], ex: '“Bize emanet edilen en güzel armağan” dedi.' },
    { q: '“Gökyüzü fenerlerimiz gibi ışıl ışıldı.” cümlesinde ne yapılmıştır?', a: 'Benzetme', w: ['Soru sorulmuştur', 'Emir verilmiştir', 'Yer adı söylenmiştir'], ex: 'Gökyüzü “gibi” sözüyle fenerlere benzetilmiş.' },
    { q: 'Bayram Fenerleri metnindeki ana duygu nedir?', a: 'Coşku ve sevinç', w: ['Korku', 'Öfke', 'Üzüntü'], ex: 'Bayram coşkusu anlatılıyor.' },
  ],
}
const KITAPLIK: Metin = {
  t: 'Atatürk’ün Kitaplığı',
  img: 'books',
  text: 'Atatürk, küçük yaşlardan beri kitap okumayı çok severdi. Gittiği yerlere kitaplarını da götürür, okurken sayfaların kenarına notlar alırdı. Matematik, tarih ve şiir kitapları en sevdikleri arasındaydı. Yeni bir dil öğrenmek için de çok çalıştı. Okudukça yeni fikirler edindi ve ülkesi için büyük hayaller kurdu. Bugün onun kitaplığı, okumanın insana ne kadar güç verdiğini hatırlatıyor.',
  qs: [
    { q: 'Atatürk okurken ne yapardı?', a: 'Notlar alırdı', w: ['Müzik dinlerdi', 'Resim yapardı', 'Hep uyurdu'], ex: 'Sayfaların kenarına notlar alırdı.' },
    { q: 'Atatürk hangi kitapları çok severdi?', a: 'Matematik, tarih ve şiir', w: ['Yalnızca masal', 'Yalnızca yemek', 'Hiç kitap sevmezdi'], ex: 'Matematik, tarih ve şiir kitapları en sevdikleriydi.' },
    { q: 'Atatürk yeni bir dil öğrenmek için ne yaptı?', a: 'Çok çalıştı', w: ['Vazgeçti', 'Hiç uğraşmadı', 'Yalnızca dinledi'], ex: 'Yeni bir dil öğrenmek için çok çalıştı.' },
    { q: 'Atatürk okudukça ne oldu?', a: 'Yeni fikirler edindi', w: ['Kitaplardan sıkıldı', 'Her şeyi unuttu', 'Yorgun düştü'], ex: 'Okudukça yeni fikirler edindi.' },
    { q: 'Atatürk’ün Kitaplığı metninin ana fikri nedir?', a: 'Kitap okumak insana güç verir', w: ['Kitaplar çok ağırdır', 'Not almak gereksizdir', 'Tarih sıkıcıdır'], ex: 'Okumak insanı ve ülkesini geliştirir.' },
  ],
}
const KAVRAM2_P: P[] = [
  ['fedakârlık', 'Başkası için özveride bulunmak'],
  ['vatansever', 'Yurdunu çok seven kişi'],
  ['millî irade', 'Milletin ortak kararı'],
  ['cesaret', 'Korkmadan girişme gücü'],
  ['cumhuriyet', 'Milletin kendini yönetmesi'],
  ['kahraman', 'Cesur ve yiğit kişi'],
]
const SOZ2_P: P[] = [
  ['balo', 'Danslı ve süslü eğlence'],
  ['engin', 'Çok geniş'],
  ['övünç', 'Gurur duyma'],
  ['kuşak', 'Aynı yıllarda doğanlar'],
  ['flama', 'Küçük üçgen bayrak'],
  ['devasa', 'Dev gibi büyük'],
  ['bayramlık', 'Bayramda giyilen giysi'],
]
const SOZ2_Q: Q[] = [
  { q: 'Atatürk çocuk balosuna katıldı. “Balo” ne demek?', a: 'Danslı ve süslü eğlence', w: ['Bir top oyunu', 'Bir çeşit yemek', 'Okuldaki sınav'], ex: 'Balo, danslı ve özel giysili bir eğlencedir.', img: 'party' },
  { q: 'Çocukların engin sevgisi herkesi duygulandırdı. “Engin” ne demek?', a: 'Çok geniş', w: ['Çok dar', 'Çok kısa', 'Çok soğuk'], ex: 'Engin, ucu bucağı görünmeyecek kadar geniş demektir.', img: 'heart' },
  { q: 'Öğretmen öğrencilerinden övünçle söz etti. “Övünç” ne demek?', a: 'Gurur duyma', w: ['Utanma', 'Korkma', 'Kızma'], ex: 'Övünç, gurur duymaktır.', img: 'medal' },
  { q: 'Bahçe bayraklar ve flamalarla süslendi. “Flama” ne demek?', a: 'Küçük üçgen bayrak', w: ['Büyük bir çadır', 'Renkli bir balon', 'Uzun bir masa'], ex: 'Flama, küçük boyutlu bayraktır.', img: 'trflag' },
  { q: 'Bembeyaz çiçeklerden devasa çelenkler yapıldı. “Devasa” ne demek?', a: 'Dev gibi büyük', w: ['Minicik', 'Çok hafif', 'Çok eski'], ex: 'Devasa, dev gibi büyük demektir.', img: 'flower' },
  { q: 'Bayramlıklarımızı giyip törene gittik. “Bayramlık” ne demek?', a: 'Bayramda giyilen yeni giysi', w: ['Bayram şekeri', 'Bayram tatili', 'Bayram şarkısı'], ex: 'Bayramlık, bayramda giyilen giysidir.', img: 'tshirt' },
]
const ES2_P: P[] = [
  ['yurt', 'vatan'],
  ['yiğit', 'kahraman'],
  ['seda', 'ses'],
  ['kuvvetli', 'güçlü'],
  ['ufak', 'küçük'],
  ['düş', 'rüya'],
  ['mühim', 'önemli'],
  ['hür', 'özgür'],
]
const ES2_HIT = ['yurt – vatan', 'yiğit – kahraman', 'seda – ses', 'ufak – küçük', 'düş – rüya', 'mühim – önemli', 'hür – özgür']
const ES2_WRONG = ['cesur – korkak', 'genç – yaşlı', 'savaş – barış', 'zor – kolay', 'ilk – son']
const ZIT2_P: P[] = [
  ['cesur', 'korkak'],
  ['genç', 'yaşlı'],
  ['savaş', 'barış'],
  ['zafer', 'yenilgi'],
  ['zor', 'kolay'],
  ['özgür', 'tutsak'],
  ['sevinç', 'üzüntü'],
  ['ilk', 'son'],
]
const ZIT2_Q: Q[] = [
  { q: 'Genç yaşlı herkes törene katıldı. “genç” sözcüğünün zıt anlamlısı hangisi?', a: 'yaşlı', w: ['küçük', 'yeni', 'çocuk'], ex: 'genç – yaşlı zıt anlamlıdır.' },
  { q: '“cesur” sözcüğünün zıt anlamlısı hangisi?', a: 'korkak', w: ['yiğit', 'kahraman', 'güçlü'], ex: 'cesur – korkak zıt anlamlıdır; yiğit ise eş anlamlısıdır.' },
  { q: '“zafer” sözcüğünün zıt anlamlısı hangisi?', a: 'yenilgi', w: ['başarı', 'bayram', 'tören'], ex: 'zafer – yenilgi zıt anlamlıdır.' },
  { q: '“zor” sözcüğünün zıt anlamlısı hangisi?', a: 'kolay', w: ['güç', 'ağır', 'çetin'], ex: 'zor – kolay zıt anlamlıdır.' },
  { q: '“sevinç” sözcüğünün zıt anlamlısı hangisi?', a: 'üzüntü', w: ['mutluluk', 'neşe', 'coşku'], ex: 'sevinç – üzüntü zıt anlamlıdır.' },
  { q: 'Hangi çift zıt anlamlıdır?', a: 'savaş – barış', w: ['yurt – vatan', 'yiğit – kahraman', 'ses – seda'], ex: 'Anlamları birbirinin karşıtı olan sözcükler zıt anlamlıdır.' },
  { q: 'Hangi çift eş anlamlıdır?', a: 'kuvvetli – güçlü', w: ['ilk – son', 'özgür – tutsak', 'genç – yaşlı'], ex: 'Aynı anlama gelen sözcükler eş anlamlıdır.' },
]
const MEKTUP_O: O[] = [
  { q: 'Mektubun bölümlerini sırala.', s: ['Hitap', 'Giriş', 'Gelişme', 'Sonuç', 'Ad ve imza'], ex: 'Mektup hitapla başlar; giriş, gelişme ve sonuçla sürer; en sonda ad ve imza yer alır.' },
  { q: 'Mektup yazma adımlarını sırala.', s: ['Tarihi sağ üste yaz', 'Hitapla başla', 'Yazma nedenini söyle', 'Güzel bir dilekle bitir'], ex: 'Tarih sağ üstte durur; mektup hitapla başlar, dilekle biter.' },
  { q: 'Davetiyeyi sırala.', s: ['Sayın Veliler,', 'Resim sergimiz açılıyor.', 'Sizleri de bekliyoruz.', 'Tarih, saat ve yer'], ex: 'Davetiye hitapla başlar; ne olduğu, davet sözü ve tarih-saat-yer bilgisiyle biter.' },
  { q: 'Bayram mektubunun bölümlerini sırala.', s: ['Sevgili Dedeciğim,', 'Sana bayramımızı anlatmak istedim.', 'Okulumuzu bayraklarla süsledik.', 'Seni çok özledim, sevgiyle kal.'], ex: 'Hitap, giriş, gelişme, sonuç.' },
]
const MEKTUP_Q: Q[] = [
  { q: 'Mektup hangi bölümle başlar?', a: 'Hitap', w: ['Sonuç', 'İmza', 'Gelişme'], ex: 'Mektup “Sevgili …,” gibi bir hitapla başlar.' },
  { q: 'Mektubun yazılış nedeni hangi bölümde söylenir?', a: 'Giriş', w: ['Sonuç', 'İmza', 'Hitap'], ex: 'Giriş bölümünde neden yazdığımızı söyleriz.' },
  { q: 'Mektup nasıl bitirilir?', a: 'Güzel bir dilekle', w: ['Bir soruyla', 'Hitapla', 'Hiç bitirilmez'], ex: 'Sonuç bölümünde güzel bir dilek ya da “hoşça kal” yazılır.' },
  { q: 'İmza mektubun neresine atılır?', a: 'Sağ alt bölüme', w: ['Sol üst köşeye', 'Tam ortasına', 'Başlığın yanına'], ex: 'İmza kâğıdın sağ alt bölümüne atılır.' },
  { q: 'Hangisi doğru yazılmış bir hitaptır?', a: 'Sevgili Öğretmenim,', w: ['sevgili öğretmenim.', 'Sevgili Öğretmenim?', 'Hoşça kal öğretmenim'], ex: 'Hitap büyük harfle başlar ve virgülle biter.' },
  { q: 'Mektupta tarih nereye yazılır?', a: 'Sağ üst köşeye', w: ['En alta, imzanın altına', 'Hitaptan önce, sola', 'Hiç yazılmaz'], ex: 'Tarih sağ üst köşeye yazılır.' },
]
const OLAY2_BINS: SortQ['bins'] = [
  { id: 'hazirlik', label: 'Hazırlık olayı', img: 'tshirt', color: '#3b82f6' },
  { id: 'toren', label: 'Tören olayı', img: 'trflag', color: '#ef4444' },
]
const OLAY2_ITEMS: SortQ['items'] = [
  { label: 'Saçını taratmak', bin: 'hazirlik' },
  { label: 'Bayramlık giymek', bin: 'hazirlik' },
  { label: 'Çiçek toplamak', bin: 'hazirlik' },
  { label: 'Fener yapmak', bin: 'hazirlik' },
  { label: 'Halk oyunu çalışmak', bin: 'hazirlik' },
  { label: 'Marş söylemek', bin: 'toren' },
  { label: 'Alkış almak', bin: 'toren' },
  { label: 'Uygun adım yürümek', bin: 'toren' },
  { label: 'Saygı duruşu', bin: 'toren' },
  { label: 'Şiir okumak', bin: 'toren' },
]
const KITAP_TUR_P: P[] = [
  ['Matematik kitabı', 'Problem çözmeyi öğretir'],
  ['Tarih kitabı', 'Geçmişi anlatır'],
  ['Şiir kitabı', 'Duyguları dizelerle anlatır'],
  ['Dil kitabı', 'Yeni bir dil öğretir'],
  ['Sanat kitabı', 'Resim ve müziği tanıtır'],
  ['Bilim kitabı', 'Deney ve buluşları anlatır'],
]
const T2_O: O[] = [
  { q: 'Fener alayını sırala.', s: ['Kâğıttan fener yaptık', 'Ay yıldız çizdik', 'Akşam bahçede toplandık', 'Marşlarla yürüdük'], ex: 'Önce hazırlık, sonra kutlama.', img: 'candle' },
  { q: 'Ülkü’nün hikâyesini sırala.', s: ['Ülkü ayakkabıları gördü', 'Ayakkabıları siyaha boyadı', 'Atatürk ona kızmadı', 'Boya kalemleri hediye etti'], ex: 'Atatürk sabırlı davrandı ve Ülkü’nün yeteneğini fark etti.', img: 'shoe' },
  { q: 'Bayram hazırlığını sırala.', s: ['Halk oyununu çalıştık', 'Bayramlıkları giydik', 'Törene yürüdük', 'Oyunumuzu sergiledik'], ex: 'Hazırlıktan törene.', img: 'trflag' },
  { q: 'Bir mektubun yolculuğunu sırala.', s: ['Mektubu yazdık', 'Zarfa koyduk', 'Pul yapıştırdık', 'Postaya verdik'], ex: 'Mektup yazılır, zarflanır, pullanır ve postalanır.', img: 'memo' },
]
const T2_C: string[][] = [
  ['Atatürk', 'kitap', 'okumayı', 'çok', 'severdi.'],
  ['Bayramda', 'okulumuzu', 'bayraklarla', 'süsledik.'],
  ['Çocuklar', 'fenerlerle', 'marş', 'söyledi.'],
  ['Kahramanlarımızı', 'saygıyla', 'anıyoruz.'],
  ['Cumhuriyet', 'bize', 'değerli', 'bir', 'armağandır.'],
]
const T2_TF: TF[] = [
  ['Yurt ile vatan eş anlamlı sözcüklerdir.', true, 'İkisi de aynı anlama gelir.'],
  ['Cesur ile yiğit zıt anlamlı sözcüklerdir.', false, 'Cesur ile yiğit eş anlamlıdır; cesurun zıttı korkaktır.'],
  ['Mektup imza ile başlar.', false, 'Mektup hitapla başlar, imza en sondadır.'],
  ['Atatürk okurken notlar alırdı.', true, 'Kitapların kenarına notlar alırdı.'],
  ['Özel adlara gelen ekler kesme işaretiyle ayrılır.', true, 'Erzurum’da, Anadolu’nun.'],
  ['Cumhuriyet Bayramı 23 Nisan’da kutlanır.', false, 'Cumhuriyet Bayramı 29 Ekim’de kutlanır.'],
  ['Kısaltmalara gelen ekler kesme işaretiyle ayrılır.', true, 'PTT’ye, TDK’nın, kg’dan.'],
  ['Fedakârlık, başkası için özveride bulunmaktır.', true, 'Fedakârlıkları saygıyla anarız.'],
]
const KIS: Kis[] = [
  ['PTT', 'ye', ['ya', 'e'], 'Arkadaşım mektubunu # verdi.', 'PTT “pe-te-te” diye okunur; son ses “te” olduğu için ek “-ye” olur.'],
  ['TDK', 'nın', ['nin', 'in'], '# yeni sözlüğünü inceledik.', 'TDK “te-de-ka” diye okunur; son ses “ka” olduğu için ek “-nın” olur.'],
  ['MEB', 'e', ['a', 'ye'], 'Okulumuz # bağlı bir okuldur.', 'MEB “meb” diye okunur; ek “-e” olur.'],
  ['THY', 'den', ['dan', 'ten'], 'Teyzem # bilet aldı.', 'THY “te-ha-ye” diye okunur; son ses “ye” olduğu için ek “-den” olur.'],
  ['TRT', 'de', ['da', 'te'], 'Bu akşam # güzel bir belgesel var.', 'TRT “te-re-te” diye okunur; ek “-de” olur.'],
  ['TBMM', 'nin', ['nın', 'in'], 'Öğretmenimiz # açılışını anlattı.', 'TBMM “te-be-me-me” diye okunur; son ses “me” olduğu için ek “-nin” olur.'],
  ['kg', 'dan', ['den', 'tan'], 'Karpuz üç # ağırdı.', 'Küçük harfli kısaltmalarda ek, sözcüğün okunuşuna göre gelir: kilogramdan.'],
  ['km', 'yi', ['yı', 'i'], 'Evle okul arası iki # geçmez.', 'kilometreyi diye okunur.'],
  ['m', 'si', ['sı', 'i'], 'Kumaşın iki # kaç lira?', 'metresi diye okunur.'],
  ['g', 'lık', ['lik', 'luk'], 'Peynirler 250 # paketlere kondu.', 'gramlık diye okunur.'],
  ['TL', 'ye', ['ya', 'e'], 'Yeni kitabımı 150 # aldım.', 'TL “te-le” diye okunur; ek “-ye” olur.'],
  ['cm', 'lik', ['lık', 'luk'], 'Çantama 30 # bir cetvel koydum.', 'santimetrelik diye okunur.'],
]

/* ================================================================================================
 * TEMA 3 · DOĞAYI TANIYORUZ
 * ================================================================================================ */
const SINCAP: Metin = {
  t: 'Sincabın Kış Hazırlığı',
  img: 'squirrel',
  text: 'Sonbahar gelince minik sincap Çıtır kış hazırlığına başladı. Her sabah ormanda dolaşıp fındık ve meşe palamudu topladı. Topladıklarını ağaç kovuğundaki yuvasına taşıdı. Bir gün yağmur başladı ve Çıtır ıslanmamak için kovuğuna koştu. Kış geldiğinde orman bembeyaz karla örtüldü. Çıtır, sıcacık yuvasında biriktirdiği yiyeceklerle kışı rahat geçirdi.',
  qs: [
    { q: 'Çıtır kış hazırlığına ne zaman başladı?', a: 'Sonbaharda', w: ['İlkbaharda', 'Yazın', 'Kışın ortasında'], ex: 'Sonbahar gelince hazırlığa başladı.' },
    { q: 'Çıtır ormanda neler topladı?', a: 'Fındık ve meşe palamudu', w: ['Elma ve armut', 'Çiçek ve yaprak', 'Taş ve kum'], ex: 'Fındık ve meşe palamudu topladı.' },
    { q: 'Yağmur başlayınca Çıtır ne yaptı?', a: 'Kovuğuna koştu', w: ['Yağmurda oynadı', 'Nehre atladı', 'Uykuya daldı'], ex: 'Islanmamak için kovuğuna koştu.' },
    { q: 'Çıtır kışı neden rahat geçirdi?', a: 'Önceden yiyecek biriktirdiği için', w: ['Hiç kar yağmadığı için', 'Başka yere göç ettiği için', 'Arkadaşları yiyecek getirdiği için'], ex: 'Neden: yiyecek biriktirmesi. Sonuç: kışı rahat geçirmesi.' },
    { q: '“bembeyaz” sözcüğü “beyaz” sözcüğünü nasıl değiştirmiştir?', a: 'Anlamını kuvvetlendirmiştir', w: ['Zıt anlamlı yapmıştır', 'Anlamını küçültmüştür', 'Soru hâline getirmiştir'], ex: 'beyaz → bembeyaz: pekiştirme anlamı kuvvetlendirir.' },
  ],
}
const KOVA: Metin = {
  t: 'Musluktaki Kova',
  img: 'droplet',
  text: 'Defne dişlerini fırçalarken musluğu açık bırakırdı. Bir gün annesiyle küçük bir deney yaptılar. Musluğun altına bir kova koyup fırçalama boyunca akan suyu topladılar. Kova neredeyse yarısına kadar dolmuştu! Defne şaşırdı ve “Bu kadar su boşa mı gidiyordu?” dedi. O günden sonra dişlerini fırçalarken musluğu kapattı. Kovadaki suyla da balkondaki çiçekleri suladı.',
  qs: [
    { q: 'Defne’nin alışkanlığı neydi?', a: 'Musluğu açık bırakmak', w: ['Geç uyanmak', 'Dişlerini fırçalamamak', 'Çiçekleri sulamamak'], ex: 'Dişlerini fırçalarken musluğu açık bırakırdı.' },
    { q: 'Deneyde ne yaptılar?', a: 'Akan suyu kovada topladılar', w: ['Suyu ısıttılar', 'Kovayı boyadılar', 'Musluğu söktüler'], ex: 'Fırçalama boyunca akan suyu kovada topladılar.' },
    { q: 'Defne neden şaşırdı?', a: 'Çok su boşa aktığı için', w: ['Kova kırıldığı için', 'Su soğuk olduğu için', 'Musluk bozulduğu için'], ex: 'Kova yarısına kadar dolmuştu.' },
    { q: 'Defne kovadaki suyu ne yaptı?', a: 'Çiçekleri suladı', w: ['Lavaboya döktü', 'Kediye verdi', 'Dondurdu'], ex: 'Suyu boşa harcamadı, çiçekleri suladı.' },
    { q: 'Musluktaki Kova metninin ana fikri nedir?', a: 'Suyu tasarruflu kullanmalıyız', w: ['Kovalar çok kullanışlıdır', 'Dişler günde bir kez fırçalanır', 'Çiçekler çok su ister'], ex: 'Metin su tasarrufunu anlatıyor.' },
  ],
}
const SOZ3_P: P[] = [
  ['koloni', 'Birlikte yaşayan canlı topluluğu'],
  ['refah', 'Bolluk ve rahatlık'],
  ['hasar', 'Bir olayın verdiği zarar'],
  ['set', 'Suyu tutan duvar'],
  ['israf', 'Boşa harcama'],
  ['tasarruf', 'Tutumlu kullanma'],
  ['buharlaşmak', 'Suyun ısınıp havaya karışması'],
]
const CANLI_BINS: SortQ['bins'] = [
  { id: 'canli', label: 'Canlı', img: 'seedling', color: '#22c55e' },
  { id: 'cansiz', label: 'Cansız', img: 'rock', color: '#64748b' },
]
const CANLI_ITEMS: SortQ['items'] = [
  { label: 'salyangoz', bin: 'canli' },
  { label: 'mantar', bin: 'canli' },
  { label: 'karınca', bin: 'canli' },
  { label: 'sincap', bin: 'canli' },
  { label: 'çam ağacı', bin: 'canli' },
  { label: 'solucan', bin: 'canli' },
  { label: 'dürbün', bin: 'cansiz' },
  { label: 'toprak', bin: 'cansiz' },
  { label: 'örümcek ağı', bin: 'cansiz' },
  { label: 'taş', bin: 'cansiz' },
  { label: 'bulut', bin: 'cansiz' },
  { label: 'kova', bin: 'cansiz' },
]
const ZAMAN_BINS: SortQ['bins'] = [
  { id: 'gecmis', label: 'Geçmiş zaman', img: 'hourglass', color: '#a855f7' },
  { id: 'simdi', label: 'Şimdiki zaman', img: 'clock', color: '#22c55e' },
  { id: 'gelecek', label: 'Gelecek zaman', img: 'calendar', color: '#3b82f6' },
]
const ZAMAN_ITEMS: SortQ['items'] = [
  { label: 'Dün ormanda yürüdüm.', bin: 'gecmis' },
  { label: 'Geçen hafta piknik yaptık.', bin: 'gecmis' },
  { label: 'Dün çok kuş gördüm.', bin: 'gecmis' },
  { label: 'Sincaplar zıplıyor.', bin: 'simdi' },
  { label: 'Şu anda yürüyorum.', bin: 'simdi' },
  { label: 'Kuşlar ötüyor.', bin: 'simdi' },
  { label: 'Yarın ormana gideceğim.', bin: 'gelecek' },
  { label: 'Kuşlara yem vereceğim.', bin: 'gelecek' },
  { label: 'Hafta sonu koşacağım.', bin: 'gelecek' },
]
const ZAMAN_W = ['Geçmiş zaman', 'Şimdiki zaman', 'Gelecek zaman']
const zq = (q: string, a: string, ex: string): Q => ({ q, a, w: ZAMAN_W.filter((x) => x !== a), ex })
const ZAMAN_Q: Q[] = [
  zq('“Dün ormanda birçok kuş gördüm.” Bu cümle hangi zamanı anlatır?', 'Geçmiş zaman', '“Dün” ve “gördüm” olayın önceden olduğunu anlatır.'),
  zq('“Şu anda ormanda yürüyorum.” Bu cümle hangi zamanı anlatır?', 'Şimdiki zaman', '“Şu anda” ve “yürüyorum” olayın şimdi olduğunu anlatır.'),
  zq('“Yarın kuşlara yem vereceğim.” Bu cümle hangi zamanı anlatır?', 'Gelecek zaman', '“Yarın” ve “vereceğim” olayın ileride olacağını anlatır.'),
  zq('“Geçen yaz göle gittik.” Bu cümle hangi zamanı anlatır?', 'Geçmiş zaman', '“Geçen yaz” geçmişi anlatır.'),
  zq('“Yağmur yağıyor.” Bu cümle hangi zamanı anlatır?', 'Şimdiki zaman', '“yağıyor” şu anda olan bir olaydır.'),
  zq('“Hafta sonu fidan dikeceğiz.” Bu cümle hangi zamanı anlatır?', 'Gelecek zaman', '“dikeceğiz” ileride olacak bir iştir.'),
]
const ES3_P: P[] = [
  ['hedef', 'amaç'],
  ['vakit', 'zaman'],
  ['vazife', 'görev'],
  ['çabuk', 'hızlı'],
  ['yuva', 'barınak'],
  ['destek', 'yardım'],
  ['sevinç', 'mutluluk'],
  ['tane', 'adet'],
]
const ZIT3_HIT = ['gündüz – gece', 'ağlamak – gülmek', 'zengin – fakir', 'küçük – büyük', 'güçlü – zayıf', 'ufak – iri', 'sıcak – soğuk']
const ZIT3_WRONG = ['hızlı – çabuk', 'yuva – barınak', 'vakit – zaman', 'hedef – amaç', 'görev – vazife']
const AFET_P: P[] = [
  ['Sel', 'Suların taşması'],
  ['Çığ', 'Kar kütlesinin kayması'],
  ['Heyelan', 'Toprağın yamaçtan kayması'],
  ['Fırtına', 'Çok şiddetli rüzgâr'],
  ['Yanardağ', 'Ateş püskürten dağ'],
  ['Orman yangını', 'Ağaçları saran büyük ateş'],
]
const ATA3_Q: Q[] = [
  { q: '“Birlikten kuvvet doğar.” atasözü ne anlatır?', a: 'Birlikte çalışan güçlü olur', w: ['Tek başına çalışmak daha iyidir', 'Kuvvetli olan hep kazanır', 'Yalnız kalmak güç verir'], ex: 'Birlik olan insanlar zorlukları daha kolay yener.', img: 'ant' },
  { q: '“Damlaya damlaya göl olur.” atasözü ne anlatır?', a: 'Küçük birikimler zamanla çoğalır', w: ['Göller damladan yapılmaz', 'Yağmur hiç durmaz', 'Su boşa akmalıdır'], ex: 'Az az biriktirilen şeyler zamanla çok olur.', img: 'droplet' },
  { q: 'Karıncaların iş bölümünü en iyi anlatan atasözü hangisi?', a: 'Birlikten kuvvet doğar.', w: ['Damlaya damlaya göl olur.', 'Ağaç yaşken eğilir.', 'Ayağını yorganına göre uzat.'], ex: 'Karıncalar birlikte çalışarak güçlü olur.', img: 'ant' },
  { q: 'Su biriktiren Defne için hangi atasözü uygundur?', a: 'Damlaya damlaya göl olur.', w: ['Birlikten kuvvet doğar.', 'Gülme komşuna, gelir başına.', 'Ağaç yaşken eğilir.'], ex: 'Biriken damlalar kovayı doldurdu.', img: 'droplet' },
  { q: 'Hayvanlar el birliğiyle nehre set yaptı. Hangi atasözü uygundur?', a: 'Bir elin nesi var, iki elin sesi var.', w: ['Ağaç yaşken eğilir.', 'Ayağını yorganına göre uzat.', 'Damlaya damlaya göl olur.'], ex: 'Tek başına yapılamayan iş birlikte yapılır.', img: 'wood' },
  { q: '“Bakarsan bağ olur, bakmazsan dağ olur.” atasözü ne anlatır?', a: 'Emek verilen yer güzelleşir', w: ['Dağlar bağdan güzeldir', 'Bahçeye bakmak gerekmez', 'Dağa çıkmak gerekir'], ex: 'Bakım ve emek bir yeri güzelleştirir.', img: 'plant' },
]
const T3_O: O[] = [
  { q: 'Su damlasının yolculuğunu sırala.', s: ['Denizde süzülüyordu', 'Isınıp buhar oldu', 'Bulutun parçası oldu', 'Yağmurla toprağa düştü', 'Tohumu filizlendirdi'], ex: 'Su döngüsü: buharlaşma, bulut, yağış.', img: 'droplet' },
  { q: 'Su damlası deneyini sırala.', s: ['Poşete biraz su koy', 'Poşetin ağzını kapat', 'Poşeti güneşe koy', 'Bekle ve gözlemle'], ex: 'Yönergeler adım adım uygulanır.', img: 'sun' },
  { q: 'Hayvanların set yapmasını sırala.', s: ['Durmadan yağmur yağdı', 'Kunduz bir plan önerdi', 'Ağaçlar dallarını verdi', 'Hayvanlar seti ördü', 'Set ormanı korudu'], ex: 'Birlikte çalışan hayvanlar ormanı korudu.', img: 'storm' },
  { q: 'Çıtır’ın kış hazırlığını sırala.', s: ['Sonbahar geldi', 'Fındık topladı', 'Yuvasına taşıdı', 'Kışı rahat geçirdi'], ex: 'Önceden hazırlanan rahat eder.', img: 'squirrel' },
  { q: 'Bir çiçeğin büyümesini sırala.', s: ['Tohum toprağa düştü', 'Yağmur toprağı ıslattı', 'Tohum filizlendi', 'Çiçek açtı'], ex: 'Su, tohumun filizlenmesini sağlar.', img: 'seedling' },
]
const T3_C: string[][] = [
  ['Karıncalar', 'iş', 'bölümü', 'yapar.'],
  ['Orman', 'birçok', 'canlının', 'evidir.'],
  ['Suyu', 'tasarruflu', 'kullanmalıyız.'],
  ['Kunduz', 'nehre', 'set', 'yaptı.'],
  ['Yarın', 'ormana', 'fidan', 'dikeceğiz.'],
  ['Bulutlar', 'soğuyunca', 'yağmur', 'yağar.'],
]
const T3_TF: TF[] = [
  ['Mantar bir canlıdır.', true, 'Mantar büyür ve beslenir; canlıdır.'],
  ['“Yarın ormana gideceğim.” cümlesi geçmiş zamanı anlatır.', false, '“Yarın” gelecek zamanı anlatır.'],
  ['Karıncalar topluluk hâlinde yaşar.', true, 'Karıncalar iş bölümü yaparak birlikte yaşar.'],
  ['“hızlı” ile “çabuk” zıt anlamlıdır.', false, 'hızlı ile çabuk eş anlamlıdır.'],
  ['Ormanlar selleri önlemeye yardım eder.', true, 'Ağaç kökleri suyu ve toprağı tutar.'],
  ['Dişlerimizi fırçalarken musluğu açık bırakmalıyız.', false, 'Suyu boşa akıtmamak için musluğu kapatırız.'],
  ['Isınan su buharlaşarak havaya yükselir.', true, 'Su döngüsü böyle başlar.'],
  ['“gündüz” ile “gece” zıt anlamlıdır.', true, 'Anlamları birbirinin karşıtıdır.'],
]
const DOGA_KELIME = ['orman', 'karınca', 'bulut', 'damla', 'sincap', 'toprak', 'yağmur', 'kunduz']

/* ================================================================================================
 * TEMA 4 · BİLGİ HAZİNEMİZ
 * ================================================================================================ */
const KART: Metin = {
  t: 'Kütüphane Kartı',
  img: 'books',
  text: 'Ali, okul kütüphanesine ilk kez gittiğinde raflardaki kitaplara hayran kaldı. Kütüphaneci Ayten Hanım, kitapların konularına göre dizildiğini anlattı. Ali, uzay kitaplarının olduğu raftan bir kitap seçti. Kitabı ödünç almak için kütüphane kartını gösterdi. Ayten Hanım, kitabı iki hafta içinde getirmesini ve özenle kullanmasını istedi. Ali kitabı her akşam biraz okudu ve zamanında geri götürdü.',
  qs: [
    { q: 'Kitaplar raflara neye göre dizilmişti?', a: 'Konularına göre', w: ['Renklerine göre', 'Boylarına göre', 'Kalınlıklarına göre'], ex: 'Kitaplar konularına göre dizilir.' },
    { q: 'Ali hangi raftan kitap seçti?', a: 'Uzay kitapları', w: ['Yemek kitapları', 'Spor kitapları', 'Masal kitapları'], ex: 'Ali uzay kitaplarının rafından seçti.' },
    { q: 'Ali kitabı almak için ne gösterdi?', a: 'Kütüphane kartını', w: ['Okul çantasını', 'Defterini', 'Kalemini'], ex: 'Ödünç almak için kütüphane kartı gösterilir.' },
    { q: 'Ali kitabı ne zaman geri getirmeliydi?', a: 'İki hafta içinde', w: ['Bir yıl sonra', 'Hiç getirmemeliydi', 'Ertesi sabah'], ex: 'Kütüphaneci iki hafta süre verdi.' },
    { q: 'Kütüphane Kartı metninin ana fikri nedir?', a: 'Ödünç kitabı özenle kullanıp zamanında veririz', w: ['Uzay çok uzaktır', 'Kütüphaneler çok büyüktür', 'Kitaplar çok ağırdır'], ex: 'Kütüphane kitaplarını özenle kullanırız.' },
  ],
}
const SAYFA: Metin = {
  t: 'Uçan Sayfalar',
  img: 'owl',
  text: 'Elif bir gece kitabını yastığının yanına koyup uyudu. Rüyasında kitabın sayfaları kanat açıp uçmaya başladı. Sayfalar onu bir masal ülkesine götürdü. Orada konuşan bir baykuş, Elif’e yeni sözcükler öğretti. Sabah uyandığında Elif kitabını yerinde buldu. Gülümseyerek “Bu gece de yeni bir macera okuyacağım.” dedi.',
  qs: [
    { q: 'Elif kitabını nereye koyup uyudu?', a: 'Yastığının yanına', w: ['Çantasına', 'Rafa', 'Masanın altına'], ex: 'Kitabını yastığının yanına koydu.' },
    { q: 'Uçan Sayfalar metninde hangisi hayal ürünüdür?', a: 'Sayfaların kanat açıp uçması', w: ['Elif’in kitap okuması', 'Elif’in sabah uyanması', 'Kitabın yastık yanında durması'], ex: 'Sayfalar gerçekte uçamaz; bu bir rüyadır.' },
    { q: 'Baykuş Elif’e ne öğretti?', a: 'Yeni sözcükler', w: ['Uçmayı', 'Şarkı söylemeyi', 'Resim yapmayı'], ex: 'Baykuş yeni sözcükler öğretti.' },
    { q: 'Elif sabah kitabını nerede buldu?', a: 'Yerinde', w: ['Masal ülkesinde', 'Bahçede', 'Baykuşun yuvasında'], ex: 'Kitap yerindeydi; uçuş bir rüyaydı.' },
    { q: 'Uçan Sayfalar metninin ana fikri nedir?', a: 'Kitaplar hayal gücümüzü geliştirir', w: ['Baykuşlar konuşabilir', 'Geceleri uyumamalıyız', 'Kitaplar uçabilir'], ex: 'Okumak hayal dünyamızı zenginleştirir.' },
  ],
}
const SOZ4_P: P[] = [
  ['cemre', 'Kış sonunda havanın ısınması'],
  ['derya', 'Deniz'],
  ['destan', 'Kahramanlık anlatan halk şiiri'],
  ['cehalet', 'Bilgisizlik'],
  ['pusula', 'Yön gösteren alet'],
  ['ilham', 'İçe doğan yaratıcı düşünce'],
  ['Kafdağı', 'Masallardaki hayalî dağ'],
]
const NEDEN4_Q: Q[] = [
  { q: 'Cümleyi tamamla: “Kütüphanede sessiz oluruz çünkü …”', a: 'okuyanları rahatsız etmek istemeyiz', w: ['kitaplar uyuyor', 'kütüphane çok büyük', 'sesimiz yorulur'], ex: '“çünkü”den sonra nedeni söyleriz.' },
  { q: 'Cümleyi tamamla: “Defterini okulda unuttu, bu yüzden …”', a: 'ödevini tamamlayamadı', w: ['çok sevindi', 'erken uyudu', 'kitap okudu'], ex: '“bu yüzden”den sonra sonucu söyleriz.' },
  { q: 'Cümleyi tamamla: “Kitaplarını özenle kullandı çünkü …”', a: 'temiz kalmasını istedi', w: ['kitapları sevmiyordu', 'eski kitap istedi', 'rafı boştu'], ex: 'Neden: temiz kalmasını istemesi.' },
  { q: 'Hangisi neden–sonuç cümlesidir?', a: 'Çok okuduğu için sözcük dağarcığı genişledi.', w: ['Kütüphane okulun yanında.', 'Kitabın kapağı mavi.', 'Bugün hava güneşli.'], ex: '“için” sözü neden ile sonucu bağlar.' },
  { q: 'Cümleyi tamamla: “Pusula doğru yolu gösterdiği için …”', a: 'insanlar kaybolmaz', w: ['yağmur yağar', 'kitaplar uçar', 'bahar gelir'], ex: 'Neden: yolu göstermesi. Sonuç: kaybolmamak.' },
  { q: '“Kitaplar hafızamızı geliştirir, bu nedenle bilgileri aklımızda tutarız.” Sonuç hangisi?', a: 'Bilgileri aklımızda tutmak', w: ['Kitapların hafızayı geliştirmesi', 'Kitap satın almak', 'Kütüphaneye gitmek'], ex: '“bu nedenle”den sonra gelen bölüm sonuçtur.' },
]
const BAGLAC_Q: Q[] = [
  { q: 'Boşluğa hangi sözcük gelir? “Kitap ___ defterimi çantama koydum.”', a: 've', w: ['çünkü', 'ama', 'fakat'], ex: '“ve” iki sözcüğü birbirine bağlar.' },
  { q: 'Boşluğa hangi sözcük gelir? “Kütüphanede sessiz oluruz ___ okuyanları rahatsız etmeyiz.”', a: 'çünkü', w: ['ve', 'veya', 'ile'], ex: '“çünkü” neden bildirir.' },
  { q: 'Boşluğa hangi sözcük gelir? “Tavuk yardım istedi ___ kimse yardım etmedi.”', a: 'fakat', w: ['çünkü', 've', 'ile'], ex: '“fakat” karşıt iki durumu bağlar.' },
  { q: 'Boşluğa hangi sözcük gelir? “3-A sınıfı ___ 3-B sınıfı şiiri birlikte okuyacak.”', a: 'ile', w: ['çünkü', 'ama', 'fakat'], ex: '“ile” birlikteliği anlatır.' },
  { q: 'Boşluğa hangi sözcük gelir? “Masal ___ hikâye kitabı seçebilirsin.”', a: 'ya da', w: ['çünkü', 'ile', 'ama'], ex: '“ya da” seçenek sunar.' },
  { q: 'Boşluğa hangi sözcük gelir? “Dışarıda oynamak isterdim ___ önce kitabımı bitirmeliyim.”', a: 'ama', w: ['ve', 'ile', 'çünkü'], ex: '“ama” karşıt bir durumu bağlar.' },
]
const HAYAL_BINS: SortQ['bins'] = [
  { id: 'gercek', label: 'Gerçekte olabilir', img: 'eye', color: '#22c55e' },
  { id: 'hayal', label: 'Hayal ürünü', img: 'sparkles', color: '#a855f7' },
]
const HAYAL_ITEMS: SortQ['items'] = [
  { label: 'Kitaptan bilgi edinmek', bin: 'gercek' },
  { label: 'Kütüphaneden kitap almak', bin: 'gercek' },
  { label: 'Kitaba not almak', bin: 'gercek' },
  { label: 'Rafa kitap dizmek', bin: 'gercek' },
  { label: 'Kitabı geri getirmek', bin: 'gercek' },
  { label: 'Sayfaların uçması', bin: 'hayal' },
  { label: 'Baykuşun konuşması', bin: 'hayal' },
  { label: 'Kitabın uyuması', bin: 'hayal' },
  { label: 'Kafdağı’na uçmak', bin: 'hayal' },
  { label: 'Kalemin şarkı söylemesi', bin: 'hayal' },
]
const FAYDA_BINS: SortQ['bins'] = [
  { id: 'eglence', label: 'Eğlenceli yanı', img: 'party', color: '#f59e0b' },
  { id: 'ogretici', label: 'Öğretici yanı', img: 'bulb', color: '#3b82f6' },
]
const FAYDA_ITEMS: SortQ['items'] = [
  { label: 'Bizi eğlendirir', bin: 'eglence' },
  { label: 'Bizi şaşırtır', bin: 'eglence' },
  { label: 'Heyecanlı olaylar sunar', bin: 'eglence' },
  { label: 'Hayal kurdurur', bin: 'eglence' },
  { label: 'Hafızamızı geliştirir', bin: 'ogretici' },
  { label: 'Yeni sözcükler öğretir', bin: 'ogretici' },
  { label: 'Bilgi verir', bin: 'ogretici' },
  { label: 'İletişimi geliştirir', bin: 'ogretici' },
]
const DILEKCE_O: O[] = [
  { q: 'Dilekçenin bölümlerini sırala.', s: ['Kurumun adı', 'İsteğin anlatılması', 'Saygı sözü', 'Tarih', 'Ad ve imza'], ex: 'Dilekçe kurumun adıyla başlar; istek, saygı sözü, tarih ve imzayla biter.' },
  { q: 'Kitap isteme dilekçesini sırala.', s: ['OKUL MÜDÜRLÜĞÜNE', 'Kütüphaneden kitap almak istiyorum.', 'Kitabı zamanında getireceğim.', 'Gereğini bilgilerinize arz ederim.'], ex: 'Önce kurum, sonra istek ve söz, en sonda saygı sözü.' },
  { q: 'Kitap önerisi yazısını sırala.', s: ['Kitabın adını yaz', 'En sevdiğin bölümü anlat', 'Hissettiklerini yaz', 'Kitabı önerip önermediğini söyle'], ex: 'Önce kitabı tanıt, sonra düşünceni yaz.' },
  { q: 'Bir araştırma yazısını sırala.', s: ['Konunu seç', 'Kaynaklardan araştır', 'Bilgileri yaz', 'Kaynaklarını belirt'], ex: 'Edindiğimiz bilginin kaynağını yazarız.' },
]
const DILEKCE_Q: Q[] = [
  { q: 'Dilekçe kime yazılır?', a: 'Bir kuruma', w: ['Yakın bir arkadaşa', 'Bir masal kahramanına', 'Kendimize'], ex: 'Dilekçe bir kuruma isteğimizi bildiren resmî yazıdır.' },
  { q: 'Dilekçe hangi sözle biter?', a: 'Gereğini bilgilerinize arz ederim.', w: ['Hoşça kal, görüşürüz!', 'Kocaman öpüyorum.', 'Bir varmış bir yokmuş.'], ex: 'Dilekçe saygılı bir sözle biter.' },
  { q: 'Kurumun adı dilekçenin neresine yazılır?', a: 'En üste, ortaya', w: ['En alta', 'Sol kenara', 'Hiç yazılmaz'], ex: 'Kurum adı en üstte ortaya, büyük harflerle yazılır.' },
  { q: 'Dilekçe nasıl bir dille yazılır?', a: 'Saygılı ve resmî', w: ['Şakacı ve kaba', 'Özensiz ve kısa', 'Şiir gibi uyaklı'], ex: 'Dilekçede saygılı, resmî bir dil kullanılır.' },
  { q: 'Hangisi dilekçeyle yapılır?', a: 'Okuldan bir istekte bulunmak', w: ['Arkadaşı doğum gününe çağırmak', 'Masal anlatmak', 'Şiir okumak'], ex: 'Resmî istekler dilekçeyle bildirilir.' },
  { q: 'Uygulamada dilekçe çalışırken hangisini yazmayız?', a: 'Ev adresimizi', w: ['İsteğimizi', 'Saygı sözünü', 'Kurumun adını'], ex: 'Kişisel bilgilerimizi uygulamaya yazmayız.' },
]
const KITAP_KELIME = ['kitap', 'raf', 'sayfa', 'masal', 'destan', 'pusula', 'şiir', 'yazar']
const T4_O: O[] = [
  { q: 'Kütüphaneden kitap almayı sırala.', s: ['Raflara göz gezdir', 'Bir kitap seç', 'Kütüphane kartını göster', 'Kitabı zamanında getir'], ex: 'Kütüphanenin kurallarına uyarız.', img: 'books' },
  { q: 'Elif’in rüyasını sırala.', s: ['Elif uyudu', 'Sayfalar uçmaya başladı', 'Masal ülkesine gitti', 'Sabah uyandı'], ex: 'Rüya uykuda başlar, uyanınca biter.', img: 'owl' },
  { q: 'Yazım hatası düzeltmeyi sırala.', s: ['Metni dikkatle oku', 'Hatalı sözcüğün altını çiz', 'Doğrusunu yaz', 'Metni yeniden gözden geçir'], ex: 'Hataları bulur, düzeltir, kontrol ederiz.', img: 'pencil' },
  { q: 'Bir kitap okuma planını sırala.', s: ['Başlığa ve görsele bak', 'Konuyu tahmin et', 'Kitabı oku', 'Tahminini karşılaştır'], ex: 'Okumadan önce tahmin, sonra karşılaştırma.', img: 'openbook' },
]
const T4_C: string[][] = [
  ['Kitaplar', 'hayal', 'gücümüzü', 'geliştirir.'],
  ['Kütüphanede', 'sessizce', 'kitap', 'okuruz.'],
  ['Ödünç', 'kitabı', 'zamanında', 'getiririz.'],
  ['Kitap', 'okudukça', 'sözcüklerimiz', 'çoğalır.'],
  ['Pusula', 'bize', 'yolu', 'gösterir.'],
]
const T4_TF: TF[] = [
  ['“her şey” ayrı yazılır.', true, 'Doğrusu: her şey.'],
  ['“ya da” bitişik yazılır.', false, '“ya da” ayrı yazılır.'],
  ['“kütüphane” sözcüğünde “h” harfi vardır.', true, 'Doğrusu: kütüphane.'],
  ['“çünkü” sözcüğü bir neden bildirir.', true, '“çünkü”den sonra nedeni söyleriz.'],
  ['Dilekçe arkadaşa yazılan bir mektuptur.', false, 'Dilekçe bir kuruma yazılan resmî istek yazısıdır.'],
  ['Baykuşun konuşması gerçekte olabilir.', false, 'Konuşan hayvanlar hayal ürünüdür.'],
  ['Ödünç alınan kitap özenle kullanılır.', true, 'Başkaları da okuyacağı için kitabı koruruz.'],
  ['“bir sürü” bitişik yazılır.', false, '“bir sürü” ayrı yazılır.'],
]
const YAZIM4_Q: Q[] = [
  { q: 'Hangisi doğru yazılmış? (bütün şeyler)', a: 'her şey', w: ['herşey', 'her-şey'], ex: '“her şey” ayrı yazılır.' },
  { q: 'Hangisi doğru yazılmış? (kitapların bulunduğu yer)', a: 'kütüphane', w: ['kütüpane', 'kütübhane', 'kütüphene'], ex: 'Doğrusu: kütüphane.' },
  { q: 'Hangisi doğru yazılmış? (okula giden çocuk)', a: 'öğrenci', w: ['örenci', 'öğreci', 'ögrenci'], ex: 'Doğrusu: öğrenci.' },
  { q: 'Hangisi doğru yazılmış? (çok sayıda)', a: 'bir sürü', w: ['birsürü', 'bi sürü', 'bir süru'], ex: '“bir sürü” ayrı yazılır.' },
  { q: 'Hangisi doğru yazılmış? (seçenek bildiren söz)', a: 'ya da', w: ['yada', 'yah da', 'ya-da'], ex: '“ya da” ayrı yazılır.' },
  { q: 'Hangisi doğru yazılmış? (eğlenmek)', a: 'eğleniriz', w: ['eyleniriz', 'eğlenirizz', 'ekleniriz'], ex: 'Doğrusu: eğleniriz.' },
  { q: 'Hangisi doğru yazılmış? (düş kurmak)', a: 'hayal', w: ['hayel', 'heyal', 'hayl'], ex: 'Doğrusu: hayal.' },
  { q: 'Hangisi doğru yazılmış? (günler boyunca)', a: 'her gün', w: ['hergün', 'hergun', 'her gun'], ex: '“her gün” ayrı yazılır.' },
  { q: 'Hangisi doğru yazılmış? (tutmayı başarır)', a: 'tutabilir', w: ['tuta bilir', 'tutabilr', 'tuda bilir'], ex: '“-abilir” sözcüğe bitişik yazılır: tutabilir.' },
  { q: 'Hangisi doğru yazılmış? (gittiğim zaman)', a: 'gittiğimde', w: ['gittiyimde', 'gidtiğimde', 'gittiğimte'], ex: 'Doğrusu: gittiğimde.' },
  { q: 'Hangisi doğru yazılmış? (cesur kişi)', a: 'kahraman', w: ['karaman', 'kahramın', 'kağraman'], ex: 'Doğrusu: kahraman.' },
  { q: 'Hangisi doğru yazılmış? (neden bildiren söz)', a: 'çünkü', w: ['çünki', 'cünkü', 'çünkü ki'], ex: 'Doğrusu: çünkü.' },
]

/* ================================================================================================
 * TEMA 5 · YETENEKLERİMİZİ KULLANIYORUZ
 * ================================================================================================ */
const BAGLAMA: Metin = {
  t: 'Bağlamanın Telleri',
  img: 'guitar',
  text: 'Can, dedesinin bağlama çaldığını ilk kez dinlediğinde çok heyecanlandı. Dedesi ona her hafta sonu ders vermeye başladı. İlk haftalarda parmakları acıdı ve çıkan sesler hiç güzel değildi. Can bazen vazgeçmek istedi ama dedesi “İşleyen demir ışıldar.” dedi. Can her gün biraz çalıştı. Birkaç ay sonra okul gösterisinde bir türkü çaldı. Salondaki herkes onu coşkuyla alkışladı.',
  qs: [
    { q: 'Can’a bağlama dersini kim verdi?', a: 'Dedesi', w: ['Öğretmeni', 'Ablası', 'Komşusu'], ex: 'Dedesi her hafta sonu ders verdi.' },
    { q: 'İlk haftalarda ne oldu?', a: 'Parmakları acıdı', w: ['Hemen türkü çaldı', 'Bağlama kırıldı', 'Dedesi kızdı'], ex: 'Yeni bir beceri başta zorlayabilir.' },
    { q: 'Dedesi Can’a hangi atasözünü söyledi?', a: 'İşleyen demir ışıldar.', w: ['Damlaya damlaya göl olur.', 'Ağaç yaşken eğilir.', 'Birlikten kuvvet doğar.'], ex: 'Çalışan gelişir, parlar.' },
    { q: 'Can okul gösterisinde ne yaptı?', a: 'Türkü çaldı', w: ['Şiir okudu', 'Dans etti', 'Resim yaptı'], ex: 'Bağlamayla bir türkü çaldı.' },
    { q: 'Bağlamanın Telleri metninden hangi çıkarımı yapabiliriz?', a: 'Düzenli çalışan başarır', w: ['Bağlama çalmak çok kolaydır', 'Yetenek çalışmadan gelişir', 'Dedeler müzik sevmez'], ex: 'Can her gün çalışarak başardı.' },
  ],
}
const KALE: Metin = {
  t: 'Kumdan Kale Yarışması',
  img: 'castle',
  text: 'Yaz tatilinde sahilde kumdan kale yarışması yapıldı. Ece, Arda ve Su aynı takımdaydı. Ece çizim yapmayı sevdiği için kalenin planını çizdi. Arda kovalarla su taşıdı, Su ise kumu şekillendirdi. Kalenin kulesi bir ara yıkıldı ama üçü pes etmeden yeniden yaptı. Yarışmanın sonunda kaleleri “En Güzel Takım Çalışması” ödülünü aldı.',
  qs: [
    { q: 'Kalenin planını kim çizdi?', a: 'Ece', w: ['Arda', 'Su', 'Öğretmen'], ex: 'Planı Ece çizdi.' },
    { q: 'Ece planı neden çizdi?', a: 'Çizim yapmayı sevdiği için', w: ['Su taşıyamadığı için', 'Takım kaptanı olduğu için', 'Kum sevmediği için'], ex: 'Herkes yeteneğine uygun bir iş üstlendi.' },
    { q: 'Kule yıkılınca takım ne yaptı?', a: 'Pes etmeden yeniden yaptı', w: ['Yarışmayı bıraktı', 'Başka takıma geçti', 'Eve gitti'], ex: 'Azimle yeniden yaptılar.' },
    { q: 'Takım hangi ödülü aldı?', a: 'En Güzel Takım Çalışması', w: ['En Yüksek Kule', 'En Hızlı Takım', 'En Renkli Kale'], ex: 'Birlikte çalıştıkları için ödül aldılar.' },
    { q: 'Kumdan Kale Yarışması metnine en uygun atasözü hangisi?', a: 'Bir elin nesi var, iki elin sesi var.', w: ['Ayağını yorganına göre uzat.', 'Gülme komşuna, gelir başına.', 'Ak akçe kara gün içindir.'], ex: 'Birlikte çalışmak başarı getirir.' },
    { q: 'Kumdan kale yarışması nerede yapıldı?', a: 'Sahilde', w: ['Okul bahçesinde', 'Ormanda', 'Müzede'], ex: 'Olayın geçtiği yer: sahil.' },
  ],
}
const SOZ5_P: P[] = [
  ['filografi', 'Çivi ve telle yapılan pano'],
  ['ebru', 'Su üstünde boyayla yapılan süs'],
  ['faal', 'Etkin, hareketli'],
  ['çevik', 'Çabuk hareket eden'],
  ['azim', 'Pes etmeme kararlılığı'],
  ['antrenör', 'Sporcu çalıştıran kişi'],
  ['çok yönlü', 'Birçok alanda yetenekli'],
]
const CIKARIM_Q: Q[] = [
  { q: '“Ninem her hafta yeni bir kursa gidiyor.” Bu cümleden ne çıkarırız?', a: 'Ninesi öğrenmeyi seviyor', w: ['Ninesi çok yorgun', 'Ninesi kurslardan sıkılmış', 'Ninesi hiç dışarı çıkmaz'], ex: 'Metinde açıkça yazmasa da ipucundan anlarız.' },
  { q: '“Mete her gün saatlerce ok attı.” Bundan ne çıkarırız?', a: 'Mete çalışkandır', w: ['Mete okçuluğu sevmez', 'Mete tembeldir', 'Mete hiç yorulmaz'], ex: 'Her gün saatlerce çalışmak çalışkanlığı gösterir.' },
  { q: '“Can’ın parmakları acıdı ama bağlamayı bırakmadı.” Bundan ne çıkarırız?', a: 'Can azimlidir', w: ['Can müziği sevmez', 'Can çabuk vazgeçer', 'Can bağlamayı kırdı'], ex: 'Zorluğa rağmen bırakmamak azimdir.' },
  { q: '“Balıklar Baliş’e tepki gösterdi.” Bundan ne çıkarırız?', a: 'Baliş’in oyunu balıkları rahatsız etti', w: ['Balıklar oyunu çok sevdi', 'Baliş balıkları kurtardı', 'Okyanus sakindi'], ex: 'Tepki göstermek rahatsız olmayı anlatır.' },
  { q: '“Takım sabahın erken saatinde antrenman yaptı.” Bundan ne çıkarırız?', a: 'Takım disiplinli çalışıyor', w: ['Takım geç uyanıyor', 'Takım yarışı umursamıyor', 'Antrenman gece yapılır'], ex: 'Erken saatte çalışmak disiplini gösterir.' },
  { q: 'Hangisi “Her yaşta öğrenilir.” çıkarımına uyar?', a: 'Emekli nine yeni bir dil öğreniyor', w: ['Bebek uyuyor', 'Kedi süt içiyor', 'Çocuk top oynuyor'], ex: 'Yaşı ilerlemiş biri yeni şey öğreniyor.' },
]
const KISILIK_BINS: SortQ['bins'] = [
  { id: 'kisilik', label: 'Kişilik özelliği', img: 'person', color: '#3b82f6' },
  { id: 'duygu', label: 'Duygu', img: 'happy', color: '#f59e0b' },
]
const KISILIK_ITEMS: SortQ['items'] = [
  { label: 'Meraklı', bin: 'kisilik' },
  { label: 'Çalışkan', bin: 'kisilik' },
  { label: 'Sabırlı', bin: 'kisilik' },
  { label: 'Çok yönlü', bin: 'kisilik' },
  { label: 'Yardımsever', bin: 'kisilik' },
  { label: 'Heyecan', bin: 'duygu' },
  { label: 'Hayranlık', bin: 'duygu' },
  { label: 'Endişe', bin: 'duygu' },
  { label: 'Şaşkınlık', bin: 'duygu' },
  { label: 'Sevinç', bin: 'duygu' },
]
const BENZ5_Q: Q[] = [
  { q: 'Hangi cümlede benzetme vardır?', a: 'Ok, şimşek gibi hızlı uçtu.', w: ['Okçu her gün çalıştı.', 'Takım madalya kazandı.', 'Yarış sabah başladı.'], ex: '“gibi” ile ok şimşeğe benzetilmiş.' },
  { q: '“Bulutlar pamuk gibi beyazdı.” Bulutlar neye benzetilmiş?', a: 'Pamuğa', w: ['Kara', 'Süte', 'Kâğıda'], ex: 'Benzetmede “gibi” sözünden önceki varlığa benzetilir.' },
  { q: 'Benzetme yaparken hangi sözcüğü kullanırız?', a: 'gibi', w: ['çünkü', 've', 'ama'], ex: 'Benzetmede “gibi” ya da “kadar” kullanılır.' },
  { q: '“Ninem arı kadar çalışkan.” Ninem hangi yönüyle arıya benzetilmiş?', a: 'Çalışkanlığı', w: ['Rengi', 'Boyu', 'Sesi'], ex: 'Arılar çalışkanlığıyla bilinir.' },
  { q: '“Su, ___ gibi havaya yükseldi.” Hangisi uygun bir benzetmedir?', a: 'fıskiye', w: ['taş', 'kum', 'yastık'], ex: 'Su fıskiyeden havaya fışkırır.' },
  { q: '“Gölgeler perdede ___ gibi dans ediyordu.” Hangisi uygundur?', a: 'kelebekler', w: ['taşlar', 'masalar', 'duvarlar'], ex: 'Kelebekler hafif hafif uçar, dans eder gibidir.' },
]
const ES5_P: P[] = [
  ['anı', 'hatıra'],
  ['yaşlı', 'ihtiyar'],
  ['doğa', 'tabiat'],
  ['sözcük', 'kelime'],
  ['doktor', 'hekim'],
  ['hediye', 'armağan'],
  ['öykü', 'hikâye'],
  ['fayda', 'yarar'],
]
const ATA5_P: P[] = [
  ['İşleyen demir ışıldar.', 'Çalışan gelişir'],
  ['Bir elin nesi var, iki elin sesi var.', 'Birlikte daha güçlüyüz'],
  ['Damlaya damlaya göl olur.', 'Azar azar birikir'],
  ['Ağaç yaşken eğilir.', 'Küçükken öğrenilir'],
  ['Emek olmadan yemek olmaz.', 'Çalışmadan kazanılmaz'],
  ['Bugünün işini yarına bırakma.', 'İşini zamanında yap'],
]
const DEGER_HIT = ['Sabır', 'Dürüstlük', 'Paylaşmak', 'Nezaket', 'Empati', 'Adalet', 'Dayanışma']
const DEGER_WRONG = ['Hile yapmak', 'Kıskançlık', 'Kırıcı söz', 'Sırayı bozmak', 'Kibir']
const T5_O: O[] = [
  { q: 'Bir sporcunun başarı yolunu sırala.', s: ['Küçük yaşta başladı', 'Pek çok alanda eğitim aldı', 'Her gün çok çalıştı', 'Altın madalya kazandı'], ex: 'Başarı bir gecede gelmez; çalışarak gelir.', img: 'target' },
  { q: 'Baliş’in hikâyesini sırala.', s: ['Su fışkırtıp dalga yaptı', 'Deniz canlıları kızdı', 'Yıldız okyanusa düştü', 'Baliş yıldızı kurtardı', 'Herkes onu sevdi'], ex: 'Yardımseverlik Baliş’i herkesin sevdiği biri yaptı.', img: 'whale' },
  { q: 'Gölge oyunu sahnesini sırala.', s: ['Kukla resimlerini çiz', 'Kartondan kes', 'Arkasına pipet yapıştır', 'Feneri yak, oyunu başlat'], ex: 'Makası bir büyüğümüzle kullanırız.', img: 'theater' },
  { q: 'Can’ın müzik yolculuğunu sırala.', s: ['Dedesini dinledi', 'Derse başladı', 'Parmakları acıdı', 'Gösteride türkü çaldı'], ex: 'Zorluklara rağmen çalışarak başardı.', img: 'guitar' },
  { q: 'Kumdan kale yarışını sırala.', s: ['Ece plan çizdi', 'Arda su taşıdı', 'Kule yıkıldı', 'Yeniden yaptılar', 'Ödül aldılar'], ex: 'Takım pes etmedi.', img: 'castle' },
]
const T5_C: string[][] = [
  ['Her', 'yaşta', 'yeni', 'şeyler', 'öğrenilir.'],
  ['Okçu', 'oklarını', 'sakin', 'bir', 'şekilde', 'attı.'],
  ['Takım', 'olmak', 'bizi', 'güçlendirir.'],
  ['Can', 'her', 'gün', 'bağlama', 'çaldı.'],
  ['Baliş', 'minik', 'yıldızı', 'kurtardı.'],
]
const T5_TF: TF[] = [
  ['Meraklı olmak bir kişilik özelliğidir.', true, 'Kişilik özelliği, kişinin genel olarak nasıl biri olduğunu anlatır.'],
  ['Endişe bir kişilik özelliğidir.', false, 'Endişe bir duygudur; geçici olarak hissedilir.'],
  ['Benzetme yaparken “gibi” sözcüğünü kullanabiliriz.', true, 'Kar pamuk gibi.'],
  ['“anı” ile “hatıra” eş anlamlıdır.', true, 'İkisi de aynı anlama gelir.'],
  ['Bir metinde her bilgi açıkça yazılır.', false, 'Bazı bilgileri ipuçlarından çıkarım yaparak buluruz.'],
  ['Oyunda hile yapmak dürüst bir davranıştır.', false, 'Dürüst oyuncu kurallara uyar.'],
  ['Çok yönlü kişi birçok alanda yeteneklidir.', true, 'Resim, müzik, spor gibi farklı alanlarda.'],
  ['Hikâyenin geçtiği yer, hikâye unsurlarından biridir.', true, 'Karakter, olay, yer ve zaman hikâyenin unsurlarıdır.'],
]
const TIRNAK5_Q: Q[] = [
  { q: 'Hangisinde konuşma doğru yazılmış?', a: 'Balıklar, “Yeter artık Baliş!” dedi.', w: ['Balıklar, Yeter artık Baliş! dedi.', 'Balıklar “yeter artık Baliş” dedi.', '“Balıklar, yeter artık” Baliş dedi.'], ex: 'Aktarılan söz tırnak içinde, büyük harfle başlar.' },
  { q: 'Konuşma çizgisi (-) nerede kullanılır?', a: 'Karşılıklı konuşmaların başında', w: ['Her cümlenin sonunda', 'Sayıların arasında', 'Özel adlardan sonra'], ex: 'Konuşma çizgisi, konuşanın sözünün başına konur.' },
  { q: 'Hangisi konuşma çizgisiyle doğru yazılmış?', a: '- Benim bir fikrim var, dedi kunduz.', w: ['Benim bir fikrim var - dedi kunduz.', '- benim bir fikrim var dedi kunduz -'], ex: 'Konuşma çizgisi sözün başına gelir, söz büyük harfle başlar.' },
  { q: 'Dede ne dedi? Doğru yazılmış olanı seç.', a: 'Dedesi, “İşleyen demir ışıldar.” dedi.', w: ['Dedesi, işleyen demir ışıldar dedi.', 'Dedesi “işleyen demir ışıldar” dedi.'], ex: 'Konuşandan sonra virgül, söz tırnak içinde.' },
  { q: 'Tırnak işaretini ne zaman kullanırız?', a: 'Başkasının sözünü aynen aktarırken', w: ['Soru sorarken', 'Sayı yazarken', 'Özel adlara ek getirirken'], ex: 'Başkasının sözü değiştirilmeden tırnak içinde yazılır.' },
  { q: 'Hangisinde virgül doğru kullanılmış?', a: 'Ece, Arda ve Su aynı takımdaydı.', w: ['Ece Arda, ve Su aynı takımdaydı.', 'Ece, Arda, ve Su aynı takımdaydı.'], ex: 'Sıralanan adları virgülle ayırırız; “ve”den önce virgül koymayız.' },
]

/* ================================================================================================
 * TEMA 6 · BİLİM YOLCULUĞU
 * ================================================================================================ */
const TELESKOP: Metin = {
  t: 'Gökyüzünü Gözleyen Kız',
  img: 'telescope',
  text: 'Zehra’ya bayramda bir teleskop armağan edildi. Gece olunca babasıyla balkona çıktılar. Teleskobu Ay’a çevirdiler ve yüzeyindeki çukurları gördüler. Zehra gördüklerini defterine çizdi. Her gece Ay’ın biraz değiştiğini fark etti. Kütüphaneden aldığı bir kitapta bunun nedenini araştırdı. Artık Zehra’nın en büyük hayali bir gökbilimci olmaktı.',
  qs: [
    { q: 'Zehra’ya ne armağan edildi?', a: 'Teleskop', w: ['Bisiklet', 'Dürbün', 'Pusula'], ex: 'Zehra’ya bir teleskop armağan edildi.' },
    { q: 'Ay’ın yüzeyinde ne gördüler?', a: 'Çukurlar', w: ['Ağaçlar', 'Evler', 'Denizler'], ex: 'Ay’ın yüzeyinde çukurlar vardır.' },
    { q: 'Zehra gördüklerini ne yaptı?', a: 'Defterine çizdi', w: ['Hemen unuttu', 'Tahtaya yazdı', 'Kimseye söylemedi'], ex: 'Gözlemlerini defterine çizdi.' },
    { q: 'Zehra merak ettiği şeyi nasıl öğrendi?', a: 'Kitaptan araştırdı', w: ['Hiç öğrenmedi', 'Yalnızca tahmin etti', 'Rüyasında gördü'], ex: 'Kütüphaneden aldığı kitapta araştırdı.' },
    { q: 'Zehra’nın en büyük hayali nedir?', a: 'Gökbilimci olmak', w: ['Aşçı olmak', 'Pilot olmak', 'Ressam olmak'], ex: 'Gökyüzünü inceleyen bilim insanı olmak istiyor.' },
  ],
}
const EATIK: Metin = {
  t: 'Eski Telefonun Yolculuğu',
  img: 'phone',
  text: 'Kerem’in eski telefonu artık hiç çalışmıyordu. Kerem onu çöp kutusuna atmak istedi. Ablası, “Dur! Elektronik atıklar çöpe atılmaz.” dedi. Bu atıkların içinde doğaya zarar veren maddeler olduğunu anlattı. Birlikte telefonu belediyenin atık toplama kutusuna götürdüler. Görevli, telefonun parçalarının yeniden kullanılacağını söyledi. Kerem, küçük bir davranışla doğayı koruduğu için sevindi.',
  qs: [
    { q: 'Kerem eski telefonu ne yapmak istedi?', a: 'Çöpe atmak', w: ['Tamir etmek', 'Satmak', 'Saklamak'], ex: 'Önce çöpe atmak istedi.' },
    { q: 'Ablası Kerem’i neden durdurdu?', a: 'E-atık doğaya zarar verdiği için', w: ['Telefon yeni olduğu için', 'Çöp kutusu dolu olduğu için', 'Telefonu kendisi istediği için'], ex: 'E-atıkların içinde zararlı maddeler vardır.' },
    { q: 'Telefonu nereye götürdüler?', a: 'Atık toplama kutusuna', w: ['Parka', 'Okula', 'Denize'], ex: 'Belediyenin atık toplama kutusuna götürdüler.' },
    { q: 'Telefonun parçalarına ne olacak?', a: 'Yeniden kullanılacak', w: ['Toprağa gömülecek', 'Yakılacak', 'Denize atılacak'], ex: 'Parçalar geri dönüştürülür.' },
    { q: 'Eski Telefonun Yolculuğu metninin ana fikri nedir?', a: 'E-atıkları geri dönüşüme vermeliyiz', w: ['Telefonlar hiç bozulmaz', 'Eski eşyalar hep saklanmalı', 'Abla her zaman haklıdır'], ex: 'Doğayı korumak için e-atıkları doğru yere veririz.' },
  ],
}
const SOZ6_P: P[] = [
  ['mucit', 'Yeni bir şey icat eden'],
  ['icat', 'Daha önce olmayan buluş'],
  ['uydu', 'Gezegen çevresinde dönen araç'],
  ['festival', 'Şenlik'],
  ['yolbul', 'Yol gösteren cihaz'],
  ['kâşif', 'Yeni yerler bulan kişi'],
  ['emektar', 'Uzun süre hizmet etmiş'],
]
const GM_BINS: SortQ['bins'] = [
  { id: 'gercek', label: 'Gerçek anlam', img: 'eye', color: '#3b82f6' },
  { id: 'mecaz', label: 'Mecaz anlam', img: 'sparkles', color: '#a855f7' },
]
const GM_ITEMS: SortQ['items'] = [
  { label: 'Hava çok soğuk.', bin: 'gercek' },
  { label: 'Çay çok sıcak.', bin: 'gercek' },
  { label: 'Kalemin ucu kırıldı.', bin: 'gercek' },
  { label: 'Yıldızlar parlıyor.', bin: 'gercek' },
  { label: 'Kuş daldan uçtu.', bin: 'gercek' },
  { label: 'Bana soğuk davrandı.', bin: 'mecaz' },
  { label: 'Bizi sıcak karşıladı.', bin: 'mecaz' },
  { label: 'Arkadaşının kalbini kırdı.', bin: 'mecaz' },
  { label: 'Yatağından fırladı.', bin: 'mecaz' },
  { label: 'Bu tabağa bayıldım!', bin: 'mecaz' },
]
const GM_Q: Q[] = [
  { q: '“Arkadaşım bugün bana soğuk davrandı.” “soğuk” hangi anlamda?', a: 'Mecaz anlam', w: ['Gerçek anlam'], ex: 'Burada soğuk “ilgisiz” demektir; mecazdır.' },
  { q: '“Bugün hava çok soğuk.” “soğuk” hangi anlamda?', a: 'Gerçek anlam', w: ['Mecaz anlam'], ex: 'Düşük sıcaklık; akla ilk gelen anlam.' },
  { q: '“Elif sabah yatağından fırladı.” “fırladı” ne anlatıyor?', a: 'Çok hızlı kalktı', w: ['Havaya uçtu', 'Yataktan düştü', 'Yavaşça kalktı'], ex: 'Mecaz anlam: hızlıca, heyecanla kalkmak.' },
  { q: '“Haritacı, haritalarıyla dünyaya ışık tuttu.” Bu söz ne anlatıyor?', a: 'İnsanlara yol gösterdi, bilgi verdi', w: ['Elinde fener taşıdı', 'Gece lamba yaktı', 'Güneşi buldu'], ex: '“Işık tutmak” burada mecazdır: bilgi vermek.' },
  { q: '“Bu tabağa bayıldım!” sözünde “bayılmak” ne demek?', a: 'Çok beğenmek', w: ['Düşüp bayılmak', 'Uyumak', 'Korkmak'], ex: 'Mecaz anlamıyla çok beğenmek.' },
  { q: 'Hangi cümlede “sıcak” mecaz anlamda kullanılmış?', a: 'Bizi sıcak bir gülümsemeyle karşıladı.', w: ['Çorba çok sıcak.', 'Yazın hava sıcak olur.', 'Sıcak suyla elimi yıkadım.'], ex: 'Sıcak gülümseme: içten, sevecen.' },
]
const DEYIM_P: P[] = [
  ['bir taşla iki kuş vurmak', 'Tek işle iki iş başarmak'],
  ['etekleri zil çalmak', 'Çok sevinmek'],
  ['ipe un sermek', 'Bahane bulmak'],
  ['leb demeden leblebiyi anlamak', 'Çok çabuk anlamak'],
  ['tarih olmak', 'Geçmişte kalmak'],
  ['dört gözle beklemek', 'Çok istekle beklemek'],
  ['rahatına bakmak', 'Kendi rahatını düşünmek'],
]
const ATA6_Q: Q[] = [
  { q: '“Ağaç yaşken …” atasözünü tamamla.', a: 'eğilir', w: ['kırılır', 'büyür', 'kurur'], ex: 'Ağaç yaşken eğilir: küçükken öğrenilir.' },
  { q: '“İşleyen demir …” atasözünü tamamla.', a: 'ışıldar', w: ['paslanır', 'kırılır', 'ısınır'], ex: 'İşleyen demir ışıldar: çalışan gelişir.' },
  { q: '“Bugünün işini …” atasözünü tamamla.', a: 'yarına bırakma', w: ['düne bırak', 'kimseye verme', 'hiç yapma'], ex: 'İşimizi zamanında yaparız.' },
  { q: '“Ayağını yorganına göre …” atasözünü tamamla.', a: 'uzat', w: ['topla', 'yıka', 'ört'], ex: 'Harcamanı gücüne göre yap.' },
  { q: '“Emek olmadan …” atasözünü tamamla.', a: 'yemek olmaz', w: ['iş olmaz', 'oyun olmaz', 'su olmaz'], ex: 'Çalışmadan kazanılmaz.' },
  { q: '“Ak akçe kara gün …” atasözünü tamamla.', a: 'içindir', w: ['geçer', 'gelir', 'biter'], ex: 'Biriktirdiğimiz para zor günde işe yarar.' },
  { q: '“Damlaya damlaya …” atasözünü tamamla.', a: 'göl olur', w: ['deniz olur', 'sel olur', 'yağmur olur'], ex: 'Az az biriken çok olur.' },
  { q: '“Ayağını yorganına göre uzat.” atasözü ne anlatır?', a: 'Harcamanı gücüne göre yap', w: ['Uyurken ayağını çek', 'Yorganını büyüt', 'Erken yat'], ex: 'Atasözleri öğüt verir.' },
]
const YAZISMA_BINS: SortQ['bins'] = [
  { id: 'bas', label: 'Başlatma', img: 'wave2', color: '#22c55e' },
  { id: 'surdur', label: 'Sürdürme', img: 'laptop', color: '#3b82f6' },
  { id: 'son', label: 'Sonlandırma', img: 'thumbsup', color: '#a855f7' },
]
const YAZISMA_ITEMS: SortQ['items'] = [
  { label: 'Merhaba,', bin: 'bas' },
  { label: 'Sayın Yetkili,', bin: 'bas' },
  { label: 'İyi günler,', bin: 'bas' },
  { label: 'Size bir soru sormak istiyorum.', bin: 'surdur' },
  { label: 'Atıklarla ilgili bilgi almak istiyoruz.', bin: 'surdur' },
  { label: 'Ne yapmamız gerektiğini merak ediyoruz.', bin: 'surdur' },
  { label: 'Zaman ayırdığınız için teşekkürler.', bin: 'son' },
  { label: 'İyi çalışmalar dilerim.', bin: 'son' },
  { label: 'Cevabınızı bekliyorum.', bin: 'son' },
]
const YONTEM_P: P[] = [
  ['Göz atarak okuma', 'Hızlıca konuyu anlamak'],
  ['İşaretleyerek okuma', 'Önemli yerleri boyamak'],
  ['Not alarak okuma', 'Önemli bilgileri yazmak'],
  ['Katılımlı dinleme', 'Soru sorarak dinlemek'],
  ['Katılımsız dinleme', 'Yalnızca sessizce dinlemek'],
  ['Empati kurarak dinleme', 'Konuşanın duygusunu anlamak'],
]
const BILIM_KELIME = ['uydu', 'roket', 'robot', 'deney', 'mucit', 'icat', 'harita', 'pusula']
const T6_O: O[] = [
  { q: 'Bir e-posta yazmayı sırala.', s: ['Merhaba diyerek başla', 'Yazma amacını söyle', 'Sorunu nazikçe sor', 'Teşekkür edip bitir'], ex: 'Yazışma başlatılır, sürdürülür ve nazikçe sonlandırılır.', img: 'laptop' },
  { q: 'E-atığı doğru yere ulaştırmayı sırala.', s: ['Bozuk cihazı ayır', 'Bir büyüğüne haber ver', 'Belediyeye bildir', 'Toplama kutusuna götür'], ex: 'E-atıklar toplama noktalarına verilir.', img: 'recycle' },
  { q: 'Ay gözlemini sırala.', s: ['Teleskobu hazırla', 'Ay’a çevir', 'Gördüklerini çiz', 'Kitaptan araştır'], ex: 'Gözlem yapar, kaydeder, araştırırız.', img: 'moon' },
  { q: 'Bir deney yapmayı sırala.', s: ['Merak ettiğin soruyu belirle', 'Malzemeleri hazırla', 'Deneyi yap', 'Sonucu yaz'], ex: 'Bilim merakla başlar.', img: 'lab' },
  { q: 'Bir haritacının çalışmasını sırala.', s: ['Denizlere açıldı', 'Yeni yerler gördü', 'Bilgileri topladı', 'Haritalar çizdi'], ex: 'Kâşifler gördüklerini başkalarına anlatır.', img: 'map' },
]
const T6_C: string[][] = [
  ['Mucitler', 'yeni', 'şeyler', 'icat', 'eder.'],
  ['Bozuk', 'telefonlar', 'çöpe', 'atılmaz.'],
  ['Teleskopla', 'gökyüzünü', 'gözledik.'],
  ['Robotlar', 'işlerimizi', 'kolaylaştırır.'],
  ['Bilim', 'festivali', 'yarın', 'başlıyor.'],
]
const T6_TF: TF[] = [
  ['“Bana soğuk davrandı.” cümlesinde “soğuk” mecaz anlamlıdır.', true, 'Burada soğuk “ilgisiz” demektir.'],
  ['Elektronik atıkları çöp kutusuna atmalıyız.', false, 'E-atıkları toplama noktalarına veririz.'],
  ['“Etekleri zil çalmak” çok sevinmek demektir.', true, 'Bu bir deyimdir.'],
  ['Göz atarak okumada her sözcüğü tek tek not alırız.', false, 'Göz atarak okuma hızlı ve yüzeyseldir.'],
  ['Bir yazışmayı “Merhaba” diyerek başlatabiliriz.', true, 'Nazik bir selamla başlarız.'],
  ['“Ağaç yaşken eğilir.” bir deyimdir.', false, 'Bu bir atasözüdür; öğüt verir.'],
  ['Mucit, yeni bir şey icat eden kişidir.', true, 'Mucitler buluş yapar.'],
  ['Sokak lambası yakıcılığı bugün çok yaygın bir meslektir.', false, 'Bu meslek elektrikle birlikte tarih oldu.'],
]
const IKINOKTA_Q: Q[] = [
  { q: 'Hangisinde iki nokta doğru kullanılmış?', a: 'Müze dört bölümden oluşur: posta, telgraf, telefon ve pul.', w: ['Müze dört bölümden: oluşur posta, telgraf, telefon ve pul.', 'Müze: dört bölümden oluşur posta, telgraf, telefon ve pul.'], ex: 'Sıralamadan önce iki nokta konur.' },
  { q: 'İki nokta (:) nerede kullanılır?', a: 'Açıklama ya da sıralamadan önce', w: ['Soru cümlesinin sonunda', 'Özel adlardan sonra', 'Her sözcüğün arasında'], ex: 'İki noktadan sonra açıklama ya da örnek gelir.' },
  { q: 'Üç nokta (...) ne gösterir?', a: 'Sözün tamamlanmadığını', w: ['Sorunun bittiğini', 'Bir sevinci', 'Saati'], ex: 'Üç nokta, tamamlanmamış sözü gösterir.' },
  { q: '“Eskiden insanlar şu işleri yapardı ___ uyandırıcılık, buz satıcılığı.” Boşluğa ne gelir?', a: 'İki nokta (:)', w: ['Soru işareti (?)', 'Ünlem işareti (!)', 'Kesme işareti (’)'], ex: 'Sıralamadan önce iki nokta konur.' },
  { q: '“Teknoloji ne kadar hızlı gelişiyor, değil mi ___” Sona ne gelir?', a: 'Soru işareti (?)', w: ['Nokta (.)', 'İki nokta (:)', 'Virgül (,)'], ex: '“değil mi” soru bildirir.' },
  { q: '“Annem şöyle dedi ___ Bugün bilim şenliği var.” Boşluğa ne gelir?', a: 'İki nokta (:)', w: ['Nokta (.)', 'Kesme işareti (’)', 'Soru işareti (?)'], ex: '“şöyle dedi”den sonra açıklanan söz gelir.' },
  { q: 'Eğik çizgi (/) nerede kullanılabilir?', a: 'Sınıf ve şube yazarken: 3/A', w: ['Cümle sonunda', 'Özel adlardan sonra', 'Soru sorarken'], ex: 'Eğik çizgi sınıf-şube ve tarih yazımında kullanılır.' },
]

/* ================================================================================================
 * TEMA 7 · MİLLÎ KÜLTÜRÜMÜZ
 * ================================================================================================ */
const KILIM: Metin = {
  t: 'Ninemin Kilimi',
  img: 'oldwoman',
  text: 'Ayşe yaz tatilinde ninesinin köyüne gitti. Ninesi her sabah tezgâhın başına oturup kilim dokuyordu. Kilimin üzerinde kırmızı, sarı ve lacivert desenler vardı. Ninesi her desenin bir anlamı olduğunu anlattı. Ayşe de ninesinin yardımıyla küçük bir desen dokudu. Tatil bittiğinde ninesi ona minik bir kilim armağan etti. Ayşe kilimi odasına serdi ve her baktığında ninesini hatırladı.',
  qs: [
    { q: 'Ayşe tatilde nereye gitti?', a: 'Ninesinin köyüne', w: ['Denize', 'Müzeye', 'Şehre'], ex: 'Ayşe ninesinin köyüne gitti.' },
    { q: 'Ninesi her sabah ne yapıyordu?', a: 'Kilim dokuyordu', w: ['Ekmek yapıyordu', 'Kitap okuyordu', 'Bahçe suluyordu'], ex: 'Tezgâhın başında kilim dokuyordu.' },
    { q: 'Kilimde hangi renkler vardı?', a: 'Kırmızı, sarı ve lacivert', w: ['Yalnızca beyaz', 'Yeşil ve mor', 'Siyah ve gri'], ex: 'Kırmızı, sarı ve lacivert desenler vardı.' },
    { q: 'Ninesi Ayşe’ye ne armağan etti?', a: 'Minik bir kilim', w: ['Bir kitap', 'Bir oyuncak', 'Bir şapka'], ex: 'Tatil sonunda minik bir kilim verdi.' },
    { q: 'Ninemin Kilimi metninin ana fikri nedir?', a: 'Geleneksel sanatlar kuşaktan kuşağa aktarılır', w: ['Köyler çok uzaktır', 'Kilimler çok ağırdır', 'Tatil çabuk biter'], ex: 'Nine sanatını torununa öğretti.' },
  ],
}
const MENDIL: Metin = {
  t: 'Teneffüste Mendil Kapmaca',
  img: 'running',
  text: 'Teneffüste sınıfça mendil kapmaca oynamaya karar verdik. Önce iki takıma ayrıldık ve her oyuncuya bir sayı verdik. Öğretmenimiz mendili ortaya tuttu ve bir sayı söyledi. O sayıya sahip iki oyuncu koşup mendili kapmaya çalıştı. Oyun bitince dedelerimizin de çocukken bu oyunu oynadığını öğrendik. Geleneksel oyunlarımızın hem eğlendirdiğini hem de bizi birleştirdiğini fark ettik.',
  qs: [
    { q: 'Mendil kapmaca ne zaman oynandı?', a: 'Teneffüste', w: ['Akşam', 'Hafta sonu', 'Bayramda'], ex: 'Teneffüste oynadılar.' },
    { q: 'Oyuna başlamadan önce ne yaptılar?', a: 'İki takıma ayrıldılar', w: ['Şarkı söylediler', 'Resim çizdiler', 'Mendil diktiler'], ex: 'Önce takımlara ayrıldılar.' },
    { q: 'Mendili kim tuttu?', a: 'Öğretmen', w: ['Dede', 'Takım kaptanı', 'Kantinci'], ex: 'Öğretmen mendili ortaya tuttu.' },
    { q: 'Çocuklar oyun bitince ne öğrendi?', a: 'Dedelerinin de bu oyunu oynadığını', w: ['Oyunun yeni icat edildiğini', 'Mendilin kaybolduğunu', 'Oyunun bittiğini'], ex: 'Geleneksel oyunlar kuşaktan kuşağa oynanır.' },
    { q: 'Teneffüste Mendil Kapmaca metninin ana fikri nedir?', a: 'Geleneksel oyunlar bizi birleştirir', w: ['Koşmak yorucudur', 'Mendil her zaman beyazdır', 'Teneffüs kısadır'], ex: 'Oyunlar hem eğlendirir hem birleştirir.' },
  ],
}
const SOZ7_P: P[] = [
  ['telgraf', 'Yazılı haberi uzağa ileten alet'],
  ['pul', 'Mektuba yapıştırılan ücret kâğıdı'],
  ['müze', 'Eski eserlerin sergilendiği yer'],
  ['bando', 'Törende çalan çalgı takımı'],
  ['köknar', 'İğne yapraklı orman ağacı'],
  ['şırıltı', 'Akan suyun sesi'],
  ['gelenek', 'Kuşaktan kuşağa geçen alışkanlık'],
]
const USLUP_Q: Q[] = [
  { q: 'Bir büyüğünden bir şey isterken hangisini söylersin?', a: 'Alabilir miyim, lütfen?', w: ['Çabuk ver!', 'Ver şunu!', 'Bana getir!'], ex: 'Nazik bir üslupla isteriz.' },
  { q: 'Öğretmenine soru sorarken hangisi uygundur?', a: 'Öğretmenim, açıklar mısınız?', w: ['Niye böyle, anlamadım!', 'Bu ne şimdi?', 'Anlatsana!'], ex: 'Saygılı bir dil kullanırız.' },
  { q: 'Arkadaşınla plan yaparken hangisi uygundur?', a: 'Bugün ne yapmak istersin?', w: ['Sen hep sıkıcısın!', 'Benim dediğim olacak!', 'Seninle oynamam!'], ex: 'Arkadaşımızın fikrini sorarız.' },
  { q: 'Hata yaptığında hangisini söylersin?', a: 'Üzgünüm, affedersin.', w: ['Sen de hata yaptın!', 'Bana ne!', 'Olur öyle şeyler!'], ex: 'Hatamızı kabul edip özür dileriz.' },
  { q: 'Yeni komşunu nasıl karşılarsın?', a: 'Hoş geldiniz!', w: ['Çok gürültü yapıyorsunuz!', 'Burası bizim yerimiz!', 'Gidin buradan!'], ex: 'Yeni komşuları güler yüzle karşılarız.' },
  { q: 'Komşunu istemeden rahatsız ettiysen ne dersin?', a: 'Özür dilerim, fark etmedim.', w: ['Benim suçum yok!', 'Alışırsınız!', 'Kulaklarınızı kapatın!'], ex: 'Ağaçkakan da komşularından özür diledi.' },
]
const UYGUN7_Q: Q[] = [
  { q: 'Hangisi uygun? “Dere ___ akıyordu.”', a: 'şırıldayarak', w: ['bağırarak', 'uçarak', 'koşarak'], ex: 'Akan suyun sesi şırıltıdır.' },
  { q: 'Hangisi uygun? “Sincaplar yeni komşularına karşı ___ davrandı.”', a: 'anlayışlı', w: ['kaba', 'sinirli', 'kıskanç'], ex: 'Sincaplar hoşgörülü ve anlayışlıydı.' },
  { q: 'Hangisi uygun? “Kuşlar ötüyor, dere akıyordu; orman çok ___ bir yerdi.”', a: 'huzurlu', w: ['gürültülü', 'kirli', 'kalabalık'], ex: 'Sakin ve güzel yer huzurludur.' },
  { q: 'Hangisi uygun? “Ağaçkakan yuva için ___ bir köknar arıyordu.”', a: 'güzel', w: ['çirkin', 'kötü', 'bozuk'], ex: 'Yuva için güzel bir ağaç arıyordu.' },
  { q: 'Hangisi uygun? “Bayram sabahı dışarıdan bando ___ geliyordu.”', a: 'sesleri', w: ['kokuları', 'renkleri', 'tatları'], ex: 'Bando müzik çalar; sesi duyulur.' },
  { q: 'Hangisi uygun? “Ninem kilimi büyük bir ___ dokudu.”', a: 'özenle', w: ['öfkeyle', 'korkuyla', 'tembellikle'], ex: 'Güzel işler özenle yapılır.' },
]
const GELENEK_BINS: SortQ['bins'] = [
  { id: 'gelenek', label: 'Geleneksel oyun', img: 'kite', color: '#f59e0b' },
  { id: 'dijital', label: 'Dijital oyun', img: 'videogame', color: '#6366f1' },
]
const GELENEK_ITEMS: SortQ['items'] = [
  { label: 'Mendil kapmaca', bin: 'gelenek' },
  { label: 'Seksek', bin: 'gelenek' },
  { label: 'İp atlama', bin: 'gelenek' },
  { label: 'Saklambaç', bin: 'gelenek' },
  { label: 'Körebe', bin: 'gelenek' },
  { label: 'Ak terek gök terek', bin: 'gelenek' },
  { label: 'Tabletteki yarış', bin: 'dijital' },
  { label: 'Bilgisayar bulmacası', bin: 'dijital' },
  { label: 'Telefondaki oyun', bin: 'dijital' },
  { label: 'Konsol oyunu', bin: 'dijital' },
]
const OYUN_HIT = ['Seksek', 'Saklambaç', 'Körebe', 'İp atlama', 'Mendil kapmaca', 'Yakan top']
const OYUN_WRONG = ['Tablet oyunu', 'Bilgisayar oyunu', 'Telefon oyunu', 'Konsol oyunu']
const KULTUR_P: P[] = [
  ['kilim', 'Desenli dokuma yaygı'],
  ['ebru', 'Su üstünde boya sanatı'],
  ['halay', 'El ele oynanan halk oyunu'],
  ['gölge oyunu', 'Perdede kukla gösterisi'],
  ['sayışma', 'Ebe seçme tekerlemesi'],
  ['türkü', 'Halkın söylediği ezgili şiir'],
]
const ATA7_Q: Q[] = [
  { q: 'Takımlar el ele tutuşup oynuyor. Hangi atasözü uygundur?', a: 'Birlikten kuvvet doğar.', w: ['Ağaç yaşken eğilir.', 'Ak akçe kara gün içindir.', 'Ayağını yorganına göre uzat.'], ex: 'Birlikte olan güçlüdür.' },
  { q: '“Komşu komşunun külüne muhtaçtır.” ne anlatır?', a: 'Komşular birbirine yardım eder', w: ['Komşular kül toplar', 'Komşuya gitmemeliyiz', 'Kül çok değerlidir'], ex: 'Komşular küçük şeylerde bile birbirine muhtaçtır.' },
  { q: 'Sincaplar ile ağaçkakan iyi komşu oldu. Hangi atasözü uygundur?', a: 'Komşu komşunun külüne muhtaçtır.', w: ['İşleyen demir ışıldar.', 'Ağaç yaşken eğilir.', 'Damlaya damlaya göl olur.'], ex: 'İyi komşuluk önemlidir.' },
  { q: '“Gülme komşuna, gelir başına.” ne anlatır?', a: 'Başkasının zor durumuyla alay etme', w: ['Komşunla hiç gülme', 'Komşun sana gelir', 'Gülmek zararlıdır'], ex: 'Başkasının sıkıntısıyla alay etmeyiz.' },
  { q: 'Ninesinden kilim dokumayı küçükken öğrenen Ayşe için hangisi uygun?', a: 'Ağaç yaşken eğilir.', w: ['Gülme komşuna, gelir başına.', 'Damlaya damlaya göl olur.', 'Ak akçe kara gün içindir.'], ex: 'Küçük yaşta öğrenilen kalıcı olur.' },
  { q: '“Üzüm üzüme baka baka kararır.” ne anlatır?', a: 'İnsan arkadaşlarından etkilenir', w: ['Üzümler güneşte kararır', 'Üzüm yemek iyidir', 'Bağda çalışmalıyız'], ex: 'Birlikte olduğumuz kişilerden etkileniriz.' },
]
const BENZ7_Q: Q[] = [
  { q: '“Bayrağımız, vatanımızın gökyüzündeki kalbidir.” Bayrak neye benzetilmiş?', a: 'Kalbe', w: ['Gökyüzüne', 'Vatana', 'Rüzgâra'], ex: 'Bayrak, vatanın kalbine benzetilmiş.' },
  { q: '“Müze tam bir zaman makinesi.” Müze neye benzetilmiş?', a: 'Zaman makinesine', w: ['Postacıya', 'Telefona', 'Mektuba'], ex: 'Müze bizi geçmişe götürdüğü için zaman makinesine benzetilmiş.' },
  { q: 'Müzedeki eski telefonlar neden “dede” diye anılmış olabilir?', a: 'Çok eski oldukları için', w: ['Sakallı oldukları için', 'Masal anlattıkları için', 'Yavaş yürüdükleri için'], ex: 'Eski oldukları için dedelere benzetilmişler.' },
  { q: 'Hangi cümlede benzetme vardır?', a: 'Kilimin desenleri gökkuşağı gibiydi.', w: ['Ninem kilim dokudu.', 'Kilim odadaydı.', 'Tatil bitti.'], ex: '“gibi” ile desenler gökkuşağına benzetilmiş.' },
  { q: '“Çocukların sesi kuş cıvıltısı gibiydi.” Ses neye benzetilmiş?', a: 'Kuş cıvıltısına', w: ['Bando sesine', 'Rüzgâra', 'Şırıltıya'], ex: 'Benzetmede “gibi”den önceki varlık benzetilendir.' },
]
const T7_O: O[] = [
  { q: 'Yeni Komşu hikâyesini sırala.', s: ['Ağaçkakan yuva yeri aradı', 'Ağaca gagasıyla vurdu', 'Sincaplar sesten rahatsız oldu', 'Ağaçkakan özür diledi', 'İki aile dost oldu'], ex: 'Anlayış ve özür dostluğu getirdi.', img: 'bird2' },
  { q: 'Mendil kapmacayı sırala.', s: ['İki takıma ayrıl', 'Her oyuncuya sayı ver', 'Ebe bir sayı söyler', 'O sayıdakiler mendile koşar'], ex: 'Oyunun kuralları sırayla uygulanır.', img: 'running' },
  { q: 'Ayşe’nin tatilini sırala.', s: ['Köye gitti', 'Ninesini kilim dokurken izledi', 'Kendisi bir desen dokudu', 'Minik kilimi armağan aldı'], ex: 'Ayşe ninesinden sanat öğrendi.', img: 'oldwoman' },
  { q: 'Eski bir mektubun yolculuğunu sırala.', s: ['Mektup yazıldı', 'Pul yapıştırıldı', 'Postacı atla taşıdı', 'Mektup sahibine ulaştı'], ex: 'Eskiden postalar atlarla taşınırdı.', img: 'horse' },
  { q: '23 Nisan sabahını sırala.', s: ['Bando sesiyle uyandım', 'Bayramlığımı giydim', 'Okula koştum', 'Gösterilere katıldım'], ex: 'Bayram sabahı coşkuyla başlar.', img: 'trflag' },
]
const T7_C: string[][] = [
  ['Ninem', 'güzel', 'kilimler', 'dokur.'],
  ['Geleneksel', 'oyunlar', 'bizi', 'birleştirir.'],
  ['Komşularımıza', 'anlayışlı', 'davranırız.'],
  ['Müzede', 'eski', 'telefonları', 'gördük.'],
  ['Bando', 'neşeli', 'marşlar', 'çaldı.'],
]
const T7_TF: TF[] = [
  ['Seksek geleneksel bir çocuk oyunudur.', true, 'Dedelerimiz de seksek oynardı.'],
  ['“Çabuk ver!” nazik bir istek sözüdür.', false, 'Nazik isteriz: Alabilir miyim, lütfen?'],
  ['Telgraf eskiden haber göndermek için kullanılırdı.', true, 'Yazılı haberleri uzaklara iletirdi.'],
  ['Pul, mektuba yapıştırılan küçük bir kâğıttır.', true, 'Pul mektubun ücretini gösterir.'],
  ['Komşumuzu rahatsız edince özür dileriz.', true, 'Ağaçkakan da sincaplardan özür diledi.'],
  ['Dinleme yaparken ortamın sessiz olması önemli değildir.', false, 'Sessiz ve aydınlık ortam dinlemeyi kolaylaştırır.'],
  ['Halay bir halk oyunudur.', true, 'El ele tutuşularak oynanır.'],
  ['Türkçe yalnızca Türkiye’de konuşulur.', false, 'Türkçe Türk dünyasının pek çok ülkesinde konuşulur.'],
]
const KESME7: [string, string, string][] = [
  ['Ankara', 'da', 'PTT Müzesi # bulunur.'],
  ['Kazakistan', 'da', 'Ak terek gök terek # de oynanır.'],
  ['Ayşe', 'nin', '# ninesi kilim dokur.'],
  ['Konya', 'ya', 'Okulca # gezi yaptık.'],
  ['Türkiye', 'nin', '# kültürü çok zengindir.'],
  ['Mehmet Âkif', 'in', 'İstiklâl Marşı # şiiridir.'],
]
const KESME7_Q: Q[] = [
  { q: 'Tarihe gelen ek hangisinde doğru yazılmış?', a: '23 Nisan’da gösteri var.', w: ['23 Nisanda gösteri var.', '23 nisan’da gösteri var.', '23 Nisan da gösteri var.'], ex: 'Belirli tarihteki ay adı büyük harfle başlar, ek kesmeyle ayrılır: 23 Nisan’da.' },
  { q: 'Rakama gelen ek hangisinde doğru yazılmış?', a: 'Sınıfta 25’ten fazla kitap var.', w: ['Sınıfta 25ten fazla kitap var.', 'Sınıfta 25 ten fazla kitap var.'], ex: 'Rakamla yazılan sayılara gelen ekler kesmeyle ayrılır: 25’ten.' },
  { q: 'Bayram tarihi hangisinde doğru yazılmış?', a: '29 Ekim’de bayram coşkusu vardı.', w: ['29 ekimde bayram coşkusu vardı.', '29 Ekimde bayram coşkusu vardı.'], ex: 'Belirli tarihteki ay adı büyük harfle yazılır, ek kesmeyle ayrılır.' },
  { q: 'Saate gelen ek hangisinde doğru yazılmış?', a: 'Gösteri 10’da başlayacak.', w: ['Gösteri 10da başlayacak.', 'Gösteri 10 da başlayacak.'], ex: 'Rakama gelen ek kesmeyle ayrılır: 10’da.' },
  { q: 'Hangisinde kesme işareti gereksiz kullanılmış?', a: 'Kilim’i odama serdim.', w: ['Ayşe’nin kilimi güzel.', 'Ankara’da müze gezdik.'], ex: '“kilim” özel ad değildir; ekini kesmeyle ayırmayız: kilimi.' },
  { q: 'Hangisinde kesme işareti doğru kullanılmış?', a: 'Halay, Anadolu’nun her yerinde oynanır.', w: ['Halay, Anadolunun her yerinde oynanır.', 'Halay’ı, Anadolu’nun her yerinde oynanır.'], ex: 'Özel ada gelen ek kesmeyle ayrılır; “halay” özel ad değildir.' },
]

/* ================================================================================================
 * TEMA 8 · HAK VE SORUMLULUKLARIMIZ
 * ================================================================================================ */
const SECIM: Metin = {
  t: 'Sınıf Başkanı Seçimi',
  img: 'raisedhand',
  text: '3-B sınıfında başkanlık seçimi yapıldı. Aday olan öğrenciler, sınıf için neler yapacaklarını anlattı. Her öğrenci oyunu gizlice kâğıda yazıp sandığa attı. Oylar sayıldığında Elif seçimi kazandı. Elif, “Herkesin fikrini dinleyeceğim.” dedi. Seçimi kaybeden Mert de Elif’i tebrik etti. Öğretmenleri, herkesin seçme ve seçilme hakkını saygıyla kullandığını söyledi.',
  qs: [
    { q: 'Sınıfta hangi seçim yapıldı?', a: 'Sınıf başkanlığı seçimi', w: ['Takım kaptanlığı', 'Okul müdürlüğü', 'Kütüphane nöbeti'], ex: 'Sınıf başkanı seçildi.' },
    { q: 'Öğrenciler oylarını nasıl kullandı?', a: 'Gizlice kâğıda yazarak', w: ['Bağırarak', 'Tahtaya yazarak', 'Kura çekerek'], ex: 'Oylar gizlice kâğıda yazılıp sandığa atıldı.' },
    { q: 'Seçimi kim kazandı?', a: 'Elif', w: ['Mert', 'Öğretmen', 'Deniz'], ex: 'Oylar sayılınca Elif kazandı.' },
    { q: 'Mert seçimi kaybedince ne yaptı?', a: 'Elif’i tebrik etti', w: ['Küstü', 'Sınıftan çıktı', 'Ağladı'], ex: 'Sonuca saygı gösterdi.' },
    { q: 'Sınıf Başkanı Seçimi metninin ana fikri nedir?', a: 'Seçme ve seçilme hakkımızı saygıyla kullanırız', w: ['Seçimi hep aynı kişi kazanır', 'Kaybeden üzülmelidir', 'Sandıklar çok büyüktür'], ex: 'Demokraside herkesin hakkına saygı duyarız.' },
  ],
}
const PARK: Metin = {
  t: 'Parktaki Sıra',
  img: 'kite',
  text: 'Cumartesi günü Deniz parkta salıncakta sallanıyordu. Yanına küçük bir çocuk gelip sırasını beklemeye başladı. Deniz biraz daha sallanmak istedi ama sırayı beklemenin de bir hak olduğunu düşündü. Salıncaktan inip çocuğa yer verdi. Ardından çevresine bakıp yerdeki kâğıtları çöp kutusuna attı. Annesi, “Oyun oynamak hakkın, parkı temiz tutmak da sorumluluğun.” dedi.',
  qs: [
    { q: 'Deniz parkta ne yapıyordu?', a: 'Salıncakta sallanıyordu', w: ['Kaydıraktan kayıyordu', 'Top oynuyordu', 'Kitap okuyordu'], ex: 'Deniz salıncaktaydı.' },
    { q: 'Küçük çocuk ne yaptı?', a: 'Sırasını bekledi', w: ['Deniz’i itti', 'Bağırdı', 'Eve gitti'], ex: 'Küçük çocuk sırasını bekledi.' },
    { q: 'Deniz salıncaktan inince ne yaptı?', a: 'Çocuğa yer verdi', w: ['Parktan kaçtı', 'Yeniden bindi', 'Salıncağı bozdu'], ex: 'Sırayı paylaştı.' },
    { q: 'Deniz yerdeki kâğıtları ne yaptı?', a: 'Çöp kutusuna attı', w: ['Rüzgâra bıraktı', 'Cebine koydu', 'Yırttı'], ex: 'Parkı temiz tutmak sorumluluğumuzdur.' },
    { q: 'Annesine göre oyun oynamak nedir?', a: 'Bir hak', w: ['Bir ceza', 'Bir ödev', 'Bir yasak'], ex: '“Oyun oynamak hakkın” dedi.' },
  ],
}
const SOZ8_P: P[] = [
  ['zanaat', 'El becerisiyle yapılan iş'],
  ['çırak', 'Usta yanında iş öğrenen'],
  ['çömlek', 'Topraktan yapılan kap'],
  ['tezahürat', 'Coşkulu alkış ve bağırış'],
  ['hatıra', 'Anı'],
  ['demokrasi', 'Halkın kendini yönetmesi'],
  ['şefkat', 'Sevecenlik'],
  ['latife', 'Şaka'],
]
const HAK_BINS: SortQ['bins'] = [
  { id: 'hak', label: 'Hak', img: 'balance', color: '#22c55e' },
  { id: 'sorumluluk', label: 'Sorumluluk', img: 'key', color: '#3b82f6' },
]
const HAK_ITEMS: SortQ['items'] = [
  { label: 'Oyun oynamak', bin: 'hak' },
  { label: 'Eğitim almak', bin: 'hak' },
  { label: 'Düşünceni söylemek', bin: 'hak' },
  { label: 'Sağlıklı büyümek', bin: 'hak' },
  { label: 'Dinlenmek', bin: 'hak' },
  { label: 'Sınıfı temiz tutmak', bin: 'sorumluluk' },
  { label: 'Trafik kurallarına uymak', bin: 'sorumluluk' },
  { label: 'Ödevini yapmak', bin: 'sorumluluk' },
  { label: 'Sırayı beklemek', bin: 'sorumluluk' },
  { label: 'Eşyalarını korumak', bin: 'sorumluluk' },
]
const PEK_Q: Q[] = [
  pekQ('sarı', 'sapsarı', ['sarsarı', 'sasarı', 'samsarı']),
  pekQ('uzun', 'upuzun', ['uzuzun', 'umuzun', 'usuzun']),
  pekQ('temiz', 'tertemiz', ['temtemiz', 'tetemiz', 'tesemiz']),
  pekQ('mavi', 'masmavi', ['mapmavi', 'mamavi', 'marmavi']),
  pekQ('kuru', 'kupkuru', ['kurkuru', 'kuskuru', 'kumkuru']),
  pekQ('hızlı', 'hıphızlı', ['hızhızlı', 'hısızlı', 'hımhızlı']),
  pekQ('yeşil', 'yemyeşil', ['yeyeşil', 'yepyeşil', 'yesyeşil']),
  pekQ('ıslak', 'sırılsıklam', ['ısıslak', 'ıslıslak', 'ıpıslak']),
  { q: 'Pekiştirme ne işe yarar?', a: 'Sözcüğün anlamını kuvvetlendirir', w: ['Sözcüğü zıt anlamlı yapar', 'Sözcüğü soruya çevirir', 'Sözcüğü kısaltır'], ex: 'sarı → sapsarı: daha çok sarı.' },
]
const PEK_P: P[] = [
  ['sarı', 'sapsarı'],
  ['uzun', 'upuzun'],
  ['kuru', 'kupkuru'],
  ['temiz', 'tertemiz'],
  ['mavi', 'masmavi'],
  ['siyah', 'simsiyah'],
  ['beyaz', 'bembeyaz'],
  ['kırmızı', 'kıpkırmızı'],
  ['yeşil', 'yemyeşil'],
]
const PEK_HIT = ['sapsarı', 'upuzun', 'tertemiz', 'masmavi', 'kupkuru', 'yemyeşil', 'kıpkırmızı', 'bembeyaz']
const PEK_WRONG = ['sarı', 'uzun', 'temiz', 'mavi', 'kuru', 'yeşil']
const GIZLI_Q: Q[] = [
  { q: 'Bir oyun sitesi ev adresini soruyor. Ne yaparsın?', a: 'Yazmam, bir büyüğüme söylerim', w: ['Hemen yazarım', 'Arkadaşımın adresini yazarım', 'Tahmin edip yazarım'], ex: 'Kişisel bilgilerimizi genel ağda paylaşmayız.' },
  { q: 'Hangisini genel ağda herkesle paylaşmayız?', a: 'Telefon numaramızı', w: ['En sevdiğimiz rengi', 'Sevdiğimiz masalı', 'Bir hayvan çizimini'], ex: 'Telefon numarası kişisel bilgidir.' },
  { q: 'Şifremizi kimlerle paylaşabiliriz?', a: 'Yalnızca ailemizle', w: ['Bütün sınıfla', 'Tanımadığımız kişilerle', 'Oyundaki herkesle'], ex: 'Şifre gizlidir; yalnızca ailemiz bilir.' },
  { q: 'Tanımadığın biri genel ağda sana mesaj attı. Ne yaparsın?', a: 'Ailemle konuşurum', w: ['Hemen cevap veririm', 'Fotoğrafımı gönderirim', 'Adresimi yazarım'], ex: 'Tanımadığımız kişilere bilgi vermeyiz, ailemize söyleriz.' },
  { q: 'Ekrandan okurken hangisi doğrudur?', a: 'Ekrana uygun mesafeden bakarım', w: ['Ekrana çok yakın bakarım', 'Gözlerimi hiç dinlendirmem', 'Karanlıkta okurum'], ex: 'Gözlerimizi korumak için mesafe ve mola önemlidir.' },
  { q: 'Duygularını saygıyla ifade etmek nedir?', a: 'Bir hakkımızdır', w: ['Bir ceza', 'Bir yasak', 'Bir hata'], ex: 'İfade özgürlüğü temel haklarımızdandır.' },
]
const TUR_P: P[] = [
  ['Masal', 'Olağanüstü olaylar anlatır'],
  ['Fabl', 'Hayvanlarla ders verir'],
  ['Belgesel', 'Gerçek bilgiler gösterir'],
  ['Röportaj', 'Biriyle yapılan söyleşi'],
  ['Şiir', 'Duyguları dizelerle anlatır'],
  ['Çizgi film', 'Çizimlerle canlanan film'],
]
const YONERGE_O: O[] = [
  { q: 'Seksek oyununun yönergesini sırala.', s: ['Yere kareler çiz', 'Taşı ilk kareye at', 'Tek ayakla zıpla', 'Taşı alıp geri dön'], ex: 'Yönergeler işi adım adım anlatır.', img: 'checkered' },
  { q: 'Bir resim çizdirme yönergesini sırala.', s: ['Ortaya büyük bir daire çiz', 'Dairenin içine iki göz yap', 'Altına gülen bir ağız çiz', 'Etrafına güneş ışınları ekle'], ex: 'Ayrıntılı yönergeyle herkes aynı resmi çizebilir.', img: 'sun' },
  { q: 'El yıkama yönergesini sırala.', s: ['Elini ıslat', 'Sabunla köpürt', 'Durula', 'Kurula'], ex: 'Adımlar sırayla uygulanır.', img: 'soap' },
  { q: 'Fidan dikme yönergesini sırala.', s: ['Bir büyüğünle çukur kaz', 'Fidanı çukura koy', 'Toprağı bastır', 'Can suyunu ver'], ex: 'Yönergeler açık ve sıralı yazılır.', img: 'seedling' },
]
const T8_O: O[] = [
  { q: 'Sınıf seçimini sırala.', s: ['Adaylar belirlendi', 'Adaylar konuştu', 'Oylar sandığa atıldı', 'Oylar sayıldı', 'Başkan açıklandı'], ex: 'Seçim adımları sırayla yapılır.', img: 'raisedhand' },
  { q: 'Usta ile çırağın hikâyesini sırala.', s: ['Kalfa çömlek yaptı', 'Usta daha iyisini istedi', 'Kalfa yeniden denedi', 'Kalfa usta oldu'], ex: 'Başarı azim ve sabrın meyvesidir.', img: 'jar' },
  { q: 'Parktaki olayları sırala.', s: ['Deniz salıncakta sallandı', 'Küçük çocuk sırasını bekledi', 'Deniz ona yer verdi', 'Kâğıtları çöpe attı'], ex: 'Hakkımızı kullanırken sorumluluğumuzu da yerine getiririz.', img: 'kite' },
  { q: 'Selam veren bilgenin hikâyesini sırala.', s: ['Çocuklar seksek oynuyordu', 'Bilgeyi görüp selam verdiler', 'Bir çocuk beklemesini istedi', 'Bilge oyun bitene kadar bekledi'], ex: 'Çocuklara gösterilen nezaket saygıyı doğurur.', img: 'checkered' },
]
const T8_C: string[][] = [
  ['Oyun', 'oynamak', 'her', 'çocuğun', 'hakkıdır.'],
  ['Sınıfımızı', 'tertemiz', 'tutarız.'],
  ['Herkesin', 'fikrine', 'saygı', 'duyarız.'],
  ['Paylaşmak', 'bizi', 'mutlu', 'eder.'],
  ['Gökyüzü', 'masmavi', 'görünüyordu.'],
]
const T8_TF: TF[] = [
  ['Oyun oynamak her çocuğun hakkıdır.', true, 'Çocuk hakları arasında oyun hakkı da vardır.'],
  ['Sınıfı temiz tutmak yalnızca velilerin görevidir.', false, 'Sınıfımızı temiz tutmak hepimizin sorumluluğudur.'],
  ['Genel ağda adresimizi herkesle paylaşabiliriz.', false, 'Kişisel bilgilerimizi gizli tutarız.'],
  ['“masmavi” pekiştirmeli bir sözcüktür.', true, 'mavi → masmavi.'],
  ['Pekiştirmeli sözcükler ayrı yazılır.', false, 'Pekiştirmeli sözcükler bitişik yazılır: tertemiz.'],
  ['Duygularımızı ifade etmek bir haktır.', true, 'Düşüncelerimizi ve duygularımızı saygıyla söyleyebiliriz.'],
  ['Çırak, bir ustanın yanında iş öğrenen kişidir.', true, 'Çırak zamanla kalfa, sonra usta olur.'],
  ['Bütün çocuklar aynı haklara sahiptir.', true, 'Rengi, dili ne olursa olsun her çocuğun hakları vardır.'],
]
const NOKTA_GOREV_P: P[] = [
  ['Nokta (.)', 'Cümlenin bittiğini gösterir'],
  ['Virgül (,)', 'Eş görevli sözcükleri ayırır'],
  ['Ünlem (!)', 'Seslenmeyi ve coşkuyu gösterir'],
  ['Üç nokta (...)', 'Tamamlanmamış sözü gösterir'],
  ['Soru işareti (?)', 'Soru cümlesinin sonuna gelir'],
  ['İki nokta (:)', 'Açıklamadan önce gelir'],
  ['Kesme işareti (’)', 'Özel ada gelen eki ayırır'],
]
const NOKTA8_Q: Q[] = [
  { q: '“Ayşe ___ Azıcık bekle!” Seslenmeden sonra hangi işaret gelir?', a: 'Ünlem işareti (!)', w: ['Nokta (.)', 'Soru işareti (?)', 'İki nokta (:)'], ex: 'Güçlü seslenmeden sonra ünlem konur.' },
  { q: '“Şefkatli ___ merhametli ve bilge bir insandı.” Boşluğa ne gelir?', a: 'Virgül (,)', w: ['Nokta (.)', 'Ünlem işareti (!)', 'Kesme işareti (’)'], ex: 'Eş görevli sözcükler virgülle ayrılır.' },
  { q: '“Bugün yapacak bir dolu iş var ___” Söz tamamlanmadıysa sona ne gelir?', a: 'Üç nokta (...)', w: ['Soru işareti (?)', 'Virgül (,)', 'İki nokta (:)'], ex: 'Üç nokta tamamlanmamış sözü gösterir.' },
  { q: '“Zeynep, Ömer ___ e döndü.” Boşluğa hangi işaret gelir?', a: 'Kesme işareti (’)', w: ['Virgül (,)', 'Nokta (.)', 'Ünlem işareti (!)'], ex: 'Özel ada gelen ek kesmeyle ayrılır: Ömer’e.' },
  { q: '“Merhaba Arkadaşım ___” Mektuptaki hitaptan sonra ne gelir?', a: 'Virgül (,)', w: ['Soru işareti (?)', 'Nokta (.)', 'Üç nokta (...)'], ex: 'Hitaptan sonra virgül konur.' },
  { q: '“Ömer şaşırdı ve sordu ___ Nasıl yani?” Boşluğa ne gelir?', a: 'İki nokta (:)', w: ['Virgül (,)', 'Kesme işareti (’)', 'Nokta (.)'], ex: 'Aktarılacak sözden önce iki nokta konabilir.' },
]

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
export const TR3_ADALAR: Alan[] = [
  {
    id: 't1',
    no: 1,
    title: 'Değerlerimizle Yaşıyoruz',
    color: '#f0504a',
    dark: '#b8302c',
    icon: 'heart',
    acts: [
      { kind: 'okuma-kapi', title: 'Kapıyı Tıklatan Kardeş', icon: 'house', total: T, meb: 'T.O.3.3.c', gen: oku(KAPI), ders: 'Metni oku. Kim, ne yaptı? Metnin ana fikri ne?', points: ['Önce başlığa ve resme bak', 'Konuyu tahmin et', 'Soruyu metinde ara'], visual: img('house') },
      { kind: 'okuma-para', title: 'Bahçedeki Para', icon: 'coin', total: T, meb: 'T.O.3.3.a', gen: oku(PARA), ders: 'Emir’in seçimini oku. Karakterleri ve olayları tanı.', visual: img('coin') },
      { kind: 'sozluk', title: 'Sözcüğün Anlamı', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: rot(ch(SOZ1_Q), mt('Sözcüğü anlamıyla eşleştir.', 'Bilmediğimiz sözcüğün anlamını cümleden tahmin ederiz.', SOZ1_P)), ders: 'Bilmediğin bir sözcük mü var? Cümleye bak, anlamını tahmin et, sonra sözlükten kontrol et.', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Sözcükler ve anlamları.', SOZ1_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'zit-anlam', title: 'Zıt Anlam Terazisi', icon: 'balance', total: T, meb: 'T.O.3.2.h', gen: mt('Zıt anlamlı sözcükleri eşleştir.', 'Anlamları birbirinin karşıtı olan sözcükler zıt anlamlıdır.', ZIT1_P), ders: 'Zıt anlamlı sözcükler: güzel – çirkin, açmak – kapatmak, erken – geç.', visual: img('balance') },
      { kind: 'saygi-sepet', title: 'Saygılı mı, Değil mi?', icon: 'handshake', total: 4, meb: 'T.K.3.1.ç', gen: srt('Davranışları sepetlere ayır.', 'Saygılı davranışlar herkesi mutlu eder.', SAYGI_BINS, SAYGI_ITEMS), ders: 'Kapıyı tıklatmak, izin istemek, selam vermek saygılıdır. İzinsiz girmek saygısızlıktır.', visual: img('handshake') },
      { kind: 'buyuk-harf', title: 'Büyük Harf Avcısı', icon: 'abc', total: T, meb: 'T.Y.3.3.f', gen: ch(BUYUK1_Q), ders: 'Cümle başı ve özel isimler (kişi, şehir, ülke, okul, dergi adı) büyük harfle başlar.', points: ['Türkiye, Ankara', 'Bilim Çocuk dergisi', 'Arda, Neşe ve ben'], visual: img('abc') },
      { kind: 'duygu', title: 'Duyguyu Bul', icon: 'happy', total: T, meb: 'T.O.3.3.a', gen: ch(DUYGU1_Q), ders: 'Metinlerdeki karakterler neler hissediyor? Neşe, merhamet, pişmanlık, sevinç…', visual: img('happy') },
      { kind: 'alfabe', title: 'Alfabetik Sıra', icon: 'books', total: T, meb: 'T.Y.3.2.b', gen: ord(ALFABE_O), ders: 'Sözlükte sözcükler alfabetik sıradadır. İlk harfler aynıysa ikinci harfe bakarız.', visual: img('books') },
      { kind: 'sirala', title: 'Önce, Sonra', icon: 'link', total: T, meb: 'T.O.3.2.ç', gen: ord(T1_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T1_C, 'train'), ders: 'Sözcükleri doğru sıraya diz; anlamlı ve kurallı bir cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T1_TF, 'heart'), ders: 'Her cümleyi dikkatle oku. Doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-kopru', title: 'Selam Köprüsü', icon: 'trophy', total: OYUN, meb: 'T.O.3.3.c', oyun: true, gen: karma(tf(T1_TF), ch(BUYUK1_Q), ch(SOZ1_Q), oku(KAPI, PARA)), ders: 'Fındık köprüden geçiyor! Her tahta bir soru. Doğru cevapla karşıya ulaş.', visual: img('trophy') },
      { kind: 'oyun-kapi', title: 'Saygı Kapısı', icon: 'house', total: 4, meb: 'T.K.3.1.ç', oyun: true, gen: rot(mem('Zıt anlamlı kartları eşleştir!', 'Zıt anlamlı sözcükler.', ZIT1_P), pop('Saygılı sözleri patlat!', 'Bunlar nazik ve saygılı sözlerdir.', SAYGI_HIT, SAYGI_WRONG), srt('Davranışları sepetlere ayır.', 'Saygılı davranışlar.', SAYGI_BINS, SAYGI_ITEMS)), ders: 'Kapıyı aç: kartları eşleştir, balonları patlat!', visual: img('house') },
    ],
  },
  {
    id: 't2',
    no: 2,
    title: 'Atatürk ve Kahramanlarımız',
    color: '#dc2626',
    dark: '#991b1b',
    icon: 'trflag',
    acts: [
      { kind: 'okuma-fener', title: 'Bayram Fenerleri', icon: 'candle', total: T, meb: 'T.O.3.3.c', gen: oku(FENER), ders: 'Fener alayını oku. Ana duyguyu ve benzetmeyi bul.', visual: img('candle') },
      { kind: 'okuma-kitaplik', title: 'Atatürk’ün Kitaplığı', icon: 'books', total: T, meb: 'T.O.3.3.b', gen: oku(KITAPLIK), ders: 'Atatürk’ün kitap sevgisini oku. Konu ve ana fikir ne?', visual: img('books') },
      { kind: 'kavram', title: 'Kavram Eşleştir', icon: 'medal', total: T, meb: 'T.Y.3.3.b', gen: mt('Kavramı anlamıyla eşleştir.', 'Temamızın anahtar kavramları.', KAVRAM2_P), ders: 'Fedakârlık, vatanseverlik, millî irade, cesaret, cumhuriyet…', visual: img('medal') },
      { kind: 'sozluk', title: 'Bayram Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: rot(ch(SOZ2_Q), mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ2_P)), ders: 'Balo, engin, övünç, flama, devasa… Cümleden anlamı tahmin et.', visual: img('openbook') },
      { kind: 'es-anlam', title: 'Eş Anlam Köprüsü', icon: 'link', total: T, meb: 'T.O.3.2.h', gen: mt('Eş anlamlı sözcükleri eşleştir.', 'Yazılışları farklı, anlamları aynı olan sözcüklere eş anlamlı denir.', ES2_P), ders: 'Eş anlamlı sözcükler aynı anlama gelir: yurt – vatan, yiğit – kahraman.', points: ['düş – rüya', 'mühim – önemli', 'kuvvetli – güçlü'], visual: img('link') },
      { kind: 'es-balon', title: 'Eş Anlam Balonları', icon: 'balloon', total: 3, meb: 'T.Y.3.2.f', gen: pop('Eş anlamlı çiftleri patlat!', 'Bu çiftler eş anlamlıdır.', ES2_HIT, ES2_WRONG), ders: 'Yalnızca eş anlamlı çiftlerin balonlarını patlat. Zıt çiftlere dikkat!', visual: img('balloon') },
      { kind: 'zit-anlam', title: 'Zıt Anlam', icon: 'balance', total: T, meb: 'T.Y.3.2.e', gen: rot(ch(ZIT2_Q), mt('Zıt anlamlı sözcükleri eşleştir.', 'Zıt anlamlı sözcükler.', ZIT2_P)), ders: 'cesur – korkak, zafer – yenilgi, zor – kolay.', visual: img('balance') },
      { kind: 'mektup', title: 'Mektup Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.2.ı', gen: rot(ord(MEKTUP_O), ch(MEKTUP_Q)), ders: 'Mektup: hitap, giriş, gelişme, sonuç, ad ve imza. Tarih sağ üste yazılır. (Gerçek gönderim yapılmaz.)', visual: img('memo') },
      { kind: 'olay-sepet', title: 'Hazırlık mı, Tören mi?', icon: 'tshirt', total: 4, meb: 'T.O.3.2.ğ', gen: srt('Olayları sepetlere ayır.', 'Olayları özelliklerine göre sınıflandırırız.', OLAY2_BINS, OLAY2_ITEMS), ders: 'Bayram öncesi hazırlık olaylarını ve tören olaylarını ayır.', visual: img('tshirt') },
      { kind: 'kitap-turu', title: 'Kitap Türleri', icon: 'book', total: T, meb: 'T.O.3.2.ğ', gen: mt('Kitap türünü özelliğiyle eşleştir.', 'Her kitap türünün bir özelliği vardır.', KITAP_TUR_P), ders: 'Matematik, tarih, şiir, dil ve bilim kitapları bize farklı şeyler öğretir.', visual: img('book') },
      { kind: 'sirala', title: 'Bayram Sırası', icon: 'link', total: T, meb: 'T.O.3.2.ç', gen: ord(T2_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T2_C, 'train'), ders: 'Sözcükleri sırala, anlamlı bir cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T2_TF, 'trflag'), ders: 'Eş anlam, mektup, kesme ve bayramlar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-fener', title: 'Fener Alayı', icon: 'trophy', total: OYUN, meb: 'T.O.3.2.h', oyun: true, gen: karma(ch(ZIT2_Q), kisaltma(KIS), tf(T2_TF), oku(FENER, KITAPLIK)), ders: 'Fındık fener alayında! Her doğru cevap bir fener yakar.', visual: img('trophy') },
      { kind: 'oyun-es', title: 'Eş Anlam Hafızası', icon: 'puzzle', total: 4, meb: 'T.Y.3.2.f', oyun: true, gen: rot(mem('Eş anlamlı kartları eşleştir!', 'Eş anlamlı sözcükler.', ES2_P), pop('Eş anlamlı çiftleri patlat!', 'Bunlar eş anlamlıdır.', ES2_HIT, ES2_WRONG), srt('Olayları sepetlere ayır.', 'Hazırlık ve tören olayları.', OLAY2_BINS, OLAY2_ITEMS)), ders: 'Kartları çevir, balonları patlat!', visual: img('puzzle') },
    ],
  },
  {
    id: 't3',
    no: 3,
    title: 'Doğayı Tanıyoruz',
    color: '#16a34a',
    dark: '#166534',
    icon: 'evergreen',
    acts: [
      { kind: 'okuma-sincap', title: 'Sincabın Kış Hazırlığı', icon: 'squirrel', total: T, meb: 'T.O.3.3.a', gen: oku(SINCAP), ders: 'Çıtır’ın hikâyesini oku. Neden–sonuç ilişkisine dikkat et!', visual: img('squirrel') },
      { kind: 'okuma-kova', title: 'Musluktaki Kova', icon: 'droplet', total: T, meb: 'T.O.3.3.c', gen: oku(KOVA), ders: 'Defne’nin deneyini oku. Ana fikri bul.', visual: img('droplet') },
      { kind: 'sozluk', title: 'Doğa Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ3_P), ders: 'Koloni, refah, hasar, set, israf, tasarruf…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Doğa sözcükleri.', SOZ3_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'canli-cansiz', title: 'Canlı mı, Cansız mı?', icon: 'ant', total: 4, meb: 'T.D.3.2.g', gen: srt('Varlıkları sepetlere ayır.', 'Canlılar büyür, beslenir, çoğalır.', CANLI_BINS, CANLI_ITEMS), ders: 'Salyangoz, mantar, karınca canlıdır; dürbün, toprak, taş cansızdır.', visual: img('ant') },
      { kind: 'zaman', title: 'Zaman Yolculuğu', icon: 'clock', total: T, meb: 'T.K.3.3.f', gen: rot(srt('Cümleleri zamanlarına göre ayır.', 'Geçmiş, şimdiki ve gelecek zaman.', ZAMAN_BINS, ZAMAN_ITEMS), ch(ZAMAN_Q)), ders: 'Geçmiş: Dün yürüdüm. Şimdiki: Şu anda yürüyorum. Gelecek: Yarın yürüyeceğim.', points: ['dün, geçen hafta → geçmiş', 'şu anda → şimdiki', 'yarın → gelecek'], visual: img('clock') },
      { kind: 'es-anlam', title: 'Eş Anlamlılar', icon: 'link', total: T, meb: 'T.O.3.2.h', gen: mt('Eş anlamlı sözcükleri eşleştir.', 'Eş anlamlı sözcükler aynı anlama gelir.', ES3_P), ders: 'hedef – amaç, vakit – zaman, yuva – barınak, çabuk – hızlı.', visual: img('link') },
      { kind: 'zit-balon', title: 'Zıt Balonlar', icon: 'balloon', total: 3, meb: 'T.K.3.2.e', gen: pop('Zıt anlamlı çiftleri patlat!', 'Bu çiftler zıt anlamlıdır.', ZIT3_HIT, ZIT3_WRONG), ders: 'gündüz – gece, ağlamak – gülmek… Eş anlamlı çiftlere dokunma!', visual: img('balloon') },
      { kind: 'afet', title: 'Doğa Olayları', icon: 'shield', total: T, meb: 'T.Y.3.3.b', gen: mt('Doğa olayını tanımıyla eşleştir.', 'Doğa olaylarını tanırsak önlem alabiliriz.', AFET_P), ders: 'Doğa olaylarını tanıyalım. Ailemizle afet çantası hazırlamak ve plan yapmak bizi korur.', visual: img('shield') },
      { kind: 'atasozu', title: 'Atasözü Ağacı', icon: 'scroll', total: T, meb: 'T.K.3.2.m', gen: ch(ATA3_Q), ders: 'Atasözleri öğüt verir: Birlikten kuvvet doğar. Damlaya damlaya göl olur.', visual: img('scroll') },
      { kind: 'sirala', title: 'Adım Adım', icon: 'cloud', total: T, meb: 'T.O.3.2.ç', gen: ord(T3_O), ders: 'Su döngüsünü, deney yönergesini ve olayları sırala.', visual: img('cloud') },
      { kind: 'cumle', title: 'Doğa Cümleleri', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T3_C, 'train'), ders: 'Karışık sözcüklerden anlamlı cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T3_TF, 'seedling'), ders: 'Doğa, zaman ve sözcükler: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-set', title: 'Kunduzun Seti', icon: 'trophy', total: OYUN, meb: 'T.O.3.2.ğ', oyun: true, gen: karma(srt('Varlıkları sepetlere ayır.', 'Canlı ve cansız.', CANLI_BINS, CANLI_ITEMS), ch(ZAMAN_Q), ch(ATA3_Q), oku(SINCAP, KOVA)), ders: 'Kunduza yardım et! Her doğru cevap sete bir dal ekler.', visual: img('trophy') },
      { kind: 'oyun-orman', title: 'Orman Hafızası', icon: 'evergreen', total: 4, meb: 'T.O.3.2.h', oyun: true, gen: rot(mem('Eş anlamlı kartları eşleştir!', 'Eş anlamlı sözcükler.', ES3_P), pop('Zıt anlamlı çiftleri patlat!', 'Zıt anlamlı sözcükler.', ZIT3_HIT, ZIT3_WRONG), avi(DOGA_KELIME, 'Ormanda saklanan kelimeleri bul!')), ders: 'Her doğru cevap ormana bir ağaç diker!', visual: img('evergreen') },
    ],
  },
  {
    id: 't4',
    no: 4,
    title: 'Bilgi Hazinemiz',
    color: '#2563eb',
    dark: '#1e40af',
    icon: 'books',
    acts: [
      { kind: 'okuma-kart', title: 'Kütüphane Kartı', icon: 'book', total: T, meb: 'T.O.3.3.c', gen: oku(KART), ders: 'Ali kütüphanede. Oku ve soruları cevapla.', visual: img('book') },
      { kind: 'okuma-sayfa', title: 'Uçan Sayfalar', icon: 'owl', total: T, meb: 'T.O.3.2.f', gen: oku(SAYFA), ders: 'Elif’in rüyasını oku. Hangisi gerçek, hangisi hayal?', visual: img('owl') },
      { kind: 'sozluk', title: 'Kitap Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Okudukça sözcüklerimiz çoğalır.', SOZ4_P), ders: 'Cemre, derya, destan, pusula, ilham…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Kitap sözcükleri.', SOZ4_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'neden-sonuc', title: 'Neden, Sonuç', icon: 'thinking', total: T, meb: 'T.Y.3.2.o', gen: ch(NEDEN4_Q), ders: 'Neden–sonuç cümlelerinde “için, çünkü, bu yüzden, bu nedenle” kullanılır.', points: ['Neden → çünkü …', 'Sonuç → bu yüzden …'], visual: img('thinking') },
      { kind: 'baglac', title: 'Bağlama Ögeleri', icon: 'link', total: T, meb: 'T.K.3.3.ğ', gen: ch(BAGLAC_Q), ders: 've, veya, ya da, ile, ama, fakat, çünkü: tek başına anlamı olmayan ama cümleleri bağlayan sözcükler.', visual: img('link') },
      { kind: 'gercek-hayal', title: 'Gerçek mi, Hayal mi?', icon: 'sparkles', total: 4, meb: 'T.D.3.2.e', gen: srt('Olayları sepetlere ayır.', 'Gerçekte olabilenler ve hayal ürünleri.', HAYAL_BINS, HAYAL_ITEMS), ders: 'Kitaplarda bazı olaylar gerçekte olabilir, bazıları hayal ürünüdür.', visual: img('sparkles') },
      { kind: 'kitap-fayda', title: 'Kitaplar Ne Söyler?', icon: 'book2', total: 4, meb: 'T.O.3.2.ğ', gen: srt('Kitapların yanlarını sepetlere ayır.', 'Kitaplar hem eğlendirir hem öğretir.', FAYDA_BINS, FAYDA_ITEMS), ders: 'Kitaplar bizi eğlendirir, şaşırtır; hafızamızı ve sözcük dağarcığımızı geliştirir.', visual: img('book2') },
      { kind: 'dilekce', title: 'Dilekçe Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.2.ı', gen: rot(ord(DILEKCE_O), ch(DILEKCE_Q)), ders: 'Dilekçe bir kuruma yazılır: kurumun adı, istek, saygı sözü, tarih, ad ve imza. (Uygulamada kişisel bilgi yazılmaz.)', visual: img('memo') },
      { kind: 'kelime-avi', title: 'Kelime Avı', icon: 'magnifier', total: 3, meb: 'T.Y.3.3.b', gen: avi(KITAP_KELIME, 'Tablodaki kitap kelimelerini bul!'), ders: 'Tabloda saklanan kelimeleri bul.', visual: img('magnifier') },
      { kind: 'sirala', title: 'Okuma Yolculuğu', icon: 'compass', total: T, meb: 'T.O.3.2.ç', gen: ord(T4_O), ders: 'Adımları ve olayları sırasıyla diz.', visual: img('compass') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T4_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T4_TF, 'openbook'), ders: 'Yazım, dilekçe ve kitaplar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-pusula', title: 'Pusula Yolu', icon: 'trophy', total: OYUN, meb: 'T.Y.3.2.o', oyun: true, gen: karma(ch(NEDEN4_Q), ch(BAGLAC_Q), ch(YAZIM4_Q), oku(KART, SAYFA)), ders: 'Pusulayı takip et! Her doğru cevap seni bilgi hazinesine yaklaştırır.', visual: img('trophy') },
      { kind: 'oyun-raflar', title: 'Kütüphane Rafları', icon: 'books', total: 4, meb: 'T.O.3.2.ğ', oyun: true, gen: rot(srt('Kitapların yanlarını rafa koy.', 'Eğlenceli ve öğretici.', FAYDA_BINS, FAYDA_ITEMS), mem('Sözcük kartlarını eşleştir!', 'Kitap sözcükleri.', SOZ4_P), avi(KITAP_KELIME, 'Raflarda saklanan kelimeleri bul!')), ders: 'Rafları düzenle, kartları eşleştir!', visual: img('books') },
    ],
  },
  {
    id: 't5',
    no: 5,
    title: 'Yeteneklerimizi Kullanıyoruz',
    color: '#db2777',
    dark: '#9d174d',
    icon: 'palette',
    acts: [
      { kind: 'okuma-baglama', title: 'Bağlamanın Telleri', icon: 'guitar', total: T, meb: 'T.O.3.2.e', gen: oku(BAGLAMA), ders: 'Can’ın müzik yolculuğunu oku. Ne çıkarım yapabilirsin?', visual: img('guitar') },
      { kind: 'okuma-kale', title: 'Kumdan Kale Yarışması', icon: 'castle', total: T, meb: 'T.O.3.3.a', gen: oku(KALE), ders: 'Takımın hikâyesini oku. Karakter, olay, yer: hikâye unsurlarını bul.', visual: img('castle') },
      { kind: 'sozluk', title: 'Sanat Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ5_P), ders: 'Filografi, ebru, faal, çevik, azim, antrenör…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Sanat ve spor sözcükleri.', SOZ5_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'cikarim', title: 'Çıkarım Dedektifi', icon: 'detective', total: T, meb: 'T.O.3.2.e', gen: ch(CIKARIM_Q), ders: 'Metinde her bilgi açıkça yazmaz. İpuçlarından yola çıkarak bilgi bulmaya çıkarım yapmak denir.', visual: img('detective') },
      { kind: 'kisilik-duygu', title: 'Kişilik mi, Duygu mu?', icon: 'happy', total: 4, meb: 'T.O.3.3.a', gen: srt('Sözcükleri sepetlere ayır.', 'Kişilik özelliği kalıcıdır, duygu geçicidir.', KISILIK_BINS, KISILIK_ITEMS), ders: 'Meraklı, çalışkan → kişilik özelliği. Heyecan, endişe → duygu.', visual: img('happy') },
      { kind: 'benzetme', title: 'Gibi Gibi', icon: 'sparkles', total: T, meb: 'T.Y.3.2.n', gen: ch(BENZ5_Q), ders: 'Benzetmede bir varlık “gibi” ya da “kadar” ile başka bir varlığa benzetilir.', points: ['pamuk gibi beyaz', 'şimşek gibi hızlı', 'arı kadar çalışkan'], visual: img('sparkles') },
      { kind: 'es-anlam', title: 'Eş Anlam Bulmacası', icon: 'link', total: T, meb: 'T.K.3.2.f', gen: mt('Eş anlamlı sözcükleri eşleştir.', 'Eş anlamlı sözcükler.', ES5_P), ders: 'anı – hatıra, doğa – tabiat, sözcük – kelime, hediye – armağan.', visual: img('link') },
      { kind: 'atasozu', title: 'Atasözü Eşleştir', icon: 'scroll', total: T, meb: 'T.K.3.2.m', gen: mt('Atasözünü anlamıyla eşleştir.', 'Atasözleri kısa ve öğüt veren sözlerdir.', ATA5_P), ders: 'İşleyen demir ışıldar: Çalışan gelişir.', visual: img('scroll') },
      { kind: 'deger-balon', title: 'Oyunun Değerleri', icon: 'balloon', total: 3, meb: 'T.K.3.1.ç', gen: pop('Oyunda önemli değerleri patlat!', 'Bu değerler oyunu herkes için güzel yapar.', DEGER_HIT, DEGER_WRONG), ders: 'Sabır, dürüstlük, paylaşmak, empati… Oyunda önemli değerler.', visual: img('balloon') },
      { kind: 'sirala', title: 'Başarı Yolu', icon: 'target', total: T, meb: 'T.O.3.2.ç', gen: ord(T5_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('target') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T5_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T5_TF, 'palette'), ders: 'Kişilik, duygu, benzetme ve çıkarım: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-sahne', title: 'Yetenek Sahnesi', icon: 'trophy', total: OYUN, meb: 'T.O.3.2.e', oyun: true, gen: karma(ch(CIKARIM_Q), ch(BENZ5_Q), tf(T5_TF), oku(BAGLAMA, KALE)), ders: 'Sahne senin! Her doğru cevapta alkışlar yükselir.', visual: img('trophy') },
      { kind: 'oyun-golge', title: 'Gölge Oyunu', icon: 'theater', total: 4, meb: 'T.K.3.2.f', oyun: true, gen: rot(mem('Eş anlamlı kartları eşleştir!', 'Eş anlamlı sözcükler.', ES5_P), pop('Oyunda önemli değerleri patlat!', 'Oyunun değerleri.', DEGER_HIT, DEGER_WRONG), srt('Sözcükleri sepetlere ayır.', 'Kişilik ve duygu.', KISILIK_BINS, KISILIK_ITEMS)), ders: 'Perdenin arkasında kartlar ve balonlar seni bekliyor!', visual: img('theater') },
    ],
  },
  {
    id: 't6',
    no: 6,
    title: 'Bilim Yolculuğu',
    color: '#7c3aed',
    dark: '#5b21b6',
    icon: 'rocket',
    acts: [
      { kind: 'okuma-teleskop', title: 'Gökyüzünü Gözleyen Kız', icon: 'telescope', total: T, meb: 'T.O.3.3.a', gen: oku(TELESKOP), ders: 'Zehra’nın gözlemini oku. Merak ve araştırma!', visual: img('telescope') },
      { kind: 'okuma-eatik', title: 'Eski Telefonun Yolculuğu', icon: 'phone', total: T, meb: 'T.O.3.3.c', gen: oku(EATIK), ders: 'E-atıklar nereye gider? Oku ve öğren.', visual: img('phone') },
      { kind: 'sozluk', title: 'Bilim Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Bilim sözcükleri.', SOZ6_P), ders: 'Mucit, icat, uydu, festival, kâşif…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Bilim sözcükleri.', SOZ6_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'gercek-mecaz', title: 'Gerçek mi, Mecaz mı?', icon: 'bulb', total: T, meb: 'T.O.3.3.d', gen: rot(srt('Cümleleri sepetlere ayır.', 'Gerçek anlam akla ilk gelendir; mecaz anlam sonradan kazanılan anlamdır.', GM_BINS, GM_ITEMS), ch(GM_Q)), ders: 'Hava soğuk (gerçek). Bana soğuk davrandı (mecaz: ilgisiz).', points: ['Gerçek: akla ilk gelen anlam', 'Mecaz: yeni kazanılan anlam'], visual: img('bulb') },
      { kind: 'deyim', title: 'Deyimler', icon: 'mask', total: T, meb: 'T.Y.3.3.c', gen: mt('Deyimi anlamıyla eşleştir.', 'Deyimler sözcüklerin gerçek anlamından farklı bir anlam taşır.', DEYIM_P), ders: 'Etekleri zil çalmak: çok sevinmek. Bir taşla iki kuş vurmak: tek işle iki iş başarmak.', visual: img('mask') },
      { kind: 'atasozu', title: 'Atasözünü Tamamla', icon: 'scroll', total: T, meb: 'T.K.3.2.m', gen: ch(ATA6_Q), ders: 'Atasözleri atalarımızın öğütleridir: Ağaç yaşken eğilir. Emek olmadan yemek olmaz.', visual: img('scroll') },
      { kind: 'yazisma', title: 'Yazışma Bölümleri', icon: 'laptop', total: 4, meb: 'T.Y.3.1.ç', gen: srt('İfadeleri yazışmanın bölümlerine ayır.', 'Yazışma başlatılır, sürdürülür ve nazikçe sonlandırılır.', YAZISMA_BINS, YAZISMA_ITEMS), ders: 'Merhaba ile başla, amacını anlat, teşekkür ederek bitir. (Gerçek gönderim yapılmaz.)', visual: img('laptop') },
      { kind: 'yontem', title: 'Okuma ve Dinleme Yöntemleri', icon: 'headphone', total: T, meb: 'T.O.3.1.ç', gen: mt('Yöntemi açıklamasıyla eşleştir.', 'Amacımıza göre yöntem seçeriz.', YONTEM_P), ders: 'Göz atarak, işaretleyerek, not alarak okuma; katılımlı, katılımsız dinleme.', visual: img('headphone') },
      { kind: 'bilim-avi', title: 'Bilim Avı', icon: 'microscope', total: 3, meb: 'T.Y.3.3.b', gen: avi(BILIM_KELIME, 'Tablodaki bilim kelimelerini bul!'), ders: 'Tabloda saklanan kelimeleri bul.', visual: img('microscope') },
      { kind: 'sirala', title: 'Bilim Adımları', icon: 'gear', total: T, meb: 'T.O.3.2.ç', gen: ord(T6_O), ders: 'Adımları ve olayları sırala.', visual: img('gear') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T6_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T6_TF, 'rocket'), ders: 'Mecaz, deyim, atasözü ve e-atık: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-roket', title: 'Roket Fırlatma', icon: 'trophy', total: OYUN, meb: 'T.O.3.3.d', oyun: true, gen: karma(srt('Cümleleri sepetlere ayır.', 'Gerçek ve mecaz anlam.', GM_BINS, GM_ITEMS), ch(ATA6_Q), tf(T6_TF), oku(TELESKOP, EATIK)), ders: 'Geri sayım başladı! Her doğru cevap roketi yükseltir.', visual: img('trophy') },
      { kind: 'oyun-atolye', title: 'Mucit Atölyesi', icon: 'gear', total: 4, meb: 'T.Y.3.3.c', oyun: true, gen: rot(mem('Deyim kartlarını eşleştir!', 'Deyimler ve anlamları.', DEYIM_P), avi(BILIM_KELIME, 'Atölyede saklanan kelimeleri bul!'), srt('İfadeleri yazışmanın bölümlerine ayır.', 'Yazışma bölümleri.', YAZISMA_BINS, YAZISMA_ITEMS)), ders: 'Atölyede icat zamanı! Kartları eşleştir, kelimeleri bul.', visual: img('gear') },
    ],
  },
  {
    id: 't7',
    no: 7,
    title: 'Millî Kültürümüz',
    color: '#ea580c',
    dark: '#9a3412',
    icon: 'drum',
    acts: [
      { kind: 'okuma-kilim', title: 'Ninemin Kilimi', icon: 'oldwoman', total: T, meb: 'T.O.3.3.c', gen: oku(KILIM), ders: 'Ayşe ninesinden ne öğrendi? Oku ve bul.', visual: img('oldwoman') },
      { kind: 'okuma-mendil', title: 'Teneffüste Mendil Kapmaca', icon: 'running', total: T, meb: 'T.O.3.3.a', gen: oku(MENDIL), ders: 'Geleneksel bir oyunu oku. Olayları ve ana fikri bul.', visual: img('running') },
      { kind: 'sozluk', title: 'Kültür Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ7_P), ders: 'Telgraf, pul, müze, bando, gelenek…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Kültür sözcükleri.', SOZ7_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'uslup', title: 'Konuşma Üslubu', icon: 'handshake', total: T, meb: 'T.K.3.1.a', gen: ch(USLUP_Q), ders: 'Konuşma üslubu: duruma uygun söz ve ses tonu. Nazik ve saygılı konuşuruz.', visual: img('handshake') },
      { kind: 'uygun-sozcuk', title: 'Uygun Sözcük', icon: 'pencil', total: T, meb: 'T.Y.3.3.b', gen: ch(UYGUN7_Q), ders: 'Sözcükleri yerinde ve anlamına uygun kullanırız.', visual: img('pencil') },
      { kind: 'geleneksel', title: 'Geleneksel mi, Dijital mi?', icon: 'kite', total: 4, meb: 'T.Y.3.2.ç', gen: srt('Oyunları sepetlere ayır.', 'Geleneksel oyunlar kuşaktan kuşağa aktarılır.', GELENEK_BINS, GELENEK_ITEMS), ders: 'Seksek, mendil kapmaca, saklambaç geleneksel oyunlarımızdır.', visual: img('kite') },
      { kind: 'kultur', title: 'Kültür Hazinesi', icon: 'palette', total: T, meb: 'T.Y.3.3.b', gen: mt('Kültür ögesini açıklamasıyla eşleştir.', 'Millî kültürümüzün güzellikleri.', KULTUR_P), ders: 'Kilim, ebru, halay, gölge oyunu, türkü: kültür hazinemiz.', visual: img('palette') },
      { kind: 'atasozu', title: 'Komşuluk Atasözleri', icon: 'scroll', total: T, meb: 'T.K.3.3.d', gen: ch(ATA7_Q), ders: 'Komşu komşunun külüne muhtaçtır. Birlikten kuvvet doğar.', visual: img('scroll') },
      { kind: 'benzetme', title: 'Neye Benziyor?', icon: 'sparkles', total: T, meb: 'T.K.3.2.ı', gen: ch(BENZ7_Q), ders: 'Bayrak, vatanın gökyüzündeki kalbidir. Müze, bir zaman makinesidir.', visual: img('sparkles') },
      { kind: 'sirala', title: 'Kültür Yolculuğu', icon: 'link', total: T, meb: 'T.O.3.2.ç', gen: ord(T7_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T7_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T7_TF, 'drum'), ders: 'Kültür, üslup ve oyunlar: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-tren', title: 'Kültür Treni', icon: 'trophy', total: OYUN, meb: 'T.K.3.1.a', oyun: true, gen: karma(ch(USLUP_Q), ch(UYGUN7_Q), tf(T7_TF), oku(KILIM, MENDIL)), ders: 'Kültür treni yola çıktı! Her durakta bir soru var.', visual: img('trophy') },
      { kind: 'oyun-mendil', title: 'Mendil Kapmaca', icon: 'running', total: 4, meb: 'T.O.3.2.ğ', oyun: true, gen: rot(mem('Kültür kartlarını eşleştir!', 'Kültür ögeleri.', KULTUR_P), srt('Oyunları sepetlere ayır.', 'Geleneksel ve dijital oyunlar.', GELENEK_BINS, GELENEK_ITEMS), pop('Geleneksel oyunları patlat!', 'Bunlar geleneksel çocuk oyunlarıdır.', OYUN_HIT, OYUN_WRONG)), ders: 'Mendili kap, kartları eşleştir!', visual: img('running') },
    ],
  },
  {
    id: 't8',
    no: 8,
    title: 'Hak ve Sorumluluklarımız',
    color: '#0891b2',
    dark: '#155e75',
    icon: 'balance',
    acts: [
      { kind: 'okuma-secim', title: 'Sınıf Başkanı Seçimi', icon: 'raisedhand', total: T, meb: 'T.O.3.3.c', gen: oku(SECIM), ders: 'Sınıftaki seçimi oku. Haklarımızı nasıl kullanırız?', visual: img('raisedhand') },
      { kind: 'okuma-park', title: 'Parktaki Sıra', icon: 'kite', total: T, meb: 'T.O.3.3.a', gen: oku(PARK), ders: 'Deniz’in parkta yaptıklarını oku. Hak mı, sorumluluk mu?', visual: img('kite') },
      { kind: 'sozluk', title: 'Hak Sözcükleri', icon: 'openbook', total: T, meb: 'T.Y.3.2.b', gen: mt('Sözcüğü anlamıyla eşleştir.', 'Yeni sözcükler öğrendik.', SOZ8_P), ders: 'Zanaat, çırak, tezahürat, demokrasi, şefkat…', visual: img('openbook') },
      { kind: 'sozluk-hafiza', title: 'Sözcük Hafızası', icon: 'puzzle', total: 3, meb: 'T.Y.3.3.b', gen: mem('Sözcük ve anlam kartlarını eşleştir!', 'Temanın sözcükleri.', SOZ8_P), ders: 'Kartları çevir, sözcüğü anlamıyla eşleştir.', visual: img('puzzle') },
      { kind: 'hak-sorumluluk', title: 'Hak mı, Sorumluluk mu?', icon: 'balance', total: 4, meb: 'T.O.3.2.ğ', gen: srt('Davranışları sepetlere ayır.', 'Oynamak hakkımız, paylaşmak sorumluluğumuz.', HAK_BINS, HAK_ITEMS), ders: 'Oyun oynamak, eğitim almak haktır. Sınıfı temiz tutmak, kurallara uymak sorumluluktur.', visual: img('balance') },
      { kind: 'pekistirme', title: 'Pekiştirme', icon: 'sparkle', total: T, meb: 'T.Y.3.3.e', gen: rot(ch(PEK_Q), mt('Sözcüğü pekiştirmeli hâliyle eşleştir.', 'Pekiştirme anlamı kuvvetlendirir.', PEK_P)), ders: 'Anlamı kuvvetlendirmek için sözcüğe ilave yapılır: sarı → sapsarı, temiz → tertemiz. Bitişik yazılır.', points: ['mavi → masmavi', 'uzun → upuzun', 'hızlı → hıphızlı'], visual: img('sparkle') },
      { kind: 'pekistirme-balon', title: 'Pekiştirme Balonları', icon: 'balloon', total: 3, meb: 'T.Y.3.3.e', gen: pop('Pekiştirmeli sözcükleri patlat!', 'Bunlar pekiştirmeli sözcüklerdir.', PEK_HIT, PEK_WRONG), ders: 'Yalnızca anlamı kuvvetlendirilmiş sözcükleri patlat.', visual: img('balloon') },
      { kind: 'gizlilik', title: 'Bilgilerimi Korurum', icon: 'lock', total: T, meb: 'T.O.3.5.ç', gen: ch(GIZLI_Q), ders: 'Genel ağda adımızı, adresimizi, telefonumuzu ve şifremizi paylaşmayız. Bir büyüğümüze söyleriz.', visual: img('lock') },
      { kind: 'tur-tercih', title: 'Hangi Tür?', icon: 'television', total: T, meb: 'T.D.3.5.b', gen: mt('Türü açıklamasıyla eşleştir.', 'Dinleyip izlediğimiz farklı türler.', TUR_P), ders: 'Masal, fabl, belgesel, röportaj, şiir, çizgi film: sen hangisini seversin?', visual: img('television') },
      { kind: 'yonerge', title: 'Yönerge Yazalım', icon: 'checkered', total: T, meb: 'T.Y.3.2.ğ', gen: ord(YONERGE_O), ders: 'Yönerge, bir işi adım adım anlatır. Adımlar açık ve sıralı olmalı.', visual: img('checkered') },
      { kind: 'sirala', title: 'Olay Sırası', icon: 'link', total: T, meb: 'T.O.3.2.ç', gen: ord(T8_O), ders: 'Olayları oluş sırasına göre diz.', visual: img('link') },
      { kind: 'cumle', title: 'Cümle Treni', icon: 'train', total: T, meb: 'T.K.3.3.g', gen: cumle(T8_C, 'train'), ders: 'Sözcükleri sırala, cümle kur.', visual: img('train') },
      { kind: 'dogru-yanlis', title: 'Doğru mu, Yanlış mı?', icon: 'thumbsup', total: T, meb: 'T.O.3.2.g', gen: tf(T8_TF, 'balance'), ders: 'Haklar, sorumluluklar ve pekiştirme: doğru mu, yanlış mı?', visual: img('thumbsup') },
      { kind: 'oyun-durak', title: 'Haklar Durağı', icon: 'trophy', total: OYUN, meb: 'T.O.3.2.ğ', oyun: true, gen: karma(srt('Davranışları sepetlere ayır.', 'Hak ve sorumluluk.', HAK_BINS, HAK_ITEMS), ch(GIZLI_Q), tf(T8_TF), oku(SECIM, PARK)), ders: 'Haklar durağına yolculuk! Her doğru cevap durağa bir parça ekler.', visual: img('trophy') },
      { kind: 'oyun-balon', title: 'Pekiştirme Şenliği', icon: 'balloon', total: 4, meb: 'T.Y.3.3.e', oyun: true, gen: rot(pop('Pekiştirmeli sözcükleri patlat!', 'Pekiştirmeli sözcükler.', PEK_HIT, PEK_WRONG), mem('Pekiştirme kartlarını eşleştir!', 'Sözcük ve pekiştirmeli hâli.', PEK_P), mt('Türü açıklamasıyla eşleştir.', 'Türler.', TUR_P)), ders: 'Balonlar havada! Patlat, eşleştir, kazan!', visual: img('balloon') },
    ],
  },
]

/* ================================================================================================
 * EK · NOKTALAMA VE YAZIM — her temaya: hangi işaret, doğru yazım + temanın kendi yazım kuralı
 * (3. sınıf: nokta, virgül, soru, ünlem, tırnak, konuşma çizgisi, iki nokta, üç nokta, eğik çizgi,
 * kesme, büyük harf, kısaltma ekleri, yazım yanlışları, noktalama görevleri)
 * ================================================================================================ */
/** [işaretsiz cümle, işaret, cümledeki özel ad (varsa)] */
type Cumle = [string, '.' | '?' | '!', string?]
const ISARET_AD = { '.': 'Nokta (.)', '?': 'Soru işareti (?)', '!': 'Ünlem işareti (!)' } as const
const ISARET_NEDEN = { '.': 'Bilgi veren, anlatan cümlelerin sonuna nokta koyarız.', '?': 'Soru soran cümlelerin sonuna soru işareti koyarız.', '!': 'Sevinç, şaşkınlık gibi duyguları ya da seslenmeyi ünlemle gösteririz.' } as const
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
/** kesme işareti: özel ada gelen ek */
const kesme = (bank: [string, string, string][]): Gen => (rng, _g, l, h) => {
  const [ad, ek, c] = fresh(rng, bank, h, (x) => `Kesme işareti nerede? (${x[0]} + ${x[1]})`)
  const yaz = (x: string) => c.replace('#', x)
  return { ...mkChoice(rng, { q: 'Kesme işareti doğru kullanılmış cümle hangisi?', a: yaz(`${ad}’${ek}`), w: [yaz(`${ad}${ek}`), yaz(`${kucuk(ad)}’${ek}`), yaz(`${ad} ${ek}`)], ex: `Özel adlara gelen ekleri kesme işaretiyle ayırırız: ${ad}’${ek}.` }, l), prompt: `Kesme işareti nerede? (${ad} + ${ek})` }
}

/* ---------- tema cümleleri ---------- */
const C1: Cumle[] = [
  ['Zeynep kapıyı nazikçe tıklattı', '.'],
  ['Odana girebilir miyim', '?'],
  ['Ne güzel bir sabah', '!'],
  ['Kalemi Mert’e geri verdim', '.', 'Mert'],
  ['Bu para kimin', '?'],
  ['Yaşasın, kuş yavrusu iyileşti', '!'],
  ['Serçe pencerede ötüyordu', '.'],
  ['Neden izin istemeliyiz', '?'],
]
const C2: Cumle[] = [
  ['Ülkü, Atatürk’ün ayakkabılarını boyadı', '.', 'Atatürk'],
  ['Yaşasın Cumhuriyet', '!', 'Cumhuriyet'],
  ['Fenerleri ne zaman yakacağız', '?'],
  ['Cumhuriyet Bayramı’nda okulumuzu süsledik', '.', 'Bayramı'],
  ['Ne güzel bir fener alayı', '!'],
  ['Nene Hatun Erzurum’da yaşadı', '.', 'Erzurum'],
  ['Bayrağımızın renkleri nelerdir', '?'],
  ['Atatürk kitap okumayı çok severdi', '.', 'Atatürk'],
]
const C3: Cumle[] = [
  ['Karıncalar birlikte çalışır', '.'],
  ['Su damlası nereye gidiyordu', '?'],
  ['Yaşasın, kar yağıyor', '!'],
  ['Dayım bugün Ankara’dan gelecek', '.', 'Ankara'],
  ['Ormanda hangi hayvanlar yaşar', '?'],
  ['Ne kadar güzel bir orman', '!'],
  ['Kovadaki suyla Defne çiçekleri suladı', '.', 'Defne'],
  ['Bulutlar nasıl oluşur', '?'],
]
const C4: Cumle[] = [
  ['Her akşam kitap okurum', '.'],
  ['En sevdiğin masal hangisi', '?'],
  ['Ne heyecanlı bir hikâye', '!'],
  ['Kütüphaneden Ali uzay kitabı aldı', '.', 'Ali'],
  ['Kitabı ne zaman geri getireceksin', '?'],
  ['Yaşasın, yeni kitabım geldi', '!'],
  ['Bu hikâyeleri Ömer Seyfettin yazdı', '.', 'Ömer Seyfettin'],
  ['Kütüphane saat kaçta açılıyor', '?'],
]
const C5: Cumle[] = [
  ['Ninem ebru yapmayı öğreniyor', '.'],
  ['Sen hangi müzik aletini çalıyorsun', '?'],
  ['Bravo, harika bir atış', '!'],
  ['Okçu sporcumuz İstanbul’da doğdu', '.', 'İstanbul'],
  ['Gölge oyununu ne zaman sergileyeceğiz', '?'],
  ['Yaşasın, kalemiz birinci oldu', '!'],
  ['Türküyü Can dedesiyle çaldı', '.', 'Can'],
  ['Yeteneğini nasıl geliştirirsin', '?'],
]
const C6: Cumle[] = [
  ['Mucitler yeni şeyler icat eder', '.'],
  ['Ay neden her gece farklı görünür', '?'],
  ['Robotum çalıştı', '!'],
  ['Haritaları Pîrî Reis çizdi', '.', 'Pîrî Reis'],
  ['Uydular uzayda ne yapar', '?'],
  ['Vay, ne ilginç bir buluş', '!'],
  ['Zehra teleskopla Ay’ı gözledi', '.', 'Ay'],
  ['E-atıkları nereye götürmeliyiz', '?'],
]
const C7: Cumle[] = [
  ['Ninem güzel kilimler dokur', '.'],
  ['Hiç mendil kapmaca oynadın mı', '?'],
  ['Ne güzel bir halay', '!'],
  ['Mehmet Âkif Ersoy İstiklâl Marşı’nı yazdı', '.', 'İstiklâl Marşı'],
  ['Telgraf nasıl çalışırdı', '?'],
  ['Hadi, seksek oynayalım', '!'],
  ['PTT Müzesi Ankara’dadır', '.', 'Ankara'],
  ['Bayramda kimleri ziyaret edersin', '?'],
]
const C8: Cumle[] = [
  ['Her çocuğun oyun hakkı vardır', '.'],
  ['Sınıf başkanını nasıl seçeriz', '?'],
  ['Yaşasın, Elif başkan oldu', '!', 'Elif'],
  ['Çocuklara Mevlânâ selam verirdi', '.', 'Mevlânâ'],
  ['Şifreni kimseyle paylaşır mısın', '?'],
  ['Hep birlikte çok güçlüyüz', '!'],
  ['Topunu Ömer küçük çocukla paylaştı', '.', 'Ömer'],
  ['Senin en önemli hakkın hangisi', '?'],
]
const KESME1: [string, string, string][] = [
  ['Mert', 'in', '# odası çok düzenli.'],
  ['Ankara', 'ya', 'Bilim insanı # geldi.'],
  ['Ela', 'ya', 'Öğretmen parayı # verdi.'],
  ['Zeynep', 'e', 'Mert, # teşekkür etti.'],
  ['Amerika', 'ya', 'Bilim insanı eğitim için # gitti.'],
  ['Türkiye', 'de', 'Lavanta # yetişir.'],
]
const KESME2: [string, string, string][] = [
  ['Nene Hatun', 'un', '# sesi her yerde duyuldu.'],
  ['Erzurum', 'da', 'Nene Hatun # yaşadı.'],
  ['Anadolu', 'nun', '# kadınları çok cesurdu.'],
  ['Halide Edip', 'in', '# yazıları umut verdi.'],
  ['Samsun', 'a', 'Mustafa Kemal 19 Mayıs’ta # çıktı.'],
  ['Atatürk', 'ün', '# çocuk sevgisi çok büyüktü.'],
]
const VIRGUL3: [string, string, string, string][] = [
  ['marketten', 'ekmek', 'su', 'süt aldım'],
  ['ormanda', 'sincap', 'tilki', 'ayı yaşar'],
  ['deney için', 'poşet', 'su', 'güneşli bir yer gerekir'],
  ['atıkları', 'kâğıt', 'plastik', 'cam diye ayırdık'],
  ['karıncaların', 'antenleri', 'beli', 'altı bacağı vardır'],
]
const YAZIM_TF3: TF[] = [
  ['Cümleler büyük harfle başlar.', true, 'Her cümlenin ilk harfi büyük yazılır.'],
  ['Özel adlara gelen ekler kesme işaretiyle ayrılır.', true, 'Ankara’ya, Ece’nin.'],
  ['Soru cümlesinin sonuna ünlem işareti konur.', false, 'Soru cümlesi soru işaretiyle biter.'],
  ['Virgül cümlenin sonuna konur.', false, 'Virgül cümle içinde kullanılır; cümle sonuna nokta, soru ya da ünlem gelir.'],
  ['Sıralanan sözcüklerin arasına virgül konur.', true, 'Ekmek, su ve süt.'],
  ['Konuşma çizgisi karşılıklı konuşmaların başına konur.', true, '- Neyin var? diye sordu.'],
  ['“her şey” bitişik yazılır.', false, 'Doğrusu: her şey.'],
  ['Pekiştirmeli sözcükler bitişik yazılır.', true, 'tertemiz, masmavi.'],
]

const YAZIM_EK: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C1), isaretSepet(C1)), ders: 'Anlatan cümle nokta, soran cümle soru işareti, duygu bildiren cümle ünlem işaretiyle biter.', points: ['. anlatır', '? sorar', '! duygu ya da seslenme'], visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C1), ders: 'Cümle büyük harfle başlar, özel adlar büyük harfle yazılır, sonuna uygun işaret konur.', visual: img('memo') },
    { kind: 'kesme-yazim', title: 'Kesme İşareti', icon: 'scroll', total: T, meb: 'T.Y.3.3.g', gen: rot(kesme(KESME1), tf(YAZIM_TF3, 'pencil')), ders: 'Özel adlara gelen ekleri kesme işaretiyle ayırırız: Mert’in, Ankara’ya.', visual: img('scroll') },
  ],
  t2: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C2), isaretSepet(C2)), ders: '“Yaşasın Cumhuriyet!” gibi coşku bildiren cümleler ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C2), ders: 'Atatürk, Erzurum, Cumhuriyet Bayramı gibi özel adlar büyük harfle başlar.', visual: img('memo') },
    { kind: 'kisaltma-ek', title: 'Kısaltmalara Ek', icon: 'abc', total: T, meb: 'T.Y.3.3.d', gen: kisaltma(KIS), ders: 'Büyük harfli kısaltmalarda ek son harfin okunuşuna (TDK’nın, PTT’ye), küçük harfli kısaltmalarda sözcüğün okunuşuna (kg’dan, m’si) göre gelir.', points: ['PTT → pe-te-te → PTT’ye', 'kg → kilogram → kg’dan'], visual: img('abc') },
    { kind: 'kesme-yazim', title: 'Kahramanların Adları', icon: 'scroll', total: T, meb: 'T.Y.3.3.g', gen: kesme(KESME2), ders: 'Kişi ve yer adlarına gelen ekleri kesmeyle ayırırız: Nene Hatun’un, Erzurum’da.', visual: img('scroll') },
  ],
  t3: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C3), isaretSepet(C3)), ders: '“Yaşasın, kar yağıyor!” Sevinç ünlemle, soru soru işaretiyle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C3), ders: 'Cümle büyük harfle başlar ve uygun işaretle biter.', visual: img('memo') },
    { kind: 'virgul-yazim', title: 'Virgülle Sırala', icon: 'leaf', total: T, meb: 'T.Y.3.3.g', gen: virgul(VIRGUL3), ders: 'Sıralanan sözcükleri virgülle ayırırız; “ve”den önce virgül gelmez: ekmek, su ve süt.', visual: img('leaf') },
  ],
  t4: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C4), isaretSepet(C4)), ders: 'Okuduğun cümlenin ne anlattığına bak: bilgi mi, soru mu, duygu mu?', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C4), ders: 'Ali, Ömer Seyfettin gibi kişi adları büyük harfle başlar.', visual: img('memo') },
    { kind: 'yazim-yanlisi', title: 'Yazım Dedektifi', icon: 'detective', total: T, meb: 'T.Y.3.5.b', gen: rot(ch(YAZIM4_Q), tf(YAZIM_TF3, 'detective')), ders: 'her şey, bir sürü, ya da ayrı; tutabilir bitişik yazılır. kütüphane, öğrenci, kahraman sözcüklerine dikkat!', visual: img('detective') },
  ],
  t5: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C5), isaretSepet(C5)), ders: '“Bravo, harika bir atış!” Övgü ve sevinç ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C5), ders: 'Kişi ve şehir adları büyük harfle başlar.', visual: img('memo') },
    { kind: 'tirnak-cizgi', title: 'Tırnak ve Konuşma Çizgisi', icon: 'scroll', total: T, meb: 'T.Y.3.3.g', gen: ch(TIRNAK5_Q), ders: 'Başkasının sözünü tırnak içinde yazarız. Karşılıklı konuşmalarda sözün başına konuşma çizgisi (-) koyarız.', visual: img('scroll') },
  ],
  t6: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C6), isaretSepet(C6)), ders: '“Robotum çalıştı!” Sevinci ünlemle gösteririz.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C6), ders: 'Gök cisimlerinin adları (Ay, Güneş) ve kişi adları büyük harfle başlar.', visual: img('memo') },
    { kind: 'iki-nokta', title: 'İki Nokta, Üç Nokta', icon: 'gear', total: T, meb: 'T.Y.3.3.g', gen: ch(IKINOKTA_Q), ders: 'İki nokta (:) açıklama ve sıralamadan önce, üç nokta (...) tamamlanmamış sözde, eğik çizgi (/) 3/A gibi yazımlarda kullanılır.', visual: img('gear') },
  ],
  t7: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C7), isaretSepet(C7)), ders: '“Hadi, seksek oynayalım!” İstek ve seslenme ünlemle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C7), ders: 'İstiklâl Marşı, Ankara gibi özel adlar büyük harfle başlar.', visual: img('memo') },
    { kind: 'kesme-sayi', title: 'Kesme: Ad ve Sayı', icon: 'scroll', total: T, meb: 'T.Y.3.3.g', gen: rot(kesme(KESME7), ch(KESME7_Q)), ders: 'Özel adlara ve rakamla yazılan sayılara gelen ekleri kesmeyle ayırırız: Ankara’da, 23 Nisan’da, 10’da.', visual: img('scroll') },
  ],
  t8: [
    { kind: 'hangi-isaret', title: 'Hangi İşaret?', icon: 'pencil', total: T, meb: 'T.Y.3.3.g', gen: rot(isaretSec(C8), isaretSepet(C8)), ders: '“Yaşasın, Elif başkan oldu!” Coşku ünlemle, soru soru işaretiyle biter.', visual: img('pencil') },
    { kind: 'dogru-yazim', title: 'Doğru Yazalım', icon: 'memo', total: T, meb: 'T.Y.3.3.f', gen: dogruYazim(C8), ders: 'Cümle büyük harfle başlar ve uygun işaretle biter.', visual: img('memo') },
    { kind: 'noktalama-gorev', title: 'İşaretlerin Görevleri', icon: 'scroll', total: T, meb: 'T.O.3.3.e', gen: rot(mt('Noktalama işaretini göreviyle eşleştir.', 'Her noktalama işaretinin bir görevi vardır.', NOKTA_GOREV_P), ch(NOKTA8_Q)), ders: 'Nokta cümleyi bitirir, virgül sözcükleri ayırır, ünlem seslenir, üç nokta sözü yarım bırakır.', visual: img('scroll') },
  ],
}
for (const t of TR3_ADALAR) {
  const ek = YAZIM_EK[t.id] ?? []
  const kinds = new Set(t.acts.map((a) => a.kind))
  const yeni = ek.map((a) => (kinds.has(a.kind) ? { ...a, kind: `${a.kind}-2` } : a))
  t.acts = [...t.acts.filter((a) => !a.oyun), ...yeni, ...t.acts.filter((a) => a.oyun)]
}

/* ================================================================================================
 * EK · DİNLEME, KONUŞMA VE YAZMA TÜRLERİ — kitabın karekodlu dinleme/izleme metinleri yerine özgün
 * kısa dinleme metinleri (yazı gösterilmez, sesli okunur), konuşma durumları (plan, jest-mimik,
 * örneklendirme, görüşe katılmama, neden–sonuç) ve yazma türleri (olayları sırayla yazma, devamını
 * getirme, imza, davetiye, mektup bölümleri, deney yönergesi, dilekçe, kaynak, hata bulma).
 * Kişiler hayalîdir; adres, telefon, okul adı istenmez.
 * ================================================================================================ */

/* ---------- Tema 1 ---------- */
const KELEBEK_D: Dinleme = {
  t: 'Gösterişli Kelebek',
  img: 'butterfly',
  text: 'Bahar gelince renkli kanatlı bir kelebek, bahçenin en güzeli olduğunu düşünmeye başladı. Küçük bir papatya, “Rüzgâr tohumlarımı dağıttı, toplamama yardım eder misin?” diye sordu. Kelebek başını kaldırıp “Benim kanatlarım bu iş için fazla güzel.” dedi ve uçup gitti. Birkaç gün sonra sağanak yağmur bastırdı, kelebeğin kanatları ıslandı. Sığınacak yer arayan kelebeği papatya yapraklarının altına aldı. Kelebek utandı ve papatyadan özür diledi. Papatya onu gülümseyerek affetti. O günden sonra kelebek, bahçede herkesin yardımına koştu.',
  qs: [
    { q: 'Dinlediğin metnin ana fikri nedir?', a: 'Kibirli olmamalı, birbirimize yardım etmeliyiz', w: ['Kelebeklerin kanatları renklidir', 'Baharda her gün yağmur yağar', 'Papatyalar çok küçüktür'], ex: 'Kelebek kibri yüzünden yardım etmedi, sonra hatasını anladı.' },
    { q: 'Dinlediğin metnin konusu nedir?', a: 'Kibirli bir kelebeğin hatasını anlaması', w: ['Papatyanın nasıl büyüdüğü', 'Yağmurun nasıl oluştuğu', 'Bahçede yapılan bir yarış'], ex: 'Metin, kelebeğin kibrini ve sonra değişmesini anlatıyor.' },
    { q: 'Kelebek papatyaya neden yardım etmedi?', a: 'Kendini çok güzel ve üstün gördüğü için', w: ['Papatyayı göremediği için', 'Çok uykulu olduğu için', 'Kanatları ıslak olduğu için'], ex: 'Kelebek kanatlarını “bu iş için fazla güzel” buldu. Bu kibirdir.' },
    { q: 'Yağmurda kelebeğe kim yardım etti?', a: 'Papatya', w: ['Arı', 'Rüzgâr', 'Karınca'], ex: 'Papatya, kelebeği yapraklarının altına aldı.' },
    { q: 'Papatyanın davranışı bize ne öğretir?', a: 'Özür dileyeni affetmek güzeldir', w: ['Kimseye yardım etmemeliyiz', 'Kızgınlığı hiç unutmamalıyız', 'Yağmurda dışarı çıkmalıyız'], ex: 'Papatya, özür dileyen kelebeği affetti.' },
    { q: 'Metnin sonunda kelebek nasıl biri oldu?', a: 'Yardımsever', w: ['Kibirli', 'Tembel', 'Kızgın'], ex: 'O günden sonra herkesin yardımına koştu.' },
  ],
}
const SIRA_YAZ_O: O[] = [
  { q: 'Kuş yavrusunun hikâyesini olay sırasına göre yaz.', s: ['Ada, okul yolunda yere düşmüş bir kuş yavrusu gördü.', 'Yavruyu annesiyle birlikte eve götürdü.', 'Birkaç hafta yavruya özenle baktılar.', 'Yavru iyileşince onu doğaya bıraktılar.'], ex: 'Olayları oluş sırasıyla yazarız: ne oldu, sonra ne oldu, en sonunda ne oldu.', img: 'bird' },
  { q: 'Komşuya yardım olayını sırayla yaz.', s: ['Yaşlı komşumuz pazardan ağır çantalarla döndü.', 'Kardeşimle hemen yanına koştuk.', 'Çantaları kapısına kadar taşıdık.', 'Komşumuz bize gülümseyerek teşekkür etti.'], ex: 'Önce olay başlar, sonra gelişir, en sonunda biter.', img: 'oldwoman' },
  { q: 'Kırılan vazo olayını sırayla yaz.', s: ['Salonda top oynarken vazoya çarptım.', 'Vazo yere düşüp kırıldı.', 'Hemen annemin yanına gidip olanı anlattım.', 'Annem doğruyu söylediğim için bana sarıldı.'], ex: 'Olayları yaşandığı sırayla anlatırız.', img: 'ball' },
  { q: 'Sınıf panosu hazırlığını sırayla yaz.', s: ['Öğretmenimiz pano hazırlayacağımızı söyledi.', 'Gruplara ayrılıp resimler çizdik.', 'Resimleri panoya yapıştırdık.', 'Panomuzu sınıfın kapısına astık.'], ex: 'Önce, sonra, en sonunda…', img: 'palette' },
]
const SIRA_YAZ_Q: Q[] = [
  { q: 'Olayları sırayla yazarken ilk olayı hangi sözcükle başlatmak uygundur?', a: 'Önce', w: ['Sonunda', 'En son', 'Bu yüzden'], ex: '“Önce” ilk olayı gösterir.' },
  { q: 'Hangi sözcük en son olayı anlatırken kullanılır?', a: 'En sonunda', w: ['İlk olarak', 'Önce', 'Başta'], ex: '“En sonunda” olayın bittiğini gösterir.' },
  { q: 'Sıra bildiren sözcükler hangisinde doğru sıralanmış?', a: 'önce, sonra, en sonunda', w: ['en sonunda, önce, sonra', 'sonra, en sonunda, önce', 'sonra, önce, en sonunda'], ex: 'Önce → sonra → en sonunda.' },
  { q: 'Bir olayı kendi cümlelerimizle yazarken neye dikkat ederiz?', a: 'Olayları yaşandığı sırayla yazmaya', w: ['Olayları karışık yazmaya', 'Sadece son olayı yazmaya', 'Olayla ilgisiz şeyler yazmaya'], ex: 'Olay sırası korunursa okuyan kolayca anlar.' },
  { q: '“Yavruyu doğaya bıraktık.” cümlesi olayın neresinde yer alır?', a: 'Sonunda', w: ['Başında', 'Ortasında', 'Hiçbir yerinde'], ex: 'Yavru iyileşince bırakıldı; bu olayın sonudur.' },
]
const ONCE_Q: Q[] = [
  { q: '“Ece’nin elleri ve önlüğü boya içindeydi.” Bundan önce ne olmuş olabilir?', a: 'Ece resim yapmış olabilir', w: ['Ece yüzmüş olabilir', 'Ece uyumuş olabilir', 'Ece kitap okumuş olabilir'], ex: 'Boyalı eller, resim yapıldığını düşündürür.', img: 'palette' },
  { q: '“Bahçedeki toprak ıslaktı, yapraklardan su damlıyordu.” Bundan önce ne olmuş olabilir?', a: 'Yağmur yağmış olabilir', w: ['Güneş toprağı kurutmuş olabilir', 'Bahçeye kum dökülmüş olabilir', 'Yapraklar dökülmüş olabilir'], ex: 'Islak toprak ve damlayan su yağmuru gösterir.', img: 'rain' },
  { q: '“Kerem elinde kupasıyla gülümseyerek eve geldi.” Bundan önce ne olmuş olabilir?', a: 'Bir yarışmada ödül kazanmış olabilir', w: ['Kupasını kaybetmiş olabilir', 'Kupayı kırmış olabilir', 'Yarışmaya hiç katılmamış olabilir'], ex: 'Kupa ve gülümseme bir başarıyı düşündürür.', img: 'trophy' },
  { q: '“Sınıfın kapısında “Aramıza hoş geldin Lale!” yazıyordu.” Bundan önce ne olmuş olabilir?', a: 'Sınıfa yeni bir öğrenci gelmiş olabilir', w: ['Lale okuldan ayrılmış olabilir', 'Okul tatile girmiş olabilir', 'Kapı boyanmış olabilir'], ex: '“Hoş geldin” yeni gelen birine söylenir.', img: 'school' },
  { q: '“Mert’in dizinde yara bandı vardı.” Bundan önce ne olmuş olabilir?', a: 'Düşüp dizini incitmiş olabilir', w: ['Yeni ayakkabı almış olabilir', 'Şarkı söylemiş olabilir', 'Resim yapmış olabilir'], ex: 'Yara bandı küçük bir yaralanmayı gösterir.', img: 'bandage' },
  { q: '“Nermin teyze kapıda torunlarını sevinçle kucakladı.” Bundan önce ne olmuş olabilir?', a: 'Torunları onu ziyarete gelmiş olabilir', w: ['Torunları evde uyuyor olabilir', 'Torunları onu hiç tanımıyor olabilir', 'Kapı kilitli kalmış olabilir'], ex: 'Kapıda kucaklamak, birinin geldiğini gösterir.', img: 'hug' },
]
const BASLIK_Q: Q[] = [
  { q: 'Başlık: “Küçük Bilim İnsanı”. Resme de bak. Bu metinde ne anlatılır?', a: 'Bilime meraklı bir çocuğun çalışmaları', w: ['Bir futbol maçının sonucu', 'Denizde yüzen balıklar', 'Bir pasta tarifi'], ex: 'Başlık ve mikroskop resmi bilimle ilgili bir metni gösterir.', img: 'microscope' },
  { q: 'Başlık: “Yaralı Serçe”. Resme de bak. Bu metinde ne anlatılır?', a: 'Yardıma ihtiyacı olan bir kuşa bakılması', w: ['Bir uzay yolculuğu', 'Kardan adam yapmak', 'Bir resim yarışması'], ex: 'Başlık ve kuş resmi, yaralı bir kuşa yardımı düşündürür.', img: 'bird' },
  { q: 'Başlık: “Kayıp Kedi”. Resme de bak. Bu metinde ne anlatılır?', a: 'Kaybolan bir kedinin aranması', w: ['Bir trenin yolculuğu', 'Bir ağacın büyümesi', 'Kışın kar yağması'], ex: 'Başlık metnin konusunu ipucu olarak verir.', img: 'cat' },
  { q: 'Başlık: “Sabah Selamı”. Resme de bak. Bu metinde ne anlatılır?', a: 'Güne selamlaşarak başlamak', w: ['Gece gökyüzünü izlemek', 'Bir yemek tarifi', 'Bir araba yarışı'], ex: 'Gün doğumu resmi ve başlık, sabahı ve selamı anlatır.', img: 'sunrise' },
  { q: 'Başlık: “Dedemin Bahçesi”. Resme de bak. Bu metinde ne anlatılır?', a: 'Dedenin bahçesinde geçen olaylar', w: ['Bir uzay istasyonu', 'Denizde bir gemi', 'Bir futbol takımı'], ex: 'Başlık ve ağaç resmi bir bahçeyi düşündürür.', img: 'tree' },
  { q: 'Başlık: “Paylaşınca Çoğalır”. Resme de bak. Bu metinde ne anlatılır?', a: 'Arkadaşlarla bir şeyi paylaşmak', w: ['Tek başına oyun oynamak', 'Bir eşyayı saklamak', 'Bir dağa tırmanmak'], ex: 'Başlık paylaşmayı, resim arkadaşlığı gösterir.', img: 'friends' },
]
const DEVAM_Q: Q[] = [
  { q: '“Ali parkta bir cüzdan buldu. Etrafına baktı ama kimseyi göremedi.” Hikâyenin en uygun devamı hangisi?', a: 'Cüzdanı parktaki görevliye teslim etti.', w: ['Cüzdanı cebine koyup kimseye söylemedi.', 'Cüzdanı çöpe attı.', 'Cüzdanı bir ağaca astı.'], ex: 'Bulduğumuzu bir görevliye ya da büyüğe teslim ederiz.' },
  { q: '“Nermin teyze her sabah balkonda çiçeklerini sulardı. Bir sabah balkonda görünmedi.” Hikâyenin en uygun devamı hangisi?', a: 'Komşu çocuklar durumu annelerine anlattı, birlikte teyzeyi yoklamaya gittiler.', w: ['Çiçekler kendi kendine sulanmaya başladı.', 'Çocuklar balkona tırmanmaya çalıştı.', 'Teyzenin balkonu uçup gitti.'], ex: 'Devamı, metnin başıyla uyumlu ve akla yatkın olmalı.' },
  { q: '“Sincap sonbaharda fındık topladı, tavşan ise bütün gün oyun oynadı. Kar yağınca…” Hikâyenin en uygun devamı hangisi?', a: 'Aç kalan tavşana sincap fındıklarından verdi; tavşan da çalışmanın önemini anladı.', w: ['Tavşanın evi bir anda fındıkla doldu.', 'Kar yağınca hemen yaz geldi.', 'Sincap bütün fındıklarını denize attı.'], ex: 'Devam, önceki olaylara bağlı olmalı.' },
  { q: '“Cem, sınıfa yeni gelen Ayaz’ın teneffüste yalnız oturduğunu gördü.” Hikâyenin en uygun devamı hangisi?', a: 'Yanına gidip onu oyuna çağırdı.', w: ['Ayaz bir anda kuşa dönüştü.', 'Teneffüs hiç bitmeyen bir güne dönüştü.', 'Okulun bahçesi denize dönüştü.'], ex: 'Hikâyenin devamı, başındaki duruma uygun olmalı.' },
  { q: '“Defne bir fidan dikti ve her gün suladı. Aylar geçti…” Hikâyenin en uygun devamı hangisi?', a: 'Fidan büyüdü ve ilk çiçeklerini açtı.', w: ['Fidan uzaya uçtu.', 'Defne fidanı hiç dikmemişti.', 'Fidan bir kediye dönüştü.'], ex: 'Sulanan fidanın büyümesi akla uygundur.' },
  { q: '“Elif, ödünç aldığı kitabın sayfasını yanlışlıkla yırttı.” Hikâyenin en uygun devamı hangisi?', a: 'Kütüphaneciye durumu anlatıp özür diledi.', w: ['Kitabı saklayıp hiç geri getirmedi.', 'Kitap kendi kendine onarıldı.', 'Sayfa uçup gökyüzüne yapıştı.'], ex: 'Hatamızı söyler, özür dileriz.' },
]
const DEVAM_O: O[] = [
  { q: 'Hikâyenin başı verildi. Devamını sırala.', s: ['Nermin teyze bir sabah balkonda görünmedi.', 'Komşu çocuklar durumu annelerine anlattı.', 'Birlikte teyzenin kapısını çaldılar.', 'Teyzenin ayağı burkulmuştu, ona çorba götürdüler.'], ex: 'Devamı yazarken olayları akla uygun bir sırayla sürdürürüz.', img: 'house' },
  { q: 'Cüzdan hikâyesinin devamını sırala.', s: ['Ali parkta bir cüzdan buldu.', 'Parktaki görevliye gitti.', 'Görevli cüzdanın sahibini buldu.', 'Cüzdanın sahibi Ali’ye teşekkür etti.'], ex: 'Hikâye başlar, gelişir ve sonuçlanır.', img: 'coin' },
]

/* ---------- Tema 2 ---------- */
const KOSE_D: Dinleme = {
  t: 'Atatürk Köşemiz',
  img: 'trflag',
  text: 'Ekim ayının sonunda 3-B sınıfı okula her zamankinden erken geldi. Çocukların ellerinde kırmızı beyaz kartonlar, yapıştırıcılar ve kalemler vardı. Selin, kütüphaneden Atatürk’ün çocukluğunu anlatan bir kitap getirmişti. Bora, panoya bayrak resimlerini yapıştırırken çok dikkatliydi. Öğretmenleri köşeyi görünce gözleri parlayarak çocukları alkışladı. Ertesi gün okulun bütün sınıfları köşeyi görmeye geldi.',
  qs: [
    { q: 'Çocuklar okula neden erken gelmiş olabilir?', a: 'Atatürk köşesini hazırlamak için', w: ['Okul tatil olduğu için', 'Servis bozulduğu için', 'Teneffüs uzun olduğu için'], ex: 'Ellerindeki malzemeler bir hazırlık yaptıklarını gösteriyor.' },
    { q: 'Ekim ayının sonunda hangi bayram için hazırlık yapılmış olabilir?', a: 'Cumhuriyet Bayramı', w: ['Yılbaşı', 'Ramazan Bayramı', 'Kurban Bayramı'], ex: 'Cumhuriyet Bayramı 29 Ekim’de kutlanır.' },
    { q: 'Öğretmenin çocukları alkışlaması neyi gösterir?', a: 'Köşeyi çok beğendiğini', w: ['Çocuklara kızdığını', 'Köşeyi hiç görmediğini', 'Üzüldüğünü'], ex: 'Gözlerin parlaması ve alkış beğeniyi anlatır.' },
    { q: 'Bora neden dikkatli çalışmış olabilir?', a: 'Panonun düzgün ve güzel olmasını istediği için', w: ['Uykusu geldiği için', 'Panoyu sevmediği için', 'Resimleri saklamak istediği için'], ex: 'Özenli çalışmak güzel bir sonuç için yapılır.' },
    { q: 'Diğer sınıfların köşeyi görmeye gelmesi neyi gösterir?', a: 'Köşenin herkesin ilgisini çektiğini', w: ['Köşenin hiç beğenilmediğini', 'Sınıfların boş olduğunu', 'Okulun kapandığını'], ex: 'Herkesin görmeye gelmesi köşenin beğenildiğini düşündürür.' },
    { q: 'Selin’in getirdiği kitabın konusu neydi?', a: 'Atatürk’ün çocukluğu', w: ['Uzaydaki gezegenler', 'Deniz canlıları', 'Bir yemek tarifi'], ex: 'Selin, Atatürk’ün çocukluğunu anlatan bir kitap getirdi.' },
  ],
}
const JEST_Q: Q[] = [
  { q: 'Arkadaşına “Harika olmuş!” derken hangi jest sözünü destekler?', a: 'Başparmağını kaldırmak', w: ['Kollarını kavuşturup yüzünü çevirmek', 'Esnemek', 'Gözlerini kapatmak'], ex: 'Başparmağı kaldırmak beğeniyi gösteren bir jesttir.', o: { 'Başparmağını kaldırmak': 'thumbsup', Esnemek: 'sleepy' } },
  { q: '“Ne kadar sevindim!” derken yüz ifaden nasıl olmalı?', a: 'Gülümseyen', w: ['Kaşları çatık', 'Somurtkan', 'Uykulu'], ex: 'Mimik, yüzümüzle duygumuzu göstermektir. Sevinç gülümsemeyle anlatılır.', o: { Gülümseyen: 'happy', 'Kaşları çatık': 'angry', Somurtkan: 'sad', Uykulu: 'sleepy' } },
  { q: 'Şiir okurken “kocaman bir dağ” dediğinde hangi jest uygun olur?', a: 'Kollarını iki yana açmak', w: ['Ellerini cebine sokmak', 'Parmağını dudağına koymak', 'Başını öne eğmek'], ex: 'Kolları açmak “kocaman” sözünü destekler.' },
  { q: '“Sessiz olalım, bebek uyuyor.” derken hangi jest uygun olur?', a: 'Parmağını dudağına koymak', w: ['El çırpmak', 'Zıplamak', 'Kollarını sallamak'], ex: 'Parmağı dudağa koymak “sessiz ol” anlamına gelir.', o: { 'Parmağını dudağına koymak': 'shush', 'El çırpmak': 'clap', 'Kollarını sallamak': 'wave' } },
  { q: 'Hikâyedeki şaşkın kahramanı anlatırken yüz ifaden nasıl olur?', a: 'Gözler ve ağız açık, şaşkın', w: ['Uykulu', 'Kızgın', 'Ağlamaklı'], ex: 'Şaşkınlık, açılan gözler ve ağızla gösterilir.', o: { 'Gözler ve ağız açık, şaşkın': 'surprised', Uykulu: 'sleepy', Kızgın: 'angry', Ağlamaklı: 'sad' } },
  { q: 'Konuşurken jest ve mimikler ne işe yarar?', a: 'Sözlerimizi destekler, daha iyi anlaşılırız', w: ['Konuşmayı gereksiz yapar', 'Dinleyeni korkutur', 'Sözlerimizi unutturur'], ex: 'El hareketleri (jest) ve yüz ifadeleri (mimik) konuşmayı güçlendirir.' },
  { q: 'Arkadaşını uzaktan selamlarken hangisi uygundur?', a: 'Gülümseyip el sallamak', w: ['Yüzünü çevirmek', 'Kaşlarını çatmak', 'Gözlerini devirmek'], ex: 'Gülümseme ve el sallama sıcak bir selamdır.', o: { 'Gülümseyip el sallamak': 'wave' } },
  { q: 'Üzgün bir arkadaşını teselli ederken hangisi uygun değildir?', a: 'Kahkaha atmak', w: ['Sakin bir ses tonu kullanmak', 'Yumuşak bir yüz ifadesi takınmak', 'Göz teması kurmak'], ex: 'Jest ve mimiklerimiz konuşmanın duygusuna uygun olmalı.' },
]
const IMZA_Q: Q[] = [
  { q: 'İmza ne işe yarar?', a: 'Yazıyı kimin yazdığını ya da onayladığını gösterir', w: ['Kâğıdı süslemeye yarar', 'Sayfa numarası verir', 'Tarihi gösterir'], ex: 'İmza, kişinin kendine özgü işaretidir.' },
  { q: 'Kendi imzamızı oluştururken neyi kullanırız?', a: 'Adımızı ya da soyadımızı', w: ['Arkadaşımızın adını', 'Sevdiğimiz bir oyunun adını', 'Okulun adını'], ex: 'İmzada en az ad ya da soyadımızdan birini kullanırız.' },
  { q: 'Ece Kaya adlı bir öğrencinin imzası hangisi olabilir?', a: 'E. Kaya', w: ['M. Demir', 'Sayın Veliler', 'Okul Müdürlüğüne'], ex: 'İmza, kişinin kendi adı ve soyadından oluşturulur.' },
  { q: 'Hangisi imza için doğru bir davranıştır?', a: 'İmzamızı her zaman aynı biçimde atmak', w: ['Her seferinde farklı imza atmak', 'Başkası adına imza atmak', 'Arkadaşımızın imzasını taklit etmek'], ex: 'İmza kişiye özeldir ve hep aynı biçimde atılır.' },
  { q: 'Dilekçede ad, soyad ve imza nereye yazılır?', a: 'Kâğıdın sağ alt bölümüne', w: ['Sol üst köşeye', 'Kurum adının yanına', 'Başlığın üstüne'], ex: 'İmza kâğıdın sağ alt bölümüne atılır.' },
  { q: 'İmza ile ilgili hangisi doğrudur?', a: 'Herkesin imzası kendine özgüdür', w: ['Herkes aynı imzayı kullanır', 'İmza sadece resimdir, adla ilgisi yoktur', 'İmzayı her yazıda değiştirmeliyiz'], ex: 'İmzamızı adımızı ve soyadımızı özgün bir biçimde kullanarak oluştururuz.' },
]
const DAVET_O: O[] = [
  { q: 'Resim sergisi davetiyesini sırala.', s: ['Değerli Veliler,', 'Sınıfımızın resim sergisi açılıyor.', 'Bu mutlu günümüzde sizi de aramızda görmek isteriz.', 'Cuma günü, saat 14.00, okul salonu', '3-A Sınıfı Öğrencileri'], ex: 'Davetiye: hitap, etkinlik, davet sözü, gün-saat-yer ve davet edenin adı.', img: 'palette' },
  { q: 'Cumhuriyet şenliği davetiyesini sırala.', s: ['Sevgili Dedeciğim ve Nineciğim,', 'Okulumuzda Cumhuriyet şenliği yapılacak.', 'Şiir okuyacağım, sizi çok bekliyorum.', '29 Ekim, saat 10.00, okul bahçesi', 'Torununuz Ela'], ex: 'Davetiye hitapla başlar, davet edenin adıyla biter.', img: 'trflag' },
  { q: 'Doğum günü davetiyesini sırala.', s: ['Sevgili Arkadaşım,', 'Cumartesi günü doğum günü kutlamam var.', 'Gelirsen çok sevinirim.', 'Saat 15.00, bahçemizde', 'Arkadaşın Can'], ex: 'Davetiyede ne, ne zaman ve nerede bilgileri bulunur.', img: 'cake' },
]
const DAVET_Q: Q[] = [
  { q: 'Davetiyede hangisi mutlaka bulunur?', a: 'Etkinliğin günü, saati ve yeri', w: ['Bir masal', 'Bir bilmece', 'Hava durumu'], ex: 'Davet edilen kişi nereye ve ne zaman geleceğini bilmeli.' },
  { q: 'Hangisi davetiyeye uygun bir hitaptır?', a: 'Değerli Velilerimiz,', w: ['değerli velilerimiz.', 'Hey, siz!', 'Gereğini arz ederim.'], ex: 'Hitap büyük harfle başlar, sonuna virgül konur.' },
  { q: 'Hangisi davetiyeye uygun bir davet sözüdür?', a: 'Sizi de aramızda görmekten mutluluk duyarız.', w: ['Gelmezseniz çok kızarım.', 'Gelseniz de olur, gelmeseniz de.', 'Gereğini bilgilerinize arz ederim.'], ex: 'Davet sözü nazik ve içten olmalı.' },
  { q: 'Davetiye ile dilekçenin farkı nedir?', a: 'Davetiye bir etkinliğe çağırır, dilekçe bir kurumdan istekte bulunur.', w: ['İkisi de masal anlatır.', 'Dilekçe doğum gününe çağırır.', 'Davetiyede gün ve saat yazılmaz.'], ex: 'Her yazı türünün kendi amacı vardır.' },
  { q: 'Davetiyenin en sonunda ne yazılır?', a: 'Davet edenin adı', w: ['Bir atasözü', 'Bir soru', 'Hitap'], ex: 'En sonda kimin davet ettiği yazılır.' },
  { q: 'Davetiye kime yazılır?', a: 'Etkinliğe çağırmak istediğimiz kişilere', w: ['Kimseye', 'Yalnızca kendimize', 'Bir masal kahramanına'], ex: 'Davetiyeyle sevdiklerimizi bir etkinliğe çağırırız.' },
]
const MEKTUP_BINS: SortQ['bins'] = [
  { id: 'hitap', label: 'Hitap', color: '#3b82f6' },
  { id: 'gelisme', label: 'Giriş ve gelişme', color: '#22c55e' },
  { id: 'sonuc', label: 'Sonuç', color: '#f59e0b' },
]
const MEKTUP_ITEMS: SortQ['items'] = [
  { label: 'Sevgili Dedeciğim,', bin: 'hitap' },
  { label: 'Canım Arkadaşım Ece,', bin: 'hitap' },
  { label: 'Sevgili Öğretmenim,', bin: 'hitap' },
  { label: 'Sana bayram hazırlıklarımızı anlatmak istiyorum.', bin: 'gelisme' },
  { label: 'Okulumuzu bayraklarla süsledik.', bin: 'gelisme' },
  { label: 'Törende şiir okudum.', bin: 'gelisme' },
  { label: 'Bahçemizdeki erik ağacı çiçek açtı.', bin: 'gelisme' },
  { label: 'Seni çok özledim, gözlerinden öperim.', bin: 'sonuc' },
  { label: 'Görüşmek dileğiyle, hoşça kal.', bin: 'sonuc' },
  { label: 'Mektubuma cevap yazarsan çok sevinirim.', bin: 'sonuc' },
]

/* ---------- Tema 3 ---------- */
const ORMAN_D: Dinleme = {
  t: 'Ormanda Bir Gün',
  img: 'evergreen',
  text: 'Sabah erkenden güneş ağaçların arasından doğdu. İlk önce bir ağaçkakan uyandı ve ağacın gövdesini tıklatmaya başladı. Öğleye doğru sincaplar dalların arasında fındık taşıdı. Öğleden sonra kara bulutlar geldi ve kısa bir yağmur yağdı. Yağmurdan sonra mantarlar ıslak toprağın üstünde parladı. Akşam olunca baykuş gözlerini açtı ve ormanı izlemeye başladı.',
  qs: [
    { q: 'Ormanda ilk uyanan hayvan hangisiydi?', a: 'Ağaçkakan', w: ['Baykuş', 'Sincap', 'Tilki'], ex: '“İlk önce bir ağaçkakan uyandı.”' },
    { q: 'Yağmur ne zaman yağdı?', a: 'Öğleden sonra', w: ['Sabah erkenden', 'Gece yarısı', 'Akşam'], ex: 'Öğleden sonra kara bulutlar geldi.' },
    { q: 'Akşam olunca ne oldu?', a: 'Baykuş gözlerini açtı', w: ['Güneş doğdu', 'Sincaplar fındık taşıdı', 'Ağaçkakan uyandı'], ex: 'Baykuş gece etkin olan bir hayvandır.' },
    { q: 'Öğleye doğru sincaplar ne yapıyordu?', a: 'Fındık taşıyordu', w: ['Uyuyordu', 'Yüzüyordu', 'Ağacı tıklatıyordu'], ex: 'Sincaplar dalların arasında fındık taşıdı.' },
    { q: 'Dinlediğin metnin konusu nedir?', a: 'Ormanda bir günün nasıl geçtiği', w: ['Şehirdeki trafik', 'Bir okul gezisi', 'Denizdeki balıklar'], ex: 'Metin sabahtan akşama ormanı anlatıyor.' },
    { q: 'Yağmurdan sonra ne oldu?', a: 'Mantarlar ıslak toprakta parladı', w: ['Kar yağdı', 'Güneş yeniden doğdu', 'Baykuş uyudu'], ex: 'Olayları oluş sırasına göre izleriz.' },
  ],
}
const PLAN_O: O[] = [
  { q: 'Konuşma planı hazırlama adımlarını sırala.', s: ['Konunu belirle', 'Konuyla ilgili bilgi topla', 'Giriş, gelişme ve sonucu planla', 'Konuşmanı arkadaşlarına sun'], ex: 'Önce konu seçilir, bilgi toplanır, plan yapılır, sonra konuşulur.', img: 'microphone' },
  { q: 'Doğa sevgisi konuşmasının bölümlerini sırala.', s: ['Sevgili arkadaşlar, bugün size ormanlardan söz edeceğim.', 'Ormanlar bize temiz hava ve gölge verir.', 'Ormanları korumak için fidan dikebiliriz.', 'Dinlediğiniz için teşekkür ederim.'], ex: 'Giriş: selam ve konu. Gelişme: bilgiler. Sonuç: öneri ve teşekkür.', img: 'tree' },
  { q: 'Su tasarrufu konuşmasının bölümlerini sırala.', s: ['Merhaba arkadaşlar, konum su tasarrufu.', 'Su, bütün canlılar için gereklidir.', 'Dişimizi fırçalarken musluğu kapatmalıyız.', 'Hepimiz suyu korursak gelecek güzel olur, teşekkürler.'], ex: 'Konuşma planı giriş, gelişme ve sonuçtan oluşur.', img: 'droplet' },
]
const PLAN_Q: Q[] = [
  { q: 'Konuşma planı hazırlarken ilk ne yapılır?', a: 'Konu belirlenir', w: ['Teşekkür edilir', 'Sonuç söylenir', 'Konuşma bitirilir'], ex: 'Planın ilk adımı konuyu seçmektir.' },
  { q: 'Konuşmanın giriş bölümünde ne yapılır?', a: 'Dinleyiciler selamlanır ve konu söylenir', w: ['Teşekkür edilip konuşma bitirilir', 'Konuyla ilgisiz bir şaka yapılır', 'Hiçbir şey söylenmez'], ex: 'Girişte selam verir, konumuzu söyleriz.' },
  { q: 'Konuşmanın gelişme bölümünde ne yapılır?', a: 'Konuyla ilgili bilgi ve örnekler anlatılır', w: ['Dinleyiciler selamlanır', 'Yalnızca teşekkür edilir', 'Konuşma hemen bitirilir'], ex: 'Gelişmede bilgilerimizi ve örneklerimizi sıralarız.' },
  { q: 'Konuşmanın sonuç bölümünde ne yapılır?', a: 'Düşünce özetlenir ve teşekkür edilir', w: ['Konu yeni baştan anlatılır', 'Dinleyiciler selamlanır', 'Yeni bir konuya geçilir'], ex: 'Sonuçta toparlar, teşekkür ederiz.' },
  { q: '“Ormanlar neden önemlidir?” konulu konuşma planına hangisi uymaz?', a: 'En sevdiğim çizgi filmin bölümleri', w: ['Ormanların verdiği temiz hava', 'Ormanda yaşayan canlılar', 'Ormanları koruma yolları'], ex: 'Plandaki her bölüm konuyla ilgili olmalı.' },
  { q: 'Konuşma planı ne işe yarar?', a: 'Konuşmanın düzenli ve anlaşılır olmasını sağlar', w: ['Konuşmayı gereksiz uzatır', 'Dinleyiciyi sıkar', 'Konuyu unutturur'], ex: 'Plan yaparsak ne söyleyeceğimizi şaşırmayız.' },
]
const DENEY_O: O[] = [
  { q: 'Buharlaşma deneyinin yönergesini sırala.', s: ['İki tabağa aynı miktarda su koy', 'Bir tabağı güneşe, birini gölgeye bırak', 'Akşam iki tabağa da bak', 'Hangi tabakta su azaldı, yaz'], ex: 'Deney yönergesi adımları sırayla ve açıkça anlatır.', img: 'sun' },
  { q: 'Fasulye çimlendirme deneyinin yönergesini sırala.', s: ['Kavanozun içine ıslak pamuk koy', 'Pamuğun üstüne fasulye yerleştir', 'Kavanozu aydınlık bir yere koy', 'Pamuğu her gün biraz nemlendir', 'Fasulyenin filizlendiğini gözlemle'], ex: 'Her adım bir önceki adımdan sonra yapılır.', img: 'seedling' },
  { q: 'Damlayan musluk deneyinin yönergesini sırala.', s: ['Damlayan musluğun altına bir kova koy', 'Bir saat bekle', 'Kovada biriken suya bak', 'Suyu çiçekleri sulamak için kullan'], ex: 'Yönergede “önce, sonra, en son” sırası korunur.', img: 'droplet' },
  { q: 'Buz eritme deneyinin yönergesini sırala.', s: ['Üç buz küpünü üç ayrı tabağa koy', 'Tabakları güneşe, gölgeye ve buzdolabına yerleştir', 'Yarım saat sonra tabaklara bak', 'Hangi buzun en çok eridiğini yaz'], ex: 'Gözlem sonucunu en sonda yazarız.', img: 'ice' },
]
const DENEY_Q: Q[] = [
  { q: 'Yönerge yazarken nelere dikkat ederiz?', a: 'Adımları sırayla ve açıkça yazarız', w: ['Adımları karışık yazarız', 'Malzemeleri hiç yazmayız', 'Sonucu en başa yazarız'], ex: 'Ayrıntılı yönergeyi okuyan herkes aynı işi yapabilir.' },
  { q: 'Deney yönergesinde ilk ne yazılır?', a: 'Gerekli malzemeler', w: ['Deneyin sonucu', 'Teşekkür sözü', 'Hitap'], ex: 'Önce malzemeler, sonra adımlar yazılır.' },
  { q: '“İki tabağa su koy. … Akşam tabaklara bak.” Eksik adım hangisi?', a: 'Bir tabağı güneşe, birini gölgeye koy.', w: ['Tabakları hemen kır.', 'Suyu hemen dök.', 'Tabakları yıkayıp dolaba kaldır.'], ex: 'Eksik adım, deneyin amacına uygun olmalı.' },
  { q: 'Hangisi yönergeye uygun bir cümledir?', a: 'Fasulyeyi ıslak pamuğun üstüne yerleştir.', w: ['Fasulyeler çok güzeldi.', 'Dün parkta oynadık.', 'Pamuk beyaz mıdır?'], ex: 'Yönerge cümleleri ne yapılacağını söyler.' },
  { q: 'Yönergede “önce, sonra, en son” gibi sözcükler ne işe yarar?', a: 'Adımların sırasını gösterir', w: ['Malzemeleri sayar', 'Duyguyu anlatır', 'Soru sorar'], ex: 'Sıra bildiren sözcükler yönergeyi anlaşılır yapar.' },
  { q: 'Deney yaparken hangisi doğrudur?', a: 'Bir büyüğümüzden yardım alırız', w: ['Malzemeleri izinsiz alırız', 'Yönergeyi okumadan başlarız', 'Sonucu hiç gözlemlemeyiz'], ex: 'Deneyleri bir büyüğümüzle güvenle yaparız.' },
]

/* ---------- Tema 4 ---------- */
const VIDEO_D: Dinleme = {
  t: 'İki Kütüphane Videosu',
  img: 'books',
  text: 'Birinci video: Ela her hafta mahalle kütüphanesine gidiyor. Orada sessizce hikâye kitapları okuyor ve kitapları zamanında geri getiriyor. İkinci video: Can, okul kütüphanesinde arkadaşlarıyla bilgi kitaplarını inceliyor. Kitapları özenle rafına yerleştiriyor ve okuduklarını defterine not ediyor.',
  qs: [
    { q: 'İki videonun ortak iletisi nedir?', a: 'Kütüphanede kitapları özenle kullanırız', w: ['Kütüphaneye gitmek gereksizdir', 'Kitaplar yalnızca evde okunur', 'Kitaplar hiç geri verilmez'], ex: 'İki videoda da kitaplar özenle kullanılıyor.' },
    { q: 'İki video hangi yönüyle farklıdır?', a: 'Ela hikâye kitabı, Can bilgi kitabı okuyor', w: ['İkisi de aynı kitabı okuyor', 'İkisi de hiç kitap okumuyor', 'İkisi de evde oturuyor'], ex: 'Okudukları kitapların türü farklı.' },
    { q: 'Ela ile Can’ın gittiği kütüphaneler nasıl farklı?', a: 'Ela mahalle, Can okul kütüphanesinde', w: ['İkisi de mahalle kütüphanesinde', 'İkisi de evdeki kitaplıkta', 'Ela okul, Can mahalle kütüphanesinde'], ex: 'Birinci videoda mahalle, ikinci videoda okul kütüphanesi var.' },
    { q: 'Hangi davranış yalnızca ikinci videoda vardır?', a: 'Okuduklarını defterine not etmek', w: ['Kitapları zamanında geri getirmek', 'Mahalle kütüphanesine gitmek', 'Hikâye kitabı okumak'], ex: 'Not alan kişi Can’dı.' },
    { q: 'Hangi davranış yalnızca birinci videoda vardır?', a: 'Kitapları zamanında geri getirmek', w: ['Bilgi kitaplarını incelemek', 'Kitapları rafına yerleştirmek', 'Arkadaşlarıyla birlikte okumak'], ex: 'Kitapları zamanında getiren Ela’ydı.' },
  ],
}
const GORUS_D: Dinleme = {
  t: 'İki Arkadaşın Konuşması',
  img: 'friends',
  text: 'Birinci konuşma: Zeynep, masal kitaplarının hayal gücünü geliştirdiğini söyledi. Ona göre masallar insanı uzak diyarlara götürür. İkinci konuşma: Arda, bilgi kitaplarından hayvanları ve gezegenleri öğrendiğini anlattı. Ona göre kitaplar bir bilgi hazinesidir. İkisi de her gün biraz kitap okumayı öneriyor.',
  qs: [
    { q: 'İki konuşmanın ortak önerisi nedir?', a: 'Her gün biraz kitap okumak', w: ['Hiç kitap okumamak', 'Yalnızca masal dinlemek', 'Kitapları rafta saklamak'], ex: 'İkisi de her gün kitap okumayı öneriyor.' },
    { q: 'Zeynep ile Arda’nın anlattıkları hangi yönüyle farklıdır?', a: 'Zeynep masalları, Arda bilgi kitaplarını anlatıyor', w: ['İkisi de yalnızca masalları anlatıyor', 'İkisi de kitapları sevmiyor', 'İkisi de gezegenleri anlatıyor'], ex: 'İletiler benzer, anlattıkları kitap türü farklı.' },
    { q: 'Arda’ya göre kitaplar nedir?', a: 'Bir bilgi hazinesi', w: ['Bir oyuncak', 'Gereksiz bir eşya', 'Bir yiyecek'], ex: 'Arda kitaplardan bilgi öğrendiğini söyledi.' },
  ],
}
const HATA_Q: Q[] = [
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Hafta sonu kütüpaneye gittik ve masal okuduk.”', a: 'kütüpaneye', w: ['Hafta', 'gittik', 'masal'], ex: 'Doğrusu: kütüphaneye.' },
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Herşey çok güzeldi, çok eğlendik.”', a: 'Herşey', w: ['güzeldi', 'çok', 'eğlendik'], ex: 'Doğrusu: Her şey (ayrı yazılır).' },
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Kitap okumayı seviyom çünkü hayal kurarım.”', a: 'seviyom', w: ['okumayı', 'çünkü', 'hayal'], ex: 'Yazı dilinde: seviyorum.' },
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Okula gittiyimde arkadaşlarımı gördüm.”', a: 'gittiyimde', w: ['Okula', 'arkadaşlarımı', 'gördüm'], ex: 'Doğrusu: gittiğimde.' },
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Ödevimi bitirdim yada bitirmek üzereyim.”', a: 'yada', w: ['Ödevimi', 'bitirdim', 'üzereyim'], ex: 'Doğrusu: ya da (ayrı yazılır).' },
  { q: 'Bu yazıdaki yanlış yazılmış sözcük hangisi? “Öğretmenimiz bir sürü kitap önerdi, ben hergün okuyorum.”', a: 'hergün', w: ['sürü', 'önerdi', 'okuyorum'], ex: 'Doğrusu: her gün (ayrı yazılır).' },
  { q: '“Kütüphane saat kaçta açılıyor.” Bu cümledeki hata nedir?', a: 'Sonuna soru işareti gelmeli', w: ['Büyük harfle başlamamalı', 'Sonuna virgül gelmeli', 'Hata yoktur'], ex: 'Soru cümlesi soru işaretiyle biter.' },
  { q: '“ankara’da kitap fuarı açıldı.” Bu cümledeki hata nedir?', a: '“Ankara” büyük harfle başlamalı', w: ['Sonuna soru işareti gelmeli', '“kitap” büyük harfle yazılmalı', 'Hata yoktur'], ex: 'Cümle ve şehir adı büyük harfle başlar: Ankara’da.' },
]
const GORUS_Q: Q[] = [
  { q: 'Metinde “Kitaplar bizi hem bilgilendirir hem eğlendirir.” deniyor. Bu görüşe katılan biri hangi nedeni söyler?', a: 'Katılıyorum, çünkü kitaplardan hem yeni şeyler öğrenir hem eğlenirim.', w: ['Katılıyorum, çünkü kitapların kapakları ağırdır.', 'Katılıyorum, çünkü bugün hava yağmurlu.', 'Katılmıyorum, çünkü kitaplar çok eğlencelidir.'], ex: 'Görüşümüzü, konuyla ilgili bir nedenle söyleriz.' },
  { q: '“Kitap sadece okulda okunur.” görüşüne katılmayan biri hangi nedeni söyler?', a: 'Katılmıyorum, çünkü evde, parkta ve kütüphanede de kitap okuyabiliriz.', w: ['Katılmıyorum, çünkü okul çok büyüktür.', 'Katılmıyorum, çünkü kitapları yalnızca okulda okuruz.', 'Katılmıyorum, çünkü kalemim kırmızı.'], ex: 'Neden, görüşle ilgili ve tutarlı olmalı.' },
  { q: '“Ödünç kitaplar özenle kullanılmalı.” Bu görüşe katılan biri hangi nedeni söyler?', a: 'Katılıyorum, çünkü o kitabı başka çocuklar da okuyacak.', w: ['Katılıyorum, çünkü yırtık sayfalar daha güzeldir.', 'Katılıyorum, çünkü kütüphane uzaktır.', 'Katılmıyorum, çünkü kitapları herkes okumalı.'], ex: 'Katıldığımız görüşü uygun bir nedenle destekleriz.' },
  { q: 'Şiirde “Kitap en iyi dosttur.” deniyor. Bu görüşe katılan biri hangi nedeni söyler?', a: 'Katılıyorum, çünkü kitaplar bana her zaman yeni şeyler anlatır.', w: ['Katılıyorum, çünkü kitaplar renklidir.', 'Katılıyorum, çünkü dostlarım hiç kitap okumaz.', 'Katılmıyorum, çünkü kitaplar bana çok şey öğretir.'], ex: 'Nedenimiz görüşümüzle uyumlu olmalı.' },
  { q: '“Kitap okumak zaman kaybıdır.” görüşüne katılmayan biri ne der?', a: 'Katılmıyorum, çünkü kitaplar sözcüklerimi ve hayal gücümü geliştirir.', w: ['Katılmıyorum, çünkü kitap okumak gerçekten zaman kaybıdır.', 'Katılmıyorum, çünkü hava çok sıcak.', 'Katılmıyorum, çünkü kitabım mavi.'], ex: 'Katılmama nedeni, görüşün yanlışlığını göstermeli.' },
  { q: 'Bir görüşe katılıp katılmadığımızı söylerken ne yaparız?', a: 'Düşüncemizi nedeniyle birlikte söyleriz', w: ['Sadece “evet” deyip susarız', 'Arkadaşımızla alay ederiz', 'Konuyu değiştiririz'], ex: '“Katılıyorum/Katılmıyorum, çünkü …” diye söyleriz.' },
]
const KAYNAK_Q: Q[] = [
  { q: 'Ödevine bir kitaptan aldığın bir bilgiyi yazdın. Ne yapmalısın?', a: 'Kitabın adını kaynak olarak yazmalıyım', w: ['Hiçbir şey yazmamalıyım', 'Bilgiyi kendim bulmuş gibi göstermeliyim', 'Kitabı saklamalıyım'], ex: 'Edindiğimiz bilginin kaynağını yazarız.' },
  { q: 'Hangi yazıda bilginin kaynağı belirtilmiştir?', a: 'Arılar çiçeklerden bal yapar. (Kaynak: Arılar ve Bal kitabı)', w: ['Arılar çiçeklerden bal yapar.', 'Arılar çok güzeldir!', 'Arılar ne yapar?'], ex: 'Kaynak, bilginin nereden alındığını gösterir.' },
  { q: 'Edindiğimiz bilginin kaynağını neden yazarız?', a: 'Bilginin nereden alındığı bilinsin ve kontrol edilebilsin diye', w: ['Yazı uzun görünsün diye', 'Kâğıt dolsun diye', 'Kimse okumasın diye'], ex: 'Kaynak, bilgiyi doğrulamamıza yardım eder.' },
  { q: 'Kaynak genellikle yazının neresine yazılır?', a: 'Sonuna', w: ['Başlığın üstüne', 'Her cümlenin ortasına', 'Hiçbir yere'], ex: 'Kaynaklar yazının sonunda belirtilir.' },
  { q: 'Bir yazarın hayatını araştırırken hangisi güvenilir bir kaynaktır?', a: 'Kütüphanedeki, yazarın hayatını anlatan kitap', w: ['Bir arkadaşın “duydum” dediği söz', 'Kimin yazdığı belli olmayan bir not', 'Bir oyunun içindeki yazı'], ex: 'Güvenilir kaynaklardan araştırma yaparız; genel ağda bir büyüğümüzle ararız.' },
  { q: '“Kaynak: Çocuklar İçin Uzay Atlası” yazısı bize ne söyler?', a: 'Bilginin hangi kitaptan alındığını', w: ['Kitabın kaç sayfa olduğunu', 'Yazının ne zaman bittiğini', 'Kitabın rengini'], ex: 'Kaynak yazısı bilginin alındığı yeri gösterir.' },
]
const DILEKCE_BINS: SortQ['bins'] = [
  { id: 'uygun', label: 'Dilekçeye uygun', img: 'memo', color: '#22c55e' },
  { id: 'degil', label: 'Dilekçeye uygun değil', img: 'noentry', color: '#f97316' },
]
const DILEKCE_ITEMS: SortQ['items'] = [
  { label: 'OKUL MÜDÜRLÜĞÜNE', bin: 'uygun' },
  { label: 'Kütüphanemize yeni masal kitapları alınmasını istiyorum.', bin: 'uygun' },
  { label: 'Gereğini bilgilerinize arz ederim.', bin: 'uygun' },
  { label: 'Tarih', bin: 'uygun' },
  { label: 'Ad, soyad ve imza', bin: 'uygun' },
  { label: 'Bahçeye bir çöp kutusu konulmasını rica ediyorum.', bin: 'uygun' },
  { label: 'Hey müdürüm, naber?', bin: 'degil' },
  { label: 'Kocaman öpüyorum!', bin: 'degil' },
  { label: 'Bir varmış, bir yokmuş…', bin: 'degil' },
  { label: 'Kitap alın yoksa kızarım!', bin: 'degil' },
  { label: 'Hoşça kal, görüşürüz!', bin: 'degil' },
]
const NS_SOZ_Q: Q[] = [
  { q: 'Olay: “Ali kitabını yağmurda unuttu, kitabın sayfaları ıslandı.” Neden–sonucu doğru söyleyen cümle hangisi?', a: 'Kitap yağmurda kaldığı için sayfaları ıslandı.', w: ['Sayfaları ıslandığı için kitap yağmurda kaldı.', 'Ali kitabı sevdiği için yağmur yağdı.', 'Yağmur yağdı ama sayfalar hiç ıslanmadı.'], ex: 'Neden: yağmurda kalması. Sonuç: sayfaların ıslanması.' },
  { q: 'Olay: “Çocuklar kütüphanede yüksek sesle konuştu, okuyanlar rahatsız oldu.” Neden–sonucu doğru söyleyen cümle hangisi?', a: 'Yüksek sesle konuşulduğu için okuyanlar rahatsız oldu.', w: ['Okuyanlar rahatsız olduğu için çocuklar konuştu.', 'Kütüphane büyük olduğu için çocuklar sustu.', 'Çocuklar konuştu, bu yüzden kitaplar uçtu.'], ex: '“için” sözünden önce neden gelir.' },
  { q: 'Olay: “Mert her gün kitap okudu, sözcük dağarcığı genişledi.” Neden–sonucu doğru söyleyen cümle hangisi?', a: 'Her gün kitap okuduğu için sözcük dağarcığı genişledi.', w: ['Mert kitap okumadığı için sözcük dağarcığı genişledi.', 'Mert kitap okudu, bu yüzden uykusu kaçtı.', 'Sözcükleri azaldığı için Mert kitap okudu.'], ex: 'Neden: her gün okumak. Sonuç: sözcüklerin çoğalması.' },
  { q: 'Olay: “Musluk açık kaldı, lavabo taştı.” Neden–sonucu doğru söyleyen cümle hangisi?', a: 'Musluk açık kaldığı için lavabo taştı.', w: ['Lavabo taştığı için musluk açıldı.', 'Musluk kapalı olduğu için lavabo taştı.', 'Lavabo taştı çünkü hava güneşliydi.'], ex: 'Neden: açık kalan musluk. Sonuç: taşan lavabo.' },
  { q: 'Olay: “Defne kütüphane kartını evde unuttu, kitap ödünç alamadı.” Neden–sonucu doğru söyleyen cümle hangisi?', a: 'Kartını evde unuttuğu için kitap ödünç alamadı.', w: ['Kitap alamadığı için kartını evde unuttu.', 'Kartını getirdiği için kitap alamadı.', 'Kitap aldığı için kartını unuttu.'], ex: 'Önce neden olur, sonra sonuç gelir.' },
  { q: 'Hangi sözcük neden bildirir?', a: 'çünkü', w: ['bu yüzden', 'ama', 've'], ex: '“çünkü”den sonra neden söylenir; “bu yüzden”den sonra sonuç gelir.' },
  { q: '“Çok yoruldum, … erken uyudum.” Sonucu bağlayan söz hangisi?', a: 'bu yüzden', w: ['çünkü', 'ama', 'ya da'], ex: '“bu yüzden” sonucu bildirir.' },
]

/* ---------- Tema 5 ---------- */
const GOLGE_D: Dinleme = {
  t: 'Gölge Kuklası',
  img: 'theater',
  text: 'Bugün size bir gölge oyunu kuklası yapmayı anlatacağım. Önce kalın bir kartona bir kuş resmi çiziyoruz. Sonra resmi bir büyüğümüzün yardımıyla makasla kesiyoruz. Kuşun arkasına ince bir çubuk yapıştırıyoruz. Beyaz bir perdenin arkasına bir lamba yerleştiriyoruz. Lamba yanınca çubuğu oynatıyoruz ve kuşumuzun gölgesi perdede kanat çırpıyor.',
  qs: [
    { q: 'Kartonu kesmek için hangi araç kullanıldı? Resmini seç.', a: 'Makas', w: ['Kalem', 'Cetvel', 'Fırça'], ex: 'Anlatıcı, resmi makasla kestiklerini söyledi.', o: { Makas: 'scissors', Kalem: 'pencil', Cetvel: 'ruler', Fırça: 'paint' } },
    { q: 'Kartona hangi hayvanın resmi çizildi? Resmini seç.', a: 'Kuş', w: ['Kedi', 'Balık', 'Tavşan'], ex: 'Kuklamız bir kuştu.', o: { Kuş: 'bird', Kedi: 'cat', Balık: 'fish', Tavşan: 'rabbit' } },
    { q: 'Gölgenin oluşması için perdenin arkasına ne kondu? Resmini seç.', a: 'Lamba', w: ['Şemsiye', 'Top', 'Saat'], ex: 'Işık olmadan gölge oluşmaz.', o: { Lamba: 'bulb', Şemsiye: 'umbrella', Top: 'ball', Saat: 'clock' } },
    { q: 'Anlatılanlara en uygun resim hangisi?', a: 'Gölge oyunu sahnesi', w: ['Futbol topu', 'Uzay roketi', 'Yağmur bulutu'], ex: 'Sözler ile resim aynı konuyu anlatmalı.', o: { 'Gölge oyunu sahnesi': 'theater', 'Futbol topu': 'ball', 'Uzay roketi': 'rocket', 'Yağmur bulutu': 'rain' } },
    { q: 'Kuşun gölgesi perdede neden kanat çırpıyor gibi göründü?', a: 'Çubuk oynatıldığı için', w: ['Lamba söndürüldüğü için', 'Perde kaldırıldığı için', 'Kuş gerçek olduğu için'], ex: 'Çubuğu oynatınca kukla, kukla oynayınca gölge hareket eder.' },
    { q: 'Anlatıcı neden “bir büyüğümüzün yardımıyla” dedi?', a: 'Makası güvenle kullanmak için', w: ['Kartonu boyamak için', 'Lambayı kırmak için', 'Oyunu bitirmek için'], ex: 'Kesici araçları bir büyüğümüzle kullanırız.' },
  ],
}
const ORNEK_Q: Q[] = [
  { q: 'Ece, “Geleneksel oyunlar çok eğlencelidir.” dedi. Sözünü hangi örnekle destekleyebilir?', a: 'Mesela mendil kapmaca oynarken hep çok güleriz.', w: ['Mesela bugün hava güneşli.', 'Mesela kalemim kırmızı.', 'Mesela kardeşim uyuyor.'], ex: 'Örnek, söylediğimiz düşünceyle ilgili olmalı.' },
  { q: 'Can, “Yeteneğimizi geliştirmek için çalışmalıyız.” dedi. Hangi örnek bu sözü destekler?', a: 'Örneğin her gün bağlama çalışan Ali artık türkü çalabiliyor.', w: ['Örneğin dün akşam pizza yedik.', 'Örneğin parkta salıncak var.', 'Örneğin kedimin adı Pamuk.'], ex: 'Örnek, düşünceyi kanıtlayan bir durum anlatır.' },
  { q: '“Sporun birçok dalı vardır.” sözüne hangisi örnek olur?', a: 'Örneğin okçuluk, yüzme ve futbol.', w: ['Örneğin elma, armut ve kiraz.', 'Örneğin masa, sandalye ve dolap.', 'Örneğin kalem, silgi ve defter.'], ex: 'Örnekler, sözü edilen konudan seçilir.' },
  { q: '“Sanatın pek çok dalı vardır.” sözüne hangisi örnek olur?', a: 'Örneğin resim, müzik ve tiyatro.', w: ['Örneğin otobüs, tren ve uçak.', 'Örneğin kedi, köpek ve kuş.', 'Örneğin yağmur, kar ve dolu.'], ex: 'Resim, müzik ve tiyatro sanat dallarıdır.' },
  { q: 'Konuşmamızda örnek vermek ne işe yarar?', a: 'Söylediklerimizi daha anlaşılır yapar', w: ['Konuşmayı karıştırır', 'Dinleyeni sıkar', 'Konuyu unutturur'], ex: 'Örnekler düşüncemizi somutlaştırır.' },
  { q: 'Örnek verirken hangi sözcükleri kullanırız?', a: 'örneğin, mesela', w: ['ama, fakat', 'çünkü, bu yüzden', 've, ile'], ex: '“Örneğin” ve “mesela” örnek vereceğimizi gösterir.' },
]

/* ---------- Tema 6 ---------- */
const GOKYUZU_D: Dinleme = {
  t: 'Pencereden Gökyüzü',
  img: 'telescope',
  text: 'Zehra her akşam penceresinin önüne oturup gökyüzünü izler. Gündüz Güneş, odasını ışıkla doldurur. Gece olunca Ay bazen yuvarlak, bazen ince bir hilal gibi görünür. Yıldızlar küçük ışıklar gibi göz kırpar. Zehra, uzaktaki gök cisimlerini daha yakından görmek için dedesiyle teleskopla bakar. Gördüklerini defterine not eder ve resimlerini çizer.',
  qs: [
    { q: 'Dinlediğin metnin konusu nedir?', a: 'Bir çocuğun gökyüzünü gözlemesi', w: ['Bir futbol maçı', 'Bir pasta tarifi', 'Denizde balık tutmak'], ex: 'Metin Zehra’nın gökyüzünü izlemesini anlatıyor.' },
    { q: 'Bilmece: “Gündüz çıkar, odayı ışıkla doldurur.” Bu hangisi?', a: 'Güneş', w: ['Ay', 'Yıldız', 'Bulut'], ex: 'Gündüz bizi Güneş aydınlatır.', o: { Güneş: 'sun', Ay: 'moon', Yıldız: 'star', Bulut: 'cloud' } },
    { q: 'Bilmece: “Bazen yuvarlak, bazen ince bir hilal olur.” Bu hangisi?', a: 'Ay', w: ['Güneş', 'Yıldız', 'Bulut'], ex: 'Ay her gece farklı görünür.', o: { Güneş: 'sun', Ay: 'moon', Yıldız: 'star', Bulut: 'cloud' } },
    { q: 'Bilmece: “Küçük ışıklar gibi göz kırpar.” Bu hangisi?', a: 'Yıldız', w: ['Güneş', 'Ay', 'Bulut'], ex: 'Yıldızlar uzaktan küçük ışıklar gibi görünür.', o: { Güneş: 'sun', Ay: 'moon', Yıldız: 'star', Bulut: 'cloud' } },
    { q: 'Zehra uzaktaki gök cisimlerine neyle bakıyor?', a: 'Teleskop', w: ['Mikroskop', 'Büyüteç', 'Fotoğraf makinesi'], ex: 'Teleskop uzaktakileri yakın gösterir.', o: { Teleskop: 'telescope', Mikroskop: 'microscope', Büyüteç: 'magnifier', 'Fotoğraf makinesi': 'camera' } },
    { q: 'Zehra gördüklerini unutmamak için ne yapıyor?', a: 'Defterine not ediyor', w: ['Hemen uyuyor', 'Pencereyi kapatıyor', 'Kimseye söylemiyor'], ex: 'Not almak hatırlamayı kolaylaştırır.' },
  ],
}
const YONTEM_SEC_Q: Q[] = [
  { q: 'Öğretmenin gezegenleri anlatacak, sonra bilgileri soracak. Bilgileri unutmamak için hangi dinleme yöntemini seçersin?', a: 'Not alarak dinleme', w: ['Katılımsız dinleme', 'Katılımlı dinleme', 'Başka şeyle uğraşarak dinleme'], ex: 'Not alarak dinlemede önemli noktaları yazar, kolay hatırlarız.' },
  { q: 'Sınıfa gelen bilim insanına merak ettiklerini sorabileceksin. Hangi dinleme yöntemi uygun?', a: 'Katılımlı dinleme', w: ['Katılımsız dinleme', 'Kulaklarını kapatarak dinleme', 'Başka şeyle uğraşarak dinleme'], ex: 'Katılımlı dinlemede soru sorar, görüşümüzü paylaşırız.' },
  { q: 'Bir masalı hiç konuşmadan, yalnızca hikâyeye odaklanarak dinlemek istiyorsun. Hangi yöntem uygun?', a: 'Katılımsız dinleme', w: ['Katılımlı dinleme', 'Not alarak dinleme', 'Başka şeyle uğraşarak dinleme'], ex: 'Katılımsız dinlemede etkileşim olmadan konuya odaklanırız.' },
  { q: 'Bir deneyin adımlarını dinleyip sonra kendin yapacaksın. Hangi yöntem uygun?', a: 'Not alarak dinleme', w: ['Katılımsız dinleme', 'Katılımlı dinleme', 'Kulaklarını kapatarak dinleme'], ex: 'Adımları not edersek sırayı karıştırmayız.' },
  { q: 'Yazar okulunuza geldi, sorularınızı yanıtlayacak. Hangi dinleme yöntemi uygun?', a: 'Katılımlı dinleme', w: ['Katılımsız dinleme', 'Not alarak dinleme', 'Kulaklarını kapatarak dinleme'], ex: 'Soru sorabildiğimiz dinleme katılımlı dinlemedir.' },
  { q: 'Dinleme yöntemini seçerken neye dikkat ederiz?', a: 'Konuya ve dinleme amacımıza', w: ['Saatin rengine', 'Sıranın boyuna', 'Ayakkabımıza'], ex: 'Konuya ve amacımıza göre yöntem seçeriz.' },
]
const YONTEM_NEDEN_Q: Q[] = [
  { q: 'Elif, uzay belgeselini not alarak izledi. Bu yöntemi neden seçmiş olabilir?', a: 'Önemli bilgileri unutmamak için', w: ['Belgeseli izlememek için', 'Arkadaşlarıyla sohbet etmek için', 'Uyumak için'], ex: 'Not almak önemli noktaları hatırlamamızı sağlar.' },
  { q: 'Kerem, söyleşide katılımlı dinlemeyi seçti. Bunun nedeni ne olabilir?', a: 'Merak ettiklerini sormak istediği için', w: ['Hiç konuşmamak istediği için', 'Not tutmak istediği için', 'Söyleşiden sıkıldığı için'], ex: 'Katılımlı dinlemede soru sorarız.' },
  { q: 'Ada, masalı katılımsız dinledi. Bu yöntemi neden seçmiş olabilir?', a: 'Hikâyeye odaklanıp keyifle dinlemek için', w: ['Soru sormak istediği için', 'Bütün cümleleri yazmak istediği için', 'Masalı dinlememek için'], ex: 'Katılımsız dinlemede yalnızca dinleyip konuya odaklanırız.' },
  { q: 'Not alarak dinlemenin yararı nedir?', a: 'Önemli noktaları kolayca hatırlarız', w: ['Hiçbir şey hatırlamayız', 'Konuşmacıyı susturur', 'Dinlemeyi gereksiz yapar'], ex: 'Notlarımız bize yol gösterir.' },
  { q: 'Katılımlı dinlemenin yararı nedir?', a: 'Sorularımızı sorup düşüncemizi paylaşabiliriz', w: ['Hiç konuşamayız', 'Konuyu daha az anlarız', 'Dinleyeni rahatsız ederiz'], ex: 'Katılımlı dinlemede uygun zamanda söz alırız.' },
  { q: 'Selin, “Ben bu kez not alarak dinledim, çünkü …” dedi. En uygun devam hangisi?', a: 'bilgiler çoktu ve unutmak istemedim', w: ['dinlemeyi hiç sevmem', 'kalemim yoktu', 'konuşmacıyı duymadım'], ex: 'Yöntemi seçme nedenimizi açıklarız.' },
]

/* ---------- Tema 7 ---------- */
const ORTAM_Q: Q[] = [
  { q: 'Hangi ortam bir metni dinlemek için en uygundur?', a: 'Sessiz ve düzenli bir sınıf', w: ['Gürültülü bir pazar yeri', 'Televizyonun yüksek sesle açık olduğu oda', 'Kalabalık bir otobüs durağı'], ex: 'Dinleme ortamı sessiz ve rahat olmalı.' },
  { q: 'Dinleme metnini dinlerken yan odada televizyon çok yüksek sesle açık. Ne yapmalısın?', a: 'Bir büyüğümden sesi kısmasını rica ederim', w: ['Metnin sesini sonuna kadar açarım', 'Dinlemeyi bırakırım', 'Ben de bağırırım'], ex: 'Ortamı dinlemeye uygun hâle getiririz.' },
  { q: 'Dinlemeye başlamadan önce neyi gözden geçiririz?', a: 'Ortamın sessiz ve sesi duyabileceğimiz kadar uygun olup olmadığını', w: ['Ayakkabılarımızın rengini', 'Akşam ne yiyeceğimizi', 'Sıradaki kalemlerin sayısını'], ex: 'Dinleme ortamının uygunluğunu önceden kontrol ederiz.' },
  { q: 'Sınıfta arkadaşların konuşurken dinleme metnini duyamıyorsun. En uygun davranış hangisi?', a: 'Nazikçe sessiz olmalarını rica ederim', w: ['Onlara bağırırım', 'Ben de konuşmaya katılırım', 'Kulaklarımı kapatıp uyurum'], ex: 'Nazik bir ricayla ortamı düzeltebiliriz.' },
  { q: 'Hangisi dinleme ortamını uygun hâle getirir?', a: 'Pencereyi kapatıp dışarıdaki gürültüyü azaltmak', w: ['Müziği açmak', 'Masaya vurmak', 'Oyuncaklarla oynamak'], ex: 'Gürültüyü azaltmak dinlemeyi kolaylaştırır.' },
  { q: 'Dinleme ortamı neden önemlidir?', a: 'Uygun ortamda daha iyi odaklanır ve anlarız', w: ['Ortam dinlemeyi hiç etkilemez', 'Gürültülü ortamda daha iyi anlarız', 'Ortam yalnızca resim yaparken önemlidir'], ex: 'Sessiz ve rahat ortam, dikkatimizi toplar.' },
]
const IKI_OYUN: Metin = {
  t: 'İki Oyun, İki Zaman',
  img: 'kite',
  text: '1. metin: Dedem çocukken arkadaşlarıyla sokakta çember çevirir, saklambaç oynarmış. Oyuncaklarını tahtadan ve bezden kendileri yaparlarmış. 2. metin: Bugün Duru, tabletinde bir bulmaca oyunu oynuyor. Oyunu tek başına, ekrana bakarak oynuyor. Hafta sonları ise arkadaşlarıyla parkta ip atlıyor.',
  qs: [
    { q: 'İki metnin ortak yönü nedir?', a: 'İkisinde de çocukların oyun oynaması anlatılıyor', w: ['İkisi de okulda geçiyor', 'İkisi de bir yemek tarifi', 'İkisinde de hiç oyun yok'], ex: 'İki metin de çocuk oyunlarını anlatıyor.' },
    { q: 'İki metin hangi yönüyle farklıdır?', a: 'Birinde geleneksel, diğerinde dijital oyun öne çıkıyor', w: ['İkisi de yalnızca tablet oyunlarını anlatıyor', 'İkisinde de oyuncak yapılıyor', 'İkisi de aynı kişiyi anlatıyor'], ex: 'Çember ve saklambaç geleneksel, tablet oyunu dijitaldir.' },
    { q: 'Dedenin oyuncakları Duru’nun tablet oyunundan nasıl ayrılır?', a: 'Dedenin oyuncakları tahta ve bezden yapılmış', w: ['Dedenin oyuncakları ekranlıydı', 'Duru’nun oyunu tahtadan yapılmış', 'İkisi de bezden yapılmış'], ex: 'Dede oyuncaklarını kendi yaparmış.' },
    { q: 'Duru’nun hafta sonu oyunu hangi metindeki oyunlara benzer?', a: 'Dedenin sokak oyunlarına', w: ['Tablet oyununa', 'Hiçbir oyuna', 'Bilgisayar oyununa'], ex: 'İp atlamak da arkadaşlarla oynanan geleneksel bir oyundur.' },
    { q: 'Duru tablet oyununu nasıl oynuyor?', a: 'Tek başına', w: ['Arkadaşlarıyla', 'Dedesiyle', 'Bütün sınıfla'], ex: 'Metinde “tek başına, ekrana bakarak” deniyor.' },
  ],
}
const KOMSU_D: Dinleme = {
  t: 'Karşı Dairedeki Kız',
  img: 'house',
  text: 'Karşı daireye yeni bir aile taşındı. Kutular taşınırken küçük bir kız merdivende tek başına oturuyordu. Ahmet, annesiyle birlikte ona bir tabak kurabiye götürdü. Kızın adı Lale’ydi ve kimseyi tanımadığı için biraz üzgündü. Ahmet, “Yarın parkta top oynuyoruz, sen de gelir misin?” diye sordu. Lale’nin yüzü güldü.',
  qs: [
    { q: 'Dinlediğin metnin devamında ne olabilir?', a: 'Lale ertesi gün parka gelip Ahmet’le oynar', w: ['Lale bir daha hiç dışarı çıkmaz', 'Ahmet kurabiyeleri geri ister', 'Kutular kendi kendine uçar'], ex: 'Lale’nin yüzünün gülmesi daveti kabul edeceğini düşündürür.' },
    { q: 'Lale neden üzgündü?', a: 'Kimseyi tanımadığı için', w: ['Kurabiyeyi sevmediği için', 'Parkı beğenmediği için', 'Topu kaybettiği için'], ex: 'Yeni taşınan Lale kimseyi tanımıyordu.' },
    { q: 'Ahmet ve annesi Lale’ye ne götürdü?', a: 'Kurabiye', w: ['Çiçek', 'Top', 'Kitap'], ex: 'Bir tabak kurabiye götürdüler.' },
    { q: 'Lale’nin yüzünün gülmesi neyi gösterir?', a: 'Davete sevindiğini', w: ['Kızdığını', 'Korktuğunu', 'Uykusunun geldiğini'], ex: 'Gülümseme sevinci gösterir.' },
    { q: 'Dinlediğin metnin ana fikri nedir?', a: 'Yeni komşulara yakınlık göstermek onları mutlu eder', w: ['Taşınmak çok yorucudur', 'Kurabiye en güzel yiyecektir', 'Merdivende oturmak tehlikelidir'], ex: 'Ahmet’in yakınlığı Lale’yi mutlu etti.' },
    { q: 'Ahmet, Lale’yi parktaki arkadaşlarıyla tanıştırırsa ne olabilir?', a: 'Lale yeni arkadaşlar edinir', w: ['Lale daha çok üzülür', 'Park kapanır', 'Ahmet top oynamayı bırakır'], ex: 'Olayların sonrası hakkında tahmin yürütürüz.' },
  ],
}

/* ---------- Tema 8 ---------- */
const KATILMA_Q: Q[] = [
  { q: 'Arkadaşın “Salıncağa hep önce ben binmeliyim.” dedi. Katılmıyorsun. En uygun nasıl söylersin?', a: 'Katılmıyorum, çünkü parkı herkes kullanır; sıraya girmeliyiz.', w: ['Sen hep böylesin, seninle oynamam!', 'Katılmıyorum, çünkü salıncak mavi.', 'Hiçbir şey söylemeden onu iterim.'], ex: 'Katılmadığımız görüşü nazikçe ve nedeniyle söyleriz.' },
  { q: 'Bir arkadaşın “Sınıf başkanı en uzun boylu öğrenci olmalı.” dedi. Katılmıyorsun. Ne dersin?', a: 'Katılmıyorum, çünkü başkanı oy vererek seçeriz; herkesin seçilme hakkı var.', w: ['Bu çok saçma, sus!', 'Katılmıyorum, çünkü bugün cuma.', 'Katılmıyorum, çünkü en uzun boylu kişi başkan olmalı.'], ex: 'Nedenimiz konuyla ilgili ve tutarlı olmalı.' },
  { q: 'Biri “Çöpü yere atsak da olur, nasılsa biri toplar.” dedi. Katılmıyorsun. Ne dersin?', a: 'Katılmıyorum, çünkü çevreyi temiz tutmak hepimizin sorumluluğu.', w: ['Katılmıyorum, çünkü çöp kutusu kırmızı.', 'Sen çok kötüsün!', 'Katılmıyorum, çünkü biri mutlaka toplar.'], ex: 'Görüşe katılmama nedenini açıkça söyleriz.' },
  { q: 'Arkadaşın “Oyunlarımıza küçükleri almayalım.” dedi. Katılmıyorsun. Ne dersin?', a: 'Katılmıyorum, çünkü her çocuğun oyun oynama hakkı var.', w: ['Katılmıyorum, çünkü hava çok sıcak.', 'Seninle bir daha konuşmam!', 'Katılmıyorum, çünkü küçükler oynamamalı.'], ex: 'Oyun oynamak her çocuğun hakkıdır.' },
  { q: 'Biri “Şifremi en yakın arkadaşıma söyleyebilirim.” dedi. Katılmıyorsun. Ne dersin?', a: 'Katılmıyorum, çünkü şifre gizlidir; kimseyle paylaşmamalıyız.', w: ['Katılmıyorum, çünkü arkadaşlar şifreyi bilmeli.', 'Katılmıyorum, çünkü şifreler uzundur.', 'Bunu söyleyen hiçbir şey bilmiyor!'], ex: 'Kişisel bilgilerimizi ve şifremizi koruruz.' },
  { q: 'Katılmadığımız bir görüşü söylerken hangisi doğrudur?', a: 'Nazikçe ve nedenini açıklayarak söyleriz', w: ['Arkadaşımızla alay ederiz', 'Bağırırız', 'Konuşanın sözünü keseriz'], ex: '“Katılmıyorum, çünkü …” diye nazikçe söyleriz.' },
]
const USTA_D: Dinleme = {
  t: 'Usta ile Çırak',
  img: 'jar',
  text: 'Yaşlı bir çömlek ustasının yanında genç bir çırak çalışıyordu. Çırak ilk testisini yapınca hemen ustasına gösterdi. Usta testiyi inceledi ve “Bu, yapabileceğinin en iyisi mi?” diye sordu. Çırak yeniden çalıştı ve testinin kulpunu daha düzgün yaptı. Usta aynı soruyu birkaç kez daha sordu. Sonunda çırak öyle güzel bir testi yaptı ki usta gülümsedi. Çırak, sabırla çalışmanın emeği güzelleştirdiğini anladı.',
  qs: [
    { q: 'Dinlediğin metnin ana fikri nedir?', a: 'Sabırla ve özenle çalışırsak daha iyisini yaparız', w: ['Testiler çok kolay kırılır', 'İlk yaptığımız iş her zaman en iyisidir', 'Ustalar hiç gülümsemez'], ex: 'Çırak sabırla çalışıp en iyisini yaptı.' },
    { q: 'Usta neden aynı soruyu tekrar tekrar sordu?', a: 'Çırağın daha iyisini yapabileceğini bildiği için', w: ['Çırağa kızdığı için', 'Soruyu unuttuğu için', 'Testiyi kırmak istediği için'], ex: 'Usta, çırağın emeğini geliştirmesini istedi.' },
    { q: 'Çırak ikinci denemede neyi düzeltti?', a: 'Testinin kulpunu', w: ['Testinin rengini', 'Dükkânın kapısını', 'Ustanın masasını'], ex: 'Çırak kulpu daha düzgün yaptı.' },
    { q: 'Dinlediğin metnin konusu nedir?', a: 'Bir çırağın ustasından sabrı öğrenmesi', w: ['Bir testinin kırılması', 'Bir pazar alışverişi', 'Bir çömlek yarışmasının kazananı'], ex: 'Metin, çırağın sabırla çalışmayı öğrenmesini anlatıyor.' },
    { q: 'Usta en sonunda neden gülümsedi?', a: 'Çırak çok güzel bir testi yaptığı için', w: ['Çırak işi bıraktığı için', 'Testi kırıldığı için', 'Dükkân kapandığı için'], ex: 'Emeğin güzel sonucu ustayı mutlu etti.' },
    { q: 'Bu metne en uygun başlık hangisi?', a: 'Emek ve Sabır', w: ['Kırık Testi', 'Pazar Günü', 'Kayıp Kulp'], ex: 'Başlık metnin ana fikrine uygun olmalı.' },
  ],
}

const DKY_EK: Record<string, Alan['acts']> = {
  t1: [
    { kind: 'dinle-kelebek', title: 'Dinle: Gösterişli Kelebek', icon: 'ear', total: T, meb: 'T.D.3.3.b', gen: dinle(KELEBEK_D), ders: 'Metni dikkatle dinle. Konusu ne, bize ne öğretiyor (ana fikir)?', points: ['Dinlerken konuşmayız', 'Kim, ne yaptı? Aklında tut', 'İstersen tekrar dinle'], visual: img('ear') },
    { kind: 'sirayla-yaz', title: 'Olayları Sırayla Yazalım', icon: 'notebook', total: T, meb: 'T.Y.3.2.g', gen: rot(ord(SIRA_YAZ_O), ch(SIRA_YAZ_Q)), ders: 'Bir olayı kendi cümlelerimizle yazarken olayları yaşandığı sırayla yazarız: önce, sonra, en sonunda.', visual: img('notebook') },
    { kind: 'baslik-tahmin', title: 'Başlıktan Tahmin', icon: 'eye', total: T, meb: 'T.O.3.2.b', gen: ch(BASLIK_Q), ders: 'Okumadan önce başlığa ve resme bak; metinde neler anlatılacağını tahmin et.', visual: img('eye') },
    { kind: 'tahmin-once', title: 'Daha Önce Ne Oldu?', icon: 'detective', total: T, meb: 'T.O.3.2.c', gen: ch(ONCE_Q), ders: 'Okuduğun cümledeki ipuçlarından olaydan önce ne olduğunu tahmin et.', visual: img('detective') },
    { kind: 'devam', title: 'Hikâyenin Devamı', icon: 'openbook', total: T, meb: 'T.Y.3.2.a', gen: rot(ch(DEVAM_Q), ord(DEVAM_O)), ders: 'Hikâyenin başını oku. Ona en uygun, akla yatkın devamı seç ya da sırala.', visual: img('openbook') },
  ],
  t2: [
    { kind: 'dinle-kose', title: 'Dinle: Atatürk Köşemiz', icon: 'ear', total: T, meb: 'T.D.3.2.d', gen: dinle(KOSE_D), ders: 'Metni dinle. Söylenmeyenleri ipuçlarından çıkar: Neden? Ne anlama geliyor?', visual: img('ear') },
    { kind: 'jest-mimik', title: 'Jest ve Mimik', icon: 'clap', total: T, meb: 'T.K.3.3.h', gen: ch(JEST_Q), ders: 'Jest: el ve kol hareketleri. Mimik: yüz ifadeleri. Konuşmamızı onlarla destekleriz.', visual: img('clap') },
    { kind: 'imza', title: 'İmzam', icon: 'pencil', total: T, meb: 'T.Y.3.1.e', gen: ch(IMZA_Q), ders: 'İmzamızı adımız ya da soyadımızla, kendimize özgü biçimde oluştururuz; hep aynı biçimde atarız.', visual: img('pencil') },
    { kind: 'davetiye', title: 'Davetiye Hazırlayalım', icon: 'party', total: T, meb: 'T.Y.3.2.ı', gen: rot(ord(DAVET_O), ch(DAVET_Q)), ders: 'Davetiye: hitap, etkinlik, davet sözü, gün-saat-yer ve davet edenin adı.', visual: img('party') },
    { kind: 'mektup-bolum', title: 'Mektubun Bölümleri', icon: 'memo', total: 4, meb: 'T.Y.3.2.ı', gen: srt('Cümleleri mektubun bölümlerine ayır.', 'Mektup hitapla başlar; giriş ve gelişmede anlatırız; sonuçta dilek ve vedalaşma olur.', MEKTUP_BINS, MEKTUP_ITEMS), ders: 'Her cümle mektubun hangi bölümüne ait?', visual: img('memo') },
  ],
  t3: [
    { kind: 'dinle-orman', title: 'Dinle: Ormanda Bir Gün', icon: 'ear', total: T, meb: 'T.D.3.3.a', gen: dinle(ORMAN_D), ders: 'Metni dinle. Olayları ve ne zaman olduklarını (sabah, öğle, akşam) aklında tut.', visual: img('ear') },
    { kind: 'konusma-plan', title: 'Konuşma Planı', icon: 'microphone', total: T, meb: 'T.K.3.1.d', gen: rot(ord(PLAN_O), ch(PLAN_Q)), ders: 'Konuşma planı: konu seç, bilgi topla; giriş, gelişme ve sonucu planla.', visual: img('microphone') },
    { kind: 'deney-yonerge', title: 'Deney Yönergesi', icon: 'testtube', total: T, meb: 'T.Y.3.2.ğ', gen: rot(ord(DENEY_O), ch(DENEY_Q)), ders: 'Yönerge, bir işin nasıl yapılacağını adım adım anlatır. Önce malzemeler, sonra sıralı adımlar.', visual: img('testtube') },
  ],
  t4: [
    { kind: 'dinle-karsilastir', title: 'Dinle ve Karşılaştır', icon: 'ear', total: T, meb: 'T.D.3.3.ç', gen: dinle(VIDEO_D, GORUS_D), ders: 'İki metni dinle. Benzer ve farklı yönlerini bul.', visual: img('ear') },
    { kind: 'gorus', title: 'Katılıyor muyum?', icon: 'thinking', total: T, meb: 'T.O.3.2.ı', gen: ch(GORUS_Q), ders: 'Okuduğun görüşe katılıp katılmadığını nedeniyle söyle: “Katılıyorum/Katılmıyorum, çünkü …”', visual: img('thinking') },
    { kind: 'neden-soyle', title: 'Neden–Sonuç Söyleyelim', icon: 'link', total: T, meb: 'T.K.3.2.l', gen: ch(NS_SOZ_Q), ders: 'Olayın nedenini ve sonucunu doğru sırayla söyle: “… için …”, “çünkü”, “bu yüzden”.', visual: img('link') },
    { kind: 'dilekce-uygun', title: 'Dilekçeye Uygun mu?', icon: 'memo', total: 4, meb: 'T.Y.3.2.ı', gen: srt('İfadeleri sepetlere ayır.', 'Dilekçe resmî ve saygılı bir dille yazılır; kurum adı, istek, saygı sözü, tarih ve imza bulunur.', DILEKCE_BINS, DILEKCE_ITEMS), ders: 'Hangi ifade dilekçeye yakışır, hangisi yakışmaz? (Örnekler hayalîdir.)', visual: img('memo') },
    { kind: 'kaynak', title: 'Kaynağını Yaz', icon: 'books', total: T, meb: 'T.Y.3.2.j', gen: ch(KAYNAK_Q), ders: 'Bir bilgiyi kitaptan ya da dergiden aldıysak kaynağını yazının sonuna yazarız.', visual: img('books') },
    { kind: 'hata-bul', title: 'Hatayı Bul', icon: 'magnifier', total: T, meb: 'T.Y.3.5.a', gen: ch(HATA_Q), ders: 'Yazıyı dikkatle oku; yanlış yazılmış sözcüğü ya da işaret hatasını bul.', visual: img('magnifier') },
  ],
  t5: [
    { kind: 'dinle-golge', title: 'Dinle: Gölge Kuklası', icon: 'ear', total: T, meb: 'T.D.3.3.e', gen: dinle(GOLGE_D), ders: 'Anlatılanı dinle. Söylenenlerle resimleri eşleştir.', visual: img('ear') },
    { kind: 'ornek-ver', title: 'Örnek Verelim', icon: 'raisedhand', total: T, meb: 'T.K.3.2.i', gen: ch(ORNEK_Q), ders: 'Konuşurken düşüncemizi “örneğin, mesela” diyerek uygun örneklerle destekleriz.', visual: img('raisedhand') },
  ],
  t6: [
    { kind: 'dinle-gokyuzu', title: 'Dinle: Pencereden Gökyüzü', icon: 'ear', total: T, meb: 'T.D.3.3.c', gen: dinle(GOKYUZU_D), ders: 'Metni dinle. Konusunu bul, bilmeceleri çöz.', visual: img('ear') },
    { kind: 'dinleme-yontem', title: 'Hangi Dinleme Yöntemi?', icon: 'headphone', total: T, meb: 'T.D.3.1.b', gen: ch(YONTEM_SEC_Q), ders: 'Katılımlı: soru sorarak. Katılımsız: sessizce odaklanarak. Not alarak: önemli noktaları yazarak.', visual: img('headphone') },
    { kind: 'yontem-neden', title: 'Neden Bu Yöntem?', icon: 'thinking', total: T, meb: 'T.D.3.5.a', gen: ch(YONTEM_NEDEN_Q), ders: 'Seçtiğin dinleme yöntemini ve nedenini açıkla.', visual: img('thinking') },
  ],
  t7: [
    { kind: 'dinle-komsu', title: 'Dinle: Karşı Dairedeki Kız', icon: 'ear', total: T, meb: 'T.D.3.2.c', gen: dinle(KOMSU_D), ders: 'Metni dinle. Olaylardan sonra neler olabileceğini tahmin et.', visual: img('ear') },
    { kind: 'dinleme-ortam', title: 'Dinleme Ortamı', icon: 'speaker', total: T, meb: 'T.D.3.4.a', gen: ch(ORTAM_Q), ders: 'Dinlemeden önce ortamı gözden geçir: sessiz mi, sesi duyabiliyor muyum?', visual: img('speaker') },
    { kind: 'iki-metin', title: 'İki Metni Karşılaştır', icon: 'kite', total: T, meb: 'T.O.3.3.ç', gen: oku(IKI_OYUN), ders: 'İki kısa metni oku. Benzer ve farklı yönlerini bul.', visual: img('kite') },
  ],
  t8: [
    { kind: 'dinle-usta', title: 'Dinle: Usta ile Çırak', icon: 'ear', total: T, meb: 'T.D.3.3.b', gen: dinle(USTA_D), ders: 'Metni dinle. Konusunu ve ana fikrini bul.', visual: img('ear') },
    { kind: 'katilmiyorum', title: 'Katılmıyorum, Çünkü…', icon: 'handshake', total: T, meb: 'T.K.3.2.ğ', gen: ch(KATILMA_Q), ders: 'Katılmadığın bir görüşü nazikçe ve nedeniyle söyle: “Katılmıyorum, çünkü …”', visual: img('handshake') },
  ],
}
/** ana oyunlara da dinleme/konuşma soruları karışsın (yaklaşık dörtte bir) */
const OYUN_EK: Record<string, Gen> = {
  t1: dinle(KELEBEK_D),
  t2: ch(JEST_Q),
  t3: dinle(ORMAN_D),
  t4: ch(NS_SOZ_Q),
  t5: dinle(GOLGE_D),
  t6: dinle(GOKYUZU_D),
  t7: dinle(KOMSU_D),
  t8: dinle(USTA_D),
}
for (const t of TR3_ADALAR) {
  const ek = DKY_EK[t.id] ?? []
  const kinds = new Set(t.acts.map((a) => a.kind))
  const yeni = ek.map((a) => (kinds.has(a.kind) ? { ...a, kind: `${a.kind}-2` } : a))
  const ana = t.acts.find((a) => a.oyun && a.total === OYUN)
  const oyunEk = OYUN_EK[t.id]
  if (ana && oyunEk) {
    const eski = ana.gen
    ana.gen = karma(eski, eski, eski, oyunEk)
  }
  t.acts = [...t.acts.filter((a) => !a.oyun), ...yeni, ...t.acts.filter((a) => a.oyun)]
}
