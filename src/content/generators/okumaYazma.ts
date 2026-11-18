/**
 * OKUMA YAZMA YOLU — her harf durağının adımları (kitaptaki sayfa akışı):
 * Sesi tanı → Harfi bul → Harfi yaz (küçük/büyük) → Heceyi dinle-bul → Kelimeyi dinle-oku → Kayıp harf → Hece treni → Cümle kur → Metin oku
 * Tüm yazılı öğeler yalnızca o harfe kadar öğrenilmiş harflerden oluşur.
 */
import { pick, shuffle, type Rng } from '../../learning/rng'
import { choice, order, type Gen } from './helpers'
import { LETTER_ORDER, heceler, isAllowed } from '../letters'
import { STAGES, stageOf } from '../okumaYazma'
import { PIC } from './tr1'
import { LETTER_SOUNDS } from '../../audio/speech'
import { upperTR } from '../words'
import type { Question, TraceQ } from '../../games/quiz/types'

const LOOKALIKE: Record<string, string[]> = { b: ['d', 'p'], d: ['b'], p: ['b'], n: ['m', 'u'], m: ['n'], u: ['n', 'ü'], ü: ['u'], ı: ['i', 'l'], i: ['ı', 'l'], l: ['i', 't'], o: ['ö'], ö: ['o'], c: ['ç'], ç: ['c'], s: ['ş'], ş: ['s'], g: ['ğ'], ğ: ['g'], e: ['a'], a: ['e', 'o'], t: ['l'], k: ['t'], r: ['n'], y: ['v'], v: ['y'], z: ['s'], h: ['n'], f: ['t'], j: ['i'] }

/** Durağın o ana kadarki tüm heceleri / kelimeleri */
function pool(letter: string) {
  const idx = LETTER_ORDER.indexOf(letter)
  const st = STAGES.slice(0, idx + 1)
  return {
    idx,
    hecelerHepsi: st.flatMap((s) => s.heceler),
    kelimelerHepsi: st.flatMap((s) => s.kelimeler),
    cur: stageOf(letter),
  }
}

type Step = 'tani' | 'yakala' | 'yaz' | 'yazB' | 'hece' | 'kelime' | 'kayip' | 'tren' | 'cumle' | 'metin'

export function stationSteps(letter: string): Step[] {
  const { cur } = pool(letter)
  const steps: Step[] = []
  if (picsWith(letter).length) steps.push('tani')
  steps.push('yakala', 'yaz', 'yazB')
  if (cur.heceler.length) steps.push('hece')
  if (cur.kelimeler.length) steps.push('kelime')
  if (cur.kelimeler.some((w) => w.toLocaleLowerCase('tr-TR').includes(letter) && w.length >= 3)) steps.push('kayip')
  if (cur.kelimeler.some((w) => heceler(w).length >= 2)) steps.push('tren')
  if (cur.cumleler?.length) steps.push('cumle')
  if (cur.metin) steps.push('metin')
  return steps
}

const picsWith = (l: string) => PIC.filter(([w]) => w.includes(l))
const picsWithout = (l: string) => PIC.filter(([w]) => !w.includes(l))
const lower = (s: string) => s.toLocaleLowerCase('tr-TR')

function step(rng: Rng, letter: string, s: Step): Question {
  const { idx, hecelerHepsi, kelimelerHepsi, cur } = pool(letter)
  const sound = LETTER_SOUNDS[letter] ?? letter
  const learned = LETTER_ORDER.slice(0, idx + 1)
  switch (s) {
    case 'tani': {
      // resimler yazısız gösterilir (okuma gerekmez); sesi dinleyip resmi bulur
      const [w, img] = pick(rng, picsWith(letter))
      const wrong = shuffle(rng, picsWithout(letter)).slice(0, 2)
      return choice(rng, {
        prompt: `Adında “${letter}” sesi olan resim hangisi?`,
        spoken: `Adında ${sound} sesi olan resmi bul! Resimlerin adını içinden söyle.`,
        correct: { img },
        wrong: wrong.map(([, i]) => ({ img: i })),
        max: 3,
        explain: `${w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1)} kelimesinde “${letter}” sesi var: ${heceler(w).join(' - ')}.`,
      })
    }
    case 'yakala': {
      const upper = rng() < 0.4
      const show = (c: string) => (upper ? upperTR(c) : c)
      const sim = (LOOKALIKE[letter] ?? []).filter((c) => learned.includes(c))
      const others = [...sim, ...shuffle(rng, learned.filter((c) => c !== letter && !sim.includes(c)))].slice(0, Math.min(4, learned.length - 1))
      if (!others.length) others.push(letter === 'a' ? 'o' : 'a')
      return choice(rng, { prompt: `“${show(letter)}” harfini yakala!`, spoken: `${sound} sesinin harfini yakala!`, correct: show(letter), wrong: others.map(show), max: 5, layout: 'bubbles', explain: `“${sound}” sesinin harfi: ${letter} – ${upperTR(letter)}.` })
    }
    case 'yaz':
    case 'yazB': {
      const ch = s === 'yaz' ? letter : upperTR(letter)
      const q: TraceQ = { type: 'trace', letter: ch, prompt: `“${ch}” harfini parmağınla yaz! Çizginin üstünden geç.`, spoken: `${s === 'yaz' ? 'Küçük' : 'Büyük'} ${sound} harfini parmağınla yaz.`, explain: `Harfi yazarken yukarıdan aşağıya ve soldan sağa doğru ilerleriz.` }
      return q
    }
    case 'hece': {
      const h = pick(rng, cur.heceler)
      const wrong = shuffle(rng, hecelerHepsi.filter((x) => x !== h && isAllowed(x, idx)))
      const fallback = [h.split('').reverse().join(''), learned[0] + learned[1]].filter((x) => x !== h)
      return choice(rng, { prompt: 'Duyduğun heceyi bul! 🔊', spoken: `${h}. Duyduğun heceyi bul: ${h}`, correct: h, wrong: wrong.length >= 2 ? wrong : [...wrong, ...fallback], max: 3, explain: `Duyduğun hece “${h}”.` })
    }
    case 'kelime': {
      const w = pick(rng, cur.kelimeler)
      const wrong = shuffle(rng, kelimelerHepsi.filter((x) => lower(x) !== lower(w)))
      return choice(rng, { prompt: 'Duyduğun kelimeyi bul ve oku! 🔊', spoken: `${w}. Duyduğun kelimeyi bul: ${w}`, correct: w, wrong: wrong.length >= 2 ? wrong : [...wrong, ...cur.heceler], max: 3, explain: `Okuduğun kelime: ${heceler(w).join(' - ')}.` })
    }
    case 'kayip': {
      const words = cur.kelimeler.filter((w) => lower(w).includes(letter) && w.length >= 3)
      const w = pick(rng, words)
      const i = lower(w).indexOf(letter)
      const wrong = shuffle(rng, (LOOKALIKE[letter] ?? []).filter((c) => learned.includes(c)).concat(shuffle(rng, learned.filter((c) => c !== letter))))
      return choice(rng, { prompt: 'Kelimedeki kayıp harfi bul!', spoken: `${w}. Kayıp harfi bul.`, visual: { kind: 'word', word: lower(w), hide: [i] }, correct: letter, wrong, max: 3, explain: `${w} kelimesinde kayıp harf “${letter}”.` })
    }
    case 'tren': {
      const words = cur.kelimeler.filter((w) => heceler(w).length >= 2)
      const w = lower(pick(rng, words))
      const pic = PIC.find(([x]) => x === w)
      return order({ prompt: 'Hece Treni', spoken: `${w}. Heceleri sırayla diz.`, img: pic?.[1], pieces: heceler(w), joiner: '', style: 'train', explain: `${w}: ${heceler(w).join(' - ')}.` })
    }
    case 'cumle': {
      const c = pick(rng, cur.cumleler!)
      return order({ prompt: 'Kelimeleri sırala, cümleyi kur!', spoken: c, pieces: c.split(' '), joiner: ' ', style: 'chain', explain: `Cümle: “${c}”` })
    }
    case 'metin': {
      const m = cur.metin!
      return choice(rng, { prompt: m.q, correct: m.a, wrong: m.w, max: 3, layout: 'wide', passage: { title: `${upperTR(letter)} Metni`, text: m.text }, spoken: `${m.text} Soru: ${m.q}`, explain: `Cevap metinde: ${m.a}.` })
    }
  }
}

/** Durak üreticisi: adımlar kitaptaki sırayla gelir */
export const stationGen = (letter: string): Gen => (rng, _g, _l, history) => {
  const steps = stationSteps(letter)
  return step(rng, letter, steps[history.length % steps.length])
}
