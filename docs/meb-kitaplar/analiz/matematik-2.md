# 2. Sınıf Matematik Ders Kitabı Analizi (MEB, Türkiye Yüzyılı Maarif Modeli)

Kaynak: `docs/meb-kitaplar/metin/2-matematik-ders-kitabi-1kitap.txt` ve `-2kitap.txt` (pdftotext). Görseller metne geçmediği için görsele dayalı ayrıntılar metinden çıkarıldı. Emin olunamayanlar **(?)** ile işaretlendi. Kazanım kodları kitapta basılı değil. Bölüm başlıkları `docs/meb/matematik-1-4.txt` (2. sınıf, s.50–84) ile eşleştirildi. Sınırlar kitap ile programın "Öğrenme-Öğretme Uygulamaları" metinlerinin birlikte okunmasıyla belirlendi.

## 0. Kitabın kendi başlıkları ve kuralları

1. sınıftaki DÜŞÜNELİM / BAĞLANTI KURALIM / ÖĞRENELİM yapısı **yok**. 2. sınıfta her alt bölüm şu sırayla ilerler:
- **HATIRLAYALIM**: önceki bilgiyi bir sahne üzerinden yoklar.
- **HAZIR MIYIZ?**: yeni konuya köprü kurar.
- **BAŞLAYALIM**: kavramı tanıtır. Etkinlikler numaralıdır (1, 2, 3…).
- **YAPALIM ÖĞRENELİM**: "1 ders saati" sürelik sınıf veya bahçe etkinliği. Malzemeler, Etkinliğe Hazırlık ve Etkinliğe Başlayalım bölümleri vardır, çoğu zaman "Evet/Hayır" öz değerlendirme tablosuyla biter.
- **Bilgi Kutusu**: tanım cümleleri, ör. "36 sayısının her bir rakamının yazıldığı bölüme basamak denir".
- **Haydi Yapalım** ve **Haydi Okuyalım**: kısa uzatma görevleri.
- Karekod etiketleri: **İzleyelim Öğrenelim** (video), **Oynayalım Öğrenelim** (EBA oyunu), **Çözelim Öğrenelim** (ek soru). Bunların içeriği metinde yok. "Gözlem Formu", "Değerlendirme Ölçeği" ve "Analitik Dereceli Puanlama Anahtarı" da karekoddadır.
- **TEMA DEĞERLENDİRME**: her tema sonunda 2–11 numaralı soru. Boşluk doldurma, eşleştirme, D/Y, şifre ve bulmaca ağırlıklıdır. **Çoktan seçmeli neredeyse hiç yok.** 1. sınıfın A/B/C/Ç bölümleri de yok.
- Her temanın başında **ANAHTAR KAVRAMLAR** sayfası vardır, sonunda Kısaltmalar/Semboller ve Sözlük gelir. Semboller: `+ − x ÷ =`, `TL ₺ kr. kg g m cm dk.`. **`<`, `>` sembolleri kitapta yok.** Karşılaştırma sözle yapılır: "daha yakındır", "fazla", "eksik", "eşit".
- **Kitapta sık geçen bulmaca biçimleri** (oyuna doğrudan çevrilebilir):
  - **D/Y labirenti**: "doğru ise D, yanlış ise Y yolundan ilerle, çıkışa ulaş" (sıvı, para, dört işlemde eşitlik).
  - **Şifre**: işlem sonucunun altına harf yazılır.
  - **Çapraz sayı bulmacası**: cevaplar okunuşuyla yazılır.
  - **Ritmik sayma labirenti**: "sincabı meşe palamuduna ulaştır".
  - **Sonuca göre boyama**: balonlar, gizli resim.
  - **Bilmece**: "18 ile 22 arasında, okunuşu tek kelime, 5 harfli" → yirmi.
  - **Aklından sayı tut**: 10 soru hakkı, sorular "29'dan büyük mü?", "14 ile 25 arasında mı?".
- **Karakterler** (konuşma balonlarıyla tanım verirler):
  - Ela ve Kerem: geometri, simetri.
  - Ayşe ve Ali: toplama-çıkarma, çarpma-bölme.
  - Nehir ve Kaan: kesir, para, zaman, ölçme.
  - Zeynep ve Yiğit: veri.
  - Yan karakterler bölüme göre değişir (Alya, Aybars, Sude, Mavi, Emir…). Öğretmen, anne ve dede de konuşur.
- Yönergeler "-elim/-alım" ekiyle yazılır (sayalım, eşleştirelim). Sorular günlük yaşam ve kültürle bağlantılıdır: Kız Kulesi, Göbeklitepe, Selimiye, Anıtkabir, Hacivat-Karagöz, mangala, 23 Nisan, huzurevi ziyareti, tasarruf.

## 1. Kitap yapısı ve kod eşleşmesi

Programdaki işleniş sırası kitapla aynıdır: Geometri 1 → Sayılar 1 → İşlemler → Sayılar 2 → Geometri 2 → Veri. 3. Tema iki kitaba bölünmüştür. Toplama-çıkarma 1. kitapta, çarpma-bölme ve tema değerlendirmesi 2. kitaptadır.

### 1. Kitap
| Tema | Bölüm (sayfa) | Kod |
|---|---|---|
| **1. Nesnelerin Geometrisi (1)** (s.10–53) | Geometrik Cisimler (12–21) | MAT.2.3.1 |
| | Geometrik Cisim Modelleri (22–26) | MAT.2.3.2 |
| | Geometrik Şekil Modelleri (27–34) | MAT.2.3.3 |
| | Geometrik Şekil ve Cisimlerin Biçimsel Özellikleri (35–41) | MAT.2.3.4 |
| | Sıvı Miktarını Tahmin Etme (42–47) | MAT.2.3.5 |
| | 1. Tema Değerlendirme (48–53) | |
| **2. Sayılar ve Nicelikler (1)** (s.54–131) | Sayılar (56–71) | MAT.2.1.1 |
| | Sayıları Çözümleme (72–89) | MAT.2.1.2 |
| | Sayıların Sırasını Belirleyebilme: sıra sayıları, cetvel, sayı doğrusu, en yakın onluk (90–102) | MAT.2.1.3 |
| | Ritmik Sayma (103–115) | MAT.2.1.4 |
| | Sayı ve Şekil Örüntüleri (116–120) | MAT.2.1.5 |
| | Nesne Sayısını Tahmin Etme (121–127) | MAT.2.1.6 |
| | 2. Tema Değerlendirme (128–131) | |
| **3. İşlemlerden Cebirsel Düşünmeye**, 1. kısım (s.132–159) | Toplama ve Çıkarma İşlemleriyle İlgili Problemler: eldeli toplama, onluk bozma, deste/düzine (134–145) | MAT.2.2.1 |
| | Toplama ve Çıkarmada Sonuç Tahmini ve Zihinden İşlem (146–153) | MAT.2.2.2 |
| | Toplama ve Çıkarma İşlemlerinin İlişkisi (154–159) | MAT.2.2.3 |

### 2. Kitap
| Tema | Bölüm (sayfa) | Kod |
|---|---|---|
| **3. İşlemlerden Cebirsel Düşünmeye**, 2. kısım (s.10–53) | Çarpma ve Bölme İşlemleri (12–31) | MAT.2.2.4 |
| | Çarpma ve Bölmede Sonuç Tahmini ve Zihinden İşlem (32–41) | MAT.2.2.5 |
| | Dört İşlemde Eşitlik (42–47) | MAT.2.2.6 |
| | 3. Tema Değerlendirme (48–53): toplama-çıkarma ve çarpma-bölme karışık | |
| **4. Sayılar ve Nicelikler (2)** (s.54–135) | Kesirler: bütün, yarım, çeyrek (56–65) | MAT.2.1.7 |
| | Paralarımız (66–79) | MAT.2.1.8 |
| | Zaman Ölçme (80–99) | MAT.2.1.9 |
| | Uzunluk ve Kütle Ölçme Araç ve Birimleri (100–121) | MAT.2.1.10 |
| | Uzunluk ve Kütle Ölçmede Tahmin (122–127) | MAT.2.1.11 |
| | 4. Tema Değerlendirme (128–135) | |
| **5. Nesnelerin Geometrisi (2)** (s.136–159) | Yer ve Yön Bulma (138–147) | MAT.2.3.6 |
| | Simetri (148–157) | MAT.2.3.7 |
| | 5. Tema Değerlendirme (158–159) | |
| **6. Veriye Dayalı Araştırma** (s.160–187) | Veriyle Çalışma ve Veriye Dayalı Karar Verme (162–183) | MAT.2.4.1 |
| | 6. Tema Değerlendirme (184–187) | |

Not: MAT.2.1.3 ile 2.1.2 arasındaki sınır net. "En yakın onluk" ve "onluğa yuvarlama" programda MAT.2.1.3 altında anlatılır, kitapta da Sayıların Sırası bölümündedir. Tema 3'teki "en yakın onluklarla tahmin" ise MAT.2.2.2'ye aittir.

## 2. Bölüm özetleri

### Tema 1: Nesnelerin Geometrisi (1)

**Geometrik Cisimler (2.3.1).** Önce köşeli ve yuvarlak nesneler ayrılır: "Köşesi olmayan nesneler yuvarlak cisimlerdir. Köşesi olan nesneler köşeli cisimlerdir." Ardından cisim adları verilir: **küp, kare prizma, dikdörtgen prizma, üçgen prizma, silindir, küre**. Koni ve piramit **yok**. Nesneler cisimle eşleştirilir: futbol topu → küre, küp şeker → küp, konserve → silindir, süt kutusu → dikdörtgen prizma. Etkinlik: göz bağlı dokunarak cisim tahmini, 4 tur, takım puanı.

**Geometrik Cisim Modelleri (2.3.2).** Yapılardaki cisimler bulunur: Kız Kulesi, Göbeklitepe sütunu, Ksanthos, Selimiye kubbesi. Kuş yuvası bir parça listesinden kurulur: "ayağında 1 …, tabanında 1 …, köşelerinde 4 …, çatısında 1 …". Çocuk cisimlerle kendi yapısını tasarlar.

**Geometrik Şekil Modelleri (2.3.3).** Şekiller: kare, dikdörtgen, üçgen, çember, daire. Kural: "Çemberin içini boyayarak daire oluştururuz." Zürafa, tren, kamyon, at, kuş ve çiçek modellerinde şekiller sayılır, ör. "kamyonda … kare, … üçgen, … dikdörtgen, … daire". Renk + şekil + sayı eşleştirmesi yapılır ("Mor kare: 2"). Kültürel desenlerde (kilim, çini) şekil aranır.

**Biçimsel Özellikler (2.3.4).** "Geometrik şekil ve cisimlerin yeri, yönü ya da büyüklüğü değişse de biçimsel özellikleri değişmez." Örnekler: bateri davulları silindir, ziller daire. Etkinlikler "6 farkı bul" ve döndürülmüş/büyütülmüş şekli tanımadır. Kareli kâğıtta numaralı noktalar birleştirilerek şekil oluşturulur.

**Sıvı Miktarını Tahmin Etme (2.3.5).** Standart olmayan araçlar: kaşık, çay bardağı, su bardağı, fincan, kepçe, sürahi, şişe, termos, kova, bidon, damacana, tencere, cezve. Mantık: "küçük araçla daha çok sayıda", "büyük kap daha çok sıvı alır". Tahmin ölçümle karşılaştırılır: "Bence 8 şişe" → gerçek 6 → "fazla tahmin etmişim". Örnek: 2 bidon = 6 şişe. **Litre yok.** Değerlendirmedeki sorular: "en az kullanarak kovayı doldur", "en çok kullanarak damacanayı doldur", "bardaktaki suyu koyarsak dolmayabilir".

### Tema 2: Sayılar ve Nicelikler (1)

**Sayılar (2.1.1), 100'e kadar.** 1'den 100'e kadar okunuş-yazılış tablosu kullanılır (bir, iki … yüz). Resimdeki varlıklar sayılıp sayıyla eşleştirilir (54, 56, 60, 63, 66, 70, 72). Numaralı kartlarla "hangi iki kartın arasında?" ve "78'den sonraki ilk kart?" soruları sorulur. Okunuşun harf/kelime sayısına dayalı bilmeceler vardır. Nesne grafiğinde **"Her görsel 5 araç gereci gösterir"** notu bulunur. Ritim sayma etkinliği: trampet vuruşu "tak". Alfabede 29 harf sayılır.

**Sayıları Çözümleme (2.1.2).** Nesneler onarlı gruplanır: "Onarlı kaç grup var? Gruplanamayan kaç tane kaldı?". Kalıplar:
- "… elma = 10 elma + … elma"
- "36 sayısı 3 onluk ve 6 birlikten oluşur"
- **Basamak**: "Bir rakamın yazıldığı bölüme basamak denir. 36'nın onlar basamağı 3, birler basamağı 6'dır."
- **Basamak değeri**: "Rakamlar yazıldıkları basamağa göre değer alır. 94'te 9'un basamak değeri 90, 4'ün basamak değeri 4'tür." Tablo: Basamak Adı / Basamak Değeri / "90 + 4 = 94".

Modeller: **onluk ve birlik taban blokları** (boyanarak gösterilir), Onluk/Birlik tablosu. Yüzlük blok yok. Bilmeceler: "onlar basamağının değeri 90, birlerinki 9" → 99; "56'nın rakamlarını yer değiştir, onlar basamağını 1 azalt" → 55. Rakamların yeri değiştirilince sayının değişmesi tartışılır.

**Sayıların Sırası (2.1.3).**
- Sıra sayıları: "kaçıncı sırada", "sarıdan önce/sonra hangileri".
- Takımlar 25 sayı kartını **büyükten küçüğe** sıralar.
- **Cetvel modeli** (0–20): "1'den önce?" → 0, "14 ile 16 arasında?".
- **Sayı doğrusu** tanımı: "Çizginin iki ucundaki oklar uzayabileceğini gösterir; 0'dan başlar, sayılar eşit aralıklarla yerleşir." Birer, ikişer ve onar artan sayı doğruları vardır.
- **En yakın onluk**: "daha yakındır / daha uzaktır / eşit mesafededir" (45, 40 ile 50'ye eşit mesafede). Onluğa yuvarlama (87 → 90) çember oyunuyla öğretilir: "eşit mesafedeyse iki çembere de girebilirsin".
- Günlük problemler: 14. kata 10. kattaki mi 20. kattaki asansör önce gelir? 35 TL'lik kalemi hangi cüzdan alabilir?

**Ritmik Sayma (2.1.4).** Yüzlük tablo (Ek 6), sayı doğrusu ve labirentler kullanılır. Kapsam:
- İkişer 20 içinde: 0'dan ve 1/3'ten tek sayılarla. Geri yönde 16'dan ve 19'dan.
- Üçer 30 içinde: 0, 2, 4, 5, 12'den başlayarak. Geri yönde 30'dan ve 25'ten 1'e.
- Dörder 40 içinde: 0, 2, 3, 20'den başlayarak. Geri yönde 40'tan ve 34'ten 2'ye.
- Beşer 100 içinde: 5'ten 100'e, 3'ten 48'e, 25'ten 50'ye. Geri yönde 16'dan 1'e.
- Onar 100 içinde: 7'den 97'ye. Geri yönde 100'den 10'a, 99'dan 9'a, 80'den.

Ritmik sayma her sayıdan başlayabilir, yalnızca katlardan değil. Gruplama sınırları: ikişerli en fazla 20, üçerli 30, dörderli 40, beşerli ve onarlı 100 nesne. Otoparkta Ahsen birer, Mert beşer, Sena onar sayar: "Kim daha çabuk saydı?".

**Sayı ve Şekil Örüntüleri (2.1.5).** "Bu bir örüntüdür. 3'ten başlayıp 2 artması örüntünün kuralıdır." Kural kalıbı: "…'dan başlayıp … artar/azalır". Örnekler:
- harçlık 3, 5, 7 TL (+2)
- çerçeve kenarları 4, 8, 12 (+4)
- 9, 12, 15 (+3)
- 20, 16, 12 (−4)
- 16, 13, 10 (−3)
- 4, 9, 14 (+5)
- 15, ?, 9 (−3) **(?)**

Şekil örüntüsü sayı örüntüsüne dönüştürülür: sayma çubuklarıyla üçgen, kare ve beşgen kurulur, her adımdaki çubuk sayısı yazılır. **İlk 3 adım verilir, en fazla 3 adım devam ettirilir.**

**Nesne Sayısını Tahmin Etme (2.1.6).** 50'ye kadar. Önce tahmin edilir, sonra sayılır, sonra "1 fazla / eksik / eşit tahmin etmişim" denir ve fark bulunur. Strateji: eşit gruplara ayrılmış nesnelerde bir grubu sayıp gruplara genelleme (basketbol topları). Kümes sahnesinde ≈12 tavuk tahmin edilir, gerçekte 11'dir. Kaba tahmin oyunu şeffaf kapta yapılır.

### Tema 3: İşlemlerden Cebirsel Düşünmeye

**Toplama-Çıkarma Problemleri (2.2.1).** Problem şablonu: **Verilenler → İstenenler → Çözüm → Kontrol Edelim**. Aynı problem iki yolla çözülür: 58 − (22 + 22) ile 58 − 22 − 22 aynı sonucu verir. Kalıplar:
- "Alt alta toplarken onlar ve birler basamağı aynı hizaya gelmeli."
- **Eldeli toplama** (38 + 25): "8 + 5 = 13. 13 birlik 1 onluk 3 birliktir. 3 birlere yazılır, 1 onlar basamağına eklenir." Sonuç: "Yaptığımız eldeli toplama işlemiydi."
- **Onluk bozarak çıkarma** (32 − 27): "2 birlikten 7 birlik çıkmaz. Onlar basamağından 1 onluk alıp 10 birlik olarak birliklere ekleriz." 12 − 7 = 5, 2 − 2 = 0.
- **Deste** = aynı türden 10 tane. **Düzine** = aynı türden 12 tane.

Problemler en çok iki işlemlidir. Tipik sayılar:
- 8 + 9; 10 − 4; 10 + 6; 8 + 7; 5 − 4
- 58 − 2 × 22 → 14 (tekrarlı toplamayla)
- 37 − 15 − 20 = 2
- 38 + 25 = 63
- 45 + (45 − 4) = 86
- 10 + 12 + (10 + 5) = 37
- 32 − 27 = 5
- 3 düzine − 1 deste = 26
- 24 + 21 = 45 kg
- 51 − 15 − 27 = 9 dk
- 90 − 47 − 20 = 23 m
- 8 + 24 + 4 = 36 yaş
- 49 − 20 (2 deste) = 29

Bağlamlar: para, yaş, kütle (kg), süre (dk), uzunluk (m).

**Tahmin ve Zihinden İşlem (2.2.2).** Terimler: "1. toplanan, 2. toplanan, toplam", "eksilen, çıkan, fark". Örnek işlemler 67 + 28, 46 + 36, 82 + 18, 75 + 20 ve 86 − 49, 85 − 25, 99 − 71, 74 − 56. **Tahmin yöntemi: her sayıyı en yakın onluğa yuvarlayıp işlem yapmak.** 36 + 13 → 40 + 10 = 50, gerçek 49 → "tahminim işlem sonucundan fazladır". 49 − 11 → 50 − 10 = 40, gerçek 38. Karşılaştırma sözleri: eksik, fazla, eşit, az, çok. **Değişme özelliği**: 15 + 12 = 12 + 15 ("toplananların yerini değiştirdik, sonuç değişmedi"). Üç toplananlı ve iki adımlı zihinden problemler: 25 + 12 − 11 → 30'luk viyole yeter mi? 18 + 26 − 14; 36 − 2 düzine; 13 + 16 − 18.

**Toplama-Çıkarma İlişkisi (2.2.3).** 70 + 15 = 85 ve 85 − 70 = 15 ters işlemlerdir. Tontiş tavşan: 30 havuçtan kaçı yendi, 12 kaldı → geri sayma ile bulunur. Verilmeyen öge kalıpları:
- 1. toplanan = toplam − 2. toplanan (49 − 15)
- 2. toplanan = toplam − 1. toplanan (72 − 54)
- eksilen = fark + çıkan (63 + 17)
- çıkan = eksilen − fark (74 − 25)

Kutu (□) gösterimi: □ − 12 = 14; 18 + □ = 30; 86 − □ = 35. Verilmeyen öge, onu bulduran işlemle eşleştirilir. Çapraz + / − bulmacası 20 içindedir. Öz değerlendirme maddeleri: verilmeyen toplananı, eksileni ve çıkanı bulabilme.

**Çarpma ve Bölme (2.2.4).**
- **Çarpma** üç yoldan tanıtılır: ileri ritmik sayma, tekrarlı toplama ("9 tane 2'nin toplamı 18") ve gruplama ("ikişerli grupladığımızda 9 grup oluştu").
  - Yazılış: `9 x 2 = 18` (çarpan, çarpma işareti, çarpan, eşit işareti, çarpım).
  - Okunuş: "9 çarpı 2 eşittir 18" ya da "9 kere 2, 18'dir".
  - **Sıra kuralı: grup sayısı × bir gruptaki sayı.** "6 tane 4" = 6 x 4 (6 grup, her grupta 4).
  - Alt alta çarpma da gösterilir.
  - **Çarpım tablosu**: 1–10 × 1, 2, 3, 4, 5 (sütunlar ×1…×5) ve 0–10 × 0–5 işlem tablosu.
  - 0 ve 1 ile çarpma tartışılır. Programa göre "yutan/etkisiz eleman" terimleri kullanılmaz.
  - Değişme özelliği: 3 x 4 = 4 x 3; 3 kutu × 5 kitap = 5 kutu × 3 kitap.
- **Bölme** geri ritmik sayma ve ardışık çıkarmayla tanıtılır (12 − 2 − 2 … 6 kez).
  - Yazılış: `12 ÷ 2 = 6` (bölünen, bölme işareti, bölen, eşit işareti, bölüm). Okunuş: "12 bölü 2 eşittir 6" ya da "12'nin 2'ye bölümü 6'dır".
  - Bölü çizgisiyle (uzun bölme düzeni) yazılır, kalan her zaman **0**: "Kalan 0 olduğu için tüm elmalar dağıtıldı."
  - İki anlamı vardır: **gruplama** ("her tabağa 3 elma → kaç tabak?") ve **eşit paylaştırma** ("15 havuç 5 sepete → bir sepette kaç?").
  - Örnekler: 14 ÷ 2, 15 ÷ 3, 18 ÷ 3, 4 ÷ 4, 8 ÷ 4, 10 ÷ 5, 20 ÷ 5, 12 ÷ 2, 9 ÷ 3, 16 ÷ 4, 18 ÷ 2, 20 ÷ 4, 10 ÷ 2.
- Problemler tek işlemlidir: 20 çıkartma 5 sayfaya, 18 toka üçerli kutulara, 20 TL'ye 4 TL'lik bilye, 6 grup × 5 araba, 2 kutu × 3 uçak.

**Çarpma-Bölme Tahmini ve Zihinden İşlem (2.2.5).** Önce bileşen adları sorulur ("Bu çarpma işleminde 5 çarpan, 4 çarpan, … çarpımdır"). Çarpmanın sağlaması bölmeyle yapılır: 5 x 4 = 20 → 20 ÷ 4 = 5. Bölmede yardımcı soru "2'yi hangi sayıyla çarparsam 18 olur? Çarpım tablosundan bul" sorusudur. Çarpma ile bölme sağlama işlemleriyle eşleştirilir. Aynı problem üç yolla çözülür: paylaştırma, geri ritmik sayma, bölme (12 simit, 4 grup). Problemler: 6 kat × 2 daire, 18 sayfa ÷ 3 gün, 4 TL × 3, 20 kişi ÷ 5 vagon, 4 kişi × 3 şeker.

**Dört İşlemde Eşitlik (2.2.6).** "=" işareti sonuçları eşit iki işlem arasında kullanılır. Sonucu eşit olan işlemler eşleştirilir:
- 21 + 17 = 19 + 19
- 16 ÷ 4 = 62 − 58
- 34 − 19 = 5 x 3
- 18 ÷ 3 = 82 − 76
- 8 x 4 = 91 − 59
- 45 + 39 = 100 − 16

D/Y labirenti: 35 − 28 = 14 ÷ 2 (D); 15 ÷ 5 = 10 ÷ 2 (Y); 6 x 5 = 19 + 13 (Y); 3 x 8 = 4 x 6 (D); 12 ÷ 4 = 3 x 1 (D). Dört çocuğun yaşı farklı işlemlerle hep 10 çıkar (25 − 18 + 3; 20 ÷ 2; 2 x 5; 15 + 7 − 12). Fiyat görevinde aynı sonucu veren başka işlemler yazılır: kalem 4 x 9 = 36, silgi 40 − 12 = 28, kalemtıraş 18 ÷ 2 = 9. "Sayı torbası" oyununda çekilen sayıya (≤100) ulaşan bir işlem yazılır.

**3. Tema Değerlendirme.**
- Şifre: 49 + 36, 98 − 61, 76 − 47, 4 x 0, 2 x 1, 7 x 5, 24 − 15, 16 ÷ 2, 20 ÷ 4.
- En yakın onlukla tahmin: 12 + 26.
- Verilmeyen ögeyi bulduran işlemle eşleştirme.
- Çarpmayı sağlama bölmesiyle eşleştirme.
- Çapraz bulmaca: 24 + 21; 20 ÷ 2; 6 x 4; 36 − 20; 100 − 57 − 20; 8 + 24 + 4.

### Tema 4: Sayılar ve Nicelikler (2)

**Kesirler (2.1.7).** Bütün, yarım ve çeyrek. **Kesir gösterimi (½, ¼) yok.**
- "Bir bütünü iki eş parçaya böldüğümüzde parçaların her birine yarım denir." "Bir bütünü dört eş parçaya böldüğümüzde her biri çeyrektir."
- İlişkiler: 1 bütün = 2 yarım = 4 çeyrek; 2 çeyrek = 1 yarım; 1 yarım + 2 çeyrek = 1 bütün; "4 çeyrek elma 2 yarım elma eder".
- Modeller: simit, tost, kek, elma, portakal, ramazan pidesi, kavun, limon, omlet, ekmek, karpuz, şeftali, ayva, erik, oyun hamuru (cetvelle ikiye, sonra yeniden ikiye bölünür).
- "Eş parça" vurgusu güçlüdür. Program, rastgele ikiye bölünmüş nesnelerin yarım sayılmaması gerektiğini özellikle ister.
- Değerlendirmede lahmacun sorusu: bütün, 1 yarım, 1 çeyrek ve **3 çeyrek** ("4 eş parçaya böldürdüğüm lahmacunun 3 parçasını yedim").

**Paralarımız (2.1.8).**
- Kâğıt paralar: **5, 10, 20, 50, 100, 200 TL**. Ön yüzde Atatürk, arka yüzde Aydın Sayılı, Cahit Arf, Mimar Kemaleddin, Fatma Aliye, Itri ve Yunus Emre portresi vardır.
- Madenî paralar: **25 kr., 50 kr., 1 TL, 5 TL**. "Değeri 1 TL'den küçük olan paralarımıza kuruş deriz, kısaca kr."
- İlişkiler: 1 TL = 100 kr.; 2 × 50 kr. = 1 TL; 4 × 25 kr. = 1 TL; 2 × 25 kr. = 50 kr.; 50 kr. + 2 × 25 kr. = 1 TL; 4 × 1 TL + 4 × 25 kr. = 5 TL. Bu ilişkiler bilinçli olarak "2 yarım = 1 bütün, 4 çeyrek = 1 bütün" ile bağlanır.
- Etkinlikler: paraları küçükten büyüğe sıralama; "para üstü almadan" fiyat kadar para seçme (58, 99, 70 TL); verilen paralardan fiyat bulma (5 + 20 = 25 TL; 1 + 10 + 50 = 61 TL); çerçevedeki madenî paraları 1–6 TL'lik toplamla eşleştirme; kişiye ait cüzdanı bulma (67, 29, 45 TL); D/Y labirenti ("Değeri en büyük madenî paramız 50 kr.tur" → Y).
- Değer eğitimi: ihtiyaç/istek, tasarruf, harçlık. Sınıfta market, manav, kırtasiye ve oyuncak istasyonlu alışveriş yapılır ("20 TL ile neler alabiliriz?").

**Zaman Ölçme (2.1.9).**
- Günün bölümleri: sabah, öğleden önce, öğle, öğleden sonra, akşam, gece. Önce/sonra sıralaması ve günlük plan tablosu.
- Süre karşılaştırma: 37 dk ile 7 dk; 2 dk ile 9 saat; 3 ay ile 2 hafta. Günlük değerler: ders 40 dk, teneffüs 10 dk, diş fırçalama 2 dk, uyku 9 saat.
- Zaman ölçme araçları: dijital saat, çalar saat, kum saati, su saati, güneş saati, köstekli saat. Çeldiriciler: cetvel, pusula, tartı.
- Analog saat: "Kısa kol akrep, uzun kol yelkovan. Akrep saati, yelkovan dakikayı gösterir."
  - **Tam**: yelkovan 12'de → "saat on", yazılışı `10.00`.
  - **Buçuk/yarım**: yelkovan 6'da → "sekiz buçuk", `8.30`.
  - **Çeyrek geçiyor**: yelkovan 3'te → "dokuzu çeyrek geçiyor", `9.15`.
  - **Çeyrek var**: yelkovan 9'da → "altıya çeyrek var", `5.45`.
  - Yazımda nokta kullanılır, 12 saatlik okuma esastır ("biri çeyrek geçe").
- "1 saat 60 dakikadır; yelkovan 12'den 12'ye bir tur 60 dk." Yarım saat 30 dk, çeyrek saat 15 dk; bunlar "bütün-yarım-çeyrek" ile bağlanır.
- Dijital saat okuma ve okunuşu dijitale yazma (3.00, 8.30, 9.45, 12.15, 2.30, 8.45).
- Takvim: 1 yıl 12 ay; aylar 30 ya da 31 gün, şubat 28 gün (29 **(?)**, metinde boşluk); 1 hafta 7 gün; hafta içi ve hafta sonu; tatil günleri kırmızı. 23 Nisan ve 29 Ekim hangi güne denk geliyor? "3 gün sonra", "bir hafta sonra" sorulur. Pazartesileri say: "nisanda kaç kez kursa gitti?".
- Birim ilişkileri (yalnız bunlar): 1 yıl = 4 mevsim = 12 ay = 52 hafta; 1 mevsim = 3 ay (kış: aralık, ocak, şubat…); 1 ay = 30 gün ve 4 hafta kabul edilir; 1 hafta = 7 gün; 1 gün = 24 saat; 1 saat = 60 dk.

**Uzunluk ve Kütle Ölçme Araç ve Birimleri (2.1.10).**
- Önce standart olmayan birimlerle (karış, parmak, kulaç, adım, ayak, silgi, ataş, kalemtıraş, kalemlik, fırça) **farklı sonuçlar** çıkar: "flüt 4 silgi" ve "5 silgi". Bu standart birime duyulan ihtiyacı gösterir. Bahçe oyunu: "Aldım, verdim, ben seni yendim."
- Uzunluk araçları: cetvel (15, 20, 30 cm), şerit metre, kırık metre, mezura. "Uzunluk ölçme birimi metredir, kısaca m. 1 m'den kısa uzunluklar için santimetre, kısaca cm." "1 m 100 cm'ye eşittir": 90 cm boy 1 m'den kısadır. Nesnelere uygun birim (m mi cm mi?) seçilir. Meslekler: marangoz, terzi (mezura), mimar (cetvel), doktor (boy).
- Kütle araçları: eşit kollu terazi, elektronik terazi, el kantarı, baskül, kantar. "Kütle ölçme birimi kilogramdır, kısaca kg. 1 kg'dan hafif nesneler için gram, kısaca g." Örnekler: oyuncak araba 90 g, karpuz 8 kg, toz biber 60 g, fındık 100 g. Nesnelere uygun birim (g mi kg mı?) seçilir. Çocukların kütleleri (kg) karşılaştırılır: en hafif/en ağır, "kaç kg fazla", kızların toplamı. Dengedeki teraziden reçel kavanozunun kg değeri okunur.
- **1 kg = 1000 g dönüşümü yok.**

**Uzunluk ve Kütle Ölçmede Tahmin (2.1.11).** Bir referans nesneyle tahmin yapılır: ataş 5 cm, cetvel 30 cm, domates 75 g. Tablo: Tahminim → Ölçüm sonucu → Karşılaştırma (eşit/fazla/az). Üç seçenekten uygun tahmin seçilir: 50 g / 1 kg / 10 kg; 20 cm / 80 cm / 1 m; 4 g / 40 g / 4 kg; 3 cm / 33 cm / 3 m. Varlıklar tahminî kütleyle eşleştirilir: 1 g, 5 g, 80 g, 1 kg, 12 kg, 80 kg. Değerlendirme: "boyu 1 m'den fazla olan hayvanlar"; meyvelerin gram değerlerinden en hafif/en ağır, fark ve toplam; "3 g mı 3 kg mı?" türü ikili kutular.

### Tema 5: Nesnelerin Geometrisi (2)

**Yer ve Yön Bulma (2.3.6).**
- Kavramlar: altında, üstünde, arasında, yüksekte, alçakta, uzakta, yakında, etrafında, önünde, arkasında, sağında, solunda, içinde, dışında, çukurda, tümsekte.
- **Kroki** (mahalle): "okulun sağında çocuk parkı", "fırın Alya'nın evi ile marketin arasında".
- **Harita yol tarifi**: "önce sağa doğru ilerledi, sonra yukarı döndü…".
- **Kareli ızgara**: "Kelebek 4 kare sağa 1 kare yukarı giderse …'ya ulaşır"; eksik yön veya kare sayısı bulunur.
- Ok dizisiyle hedefe gidilir; **kodlama** (köpeği kemiğe ulaştırmanın 3 farklı ok dizisi) yapılır.
- Engelli ızgara: "içi dolu karelerin üzerinden geçemeyiz". "En kısa yol" ve "başlangıca en uzak hedef" sorulur.
- Bahçede krokiyle hazine avı: "ağacın arkası, bankın sağı".
- Yön sözcükleri: **yukarı, aşağı, sağa, sola** (pusula yönleri yok).

**Simetri (2.3.7).** "Ortadan katlandığında iki eş parça oluşur." "Kat çizgisinin iki yanındaki görseller birbirinin yansımasıdır; bu çizgi simetri çizgisidir. Simetri çizgisi görseli iki eş parçaya ayırır." Örnekler: kelebek, suya yansıyan manzara, kilim, dantel, tülbent, çini, kar kristali, ip baskısı. Görevler:
- simetri çizgisi çizilebilenleri işaretleme
- çizilen çizgilerden simetri çizgisi olanları seçme
- şekil, harf ve nesnelere simetri çizgisi çizme
- simetri çizgisinden kesilmiş top yarımlarını eşleştirme
- yarım görseli noktalı yerden tamamlayıp simetrisine uygun boyama

**Tek simetri çizgisi** yeterlidir; birden fazla simetri doğrusu 3. sınıftadır.

### Tema 6: Veriye Dayalı Araştırma (2.4.1)

- **Araştırma sorusu** "açık ve net olmalı, amaca uygun olmalı, uygun kişilerden oluşan bir gruba sorulmalıdır". Tek kişiye sorulan soru araştırma sayılmaz. Örnekler: "En çok hangi rengi seversiniz?", "En sevdiğiniz geleneksel çocuk oyunu?"
- Araçlar:
  - **Çetele tablosu**: çizgiler, 5'li demet.
  - **Sıklık tablosu**: sayılar. Tablo Adı yazılır.
  - **Nesne grafiği**: yatay, resimli; "Not: Her varlık 1 hayvanı temsil etmektedir."
  - **Şekil grafiği** (yeni): "Verilerin grafikte uygun şekillerle gösterilmesine şekil grafiği denir; her şekil belirli sayıda veriyi ifade eder." Dikey sütunlarda daire, yıldız, kare ya da üçgen kullanılır. Eksen 0–10 ("Kişi Sayısı"). Not örnekleri: "Her ○ 1 kişiyi", bir örnekte "**Her ○ 2 kişiyi** temsil etmektedir."
- **En çok iki veri grubu**: 2/A–2/B, kız–erkek, Burçak–Ümit, A kulübü–B kulübü, yemek–içecek. Liste veriden tabloya gruplama yapılır. Uygunsuz cevap ayıklanır ("salıncağa binme" geleneksel oyun değildir). Nesne grafiği şekil grafiğine dönüştürülür.
- Soru tipleri: en çok, en az, eşit, "kaç fazla/eksik", toplam, çoktan aza sıralama, "başka sınıfa sorulsa sonuç aynı olur mu?", "yarın yapılsa?".
- Veriler: sınıf verileri 2–15; kulüp tablolarında 14–49 (33, 14, 42 / 26, 18, 49); şekil grafiklerinde en fazla 10 sembol.

## 3. Sınırlar (üreticiler bu sınırları AŞMAMALI)

### Sayılar (MAT.2.1.1–2.1.6)
- Sayı aralığı **0–100** (100 dâhil). Üç basamaklı sayı yok. Tek istisnalar 200 TL banknotunun tanınması ve sıralanmasıdır.
- Çözümleme yalnızca **onluk + birlik** ile yapılır, iki basamaklı sayılarla (10–99). 100 = 10 onluk olarak söylenebilir. Yüzlük/yüzler basamağı yok.
- Basamak adları: "onlar basamağı", "birler basamağı". Basamak değeri ≤ 90.
- Sıralama sözle yapılır: "büyükten küçüğe", "küçükten büyüğe", "önce/sonra/arasında". **`<` ve `>` sembolü kullanma.**
- Sayı doğrusu 0'dan başlar, aralıklar eşittir: birer (0–20), ikişer (0–26), onar (0–100).
- En yakın onluğa yuvarlama 100'e kadardır. **xx5 sayıları "eşit mesafededir"**; oyunda iki cevap da doğru kabul edilmeli ya da xx5 sorulmamalı.
- Ritmik sayma:

  | Adım | İleri | Geri | Başlangıç |
  |---|---|---|---|
  | 2 | 20 içinde | 20 içinde | her sayıdan (tek de olabilir) |
  | 3 | 30 içinde | 30 içinde | her sayıdan |
  | 4 | 40 içinde | 40 içinde | her sayıdan |
  | 5 | 100 içinde | 100 içinde | her sayıdan (3, 8, 13 … gibi de) |
  | 10 | 100 içinde | 100 içinde | her sayıdan (7, 17 … 97) |
  | 1 | 100 içinde | 100 içinde | (Hatırlayalım: 42'den) |

  İkişer saymada 20'yi, üçer saymada 30'u, dörder saymada 40'ı geçme.
- Örüntü: **ilk 3 adım verilir, en fazla 3 adım devam** (toplam ≤ 6 terim). Adım farkı 2–5 (kitapta +2, +3, +4, +5, −3, −4). Terimler 0–30 aralığında (kitapta en büyük 20). Kural kalıbı: "…'dan başlayıp … artar/azalır".
- Nesne sayısını tahmin etme: **≤ 50 nesne**.

### İşlemler (MAT.2.2.1–2.2.6)
- **Toplama**: toplam **≤ 100**, eldeli olabilir. İki ya da **üç** toplanan olabilir. Toplananlar en fazla iki basamaklıdır.
- **Çıkarma**: eksilen **≤ 100** (100 dâhil, ör. 100 − 16). **Onluk bozma olabilir.** Fark ≥ 0, negatif sonuç yok.
- Problemler **en çok iki işlemli** (ör. 37 − 15 − 20; 45 + (45 − 4)). Ara sonuçlar da 0–100 içinde kalmalı.
- Deste = 10, düzine = 12. Problemlerde en fazla 3 düzine (36) ya da 2 deste kullan.
- Zihinden işlem ve tahmin: **en yakın onluğa yuvarlayıp işlem**. Tahmin ile sonuç "fazla / eksik / eşit" diye karşılaştırılır.
- Verilmeyen öge: □ + b = c, a + □ = c, □ − b = c, a − □ = c, hepsi 100 içinde.
- **Çarpma**: çarpanlardan biri **1–5 (ya da 0)**, diğeri **0–10**. Çarpım **≤ 50**. Kitapta 4 x 9, 3 x 8, 4 x 10 da var; değişme özelliğiyle ikinci çarpan 5'ten büyük olabilir, yeter ki bir çarpan ≤ 5 olsun. 6 x 7 ya da 8 x 9 gibi **tablolar yok**. Çarpım tablosu "5'e kadar (5 dâhil)".
  - Anlam: "a tane b" = a x b, yani a grup, her grupta b nesne. Görselde grup sayısı ilk çarpandır.
  - 0 ile ve 1 ile çarpma olabilir. "Etkisiz eleman" ve "yutan eleman" terimlerini kullanma.
- **Bölme**: bölünen **≤ 20**, bölen **2, 3, 4, 5**, **kalan her zaman 0**. Bölüm en fazla 10. Kalanlı bölme ve 1'e bölme yok. Sıfırın bölünmesi yok. Kitapta 4 ÷ 4 = 1 geçiyor; bölünen = bölen olabilir.
- Çarpma-bölme problemleri **tek işlemli**dir. Sağlama: çarpma ↔ bölme.
- Dört işlemde eşitlik: her iki taraf yukarıdaki sınırlarda kalır. Sonuç ≤ 100. Eşitlikte bir işlem iki adımlı olabilir (25 − 18 + 3).
- Terimler: toplanan (1./2.), toplam, eksilen, çıkan, fark, elde, onluk bozma, çarpan, çarpım, bölünen, bölen, bölüm, kalan, tekrarlı toplama, ardışık çıkarma.

### Kesir, para, zaman, ölçme (MAT.2.1.7–2.1.11)
- Kesir: yalnız **bütün, yarım, çeyrek** ve aralarındaki ilişkiler (2 yarım, 4 çeyrek, 2 çeyrek = 1 yarım, 1 yarım + 2 çeyrek = 1 bütün; değerlendirmede 3 çeyrek). **Sayısal kesir gösterimi (½, ¼, pay/payda) yok.** Parçalar **eş** olmalı. Çeldirici olarak eş olmayan iki parça kullanılabilir.
- Para:
  - Kâğıt: 5, 10, 20, 50, 100, 200 TL. Madenî: 1 TL, 5 TL, 50 kr., 25 kr. 1 kr., 5 kr., 10 kr. **kullanma** (programın zenginleştirmesinde 10 kr. geçiyor, kitapta yok).
  - Toplam değer **≤ 100 TL**. 200 TL yalnız tanıma ve sıralamada kullanılır.
  - **Para üstü yok**: tam ödeme, "fiyat kadar parayı seç". Kalan hesabı yalnızca Tema 3 problemlerinde çıkarma olarak yapılır.
  - Kuruş hesabı yalnız 25 ve 50 kr. ile ve **tam TL'ye tamamlanan** durumlarda yapılır (2 × 50 kr. = 1 TL; 50 + 25 + 25 kr. = 1 TL). Karışık "3 TL 75 kr." toplamları üretme **(?)**.
- Zaman:
  - Analog/dijital okumada yalnız **tam (:00), buçuk (:30), çeyrek geçiyor (:15), çeyrek var (:45)**. 5 dakikalık ara değerler (3.20 gibi) yok. 12 saatlik okuma, yazımda nokta (`8.30`).
  - "Çeyrek var" ifadesinde akrep bir sonraki saate yakın durur, okunuş da bir sonraki saatle yapılır ("altıya çeyrek var" = 5.45).
  - Birim ilişkileri yalnız şunlar: dk–saat (60), saat–gün (24), gün–hafta (7), hafta–ay (4), gün–ay (30 kabul), ay–mevsim (3), mevsim–yıl (4), ay–yıl (12), hafta–yıl (52). **Saniye yok.** Birimler arası hesaplı dönüşüm (ör. 2 saat = ? dk) üretme. Yalnızca ilişki eşleştirme yapılır.
  - Takvim soruları: gün adı bulma, "n gün/1 hafta sonra", ay kaç gün, hafta içi/sonu.
- Uzunluk: **m ve cm**. Tek dönüşüm **1 m = 100 cm**. Ölçümler cetvel boyunda (≤ 30 cm) ya da tam metre; değerler ≤ 100. km ve mm yok.
- Kütle: **kg ve g**. **kg ↔ g dönüşümü yok.** Gram değerleri ≤ 100 (kitapta 60, 75, 90, 100 g), kg değerleri ≤ 100 (kitapta 8, 12, 24, 80 kg). Ton yok.
- Sıvı: **yalnız standart olmayan araçlar** (bardak, kaşık, kova…). **Litre ve mililitre yok.** Sayılar küçük (≤ 10 bardak/şişe).

### Geometri (MAT.2.3.1–2.3.7)
- Cisimler: küp, kare prizma, dikdörtgen prizma, üçgen prizma, silindir, küre. **Koni ve piramit yok.** Yüz, ayrıt ve köşe sayımı 3. sınıfa aittir; 2. sınıfta yalnız "köşeli / yuvarlak" ve "köşe-kenar var mı?" sorulur.
- Şekiller: kare, dikdörtgen, üçgen, çember, daire. Beşgen yalnız örüntülerde sayı temsili olarak geçer (program).
- Yön: yukarı/aşağı/sağa/sola ve konum sözcükleri. Izgara yönergeleri **2–4 parça** (ör. "4 kare sağa, 1 kare yukarı") ve **en fazla 7 kare** ilerleme içerir. Engelli kareler olabilir. Pusula yönleri (kuzey vb.) yok.
- Simetri: **tek simetri çizgisi** yeterli. "Simetrik mi?" ayırt etme, çizgi seçme, yarım görseli tamamlama. Birden fazla simetri doğrusu ve koordinat yok.

### Veri (MAT.2.4.1)
- **Kategorik** veri, **en çok 2 veri grubu** (ör. 2/A ve 2/B), 3–4 kategori.
- Araçlar: çetele, sıklık tablosu, nesne grafiği, **şekil grafiği** (dikey, eksen 0–10). Sütun ve çizgi grafiği yok. Nokta grafiği 3. sınıftadır.
- Sembol başına 1 kişi. **"Her şekil 2 kişi"** ve nesne grafiğinde **"her görsel 5"** de kitapta var (ileri seviye). Bu durumda veriler 2'nin ya da 5'in katı olmalı, yarım sembol olmamalı.
- Grafik değerleri ≤ 10 (2'li ölçekte ≤ 20), tablo değerleri ≤ 50. Sorulan farklar ve toplamlar 100'ü geçmemeli.

## 4. Oyunlaştırma önerileri

Mekanikler: `choice` (şıklı), `numChoice` (sayı şıkları), `input` (sayı tuş takımı), `sort` (2–3 sepet), `match`, `order`, `memory`, `pop` (kurala uyan balonları patlat).
Görseller: `objects`, `groups`, `blocks`, `clock`, `money`, `lengths`, `balance`, `pattern`, `pictograph`, `tally`, `column`, `shapes/solids`, `fraction`, `sequence`.
Kitap çoktan seçmeli değil, açık uçlu ağırlıklı. Bu yüzden `input` ve `match` kullanılmalı, `choice` 3 şıklı olmalı.

### Tema 1: Nesnelerin Geometrisi (1)
1. **Köşeli mi yuvarlak mı?** `sort` (2 sepet) + `solids`: gerçek nesne görselleri (top, zar, konserve, süt kutusu). MAT.2.3.1
2. **Cismi adlandır.** `choice` (3 şık) + `solids`: küp / kare prizma / dikdörtgen prizma / üçgen prizma / silindir / küre. Çeldirici olarak kare prizma ile küp yan yana. 2.3.1
3. **Nesne–cisim hafızası.** `memory`: kart çifti nesne ↔ cisim modeli (6 çift). 2.3.1
4. **Kuş yuvası kur.** `match`: parça adı ↔ yuvadaki yer ("ayak → silindir, çatı → üçgen prizma"). Sonunda yapı birleşir. 2.3.2
5. **Yapıda kaç tane?** `input` + `shapes`: tren/kamyon modelinde "kaç daire?" (≤ 6). 2.3.3
6. **Çember mi daire mi?** `pop`: "içi dolu olanları (daire) patlat". 2.3.3
7. **Döndürülse de aynı.** `choice` + `shapes`: döndürülmüş ya da büyütülmüş şeklin adı. D/Y: "Kare döndürülünce üçgen olur." 2.3.4
8. **Noktaları birleştir.** `sequence` + `shapes`: numaralı noktalara sırayla dokun, oluşan şekli seç. 2.3.3–4
9. **Hangisiyle daha az?** `choice` + sıvı kapları: kovayı en az sayıda doldurmak için çay bardağı / sürahi / kaşık. 2.3.5
10. **Tahmin et, dök, karşılaştır.** `numChoice` + dolum animasyonu: "Sürahi kaç bardakla dolar?" (3–8). Sonra animasyon dolar, "eşit / fazla / az tahmin ettin" söylenir. 2.3.5
11. **Sıvı D/Y labirenti.** `choice` (D/Y) zinciri: kitaptaki labirentin aynısı, 3 karar → çıkış kapısı. 2.3.5

Tema sonu oyunları:
- **"Mimar Fındık"**: verilen siparişe göre ("1 silindir ayak, 1 üçgen prizma çatı") cisimleri sürükleyerek yapı kurulur. Sonra yapı döndürülür: "hâlâ aynı cisimler mi?".
- **"Gizli Şekil Avı"**: boyanmış bir sahnede (oda, kamp alanı) süre içinde istenen cisme benzeyen nesnelere dokunulur.

### Tema 2: Sayılar ve Nicelikler (1)
1. **Say ve yaz.** `input` + `objects` (onarlı gruplanmış, 20–100): "Kaç kuş var?". 2.1.1
2. **Okunuş eşleştir.** `match`: "altmış üç" ↔ 63 (5 çift). Çeldiriciler 36/63 gibi yer değiştirmiş rakamlar. 2.1.1
3. **Blokla göster.** `blocks` + `input`: 4 onluk + 7 birlik → 47; tersi: 58'i oluşturacak blokları sürükle. 2.1.2
4. **Basamak değeri.** `numChoice`: "74'te 7'nin basamak değeri?" {7, 70, 4}. 2.1.2
5. **Sayı bilmecesi.** `input`: "Onlar basamağının değeri 80, birlerinki 0" → 80. 2.1.2
6. **Sayı doğrusunda yerini bul.** `sequence` (sayı doğrusu): boş kutuya sayı yerleştirilir (birer, ikişer, onar). 2.1.3
7. **Hangi onluğa yakın?** `choice` (2 çember: 30 / 40): 36 → 40. xx5 sorulmaz ya da "eşit mesafede" üçüncü şık olur. 2.1.3
8. **Sırala.** `order`: 5 sayı kartı büyükten küçüğe (10–99). 2.1.3
9. **Ritmik yol.** `pop`: "3'ten başlayıp beşer say": 3, 8, 13 … balonlarını sırayla patlat. Yanlış balon titrer. 2.1.4
10. **Eksik sayı.** `input` + `sequence`: 12, 15, _, 21, _ (üçer, ≤ 30). Geri sayma versiyonu: 40, 36, _, 28. 2.1.4
11. **Örüntü kuralı.** `pattern` + `choice`: çubuklarla yapılan 3 şekil (4, 8, 12) → 4. adım kaç? Kural: "4'ten başlayıp 4 artar". 2.1.5
12. **Bak-tahmin et-say.** `numChoice` + `objects` (20–50, 3 sn göster/gizle; eşit gruplu dağılımla strateji ipucu). Sonra sayma animasyonu ve "fazla / eksik / eşit tahmin". 2.1.6

Tema sonu oyunları:
- **"Aklımdan Sayı Tuttum"**: Fındık 1–100 arası bir sayı tutar. Çocuk en fazla 10 evet/hayır sorusuyla (büyük mü? 30 ile 50 arasında mı?) bulur. Sayı doğrusu her cevapta daralır. Kitaptaki sınıf oyunu.
- **"Onluk Fabrikası"**: bantta akan birlik küpler 10'a ulaşınca onluk çubuğuna paketlenir. Sipariş: "63 tane gönder" → 6 çubuk 3 küp.

### Tema 3: İşlemlerden Cebirsel Düşünmeye
1. **Verilen mi istenen mi?** `sort` (2 sepet): problem cümlelerinin parçaları. 2.2.1
2. **Eldeli toplama.** `column` + `input`: önce birler (elde animasyonu: 10 küp → 1 çubuk), sonra onlar. Toplam ≤ 100. 2.2.1
3. **Onluk bozma.** `column` + `blocks`: "2 birlikten 7 çıkmaz" → bir çubuk 10 küpe ayrılır. 32 − 27. 2.2.1
4. **Deste/düzine.** `numChoice`: "2 deste kalem kaç tane?" {20, 12, 24}; "3 düzine − 1 deste". 2.2.1
5. **İki adımlı problem.** `input` (ara sonuç kutulu): Aykut 37 TL, 15 vapur, 20 metro. 2.2.1
6. **En yakın onlukla tahmin.** `choice`: 36 + 13 ≈ {40, 50, 60}; sonra gerçek sonuç ve "tahminim fazla". 2.2.2
7. **Toplananların yeri.** `match`: 15 + 12 ↔ 12 + 15 (değişme özelliği). 2.2.2
8. **Kayıp sayı.** `input`: 18 + □ = 30; □ − 12 = 14; 86 − □ = 35. 2.2.3
9. **Gruplarla çarpma.** `groups` + `input`: 6 tabak × 4 kurabiye → "6 tane 4 = 6 x 4 = □". Tekrarlı toplama satırı da gösterilir. 2.2.4
10. **Paylaştır.** `groups` (sürükle-bırak): 15 havucu 5 sepete eşit dağıt → "15 ÷ 5 = 3". Gruplama versiyonu: "her tabağa 3, kaç tabak?". 2.2.4
11. **Çarpım balonları.** `pop`: "Sonucu 20 olanları patlat" (4 x 5, 5 x 4, 10 x 2, 2 x 10). Çeldiriciler 4 x 4, 3 x 5, 20 ÷ 4. Bölme balonu sürümü: "Sonucu 3 olanlar" (15 ÷ 5, 9 ÷ 3, 12 ÷ 4). 2.2.4–5
12. **Eşitlik terazisi.** `balance` + `choice` (D/Y): 35 − 28 ? 14 ÷ 2. Terazi dengede mi? 2.2.6

Tema sonu oyunları:
- **"Şifreli Sandık"** (kitabın şifre etkinliği): 6–8 karışık işlemin sonucu harflere dönüşür, şifre bir kelime çıkarır (ör. MANGALA).
- **"Sayı Torbası"**: torbadan çekilen sayı (≤ 50) için kart destesinden (+, −, x, ÷ kartları) aynı sonucu veren iki farklı işlem kurulur. Terazi dengelenince altın kazanılır.

### Tema 4: Sayılar ve Nicelikler (2)
1. **Bütün mü, yarım mı, çeyrek mi?** `sort` (3 sepet) + `fraction` (pide, elma, tost). 2.1.7
2. **Eş parça avı.** `choice`: hangi kesim "yarım" yapar? Çeldirici: eşit olmayan ikiye kesim. 2.1.7
3. **Kaç çeyrek bir bütün eder?** `numChoice` + `fraction` (pasta): "2 çeyrek = ? yarım", "1 yarım + 2 çeyrek = ? bütün". 2.1.7
4. **Kâğıt mı madenî mi?** `sort` + `money`. 2.1.8
5. **Küçükten büyüğe.** `order` + `money` (5 → 200 TL). 2.1.8
6. **Fiyat kadar öde.** `money` sürükle-bırak: 58 TL'lik süt kutusu, para üstü yok. 2.1.8
7. **Kuruş kumbarası.** `match`: madenî para grupları ↔ 1 TL / 50 kr. (4 × 25 kr.; 2 × 50 kr.). 2.1.8
8. **Saat kaç?** `clock` + `choice` (okunuş): tam / buçuk / çeyrek geçiyor / çeyrek var. 2.1.9
9. **Saati kur.** `clock` (akrep-yelkovanı sürükle): "Saat dokuza çeyrek var". Dijital ↔ analog `match`. 2.1.9
10. **Takvim dedektifi.** `input`/`choice`: "12 Nisan Salı ise 3 gün sonra hangi gün?"; birim ilişki `memory` (1 hafta ↔ 7 gün, 1 saat ↔ 60 dk). 2.1.9
11. **m mi cm mi? kg mı g mı?** `sort` (2 sepet) + nesne görselleri (silgi → cm; koridor → m; fındık → g; karpuz → kg). 2.1.10
12. **Ataşla tahmin.** `lengths` + `numChoice`: ataş 5 cm referansıyla makas kaç cm? {10, 15, 30}. Sonra cetvel animasyonu ve karşılaştırma. Kütlede domates 75 g referansı + `balance`. 2.1.11

Tema sonu oyunları:
- **"Fındık'ın Pazar Günü"**: alışveriş listesi (ihtiyaç/istek ayrımı), cüzdandaki paralarla tam ödeme, manavda kg/g seçimi, randevu saatine yetişme (analog saat kurma).
- **"Lahmacun Sofrası"**: siparişe göre bütün, yarım, çeyrek ve 3 çeyrek dilimleri doğru tabaklara dağıtılır; sonra "masada kaç bütün lahmacun var?" sorulur.

### Tema 5: Nesnelerin Geometrisi (2)
1. **Nerede?** `choice` + sahne: "Top masanın … (altında/üstünde/yanında)". 2.3.6
2. **Krokide bul.** `choice`: "Fırın ile marketin arasında ne var?". 2.3.6
3. **Izgarada git.** Izgara + `choice`: "Kelebek 4 kare sağa, 1 kare yukarı giderse kime ulaşır?". 2.3.6
4. **Eksik yönergeyi tamamla.** `choice`/`input`: "Ördek 7 kare … 1 kare … giderse sincaba ulaşır". 2.3.6
5. **Oklarla kodla.** `sequence` (ok kartlarını sırala): köpeği kemiğe ulaştır; engelli kareler var. 2.3.6
6. **En kısa yol.** `choice`: iki ok dizisinden hangisi daha kısa? 2.3.6
7. **Simetrik mi?** `sort` (2 sepet): kelebek, yaprak, harf A, harf F, kilim motifi. 2.3.7
8. **Doğru çizgiyi seç.** `choice` (3 çizgi üzerinde aynı görsel): hangisi simetri çizgisi? 2.3.7
9. **Yarımları eşleştir.** `match`/`memory`: kesilmiş top ya da kar kristali yarımları. 2.3.7
10. **Simetrisini boya.** Izgarada sol yarı hazır, sağ yarının karelerine dokunarak tamamlanır. 2.3.7

Tema sonu oyunları:
- **"Hazine Haritası"** (kitaptaki bahçe etkinliğinin dijital hâli): krokide "ağacın arkası, bankın sağı" ipuçlarıyla 5 nesne toplanır, sonra ok kodu yazılarak başlangıca dönülür.
- **"Ayna Atölyesi"**: kilim veya çini motifinin yarısı verilir; çocuk simetriğini kurar ve motif ada dekoruna eklenir.

### Tema 6: Veriye Dayalı Araştırma
1. **Bu bir araştırma sorusu mu?** `choice` (D/Y): "Ayşe'ye en sevdiği rengi sordum" → Y (tek kişi). 2.4.1
2. **Ayıkla.** `pop`: "Geleneksel oyun olmayan cevapları patlat" (salıncağa binme). 2.4.1
3. **Grupla.** `sort` (3–4 sepet): isim kartlarındaki cevapları kategorilere ayır. 2.4.1
4. **Çetele oku/yaz.** `tally` + `input`: |||| || → 7; tersi: 9'u çetele çiz. 2.4.1
5. **Tablodan grafiğe.** `pictograph`: sıklık tablosundaki sayılar kadar ○ yerleştirilir (şekil grafiği, ≤ 10). 2.4.1
6. **En çok, en az.** `choice` + şekil grafiği. 2.4.1
7. **Kaç fazla?** `input`: "Öğretmen olmak isteyenler doktordan kaç fazla?" (11 − 9). 2.4.1
8. **İki grup karşılaştır.** `choice`: 2/A ve 2/B tablosu; "Hangi kursu iki sınıfta eşit sayıda kişi seçti?" 2.4.1
9. **Ölçekli grafik.** `input`: "Her ○ 2 kişiyi gösterir; baklavada 4 ○ var" → 8. İleri seviye. 2.4.1
10. **Sırala.** `order`: dondurma çeşitlerini çoktan aza diz. 2.4.1

Tema sonu oyunları:
- **"Ada Anketi"**: Fındık adadaki hayvanlara bir araştırma sorusu sorar. Cevaplar balonlarla gelir. Çocuk çetele tutar, tabloyu doldurur, şekil grafiğini kurar ve bir karar verir ("En çok istenen meyve ağacını dikelim").
- **"İki Köy Yarışı"**: iki köyün (iki veri grubu) şekil grafikleri yan yana gösterilir; en çok, en az, eşit ve fark sorularıyla köy bayrağı kazanılır.

## 5. 7–8 yaş için notlar

- **Okuma yükü:** 2. sınıf çocuğu akıcı okumaya yeni geçiyor. Problem metinleri en fazla 2–3 kısa cümle olmalı ve her zaman sesli okunmalı (TTS). Kitaptaki uzun "Verilenler/İstenenler" yazma işi oyunda sürükle-bırak etiketlerle yapılmalı.
- **Somuttan soyuta:** her yeni işlem önce görselle (blok, grup, para, pasta) gelmeli, sonra sembolle. Kitap da aynı sırayı izler: ritmik sayma → tekrarlı toplama → x; ardışık çıkarma → ÷. Eldeli toplama ve onluk bozma ilk turlarda blok animasyonuyla gösterilmeli.
- **Uyarlanabilir zorluk basamakları:**
  - toplama-çıkarma: eldesiz/bozmasız → eldeli/bozmalı → iki adımlı problem
  - çarpma: ×2, ×5, ×10 kolay; ×3, ×4 orta; ×0, ×1 kavramsal
  - saat: tam → buçuk → çeyrek geçiyor → çeyrek var ("çeyrek var" en zor: okunuşta bir sonraki saat söylenir)
- **Sık hatalar ve geri bildirim:**
  - basamakları yer değiştirme (36/63)
  - çıkarmada küçükten büyüğü çıkarma (32 − 27'de 7 − 2 yapma)
  - "çeyrek var"da yanlış saat okuma
  - 45'in "eşit mesafede" olduğunu kaçırma
  - eş olmayan parçalara "yarım" deme
  - şekil grafiğinde ölçeği (her ○ = 2) unutma

  Yanlış cevapta doğruyu hemen söylemek yerine görsel ipucu verilmeli (blokları göster, saati yavaşça çevir).
- **Dil:** kitabın kalıp cümleleri kullanılmalı: "9 kere 2", "12'nin 2'ye bölümü", "…'dan başlayıp … artar", "daha yakındır / eşit mesafededir", "tahminim fazlaymış". `<`, `>`, ½, "etkisiz eleman" gibi üst sınıf gösterim ve terimleri kullanılmamalı.
- **Kültür ve değerler:** kitabın bağlamları özgün ve güvenlidir: simit, pide, lahmacun, mangala, Hacivat-Karagöz, 23 Nisan, harçlık biriktirme, israfı önleme. Paralar gerçek TL görünümüne yakın ama özgün çizimle gösterilmeli; portreler çizilmemeli, yalnız değer ve renk kullanılmalı **(?)**. Alışveriş oyunları gerçek satın almayı çağrıştırmamalı. Mesaj ihtiyaç-istek ve tasarruf üzerine kurulmalı.
- **Süre ve tempo:** tur başına 5–8 soru. Değerlendirme turu kitaptaki D/Y labirenti ve şifre biçiminde olabilir, çünkü çocuk bu formatları kitaptan tanıyor. Zaman baskısı yalnız isteğe bağlı "hız" modunda kullanılmalı. Tahmin oyunlarında süre "bak-gizle" amacıyla kullanılır, ceza amacıyla değil.
- **Tahmin kültürü:** kitap her ölçmeden önce tahmin istiyor ve tahmin yanlış olunca ceza yok, "fazla/az tahmin etmişim" diyerek yargı var. Oyunda da tahmin turu puan kaybettirmemeli. Ölçüme yakınlık ayrı bir yıldızla ödüllendirilmeli.
- **Motor beceri:** saat kollarını sürükleme ve ızgarada ok dizme tablet için büyük hedefle yapılmalı (≥ 64 px). Ok dizileri en fazla 5 adım olmalı.
