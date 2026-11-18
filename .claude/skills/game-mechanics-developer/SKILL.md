---
name: game-mechanics-developer
description: Mini oyun kodu yazarken kullan - sürükle bırak, dokun-seç, bulmaca, puanlama, can, tur akışı, seviye. src/games/ altındaki ortak oyun çatısı (GameShell, useRoundEngine). Use when implementing or debugging game logic.
---

# Game Mechanics Developer

## Ortak çatı
- `src/games/GameShell.tsx`: ahşap başlık, geri, kalpler, ilerleme noktaları, giriş ekranı (intro) ve bitişte `CompletionScreen`.
- `src/games/useRoundEngine.ts`: tur ilerleyişi, `answer(correct)`, deneme sayısı, doğruluk, yıldız hesabı, `recordAttempt(skill, correct)`.
- Yeni oyun = `src/games/<OyunAdi>.tsx` + `src/content/games.ts` kaydı + `src/games/registry.ts` (lazy import).

## Sürükle bırak
- Framer Motion `drag` + bırakma anında hedefin `getBoundingClientRect` çakışma testi. Pointer events (fare + dokunma tek kod).
- Yanlış yere bırakılan nesne yay animasyonuyla geri döner. Hedef üzerine gelince büyür/parlar.
- Erişilebilir **alternatif**: nesneye dokununca hedefe uçar.

## Puanlama / durum
- Saf fonksiyonlar `src/learning/` içinde, vitest ile test edilir (`npm test`).
- Soru üreticileri tohumlanabilir rastgelelik kullanır (`src/learning/rng.ts`).

## Test
Bir oyun "bitti" sayılmaz, ta ki: 1) birim testler geçer, 2) `npm run shots` ekran görüntüleri incelenir, 3) `npm run smoke` gerçek tıklama/sürükleme akışı başarılı olur.
