/**
 * Harf Avcısı kelime bankası.
 * Her kelime somut ve resimlenebilir; `img` = public/assets/objects/<img>.png
 * Ses grupları MEB ilk okuma-yazma sırasıdır (bkz. educational-content-designer skill).
 */
export interface WordItem {
  word: string
  img: string
}

/** MEB Türkiye Yüzyılı Maarif Modeli Türkçe programı, Şekil 1 (docs/meb/turkce-1-4.txt) */
export const SOUND_GROUPS: string[][] = [
  ['a', 'n', 'e', 't', 'i', 'l'],
  ['o', 'k', 'u', 'r', 'ı', 'm'],
  ['ü', 's', 'ö', 'y', 'd', 'z'],
  ['ç', 'b', 'g', 'c', 'ş'],
  ['p', 'h', 'v', 'ğ', 'f', 'j'],
]

export const WORDS: WordItem[] = [
  { word: 'elma', img: 'apple' },
  { word: 'ev', img: 'house' },
  { word: 'ekmek', img: 'bread' },
  { word: 'eldiven', img: 'gloves' },
  { word: 'limon', img: 'lemon' },
  { word: 'lale', img: 'tulip' },
  { word: 'arı', img: 'bee' },
  { word: 'ayı', img: 'bear' },
  { word: 'araba', img: 'car' },
  { word: 'ağaç', img: 'tree' },
  { word: 'kedi', img: 'cat' },
  { word: 'kitap', img: 'book' },
  { word: 'kuş', img: 'bird' },
  { word: 'kalem', img: 'pencil' },
  { word: 'köpek', img: 'dog' },
  { word: 'kaplumbağa', img: 'turtle' },
  { word: 'inek', img: 'cow' },
  { word: 'otobüs', img: 'bus' },
  { word: 'okul', img: 'school' },
  { word: 'muz', img: 'banana' },
  { word: 'mantar', img: 'mushroom' },
  { word: 'maymun', img: 'monkey' },
  { word: 'uçak', img: 'airplane' },
  { word: 'uğur böceği', img: 'ladybug' },
  { word: 'top', img: 'ball' },
  { word: 'tavşan', img: 'rabbit' },
  { word: 'tren', img: 'train' },
  { word: 'üzüm', img: 'grapes' },
  { word: 'yıldız', img: 'star' },
  { word: 'yumurta', img: 'egg' },
  { word: 'roket', img: 'rocket' },
  { word: 'domates', img: 'tomato' },
  { word: 'dondurma', img: 'icecream' },
  { word: 'dinozor', img: 'dino' },
  { word: 'saat', img: 'clock' },
  { word: 'salyangoz', img: 'snail' },
  { word: 'balık', img: 'fish' },
  { word: 'balon', img: 'balloon' },
  { word: 'bal', img: 'honey' },
  { word: 'zürafa', img: 'giraffe' },
  { word: 'zebra', img: 'zebra' },
  { word: 'çilek', img: 'strawberry' },
  { word: 'çiçek', img: 'flower' },
  { word: 'çanta', img: 'backpack' },
  { word: 'güneş', img: 'sun' },
  { word: 'gemi', img: 'ship' },
  { word: 'gözlük', img: 'glasses' },
  { word: 'şemsiye', img: 'umbrella' },
  { word: 'civciv', img: 'chick' },
  { word: 'peynir', img: 'cheese' },
  { word: 'pasta', img: 'cake' },
  { word: 'penguen', img: 'penguin' },
  { word: 'havuç', img: 'carrot' },
  { word: 'horoz', img: 'rooster' },
  { word: 'fil', img: 'elephant' },
  { word: 'fare', img: 'mouse' },
  { word: 'portakal', img: 'orange' },
  { word: 'aslan', img: 'lion' },
  { word: 'baykuş', img: 'owl' },
  { word: 'ördek', img: 'duck' },
  { word: 'at', img: 'horse' },
  { word: 'el', img: 'hand' },
  { word: 'mum', img: 'candle' },
  { word: 'ay', img: 'moon' },
  { word: 'süt', img: 'milk' },
  { word: 'kurbağa', img: 'frog' },
]

export const firstLetter = (w: string) => w[0]
export const lastLetter = (w: string) => w.replace(/\s/g, '').slice(-1)

export const VOWELS = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']

/** Görsel/işitsel olarak karıştırılan harf çiftleri — zor seviyede çeldirici olarak kullanılır */
export const CONFUSABLE: Record<string, string[]> = {
  b: ['d', 'p'], d: ['b', 't'], p: ['b', 'r'], m: ['n'], n: ['m', 'u'], u: ['ü', 'n'], ü: ['u'],
  o: ['ö', 'a'], ö: ['o'], ı: ['i'], i: ['ı', 'l'], s: ['ş', 'z'], ş: ['s'], c: ['ç'], ç: ['c'],
  g: ['ğ', 'k'], k: ['g'], t: ['d'], e: ['a'], a: ['e', 'o'], l: ['i'], z: ['s'], y: ['ğ'], h: ['k'],
  f: ['v'], v: ['f'], r: ['l'],
}

export const upperTR = (s: string) => s.toLocaleUpperCase('tr-TR')
