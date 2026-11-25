/**
 * FEN BİLİMLERİ YOLU — 3. sınıf Fen Bilimleri ders kitabının 8 ünitesi, her ünite bir "ada":
 * konu konu sıralı etkinlikler + sonda oyunlar. Kaynak: docs/meb-kitaplar/analiz/fen-bilimleri-3.md
 * İçerik kitabın öğrettiği bilgilerin özgün özetidir (kitap metni kopyalanmadı, kitap karakterleri yok).
 * Kapsam dışı (3. sınıfta yok): ışık/ses kaynakları, Dünya'nın şekli/katmanları, elektrik devresi,
 * iletken/yalıtkan, bitkinin kısımları, tanecik modeli, hayvanların kendi içinde sınıflandırılması.
 * Güvenlik (§5): tanımadığın maddeyi tatma/koklama yok; priz-kablo-pil için doğru cevap hep
 * "dokunma, uzaklaş, büyüğüne haber ver"; deneyler "bir büyüğün yardımıyla"; mantar toplanmaz, yenmez.
 */
import type { SortQ } from '../../games/quiz/types'
import { ch, img, karma, mem, model, mt, ord, pop, rot, srt, tf, type Alan, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

/* ================================================================================================
 * 1. ÜNİTE · BİLİMSEL KEŞİF YOLCULUĞU
 * ================================================================================================ */
/* --- FB.3.1.1 Bilimsel Bilgiye Ulaşma Yolları --- */
const YONTEM_Q: Q[] = [
  { q: 'Ela, bahçedeki karıncaları üç gün boyunca izledi. Hangi yöntemi kullandı?', a: 'Gözlem yapma', w: ['Deney yapma', 'Belge taraması', 'Model oluşturma'], ex: 'Bir şeyi dikkatle ve planlı incelemek gözlem yapmaktır.', img: 'ant' },
  { q: 'Can, dedesinin çocukluk fotoğraflarını inceledi. Hangi yöntemi kullandı?', a: 'Belge taraması', w: ['Deney yapma', 'Tahmin etme', 'Model oluşturma'], ex: 'Fotoğraf, kitap, gazete gibi belgeleri incelemek belge taramasıdır.', img: 'framed' },
  { q: 'Bulutlar gri ve rüzgâr esiyor. “Yağmur yağabilir.” demek hangi yöntemdir?', a: 'Tahmin etme', w: ['Belge taraması', 'İletişim kurma', 'Deney yapma'], ex: 'Bildiklerimize dayanarak “Bence böyle olacak.” demek tahmin etmektir.', img: 'cloud' },
  { q: 'Mert, oyun hamurundan Güneş, Dünya ve Ay yaptı. Hangi yöntemi kullandı?', a: 'Model oluşturma', w: ['Gözlem yapma', 'Belge taraması', 'İletişim kurma'], ex: 'Bir şeyin küçük ve basit bir benzerini yapmak model oluşturmaktır.', img: 'earth' },
  { q: 'Zeynep, sağlık çalışanına dengeli beslenmeyi sordu. Hangi yöntemi kullandı?', a: 'İletişim kurma', w: ['Deney yapma', 'Model oluşturma', 'Tahmin etme'], ex: 'Soru sorup cevabı dinlemek iletişim kurmaktır.', img: 'stethoscope' },
  { q: 'Ali, dondurmanın gölgede mi güneşte mi çabuk eridiğini denedi. Hangi yöntem?', a: 'Deney yapma', w: ['Belge taraması', 'İletişim kurma', 'Model oluşturma'], ex: 'Bir tahmini kontrol etmek için yapılan çalışma deneydir.', img: 'icecream' },
  { q: '“Sıvı yağ ile su karışır mı?” sorusunun cevabını en iyi hangi yolla buluruz?', a: 'Deney yapma', w: ['Model oluşturma', 'Belge taraması', 'Tahmin etme'], ex: 'Bir büyüğümüzle küçük bir deney yapıp sonucu görebiliriz.', img: 'testtube' },
  { q: '“İnsan bir dakikada kaç kez göz kırpar?” sorusu için ne yaparız?', a: 'Gözlem yapıp sayarız', w: ['Model yaparız', 'Tahmin edip bırakırız', 'Hiçbir şey yapmayız'], ex: 'Gözlem yapar, saydığımız sayıyı veri olarak kaydederiz.', img: 'eye' },
  { q: 'Güneş, Dünya ve Ay’ın büyüklüğünü karşılaştırmak için hangi yöntem uygundur?', a: 'Model oluşturma', w: ['Deney yapma', 'Koklama', 'Tadına bakma'], ex: 'Farklı büyüklükte toplarla model kurup karşılaştırabiliriz.', img: 'sun' },
]
const YONTEM_P: P[] = [
  ['Tahmin etme', '“Bence böyle olacak.” demek', 'thinking'],
  ['Gözlem yapma', 'Dikkatle ve planlı incelemek', 'magnifier'],
  ['Model oluşturma', 'Küçük bir benzerini yapmak', 'earth'],
  ['Belge taraması', 'Kitap, foto, gazete incelemek', 'newspaper'],
  ['Deney yapma', 'Tahmini deneyerek kontrol etmek', 'testtube'],
  ['İletişim kurma', 'Soru sorup cevabı dinlemek', 'speaker'],
]
const TAHMIN_BINS: SortQ['bins'] = [
  { id: 'tahmin', label: 'Tahmin', img: 'thinking', color: '#8b5cf6' },
  { id: 'gozlem', label: 'Gözlem', img: 'magnifier', color: '#3b82f6' },
]
const TAHMIN_ITEMS: SortQ['items'] = [
  { label: 'Yarın yağmur yağabilir.', img: 'rain', bin: 'tahmin' },
  { label: 'Bu tohum bence bir haftada filizlenir.', img: 'seedling', bin: 'tahmin' },
  { label: 'Leylekler sanırım baharda gelir.', img: 'bird', bin: 'tahmin' },
  { label: 'Dondurma güneşte daha çabuk erir bence.', img: 'icecream', bin: 'tahmin' },
  { label: 'Bulutlar şu an gri.', img: 'cloud', bin: 'gozlem' },
  { label: 'Karıncalar ekmek kırıntısı taşıyor.', img: 'ant', bin: 'gozlem' },
  { label: 'Fidan bu hafta iki parmak uzadı.', img: 'plant', bin: 'gozlem' },
  { label: 'Kedi güneşli köşede uyuyor.', img: 'cat', bin: 'gozlem' },
]
const KAYNAK_BINS: SortQ['bins'] = [
  { id: 'guvenilir', label: 'Güvenilir kaynak', img: 'thumbsup', color: '#22c55e' },
  { id: 'kontrol', label: 'Önce kontrol et', img: 'detective', color: '#f59e0b' },
]
const KAYNAK_ITEMS: SortQ['items'] = [
  { label: 'Ansiklopedi', img: 'books', bin: 'guvenilir' },
  { label: 'Öğretmenim', img: 'teacher', bin: 'guvenilir' },
  { label: 'Çocuk bilim dergisi', img: 'openbook', bin: 'guvenilir' },
  { label: 'Okul kütüphanesi', img: 'book', bin: 'guvenilir' },
  { label: 'Tanımadığım bir site', img: 'laptop', bin: 'kontrol' },
  { label: '“Arkadaşım öyle dedi.”', img: 'friends', bin: 'kontrol' },
  { label: 'Bir reklam', img: 'television', bin: 'kontrol' },
  { label: 'Kulaktan dolma bir söz', img: 'ear', bin: 'kontrol' },
]
const ARASTIRMA_O: O[] = [
  { q: 'Bir bilimsel araştırmanın adımlarını sırala.', s: ['Merak ettiğin konuyu seç', 'Bir soru yaz', 'Yöntemini seç', 'Veri topla ve kaydet', 'Sonucu arkadaşlarınla paylaş'], ex: 'Merak eder, soru sorar, bilgi toplar ve paylaşırız.', img: 'memo' },
  { q: 'Dondurma erime deneyini sırala (bir büyüğün yardımıyla).', s: ['Tahminini yaz', 'İki eş dondurma hazırla', 'Birini gölgeye, birini güneşe koy', 'Saati kontrol et ve gözle', 'Sonucu tahminle karşılaştır'], ex: 'Önce tahmin, sonra deney ve gözlem, en son karşılaştırma.', img: 'icecream' },
  { q: 'Baloncukların neden farklı büyüklükte olduğunu araştır. Sırala.', s: ['Baloncukları dikkatle gözle', 'Bir soru sor', 'Kitaplardan bilgi topla', 'Daha az suyla tekrar dene', 'Öğrendiklerini paylaş'], ex: 'Gözlem, soru, belge taraması ve deney birlikte kullanılabilir.', img: 'balloon' },
]
const KUS_Q: Q[] = [
  { q: 'Gözlem defteri: mayısta 12 leylek, 20 kırlangıç sayıldı. Hangisi daha çok görüldü?', a: 'Kırlangıç', w: ['Leylek', 'İkisi eşit', 'Hiçbiri'], ex: '20 sayısı 12’den büyüktür. Kırlangıçlar daha çok görüldü.', img: 'bird' },
  { q: 'Gözlem defteri: 12 leylek, 20 kırlangıç sayıldı. Toplam kaç kuş görüldü?', a: '32', w: ['30', '22', '8'], ex: '12 + 20 = 32 kuş görüldü.', img: 'bird2' },
  { q: 'Kırlangıçlar 20, leylekler 12 sayıldı. Kırlangıç kaç fazla?', a: '8', w: ['12', '32', '6'], ex: '20 − 12 = 8. Kırlangıçlar 8 fazla.', img: 'chart' },
  { q: 'Kuşların ne zaman geleceğini önceki yıllara bakarak söylemek nedir?', a: 'Tahmin yürütmek', w: ['Deney yapmak', 'Model kurmak', 'Koklamak'], ex: 'Eski verilere bakarak geleceği söylemek tahmindir.', img: 'calendar' },
  { q: 'Topladığımız verileri nasıl kaydedebiliriz?', a: 'Grafik, yazı veya resimle', w: ['Hiç kaydetmeyiz', 'Sadece aklımızda tutarız', 'Silip atarız'], ex: 'Veriler grafik, metin veya görselle kaydedilir.', img: 'chart' },
]
const YONTEM_TF: TF[] = [
  ['Bilim insanları yöntemleri hep aynı sırayla kullanır.', false, 'Yöntemler her zaman aynı sırayla ve hep birlikte kullanılmaz.'],
  ['Gözlem yaparken birçok duyumuzu kullanırız.', true, 'Göz, kulak, burun ve dokunma duyumuzu kullanabiliriz.'],
  ['Bilimsel yöntemlerle elde edilen bilgiye veri denir.', true, 'Veri; toplanan, kaydedilen bilgidir.'],
  ['Yanlış bir belge bizi doğru sonuca götürür.', false, 'Belgeler güvenilir olmalı. Yanlış bilgi yanlış sonuca götürür.'],
  ['Model, bir şeyin küçük veya basit bir benzeridir.', true, 'Model, anlamayı ve anlatmayı kolaylaştırır.'],
  ['Araştırmada kullandığımız kaynakları yazarız.', true, 'Kaynakları raporumuza yazarız.'],
  ['Tanımadığımız her siteye hemen inanırız.', false, 'Bilgiyi güvenilir kaynaklardan kontrol ederiz.'],
  ['Deney, bir tahmini kontrol etmek için yapılabilir.', true, 'Deneyle tahminimizin doğru olup olmadığını görürüz.'],
]

/* --- FB.3.1.2 Bilim İnsanlarının Özellikleri --- */
const BILIM_HIT = ['Sabırlı', 'Meraklı', 'Dürüst', 'İş birlikçi', 'Yaratıcı', 'Planlı', 'Sorumlu', 'Kanıt arar']
const BILIM_WRONG = ['Hemen vazgeçer', 'Her söze inanır', 'Fikir dinlemez', 'Doğayı umursamaz', 'Kanıt aramaz']
const ORTAK_BINS: SortQ['bins'] = [
  { id: 'ortak', label: 'Hepsinde var', img: 'scientist', color: '#22c55e' },
  { id: 'degisir', label: 'Kişiden kişiye değişir', img: 'puzzle', color: '#8b5cf6' },
]
const ORTAK_ITEMS: SortQ['items'] = [
  { label: 'Meraklı olmak', bin: 'ortak' },
  { label: 'Sabırlı olmak', bin: 'ortak' },
  { label: 'Dürüst olmak', bin: 'ortak' },
  { label: 'Bilimsel yöntem kullanmak', bin: 'ortak' },
  { label: 'Çalıştığı alan', bin: 'degisir' },
  { label: 'İlgi alanları', bin: 'degisir' },
  { label: 'Çalışma tarzı', bin: 'degisir' },
  { label: 'Kişilik özellikleri', bin: 'degisir' },
]
const BILIMCI_P: P[] = [
  ['Aziz Sancar', 'Nobel Kimya Ödülü aldı', 'scientist'],
  ['Safiye Ali', 'İlk kadın doktorumuz', 'stethoscope'],
  ['Cahit Arf', 'Büyük bir matematikçi', 'abacus'],
  ['Edison', 'Ampul için çok deneme yaptı', 'bulb'],
  ['Usturlap', 'Eski bir gök aleti', 'telescope'],
  ['Mikroskop', 'Küçük canlıları büyütür', 'microscope'],
]
const BILIM_Q: Q[] = [
  { q: 'Bir bilim insanı deneyi hemen başaramadı. Ne yapar?', a: 'Sabırla yeniden dener', w: ['Hemen vazgeçer', 'Sonucu uydurur', 'Deneyi saklar'], ex: 'Bilim insanları sabırlı ve kararlıdır, zor olsa da vazgeçmez.', img: 'scientist' },
  { q: 'Duyduğu her bilgiye hemen inanmamak hangi özelliktir?', a: 'Eleştirel düşünmek', w: ['Unutkanlık', 'Acele etmek', 'Sabırsızlık'], ex: 'Bilim insanları bilginin doğruluğunu kontrol eder.', img: 'thinking' },
  { q: 'Bilim insanları araştırırken doğaya nasıl davranır?', a: 'Çevreyi korur', w: ['Ağaçları kırar', 'Çöpünü bırakır', 'Hayvanları korkutur'], ex: 'Bilim insanları duyarlıdır; insanı ve doğayı sever.', img: 'tree' },
  { q: 'Aziz Sancar çocuklara ne öğütledi?', a: 'Çalışmayı, araştırmayı, hayalden vazgeçmemeyi', w: ['Kitap okumamayı', 'Hiç soru sormamayı', 'Hemen pes etmeyi'], ex: 'Çok çalışmak ve araştırmak hayallere ulaştırır.', img: 'books' },
  { q: 'Safiye Ali hangi konuda çalıştı?', a: 'Kadın ve çocuk sağlığı', w: ['Yıldızlar', 'Madenler', 'Uçak yapımı'], ex: 'Türkiye’nin ilk kadın doktoru Safiye Ali, kadın ve çocuk sağlığı için çalıştı.', img: 'doctor' },
  { q: 'Bilim insanları birlikte çalışmayı sever. Bu hangi özelliktir?', a: 'İş birliğine açık olmak', w: ['Bencillik', 'Kıskançlık', 'Tembellik'], ex: 'Birlikte çalışmak yeni fikirler doğurur.', img: 'handshake' },
]
const BILIM_TF: TF[] = [
  ['Bütün bilim insanları aynı alanda çalışır.', false, 'Çalıştıkları alan kişiden kişiye değişir.'],
  ['Bilim insanları meraklıdır.', true, 'Merak, bilimin başlangıcıdır.'],
  ['Bilim insanları farklı fikirleri kanıtla değerlendirir.', true, 'Fikirlere açıktırlar ama kanıta bakarlar.'],
  ['Bilim insanı sonucu beğenmezse değiştirir.', false, 'Bilim insanları dürüsttür, sonucu olduğu gibi söyler.'],
  ['Cahit Arf ünlü bir matematikçimizdir.', true, 'Cahit Arf birçok öğrenci yetiştirdi.'],
  ['Bilim insanları planlı ve sistemli çalışır.', true, 'Planlı çalışmak doğru sonuca ulaştırır.'],
]
const GOK_MODEL = model('Güneş, Dünya ve Ay’ı büyüklüklerine göre çizime yerleştir!', 'En büyük Güneş, sonra Dünya, en küçük Ay.', 'gok', [['gunes', 'Güneş'], ['dunya', 'Dünya'], ['ay', 'Ay']], ['Bulut', 'Uçak', 'Balon'])

/* ================================================================================================
 * 2. ÜNİTE · CANLILAR DÜNYASINA YOLCULUK
 * ================================================================================================ */
/* --- FB.3.2.1 Canlıların Sınıflandırılması --- */
const CANLI_BINS: SortQ['bins'] = [
  { id: 'canli', label: 'Canlı', img: 'seedling', color: '#22c55e' },
  { id: 'cansiz', label: 'Cansız', img: 'rock', color: '#64748b' },
]
const CANLI_ITEMS: SortQ['items'] = [
  { label: 'Serçe', img: 'bird', bin: 'canli' },
  { label: 'Kedi', img: 'cat', bin: 'canli' },
  { label: 'Ağaç', img: 'tree', bin: 'canli' },
  { label: 'Mantar', img: 'mushroom', bin: 'canli' },
  { label: 'Ayçiçeği', img: 'sunflower', bin: 'canli' },
  { label: 'Taş', img: 'rock', bin: 'cansiz' },
  { label: 'Kalem', img: 'pencil', bin: 'cansiz' },
  { label: 'Top', img: 'ball', bin: 'cansiz' },
  { label: 'Bulut', img: 'cloud', bin: 'cansiz' },
  { label: 'Oyuncak robot', img: 'robot', bin: 'cansiz' },
]
const OZELLIK_P: P[] = [
  ['Çorba içtim.', 'Beslenme', 'salad'],
  ['Koşarken terledim.', 'Boşaltım', 'running'],
  ['Kedi böceği görünce ürktü.', 'Tepki verme', 'cat'],
  ['Diktiğim fidan ağaç oldu.', 'Büyüme', 'tree'],
  ['Aslan derin nefes aldı.', 'Solunum', 'lion'],
  ['İneğin yavrusu oldu.', 'Üreme', 'cow'],
  ['Kertenkele süründü.', 'Hareket', 'lizard'],
  ['Ayçiçeği Güneş’e döndü.', 'Tepki verme', 'sunflower'],
  ['Kuzular otluyor.', 'Beslenme', 'sheep'],
  ['Balık solungaçla nefes alır.', 'Solunum', 'fish'],
]
const GRUP_BINS: SortQ['bins'] = [
  { id: 'bitki', label: 'Bitki', img: 'plant', color: '#22c55e' },
  { id: 'hayvan', label: 'Hayvan', img: 'paw', color: '#f59e0b' },
  { id: 'mantar', label: 'Mantar', img: 'mushroom', color: '#a855f7' },
]
const GRUP_ITEMS: SortQ['items'] = [
  { label: 'Papatya', img: 'flower', bin: 'bitki' },
  { label: 'Kaktüs', img: 'cactus', bin: 'bitki' },
  { label: 'Çimen', img: 'herb', bin: 'bitki' },
  { label: 'Çam ağacı', img: 'evergreen', bin: 'bitki' },
  { label: 'Keçi', img: 'sheep', bin: 'hayvan' },
  { label: 'Ahtapot', img: 'octopus', bin: 'hayvan' },
  { label: 'Kurbağa', img: 'frog', bin: 'hayvan' },
  { label: 'Tavuk', img: 'chicken', bin: 'hayvan' },
  { label: 'Ağaç gövdesindeki mantar', img: 'mushroom', bin: 'mantar' },
  { label: 'Ormandaki şapkalı mantar', img: 'mushroom', bin: 'mantar' },
  { label: 'Nemli yerde biten mantar', img: 'mushroom', bin: 'mantar' },
]
const CANLI_Q: Q[] = [
  { q: 'Canlıları benzer özelliklerine göre gruplara ayırmaya ne denir?', a: 'Sınıflandırma', w: ['Boşaltım', 'Fosilleşme', 'Eleme'], ex: 'Sınıflandırma, canlıları tanımamızı kolaylaştırır.', img: 'puzzle' },
  { q: 'Gözle göremediğimiz küçük canlıları hangi araçla görürüz?', a: 'Mikroskop', w: ['Dürbün', 'Termometre', 'Mıknatıs'], ex: 'Mikroskop, küçük canlıları büyüterek görünür yapar.', img: 'microscope' },
  { q: 'Mikroskopta incelenecek maddenin konduğu uzun cama ne denir?', a: 'Lam', w: ['Lamel', 'Mercek', 'Kavanoz'], ex: 'Lam uzun bir camdır; üzerine küçük lamel kapatılır.', img: 'microscope' },
  { q: 'Mantarlar en çok nasıl bir ortamı sever?', a: 'Nemli ortamı', w: ['Kupkuru ortamı', 'Kızgın çölü', 'Buzlu ortamı'], ex: 'Mantarlar nemli ortamda yaşar.', img: 'mushroom' },
  { q: 'Doğada bir mantar gördün. Ne yaparsın?', a: 'Dokunmam, toplamam, yemem', w: ['Hemen tadına bakarım', 'Toplayıp eve götürürüm', 'Koklayıp ısırırım'], ex: 'Bazı mantarlar zehirlidir. Doğada bulduğumuz mantara dokunmayız.', img: 'noentry' },
  { q: 'Hangi canlı grubu besinini kendisi üretir?', a: 'Bitkiler', w: ['Hayvanlar', 'Mantarlar', 'Hiçbiri'], ex: 'Bitkiler besinini kendisi üretir ve başka canlılara besin olur.', img: 'plant' },
  { q: 'Hem karada hem suda yaşayabilen hayvan hangisi?', a: 'Kurbağa', w: ['Aslan', 'Hamsi', 'Keçi'], ex: 'Kurbağa ve ördek hem karada hem suda yaşayabilir.', img: 'frog' },
  { q: 'Küstüm otunun yaprakları dokununca kapanır. Bu hangi canlılık özelliği?', a: 'Tepki verme', w: ['Üreme', 'Boşaltım', 'Büyüme'], ex: 'Canlılar çevrelerindeki etkilere tepki verir.', img: 'leaf' },
]
const MIKRO_O: O[] = [
  { q: 'Mikroskopla inceleme adımlarını sırala.', s: ['Grubunu kur', 'Damlalıkla lamın üstüne su damlat', 'Lameli dikkatle kapat', 'Gerekirse öğretmeninden yardım al', 'Mikroskopta incele', 'Gördüğünü çiz'], ex: 'Lam ve lamel camdır; dikkatli ve öğretmenimizle çalışırız.', img: 'microscope' },
]
const CANLI_TF: TF[] = [
  ['Bitkiler de solunum yapar.', true, 'Bütün canlılar solunum yapar.'],
  ['Doğada bulduğum mantarın tadına bakabilirim.', false, 'Bazı mantarlar zehirlidir. Asla dokunmayız, yemeyiz.'],
  ['Taş büyür ve ürer.', false, 'Taş cansızdır; büyümez, ürememez.'],
  ['Bitkiler terleyerek ve yaprak dökerek boşaltım yapar.', true, 'Bitkilerde de boşaltım vardır.'],
  ['Mikroskopla görülebilen canlılar havada, suda ve toprakta yaşar.', true, 'Gözle göremesek de her yerdeler.'],
  ['Bütün canlılar hareket eder.', true, 'Fasulye bile çubuğa sarılarak uzanır.'],
  ['Mantarlar bitkidir.', false, 'Mantarlar ayrı bir gruptur.'],
]

/* --- FB.3.2.2 Duyu Organlarının İşlevleri --- */
const DUYU_MODEL = model('Duyu organlarını çizime yerleştir!', 'Göz görür, kulak duyar, burun koklar, dil tadar, deri dokunmayı algılar.', 'duyu', [['goz', 'Göz'], ['kulak', 'Kulak'], ['burun', 'Burun'], ['dil', 'Dil'], ['deri', 'Deri']], ['Saç', 'Tırnak', 'Kaş'])
const KELEBEK_MODEL = model('Kelebeğin algılama parçalarını çizime yerleştir!', 'Kelebek antenleriyle koklar, bacaklarıyla tat alır, hortumuyla bal özü emer.', 'kelebek', [['anten', 'Anten'], ['kanat', 'Kanat'], ['hortum', 'Hortum'], ['bacak', 'Bacak']], ['Gaga', 'Yüzgeç', 'Solungaç'])
const DUYU_P: P[] = [
  ['Göz', 'Renk ve şekli görür', 'eye'],
  ['Kulak', 'Sesleri duyar', 'ear'],
  ['Burun', 'Kokuları alır', 'nose'],
  ['Dil', 'Tatları algılar', 'tongue'],
  ['Deri', 'Sıcak, soğuk, sert, yumuşak', 'hand'],
]
const HAYVAN_DUYU_P: P[] = [
  ['Kelebek', 'Bacaklarıyla tat alır', 'butterfly'],
  ['Yunus', 'Alt çenesiyle işitir', 'dolphin'],
  ['Örümcek', 'Bacak tüyleriyle hisseder', 'spider'],
  ['Baykuş', 'Gece çok iyi görür', 'owl'],
  ['Yayın balığı', 'Bütün vücuduyla tat alır', 'fish'],
  ['Küstüm otu', 'Dokununca yaprak kapatır', 'leaf'],
  ['Yılan', 'Çatal diliyle koku alır'],
]
const ISTASYON_BINS: SortQ['bins'] = [
  { id: 'kulak', label: 'Kulak istasyonu', img: 'ear', color: '#3b82f6' },
  { id: 'burun', label: 'Burun istasyonu', img: 'nose', color: '#f59e0b' },
  { id: 'deri', label: 'Deri istasyonu', img: 'hand', color: '#22c55e' },
]
const ISTASYON_ITEMS: SortQ['items'] = [
  { label: 'Zil', img: 'bell', bin: 'kulak' },
  { label: 'Düdük', img: 'music', bin: 'kulak' },
  { label: 'Davul', img: 'drum', bin: 'kulak' },
  { label: 'Tarçın', img: 'herb', bin: 'burun' },
  { label: 'Gül', img: 'rose', bin: 'burun' },
  { label: 'Limon kabuğu', img: 'lemon', bin: 'burun' },
  { label: 'Pamuk', img: 'cloud', bin: 'deri' },
  { label: 'Sünger', img: 'sponge', bin: 'deri' },
  { label: 'Pürüzlü taş', img: 'rock', bin: 'deri' },
]
const SAGLIK_BINS: SortQ['bins'] = [
  { id: 'korur', label: 'Duyuları korur', img: 'shield', color: '#22c55e' },
  { id: 'zarar', label: 'Zarar verir', img: 'noentry', color: '#ef4444' },
]
const SAGLIK_ITEMS: SortQ['items'] = [
  { label: 'Dişlerimi düzenli fırçalamak', img: 'toothbrush', bin: 'korur' },
  { label: 'Ekranı uygun uzaklıktan izlemek', img: 'television', bin: 'korur' },
  { label: 'Düzenli banyo yapmak', img: 'soap', bin: 'korur' },
  { label: 'Kişisel eşyamı yalnız kullanmak', img: 'toothbrush', bin: 'korur' },
  { label: 'Kulaklıkla çok yüksek ses dinlemek', img: 'headphone', bin: 'zarar' },
  { label: 'Bilmediğim maddeyi koklamak', img: 'nose', bin: 'zarar' },
  { label: 'Güneş altında çok uzun kalmak', img: 'sun', bin: 'zarar' },
  { label: 'Kulağıma çubuk sokmak', img: 'ear', bin: 'zarar' },
  { label: 'Çok sıcak çorbayı hemen içmek', img: 'teapot', bin: 'zarar' },
]
const DUYU_Q: Q[] = [
  { q: 'Burnumuz tıkalıyken yemeğin tadını neden zor anlarız?', a: 'Duyu organları birbirini etkiler', w: ['Dilimiz uyur', 'Yemek tatsızlaşır', 'Kulağımız duymaz'], ex: 'Koku ve tat birlikte çalışır. Burun kapalıyken tat zor anlaşılır.', img: 'nose' },
  { q: 'Yangın alarmını duyunca dışarı çıkarız. Hangi duyu bizi korudu?', a: 'İşitme', w: ['Tatma', 'Koklama', 'Görme'], ex: 'Duyularımız bizi tehlikelerden korur.', img: 'siren' },
  { q: 'Sıcak bir şeye dokununca elimizi çekeriz. Hangi organ uyardı?', a: 'Deri', w: ['Kulak', 'Dil', 'Burun'], ex: 'Deri sıcaklığı ve acıyı algılar.', img: 'hand' },
  { q: 'Görme engelli bir kişi arkadaşını ayak sesinden tanıyor. Neden?', a: 'Diğer duyuları güçlenmiş olabilir', w: ['Şans eseri', 'Hiç duymaz', 'Tahmin etmez'], ex: 'Bir duyu kaybında diğer duyular güçlenebilir.', img: 'ear' },
  { q: 'Burnumuz soluduğumuz havaya ne yapar?', a: 'Temizler ve ısıtır', w: ['Soğutur ve kirletir', 'Hiçbir şey yapmaz', 'Renklendirir'], ex: 'Burun kokuları alır, giren havayı temizler ve ısıtır.', img: 'nose' },
  { q: 'Tanımadığın bir şişeyi buldun. Ne yaparsın?', a: 'Koklamam, büyüğüme veririm', w: ['Hemen koklarım', 'Tadına bakarım', 'Gözüme sürerim'], ex: 'Bilmediğimiz maddeleri koklamaz, tatmayız.', img: 'bottle' },
]
const DUYU_TF: TF[] = [
  ['İnsanda beş duyu organı vardır.', true, 'Göz, kulak, burun, dil ve deri.'],
  ['Bütün canlıların duyu organları aynıdır.', false, 'Duyu organlarının çeşidi, sayısı ve yeteneği farklı olabilir.'],
  ['Kulak çubuğunu kulağın içine sokmalıyız.', false, 'Kulağımıza hiçbir cisim sokmayız.'],
  ['Deri vücudumuzu dıştan sararak korur.', true, 'Deri bizi korur ve dokunmayı algılar.'],
  ['Kelebek bal özünü hortumuyla emer.', true, 'Hortum başının önündedir.'],
  ['Balıklar gözlerini kapatarak uyur.', false, 'Balıkların göz kapağı yoktur, gözü açık uyurlar.'],
  ['Ekrana çok yakından bakmak gözü yorar.', true, 'Ekranı uygun uzaklıktan izleriz.'],
]

/* --- FB.3.2.3 Canlıların Yaşam Döngüleri --- */
const DONGU_O: O[] = [
  { q: 'Güvercinin yaşam döngüsünü sırala.', s: ['Yumurtadan yavru çıkar', 'Anne ve baba yavruyu besler', 'Yavru kendi yemini yer', 'Büyüyüp yumurtlar'], ex: 'Güvercin doğar, büyür, çoğalır; döngü yeniden başlar.', img: 'bird2' },
  { q: 'Salatalığın yaşam döngüsünü sırala.', s: ['Tohum toprağa ekilir', 'Filizlenip fide olur', 'Fide büyür, yaprakları çoğalır', 'Sarı çiçek açar', 'Salatalık oluşur', 'Tohumlar yeniden ekilir'], ex: 'Olgun salatalığın tohumları yeni bir döngü başlatır.', img: 'seedling' },
  { q: 'Her canlının yaşam döngüsünü sırala.', s: ['Doğar', 'Büyür', 'Çoğalır', 'Ölür'], ex: 'Bu döngü her canlıda görülür; yeni canlılar döngüyü sürdürür.', img: 'sparkles' },
]
const DOGUM_BINS: SortQ['bins'] = [
  { id: 'yumurta', label: 'Yumurtadan', img: 'egg', color: '#f59e0b' },
  { id: 'tohum', label: 'Tohumdan', img: 'seedling', color: '#22c55e' },
  { id: 'dogurur', label: 'Doğurarak', img: 'heart', color: '#ec4899' },
]
const DOGUM_ITEMS: SortQ['items'] = [
  { label: 'Güvercin', img: 'bird2', bin: 'yumurta' },
  { label: 'Kaplumbağa', img: 'turtle', bin: 'yumurta' },
  { label: 'Kaz', img: 'duck', bin: 'yumurta' },
  { label: 'Tavuk', img: 'chicken', bin: 'yumurta' },
  { label: 'Marul', img: 'salad', bin: 'tohum' },
  { label: 'Mısır', img: 'wheat', bin: 'tohum' },
  { label: 'Salatalık', img: 'seedling', bin: 'tohum' },
  { label: 'Domates', img: 'tomato', bin: 'tohum' },
  { label: 'İnek', img: 'cow', bin: 'dogurur' },
  { label: 'Koyun', img: 'sheep', bin: 'dogurur' },
  { label: 'Köpek', img: 'dog', bin: 'dogurur' },
]
const OMUR_Q: Q[] = [
  { q: 'Hangisi yüzlerce yıl yaşayabilir?', a: 'Zeytin ağacı', w: ['Marul', 'Güvercin', 'Yılan'], ex: 'Zeytin ağacı yüzlerce yıl yaşayabilir.', img: 'tree' },
  { q: 'Kaplumbağa yaklaşık kaç yıl yaşar?', a: 'Yaklaşık 80 yıl', w: ['Bir hafta', 'Bir ay', 'İki yıl'], ex: 'Kaplumbağa uzun yaşayan bir hayvandır.', img: 'turtle' },
  { q: 'Marulun ömrü nasıldır?', a: 'Bir yıl ya da daha kısa', w: ['Yüzlerce yıl', 'Seksen yıl', 'Hiç ölmez'], ex: 'Marul tek yıllık bir bitkidir.', img: 'salad' },
  { q: 'Bütün canlıların yaşam döngüsünde ortak olan nedir?', a: 'Doğar, büyür, çoğalır, ölür', w: ['Hepsi uçar', 'Hepsi yumurtlar', 'Hepsi suda yaşar'], ex: 'Döngülerde farklılıklar olsa da bu aşamalar ortaktır.', img: 'sparkles' },
  { q: 'Güvercin yumurtasından yavru yaklaşık kaç günde çıkar?', a: 'Yaklaşık 20 günde', w: ['Bir günde', 'Bir yılda', 'Bir saatte'], ex: 'Güvercin yavrusu yaklaşık 20 günde yumurtadan çıkar.', img: 'egg' },
]

/* ================================================================================================
 * 3. ÜNİTE · YER BİLİMCİLER İŞ BAŞINDA
 * ================================================================================================ */
/* --- FB.3.3.1 Kayaçlar, Madenler ve Mineraller --- */
const KMM_BINS: SortQ['bins'] = [
  { id: 'kayac', label: 'Kayaç', img: 'rock', color: '#22c55e' },
  { id: 'maden', label: 'Maden', img: 'coin', color: '#f59e0b' },
  { id: 'mineral', label: 'Mineral', img: 'gem', color: '#a855f7' },
]
const KMM_ITEMS: SortQ['items'] = [
  { label: 'Yer kabuğunu oluşturur.', bin: 'kayac' },
  { label: 'İçinde maden veya mineral olabilir.', bin: 'kayac' },
  { label: 'Taşlar bundan oluşur.', bin: 'kayac' },
  { label: 'Bakır tencere yapımında kullanılır.', bin: 'maden' },
  { label: 'Kuyumcuda altın mücevher olur.', bin: 'maden' },
  { label: 'Ekonomik değeri olan kayaçtır.', bin: 'maden' },
  { label: 'Kayaca renk ve parlaklık verir.', bin: 'mineral' },
  { label: 'Tuz kayaca pembe renk verebilir.', bin: 'mineral' },
  { label: 'Kristal yapılıdır, renkleri farklıdır.', bin: 'mineral' },
]
const MADEN_HIT = ['Kömür', 'Mermer', 'Bor', 'Altın', 'Gümüş', 'Bakır']
const MADEN_WRONG = ['Toprak örneği', 'Plastik şişe', 'Tahta kaşık', 'Cam bardak', 'Kumaş']
const MADEN_IMG: Record<string, string> = { Kömür: 'rock', Mermer: 'stone', Altın: 'coin', Gümüş: 'medal', Bakır: 'teapot', 'Plastik şişe': 'bottle', 'Cam bardak': 'glass', Kumaş: 'tshirt' }
const MADEN_P: P[] = [
  ['Mermer', 'Mutfak tezgâhı', 'stone'],
  ['Bakır', 'Tencere ve tava', 'teapot'],
  ['Altın', 'Mücevher', 'crown'],
  ['Bor', 'Cam ve deterjan', 'glass'],
  ['Kömür', 'Evleri ısıtmak', 'fire'],
  ['Gümüş', 'Elektronik eşya', 'phone'],
]
const MADEN_O: O[] = [
  { q: 'Madenin yolculuğunu sırala.', s: ['Madenin yeri bulunur', 'Çıkarmak için plan yapılır', 'Maden çıkarılır', 'Fabrikada işlenir', 'Kullanıma hazır olur'], ex: 'Yer bilimciler madeni bulur; fabrikada işlenip eşyaya dönüşür.', img: 'factory' },
]
const KAYAC_Q: Q[] = [
  { q: 'Dünya’nın üzerinde yürüdüğümüz en dış kısmına ne denir?', a: 'Yer kabuğu', w: ['Bulut', 'Okyanus', 'Gökyüzü'], ex: 'Yer kabuğu kayaçlardan oluşur.', img: 'mountain' },
  { q: 'Bilinen en sert madde hangisidir?', a: 'Elmas', w: ['Kömür', 'Altın', 'Tebeşir'], ex: 'Elmas bilinen en sert maddedir.', img: 'gem' },
  { q: 'Bilmece: “Kayacın içindeyim, ona renk ve parlaklık veririm.” Ben neyim?', a: 'Mineral', w: ['Fosil', 'Toprak', 'Bulut'], ex: 'Mineraller kayaca renk, parlaklık ve dayanıklılık verir.', img: 'gem' },
  { q: 'Bilmece: “Değerli bir kayacım, fabrikada işlenirim.” Ben neyim?', a: 'Maden', w: ['Mineral', 'Fosil', 'Kum tanesi'], ex: 'Ekonomik değeri olan kayaçlara maden denir.', img: 'coin' },
  { q: 'Hangisi ülkemizin önemli madenlerinden biridir?', a: 'Bor', w: ['Plastik', 'Cam', 'Kâğıt'], ex: 'Mermer, taş kömürü, bor ve bakır ülkemizin önemli madenleridir.', img: 'medal' },
  { q: 'Kömür yanınca geriye ne kalır?', a: 'Kül', w: ['Su', 'Altın', 'Buz'], ex: 'Kömür yanıcıdır, ısı verir; yanınca kül kalır.', img: 'fire' },
  { q: 'Yer bilimciler kayaçları incelerken hangi aracı kullanır?', a: 'Büyüteç', w: ['Kulaklık', 'Termos', 'Şemsiye'], ex: 'Büyüteçle kayaçtaki renk ve parçaları görürüz.', img: 'magnifier' },
]
const KAYAC_TF: TF[] = [
  ['Yer kabuğu kayaçlardan oluşur.', true, 'Üzerinde yürüdüğümüz yer kabuğu kayaçlardandır.'],
  ['Toprak örneği değerli bir madendir.', false, 'Toprak örneğinin maddi değeri yoktur, maden değildir.'],
  ['Altın sarı ve parlak bir madendir.', true, 'Altın kolay şekil alır, mücevher yapılır.'],
  ['Mineraller kayaçların içinde bulunur.', true, 'Kayaçlar bir ya da birçok mineralden oluşur.'],
  ['Kömür hiç yanmaz.', false, 'Kömür yanıcıdır ve ısı verir.'],
  ['Teknoloji geliştikçe madenlere ihtiyaç arttı.', true, 'Pek çok eşya madenlerden yapılır.'],
]

/* --- FB.3.3.2 Fosil Oluşumu --- */
const FOSIL_MODEL = model('Kazı alanını çizime yerleştir!', 'Fosil bilimci, toprak katmanlarının altındaki fosili inceler.', 'fosil', [['paleontolog', 'Fosil bilimci'], ['katman', 'Toprak katmanı'], ['fosil', 'Fosil']], ['Maden ocağı', 'Mıknatıs', 'Bulut'])
const FOSIL_O: O[] = [
  { q: 'Çiçek fosilinin oluşumunu sırala.', s: ['Çiçek dalından kopup toprağa düşer', 'Toprak ve çamur çiçeğin üstünü örter', 'Toprak katılaşır, çiçeğin izi kalır', 'Çok uzun zaman sonra fosil bulunur'], ex: 'Fosil oluşması çok uzun zaman alır.', img: 'flower' },
  { q: 'Yaprak izinin fosil olmasını sırala.', s: ['Yaprak çamura düşer', 'Üstüne yeni çamur birikir', 'Çamur zamanla taşa döner', 'Kazıda yaprak izli taş bulunur'], ex: 'Taşın içinde yaprağın izi kalır.', img: 'fallenleaf' },
]
const FOSIL_Q: Q[] = [
  { q: 'Çok eski canlıların kayaç içinde kalan izine ne denir?', a: 'Fosil', w: ['Mineral', 'Maden', 'Kristal'], ex: 'Fosil; çok eski canlıların izi ya da kalıntısıdır.', img: 'bone' },
  { q: 'Fosilleri inceleyen bilim insanına ne denir?', a: 'Fosil bilimci', w: ['Doktor', 'Pilot', 'Aşçı'], ex: 'Fosil bilimciye paleontolog da denir.', img: 'scientist' },
  { q: 'Fosil bilimine ne ad verilir?', a: 'Paleontoloji', w: ['Matematik', 'Müzik', 'Coğrafya'], ex: 'Paleontoloji, fosilleri inceleyen bilim dalıdır.', img: 'dino' },
  { q: 'Fosiller hangisinin içinde bulunabilir?', a: 'Kayaç, buzul ya da reçine', w: ['Buzdolabı', 'Çanta', 'Bulut'], ex: 'Fosiller kayaç, buzul ve bitki reçinesi içinde korunabilir.', img: 'rock' },
  { q: 'Fosiller bize ne öğretir?', a: 'Çok eski canlıları', w: ['Yarının havasını', 'Saatin kaç olduğunu', 'Yemek tarifini'], ex: 'Nesli tükenmiş canlıları ve bugünkü canlıların atalarını öğreniriz.', img: 'dino' },
  { q: 'Bir fosilin oluşması ne kadar sürer?', a: 'Çok uzun zaman', w: ['Bir gün', 'Bir saat', 'Bir hafta'], ex: 'Fosil oluşması çok çok uzun süre ister.', img: 'hourglass' },
]
const FOSIL_TF: TF[] = [
  ['Her canlı fosil olur.', false, 'Her canlı fosilleşmez; uygun koşullar gerekir.'],
  ['Fosil bir günde oluşur.', false, 'Fosil oluşması çok uzun zaman alır.'],
  ['Fosillerle nesli tükenmiş canlıları öğreniriz.', true, 'Fosiller geçmişin izleridir.'],
  ['Fosil bilimciler kazı yaparak fosil bulur.', true, 'Kazıda toprağı dikkatle kaldırırlar.'],
  ['Çamurda kalan bir iz uzun süre korunabilir.', true, 'Uygun koşullarda iz fosile dönüşebilir.'],
  ['Fosiller sadece buzdolabında bulunur.', false, 'Fosiller kayaç, buzul ve reçinede bulunur.'],
]
const KIM_P: P[] = [
  ['Yer bilimci', 'Kayaçları inceler', 'mountain'],
  ['Fosil bilimci', 'Fosilleri inceler', 'bone'],
  ['Paleontoloji', 'Fosil bilimi', 'dino'],
  ['Mineral', 'Kayaca renk verir', 'gem'],
  ['Maden', 'Değerli kayaç', 'coin'],
  ['Fosil', 'Eski canlının izi', 'fallenleaf'],
]

/* ================================================================================================
 * 4. ÜNİTE · MADDEYİ TANIYALIM, KARIŞTIRIP AYIRALIM
 * ================================================================================================ */
/* --- FB.3.4.1 Maddenin Katı, Sıvı ve Gaz Hâli --- */
const HAL_BINS: SortQ['bins'] = [
  { id: 'kati', label: 'Katı', img: 'rock', color: '#a16207' },
  { id: 'sivi', label: 'Sıvı', img: 'droplet', color: '#3b82f6' },
  { id: 'gaz', label: 'Gaz', img: 'balloon', color: '#a855f7' },
]
const HAL_ITEMS: SortQ['items'] = [
  { label: 'Taş', img: 'rock', bin: 'kati' },
  { label: 'Kalem', img: 'pencil', bin: 'kati' },
  { label: 'Buz', img: 'ice', bin: 'kati' },
  { label: 'Elma', img: 'apple', bin: 'kati' },
  { label: 'Su', img: 'droplet', bin: 'sivi' },
  { label: 'Süt', img: 'milk', bin: 'sivi' },
  { label: 'Çay', img: 'teapot', bin: 'sivi' },
  { label: 'Meyve suyu', img: 'soda', bin: 'sivi' },
  { label: 'Soluduğumuz hava', img: 'cloud', bin: 'gaz' },
  { label: 'Su buharı', img: 'teapot', bin: 'gaz' },
  { label: 'Balondaki hava', img: 'balloon', bin: 'gaz' },
  { label: 'Doğal gaz', img: 'fire', bin: 'gaz' },
]
const KAP_MODEL = model('Maddenin hâllerini kaplara yerleştir!', 'Katının şekli değişmez, sıvı kabın şeklini alır, gaz kapalı kabı doldurur.', 'kaplar', [['kati', 'Katı'], ['sivi', 'Sıvı'], ['gaz', 'Gaz']], ['Karışım', 'Mineral', 'Fosil'])
const KAP_MODEL2 = model('Her kabın altına doğru açıklamayı koy!', 'Katı şeklini korur, sıvı kabın şeklini alır, gaz bulunduğu kabı doldurur.', 'kaplar', [['kati', 'Şeklini korur'], ['sivi', 'Kabın şeklini alır'], ['gaz', 'Kabı tamamen doldurur']], ['Kendi kendine büyür', 'Rengi hep mavidir', 'Mıknatısa yapışır'])
const ESNEK_HIT = ['Yay', 'Paket lastiği', 'Sünger', 'Lastik top', 'Balon']
const ESNEK_WRONG = ['Cam bardak', 'Taş', 'Ayna', 'Metal kaşık', 'Tahta cetvel']
const ESNEK_IMG: Record<string, string> = { Sünger: 'sponge', 'Lastik top': 'ball', Balon: 'balloon', 'Cam bardak': 'glass', Taş: 'rock', 'Tahta cetvel': 'ruler' }
const PURUZ_BINS: SortQ['bins'] = [
  { id: 'puruzlu', label: 'Pürüzlü', img: 'rock', color: '#a16207' },
  { id: 'az', label: 'Az pürüzlü', img: 'notebook', color: '#0ea5e9' },
]
const PURUZ_ITEMS: SortQ['items'] = [
  { label: 'Zımpara kâğıdı', bin: 'puruzlu' },
  { label: 'Ağaç kabuğu', img: 'wood', bin: 'puruzlu' },
  { label: 'Halı', bin: 'puruzlu' },
  { label: 'Pürüzlü taş', img: 'rock', bin: 'puruzlu' },
  { label: 'Defter kapağı', img: 'notebook', bin: 'az' },
  { label: 'Karton', img: 'package', bin: 'az' },
  { label: 'Kitap kapağı', img: 'book', bin: 'az' },
  { label: 'Pamuklu tişört', img: 'tshirt', bin: 'az' },
]
const HAL_Q: Q[] = [
  { q: 'Konduğu kabın şeklini alan, dökülebilen hâl hangisi?', a: 'Sıvı', w: ['Katı', 'Gaz', 'Taş'], ex: 'Sıvılar kabın şeklini alır; gazlar ise bulunduğu ortama yayılır.', img: 'droplet' },
  { q: 'Kolonya kokusu bütün odaya yayıldı. Bu hangi hâlin özelliği?', a: 'Gaz', w: ['Katı', 'Sıvı', 'Hiçbiri'], ex: 'Gazlar bulunduğu ortama yayılır.', img: 'cloud' },
  { q: 'Şişirilmiş balonun içindeki hava nasıldır?', a: 'Sıkıştırılmıştır', w: ['Katıdır', 'Sıvıdır', 'Boştur'], ex: 'Gazlar sıkıştırılabilir. Balondaki hava sıkıştırılmıştır.', img: 'balloon' },
  { q: 'Dış etki olmadıkça şekli değişmeyen hâl hangisi?', a: 'Katı', w: ['Sıvı', 'Gaz', 'Buhar'], ex: 'Katıların belirli bir şekli vardır.', img: 'rock' },
  { q: 'Bir maddenin dışarıdan gözlenebilen özelliğine ne denir?', a: 'Nitelik', w: ['Fosil', 'Mineral', 'Hipotez'], ex: 'Sert, yumuşak, kırılgan, esnek birer niteliktir.', img: 'magnifier' },
  { q: 'Hangisi kırılgandır?', a: 'Ayna', w: ['Sünger', 'Yay', 'Paket lastiği'], ex: 'Ayna ve cam bardak kırılgandır; dikkatle kullanırız.', img: 'glass' },
  { q: 'Tanımadığın bir madde gördün. Ne yaparsın?', a: 'Dokunmam, önce öğretmenime sorarım', w: ['Tadına bakarım', 'Koklarım', 'Gözüme sürerim'], ex: 'Tanımadığımız maddeye dokunmaz, asla tatmayız.', img: 'teacher' },
]
const HAL_TF: TF[] = [
  ['Mercimek bir gazdır.', false, 'Mercimek küçük taneli bir katıdır.'],
  ['Süt bir sıvıdır.', true, 'Süt konduğu kabın şeklini alır.'],
  ['Tuz bir sıvıdır.', false, 'Tuz küçük taneli bir katıdır.'],
  ['Ayakkabı bir katıdır.', true, 'Ayakkabının belirli bir şekli vardır.'],
  ['Kum bir katıdır.', true, 'Kumun her tanesinin kendi şekli vardır.'],
  ['Kaynayan sudan çıkan buhar bir gazdır.', true, 'Su buharı gaz hâlindedir.'],
  ['Defter bir sıvıdır.', false, 'Defter bir katıdır.'],
]

/* --- FB.3.4.2 Karışımlar ve Karışımların Ayrılması --- */
const SAF_BINS: SortQ['bins'] = [
  { id: 'saf', label: 'Saf madde', img: 'droplet', color: '#0ea5e9' },
  { id: 'karisim', label: 'Karışım', img: 'salad', color: '#f59e0b' },
]
const SAF_ITEMS: SortQ['items'] = [
  { label: 'Tuz', bin: 'saf' },
  { label: 'Şeker', img: 'candy', bin: 'saf' },
  { label: 'Saf su', img: 'droplet', bin: 'saf' },
  { label: 'Altın', img: 'coin', bin: 'saf' },
  { label: 'Deniz suyu', img: 'wave', bin: 'karisim' },
  { label: 'Salata', img: 'salad', bin: 'karisim' },
  { label: 'Toprak', img: 'plantpot', bin: 'karisim' },
  { label: 'Hava', img: 'cloud', bin: 'karisim' },
]
const AYIR_P: P[] = [
  ['Eleme', 'Elek', 'basket'],
  ['Süzme', 'Süzgeç', 'bowl'],
  ['Mıknatısla ayırma', 'Mıknatıs', 'magnet'],
  ['Yüzdürme', 'Su dolu kap', 'water2'],
  ['Dinlendirme', 'Bekletilen kap', 'hourglass'],
]
const KARISIM_P: P[] = [
  ['Demir tozu ve talaş', 'Mıknatısla ayırma', 'magnet'],
  ['Pirinç ve şeker', 'Eleme', 'basket'],
  ['Makarna ve su', 'Süzme', 'bowl'],
  ['Talaş ve kum', 'Yüzdürme', 'wood'],
  ['Kum ve su', 'Dinlendirme', 'hourglass'],
  ['Ataş ve oyuncaklar', 'Mıknatısla ayırma', 'paperclip'],
  ['Çakıl ve kum', 'Eleme', 'rock'],
]
const AYIR_Q: Q[] = [
  { q: 'Ataşlar oyuncak kutusuna döküldü. En kolay nasıl ayırırsın?', a: 'Mıknatısla', w: ['Süzgeçle', 'Suyla', 'Bekleterek'], ex: 'Mıknatıs ataşları çeker, oyuncakları çekmez.', img: 'paperclip' },
  { q: 'Kumlu suyu bir süre bekletince ne olur?', a: 'Kum dibe çöker', w: ['Kum uçar', 'Su kum olur', 'Hiçbir şey'], ex: 'Bu yönteme dinlendirme denir.', img: 'hourglass' },
  { q: 'Talaş ve kum karışımını suya koyarsak ne olur?', a: 'Talaş yüzer, kum batar', w: ['İkisi de yüzer', 'İkisi de erir', 'Talaş batar'], ex: 'Bu yönteme yüzdürme denir.', img: 'water2' },
  { q: 'Ufuk demir tozu ve talaşı süzgeçle ayıramadı. Ne yapmalı?', a: 'Hipotezini yenileyip tekrar denemeli', w: ['Hemen vazgeçmeli', 'Sonucu saklamalı', 'Deneyi bırakmalı'], ex: 'Sonuç hipoteze uymazsa düşünür, hipotezi yeniler ve tekrar deneriz.', img: 'thinking' },
  { q: 'Deneyden önce “Bunu mıknatısla ayırırım.” demek nedir?', a: 'Hipotez', w: ['Fosil', 'Mineral', 'Nitelik'], ex: 'Bilgimize dayanarak yaptığımız tahmine hipotez denir.', img: 'memo' },
  { q: 'Karışım oluşturmak için en az kaç madde gerekir?', a: 'İki', w: ['Bir', 'Sıfır', 'Yüz'], ex: 'Karışım en az iki maddeden oluşur.', img: 'salad' },
  { q: 'Salatadaki domates rengini ve tadını kaybeder mi?', a: 'Hayır, korur', w: ['Evet, kaybeder', 'Maviye döner', 'Taşa döner'], ex: 'Karışımdaki maddeler kendi özelliklerini kaybetmez.', img: 'tomato' },
]
const DENEY_O: O[] = [
  { q: 'Karışım ayırma deneyini sırala (öğretmeninle birlikte).', s: ['Bir karışım seç', 'Hipotezini yaz', 'Ayırma yolunu belirle', 'Karışımı ayır', 'Sonucu gözle ve hipotezinle karşılaştır'], ex: 'Deneyde hiçbir maddeyi tatmaz, koklamaz; gözümüzü ovuşturmayız.', img: 'testtube' },
  { q: 'Nohut, kum ve su karışımını ayırmayı sırala.', s: ['Süzgeçle nohutları al', 'Kumlu suyu beklet', 'Kum dibe çöksün', 'Üstteki suyu yavaşça ayır'], ex: 'Önce süzgeç, sonra dinlendirme kullanırız.', img: 'bowl' },
]

/* --- FB.3.4.3 Atıkların Ayrıştırılması --- */
const ATIK_BINS: SortQ['bins'] = [
  { id: 'cam', label: 'Cam', img: 'glass', color: '#22c55e' },
  { id: 'kagit', label: 'Kâğıt', img: 'newspaper', color: '#3b82f6' },
  { id: 'plastik', label: 'Plastik', img: 'bottle', color: '#f59e0b' },
]
const ATIK_ITEMS: SortQ['items'] = [
  { label: 'Cam kavanoz', img: 'jar', bin: 'cam' },
  { label: 'Cam şişe', img: 'glass', bin: 'cam' },
  { label: 'Cam meyve suyu şişesi', img: 'glass', bin: 'cam' },
  { label: 'Gazete', img: 'newspaper', bin: 'kagit' },
  { label: 'Karton kutu', img: 'package', bin: 'kagit' },
  { label: 'Eski defter', img: 'notebook', bin: 'kagit' },
  { label: 'Pet şişe', img: 'bottle', bin: 'plastik' },
  { label: 'Plastik kap', img: 'bowl', bin: 'plastik' },
  { label: 'Plastik oyuncak', img: 'robot', bin: 'plastik' },
]
const ATIK2_BINS: SortQ['bins'] = [
  { id: 'metal', label: 'Metal', img: 'can', color: '#64748b' },
  { id: 'pil', label: 'Atık pil', img: 'battery', color: '#ef4444' },
  { id: 'kagit', label: 'Kâğıt', img: 'newspaper', color: '#3b82f6' },
]
const ATIK2_ITEMS: SortQ['items'] = [
  { label: 'İçecek kutusu', img: 'can', bin: 'metal' },
  { label: 'Konserve kutusu', img: 'can', bin: 'metal' },
  { label: 'Metal kapak', img: 'coin', bin: 'metal' },
  { label: 'Bitmiş kalem pil', img: 'battery', bin: 'pil' },
  { label: 'Kumandanın eski pili', img: 'battery2', bin: 'pil' },
  { label: 'Saatin bitmiş pili', img: 'clock', bin: 'pil' },
  { label: 'Dergi', img: 'openbook', bin: 'kagit' },
  { label: 'Kâğıt torba', img: 'package', bin: 'kagit' },
  { label: 'Takvim yaprağı', img: 'calendar', bin: 'kagit' },
]
const ATIK_O: O[] = [
  { q: 'Atıkları doğada yok olma sürelerine göre kısadan uzuna sırala.', s: ['Kâğıt', 'Muz kabuğu', 'Sakız', 'Ayran kutusu', 'Pet şişe'], ex: 'Kâğıt birkaç ayda, pet şişe ise yüzlerce yılda yok olur.', img: 'hourglass' },
  { q: 'Geri dönüşümün yolculuğunu sırala.', s: ['Atığı doğru kutuya at', 'Atıklar toplanır', 'Tesiste ayrıştırılır', 'Yeni ürün yapılır'], ex: 'Doğru kutu, doğru dönüşüm!', img: 'recycle' },
]
const FAYDA_HIT = ['Ağaçlar korunur', 'Enerji tasarrufu', 'Su tasarrufu', 'Deniz kirlenmez', 'Doğa korunur', 'Atık azalır']
const FAYDA_WRONG = ['Daha çok çöp olur', 'Hava kirlenir', 'Orman azalır', 'Su boşa gider']
const TESIS_P: P[] = [
  ['Demirli atıklar', 'Mıknatısla ayrılır', 'magnet'],
  ['Büyük atık parçaları', 'Elekle ayrılır', 'basket'],
  ['Atık sudaki maddeler', 'Süzgeçle ayrılır', 'water2'],
  ['Farklı plastikler', 'Suda yüzdürülür', 'bottle'],
  ['Bitmiş piller', 'Atık pil kutusuna', 'battery'],
]
const ATIK_TF: TF[] = [
  ['Pet şişe doğada çok uzun sürede yok olur.', true, 'Pet şişe yüzlerce yılda yok olur.'],
  ['Her atık çöptür, hiçbiri yeniden kullanılmaz.', false, 'Boş şişe saksı, karton kutu oyuncak kutusu olabilir.'],
  ['Bitmiş pili çöpe atarız.', false, 'Pili atık pil kutusuna atar, sonra ellerimizi yıkarız.'],
  ['Geri dönüşüm doğal kaynakları korur.', true, 'Daha az ağaç kesilir, enerji ve su korunur.'],
  ['Karışık çöpler kolay geri dönüştürülür.', false, 'Atıklar karışınca geri dönüştürmek zorlaşır.'],
  ['Defterin her sayfasını kullanmak israfı önler.', true, 'Eşyalarımızı tam kullanırız.'],
]
const ATIK_Q: Q[] = [
  { q: 'Bugünün ihtiyaçlarını karşılarken geleceği korumaya ne denir?', a: 'Sürdürülebilirlik', w: ['İsraf', 'Kirlilik', 'Eleme'], ex: 'Sürdürülebilirlik, gelecek nesillerin hakkını korumaktır.', img: 'recycle' },
  { q: 'Boş bir cam şişeyi nasıl yeniden kullanabiliriz?', a: 'Saksı yaparak', w: ['Denize atarak', 'Kırarak', 'Parkta bırakarak'], ex: 'Eşyaları yeni ürüne dönüştürebiliriz.', img: 'plantpot' },
  { q: 'Hangisi doğada en kısa sürede yok olur?', a: 'Kâğıt', w: ['Pet şişe', 'Ayran kutusu', 'Sakız'], ex: 'Kâğıt birkaç ayda yok olur.', img: 'newspaper' },
  { q: 'Piknikte kalan boş şişeyi ne yaparız?', a: 'Geri dönüşüm kutusuna atarız', w: ['Çimenlerde bırakırız', 'Göle atarız', 'Toprağa gömeriz'], ex: 'Doğada bıraktığımız şişe uzun yıllar yok olmaz.', img: 'recycle' },
]

/* ================================================================================================
 * 5. ÜNİTE · HAREKETİ KEŞFEDİYORUM
 * ================================================================================================ */
/* --- FB.3.5.1 Varlıkların Hareketleri --- */
const HAREKET_P: P[] = [
  ['Rüzgârda dalgalanan bayrak', 'Sallanma', 'trflag'],
  ['Yeşil ışıkta kalkan araç', 'Hızlanma', 'trafficlight'],
  ['Kırmızı ışığa yaklaşan araç', 'Yavaşlama', 'car'],
  ['Kilitte çevrilen anahtar', 'Dönme', 'key'],
  ['Kavşakta yan yola giren araç', 'Yön değiştirme', 'bus'],
  ['Salıncaktaki çocuk', 'Sallanma', 'happy'],
  ['Pistten kalkan uçak', 'Hızlanma', 'airplane'],
  ['Durağa yaklaşan otobüs', 'Yavaşlama', 'busstop'],
  ['Saatin akrep ve yelkovanı', 'Dönme', 'clock'],
  ['Yere çarpıp seken top', 'Yön değiştirme', 'ball'],
]
const HAREKET_MEM: P[] = [
  ['Hızlanma', 'Daha çabuk gitmek', 'running'],
  ['Yavaşlama', 'Hızını azaltmak', 'snail'],
  ['Dönme', 'Kendi etrafında dönmek', 'wheel'],
  ['Sallanma', 'İleri geri gidip gelmek', 'kite'],
  ['Yön değiştirme', 'Başka yöne geçmek', 'compass'],
]
const HAREKET_Q: Q[] = [
  { q: 'Koşuya başlayan atletin hareketi hangisidir?', a: 'Hızlanma', w: ['Yavaşlama', 'Sallanma', 'Dolanma'], ex: 'Hareketsizken harekete geçmek hızlanmadır.', img: 'running' },
  { q: 'Bisikletli kediyi görünce fren yaptı. Hangi hareket?', a: 'Yavaşlama', w: ['Hızlanma', 'Dönme', 'Yuvarlama'], ex: 'Fren yapınca hız azalır; bu yavaşlamadır.', img: 'bicycle' },
  { q: 'Rüzgâr türbininin kanatları ne yapar?', a: 'Döner', w: ['Sallanır', 'Yavaşlar', 'Dolanır'], ex: 'Kendi etrafında dairesel hareket dönmedir. Türbin dönerek elektrik üretir.', img: 'wheel' },
  { q: 'Virajı dönen aracın hareketi hangisidir?', a: 'Yön değiştirme', w: ['Sallanma', 'Hızlanma', 'Dolanma'], ex: 'Bir yönden başka yöne geçmek yön değiştirmedir.', img: 'car' },
  { q: 'Canlılar nasıl hareket eder?', a: 'Kendiliğinden', w: ['Hiç hareket etmez', 'Yalnızca itilince', 'Sadece rüzgârla'], ex: 'Canlılar kendiliğinden, cansızlar dışarıdan bir etkiyle hareket eder.', img: 'rabbit' },
  { q: 'Masadaki top kendi kendine harekete geçer mi?', a: 'Hayır, bir etki gerekir', w: ['Evet, hemen geçer', 'Geceleri geçer', 'Sadece salı günü'], ex: 'Cansız varlıklar dışarıdan bir etkiyle hareket eder.', img: 'ball' },
  { q: 'Çalışan mikserin dönen kısmına ne yaparız?', a: 'Asla dokunmayız', w: ['Parmağımızla durdururuz', 'İçine kaşık sokarız', 'Yüzümüzü yaklaştırırız'], ex: 'Dönen aletler yanlış kullanılırsa yaralar.', img: 'noentry' },
]
const SONUC_BINS: SortQ['bins'] = [
  { id: 'olumlu', label: 'Olumlu sonuç', img: 'thumbsup', color: '#22c55e' },
  { id: 'olumsuz', label: 'Olumsuz sonuç', img: 'thumbsdown', color: '#ef4444' },
]
const SONUC_ITEMS: SortQ['items'] = [
  { label: 'Türbin dönüp elektrik üretti.', img: 'wheel', bin: 'olumlu' },
  { label: 'Uçak hızlanıp havalandı.', img: 'airplane', bin: 'olumlu' },
  { label: 'Sürücü sinyal verip güvenle döndü.', img: 'car', bin: 'olumlu' },
  { label: 'Salıncakta sallanıp eğlendik.', img: 'happy', bin: 'olumlu' },
  { label: 'Koridorda koşan çocuk arkadaşına çarptı.', img: 'running', bin: 'olumsuz' },
  { label: 'Ani fren yapan bisikletli düştü.', img: 'bicycle', bin: 'olumsuz' },
  { label: 'Salıncağın önünden geçen çocuk çarpıldı.', img: 'bandage', bin: 'olumsuz' },
  { label: 'Trafikte ani hızlanma kazaya yol açtı.', img: 'siren', bin: 'olumsuz' },
]
const PARK_O: O[] = [
  { q: 'Fındık’ın parktaki hareketlerini hikâyeye göre sırala.', s: ['Bankta oturan Fındık kalkıp koşmaya başladı (hızlanma)', 'Çiçekleri görünce yavaşladı (yavaşlama)', 'Sağdaki yola saptı (yön değiştirme)', 'Sevinçle yerinde döndü (dönme)', 'Salıncakta sallandı (sallanma)'], ex: 'Bir hikâyede beş hareketin hepsini bulduk!', img: 'running' },
]
const HAREKET_TF: TF[] = [
  ['Salıncak sallanma hareketi yapar.', true, 'İleri geri tekrar eden harekete sallanma denir.'],
  ['Durağa yaklaşan otobüs hızlanır.', false, 'Durağa yaklaşan otobüs yavaşlar.'],
  ['Dünya kendi etrafında döner.', true, 'Dünya’nın dönmesiyle gece ve gündüz oluşur.'],
  ['Dolanma da beş hareket durumundan biridir.', false, 'Beş durum: hızlanma, yavaşlama, dönme, sallanma, yön değiştirme.'],
  ['Hareket eden araca yaklaşmak güvenlidir.', false, 'Hareket hâlindeki araçlardan uzak dururuz.'],
  ['Kuş dala konunca yapraklar sallanabilir.', true, 'Hareket çevreyi etkiler.'],
]

/* --- FB.3.5.2 Kuvvet ve Etkileri --- */
const KUVVET_MODEL = model('Kuvvet oklarını adlandır: itme mi, çekme mi?', 'Bir cismi kendimizden uzaklaştırmak itme, kendimize yaklaştırmak çekmedir.', 'kuvvet', [['itme', 'İtme'], ['cekme', 'Çekme']], ['Dönme', 'Sallanma', 'Eleme'])
const ITCEK_BINS: SortQ['bins'] = [
  { id: 'itme', label: 'İtme', img: 'hand', color: '#f59e0b' },
  { id: 'cekme', label: 'Çekme', img: 'magnet', color: '#3b82f6' },
  { id: 'ikisi', label: 'İkisi birden', img: 'sparkles', color: '#a855f7' },
]
const ITCEK_ITEMS: SortQ['items'] = [
  { label: 'Topa vurmak', img: 'ball', bin: 'itme' },
  { label: 'Şemsiyeyi açmak', img: 'umbrella', bin: 'itme' },
  { label: 'Arkadaşını salıncakta sallamak', img: 'happy', bin: 'itme' },
  { label: 'Ağaçtan meyve koparmak', img: 'apple', bin: 'cekme' },
  { label: 'Çekmeceyi açmak', img: 'package', bin: 'cekme' },
  { label: 'Perdeyi kapatmak', img: 'house', bin: 'cekme' },
  { label: 'Saç taramak', img: 'girl', bin: 'ikisi' },
  { label: 'Elektrikli süpürgeyi kullanmak', img: 'broom', bin: 'ikisi' },
  { label: 'El arabasını ileri geri sürmek', img: 'cart', bin: 'ikisi' },
]
const KUVVET_Q: Q[] = [
  { q: 'Yumuşak süngerin üstüne ağır bir top bırakırsak ne olur?', a: 'Sünger ezilir, sonra eski hâline döner', w: ['Sünger uçar', 'Top erir', 'Hiçbir şey olmaz'], ex: 'Kuvvet şekli değiştirir; esnek sünger eski hâline döner.', img: 'sponge' },
  { q: 'Tahta parçası dereye bırakılırsa ne olur?', a: 'Yüzer, akıntıyla gider', w: ['Hemen batar', 'Erir', 'Yerinde kalır'], ex: 'Akan su tahtayı iterek hareket ettirir.', img: 'wood' },
  { q: 'Hafif rüzgâr masadaki kâğıda değerse ne olur?', a: 'Kâğıt hareket eder', w: ['Kâğıt ağırlaşır', 'Kâğıt yanar', 'Kâğıt büyür'], ex: 'Rüzgârın kuvveti kâğıdı hareket ettirir.', img: 'cloud' },
  { q: 'Oyun hamurunu sıkarsak ne olur?', a: 'Şekli değişir', w: ['Rengi değişir', 'Sıvı olur', 'Kaybolur'], ex: 'Kuvvet cisimlerin şeklini değiştirebilir.', img: 'paint' },
  { q: 'Ağır kutu tek başına zor gidiyor. Ne yaparız?', a: 'Biri iter, biri çeker', w: ['Kutuyu tekmeleriz', 'Hemen vazgeçeriz', 'Üstüne otururuz'], ex: 'Birlikte uygulanan kuvvet işi kolaylaştırır.', img: 'package' },
  { q: 'Bisikletin frenini sıkınca ne olur?', a: 'Bisiklet yavaşlar', w: ['Bisiklet hızlanır', 'Bisiklet uçar', 'Bisiklet döner'], ex: 'Kuvvet hareket eden cismi yavaşlatır ve durdurur.', img: 'bicycle' },
  { q: 'Merdane ile hamuru açınca hamura ne olur?', a: 'İncelir, şekli değişir', w: ['Kalınlaşır', 'Rengi değişir', 'Erir'], ex: 'Kuvvet şekil değiştirir.', img: 'bread' },
]
const KUVVET_HIT = ['Hareket ettirir', 'Durdurur', 'Yavaşlatır', 'Yönünü değiştirir', 'Şeklini değiştirir']
const KUVVET_WRONG = ['Rengini değiştirir', 'Tadını değiştirir', 'Koku yayar', 'Yaşını büyütür']
const BALON_O: O[] = [
  { q: 'Balonun değişimi etkinliğini sırala.', s: ['Şişmemiş balonu incele', 'Balonu hafifçe şişir', 'Balona hafifçe bastır', 'Neden değiştiğini tartış'], ex: 'Bastırınca balonun şekli değişti: kuvvet!', img: 'balloon' },
  { q: 'İt, çek, sık, yuvarla etkinliğini sırala.', s: ['Tahminini yaz', 'Topu elinle it', 'Oyun hamurunu sık', 'Lastiği iki elinle çek', 'Sonucu tahminle karşılaştır'], ex: 'Hareket ve şekil değişikliği için kuvvet gerekir.', img: 'ball' },
]
const KUVVET_TF: TF[] = [
  ['İtme ve çekme birer kuvvettir.', true, 'Kuvvet itme ya da çekmedir.'],
  ['Kuvvet duran bir cismi hareket ettirebilir.', true, 'Topa vurunca top hareket eder.'],
  ['Kuvvet bir cismin rengini değiştirir.', false, 'Kuvvet hareketi ve şekli değiştirir.'],
  ['Lastiği iki elle çekince uzar.', true, 'Çekme kuvveti lastiği uzatır.'],
  ['Hareket ve spor kaslarımızı güçlendirir.', true, 'Hareket sağlıklı hissettirir.'],
  ['Çekmeceyi açmak itme kuvvetidir.', false, 'Çekmeceyi kendimize doğru çekeriz.'],
]

/* ================================================================================================
 * 6. ÜNİTE · YAŞAMIMIZI KOLAYLAŞTIRAN ELEKTRİK
 * ================================================================================================ */
/* --- FB.3.6.1 Elektrikli Araç Gereç --- */
const ENERJI_BINS: SortQ['bins'] = [
  { id: 'fis', label: 'Şehir elektriği', img: 'plug', color: '#f59e0b' },
  { id: 'pil', label: 'Pille çalışır', img: 'battery', color: '#22c55e' },
  { id: 'yok', label: 'Elektriksiz', img: 'hand', color: '#64748b' },
]
const ENERJI_ITEMS: SortQ['items'] = [
  { label: 'Buzdolabı', bin: 'fis' },
  { label: 'Çamaşır makinesi', bin: 'fis' },
  { label: 'Ütü', bin: 'fis' },
  { label: 'Televizyon', img: 'television', bin: 'fis' },
  { label: 'Kumanda', bin: 'pil' },
  { label: 'El feneri', bin: 'pil' },
  { label: 'Duvar saati', img: 'clock', bin: 'pil' },
  { label: 'Oyuncak araba', img: 'racecar', bin: 'pil' },
  { label: 'Makas', img: 'scissors', bin: 'yok' },
  { label: 'El süpürgesi', img: 'broom', bin: 'yok' },
  { label: 'Bisiklet', img: 'bicycle', bin: 'yok' },
  { label: 'Kalemtıraş', img: 'pencil', bin: 'yok' },
]
const AMAC_BINS: SortQ['bins'] = [
  { id: 'aydinlatma', label: 'Aydınlatma', img: 'bulb', color: '#f59e0b' },
  { id: 'isinma', label: 'Isınma', img: 'thermometer', color: '#ef4444' },
  { id: 'iletisim', label: 'İletişim', img: 'phone', color: '#3b82f6' },
]
const AMAC_ITEMS: SortQ['items'] = [
  { label: 'Gece lambası', img: 'bulb', bin: 'aydinlatma' },
  { label: 'Sokak lambası', img: 'bulb2', bin: 'aydinlatma' },
  { label: 'Projektör', bin: 'aydinlatma' },
  { label: 'Elektrik sobası', bin: 'isinma' },
  { label: 'Elektrikli battaniye', bin: 'isinma' },
  { label: 'Elektrikli radyatör', bin: 'isinma' },
  { label: 'Telefon', img: 'phone', bin: 'iletisim' },
  { label: 'Radyo', img: 'radio', bin: 'iletisim' },
  { label: 'Bilgisayar', img: 'laptop', bin: 'iletisim' },
]
const ELEK_Q: Q[] = [
  { q: 'Bir aracın elektrikli olup olmadığına nasıl karar veririz?', a: 'Enerjiyi nereden aldığına bakarız', w: ['Rengine bakarız', 'Boyuna bakarız', 'Kokusuna bakarız'], ex: 'Fişi ya da pili varsa elektrikle çalışır.', img: 'plug' },
  { q: 'Hangisi suyu elektrikle ısıtır?', a: 'Su ısıtıcısı', w: ['Piknik tüpü', 'Odun sobası', 'Mangal'], ex: 'Su ısıtıcısı elektrikle çalışır; piknik tüpü çalışmaz.', img: 'teapot' },
  { q: 'Elektrik kesildi. Hangisi yine de çalışır?', a: 'Pilli el feneri', w: ['Televizyon', 'Kapı zili', 'Tavan lambası'], ex: 'Pilli araçlar şehir elektriği olmadan da çalışır.', img: 'battery' },
  { q: 'Pilin en büyük faydası nedir?', a: 'Taşınabilir, kablo gerekmez', w: ['Hiç bitmez', 'Yenebilir', 'Su ile çalışır'], ex: 'Pil, aracın her yerde çalışmasını sağlar.', img: 'battery2' },
  { q: 'Buzdolabı ne işe yarar?', a: 'Yiyecekleri soğutup saklar', w: ['Odayı aydınlatır', 'Saç kurutur', 'Çamaşır yıkar'], ex: 'Buzdolabı ev işlerinde kullanılan elektrikli bir araçtır.', img: 'ice' },
  { q: 'Hangisi iletişim için kullanılan elektrikli araçtır?', a: 'Telefon', w: ['Ütü', 'Elektrik sobası', 'Buzdolabı'], ex: 'Telefon, bilgisayar, radyo ve televizyon iletişim araçlarıdır.', img: 'phone' },
]
const KESINTI_HIT = ['Televizyon', 'Kapı zili', 'Tavan lambası', 'Buzdolabı', 'Çamaşır makinesi', 'Elektrikli fırın']
const KESINTI_WRONG = ['Pilli el feneri', 'Kumandalı araba', 'Odun sobası', 'Bisiklet', 'Pilli saat']
const KESINTI_IMG: Record<string, string> = { Televizyon: 'television', 'Kapı zili': 'bell', 'Tavan lambası': 'bulb', 'Kumandalı araba': 'racecar', Bisiklet: 'bicycle', 'Pilli saat': 'clock' }

/* --- FB.3.6.2 Güvenli Kullanım --- */
const GUVEN_BINS: SortQ['bins'] = [
  { id: 'guvenli', label: 'Güvenli', img: 'shield', color: '#22c55e' },
  { id: 'tehlikeli', label: 'Tehlikeli', img: 'zap', color: '#ef4444' },
]
const GUVEN_ITEMS: SortQ['items'] = [
  { label: 'Kılavuzu önceden okumak', img: 'openbook', bin: 'guvenli' },
  { label: 'Büyüğümden yardım istemek', img: 'raisedhand', bin: 'guvenli' },
  { label: 'Kapaklı priz kullanmak', img: 'lock', bin: 'guvenli' },
  { label: 'Pile dokununca eli yıkamak', img: 'soap', bin: 'guvenli' },
  { label: 'Prize ıslak elle dokunmak', img: 'droplet', bin: 'tehlikeli' },
  { label: 'Prize bir cisim sokmak', img: 'plug', bin: 'tehlikeli' },
  { label: 'Elektrik direği dibinde oynamak', img: 'zap', bin: 'tehlikeli' },
  { label: 'Sarkan tele yaklaşmak', img: 'noentry', bin: 'tehlikeli' },
  { label: 'Bilgisayarın yanında su içmek', img: 'glass', bin: 'tehlikeli' },
]
const GUVEN_Q: Q[] = [
  { q: 'Kedi su bardağını bilgisayarın üstüne devirdi. Ne yaparsın?', a: 'Hiçbir şeye dokunmadan büyüğüme haber veririm', w: ['Bilgisayarı hemen kurularım', 'Fişi kendim çekerim', 'Bardağı yeniden doldururum'], ex: 'Su ve elektrik bir arada tehlikelidir. Dokunmaz, büyüğümüze haber veririz.', img: 'cat' },
  { q: 'Parkta sarkan bir elektrik teli gördün. Ne yaparsın?', a: 'Uzaklaşıp bir yetişkine söylerim', w: ['Yakından bakarım', 'Sopayla dokunurum', 'Arkadaşımı çağırıp gösteririm'], ex: 'Sarkan tel ve açık kablodan hemen uzaklaşırız.', img: 'noentry' },
  { q: 'Tablet şarjdayken çok ısındı. Ne yaparsın?', a: 'Büyüğüme haber veririm', w: ['Oynamaya devam ederim', 'Battaniyenin altına koyarım', 'Su dökerek soğuturum'], ex: 'Şarjdan çıkarmayı büyüğümüze bırakırız.', img: 'raisedhand' },
  { q: 'Islak saçını kurutmak isteyen Aslı ne yapmalı?', a: 'Elini kurulayıp büyüğünden yardım istemeli', w: ['Islak elle fişi takmalı', 'Banyoda suyun yanında kullanmalı', 'Tek başına denemeli'], ex: 'Priz ve kablolara ıslak elle dokunmayız.', img: 'droplet' },
  { q: 'Yeni bir elektrikli aracı kullanmadan önce ne yapılır?', a: 'Kullanma kılavuzu okunur', w: ['Hemen çalıştırılır', 'Suya batırılır', 'İçi açılır'], ex: 'Kılavuz aracın güvenli kullanımını anlatır.', img: 'openbook' },
  { q: 'Bitmiş pili nereye atarız?', a: 'Atık pil kutusuna', w: ['Çöp kutusuna', 'Lavaboya', 'Toprağa'], ex: 'Pil içindeki zararlı maddeler doğayı kirletir. Sonra ellerimizi yıkarız.', img: 'battery' },
  { q: 'Boşluğu doldur: “Priz ve kablolara … elle dokunmayız.”', a: 'Islak', w: ['Temiz', 'Küçük', 'Sağ'], ex: 'Priz ve kablolara ıslak elle dokunmayız.', img: 'droplet' },
]
const GUVEN_TF: TF[] = [
  ['Kılavuzu aracı kullandıktan sonra okuruz.', false, 'Kılavuzu kullanmadan önce okuruz.'],
  ['Elektrik direklerinin yakınında oynamayız.', true, 'Elektrik tehlikesi olan yerlerden uzak dururuz.'],
  ['Kullanmadığımız aracın fişi prizde kalmalı.', false, 'Büyüğümüz kullanılmayan aracın fişini çeker.'],
  ['Güvenlik aparatlı priz tercih ederiz.', true, 'Kapaklı prizler bizi korur.'],
  ['Sarkan tel ve açık kablodan hemen uzaklaşırız.', true, 'Uzaklaşır, bir yetişkine haber veririz.'],
  ['Pili ağzımıza alabiliriz.', false, 'Pil zararlı maddeler içerir; ağza alınmaz.'],
]

/* --- FB.3.6.3 Elektriğin Tasarruflu Kullanımı --- */
const TASARRUF_HIT = ['Işığı söndür', 'Tasarruflu ampul', 'Makineyi doldur', 'Havluyla kurula', 'Güneş paneli', 'Fişi çekmek']
const TASARRUF_WRONG = ['Işık açık uyumak', 'TV açık uyumak', 'Hep şarjda tutmak', 'Buzdolabı açık']
const TASARRUF_BINS: SortQ['bins'] = [
  { id: 'tasarruf', label: 'Tasarruf', img: 'thumbsup', color: '#22c55e' },
  { id: 'israf', label: 'İsraf', img: 'thumbsdown', color: '#ef4444' },
]
const TASARRUF_ITEMS: SortQ['items'] = [
  { label: 'Gereksiz yanan ışığı söndürmek', img: 'bulb', bin: 'tasarruf' },
  { label: 'Çamaşırı nemliyken ütülemek', img: 'tshirt', bin: 'tasarruf' },
  { label: 'Bulaşık makinesini dolunca çalıştırmak', img: 'plate', bin: 'tasarruf' },
  { label: 'Enerji tasarruflu ampul seçmek', img: 'bulb2', bin: 'tasarruf' },
  { label: 'Televizyon açıkken uyumak', img: 'television', bin: 'israf' },
  { label: 'Buzdolabı kapağını açık bırakmak', img: 'ice', bin: 'israf' },
  { label: 'Telefonu sürekli şarjda tutmak', img: 'phone', bin: 'israf' },
  { label: 'Boş odada lambayı yakmak', img: 'bulb', bin: 'israf' },
]
const FATURA_Q: Q[] = [
  { q: 'Vefa ailesinin faturası 900 TL’den 600 TL’ye düştü. Ne kadar tasarruf ettiler?', a: '300 TL', w: ['200 TL', '150 TL', '600 TL'], ex: '900 − 600 = 300 TL tasarruf.', img: 'banknote' },
  { q: 'Çiçek ailesi tasarruf planı yaptı. Faturaları nasıl değişir?', a: 'Azalır', w: ['Artar', 'Hep aynı kalır', 'İkiye katlanır'], ex: 'Tasarruflu davranışlar faturayı azaltır.', img: 'chart' },
  { q: 'Elektrik neden tasarruflu kullanılmalı?', a: 'Sınırlı bir kaynak olduğu için', w: ['Hiç bitmediği için', 'Ücretsiz olduğu için', 'Gereksiz olduğu için'], ex: 'Tasarruf doğayı korur, aile bütçesine katkı sağlar.', img: 'zap' },
  { q: 'Haziranda 500 TL, temmuzda 400 TL fatura geldi. Fark ne kadar?', a: '100 TL', w: ['900 TL', '400 TL', '50 TL'], ex: '500 − 400 = 100 TL azaldı.', img: 'banknote' },
  { q: 'Hangisi tasarruf planına eklenmez?', a: 'Işık açık uyumak', w: ['Gereksiz ışığı söndürmek', 'Fişi çekmek', 'Nemliyken ütülemek'], ex: 'Işık açık uyumak elektriği boşa harcar.', img: 'bulb' },
]
const PLAN_O: O[] = [
  { q: 'Tasarruf planı yapmayı sırala.', s: ['Bu ayın faturasını incele', 'Kontrol listesi hazırla', 'Tasarruflu davran', 'Bir ay uygula', 'Yeni faturayı eskisiyle karşılaştır'], ex: 'Plan, uygula, karşılaştır!', img: 'calendar' },
]
const TASARRUF_P: P[] = [
  ['Boş odada ışık yanıyor', 'Işığı söndür', 'bulb'],
  ['Çamaşır makinesi yarı boş', 'Dolunca çalıştır', 'tshirt'],
  ['Telefon şarjı doldu', 'Büyüğün şarjdan çıkarsın', 'phone'],
  ['Saçın sırılsıklam', 'Önce havluyla kurula', 'droplet'],
  ['Buzdolabı açık kaldı', 'Kapağını kapat', 'ice'],
  ['Eski ampul yandı', 'Tasarruflu ampul seç', 'bulb2'],
]

/* ================================================================================================
 * 7. ÜNİTE · TOPRAĞI TANIYORUM, TARIMI KEŞFEDİYORUM
 * ================================================================================================ */
/* --- FB.3.7.1 Toprak Oluşumu ve Yapısı --- */
const TOPRAK_MODEL = model('Toprak kavanozundaki maddeleri çizime yerleştir!', 'Toprak bir karışımdır: kum, kil, küçük taşlar, canlı kalıntıları, hava, su ve solucanlar.', 'toprak', [['kalinti', 'Canlı kalıntıları'], ['solucan', 'Solucan'], ['kil', 'Kil'], ['kum', 'Kum'], ['tas', 'Küçük taşlar'], ['hava', 'Hava ve su']], ['Plastik', 'Cam kırığı', 'Pil'])
const TOPRAK_O: O[] = [
  { q: 'Toprağın oluşumunu sırala.', s: ['Kayaçlar yağmur ve rüzgârla aşınır', 'Kayaçlar küçük parçalara ufalanır', 'Araya hava ve su karışır', 'Çürümüş canlı kalıntıları eklenir', 'Toprak oluşur'], ex: 'Toprağın oluşması binlerce yıl sürebilir; bu yüzden korumalıyız.', img: 'mountain' },
  { q: 'Toprağı inceleme deneyini sırala (bir büyüğün yardımıyla).', s: ['Eldivenini giy', 'Bahçeden toprak örneği al', 'Şeffaf bardağa koy', 'Büyüteçle incele', 'Gördüklerini tabloya yaz', 'Ellerini yıka'], ex: 'Toprağı eldivenle inceler, sonra ellerimizi yıkarız.', img: 'gloves' },
]
const TOPRAK_HIT = ['Kum', 'Kil', 'Küçük taş', 'Su', 'Hava', 'Solucan', 'Bitki kökü']
const TOPRAK_WRONG = ['Plastik poşet', 'Cam kırığı', 'Pil', 'Teneke kutu']
const TOPRAK_IMG: Record<string, string> = { Su: 'droplet', Solucan: 'worm', 'Küçük taş': 'rock', 'Plastik poşet': 'trash', Pil: 'battery', 'Teneke kutu': 'can' }
const TOPRAK_P: P[] = [
  ['Solucan', 'Toprağı havalandırır', 'worm'],
  ['Canlı kalıntıları', 'Toprağı verimli yapar', 'fallenleaf'],
  ['Hava', 'Toprak canlılarının solunumu', 'cloud'],
  ['Su', 'Bitkinin büyümesi', 'droplet'],
  ['Kum, kil, taş', 'Toprağın ana maddesi', 'rock'],
]
const TOPRAK_TF: TF[] = [
  ['Bitkilerin çoğu kupkuru toprakta yetişir.', false, 'Bitkiler büyümek için suya ihtiyaç duyar.'],
  ['Toprakta canlı kalıntıları, hava ve su da bulunur.', true, 'Toprak bir karışımdır.'],
  ['Toprak, kayaçların parçalanmasıyla oluşur.', true, 'Kayaçlar uzun yıllarda ufalanır.'],
  ['Toprağın her yeri aynı renktedir.', false, 'Toprak kahverengi, siyah, kırmızımsı olabilir.'],
  ['Toprağın her yeri aynı sertliktedir.', false, 'Bazı topraklar yumuşak, bazıları serttir.'],
  ['Bir avuç toprak çok uzun yıllarda oluşur.', true, 'Bu yüzden toprağı korumalıyız.'],
  ['Solucanlar toprağa zarar verir.', false, 'Solucanlar toprağı havalandırır, verimini artırır.'],
]
const TOPRAK_Q: Q[] = [
  { q: 'Yerin en üst bölümüne ne denir?', a: 'Toprak', w: ['Bulut', 'Fosil', 'Mineral'], ex: 'Toprak yerin en üst bölümüdür; besinlerimizin çoğu toprakta yetişir.', img: 'plantpot' },
  { q: 'Üç toprak var: A suyu yavaş, B çok yavaş, C hızlı emiyor. Suyu en hızlı emen hangisi?', a: 'C', w: ['A', 'B', 'Hepsi aynı'], ex: 'Tabloyu okuyunca C toprağının suyu hızlı emdiğini görürüz.', img: 'chart' },
  { q: 'Suyu çok yavaş emen toprağa çok su dökersek ne olur?', a: 'Su üstünde birikir', w: ['Toprak uçar', 'Su hemen kaybolur', 'Toprak taşa döner'], ex: 'Suyu yavaş geçiren toprakta su birikir.', img: 'water2' },
  { q: 'Toprağı incelerken neden eldiven giyeriz?', a: 'Ellerimizi korumak için', w: ['Toprağı ısıtmak için', 'Süslenmek için', 'Toprağı tatmak için'], ex: 'Eldiven giyer, işimiz bitince ellerimizi yıkarız.', img: 'gloves' },
  { q: 'Toprak bir karışım mıdır?', a: 'Evet, birçok maddeden oluşur', w: ['Hayır, tek maddedir', 'Hayır, bir gazdır', 'Hayır, bir sıvıdır'], ex: 'Kum, kil, taş, hava, su ve canlı kalıntıları birlikte bulunur.', img: 'salad' },
]

/* --- FB.3.7.2 Bitki Yetiştirme --- */
const SAKSI_MODEL = model('Bitkinin ihtiyaçlarını saksı çizimine yerleştir!', 'Bitki büyümek için ışık, su ve uygun sıcaklık ister.', 'saksi', [['isik', 'Işık'], ['su', 'Su'], ['sicaklik', 'Uygun sıcaklık']], ['Karanlık', 'Gürültü', 'Çöp'])
const IHTIYAC_HIT = ['Su', 'Güneş ışığı', 'Uygun sıcaklık', 'Havadar toprak', 'Doğal gübre']
const IHTIYAC_WRONG = ['Karanlık dolap', 'Gürültü', 'Çöp', 'Plastik poşet', 'Buz gibi soğuk']
const IHTIYAC_IMG: Record<string, string> = { Su: 'droplet', 'Güneş ışığı': 'sun', 'Uygun sıcaklık': 'thermometer', 'Doğal gübre': 'leaf', Gürültü: 'drum', Çöp: 'trash', 'Buz gibi soğuk': 'snowflake' }
const ORTAKB_BINS: SortQ['bins'] = [
  { id: 'ortak', label: 'Her bitkide ortak', img: 'seedling', color: '#22c55e' },
  { id: 'degisir', label: 'Bitkiye göre değişir', img: 'puzzle', color: '#f59e0b' },
]
const ORTAKB_ITEMS: SortQ['items'] = [
  { label: 'Işığa ihtiyaç', img: 'sun', bin: 'ortak' },
  { label: 'Suya ihtiyaç', img: 'droplet', bin: 'ortak' },
  { label: 'Uygun sıcaklık', img: 'thermometer', bin: 'ortak' },
  { label: 'Yetiştiği mevsim', img: 'calendar', bin: 'degisir' },
  { label: 'Toprak yapısı', img: 'plantpot', bin: 'degisir' },
  { label: 'Ürün verme süresi', img: 'hourglass', bin: 'degisir' },
  { label: 'Çimlenme hızı', img: 'stopwatch', bin: 'degisir' },
]
const EKIM_O: O[] = [
  { q: 'Fideyle bitki yetiştirmeyi sırala.', s: ['Saksıya bitkinin adını yaz', 'Saksıyı toprakla doldur', 'Fideyi dikkatle yerleştir', 'Güneş alan bir yere koy', 'Düzenli sula', 'Her gün gözlemle'], ex: 'Işık, su ve uygun sıcaklık fidenin büyümesini sağlar.', img: 'plantpot' },
  { q: 'Tohumla bitki yetiştirmeyi sırala.', s: ['Bardağa nemli toprak koy', 'Tohumu yerleştir', 'Üstünü hafifçe toprakla ört', 'Az su ver', 'Filizlenince güneşli yere al'], ex: 'Tohum önce filizlenir, sonra fide olur.', img: 'seedling' },
  { q: 'Tohumdan sofraya yolculuğu sırala.', s: ['Tohum', 'Filiz', 'Fide', 'Büyümüş bitki', 'Ürün', 'Sofra'], ex: 'Emek verilen bitki ürün verir, ürün soframıza gelir.', img: 'tomato' },
]
const BILMECE_P: P[] = [
  ['Kırmızıyım, salataya yakışırım', 'Domates', 'tomato', 'tomato'],
  ['Turuncuyum, tavşanlar beni sever', 'Havuç', 'rabbit', 'carrot'],
  ['Toprağın altında saklanırım, kızartılırım', 'Patates', 'plantpot'],
  ['Dallarda salkım salkımım', 'Üzüm', 'grapes', 'grapes'],
  ['Kırmızı, yeşil, sarı olurum; keke yakışırım', 'Elma', 'cake', 'apple'],
  ['Altın başaklarım ekmek olur', 'Buğday', 'bread', 'wheat'],
]
const BITKI_Q: Q[] = [
  { q: 'Toprakta sebze, meyve ve tahıl yetiştirmeye ne denir?', a: 'Tarım', w: ['Madencilik', 'Geri dönüşüm', 'Fosilleşme'], ex: 'Pazardaki domates, patates soframıza tarımla gelir.', img: 'tractor' },
  { q: 'Saksıdaki toprak kupkuru. Ne yaparsın?', a: 'Bitkiyi sularım', w: ['Hiç sulamam', 'Karanlığa koyarım', 'Toprağı atarım'], ex: 'Kuru toprak suya ihtiyaç duyar.', img: 'droplet' },
  { q: 'Saksıdaki toprak çok ıslak. Ne yaparsın?', a: 'Bugün sulamam, beklerim', w: ['Daha çok su dökerim', 'Buz koyarım', 'Bitkiyi sökerim'], ex: 'Fazla su köklere zarar verebilir.', img: 'water2' },
  { q: 'Bitki hiç ışık almazsa ne olur?', a: 'Sağlıklı gelişemez', w: ['Daha hızlı büyür', 'Meyvesi büyür', 'Hiçbir şey olmaz'], ex: 'Bitki besin yapmak için Güneş’ten enerji alır.', img: 'sun' },
  { q: 'Ailelerin yıllarca koruyup bugüne getirdiği tohumlara ne denir?', a: 'Ata tohumu', w: ['Plastik tohum', 'Fosil tohum', 'Maden tohumu'], ex: 'Ata tohumlarını korumak bitki çeşitliliğini sürdürür.', img: 'seedling' },
  { q: 'Ayşe tohumu ılık köşeye koyup düzenli suladı. Ne oldu?', a: 'Tohum filizlendi', w: ['Tohum taşa döndü', 'Tohum uçtu', 'Tohum eridi'], ex: 'Uygun sıcaklık ve su tohumun filizlenmesini sağlar.', img: 'seedling' },
]
const TARIM_TF: TF[] = [
  ['Ata tohumlarını korumak bitki çeşitliliğine katkı sağlar.', true, 'Ata tohumu doğal mirasımızdır.'],
  ['Her bitki aynı mevsimde yetişir.', false, 'Mevsim bitkiden bitkiye değişir.'],
  ['Bitkiye ne kadar çok su verirsek o kadar iyidir.', false, 'Fazla su köklere zarar verir; ölçülü sularız.'],
  ['Doğal gübre ve kompost toprağı besler.', true, 'Kimyasal gübre yerine doğal gübre çevre dostudur.'],
  ['Toprağı betonla kaplamak tarımı korur.', false, 'Toprak azalırsa yetiştirilen bitki de azalır.'],
  ['Domates fidesi bol güneş ve su ister.', true, 'Domates güneşi seven bir bitkidir.'],
]
const KORU_T_BINS: SortQ['bins'] = [
  { id: 'korur', label: 'Toprağı korur', img: 'seedling', color: '#22c55e' },
  { id: 'zarar', label: 'Toprağa zarar verir', img: 'noentry', color: '#ef4444' },
]
const KORU_T_ITEMS: SortQ['items'] = [
  { label: 'Kompost yapmak', img: 'leaf', bin: 'korur' },
  { label: 'Doğal gübre kullanmak', img: 'fallenleaf', bin: 'korur' },
  { label: 'Ağaç dikmek', img: 'tree', bin: 'korur' },
  { label: 'Toprağı havalandırmak', img: 'worm', bin: 'korur' },
  { label: 'Toprağa çöp atmak', img: 'trash', bin: 'zarar' },
  { label: 'Tarlayı betonla kaplamak', img: 'construction', bin: 'zarar' },
  { label: 'Pili toprağa gömmek', img: 'battery', bin: 'zarar' },
  { label: 'Plastik poşeti bahçede bırakmak', img: 'trash', bin: 'zarar' },
]

/* ================================================================================================
 * 8. ÜNİTE · CANLILARIN YAŞAM ALANLARINA YOLCULUK
 * ================================================================================================ */
/* --- FB.3.8.1 Yaşam Alanları --- */
const YASAM_MODEL = model('Yaşam alanlarının adlarını çizime yerleştir!', 'Orman ağaçlıktır, deniz tuzlu ve derindir, göl karayla çevrilidir, çöl kumlu ve kuraktır.', 'yasam', [['orman', 'Orman'], ['deniz', 'Deniz'], ['gol', 'Göl'], ['col', 'Çöl']], ['Kutup', 'Mağara', 'Şehir'])
const ALAN_BINS: SortQ['bins'] = [
  { id: 'orman', label: 'Orman', img: 'evergreen', color: '#16a34a' },
  { id: 'deniz', label: 'Deniz', img: 'wave', color: '#0284c7' },
  { id: 'col', label: 'Çöl', img: 'desert', color: '#d97706' },
]
const ALAN_ITEMS: SortQ['items'] = [
  { label: 'Sincap', img: 'squirrel', bin: 'orman' },
  { label: 'Ayı', img: 'bear', bin: 'orman' },
  { label: 'Meşe ağacı', img: 'tree', bin: 'orman' },
  { label: 'Hamsi', img: 'fish', bin: 'deniz' },
  { label: 'Ahtapot', img: 'octopus', bin: 'deniz' },
  { label: 'Yengeç', img: 'crab', bin: 'deniz' },
  { label: 'Deve', bin: 'col' },
  { label: 'Kaktüs', img: 'cactus', bin: 'col' },
  { label: 'Kertenkele', img: 'lizard', bin: 'col' },
]
const ALAN2_BINS: SortQ['bins'] = [
  { id: 'gol', label: 'Göl', img: 'water2', color: '#0ea5e9' },
  { id: 'orman', label: 'Orman', img: 'evergreen', color: '#16a34a' },
  { id: 'col', label: 'Çöl', img: 'desert', color: '#d97706' },
]
const ALAN2_ITEMS: SortQ['items'] = [
  { label: 'Nilüfer', img: 'flower', bin: 'gol' },
  { label: 'Sazan balığı', img: 'fish2', bin: 'gol' },
  { label: 'Kurbağa', img: 'frog', bin: 'gol' },
  { label: 'Ceylan', bin: 'orman' },
  { label: 'Çınar ağacı', img: 'tree2', bin: 'orman' },
  { label: 'Örümcek', img: 'spider', bin: 'orman' },
  { label: 'Akrep', bin: 'col' },
  { label: 'Yılan', bin: 'col' },
  { label: 'Çöl otu', img: 'herb', bin: 'col' },
]
const ALAN_P: P[] = [
  ['Orman', 'Ağaçlık, gölgelik, yağışlı', 'evergreen'],
  ['Deniz', 'Tuzlu, derin, dalgalı', 'wave'],
  ['Göl', 'Etrafı karayla çevrili durgun su', 'water2'],
  ['Çöl', 'Kumlu, çok az yağışlı', 'desert'],
  ['Taşın altı', 'Küçük, nemli ve karanlık', 'rock'],
]
const YASAM_Q: Q[] = [
  { q: 'Bir canlının yaşadığı, yiyecek bulduğu ve güvende hissettiği yere ne denir?', a: 'Yaşam alanı', w: ['Maden', 'Karışım', 'Fosil'], ex: 'Her canlının kendine uygun bir yaşam alanı vardır.', img: 'house' },
  { q: 'Gündüz çok sıcak, gece serin olan yaşam alanı hangisidir?', a: 'Çöl', w: ['Göl', 'Orman', 'Deniz'], ex: 'Çölde çok az yağış olur, su azdır.', img: 'desert' },
  { q: 'Suyu genellikle tatlı ve durgun olan yaşam alanı hangisidir?', a: 'Göl', w: ['Deniz', 'Çöl', 'Dağ'], ex: 'Göller karayla çevrilidir, çoğu denizden sığdır.', img: 'water2' },
  { q: 'Hamsi neden çölde yaşayamaz?', a: 'Suda yaşamaya uygun olduğu için', w: ['Kumu sevmediği için', 'Çok büyük olduğu için', 'Uçamadığı için'], ex: 'Her canlı kendi özelliklerine uygun yerde yaşar.', img: 'fish' },
  { q: 'Taşın altında hangi canlıyı görmemiz olasıdır?', a: 'Solucan', w: ['Balina', 'Deve', 'Penguen'], ex: 'Taşın altı küçük bir yaşam alanıdır.', img: 'worm' },
  { q: 'Doğa gezisinde bilmediğin bir böcek gördün. Ne yaparsın?', a: 'Uzaktan gözler, dokunmam', w: ['Elime alırım', 'Kavanoza kapatırım', 'Korkuturum'], ex: 'Canlıları korkutmaz, onlara zarar vermeyiz.', img: 'magnifier' },
]
const COL_HIT = ['Deve', 'Kertenkele', 'Akrep', 'Kaktüs', 'Yılan', 'Çöl otu']
const COL_WRONG = ['Hamsi', 'Ahtapot', 'Nilüfer', 'Penguen', 'Sazan']
const COL_IMG: Record<string, string> = { Kertenkele: 'lizard', Kaktüs: 'cactus', Hamsi: 'fish', Ahtapot: 'octopus', Penguen: 'penguin', Nilüfer: 'flower' }

/* --- FB.3.8.2 Canlı Çeşitliliği --- */
const CESIT_Q: Q[] = [
  { q: 'Bahçe A’da 10 tavşan var. Bahçe B’de tavşan, sincap, kuş ve kelebek var. Hangisi daha çeşitli?', a: 'Bahçe B', w: ['Bahçe A', 'İkisi eşit', 'Hiçbiri'], ex: 'Çeşitlilik, farklı canlıların sayısıdır.', img: 'rabbit' },
  { q: 'Bir gölde kurbağa, ördek, sazan ve nilüfer var. Kaç farklı canlı var?', a: '4', w: ['1', '2', '10'], ex: 'Dört farklı canlı var.', img: 'frog' },
  { q: 'Canlı çeşitliliği neyle ilgilidir?', a: 'Farklı canlıların sayısıyla', w: ['Bir canlının boyuyla', 'Tek bir canlının sayısıyla', 'Havanın rengiyle'], ex: 'Bir türden çok sayıda olması çeşitlilik değildir.', img: 'sparkles' },
  { q: 'Doğayı ve hayvanları korumak için devletin koruduğu bölgeye ne denir?', a: 'Millî park', w: ['Otopark', 'Lunapark', 'Fabrika'], ex: 'Uludağ bir millî parktır.', img: 'evergreen' },
  { q: 'Uludağ’da sayısı çok azalmış hangi kuş yaşar?', a: 'Sakallı akbaba', w: ['Penguen', 'Devekuşu', 'Flamingo'], ex: 'Uludağ’da çok sayıda kuş yaşar; sakallı akbaba bunlardan biridir.', img: 'bird' },
  { q: 'Gözlem gezisinde hangi araç küçük canlıları görmemize yardım eder?', a: 'Büyüteç', w: ['Çekiç', 'Makas', 'Ütü'], ex: 'Büyüteç, dürbün ve not defteri gözlemcinin dostudur.', img: 'magnifier' },
]
const ULUDAG_HIT = ['Kestane ağacı', 'Kayın ağacı', 'Sincap', 'Tilki', 'Kirpi', 'Karaca', 'Bülbül']
const ULUDAG_WRONG = ['Deve', 'Penguen', 'Ahtapot', 'Kaktüs']
const ULUDAG_IMG: Record<string, string> = { Sincap: 'squirrel', Tilki: 'fox', Kirpi: 'hedgehog', Bülbül: 'bird2', Penguen: 'penguin', Ahtapot: 'octopus', Kaktüs: 'cactus' }
const CESIT_TF: TF[] = [
  ['Bir yerde çok tavşan varsa çeşitlilik fazladır.', false, 'Çeşitlilik farklı canlıların sayısıdır.'],
  ['Uludağ’da çok sayıda farklı canlı yaşar.', true, 'Uludağ canlı çeşitliliği zengin bir millî parktır.'],
  ['Gözlemde canlıları korkutmayız.', true, 'Sabırlı oluruz, canlılara zarar vermeyiz.'],
  ['Bilmediğimiz bitkiye hemen dokunuruz.', false, 'Bilmediğimiz bitki ve hayvana dokunmayız.'],
  ['Taşın altı da küçük bir yaşam alanıdır.', true, 'Orada solucan, karınca gibi canlılar yaşar.'],
  ['Millî parklar doğayı korumak için ayrılır.', true, 'Millî parklar devlet koruması altındadır.'],
]

/* --- FB.3.8.3 Yaşam Alanlarının Korunması --- */
const KORU_BINS: SortQ['bins'] = [
  { id: 'korur', label: 'Yaşam alanını korur', img: 'shield', color: '#22c55e' },
  { id: 'zarar', label: 'Zarar verir', img: 'noentry', color: '#ef4444' },
]
const KORU_ITEMS: SortQ['items'] = [
  { label: 'Fidan dikmek', img: 'seedling', bin: 'korur' },
  { label: 'Yangına karşı önlem almak', img: 'extinguisher', bin: 'korur' },
  { label: 'Enerjiyi dikkatli kullanmak', img: 'bulb', bin: 'korur' },
  { label: 'Çöpü çöp kutusuna atmak', img: 'wastebasket', bin: 'korur' },
  { label: 'Ağaçları kontrolsüz kesmek', img: 'wood', bin: 'zarar' },
  { label: 'Göle çöp atmak', img: 'trash', bin: 'zarar' },
  { label: 'Denize plastik bırakmak', img: 'bottle', bin: 'zarar' },
  { label: 'Ormanda ateş yakmak', img: 'fire', bin: 'zarar' },
]
const IHT_HIT = ['Temiz hava', 'Temiz su', 'Besin', 'Barınak', 'Güvenli çevre']
const IHT_WRONG = ['Çöp yığını', 'Gürültü', 'Kirli duman', 'Plastik poşet']
const IHT_IMG: Record<string, string> = { 'Temiz hava': 'cloud', 'Temiz su': 'droplet', Besin: 'apple', Barınak: 'house', 'Güvenli çevre': 'shield', 'Çöp yığını': 'trash', Gürültü: 'drum', 'Plastik poşet': 'trash' }
const ORMAN_O: O[] = [
  { q: 'Ağaçlar kesilince ne olur? Sırala.', s: ['Ormanda ağaçlar kesilir', 'Kuşlar yuvasız kalır', 'Böcekler beslenemez', 'Canlı çeşitliliği azalır'], ex: 'Yaşam alanı zarar görünce canlılar da zarar görür.', img: 'wood' },
  { q: 'Ormanı yeniden yeşertmeyi sırala.', s: ['Fidan dik', 'Fidanları sula', 'Yangına karşı önlem al', 'Kuşlar ve sincaplar geri döner'], ex: 'Yaşam alanını korumak canlı çeşitliliğini korumaktır.', img: 'seedling' },
]
const KORU_Q: Q[] = [
  { q: 'Bir ormanın ağaçları kesilirse kuşlar ne olur?', a: 'Yuvasız kalır', w: ['Daha mutlu olur', 'Daha çok çoğalır', 'Hiç etkilenmez'], ex: 'Ağaçta yuva yapan kuşlar yaşam alanını kaybeder.', img: 'bird' },
  { q: 'Kesilmiş bir orman nasıl yeniden yeşerir?', a: 'Fidan dikip bakarak', w: ['Beton dökerek', 'Çöp atarak', 'Hiçbir şey yapmayarak'], ex: 'Fidan dikmek ormanı geri getirir.', img: 'seedling' },
  { q: 'Okullarda enerjiyi verimli kullanan projeye verilen etiket hangisidir?', a: 'Mavi Yeşil Okul', w: ['Kırmızı Okul', 'Gece Okulu', 'Yaz Okulu'], ex: 'Enerji dostu okullar Mavi Yeşil Okul Etiketi alabilir.', img: 'school' },
  { q: 'Yaşam alanı yok olursa canlılara ne olur?', a: 'Onlar da yok olabilir', w: ['Daha çok çoğalır', 'Hiç etkilenmez', 'Hemen büyür'], ex: 'Yaşam alanını korumak canlıyı korumaktır.', img: 'sad' },
  { q: 'Göle çöp atılırsa ne olur?', a: 'Su kirlenir, canlılar zarar görür', w: ['Su temizlenir', 'Balıklar çoğalır', 'Nilüferler büyür'], ex: 'Göl ve denize çöp atmak yaşam alanını tehdit eder.', img: 'trash' },
]
const KORU_TF: TF[] = [
  ['Canlılar yaşamak için temiz hava ve suya ihtiyaç duyar.', true, 'Temiz hava, su, besin ve güvenli çevre gerekir.'],
  ['Ağaç kesmek canlı çeşitliliğini artırır.', false, 'Ağaçlar kesilince canlı çeşitliliği azalır.'],
  ['Fidan dikmek yaşam alanlarını korur.', true, 'Her fidan bir canlıya yuva olabilir.'],
  ['Yaşam alanını korumak canlı çeşitliliğini korumaktır.', true, 'İkisi birbirine bağlıdır.'],
  ['Şehirleri bilinçsizce planlamak doğaya zarar vermez.', false, 'Bilinçsiz planlama yaşam alanlarını tehdit eder.'],
]

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
const T = 6 // tur sayısı
const OYUN = 8

export const FEN3_ADALAR: Alan[] = [
  {
    id: 'u1',
    no: 1,
    title: 'Bilimsel Keşif Yolculuğu',
    color: '#2ec4c9',
    dark: '#149aa0',
    icon: 'magnifier',
    acts: [
      { kind: 'hangi-yontem', title: 'Hangi Yöntem?', icon: 'magnifier', total: T, meb: 'FB.3.1.1', gen: ch(YONTEM_Q), ders: 'Bilim insanları bilgiye altı yolla ulaşır: tahmin etme, gözlem yapma, model oluşturma, belge taraması, deney yapma ve iletişim kurma.', points: ['Gözle, tahmin et', 'Model kur, deney yap', 'Belge incele, soru sor'], visual: img('magnifier') },
      { kind: 'yontem-eslestir', title: 'Yöntem Eşleştir', icon: 'link', total: 4, meb: 'FB.3.1.1', gen: mt('Yöntemi anlamıyla eşleştir.', 'Her yöntemin kendine özgü bir yolu var.', YONTEM_P), ders: 'Tahmin “Bence…” demektir; gözlem dikkatle incelemektir; model küçük bir benzerdir.', visual: img('link') },
      { kind: 'yontem-hafiza', title: 'Yöntem Kartları', icon: 'puzzle', total: 3, meb: 'FB.3.1.1', gen: mem('Yöntem kartlarını eşleştir!', 'Yöntem adı ve anlamı.', YONTEM_P), ders: 'Kartları çevir, yöntemi anlamıyla eşleştir!', visual: img('puzzle') },
      { kind: 'gok-modeli', title: 'Toplarla Gökyüzü', icon: 'earth', total: 3, meb: 'FB.3.1.1', gen: GOK_MODEL, ders: 'Model oluşturmak bir şeyin küçük bir benzerini yapmaktır. Farklı büyüklükte toplarla Güneş, Dünya ve Ay’ı karşılaştırabiliriz.', points: ['En büyük: Güneş', 'Ortanca: Dünya', 'En küçük: Ay'], visual: img('earth') },
      { kind: 'tahmin-gozlem', title: 'Tahmin mi, Gözlem mi?', icon: 'thinking', total: 4, meb: 'FB.3.1.1', gen: srt('Bu cümle bir tahmin mi, bir gözlem mi?', 'Tahmin “Bence olacak” der; gözlem şu an gördüğümüzü anlatır.', TAHMIN_BINS, TAHMIN_ITEMS), ders: 'Tahmin önceki bilgilerimize dayanır. Gözlem ise dikkatle bakıp gördüğümüzü kaydetmektir.', visual: img('thinking') },
      { kind: 'guvenilir-kaynak', title: 'Güvenilir Kaynak', icon: 'books', total: 4, meb: 'FB.3.1.1', gen: srt('Bu kaynak güvenilir mi, yoksa önce kontrol mi etmeliyiz?', 'Ansiklopedi ve öğretmen güvenilirdir; kulaktan dolma bilgiyi kontrol ederiz.', KAYNAK_BINS, KAYNAK_ITEMS), ders: 'Bilgi toplarken kitap, dergi ve güvenilir kaynakları kullanırız. Emin olmadığımız bilgiyi bir büyüğümüzle kontrol ederiz.', visual: img('books') },
      { kind: 'arastirma-adimlari', title: 'Araştırma Adımları', icon: 'memo', total: 3, meb: 'FB.3.1.1', gen: ord(ARASTIRMA_O), ders: 'Merak ederiz, soru sorarız, yöntem seçeriz, veri toplar ve paylaşırız. Deneyleri bir büyüğün yardımıyla yaparız.', visual: img('memo') },
      { kind: 'gozlem-defteri', title: 'Göçmen Kuş Defteri', icon: 'bird', total: 5, meb: 'FB.3.1.1', gen: ch(KUS_Q), ders: 'Gözlem defterine kuşları sayıp yazarız. Veriler grafikle kaydedilir; grafiği okuyup karşılaştırma yaparız.', points: ['Say ve kaydet', 'Grafiği oku', 'Karşılaştır'], visual: img('chart') },
      { kind: 'yontem-dogru-mu', title: 'Bilim Doğru mu?', icon: 'checkered', total: T, meb: 'FB.3.1.1', gen: tf(YONTEM_TF, 'scientist'), ders: 'Yöntemler her zaman aynı sırayla kullanılmaz. Önemli olan farklı yolları denemek ve güvenilir kaynak kullanmaktır.', visual: img('scientist') },
      { kind: 'bilim-insani-gibi', title: 'Bilim İnsanı Gibi', icon: 'balloon', total: 4, meb: 'FB.3.1.2', gen: pop('Bilim insanlarının özelliklerini patlat!', 'Sabırlı, meraklı, dürüst, iş birlikçi ve yaratıcıdırlar.', BILIM_HIT, BILIM_WRONG), ders: 'Bilim insanları sabırlı ve kararlıdır, duydukları her şeye hemen inanmaz, kanıt ararlar.', visual: img('scientist') },
      { kind: 'herkes-mi', title: 'Herkes mi, Bazısı mı?', icon: 'scientist', total: 4, meb: 'FB.3.1.2', gen: srt('Bu özellik bütün bilim insanlarında var mı?', 'Merak ve sabır ortaktır; çalıştıkları alan kişiden kişiye değişir.', ORTAK_BINS, ORTAK_ITEMS), ders: 'Bilim insanlarının ortak özellikleri vardır; ama çalıştıkları alan ve ilgi alanları farklıdır.', visual: img('scientist') },
      { kind: 'bilim-kartlari', title: 'Bilim Kartları', icon: 'framed', total: 4, meb: 'FB.3.1.2', gen: mt('Kartı bilgisiyle eşleştir.', 'Bilim insanları ve bilim araçları.', BILIMCI_P), ders: 'Aziz Sancar Nobel ödülü aldı; Safiye Ali ilk kadın doktorumuzdur; Cahit Arf büyük bir matematikçidir.', visual: img('framed') },
      { kind: 'bilim-insanlari', title: 'Bilim İnsanları', icon: 'scientist', total: T, meb: 'FB.3.1.2', gen: rot(ch(BILIM_Q), tf(BILIM_TF, 'scientist')), ders: 'Bilim insanları meraklı, sabırlı, dürüst ve sorumludur. İş birliği yapar, doğayı korurlar.', points: ['Sabırlı ve kararlı', 'Eleştirel düşünür', 'Doğayı korur'], visual: img('scientist') },
      { kind: 'oyun-arastirma-defteri', title: 'Fındık’ın Araştırma Defteri', icon: 'notebook', total: OYUN, meb: 'FB.3.1.1', oyun: true, gen: karma(ch(YONTEM_Q), GOK_MODEL, ord(ARASTIRMA_O), ch(KUS_Q), tf(YONTEM_TF)), ders: 'Fındık bir merak sorusu getirdi! Yöntem seç, modeli kur, adımları diz ve veriyi oku.', visual: img('notebook') },
      { kind: 'oyun-bilim-galerisi', title: 'Bilim Galerisi', icon: 'framed', total: 4, meb: 'FB.3.1.2', oyun: true, gen: rot(mem('Bilim kartlarını eşleştir!', 'Bilim insanları ve araçlar.', BILIMCI_P), pop('Bilim insanı özelliklerini patlat!', 'Ortak özellikler.', BILIM_HIT, BILIM_WRONG), srt('Hepsinde mi, kişiye göre mi?', 'Ortak ve farklı özellikler.', ORTAK_BINS, ORTAK_ITEMS)), ders: 'Galeriyi gez, her tabloda saklı özelliği bul!', visual: img('framed') },
    ],
  },
  {
    id: 'u2',
    no: 2,
    title: 'Canlılar Dünyasına Yolculuk',
    color: '#4caf50',
    dark: '#2e7d32',
    icon: 'butterfly',
    acts: [
      { kind: 'canli-cansiz', title: 'Canlı mı, Cansız mı?', icon: 'seedling', total: 4, meb: 'FB.3.2.1', gen: srt('Bu varlık canlı mı, cansız mı?', 'Canlılar büyür, beslenir, ürer, hareket eder, tepki verir, solunum ve boşaltım yapar.', CANLI_BINS, CANLI_ITEMS), ders: 'Canlıların yedi ortak özelliği vardır: büyüme, beslenme, üreme, hareket, tepki verme, boşaltım ve solunum.', visual: img('seedling') },
      { kind: 'hangi-ozellik', title: 'Hangi Özellik?', icon: 'link', total: 4, meb: 'FB.3.2.1', gen: mt('Cümleyi canlılık özelliğiyle eşleştir.', 'Her cümle bir canlılık özelliğini anlatır.', OZELLIK_P), ders: 'Çorba içmek beslenme, terlemek boşaltım, ürkmek tepki vermedir.', visual: img('link') },
      { kind: 'uc-grup', title: 'Bitki, Hayvan, Mantar', icon: 'paw', total: 4, meb: 'FB.3.2.1', gen: srt('Bu canlı hangi gruba girer?', 'Bitkiler besinini kendisi üretir; hayvanlar farklı yerlerde yaşar; mantarlar nemi sever.', GRUP_BINS, GRUP_ITEMS), ders: 'Canlıları dört grupta inceleriz: mikroskopla görülebilen canlılar, mantarlar, bitkiler ve hayvanlar.', visual: img('paw') },
      { kind: 'canlilar-dunyasi', title: 'Canlılar Dünyası', icon: 'microbe', total: T, meb: 'FB.3.2.1', gen: rot(ch(CANLI_Q), tf(CANLI_TF, 'microbe')), ders: 'Sınıflandırma, canlıları benzer özelliklerine göre gruplamaktır. Bazı mantarlar zehirlidir; doğada bulduğumuz mantara dokunmayız.', points: ['Sınıflandırma kolaylık sağlar', 'Mikroskopla küçük canlılar', 'Mantara dokunma!'], visual: img('microbe') },
      { kind: 'mikroskop-masasi', title: 'Mikroskop Masası', icon: 'microscope', total: 3, meb: 'FB.3.2.1', gen: ord(MIKRO_O), ders: 'Lam uzun bir cam, lamel küçük ince bir camdır. Cam kırılabilir; öğretmenimizle dikkatle çalışırız.', visual: img('microscope') },
      { kind: 'duyu-modeli', title: 'Duyu Avatarı', icon: 'eye', total: 3, meb: 'FB.3.2.2', gen: DUYU_MODEL, ders: 'İnsanda beş duyu organı vardır: göz, kulak, burun, dil ve deri.', points: ['Göz görür, kulak duyar', 'Burun koklar, dil tadar', 'Deri dokunmayı algılar'], visual: img('eye') },
      { kind: 'duyu-eslestir', title: 'Duyu Hafızası', icon: 'puzzle', total: 3, meb: 'FB.3.2.2', gen: mem('Duyu organını göreviyle eşleştir!', 'Her duyu organının bir görevi var.', DUYU_P), ders: 'Kartları çevir, organı göreviyle eşleştir!', visual: img('puzzle') },
      { kind: 'duyu-istasyonlari', title: 'Duyu İstasyonları', icon: 'ear', total: 4, meb: 'FB.3.2.2', gen: srt('Bu malzeme hangi duyu istasyonunda?', 'Zil kulakla, tarçın burunla, sünger deriyle tanınır.', ISTASYON_BINS, ISTASYON_ITEMS), ders: 'Duyu istasyonlarında zarar vermeyen malzemeler kullanılır. Tanımadığımız şeyi tatmaz, koklamayız.', visual: img('ear') },
      { kind: 'kelebek-modeli', title: 'Kelebeğin Duyuları', icon: 'butterfly', total: 3, meb: 'FB.3.2.2', gen: KELEBEK_MODEL, ders: 'Kelebek antenleriyle koku alır, bacaklarındaki algılayıcılarla tat alır, bal özünü hortumuyla emer.', visual: img('butterfly') },
      { kind: 'hayvan-duyulari', title: 'Hayvan Süper Duyuları', icon: 'dolphin', total: 4, meb: 'FB.3.2.2', gen: mt('Canlıyı algılama biçimiyle eşleştir.', 'Canlılarda duyuların çeşidi ve yeteneği farklıdır.', HAYVAN_DUYU_P), ders: 'Yunus alt çenesiyle işitir, örümcek bacak tüyleriyle hisseder, küstüm otu dokununca yaprak kapatır.', visual: img('dolphin') },
      { kind: 'saglikli-duyular', title: 'Sağlıklı Duyular', icon: 'shield', total: 4, meb: 'FB.3.2.2', gen: srt('Bu davranış duyularımızı korur mu, zarar mı verir?', 'Diş fırçalamak korur; çok yüksek sesle müzik dinlemek zarar verir.', SAGLIK_BINS, SAGLIK_ITEMS), ders: 'Duyu organlarımızın sağlığını koruruz. Hastalanınca doktora gideriz.', visual: img('shield') },
      { kind: 'duyular-birlikte', title: 'Duyular Birlikte', icon: 'nose', total: T, meb: 'FB.3.2.2', gen: rot(ch(DUYU_Q), tf(DUYU_TF, 'nose')), ders: 'Duyu organları birbirini etkiler ve bizi tehlikelerden korur. Burnumuz kapalıyken tat zor anlaşılır.', visual: img('nose') },
      { kind: 'dongu-sirala', title: 'Döngü Çemberi', icon: 'egg', total: 3, meb: 'FB.3.2.3', gen: ord(DONGU_O), ders: 'Her canlı doğar, büyür, çoğalır ve ölür. Yeni canlılarla döngü yeniden başlar.', visual: img('egg') },
      { kind: 'yumurta-tohum', title: 'Yumurta, Tohum, Doğum', icon: 'chick', total: 4, meb: 'FB.3.2.3', gen: srt('Bu canlı nasıl çoğalır?', 'Güvercin yumurtadan, marul tohumdan çıkar; inek yavrusunu doğurur.', DOGUM_BINS, DOGUM_ITEMS), ders: 'Yeni canlılar yumurtadan, tohumdan ya da doğumla meydana gelir.', visual: img('chick') },
      { kind: 'kim-ne-kadar', title: 'Kim Ne Kadar Yaşar?', icon: 'hourglass', total: 5, meb: 'FB.3.2.3', gen: ch(OMUR_Q), ders: 'Canlıların ömrü farklıdır: marul bir yıl bile yaşamaz, kaplumbağa çok uzun yaşar, zeytin ağacı yüzlerce yıl yaşayabilir.', visual: img('hourglass') },
      { kind: 'oyun-koy-defteri', title: 'Köy Gözlem Defteri', icon: 'tractor', total: OYUN, meb: 'FB.3.2.1', oyun: true, gen: karma(mt('Gözlemi canlılık özelliğiyle eşleştir.', 'Canlılık özellikleri.', OZELLIK_P), DUYU_MODEL, ch(CANLI_Q), ord(DONGU_O), srt('Nasıl çoğalır?', 'Yumurta, tohum, doğum.', DOGUM_BINS, DOGUM_ITEMS), KELEBEK_MODEL), ders: 'Fındık köyde geziyor! Her durakta bir gözlem: özelliği bul, modeli kur, döngüyü diz.', visual: img('tractor') },
      { kind: 'oyun-algi-yarismasi', title: 'Algı Yarışması', icon: 'trophy', total: 4, meb: 'FB.3.2.2', oyun: true, gen: rot(mem('Hayvan duyu kartlarını eşleştir!', 'Hayvanlar nasıl algılar?', HAYVAN_DUYU_P), srt('Hangi istasyon?', 'Duyu istasyonları.', ISTASYON_BINS, ISTASYON_ITEMS), ch(DUYU_Q)), ders: 'Beş istasyonu dolaş, süper duyuları keşfet!', visual: img('trophy') },
    ],
  },
  {
    id: 'u3',
    no: 3,
    title: 'Yer Bilimciler İş Başında',
    color: '#c2884a',
    dark: '#8d5a26',
    icon: 'rock',
    acts: [
      { kind: 'kayac-maden-mineral', title: 'Kayaç, Maden, Mineral', icon: 'rock', total: 4, meb: 'FB.3.3.1', gen: srt('Bu cümle kayacı mı, madeni mi, minerali mi anlatıyor?', 'Kayaçlar yer kabuğunu oluşturur, madenler değerlidir, mineraller renk verir.', KMM_BINS, KMM_ITEMS), ders: 'Yer kabuğu kayaçlardan oluşur. Ekonomik değeri olan kayaçlar madendir. Mineraller kayaca renk, parlaklık ve dayanıklılık verir.', points: ['Kayaç: yer kabuğu', 'Maden: değerli kayaç', 'Mineral: renk ve parlaklık'], visual: img('rock') },
      { kind: 'maden-mi', title: 'Maden mi?', icon: 'coin', total: 4, meb: 'FB.3.3.1', gen: pop('Madenleri bul ve patlat!', 'Kömür, mermer, bor, altın, gümüş ve bakır birer madendir.', MADEN_HIT, MADEN_WRONG, MADEN_IMG), ders: 'Madenler ekonomik değeri olan kayaçlardır. Toprak örneğinin maddi değeri yoktur.', visual: img('coin') },
      { kind: 'madenden-urune', title: 'Madenden Ürüne', icon: 'factory', total: 4, meb: 'FB.3.3.1', gen: mt('Madeni kullanıldığı yerle eşleştir.', 'Madenler birçok eşyada kullanılır.', MADEN_P), ders: 'Mermer tezgâhta, bakır tencerede, altın mücevherde, kömür ısınmada kullanılır.', visual: img('factory') },
      { kind: 'madenin-yolculugu', title: 'Madenin Yolculuğu', icon: 'construction', total: 3, meb: 'FB.3.3.1', gen: ord(MADEN_O), ders: 'Madenin yeri bulunur, plan yapılır, maden çıkarılır, fabrikada işlenir ve kullanıma hazır olur.', visual: img('construction') },
      { kind: 'bil-bakalim', title: 'Bil Bakalım Ben Neyim?', icon: 'gem', total: T, meb: 'FB.3.3.1', gen: ch(KAYAC_Q), ders: 'Elmas bilinen en sert maddedir. Mermer, taş kömürü, bor ve bakır ülkemizin önemli madenleridir.', visual: img('gem') },
      { kind: 'yer-bilimci', title: 'Yer Bilimci Doğru mu?', icon: 'mountain', total: T, meb: 'FB.3.3.1', gen: tf(KAYAC_TF, 'mountain'), ders: 'Yer bilimciler yer kabuğundaki kayaçları büyüteçle inceler ve yeni madenler keşfeder.', visual: img('mountain') },
      { kind: 'maden-hafiza', title: 'Maden Hafızası', icon: 'puzzle', total: 3, meb: 'FB.3.3.1', gen: mem('Maden kartlarını eşleştir!', 'Maden ve kullanım alanı.', MADEN_P), ders: 'Kartları çevir, madeni ürünüyle eşleştir!', visual: img('puzzle') },
      { kind: 'fosil-modeli', title: 'Kazı Alanı', icon: 'bone', total: 3, meb: 'FB.3.3.2', gen: FOSIL_MODEL, ders: 'Fosil bilimci (paleontolog) toprak katmanlarını dikkatle kazar ve fosilleri inceler.', visual: img('bone') },
      { kind: 'fosil-oykusu', title: 'Fosilin Hikâyesi', icon: 'fallenleaf', total: 3, meb: 'FB.3.3.2', gen: ord(FOSIL_O), ders: 'Çiçek toprağa düşer, üstü çamurla örtülür, toprak katılaşır ve izi kalır. Çok uzun zaman sonra fosil bulunur.', visual: img('fallenleaf') },
      { kind: 'fosil-nedir', title: 'Fosil Nedir?', icon: 'dino', total: T, meb: 'FB.3.3.2', gen: rot(ch(FOSIL_Q), tf(FOSIL_TF, 'bone')), ders: 'Fosil, çok eski canlıların kayaç, buzul ya da reçine içinde kalan izidir. Her canlı fosilleşmez.', points: ['Eski canlının izi', 'Çok uzun sürede oluşur', 'Her canlı fosil olmaz'], visual: img('dino') },
      { kind: 'kim-ne-inceler', title: 'Kim Ne İnceler?', icon: 'link', total: 4, meb: 'FB.3.3.2', gen: mt('Kavramı anlamıyla eşleştir.', 'Yer bilimi ve fosil bilimi kavramları.', KIM_P), ders: 'Yer bilimci kayaçları, fosil bilimci fosilleri inceler. Fosil bilimine paleontoloji denir.', visual: img('link') },
      { kind: 'oyun-findigin-kazisi', title: 'Fındık’ın Kazısı', icon: 'bone', total: OYUN, meb: 'FB.3.3.2', oyun: true, gen: karma(FOSIL_MODEL, ch(FOSIL_Q), srt('Hangi rafa?', 'Kayaç, maden, mineral.', KMM_BINS, KMM_ITEMS), ord(FOSIL_O), ch(KAYAC_Q)), ders: 'Fındık kazıda! Toprağı fırçala, buluntuyu rafına koy, fosilin hikâyesini sırala.', visual: img('bone') },
      { kind: 'oyun-hazine-avi', title: 'Hazine Avı', icon: 'gem', total: 4, meb: 'FB.3.3.1', oyun: true, gen: rot(pop('Madenleri patlat!', 'Değerli kayaçlar.', MADEN_HIT, MADEN_WRONG, MADEN_IMG), mem('Kavram kartlarını eşleştir!', 'Yer bilimi kavramları.', KIM_P), ord(MADEN_O)), ders: 'Hazineleri bul, kartları eşleştir!', visual: img('gem') },
    ],
  },
  {
    id: 'u4',
    no: 4,
    title: 'Maddeyi Tanıyalım, Karıştırıp Ayıralım',
    color: '#7c6cf2',
    dark: '#5143c4',
    icon: 'testtube',
    acts: [
      { kind: 'kati-sivi-gaz', title: 'Katı, Sıvı, Gaz', icon: 'droplet', total: 4, meb: 'FB.3.4.1', gen: srt('Bu madde hangi hâlde?', 'Katının şekli var, sıvı kabın şeklini alır, gaz ortama yayılır.', HAL_BINS, HAL_ITEMS), ders: 'Maddeler katı, sıvı ve gaz hâlinde bulunur. Katının belirli bir şekli vardır; sıvı kabın şeklini alır; gaz bulunduğu yere yayılır.', points: ['Katı: şekli var', 'Sıvı: kabın şeklini alır', 'Gaz: her yere yayılır'], visual: img('droplet') },
      { kind: 'kap-modeli', title: 'Kap Modeli', icon: 'jar', total: 3, meb: 'FB.3.4.1', gen: rot(KAP_MODEL, KAP_MODEL2), ders: 'Taş kabın içinde şeklini korur, su kabın şeklini alır, hava kapalı kabın her yerini doldurur.', visual: img('jar') },
      { kind: 'esnek-mi', title: 'Nitelik Dedektifi', icon: 'sponge', total: 4, meb: 'FB.3.4.1', gen: pop('Esnek olanları patlat!', 'Esnek maddeler çekilince ya da ezilince şekil değiştirir, bırakınca eski hâline döner.', ESNEK_HIT, ESNEK_WRONG, ESNEK_IMG), ders: 'Nitelik, maddenin gözlenebilen özelliğidir: sert, yumuşak, kırılgan, esnek, pürüzlü gibi.', visual: img('sponge') },
      { kind: 'puruzlu-mu', title: 'Pürüzlü mü?', icon: 'hand', total: 4, meb: 'FB.3.4.1', gen: srt('Bu madde pürüzlü mü, az pürüzlü mü?', 'Zımpara ve halı pürüzlü; defter kapağı az pürüzlüdür.', PURUZ_BINS, PURUZ_ITEMS), ders: 'Dokununca pütürlü gelen maddeler pürüzlüdür. Az pürüzlü maddeler rahatsız etmez ama tam düz değildir.', visual: img('hand') },
      { kind: 'hal-sorulari', title: 'Bana Bir Madde Söyle', icon: 'testtube', total: T, meb: 'FB.3.4.1', gen: rot(ch(HAL_Q), tf(HAL_TF, 'testtube')), ders: 'Tanımadığımız maddeye dokunmaz, asla tatmayız; önce öğretmenimize sorarız. İşimiz bitince ellerimizi yıkarız.', points: ['Dokunma, tatma', 'Önce öğretmene sor', 'Ellerini yıka'], visual: img('testtube') },
      { kind: 'saf-karisim', title: 'Saf mı, Karışım mı?', icon: 'salad', total: 4, meb: 'FB.3.4.2', gen: srt('Bu bir saf madde mi, karışım mı?', 'Tuz ve şeker saf maddedir; salata ve deniz suyu karışımdır.', SAF_BINS, SAF_ITEMS), ders: 'Saf maddenin içinde başka madde yoktur. Karışım en az iki maddeden oluşur ve maddeler özelliklerini kaybetmez.', visual: img('salad') },
      { kind: 'yontem-hafizasi', title: 'Yöntem Hafızası', icon: 'magnet', total: 3, meb: 'FB.3.4.2', gen: mem('Ayırma yöntemini aracıyla eşleştir!', 'Her yöntemin bir aracı var.', AYIR_P), ders: 'Eleme elekle, süzme süzgeçle, mıknatısla ayırma mıknatısla yapılır. Yüzdürmede su, dinlendirmede bekleme kullanılır.', visual: img('magnet') },
      { kind: 'nasil-ayiralim', title: 'Nasıl Ayıralım?', icon: 'bowl', total: 4, meb: 'FB.3.4.2', gen: mt('Karışımı ayırma yöntemiyle eşleştir.', 'Her karışım için uygun bir yöntem var.', KARISIM_P), ders: 'Demir tozunu mıknatıs çeker, talaş suda yüzer, kum suyun dibine çöker, makarna süzgeçte kalır.', visual: img('bowl') },
      { kind: 'ayirma-laboratuvari', title: 'Ayırma Laboratuvarı', icon: 'lab', total: T, meb: 'FB.3.4.2', gen: ch(AYIR_Q), ders: 'Karışımı nasıl ayıracağımızı tahmin etmek hipotezdir. Sonuç uymazsa vazgeçmeyiz, hipotezi yenileyip tekrar deneriz.', visual: img('lab') },
      { kind: 'deney-tasarla', title: 'Deney Tasarla', icon: 'memo', total: 3, meb: 'FB.3.4.2', gen: ord(DENEY_O), ders: 'Deneyi öğretmenimizle yaparız. Hiçbir maddeyi koklamaz, tatmaz; gözümüzü ovuşturmayız.', visual: img('memo') },
      { kind: 'hangi-kutu', title: 'Hangi Kutu?', icon: 'recycle', total: 4, meb: 'FB.3.4.3', gen: rot(srt('Bu atık hangi kutuya gider?', 'Cam, kâğıt ve plastik ayrı kutulara atılır.', ATIK_BINS, ATIK_ITEMS), srt('Bu atık hangi kutuya gider?', 'Metal, atık pil ve kâğıt ayrı kutulara atılır.', ATIK2_BINS, ATIK2_ITEMS)), ders: 'Geri dönüşüm kutuları: cam, kâğıt, plastik, metal ve atık pil. Kırık cama dokunmayız, bir büyüğümüz toplar.', visual: img('recycle') },
      { kind: 'ne-kadar-surer', title: 'Ne Kadar Sürer?', icon: 'hourglass', total: 3, meb: 'FB.3.4.3', gen: ord(ATIK_O), ders: 'Kâğıt birkaç ayda, muz kabuğu bir yılda, sakız birkaç yılda yok olur. Pet şişe ise yüzlerce yıl doğada kalır.', visual: img('hourglass') },
      { kind: 'geri-donusum-faydasi', title: 'Faydaları Bul', icon: 'balloon', total: 4, meb: 'FB.3.4.3', gen: pop('Geri dönüşümün faydalarını patlat!', 'Daha az ağaç kesilir, enerji ve su korunur, doğa temiz kalır.', FAYDA_HIT, FAYDA_WRONG), ders: 'Geri dönüşüm doğal kaynakları korur, atığı azaltır, aile ve ülke ekonomisine katkı sağlar.', visual: img('recycle') },
      { kind: 'tesis-bandi', title: 'Geri Dönüşüm Tesisi', icon: 'factory', total: 4, meb: 'FB.3.4.3', gen: mt('Atığı ayırma yöntemiyle eşleştir.', 'Tesislerde karışım ayırma yöntemleri kullanılır.', TESIS_P), ders: 'Tesislerde demirli atıklar mıknatısla, büyük parçalar elekle, atık su süzgeçle ayrılır.', visual: img('factory') },
      { kind: 'atik-bilgisi', title: 'Atık Bilgisi', icon: 'wastebasket', total: T, meb: 'FB.3.4.3', gen: rot(ch(ATIK_Q), tf(ATIK_TF, 'recycle')), ders: 'Her atık çöp değildir. Boş şişe saksı, karton kutu oyuncak kutusu olabilir. Bu sürdürülebilirliktir.', visual: img('wastebasket') },
      { kind: 'oyun-karisik-mutfak', title: 'Karışık Mutfak', icon: 'lab', total: OYUN, meb: 'FB.3.4.2', oyun: true, gen: karma(KAP_MODEL, ch(AYIR_Q), mt('Karışımı yöntemiyle eşleştir.', 'Ayırma yöntemleri.', KARISIM_P), srt('Katı, sıvı, gaz?', 'Maddenin hâlleri.', HAL_BINS, HAL_ITEMS), ord(DENEY_O), ch(HAL_Q)), ders: 'Fındık’ın mutfağı karıştı! Hâlleri bul, karışımları doğru araçla ayır.', visual: img('lab') },
      { kind: 'oyun-temiz-park', title: 'Temiz Park Görevi', icon: 'recycle', total: 4, meb: 'FB.3.4.3', oyun: true, gen: rot(srt('Hangi kutu?', 'Atıkları ayır.', ATIK_BINS, ATIK_ITEMS), pop('Faydaları patlat!', 'Geri dönüşümün faydaları.', FAYDA_HIT, FAYDA_WRONG), mem('Tesis kartlarını eşleştir!', 'Atık ve yöntem.', TESIS_P)), ders: 'Parktaki atıkları doğru kutulara at, park yeniden yeşersin!', visual: img('recycle') },
    ],
  },
  {
    id: 'u5',
    no: 5,
    title: 'Hareketi Keşfediyorum',
    color: '#ff8a3d',
    dark: '#d0601a',
    icon: 'running',
    acts: [
      { kind: 'bes-hareket', title: 'Beş Hareket', icon: 'puzzle', total: 3, meb: 'FB.3.5.1', gen: mem('Hareket kartlarını eşleştir!', 'Beş hareket durumu.', HAREKET_MEM), ders: 'Beş hareket durumu vardır: hızlanma, yavaşlama, dönme, sallanma ve yön değiştirme.', points: ['Hızlanma, yavaşlama', 'Dönme, sallanma', 'Yön değiştirme'], visual: img('running') },
      { kind: 'trafik-lambasi', title: 'Hareketi Eşleştir', icon: 'trafficlight', total: 4, meb: 'FB.3.5.1', gen: mt('Örneği hareket durumuyla eşleştir.', 'Her örnekte bir hareket durumu var.', HAREKET_P), ders: 'Rüzgârda bayrak sallanır, yeşil ışıkta araç hızlanır, kırmızı ışıkta yavaşlar, anahtar döner.', visual: img('trafficlight') },
      { kind: 'hangi-hareket', title: 'Hangi Hareket?', icon: 'running', total: T, meb: 'FB.3.5.1', gen: ch(HAREKET_Q), ders: 'Hareket, bir varlığın yerini, konumunu ya da durumunu değiştirmesidir. Canlılar kendiliğinden, cansızlar bir etkiyle hareket eder.', visual: img('running') },
      { kind: 'iyi-mi-riskli-mi', title: 'Olumlu mu, Olumsuz mu?', icon: 'balance', total: 4, meb: 'FB.3.5.1', gen: srt('Bu hareketin sonucu olumlu mu, olumsuz mu?', 'Türbinin dönmesi elektrik üretir; koridorda koşmak çarpışmaya yol açar.', SONUC_BINS, SONUC_ITEMS), ders: 'Hareketlerin olumlu ve olumsuz sonuçları olabilir. Kurallara uyar, dikkatli oluruz.', visual: img('balance') },
      { kind: 'parkta-hareket', title: 'Parkta Hareket', icon: 'kite', total: 3, meb: 'FB.3.5.1', gen: ord(PARK_O), ders: 'Bir hikâyede beş hareket durumunu da bulabiliriz.', visual: img('kite') },
      { kind: 'hareket-dogru-mu', title: 'Hareket Doğru mu?', icon: 'checkered', total: T, meb: 'FB.3.5.1', gen: tf(HAREKET_TF, 'running'), ders: 'Hareket eden araçlardan, dönen aletlerden uzak dururuz. Salıncağın önünden geçmeyiz.', visual: img('running') },
      { kind: 'it-cek', title: 'İt mi, Çek mi?', icon: 'hand', total: 4, meb: 'FB.3.5.2', gen: srt('Bu bir itme mi, çekme mi, ikisi birden mi?', 'Topa vurmak itme, meyve koparmak çekme, saç taramak ikisi birdendir.', ITCEK_BINS, ITCEK_ITEMS), ders: 'Kuvvet; bir cismi hareket ettirmek, durdurmak, yönünü ya da şeklini değiştirmek için uygulanan etkidir. İtme ve çekme birer kuvvettir.', visual: img('hand') },
      { kind: 'kuvvet-oklari', title: 'Kuvvet Okları', icon: 'magnet', total: 3, meb: 'FB.3.5.2', gen: KUVVET_MODEL, ders: 'Cismi kendimizden uzaklaştırırsak itme, kendimize yaklaştırırsak çekme kuvveti uygularız.', visual: img('magnet') },
      { kind: 'ne-olacak', title: 'Ne Olacak?', icon: 'thinking', total: T, meb: 'FB.3.5.2', gen: ch(KUVVET_Q), ders: 'Önce tahmin ederiz, sonra gözleriz. Kuvvet hareketi başlatır, durdurur, yönü ve şekli değiştirir.', visual: img('thinking') },
      { kind: 'kuvvet-etkisi', title: 'Kuvvetin Etkileri', icon: 'balloon', total: 4, meb: 'FB.3.5.2', gen: pop('Kuvvetin etkilerini patlat!', 'Kuvvet hareket ettirir, durdurur, yavaşlatır, yönü ve şekli değiştirir.', KUVVET_HIT, KUVVET_WRONG), ders: 'Kuvvet, cismin hareketini ve şeklini değiştirebilir.', visual: img('balloon') },
      { kind: 'balonun-degisimi', title: 'Balonun Değişimi', icon: 'balloon', total: 3, meb: 'FB.3.5.2', gen: ord(BALON_O), ders: 'Balonu şişirince büyür, bastırınca şekli değişir. Bunu kuvvet yapar.', visual: img('balloon') },
      { kind: 'kuvvet-dogru-mu', title: 'Kuvvet Doğru mu?', icon: 'biceps', total: T, meb: 'FB.3.5.2', gen: tf(KUVVET_TF, 'biceps'), ders: 'Hareket ve spor kaslarımızı güçlendirir, kendimizi iyi hissettirir.', visual: img('biceps') },
      { kind: 'oyun-istop-sahasi', title: 'İstop Sahası', icon: 'ball', total: OYUN, meb: 'FB.3.5.1', oyun: true, gen: karma(ch(HAREKET_Q), KUVVET_MODEL, mt('Örneği hareketle eşleştir.', 'Hareket durumları.', HAREKET_P), srt('İt mi, çek mi?', 'İtme ve çekme.', ITCEK_BINS, ITCEK_ITEMS), ch(KUVVET_Q)), ders: 'Fındık “İstop!” dedi, herkes dondu! Her oyuncunun hareketini ve kuvvetini bul.', visual: img('ball') },
      { kind: 'oyun-hareket-dedektifi', title: 'Hareket Dedektifi', icon: 'detective', total: 4, meb: 'FB.3.5.2', oyun: true, gen: rot(pop('Kuvvetin etkilerini patlat!', 'Kuvvet ne yapar?', KUVVET_HIT, KUVVET_WRONG), mem('Hareket kartlarını eşleştir!', 'Beş hareket.', HAREKET_MEM), srt('Olumlu mu, olumsuz mu?', 'Hareketin sonuçları.', SONUC_BINS, SONUC_ITEMS)), ders: 'Şehirdeki hareketleri bul, posterini hazırla!', visual: img('detective') },
    ],
  },
  {
    id: 'u6',
    no: 6,
    title: 'Yaşamımızı Kolaylaştıran Elektrik',
    color: '#f5b82e',
    dark: '#c48a0a',
    icon: 'bulb',
    acts: [
      { kind: 'fis-pil', title: 'Fiş mi, Pil mi?', icon: 'plug', total: 4, meb: 'FB.3.6.1', gen: srt('Bu araç enerjisini nereden alır?', 'Buzdolabı şehir elektriğiyle, kumanda pille çalışır; makas elektriksizdir.', ENERJI_BINS, ENERJI_ITEMS), ders: 'Bir aracın elektrikli olup olmadığını enerjisini nereden aldığına bakarak anlarız: şehir elektriği, pil ya da insan gücü.', points: ['Fişi var: şehir elektriği', 'Pili var: taşınabilir', 'İnsan gücüyle: elektriksiz'], visual: img('plug') },
      { kind: 'ne-ise-yarar', title: 'Ne İşe Yarar?', icon: 'bulb', total: 4, meb: 'FB.3.6.1', gen: srt('Bu elektrikli araç ne için kullanılır?', 'Lamba aydınlatır, soba ısıtır, telefon iletişim sağlar.', AMAC_BINS, AMAC_ITEMS), ders: 'Elektrikli araçları aydınlatma, ısınma, iletişim ve ev işleri için kullanırız.', visual: img('bulb') },
      { kind: 'elektrikli-mi', title: 'Elektrikli mi?', icon: 'zap', total: T, meb: 'FB.3.6.1', gen: ch(ELEK_Q), ders: 'Pil, araçlara taşınabilir enerji verir. Suyu piknik tüpünde ısıtmak elektriksiz, su ısıtıcısında ısıtmak elektriklidir.', visual: img('zap') },
      { kind: 'kesinti-aksami', title: 'Kesinti Akşamı', icon: 'candle', total: 4, meb: 'FB.3.6.1', gen: pop('Elektrik kesildi! Hangileri çalışmaz? Patlat!', 'Şehir elektriğiyle çalışanlar kesintide çalışmaz; pilliler çalışır.', KESINTI_HIT, KESINTI_WRONG, KESINTI_IMG), ders: 'Elektrik kesilince şehir elektriğiyle çalışan araçlar durur; pilli el feneri ise çalışmaya devam eder.', visual: img('candle') },
      { kind: 'guvenli-mi', title: 'Güvenli mi?', icon: 'shield', total: 4, meb: 'FB.3.6.2', gen: srt('Bu davranış güvenli mi, tehlikeli mi?', 'Kılavuzu okumak güvenli; prize ıslak elle dokunmak tehlikelidir.', GUVEN_BINS, GUVEN_ITEMS), ders: 'Elektrikli araçları bir büyüğümüzün yardımıyla kullanırız. Priz ve kablolara dokunmayız.', points: ['Dokunma', 'Uzaklaş', 'Büyüğüne haber ver'], visual: img('shield') },
      { kind: 'ne-yapmali', title: 'Ne Yapmalı?', icon: 'raisedhand', total: T, meb: 'FB.3.6.2', gen: ch(GUVEN_Q), ders: 'Su ve elektrik bir araya gelirse hiçbir şeye dokunmadan büyüğümüze haber veririz. Sarkan telden uzaklaşırız.', visual: img('raisedhand') },
      { kind: 'guvenlik-dogru-mu', title: 'Güvenlik Doğru mu?', icon: 'checkered', total: T, meb: 'FB.3.6.2', gen: tf(GUVEN_TF, 'shield'), ders: 'Güvenli kullanım elektrik çarpmasını, yangını ve arızayı önler.', visual: img('shield') },
      { kind: 'tasarruf-avcisi', title: 'Tasarruf Avcısı', icon: 'balloon', total: 4, meb: 'FB.3.6.3', gen: pop('Tasarruflu davranışları patlat!', 'Işığı söndürmek, makineyi dolu çalıştırmak tasarruftur.', TASARRUF_HIT, TASARRUF_WRONG), ders: 'Elektrik sınırlı bir kaynaktır. Tasarruf ederek doğayı korur, aile bütçesine katkı sağlarız.', visual: img('bulb') },
      { kind: 'tasarruf-israf', title: 'Tasarruf mu, İsraf mı?', icon: 'balance', total: 4, meb: 'FB.3.6.3', gen: srt('Bu davranış tasarruf mu, israf mı?', 'Nemliyken ütülemek tasarruf; televizyon açık uyumak israftır.', TASARRUF_BINS, TASARRUF_ITEMS), ders: 'Gereksiz yanan ışıkları söndürür, buzdolabının kapağını açık bırakmayız.', visual: img('balance') },
      { kind: 'tasarruf-cozum', title: 'Sorun ve Çözüm', icon: 'link', total: 4, meb: 'FB.3.6.3', gen: mt('Durumu tasarruflu çözümüyle eşleştir.', 'Her israfın bir çözümü var.', TASARRUF_P), ders: 'Küçük davranışlarla büyük tasarruf yapabiliriz.', visual: img('link') },
      { kind: 'fatura-modeli', title: 'Fatura Dedektifi', icon: 'chart', total: 5, meb: 'FB.3.6.3', gen: ch(FATURA_Q), ders: 'Tasarruf planı uygulayan ailenin faturası azalır. Eski ve yeni faturayı karşılaştırırız.', visual: img('chart') },
      { kind: 'tasarruf-plani', title: 'Tasarruf Planım', icon: 'calendar', total: 3, meb: 'FB.3.6.3', gen: ord(PLAN_O), ders: 'Faturayı incele, liste hazırla, bir ay uygula ve karşılaştır.', visual: img('calendar') },
      { kind: 'oyun-enerji-dedektifi', title: 'Enerji Dedektifi', icon: 'detective', total: OYUN, meb: 'FB.3.6.3', oyun: true, gen: karma(ch(GUVEN_Q), srt('Fiş mi, pil mi?', 'Enerji kaynağı.', ENERJI_BINS, ENERJI_ITEMS), pop('Tasarruflu davranışları patlat!', 'Tasarruf.', TASARRUF_HIT, TASARRUF_WRONG), ch(FATURA_Q), tf(GUVEN_TF)), ders: 'Fındık’ın evinde gece! Gereksiz ışıkları söndür, tehlikeyi gör ve büyüğünü çağır.', visual: img('detective') },
      { kind: 'oyun-mavi-yesil-okul', title: 'Mavi Yeşil Okul', icon: 'school', total: 4, meb: 'FB.3.6.2', oyun: true, gen: rot(srt('Güvenli mi, tehlikeli mi?', 'Elektrik güvenliği.', GUVEN_BINS, GUVEN_ITEMS), mem('Tasarruf kartlarını eşleştir!', 'Sorun ve çözüm.', TASARRUF_P), srt('Ne işe yarar?', 'Elektrikli araçların amacı.', AMAC_BINS, AMAC_ITEMS)), ders: 'Okulun her odasında görevi tamamla, enerji dostu etiketi kazan!', visual: img('school') },
    ],
  },
  {
    id: 'u7',
    no: 7,
    title: 'Toprağı Tanıyorum, Tarımı Keşfediyorum',
    color: '#8bc34a',
    dark: '#5a8a1c',
    icon: 'seedling',
    acts: [
      { kind: 'toprak-nasil-olusur', title: 'Toprak Nasıl Oluşur?', icon: 'mountain', total: 3, meb: 'FB.3.7.1', gen: ord(TOPRAK_O), ders: 'Kayaçlar yağmur, rüzgâr ve sıcaklık değişimiyle aşınıp ufalanır. Araya hava, su ve canlı kalıntıları karışır; toprak oluşur.', points: ['Kayaçlar ufalanır', 'Hava ve su karışır', 'Binlerce yıl sürer'], visual: img('mountain') },
      { kind: 'toprak-kavanozu', title: 'Toprak Kavanozu', icon: 'jar', total: 3, meb: 'FB.3.7.1', gen: TOPRAK_MODEL, ders: 'Toprak bir karışımdır: kum, kil, küçük taşlar, hava, su, canlı kalıntıları ve solucanlar.', visual: img('jar') },
      { kind: 'toprakta-ne-var', title: 'Toprakta Ne Var?', icon: 'worm', total: 4, meb: 'FB.3.7.1', gen: pop('Toprakta doğal olarak bulunanları patlat!', 'Toprakta kum, kil, taş, su, hava, kök ve solucan bulunur.', TOPRAK_HIT, TOPRAK_WRONG, TOPRAK_IMG), ders: 'Plastik, pil ve cam kırığı toprağa ait değildir; toprağı kirletir.', visual: img('worm') },
      { kind: 'kim-ne-yapar', title: 'Kim Ne Yapar?', icon: 'link', total: 4, meb: 'FB.3.7.1', gen: mt('Topraktakini göreviyle eşleştir.', 'Topraktaki her şeyin bir görevi var.', TOPRAK_P), ders: 'Solucan toprağı havalandırır, canlı kalıntıları verimli yapar, su bitkiyi büyütür.', visual: img('link') },
      { kind: 'toprak-labirenti', title: 'Toprak Labirenti', icon: 'checkered', total: T, meb: 'FB.3.7.1', gen: tf(TOPRAK_TF, 'plantpot'), ders: 'Toprağın rengi, sertliği ve suyu tutması her yerde aynı değildir.', visual: img('plantpot') },
      { kind: 'toprak-dedektifi', title: 'Toprak Dedektifi', icon: 'magnifier', total: 5, meb: 'FB.3.7.1', gen: ch(TOPRAK_Q), ders: 'Toprağı eldivenle ve bir büyüğümüzle inceleriz. İşimiz bitince ellerimizi yıkarız.', visual: img('gloves') },
      { kind: 'saksi-modeli', title: 'Saksı Modeli', icon: 'plantpot', total: 3, meb: 'FB.3.7.2', gen: SAKSI_MODEL, ders: 'Bitki büyümek için ışık, su ve uygun sıcaklığa ihtiyaç duyar.', points: ['Işık', 'Su', 'Uygun sıcaklık'], visual: img('plantpot') },
      { kind: 'bitkinin-ihtiyaclari', title: 'Bitkinin İhtiyaçları', icon: 'sun', total: 4, meb: 'FB.3.7.2', gen: pop('Bitkinin büyümesine yardım edenleri patlat!', 'Su, ışık, uygun sıcaklık ve doğal gübre bitkiye iyi gelir.', IHTIYAC_HIT, IHTIYAC_WRONG, IHTIYAC_IMG), ders: 'Su, besin maddelerini bitkiye taşır. Bitki besin yapmak için Güneş’ten enerji alır.', visual: img('sun') },
      { kind: 'hepsinde-mi', title: 'Hepsinde mi?', icon: 'puzzle', total: 4, meb: 'FB.3.7.2', gen: srt('Bu her bitkide ortak mı, bitkiye göre mi değişir?', 'Işık ve su her bitkiye gerekir; mevsim bitkiden bitkiye değişir.', ORTAKB_BINS, ORTAKB_ITEMS), ders: 'Her bitkinin ışık, su ve uygun sıcaklık ihtiyacı vardır. Mevsim ve ürün verme süresi ise farklıdır.', visual: img('puzzle') },
      { kind: 'tohum-ekme', title: 'Tohum Ekme Sırası', icon: 'seedling', total: 3, meb: 'FB.3.7.2', gen: ord(EKIM_O), ders: 'Tohum toprağa ekilir; uygun koşullarda önce filiz, sonra fide, sonra büyük bitki olur.', visual: img('seedling') },
      { kind: 'hangi-sebze', title: 'Bil Bakalım Hangi Ürün?', icon: 'carrot', total: 4, meb: 'FB.3.7.2', gen: mt('Bilmeceyi ürünle eşleştir.', 'Tarım ürünlerini tanıyalım.', BILMECE_P), ders: 'Domates, havuç, patates, üzüm ve elma soframıza tarımla gelir.', visual: img('carrot') },
      { kind: 'sulamali-miyim', title: 'Sulamalı mıyım?', icon: 'droplet', total: T, meb: 'FB.3.7.2', gen: rot(ch(BITKI_Q), tf(TARIM_TF, 'seedling')), ders: 'Toprak kuruysa sularız, çok ıslaksa bekleriz. Fazla su köklere zarar verir.', visual: img('droplet') },
      { kind: 'topragi-koru', title: 'Toprağı Koru', icon: 'shield', total: 4, meb: 'FB.3.7.2', gen: srt('Bu davranış toprağı korur mu, zarar mı verir?', 'Kompost ve doğal gübre korur; çöp ve beton zarar verir.', KORU_T_BINS, KORU_T_ITEMS), ders: 'Toprak yaşamın kaynağıdır. Kirletmez, betonla kaplamayız.', visual: img('shield') },
      { kind: 'oyun-turp-bahcesi', title: 'Fındık’ın Turp Bahçesi', icon: 'farmer', total: OYUN, meb: 'FB.3.7.2', oyun: true, gen: karma(SAKSI_MODEL, ch(BITKI_Q), ord(EKIM_O), TOPRAK_MODEL, pop('Bitkiye iyi gelenleri patlat!', 'Bitkinin ihtiyaçları.', IHTIYAC_HIT, IHTIYAC_WRONG, IHTIYAC_IMG), ch(TOPRAK_Q)), ders: 'Fındık turp ekiyor! Toprağı hazırla, tohumu ek, her gün toprağa bak ve doğru kararı ver.', visual: img('farmer') },
      { kind: 'oyun-cevre-dostu', title: 'Çevre Dostu El Kitabı', icon: 'openbook', total: 4, meb: 'FB.3.7.1', oyun: true, gen: rot(mem('Toprak kartlarını eşleştir!', 'Topraktakiler ve görevleri.', TOPRAK_P), srt('Korur mu, zarar mı?', 'Toprağı koruyalım.', KORU_T_BINS, KORU_T_ITEMS), pop('Toprakta olanları patlat!', 'Toprağın içindekiler.', TOPRAK_HIT, TOPRAK_WRONG, TOPRAK_IMG)), ders: 'El kitabının sayfalarını doldur, toprağı koru!', visual: img('openbook') },
    ],
  },
  {
    id: 'u8',
    no: 8,
    title: 'Canlıların Yaşam Alanlarına Yolculuk',
    color: '#29a3d6',
    dark: '#12729c',
    icon: 'evergreen',
    acts: [
      { kind: 'kim-nerede', title: 'Kim Nerede Yaşar?', icon: 'paw', total: 4, meb: 'FB.3.8.1', gen: rot(srt('Bu canlı hangi yaşam alanında yaşar?', 'Sincap ormanda, ahtapot denizde, deve çölde yaşar.', ALAN_BINS, ALAN_ITEMS), srt('Bu canlı hangi yaşam alanında yaşar?', 'Nilüfer gölde, ceylan ormanda, akrep çölde yaşar.', ALAN2_BINS, ALAN2_ITEMS)), ders: 'Yaşam alanı, canlının yaşadığı, yiyecek bulduğu ve kendini güvende hissettiği yerdir.', points: ['Orman, deniz', 'Göl, çöl', 'Taşın altı bile!'], visual: img('paw') },
      { kind: 'diorama', title: 'Dört Yaşam Alanı', icon: 'map', total: 3, meb: 'FB.3.8.1', gen: YASAM_MODEL, ders: 'Orman ağaçlık ve gölgeliktir. Deniz tuzlu ve derindir. Göl karayla çevrilidir. Çöl kumlu ve kuraktır.', visual: img('map') },
      { kind: 'alan-karti', title: 'Yaşam Alanı Kartı', icon: 'link', total: 4, meb: 'FB.3.8.1', gen: mt('Yaşam alanını özelliğiyle eşleştir.', 'Her yaşam alanının kendine özgü özellikleri var.', ALAN_P), ders: 'Her yaşam alanı, orada yaşayan canlıların ihtiyaçlarına uygundur.', visual: img('link') },
      { kind: 'colde-kim-var', title: 'Çölde Kim Var?', icon: 'cactus', total: 4, meb: 'FB.3.8.1', gen: pop('Çölde yaşayan canlıları patlat!', 'Deve, kertenkele, akrep, yılan ve kaktüs çölde yaşar.', COL_HIT, COL_WRONG, COL_IMG), ders: 'Çölde su çok azdır; gündüz çok sıcak, gece serindir. Akrep ve yılanı yalnızca uzaktan gözleriz.', visual: img('desert') },
      { kind: 'yasam-alani', title: 'Yaşam Alanı Soruları', icon: 'house', total: T, meb: 'FB.3.8.1', gen: ch(YASAM_Q), ders: 'Her canlı kendi özelliklerine uygun yerde yaşar. Doğa gezisini büyüklerimizle yapar, canlılara dokunmayız.', visual: img('house') },
      { kind: 'hangisi-cesitli', title: 'Hangisi Daha Çeşitli?', icon: 'sparkles', total: T, meb: 'FB.3.8.2', gen: ch(CESIT_Q), ders: 'Canlı çeşitliliği, bir yerde yaşayan farklı canlıların sayısıdır. Tek bir canlıdan çok olması çeşitlilik değildir.', points: ['Farklı canlıları say', 'Çok tavşan ≠ çeşitlilik', 'Millî parklar korur'], visual: img('sparkles') },
      { kind: 'uludag-gezisi', title: 'Uludağ Gezisi', icon: 'mountain', total: 4, meb: 'FB.3.8.2', gen: pop('Uludağ’da yaşayan canlıları patlat!', 'Kestane, kayın, sincap, tilki, kirpi, karaca ve bülbül Uludağ’da yaşar.', ULUDAG_HIT, ULUDAG_WRONG, ULUDAG_IMG), ders: 'Uludağ Millî Parkı’nda çok sayıda bitki, kuş ve hayvan yaşar; burada canlı çeşitliliği zengindir.', visual: img('mountain') },
      { kind: 'cesitlilik-dogru-mu', title: 'Çeşitlilik Doğru mu?', icon: 'checkered', total: T, meb: 'FB.3.8.2', gen: tf(CESIT_TF, 'magnifier'), ders: 'Gözlemde sabırlı oluruz; canlıları korkutmaz, bilmediğimiz bitki ve hayvana dokunmayız.', visual: img('magnifier') },
      { kind: 'koru-zarar', title: 'Zarar mı, Koruma mı?', icon: 'shield', total: 4, meb: 'FB.3.8.3', gen: srt('Bu davranış yaşam alanını korur mu, zarar mı verir?', 'Fidan dikmek korur; göle çöp atmak zarar verir.', KORU_BINS, KORU_ITEMS), ders: 'Ağaçları kontrolsüz kesmek, göl ve denize çöp atmak yaşam alanlarını tehdit eder.', visual: img('shield') },
      { kind: 'canlilar-ne-ister', title: 'Canlılar Ne İster?', icon: 'heart', total: 4, meb: 'FB.3.8.3', gen: pop('Canlıların yaşamak için ihtiyaçlarını patlat!', 'Temiz hava, temiz su, besin, barınak ve güvenli çevre.', IHT_HIT, IHT_WRONG, IHT_IMG), ders: 'Canlılar yaşamak için temiz hava, su, besin ve güvenli bir çevreye ihtiyaç duyar.', visual: img('heart') },
      { kind: 'agac-kesilince', title: 'Ağaç Kesilince', icon: 'wood', total: 3, meb: 'FB.3.8.3', gen: ord(ORMAN_O), ders: 'Ağaçlar kesilirse kuşlar, böcekler ve gölgede yaşayan bitkiler zarar görür. Fidan dikerek ormanı geri getirebiliriz.', visual: img('wood') },
      { kind: 'yasam-alanini-koru', title: 'Yaşam Alanını Koru', icon: 'evergreen', total: T, meb: 'FB.3.8.3', gen: rot(ch(KORU_Q), tf(KORU_TF, 'evergreen')), ders: 'Yaşam alanını korumak canlı çeşitliliğini korumaktır. Fidan diker, yangına karşı önlem alır, enerjiyi dikkatli kullanırız.', visual: img('evergreen') },
      { kind: 'oyun-doga-gezisi', title: 'Fındık’ın Doğa Gezisi', icon: 'camping', total: OYUN, meb: 'FB.3.8.1', oyun: true, gen: karma(YASAM_MODEL, srt('Kim nerede yaşar?', 'Yaşam alanları.', ALAN_BINS, ALAN_ITEMS), ch(YASAM_Q), ch(CESIT_Q), mt('Alanı özelliğiyle eşleştir.', 'Yaşam alanları.', ALAN_P)), ders: 'Fındık dört yaşam alanını geziyor! Kuralları uygula, canlıları say, alanları etiketle.', visual: img('camping') },
      { kind: 'oyun-ormani-yesert', title: 'Ormanı Yeniden Yeşert', icon: 'tree', total: 4, meb: 'FB.3.8.3', oyun: true, gen: rot(ord(ORMAN_O), srt('Korur mu, zarar mı?', 'Yaşam alanını koru.', KORU_BINS, KORU_ITEMS), pop('Canlıların ihtiyaçlarını patlat!', 'Temiz hava, su, besin, barınak.', IHT_HIT, IHT_WRONG, IHT_IMG)), ders: 'Fidan dik, sula, koru; kuşlar ve sincaplar geri gelsin!', visual: img('tree') },
    ],
  },
]
