/**
 * YENİ ROZET kutlaması — kuyruktaki rozetleri sırayla gösterir (her ekranın üstünde).
 * Görev Tamamlandı ekranındaki yıldız animasyonu bitsin diye kısa bir gecikmeyle açılır.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGame } from '../state/store'
import { badgeById } from '../rewards/badges'
import { Medal, TIER } from './Medal'
import { Obj } from './ui/Obj'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

export function BadgeToast() {
  const queue = useGame((s) => s.badgeQueue)
  const popBadge = useGame((s) => s.popBadge)
  const screen = useGame((s) => s.screen)
  const [ready, setReady] = useState<string | null>(null)
  const id = queue[0]
  const badge = id ? badgeById(id) : undefined

  // bekleme: oyun ekranındaysak tamamlama animasyonu için 3 sn
  useEffect(() => {
    if (!id) return
    const t = setTimeout(() => setReady(id), screen.name === 'game' ? 3000 : 400)
    return () => clearTimeout(t)
  }, [id, screen.name])

  const show = !!badge && ready === id

  useEffect(() => {
    if (!show || !badge) return
    sfx('fanfare')
    speak(`Yeni rozet kazandın: ${badge.title}! ${badge.reward} altın da senin!`)
    const t = setTimeout(() => {
      setReady(null)
      popBadge()
    }, 5200)
    return () => clearTimeout(t)
  }, [show, badge, popBadge])

  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          key={badge.id}
          className="pointer-events-auto fixed left-1/2 top-[96px] z-[70] w-[min(460px,92vw)]"
          initial={{ y: -180, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: -180, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          role="status"
          aria-live="polite"
          onClick={() => {
            setReady(null)
            popBadge()
          }}
        >
          <div className="mk-card relative flex items-center gap-4 overflow-hidden p-3 pr-5" style={{ borderColor: TIER[badge.tier].rim[1] }}>
            <motion.div
              className="pointer-events-none absolute -left-10 top-1/2 h-[220px] w-[220px] -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              style={{ background: `repeating-conic-gradient(from 0deg, ${TIER[badge.tier].rim[1]}33 0deg 12deg, transparent 12deg 26deg)` }}
            />
            <motion.div className="relative shrink-0" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 12 }}>
              <Medal icon={badge.icon} tier={badge.tier} earned size={84} />
            </motion.div>
            <div className="relative flex flex-1 flex-col">
              <span className="mk-display text-[14px] uppercase tracking-wide text-[var(--mk-purple)]">Yeni rozet · {TIER[badge.tier].label}</span>
              <span className="mk-title text-[28px] leading-tight">{badge.title}</span>
              <span className="text-[14px] font-extrabold text-[var(--mk-ink-soft)]">{badge.desc}</span>
              <span className="mt-1 flex w-fit items-center gap-1 rounded-full bg-[#fff3c4] px-2 py-0.5 shadow-sm">
                <Obj name="coin" size={22} shadow={false} />
                <span className="mk-display text-[17px]">+{badge.reward} altın</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
