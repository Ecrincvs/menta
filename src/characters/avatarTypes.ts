/**
 * KARAKTER ÖZELLEŞTİRME — veri modeli ve katalog.
 * Kişisel veri değildir: yalnızca avatarın görünüşü (KVKK: takma ad + avatar + sınıf).
 * "Karakter tipi" yalnızca saç/kıyafet listelerinin sırasını değiştirir; hiçbir parça kilitlenmez.
 */

export type Look = 'kiz' | 'erkek' | 'karma'
export type Height = 'minik' | 'orta' | 'uzun'
export type Expression = 'gulumseme' | 'kahkaha' | 'mutlu' | 'kirpma' | 'saskin' | 'utangac' | 'havali'
export type FaceDetail = 'yok' | 'cil' | 'kalp' | 'yildiz' | 'yarabandi' | 'allik'
export type HairStyle =
  | 'dalgali' | 'atkuyrugu' | 'orgulu' | 'topuz' | 'kakul' | 'uzunKivircik'
  | 'kasif' | 'kisa' | 'dagnik' | 'kivircik' | 'yanayatik'
export type Slot = 'bas' | 'kulak' | 'goz' | 'boyun' | 'sirt' | 'bilek'
export type TopKind = 'ceket' | 'hoodie' | 'tisort' | 'yelek' | 'onluk' | 'uzay' | 'pelerin' | 'mont' | 'forma' | 'polo'
export type BottomKind = 'pantolon' | 'sort' | 'etek' | 'tulum' | 'esofman' | 'uzay'
export type ShoeKind = 'spor' | 'bot'
export type Collection = 'gunluk' | 'okul' | 'spor' | 'macera' | 'bilim' | 'uzay' | 'fantastik' | 'mevsim'

export interface AvatarConfig {
  /** Hazır raster kaşif (ör. "kasif-pembe"); null → kendi tasarladığı (SVG) kaşif */
  preset: string | null
  look: Look
  height: Height
  skin: string
  expression: Expression
  eye: string
  detail: FaceDetail
  hair: HairStyle
  hairColor: string
  top: string
  bottom: string
  shoes: string
  acc: Partial<Record<Slot, string>>
  pet: string
  traits: string[]
  bg: string
}

/** Eski kayıtlar ve hazır ayarlar için gevşek giriş (outfit/accessory eski alanlar) */
export type AvatarInput = Partial<Omit<AvatarConfig, 'hair'>> & { hair?: string; outfit?: string; accessory?: string }

// ───────── temel seçenekler
export const LOOKS: { id: Look; label: string; icon: string; color: string }[] = [
  { id: 'kiz', label: 'Kız', icon: '♀', color: '#ff5d9e' },
  { id: 'erkek', label: 'Erkek', icon: '♂', color: '#3e9bff' },
  { id: 'karma', label: 'Fark etmez', icon: '★', color: '#9b8cc4' },
]
export const HEIGHTS: { id: Height; label: string; legs: number }[] = [
  { id: 'minik', label: 'Minik', legs: 32 },
  { id: 'orta', label: 'Orta', legs: 42 },
  { id: 'uzun', label: 'Uzun', legs: 54 },
]
export const SKIN_TONES = ['#ffe3cf', '#ffd2b4', '#f6c7a1', '#e2a77e', '#b97a52', '#8a5636']
export const EYE_COLORS: { c: string; label: string }[] = [
  { c: '#6b3d1c', label: 'Kahverengi' },
  { c: '#9a7430', label: 'Ela' },
  { c: '#3f9a3a', label: 'Yeşil' },
  { c: '#2f8fd8', label: 'Mavi' },
  { c: '#8b4fd0', label: 'Mor' },
  { c: '#7d8794', label: 'Gri' },
]
export const EXPRESSIONS: { id: Expression; label: string }[] = [
  { id: 'gulumseme', label: 'Gülümseme' },
  { id: 'kahkaha', label: 'Kahkaha' },
  { id: 'mutlu', label: 'Mutlu' },
  { id: 'kirpma', label: 'Göz kırpma' },
  { id: 'saskin', label: 'Şaşkın' },
  { id: 'utangac', label: 'Utangaç' },
  { id: 'havali', label: 'Havalı' },
]
export const FACE_DETAILS: { id: FaceDetail; label: string }[] = [
  { id: 'yok', label: 'Yok' },
  { id: 'cil', label: 'Çiller' },
  { id: 'allik', label: 'Pembe yanak' },
  { id: 'kalp', label: 'Kalp' },
  { id: 'yildiz', label: 'Yıldız' },
  { id: 'yarabandi', label: 'Yara bandı' },
]
export const HAIR_STYLES: { id: HairStyle; label: string; look: 'kiz' | 'erkek' }[] = [
  { id: 'dalgali', label: 'Uzun dalgalı', look: 'kiz' },
  { id: 'atkuyrugu', label: 'At kuyruğu', look: 'kiz' },
  { id: 'orgulu', label: 'Örgülü', look: 'kiz' },
  { id: 'topuz', label: 'İki topuz', look: 'kiz' },
  { id: 'kakul', label: 'Kâküllü', look: 'kiz' },
  { id: 'uzunKivircik', label: 'Uzun kıvırcık', look: 'kiz' },
  { id: 'kisa', label: 'Kısa', look: 'erkek' },
  { id: 'dagnik', label: 'Dağınık', look: 'erkek' },
  { id: 'kivircik', label: 'Kıvırcık', look: 'erkek' },
  { id: 'yanayatik', label: 'Yana taralı', look: 'erkek' },
]
export const HAIR_COLORS: { c: string; label: string }[] = [
  { c: '#5a3417', label: 'Kahverengi' },
  { c: '#2d1b10', label: 'Koyu' },
  { c: '#e0b05c', label: 'Sarı' },
  { c: '#c4512c', label: 'Kızıl' },
  { c: '#1b1a22', label: 'Siyah' },
  { c: '#ff8cc0', label: 'Pembe' },
  { c: '#4a9df0', label: 'Mavi' },
  { c: '#8e6cf0', label: 'Mor' },
  { c: '#2bb5a8', label: 'Turkuaz' },
]

// ───────── kıyafet koleksiyonu
export const COLLECTIONS: { id: Collection; label: string }[] = [
  { id: 'gunluk', label: 'Günlük' },
  { id: 'okul', label: 'Okul' },
  { id: 'spor', label: 'Spor' },
  { id: 'macera', label: 'Macera' },
  { id: 'bilim', label: 'Bilim' },
  { id: 'uzay', label: 'Uzay' },
  { id: 'fantastik', label: 'Fantastik' },
  { id: 'mevsim', label: 'Mevsimsel' },
]
export interface TopItem { id: string; label: string; kind: TopKind; color: string; accent: string; inner: string; col: Collection; cost: number }
export interface BottomItem { id: string; label: string; kind: BottomKind; color: string; accent: string; col: Collection; cost: number }
export interface ShoeItem { id: string; label: string; kind: ShoeKind; color: string; accent: string; col: Collection; cost: number }

export const TOPS: TopItem[] = [
  { id: 'ceket-pembe', label: 'Pembe ceket', kind: 'ceket', color: '#f27fb2', accent: '#ffd3e6', inner: '#ffffff', col: 'gunluk', cost: 0 },
  { id: 'ceket-lacivert', label: 'Lacivert ceket', kind: 'ceket', color: '#2f4f8f', accent: '#ffffff', inner: '#ffffff', col: 'gunluk', cost: 0 },
  { id: 'hoodie-mor', label: 'Mor kapüşonlu', kind: 'hoodie', color: '#8e6cf0', accent: '#c9b8ff', inner: '#ffffff', col: 'gunluk', cost: 0 },
  { id: 'tisort-turuncu', label: 'Turuncu tişört', kind: 'tisort', color: '#ff9a2e', accent: '#ffd28a', inner: '#ff9a2e', col: 'gunluk', cost: 0 },
  { id: 'polo-okul', label: 'Okul forması', kind: 'polo', color: '#3e7bd6', accent: '#ffffff', inner: '#3e7bd6', col: 'okul', cost: 0 },
  { id: 'yelek-okul', label: 'Okul yeleği', kind: 'yelek', color: '#2a3f6e', accent: '#e8463c', inner: '#ffffff', col: 'okul', cost: 0 },
  { id: 'forma-kirmizi', label: 'Kırmızı forma', kind: 'forma', color: '#e8463c', accent: '#ffffff', inner: '#e8463c', col: 'spor', cost: 0 },
  { id: 'hoodie-yesil', label: 'Yeşil eşofman', kind: 'hoodie', color: '#4fb33a', accent: '#ffffff', inner: '#ffffff', col: 'spor', cost: 4 },
  { id: 'ceket-kasif', label: 'Kaşif ceketi', kind: 'ceket', color: '#f2a92e', accent: '#ffe2a6', inner: '#ffffff', col: 'macera', cost: 0 },
  { id: 'yelek-macera', label: 'Macera yeleği', kind: 'yelek', color: '#8a6a3c', accent: '#d9b77a', inner: '#e9f4ff', col: 'macera', cost: 6 },
  { id: 'onluk', label: 'Bilim önlüğü', kind: 'onluk', color: '#f7f9ff', accent: '#2ec4c9', inner: '#2ec4c9', col: 'bilim', cost: 8 },
  { id: 'uzay', label: 'Astronot kıyafeti', kind: 'uzay', color: '#eef2fa', accent: '#ff8a3d', inner: '#eef2fa', col: 'uzay', cost: 15 },
  { id: 'pelerin-mor', label: 'Sihirli pelerin', kind: 'pelerin', color: '#6b43c4', accent: '#ffd23f', inner: '#b89cff', col: 'fantastik', cost: 20 },
  { id: 'pelerin-kirmizi', label: 'Kahraman pelerini', kind: 'pelerin', color: '#e8463c', accent: '#ffd23f', inner: '#3e7bd6', col: 'fantastik', cost: 25 },
  { id: 'mont-mavi', label: 'Kış montu', kind: 'mont', color: '#5ab8f5', accent: '#ffffff', inner: '#ffffff', col: 'mevsim', cost: 10 },
  { id: 'tisort-sari', label: 'Yaz tişörtü', kind: 'tisort', color: '#ffd23f', accent: '#ff9a2e', inner: '#ffd23f', col: 'mevsim', cost: 0 },
]
export const BOTTOMS: BottomItem[] = [
  { id: 'pantolon-bej', label: 'Bej pantolon', kind: 'pantolon', color: '#c9ad85', accent: '#e8d6b6', col: 'gunluk', cost: 0 },
  { id: 'sort-kot', label: 'Kot şort', kind: 'sort', color: '#4f78b8', accent: '#86a7da', col: 'gunluk', cost: 0 },
  { id: 'etek-kot', label: 'Kot etek', kind: 'etek', color: '#4f78b8', accent: '#86a7da', col: 'gunluk', cost: 0 },
  { id: 'tulum-kot', label: 'Kot tulum', kind: 'tulum', color: '#4f78b8', accent: '#86a7da', col: 'gunluk', cost: 0 },
  { id: 'pantolon-lacivert', label: 'Okul pantolonu', kind: 'pantolon', color: '#2a3f6e', accent: '#4a6296', col: 'okul', cost: 0 },
  { id: 'etek-okul', label: 'Okul eteği', kind: 'etek', color: '#2a3f6e', accent: '#e8463c', col: 'okul', cost: 0 },
  { id: 'esofman', label: 'Eşofman altı', kind: 'esofman', color: '#3a3f4f', accent: '#ffffff', col: 'spor', cost: 0 },
  { id: 'sort-pembe', label: 'Pembe şort', kind: 'sort', color: '#f27fb2', accent: '#ffd3e6', col: 'spor', cost: 3 },
  { id: 'sort-kargo', label: 'Kargo şort', kind: 'sort', color: '#7d7448', accent: '#a69b67', col: 'macera', cost: 0 },
  { id: 'pantolon-kargo', label: 'Kargo pantolon', kind: 'pantolon', color: '#7d7448', accent: '#a69b67', col: 'macera', cost: 5 },
  { id: 'uzay-alt', label: 'Astronot pantolonu', kind: 'uzay', color: '#eef2fa', accent: '#ff8a3d', col: 'uzay', cost: 15 },
  { id: 'etek-sihir', label: 'Yıldızlı etek', kind: 'etek', color: '#8e6cf0', accent: '#ffd23f', col: 'fantastik', cost: 12 },
]
export const SHOES: ShoeItem[] = [
  { id: 'spor-beyaz', label: 'Beyaz spor ayakkabı', kind: 'spor', color: '#ffffff', accent: '#f27fb2', col: 'gunluk', cost: 0 },
  { id: 'spor-lacivert', label: 'Lacivert spor ayakkabı', kind: 'spor', color: '#2f4f8f', accent: '#ffffff', col: 'gunluk', cost: 0 },
  { id: 'spor-kirmizi', label: 'Kırmızı spor ayakkabı', kind: 'spor', color: '#e8463c', accent: '#ffffff', col: 'spor', cost: 0 },
  { id: 'bot-kahve', label: 'Kaşif botu', kind: 'bot', color: '#8a5a2e', accent: '#e2a945', col: 'macera', cost: 0 },
  { id: 'bot-beyaz', label: 'Uzay botu', kind: 'bot', color: '#eef2fa', accent: '#ff8a3d', col: 'uzay', cost: 10 },
  { id: 'bot-pembe', label: 'Yağmur botu', kind: 'bot', color: '#ff8cc0', accent: '#ffd3e6', col: 'mevsim', cost: 4 },
]

// ───────── aksesuarlar (her yuvadan bir tane)
export interface AccItem { id: string; label: string; slot: Slot; cost: number }
export const ACCESSORIES: AccItem[] = [
  { id: 'kasifGozlugu', label: 'Kaşif gözlüğü', slot: 'bas', cost: 0 },
  { id: 'kulaklik', label: 'Kulaklık', slot: 'kulak', cost: 0 },
  { id: 'kep', label: 'Kep', slot: 'bas', cost: 0 },
  { id: 'gozluk', label: 'Gözlük', slot: 'goz', cost: 0 },
  { id: 'atki', label: 'Atkı', slot: 'boyun', cost: 0 },
  { id: 'canta', label: 'Sırt çantası', slot: 'sirt', cost: 0 },
  { id: 'saat', label: 'Kol saati', slot: 'bilek', cost: 3 },
  { id: 'kolye', label: 'Kolye', slot: 'boyun', cost: 4 },
  { id: 'toka', label: 'Çiçek toka', slot: 'bas', cost: 0 },
  { id: 'sapka', label: 'Kaşif şapkası', slot: 'bas', cost: 6 },
  { id: 'bere', label: 'Ponponlu bere', slot: 'bas', cost: 8 },
  { id: 'gunesGozlugu', label: 'Güneş gözlüğü', slot: 'goz', cost: 10 },
  { id: 'tac', label: 'Yıldız taç', slot: 'bas', cost: 24 },
]

// ───────── evcil dost, özel özellik, arka plan
/** cost: altın (yalnızca oyunla kazanılmış altın; bir kez alınır) */
export const PETS: { id: string; label: string; cost: number }[] = [
  { id: 'yok', label: 'Yok', cost: 0 },
  { id: 'kopek', label: 'Köpek', cost: 0 },
  { id: 'kedi', label: 'Kedi', cost: 0 },
  { id: 'tavsan', label: 'Tavşan', cost: 0 },
  { id: 'civciv', label: 'Civciv', cost: 0 },
  { id: 'tilki', label: 'Tilki', cost: 60 },
  { id: 'kaplumbaga', label: 'Kaplumbağa', cost: 80 },
  { id: 'panda', label: 'Panda', cost: 120 },
  { id: 'ejderha', label: 'Minik ejderha', cost: 200 },
]

/** Hazır kaşifler (Pixar kalitesinde raster, public/assets/art/characters/<id>.webp) */
export const PRESETS: { id: string; label: string; look: 'kiz' | 'erkek' }[] = [
  { id: 'kasif-pembe', label: 'Maceracı', look: 'kiz' },
  { id: 'kasif-mor', label: 'Neşeli', look: 'kiz' },
  { id: 'kasif-lacivert', label: 'Gezgin', look: 'erkek' },
  { id: 'kasif-bilim', label: 'Bilim İnsanı', look: 'kiz' },
  { id: 'kasif-okul', label: 'Çalışkan', look: 'erkek' },
  { id: 'kasif-sporcu', label: 'Sporcu', look: 'kiz' },
  { id: 'kasif-doga', label: 'Doğa Kaşifi', look: 'erkek' },
  { id: 'kasif-kis', label: 'Kış Kaşifi', look: 'kiz' },
  { id: 'kasif-uzay', label: 'Astronot', look: 'erkek' },
]
export const TRAITS: { id: string; label: string; icon: string }[] = [
  { id: 'kitap', label: 'Kitap Kurdu', icon: 'books' },
  { id: 'bilim', label: 'Bilim Meraklısı', icon: 'testtube' },
  { id: 'spor', label: 'Sporcu', icon: 'ball' },
  { id: 'sanat', label: 'Sanatçı', icon: 'palette' },
  { id: 'kasif', label: 'Kaşif', icon: 'compass' },
  { id: 'doga', label: 'Doğa Dostu', icon: 'seedling' },
  { id: 'teknoloji', label: 'Teknoloji Sever', icon: 'laptop' },
  { id: 'muzik', label: 'Müziksever', icon: 'headphone' },
]
export const MAX_TRAITS = 3
export const BACKGROUNDS: { id: string; label: string; cost: number }[] = [
  { id: 'glade', label: 'Orman açıklığı', cost: 0 },
  { id: 'meadow', label: 'Çiçekli çayır', cost: 0 },
  { id: 'park', label: 'Park', cost: 0 },
  { id: 'forest', label: 'Büyülü orman', cost: 0 },
  { id: 'orchard', label: 'Meyve bahçesi', cost: 40 },
  { id: 'lab', label: 'Bilim laboratuvarı', cost: 60 },
  { id: 'town', label: 'Kasaba', cost: 80 },
  { id: 'history', label: 'Tarih diyarı', cost: 120 },
]

export const DEFAULT_AVATAR: AvatarConfig = {
  preset: 'kasif-lacivert',
  look: 'karma',
  height: 'orta',
  skin: '#f6c7a1',
  expression: 'gulumseme',
  eye: '#6b3d1c',
  detail: 'yok',
  hair: 'kasif',
  hairColor: '#5a3417',
  top: 'ceket-kasif',
  bottom: 'sort-kot',
  shoes: 'bot-kahve',
  acc: { bas: 'kasifGozlugu', sirt: 'canta' },
  pet: 'yok',
  traits: [],
  bg: 'glade',
}

const OLD_OUTFIT: Record<string, string> = {
  '#ff9a2e': 'ceket-kasif', '#2ec4c9': 'onluk', '#9b6ef3': 'hoodie-mor', '#5bc236': 'hoodie-yesil',
  '#f0504a': 'forma-kirmizi', '#ff7aa8': 'ceket-pembe', '#5ab8f5': 'mont-mavi',
}
const HAIR_IDS = new Set(HAIR_STYLES.map((h) => h.id))

/** Eski kayıtları ve eksik alanları tamamlar (kalıcı depodaki eski avatarlar bozulmasın) */
export function normalizeAvatar(a: AvatarInput | undefined): AvatarConfig {
  const x = a ?? {}
  let acc: AvatarConfig['acc'] = { ...(x.acc ?? DEFAULT_AVATAR.acc) }
  if (!x.acc && x.accessory !== undefined) {
    // eski tek aksesuar alanı → yuvalı yapı
    const it = ACCESSORIES.find((i) => i.id === x.accessory)
    acc = it ? { [it.slot]: it.id } : {}
  }
  const hair = (x.hair && HAIR_IDS.has(x.hair as HairStyle) ? x.hair : DEFAULT_AVATAR.hair) as HairStyle
  return {
    ...DEFAULT_AVATAR,
    ...x,
    hair,
    top: x.top ?? (x.outfit ? OLD_OUTFIT[x.outfit] ?? DEFAULT_AVATAR.top : DEFAULT_AVATAR.top),
    acc,
    traits: x.traits ?? [],
    // yalnızca hazır kaşifler var: eksik/boş kayıt → varsayılan kaşif
    preset: x.preset && PRESETS.some((p) => p.id === x.preset) ? x.preset : DEFAULT_AVATAR.preset,
  } as AvatarConfig
}

export const topById = (id: string) => TOPS.find((t) => t.id === id) ?? TOPS[0]
export const bottomById = (id: string) => BOTTOMS.find((t) => t.id === id) ?? BOTTOMS[0]
export const shoeById = (id: string) => SHOES.find((t) => t.id === id) ?? SHOES[0]

