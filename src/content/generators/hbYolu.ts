/**
 * HAYAT BİLGİSİ YOLU — 1. sınıf Hayat Bilgisi ders kitabının 6 öğrenme alanı, her alan bir "ada":
 * konu konu sıralı etkinlikler + sonda oyunlar. Kaynak: docs/meb-kitaplar/analiz/hayat-bilgisi-1.md
 * İçerik kitabın öğrettiği bilgilerin özgün özetidir (kitap metni kopyalanmadı).
 * Hassas konular (§5): kişisel bilgi istenmez, 112 dışında gerçek acil numara çeldirici olmaz,
 * afetler korkutmadan anlatılır, aile görevlerinde cinsiyet kalıbı yok (Büyükler / Çocuklar / Hep birlikte),
 * yıl verilmez (program: 1. sınıf 1000'den büyük sayı bilmez).
 */
import { sort, type Gen } from './helpers'
import type { SortQ } from '../../games/quiz/types'
import { ch, img, karma, mem, mt, ord, pop, rot, srt, tf, type Act, type Alan, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

/* ================================================================================================
 * 1. ÖĞRENME ALANI · BEN VE OKULUM
 * ================================================================================================ */
const TANISMA_TF: TF[] = [
  ['Tanışırken karşımızdakinin gözüne bakarız.', true, 'Göz teması kurmak ona değer verdiğimizi gösterir.'],
  ['Önce “Merhaba” der, sonra adımızı söyleriz.', true, 'Kibar bir tanışma böyle başlar.'],
  ['Arkadaşımın sözünü kesip kendimi tanıtırım.', false, 'Konuşan kişinin sözünü bitirmesini bekleriz.'],
  ['Biri kendini tanıtırken yanımdakiyle konuşurum.', false, 'Kendini tanıtan kişiyi dikkatle dinleriz.'],
  ['Tanışırken nazik davranırım.', true, 'Nezaket yeni arkadaşlıkların anahtarıdır.'],
  ['Kendimi tanıtırken fısıldarım.', false, 'Karşımızdakinin duyabileceği bir sesle konuşuruz.'],
  ['Öğretmenim kendini tanıtırken onu dinlerim.', true, 'Dinlemek saygı göstermektir.'],
  ['Tanışırken tokalaşabiliriz.', true, 'Elimizi uzatıp tokalaşmak güzel bir selamlaşmadır.'],
  ['Yeni arkadaşımla ortak yönlerimizi bulabiliriz.', true, 'Ortak sevdiğimiz oyunlar bizi yakınlaştırır.'],
  ['Tanışırken arkamı dönerim.', false, 'Karşımızdakine dönük durur, gülümseriz.'],
]
const TANISMA_Q: Q[] = [
  { q: 'Yeni bir arkadaşla tanışırken ilk ne deriz?', a: 'Merhaba!', w: ['Hoşça kal!', 'Afiyet olsun!', 'Geçmiş olsun!'], ex: 'Tanışmaya “Merhaba!” diyerek başlarız.', img: 'wave2' },
  { q: 'Tanışmanın sonunda ne diyebiliriz?', a: 'Tanıştığımıza memnun oldum.', w: ['Beni rahatsız etme.', 'Sonra konuşuruz.', 'Kimsin sen?'], ex: '“Tanıştığımıza memnun oldum.” kibar bir sözdür.', img: 'handshake' },
  { q: 'Arkadaşının adını öğrenmek için ne sorarsın?', a: 'Senin adın ne?', w: ['Kaç yaşındasın?', 'Neredesin?', 'Ne yiyorsun?'], ex: 'Adını öğrenmek için “Senin adın ne?” diye sorarız.', img: 'thinking' },
  { q: 'Kendimizi tanıtırken neyi söyleyebiliriz?', a: 'Sevdiğimiz oyunları', w: ['Arkadaşımızın sırlarını', 'Başkasının adresini', 'Hiçbir şeyi'], ex: 'Adımızı ve sevdiğimiz oyunları, sporları anlatabiliriz.', img: 'ball' },
  { q: 'Konuşan kişiye nasıl davranırız?', a: 'Sözünü bitirmesini bekleriz', w: ['Sözünü keseriz', 'Başka yere bakarız', 'Bağırırız'], ex: 'Sözünü kesmeden, dikkatle dinleriz.', img: 'ear' },
  { q: 'Tanışırken karşımızdakiyle ne kurarız?', a: 'Göz teması', w: ['Kule', 'Sırt teması', 'Oyuncak ev'], ex: 'Konuşurken göz teması kurarız.', img: 'eye' },
]
const TANISMA_O: O[] = [
  { q: 'Tanışma adımlarını sırala.', s: ['Gözüne bak, gülümse', '“Merhaba” de', 'Adını ve soyadını söyle', '“Senin adın ne?” diye sor', '“Tanıştığımıza memnun oldum” de'], ex: 'Önce selam, sonra tanıtma, en son güzel bir dilek.', img: 'handshake' },
]

const OKUL_Q: Q[] = [
  { q: 'Ders zili çaldı. Nereye gideriz?', a: 'Sınıfa', w: ['Kantine', 'Bahçeye', 'Eve'], ex: 'Zil çalınca derse, sınıfımıza gideriz.', img: 'bell' },
  { q: 'Kitap ödünç almak için okulda nereye gideriz?', a: 'Kütüphaneye', w: ['Kantine', 'Tuvalete', 'Bahçeye'], ex: 'Kütüphanede kitap okur, ödünç alırız.', img: 'books' },
  { q: 'Ellerimizi yıkamak için nereye gideriz?', a: 'Tuvalete, lavaboya', w: ['Kütüphaneye', 'Müdür odasına', 'Sınıfa'], ex: 'Ellerimizi lavaboda sabunla yıkarız.', img: 'soap' },
  { q: 'Okulun yönetiminden kim sorumludur?', a: 'Müdür', w: ['Öğrenci', 'Kantinci', 'Veli'], ex: 'Müdür ve müdür yardımcısı okulu yönetir.', img: 'school' },
  { q: 'Bilgi ve beceri kazanmamıza kim rehberlik eder?', a: 'Öğretmen', w: ['Şoför', 'Aşçı', 'Postacı'], ex: 'Öğretmenimiz öğrenmemize yardım eder.', img: 'teacher' },
  { q: 'Okulun temiz ve düzenli olması için kim çalışır?', a: 'Yardımcı personel', w: ['Müdür', 'Ressam', 'Pilot'], ex: 'Yardımcı personel okulumuzu temiz ve güvenli tutar.', img: 'broom' },
  { q: 'Şeref köşesi sınıfta nerededir?', a: 'Yazı tahtasının üstünde', w: ['Kapının arkasında', 'Sıraların altında', 'Pencerenin dışında'], ex: 'Şeref köşesi yazı tahtasının üstünde yer alır.', img: 'trflag' },
  { q: 'Okulda karnımız acıkınca bir şey almak için nereye gideriz?', a: 'Kantine', w: ['Kütüphaneye', 'Müdür odasına', 'Tuvalete'], ex: 'Kantinde sırayla yiyecek alırız.', img: 'sandwich' },
  { q: 'Öğretmenler ders aralarında nerede dinlenir?', a: 'Öğretmenler odasında', w: ['Kantinde', 'Bahçede', 'Kütüphanede'], ex: 'Öğretmenler odası öğretmenlerimizin odasıdır.', img: 'teacher' },
]
const OKUL_P: P[] = [
  ['Müdür', 'Okulu yönetir', 'school'],
  ['Öğretmen', 'Bize öğretir', 'teacher'],
  ['Yardımcı personel', 'Okulu temiz tutar', 'broom'],
  ['Kütüphane', 'Kitap okuruz', 'books'],
  ['Sınıf', 'Ders yaparız', 'pencil'],
  ['Lavabo', 'Elimizi yıkarız', 'soap'],
  ['Kantin', 'Yiyecek alırız', 'sandwich'],
]
const SEREF_HIT = ['Türk bayrağı', 'Atatürk portresi', 'İstiklâl Marşı', 'Gençliğe Hitabe']
const SEREF_WRONG = ['Saat', 'Takvim', 'Dünya haritası', 'Çiçek resmi', 'Oyuncak', 'Ders programı']
const ARAC_HIT = ['Kalem', 'Silgi', 'Defter', 'Kitap', 'Cetvel', 'Makas', 'Yazı tahtası']
const ARAC_WRONG = ['Yastık', 'Tava', 'Top', 'Diş fırçası', 'Şemsiye']
const ARAC_IMG: Record<string, string> = { Kalem: 'pencil', Defter: 'notebook', Kitap: 'book', Cetvel: 'ruler', Makas: 'scissors', 'Yazı tahtası': 'memo', Yastık: 'bed', Top: 'ball', 'Diş fırçası': 'toothbrush', Şemsiye: 'umbrella', Silgi: 'crayon', Tava: 'egg3' }

const KURAL_TF: TF[] = [
  ['Derste söz almak için parmak kaldırırız.', true, 'Söz hakkı alarak konuşuruz.'],
  ['Koridorda koşarız.', false, 'Koridorda koşmayız, yürürüz.'],
  ['Kantinde sıramızı sabırla bekleriz.', true, 'Sıraya girer, sıramızı bekleriz.'],
  ['Arkadaşımın kalemini sormadan alırım.', false, 'Başkasının eşyasını izin isteyerek kullanırız.'],
  ['Çöplerimizi çöp kutusuna atarız.', true, 'Sınıfımızı ve okulumuzu temiz tutarız.'],
  ['Merdivenden koşarak ineriz.', false, 'Merdivende dikkatli oluruz, koşmayız.'],
  ['Derse zamanında gireriz.', true, 'Zamanında gelmek kuraldır.'],
  ['Sıraların üstüne çizeriz.', false, 'Okul eşyalarını özenle kullanırız.'],
  ['Oyunlarda sıramızı bekleriz.', true, 'Oyunların da kuralları vardır.'],
  ['Öğretmen konuşurken arkadaşımla sohbet ederim.', false, 'Dersi dikkatle dinleriz.'],
  ['Sınıf kurallarını birlikte belirleriz.', true, 'Kurallar herkesin hakkını korur.'],
  ['Okula istediğim saatte gelirim.', false, 'Okula zamanında geliriz.'],
]
const KURAL_ITEMS: SortQ['items'] = [
  { label: 'Söz alarak konuş', img: 'raisedhand', bin: 'sinif' },
  { label: 'Dersi dikkatle dinle', img: 'ear', bin: 'sinif' },
  { label: 'Derse zamanında gir', img: 'bell', bin: 'sinif' },
  { label: 'Koridorda koşma', img: 'running', bin: 'okul' },
  { label: 'Kantinde sıra bekle', img: 'sandwich', bin: 'okul' },
  { label: 'Merdivende dikkatli ol', img: 'walking', bin: 'okul' },
  { label: 'Okula zamanında gel', img: 'school', bin: 'okul' },
  { label: 'Çöpü çöp kutusuna at', img: 'wastebasket', bin: 'ikisi' },
  { label: 'Eşyaları özenle kullan', img: 'backpack', bin: 'ikisi' },
  { label: 'Ortamı temiz tut', img: 'broom', bin: 'ikisi' },
]

const DUYGU_P: P[] = [
  ['Mutlu', '😊', 'happy'],
  ['Üzgün', '😢', 'sad'],
  ['Kızgın', '😠', 'angry'],
  ['Korkmuş', '😨', 'scared'],
  ['Şaşkın', '😲', 'surprised'],
  ['Uykulu', '😴', 'sleepy'],
]
const DUYGU_MEM: P[] = [
  ['Mutlu', 'Sevinçli yüz', undefined, 'happy'],
  ['Üzgün', 'Ağlayan yüz', undefined, 'sad'],
  ['Kızgın', 'Kızgın yüz', undefined, 'angry'],
  ['Korkmuş', 'Korkan yüz', undefined, 'scared'],
  ['Şaşkın', 'Şaşıran yüz', undefined, 'surprised'],
  ['Düşünceli', 'Düşünen yüz', undefined, 'thinking'],
]
const FACE = { Mutlu: 'happy', Üzgün: 'sad', Heyecanlı: 'grin', Şaşkın: 'surprised', Kızgın: 'angry', Korkmuş: 'scared' }
const DUYGU_Q: Q[] = [
  { q: 'Öğretmenin resmini panoya astı. Nasıl hissedersin?', a: 'Mutlu', w: ['Üzgün', 'Kızgın', 'Korkmuş'], ex: 'Emeğimiz görülünce mutlu oluruz.', o: FACE },
  { q: 'Sevdiğin arkadaşın başka okula gidecek. Nasıl hissedersin?', a: 'Üzgün', w: ['Mutlu', 'Heyecanlı', 'Şaşkın'], ex: 'Ayrılık bizi üzebilir. Bu çok normaldir.', o: FACE },
  { q: 'Bayramda şiir okuyacaksın. Nasıl hissedebilirsin?', a: 'Heyecanlı', w: ['Kızgın', 'Üzgün', 'Korkmuş'], ex: 'Sahneye çıkmadan önce heyecanlanırız.', o: FACE },
  { q: 'Ödünç aldığın oyuncak yanlışlıkla kırıldı. Nasıl hissedersin?', a: 'Üzgün', w: ['Mutlu', 'Heyecanlı', 'Şaşkın'], ex: 'Üzülebiliriz. Özür dileyip durumu anlatırız.', o: FACE },
  { q: 'Okula çocuk tiyatrosu gelecek! Nasıl hissedersin?', a: 'Mutlu', w: ['Kızgın', 'Üzgün', 'Korkmuş'], ex: 'Güzel bir haber bizi sevindirir.', o: FACE },
  { q: 'Kapıyı açınca bir sürpriz parti gördün! Nasıl hissedersin?', a: 'Şaşkın', w: ['Kızgın', 'Üzgün', 'Korkmuş'], ex: 'Sürprizler bizi şaşırtır ve sevindirir.', o: FACE },
  { q: 'Arkadaşın kalemini izinsiz aldı. Nasıl hissedebilirsin?', a: 'Kızgın', w: ['Mutlu', 'Heyecanlı', 'Şaşkın'], ex: 'Kızabiliriz. Ama sakin bir sesle konuşarak çözeriz.', o: FACE },
]
const DEDEKTIF: Q[] = [
  { q: 'Çocuk gözlük takıyor ve saçı kıvırcık. Hangisi?', a: 'Gözlüklü, kıvırcık saçlı', w: ['Gözlüksüz, düz saçlı', 'Gözlüklü, düz saçlı', 'Gözlüksüz, kıvırcık saçlı'], ex: 'İki ipucu birlikte doğru olmalı.', img: 'glasses' },
  { q: 'Çocuğun saçı uzun ve gözleri yeşil. Hangisi?', a: 'Uzun saçlı, yeşil gözlü', w: ['Kısa saçlı, yeşil gözlü', 'Uzun saçlı, kahverengi gözlü', 'Kısa saçlı, mavi gözlü'], ex: 'İpuçlarını tek tek kontrol ederiz.', img: 'eye' },
  { q: 'Çocuğun saçı sarı değil ve gözlük takmıyor. Hangisi?', a: 'Siyah saçlı, gözlüksüz', w: ['Sarı saçlı, gözlüksüz', 'Siyah saçlı, gözlüklü', 'Sarı saçlı, gözlüklü'], ex: '“Değil” diyen ipucu o özelliği eler.', img: 'detective' },
  { q: 'Hangisi fiziksel özelliğimiz değildir?', a: 'Sevdiğimiz yemek', w: ['Saç rengimiz', 'Göz rengimiz', 'Boyumuz'], ex: 'Saç, göz rengi ve boy fiziksel özelliklerdir.', img: 'thinking' },
  { q: 'Büyüdükçe hangimiz değişir?', a: 'Boyumuz uzar', w: ['Adımız değişir', 'Hiçbir şey değişmez', 'Kısalırız'], ex: 'Büyürken boyumuz uzar, kilomuz artar.', img: 'ruler' },
]
const BOY_O: O[] = [
  { q: 'Ayça Meltem’den kısa, Zehra’dan uzun. Kısadan uzuna sırala.', s: ['Zehra', 'Ayça', 'Meltem'], ex: 'Zehra en kısa, Meltem en uzun.', img: 'ruler' },
  { q: 'Can Ece’den uzun, Ece de Ali’den uzun. Kısadan uzuna sırala.', s: ['Ali', 'Ece', 'Can'], ex: 'Ali en kısa, Can en uzun.', img: 'ruler' },
  { q: 'Deniz en uzun, Mert en kısa, Elif ortada. Kısadan uzuna sırala.', s: ['Mert', 'Elif', 'Deniz'], ex: 'Kısadan uzuna: Mert, Elif, Deniz.', img: 'ruler' },
]

/* ================================================================================================
 * 2. ÖĞRENME ALANI · SAĞLIĞIM VE GÜVENLİĞİM
 * ================================================================================================ */
const BESIN: SortQ['items'] = [
  { label: 'Süt', img: 'milk', bin: 'her' },
  { label: 'Elma', img: 'apple', bin: 'her' },
  { label: 'Muz', img: 'banana', bin: 'her' },
  { label: 'Havuç', img: 'carrot', bin: 'her' },
  { label: 'Yumurta', img: 'egg', bin: 'her' },
  { label: 'Ekmek', img: 'bread', bin: 'her' },
  { label: 'Peynir', img: 'cheese', bin: 'her' },
  { label: 'Brokoli', img: 'broccoli', bin: 'her' },
  { label: 'Salata', img: 'salad', bin: 'her' },
  { label: 'Şeker', img: 'candy', bin: 'ara' },
  { label: 'Lolipop', img: 'lollipop', bin: 'ara' },
  { label: 'Gazlı içecek', img: 'soda', bin: 'ara' },
  { label: 'Patates kızartması', img: 'fries', bin: 'ara' },
  { label: 'Çikolata', img: 'chocolate', bin: 'ara' },
  { label: 'Donut', img: 'donut', bin: 'ara' },
]
const SAGLIK_TF: TF[] = [
  ['Kahvaltımızı yaparız, öğün atlamayız.', true, 'Güne güçlü başlamak için kahvaltı önemlidir.'],
  ['Geç saatlere kadar uyanık kalırız.', false, 'Akşam erken yatar, yeterli uyuruz.'],
  ['Yemeklerden sonra dişlerimizi fırçalarız.', true, 'Dişlerimiz böyle sağlıklı kalır.'],
  ['Her gün bolca abur cubur yeriz.', false, 'Abur cuburdan uzak dururuz.'],
  ['Düzenli olarak spor yaparız.', true, 'Spor vücudumuzu güçlendirir.'],
  ['Yemekten önce ellerimizi yıkarız.', true, 'Temiz eller mikropları uzak tutar.'],
  ['Tırnaklarımızın temizliğine dikkat ederiz.', true, 'Kişisel bakım sağlığımızı korur.'],
  ['Açıkta satılan yiyecekleri hiç düşünmeden alırız.', false, 'Açıkta satılan yiyecekler midemizi bozabilir.'],
  ['Banyo yapar, saçlarımızı tararız.', true, 'Kişisel bakımımıza özen gösteririz.'],
  ['Su yerine hep gazlı içecek içeriz.', false, 'Susayınca su içeriz.'],
]
const BAKIM_HIT = ['Diş fırçala', 'El yıka', 'Banyo yap', 'Saçını tara', 'Erken uyu', 'Spor yap', 'Su iç']
const BAKIM_WRONG = ['Öğün atla', 'Geç yat', 'Hep şeker ye', 'Elini yıkama']
const BAKIM_IMG: Record<string, string> = { 'Diş fırçala': 'toothbrush', 'El yıka': 'soap', 'Banyo yap': 'bathtub', 'Saçını tara': 'sparkles', 'Erken uyu': 'bed', 'Spor yap': 'running', 'Su iç': 'droplet', 'Öğün atla': 'plate', 'Geç yat': 'moon', 'Hep şeker ye': 'candy', 'Elini yıkama': 'microbe' }
const GUN_O: O[] = [
  { q: 'Sağlıklı bir sabahı sırala.', s: ['Uyan', 'Elini yüzünü yıka', 'Kahvaltı yap', 'Dişlerini fırçala', 'Okula git'], ex: 'Temizlik, kahvaltı, diş fırçalama ve okul!', img: 'sunrise' },
  { q: 'Ellerimizi yıkarken adımları sırala.', s: ['Musluğu aç, elini ıslat', 'Sabunla köpürt', 'İyice ovala', 'Durula', 'Kurula'], ex: 'Sabunla ovalamak mikropları temizler.', img: 'soap' },
  { q: 'Akşam yatmadan önce sırala.', s: ['Akşam yemeği ye', 'Dişlerini fırçala', 'Pijamanı giy', 'Erken yat'], ex: 'Yeterli uyku büyümemize yardım eder.', img: 'bed' },
]

const KISISEL_TF: TF[] = [
  ['Kişisel alan, kendimizi rahat ve güvende hissettiğimiz alandır.', true, 'Çevremizde görünmez bir çember gibidir.'],
  ['İstemediğim bir şeyde “Hayır!” diyebilirim.', true, 'Hayır demek hakkımızdır.'],
  ['Adresimi tanımadığım kişilere söylerim.', false, 'Kişisel bilgilerimizi tanımadığımız kişilere vermeyiz.'],
  ['Rahatsız olursam güvendiğim bir büyüğe söylerim.', true, 'Güvendiğimiz büyüklerimiz bize yardım eder.'],
  ['Arkadaşımın çantasını izinsiz karıştırırım.', false, 'Başkalarının eşyasına izinle dokunuruz.'],
  ['Arkadaşlarıma lakap takarım.', false, 'Lakap takmak kişisel alana saygısızlıktır.'],
  ['Başkalarının kişisel alanına da saygı gösteririm.', true, 'Saygı karşılıklıdır.'],
  ['Fotoğraflarımı herkesle paylaşırım.', false, 'Fotoğraflarımızı herkesle paylaşmayız.'],
  ['Biri izin almadan çok yaklaşırsa rahatsız olabilirim.', true, 'Bu duygumuz önemlidir, büyüğümüze söyleriz.'],
]
const KISISEL_Q: Q[] = [
  { q: 'Tanımadığın biri adını ve adresini soruyor. Ne yaparsın?', a: 'Söylemem, büyüğüme haber veririm', w: ['Hemen söylerim', 'Kâğıda yazıp veririm', 'Telefonumu da veririm'], ex: 'Kişisel bilgilerimizi tanımadığımız kişilere vermeyiz.', img: 'shield' },
  { q: 'Sırada arkadaşın çok yakın duruyor, rahatsız oldun. Ne yaparsın?', a: 'Kibarca biraz uzaklaşmasını isterim', w: ['Onu iterim', 'Bağırarak ağlarım', 'Hiç ses çıkarmam, üzülürüm'], ex: 'Duygumuzu kibarca söyleriz. Gerekirse öğretmene anlatırız.', img: 'raisedhand' },
  { q: 'Arkadaşların ailenle ilgili özel bir şeyi ısrarla soruyor. Ne yaparsın?', a: 'Paylaşmak istemediğimi söylerim', w: ['Her şeyi anlatırım', 'Onlara kızarım', 'Yalan söylerim'], ex: 'Neyi kimle paylaşacağımızı biz seçeriz.', img: 'shush' },
  { q: 'İstemediğin bir davranış devam ediyor. Kime söylersin?', a: 'Güvendiğim bir büyüğe', w: ['Hiç kimseye', 'Tanımadığım birine', 'Oyuncağıma'], ex: 'Güvendiğimiz bir büyüğe mutlaka söyleriz.', img: 'hug' },
  { q: 'Kişisel alanımızı neye benzetebiliriz?', a: 'Görünmez bir çembere', w: ['Bir ağaca', 'Bir yağmura', 'Bir topa'], ex: 'Çevremizde görünmez bir çember gibi düşünebiliriz.', img: 'shield' },
]
const CEMBER: SortQ['items'] = [
  { label: 'Annem', img: 'woman', bin: 'ic' },
  { label: 'Babam', img: 'man', bin: 'ic' },
  { label: 'Kardeşim', img: 'baby', bin: 'ic' },
  { label: 'Dedem', img: 'oldman', bin: 'ic' },
  { label: 'Ninem', img: 'oldwoman', bin: 'ic' },
  { label: 'Yakın arkadaşım', img: 'friends', bin: 'ic' },
  { label: 'Tanımadığım kişi', img: 'person', bin: 'dis' },
  { label: 'Sokakta biri', img: 'walking', bin: 'dis' },
  { label: 'Telefonda yabancı', img: 'telephone', bin: 'dis' },
]

const TRAFIK_ITEMS: SortQ['items'] = [
  { label: 'Emniyet kemerini tak', img: 'seat', bin: 'yolcu' },
  { label: 'Arka koltukta otur', img: 'car', bin: 'yolcu' },
  { label: 'Şoförün dikkatini dağıtma', img: 'bus', bin: 'yolcu' },
  { label: 'Kemeri yolda çıkarma', img: 'seat', bin: 'yolcu' },
  { label: 'Yaya geçidini kullan', img: 'crossing', bin: 'yaya' },
  { label: 'Alt ya da üst geçitten geç', img: 'traffic2', bin: 'yaya' },
  { label: 'Sola, sağa, sola bak', img: 'eye', bin: 'yaya' },
  { label: 'Kırmızıda dur', img: 'vtraffic', bin: 'yaya' },
]
const TRAFIK_TF: TF[] = [
  ['Yaya ışığı kırmızı yanınca dururuz.', true, 'Kırmızı dur, yeşil geç demektir.'],
  ['Yaya ışığı yeşil yanınca geçeriz.', true, 'Yine de sağa sola bakarak geçeriz.'],
  ['Karşıya geçerken yalnızca sağa bakmak yeter.', false, 'Önce sola, sonra sağa, sonra tekrar sola bakarız.'],
  ['Arabada emniyet kemerimizi takarız.', true, 'Kemer bizi korur.'],
  ['Arabada ön koltukta otururuz.', false, 'Çocuklar arka koltukta oturur.'],
  ['Servis şoförüyle sohbet ederiz.', false, 'Sürücünün dikkatini dağıtmayız.'],
  ['Yaya geçidi olan yerde yaya geçidinden geçeriz.', true, 'Yaya geçidi yayalar içindir.'],
  ['Yolda koşarak karşıya geçeriz.', false, 'Kontrollü ve dikkatli geçeriz.'],
  ['Trafik kuralları bizi güvende tutar.', true, 'Kurallara uyulmazsa kaza olabilir.'],
]
const TRAFIK_Q: Q[] = [
  { q: 'Yaya ışığında hangi renkte dururuz?', a: 'Kırmızı', w: ['Yeşil', 'Mavi', 'Mor'], ex: 'Kırmızı ışıkta dururuz.', img: 'vtraffic', o: { Kırmızı: 'stopsign', Yeşil: 'clover', Mavi: 'droplet', Mor: 'grapes' } },
  { q: 'Yaya ışığında hangi renkte geçeriz?', a: 'Yeşil', w: ['Kırmızı', 'Mavi', 'Mor'], ex: 'Yeşil ışıkta, sağa sola bakarak geçeriz.', img: 'vtraffic', o: { Kırmızı: 'stopsign', Yeşil: 'clover', Mavi: 'droplet', Mor: 'grapes' } },
  { q: 'Karşıya geçmeden önce ilk hangi yöne bakarız?', a: 'Sola', w: ['Yukarı', 'Aşağı', 'Arkaya'], ex: 'Sola, sağa, sonra tekrar sola bakarız.', img: 'eye' },
  { q: 'Trafikte yürüyen kişiye ne denir?', a: 'Yaya', w: ['Yolcu', 'Sürücü', 'Pilot'], ex: 'Yürüyen kişi yayadır.', img: 'walking' },
  { q: 'Otobüste giden kişiye ne denir?', a: 'Yolcu', w: ['Yaya', 'Polis', 'Pilot'], ex: 'Araçla yolculuk eden kişi yolcudur.', img: 'bus' },
  { q: 'Arabada bizi koruyan nedir?', a: 'Emniyet kemeri', w: ['Oyuncak', 'Şemsiye', 'Yastık'], ex: 'Emniyet kemerini takarız, yolda çıkarmayız.', img: 'seat' },
]
const KARSI_O: O[] = [
  { q: 'Karşıya geçme adımlarını sırala.', s: ['Kaldırımda dur', 'Sola bak', 'Sağa bak', 'Tekrar sola bak', 'Araç yoksa dikkatle geç'], ex: 'Sol, sağ, sol! Araç yoksa geçeriz.', img: 'crossing' },
  { q: 'Arabaya binince sırala.', s: ['Arka koltuğa otur', 'Emniyet kemerini tak', 'Yolda sakin otur', 'Araç durunca in'], ex: 'Kemer yolculuk boyunca takılı kalır.', img: 'car' },
]

const ACIL_P: P[] = [
  ['Kalabalıkta kayboldum', 'Görevli ya da polis', 'walking', 'policeofficer'],
  ['Okulda düştüm', 'Öğretmenim', 'bandage', 'teacher'],
  ['Evde gaz kokusu var', 'Aile büyüğüm', 'fire', 'oldwoman'],
  ['Alışveriş merkezinde kayboldum', 'Güvenlik görevlisi', 'store', 'policecar'],
  ['Teneffüste arkadaşım düştü', 'Öğretmen', 'school', 'teacher'],
]
const ACIL_ITEMS: SortQ['items'] = [
  { label: 'Merdivende düşüp kalkamamak', img: 'bandage', bin: 'acil' },
  { label: 'Mutfakta gaz kokusu', img: 'fire', bin: 'acil' },
  { label: 'Kalabalıkta kaybolmak', img: 'walking', bin: 'acil' },
  { label: 'İki aracın çarpışması', img: 'ambulance', bin: 'acil' },
  { label: 'Karın ağrısı ve mide bulantısı', img: 'thermometer2', bin: 'acil' },
  { label: 'Oyuncağın pili bitti', img: 'battery2', bin: 'degil' },
  { label: 'Kalemin ucu kırıldı', img: 'pencil', bin: 'degil' },
  { label: 'Yağmur yağıyor', img: 'rain', bin: 'degil' },
  { label: 'Sevdiğim çizgi film bitti', img: 'television', bin: 'degil' },
]
const ACIL_Q: Q[] = [
  { q: 'Acil Çağrı Merkezi’nin numarası hangisi?', a: '112', w: ['123', '321', '213'], ex: 'Acil durumda 1-1-2’yi ararız.', img: 'telephone' },
  { q: 'Acil bir durumda önce ne yaparız?', a: 'Sakin kalmaya çalışırız', w: ['Saklanırız', 'Hiçbir şey yapmayız', 'Koşup kaçarız'], ex: 'Önce sakin kalır, sonra yardım isteriz.', img: 'happy' },
  { q: 'Evde acil bir durum olursa kimden yardım isteriz?', a: 'Aile büyüklerimizden', w: ['Oyuncağımızdan', 'Evcil hayvanımızdan', 'Hiç kimseden'], ex: 'Evdeysek aile büyüklerimizden yardım isteriz.', img: 'oldwoman' },
  { q: 'Okulda acil bir durum olursa kimden yardım isteriz?', a: 'Öğretmenimizden', w: ['Kantinden', 'Kimseden', 'Kalemimizden'], ex: 'Okulda öğretmenimizden yardım isteriz.', img: 'teacher' },
  { q: 'Hangisi acil durumdur?', a: 'Kaybolmak', w: ['Ödevi bitirmek', 'Oyun oynamak', 'Kitap okumak'], ex: 'Kaybolmak hemen yardım gereken bir durumdur.', img: 'siren' },
  { q: 'Acil durum için neyi bilmeliyiz?', a: 'Adresimizi ve büyüğümüzün telefonunu', w: ['Sevdiğimiz şarkıyı', 'Arkadaşımızın oyuncağını', 'Hiçbir şeyi'], ex: 'Adresimizi ve aile büyüğümüzün telefon numarasını biliriz.', img: 'house' },
]
const ACIL_O: O[] = [
  { q: 'Acil bir durumda ne yaparız? Sırala.', s: ['Sakin kal', 'Bir büyüğe haber ver', 'Gerekirse 112’yi arasınlar'], ex: 'Sakin ol, büyüğüne söyle, gerekirse 112.', img: 'siren' },
  { q: 'Kalabalıkta kaybolursan sırala.', s: ['Olduğun yerde dur, sakin ol', 'Bir görevli bul', 'Büyüğünün adını ve telefonunu söyle'], ex: 'Görevliler ailemizi bulmamıza yardım eder.', img: 'policeofficer' },
]

/* ================================================================================================
 * 3. ÖĞRENME ALANI · AİLEM VE TOPLUM
 * ================================================================================================ */
const AILE_ITEMS: SortQ['items'] = [
  { label: 'Anne, baba, çocuk', img: 'houses', bin: 'cekirdek' },
  { label: 'Anne, baba, iki kardeş', img: 'house', bin: 'cekirdek' },
  { label: 'Baba ve iki çocuğu', img: 'man', bin: 'cekirdek' },
  { label: 'Anne ve kızı', img: 'woman', bin: 'cekirdek' },
  { label: 'Anne, baba, çocuk ve dede', img: 'oldman', bin: 'genis' },
  { label: 'Anne, baba, çocuk ve nine', img: 'oldwoman', bin: 'genis' },
  { label: 'Anneanne ve dedeyle yaşayan aile', img: 'housegarden', bin: 'genis' },
  { label: 'Teyzeyle birlikte yaşayan aile', img: 'hug', bin: 'genis' },
]
const AILE_TF: TF[] = [
  ['Aile, toplumun en küçük birliğidir.', true, 'Toplum ailelerden oluşur.'],
  ['Arkadaşlarımız aile bireyimizdir.', false, 'Arkadaşlarımızı severiz ama onlar ailemiz değildir.'],
  ['Aile bireyleri birbirine saygı gösterir.', true, 'Saygı ve sevgi aileyi bir arada tutar.'],
  ['Bizimle yaşayan dede ve nine geniş aileyi oluşturur.', true, 'Anne, baba ve çocuklar dışında biri varsa geniş ailedir.'],
  ['Ailemizde kendimizi güvende hissederiz.', true, 'Aile bize güç ve güven verir.'],
  ['Ailede herkesin yeteneği aynıdır.', false, 'Biri şarkı söyler, biri resim yapar. Herkes farklıdır.'],
  ['Bayramlarda ailece bir araya geliriz.', true, 'Bayramlar aileyi bir araya getirir.'],
]
const DEGER_HIT = ['Sevgi', 'Şefkat', 'Saygı', 'Anlayış', 'Fedakârlık', 'Birlik', 'Yardımlaşma']
const DEGER_WRONG = ['Kıskançlık', 'Bencillik', 'Kavga', 'Kırgınlık', 'Yalan']
const DEGER_IMG: Record<string, string> = { Sevgi: 'heart', Şefkat: 'hug', Saygı: 'handshake', Anlayış: 'ear', Fedakârlık: 'gift', Birlik: 'friends', Yardımlaşma: 'clap', Kıskançlık: 'angry', Bencillik: 'noentry', Kavga: 'angry', Kırgınlık: 'sad', Yalan: 'thumbsdown' }
const AILECE_Q: Q[] = [
  { q: 'Anne, baba ve çocuklardan oluşan aileye ne denir?', a: 'Çekirdek aile', w: ['Geniş aile', 'Sınıf', 'Takım'], ex: 'Çekirdek aile anne, baba ve çocuklardan oluşur.', img: 'house' },
  { q: 'Dedesi ve ninesi de birlikte yaşayan aileye ne denir?', a: 'Geniş aile', w: ['Çekirdek aile', 'Komşu', 'Sınıf'], ex: 'Başka aile büyükleri de varsa geniş ailedir.', img: 'housegarden' },
  { q: 'Hangisi ailece yapılan güzel bir etkinliktir?', a: 'Birlikte oyun oynamak', w: ['Kimseyle konuşmamak', 'Odaya kapanmak', 'Kavga etmek'], ex: 'Ailece oyun oynar, masal dinler, sohbet ederiz.', img: 'puzzle' },
  { q: 'Ailemizden biri hastalanınca ne yaparız?', a: 'Onunla ilgileniriz', w: ['Gürültü yaparız', 'Onu yalnız bırakırız', 'Hiç sormayız'], ex: 'Hasta olan aile bireyiyle ilgileniriz.', img: 'thermometer2' },
]

const NEZAKET_P: P[] = [
  ['Sabah uyanınca', 'Günaydın', 'sunrise'],
  ['Yemek bitince, yemeği yapana', 'Elinize sağlık', 'forkplate'],
  ['Yemek yiyen birine', 'Afiyet olsun', 'bowl'],
  ['Bir şey isterken', 'Lütfen', 'raisedhand'],
  ['Yardım ya da hediye alınca', 'Teşekkür ederim', 'gift'],
  ['Biri hastalanınca', 'Geçmiş olsun', 'thermometer2'],
  ['Bir hata yapınca', 'Özür dilerim', 'sad'],
]
const NEZAKET_Q: Q[] = [
  { q: 'Kardeşinin silgisini istiyorsun. Ne dersin?', a: 'Silgini alabilir miyim, lütfen?', w: ['Ver şu silgiyi!', 'Silgini aldım.', 'Silgi benim.'], ex: 'Bir şey isterken “lütfen” deriz.', img: 'crayon' },
  { q: 'Baban kahvaltı hazırlıyor. Ona ne dersin?', a: 'Günaydın!', w: ['İyi geceler!', 'Hoşça kal!', 'Afiyet olsun!'], ex: 'Sabah “Günaydın” deriz.', img: 'sunrise' },
  { q: 'Ablan ödevinde sana yardım etti. Ne dersin?', a: 'Teşekkür ederim!', w: ['Hadi git!', 'Günaydın!', 'Afiyet olsun!'], ex: 'Yardım alınca teşekkür ederiz.', img: 'clap' },
  { q: 'Annen hasta. Ona ne dersin?', a: 'Geçmiş olsun!', w: ['Afiyet olsun!', 'Günaydın!', 'Elinize sağlık!'], ex: 'Hasta birine “Geçmiş olsun” der, yardım ederiz.', img: 'thermometer2' },
  { q: 'Dedenin pişirdiği yemeği bitirdin. Ne dersin?', a: 'Elinize sağlık!', w: ['Geçmiş olsun!', 'İyi geceler!', 'Lütfen!'], ex: 'Yemeği yapana “Elinize sağlık” deriz.', img: 'forkplate' },
  { q: 'Kardeşinin odasına girmek istiyorsun. Ne yaparsın?', a: 'Kapıyı çalıp izin isterim', w: ['Hemen dalarım', 'Kapıyı tekmelerim', 'Bağırırım'], ex: 'Odalara girerken kapıyı çalar, izin isteriz.', img: 'key2' },
]
const GORGU_TF: TF[] = [
  ['Ablamın odasına istediğim zaman girerim.', false, 'Kapıyı çalar, izin isteriz.'],
  ['Yemekte çatal, kaşık ve peçete kullanırım.', true, 'Sofra görgü kuralıdır.'],
  ['Sofraya birlikte oturur, birlikte kalkarız.', true, 'Sofrada aile birlikte olur.'],
  ['Anneme “Saçımı topla!” diye emrederim.', false, '“Lütfen saçımı toplar mısın?” deriz.'],
  ['Aile büyüklerimin eşyalarını izin alarak kullanırım.', true, 'İzin almak saygıdır.'],
  ['Yemeğimi üstüme dökmemeye dikkat ederim.', true, 'Dikkatli ve düzenli yeriz.'],
  ['Büyüklerimiz konuşurken sürekli araya gireriz.', false, 'Büyüklerimize saygılı oluruz.'],
]
const SOFRA_O: O[] = [
  { q: 'Sofra adımlarını sırala.', s: ['Ellerini yıka', 'Sofrayı birlikte kur', 'Hep birlikte otur', 'Afiyetle ye', '“Elinize sağlık” de', 'Sofrayı birlikte topla'], ex: 'Sofrayı birlikte kurar, birlikte toplarız.', img: 'forkplate' },
]

const GOREV_ITEMS: SortQ['items'] = [
  { label: 'Oyuncakları toplamak', img: 'teddy', bin: 'cocuk' },
  { label: 'Yatağını toplamak', img: 'bed', bin: 'cocuk' },
  { label: 'Çiçekleri sulamak', img: 'plantpot', bin: 'cocuk' },
  { label: 'Evcil hayvana su vermek', img: 'cat', bin: 'cocuk' },
  { label: 'Çantasını hazırlamak', img: 'backpack', bin: 'cocuk' },
  { label: 'Faturaları ödemek', img: 'banknote', bin: 'buyuk' },
  { label: 'Ocakta yemek pişirmek', img: 'egg3', bin: 'buyuk' },
  { label: 'Araba kullanmak', img: 'car', bin: 'buyuk' },
  { label: 'Sofrayı kurmak', img: 'forkplate', bin: 'hep' },
  { label: 'Evi temizlemek', img: 'broom', bin: 'hep' },
  { label: 'Bahçe işleri', img: 'seedling', bin: 'hep' },
  { label: 'Alışveriş yapmak', img: 'cart', bin: 'hep' },
]
const GOREV_TF: TF[] = [
  ['Ailede iş bölümü düzeni sağlar.', true, 'Herkes biraz yapınca iş kolaylaşır.'],
  ['Ailedeki tüm sorumluluklar yalnızca bir kişiye aittir.', false, 'Görevleri paylaşırız.'],
  ['Herkes üzerine düşen görevi yapmalıdır.', true, 'Böylece aile yaşamı düzenli olur.'],
  ['Her ailede iş bölümü farklıdır.', true, 'Her aile kendine göre paylaşır.'],
  ['Evdeki tüm işleri büyükler yapar.', false, 'Çocukların da yapabileceği işler vardır.'],
  ['Evde çocukların da yapabileceği işler vardır.', true, 'Oyuncak toplamak, çiçek sulamak gibi.'],
  ['Her ailede iş bölümü aynıdır.', false, 'Aileler görevleri farklı paylaşabilir.'],
]
const TAKIM_HIT = ['İşler hızlı biter', 'Ev düzenli olur', 'Sevgi artar', 'Birbirimize zaman kalır', 'Birlik olur']
const TAKIM_WRONG = ['Ev dağılır', 'Herkes yorulur', 'Kavga çıkar', 'İşler uzar']
const TAKIM_MEM: P[] = [
  ['Çiçek sulamak', 'Saksı', undefined, 'plantpot'],
  ['Oyuncak toplamak', 'Oyuncak ayı', undefined, 'teddy'],
  ['Kediyi beslemek', 'Kedi', undefined, 'cat'],
  ['Sofrayı kurmak', 'Tabak', undefined, 'forkplate'],
  ['Yatağı toplamak', 'Yatak', undefined, 'bed'],
  ['Evi süpürmek', 'Süpürge', undefined, 'broom'],
]

/* ================================================================================================
 * 4. ÖĞRENME ALANI · YAŞADIĞIM YER VE ÜLKEM
 * ================================================================================================ */
const ULKE_P: P[] = [
  ['Ülkemizin adı', 'Türkiye Cumhuriyeti', 'globe'],
  ['Başkentimiz', 'Ankara', 'classical'],
  ['Para birimimiz', 'Türk lirası (₺)', 'banknote'],
  ['Denizlerimizden biri', 'Akdeniz', 'wave'],
  ['Anıtkabir', 'Ankara’dadır', 'classical'],
]
const ULKE_Q: Q[] = [
  { q: 'Ülkemizin başkenti neresidir?', a: 'Ankara', w: ['Bursa', 'Trabzon', 'Van'], ex: 'Başkentimiz Ankara’dır.', img: 'classical' },
  { q: 'Ülkemizin adı nedir?', a: 'Türkiye Cumhuriyeti', w: ['Ankara', 'Akdeniz', 'Türk lirası'], ex: 'Ülkemizin adı Türkiye Cumhuriyeti’dir.', img: 'trflag' },
  { q: 'Para birimimiz nedir?', a: 'Türk lirası', w: ['Altın', 'Kuruşluk taş', 'Pul'], ex: 'Para birimimiz Türk lirasıdır, sembolü ₺.', img: 'banknote' },
  { q: 'Ülkemizin kaç tarafı denizlerle çevrilidir?', a: 'Üç', w: ['Bir', 'İki', 'Dört'], ex: 'Ülkemizin üç tarafı denizlerle çevrilidir.', img: 'map' },
  { q: 'Hangisi denizlerimizden biridir?', a: 'Karadeniz', w: ['Van Gölü', 'Pamukkale', 'Anıtkabir'], ex: 'Denizlerimiz: Akdeniz, Karadeniz, Ege ve Marmara.', img: 'wave' },
  { q: 'Pamukkale hangi şehrimizdedir?', a: 'Denizli', w: ['Van', 'Hatay', 'Bolu'], ex: 'Pamukkale Denizli’de bir doğal güzelliktir.', img: 'mountain' },
  { q: 'Künefe hangi şehrimizin lezzetidir?', a: 'Hatay', w: ['Trabzon', 'Bolu', 'Van'], ex: 'Künefe Hatay’ın yöresel tatlısıdır.', img: 'cake' },
]
const DENIZ_HIT = ['Akdeniz', 'Karadeniz', 'Ege Denizi', 'Marmara Denizi']
const DENIZ_WRONG = ['Van Gölü', 'Kızılırmak', 'Pamukkale', 'Anıtkabir', 'Ulu Cami']
const SEHIR_P: P[] = [
  ['Künefe', 'Hatay', 'cake'],
  ['Hamsi tava', 'Trabzon', 'fish'],
  ['Pamukkale', 'Denizli', 'mountain'],
  ['Van Gölü', 'Van', 'wave'],
  ['Ulu Cami', 'Bursa', 'mosque'],
  ['Anıtkabir', 'Ankara', 'classical'],
  ['Kaşık oyunu', 'Bolu', 'music'],
]
const YER_ITEMS: SortQ['items'] = [
  { label: 'Sümela Manastırı', img: 'classical', bin: 'tarihi' },
  { label: 'Bursa Ulu Cami', img: 'mosque', bin: 'tarihi' },
  { label: 'Trabzon Atatürk Köşkü', img: 'house', bin: 'tarihi' },
  { label: 'Anıtkabir', img: 'classical', bin: 'tarihi' },
  { label: 'Pamukkale', img: 'mountain', bin: 'dogal' },
  { label: 'Van Gölü', img: 'wave', bin: 'dogal' },
  { label: 'Ormanlar', img: 'evergreen', bin: 'dogal' },
  { label: 'Künefe', img: 'cake', bin: 'yiyecek' },
  { label: 'Hamsi tava', img: 'fish', bin: 'yiyecek' },
  { label: 'Kuymak', img: 'cheese', bin: 'yiyecek' },
]

const BAYRAK_ITEMS: SortQ['items'] = [
  { label: 'Kırmızı zemin, beyaz ay yıldız', img: 'trflag', bin: 'bayrak' },
  { label: 'Ona al sancak deriz', img: 'trflag', bin: 'bayrak' },
  { label: 'Okulda bayrak töreni yapılır', img: 'school', bin: 'bayrak' },
  { label: 'Sözlerini Mehmet Âkif Ersoy yazdı', img: 'scroll', bin: 'mars' },
  { label: 'Törenlerde coşkuyla söylenir', img: 'music', bin: 'mars' },
  { label: 'Okunurken hazır olda dururuz', img: 'person', bin: 'mars' },
  { label: 'Bağımsızlığımızın sembolüdür', img: 'star', bin: 'ikisi' },
  { label: 'Ülkemizin önemli bir değeridir', img: 'heart', bin: 'ikisi' },
]
const BAYRAK_Q: Q[] = [
  { q: 'Bayrağımızın rengi nedir?', a: 'Kırmızı zemin, beyaz ay yıldız', w: ['Mavi zemin, sarı yıldız', 'Yeşil zemin, beyaz ay', 'Sarı zemin, kırmızı yıldız'], ex: 'Bayrağımız kırmızı zemin üzerinde beyaz ay ve yıldızdır.', img: 'trflag' },
  { q: 'Millî marşımızın adı nedir?', a: 'İstiklâl Marşı', w: ['Ninni', 'Doğum Günü Şarkısı', 'Bayram Şarkısı'], ex: 'Millî marşımız İstiklâl Marşı’dır.', img: 'music' },
  { q: 'İstiklâl Marşı’nın sözlerini kim yazdı?', a: 'Mehmet Âkif Ersoy', w: ['Zübeyde Hanım', 'Ali Rıza Bey', 'Alper Gezeravcı'], ex: 'Sözleri Mehmet Âkif Ersoy yazdı.', img: 'scroll' },
  { q: 'İstiklâl Marşı okunurken nasıl dururuz?', a: 'Hazır olda, saygıyla', w: ['Oturarak, konuşarak', 'Koşarak', 'Dans ederek'], ex: 'Marş okunurken hazır olda, saygıyla dururuz.', img: 'person' },
  { q: 'İstiklâl Marşı hangi gün kabul edildi?', a: '12 Mart', w: ['29 Ekim', '23 Nisan', '19 Mayıs'], ex: '12 Mart’ta Türkiye Büyük Millet Meclisi kabul etti.', img: 'calendar' },
  { q: 'Bayrağımıza başka hangi ad verilir?', a: 'Al sancak', w: ['Mavi yelken', 'Yeşil şerit', 'Sarı kurdele'], ex: 'Bayrağımıza sancak, al sancak, hilâl de denir.', img: 'trflag' },
]
const MARS_HIT = ['Bağımsızlık', 'Mehmet Âkif Ersoy', 'Kırmızı', 'Ay yıldız', 'Millî marş', 'Hazır ol']
const MARS_WRONG = ['Mavi', 'Güneş', 'Dünya', 'Uçurtma', 'Dondurma']

const ATA_P: P[] = [
  ['Annesi', 'Zübeyde Hanım', 'woman'],
  ['Babası', 'Ali Rıza Bey', 'man'],
  ['Doğduğu yer', 'Selanik', 'house'],
  ['Hayata gözlerini kapadığı yer', 'Dolmabahçe Sarayı', 'castle'],
  ['Anıt mezarı', 'Anıtkabir', 'classical'],
  ['En sevdiği ders', 'Matematik', 'abacus'],
]
const ATA_Q: Q[] = [
  { q: 'Mustafa Kemal Atatürk nerede doğdu?', a: 'Selanik’te', w: ['Ankara’da', 'Samsun’da', 'Van’da'], ex: 'Atatürk Selanik’te, pembe boyalı bir evde doğdu.', img: 'house' },
  { q: 'Atatürk’ün ortaokulda en sevdiği ders hangisiydi?', a: 'Matematik', w: ['Beden eğitimi', 'Müzik', 'Resim'], ex: 'Zor matematik sorularını çözene kadar uğraşırdı.', img: 'abacus' },
  { q: 'Atatürk neyi kurdu?', a: 'Cumhuriyetimizi', w: ['Bir oyuncakçı', 'Bir lunapark', 'Bir hayvanat bahçesi'], ex: 'Atatürk Cumhuriyetimizin kurucusudur.', img: 'trflag' },
  { q: 'Atatürk 23 Nisan’ı kimlere armağan etti?', a: 'Çocuklara', w: ['Öğretmenlere', 'Sporculara', 'Askerlere'], ex: '23 Nisan’ı çocuklara armağan etti.', img: 'balloon' },
  { q: 'Atatürk 19 Mayıs’ı kimlere armağan etti?', a: 'Gençlere', w: ['Bebeklere', 'Dedelere', 'Hayvanlara'], ex: '19 Mayıs’ı gençlere armağan etti.', img: 'running' },
  { q: 'Anıtkabir hangi şehrimizdedir?', a: 'Ankara', w: ['İstanbul', 'Selanik', 'Samsun'], ex: 'Anıtkabir başkentimiz Ankara’dadır.', img: 'classical' },
  { q: 'Atatürk’ü andığımız gün hangisidir?', a: '10 Kasım', w: ['23 Nisan', '30 Ağustos', '29 Ekim'], ex: '10 Kasım’da Atatürk’ü saygıyla anarız.', img: 'calendar' },
]
const ATA_HIT = ['Kitap okumak', 'Bilim', 'Sanat', 'Spor', 'Doğa', 'Vatanı', 'Matematik']
const ATA_WRONG = ['Tembellik', 'Dağınıklık', 'Kavga', 'Yalan']
const ATA_O: O[] = [
  { q: 'Atatürk’ün hayatını sırala.', s: ['Selanik’te pembe bir evde doğdu', 'Okulda matematiği çok sevdi', '19 Mayıs’ta Samsun’a gitti', 'Cumhuriyeti kurdu', 'Anıtkabir’de yatıyor'], ex: 'Doğumdan Cumhuriyet’e, Atatürk’ün hayat yolu.', img: 'calendar' },
]

const BAYRAM_P: P[] = [
  ['23 Nisan', 'Meclis açıldı, çocuk bayramı', 'balloon'],
  ['19 Mayıs', 'Atatürk Samsun’a gitti', 'ship'],
  ['29 Ekim', 'Cumhuriyet ilan edildi', 'trflag'],
  ['30 Ağustos', 'Zafer kazanıldı', 'medal'],
  ['15 Temmuz', 'Millî birlik günü', 'heart'],
]
const BAYRAM_Q: Q[] = [
  { q: 'Sınıfımızı bayraklarla süsledik, Cumhuriyetimizi kutladık. Hangi gün?', a: '29 Ekim', w: ['23 Nisan', '19 Mayıs', '30 Ağustos'], ex: '29 Ekim Cumhuriyet Bayramı’dır.', img: 'trflag' },
  { q: 'Atatürk’ün çocuklara armağan ettiği bayram hangisi?', a: '23 Nisan', w: ['29 Ekim', '30 Ağustos', '19 Mayıs'], ex: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’dır.', img: 'balloon' },
  { q: 'Samsun’da gençler koşu yaptı. Hangi bayram?', a: '19 Mayıs', w: ['23 Nisan', '29 Ekim', '30 Ağustos'], ex: '19 Mayıs Gençlik ve Spor Bayramı’dır.', img: 'running' },
  { q: 'Millî Mücadele zaferle bitti. Hangi bayram?', a: '30 Ağustos', w: ['23 Nisan', '19 Mayıs', '29 Ekim'], ex: '30 Ağustos Zafer Bayramı’dır.', img: 'medal' },
  { q: 'Millî bayramlarda nasıl hissederiz?', a: 'Coşkulu ve sevinçli', w: ['Kızgın', 'Uykulu', 'Sıkılmış'], ex: 'Bayramlarda coşku, sevinç ve heyecan duyarız.', o: { 'Coşkulu ve sevinçli': 'grin', Kızgın: 'angry', Uykulu: 'sleepy', Sıkılmış: 'sad' } },
  { q: '15 Temmuz bir bayram mıdır, millî gün müdür?', a: 'Millî gündür', w: ['Dinî bayramdır', 'Doğum günüdür', 'Tatil günüdür'], ex: '15 Temmuz Demokrasi ve Millî Birlik Günü’dür. Şehitlerimizi saygıyla anarız.', img: 'heart' },
]
const BAYRAM_ITEMS: SortQ['items'] = [
  { label: '29 Ekim Cumhuriyet Bayramı', img: 'trflag', bin: 'milli' },
  { label: '23 Nisan Çocuk Bayramı', img: 'balloon', bin: 'milli' },
  { label: '19 Mayıs Gençlik ve Spor Bayramı', img: 'running', bin: 'milli' },
  { label: '30 Ağustos Zafer Bayramı', img: 'medal', bin: 'milli' },
  { label: 'Ramazan Bayramı', img: 'candy2', bin: 'dini' },
  { label: 'Kurban Bayramı', img: 'gift', bin: 'dini' },
]
const DINI_HIT = ['Büyükleri ziyaret', 'El öpmek', 'İkram', 'Şeker', 'Bayramlık', 'Yardımlaşma', 'Tebrik kartı', 'Bayram temizliği']
const DINI_WRONG = ['Geçit töreni', 'Karne günü', 'Okul servisi', 'Ödev']
const DINI_IMG: Record<string, string> = { 'Büyükleri ziyaret': 'oldwoman', 'El öpmek': 'hug', İkram: 'teapot', Şeker: 'candy2', Bayramlık: 'tshirt', Yardımlaşma: 'handshake', 'Tebrik kartı': 'memo', 'Bayram temizliği': 'broom', 'Geçit töreni': 'trflag', 'Karne günü': 'book', 'Okul servisi': 'bus', Ödev: 'pencil' }
const DINI_Q: Q[] = [
  { q: 'Hangileri dinî bayramlarımızdır?', a: 'Ramazan ve Kurban Bayramı', w: ['23 Nisan ve 19 Mayıs', '29 Ekim ve 30 Ağustos', 'Yılbaşı ve doğum günü'], ex: 'Dinî bayramlarımız Ramazan ve Kurban Bayramı’dır.', img: 'gift' },
  { q: 'Bayramdan önce ne yapabiliriz?', a: 'Bayram temizliği', w: ['Eşyaları dağıtmak', 'Kimseyi aramamak', 'Ödevi saklamak'], ex: 'Bayram temizliği yapar, ikram hazırlarız.', img: 'broom' },
  { q: 'Uzaktaki yakınlarımızı bayramda nasıl sevindiririz?', a: 'Arar ya da kart göndeririz', w: ['Hiç aramayız', 'Onlara kızarız', 'Unuturuz'], ex: 'Arar ya da tebrik kartı göndeririz.', img: 'telephone' },
  { q: '“El öpenleriniz çok olsun!” ne zaman söylenir?', a: 'Bayramlarda', w: ['Okulun ilk gününde', 'Yağmur yağınca', 'Uyumadan önce'], ex: 'Bu güzel söz bir bayram dileğidir.', img: 'hug' },
  { q: 'Bayramda misafirlerimize ne yaparız?', a: 'İkram ederiz', w: ['Kapıyı açmayız', 'Onları göndeririz', 'Saklanırız'], ex: 'Misafirlerimize ikram eder, sohbet ederiz.', img: 'teapot' },
]

/* ================================================================================================
 * 5. ÖĞRENME ALANI · DOĞA VE ÇEVRE
 * ================================================================================================ */
const CANLI_ITEMS: SortQ['items'] = [
  { label: 'Kuş', img: 'bird', bin: 'canli' },
  { label: 'Ağaç', img: 'tree', bin: 'canli' },
  { label: 'Çiçek', img: 'flower', bin: 'canli' },
  { label: 'Kedi', img: 'cat', bin: 'canli' },
  { label: 'Arı', img: 'bee', bin: 'canli' },
  { label: 'Kaplumbağa', img: 'turtle', bin: 'canli' },
  { label: 'Mantar', img: 'mushroom', bin: 'canli' },
  { label: 'Taş', img: 'stone', bin: 'cansiz' },
  { label: 'Su', img: 'droplet', bin: 'cansiz' },
  { label: 'Bulut', img: 'cloud', bin: 'cansiz' },
  { label: 'Kaya', img: 'rock', bin: 'cansiz' },
  { label: 'Dağ', img: 'mountain', bin: 'cansiz' },
]
const DOGA_HIT = ['Kuş', 'Yaprak', 'Kelebek', 'Taş', 'Ağaç', 'Çiçek', 'Uğur böceği']
const DOGA_WRONG = ['Top', 'Şişe', 'Araba', 'Telefon', 'Kalem']
const DOGA_IMG: Record<string, string> = { Kuş: 'bird', Yaprak: 'leaf', Kelebek: 'butterfly', Taş: 'stone', Ağaç: 'tree', Çiçek: 'flower', 'Uğur böceği': 'ladybug', Top: 'ball', Şişe: 'soda', Araba: 'car', Telefon: 'phone', Kalem: 'pencil' }
const RENK_ITEMS: SortQ['items'] = [
  { label: 'Gökyüzü', img: 'cloudsun', bin: 'mavi' },
  { label: 'Deniz', img: 'wave', bin: 'mavi' },
  { label: 'Su damlası', img: 'droplet', bin: 'mavi' },
  { label: 'Yaprak', img: 'leaf', bin: 'yesil' },
  { label: 'Kaktüs', img: 'cactus', bin: 'yesil' },
  { label: 'Kurbağa', img: 'frog', bin: 'yesil' },
  { label: 'Yonca', img: 'clover', bin: 'yesil' },
  { label: 'Güneş', img: 'sun', bin: 'diger' },
  { label: 'Gül', img: 'rose', bin: 'diger' },
  { label: 'Ayçiçeği', img: 'sunflower', bin: 'diger' },
]
const GEZI_TF: TF[] = [
  ['Doğa gezisinde çiçekleri koparırız.', false, 'Bitki koparmaz, sadece gözlemleriz.'],
  ['Hayvanları rahatsız etmeyiz.', true, 'Doğadaki canlılara merhametle davranırız.'],
  ['Çöplerimizi yere atarız.', false, 'Çöplerimizi yanımıza alır, çöp kutusuna atarız.'],
  ['Gözlemimizi resim çizerek kaydedebiliriz.', true, 'Not alabilir, resim çizebilir, fotoğraf çekebiliriz.'],
  ['Biz insanlar da doğanın bir parçasıyız.', true, 'Doğayı tanır, sever ve koruruz.'],
  ['Gözlemden önce neyi merak ettiğimizi belirleriz.', true, 'Merak ettiğimizi bilirsek daha iyi gözlem yaparız.'],
  ['Ağaçların dallarını kırarız.', false, 'Doğadaki varlıklara zarar vermeyiz.'],
]

const GOK_TF: TF[] = [
  ['Güneş, Dünya ve Ay’ın şekli topa benzer.', true, 'Üçü de top gibi yuvarlaktır.'],
  ['Ay, Güneş’ten büyüktür.', false, 'Ay üçünün en küçüğüdür.'],
  ['Güneş üçünün en büyüğüdür.', true, 'Güneş, Dünya’dan da Ay’dan da büyüktür.'],
  ['Gece gökyüzünde Güneş’i görürüz.', false, 'Güneş’i gündüz görürüz.'],
  ['Ay’ı daha çok geceleri görürüz.', true, 'Ay gece gökyüzünde parlar.'],
  ['Dünya, Ay’dan küçüktür.', false, 'Dünya, Ay’dan büyüktür.'],
  ['Biz Dünya’nın üzerinde yaşarız.', true, 'Dünya bizim gök cismimizdir.'],
]
const GOK_Q: Q[] = [
  { q: 'Üzerinde yaşadığımız gök cismi hangisi?', a: 'Dünya', w: ['Ay', 'Güneş', 'Yıldız'], ex: 'Dünya’da yaşarız.', o: { Dünya: 'earth', Ay: 'fullmoon', Güneş: 'sun', Yıldız: 'star' } },
  { q: 'En büyük gök cismi hangisi?', a: 'Güneş', w: ['Ay', 'Dünya'], ex: 'Güneş, Dünya’dan ve Ay’dan büyüktür.', o: { Dünya: 'earth', Ay: 'fullmoon', Güneş: 'sun' } },
  { q: 'En küçük gök cismi hangisi?', a: 'Ay', w: ['Güneş', 'Dünya'], ex: 'Ay, Güneş’ten ve Dünya’dan küçüktür.', o: { Dünya: 'earth', Ay: 'fullmoon', Güneş: 'sun' } },
  { q: 'Gündüz gökyüzünde parlayan hangisi?', a: 'Güneş', w: ['Ay', 'Yıldız'], ex: 'Güneş’i gündüz görürüz.', o: { Güneş: 'sun', Ay: 'fullmoon', Yıldız: 'star' } },
  { q: '“Dünya’dan büyüğüm, topa benzerim.” Ben kimim?', a: 'Güneş', w: ['Ay', 'Bulut'], ex: 'Dünya’dan büyük olan Güneş’tir.', o: { Güneş: 'sun', Ay: 'fullmoon', Bulut: 'cloud' } },
  { q: '“Geceleri parlarım, üçümüzün en küçüğüyüm.” Ben kimim?', a: 'Ay', w: ['Güneş', 'Dünya'], ex: 'Ay geceleri görünür ve en küçüğüdür.', o: { Dünya: 'earth', Ay: 'fullmoon', Güneş: 'sun' } },
  { q: 'Güneş, Dünya ve Ay’ın şekli neye benzer?', a: 'Topa', w: ['Kutuya', 'Üçgene', 'Kaleme'], ex: 'Üçü de topa benzer.', o: { Topa: 'ball', Kutuya: 'package', Üçgene: 'construction', Kaleme: 'pencil' } },
]
const GOK_O: O[] = [
  { q: 'Büyükten küçüğe sırala.', s: ['Güneş', 'Dünya', 'Ay'], ex: 'Güneş en büyük, Ay en küçük.', img: 'sun' },
  { q: 'Küçükten büyüğe sırala.', s: ['Ay', 'Dünya', 'Güneş'], ex: 'Ay en küçük, Güneş en büyük.', img: 'fullmoon' },
]
const GOK_MEM: P[] = [
  ['Güneş', 'En büyük', 'sun'],
  ['Ay', 'En küçük', 'fullmoon'],
  ['Dünya', 'Üzerinde yaşarız', 'earth'],
  ['Gündüz', 'Güneş görünür', 'sunface'],
  ['Gece', 'Ay görünür', 'crescent'],
]

const AFET_P: P[] = [
  ['Deprem', 'Yerin ani sarsılması', 'house'],
  ['Sel', 'Çok yağmurla gelen su baskını', 'storm'],
  ['Orman yangını', 'Ormanda yayılan yangın', 'fire'],
  ['Çığ', 'Karın dağdan hızla kayması', 'snowflake'],
  ['Heyelan', 'Toprağın yamaçtan kayması', 'mountain'],
]
const AFET_Q: Q[] = [
  { q: 'Kar, yüksek dağdan hızla aşağı kayıyor. Bu hangi afet?', a: 'Çığ', w: ['Sel', 'Deprem', 'Orman yangını'], ex: 'Karın dağdan kaymasına çığ denir.', img: 'snowflake' },
  { q: 'Çok yağmur yağdı, dere taştı. Bu hangi afet?', a: 'Sel', w: ['Çığ', 'Heyelan', 'Deprem'], ex: 'Şiddetli yağmurla gelen su baskını seldir.', img: 'storm' },
  { q: 'Yer aniden sarsıldı. Bu hangi afet?', a: 'Deprem', w: ['Sel', 'Çığ', 'Orman yangını'], ex: 'Yerin ani sarsıntısı depremdir.', img: 'house' },
  { q: 'Toprak ve çamur yamaçtan aşağı kaydı. Bu hangi afet?', a: 'Heyelan', w: ['Sel', 'Çığ', 'Deprem'], ex: 'Toprağın eğimli yerden kayması heyelandır.', img: 'mountain' },
  { q: 'Ormanda ağaçlar yanıyor. Bu hangi afet?', a: 'Orman yangını', w: ['Çığ', 'Sel', 'Heyelan'], ex: 'Orman yangını ağaçlara ve hayvanlara zarar verir.', img: 'fire' },
  { q: 'Afet nedir?', a: 'Çevreye büyük zarar veren olay', w: ['Güzel bir oyun', 'Bir yiyecek', 'Bir bayram'], ex: 'Afet çevreye büyük zarar veren olaydır.', img: 'storm' },
  { q: 'Hangisi orman yangınına yol açabilir?', a: 'Dikkatsizlik', w: ['Kitap okumak', 'Uyumak', 'Şarkı söylemek'], ex: 'Ateşle oynamayız. Büyüklerimiz de dikkatli olur.', img: 'fire' },
  { q: 'Afet Eğitimi Hazırlık Günü hangi gün?', a: '12 Kasım', w: ['23 Nisan', '29 Ekim', '19 Mayıs'], ex: '12 Kasım’da afetlere hazırlığı öğreniriz.', img: 'calendar' },
]
const AFET_HIT = ['Deprem', 'Sel', 'Çığ', 'Heyelan', 'Orman yangını']
const AFET_WRONG = ['Gökkuşağı', 'Bayram', 'Piknik', 'Doğum günü', 'Kar tanesi']
const AFET_IMG: Record<string, string> = { Deprem: 'house', Sel: 'storm', Çığ: 'snowflake', Heyelan: 'mountain', 'Orman yangını': 'fire', Gökkuşağı: 'rainbow', Bayram: 'party', Piknik: 'camping', 'Doğum günü': 'cake', 'Kar tanesi': 'snowman' }

const ATIK_BINS: SortQ['bins'] = [
  { id: 'kagit', label: 'Kâğıt (mavi)', img: 'newspaper', color: '#3b82f6' },
  { id: 'plastik', label: 'Plastik (sarı)', img: 'soda', color: '#facc15' },
  { id: 'cam', label: 'Cam (yeşil)', img: 'jar', color: '#22c55e' },
  { id: 'metal', label: 'Metal (gri)', img: 'can', color: '#9ca3af' },
]
const ATIK: SortQ['items'] = [
  { label: 'Gazete', img: 'newspaper', bin: 'kagit' },
  { label: 'Karton kutu', img: 'package', bin: 'kagit' },
  { label: 'Eski defter', img: 'notebook', bin: 'kagit' },
  { label: 'Pet şişe', img: 'soda', bin: 'plastik' },
  { label: 'Naylon poşet', bin: 'plastik' },
  { label: 'Şişe kapağı', bin: 'plastik' },
  { label: 'Reçel kavanozu', img: 'jar', bin: 'cam' },
  { label: 'Cam bardak', img: 'glass', bin: 'cam' },
  { label: 'Konserve kutusu', img: 'can', bin: 'metal' },
  { label: 'Salça tenekesi', img: 'can', bin: 'metal' },
]
const ATIK2 = (pair: string[]): Gen => (rng, _g, l) => {
  const bins = ATIK_BINS.filter((b) => pair.includes(b.id))
  return sort(rng, { prompt: 'Atıkları doğru geri dönüşüm kutusuna at!', explain: 'Kâğıt mavi, plastik sarı, cam yeşil, metal gri kutuya.', bins, items: ATIK.filter((i) => pair.includes(i.bin)), count: l === 1 ? 4 : 6 })
}
const KUTU_P: P[] = [
  ['Kâğıt', 'Mavi kutu', 'newspaper'],
  ['Plastik', 'Sarı kutu', 'soda'],
  ['Cam', 'Yeşil kutu', 'jar'],
  ['Metal', 'Gri kutu', 'can'],
  ['Pil', 'Kırmızı kutu', 'battery'],
]
const GERI_HIT = ['Gazete', 'Pet şişe', 'Kavanoz', 'Teneke', 'Karton kutu', 'Pil', 'Cam şişe']
const GERI_WRONG = ['Elma kabuğu', 'Kuru yaprak', 'Ekmek kırıntısı', 'Muz kabuğu']
const GERI_IMG: Record<string, string> = { Gazete: 'newspaper', 'Pet şişe': 'soda', Kavanoz: 'jar', Teneke: 'can', 'Karton kutu': 'package', Pil: 'battery', 'Cam şişe': 'glass', 'Elma kabuğu': 'apple', 'Kuru yaprak': 'fallenleaf', 'Ekmek kırıntısı': 'bread', 'Muz kabuğu': 'banana' }
const GERI_TF: TF[] = [
  ['Geri dönüşüm doğanın kirlenmesini önler.', true, 'Kaynaklarımızı da korur.'],
  ['Biten pilleri çöpe atarız.', false, 'Piller kırmızı atık pil kutusuna atılır.'],
  ['Her atık türü ayrı toplanır.', true, 'Kâğıt, plastik, cam ve metal ayrı kutulara.'],
  ['Cam şişe sarı kutuya atılır.', false, 'Cam yeşil kutuya atılır.'],
  ['Gazeteler mavi kutuya atılır.', true, 'Kâğıt atıklar mavi kutuya.'],
  ['İçecek kutusu geri dönüşümle yeni bir kutu olabilir.', true, 'Metal tekrar tekrar kullanılabilir.'],
]

/* ================================================================================================
 * 6. ÖĞRENME ALANI · BİLİM, TEKNOLOJİ VE SANAT
 * ================================================================================================ */
const BILIM_O: O[] = [
  { q: 'Bilim insanı gibi çalış! Adımları sırala.', s: ['Merak et', 'Soru sor', 'Araştır, gözlem ya da deney yap', 'Cevabı bul'], ex: 'Bilim merakla başlar, soruyla devam eder.', img: 'magnifier' },
  { q: 'Balon roket deneyini sırala.', s: ['İpi pipetin içinden geçir', 'Balonu şişir', 'Balonu pipete bantla', 'Balonu bırak'], ex: 'Bırakılan balon ip boyunca ilerler.', img: 'balloon' },
]
const BILIM_Q: Q[] = [
  { q: 'Şişirilmiş balonu ipin üstünde bırakırsak ne olur?', a: 'İp boyunca ilerler', w: ['Hiç kıpırdamaz', 'Ağaca dönüşür', 'Şarkı söyler'], ex: 'Balondan çıkan hava onu ileri iter.', img: 'balloon' },
  { q: 'Suya biraz sıvı yağ dökersek yağ nerede kalır?', a: 'Suyun üstünde', w: ['Suyun dibinde', 'Kaybolur', 'Suya karışır'], ex: 'Su ile yağ karışmaz, yağ üstte kalır.', img: 'droplet' },
  { q: 'Saçımıza sürttüğümüz balonu kâğıt parçalarına yaklaştırırsak ne olur?', a: 'Kâğıtları kendine çeker', w: ['Kâğıtlar ıslanır', 'Balon patlar', 'Hiçbir şey olmaz'], ex: 'Sürtünen balon küçük kâğıtları çeker.', img: 'balloon' },
  { q: 'Mikroskop ne işe yarar?', a: 'Küçük şeyleri büyük gösterir', w: ['Müzik çalar', 'Yemek pişirir', 'Uçar'], ex: 'Mikroskopla yaprak gibi küçük şeyleri inceleriz.', img: 'microscope' },
  { q: 'Bilim neyle başlar?', a: 'Merakla', w: ['Uykuyla', 'Kavgayla', 'Sessizlikle'], ex: 'Bilim merakla başlar.', img: 'thinking' },
  { q: 'Cevabı hemen bulamazsak ne yaparız?', a: 'Sabırla araştırmaya devam ederiz', w: ['Hemen vazgeçeriz', 'Ağlarız', 'Unuturuz'], ex: 'Vazgeçmeden, sabırla araştırırız.', img: 'magnifier' },
  { q: 'İlk mikroskobu kimler yaptı?', a: 'Janssen ve oğlu', w: ['Bir ressam', 'Bir aşçı', 'Bir pilot'], ex: 'Hans ve Zacharias Janssen mercekle küçük şeyleri büyük gördüler.', img: 'microscope' },
]
const MERAK_HIT = ['Neden yağmur yağar?', 'Kuşlar nasıl uçar?', 'Bitkiler nasıl büyür?', 'Ay neden parlar?', 'Balon neden uçar?', 'Arılar nasıl bal yapar?']
const MERAK_WRONG = ['Bugün hava güzel.', 'Elma kırmızıdır.', 'Top oynadık.', 'Kedim uyuyor.']

const TEKNO_BINS: SortQ['bins'] = [
  { id: 'saglik', label: 'Sağlık', img: 'hospital', color: '#ef4444' },
  { id: 'egitim', label: 'Eğitim', img: 'school', color: '#3b82f6' },
  { id: 'ulasim', label: 'Ulaşım', img: 'bus', color: '#f59e0b' },
  { id: 'iletisim', label: 'İletişim', img: 'phone', color: '#22c55e' },
]
const TEKNO: SortQ['items'] = [
  { label: 'Steteskop', img: 'stethoscope', bin: 'saglik' },
  { label: 'Ateş ölçer', img: 'thermometer', bin: 'saglik' },
  { label: 'Ambulans', img: 'ambulance', bin: 'saglik' },
  { label: 'Akıllı tahta', img: 'television', bin: 'egitim' },
  { label: 'Bilgisayar', img: 'laptop', bin: 'egitim' },
  { label: 'Mikroskop', img: 'microscope', bin: 'egitim' },
  { label: 'Otobüs', img: 'bus', bin: 'ulasim' },
  { label: 'Uçak', img: 'airplane', bin: 'ulasim' },
  { label: 'Tren', img: 'train', bin: 'ulasim' },
  { label: 'Telefon', img: 'phone', bin: 'iletisim' },
  { label: 'Radyo', img: 'radio', bin: 'iletisim' },
  { label: 'Uydu', img: 'satellite', bin: 'iletisim' },
]
const TEKNO_TF: TF[] = [
  ['Fotoğraflarımı herkesle paylaşırım.', false, 'Kişisel bilgilerimizi ve fotoğraflarımızı paylaşmayız.'],
  ['Tableti ihtiyacım kadar kullanırım.', true, 'Teknolojiyi amacına uygun ve az kullanırız.'],
  ['İnternette paylaşılan şeyler kalıcıdır.', true, 'Bu yüzden paylaşırken çok dikkat ederiz.'],
  ['Telefonla bütün gün oyun oynarım.', false, 'Ekran başında ihtiyacımız kadar kalırız.'],
  ['Teknoloji hayatımızı kolaylaştırır.', true, 'İşlerimizi hızlandırır.'],
  ['Adresimi internette herkese yazarım.', false, 'Adres gibi bilgileri paylaşmayız.'],
  ['“Bu araç ne işe yarar?” diye sormak güzeldir.', true, 'Merak etmek teknolojiyi geliştirir.'],
]
const TEKNO_Q: Q[] = [
  { q: 'ANKA nedir?', a: 'İnsansız hava aracı', w: ['Bir kuş', 'Bir oyuncak bebek', 'Bir gemi'], ex: 'ANKA, ülkemizde yapılan insansız hava aracıdır.', img: 'airplane' },
  { q: 'İlk Türk astronot kimdir?', a: 'Alper Gezeravcı', w: ['Mehmet Âkif Ersoy', 'Ali Rıza Bey', 'Hans Janssen'], ex: 'Alper Gezeravcı uzaya giden ilk Türk astronottur.', img: 'rocket' },
  { q: 'TEKNOFEST nedir?', a: 'Havacılık, uzay ve teknoloji festivali', w: ['Bir yemek', 'Bir şarkı', 'Bir hayvan'], ex: 'TEKNOFEST’te teknoloji ürünleri tanıtılır.', img: 'rocket' },
  { q: 'İlk bilgisayarlar nasıldı?', a: 'Oda kadar büyük ve ağır', w: ['Cep kadar küçük', 'Kâğıttan', 'Uçabilen'], ex: 'İlk bilgisayarlardan biri neredeyse bir oda büyüklüğündeydi.', img: 'laptop' },
  { q: 'Teknolojiyi merak edince ne sorarız?', a: 'Bu nasıl çalışır?', w: ['Bugün günlerden ne?', 'Adın ne?', 'Saat kaç?'], ex: '“Ne işe yarar? Nasıl çalışır?” diye sorarız.', img: 'gear' },
  { q: 'Hangisi iletişimde kullanılan bir teknolojidir?', a: 'Telefon', w: ['Tencere', 'Çekiç', 'Top'], ex: 'Telefon ve tablet iletişim araçlarıdır.', img: 'phone' },
]

const SANAT_P: P[] = [
  ['Ressam', 'Resim yapar', 'artist', 'framed'],
  ['Müzisyen', 'Müzik yapar', 'guitar', 'music'],
  ['Tiyatro', 'Sahnede oyun', 'theater', 'microphone'],
  ['Ebru', 'Su üstünde boyalarla desen', 'droplet', 'paint'],
  ['Heykel', 'Kilden ya da taştan şekil', 'stone', 'classical'],
  ['Çini', 'Tabak ve vazo süsleme', 'plate', 'palette'],
]
const SANAT_MEM: P[] = [
  ['Resim', 'Fırça ve boya', undefined, 'palette'],
  ['Müzik', 'Gitar', undefined, 'guitar'],
  ['Tiyatro', 'Maskeler', undefined, 'theater'],
  ['Ritim', 'Davul', undefined, 'drum'],
  ['Keman', 'Keman sesi', undefined, 'violin'],
  ['Şarkı', 'Mikrofon', undefined, 'microphone'],
]
const SANAT_Q: Q[] = [
  { q: 'Çinide hangi renk “İznik kırmızısı” diye bilinir?', a: 'Kırmızı', w: ['Mavi', 'Yeşil', 'Sarı'], ex: 'Çinide İznik kırmızısı ve Kütahya mavisi ünlüdür.', img: 'plate' },
  { q: 'Çinide hangi renk “Kütahya mavisi” diye bilinir?', a: 'Mavi', w: ['Kırmızı', 'Mor', 'Turuncu'], ex: 'Kütahya mavisi çinide kullanılan özel bir renktir.', img: 'plate' },
  { q: 'Ebru nasıl yapılır?', a: 'Su dolu kaba boya damlatılarak', w: ['Taş kırılarak', 'Kumda koşarak', 'Kâğıt yırtılarak'], ex: 'Ebruda su yüzeyine boya damlatılır, desen yapılır.', img: 'paint' },
  { q: 'Sanat neyi anlatmanın bir yoludur?', a: 'Duygu ve düşüncelerimizi', w: ['Sadece sayıları', 'Hava durumunu', 'Saat kaç olduğunu'], ex: 'Sanatla duygu ve düşüncelerimizi anlatırız.', img: 'palette' },
  { q: 'Hangisi sanatsal bir etkinliktir?', a: 'Müze gezisi', w: ['Diş fırçalamak', 'Uyumak', 'Çöp atmak'], ex: 'Sergi, tiyatro ve müze gezisi sanatsal etkinliklerdir.', img: 'framed' },
  { q: 'Animasyon filmlerde sanatla birlikte ne kullanılır?', a: 'Teknoloji', w: ['Kum', 'Yağmur', 'Çorba'], ex: 'Sanat, bilim ve teknoloji birbirini etkiler.', img: 'television' },
  { q: 'Kukla nasıl oynatılır?', a: 'Elle ya da iple', w: ['Suyla', 'Rüzgârla', 'Kendi kendine'], ex: 'Kuklayı elimizle ya da iple oynatırız.', img: 'theater' },
]
const SANAT_HIT = ['Resim', 'Müzik', 'Tiyatro', 'Ebru', 'Heykel', 'Çini', 'Dans']
const SANAT_WRONG = ['Diş fırçalamak', 'Uyumak', 'Bulaşık', 'Ödev kontrolü']
const SANAT_IMG: Record<string, string> = { Resim: 'palette', Müzik: 'music', Tiyatro: 'theater', Ebru: 'paint', Heykel: 'classical', Çini: 'plate', Dans: 'party', 'Diş fırçalamak': 'toothbrush', Uyumak: 'bed', Bulaşık: 'bowl', 'Ödev kontrolü': 'memo' }

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
const T = 6 // tur sayısı
const OYUN = 8

export const ALANLAR: Alan[] = [
  {
    id: 'a1',
    no: 1,
    title: 'Ben ve Okulum',
    color: '#ff9a2e',
    dark: '#c86a0c',
    icon: 'school',
    acts: [
      { kind: 'tanisma', title: 'Haydi Tanışalım', icon: 'handshake', total: T, meb: 'HB.1.1.1', gen: rot(ch(TANISMA_Q), tf(TANISMA_TF, 'handshake')), ders: 'Tanışırken gözüne bakar, “Merhaba” der, adımızı söyleriz. Konuşanı dikkatle dinleriz.', points: ['Göz teması kur', '“Merhaba” de, adını söyle', 'Sözünü kesme, dinle'], visual: img('handshake') },
      { kind: 'merhaba-treni', title: 'Merhaba Treni', icon: 'wave2', total: 4, meb: 'HB.1.1.1', gen: rot(ord(TANISMA_O), tf(TANISMA_TF)), ders: 'Tanışmanın da bir sırası vardır. Önce selam, sonra tanıtma, en son güzel bir dilek!', visual: img('wave2') },
      { kind: 'okul-bolumleri', title: 'Okulumu Keşfediyorum', icon: 'school', total: T, meb: 'HB.1.1.2', gen: rot(ch(OKUL_Q), mt('Eşleştir: kim ya da neresi, ne işe yarar?', 'Okulumuzda herkesin ve her bölümün bir görevi var.', OKUL_P)), ders: 'Okulumuzda sınıf, kütüphane, kantin, lavabo, müdür odası ve öğretmenler odası vardır.', points: ['Müdür okulu yönetir', 'Öğretmen bize öğretir', 'Yardımcı personel okulu temiz tutar'], visual: img('school') },
      { kind: 'seref-kosesi', title: 'Şeref Köşesi', icon: 'trflag', total: 4, meb: 'HB.1.1.2', gen: rot(pop('Şeref köşesinde olanları patlat!', 'Şeref köşesinde Türk bayrağı, Atatürk portresi, İstiklâl Marşı ve Gençliğe Hitabe bulunur.', SEREF_HIT, SEREF_WRONG), pop('Ders araç gereçlerini patlat!', 'Kalem, silgi, defter, kitap, cetvel ve makas ders araç gereçlerimizdir.', ARAC_HIT, ARAC_WRONG, ARAC_IMG)), ders: 'Şeref köşesi yazı tahtasının üstündedir: bayrağımız, Atatürk portresi, İstiklâl Marşı ve Gençliğe Hitabe.', visual: img('trflag') },
      { kind: 'kurallar', title: 'Kurallar Her Yerde', icon: 'raisedhand', total: T, meb: 'HB.1.1.3', gen: tf(KURAL_TF, 'raisedhand'), ders: 'Kurallar herkesin hakkını korur. Söz alarak konuşur, koridorda koşmaz, sıramızı bekleriz.', points: ['Söz alarak konuş', 'Koridorda koşma', 'Eşyaları özenle kullan'], visual: img('raisedhand') },
      { kind: 'sinif-okul', title: 'Sınıf mı, Okul mu?', icon: 'bell', total: 4, meb: 'HB.1.1.3', gen: srt('Bu kural nerede geçerli? Sepetlere ayır.', 'Bazı kurallar sınıfta, bazıları okulda, bazıları her ikisinde geçerlidir.', [{ id: 'sinif', label: 'Sınıfta', img: 'pencil', color: '#3b82f6' }, { id: 'okul', label: 'Okulda', img: 'school', color: '#f59e0b' }, { id: 'ikisi', label: 'İkisinde de', img: 'star', color: '#22c55e' }], KURAL_ITEMS), ders: 'Bazı kurallar sınıfa, bazıları okulun tamamına aittir. Temizlik ve özen her yerde geçerli!', visual: img('bell') },
      { kind: 'duygular', title: 'Neler Hissediyorum?', icon: 'happy', total: T, meb: 'HB.1.1.4', gen: rot(ch(DUYGU_Q), mt('Duyguyu yüzüyle eşleştir.', 'Duygularımızı yüz ifademizle de gösteririz.', DUYGU_P)), ders: 'Mutlu, üzgün, heyecanlı, şaşkın olabiliriz. Bütün duygular normaldir; onları sözlerimizle anlatırız.', points: ['Duygular yüzümüzden anlaşılır', 'Aynı olaya farklı duygular olabilir'], visual: img('happy') },
      { kind: 'duygu-hafiza', title: 'Duygu Hafızası', icon: 'surprised', total: 3, meb: 'HB.1.1.4', gen: mem('Duygu kartlarını eşleştir!', 'Her duygunun bir yüz ifadesi var.', DUYGU_MEM), ders: 'Kartları çevir, duygu adıyla yüzünü eşleştir!', visual: img('surprised') },
      { kind: 'dedektif', title: 'Dedektif Fındık', icon: 'detective', total: T, meb: 'HB.1.1.4', gen: rot(ch(DEDEKTIF), ord(BOY_O)), ders: 'Saç rengi, göz rengi, boy ve gözlük fiziksel özelliklerimizdir. İpuçlarını dikkatle dinle!', points: ['Saç ve göz rengi', 'Boy', 'Gözlük kullanma'], visual: img('detective') },
      { kind: 'oyun-yol', title: 'Kural Yolu', icon: 'trophy', total: OYUN, meb: 'HB.1.1.3', oyun: true, gen: karma(tf(KURAL_TF), tf(TANISMA_TF), ch(OKUL_Q), ch(DUYGU_Q)), ders: 'Doğru davranışlarla yolda ilerle! Her doğru cevap seni bir durak ileri taşır.', visual: img('trophy') },
      { kind: 'oyun-balon', title: 'Okul Balonları', icon: 'balloon', total: 4, meb: 'HB.1.1.2', oyun: true, gen: rot(pop('Ders araç gereçlerini patlat!', 'Bunlar sınıfta kullandığımız araç gereçler.', ARAC_HIT, ARAC_WRONG, ARAC_IMG), pop('Şeref köşesinde olanları patlat!', 'Şeref köşesinin dört öğesi.', SEREF_HIT, SEREF_WRONG), mem('Duygu kartlarını eşleştir!', 'Duygu ve yüzler.', DUYGU_MEM)), ders: 'Balonları patlat, kartları eşleştir!', visual: img('balloon') },
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
      { kind: 'saglikli-tabak', title: 'Sağlıklı Tabak', icon: 'salad', total: 4, meb: 'HB.1.2.1', gen: srt('Hangisini her gün, hangisini ara sıra yeriz?', 'Süt, meyve, sebze her gün; şeker ve abur cubur ara sıra.', [{ id: 'her', label: 'Her gün', img: 'happy', color: '#22c55e' }, { id: 'ara', label: 'Ara sıra', img: 'thinking', color: '#f59e0b' }], BESIN), ders: 'Dengeli besleniriz, öğün atlamayız. Abur cuburdan uzak dururuz.', points: ['Kahvaltını yap', 'Meyve, sebze, süt', 'Abur cubur ara sıra'], visual: img('salad') },
      { kind: 'saglikli-mi', title: 'Sağlıklı mı?', icon: 'biceps', total: T, meb: 'HB.1.2.1', gen: tf(SAGLIK_TF, 'biceps'), ders: 'Spor yapar, erken yatar, dişlerimizi fırçalar, ellerimizi yıkarız.', points: ['Düzenli spor', 'Yeterli uyku', 'Kişisel temizlik'], visual: img('biceps') },
      { kind: 'temizlik', title: 'Temizlik Balonları', icon: 'soap', total: 4, meb: 'HB.1.2.1', gen: pop('Sağlıklı alışkanlıkları patlat!', 'Diş fırçalamak, el yıkamak, banyo yapmak ve uyumak bizi sağlıklı tutar.', BAKIM_HIT, BAKIM_WRONG, BAKIM_IMG), ders: 'Kişisel bakımımıza özen gösteririz: dişler, eller, saçlar, tırnaklar!', visual: img('soap') },
      { kind: 'gunum', title: 'Sağlıklı Günüm', icon: 'sunrise', total: 4, meb: 'HB.1.2.1', gen: ord(GUN_O), ders: 'Sağlıklı bir gün düzenle başlar ve erken uykuyla biter.', visual: img('sunrise') },
      { kind: 'kisisel-alan', title: 'Kişisel Alanıma Dikkat!', icon: 'shield', total: T, meb: 'HB.1.2.2', gen: rot(tf(KISISEL_TF, 'shield'), ch(KISISEL_Q)), ders: 'Kişisel alan, çevremizdeki görünmez bir çember gibidir. İstemediğimiz şeye “Hayır!” der, güvendiğimiz büyüğe söyleriz.', points: ['“Hayır!” diyebilirim', 'Bilgilerimi yabancıya vermem', 'Güvendiğim büyüğe söylerim'], visual: img('shield') },
      { kind: 'cember', title: 'Görünmez Çember', icon: 'hug', total: 3, meb: 'HB.1.2.2', gen: srt('Çemberimin içinde kimler var? Sepetlere ayır.', 'Çemberimizin içine güvendiğimiz ailemizi ve yakın arkadaşlarımızı alırız.', [{ id: 'ic', label: 'Çemberimin içinde', img: 'heart', color: '#22c55e' }, { id: 'dis', label: 'Çemberin dışında', img: 'noentry', color: '#ef4444' }], CEMBER), ders: 'Güvendiğimiz kişiler çemberimizin içindedir. Tanımadığımız kişiler dışında kalır.', visual: img('hug') },
      { kind: 'trafik', title: 'Trafik Kuralları', icon: 'trafficlight', total: T, meb: 'HB.1.2.3', gen: rot(ch(TRAFIK_Q), tf(TRAFIK_TF, 'vtraffic')), ders: 'Yaya ışığında kırmızıda dururuz, yeşilde geçeriz. Arabada emniyet kemeri takar, arka koltukta otururuz.', points: ['Kırmızıda dur, yeşilde geç', 'Sol, sağ, sol bak', 'Emniyet kemerini tak'], visual: img('vtraffic') },
      { kind: 'yaya-yolcu', title: 'Yaya mı, Yolcu mu?', icon: 'crossing', total: 4, meb: 'HB.1.2.3', gen: rot(srt('Bu kural yaya için mi, yolcu için mi?', 'Yaya yürür, yolcu araçla gider.', [{ id: 'yaya', label: 'Yaya', img: 'walking', color: '#22c55e' }, { id: 'yolcu', label: 'Yolcu', img: 'car', color: '#3b82f6' }], TRAFIK_ITEMS), ord(KARSI_O)), ders: 'Trafikte bazen yaya, bazen yolcuyuz. Her ikisinin de kuralları var.', visual: img('crossing') },
      { kind: 'acil', title: 'Eyvah, Acil Durum!', icon: 'siren', total: T, meb: 'HB.1.2.4', gen: rot(ch(ACIL_Q), mt('Kimden yardım istemeli? Eşleştir.', 'Okulda öğretmenden, evde aile büyüğünden, dışarıda görevliden yardım isteriz.', ACIL_P, 3)), ders: 'Acil durumda önce sakin kalırız. Evde aile büyüğümüzden, okulda öğretmenimizden, dışarıda görevlilerden yardım isteriz. Acil Çağrı Merkezi: 112.', points: ['Sakin kal', 'Bir büyüğe haber ver', 'Acil numara: 112'], visual: img('siren') },
      { kind: 'acil-mi', title: 'Acil mi, Değil mi?', icon: 'ambulance', total: 4, meb: 'HB.1.2.4', gen: rot(srt('Acil durum mu? Sepetlere ayır.', 'Hemen yardım gereken olaylar acil durumdur.', [{ id: 'acil', label: 'Acil durum', img: 'siren', color: '#ef4444' }, { id: 'degil', label: 'Acil değil', img: 'happy', color: '#22c55e' }], ACIL_ITEMS), ord(ACIL_O)), ders: 'Düşüp kalkamamak, gaz kokusu, kaybolmak acil durumdur. Pilin bitmesi acil değildir.', visual: img('ambulance') },
      { kind: 'oyun-yolculuk', title: 'Güvenli Yolculuk', icon: 'bus', total: OYUN, meb: 'HB.1.2.3', oyun: true, gen: karma(ch(TRAFIK_Q), tf(TRAFIK_TF), ord(KARSI_O), ch(ACIL_Q)), ders: 'Evden okula güvenle git! Işıklara, kemere ve geçide dikkat.', visual: img('bus') },
      { kind: 'oyun-kahraman', title: 'Sağlık Kahramanı', icon: 'medal', total: 4, meb: 'HB.1.2.1', oyun: true, gen: rot(pop('Sağlıklı alışkanlıkları patlat!', 'Sağlık kahramanları bunları yapar.', BAKIM_HIT, BAKIM_WRONG, BAKIM_IMG), srt('Her gün mü, ara sıra mı?', 'Dengeli beslen!', [{ id: 'her', label: 'Her gün', img: 'happy', color: '#22c55e' }, { id: 'ara', label: 'Ara sıra', img: 'thinking', color: '#f59e0b' }], BESIN)), ders: 'Sağlık kahramanı ol: balonları patlat, besinleri ayır!', visual: img('medal') },
    ],
  },
  {
    id: 'a3',
    no: 3,
    title: 'Ailem ve Toplum',
    color: '#ff7aa8',
    dark: '#c9417a',
    icon: 'housegarden',
    acts: [
      { kind: 'bizim-ev', title: 'Bizim Ev', icon: 'housegarden', total: T, meb: 'HB.1.3.1', gen: rot(ch(AILECE_Q), tf(AILE_TF, 'heart')), ders: 'Aile, toplumun en küçük birliğidir. Ailemizde kendimizi güvende hissederiz.', points: ['Çekirdek aile: anne, baba, çocuklar', 'Geniş aile: dede, nine gibi büyükler de var'], visual: img('housegarden') },
      { kind: 'aile-turu', title: 'Çekirdek mi, Geniş mi?', icon: 'houses', total: 4, meb: 'HB.1.3.1', gen: srt('Bu aile çekirdek mi, geniş mi?', 'Anne, baba ve çocuklar dışında biri de yaşıyorsa geniş ailedir.', [{ id: 'cekirdek', label: 'Çekirdek aile', img: 'house', color: '#f59e0b' }, { id: 'genis', label: 'Geniş aile', img: 'housegarden', color: '#3b82f6' }], AILE_ITEMS), ders: 'Her aile farklıdır ve her aile değerlidir. Bazı ailelerde büyükanne, dede gibi başka büyükler de yaşar.', visual: img('houses') },
      { kind: 'degerler', title: 'Aile Değerleri', icon: 'heart', total: 4, meb: 'HB.1.3.1', gen: pop('Aileyi bir arada tutan değerleri patlat!', 'Sevgi, şefkat, saygı, anlayış ve birlik aileyi bir arada tutar.', DEGER_HIT, DEGER_WRONG, DEGER_IMG), ders: 'Sevgi, şefkat, saygı, anlayış, fedakârlık, birlik ve beraberlik aileyi güçlü kılar.', visual: img('heart') },
      { kind: 'sihirli-sozcukler', title: 'Sihirli Sözcükler', icon: 'sparkles', total: T, meb: 'HB.1.3.2', gen: rot(mt('Durumu doğru sözle eşleştir.', 'Nezaket sözcükleri iletişimi güzelleştirir.', NEZAKET_P), ch(NEZAKET_Q)), ders: 'Günaydın, lütfen, teşekkür ederim, afiyet olsun, elinize sağlık: sihirli sözcüklerimiz!', points: ['İsterken: Lütfen', 'Alınca: Teşekkür ederim', 'Sofrada: Afiyet olsun'], visual: img('sparkles') },
      { kind: 'gorgu', title: 'Kapıyı Çal', icon: 'key2', total: T, meb: 'HB.1.3.2', gen: rot(tf(GORGU_TF, 'key2'), ord(SOFRA_O)), ders: 'Odalara girerken kapıyı çalarız. Sofraya birlikte oturur, birlikte kalkarız. Eşyaları izinle kullanırız.', visual: img('forkplate') },
      { kind: 'gorev', title: 'Görev Sepetleri', icon: 'broom', total: 4, meb: 'HB.1.3.3', gen: srt('Bu görevi kim yapabilir? Sepetlere ayır.', 'Bazı işleri büyükler yapar; çocukların da yapabileceği işler vardır; bazı işleri hep birlikte yaparız.', [{ id: 'cocuk', label: 'Çocuklar', img: 'boy', color: '#22c55e' }, { id: 'buyuk', label: 'Büyükler', img: 'woman', color: '#3b82f6' }, { id: 'hep', label: 'Hep birlikte', img: 'friends', color: '#f59e0b' }], GOREV_ITEMS), ders: 'Ailede herkesin görevleri vardır. Oyuncak toplamak, çiçek sulamak çocukların yapabileceği işlerdir.', visual: img('broom') },
      { kind: 'takim', title: 'Biz İyi Bir Takımız', icon: 'friends', total: T, meb: 'HB.1.3.3', gen: rot(tf(GOREV_TF, 'friends'), pop('Görev paylaşınca neler olur? Patlat!', 'Görevleri paylaşınca işler hızlanır, sevgi artar.', TAKIM_HIT, TAKIM_WRONG)), ders: 'Görevlerimizi yapınca ev düzenli olur, işler hızlı biter, birbirimize daha çok zaman kalır.', visual: img('friends') },
      { kind: 'oyun-bayram-sabahi', title: 'Bayram Sabahı Evde', icon: 'gift', total: OYUN, meb: 'HB.1.3.2', oyun: true, gen: karma(ch(NEZAKET_Q), tf(GORGU_TF), tf(GOREV_TF), ch(AILECE_Q)), ders: 'Evi bayrama hazırlayalım! Doğru sözü ve doğru davranışı seç.', visual: img('gift') },
      { kind: 'oyun-hafiza', title: 'Takım Hafızası', icon: 'puzzle', total: 4, meb: 'HB.1.3.3', oyun: true, gen: rot(mem('Görev kartlarını eşleştir!', 'Her görevin bir resmi var.', TAKIM_MEM), mem('Durum ve sihirli sözcük kartlarını eşleştir!', 'Doğru yerde doğru söz.', NEZAKET_P)), ders: 'Kartları çevir, eşlerini bul!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a4',
    no: 4,
    title: 'Yaşadığım Yer ve Ülkem',
    color: '#e8463c',
    dark: '#b8302c',
    icon: 'trflag',
    acts: [
      { kind: 'ulkem', title: 'Güzel Ülkem', icon: 'map', total: T, meb: 'HB.1.4.1', gen: rot(ch(ULKE_Q), mt('Eşleştir!', 'Ülkemizin adı, başkenti ve para birimi.', ULKE_P)), ders: 'Ülkemizin adı Türkiye Cumhuriyeti, başkentimiz Ankara, para birimimiz Türk lirası. Üç tarafımız denizlerle çevrili.', points: ['Başkent: Ankara', 'Para: Türk lirası (₺)', 'Dört denizimiz var'], visual: img('map') },
      { kind: 'denizler', title: 'Dört Deniz', icon: 'wave', total: 3, meb: 'HB.1.4.1', gen: pop('Denizlerimizi patlat!', 'Denizlerimiz: Akdeniz, Karadeniz, Ege Denizi ve Marmara Denizi.', DENIZ_HIT, DENIZ_WRONG), ders: 'Akdeniz, Karadeniz, Ege ve Marmara denizlerimizdir. Dördü de vatanımızın parçasıdır.', visual: img('wave') },
      { kind: 'sehirler', title: 'Şehrin Güzellikleri', icon: 'cityscape', total: T, meb: 'HB.1.4.1', gen: rot(mt('Hangi şehrimizde? Eşleştir.', 'Her şehrimizin kendine özgü güzellikleri vardır.', SEHIR_P), srt('Tarihî yer mi, doğal güzellik mi, yöresel yiyecek mi?', 'Her yerin tarihî yerleri, doğal güzellikleri ve lezzetleri vardır.', [{ id: 'tarihi', label: 'Tarihî yer', img: 'classical', color: '#a16207' }, { id: 'dogal', label: 'Doğal güzellik', img: 'mountain', color: '#22c55e' }, { id: 'yiyecek', label: 'Yöresel yiyecek', img: 'forkplate', color: '#f59e0b' }], YER_ITEMS)), ders: 'Her yerin tarihî yerleri, doğal güzellikleri, yöresel yiyecekleri ve kıyafetleri vardır. Pamukkale Denizli’de, künefe Hatay’da!', visual: img('cityscape') },
      { kind: 'bayragim', title: 'Bayrağım ve Marşım', icon: 'trflag', total: T, meb: 'HB.1.4.2', gen: rot(ch(BAYRAK_Q), srt('Bayrakla mı, marşla mı ilgili?', 'Bazı bilgiler bayrağımızla, bazıları marşımızla, bazıları ikisiyle de ilgili.', [{ id: 'bayrak', label: 'Bayrak', img: 'trflag', color: '#ef4444' }, { id: 'mars', label: 'Marş', img: 'music', color: '#3b82f6' }, { id: 'ikisi', label: 'İkisi de', img: 'star', color: '#f59e0b' }], BAYRAK_ITEMS)), ders: 'Bayrağımız kırmızı zemin üzerinde beyaz ay ve yıldızdır. Millî marşımız İstiklâl Marşı’dır, sözlerini Mehmet Âkif Ersoy yazdı.', points: ['Bağımsızlığımızın sembolleri', 'Marş okunurken hazır olda dururuz'], visual: img('trflag') },
      { kind: 'mars-balon', title: 'Bayrak ve Marş Balonları', icon: 'balloon', total: 3, meb: 'HB.1.4.2', gen: pop('Bayrağımız ve marşımızla ilgili olanları patlat!', 'Bağımsızlık, ay yıldız, kırmızı, Mehmet Âkif Ersoy, hazır ol.', MARS_HIT, MARS_WRONG), ders: 'Bayrağımıza ve marşımıza saygı duyarız.', visual: img('trflag') },
      { kind: 'ataturk', title: 'Atatürk’ü Tanıyalım', icon: 'star', total: T, meb: 'HB.1.4.3', gen: rot(ch(ATA_Q), mt('Atatürk’ü tanıyalım: eşleştir.', 'Atatürk Selanik’te doğdu; annesi Zübeyde Hanım, babası Ali Rıza Bey.', ATA_P)), ders: 'Mustafa Kemal Atatürk Selanik’te doğdu. Annesi Zübeyde Hanım, babası Ali Rıza Bey. Cumhuriyetimizin kurucusudur.', points: ['Matematiği çok severdi', 'Kitap okumaya meraklıydı', 'Anıtkabir Ankara’da'], visual: img('star') },
      { kind: 'ataturk-album', title: 'Atatürk Albümü', icon: 'framed', total: 4, meb: 'HB.1.4.3', gen: rot(ord(ATA_O), pop('Atatürk’ün sevdiği şeyleri patlat!', 'Atatürk kitabı, bilimi, sanatı, sporu, doğayı ve vatanını çok severdi.', ATA_HIT, ATA_WRONG)), ders: 'Atatürk düzenli ve azimli çalıştı; bilime, sanata ve spora meraklıydı.', visual: img('framed') },
      { kind: 'milli-bayram', title: 'Al Bayrağı, Koş Bayrama', icon: 'confetti', total: T, meb: 'HB.1.4.4', gen: rot(ch(BAYRAM_Q), mt('Günü olayla eşleştir.', 'Millî gün ve bayramlarımızda Atatürk’ü ve kahramanlarımızı anarız.', BAYRAM_P)), ders: 'Millî bayramlarımız: 23 Nisan, 19 Mayıs, 30 Ağustos, 29 Ekim. 15 Temmuz ise Demokrasi ve Millî Birlik Günü’dür.', points: ['Okul bayraklarla süslenir', 'Şiir okunur, marş söylenir'], visual: img('confetti') },
      { kind: 'dini-bayram', title: 'El Öpenleriniz Çok Olsun', icon: 'candy2', total: T, meb: 'HB.1.4.5', gen: rot(ch(DINI_Q), pop('Bayramla ilgili olanları patlat!', 'Bayramlarda büyüklerimizi ziyaret eder, ikram eder, yardımlaşırız.', DINI_HIT, DINI_WRONG, DINI_IMG)), ders: 'Dinî bayramlarımız Ramazan ve Kurban Bayramı’dır. Büyüklerimizi ziyaret eder, ikram eder, yardımlaşırız.', visual: img('candy2') },
      { kind: 'milli-dini', title: 'Millî mi, Dinî mi?', icon: 'calendar', total: 3, meb: 'HB.1.4.5', gen: srt('Bu bayram millî mi, dinî mi?', 'Millî bayramlar ülkemizin tarihiyle, dinî bayramlar inançlarımızla ilgilidir.', [{ id: 'milli', label: 'Millî bayram', img: 'trflag', color: '#ef4444' }, { id: 'dini', label: 'Dinî bayram', img: 'gift', color: '#22c55e' }], BAYRAM_ITEMS), ders: 'Bayramlar birlik ve beraberliğimizi güçlendirir.', visual: img('calendar') },
      { kind: 'oyun-tur', title: 'Türkiye Turu', icon: 'airplane', total: OYUN, meb: 'HB.1.4.1', oyun: true, gen: karma(ch(ULKE_Q), mt('Hangi şehrimizde? Eşleştir.', 'Şehirlerimizin güzellikleri.', SEHIR_P), ch(ATA_Q), ch(BAYRAM_Q)), ders: 'Fındık’la Türkiye turuna çık! Her durakta bir soru seni bekliyor.', visual: img('airplane') },
      { kind: 'oyun-kart', title: 'Türkiye Kartları', icon: 'puzzle', total: 4, meb: 'HB.1.4.3', oyun: true, gen: rot(mem('Ülke kartlarını eşleştir!', 'Ülkemizin adı, başkenti ve para birimi.', ULKE_P), mem('Atatürk kartlarını eşleştir!', 'Atatürk’ün hayatından bilgiler.', ATA_P), mem('Bayram kartlarını eşleştir!', 'Millî gün ve bayramlarımız.', BAYRAM_P)), ders: 'Kartları çevir, eşlerini bul!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a5',
    no: 5,
    title: 'Doğa ve Çevre',
    color: '#2ec4c9',
    dark: '#1a8a8e',
    icon: 'seedling',
    acts: [
      { kind: 'canli-cansiz', title: 'Canlı mı, Cansız mı?', icon: 'leaf', total: T, meb: 'HB.1.5.1', gen: rot(srt('Canlı mı, cansız mı? Sepetlere ayır.', 'Bitkiler ve hayvanlar canlıdır; taş, su, bulut cansızdır.', [{ id: 'canli', label: 'Canlı', img: 'seedling', color: '#22c55e' }, { id: 'cansiz', label: 'Cansız', img: 'stone', color: '#9ca3af' }], CANLI_ITEMS), pop('Doğadaki varlıkları patlat!', 'Kuş, yaprak, kelebek, taş doğadadır; top ve araba insan yapımıdır.', DOGA_HIT, DOGA_WRONG, DOGA_IMG)), ders: 'Doğada canlı ve cansız varlıklar vardır. Bitkiler ve hayvanlar canlıdır. Biz de doğanın parçasıyız.', points: ['Canlı: bitki, hayvan', 'Cansız: taş, su, bulut'], visual: img('leaf') },
      { kind: 'renkler', title: 'Doğanın Renkleri', icon: 'rainbow', total: 3, meb: 'HB.1.5.1', gen: srt('Doğadaki varlıkları renklerine göre ayır.', 'Gözlemlerimizi renklerine göre sınıflandırabiliriz.', [{ id: 'mavi', label: 'Mavi', img: 'droplet', color: '#3b82f6' }, { id: 'yesil', label: 'Yeşil', img: 'leaf', color: '#22c55e' }, { id: 'diger', label: 'Başka renk', img: 'sunflower', color: '#f59e0b' }], RENK_ITEMS), ders: 'Doğadaki varlıkların renklerini ve şekillerini gözlemleriz.', visual: img('rainbow') },
      { kind: 'doga-gezisi', title: 'Doğa Gezisi', icon: 'camping', total: T, meb: 'HB.1.5.1', gen: tf(GEZI_TF, 'camping'), ders: 'Gözlem yaparken bitki koparmaz, hayvanları rahatsız etmeyiz. Gözlemimizi resimle ya da notla kaydederiz.', visual: img('camping') },
      { kind: 'gokyuzu', title: 'Gökyüzünde Neler Var?', icon: 'sunface', total: T, meb: 'HB.1.5.2', gen: rot(ch(GOK_Q), tf(GOK_TF, 'planet'), ord(GOK_O)), ders: 'Güneş, Dünya ve Ay gök cisimleridir. Üçü de topa benzer. En büyüğü Güneş, en küçüğü Ay.', points: ['Güneş > Dünya > Ay', 'Güneş’i gündüz görürüz', 'Ay’ı daha çok gece görürüz'], visual: img('sunface') },
      { kind: 'afetler', title: 'Afetleri Tanıyalım', icon: 'storm', total: T, meb: 'HB.1.5.3', gen: rot(ch(AFET_Q), mt('Afeti tanımıyla eşleştir.', 'Deprem, sel, orman yangını, çığ ve heyelan afettir.', AFET_P)), ders: 'Afet, çevreye büyük zarar veren olaydır: deprem, sel, orman yangını, çığ, heyelan. Nedenlerini öğrenir, hazırlıklı oluruz.', points: ['Büyüklerimiz ve öğretmenimiz ne yapacağımızı bilir', 'Onları dikkatle dinleriz'], visual: img('storm') },
      { kind: 'afet-kartlari', title: 'Afet Kartları', icon: 'puzzle', total: 3, meb: 'HB.1.5.3', gen: rot(mem('Afet kartlarını eşleştir!', 'Her afetin bir tanımı var.', AFET_P), pop('Afet olanları patlat!', 'Deprem, sel, çığ, heyelan ve orman yangını afettir.', AFET_HIT, AFET_WRONG, AFET_IMG)), ders: 'Kartları çevir, afetle tanımını eşleştir.', visual: img('puzzle') },
      { kind: 'geri-donusum', title: 'Atma, Yazık Olur!', icon: 'recycle', total: T, meb: 'HB.1.5.4', gen: rot(ATIK2(['kagit', 'plastik']), ATIK2(['cam', 'metal']), tf(GERI_TF, 'recycle2'), ATIK2(['kagit', 'cam', 'metal'])), ders: 'Kâğıt mavi, plastik sarı, cam yeşil, metal gri kutuya; biten piller kırmızı kutuya. Geri dönüşüm doğayı korur.', points: ['Kâğıt → mavi', 'Plastik → sarı', 'Cam → yeşil', 'Metal → gri'], visual: img('recycle') },
      { kind: 'kutular', title: 'Kutunun Rengi', icon: 'wastebasket', total: 4, meb: 'HB.1.5.4', gen: rot(mt('Atığı kutusunun rengiyle eşleştir.', 'Her atık türünün kendi kutusu var.', KUTU_P), pop('Geri dönüştürülebilenleri patlat!', 'Kâğıt, plastik, cam, metal ve piller geri dönüştürülür.', GERI_HIT, GERI_WRONG, GERI_IMG)), ders: 'Her atık kendi rengindeki kutuya!', visual: img('wastebasket') },
      { kind: 'oyun-sifir-atik', title: 'Sıfır Atık Kahramanı', icon: 'recycle2', total: OYUN, meb: 'HB.1.5.4', oyun: true, gen: karma(ATIK2(['kagit', 'plastik', 'cam']), ATIK2(['plastik', 'cam', 'metal']), pop('Geri dönüştürülebilenleri patlat!', 'Bunlar geri dönüşüm kutusuna gider.', GERI_HIT, GERI_WRONG, GERI_IMG), mt('Atık ve kutu rengi.', 'Kâğıt mavi, plastik sarı, cam yeşil, metal gri, pil kırmızı.', KUTU_P)), ders: 'Atıkları doğru kutulara at, adayı yeşillendir!', visual: img('recycle2') },
      { kind: 'oyun-gozlemevi', title: 'Gökyüzü Gözlemevi', icon: 'telescope', total: 4, meb: 'HB.1.5.2', oyun: true, gen: rot(mem('Gök kartlarını eşleştir!', 'Güneş, Dünya ve Ay.', GOK_MEM), ord(GOK_O), ch(GOK_Q)), ders: 'Teleskobunu al, gök cisimlerini keşfet!', visual: img('telescope') },
    ],
  },
  {
    id: 'a6',
    no: 6,
    title: 'Bilim, Teknoloji ve Sanat',
    color: '#9b6ef3',
    dark: '#6b43c4',
    icon: 'microscope',
    acts: [
      { kind: 'bilim', title: 'Bilimin Peşindeyiz', icon: 'microscope', total: T, meb: 'HB.1.6.1', gen: rot(ch(BILIM_Q), ord(BILIM_O)), ders: 'Bilim merakla başlar. Merak ederiz, soru sorarız, gözlem ve deneyle araştırırız. Vazgeçmeyiz!', points: ['Merak et', 'Soru sor', 'Araştır', 'Cevabı bul'], visual: img('microscope') },
      { kind: 'merak', title: 'Merak Sorusu Avı', icon: 'thinking', total: 3, meb: 'HB.1.6.1', gen: pop('Merak sorularını patlat!', '“Neden?” ve “Nasıl?” ile başlayan sorular merak sorularıdır.', MERAK_HIT, MERAK_WRONG), ders: '“Neden?” ve “Nasıl?” diye sormak bilimin ilk adımıdır.', visual: img('thinking') },
      { kind: 'teknoloji', title: 'Teknolojiyi Keşfedelim', icon: 'laptop', total: T, meb: 'HB.1.6.2', gen: rot(ch(TEKNO_Q), srt('Bu teknoloji hangi alanda kullanılır?', 'Teknoloji sağlıkta, eğitimde, ulaşımda ve iletişimde kullanılır.', TEKNO_BINS.slice(0, 3), TEKNO.filter((t) => t.bin !== 'iletisim')), srt('Bu teknoloji hangi alanda kullanılır?', 'Teknoloji sağlıkta, eğitimde, ulaşımda ve iletişimde kullanılır.', TEKNO_BINS.slice(1), TEKNO.filter((t) => t.bin !== 'saglik'))), ders: 'Teknoloji hayatımızı kolaylaştırır. “Bu ne işe yarar? Nasıl çalışır?” diye sorarız.', points: ['Sağlık, eğitim, ulaşım, iletişim', 'ANKA, TEKNOFEST, ilk Türk astronot'], visual: img('laptop') },
      { kind: 'guvenli-teknoloji', title: 'Güvenli Teknoloji', icon: 'phone', total: T, meb: 'HB.1.6.2', gen: tf(TEKNO_TF, 'phone'), ders: 'Teknolojiyi amacına uygun ve ihtiyacımız kadar kullanırız. Kişisel bilgilerimizi ve fotoğraflarımızı paylaşmayız.', visual: img('phone') },
      { kind: 'sanat', title: 'Sanat Bize İyi Gelir', icon: 'palette', total: T, meb: 'HB.1.6.3', gen: rot(mt('Sanat dalını eşleştir.', 'Resim, müzik, tiyatro, ebru, heykel ve çini sanat dallarıdır.', SANAT_P), ch(SANAT_Q)), ders: 'Sanat, duygu ve düşüncelerimizi anlatmanın yoludur: resim, müzik, tiyatro, ebru, heykel, çini.', points: ['Ebru: su üstünde boya', 'Çini: İznik kırmızısı, Kütahya mavisi'], visual: img('palette') },
      { kind: 'sanat-balon', title: 'Sanat Balonları', icon: 'music', total: 3, meb: 'HB.1.6.3', gen: pop('Sanat dallarını patlat!', 'Resim, müzik, tiyatro, ebru, heykel, çini ve dans sanattır.', SANAT_HIT, SANAT_WRONG, SANAT_IMG), ders: 'Sanatın birçok dalı vardır. Sen hangisini seversin?', visual: img('music') },
      { kind: 'oyun-laboratuvar', title: 'Merak Laboratuvarı', icon: 'testtube', total: OYUN, meb: 'HB.1.6.1', oyun: true, gen: karma(ch(BILIM_Q), ch(TEKNO_Q), ch(SANAT_Q), pop('Merak sorularını patlat!', 'Neden? Nasıl?', MERAK_HIT, MERAK_WRONG)), ders: 'Üç istasyon: bilim, teknoloji, sanat. Tahmin et, keşfet!', visual: img('testtube') },
      { kind: 'oyun-muze', title: 'Mini Müze', icon: 'framed', total: 4, meb: 'HB.1.6.3', oyun: true, gen: rot(mem('Sanat kartlarını eşleştir!', 'Sanat ve araçları.', SANAT_MEM), srt('Teknoloji alanlarına ayır.', 'Sağlık, eğitim, ulaşım.', TEKNO_BINS.slice(0, 3), TEKNO.filter((t) => t.bin !== 'iletisim'))), ders: 'Müzeyi gez, kartları eşleştir!', visual: img('framed') },
    ],
  },
]

/* ================================================================================================
 * EK ETKİNLİKLER — her konuya yeni soru bankalarıyla ek etkinlikler (kitap konusuna göre sıralanır)
 * ================================================================================================ */
// 1.1 Tanışma
const KIBAR_HIT = ['Gülümse', 'Göz teması kur', '“Merhaba” de', 'Adını söyle', 'Dikkatle dinle', 'Tokalaş']
const KIBAR_WRONG = ['Sözünü kes', 'Arkanı dön', 'Bağır', 'Fısılda', 'Kaşlarını çat']
const KIBAR_IMG: Record<string, string> = { Gülümse: 'happy', 'Göz teması kur': 'eye', '“Merhaba” de': 'wave2', 'Adını söyle': 'speaker', 'Dikkatle dinle': 'ear', Tokalaş: 'handshake', 'Sözünü kes': 'noentry', 'Arkanı dön': 'thumbsdown', Bağır: 'angry', Fısılda: 'shush', 'Kaşlarını çat': 'angry' }
const ORTAK_Q: Q[] = [
  { q: 'Ali top oynamayı sever. Ece de top oynamayı sever. Ortak yönleri ne?', a: 'İkisi de top oynamayı sever', w: ['İkisi de resim yapar', 'İkisi de uyumayı sever', 'Hiç ortak yönleri yok'], ex: 'Ortak yönlerimizi bulmak arkadaşlığı kolaylaştırır.', img: 'ball' },
  { q: 'Yeni arkadaşın resim yapmayı seviyor. Ona ne sorabilirsin?', a: 'En çok neyi çizmeyi seversin?', w: ['Neden buradasın?', 'Bana kalemini ver.', 'Sus artık.'], ex: 'Sevdiği şeyi sormak sohbeti başlatır.', img: 'palette' },
  { q: 'Kendini tanıtırken hangisini anlatabilirsin?', a: 'Sevdiğim sporu', w: ['Arkadaşımın sırrını', 'Komşunun adresini', 'Hiçbir şeyi'], ex: 'Sevdiğimiz sanat ve spor etkinliklerini anlatabiliriz.', img: 'running' },
  { q: 'Sınıfa yeni bir öğrenci geldi. Ne yaparsın?', a: 'Yanına gidip kendimi tanıtırım', w: ['Ona bakmam', 'Ona gülerim', 'Saklanırım'], ex: 'Yeni arkadaşları sıcak karşılarız.', img: 'wave2' },
]
// 1.2 Okul
const DAVRANIS_Q: Q[] = [
  { q: 'Kütüphanede nasıl davranırız?', a: 'Sessiz oluruz', w: ['Bağırırız', 'Koşarız', 'Top oynarız'], ex: 'Kütüphanede herkes okuyabilsin diye sessiz oluruz.', img: 'books' },
  { q: 'Kantinde ne yaparız?', a: 'Sıraya gireriz', w: ['Öne geçeriz', 'İteriz', 'Bağırırız'], ex: 'Kantinde sıramızı sabırla bekleriz.', img: 'sandwich' },
  { q: 'Tuvaleti kullandıktan sonra ne yaparız?', a: 'Temiz bırakır, elimizi yıkarız', w: ['Musluğu açık bırakırız', 'Kâğıtları yere atarız', 'Hiçbir şey yapmayız'], ex: 'Tuvaleti temiz bırakır, ellerimizi sabunla yıkarız.', img: 'soap' },
  { q: 'Kütüphaneden aldığımız kitaba nasıl davranırız?', a: 'Özenle kullanır, zamanında getiririz', w: ['Sayfalarını yırtarız', 'Üstüne çizeriz', 'Hiç geri getirmeyiz'], ex: 'Ortak eşyaları özenle kullanırız.', img: 'book' },
  { q: 'Hastalandın, eve gitmen gerekiyor. Okulda kime söylersin?', a: 'Öğretmenime', w: ['Hiç kimseye', 'Kantinciye', 'Sıra arkadaşıma'], ex: 'Öğretmenimize söyleriz, ailemize haber verilir.', img: 'thermometer2' },
]
const BOLUM_HIT = ['Sınıf', 'Kütüphane', 'Kantin', 'Müdür odası', 'Öğretmenler odası', 'Lavabo', 'Okul bahçesi']
const BOLUM_WRONG = ['Yatak odası', 'Plaj', 'Hayvanat bahçesi', 'Market', 'Havaalanı']
// 1.3 Kurallar
const OYUN_KURAL_Q: Q[] = [
  { q: 'Oyunda sıra arkadaşında. Ne yaparsın?', a: 'Sıramı sabırla beklerim', w: ['Araya girerim', 'Oyunu bozarım', 'Küserim'], ex: 'Oyunların da kuralları vardır, sıramızı bekleriz.', img: 'puzzle' },
  { q: 'Oyunu kaybettin. Ne yaparsın?', a: 'Arkadaşımı tebrik ederim', w: ['Bağırırım', 'Oyuncakları atarım', 'Bir daha oynamam'], ex: 'Kazanmak da kaybetmek de oyunun parçasıdır.', img: 'clap' },
  { q: 'Sınıf kurallarını nasıl belirleriz?', a: 'Hep birlikte, oylayarak', w: ['Tek kişi karar verir', 'Hiç kural koymayız', 'Kurallar gizli kalır'], ex: 'Kuralları birlikte belirleriz, herkesin hakkı vardır.', img: 'raisedhand' },
  { q: 'Neden kurallara uyarız?', a: 'Herkes güvende ve mutlu olsun diye', w: ['Kurallar gereksizdir', 'Sıkıldığımız için', 'Hiçbir sebebi yok'], ex: 'Kurallar herkesin hakkını korur.', img: 'shield' },
  { q: 'Arkadaşının boyasını kullanmak istiyorsun. Ne yaparsın?', a: 'İzin isterim', w: ['Sessizce alırım', 'Saklarım', 'Kırarım'], ex: 'Başkasının eşyasını izin isteyerek kullanırız.', img: 'crayon' },
]
const KURAL_HIT = ['Söz alarak konuş', 'Sırayı bekle', 'Çöpü kutuya at', 'Zamanında gel', 'İzin iste', 'Yavaş yürü']
const KURAL_WRONG = ['Koridorda koş', 'Sıraya çiz', 'Araya gir', 'Çöpü yere at']
// 1.4 Özellikler
const OZELLIK_ITEMS: SortQ['items'] = [
  { label: 'Saç rengi', img: 'girl', bin: 'fiziksel' },
  { label: 'Göz rengi', img: 'eye', bin: 'fiziksel' },
  { label: 'Boy', img: 'ruler', bin: 'fiziksel' },
  { label: 'Gözlük kullanmak', img: 'glasses', bin: 'fiziksel' },
  { label: 'Kıvırcık saç', img: 'boy', bin: 'fiziksel' },
  { label: 'Mutluluk', img: 'happy', bin: 'duygu' },
  { label: 'Üzüntü', img: 'sad', bin: 'duygu' },
  { label: 'Heyecan', img: 'grin', bin: 'duygu' },
  { label: 'Şaşkınlık', img: 'surprised', bin: 'duygu' },
  { label: 'Endişe', img: 'scared', bin: 'duygu' },
]
const BUYUME_TF: TF[] = [
  ['Büyüdükçe boyumuz uzar.', true, 'Büyürken boyumuz uzar, kilomuz artar.'],
  ['Herkesin göz rengi aynıdır.', false, 'Göz rengimiz mavi, yeşil ya da kahverengi olabilir.'],
  ['Duygularımızı yüz ifademizle gösterebiliriz.', true, 'Yüzümüz neler hissettiğimizi anlatır.'],
  ['Üzülmek yanlış bir duygudur.', false, 'Bütün duygular normaldir. Üzülünce bir büyüğümüzle konuşabiliriz.'],
  ['Aynı olaya farklı kişiler farklı tepki verebilir.', true, 'Her insan farklı hissedebilir.'],
  ['Gözlük kullanmak bir fiziksel özelliktir.', true, 'Saç, göz rengi, boy ve gözlük fiziksel özelliklerimizdir.'],
]
// 2.1 Sağlık
const SAGLIK_MEM: P[] = [
  ['Diş fırçası', 'Dişler', 'toothbrush', 'tooth'],
  ['Sabun', 'Eller', 'soap', 'hand'],
  ['Yatak', 'Uyku', 'bed', 'sleepy'],
  ['Top', 'Spor', 'ball', 'running'],
  ['Süt', 'Güçlü kemik', 'milk', 'biceps'],
  ['Su', 'Susuzluk', 'droplet', 'glass'],
]
const KAHVALTI_HIT = ['Süt', 'Peynir', 'Yumurta', 'Ekmek', 'Domates', 'Bal']
const KAHVALTI_WRONG = ['Cips', 'Gazlı içecek', 'Lolipop', 'Şeker']
const KAHVALTI_IMG: Record<string, string> = { Süt: 'milk', Peynir: 'cheese', Yumurta: 'egg', Ekmek: 'bread', Domates: 'tomato', Bal: 'honey', Cips: 'fries', 'Gazlı içecek': 'soda', Lolipop: 'lollipop', Şeker: 'candy' }
const SAGLIK_Q: Q[] = [
  { q: 'Neden kahvaltı yaparız?', a: 'Güne enerjiyle başlamak için', w: ['Uyumak için', 'Sıkıldığımız için', 'Hiç gerek yok'], ex: 'Kahvaltı güne güçlü başlamamızı sağlar.', img: 'sunrise' },
  { q: 'Dişlerimizi ne zaman fırçalarız?', a: 'Yemeklerden sonra', w: ['Hiçbir zaman', 'Sadece bayramda', 'Ayda bir'], ex: 'Yemeklerden sonra dişlerimizi fırçalarız.', img: 'toothbrush' },
  { q: 'Ellerimizi ne zaman yıkarız?', a: 'Yemekten önce', w: ['Asla', 'Sadece yazın', 'Uyurken'], ex: 'Yemekten önce ve tuvaletten sonra ellerimizi yıkarız.', img: 'soap' },
  { q: 'Susadığımızda en iyisi ne içmektir?', a: 'Su', w: ['Gazlı içecek', 'Şekerli şurup', 'Hiçbir şey'], ex: 'Susayınca su içeriz.', img: 'droplet' },
  { q: 'Akşam neden erken yatarız?', a: 'Yeterli uyuyup büyümek için', w: ['Oyun oynamamak için', 'Ceza olarak', 'Sebebi yok'], ex: 'Düzenli ve yeterli uyku büyümemize yardım eder.', img: 'bed' },
]
// 2.2 Kişisel alan
const KISISEL_Q2: Q[] = [
  { q: 'Biri sarılmak istedi ama sen istemiyorsun. Ne diyebilirsin?', a: '“Hayır, istemiyorum.”', w: ['Hiçbir şey diyemem', 'Ağlarım ama söylemem', 'Saklanırım'], ex: 'İstemediğimiz bir şeye “Hayır” diyebiliriz.', img: 'raisedhand' },
  { q: 'Bir oyunda tanımadığın biri sana mesaj yazdı. Ne yaparsın?', a: 'Cevap vermem, büyüğüme gösteririm', w: ['Adresimi yazarım', 'Fotoğrafımı gönderirim', 'Onunla buluşurum'], ex: 'Tanımadığımız kişilerle iletişim kurmayız, büyüğümüze söyleriz.', img: 'phone' },
  { q: 'Arkadaşın sana sürekli lakap takıyor. Ne yaparsın?', a: 'Hoşlanmadığımı söyler, öğretmenime anlatırım', w: ['Ben de ona lakap takarım', 'Kavga ederim', 'Hiç kimseye söylemem'], ex: 'Lakap takmak kişisel alana saygısızlıktır, büyüğümüze söyleriz.', img: 'teacher' },
  { q: 'Arkadaşının çantasına bakmak istiyorsun. Ne yaparsın?', a: 'Önce izin isterim', w: ['Hemen açarım', 'Gizlice bakarım', 'Çantayı alırım'], ex: 'Başkalarının eşyalarına izinle dokunuruz.', img: 'backpack' },
]
const SAYGI_ITEMS: SortQ['items'] = [
  { label: 'İzin isteyerek yaklaşmak', img: 'raisedhand', bin: 'saygi' },
  { label: 'Arkadaşına adıyla seslenmek', img: 'happy', bin: 'saygi' },
  { label: '“Hayır” diyene saygı duymak', img: 'thumbsup', bin: 'saygi' },
  { label: 'Eşyaya izinle dokunmak', img: 'backpack', bin: 'saygi' },
  { label: 'İzinsiz sarılmak', img: 'hug', bin: 'degil' },
  { label: 'Lakap takmak', img: 'angry', bin: 'degil' },
  { label: 'Çantayı izinsiz karıştırmak', img: 'noentry', bin: 'degil' },
  { label: 'Sırada itişmek', img: 'thumbsdown', bin: 'degil' },
]
// 2.3 Trafik
const TRAFIK_MEM: P[] = [
  ['Kırmızı ışık', 'Dur', 'stopsign'],
  ['Yeşil ışık', 'Geç', 'clover'],
  ['Yaya geçidi', 'Yayalar geçer', 'crossing'],
  ['Emniyet kemeri', 'Bizi korur', 'seat'],
  ['Trafik polisi', 'Trafiği düzenler', 'policeofficer'],
  ['Arka koltuk', 'Çocuklar oturur', 'car'],
]
const GUVENLI_HIT = ['Kemer tak', 'Yaya geçidini kullan', 'Kırmızıda dur', 'Sola sağa bak', 'Arka koltuğa otur', 'Üst geçidi kullan']
const GUVENLI_WRONG = ['Yolda koş', 'Kemeri çıkar', 'Kırmızıda geç', 'Şoförle sohbet et']
const YOL_Q: Q[] = [
  { q: 'Ümit servisle okula gidiyor. Ne yapmalı?', a: 'Kemerini takıp sakin oturmalı', w: ['Ayakta durmalı', 'Şoförle sohbet etmeli', 'Pencereden sarkmalı'], ex: 'Yolcuyken kemer takar, sürücünün dikkatini dağıtmayız.', img: 'bus' },
  { q: 'Özlem okula yürüyerek gidiyor. Karşıya nereden geçmeli?', a: 'Yaya geçidinden', w: ['Arabaların arasından', 'Koşarak her yerden', 'Kavşağın ortasından'], ex: 'Yaya geçidi, alt ya da üst geçit kullanırız.', img: 'crossing' },
  { q: 'Çınar annesiyle arabada. Nerede oturmalı?', a: 'Arka koltukta, kemeri takılı', w: ['Ön koltukta', 'Annesinin kucağında', 'Ayakta'], ex: 'Çocuklar arka koltukta, kemeri takılı oturur.', img: 'car' },
  { q: 'Yaya ışığı kırmızı ama yolda araba yok. Ne yaparsın?', a: 'Yeşil yanana kadar beklerim', w: ['Koşarak geçerim', 'Gözümü kapatıp geçerim', 'Arkadaşıma bakıp geçerim'], ex: 'Kırmızı ışıkta her zaman dururuz.', img: 'vtraffic' },
]
// 2.4 Acil
const ACIL_TF: TF[] = [
  ['Acil durumda sakin kalmaya çalışırız.', true, 'Sakin olursak doğru yardımı daha kolay buluruz.'],
  ['Acil Çağrı Merkezi’nin numarası 112’dir.', true, 'Acil durumda 1-1-2 aranır.'],
  ['Kaybolursam tanımadığım birinin arabasına binerim.', false, 'Polis ya da güvenlik görevlisinden yardım isteriz.'],
  ['Gaz kokusu alırsam büyüğüme hemen söylerim.', true, 'Gaz kokusu acil durumdur.'],
  ['Acil durumda saklanıp kimseye söylemem.', false, 'Hemen bir büyüğe haber veririz.'],
  ['Adresimi ve büyüğümün telefonunu bilmek önemlidir.', true, 'Acil durumda bu bilgiler yardım getirir.'],
]
const KART_Q: Q[] = [
  { q: 'Acil Durum Bilgi Kartı’nda hangisi yazar?', a: 'Aranacak yakınımın telefonu', w: ['En sevdiğim renk', 'Sevdiğim çizgi film', 'Oyuncağımın adı'], ex: 'Kartta adımız, adresimiz ve aranacak yakınımızın telefonu yazar.', img: 'memo' },
  { q: 'Fındık acil durum kartına ne yazmalı?', a: 'Ev adresini', w: ['En sevdiği yemeği', 'Arkadaşının oyununu', 'Hayalindeki tatili'], ex: 'Acil durum kartında ev adresi bulunur.', img: 'house' },
  { q: 'Acil Durum Bilgi Kartı’nı kimle doldururuz?', a: 'Ailemizle birlikte', w: ['İnternetteki biriyle', 'Tanımadığımız biriyle', 'Tek başımıza internete yazarak'], ex: 'Kartı ailemizle birlikte doldurur, güvenli yerde saklarız.', img: 'hug' },
]
// 3.1 Aile
const AKRABA_P: P[] = [
  ['Anneanne', 'Annemin annesi', 'oldwoman'],
  ['Babaanne', 'Babamın annesi', 'oldwoman'],
  ['Teyze', 'Annemin kız kardeşi', 'woman'],
  ['Hala', 'Babamın kız kardeşi', 'woman'],
  ['Dayı', 'Annemin erkek kardeşi', 'man'],
  ['Amca', 'Babamın erkek kardeşi', 'man'],
]
const AILECE_HIT = ['Birlikte oyun', 'Masal dinlemek', 'Sofrada sohbet', 'Hastayla ilgilenmek', 'Bayramda buluşmak', 'Birlikte yürüyüş']
const AILECE_WRONG = ['Küsmek', 'Kimseyle konuşmamak', 'Kavga etmek', 'Yalnız kalmak']
// 3.2 Nezaket
const NEZAKET_HIT = ['Lütfen', 'Teşekkür ederim', 'Günaydın', 'Afiyet olsun', 'Özür dilerim', 'Rica ederim', 'Elinize sağlık']
const NEZAKET_WRONG = ['Çekil!', 'Ver şunu!', 'Bana ne!', 'Git!']
const GORGU_Q: Q[] = [
  { q: 'Sofrada tuzu istiyorsun. Ne dersin?', a: 'Tuzu uzatır mısın, lütfen?', w: ['Tuz!', 'Ver tuzu!', 'Hiçbir şey demem, uzanırım'], ex: 'İsterken “lütfen” deriz.', img: 'forkplate' },
  { q: 'Biri sana teşekkür etti. Ne dersin?', a: 'Rica ederim', w: ['Bana ne!', 'Git!', 'Hiçbir şey'], ex: 'Teşekküre “Rica ederim” diye karşılık veririz.', img: 'happy' },
  { q: 'Yanlışlıkla kardeşinin oyuncağını düşürdün. Ne dersin?', a: 'Özür dilerim', w: ['Senin suçun!', 'Umurumda değil', 'Hiçbir şey'], ex: 'Hata yapınca özür dileriz.', img: 'sad' },
  { q: 'Yemek bitti, herkes kalkıyor. Sen ne yaparsın?', a: 'Ben de kalkıp toplamaya yardım ederim', w: ['Oturmaya devam ederim', 'Tabağımı bırakıp giderim', 'Televizyona koşarım'], ex: 'Sofradan birlikte kalkar, birlikte toplarız.', img: 'forkplate' },
  { q: 'Büyüklerimiz konuşurken ne yaparız?', a: 'Sözlerini bitirmelerini bekleriz', w: ['Araya gireriz', 'Bağırırız', 'Gülüp alay ederiz'], ex: 'Büyüklerimize saygılı oluruz.', img: 'oldman' },
]
// 3.3 Görev
const KOY_Q: Q[] = [
  { q: 'Ahmet köyde hayvanlara yardım ediyor. Ne yapabilir?', a: 'Tavuklara yem ve su vermek', w: ['Traktör kullanmak', 'Ocakta yemek pişirmek', 'Ağaç kesmek'], ex: 'Çocuklar hayvanlara yem ve su vererek yardım edebilir.', img: 'chicken' },
  { q: 'Evcil kedinin bakımı için ne yapabilirsin?', a: 'Suyunu ve mamasını vermek', w: ['Onu yalnız bırakmak', 'Kuyruğunu çekmek', 'Hiçbir şey'], ex: 'Evcil hayvanımızın bakımını üstlenebiliriz.', img: 'cat' },
  { q: 'Sabah uyanınca hangi görevi yapabilirsin?', a: 'Yatağımı toplamak', w: ['Faturaları ödemek', 'Araba yıkamak', 'Market alışverişi'], ex: 'Yatağımızı toplamak bizim görevimiz olabilir.', img: 'bed' },
  { q: 'Herkes görevini yapınca ne olur?', a: 'Ev düzenli olur', w: ['Ev dağılır', 'Herkes yorulur', 'Kavga çıkar'], ex: 'İş bölümü düzen sağlar.', img: 'housegarden' },
]
const GOREV_O: O[] = [
  { q: 'Çiçek sulama adımlarını sırala.', s: ['Sulama kabını al', 'Suyla doldur', 'Çiçeğin dibine dök', 'Kabı yerine koy'], ex: 'Görevimizi düzenli yaparız.', img: 'plantpot' },
  { q: 'Oyuncak toplama adımlarını sırala.', s: ['Oyuncakları yerden topla', 'Türlerine göre ayır', 'Kutularına yerleştir', 'Kutuyu rafa koy'], ex: 'Düzenli bir oda herkesi mutlu eder.', img: 'teddy' },
  { q: 'Sofrayı toplama adımlarını sırala.', s: ['Tabakları üst üste koy', 'Mutfağa taşı', 'Masayı sil', 'Sandalyeleri düzelt'], ex: 'Sofrayı birlikte toplarız.', img: 'forkplate' },
]
// 4.1 Ülke
const ULKE_Q2: Q[] = [
  { q: 'Türk lirasının sembolü hangisi?', a: '₺', w: ['$', '€', '£'], ex: 'Türk lirasının sembolü ₺, kısaltması TL’dir.', img: 'coin' },
  { q: 'Anıtkabir hangi şehrimizde?', a: 'Ankara', w: ['Trabzon', 'Denizli', 'Hatay'], ex: 'Anıtkabir başkentimiz Ankara’dadır.', img: 'classical' },
  { q: 'Hamsi tava hangi şehrimizin yemeğidir?', a: 'Trabzon', w: ['Van', 'Denizli', 'Bolu'], ex: 'Hamsi tava Trabzon’un yöresel lezzetidir.', img: 'fish' },
  { q: 'Hangisi bir yöresel yiyecektir?', a: 'Künefe', w: ['Van Gölü', 'Ulu Cami', 'Pamukkale'], ex: 'Künefe Hatay’ın yöresel yiyeceğidir.', img: 'cake' },
  { q: 'Van Gölü nedir?', a: 'Doğal güzellik', w: ['Tarihî yapı', 'Yöresel yemek', 'Bayram'], ex: 'Göller, dağlar, ormanlar doğal güzelliklerdir.', img: 'wave' },
  { q: 'Bolu’da hangi yöresel oyun oynanır?', a: 'Kaşık oyunu', w: ['Saklambaç', 'Futbol', 'Satranç'], ex: 'Bolu’da yöresel kıyafetlerle kaşık oyunu oynanır.', img: 'music' },
]
// 4.2 Bayrak ve marş
const BAYRAK_TF: TF[] = [
  ['Bayrağımız kırmızı zemin üzerinde beyaz ay ve yıldızdır.', true, 'Ay yıldızlı al bayrağımız.'],
  ['İstiklâl Marşı okunurken oturup sohbet ederiz.', false, 'Hazır olda, saygıyla dururuz.'],
  ['Bayrağımız ve marşımız bağımsızlığımızın sembolüdür.', true, 'İkisi de en önemli değerlerimizdendir.'],
  ['İstiklâl Marşı’nın sözlerini Mehmet Âkif Ersoy yazdı.', true, 'Millî şairimiz Mehmet Âkif Ersoy.'],
  ['Bayrağımız mavi renklidir.', false, 'Bayrağımız kırmızı ve beyazdır.'],
  ['Okulda bayrak törenleri yapılır.', true, 'Törenlerde marşımızı coşkuyla söyleriz.'],
]
const TOREN_O: O[] = [
  { q: 'Bayrak törenini sırala.', s: ['Sıraya gir', 'Hazır olda dur', 'Bayrak göndere çekilir', 'İstiklâl Marşı’nı saygıyla söyle'], ex: 'Törende hazır olda, saygıyla dururuz.', img: 'trflag' },
]
// 4.3 Atatürk
const ATA_TF: TF[] = [
  ['Atatürk Selanik’te doğdu.', true, 'Pembe boyalı bir evde doğdu.'],
  ['Atatürk’ün annesinin adı Zübeyde Hanım’dır.', true, 'Babasının adı Ali Rıza Bey’dir.'],
  ['Atatürk kitap okumayı hiç sevmezdi.', false, 'Kitap okumaya çok meraklıydı.'],
  ['Atatürk Cumhuriyetimizin kurucusudur.', true, 'Cumhuriyetimizi o kurdu.'],
  ['Anıtkabir Samsun’dadır.', false, 'Anıtkabir Ankara’dadır.'],
  ['Atatürk düzenli ve planlı çalışırdı.', true, 'Azimli çalışarak büyük başarılar kazandı.'],
  ['Atatürk doğayı korumayı önemserdi.', true, 'Doğayı ve insanları çok severdi.'],
]
// 4.4 Belirli günler
const GUNLER_P: P[] = [
  ['4 Ekim', 'Hayvanları Koruma Günü', 'paw'],
  ['24 Kasım', 'Öğretmenler Günü', 'teacher'],
  ['22 Mart', 'Dünya Su Günü', 'droplet'],
  ['12 Mart', 'İstiklâl Marşı’nın kabulü', 'scroll'],
  ['10 Kasım', 'Atatürk’ü anma', 'star'],
  ['20 Kasım', 'Dünya Çocuk Hakları Günü', 'balloon'],
]
const TAKVIM_O: O[] = [
  { q: 'Bayramları takvim sırasına diz (yılbaşından başla).', s: ['23 Nisan', '19 Mayıs', '30 Ağustos', '29 Ekim'], ex: 'Nisan, Mayıs, Ağustos, Ekim.', img: 'calendar' },
]
const KUTLAMA_HIT = ['Bayrak asmak', 'Şiir okumak', 'Halk oyunu', 'Koroda şarkı', 'Marşı söylemek', 'Pano süslemek']
const KUTLAMA_WRONG = ['Ödev saklamak', 'Uyumak', 'Kavga etmek', 'Çöp atmak']
// 4.5 Dinî bayram
const DINI_TF: TF[] = [
  ['Bayramlarda büyüklerimizi ziyaret ederiz.', true, 'Ziyaret, sevdiklerimizle bağımızı güçlendirir.'],
  ['Uzaktaki yakınlarımızı bayramda arayabiliriz.', true, 'Telefon edebilir ya da tebrik kartı gönderebiliriz.'],
  ['Bayramda kimseyle konuşmayız.', false, 'Bayramlar paylaşma ve bir araya gelme zamanıdır.'],
  ['Bayramlarda yardımlaşırız.', true, 'Dayanışma ve yardımlaşma içinde oluruz.'],
  ['Ramazan Bayramı millî bir bayramdır.', false, 'Ramazan Bayramı dinî bir bayramdır.'],
]
const HAZIRLIK_O: O[] = [
  { q: 'Bayram hazırlığını sırala.', s: ['Bayram temizliği yap', 'İkramlıkları hazırla', 'Bayramlıklarını giy', 'Büyüklerini ziyaret et'], ex: 'Hazırlıktan sonra ziyaretler başlar.', img: 'gift' },
]
// 5.1 Doğa
const DOGA_MEM: P[] = [
  ['Kelebek', 'Kanatlı böcek', 'butterfly'],
  ['Arı', 'Bal yapar', 'bee'],
  ['Ağaç', 'Gölge verir', 'tree'],
  ['Taş', 'Cansız varlık', 'stone'],
  ['Kuş', 'Gökyüzünde uçar', 'bird'],
  ['Çiçek', 'Güzel kokar', 'flower'],
]
const GOZLEM_Q: Q[] = [
  { q: 'Gözlem yapmadan önce ne yaparız?', a: 'Neyi merak ettiğimizi belirleriz', w: ['Hemen eve döneriz', 'Gözümüzü kaparız', 'Hiçbir şey'], ex: 'Merak ettiğimizi bilirsek daha iyi gözlem yaparız.', img: 'thinking' },
  { q: 'Gözlemimizi nasıl kaydederiz?', a: 'Resim çizerek ya da not alarak', w: ['Unutarak', 'Bağırarak', 'Koparıp götürerek'], ex: 'Not alır, resim çizer ya da fotoğraf çekeriz.', img: 'memo' },
  { q: 'Küçük böcekleri yakından görmek için ne kullanırız?', a: 'Büyüteç', w: ['Şemsiye', 'Kaşık', 'Top'], ex: 'Büyüteç küçük şeyleri büyük gösterir.', img: 'magnifier' },
  { q: 'Hayvanları Koruma Günü hangi gün?', a: '4 Ekim', w: ['29 Ekim', '23 Nisan', '19 Mayıs'], ex: '4 Ekim’de hayvan dostlarımızın ihtiyaçlarını önemseriz.', img: 'paw' },
  { q: 'Doğadaki varlıklara nasıl davranırız?', a: 'Merhametli ve duyarlı', w: ['Kaba ve sert', 'İlgisiz', 'Korkutucu'], ex: 'Doğayı tanır, sever ve koruruz.', img: 'heart' },
]
// 5.2 Gökyüzü
const GUNDUZ_ITEMS: SortQ['items'] = [
  { label: 'Güneş görünür', img: 'sun', bin: 'gunduz' },
  { label: 'Okula gideriz', img: 'school', bin: 'gunduz' },
  { label: 'Gökyüzü aydınlık', img: 'cloudsun', bin: 'gunduz' },
  { label: 'Parkta oynarız', img: 'ball', bin: 'gunduz' },
  { label: 'Ay parlar', img: 'crescent', bin: 'gece' },
  { label: 'Yıldızlar görünür', img: 'star', bin: 'gece' },
  { label: 'Uyuruz', img: 'bed', bin: 'gece' },
  { label: 'Gökyüzü karanlık', img: 'milkyway', bin: 'gece' },
]
const ROKET_O: O[] = [
  { q: 'Roket kalkıyor! Geri sayımı sırala.', s: ['5', '4', '3', '2', '1', '0'], ex: 'Geri sayım büyükten küçüğe yapılır: 5, 4, 3, 2, 1, 0!', img: 'rocket' },
  { q: 'Uzay yolculuğunu sırala.', s: ['Astronot kıyafetini giy', 'Rokete bin', 'Geri sayım yap', 'Uzaya çık'], ex: 'İlk Türk astronot da böyle uzaya çıktı.', img: 'rocket' },
]
// 5.3 Afet
const AFET_TF: TF[] = [
  ['Deprem, sel ve çığ birer afettir.', true, 'Afetler çevreye büyük zarar veren olaylardır.'],
  ['Gökkuşağı bir afettir.', false, 'Gökkuşağı güzel bir doğa olayıdır.'],
  ['Dikkatsizlik orman yangınına yol açabilir.', true, 'Ateşle oynamayız, büyüklerimiz de dikkatli olur.'],
  ['Yağışın çok artması sele yol açabilir.', true, 'Çok yağmur sel ve heyelana neden olabilir.'],
  ['Afetlere karşı hazırlıklı olmak önemlidir.', true, 'Büyüklerimiz ve öğretmenimiz ne yapacağımızı bilir.'],
  ['Çığ, denizde olur.', false, 'Çığ, karın dağdan kaymasıdır.'],
]
const OLAY_ITEMS: SortQ['items'] = [
  { label: 'Hafif yağmur', img: 'rain', bin: 'olay' },
  { label: 'Kar yağışı', img: 'snowman', bin: 'olay' },
  { label: 'Gökkuşağı', img: 'rainbow', bin: 'olay' },
  { label: 'Güneşli hava', img: 'sun', bin: 'olay' },
  { label: 'Deprem', img: 'house', bin: 'afet' },
  { label: 'Sel', img: 'storm', bin: 'afet' },
  { label: 'Çığ', img: 'snowflake', bin: 'afet' },
  { label: 'Heyelan', img: 'mountain', bin: 'afet' },
  { label: 'Orman yangını', img: 'fire', bin: 'afet' },
]
// 5.4 Geri dönüşüm
const GERI_Q: Q[] = [
  { q: 'Biten piller hangi kutuya atılır?', a: 'Kırmızı atık pil kutusuna', w: ['Mavi kutuya', 'Sarı kutuya', 'Çöpe'], ex: 'Piller kırmızı atık pil kutusuna atılır.', img: 'battery' },
  { q: 'Gazete hangi renk kutuya atılır?', a: 'Mavi', w: ['Yeşil', 'Sarı', 'Gri'], ex: 'Kâğıt atıklar mavi kutuya.', img: 'newspaper' },
  { q: 'Reçel kavanozu hangi renk kutuya atılır?', a: 'Yeşil', w: ['Mavi', 'Sarı', 'Gri'], ex: 'Cam atıklar yeşil kutuya.', img: 'jar' },
  { q: 'Pet şişe hangi renk kutuya atılır?', a: 'Sarı', w: ['Mavi', 'Yeşil', 'Gri'], ex: 'Plastik atıklar sarı kutuya.', img: 'soda' },
  { q: 'Konserve kutusu hangi renk kutuya atılır?', a: 'Gri', w: ['Mavi', 'Yeşil', 'Sarı'], ex: 'Metal atıklar gri kutuya.', img: 'can' },
  { q: 'Geri dönüşüm ne demektir?', a: 'Atıkların yeniden kullanılır hâle gelmesi', w: ['Çöpleri yakmak', 'Her şeyi atmak', 'Eşyaları saklamak'], ex: 'Geri dönüşüm atıkları yeniden kullanılır hâle getirir.', img: 'recycle' },
]
const DONUSUM_O: O[] = [
  { q: 'Bir içecek kutusunun yolculuğunu sırala.', s: ['Kutuyu ayır', 'Gri kutuya at', 'Geri dönüşüm merkezine gider', 'Yeni bir kutu olur'], ex: 'Geri dönüşümle atıklar yeniden kullanılır.', img: 'recycle' },
]
// 6.1 Bilim
const BILIM_TF: TF[] = [
  ['Bilim merakla başlar.', true, 'Merak etmek bilimin ilk adımıdır.'],
  ['Cevabı hemen bulamazsak vazgeçeriz.', false, 'Sabırla araştırmaya devam ederiz.'],
  ['Su ile sıvı yağ karışır.', false, 'Karışmaz, yağ suyun üstünde kalır.'],
  ['Mikroskop küçük şeyleri büyük gösterir.', true, 'Yaprak gibi küçük şeyleri inceleriz.'],
  ['Araştırırken yeni sorular ortaya çıkabilir.', true, 'Her cevap yeni bir merak getirebilir.'],
  ['Deney yaparken büyüklerimizden yardım alırız.', true, 'Deneyleri güvenle yaparız.'],
]
const MALZEME_HIT = ['İp', 'Balon', 'Pipet', 'Bant']
const MALZEME_WRONG = ['Elma', 'Yastık', 'Ayakkabı', 'Kaşık']
const ARAC_MEM: P[] = [
  ['Mikroskop', 'Çok küçükleri büyütür', 'microscope'],
  ['Büyüteç', 'Yakından bakarız', 'magnifier'],
  ['Teleskop', 'Gökyüzünü gözleriz', 'telescope'],
  ['Deney tüpü', 'Deney yaparız', 'testtube'],
  ['Termometre', 'Sıcaklığı ölçer', 'thermometer'],
  ['Mıknatıs', 'Demiri çeker', 'magnet'],
]
// 6.2 Teknoloji
const ESKI_P: P[] = [
  ['Mektup', 'Telefon', 'memo', 'phone'],
  ['Mum', 'Ampul', 'candle', 'bulb'],
  ['At arabası', 'Otobüs', 'horse', 'bus'],
  ['Abaküs', 'Bilgisayar', 'abacus', 'laptop'],
  ['Kayık', 'Gemi', 'wave', 'ship'],
]
const TEKNO_HIT = ['Telefon', 'Bilgisayar', 'Robot', 'Uçak', 'Televizyon', 'Roket', 'Uydu']
const TEKNO_WRONG = ['Taş', 'Yaprak', 'Elma', 'Çiçek']
const TEKNO_IMG: Record<string, string> = { Telefon: 'phone', Bilgisayar: 'laptop', Robot: 'robot', Uçak: 'airplane', Televizyon: 'television', Roket: 'rocket', Uydu: 'satellite', Taş: 'stone', Yaprak: 'leaf', Elma: 'apple', Çiçek: 'flower' }
// 6.3 Sanat
const EBRU_O: O[] = [
  { q: 'Ebru yapalım! Adımları sırala.', s: ['Kaba su koy', 'Boyaları damlat', 'Desen çiz', 'Kâğıdı suya bırak', 'Kâğıdı kaldır, kurut'], ex: 'Ebruda desen su yüzeyinde oluşur.', img: 'paint' },
  { q: 'Resim yapalım! Adımları sırala.', s: ['Ne çizeceğine karar ver', 'Kalemle çiz', 'Boyalarla boya', 'Resmini panoya as'], ex: 'Sanatçılar hayal gücüyle özgün eserler üretir.', img: 'palette' },
]
const BTS_ITEMS: SortQ['items'] = [
  { label: 'Resim', img: 'palette', bin: 'sanat' },
  { label: 'Müzik', img: 'music', bin: 'sanat' },
  { label: 'Ebru', img: 'paint', bin: 'sanat' },
  { label: 'Tiyatro', img: 'theater', bin: 'sanat' },
  { label: 'Deney', img: 'testtube', bin: 'bilim' },
  { label: 'Gözlem', img: 'magnifier', bin: 'bilim' },
  { label: 'Mikroskopla inceleme', img: 'microscope', bin: 'bilim' },
  { label: 'Tablet', img: 'laptop', bin: 'tekno' },
  { label: 'Robot', img: 'robot', bin: 'tekno' },
  { label: 'İnsansız hava aracı', img: 'airplane', bin: 'tekno' },
]

const EK: Record<string, Act[]> = {
  a1: [
    { kind: 'kibar-balon', title: 'Kibar Tanışma Balonları', icon: 'happy', total: 4, meb: 'HB.1.1.1', gen: pop('Kibar tanışma davranışlarını patlat!', 'Gülümser, göz teması kurar, “Merhaba” der ve dinleriz.', KIBAR_HIT, KIBAR_WRONG, KIBAR_IMG), ders: 'Kibar bir tanışmada gülümseriz, göz teması kurarız, dikkatle dinleriz.', visual: img('happy') },
    { kind: 'ortak-yonler', title: 'Ortak Yönlerimiz', icon: 'friends', total: T, meb: 'HB.1.1.1', gen: rot(ch(ORTAK_Q), tf(TANISMA_TF)), ders: 'Arkadaşlarımızla ortak yönlerimizi bulur, nazik ve anlayışlı davranırız.', visual: img('friends') },
    { kind: 'okul-davranis', title: 'Okulda Nasıl Davranırız?', icon: 'books', total: T, meb: 'HB.1.1.2', gen: rot(ch(DAVRANIS_Q), mem('Okul kartlarını eşleştir!', 'Okulda herkesin ve her yerin bir görevi var.', OKUL_P)), ders: 'Kütüphanede sessiz oluruz, kantinde sıra bekleriz, tuvaleti temiz bırakırız.', visual: img('books') },
    { kind: 'okul-balon', title: 'Okulumuzun Bölümleri', icon: 'school', total: 3, meb: 'HB.1.1.2', gen: pop('Okulumuzdaki bölümleri patlat!', 'Sınıf, kütüphane, kantin, lavabo, müdür odası ve öğretmenler odası okulumuzdadır.', BOLUM_HIT, BOLUM_WRONG), ders: 'Okulumuz birçok bölümden oluşur.', visual: img('school') },
    { kind: 'oyun-kurallari', title: 'Oyunların da Kuralı Var', icon: 'puzzle', total: T, meb: 'HB.1.1.3', gen: rot(ch(OYUN_KURAL_Q), tf(KURAL_TF)), ders: 'Oyunlarda sıramızı bekleriz, kaybedince arkadaşımızı tebrik ederiz. Kuralları birlikte belirleriz.', visual: img('puzzle') },
    { kind: 'kural-balon', title: 'Kural Balonları', icon: 'balloon', total: 3, meb: 'HB.1.1.3', gen: pop('Kurala uygun davranışları patlat!', 'Söz alır, sıra bekler, çöpü kutuya atarız.', KURAL_HIT, KURAL_WRONG), ders: 'Kurallara uyan davranışları bul!', visual: img('balloon') },
    { kind: 'ozellik-duygu', title: 'Özellik mi, Duygu mu?', icon: 'glasses', total: 4, meb: 'HB.1.1.4', gen: srt('Fiziksel özellik mi, duygu mu? Sepetlere ayır.', 'Saç, göz rengi, boy fiziksel özelliktir; mutluluk, üzüntü duygudur.', [{ id: 'fiziksel', label: 'Fiziksel özellik', img: 'glasses', color: '#3b82f6' }, { id: 'duygu', label: 'Duygu', img: 'happy', color: '#f59e0b' }], OZELLIK_ITEMS), ders: 'Görünüşümüz fiziksel özelliklerimizdir; içimizden geçenler ise duygularımızdır.', visual: img('glasses') },
    { kind: 'buyuyorum', title: 'Büyüyorum', icon: 'ruler', total: T, meb: 'HB.1.1.4', gen: tf(BUYUME_TF, 'ruler'), ders: 'Büyürken boyumuz uzar. Herkes farklıdır ve bütün duygular normaldir.', visual: img('ruler') },
  ],
  a2: [
    { kind: 'saglik-sorulari', title: 'Sağlık Soruları', icon: 'toothbrush', total: T, meb: 'HB.1.2.1', gen: rot(ch(SAGLIK_Q), mem('Sağlık kartlarını eşleştir!', 'Her araç sağlığımız için bir işe yarar.', SAGLIK_MEM)), ders: 'Kahvaltı enerji verir; diş fırçalamak dişleri, el yıkamak bizi mikroplardan korur.', visual: img('toothbrush') },
    { kind: 'kahvalti', title: 'Kahvaltı Sofrası', icon: 'egg', total: 3, meb: 'HB.1.2.1', gen: pop('Sağlıklı kahvaltılıkları patlat!', 'Süt, peynir, yumurta, ekmek ve domates güne güçlü başlatır.', KAHVALTI_HIT, KAHVALTI_WRONG, KAHVALTI_IMG), ders: 'Kahvaltımızı yaparız, öğün atlamayız.', visual: img('egg') },
    { kind: 'ne-yapmali', title: 'Ne Yapmalıyım?', icon: 'raisedhand', total: T, meb: 'HB.1.2.2', gen: rot(ch(KISISEL_Q2), ch(KISISEL_Q)), ders: 'İstemediğimiz şeye “Hayır” deriz, tanımadığımız kişilerle iletişim kurmayız, büyüğümüze söyleriz.', visual: img('raisedhand') },
    { kind: 'saygi', title: 'Saygı Sepetleri', icon: 'handshake', total: 4, meb: 'HB.1.2.2', gen: srt('Kişisel alana saygılı mı? Sepetlere ayır.', 'İzin istemek saygıdır; izinsiz dokunmak ve lakap takmak saygısızlıktır.', [{ id: 'saygi', label: 'Saygılı', img: 'thumbsup', color: '#22c55e' }, { id: 'degil', label: 'Saygısız', img: 'thumbsdown', color: '#ef4444' }], SAYGI_ITEMS), ders: 'Biz de başkalarının kişisel alanına saygı gösteririz.', visual: img('handshake') },
    { kind: 'yol-sahneleri', title: 'Okul Yolunda', icon: 'bus', total: T, meb: 'HB.1.2.3', gen: rot(ch(YOL_Q), mem('Trafik kartlarını eşleştir!', 'Trafikteki işaretler ve anlamları.', TRAFIK_MEM)), ders: 'Kimi servisle, kimi yürüyerek, kimi arabayla okula gider. Herkes kurallara uyar.', visual: img('bus') },
    { kind: 'trafik-balon', title: 'Güvenli Trafik Balonları', icon: 'vtraffic', total: 3, meb: 'HB.1.2.3', gen: pop('Güvenli davranışları patlat!', 'Kemer takar, yaya geçidini kullanır, kırmızıda dururuz.', GUVENLI_HIT, GUVENLI_WRONG), ders: 'Trafikte güvenli davranışları bul!', visual: img('vtraffic') },
    { kind: 'acil-dogru', title: 'Acil Durumda Doğrular', icon: 'telephone', total: T, meb: 'HB.1.2.4', gen: rot(tf(ACIL_TF, 'telephone'), ch(KART_Q)), ders: 'Sakin kalırız, büyüğümüze söyleriz. Adresimizi ve büyüğümüzün telefonunu biliriz. Kartı ailemizle doldururuz.', visual: img('telephone') },
    { kind: 'yardim-hafiza', title: 'Yardım Hafızası', icon: 'policeofficer', total: 3, meb: 'HB.1.2.4', gen: mem('Durumu yardım edecek kişiyle eşleştir!', 'Kimden yardım isteyeceğimizi biliriz.', ACIL_P), ders: 'Kartları çevir: hangi durumda kimden yardım isteriz?', visual: img('policeofficer') },
  ],
  a3: [
    { kind: 'akrabalar', title: 'Geniş Ailem', icon: 'oldwoman', total: T, meb: 'HB.1.3.1', gen: rot(mt('Akrabayı doğru açıklamayla eşleştir.', 'Anneanne annemin annesi, hala babamın kız kardeşidir.', AKRABA_P), mem('Akraba kartlarını eşleştir!', 'Geniş ailemizin bireyleri.', AKRABA_P)), ders: 'Geniş ailede anneanne, babaanne, dede, teyze, hala, dayı, amca gibi büyüklerimiz de olabilir.', visual: img('oldwoman') },
    { kind: 'ailece', title: 'Ailece Neler Yaparız?', icon: 'puzzle', total: 3, meb: 'HB.1.3.1', gen: pop('Ailece yaptığımız güzel şeyleri patlat!', 'Oyun oynar, masal dinler, sofrada sohbet ederiz.', AILECE_HIT, AILECE_WRONG), ders: 'Ailece oyun oynar, masal dinler, bayramlarda bir araya geliriz.', visual: img('puzzle') },
    { kind: 'nezaket-balon', title: 'Nezaket Balonları', icon: 'sparkles', total: 3, meb: 'HB.1.3.2', gen: pop('Nezaket sözcüklerini patlat!', 'Lütfen, teşekkür ederim, özür dilerim, rica ederim…', NEZAKET_HIT, NEZAKET_WRONG), ders: 'Nezaket sözcükleri sihirli gibidir: herkesi mutlu eder.', visual: img('sparkles') },
    { kind: 'gorgu-sahneleri', title: 'Sofrada ve Evde', icon: 'forkplate', total: T, meb: 'HB.1.3.2', gen: ch(GORGU_Q), ders: 'Sofrada “lütfen” der, büyüklerimizi dinler, hata yapınca özür dileriz.', visual: img('forkplate') },
    { kind: 'koyde', title: 'Ahmet’in Köyünde', icon: 'chicken', total: T, meb: 'HB.1.3.3', gen: rot(ch(KOY_Q), tf(GOREV_TF)), ders: 'Ahmet köyde hayvanlara yem ve su verir. Her çocuk evde bir göreve yardım edebilir.', visual: img('chicken') },
    { kind: 'gorev-adim', title: 'Görev Adımları', icon: 'plantpot', total: 4, meb: 'HB.1.3.3', gen: ord(GOREV_O), ders: 'Görevlerimizi adım adım, düzenli yaparız.', visual: img('plantpot') },
  ],
  a4: [
    { kind: 'ulke-bilgi', title: 'Ülkemi Tanıyorum', icon: 'globe', total: T, meb: 'HB.1.4.1', gen: rot(ch(ULKE_Q2), mem('Şehir kartlarını eşleştir!', 'Şehirlerimizin güzellikleri.', SEHIR_P)), ders: 'Türk lirasının sembolü ₺. Her şehrimizin tarihî yerleri, doğal güzellikleri ve lezzetleri vardır.', visual: img('globe') },
    { kind: 'bayrak-dy', title: 'Bayrak ve Marş Doğruları', icon: 'trflag', total: T, meb: 'HB.1.4.2', gen: rot(tf(BAYRAK_TF, 'trflag'), ord(TOREN_O)), ders: 'Bayrak törenlerinde hazır olda durur, İstiklâl Marşı’nı saygı ve coşkuyla söyleriz.', visual: img('trflag') },
    { kind: 'ataturk-dy', title: 'Atatürk Bilgi Yarışması', icon: 'medal', total: T, meb: 'HB.1.4.3', gen: rot(tf(ATA_TF, 'star'), mem('Atatürk kartlarını eşleştir!', 'Atatürk’ün hayatından bilgiler.', ATA_P)), ders: 'Atatürk Selanik’te doğdu, Cumhuriyetimizi kurdu. Bilime, sanata, spora ve doğaya meraklıydı.', visual: img('medal') },
    { kind: 'belirli-gunler', title: 'Belirli Günler Takvimi', icon: 'calendar', total: T, meb: 'HB.1.4.4', gen: rot(mt('Günü adıyla eşleştir.', 'Okul yılı boyunca birçok belirli gün ve haftayı anarız, kutlarız.', GUNLER_P), ord(TAKVIM_O)), ders: '4 Ekim Hayvanları Koruma Günü, 24 Kasım Öğretmenler Günü, 22 Mart Dünya Su Günü…', visual: img('calendar') },
    { kind: 'kutlama', title: 'Kutlama Balonları', icon: 'confetti', total: 3, meb: 'HB.1.4.4', gen: pop('Bayram kutlamasında yaptıklarımızı patlat!', 'Bayrak asar, şiir okur, halk oyunu oynar, marşımızı söyleriz.', KUTLAMA_HIT, KUTLAMA_WRONG), ders: 'Millî bayramlarda okulumuzu süsler, coşkuyla kutlarız.', visual: img('confetti') },
    { kind: 'bayram-hazirlik', title: 'Bayram Hazırlığı', icon: 'gift', total: T, meb: 'HB.1.4.5', gen: rot(tf(DINI_TF, 'gift'), ord(HAZIRLIK_O)), ders: 'Bayramdan önce temizlik yapar, ikram hazırlarız. Bayramda büyüklerimizi ziyaret ederiz.', visual: img('gift') },
  ],
  a5: [
    { kind: 'doga-kartlari', title: 'Doğa Kartları', icon: 'butterfly', total: 3, meb: 'HB.1.5.1', gen: mem('Doğa kartlarını eşleştir!', 'Doğadaki varlıkları tanıyalım.', DOGA_MEM), ders: 'Kartları çevir, doğadaki varlıkları özellikleriyle eşleştir.', visual: img('butterfly') },
    { kind: 'gozlem', title: 'Küçük Gözlemci', icon: 'magnifier', total: T, meb: 'HB.1.5.1', gen: rot(ch(GOZLEM_Q), tf(GEZI_TF)), ders: 'Gözlemden önce neyi merak ettiğimizi belirleriz, gözlemimizi resimle ya da notla kaydederiz.', visual: img('magnifier') },
    { kind: 'gunduz-gece', title: 'Gündüz mü, Gece mi?', icon: 'crescent', total: 4, meb: 'HB.1.5.2', gen: rot(srt('Gündüz mü, gece mi? Sepetlere ayır.', 'Güneş’i gündüz, Ay’ı ve yıldızları gece görürüz.', [{ id: 'gunduz', label: 'Gündüz', img: 'sun', color: '#f59e0b' }, { id: 'gece', label: 'Gece', img: 'crescent', color: '#6366f1' }], GUNDUZ_ITEMS), mem('Gök kartlarını eşleştir!', 'Güneş, Dünya ve Ay.', GOK_MEM)), ders: 'Gündüz Güneş aydınlatır; gece Ay ve yıldızlar parlar.', visual: img('crescent') },
    { kind: 'uzay', title: 'Uzay Yolculuğu', icon: 'rocket', total: 4, meb: 'HB.1.5.2', gen: rot(ord(ROKET_O), tf(GOK_TF)), ders: 'İlk Türk astronot uzaya çıktı! Roket kalkmadan önce geri sayım yapılır.', visual: img('rocket') },
    { kind: 'afet-dy', title: 'Afetler Doğru mu?', icon: 'house', total: T, meb: 'HB.1.5.3', gen: tf(AFET_TF, 'storm'), ders: 'Afetlerin nedenlerini öğrenir, hazırlıklı oluruz. Büyüklerimiz ve öğretmenimiz bize yol gösterir.', visual: img('storm') },
    { kind: 'olay-afet', title: 'Doğa Olayı mı, Afet mi?', icon: 'rainbow', total: 4, meb: 'HB.1.5.3', gen: srt('Doğa olayı mı, afet mi? Sepetlere ayır.', 'Hafif yağmur ve gökkuşağı doğa olayıdır; sel ve deprem afettir.', [{ id: 'olay', label: 'Doğa olayı', img: 'rainbow', color: '#22c55e' }, { id: 'afet', label: 'Afet', img: 'storm', color: '#ef4444' }], OLAY_ITEMS), ders: 'Her doğa olayı afet değildir. Afet, büyük zarar veren olaydır.', visual: img('rainbow') },
    { kind: 'kutu-sorulari', title: 'Hangi Kutuya?', icon: 'battery', total: T, meb: 'HB.1.5.4', gen: rot(ch(GERI_Q), ord(DONUSUM_O), mem('Atık ve kutu kartlarını eşleştir!', 'Her atığın bir kutusu var.', KUTU_P)), ders: 'Kâğıt mavi, plastik sarı, cam yeşil, metal gri, pil kırmızı kutuya!', visual: img('battery') },
  ],
  a6: [
    { kind: 'bilim-dy', title: 'Bilim Doğruları', icon: 'testtube', total: T, meb: 'HB.1.6.1', gen: rot(tf(BILIM_TF, 'testtube'), pop('Balon roket deneyinin malzemelerini patlat!', 'İp, balon, pipet ve bant kullanırız.', MALZEME_HIT, MALZEME_WRONG)), ders: 'Bilim merakla başlar. Deneyleri büyüklerimizle, güvenle yaparız.', visual: img('testtube') },
    { kind: 'bilim-araclari', title: 'Bilim Araçları', icon: 'telescope', total: 4, meb: 'HB.1.6.1', gen: rot(mem('Bilim araçlarını eşleştir!', 'Her aracın bir işi var.', ARAC_MEM), mt('Aracı işiyle eşleştir.', 'Mikroskop büyütür, teleskopla gökyüzünü gözleriz.', ARAC_MEM)), ders: 'Bilim insanları mikroskop, büyüteç, teleskop gibi araçlar kullanır.', visual: img('telescope') },
    { kind: 'dunden-bugune', title: 'Dünden Bugüne', icon: 'bulb', total: T, meb: 'HB.1.6.2', gen: rot(mt('Eskiyi yenisiyle eşleştir.', 'Teknoloji geliştikçe araçlar değişir: mumdan ampule, mektuptan telefona.', ESKI_P), ch(TEKNO_Q)), ders: 'Teknoloji hayatımızı kolaylaştırır: mumdan ampule, at arabasından otobüse.', visual: img('bulb') },
    { kind: 'tekno-balon', title: 'Teknoloji Balonları', icon: 'robot', total: 3, meb: 'HB.1.6.2', gen: pop('Teknolojik ürünleri patlat!', 'Telefon, bilgisayar, robot, uçak teknolojik ürünlerdir.', TEKNO_HIT, TEKNO_WRONG, TEKNO_IMG), ders: 'Teknolojik ürünleri doğadaki varlıklardan ayır!', visual: img('robot') },
    { kind: 'sanat-atolye', title: 'Sanat Atölyesi', icon: 'paint', total: 4, meb: 'HB.1.6.3', gen: rot(ord(EBRU_O), mem('Sanat kartlarını eşleştir!', 'Sanat ve araçları.', SANAT_MEM)), ders: 'Ebruda su yüzeyine boya damlatır, desen yaparız. Sanatçılar hayal güçleriyle üretir.', visual: img('paint') },
    { kind: 'bilim-sanat', title: 'Bilim, Teknoloji, Sanat', icon: 'sparkles', total: 4, meb: 'HB.1.6.3', gen: srt('Bilim mi, teknoloji mi, sanat mı? Sepetlere ayır.', 'Deney ve gözlem bilimdir; tablet ve robot teknolojidir; resim ve müzik sanattır.', [{ id: 'bilim', label: 'Bilim', img: 'microscope', color: '#3b82f6' }, { id: 'tekno', label: 'Teknoloji', img: 'laptop', color: '#22c55e' }, { id: 'sanat', label: 'Sanat', img: 'palette', color: '#f59e0b' }], BTS_ITEMS), ders: 'Bilim, teknoloji ve sanat birbirini etkiler.', visual: img('sparkles') },
  ],
}

// Ek etkinlikleri kitap konusuna göre yerleştir (aynı konudakiler kendi sırasını korur); oyunlar en sonda kalır
for (const t of ALANLAR) {
  const extra = EK[t.id] ?? []
  const acts = [...t.acts.filter((a) => !a.oyun), ...extra]
  const sorted = acts.map((a, i) => ({ a, i })).sort((x, y) => x.a.meb.localeCompare(y.a.meb) || x.i - y.i)
  t.acts = [...sorted.map((x) => x.a), ...t.acts.filter((a) => a.oyun)]
}
