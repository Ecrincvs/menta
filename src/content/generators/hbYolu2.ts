/**
 * HAYAT BİLGİSİ YOLU — 2. sınıf Hayat Bilgisi ders kitabının 6 öğrenme alanı, her alan bir "ada":
 * konu konu sıralı etkinlikler + sonda oyunlar. Kaynak: docs/meb-kitaplar/analiz/hayat-bilgisi-2.md
 * İçerik kitabın öğrettiği bilgilerin özgün özetidir (kitap metni kopyalanmadı).
 * Hassas konular (§5): çocuktan gerçek kişisel bilgi istenmez (ad, adres, okul, kimlik, kan grubu),
 * 112 dışında hiçbir acil numara geçmez (çeldiriciler ilgisiz sayılar), afetler korkutmadan ve önlem
 * odaklı anlatılır (çök-kapan-tutun yalnızca "AFAD önerisi" diye), ev görevlerinde cinsiyet kalıbı yok,
 * çevrim içi güvenlik çocuk diliyle ("Hayır de, çık, büyüğüne söyle"), yosun/karınca yuvası yön bulmada
 * güvenilir yöntem diye öğretilmez, yıl verilmez.
 */
import type { SortQ } from '../../games/quiz/types'
import { ch, img, karma, mem, mt, ord, pop, rot, srt, tf, type Alan, type O, type P, type Q, type TF } from './yolKit'
export type { Act, Alan } from './yolKit'

const FACE = { Mutlu: 'happy', Üzgün: 'sad', Heyecanlı: 'grin', Şaşkın: 'surprised', Kızgın: 'angry', Korkmuş: 'scared' }

/* ================================================================================================
 * 1. ÖĞRENME ALANI · BEN VE OKULUM
 * ================================================================================================ */
/* --- HB.2.1.1 Planlı Olmak --- */
const PLAN_Q: Q[] = [
  { q: 'Planlı olmak ne demektir?', a: 'İşleri önceden sıraya koymak', w: ['İşleri hep ertelemek', 'Hiç düşünmeden oynamak', 'Her şeyi aynı anda yapmak'], ex: 'Planlı olmak, yapacağımız işleri önceden belirleyip sıraya koymaktır.', img: 'calendar' },
  { q: 'Ahmet ödevini gece geç saatte yaptı. Sabah nasıl olur?', a: 'Yorgun ve uykulu', w: ['Dinlenmiş ve enerjik', 'Çok erken uyanmış', 'Hiç uykusu yok'], ex: 'Plan olmayınca iş geç biter, uyku azalır. Ahmet planla daha rahat eder.', img: 'sleepy' },
  { q: 'Fatma planına uydu ve erken yattı. Okula nasıl gitti?', a: 'Dinlenmiş ve mutlu', w: ['Yorgun ve uykulu', 'Geç kalmış', 'Kitabını unutmuş'], ex: 'Planlı bir gün, dinlenmiş ve enerjik bir sabah demektir.', img: 'happy' },
  { q: 'Ders çalışırken dikkatin dağılıyor. Ne yaparsın?', a: 'Ekranları kapatırım', w: ['Televizyonu açarım', 'Tablete bakarım', 'Ödevi bırakırım'], ex: 'Ders çalışırken ve kitap okurken ekranlardan uzak dururuz.', img: 'television' },
  { q: 'Bir iş planladığımızdan uzun sürdü. Ne yaparız?', a: 'Planı gözden geçiririz', w: ['Hemen vazgeçeriz', 'Ağlarız', 'Başka birine kızarız'], ex: 'Planımızı yeniden düzenleyebiliriz.', img: 'calendar' },
  { q: 'Çalışırken çok yorulduk. Ne yaparız?', a: 'Kısa bir mola veririz', w: ['Hiç durmadan çalışırız', 'Gece yarısına kadar otururuz', 'Yemeği atlarız'], ex: 'Yorulunca kısa bir mola verip devam ederiz.', img: 'hourglass' },
  { q: 'Hangi çocuk doğru düşünüyor?', a: '“Günümüzü planlamalıyız.”', w: ['“Önce saatlerce tablet, sonra ödev.”', '“Plan sıkıcı, canım isteyince uyurum.”', '“Ödevi hep yarına bırakırım.”'], ex: 'Günümüzü planlarsak işlerimiz zamanında biter.', img: 'thinking' },
  { q: 'Işıl kitabını evde unuttu. Ne yapmalıydı?', a: 'Çantasını önceden kontrol etmeliydi', w: ['Kahvaltıda oyalanmalıydı', 'Geç yatmalıydı', 'Kitabı hiç almamalıydı'], ex: 'Akşamdan çantamızı kontrol edersek bir şey unutmayız.', img: 'backpack' },
]
const PLAN_TF: TF[] = [
  ['Planlı olursak oyuna daha çok zaman kalır.', true, 'İşler zamanında bitince sevdiğimiz şeylere vakit kalır.'],
  ['Planlı olmak zamanı iyi kullanmamızı sağlar.', true, 'Zamanı verimli kullanırız, düzenli oluruz.'],
  ['Ödevden önce saatlerce tablet oynarız.', false, 'Ekran süresine dikkat eder, önce işlerimizi yaparız.'],
  ['Zor bir işi adım adım yaparız.', true, 'Her adımda kendimizi tebrik edebiliriz.'],
  ['Ders çalışırken televizyon açık olmalıdır.', false, 'Ders çalışırken ekranlardan uzak dururuz.'],
  ['Yapılacaklar listesi işlerimizi hatırlatır.', true, 'Liste, hiçbir işi unutmamamıza yardım eder.'],
  ['Plan yaparken ailemizden destek alabiliriz.', true, 'Ailemiz plan yapmamıza yardım eder.'],
  ['İşlerimizi hep son dakikaya bırakırız.', false, 'İşleri ertelemeden, kararlı davranırız.'],
  ['Akşam geç yatarsak sabah dinç kalkarız.', false, 'Erken yatarsak sabah dinç kalkarız.'],
]
const GUN_ITEMS: SortQ['items'] = [
  { label: 'Kahvaltı yapmak', img: 'forkplate', bin: 'sabah' },
  { label: 'Çantayı kontrol etmek', img: 'backpack', bin: 'sabah' },
  { label: 'Elini yüzünü yıkamak', img: 'soap', bin: 'sabah' },
  { label: 'Okula gitmek', img: 'school', bin: 'sabah' },
  { label: 'Ödev yapmak', img: 'pencil', bin: 'okul' },
  { label: 'Kitap okumak', img: 'book', bin: 'okul' },
  { label: 'Oyun oynamak', img: 'ball', bin: 'okul' },
  { label: 'Biraz dinlenmek', img: 'happy', bin: 'okul' },
  { label: 'Dişleri fırçalamak', img: 'toothbrush', bin: 'aksam' },
  { label: 'Pijama giymek', img: 'moon', bin: 'aksam' },
  { label: 'Erken uyumak', img: 'bed', bin: 'aksam' },
]
const GUN_BINS: SortQ['bins'] = [
  { id: 'sabah', label: 'Güne başlarken', img: 'sunrise', color: '#f59e0b' },
  { id: 'okul', label: 'Okuldan sonra', img: 'school', color: '#3b82f6' },
  { id: 'aksam', label: 'Günü bitirirken', img: 'moon', color: '#8b5cf6' },
]
const PLAN_O: O[] = [
  { q: 'Fatma’nın okuldan sonraki planını sırala.', s: ['Biraz dinlen', 'Ödevini yap', 'Kitap oku', 'Oyun oyna', 'Ailenle vakit geçir', 'Erken uyu'], ex: 'Önce dinlenme ve ödev, sonra kitap, oyun ve aile. En son uyku!', img: 'calendar' },
  { q: 'Sabah okula hazırlanmayı sırala.', s: ['Zamanında uyan', 'Elini yüzünü yıka', 'Kahvaltı yap', 'Çantanı kontrol et', 'Okula git'], ex: 'Planlı bir sabah bizi okula zamanında götürür.', img: 'sunrise' },
  { q: 'Yapılacaklar listesi hazırlamayı sırala.', s: ['Yapacağın işleri düşün', 'Hepsini listeye yaz', 'En önemlisini başa al', 'Bitirdiğin işi işaretle'], ex: 'Liste işlerimizi sıraya koyar.', img: 'memo' },
]
const PLAN_P: P[] = [
  ['Dikkatim dağılıyor', 'Ekranı kapat', 'television'],
  ['İş çok zor', 'Adım adım yap', 'puzzle'],
  ['Çok yoruldum', 'Mola ver', 'sleepy'],
  ['İşlerimi unutuyorum', 'Liste hazırla', 'memo'],
  ['Oyunu bırakamıyorum', 'Süreye dikkat et', 'hourglass'],
  ['Masam çok karışık', 'Masanı düzenle', 'pencil'],
]

/* --- HB.2.1.2 İletişim Var, Sorun Yok --- */
const DINLE_HIT = ['Göz teması kur', 'Başını salla', 'Sözünü kesme', 'Konuşana dön', 'Duyguyu anla', 'Anladığını söyle']
const DINLE_WRONG = ['Sözünü kes', 'Pencereden bak', 'Başka işle uğraş', 'Arkanı dön', 'Esneyip sıkıl']
const DINLE_IMG: Record<string, string> = { 'Göz teması kur': 'eye', 'Başını salla': 'thumbsup', 'Sözünü kesme': 'shush', 'Konuşana dön': 'ear', 'Duyguyu anla': 'heart', 'Anladığını söyle': 'speaker', 'Sözünü kes': 'thumbsdown', 'Pencereden bak': 'eyes', 'Arkanı dön': 'noentry', 'Esneyip sıkıl': 'sleepy' }
const ILETISIM_Q: Q[] = [
  { q: 'Mehmet, Seda konuşurken bahçeye bakıyor. Neyi unuttu?', a: 'Dikkatle dinlemeyi', w: ['Hızlı koşmayı', 'Resim yapmayı', 'Şarkı söylemeyi'], ex: 'Konuşana döner, dikkatimizi ona veririz.', img: 'eye' },
  { q: 'Ali sunumda çok alçak sesle konuşuyor. Ne yapmalı?', a: 'Herkesin duyacağı sesle konuşmalı', w: ['Fısıldamalı', 'Arkasını dönmeli', 'Susmalı'], ex: 'Ses tonumuzu herkes duyacak şekilde ayarlarız.', img: 'speaker' },
  { q: 'Burcu konuşurken Efe sürekli söz istiyor. Efe ne yapmalı?', a: 'Burcu’nun bitirmesini beklemeli', w: ['Araya girmeli', 'Bağırmalı', 'Sınıftan çıkmalı'], ex: 'Konuşan sözünü bitirince söz isteriz.', img: 'raisedhand' },
  { q: 'Esra üzgün bir şey anlatıyor. Gamze nasıl dinlemeli?', a: 'Başını sallayıp anladığını söylemeli', w: ['Hiç tepki vermemeli', 'Gülmeli', 'Başka yere bakmalı'], ex: 'Duygusunu anlamaya çalışır, anladığımızı söyleriz.', img: 'sad' },
  { q: 'Konuşurken karşımızdakiyle ne kurarız?', a: 'Göz teması', w: ['Kule', 'Sırt teması', 'Oyun evi'], ex: 'Göz teması, onu dinlediğimizi gösterir.', img: 'eye' },
  { q: 'Söz almak için ne zaman konuşuruz?', a: 'Konuşan sözünü bitirince', w: ['Konuşanın sözünü keserek', 'Herkesle aynı anda', 'Hiçbir zaman'], ex: 'Sözünü kesmeyiz, bitirmesini bekleriz.', img: 'raisedhand' },
  { q: 'Hiç konuşmadan da anlaşabilir miyiz?', a: 'Evet, el ve yüz hareketleriyle', w: ['Hayır, asla', 'Yalnızca bağırarak', 'Yalnızca yazarak'], ex: 'Beden dili ve yüz ifadesi de iletişimdir.', img: 'wave2' },
]
const BOSLUK_Q: Q[] = [
  { q: 'Konuşurken akıcı ve ___ cümleler kurarız.', a: 'anlamlı', w: ['hızlı', 'karışık', 'bitmeyen'], ex: 'Akıcı ve anlamlı cümleler kurarız.', img: 'speaker' },
  { q: 'Konuşanın ___ bitirmesini bekleriz.', a: 'sözünü', w: ['hızlı', 'oyununu', 'yemeğini'], ex: 'Konuşanın sözünü bitirmesini bekleriz.', img: 'shush' },
  { q: 'Konuşurken ___ teması kurarız.', a: 'göz', w: ['hızlı', 'sırt', 'ayak'], ex: 'Göz teması kurarız.', img: 'eye' },
  { q: 'İletişimde herkese ___ davranırız.', a: 'nazik', w: ['hızlı', 'kaba', 'kızgın'], ex: 'Nazik olmak iletişimi güzelleştirir.', img: 'handshake' },
  { q: 'Herkesin duyacağı ___ tonuyla konuşuruz.', a: 'ses', w: ['hızlı', 'renk', 'su'], ex: 'Uygun ses tonuyla konuşuruz.', img: 'microphone' },
  { q: 'Yüz ifademiz ve ___ dilimiz de bir şey anlatır.', a: 'beden', w: ['hızlı', 'kalem', 'masa'], ex: 'Beden dili de iletişimin parçasıdır.', img: 'wave2' },
]
const DINLE_ITEMS: SortQ['items'] = [
  { label: 'Başımı sallarım', img: 'thumbsup', bin: 'dinle' },
  { label: 'Sözünü kesmem', img: 'shush', bin: 'dinle' },
  { label: 'Konuşana dönerim', img: 'ear', bin: 'dinle' },
  { label: 'Duygusunu anlarım', img: 'heart', bin: 'dinle' },
  { label: 'Söz isterim', img: 'raisedhand', bin: 'konus' },
  { label: 'Sesimi ayarlarım', img: 'speaker', bin: 'konus' },
  { label: 'Anlamlı cümle kurarım', img: 'memo', bin: 'konus' },
  { label: 'Türkçeyi doğru kullanırım', img: 'openbook', bin: 'konus' },
]
const YUZ_P: P[] = [
  ['Gülümseyen yüz', 'Mutluyum', 'happy'],
  ['Ağlayan yüz', 'Üzgünüm', 'sad'],
  ['Kaşları çatık yüz', 'Kızgınım', 'angry'],
  ['Gözleri kocaman açık yüz', 'Şaşırdım', 'surprised'],
  ['Esneyen yüz', 'Uykum var', 'sleepy'],
  ['Ürkmüş, büzülmüş yüz', 'Korktum', 'scared'],
]

/* --- HB.2.1.3 Arkadaşlık İlişkilerimiz --- */
const ARK_ITEMS: SortQ['items'] = [
  { label: 'Selamlaşmak', img: 'wave2', bin: 'olumlu' },
  { label: 'Eşyalarını paylaşmak', img: 'gift', bin: 'olumlu' },
  { label: 'Yardım etmek', img: 'hug', bin: 'olumlu' },
  { label: 'Arkadaşını tebrik etmek', img: 'clap', bin: 'olumlu' },
  { label: 'Yeni arkadaşı oyuna çağırmak', img: 'ball', bin: 'olumlu' },
  { label: '“Lütfen” demek', img: 'raisedhand', bin: 'olumlu' },
  { label: 'Alay etmek', img: 'thumbsdown', bin: 'olumsuz' },
  { label: 'Sözünü tutmamak', img: 'sad', bin: 'olumsuz' },
  { label: 'Kavga etmek', img: 'angry', bin: 'olumsuz' },
  { label: 'Sırada öne geçmek', img: 'walking', bin: 'olumsuz' },
  { label: 'İzinsiz kalem almak', img: 'crayon', bin: 'olumsuz' },
  { label: 'Küsmek', img: 'noentry', bin: 'olumsuz' },
]
const ARK_P: P[] = [
  ['Yardım etmek', 'Güven', 'hug'],
  ['Tebrik etmek', 'Mutluluk', 'clap'],
  ['Paylaşmak', 'Sevgi', 'gift'],
  ['Alay etmek', 'Üzüntü', 'thumbsdown'],
  ['Kavga etmek', 'Öfke', 'angry'],
  ['Sözünü tutmamak', 'Hayal kırıklığı', 'sad'],
]
const ARK_Q: Q[] = [
  { q: 'Arkadaşı Efe’ye yedek kalem verdi. Efe ne hisseder?', a: 'Mutlu', w: ['Kızgın', 'Korkmuş', 'Üzgün'], ex: 'Yardım görmek bizi mutlu eder.', o: FACE },
  { q: 'Efe oyuna alınmadı. Ne hissedebilir?', a: 'Üzgün', w: ['Mutlu', 'Heyecanlı', 'Şaşkın'], ex: 'Dışarıda kalmak üzer. Herkesi oyuna katarız.', o: FACE },
  { q: 'Biri sıranın önüne geçti, uyarınca da çekilmedi. Ne hissedebilirsin?', a: 'Kızgın', w: ['Mutlu', 'Heyecanlı', 'Şaşkın'], ex: 'Kızabiliriz. Yine de sakin ve nazik konuşuruz.', o: FACE },
  { q: 'Melis ödevi için bahçeye gelmedi. Hazal ne yapmalıydı?', a: 'Kararına saygı duymalıydı', w: ['Bağırıp gitmeliydi', 'Ona küsmeliydi', 'Onunla alay etmeliydi'], ex: 'Arkadaşımızın kararına saygı duyarız.', img: 'handshake' },
  { q: 'Arkadaşın golü kaçırdı. Ne dersin?', a: '“Olsun, bir dahakine!”', w: ['“Hep kaçırıyorsun!”', '“Seninle oynamam!”', '“Çok kötüsün!”'], ex: 'Arkadaşımızı cesaretlendiririz.', img: 'ball' },
  { q: 'Yanlışlıkla arkadaşını kırdın. Ne yaparsın?', a: 'İçtenlikle özür dilerim', w: ['Hiçbir şey olmamış gibi yaparım', 'Ona gülerim', 'Ona küserim'], ex: 'Kırdığımızı fark edince özür dileriz.', img: 'hug' },
  { q: 'Sınıfa yeni bir öğrenci geldi. Ne yaparsın?', a: 'Onu oyuna çağırırım', w: ['Ondan uzak dururum', 'Onunla alay ederim', 'Onu görmezden gelirim'], ex: 'Yeni arkadaşı aramıza alırız.', img: 'friends' },
]
const ARK_TF: TF[] = [
  ['Kızgınken bile kırmadan konuşurum.', true, 'Duygularımızı nazikçe söyleriz.'],
  ['Soruyu bilemeyen arkadaşıma gülerim.', false, 'Ona yardım eder, cesaret veririz.'],
  ['Başarılı arkadaşımı tebrik ederim.', true, 'Tebrik etmek arkadaşlığı güçlendirir.'],
  ['Arkadaşımın boya kalemlerini izinsiz alırım.', false, 'İzin isteyerek kullanırız.'],
  ['Sorunları konuşarak çözerim.', true, 'Konuşmak sorunları çözer.'],
  ['Kendimi arkadaşımın yerine koyarım.', true, 'Böylece onun ne hissettiğini anlarım.'],
  ['Arkadaşıma verdiğim sözü tutmam.', false, 'Sözümüzü tutarız, güven böyle oluşur.'],
]
const DUYGU_MEM: P[] = [
  ['Mutluluk', 'Gülen yüz', undefined, 'happy'],
  ['Üzüntü', 'Ağlayan yüz', undefined, 'sad'],
  ['Öfke', 'Kızgın yüz', undefined, 'angry'],
  ['Korku', 'Korkan yüz', undefined, 'scared'],
  ['Şaşkınlık', 'Şaşıran yüz', undefined, 'surprised'],
  ['Sevgi', 'Kalp', undefined, 'heart'],
]

/* --- HB.2.1.4 Karar Verme Zamanı --- */
const KARAR_O: O[] = [
  { q: 'Birlikte karar almayı sırala.', s: ['Fikrimi söylerim', 'Arkadaşlarımı dinlerim', 'Düşünceleri paylaşırız', 'Oylama yaparız', 'Kararı değerlendiririz'], ex: 'Söyle, dinle, paylaş, oyla ve değerlendir!', img: 'friends' },
  { q: 'Sınıf kuralı seçmeyi sırala.', s: ['Herkes bir kural önerir', 'Kurallar tahtaya yazılır', 'Herkes oyunu verir', 'Oylar sayılır', 'En çok oy alan kural asılır'], ex: 'En çok oy alan öneri karar olur.', img: 'raisedhand' },
]
const KARAR_TF: TF[] = [
  ['Sınıfça alınan kararları hep birlikte uygularız.', true, 'Ortak karara hep birlikte uyarız.'],
  ['Görüşlerimizle grup çalışmasına katkıda bulunuruz.', true, 'Her fikir değerlidir.'],
  ['Farklı görüşlere saygı duyarız.', true, 'Saygı, birlikte karar almanın temelidir.'],
  ['En çok oy alan fikre karar veririz.', true, 'Çoklu oylamada en çok oy alan kazanır.'],
  ['Kararlardan yalnızca istediğimize uyarız.', false, 'Alınan bütün kararlara uyarız.'],
  ['Arkadaşımız aynı fikirde değilse ona kızarız.', false, 'Farklı düşünceye saygı gösteririz.'],
  ['Alınan kararlara uymak zorunda değiliz.', false, 'Birlikte aldığımız kararlara uyarız.'],
  ['Sınıftaki bütün kararları sınıf başkanı alır.', false, 'Sınıfla ilgili kararları hep birlikte alırız.'],
  ['Herkesin görüşünü söylemesine fırsat veririz.', true, 'Herkes konuşabilmelidir.'],
]
const OY_Q: Q[] = [
  { q: 'Gezi oylaması: Müze 9 oy, Park 5 oy, Hayvanat bahçesi 7 oy. Hangisi seçilir?', a: 'Müze', w: ['Park', 'Hayvanat bahçesi', 'Hiçbiri'], ex: '9 en büyük sayı. En çok oyu müze aldı.', img: 'chart' },
  { q: 'Pano rengi: Mavi 4 oy, Yeşil 11 oy, Sarı 8 oy. Hangisi kazanır?', a: 'Yeşil', w: ['Mavi', 'Sarı', 'Kırmızı'], ex: '11 oy en çok oydur.', img: 'chart' },
  { q: 'Kural oylaması: “Sırayı bekle” 12, “Koşma” 6, “Temiz tut” 9 oy. Hangisi seçilir?', a: 'Sırayı bekle', w: ['Koşma', 'Temiz tut', 'Hiçbiri'], ex: '12 oy en çok oydur.', img: 'chart' },
  { q: 'Çoklu oylamada her öğrencinin kaç oyu vardır?', a: 'Bir', w: ['Beş', 'On', 'Sınırsız'], ex: 'Her öğrencinin bir oyu vardır.', img: 'raisedhand' },
  { q: 'Sınıfla ilgili kararları kim alır?', a: 'Hep birlikte alırız', w: ['Yalnızca sınıf başkanı', 'Yalnızca en hızlı koşan', 'Hiç kimse'], ex: 'Sınıfta ortak karar alırız.', img: 'friends' },
  { q: 'Arkadaşın senden farklı düşünüyor. Ne yaparsın?', a: 'Fikrine saygı gösteririm', w: ['Ona kızarım', 'Onu dinlemem', 'Bağırırım'], ex: 'Farklı düşüncelere saygı gösteririz.', img: 'handshake' },
  { q: 'Sınıfta neye birlikte karar verebiliriz?', a: 'Oturma düzenine', w: ['Güneşin doğuşuna', 'Hava durumuna', 'Okulun yerine'], ex: 'Oturma düzeni, sınıf kuralları, geziler ve panolara birlikte karar veririz.', img: 'school' },
]
const KARAR_HIT = ['Fikrimi söylerim', 'Herkesi dinlerim', 'Oyumu veririm', 'Saygı gösteririm', 'Sırayla konuşurum']
const KARAR_WRONG = ['Bağırırım', 'Sözü keserim', 'Kızıp giderim', 'Kimseyi dinlemem']

/* ================================================================================================
 * 2. ÖĞRENME ALANI · SAĞLIĞIM VE GÜVENLİĞİM
 * ================================================================================================ */
/* --- HB.2.2.1 Sağlıklı Alışkanlıklar --- */
const BESIN: SortQ['items'] = [
  { label: 'Süt', img: 'milk', bin: 'her' },
  { label: 'Yumurta', img: 'egg', bin: 'her' },
  { label: 'Yoğurt', img: 'bowl', bin: 'her' },
  { label: 'Peynir', img: 'cheese', bin: 'her' },
  { label: 'Elma', img: 'apple', bin: 'her' },
  { label: 'Brokoli', img: 'broccoli', bin: 'her' },
  { label: 'Havuç', img: 'carrot', bin: 'her' },
  { label: 'Gazlı içecek', img: 'soda', bin: 'ara' },
  { label: 'Patates kızartması', img: 'fries', bin: 'ara' },
  { label: 'Şeker', img: 'candy', bin: 'ara' },
  { label: 'Çikolata', img: 'chocolate', bin: 'ara' },
  { label: 'Lolipop', img: 'lollipop', bin: 'ara' },
]
const ALIS_P: P[] = [
  ['Beslenme', 'Kahvaltı yapmak', 'forkplate'],
  ['Uyku', 'Erken yatmak', 'bed'],
  ['Spor', 'Koşmak', 'running'],
  ['Diş sağlığı', 'Diş fırçalamak', 'toothbrush'],
  ['Ortam temizliği', 'Odayı havalandırmak', 'broom'],
  ['Kişisel bakım', 'Tırnak kesmek', 'scissors'],
]
const CUMLE_P: P[] = [
  ['Vücudumuzu temiz tutmak için', 'düzenli banyo yaparız', 'bathtub'],
  ['Yemeklerden sonra dişlerimizi', 'fırçalarız', 'toothbrush'],
  ['Güçlü bir vücut için', 'düzenli spor yaparız', 'biceps'],
  ['Gün içinde ellerimizi', 'sabunla yıkarız', 'soap'],
  ['Dinç kalkmak için akşam', 'erken yatarız', 'bed'],
]
const SAGLIK_TF: TF[] = [
  ['Tırnaklarımızın temizliğine dikkat ederiz.', true, 'Tırnak bakımı kişisel bakımımızdır.'],
  ['Et, süt ve yumurta gibi besinler yeriz.', true, 'Bunlar sağlıklı besinlerdir.'],
  ['Kişisel bakımımızı düzenli yaparız.', true, 'Böylece hastalıklardan korunuruz.'],
  ['Akşam geç uyur, sabah geç kalkarız.', false, 'Akşam erken uyur, sabah erken kalkarız.'],
  ['Öğün atlamak bizi güçlü yapar.', false, 'Öğün atlamayız, düzenli besleniriz.'],
  ['Kapalı odaları belli aralıklarla havalandırırız.', true, 'Temiz hava hastalıklardan korur.'],
  ['Susayınca gazlı içecek içeriz.', false, 'Susayınca su içeriz.'],
  ['İlgimizi çeken bir spor dalı seçebiliriz.', true, 'Spor bizi sağlıklı ve dinç yapar.'],
]
const SAGLIK_Q: Q[] = [
  { q: 'Semih kahvaltı etmedi. Derste ne oldu?', a: 'Midesi guruldadı', w: ['Çok enerjik oldu', 'Hiç acıkmadı', 'Uykusu açıldı'], ex: 'Kahvaltı güne enerjiyle başlamamızı sağlar.', img: 'forkplate' },
  { q: 'Hale gece yeterince uyumadı. Sabah nasıl?', a: 'Uykulu', w: ['Dinç', 'Enerjik', 'Dinlenmiş'], ex: 'Düzenli ve yeterli uyku gerekir.', img: 'sleepy' },
  { q: 'Hangisi sağlıklı bir besindir?', a: 'Yoğurt', w: ['Cips', 'Gazlı içecek', 'Şeker'], ex: 'Yoğurt, süt, yumurta, sebze ve meyve sağlıklıdır.', img: 'bowl' },
  { q: 'Kapalı bir sınıfta ne yaparız?', a: 'Pencereyi açıp havalandırırız', w: ['Hiç havalandırmayız', 'Çöpleri yere atarız', 'Kapıyı kilitleriz'], ex: 'Havalandırmak bulaşıcı hastalıklardan korur.', img: 'school' },
  { q: 'Düzenli kişisel bakım bizi neyden korur?', a: 'Hastalıklardan', w: ['Yağmurdan', 'Ödevlerden', 'Oyunlardan'], ex: 'El yıkamak, banyo ve diş fırçalamak bizi korur.', img: 'soap' },
  { q: 'Düzenli spor yapınca ne olur?', a: 'Vücudumuz güçlenir', w: ['Hep yorgun kalırız', 'Uykumuz kaçar', 'Hiçbir şey olmaz'], ex: 'Spor vücudumuzun gelişmesine yardım eder.', img: 'biceps' },
]
const ALIS_HIT = ['Erken uyu', 'Spor yap', 'Diş fırçala', 'Meyve ye', 'El yıka', 'Tırnak kes', 'Banyo yap']
const ALIS_WRONG = ['Öğün atla', 'Geç yat', 'Çok cips ye', 'Hep ekran izle', 'Çöpü yere at']
const ALIS_IMG: Record<string, string> = { 'Erken uyu': 'bed', 'Spor yap': 'running', 'Diş fırçala': 'toothbrush', 'Meyve ye': 'apple', 'El yıka': 'soap', 'Tırnak kes': 'scissors', 'Banyo yap': 'bathtub', 'Öğün atla': 'plate', 'Geç yat': 'moon', 'Çok cips ye': 'fries', 'Hep ekran izle': 'television', 'Çöpü yere at': 'trash' }

/* --- HB.2.2.2 Çevrim İçi Güvenliğim --- */
const GIZLI_ITEMS: SortQ['items'] = [
  { label: 'Şifrem', img: 'lock', bin: 'gizli' },
  { label: 'Ev adresim', img: 'house', bin: 'gizli' },
  { label: 'Telefon numaram', img: 'telephone', bin: 'gizli' },
  { label: 'Fotoğrafım', img: 'camera', bin: 'gizli' },
  { label: 'Kimlik bilgilerim', img: 'shield', bin: 'gizli' },
  { label: 'Sevdiğim renk', img: 'palette', bin: 'degil' },
  { label: 'En sevdiğim hayvan', img: 'cat', bin: 'degil' },
  { label: 'Sevdiğim mevsim', img: 'cloudsun', bin: 'degil' },
  { label: 'Sevdiğim masal', img: 'openbook', bin: 'degil' },
]
const CEVRIM_Q: Q[] = [
  { q: 'Oyunda tanımadığın biri fotoğrafını istiyor. Ne yaparsın?', a: 'Göndermem, büyüğüme söylerim', w: ['Hemen gönderirim', 'Ailemin fotoğrafını gönderirim', 'Adresimi de yazarım'], ex: 'Fotoğrafımızı tanımadığımız kişilere göndermeyiz.', img: 'camera' },
  { q: 'Biri sana ısrarla mesaj atıyor. Ne yaparsın?', a: '“Hayır” der, engeller, büyüğüme söylerim', w: ['Cevap vermeye devam ederim', 'Şifremi veririm', 'Kimseye söylemem'], ex: 'Hayır de, engelle, güvendiğin büyüğe söyle.', img: 'shield' },
  { q: 'Bir sayfa ailenin adını ve adresini soruyor. Ne yaparsın?', a: 'Doldurmam, sayfadan çıkarım', w: ['Hemen doldururum', 'Telefonumu da yazarım', 'Arkadaşlarıma gönderirim'], ex: 'Sayfadan çıkar, bir büyüğümüze haber veririz.', img: 'laptop' },
  { q: 'En yakın arkadaşın şifreni soruyor. Ne yaparsın?', a: 'Şifremi kimseyle paylaşmam', w: ['Hemen söylerim', 'Kâğıda yazıp veririm', 'Herkese söylerim'], ex: 'Şifremizi en yakın arkadaşımızla bile paylaşmayız.', img: 'lock' },
  { q: 'Tanımadığın biri “hediye puan” vermek istiyor. Ne yaparsın?', a: 'Kabul etmem, büyüğüme söylerim', w: ['Bilgilerimi verip alırım', 'Şifremi yazarım', 'Gizlice kabul ederim'], ex: 'Ödül vaadine kanmayız, büyüğümüze söyleriz.', img: 'gift' },
  { q: 'Yanlışlıkla tuhaf bir bağlantıya tıkladın. Ne yaparsın?', a: 'Hemen büyüğüme söylerim', w: ['Saklarım', 'Tekrar tıklarım', 'Arkadaşlarıma da gönderirim'], ex: 'Yanlışlıkla olabilir. Hemen bir büyüğe söylemek en doğrusudur.', img: 'link' },
  { q: 'Hande’den velilerin telefonlarını istediler. Hande ne demeli?', a: '“Anneme sormadan paylaşamam.”', w: ['“Hemen söylüyorum.”', '“Hepsini yazarım.”', '“Bilmediklerimi uydururum.”'], ex: 'Başkasının bilgisini izinsiz paylaşmayız.', img: 'telephone' },
]
const GUVENDE_TF: TF[] = [
  ['Fotoğraf paylaşmadan önce büyüklerime sorarım.', true, 'Önce ailemize danışırız.'],
  ['Şifremi ve adresimi ailem dışında kimseyle paylaşmam.', true, 'Bunlar gizli bilgilerimizdir.'],
  ['Kişisel bilgi gerekirse önce aileme danışırım.', true, 'Ailemiz bize yol gösterir.'],
  ['Tanımadığım kişilerin mesajlarını açmam.', true, 'Tanımadığımız kişilerle konuşmayız.'],
  ['Tanımadığım kişilerin arkadaşlık isteğini kabul ederim.', false, 'Yalnızca tanıdığımız kişilerle iletişim kurarız.'],
  ['Kaynağını bilmediğim bağlantılara tıklarım.', false, 'Bilmediğimiz bağlantılara tıklamayız.'],
  ['Özel bilgilerimi isteyen herkese veririm.', false, 'Özel bilgilerimizi gizli tutarız.'],
  ['Ödül veren sitelere bilgilerimi yazarım.', false, 'Ödül vaadine kanmaz, büyüğümüze sorarız.'],
  ['Rahatsız olursam güvendiğim bir büyüğe söylerim.', true, 'Büyüklerimiz bize yardım eder.'],
]
const GUVEN_HIT = ['Şifremi gizlerim', 'Büyüğüme sorarım', '“Hayır!” derim', 'Engellerim', 'Oyundan çıkarım']
const GUVEN_WRONG = ['Şifremi veririm', 'Adresimi yazarım', 'Linke tıklarım', 'Yabancıya yazarım']
const GUVEN_IMG: Record<string, string> = { 'Şifremi gizlerim': 'lock', 'Büyüğüme sorarım': 'hug', '“Hayır!” derim': 'stopsign', Engellerim: 'noentry', 'Oyundan çıkarım': 'videogame', 'Şifremi veririm': 'key', 'Adresimi yazarım': 'house', 'Linke tıklarım': 'link', 'Yabancıya yazarım': 'laptop' }

/* --- HB.2.2.3 Dikkat, Levha Çıkabilir! --- */
const LEVHA_P: P[] = [
  ['Yaya Geçidi', 'Buradan dikkatle geçilir', 'crossing'],
  ['Okul Geçidi', 'Okul önünden kontrollü geçilir', 'school'],
  ['Üst Geçit', 'Yolun üstünden geçilir', 'traffic2'],
  ['Alt Geçit', 'Yolun altından geçilir'],
  ['Işıklı İşaret Cihazı', 'İleride trafik ışığı var', 'trafficlight'],
  ['Bisiklet Giremez', 'Bisiklet sürmek yasak', 'bicycle'],
  ['Yaya Giremez', 'Yayaların girmesi yasak', 'noentry'],
  ['Mecburi Bisiklet Yolu', 'Bisikletler bu yolu kullanır'],
  ['Mecburi Yaya Yolu', 'Yayalar bu yolu kullanır', 'walking'],
]
const LEVHA_Q: Q[] = [
  { q: 'Kırmızı çemberli levhalar ne anlatır?', a: 'Yasak', w: ['İzin', 'Oyun alanı', 'Hediye'], ex: 'Kırmızı çember içindeki levhalar yasak anlatır.', img: 'noentry' },
  { q: 'Sürücü okul geçidi uyarı levhasını görünce ne yapar?', a: 'Yavaşlar', w: ['Hızlanır', 'Korna çalar', 'Durmadan geçer'], ex: 'Uyarı levhalarını gören sürücü hızını düşürür.', img: 'school' },
  { q: 'Hangi levha ileride trafik ışığı olduğunu söyler?', a: 'Işıklı İşaret Cihazı', w: ['Yaya Giremez', 'Alt Geçit', 'Bisiklet Giremez'], ex: 'Işıklı İşaret Cihazı levhası trafik ışığını haber verir.', img: 'trafficlight' },
  { q: 'Bisikletle gidiyorsun. Hangi yolu kullanırsın?', a: 'Mecburi Bisiklet Yolu', w: ['Mecburi Yaya Yolu', 'Yaya Geçidi', 'Üst Geçit'], ex: 'Bisikletler mecburi bisiklet yolunu kullanır.', img: 'bicycle' },
  { q: '“Yaya Giremez” levhası olan yola yürüyerek girebilir miyiz?', a: 'Hayır, yayalara yasaktır', w: ['Evet, koşarak', 'Evet, her zaman', 'Evet, yalnızca gündüz'], ex: 'Bu yola yayaların girmesi yasaktır.', img: 'noentry' },
  { q: 'Trafik levhaları ne için vardır?', a: 'Güvenliğimiz için', w: ['Süs olsun diye', 'Oyun oynamak için', 'Resim yapmak için'], ex: 'Levhalar bilgi verir, uyarır ve trafiği düzenler.', img: 'stopsign' },
  { q: 'Levhalara uymak kimin görevidir?', a: 'Hepimizin', w: ['Yalnızca polisin', 'Hiç kimsenin', 'Yalnızca çocukların'], ex: 'Levhalara uymak toplumsal görevimizdir.', img: 'friends' },
  { q: 'Yolun altından karşıya geçtiğimiz yere ne denir?', a: 'Alt geçit', w: ['Üst geçit', 'Kaldırım', 'Otopark'], ex: 'Alt geçitten güvenle karşıya geçeriz.', img: 'crossing' },
]
const LEVHA_ITEMS: SortQ['items'] = [
  { label: 'Yaya Geçidi', img: 'crossing', bin: 'bilgi' },
  { label: 'Okul Geçidi', img: 'school', bin: 'bilgi' },
  { label: 'Alt Geçit', bin: 'bilgi' },
  { label: 'Üst Geçit', img: 'traffic2', bin: 'bilgi' },
  { label: 'Bisiklet Giremez', img: 'bicycle', bin: 'duzen' },
  { label: 'Yaya Giremez', img: 'noentry', bin: 'duzen' },
  { label: 'Mecburi Bisiklet Yolu', bin: 'duzen' },
  { label: 'Mecburi Yaya Yolu', img: 'walking', bin: 'duzen' },
]
const LEVHA_TF: TF[] = [
  ['Kırmızı çemberli levhalar yasak anlatır.', true, 'Kırmızı çember yasak demektir.'],
  ['Alt geçitten karşıya geçebiliriz.', true, 'Alt geçit yayalar içindir.'],
  ['“Yaya Giremez” yazan yolda yürürüz.', false, 'O yola yayalar girmez.'],
  ['“Bisiklet Giremez” yazan yolda bisiklet süreriz.', false, 'O yolda bisiklet sürmek yasaktır.'],
  ['Sürücüler okul geçidi levhasını görünce yavaşlar.', true, 'Uyarı levhası sürücüyü dikkatli olmaya çağırır.'],
  ['Levhalara uymak hepimizin görevidir.', true, 'Kurallar herkesi korur.'],
  ['Levhalar yalnızca sürücüler içindir.', false, 'Yayalara da bilgi veren levhalar vardır.'],
  ['Mecburi yaya yolunu yayalar kullanır.', true, 'Yayalar bu yolu kullanmalıdır.'],
]

/* --- HB.2.2.4 Acilse Ne Yaparım? --- */
const ACIL_Q: Q[] = [
  { q: 'Acil Çağrı Merkezi’nin numarası kaçtır?', a: '112', w: ['123', '321', '213'], ex: 'Acil durumda 1-1-2 aranır.', img: 'telephone' },
  { q: '112 ne zaman hizmet verir?', a: 'Her gün, gece gündüz', w: ['Yalnızca hafta sonu', 'Yalnızca sabahları', 'Yalnızca bayramlarda'], ex: '112, haftanın 7 günü, 24 saat hizmet verir.', img: 'clock' },
  { q: '112’yi aramak için para gerekir mi?', a: 'Hayır, ücretsizdir', w: ['Evet, çok para gerekir', 'Evet, jeton gerekir', 'Evet, kart gerekir'], ex: '112 ücretsizdir.', img: 'coin' },
  { q: 'Hangisi acil bir durumdur?', a: 'Gaz kaçağı', w: ['Kalemin kırılması', 'Yağmur yağması', 'Oyunun bitmesi'], ex: 'Gaz kaçağı, yangın, sel, deprem ve trafik kazası acil durumdur.', img: 'siren' },
  { q: '112 ile konuşurken nasıl cevap veririz?', a: 'Kısa ve net', w: ['Uzun uzun', 'Bağırarak', 'Hiç cevap vermeden'], ex: 'Sorulara kısa, net ve anlamlı cevap veririz.', img: 'telephone' },
  { q: 'Telefonu ne zaman kapatırız?', a: 'Görevli söyleyince', w: ['İstediğimiz zaman', 'Hemen başta', 'Adresi söylemeden'], ex: 'Telefonu yetkili onaylayınca kapatırız.', img: 'telephone' },
  { q: '112’yi neden gereksiz yere aramayız?', a: 'Gerçek acil durumlar gecikir', w: ['Telefon renk değiştirir', 'Çok eğlenceli olur', 'Hava kararır'], ex: 'Gereksiz aramalar yardımın gecikmesine yol açar.', img: 'ambulance' },
  { q: 'Komşunun bahçesinden duman yükseliyor. Ne yaparsın?', a: 'Hemen bir büyüğe haber veririm', w: ['Yakından bakmaya giderim', 'Görmezden gelirim', 'Saklanırım'], ex: 'Bir büyüğe haber veririz, gerekirse 112 aranır.', img: 'fire' },
]
const ACIL_O: O[] = [
  { q: '112 ile konuşmayı sırala.', s: ['Sakin ol', '112’yi ara', 'Kendini tanıt', 'Ne olduğunu anlat', 'Kaç kişi etkilendi söyle', 'Adresi söyle', 'Görevliyi dinle', 'Görevli deyince kapat'], ex: 'Sakin ol, anlat, adresi ver ve görevliyi dinle.', img: 'telephone' },
  { q: 'Evde gaz kokusu aldın. Sırala.', s: ['Sakin kal', 'Hemen bir büyüğe haber ver', 'Gerekirse 112 aranır'], ex: 'Sakin kalıp büyüğümüze haber veririz.', img: 'siren' },
]
const KONUS_ITEMS: SortQ['items'] = [
  { label: 'Kısa ve net cevap ver', bin: 'dogru' },
  { label: 'Kişi sayısını söyle', bin: 'dogru' },
  { label: 'Olayı sakince anlat', bin: 'dogru' },
  { label: 'Adresi ver', img: 'house', bin: 'dogru' },
  { label: 'Kendini tanıt', bin: 'dogru' },
  { label: 'Görevliyi dinle', img: 'ear', bin: 'dogru' },
  { label: 'Panikle bağır', bin: 'yanlis' },
  { label: 'İstediğin an kapat', bin: 'yanlis' },
  { label: 'Yanlış bilgi ver', bin: 'yanlis' },
  { label: 'Görevliyle sohbet et', bin: 'yanlis' },
  { label: 'Bilgi vermekten kaç', bin: 'yanlis' },
]
const ACIL_TF: TF[] = [
  ['112’ye etkilenen kişi sayısı söylenir.', true, 'Kaç kişi etkilendiğini söyleriz.'],
  ['Görevliyle panik içinde konuşulur.', false, 'Sakin kalmaya çalışırız.'],
  ['Olayın yeri ve zamanı söylenir.', true, 'Yer ve adres yardımın gelmesi için önemlidir.'],
  ['Görevli yerine çevredekiler dinlenir.', false, 'Görevlinin söylediklerini yaparız.'],
  ['Arayan kişi kendini tanıtır.', true, 'Kim olduğumuzu söyleriz.'],
  ['Görevlinin sorularına uzun uzun cevap verilir.', false, 'Kısa ve net cevap veririz.'],
  ['Görevli söyleyene kadar telefon açık tutulur.', true, 'Telefonu görevli onaylayınca kapatırız.'],
  ['112 yalnızca acil durumlar için aranır.', true, 'Gereksiz arama yardımı geciktirir.'],
]
const ACIL_ITEMS: SortQ['items'] = [
  { label: 'Yangın', img: 'fire', bin: 'acil' },
  { label: 'Gaz kaçağı', img: 'siren', bin: 'acil' },
  { label: 'Sel', img: 'water2', bin: 'acil' },
  { label: 'Trafik kazası', img: 'ambulance', bin: 'acil' },
  { label: 'Zehirlenme', img: 'thermometer2', bin: 'acil' },
  { label: 'Kalemin ucu kırıldı', img: 'pencil', bin: 'degil' },
  { label: 'Yağmur yağıyor', img: 'rain', bin: 'degil' },
  { label: 'Çizgi film bitti', img: 'television', bin: 'degil' },
  { label: 'Oyuncağın pili bitti', img: 'battery2', bin: 'degil' },
]
const ACIL_HIT = ['Sakin kal', 'Kendini tanıt', 'Adresi söyle', 'Kısa cevap ver', 'Kaç kişi, söyle', 'Görevliyi dinle']
const ACIL_WRONG = ['Panik yap', 'Hemen kapat', 'Sohbet et', 'Şaka yap', 'Uzun uzun anlat']

/* ================================================================================================
 * 3. ÖĞRENME ALANI · AİLEM VE TOPLUM
 * ================================================================================================ */
/* --- HB.2.3.1 Canım Ailem --- */
const AILE_ITEMS: SortQ['items'] = [
  { label: 'Anne, baba, çocuk', img: 'house', bin: 'cekirdek' },
  { label: 'Anne ve iki çocuğu', img: 'woman', bin: 'cekirdek' },
  { label: 'Baba ve çocuğu', img: 'man', bin: 'cekirdek' },
  { label: 'Anne, baba, iki kardeş', img: 'houses', bin: 'cekirdek' },
  { label: 'Anne, baba, çocuk ve dede', img: 'oldman', bin: 'genis' },
  { label: 'Anne, baba, çocuk ve nine', img: 'oldwoman', bin: 'genis' },
  { label: 'Teyzeyle birlikte yaşayan aile', img: 'hug', bin: 'genis' },
  { label: 'Amcayla birlikte yaşayan aile', img: 'housegarden', bin: 'genis' },
]
const KUS_O: O[] = [
  { q: 'Kumru ailesinin hikâyesini sırala.', s: ['Kumru saksıya yumurtladı', 'Anne ve baba yumurtaları korudu', 'Yavrular yumurtadan çıktı', 'Anne ve baba yavruları besledi', 'Yavrular uçmayı denedi'], ex: 'Kuş ailesi de birbirine destek olur.', img: 'bird' },
  { q: 'Bayrama ailece hazırlanmayı sırala.', s: ['Evi birlikte temizle', 'İkramlıkları hazırla', 'Bayram sabahı temiz giyin', 'Büyükleri ziyaret et'], ex: 'Bayramda ailece bir araya geliriz.', img: 'gift' },
]
const AILE_HIT = ['Bize güven verir', 'Bize sevgi verir', 'İlk bilgiyi verir', 'Bize destek olur', 'Bize güç verir', 'Bizi dinler']
const AILE_WRONG = ['Hep kavga eder', 'Bizi dinlemez', 'Hiç ilgilenmez', 'Sözümüzü keser']
const AILE_TF: TF[] = [
  ['Ailece vakit geçirmek aile bağlarını güçlendirir.', true, 'Birlikte geçen zaman bizi yakınlaştırır.'],
  ['Aile büyüklerimize saygı gösteririz.', true, 'Saygı aile içi iletişimi güçlendirir.'],
  ['Destek olan aile bireylerimize teşekkür ederiz.', true, 'Teşekkür etmek sevgimizi gösterir.'],
  ['Ailede kimsenin görüşünü dinlemeyiz.', false, 'Birbirimizi dinler, herkesin görüşüne değer veririz.'],
  ['Ailede kişisel alanlarımıza saygı duyarız.', true, 'Kişisel alan evde de önemlidir.'],
  ['Zor zamanlarda birbirimizi yalnız bırakırız.', false, 'Mutlu ve zor günlerde birlikte oluruz.'],
  ['İlk bilgi ve becerilerimizi ailemizden öğreniriz.', true, 'Ailemiz ilk öğretmenimizdir.'],
  ['Aile bireylerimizin sözünü sürekli keseriz.', false, 'Birbirimizi sabırla dinleriz.'],
]
const AILE_Q: Q[] = [
  { q: 'Hangisi aile bağını güçlendirir?', a: 'Ailece oyun oynamak', w: ['Kimseyle konuşmamak', 'Kapıyı çarpmak', 'Odaya kapanmak'], ex: 'Birlikte geçirilen vakit aileyi güçlendirir.', img: 'puzzle' },
  { q: 'Bayramlarda ailece ne yaparız?', a: 'Büyüklerimizi ziyaret ederiz', w: ['Evden hiç çıkmayız', 'Kimseyi aramayız', 'Küs kalırız'], ex: 'Bayramlarda büyüklerimizi ziyaret ederiz.', img: 'gift' },
  { q: 'Ailende biri sana yardım etti. Ne yaparsın?', a: 'Teşekkür ederim', w: ['Görmezden gelirim', 'Kızarım', 'Hiçbir şey demem'], ex: 'Destek olanlara teşekkür ederiz.', img: 'heart' },
  { q: 'Kumru ailesinde anne ve baba ne yaptı?', a: 'Yavrularını sırayla besledi', w: ['Yuvayı bırakıp gitti', 'Yavrularla kavga etti', 'Hiç ilgilenmedi'], ex: 'Anne ve baba kuş yavrularını birlikte büyüttü.', img: 'bird' },
  { q: 'Aile birliğini korumada en önemli ne?', a: 'Sevgi ve saygı', w: ['Kavga ve kızgınlık', 'Hiç konuşmamak', 'Çok oyuncak'], ex: 'Sevgi ve saygı aileyi bir arada tutar.', img: 'heart' },
  { q: 'Güçlü aile bağları bize ne hissettirir?', a: 'Güvende olduğumuzu', w: ['Yalnız olduğumuzu', 'Korktuğumuzu', 'Kızgın olduğumuzu'], ex: 'Aile bağları sayesinde kendimizi güvende hissederiz.', img: 'shield' },
]

/* --- HB.2.3.2 Toplumda Nezaket ve Görgü --- */
const NG_ITEMS: SortQ['items'] = [
  { label: 'Özür dilemek', img: 'sad', bin: 'nezaket' },
  { label: 'Teşekkür etmek', img: 'heart', bin: 'nezaket' },
  { label: 'Sıramızı beklemek', img: 'hourglass', bin: 'nezaket' },
  { label: 'Saygılı ve anlayışlı olmak', img: 'handshake', bin: 'nezaket' },
  { label: 'Ağız doluyken konuşmamak', img: 'forkplate', bin: 'gorgu' },
  { label: 'Kütüphanede sessiz olmak', img: 'books', bin: 'gorgu' },
  { label: 'Yaşlılara yer vermek', img: 'bus', bin: 'gorgu' },
  { label: 'Yüksek sesle konuşmamak', img: 'shush', bin: 'gorgu' },
]
const KURALYER_P: P[] = [
  ['Kütüphane', 'Sessiz oluruz', 'books'],
  ['Otobüs', 'Yaşlıya yer veririz', 'bus'],
  ['Kantin', 'Sıramızı bekleriz', 'sandwich'],
  ['Sofra', 'Peçete kullanırız', 'forkplate'],
  ['Müze', 'Eserlere dokunmayız', 'classical'],
  ['Sabah evde', '“Günaydın” deriz', 'sunrise'],
]
const NG_Q: Q[] = [
  { q: 'Otobüste yaşlı biri ayakta duruyor. Ne yaparsın?', a: 'Ona yer veririm', w: ['Görmezden gelirim', 'Çantamı koltuğa koyarım', 'Yüksek sesle şarkı söylerim'], ex: 'Yaşlılara ve özel gereksinimli kişilere yer veririz.', img: 'bus' },
  { q: 'Okula giderken komşunu gördün. Ne yaparsın?', a: 'Selam veririm', w: ['Başımı çeviririm', 'Koşup kaçarım', 'Dil çıkarırım'], ex: 'Selamlaşmak nezakettir.', img: 'wave2' },
  { q: 'Kantinde biri önüne geçti. Ne yaparsın?', a: 'Nazikçe sıraya uymasını söylerim', w: ['Onu iterim', 'Bağırırım', 'Ben de öne geçerim'], ex: 'Nazik bir dille uyarırız.', img: 'sandwich' },
  { q: 'Misafirlikte sana ikram edildi. Ne dersin?', a: 'Teşekkür ederim', w: ['Bunu sevmem!', 'Başka ne var?', 'Hiçbir şey demem'], ex: 'İkram edilince teşekkür ederiz.', img: 'cake' },
  { q: 'Ağzın doluyken arkadaşın soru sordu. Ne yaparsın?', a: 'Yutup sonra cevap veririm', w: ['Ağzım doluyken konuşurum', 'Bağırırım', 'Hiç cevap vermem'], ex: 'Ağzımızda yiyecek varken konuşmayız.', img: 'forkplate' },
  { q: 'Kütüphanede arkadaşına bir şey söyleyeceksin. Nasıl söylersin?', a: 'Alçak sesle', w: ['Bağırarak', 'Şarkı söyleyerek', 'Koşarak'], ex: 'Kütüphane, müze ve camide gürültü yapmayız.', img: 'books' },
  { q: 'Yanlışlıkla birine çarptın. Ne dersin?', a: 'Özür dilerim', w: ['Afiyet olsun', 'Günaydın', 'Hoşça kal'], ex: 'Hata yapınca özür dileriz.', img: 'sad' },
]
const NG_TF: TF[] = [
  ['Hatalıysam özür dilerim.', true, 'Özür dilemek nezakettir.'],
  ['Sıramı sabırla beklerim.', true, 'Sıra beklemek herkese saygıdır.'],
  ['Ağzımda yiyecekle konuşurum.', false, 'Önce yutar, sonra konuşuruz.'],
  ['Yemekte çatal, kaşık ve peçete kullanırım.', true, 'Sofra görgü kuralıdır.'],
  ['Sofradan herkesten önce kalkıp giderim.', false, 'Sofraya ailece oturup ailece kalkarız.'],
  ['Müzede yüksek sesle konuşurum.', false, 'Müzede sessiz oluruz.'],
  ['“Lütfen” ve “teşekkür ederim” derim.', true, 'Nezaket sözcükleri ilişkileri güzelleştirir.'],
  ['Nezaket kuralları huzur içinde yaşamamızı sağlar.', true, 'Kurallara uyunca huzurlu yaşarız.'],
]
const NAZIK_HIT = ['Selam vermek', 'Yer vermek', 'Sıra beklemek', 'Özür dilemek', 'Teşekkür etmek', 'Kapıyı tutmak']
const NAZIK_WRONG = ['Öne geçmek', 'Bağırmak', 'Ağız dolu konuşmak', 'İtip kakmak']

/* --- HB.2.3.3 Görevim, Sorumluluğum --- */
const SORUM_P: P[] = [
  ['Su ve elektriği', 'tasarruflu kullanırız', 'droplet'],
  ['Okulda dersleri', 'dikkatle dinleriz', 'ear'],
  ['Odamızı ve eşyalarımızı', 'düzenli tutarız', 'teddy'],
  ['Komşuları rahatsız etmemek için', 'gürültü yapmayız', 'shush'],
  ['Görevlerimizi', 'zamanında yaparız', 'clock'],
  ['Kantin ve markette', 'sıramızı bekleriz', 'cart'],
]
const SORUM_ITEMS: SortQ['items'] = [
  { label: 'Odamı toplamak', img: 'teddy', bin: 'ev' },
  { label: 'Giysilerimi katlamak', img: 'tshirt', bin: 'ev' },
  { label: 'Çiçekleri sulamak', img: 'plantpot', bin: 'ev' },
  { label: 'Sofrayı kurmaya yardım', img: 'forkplate', bin: 'ev' },
  { label: 'Dersi dikkatle dinlemek', img: 'ear', bin: 'okul' },
  { label: 'Okula zamanında gitmek', img: 'school', bin: 'okul' },
  { label: 'Sınıfı temiz tutmak', img: 'broom', bin: 'okul' },
  { label: 'Parkta çöpü kutuya atmak', img: 'wastebasket', bin: 'toplum' },
  { label: 'Markette sıra beklemek', img: 'cart', bin: 'toplum' },
  { label: 'Otobüste yer vermek', img: 'bus', bin: 'toplum' },
]
const SORUM_TF: TF[] = [
  ['Odamı düzenli tutarım.', true, 'Odamızı ve eşyalarımızı düzenli tutarız.'],
  ['Ortak alanları kirli bırakırım.', false, 'Ortak alanları temiz kullanırız.'],
  ['Okula zamanında giderim.', true, 'Zamanında gitmek sorumluluğumuzdur.'],
  ['Yapabildiğim işlerde aileme yardım ederim.', true, 'Evde herkes elinden geleni yapar.'],
  ['Görevlerimi hep yarım bırakırım.', false, 'Görevlerimizi zamanında ve eksiksiz yaparız.'],
  ['Çevremdeki canlıları korurum.', true, 'Canlıları korumak sorumluluğumuzdur.'],
  ['Parkta çöpümü yere atarım.', false, 'Çöpümüzü çöp kutusuna atarız.'],
  ['Kantinde en ön sıraya geçerim.', false, 'Sıramızı bekleriz.'],
]
const SORUM_Q: Q[] = [
  { q: 'Yiğit her pazar apartman bahçesindeki kediyi besliyor. Bu nedir?', a: 'Bir sorumluluk', w: ['Bir oyun kuralı', 'Bir hava olayı', 'Bir trafik levhası'], ex: 'Canlıları korumak bir sorumluluktur.', img: 'cat' },
  { q: 'Asel parkta çöpünü ne yaptı?', a: 'Çöp kutusuna attı', w: ['Yere attı', 'Bankta bıraktı', 'Çimlere sakladı'], ex: 'Ortak alanları temiz kullanırız.', img: 'wastebasket' },
  { q: 'Sınıf, kantin ve park gibi yerlere ne denir?', a: 'Ortak alan', w: ['Kişisel oda', 'Gizli yer', 'Oyuncak kutusu'], ex: 'Ortak alanları hepimiz kullanırız, özenle koruruz.', img: 'houses' },
  { q: 'Görevlerimizi nasıl yaparız?', a: 'Zamanında ve eksiksiz', w: ['Geç ve yarım', 'Hiç yapmadan', 'Başkasına yaptırarak'], ex: 'Görevlerimizi zamanında ve eksiksiz yaparız.', img: 'clock' },
  { q: 'Herkes sorumluluğunu yapınca ne olur?', a: 'Düzen ve huzur olur', w: ['Her yer karışır', 'Herkes üzülür', 'Hiçbir şey değişmez'], ex: 'Sorumluluklar düzen ve huzur getirir.', img: 'happy' },
  { q: 'Hangisi okulda bir sorumluluktur?', a: 'Dersi dikkatle dinlemek', w: ['Koridorda koşmak', 'Sırayı karalamak', 'Derse geç kalmak'], ex: 'Okulda dersleri dikkatle dinleriz.', img: 'school' },
]
const GOREV_MEM: P[] = [
  ['Oyuncak toplamak', 'Oyuncak ayı', undefined, 'teddy'],
  ['Çöpü atmak', 'Çöp kutusu', undefined, 'wastebasket'],
  ['Kediyi beslemek', 'Kedi', undefined, 'cat'],
  ['Işığı kapatmak', 'Ampul', undefined, 'bulb'],
  ['Sıra beklemek', 'Kum saati', undefined, 'hourglass'],
  ['Çiçek sulamak', 'Saksı', undefined, 'plantpot'],
]

/* ================================================================================================
 * 4. ÖĞRENME ALANI · YAŞADIĞIM YER VE ÜLKEM
 * ================================================================================================ */
/* --- HB.2.4.1 Tarihin ve Doğanın İzinde --- */
const YER_ITEMS: SortQ['items'] = [
  { label: 'Kilitbahir Kalesi', img: 'castle', bin: 'tarih' },
  { label: 'Selimiye Camii', img: 'mosque', bin: 'tarih' },
  { label: 'Irgandı Köprüsü', img: 'stone', bin: 'tarih' },
  { label: 'Anadolu Medeniyetleri Müzesi', img: 'classical', bin: 'tarih' },
  { label: 'Aizonai Antik Kenti', img: 'classical', bin: 'tarih' },
  { label: 'Sultan 3. Ahmet Çeşmesi', img: 'fountain', bin: 'tarih' },
  { label: 'Salda Gölü', img: 'water2', bin: 'doga' },
  { label: 'Cilo Dağı', img: 'mountain', bin: 'doga' },
  { label: 'Peribacaları', img: 'rock', bin: 'doga' },
  { label: 'Pamukkale Travertenleri', img: 'droplet', bin: 'doga' },
  { label: 'Düden Şelalesi', img: 'wave', bin: 'doga' },
  { label: 'Kelebekler Vadisi', img: 'butterfly', bin: 'doga' },
]
const SEHIR_P: P[] = [
  ['Peribacaları', 'Nevşehir', 'rock'],
  ['Pamukkale', 'Denizli', 'droplet'],
  ['Salda Gölü', 'Burdur', 'water2'],
  ['Selimiye Camii', 'Edirne', 'mosque'],
  ['Düden Şelalesi', 'Antalya', 'wave'],
  ['Kelebekler Vadisi', 'Muğla', 'butterfly'],
  ['Kilitbahir Kalesi', 'Çanakkale', 'castle'],
  ['Irgandı Köprüsü', 'Bursa', 'stone'],
]
const TUR_MEM: P[] = [
  ['Kale', 'Kilitbahir', 'castle'],
  ['Köprü', 'Irgandı', 'stone'],
  ['Antik kent', 'Aizonai', 'classical'],
  ['Mağara', 'Gökgöl', 'rock'],
  ['Dağ', 'Cilo', 'mountain'],
  ['Göl', 'Salda', 'water2'],
  ['Şelale', 'Düden', 'wave'],
]
const TARIH_Q: Q[] = [
  { q: 'Geçmişte önemli olayların yaşandığı yere ne denir?', a: 'Tarihî mekân', w: ['Doğal güzellik', 'Oyun parkı', 'Otopark'], ex: 'Tarihî mekânların tarihî ve kültürel değeri vardır.', img: 'castle' },
  { q: 'İnsan eli değmeden doğada oluşan güzel yere ne denir?', a: 'Doğal güzellik', w: ['Tarihî mekân', 'Müze', 'Köprü'], ex: 'Doğal güzellikler kendiliğinden oluşur.', img: 'mountain' },
  { q: 'Edirne’deki Selimiye Camii’ni kim yaptı?', a: 'Mimar Sinan', w: ['Ali Kuşçu', 'Vecihi Hürkuş', 'Cahit Arf'], ex: 'Mimar Sinan, Selimiye’ye “ustalık eserim” demiştir.', img: 'mosque' },
  { q: 'Selimiye Camii’nin kaç minaresi vardır?', a: 'Dört', w: ['Bir', 'İki', 'On'], ex: 'Selimiye Camii’nin dört minaresi vardır.', img: 'mosque' },
  { q: 'Kültürel mirasımızı koruyup aktaran yerler hangisidir?', a: 'Müzeler', w: ['Otoparklar', 'Marketler', 'Duraklar'], ex: 'Müzeler kültürel mirasımızı korur.', img: 'classical' },
  { q: 'Kocayayla’daki ata sporları şenliğinde hangisi yapılır?', a: 'Cirit', w: ['Kayak', 'Basketbol', 'Yüzme'], ex: 'Şenlikte güreş, cirit, okçuluk ve atlı sporlar yapılır.', img: 'horse' },
  { q: 'Denizlerimiz ve ormanlarımız nedir?', a: 'Doğal güzelliklerimiz', w: ['Tarihî mekânlarımız', 'Müzelerimiz', 'Köprülerimiz'], ex: 'Denizler ve ormanlar doğal güzelliklerimizdir.', img: 'evergreen' },
  { q: 'Peribacaları hangi şehrimizdedir?', a: 'Nevşehir', w: ['Edirne', 'Burdur', 'Muğla'], ex: 'Peribacaları Nevşehir’dedir.', img: 'rock' },
]
const MUZE_TF: TF[] = [
  ['Müzede eserlere dokunmayız.', true, 'Eserlere zarar vermeyiz.'],
  ['Müzede koşarız.', false, 'Müzede sakin yürürüz.'],
  ['Tarihî mekânları korumalıyız.', true, 'Onlar millî ve manevi değerlerimizdir.'],
  ['Tarihî duvarlara yazı yazarız.', false, 'Tarihî eserlere zarar vermeyiz.'],
  ['Müzeler kültürel mirasımızı korur.', true, 'Müzeler geçmişi geleceğe taşır.'],
  ['Doğal güzelliklere çöp bırakırız.', false, 'Doğayı temiz tutarız.'],
  ['Ülkemiz tarihî mekânlar bakımından zengindir.', true, 'Ülkemizde pek çok tarihî mekân vardır.'],
]

/* --- HB.2.4.2 Yönetim Birimlerini Tanıyorum --- */
const YONET_P: P[] = [
  ['Vali', 'İli yönetir'],
  ['Kaymakam', 'İlçeyi yönetir'],
  ['Muhtar', 'Köyü ya da mahalleyi yönetir'],
  ['Belediye başkanı', 'Belediyeyi yönetir'],
  ['Müdür', 'Okulu yönetir', 'school'],
]
const YONET_Q: Q[] = [
  { q: 'İli kim yönetir?', a: 'Vali', w: ['Muhtar', 'Kaymakam', 'Müdür'], ex: 'İlin en yetkili yöneticisi validir.', img: 'cityscape' },
  { q: 'İlçeyi kim yönetir?', a: 'Kaymakam', w: ['Vali', 'Muhtar', 'Müdür'], ex: 'İlçeyi kaymakam yönetir.', img: 'houses' },
  { q: 'Köyü ve mahalleyi kim yönetir?', a: 'Muhtar', w: ['Vali', 'Kaymakam', 'Müdür'], ex: 'Köy ve mahalleyi muhtar yönetir.', img: 'housegarden' },
  { q: 'Parktaki kırık salıncağı kim onarır?', a: 'Belediye', w: ['Kütüphane', 'Hastane', 'Okul kantini'], ex: 'Parklar, temizlik ve ulaşım belediyenin işidir.', img: 'tools' },
  { q: 'En büyük yerleşim birimi hangisidir?', a: 'İl', w: ['İlçe', 'Mahalle', 'Köy'], ex: 'İl, en büyük yerleşim birimidir.', img: 'cityscape' },
  { q: 'En küçük yerleşim birimleri hangileridir?', a: 'Köy ve mahalle', w: ['İl ve ilçe', 'Yalnızca il', 'Yalnızca ilçe'], ex: 'Köy ve mahalle en küçük yerleşim birimleridir.', img: 'housegarden' },
  { q: 'Sokakların temizliğini hangi kurum yapar?', a: 'Belediye', w: ['Kütüphane', 'Müze', 'Okul'], ex: 'Belediye temizlik ve ulaşım hizmeti verir.', img: 'broom' },
  { q: 'Belediyeler nerelerde bulunur?', a: 'İl ve ilçelerde', w: ['Yalnızca evlerde', 'Okulların içinde', 'Ormanlarda'], ex: 'Belediyeler il ve ilçelerde bulunur.', img: 'cityscape' },
]
const YONET_O: O[] = [
  { q: 'Yerleşim birimlerini büyükten küçüğe sırala.', s: ['İl', 'İlçe', 'Mahalle'], ex: 'İl en büyük, mahalle en küçüktür.', img: 'cityscape' },
  { q: 'Yöneticileri büyük birimden küçüğe sırala.', s: ['Vali', 'Kaymakam', 'Muhtar'], ex: 'Vali ili, kaymakam ilçeyi, muhtar mahalleyi yönetir.', img: 'houses' },
  { q: 'Ankara örneğini büyükten küçüğe sırala.', s: ['Ankara (il)', 'Beypazarı (ilçe)', 'İstiklâl Mahallesi'], ex: 'Mahalle ilçenin, ilçe de ilin içindedir.', img: 'map' },
]
const KAYNAK_HIT = ['Muhtarlık', 'Belediye', 'Kaymakamlık', 'Kitaplar', 'Resmî kurum sitesi']
const KAYNAK_WRONG = ['Reklam', 'Yabancının mesajı', 'Dedikodu', 'Rastgele tahmin']

/* --- HB.2.4.3 Mustafa Kemal Atatürk Nasıl Bir Öğrenciydi? --- */
const ATA_Q: Q[] = [
  { q: 'Mustafa Kemal en çok hangi dersi severdi?', a: 'Matematik', w: ['Resim', 'Müzik', 'Beden eğitimi'], ex: 'Matematik dersine ilgi duydu ve çok başarılı oldu.', img: 'abacus' },
  { q: 'Ona “Kemal” adını kim verdi?', a: 'Matematik öğretmeni', w: ['Annesi', 'Arkadaşı', 'Komşusu'], ex: 'Adı Mustafa olan matematik öğretmeni ona “Kemal” adını verdi.', img: 'teacher' },
  { q: 'Mustafa Kemal nerede doğdu?', a: 'Selanik', w: ['Ankara', 'İzmir', 'Samsun'], ex: 'Mustafa Kemal Selanik’te doğdu.', img: 'map' },
  { q: 'Annesinin adı neydi?', a: 'Zübeyde Hanım', w: ['Ayşe Hanım', 'Fatma Hanım', 'Elif Hanım'], ex: 'Annesi Zübeyde Hanım’dır.', img: 'woman' },
  { q: 'Babasının adı neydi?', a: 'Ali Rıza Bey', w: ['Ahmet Bey', 'Mehmet Bey', 'Hasan Bey'], ex: 'Babası Ali Rıza Bey’dir.', img: 'man' },
  { q: 'Anıtkabir hangi şehrimizdedir?', a: 'Ankara', w: ['Selanik', 'Bursa', 'Edirne'], ex: 'Anıtkabir Ankara’dadır.', img: 'trflag' },
  { q: 'Çocukken parasının yarısını neye verirdi?', a: 'Kitaplara', w: ['Şekerlere', 'Oyuncaklara', 'Hiçbir şeye'], ex: 'Kitap okumayı çok severdi.', img: 'books' },
  { q: 'Bir konuyu anlamayınca ne yapardı?', a: 'Vazgeçmeden çalışırdı', w: ['Hemen bırakırdı', 'Kızıp giderdi', 'Hiç sormazdı'], ex: 'Azimliydi, öğrenene kadar çalışırdı.', img: 'openbook' },
]
const ATA_O: O[] = [
  { q: 'Mustafa Kemal’in okullarını sırala.', s: ['Mahalle Mektebi', 'Şemsi Efendi Okulu', 'Askerî Rüştiye', 'Askerî İdadi', 'Harp Okulu'], ex: 'Mahalle Mektebi ile başladı, Harp Okulu ve Harp Akademisi ile devam etti.', img: 'school' },
  { q: 'Okulları sırala: önce hangisi?', s: ['Mahalle Mektebi', 'Askerî Rüştiye', 'Harp Okulu', 'Harp Akademisi'], ex: 'En son Harp Akademisi’ni bitirdi.', img: 'books' },
]
const ATA_HIT = ['Meraklı', 'Çalışkan', 'Azimli', 'Kitap sever', 'Güvenilir', 'Temiz giyinen']
const ATA_WRONG = ['Tembel', 'Dağınık', 'Sabırsız', 'Çabuk vazgeçen']
const ATA_TF: TF[] = [
  ['Mustafa Kemal matematik dersini çok severdi.', true, 'Matematikte çok başarılıydı.'],
  ['Mustafa Kemal kitap okumayı hiç sevmezdi.', false, 'Kitap okumayı çok severdi.'],
  ['Arkadaşlarıyla iyi ilişkiler kurardı.', true, 'Arkadaşları onu severdi.'],
  ['Anlamadığı konuları hemen bırakırdı.', false, 'Azimle çalışır, öğrenirdi.'],
  ['Düşüncelerini açıkça söylerdi.', true, 'Düşüncelerini açıkça ifade ederdi.'],
  ['Küçükken bile temiz ve düzenli giyinirdi.', true, 'Annesi bunu anlatırdı.'],
  ['Derslerini dikkatle dinlemezdi.', false, 'Derslerini can kulağıyla dinlerdi.'],
]

/* --- HB.2.4.4 Bayramlarımızla Gururluyuz --- */
const BAYRAM_P: P[] = [
  ['23 Nisan', 'Meclis açıldı'],
  ['19 Mayıs', 'Atatürk Samsun’a gitti'],
  ['29 Ekim', 'Cumhuriyet ilan edildi'],
  ['30 Ağustos', 'Millî Mücadele zaferle bitti'],
  ['15 Temmuz', 'Millî birlik günü'],
]
const BAYRAM_AD_MEM: P[] = [
  ['Cumhuriyet Bayramı', '29 Ekim', 'trflag'],
  ['Ulusal Egemenlik ve Çocuk Bayramı', '23 Nisan', 'balloon'],
  ['Gençlik ve Spor Bayramı', '19 Mayıs', 'running'],
  ['Zafer Bayramı', '30 Ağustos', 'medal'],
  ['Demokrasi ve Millî Birlik Günü', '15 Temmuz', 'heart'],
]
const BAYRAM_Q: Q[] = [
  { q: 'Hangi gün Türkiye Büyük Millet Meclisi açıldı?', a: '23 Nisan', w: ['30 Ağustos', '29 Ekim', '19 Mayıs'], ex: '23 Nisan’da Meclis açıldı.', img: 'balloon' },
  { q: 'Atatürk Samsun’a hangi gün gitti?', a: '19 Mayıs', w: ['23 Nisan', '29 Ekim', '30 Ağustos'], ex: '19 Mayıs’ta Samsun’a gidip Millî Mücadele’yi başlattı.', img: 'ship' },
  { q: 'Cumhuriyet hangi gün ilan edildi?', a: '29 Ekim', w: ['19 Mayıs', '23 Nisan', '15 Temmuz'], ex: '29 Ekim’de cumhuriyet ilan edildi.', img: 'trflag' },
  { q: 'Zafer Bayramı hangi gündür?', a: '30 Ağustos', w: ['23 Nisan', '29 Ekim', '19 Mayıs'], ex: '30 Ağustos’ta milletimiz bağımsızlığına kavuştu.', img: 'medal' },
  { q: 'Cumhuriyetle ülkeyi yönetecek kişiler nasıl belirlenir?', a: 'Seçimle', w: ['Kurayla', 'Koşu yarışıyla', 'Yaşa göre'], ex: 'Yöneticilerin seçimle belirlenmesine karar verildi.', img: 'raisedhand' },
  { q: 'Törenlerde şehitlerimiz için ne yapılır?', a: 'Saygı duruşu', w: ['Kahkaha', 'Koşu yarışı', 'Saklambaç'], ex: 'Şehitlerimizi saygı duruşuyla anarız.', img: 'trflag' },
  { q: '15 Temmuz nasıl bir gündür?', a: 'Millî birlik günü', w: ['Dinî bayram', 'Spor bayramı', 'Kar şenliği'], ex: '15 Temmuz Demokrasi ve Millî Birlik Günü’dür.', img: 'heart' },
]
const MILLI_TF: TF[] = [
  ['Millî bayramlarda okulumuzu bayraklarla süsleriz.', true, 'Her yer bayraklarla donatılır.'],
  ['Millî bayramlar kültürel mirasımızdır.', true, 'Geçmişteki kahramanlıkları bugüne taşır.'],
  ['Millî bayramlar birlik ve beraberliği güçlendirir.', true, 'Hep birlikte kutlarız.'],
  ['Millî bayramlarda şehit ve gazilerimizi saygıyla anarız.', true, 'Onlara minnet duyarız.'],
  ['Her millet millî bayramları aynı şekilde kutlar.', false, 'Her milletin kendi millî bayramları vardır.'],
  ['Aşure dağıtmak bir millî bayram etkinliğidir.', false, 'Aşure, Aşure Günü’nde dağıtılır. Bu dinî bir gündür.'],
  ['29 Ekim dinî bir bayramdır.', false, '29 Ekim Cumhuriyet Bayramı’dır, millî bayramdır.'],
  ['15 Temmuz bir millî gündür.', true, '15 Temmuz Demokrasi ve Millî Birlik Günü’dür.'],
]
const KUTLAMA_HIT = ['Fener alayı', 'Bayrak süsleme', 'Saygı duruşu', 'Çelenk koyma', 'Halk oyunları', 'Okul korosu']
const KUTLAMA_WRONG = ['Aşure dağıtma', 'İftar sofrası', 'Kar topu', 'Kandil simidi']
const KUTLAMA_IMG: Record<string, string> = { 'Fener alayı': 'candle', 'Bayrak süsleme': 'trflag', 'Çelenk koyma': 'flower', 'Halk oyunları': 'party', 'Okul korosu': 'music', 'Aşure dağıtma': 'bowl', 'Kar topu': 'snowman' }

/* --- HB.2.4.5 Bayram Gelince --- */
const MILLIDINI_ITEMS: SortQ['items'] = [
  { label: 'Fener alayı', img: 'candle', bin: 'milli' },
  { label: 'Bayrak töreni', img: 'trflag', bin: 'milli' },
  { label: 'Çelenk koyma', img: 'flower', bin: 'milli' },
  { label: 'Sınıf panosunu süsleme', img: 'framed', bin: 'milli' },
  { label: 'Stadyumda gösteri', img: 'running', bin: 'milli' },
  { label: 'Baklava ikramı', img: 'cake', bin: 'dini' },
  { label: 'Büyüklerin elini öpmek', img: 'hug', bin: 'dini' },
  { label: 'Aşure dağıtmak', img: 'bowl', bin: 'dini' },
  { label: 'İftar sofrası', img: 'forkplate', bin: 'dini' },
  { label: 'Bayram harçlığı', img: 'coin', bin: 'dini' },
]
const DINI_Q: Q[] = [
  { q: 'Hangisi dinî bayramımızdır?', a: 'Ramazan Bayramı', w: ['Zafer Bayramı', 'Cumhuriyet Bayramı', 'Gençlik ve Spor Bayramı'], ex: 'Dinî bayramlarımız Ramazan ve Kurban bayramlarıdır.', img: 'crescent' },
  { q: 'Kurban Bayramı nasıl bir bayramdır?', a: 'Dinî bayram', w: ['Millî bayram', 'Spor bayramı', 'Bahar şenliği'], ex: 'Kurban Bayramı dinî bayramdır.', img: 'crescent' },
  { q: 'Aşure Günü’nde ne yapılır?', a: 'Aşure yapılıp komşulara dağıtılır', w: ['Fener alayı yapılır', 'Çelenk konur', 'Uçak gösterisi izlenir'], ex: 'Aşure komşularla paylaşılır.', img: 'bowl' },
  { q: 'Bayramda uzaktaki büyüklerimiz için ne yaparız?', a: 'Telefonla ararız', w: ['Onları unuturuz', 'Onlara küseriz', 'Hiç sormayız'], ex: 'Uzaktaki büyüklerimizi arayıp bayramlarını kutlarız.', img: 'telephone' },
  { q: 'Bayramda küs olanlar ne yapar?', a: 'Barışır', w: ['Küs kalır', 'Kavga eder', 'Saklanır'], ex: 'Bayramlar küsleri barıştırır.', img: 'handshake' },
  { q: 'Ramazan’da iftardan sonra hangi gösteri yapılırdı?', a: 'Karagöz ile Hacivat', w: ['Uçak gösterisi', 'Fener alayı', 'Futbol maçı'], ex: 'Karagöz ile Hacivat gölge oyunu sergilenirdi.', img: 'theater' },
  { q: 'Hangisi bir dinî gecedir?', a: 'Kadir Gecesi', w: ['Cumhuriyet Bayramı', 'Zafer Bayramı', 'Yılbaşı'], ex: 'Kadir Gecesi ve kandiller dinî günlerimizdendir.', img: 'fullmoon' },
  { q: 'Bayramda çocuklara ne verilir?', a: 'Mendil, çorap ya da harçlık', w: ['Ödev', 'Ceza', 'Fatura'], ex: 'Çocuklara küçük hediyeler ya da harçlık verilir.', img: 'gift' },
]
const DINI_HIT = ['Evi temizlemek', 'Ziyarete gitmek', 'El öpmek', 'Baklava ikramı', 'Büyükleri aramak', 'Küsler barışır']
const DINI_WRONG = ['Fener alayı', 'Çelenk koymak', 'Saygı duruşu', 'Uçak gösterisi']

/* ================================================================================================
 * 5. ÖĞRENME ALANI · DOĞA VE ÇEVRE
 * ================================================================================================ */
/* --- HB.2.5.1 Hava Olayları ve Mevsimler --- */
const HAVA_P: P[] = [
  ['Yağmur', 'Su damlaları yağar', 'rain'],
  ['Kar', 'Beyaz, hafif taneler yağar', 'snowflake'],
  ['Dolu', 'Buz parçaları yağar', 'ice'],
  ['Rüzgâr', 'Hava yer değiştirir, eser', 'kite'],
  ['Sis', 'Bulut yere yakın durur', 'cloud'],
  ['Güneşli hava', 'Gökyüzü açık ve aydınlık', 'sun'],
]
const HAVA_Q: Q[] = [
  { q: 'Gökten buz parçaları yağıyor. Bu hangi hava olayı?', a: 'Dolu', w: ['Rüzgâr', 'Sis', 'Güneşli hava'], ex: 'Su damlacıkları inerken donarsa dolu yağar.', img: 'ice' },
  { q: 'Beyaz ve hafif taneler yağıyor. Bu nedir?', a: 'Kar', w: ['Rüzgâr', 'Sis', 'Güneşli hava'], ex: 'Su buharı donunca kar yağar.', img: 'snowflake' },
  { q: 'Sıcak ve soğuk hava yer değiştirince ne oluşur?', a: 'Rüzgâr', w: ['Kar', 'Dolu', 'Gökkuşağı'], ex: 'Rüzgâr, havanın yer değiştirmesiyle oluşan esintidir.', img: 'kite' },
  { q: 'Bulutlardan su damlacıkları düşüyor. Bu nedir?', a: 'Yağmur', w: ['Rüzgâr', 'Güneş', 'Sis'], ex: 'Su buharı soğuyunca yağmur damlaları oluşur.', img: 'rain' },
  { q: 'Su buharı yere yakın yerde bulut gibi duruyor. Bu nedir?', a: 'Sis', w: ['Dolu', 'Kar', 'Güneş'], ex: 'Sisli havada uzağı göremeyiz.', img: 'cloud' },
  { q: 'Kar en çok hangi mevsimde yağar?', a: 'Kış', w: ['Yaz', 'İlkbahar', 'Sonbahar'], ex: 'Kışın havalar soğur, kar yağar.', img: 'snowman' },
  { q: 'Havalar en sıcak hangi mevsimde olur?', a: 'Yaz', w: ['Kış', 'Sonbahar', 'İlkbahar'], ex: 'Yazın havalar güneşli ve sıcaktır.', img: 'sun' },
  { q: 'Ocak hangi mevsimin ayıdır?', a: 'Kış', w: ['Yaz', 'Sonbahar', 'İlkbahar'], ex: 'Kış ayları aralık, ocak ve şubattır.', img: 'calendar' },
  { q: 'Havaların ısınmaya başladığı mevsim hangisidir?', a: 'İlkbahar', w: ['Kış', 'Sonbahar', 'Yaz'], ex: 'İlkbaharda havalar ısınmaya başlar.', img: 'tulip' },
]
const MEVSIM_O: O[] = [
  { q: 'Okul yılının başından mevsimleri sırala.', s: ['Sonbahar', 'Kış', 'İlkbahar', 'Yaz'], ex: 'Okul sonbaharda başlar, yazın biter.', img: 'calendar' },
  { q: 'Sonbahar aylarını sırala.', s: ['Eylül', 'Ekim', 'Kasım'], ex: 'Sonbahar: eylül, ekim, kasım.', img: 'fallenleaf' },
  { q: 'Kış aylarını sırala.', s: ['Aralık', 'Ocak', 'Şubat'], ex: 'Kış: aralık, ocak, şubat.', img: 'snowman' },
  { q: 'İlkbahar aylarını sırala.', s: ['Mart', 'Nisan', 'Mayıs'], ex: 'İlkbahar: mart, nisan, mayıs.', img: 'tulip' },
  { q: 'Yaz aylarını sırala.', s: ['Haziran', 'Temmuz', 'Ağustos'], ex: 'Yaz: haziran, temmuz, ağustos.', img: 'sun' },
]
const AYLAR: SortQ['items'] = [
  { label: 'Eylül', img: 'fallenleaf', bin: 'sonbahar' },
  { label: 'Ekim', img: 'fallenleaf', bin: 'sonbahar' },
  { label: 'Kasım', img: 'fallenleaf', bin: 'sonbahar' },
  { label: 'Aralık', img: 'snowflake', bin: 'kis' },
  { label: 'Ocak', img: 'snowflake', bin: 'kis' },
  { label: 'Şubat', img: 'snowflake', bin: 'kis' },
  { label: 'Mart', img: 'tulip', bin: 'ilkbahar' },
  { label: 'Nisan', img: 'tulip', bin: 'ilkbahar' },
  { label: 'Mayıs', img: 'tulip', bin: 'ilkbahar' },
  { label: 'Haziran', img: 'sun', bin: 'yaz' },
  { label: 'Temmuz', img: 'sun', bin: 'yaz' },
  { label: 'Ağustos', img: 'sun', bin: 'yaz' },
]
const MB = {
  sonbahar: { id: 'sonbahar', label: 'Sonbahar', img: 'fallenleaf', color: '#f59e0b' },
  kis: { id: 'kis', label: 'Kış', img: 'snowman', color: '#3b82f6' },
  ilkbahar: { id: 'ilkbahar', label: 'İlkbahar', img: 'tulip', color: '#22c55e' },
  yaz: { id: 'yaz', label: 'Yaz', img: 'sun', color: '#ef4444' },
}
const ayGen = (bins: (keyof typeof MB)[]) =>
  srt('Ayları mevsimlerine ayır.', 'Her mevsimin üç ayı vardır.', bins.map((b) => MB[b]), AYLAR.filter((a) => bins.includes(a.bin as keyof typeof MB)))
const MEVSIM_TF: TF[] = [
  ['İlkbahar, karın en çok yağdığı mevsimdir.', false, 'Kar en çok kışın yağar.'],
  ['Sonbaharda havalar serinler.', true, 'Sonbaharda sert rüzgârlar da esebilir.'],
  ['Yazın havalar sıcak olur.', true, 'Yaz güneşli ve sıcak bir mevsimdir.'],
  ['Kış ayları eylül, ekim ve kasımdır.', false, 'Kış ayları aralık, ocak ve şubattır.'],
  ['Bir hava olayı birden çok mevsimde görülebilir.', true, 'Yağmur sonbahar, kış ve ilkbaharda görülebilir.'],
  ['Yaz ayları haziran, temmuz ve ağustostur.', true, 'Bunlar yaz aylarıdır.'],
  ['Sonbaharda bulutlu gün sayısı artar.', true, 'Sonbaharda bulutlu ve yağmurlu günler çoğalır.'],
  ['Dolu yalnızca yazın yağar.', false, 'Dolu kışın ve ilkbaharda da görülebilir.'],
]
const SOGUK_HIT = ['Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat']
const SOGUK_WRONG = ['Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos']

/* --- HB.2.5.2 Doğadan Yararlanarak Yön Bulma --- */
const KOL_P: P[] = [
  ['Sağ kolum (Güneş’in doğduğu yer)', 'Doğu'],
  ['Sol kolum', 'Batı'],
  ['Yüzüm', 'Kuzey'],
  ['Sırtım', 'Güney'],
]
const YON_MEM: P[] = [
  ['Kutup Yıldızı', 'Kuzeyi gösterir', 'glowstar'],
  ['Güneş', 'Doğudan doğar', 'sunrise'],
  ['Pusula', 'Yönü hemen gösterir', 'compass'],
  ['Yön oku', 'Dört ana yönü gösterir', 'map'],
  ['Gölge çubuğu', 'Doğu-batı çizgisini bulur', 'sun'],
]
const YON_Q: Q[] = [
  { q: 'Kaç ana yön vardır?', a: 'Dört', w: ['İki', 'Üç', 'Altı'], ex: 'Doğu, batı, kuzey ve güney dört ana yöndür.', img: 'compass' },
  { q: 'Güneş hangi yönden doğar?', a: 'Doğudan', w: ['Batıdan', 'Kuzeyden', 'Güneyden'], ex: 'Güneş doğudan doğar, batıdan batar.', img: 'sunrise' },
  { q: 'Güneş hangi yönden batar?', a: 'Batıdan', w: ['Doğudan', 'Kuzeyden', 'Güneyden'], ex: 'Güneş batıdan batar.', img: 'sun2' },
  { q: 'Kutup Yıldızı hangi yönü gösterir?', a: 'Kuzey', w: ['Güney', 'Doğu', 'Batı'], ex: 'Kutup Yıldızı bulutsuz gecelerde kuzeyi gösterir.', img: 'glowstar' },
  { q: 'Sağ kolunu Güneş’in doğduğu yere uzattın. Yüzün nereye bakar?', a: 'Kuzeye', w: ['Güneye', 'Doğuya', 'Batıya'], ex: 'Sağ kol doğu, sol kol batı, yüz kuzey, sırt güney.', img: 'sunrise' },
  { q: 'Sağ kolun doğuyu gösteriyor. Sırtın hangi yönde?', a: 'Güney', w: ['Kuzey', 'Doğu', 'Batı'], ex: 'Yüzümüz kuzeye bakarken sırtımız güneydedir.', img: 'compass' },
  { q: 'Hangisi yön bulmak için güvenilir bir araçtır?', a: 'Pusula', w: ['Mantar', 'Papatya', 'Kelebek'], ex: 'Pusula yönü güvenle gösterir.', img: 'compass' },
  { q: 'Yosunla ya da karınca yuvasıyla yön bulmak güvenilir mi?', a: 'Hayır, Güneş’i ya da pusulayı kullanırız', w: ['Evet, her zaman doğrudur', 'Evet, en iyi yol budur', 'Evet, gece bile olur'], ex: 'Bunlar güvenilir değil. Güneş, Kutup Yıldızı ve pusula daha güvenilirdir.', img: 'magnifier' },
]
const YON_HIT = ['Güneş', 'Kutup Yıldızı', 'Pusula', 'Yön oku', 'Gölge çubuğu']
const YON_WRONG = ['Mantar', 'Papatya', 'Kelebek', 'Kuş', 'Bulut']
const YON_IMG: Record<string, string> = { Güneş: 'sun', 'Kutup Yıldızı': 'glowstar', Pusula: 'compass', 'Yön oku': 'map', Mantar: 'mushroom', Papatya: 'flower', Kelebek: 'butterfly', Kuş: 'bird', Bulut: 'cloud' }
const GOLGE_O: O[] = [
  { q: 'Gölge çubuğuyla yön bulmayı sırala.', s: ['Toprağa çubuğu dik', 'Gölgenin ucunu işaretle', 'Biraz bekle', 'Gölgenin yeni ucunu işaretle', 'İki işareti çizgiyle birleştir'], ex: 'Bu çizgi doğu-batı yönünü gösterir.', img: 'sun' },
  { q: 'Güneş’le yön bulmayı sırala.', s: ['Güneş’in doğduğu yeri bul', 'Sağ kolunu o yöne uzat', 'Sol kolun batıyı gösterir', 'Yüzün kuzeye bakar'], ex: 'Sağ kol doğu, sol kol batı, yüz kuzey.', img: 'sunrise' },
]
const YON_TF: TF[] = [
  ['Dört ana yön doğu, batı, kuzey ve güneydir.', true, 'Bunlar dört ana yöndür.'],
  ['Güneş batıdan doğar.', false, 'Güneş doğudan doğar.'],
  ['Kutup Yıldızı kuzeyi gösterir.', true, 'Bulutsuz gecelerde onu kolayca görürüz.'],
  ['Pusula yön bulmamıza yardım eder.', true, 'Pusula güvenilir bir araçtır.'],
  ['Yosun ve karınca yuvası her zaman doğru yönü gösterir.', false, 'Bunlar güvenilir değil. Güneş’i ya da pusulayı kullanırız.'],
  ['Güneş’in yerine göre gölgenin yönü değişir.', true, 'Gölge gün içinde yer değiştirir.'],
  ['Yön oku ana yönleri gösterir.', true, 'Haritalarda yön oku bulunur.'],
  ['Kutup Yıldızı’nı en iyi bulutlu gecede görürüz.', false, 'Onu bulutsuz gecelerde görürüz.'],
]

/* --- HB.2.5.3 Afetlere Karşı Alınacak Önlemler --- */
const AFET_P: P[] = [
  ['Karlı havada yol haberlerini dinlemek', 'Çığ', 'snowflake'],
  ['Evin sağlamlığını kontrol ettirmek', 'Deprem', 'house'],
  ['Evi dere yatağına yapmamak', 'Sel', 'water2'],
  ['Ormanda ateş yakmamak', 'Orman yangını', 'evergreen'],
  ['Evi kayma tehlikesi olmayan yere yapmak', 'Heyelan', 'mountain'],
]
const CANTA_HIT = ['Su', 'Konserve yiyecek', 'İlk yardım çantası', 'Kimlik kartı', 'El feneri', 'Düdük', 'Radyo', 'Giysi']
const CANTA_WRONG = ['Oyun konsolu', 'Oyuncak araba', 'Büyük vazo', 'Saksı çiçeği']
const CANTA_IMG: Record<string, string> = { Su: 'droplet', 'Konserve yiyecek': 'can', 'İlk yardım çantası': 'bandage', 'El feneri': 'bulb2', Radyo: 'radio', Giysi: 'tshirt', 'Oyun konsolu': 'videogame', 'Oyuncak araba': 'racecar', 'Saksı çiçeği': 'plantpot' }
const AFET_Q: Q[] = [
  { q: 'Afetlere hazırlıklı olursak ne olur?', a: 'Zararı azaltır, güvende kalırız', w: ['Hiçbir şey değişmez', 'Daha çok zarar görürüz', 'Hiçbir işe yaramaz'], ex: 'Önlem almak bizi korur.', img: 'shield' },
  { q: 'Deprem için evde hangi önlemi alırız?', a: 'Dolapları duvara sabitleriz', w: ['Vazoları rafın ucuna dizeriz', 'Çantayı saklarız', 'Ağır eşyaları dolabın üstüne koyarız'], ex: 'Devrilebilecek eşyaları sabitleriz.', img: 'tools' },
  { q: 'Afet ve acil durum çantası ne sıklıkla yenilenir?', a: 'Altı ayda bir', w: ['Hiçbir zaman', 'Her saat', 'Hiç açılmaz'], ex: 'Çanta altı ayda bir güncellenir.', img: 'backpack' },
  { q: 'Afet çantasını nereye koyarız?', a: 'Kolay ulaşılacak bir yere', w: ['Ulaşamayacağımız bir yere', 'Kilitli bir sandığa', 'Komşunun evine'], ex: 'Çanta kolay ulaşılabilecek bir yerde durur.', img: 'backpack' },
  { q: 'Tatbikat nedir?', a: 'Acil durum için yapılan prova', w: ['Bir yemek türü', 'Bir oyuncak', 'Bir hava olayı'], ex: 'Tatbikatta ne yapacağımızı önceden çalışırız.', img: 'school' },
  { q: 'Sel için hangi önlemi alırız?', a: 'Dere yatağına ev yapmayız', w: ['Evi dere yatağına yaparız', 'Uyarıları dinlemeyiz', 'Yağmurda dereye gideriz'], ex: 'Sel uyarılarını radyo ve televizyondan takip ederiz.', img: 'water2' },
  { q: 'Ormanda ne yapmayız?', a: 'Ateş yakmayız', w: ['Yürüyüş yaparız', 'Kuşları izleriz', 'Fidan dikeriz'], ex: 'Ormanda ateş yakmayız, cam ve çöp bırakmayız.', img: 'evergreen' },
  { q: 'Tatbikatta biraz endişelenmek normal mi?', a: 'Evet, normaldir', w: ['Hayır, asla', 'Hayır, yasaktır', 'Hayır, ayıptır'], ex: 'Endişelenmek normaldir. Hazırlıklı olunca güvende hissederiz.', img: 'hug' },
  { q: 'Toplanma alanı ne işe yarar?', a: 'Ailece güvenle buluşmaya', w: ['Top oynamaya', 'Alışveriş yapmaya', 'Piknik yapmaya'], ex: 'Afetten sonra toplanma alanında buluşuruz.', img: 'houses' },
]
const AFET_TF: TF[] = [
  ['Afet çantasını ulaşamayacağımız yerde saklarız.', false, 'Çantayı kolay ulaşılacak yere koyarız.'],
  ['Ailece afet ve acil durum planı hazırlarız.', true, 'Plan, ne yapacağımızı bilmemizi sağlar.'],
  ['Devrilebilecek eşyaları dolabın üstüne koyarız.', false, 'Onları sabitler ya da aşağı alırız.'],
  ['Devrilebilecek eşyaları sabitleriz.', true, 'Böylece eşyalar devrilmez.'],
  ['Evcil hayvanlarımızı da plana katarız.', true, 'Onlar da ailemizin parçasıdır.'],
  ['Acil durum numarası 112’dir.', true, 'Acil durumda 112 aranır.'],
  ['Tatbikatta sakin ve sırayla hareket ederiz.', true, 'Sakin olmak herkesi güvende tutar.'],
  ['Deprem anında çök, kapan, tutun (AFAD önerisi).', true, 'AFAD önerisi: çök, kapan, tutun ve sakin kal.'],
]
const TEHLIKE_HIT = ['Sabitsiz dolap', 'Raftaki vazo', 'Uzun kitaplık', 'Asılı ayna', 'Üstteki saksı']
const TEHLIKE_WRONG = ['Halı', 'Yastık', 'Terlik', 'Pelüş oyuncak']
const AFET_O: O[] = [
  { q: 'Tehlike avının adımlarını sırala.', s: ['Tehlikeli eşyayı bul', 'Nasıl tehlikeli olduğunu düşün', 'Eşyayı sabitle ya da kaldır'], ex: 'Bul, düşün, çöz!', img: 'magnifier' },
  { q: 'Okul tatbikatını sırala.', s: ['Uyarı sesini duy', 'Çök, kapan, tutun (AFAD önerisi)', 'Sakin ve sırayla çık', 'Toplanma alanında bekle'], ex: 'AFAD önerisi: önce çök, kapan, tutun; sonra sırayla çıkarız.', img: 'bell' },
]

/* --- HB.2.5.4 Tasarruf Bizim İşimiz --- */
const KAYNAK_P: P[] = [
  ['Lambayı kapatmak', 'Elektrik', 'bulb'],
  ['Musluğu kapatmak', 'Su', 'droplet'],
  ['Kâğıdı az kullanmak', 'Orman', 'evergreen'],
  ['Metal kutuyu geri dönüştürmek', 'Maden', 'can'],
  ['Çevreyi temiz tutmak', 'Toprak', 'seedling'],
]
const ISRAF_HIT = ['Boşa yanan lamba', 'Akan musluk', 'Açık pencere', 'Atılan yemek', 'Boşa giden kâğıt', 'Açık buzdolabı']
const ISRAF_WRONG = ['Kapalı musluk', 'Sönük lamba', 'Kapalı TV', 'Geri dönüşüm']
const ISRAF_IMG: Record<string, string> = { 'Boşa yanan lamba': 'bulb', 'Akan musluk': 'droplet', 'Atılan yemek': 'trash', 'Boşa giden kâğıt': 'memo', 'Kapalı TV': 'television', 'Geri dönüşüm': 'recycle' }
const TASARRUF_TF: TF[] = [
  ['Diş fırçalarken musluğu kapatırız.', true, 'İhtiyacımız kadar su kullanırız.'],
  ['Buzdolabının kapağını uzun süre açık bırakırız.', false, 'Kapağı hemen kapatırız, enerji boşa gitmez.'],
  ['Doğal kaynaklar hiç bitmez.', false, 'Doğal kaynaklar sınırsız değildir, tükenebilir.'],
  ['İşimiz bitince televizyonu kapatırız.', true, 'Böylece elektrik tasarrufu yaparız.'],
  ['Yakın yere yürüyerek gitmek doğaya iyi gelir.', true, 'Doğadaki ayak izimiz küçülür.'],
  ['Yemeğimizi israf etmeyiz.', true, 'Tabağımıza yiyebileceğimiz kadar alırız.'],
  ['Sızdıran musluğu görmezden geliriz.', false, 'Tamir edilmesini ailemize hatırlatırız.'],
  ['Kâğıdın iki yüzünü de kullanabiliriz.', true, 'Kâğıt tasarrufu ormanları korur.'],
]
const TASARRUF_Q: Q[] = [
  { q: 'Hangisi doğal bir kaynaktır?', a: 'Su', w: ['Oyuncak', 'Tablet', 'Plastik top'], ex: 'Su, orman, toprak ve madenler doğal kaynaklardır.', img: 'droplet' },
  { q: 'Odadan çıkarken ne yaparız?', a: 'Işığı kapatırız', w: ['Işığı açık bırakırız', 'Musluğu açarız', 'Televizyonu açarız'], ex: 'Gereksiz yanan lambaları kapatırız.', img: 'bulb' },
  { q: 'Musluk damlatıyor. Ne yaparız?', a: 'Tamir edilmesini ailemize hatırlatırız', w: ['Görmezden geliriz', 'Musluğu daha çok açarız', 'Suyla oynarız'], ex: 'Damlayan musluk çok su harcar.', img: 'droplet' },
  { q: 'Doğadaki ayak izimizi nasıl küçültürüz?', a: 'Yakın yere yürüyerek gideriz', w: ['Her yere arabayla gideriz', 'Işıkları açık bırakırız', 'Yemeği çöpe atarız'], ex: 'Kaynakları az kullanınca ayak izimiz küçülür.', img: 'walking' },
  { q: 'Tasarruf neyi önler?', a: 'İsrafı', w: ['Oyunu', 'Uykuyu', 'Gülmeyi'], ex: 'Tasarruf israfı önler, kaynakları korur.', img: 'recycle' },
  { q: 'Metal kutuları geri dönüşüme atınca neyi koruruz?', a: 'Madenleri', w: ['Bulutları', 'Yıldızları', 'Rüzgârı'], ex: 'Geri dönüşüm madenleri ve ormanları korur.', img: 'can' },
  { q: 'Kalorifer yanarken pencere açık kalırsa ne olur?', a: 'Enerji boşa gider', w: ['Su tasarrufu olur', 'Elektrik birikir', 'Kaynaklar artar'], ex: 'Pencereyi kapalı tutarız, enerji boşa gitmez.', img: 'thermometer' },
]
const TASARRUF_ITEMS: SortQ['items'] = [
  { label: 'Işığı kapatmak', img: 'bulb', bin: 'tasarruf' },
  { label: 'Musluğu kapatmak', img: 'droplet', bin: 'tasarruf' },
  { label: 'Fişi çekmek', img: 'plug', bin: 'tasarruf' },
  { label: 'Kâğıdın iki yüzünü kullanmak', img: 'memo', bin: 'tasarruf' },
  { label: 'Yemeği bitirmek', img: 'forkplate', bin: 'tasarruf' },
  { label: 'Boş odada yanan ışık', img: 'bulb2', bin: 'israf' },
  { label: 'Akıp duran musluk', img: 'water2', bin: 'israf' },
  { label: 'Açık kalan buzdolabı', img: 'ice', bin: 'israf' },
  { label: 'Yarım yemeği atmak', img: 'trash', bin: 'israf' },
  { label: 'Kimse izlemeyen açık TV', img: 'television', bin: 'israf' },
]

/* ================================================================================================
 * 6. ÖĞRENME ALANI · BİLİM, TEKNOLOJİ VE SANAT
 * ================================================================================================ */
/* --- HB.2.6.1 Bilim İnsanları İyi ki Var --- */
const BILIM_P: P[] = [
  ['Ali Kuşçu', 'Güneş saati', 'sun'],
  ['El-Cezerî', 'Su makineleri ve robotlar', 'robot'],
  ['Vecihi Hürkuş', 'İlk yerli uçak', 'airplane'],
  ['Alper Gezeravcı', 'İlk Türk astronot', 'rocket'],
  ['Jale İnan', 'İlk kadın arkeoloğumuz', 'classical'],
  ['Cahit Arf', 'Ünlü matematikçi', 'abacus'],
  ['Engin Arık', 'Temiz enerji çalışmaları', 'bulb'],
]
const DUNYA_P: P[] = [
  ['Albert Einstein', 'Fizik çalışmaları', 'scientist'],
  ['Thomas Edison', 'Akkor lamba', 'bulb'],
  ['Graham Bell', 'Telefon', 'telephone'],
  ['Marie Curie', 'İki kez Nobel ödülü', 'medal'],
  ['Ali Kuşçu', 'Güneş saati', 'sun'],
]
const BILIM_Q: Q[] = [
  { q: 'Güneş saatini kim icat etti?', a: 'Ali Kuşçu', w: ['Thomas Edison', 'Graham Bell', 'Cahit Arf'], ex: 'Ali Kuşçu gök cisimlerini araştırdı, güneş saatini icat etti.', img: 'sun' },
  { q: 'Telefonu kim icat etti?', a: 'Graham Bell', w: ['Ali Kuşçu', 'Thomas Edison', 'Vecihi Hürkuş'], ex: 'Telefonu Alexander Graham Bell icat etti.', img: 'telephone' },
  { q: 'Akkor lambayı kim icat etti?', a: 'Thomas Edison', w: ['Graham Bell', 'Albert Einstein', 'Ali Kuşçu'], ex: 'Edison’un akkor lamba gibi pek çok icadı vardır.', img: 'bulb' },
  { q: 'Türkiye’nin ilk yerli uçağını kim yaptı?', a: 'Vecihi Hürkuş', w: ['Alper Gezeravcı', 'Uluğ Bey', 'Fuat Sezgin'], ex: 'Vecihi Hürkuş ilk uçuşunu İzmir’de yaptı.', img: 'airplane' },
  { q: 'Uzaya giden ilk Türk astronot kimdir?', a: 'Alper Gezeravcı', w: ['Vecihi Hürkuş', 'Halil İnalcık', 'El-Cezerî'], ex: 'Alper Gezeravcı uzaya giden ilk Türk astronottur.', img: 'rocket' },
  { q: 'İlk kadın arkeoloğumuz kimdir?', a: 'Jale İnan', w: ['Cahit Arf', 'Engin Arık', 'Uluğ Bey'], ex: 'Jale İnan ilk kadın arkeoloğumuzdur.', img: 'classical' },
  { q: 'Su makineleri ve robotlar yapan bilim insanı kimdir?', a: 'El-Cezerî', w: ['İlber Ortaylı', 'Halil İnalcık', 'Jale İnan'], ex: 'El-Cezerî su makineleri, robotlar ve saatler yaptı.', img: 'robot' },
  { q: 'Uluğ Bey hangi alanlarda ünlüdür?', a: 'Matematik ve gök bilimi', w: ['Aşçılık', 'Futbol', 'Terzilik'], ex: 'Uluğ Bey ünlü bir matematikçi ve gök bilimcidir.', img: 'telescope' },
  { q: 'Aziz Sancar başarısını neye bağladı?', a: 'Çok çalışmaya ve azme', w: ['Şansa', 'Hiç çalışmamaya', 'Tembelliğe'], ex: 'Nobel ödüllü Aziz Sancar çalışmanın ve azmin önemini anlattı.', img: 'medal' },
  { q: 'Halil İnalcık ve İlber Ortaylı hangi alanda çalıştı?', a: 'Tarih', w: ['Uzay', 'Müzik', 'Spor'], ex: 'İkisi de tarih alanında araştırmalar yaptı.', img: 'scroll' },
]
const ALAN_ITEMS: SortQ['items'] = [
  { label: 'Ali Kuşçu', img: 'telescope', bin: 'gok' },
  { label: 'Uluğ Bey', img: 'telescope', bin: 'gok' },
  { label: 'Alper Gezeravcı', img: 'rocket', bin: 'gok' },
  { label: 'El-Cezerî', img: 'gear', bin: 'icat' },
  { label: 'Vecihi Hürkuş', img: 'airplane', bin: 'icat' },
  { label: 'Thomas Edison', img: 'bulb', bin: 'icat' },
  { label: 'Graham Bell', img: 'telephone', bin: 'icat' },
  { label: 'Halil İnalcık', img: 'scroll', bin: 'tarih' },
  { label: 'İlber Ortaylı', img: 'scroll', bin: 'tarih' },
  { label: 'Afet İnan', img: 'scroll', bin: 'tarih' },
  { label: 'Fuat Sezgin', img: 'scroll', bin: 'tarih' },
]
const OZELLIK_HIT = ['Meraklı', 'Azimli', 'Planlı', 'Soru sorar', 'Çalışkan', 'Kendine güvenir']
const OZELLIK_WRONG = ['Hemen vazgeçer', 'Soru sormaz', 'Tembel', 'Sabırsız']
const MERAK_P: P[] = [
  ['En küçük kuş hangisi?', 'Arı sinek kuşu', 'bird'],
  ['İlk yerli uçağı kim yaptı?', 'Vecihi Hürkuş', 'airplane'],
  ['Kutup ayısı neden üşümez?', 'Kılları hava doludur', 'snowflake'],
  ['Telefonu kim icat etti?', 'Graham Bell', 'telephone'],
  ['Güneş saatini kim icat etti?', 'Ali Kuşçu', 'sun'],
]
const ARASTIRMA_O: O[] = [
  { q: 'Araştırma yapmayı sırala.', s: ['Konuyu belirle', 'Bilgi kaynağını bul', 'Başka kaynakla karşılaştır', 'Not al', 'Kaynağın adını yaz'], ex: 'Bilgiyi kontrol eder, kaynağını yazarız.', img: 'magnifier' },
  { q: 'Bir bilim insanı gibi çalışmayı sırala.', s: ['Merak et, soru sor', 'Araştır', 'Dene ve gözle', 'Sonucu paylaş'], ex: 'Bilim merakla başlar.', img: 'scientist' },
]
const KAYNAK_Q: Q[] = [
  { q: 'Hangisi güvenilir bir bilgi kaynağıdır?', a: 'Ansiklopedi', w: ['Tanımadığın birinin mesajı', 'Bir reklam', 'Bir söylenti'], ex: 'Ansiklopedi, kitap ve dergiler güvenilir kaynaklardır.', img: 'books' },
  { q: 'Sağlıkla ilgili bir soruyu kime sorarız?', a: 'Doktora', w: ['Pastacıya', 'Şoföre', 'Bahçıvana'], ex: 'Alanında uzman kişilere sorarız.', img: 'doctor' },
  { q: 'Genel ağda hangi siteleri kullanırız?', a: 'Resmî kurum sitelerini', w: ['Reklam sayfalarını', 'Tanımadığımız sohbetleri', 'Ödül vaat eden siteleri'], ex: 'Resmî kurum siteleri güvenilirdir.', img: 'laptop' },
  { q: 'Bilgiyi neden başka kaynakla karşılaştırırız?', a: 'Doğru olduğundan emin olmak için', w: ['Vakit geçirmek için', 'Kaynağı karalamak için', 'Sayfayı süslemek için'], ex: 'Bilgiyi kontrol etmek önemlidir.', img: 'magnifier' },
  { q: 'Kütüphanede bilgi nereden bulunur?', a: 'Kitaplardan', w: ['Pencereden', 'Sandalyeden', 'Kapıdan'], ex: 'Okul kütüphanesi iyi bir bilgi kaynağıdır.', img: 'books' },
  { q: 'Bilgiyi not alırken neyi de yazarız?', a: 'Kaynağın adını', w: ['Hava durumunu', 'En sevdiğimiz rengi', 'Hiçbir şeyi'], ex: 'Bilgiyi nereden aldığımızı yazarız.', img: 'memo' },
]

/* --- HB.2.6.2 Eskisi, Yenisi --- */
const BILMECE_Q: Q[] = [
  { q: 'Kapağı açılır, içinde kek kabarır. Bu ne?', a: 'Fırın', w: ['Mikser', 'Kulaklık', 'Telefon'], ex: 'Fırında kek pişer.', img: 'cake' },
  { q: 'Döner, çırpar, karıştırır. Bu ne?', a: 'Mikser', w: ['Fırın', 'Kulaklık', 'Telefon'], ex: 'Mikser yumurtayı çırpar.', img: 'egg' },
  { q: 'Uzağı yakın eder, ses ve mesaj taşır. Bu ne?', a: 'Telefon', w: ['Fırın', 'Mikser', 'Kulaklık'], ex: 'Telefonla uzaktakilerle konuşuruz.', img: 'phone' },
  { q: 'Kulağına müzik ya da ders sesi getirir. Bu ne?', a: 'Kulaklık', w: ['Fırın', 'Mikser', 'Telefon'], ex: 'Kulaklıkla sesi yalnızca biz duyarız.', img: 'headphone' },
  { q: 'Döner döner, kirli giysileri yıkar. Bu ne?', a: 'Çamaşır makinesi', w: ['Fırın', 'Mikser', 'Kulaklık'], ex: 'Çamaşır makinesi giysilerimizi yıkar.', img: 'tshirt' },
  { q: 'Yerdeki tozları içine çeker. Bu ne?', a: 'Elektrikli süpürge', w: ['Fırın', 'Kulaklık', 'Telefon'], ex: 'Süpürge evi temizlememize yardım eder.', img: 'broom' },
]
const ESKI_P: P[] = [
  ['Mektup', 'Akıllı telefon'],
  ['Tüplü televizyon', 'Düz ekran televizyon', 'television'],
  ['Kablolu süpürge', 'Kablosuz süpürge'],
  ['Leğende yıkamak', 'Çamaşır makinesi'],
  ['Gaz lambası', 'Elektrikli ampul', 'candle', 'bulb'],
  ['Daktilo', 'Bilgisayar', undefined, 'laptop'],
]
const DEGISIM_ITEMS: SortQ['items'] = [
  { label: 'Ekranı büyüdü', bin: 'degisen' },
  { label: 'Rengi değişti', img: 'palette', bin: 'degisen' },
  { label: 'Kablosu kalktı', img: 'plug', bin: 'degisen' },
  { label: 'Dokunmatik oldu', img: 'hand', bin: 'degisen' },
  { label: 'Daha hafif oldu', bin: 'degisen' },
  { label: 'Hâlâ çamaşır yıkıyor', img: 'tshirt', bin: 'ayni' },
  { label: 'Hâlâ konuşmamızı sağlıyor', img: 'telephone', bin: 'ayni' },
  { label: 'Hâlâ toz çekiyor', img: 'broom', bin: 'ayni' },
  { label: 'Hâlâ yemek pişiriyor', img: 'cook', bin: 'ayni' },
]
const ZAMAN_ITEMS: SortQ['items'] = [
  { label: 'Mektup', img: 'scroll', bin: 'gecmis' },
  { label: 'Tüplü televizyon', bin: 'gecmis' },
  { label: 'Gaz lambası', img: 'candle', bin: 'gecmis' },
  { label: 'Daktilo', bin: 'gecmis' },
  { label: 'Akıllı telefon', img: 'phone', bin: 'bugun' },
  { label: 'Tablet', img: 'laptop', bin: 'bugun' },
  { label: 'Robot süpürge', img: 'robot', bin: 'bugun' },
  { label: 'Düz ekran televizyon', img: 'television', bin: 'bugun' },
]
const TEKNO_Q: Q[] = [
  { q: 'Bir ürünün görünüşünün değişmesine ne denir?', a: 'Değişim', w: ['Süreklilik', 'Tasarruf', 'Tatbikat'], ex: 'Dış görünüş değişirse buna değişim deriz.', img: 'sparkles' },
  { q: 'Bir ürünün işinin aynı kalmasına ne denir?', a: 'Süreklilik', w: ['Değişim', 'Tasarruf', 'Tatbikat'], ex: 'Çamaşır makinesi hâlâ çamaşır yıkar: bu sürekliliktir.', img: 'gear' },
  { q: 'Teknolojik ürünlerin gelişmesinin temelinde ne vardır?', a: 'İhtiyaç ve merak', w: ['Uyku', 'Tembellik', 'Şans'], ex: '“Daha iyisi olabilir mi?” merakı teknolojiyi geliştirir.', img: 'bulb2' },
  { q: 'Geçmişte uzaktakilerle nasıl haberleşilirdi?', a: 'Mektupla', w: ['Tabletle', 'Akıllı telefonla', 'Görüntülü aramayla'], ex: 'Eskiden mektup yazılırdı, bugün saniyeler içinde haberleşiriz.', img: 'scroll' },
  { q: 'Teknoloji işlerimizi nasıl yapmamızı sağlar?', a: 'Daha kısa sürede ve kolayca', w: ['Daha yavaş', 'Daha zor', 'Hiç yapmadan'], ex: 'Teknoloji işlerimizi kolaylaştırır.', img: 'gear' },
  { q: 'Süpürgeler kablosuz oldu. Gelecekte nasıl olabilir?', a: 'Kendi kendine temizleyebilir', w: ['Yeniden kömürle çalışır', 'Hiç toz çekmez', 'Taştan yapılır'], ex: 'Bugünkü gelişmelere bakarak geleceği tahmin ederiz.', img: 'robot' },
  { q: 'Eski eşyaları nerede görebiliriz?', a: 'Müzelerde', w: ['Bulutlarda', 'Denizin dibinde', 'Uzayda'], ex: 'Müzelerde, kitaplarda ve büyüklerimizin evlerinde görürüz.', img: 'classical' },
]
const ESKI_O: O[] = [
  { q: 'Telefonları eskiden yeniye sırala.', s: ['Kablolu ev telefonu', 'Tuşlu cep telefonu', 'Akıllı telefon'], ex: 'Telefonun görünüşü değişti ama hâlâ konuşmamızı sağlar.', img: 'telephone' },
  { q: 'Aydınlanmayı eskiden yeniye sırala.', s: ['Mum', 'Gaz lambası', 'Elektrikli ampul'], ex: 'Hepsi aydınlatır: işi aynı, görünüşü farklı.', img: 'bulb' },
  { q: 'Haberleşmeyi eskiden yeniye sırala.', s: ['Mektup', 'Ev telefonu', 'Akıllı telefon'], ex: 'İhtiyaçlar değiştikçe teknoloji gelişir.', img: 'phone' },
]

/* --- HB.2.6.3 Hayat Sanatla Güzel --- */
const SANAT_P: P[] = [
  ['Ebru', 'Eşarp ve kitap kenarı', 'paint'],
  ['İznik çinisi', 'Fincan ve cami duvarı', 'plate'],
  ['Darbuka', 'Düğün ve kına gecesi', 'drum'],
  ['Karagöz ile Hacivat', 'Gölge oyunu', 'theater'],
  ['Kilim', 'Çiçek ve ağaç motifleri', 'flower'],
  ['Âşık Veysel', 'Saz ve türküler', 'guitar'],
]
const FAYDA_HIT = ['Mutlu eder', 'Dinlendirir', 'Bir araya getirir', 'Yaratıcı yapar', 'Farkındalık verir']
const FAYDA_WRONG = ['Kavga çıkarır', 'Uykusuz bırakır', 'Canımızı sıkar', 'Hasta eder']
const DAL_HIT = ['Resim', 'Müzik', 'Tiyatro', 'Ebru', 'Kukla', 'Çini', 'Halk dansı', 'Sinema']
const DAL_WRONG = ['Diş fırçalama', 'Uyumak', 'Bulaşık yıkama', 'Alışveriş']
const DAL_IMG: Record<string, string> = { Resim: 'palette', Müzik: 'music', Tiyatro: 'theater', Ebru: 'paint', Çini: 'plate', 'Halk dansı': 'party', Sinema: 'camera', 'Diş fırçalama': 'toothbrush', Uyumak: 'bed', 'Bulaşık yıkama': 'sponge', Alışveriş: 'cart' }
const SANAT_Q: Q[] = [
  { q: 'Kilimdeki tek bir şekle ne denir?', a: 'Motif', w: ['Desen', 'Ebru', 'Darbuka'], ex: 'Tek şekil motiftir. Motifler birleşince desen olur.', img: 'flower' },
  { q: 'Motiflerin birleşmesine ne denir?', a: 'Desen', w: ['Motif', 'Kukla', 'Saz'], ex: 'Motifler yan yana gelince desen oluşur.', img: 'sparkles' },
  { q: 'Ebru nasıl bir sanattır?', a: 'Kâğıt boyama sanatı', w: ['Taş oyma sanatı', 'Dans sanatı', 'Yemek sanatı'], ex: 'Yoğun bir sıvıya damlayan renkler kâğıda desen olur.', img: 'paint' },
  { q: 'Sultan Ahmet Camii’ne neden Mavi Cami denir?', a: 'Mavi çinileri yüzünden', w: ['Mavi kapısı yüzünden', 'Denizin içinde olduğu için', 'Gökyüzünde olduğu için'], ex: 'İznik çinilerine vuran güneş mavi bir yansıma yapar.', img: 'mosque' },
  { q: 'Sinema nasıl başladı?', a: 'Siyah beyaz filmlerle', w: ['Üç boyutlu gözlükle', 'Radyoyla', 'Kuklayla'], ex: 'Bugün üç boyutlu gözlükle film bile izleriz.', img: 'camera' },
  { q: 'Darbuka nasıl bir çalgıdır?', a: 'Vurmalı çalgı', w: ['Telli çalgı', 'Üflemeli çalgı', 'Tuşlu çalgı'], ex: 'Darbukaya elle vurarak çalarız.', img: 'drum' },
  { q: 'Sanat nedir?', a: 'Duygu ve düşünceleri anlatmanın yolu', w: ['Bir hava olayı', 'Bir trafik kuralı', 'Bir yön bulma aracı'], ex: 'Söz, yazı, resim ve müzikle duygularımızı anlatırız.', img: 'palette' },
  { q: 'Âşık Veysel türkülerini hangi çalgıyla söylerdi?', a: 'Saz', w: ['Piyano', 'Davul', 'Flüt'], ex: 'Âşık Veysel’in sazıyla söylediği türküler bugüne ulaştı.', img: 'guitar' },
]
const SANAT_TF: TF[] = [
  ['Sanat insanları bir araya getirir.', true, 'Konser ve sinema insanları buluşturur.'],
  ['Müzik dinlemek bizi dinlendirebilir.', true, 'Müzik ruhumuzu dinlendirir.'],
  ['Kilimler atalarımızın kültürünü bugüne taşır.', true, 'Kilimler değerli bir mirastır.'],
  ['Gölge oyunu yeni icat edilmiştir.', false, 'Karagöz ile Hacivat eskiden beri oynanır.'],
  ['İznik desenleri bugün fincanlarda da görülür.', true, 'Geçmişin sanatı bugün de yaşar.'],
  ['Sanat yalnızca müzelerde olur.', false, 'Kuş sesinde, damlanın deseninde bile sanat vardır.'],
  ['Ebruda renkler yoğun bir sıvıya damlatılır.', true, 'Damlalar sıvının üstünde desen yapar.'],
]

/* ================================================================================================
 * ADALAR
 * ================================================================================================ */
const T = 6 // tur sayısı
const OYUN = 8

export const HB2_ADALAR: Alan[] = [
  {
    id: 'a1',
    no: 1,
    title: 'Ben ve Okulum',
    color: '#ff9a2e',
    dark: '#c86a0c',
    icon: 'school',
    acts: [
      { kind: 'planli-olmak', title: 'Planlı Olmak', icon: 'calendar', total: T, meb: 'HB.2.1.1', gen: rot(ch(PLAN_Q), tf(PLAN_TF, 'calendar')), ders: 'Planlı olmak, yapacağımız işleri önceden belirleyip sıraya koymaktır. Planlı olursak işler zamanında biter, oyuna da vakit kalır.', points: ['İşlerini sıraya koy', 'Ekran süresine dikkat et', 'Yorulunca mola ver'], visual: img('calendar') },
      { kind: 'gunun-sepetleri', title: 'Günün Sepetleri', icon: 'sunrise', total: 4, meb: 'HB.2.1.1', gen: srt('Bu işi günün hangi diliminde yaparız?', 'Sabah hazırlanır, okuldan sonra ödev ve oyun, akşam da uykuya hazırlanırız.', GUN_BINS, GUN_ITEMS), ders: 'Günümüzü dilimlere ayırıp planlarız: güne başlarken, okuldan sonra ve günü bitirirken.', visual: img('sunrise') },
      { kind: 'fatmanin-plani', title: 'Fatma’nın Planı', icon: 'memo', total: 4, meb: 'HB.2.1.1', gen: ord(PLAN_O), ders: 'Fatma önce dinlendi, sonra ödevini yaptı, kitap okudu, oyun oynadı ve erken yattı. Okula dinlenmiş gitti!', visual: img('memo') },
      { kind: 'plan-cozucu', title: 'Plan Sorun Çözücü', icon: 'puzzle', total: 4, meb: 'HB.2.1.1', gen: mt('Zorluğu çözümüyle eşleştir.', 'Her planlama zorluğunun bir çözümü vardır.', PLAN_P), ders: 'Dikkatimiz dağılırsa ekranı kapatır, iş zorsa adım adım yapar, yorulunca mola veririz.', visual: img('puzzle') },
      { kind: 'iletisim', title: 'İletişim Var, Sorun Yok', icon: 'ear', total: T, meb: 'HB.2.1.2', gen: ch(ILETISIM_Q), ders: 'İletişimde duygu ve düşüncelerimizi paylaşırız. Dinlerken konuşana döner, konuşurken göz teması kurarız.', points: ['Sözünü kesme', 'Göz teması kur', 'Sesini ayarla'], visual: img('ear') },
      { kind: 'iyi-dinleyici', title: 'İyi Dinleyici', icon: 'eye', total: 4, meb: 'HB.2.1.2', gen: pop('İyi bir dinleyici ne yapar? Patlat!', 'İyi dinleyici göz teması kurar, başını sallar, sözünü kesmez.', DINLE_HIT, DINLE_WRONG, DINLE_IMG), ders: 'Etkin dinlemede dikkatimizi konuşana veririz ve ne anladığımızı söyleriz.', visual: img('eye') },
      { kind: 'bosluk-avcisi', title: 'Boşluk Avcısı', icon: 'memo', total: T, meb: 'HB.2.1.2', gen: ch(BOSLUK_Q), ders: 'Anlamlı cümle, göz teması, nazik davranış, uygun ses tonu ve beden dili iyi iletişimin parçalarıdır.', visual: img('memo') },
      { kind: 'dinle-konus', title: 'Dinlerken mi, Konuşurken mi?', icon: 'microphone', total: 4, meb: 'HB.2.1.2', gen: srt('Bunu dinlerken mi, konuşurken mi yaparız?', 'Dinlerken konuşana döneriz, konuşurken sesimizi ayarlarız.', [{ id: 'dinle', label: 'Dinlerken', img: 'ear', color: '#3b82f6' }, { id: 'konus', label: 'Konuşurken', img: 'microphone', color: '#f59e0b' }], DINLE_ITEMS), ders: 'İyi iletişimde hem iyi dinler hem de iyi konuşuruz.', visual: img('microphone') },
      { kind: 'yuz-dili', title: 'Yüzün Ne Diyor?', icon: 'surprised', total: 4, meb: 'HB.2.1.2', gen: mt('Yüz ifadesini duygusuyla eşleştir.', 'Yüz ifademiz duygularımızı anlatır.', YUZ_P), ders: 'Bazen hiç konuşmadan, yüzümüzle ve bedenimizle de anlaşırız.', visual: img('surprised') },
      { kind: 'arkadaslik', title: 'Arkadaşlık İlişkilerimiz', icon: 'friends', total: T, meb: 'HB.2.1.3', gen: rot(ch(ARK_Q), tf(ARK_TF, 'friends')), ders: 'Olumlu davranışlar güven ve sevgi, olumsuz davranışlar üzüntü ve öfke doğurur. Arkadaşlığı olumlu davranışlar büyütür.', points: ['Paylaş, yardım et', 'Tebrik et', 'Kırdıysan özür dile'], visual: img('friends') },
      { kind: 'arkadaslik-terazisi', title: 'Arkadaşlık Terazisi', icon: 'balance', total: 4, meb: 'HB.2.1.3', gen: srt('Bu davranış olumlu mu, olumsuz mu?', 'Selamlaşmak ve paylaşmak olumlu; alay etmek ve kavga etmek olumsuzdur.', [{ id: 'olumlu', label: 'Olumlu', img: 'thumbsup', color: '#22c55e' }, { id: 'olumsuz', label: 'Olumsuz', img: 'thumbsdown', color: '#ef4444' }], ARK_ITEMS), ders: 'Davranışlarımız arkadaşımızı etkiler. Olumlu davranışları artırırız.', visual: img('balance') },
      { kind: 'davranis-duygu', title: 'Davranış ve Duygu', icon: 'heart', total: 4, meb: 'HB.2.1.3', gen: mt('Davranışı yarattığı duyguyla eşleştir.', 'Her davranış bir duygu yaratır.', ARK_P), ders: 'Yardım güven, tebrik mutluluk getirir. Alay etmek ise üzer.', visual: img('heart') },
      { kind: 'duygu-hafiza', title: 'Duygu Hafızası', icon: 'happy', total: 3, meb: 'HB.2.1.3', gen: mem('Duygu kartlarını eşleştir!', 'Her duygunun bir yüzü var.', DUYGU_MEM), ders: 'Kartları çevir, duyguyu yüzüyle eşleştir!', visual: img('happy') },
      { kind: 'birlikte-karar', title: 'Birlikte Karar', icon: 'raisedhand', total: 4, meb: 'HB.2.1.4', gen: ord(KARAR_O), ders: 'Fikrimi söylerim, arkadaşlarımı dinlerim, düşüncelerimizi paylaşır ve kararı değerlendiririz.', visual: img('raisedhand') },
      { kind: 'oy-kutusu', title: 'Oy Kutusu', icon: 'chart', total: T, meb: 'HB.2.1.4', gen: ch(OY_Q), ders: 'Çoklu oylamada herkesin bir oyu vardır. En çok oy alan öneri karar olur.', points: ['Herkesin bir oyu var', 'En çok oy alan kazanır', 'Karara hep birlikte uyarız'], visual: img('chart') },
      { kind: 'karar-merdiveni', title: 'Karar Merdiveni', icon: 'checkered', total: T, meb: 'HB.2.1.4', gen: tf(KARAR_TF, 'handshake'), ders: 'Sınıfla ilgili kararları birlikte alır, farklı görüşlere saygı duyar ve kararlara hep birlikte uyarız.', visual: img('checkered') },
      { kind: 'karar-balon', title: 'Karar Balonları', icon: 'balloon', total: 4, meb: 'HB.2.1.4', gen: pop('Ortak karar alırken ne yaparız? Patlat!', 'Fikrimizi söyler, herkesi dinler, oyumuzu veririz.', KARAR_HIT, KARAR_WRONG), ders: 'Ortak karar alırken herkes söz alır ve herkesin fikri değerlidir.', visual: img('balloon') },
      { kind: 'oyun-sinif-meclisi', title: 'Sınıf Meclisi', icon: 'trophy', total: OYUN, meb: 'HB.2.1.4', oyun: true, gen: karma(ch(OY_Q), tf(KARAR_TF), ch(ILETISIM_Q), ch(ARK_Q), ord(KARAR_O)), ders: 'Fındık’ın sınıfı bir kural seçecek! Dinle, konuş, oyla ve kararı panoya as.', visual: img('trophy') },
      { kind: 'oyun-okul-hafizasi', title: 'Okul Hafızası', icon: 'puzzle', total: 4, meb: 'HB.2.1.3', oyun: true, gen: rot(mem('Duygu kartlarını eşleştir!', 'Duygu ve yüzler.', DUYGU_MEM), mem('Zorluk ve çözüm kartlarını eşleştir!', 'Plan sorunlarının çözümleri.', PLAN_P), pop('İyi dinleyici balonlarını patlat!', 'Etkin dinleme davranışları.', DINLE_HIT, DINLE_WRONG, DINLE_IMG)), ders: 'Kartları çevir, balonları patlat!', visual: img('puzzle') },
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
      { kind: 'saglikli-aliskanliklar', title: 'Sağlıklı Alışkanlıklar', icon: 'biceps', total: T, meb: 'HB.2.2.1', gen: rot(ch(SAGLIK_Q), tf(SAGLIK_TF, 'biceps')), ders: 'Beslenme, temizlik, kişisel bakım, diş sağlığı, uyku ve spor sağlıklı büyümemizi sağlar.', points: ['Öğün atlama', 'Erken yat, erken kalk', 'Düzenli spor yap'], visual: img('biceps') },
      { kind: 'saglikli-tabak', title: 'Sağlıklı Tabak', icon: 'salad', total: 4, meb: 'HB.2.2.1', gen: srt('Hangisini her gün, hangisini ara sıra yeriz?', 'Süt, yumurta, sebze ve meyve her gün; şeker ve gazlı içecek ara sıra.', [{ id: 'her', label: 'Her gün', img: 'happy', color: '#22c55e' }, { id: 'ara', label: 'Ara sıra', img: 'thinking', color: '#f59e0b' }], BESIN), ders: 'Et, süt, yumurta, yoğurt, sebze, meyve ve baklagiller sağlıklıdır. Paketli yiyeceklerden uzak dururuz.', visual: img('salad') },
      { kind: 'alti-aliskanlik', title: 'Altı Alışkanlık', icon: 'star', total: 4, meb: 'HB.2.2.1', gen: mt('Alışkanlığı örneğiyle eşleştir.', 'Altı sağlıklı alışkanlık alanımız var.', ALIS_P), ders: 'Beslenme, uyku, spor, diş sağlığı, ortam temizliği ve kişisel bakım.', visual: img('star') },
      { kind: 'cumle-tamamla', title: 'Cümle Tamamla', icon: 'toothbrush', total: 4, meb: 'HB.2.2.1', gen: mt('Cümlenin başını sonuyla eşleştir.', 'Sağlıklı alışkanlıklar cümleleri.', CUMLE_P), ders: 'Düzenli banyo, diş fırçalama, spor ve el yıkama bizi sağlıklı tutar.', visual: img('toothbrush') },
      { kind: 'saglik-balon', title: 'Sağlık Balonları', icon: 'soap', total: 4, meb: 'HB.2.2.1', gen: pop('Sağlıklı büyümek için neler yaparız? Patlat!', 'Erken uyumak, spor ve temizlik bizi sağlıklı tutar.', ALIS_HIT, ALIS_WRONG, ALIS_IMG), ders: 'Sağlıklı alışkanlıkları her gün tekrar ederiz.', visual: img('soap') },
      { kind: 'cevrim-ici', title: 'Çevrim İçi Güvenliğim', icon: 'laptop', total: T, meb: 'HB.2.2.2', gen: ch(CEVRIM_Q), ders: 'İnternette de kişisel alanımızı koruruz. Rahatsız olursak “Hayır!” der, çıkar ve güvendiğimiz büyüğe söyleriz.', points: ['Bilgilerini paylaşma', 'Şifren gizli kalsın', 'Büyüğüne söyle'], visual: img('laptop') },
      { kind: 'gizli-mi', title: 'Gizli mi?', icon: 'lock', total: 4, meb: 'HB.2.2.2', gen: srt('Bu bilgi gizli mi?', 'Şifre, adres, telefon ve fotoğraf gizlidir.', [{ id: 'gizli', label: 'Gizli tutarım', img: 'lock', color: '#ef4444' }, { id: 'degil', label: 'Gizli değil', img: 'happy', color: '#22c55e' }], GIZLI_ITEMS), ders: 'Kimlik ve iletişim bilgilerimizi, fotoğrafımızı, adresimizi ve şifremizi gizli tutarız.', visual: img('lock') },
      { kind: 'guvende-ol', title: 'Güvende Ol', icon: 'shield', total: T, meb: 'HB.2.2.2', gen: tf(GUVENDE_TF, 'shield'), ders: 'Fotoğraf ve bilgi paylaşmadan önce ailemize sorarız. Tanımadığımız kişilerin mesajlarını açmayız.', visual: img('shield') },
      { kind: 'guvenli-balon', title: 'Güvenli Ekran', icon: 'videogame', total: 4, meb: 'HB.2.2.2', gen: pop('Güvenli olmak için ne yaparız? Patlat!', 'Şifremizi gizler, büyüğümüze sorar, gerekirse engelleriz.', GUVEN_HIT, GUVEN_WRONG, GUVEN_IMG), ders: 'Yanlışlıkla bir şeye tıklasak bile hemen büyüğümüze söyleyebiliriz.', visual: img('videogame') },
      { kind: 'levha-ne-diyor', title: 'Levha Ne Diyor?', icon: 'stopsign', total: T, meb: 'HB.2.2.3', gen: rot(ch(LEVHA_Q), tf(LEVHA_TF, 'stopsign')), ders: 'Trafik levhaları yayalara bilgi verir, sürücüleri uyarır ve trafiği düzenler. Kırmızı çember yasak demektir.', points: ['Yaya ve okul geçidi', 'Alt ve üst geçit', 'Kırmızı çember = yasak'], visual: img('stopsign') },
      { kind: 'levha-eslestir', title: 'Levha Eşleştir', icon: 'crossing', total: 4, meb: 'HB.2.2.3', gen: mt('Levhayı anlamıyla eşleştir.', 'Her levhanın bir anlamı var.', LEVHA_P), ders: 'Levhaları tanırsak kendimizi ve başkalarını koruruz.', visual: img('crossing') },
      { kind: 'levha-sepet', title: 'Bilgi mi, Düzen mi?', icon: 'trafficlight', total: 4, meb: 'HB.2.2.3', gen: srt('Levha yayalara bilgi mi veriyor, trafiği mi düzenliyor?', 'Geçitler bilgi verir; giremez ve mecburi yol levhaları trafiği düzenler.', [{ id: 'bilgi', label: 'Yayalara bilgi verir', img: 'walking', color: '#3b82f6' }, { id: 'duzen', label: 'Trafiği düzenler', img: 'trafficlight', color: '#ef4444' }], LEVHA_ITEMS), ders: 'Geçit levhaları güvenle karşıya geçeceğimiz yeri gösterir.', visual: img('trafficlight') },
      { kind: 'levha-hafiza', title: 'Levha Hafızası', icon: 'bicycle', total: 3, meb: 'HB.2.2.3', gen: mem('Levha kartlarını eşleştir!', 'Levha ve anlamı.', LEVHA_P), ders: 'Kartları çevir, levhayı anlamıyla eşleştir!', visual: img('bicycle') },
      { kind: 'acilse', title: 'Acilse Ne Yaparım?', icon: 'siren', total: T, meb: 'HB.2.2.4', gen: rot(ch(ACIL_Q), tf(ACIL_TF, 'telephone')), ders: 'Acil durumda 112 aranır. 112 her gün, gece gündüz ve ücretsiz hizmet verir. Gereksiz yere aranmaz.', points: ['Sakin ol', 'Kısa ve net konuş', 'Görevli deyince kapat'], visual: img('siren') },
      { kind: '112-telefonu', title: '112 Telefonu', icon: 'telephone', total: 4, meb: 'HB.2.2.4', gen: ord(ACIL_O), ders: 'Kendimizi tanıtır, ne olduğunu, kaç kişinin etkilendiğini ve adresi söyleriz. Görevli deyince kapatırız.', visual: img('telephone') },
      { kind: 'dogru-konusma', title: 'Doğru Konuşma', icon: 'speaker', total: 4, meb: 'HB.2.2.4', gen: srt('112 ile konuşurken doğru mu, yanlış mı?', 'Kısa, net ve sakin konuşuruz; görevliyi dinleriz.', [{ id: 'dogru', label: 'Doğru', img: 'thumbsup', color: '#22c55e' }, { id: 'yanlis', label: 'Yanlış', img: 'thumbsdown', color: '#ef4444' }], KONUS_ITEMS), ders: 'Panik yapmadan, doğru bilgi veririz.', visual: img('speaker') },
      { kind: 'acil-mi', title: 'Acil mi?', icon: 'ambulance', total: 4, meb: 'HB.2.2.4', gen: srt('Bu bir acil durum mu?', 'Yangın, sel, gaz kaçağı ve trafik kazası acil durumdur.', [{ id: 'acil', label: 'Acil durum', img: 'siren', color: '#ef4444' }, { id: 'degil', label: 'Acil değil', img: 'happy', color: '#22c55e' }], ACIL_ITEMS), ders: 'Deprem, yangın, sel, gaz kaçağı, zehirlenme ve trafik kazası acil durumlardır.', visual: img('ambulance') },
      { kind: '112-balon', title: '112 Balonları', icon: 'balloon', total: 4, meb: 'HB.2.2.4', gen: pop('112 ile konuşurken doğru olanları patlat!', 'Sakin kal, kendini tanıt, adresi söyle, görevliyi dinle.', ACIL_HIT, ACIL_WRONG), ders: 'Görevlinin söylediklerini yaparız.', visual: img('balloon') },
      { kind: 'oyun-levha-sehri', title: 'Levha Şehri', icon: 'bicycle', total: OYUN, meb: 'HB.2.2.3', oyun: true, gen: karma(ch(LEVHA_Q), tf(LEVHA_TF), mt('Levhayı anlamıyla eşleştir.', 'Levhalar ve anlamları.', LEVHA_P), ch(CEVRIM_Q), ch(ACIL_Q)), ders: 'Fındık bisikletle okula gidiyor! Her kavşakta levhayı doğru oku, yolu aç.', visual: img('bicycle') },
      { kind: 'oyun-guvenlik-kartlari', title: 'Güvenlik Kartları', icon: 'puzzle', total: 4, meb: 'HB.2.2.2', oyun: true, gen: rot(pop('Güvenli ekran balonlarını patlat!', 'İnternette güvenli davranışlar.', GUVEN_HIT, GUVEN_WRONG, GUVEN_IMG), mem('Alışkanlık kartlarını eşleştir!', 'Alışkanlık ve örneği.', ALIS_P), ord(ACIL_O)), ders: 'Balonları patlat, kartları eşleştir!', visual: img('puzzle') },
    ],
  },
  {
    id: 'a3',
    no: 3,
    title: 'Ailem ve Toplum',
    color: '#e85d9a',
    dark: '#b0326b',
    icon: 'housegarden',
    acts: [
      { kind: 'canim-ailem', title: 'Canım Ailem', icon: 'heart', total: T, meb: 'HB.2.3.1', gen: rot(ch(AILE_Q), tf(AILE_TF, 'heart')), ders: 'İlk bilgi ve becerilerimizi ailemizden öğreniriz. Aile bağları bize güven verir; sevgi ve saygı aileyi bir arada tutar.', points: ['Birlikte vakit geçir', 'Büyüklere saygı', 'Teşekkür et'], visual: img('heart') },
      { kind: 'cekirdek-genis', title: 'Çekirdek mi, Geniş mi?', icon: 'houses', total: 4, meb: 'HB.2.3.1', gen: srt('Bu aile çekirdek mi, geniş mi?', 'Anne-baba ve çocuklar çekirdek aile; dede, nine, teyze gibi büyüklerle yaşayan aile geniş ailedir.', [{ id: 'cekirdek', label: 'Çekirdek aile', img: 'house', color: '#3b82f6' }, { id: 'genis', label: 'Geniş aile', img: 'housegarden', color: '#f59e0b' }], AILE_ITEMS), ders: 'Aileler farklı olabilir. Her aile değerlidir.', visual: img('houses') },
      { kind: 'kus-ailesi', title: 'Kumru Ailesi', icon: 'bird', total: 4, meb: 'HB.2.3.1', gen: ord(KUS_O), ders: 'Balkondaki kumru ailesi yumurtalarını korudu, yavrularını birlikte besledi. Aile sıcaklığı her canlıda var!', visual: img('bird') },
      { kind: 'aile-onemli', title: 'Ailem Neden Önemli?', icon: 'hug', total: 4, meb: 'HB.2.3.1', gen: pop('Ailemiz bize neler verir? Patlat!', 'Ailemiz bize güven, sevgi ve destek verir.', AILE_HIT, AILE_WRONG), ders: 'Ailemizle mutlu günde de zor günde de birlikteyiz.', visual: img('hug') },
      { kind: 'nezaket-gorgu', title: 'Nezaket mi, Görgü mü?', icon: 'handshake', total: 4, meb: 'HB.2.3.2', gen: srt('Bu bir nezaket kuralı mı, görgü kuralı mı?', 'Özür ve teşekkür nezakettir; kütüphanede sessizlik ve yer vermek görgü kuralıdır.', [{ id: 'nezaket', label: 'Nezaket', img: 'heart', color: '#ec4899' }, { id: 'gorgu', label: 'Görgü', img: 'star', color: '#8b5cf6' }], NG_ITEMS), ders: 'Nezaket başkalarına saygılı ve duyarlı davranmaktır. Görgü kuralları toplum içindeki davranışlarımızı düzenler.', visual: img('handshake') },
      { kind: 'nerede-nasil', title: 'Nerede Nasıl?', icon: 'bus', total: 4, meb: 'HB.2.3.2', gen: mt('Yeri uygun davranışla eşleştir.', 'Her yerin bir görgü kuralı var.', KURALYER_P), ders: 'Kütüphanede sessiz oluruz, otobüste yer veririz, kantinde sıramızı bekleriz.', visual: img('bus') },
      { kind: 'ne-yaparsin', title: 'Ne Yaparsın?', icon: 'thinking', total: T, meb: 'HB.2.3.2', gen: ch(NG_Q), ders: 'Nezaket ve görgü kurallarına uyunca huzur içinde yaşarız.', points: ['Selamlaş', 'Yer ver', 'Özür dile, teşekkür et'], visual: img('thinking') },
      { kind: 'kontrol-listesi', title: 'Nezaket Kontrol Listesi', icon: 'memo', total: T, meb: 'HB.2.3.2', gen: tf(NG_TF, 'forkplate'), ders: 'Nazik davranır, sözünü kesmeden dinler, sıramızı bekler ve sofrada görgü kurallarına uyarız.', visual: img('memo') },
      { kind: 'nazik-balon', title: 'Gizli Nezaket Takımı', icon: 'balloon', total: 4, meb: 'HB.2.3.2', gen: pop('Nazik davranışları patlat!', 'Selam vermek, yer vermek ve sıra beklemek nazik davranışlardır.', NAZIK_HIT, NAZIK_WRONG), ders: 'Nazik davranışlar çevremizi güzelleştirir.', visual: img('balloon') },
      { kind: 'gorevim', title: 'Görevim, Sorumluluğum', icon: 'clock', total: T, meb: 'HB.2.3.3', gen: rot(ch(SORUM_Q), tf(SORUM_TF, 'clock')), ders: 'Hepimizin görev ve sorumlulukları vardır. Görevlerimizi zamanında ve eksiksiz yaparız; ortak alanları temiz kullanırız.', points: ['Odanı düzenli tut', 'Ortak alanları koru', 'Sıranı bekle'], visual: img('clock') },
      { kind: 'sorumluluk-tamamla', title: 'Sorumluluk Tamamla', icon: 'puzzle', total: 4, meb: 'HB.2.3.3', gen: mt('Cümlenin başını sonuyla eşleştir.', 'Sorumluluklarımızı tamamlayalım.', SORUM_P), ders: 'Su ve elektriği tasarruflu kullanır, dersleri dikkatle dinler, sıramızı bekleriz.', visual: img('puzzle') },
      { kind: 'ev-okul-toplum', title: 'Ev mi, Okul mu, Toplum mu?', icon: 'school', total: 4, meb: 'HB.2.3.3', gen: srt('Bu sorumluluk nerede?', 'Evde, okulda ve toplumda farklı sorumluluklarımız var.', [{ id: 'ev', label: 'Evde', img: 'house', color: '#f59e0b' }, { id: 'okul', label: 'Okulda', img: 'school', color: '#3b82f6' }, { id: 'toplum', label: 'Toplumda', img: 'houses', color: '#22c55e' }], SORUM_ITEMS), ders: 'Sorumluluklarımızı yapınca düzen ve huzura katkı sağlarız.', visual: img('school') },
      { kind: 'gorev-hafiza', title: 'Görev Hafızası', icon: 'teddy', total: 3, meb: 'HB.2.3.3', gen: mem('Görev kartlarını eşleştir!', 'Her görevin bir resmi var.', GOREV_MEM), ders: 'Kartları çevir, görevi resmiyle eşleştir!', visual: img('teddy') },
      { kind: 'oyun-mahallede-bir-gun', title: 'Mahallede Bir Gün', icon: 'houses', total: OYUN, meb: 'HB.2.3.2', oyun: true, gen: karma(ch(NG_Q), ch(SORUM_Q), tf(NG_TF), mt('Yeri uygun davranışla eşleştir.', 'Yerler ve kurallar.', KURALYER_P), ch(AILE_Q)), ders: 'Fındık mahallede! Kediyi besle, otobüste yer ver, kütüphanede sessiz ol.', visual: img('houses') },
      { kind: 'oyun-aile-albumu', title: 'Aile Albümü', icon: 'camera', total: 4, meb: 'HB.2.3.1', oyun: true, gen: rot(ord(KUS_O), mem('Görev kartlarını eşleştir!', 'Görev ve resmi.', GOREV_MEM), pop('Ailemizin bize verdiklerini patlat!', 'Güven, sevgi, destek.', AILE_HIT, AILE_WRONG)), ders: 'Albümün sayfalarını sırala, kartları eşleştir!', visual: img('camera') },
    ],
  },
  {
    id: 'a4',
    no: 4,
    title: 'Yaşadığım Yer ve Ülkem',
    color: '#e8453c',
    dark: '#a82820',
    icon: 'trflag',
    acts: [
      { kind: 'tarih-doga', title: 'Tarihin ve Doğanın İzinde', icon: 'castle', total: T, meb: 'HB.2.4.1', gen: rot(ch(TARIH_Q), tf(MUZE_TF, 'classical')), ders: 'Tarihî mekânlarda geçmişte önemli olaylar yaşanmıştır. Doğal güzellikler ise doğada kendiliğinden oluşur. İkisi de değerlerimizdir.', points: ['Kale, köprü, cami, müze', 'Göl, dağ, şelale, vadi', 'Hepsini koruruz'], visual: img('castle') },
      { kind: 'tarihi-dogal', title: 'Tarihî mi, Doğal mı?', icon: 'mountain', total: 4, meb: 'HB.2.4.1', gen: srt('Tarihî mekân mı, doğal güzellik mi?', 'Kale, cami ve müze tarihî; göl, dağ ve şelale doğaldır.', [{ id: 'tarih', label: 'Tarihî mekân', img: 'castle', color: '#f59e0b' }, { id: 'doga', label: 'Doğal güzellik', img: 'mountain', color: '#22c55e' }], YER_ITEMS), ders: 'Ülkemiz tarihî mekânlar ve doğal güzellikler bakımından çok zengindir.', visual: img('mountain') },
      { kind: 'hazine-haritasi', title: 'Türkiye Hazine Haritası', icon: 'map', total: 4, meb: 'HB.2.4.1', gen: mt('Güzelliği şehriyle eşleştir.', 'Her şehrimizin bir hazinesi var.', SEHIR_P), ders: 'Peribacaları Nevşehir’de, Pamukkale Denizli’de, Selimiye Camii Edirne’de.', visual: img('map') },
      { kind: 'tur-hafiza', title: 'Tür Hafızası', icon: 'castle', total: 3, meb: 'HB.2.4.1', gen: mem('Türü örneğiyle eşleştir!', 'Kale, köprü, göl, dağ ve daha fazlası.', TUR_MEM), ders: 'Kartları çevir, türü örneğiyle eşleştir!', visual: img('castle') },
      { kind: 'kim-yonetir', title: 'Kim Yönetir?', icon: 'cityscape', total: T, meb: 'HB.2.4.2', gen: ch(YONET_Q), ders: 'İli vali, ilçeyi kaymakam, köyü ve mahalleyi muhtar, belediyeyi belediye başkanı yönetir.', points: ['İl → vali', 'İlçe → kaymakam', 'Köy, mahalle → muhtar'], visual: img('cityscape') },
      { kind: 'yonetici-eslestir', title: 'Yönetici Eşleştir', icon: 'houses', total: 4, meb: 'HB.2.4.2', gen: mt('Yöneticiyi göreviyle eşleştir.', 'Her yönetim biriminin bir yöneticisi var.', YONET_P), ders: 'Yönetim birimleri hizmetlerin herkese düzenli ulaşmasını sağlar.', visual: img('houses') },
      { kind: 'buyukten-kucuge', title: 'Büyükten Küçüğe', icon: 'map', total: 4, meb: 'HB.2.4.2', gen: ord(YONET_O), ders: 'İl en büyük yerleşim birimidir. İlçe ilden küçüktür. Köy ve mahalle en küçüktür.', visual: img('map') },
      { kind: 'kaynak-balon', title: 'Bilgi Nereden?', icon: 'magnifier', total: 4, meb: 'HB.2.4.2', gen: pop('Güvenilir bilgi kaynaklarını patlat!', 'Muhtarlık, belediye, kaymakamlık ve kitaplar güvenilir kaynaklardır.', KAYNAK_HIT, KAYNAK_WRONG), ders: 'Bilgiyi resmî kurumlardan ve kitaplardan öğreniriz.', visual: img('magnifier') },
      { kind: 'ataturk-ogrenci', title: 'Atatürk Nasıl Bir Öğrenciydi?', icon: 'books', total: T, meb: 'HB.2.4.3', gen: rot(ch(ATA_Q), tf(ATA_TF, 'books')), ders: 'Mustafa Kemal meraklı, çalışkan ve azimli bir öğrenciydi. Matematiği çok severdi. Öğretmeni ona “Kemal” adını verdi.', points: ['Matematiği severdi', 'Kitap okumayı severdi', 'Azimliydi'], visual: img('books') },
      { kind: 'ata-okullari', title: 'Atatürk’ün Okulları', icon: 'school', total: 4, meb: 'HB.2.4.3', gen: ord(ATA_O), ders: 'Mahalle Mektebi ile başladı; Askerî Rüştiye, Askerî İdadi, Harp Okulu ve Harp Akademisi’nde okudu.', visual: img('school') },
      { kind: 'nasil-ogrenci', title: 'Örnek Öğrenci', icon: 'star', total: 4, meb: 'HB.2.4.3', gen: pop('Mustafa Kemal nasıl bir öğrenciydi? Patlat!', 'Meraklı, çalışkan, azimli ve kitap seven bir öğrenciydi.', ATA_HIT, ATA_WRONG), ders: 'Öğrencilik yıllarındaki çalışkanlığı nasıl bir lider olacağını gösterir.', visual: img('star') },
      { kind: 'bayram-takvimi', title: 'Bayram Takvimi', icon: 'calendar', total: T, meb: 'HB.2.4.4', gen: rot(ch(BAYRAM_Q), mt('Günü o gün olanla eşleştir.', 'Millî gün ve bayramlarımız.', BAYRAM_P)), ders: '23 Nisan’da Meclis açıldı, 19 Mayıs’ta Samsun’a gidildi, 29 Ekim’de cumhuriyet ilan edildi, 30 Ağustos’ta zafer kazanıldı.', points: ['23 Nisan, 19 Mayıs', '29 Ekim, 30 Ağustos', '15 Temmuz millî gün'], visual: img('calendar') },
      { kind: 'bayramlarla-gurur', title: 'Bayramlarımızla Gururluyuz', icon: 'trflag', total: T, meb: 'HB.2.4.4', gen: tf(MILLI_TF, 'trflag'), ders: 'Millî bayramlar kültürel mirasımızdır. Birlik ve beraberliğimizi güçlendirir.', visual: img('trflag') },
      { kind: 'kutlama-balon', title: 'Kutlama Balonları', icon: 'balloon', total: 4, meb: 'HB.2.4.4', gen: pop('Millî bayram kutlamalarını patlat!', 'Fener alayı, bayrak süsleme, saygı duruşu ve halk oyunları.', KUTLAMA_HIT, KUTLAMA_WRONG, KUTLAMA_IMG), ders: 'Törenlerde İstiklâl Marşı okunur, saygı duruşu yapılır, her yer bayraklarla süslenir.', visual: img('balloon') },
      { kind: 'bayram-gelince', title: 'Bayram Gelince', icon: 'crescent', total: T, meb: 'HB.2.4.5', gen: ch(DINI_Q), ders: 'Ramazan ve Kurban bayramları dinî bayramlarımızdır. Kandiller, Kadir Gecesi ve Aşure Günü dinî günlerimizdir. Ziyaret eder, paylaşır, yardımlaşırız.', points: ['Büyükleri ziyaret', 'İkram ve paylaşma', 'Küsler barışır'], visual: img('crescent') },
      { kind: 'milli-dini', title: 'Millî mi, Dinî mi?', icon: 'gift', total: 4, meb: 'HB.2.4.5', gen: srt('Bu kutlama millî bayramda mı, dinî bayramda mı yapılır?', 'Fener alayı millî bayramda; baklava ikramı ve el öpmek dinî bayramda.', [{ id: 'milli', label: 'Millî bayram', img: 'trflag', color: '#ef4444' }, { id: 'dini', label: 'Dinî bayram', img: 'crescent', color: '#22c55e' }], MILLIDINI_ITEMS), ders: 'Her iki bayram da birlik ve beraberliğimizi güçlendirir.', visual: img('gift') },
      { kind: 'bayram-balon', title: 'Bayram Sofrası', icon: 'cake', total: 4, meb: 'HB.2.4.5', gen: pop('Dinî bayramda neler yapılır? Patlat!', 'Ziyaret, el öpme, ikram ve barışma.', DINI_HIT, DINI_WRONG), ders: 'Bayramda akrabalık ve komşuluk bağları güçlenir.', visual: img('cake') },
      { kind: 'oyun-gezi-pasaportu', title: 'Türkiye Gezi Pasaportu', icon: 'airplane', total: OYUN, meb: 'HB.2.4.1', oyun: true, gen: karma(ch(TARIH_Q), mt('Güzelliği şehriyle eşleştir.', 'Şehirlerimizin hazineleri.', SEHIR_P), ch(YONET_Q), ch(ATA_Q), ch(BAYRAM_Q)), ders: 'Fındık’la balonla Türkiye’yi gez! Her durakta bir soru, pasaportuna bir pul.', visual: img('airplane') },
      { kind: 'oyun-bayram-okulu', title: 'Bayram Okulu', icon: 'fireworks', total: 4, meb: 'HB.2.4.4', oyun: true, gen: rot(mem('Bayram kartlarını eşleştir!', 'Bayram adı ve günü.', BAYRAM_AD_MEM), srt('Millî mi, dinî mi?', 'Bayram kutlamaları.', [{ id: 'milli', label: 'Millî bayram', img: 'trflag', color: '#ef4444' }, { id: 'dini', label: 'Dinî bayram', img: 'crescent', color: '#22c55e' }], MILLIDINI_ITEMS), pop('Millî bayram kutlamalarını patlat!', 'Kutlama ve törenler.', KUTLAMA_HIT, KUTLAMA_WRONG, KUTLAMA_IMG)), ders: 'Takvimde ilerle, her bayramı doğru kutla!', visual: img('fireworks') },
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
      { kind: 'hava-olaylari', title: 'Hava Olayları', icon: 'cloudsun', total: T, meb: 'HB.2.5.1', gen: ch(HAVA_Q), ders: 'Yağmur, kar, dolu ve rüzgâr hava olaylarıdır. Dolu, donan su damlacıklarından oluşur. Rüzgâr havanın yer değiştirmesidir.', points: ['Yağmur, kar, dolu', 'Rüzgâr, sis', 'Mevsime göre değişir'], visual: img('cloudsun') },
      { kind: 'hava-eslestir', title: 'Hava Olayı Tanı', icon: 'rain', total: 4, meb: 'HB.2.5.1', gen: mt('Hava olayını anlamıyla eşleştir.', 'Her hava olayının bir özelliği var.', HAVA_P), ders: 'Yağmur damla, kar tane, dolu buz parçası hâlinde yağar.', visual: img('rain') },
      { kind: 'mevsim-seridi', title: 'Mevsim Şeridi', icon: 'fallenleaf', total: 4, meb: 'HB.2.5.1', gen: ord(MEVSIM_O), ders: 'Sonbahar: eylül, ekim, kasım. Kış: aralık, ocak, şubat. İlkbahar: mart, nisan, mayıs. Yaz: haziran, temmuz, ağustos.', visual: img('fallenleaf') },
      { kind: 'ay-sepetleri', title: 'Ay Sepetleri', icon: 'calendar', total: 4, meb: 'HB.2.5.1', gen: rot(ayGen(['sonbahar', 'kis', 'ilkbahar']), ayGen(['kis', 'ilkbahar', 'yaz']), ayGen(['sonbahar', 'ilkbahar', 'yaz'])), ders: 'Her mevsimin üç ayı vardır.', visual: img('calendar') },
      { kind: 'mevsim-dy', title: 'Mevsimler Doğru mu?', icon: 'snowman', total: T, meb: 'HB.2.5.1', gen: tf(MEVSIM_TF, 'cloudsun'), ders: 'Bir hava olayı birden çok mevsimde görülebilir. Bir mevsimde de birden çok hava olayı olabilir.', visual: img('snowman') },
      { kind: 'soguk-aylar', title: 'Serin ve Soğuk Aylar', icon: 'snowflake', total: 4, meb: 'HB.2.5.1', gen: pop('Sonbahar ve kış aylarını patlat!', 'Sonbahar: eylül, ekim, kasım. Kış: aralık, ocak, şubat.', SOGUK_HIT, SOGUK_WRONG), ders: 'Sonbaharda havalar serinler, kışın soğur.', visual: img('snowflake') },
      { kind: 'ana-yonler', title: 'Ana Yönler', icon: 'compass', total: T, meb: 'HB.2.5.2', gen: ch(YON_Q), ders: 'Dört ana yön doğu, batı, kuzey ve güneydir. Güneş doğudan doğar. Kutup Yıldızı kuzeyi gösterir. En güvenilir araç pusuladır.', points: ['Güneş doğudan doğar', 'Kutup Yıldızı kuzeyde', 'Pusula güvenilirdir'], visual: img('compass') },
      { kind: 'pusula-kollari', title: 'Pusula Kolları', icon: 'sunrise', total: 4, meb: 'HB.2.5.2', gen: mt('Sağ kolun Güneş’in doğduğu yerde. Eşleştir.', 'Sağ kol doğu, sol kol batı, yüz kuzey, sırt güney.', KOL_P), ders: 'Sağ kolumuzu Güneş’in doğduğu yere uzatırsak yüzümüz kuzeye bakar.', visual: img('sunrise') },
      { kind: 'doga-pusulasi', title: 'Doğa Pusulası', icon: 'glowstar', total: 4, meb: 'HB.2.5.2', gen: pop('Yön bulmaya yardım edenleri patlat!', 'Güneş, Kutup Yıldızı, pusula, yön oku ve gölge çubuğu.', YON_HIT, YON_WRONG, YON_IMG), ders: 'Yön bulmak için Güneş’ten, Kutup Yıldızı’ndan ve pusuladan yararlanırız.', visual: img('glowstar') },
      { kind: 'golge-cubugu', title: 'Gölge Çubuğu', icon: 'sun', total: 4, meb: 'HB.2.5.2', gen: ord(GOLGE_O), ders: 'Çubuğun gölge uçlarını birleştiren çizgi doğu-batı yönünü gösterir.', visual: img('sun') },
      { kind: 'yon-dy', title: 'Yön Doğru mu?', icon: 'map', total: T, meb: 'HB.2.5.2', gen: tf(YON_TF, 'compass'), ders: 'Yosun ya da karınca yuvası güvenilir değildir. Güneş’e, Kutup Yıldızı’na ve pusulaya güveniriz.', visual: img('map') },
      { kind: 'afet-onlem', title: 'Afet Önlemi Eşleştir', icon: 'shield', total: 4, meb: 'HB.2.5.3', gen: mt('Önlemi afetle eşleştir.', 'Her afet için alınacak bir önlem var.', AFET_P), ders: 'Dere yatağına ev yapmayız, ormanda ateş yakmayız, evin sağlamlığını kontrol ettiririz.', visual: img('shield') },
      { kind: 'afete-hazirlik', title: 'Afete Hazırım', icon: 'backpack', total: T, meb: 'HB.2.5.3', gen: rot(ch(AFET_Q), tf(AFET_TF, 'shield')), ders: 'Hazırlıklı olmak zararı azaltır. Ailece plan yapar, çanta hazırlar, toplanma alanını öğreniriz. Hazırlıklıysak güvende oluruz.', points: ['Afet çantası', 'Toplanma alanı', 'Eşyaları sabitle'], visual: img('backpack') },
      { kind: 'afet-cantasi', title: 'Afet Çantası', icon: 'package', total: 4, meb: 'HB.2.5.3', gen: pop('Afet çantasına girenleri patlat!', 'Su, yiyecek, ilk yardım çantası, kimlik, el feneri, düdük, radyo, giysi.', CANTA_HIT, CANTA_WRONG, CANTA_IMG), ders: 'Afet çantası yardım gelene kadar ihtiyacımızı karşılar. Altı ayda bir yenilenir.', visual: img('package') },
      { kind: 'tehlike-avi', title: 'Tehlike Avı', icon: 'magnifier', total: 4, meb: 'HB.2.5.3', gen: rot(pop('Devrilebilecek eşyaları patlat!', 'Sabitlenmemiş dolap, raftaki vazo ve asılı ayna devrilebilir.', TEHLIKE_HIT, TEHLIKE_WRONG), ord(AFET_O)), ders: 'Tehlikeli eşyayı bul, nasıl tehlikeli olduğunu düşün, sabitle ya da kaldır.', visual: img('magnifier') },
      { kind: 'tasarruf', title: 'Tasarruf Bizim İşimiz', icon: 'droplet', total: T, meb: 'HB.2.5.4', gen: rot(ch(TASARRUF_Q), tf(TASARRUF_TF, 'droplet')), ders: 'Su, orman, toprak, madenler ve enerji doğal kaynaklarımızdır. Sınırsız değildir; tasarruflu kullanırız.', points: ['Işığı kapat', 'Musluğu kapat', 'Yemeği israf etme'], visual: img('droplet') },
      { kind: 'tasarruf-dedektifi', title: 'Tasarruf Dedektifi', icon: 'detective', total: 4, meb: 'HB.2.5.4', gen: pop('İsrafları bul ve patlat!', 'Boşa yanan lamba, akan musluk ve atılan yemek israftır.', ISRAF_HIT, ISRAF_WRONG, ISRAF_IMG), ders: 'Gördüğümüz israfı büyüklerimize söyleriz.', visual: img('detective') },
      { kind: 'kaynak-eslestir', title: 'Hangi Kaynağı Korur?', icon: 'recycle', total: 4, meb: 'HB.2.5.4', gen: mt('Davranışı koruduğu kaynakla eşleştir.', 'Tasarruf kaynaklarımızı korur.', KAYNAK_P), ders: 'Lambayı kapatmak elektriği, kâğıt tasarrufu ormanları korur.', visual: img('recycle') },
      { kind: 'tasarruf-sepet', title: 'Tasarruf mu, İsraf mı?', icon: 'bulb', total: 4, meb: 'HB.2.5.4', gen: srt('Bu tasarruf mu, israf mı?', 'Işığı kapatmak tasarruf, boş odada yanan ışık israftır.', [{ id: 'tasarruf', label: 'Tasarruf', img: 'thumbsup', color: '#22c55e' }, { id: 'israf', label: 'İsraf', img: 'thumbsdown', color: '#ef4444' }], TASARRUF_ITEMS), ders: 'Tasarruf israfı önler, kaynakların daha uzun süre kullanılmasını sağlar.', visual: img('bulb') },
      { kind: 'oyun-dort-mevsim', title: 'Dört Mevsim Yolculuğu', icon: 'rainbow', total: OYUN, meb: 'HB.2.5.1', oyun: true, gen: karma(ch(HAVA_Q), tf(MEVSIM_TF), ch(YON_Q), ord(MEVSIM_O), ch(AFET_Q)), ders: 'Fındık bir yıl boyunca adada yürüyor! Mevsim kapılarını hava, ay ve yön sorularıyla aç.', visual: img('rainbow') },
      { kind: 'oyun-hazir-ada', title: 'Hazır Ada', icon: 'island', total: 4, meb: 'HB.2.5.3', oyun: true, gen: rot(pop('Afet çantasına girenleri patlat!', 'Çantadakiler.', CANTA_HIT, CANTA_WRONG, CANTA_IMG), mem('Yön kartlarını eşleştir!', 'Yön bulma araçları.', YON_MEM), srt('Tasarruf mu, israf mı?', 'Kaynakları koruyalım.', [{ id: 'tasarruf', label: 'Tasarruf', img: 'thumbsup', color: '#22c55e' }, { id: 'israf', label: 'İsraf', img: 'thumbsdown', color: '#ef4444' }], TASARRUF_ITEMS)), ders: 'Adayı afetlere hazırla, enerjiyi koru!', visual: img('island') },
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
      { kind: 'bilim-kartlari', title: 'Bilim İnsanı Kartları', icon: 'scientist', total: 3, meb: 'HB.2.6.1', gen: mem('Bilim insanını çalışmasıyla eşleştir!', 'Türk bilim insanları ve katkıları.', BILIM_P), ders: 'Bilim insanları araştırır, keşfeder ve insanlığa katkı sağlar.', visual: img('scientist') },
      { kind: 'kim-icat-etti', title: 'Kim Buldu?', icon: 'bulb', total: T, meb: 'HB.2.6.1', gen: ch(BILIM_Q), ders: 'Ali Kuşçu güneş saatini, El-Cezerî robotları yaptı. Vecihi Hürkuş ilk yerli uçağı, Alper Gezeravcı uzaya giden ilk Türk astronottur.', points: ['Ali Kuşçu → güneş saati', 'Vecihi Hürkuş → uçak', 'Bell → telefon'], visual: img('bulb') },
      { kind: 'bilim-alanlari', title: 'Bilim Alanları', icon: 'telescope', total: 4, meb: 'HB.2.6.1', gen: srt('Bu bilim insanı hangi alanda çalıştı?', 'Gökyüzü, icat ve tarih alanları.', [{ id: 'gok', label: 'Gökyüzü ve uzay', img: 'telescope', color: '#3b82f6' }, { id: 'icat', label: 'İcat ve makine', img: 'gear', color: '#f59e0b' }, { id: 'tarih', label: 'Tarih', img: 'scroll', color: '#8b5cf6' }], ALAN_ITEMS), ders: 'Bilim insanları matematik, gök bilimi, tarih, uzay ve havacılık gibi alanlarda çalışır.', visual: img('telescope') },
      { kind: 'dunyadan-bilim', title: 'Dünyadan Bilim İnsanları', icon: 'globe', total: 4, meb: 'HB.2.6.1', gen: mt('Bilim insanını çalışmasıyla eşleştir.', 'Einstein fizik, Edison lamba, Bell telefon.', DUNYA_P), ders: 'Marie Curie iki kez Nobel ödülü kazandı. Einstein fizik alanında çalıştı.', visual: img('globe') },
      { kind: 'bilim-gibi-ol', title: 'Bilim İnsanı Gibi Ol', icon: 'magnifier', total: 4, meb: 'HB.2.6.1', gen: pop('Bilim insanlarının özelliklerini patlat!', 'Meraklı, azimli, planlı ve çalışkandırlar; çok soru sorarlar.', OZELLIK_HIT, OZELLIK_WRONG), ders: 'Bilim insanları meraklıdır, soru sorar ve cevabını araştırır.', visual: img('magnifier') },
      { kind: 'merak-sorulari', title: 'Seda’nın Merakı', icon: 'thinking', total: 4, meb: 'HB.2.6.1', gen: mt('Merak sorusunu cevabıyla eşleştir.', 'Araştırınca cevabı buluruz.', MERAK_P), ders: 'En küçük kuş arı sinek kuşudur. Kutup ayısının kılları hava doludur, onu soğuktan korur.', visual: img('thinking') },
      { kind: 'arastirma', title: 'Araştırmacı Adımları', icon: 'openbook', total: 4, meb: 'HB.2.6.1', gen: ord(ARASTIRMA_O), ders: 'Konuyu seç, kaynağı bul, başka kaynakla karşılaştır, not al, kaynağın adını yaz.', visual: img('openbook') },
      { kind: 'guvenilir-kaynak', title: 'Güvenilir Kaynak', icon: 'books', total: T, meb: 'HB.2.6.1', gen: ch(KAYNAK_Q), ders: 'Kütüphane, ansiklopedi, uzman kişiler ve resmî kurum siteleri güvenilir kaynaklardır. Bilgiyi başka kaynakla kontrol ederiz.', visual: img('books') },
      { kind: 'bilmece', title: 'Bilmece Atölyesi', icon: 'puzzle', total: T, meb: 'HB.2.6.2', gen: ch(BILMECE_Q), ders: 'Fırın, mikser, telefon ve kulaklık işlerimizi kolaylaştıran teknolojik ürünlerdir.', visual: img('puzzle') },
      { kind: 'dunden-bugune', title: 'Dünden Bugüne', icon: 'hourglass', total: 4, meb: 'HB.2.6.2', gen: mt('Eskisini yenisiyle eşleştir.', 'Teknoloji geliştikçe ürünler değişir.', ESKI_P), ders: 'Eskiden mektup yazılırdı, bugün akıllı telefonla saniyeler içinde haberleşiriz.', visual: img('hourglass') },
      { kind: 'degisen-ayni', title: 'Değişen mi, Aynı mı?', icon: 'gear', total: 4, meb: 'HB.2.6.2', gen: srt('Bu değişim mi, süreklilik mi?', 'Görünüş değişir; ürünün işi aynı kalır.', [{ id: 'degisen', label: 'Değişen', img: 'sparkles', color: '#f59e0b' }, { id: 'ayni', label: 'Aynı kalan', img: 'gear', color: '#3b82f6' }], DEGISIM_ITEMS), ders: 'Dış görünüşün değişmesi değişimdir. İşin aynı kalması sürekliliktir.', visual: img('gear') },
      { kind: 'gecmis-gunumuz', title: 'Geçmişte mi, Bugün mü?', icon: 'classical', total: 4, meb: 'HB.2.6.2', gen: srt('Bu ürün geçmişte mi, günümüzde mi kullanılır?', 'Mektup ve gaz lambası geçmişte; akıllı telefon ve tablet günümüzde.', [{ id: 'gecmis', label: 'Geçmişte', img: 'hourglass', color: '#f59e0b' }, { id: 'bugun', label: 'Günümüzde', img: 'phone', color: '#3b82f6' }], ZAMAN_ITEMS), ders: 'Eski ürünleri müzelerde ve büyüklerimizin evlerinde görebiliriz.', visual: img('classical') },
      { kind: 'eskisi-yenisi', title: 'Eskisi, Yenisi', icon: 'robot', total: T, meb: 'HB.2.6.2', gen: ch(TEKNO_Q), ders: 'Teknolojinin temelinde ihtiyaç ve merak vardır. İhtiyaçlar değiştikçe teknoloji gelişir.', points: ['Görünüş değişir', 'İşi aynı kalır', 'Merak geliştirir'], visual: img('robot') },
      { kind: 'zaman-seridi', title: 'Zaman Şeridi', icon: 'telephone', total: 4, meb: 'HB.2.6.2', gen: ord(ESKI_O), ders: 'Aynı ürünün eski ve yeni hâllerini sıralayalım.', visual: img('telephone') },
      { kind: 'sanat-nerede', title: 'Sanat Nerede?', icon: 'palette', total: 4, meb: 'HB.2.6.3', gen: mt('Sanatı hayattaki yeriyle eşleştir.', 'Sanat geçmişten bugüne hayatımızda.', SANAT_P), ders: 'Ebru eşarplarda, İznik çinisi fincanlarda, darbuka düğünlerde, Karagöz ile Hacivat gölge oyununda yaşar.', visual: img('palette') },
      { kind: 'sanat-faydasi', title: 'Sanat Ne İşe Yarar?', icon: 'music', total: 4, meb: 'HB.2.6.3', gen: pop('Sanatın faydalarını patlat!', 'Sanat mutlu eder, dinlendirir, insanları bir araya getirir.', FAYDA_HIT, FAYDA_WRONG), ders: 'Sanat yaratıcılığı geliştirir ve farkındalık yaratır.', visual: img('music') },
      { kind: 'sanat-dallari', title: 'Sanat Dalları', icon: 'theater', total: 4, meb: 'HB.2.6.3', gen: pop('Sanat dallarını patlat!', 'Resim, müzik, tiyatro, ebru, kukla, çini, dans ve sinema.', DAL_HIT, DAL_WRONG, DAL_IMG), ders: 'Sanat; duygu ve düşünceleri söz, yazı, resim ve müzikle anlatmaktır.', visual: img('theater') },
      { kind: 'hayat-sanatla-guzel', title: 'Hayat Sanatla Güzel', icon: 'plate', total: T, meb: 'HB.2.6.3', gen: rot(ch(SANAT_Q), tf(SANAT_TF, 'palette')), ders: 'Kilimdeki tek şekil motiftir; motifler birleşince desen olur. Sultan Ahmet Camii’ne çinileri yüzünden Mavi Cami denir.', points: ['Motif ve desen', 'Ebru, çini, kilim', 'Gölge oyunu'], visual: img('plate') },
      { kind: 'oyun-bilim-galerisi', title: 'Bilim Galerisi', icon: 'framed', total: OYUN, meb: 'HB.2.6.1', oyun: true, gen: karma(ch(BILIM_Q), mt('Bilim insanını çalışmasıyla eşleştir.', 'Bilim insanları.', BILIM_P), ch(KAYNAK_Q), ord(ARASTIRMA_O), ch(SANAT_Q)), ders: 'Galeriyi gez! Her panoda bir bilim insanı ve bir soru seni bekliyor.', visual: img('framed') },
      { kind: 'oyun-zaman-kapsulu', title: 'Zaman Kapsülü Müzesi', icon: 'hourglass', total: 4, meb: 'HB.2.6.2', oyun: true, gen: rot(ord(ESKI_O), srt('Değişen mi, aynı mı?', 'Değişim ve süreklilik.', [{ id: 'degisen', label: 'Değişen', img: 'sparkles', color: '#f59e0b' }, { id: 'ayni', label: 'Aynı kalan', img: 'gear', color: '#3b82f6' }], DEGISIM_ITEMS), mem('Sanat kartlarını eşleştir!', 'Sanat ve hayattaki yeri.', SANAT_P)), ders: 'Müzede eskiyi yeniye diz, sanat köşesini gez!', visual: img('hourglass') },
    ],
  },
]
