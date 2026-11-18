---
name: raster-art-pipeline
description: Referans kalitesinde raster illüstrasyonları (Pixar tarzı karakter pozları, boyanmış arka planlar) dışarıda üretip projeye almak - prompt şablonları, dosya standartları, manifest, optimizasyon. src/art/artRegistry.ts, public/assets/art/. Use when integrating AI-generated or artist-made images.
---

# Raster Art Pipeline

## Gerçek durum
Claude bu ortamda görsel üretemez. Görseller kullanıcının erişebildiği bir araçla (referansı ürettiği araç, bir illüstratör ya da onaylanmış bir görsel üretim API'si) üretilir. Ücretli API/hesap için **kullanıcı onayı şart**.

## Üretim (OpenAI, kullanıcı onaylı)
- Anahtar: `.env.local` → `OPENAI_API_KEY` (git dışı; asla ekrana yazdırma).
- Komut: `npm run art -- --only id1,id2` (tarifler `scripts/art/prompts.mjs`). Var olan görseli atlar; `--force` yeniden üretir.
- **Modeller:** arka plan → `gpt-image-2` (en iyi sahne; **şeffaf arka plan desteklemez**), karakter → `gpt-image-1.5` (`background: transparent`).
- **Tutarlılık:** önce çapa karakteri üret ve onayla (ör. `findik-wave`), diğer pozlarda `refs: ['raw:findik-wave.png']`.
- **Maliyet (ölçülen):** karakter ≈ 4.500 çıktı tokeni (~0,18 $), arka plan 1536×1024 ≈ 5.500 token (~0,22 $). Toplu üretimden önce kullanıcıya adet + tahmini tutarı bildir; önce 1–2 deneme.
- Kabuk heredoc/`node -e` içinde tarif metni yazma: tırnaklar bozuluyor — dosyayı Write ile düzenle.

## Sanat yuvası sistemi
- Dosyalar: `public/assets/art/characters/*.webp`, `public/assets/art/backgrounds/*.webp`
- Kayıt: `public/assets/art/manifest.json`
  ```json
  { "characters": { "findik": { "idle": "characters/findik-idle.webp", "wave": "characters/findik-wave.webp" } },
    "backgrounds": { "forest": "backgrounds/forest.webp" } }
  ```
- Kod: `useCharacterArt(id, pose)`, `useBackgroundArt(id)` — yoksa SVG yedeği otomatik.

## Dosya standartları
- Karakter: şeffaf arka plan PNG/WebP, 1024×1024, ayaklar alt kenarda, karakter ortada, aynı ölçek ve ışık (sağ üst).
- Arka plan: 2400×1500 WebP (kalite 82), ortası boş (UI için), karakter içermez.
- Optimizasyon: `node scripts/optimize-art.mjs` (sharp) → WebP, en uzun kenar sınırı, ≤ 350 KB.
- Lisans: üretim aracının ticari kullanım koşulu `public/assets/LICENSES.md`'ye yazılır.

## Tutarlılık
- Prompt şablonları `docs/ART_PROMPTS.md` — her istem aynı "stil başlığı" ile başlar.
- Önce karakter sayfası (turnaround) üret, sonra pozları aynı referansla üret (görsel referans girdisi).
- Her yeni görsel `art-director` denetiminden geçer.
