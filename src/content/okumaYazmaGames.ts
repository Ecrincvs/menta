import type { GameMeta } from './types'
import { LETTER_ORDER } from './letters'
import { STAGES } from './okumaYazma'
import { upperTR } from './words'
import { LETTER_SOUNDS } from '../audio/speech'
import { stationSteps } from './generators/okumaYazma'

const GROUP_THEME = ['1. Grup · a n e t i l', '2. Grup · o k u r ı m', '3. Grup · ü s ö y d z', '4. Grup · ç b g c ş', '5. Grup · p h v ğ f j']
const groupOf = (i: number) => (i <= 5 ? 0 : i <= 11 ? 1 : i <= 17 ? 2 : i <= 22 ? 3 : 4)

/** Okuma Yazma Yolu durakları: oy-<harf> */
export const OY_GAMES: GameMeta[] = STAGES.map((st, i) => {
  const l = st.letter
  const words = st.kelimeler.slice(0, 4)
  return {
    id: `oy-${l}`,
    subject: 'turkce',
    title: `“${l}” Durağı`,
    blurb: `${l} – ${upperTR(l)} sesi`,
    icon: 'abc',
    grades: [1],
    skill: `oy.${l}`,
    meb: { 1: ['T.D.1.2.a', 'T.Y.1.3.b', 'T.O.1.1.a'] },
    theme: GROUP_THEME[groupOf(i)],
    available: true,
    hidden: true,
    tint: '#ffd9c7',
    mechanic: 'choice',
    backdrop: 'meadow',
    total: stationSteps(l).length,
    lesson: {
      text: `Bugün “${l}” sesini öğreniyoruz. Ağzını aç ve söyle: ${LETTER_SOUNDS[l] ?? l}!${words.length ? ` Bu sesle okuyacağımız kelimeler: ${words.join(', ')}.` : ' Bu sesi kelimelerin içinde duyabilir misin?'}`,
      points: [
        `Küçük harfi “${l}”, büyük harfi “${upperTR(l)}”.`,
        st.heceler.length ? `Yeni heceler: ${st.heceler.slice(0, 5).join(', ')}` : 'Önce sesi tanıyalım ve harfi yazalım.',
        i >= LETTER_ORDER.indexOf('o') ? 'Bu durakta cümle de kuracağız!' : 'Harfi parmağınla yazmayı unutma.',
      ],
      visual: { kind: 'sequence', items: [l, upperTR(l)] },
    },
  }
})
