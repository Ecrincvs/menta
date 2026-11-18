---
name: painterly-illustrator
description: Koddan (SVG/CSS) çizilen sahne arka planlarını, ağaçları, bitkileri ve karakterleri boyanmış/hacimli göstermek için teknikler. src/components/Backdrop.tsx, src/characters/*. Use when drawing or improving SVG scenery or characters to look less flat.
---

# Painterly Illustrator (SVG)

## Hacim: 3 ton + vurgu
Her nesne en az: **gölge tonu** (alt-sol, %70 opaklık), **ana ton**, **ışık tonu** (üst-sağ, ışık kaynağı yönünde kaydırılmış), **parlama/rim** (ince açık kenar). Düz tek renk dolgu yasak.

## Derinlik planları (Backdrop)
| Plan | Teknik |
|---|---|
| Gökyüzü | dikey gradyan + güneş radial glow + ışın huzmeleri (blur'lu üçgenler, mix-blend screen) |
| Uzak | düşük doygunluk, maviye kaydırılmış renk, `feGaussianBlur` 2–4 |
| Orta | tam renk, 3 ton ağaçlar, patika (perspektifle daralan) |
| Ön | koyu, kontrastlı çimen tutamları, çiçek, mantar, taş |
| Çerçeve | köşelerde büyük koyu yaprak kümeleri, blur 1–2 (alan derinliği) |
| Atmosfer | bokeh daireleri, toz zerreleri (HTML katmanı, CSS anim), radial vinyet |

## Kurallar
- Prosedürel ama **tohumlu** üretim (aynı sahne her açılışta aynı) — `src/learning/rng.ts`.
- Filtreli büyük katmanlar animasyonsuz kalır (tek seferlik rasterize); hareketli öğeler ayrı katmanda.
- Gradyan id'leri çakışmasın: `useId()` ile önekle.
- Çocuk ekranında karakter/okunurluk önce: arka plan, ön plan UI'ın arkasında %10–15 daha düşük kontrastlı olabilir.
- Karakterler: kafa ve gövde radial gradyan (ışık sağ-üst), göz: koyu iris gradyanı + 2 beyaz parlama, yanaklarda pembe, gövde altında yumuşak AO gölgesi.
