# 3. Sınıf Matematik Ders Kitabı Analizi (MEB, Türkiye Yüzyılı Maarif Modeli)

Kaynak: `docs/meb-kitaplar/metin/3-matematik-ders-kitabi-1kitap.txt` ve `-2kitap.txt` (pdftotext). Görseller metne geçmediği için görsele dayalı ayrıntılar metinden çıkarıldı; emin olunamayanlar **(?)** ile işaretlendi. Kazanım kodları kitapta basılı değildir; bölüm başlıkları `docs/meb/matematik-1-4.txt` (3. sınıf, s.85–120) ile eşleştirildi. Sınırlar kitap ile programın "Öğrenme-Öğretme Uygulamaları" metinlerinin birlikte okunmasıyla belirlendi. Üretici: `src/content/generators/matYolu3.ts`.

## 0. Kitabın kendi başlıkları ve kuralları

- Her bölüm şu kutularla ilerler: **HATIRLAYALIM → BAĞLANTI KURALIM → BİRLİKTE ÖĞRENELİM → ETKİNLİK → Bilgi Kutusu → ÇÖZELİM ÖĞRENELİM → PEKİŞTİRELİM → PERFORMANS GÖREVİ**. Her tema **TEMA DEĞERLENDİRME** ile biter (3. tema değerlendirmesi 2. kitapta).
- Temanın başında **ANAHTAR KAVRAMLAR** sayfası vardır. Yeni semboller: `<`, `>` (büyüktür/küçüktür, 1. tema), `t`, `km`, `s` (2. tema), `L` (4. tema).
- Kitabın sonunda Sözlük ve **Ek-1** (24 çarpım tablosu kartı: 4×7, 9×3, 8×9…).
- Soru türleri: boşluk doldurma, eşleştirme, D/Y, tablo doldurma, şifre/kapı kodu, labirent çıkışı, yönerge zinciri ("1. adım… 2. adım…"), "tahminim / gerçek sonuç / fark" tablosu. Çoktan seçmeli azdır.
- Karakterler ve bağlamlar: okul kantini, kırtasiye, pazar, fırın, balıkçı, kumbara, basketbol/voleybol, tiyatro bileti, geri dönüşüm kampanyası, müze gezisi, kilim motifleri, hava durumu günlüğü. Bu projede **adlar ve cümleler özgün** yazılır, kitaptakiler birebir kopyalanmaz.

## 1. Kitap yapısı ve kod eşleşmesi

Programdaki işleniş sırası kitapla aynıdır: Sayılar 1 → Sayılar 2 → İşlemler → Geometri 1 → Geometri 2 → Veri. 3. tema iki kitaba bölünmüştür: toplama-çıkarma 1. kitapta, çarpma-bölme 2. kitaptadır.

### 1. Kitap
| Tema | Bölüm (satır / sayfa) | Kod |
|---|---|---|
| **1. Sayılar ve Nicelikler (1)** | Sayıları Okuma ve Yazma (L199, s.12) | MAT.3.1.1 |
| | Sayıları Çözümleme (L341, s.18) | MAT.3.1.2 |
| | Sayıları Sıralama + en yakın onluk/yüzlük (L652, s.28) | MAT.3.1.3 |
| | Ritmik Sayma (L1064, s.40) | MAT.3.1.4 |
| | Tek ve Çift Sayılar (L1550, s.56) | MAT.3.1.5 |
| | Tek ve Çift Sayıları Toplama (L1764, s.63) | MAT.3.1.6 |
| | Sayı ve Şekil Örüntüleri (L1929, s.68) | MAT.3.1.7 |
| | Nesnelerin Sayılarını Tahmin Etme (L2081, s.74) | MAT.3.1.8 |
| | 1. Tema Değerlendirme (L2215, s.79) | |
| **2. Sayılar ve Nicelikler (2)** | Bütün, Yarım ve Çeyreğin Kesir Gösterimi (L2429, s.86) | MAT.3.1.9 |
| | Bir Bütünü Oluşturan Eş Parçalar — birim kesir (L2569, s.92) | MAT.3.1.10 |
| | Pay ve Payda Arasındaki İlişki (L2703, s.97) | MAT.3.1.11 |
| | Analog ve Dijital Saatler (L3078, s.108) | MAT.3.1.12 |
| | Zaman Ölçü Birimleri + Romen Rakamları (L3263, s.114) | MAT.3.1.13 |
| | Olayların Oluş Sürelerini Tahmin Etme (L3616, s.124) | MAT.3.1.14 |
| | Uzunluk ve Kütle Ölçü Birimleri (L3685, s.126) | MAT.3.1.15 |
| | Madenî ve Kâğıt Paralar (L4202, s.144) | MAT.3.1.16 |
| | 2. Tema Değerlendirme (L4459, s.153) | |
| **3. İşlemlerden Cebirsel Düşünmeye**, 1. kısım | Toplama ve Çıkarmanın Sonuçlarını Tahmin Etme, zihinden işlem (L4625, s.160) | MAT.3.2.1 |
| | Toplama ve Çıkarma İşlemlerini Çözümleme (L5285, s.181) | MAT.3.2.2 |

### 2. Kitap
| Tema | Bölüm (satır) | Kod |
|---|---|---|
| **3. İşlemlerden Cebirsel Düşünmeye**, 2. kısım | Çarpma ve Bölmenin Sonuçlarını Muhakeme Etme (L200) | MAT.3.2.3 |
| | Çarpma ve Bölme İşlemlerini Çözümleme (L1081) | MAT.3.2.4 |
| | Yönergeleri Yorumlama (L1446) | MAT.3.2.5 |
| | Dört İşlem Gerektiren Problemleri Çözme (L1859) | MAT.3.2.6 |
| | Dört İşlem Gerektiren Problemleri Yapılandırma (L2058) | MAT.3.2.7 |
| | Eşitliğin Farklı Anlamları (L2135) | MAT.3.2.8 |
| | 3. Tema Değerlendirme (L2240) — toplama/çıkarma da tekrar edilir | |
| **4. Nesnelerin Geometrisi (1)** | Geometrik Cisimlerin Özellikleri (L2470) | MAT.3.3.1 |
| | Geometrik Şekilleri Sınıflandırma + köşegen (L2700) | MAT.3.3.2 |
| | Geometrik Cisimleri ve Şekilleri Çizme (L2905) | MAT.3.3.3 |
| | Çevre Uzunluğunu Tahmin Etme (L3090) | MAT.3.3.4 |
| | Sıvı Miktarını Tahmin Etme (L3365) | MAT.3.3.5 |
| **5. Nesnelerin Geometrisi (2)** | Simetri Doğrusu (L3702) | MAT.3.3.6 |
| | Simetrik Şekil (L3816) | MAT.3.3.7 |
| | Yönergeler ile Simetrik Şekiller — kodlama (L4032) | MAT.3.3.8 |
| **6. Veriye Dayalı Araştırma** | Veri Toplama ve Veriye Dayalı Karar Verme (L4263) | MAT.3.4.1 |

## 2. Bölüm özetleri

### Tema 1: Sayılar ve Nicelikler (1)
- **3.1.1 Okuma-yazma:** "bine kadar olan sayılar"; 108 "yüz sekiz", 476 "dört yüz yetmiş altı". Sayfa sayısı, telefon kodu gibi günlük kullanımlar.
- **3.1.2 Çözümleme:** taban blokları (yüzlük = 10 onluk). `142 = 100 + 40 + 2`, "5 yüzlük + 2 onluk = 520". Bilgi kutusu: "Üç basamaklı doğal sayılar; birler, onlar ve yüzler basamağından oluşur." "Rakamların bulundukları basamaklara göre aldıkları değere basamak değeri denir." Sıfırlı sayılar (403, 520). İpucu bilmeceleri ("yüzler basamağının değeri 300, onlar…").
- **3.1.3 Sıralama:** `<`, `>`, `=` (büyüktür, küçüktür, eşittir), "220 < 260 < 290" zinciri; küçükten büyüğe / büyükten küçüğe; sayı doğrusu ("114, 110 ile 120 arasındadır"). Yuvarlama: "birler basamağındaki rakam 5'ten küçükse kendi onluğuna, 5 veya büyükse bir sonraki onluğa"; aynı kural yüzlük için onlar basamağıyla. Ters soru: "en yakın onluğa yuvarlanınca 430 olan en küçük sayı" (425).
- **3.1.4 Ritmik sayma:** altışar 60, yedişer 70, sekizer 80, dokuzar 90 içinde; onar ve yüzer 1000 içinde; ileri ve geri. "Bir bukette 6 lale, 10 bukette?" tabloları (çarpma işareti yok).
- **3.1.5 Tek-çift:** "Birler basamağında 1, 3, 5, 7, 9 bulunan sayılar tek; 0, 2, 4, 6, 8 bulunanlar çift." İkiye eşit paylaşılma ile giriş. Üç basamaklı sayılara uygulanır.
- **3.1.6 Tek-çift toplamı:** tek+tek=çift, çift+çift=çift, tek+çift=tek. Örnekler iki basamaklı (15+22, 37+8).
- **3.1.7 Örüntüler:** "12'den başlayarak yedişer artan", "71'den başlayarak beşer azalan"; 121-221-321 (+100). İlk altı adımı yazma; şekil örüntüsünde adım başına şekil sayısı.
- **3.1.8 Tahmin:** 100'e kadar nesne; önce tahmin, sonra say, "az / çok / eşit" karşılaştır.

### Tema 2: Sayılar ve Nicelikler (2)
- **3.1.9 Kesir gösterimi:** dikey kesir; "boyanan parça sayısı / kesir çizgisi / toplam parça sayısı". 1/1 "birde bir" (bütün), 1/2 "ikide bir" (yarım), 1/4 "dörtte bir" (çeyrek).
- **3.1.10 Birim kesir:** "Bütünün eş parçalarından her birine birim kesir denir." 1/3, 1/5, 1/6, 1/8, 1/9, 1/10 (ayrıca 1/15, 1/100 örneği). 0–1 sayı doğrusunda birim kesirler.
- **3.1.11 Pay-payda:** "Modelin parça sayısı paydayı, boyanan parça sayısı payı ifade eder." 3/4 "dörtte üç"; 2/3, 5/8, 4/10, 9/10, 16/100; "9/10 kesrinin birim kesri 1/10". Kesir karşılaştırma ve denk kesir **yok**.
- **3.1.12 Saatler:** dakikasına kadar okuma, analog ve dijital (`02:05`, yazımı "02.05"). Okunuş yalnız **"…geçiyor"** ("altıyı elli geçiyor"); "kala" yok. Öğleden sonra için 24 saat: "akrebin gösterdiği saate 12 eklenir" (16.15).
- **3.1.13 Zaman birimleri:** 1 dk = 60 s ("s"), 70 s = 1 dk 10 s; 85 dk = 1 sa 25 dk; 1 gün = 24 saat; 1 hafta = 7 gün; 1 ay ≈ 4 hafta ≈ 30 gün; 1 yıl = 12 ay = 52 hafta ≈ 365 gün; ayların gün sayısı. **Romen rakamları I–XXIV** (yüzyıl, cilt, III. Selim, saat kadranı).
- **3.1.14 Süre tahmini:** uzun/kısa karşılaştırma (teneffüs–ders), "bir dakikadan kısa/uzun", tahmin–ölçüm.
- **3.1.15 Uzunluk-kütle:** 1 m = 100 cm; 120 cm = 1 m 20 cm (≈ 9 m'ye kadar); **km** tanıtılır ama m'ye çevrilmez (şehirler arası, nehirler). 30 cm = 3 × 10 cm; uygun cetvel seçimi. Kütle: yarım kg = 500 g, 1 kg = 2 yarım kg = 10 × 100 g; terazide 100 g ve 500 g ağırlıklarla 400–900 g; **ton (t)** yalnız kullanım alanı (tır, gemi), çevirme yok.
- **3.1.16 Para:** TL ve kuruş, "100 kuruş 1 TL'dir"; 4 lira 25 kuruş = 425 kuruş; 750 kuruş = 7 lira 50 kuruş; aynı miktarı farklı paralarla gösterme, en az sayıda para (180, 375, 465 TL). Para üstü bu temada açıkça yok.

### Tema 3: İşlemlerden Cebirsel Düşünmeye
- **3.2.1 Tahmin ve zihinden işlem (toplama-çıkarma):** terimler toplanan/toplam/eksilen/çıkan/fark. Tahmin: iki sayı en yakın onluğa yuvarlanır, "tahminim ile işlem sonucu arasındaki fark" (134 + 353 → 480; gerçek 487; fark 7). Zihinden: basamak değerlerine ayırma, bir toplananı parçalama, onar geri sayma (255 − 60).
- **3.2.2 Çözümleme:** üç basamaklı alt alta, "önce birler, sonra onlar, sonra yüzler"; eldeli (148 + 264 = 412), üç toplanan (197 + 232 + 323), değişme ve birleşme özelliği `(25 + 12) + 36`; onluk bozarak çıkarma (593 − 346); ilişkiler: "Toplamdan bir toplanan çıkarılınca diğer toplanan bulunur", "Eksilen = fark + çıkan"; `… + 450 = 858`, `713 − … = 408`.
- **3.2.3 Çarpma-bölme muhakemesi:** "Aynı sayıların toplanmasının kısa yolu çarpma işlemidir"; çarpım tablosu 10 × 10; "kat" kavramı ("6'nın 5 katı 30"); 10 ile çarpma "sağına bir sıfır", 100 ile "iki sıfır"; 10'a bölme "birler 0 ise sağdan bir sıfır silinir". Zihinden: 4 ile çarpmak = iki kez 2 ile çarpmak (28 × 4), basamaklara ayırarak çarpma (62 × 7 = 420 + 14). Tahmin: bir çarpanı en yakın onluğa yuvarla (22 × 4 ≈ 80). Bölmede "en büyük öge bölünendir", "**kalan her zaman bölenden küçüktür**" (18 ÷ 4 = 4, kalan 2).
- **3.2.4 Çarpma-bölme çözümleme:** alt alta çarpma birlerden başlar, elde eklenir (37 × 3 = 111; 263 × 3 = 789). Bölmenin sağlaması: "bölen ile bölüm çarpılır, kalan eklenir" (38 ÷ 7 = 5 k 3). Çarpmanın sağlaması: "çarpım bir çarpana bölünür". Grup modeli tabloları (grup sayısı × gruptaki nesne).
- **3.2.5 Yönergeler:** 3–5 adımlı zincir ("…'in 4 fazlası, yarısı, 5 eksiği"), basamak sorusu ("rakamları farklı en küçük üç basamaklı sayı" 102), kantin menüsüyle sipariş tutarı, metreli yol tarifi.
- **3.2.6 Problem çözme:** Problemi Anlayalım → Plan → Tahmin → Uygula → Kontrol. 2–3 adımlı problemler, sonuçlar ≤ 999 (150 − 2 × 24; (72 − 18) ÷ 6).
- **3.2.7 Problem kurma:** verilen kartlardan işlem seçme ve problem yazma; para üstü (950 − 796) bir kez.
- **3.2.8 Eşitlik:** dengedeki terazi; "11 + 13 = 72 ÷ 3"; sonucu aynı işlemleri eşleştirme.

### Tema 4: Nesnelerin Geometrisi (1)
- **3.3.1 Cisimler:** küp, kare prizma, dikdörtgen prizma, üçgen prizma, silindir, küre; **köşe, yüz, ayrıt** (küp: 8 köşe, 6 yüz, 12 ayrıt; üçgen prizma: 6 köşe, 5 yüz, 9 ayrıt; silindir: köşesi yok, 3 yüz (2 düz + 1 eğri) (?); küre: köşe ve ayrıt yok).
- **3.3.2 Şekiller:** kenar sayısına göre üçgen, dörtgen (kare, dikdörtgen), beşgen, altıgen, sekizgen. **Köşegen:** "Karenin/dikdörtgenin iki köşegeni vardır ve uzunlukları eşittir. Üçgenin köşegeni yoktur."
- **3.3.3 Çizim:** köşeler büyük harfle adlandırılır (ABC); araçlar: cetvel, mezura, şerit metre, kırık metre, dinamik geometri yazılımı; kareli/noktalı kâğıtta çizim.
- **3.3.4 Çevre:** "Bir şeklin çevresi, tüm kenarlarının uzunlukları toplamıdır." "Her kenar bir kez ölçülür." `Ç = 5 + 3 + 5 + 3 = 16 cm`. Standart olmayan birimler: karış, ataş (2 cm), adım (40 cm). Alan hesaplanmaz.
- **3.3.5 Sıvı:** litre (L); "Bir litre iki yarım litreye eşittir"; "1 litreden fazla / 1 litre / yarım litre / yarım litreden az"; 2–8 L → yarım litre sayısı. mL ve çeyrek litre yok.

### Tema 5: Nesnelerin Geometrisi (2)
- **3.3.6 Simetri doğrusu:** "Bir şekli iki eş parçaya ayıran doğruya simetri doğrusu denir." Kare 4, dikdörtgen 2, daire sonsuz simetri doğrusu. Dikdörtgenin köşegeni simetri doğrusu **değildir**.
- **3.3.7 Simetrik şekil:** yatay ve dikey simetri doğrusuna göre tamamlama; renk, büyüklük, yön korunur.
- **3.3.8 Kodlama:** ok kodları (sağa, sola, yukarı, aşağı), "Mavi noktadan 2 birim yukarı…" 5–7 adımlı yönergeler; simetrisini oluşturmak için yönergeyi yansıtma (dikey doğruda sağ↔sol, yatay doğruda yukarı↔aşağı).

### Tema 6: Veriye Dayalı Araştırma (3.4.1)
- Araştırma sorusu yazma ve ölçütlerle sınama (cevaplanabilir mi, grup belli mi), plan, veri toplama, gösterme, yorumlama, karar.
- Araçlar: **çetele tablosu, sıklık tablosu, şekil grafiği** (her şekil 1, 2 ya da 3 veri), **nokta grafiği** (yeni; her nokta 1 veri). Sütun grafiği ve ortalama yok.
- Sorular: en çok/en az, kaç fazla, toplam, D/Y yargıları, "2 kişi gelmeseydi?". Sıklıklar ≤ 12.

## 3. Sınırlar (üreticiler bu sınırları AŞMAMALI)

### Sayılar (MAT.3.1.1–3.1.8)
- Sayılar **0–1000**; alıştırmalarda en çok 999 (1000 yalnız sınır olarak). Bölük, binler basamağı yok.
- Basamaklar: birler, onlar, yüzler; basamak değeri; 0'lı sayılar.
- `<`, `>`, `=` **kullanılır** (2. sınıftan farklı).
- Yuvarlama yalnız **en yakın onluk ve en yakın yüzlük**.
- Ritmik sayma: 6'şar ≤ 60, 7'şer ≤ 70, 8'er ≤ 80, 9'ar ≤ 90, 10'ar ve 100'er ≤ 1000; ileri/geri. (2'şer–5'er önceki sınıftan.)
- Tek-çift: üç basamaklıya kadar; tek-çift toplam kuralı iki basamaklı örneklerle.
- Örüntü: sabit artış/azalış (adım 2–100).
- Tahmin: **≤ 100** nesne.

### Kesir, zaman, ölçme, para (MAT.3.1.9–3.1.16)
- Kesir: bütün/yarım/çeyrek gösterimi (1/1, 1/2, 1/4); birim kesir 1/2–1/10 (+1/100 örnek); basit kesir a/b (a ≤ b, b ≤ 10; 100 paydalı tek örnek). Okunuş "dörtte üç". **Karşılaştırma, denk kesir, çokluğun kesri, kesirle işlem yok.**
- Saat: dakikasına kadar; okunuş yalnız "…geçiyor"; dijital `hh:mm`; öğleden sonra 13–23 (12 ekle).
- Zaman birimleri: saniye–dakika–saat–gün–hafta–ay–yıl; dönüşümler 60 s = 1 dk, 60 dk = 1 sa (≤ 99 s / ≤ 99 dk bileşik), 24 sa, 7 gün, ≈30 gün, 12 ay, 52 hafta, 365 gün. Romen rakamı **I–XXIV**.
- Uzunluk: cm ↔ m (1 m = 100 cm; ≤ 9 m 99 cm), km yalnız tanıma (çevirme yok), mm yok.
- Kütle: g ↔ kg (yarım kg = 500 g, 1 kg = 1000 g, 100 g'lık parçalar), ton yalnız tanıma (çevirme yok).
- Para: TL + kuruş (25, 50 kr), 1 TL = 100 kr, "x lira y kuruş = … kuruş"; tutarlar ≤ ~500 TL; kâğıt 5–200 TL, madenî 1 TL ve kuruşlar. Para üstü tema 3'te tek örnek (çıkarma).

### İşlemler (MAT.3.2.1–3.2.8)
- Toplama/çıkarma: üç basamaklı, eldeli ve onluk bozmalı; toplam ≤ 1000 (alıştırmalarda ≤ 999); üç toplanan.
- Tahmin: sayılar **en yakın onluğa** yuvarlanır.
- Çarpma: çarpım tablosu 10 × 10; iki/üç basamaklı × bir basamaklı, eldeli, **çarpım ≤ 999**; 10 ve 100 ile kısa yoldan. (Kitapta birkaç iki basamaklı × iki basamaklı örnek var; üreticide kullanılmaz.)
- Bölme: bölünen **≤ 99**, bölen 2–9; **kalanlı bölme var**, kalan < bölen; 10'a bölme yalnız sonu 0 olan ≤ 100 sayılar. Sağlama: bölen × bölüm + kalan.
- Problemler en çok 3 adım, ara ve son sonuçlar ≤ 999.

### Geometri (MAT.3.3.1–3.3.8)
- Altı cisim (koni, piramit yok); köşe/yüz/ayrıt sayıları.
- Çokgenler: 3, 4, 5, 6, 8 kenar (yedigen yok); köşegen yalnız kare/dikdörtgen/üçgen (yok).
- Çevre: kenar uzunlukları toplamı, cm; kenarlar ≤ ~12 cm, çevre ≤ ~50 cm. **Alan ve açı yok.**
- Sıvı: L ve yarım L (≤ 8 L); mL yok.
- Simetri: kare 4, dikdörtgen 2, daire sonsuz; yatay/dikey; ızgarada kodlama.

### Veri (MAT.3.4.1)
- Tek veri grubu; çetele, sıklık tablosu, şekil grafiği (ölçek 1–3), nokta grafiği. Sıklıklar ≤ 12. Sütun grafiği yok.

## 4. Oyunlaştırma önerileri (→ mekanik / görsel)

### Tema 1: Sayılar ve Nicelikler (1)
1. Sayı Kütüphanesi — okunuş ↔ rakam (seçmeli, eşleştirme)
2. Okunuşu yaz → sayı tuş takımı (input)
3. Taban blokları — yüzlük/onluk/birlik sayısı (`blocks` + input)
4. Basamak değeri avı (numChoice; "9'un basamak değeri")
5. İpucu bilmecesi — "yüzler 3, onlar değeri 50…" (input)
6. Büyüktür–küçüktür kapısı (`<`/`>`/`=` seçmeli)
7. Sırala treni — 4 üç basamaklı sayı (order)
8. En yakın onluk / yüzlük (sayı doğrusu `sequence` + seçmeli)
9. Ritmik sayma köprüsü — 6/7/8/9/10/100'erle boşluk (input, `sequence`)
10. Ritmik balonlar — sayarken söylenenleri patlat (pop)
11. Tek mi çift mi? sepetleri (sort) + tek/çift balonları (pop)
12. Tek+çift kuralı — D/Y ve "toplam tek mi çift mi" (tf, seçmeli)
13. Örüntü kuralı — sıradaki sayı, kuralı seç (numChoice, seçmeli)
14. Tahmin et — `objects` ≤ 100, yaklaşık onluk (seçmeli)
- Oyunlar: **Sayı Şehri Rallisi** (karma, 8 tur), **Ritim Balonları** (balon + sıralama, 4 tur)

### Tema 2: Sayılar ve Nicelikler (2)
1. Kesir gösterimi — pie/bar → 1/2, 1/4 (seçmeli)
2. Birim kesir — d eş parçanın biri (fraction + seçmeli)
3. Pay ve payda — boyalı/toplam parça (input), okunuş eşleştirme (match)
4. Kesrin birim kesri (seçmeli)
5. Saat kaç? — dakikalı analog/dijital (`clock`/`digital`)
6. Öğleden sonra saati — 12 ekle (input)
7. Saniye–dakika–saat dönüşümleri (input, hafıza)
8. Takvim ve zaman birimleri (eşleştirme, D/Y)
9. Romen rakamları I–XXIV (eşleştirme, seçmeli)
10. Ne kadar sürer? (seçmeli, sort: dakikadan kısa/uzun)
11. m ↔ cm (input), uygun birim (sort cm/m/km)
12. g ↔ kg, ton nerede? (input, sort g/kg/t)
13. Lira ve kuruş (input), en az para ile öde (seçmeli `money`)
- Oyunlar: **Zaman Makinesi** (karma), **Pazar Tezgâhı** (para/ölçü hafıza + eşleştirme)

### Tema 3: İşlemlerden Cebirsel Düşünmeye
1. Tahmin et, hesapla — en yakın onluk tahmini (seçmeli), fark (input)
2. Zihinden toplama/çıkarma (numChoice)
3. Alt alta toplama — eldeli (`column` + input)
4. Onluk bozarak çıkarma (`column` + input)
5. Kayıp sayı — toplama/çıkarma ilişkisi (`equation` + input)
6. Üç toplanan, değişme/birleşme (input, match)
7. Çarpım tablosu (numChoice), çarpım balonları (pop)
8. Kat kavramı — "6'nın 5 katı" (input)
9. 10 ve 100 ile çarpma, 10'a bölme (numChoice)
10. Çarpma alt alta — iki/üç basamaklı × bir basamaklı (input)
11. Kalanlı bölme — bölüm ve kalan (input), `share` paylaştırma
12. Sağlama (seçmeli)
13. Yönerge zinciri (input)
14. Problem çöz — 2–3 adım (input/numChoice); işlem seç (seçmeli)
15. Eşitlik terazisi (D/Y, eşleştirme)
- Oyunlar: **Dört İşlem Kalesi** (karma), **Şifreli Kapı** (balon + eşleştirme + yönerge)

### Tema 4: Nesnelerin Geometrisi (1)
1. Cismi tanı (`solid` + seçmeli)
2. Köşe, yüz, ayrıt say (`solid` + numChoice)
3. Özelliğe göre cisim ("beş yüzü var") (seçmeli), hafıza
4. Kenar sayısı → şekil adı (`shape` + seçmeli), sort üçgen/dörtgen/çok
5. Köşegen D/Y (tf)
6. Çizim araçları (eşleştirme)
7. Çevre hesapla (input), kare çevresi (input)
8. Standart olmayan birimle çevre (ataş 2 cm, adım 40 cm) (numChoice)
9. Litre ve yarım litre (input, sort)
10. Sıvı tahmini (seçmeli)
- Oyunlar: **Geometri Atölyesi** (karma), **Şekil Hafızası** (hafıza + sepet)

### Tema 5: Nesnelerin Geometrisi (2)
1. Kaç simetri doğrusu? (`shape` + numChoice)
2. Simetrik mi? (sort) — harfler (pop)
3. Simetri doğrusu D/Y (tf)
4. Yatay/dikey yansıma — yönü çevir (seçmeli)
5. Yönergeyi yansıt — kodlama (seçmeli, ızgara `grid` yolu)
6. Ok kodu takip et (`grid`)
- Oyunlar: **Ayna Labirenti** (karma), **Kilim Ustası** (balon + sepet)

### Tema 6: Veriye Dayalı Araştırma
1. Araştırma sorusu uygun mu? (tf, sort)
2. Çetele oku (`tally` + input)
3. Şekil grafiği, ölçekli (her şekil 2 kişi) (input)
4. Nokta grafiği (sıklık tablosu ile) (input)
5. En çok/en az, kaç fazla (seçmeli/input)
6. Veriye dayalı karar (seçmeli)
- Oyunlar: **Okul Anketi** (karma), **Hava Günlüğü** (grafik + çetele)

## 5. 8–9 yaş için notlar
- Bir soruda tek beceri: dönüşüm sorusunda yalnız dönüşüm, işlem sorusunda bağlam kısa.
- Büyük sayılar için `blocks`, `sequence`, `column` görselleri kullan; okunuşta Türkçe sözcükleri doğru yaz ("yüz sekiz", "dokuz yüz doksan").
- Kalanlı bölmede cevabı iki ayrı soruda iste (bölüm / kalan) ya da seçmelide "5, kalan 3" biçiminde ver.
- Saat okunuşunda kitap gibi yalnız "geçiyor" kalıbı; dijitalde `hh:mm`.
- Kesirleri metinde "1/4" biçiminde yaz, okunuşunu ("dörtte bir") açıklamada ver.
- `<` ve `>` 3. sınıfta kullanılabilir; seçmelide sembol + okunuş birlikte.
- Para görselinde kâğıt ≥ 5 TL, madenî 1 TL, 50 kr, 25 kr.
- Kişisel veri, reklam, satın alma yok; problem bağlamları okul, pazar, kumbara, doğa — özgün adlarla.
