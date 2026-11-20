# Yol Haritası

## ✅ Aşama 1–3 (ilk teslimat)
- Proje kurulumu: Vite 8 + React 19 + TypeScript + R3F 9 + Drei 10 + Framer Motion + Tailwind 4 + zustand
- 8 proje skill'i (`.claude/skills/`)
- Tasarım sistemi (`tokens.css`, şeker buton, ahşap tabela, krem kart), logo
- Maskot Fındık (10 poz) + kişiselleştirilebilir çocuk avatarı
- 3D ana dünya: 3 ada + kristal tepe + uzak adalar, 5 ders binası, şelaleler, nehirler, köprüler, bulutlar, balonlar, kuşlar, tavşanlar, yürüyen 3D Fındık, 3 gizli hazine sandığı, kamera girişi ve binaya yaklaşma, 3 kalite seviyesi
- Karşılama, sınıf seçimi (4 sınıf karakteri), Türkçe ve Matematik dünyaları (sınıfa göre filtreli 10+10 oyun kartı, kilitli "Yakında")
- Harf Avcısı ve Elma Toplama (uyarlanabilir, sesli, yeniden anlatım, açıklamalı çözüm)
- Görev tamamlandı ekranı, yıldız/altın/XP, günlük görevler, ebeveyn paneli (ebeveyn kapısı), ayarlar
- Uçtan uca test (`npm run smoke`) + birim testleri

## ✅ Aşama 4a — Ödül ve ekran süresi
- Hazine Odam: 20 rozet (öğrenmeye bağlı, bonus altın, kutlama), 48 çıkartmalık albüm (çocuk seçer; rastgele paket yok)
- Evcil dost ve arka planlar kazanılmış altınla sahiplenilir
- Ebeveyn: günlük süre sınırı, mola hatırlatıcısı (20-20-20), uyku saati; oyun ortasında kesmez, ek süre ebeveyn kapısıyla

## Aşama 4 — İlerleme ve profil (sıradaki)
- Yeni bölge açılımları (ders içi patika haritası)
- Ebeveyn paneli: haftalık özet, beceri bazlı öneri kartları
- Çoklu çocuk profili (aynı cihazda)
- Profesyonel Türkçe seslendirme dosyaları entegrasyonu

## Aşama 5 — Yeni oyunlar ve dersler
- Türkçe: Hece Birleştirme, Kelime Treni, Kayıp Harf (1. sınıf öncelikli)
- Matematik: Sayı Avcısı, Çıkarma Robotu, Saat ve Zaman, Problem Çözme Laboratuvarı
- Hayat Bilgisi (1–3), Fen Bilimleri (3–4), Keşif ve Tarih (4) dünyalarının açılması

## Altyapı
- NestJS + PostgreSQL backend (ebeveyn hesabı, cihazlar arası senkron) — KVKK aydınlatma, veli açık rızası, veri silme. `useGame` kalıcılık katmanı bir repository arayüzüne taşınacak.
- PWA / çevrimdışı mod, KTX2 doku sıkıştırma, Rive maskot, Blender kahraman modeller
- Three.js parçası 1.1 MB (gzip 320 KB): ağaç sallama için `three` alt-yol importları ve drei'den yalnızca gerekenler
