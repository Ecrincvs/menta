# Görsel Üretim Araçları ve Asset İş Akışı

## Gerçek durum
Claude Code bu ortamda Figma, Blender, Rive, Spline veya görsel üretim modellerini **doğrudan kullanamaz**.
Bu sürümdeki tüm görseller şu yollarla üretildi:

| Görsel | Yöntem |
|---|---|
| 3D dünya (adalar, binalar, ağaçlar, şelaleler, balonlar, 3D Fındık) | Kodla prosedürel üretim — Three.js / React Three Fiber |
| Maskot Fındık, çocuk avatarları, sahne arka planları, logo, UI | Kodla çizilmiş SVG + CSS, Framer Motion animasyonları |
| Nesne/ikon görselleri (elma, kedi, sepet, kalpler…) | Microsoft Fluent Emoji 3D (MIT) — `public/assets/objects/` |
| Ses efektleri | Web Audio ile çalışma anında sentez |
| Sesli yönergeler | Tarayıcının Türkçe TTS sesi |

## Araç değerlendirmesi (1 = zayıf, 5 = güçlü)

| Araç | Görsel kalite | Kolaylık | Maliyet | Performans | Entegrasyon | Sürdürülebilirlik | Rol |
|---|---|---|---|---|---|---|---|
| **Three.js + R3F + Drei** | 4 | 4 | 5 (ücretsiz) | 4 | 5 | 5 | ✅ Ana 3D motor (kullanılıyor) |
| **Blender** | 5 | 2 | 5 (ücretsiz) | 4 (GLB optimize edilirse) | 5 (glTF) | 5 | ⭐ Sonraki adım: kahraman modeller |
| **Rive** | 5 | 3 | 4 (ücretsiz katman var) | 5 | 5 (`@rive-app/react-canvas`) | 4 | ⭐ Maskot/karakter animasyonları |
| **Figma** | 5 | 4 | 4 | — | 3 (token dışa aktarımı) | 5 | Ekran tasarımı & tasarım sistemi kaynağı |
| **Lottie** | 4 | 4 | 4 | 4 | 4 (`lottie-react`) | 4 | Küçük UI kutlamaları (isteğe bağlı) |
| **Spline** | 4 | 5 | 3 (ücretli dışa aktarım) | 2–3 (runtime ağır) | 3 | 3 | ❌ Önerilmez: tablet performansı ve kilitlenme riski |
| **Framer Motion** | 4 | 5 | 5 | 4 | 5 | 5 | ✅ UI + SVG rig animasyonu (kullanılıyor) |
| **Görsel üretim modelleri** | 4–5 | 4 | 2–4 (ücretli) | — | 3 | 3 | Konsept sanat, arka plan; lisans/tutarlılık kontrolü şart |

**Seçilen kombinasyon:** Three.js/R3F (dünya) + Framer Motion/SVG (karakter ve UI, şimdi) → **Rive** (karakterler, sonra) + **Blender → GLB** (kahraman binalar/karakterler, sonra) + **Figma** (tasarım kaynağı).

## İnsan tarafından üretilecek asset'ler için akış

### Blender → 3D model
1. Ölçek: 1 birim = 1 metre; bina ≈ 2 birim. Orijin tabanda.
2. Malzeme: Principled BSDF, tek renk veya ≤ 1024px doku, metalness 0.
3. Dışa aktar: glTF 2.0 Binary (`.glb`), +Y yukarı, uygulanmış dönüşümler.
4. Sıkıştır: `npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`
5. Koy: `public/assets/models/<ad>.glb`, `LICENSES.md`'ye kaydet.
6. Kullan: `useGLTF('/assets/models/<ad>.glb')` ile ilgili prosedürel bileşenin yerine geçir (ör. `parts/Buildings.tsx → BookHouse`).
7. Bütçe: bina ≤ 15k üçgen, karakter ≤ 20k.

### Rive → maskot
1. Rive'da Fındık'ı mevcut SVG'yi referans alarak kur (renk/oranlar `src/characters/Mascot.tsx`).
2. State machine adı `Fındık`, girdi: `pose` (number: 0 idle, 1 wave, 2 cheer, 3 think, 4 surprised, 5 sad, 6 clap, 7 jump, 8 walk, 9 run).
3. `public/assets/animations/findik.riv` → `npm i @rive-app/react-canvas` → `Mascot.tsx` içinde `.riv` varsa Rive'ı, yoksa SVG'yi göster.

### Ses
- Profesyonel seslendirme: `public/assets/sounds/voice/<anahtar>.mp3` (48 kHz, mono, -16 LUFS). `speech.ts` önce dosyayı dener.
- Müzik/SFX: yalnızca CC0 veya satın alınmış lisanslı; `LICENSES.md`'ye kaydet.

## Ücretsiz/açık kaynaklar (lisansı uygun)
- Microsoft Fluent Emoji (MIT) — kullanılıyor
- Kenney.nl asset paketleri (CC0) — 3D doğa/şehir parçaları için uygun
- Poly Pizza (CC0/CC-BY, her model ayrı kontrol)
- Google Fonts (OFL) — Baloo 2, Nunito
