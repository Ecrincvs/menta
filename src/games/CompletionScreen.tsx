import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Confetti } from '../components/fx/Confetti'
import { CandyButton } from '../components/ui/Controls'
import { Obj } from '../components/ui/Obj'
import { Mascot } from '../characters/Mascot'
import { Avatar } from '../characters/Avatar'
import type { GameMeta } from '../content/types'
import type { GameResultSummary } from './useRoundEngine'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

const STAR_PATH = 'M12 1.5 L14.9 8.6 L22.5 9.2 L16.7 14.1 L18.5 21.6 L12 17.6 L5.5 21.6 L7.3 14.1 L1.5 9.2 L9.1 8.6 Z'

/** GÖREV TAMAMLANDI — yıldızlar sırayla dolar, ödüller sayılır, konfeti */
export function CompletionScreen({ result, meta, onReplay }: { result: GameResultSummary; meta: GameMeta; onReplay: () => void }) {
  const { back, avatar } = useGame()
  const line =
    result.stars === 3
      ? 'Muhteşem! Üç yıldızın hepsini topladın!'
      : result.stars === 2
        ? 'Çok iyi gidiyorsun! Bir dahakine üç yıldız senin!'
        : 'Görevi tamamladın! Tekrar oynarsak daha da güçleneceksin!'
  const levelUp = result.levelAfter > result.levelBefore

  useEffect(() => {
    sfx('fanfare')
    const timers = [1, 2, 3].map((k) => setTimeout(() => k <= result.stars && sfx('star'), 700 + k * 380))
    timers.push(setTimeout(() => sfx('coin'), 2100))
    const s = setTimeout(() => speak(`Görevi tamamladın! ${line}${levelUp ? ' Seviye atladın!' : ''}`), 600)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(s)
    }
  }, [result.stars, line, levelUp])

  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-center overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="Görevi tamamladın"
      style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,236,170,0.95) 0%, rgba(255,170,90,0.85) 45%, rgba(130,60,160,0.85) 100%)' }}
    >
      {/* dönen ışınlar */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.18) 0deg 10deg, rgba(255,255,255,0) 10deg 22deg)' }}
      />
      <Confetti count={80} />

      <div className="relative flex w-[min(980px,100%)] items-end justify-center gap-2">
        <motion.div
          className="hidden shrink-0 md:block"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 14 }}
        >
          <Avatar config={avatar} pose="cheer" size={200} />
        </motion.div>

        <motion.div
          className="mk-card relative flex flex-1 flex-col items-center gap-4 px-5 pb-7 pt-14 sm:max-w-[560px]"
          initial={{ scale: 0.5, y: 80 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        >
          {/* kurdele başlık */}
          <div className="absolute -top-8 left-1/2 w-[110%] -translate-x-1/2">
            <div className="relative mx-auto flex w-fit items-center">
              <div className="absolute -left-8 top-3 h-14 w-16 bg-[#b8302c]" style={{ clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%,25% 50%)' }} />
              <div className="absolute -right-8 top-3 h-14 w-16 bg-[#b8302c]" style={{ clipPath: 'polygon(0 0,100% 0,75% 50%,100% 100%,0 100%)' }} />
              <div className="relative rounded-xl border-4 border-[#8f1f1b] bg-gradient-to-b from-[#ff6b5e] to-[#e0453a] px-8 py-2 shadow-[0_6px_0_#8f1f1b]">
                <span className="mk-title whitespace-nowrap text-[clamp(28px,4vw,46px)]">Görevi Tamamladın!</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            {[1, 2, 3].map((k) => {
              const on = k <= result.stars
              return (
                <motion.svg
                  key={k}
                  viewBox="0 0 24 24"
                  width={k === 2 ? 120 : 96}
                  height={k === 2 ? 120 : 96}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0, y: k === 2 ? -14 : 0 }}
                  transition={{ delay: 0.6 + k * 0.38, type: 'spring', stiffness: 300, damping: 12 }}
                  aria-hidden
                  style={{ filter: on ? 'drop-shadow(0 6px 10px rgba(232,164,12,0.6))' : 'none' }}
                >
                  <defs>
                    <linearGradient id={`st${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={on ? '#fff3a0' : '#efe4cf'} />
                      <stop offset="0.6" stopColor={on ? '#ffd23f' : '#e3d4b6'} />
                      <stop offset="1" stopColor={on ? '#f2a900' : '#d6c39e'} />
                    </linearGradient>
                  </defs>
                  <path d={STAR_PATH} fill={`url(#st${k})`} stroke={on ? '#c98400' : '#c9b48c'} strokeWidth="1.2" strokeLinejoin="round" />
                  {on && <ellipse cx="9" cy="8" rx="2.2" ry="1.3" fill="#fff" opacity="0.8" />}
                </motion.svg>
              )
            })}
          </div>

          <p className="mk-display text-center text-[clamp(18px,2.2vw,24px)] leading-tight">{line}</p>
          <p className="text-[16px] font-extrabold text-[var(--mk-ink-soft)]">
            {result.correctFirstTry} / {result.total} soruyu ilk denemede bildin
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0, type: 'spring' }} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow">
              <Obj name="coin" size={36} shadow={false} />
              <span className="mk-display text-[24px]">+{result.coins}</span>
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, type: 'spring' }} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow">
              <Obj name="glowstar" size={36} shadow={false} />
              <span className="mk-display text-[24px]">+{result.xp} XP</span>
            </motion.div>
            {levelUp && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 2.5 }} className="flex items-center gap-1 rounded-full bg-[var(--mk-purple)] px-3 py-1 text-white shadow">
                <Obj name="trophy" size={34} shadow={false} />
                <span className="mk-display text-[20px]">Zorluk seviyesi {result.levelAfter}!</span>
              </motion.div>
            )}
          </div>

          <div className="mt-1 flex flex-wrap justify-center gap-3">
            <CandyButton color="orange" onClick={onReplay} aria-label="Tekrar oyna">
              Tekrar Oyna
            </CandyButton>
            <CandyButton color="green" onClick={back} aria-label="Devam et">
              Devam Et
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                <path d="M5 12 H18 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </CandyButton>
          </div>
          <p className="sr-only">{meta.title} tamamlandı</p>
        </motion.div>

        <motion.div
          className="hidden shrink-0 md:block"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 140, damping: 14 }}
        >
          <Mascot pose={result.stars >= 2 ? 'cheer' : 'clap'} size={190} />
        </motion.div>
      </div>
    </motion.div>
  )
}
