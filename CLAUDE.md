# Minik Kaşifler — Proje Rehberi

1–4. sınıf öğrencileri için 3D oyun dünyasında oyunla öğrenme platformu. Arayüz, içerik ve yorumlar Türkçe.
Öncelik sırası: **görsel kalite → çocuk deneyimi → eğitici oyun mekaniği**.

## Komutlar
- `npm run dev` — geliştirme sunucusu (http://localhost:5173)
- `npm test` — öğrenme çekirdeği birim testleri (vitest)
- `npm run typecheck` / `npm run build`
- `npm run art -- --only <id>` — OpenAI ile referans kalitesinde görsel üretimi (ücretli; önce kullanıcıya tutarı bildir, bkz. raster-art-pipeline skill)
- `npm run build && npm run sinif` — Yarışma Modu sınıf sunucusu (okul ağında, port 5174): uygulamayı ve yarışma odalarını açar; öğrenciler aynı Wi-Fi'den kodla/QR ile katılır. Veri okul dışına çıkmaz, sohbet yok (`scripts/yarisma-sunucu.mjs`)
- `npm run smoke` — dev sunucusu açıkken gerçek Chrome ile uçtan uca test: tüm ekranları gezer, iki oyunu baştan sona oynar, `screenshots/` klasörüne görüntü alır, konsol hatası varsa başarısız olur. **Her geliştirme aşamasından sonra çalıştır ve görüntülere bak.**

## Mimari
- `src/App.tsx` — ekran yönetimi (zustand `screen`), karşılama + dünya ekranlarında kalıcı 3D katman
- `src/world/` — React Three Fiber dünyası (`WorldScene.tsx`, `parts/`). Etiketler DOM'da, `LabelProjector` ile yansıtılır (drei `<Html>` KULLANMA: React 19 ile kök sökme yarışı yaratıyor)
- `src/characters/` — maskot **Fındık** (SVG rig, 10 poz) ve çocuk avatarı (özelleştirilebilir)
- `src/screens/` — karşılama, sınıf seçimi, dünya katmanı, ders dünyası, avatar, ebeveyn paneli
- `src/games/` — `GameShell` + `useRoundEngine` ortak çatısı; oyunlar `registry` ile lazy yüklenir
- `src/learning/` — saf fonksiyonlar: ustalık/uyarlanabilir seviye (`mastery.ts`), soru üreticileri (`questions.ts`), tohumlu rng
- `src/content/games.ts` — etkinlik kataloğu (sınıf + MEB kodu + tema); `src/content/generators/` — sınıfa göre soru üreticileri; `docs/meb/` resmî program metinleri
- `src/games/quiz/` — ortak oyun motoru (seçmeli, baloncuk, hikâye, tren, sepetlere ayırma)
- `src/yarisma/` — Yarışma Modu çekirdeği: `motor.ts` (puan/sıralama/karakter rakip, saf), `sorular.ts` (ders üreticilerinden + Mantık/Genel Kültür havuzu), `oda.ts` (oda yöneticisi + ağ istemcisi); ekranlar `src/screens/yarisma/` (referans `docs/reference/yarisma-modu-referans.png`)
- `src/art/` — sanat yuvaları (raster illüstrasyon varsa onu, yoksa SVG/3D yedeği gösterir); `src/world/PaintedWorld.tsx` boyanmış ana dünya
- `src/audio/` — sentezlenmiş SFX (Web Audio) + Türkçe TTS (Web Speech)
- `src/styles/tokens.css` — tasarım tokenları
- `public/assets/` — görseller; her harici asset `public/assets/LICENSES.md` içine kaydedilir

## Proje skill'leri (`.claude/skills/`)
| Skill | Ne zaman |
|---|---|
| `educational-game-designer` | yeni oyun tasarımı, zorluk, ödül |
| `premium-ui-ux-designer` | ekran/bileşen tasarımı, görsel QA |
| `3d-environment-designer` | 3D sahne, ışık, kamera, performans |
| `animation-specialist` | karakter pozları, geçişler, Rive/Lottie entegrasyonu |
| `educational-content-designer` | MEB uyumlu soru/içerik |
| `game-mechanics-developer` | oyun kodu, sürükle-bırak, puanlama |
| `accessibility-child-safety` | erişilebilirlik, sesli rehberlik, KVKK, ebeveyn kontrolü |
| `art-director` | referansa uyum denetimi, görsel QA, stil incili |
| `painterly-illustrator` | SVG sahne/karakterlerde derinlik, hacim, ışık |
| `raster-art-pipeline` | dışarıda üretilen illüstrasyonları alma (sanat yuvaları, promptlar) |
| `3d-render-polish` | 3D ışık, bloom/vinyet, bulut denizi, malzeme |
| `skill-forge` | yeni skill gerektiğinde |

## Değişmez kurallar
- Reklam, açık sohbet, uygulama içi satın alma, kontrolsüz yapay zekâ sohbeti yok. Kişisel veri: yalnızca takma ad + avatar + sınıf.
- Kazanım kodlarını uydurma (`meb: 'TODO-dogrula'`), bkz. `docs/CURRICULUM.md`.
- Bilinen karakter/oyunları kopyalama; özgün tasarım.
- Lisansı belirsiz asset kullanma.
