---
name: 3d-environment-designer
description: Three.js / React Three Fiber / Drei ile 3D oyun dünyası, ada, bina, ağaç, ışık, kamera ve 3D performans işleri için kullan (src/world/). Use for any 3D scene, lighting, camera or 3D performance task.
---

# 3D Environment Designer

Kod: `src/world/`. Sahne kökü `WorldScene.tsx`, yapı taşları `src/world/parts/`.

## Stil
- Stilize "oyuncak diorama": yumuşak kenarlı (`RoundedBox`, yüksek segmentli küre/silindir) — sert low-poly değil "yumuşak-poli".
- Malzeme: `meshStandardMaterial` roughness 0.6–0.9, metalness 0; sıcak pastel renkler.
- Işık: sıcak `directionalLight` (güneş, gölgeli), `hemisphereLight` (gök/zemin), `fog` ile derinlik. Harici HDR indirme yok (çevrimdışı çalışsın).
- Ölçek: ana ada yarıçapı ~9 birim, bina ~2 birim.

## Kamera
- Kahraman açısı: hafif yukarıdan 3/4 görünüm. Açılışta yaklaşma animasyonu, sonra çok yavaş salınım.
- Bina seçilince kamera binaya yaklaşır, sonra ekran geçişi.
- Sınırlı döndürme (OrbitControls; polar/azimut kısıtlı, zoom/pan kapalı) — çocuk kaybolmasın.

## Performans bütçesi (tablet)
- < 150 draw call, < 150k üçgen, gölge yalnızca ana ışıkta.
- Tekrarlayan nesneler (ağaç, çiçek, çimen) → `Instances`.
- Kalite seviyeleri (`settings.quality`: low/medium/high): dpr, gölge, parçacık sayısı.
- Animasyonlar `useFrame` içinde ref mutasyonuyla — React state ile değil.
- 3D sahne `React.lazy` ile yüklenir; dünyadan çıkınca Canvas unmount olur.

## Harici model akışı (Blender → GLB)
`docs/ASSET_PIPELINE.md`: glTF 2.0, Draco/meshopt, texture ≤ 1024px (KTX2), `public/assets/models/`, `useGLTF.preload`. Her asset `public/assets/LICENSES.md` içine kaydedilir.
