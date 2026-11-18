---
name: educational-game-designer
description: Minik Kaşifler için yeni bir eğitsel mini oyun tasarlarken (Harf Avcısı, Elma Toplama, Kelime Treni vb.) kullan. Yaşa uygun mekanik, kazanım eşleme, zorluk seviyeleri ve ödül tasarımı. Use when designing or reviewing any learning game, its difficulty curve, or its reward loop.
---

# Educational Game Designer

## Ne zaman
Yeni oyun fikri, mevcut oyunun zorluk/ödül ayarı, oyun tasarım dokümanı (GDD) yazımı.

## Her oyun için tek sayfalık GDD (`src/content/games.ts` içinde meta olarak tutulur)
1. **Kazanım**: MEB kodu + çocuk diliyle tek cümle (bkz. `educational-content-designer`).
2. **Sınıf aralığı** ve **beceri anahtarı** (`skill`, ör. `math.addition.within10`). Akıllı öğrenme sistemi bu anahtarla çalışır.
3. **Çekirdek fiil**: çocuk ne YAPIYOR? (sürükle, dokun, sırala, dinle-seç). Tek güçlü çekirdek fiil > çok mekanik.
4. **Somut → temsili → soyut**: önce nesne (elma), sonra görsel model (sepet / onluk çerçeve), sonra sembol (5 + 3).
5. **Tur yapısı**: 5–8 soru, 2–4 dakika. Uzun seanslar yok.
6. **Geri bildirim**: doğru → maskot sevinir + ses + yıldız parçacığı; yanlış → nazik ipucu ve 1 deneme daha; ikinci yanlışta doğru cevap *açıklamasıyla* gösterilir. Yanlış için asla "ceza sesi" yok.
7. **Zorluk seviyeleri** (1–3): sayı aralığı, seçenek sayısı (2→3→4), dikkat dağıtıcı benzerliği (b/d), 1–2. sınıfta zaman sınırı YOK.
8. **Tamamlanma**: yıldız = doğruluk (≥ %90 → 3★, ≥ %65 → 2★, aksi 1★). Para = yıldız × 10 (+ ilk tamamlama bonusu). XP = doğru sayısı × 4.

## Yaş kuralları
- 1. sınıf: okuma bilmeyebilir → her yönerge sesli + ikonlu; metin ikincil.
- 1–2. sınıf: tek adımlı görevler, en çok 3 seçenek, büyük hedefler (≥ 80px).
- 3–4. sınıf: çok adımlı problemler, strateji, isteğe bağlı süre mücadelesi.

## Etik ödül tasarımı (zorunlu)
- Ödül öğrenme başarısına bağlı; seri (streak) cezası, kayıp korkusu, şans kutusu, reklam YOK.
- Günlük görev en fazla 3, ~15 dakikalık hedef; tamamlanınca "Bugünlük harika iş! Biraz dinlenme zamanı" mesajı.
- Kalpler yalnızca görsel motivasyondur; bitince oyun kilitlenmez, maskot ipucu verip devam eder.

## Kontrol listesi
- [ ] Çocuk tek başına başlatıp bitirebiliyor mu?
- [ ] Kazanım gerçekten ölçülüyor mu (`recordAttempt` çağrıları)?
- [ ] Yanlış cevaptan sonra öğretici bir an var mı (neden yanlış)?
- [ ] Oyun 10 saniye içinde anlaşılıyor mu?
