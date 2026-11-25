/**
 * KİTAP YOLLARI KAYDI — sınıf + ders başına bir "yol" (kitabın temaları/öğrenme alanları = adalar).
 * Her adada sıralı etkinlikler + sonda oyunlar. Etkinlik kimliği: `<önek>-<ada>-<tür>`.
 * 1. sınıfın yolları (okuma-yazma, matematik-yolu, hayat-yolu) kendi ekranlarıyla ayrıca durur.
 */
import type { GameMeta, Grade, SubjectId } from './types'
import type { Alan } from './generators/yolKit'
import type { BackdropKind } from '../components/Backdrop'
import { TR1_ADALAR } from './generators/trYolu1'
import { TR2_ADALAR } from './generators/trYolu2'
import { MAT2_ADALAR } from './generators/matYolu2'
import { HB2_ADALAR } from './generators/hbYolu2'
import { TR3_ADALAR } from './generators/trYolu3'
import { MAT3_ADALAR } from './generators/matYolu3'
import { HB3_ADALAR } from './generators/hbYolu3'
import { FEN3_ADALAR } from './generators/fenYolu3'

export interface Yol {
  id: string
  sinif: Grade
  ders: SubjectId
  baslik: string
  aciklama: string
  icon: string
  renk: string
  koyu: string
  backdrop: BackdropKind
  /** "Tema" / "Öğrenme Alanı" */
  birim: string
  host: 'findik' | 'robo'
  onek: string
  adalar: Alan[]
  bitis: string
}

export const YOLLAR: Yol[] = [
  // ---------------------------------------------------------------- 1. sınıf (Türkçe ders kitabı 5–8. temalar; okuma-yazma ve diğer 1. sınıf yolları kendi ekranlarında)
  { id: 'tr1', sinif: 1, ders: 'turkce', baslik: 'Türkçe Temaları Yolu', aciklama: 'Okuma yazmayı öğrendikten sonra: kitabın 5–8. temaları. Dinle, oku, konuş, yaz. Bol etkinlik ve oyun!', icon: 'openbook', renk: '#f0504a', koyu: '#b8302c', backdrop: 'forest', birim: 'Tema', host: 'findik', onek: 'ty1', adalar: TR1_ADALAR, bitis: 'Harikasın! Bütün Türkçe tema adalarını tamamladın!' },
  {
    id: 'tr2',
    sinif: 2,
    ders: 'turkce',
    baslik: 'Türkçe Yolu',
    aciklama: 'Kitaptaki temalar, metin metin: okuma, sözcükler, yazım ve noktalama. Bol etkinlik ve oyun!',
    icon: 'openbook',
    renk: '#f0504a',
    koyu: '#b8302c',
    backdrop: 'forest',
    birim: 'Tema',
    host: 'findik',
    onek: 'tr2',
    adalar: TR2_ADALAR,
    bitis: 'Harikasın! Bütün Türkçe adalarını tamamladın!',
  },
  {
    id: 'mat2',
    sinif: 2,
    ders: 'matematik',
    baslik: 'Matematik Yolu',
    aciklama: 'Kitaptaki temalar adım adım: 100’e kadar sayılar, toplama–çıkarma, çarpma, ölçme, zaman, para, şekiller, veri.',
    icon: 'abacus',
    renk: '#9b6ef3',
    koyu: '#6b43c4',
    backdrop: 'park',
    birim: 'Tema',
    host: 'robo',
    onek: 'my2',
    adalar: MAT2_ADALAR,
    bitis: 'Muhteşem! Bütün matematik adalarını tamamladın!',
  },
  {
    id: 'hb2',
    sinif: 2,
    ders: 'hayat',
    baslik: 'Hayat Bilgisi Yolu',
    aciklama: 'Kitaptaki öğrenme alanları konu konu: okulum, sağlığım, ailem, ülkem, doğa, bilim ve sanat.',
    icon: 'housegarden',
    renk: '#f08a24',
    koyu: '#b85f0c',
    backdrop: 'town',
    birim: 'Öğrenme Alanı',
    host: 'findik',
    onek: 'hb2',
    adalar: HB2_ADALAR,
    bitis: 'Harikasın! Bütün Hayat Bilgisi adalarını tamamladın!',
  },
  // ---------------------------------------------------------------- 3. sınıf
  { id: 'tr3', sinif: 3, ders: 'turkce', baslik: 'Türkçe Yolu', aciklama: 'Kitaptaki temalar metin metin: okuma, söz varlığı, yazım ve noktalama. Bol etkinlik ve oyun!', icon: 'openbook', renk: '#f0504a', koyu: '#b8302c', backdrop: 'forest', birim: 'Tema', host: 'findik', onek: 'tr3', adalar: TR3_ADALAR, bitis: 'Harikasın! Bütün Türkçe adalarını tamamladın!' },
  { id: 'mat3', sinif: 3, ders: 'matematik', baslik: 'Matematik Yolu', aciklama: 'Kitaptaki temalar adım adım: 1000’e kadar sayılar, dört işlem, kesirler, ölçme, geometri, veri.', icon: 'abacus', renk: '#9b6ef3', koyu: '#6b43c4', backdrop: 'park', birim: 'Tema', host: 'robo', onek: 'my3', adalar: MAT3_ADALAR, bitis: 'Muhteşem! Bütün matematik adalarını tamamladın!' },
  { id: 'fen3', sinif: 3, ders: 'fen', baslik: 'Fen Bilimleri Yolu', aciklama: 'Kitaptaki üniteler: gözlem, deney ve modellerle keşfet! Bol etkinlik ve oyun.', icon: 'microscope', renk: '#2ec4c9', koyu: '#149aa0', backdrop: 'lab', birim: 'Ünite', host: 'robo', onek: 'fen3', adalar: FEN3_ADALAR, bitis: 'Süpersin! Bütün fen adalarını keşfettin!' },
  { id: 'hb3', sinif: 3, ders: 'hayat', baslik: 'Hayat Bilgisi Yolu', aciklama: 'Kitaptaki öğrenme alanları konu konu. Bol etkinlik ve oyun!', icon: 'housegarden', renk: '#f08a24', koyu: '#b85f0c', backdrop: 'town', birim: 'Öğrenme Alanı', host: 'findik', onek: 'hb3', adalar: HB3_ADALAR, bitis: 'Harikasın! Bütün Hayat Bilgisi adalarını tamamladın!' },
]

export const yolBul = (id: string) => YOLLAR.find((y) => y.id === id)
export const yolFor = (ders: SubjectId, sinif: Grade | null) => YOLLAR.find((y) => y.ders === ders && y.sinif === sinif && y.adalar.length > 0)

const TINT: Partial<Record<SubjectId, string>> = { turkce: '#ffe9e4', matematik: '#efe6ff', hayat: '#fff1dc', fen: '#dcf7f6' }

/** Tüm yol etkinlikleri (ders ekranında gizli; kendi haritalarından açılır) */
export const YOL_GAMES: GameMeta[] = YOLLAR.flatMap((y) =>
  y.adalar.flatMap((t) =>
    t.acts.map(
      (a): GameMeta => ({
        id: `${y.onek}-${t.id}-${a.kind}`,
        subject: y.ders,
        title: a.title,
        blurb: `${t.no}. ${y.birim} · ${t.title}`,
        icon: a.icon,
        grades: [y.sinif],
        skill: `${y.onek}.${t.id}`,
        meb: { [y.sinif]: [a.meb] },
        theme: `${t.no}. ${y.birim} · ${t.title}`,
        available: true,
        hidden: true,
        tint: TINT[y.ders] ?? '#fff6e0',
        mechanic: 'choice',
        backdrop: y.backdrop,
        host: y.host,
        total: a.total,
        lesson: { text: a.ders, points: a.points, visual: a.visual },
      }),
    ),
  ),
)

/** Bir adanın etkinlikleri (sırayla) ve oyunları */
export function adaOyunlari(yolId: string, adaId: string) {
  const y = yolBul(yolId)!
  const t = y.adalar.find((x) => x.id === adaId)!
  const pre = `${y.onek}-${adaId}-`
  const all = YOL_GAMES.filter((g) => g.id.startsWith(pre))
  const games = t.acts.filter((a) => a.oyun).map((a) => `${pre}${a.kind}`)
  return { tema: t, acts: all.filter((g) => !games.includes(g.id)), games: all.filter((g) => games.includes(g.id)) }
}

/** üretici kaydı için: [id, gen] çiftleri */
export const yolUreticileri = () => YOLLAR.flatMap((y) => y.adalar.flatMap((t) => t.acts.map((a) => [`${y.onek}-${t.id}-${a.kind}`, a.gen] as const)))
