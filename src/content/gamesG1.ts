/**
 * 1. SINIF KATALOĞU — MEB 1. sınıf ders kitaplarının sırasıyla (docs/meb-kitaplar/analiz/*-1.md).
 * Tema adları kitaplardaki temalardır. Türkçe ilk okuma yazma etkinlikleri öğrenilen harfe göre açılır (minLetter).
 */
import type { GameMeta } from './types'
import { LESSONS_G1, lessonForDegerlendirme } from './lessonsG1'

type G = Omit<GameMeta, 'available' | 'grades'>
const T = (g: G): GameMeta => ({ available: true, total: 8, grades: [1], lesson: LESSONS_G1[g.id], ...g })

const IOY = (t: string) => `İlk Okuma Yazma · ${t}`

export const G1_TURKCE: GameMeta[] = [
  // ---- İlk Okuma Yazma (İOY Kitabı 1–2, Tema 1–4) ----
  T({ id: 'harf-avi', subject: 'turkce', title: 'Harf Avı', blurb: 'Sesi dinle, harfi yakala', icon: 'abc', mechanic: 'bubbles', backdrop: 'meadow', skill: 'turkce1.harf', tint: '#ffd9c7', theme: IOY('Sesler ve Harfler'), meb: { 1: ['T.D.1.2.a', 'T.D.1.3.b'] }, minLetter: 'e', intro: 'Fındık bir ses söyleyecek. O sesin harfini taşıyan baloncuğa dokun!' }),
  T({ id: 'sesi-bul', subject: 'turkce', title: 'Sesi Bul', blurb: 'Adında bu ses olan resim', icon: 'ear', mechanic: 'choice', backdrop: 'meadow', skill: 'turkce1.ses', tint: '#dcf1ff', theme: IOY('Sesler ve Harfler'), meb: { 1: ['T.D.1.1.a', 'T.D.1.2.d'] }, minLetter: 'l', intro: 'Sesi dinle. Adında o ses geçen resmi bul!' }),
  T({ id: 'buyuk-kucuk', subject: 'turkce', title: 'Büyük–Küçük Harf', blurb: 'Harfin eşini bul', icon: 'sparkles', mechanic: 'choice', backdrop: 'meadow', skill: 'turkce1.buyukkucuk', tint: '#eadfff', theme: IOY('Sesler ve Harfler'), meb: { 1: ['T.Y.1.3.b'] }, minLetter: 'e', intro: 'Küçük harfin büyüğünü, büyük harfin küçüğünü bul!' }),
  T({ id: 'hece-birlestir', subject: 'turkce', title: 'Hece Birleştir', blurb: 'Sesleri birleştir, hece yap', icon: 'link', mechanic: 'choice', backdrop: 'meadow', skill: 'turkce1.hece', tint: '#dcf5d0', theme: IOY('Heceler'), meb: { 1: ['T.O.1.1.a', 'T.Y.1.1.c'] }, minLetter: 't', intro: 'İki sesi art arda söyle: hangi hece oluşur?' }),
  T({ id: 'hece-treni', subject: 'turkce', title: 'Hece Treni', blurb: 'Hecelerden kelime kur', icon: 'train', mechanic: 'train', backdrop: 'meadow', skill: 'turkce1.kelime', tint: '#d7ecff', theme: IOY('Heceler'), meb: { 1: ['T.O.1.1.a', 'T.Y.1.1.c'] }, minLetter: 'l', intro: 'Resme bak ve hece vagonlarını doğru sıraya diz!' }),
  T({ id: 'kayip-harf', subject: 'turkce', title: 'Kayıp Harf', blurb: 'Eksik harfi tamamla', icon: 'puzzle', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.eksikharf', tint: '#ffe0ea', theme: IOY('Kelimeler'), meb: { 1: ['T.Y.1.2.b'] }, minLetter: 'l', intro: 'Kelimede bir harf kaybolmuş. Hangisi?' }),
  T({ id: 'resim-kelime', subject: 'turkce', title: 'Resim–Kelime', blurb: 'Oku ve resimle eşleştir', icon: 'palette', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.okuma', tint: '#fff4c2', theme: IOY('Kelimeler'), meb: { 1: ['T.O.1.1.a'] }, minLetter: 'l', intro: 'Resmin adını oku ve doğru kelimeyi seç!' }),
  T({ id: 'karisik-harf', subject: 'turkce', title: 'Karışık Harfler', blurb: 'Harfleri sırala, kelime yap', icon: 'magnifier', mechanic: 'train', backdrop: 'forest', skill: 'turkce1.yazim', tint: '#ffe3cc', theme: IOY('Kelimeler'), meb: { 1: ['T.Y.1.1.c'] }, minLetter: 'k', intro: 'Harfler karışmış! Doğru sıraya koy, resmin adını yaz.' }),
  T({ id: 'cumle-kur', subject: 'turkce', title: 'Cümle Kur', blurb: 'Kelimeleri sırala', icon: 'memo', mechanic: 'train', backdrop: 'forest', skill: 'turkce1.cumle', tint: '#d4f6f4', theme: IOY('Cümleler ve Metinler'), meb: { 1: ['T.Y.1.1.c', 'T.Y.1.3.d'] }, minLetter: 'o', intro: 'Kelimeleri doğru sıraya koy, anlamlı bir cümle kur!' }),
  T({ id: 'resimle-tamamla', subject: 'turkce', title: 'Resimle Tamamla', blurb: 'Boşluğa resmin adını koy', icon: 'paint', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.tamamla', tint: '#ffd9d4', theme: IOY('Cümleler ve Metinler'), meb: { 1: ['T.Y.1.2.b'] }, minLetter: 'o', intro: 'Resme bak, cümledeki boşluğa uyan kelimeyi seç!' }),
  T({ id: 'noktalama-1', subject: 'turkce', title: 'Noktalama', blurb: 'Nokta, virgül, soru, ünlem', icon: 'pencil', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.noktalama', tint: '#fff0d6', theme: IOY('Cümleler ve Metinler'), meb: { 1: ['T.Y.1.3.k', 'T.O.1.1.h'] }, minLetter: 'k', intro: 'Cümlenin sonuna hangi işaret gelir? Öğrendiğin işaretleri kullan!' }),
  T({ id: 'mini-metin', subject: 'turkce', title: 'Mini Metin', blurb: 'Oku: kim, ne, nerede?', icon: 'openbook', mechanic: 'story', backdrop: 'forest', skill: 'turkce1.anlama', tint: '#ffe3cc', total: 4, theme: IOY('Cümleler ve Metinler'), meb: { 1: ['T.O.1.3.a'] }, minLetter: 'k', intro: 'Kısa metni oku ya da dinle, sonra soruyu cevapla!' }),
  // ---- Türkçe Ders Kitabı (Tema 5–8) — tüm harfler öğrenildikten sonra ----
  T({ id: 'harf-hece-say', subject: 'turkce', title: 'Harf ve Hece Say', blurb: 'Kaç harf, kaç hece?', icon: 'numbers', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.hecesay', tint: '#dcf5d0', theme: '5. Tema · Yeteneklerimizi Keşfediyoruz', meb: { 1: ['T.Y.1.1.c'] }, minLetter: 'j' }),
  T({ id: 'bosluk-ac', subject: 'turkce', title: 'Boşlukları Aç', blurb: 'Bitişik kelimeleri ayır', icon: 'scissors', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.bosluk', tint: '#dcf1ff', theme: '6. Tema · Minik Kâşifler', meb: { 1: ['T.Y.1.3.ç'] }, minLetter: 'j' }),
  T({ id: 'olay-sirala', subject: 'turkce', title: 'Olay Sıralama', blurb: 'Ne önce, ne sonra oldu?', icon: 'calendar', mechanic: 'train', backdrop: 'forest', skill: 'turkce1.sira', tint: '#ffe0ea', theme: '7. Tema · Atalarımızın İzleri', meb: { 1: ['T.Y.1.2.e'] }, minLetter: 'j' }),
  T({ id: 'buyuk-harf', subject: 'turkce', title: 'Büyük Harf', blurb: 'Doğru yazımı seç', icon: 'crown', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.buyukharf', tint: '#fff4c2', theme: '7. Tema · Atalarımızın İzleri', meb: { 1: ['T.Y.1.3.d', 'T.Y.1.3.ı'] }, minLetter: 'j' }),
  T({ id: 'benzetme', subject: 'turkce', title: 'Benzetme', blurb: '… gibi', icon: 'sparkles', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.benzetme', tint: '#eadfff', theme: '7. Tema · Atalarımızın İzleri', meb: { 1: ['T.Y.1.2.h'] }, minLetter: 'j' }),
  T({ id: 'mi-mi', subject: 'turkce', title: 'mı, mi, mu, mü', blurb: 'Soru ekini seç', icon: 'bulb', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.soruek', tint: '#d4f6f4', theme: '8. Tema · Sorumluluklarımızın Farkındayız', meb: { 1: ['T.Y.1.3.j'] }, minLetter: 'j' }),
  T({ id: 'anlamsiz-cumle', subject: 'turkce', title: 'Anlamsız Cümle', blurb: 'Hangisi olamaz?', icon: 'detective', mechanic: 'choice', backdrop: 'forest', skill: 'turkce1.anlam', tint: '#ffe3cc', theme: '8. Tema · Sorumluluklarımızın Farkındayız', meb: { 1: ['T.O.1.3.a'] }, minLetter: 'j' }),
]

const MT = (n: number, t: string) => `${n}. Tema · ${t}`
const D = (n: number, t: string, ids: string[]): GameMeta =>
  T({ id: `m1-degerlendirme-${n}`, subject: 'matematik', title: `${n}. Tema Değerlendirme`, blurb: 'Temanın karışık soruları', icon: 'trophy', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: `mat1.tema${n}`, tint: '#fff4c2', total: 10, theme: MT(n, t), meb: {}, intro: `${n}. temada öğrendiklerimizi karışık sorularla deneyelim!`, mix: ids, lesson: lessonForDegerlendirme(n) })

export const G1_MATEMATIK: GameMeta[] = [
  // 1. Tema · Nesnelerin Geometrisi 1
  T({ id: 'm1-konum', subject: 'matematik', title: 'Konum Kaşifi', blurb: 'Altında mı, üstünde mi?', icon: 'compass', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.konum', tint: '#dcf1ff', theme: MT(1, 'Nesnelerin Geometrisi 1'), meb: { 1: ['MAT.1.3.1'] } }),
  T({ id: 'm1-yol', subject: 'matematik', title: 'Yol Bulmaca', blurb: 'Okları takip et', icon: 'map', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.yol', tint: '#dcf5d0', theme: MT(1, 'Nesnelerin Geometrisi 1'), meb: { 1: ['MAT.1.3.1'] } }),
  T({ id: 'm1-esini-bul', subject: 'matematik', title: 'Eşini Bul', blurb: 'Eş nesneler', icon: 'puzzle', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.es', tint: '#ffe0ea', theme: MT(1, 'Nesnelerin Geometrisi 1'), meb: { 1: ['MAT.1.3.2'] } }),
  D(1, 'Nesnelerin Geometrisi 1', ['m1-konum', 'm1-yol', 'm1-esini-bul']),
  // 2. Tema · Sayılar ve Nicelikler 1
  T({ id: 'm1-sayi-avcisi', subject: 'matematik', title: 'Sayı Avcısı', blurb: '0–20 say ve bul', icon: 'target', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.sayma', tint: '#ffe0ea', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.1'] } }),
  T({ id: 'm1-onluk-birlik', subject: 'matematik', title: 'Onluk ve Birlik', blurb: '10 birlik = 1 onluk', icon: 'abacus', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.onluk', tint: '#fff4c2', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.2'] } }),
  T({ id: 'm1-kacinci', subject: 'matematik', title: 'Kaçıncı?', blurb: 'Sıra sayıları', icon: 'medal', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.sira', tint: '#eadfff', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.3'] } }),
  T({ id: 'm1-cok-az', subject: 'matematik', title: 'Çok mu, Az mı?', blurb: 'Karşılaştır', icon: 'balance', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.karsilastir', tint: '#d4f6f4', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.4'] } }),
  T({ id: 'm1-ritmik', subject: 'matematik', title: 'Ritmik Sayma ve Örüntü', blurb: 'Kuralı bul', icon: 'numbers', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.ritmik', tint: '#dcf5d0', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.5', 'MAT.1.1.6'] } }),
  T({ id: 'm1-tahmin', subject: 'matematik', title: 'Tahmin Et', blurb: 'Saymadan tahmin', icon: 'bulb', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.tahmin', tint: '#ffe3cc', theme: MT(2, 'Sayılar ve Nicelikler 1'), meb: { 1: ['MAT.1.1.7'] } }),
  D(2, 'Sayılar ve Nicelikler 1', ['m1-sayi-avcisi', 'm1-onluk-birlik', 'm1-kacinci', 'm1-cok-az', 'm1-ritmik', 'm1-tahmin']),
  // 3. Tema · Sayılar ve Nicelikler 2 (ölçme)
  T({ id: 'm1-uzunluk', subject: 'matematik', title: 'Uzun mu, Kısa mı?', blurb: 'Uzunluk ölçme', icon: 'ruler', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.uzunluk', tint: '#dcf1ff', theme: MT(3, 'Sayılar ve Nicelikler 2'), meb: { 1: ['MAT.1.1.8'] } }),
  T({ id: 'm1-terazi', subject: 'matematik', title: 'Ağır mı, Hafif mi?', blurb: 'Eşit kollu terazi', icon: 'elephant', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.kutle', tint: '#ffe0ea', theme: MT(3, 'Sayılar ve Nicelikler 2'), meb: { 1: ['MAT.1.1.8'] } }),
  D(3, 'Sayılar ve Nicelikler 2', ['m1-uzunluk', 'm1-terazi']),
  // 4. Tema · İşlemlerden Cebirsel Düşünmeye (Elma Toplama da bu temada; games.ts)
  T({ id: 'm1-islem', subject: 'matematik', title: 'İşlem Robotu', blurb: 'Toplama ve çıkarma (20’ye kadar)', icon: 'robot', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.islem', tint: '#dcf1ff', theme: MT(4, 'İşlemlerden Cebirsel Düşünmeye'), meb: { 1: ['MAT.1.2.1', 'MAT.1.2.2'] } }),
  T({ id: 'm1-esitlik', subject: 'matematik', title: 'Denge Terazisi', blurb: 'Eşitlik ve kayıp sayı', icon: 'balance', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.esitlik', tint: '#eadfff', theme: MT(4, 'İşlemlerden Cebirsel Düşünmeye'), meb: { 1: ['MAT.1.2.3', 'MAT.1.2.4'] } }),
  T({ id: 'm1-problem', subject: 'matematik', title: 'Problem Çözme', blurb: 'Günlük hayat problemleri', icon: 'testtube', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.problem', tint: '#ffe3cc', theme: MT(4, 'İşlemlerden Cebirsel Düşünmeye'), meb: { 1: ['MAT.1.2.1'] } }),
  D(4, 'İşlemlerden Cebirsel Düşünmeye', ['m1-islem', 'm1-esitlik', 'm1-problem']),
  // 5. Tema · Paralarımız
  T({ id: 'm1-para', subject: 'matematik', title: 'Paralarımız', blurb: 'Lira ve alışveriş', icon: 'coin', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.para', tint: '#fff4c2', theme: MT(5, 'Sayılar ve Nicelikler 3'), meb: { 1: ['MAT.1.1.9'] } }),
  D(5, 'Sayılar ve Nicelikler 3', ['m1-para']),
  // 6. Tema · Nesnelerin Geometrisi 2
  T({ id: 'm1-sekiller', subject: 'matematik', title: 'Şekil Avcısı', blurb: 'Köşe, kenar, şekiller', icon: 'gem', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.sekil', tint: '#d4f6f4', theme: MT(6, 'Nesnelerin Geometrisi 2'), meb: { 1: ['MAT.1.3.3', 'MAT.1.3.4', 'MAT.1.3.5'] } }),
  D(6, 'Nesnelerin Geometrisi 2', ['m1-sekiller']),
  // 7. Tema · Veriye Dayalı Araştırma
  T({ id: 'm1-veri', subject: 'matematik', title: 'Grafik Okuyalım', blurb: 'Çetele ve nesne grafiği', icon: 'chart', mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat1.veri', tint: '#dcf5d0', theme: MT(7, 'Veriye Dayalı Araştırma'), meb: { 1: ['MAT.1.4.1'] } }),
  D(7, 'Veriye Dayalı Araştırma', ['m1-veri']),
]
