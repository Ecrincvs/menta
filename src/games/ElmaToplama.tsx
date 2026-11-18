/**
 * ELMA TOPLAMA — somut nesnelerle toplama/çıkarma (ileri/geri sayma stratejisi).
 * Mekanik: elmaları sürükle (veya dokun) → sepet/tabak → sonucu seç.
 * Seviye 1: sayaç görünür + sesli ileri sayma. Seviye 2: sayaç gizli. Seviye 3: çıkarma da gelir.
 */
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GameShell } from './GameShell'
import { useRoundEngine } from './useRoundEngine'
import { gameById } from '../content/games'
import { appleQuestion, type AppleQuestion } from '../learning/questions'
import { Obj } from '../components/ui/Obj'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { StarBurst } from '../components/fx/Confetti'
import { Robo } from '../characters/Robo'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'
import { useBackgroundArt } from '../art/artRegistry'

const META = gameById('elma-toplama')!
const PILE_MAX = 12

/** Sepetteki elma yığını yerleşimi (alttan üste piramit) */
function pileSlots(n: number) {
  const slots: { x: number; y: number }[] = []
  const rows = [5, 4, 3]
  let k = 0
  for (let r = 0; r < rows.length && k < n; r++) {
    // satırdaki gerçek elma sayısına göre ortala
    const w = Math.min(rows[r], n - k)
    for (let i = 0; i < w; i++, k++) slots.push({ x: (i - (w - 1) / 2) * 38 + (r % 2) * 4, y: -r * 24 })
  }
  return slots
}

export default function ElmaToplama({ onReplay }: { onReplay: () => void }) {
  const needsReview = useGame((s) => s.skills[META.skill]?.needsReview ?? false)
  const make = useCallback(
    (rng: Parameters<typeof appleQuestion>[0], grade: Parameters<typeof appleQuestion>[1], level: Parameters<typeof appleQuestion>[2]) => appleQuestion(rng, grade, level),
    [],
  )
  const eng = useRoundEngine<AppleQuestion>({ gameId: META.id, skill: META.skill, total: 6, make })
  const q = eng.question
  const [moved, setMoved] = useState(0)
  const [counting, setCounting] = useState(false)
  const [bump, setBump] = useState(0)
  const targetRef = useRef<HTMLDivElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const orchardArt = useBackgroundArt('orchard')
  const isAdd = q.op === '+'
  const showCount = eng.level === 1
  const phase: 'drag' | 'answer' = moved < q.b ? 'drag' : 'answer'
  const solved = eng.feedback === 'correct' || eng.feedback === 'reveal'

  useEffect(() => {
    setMoved(0)
    setCounting(false)
  }, [eng.index])

  useEffect(() => {
    if (phase === 'answer' && !solved) {
      const t = setTimeout(() => speak(isAdd ? 'Şimdi sepette kaç elma var?' : 'Sepette kaç elma kaldı?'), 700)
      return () => clearTimeout(t)
    }
  }, [phase, solved, isAdd])

  const basketCount = isAdd ? q.a + moved : q.a - moved

  const moveOne = () => {
    if (moved >= q.b) return
    const n = moved + 1
    setMoved(n)
    setBump((b) => b + 1)
    sfx('drop')
    if (showCount) speak(String(isAdd ? q.a + n : q.a - n), { rate: 1 })
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const r = targetRef.current?.getBoundingClientRect()
    if (!r) return false
    const pad = 40
    const inside = info.point.x > r.left - pad && info.point.x < r.right + pad && info.point.y > r.top - pad && info.point.y < r.bottom + pad
    if (inside) moveOne()
    return inside
  }

  const choose = (n: number) => {
    if (phase !== 'answer' || solved) return
    if (n === q.answer) eng.answer(true, { delay: 2600 })
    else {
      setCounting(true)
      setTimeout(() => setCounting(false), 4000)
      eng.answer(false, {
        hint: isAdd ? 'Bir daha deneyelim! Sepetteki elmaları birlikte sayalım.' : 'Bir daha deneyelim! Sepette kalan elmaları sayalım.',
        explain: q.explain,
      })
    }
  }

  // kaynak elmalar (toplama: ağaçta, çıkarma: sepetteki yığından)
  const treeApples = useMemo(
    () =>
      Array.from({ length: q.b }).map((_, i) => ({
        id: i,
        x: [18, 52, 80, 34, 66, 48][i % 6],
        y: [40, 22, 46, 64, 70, 48][i % 6],
      })),
    [q],
  )

  const pileN = Math.min(basketCount, PILE_MAX)
  const slots = pileSlots(pileN)

  return (
    <GameShell
      meta={META}
      host="robo"
      backdrop="orchard"
      index={eng.index}
      total={eng.total}
      hearts={eng.hearts}
      feedback={eng.feedback}
      message={eng.message}
      result={eng.result}
      onContinueReveal={eng.continueAfterReveal}
      onReplay={onReplay}
      intro={{ text: 'Elmaları tutup sepete sürükle ya da elmaya dokun. Sonra kaç elma olduğunu bul!', demo: <IntroDemo /> }}
      reteach={needsReview ? { text: 'Büyük sayıdan başlayıp ileri sayalım: beş... altı, yedi, sekiz! Beş artı üç, sekiz eder.', demo: <ReteachDemo /> } : null}
    >
      {/* hikâye balonu */}
      <div className="absolute left-[3%] top-[92px] z-20 w-[min(560px,52vw)] sm:top-[100px]">
        <SpeechBubble key={eng.index} text={q.story} tail="none" />
      </div>

      {/* işlem tahtası */}
      <motion.div
        key={`board-${eng.index}`}
        initial={{ y: -60, rotate: 6, opacity: 0 }}
        animate={{ y: 0, rotate: -2, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12 }}
        className="mk-wood absolute right-[3%] top-[96px] z-20 flex flex-col items-center rounded-[22px] px-6 py-2 sm:top-[104px]"
      >
        <div className="mk-title flex items-center gap-2 text-[clamp(38px,5vw,62px)]" aria-label={`${q.a} ${isAdd ? 'artı' : 'eksi'} ${q.b} eşittir ${solved ? q.answer : 'kaç'}`}>
          <span>{q.a}</span>
          <span style={{ color: isAdd ? '#9fff7a' : '#ffb0a8' }}>{isAdd ? '+' : '−'}</span>
          <span>{q.b}</span>
          <span>=</span>
          <motion.span key={solved ? 'a' : 'q'} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: solved ? '#bfff9a' : '#ffe066' }}>
            {solved ? q.answer : '?'}
          </motion.span>
        </div>
        {solved && <p className="max-w-[300px] pb-1 text-center text-[15px] font-extrabold text-white [text-shadow:0_1px_0_#5c3415]">{q.explain}</p>}
      </motion.div>

      {/* SEPET */}
      <div className="absolute left-[14%] top-[34%] z-10 flex w-[clamp(220px,28vw,330px)] flex-col items-center sm:left-[18%]">
        <div ref={targetRef} className="relative flex w-full flex-col items-center" aria-label={`Sepet, ${showCount || solved ? basketCount : 'kaç'} elma`}>
          {/* hedef parıltısı */}
          {phase === 'drag' && isAdd && (
            <motion.div
              className="absolute inset-x-6 bottom-4 top-10 rounded-full"
              animate={{ boxShadow: ['0 0 0 0 rgba(255,210,63,0)', '0 0 40px 18px rgba(255,210,63,0.55)', '0 0 0 0 rgba(255,210,63,0)'] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
          <motion.div key={bump} animate={{ scale: [1, 1.07, 0.97, 1] }} transition={{ duration: 0.35 }} className="relative">
            <Obj name="basket" size={'clamp(200px, 25vw, 300px)'} alt="" />
            {/* elma yığını */}
            <div className="absolute left-1/2 top-[34%] h-0 w-0">
              <AnimatePresence>
                {slots.map((s, i) => {
                  const draggable = !isAdd && phase === 'drag' && i === pileN - 1 // çıkarmada en üstteki elma
                  return (
                    <motion.div
                      key={`p${i}`}
                      className="absolute"
                      style={{ left: s.x - 26, top: s.y - 30, width: 52, height: 52, zIndex: 10 + i, touchAction: 'none' }}
                      initial={{ scale: 0, y: -60 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                      drag={draggable}
                      dragSnapToOrigin
                      dragElastic={0.4}
                      whileDrag={{ scale: 1.3, zIndex: 100 }}
                      onDragEnd={(_e, info) => {
                        if (!draggable) return
                        const r = plateRef.current?.getBoundingClientRect()
                        if (r && info.point.x > r.left - 50 && info.point.x < r.right + 50 && info.point.y > r.top - 50 && info.point.y < r.bottom + 50) moveOne()
                      }}
                      onTap={() => draggable && moveOne()}
                    >
                      <Obj name="apple" size={52} />
                      {counting && (
                        <motion.span
                          className="absolute -top-3 left-1/2 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-white text-[15px] font-black text-[var(--mk-ink)] shadow"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.3, 1] }}
                          transition={{ delay: i * 0.3 }}
                          onAnimationStart={() => {
                            if (i < 10) setTimeout(() => speak(String(i + 1), { rate: 1.1 }), i * 300)
                          }}
                        >
                          {i + 1}
                        </motion.span>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
          {/* sayaç etiketi */}
          <motion.div
            key={`c${basketCount}-${showCount}`}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="mk-card -mt-4 grid h-14 min-w-14 place-items-center rounded-2xl px-3"
          >
            <span className="mk-display text-[32px] leading-none">{showCount || solved ? basketCount : '?'}</span>
          </motion.div>
          {basketCount > PILE_MAX && <span className="mt-1 text-[14px] font-extrabold">Sepette {PILE_MAX}'den fazla elma var!</span>}
          {eng.feedback === 'correct' && <StarBurst x="50%" y="40%" count={14} />}
        </div>
      </div>

      {/* KAYNAK: toplamada ağaç dalı, çıkarmada Fındık'ın tabağı */}
      {isAdd ? (
        <div className="absolute right-[4%] top-[38%] z-20 h-[38%] w-[clamp(260px,34vw,440px)]">
          {!orchardArt && (
          <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            <path d="M400 70 C 300 60, 200 90, 20 60" stroke="#8a5a32" strokeWidth="22" fill="none" strokeLinecap="round" />
            <path d="M260 72 C 240 120, 200 150, 170 180" stroke="#8a5a32" strokeWidth="12" fill="none" strokeLinecap="round" />
            {[
              [40, 50, 30], [110, 40, 34], [190, 56, 36], [280, 44, 34], [360, 58, 30], [220, 140, 30], [150, 30, 26], [320, 80, 26],
            ].map(([x, y, r], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill={i % 2 ? '#5cb83a' : '#74c94a'} transform={`rotate(${i * 23} ${x} ${y})`} />
              </g>
            ))}
          </svg>
          )}
          <AnimatePresence>
            {treeApples.slice(moved).map((ap) => (
              <motion.div
                key={`${eng.index}-${ap.id}`}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{ left: `${ap.x}%`, top: `${ap.y}%`, touchAction: 'none', zIndex: 30 }}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: [0, -6, 6, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ rotate: { duration: 2.5, repeat: Infinity, delay: ap.id * 0.3 }, scale: { type: 'spring', delay: 0.3 + ap.id * 0.1 } }}
                drag
                dragSnapToOrigin
                dragElastic={0.5}
                whileHover={{ scale: 1.15 }}
                whileDrag={{ scale: 1.35, zIndex: 100, rotate: 0 }}
                onDragStart={() => sfx('pick')}
                onDragEnd={onDragEnd}
                onTap={moveOne}
                aria-label="Elma"
                role="button"
              >
                <div className="relative">
                  <Obj name="apple" size={'clamp(58px, 6.5vw, 80px)'} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="absolute bottom-[14%] right-[4%] z-20 flex flex-col items-center">
          <Robo pose={moved > 0 ? 'cheer' : 'wave'} size={170} />
          <div ref={plateRef} className="relative -mt-6 grid h-24 w-[220px] place-items-center rounded-[50%] border-4 border-[#d9c3a0] bg-white shadow-[0_8px_0_#cdb68a]" aria-label="Robo'nun tabağı">
            <div className="flex flex-wrap justify-center gap-0.5 px-4">
              {Array.from({ length: moved }).map((_, i) => (
                <motion.div key={i} initial={{ scale: 0, y: -40 }} animate={{ scale: 1, y: 0 }}>
                  <Obj name="apple" size={36} />
                </motion.div>
              ))}
            </div>
            {moved === 0 && <span className="text-[14px] font-extrabold text-[var(--mk-ink-soft)]">Buraya bırak</span>}
          </div>
        </div>
      )}

      {/* yönerge/ilerleme */}
      {phase === 'drag' && (
        <motion.div
          className="mk-card absolute bottom-[64px] left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="mk-display text-[clamp(17px,2vw,22px)]">
            {isAdd ? `Elmaları sepete taşı: ${moved} / ${q.b}` : `Robo'ya ${q.b} elma ver: ${moved} / ${q.b}`}
          </span>
        </motion.div>
      )}

      {/* CEVAP KAROLARI */}
      <AnimatePresence>
        {phase === 'answer' && (
          <motion.div
            className="absolute bottom-[64px] left-[44%] z-30 flex gap-[clamp(10px,1.8vw,22px)] sm:left-[46%]"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            role="group"
            aria-label="Cevaplar"
          >
            {q.options.map((n, i) => {
              const won = solved && n === q.answer
              return (
                <motion.button
                  key={`${eng.index}-${n}`}
                  aria-label={String(n)}
                  initial={{ y: 60, rotate: -8 }}
                  animate={{ y: 0, rotate: 0, scale: won ? 1.12 : 1 }}
                  transition={{ type: 'spring', delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => choose(n)}
                  className="mk-display grid place-items-center rounded-[22px]"
                  style={{
                    width: 'clamp(84px, 10vw, 120px)',
                    height: 'clamp(84px, 10vw, 120px)',
                    fontSize: 'clamp(44px, 5.4vw, 64px)',
                    color: won ? '#fff' : '#6b3a1a',
                    background: won ? 'linear-gradient(180deg,#9ff07a,#5bc236)' : 'linear-gradient(180deg,#ffe9b8 0%,#f6cf86 60%,#e9b866 100%)',
                    border: `4px solid ${won ? '#3a8f1d' : '#b97b3f'}`,
                    boxShadow: `inset 0 4px 0 rgba(255,255,255,0.6), 0 7px 0 ${won ? '#2f7a16' : '#8a5a2b'}, 0 14px 22px rgba(0,0,0,0.25)`,
                  }}
                >
                  {n}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  )
}

function IntroDemo() {
  return (
    <div className="relative flex items-end gap-10">
      <div className="relative">
        <Obj name="basket" size={150} />
        <div className="absolute left-1/2 top-[30%] flex -translate-x-1/2 gap-0.5">
          {[0, 1].map((i) => (
            <Obj key={i} name="apple" size={34} />
          ))}
        </div>
      </div>
      <motion.div
        className="absolute"
        animate={{ x: [190, 50, 50], y: [-10, 10, 10], opacity: [1, 1, 0], scale: [1.2, 1, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.7, 1] }}
      >
        <Obj name="apple" size={52} />
      </motion.div>
      <motion.span
        className="mk-title text-[44px]"
        animate={{ scale: [0, 0, 1.3, 1], opacity: [0, 0, 1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.65, 0.8, 1] }}
      >
        +1
      </motion.span>
    </div>
  )
}

function ReteachDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="mk-card mr-2 grid h-14 w-14 place-items-center rounded-2xl">
          <span className="mk-display text-[30px]">5</span>
        </div>
        {[6, 7, 8].map((n, i) => (
          <motion.div
            key={n}
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.6 + i * 0.7, repeat: Infinity, repeatDelay: 2.4, duration: 0.5 }}
          >
            <Obj name="apple" size={48} />
            <span className="mk-display text-[24px] text-[var(--mk-green-dark)]">{n}</span>
          </motion.div>
        ))}
      </div>
      <span className="mk-display text-[28px]">5 + 3 = 8</span>
    </div>
  )
}
