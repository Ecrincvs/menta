/**
 * ÇIKARTMA ALBÜMÜ — kazanılmış altınla, çocuğun KENDİ SEÇTİĞİ çıkartma alınır.
 * Bilinçli karar: rastgele paket / sürpriz kutu YOK (çocuklar için şans mekaniği uygun değil).
 * Görseller: public/assets/objects (Fluent Emoji 3D, MIT) → yeni görsel üretimi gerekmez.
 */
export interface Sticker {
  id: string
  label: string
}
export interface StickerPage {
  id: string
  title: string
  color: string
  price: number
  items: Sticker[]
}

const s = (id: string, label: string): Sticker => ({ id, label })

export const STICKER_PAGES: StickerPage[] = [
  { id: 'hayvan', title: 'Sevimli Hayvanlar', color: '#ff9a2e', price: 15, items: [s('dog', 'Köpek'), s('cat', 'Kedi'), s('rabbit', 'Tavşan'), s('fox', 'Tilki'), s('owl', 'Baykuş'), s('turtle', 'Kaplumbağa'), s('lion', 'Aslan'), s('elephant', 'Fil')] },
  { id: 'doga', title: 'Doğa', color: '#5bc236', price: 20, items: [s('tree', 'Ağaç'), s('sunflower', 'Ayçiçeği'), s('tulip', 'Lale'), s('mushroom', 'Mantar'), s('butterfly', 'Kelebek'), s('ladybug', 'Uğur böceği'), s('rainbow', 'Gökkuşağı'), s('leaf', 'Yaprak')] },
  { id: 'lezzet', title: 'Lezzetler', color: '#ff7aa8', price: 25, items: [s('apple', 'Elma'), s('strawberry', 'Çilek'), s('watermelon', 'Karpuz'), s('cake', 'Pasta'), s('icecream', 'Dondurma'), s('cupcake', 'Kek'), s('pizza', 'Pizza'), s('donut', 'Halka tatlı')] },
  { id: 'deniz', title: 'Deniz Dünyası', color: '#2ec4c9', price: 30, items: [s('whale', 'Balina'), s('fish', 'Balık'), s('fish2', 'Tropik balık'), s('octopus', 'Ahtapot'), s('crab', 'Yengeç'), s('penguin', 'Penguen'), s('wave', 'Dalga'), s('ship', 'Gemi')] },
  { id: 'tasit', title: 'Taşıtlar', color: '#3e7bd6', price: 35, items: [s('bus', 'Otobüs'), s('train', 'Tren'), s('airplane', 'Uçak'), s('bicycle', 'Bisiklet'), s('racecar', 'Yarış arabası'), s('firetruck', 'İtfaiye'), s('ambulance', 'Ambulans'), s('truck', 'Kamyon')] },
  { id: 'uzay', title: 'Uzay Macerası', color: '#8e6cf0', price: 40, items: [s('rocket', 'Roket'), s('moon', 'Ay'), s('earth', 'Dünya'), s('sun', 'Güneş'), s('telescope', 'Teleskop'), s('glowstar', 'Parlayan yıldız'), s('robot', 'Robot'), s('volcano', 'Yanardağ')] },
]

export const stickerOwnedKey = (id: string) => `st:${id}`
