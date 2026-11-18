/**
 * ORTAK OYUN MOTORU — tüm dersler ve sınıflar için.
 * Mekanikler: seçmeli (karo / geniş / baloncuk / hikâye), sıralama (tren / zincir), ayırma (sepetler).
 * Bkz. game-mechanics-developer skill.
 */
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GameShell } from '../GameShell'
import { useRoundEngine } from '../useRoundEngine'
import { gameById, introFor } from '../../content/games'
import { GENERATORS } from '../../content/generators'
import type { ChoiceQ, Option, OrderQ, Question, SortQ } from './types'
import { VisualView } from './Visuals'
import { InputView, LessonView, MatchView, MemoryView } from './InteractiveViews'
import { TraceView } from './TraceView'
import { Obj } from '../../components/ui/Obj'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { StarBurst } from '../../components/fx/Confetti'
import { useGame } from '../../state/store'
import { sfx } from '../../audio/sfx'
import { speak } from '../../audio/speech'
import { makeRng, shuffle } from '../../learning/rng'
import { LETTER_ORDER } from '../../content/letters'
import type { Grade } from '../../content/types'
import type { Feedback } from '../useRoundEngine'

type Answer = (correct: boolean, opts?: { explain?: string; hint?: string; delay?: number }) => void

export default function QuizGame({ gameId, onReplay }: { gameId: string; onReplay: () => void }) {
  const meta = gameById(gameId)!
  const gen = GENERATORS[gameId]
  const grade = (useGame.getState().grade ?? meta.grades[0]) as Grade
  const needsReview = useGame((s) => s.skills[meta.skill]?.needsReview ?? false)
  const make = useCallback((rng: Parameters<typeof gen>[0], g: Grade, l: Parameters<typeof gen>[2], h: Question[]) => gen(rng, g, l, h), [gen])
  const eng = useRoundEngine<Question>({ gameId, skill: meta.skill, total: meta.total ?? 6, make })
  const q = eng.question

  // Okuma Yazma Yolu: durak bitince öğrenilen son harf ilerler
  useEffect(() => {
    if (!eng.result || !gameId.startsWith('oy-')) return
    const i = LETTER_ORDER.indexOf(gameId.slice(3))
    const st = useGame.getState()
    if (i > st.letterIdx) st.setLetterIdx(i)
  }, [eng.result, gameId])

  // yeniden anlatım: kolay seviyede çözümlü bir örnek
  const example = useMemo(() => (needsReview ? gen(makeRng(7), grade, 1, []) : null), [needsReview, gen, grade])

  return (
    <GameShell
      meta={meta}
      backdrop={meta.backdrop}
      host={meta.host}
      index={eng.index}
      total={eng.total}
      hearts={eng.hearts}
      feedback={eng.feedback}
      message={eng.message}
      result={eng.result}
      onContinueReveal={eng.continueAfterReveal}
      onReplay={onReplay}
      intro={
        meta.lesson
          ? { text: meta.lesson.text, demo: <LessonView lesson={meta.lesson} />, title: 'Öğrenelim' }
          : { text: introFor(meta, grade), demo: <IntroDemo icon={meta.icon} /> }
      }
      reteach={
        example
          ? { text: `Birlikte bir örneğe bakalım: ${example.explain}`, demo: <ExampleView q={example} /> }
          : null
      }
    >
      <div key={eng.index} className="absolute inset-x-0 bottom-[56px] top-[86px] z-10 sm:top-[96px]">
        {q.type === 'choice' && <ChoiceView q={q} feedback={eng.feedback} answer={eng.answer} />}
        {q.type === 'order' && <OrderView q={q} feedback={eng.feedback} answer={eng.answer} />}
        {q.type === 'sort' && <SortView q={q} feedback={eng.feedback} answer={eng.answer} />}
        {q.type === 'match' && <MatchView q={q} feedback={eng.feedback} answer={eng.answer} />}
        {q.type === 'input' && <InputView q={q} feedback={eng.feedback} answer={eng.answer} />}
        {q.type === 'memory' && <MemoryView q={q} answer={eng.answer} />}
        {q.type === 'trace' && <TraceView q={q} feedback={eng.feedback} answer={eng.answer} />}
      </div>
    </GameShell>
  )
}

function IntroDemo({ icon }: { icon: string }) {
  return (
    <motion.div animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity }}>
      <Obj name={icon} size={150} />
    </motion.div>
  )
}

function ExampleView({ q }: { q: Question }) {
  if (q.type === 'choice')
    return (
      <div className="flex flex-col items-center gap-2">
        {q.visual && <VisualView v={q.visual} size="sm" />}
        <p className="mk-display text-center text-[18px]">{q.prompt}</p>
        <span className="rounded-xl bg-[var(--mk-green)] px-3 py-1 font-black text-white">{optionText(q.options[q.answer])}</span>
      </div>
    )
  if (q.type === 'order')
    return (
      <div className="flex flex-wrap justify-center gap-1">
        {q.pieces.map((p, i) => (
          <span key={i} className="mk-display rounded-xl bg-[var(--mk-green)] px-3 py-1 text-[20px] text-white">
            {p}
          </span>
        ))}
      </div>
    )
  if (q.type === 'trace')
    return <span className="mk-display text-[80px] text-[var(--mk-orange)]">{q.letter}</span>
  if (q.type === 'input')
    return (
      <div className="flex flex-col items-center gap-2">
        {q.visual && <VisualView v={q.visual} size="sm" />}
        <p className="mk-display text-center text-[18px]">{q.prompt}</p>
        <span className="rounded-xl bg-[var(--mk-green)] px-3 py-1 font-black text-white">{q.answer}</span>
      </div>
    )
  if (q.type === 'match' || q.type === 'memory') {
    const pairs = q.type === 'match' ? q.pairs.map((p) => [p.left, p.right]) : q.pairs.map((p) => [p.a, p.b])
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {pairs.slice(0, 3).map(([a, b], i) => (
          <span key={i} className="mk-display rounded-xl bg-[var(--mk-green)] px-3 py-1 text-[18px] text-white">
            {optionText(a) || '🖼'} = {optionText(b) || '🖼'}
          </span>
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      {q.bins.map((b) => (
        <div key={b.id} className="rounded-xl px-3 py-2 text-center text-white" style={{ background: b.color }}>
          <p className="mk-display">{b.label}</p>
          <p className="text-[12px] font-bold">{q.items.find((i) => i.bin === b.id)?.label}</p>
        </div>
      ))}
    </div>
  )
}

const optionText = (o: Option) => o.label ?? ''

/* ================================ SEÇMELİ ================================ */
function ChoiceView({ q, feedback, answer }: { q: ChoiceQ; feedback: Feedback; answer: Answer }) {
  const [wrong, setWrong] = useState<number[]>([])
  const [shake, setShake] = useState<number | null>(null)
  const solved = feedback === 'correct' || feedback === 'reveal'

  const pickOpt = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (i === q.answer) answer(true)
    else {
      setWrong((w) => [...w, i])
      setShake(i)
      setTimeout(() => setShake(null), 450)
      answer(false, { explain: q.explain, hint: q.hint })
    }
  }

  const state = (i: number) => (solved && i === q.answer ? (feedback === 'correct' ? 'win' : 'glow') : wrong.includes(i) ? 'wrong' : 'idle')

  if (q.passage) return <StoryView q={q} state={state} pick={pickOpt} shake={shake} />
  if (q.layout === 'bubbles') return <BubbleView q={q} state={state} pick={pickOpt} shake={shake} feedback={feedback} />

  const wide = q.layout === 'wide' || q.options.some((o) => (o.label?.length ?? 0) > 14)
  const visualOpts = q.options.some((o) => o.visual || o.img)
  const allShort = !visualOpts && q.options.every((o) => (o.label?.length ?? 0) <= 5)
  return (
    <div className="flex h-full flex-col items-center justify-start gap-3 px-3">
      <div className="w-[min(760px,92vw)]">
        <SpeechBubble text={q.prompt} spoken={q.spoken} tail="none" size={q.prompt.length > 60 ? 'md' : 'lg'} />
      </div>
      <div className={`flex w-full flex-1 items-center justify-center gap-6 ${q.visual ? 'flex-col md:flex-row' : 'flex-col'}`}>
        {q.visual && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className="relative grid max-w-[min(560px,90vw)] place-items-center rounded-[28px] bg-white/55 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-[2px]">
            <VisualView v={q.visual} />
            {feedback === 'correct' && <StarBurst />}
          </motion.div>
        )}
        <div className={wide ? 'flex w-[min(620px,92vw)] flex-col gap-3' : `grid gap-[clamp(10px,1.6vw,20px)] ${q.options.length === 4 && visualOpts ? 'grid-cols-2' : 'grid-flow-col'}`} role="group" aria-label="Cevaplar">
          {q.options.map((o, i) => (
            <OptionTile key={i} o={o} wide={wide} big={allShort} state={state(i)} shake={shake === i} delay={i * 0.07} onClick={() => pickOpt(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}

type TileState = 'idle' | 'wrong' | 'win' | 'glow'
function tileStyle(state: TileState) {
  const win = state === 'win'
  const glow = state === 'glow'
  return {
    background: state === 'wrong' ? 'linear-gradient(180deg,#eee3d0,#d9c9ab)' : win ? 'linear-gradient(180deg,#a7f283,#5bc236)' : 'linear-gradient(180deg,#fff3d1 0%,#f6cf86 62%,#e9b866 100%)',
    border: `4px solid ${win ? '#3a8f1d' : glow ? '#2a7fd4' : '#b97b3f'}`,
    boxShadow: `inset 0 4px 0 rgba(255,255,255,0.6), 0 7px 0 ${win ? '#2f7a16' : '#8a5a2b'}, 0 14px 22px rgba(0,0,0,0.22)${glow ? ', 0 0 0 6px rgba(90,184,245,0.55), 0 0 28px 6px rgba(90,184,245,0.55)' : ''}`,
    color: win ? '#fff' : '#5a3417',
    opacity: state === 'wrong' ? 0.55 : 1,
  }
}

function OptionTile({ o, wide, big: bigProp, state, shake, delay, onClick }: { o: Option; wide: boolean; big?: boolean; state: TileState; shake: boolean; delay: number; onClick: () => void }) {
  const big = !wide && !!bigProp
  return (
    <motion.button
      aria-label={o.label ?? 'Seçenek'}
      initial={{ y: 40, opacity: 0, scale: 0.9 }}
      animate={shake ? { x: [0, -12, 12, -8, 8, 0], y: 0, opacity: 1, scale: 1 } : { y: 0, opacity: 1, x: 0, scale: state === 'win' || state === 'glow' ? 1.06 : 1 }}
      transition={shake ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 20, delay }}
      whileHover={state === 'idle' ? { y: -6 } : {}}
      whileTap={state === 'idle' ? { scale: 0.94 } : {}}
      onClick={onClick}
      disabled={state === 'wrong'}
      className={`relative flex items-center justify-center gap-2 rounded-[22px] ${wide ? 'min-h-[66px] w-full px-5 py-3 text-left' : big ? 'h-[clamp(84px,10vw,120px)] min-w-[clamp(84px,10vw,120px)] px-4' : 'min-h-[clamp(84px,10vw,120px)] min-w-[clamp(120px,14vw,170px)] flex-col px-4 py-3'}`}
      style={tileStyle(state)}
    >
      {o.img && <Obj name={o.img} size={wide ? 44 : 72} shadow={false} />}
      {o.visual && <VisualView v={o.visual} size="sm" />}
      {o.label && (
        <span className={`mk-display leading-tight ${big ? 'text-[clamp(38px,5vw,60px)]' : wide ? 'text-[clamp(18px,2vw,23px)]' : 'text-[clamp(20px,2.3vw,28px)] text-center'}`} style={{ textShadow: state === 'win' ? '0 2px 0 #2f7a16' : undefined }}>
          {o.label}
        </span>
      )}
      {state === 'wrong' && <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-[15px] shadow">✗</span>}
      {state === 'win' && <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-[18px] text-[var(--mk-green-dark)] shadow">✓</span>}
    </motion.button>
  )
}

/* ---------------- Harf Avı: yüzen baloncuklar ---------------- */
const BUBBLE_COLORS = ['#ff7aa8', '#ffb020', '#2ec4c9', '#9b6ef3', '#5bc236', '#5ab8f5']
function BubbleView({ q, state, pick, shake, feedback }: { q: ChoiceQ; state: (i: number) => TileState; pick: (i: number) => void; shake: number | null; feedback: Feedback }) {
  const calm = useGame((s) => s.settings.calm)
  const pos = useMemo(() => {
    const r = makeRng(q.options.length * 31 + q.prompt.length)
    const base = [[18, 28], [46, 18], [74, 30], [30, 60], [62, 62], [86, 55]]
    return shuffle(r, base).slice(0, q.options.length).map(([x, y]) => ({ x: x + r() * 6 - 3, y: y + r() * 6 - 3, d: r() * 2 }))
  }, [q])
  return (
    <div className="relative flex h-full flex-col items-center px-3">
      <div className="z-10 w-[min(640px,92vw)]">
        <SpeechBubble text={q.prompt} spoken={q.spoken} tail="none" size="lg" />
      </div>
      {q.visual && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }} className="z-10 mt-2 rounded-[28px] bg-white/60 p-3 shadow-lg backdrop-blur-[2px]">
          <VisualView v={q.visual} size="sm" />
        </motion.div>
      )}
      <div className="relative w-full flex-1">
        {q.options.map((o, i) => {
          const st = state(i)
          const c = BUBBLE_COLORS[i % BUBBLE_COLORS.length]
          return (
            <motion.button
              key={i}
              aria-label={`${o.label} harfi`}
              onClick={() => {
                sfx('pop')
                pick(i)
              }}
              disabled={st === 'wrong'}
              className="absolute grid place-items-center rounded-full"
              style={{
                left: `${pos[i].x}%`,
                top: `${pos[i].y}%`,
                width: 'clamp(96px, 12vw, 140px)',
                height: 'clamp(96px, 12vw, 140px)',
                marginLeft: 'calc(clamp(96px, 12vw, 140px) / -2)',
                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 22%, ${c}cc 60%, ${c} 100%)`,
                boxShadow: st === 'win' ? `0 0 0 8px #5bc236, 0 0 40px 10px rgba(91,194,54,0.6)` : st === 'glow' ? '0 0 0 8px #5ab8f5, 0 0 40px 10px rgba(90,184,245,0.7)' : `inset -8px -10px 20px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.18), 0 0 30px ${c}88`,
                opacity: st === 'wrong' ? 0.25 : 1,
              }}
              initial={{ scale: 0, y: 60 }}
              animate={
                st === 'win'
                  ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] }
                  : shake === i
                    ? { x: [0, -14, 14, -8, 8, 0], scale: 1, y: 0 }
                    : calm
                      ? { scale: 1, y: 0 }
                      : { scale: 1, y: [0, -14, 0], x: [0, 6, 0] }
              }
              transition={st === 'win' ? { duration: 0.6 } : shake === i ? { duration: 0.4 } : { y: { duration: 3 + pos[i].d, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 4 + pos[i].d, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', delay: i * 0.1 } }}
              whileHover={{ scale: 1.08 }}
            >
              <span className="mk-title text-[clamp(48px,6vw,72px)]">{o.label}</span>
            </motion.button>
          )
        })}
        {feedback === 'correct' && <StarBurst x="50%" y="40%" count={16} />}
      </div>
    </div>
  )
}

/* ---------------- Okuma Hikâyesi: açık kitap ---------------- */
function StoryView({ q, state, pick, shake }: { q: ChoiceQ; state: (i: number) => TileState; pick: (i: number) => void; shake: number | null }) {
  const p = q.passage!
  useEffect(() => {
    const t = setTimeout(() => speak(`${p.title}. ${p.text}`), 400)
    return () => clearTimeout(t)
  }, [p])
  return (
    <div className="flex h-full items-center justify-center px-3">
      <motion.div
        initial={{ rotateX: 30, scale: 0.85, opacity: 0 }}
        animate={{ rotateX: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        className="relative grid w-[min(1100px,96vw)] grid-cols-1 overflow-hidden rounded-[26px] border-[6px] border-[#8f3d2a] bg-[#8f3d2a] shadow-[0_24px_50px_rgba(0,0,0,0.3)] md:grid-cols-2"
      >
        {/* sol sayfa */}
        <div className="relative flex flex-col gap-2 bg-[linear-gradient(90deg,#fffaf0_0%,#fbf1dc_92%,#e9d8b4_100%)] p-5">
          <div className="flex items-center gap-2">
            {p.img && <Obj name={p.img} size={64} />}
            <h2 className="mk-display text-[clamp(22px,2.6vw,30px)] text-[#8f3d2a]">{p.title}</h2>
            <button aria-label="Metni sesli dinle" onClick={() => speak(`${p.title}. ${p.text}`, { force: true })} className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--mk-green)] text-white shadow-[0_4px_0_var(--mk-green-dark)] active:translate-y-1">
              <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
                <path d="M5 12 H11 L18 6 V26 L11 20 H5 Z" fill="#fff" />
                <path d="M22 11 Q26 16 22 21" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="font-[Nunito] text-[clamp(17px,1.9vw,22px)] font-bold leading-relaxed text-[#4a2c17]">{p.text}</p>
        </div>
        {/* sağ sayfa */}
        <div className="flex flex-col gap-3 bg-[linear-gradient(270deg,#fffaf0_0%,#fbf1dc_92%,#e9d8b4_100%)] p-5">
          <p className="mk-display text-[clamp(19px,2.2vw,26px)] leading-tight text-[#4a2c17]">{q.prompt}</p>
          <div className="flex flex-col gap-2.5" role="group" aria-label="Cevaplar">
            {q.options.map((o, i) => (
              <OptionTile key={i} o={o} wide state={state(i)} shake={shake === i} delay={0.3 + i * 0.07} onClick={() => pick(i)} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0.0),rgba(0,0,0,0.18),rgba(0,0,0,0))] md:block" />
      </motion.div>
    </div>
  )
}

/* ================================ SIRALAMA (TREN) ================================ */
function OrderView({ q, feedback, answer }: { q: OrderQ; feedback: Feedback; answer: Answer }) {
  const tiles = useMemo(() => {
    const r = makeRng(q.pieces.join().length * 13 + q.pieces.length)
    return shuffle(r, [...q.pieces.map((p, i) => ({ p, key: `p${i}` })), ...(q.extra ?? []).map((p, i) => ({ p, key: `x${i}` }))])
  }, [q])
  const [placed, setPlaced] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const revealed = feedback === 'reveal'
  const done = placed.length === q.pieces.length
  const shown = revealed ? q.pieces.map((_, i) => `p${i}`) : placed

  const tap = (key: string, text: string) => {
    if (done || revealed || placed.includes(key)) return
    const expected = q.pieces[placed.length]
    if (text === expected) {
      sfx('pick')
      const np = [...placed, key]
      setPlaced(np)
      if (np.length === q.pieces.length) {
        sfx('whoosh')
        setTimeout(() => answer(true, { delay: 2000 }), 350)
      }
    } else {
      setShake(key)
      setTimeout(() => setShake(null), 420)
      answer(false, { explain: q.explain, hint: `Bir daha deneyelim! Sıradaki parça “${expected.slice(0, 1)}” ile başlıyor.` })
    }
  }
  const textOf = (key: string) => tiles.find((t) => t.key === key)!.p

  const train = q.style === 'train'
  return (
    <div className="flex h-full flex-col items-center justify-start gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble text={train ? 'Resme bak, hece vagonlarını doğru sıraya diz!' : q.prompt} spoken={q.spoken} tail="none" />
      </div>
      {q.img && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mk-wood rounded-[22px] p-2">
          <div className="rounded-xl bg-[#fff8e9] p-2">
            <Obj name={q.img} size={'clamp(80px,11vw,130px)'} />
          </div>
        </motion.div>
      )}
      {/* tren / zincir */}
      <motion.div
        className={`flex items-end ${train ? 'gap-1' : 'flex-col gap-2'}`}
        animate={done && train ? { x: [0, 30, 900] } : { x: 0 }}
        transition={done && train ? { duration: 2, times: [0, 0.3, 1], ease: 'easeIn', delay: 0.4 } : {}}
      >
        {train && <Locomotive />}
        {q.pieces.map((_, i) => {
          const key = shown[i]
          return (
            <div key={i} className={train ? 'flex flex-col items-center' : 'w-[min(560px,90vw)]'}>
              <div
                className={`grid place-items-center rounded-2xl border-4 ${train ? 'h-[clamp(68px,8vw,92px)] min-w-[clamp(84px,10vw,118px)] px-3' : 'min-h-[54px] w-full px-4'}`}
                style={{
                  background: key ? (revealed ? '#bfe6ff' : ['#ffd23f', '#ff7aa8', '#2ec4c9', '#9b6ef3', '#5bc236', '#ff9a2e'][i % 6]) : 'rgba(255,255,255,0.65)',
                  borderColor: key ? 'rgba(0,0,0,0.25)' : '#d9c3a0',
                  borderStyle: key ? 'solid' : 'dashed',
                  boxShadow: key ? 'inset 0 4px 0 rgba(255,255,255,0.45), 0 6px 0 rgba(0,0,0,0.18)' : 'none',
                }}
              >
                <AnimatePresence>
                  {key && (
                    <motion.span initial={{ scale: 0, y: -40 }} animate={{ scale: 1, y: 0 }} className={`mk-display ${train ? 'text-[clamp(28px,3.4vw,42px)] text-white [text-shadow:0_2px_0_rgba(0,0,0,0.3)]' : 'text-[clamp(17px,2vw,22px)] text-ink'}`}>
                      {textOf(key)}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!key && <span className="mk-display text-[22px] text-[#c9b48c]">{i + 1}</span>}
              </div>
              {train && (
                <div className="flex gap-6">
                  <Wheel />
                  <Wheel />
                </div>
              )}
            </div>
          )
        })}
      </motion.div>
      {train && <div className="h-2 w-[min(760px,92vw)] rounded-full bg-[repeating-linear-gradient(90deg,#7a4a22_0_14px,#a0673a_14px_28px)]" />}
      {/* parçalar */}
      <div className="mt-1 flex flex-wrap justify-center gap-3" role="group" aria-label="Parçalar">
        {tiles.map((t) => {
          const used = placed.includes(t.key) || revealed
          return (
            <motion.button
              key={t.key}
              aria-label={t.p}
              onClick={() => tap(t.key, t.p)}
              disabled={used}
              initial={{ y: 40, opacity: 0 }}
              animate={shake === t.key ? { x: [0, -12, 12, -8, 8, 0], y: 0, opacity: 1 } : { y: 0, opacity: used ? 0.25 : 1, scale: used ? 0.85 : 1 }}
              whileHover={!used ? { y: -6 } : {}}
              whileTap={!used ? { scale: 0.92 } : {}}
              className={`mk-display rounded-[18px] ${train ? 'min-w-[86px] px-5 py-3 text-[clamp(26px,3vw,38px)]' : 'px-4 py-2.5 text-[clamp(16px,1.9vw,21px)]'}`}
              style={tileStyle('idle')}
            >
              {t.p}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function Locomotive() {
  return (
    <svg viewBox="0 0 140 120" className="w-[clamp(100px,12vw,140px)]" aria-hidden>
      <rect x="10" y="40" width="80" height="50" rx="10" fill="#e8463c" stroke="#8f1f1b" strokeWidth="4" />
      <rect x="70" y="15" width="56" height="75" rx="10" fill="#2a7fd4" stroke="#1b5a9c" strokeWidth="4" />
      <rect x="80" y="26" width="36" height="26" rx="6" fill="#bfe6ff" />
      <rect x="22" y="18" width="18" height="26" rx="4" fill="#4a2c17" />
      <motion.circle cx="31" cy="10" r="9" fill="#fff" opacity="0.85" animate={{ cy: [10, -10], opacity: [0.85, 0], r: [8, 16] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <circle cx="30" cy="96" r="14" fill="#4a2c17" />
      <circle cx="30" cy="96" r="6" fill="#ffd23f" />
      <circle cx="98" cy="96" r="14" fill="#4a2c17" />
      <circle cx="98" cy="96" r="6" fill="#ffd23f" />
      <rect x="2" y="62" width="12" height="18" rx="4" fill="#ffd23f" />
    </svg>
  )
}
function Wheel() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#4a2c17" />
      <circle cx="12" cy="12" r="4" fill="#ffd23f" />
    </svg>
  )
}

/* ================================ AYIRMA (SEPETLER) ================================ */
function SortView({ q, feedback, answer }: { q: SortQ; feedback: Feedback; answer: Answer }) {
  const [placed, setPlaced] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [shake, setShake] = useState<number | null>(null)
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const revealed = feedback === 'reveal'
  const allPlaced = Object.keys(placed).length === q.items.length

  const drop = (i: number, binId: string) => {
    if (placed[i] || revealed) return
    if (q.items[i].bin === binId) {
      sfx('drop')
      const np = { ...placed, [i]: binId }
      setPlaced(np)
      setSelected(null)
      if (Object.keys(np).length === q.items.length) setTimeout(() => answer(true, { delay: 2200 }), 300)
    } else {
      setShake(i)
      setSelected(null)
      setTimeout(() => setShake(null), 420)
      const right = q.bins.find((b) => b.id === q.items[i].bin)!
      answer(false, { explain: q.explain, hint: `Bir daha düşünelim: “${q.items[i].label}” hangi kutuya uyar?` })
      void right
    }
  }

  const onDragEnd = (i: number, info: PanInfo) => {
    for (const b of q.bins) {
      const r = binRefs.current[b.id]?.getBoundingClientRect()
      if (r && info.point.x > r.left && info.point.x < r.right && info.point.y > r.top - 30 && info.point.y < r.bottom) {
        drop(i, b.id)
        return
      }
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      {/* öğeler */}
      <div className="flex min-h-[110px] max-w-[1000px] flex-wrap content-start justify-center gap-3">
        {q.items.map((it, i) => {
          if (placed[i] || revealed) return null
          return (
            <motion.div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={it.label}
              aria-pressed={selected === i}
              drag
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.12, zIndex: 50 }}
              onDragEnd={(_, info) => onDragEnd(i, info)}
              onTap={() => {
                sfx('tap')
                setSelected(selected === i ? null : i)
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(i)}
              initial={{ scale: 0, y: -30 }}
              animate={shake === i ? { x: [0, -12, 12, -8, 8, 0], scale: 1, y: 0 } : { scale: selected === i ? 1.08 : 1, y: selected === i ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: shake === i ? 0 : i * 0.05 }}
              className="flex cursor-grab items-center gap-2 rounded-2xl px-3 py-2 active:cursor-grabbing"
              style={{ ...tileStyle('idle'), touchAction: 'none', outline: selected === i ? '4px solid #2a7fd4' : 'none', maxWidth: 260 }}
            >
              {it.img && <Obj name={it.img} size={48} shadow={false} />}
              <span className="mk-display text-[clamp(15px,1.7vw,20px)] leading-tight">{it.label}</span>
            </motion.div>
          )
        })}
      </div>
      {/* kutular */}
      <div className="mt-auto flex w-full max-w-[1000px] items-stretch justify-center gap-[clamp(10px,2vw,24px)] pb-2">
        {q.bins.map((b) => {
          const inBin = q.items.map((it, i) => ({ it, i })).filter(({ it, i }) => (revealed ? it.bin === b.id : placed[i] === b.id))
          return (
            <motion.div
              key={b.id}
              ref={(el) => {
                binRefs.current[b.id] = el
              }}
              role="button"
              aria-label={`${b.label} kutusu`}
              onClick={() => selected !== null && drop(selected, b.id)}
              whileHover={selected !== null ? { scale: 1.04 } : {}}
              className="relative flex min-h-[clamp(150px,24vh,220px)] flex-1 flex-col items-center rounded-[26px] border-4 p-2 pt-10"
              style={{ borderColor: b.color, background: `linear-gradient(180deg, ${b.color}22, ${b.color}55)`, boxShadow: selected !== null ? `0 0 0 5px ${b.color}66` : '0 8px 20px rgba(0,0,0,0.12)', cursor: selected !== null ? 'pointer' : 'default' }}
            >
              <div className="absolute -top-5 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]" style={{ background: b.color }}>
                {b.img && <Obj name={b.img} size={30} shadow={false} />}
                <span className="mk-display text-[clamp(18px,2vw,24px)] [text-shadow:0_2px_0_rgba(0,0,0,0.25)]">{b.label}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {inBin.map(({ it, i }) => (
                  <motion.span key={i} initial={{ scale: 0, y: -40 }} animate={{ scale: 1, y: 0 }} className="flex items-center gap-1 rounded-xl bg-white/90 px-2 py-1 text-[14px] font-extrabold shadow">
                    {it.img && <Obj name={it.img} size={26} shadow={false} />}
                    {it.label}
                  </motion.span>
                ))}
              </div>
              {allPlaced && feedback === 'correct' && <StarBurst x="50%" y="30%" count={8} />}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
