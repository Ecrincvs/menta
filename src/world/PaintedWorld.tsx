/**
 * BOYANMIŞ ANA DÜNYA — referans kalitesindeki illüstrasyon (public/assets/art/backgrounds/bg-world.webp)
 * üzerine etkileşim ve canlılık katmanları:
 *  - tıklanabilir bina sıcak noktaları + ahşap/krem tabelalar (kilit: o sınıfta olmayan dersler)
 *  - nefes alan kamera, imleçle paralaks, seçilen binaya yakınlaşma
 *  - şelale ışıltıları, kristal parıltıları, süzülen bulutlar, uçan kuşlar
 * Koordinatlar görselin yüzdesi cinsindendir (3:2 oranlı sahne, ekranı kaplayacak şekilde ölçeklenir).
 */
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { SubjectId } from '../content/types'
import { SUBJECTS, subjectOpenFor } from '../content/subjects'
import { useGame } from '../state/store'
import { Obj } from '../components/ui/Obj'
import { sfx } from '../audio/sfx'
import { makeRng } from '../learning/rng'

interface Spot {
  id: SubjectId
  /** bina merkezi (%) */
  x: number
  y: number
  /** sıcak nokta yarıçapı (% genişlik) */
  r: number
  /** tabela konumu (%) */
  lx: number
  ly: number
}

export const WORLD_SPOTS: Spot[] = [
  { id: 'turkce', x: 26, y: 31, r: 11, lx: 24, ly: 13 },
  { id: 'matematik', x: 49.5, y: 20, r: 10, lx: 49.5, ly: 3.5 },
  { id: 'fen', x: 73, y: 28, r: 10.5, lx: 76, ly: 10 },
  { id: 'hayat', x: 29, y: 63, r: 10, lx: 22, ly: 48 },
  { id: 'tarih', x: 72, y: 62, r: 11, lx: 79, ly: 47 },
]

const WATERFALLS = [
  [19.5, 52, 4, 12],
  [53, 63, 3.5, 13],
  [83, 89, 3, 10],
  [90, 47, 2.6, 10],
  [61, 84, 3, 12],
]

export default function PaintedWorld({ src, focus, showLabels, onSelect }: { src: string; focus: SubjectId | null; showLabels: boolean; onSelect: (s: SubjectId) => void }) {
  const calm = useGame((s) => s.settings.calm)
  const grade = useGame((s) => s.grade)
  const [hover, setHover] = useState<SubjectId | null>(null)
  const [loaded, setLoaded] = useState(false)

  // imleç paralaksı
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })
  const px = useTransform(sx, (v) => v * -14)
  const py = useTransform(sy, (v) => v * -10)
  const cx = useTransform(sx, (v) => v * -34)
  const cy = useTransform(sy, (v) => v * -18)

  useEffect(() => {
    if (calm) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [calm, mx, my])

  const f = focus ? WORLD_SPOTS.find((s) => s.id === focus) : null
  // dikey ekran: harita ekrandan geniş → parmakla yatay kaydırılabilir
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const overflow = Math.max(0, Math.max(vp.w, vp.h * 1.5) - vp.w) / 2
  const sparkles = useMemo(() => {
    const r = makeRng(21)
    return Array.from({ length: 22 }).map(() => ({ x: 44 + r() * 14, y: 36 + r() * 16, d: r() * 3, s: 4 + r() * 6 }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#8fd2ff]">
      <motion.div
        className="absolute inset-0"
        drag={overflow > 40 && !focus ? 'x' : false}
        dragConstraints={{ left: -overflow, right: overflow }}
        dragElastic={0.08}
        style={{ touchAction: overflow > 40 ? 'pan-y' : 'auto' }}
      >
      {/* sahne: 3:2, ekranı kaplar */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: 'max(100vw, 150vh)', height: 'max(66.667vw, 100vh)', x: '-50%', y: '-50%' }}
        initial={{ scale: 1.25, opacity: 0, filter: 'blur(8px)' }}
        animate={
          f
            ? { scale: 2.1, opacity: 1, filter: 'blur(0px)', originX: f.x / 100, originY: f.y / 100 }
            : { scale: loaded ? (calm ? 1.02 : [1.02, 1.05, 1.02]) : 1.25, opacity: loaded ? 1 : 0, filter: 'blur(0px)' }
        }
        transition={f ? { duration: 1.1, ease: [0.6, 0, 0.3, 1] } : { scale: { duration: loaded ? 24 : 1.8, repeat: loaded && !calm ? Infinity : 0, ease: 'easeInOut' }, opacity: { duration: 1 }, filter: { duration: 1.4 } }}
      >
        <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
          <img src={src} alt="" onLoad={() => setLoaded(true)} className="absolute inset-0 h-full w-full select-none object-cover" draggable={false} />

          {/* şelale ışıltıları */}
          {!calm &&
            WATERFALLS.map(([x, y, w, h], i) => (
              <div key={i} className="pointer-events-none absolute overflow-hidden" style={{ left: `${x - w / 2}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, maskImage: 'linear-gradient(180deg, transparent, #000 20%, #000 70%, transparent)' }}>
                {[0, 1, 2].map((k) => (
                  <motion.div
                    key={k}
                    className="absolute left-[15%] h-[35%] w-[70%] rounded-full"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', filter: 'blur(2px)' }}
                    animate={{ top: ['-40%', '110%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: k * 0.47 + i * 0.2 }}
                  />
                ))}
              </div>
            ))}

          {/* kristal parıltıları */}
          {!calm &&
            sparkles.map((p, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute rounded-full"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: 'radial-gradient(circle, #fff 0%, #bff3ff 40%, rgba(150,230,255,0) 70%)' }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4], y: [0, -24, -40] }}
                transition={{ duration: 2.4 + p.d, repeat: Infinity, delay: p.d }}
              />
            ))}

          {/* bina sıcak noktaları */}
          {WORLD_SPOTS.map((s) => {
            const open = subjectOpenFor(s.id, grade)
            const hov = hover === s.id
            return (
              <button
                key={s.id}
                aria-label={SUBJECTS.find((x) => x.id === s.id)!.name}
                className="absolute rounded-full"
                style={{ left: `${s.x - s.r}%`, top: `${s.y - s.r * 1.5}%`, width: `${s.r * 2}%`, height: `${s.r * 3}%` }}
                onPointerEnter={() => {
                  setHover(s.id)
                  if (open) sfx('tap')
                }}
                onPointerLeave={() => setHover(null)}
                onClick={() => onSelect(s.id)}
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.8 }}
                  style={{ background: open ? 'radial-gradient(circle, rgba(255,240,170,0.55) 0%, rgba(255,240,170,0) 65%)' : 'radial-gradient(circle, rgba(200,200,220,0.45) 0%, rgba(200,200,220,0) 65%)' }}
                />
              </button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* tabelalar (paralaksla birlikte hareket eder) */}
      {showLabels && !focus && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ width: 'max(100vw, 150vh)', height: 'max(66.667vw, 100vh)', x: '-50%', y: '-50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div className="absolute inset-0" style={{ x: px, y: py, scale: 1.035 }}>
            {WORLD_SPOTS.map((s, i) => (
              <Sign key={s.id} spot={s} open={subjectOpenFor(s.id, grade)} hover={hover === s.id} delay={0.9 + i * 0.12} onClick={() => onSelect(s.id)} onHover={(h) => setHover(h ? s.id : null)} />
            ))}
          </motion.div>
        </motion.div>
      )}

      </motion.div>

      {/* ön plan bulutları (paralaks) */}
      {!calm && (
        <motion.div className="pointer-events-none absolute inset-0" style={{ x: cx, y: cy }}>
          {[
            { l: '-8%', t: '78%', w: 420, d: 70 },
            { l: '70%', t: '84%', w: 520, d: 90 },
            { l: '-12%', t: '6%', w: 360, d: 80 },
          ].map((c, i) => (
            <motion.div key={i} className="absolute" style={{ left: c.l, top: c.t, width: c.w, height: c.w * 0.38 }} animate={{ x: [0, 90, 0] }} transition={{ duration: c.d, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="absolute inset-0 rounded-full bg-white/80 blur-[6px]" />
              <div className="absolute -top-[35%] left-[18%] h-[95%] w-[45%] rounded-full bg-white/85 blur-[4px]" />
              <div className="absolute -top-[15%] left-[48%] h-[80%] w-[40%] rounded-full bg-white/85 blur-[4px]" />
            </motion.div>
          ))}
          <Birds />
        </motion.div>
      )}

      {/* hafif vinyet */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(10,40,80,0.28) 100%)' }} />
    </div>
  )
}

function Sign({ spot, open, hover, delay, onClick, onHover }: { spot: Spot; open: boolean; hover: boolean; delay: number; onClick: () => void; onHover: (h: boolean) => void }) {
  const s = SUBJECTS.find((x) => x.id === spot.id)!
  const [first, ...rest] = s.name.replace(' Dünyası', '').split(' ')
  const title = [first, ...rest].join(' ')
  return (
    <motion.button
      className="pointer-events-auto absolute flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-[18px] px-4 py-1.5"
      style={{
        left: `${spot.lx}%`,
        top: `${spot.ly}%`,
        background: open ? 'linear-gradient(180deg,#fffdf6,#fff1d6)' : 'linear-gradient(180deg,#f3efe8,#ddd6ca)',
        border: `4px solid ${open ? s.accent : '#a59a8a'}`,
        boxShadow: `inset 0 3px 0 #fff, 0 6px 0 ${open ? s.accentDark : '#7d7466'}, 0 12px 22px rgba(0,0,0,0.3)`,
      }}
      initial={{ y: -30, opacity: 0, scale: 0.6 }}
      animate={{ y: hover ? -8 : 0, opacity: 1, scale: hover ? 1.12 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: hover ? 0 : delay }}
      onClick={onClick}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      aria-label={`${s.name}${open ? '' : ', bu sınıfta kilitli'}`}
    >
      <Obj name={s.icon} size={34} shadow={false} style={{ filter: open ? 'none' : 'grayscale(1)' }} />
      <span className="flex flex-col items-start leading-[0.95]">
        <span className="mk-display text-[clamp(16px,1.6vw,22px)]" style={{ color: open ? '#4a2c17' : '#7d7466' }}>
          {title}
        </span>
        <span className="text-[11px] font-black" style={{ color: open ? s.accentDark : '#8d8476' }}>
          {open ? 'DÜNYASI' : `${s.grades[0]}. sınıfta açılır`}
        </span>
      </span>
      {!open && <Obj name="lock" size={24} shadow={false} />}
    </motion.button>
  )
}

function Birds() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 40 20"
          width={26 - i * 4}
          className="absolute"
          style={{ top: `${12 + i * 5}%` }}
          initial={{ left: '-5%' }}
          animate={{ left: '105%', y: [0, -10, 0, 8, 0] }}
          transition={{ left: { duration: 26 + i * 4, repeat: Infinity, delay: i * 3, ease: 'linear' }, y: { duration: 4, repeat: Infinity } }}
        >
          <motion.path d="M2 10 Q 10 2 20 10 Q 30 2 38 10" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ d: ['M2 10 Q 10 2 20 10 Q 30 2 38 10', 'M2 6 Q 10 14 20 10 Q 30 14 38 6', 'M2 10 Q 10 2 20 10 Q 30 2 38 10'] }} transition={{ duration: 0.6, repeat: Infinity }} />
        </motion.svg>
      ))}
    </>
  )
}
