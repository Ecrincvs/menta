---
name: premium-ui-ux-designer
description: Minik Kaşifler arayüzü (ekranlar, butonlar, kartlar, HUD, ahşap tabelalar) tasarlarken veya gözden geçirirken kullan. Renk sistemi, tipografi, responsive tablet düzeni, dokunmatik hedefler. Use for any screen/UI component work or visual QA.
---

# Premium UI/UX Designer

Referans: `docs/reference/minik-kasifler-referans.png`. Tokenlar: `src/styles/tokens.css`. UI kiti: `src/components/ui/`.

## Görsel dil
- **Malzemeler**: krem kağıt kartlar (`--mk-cream`), ahşap tabela başlıklar (`WoodSign`), şeker gibi parlak butonlar (üstte parlama, altta 6px katı "kalınlık" gölgesi), her şey yuvarlak (radius ≥ 20px).
- **Derinlik**: her kart = alt kenar katı gölge (basılabilirlik) + yumuşak ortam gölgesi. Basınca `translateY(4px)` ve kalınlık azalır.
- **Renk**: turkuaz (ana), gök mavisi, canlı yeşil (onay/devam), sarı (yıldız/ödül), turuncu (geri/aksiyon), mor (matematik/sihir), pastel zeminler. Her dersin aksan rengi `src/content/subjects.ts` içinde.
- **Tipografi**: Başlıklar *Baloo 2* 800 (beyaz dolgu + koyu kontur + alt gölge = oyun logosu hissi), gövde *Nunito* 800. 1. sınıf metinleri ≥ 22px.

## Düzen kuralları
- Hedef cihaz: 10" tablet yatay (1180×820), sonra telefon yatay/dikey.
- Dokunma hedefi ≥ 64px (1–2. sınıf ≥ 80px), aralık ≥ 12px.
- Sabit konumlar: sol üst = turuncu geri butonu, üst orta = ahşap başlık, sağ üst = kalpler / HUD. Çocuk her ekranda aynı yere bakar.
- Ekranda tek birincil aksiyon (yeşil buton).
- `clamp()` ile akışkan ölçek; yatay kaydırma asla.

## İnceleme soruları (her ekran)
Profesyonel mi? İlgi çekici mi? Karakter tutarlı mı? Okuma bilmeyen çocuk anlayabilir mi? Tablette güzel mi?
→ `npm run shots` ile ekran görüntüleri al (`screenshots/`) ve gerçekten bak.
