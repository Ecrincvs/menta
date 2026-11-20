/**
 * ETKİNLİK KATALOĞU — her etkinlik sınıfa, MEB öğrenme çıktısına ve program temasına bağlıdır.
 * Kodlar docs/meb/ altındaki resmî program metinlerinden alınmıştır (bkz. docs/CURRICULUM.md).
 * Bir etkinlik yalnızca `grades` içindeki sınıflara görünür; içerik sınıfa göre üretilir (src/content/generators).
 */
import type { GameMeta, Grade, SubjectId } from './types'
import { G1_MATEMATIK, G1_TURKCE } from './gamesG1'
import { LESSONS_G1 } from './lessonsG1'
import { OY_GAMES } from './okumaYazmaGames'
import { MY_GAMES } from './matYoluGames'

type G = Omit<GameMeta, 'available'> & { available?: boolean }
const A = (g: G): GameMeta => ({ available: true, total: 6, ...g })

const BASE: GameMeta[] = [
  // =========================== TÜRKÇE ===========================
  A({
    id: 'hece-treni-2', subject: 'turkce', title: 'Hece Treni', blurb: 'Heceleri sırala, kelimeyi kur', icon: 'train', grades: [2],
    mechanic: 'train', backdrop: 'meadow', skill: 'turkce.hece', tint: '#d7ecff',
    theme: { 1: 'İlk Okuma Yazma', 2: 'Yazma' }, meb: { 1: ['T.O.1.1.a', 'T.Y.1.1.c'], 2: ['T.Y.2.3.g'] },
    intro: 'Resme bak ve hece vagonlarını doğru sıraya diz. Tren kelimeyi taşısın!',
  }),
  A({
    id: 'okuma-hikayesi', subject: 'turkce', title: 'Okuma Hikâyesi', blurb: 'Oku, dinle, anla', icon: 'openbook', grades: [2, 3, 4],
    mechanic: 'story', backdrop: 'forest', skill: 'turkce.okuma.anlama', tint: '#ffe3cc', total: 5,
    theme: 'Okuma', meb: { 1: ['T.O.1.3.a'], 2: ['T.O.2.3.a', 'T.O.2.3.b'], 3: ['T.O.3.3.c'], 4: ['T.O.4.3.c'] },
    intro: { 1: 'Kısa metni dinle ve oku. Sonra soruyu cevapla!', 2: 'Metni oku: kim, ne, nerede? Sonra soruyu cevapla.', 3: 'Metni oku ve ana fikrini bul.', 4: 'Metni dikkatle oku; ana fikri ve ayrıntıları bul.' },
  }),
  A({
    id: 'kelime-hazinesi', subject: 'turkce', title: 'Kelime Hazinesi', blurb: 'Eş, zıt ve eş sesli kelimeler', icon: 'gem', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'forest', skill: 'turkce.kelime.anlam', tint: '#dcf1ff',
    theme: 'Söz Varlığı', meb: { 2: ['T.O.2.2.f'], 3: ['T.O.3.2.h'], 4: ['T.O.4.2.h'] },
    intro: { 2: 'Kelimelerin zıt anlamlısını bul!', 3: 'Eş anlamlı ve zıt anlamlı kelimeleri bul!', 4: 'Eş anlamlı, zıt anlamlı ve eş sesli kelimeleri ayırt et!' },
  }),
  A({
    id: 'noktalama', subject: 'turkce', title: 'Noktalama ve Yazım', blurb: 'Doğru işareti yerleştir', icon: 'memo', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'forest', skill: 'turkce.yazim.noktalama', tint: '#fff0d6',
    theme: 'Yazma', meb: { 1: ['T.Y.1.3.k', 'T.Y.1.3.d'], 2: ['T.Y.2.3.ğ', 'T.Y.2.3.f', 'T.Y.2.3.d'], 3: ['T.Y.3.3.g', 'T.Y.3.3.f'], 4: ['T.Y.4.3.e', 'T.Y.4.3.d'] },
    intro: 'Cümlenin sonuna hangi işaret gelmeli? Büyük harf nerede kullanılır? Doğrusunu seç!',
  }),
  A({
    id: 'deyim-atasozu', subject: 'turkce', title: 'Atasözü ve Deyim', blurb: 'Atalarımızın sözleri ne anlatıyor?', icon: 'scroll', grades: [3, 4],
    mechanic: 'choice', backdrop: 'forest', skill: 'turkce.deyim.atasozu', tint: '#eadfff',
    theme: { 3: 'Millî Kültürümüz', 4: 'Geçmişten Geleceğe Mirasımız' }, meb: { 3: ['T.K.3.2.m'], 4: ['T.K.4.2.o', 'T.K.4.2.ö'] },
    intro: 'Atasözünün ya da deyimin anlamını bul!',
  }),
  A({
    id: 'anlam-dedektifi', subject: 'turkce', title: 'Anlam Dedektifi', blurb: 'Gerçek mi, mecaz mı?', icon: 'magnifier', grades: [3, 4],
    mechanic: 'choice', backdrop: 'forest', skill: 'turkce.anlam.mecaz', tint: '#ffe0ea',
    theme: 'Sözcükte Anlam', meb: { 3: ['T.O.3.3.d'], 4: ['T.O.4.3.d', 'T.O.4.3.e'] },
    intro: 'Kelime gerçek anlamında mı kullanılmış, mecaz anlamında mı? İpuçlarını bul!',
  }),

  // =========================== MATEMATİK ===========================
  A({
    id: 'elma-toplama', subject: 'matematik', title: 'Elma Toplama', blurb: 'Elmaları sürükle, topla!', icon: 'apple', grades: [1, 2],
    mechanic: 'apples', backdrop: 'orchard', host: 'robo', skill: 'mat.toplama', tint: '#ffd9d4',
    theme: { 1: '4. Tema · İşlemlerden Cebirsel Düşünmeye', 2: 'İşlemlerden Cebirsel Düşünmeye' }, meb: { 1: ['MAT.1.2.1', 'MAT.1.2.2'], 2: ['MAT.2.2.1', 'MAT.2.2.2'] },
  }),
  A({
    id: 'sayi-dedektifi', subject: 'matematik', title: 'Sayı Dedektifi', blurb: 'Say, karşılaştır, örüntü bul', icon: 'detective', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.sayilar', tint: '#eadfff',
    theme: 'Sayılar ve Nicelikler',
    meb: { 1: ['MAT.1.1.2', 'MAT.1.1.4', 'MAT.1.1.5', 'MAT.1.1.6'], 2: ['MAT.2.1.2', 'MAT.2.1.3', 'MAT.2.1.4'], 3: ['MAT.3.1.2', 'MAT.3.1.3', 'MAT.3.1.5'], 4: ['MAT.4.1.2', 'MAT.4.1.3', 'MAT.4.1.5'] },
    intro: { 1: 'Nesneleri say, hangisi daha çok bul, sayı örüntüsünü tamamla!', 2: 'Onluk ve birlikleri bul, sayıları sırala!', 3: 'Basamakları çözümle, yuvarla, tek ve çifti ayır!', 4: 'Büyük sayıların basamak ve bölüklerini bul, yuvarla!' },
  }),
  A({
    id: 'islem-robotu', subject: 'matematik', title: 'İşlem Robotu', blurb: 'Toplama ve çıkarma görevleri', icon: 'robot', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.toplama.cikarma', tint: '#dcf1ff',
    theme: 'İşlemlerden Cebirsel Düşünmeye',
    meb: { 1: ['MAT.1.2.1', 'MAT.1.2.4'], 2: ['MAT.2.2.2', 'MAT.2.2.3'], 3: ['MAT.3.2.1', 'MAT.3.2.2'], 4: ['MAT.4.2.1', 'MAT.4.2.2'] },
    intro: { 1: "20'ye kadar toplama ve çıkarma yapalım!", 2: "100'e kadar eldeli toplama ve onluk bozarak çıkarma!", 3: 'Üç basamaklı sayılarla toplama ve çıkarma!', 4: 'Dört basamaklı sayılarla toplama ve çıkarma!' },
  }),
  A({
    id: 'carpma-yarisi', subject: 'matematik', title: 'Çarpma Yarışı', blurb: 'Çarp ve yarışı kazan', icon: 'racecar', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.carpma', tint: '#fff4c2',
    theme: 'İşlemlerden Cebirsel Düşünmeye', meb: { 2: ['MAT.2.2.4', 'MAT.2.2.5'], 3: ['MAT.3.2.3', 'MAT.3.2.4'], 4: ['MAT.4.2.4', 'MAT.4.2.5'] },
    intro: { 2: 'Çarpma, aynı sayıyı tekrar tekrar toplamaktır. Grupları say!', 3: 'Çarpım tablosu yarışı! 10’a kadar çarp.', 4: '10, 100 ve 1000 ile kısayoldan çarp!' },
  }),
  A({
    id: 'bolme-paylasma', subject: 'matematik', title: 'Bölme ile Paylaşma', blurb: 'Eşit paylaştır', icon: 'cupcake', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.bolme', tint: '#dcf5d0',
    theme: 'İşlemlerden Cebirsel Düşünmeye', meb: { 2: ['MAT.2.2.4', 'MAT.2.2.5'], 3: ['MAT.3.2.4'], 4: ['MAT.4.2.5'] },
    intro: { 2: 'Şekerleri arkadaşlara eşit paylaştır!', 3: 'Böl ve kalanı bul!', 4: 'Bölme yap; kalan her zaman bölenden küçüktür!' },
  }),
  A({
    id: 'geometri', subject: 'matematik', title: 'Geometri Dünyası', blurb: 'Şekiller, cisimler, açılar', icon: 'ruler', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.geometri', tint: '#d4f6f4',
    theme: 'Nesnelerin Geometrisi', meb: { 1: ['MAT.1.3.4', 'MAT.1.3.5'], 2: ['MAT.2.3.1', 'MAT.2.3.3'], 3: ['MAT.3.3.1', 'MAT.3.3.2'], 4: ['MAT.4.3.2', 'MAT.4.3.7'] },
    intro: { 1: 'Üçgen, kare, dikdörtgen ve çemberi tanı!', 2: 'Küp, küre, silindir… Cisimleri tanı!', 3: 'Şekilleri kenar sayılarına göre adlandır!', 4: 'Açıları dik, dar ve geniş diye ayır!' },
  }),
  A({
    id: 'saat-zaman', subject: 'matematik', title: 'Saat ve Zaman', blurb: 'Saati oku, zamanı hesapla', icon: 'clock', grades: [2, 3],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.zaman', tint: '#fff0d6',
    theme: 'Sayılar ve Nicelikler', meb: { 2: ['MAT.2.1.9'], 3: ['MAT.3.1.12', 'MAT.3.1.13'] },
    intro: { 2: 'Tam, yarım ve çeyrek saatleri oku!', 3: 'Analog ve dijital saatleri oku, dakikaları hesapla!' },
  }),
  A({
    id: 'kesirler', subject: 'matematik', title: 'Kesirler Mutfağı', blurb: 'Bütün, yarım, çeyrek ve kesirler', icon: 'pizza', grades: [2, 3, 4],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.kesir', tint: '#ffe3cc',
    theme: 'Sayılar ve Nicelikler', meb: { 2: ['MAT.2.1.7'], 3: ['MAT.3.1.9', 'MAT.3.1.10'], 4: ['MAT.4.1.7', 'MAT.4.1.9', 'MAT.4.1.10', 'MAT.4.1.11'] },
    intro: { 2: 'Bütün, yarım ve çeyreği bul!', 3: 'Birim kesirleri tanı!', 4: 'Denk kesirler, karşılaştırma ve kesirlerle toplama!' },
  }),
  A({
    id: 'para', subject: 'matematik', title: 'Paralarımız', blurb: 'Lira ve kuruşları tanı', icon: 'coin', grades: [2, 3],
    mechanic: 'choice', backdrop: 'park', host: 'robo', skill: 'mat.para', tint: '#fff4c2',
    theme: 'Sayılar ve Nicelikler', meb: { 1: ['MAT.1.1.9'], 2: ['MAT.2.1.8'], 3: ['MAT.3.1.16'] },
  }),
  A({
    id: 'olasilik', subject: 'matematik', title: 'Olasılık Oyunu', blurb: 'İmkânsız mı, olabilir mi, kesin mi?', icon: 'target', grades: [4],
    mechanic: 'sort', backdrop: 'park', host: 'robo', skill: 'mat.olasilik', tint: '#ffe0ea',
    theme: 'Olayların Olasılığı ve Veriye Dayalı Araştırma', meb: { 4: ['MAT.4.4.1'] },
    intro: 'Olayları imkânsız, olabilir ve kesin kutularına yerleştir!',
  }),

  // =========================== HAYAT BİLGİSİ ===========================
  A({
    id: 'trafik-guvenlik', subject: 'hayat', title: 'Güvenli Yollar', blurb: 'Trafik ve güvenlik kuralları', icon: 'trafficlight', grades: [1, 2, 3],
    mechanic: 'choice', backdrop: 'town', skill: 'hayat.guvenlik', tint: '#fff4c2', theme: 'Sağlığım ve Güvenliğim', meb: {},
  }),
  A({
    id: 'saglikli-yasam', subject: 'hayat', title: 'Sağlıklı Yaşam', blurb: 'Sağlıklı beslen, temiz kal', icon: 'broccoli', grades: [1, 2, 3],
    mechanic: 'sort', backdrop: 'town', skill: 'hayat.saglik', tint: '#dcf5d0', theme: 'Sağlığım ve Güvenliğim', meb: {},
  }),
  A({
    id: 'ulkem', subject: 'hayat', title: 'Güzel Ülkem', blurb: 'Bayrağımız, başkentimiz, bayramlarımız', icon: 'globe', grades: [1, 2, 3],
    mechanic: 'choice', backdrop: 'town', skill: 'hayat.ulkem', tint: '#ffe0ea', theme: 'Yaşadığım Yer ve Ülkem', meb: {},
  }),
  A({
    id: 'doga-cevre', subject: 'hayat', title: 'Doğa ve Çevre', blurb: 'Mevsimler, yönler, geri dönüşüm', icon: 'seedling', grades: [1, 2, 3],
    mechanic: 'choice', backdrop: 'town', skill: 'hayat.doga', tint: '#d4f6f4', theme: 'Doğa ve Çevre', meb: {},
  }),
  A({
    id: 'okul-aile', subject: 'hayat', title: 'Okulum ve Ailem', blurb: 'Kurallar, görgü, meslekler', icon: 'school', grades: [1, 2, 3],
    mechanic: 'choice', backdrop: 'town', skill: 'hayat.okul.aile', tint: '#fff0d6', theme: 'Ben ve Okulum · Ailem ve Toplum', meb: {},
  }),

  // =========================== FEN BİLİMLERİ ===========================
  A({
    id: 'canlilar', subject: 'fen', title: 'Canlılar Dünyası', blurb: 'Canlılar ve duyu organları', icon: 'butterfly', grades: [3, 4],
    mechanic: 'choice', backdrop: 'lab', skill: 'fen.canlilar', tint: '#dcf5d0', theme: { 3: 'Canlılar Dünyasına Yolculuk', 4: 'İnsan ve Çevre' }, meb: {},
  }),
  A({
    id: 'madde', subject: 'fen', title: 'Maddeyi Tanıyalım', blurb: 'Katı, sıvı, gaz ve değişim', icon: 'testtube', grades: [3, 4],
    mechanic: 'sort', backdrop: 'lab', skill: 'fen.madde', tint: '#d4f6f4', theme: { 3: 'Maddeyi Tanıyalım, Karıştırıp Ayıralım', 4: 'Maddenin Özellikleri' }, meb: {},
  }),
  A({
    id: 'kuvvet-miknatis', subject: 'fen', title: 'Kuvvet ve Mıknatıs', blurb: 'İtme, çekme, mıknatıs', icon: 'magnet', grades: [3, 4],
    mechanic: 'sort', backdrop: 'lab', skill: 'fen.kuvvet', tint: '#ffe0ea', theme: { 3: 'Hareketi Keşfediyorum', 4: 'Kuvvetin Etkileri' }, meb: {},
  }),
  A({
    id: 'elektrik', subject: 'fen', title: 'Elektrik Atölyesi', blurb: 'Güvenli elektrik ve devreler', icon: 'bulb', grades: [3, 4],
    mechanic: 'choice', backdrop: 'lab', skill: 'fen.elektrik', tint: '#fff4c2', theme: { 3: 'Yaşamımızı Kolaylaştıran Elektrik', 4: 'Basit Elektrik Devreleri' }, meb: {},
  }),
  A({
    id: 'dunyamiz', subject: 'fen', title: 'Dünyamız ve Besinler', blurb: 'Kayaçlar, Dünya, besinler', icon: 'earth', grades: [3, 4],
    mechanic: 'choice', backdrop: 'lab', skill: 'fen.dunya', tint: '#dcf1ff', theme: { 3: 'Yer Bilimciler İş Başında', 4: 'Yer Kabuğu ve Dünyamızın Hareketleri · Besinlerimiz' }, meb: {},
  }),

  // =========================== SOSYAL BİLGİLER (Keşif ve Tarih) ===========================
  A({
    id: 'harita-yon', subject: 'tarih', title: 'Harita Kaşifi', blurb: 'Yönler ve harita', icon: 'compass', grades: [4],
    mechanic: 'choice', backdrop: 'history', skill: 'sosyal.harita', tint: '#dcf1ff', theme: 'Evimiz Dünya', meb: { 4: ['SB.4.2.1'] },
  }),
  A({
    id: 'ekonomi', subject: 'tarih', title: 'Pazar Yeri', blurb: 'İstek mi, ihtiyaç mı?', icon: 'cart', grades: [4],
    mechanic: 'sort', backdrop: 'history', skill: 'sosyal.ekonomi', tint: '#dcf5d0', theme: 'Hayatımızdaki Ekonomi', meb: {},
  }),
  A({
    id: 'ortak-miras', subject: 'tarih', title: 'Zaman Yolculuğu', blurb: 'Millî Mücadele ve Cumhuriyet', icon: 'hourglass', grades: [4],
    mechanic: 'choice', backdrop: 'history', skill: 'sosyal.tarih', tint: '#ffe3cc', theme: 'Ortak Mirasımız · Yaşayan Demokrasimiz', meb: {},
  }),
  A({
    id: 'dijital-vatandas', subject: 'tarih', title: 'Dijital Kaşif', blurb: 'İnternette güvende kal', icon: 'laptop', grades: [4],
    mechanic: 'sort', backdrop: 'history', skill: 'sosyal.dijital', tint: '#eadfff', theme: 'Teknoloji ve Sosyal Bilimler', meb: {},
  }),
]

/** 1. sınıf: kitap sırasıyla; Okuma Hikâyesi 1. sınıfta tüm harfler öğrenildikten sonra (8. Tema) */
const G1_OKUMA: GameMeta = { ...BASE.find((x) => x.id === 'okuma-hikayesi')!, lesson: LESSONS_G1['okuma-hikayesi-1'], id: 'okuma-hikayesi-1', grades: [1], theme: '8. Tema · Sorumluluklarımızın Farkındayız', minLetter: 'j', meb: { 1: ['T.O.1.3.a'] } }

export const GAMES: GameMeta[] = [...G1_TURKCE, G1_OKUMA, ...G1_MATEMATIK, ...OY_GAMES, ...MY_GAMES, ...BASE]

export const gamesFor = (subject: SubjectId, grade: Grade) => GAMES.filter((g) => g.subject === subject && g.grades.includes(grade) && !g.hidden)

export const gameById = (id: string) => GAMES.find((g) => g.id === id)

export const themeFor = (g: GameMeta, grade: Grade) => (typeof g.theme === 'string' ? g.theme : (g.theme[grade] ?? ''))
export const introFor = (g: GameMeta, grade: Grade) => (typeof g.intro === 'string' ? g.intro : (g.intro?.[grade] ?? g.blurb))
