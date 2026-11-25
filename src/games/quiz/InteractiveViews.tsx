/**
 * Etkileşimli soru türleri: EŞLEŞTİRME, SORU–CEVAP (tuş takımı), HAFIZA OYUNU ve ÖĞRENELİM konu kartı.
 * Amaç tanımadan üretmeye geçmek: çocuk cevabı kendisi yazar, eşleri kendisi kurar (game-mechanics-developer skill).
 */
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { InputQ, Lesson, MatchQ, MemoryQ, Option } from './types'
import { VisualView } from './Visuals'
import { Obj } from '../../components/ui/Obj'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { StarBurst } from '../../components/fx/Confetti'
import { sfx } from '../../audio/sfx'
import { speak } from '../../audio/speech'
import { makeRng, shuffle } from '../../learning/rng'
import type { Feedback } from '../useRoundEngine'

type Answer = (correct: boolean, opts?: { explain?: string; hint?: string; delay?: number }) => void

const PAIR_COLORS = ['#5bc236', '#2ec4c9', '#9b6ef3', '#ff9a2e', '#ff7aa8', '#2a7fd4']

function OptionFace({ o, size = 'md' }: { o: Option; size?: 'md' | 'sm' }) {
  return (
    <span className="flex flex-col items-center justify-center gap-1 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:gap-2">
      {o.img && <Obj name={o.img} size={size === 'sm' ? 'clamp(28px, 7vh, 44px)' : 'clamp(36px, 9vh, 60px)'} shadow={false} />}
      {o.visual && <VisualView v={o.visual} size="sm" />}
      {o.label && <span className={`mk-display leading-tight ${(o.label.length ?? 0) <= 3 ? 'text-[clamp(30px,3.6vw,44px)]' : 'text-[clamp(17px,2vw,24px)]'}`}>{o.label}</span>}
    </span>
  )
}

/* ================================ EŞLEŞTİRME ================================ */
export function MatchView({ q, feedback, answer }: { q: MatchQ; feedback: Feedback; answer: Answer }) {
  const right = useMemo(() => {
    const seed = q.pairs.reduce((s, p) => s + (p.right.label ?? p.right.img ?? '').length * 7, q.pairs.length * 17 + Math.floor(Math.random() * 1000))
    const r = shuffle(makeRng(seed), q.pairs.map((p, i) => ({ o: p.right, i })))
    // hiçbir öğe karşısındaki eşinin hizasında kalmasın (yoksa eşleştirme anlamsızlaşır)
    if (r.some((x, k) => x.i === k)) return r.map((_, k) => r[(k + 1) % r.length]).some((x, k) => x.i === k) ? q.pairs.map((_p, i) => ({ o: q.pairs[(i + 1) % q.pairs.length].right, i: (i + 1) % q.pairs.length })) : r.map((_, k) => r[(k + 1) % r.length])
    return r
  }, [q])
  const [sel, setSel] = useState<number | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [shake, setShake] = useState<number | null>(null)
  const revealed = feedback === 'reveal'
  const matched = (i: number) => revealed || done.includes(i)

  const pickRight = (i: number) => {
    if (sel === null || matched(i)) return
    if (i === sel) {
      sfx('pop')
      const nd = [...done, i]
      setDone(nd)
      setSel(null)
      if (nd.length === q.pairs.length) setTimeout(() => answer(true, { delay: 1800 }), 250)
    } else {
      setShake(i)
      setTimeout(() => setShake(null), 420)
      setSel(null)
      answer(false, { explain: q.explain, hint: q.hint ?? 'Bir daha bak! Eşini dikkatlice bul.' })
    }
  }

  const tile = (o: Option, i: number, side: 'l' | 'r') => {
    const m = matched(i)
    const color = PAIR_COLORS[i % PAIR_COLORS.length]
    const selected = side === 'l' && sel === i
    return (
      <motion.button
        key={`${side}${i}`}
        aria-label={o.label ?? 'eş'}
        aria-pressed={selected}
        disabled={m}
        onClick={() => {
          if (side === 'l') {
            if (m) return
            sfx('tap')
            setSel(i)
          } else pickRight(i)
        }}
        initial={{ x: side === 'l' ? -40 : 40, opacity: 0 }}
        animate={shake === i && side === 'r' ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { x: 0, opacity: 1, scale: selected ? 1.06 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: shake === i ? 0 : i * 0.05 }}
        whileHover={!m ? { y: -4 } : {}}
        className="relative flex min-h-[clamp(48px,9vh,96px)] w-full items-center justify-center rounded-[20px] px-3 py-2 [@media(max-height:560px)]:py-1"
        style={{
          background: m ? `linear-gradient(180deg, ${color}33, ${color}66)` : 'linear-gradient(180deg,#fff3d1 0%,#f6cf86 62%,#e9b866 100%)',
          border: `4px solid ${m ? color : selected ? '#2a7fd4' : '#b97b3f'}`,
          boxShadow: selected ? '0 0 0 5px rgba(42,127,212,0.35), 0 6px 0 #8a5a2b' : m ? 'none' : 'inset 0 4px 0 rgba(255,255,255,0.6), 0 6px 0 #8a5a2b',
          color: '#5a3417',
        }}
      >
        <OptionFace o={o} size="sm" />
        {m && (
          <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-[14px] font-black text-white shadow" style={{ background: color }}>
            {i + 1}
          </span>
        )}
      </motion.button>
    )
  }

  return (
    <div className="flex h-full flex-col items-center gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble soru text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      <p className="mk-display rounded-full bg-white/80 px-4 py-1 text-[15px] text-[var(--mk-ink-soft)] shadow">
        {sel === null ? 'Önce soldan birine dokun' : 'Şimdi sağda eşine dokun'}
      </p>
      <div className="relative grid w-[min(760px,94vw)] grid-cols-2 gap-x-[clamp(24px,8vw,110px)] gap-y-3 [@media(max-height:560px)]:gap-y-2">
        <div className="flex flex-col gap-3 [@media(max-height:560px)]:gap-1.5">{q.pairs.map((p, i) => tile(p.left, i, 'l'))}</div>
        <div className="flex flex-col gap-3 [@media(max-height:560px)]:gap-1.5">{right.map(({ o, i }) => tile(o, i, 'r'))}</div>
        {done.length === q.pairs.length && <StarBurst x="50%" y="40%" />}
      </div>
    </div>
  )
}

/* ================================ SORU–CEVAP (TUŞ TAKIMI) ================================ */
export function InputView({ q, feedback, answer }: { q: InputQ; feedback: Feedback; answer: Answer }) {
  const [val, setVal] = useState('')
  const [shake, setShake] = useState(false)
  const solved = feedback === 'correct' || feedback === 'reveal'
  const keys = q.keys === 'digits' ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] : q.keys
  const max = Math.max(q.answer.length, 1)

  const press = (k: string) => {
    if (solved) return
    sfx('tap')
    if (q.keys !== 'digits') speak(k, { rate: 1.1 })
    setVal((v) => (v.length >= max + 1 ? v : v + k))
  }
  const check = () => {
    if (solved || !val) return
    if (val.toLocaleLowerCase('tr-TR') === q.answer.toLocaleLowerCase('tr-TR')) answer(true)
    else {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setVal('')
      }, 500)
      answer(false, { explain: q.explain, hint: q.hint })
    }
  }
  useEffect(() => {
    if (feedback === 'reveal') setVal(q.answer)
  }, [feedback, q.answer])

  return (
    <div className="flex h-full flex-col items-center gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble soru text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        {q.visual && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative grid max-w-[min(520px,90vw)] place-items-center rounded-[28px] bg-white/60 p-4 shadow-lg backdrop-blur-[2px]">
            <VisualView v={q.visual} />
            {feedback === 'correct' && <StarBurst />}
          </motion.div>
        )}
        <div className="flex flex-col items-center gap-3">
          {/* cevap kutusu */}
          <motion.div
            animate={shake ? { x: [0, -14, 14, -8, 8, 0] } : { x: 0 }}
            className="mk-display flex h-[clamp(72px,10vh,96px)] min-w-[clamp(150px,18vw,220px)] items-center justify-center gap-2 rounded-[22px] border-4 bg-white px-5 text-[clamp(40px,5vw,60px)]"
            style={{ borderColor: feedback === 'correct' ? '#5bc236' : feedback === 'reveal' ? '#2a7fd4' : '#e9cf9c', color: feedback === 'correct' ? '#3a8f1d' : '#4a2c17' }}
            aria-live="polite"
            aria-label={`Cevabın: ${val || 'boş'}`}
          >
            {val || <span className="text-[#d6c39e]">?</span>}
            {q.unit && <span className="text-[0.45em] text-[var(--mk-ink-soft)]">{q.unit}</span>}
          </motion.div>
          {/* tuşlar */}
          <div className={`grid gap-2 ${q.keys === 'digits' ? 'grid-cols-5' : keys.length > 8 ? 'grid-cols-5' : 'grid-cols-4'}`}>
            {keys.map((k) => (
              <motion.button
                key={k}
                whileTap={{ scale: 0.88 }}
                onClick={() => press(k)}
                aria-label={k}
                className="mk-display grid h-[clamp(52px,7vh,66px)] w-[clamp(52px,6vw,66px)] place-items-center rounded-2xl text-[clamp(26px,3vw,34px)]"
                style={{ background: 'linear-gradient(180deg,#fff3d1,#f6cf86)', border: '3px solid #b97b3f', boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.6), 0 5px 0 #8a5a2b', color: '#5a3417' }}
              >
                {k}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setVal((v) => v.slice(0, -1))} aria-label="Sil" className="mk-candy !min-h-[58px] !px-6" style={{ ['--c' as string]: 'var(--mk-orange)', ['--c-dark' as string]: 'var(--mk-orange-dark)' }}>
              ⌫ Sil
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={check} aria-label="Kontrol et" className="mk-candy !min-h-[58px] !px-8" style={{ ['--c' as string]: 'var(--mk-green)', ['--c-dark' as string]: 'var(--mk-green-dark)' }}>
              ✓ Tamam
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================ HAFIZA OYUNU ================================ */
export function MemoryView({ q, answer }: { q: MemoryQ; answer: Answer }) {
  const cards = useMemo(() => {
    const list = q.pairs.flatMap((p, i) => [
      { o: p.a, pair: i, id: `a${i}` },
      { o: p.b, pair: i, id: `b${i}` },
    ])
    return shuffle(makeRng(q.pairs.length * 41 + q.prompt.length), list)
  }, [q])
  const [open, setOpen] = useState<string[]>([])
  const [found, setFound] = useState<number[]>([])
  const [lock, setLock] = useState(false)
  const [moves, setMoves] = useState(0)

  const flip = (id: string, pair: number) => {
    if (lock || open.includes(id) || found.includes(pair)) return
    sfx('pick')
    const no = [...open, id]
    setOpen(no)
    if (no.length === 2) {
      setMoves((m) => m + 1)
      const [x, y] = no.map((cid) => cards.find((c) => c.id === cid)!)
      if (x.pair === y.pair) {
        sfx('correct')
        const nf = [...found, x.pair]
        setFound(nf)
        setOpen([])
        if (nf.length === q.pairs.length) setTimeout(() => answer(true, { delay: 1800 }), 400)
      } else {
        setLock(true)
        setTimeout(() => {
          setOpen([])
          setLock(false)
        }, 950)
      }
    }
  }
  const cols = cards.length <= 6 ? 3 : 4
  return (
    <div className="flex h-full flex-col items-center gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble soru text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      <p className="mk-display rounded-full bg-white/80 px-4 py-1 text-[15px] text-[var(--mk-ink-soft)] shadow">
        Bulunan eş: {found.length} / {q.pairs.length} · Hamle: {moves}
      </p>
      <div className="grid gap-[clamp(8px,1.4vw,16px)]" style={{ gridTemplateColumns: `repeat(${cols}, clamp(90px, 13vw, 150px))` }}>
        {cards.map((c, i) => {
          const up = open.includes(c.id) || found.includes(c.pair)
          return (
            <motion.button
              key={c.id}
              aria-label={up ? (c.o.label ?? 'kart') : 'Kapalı kart'}
              onClick={() => flip(c.id, c.pair)}
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0, rotateY: up ? 180 : 0 }}
              transition={{ scale: { delay: i * 0.04, type: 'spring' }, rotateY: { duration: 0.35 } }}
              className="relative aspect-[4/5] w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* arka yüz */}
              <span className="absolute inset-0 grid place-items-center rounded-[18px] border-4 border-[#7d55d9] bg-[linear-gradient(135deg,#9b6ef3,#6b43c4)] shadow-[0_6px_0_#4b2a9c]" style={{ backfaceVisibility: 'hidden' }}>
                <Obj name="star" size={48} shadow={false} />
              </span>
              {/* ön yüz */}
              <span
                className="absolute inset-0 grid place-items-center rounded-[18px] border-4 bg-[#fffaf0] p-1 shadow-[0_6px_0_#cdb68a]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderColor: found.includes(c.pair) ? PAIR_COLORS[c.pair % PAIR_COLORS.length] : '#e9cf9c' }}
              >
                <OptionFace o={c.o} size="sm" />
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ================================ ÖĞRENELİM ================================ */
export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {lesson.visual && (
        <div className="grid place-items-center">
          <VisualView v={lesson.visual} size="sm" />
        </div>
      )}
      {lesson.points && (
        <ul className="flex w-full flex-col gap-1.5">
          {lesson.points.map((p, i) => (
            <motion.li
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.25 }}
              className="flex items-start gap-2 rounded-xl bg-[var(--mk-pastel-lemon)] px-3 py-1.5 text-[clamp(15px,1.7vw,19px)] font-extrabold text-ink"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--mk-orange)] text-[13px] text-white">{i + 1}</span>
              {p}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
