/**
 * Boyanmış görünümlü, çok planlı sahne arka planları (painterly-illustrator skill).
 * Planlar: gök + ışın huzmeleri → uzak puslu orman (blur) → orta tepeler + patika → orta ağaçlar (3 ton)
 *          → ön çimen/çiçek/mantar → köşe çerçeve yaprakları (blur) → bokeh + vinyet.
 * Gerçek illüstrasyon varsa (sanat yuvası) onu gösterir; SVG yedektir.
 */
import { motion } from 'framer-motion'
import { memo, useMemo, type ReactNode } from 'react'
import { useGame } from '../state/store'
import { makeRng, type Rng } from '../learning/rng'
import { useBackgroundArt, type BackgroundId } from '../art/artRegistry'

export type BackdropKind = 'forest' | 'park' | 'meadow' | 'glade' | 'orchard' | 'sky' | 'lab' | 'town' | 'history'

const SKY: Record<BackdropKind, [string, string, string]> = {
  forest: ['#7fd0f5', '#c7ecfb', '#fff1cf'],
  park: ['#6cc2f5', '#bfe7ff', '#fff0cc'],
  meadow: ['#7ccdf6', '#cdeffd', '#fff4d6'],
  glade: ['#88d3f6', '#d2f0fd', '#fff0c4'],
  orchard: ['#7ccdf6', '#d0f0ff', '#fff2cf'],
  sky: ['#5ab8f5', '#a8deff', '#e9f8ff'],
  lab: ['#6f8ff0', '#b5c6ff', '#f0e6ff'],
  town: ['#78c8f6', '#c9ecff', '#fff3d6'],
  history: ['#f6b26b', '#ffd9a0', '#fff1d6'],
}

/* ---------------- yardımcı: 3 tonlu boyanmış ağaç ---------------- */
type Pal = { shadow: string; mid: string; light: string; rim: string; trunk: string; trunkDark: string }
const LUSH: Pal = { shadow: '#2c7d35', mid: '#4caa3c', light: '#86d04e', rim: '#c6ef7c', trunk: '#8a5a32', trunkDark: '#5e3a1c' }
const LUSH2: Pal = { shadow: '#24703a', mid: '#3f9a45', light: '#72c255', rim: '#b4e48a', trunk: '#7a4e2c', trunkDark: '#523015' }
const HAZE: Pal = { shadow: '#6fa88c', mid: '#86bd9c', light: '#a3d2b0', rim: '#c3e6c9', trunk: '#8fa596', trunkDark: '#7c9183' }
const HAZE_FAR: Pal = { shadow: '#8dbcc0', mid: '#a0cbcb', light: '#b9dcd8', rim: '#d3ebe6', trunk: '#a6c1c0', trunkDark: '#97b2b1' }

function PaintTree({ x, y, s, pal, rng, round = true }: { x: number; y: number; s: number; pal: Pal; rng: Rng; round?: boolean }) {
  const blobs = useMemo(() => {
    const n = 7
    return Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + rng() * 0.4
      const r = 38 + rng() * 22
      return { cx: Math.cos(a) * 46, cy: -150 + Math.sin(a) * 34, r }
    })
  }, [rng])
  if (!round) {
    // çam
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x="-8" y="-40" width="16" height="44" fill={pal.trunkDark} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M${-70 + i * 12} ${-30 - i * 48} L 0 ${-120 - i * 48} L ${70 - i * 12} ${-30 - i * 48} Z`} fill={pal.shadow} />
            <path d={`M0 ${-120 - i * 48} L ${70 - i * 12} ${-30 - i * 48} L ${10} ${-38 - i * 48} Z`} fill={pal.light} opacity="0.8" />
          </g>
        ))}
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="70" ry="12" fill="rgba(20,50,10,0.25)" />
      <path d="M-18 4 C -14 -30, -12 -70, -10 -110 L 12 -110 C 14 -70, 16 -30, 22 4 Z" fill={pal.trunk} />
      <path d="M-18 4 C -14 -30, -12 -70, -10 -110 L -2 -110 C -4 -70, -6 -30, -6 4 Z" fill={pal.trunkDark} opacity="0.7" />
      <path d="M-4 -60 C -20 -76, -34 -84, -48 -100" stroke={pal.trunk} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M6 -78 C 20 -92, 30 -104, 44 -112" stroke={pal.trunk} strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* gölge tonu */}
      {blobs.map((b, i) => (
        <circle key={`s${i}`} cx={b.cx - 6} cy={b.cy + 8} r={b.r} fill={pal.shadow} />
      ))}
      <circle cx="0" cy="-160" r="62" fill={pal.shadow} />
      {/* ana ton */}
      {blobs.map((b, i) => (
        <circle key={`m${i}`} cx={b.cx + 2} cy={b.cy - 2} r={b.r * 0.86} fill={pal.mid} />
      ))}
      <circle cx="6" cy="-166" r="54" fill={pal.mid} />
      {/* ışık tonu (sağ üst) */}
      {blobs
        .filter((b) => b.cx > -10 && b.cy < -140)
        .map((b, i) => (
          <circle key={`l${i}`} cx={b.cx + 10} cy={b.cy - 10} r={b.r * 0.55} fill={pal.light} />
        ))}
      <circle cx="22" cy="-186" r="30" fill={pal.light} />
      <circle cx="30" cy="-196" r="12" fill={pal.rim} opacity="0.9" />
      {/* yaprak detayları */}
      {blobs.slice(0, 4).map((b, i) => (
        <path key={`d${i}`} d={`M${b.cx - 10} ${b.cy + 6} q 8 -10 16 0`} stroke={pal.shadow} strokeWidth="3" fill="none" opacity="0.5" />
      ))}
    </g>
  )
}

function Flower({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C 2 -8, -2 -14, 0 -20" stroke="#2f7d32" strokeWidth="3" fill="none" />
      <path d="M0 -8 q 8 -6 12 -2 q -6 6 -12 2" fill="#3f9a45" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-28" rx="5.5" ry="8.5" fill={c} transform={`rotate(${a} 0 -21)`} />
      ))}
      <circle cx="0" cy="-21" r="5" fill="#ffd23f" />
      <circle cx="-1.5" cy="-22.5" r="1.8" fill="#fff6b0" />
    </g>
  )
}

function Mushroom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="rgba(20,50,10,0.3)" />
      <path d="M-8 0 C -8 -12, -6 -20, -6 -22 L 6 -22 C 6 -20, 8 -12, 8 0 Z" fill="#fff4e0" />
      <path d="M-26 -20 C -24 -44, 24 -44, 26 -20 Z" fill="#e8463c" />
      <path d="M-26 -20 C -20 -16, 20 -16, 26 -20 Z" fill="#b8302c" />
      <circle cx="-10" cy="-32" r="4" fill="#fff" />
      <circle cx="8" cy="-34" r="3" fill="#fff" />
      <circle cx="14" cy="-25" r="2.5" fill="#fff" />
      <path d="M-14 -36 q 8 -6 18 -4" stroke="#ff9a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Leaf({ x, y, r, s, c, c2 }: { x: number; y: number; r: number; s: number; c: string; c2: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 30 -40, 110 -40, 150 0 C 110 40, 30 40, 0 0 Z" fill={c} />
      <path d="M0 0 C 30 -40, 110 -40, 150 0 Z" fill={c2} opacity="0.6" />
      <path d="M4 0 L 146 0" stroke={c2} strokeWidth="3" opacity="0.7" />
    </g>
  )
}

/* ---------------- tür özel props ---------------- */
function Bookshelf({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const colors = ['#e8463c', '#2ec4c9', '#ffd23f', '#9b6ef3', '#5bc236', '#ff9a2e', '#5ab8f5', '#ff7aa8']
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-110 0 C -120 -200, -100 -330, -60 -380 L 60 -380 C 100 -330, 120 -200, 110 0 Z" fill="#7a4a22" />
      <path d="M-110 0 C -120 -200, -100 -330, -60 -380 L -30 -380 C -70 -330, -88 -200, -80 0 Z" fill="#5e3a1a" />
      <rect x="-72" y="-320" width="144" height="300" rx="14" fill="#3e2410" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          {Array.from({ length: 7 }).map((_, i) => {
            const h = 50 + ((i * 7 + row * 3) % 4) * 6
            const tilt = i === 6 ? 8 : 0
            return <rect key={i} x={-64 + i * 19} y={-30 - row * 72 - h} width="16" height={h} rx="3" fill={colors[(i + row * 3) % colors.length]} transform={`rotate(${tilt} ${-56 + i * 19} ${-30 - row * 72})`} />
          })}
          <rect x="-74" y={-28 - row * 72} width="148" height="9" rx="3" fill="#a8743f" />
        </g>
      ))}
      <rect x="-72" y="-320" width="144" height="300" rx="14" fill="url(#shelfShade)" />
    </g>
  )
}

function Lantern({ x, y }: { x: number; y: number }) {
  const calm = useGame((st) => st.settings.calm)
  return (
    <motion.g animate={calm ? {} : { rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: `${x}px`, originY: `${y - 70}px` }}>
      <path d={`M${x} ${y - 70} L ${x} ${y - 26}`} stroke="#3b2414" strokeWidth="4" />
      <circle cx={x} cy={y + 4} r="70" fill="url(#lampGlow)" />
      <path d={`M${x - 24} ${y - 26} L ${x + 24} ${y - 26} L ${x + 14} ${y - 40} L ${x - 14} ${y - 40} Z`} fill="#3b2414" />
      <rect x={x - 20} y={y - 26} width="40" height="50" rx="8" fill="#ffe28a" stroke="#3b2414" strokeWidth="5" />
      <path d={`M${x} ${y - 24} L ${x} ${y + 22}`} stroke="#3b2414" strokeWidth="3" />
      <rect x={x - 24} y={y + 22} width="48" height="8" rx="3" fill="#3b2414" />
    </motion.g>
  )
}

function FloatingLetter({ x, y, ch, c, d }: { x: number; y: number; ch: string; c: string; d: number }) {
  const calm = useGame((st) => st.settings.calm)
  return (
    <motion.g animate={calm ? {} : { y: [0, -16, 0], rotate: [-6, 6, -6] }} transition={{ duration: 4 + d, repeat: Infinity, ease: 'easeInOut', delay: d }}>
      <g transform={`translate(${x} ${y})`}>
        <rect x="-28" y="-24" width="56" height="56" rx="12" fill="rgba(0,0,0,0.15)" />
        <rect x="-28" y="-28" width="56" height="56" rx="12" fill={c} />
        <rect x="-24" y="-24" width="48" height="18" rx="9" fill="#fff" opacity="0.3" />
        <text x="0" y="14" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="40" fill="#fff" stroke="#4a2c17" strokeWidth="1.5" paintOrder="stroke">
          {ch}
        </text>
      </g>
    </motion.g>
  )
}

function NumberBalloon({ x, y, n, c, d }: { x: number; y: number; n: string; c: string; d: number }) {
  const calm = useGame((st) => st.settings.calm)
  return (
    <motion.g animate={calm ? {} : { y: [0, -22, 0] }} transition={{ duration: 5 + d, repeat: Infinity, ease: 'easeInOut', delay: d }}>
      <g transform={`translate(${x} ${y})`}>
        <path d="M0 44 Q 8 74 -4 110" stroke="#fff" strokeWidth="2" fill="none" />
        <ellipse cx="0" cy="0" rx="36" ry="44" fill={c} />
        <ellipse cx="6" cy="8" rx="30" ry="36" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="-12" cy="-18" rx="10" ry="14" fill="#fff" opacity="0.45" />
        <path d="M-6 44 L 6 44 L 0 52 Z" fill={c} />
        <text x="0" y="14" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="42" fill="#fff">
          {n}
        </text>
      </g>
    </motion.g>
  )
}

/* ---------------- ana sahne (statik katmanlar memo) ---------------- */
const StaticScene = memo(function StaticScene({ kind }: { kind: BackdropKind }) {
  const [top, mid, bottom] = SKY[kind]
  const rng = useMemo(() => makeRng(kind.length * 977 + kind.charCodeAt(0)), [kind])
  const farTrees = useMemo(() => Array.from({ length: 16 }).map((_, i) => ({ x: i * 110 - 40 + rng() * 40, s: 0.5 + rng() * 0.25 })), [rng])
  const midTrees = useMemo(() => Array.from({ length: 9 }).map((_, i) => ({ x: i * 200 - 60 + rng() * 60, s: 0.62 + rng() * 0.2 })), [rng])
  const blades = useMemo(
    () =>
      Array.from({ length: 140 }).map(() => {
        const x = rng() * 1600
        const y = 880 + rng() * 120
        const h = 14 + rng() * 22
        const lean = (rng() - 0.5) * 12
        return { x, y, h, lean, c: rng() > 0.5 ? '#3f9a45' : '#6cc04a' }
      }),
    [rng],
  )
  const flowers = useMemo(
    () => Array.from({ length: 16 }).map(() => ({ x: 60 + rng() * 1480, y: 900 + rng() * 80, c: ['#ff7aa8', '#ffd23f', '#ffffff', '#9b6ef3', '#ff9a2e'][Math.floor(rng() * 5)], s: 0.8 + rng() * 0.6 })),
    [rng],
  )
  const dense = kind === 'forest' || kind === 'glade' || kind === 'meadow'
  const ground = kind === 'history' ? ['#d8b878', '#b99456'] : kind === 'lab' ? ['#9fd8a0', '#6cb86c'] : ['#8fdc5a', '#4fa83a']

  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="1" />
          <stop offset="0.35" stopColor="#fff2a8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff2a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fffbe0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9dcb4" />
          <stop offset="1" stopColor="#8cc89a" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd462" />
          <stop offset="1" stopColor="#5fb043" />
        </linearGradient>
        <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ground[0]} />
          <stop offset="1" stopColor={ground[1]} />
        </linearGradient>
        <linearGradient id="pathG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dcae" />
          <stop offset="1" stopColor="#d9b57c" />
        </linearGradient>
        <linearGradient id="shelfShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.4" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="#ffe28a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe28a" stopOpacity="0" />
        </radialGradient>
        <filter id="blurFar" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="blurMid" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="blurFront" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill={`url(#sky-${kind})`} />
      {/* güneş + huzmeler */}
      <g transform="translate(1260 120)">
        <circle r="300" fill="url(#sunGlow)" />
        <circle r="64" fill="#fffbe6" />
      </g>
      <g style={{ mixBlendMode: 'screen' }} opacity="0.75">
        {[-12, 2, 14, 26, 40].map((a, i) => (
          <path key={i} d={`M1260 120 L ${1260 - 1400 * Math.sin(((a + 30) * Math.PI) / 180)} 1100 L ${1260 - 1400 * Math.sin(((a + 36) * Math.PI) / 180)} 1100 Z`} fill="url(#rayG)" opacity={0.35 + (i % 2) * 0.2} />
        ))}
      </g>

      {/* UZAK PLAN */}
      <g filter="url(#blurFar)">
        <path d="M0 600 C 160 520, 340 540, 520 580 C 720 500, 960 500, 1160 560 C 1320 510, 1480 520, 1600 560 L 1600 1000 L 0 1000 Z" fill="url(#hillFar)" />
        {kind !== 'sky' &&
          kind !== 'history' &&
          farTrees.map((t, i) => <PaintTree key={i} x={t.x} y={600 + (i % 3) * 14} s={t.s} pal={HAZE_FAR} rng={rng} round={i % 4 !== 0} />)}
      </g>

      {/* ORTA PLAN */}
      <g filter="url(#blurMid)">
        <path d="M0 720 C 220 640, 460 670, 700 700 C 940 640, 1200 640, 1400 690 C 1500 680, 1560 680, 1600 690 L 1600 1000 L 0 1000 Z" fill="url(#hillMid)" />
        {kind !== 'sky' &&
          midTrees.map((t, i) => (
            <PaintTree key={i} x={t.x} y={730 + (i % 2) * 10} s={t.s} pal={HAZE} rng={rng} round={!(kind === 'glade' && i % 3 === 0)} />
          ))}
      </g>

      {/* patika (perspektif) */}
      {(kind === 'forest' || kind === 'meadow' || kind === 'glade') && (
        <path d="M640 1000 C 700 900, 780 830, 790 760 L 820 760 C 830 830, 920 900, 1000 1000 Z" fill="url(#pathG)" opacity="0.9" />
      )}

      {/* tür özel orta plan */}
      {kind === 'park' && (
        <g>
          <g transform="translate(1100 600)">
            <circle r="170" fill="none" stroke="#fff" strokeWidth="12" />
            <circle r="170" fill="none" stroke="#e7f3ff" strokeWidth="4" strokeDasharray="12 22" />
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 45})`}>
                <line x1="0" y1="0" x2="0" y2="-170" stroke="#fff" strokeWidth="5" />
                <rect x="-20" y="-190" width="40" height="34" rx="10" fill={['#ff7aa8', '#ffd23f', '#2ec4c9', '#9b6ef3'][i % 4]} />
              </g>
            ))}
            <circle r="18" fill="#ffd23f" />
            <path d="M-70 200 L 0 0 L 70 200" stroke="#fff" strokeWidth="14" fill="none" />
          </g>
          {/* dev geometrik şekiller */}
          <path d="M260 760 L 330 640 L 400 760 Z" fill="#ff9a2e" />
          <path d="M330 640 L 400 760 L 360 760 Z" fill="#d8670b" opacity="0.6" />
          <rect x="420" y="690" width="80" height="80" rx="10" fill="#2ec4c9" />
          <rect x="470" y="690" width="30" height="80" rx="6" fill="#149aa0" opacity="0.6" />
          <circle cx="560" cy="735" r="40" fill="#9b6ef3" />
          <circle cx="572" cy="722" r="14" fill="#fff" opacity="0.35" />
        </g>
      )}
      {kind === 'orchard' &&
        [420, 1180].map((x, i) => (
          <g key={i}>
            <PaintTree x={x} y={800} s={1.05} pal={LUSH} rng={rng} />
            {[-50, -10, 34, -28, 22, 50].map((dx, j) => (
              <g key={j}>
                <circle cx={x + dx} cy={800 - 140 - ((j * 23) % 60)} r="13" fill="#e8463c" />
                <circle cx={x + dx - 4} cy={800 - 144 - ((j * 23) % 60)} r="4" fill="#fff" opacity="0.6" />
              </g>
            ))}
          </g>
        ))}

      {/* ÖN ZEMİN */}
      <path d="M0 850 C 300 800, 560 830, 800 845 C 1060 815, 1320 815, 1600 845 L 1600 1000 L 0 1000 Z" fill="url(#groundG)" />
      {(kind === 'forest' || kind === 'meadow' || kind === 'glade') && (
        <path d="M600 1000 C 660 940, 720 880, 760 850 L 860 850 C 900 880, 960 940, 1040 1000 Z" fill="url(#pathG)" />
      )}
      {kind === 'forest' && (
        <g opacity="0.55">
          {[0, 1, 2, 3, 4].map((r) =>
            [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={650 + c * 80 - r * 12 + (r % 2) * 30} y={900 + r * 22} width="70" height="18" rx="5" fill="#c99a62" />),
          )}
        </g>
      )}
      {kind !== 'sky' &&
        blades.map((b, i) => <path key={i} d={`M${b.x} ${b.y} q ${b.lean / 2} ${-b.h / 2} ${b.lean} ${-b.h}`} stroke={b.c} strokeWidth="3" strokeLinecap="round" fill="none" />)}
      {kind !== 'sky' && kind !== 'history' && flowers.map((f, i) => <Flower key={i} x={f.x} y={f.y} c={f.c} s={f.s} />)}
      {dense && (
        <>
          <Mushroom x={210} y={950} s={1.2} />
          <Mushroom x={250} y={965} s={0.8} />
          <Mushroom x={1430} y={958} s={1} />
        </>
      )}

      {/* yan büyük ağaçlar (orta-ön) */}
      {kind !== 'sky' && kind !== 'history' && (
        <g>
          <PaintTree x={70} y={880} s={1.75} pal={LUSH2} rng={rng} />
          <PaintTree x={1540} y={890} s={1.85} pal={LUSH} rng={rng} />
          {dense && <PaintTree x={300} y={840} s={1.05} pal={LUSH} rng={rng} />}
        </g>
      )}
      {kind === 'forest' && (
        <g>
          <Bookshelf x={1440} y={960} s={1} />
          <Lantern x={1300} y={230} />
          <Lantern x={300} y={260} />
        </g>
      )}

      {/* ÇERÇEVE YAPRAKLARI (alan derinliği) */}
      {kind !== 'sky' && (
        <g filter="url(#blurFront)" opacity="0.95">
          <Leaf x={-40} y={40} r={20} s={1.6} c="#1f6a2e" c2="#2f8a3a" />
          <Leaf x={-60} y={150} r={-5} s={1.3} c="#256f33" c2="#3a9a44" />
          <Leaf x={60} y={-30} r={60} s={1.2} c="#2a7a35" c2="#45a84a" />
          <Leaf x={1640} y={30} r={160} s={1.6} c="#1f6a2e" c2="#2f8a3a" />
          <Leaf x={1660} y={170} r={190} s={1.2} c="#256f33" c2="#3a9a44" />
          <Leaf x={-50} y={1010} r={-40} s={1.5} c="#1f6a2e" c2="#2f8a3a" />
          <Leaf x={1650} y={1010} r={220} s={1.5} c="#1f6a2e" c2="#2f8a3a" />
        </g>
      )}
      {/* sarmaşık */}
      {dense && (
        <g>
          {[120, 230, 1380, 1480].map((x, i) => (
            <g key={i}>
              <path d={`M${x} 0 C ${x + 10} 60, ${x - 10} 120, ${x + 4} ${160 + i * 20}`} stroke="#2f7d32" strokeWidth="3" fill="none" />
              {[30, 70, 110, 150].map((yy, j) => (
                <ellipse key={j} cx={x + (j % 2 ? 9 : -9)} cy={yy + i * 4} rx="10" ry="6" fill={j % 2 ? '#3f9a45' : '#5bb84a'} transform={`rotate(${j % 2 ? 30 : -30} ${x} ${yy})`} />
              ))}
            </g>
          ))}
        </g>
      )}
    </svg>
  )
})

/** Bokeh + vinyet + süzülen bulutlar (hareketli, ayrı katman) */
function Atmosphere({ kind }: { kind: BackdropKind }) {
  const calm = useGame((st) => st.settings.calm)
  const dots = useMemo(() => {
    const r = makeRng(99)
    return Array.from({ length: 14 }).map(() => ({ x: r() * 100, y: 10 + r() * 70, s: 10 + r() * 30, d: r() * 6, o: 0.25 + r() * 0.35 }))
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {kind !== 'history' &&
        [
          { top: '8%', left: '6%', w: 240, dur: 60 },
          { top: '14%', left: '48%', w: 180, dur: 75 },
        ].map((c, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: c.top, left: c.left, width: c.w, height: c.w * 0.42 }}
            animate={calm ? {} : { x: [0, 80, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-full bg-white/90 blur-[2px]" style={{ borderRadius: '50% 50% 40% 40%' }} />
            <div className="absolute -top-[30%] left-[18%] h-[90%] w-[45%] rounded-full bg-white/95" />
            <div className="absolute -top-[10%] left-[48%] h-[75%] w-[38%] rounded-full bg-white/95" />
          </motion.div>
        ))}
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            background: 'radial-gradient(circle, rgba(255,250,210,0.95) 0%, rgba(255,250,210,0) 70%)',
            opacity: d.o,
          }}
          animate={calm ? {} : { y: [0, -18, 0], opacity: [d.o, d.o * 1.8, d.o] }}
          transition={{ duration: 5 + d.d, repeat: Infinity, ease: 'easeInOut', delay: d.d }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,40,10,0.28) 100%)' }} />
    </div>
  )
}

export function Backdrop({ kind, children }: { kind: BackdropKind; children?: ReactNode }) {
  const art = useBackgroundArt(kind as BackgroundId)
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {art ? <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <StaticScene kind={kind} />}
      {!art && kind === 'forest' && <ForestLetters />}
      {!art && kind === 'park' && <ParkBalloons />}
      {art ? <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(20,40,10,0.22) 100%)' }} /> : <Atmosphere kind={kind} />}
      {children}
    </div>
  )
}

function ForestLetters() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
      <FloatingLetter x={430} y={300} ch="A" c="#e8463c" d={0} />
      <FloatingLetter x={760} y={220} ch="B" c="#2ec4c9" d={1} />
      <FloatingLetter x={1060} y={330} ch="C" c="#5bc236" d={2} />
    </svg>
  )
}

function ParkBalloons() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
      <NumberBalloon x={300} y={330} n="1" c="#e8463c" d={0} />
      <NumberBalloon x={520} y={250} n="2" c="#ffd23f" d={1} />
      <NumberBalloon x={1440} y={250} n="3" c="#2ec4c9" d={2} />
      <NumberBalloon x={800} y={300} n="+" c="#9b6ef3" d={1.5} />
    </svg>
  )
}
