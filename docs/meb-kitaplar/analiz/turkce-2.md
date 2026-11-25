# 2. Sınıf Türkçe — MEB Ders Kitabı Analizi (oyun tasarımı için)

Kaynaklar: Türkçe Ders Kitabı 2. Sınıf 1. Kitap (Temalar 1–4, MEB Yayınları no 10259, TTKB kabul 05.05.2025) ve 2. Kitap (Temalar 5–8), `docs/meb/turkce-1-4.txt` (2. sınıf tema tabloları, s. 69–110) ve `docs/meb/turkce-ek1-ogrenme-ciktilari.txt` (2. sınıf çıktıları T.D/T.K/T.O/T.Y.2.x).

**Notlar**
- 2. sınıf `.txt` dosyaları 1. sınıftakinin aksine **UTF-8 ve ğ/ş/ı harfleri sağlam** (yalnızca Andımız'daki bitişik harfler bozuk: "çalşkanm"). Renkli kutu içindeki bazı kural cümleleri iki sütun iç içe geçtiği için karışık çıkmış (ör. "hDaervflleetbaadşllaarr.ı büyük" = "Devlet adları büyük harfle başlar."). Bu tür yerler **(?)** ile işaretlendi.
- Dinleme ve izleme metinleri kitapta basılı değil, yalnızca karekodla veriliyor. Bu metinlerin içeriği kitaptaki sorulardan çıkarıldı **(?)**.
- Metinler kopyalanmadı. Başlıklar, kendi cümlelerimle 1–2 cümlelik özetler ve soru bankası kurmak için gereken kısa sözcük ve örnekler var. Bölüm 4'teki okuma parçaları tamamen bize ait.
- Kazanım kodları kitapta basılı değil. Tema düzeyindeki kodlar programın tema tablolarından birebir alındı. Kodların metin ve etkinliklerle eşleşmesi benim çıkarımım; emin olmadığım yerler **(?)** ile işaretli.

---

## 0. Kitabın yapısı ve tekrar eden başlıklar

**Kitap başı**: Kitabımızı Tanıyalım (semboller: dinleme, izleme, konuşma, okuma, yazma, köprü kurma, boyama, oyun, görsel inceleme, sözlük çalışması) → **Hatırlayalım** (tatil dönüşü tekrar, 3–4 sayfa).
- 1. kitap Hatırlayalım (s. 13–15): alfabeyi sırayla yazma; verilen heceyle başlayan sözcük bulma (o, ya, se, be, dö, çi, ak, ün, yağ, sil, çan, bil); **sesli/sessiz harf + heceleme + hece sayısı tablosu** (gemi, çanta, kalp, otobüs, papatya); kısa metinle 3 soru (paylaşılan beslenme); görsel okuma (kaç çocuk var, hangi mevsim, ne yapıyorlar); yönergeye göre resim tamamlama.
- 2. kitap Hatırlayalım (s. 13–15): diyalogda nezaket ifadelerini tamamlama (teşekkür ederim, rica ederim, hoşça kal); **mı/mi/mu/mü/musun/miyim** ile soru tamamlama; görme engelli birine yardım üzerine konuşma; hayalî bir yemeğin adı, malzemesi ve yapılışını yazma.

**Her tema aynı akışla ilerler:**
1. **Tema kapağı**: tema adı, **Anahtar Kavramlar**, metin başlıklarının listesi ("Metinlerimiz"), tanıtım paragrafı.
2. **Ön Değerlendirme Çalışması** (1 sayfa): kavram bulmacası, kavram ve tanım eşleştirme, çağrışım haritası ya da yarım metin.
3. Her metin için:
   - **METNE YOLCULUK BAŞLIYOR**: Hazırlık sayfası. Görsel inceleme, bilmece, el işi yönergesi (kalemlik, müzik aleti, kâğıttan kayık, mama kabı), şarkı/QR, sanal gezi ya da şifre çözme olabilir.
   - Metin sayfası: "Başlığı ve görseli inceleyip konuyu tahmin edelim" → "önce sessiz sonra sesli okuyalım; bilmediğimiz sözcüklerin altını çizelim". Kenar kutusunda tür tanımı verilir (bilgilendirici, öyküleyici, şiir).
   - **Metnin konusunu yazalım / Tahminimizle karşılaştıralım**: Her metinde var.
   - **SÖZLÜK ÖZGÜRLÜKTÜR**: 2–3 koyu sözcük, her biri için iki bağlam cümlesi verilir. Öğrenci önce "Tahminim", sonra "Sözlük Anlamı" yazar ve ardından sözcükle cümle kurar (www.sozluk.gov.tr). Bazı metinlerde bunun yerine **görselle tanım eşleştirme** yapılır ve bir çeldirici tanım eklenir.
   - Metinle ilgili 3–5 açık uçlu soru. Bu bölümde konuşma kuralı hatırlatması da yer alır ("Konuşurken göz teması kuralım").
   - **BİLGİ HAZİNESİ**: Dil bilgisi ya da yazım kuralı kutusu. Kural, kısa örnekli bir metin üzerinden gösterilir ("Noktanın kullanıldığı yerleri inceleyelim"). Ardından alıştırma gelir.
   - **KONTROL BENDE**: Dinleme, okuma, konuşma ve yazma kuralları ile ortam için öz değerlendirme listesi. Öğrenci uyguladığı maddenin dairesini boyar.
   - Yazma görevi: mektup, günlük, e-posta, tebrik kartı, davetiye, kütüphane üye kartı, seçim sloganı, konuşma planı ya da yazma planı.
   - Sayfa kenarındaki QR oyun adları (yalnızca adları var): "Noktalama Oyunu", "Zıt Anlamlı Sözcükler", "Cümleyi Tamamla, Meyveleri Topla", "Okçu Kirpi", "Sevimli Fil", "Zıt Anlam Oyunu", "Noktalamalarla Yolculuk", "Kurallı Konuşuyorum", "Sessiz Sinema", "Benzeriz, Farklıyız!", "İleti Türlerini Yazıyorum", "Tablo, Grafik ve Broşürleri Tanıyorum", "Araştırıyorum, Öğreniyorum", "Sözlük Kullanmayı Öğreniyorum", "Okuma Serüvenim".
4. **KENDİMİZİ DEĞERLENDİRELİM** (tema sonu, 2 sayfa): Yalnızca bu kitap için yazılmış 70–150 sözcüklük kısa bir metinle yapılır. Sorular: konu bulma (bazen iki seçenekli), 2 sözcüğün sözlük anlamı, 2–3 soru, olay sıralama ya da metni tamamlama, noktalama, büyük harf veya zıt anlam alıştırması.
5. **Ek Değerlendirme / Görev Avcıları / Değerlendirme Formları**: Yalnızca QR ile verilir, basılı değildir.
6. 4. ve 8. temaların sonunda **PEKİŞTİRELİM** (ek çalışma) yer alır: karma tekrar sayfaları. Kitap sonunda **Sözlük** (A–Z, 20–30 madde), Kaynakça, Cevap Anahtarı (QR), Türkiye ve Türk Dünyası haritaları bulunur.

**Kitapta tekrar eden karakter yoktur.** Her metinde yeni adlar kullanılır. T4 Pekiştirelim'de **Fındık adlı bir köpek** geçer; bu, maskotumuzla tesadüfi bir ad benzerliğidir ve sorun yaratmaz.

---

## 1. Tema → metin → kod tablosu

Tür kısaltmaları: **D** = dinleme metni (QR), **İz** = izleme metni (QR), **Ö** = öyküleyici (hikâye), **B** = bilgilendirici, **Ş** = şiir, **KD** = Kendimizi Değerlendirelim metni.

| Tema | Metin (sayfa) | Tür | Metinde/etkinliklerde öne çıkan kodlar |
|---|---|---|---|
| **1. Değerlerimizle Varız** (K1 s. 16–55) | İyilik Yap İyilik Bul (20–26) | D, B | T.D.2.2.b, T.D.2.3.a-b, T.Y.2.2.g (olay sırası), T.Y.2.2.a (görselden eksik cümle), T.Y.2.3.ğ (nokta) |
| | Büyüklerim (28–32) | Ş | T.O.2.2.b, T.O.2.3.a, T.Y.2.2.c; dize/kıta bilgisi (?) |
| | Nihan'ın Kardeşi (34–40) | Ö | T.O.2.2.c (ara tahmin), T.K.2.2.e, T.Y.2.2.a, T.Y.2.3.ğ (virgül), mektup (T.Y.2.1.a) |
| | Güvercin Tini (42–46) | Ö (hayvan masalı) | T.O.2.3.a, karşılaştırma (?), T.Y.2.3.ğ (tırnak işareti) |
| | Horozun Sorumluluğu (48–53) | Ö | T.O.2.2.c, T.O.2.3.b, T.K.2.2.e, T.Y.2.2.b (yarım metin) |
| | KD: İki Kardeş (54–55) | Ö | T.O.2.3.b, T.Y.2.2.g, T.Y.2.3.ğ |
| **2. Atatürk ve Çocuk** (K1 s. 56–93) | Pırıl Cumhuriyet Bayramı Şarkısı (60–64) | D (şarkı/animasyon?) | T.D.2.2.b, T.D.2.2.ğ, T.Y.2.3.f (büyük harf), T.K.2.2.c (benzer/farklı) |
| | Minik Ali ve Zafer Bayramı (66–70) | Ö | T.O.2.3.b, T.Y.2.3.ğ (ünlem), T.O.2.2.f (zıt anlam) |
| | Öğretmen Olun! (72–78) | Ö (gerçek anı) | T.Y.2.2.m (neden–sonuç), T.O.2.2.f (zıt anlam bulmacası), T.Y.2.3.ğ (soru işareti), T.K.2.1.e (selamlaşma) |
| | Çanakkale (80–84) | Ş | T.O.2.2.d, T.Y.2.2.ç, T.Y.2.3.f (büyük harf: kurum/yer/eser adları) |
| | Atatürk'ün Çocuk Sevgisi (86–91) | B | T.Y.2.2.l (örneklendirme), T.K.2.1.e (hitap), T.Y.2.3.ğ (iki nokta) |
| | KD: Şekerci Ökkeş (92–93) | B/Ö | T.O.2.3.b, T.Y.2.3.f, T.Y.2.3.ğ, T.O.2.2.f |
| **3. Doğada Neler Oluyor?** (K1 s. 94–131) | Sürpriz Ağacı (98–102) | D | T.D.2.2.b, T.D.2.2.g (meyveleri renge göre sınıflama), T.Y.2.2.k (benzetme) |
| | Çiçekli Çaydanlık (104–110) | Ö | T.O.2.3.b, T.K.2.5.a/c (konuşma kontrolü), T.Y.2.2.k, T.Y.2.3.d (mı/mi) |
| | Sıfır Atık Günlüğü (112–116) | B (günlük) | T.O.2.2.g, T.Y.2.3.ç (e-posta), T.O.2.2.e (atık sınıflandırma) |
| | Ben Sağlıklı Çocuğum (118–122) | Ş | T.O.2.2.g, T.Y.2.2.i, yönerge yazma (?) |
| | Doğal Afetler (124–129) | B | T.K.2.2.ğ (neden–sonuç), T.O.2.2.e, T.O.2.3.b |
| | KD: İlkbahar Gelince (130–131) | Ş | T.O.2.3.b, T.Y.2.3.d, T.Y.2.3.ğ |
| **4. Okuma Serüvenimiz** (K1 s. 132–177) | Kelimelerin Masalı (136–140) | D | T.D.2.2.f, T.D.2.4.a, T.D.2.5.a-b (dinleme kontrolü) |
| | Kitap Okumayı Seviyorum (142–148) | Ö (söyleşi/mektup biçimli) | T.O.2.3.ç (görsel–cümle), T.O.2.4.b, T.Y.2.3.e (kısaltma) |
| | Cumhurbaşkanlığı Millet Kütüphanesi (150–156) | B | T.O.2.3.b, T.Y.2.5.a-c (yazma kontrolü), form doldurma (?) |
| | Kitaptaki Dünya (158–162) | Ş | T.O.2.3.b, T.K.2.3.c |
| | Dil Mirası Koruyucusu (164–169) | Ö | T.O.2.3.b, T.K.2.3.g/ğ (beden dili: Sessiz Sinema) |
| | KD: Minik Dostum (170–171) + Pekiştirelim (172–177) | Ö | T.Y.2.3.e, T.Y.2.2.m, T.Y.2.2.k, T.O.2.2.f (?) |
| **5. Yeteneklerimizi Tanıyoruz** (K2 s. 16–55) | Unutulan Oyunlar (20–24) | D | T.D.2.3.a-c, T.K.2.1.f (konuşma planı), T.Y.2.1.c (mektup hitabı) |
| | Türkülerin Babası Neşet Ertaş (26–32) | B (biyografi) | T.O.2.3.c (benzer/farklı), T.Y.2.4.a, T.Y.2.1.c-ç (tebrik kartı) |
| | Şu Oyuna Bak! İşte Şapalak! (34–38) | B (oyun yönergesi) | T.O.2.3.b, T.K.2.3.b, tekerleme |
| | Lokum, Oyun ve Oyuncak Müzesinde (40–46) | B (gezi yazısı) | T.Y.2.3.ğ (kesme işareti, kısa çizgi), T.Y.2.3.g (?) |
| | Meslekler (48–53) | Ş | T.O.2.2.b, eksik dize tamamlama, atasözü "Birlikten kuvvet doğar" (?) |
| | KD: Sanat Çalışmaları (54–55) | Ö | T.O.2.3.b-c, T.Y.2.2.f |
| **6. Mucit Çocuk** (K2 s. 56–93) | ASLAN-TEKNOFEST (60–66) | İz | T.D.2.2.c-ç, T.D.2.3.ç (söz–sahne eşleştirme), T.K.2.4.a (konuşma ortamı) |
| | Çok Merak, Çok Eğlence (68–72) | Ö | T.O.2.2.ç, T.K.2.2.d (**zıt anlam**) |
| | Meraklı, Cesur ve Maceracı Alper Gezeravcı (74–78) | B (biyografi) | T.Y.2.2.d (benzer/farklı), T.O.2.3.b |
| | Bilgi Çağı (80–84) | Ş | T.O.2.2.b-c, T.Y.2.2.e (geçmiş/günümüz sınıflama) |
| | Neler Oluyor? (86–91) | Ö | T.K.2.3.f (**ile, ve, ama, çünkü**), T.Y.2.2.d |
| | KD: Mucit Çocuklar (92–93) | Ö (yarım) | T.Y.2.2.f, slogan |
| **7. Kültür Hazinemiz** (K2 s. 94–133) | Nasreddin Hoca (98–102) | D (fıkra + şenlik bilgisi) | T.K.2.2.f (görüşe katılma), sözlük sırası (?), T.Y.2.2.ğ (yoğurt yapım yönergesi) |
| | 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı (104–108) | B | T.O.2.5.a-c (okuma kontrolü), T.O.2.3.b |
| | Anadolu (110–114) | Ş | T.K.2.2.g (**benzetme**), T.Y.2.2.ğ (afiş yönergesi) |
| | Bayrak Töreni (116–122) | Ö | T.O.2.3.b, İstiklâl Marşı ilk 4 kıta (ezber/bakmadan yazma) |
| | Bir Bayram Sürprizi (124–131) | Ö | T.Y.2.2.h (görüşe katılma, yazılı), deyim anlamı (?), benzetme |
| | KD: Bayram Sevinci (132–133) | Ş | T.O.2.3.b, T.O.2.5.a (okuma kuralları D/Y) |
| **8. Haklarımızı Biliyoruz** (K2 s. 134–179) | Çocuklar Haklarıyla Var (138–142) | İz | T.D.2.2.g (canlı/cansız sınıflama), T.D.2.5.a-c, T.K.2.5.a-c |
| | Bir Dünya Bırakın (144–148) | Ş | T.O.2.4.a (okuma ortamı), T.O.2.5.c |
| | Mırnav Dostları (150–156) | Ö | T.Y.2.1.d (yazma planı), T.Y.2.2.ı (öneri) |
| | Kararla Gelen Başarı (158–164) | Ö | T.K.2.1.b (seçim konuşması), T.O.2.3.b |
| | Yaz Tatilini Nasıl Değerlendirelim? (166–171) | B | T.Y.2.2.ı (mektup), T.O.2.3.b |
| | KD: Çocuk Hakları Durağı (172–173) + Pekiştirelim (174–179) | Ö | T.Y.2.2.j (e-posta), T.Y.2.3.ğ (karma noktalama), T.Y.2.2.d-e |

**Program tema tablolarındaki kodlar (birebir):**
- **T1**: T.D.2.1.a-c · T.D.2.2.b,c,ç · T.D.2.3.a,b · T.K.2.1.ç,d · T.K.2.2.a,e,h · T.K.2.3.a,c,ç,e · T.O.2.1.a,c,ç · T.O.2.2.a,b,c · T.O.2.3.a,b · T.Y.2.1.a · T.Y.2.2.a,b,c,f,g,ğ · T.Y.2.3.b,c,g,ğ. (Program T1'e **satır sonu** (g) koyuyor, ama kitap bunu T5'te işliyor.)
- **T2**: T.D.2.1.b,c · T.D.2.2.a,b,e,ğ · T.D.2.3.b · T.K.2.1.ç,d,e · T.K.2.2.b,c · T.K.2.3.a,c,ç,e · T.O.2.1.a,c,ç · T.O.2.2.a,b,c,d,**f (zıt anlam)** · T.O.2.3.b · T.Y.2.1.a · T.Y.2.2.c,ç,f,l,**m (neden-sonuç)** · T.Y.2.3.b,c,**f (büyük harf)**,ğ.
- **T3**: T.D.2.1.b,c · T.D.2.2.b,g · T.D.2.3.b · T.K.2.1.c,ç,d · T.K.2.2.ç,ğ · T.K.2.3.a,c,ç,e · T.K.2.5.a,c · T.O.2.1.a,c,ç · T.O.2.2.b,c,e,g · T.O.2.3.b · T.Y.2.1.a · T.Y.2.2.c,f,i,**k (benzetme)** · T.Y.2.3.b,c,ç,**d (mı/mi)**.
- **T4**: T.D.2.1.b,c · T.D.2.2.b,f · T.D.2.3.b · T.D.2.4.a · T.D.2.5.a,b · T.K.2.1.ç,d · T.K.2.2.a · T.K.2.3.a,c,ç,d,e,g,ğ,h · T.O.2.1.a,c,ç · T.O.2.2.b,c · T.O.2.3.b,ç · T.O.2.4.b · T.Y.2.1.a · T.Y.2.2.f · T.Y.2.3.b,c,**e (kısaltma)** · T.Y.2.5.a,b,c.
- **T5**: T.D.2.1.b,c · T.D.2.2.b · T.D.2.3.a,b,c · T.K.2.1.ç,d,f · T.K.2.2.a · T.K.2.3.a,b,c,ç,e,h · T.O.2.1.a,b,c,ç · T.O.2.2.b,c · T.O.2.3.b,c · T.Y.2.1.a,b,c,ç · T.Y.2.2.f,g · T.Y.2.3.b,c,ğ · T.Y.2.4.a.
- **T6**: T.D.2.1.b,c · T.D.2.2.b,c,ç · T.D.2.3.b,ç · T.K.2.1.ç,d · T.K.2.2.**d (zıt anlam)** · T.K.2.3.a,c,ç,e,**f (bağlaçlar)** · T.K.2.4.a · T.O.2.1.a,c,ç · T.O.2.2.b,c,ç · T.O.2.3.b · T.Y.2.1.a · T.Y.2.2.d,e,f · T.Y.2.3.b,c.
- **T7**: T.D.2.1.b,c · T.D.2.2.b,d,e · T.D.2.3.b · T.K.2.1.a,ç,d · T.K.2.2.f,**g (benzetme)** · T.K.2.3.a,c,ç,e · T.O.2.1.a,c,ç · T.O.2.2.b,c · T.O.2.3.b · T.O.2.5.a,b,c · T.Y.2.1.a · T.Y.2.2.ğ,h · T.Y.2.3.b,c.
- **T8**: T.D.2.1.b,c · T.D.2.2.b,g · T.D.2.3.b · T.D.2.5.a,b,c · T.K.2.1.b,ç,d · T.K.2.2.a · T.K.2.3.a,c,ç,e · T.K.2.5.a,b,c · T.O.2.1.a,c,ç · T.O.2.2.b,c · T.O.2.3.b · T.O.2.4.a · T.O.2.5.c · T.Y.2.1.a,d · T.Y.2.2.f,ı,j · T.Y.2.3.a,b,c.

> Uygulama için öneri: `src/content/games.ts` içinde **tema düzeyindeki** kodları "kesin" olarak kullan. Metin düzeyindeki eşleştirmeler yukarıdaki tabloda (?) işaretliyse `meb: 'TODO-dogrula'` ile gir.

---

## 2. Temalar ayrıntılı

### TEMA 1 — Değerlerimizle Varız (K1 s. 16–55)
Anahtar kavramlar: azim, çalışkanlık, nezaket, öz denetim, saygı, sevgi, sorumluluk alma.
Ön Değerlendirme: Kavram bulmacası (çalışkanlık, öz denetim, saygı, ahlak, azim, sevgi, sorumluluk, nezaket) tanımlarla eşleştirilir. Renkli kutulardaki harflerden şifre çıkar.

**(a) Metinler**
- **İyilik Yap İyilik Bul** (D): Karşılıksız yapılan bir iyiliğin, iyilik gören kişiyi de iyilik yapmaya yönelttiğini ve böylece dünyanın güzelleştiğini anlatan kısa bir bilgilendirici metin. *Ana fikir*: İyilik çoğaldıkça dünya güzelleşir.
- **Büyüklerim** (Ş, 4 kıta): Çocuk, dedesini ve ninesini sevdiğini, masallarını dinlediğini, onlara yardıma koştuğunu ve yanlarında mutlu olduğunu söyler. *Ana fikir*: Büyüklerimize sevgi ve saygı.
- **Nihan'ın Kardeşi** (Ö): Nihan kardeşi olacağını öğrenince önce şaşırır ve onu kıskanacağını düşünür. Bebek Cihan doğup minik eliyle Nihan'ın parmağını tutunca evin daha neşeli olduğunu fark eder. *Ana fikir*: Kardeş sevgisi. Bebekler bakıma muhtaçtır.
- **Güvercin Tini** (Ö): Hep kibar konuşan güvercin Tini, rüzgârda üşüyen ama kaba konuşan küçük serçeye kibarca istemeyi öğretir. Sonunda onu montunun içine alır ve birlikte ısınırlar. *Ana fikir*: Nezaket içimizi ısıtır.
- **Horozun Sorumluluğu** (Ö): Görevi sabahı duyurmak olan genç horoz, fırtınalı bir günde rüzgârla güçlükle mücadele ederek öttüğü yere ulaşır. Bütün evlerin ışığı yanana kadar görevini sürdürür. *Ana fikir*: Sorumluluk ve yılmadan çalışmak.
- **KD — İki Kardeş**: Dayılarının hediye ettiği bisikletlere binmeyi bilmeyen iki kardeş defalarca düşer ama pes etmez ve sonunda başarır. *Ana fikir*: Azim.
- Kısa ara metinler: Teneffüste beslenmesini paylaşan çocuk, yaşlı komşuya yemek götürme, boya kalemini paylaşma, yaralı kediyi veterinere götürme (görsellerden cümle tamamlanır). Ayrıca sofra hazırlanırken oynayan çocuk, okula geç kalan çocuk (neden–sonuç tablosu), halk oyunları kursunu bırakmak isteyen çocuk (yarım metin) ve ödevini yapmadan yatan çocuk (yarım metin).

**(b) Sözlük çalışması** (kısa anlamlar bizim ifademizle)
- tohum: bitkinin ekildiğinde filizlenen tanesi · kap: içine bir şey konan eşya · büyük (büyüklerimiz): yaşça bizden büyük olanlar · ninni: bebeği uyutmak için söylenen ezgi · sevinç: mutluluk duygusu · doğal: olması beklenen, kendiliğinden olan · mont: kalın dış giysi · gaga: kuşun ağzı · kümes: tavuk evi · mücadele: güçlüğe karşı çaba · azim: işi bırakmama kararlılığı · pes etmek: vazgeçmek.
- Kitap sonu sözlüğünden bu temaya ait maddeler: bardaktan boşanırcasına yağmak, nezaket, yardımsever, şart, soluklanmak, sözünü kesmek, vakit geçirmek, sergi.
- Kavramlar ve tanımlar: azim, çalışkanlık, nezaket, öz denetim, saygı, sevgi, sorumluluk.

**(c) Dil becerileri ve somut örnekler**
- **Nokta (.)** (s. 26): (1) cümle sonu, (2) sıra bildiren sayılardan sonra (2. sınıf, yarışmada 1. oldum, 4. sırada), (3) tarihte gün/ay/yıl arası (02.12.2025, 15.12.2025, 20.12.2025), (4) saat ve dakika arası (10.30, 11.00, 20.15, 14.30).
- **Virgül (,)** (s. 39–40): (1) hitap sözcüklerinden sonra (Sevgili Arkadaşım, / Sevgili Çocuklar, / Değerli Konuklar,), (2) sıralanan eş görevli sözcükler arasında. Örnekler: biberon, patik ve tulum · Hale, Zeynep ve Mehmet · Kerem, Ahsen ve Duru · elleri, ayakları, ağzı, burnu. 8 maddelik "( ) içine nokta/virgül koy" alıştırması var.
- **Tırnak işareti (" ")** (s. 46): Başkasının sözü tırnak içinde yazılır. Alıştırmada sözler konuşanla eşleştirilir (Tini, serçe). Öğretmenin bir sözü "Öğretmenim "…" dedi." kalıbıyla yazılır.
- **Şiir bilgisi** (s. 31): şiir yazan kişi şair, her satır dize (mısra), dört dizelik bölüm kıta (dörtlük). Şiirde her dize büyük harfle başlar. Eksik dize tamamlama yapılır.
- **Metin türleri** (kenar kutuları): bilgilendirici metin (bilgi vermek için yazılır), şiir (duygu ve düşünceler, seslerin uyumuyla anlatılır), öyküleyici metin (yaşanmış ya da kurgulanmış olayları anlatır).
- **Olay sırası**: Önce → Sonra → Daha sonra → En sonunda (iyilik zinciri: iyilik yapar → kişi mutlu olur → o da iyilik yapar → dünya güzelleşir). Horoz ve Nihan metinlerinde olaylar sözlü olarak sıralanır. İki Kardeş'te 3 olay yazılır.
- **Konu bulma (seçmeli)**: Horoz: "kümesi beklemesi / civcivleri gözlemesi / **sorumluluğunu yerine getirmesi**". İki Kardeş: "bisiklete binmenin zorluğu / **azimle çalışmanın önemi**".
- **Karşılaştırma ve sınıflandırma**: Tini ile serçenin özellikleri: yardımsever, nazik, kibar, sorumluluk sahibi, merhametli (Tini); kaba (serçe); uçabilir, öter (ikisi de).
- **Doğru davranışı seçme** (nezaket, boyama): sıra beklemek ✓, sinirlenince bağırmak ✗, konuşanın sözünü kesmek ✗, selam almak ✓, büyüklere "sen" demek ✗, hata yapınca özür dilemek ✓, teşekkür etmek ✓, başkasının eşyasını izinsiz kullanmak ✗.
- **Doğru/yanlış** (Horoz): işini zamanında yapar ✓, erkenden uyanır ✓, görevini tamamlamadan kümese döner ✗, zorluklarla mücadele eder ✓.
- **Sözcük bankasıyla boşluk doldurma** (yüklem seçme): uyanırdı / öterdi / dönerdi / başardı.
- **Neden–sonuç tablosu** (s. 47): Sonuç: Hasan okula geç kalıyor. Nedenler: erken yatmıyor, tabletle oynuyor, televizyon izliyor.
- **Mantık tablosu** (s. 25): Üç çocuk, üç şube ve üç iyilik verilir. İpuçlarıyla kimin hangi iyiliği yaptığı bulunur.
- **KD noktalama düzeltme**: Konuşma cümlesi tırnak içine alınır ve sonuna ünlem ya da nokta konur (gerçek kişi adlarıyla 3 cümle).
- Ünlem, soru, kesme bu temada kural olarak verilmez, yalnızca kullanılır.
- Deyim benzeri ifadeler (terim olarak verilmez): iple çekmek, bardaktan boşanırcasına yağmak, avazı çıktığı kadar, yardım elini uzatmak, pes etmek, yolunu tutmak.

**(d) Etkinlik türleri**: kavram–tanım bulmacası ve şifre · kavram haritası (insan/hayvan/bitki için iyilikler) · tahmin edip karşılaştırma · bağlamdan anlam tahmini · olay sıralama · görselden eksik cümle · mantık tablosu · ( ) içine noktalama · eksik dize · söz–konuşan eşleştirme · çiçek boyamalı doğru/yanlış · sözcük bankası · mektup yazma · yarım metni tamamlama · canlandırma.

---

### TEMA 2 — Atatürk ve Çocuk (K1 s. 56–93)
Anahtar kavramlar: millî egemenlik, millî irade, cesaret, Millî Mücadele, cumhuriyet, vatanseverlik, İstiklâl Marşı, kahramanlık, Mustafa Kemal Atatürk.
Ön Değerlendirme: cesaret, vatanseverlik, cumhuriyet ve kahramanlık tanımlarla eşleştirilir (fazladan bir "marş" tanımı çeldirici olarak verilir). Ardından bu sözcüklerle kısa metin yazılır.

**(a) Metinler**
- **Pırıl Cumhuriyet Bayramı Şarkısı** (D): Pırıl ve arkadaşlarının Cumhuriyet Bayramı'nı neşeyle, şarkıyla kutlaması **(?)**. Sorular "cumhuriyet ne demek" ve "çocuklar neden neşeli". *Ana fikir*: Cumhuriyet coşkusu.
- **Minik Ali ve Zafer Bayramı** (Ö): Ali kahvaltıda televizyonda kutlamaları görür. Annesi zaferin bir mücadeleyi kazanmak demek olduğunu ve 30 Ağustos'un anlamını anlatır. Ali pencereye bayrak asıp Atatürk'e teşekkür eder. *Ana fikir*: Zafer Bayramı'nın anlamı.
- **Öğretmen Olun!** (Ö, gerçek anı): Atatürk Konya'da istasyonda küçük bir kızın başını okşayıp ona okumasını ve öğretmen olmasını öğütler. Kız yıllar sonra öğretmen okulunda okurken Atatürk'ü bir kez daha görür ve Cumhuriyet'in ilk öğretmenlerinden olur. *Ana fikir*: Eğitime ve öğretmenliğe verilen değer.
- **Çanakkale** (Ş, kısaltılmış): Askerlerin sancağı selamlayıp Çanakkale'ye yürüyüşü ve vatan için fedakârlığı anlatılır. *Ana fikir*: Vatan sevgisi, kahramanlık. **Hassas: şehitlik ve kan dili, bkz. Bölüm 5.**
- **Atatürk'ün Çocuk Sevgisi** (B): Atatürk'ün yurt gezilerinde çocukları dinlediği, okulları ziyaret ettiği, doğru cevap verenleri ödüllendirdiği ve çocuklara güvendiği anlatılır. *Ana fikir*: Çocuklar geleceğin güvencesidir.
- **KD — Şekerci Ökkeş**: Millî Mücadele'de Kahramanmaraş'ta düşman bayrağının indirilmesine katılan cesur bir çocuk kahraman. *Ana fikir*: Çocuk kahramanlar da vatanı savundu.
- Ara metinler: İki çocuğun kendini tanıttığı kartlar (benzer/farklı yönler: sevdiği renk, spor, yemek, hayvan, çiçek). 6 meslek bilmecesi (doktor, manav, öğretmen, ressam, şoför, polis). Askerdeki ağabeyi ziyaret günlüğü (zıt anlam bulmacası). Selamlaşma diyaloğu. Bir hafta sonu gününün görsellerle sıralanması.

**(b) Sözlük**: şenlik (eğlenceli kutlama) · vatan (üzerinde yaşadığımız, sevdiğimiz ülke) · zafer (savaşta ya da yarışta kazanılan başarı) · marş (topluca söylenen coşkulu ezgi) · istasyon (tren durağı; çeldirici: otobüs durağı) · mektep (okulun eski adı) · sancak (bayrak) · süngü (tüfeğin ucuna takılan bıçak; **oyunda kullanma**) · yurt (vatan, ülke) · toplum (bir arada yaşayan insanlar) · savunma (korumak) · kahraman (cesur, yararlık gösteren kişi). Kitap sonu sözlüğü: cumhuriyet, emanet, feda, hitap, layık olmak, zalim, jandarma.

**(c) Dil becerileri**
- **Büyük harf kuralları** (s. 62–64, 83–84, 93):
  - dizelerin ilk harfi;
  - kişi adları ve özel adlar ("Özel adlar büyük harfle başlar" (?));
  - **devlet adları** (Azerbaycan, Kıbrıs, Özbekistan, Türkiye);
  - **dil adları** (Azerbaycan Türkçesi);
  - **kurum ve kuruluş adlarının her sözcüğü** (Türkiye Büyük Millet Meclisi, "Burç İlkokulu");
  - **millî ve dinî bayram ile anma günü adları** (Cumhuriyet Bayramı, Çanakkale Şehitleri'ni Anma, Öğretmenler Günü) (?);
  - **yer adları** (il, ilçe, köy, mahalle, cadde: Mardin, Çanakkale, Sivas, Çamardı/Niğde);
  - **kitap, dergi, gazete ve sanat eseri adları** ("Nutuk", "Büyük Zafer");
  - hayvan adları (kedi "Mırmır"), Anıtkabir.
  - Hata düzeltme cümlelerinin kalıpları: "[kişi adı] [şehir]'e gitti", "29 ekim cumhuriyet bayramı", "türkiye büyük millet meclisi", "24 kasım öğretmenler günü", "kuzenim [ad] türkiye'ye gelir gelmez anıtkabir'e gitti".
- **Ünlem (!)** (s. 69): hitaptan sonra (Küçük Hanımlar, Küçük Beyler!), sevinç, acı, korku ya da şaşkınlık bildiren cümlelerde (Yaşasın!), uyarı sözlerinden sonra (Dur yolcu! / Bu bayrak yere inmez!).
- **Zıt anlamlı sözcükler** (Bilgi Hazinesi s. 70: "anlamları birbirinin karşıtı olan sözcükler"):
  - s. 70: **üzgün ↔ mutlu**.
  - s. 76 günlük + harf bulmacası: **hasta ↔ sağlıklı**, **üzgün ↔ mutlu (sevinç)**, **ayrı ↔ birlikte**, **zayıf ↔ güçlü**, **kısa ↔ uzun**, **çirkin ↔ güzel**, gitmek ↔ gelmek (?).
  - s. 93 balonlar: **acı ↔ tatlı**, **ağır ↔ hafif**, **ileri ↔ geri**, **yukarı ↔ aşağı**, **boş ↔ dolu**, **düzenli ↔ dağınık** (çeldirici: beyaz).
- **Neden–sonuç cümleleri** (Bilgi Hazinesi s. 75: "bir olayın hangi sebeple olduğunu bildiren cümle"): "… için …" kalıbı, metinden 3 cümle ve yaşantıdan 3 örnek.
- **Soru işareti (?)** (s. 77): soru anlamı taşıyan cümle (Nasılsın? / Ezberledin mi?). 7 maddelik karma alıştırmada . , ? ! ve tırnak birlikte kullanılır. Örnek yapılar: "Erhan doktor olmak istediğini söyledi( )", "Marketten ekmek( ) mandalina( ) pırasa aldım( )", "Harika( )".
- **İki nokta (:)** (s. 91): örnek verilecek sözden önce (Millî bayramlarımız: 29 Ekim…, 23 Nisan…, 19 Mayıs…, 30 Ağustos…), açıklamadan önce (Bayrağımızın renkleri: kırmızı ve beyaz), sözcük tanımında (ülke: …).
- **Selamlaşma ve hitap**: Merhaba, Nasılsın?, Teşekkür ederim, Sayın Velimiz, Sevgili Günlüğüm, Hoşça kal.
- **Benzer ve farklı yönler**: iki çocuğun tanıtım kartı (ikisi de resim yapmayı sever; renkleri, sporları, hayvanları, çiçekleri farklı).
- **Olay sıralama** (s. 78): erken kalkma → kahvaltı → anneye yardım → oyun → masal kitabı okuma.
- **Bilmece ve eksik harf**: D_KT_R, M_N_V, ÖĞ_ _ _M_ _, R_ _S_M, Ş_F_R, P_L_S.
- KD'deki diğer çalışmalar: büyük harf düzeltme (3 cümle), ( ) içine noktalama (soru, ünlem, iki nokta, virgül), zıt anlam balonları.

**(d) Etkinlik türleri**: tanım eşleştirme · tahmin · büyük harf hata düzeltme · ( ) noktalama · zıt anlam kelime avı · zıt anlam balonlarını eşleştirme · neden–sonuç tamamlama · benzer/farklı · görsel sıralama · bilmece · hayalî çocukluk arkadaşlığı yazısı · Atatürk'e hitapla konuşma · sanal gezi.

---

### TEMA 3 — Doğada Neler Oluyor? (K1 s. 94–131)
Anahtar kavramlar: doğa, orman sevgisi, hayvan, tasarruf, iklim.
Ön Değerlendirme: kumbarada para biriktiren bir çocuk metni, boşlukları tahminle doldurma ve "kar topu gibi büyümek" ifadesinin anlamı.

**(a) Metinler**
- **Sürpriz Ağacı** (D): Mevsimler boyunca değişen bir ağacın sevdiği mevsimde meyve sürprizi yapması (metinde mandalina geçiyor). Ardından metindeki meyveler kelime avında bulunur ve renklerine göre ayrılır **(?)**. *Ana fikir*: Doğanın mevsimlik sürprizleri.
- **Çiçekli Çaydanlık** (Ö): Eskidiği için kenara ayrılan çiçekli çaydanlık önce bir çocuğun kalemliği, sonra bir ressamın fırçalığı, sonra fesleğen saksısı olur. En sonunda içine kuşlar yumurtlar. *Ana fikir*: Eskiyen eşyalar atılmadan yeniden değerlendirilebilir.
- **Sıfır Atık Günlüğü** (B, günlük biçimi): Günlüğüne yazan bir çocuk, plastik şişe yerine matara kullanarak ve kâğıdın arka yüzünü değerlendirerek az atık çıkarmayı anlatır. *Ana fikir*: Az atık çıkar, atığı geri dönüştür.
- **Ben Sağlıklı Çocuğum** (Ş, 4 kıta): erken yatıp erken kalkma, temiz hava, süt, bol meyve-sebze, yemek seçmeme, temiz eller. *Ana fikir*: Sağlıklı yaşam alışkanlıkları.
- **Doğal Afetler** (B): Doğal afetin tanımı, türleri (deprem, sel, toprak kayması, orman yangını, çığ, fırtına, hortum), önlemleri (az katlı sağlam bina, eşyaları duvara sabitleme, ağaçlandırma, dere yatağından uzak yapı) ve yardım kuruluşları (AFAD, JAK, UMKE, Türk Kızılay, AKUT). *Ana fikir*: Önlem alarak afetlerin zararını azaltabiliriz.
- **KD — İlkbahar Gelince** (Ş, 2 kıta): Doğanın uyanması, çiçeklenen ağaçlar, cıvıldaşan kuşlar.
- Ara metinler: kalemlik yapma yönergesi · bir okul gazetesinde atık lastikleri çiçekliğe çeviren sınıfın haberi · portakal suyu yapma (öğrenci yönerge yazar) · besin broşürü (protein, sebze-meyve, kuruyemiş) ve günlük besin planı · sağlık doğru/yanlış şifresi · atık kutuları (cam, kâğıt, plastik, organik) · afet ve acil durum çantası · iki çalışkan çiftçi metni (benzetmeyle tamamlama).

**(b) Sözlük**: sürpriz (beklenmedik sevindirici şey) · bürünmek (her yanı kaplanmak, sarınmak) · fide (yerine dikilmek üzere yetiştirilen küçük bitki) · atölye (sanatçının ya da ustanın çalıştığı yer) · fesleğen (güzel kokulu süs bitkisi; çeldirici: "dükkân" tanımı) · anı (yaşanıp akılda kalan olay) · atık (kullanıldıktan sonra kalan, atılan şey) · mikrop (hastalık yapan çok küçük canlı) · dayanışma (birbirine destek olma) · yamaç (dağın eğimli yanı) · cömert (paylaşmayı seven) · hayran (çok beğenen). Kitap sonu sözlüğü: ağaçlandırmak, proje, planlı.

**(c) Dil becerileri**
- **Benzetme** (Bilgi Hazinesi s. 101: anlatımı güçlendirmek için iki varlık karşılaştırılır; "gibi, kadar" ile yapılır; benzeyen ve kendisine benzetilen).
  - Örnek ikililer: tüyler **pamuk gibi** yumuşacık · yanaklar **kiraz gibi** kıpkırmızı · **dev gibi** çınar · **anne gibi** sevmek · **karınca gibi** çalışkan · biber **zehir gibi** acı · saçlar **altın gibi** sapsarı · kirazlar **bal gibi** tatlı (benzeyen: kiraz, benzetilen: bal) · para **kar topu gibi** büyüdü.
  - Seçmeli tamamlama: **çöp gibi** atmamalıyız / **ayna gibi** parlattı / **yeni gibi** yaptırdı / **büyülenmiş gibi** izliyordu (çeldirici: dükkân gibi).
  - Boşluk: "Okan ___ gibi çalışkan", "___ gibi hızlı", "___ gibi yavaş" (serbest yanıt).
- **Karışık sözcüklerden cümle kurma** (mevsimler): ilkbaharda ağaçlar çiçek açar · yazın bol meyve yeriz · sonbaharda ağaçlar yapraklarını döker · kış mevsiminde kar yağar.
- **mı/mi/mu/mü soru eki** (Bilgi Hazinesi s. 110): Ek cümleye soru anlamı katar ve **her zaman ayrı** yazılır. Ardından gelen eklerle birleşince (mısın, misin, musun, müsün) kendi içinde bitişik yazılır.
  - Ek eklenince anlamı değişen cümle çiftleri: attı / attı mı · yeterli / yeterli mi · topluyor / topluyor musun.
  - İki seçenekli alıştırma: yapar **mısın**? (müsün) · dikelim **mi**? (misin) · attın **mı**? (musun).
  - KD düzeltmeleri: suladın mı · yapar mısın · içiyor mu.
- **KD noktalama düzeltme** (7 cümle): soru cümlesine soru işareti, düz cümleye nokta, cümle başında büyük harf, yanlış konmuş ünlem ve virgülün düzeltilmesi.
- **Kelime avı (meyveler)**: ERİK, İNCİR, ELMA, AYVA, PORTAKAL, KESTANE, KİRAZ (dikey). Izgarada başka meyveler de olabilir (MUZ, NAR, ARMUT?) **(?)**. Ardından meyveler renklerine göre kutulara ayrılır.
- **Sınıflandırma**:
  - atıklar: cam, kâğıt, plastik, organik;
  - besin grupları: yumurta, peynir, köfte, tavuk, et / domates, salatalık, marul, havuç, mandalina, elma, üzüm, kiraz, erik / fındık, ceviz;
  - afet kavramları (rüzgârla ilgili: fırtına, hortum · dik yamaçta: çığ, toprak kayması · yardım kuruluşu: AFAD, AKUT, UMKE, JAK, Türk Kızılay).
- **Sağlık doğru/yanlış** (12 cümle, doğrular şifre heceleri verir):
  - Doğru: uyku etkilidir · meyve-sebze tüketilmeli · kişisel bakım · spor enerji verir · temiz havada oyun · dişleri düzenli fırçalamak · sağlıklı yiyecekler.
  - Yanlış: spor boşa yorar · yalnız hasta olunca doktora gidilir · çok uyursak sağlıklı oluruz · her öğün aynı yemek · tırnakları her gün kesmek.
- **Afet cümlelerini tamamlama**: az ve sağlam (bina) · uzağa (dere yatağı) · ağaçlandırılmalıdır (yamaç) · fırtınanın (çatı).
- Yönerge yazma (portakal suyu) ve e-posta yazma (Alıcı / Konu / Gönderen alanları).

**(d) Etkinlik türleri**: çağrışım kutuları · el işi yönergesi · kelime avı · renge göre sınıflama · benzetme tamamlama · sözcüklerden cümle kurma · mı/mi seçme · haber metni okuma · atık sınıflandırma · doğru/yanlışla şifre · besin planı · sayı-renk boyama ile gizli sözcük · numarayla tanım eşleştirme · afet çantası eşleştirme · konuşma kontrol listesi.

---

### TEMA 4 — Okuma Serüvenimiz (K1 s. 132–177)
Anahtar kavramlar: bilgi okuryazarlığı, görsel okuryazarlık, kitaplar, okuma alışkanlığı, dil sevgisi, okuma sevgisi.
Ön Değerlendirme: 5 açık soru (kitap okurken ne hissedersin, hangi karakter olmak isterdin, hangi türü seversin, kitap seçerken nelere dikkat edersin, kütüphanede nelere dikkat edersin).

**(a) Metinler**
- **Kelimelerin Masalı** (D): Kitap okumaya vakit bulamayan bir kız, bulduğu harflerle oyun oynarken kelimelerin keşfedilmeyi bekleyen bir hazine olduğunu anlar **(?)**. *Ana fikir*: Kitaplar ve kelimeler dosttur.
- **Kitap Okumayı Seviyorum** (Ö, söyleşi biçimli): Sevgi, en sevdiği yazarın imza gününe gider. Yazar, çocukken bir misafirin unuttuğu macera kitabıyla okumayı sevdiğini ve okudukça kendini daha iyi ifade ettiğini anlatır. Sevgi'ye okumayı bırakmamasını öğütler. *Ana fikir*: Okumak bizi geliştirir, yazar olmanın yolu okumaktan geçer.
- **Cumhurbaşkanlığı Millet Kütüphanesi** (B): Kütüphanelerin herkese açık olduğu, kitapların ücretsiz ödünç alınabildiği, ödev ve araştırma için uygun olduğu anlatılır. Ankara'daki büyük kütüphane tanıtılır. *Ana fikir*: Kütüphaneler bilgiye açılan kapıdır.
- **Kitaptaki Dünya** (Ş, 5 kıta, "Ben bir kitap okudum." nakaratı): Her kitapla çocuk kaptan olur, çölde deveye biner, uzaya uçar, köyde salıncak kurar. *Ana fikir*: Kitaplar bizi her yere götürür.
- **Dil Mirası Koruyucusu** (Ö): Duyduğu her yeni kelimeyi "Kelime Toplayıcısı" defterine yazan bir çocuk, rüyasında kelimelerden yapılmış bir dünya görür ve yazacağı hikâyenin kahramanını tasarlar. *Ana fikir*: Dilimizin kelimelerini öğrenmek ve korumak.
- **KD — Minik Dostum**: Okuduğu kitabın kahramanını merak edip okumaya dalan ve akşam olduğunu fark etmeyen çocuk.
- **Pekiştirelim**: Bahçede köpeğiyle oynarken bir çığlık sesi duyan çocuğun yarım metni (devamı yazılır). Ayrıca soru cümlesi kurma, sandviç yapımını sıralama, neden–sonuç, hata bulma, benzetme tablosu, kısaltma eşleştirme ve zıt anlamlı etiketler.

**(b) Sözlük**: keşfetmek (ilk kez bulmak) · hazine (çok değerli şeyler) · yazar (kitap yazan kişi) · macera (heyecanlı olaylar, serüven) · külliye (bir arada yapılmış binalar topluluğu) · koleksiyon (aynı türden biriktirilmiş şeyler) · kaptan (gemiyi yöneten kişi) · güverte (geminin üstündeki açık alan; çeldirici: "sürücü" tanımı) · seğirmek (kasın istemeden titremesi) · hışırdamak (yaprak ya da poşet gibi ses çıkarmak) · ilham (içe doğan yaratıcı fikir) · minik (küçücük). Kitap sonu sözlüğü: akılalmaz, editör, macera.

**(c) Dil becerileri**
- **Kısaltmalar** (Bilgi Hazinesi s. 148: kurum, kuruluş, ülke, kitap, dergi ve yön adlarında her sözcüğün ilk büyük harfi alınır).
  - Örnekler: TDK (Türk Dil Kurumu) · TBMM · ÇD (Çocuk Dergisi) · KKTC · G (Güney) · MEB · THY · T.C. · TCDD · KD (Kuzeydoğu).
  - KD'de açılım yazdırılan kısaltmalar: TBMM, THY, KKTC.
- **Zıt anlam** (Pekiştirelim s. 177, kitap etiketleri): **eski ↔ yeni**, **ilk ↔ son**, **pahalı ↔ ucuz**, **yumuşak ↔ sert** (çeldiriciler: YANLIŞ, GEÇ, ÖN, KOLAY).
- **Benzetme tablosu** (s. 176, benzeyen ve benzetilen): ülke ↔ cennet · kalp ↔ altın · öğrenci ↔ arı (çalışkan) · millet ↔ aslan (savunma) · insan ↔ melek.
- **Neden ve sonucu ayırma** (s. 174): "Meyveyi yıkamadan yediğim için hasta oldum" cümlesinde neden: yıkamadan yemek, sonuç: hasta olmak. Diğer cümleler: dengeli beslenmek → sağlıklı olmak · diş fırçalamamak → diş çürümesi · spor yapmak → güçlü olmak · erken yatmak → erken uyanmak.
- **Hata türünü seçme** (s. 175): cümle büyük harfle başlamamış / sonuna yanlış işaret konmuş / bayram adı yanlış yazılmış / ülke adları küçük yazılmış / mahalle, kurum ya da il adı yanlış yazılmış.
- **Düz cümleyi soru cümlesine çevirme** (s. 172): Babam bana kitap aldı. → Babam sana ne aldı? / Babam bana kitap aldı mı?
- **Karışık harflerden sözcük** (KD): ecmara → macera · iptak → kitap · iriş → şiir · talpikık → kitaplık · salam → masal · ütpankühe → kütüphane · "işra" (?). Bulunan sözcükler cümlelere yerleştirilir.
- **Sözcük türetme oyunu** (s. 163): Bir önceki sözcüğün son harfiyle (kalem → masa) ya da son hecesiyle (sarı → Rıza) yeni sözcük söylenir.
- **İsim–Şehir oyunu** (s. 139): D örneği (Deniz, Düzce, defter, deve, domates). Oynanacak harfler: H, R, İ, S, B, O.
- **Kütüphane kuralları** (boşluk doldurma): yiyecek-içecek tüketilmemeli · telefon sessize alınmalı · yüksek sesle konuşulmamalı · kitaplar zamanında teslim edilmeli · eşyalara zarar verilmemeli · kitaplar izinsiz dışarı çıkarılmamalı.
- **Görsel–cümle eşleştirme**, kitap kapağı okuma, kitap künyesi (ad, yazar, sayfa sayısı, konu).
- **Kontrol listeleri**: okuma (oturuş, göz mesafesi, hecelemeden, satır atlamadan, uygun hızda, noktalamaya dikkat), yazma (doğru yazım, sözcükler arası boşluk, büyük harf), okuma ortamı (sessiz, ısı, aydınlık).
- Sözcük bankasıyla cümle tamamlama: macera, gözlüğünü, kütüphaneye, Zehra, şiir, kitabımı, kitaplarda.

**(d) Etkinlik türleri**: eksik harf tamamlama · sözcüklerden metin yazma · harf oyunu tasarlama · İsim–Şehir · etkinlik önerisi yazma · kitap kapağı tasarlama · görsel–cümle eşleştirme · kısaltma yazma · kütüphane üye kartı · kural tamamlama · yarım metin · kitap künyesi · sessiz sinema · doğru cevabı takip eden yol (cevaplar bir mesleğe çıkar) · karışık harf · soru cümlesi kurma · neden–sonuç tablosu · hata işaretleme · benzetme tablosu · kısaltma eşleştirme · zıt anlam etiketleri.

---

### TEMA 5 — Yeteneklerimizi Tanıyoruz (K2 s. 16–55)
Anahtar kavramlar: geleneksel sanatlar, yetenek, çocuk kültürü, hayal, dijital oyunlar, eğlence.
Ön Değerlendirme: "çocuk" ve "eğlence" sözcükleri için çağrışım haritası hazırlanır, ardından bir hayal ya da yetenek beden diliyle anlatılır.

**(a) Metinler**
- **Unutulan Oyunlar** (D): Mete'nin yeni oyuncağı dedesini şaşırtır. Dedesi çocukken oynadığı geleneksel oyunları anlatır, Mete de ona bir söz verir **(?)**. *Ana fikir*: Geçmişin oyunlarını tanımak ve yaşatmak.
- **Türkülerin Babası Neşet Ertaş** (B, biyografi): Kırşehir'de doğan halk ozanının müziğe saz çalan babasını dinleyerek başladığı, ilk sazının annesinin çamaşır tokacından yaptırdığı oyuncak saz olduğu anlatılır. *Ana fikir*: Yetenek küçük yaşta emekle gelişir.
- **Şu Oyuna Bak! İşte Şapalak!** (B, oyun yönergesi): Kırgız çocuklarının oyunu Şapalak'ın kuralları sıralanır. Ebe tekerlemeyle seçilir, sırtını döner, avucuna kimin dokunduğunu tahmin etmeye çalışır. *Ana fikir*: Dikkat ve hız isteyen bir geleneksel oyun.
- **Lokum, Oyun ve Oyuncak Müzesinde** (B, gezi yazısı): Lokum adlı çocuk Gaziantep'teki oyuncak müzesini gezer. Babası çocukluğunu hatırlayıp duygulanır, Lokum da bir masal atölyesine katılır. *Ana fikir*: Oyuncaklar geçmişle bugünü birleştirir.
- **Meslekler** (Ş, 4 kıta): Mesleklerin insan sayısı kadar çok olduğu, emeğe saygı ve birlik vurgulanır. *Ana fikir*: Her meslek değerlidir, emeğe saygı duyulur.
- **KD — Sanat Çalışmaları**: Sanat atölyesinde çocuklar boya, kâğıt ve kille farklı ürünler (ev, kuş, çiçek tarlası, gitar) yapar.
- Ara metinler: Dokuztaş oyununun yönergesi · lastik tokalı müzik aleti yapımı · keman yarışmasını azimle kazanan çocuk (tebrik kartı yazılır) · oyun adları bulmacası · bez bebek tanıtım kartı · röportaj oyunu · 4 meslek bilmecesi (öğretmen, mimar, veteriner, bahçıvan/çiftçi).

**(b) Sözlük**: maket (bir şeyin küçük modeli) · hayal (zihinde canlandırılan şey) · tokaç (çamaşırı döverek yıkamaya yarayan tahta) · efsane (dilden dile anlatılan olağanüstü hikâye; mecaz anlamı: "efsane futbolcu") · hamle (ileri atılış, oyunda bir hareket) · konsantrasyon (dikkati toplama) · müze (eski ve değerli eşyaların sergilendiği yer) · ilham · özen (dikkat ve titizlik) · **"Birlikten kuvvet doğar"** (birlikte olunca güçlü oluruz; kitapta "sözcük grubu" diye geçiyor, aslında atasözü) · kil (biçim verilebilen toprak) · tasarlamak (zihinde kurmak, planlamak). Kitap sonu sözlüğü: avuç, efsane, ozan, röportaj, tavsiye, yöre, deneyim.

**(c) Dil becerileri**
- **Kesme işareti (')** (s. 43): Özel adlara gelen ekleri ayırır. Örnekler: Gaziantep'i · Türkiye'de · Ada'nın · "[sporcu adı]'nın başarısı". 1. kitapta da kullanılır: Ankara'ya, Çanakkale'ye, Kıbrıs'a, Mardin'i.
- **Kısa çizgi (-)** (s. 43): Satır sonuna sığmayan sözcük heceden bölünür. Örnekler: yolcu-luk · takım-daki · Mü-zesini · ya-kın.
- **Mektup ve tebrik kartı**: hitap (Sevgili …,), giriş (Merhaba), tarih, imza ve kapanış.
- **Konuşma planı** formu: tarih, konuşmacı, konu, dinleyiciler, süre, anahtar sözcükler.
- **Benzer ve farklı** (Neşet Ertaş ile babası): saz çalmak ve müzikle ilgilenmek ikisinde de var; oyuncak saz ve "Türkülerin Babası" adı yalnızca Neşet Ertaş'a ait **(?)**.
- **Olay sıralama** (dinleme metninin görselleri, 3 olay).
- **Tekerleme ve sayışmaca**: ebe seçme tekerlemesinin dizelerini kendi sözleriyle tamamlama; "evi yıkalım mı onaralım mı" türü dil dolandırıcı tekerleme (sözleri kitaptan alınmamalı).
- **Eksik dize tamamlama** (Meslekler).
- **Oyun adlarını bulmacaya yerleştirme**: İP ATLAMA, MENDİL SAKLAMA, SAKLAMBAÇ, BEŞTAŞ, KÖREBE, YEDİ TAŞ (ayrıca metinlerde DOKUZTAŞ, ŞAPALAK).
- **Bilgi tamamlama** (sözcük bankası): ozan, meşhur, babasını, Türkülerin Babası, halk.
- KD: konu yazma, 2 sözcüğün anlamı, çocukların ürünlerini eşleştirme (Nuray → kırmızı ev, Ali → mavi ev, Emre → yeşil ev, Can → kilden kuş, Merve → çiçek tarlası, Murat → gitar), benzerlik ve farklılık.
- Zıt anlam, benzetme ve mı/mi bu temada kural olarak yok. mı/mi yalnızca Hatırlayalım'da tekrar edilir: yardım edebilir **miyim** · tanıyor **musun** · beğendin **mi** · aldın **mı** · okudun **mu**.

**(d) Etkinlik türleri**: oyun yönergesi uygulama · el işi · çağrışım · görsel sıralama · mektup ve tebrik kartı · konuşma planı · canlandırma · benzer/farklı boyama · bulmaca · tekerleme tamamlama · oyun tasarlama formu · sanal müze · müze tasarlama · tanıtım kartı · röportaj · bilmece.

---

### TEMA 6 — Mucit Çocuk (K2 s. 56–93)
Anahtar kavramlar: araştırma, merak, bilim, sorgulama, kâşif, teknoloji, keşif, yapay zekâ.
Ön Değerlendirme: 4×4 harf ızgarasında komşu karelerden sözcük oluşturulur (**araştırma, robot, zekâ** çıkıyor), sonra kısa metin yazılır.

**(a) Metinler**
- **ASLAN-TEKNOFEST** (İz, çizgi film): Takımlar insansız hava aracı yarışmasına katılır. Kırmızı takımın aracı batarya takılmadığı için başta çalışmaz, ama sonunda yarışı kazanırlar. Rakip takım onları tebrik eder **(?)**. *Ana fikir*: Dikkat, takım çalışması ve centilmenlik.
- **Çok Merak, Çok Eğlence** (Ö): Evin her sese ve kokuya meraklı kedisi ile durmadan soru soran küçük kız kardeş anlatılır. Ağabey bilmediği soruların cevabını kardeşiyle kitaplarda ve internette birlikte arar. *Ana fikir*: Merak öğrenmenin başlangıcıdır, sorular birlikte araştırılır.
- **Meraklı, Cesur ve Maceracı Alper Gezeravcı** (B, biyografi): Türkiye'nin ilk astronotu küçükken yıldızları hayal etmiş, fen ve matematiğe çok çalışmış, sonra pilot olmuştur. Astronotluk cesaret, zekâ ve ekip çalışması ister. *Ana fikir*: Hayallere çalışarak ulaşılır.
- **Bilgi Çağı** (Ş): Uydular ve internet uzağı yakın eder. Bilgiyi doğru seçmeli ve bilim insanlarına teşekkür etmeliyiz. *Ana fikir*: Teknoloji bilgiye ulaştırır ama doğru bilgiyi seçmek gerekir.
- **Neler Oluyor?** (Ö): Yiğit bir sabah annesinin yerine ekranlı bir robotun kahvaltı hazırladığını, servisi şoförsüz bir aracın sürdüğünü ve öğretmenin yalnızca ekranda olduğunu görür. Üzülür, uyandığında hepsinin rüya olduğunu anlar ve annesine sarılır. *Ana fikir*: Teknoloji ne kadar gelişse de insan sıcaklığının yerini tutmaz.
- **KD — Mucit Çocuklar** (yarım): İki kardeş, bahçeyi sulamakta yorulan annelerine yardım etmek için hortumla bir icat düşünür. Metnin devamını öğrenci yazar.
- Ara metinler: kâğıttan kayık yapımı · merak sorularından oluşan "Aklımdakiler" şarkısı · ipucu şiirlerden şehir bulma (Rize, Adana, Şanlıurfa, Eskişehir, Konya) · TEKNOFEST mantık tablosu · geçmişte ve günümüzde kullanılan ulaşım ve iletişim araçları · robot tasarlama formu.

**(b) Sözlük**: insansız hava aracı (uzaktan yönetilen uçan araç) · batarya (pil grubu) · atölye (üretim ve uygulama yeri; çeldirici: pilot tanımı) · begonya (bir süs çiçeği) · hortum (hem şiddetli dönen rüzgâr hem su borusu, bkz. eş sesli notu) · astronot (uzaya giden kişi) · gezegen (Güneş'in çevresinde dolanan gök cismi) · uzay (gök cisimlerinin bulunduğu sonsuz boşluk) · uydu (yerden fırlatılıp gökte dolaşan araç) · bilim adamı (bilimle uğraşan kişi; **oyunda "bilim insanı" demeyi öneriyorum**) · robot (insanın işini yapan makine) · ekran (görüntünün çıktığı yüzey) · mucit (yeni bir şey bulan kişi) · icat (yeni bulunan şey). Kitap sonu sözlüğü: evren, deneyim, donanım, uygarlık.

**(c) Dil becerileri**
- **Zıt anlam** (s. 71): **küçük ↔ büyük**, **soru ↔ cevap**, **ön ↔ arka**, **az ↔ çok**. Bu çiftlerle "merak" konulu bir hikâye kurgulanır.
- **Bağlama öğeleri** (T.K.2.3.f: ile, ve, ama, çünkü): Metin şu cümle başlangıçlarıyla anlattırılır: "Yiğit biraz şaşırdı **ve** …", "Yiğit, arkadaşları **ile** …", "'Okul değişmemiş.' dedi **ama** …", "Koşarak annesine sarıldı **çünkü** …".
- **Benzetme** (metin içinde, kural verilmez): "tıpkı bir füze gibi" · "sağanak bir yağmur gibi (sorular)" · "bilim adamı gibi meraklı".
- **Hece birleştirme** (s. 84): Şekil ve ok yönünde ilerlenerek heceler birleştirilir. Örnek sözcük **meraklı**. Hece havuzu: ka-rak-hi-me-lı-se-tır-ma-ye-ret-pa-Ta-cı-a-raş-rar-ak-ka-lı-me-dö. Aday sözcükler: araştırmacı, karar, cesaret, maceracı (?).
- **Sembolden hece şifresi** (KD): şin · cit · pe · cat · mu · i · ler · de → **mucit**, **icat**, **peşinde** (?). Bu sözcüklerle slogan yazılır.
- **Söz–sahne eşleştirme** (izleme): "Pilot kalkış için hazır!", "Eyvah, bataryayı takmayı unutmuşuz!", "Ustaca yarıştınız, tebrik ederim." gibi konuşma balonları sahnelerle eşleştirilir.
- **Mantık tablosu**: 3 takım (siyah, kırmızı, mavi), 3 yarışma (İHA, robot, roket) ve sıralama, 5 ipucuyla çözülür.
- **Sınıflandırma**: ulaşım ve iletişim araçları "geçmişte / günümüzde" diye ayrılır.
- **Benzer ve farklı**: Alper Gezeravcı ile kendim; robot ile insan.
- **Şiirde eksik sözcük** (Bilgi Çağı): iletişim, uydular, rehber, bilgiyi, uygarlık.
- **Sözcük bankasıyla tamamlama**: merak, Alper Gezeravcı, bilim, uzay, matematik, yıldızların, ödevini.

**(d) Etkinlik türleri**: el işi yönergesi · harf ızgarası · izleme ve sahne eşleştirme · yarışma alanı seçme · mantık tablosu · şarkı · zıt anlamla hikâye kurma · şehir bilmecesi · geçmiş/günümüz sınıflama · hece yolu · robot tasarlama · bağlaçlı anlatım · benzer/farklı · yarım metin · sembol şifresi · slogan.

---

### TEMA 7 — Kültür Hazinemiz (K2 s. 94–133)
Anahtar kavramlar: tarihî mekânlar, Türkçe, bayrak, vatan, kültürel miras, yurdumuz, millî ve dinî bayramlar, millî ve manevi değerler.
Ön Değerlendirme: Kültür çarkı çevrilir ve gelen başlık hakkında 3 cümle yazılır. Çarktaki başlıklar: tarihî mekânlar, misafirperverlik, millî bayramlar, halk müziği, bayramlar, geleneksel yemekler, halk oyunları, el sanatları.

**(a) Metinler**
- **Nasreddin Hoca** (D): Hoca'nın kim olduğu, Akşehir'de yaşadığının tahmin edildiği, adına düzenlenen şenlik ve "Ya Tutarsa" fıkrası anlatılır. Fıkrada Hoca göle maya çalar. *Ana fikir*: Umudu kaybetmemek, denemekten vazgeçmemek. (Fıkrayı uygulamada **kendi sözlerimizle ve kısaca** anlatmalıyız; fıkra halk malıdır ama kitaptaki metin aktarılmamalı.)
- **23 Nisan Ulusal Egemenlik ve Çocuk Bayramı** (B): TBMM'nin açılışı, egemenliğin millete geçmesi, bayramın dünya çocuklarına armağan edilmesi ve Türkiye'nin bu bayramı kutlayan ilk ve tek ülke olması anlatılır. *Ana fikir*: 23 Nisan millî egemenliğin ve çocukların bayramıdır.
- **Anadolu** (Ş, kısaltılmış, "Gezsen Anadolu'yu!" nakaratı): Anadolu'nun berrak ırmakları, serin yelleri ve her mevsimi ayrı güzel diyarı. *Ana fikir*: Yurdumuzun güzelliği.
- **Bayrak Töreni** (Ö): Canan İstiklâl Marşı'nı sınıfta öyle güzel okur ki arkadaşları törende onun okumasını ister. Öğretmen marşın bağımsızlığın ve birliğin göstergesi olduğunu anlatır. *Ana fikir*: Millî marşa ve bayrağa saygı.
- **Bir Bayram Sürprizi** (Ö): Kurban Bayramı'nda dede evinde toplanan geniş aile anlatılır. Meraklı çocuk, bir şeyler hazırlayan teyzesini gözünden kaçırmaz. Sabah çocukların yastıkları altından işlemeli mendile sarılı şeker ve harçlık çıkar. *Ana fikir*: Bayram gelenekleri aileyi birleştirir.
- **KD — Bayram Sevinci** (Ş): Ramazan Bayramı'nın getirdiği neşe, bayramlıklar, ziyaretler ve bereketli sofralar.
- **İstiklâl Marşı ilk 4 kıta** (s. 121–122): Okunur, ezberlenir ve bakmadan yazılır (programdaki kural: 2. sınıfta ilk dört kıta).
- Ara metinler: Ayasofya, Karagöz-Hacivat, halk oyunları ve mantı görselleri · harf şifresi (23 Nisan) · tabloyla anahtar sözcük bulma (**ANADOLU**) · Kapadokya gezi afişi ve "afiş nasıl hazırlanır" yönergesi · haritada vatanla ilgili sözcükleri yuvarlak içine alma (zafer, millî marş, şehit, bayrak töreni, saygı duruşu, sevgi; çeldiriciler: sabır, çevre, dost, uzay).

**(b) Sözlük**: çanak (topraktan yapılmış çukur kap) · kadı (eski dönemde yargıç) · bilge (bilgili ve olgun kişi; bu tanım eşleştirmede verilmiş) · stadyum (spor karşılaşmalarının yapıldığı alan; çeldirici: toplantı salonu) · egemenlik (yönetme gücünün sahibi olmak) · billur (çok berrak, saydam) · şaheser (çok güzel eser, başyapıt) · bağımsız (kimseye bağlı olmayan, özgür) · dize · kürsü (konuşma yapılan yüksekçe yer) · **göz hapsine almak** (gözünü üzerinden ayırmamak; çeldirici: çok acıkmak) · **gözlerini fal taşı gibi açmak** (şaşkınlıkla bakmak; çeldirici: çok sevinmek) · ziyaret · bereket (bolluk). Kitap sonu sözlüğü: diyar, kültür, ilan etmek, bizzat, rivayet, görüş, gösterge, zafer.

**(c) Dil becerileri**
- **Sözlük (alfabe) sırası** (s. 100): şenlik, bilge, tiyatro, fıkra, göl → **bilge, fıkra, göl, şenlik, tiyatro**.
- **Benzetme** (s. 113, 131):
  - Örnekler: güneş **altın gibi** parlıyordu · **arı gibi** çalışmak · deniz **çarşaf gibi** dümdüz · **billur gibi** ırmaklar · su **buz gibi**.
  - Bayram cümleleri: sarmalar **kalem gibi** ince · evi **gelin gibi** süsledik · ninemizin **pamuk gibi** elleri · baklava **nar gibi** kızardı · gözler **fal taşı gibi** açıldı.
  - Görev: bir yeri ya da bayram anısını benzetmeyle anlatmak (T.K.2.2.g).
- **Deyimler** (kitapta "sözcük grubu" diye geçer, deyim terimi verilmez): göz hapsine almak, gözlerini fal taşı gibi açmak. Metinlerde geçen öteki deyimler: ipucu yakalamak, peşine takılmak, dilden dile aktarmak.
- **Görüşe katılma** (T.K.2.2.f / T.Y.2.2.h): "Ya tutarsa?" düşüncesine katılıp katılmadığını gerekçesiyle söyleme, ardından şairin "bayram neşe getirir" düşüncesine katılma.
- **Sınıflandırma**: dinî bayramla ilgili cümleleri seçme. 10 cümle verilir; konu dışı olanlar fidan dikme, bisiklet tamiri ve Cumhuriyet Bayramı'nda şiir okuma.
- **Konu bulma (eksik harfli seçenekler)**: K_t_p S_vg_s_ / B_yr_m_n G_l_ş_ / T_t_l An_l_r_ → **Bayramın Gelişi**.
- **Yönerge yazma** (T.Y.2.2.ğ): yoğurt mayalama aşamaları ve gezi afişi hazırlama adımları.
- **Şiire sözcük yerleştirme**: yel, şaheser, diyar, Anadolu (çeldirici: deniz).
- **D/Y (okuma kuralları)**: Okurken noktalamaya dikkat edilir (D). Anlamak için yavaş okunmalıdır (Y, uygun hızda okunur) (?). Sesli okuma anlaşılır ses düzeyinde yapılır (D).
- **Metin içinde tamamlama**: bayrağımız, millet, sevgimiz, atalarımızı.
- Büyük harf ve kesme kullanımı (yeni kural verilmez): İstiklâl Marşı'nı, Kurban Bayramı, Ramazan Bayramı, TBMM, Akşehir.

**(d) Etkinlik türleri**: çark · görsel tartışma · sözlük sırası · görüş bildirme · yönerge yazma · şifre çözme · tablo şifresi · okuma kontrol listesi · bir kıtalık şiir yazma · benzetmeli anlatım · afiş · harita üzerinde sözcük seçme · marşı ezberleme ve bakmadan yazma · deyim anlamı eşleştirme · çiçek boyamalı sınıflama · doğru/yanlış.

---

### TEMA 8 — Haklarımızı Biliyoruz (K2 s. 134–179)
Anahtar kavramlar: kapak metni bozuk; hak, özgürlük, sorumluluk, çocuk hakları, eşitlik ve demokrasi kavramları okunabiliyor **(?)**.
Ön Değerlendirme: 4 açık soru (oyun bir hak mı, hakkı yenen arkadaşa nasıl yardım ederiz, eğitim hakkı neden önemli, kendimizi güvende hissetmediğimizde ne yaparız).

**(a) Metinler**
- **Çocuklar Haklarıyla Var** (İz): Kime çocuk denir ve temel çocuk hakları nelerdir, anlatılır: yaşama (en temel hak), sağlık hizmetlerine erişim, eğitim, bizi ilgilendiren konularda görüş açıklama, oyun **(?)**. *Ana fikir*: Her çocuğun hakları vardır.
- **Bir Dünya Bırakın** (Ş, 4 kıta, "El ele el ele verin çocuklar" nakaratı): Çocuklar büyüklerden gözyaşı olmayan bir vatan, uçurtmalar için bir gökyüzü, barış ve sevgiyle dolu bir dünya ister. *Ana fikir*: Barış içinde bir dünya çocukların hakkıdır.
- **Mırnav Dostları** (Ö): Mahalledeki çocuklar sokak kedilerini düzenli besler, yavru ve hasta kedileri muhtarlığın bahçesine götürür. Hasta bir kedi için veterinerden yardım alırlar, kediyi sonunda bir hemşire sahiplenir. Muhtar onlara "Mırnav Dostları" lakabını takar. *Ana fikir*: Merhamet ve hayvan hakları.
- **Kararla Gelen Başarı** (Ö): Özgüç sınıf başkanı seçilir ama görevin zorluğundan sıkılıp bırakmak ister. Öğretmeninin sorumluluk ve güven üzerine konuşması onu vazgeçirir, görevini en iyi şekilde yapar. *Ana fikir*: Üstlenilen görev yarıda bırakılmaz.
- **Yaz Tatilini Nasıl Değerlendirelim?** (B): Tatil programı yapmak, eksik konuları tamamlamak, her gün okumak, ev işlerine, bitki ve hayvan bakımına yardım etmek, düzenli uyku ve öğün. *Ana fikir*: Planlı ve verimli tatil.
- **KD — Çocuk Hakları Durağı**: Duygu ve arkadaşları belediyeye öneri gönderir ve mahallelerine çocuk haklarını anlatan bir durak yaptırır. Mahalle örnek olur.
- Ara metinler: Salıncağı paylaşmayan arkadaş (incitmeden yazılı uyarı yazılır, Kimden/Kime/Konu) · mama kabı yapımı · sınıf başkanlığı seçim afişi · "Sorumluluklarım" listesi · evde görevlerini yapmayan iki kardeş (konuşma) · yaz etkinlik listesi.
- **Pekiştirelim**: Eksik sözcüklü ve noktalamasız mektup · hikâye yazma için 3 durum · yakantop oyunu metni (olay sırası) · iki çocuğun özellik tablosu (benzer/farklı) · canlı/cansız ve gerçek/oyuncak taşıt sınıflaması · okul müdürüne öneri mektubu.

**(b) Sözlük**: sözleşme (tarafların uymayı kabul ettiği yazılı anlaşma) · vatan · barış (kavga ya da savaş olmaması; "barışmak" anlamı da var) · enfeksiyon (mikrop kapması) · muhtar (mahalle ya da köyün seçilmiş yöneticisi) · başkanlık (başkan olma görevi) · emek (bir iş için harcanan çaba) · dönem (belli bir süre, yarıyıl) · program (önceden yapılan plan) · hak (bir kimseye ait olan, ona tanınan şey) · proje (yapılması planlanan iş). Kitap sonu sözlüğü: artık, lakap, tayfa, slogan, materyal, ciddiye almak, görüş, seslenmek.

**(c) Dil becerileri**
- **Canlı / cansız sınıflaması** (izleme metnindeki varlıklar ve görseller) ile **gerçek taşıt / oyuncak taşıt** ayrımı.
- **İleti türleri ve biçimleri**: mektup (Sevgili …, / Saygılarımla, / Hoşça kal / tarih-imza), e-posta (Gönderen / Konu / Sayın Yetkililer,), anlık ileti (Kimden / Kime / Konu), seçim sloganı, seçim konuşması, yazma planı (tarih, yazan, konu, kime).
- **Karma noktalama** (Ayşe'nin mektubu): hitaptan sonra virgül · Nasılsın? · iyi misin? · özel ada gelen ekte kesme (Miray'ı) · satır sonunda kısa çizgi (tatilin-de) · nokta · "Hoşça kal." Sözcük bankası: canım, iyi, son, ellerinden, selamı, görüşmek, hoşça, seven.
- **Olay sıralama** (yakantop: heyecan → kuralların hatırlatılması → oyun → bir arkadaşın düşmesi → beraberlik → yarına erteleme).
- **Benzer ve farklı**: iki çocuğun özellikleri (ikisi de 8 yaşında ve çok kitap okuyor; spor, yetenek ve mizaçları farklı).
- **Sorumluluk ve neden–sonuç**: sorumluluklar yerine getirilmezse neler olur.
- **Konu seçme**: metnin konusunu gösteren görseli işaretleme.
- **Okuma ortamı**: uygun ortamı görselden seçme (T.O.2.4.a).
- Bu temada yeni bir dil bilgisi kuralı yoktur, önceki kurallar tekrar edilir.

**(d) Etkinlik türleri**: şarkı · izleme · kontrol listesi · tamamlama · canlı/cansız tablosu · incitmeden uyarı yazısı · resim · okuma ortamı seçme · mama kabı yapma · çözüm önerisi yazma · yazma planı · seçim afişi okuma · slogan ve seçim konuşması · sorumluluk listesi · tatil planı · etkinlik seçme · mektup ve e-posta · karma noktalama · olay sıralama · benzer/farklı tablosu · sınıflama.

---

## 3. Sınıf düzeyi sınırları (2. sınıf)

**Metin uzunluğu (kitaptan ölçüldü)**
- Okuma metinleri **160–270 sözcük** (Güvercin Tini ~160, Minik Ali ~165, Nihan'ın Kardeşi ~200, Kararla Gelen Başarı ~205, Neler Oluyor? ~230, Sıfır Atık Günlüğü ~245, Horozun Sorumluluğu ~265). Uzun metinler kısaltılmıştır, çıkarılan yerler "(...)" ile gösterilir.
- Kendimizi Değerlendirelim metinleri **70–120 sözcük** (İki Kardeş ~73, Minik Dostum ~70, Sanat Çalışmaları ~106, Çocuk Hakları Durağı ~121).
- Ara ve alıştırma metinleri **3–8 cümle**.
- Şiirler 2–5 kıta. Kıtalar 4 dizelik, dizeler 2–4 sözcüklük.
- **Oyun için hedef**: soru metni 1 cümle; okuma parçası 3–6 cümle (40–80 sözcük); uzun okuma (tema sonu) en fazla 120 sözcük.

**Cümle uzunluğu**: KD metinlerinde ortalama **5–6 sözcük** (İki Kardeş ≈ 5,6), hikâyelerde **8–10 sözcük** (Kararla Gelen Başarı ≈ 9,5). Konuşma çizgisi yerine tırnaklı konuşma kullanılır. **Oyun için**: cümle başına en fazla 10–12 sözcük, seçenekler 1–4 sözcük, balon ve kart etiketleri en fazla 2 sözcük.

**Sayılar**: Yıllar her zaman yazıyla da veriliyor ("1923 (bin dokuz yüz yirmi üç)"), çünkü 2. sınıf 1000'den büyük sayıları okumuyor. Oyunda da yıl kullanırsak okunuşunu yanına yazalım ya da yıl hiç vermeyelim. Gün ve ay (29 Ekim, 23 Nisan) serbest.

**Kitapta ve programda OLAN dil konuları (2. sınıf)**
- Noktalama: nokta (cümle sonu, sıra sayısı, tarih, saat), virgül (hitap, eş görevli sözcükler), soru işareti, ünlem (hitap, duygu, uyarı), tırnak işareti (aktarılan söz), iki nokta (örnek, açıklama, tanım), kesme (özel ada gelen ek), kısa çizgi (satır sonu). Yay ayraç "( )" yalnızca alıştırma kutusu olarak kullanılır. Programda adı geçen **konuşma çizgisi, üç nokta ve eğik çizgi** için kural öğretilmez (üç nokta yalnızca "(...)" kısaltma işareti olarak geçer).
- Büyük harf: cümle ve dize başı; kişi, hayvan, yer (il, ilçe, mahalle, sokak), ülke, dil, kurum, bayram/özel gün, kitap/dergi/eser adları; unvanlar (Kaymakam, Sayın) (?).
- **mı/mi soru eki ayrı yazılır** (mısın/misin kendi içinde bitişik).
- **Kısaltmalar** (TBMM, TDK, MEB, THY, KKTC, T.C., TCDD; yön: G, KD).
- **Zıt anlamlı sözcükler** (programda T.O.2.2.f ve T.K.2.2.d).
- **Benzetme** ("gibi, kadar"; benzeyen ve benzetilen).
- **Neden–sonuç** cümleleri ("… için", "çünkü").
- **Bağlama öğeleri**: ile, ve, ama, çünkü (T.K.2.3.f).
- Hece: hecelere ayırma, hece sayısı, sesli ve sessiz harf ayırma (Hatırlayalım), satır sonunda heceden bölme.
- Sözlük (alfabe) sırası; bağlamdan anlam tahmini; sözlükte anlam arama.
- Olay sırası, konu bulma, karakter ve olay, benzer/farklı, sınıflandırma, görüşe katılma, görsel okuma (tablo, broşür, afiş).
- Metin türü adları: bilgilendirici, öyküleyici, şiir. Şiir terimleri: şair, dize/mısra, kıta/dörtlük.
- Yazı türleri: mektup, tebrik kartı, davetiye, günlük, e-posta, anlık ileti, yönerge, afiş, slogan, form.

**Kitapta ve programda OLMAYAN konular (2. sınıfta kullanma ya da yalnızca örtük kullan)**
- **Eş anlamlı sözcük**: Kitapta "eş anlam" geçmiyor. Program bunu **3. sınıfta** veriyor (T.K.3.x "eş anlamlı sözcükleri kullanır", T.O.3.x "zıt ve eş anlamlı sözcükleri bulur"). Oyunda 2. sınıf için eş anlam sorusu **sorma**. En fazla "aynı anlama gelen sözcük" diye örtük ipucu ver. Sözlükten çıkan doğal çiftler 3. sınıfa saklanabilir: macera = serüven, ozan = şair, mektep = okul, vatan = yurt, diyar = ülke, dize = mısra, kıta = dörtlük, yanıt = cevap, nazik = kibar, sancak = bayrak, deneyim = tecrübe, bizzat = şahsen, efsane = söylence, akılalmaz = inanılmaz.
- **Eş sesli (sesteş) sözcük**: Program bunu **4. sınıfta** veriyor. Kitapta terim yok, ama hortum (rüzgâr / bahçe hortumu / filin hortumu), yaz (mevsim / yazmak), yüz (sayı / yüz), gül (çiçek / gülmek) gibi örnekler doğal olarak geçiyor. 2. sınıfta **soru olarak verme**.
- **Atasözü ve deyim terimleri**: Atasözü 3. sınıfta, deyim 4. sınıfta öğretiliyor. 2. sınıfta yalnızca "sözcük grubunun anlamı" olarak, en fazla 2 seçenekli eşleştirme yapılabilir (göz hapsine almak, gözlerini fal taşı gibi açmak, Birlikten kuvvet doğar).
- **Ana fikir / ana düşünce** terimi yok. Kitap yalnızca "metnin konusu"nu soruyor. Oyunda "Bu metin en çok neyi anlatıyor?" diye sor.
- **Başlık bulma**: Ayrı bir etkinlik olarak yok. Yalnızca "Yazımıza başlık koymayı unutmayalım" yönergesi ve eksik harfli başlık seçme (T7 KD) var. Oyunda "en uygun başlık" seçmeli sorusu konu bulmanın bir çeşidi olarak kullanılabilir.
- **5N1K** terimi yok. Kim/ne/nerede/neden/nasıl soruları açık uçlu sorularda doğal olarak geçiyor ve kullanılabilir, ama terimi verme.
- **-de/-da bağlacı ve -ki yazımı**: Kitapta yok, programda 2. sınıfta yok. Oyunda kullanma.
- **Sözcük türleri** (isim, sıfat, fiil, zamir): Yok. Canlı/cansız ve gerçek/oyuncak sınıflaması var.
- **Cümle türleri** (olumlu/olumsuz, kurallı/devrik): Terim olarak yok. Kitap yalnızca soru cümlesi, ünlem cümlesi ve neden–sonuç cümlesini işliyor. "Anlamlı ve kurallı cümle" ifadesi konuşma kuralı olarak geçiyor.
- **Harf ve ses bilgisi**: Sesli/sessiz harf ayrımı yalnızca Hatırlayalım'da tekrar ediliyor. Ünlü uyumu, ses olayları yok.

---

## 4. Oyunlaştırma önerileri

Mekanik kodları: **choice** (3–4 seçenek) · **sort** (2–3 sepet) · **match** (çiftler) · **order** (sıralama) · **truefalse** · **memory** (kart çifti) · **pop** (doğru balonları patlat) · **search** (kelime avı ızgarası) · **input** (sözcük yaz).
Genel kural: Soru metni TTS ile okunur. Seçenekler kısa olur. 2. sınıfın klavye kullanımı zayıf olduğu için **input** yalnızca 3–8 harflik tek sözcüklerde ve harf havuzu klavyesiyle kullanılır.

### Tema 1 — Değerlerimizle Varız
1. **choice** — Nezaket mi değil mi? "Arkadaşın selam verdi. Ne yaparsın?" → selamını alırım / duymazdan gelirim / bağırırım.
2. **sort** (2 sepet: "Nazik davranış" / "Kaba davranış") — sırada beklemek, söz kesmek, özür dilemek, izinsiz eşya almak, teşekkür etmek, bağırmak.
3. **order** (4 kart) — İyilik zinciri: Biri iyilik yapar → İyilik gören sevinir → O da başkasına iyilik yapar → Dünya güzelleşir.
4. **pop** — "Virgül nereye?" Cümle sözcüklere bölünüp balonlara yazılır ("Sevgili Çocuklar_ hoş geldiniz"), virgülün gelmesi gereken aralık patlatılır. Varyant: eş görevli sözcükler (elma_ armut ve muz).
5. **choice** — Nokta kuralı: "Ben 2_ sınıftayım." "Saat 10_30." → nokta / virgül / soru işareti.
6. **match** — Kavram ve tanım: azim, saygı, nezaket, sorumluluk, sevgi ↔ kısa, çocuk dostu tanımlar.
7. **truefalse** — Hikâyeden doğru/yanlış: "Horoz fırtına çıkınca görevini bıraktı." (Y).
8. **sort** (3 sepet: İnsanlara / Hayvanlara / Bitkilere iyilik) — yaşlı komşuya yardım, kuşlara su, çiçek sulamak, kediyi veterinere götürmek, arkadaşla beslenme paylaşmak, fidan dikmek.
9. **memory** — Söz ve konuşan: tırnak içindeki söz kartı ile konuşan hayvan kartı (Fındık'ın kendi hayvan dostlarıyla, özgün sözlerle).
10. **input** — Hece tablosu: "papatya kaç hece?" → 3 (sayı tuşu). Varyant: heceye göre başlangıç ("çi__" → çilek).
11. **choice** — Neden–sonuç: "Ali okula geç kaldı, çünkü…" → geç yattı / kahvaltı etti / çantasını hazırladı.
12. **order** — Şiir dizelerini sıralama (bizim yazdığımız 4 dizelik bir kıtayla).

**Tema sonu oyunları**
- **"Nezaket Köprüsü"**: Fındık bir köprüden geçer. Her tahta bir **choice** ya da **truefalse** nezaket sorusudur. Yanlış cevapta köprü yıkılmaz, tahta sallanır ve ipucu verilir. Sonunda nokta/virgül "anahtar"ı **pop** ile toplanır.
- **"İyilik Zinciri"**: Halkaları sıralayıp birleştiren **order** turları. Her turda 4 olay kartı vardır, zincir uzadıkça ekrandaki çiçekler açar.

**Özgün okuma parçaları**
> **Paylaşılan Şemsiye**
> Okul çıkışında birden yağmur başladı. Ece'nin şemsiyesi vardı ama arkadaşı Kaan'ın yoktu. Ece, "Gel, ikimiz de sığarız." dedi. İki arkadaş yan yana yürüyüp eve kuru vardı. Kaan, "Teşekkür ederim, çok naziksin." dedi.
> 1. Kimin şemsiyesi yoktu? → **Kaan'ın** (choice: Ece'nin / Kaan'ın / öğretmenin)
> 2. Ece ne yaptı? → **Şemsiyesini Kaan'la paylaştı.**
> 3. Bu metin en çok neyi anlatıyor? → **Arkadaşa yardım etmeyi** (çeldiriciler: yağmurun yağmasını / okulun bitmesini)

> **Defne'nin Görevi**
> Defne'nin evdeki görevi akvaryumdaki balıkları beslemekti. Bir sabah servise geç kalacağını düşündü. Yine de durdu ve balıklara yemlerini verdi. Sonra hızlı adımlarla servise yetişti. Akşam balıklar onu neşeyle karşıladı.
> 1. Defne'nin görevi neydi? → **Balıkları beslemek**
> 2. Defne geç kalacakken ne yaptı? → **Önce balıkları besledi, sonra servise koştu.**
> 3. (order) Yem verdi → Servise yetişti → Akşam balıklar onu karşıladı.

---

### Tema 2 — Atatürk ve Çocuk
1. **sort** (2 sepet: "Büyük harfle başlar" / "Küçük harfle başlar") — Ankara, kalem, Türkiye, kedi, Azerbaycan Türkçesi, kitap, Cumhuriyet Bayramı, okul.
2. **choice** — Büyük harf hatası: "dedemle çanakkale'ye gittik." Hangi sözcük yanlış? → dedemle / çanakkale'ye / ikisi de (doğru: **ikisi de**, çünkü biri cümle başı, öteki yer adı).
3. **match** — Zıt anlam: acı–tatlı, ağır–hafif, ileri–geri, yukarı–aşağı, boş–dolu, düzenli–dağınık.
4. **search** — Zıt anlam kelime avı: hasta, üzgün, ayrı, zayıf, kısa, çirkin. Bulunan sözcüğün zıttı sesli okunur.
5. **pop** — Ünlem gereken cümleler: "Yaşasın_", "Dur_", "Bugün okula gittim_" (yalnızca ilk ikisi).
6. **choice** — Noktalama: "Ezberledin mi( )" → ? / ! / .
7. **match** — Millî bayram ve tarih: 29 Ekim–Cumhuriyet Bayramı, 23 Nisan–Ulusal Egemenlik ve Çocuk Bayramı, 19 Mayıs–Atatürk'ü Anma, Gençlik ve Spor Bayramı, 30 Ağustos–Zafer Bayramı.
8. **order** — Hafta sonu sabahı: kalkar → kahvaltı eder → yardım eder → oyun oynar → kitap okur.
9. **choice** — Neden–sonuç: "Bayram olduğu için…" → sokaklar bayraklarla süslendi / hava yağmurlu oldu / okul kapandı.
10. **input** — Meslek bilmecesi: eksik harfli D_KT_R, P_L_S, ÖĞR_TM_N (harf havuzuyla).
11. **memory** — Sözcük ve anlam: zafer, vatan, şenlik, mektep, istasyon, yurt.
12. **truefalse** — İki nokta: "Bayrağımızın renkleri: kırmızı ve beyaz." (D).

**Tema sonu oyunları**
- **"Bayrak Yolu"**: Fındık okul bahçesindeki direğe ulaşır. Her adım bir büyük harf, ünlem ya da zıt anlam sorusudur (karma **choice**, **pop**, **match**). Bayrak çekilince şiddet içermeyen bir tören animasyonu oynar.
- **"Zıt Anlam Terazisi"**: Kefelere zıt anlamlı kartlar konur (**match**). Doğru çift terazinin dengesini sağlar.

**Özgün okuma parçaları**
> **Balkondaki Bayrak**
> 29 Ekim sabahı Yusuf erkenden uyandı. Babasıyla birlikte balkona bayrak astılar. Karşı evdeki komşular da bayraklarını asmıştı. Sokak kırmızı beyaza büründü. Yusuf okulda Cumhuriyet ile ilgili bir şiir okudu.
> 1. Bu olay hangi gün oldu? → **29 Ekim (Cumhuriyet Bayramı)**
> 2. Yusuf babasıyla ne yaptı? → **Balkona bayrak astı.**
> 3. Yusuf okulda ne yaptı? → **Şiir okudu.**

> **Zehra'nın Sınıfı**
> Zehra her akşam oyuncak ayılarını sıraya dizer. Onlara harfleri ve sayıları anlatır. Dedesi gülümseyerek "Sen iyi bir öğretmen olursun!" der. Zehra okumayı çok sever. Büyüyünce çocuklara okumayı öğretmek istiyor.
> 1. Zehra oyuncak ayılarına neler anlatır? → **Harfleri ve sayıları**
> 2. Dedesinin sözünün sonunda hangi işaret var? → **Ünlem (!)**
> 3. Zehra büyüyünce ne olmak istiyor? → **Öğretmen**

---

### Tema 3 — Doğada Neler Oluyor?
1. **sort** (ekrana 4 kutu sığmazsa ikişerli turlar) — Atık ayırma: cam şişe, gazete, plastik şişe, elma kabuğu, karton kutu, kavanoz.
2. **choice** — Benzetme tamamlama: "Kar ___ gibi bembeyazdı." → pamuk / kömür / çamur.
3. **match** — Benzeyen ve benzetilen: yanak–kiraz, saç–altın, çınar–dev, çalışkan çocuk–karınca, tatlı kiraz–bal.
4. **choice** — mı/mi yazımı: Ekranda "Çiçekleri suladın mı?" ve "Çiçekleri suladınmı?" gösterilir. Hangisi doğru yazılmış?
5. **truefalse** — Sağlık cümleleri: "Dişlerimizi düzenli fırçalamalıyız." (D) · "Spor yapmak bizi boşa yorar." (Y).
6. **search** — Meyve kelime avı: ERİK, İNCİR, ELMA, AYVA, KİRAZ, NAR.
7. **sort** (renk sepetleri: kırmızı / sarı-turuncu / yeşil) — kiraz, portakal, ayva, erik, çilek, mandalina, kivi.
8. **order** — Mevsim cümlesi kurma: [ilkbaharda] [ağaçlar] [çiçek] [açar].
9. **order** — Yönerge: portakal suyu (portakalı yıka → bir büyüğünle kes → sık → bardağa dök).
10. **match** — Afet ve önlem: deprem–eşyaları duvara sabitle · sel–evi dere yatağından uzağa yap · çığ–yamacı ağaçlandır · fırtına–çatıyı sağlam yap. (Korkutucu görsel kullanma.)
11. **pop** — Doğaya yardım: "matara kullanmak", "kâğıdın arkasını kullanmak", "çöpü yere atmak" gibi balonlardan doğru olanlar patlatılır.
12. **input** — "Kullanıldıktan sonra atılan şeye ne denir?" → ATIK.

**Tema sonu oyunları**
- **"Eski Kovanın Yolculuğu"** (kitaptaki çaydanlık öyküsünden esinlenen özgün kurgu): Eski bir kova her durakta yeni bir işe yarar. Her durak bir **sort** (atık) ya da **choice** (yeniden kullanım) sorusudur. Son durakta içine kuşlar yuva yapar.
- **"Benzetme Bahçesi"**: Çiçek açtırma oyunu. Her doğru **match** ya da **choice** benzetmesi bir çiçeği açar.

**Özgün okuma parçaları**
> **Kavanozdan Saksı**
> Mert boş bir reçel kavanozunu çöpe atmak üzereydi. Ablası, "Dur! Onu saksı yapabiliriz." dedi. Kavanoza toprak doldurup nane diktiler. Kavanoz pencerenin önünde yeşerdi. Mert artık hiçbir kavanozu hemen atmıyor.
> 1. Mert neyi atmak üzereydi? → **Boş bir reçel kavanozunu**
> 2. Kavanoza ne diktiler? → **Nane**
> 3. Bu metin en çok neyi anlatıyor? → **Eşyaları yeniden kullanmayı**

> **Kar Sabahı**
> Elif sabah perdeyi açınca şaşırdı. Bahçe pamuk gibi bembeyazdı. Ağaçların dalları şeker serpilmiş gibi parlıyordu. Elif kalın montunu giyip dışarı koştu. Bir kardan adam yaptı ve ona havuçtan burun taktı.
> 1. Bahçe neye benzetilmiş? → **Pamuğa**
> 2. Elif dışarı çıkmadan önce ne giydi? → **Kalın montunu**
> 3. Bu olay hangi mevsimde oluyor? → **Kış**

---

### Tema 4 — Okuma Serüvenimiz
1. **match** — Kısaltma ve açılım: TBMM, MEB, THY, TDK, KKTC, T.C.
2. **choice** — "Türk Dil Kurumu nasıl kısaltılır?" → TDK / Tdk / tdk.
3. **match** — Zıt anlam etiketleri: eski–yeni, ilk–son, pahalı–ucuz, yumuşak–sert (çeldirici kartlar: kolay, ön).
4. **input** — Karışık harfler: "SALAM" → MASAL, "İPTAK" → KİTAP, "ECMARA" → MACERA.
5. **sort** (2 sepet: "Kütüphanede yapılır" / "Kütüphanede yapılmaz") — sessiz okumak, yüksek sesle konuşmak, kitabı zamanında getirmek, yemek yemek, kitaba özen göstermek.
6. **order** — Sözcük zinciri: son harften yeni sözcük (kalem → masa → araba → ...) türünde 4 kartlık sıralama.
7. **choice** — Neden mi, sonuç mu? "Erken yattığım için erken uyandım." Neden hangisi? → erken yatmak / erken uyanmak.
8. **choice** — Hata türü: "en sevdiğim kitap bu." → Cümle büyük harfle başlamamış / Sonunda soru işareti yok / Hata yok.
9. **search** — Okuma kelime avı: KİTAP, MASAL, ŞİİR, YAZAR, KÜTÜPHANE, MACERA.
10. **memory** — Sözcük ve anlam: kaptan, güverte, koleksiyon, ilham, yazar, hazine.
11. **truefalse** — Okuma kuralları: "Kitabı yüzüme çok yakın tutarım." (Y) · "Noktalamaya dikkat ederek okurum." (D).
12. **order** — Sandviç yapımı ya da kitap ödünç alma adımları.

**Tema sonu oyunları**
- **"Kelime Toplayıcısı"**: Fındık'ın defterine kelime toplanır. Ekranda uçuşan harflerden kelime kurulur (**input** ya da harf havuzu). Her yeni kelime defterde anlamıyla birlikte açılır.
- **"Kütüphane Rafları"**: Kitap kartları doğru rafa konur (**sort**: masal / şiir / bilgi kitabı) ve kısaltmalı raf etiketleri eşleştirilir (**match**).

**Özgün okuma parçaları**
> **Ödünç Kitap**
> Ada kütüphaneden dinozorlarla ilgili bir kitap ödünç aldı. Kitabı iki hafta içinde geri getirmesi gerekiyordu. Her akşam yatmadan önce birkaç sayfa okudu. Kitabı bitirince zamanında teslim etti. Görevli ona yeni bir kitap seçmesinde yardım etti.
> 1. Ada kitabı nereden aldı? → **Kütüphaneden**
> 2. Kitabı ne zaman geri getirmeliydi? → **İki hafta içinde**
> 3. Ada kitabı ne zaman okudu? → **Her akşam yatmadan önce**

> **Berk'in Kelime Kutusu**
> Berk duyduğu her yeni kelimeyi küçük bir karta yazıyor. Kartları renkli bir kutuda saklıyor. Bugün kutuya "kâşif" kartını ekledi. Akşam babasına bu kelimeyle bir cümle kurdu. Kutusu doldukça Berk'in anlattıkları da zenginleşiyor.
> 1. Berk yeni kelimeleri nereye yazıyor? → **Küçük kartlara**
> 2. Bugün hangi kelimeyi ekledi? → **Kâşif**
> 3. Kelime kutusu Berk'e ne kazandırıyor? → **Kendini daha zengin anlatmayı**

---

### Tema 5 — Yeteneklerimizi Tanıyoruz
1. **choice** — Kesme işareti: "Ayşe___ resmi çok güzel." → 'nin / nin / -nin.
2. **pop** — Kesme işareti gereken sözcükler: Ankara'ya, okula, Mert'in, kalemin, Türkiye'de.
3. **choice** — Satır sonu: "kelebek" sözcüğü satıra sığmadı. Doğru bölünüş hangisi? → **kele-bek** / kel-ebek / keleb-ek.
4. **order** — Heceleri sırala: saklambaç → sak-lam-baç; körebe → kö-re-be.
5. **search** — Oyun adları: SEKSEK, KÖREBE, SAKLAMBAÇ, BEŞTAŞ, TOPAÇ, ÇEMBER.
6. **match** — Meslek ve iş: veteriner–hayvanları iyileştirir · mimar–binaları tasarlar · öğretmen–ders anlatır · bahçıvan–bitkileri büyütür · ozan–türkü söyler.
7. **order** — Oyun yönergesi (özgün oyun): ebe seçilir → ebe gözünü kapar → diğerleri saklanır → ebe arar.
8. **sort** (2 sepet: "Eski oyuncak" / "Yeni oyuncak") — topaç, bez bebek, tablet oyunu, uzaktan kumandalı araba, tahta at, çember.
9. **choice** — Mektup hitabı: Mektuba nasıl başlarız? → Sevgili Dedeciğim, / Hoşça kal. / Görüşürüz.
10. **memory** — Sözcük ve anlam: maket, müze, hayal, özen, kil, efsane.
11. **truefalse** — "Birlikten kuvvet doğar." sözü "Birlikte olunca güçlü oluruz." demektir. (D)
12. **input** — "Türkü söyleyen halk şairine ne denir?" → OZAN.

**Tema sonu oyunları**
- **"Yetenek Sahnesi"**: Her özgün çocuk karakter bir yetenek gösterir. Oyuncu doğru noktalama ya da kesme işaretiyle sahnenin ışığını yakar (**pop**, **choice**).
- **"Oyuncak Müzesi"**: Oyuncu vitrinleri doldurur. Eski ve yeni oyuncakları ayırır (**sort**), müze etiketindeki özel adlara kesme işaretini koyar (**choice**).

**Özgün okuma parçaları**
> **Dedemin Topacı**
> Dedem bana tahtadan bir topaç yaptı. İpini sarıp yere fırlattım ama topaç hemen devrildi. Dedem gülümseyip "Bir daha dene." dedi. Beşinci denemede topaç fır fır döndü. İkimiz de sevinçle alkışladık.
> 1. Topacı kim yaptı? → **Dede**
> 2. Topaç kaçıncı denemede döndü? → **Beşinci**
> 3. Bu metin bize ne söylüyor? → **Pes etmeden denemeliyiz.**

> **Sınıfın Ressamı**
> Mina resim yapmayı çok seviyor. Sınıf panosundaki ağaç resmini o çizdi. Arda ise şarkı söylemekte çok iyi. Öğretmenleri ikisine de bir görev verdi. Mina afişi çizdi, Arda da gösteride şarkıyı söyledi.
> 1. Mina'nın yeteneği nedir? → **Resim yapmak**
> 2. Arda neyi iyi yapıyor? → **Şarkı söylemeyi**
> 3. (sort) Mina / Arda sepetleri: afiş çizdi, şarkı söyledi, ağaç resmi yaptı.

---

### Tema 6 — Mucit Çocuk
1. **match** — Zıt anlam: küçük–büyük, soru–cevap, ön–arka, az–çok, hızlı–yavaş, eski–yeni.
2. **choice** — Bağlaç: "Robotu açtım ___ çalışmadı." → ama / ve / çünkü.
3. **choice** — "Yiğit annesine sarıldı ___ onu çok özlemişti." → çünkü / ama / ile.
4. **order** — Heceden sözcük: me-rak-lı, a-raş-tır-ma, mu-cit.
5. **search** — Bilim kelime avı: ROBOT, UZAY, UYDU, MUCİT, İCAT, GEZEGEN.
6. **sort** (2 sepet: "Geçmişte" / "Günümüzde") — mektup, akıllı telefon, at arabası, uçak, görüntülü konuşma, posta güvercini (?).
7. **sort** (2 sepet: "Yalnız insan yapar" / "Robot da yapabilir") — sarılmak, ses çıkarmak, yemek taşımak, duygu hissetmek, hareket etmek (robot ile insan karşılaştırması, T.Y.2.2.d).
8. **truefalse** — Biyografi bilgisi: "Astronot olmak için fen ve matematik önemlidir." (D).
9. **match** — Konuşma balonu ve sahne (özgün): "Eyvah, pili takmayı unuttum!" ↔ çalışmayan robot görseli.
10. **memory** — Sözcük ve anlam: batarya, astronot, gezegen, uydu, mucit, ekran.
11. **pop** — Merak soruları: soru cümlelerini patlat ("Kuşlar neden göç eder?" ✓, "Kuşlar göç eder." ✗).
12. **input** — "Yeni bir şey bulan kişiye ne denir?" → MUCİT.

**Tema sonu oyunları**
- **"Mucit Atölyesi"**: Oyuncu parçaları toplayarak bir icat yapar (ör. bitki sulayan şişe). Her parça bir **choice** (bağlaç) ya da **match** (zıt anlam) sorusundan kazanılır. Sonunda icata ad verilir (**input**, isteğe bağlı).
- **"Uzay Yolculuğu"**: Roket her doğru cevapta bir gezegene ilerler (**search**, **truefalse**). Gerçek kişi görseli kullanılmaz, Fındık astronot olur.

**Özgün okuma parçaları**
> **Yağmur Ölçer**
> Zeynep yağmurun ne kadar yağdığını merak etti. Boş bir şişenin üstünü babasıyla birlikte kesti. Şişenin yanına eşit aralıklı çizgiler çizdi. Şişeyi bahçeye koydu. Akşam su ikinci çizgiye gelmişti ve Zeynep sonucu defterine yazdı.
> 1. Zeynep neyi merak etti? → **Yağmurun ne kadar yağdığını**
> 2. Şişeyi kiminle kesti? → **Babasıyla**
> 3. Akşam su hangi çizgiye gelmişti? → **İkinci çizgiye**

> **Robot Fıstık**
> Can'ın küçük bir oyuncak robotu var, adı Fıstık. Fıstık ileri gidebiliyor ama geri gidemiyor. Can, "Fıstık neden geri gitmiyor?" diye düşündü. Kardeşiyle birlikte kullanma kitabını okudular. Bir düğmeye basınca Fıstık geri de gitmeye başladı.
> 1. Robotun adı ne? → **Fıstık**
> 2. "İleri" sözcüğünün zıttı metinde hangisi? → **Geri**
> 3. Can sorunu nasıl çözdü? → **Kardeşiyle kullanma kitabını okuyup düğmeye bastı.**

---

### Tema 7 — Kültür Hazinemiz
1. **order** — Sözlük sırası: bilge, fıkra, göl, şenlik, tiyatro (karışık verilir). Kolay varyant 4 sözcükle (armut, elma, kiraz, muz).
2. **choice** — Benzetme: "Deniz ___ gibi dümdüzdü." → çarşaf / dağ / ateş.
3. **match** — Benzetme çiftleri: güneş–altın, su–buz, ırmak–billur, eller–pamuk, çalışkan çocuk–arı.
4. **choice** (2 seçenek) — Sözcük grubunun anlamı: "gözlerini fal taşı gibi açmak" → şaşkınlıkla bakmak / çok acıkmak.
5. **sort** (2 sepet: "Millî bayram" / "Dinî bayram") — 23 Nisan, Ramazan Bayramı, 29 Ekim, Kurban Bayramı, 30 Ağustos, 19 Mayıs.
6. **sort** (2 sepet: "Bayramla ilgili" / "Bayramla ilgisiz") — el öpmek, bayramlık giymek, büyükleri ziyaret etmek, bisiklet tamiri, fidan dikmek.
7. **search** — Kültür kelime avı: MANTI, HALAY, FIKRA, TÜRKÜ, KİLİM, BAYRAK.
8. **order** — Yoğurt mayalama ya da bayram sabahı adımları (özgün).
9. **truefalse** — 23 Nisan bilgisi: "23 Nisan dünya çocuklarına armağan edilmiştir." (D).
10. **choice** — Görüş bildirme: "Ya tutarsa?" düşüncesine sen ne dersin? İki seçenek de kabul edilir, ardından "Neden?" için 3 gerekçe kartından biri seçilir. Puanlanmaz, yalnızca **görüş bildirme** amaçlıdır.
11. **memory** — Sözcük ve anlam: billur, şaheser, kürsü, bağımsız, kadı, çanak.
12. **input** — İstiklâl Marşı'nın ilk 4 kıtasında eksik sözcük ("Korkma, sönmez bu şafaklarda yüzen al ___" → SANCAK). Marş resmî ve kamuya açık bir metindir, sınırlı kullanım uygundur.

**Tema sonu oyunları**
- **"Kültür Çarkı"**: Oyuncu çarkı çevirir, gelen kategoriden (yemek, oyun, bayram, mekân, el sanatı) **choice** ya da **match** sorusu çıkar. Toplanan kartlar bir "kültür sandığı"na konur.
- **"Anadolu Gezisi"**: Haritada durak durak ilerleyen özgün bir otobüs. Her durakta bir benzetme ya da sözlük sırası sorusu vardır.

**Özgün okuma parçaları**
> **Bayram Sabahı**
> Bayram sabahı herkes erkenden kalktı. Ela en sevdiği elbisesini giydi. Önce dedesinin, sonra ninesinin elini öptü. Ninesi ona işlemeli bir mendil içinde şeker verdi. Ela şekerleri kardeşiyle paylaştı.
> 1. Ela önce kimin elini öptü? → **Dedesinin**
> 2. Ninesi ona ne verdi? → **Mendil içinde şeker**
> 3. Ela şekerleri ne yaptı? → **Kardeşiyle paylaştı.**

> **Halay Provası**
> Kerem ve arkadaşları okul gösterisi için halay çalışıyor. İlk gün adımları karıştırdılar. Öğretmenleri adımları tek tek sayarak gösterdi. Bir hafta sonra hepsi el ele, aynı anda adım attı. Gösteri günü salon alkışlarla doldu.
> 1. Çocuklar ne için halay çalışıyor? → **Okul gösterisi için**
> 2. İlk gün ne oldu? → **Adımları karıştırdılar.**
> 3. (order) Adımları karıştırdılar → Öğretmen gösterdi → El ele adım attılar → Alkışlandılar.

---

### Tema 8 — Haklarımızı Biliyoruz
1. **sort** (2 sepet: "Canlı" / "Cansız") — kedi, ağaç, top, çocuk, salıncak, kuş, kitap.
2. **sort** (2 sepet: "Gerçek taşıt" / "Oyuncak taşıt") — otobüs, oyuncak tren, uçak, kumandalı araba.
3. **match** — Hak ve örnek: eğitim hakkı–okula gitmek · oyun hakkı–parkta oynamak · sağlık hakkı–doktora gitmek · görüş bildirme hakkı–fikrini söylemek.
4. **choice** — Mektup kapanışı: Mektubu nasıl bitiririz? → Hoşça kal, seni seven arkadaşın Ayşe. / Sevgili Sena, / Konu:.
5. **order** — E-posta bölümlerini sırala: Kime → Konu → Sayın Yetkililer, → Mesaj → Saygılarımla.
6. **pop** — Karma noktalama: mektuptaki boşluklara düşen işaret balonları (, ? ' . !).
7. **truefalse** — Sorumluluk: "Sınıf başkanı sıkılınca görevini bırakabilir." (Y).
8. **choice** — Arkadaşın salıncağı paylaşmıyor. Ne yaparsın? → Kibarca sıra isterim / Onu iterim / Ağlarım.
9. **order** — Oyun günü olayları: heyecanlanırız → kurallar hatırlatılır → oyun başlar → oyun berabere biter.
10. **sort** (2 sepet: "Benzer yön" / "Farklı yön") — iki özgün karakterin kartları (ikisi de 8 yaşında; biri basketbolu, öteki bisikleti sever).
11. **memory** — Sözcük ve anlam: hak, muhtar, emek, program, proje, sözleşme.
12. **input** — "Mahallenin seçilmiş yöneticisine ne denir?" → MUHTAR.

**Tema sonu oyunları**
- **"Çocuk Hakları Durağı"**: Mahallede bir durak inşa edilir. Her doğru cevap (**match**/**sort**/**choice**) bir pano ya da bank ekler. Durak bitince önünden geçen karakterlere haklar sesli anlatılır.
- **"Mektup Postası"**: Noktalama ve sözcük eksikleri tamamlanan mektup zarfa konup postalanır (**pop**, **choice**). Gerçek gönderim yapılmaz, yalnızca animasyon oynar.

**Özgün okuma parçaları**
> **Salıncak Sırası**
> Parkta tek bir salıncak vardı. Elif, Can ve Mina sallanmak istiyordu. Can, "Herkes on kez sallansın, sonra sıra değişsin." dedi. Üçü de bu fikri beğendi. Böylece kimse küsmedi ve hepsi eğlendi.
> 1. Parkta kaç salıncak vardı? → **Bir**
> 2. Can ne önerdi? → **Herkesin on kez sallanıp sırayı değiştirmesini**
> 3. Bu metin en çok neyi anlatıyor? → **Hakça paylaşmayı**

> **Kediye Su**
> Çok sıcak bir gündü. Emir apartmanın önünde susamış bir kedi gördü. Annesiyle birlikte temiz bir kaba su koydular. Emir kediye dokunmadan uzaktan izledi. Kedi suyu içip gölgeye uzandı.
> 1. Hava nasıldı? → **Çok sıcaktı.**
> 2. Emir kiminle su koydu? → **Annesiyle**
> 3. Emir kediye dokundu mu? → **Hayır, uzaktan izledi.**

---

## 5. 7–8 yaş için hassas içerik notları

1. **Savaş ve şehitlik dili** (T2 "Çanakkale", İstiklâl Marşı, Şekerci Ökkeş, askerlik günlüğü): Kitapta kan, feda, düşman, top ve süngü sözcükleri geçiyor. Oyunda **silah, kan ve çatışma görseli ya da sesi kullanma**. Vatan sevgisini bayrak, tören, saygı duruşu ve birlik üzerinden anlat. "Süngü", "zalim düşman" gibi sözcükleri soru bankasına alma. İstiklâl Marşı yalnızca saygı bağlamında ve resmî metniyle, değiştirilmeden kullanılır.
2. **Doğal afetler** (T3): Türkiye'deki çocukların bir kısmı depremi yaşadı. Yıkım, yaralı ya da enkaz görseli kullanma. Yalnızca **hazırlık ve önlem** (afet çantası, eşyayı sabitleme, yardım kuruluşları) üzerinden olumlu bir dil kur. Yanlış cevapta korkutucu geri bildirim verme. Gerçek bir öğretmenin depremdeki öyküsüne (T1 KD) dayanan içerik üretme.
3. **Gerçek kişiler**: Kitapta Mete Gazoz, Arda Güler, Sümeyye Boyacı, Alper Gezeravcı, Neşet Ertaş, Ömer Halisdemir (15 Temmuz şehidi), Seyit Onbaşı ve gerçek bir kaymakamın adı geçiyor. CLAUDE.md'ye göre özgün içerik üretiyoruz. **Gerçek kişileri karakter olarak canlandırma, fotoğraflarını kullanma, ağızlarına söz koyma.** Biyografi bilgisi gerekiyorsa yalnızca kamuya açık kısa bilgi ver ve görsel olarak Fındık'ı kullan. Ömer Halisdemir'i 2. sınıf içeriğine alma (şiddet bağlamı).
4. **Atatürk'ün hastalığı ve ölümü** ("hasta olduğu için fazla kalamadı", 1938): Ölüm bilgisini 2. sınıf oyununda öne çıkarma. Atatürk'ü çocuk sevgisi, eğitim ve bayramlar üzerinden anlat.
5. **Dinî bayramlar** (T7 Bir Bayram Sürprizi, Bayram Sevinci): Kurban Bayramı'nda **hayvan kesimi** imasına girme. Bayramı aile ziyareti, el öpme, şeker ve paylaşma üzerinden kapsayıcı ve tarafsız işle. Metindeki "evin erkekleri bayram namazına" gibi cinsiyet rolü vurgularını soru bankasına taşıma.
6. **Kişisel veri ve dış iletişim**: Kitap kütüphane üye kartında ad-soyad, doğum tarihi ve okul; e-postada bakanlık ya da belediye adresi; mektupta okul müdürü istiyor. Uygulamada **hiçbir form gerçek kişisel veri istememeli** (KVKK; CLAUDE.md: yalnızca takma ad, avatar ve sınıf). "E-posta yaz" ve "mektup yaz" mekanikleri gerçek gönderim yapmamalı, oyun içi bir animasyonla bitmeli. Kitapta geçen gerçek e-posta ve web adreslerini uygulamaya koyma.
7. **Sokak hayvanları** (Mırnav Dostları, mama kabı): Çocuklara sahipsiz hayvanlara dokunmayı, onları eve taşımayı ya da hasta hayvanla temas etmeyi önerme. Oyundaki karşılığı "bir yetişkinle birlikte su ve mama koymak, uzaktan izlemek" olmalı. "Enfeksiyon" sözcüğünü korkutucu görselle verme.
8. **Kaygı yaratabilecek kurgular**: "Neler Oluyor?" (robotların annenin ve öğretmenin yerini alması, servisin kendi kendine gitmesi ve çocuğun korkması) olumlu sonla bitiyor. Bizim içeriğimizde teknolojiyi tehdit olarak sunmayalım. "Koray ve Fındık"taki "çığlık sesi" gibi yarım bırakılmış gerilim cümlelerini uygulamaya alma.
9. **Kardeş kıskançlığı, dışlanma, görevden sıkılma**: Bunlar duygusal öğrenme açısından değerli. Oyunda yargılayıcı olmayan bir dil kullan ("Kaba davrandın!" yerine "Bunu daha nazik nasıl söyleyebiliriz?"). Yanlış seçimde ceza değil ipucu ver.
10. **Ekran süresi mesajı** (T1'de geç kalma nedeni "tabletle oynamak", T6'da "ekrana uzun süre bakmak zararlı"): Uygulamanın kendisi de bir ekran. Bu mesajları ebeveyn panelindeki ekran süresi özelliğiyle tutarlı ver ve çocuğu suçlama.
11. **Makas ve mutfak işi**: Kitaptaki "makası öğretmen gözetiminde kullanalım" uyarısı, oyundaki el işi ve tarif yönergelerinde de (portakal suyu, sandviç, yoğurt) "bir büyüğünle" ifadesiyle korunmalı.
12. **Cinsiyetçi ya da eski terimler**: "bilim adamı" yerine "bilim insanı" kullan. Meslek sorularında kadın ve erkek karakterleri dengeli dağıt (pilot, astronot, öğretmen, hemşire).
13. **Telif**: Kitaptaki şiir, hikâye ve fıkra metinlerini **aktarma**. Bölüm 4'teki parçalar bize ait ve uygulamada serbestçe kullanılabilir. Tekerlemeleri de kendimiz yazalım (program, metin seçimi madde 10: anlamlı ve değerlere uygun tekerleme).

---

## Ek: Soru bankası için hızlı sayım

| Kategori | Kitaptaki somut örnek sayısı | Nerede |
|---|---|---|
| Zıt anlamlı çiftler | **21** (+1 belirsiz) | T2: 13 (+ gitmek–gelmek?), T4: 4, T6: 4 |
| Benzetme örnekleri ("gibi") | **≈33** | T3: 14 (ön değerlendirme dahil), T4: 5, T6: 3, T7: 11 |
| Noktalama alıştırma cümleleri | **≈45** | nokta/virgül (T1: 8 + metin), soru-ünlem karma (T2: 7 + 9 + 3), iki nokta (T2: 4), mı/mi (T3: 3 + 3, T5: 5), kesme ve kısa çizgi (T5: 5), mektup (T8: ≈15 boşluk) |
| Büyük harf hata cümleleri | **≈14** | T2: 3 + 5 + 3, T4 Pekiştirelim: 3 |
| Kısaltmalar | **10** | T4 |
| Sözlük (bağlamdan anlam) sözcükleri | **≈85** | Her metinde 2–3 sözcük + kitap sonu sözlükleri |
| Hece ve heceleme örnekleri | **≈20** | Hatırlayalım: 5 sözcüklük tablo + 12 hece başlangıcı, T5: 4 satır sonu, T6: hece yolu |
| Olay sıralama görevleri | **≈12** | Her temada 1–2 |
| Neden–sonuç cümleleri | **≈12** | T1: 1 tablo, T2: 3 + 3, T4: 5 |
| Deyim / atasözü benzeri sözcük grupları | **≈12** | T5: 1 atasözü, T7: 2 deyim (anlam sorusu), metin içinde ≈9 |
| Eş anlam / eş sesli / -de/-ki / sözcük türleri | **0** (2. sınıf programında yok) | — |
