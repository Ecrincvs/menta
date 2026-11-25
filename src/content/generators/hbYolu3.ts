/**
 * HAYAT BİLGİSİ YOLU — 3. sınıf Hayat Bilgisi ders kitabının 6 öğrenme alanı, her alan bir "ada":
 * konu konu sıralı etkinlikler + sonda oyunlar. Kaynak: docs/meb-kitaplar/analiz/hayat-bilgisi-3.md
 * İçerik kitabın öğrettiği bilgilerin özgün özetidir (kitap metni kopyalanmadı).
 * Hassas konular (§5): çocuktan gerçek kişisel bilgi istenmez (ad, adres, okul, kimlik, sokak krokisi),
 * 112 dışında hiçbir acil numara geçmez, afetler korkutmadan ve hazırlık odaklı anlatılır
 * (çök-kapan-tutun yalnızca "AFAD önerisi" diye; enkaz, alev alma, yıkım ayrıntısı yok), meslek ve ev
 * işlerinde cinsiyet kalıbı yok, çevrim içi güvenlik çocuk diliyle ("Hayır de, uzaklaş, büyüğüne anlat"),
 * savaş ayrıntısı yok, kesinliği şüpheli bilgi (yaklaşık yıllar, aşı listesi) soru cevabı yapılmaz, yıl verilmez.
 */
import type { SortQ } from '../../games/quiz/types'
import { ch, img, karma, mem, mt, ord, pop, rot, srt, tf, type Alan, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

const IYI = { id: 'iyi', label: 'Doğru davranış', img: 'thumbsup', color: '#22c55e' }
const KOTU = { id: 'kotu', label: 'Yanlış davranış', img: 'thumbsdown', color: '#ef4444' }

/* ================================================================================================
 * 1. ÖĞRENME ALANI · BEN VE OKULUM
 * ================================================================================================ */
/* --- HB.3.1.1 Güçlüyüm, Gelişiyorum --- */
const GUCLU_Q: Q[] = [
  { q: 'Güçlü alanımız hangisidir?', a: 'İlgi duyduğumuz ve iyi yaptığımız alan', w: ['Hiç sevmediğimiz alan', 'Sadece arkadaşımızın sevdiği alan', 'Hiç denemediğimiz alan'], ex: 'Merak ettiğimiz, ilgi duyduğumuz ve yetenekli olduğumuz alanlar güçlü alanlarımızdır.', img: 'biceps' },
  { q: 'Deniz şarkı söylemeyi seviyor ama bazı şarkılarda zorlanıyor. Bu onun için nedir?', a: 'Gelişime açık alan', w: ['Güçlü alan', 'Sevmediği alan', 'Yasak alan'], ex: 'Sevdiğimiz ama kendimizi henüz yeterli bulmadığımız alanlar gelişime açık alanlarımızdır.', img: 'music' },
  { q: 'Ece masa tenisini çok seviyor ve maçlarda başarılı. Bu onun için nedir?', a: 'Güçlü alan', w: ['Gelişime açık alan', 'Zorlandığı alan', 'İlgisiz alan'], ex: 'Hem seviyor hem başarılıysa bu, güçlü alanıdır.', img: 'ball' },
  { q: 'Karar vermeden önce ilk ne yaparız?', a: 'Bilgi toplarız', w: ['Hemen seçeriz', 'Yazı tura atarız', 'Hiç düşünmeyiz'], ex: 'Güçlü ve gelişime açık alanlarımızı belirlerken bilgi toplayarak işe başlarız.', img: 'magnifier' },
  { q: 'Kendimizi tanımak bize ne kazandırır?', a: 'Kendimize saygı ve güven', w: ['Daha çok oyuncak', 'Daha az arkadaş', 'Daha çok ödev'], ex: 'Güçlü ve gelişime açık alanlarımızı tanımak kendimize olan saygı ve güvenimizi artırır.', img: 'medal' },
  { q: 'Cemil belgesel ve deneyleri çok seviyor. Güçlü alanı hangisi?', a: 'Bilim', w: ['Spor', 'Halk oyunları', 'Tiyatro'], ex: 'Deney yapmak ve belgesel izlemek bilim alanına ilgidir.', img: 'microscope' },
  { q: 'Mehmet tiyatroda başarılı ama araştırmada zorlanıyor. Gelişime açık alanı hangisi?', a: 'Bilim ve araştırma', w: ['Tiyatro', 'Konuşmak', 'Oyun hazırlamak'], ex: 'Zorlandığı alan araştırmadır; çalışarak geliştirebilir.', img: 'theater' },
  { q: 'Gelişime açık alanımızda ne yapabiliriz?', a: 'Sabırla çalışır, destek alırız', w: ['Hemen vazgeçeriz', 'Kimseye söylemeyiz', 'Üzülüp bırakırız'], ex: 'Planlı ve sabırlı çalışır, öğretmenimizden ve ailemizden destek alırız.', img: 'teacher' },
]
const GUCLU_TF: TF[] = [
  ['Herkesin güçlü ve gelişime açık alanları olabilir.', true, 'Bilim, spor veya sanatta güçlü ve gelişime açık yönlerimiz olabilir.'],
  ['Gelişime açık alan, hiç başaramayacağımız alandır.', false, 'Gelişime açık alanda çalışarak kendimizi geliştirebiliriz.'],
  ['Kararımızı verdikten sonra gözden geçirebiliriz.', true, '“Bu alanı neden seçtim?” gibi sorularla kararımızı değerlendiririz.'],
  ['Bilgi toplarken rehber öğretmenimize soru sorabiliriz.', true, 'Aile, rehber öğretmen ve sınıf öğretmeni bize yardım eder.'],
  ['“Neyi iyi yapıyorum?” diye kendimize sorabiliriz.', true, 'Bu soru güçlü yönlerimizi bulmamıza yardım eder.'],
  ['Başarılı insanların hayat hikâyelerinden bir şey öğrenemeyiz.', false, 'Alanında başarılı insanların yaşam hikâyelerini araştırmak bize yol gösterir.'],
  ['Spor, sanat ve bilim her çocuk için bir ilgi alanı olabilir.', true, 'Her çocuk istediği alana ilgi duyabilir.'],
]
const ILGI_ITEMS: SortQ['items'] = [
  { label: 'Gökyüzünü incelemek', img: 'telescope', bin: 'bilim' },
  { label: 'Deney yapmak', img: 'testtube', bin: 'bilim' },
  { label: 'Canlıları araştırmak', img: 'microscope', bin: 'bilim' },
  { label: 'Robot tasarlamak', img: 'robot', bin: 'bilim' },
  { label: 'Tiyatro oynamak', img: 'theater', bin: 'sanat' },
  { label: 'Resim yapmak', img: 'palette', bin: 'sanat' },
  { label: 'Müzik yapmak', img: 'music', bin: 'sanat' },
  { label: 'Halk oyunları', img: 'artist', bin: 'sanat' },
  { label: 'Voleybol', img: 'ball', bin: 'spor' },
  { label: 'Yüzme', img: 'wave', bin: 'spor' },
  { label: 'Koşu yarışı', img: 'running', bin: 'spor' },
  { label: 'Halter', img: 'biceps', bin: 'spor' },
]
const ILGI_BINS: SortQ['bins'] = [
  { id: 'bilim', label: 'Bilim', img: 'microscope', color: '#3b82f6' },
  { id: 'sanat', label: 'Sanat', img: 'palette', color: '#ec4899' },
  { id: 'spor', label: 'Spor', img: 'ball', color: '#22c55e' },
]
const KARAR_O: O[] = [
  { q: 'Kulüp seçerken karar adımlarını sırala.', s: ['Amacını belirle', 'Bilgi topla', 'Seçenekleri yaz', 'Seçeneklerini düşün', 'Birini seç', 'Kararını gözden geçir'], ex: 'Önce amaç, sonra bilgi ve seçenekler. Seçtikten sonra kararımızı yeniden değerlendiririz.', img: 'thinking' },
  { q: 'Güçlü alanını bulmak için adımları sırala.', s: ['İlgi alanlarını düşün', 'Büyüklerine sor', 'Kitap ve belgesel incele', 'Güçlü alanına karar ver'], ex: 'Bilgi topladıktan sonra karar veririz.', img: 'magnifier' },
  { q: 'Gelişime açık alanda kendini geliştirmeyi sırala.', s: ['Zorlandığın yeri fark et', 'Hedef belirle', 'Sabırla çalış', 'İlerlemeni takip et'], ex: 'Planlı ve sabırlı çalışırsak gelişiriz.', img: 'medal' },
]
const BILGI_HIT = ['Ailem', 'Rehber öğretmen', 'Sınıf öğretmeni', 'Konunun uzmanı', 'Belgesel', 'Kitap ve dergi']
const BILGI_WRONG = ['Tanımadığım biri', 'Rastgele bir site', 'Dedikodu', 'Reklam yazısı']
const BILGI_IMG: Record<string, string> = { Ailem: 'house', 'Rehber öğretmen': 'teacher', 'Sınıf öğretmeni': 'school', 'Konunun uzmanı': 'scientist', Belgesel: 'television', 'Kitap ve dergi': 'books', 'Tanımadığım biri': 'noentry', 'Rastgele bir site': 'laptop', Dedikodu: 'shush', 'Reklam yazısı': 'newspaper' }
const ORNEK_P: P[] = [
  ['Naim Süleymanoğlu', 'Halter', 'medal', 'biceps'],
  ['İdil Biret', 'Piyano', 'star', 'music'],
  ['Aziz Sancar', 'Bilim', 'scientist', 'microscope'],
  ['Afife Jale', 'Tiyatro', 'star2', 'theater'],
  ['Mimar Sinan', 'Mimarlık', 'mosque', 'construction'],
  ['Neşet Ertaş', 'Halk müziği', 'guitar', 'music'],
]

/* --- HB.3.1.2 Hakkım da Var Sorumluluğum da --- */
const HAK_ITEMS: SortQ['items'] = [
  { label: 'Derslere katılmak', img: 'school', bin: 'hak' },
  { label: 'Teneffüste oynamak', img: 'ball', bin: 'hak' },
  { label: 'Görüşümü söylemek', img: 'raisedhand', bin: 'hak' },
  { label: 'Temiz bir sınıf', img: 'sparkles', bin: 'hak' },
  { label: 'Okulda güvende olmak', img: 'shield', bin: 'hak' },
  { label: 'Okula zamanında gelmek', img: 'clock', bin: 'sor' },
  { label: 'Çöpü çöp kutusuna atmak', img: 'wastebasket', bin: 'sor' },
  { label: 'Sıraları korumak', img: 'seat', bin: 'sor' },
  { label: 'Söz alarak konuşmak', img: 'shush', bin: 'sor' },
  { label: 'Kurallara uymak', img: 'checkered', bin: 'sor' },
]
const HAK_BINS: SortQ['bins'] = [
  { id: 'hak', label: 'Hakkım', img: 'star', color: '#3b82f6' },
  { id: 'sor', label: 'Sorumluluğum', img: 'handshake', color: '#f59e0b' },
]
const OKUL_HAK_P: P[] = [
  ['Yeni bilgiler öğrenmek', 'Eğitim hakkı', 'book'],
  ['Teneffüste oyun oynamak', 'Dinlenme ve oyun hakkı', 'ball'],
  ['Kural belirlerken oy vermek', 'Kendini ifade etme hakkı', 'raisedhand'],
  ['Temiz bir okul ortamı', 'Sağlık hakkı', 'soap'],
  ['Kazalara karşı önlem', 'Güvenlik hakkı', 'shield'],
  ['Okul girişindeki rampa', 'Erişilebilirlik hakkı', 'construction'],
]
const HAK_Q: Q[] = [
  { q: 'Sorumluluk ne demektir?', a: 'Yapmamız gereken işi yapıp sonucunu üstlenmek', w: ['Sadece istediğimizi yapmak', 'İşi başkasına bırakmak', 'Kuralları unutmak'], ex: 'Sorumluluk, yapmamız gereken işleri uygun şekilde yapmak ve sonuçlarını üstlenmektir.', img: 'handshake' },
  { q: 'Çöpümüzü çöp kutusuna atarsak neye saygı gösteririz?', a: 'Arkadaşlarımızın temiz ortam hakkına', w: ['Sadece kendi oyunumuza', 'Teneffüs süresine', 'Hiçbir şeye'], ex: 'Çevremiz temiz olur, arkadaşlarımız temiz bir ortamda eğitim alır.', img: 'wastebasket' },
  { q: 'Derste söz alarak konuşursak neye saygı gösteririz?', a: 'Arkadaşlarımızın dinleme hakkına', w: ['Kendi oyun hakkımıza', 'Teneffüs zilinin sesine', 'Hiçbir şeye'], ex: 'Söz alarak konuşunca herkes konuşabilir ve dersi dinleyebilir.', img: 'raisedhand' },
  { q: 'Işıl oynadıktan sonra oyuncaklarını topladı. Bu nedir?', a: 'Sorumluluğunu yerine getirmek', w: ['Oyun hakkını kaybetmek', 'Kuralı bozmak', 'İşi ertelemek'], ex: 'Oyun oynamak hakkımız, oyuncakları toplamak sorumluluğumuzdur.', img: 'teddy' },
  { q: 'Haklarımızı korumanın bir yolu nedir?', a: 'Sorumluluklarımızı yerine getirmek', w: ['Kuralları bozmak', 'Başkalarının hakkını almak', 'Hiçbir şey yapmamak'], ex: 'Sorumluluğumuzu yaparsak başkalarının haklarını da koruruz.', img: 'shield' },
  { q: 'Okul eşyalarını nasıl kullanırız?', a: 'Temiz ve dikkatli', w: ['Hızlı ve özensiz', 'Üstüne yazarak', 'İzinsiz götürerek'], ex: 'Masa, sıra ve araçları temiz ve dikkatli kullanmak sorumluluğumuzdur.', img: 'seat' },
]
const HAK_TF: TF[] = [
  ['Okulda kendini ifade etme hakkımız vardır.', true, 'Kuralları belirlerken görüşümüzü söyler, oy kullanırız.'],
  ['Teneffüste dinlenmek ve oynamak hakkımızdır.', true, 'Dinlenme ve oyun hakkı arkadaşlarımızla sosyalleşmemizi sağlar.'],
  ['Hakkımızı kullanırken başkasının hakkını düşünmeyiz.', false, 'Haklarımızı kullanırken başkalarının haklarına da saygı gösteririz.'],
  ['Bayrak töreninde kurallara uyarız.', true, 'Törende kurallara uymak sorumluluğumuzdur.'],
  ['Grup çalışmasında görevimizi arkadaşımıza bırakırız.', false, 'Grup çalışmasında kendi görevimizi yerine getiririz.'],
  ['Okul çalışanlarına saygı göstermek sorumluluğumuzdur.', true, 'Herkesle olumlu iletişim kurarız.'],
  ['Sırada beklemeden öne geçebiliriz.', false, 'Sırada uygun davranır, sıramızı bekleriz.'],
]
const AYSUN_Q: Q[] = [
  { q: 'Aysun okula geç kaldı ama özür diledi. Hangi sorumluluğu aksadı?', a: 'Okula zamanında gelmek', w: ['Temizliğe dikkat etmek', 'Eşyaları korumak', 'Oyun oynamak'], ex: 'Derse katılmak için okula zamanında geliriz.', img: 'clock' },
  { q: 'Aysun derste söz isteyip fikrini söyledi. Hangi hakkını kullandı?', a: 'Kendini ifade etme hakkı', w: ['Dinlenme hakkı', 'Sağlık hakkı', 'Erişilebilirlik hakkı'], ex: 'Düşüncemizi söylemek kendini ifade etme hakkıdır.', img: 'raisedhand' },
  { q: 'Aysun teneffüste sırayla oynama kuralına uymadı. Ne yapmalıydı?', a: 'Sırasını beklemeliydi', w: ['Oyunu bırakmalıydı', 'Arkadaşına kızmalıydı', 'Topu saklamalıydı'], ex: 'Oyunda da kurallara uyarız.', img: 'ball' },
  { q: 'Aysun sırayı bozan arkadaşını nazikçe uyardı. Bu nasıl bir davranış?', a: 'Doğru ve saygılı', w: ['Kaba ve yanlış', 'Kurala aykırı', 'Gereksiz'], ex: 'Uygun bir dille uyarmak başkalarının haklarını korur.', img: 'handshake' },
  { q: 'Hangi davranış eğitim hakkını en iyi kullanır?', a: 'Öğretmeni dikkatle dinlemek', w: ['Derste uyumak', 'Defteri unutmak', 'Arkadaşını rahatsız etmek'], ex: 'Derslere katılır, yeni bilgiler öğreniriz.', img: 'teacher' },
]

/* --- HB.3.1.3 Çocuğum, Haklarımla Varım --- */
const COCUK_Q: Q[] = [
  { q: 'Kaç yaşına kadar herkes çocuk sayılır?', a: '18 yaşına kadar', w: ['10 yaşına kadar', '12 yaşına kadar', '7 yaşına kadar'], ex: 'Çocuk Hakları Sözleşmesi’ne göre 18 yaşına kadar herkes çocuktur.', img: 'baby' },
  { q: 'Çocuk Hakları Sözleşmesi’ni kim hazırladı?', a: 'Birleşmiş Milletler', w: ['Bir okul kulübü', 'Bir oyun şirketi', 'Bir mahalle'], ex: 'Birleşmiş Milletler Genel Kurulu Çocuk Hakları Sözleşmesi’ni hazırlamıştır.', img: 'globe' },
  { q: '“Ayrımcılığa hayır” maddesi ne der?', a: 'Bütün çocukların hakları eşittir', w: ['Sadece bazı çocukların hakkı vardır', 'Büyük çocuklar daha önemlidir', 'Haklar zengin çocuklarındır'], ex: 'Kız, erkek, zengin, yoksul, özel gereksinimli olan ya da olmayan bütün çocuklar eşittir.', img: 'friends' },
  { q: 'Yetişkinler beni ilgilendiren konularda ne yapmalı?', a: 'Görüşlerimi dinlemeli', w: ['Hiç sormamalı', 'Beni susturmalı', 'Gülüp geçmeli'], ex: 'Çocukların görüşlerine saygı bir haktır.', img: 'ear' },
  { q: 'Hangisi bir çocuk hakkıdır?', a: 'Oyun oynamak', w: ['Hiç uyumamak', 'Hep şeker yemek', 'Okula hiç gitmemek'], ex: 'Dinlenme, oyun, kültür ve sanat etkinliklerine katılmak çocuk hakkıdır.', img: 'ball' },
  { q: 'İlköğretimde eğitim nasıldır?', a: 'Ücretsizdir', w: ['Çok pahalıdır', 'Sadece bazı çocuklar içindir', 'Zorunlu değildir'], ex: 'İlköğretimde ücretsiz eğitim alma hakkımız vardır.', img: 'school' },
  { q: 'Farkındalık projesi ne işe yarar?', a: 'İnsanları bir konuda bilgilendirir', w: ['Sadece oyun oynatır', 'Para kazandırır', 'Ödevi bitirir'], ex: 'Farkındalık projesi insanların bilgi sahibi olmasını ve duyarlı davranmasını sağlar.', img: 'bell' },
]
const COCUK_TF: TF[] = [
  ['Çocuk hakları doğduğumuz andan itibaren vardır.', true, 'İsim ve kimlik, yaşama, beslenme, okula gitme ve oyun birer haktır.'],
  ['Özel gereksinimli çocukların hakları daha azdır.', false, 'Bütün çocukların hakları eşittir; gerekirse ek destek sağlanır.'],
  ['Temiz suya ve sağlıklı besine ulaşmak çocuk hakkıdır.', true, 'Sağlık, su, gıda ve temiz çevre çocuk haklarındandır.'],
  ['Büyükler karar alırken çocuğun yararını düşünmelidir.', true, 'Buna “çocuğun en yüksek yararı” denir.'],
  ['Çocukların düşünceleri önemsizdir.', false, 'Yetişkinler çocukları dinlemeli, düşüncelerini ciddiye almalıdır.'],
  ['Her çocuğun güvenli bir evde yaşama hakkı vardır.', true, 'Yiyecek, giyecek ve güvenli bir ev çocuk haklarındandır.'],
]
const MADDE_P: P[] = [
  ['Çocuğun tanımı', '18 yaşına kadar çocuğum', 'baby'],
  ['Ayrımcılığa hayır', 'Bütün çocuklar eşittir', 'friends'],
  ['Yaşama ve gelişme', 'Yaşamak ve büyümek', 'seedling'],
  ['Görüşlere saygı', 'Düşüncem dinlenmeli', 'ear'],
  ['Eğitime erişim', 'Okula gidebilmeliyim', 'school'],
  ['Dinlenme ve oyun', 'Oynamaya hakkım var', 'ball'],
  ['Sağlık, su, gıda', 'Temiz su ve besin', 'droplet'],
]
const HAKB_HIT = ['Okula gitmek', 'Oyun oynamak', 'Sağlıklı beslenmek', 'İsim sahibi olmak', 'Dinlenmek', 'Güvende yaşamak', 'Fikrini söylemek']
const HAKB_WRONG = ['Hiç çalışmamak', 'Gece hiç uyumamak', 'Hep tablet oynamak', 'Kardeşini itmek', 'Sırayı bozmak']
const PROJE_O: O[] = [
  { q: 'Farkındalık projesi hazırlamayı sırala.', s: ['Projeye ad ver', 'Konuyu belirle', 'Amacını yaz', 'Hedef kitleyi seç', 'Süreyi planla', 'Yapılacakları yaz'], ex: 'Proje tanıtım metninde ad, konu, amaç, hedef kitle, süre ve yapılacaklar bulunur.', img: 'memo' },
  { q: 'Grupça proje çalışmasını sırala.', s: ['Fikirlerini söyle', 'Arkadaşlarını dinle', 'Uzlaşın', 'Görev paylaşın', 'Çalışmaları birleştirin', 'Projeyi sunun'], ex: 'Herkes fikrini özgürce söyler, uzlaşır ve görevleri paylaşırız.', img: 'friends' },
  { q: 'Projeyi tanıtmayı sırala.', s: ['Dikkat çekici isim bul', 'Afiş hazırla', 'Tanıtım metni yaz', 'Sınıfa sun'], ex: 'Projemizi görsel, afiş ve tanıtım metniyle destekleriz.', img: 'framed' },
]
const HANGI_HAK_Q: Q[] = [
  { q: 'Aslı’nın mahallesindeki parkın oyun araçları kırık. Hangi hak etkileniyor?', a: 'Dinlenme ve oyun hakkı', w: ['Eğitim hakkı', 'Sağlık hakkı', 'İsim hakkı'], ex: 'Oyun parkı çocukların oyun hakkı içindir. Bu konuda farkındalık projesi hazırlanabilir.', img: 'ball' },
  { q: 'Harun ile Salih başka şehre taşındı. Ne yapmalılar?', a: 'Oradaki okula kaydolup derslere devam etmeli', w: ['Okulu bırakmalı', 'Eylülü beklemeli', 'Sadece tarlada çalışmalı'], ex: 'Eğitim hakkı her yerde devam eder; gittikleri yerde okula kayıt yaptırmalılar.', img: 'school' },
  { q: 'Yeni doğan bebeğe isim verilmesi hangi haktır?', a: 'İsim ve kimlik hakkı', w: ['Oyun hakkı', 'Seçme hakkı', 'Dinlenme hakkı'], ex: 'Çocuklar doğduğu andan itibaren isim ve kimlik hakkına sahiptir.', img: 'baby' },
  { q: 'Çocuğun doktora gidip tedavi olması hangi haktır?', a: 'Sağlık hakkı', w: ['Oyun hakkı', 'Eğitim hakkı', 'İsim hakkı'], ex: 'Çocuk en iyi sağlık hizmetini almalıdır.', img: 'stethoscope' },
  { q: 'Sınıf kurallarında çocuklara fikir sorulması hangi haktır?', a: 'Görüşlere saygı', w: ['Sağlık hakkı', 'Dinlenme hakkı', 'Barınma hakkı'], ex: 'Bizi ilgilendiren konularda düşüncemizi özgürce söyleyebiliriz.', img: 'raisedhand' },
  { q: 'Okulda rampa ve asansör olması hangi haktır?', a: 'Erişilebilirlik hakkı', w: ['Oyun hakkı', 'İsim hakkı', 'Seçme hakkı'], ex: 'Okul, özel gereksinimli bireylerin ihtiyaçlarına uygun olmalıdır.', img: 'construction' },
]
const PROJE_TF: TF[] = [
  ['Grup çalışmasında herkes fikrini özgürce söyler.', true, 'Duygu ve düşüncelerimizi özgürce paylaşırız.'],
  ['Farklı düşünen arkadaşımızı dinlemeyiz.', false, 'Farklı düşünceler olduğunda konuşarak uzlaşırız.'],
  ['Görevimizi zamanında bitiririz.', true, 'Üzerimize düşen görevi zamanında yaparız.'],
  ['Projede bütün işi tek kişi yapmalıdır.', false, 'Görev paylaşımı yapar, iş birliğiyle çalışırız.'],
  ['Projeyi bitirince sınıfa sunarız.', true, 'Hazırladığımız projeyi arkadaşlarımıza tanıtırız.'],
  ['Projeye dikkat çekici bir isim veririz.', true, 'İyi bir isim projeyi akılda tutar.'],
]

/* ================================================================================================
 * 2. ÖĞRENME ALANI · SAĞLIĞIM VE GÜVENLİĞİM
 * ================================================================================================ */
/* --- HB.3.2.1 Sağlığımı Koruyorum --- */
const SAGLIK_Q: Q[] = [
  { q: 'Alper karda montsuz oynadı ve hastalandı. Ne yapmalıydı?', a: 'Mont, bere ve bot giymeliydi', w: ['Daha çok koşmalıydı', 'Şapkasını çıkarmalıydı', 'Dondurma yemeliydi'], ex: 'Hasta olmamak için mevsime uygun giyiniriz.', img: 'snowman' },
  { q: 'Ayşe geç yattığı için kahvaltı yapamıyor. Ne yapmalı?', a: 'Erken yatmalı', w: ['Kahvaltıyı hep atlamalı', 'Daha geç kalkmalı', 'Gece film izlemeli'], ex: 'Erken yatarsak erken kalkar, kahvaltıya vakit buluruz.', img: 'bed' },
  { q: 'Beren kantinden hep kek ve çikolata alıyor. Ne önerirsin?', a: 'Dengeli beslenmesini', w: ['Daha çok şeker yemesini', 'Öğle yemeğini atlamasını', 'Sadece makarna yemesini'], ex: 'Yeterli ve dengeli beslenmeye dikkat ederiz.', img: 'salad' },
  { q: 'Canan sıcak havada hırkasını hiç çıkarmıyor, terleyip hastalanıyor. Ne yapmalı?', a: 'Havaya uygun giyinmeli', w: ['Daha kalın giyinmeli', 'Teneffüste hiç oynamamalı', 'Su içmemeli'], ex: 'Hava durumuna uygun giyinmek hastalıklardan korur.', img: 'thermometer' },
  { q: 'Mete dişlerini haftada iki kez fırçalıyor. Ne olabilir?', a: 'Dişleri ağrıyabilir', w: ['Dişleri daha güçlü olur', 'Hiçbir şey olmaz', 'Dişleri parlar'], ex: 'Dişlerimizi her gün sabah ve akşam fırçalarız.', img: 'toothbrush' },
  { q: 'Canımız atıştırmalık isteyince ne yiyebiliriz?', a: 'Fındık, ceviz gibi kuru yemiş', w: ['Cips', 'Gazlı içecek', 'Çikolatalı gofret'], ex: 'Sağlıksız atıştırmalık yerine kuru yemiş seçebiliriz.', img: 'squirrel' },
  { q: 'Erken yatma alışkanlığını nasıl kazanırız?', a: 'Her gün biraz daha erken yatarak', w: ['Bir gün hiç uyumayarak', 'Gece ekran izleyerek', 'Sabah geç kalkarak'], ex: 'Her gün bir önceki günden 15 dakika erken yatmak iyi bir hedeftir.', img: 'clock' },
  { q: 'Sağlıklı yaşam yolunda ilk ne yaparız?', a: 'Davranışımızı değerlendiririz', w: ['Hemen ödül alırız', 'Hiçbir şeyi değiştirmeyiz', 'Doktora kızarız'], ex: 'Önce davranışımız sağlığımız için uygun mu diye bakarız.', img: 'magnifier' },
]
const KORUR_ITEMS: SortQ['items'] = [
  { label: 'Erken yatmak', img: 'bed', bin: 'iyi' },
  { label: 'Sabah akşam diş fırçalamak', img: 'toothbrush', bin: 'iyi' },
  { label: 'Yemekten önce el yıkamak', img: 'soap', bin: 'iyi' },
  { label: 'Mevsime uygun giyinmek', img: 'tshirt', bin: 'iyi' },
  { label: 'Hareketli oyunlar oynamak', img: 'running', bin: 'iyi' },
  { label: 'Sebze ve meyve yemek', img: 'salad', bin: 'iyi' },
  { label: 'Gece geç saate kadar TV', img: 'television', bin: 'kotu' },
  { label: 'Kahvaltıyı atlamak', img: 'forkplate', bin: 'kotu' },
  { label: 'Yemekten sonra cips', img: 'fries', bin: 'kotu' },
  { label: 'Karda montsuz oynamak', img: 'snowflake', bin: 'kotu' },
  { label: 'Diş ağrısını beklemek', img: 'tooth', bin: 'kotu' },
]
const SAGLIK_O: O[] = [
  { q: 'Sağlıklı yaşam yol haritasını sırala.', s: ['Davranışını değerlendir', 'Nedenini bul', 'Hedef belirle', 'Plan yap ve uygula', 'İlerlemeni takip et', 'Yeni alışkanlığını sürdür'], ex: 'Sağlıksız bir davranışı adım adım değiştiririz.', img: 'map' },
  { q: 'Erken yatma hedefini sırala.', s: ['Geç yattığını fark et', 'Yatma saati hedefi koy', 'Her gün biraz erken yat', 'Başarınca kendini tebrik et'], ex: 'Küçük adımlarla yeni alışkanlık kazanırız.', img: 'bed' },
  { q: 'Araştırma raporu hazırlamayı sırala.', s: ['Konunu seç', 'Sorularını yaz', 'Güvenilir kaynaktan bilgi topla', 'Cevapları yaz', 'Sonucu paylaş'], ex: 'Sağlık konusunda güvenilir kaynaklardan bilgi toplarız.', img: 'memo' },
]
const GUNLUK_HIT = ['Yeterince uyudum', 'Erken yattım', 'Dişimi fırçaladım', 'Elimi yıkadım', 'Uygun giyindim', 'Hareketli oynadım', 'Meyve yedim']
const GUNLUK_WRONG = ['Gece geç yattım', 'Kahvaltıyı atladım', 'Hep cips yedim', 'Dişimi unuttum', 'Bütün gün oturdum']
const GUNLUK_IMG: Record<string, string> = { 'Yeterince uyudum': 'sleepy', 'Erken yattım': 'bed', 'Dişimi fırçaladım': 'toothbrush', 'Elimi yıkadım': 'soap', 'Uygun giyindim': 'tshirt', 'Hareketli oynadım': 'running', 'Meyve yedim': 'apple', 'Gece geç yattım': 'moon', 'Kahvaltıyı atladım': 'forkplate', 'Hep cips yedim': 'fries', 'Dişimi unuttum': 'tooth', 'Bütün gün oturdum': 'seat' }
const SAGLIK_TF: TF[] = [
  ['Acelemiz varsa kahvaltı yapmadan okula gideriz.', false, 'Kahvaltı güne enerjiyle başlamamızı sağlar.'],
  ['Erken yatıp erken kalkarak uyku düzenimizi koruruz.', true, 'Düzenli uyku sağlıklı büyümemizi sağlar.'],
  ['Her mevsim kalın giyinirsek hastalıklardan korunuruz.', false, 'Hava durumuna uygun giyiniriz.'],
  ['Yeterli ve dengeli beslenmeye dikkat ederiz.', true, 'Dengeli beslenmek sağlığımızı korur.'],
  ['Diş ağrısının kendiliğinden geçmesini bekleriz.', false, 'Dişimiz ağrırsa büyüklerimize söyler, diş hekimine gideriz.'],
  ['Kişisel temizliğimize dikkat ederiz.', true, 'El yıkamak ve banyo yapmak mikroplardan korur.'],
  ['Sağlıklı bir hedefe ulaşmak için ailemizden destek alabiliriz.', true, 'Aile, öğretmen ve uzmanlardan destek alırız.'],
]

/* --- HB.3.2.2 Güvenliğimizi Tehdit Eden Durumlar --- */
const GUVENLI_ITEMS: SortQ['items'] = [
  { label: 'Ailemle parkta oynamak', img: 'housegarden', bin: 'guvenli' },
  { label: 'Öğretmenimle konuşmak', img: 'teacher', bin: 'guvenli' },
  { label: 'İzinle internete girmek', img: 'laptop', bin: 'guvenli' },
  { label: 'Kaybolunca görevliye sormak', img: 'policeofficer', bin: 'guvenli' },
  { label: 'Ailemin kurallarına uymak', img: 'house', bin: 'guvenli' },
  { label: 'Yabancı arabasına çağırıyor', img: 'car', bin: 'guvensiz' },
  { label: 'Biri adresimi istiyor', img: 'lock', bin: 'guvensiz' },
  { label: 'İzinsiz fotoğraf çekiliyor', img: 'camera', bin: 'guvensiz' },
  { label: 'Biri ısrarla ikram ediyor', img: 'candy', bin: 'guvensiz' },
  { label: 'Biri topumu zorla istiyor', img: 'ball', bin: 'guvensiz' },
]
const GUVENLI_BINS: SortQ['bins'] = [
  { id: 'guvenli', label: 'Güvendeyim', img: 'shield', color: '#22c55e' },
  { id: 'guvensiz', label: 'Güvende değilim', img: 'noentry', color: '#ef4444' },
]
const GUVEN_Q: Q[] = [
  { q: 'Okul çıkışında tanımadığın biri “Seni ailen gönderdi” dedi. Ne yaparsın?', a: '“Hayır” der, öğretmenime haber veririm', w: ['Onunla giderim', 'Adresimi söylerim', 'Kimseye söylemem'], ex: 'Kararlı bir “Hayır!” deriz ve güvendiğimiz bir büyüğe haber veririz.', img: 'school' },
  { q: 'Evde yalnızken kapı çaldı. Ne yaparsın?', a: 'Kapıyı açmam, büyüğüme haber veririm', w: ['Hemen açarım', 'Kim olduğunu sormadan açarım', 'Pencereden adresimi söylerim'], ex: 'Evde tek başımayken kapıyı açmayız.', img: 'house' },
  { q: 'Cihan’ın ekranına “Hediyen için adresini gönder” yazısı çıktı. Ne yapmalı?', a: 'Hiçbir şey yazmadan büyüğüne göstermeli', w: ['Adresini yazmalı', 'Arkadaşının adresini yazmalı', 'Telefon numarasını yazmalı'], ex: 'Kişisel bilgilerimizi paylaşmaz, büyüğümüze söyleriz.', img: 'laptop' },
  { q: 'Oyunda biri “Senin yaşındayım, numaranı ver” dedi. Ne yaparsın?', a: 'Vermem, ailemle konuşurum', w: ['Hemen veririm', 'Adresimi de veririm', 'Gizlice konuşurum'], ex: 'Tanımadığımız kişilerle iletişim kurmayız. Karşımızdaki kişinin bilgileri gerçek olmayabilir.', img: 'videogame' },
  { q: 'Bir arkadaşın topunu zorla istiyor ve seni dışlıyor. Ne yaparsın?', a: 'Güvendiğim bir büyüğe anlatırım', w: ['Kimseye söylemem', 'Topumu hep ona veririm', 'Ben de onu dışlarım'], ex: 'Bizi rahatsız eden durumları öğretmenimize ve ailemize anlatırız.', img: 'ball' },
  { q: 'Kalabalık bir yerde kayboldun. Kimden yardım istersin?', a: 'Güvenlik görevlisinden', w: ['İlk gördüğüm yabancıdan', 'Hiç kimseden', 'Bir çocuktan'], ex: 'Kaybolunca güvendiğimiz kişilerden veya güvenlik görevlilerinden yardım isteriz.', img: 'policeofficer' },
  { q: 'Hande arkadaşının defterini izinsiz aldı. Ne yapmalıydı?', a: 'İzin istemeliydi', w: ['Defteri saklamalıydı', 'Yazı yazmalıydı', 'Hiçbir şey yapmamalıydı'], ex: 'Başkasının eşyasını izin alarak kullanırız.', img: 'notebook' },
]
const YUZ_ITEMS: SortQ['items'] = [
  { label: 'Yolda biri takip ediyor', img: 'walking', bin: 'yuz' },
  { label: 'Arabaya çağırıyor', img: 'car', bin: 'yuz' },
  { label: 'Parkta çok yakın duruyor', img: 'housegarden', bin: 'yuz' },
  { label: 'Eve reklam için gelmek', img: 'house', bin: 'yuz' },
  { label: 'Oyunda numara istiyor', img: 'videogame', bin: 'cevrim' },
  { label: 'Fotoğrafımı paylaştı', img: 'camera', bin: 'cevrim' },
  { label: 'Mesajla alay ediyor', img: 'phone', bin: 'cevrim' },
  { label: 'Yaş sınırını aşan site', img: 'laptop', bin: 'cevrim' },
  { label: 'Bilgisi gerçek dışı kişi', img: 'mask', bin: 'cevrim' },
]
const YUZ_BINS: SortQ['bins'] = [
  { id: 'yuz', label: 'Yüz yüze', img: 'eyes', color: '#f59e0b' },
  { id: 'cevrim', label: 'Çevrim içi', img: 'laptop', color: '#3b82f6' },
]
const HAYIR_O: O[] = [
  { q: 'Yüz yüze tehlikede ne yaparız? Sırala.', s: ['Kararlı bir “Hayır!” de', 'Yüksek sesle yardım iste', 'Oradan hemen uzaklaş', 'Güvendiğin büyüğe anlat'], ex: 'Hayır der, yardım ister, uzaklaşır ve büyüğümüze anlatırız.', img: 'shield' },
  { q: 'Çevrim içi rahatsız olunca ne yaparız? Sırala.', s: ['Hiçbir bilgi yazma', 'Ekranı kapat', 'Büyüğüne göster', 'Birlikte engelleyin'], ex: 'Kişisel bilgimizi paylaşmaz, güvendiğimiz yetişkinden yardım isteriz.', img: 'laptop' },
  { q: 'İnternete güvenle girmeyi sırala.', s: ['Büyüğünden izin al', 'Ailenin kurallarına uy', 'Bilgilerini paylaşma', 'Neler gördüğünü anlat'], ex: 'Genel ağa girmeden önce izin alır, gezdiğimiz yerleri anlatırız.', img: 'lock' },
]
const AFIS_TF: TF[] = [
  ['Genel ağa girmeden önce bir büyüğümüzden izin alırız.', true, 'Ailemizin belirlediği kurallara uyarız.'],
  ['Fotoğraflarımızı tanımadığımız kişilere göndeririz.', false, 'Kişisel bilgilerimizi ve fotoğraflarımızı paylaşmayız.'],
  ['Bedenim bana aittir, istemediğimde “Hayır” diyebilirim.', true, 'İstemediğimiz temasa “Hayır” deriz.'],
  ['Bizi rahatsız eden sırları saklamamız gerekir.', false, 'Rahatsız eden sır ve şakaları güvendiğimiz yetişkine anlatırız.'],
  ['Annemize, babamıza her şeyi anlatabiliriz.', true, 'Ailemiz bize inanır ve yardım eder.'],
  ['Hangi sitelerde gezdiğimizi ailemize anlatırız.', true, 'Ailemiz güvenli kullanmamıza yardım eder.'],
  ['Yaş sınırı uyarısını görmezden geliriz.', false, 'Çevrim içi ortamlarda yaş sınırı uyarılarına uyarız.'],
]
const YARDIM_HIT = ['Annem', 'Babam', 'Öğretmenim', 'Rehber öğretmen', 'Okul müdürü', 'Polis', 'Güvenlik görevlisi']
const YARDIM_WRONG = ['Tanımadığım kişi', 'Oyundaki yabancı', 'Mesajdaki kişi', 'Hiç kimse']

/* --- HB.3.2.3 Trafik Kurallarının Önemi --- */
const TRAFIK_Q: Q[] = [
  { q: 'Yaya geçidi yoksa karşıya nasıl geçeriz?', a: 'Sola, sağa, sonra tekrar sola bakarak', w: ['Koşarak ve bakmadan', 'Sadece sağa bakarak', 'Arabaların arasından'], ex: 'Önce sola, sonra sağa, sonra tekrar sola bakar, dikkatle geçeriz.', img: 'crossing' },
  { q: 'Kaldırım olmayan yolda nereden yürürüz?', a: 'Yolun sol tarafından', w: ['Yolun ortasından', 'Yolun sağ tarafından', 'Arabaların arkasından'], ex: 'Trafiği karşıdan görecek şekilde yolun solundan yürürüz.', img: 'walking' },
  { q: 'Çocuklar arabada nerede oturur?', a: 'Arka koltukta', w: ['Ön koltukta', 'Sürücünün kucağında', 'Bagajda'], ex: 'Çocuklar her zaman arka koltukta, emniyet kemeriyle oturur.', img: 'car' },
  { q: 'Yolda yürürken neden kulaklıkla müzik dinlemeyiz?', a: 'Uyarı seslerini duyabilmek için', w: ['Müzik sıkıcı olduğu için', 'Kulaklık ağır olduğu için', 'Pil bitmesin diye'], ex: 'Dikkatimiz dağılmasın ve çevreden gelen uyarıları duyalım diye.', img: 'headphone' },
  { q: 'Sürücüler yayalara nasıl davranmalı?', a: 'Yayalara öncelik vermeli', w: ['Kornaya basıp geçmeli', 'Hızlanmalı', 'Hiç durmamalı'], ex: 'Sürücüler yaya ve bisikletlilere öncelik verir.', img: 'trafficlight' },
  { q: 'Trafik kurallarına neden uyarız?', a: 'Herkes güvende olsun diye', w: ['Ceza almamak için sadece', 'Yollar boş kalsın diye', 'Arabalar hızlı gitsin diye'], ex: 'Trafik kuralları can ve mal kaybını önler, herkesi korur.', img: 'shield' },
  { q: 'Karşıya geçmek için hangisi güvenlidir?', a: 'Üst geçit', w: ['Arabaların arası', 'Viraj', 'Park etmiş aracın önü'], ex: 'Alt geçit, üst geçit ve yaya geçidi güvenli geçiş yerleridir.', img: 'construction' },
]
const TRAFIK_TF: TF[] = [
  ['Trafik kuralları herkes için geçerlidir.', true, 'Yayalar da sürücüler de kurallara uyar.'],
  ['Arabaya binince emniyet kemerini takarız.', true, 'Emniyet kemeri bizi korur.'],
  ['Yolda yürürken telefonla oyun oynarız.', false, 'Yolda dikkatimizi dağıtan şeylerle meşgul olmayız.'],
  ['Sürücüler hız sınırına uymalıdır.', true, 'Hız sınırı ani durumlara hazırlıklı olmayı sağlar.'],
  ['Kırmızı ışıkta yayalar karşıya geçer.', false, 'Yayalar yeşil yaya ışığında geçer; kırmızıda bekleriz.'],
  ['Trafik levhaları kuralları ve tehlikeleri gösterir.', true, 'Levhalara dikkat ederiz.'],
  ['Yedi yaşındaki bir çocuk ön koltukta oturabilir.', false, 'Çocuklar her zaman arka koltukta oturur.'],
]
const YAYA_ITEMS: SortQ['items'] = [
  { label: 'Kaldırımda yürümek', img: 'walking', bin: 'yaya' },
  { label: 'Yaya geçidini kullanmak', img: 'crossing', bin: 'yaya' },
  { label: 'Sola sağa bakmak', img: 'eyes', bin: 'yaya' },
  { label: 'Arka koltukta oturmak', img: 'seat', bin: 'yaya' },
  { label: 'Hız sınırına uymak', img: 'stopwatch', bin: 'surucu' },
  { label: 'Yayaya yol vermek', img: 'handshake', bin: 'surucu' },
  { label: 'Telefonla konuşmamak', img: 'phone', bin: 'surucu' },
  { label: 'Kırmızıda durmak', img: 'trafficlight', bin: 'surucu' },
]
const YAYA_BINS: SortQ['bins'] = [
  { id: 'yaya', label: 'Yaya ve yolcu', img: 'walking', color: '#3b82f6' },
  { id: 'surucu', label: 'Sürücü', img: 'car', color: '#f59e0b' },
]
const GECIS_O: O[] = [
  { q: 'Geçit olmayan yerde karşıya geçmeyi sırala.', s: ['Kaldırımın kenarında dur', 'Sola bak', 'Sağa bak', 'Tekrar sola bak', 'Dikkatle karşıya geç'], ex: 'Sola, sağa, tekrar sola bakar; yol boşsa geçeriz.', img: 'crossing' },
  { q: 'Arabayla yolculuğa hazırlanmayı sırala.', s: ['Arka koltuğa otur', 'Emniyet kemerini tak', 'Sürücünün dikkatini dağıtma', 'Araç durunca kaldırım tarafından in'], ex: 'Güvenli yolculuk kemerle başlar.', img: 'car' },
  { q: 'Trafik afişi hazırlamayı sırala.', s: ['Konu hakkında bilgi edin', 'Etkileyici bir slogan bul', 'Kısa cümleler yaz', 'Görsel ekle', 'Sınıfta sergile'], ex: '“Trafik kurallarına uyalım, uymayanları uyaralım!” gibi sloganlar dikkat çeker.', img: 'framed' },
]
const DURUM_P: P[] = [
  ['Nalan yola birden çıktı', 'Yaya geçidini kullanmalı', 'crossing'],
  ['Aykut yolun sağından yürüyor', 'Yolun solundan yürümeli', 'walking'],
  ['Melis ön koltukta oturmak istiyor', 'Arka koltukta oturmalı', 'seat'],
  ['Ali yolda kulaklık takıyor', 'Çevresini dinlemeli', 'headphone'],
  ['Ece kemerini takmadı', 'Kemerini takmalı', 'car'],
  ['Efe kırmızıda geçmek istiyor', 'Yeşil yanana kadar beklemeli', 'trafficlight'],
]

/* ================================================================================================
 * 3. ÖĞRENME ALANI · AİLEM VE TOPLUM
 * ================================================================================================ */
/* --- HB.3.3.1 Aile ve Toplum --- */
const AILE_ITEMS: SortQ['items'] = [
  { label: 'Ev işlerini paylaşmak', img: 'broom', bin: 'aile' },
  { label: 'Birlikte kahvaltı yapmak', img: 'forkplate', bin: 'aile' },
  { label: 'Ablanın derse yardımı', img: 'book', bin: 'aile' },
  { label: 'Sorunları birlikte çözmek', img: 'hug', bin: 'aile' },
  { label: 'Herkesin uyduğu kurallar', img: 'checkered', bin: 'toplum' },
  { label: 'Bayramda büyükleri ziyaret', img: 'gift', bin: 'toplum' },
  { label: 'Farklı meslekler', img: 'construction', bin: 'toplum' },
  { label: 'Komşuluk ilişkileri', img: 'houses', bin: 'toplum' },
  { label: 'Aynı yerde yaşayan insanlar', img: 'cityscape', bin: 'toplum' },
]
const AILE_BINS: SortQ['bins'] = [
  { id: 'aile', label: 'Ailede', img: 'house', color: '#f59e0b' },
  { id: 'toplum', label: 'Toplumda', img: 'cityscape', color: '#3b82f6' },
]
const AILE_Q: Q[] = [
  { q: 'Toplumun en küçük birimi hangisidir?', a: 'Aile', w: ['Mahalle', 'Şehir', 'Okul'], ex: 'Aile toplumun en küçük birimidir.', img: 'house' },
  { q: 'Toplum nedir?', a: 'Aynı yerde yaşayan, kurallara uyan, yardımlaşan insanlar', w: ['Sadece bir ailenin üyeleri', 'Tek başına yaşayan biri', 'Bir oyun takımı'], ex: 'Toplum; iletişim kuran, ortak kurallara uyan ve yardımlaşan insanlardan oluşur.', img: 'cityscape' },
  { q: 'Anayasamız aile için ne der?', a: 'Aile, Türk toplumunun temelidir', w: ['Aile önemsizdir', 'Aile sadece evdedir', 'Aile sadece çocuklardır'], ex: 'Anayasamızın 41. maddesi bunu söyler.', img: 'scroll' },
  { q: 'Vergimizi zamanında verirsek ne olur?', a: 'Devlet okul, hastane ve yol yapar', w: ['Oyuncak alırız', 'Hiçbir şey değişmez', 'Yollar kapanır'], ex: 'Vergilerle devlet okul, hastane, yol ve park yapar.', img: 'banknote' },
  { q: 'Aile israftan nasıl kaçınır?', a: 'Suyu ve elektriği gerektiği kadar kullanır', w: ['Işıkları hep açık bırakır', 'Yemeği çöpe atar', 'Gereksiz alışveriş yapar'], ex: 'İsraftan kaçınan aile hem bütçesini hem ülke ekonomisini korur.', img: 'bulb' },
  { q: 'Trafik kurallarını kim belirler ve denetler?', a: 'Devlet', w: ['Sadece çocuklar', 'Komşular', 'Bir oyun kulübü'], ex: 'Aileden bilgi alır, okulda eğitim görürüz; devlet kuralları belirler ve denetler.', img: 'trafficlight' },
  { q: 'Bayramda büyükleri ziyaret etmek neyimizdir?', a: 'Ortak değerimiz', w: ['Bir trafik kuralı', 'Bir meslek', 'Bir yasak'], ex: 'Akrabalık, komşuluk ve bayram ziyaretleri toplumumuzun ortak değerleridir.', img: 'gift' },
]
const AILE_P: P[] = [
  ['Vergiyi zamanında vermek', 'Okul ve hastane yapılır', 'banknote'],
  ['Suyu tasarruflu kullanmak', 'Kaynaklar boşa gitmez', 'droplet'],
  ['İhtiyaç kadar alışveriş', 'Aile bütçesi korunur', 'cart'],
  ['Komşuya yardım etmek', 'Toplumsal bağ güçlenir', 'handshake'],
  ['Kurallara uymak', 'Toplumda düzen olur', 'checkered'],
  ['Fidan dikme etkinliği', 'Mahalle yeşillenir', 'seedling'],
]
const KOSE_TF: TF[] = [
  ['Aile, toplumun en önemli yapı taşıdır.', true, 'Güçlü aileler güçlü toplumu oluşturur.'],
  ['Toplumdaki değişimler aile yaşamını etkilemez.', false, 'Toplumdaki değişimler aile yaşamını da etkiler.'],
  ['Ailede öğrendiğimiz değerler toplumda da işe yarar.', true, 'Sevgi, saygı ve yardımlaşma her yerde değerlidir.'],
  ['Aile üyeleri birbirine destek olur.', true, 'Ev işlerini paylaşır, birbirimize yardım ederiz.'],
  ['Toplumda herkesin yeteneği aynıdır.', false, 'İnsanların ilgi ve yetenekleri farklıdır; bu sayede farklı meslekler vardır.'],
  ['Toplum kuralları aile yaşamını etkiler.', true, 'Ailece toplumsal kurallara uyarsak düzen sağlanır.'],
  ['Aile üyeleri sorunları birlikte çözer.', true, 'İletişim içinde olan aile sorunları birlikte çözer.'],
]
const ETKINLIK_HIT = ['Resim sergisi', 'Çocuk tiyatrosu', 'Sinema', 'Fidan dikme', 'Konser', 'Kütüphane gezisi', 'Mahalle şenliği']
const ETKINLIK_WRONG = ['Odada tek başına', 'Tüm gün tablet', 'Kapıyı kilitlemek', 'Hiç konuşmamak']
const ETKINLIK_IMG: Record<string, string> = { 'Resim sergisi': 'framed', 'Çocuk tiyatrosu': 'theater', Sinema: 'camera', 'Fidan dikme': 'seedling', Konser: 'music', 'Kütüphane gezisi': 'books', 'Mahalle şenliği': 'balloon', 'Tüm gün tablet': 'videogame' }

/* --- HB.3.3.2 Yardımlaşma --- */
const IHTIYAC_HIT = ['Yaşlı komşumuz', 'Hasta bir arkadaş', 'Afet yaşamış aile', 'Görme yetersizliği', 'Özel gereksinimli', 'Ağır çanta taşıyan']
const IHTIYAC_WRONG = ['Uyuyan kedi', 'Boş sandalye', 'Yeni oyuncak', 'Parlak güneş']
const YARDIM_P: P[] = [
  ['Görme yetersizliği olan biri', 'Kitap okuyabilirim', 'glasses'],
  ['Otobüsteki yaşlı biri', 'Yerimi verebilirim', 'bus'],
  ['Ağır poşet taşıyan komşu', 'Poşeti taşıyabilirim', 'cart'],
  ['Rampası olmayan bina', 'Rampa önerisi yazabilirim', 'construction'],
  ['Hasta bir arkadaş', 'Ödevini getirebilirim', 'notebook'],
  ['Afet yaşamış aileler', 'Yardım toplayabiliriz', 'package'],
]
const YPROJE_O: O[] = [
  { q: 'Yardım projesi geliştirmeyi sırala.', s: ['Çevreni gözlemle', 'İhtiyacı belirle', 'Ekibini kur', 'Amaç ve hedef kitleyi seç', 'Projeye isim ver', 'İş bölümü yap', 'Değerlendir, rapor yaz'], ex: 'İyi bir gözlemci olarak başlar, her adımı ekipçe değerlendiririz.', img: 'memo' },
  { q: 'Sesli kütüphane projesini sırala.', s: ['Kitapları seç', 'Görev paylaş', 'Kitapları sesli oku', 'Kayıtları topla', 'Kütüphaneyi tanıt'], ex: 'Sesli kütüphane, görme yetersizliği olanların kitaplara ulaşmasını sağlar.', img: 'microphone' },
  { q: 'Yardım kutusu etkinliğini sırala.', s: ['Yardım fikrini karta yaz', 'Kartı kutuya at', 'Kutudan bir kart çek', 'Fikri canlandır'], ex: 'Yardım fikirlerini canlandırarak empati kurarız.', img: 'gift' },
]
const YARDIM_Q: Q[] = [
  { q: '“Bir elin nesi var, iki elin sesi var.” ne anlatır?', a: 'Birlikte çalışmak işi kolaylaştırır', w: ['Ellerimiz çok ses çıkarır', 'Tek başına çalışmak daha iyidir', 'Alkışlamak önemlidir'], ex: 'Yardımlaşınca işler daha kolay ve hızlı biter.', img: 'clap' },
  { q: 'Balonları sahiplerine verince oyun nasıl bitti?', a: 'Daha kısa sürede', w: ['Daha uzun sürede', 'Hiç bitmedi', 'Balonlar patladı'], ex: 'Herkes birbirine yardım edince iş çabuk biter.', img: 'balloon' },
  { q: 'Yardım projeleri hangi değerlerimizi geliştirir?', a: 'Sevgi, saygı, şefkat ve sabır', w: ['Kıskançlık ve öfke', 'Acele ve dağınıklık', 'Hiçbir değeri'], ex: 'Projeler değerlerimizi geliştirir, empati kurmayı öğretir.', img: 'heart' },
  { q: 'Yardım projesine başlarken ilk ne yaparız?', a: 'Çevremizi gözlemleriz', w: ['Projeyi bitiririz', 'Rapor yazarız', 'Ödül isteriz'], ex: 'Önce iyi bir gözlemci olur, ihtiyaçları fark ederiz.', img: 'magnifier' },
  { q: 'Hangisi yaşlılara hizmet veren bir devlet kurumudur?', a: 'Huzurevi', w: ['Sinema', 'Oyun parkı', 'Market'], ex: 'Hastane ve huzurevi gibi kurumlar yardıma ihtiyacı olanlara destek verir.', img: 'oldwoman' },
  { q: '3-C sınıfı gezide rampası olmayan yeri görünce ne yaptı?', a: 'Erişilebilirlik projesi hazırladı', w: ['Hiçbir şey yapmadı', 'Geziyi bıraktı', 'Arkadaşını bekletti'], ex: 'Engelsiz ve erişilebilir bir yaşam için farkındalık projesi hazırladılar.', img: 'construction' },
]
const YARDIM_TF: TF[] = [
  ['Yardım istemek pes etmek demektir.', false, 'Yardım istemek pes etmek değildir, pes etmeyi reddetmektir.'],
  ['Hepimiz yardıma ihtiyacı olanlar için bir şey yapabiliriz.', true, 'Bireysel ve grup çalışmalarıyla destek olabiliriz.'],
  ['Yardım ederken kendimizi karşımızdakinin yerine koyarız.', true, 'Empati, onu daha iyi anlamamızı sağlar.'],
  ['Projede görevimizi zamanında yaparız.', true, 'Üzerimize düşen görevi belirlenen sürede tamamlarız.'],
  ['Yardım derneklerinin hiçbir görevi yoktur.', false, 'Yardım dernekleri ihtiyacı olanlara destek verir.'],
  ['Yardımlaşma sosyal bağlarımızı güçlendirir.', true, 'İletişimimiz artar, sorumluluk bilincimiz gelişir.'],
]

/* --- HB.3.3.3 Meslekler --- */
const BILMECE_Q: Q[] = [
  { q: 'Hastalığı teşhis eder, tedavi ederim. Ben kimim?', a: 'Doktor', w: ['Pilot', 'Çiftçi', 'Aşçı'], ex: 'Doktor hastalıkları teşhis ve tedavi eder, korunmayı öğretir.', img: 'doctor' },
  { q: 'Siren çalar, yangına koşarım. Ben kimim?', a: 'İtfaiyeci', w: ['Öğretmen', 'Postacı', 'Bahçıvan'], ex: 'İtfaiyeci yangını söndürür, insanları kurtarır.', img: 'firetruck' },
  { q: 'Bilgi ve beceri öğretirim, sınıf ikinci evimdir. Ben kimim?', a: 'Öğretmen', w: ['Doktor', 'Pilot', 'Mühendis'], ex: 'Öğretmen bilgi ve beceri kazandırır, gelişime rehberlik eder.', img: 'teacher' },
  { q: 'Uçağımla gökyüzünde gezerim. Ben kimim?', a: 'Pilot', w: ['Çiftçi', 'Aşçı', 'Hemşire'], ex: 'Pilot güvenli ve hızlı ulaşım sağlar.', img: 'airplane' },
  { q: 'Sağlıklı dişler için bana gelin. Ben kimim?', a: 'Diş hekimi', w: ['İtfaiyeci', 'Bahçıvan', 'Postacı'], ex: 'Diş hekimi dişlerimizi korur; kontrolleri ihmal etmeyiz.', img: 'tooth' },
  { q: 'Düdüğüm var, güvenliği sağlarım. Ben kimim?', a: 'Polis', w: ['Aşçı', 'Pilot', 'Öğretmen'], ex: 'Polis vatandaşların güvenliğini sağlar.', img: 'policeofficer' },
  { q: 'Toprakta sebze ve meyve yetiştiririm. Ben kimim?', a: 'Çiftçi', w: ['Mühendis', 'Doktor', 'Polis'], ex: 'Çiftçi yiyeceklerimizi üretir.', img: 'farmer' },
  { q: 'Yol, köprü ve bina yaparım; hesaplar, planlarım. Ben kimim?', a: 'Mühendis', w: ['Hemşire', 'Aşçı', 'Pilot'], ex: 'Mühendis güvenli ve sağlam yapılar planlar.', img: 'construction' },
]
const MESLEK_P: P[] = [
  ['Hemşire', 'Hastaların ateşini takip eder', 'stethoscope'],
  ['İtfaiyeci', 'Yangın söndürür', 'firefighter'],
  ['Öğretmen', 'Bilgi ve beceri kazandırır', 'teacher'],
  ['Çiftçi', 'Yiyecek üretir', 'farmer'],
  ['Postacı', 'Mektup ve paket getirir', 'package'],
  ['Aşçı', 'Yemek pişirir', 'cook'],
  ['Pilot', 'Uçak kullanır', 'airplane'],
]
const DEVIR_ITEMS: SortQ['items'] = [
  { label: 'Nalbant', img: 'horse', bin: 'eski' },
  { label: 'Semerci', img: 'horse', bin: 'eski' },
  { label: 'Yorgancı', img: 'bed', bin: 'eski' },
  { label: 'Doktor', img: 'doctor', bin: 'bugun' },
  { label: 'Öğretmen', img: 'teacher', bin: 'bugun' },
  { label: 'Esnaf', img: 'store', bin: 'bugun' },
  { label: 'Robot teknisyeni', img: 'robot', bin: 'yeni' },
  { label: 'Drone pilotu', img: 'satellite', bin: 'yeni' },
  { label: 'Yapay zekâ uzmanı', img: 'robot2', bin: 'yeni' },
  { label: 'Enerji mühendisi', img: 'sun', bin: 'yeni' },
]
const DEVIR_BINS: SortQ['bins'] = [
  { id: 'eski', label: 'Artık az görülen', img: 'hourglass', color: '#a16207' },
  { id: 'bugun', label: 'Sık gördüğümüz', img: 'cityscape', color: '#3b82f6' },
  { id: 'yeni', label: 'Yeni meslek', img: 'rocket', color: '#8b5cf6' },
]
const UZMAN_P: P[] = [
  ['Okul ağında zararlı dosya', 'Siber güvenlik uzmanı', 'laptop'],
  ['Ormanda duman görüldü', 'İtfaiyeci', 'fire'],
  ['Okul bahçesinde budama', 'Bahçıvan', 'tree'],
  ['Dere taşmasın diye plan', 'Çevre mühendisi', 'water2'],
  ['Yaralıyı hastaneye götürmek', 'Ambulans şoförü', 'ambulance'],
  ['Şehrin yollarını planlamak', 'Şehir planlamacısı', 'map'],
]
const MESLEK_Q: Q[] = [
  { q: 'Meslek ne demektir?', a: 'Eğitim alarak yapılan iş', w: ['Sadece bir oyun', 'Bir tatil', 'Bir hobi kulübü'], ex: 'İnsanların beceri ve ilgilerine göre eğitim aldıkları ve yaptıkları işe meslek denir.', img: 'construction' },
  { q: 'Fırıncı un için kime ihtiyaç duyar?', a: 'Çiftçiye', w: ['Pilota', 'Diş hekimine', 'Postacıya'], ex: 'Her meslek birbirine ihtiyaç duyar: fırıncı un için çiftçiye ihtiyaç duyar.', img: 'bread' },
  { q: 'Öğretmen hastalanınca kime gider?', a: 'Doktora', w: ['Fırıncıya', 'Pilota', 'Bahçıvana'], ex: 'Meslekler birbirini tamamlar.', img: 'doctor' },
  { q: 'Nalbantlık neden bugün az görülür?', a: 'Teknoloji ve ihtiyaçlar değişti', w: ['Atlar yasaklandı', 'Kimse sevmiyor', 'Çok kolay bir iş'], ex: 'Gelişen teknoloji ve değişen ihtiyaçlarla bazı meslekler azalmıştır.', img: 'horse' },
  { q: 'Meslekler neden önemlidir?', a: 'Toplumun ihtiyaçlarını karşılar', w: ['Sadece para için', 'Hiç önemli değildir', 'Sadece eğlence içindir'], ex: 'Mesleğimizle insanlara faydalı olur, ülkemizin gelişmesine katkı sağlarız.', img: 'handshake' },
  { q: 'Hemşire hangi bilgileri takip eder?', a: 'Ateş, nabız ve tansiyon', w: ['Hava durumu', 'Maç sonuçları', 'Tren saatleri'], ex: 'Hemşire bu bilgileri kaydeder, doktora bilgi verir.', img: 'thermometer' },
]
const MESLEK_TF: TF[] = [
  ['Her meslek toplum için değerlidir.', true, 'Herkes birbirinin emeğine değer verir.'],
  ['Gelecekte yeni meslekler ortaya çıkabilir.', true, 'Bugün hayal edemediğimiz meslekler doğabilir.'],
  ['Bazı meslekleri sadece kızlar yapabilir.', false, 'İlgi ve yeteneğine göre her meslek herkes içindir.'],
  ['İtfaiyeciler afetlerde arama kurtarmaya katılır.', true, 'Afet ve kazalardaki arama kurtarma çalışmalarına katılırlar.'],
  ['Meslek sahipleri birbirine hiç ihtiyaç duymaz.', false, 'Her meslek sahibi birbirine ihtiyaç duyar.'],
  ['Robot teknisyenliği yeni bir meslektir.', true, 'Yakın zamanda adını duymaya başladığımız mesleklerdendir.'],
]
const MESLEK_O: O[] = [
  { q: 'Ekmeğin yolculuğunu sırala.', s: ['Çiftçi buğday yetiştirir', 'Buğday una dönüşür', 'Fırıncı ekmek pişirir', 'Ekmek sofraya gelir'], ex: 'Bir ekmek için bile birçok meslek birlikte çalışır.', img: 'bread' },
  { q: 'Meslek bilgi kartı hazırlamayı sırala.', s: ['Mesleğin adını yaz', 'Çalıştığı yeri yaz', 'Kullandığı araçları yaz', 'Topluma katkısını yaz'], ex: 'Örnek: Öğretmen; okul; tahta, kitap; eğitimli bireyler yetiştirir.', img: 'memo' },
  { q: 'Hasta birinin iyileşmesini sırala.', s: ['Ambulans hastaneye götürür', 'Doktor muayene eder', 'Hemşire ilacını verir', 'Hasta iyileşir'], ex: 'Sağlıkta da meslekler birbirine bağlıdır.', img: 'hospital' },
]

/* ================================================================================================
 * 4. ÖĞRENME ALANI · YAŞADIĞIM YER VE ÜLKEM
 * ================================================================================================ */
/* --- HB.3.4.1 Tarihî Mekân ve Doğal Güzellikler --- */
const GEZI_Q: Q[] = [
  { q: 'Uçhisar Kalesi hangi şehrimizdedir?', a: 'Nevşehir', w: ['Edirne', 'İzmir', 'Kütahya'], ex: 'Uçhisar Kalesi Nevşehir’dedir; tepesinden Kapadokya görünür.', img: 'castle' },
  { q: 'Selimiye Camisi’ni kim yaptı?', a: 'Mimar Sinan', w: ['Vedat Tek', 'Leonardo da Vinci', 'Barış Manço'], ex: 'Mimar Sinan sağlam ve estetik eserleriyle günümüze ulaşmıştır.', img: 'mosque' },
  { q: 'Mimar Sinan minareler için ne yapmıştı?', a: 'Yıkılmasın diye önceden önlem aldı', w: ['Minareleri boyadı', 'Minare yapmadı', 'Hiç düşünmedi'], ex: 'Uzmanların sonradan önerdiği yönteme benzer bir önlemi yapım sırasında almıştı.', img: 'construction' },
  { q: 'Kütahya’daki yaşlı kestane ağacı neden koruma altında?', a: 'Doğal ve kültürel değeri için', w: ['Çok kısa olduğu için', 'Meyve vermediği için', 'Yeni dikildiği için'], ex: 'Yüzlerce yıllık ağaç, Korunması Gerekli Tabiat Varlığı’dır.', img: 'tree' },
  { q: 'Efes Antik Kenti hangi listede yer alır?', a: 'UNESCO Dünya Mirası Listesi', w: ['Alışveriş listesi', 'Okul listesi', 'Spor listesi'], ex: 'Efes, dünyanın önemli tarihî kentlerinden biridir.', img: 'classical' },
  { q: 'Tarihî yerleri ziyaret eden turistler ülkemize ne kazandırır?', a: 'Tanınma ve turizm geliri', w: ['Daha çok çöp', 'Hiçbir şey', 'Trafik cezası'], ex: 'Turistler ülkemizin tanınmasına ve ekonomisine katkı sağlar.', img: 'airplane' },
  { q: '“Doğa bekçi ile değil sevgi ile korunur.” ne demektir?', a: 'Doğayı sevgiyle kendimiz korumalıyız', w: ['Doğaya bekçi gerekmez, istediğimizi yaparız', 'Sadece bekçiler korur', 'Doğa korunmaz'], ex: 'Doğayı korumak hepimizin görevidir.', img: 'heart' },
]
const BOYLECE_P: P[] = [
  ['Çöpü yere atmamak', 'Canlılar zarar görmez', 'wastebasket'],
  ['Suyu boşa harcamamak', 'Kaynak geleceğe kalır', 'droplet'],
  ['Ormanda ateş yakmamak', 'Doğa canlı kalır', 'fire'],
  ['Denize atık bırakmamak', 'Balıklar temiz yaşar', 'fish'],
  ['Yakın yere yürümek', 'Hava kirlenmez', 'walking'],
  ['Geri dönüşüm kutusu', 'Atık yeniden kullanılır', 'recycle'],
  ['Tarihî esere yazı yazmamak', 'Eser zarar görmez', 'classical'],
]
const KURUM_P: P[] = [
  ['Kültür ve Turizm Bakanlığı', 'Müze ve kaleleri korur', 'castle'],
  ['Belediyeler', 'Alanları temiz ve güvenli tutar', 'broom'],
  ['Bilim insanları', 'Nasıl korunacağını planlar', 'scientist'],
  ['Tarım ve Orman Bakanlığı', 'Ağaç ve hayvanları korur', 'tree'],
  ['Gönüllü dernekler', 'Doğayı korumaya destek olur', 'handshake'],
  ['Çevre Bakanlığı', 'Orman ve denizleri izler', 'wave'],
]
const KORUMA_TF: TF[] = [
  ['Ülke varlıklarını korumak değerlerimizi geleceğe aktarır.', true, 'Geçmişi geleceğe taşımış oluruz.'],
  ['Tarihî mekânlar doğal güzelliklerden daha önemlidir.', false, 'İkisi de ülkemizin hazinesidir; ikisini de koruruz.'],
  ['Korumada birçok kişi ve kurum birlikte görev alır.', true, 'Devlet kurumları, belediyeler, uzmanlar ve gönüllüler birlikte çalışır.'],
  ['Ormanlık alanda istediğimiz zaman mangal yakabiliriz.', false, 'Ormanda ateş yakmayız.'],
  ['Tarihî mekânların zarar görmesi kültürümüzü kaybettirebilir.', true, 'Tarihî mekânlar kültürel değerlerimizi yansıtır.'],
  ['Tarihî duvarlara resim çizebiliriz.', false, 'Tarihî eserlere yazı yazmaz, onlara dokunmayız.'],
  ['Doğal güzellikleri korumak gelecek nesiller için önemlidir.', true, 'Gelecek kuşaklara yaşanabilir bir çevre bırakırız.'],
  ['Koruma görevi sadece kurumlarındır.', false, 'Bu değerleri korumak hepimizin görevidir.'],
]
const MEKAN_ITEMS: SortQ['items'] = [
  { label: 'Uçhisar Kalesi', img: 'castle', bin: 'tarih' },
  { label: 'Selimiye Camisi', img: 'mosque', bin: 'tarih' },
  { label: 'Efes Antik Kenti', img: 'classical', bin: 'tarih' },
  { label: 'Ayasofya Camisi', img: 'mosque', bin: 'tarih' },
  { label: 'Peri bacaları', img: 'mountain', bin: 'doga' },
  { label: 'Yaşlı kestane ağacı', img: 'tree', bin: 'doga' },
  { label: 'Ormanlar', img: 'evergreen', bin: 'doga' },
  { label: 'Göller ve denizler', img: 'wave', bin: 'doga' },
]
const MEKAN_BINS: SortQ['bins'] = [
  { id: 'tarih', label: 'Tarihî mekân', img: 'classical', color: '#a16207' },
  { id: 'doga', label: 'Doğal güzellik', img: 'tree', color: '#16a34a' },
]

/* --- HB.3.4.2 Ülkemizin Yönetim Şekli --- */
const YONETIM_Q: Q[] = [
  { q: 'Ülkemizin yönetim şekli nedir?', a: 'Cumhuriyet', w: ['Krallık', 'Padişahlık', 'Sınıf başkanlığı'], ex: 'Ülkemizin yönetim şekli cumhuriyettir.', img: 'trflag' },
  { q: 'Cumhuriyet nerede ilan edildi?', a: 'Türkiye Büyük Millet Meclisinde', w: ['Bir okulda', 'Bir müzede', 'Bir stadyumda'], ex: 'Cumhuriyet 29 Ekim’de TBMM’de ilan edildi.', img: 'classical' },
  { q: 'İlk cumhurbaşkanımız kimdir?', a: 'Mustafa Kemal Atatürk', w: ['Mimar Sinan', 'Mehmet Âkif Ersoy', 'İbni Sina'], ex: 'Atatürk Türkiye Cumhuriyeti’nin ilk cumhurbaşkanı olarak seçildi.', img: 'trflag' },
  { q: 'Cumhuriyette yöneticileri kim seçer?', a: 'Halk, oy kullanarak', w: ['Sadece bir kişi', 'Kura ile çekilir', 'Kimse seçmez'], ex: 'Cumhuriyette halk yöneticilerini seçimlerde oy kullanarak belirler.', img: 'raisedhand' },
  { q: 'Mecliste halkı kimler temsil eder?', a: 'Milletvekilleri', w: ['Muhtarlar', 'Öğrenciler', 'Bakkallar'], ex: 'Halkın seçtiği milletvekilleri TBMM’de halkı temsil eder.', img: 'classical' },
  { q: 'Kaç yaşını dolduran kişi oy kullanabilir?', a: '18', w: ['10', '12', '15'], ex: 'Seçme ve seçilme hakkıyla 18 yaşını dolduran herkes oy kullanır.', img: 'memo' },
  { q: 'Devletin en üst yasası hangisidir?', a: 'Anayasa', w: ['Sınıf kuralları', 'Oyun kuralları', 'Yönetmelik'], ex: 'Anayasa yönetim biçimini ve vatandaş haklarını belirler; cumhuriyeti korur.', img: 'scroll' },
  { q: '“Egemenlik kayıtsız şartsız milletindir.” sözü kimindir?', a: 'Atatürk', w: ['Mimar Sinan', 'Barış Manço', 'Neşet Ertaş'], ex: 'Atatürk bu sözle yönetimde milletin söz sahibi olduğunu vurguladı.', img: 'trflag' },
]
const YONETIM_P: P[] = [
  ['Milletvekili', 'Halkın seçtiği temsilci', 'raisedhand'],
  ['Cumhurbaşkanı', 'Ülkenin en yetkili yöneticisi', 'trflag'],
  ['Seçim', 'Oy kullanarak belirlemek', 'memo'],
  ['TBMM', 'Milletvekillerinin çalıştığı yer', 'classical'],
  ['Anayasa', 'Devletin temel yasası', 'scroll'],
  ['Bakan', 'Bir alanda görev yapar', 'gear'],
  ['Muhtar', 'Mahalleyi yönetir', 'houses'],
]
const YONETIM_TF: TF[] = [
  ['Cumhuriyet yönetiminde egemenlik millete aittir.', true, 'Atatürk: “Egemenlik kayıtsız şartsız milletindir.”'],
  ['Atatürk Türkiye Cumhuriyeti’nin ilk cumhurbaşkanıdır.', true, 'Cumhuriyetin ilanından sonra ilk cumhurbaşkanı seçildi.'],
  ['Mecliste muhtarlar halkı temsil eder.', false, 'Mecliste halkı milletvekilleri temsil eder.'],
  ['Cumhurbaşkanını halk seçer.', true, 'Cumhurbaşkanı halkın oylarıyla seçilir.'],
  ['Bakanlar eğitim, sağlık gibi alanlarda görev yapar.', true, 'Bakanlar Cumhurbaşkanına bağlı olarak çalışır.'],
  ['Cumhuriyette insanlar düşüncelerini söyleyemez.', false, 'Cumhuriyette insanlar düşüncelerini özgürce ifade eder.'],
  ['Cumhuriyetle kadınlara seçme ve seçilme hakkı verildi.', true, 'Cumhuriyet eşitlik ve özgürlük üzerine kuruludur.'],
]
const KAYNAK_HIT = ['Ailemle görüşme', 'Okulda röportaj', 'Ansiklopedi', 'Kütüphane', 'Resmî kurum sitesi', 'Öğretmenim']
const KAYNAK_WRONG = ['Söylenti', 'Rastgele yorum', 'Reklam afişi', 'Uydurma haber']
const KAYNAK_IMG: Record<string, string> = { 'Ailemle görüşme': 'house', 'Okulda röportaj': 'microphone', Ansiklopedi: 'books', Kütüphane: 'openbook', 'Resmî kurum sitesi': 'laptop', Öğretmenim: 'teacher', Söylenti: 'shush', 'Uydurma haber': 'newspaper' }

/* --- HB.3.4.3 Mustafa Kemal Atatürk’ün Başarıları ve Kişilik Özellikleri --- */
const ATA_Q: Q[] = [
  { q: 'Küçük Mustafa Askerî Rüştiyeye nasıl girdi?', a: 'Sınavı kazanarak', w: ['Kura çekerek', 'Hiç sınava girmeden', 'Bir arkadaşının yerine'], ex: 'Okula gitmeyi çok istedi, sınavı kazanıp kabul edildi.', img: 'school' },
  { q: 'Atatürk yaz tatillerinde hangi dersi alırdı?', a: 'Fransızca', w: ['Yüzme', 'Resim', 'Satranç'], ex: 'Yabancı dil öğrenmeyi ihmal etmez, yazları Fransızca dersleri alırdı.', img: 'openbook' },
  { q: 'Atatürk’ün halka tanıttığı yenilik hangisidir?', a: 'Yeni alfabe', w: ['Cep telefonu', 'Bilgisayar', 'Uydu'], ex: 'Atatürk yeni alfabeyi halka tanıttı.', img: 'abc' },
  { q: 'Hangi fabrikanın açılışını Atatürk yaptı?', a: 'Bursa Merinos Fabrikası', w: ['Bir oyuncak fabrikası', 'Bir uydu fabrikası', 'Bir robot fabrikası'], ex: 'Bu açılış ekonomideki yeniliklerin örneğidir.', img: 'factory' },
  { q: '“Zorluklar onu yıldırmazdı.” Bu hangi özelliktir?', a: 'Azimli ve kararlı', w: ['Sanatsever', 'Sporsever', 'Misafirperver'], ex: 'Başarmak için sabır ve inançla çalışırdı.', img: 'medal' },
  { q: '“Geleceği önceden düşünür, uzun plan yapardı.” Bu hangi özelliktir?', a: 'İleri görüşlü', w: ['Adaletli', 'Çalışkan', 'Sanatsever'], ex: 'İleri görüşlü lider ülkesinin geleceğini planlar.', img: 'telescope' },
  { q: '“Tüm insanları eşit görürdü.” Bu hangi özelliktir?', a: 'Adaletli', w: ['Çözüm odaklı', 'Analitik', 'İleri görüşlü'], ex: 'Haksızlığa karşı çıkar, insanların haklarını korurdu.', img: 'balance' },
  { q: 'Atatürk hangi alanlarda yenilik yaptı?', a: 'Eğitim, hukuk, ekonomi ve sanat', w: ['Sadece spor', 'Sadece müzik', 'Hiçbir alanda'], ex: 'Bilim ve kadın hakları alanlarında da önemli adımlar attı.', img: 'star' },
]
const OLAY_P: P[] = [
  ['Zorluklara rağmen mücadeleyi bırakmadı', 'Azimli ve kararlı', 'medal'],
  ['Halkı bir araya getirip yeni yol buldu', 'Çözüm odaklı', 'key'],
  ['Her okulda başarılı bir öğrenciydi', 'Çalışkan', 'book'],
  ['Çağdaş toplum için cumhuriyeti ilan etti', 'İleri görüşlü', 'telescope'],
  ['Zor günlerde halka moral verdi', 'Olumlu bakış açılı', 'sunrise'],
  ['Verdiği sözü hep tuttu', 'Doğru ve güvenilir', 'handshake'],
]
const SOZ_P: P[] = [
  ['“Güçlükler karşısında yılmamak gerekir.”', 'Azim', 'medal'],
  ['“Türk öğün, çalış, güven.”', 'Çalışkanlık', 'book'],
  ['“Yurtta barış, dünyada barış.”', 'Barış', 'earth'],
  ['“Umutsuz durum yoktur, umutsuz insan vardır.”', 'Umut', 'sunrise'],
  ['“…hiçbiriniz sanatçı olamazsınız.”', 'Sanat sevgisi', 'palette'],
  ['“Ben sporcunun zeki, çevik… olanını severim.”', 'Spor sevgisi', 'running'],
]
const OZELLIK_HIT = ['Çalışkan', 'Azimli', 'Adaletli', 'İleri görüşlü', 'Çözüm odaklı', 'Güvenilir', 'Sanatsever']
const OZELLIK_WRONG = ['Tembel', 'Umutsuz', 'Kararsız', 'Haksız', 'Sözünü tutmayan']

/* --- HB.3.4.4 Millî Birlik ve Beraberlik --- */
const DEGER_ITEMS: SortQ['items'] = [
  { label: 'İstiklâl Marşı', img: 'music', bin: 'milli' },
  { label: 'Türk bayrağı', img: 'trflag', bin: 'milli' },
  { label: '23 Nisan', img: 'balloon', bin: 'milli' },
  { label: '29 Ekim', img: 'fireworks', bin: 'milli' },
  { label: 'Merhamet', img: 'heart', bin: 'manevi' },
  { label: 'Yardımseverlik', img: 'hug', bin: 'manevi' },
  { label: 'Misafirperverlik', img: 'teapot', bin: 'manevi' },
  { label: 'Paylaşmak', img: 'gift', bin: 'manevi' },
]
const DEGER_BINS: SortQ['bins'] = [
  { id: 'milli', label: 'Millî değer', img: 'trflag', color: '#ef4444' },
  { id: 'manevi', label: 'Manevi değer', img: 'heart', color: '#8b5cf6' },
]
const BIRLIK_Q: Q[] = [
  { q: 'Mahallede sel oldu. Birlik içinde ne yaparız?', a: 'Kızılay ile yardım toplarız', w: ['Evden hiç çıkmayız', 'Kimseye yardım etmeyiz', 'Sadece izleriz'], ex: 'Afetlerde milletçe bir araya gelir, dayanışma içinde oluruz.', img: 'package' },
  { q: 'Millî takımımızın maçı var. Bu bize ne hissettirir?', a: 'Birlik ve beraberlik', w: ['Yalnızlık', 'Öfke', 'Korku'], ex: 'Millî müsabakalarda bir araya gelmek birliğimizi güçlendirir.', img: 'ball' },
  { q: 'İlk Türk astronot uzaya çıktı. Ne hissederiz?', a: 'Gurur', w: ['Kıskançlık', 'Üzüntü', 'İlgisizlik'], ex: 'Alper Gezeravcı’nın başarısı hepimizi gururlandırdı.', img: 'rocket' },
  { q: '“Birlikten kuvvet doğar.” ne anlatır?', a: 'Birlikte daha güçlüyüz', w: ['Tek başımıza daha güçlüyüz', 'Kuvvet sadece spordur', 'Birlik zayıflatır'], ex: 'El ele verdiğimizde zorlukları aşarız.', img: 'handshake' },
  { q: 'Kızılay hangi konularda hizmet verir?', a: 'Beslenme ve barınma', w: ['Maç yayını', 'Oyuncak satışı', 'Trafik cezası'], ex: 'Kızılay afetlerde yiyecek, içecek, giyecek ve barınak ulaştırır.', img: 'package' },
  { q: 'İlk yerli ve millî uydumuzun adı nedir?', a: 'Türksat 6A', w: ['Göktürk Kuşu', 'Ay Yıldız 1', 'Anadolu Treni'], ex: 'Türksat 6A’nın uzaya fırlatılması bizi gururlandırdı.', img: 'satellite' },
  { q: 'Millî bayramlarda evleri neyle donatırız?', a: 'Bayrağımızla', w: ['Balonlu reklamlarla', 'Çöp poşetleriyle', 'Hiçbir şeyle'], ex: 'Bayraklarımızı asar, törenler yaparız.', img: 'trflag' },
  { q: 'Alper Gezeravcı uzaydan ne dedi?', a: '“İstikbal göklerdedir.”', w: ['“Burada çok sıkıldım.”', '“Hemen dönmek istiyorum.”', '“Uzay çok küçük.”'], ex: 'Uzayda bilim deneyleri yaptı ve bu sözü söyledi.', img: 'rocket' },
]
const TOREN_O: O[] = [
  { q: '23 Nisan töreni hazırlığını sırala.', s: ['Etkinlik fikirlerini yaz', 'Etkinliklere karar ver', 'Görev paylaşımı yap', 'Prova yap', 'Töreni coşkuyla kutla'], ex: 'Hazırlık sürecinde dayanışma içinde çalışırız.', img: 'balloon' },
  { q: 'Sosyal sorumluluk projesini sırala.', s: ['Bir sorun belirle', 'Proje formunu doldur', 'Görev paylaş', 'Projeye isim ver', 'Projeyi sun'], ex: 'Sosyal sorumluluk projeleri karşılık beklemeden yapılır.', img: 'memo' },
  { q: 'Anı defteri yapmayı sırala.', s: ['Kapak kartonunu seç', 'Sayfaları kes', 'Delik açıp kurdele geçir', 'Bayrak ve fotoğraf ekle', 'Anılarını yaz'], ex: 'Anı defterimize millî gün ve bayram anılarımızı yazarız.', img: 'notebook' },
]
const TAKVIM_P: P[] = [
  ['Cumhuriyet Bayramı', '29 Ekim', 'fireworks'],
  ['Ulusal Egemenlik ve Çocuk Bayramı', '23 Nisan', 'balloon'],
  ['Gençlik ve Spor Bayramı', '19 Mayıs', 'running'],
  ['Zafer Bayramı', '30 Ağustos', 'trflag'],
  ['İstiklâl Marşı’nın Kabulü', '12 Mart', 'music'],
  ['Şehitler Günü', '18 Mart', 'tulip'],
  ['Dünya Çocuk Hakları Günü', '20 Kasım', 'baby'],
]

/* ================================================================================================
 * 5. ÖĞRENME ALANI · DOĞA VE ÇEVRE
 * ================================================================================================ */
/* --- HB.3.5.1 Doğadaki Varlıkların İnsan Yaşamındaki Önemi --- */
const DOGA_P: P[] = [
  ['Güneş', 'Isıtır ve aydınlatır', 'sun'],
  ['Hava', 'Nefes almamızı sağlar', 'cloud'],
  ['Su', 'Canlıların yaşaması için şart', 'droplet'],
  ['Toprak', 'Bitkinin köklerini tutar', 'seedling'],
  ['Ağaç', 'Gölge verir, havayı temizler', 'tree'],
  ['Hayvanlar', 'Süt, yumurta, yün, bal verir', 'cow'],
  ['Bitkiler', 'Sebze ve meyve verir', 'carrot'],
]
const KAYNAKTAN_ITEMS: SortQ['items'] = [
  { label: 'Kâğıt', img: 'memo', bin: 'agac' },
  { label: 'Masa ve sandalye', img: 'seat', bin: 'agac' },
  { label: 'Kalem', img: 'pencil', bin: 'agac' },
  { label: 'Kapı', img: 'wood', bin: 'agac' },
  { label: 'Süt', img: 'milk', bin: 'hayvan' },
  { label: 'Yün', img: 'sheep', bin: 'hayvan' },
  { label: 'Bal', img: 'honey', bin: 'hayvan' },
  { label: 'Yumurta', img: 'egg', bin: 'hayvan' },
  { label: 'Çömlek', img: 'jar', bin: 'toprak' },
  { label: 'Tuğla', img: 'house', bin: 'toprak' },
  { label: 'Kil', img: 'rock', bin: 'toprak' },
]
const KAYNAKTAN_BINS: SortQ['bins'] = [
  { id: 'agac', label: 'Ağaçtan', img: 'tree', color: '#16a34a' },
  { id: 'hayvan', label: 'Hayvandan', img: 'cow', color: '#f59e0b' },
  { id: 'toprak', label: 'Topraktan', img: 'rock', color: '#a16207' },
]
const DOGA_Q: Q[] = [
  { q: 'Uğur böceği bahçeye nasıl yardım eder?', a: 'Bitkilere zarar veren böcekleri yer', w: ['Yaprakları yer', 'Çiçekleri koparır', 'Toprağı kurutur'], ex: 'Uğur böcekleri tarlaların gizli bekçileridir.', img: 'ladybug' },
  { q: 'Karıncalar toprağa nasıl faydalı olur?', a: 'Tünel açıp toprağı havalandırır', w: ['Toprağı sertleştirir', 'Bitkileri söker', 'Suyu kirletir'], ex: 'Toprak havalanınca bitkiler daha güzel büyür.', img: 'ant' },
  { q: 'Rüzgârın ve kuşların sesine ne ad verilir?', a: 'Doğa müziği', w: ['Trafik sesi', 'Makine sesi', 'Alarm'], ex: 'Doğadaki seslere biyomüzik veya doğa müziği denir.', img: 'bird' },
  { q: 'Ağaçların kökleri ne işe yarar?', a: 'Toprağı tutar', w: ['Havayı ısıtır', 'Taşları eritir', 'Suyu kirletir'], ex: 'Kökler toprağın dağılmasını önler.', img: 'tree' },
  { q: 'Arılar bal dışında ne sağlar?', a: 'Bitki çeşitliliğine katkı', w: ['Yün', 'Süt', 'Kâğıt'], ex: 'Arılar bal üretirken bitki çeşitliliğine de katkıda bulunur.', img: 'bee' },
  { q: 'Doğa koleksiyonu yaparken ne toplarız?', a: 'Yere düşmüş yaprak ve kozalak', w: ['Daldaki çiçekler', 'Kuş yuvası', 'Canlı böcekler'], ex: 'Canlılara zarar vermeden sadece yere düşenleri alırız.', img: 'fallenleaf' },
  { q: 'Doğadaki bir varlık yok olursa ne olur?', a: 'Diğer varlıklar da etkilenir', w: ['Hiçbir şey olmaz', 'Doğa daha güzel olur', 'Sadece o varlık etkilenir'], ex: 'Doğadaki varlıklar birbirine bağlıdır.', img: 'link' },
]
const DOGA_TF: TF[] = [
  ['Su, hava ve güneş olmadan canlılar yaşayamaz.', true, 'Bu üç varlık yaşam için şarttır.'],
  ['Bütün bitkiler toprakta büyür.', true, 'Toprak bitkilerin köklerine besin sağlar.'],
  ['Bazı bitkiler ilaç yapımında kullanılır.', true, 'Bitkiler insanlara birçok fayda sağlar.'],
  ['Hayvanların doğanın dengesinde hiç rolü yoktur.', false, 'Tüm hayvanlar doğanın dengesini korumada önemlidir.'],
  ['Ağaçlar yağışların düzenli olmasına yardım eder.', true, 'Ağaçlar bizim için çok değerlidir.'],
  ['Doğaya gösterdiğimiz özen geleceğe bıraktığımız mirastır.', true, 'Doğayı korumak dünyanın geleceğini korumaktır.'],
  ['Uğur böcekleri bitkilere zarar verir.', false, 'Uğur böcekleri bitkileri zararlı böceklerden korur.'],
]
const TOPLA_HIT = ['Düşmüş yaprak', 'Kozalak', 'Küçük taş', 'Meşe palamudu', 'Kuru dal', 'Kuş tüyü']
const TOPLA_WRONG = ['Daldaki çiçek', 'Kuş yuvası', 'Canlı tırtıl', 'Ağaç kabuğu sökmek']
const TOPLA_IMG: Record<string, string> = { 'Düşmüş yaprak': 'fallenleaf', Kozalak: 'evergreen', 'Küçük taş': 'stone', 'Meşe palamudu': 'squirrel', 'Kuru dal': 'wood', 'Kuş tüyü': 'bird', 'Daldaki çiçek': 'flower', 'Kuş yuvası': 'egg', 'Canlı tırtıl': 'worm' }

/* --- HB.3.5.2 Kroki ve Konum --- */
const YON_Q: Q[] = [
  { q: 'Krokide okul parkın kuzeyinde. Park okulun hangi yönündedir?', a: 'Güney', w: ['Kuzey', 'Doğu', 'Batı'], ex: 'Kuzeyin tersi güneydir.', img: 'compass' },
  { q: 'Krokide hastane itfaiyenin doğusunda. İtfaiye hastanenin hangi yönündedir?', a: 'Batı', w: ['Doğu', 'Kuzey', 'Güney'], ex: 'Doğunun tersi batıdır.', img: 'map' },
  { q: 'Kütüphane belediyenin batısında. Belediye kütüphanenin hangi yönündedir?', a: 'Doğu', w: ['Batı', 'Güney', 'Kuzey'], ex: 'Batının tersi doğudur.', img: 'books' },
  { q: 'Durak kütüphanenin güneyinde. Kütüphane durağın hangi yönündedir?', a: 'Kuzey', w: ['Güney', 'Doğu', 'Batı'], ex: 'Güneyin tersi kuzeydir.', img: 'busstop' },
  { q: 'Kuzey ile doğunun arasındaki yön hangisidir?', a: 'Kuzeydoğu', w: ['Güneybatı', 'Kuzeybatı', 'Güneydoğu'], ex: 'İki ana yönün arasındaki yöne ara yön denir.', img: 'compass' },
  { q: 'Güney ile batının arasındaki yön hangisidir?', a: 'Güneybatı', w: ['Kuzeydoğu', 'Güneydoğu', 'Kuzeybatı'], ex: 'Güney ile batı arası güneybatıdır.', img: 'compass' },
  { q: 'Market okulun kuzeydoğusunda. Okul marketin hangi yönündedir?', a: 'Güneybatı', w: ['Kuzeydoğu', 'Kuzeybatı', 'Güneydoğu'], ex: 'Kuzeydoğunun tersi güneybatıdır.', img: 'store' },
  { q: 'Park evin güneydoğusunda. Ev parkın hangi yönündedir?', a: 'Kuzeybatı', w: ['Güneydoğu', 'Kuzeydoğu', 'Güneybatı'], ex: 'Güneydoğunun tersi kuzeybatıdır.', img: 'housegarden' },
]
const ARA_P: P[] = [
  ['Kuzey ve doğu arası', 'Kuzeydoğu', 'compass'],
  ['Kuzey ve batı arası', 'Kuzeybatı', 'compass'],
  ['Güney ve doğu arası', 'Güneydoğu', 'compass'],
  ['Güney ve batı arası', 'Güneybatı', 'compass'],
  ['Kuzeyin tersi', 'Güney', 'map'],
  ['Doğunun tersi', 'Batı', 'sunrise'],
]
const KROKI_TF: TF[] = [
  ['Kroki kuş bakışı çizilir.', true, 'Çevremizi yukarıdan görüyormuş gibi çizeriz.'],
  ['Kroki çizerken cetvelle tam ölçü alırız.', false, 'Krokide ölçü kullanılmaz, göz kararı çizilir.'],
  ['Sembollerin anlamı sembol anahtarında yazar.', true, 'Sembol anahtarı krokinin alt kısmında yer alır.'],
  ['Krokide yön oku bulunur.', true, 'Yön oku yerlerin konumunu bulmamızı sağlar.'],
  ['Krokide yolların adını yazmayız.', false, 'Cadde, sokak, okul gibi önemli yerlerin adları yazılır.'],
  ['Kroki yön bulmamıza yardım eder.', true, 'Kroki sayesinde yerlerin konumunu kolayca anlarız.'],
  ['Parkı krokide yeşil alanla gösterebiliriz.', true, 'Park yeşil alan, yollar çizgi, okul bina sembolüyle gösterilir.'],
]
const KROKIYER_P: P[] = [
  ['Kartvizit', 'İş yerinin adresini gösterir', 'memo'],
  ['El ilanı', 'Yeni mağazanın yerini gösterir', 'newspaper'],
  ['Alışveriş merkezi', 'Mağazanın katını gösterir', 'store'],
  ['Site girişi', 'Blokları ve otoparkı gösterir', 'houses'],
  ['Turizm bürosu', 'Turistik yerleri gösterir', 'map'],
]
const KROKI_O: O[] = [
  { q: 'Okul çevresinin krokisini çizmeyi sırala.', s: ['Çevreyi yukarıdan düşün', 'Yolları çizgiyle çiz', 'Yerleri sembolle göster', 'Yön okunu ekle', 'Sembol anahtarını yaz'], ex: 'Kuş bakışı düşünür, sembolleri ve yön okunu ekleriz.', img: 'map' },
  { q: 'Krokide bir yeri bulmayı sırala.', s: ['Yön okunu bul', 'Sembol anahtarına bak', 'Yerin sembolünü bul', 'Yönünü söyle'], ex: 'Yön oku ve sembol anahtarı krokiyi okumamızı sağlar.', img: 'compass' },
]

/* --- HB.3.5.3 Afet Öncesi, Afet Anı ve Afet Sonrası --- */
const AFET_ITEMS: SortQ['items'] = [
  { label: 'Afet çantası hazırlamak', img: 'backpack', bin: 'once' },
  { label: 'Tatbikat yapmak', img: 'bell', bin: 'once' },
  { label: 'Aile afet planı yapmak', img: 'memo', bin: 'once' },
  { label: 'Tehlike avı yapmak', img: 'magnifier', bin: 'once' },
  { label: 'Sakin kalmak', img: 'shield', bin: 'an' },
  { label: 'Sel suyuna girmemek', img: 'water2', bin: 'an' },
  { label: 'İhbar düğmesine basmak', img: 'fire', bin: 'an' },
  { label: 'Düdükle haber vermek', img: 'speaker', bin: 'an' },
  { label: 'Toplanma alanına gitmek', img: 'walking', bin: 'sonra' },
  { label: 'Vanaları kapatmak', img: 'tools', bin: 'sonra' },
  { label: 'Radyodan uyarı dinlemek', img: 'radio', bin: 'sonra' },
  { label: '“Geri dönün” uyarısını beklemek', img: 'clock', bin: 'sonra' },
]
const AFET_BINS: SortQ['bins'] = [
  { id: 'once', label: 'Afet öncesi', img: 'calendar', color: '#3b82f6' },
  { id: 'an', label: 'Afet anı', img: 'zap', color: '#f59e0b' },
  { id: 'sonra', label: 'Afet sonrası', img: 'sunrise', color: '#22c55e' },
]
const AFETAN_Q: Q[] = [
  { q: 'Afet anında ilk ne yaparız?', a: 'Sakin olmaya çalışırız', w: ['Panikle koşarız', 'Bağırıp ağlarız', 'Asansöre bineriz'], ex: 'Afet anında doğru davranmak için önce sakin oluruz.', img: 'shield' },
  { q: 'Bina içinde deprem olursa ne yaparız?', a: 'AFAD önerisi: Çök, kapan, tutun', w: ['Merdivenden koşarız', 'Pencereye gideriz', 'Asansöre bineriz'], ex: 'AFAD önerisi: Çök, kapan, tutun. Sarsıntı bitene kadar yerimizde kalırız.', img: 'house' },
  { q: 'Açık alanda deprem olursa nerede dururuz?', a: 'Bina ve direklerden uzakta', w: ['Duvar dibinde', 'Ağacın altında', 'Elektrik direğinin yanında'], ex: 'Açık alanda kalır, bina, direk, ağaç ve duvarlardan uzaklaşırız.', img: 'mountain' },
  { q: 'Dumanlı bir yerde nasıl ilerleriz?', a: 'Eğilerek, ağzımızı ıslak bezle kapatarak', w: ['Ayakta koşarak', 'Kapıları açarak', 'Gözümüzü kapatarak'], ex: 'Dumandan korunmak için eğilerek ilerler, ıslak bezle nefes alırız.', img: 'fire' },
  { q: 'Yangını haber vermek için hangi numarayı ararız?', a: '112', w: ['123', '321', '100'], ex: '112 Acil Çağrı Merkezi’ni arayarak yangını itfaiyeye bildiririz.', img: 'telephone' },
  { q: 'Sel olunca nereye gideriz?', a: 'Yüksek ve güvenli bir yere', w: ['Dere kenarına', 'Bodrum katına', 'Suyun içine'], ex: 'Sel bölgesini terk eder, yüksek yerlere gideriz.', img: 'mountain' },
  { q: 'Çığ riski olan yerde çevremizi nasıl uyarırız?', a: 'Düdük veya ıslıkla', w: ['Sessiz kalarak', 'Işıkları kapatarak', 'Saklanarak'], ex: 'Bağırarak, düdük ya da ıslıkla çevremizi uyarırız.', img: 'snowflake' },
  { q: 'Afetten sonra toplanma alanından ne zaman döneriz?', a: '“Geri dönün!” uyarısı gelince', w: ['Hemen', 'Canımız isteyince', 'Hiç dönmeyiz'], ex: 'Uyarıları radyodan dinler, izin verilince döneriz.', img: 'radio' },
]
const CANTA_HIT = ['Su', 'Paketli yiyecek', 'El feneri', 'Düdük', 'İlk yardım çantası', 'Pilli radyo', 'Battaniye']
const CANTA_WRONG = ['Oyun konsolu', 'Dondurma', 'Saksı çiçeği', 'Top', 'Büyük oyuncak']
const CANTA_IMG: Record<string, string> = { Su: 'water2', 'Paketli yiyecek': 'package', 'El feneri': 'bulb', Düdük: 'speaker', 'İlk yardım çantası': 'bandage', 'Pilli radyo': 'radio', Battaniye: 'bed', 'Oyun konsolu': 'videogame', Dondurma: 'icecream', 'Saksı çiçeği': 'plantpot', Top: 'ball', 'Büyük oyuncak': 'teddy' }
const AFETSONRA_O: O[] = [
  { q: 'Afet sonrası adımları sırala.', s: ['Sakin kal', 'Güvende olduğundan emin ol', 'Afet çantanı al', 'Çıkış kapısından tahliye ol', 'Toplanma alanına git'], ex: 'Önce kendi güvenliğimizden emin olur, sonra binayı terk ederiz.', img: 'walking' },
  { q: 'Tatbikat adımlarını sırala.', s: ['Uyarıyı duy', 'Sakin ol', 'Öğretmenini dinle', 'Sırayla çık', 'Toplanma alanında bekle'], ex: 'Tatbikat afet anında nasıl davranacağımızı öğretir.', img: 'bell' },
  { q: 'Afet çantası hazırlamayı sırala.', s: ['Ailece listeyi yaz', 'Malzemeleri topla', 'Çantaya yerleştir', 'Düzenli kontrol et', 'Eskiyenleri değiştir'], ex: 'Tarihi geçen yiyecek ve içecekleri değiştiririz.', img: 'backpack' },
]
const AFET_TF: TF[] = [
  ['Afetlere hazırlıklı olmak için afet eylem planı yaparız.', true, 'Ailemizle birlikte plan yaparız.'],
  ['Afet anında panikle koşarak dışarı çıkarız.', false, 'Sakin kalır, doğru davranışları uygularız.'],
  ['Afet sonrasında en yakın toplanma alanına gideriz.', true, 'Toplanma alanını önceden öğreniriz.'],
  ['Deniz kıyısındaysak deprem anında kıyıda kalırız.', false, 'Deniz kıyısındaysak kıyıdan uzaklaşırız.'],
  ['Afetlere hazırlıklı olmak için tatbikat yaparız.', true, 'Tatbikat nasıl davranacağımızı öğretir.'],
  ['Sel suyunun içinden yürüyerek geçebiliriz.', false, 'Sel suları bizi sürükleyebilir; sel suyuna girmeyiz.'],
  ['Afetlere hazırlıklı olmak hayat kurtarır.', true, 'Hazırlıklı olursak güvende kalırız.'],
]

/* --- HB.3.5.4 Çevresel Sürdürülebilirlik --- */
const SURDUR_P: P[] = [
  ['Geri dönüşüm', 'Atıklar yeniden kullanılır', 'recycle'],
  ['Güneş paneli', 'Güneşten enerji üretir', 'sun'],
  ['Yeşil çatı', 'Havayı temizler', 'plant'],
  ['Elektrikli araç', 'Havayı kirletmez', 'car'],
  ['Ağaçlandırma', 'Ormanları çoğaltır', 'seedling'],
  ['Su tasarrufu', 'Barajlar dolu kalır', 'droplet'],
  ['Rüzgâr enerjisi', 'Rüzgârdan elektrik', 'wave2'],
]
const CEVRE_ITEMS: SortQ['items'] = [
  { label: 'Fidan dikmek', img: 'seedling', bin: 'iyi' },
  { label: 'Işığı kapatmak', img: 'bulb', bin: 'iyi' },
  { label: 'Atığı ayırmak', img: 'recycle', bin: 'iyi' },
  { label: 'Bisikletle gitmek', img: 'bicycle', bin: 'iyi' },
  { label: 'Musluğu kapatmak', img: 'droplet', bin: 'iyi' },
  { label: 'Çöpü yere atmak', img: 'trash', bin: 'kotu' },
  { label: 'Suyu boşa akıtmak', img: 'water2', bin: 'kotu' },
  { label: 'Ağaç kesmek', img: 'tree', bin: 'kotu' },
  { label: 'Dereye atık dökmek', img: 'wastebasket', bin: 'kotu' },
  { label: 'Boş odada ışık', img: 'bulb2', bin: 'kotu' },
]
const CEVRE_BINS: SortQ['bins'] = [
  { id: 'iyi', label: 'Çevre dostu', img: 'thumbsup', color: '#22c55e' },
  { id: 'kotu', label: 'Çevreye zararlı', img: 'thumbsdown', color: '#ef4444' },
]
const SURDUR_Q: Q[] = [
  { q: 'Sürdürülebilirlik ne demektir?', a: 'Bir şeyin uzun süre devam etmesi', w: ['Bir şeyin hemen bitmesi', 'Her şeyi atmak', 'Sadece yeni şey almak'], ex: 'Çevresel sürdürülebilirlik dünyanın uzun yıllar yaşanabilir kalmasıdır.', img: 'earth' },
  { q: 'Kerem’in şehrinde barajlar neden azaldı?', a: 'Su israfı ve az yağış', w: ['Çok yağmur yağdı', 'Barajlar büyüdü', 'Herkes tasarruf etti'], ex: 'Suyun tasarruflu kullanılmaması ve yetersiz yağış barajları azalttı.', img: 'water2' },
  { q: 'Halk su tasarrufu yapınca barajlara ne oldu?', a: 'Su seviyesi yükseldi', w: ['Barajlar kurudu', 'Hiç değişmedi', 'Su kirlendi'], ex: 'Tasarruf ve yağışlarla barajlardaki su arttı.', img: 'chart' },
  { q: 'Hangisi okulumuzda katılabileceğimiz bir projedir?', a: 'Sıfır Atık Projesi', w: ['Çöp Artırma Projesi', 'Işıkları Açık Bırak', 'Kâğıt İsrafı Günü'], ex: '“Sıfır Atık” ve “Enerji Dostu Mavi Yeşil Okul” çevre projeleridir.', img: 'recycle' },
  { q: 'Çevreyi korumak kimin sorumluluğudur?', a: 'Hepimizin', w: ['Sadece yetişkinlerin', 'Sadece belediyenin', 'Hiç kimsenin'], ex: 'Çocuklar da büyükler de çevreyi korur.', img: 'earth' },
  { q: 'Çevre konusunda bilgi toplarken ne yaparız?', a: 'Bilginin güvenilir olup olmadığına bakarız', w: ['İlk duyduğumuza inanırız', 'Hiçbir kaynağa bakmayız', 'Uydururuz'], ex: 'Gözlem, görüşme, kitap ve genel ağdan bilgi toplar, güvenilirliğini değerlendiririz.', img: 'magnifier' },
]
const SURDUR_TF: TF[] = [
  ['Doğal kaynakları sınırsızca kullanabiliriz.', false, 'Kaynaklar sınırlıdır; tasarruflu kullanırız.'],
  ['Elektriği gereksiz kullanmak kaynak israfıdır.', true, 'Kullanmadığımız ışığı kapatırız.'],
  ['Su tasarrufu çevreyi korumaya katkı sağlar.', true, 'Su tasarrufu doğal kaynakları korur.'],
  ['Çevresel sürdürülebilirlik sadece yetişkinlerin sorumluluğudur.', false, 'Hepimizin sorumluluğudur.'],
  ['Ağaç dikmek çevreyi korumaya yardım eder.', true, 'Ağaçlandırma ormanlarımızı çoğaltır.'],
  ['Dünya bize atalarımızdan kalan bir mirastır.', true, 'Bu mirası gelecek nesillere güzel şekilde bırakırız.'],
]

/* ================================================================================================
 * 6. ÖĞRENME ALANI · BİLİM, TEKNOLOJİ VE SANAT
 * ================================================================================================ */
/* --- HB.3.6.1 Bilimsel Gelişmelerin Hayatımızdaki Önemi --- */
const ZAMAN_ITEMS: SortQ['items'] = [
  { label: 'Horozla uyanmak', img: 'rooster', bin: 'eski' },
  { label: 'Sobada ekmek kızartmak', img: 'fire', bin: 'eski' },
  { label: 'Bulaşığı elde yıkamak', img: 'sponge', bin: 'eski' },
  { label: 'Okula atla gitmek', img: 'horse', bin: 'eski' },
  { label: 'Çalar saatle uyanmak', img: 'clock', bin: 'bugun' },
  { label: 'Buzdolabı', img: 'ice', bin: 'bugun' },
  { label: 'Televizyon', img: 'television', bin: 'bugun' },
  { label: 'Okul servisi', img: 'bus', bin: 'bugun' },
]
const ZAMAN_BINS: SortQ['bins'] = [
  { id: 'eski', label: 'Çok eskiden', img: 'hourglass', color: '#a16207' },
  { id: 'bugun', label: 'Bugün', img: 'bulb', color: '#3b82f6' },
]
const BILIM_Q: Q[] = [
  { q: 'Aşı vücudumuza ne yapar?', a: 'Mikrobu tanıtır ve bizi korur', w: ['Bizi hemen hasta eder', 'Kemiklerimizi uzatır', 'Saçımızı uzatır'], ex: 'Aşı olunca vücudumuz mikrobu tanır ve onunla nasıl savaşacağını bilir.', img: 'microbe' },
  { q: 'İbni Sina’nın ünlü ansiklopedik eseri hangisidir?', a: 'Tıbbın Kanunu', w: ['Yıldızlı Gece', 'Mona Lisa', 'Yurttan Sesler'], ex: 'İbni Sina tıp, eczacılık ve astronomi alanlarında eserler verdi.', img: 'openbook' },
  { q: 'Hava durumu erken uyarı sistemi balıkçılara nasıl yardım eder?', a: 'Fırtınada denize açılmazlar', w: ['Daha çok balık tutarlar', 'Fırtınayı durdururlar', 'Denizi ısıtırlar'], ex: 'Önceden haber alan insanlar önlem alarak güvende kalır.', img: 'storm' },
  { q: 'Göbeklitepe hangi şehrimizdedir?', a: 'Şanlıurfa', w: ['Nevşehir', 'Edirne', 'Kütahya'], ex: 'Kalıntılar insanların çok eski zamanlarda büyük yapılar yaptığını gösterdi.', img: 'stone' },
  { q: 'Adımsayar neyi ölçer?', a: 'Attığımız adım sayısını', w: ['Havanın sıcaklığını', 'Boyumuzu', 'Kitap sayısını'], ex: 'Adımsayar mesafe, kalori ve kalp atış hızını da gösterebilir.', img: 'stopwatch' },
  { q: 'Yara bandı küçük yaralarda ne sağladı?', a: 'Evde kolayca bakım yapmayı', w: ['Hastaneye gitmeyi zorunlu yaptı', 'Yarayı büyüttü', 'Hiçbir şey'], ex: 'Bulan kişi toplumsal gelişime katkı sağladı.', img: 'bandage' },
  { q: 'Bilim insanları “Neden?” ve “Nasıl?” diye sorarak ne yapar?', a: 'Kanıta dayalı düşünür', w: ['Tahmin edip geçer', 'Hiç araştırmaz', 'Sadece ezberler'], ex: 'Soru sormak eleştirel düşünmemize ve doğru karar vermemize yardım eder.', img: 'thinking' },
  { q: 'Yapay zekâ öğrenmek için neye ihtiyaç duyar?', a: 'Çok miktarda veriye', w: ['Uykuya', 'Yemeğe', 'Oyuncağa'], ex: 'Veriler sayı, fotoğraf, yazı veya ses kaydı olabilir.', img: 'robot' },
]
const GELISME_P: P[] = [
  ['Aşı', 'Hastalıklardan korur', 'microbe'],
  ['Erken uyarı sistemi', 'Fırtınaya önlem alırız', 'storm'],
  ['Uydu', 'Uzaydan bilgi toplar', 'satellite'],
  ['Gözlük', 'Daha iyi görürüz', 'glasses'],
  ['Depreme dayanıklı bina', 'Daha güvenli yaşarız', 'construction'],
  ['Tarım makinesi', 'Daha verimli üretim', 'tractor'],
  ['Güneş enerjisi', 'Doğayı korur', 'sun'],
]
const BILIM_TF: TF[] = [
  ['Bilimsel çalışmalar toplumun sorunlarını çözmek için yapılır.', true, 'Bilim hayatımızı kolaylaştırır.'],
  ['Aşı vücudumuza mikropları tanıtan bir koruma yöntemidir.', true, 'Aşı bizi mikroplardan korur.'],
  ['Erken uyarı sistemleri hava olaylarının olmasını engeller.', false, 'Hava olaylarını engellemez, önceden haber verir.'],
  ['Bilimsel gelişmeler bilgiye ulaşmayı zorlaştırmıştır.', false, 'Bilgiye ulaşmak kolaylaşmıştır.'],
  ['Bilimsel gelişmeler sayesinde uzaya uydular gönderilir.', true, 'Uydular haberleşme ve gözlem için kullanılır.'],
  ['Mikropların keşfiyle hastalıkların nedenini öğrendik.', true, 'Bu sayede hijyen kurallarının önemini anladık.'],
  ['Geçmişte tedavisi olmayan bazı hastalıklar bugün tedavi edilebilir.', true, 'Bilimsel gelişmeler sağlığımızı korur.'],
]
const GOZLUK_O: O[] = [
  { q: 'Gözlüğün hikâyesini eskiden yeniye sırala.', s: ['Kuvars taşıyla büyütmek', 'Burunda duran sapsız gözlük', 'Kurdeleyle bağlanan gözlük', 'Saplı gözlük'], ex: 'Gözlük zamanla gelişerek bugünkü hâlini aldı.', img: 'glasses' },
  { q: 'Bir bilim insanı gibi araştırmayı sırala.', s: ['Merak ettiğin soruyu yaz', 'Bilgi topla', 'Kanıtları incele', 'Sonucu paylaş'], ex: 'Soru sorar, kanıta bakar, sonucu paylaşırız.', img: 'magnifier' },
  { q: 'Gazete haberi yazmayı sırala.', s: ['Ne oldu?', 'Nerede oldu?', 'Ne zaman oldu?', 'Nasıl ve neden oldu?', 'Habere başlık koy'], ex: 'Habere ne, nerede, ne zaman, nasıl ve neden sorularıyla başlarız.', img: 'newspaper' },
]

/* --- HB.3.6.2 Teknolojik Gelişmelerin Günlük Yaşama Etkisi --- */
const ESKI_P: P[] = [
  ['Tebeşirli tahta', 'Akıllı tahta', 'pencil', 'laptop'],
  ['Sadece arama yapan telefon', 'Akıllı telefon', 'telephone', 'phone'],
  ['Yavaş tren', 'Hızlı tren', 'train', 'racecar'],
  ['Elle hasat', 'Hasat makinesi', 'wheat', 'tractor'],
  ['Kâğıt harita', 'Navigasyon', 'map', 'compass'],
  ['Mektup', 'E-posta', 'memo', 'laptop'],
]
const ALAN_ITEMS: SortQ['items'] = [
  { label: 'Akıllı tahta', img: 'laptop', bin: 'egitim' },
  { label: 'EBA ders videoları', img: 'television', bin: 'egitim' },
  { label: 'Kitaptaki karekod', img: 'book', bin: 'egitim' },
  { label: 'Hızlı tren', img: 'train', bin: 'ulasim' },
  { label: 'Navigasyon', img: 'compass', bin: 'ulasim' },
  { label: 'Akıllı trafik ışığı', img: 'trafficlight', bin: 'ulasim' },
  { label: 'MR cihazı', img: 'hospital', bin: 'saglik' },
  { label: 'Akıllı saat', img: 'stopwatch', bin: 'saglik' },
  { label: 'Robotik cerrahi', img: 'robot', bin: 'saglik' },
]
const ALAN_BINS: SortQ['bins'] = [
  { id: 'egitim', label: 'Eğitim', img: 'school', color: '#3b82f6' },
  { id: 'ulasim', label: 'Ulaşım', img: 'train', color: '#f59e0b' },
  { id: 'saglik', label: 'Sağlık', img: 'hospital', color: '#ef4444' },
]
const YARAR_ITEMS: SortQ['items'] = [
  { label: 'Hızlı araştırma', img: 'magnifier', bin: 'yarar' },
  { label: 'Görüntülü arama', img: 'phone', bin: 'yarar' },
  { label: 'Hızlı teşhis', img: 'stethoscope', bin: 'yarar' },
  { label: 'Kısa yolculuk', img: 'airplane', bin: 'yarar' },
  { label: 'Ders videoları', img: 'television', bin: 'yarar' },
  { label: 'Dijital bağımlılık', img: 'videogame', bin: 'zarar' },
  { label: 'Göz yorgunluğu', img: 'eye', bin: 'zarar' },
  { label: 'Az yüz yüze sohbet', img: 'sad', bin: 'zarar' },
  { label: 'Zaman kaybı', img: 'hourglass', bin: 'zarar' },
]
const YARAR_BINS: SortQ['bins'] = [
  { id: 'yarar', label: 'Yararı', img: 'thumbsup', color: '#22c55e' },
  { id: 'zarar', label: 'Doğru kullanmazsak zararı', img: 'thumbsdown', color: '#ef4444' },
]
const TEKNO_Q: Q[] = [
  { q: '5G’deki “G” harfi ne anlama gelir?', a: 'Nesil', w: ['Gece', 'Güneş', 'Gemi'], ex: '5G yeni nesil teknolojidir; genel ağı daha hızlı yapar.', img: 'phone' },
  { q: 'EBA ne işe yarar?', a: 'Ders videolarına ve testlere ulaşırız', w: ['Yemek siparişi verilir', 'Maç izlenir', 'Uçak bileti alınır'], ex: 'EBA, Eğitim Bilişim Ağı’dır.', img: 'laptop' },
  { q: 'MR cihazı ne yapar?', a: 'Vücudun içini görüntüler', w: ['Yemek pişirir', 'Hava durumunu söyler', 'Müzik çalar'], ex: 'MR ve tomografi ile hastalıklar hızlı ve doğru teşhis edilir.', img: 'hospital' },
  { q: 'Dijital ayak izi nedir?', a: 'Elektronik ortamda bıraktığımız kayıtlar', w: ['Kumdaki ayak izimiz', 'Ayakkabı numaramız', 'Bir dans adımı'], ex: 'Arama yaparken bile iz bırakırız; dikkatli olmalıyız.', img: 'shoe' },
  { q: 'Uzun süre ekran başında kalmak neye yol açabilir?', a: 'Göz bozukluğu ve bağımlılık', w: ['Daha güçlü kaslar', 'Daha iyi uyku', 'Daha çok arkadaş'], ex: 'Teknolojik araçları kullanırken amaç ve süreye dikkat ederiz.', img: 'eye' },
  { q: 'Akıllı saat neyi ölçebilir?', a: 'Nabız, adım ve uyku', w: ['Boyumuzu', 'Ayakkabımızı', 'Kitap sayımızı'], ex: 'Akıllı saat sağlığımız hakkında bilgi verir.', img: 'stopwatch' },
  { q: 'Çiftçiler bugün ürünü nasıl topluyor?', a: 'Makinelerle kısa sürede', w: ['Sadece elle günlerce', 'Hiç toplamıyor', 'Atla uçarak'], ex: 'Teknoloji sayesinde çiftçiler daha az yoruluyor.', img: 'tractor' },
]
const TEKNO_TF: TF[] = [
  ['Teknoloji hayatımızın hemen her alanında kullanılır.', true, 'Eğitim, ulaşım, iletişim ve sağlıkta teknoloji vardır.'],
  ['Teknolojiyi doğru kullanmazsak olumsuz etkilerini görebiliriz.', true, 'Kullanım amacına ve süresine dikkat ederiz.'],
  ['Kitaplarımızdaki karekodlar ek videolara ulaştırır.', true, 'Karekodla konuyu pekiştiren içeriklere ulaşırız.'],
  ['Teknoloji yüz yüze iletişimi her zaman artırır.', false, 'Uzun ekran süresi yüz yüze iletişimi azaltabilir.'],
  ['Trafik ışıkları bilgisayarla kontrol edilebilir.', true, 'Bu sayede trafik düzeni sağlanır.'],
  ['İnternette yaptıklarımız hiç iz bırakmaz.', false, 'Yaptıklarımız dijital ayak izi olarak kaydedilir.'],
]
const AKILLI_HIT = ['Süreye dikkat et', 'Mola ver', 'Amaçlı kullan', 'İzin alarak gir', 'Gözünü dinlendir', 'Ailenle konuş']
const AKILLI_WRONG = ['Gece boyu oyna', 'Şifreni paylaş', 'Yemekte ekrana bak', 'Hiç mola verme']
const AKILLI_IMG: Record<string, string> = { 'Süreye dikkat et': 'hourglass', 'Mola ver': 'sleepy', 'Amaçlı kullan': 'target', 'İzin alarak gir': 'key', 'Gözünü dinlendir': 'eye', 'Ailenle konuş': 'house', 'Gece boyu oyna': 'moon', 'Şifreni paylaş': 'lock', 'Yemekte ekrana bak': 'forkplate', 'Hiç mola verme': 'videogame' }

/* --- HB.3.6.3 Sanatçıların Sanata Katkıları --- */
const SANATCI_P: P[] = [
  ['Mimar Vedat Tek', 'İkinci meclis binası', 'classical'],
  ['Van Gogh', 'Yıldızlı Gece tablosu', 'glowstar'],
  ['Leonardo da Vinci', 'Mona Lisa tablosu', 'framed'],
  ['Muzaffer Sarısözen', 'Yurttan Sesler korosu', 'microphone'],
  ['Barış Manço', '7’den 77’ye programı', 'television'],
  ['Afife Jale', 'İlk kadın tiyatro oyuncusu', 'theater'],
  ['Neşet Ertaş', 'Bağlamayla türküler', 'guitar'],
  ['Ömer Seyfettin', 'Kısa hikâyeler', 'openbook'],
]
const DAL_ITEMS: SortQ['items'] = [
  { label: 'Neşet Ertaş', img: 'guitar', bin: 'muzik' },
  { label: 'Barış Manço', img: 'music', bin: 'muzik' },
  { label: 'Muzaffer Sarısözen', img: 'microphone', bin: 'muzik' },
  { label: 'Van Gogh', img: 'palette', bin: 'resim' },
  { label: 'Leonardo da Vinci', img: 'framed', bin: 'resim' },
  { label: 'Mimar Vedat Tek', img: 'classical', bin: 'resim' },
  { label: 'Afife Jale', img: 'theater', bin: 'soz' },
  { label: 'Ömer Seyfettin', img: 'openbook', bin: 'soz' },
  { label: 'Mimar Sinan', img: 'mosque', bin: 'resim' },
]
const DAL_BINS: SortQ['bins'] = [
  { id: 'muzik', label: 'Müzik', img: 'music', color: '#ec4899' },
  { id: 'resim', label: 'Resim ve mimari', img: 'palette', color: '#3b82f6' },
  { id: 'soz', label: 'Tiyatro ve edebiyat', img: 'theater', color: '#8b5cf6' },
]
const KIM_Q: Q[] = [
  { q: 'Anadolu’yu gezip eski türküleri kaydettim. Ben kimim?', a: 'Muzaffer Sarısözen', w: ['Van Gogh', 'Afife Jale', 'Vedat Tek'], ex: 'Muzaffer Sarısözen halk müziğini derledi, Yurttan Sesler korosunu kurdu.', img: 'microphone' },
  { q: 'Türkiye’de sahneye çıkan ilk kadın tiyatro oyuncusuyum. Ben kimim?', a: 'Afife Jale', w: ['Barış Manço', 'Neşet Ertaş', 'Ömer Seyfettin'], ex: 'Afife Jale cesaretiyle birçok kadına örnek oldu.', img: 'theater' },
  { q: 'Çocuklara sevgi dolu şarkılar yaptım, televizyon programım vardı. Ben kimim?', a: 'Barış Manço', w: ['Leonardo da Vinci', 'Vedat Tek', 'Afife Jale'], ex: 'Barış Manço “7’den 77’ye” programıyla her yaştan insana ulaştı.', img: 'television' },
  { q: 'Ressam, mucit ve bilim insanıyım; uçağa benzeyen çizimler yaptım. Ben kimim?', a: 'Leonardo da Vinci', w: ['Van Gogh', 'Neşet Ertaş', 'Muzaffer Sarısözen'], ex: 'En ünlü eseri Mona Lisa tablosudur.', img: 'framed' },
  { q: 'Hikâyelerimde Türkçeyi sadeleştirdim. Ben kimim?', a: 'Ömer Seyfettin', w: ['Barış Manço', 'Van Gogh', 'Vedat Tek'], ex: 'Ömer Seyfettin herkesin anlayabileceği kısa hikâyeler yazdı.', img: 'openbook' },
  { q: 'Türküleri bağlamamla yeniden yorumladım. Ben kimim?', a: 'Neşet Ertaş', w: ['Leonardo da Vinci', 'Afife Jale', 'Ömer Seyfettin'], ex: 'Neşet Ertaş Türk kültürünü gelecek nesillere taşıdı.', img: 'guitar' },
  { q: 'Tablolarımda parlak renkler ve kıvrımlı çizgiler var. Ben kimim?', a: 'Van Gogh', w: ['Muzaffer Sarısözen', 'Afife Jale', 'Barış Manço'], ex: 'Van Gogh’un “Yıldızlı Gece” tablosu çok ünlüdür.', img: 'palette' },
  { q: 'İkinci meclis binasını tasarladım, bugün müze. Ben kimim?', a: 'Mimar Vedat Tek', w: ['Leonardo da Vinci', 'Neşet Ertaş', 'Ömer Seyfettin'], ex: 'Bina bugün Cumhuriyet Müzesi olarak ziyaret edilir.', img: 'classical' },
]
const KATKI_HIT = ['Hayal gücü verir', 'Duyguyu anlatır', 'Kültürü taşır', 'Çevreyi süsler', 'Yeni bakış açısı', 'Ülkeyi tanıtır']
const KATKI_WRONG = ['Çevreyi kirletir', 'Kültürü unutturur', 'Sadece sıkar', 'Kavga çıkarır']
const POSTER_O: O[] = [
  { q: 'Sanatçı posteri hazırlamayı sırala.', s: ['Bir sanatçı seç', 'Güvenilir kaynak bul', 'Bilgileri kontrol et', 'Başlık yaz', 'Eserlerini ve katkılarını yaz', 'Görsel ekle'], ex: 'Topladığımız bilgilerin doğru olup olmadığını değerlendiririz.', img: 'framed' },
  { q: 'Çevremizdeki sanat eserini araştırmayı sırala.', s: ['Eseri fark et', 'Fotoğrafını çiz', 'Kimin yaptığını araştır', 'Arkadaşlarına anlat'], ex: 'Parktaki mozaik ya da meydandaki heykel de sanat eseridir.', img: 'palette' },
]
const SANAT_TF: TF[] = [
  ['Sanatçılar kültürümüzü gelecek nesillere taşır.', true, 'Türküler, hikâyeler ve yapılar kültürümüzü yaşatır.'],
  ['Parktaki mozaik süsleme de bir sanat eseridir.', true, 'Çevremizde birçok sanat eseri vardır.'],
  ['Sanat sadece müzelerde bulunur.', false, 'Okul duvarında, meydanda, parkta da sanat vardır.'],
  ['Sanatçılarımız ülkemizi yurt dışında temsil eder.', true, 'Başarılarıyla gurur duyarız.'],
  ['Araştırmada her bilgiye hemen inanırız.', false, 'Kaynağın doğru olup olmadığını değerlendiririz.'],
  ['Sanat duygularımızı ifade etmemize yardım eder.', true, 'Sanat hayal gücümüzü de geliştirir.'],
]

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
const T = 6 // tur sayısı
const OYUN = 8

export const HB3_ADALAR: Alan[] = [
  {
    id: 'a1',
    no: 1,
    title: 'Ben ve Okulum',
    color: '#ff9a2e',
    dark: '#c86a0c',
    icon: 'school',
    acts: [
      { kind: 'gucluyum-gelisiyorum', title: 'Güçlüyüm, Gelişiyorum', icon: 'biceps', total: T, meb: 'HB.3.1.1', gen: rot(ch(GUCLU_Q), tf(GUCLU_TF, 'biceps')), ders: 'İlgi duyduğumuz ve iyi yaptığımız alanlar güçlü alanlarımızdır. Sevip de zorlandığımız alanlar ise gelişime açık alanlarımızdır.', points: ['Güçlü alan: seviyorum, başarıyorum', 'Gelişime açık: seviyorum, zorlanıyorum', 'Sabırla gelişirim'], visual: img('biceps') },
      { kind: 'ilgi-sepetleri', title: 'İlgi Sepetleri', icon: 'palette', total: 4, meb: 'HB.3.1.1', gen: srt('Bu ilgi hangi alana girer?', 'Deney bilim, tiyatro sanat, voleybol spordur.', ILGI_BINS, ILGI_ITEMS), ders: 'Güçlü ve gelişime açık yönlerimiz bilim, sanat veya spor alanında olabilir.', visual: img('palette') },
      { kind: 'karar-basamaklari', title: 'Karar Basamakları', icon: 'thinking', total: 4, meb: 'HB.3.1.1', gen: ord(KARAR_O), ders: 'Amacımızı belirler, bilgi toplar, seçenekleri düşünür, seçer ve kararımızı gözden geçiririz.', visual: img('thinking') },
      { kind: 'kime-sorabilirim', title: 'Kime Sorabilirim?', icon: 'magnifier', total: 4, meb: 'HB.3.1.1', gen: pop('Güvenilir bilgi kaynaklarını patlat!', 'Ailemiz, öğretmenlerimiz, uzmanlar, kitap ve belgeseller bilgi verir.', BILGI_HIT, BILGI_WRONG, BILGI_IMG), ders: 'Bilgi toplarken ailemize, rehber öğretmenimize ve güvenilir kaynaklara başvururuz.', visual: img('magnifier') },
      { kind: 'ornek-insanlar', title: 'Örnek İnsanlar', icon: 'medal', total: 4, meb: 'HB.3.1.1', gen: mt('Kişiyi güçlü olduğu alanla eşleştir.', 'Alanında başarılı insanlar bize örnek olur.', ORNEK_P), ders: 'Naim Süleymanoğlu halterde, İdil Biret piyanoda ülkemize gurur yaşattı.', visual: img('medal') },
      { kind: 'hak-mi-sorumluluk-mu', title: 'Hak mı, Sorumluluk mu?', icon: 'balance', total: 4, meb: 'HB.3.1.2', gen: srt('Bu bir hak mı, sorumluluk mu?', 'Teneffüste oynamak hakkımız, çöpü kutuya atmak sorumluluğumuzdur.', HAK_BINS, HAK_ITEMS), ders: 'Okulda haklarımız olduğu gibi yerine getirmemiz gereken sorumluluklarımız da vardır.', visual: img('balance') },
      { kind: 'okul-haklari', title: 'Okuldaki Haklarım', icon: 'school', total: 4, meb: 'HB.3.1.2', gen: mt('Örneği okuldaki hakla eşleştir.', 'Eğitim, güvenlik, kendini ifade, dinlenme, sağlık ve erişilebilirlik okuldaki haklarımızdır.', OKUL_HAK_P), ders: 'Haklarımızı bilmek güvenli, mutlu ve başarılı bir okul için önemlidir.', visual: img('school') },
      { kind: 'hakkim-sorumlulugum', title: 'Hakkım da Var Sorumluluğum da', icon: 'handshake', total: T, meb: 'HB.3.1.2', gen: rot(ch(HAK_Q), tf(HAK_TF, 'school')), ders: 'Sorumluluğumuzu yerine getirdiğimizde başkalarının haklarını da koruruz.', points: ['Derse zamanında gel', 'Eşyaları koru', 'Söz alarak konuş'], visual: img('handshake') },
      { kind: 'aysunun-gunu', title: 'Aysun’un Günü', icon: 'clock', total: 4, meb: 'HB.3.1.2', gen: ch(AYSUN_Q), ders: 'Aysun bazı sorumluluklarını yaptı, bazılarını aksattı. Sen olsan ne yapardın?', visual: img('clock') },
      { kind: 'cocuk-haklari', title: 'Çocuğum, Haklarımla Varım', icon: 'heart', total: T, meb: 'HB.3.1.3', gen: rot(ch(COCUK_Q), tf(COCUK_TF, 'heart')), ders: 'Çocuk Hakları Sözleşmesi’ne göre 18 yaşına kadar herkes çocuktur. Bütün çocukların hakları eşittir.', points: ['Yaşama ve gelişme', 'Eğitim ve oyun', 'Görüşlere saygı'], visual: img('heart') },
      { kind: 'hak-kartlari', title: 'Hak Kartları', icon: 'star', total: 4, meb: 'HB.3.1.3', gen: mt('Hakkı açıklamasıyla eşleştir.', 'Çocuk Hakları Sözleşmesi’nden örnek maddeler.', MADDE_P), ders: 'Her madde çocukların mutlu ve güvenli büyümesi içindir.', visual: img('star') },
      { kind: 'hak-balonlari', title: 'Hak Balonları', icon: 'balloon', total: 4, meb: 'HB.3.1.3', gen: pop('Çocuk haklarını patlat!', 'Okula gitmek, oyun, beslenme, isim ve güvenlik çocuk haklarıdır.', HAKB_HIT, HAKB_WRONG), ders: 'Hak, herkesin sahip olması gereken şeydir; her istediğimiz hak değildir.', visual: img('balloon') },
      { kind: 'farkindalik-projesi', title: 'Farkındalık Projesi', icon: 'memo', total: 4, meb: 'HB.3.1.3', gen: rot(ord(PROJE_O), tf(PROJE_TF, 'friends')), ders: 'Projenin adını, konusunu, amacını, hedef kitlesini, süresini ve yapılacakları belirleriz.', visual: img('memo') },
      { kind: 'hangi-hak', title: 'Hangi Hak?', icon: 'thinking', total: T, meb: 'HB.3.1.3', gen: ch(HANGI_HAK_Q), ders: 'Kırık oyun parkı oyun hakkını, okula devam etmek eğitim hakkını ilgilendirir.', visual: img('thinking') },
      { kind: 'oyun-okul-meclisi', title: 'Okul Meclisi', icon: 'trophy', total: OYUN, meb: 'HB.3.1.2', oyun: true, gen: karma(ch(HAK_Q), tf(HAK_TF), ch(GUCLU_Q), ch(HANGI_HAK_Q), ord(KARAR_O)), ders: 'Fındık okul meclisine seçildi! Hak ve sorumluluk sorularını çöz, meclis kararlarını panoya as.', visual: img('trophy') },
      { kind: 'oyun-hak-bahcesi', title: 'Hak Bahçesi', icon: 'flower', total: 4, meb: 'HB.3.1.3', oyun: true, gen: rot(mem('Hak kartlarını eşleştir!', 'Çocuk hakları ve açıklamaları.', MADDE_P), pop('Çocuk haklarını patlat!', 'Çocuk hakları.', HAKB_HIT, HAKB_WRONG), srt('Hak mı, sorumluluk mu?', 'Haklar ve sorumluluklar.', HAK_BINS, HAK_ITEMS)), ders: 'Bahçedeki hak çiçeklerini topla!', visual: img('flower') },
    ],
  },
  {
    id: 'a2',
    no: 2,
    title: 'Sağlığım ve Güvenliğim',
    color: '#5bc236',
    dark: '#3b8a1f',
    icon: 'shield',
    acts: [
      { kind: 'saglik-dedektifi', title: 'Sağlık Dedektifi', icon: 'detective', total: T, meb: 'HB.3.2.1', gen: ch(SAGLIK_Q), ders: 'Önce davranışlarımızı değerlendiririz. Sağlıklı olmayan bir davranışımız varsa onu değiştiririz.', points: ['Erken yat', 'Dengeli beslen', 'Havaya göre giyin'], visual: img('detective') },
      { kind: 'korur-mu', title: 'Sağlığımı Korur mu?', icon: 'biceps', total: 4, meb: 'HB.3.2.1', gen: srt('Bu davranış sağlığımızı korur mu?', 'Erken yatmak ve diş fırçalamak korur; kahvaltıyı atlamak korumaz.', [IYI, KOTU], KORUR_ITEMS), ders: 'Uyku, beslenme, temizlik, giyinme ve spor sağlığımızı korur.', visual: img('biceps') },
      { kind: 'yol-haritasi', title: 'Sağlıklı Yaşam Yol Haritası', icon: 'map', total: 4, meb: 'HB.3.2.1', gen: ord(SAGLIK_O), ders: 'Davranışımızı değerlendirir, hedef belirler, plan yapar ve yeni alışkanlığımızı sürdürürüz.', visual: img('map') },
      { kind: 'saglik-gunlugu', title: 'Sağlık Günlüğü', icon: 'calendar', total: 4, meb: 'HB.3.2.1', gen: pop('Sağlık günlüğüne “✓” alacakları patlat!', 'Uyku, diş, el yıkama, giyinme ve hareket sağlıklı davranışlardır.', GUNLUK_HIT, GUNLUK_WRONG, GUNLUK_IMG), ders: 'Sağlıklı davranışlarımızı alışkanlık hâline getiririz.', visual: img('calendar') },
      { kind: 'saglik-kapisi', title: 'Sağlık Kapısı', icon: 'checkered', total: T, meb: 'HB.3.2.1', gen: tf(SAGLIK_TF, 'apple'), ders: 'Doğru cümleyle kapıları aç! Sağlığımızı korumak için her zaman doğru davranışlar sergileriz.', visual: img('checkered') },
      { kind: 'guvende-miyim', title: 'Güvende miyim?', icon: 'shield', total: 4, meb: 'HB.3.2.2', gen: srt('Bu durumda güvende misin?', 'Ailemle parkta güvendeyim; yabancı beni arabasına çağırırsa güvende değilim.', GUVENLI_BINS, GUVENLI_ITEMS), ders: 'Güvenli ve güvensiz durumları ayırt etmek kendimizi korumamıza yardım eder.', visual: img('shield') },
      { kind: 'ne-yaparim', title: 'Ne Yaparım?', icon: 'thinking', total: T, meb: 'HB.3.2.2', gen: ch(GUVEN_Q), ders: 'Kararlı bir “Hayır!” deriz, ortamdan uzaklaşırız ve güvendiğimiz bir büyüğe anlatırız.', points: ['“Hayır!” de', 'Uzaklaş', 'Büyüğüne anlat'], visual: img('thinking') },
      { kind: 'yuz-yuze-cevrim-ici', title: 'Yüz Yüze mi, Çevrim İçi mi?', icon: 'laptop', total: 4, meb: 'HB.3.2.2', gen: srt('Bu tehlikeli durum nerede yaşanıyor?', 'Takip edilmek yüz yüze, numara isteyen oyuncu çevrim içi bir durumdur.', YUZ_BINS, YUZ_ITEMS), ders: 'Tehlikeli durumlar sokakta da internette de olabilir.', visual: img('laptop') },
      { kind: 'hayir-de', title: 'Hayır De, Uzaklaş, Anlat', icon: 'noentry', total: 4, meb: 'HB.3.2.2', gen: ord(HAYIR_O), ders: 'Güvenliğimiz tehlikedeyse hayır der, uzaklaşır ve güvendiğimiz bir yetişkinden yardım isteriz.', visual: img('noentry') },
      { kind: 'guvenlik-afisi', title: 'Güvenlik Afişi', icon: 'lock', total: T, meb: 'HB.3.2.2', gen: tf(AFIS_TF, 'lock'), ders: 'İnternete izinle gireriz, bilgilerimizi paylaşmayız, rahatsız olursak ailemize anlatırız.', visual: img('lock') },
      { kind: 'kime-soylerim', title: 'Kime Söylerim?', icon: 'policeofficer', total: 4, meb: 'HB.3.2.2', gen: pop('Güvendiğin yetişkinleri patlat!', 'Aile, öğretmen, rehber öğretmen, okul müdürü ve polis.', YARDIM_HIT, YARDIM_WRONG), ders: 'Bizi rahatsız eden durumları güvendiğimiz yetişkinlerle mutlaka paylaşırız.', visual: img('policeofficer') },
      { kind: 'yaya-kurallari', title: 'Trafik Kurallarının Önemi', icon: 'trafficlight', total: T, meb: 'HB.3.2.3', gen: rot(ch(TRAFIK_Q), tf(TRAFIK_TF, 'trafficlight')), ders: 'Trafik kuralları herkes için geçerlidir. Kurallara uyarak kendimizi ve başkalarını koruruz.', points: ['Geçitten geç', 'Arka koltukta otur', 'Kemerini tak'], visual: img('trafficlight') },
      { kind: 'yaya-mi-surucu-mu', title: 'Yaya mı, Sürücü mü?', icon: 'car', total: 4, meb: 'HB.3.2.3', gen: srt('Bu kural kimin için?', 'Kaldırımda yürümek yayanın, hız sınırına uymak sürücünün kuralıdır.', YAYA_BINS, YAYA_ITEMS), ders: 'Yayalar da sürücüler de trafik kurallarına uyar.', visual: img('car') },
      { kind: 'karsiya-gecis', title: 'Güvenli Adımlar', icon: 'crossing', total: 4, meb: 'HB.3.2.3', gen: ord(GECIS_O), ders: 'Sola, sağa, sonra tekrar sola bakarız. Arabada kemerimizi takarız.', visual: img('crossing') },
      { kind: 'trafik-ornekleri', title: 'Doğrusu Ne?', icon: 'walking', total: 4, meb: 'HB.3.2.3', gen: mt('Durumu doğru davranışla eşleştir.', 'Her trafik hatasının bir doğrusu var.', DURUM_P), ders: 'Nalan geçidi kullanmalı, Aykut yolun solundan yürümeli, Melis arka koltukta oturmalı.', visual: img('walking') },
      { kind: 'oyun-guvenli-sehir', title: 'Güvenli Şehir Turu', icon: 'cityscape', total: OYUN, meb: 'HB.3.2.3', oyun: true, gen: karma(ch(TRAFIK_Q), tf(TRAFIK_TF), ch(GUVEN_Q), ch(SAGLIK_Q), tf(AFIS_TF)), ders: 'Fındık şehri geziyor! Her durakta sağlık, güvenlik ve trafik sorusunu çöz.', visual: img('cityscape') },
      { kind: 'oyun-saglik-trafik-kartlari', title: 'Sağlık ve Trafik Kartları', icon: 'puzzle', total: 4, meb: 'HB.3.2.1', oyun: true, gen: rot(pop('Sağlık günlüğü balonlarını patlat!', 'Sağlıklı davranışlar.', GUNLUK_HIT, GUNLUK_WRONG, GUNLUK_IMG), mem('Durum kartlarını eşleştir!', 'Trafik durumları ve doğruları.', DURUM_P), ord(HAYIR_O)), ders: 'Balonları patlat, kartları eşleştir!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a3',
    no: 3,
    title: 'Ailem ve Toplum',
    color: '#f06292',
    dark: '#b83b66',
    icon: 'houses',
    acts: [
      { kind: 'aile-toplum', title: 'Aile ve Toplum', icon: 'house', total: T, meb: 'HB.3.3.1', gen: ch(AILE_Q), ders: 'Aile toplumun en küçük birimidir. Toplum; aynı yerde yaşayan, iletişim kuran, ortak kurallara uyan ve yardımlaşan insanlardan oluşur.', points: ['Aile: sevgi, saygı, destek', 'Toplum: kurallar, değerler', 'Anayasa: Aile toplumun temeli'], visual: img('house') },
      { kind: 'aile-mi-toplum-mu', title: 'Ailede mi, Toplumda mı?', icon: 'cityscape', total: 4, meb: 'HB.3.3.1', gen: srt('Bu özellik ailede mi, toplumda mı?', 'Ev işlerini paylaşmak ailede, herkesin uyduğu kurallar toplumdadır.', AILE_BINS, AILE_ITEMS), ders: 'Aile ve toplumun kendine özgü özellikleri vardır.', visual: img('cityscape') },
      { kind: 'aileden-topluma', title: 'Aileden Topluma', icon: 'banknote', total: 4, meb: 'HB.3.3.1', gen: mt('Ailenin davranışını topluma katkısıyla eşleştir.', 'Ailece yaptıklarımız toplumu etkiler.', AILE_P), ders: 'İsraftan kaçınır, vergimizi zamanında verir, kurallara uyarız. Böylece toplumda düzen olur.', visual: img('banknote') },
      { kind: 'kose-oyunu', title: 'Köşe Oyunu', icon: 'raisedhand', total: T, meb: 'HB.3.3.1', gen: tf(KOSE_TF, 'houses'), ders: 'Katılıyor musun? Aile ve toplum arasındaki ilişkiyi düşün.', visual: img('raisedhand') },
      { kind: 'hafta-sonu', title: 'Hatice’nin Hafta Sonu', icon: 'calendar', total: 4, meb: 'HB.3.3.1', gen: pop('Ailece katılabileceğin toplumsal etkinlikleri patlat!', 'Sergi, tiyatro, sinema, konser ve fidan dikme toplumsal etkinliklerdir.', ETKINLIK_HIT, ETKINLIK_WRONG, ETKINLIK_IMG), ders: 'Hatice ailesiyle resim sergisine, sinemaya ve fidan dikme etkinliğine katıldı.', visual: img('calendar') },
      { kind: 'yardima-kim', title: 'Yardıma Kim İhtiyaç Duyar?', icon: 'hug', total: 4, meb: 'HB.3.3.2', gen: pop('Desteğe ihtiyaç duyabilecekleri patlat!', 'Yaşlılar, hastalar, özel gereksinimli ve afet yaşamış kişiler desteğe ihtiyaç duyabilir.', IHTIYAC_HIT, IHTIYAC_WRONG), ders: 'Çevremizdeki ihtiyaçları gözlemleyip farkında olmak önemlidir.', visual: img('hug') },
      { kind: 'yardim-kutusu', title: 'Yardım Kutusu', icon: 'gift', total: 4, meb: 'HB.3.3.2', gen: mt('İhtiyacı yardım fikriyle eşleştir.', 'Küçük yardımlar büyük mutluluklar getirir.', YARDIM_P), ders: 'Görme yetersizliği olan birine kitap okuyabilir, otobüste yaşlılara yer verebiliriz.', visual: img('gift') },
      { kind: 'yardim-projesi', title: 'Yardım Projesi', icon: 'memo', total: 4, meb: 'HB.3.3.2', gen: ord(YPROJE_O), ders: 'Gözlemle, ihtiyacı belirle, ekibini kur, amacı seç, isim ver, iş bölümü yap ve değerlendir.', visual: img('memo') },
      { kind: 'yardimlasma', title: 'Yardımlaşma', icon: 'handshake', total: T, meb: 'HB.3.3.2', gen: rot(ch(YARDIM_Q), tf(YARDIM_TF, 'handshake')), ders: '“Bir elin nesi var, iki elin sesi var.” Yardımlaşınca işler kolaylaşır, bağlarımız güçlenir.', points: ['Gözlemle', 'Empati kur', 'Birlikte çalış'], visual: img('handshake') },
      { kind: 'meslek-bilmeceleri', title: 'Meslek Bilmeceleri', icon: 'puzzle', total: T, meb: 'HB.3.3.3', gen: ch(BILMECE_Q), ders: 'Her meslek toplumda farklı bir ihtiyacı karşılar.', visual: img('puzzle') },
      { kind: 'meslek-kartlari', title: 'Meslek Kartları', icon: 'firefighter', total: 4, meb: 'HB.3.3.3', gen: mt('Mesleği yaptığı işle eşleştir.', 'Her meslek topluma katkı sağlar.', MESLEK_P), ders: 'İtfaiyeci yangını söndürür; hemşire hastaların ateşini, nabzını takip eder.', visual: img('firefighter') },
      { kind: 'meslek-zaman', title: 'Dün, Bugün, Yarın', icon: 'hourglass', total: 4, meb: 'HB.3.3.3', gen: srt('Bu meslek hangi gruba girer?', 'Nalbantlık az görülür, doktorluk yaygın, robot teknisyenliği yenidir.', DEVIR_BINS, DEVIR_ITEMS), ders: 'Teknoloji ve ihtiyaçlar değiştikçe meslekler de değişir.', visual: img('hourglass') },
      { kind: 'hangi-uzman', title: 'Hangi Uzman?', icon: 'detective', total: 4, meb: 'HB.3.3.3', gen: mt('Olayı uzman meslekle eşleştir.', 'Her sorunun bir uzmanı var.', UZMAN_P), ders: 'Zararlı dosyaya siber güvenlik uzmanı, dumana itfaiyeci, dere taşkınına çevre mühendisi bakar.', visual: img('detective') },
      { kind: 'meslekler', title: 'Meslekler', icon: 'construction', total: T, meb: 'HB.3.3.3', gen: rot(ch(MESLEK_Q), tf(MESLEK_TF, 'construction'), ord(MESLEK_O)), ders: 'Her meslek sahibi birbirine ihtiyaç duyar. Herkes birbirinin emeğine değer verir.', points: ['Meslekler birbirine bağlı', 'Bazıları azaldı', 'Yeni meslekler doğuyor'], visual: img('construction') },
      { kind: 'oyun-mahalle-senligi', title: 'Mahalle Şenliği', icon: 'balloon', total: OYUN, meb: 'HB.3.3.1', oyun: true, gen: karma(ch(AILE_Q), tf(KOSE_TF), ch(YARDIM_Q), ch(BILMECE_Q), ord(YPROJE_O)), ders: 'Fındık’ın mahallesinde şenlik var! Aile, yardımlaşma ve meslek sorularıyla şenliği hazırla.', visual: img('balloon') },
      { kind: 'oyun-meslek-hafizasi', title: 'Meslek Hafızası', icon: 'puzzle', total: 4, meb: 'HB.3.3.3', oyun: true, gen: rot(mem('Meslek kartlarını eşleştir!', 'Meslek ve yaptığı iş.', MESLEK_P), pop('Desteğe ihtiyaç duyabilecekleri patlat!', 'Yardımlaşma.', IHTIYAC_HIT, IHTIYAC_WRONG), ord(MESLEK_O)), ders: 'Kartları çevir, meslekleri tanı!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a4',
    no: 4,
    title: 'Yaşadığım Yer ve Ülkem',
    color: '#e5484d',
    dark: '#a8262b',
    icon: 'trflag',
    acts: [
      { kind: 'gezgin-kartlari', title: 'Gezgin Kartları', icon: 'castle', total: T, meb: 'HB.3.4.1', gen: ch(GEZI_Q), ders: 'Tarihî mekânlarımızı korumak geçmişimize saygıdır. Doğal güzellikleri korumak geleceğe yaşanabilir bir çevre bırakmaktır.', points: ['Uçhisar ve peri bacaları', 'Selimiye ve Efes', 'Yaşlı kestane ağacı'], visual: img('castle') },
      { kind: 'boylece', title: 'Böylece…', icon: 'recycle', total: 4, meb: 'HB.3.4.1', gen: mt('Davranışı sonucuyla eşleştir.', 'Her koruma davranışının güzel bir sonucu var.', BOYLECE_P), ders: 'Çöpümüzü yere atmayız; böylece çevre temiz kalır ve canlılar zarar görmez.', visual: img('recycle') },
      { kind: 'kim-korur', title: 'Kim Korur?', icon: 'shield', total: 4, meb: 'HB.3.4.1', gen: mt('Kurumu göreviyle eşleştir.', 'Birçok kurum ve kişi birlikte çalışır.', KURUM_P), ders: 'Bakanlıklar, belediyeler, bilim insanları ve gönüllüler birlikte korur. Bu hepimizin görevidir.', visual: img('shield') },
      { kind: 'koruma-labirenti', title: 'Koruma Labirenti', icon: 'checkered', total: T, meb: 'HB.3.4.1', gen: tf(KORUMA_TF, 'classical'), ders: 'Doğru cümleyi bul, labirentte ilerle!', visual: img('checkered') },
      { kind: 'tarihi-mi-dogal-mi', title: 'Tarihî mi, Doğal mı?', icon: 'mountain', total: 4, meb: 'HB.3.4.1', gen: srt('Bu tarihî bir mekân mı, doğal bir güzellik mi?', 'Kale ve cami tarihî mekân; peri bacaları ve orman doğal güzelliktir.', MEKAN_BINS, MEKAN_ITEMS), ders: 'Tarihî mekânlar ve doğal güzellikler ülkemizin hazineleridir.', visual: img('mountain') },
      { kind: 'cumhuriyet', title: 'Ülkemizin Yönetim Şekli', icon: 'trflag', total: T, meb: 'HB.3.4.2', gen: ch(YONETIM_Q), ders: 'Ülkemizin yönetim şekli cumhuriyettir. Cumhuriyette halk yöneticilerini seçimle belirler.', points: ['29 Ekim’de ilan edildi', 'İlk cumhurbaşkanı Atatürk', 'Egemenlik milletindir'], visual: img('trflag') },
      { kind: 'yonetim-kavramlari', title: 'Yönetim Kavramları', icon: 'classical', total: 4, meb: 'HB.3.4.2', gen: mt('Kavramı açıklamasıyla eşleştir.', 'Milletvekili, cumhurbaşkanı, seçim, TBMM ve anayasa.', YONETIM_P), ders: 'Milletvekilleri TBMM’de halkı temsil eder; anayasa devletin en üst yasasıdır.', visual: img('classical') },
      { kind: 'cumhuriyet-dy', title: 'Cumhuriyet Doğru mu?', icon: 'checkered', total: T, meb: 'HB.3.4.2', gen: tf(YONETIM_TF, 'trflag'), ders: 'Cumhurbaşkanını halk seçer. Mecliste halkı milletvekilleri temsil eder.', visual: img('checkered') },
      { kind: 'kaynak-sec', title: 'Kaynak Seç', icon: 'books', total: 4, meb: 'HB.3.4.2', gen: pop('Güvenilir bilgi kaynaklarını patlat!', 'Ailemizle görüşme, röportaj, ansiklopedi ve resmî kurum siteleri güvenilirdir.', KAYNAK_HIT, KAYNAK_WRONG, KAYNAK_IMG), ders: 'Bilgi toplarken kaynağın konuya uygun ve güvenilir olup olmadığını değerlendiririz.', visual: img('books') },
      { kind: 'ataturkun-kisiligi', title: 'Atatürk’ün Kişiliği', icon: 'star', total: T, meb: 'HB.3.4.3', gen: ch(ATA_Q), ders: 'Atatürk çalışkan, azimli, adaletli, çözüm odaklı, ileri görüşlü ve güvenilirdi. Başarılarının temelinde bu özellikleri vardır.', points: ['Çalışkan ve azimli', 'İleri görüşlü', 'Doğru ve güvenilir'], visual: img('star') },
      { kind: 'olay-ozellik', title: 'Olay ve Özellik', icon: 'medal', total: 4, meb: 'HB.3.4.3', gen: mt('Olayı Atatürk’ün kişilik özelliğiyle eşleştir.', 'Her başarının arkasında bir kişilik özelliği vardır.', OLAY_P), ders: 'Zorluklara rağmen vazgeçmemesi azmini, sözünü tutması güvenilirliğini gösterir.', visual: img('medal') },
      { kind: 'ataturkun-sozleri', title: 'Atatürk’ün Sözleri', icon: 'scroll', total: 4, meb: 'HB.3.4.3', gen: mt('Sözü anlattığı değerle eşleştir.', 'Atatürk’ün sözleri kişiliğini yansıtır.', SOZ_P), ders: '“Yurtta barış, dünyada barış.” sözü barışı, “Güçlükler karşısında yılmamak gerekir.” sözü azmi anlatır.', visual: img('scroll') },
      { kind: 'ozellik-balonlari', title: 'Kişilik Balonları', icon: 'balloon', total: 4, meb: 'HB.3.4.3', gen: pop('Atatürk’ün kişilik özelliklerini patlat!', 'Çalışkan, azimli, adaletli, ileri görüşlü, çözüm odaklı, güvenilir ve sanatsever.', OZELLIK_HIT, OZELLIK_WRONG), ders: 'Atatürk’ün kişilik özellikleri bize örnektir.', visual: img('balloon') },
      { kind: 'milli-manevi', title: 'Millî mi, Manevi mi?', icon: 'heart', total: 4, meb: 'HB.3.4.4', gen: srt('Bu millî bir değer mi, manevi bir değer mi?', 'İstiklâl Marşı ve bayrak millî; merhamet ve misafirperverlik manevi değerimizdir.', DEGER_BINS, DEGER_ITEMS), ders: 'Millî ve manevi değerlerimize saygı göstermemiz çok önemlidir.', visual: img('heart') },
      { kind: 'birlikte-gucluyuz', title: 'Birlikte Güçlüyüz', icon: 'handshake', total: T, meb: 'HB.3.4.4', gen: ch(BIRLIK_Q), ders: 'Zor günde birbirimize destek olur, mutlu anları neşeyle paylaşırız. Böylece millî birliğimiz güçlenir.', points: ['Birlikten kuvvet doğar', 'Afette dayanışma', 'Başarılarla gurur'], visual: img('handshake') },
      { kind: 'toren-hazirligi', title: 'Tören Hazırlığı', icon: 'balloon', total: 4, meb: 'HB.3.4.4', gen: ord(TOREN_O), ders: 'Fikirleri yazar, karar verir, görev paylaşır, prova yapar ve coşkuyla kutlarız.', visual: img('balloon') },
      { kind: 'takvim-kartlari', title: 'Takvim Kartları', icon: 'calendar', total: 3, meb: 'HB.3.4.4', gen: mem('Millî gün kartını tarihiyle eşleştir!', 'Millî gün ve bayramlarımız.', TAKVIM_P), ders: 'Millî gün ve bayramlar millî kimliğimizi hatırlatır.', visual: img('calendar') },
      { kind: 'oyun-cumhuriyet-yolculugu', title: 'Cumhuriyet Yolculuğu', icon: 'trophy', total: OYUN, meb: 'HB.3.4.2', oyun: true, gen: karma(ch(YONETIM_Q), tf(YONETIM_TF), ch(ATA_Q), ch(GEZI_Q), ch(BIRLIK_Q)), ders: 'Fındık ülkeyi geziyor! Her şehirde bir soru seni bekliyor.', visual: img('trophy') },
      { kind: 'oyun-ulke-hafizasi', title: 'Ülke Hafızası', icon: 'puzzle', total: 4, meb: 'HB.3.4.3', oyun: true, gen: rot(mem('Olay kartlarını özellikle eşleştir!', 'Atatürk’ün kişilik özellikleri.', OLAY_P), srt('Tarihî mi, doğal mı?', 'Ülkemizin hazineleri.', MEKAN_BINS, MEKAN_ITEMS), ord(TOREN_O)), ders: 'Kartları çevir, hazineleri sepetle!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a5',
    no: 5,
    title: 'Doğa ve Çevre',
    color: '#2fa7d8',
    dark: '#1a7099',
    icon: 'tree',
    acts: [
      { kind: 'doganin-hediyeleri', title: 'Doğanın Hediyeleri', icon: 'sun', total: 4, meb: 'HB.3.5.1', gen: mt('Doğadaki varlığı katkısıyla eşleştir.', 'Doğadaki her varlık yaşamımıza katkı sağlar.', DOGA_P), ders: 'Güneş ısıtır, hava nefes aldırır, toprak bitkiyi besler, ağaç gölge verir.', visual: img('sun') },
      { kind: 'nereden-geliyor', title: 'Nereden Geliyor?', icon: 'wood', total: 4, meb: 'HB.3.5.1', gen: srt('Bu nereden elde edilir?', 'Kâğıt ağaçtan, süt hayvandan, çömlek topraktan elde edilir.', KAYNAKTAN_BINS, KAYNAKTAN_ITEMS), ders: 'Yemek, ısınma ve barınma gibi ihtiyaçlarımızı doğadaki varlıklardan karşılarız.', visual: img('wood') },
      { kind: 'doga-bilgisi', title: 'Doğadaki Varlıklar', icon: 'ladybug', total: T, meb: 'HB.3.5.1', gen: rot(ch(DOGA_Q), tf(DOGA_TF, 'tree')), ders: 'Doğadaki her varlık bizi besler, iyileştirir ya da korur. Bizim görevimiz de doğayı korumaktır.', points: ['Su, hava, güneş şart', 'Uğur böceği bekçidir', 'Her şey birbirine bağlı'], visual: img('ladybug') },
      { kind: 'doga-koleksiyonu', title: 'Doğa Koleksiyonu', icon: 'fallenleaf', total: 4, meb: 'HB.3.5.1', gen: pop('Koleksiyona alabileceklerini patlat!', 'Sadece yere düşenleri alırız; canlılara zarar vermeyiz.', TOPLA_HIT, TOPLA_WRONG, TOPLA_IMG), ders: 'Doğa yürüyüşünde yaprak, kozalak ve taş toplayabiliriz.', visual: img('fallenleaf') },
      { kind: 'yon-bulmaca', title: 'Yön Bulmaca', icon: 'compass', total: T, meb: 'HB.3.5.2', gen: ch(YON_Q), ders: 'Dört ana yön kuzey, güney, doğu ve batıdır. Aralarındaki yönlere ara yön denir.', points: ['Kuzeyin tersi güney', 'Doğunun tersi batı', 'Kuzeydoğu bir ara yön'], visual: img('compass') },
      { kind: 'ara-yonler', title: 'Ara Yönler', icon: 'compass', total: 4, meb: 'HB.3.5.2', gen: mt('Yönleri eşleştir.', 'Kuzeydoğu, kuzeybatı, güneydoğu ve güneybatı ara yönlerdir.', ARA_P), ders: 'Kuzey ile doğu arası kuzeydoğu, güney ile batı arası güneybatıdır.', visual: img('compass') },
      { kind: 'kroki-kurallari', title: 'Kroki Kuralları', icon: 'map', total: T, meb: 'HB.3.5.2', gen: tf(KROKI_TF, 'map'), ders: 'Kroki, bir yerin kuş bakışı görünümünün ölçü kullanılmadan kabataslak çizilmesidir.', points: ['Kuş bakışı', 'Göz kararı', 'Sembol anahtarı ve yön oku'], visual: img('map') },
      { kind: 'kroki-nerede', title: 'Kroki Nerede?', icon: 'store', total: 4, meb: 'HB.3.5.2', gen: mt('Yeri krokinin işiyle eşleştir.', 'Kroki günlük yaşamın birçok alanında kullanılır.', KROKIYER_P), ders: 'Kartvizitte, el ilanında, alışveriş merkezinde ve turizm bürosunda kroki görürüz.', visual: img('store') },
      { kind: 'kroki-ciziyorum', title: 'Kroki Çiziyorum', icon: 'pencil', total: 4, meb: 'HB.3.5.2', gen: ord(KROKI_O), ders: 'Çevremizi yukarıdan düşünür, yolları çizgiyle, yerleri sembolle gösteririz.', visual: img('pencil') },
      { kind: 'oncesi-ani-sonrasi', title: 'Öncesi, Anı, Sonrası', icon: 'calendar', total: 4, meb: 'HB.3.5.3', gen: srt('Bunu afetten önce mi, afet anında mı, sonra mı yaparız?', 'Çanta öncesi, sakin kalmak anında, toplanma alanına gitmek sonrasındadır.', AFET_BINS, AFET_ITEMS), ders: 'Afetlerde yapılacakları üç grupta sınıflandırırız: afet öncesi, afet anı ve afet sonrası.', visual: img('calendar') },
      { kind: 'afette-dogru', title: 'Afette Doğru Davranış', icon: 'shield', total: T, meb: 'HB.3.5.3', gen: ch(AFETAN_Q), ders: 'Afet anında önce sakin oluruz. AFAD önerisi: Depremde çök, kapan, tutun. Hazırlıklı olursak güvende kalırız.', points: ['Sakin ol', 'AFAD önerisi: Çök, kapan, tutun', 'Selde yükseğe çık'], visual: img('shield') },
      { kind: 'afet-cantasi', title: 'Afet Çantası', icon: 'backpack', total: 4, meb: 'HB.3.5.3', gen: pop('Afet çantasına girenleri patlat!', 'Su, yiyecek, el feneri, düdük, ilk yardım çantası, radyo ve battaniye.', CANTA_HIT, CANTA_WRONG, CANTA_IMG), ders: 'Afet çantası yardım gelene kadar ihtiyaçlarımızı karşılar. Düzenli kontrol ederiz.', visual: img('backpack') },
      { kind: 'afet-sonrasi', title: 'Adım Adım Güvende', icon: 'walking', total: 4, meb: 'HB.3.5.3', gen: ord(AFETSONRA_O), ders: 'Sakin kalır, güvende olduğumuzdan emin olur, çantamızı alır ve toplanma alanına gideriz.', visual: img('walking') },
      { kind: 'afet-labirenti', title: 'Afet Labirenti', icon: 'checkered', total: T, meb: 'HB.3.5.3', gen: tf(AFET_TF, 'shield'), ders: 'Afetlere hazırlıklı olmak hayat kurtarır.', visual: img('checkered') },
      { kind: 'surdurulebilir', title: 'Sürdürülebilir Uygulamalar', icon: 'recycle', total: 4, meb: 'HB.3.5.4', gen: mt('Uygulamayı çevreye katkısıyla eşleştir.', 'Her uygulama dünyamızı korur.', SURDUR_P), ders: 'Geri dönüşüm, tasarruf, ağaçlandırma, güneş paneli, yeşil çatı ve elektrikli araçlar çevreyi korur.', visual: img('recycle') },
      { kind: 'cevre-dostu-mu', title: 'Çevre Dostu mu?', icon: 'earth', total: 4, meb: 'HB.3.5.4', gen: srt('Bu davranış çevre dostu mu?', 'Fidan dikmek çevre dostu, suyu boşa akıtmak zararlıdır.', CEVRE_BINS, CEVRE_ITEMS), ders: 'Çevremizde sürdürülebilirliğe zarar veren sorunlara karşı duyarlı oluruz.', visual: img('earth') },
      { kind: 'keremin-baraji', title: 'Çevresel Sürdürülebilirlik', icon: 'water2', total: T, meb: 'HB.3.5.4', gen: ch(SURDUR_Q), ders: 'Sürdürülebilirlik bir şeyin uzun süre devam etmesidir. Kerem’in şehri su tasarrufu yapınca barajlar yeniden doldu.', points: ['Kaynaklar sınırlı', 'Tasarruf et', 'Hepimizin görevi'], visual: img('water2') },
      { kind: 'surdurulebilirlik-dy', title: 'Yeşil Dünya Doğru mu?', icon: 'seedling', total: T, meb: 'HB.3.5.4', gen: tf(SURDUR_TF, 'earth'), ders: 'Dünyamız bize atalarımızdan miras kaldı. Onu gelecek nesillere güzel bırakırız.', visual: img('seedling') },
      { kind: 'oyun-yesil-ada', title: 'Yeşil Ada Görevi', icon: 'island', total: OYUN, meb: 'HB.3.5.4', oyun: true, gen: karma(ch(DOGA_Q), ch(YON_Q), ch(AFETAN_Q), ch(SURDUR_Q), tf(KROKI_TF)), ders: 'Fındık adayı keşfediyor! Doğa, kroki, afet ve çevre sorularıyla adayı yeşert.', visual: img('island') },
      { kind: 'oyun-hazirlikli-ada', title: 'Hazırlıklı Ada', icon: 'backpack', total: 4, meb: 'HB.3.5.3', oyun: true, gen: rot(srt('Öncesi, anı, sonrası?', 'Afet hazırlığı.', AFET_BINS, AFET_ITEMS), pop('Afet çantasına girenleri patlat!', 'Çantadakiler.', CANTA_HIT, CANTA_WRONG, CANTA_IMG), mem('Doğa kartlarını eşleştir!', 'Doğadaki varlıklar ve katkıları.', DOGA_P)), ders: 'Adayı afetlere hazırla, doğayı tanı!', visual: img('backpack') },
    ],
  },
  {
    id: 'a6',
    no: 6,
    title: 'Bilim, Teknoloji ve Sanat',
    color: '#8e6cf0',
    dark: '#5d3fc0',
    icon: 'scientist',
    acts: [
      { kind: 'zamanda-yolculuk', title: 'Zamanda Yolculuk', icon: 'hourglass', total: 4, meb: 'HB.3.6.1', gen: srt('Burcu’nun rüyası: bu çok eskiden mi, bugün mü?', 'Horozla uyanmak eskiden, çalar saatle uyanmak bugündür.', ZAMAN_BINS, ZAMAN_ITEMS), ders: 'İcatlar ve bilimsel gelişmeler olmasaydı hayatımız çok zor olurdu.', visual: img('hourglass') },
      { kind: 'bilimin-izinde', title: 'Bilimin İzinde', icon: 'microscope', total: T, meb: 'HB.3.6.1', gen: ch(BILIM_Q), ders: 'Bilim, çevremizi daha iyi anlamamızı ve hayatımızı kolaylaştırmamızı sağlar.', points: ['Aşı korur', 'Uydular bilgi toplar', 'Erken uyarı önlem aldırır'], visual: img('microscope') },
      { kind: 'gelisme-etkisi', title: 'Gelişme ve Etkisi', icon: 'satellite', total: 4, meb: 'HB.3.6.1', gen: mt('Bilimsel gelişmeyi hayatımıza etkisiyle eşleştir.', 'Bilimsel gelişmeler hayatımızı kolaylaştırır.', GELISME_P), ders: 'Depreme dayanıklı binalar, uydular, aşılar ve tarım makineleri bilimin ürünüdür.', visual: img('satellite') },
      { kind: 'bilim-labirenti', title: 'Bilim Labirenti', icon: 'checkered', total: T, meb: 'HB.3.6.1', gen: tf(BILIM_TF, 'testtube'), ders: 'Doğru cümleyi seç, çıkışa ulaş!', visual: img('checkered') },
      { kind: 'gozlugun-hikayesi', title: 'Gözlüğün Hikâyesi', icon: 'glasses', total: 4, meb: 'HB.3.6.1', gen: ord(GOZLUK_O), ders: 'Eskiden kuvars taşıyla yazı büyütülürdü. Gözlük zamanla gelişip saplı hâle geldi.', visual: img('glasses') },
      { kind: 'eskiden-bugun', title: 'Eskiden ve Bugün', icon: 'phone', total: 4, meb: 'HB.3.6.2', gen: mt('Eskisini bugünküyle eşleştir.', 'Teknoloji geliştikçe ürünler değişir.', ESKI_P), ders: 'Eskiden tebeşirle yazardık, bugün akıllı tahtaya parmağımızla yazıyoruz.', visual: img('phone') },
      { kind: 'teknoloji-nerede', title: 'Teknoloji Nerede?', icon: 'gear', total: 4, meb: 'HB.3.6.2', gen: srt('Bu teknoloji hangi alanda kullanılır?', 'Akıllı tahta eğitimde, navigasyon ulaşımda, MR sağlıkta kullanılır.', ALAN_BINS, ALAN_ITEMS), ders: 'Teknoloji eğitim, ulaşım, iletişim ve sağlıkta hayatımızı kolaylaştırır.', visual: img('gear') },
      { kind: 'yararli-zararli', title: 'Yararı mı, Zararı mı?', icon: 'balance', total: 4, meb: 'HB.3.6.2', gen: srt('Bu, teknolojinin yararı mı, yanlış kullanımın zararı mı?', 'Hızlı araştırma yararıdır; dijital bağımlılık yanlış kullanımın zararıdır.', YARAR_BINS, YARAR_ITEMS), ders: 'Teknolojiyi doğru kullanmazsak olumsuz etkilerini görebiliriz.', visual: img('balance') },
      { kind: 'teknoloji-bilgisi', title: 'Teknolojinin Etkisi', icon: 'laptop', total: T, meb: 'HB.3.6.2', gen: rot(ch(TEKNO_Q), tf(TEKNO_TF, 'laptop')), ders: 'Teknoloji hızla gelişir. Kullanım amacına ve süresine dikkat ederiz; dijital ayak izimizi unutmayız.', points: ['5G: yeni nesil', 'EBA ve karekod', 'Dijital ayak izi'], visual: img('laptop') },
      { kind: 'akilli-kullanim', title: 'Akıllı Kullanım', icon: 'hourglass2', total: 4, meb: 'HB.3.6.2', gen: pop('Teknolojiyi doğru kullanma yollarını patlat!', 'Süreye dikkat eder, mola verir, amacına göre kullanırız.', AKILLI_HIT, AKILLI_WRONG, AKILLI_IMG), ders: 'Uzun süre ekran başında kalmak göz ve uyku sağlığımızı etkileyebilir.', visual: img('hourglass2') },
      { kind: 'sanatci-kartlari', title: 'Sanatçı Kartları', icon: 'palette', total: 4, meb: 'HB.3.6.3', gen: mt('Sanatçıyı eseriyle eşleştir.', 'Sanatçılar eserleriyle sanata katkı sağlar.', SANATCI_P), ders: 'Van Gogh Yıldızlı Gece’yi, Leonardo da Vinci Mona Lisa’yı yaptı.', visual: img('palette') },
      { kind: 'sanat-dali', title: 'Sanat Dalı Sepetleri', icon: 'theater', total: 4, meb: 'HB.3.6.3', gen: srt('Bu sanatçı hangi sanat dalında çalıştı?', 'Neşet Ertaş müzikte, Van Gogh resimde, Afife Jale tiyatroda.', DAL_BINS, DAL_ITEMS), ders: 'Sanatçı; resim, müzik, tiyatro, edebiyat ya da mimaride eser verir.', visual: img('theater') },
      { kind: 'ben-kimim', title: 'Ben Kimim?', icon: 'thinking', total: T, meb: 'HB.3.6.3', gen: ch(KIM_Q), ders: 'Sanatçı; güzel sanatların bir dalında eser veren, sahne alan, eseri yorumlayan kişidir.', points: ['Muzaffer Sarısözen: türküler', 'Afife Jale: tiyatro', 'Barış Manço: müzik'], visual: img('thinking') },
      { kind: 'sanatcilar-ne-katar', title: 'Sanatçılar Ne Katar?', icon: 'sparkles', total: 4, meb: 'HB.3.6.3', gen: rot(pop('Sanatçıların katkılarını patlat!', 'Hayal gücü, duygular, kültür, güzel çevre ve yeni bakış açıları.', KATKI_HIT, KATKI_WRONG), tf(SANAT_TF, 'palette')), ders: 'Sanatçılar hayal gücümüzü geliştirir, kültürümüzü gelecek nesillere taşır.', visual: img('sparkles') },
      { kind: 'poster', title: 'Sanatçı Posteri', icon: 'framed', total: 4, meb: 'HB.3.6.3', gen: ord(POSTER_O), ders: 'Güvenilir kaynaktan bilgi toplar, doğruluğunu kontrol eder ve posterimizi hazırlarız.', visual: img('framed') },
      { kind: 'oyun-bilim-sanat-fuari', title: 'Bilim ve Sanat Fuarı', icon: 'trophy', total: OYUN, meb: 'HB.3.6.1', oyun: true, gen: karma(ch(BILIM_Q), tf(BILIM_TF), ch(TEKNO_Q), ch(KIM_Q), ord(GOZLUK_O)), ders: 'Fındık fuarı geziyor! Her standa bir bilim, teknoloji ya da sanat sorusu var.', visual: img('trophy') },
      { kind: 'oyun-muze-hafizasi', title: 'Müze Hafızası', icon: 'classical', total: 4, meb: 'HB.3.6.3', oyun: true, gen: rot(mem('Sanatçı kartlarını eseriyle eşleştir!', 'Sanatçılar ve eserleri.', SANATCI_P), srt('Eğitim, ulaşım mı, sağlık mı?', 'Teknoloji alanları.', ALAN_BINS, ALAN_ITEMS), ord(GOZLUK_O)), ders: 'Müzede eserleri eşleştir, teknolojiyi tanı!', visual: img('classical') },
    ],
  },
]
