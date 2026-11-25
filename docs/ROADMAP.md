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

## ✅ Aşama 4b — 1. sınıf kitap yolları
- Okuma Yazma Yolu (29 harf adası), Matematik Yolu (7 tema adası)
- Hayat Bilgisi Yolu: kitabın 6 öğrenme alanı ve 23 konusu (HB.1.1.1–HB.1.6.3), 91 etkinlik + 12 alan sonu oyunu; analiz `docs/meb-kitaplar/analiz/hayat-bilgisi-1.md`
- Ada ekranları ortak (`src/screens/YolScreen.tsx`); balonlar kelime ve simge gösterebiliyor

## ✅ Aşama 4c — 2. sınıf kitap yolları
- Türkçe Yolu: 8 tema, 105 etkinlik + 16 oyun (özgün okuma metinleri, noktalama, büyük harf, zıt anlam, hece, kısaltma, bağlaçlar, kelime avı)
- Matematik Yolu: 6 tema, 62 etkinlik + 12 oyun (kitap sınırları testlerle korunur: sayılar ≤ 100, çarpım ≤ 50, kalansız bölme ≤ 20)
- Hayat Bilgisi Yolu: 6 öğrenme alanı, 102 etkinlik + 12 oyun
- Ortak kayıt src/content/yollar.ts + yolKit; menüden sınıf seçimi

## ✅ Aşama 4d — 3. sınıf kitap yolları
- Türkçe Yolu (8 tema), Matematik Yolu (6 tema, 80 etkinlik), Fen Bilimleri Yolu (8 ünite, 103 etkinlik), Hayat Bilgisi Yolu (6 alan, 93 etkinlik); her adada 2 oyun
- Yeni etkinlik türü **Model Kur** (src/games/quiz/ModelView.tsx, modeller.tsx): kitaptaki modeller (duyu organları, Güneş-Dünya-Ay, kelebek, fosil, katı-sıvı-gaz, itme-çekme, toprak kavanozu, bitkinin ihtiyaçları, yaşam alanları)
- Analizler: docs/meb-kitaplar/analiz/*-3.md

## ✅ Aşama 5 — Yarışma Modu (Kahoot tarzı)
- Modlar: Canlı Yarışma (karakter rakipler ya da kodla arkadaşlar), Takım Savaşı ve Düello (aynı ekranda bölünmüş), Sınıf Modu (öğretmen yönetir, ebeveyn/öğretmen kapısı), Turnuvalar (çeyrek–yarı–final, ilerleme kaydedilir), Hızlı Yarış
- Lobi (oyun kodu + QR), hazır → soru (4 renkli + şekilli buton, geri sayım, sesli okuma) → cevap (açıklama, dağılım) → canlı podyum → sonuç (yıldız/XP/altın, öğrenilen konular, yanlışlarımı çalış, tekrar yarış)
- Puan: doğru 500 + hız en çok 300 + seri bonusu; yanlışta eksi yok
- Sınıf ağı: `npm run sinif` (WebSocket, okul içi; sohbet yok, takma ad temizlenir, öğretmen çıkarabilir/kilitleyebilir)
- Kategoriler: Matematik, Türkçe, Fen (3–4), Hayat Bilgisi (1–3), Mantık, Genel Kültür (İngilizce sonra)
- Sıradaki: internet üzerinden oynama (barındırma, onayla), öğretmen hazır soru seti yazma

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
