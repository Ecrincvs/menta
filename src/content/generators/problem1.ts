/**
 * 1. SINIF PROBLEM ÇÖZME (MAT.1.2.1) — günlük yaşam bağlamında toplama/çıkarma, 20'ye kadar.
 * Kitaptaki akış: durumu anla → artma mı azalma mı? → işlemi kur → sonucu bul → kontrol et.
 * Bağlamlar özgündür; sayılar her seferinde yeniden üretilir.
 */
import { pick, randInt, type Rng } from '../../learning/rng'
import { choice, input, numChoice, type Gen } from './helpers'
import { WEB_PROBLEMS } from '../webBank'

interface Ctx {
  img: string
  /** toplama: a, b → metin */
  add?: (n: string, a: number, b: number) => string
  /** çıkarma */
  sub?: (n: string, a: number, b: number) => string
  unit: string
}
const NAMES = ['Ayşe', 'Ali', 'Zeynep', 'Mert', 'Elif', 'Can', 'Defne', 'Ege', 'Nil', 'Okan', 'Ela', 'Utku']
const CTX: Ctx[] = [
  { img: 'apple', unit: 'elma', add: (n, a, b) => `${n} bahçeden ${a} elma topladı. Sonra ${b} elma daha topladı. ${n} toplam kaç elma topladı?`, sub: (n, a, b) => `${n}'in sepetinde ${a} elma vardı. ${b} tanesini arkadaşlarına verdi. Sepette kaç elma kaldı?` },
  { img: 'balloon', unit: 'balon', add: (_n, a, b) => `Doğum gününde ${a} kırmızı ve ${b} mavi balon şişirdik. Toplam kaç balon şişirdik?`, sub: (n, a, b) => `${n}'in ${a} balonu vardı. ${b} balon patladı. Kaç balonu kaldı?` },
  { img: 'pencil', unit: 'kalem', add: (n, a, b) => `${n}'in kalem kutusunda ${a} kalem var. Babası ${b} kalem daha aldı. Kutuda kaç kalem oldu?`, sub: (n, a, b) => `${n}'in ${a} kalemi vardı. ${b} kalemini kardeşine verdi. Kaç kalemi kaldı?` },
  { img: 'duck', unit: 'ördek', add: (_n, a, b) => `Gölde ${a} ördek yüzüyordu. ${b} ördek daha geldi. Gölde kaç ördek oldu?`, sub: (_n, a, b) => `Gölde ${a} ördek yüzüyordu. ${b} ördek uçup gitti. Gölde kaç ördek kaldı?` },
  { img: 'book', unit: 'kitap', add: (n, a, b) => `${n} geçen hafta ${a} kitap, bu hafta ${b} kitap okudu. Toplam kaç kitap okudu?`, sub: (_n, a, b) => `Raftaki ${a} kitaptan ${b} tanesini okumak için aldık. Rafta kaç kitap kaldı?` },
  { img: 'cookie', unit: 'kurabiye', add: (_n, a, b) => `Annem ${a} kurabiye pişirdi. Ablam da ${b} kurabiye pişirdi. Toplam kaç kurabiye oldu?`, sub: (_n, a, b) => `Tabakta ${a} kurabiye vardı. Biz ${b} tanesini yedik. Tabakta kaç kurabiye kaldı?` },
  { img: 'chick', unit: 'civciv', add: (_n, a, b) => `Kümeste ${a} civciv vardı. ${b} civciv daha yumurtadan çıktı. Kaç civciv oldu?`, sub: (_n, a, b) => `Bahçede ${a} civciv vardı. ${b} tanesi kümese girdi. Bahçede kaç civciv kaldı?` },
  { img: 'ball', unit: 'top', add: (_n, a, b) => `Spor salonunda ${a} sarı ve ${b} turuncu top var. Salonda kaç top var?`, sub: (_n, a, b) => `Dolapta ${a} top vardı. Teneffüste ${b} tanesini bahçeye çıkardık. Dolapta kaç top kaldı?` },
  { img: 'flower', unit: 'çiçek', add: (n, a, b) => `${n} vazoya ${a} papatya ve ${b} gül koydu. Vazoda kaç çiçek var?`, sub: (_n, a, b) => `Bahçede ${a} çiçek açmıştı. ${b} tanesi soldu. Kaç çiçek açık kaldı?` },
  { img: 'bus', unit: 'yolcu', add: (_n, a, b) => `Otobüste ${a} yolcu vardı. Durakta ${b} yolcu bindi. Otobüste kaç yolcu oldu?`, sub: (_n, a, b) => `Otobüste ${a} yolcu vardı. Durakta ${b} yolcu indi. Otobüste kaç yolcu kaldı?` },
  { img: 'fish', unit: 'balık', add: (_n, a, b) => `Akvaryumda ${a} balık vardı. ${b} balık daha koyduk. Akvaryumda kaç balık oldu?` },
  { img: 'strawberry', unit: 'çilek', add: (n, a, b) => `${n} sabah ${a}, öğlen ${b} çilek yedi. Toplam kaç çilek yedi?`, sub: (_n, a, b) => `Kasede ${a} çilek vardı. ${b} çilek yendi. Kasede kaç çilek kaldı?` },
  { img: 'bird', unit: 'kuş', add: (_n, a, b) => `Ağaçta ${a} kuş vardı. ${b} kuş daha kondu. Ağaçta kaç kuş oldu?`, sub: (_n, a, b) => `Telde ${a} kuş vardı. ${b} kuş uçtu. Telde kaç kuş kaldı?` },
  { img: 'coin', unit: 'lira', add: (n, a, b) => `${n}'in kumbarasında ${a} lira vardı. ${b} lira daha attı. Kumbarada kaç lira oldu?`, sub: (n, a, b) => `${n}'in ${a} lirası vardı. ${b} liraya bir defter aldı. Kaç lirası kaldı?` },
  { img: 'star', unit: 'yıldız', add: (n, a, b) => `${n} pazartesi ${a}, salı ${b} yıldız kazandı. Toplam kaç yıldız kazandı?` },
  { img: 'cupcake', unit: 'kek', add: (_n, a, b) => `Pastanede ${a} çikolatalı ve ${b} çilekli kek var. Toplam kaç kek var?`, sub: (_n, a, b) => `Pastanede ${a} kek vardı. ${b} tanesi satıldı. Kaç kek kaldı?` },
]

const suffixKaldi = (r: number) => r

export const problem1: Gen = (rng, _g, level) => {
  const sub = rng() < 0.45
  const pool = CTX.filter((c) => (sub ? c.sub : c.add))
  const c = pick(rng, pool)
  const n = pick(rng, NAMES)
  let a: number
  let b: number
  if (sub) {
    a = randInt(rng, level === 1 ? 4 : 8, level === 1 ? 10 : 20)
    b = randInt(rng, 1, Math.min(level === 1 ? 4 : 9, a - 1))
  } else {
    a = randInt(rng, 2, level === 1 ? 7 : 12)
    b = randInt(rng, 1, Math.min(level === 1 ? 3 : 8, 20 - a))
  }
  const r = sub ? a - b : a + b
  const text = sub ? c.sub!(n, a, b) : c.add!(n, a, b)
  const explain = sub
    ? `${c.unit} sayısı azaldı, bu yüzden çıkarma yaparız: ${a} − ${b} = ${suffixKaldi(r)}. Kontrol: ${r} + ${b} = ${a}.`
    : `${c.unit} sayısı arttı, bu yüzden toplama yaparız: ${a} + ${b} = ${r}. Büyük sayıdan ileri sayarız: ${Math.max(a, b)}, … ${r}.`
  const kind = rng()
  if (kind < 0.3) {
    // 1. adım: durumu anla — hangi işlem?
    return choice(rng, { prompt: `${text} Bu problemi hangi işlemle çözeriz?`, correct: `${a} ${sub ? '−' : '+'} ${b}`, wrong: [`${a} ${sub ? '+' : '−'} ${b}`, `${b} ${sub ? '−' : '+'} ${b}`].filter((x) => x !== `${a} ${sub ? '−' : '+'} ${b}`), max: 3, visual: { kind: 'image', img: c.img, size: 100 }, explain })
  }
  if (kind < 0.65) return input({ prompt: text, visual: { kind: 'image', img: c.img, size: 110 }, answer: String(r), keys: 'digits', explain, hint: sub ? 'Azaldı mı? O zaman çıkarma yapalım!' : 'Arttı mı? O zaman toplama yapalım!' })
  return numChoice(rng, { prompt: text, answer: r, visual: { kind: 'image', img: c.img, size: 110 }, near: [r + 1, r - 1, sub ? a + b : Math.abs(a - b)].filter((x) => x >= 0 && x !== r), explain })
}

/** İnternet araştırmasındaki 45 problemin cevapları (sırayla, elle doğrulandı) */
const WEB_ANSWERS = [4, 9, 14, 7, 7, 3, 11, 11, 17, 10, 9, 12, 8, 3, 18, 9, 8, 4, 10, 6, 4, 13, 7, 7, 7, 10, 15, 10, 12, 5, 10, 5, 5, 9, 2, 4, 10, 6, 12, 14, 7, 10, 20, 13, 9]
/** sondaki "(4+4)" gibi cevap ipuçlarını kaldır */
const clean = (s: string) => s.replace(/\s*\([^)]*\)\s*$/, '')

/** Hazır problem bankasından (araştırma) bir soru — sözel problem kurma becerisi */
export const problemBank: Gen = (rng, _g, _l, history) => {
  const used = new Set(history.map((h) => h.prompt))
  const ids = WEB_PROBLEMS.map((_, i) => i).filter((i) => !used.has(clean(WEB_PROBLEMS[i])))
  const i = pick(rng, ids.length ? ids : WEB_PROBLEMS.map((_, k) => k))
  const text = clean(WEB_PROBLEMS[i])
  const ans = WEB_ANSWERS[i]
  const explain = `Önce soruyu anlarız: neler var, ne soruluyor? Sonra uygun işlemi yaparız. Cevap: ${ans}.`
  if (rng() < 0.5) return input({ prompt: text, answer: String(ans), keys: 'digits', explain, hint: 'Sayılar arttı mı, azaldı mı? Bir daha düşünelim.' })
  return numChoice(rng, { prompt: text, answer: ans, near: [ans + 1, ans - 1, ans + 2].filter((x) => x >= 0), explain })
}

/** Problem Çözme: üretilen bağlamlar + hazır problem bankası */
export const problemMix: Gen = (rng, g, l, h) => (rng() < 0.45 ? problemBank(rng, g, l, h) : problem1(rng, g, l, h))

export const _ctxCount = (rng: Rng) => pick(rng, CTX).unit
