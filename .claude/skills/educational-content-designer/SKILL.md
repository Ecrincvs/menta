---
name: educational-content-designer
description: MEB ilkokul (1-4. sınıf) Türkçe, Matematik, Fen Bilimleri, Hayat Bilgisi, Sosyal Bilgiler kazanımlarına uygun soru ve içerik yazarken kullan (src/content/). Use when writing questions, curriculum mapping, or assessment content.
---

# Educational Content Designer

İçerik: `src/content/`. Her soru/ünite bir **beceri anahtarına** ve sınıfa bağlanır.

## Kaynak kuralları
- Esas: MEB "Türkiye Yüzyılı Maarif Modeli" öğretim programları. Kazanım kodlarını UYDURMA: emin değilsen `meb: 'TODO-dogrula'` yaz ve `docs/CURRICULUM.md` içindeki doğrulama listesine ekle.
- Yapay zekâ içerik üretirse: içerik `status: 'taslak'` ile girer, öğretmen onayından sonra `'onayli'` olur. Üretim yapısı yalnızca `onayli` içeriği gösterir.
- Çocukla serbest yapay zekâ sohbeti YOK.

## Türkçe (1. sınıf öncelikli)
- **Resmî kaynaklar projede:** `docs/meb/*.txt` (Maarif programları) ve eşleme tablosu `docs/CURRICULUM.md`. İçerik yazmadan önce ilgili metni grep'le; kazanım kodu uydurma.
- **Bir etkinlik yalnızca dersin programda olduğu sınıflara açılır** (Hayat 1–3, Fen 3–4, Sosyal 4). İçerik sınıfa göre ÜRETİLİR: aynı oyunu zorlaştırıp üst sınıfa açmak yetmez (ör. 4. sınıfa “horozun son harfi” sorulmaz). `src/learning/learning.test.ts` bunu denetler.
- Ses grupları sırası (Maarif Türkçe, Şekil 1): 1) a n e t i l  2) o k u r ı m  3) ü s ö y d z  4) ç b g c ş  5) p h v ğ f j. Hece çalışmasında büyük harf yok. Harf Avı ve Hece Treni bu sırayla ilerler.
- Harfi **sesiyle** öğret; TTS harf adını değil ses değerini okumalı → `src/audio/speech.ts` içindeki `LETTER_SOUNDS`.
- Kelimeler somut ve resimlenebilir (kedi, elma, top). Her kelimenin görsel/emoji karşılığı zorunlu.
- Türkçe büyük/küçük harf dönüşümü daima `toLocaleUpperCase('tr-TR')` (i → İ, ı → I).

## Matematik
- 1. sınıf: 20'ye kadar toplama/çıkarma, somut nesneyle. 2: 100'e kadar, çarpmaya giriş. 3: çarpım tablosu, bölme. 4: kesirler, çok adımlı problemler.
- Problemler günlük hayat bağlamında; çözüm adımları `explain` alanında çocuk diliyle.

## Doğruluk kontrolü
Her yeni içerik: yaşa uygun mu, kültürel olarak kapsayıcı mı, bilgi doğru mu, tek doğru cevap mı, görsel karşılığı var mı?
