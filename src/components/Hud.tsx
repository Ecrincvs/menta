import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useGame } from '../state/store'
import { Avatar } from '../characters/Avatar'
import { Obj } from './ui/Obj'
import { RoundIconButton } from './ui/Controls'
import { SettingsDialog } from './SettingsDialog'
import { sfx } from '../audio/sfx'
import { levelFromXp } from '../learning/mastery'
import { GRADES } from '../content/grades'

/** Sağ üst oyun HUD'u: avatar + sınıf, yıldız, para, ayarlar (referans görseldeki düzen) */
export function Hud() {
  const { avatar, grade, stars, coins, xp, go } = useGame()
  const [open, setOpen] = useState(false)
  const lv = levelFromXp(xp)
  const gm = GRADES.find((g) => g.grade === grade)

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="flex items-center gap-2 sm:gap-3"
      >
        {/* avatar ve sınıf ayrı dokunma hedefleri (iç içe buton yok) */}
        <div className="mk-card flex items-center gap-2 rounded-full py-1 pl-1 pr-3">
          <button
            onClick={() => {
              sfx('tap')
              go({ name: 'avatar' })
            }}
            aria-label="Kaşifimi düzenle"
            className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[var(--mk-pastel-sky)] shadow transition active:scale-90"
          >
            <Avatar config={avatar} bust size={52} />
          </button>
          <span className="flex flex-col items-start leading-none">
            <button
              aria-label={`Sınıf: ${gm?.label ?? 'seçilmedi'}. Değiştir`}
              className="mk-display inline-block rounded-full px-2.5 py-0.5 text-[15px] leading-tight text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] transition active:scale-90"
              style={{ background: gm?.color ?? 'var(--mk-sky-dark)' }}
              onClick={() => {
                sfx('tap')
                go({ name: 'grade' })
              }}
            >
              {gm?.label ?? 'Sınıf seç'}
            </button>
            <span className="mt-1 flex items-center gap-1 text-[12px] font-black text-[var(--mk-ink-soft)]" aria-label={`Kaşif seviyesi ${lv.level}`}>
              Sv {lv.level}
              <span className="h-1.5 w-12 overflow-hidden rounded-full bg-[#ecd9b3]">
                <span className="block h-full rounded-full bg-[var(--mk-green)]" style={{ width: `${lv.progress * 100}%` }} />
              </span>
            </span>
          </span>
        </div>
        <div className="mk-card hidden items-center gap-1 rounded-full py-1 pl-1 pr-3 sm:flex" aria-label={`${stars} yıldız`}>
          <Obj name="star" size={36} shadow={false} />
          <AnimatedNumber value={stars} />
        </div>
        <div className="mk-card flex items-center gap-1 rounded-full py-1 pl-1 pr-3" aria-label={`${coins} altın`}>
          <Obj name="coin" size={36} shadow={false} />
          <AnimatedNumber value={coins} />
        </div>
        <RoundIconButton label="Ayarlar" onClick={() => setOpen(true)} size={56}>
          <Obj name="gear" size={36} shadow={false} />
        </RoundIconButton>
      </motion.div>
      <AnimatePresence>{open && <SettingsDialog onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.5, color: '#e8a40c' }}
      animate={{ scale: 1, color: '#4a2c17' }}
      className="mk-display min-w-[2ch] text-[clamp(18px,2vw,24px)] leading-none"
    >
      {value.toLocaleString('tr-TR')}
    </motion.span>
  )
}
