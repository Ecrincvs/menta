import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Mascot, type MascotPose } from '../characters/Mascot'
import { Logo } from '../components/Logo'
import { CandyButton } from '../components/ui/Controls'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'

/**
 * KARŞILAMA EKRANI — 3D dünyanın üzerinde, maskot Fındık ve çocuğun kaşifi.
 * Not: tarayıcılar ses için bir dokunuş bekler; ilk dokunuşla birlikte selamlama seslendirilir.
 */
export function WelcomeScreen() {
  const { grade, go } = useGame()
  const [pose, setPose] = useState<MascotPose>('wave')
  const returning = grade !== null

  useEffect(() => {
    const t = setTimeout(() => setPose('idle'), 3800)
    return () => clearTimeout(t)
  }, [])

  const start = () => {
    sfx('whoosh')
    go(returning ? { name: 'world' } : { name: 'grade' })
  }

  return (
    <div className="absolute inset-0">
      {/* alt kısımda hafif karartma: karakterler öne çıksın */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_45%,rgba(30,60,90,0.25)_100%)]" />

      {/* logo sol üstte: ortadaki evleri kapatmasın */}
      <div className="absolute left-3 top-2 origin-top-left scale-[0.72] sm:left-5 sm:top-3">
        <Logo />
      </div>

      {/* Fındık */}
      <motion.div
        className="absolute bottom-[1%] left-[1%] flex items-end"
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.5 }}
        onClick={() => {
          sfx('pop')
          setPose('jump')
          setTimeout(() => setPose('idle'), 1200)
        }}
      >
        <Mascot pose={pose} size={Math.min(220, window.innerWidth * 0.17)} />
      </motion.div>

      {/* aksiyonlar */}
      <motion.div
        className="absolute bottom-[2.5%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 160, damping: 16 }}
      >
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <CandyButton color="green" onClick={start} className="!min-h-[88px] !px-12 !text-[clamp(26px,3.2vw,40px)]" aria-label="Maceraya başla">
            Maceraya Başla
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden>
              <path d="M8 4 L 18 12 L 8 20 Z" fill="#fff" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </CandyButton>
        </motion.div>
        <CandyButton color="purple" onClick={() => go({ name: 'avatar' })} className="!min-h-[60px] !text-[20px]">
          Kaşifimi Tasarla
        </CandyButton>
      </motion.div>
    </div>
  )
}
