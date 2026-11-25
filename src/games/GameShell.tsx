import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Backdrop, type BackdropKind } from '../components/Backdrop'
import { BackButton, CandyButton, Hearts, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Mascot, type MascotPose } from '../characters/Mascot'
import { Robo } from '../characters/Robo'
import type { Host } from '../content/types'

function HostView({ host, pose, size }: { host?: Host; pose: MascotPose; size: number }) {
  return host === 'robo' ? <Robo pose={pose} size={size} /> : <Mascot pose={pose} size={size} />
}
import type { GameMeta } from '../content/types'
import { CompletionScreen } from './CompletionScreen'
import type { Feedback, GameResultSummary } from './useRoundEngine'
import { useGame } from '../state/store'

/** İlerleme noktaları (kaçıncı soru) */
export function ProgressDots({ index, total }: { index: number; total: number }) {
  return (
    <div className="mk-card flex items-center gap-1.5 rounded-full px-3 py-2" aria-label={`Soru ${index + 1} / ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className="block h-3.5 rounded-full"
          animate={{
            width: i === index ? 28 : 14,
            background: i < index ? '#5bc236' : i === index ? '#ff9a2e' : '#e3d2ae',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Oyun kabuğu: giriş (nasıl oynanır + gerekirse yeniden anlatım) → oyun → tamamlanma.
 */
export function GameShell({
  meta,
  backdrop,
  intro,
  reteach,
  index,
  total,
  hearts,
  feedback,
  message,
  result,
  onContinueReveal,
  onReplay,
  children,
  mascotPose,
  host,
}: {
  host?: Host
  meta: GameMeta
  backdrop: BackdropKind
  intro: { text: string; demo: ReactNode; title?: string }
  reteach?: { text: string; demo: ReactNode } | null
  index: number
  total: number
  hearts: number
  feedback: Feedback
  message: string | null
  result: GameResultSummary | null
  onContinueReveal: () => void
  onReplay: () => void
  children: ReactNode
  mascotPose?: MascotPose
}) {
  const [phase, setPhase] = useState<'reteach' | 'intro' | 'play'>(reteach ? 'reteach' : 'intro')
  const back = useGame((s) => s.back)
  const pose: MascotPose =
    mascotPose ?? (feedback === 'correct' ? 'cheer' : feedback === 'wrong' ? 'surprised' : feedback === 'reveal' ? 'think' : 'idle')

  return (
    <div className="absolute inset-0">
      <Backdrop kind={backdrop} />

      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton onClick={back} label="Oyundan çık" />
        <div className="mt-2">
          <WoodSign color="#ff9a2e">{meta.title}</WoodSign>
        </div>
        <Hearts count={hearts} />
      </header>

      {phase === 'play' && (
        <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
          <ProgressDots index={index} total={total} />
        </div>
      )}

      {phase === 'play' && children}

      {/* Mesaj + açıklama */}
      <AnimatePresence>
        {phase === 'play' && message && !result && (
          <motion.div
            key={message}
            className="absolute bottom-[64px] left-3 z-40 flex w-[min(440px,40vw)] min-w-[280px] flex-col items-start gap-3"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
          >
            <div
              className={`mk-card flex w-full flex-wrap items-center gap-3 px-4 py-3 ${feedback === 'correct' ? '!border-[var(--mk-green)]' : feedback === 'reveal' ? '!border-[var(--mk-sky)]' : '!border-[var(--mk-orange)]'}`}
              role="status"
            >
              <div className="shrink-0">
                <HostView host={host} pose={pose} size={feedback === 'reveal' ? 90 : 72} />
              </div>
              <p className="mk-display flex-1 text-[clamp(18px,2.2vw,26px)] leading-tight">{message}</p>
              {feedback === 'reveal' && (
                <CandyButton color="green" onClick={onContinueReveal} aria-label="Devam et">
                  Devam
                </CandyButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GİRİŞ / YENİDEN ANLATIM */}
      <AnimatePresence>
        {phase !== 'play' && (
          <motion.div
            key={phase}
            className="absolute inset-0 z-40 grid place-items-center overflow-y-auto bg-[rgba(40,30,80,0.35)] p-4 pt-9 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mk-card relative flex w-[min(820px,96vw)] flex-col items-center gap-4 p-5 pt-10 sm:flex-row sm:items-end sm:p-7 [@media(max-height:560px)]:gap-2 [@media(max-height:560px)]:p-3 [@media(max-height:560px)]:pt-8"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <div className="mk-wood flex items-center gap-2 rounded-2xl px-5 py-1">
                  <Obj name={phase === 'reteach' ? 'bulb' : meta.icon} size={38} />
                  <span className="mk-title whitespace-nowrap text-[26px]">{phase === 'reteach' ? 'Hatırlayalım!' : intro.title ? `${intro.title}: ${meta.title}` : meta.title}</span>
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <HostView host={host} pose={phase === 'reteach' ? 'think' : 'wave'} size={170} />
              </div>
              <div className="flex flex-1 flex-col items-center gap-4 [@media(max-height:560px)]:gap-2">
                <div className="grid min-h-[180px] w-full place-items-center rounded-2xl bg-white/70 p-3 [@media(max-height:560px)]:min-h-0 [@media(max-height:560px)]:p-1 [@media(max-height:560px)]:[zoom:0.6]">{phase === 'reteach' ? reteach!.demo : intro.demo}</div>
                <SpeechBubble autoSpeak tail="none" text={phase === 'reteach' ? reteach!.text : intro.text} className="w-full" />
                <CandyButton
                  color="green"
                  className="!min-h-[80px] !px-12 [@media(max-height:560px)]:!min-h-[56px]"
                  onClick={() => setPhase(phase === 'reteach' ? 'intro' : 'play')}
                  aria-label={phase === 'reteach' ? 'Anladım' : 'Başla'}
                >
                  {phase === 'reteach' ? 'Anladım!' : 'Başla!'}
                </CandyButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{result && <CompletionScreen result={result} meta={meta} onReplay={onReplay} />}</AnimatePresence>
    </div>
  )
}
