import { motion } from 'framer-motion'
import { useState } from 'react'
import { Backdrop } from '../components/Backdrop'
import { BackButton, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Avatar } from '../characters/Avatar'
import { Mascot } from '../characters/Mascot'
import { GRADES } from '../content/grades'
import type { Grade } from '../content/types'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'
import { StarBurst } from '../components/fx/Confetti'

export function GradeSelectScreen() {
  const { grade: current, setGrade, go, history } = useGame()
  const [picked, setPicked] = useState<Grade | null>(null)

  const choose = (g: Grade) => {
    if (picked) return
    sfx('star')
    setPicked(g)
    setGrade(g)
    const meta = GRADES.find((x) => x.grade === g)!
    speak(`Harika! ${g}. sınıf, ${meta.world} seni bekliyor!`)
    setTimeout(() => go({ name: 'world' }), 1500)
  }

  return (
    <div className="absolute inset-0">
      <Backdrop kind="glade" />
      <div className="absolute left-4 top-4 z-10">{history.length > 0 && <BackButton />}</div>
      <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
        <WoodSign color="#ff9a2e">Sınıfını Seç</WoodSign>
      </div>

      <div className="absolute inset-x-0 top-[18%] bottom-[20%] flex items-center justify-center px-4">
        <div className="grid w-full max-w-[1100px] grid-cols-2 gap-[clamp(12px,2vw,28px)] md:grid-cols-4">
          {GRADES.map((g, i) => {
            const isPicked = picked === g.grade
            const isCurrent = current === g.grade && !picked
            return (
              <motion.button
                key={g.grade}
                aria-label={`${g.label}, ${g.world}`}
                initial={{ y: 80, opacity: 0, rotate: i % 2 ? 4 : -4 }}
                animate={
                  picked && !isPicked
                    ? { opacity: 0.35, scale: 0.92, y: 0, rotate: 0 }
                    : { y: isPicked ? -18 : 0, opacity: 1, rotate: 0, scale: isPicked ? 1.08 : 1 }
                }
                transition={{ type: 'spring', stiffness: 220, damping: 16, delay: picked ? 0 : 0.15 + i * 0.08 }}
                whileHover={picked ? {} : { y: -12, rotate: i % 2 ? 1.5 : -1.5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => choose(g.grade)}
                className="relative flex aspect-[3/4] flex-col items-center justify-end overflow-hidden rounded-[28px] p-3"
                style={{
                  background: `linear-gradient(180deg, color-mix(in oklab, ${g.color} 55%, white) 0%, ${g.color} 70%)`,
                  border: `5px solid ${isPicked || isCurrent ? '#fff' : g.colorDark}`,
                  boxShadow: `inset 0 4px 0 rgba(255,255,255,0.5), 0 8px 0 ${g.colorDark}, 0 18px 30px rgba(0,0,0,0.25)${isPicked || isCurrent ? `, 0 0 0 6px ${g.color}, 0 0 40px 10px rgba(255,240,150,0.8)` : ''}`,
                }}
              >
                {/* parlama */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] bg-gradient-to-b from-white/30 to-transparent" />
                <span className="mk-display absolute left-3 top-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[13px]" style={{ color: g.colorDark }}>
                  {g.world}
                </span>
                <div className="flex min-h-0 w-full flex-1 items-end justify-center pt-6">
                  <Avatar artId={`sinif${g.grade}` as const} config={g.avatar} pose={isPicked ? 'cheer' : 'idle'} size={150} style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'bottom' }} />
                </div>
                <span className="mk-title relative z-10 -mt-3 text-[clamp(28px,3.4vw,44px)]">{g.label}</span>
                {isPicked && <StarBurst x="50%" y="40%" count={16} />}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-[2%] left-[2%] flex items-end gap-2">
        <Mascot pose={picked ? 'cheer' : 'think'} size={150} />
        <div className="mb-24 max-w-[360px]">
          <SpeechBubble tail="left" text={picked ? 'Harika seçim! Hadi gidelim!' : 'Kaçıncı sınıftasın? Kartına dokun!'} />
        </div>
      </div>
    </div>
  )
}
