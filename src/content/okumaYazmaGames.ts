import type { GameMeta } from './types'
import { LETTER_ORDER } from './letters'
import { STAGES } from './okumaYazma'
import { upperTR } from './words'
import { LETTER_SOUNDS } from '../audio/speech'
import { KIND_INFO, harfEtkinlikleri, oyunTuru, type HarfKind } from './generators/harfEtkinlik'

const GROUP_THEME = ['1. Grup · a n e t i l', '2. Grup · o k u r ı m', '3. Grup · ü s ö y d z', '4. Grup · ç b g c ş', '5. Grup · p h v ğ f j']
const groupOf = (i: number) => (i <= 5 ? 0 : i <= 11 ? 1 : i <= 17 ? 2 : i <= 22 ? 3 : 4)

/** MEB Türkçe 1. sınıf ilk okuma yazma kazanımları (docs/meb/turkce-1-4.txt) */
const MEB: Record<HarfKind, string[]> = {
  dinle: ['T.D.1.2.a'],
  nerede: ['T.D.1.2.a'],
  avi: ['T.O.1.1.a'],
  yaz: ['T.Y.1.3.b'],
  tablo: ['T.O.1.1.a'],
  hece: ['T.O.1.1.a'],
  tren: ['T.O.1.1.a', 'T.Y.1.3.b'],
  resim: ['T.O.1.1.a'],
  kayip: ['T.O.1.1.a', 'T.Y.1.3.b'],
  dikte: ['T.Y.1.3.b'],
  cumle: ['T.Y.1.3.b'],
  okuma: ['T.O.1.1.a'],
  oyun: ['T.O.1.1.a'],
}

const OYUN_ADI = { pop: 'Balon Patlat', memory: 'Hafıza Kartları', search: 'Kelime Avı' } as const

/** Her etkinliğin başındaki kısa "Öğrenelim" anlatımı */
function lessonFor(l: string, kind: HarfKind, i: number): GameMeta['lesson'] {
  const st = STAGES[i]
  const U = upperTR(l)
  const s = LETTER_SOUNDS[l] ?? l
  const words = st.kelimeler.slice(0, 4)
  switch (kind) {
    case 'dinle':
      return {
        text: `Bugün “${l}” sesini öğreniyoruz. Ağzını aç ve söyle: ${s}!${words.length ? ` Bu sesle okuyacağımız kelimeler: ${words.join(', ')}.` : ' Bu sesi kelimelerin içinde duyabilir misin?'}`,
        points: [`Küçük harfi “${l}”, büyük harfi “${U}”.`, 'Resimlerin adını içinden söyle, sesi dinle.'],
        visual: { kind: 'sequence', items: [l, U] },
      }
    case 'nerede':
      return { text: `Bir ses kelimenin başında, ortasında ya da sonunda olabilir. Kelimeyi yavaşça söyle ve “${l}” sesini dinle.`, points: ['Başında: ilk ses', 'Ortasında: arada', 'Sonunda: son ses'] }
    case 'avi':
      return { text: `“${l}” harfinin küçük ve büyük biçimini tanıyalım. Cümleler ve özel isimler büyük harfle başlar.`, visual: { kind: 'sequence', items: [l, U] } }
    case 'yaz':
      return { text: `Şimdi “${l}” harfini yazma zamanı! Parmağınla çizginin üstünden geç. Yukarıdan başla, acele etme.`, visual: { kind: 'sequence', items: [l, U] } }
    case 'tablo':
      return { text: 'İki ses birleşince hece olur. Sesleri sırayla söyle, sonra birleştir.', points: [`${st.heceler[0] ? `${st.heceler[0].split('').join(' + ')} = ${st.heceler[0]}` : `${l} + a`}`, 'Her hecede bir ünlü vardır.'], visual: st.heceler[0] ? { kind: 'equation', text: `${st.heceler[0].split('').join(' + ')} = ${st.heceler[0]}` } : undefined }
    case 'hece':
      return { text: `Heceyi dinle ve doğru yazılışını bul. Yeni hecelerimiz: ${st.heceler.slice(0, 6).join(', ') || l}.` }
    case 'tren':
      return { text: 'Kelimeler hecelerden oluşur. Heceleri sırayla dizersek kelimeyi okuruz.', points: words[0] ? [`${words[0]}: ${words[0]}`] : undefined }
    case 'resim':
      return { text: 'Kelimeyi heceleyerek oku, sonra resmini bul. Okuduğunu anlamak çok önemli!' }
    case 'kayip':
      return { text: `Kelimede bir harf kaybolmuş! Kelimeyi söyle, eksik sesi bul. İpucu: genellikle “${l}” sesi saklanıyor.` }
    case 'dikte':
      return { text: 'Duyduğun heceyi ya da kelimeyi yavaşça kendin de söyle. Her sesi sırayla harf olarak yaz.', points: ['Önce dinle', 'Sonra sesleri sırayla yaz'] }
    case 'cumle':
      return { text: 'Kelimeleri doğru sıraya dizersek cümle olur. Cümle büyük harfle başlar, nokta ile biter.' }
    case 'okuma':
      return { text: 'Şimdi okuma zamanı! Cümleleri dinle ve oku. Sonunda kısa bir metin okuyup soruya cevap vereceğiz.' }
    case 'oyun':
      return { text: `Tebrikler, “${l}” harfinin bütün çalışmalarını bitirdin! Şimdi ödül oyunu: ${OYUN_ADI[oyunTuru(l)]}!` }
  }
}

/** Okuma Yazma Yolu: her harf bir "harf adası" — sıralı etkinlikler + sonda harf oyunu (id: oy-<harf>-<tür>) */
export const OY_GAMES: GameMeta[] = STAGES.flatMap((st, i) => {
  const l = st.letter
  return harfEtkinlikleri(l).map((kind): GameMeta => {
    const info = KIND_INFO[kind]
    const total = kind === 'oyun' ? (oyunTuru(l) === 'search' ? 2 : 3) : kind === 'okuma' && !st.metin ? 4 : info.total
    return {
      id: `oy-${l}-${kind}`,
      subject: 'turkce',
      title: kind === 'oyun' ? OYUN_ADI[oyunTuru(l)] : info.title,
      blurb: `“${l}” · ${info.blurb}`,
      icon: info.icon,
      grades: [1],
      skill: `oy.${l}`,
      meb: { 1: MEB[kind] },
      theme: GROUP_THEME[groupOf(i)],
      available: true,
      hidden: true,
      tint: '#ffd9c7',
      mechanic: 'choice',
      backdrop: 'meadow',
      total,
      lesson: lessonFor(l, kind, i),
    }
  })
})

/** Bir harfin etkinlik kimlikleri (sırayla; sonuncusu oyun) */
export const harfOyunlari = (l: string) => OY_GAMES.filter((g) => g.id.startsWith(`oy-${l}-`))
export const isLetterDone = (l: string, results: Record<string, unknown>) => !!results[`oy-${l}-oyun`]
export { LETTER_ORDER }
