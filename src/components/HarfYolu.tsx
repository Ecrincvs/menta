import { motion } from 'framer-motion'
import { LETTER_ORDER } from '../content/letters'
import { upperTR } from '../content/words'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

/** 1. sınıf: kitaptaki harf sırası. Çocuk/veli sınıfta öğrenilen son harfe dokunur; etkinlikler buna göre üretilir. */
const GROUP_END = [5, 11, 17, 22, 28]
const GROUP_COL = ['#ff9a2e', '#2ec4c9', '#9b6ef3', '#5bc236', '#e8463c']

export function HarfYolu() {
  const idx = useGame((s) => s.letterIdx)
  const setIdx = useGame((s) => s.setLetterIdx)
  return (
    <section className="mk-card mb-3 p-3" aria-label="Harf Yolu">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="mk-display text-[19px] leading-none">Harf Yolu</h2>
        <span className="text-[13px] font-extrabold text-[var(--mk-ink-soft)]">Sınıfta öğrendiğin son harfe dokun. Oyunlar yalnızca öğrendiğin harflerle gelir.</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {LETTER_ORDER.map((l, i) => {
          const g = GROUP_END.findIndex((e) => i <= e)
          const learned = i <= idx
          const current = i === idx
          return (
            <motion.button
              key={l}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                sfx(i > idx ? 'unlock' : 'tap')
                setIdx(i)
                speak(`${l} harfine kadar öğrendim!`)
              }}
              aria-pressed={current}
              aria-label={`${upperTR(l)} harfine kadar öğrendim`}
              className="mk-display grid h-11 min-w-11 place-items-center rounded-xl px-1.5 text-[20px] leading-none transition"
              style={{
                background: learned ? GROUP_COL[g] : '#f1e6cf',
                color: learned ? '#fff' : '#b9a27a',
                boxShadow: current ? `0 0 0 4px #fff, 0 0 0 7px ${GROUP_COL[g]}` : learned ? 'inset 0 -3px 0 rgba(0,0,0,0.18)' : 'none',
                textShadow: learned ? '0 2px 0 rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {l}
              <span className="text-[11px] opacity-80">{upperTR(l)}</span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
