/**
 * EKRAN SÜRESİ KORUYUCUSU — App içinde her zaman açık.
 * - Uygulama görünürken süre sayar (ebeveyn paneli hariç).
 * - Oyun ORTASINDA kesmez: mola/kilit, oyun bitip başka ekrana geçilince açılır.
 * - Günlük sınıra 2 dk kala nazik uyarı; sınır dolunca "Bugünlük bu kadar"; ek süreyi yalnızca ebeveyn kapısı verir.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useGame } from '../state/store'
import { BREAK_SECONDS, WARN_AT, dayKey, screenTimeState } from '../state/screenTime'
import { Mascot } from '../characters/Mascot'
import { CandyButton } from './ui/Controls'
import { Obj } from './ui/Obj'
import { ParentGate } from './SettingsDialog'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

const TICK = 5

export function ScreenTimeGuard() {
  const st = useGame()
  const [overlay, setOverlay] = useState<null | 'break' | 'limit' | 'bedtime'>(null)
  const [warn, setWarn] = useState(false)
  const warned = useRef('')
  const inGame = st.screen.name === 'game'
  const inParent = st.screen.name === 'parent'

  // süre sayacı
  useEffect(() => {
    const t = setInterval(() => {
      const s = useGame.getState()
      if (document.visibilityState !== 'visible' || s.screen.name === 'parent' || overlayRef.current) return
      s.addUsage(TICK)
    }, TICK * 1000)
    return () => clearInterval(t)
  }, [])
  const overlayRef = useRef(overlay)
  overlayRef.current = overlay

  const today = dayKey()
  const state = screenTimeState({
    limits: st.limits,
    usedToday: st.usage[today] ?? 0,
    extraMin: st.extra.day === today ? st.extra.min : 0,
    sinceBreak: st.sinceBreak,
    now: new Date(),
  })

  // karar: oyun ortasında ve ebeveyn panelinde gösterme
  useEffect(() => {
    if (inGame || inParent) return
    if (state.blocked) setOverlay(state.blocked)
    else if (state.needBreak && overlay === null) setOverlay('break')
    else if (!state.blocked && (overlay === 'limit' || overlay === 'bedtime')) setOverlay(null)
  }, [state.blocked, state.needBreak, inGame, inParent, overlay])

  // 2 dakika kala uyarı (günde bir kez)
  useEffect(() => {
    if (state.secondsLeft === null || state.secondsLeft > WARN_AT || state.secondsLeft <= 0 || warned.current === today) return
    warned.current = today
    setWarn(true)
    speak('İki dakikan kaldı! Oyununu bitirip bugünlük mola verelim.')
    const t = setTimeout(() => setWarn(false), 7000)
    return () => clearTimeout(t)
  }, [state.secondsLeft, today])

  return (
    <>
      <AnimatePresence>
        {warn && (
          <motion.div className="fixed left-1/2 top-4 z-[65] w-[min(440px,92vw)]" initial={{ y: -120, x: '-50%' }} animate={{ y: 0, x: '-50%' }} exit={{ y: -120, x: '-50%' }} role="status">
            <div className="mk-card flex items-center gap-3 p-3">
              <Obj name="hourglass" size={48} shadow={false} />
              <p className="mk-display text-[18px] leading-tight">2 dakikan kaldı! Oyununu bitirip bugünlük mola verelim.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {overlay === 'break' && (
          <BreakOverlay
            onDone={() => {
              st.takeBreak()
              setOverlay(null)
            }}
          />
        )}
        {(overlay === 'limit' || overlay === 'bedtime') && <LimitOverlay kind={overlay} />}
      </AnimatePresence>
    </>
  )
}

/** 1 dakikalık mola: 20-20-20 göz kuralı + esneme, adım adım */
const STEPS = [
  { icon: 'eyes', text: 'Ekrandan uzağa, pencereden dışarı bak.' },
  { icon: 'sparkles', text: 'Gözlerini 10 kez hızlı hızlı kırp.' },
  { icon: 'walking', text: 'Ayağa kalk, kollarını yukarı uzat ve gerin!' },
  { icon: 'droplet', text: 'Bir yudum su iç.' },
]

function BreakOverlay({ onDone }: { onDone: () => void }) {
  const [left, setLeft] = useState(BREAK_SECONDS)
  useEffect(() => {
    sfx('whoosh')
    speak('Mola zamanı! Gözlerimizi ve vücudumuzu biraz dinlendirelim.')
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const step = Math.min(STEPS.length - 1, Math.floor(((BREAK_SECONDS - left) / BREAK_SECONDS) * STEPS.length))
  useEffect(() => {
    if (left < BREAK_SECONDS) speak(STEPS[step].text)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'radial-gradient(circle at 50% 40%, #e8fbff 0%, #9fe0f2 55%, #5ab8f5 100%)' }} role="dialog" aria-modal="true" aria-label="Mola zamanı">
      <div className="mk-card flex w-[min(620px,100%)] flex-col items-center gap-3 p-6 text-center">
        <h2 className="mk-title text-[40px]">Mola Zamanı!</h2>
        <Mascot pose={left === 0 ? 'cheer' : 'wave'} size={150} />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-3 rounded-2xl bg-[var(--mk-pastel-sky)] px-4 py-3">
            <Obj name={STEPS[step].icon} size={52} shadow={false} />
            <p className="mk-display text-[22px] leading-tight">{STEPS[step].text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex w-full items-center gap-3">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#e6d8bb]">
            <motion.div className="h-full rounded-full bg-[var(--mk-turquoise)]" animate={{ width: `${((BREAK_SECONDS - left) / BREAK_SECONDS) * 100}%` }} transition={{ ease: 'linear', duration: 1 }} />
          </div>
          <span className="mk-display w-12 text-[22px]">{left}</span>
        </div>
        <CandyButton color="green" onClick={onDone} disabled={left > 0} aria-label="Devam et" className={left > 0 ? 'opacity-50' : ''}>
          {left > 0 ? 'Biraz bekle…' : 'Hazırım, devam!'}
        </CandyButton>
      </div>
    </motion.div>
  )
}

function LimitOverlay({ kind }: { kind: 'limit' | 'bedtime' }) {
  const { grantExtra, nickname } = useGame()
  const [step, setStep] = useState<'main' | 'gate' | 'grant'>('main')
  useEffect(() => {
    speak(kind === 'bedtime' ? `İyi geceler ${nickname}! Uyku vakti geldi. Yarın yeni maceralarda görüşürüz.` : `Bugün harika çalıştın ${nickname}! Bugünlük bu kadar, yarın yeni maceralarda görüşürüz.`)
  }, [kind, nickname])
  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: kind === 'bedtime' ? 'radial-gradient(circle at 50% 30%, #4b3c9e 0%, #241a5c 70%, #140e38 100%)' : 'radial-gradient(circle at 50% 40%, #fff3c4 0%, #ffbf7a 60%, #e8846a 100%)' }} role="dialog" aria-modal="true" aria-label="Bugünlük bu kadar">
      {kind === 'bedtime' &&
        Array.from({ length: 24 }).map((_, i) => (
          <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%` }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + (i % 4), repeat: Infinity }} />
        ))}
      <div className="mk-card relative flex w-[min(560px,100%)] flex-col items-center gap-3 p-6 text-center">
        {step === 'gate' && <ParentGate onPass={() => setStep('grant')} onCancel={() => setStep('main')} />}
        {step === 'grant' && (
          <>
            <h2 className="mk-title text-[30px]">Ek süre</h2>
            <p className="text-[16px] font-bold text-[var(--mk-ink-soft)]">{kind === 'bedtime' ? 'Bu gece için uyku saati kilidini kaldırır.' : 'Yalnızca bugün için geçerlidir.'}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[10, 15, 30].map((m) => (
                <CandyButton key={m} color="green" onClick={() => grantExtra(m)}>
                  +{m} dk
                </CandyButton>
              ))}
            </div>
            <button onClick={() => setStep('main')} className="text-[15px] font-extrabold text-[var(--mk-ink-soft)] underline">
              Vazgeç
            </button>
          </>
        )}
        {step === 'main' && (
          <>
            <Obj name={kind === 'bedtime' ? 'moon' : 'trophy'} size={96} />
            <h2 className="mk-title text-[36px] leading-tight">{kind === 'bedtime' ? 'Uyku Vakti!' : 'Bugünlük Bu Kadar!'}</h2>
            <p className="mk-display text-[20px] leading-snug">
              {kind === 'bedtime' ? 'Fındık da uyumaya gidiyor. Yarın yeni maceralarda görüşürüz!' : 'Bugün harika çalıştın! Gözlerin dinlensin, yarın yeni maceralar seni bekliyor.'}
            </p>
            <Mascot pose="wave" size={130} />
            <button onClick={() => setStep('gate')} className="mt-1 text-[14px] font-extrabold text-[var(--mk-ink-soft)] underline">
              Ebeveyn: ek süre ver
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
