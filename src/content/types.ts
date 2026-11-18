export type Grade = 1 | 2 | 3 | 4

export type SubjectId = 'turkce' | 'matematik' | 'fen' | 'hayat' | 'tarih'

export type ContentStatus = 'taslak' | 'onayli'

export interface Subject {
  id: SubjectId
  name: string
  short: string
  tagline: string
  /** Bu ders oynanabilir mi? */
  available: boolean
  accent: string
  accentDark: string
  pastel: string
  icon: string
  /** MEB programında yer aldığı sınıflar (Hayat Bilgisi 1–3, Fen 3–4, Sosyal Bilgiler 4) */
  grades: Grade[]
}

export type Mechanic = 'choice' | 'bubbles' | 'train' | 'sort' | 'story' | 'apples'
export type Host = 'findik' | 'robo'

export interface GameMeta {
  id: string
  subject: SubjectId
  title: string
  /** Kart altındaki kısa açıklama */
  blurb: string
  icon: string
  grades: Grade[]
  /** Beceri anahtarı — akıllı öğrenme sistemi bunu izler */
  skill: string
  /** MEB öğrenme çıktısı kodları (docs/meb/ metinlerinden doğrulanmış). Sınıfa göre. */
  meb: Partial<Record<Grade, string[]>>
  /** Programdaki tema / öğrenme alanı (sınıfa göre) — ders ekranında gruplama için */
  theme: Partial<Record<Grade, string>> | string
  available: boolean
  tint: string
  mechanic: Mechanic
  backdrop: import('../components/Backdrop').BackdropKind
  host?: Host
  /** Tur başına soru sayısı */
  total?: number
  /** 1. sınıf ilk okuma yazma: bu harf öğrenilmeden açılmaz (kitaptaki sıra) */
  minLetter?: string
  /** Etkinlik başında gösterilen konu anlatımı (Öğrenelim) */
  lesson?: import('../games/quiz/types').Lesson
  /** Ders ekranında listelenmez (ör. Okuma Yazma Yolu durakları kendi haritasından açılır) */
  hidden?: boolean
  /** Tema değerlendirme: bu etkinliklerin üreticilerini karıştırır */
  mix?: string[]
  /** Sınıfa göre kısa yönerge (giriş ekranı) */
  intro?: Partial<Record<Grade, string>> | string
}

export interface GradeMeta {
  grade: Grade
  label: string
  world: string
  color: string
  colorDark: string
  icon: string
  avatar: import('../characters/avatarTypes').AvatarInput
}
