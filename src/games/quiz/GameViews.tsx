/**
 * HARF OYUNLARI — her harf adasının sonundaki ödül oyunları.
 *  - PopView (Balon Patlat): yükselen balonlardan hedef harfi/heceyi içerenleri patlat
 *  - SearchView (Kelime Avı): tabloda saklanan kelimeleri parmağını kaydırarak bul
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PopQ, SearchQ } from './types'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { sfx } from '../../audio/sfx'
import { speak } from '../../audio/speech'
import { makeRng } from '../../learning/rng'
import { Obj } from '../../components/ui/Obj'

type Answer = (correct: boolean, opts?: { explain?: string; hint?: string; delay?: number }) => void

const BALLOON = ['#ff5d6c', '#ff9a2e', '#ffd23f', '#5bc236', '#2ec4c9', '#4f9bff', '#9b6ef3', '#ff7aa8']

// ───────────────────────── BALON PATLAT
export function PopView({ q, answer }: { q: PopQ; answer: Answer }) {
  const isHit = (label: string) => (q.hits ? q.hits.includes(label) : q.target.length === 1 && label.length === 1 ? label === q.target : label.toLocaleLowerCase('tr-TR').includes(q.target.toLocaleLowerCase('tr-TR')))
  const layout = useMemo(() => {
    const r = makeRng(q.items.length * 97 + q.target.charCodeAt(0))
    const cols = Math.min(5, q.items.length)
    return q.items.map((label, i) => ({
      id: i,
      label,
      col: i % cols,
      cols,
      delay: Math.floor(i / cols) * 2.6 + r() * 1.2,
      dur: 7.5 + r() * 2.5,
      color: BALLOON[Math.floor(r() * BALLOON.length)],
      sway: 10 + r() * 16,
    }))
  }, [q])
  const [popped, setPopped] = useState<number[]>([])
  const [shake, setShake] = useState<number | null>(null)
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([])
  const doneRef = useRef(false)
  const hits = popped.filter((id) => isHit(layout[id].label)).length

  const tap = (b: (typeof layout)[number], e: React.PointerEvent) => {
    if (popped.includes(b.id) || doneRef.current) return
    if (isHit(b.label)) {
      sfx('pop')
      const box = (e.currentTarget.parentElement?.parentElement as HTMLElement)?.getBoundingClientRect()
      const t = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setBursts((bs) => [...bs, { id: b.id, x: t.left + t.width / 2 - (box?.left ?? 0), y: t.top + t.height / 2 - (box?.top ?? 0), color: b.color }])
      const np = [...popped, b.id]
      setPopped(np)
      const nh = np.filter((id) => isHit(layout[id].label)).length
      if (nh >= q.need) {
        doneRef.current = true
        sfx('correct')
        setTimeout(() => answer(true, { delay: 1400 }), 500)
      }
    } else {
      sfx('wrong')
      setShake(b.id)
      speak(`Bu ${b.label}. Biz ${q.target} arıyoruz.`)
      setTimeout(() => setShake(null), 500)
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-2 px-3">
      <div className="flex w-[min(760px,94vw)] items-center gap-3">
        <div className="flex-1">
          <SpeechBubble text={q.prompt} spoken={q.spoken} tail="none" />
        </div>
        <div className="mk-card flex shrink-0 items-center gap-1 rounded-full px-4 py-2" aria-live="polite" aria-label={`${hits} / ${q.need}`}>
          <span className="mk-display text-[30px] text-[var(--mk-red)]">{hits}</span>
          <span className="mk-display text-[20px] text-[var(--mk-ink-soft)]">/ {q.need}</span>
        </div>
      </div>
      <div className="relative w-[min(900px,96vw)] flex-1 overflow-hidden rounded-[28px]" style={{ background: 'linear-gradient(180deg, rgba(175,225,255,0.55) 0%, rgba(255,255,255,0.25) 100%)' }}>
        {layout.map((b) => (
          <AnimatePresence key={b.id}>
            {!popped.includes(b.id) && (
              <motion.div
                className="absolute bottom-0"
                style={{ left: `${((b.col + 0.5) / b.cols) * 100}%`, x: '-50%' }}
                initial={{ y: '20%' }}
                animate={{ y: ['20%', '-640%'], x: ['-50%', `calc(-50% + ${b.sway}px)`, `calc(-50% - ${b.sway}px)`, '-50%'] }}
                transition={{ y: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'linear' }, x: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
                exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.18 } }}
              >
                <motion.button
                  onPointerDown={(e) => tap(b, e)}
                  aria-label={`${b.label} balonu`}
                  animate={shake === b.id ? { rotate: [0, -14, 14, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="relative grid place-items-center"
                  style={q.imgs || b.label.length > 3 ? { width: 'clamp(104px, 14vw, 136px)', height: 'clamp(124px, 16.8vw, 164px)' } : { width: 'clamp(76px, 11vw, 104px)', height: 'clamp(92px, 13.4vw, 126px)' }}
                >
                  <svg viewBox="0 0 80 100" className="absolute inset-0 h-full w-full" aria-hidden>
                    <defs>
                      <radialGradient id={`bl${b.id}`} cx="35%" cy="30%" r="70%">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
                        <stop offset="0.25" stopColor={b.color} />
                        <stop offset="1" stopColor={b.color} stopOpacity="0.9" />
                      </radialGradient>
                    </defs>
                    <path d="M40 4 C 62 4, 74 22, 74 40 C 74 62, 56 78, 42 82 L 46 88 L 34 88 L 38 82 C 24 78, 6 62, 6 40 C 6 22, 18 4, 40 4 Z" fill={`url(#bl${b.id})`} />
                    <path d="M40 88 C 36 94, 44 96, 40 100" stroke="#8a7a6a" strokeWidth="1.5" fill="none" />
                    <ellipse cx="28" cy="24" rx="7" ry="11" fill="#fff" opacity="0.45" transform="rotate(-25 28 24)" />
                  </svg>
                  {q.imgs?.[b.label] ? (
                    <span className="relative -mt-[18%] flex w-[86%] flex-col items-center leading-none">
                      <Obj name={q.imgs[b.label]} size={40} shadow={false} />
                      <span className="mk-display mt-0.5 text-center text-[clamp(12px,1.5vw,15px)] leading-[1.05] text-white" style={{ textShadow: '0 2px 0 rgba(0,0,0,0.3)' }}>
                        {b.label}
                      </span>
                    </span>
                  ) : (
                    <span className={`mk-display relative -mt-[18%] w-[86%] text-center text-white ${b.label.length > 9 ? 'text-[clamp(13px,1.6vw,16px)] leading-[1.05]' : b.label.length > 3 ? 'text-[clamp(16px,2vw,21px)] leading-[1.05]' : 'text-[clamp(26px,3.6vw,38px)]'}`} style={{ textShadow: '0 2px 0 rgba(0,0,0,0.25)' }}>
                      {b.label}
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        {/* patlama parçacıkları */}
        {bursts.map((p) =>
          Array.from({ length: 8 }).map((_, k) => {
            const a = (k / 8) * Math.PI * 2
            return (
              <motion.span
                key={`${p.id}-${k}`}
                className="pointer-events-none absolute h-3 w-3 rounded-full"
                style={{ left: p.x, top: p.y, background: p.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 60, y: Math.sin(a) * 60, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

// ───────────────────────── KELİME AVI
export function SearchView({ q, answer }: { q: SearchQ; answer: Answer }) {
  const n = q.grid.length
  // bulunan kelimeler ve çocuğun seçtiği hücreler (dolgu harflerinin tesadüfen oluşturduğu aynı kelime de kabul edilir)
  const [hits, setHits] = useState<{ word: string; cells: [number, number][] }[]>([])
  const found = hits.map((h) => h.word)
  const [start, setStart] = useState<[number, number] | null>(null)
  const [sel, setSel] = useState<[number, number][]>([])
  const [bad, setBad] = useState(false)
  const [hint, setHint] = useState<[number, number] | null>(null)
  const doneRef = useRef(false)
  const COLORS = ['#ffd23f', '#5bc236', '#2ec4c9', '#ff9a2e', '#9b6ef3']

  const foundCells = useMemo(() => {
    const m = new Map<string, string>()
    hits.forEach((h, i) => h.cells.forEach(([r, c]) => m.set(`${r},${c}`, COLORS[i % COLORS.length])))
    return m
  }, [hits]) // eslint-disable-line react-hooks/exhaustive-deps

  const line = (a: [number, number], b: [number, number]): [number, number][] => {
    if (a[0] === b[0]) {
      const [x0, x1] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])]
      return Array.from({ length: x1 - x0 + 1 }, (_, k) => [a[0], x0 + k])
    }
    if (a[1] === b[1]) {
      const [y0, y1] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])]
      return Array.from({ length: y1 - y0 + 1 }, (_, k) => [y0 + k, a[1]])
    }
    return [a]
  }
  const cellAt = (x: number, y: number): [number, number] | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const d = el?.closest('[data-cell]') as HTMLElement | null
    if (!d) return null
    return [Number(d.dataset.r), Number(d.dataset.c)]
  }
  const finish = (cells: [number, number][]) => {
    setStart(null)
    setSel([])
    if (cells.length < 2 || doneRef.current) return
    const str = cells.map(([r, c]) => q.grid[r][c]).join('')
    const back = str.split('').reverse().join('')
    const word = q.words.find((w) => !found.includes(w) && (w === str || w === back))
    if (word) {
      sfx('correct')
      speak(word)
      const nh = [...hits, { word, cells }]
      setHits(nh)
      setHint(null)
      if (nh.length === q.words.length) {
        doneRef.current = true
        setTimeout(() => answer(true, { delay: 1600 }), 500)
      }
    } else {
      sfx('wrong')
      setBad(true)
      setTimeout(() => setBad(false), 450)
    }
  }

  // 25 sn ilerleme yoksa ipucu: bulunmamış bir kelimenin ilk harfi parlar
  useEffect(() => {
    const t = setTimeout(() => {
      const p = q.placed.find((x) => !found.includes(x.word))
      if (p) setHint(p.cells[0])
    }, 25000)
    return () => clearTimeout(t)
  }, [found, q.placed])

  const selSet = new Set(sel.map(([r, c]) => `${r},${c}`))
  const cell = 'clamp(40px, min(9vw, 8.4vh), 66px)'
  return (
    <div className="flex h-full flex-col items-center gap-3 px-3 md:flex-row md:justify-center md:gap-8">
      <div className="flex w-[min(360px,92vw)] flex-col gap-3">
        <SpeechBubble text={q.prompt} spoken={q.spoken} tail="none" />
        <div className="mk-card flex flex-wrap justify-center gap-2 p-3" aria-label="Aranan kelimeler">
          {q.words.map((w) => {
            const ok = found.includes(w)
            return (
              <motion.span
                key={w}
                animate={ok ? { scale: [1, 1.25, 1] } : {}}
                className="mk-display rounded-full px-3 py-1 text-[22px]"
                style={ok ? { background: COLORS[found.indexOf(w) % COLORS.length], color: '#fff', textDecoration: 'line-through' } : { background: '#fff', boxShadow: '0 3px 0 #e2cfa6' }}
              >
                {w}
              </motion.span>
            )
          })}
        </div>
        <button
          onClick={() => {
            const p = q.placed.find((x) => !found.includes(x.word))
            if (p) {
              setHint(p.cells[0])
              speak(`${p.word} kelimesi parlayan harften başlıyor.`)
            }
          }}
          className="mk-display self-center rounded-full bg-white/85 px-4 py-2 text-[16px] shadow-[0_3px_0_#e2cfa6]"
        >
          💡 İpucu
        </button>
      </div>
      <motion.div
        className="mk-card grid touch-none select-none gap-1.5 p-3"
        style={{ gridTemplateColumns: `repeat(${n}, ${cell})` }}
        animate={bad ? { x: [0, -8, 8, -5, 0] } : {}}
        transition={{ duration: 0.4 }}
        onPointerDown={(e) => {
          const c = cellAt(e.clientX, e.clientY)
          if (!c) return
          ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
          if (start && sel.length === 1 && (start[0] !== c[0] || start[1] !== c[1])) {
            // dokun-dokun: ikinci dokunuş seçimi bitirir
            finish(line(start, c))
            return
          }
          sfx('pick')
          setStart(c)
          setSel([c])
        }}
        onPointerMove={(e) => {
          if (!start || e.buttons === 0) return
          const c = cellAt(e.clientX, e.clientY)
          if (c) setSel(line(start, c))
        }}
        onPointerUp={() => {
          if (start && sel.length > 1) finish(sel)
        }}
        role="grid"
        aria-label="Kelime tablosu"
      >
        {q.grid.flatMap((row, r) =>
          row.map((ch, c) => {
            const k = `${r},${c}`
            const fc = foundCells.get(k)
            const on = selSet.has(k)
            const isHint = hint && hint[0] === r && hint[1] === c
            return (
              <motion.div
                key={k}
                data-cell
                data-r={r}
                data-c={c}
                role="gridcell"
                animate={isHint ? { scale: [1, 1.18, 1] } : { scale: on ? 1.08 : 1 }}
                transition={isHint ? { duration: 0.9, repeat: Infinity } : { duration: 0.12 }}
                className="mk-display grid place-items-center rounded-xl text-[clamp(22px,3.4vw,32px)]"
                style={{
                  width: cell,
                  height: cell,
                  background: on ? '#8e6cf0' : fc ?? (isHint ? '#fff3b0' : '#fffaf0'),
                  color: on || fc ? '#fff' : '#4a2c17',
                  boxShadow: on ? '0 3px 0 #5c3fb8' : '0 3px 0 #e2cfa6',
                }}
              >
                {ch}
              </motion.div>
            )
          }),
        )}
      </motion.div>
    </div>
  )
}
