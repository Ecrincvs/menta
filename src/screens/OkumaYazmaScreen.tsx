/**
 * OKUMA YAZMA YOLU — 1. sınıf için ayrı dünya: kitaptaki harf sırasıyla 29 harf adası.
 * Harfe dokununca o harfin etkinlikleri (HarfScreen) açılır; adanın sonundaki oyun bitince öğrenilen son harf ilerler.
 */
import { motion } from 'framer-motion'
import { Backdrop } from '../components/Backdrop'
import { Hud } from '../components/Hud'
import { BackButton, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Mascot } from '../characters/Mascot'
import { LETTER_ORDER } from '../content/letters'
import { upperTR } from '../content/words'
import { useGame } from '../state/store'
import { harfOyunlari } from '../content/okumaYazmaGames'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

const GROUPS = [
  { title: '1. Grup', letters: 'a n e t i l', color: '#ff9a2e', dark: '#d8670b' },
  { title: '2. Grup', letters: 'o k u r ı m', color: '#2ec4c9', dark: '#149aa0' },
  { title: '3. Grup', letters: 'ü s ö y d z', color: '#9b6ef3', dark: '#6b43c4' },
  { title: '4. Grup', letters: 'ç b g c ş', color: '#5bc236', dark: '#3a8f1d' },
  { title: '5. Grup', letters: 'p h v ğ f j', color: '#e8463c', dark: '#b8302c' },
]

export function OkumaYazmaScreen() {
  const { letterIdx, gameResults, go, back } = useGame()
  const next = Math.min(letterIdx + 1, LETTER_ORDER.length - 1)
  const allDone = letterIdx >= LETTER_ORDER.length - 1 && !!gameResults[`oy-${LETTER_ORDER[LETTER_ORDER.length - 1]}-oyun`]
  const msg = allDone ? 'Tebrikler! Bütün harfleri öğrendin. İstediğin durağı tekrar edebilirsin!' : `Sıradaki durağımız “${LETTER_ORDER[next]}” sesi! Öğrendiğin harfleri de istediğin zaman tekrar edebilirsin.`

  const open = (i: number) => {
    const l = LETTER_ORDER[i]
    if (i > next) {
      sfx('wrong')
      speak(`Önce ${LETTER_ORDER[next]} durağını bitirelim!`)
      return
    }
    sfx('whoosh')
    go({ name: 'harf', letter: l })
  }

  return (
    <div className="absolute inset-0">
      <Backdrop kind="meadow" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton onClick={back} />
        <div className="mt-3 hidden md:block">
          <WoodSign icon="abc" color="#e8463c">
            Okuma Yazma Yolu
          </WoodSign>
        </div>
        <Hud />
      </header>

      <motion.div className="absolute bottom-0 left-[1%] z-30 hidden w-[240px] flex-col items-start sm:flex" initial={{ x: -200 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.3 }}>
        <div className="mb-2 w-full">
          <SpeechBubble tail="bottom" text={msg} size="sm" />
        </div>
        <Mascot pose="wave" size={180} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 top-[96px] z-10 overflow-y-auto px-4 pb-10 sm:left-[250px] sm:right-4 md:top-[112px]">
        <div className="mx-auto flex max-w-[980px] flex-col gap-5 pt-2">
          {GROUPS.map((g, gi) => {
            const letters = g.letters.split(' ')
            return (
              <section key={g.title} className="relative rounded-[28px] bg-white/55 p-3 pb-5 shadow-lg backdrop-blur-[2px]">
                <h2 className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1 text-white shadow" style={{ background: g.color }}>
                  <span className="mk-display text-[18px]">{g.title}</span>
                  <span className="mk-display text-[16px] opacity-90">{g.letters}</span>
                </h2>
                {/* kıvrımlı yol */}
                <svg className="pointer-events-none absolute inset-x-6 top-[78px] h-[110px] w-[calc(100%-48px)]" viewBox="0 0 600 110" preserveAspectRatio="none" aria-hidden>
                  <path d="M10 55 C 90 5, 160 105, 250 55 S 410 5, 500 55 S 580 95, 595 55" stroke={g.color} strokeOpacity="0.45" strokeWidth="10" strokeDasharray="4 18" strokeLinecap="round" fill="none" />
                </svg>
                <div className="relative flex flex-wrap justify-around gap-y-4">
                  {letters.map((l, k) => {
                    const i = LETTER_ORDER.indexOf(l)
                    const acts = harfOyunlari(l)
                    const doneN = acts.filter((a) => gameResults[a.id]).length
                    const best = gameResults[`oy-${l}-oyun`]?.best ?? 0
                    const locked = i > next
                    const isNext = i === next && !allDone
                    const learned = i <= letterIdx
                    return (
                      <motion.button
                        key={l}
                        onClick={() => open(i)}
                        aria-label={`${l} durağı${locked ? ', kilitli' : ''}`}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: k % 2 ? 18 : -6 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: gi * 0.08 + k * 0.05 }}
                        whileHover={!locked ? { scale: 1.1 } : {}}
                        whileTap={!locked ? { scale: 0.92 } : {}}
                        className="relative flex flex-col items-center"
                      >
                        {isNext && (
                          <motion.div className="absolute -top-12 z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                            <Obj name="fox" size={44} />
                          </motion.div>
                        )}
                        <motion.span
                          className="mk-display relative grid h-[clamp(70px,9vw,92px)] w-[clamp(70px,9vw,92px)] place-items-center rounded-full leading-none"
                          animate={isNext ? { boxShadow: [`0 0 0 0 ${g.color}66`, `0 0 0 14px ${g.color}00`] } : {}}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          style={{
                            background: locked ? 'linear-gradient(180deg,#efe6d4,#ddd0b6)' : `radial-gradient(circle at 35% 28%, #ffffffaa 0%, ${g.color} 45%, ${g.dark} 100%)`,
                            border: `5px solid ${locked ? '#cdbf9f' : '#fff'}`,
                            boxShadow: locked ? '0 5px 0 #b9a985' : `0 6px 0 ${g.dark}, 0 12px 18px rgba(0,0,0,0.2)`,
                            color: locked ? '#a3967a' : '#fff',
                            textShadow: locked ? 'none' : '0 2px 0 rgba(0,0,0,0.25)',
                          }}
                        >
                          <span className="text-[clamp(30px,3.6vw,40px)]">
                            {l}
                            <span className="ml-0.5 text-[0.55em] opacity-85">{upperTR(l)}</span>
                          </span>
                          {locked && (
                            <span className="absolute -bottom-1 -right-1">
                              <Obj name="lock" size={26} shadow={false} />
                            </span>
                          )}
                          {learned && best > 0 && (
                            <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--mk-green)] text-[14px] font-black text-white shadow">✓</span>
                          )}
                        </motion.span>
                        {!locked && (
                          <span className="mt-1 rounded-full bg-white/90 px-2 text-[12px] font-black text-[var(--mk-ink-soft)] shadow-sm" aria-label={`${doneN} / ${acts.length} etkinlik`}>
                            {doneN}/{acts.length}
                          </span>
                        )}
                        <span className="mt-0.5 flex gap-0.5" aria-label={`${best} yıldız`}>
                          {[1, 2, 3].map((s) => (
                            <svg key={s} viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                              <path d="M12 1.5 L14.9 8.6 L22.5 9.2 L16.7 14.1 L18.5 21.6 L12 17.6 L5.5 21.6 L7.3 14.1 L1.5 9.2 L9.1 8.6 Z" fill={s <= best ? '#ffd23f' : '#eadcc0'} stroke={s <= best ? '#e8a40c' : '#d6c39e'} strokeWidth="1.5" />
                            </svg>
                          ))}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
