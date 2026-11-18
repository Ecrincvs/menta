/**
 * HAYAT BİLGİSİ (1–3), FEN BİLİMLERİ (3–4), SOSYAL BİLGİLER (4) soru bankaları.
 * Konular: docs/meb/hayat-bilgisi-1-3.txt, fen-bilimleri-3-8.txt, sosyal-bilgiler-4-7.txt
 * (4. sınıf Fen için 2018 programı da yürürlükte olabilir; ortak konular seçildi — bkz. docs/CURRICULUM.md)
 */
import { C, fromBank, order, sort, type BankItem, type Gen } from './helpers'

const I = (img: string, label: string) => ({ img, label })

/* =============================== HAYAT BİLGİSİ =============================== */
const TRAFIK: BankItem[] = [
  C([1, 2, 3], 'Karşıdan karşıya nereden geçmeliyiz?', 'Yaya geçidinden', ['Park etmiş arabaların arasından', 'Koşarak en kısa yoldan'], 'Yaya geçidinden, önce sola sonra sağa bakarak geçeriz.', { kind: 'image', img: 'walking' }),
  C([1], 'Trafik ışığında hangi renk “DUR” demektir?', 'Kırmızı', ['Yeşil', 'Sarı'], 'Kırmızı ışıkta dururuz, yeşil ışıkta dikkatle geçeriz.', { kind: 'image', img: 'trafficlight' }),
  C([1, 2], 'Kaldırımlar kimler için yapılmıştır?', 'Yayalar için', ['Arabalar için', 'Otobüsler için'], 'Kaldırımlar yayaların güvenle yürümesi içindir.'),
  C([1, 2, 3], 'Arabada yolculuk yaparken ne yapmalıyız?', 'Emniyet kemerimizi takmalıyız', ['Pencereden sarkmalıyız', 'Ayakta durmalıyız'], 'Arabada her zaman emniyet kemeri takarız; çocuklar arka koltukta oturur.', { kind: 'image', img: 'car' }),
  C([1, 2, 3], 'Bisiklete binerken neyi takmalıyız?', 'Kask', ['Şapka', 'Güneş gözlüğü'], 'Kask, düşersek başımızı korur.', { kind: 'image', img: 'bicycle' }),
  C([1, 2, 3], 'Acil bir durumda hangi numarayı ararız?', '112', ['123', '911'], 'Türkiye’de acil çağrı numarası 112’dir.', { kind: 'image', img: 'ambulance' }),
  C([1, 2, 3], 'Tanımadığın biri seni arabasına çağırırsa ne yaparsın?', 'Gitmem ve güvendiğim bir büyüğe haber veririm', ['Hemen binerim', 'Şeker verirse giderim'], 'Tanımadığımız kişilerle hiçbir yere gitmeyiz ve hemen bir büyüğe söyleriz.'),
  C([1], 'Biri izin almadan sana dokunmak isterse ne yaparsın?', '“Hayır!” der ve güvendiğim bir büyüğe anlatırım', ['Sessiz kalırım', 'Kimseye söylemem'], 'Kişisel alanımız bize aittir; “hayır” deriz ve güvendiğimiz bir büyüğe anlatırız.'),
  C([2, 3], 'İnternette tanımadığın biri adresini sorarsa ne yaparsın?', 'Paylaşmam, aileme söylerim', ['Hemen yazarım', 'Okulumun adını söylerim'], 'Kişisel bilgilerimizi internette paylaşmayız.', { kind: 'image', img: 'phone' }),
  C([1, 2, 3], 'Deprem sırasında ne yapmalıyız?', 'Çök, kapan, tutun', ['Koşarak merdivenden inmek', 'Pencereye gitmek'], 'Deprem anında sağlam bir masanın yanına çöker, başımızı korur ve tutunuruz.'),
  C([2, 3], 'Okul servisinden inerken ne yapmalıyız?', 'Servis tam durduktan sonra inmeliyiz', ['Servis giderken atlamalıyız', 'Servisin önünden koşmalıyız'], 'Servis tamamen durmadan inmeyiz; aracın önünden ve arkasından geçmeyiz.'),
  C([3], 'Yangın alarmı çaldığında ne yapmalıyız?', 'Sakin olup öğretmenimizin yönlendirmesiyle dışarı çıkarız', ['Sınıfta saklanırız', 'Çantamızı toplamaya çalışırız'], 'Panik yapmadan, tahliye planına uyarak binayı terk ederiz.', { kind: 'image', img: 'fire' }),
]

const SAGLIK_SORT: Gen = (rng) =>
  sort(rng, {
    prompt: 'Besinleri doğru tabağa yerleştir!',
    bins: [
      { id: 'saglikli', label: 'Sık tüketelim', img: 'broccoli', color: '#5bc236' },
      { id: 'az', label: 'Az tüketelim', img: 'donut', color: '#ff9a2e' },
    ],
    items: [
      { ...I('broccoli', 'Brokoli'), bin: 'saglikli' }, { ...I('apple', 'Elma'), bin: 'saglikli' }, { ...I('carrot', 'Havuç'), bin: 'saglikli' }, { ...I('milk', 'Süt'), bin: 'saglikli' },
      { ...I('fish2', 'Balık'), bin: 'saglikli' }, { ...I('salad', 'Salata'), bin: 'saglikli' }, { ...I('banana', 'Muz'), bin: 'saglikli' },
      { ...I('hamburger', 'Hamburger'), bin: 'az' }, { ...I('fries', 'Patates kızartması'), bin: 'az' }, { ...I('donut', 'Tatlı çörek'), bin: 'az' },
      { ...I('candy', 'Şeker'), bin: 'az' }, { ...I('chocolate', 'Çikolata'), bin: 'az' }, { ...I('lollipop', 'Lolipop'), bin: 'az' },
    ],
    explain: 'Meyve, sebze, süt ve balık büyümemiz için gereklidir. Şekerli ve kızartılmış yiyecekleri az tüketmeliyiz.',
  })
const SAGLIK: BankItem[] = [
  C([1, 2, 3], 'Dişlerimizi günde en az kaç kez fırçalamalıyız?', '2 kez', ['Haftada 1 kez', 'Hiç'], 'Sabah kahvaltıdan sonra ve gece yatmadan önce dişlerimizi fırçalarız.', { kind: 'image', img: 'toothbrush' }),
  C([1, 2, 3], 'Yemekten önce ne yapmalıyız?', 'Ellerimizi sabunla yıkamalıyız', ['Televizyon açmalıyız', 'Hemen yemeğe başlamalıyız'], 'Ellerimizi sabunla yıkayarak mikroplardan korunuruz.', { kind: 'image', img: 'soap' }),
  C([1, 2], 'Hangisi sağlıklı bir alışkanlıktır?', 'Düzenli uyumak ve hareket etmek', ['Gece geç saate kadar ekrana bakmak', 'Kahvaltı yapmamak'], 'Düzenli uyku, hareket ve kahvaltı sağlıklı büyümemizi sağlar.'),
  C([2, 3], 'Gün içinde en çok neyi içmeliyiz?', 'Su', ['Gazlı içecek', 'Meyve suyu tozu'], 'Vücudumuzun en çok ihtiyaç duyduğu içecek sudur.', { kind: 'image', img: 'droplet' }),
]

const ULKEM: BankItem[] = [
  C([1, 2, 3], 'Türkiye’nin başkenti neresidir?', 'Ankara', ['İstanbul', 'İzmir'], 'Başkentimiz Ankara’dır.'),
  C([1], 'Bayrağımızın renkleri nelerdir?', 'Kırmızı ve beyaz', ['Mavi ve beyaz', 'Yeşil ve sarı'], 'Türk bayrağı kırmızı zemin üzerinde beyaz ay ve yıldızdan oluşur.'),
  C([1], 'Bayrağımızda hangi şekiller vardır?', 'Ay ve yıldız', ['Güneş ve bulut', 'Kalp ve çiçek'], 'Bayrağımızda beyaz ay ve yıldız bulunur.'),
  C([1, 2], 'Millî marşımızın adı nedir?', 'İstiklâl Marşı', ['Onuncu Yıl Marşı', 'Gençlik Marşı'], 'Millî marşımız İstiklâl Marşı’dır.'),
  C([2, 3], 'İstiklâl Marşı’nın şairi kimdir?', 'Mehmet Âkif Ersoy', ['Yunus Emre', 'Nasreddin Hoca'], 'İstiklâl Marşı’nı Mehmet Âkif Ersoy yazmıştır.'),
  C([1, 2, 3], 'Cumhuriyetimizin kurucusu kimdir?', 'Mustafa Kemal Atatürk', ['Mehmet Âkif Ersoy', 'Mimar Sinan'], 'Türkiye Cumhuriyeti’nin kurucusu Mustafa Kemal Atatürk’tür.'),
  C([1, 2, 3], '23 Nisan hangi bayramdır?', 'Ulusal Egemenlik ve Çocuk Bayramı', ['Cumhuriyet Bayramı', 'Zafer Bayramı'], '23 Nisan 1920’de Türkiye Büyük Millet Meclisi açıldı; Atatürk bu günü çocuklara armağan etti.'),
  C([1, 2, 3], '29 Ekim hangi bayramdır?', 'Cumhuriyet Bayramı', ['Zafer Bayramı', 'Çocuk Bayramı'], '29 Ekim 1923’te Cumhuriyet ilan edildi.'),
  C([2, 3], '19 Mayıs hangi bayramdır?', 'Atatürk’ü Anma, Gençlik ve Spor Bayramı', ['Cumhuriyet Bayramı', 'Zafer Bayramı'], '19 Mayıs 1919’da Atatürk Samsun’a çıkarak Millî Mücadele’yi başlattı.'),
  C([2, 3], '30 Ağustos hangi bayramdır?', 'Zafer Bayramı', ['Çocuk Bayramı', 'Cumhuriyet Bayramı'], '30 Ağustos 1922 Büyük Zafer’in yıl dönümüdür.'),
  C([1, 2], 'Atatürk’ün annesinin adı nedir?', 'Zübeyde Hanım', ['Makbule Hanım', 'Ayşe Hanım'], 'Atatürk’ün annesi Zübeyde Hanım’dır.'),
  C([2, 3], 'Atatürk nerede doğmuştur?', 'Selanik', ['Ankara', 'Samsun'], 'Atatürk 1881’de Selanik’te doğdu.'),
  C([2, 3], 'Bir köyü kim yönetir?', 'Muhtar', ['Vali', 'Kaymakam'], 'Köyü muhtar, ilçeyi kaymakam, ili vali yönetir.'),
  C([3], 'Bir ili kim yönetir?', 'Vali', ['Muhtar', 'Kaymakam'], 'İl yöneticisi validir.'),
  C([3], 'Türkiye’nin yönetim şekli nedir?', 'Cumhuriyet', ['Krallık', 'Padişahlık'], 'Türkiye bir cumhuriyettir; halk kendi yöneticilerini seçer.'),
  C([1, 2], 'Ramazan Bayramı ve Kurban Bayramı nasıl bayramlardır?', 'Dinî bayramlar', ['Millî bayramlar', 'Spor bayramları'], 'Ramazan ve Kurban Bayramı dinî bayramlarımızdır.'),
]

const DOGA: BankItem[] = [
  C([1], 'Bize ışık ve ısı veren gök cismi hangisidir?', I('sun2', 'Güneş'), [I('moon', 'Ay'), I('star2', 'Yıldız')], 'Güneş bize ışık ve ısı verir.'),
  C([1], 'Üzerinde yaşadığımız gök cismi hangisidir?', I('earth', 'Dünya'), [I('moon', 'Ay'), I('sun2', 'Güneş')], 'Biz Dünya’da yaşarız.'),
  C([2], 'Kar en çok hangi mevsimde yağar?', I('snowflake', 'Kış'), [I('sun2', 'Yaz'), I('cherryblossom', 'İlkbahar')], 'Kar genellikle kışın yağar.'),
  C([2], 'Yaprakların sararıp döküldüğü mevsim hangisidir?', I('leaf', 'Sonbahar'), [I('snowflake', 'Kış'), I('cherryblossom', 'İlkbahar')], 'Sonbaharda yapraklar sararır ve dökülür.'),
  C([2], 'Ağaçların çiçek açtığı mevsim hangisidir?', I('cherryblossom', 'İlkbahar'), [I('leaf', 'Sonbahar'), I('snowflake', 'Kış')], 'İlkbaharda ağaçlar çiçek açar.'),
  C([2, 3], 'Güneş hangi yönden doğar?', 'Doğu', ['Batı', 'Kuzey'], 'Güneş doğudan doğar, batıdan batar.', { kind: 'image', img: 'sunrise' }),
  C([2, 3], 'Pusulanın ibresi hangi yönü gösterir?', 'Kuzey', ['Güney', 'Doğu'], 'Pusulanın ibresi her zaman kuzeyi gösterir.', { kind: 'image', img: 'compass' }),
  C([2, 3], 'Dişlerimizi fırçalarken musluğu ne yapmalıyız?', 'Kapatmalıyız', ['Açık bırakmalıyız', 'Sonuna kadar açmalıyız'], 'Suyu boşa akıtmayarak kaynaklarımızı koruruz.'),
  C([1, 2, 3], 'Kullandığımız kâğıtları nereye atmalıyız?', 'Geri dönüşüm kutusuna', ['Yere', 'Denize'], 'Kâğıt geri dönüştürülebilir; geri dönüşüm kutusuna atarız.', { kind: 'image', img: 'recycle' }),
  C([1, 2, 3], 'Afet çantasında hangisi bulunmalıdır?', 'Su ve el feneri', ['Oyun konsolu', 'Dondurma'], 'Afet çantasında su, el feneri, ilk yardım malzemesi gibi temel ihtiyaçlar bulunur.'),
  C([3], 'Sel tehlikesinde nereye gitmeliyiz?', 'Yüksek yerlere', ['Dere kenarına', 'Bodruma'], 'Sel sırasında yüksek ve güvenli yerlere çıkarız.', { kind: 'image', img: 'rain' }),
]

const OKUL: BankItem[] = [
  C([1, 2], 'Sınıfta söz almak için ne yaparız?', 'Parmak kaldırırız', ['Bağırırız', 'Sıradan kalkarız'], 'Söz almak için parmak kaldırır, sıramızı bekleriz.'),
  C([1, 2], 'Birinden bir şey isterken hangi sözü kullanırız?', 'Lütfen', ['Hemen', 'Çabuk'], 'Kibarca “lütfen” deriz.'),
  C([1, 2], 'Bize yardım edildiğinde ne deriz?', 'Teşekkür ederim', ['Hoşça kal', 'Geçmiş olsun'], 'Yardım alınca teşekkür ederiz.'),
  C([1, 2, 3], 'Bir odaya girmeden önce ne yaparız?', 'Kapıyı çalarız', ['Hızla açarız', 'Bağırırız'], 'Kapıyı çalıp izin isteriz.'),
  C([2], 'Ödevlerimizi ve oyun zamanımızı düzenlemek için ne yapabiliriz?', 'Günlük plan yaparız', ['Hepsini son güne bırakırız', 'Hiç ödev yapmayız'], 'Plan yaparak zamanımızı iyi kullanırız.', { kind: 'image', img: 'calendar' }),
  C([3], 'Hastaları muayene eden ve tedavi eden kişi kimdir?', 'Doktor', ['Fırıncı', 'Çiftçi'], 'Doktorlar hastaları tedavi eder.', { kind: 'image', img: 'hospital' }),
  C([3], 'Yangınları söndüren kişi kimdir?', 'İtfaiyeci', ['Öğretmen', 'Postacı'], 'İtfaiyeciler yangınları söndürür ve insanları kurtarır.', { kind: 'image', img: 'firetruck' }),
  C([3], 'Hangisi bir çocuk hakkıdır?', 'Eğitim almak', ['Okula gitmemek', 'Kurallara uymamak'], 'Her çocuğun eğitim, sağlık, oyun ve korunma hakkı vardır.'),
  C([3], 'Yaşlı komşumuza nasıl yardım edebiliriz?', 'Alışveriş poşetlerini taşımasına yardım ederiz', ['Kapısını yüksek sesle çalarız', 'Görmezden geliriz'], 'Yardımlaşma toplumu güçlendirir.'),
]

/* =============================== FEN BİLİMLERİ =============================== */
const CANLILAR3_SORT: Gen = (rng) =>
  sort(rng, {
    prompt: 'Canlıları doğru gruba yerleştir!',
    bins: [
      { id: 'bitki', label: 'Bitki', img: 'seedling', color: '#5bc236' },
      { id: 'hayvan', label: 'Hayvan', img: 'paw', color: '#ff9a2e' },
      { id: 'mantar', label: 'Mantar', img: 'mushroom', color: '#9b6ef3' },
    ],
    items: [
      { ...I('sunflower', 'Ayçiçeği'), bin: 'bitki' }, { ...I('cactus', 'Kaktüs'), bin: 'bitki' }, { ...I('tree', 'Ağaç'), bin: 'bitki' },
      { ...I('dog', 'Köpek'), bin: 'hayvan' }, { ...I('bee', 'Arı'), bin: 'hayvan' }, { ...I('fish', 'Balık'), bin: 'hayvan' }, { ...I('frog', 'Kurbağa'), bin: 'hayvan' },
      { ...I('mushroom', 'Şapkalı mantar'), bin: 'mantar' },
    ],
    count: 6,
    explain: 'Canlılar; bitkiler, hayvanlar, mantarlar ve mikroskobik canlılar olarak gruplandırılabilir.',
  })
const CANLILAR: BankItem[] = [
  C([3], 'Kokuları hangi duyu organımızla alırız?', I('nose', 'Burun'), [I('ear', 'Kulak'), I('eyes', 'Göz'), I('tongue', 'Dil')], 'Burnumuz koku alma organımızdır.'),
  C([3], 'Tatları hangi duyu organımızla alırız?', I('tongue', 'Dil'), [I('nose', 'Burun'), I('ear', 'Kulak'), I('eyes', 'Göz')], 'Dilimizle tatlı, tuzlu, ekşi ve acıyı ayırt ederiz.'),
  C([3], 'Sesleri hangi duyu organımızla duyarız?', I('ear', 'Kulak'), [I('eyes', 'Göz'), I('nose', 'Burun'), I('tongue', 'Dil')], 'Kulaklarımızla duyarız.'),
  C([3], 'Renkleri ve şekilleri hangi duyu organımızla görürüz?', I('eyes', 'Göz'), [I('ear', 'Kulak'), I('tongue', 'Dil'), I('nose', 'Burun')], 'Gözlerimizle görürüz.'),
  C([3], 'Sıcak ve soğuğu hangi duyu organımızla hissederiz?', 'Deri', ['Kulak', 'Göz'], 'Derimiz dokunma, sıcaklık ve acıyı hisseder.'),
  C([3], 'Kelebeğin yaşam döngüsünde tırtıldan sonra hangi evre gelir?', 'Pupa (koza)', ['Yumurta', 'İribaş'], 'Kelebek: yumurta → tırtıl → pupa → kelebek.', { kind: 'image', img: 'butterfly' }),
  C([3], 'Hangisi gözle göremeyeceğimiz kadar küçük bir canlıdır?', I('microbe', 'Mikroskobik canlı'), [I('ant', 'Karınca'), I('ladybug', 'Uğur böceği')], 'Mikroskobik canlıları ancak mikroskopla görebiliriz.'),
  C([4], 'Hangisi bilinçli bir tüketici davranışıdır?', 'İhtiyacımız kadar satın almak', ['Gereksiz yere çok alışveriş yapmak', 'Atıkları ayırmadan çöpe atmak'], 'Bilinçli tüketici ihtiyacı kadar alır, israf etmez.'),
  C([4], 'Hangisi su tasarrufu sağlar?', 'Duşta kısa süre kalmak', ['Musluğu açık bırakmak', 'Bahçeyi öğlen sulamak'], 'Suyu dikkatli kullanarak doğal kaynakları koruruz.'),
  C([4], 'Geri dönüşümün doğaya faydası nedir?', 'Doğal kaynakları korur', ['Çöpü artırır', 'Havayı kirletir'], 'Geri dönüşüm kaynak kullanımını ve atığı azaltır.', { kind: 'image', img: 'recycle' }),
]

const MADDE3_SORT: Gen = (rng) =>
  sort(rng, {
    prompt: 'Maddeleri hâllerine göre ayır!',
    bins: [
      { id: 'kati', label: 'Katı', img: 'rock', color: '#a0673a' },
      { id: 'sivi', label: 'Sıvı', img: 'droplet', color: '#2ec4c9' },
      { id: 'gaz', label: 'Gaz', img: 'balloon', color: '#9b6ef3' },
    ],
    items: [
      { ...I('rock', 'Taş'), bin: 'kati' }, { ...I('wood', 'Tahta'), bin: 'kati' }, { ...I('ice', 'Buz'), bin: 'kati' }, { ...I('pencil', 'Kalem'), bin: 'kati' },
      { ...I('milk', 'Süt'), bin: 'sivi' }, { ...I('droplet', 'Su'), bin: 'sivi' }, { ...I('honey', 'Bal'), bin: 'sivi' },
      { label: 'Balonun içindeki hava', img: 'balloon', bin: 'gaz' }, { label: 'Su buharı', bin: 'gaz' }, { label: 'Soluduğumuz hava', bin: 'gaz' },
    ],
    explain: 'Katıların belirli bir şekli vardır; sıvılar konuldukları kabın şeklini alır; gazlar bulundukları ortama yayılır.',
  })
const MADDE: BankItem[] = [
  C([3], 'Kum ile demir tozlarını hangi yöntemle ayırırız?', 'Mıknatısla', ['Süzerek', 'Dinlendirerek'], 'Mıknatıs demir tozlarını çeker, kumu çekmez.', { kind: 'image', img: 'magnet' }),
  C([3], 'Undaki iri parçaları hangi yöntemle ayırırız?', 'Eleme', ['Mıknatıs', 'Yüzdürme'], 'Elek, küçük taneleri geçirir, iri parçaları tutar.'),
  C([3], 'Kumlu suyu kâğıt filtreden geçirerek ayırmaya ne denir?', 'Süzme', ['Eleme', 'Mıknatısla ayırma'], 'Süzgeç kâğıdı suyu geçirir, kumu tutar.'),
  C([3], 'Tahta talaşı ve kum karışımını su ile ayırmaya ne denir?', 'Yüzdürme', ['Eleme', 'Süzme'], 'Tahta talaşı suyun üstünde yüzer, kum dibe çöker.'),
  C([4], 'Buzun ısınarak suya dönüşmesine ne denir?', 'Erime', ['Donma', 'Yoğuşma'], 'Katı maddenin ısı alarak sıvı hâle geçmesi erimedir.', { kind: 'image', img: 'ice' }),
  C([4], 'Suyun soğuyarak buza dönüşmesine ne denir?', 'Donma', ['Erime', 'Buharlaşma'], 'Sıvının ısı vererek katı hâle geçmesi donmadır.', { kind: 'image', img: 'snowflake' }),
  C([4], 'Islak çamaşırların kurumasına ne sebep olur?', 'Buharlaşma', ['Donma', 'Erime'], 'Çamaşırdaki su ısı alarak buharlaşır.'),
  C([4], 'Soğuk bir bardağın dış yüzeyinde su damlacıkları oluşmasına ne denir?', 'Yoğuşma', ['Erime', 'Donma'], 'Havadaki su buharı soğuk yüzeye değince yoğuşarak sıvıya dönüşür.', { kind: 'image', img: 'droplet' }),
]

const ITME_CEKME: Gen = (rng) =>
  sort(rng, {
    prompt: 'Hangi hareket İTME, hangisi ÇEKME?',
    bins: [
      { id: 'itme', label: 'İtme', color: '#ff9a2e' },
      { id: 'cekme', label: 'Çekme', color: '#2ec4c9' },
    ],
    items: [
      { label: 'Alışveriş arabasını ileri sürmek', img: 'cart', bin: 'itme' }, { label: 'Topa tekme atmak', img: 'ball', bin: 'itme' }, { label: 'Salıncaktaki arkadaşını sallamak', bin: 'itme' }, { label: 'Kapıyı dışarı doğru açmak', bin: 'itme' },
      { label: 'Kuyudan kova ile su çekmek', bin: 'cekme' }, { label: 'Halat çekme oyunu', bin: 'cekme' }, { label: 'Çekmeceyi açmak', bin: 'cekme' }, { label: 'Uçurtmayı ipinden çekmek', img: 'kite', bin: 'cekme' },
    ],
    explain: 'Bir cismi kendimizden uzaklaştırıyorsak itme, kendimize yaklaştırıyorsak çekme kuvveti uygularız.',
  })
const MIKNATIS: Gen = (rng) =>
  sort(rng, {
    prompt: 'Mıknatıs hangisini ÇEKER, hangisini ÇEKMEZ?',
    bins: [
      { id: 'ceker', label: 'Çeker', img: 'magnet', color: '#e8463c' },
      { id: 'cekmez', label: 'Çekmez', color: '#8a8a8a' },
    ],
    items: [
      { label: 'Ataş', img: 'paperclip', bin: 'ceker' }, { label: 'Demir çivi', bin: 'ceker' }, { label: 'Toplu iğne', bin: 'ceker' }, { label: 'Çelik vida', bin: 'ceker' },
      { label: 'Tahta kalem', img: 'pencil', bin: 'cekmez' }, { label: 'Kâğıt', img: 'newspaper', bin: 'cekmez' }, { label: 'Cam şişe', img: 'bottle', bin: 'cekmez' }, { label: 'Plastik oyuncak', img: 'teddy', bin: 'cekmez' },
    ],
    explain: 'Mıknatıs demir, nikel ve kobalt içeren maddeleri çeker; tahta, kâğıt, cam ve plastiği çekmez.',
  })
const KUVVET: BankItem[] = [
  C([3], 'Dönme dolabın hareketi hangi harekettir?', 'Dönme hareketi', ['Sallanma hareketi', 'Durma'], 'Dönme dolap bir merkez etrafında döner.'),
  C([3], 'Salıncağın hareketi hangi harekettir?', 'Sallanma hareketi', ['Dönme hareketi', 'Yuvarlanma'], 'Salıncak ileri geri sallanır.'),
  C([3], 'Kuvvet hareket eden bir cisme ne yapabilir?', 'Hızlandırabilir, yavaşlatabilir veya yönünü değiştirebilir', ['Rengini değiştirir', 'Hiçbir şey yapmaz'], 'Kuvvet cismin hızını ve yönünü değiştirebilir.'),
  C([4], 'Mıknatısın uçlarına ne ad verilir?', 'Kutup', ['Kenar', 'Köşe'], 'Mıknatısın N (kuzey) ve S (güney) olmak üzere iki kutbu vardır.', { kind: 'image', img: 'magnet' }),
  C([4], 'İki mıknatısın aynı kutupları birbirine yaklaştırılırsa ne olur?', 'Birbirini iter', ['Birbirini çeker', 'Erir'], 'Aynı kutuplar iter, zıt kutuplar çeker.'),
]

const ELEKTRIK: BankItem[] = [
  C([3, 4], 'Hangisi elektrikle çalışır?', I('laptop', 'Bilgisayar'), [I('bicycle', 'Bisiklet'), I('book2', 'Kitap')], 'Bilgisayar elektrik enerjisiyle çalışır.'),
  C([3], 'Prize ne sokmamalıyız?', 'Çatal, makas gibi metal cisimler', ['Lambanın fişi', 'Şarj aletinin fişi'], 'Prize metal cisim sokmak elektrik çarpmasına yol açar; prizlere yalnızca fiş takılır.', { kind: 'image', img: 'plug' }),
  C([3], 'Islak ellerle elektrikli araçlara dokunursak ne olabilir?', 'Elektrik çarpabilir', ['Hiçbir şey olmaz', 'Araç daha iyi çalışır'], 'Su elektriği iletir; ıslak elle elektrikli araçlara dokunmayız.'),
  C([3, 4], 'Odadan çıkarken ışığı ne yapmalıyız?', 'Kapatmalıyız', ['Açık bırakmalıyız', 'Daha parlak yapmalıyız'], 'Gereksiz yanan ışıkları kapatarak elektrik tasarrufu yaparız.', { kind: 'image', img: 'bulb2' }),
  C([4], 'Basit bir elektrik devresinde ampulün yanması için hangisi GEREKLİDİR?', 'Pil', ['Mıknatıs', 'Ayna'], 'Pil, devreye elektrik enerjisi sağlar.', { kind: 'image', img: 'battery' }),
  C([4], 'Devredeki anahtar ne işe yarar?', 'Devreyi açıp kapatır', ['Ampulü boyar', 'Pili şarj eder'], 'Anahtar kapalıyken akım geçer, açıkken geçmez.'),
  C([4], 'Devrede kablo kopuksa ampul ne olur?', 'Yanmaz', ['Daha parlak yanar', 'Renk değiştirir'], 'Devre tamamlanmadığı için akım geçmez, ampul yanmaz.'),
]

const DUNYA: BankItem[] = [
  C([3], 'Canlı kalıntılarının ya da izlerinin taşlaşmış hâline ne denir?', 'Fosil', ['Maden', 'Kum'], 'Fosiller, milyonlarca yıl önce yaşamış canlıların izleridir.', { kind: 'image', img: 'bone' }),
  C([3], 'Fosilleri inceleyen bilim insanına ne denir?', 'Paleontolog', ['Doktor', 'Pilot'], 'Paleontologlar fosilleri inceleyerek geçmişteki canlıları araştırır.', { kind: 'image', img: 'dino' }),
  C([3], 'Demir, bakır ve altın birer nedir?', 'Maden', ['Bitki', 'Hayvan'], 'Bunlar yer kabuğundan çıkarılan madenlerdir.', { kind: 'image', img: 'gem' }),
  C([4], 'Dünya’nın kendi ekseni etrafında dönmesi sonucunda ne oluşur?', 'Gece ve gündüz', ['Mevsimler', 'Depremler'], 'Dünya kendi etrafında döndükçe Güneş’i gören taraf gündüz, diğer taraf gece olur.', { kind: 'image', img: 'earth' }),
  C([4], 'Dünya, Güneş’in etrafındaki bir turunu ne kadar sürede tamamlar?', '1 yılda', ['1 günde', '1 haftada'], 'Dünya, Güneş etrafındaki dolanımını yaklaşık 365 günde (1 yıl) tamamlar.'),
  C([4], 'Dünya’nın şekli neye benzer?', 'Küreye', ['Küpe', 'Silindire'], 'Dünya’nın şekli küreye benzer.', { kind: 'image', img: 'earth' }),
  C([4], 'Süt, yumurta ve balıkta bol bulunan, büyümemizi sağlayan besin öğesi hangisidir?', 'Protein', ['Karbonhidrat', 'Yağ'], 'Proteinler vücudumuzun büyümesini ve onarılmasını sağlar.', { kind: 'image', img: 'milk' }),
  C([4], 'Ekmek ve makarnada bol bulunan, bize enerji veren besin öğesi hangisidir?', 'Karbonhidrat', ['Vitamin', 'Su'], 'Karbonhidratlar vücudumuza enerji verir.', { kind: 'image', img: 'bread' }),
  C([4], 'Meyve ve sebzelerde bol bulunan, hastalıklardan korunmamıza yardım eden besin öğesi hangisidir?', 'Vitamin', ['Yağ', 'Protein'], 'Vitaminler vücut direncimizi artırır.', { kind: 'image', img: 'orange' }),
]

/* =============================== SOSYAL BİLGİLER (4) =============================== */
const HARITA: BankItem[] = [
  C([4], 'Harita anahtarı (lejant) ne işe yarar?', 'Haritadaki işaretlerin ne anlama geldiğini gösterir', ['Haritayı katlamaya yarar', 'Haritanın rengini değiştirir'], 'Harita anahtarı, haritadaki simgelerin anlamlarını açıklar.', { kind: 'image', img: 'map' }),
  C([4], 'Haritalarda mavi renk genellikle neyi gösterir?', 'Deniz, göl ve akarsuları', ['Dağları', 'Ormanları'], 'Haritalarda su kaynakları mavi renkle gösterilir.'),
  C([4], 'Kuzeyin tam tersi hangi yöndür?', 'Güney', ['Doğu', 'Batı'], 'Ana yönler: kuzey–güney, doğu–batı birbirinin tersidir.', { kind: 'image', img: 'compass' }),
  C([4], 'Sabah yüzünü Güneş’in doğduğu yöne dönersen sağ tarafın hangi yön olur?', 'Güney', ['Kuzey', 'Batı'], 'Doğuya döndüğümüzde sağımız güney, solumuz kuzeydir.'),
  C([4], 'Bir yerin basit bir çizimle kuşbakışı gösterilmesine ne denir?', 'Kroki', ['Fotoğraf', 'Tablo'], 'Kroki, bir yeri ölçek kullanmadan basitçe gösteren çizimdir.'),
  C([4], 'Navigasyon uygulamaları ne işe yarar?', 'Gideceğimiz yere yol bulmamıza', ['Oyun oynamaya', 'Müzik dinlemeye'], 'Navigasyon, konumumuzu ve gideceğimiz yolu gösterir.', { kind: 'image', img: 'phone' }),
]
const EKONOMI_SORT: Gen = (rng) =>
  sort(rng, {
    prompt: 'İhtiyaç mı, istek mi? Doğru kutuya yerleştir!',
    bins: [
      { id: 'ihtiyac', label: 'İhtiyaç', color: '#2ec4c9' },
      { id: 'istek', label: 'İstek', color: '#ff7aa8' },
    ],
    items: [
      { ...I('droplet', 'İçme suyu'), bin: 'ihtiyac' }, { ...I('bread', 'Ekmek'), bin: 'ihtiyac' }, { ...I('house', 'Barınacak ev'), bin: 'ihtiyac' }, { ...I('tshirt', 'Mevsime uygun giysi'), bin: 'ihtiyac' }, { ...I('hospital', 'Sağlık hizmeti'), bin: 'ihtiyac' },
      { ...I('videogame', 'Yeni oyun konsolu'), bin: 'istek' }, { ...I('teddy', 'Yeni oyuncak'), bin: 'istek' }, { ...I('lollipop', 'Şeker'), bin: 'istek' }, { ...I('sunglasses', 'Moda gözlük'), bin: 'istek' },
    ],
    explain: 'Yaşamak için mutlaka gereken şeyler ihtiyaç; olmasa da yaşayabileceğimiz şeyler istektir. Önce ihtiyaçlar karşılanır.',
  })
const EKONOMI_ORDER: Gen = () =>
  order({
    prompt: 'Ekmeğin yolculuğunu sırala: üretimden tüketime!',
    spoken: 'Ekmeğin yolculuğunu doğru sıraya diz.',
    pieces: ['Buğday tarlada yetişir', 'Değirmende un olur', 'Fırında ekmek yapılır', 'Markete taşınır', 'Evde afiyetle yenir'],
    joiner: ' → ',
    style: 'chain',
    explain: 'Üretim (tarla, değirmen, fırın) → dağıtım (markete taşıma) → tüketim (evde yeme).',
  })
const TARIH: BankItem[] = [
  C([4], 'Türkiye Büyük Millet Meclisi hangi tarihte açıldı?', '23 Nisan 1920', ['29 Ekim 1923', '19 Mayıs 1919'], 'TBMM 23 Nisan 1920’de Ankara’da açıldı.'),
  C([4], 'Cumhuriyet hangi tarihte ilan edildi?', '29 Ekim 1923', ['23 Nisan 1920', '30 Ağustos 1922'], 'Cumhuriyet 29 Ekim 1923’te ilan edildi.'),
  C([4], 'Atatürk Millî Mücadele’yi başlatmak için Samsun’a hangi tarihte çıktı?', '19 Mayıs 1919', ['29 Ekim 1923', '23 Nisan 1920'], 'Atatürk 19 Mayıs 1919’da Samsun’a çıktı.'),
  C([4], 'Türkiye Cumhuriyeti’nin ilk cumhurbaşkanı kimdir?', 'Mustafa Kemal Atatürk', ['İsmet İnönü', 'Kâzım Karabekir'], 'İlk cumhurbaşkanımız Mustafa Kemal Atatürk’tür.'),
  C([4], 'Cumhuriyetle birlikte hangi yeni alfabe kabul edildi?', 'Latin harfli yeni Türk alfabesi', ['Çin alfabesi', 'Hiçbir alfabe'], '1928’de Harf Devrimi ile Latin harfli yeni Türk alfabesi kabul edildi.'),
  C([4], 'Hangisi geleneksel bir çocuk oyunudur?', 'Saklambaç', ['Bilgisayar oyunu', 'Tablet oyunu'], 'Saklambaç, körebe ve yakan top kuşaktan kuşağa aktarılan geleneksel oyunlardır.'),
  C([4], 'Aile tarihimizi öğrenmek için en iyi kime danışabiliriz?', 'Büyükanne ve büyükbabamıza', ['Hiç kimseye', 'Yalnızca internete'], 'Aile büyüklerimiz aile tarihimizin canlı tanıklarıdır.'),
  C([4], 'Okulda sınıf başkanı nasıl seçilmelidir?', 'Öğrencilerin oylarıyla', ['Öğretmenin rastgele seçmesiyle', 'En uzun boylu öğrenci olarak'], 'Demokratik seçimde herkes oy kullanır ve sonuca saygı gösterilir.'),
]
const DIJITAL_SORT: Gen = (rng) =>
  sort(rng, {
    prompt: 'Bu davranışlar internette güvenli mi?',
    bins: [
      { id: 'guvenli', label: 'Güvenli', img: 'shield', color: '#5bc236' },
      { id: 'riskli', label: 'Güvensiz', img: 'lock', color: '#e8463c' },
    ],
    items: [
      { label: 'Şifremi kimseyle paylaşmamak', bin: 'guvenli' }, { label: 'Garip bir mesajı aileme göstermek', bin: 'guvenli' }, { label: 'Ekran süresi kurallarına uymak', bin: 'guvenli' }, { label: 'Siber zorbalığı bir büyüğe anlatmak', bin: 'guvenli' },
      { label: 'Tanımadığım birine adresimi yazmak', bin: 'riskli' }, { label: 'Arkadaşımın fotoğrafını izinsiz paylaşmak', bin: 'riskli' }, { label: 'Bilmediğim bağlantılara tıklamak', bin: 'riskli' }, { label: 'Birine kırıcı yorum yazmak', bin: 'riskli' },
    ],
    explain: 'Kişisel bilgilerimizi korur, başkalarının mahremiyetine saygı gösterir ve sorun yaşarsak bir büyüğe söyleriz.',
  })

/* =============================== ÜRETİCİLER =============================== */
const mix = (sorter: Gen, bank: BankItem[], p = 0.4): Gen => (rng, grade, level, history) => {
  const last = history[history.length - 1]
  if (last?.type !== 'sort' && rng() < p) return sorter(rng, grade, level, history)
  return fromBank(bank, rng, grade, level, history)
}

export const trafikGuvenlik: Gen = (rng, g, l, h) => fromBank(TRAFIK, rng, g, l, h)
export const saglikliYasam: Gen = mix(SAGLIK_SORT, SAGLIK, 0.5)
export const ulkem: Gen = (rng, g, l, h) => fromBank(ULKEM, rng, g, l, h)
export const dogaCevre: Gen = (rng, g, l, h) => fromBank(DOGA, rng, g, l, h)
export const okulAile: Gen = (rng, g, l, h) => fromBank(OKUL, rng, g, l, h)

export const canlilar: Gen = (rng, g, l, h) => (g === 3 ? mix(CANLILAR3_SORT, CANLILAR, 0.35)(rng, g, l, h) : fromBank(CANLILAR, rng, g, l, h))
export const madde: Gen = (rng, g, l, h) => (g === 3 ? mix(MADDE3_SORT, MADDE, 0.45)(rng, g, l, h) : fromBank(MADDE, rng, g, l, h))
export const kuvvetMiknatis: Gen = (rng, g, l, h) => mix(g === 3 ? ITME_CEKME : MIKNATIS, KUVVET, 0.55)(rng, g, l, h)
export const elektrik: Gen = (rng, g, l, h) => fromBank(ELEKTRIK, rng, g, l, h)
export const dunyamiz: Gen = (rng, g, l, h) => fromBank(DUNYA, rng, g, l, h)

export const haritaYon: Gen = (rng, g, l, h) => fromBank(HARITA, rng, g, l, h)
export const ekonomi: Gen = (rng, g, l, h) => (h.some((q) => q.type === 'order') || rng() < 0.6 ? EKONOMI_SORT(rng, g, l, h) : EKONOMI_ORDER(rng, g, l, h))
export const ortakMiras: Gen = (rng, g, l, h) => fromBank(TARIH, rng, g, l, h)
export const dijitalVatandas: Gen = (rng, g, l, h) => (rng() < 0.7 ? DIJITAL_SORT(rng, g, l, h) : fromBank(TRAFIK.filter((t) => t.g.includes(3)), rng, 3, l, h))

