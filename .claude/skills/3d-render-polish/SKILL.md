---
name: 3d-render-polish
description: 3D dünyanın render kalitesini referanstaki boyanmış görünüme yaklaştırmak - ışık kurulumu, bloom/vinyet postprocessing, bulut denizi, malzeme ve renk düzenlemesi, kalite seviyeleri. src/world/. Use when the 3D scene looks flat, plain or "not like the reference".
---

# 3D Render Polish

## Işık reçetesi
- Anahtar ışık: sıcak (#fff0d6) directional, sağ-üst-ön, gölgeli, şiddet 2.2–2.6.
- Dolgu: `hemisphereLight` gök #dff3ff / zemin #7cbf5a, 1.0–1.2.
- Arka/kenar ışığı: soğuk mavi directional arkadan (#b9e6ff, 0.6) → silüetlerde rim.
- Tone mapping ACES, exposure ~1.05; renkler sRGB.

## Postprocessing (`@react-three/postprocessing`)
- Yalnızca `quality === 'high'`: Bloom (luminanceThreshold 0.75, intensity 0.5–0.7, mipmapBlur), Vignette (offset 0.3, darkness 0.45), SMAA.
- `medium`: yalnızca Vignette. `low`: hiçbiri.
- Emissive öğeler (pencereler, kristaller, şişe) bloom'un hedefi; diğer malzemeler threshold altında kalmalı.

## Atmosfer
- Adaların altında **bulut denizi** (geniş, düşük opaklıkta küre kümeleri), uzakta sis; adalar "gökyüzünde" durmalı.
- Şelalelerin dibinde sis/köpük, üstte gökkuşağı (isteğe bağlı, şeffaf torus yay).
- Renk: çim üst yüzeyinde ton farkı (vertex color veya ikinci, biraz açık katman).

## Kontrol
`npm run smoke` → `03-ana-dunya.png`'yi referansın sol üst paneliyle karşılaştır (art-director). FPS: tablet hedefi 50+; high'da draw call < 200.
