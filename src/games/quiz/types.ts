/** Ortak oyun motorunun soru modeli (tüm dersler, tüm sınıflar) */

export type ShapeKind = 'ucgen' | 'kare' | 'dikdortgen' | 'cember' | 'daire' | 'besgen' | 'altigen' | 'sekizgen'
export type SolidKind = 'kup' | 'kure' | 'silindir' | 'kare-prizma' | 'dikdortgen-prizma' | 'ucgen-prizma'

export type Visual =
  | { kind: 'image'; img: string; size?: number }
  | { kind: 'images'; imgs: string[] }
  | { kind: 'objects'; img: string; count: number }
  | { kind: 'compare'; left: { img: string; count: number }; right: { img: string; count: number } }
  | { kind: 'groups'; img: string; groups: number; per: number }
  | { kind: 'share'; img: string; total: number; plates: number }
  | { kind: 'clock'; h: number; m: number }
  | { kind: 'digital'; h: number; m: number }
  | { kind: 'fraction'; n: number; d: number; shape: 'pie' | 'bar' }
  | { kind: 'shape'; shape: ShapeKind; color?: string; scale?: number }
  /** konum: özne, referans nesneye göre nerede (MAT.1.3.1) */
  | { kind: 'position'; subject: string; ref: string; rel: Relation; third?: string }
  /** kareli zemin + ok yönergesi (MAT.1.3.1) */
  | { kind: 'grid'; cols: number; rows: number; start: [number, number]; items: { img: string; at: [number, number] }[]; path?: [number, number][] }
  /** sıra: dizideki nesneler, biri vurgulu (MAT.1.1.3) */
  | { kind: 'row'; imgs: string[]; highlight?: number; arrow?: 'ltr' | 'rtl' }
  /** uzunluk çubukları (MAT.1.1.8) */
  | { kind: 'lengths'; items: { color: string; len: number; label?: string }[]; unit?: { img: string; count: number[] } }
  /** eşit kollu terazi (MAT.1.1.8, MAT.1.2.3) */
  | { kind: 'balance'; left: { img?: string; text?: string; count?: number }; right: { img?: string; text?: string; count?: number }; tilt: -1 | 0 | 1 }
  /** resim/şekil örüntüsü, '?' boşluk */
  | { kind: 'pattern'; items: (string | null)[] }
  /** nesne grafiği (MAT.1.4.1) */
  | { kind: 'pictograph'; rows: { label: string; img: string; count: number }[] }
  /** çetele tablosu (MAT.1.4.1) */
  | { kind: 'tally'; rows: { label: string; img?: string; count: number }[] }
  /** alt alta işlem */
  | { kind: 'column'; a: number; b: number; op: '+' | '−' }
  | { kind: 'solid'; solid: SolidKind }
  | { kind: 'angle'; deg: number }
  | { kind: 'blocks'; hundreds: number; tens: number; ones: number }
  | { kind: 'money'; items: number[] } // TL kâğıt (≥1) veya kuruş (<1 → 0.25 vb.)
  | { kind: 'word'; img?: string; word: string; hide: number[] }
  | { kind: 'sequence'; items: (number | string)[] }
  | { kind: 'equation'; text: string }

export type Relation = 'ustunde' | 'altinda' | 'icinde' | 'disinda' | 'onunde' | 'arkasinda' | 'saginda' | 'solunda' | 'yaninda' | 'arasinda'

export interface Option {
  label?: string
  img?: string
  visual?: Visual
}

interface Base {
  prompt: string
  /** seslendirilecek metin (yoksa prompt) */
  spoken?: string
  explain: string
  hint?: string
}

export interface ChoiceQ extends Base {
  type: 'choice'
  visual?: Visual
  options: Option[]
  answer: number
  layout?: 'tiles' | 'bubbles' | 'wide'
  /** okuma metni (Okuma Hikâyesi) */
  passage?: { title: string; text: string; img?: string }
}

export interface OrderQ extends Base {
  type: 'order'
  img?: string
  /** doğru sıra */
  pieces: string[]
  /** çeldirici parçalar */
  extra?: string[]
  /** parçalar arası birleştirici: hece için '', kelime için ' ' */
  joiner: string
  /** görsel tema */
  style?: 'train' | 'chain'
}

export interface SortQ extends Base {
  type: 'sort'
  bins: { id: string; label: string; img?: string; color: string }[]
  items: { label: string; img?: string; bin: string }[]
}

/** Eşleştirme: sol sütundaki her öğeyi sağdaki eşiyle eşleştir */
export interface MatchQ extends Base {
  type: 'match'
  pairs: { left: Option; right: Option }[]
}

/** Soru–cevap: çocuk cevabı kendisi üretir (sayı tuş takımı ya da harf klavyesi) */
export interface InputQ extends Base {
  type: 'input'
  visual?: Visual
  answer: string
  /** 'digits' = 0–9; dizi = gösterilecek harf tuşları */
  keys: 'digits' | string[]
  /** cevabın yanında görünen birim (ör. "TL", "tane") */
  unit?: string
}

/** Hafıza oyunu: kartları çevir, eşleri bul */
export interface MemoryQ extends Base {
  type: 'memory'
  pairs: { a: Option; b: Option }[]
}

/** Harfi yaz: parmakla iz sürme (T.Y.1.3.b) */
export interface TraceQ extends Base {
  type: 'trace'
  letter: string
}

export type Question = ChoiceQ | OrderQ | SortQ | MatchQ | InputQ | MemoryQ | TraceQ

/** Etkinlik başındaki kısa konu anlatımı (kitaptaki ÖĞRENELİM kutusu gibi) */
export interface Lesson {
  text: string
  points?: string[]
  visual?: Visual
}
