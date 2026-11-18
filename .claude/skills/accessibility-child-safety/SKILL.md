---
name: accessibility-child-safety
description: Erişilebilirlik (sesli yönerge, ekran okuyucu, dokunmatik hedef, azaltılmış hareket) ve çocuk güvenliği / KVKK / ebeveyn kontrolü konularında kullan. Use for a11y review, voice guidance, parental gate, data privacy decisions.
---

# Accessibility & Child Safety

## Sesli rehberlik
- `src/audio/speech.ts`: Web Speech API, `tr-TR` sesi. Ses yoksa sessizce geçer (çökme yok). Her soru balonunda 🔊 butonu; ekran açılınca yönerge otomatik okunur (ayarlardan kapatılabilir).
- İleride: profesyonel seslendirme MP3'leri `public/assets/sounds/voice/` — `speak()` önce kayıt dosyasını dener, yoksa TTS.

## Erişilebilirlik
- Her etkileşimli öğe `button` + Türkçe `aria-label`. Sürükle-bırakın dokun-seç alternatifi var.
- Kontrast: metin ≥ 4.5:1 (krem zemin üzerinde koyu kahve `--mk-ink`).
- `prefers-reduced-motion` ve ayarlardaki "Sakin mod".
- Renk tek başına bilgi taşımaz (doğru = yeşil + ✓ + ses).

## Çocuk güvenliği (değişmez kurallar)
- Reklam, herkese açık sohbet, sosyal paylaşım, dış bağlantı YOK.
- Kişisel veri minimum: takma ad + avatar + sınıf. Gerçek ad soyad, e-posta, konum, fotoğraf istenmez. Şu an tüm veriler cihazda (localStorage).
- Ebeveyn paneli **ebeveyn kapısı** arkasında (rastgele çarpma sorusu — okuma bilen yetişkin için).
- Uygulama içi satın alma yok. Dış linkler ebeveyn kapısından geçer.
- Backend geldiğinde: KVKK aydınlatma metni, veli açık rızası, veri silme hakkı, şifreli aktarım, analitikte kimliksizleştirme.
