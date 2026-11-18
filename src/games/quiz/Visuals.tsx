/**
 * Ders görselleri — saat, kesir, şekil, cisim, açı, gruplar, onluk bloklar, para, kelime.
 * Hepsi SVG; hacim için 3 ton (painterly-illustrator skill).
 */
import { motion } from 'framer-motion'
import type { ShapeKind, SolidKind, Visual } from './types'
import { Obj } from '../../components/ui/Obj'
import { upperTR } from '../../content/words'
import { ExtraVisual } from './Visuals2'

const INK = '#4a2c17'

export function VisualView({ v, size = 'lg' }: { v: Visual; size?: 'sm' | 'lg' }) {
  const S = size === 'lg' ? 1 : 0.5
  switch (v.kind) {
    case 'image':
      return <Obj name={v.img} size={(v.size ?? 200) * S} />
    case 'images':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {v.imgs.map((i, k) => (
            <Obj key={k} name={i} size={110 * S} />
          ))}
        </div>
      )
    case 'objects':
      return <ObjectGrid img={v.img} count={v.count} s={S} />
    case 'compare':
      return (
        <div className="flex items-stretch gap-4">
          {[v.left, v.right].map((g, k) => (
            <div key={k} className="rounded-2xl bg-white/70 p-2">
              <ObjectGrid img={g.img} count={g.count} s={S * 0.8} />
            </div>
          ))}
        </div>
      )
    case 'groups':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: v.groups }).map((_, g) => (
            <motion.div
              key={g}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: g * 0.12 }}
              className="flex max-w-[150px] flex-wrap justify-center gap-0.5 rounded-2xl border-[3px] border-dashed border-[#d9b77a] bg-white/80 p-1.5"
            >
              {Array.from({ length: v.per }).map((_, i) => (
                <Obj key={i} name={v.img} size={(v.per > 6 ? 26 : 34) * S * 1.4} shadow={false} />
              ))}
            </motion.div>
          ))}
        </div>
      )
    case 'share':
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex max-w-[460px] flex-wrap justify-center gap-0.5 rounded-2xl bg-white/80 px-3 py-1.5">
            {Array.from({ length: v.total }).map((_, i) => (
              <Obj key={i} name={v.img} size={30 * S * 1.4} shadow={false} />
            ))}
          </div>
          <div className="flex gap-3">
            {Array.from({ length: v.plates }).map((_, i) => (
              <div key={i} className="grid h-14 w-20 place-items-center rounded-[50%] border-4 border-[#e2d2b4] bg-white shadow-[0_5px_0_#cdb68a]">
                <span className="text-[12px] font-black text-[#b39a6d]">tabak {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'clock':
      return <Clock h={v.h} m={v.m} size={220 * S} />
    case 'digital':
      return (
        <div className="mk-display rounded-2xl border-4 border-[#2b2b3a] bg-[#1d2233] px-5 py-2 text-[56px] tracking-widest text-[#7dffb0] shadow-[inset_0_0_20px_rgba(125,255,176,0.25)]" style={{ fontSize: 56 * S }}>
          {String(v.h).padStart(2, '0')}:{String(v.m).padStart(2, '0')}
        </div>
      )
    case 'fraction':
      return v.shape === 'pie' ? <Pie n={v.n} d={v.d} size={180 * S} /> : <Bar n={v.n} d={v.d} w={280 * S} />
    case 'shape':
      return <Shape kind={v.shape} size={170 * S * (v.scale ?? 1)} color={v.color} />
    case 'solid':
      return <Solid kind={v.solid} size={170 * S} />
    case 'angle':
      return <Angle deg={v.deg} size={200 * S} />
    case 'blocks':
      return <Blocks h={v.hundreds} t={v.tens} o={v.ones} s={S} />
    case 'money':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {v.items.map((x, i) => (x >= 1 ? <Note key={i} tl={x} s={S} /> : <CoinV key={i} kr={Math.round(x * 100)} s={S} />))}
        </div>
      )
    case 'word':
      return <WordBoxes img={v.img} word={v.word} hide={v.hide} s={S} />
    case 'sequence':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {v.items.map((x, i) => (
            <motion.span
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="mk-display grid min-w-[64px] place-items-center rounded-2xl px-3 py-2 text-[34px]"
              style={{ background: x === '?' ? '#fff' : '#fff2c8', border: `3px ${x === '?' ? 'dashed #ff9a2e' : 'solid #e9cf9c'}`, fontSize: 34 * Math.max(S, 0.7) }}
            >
              {x}
            </motion.span>
          ))}
        </div>
      )
    case 'equation':
      return (
        <div className="mk-wood rounded-[22px] px-6 py-2">
          <span className="mk-title text-[clamp(34px,4.6vw,56px)]">{v.text}</span>
        </div>
      )
    default:
      return <ExtraVisual v={v} s={S} />
  }
}

function ObjectGrid({ img, count, s }: { img: string; count: number; s: number }) {
  const size = (count > 12 ? 30 : count > 6 ? 40 : 56) * s * 1.3
  return (
    <div className="flex max-w-[360px] flex-wrap justify-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }}>
          <Obj name={img} size={size} shadow={false} />
        </motion.div>
      ))}
    </div>
  )
}

export function Clock({ h, m, size = 220 }: { h: number; m: number; size?: number }) {
  const ha = ((h % 12) + m / 60) * 30
  const ma = m * 6
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Saat ${h}:${String(m).padStart(2, '0')}`}>
      <defs>
        <radialGradient id="clockFace" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fff2d6" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="104" r="92" fill="rgba(0,0,0,0.15)" />
      <circle cx="100" cy="100" r="92" fill="#ff9a2e" />
      <circle cx="100" cy="100" r="80" fill="url(#clockFace)" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 * Math.PI) / 180
        const big = i % 5 === 0
        const r1 = big ? 68 : 72
        return <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 77} y2={100 - Math.cos(a) * 77} stroke={INK} strokeWidth={big ? 3 : 1} strokeLinecap="round" />
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1
        const a = (n * 30 * Math.PI) / 180
        return (
          <text key={n} x={100 + Math.sin(a) * 56} y={100 - Math.cos(a) * 56 + 7} textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="19" fill={INK}>
            {n}
          </text>
        )
      })}
      <line x1="100" y1="100" x2={100 + Math.sin((ha * Math.PI) / 180) * 38} y2={100 - Math.cos((ha * Math.PI) / 180) * 38} stroke="#e8463c" strokeWidth="8" strokeLinecap="round" />
      <line x1="100" y1="100" x2={100 + Math.sin((ma * Math.PI) / 180) * 62} y2={100 - Math.cos((ma * Math.PI) / 180) * 62} stroke="#2a7fd4" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="7" fill={INK} />
    </svg>
  )
}

function Pie({ n, d, size }: { n: number; d: number; size: number }) {
  const r = 80
  const parts = Array.from({ length: d }).map((_, i) => {
    const a0 = (i / d) * Math.PI * 2 - Math.PI / 2
    const a1 = ((i + 1) / d) * Math.PI * 2 - Math.PI / 2
    const large = a1 - a0 > Math.PI ? 1 : 0
    const p = d === 1 ? '' : `M100 100 L ${100 + Math.cos(a0) * r} ${100 + Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${100 + Math.cos(a1) * r} ${100 + Math.sin(a1) * r} Z`
    return { p, filled: i < n }
  })
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`${d} eş parçadan ${n} tanesi boyalı`}>
      <circle cx="100" cy="106" r="82" fill="rgba(0,0,0,0.12)" />
      <circle cx="100" cy="100" r="82" fill="#f3d9a4" />
      {d === 1 ? (
        <circle cx="100" cy="100" r={r} fill={n ? '#ff9a2e' : '#fff8e9'} stroke={INK} strokeWidth="3" />
      ) : (
        parts.map((x, i) => <path key={i} d={x.p} fill={x.filled ? '#ff9a2e' : '#fff8e9'} stroke={INK} strokeWidth="3" strokeLinejoin="round" />)
      )}
      {n > 0 && d > 1 && (
        <g opacity="0.35">
          {parts.filter((x) => x.filled).map((x, i) => <path key={i} d={x.p} fill="url(#pepperoni)" />)}
        </g>
      )}
    </svg>
  )
}

function Bar({ n, d, w }: { n: number; d: number; w: number }) {
  return (
    <svg viewBox={`0 0 ${d * 50 + 8} 70`} width={w} role="img" aria-label={`${d} eş parçadan ${n} tanesi boyalı`}>
      <rect x="4" y="10" width={d * 50} height="54" rx="8" fill="rgba(0,0,0,0.12)" />
      {Array.from({ length: d }).map((_, i) => (
        <rect key={i} x={4 + i * 50} y="4" width="50" height="54" fill={i < n ? '#9b6ef3' : '#fff8e9'} stroke={INK} strokeWidth="3" />
      ))}
    </svg>
  )
}

const SHAPE_COL: Record<ShapeKind, string> = {
  ucgen: '#ff9a2e',
  kare: '#2ec4c9',
  dikdortgen: '#5bc236',
  cember: '#ff7aa8',
  daire: '#ff7aa8',
  besgen: '#9b6ef3',
  altigen: '#ffd23f',
  sekizgen: '#e8463c',
}

function polygon(n: number, r: number, rot = -Math.PI / 2) {
  return Array.from({ length: n })
    .map((_, i) => {
      const a = rot + (i / n) * Math.PI * 2
      return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`
    })
    .join(' ')
}

export function Shape({ kind, size = 170, color }: { kind: ShapeKind; size?: number; color?: string }) {
  const c = color ?? SHAPE_COL[kind]
  const common = { fill: c, stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const }
  let el: React.ReactNode
  switch (kind) {
    case 'ucgen':
      el = <polygon points="100,22 182,166 18,166" {...common} />
      break
    case 'kare':
      el = <rect x="30" y="30" width="140" height="140" rx="6" {...common} />
      break
    case 'dikdortgen':
      el = <rect x="14" y="50" width="172" height="100" rx="6" {...common} />
      break
    case 'cember':
      el = <circle cx="100" cy="100" r="74" fill="none" stroke={c} strokeWidth="12" />
      break
    case 'daire':
      el = <circle cx="100" cy="100" r="76" {...common} />
      break
    case 'besgen':
      el = <polygon points={polygon(5, 82)} {...common} />
      break
    case 'altigen':
      el = <polygon points={polygon(6, 82, 0)} {...common} />
      break
    case 'sekizgen':
      el = <polygon points={polygon(8, 82, Math.PI / 8)} {...common} />
      break
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={kind}>
      <g transform="translate(4 6)" opacity="0.18">
        {el}
      </g>
      {el}
      <ellipse cx="78" cy="70" rx="22" ry="10" fill="#fff" opacity="0.3" />
    </svg>
  )
}

export function Solid({ kind, size = 170 }: { kind: SolidKind; size?: number }) {
  const s = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const }
  let el: React.ReactNode
  switch (kind) {
    case 'kup':
      el = (
        <g>
          <polygon points="50,70 120,70 120,160 50,160" fill="#2ec4c9" {...s} />
          <polygon points="50,70 85,40 155,40 120,70" fill="#7be3e6" {...s} />
          <polygon points="120,70 155,40 155,130 120,160" fill="#149aa0" {...s} />
        </g>
      )
      break
    case 'kare-prizma':
      el = (
        <g>
          <polygon points="60,60 110,60 110,175 60,175" fill="#ffd23f" {...s} />
          <polygon points="60,60 85,38 135,38 110,60" fill="#ffe98a" {...s} />
          <polygon points="110,60 135,38 135,153 110,175" fill="#e8a40c" {...s} />
        </g>
      )
      break
    case 'dikdortgen-prizma':
      el = (
        <g>
          <polygon points="20,90 140,90 140,160 20,160" fill="#5bc236" {...s} />
          <polygon points="20,90 55,62 175,62 140,90" fill="#9be86e" {...s} />
          <polygon points="140,90 175,62 175,132 140,160" fill="#3a8f1d" {...s} />
        </g>
      )
      break
    case 'ucgen-prizma':
      el = (
        <g>
          <polygon points="30,160 80,70 130,160" fill="#ff9a2e" {...s} />
          <polygon points="80,70 135,45 180,135 130,160" fill="#d8670b" {...s} />
          <polygon points="80,70 135,45 135,45" fill="#ffc07a" {...s} />
        </g>
      )
      break
    case 'kure':
      el = (
        <g>
          <defs>
            <radialGradient id="sph" cx="35%" cy="30%" r="70%">
              <stop offset="0" stopColor="#ffd0e4" />
              <stop offset="1" stopColor="#d9467f" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="72" fill="url(#sph)" {...s} />
        </g>
      )
      break
    case 'silindir':
      el = (
        <g>
          <path d="M45 55 L 45 150 A 55 18 0 0 0 155 150 L 155 55" fill="#9b6ef3" {...s} />
          <ellipse cx="100" cy="55" rx="55" ry="18" fill="#c9b0ff" {...s} />
        </g>
      )
      break
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={kind}>
      <ellipse cx="100" cy="182" rx="70" ry="8" fill="rgba(0,0,0,0.15)" />
      {el}
    </svg>
  )
}

function Angle({ deg, size }: { deg: number; size: number }) {
  const a = (deg * Math.PI) / 180
  const x2 = 40 + Math.cos(-a) * 130
  const y2 = 160 + Math.sin(-a) * 130
  const r = 36
  const ax = 40 + Math.cos(-a) * r
  const ay = 160 + Math.sin(-a) * r
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="açı">
      <path d={`M ${40 + r} 160 A ${r} ${r} 0 0 0 ${ax} ${ay} L 40 160 Z`} fill="#ffd23f" opacity="0.7" />
      {deg === 90 && <rect x="40" y="136" width="24" height="24" fill="none" stroke={INK} strokeWidth="3" />}
      <line x1="40" y1="160" x2="185" y2="160" stroke="#2a7fd4" strokeWidth="7" strokeLinecap="round" />
      <line x1="40" y1="160" x2={x2} y2={y2} stroke="#e8463c" strokeWidth="7" strokeLinecap="round" />
      <circle cx="40" cy="160" r="7" fill={INK} />
    </svg>
  )
}

function Blocks({ h, t, o, s }: { h: number; t: number; o: number; s: number }) {
  const u = 12 * s * 1.3
  return (
    <div className="flex items-end gap-4" role="img" aria-label={`${h} yüzlük, ${t} onluk, ${o} birlik`}>
      {h > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: h }).map((_, i) => (
            <div key={i} className="grid grid-cols-10 gap-[1px] rounded-sm bg-[#d8670b] p-[1px]" style={{ width: u * 10 }}>
              {Array.from({ length: 100 }).map((__, k) => (
                <span key={k} className="block bg-[#ffb35c]" style={{ height: u - 1 }} />
              ))}
            </div>
          ))}
        </div>
      )}
      {t > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: t }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[1px] rounded-sm bg-[#149aa0] p-[1px]">
              {Array.from({ length: 10 }).map((__, k) => (
                <span key={k} className="block bg-[#5ee0e4]" style={{ width: u - 1, height: u - 1 }} />
              ))}
            </div>
          ))}
        </div>
      )}
      {o > 0 && (
        <div className="flex max-w-[90px] flex-wrap gap-1">
          {Array.from({ length: o }).map((_, i) => (
            <span key={i} className="block rounded-sm border border-[#6b43c4] bg-[#c9b0ff]" style={{ width: u, height: u }} />
          ))}
        </div>
      )}
    </div>
  )
}

const NOTE_COL: Record<number, string> = { 1: '#b8d98a', 5: '#c9a37a', 10: '#e88b8b', 20: '#8bc9a3', 50: '#f3b16b', 100: '#9fc3ea', 200: '#d6a8e0' }
function Note({ tl, s }: { tl: number; s: number }) {
  const c = NOTE_COL[tl] ?? '#cde3a8'
  if (tl === 1)
    return (
      <div className="grid place-items-center rounded-full border-4 border-[#b8902a] bg-gradient-to-br from-[#ffe68a] to-[#e2b23a] shadow" style={{ width: 70 * s * 1.4, height: 70 * s * 1.4 }}>
        <span className="mk-display text-[22px] text-[#6b4a0a]">1 TL</span>
      </div>
    )
  return (
    <div className="relative grid place-items-center rounded-lg border-[3px] shadow-[0_4px_0_rgba(0,0,0,0.15)]" style={{ width: 150 * s * 1.3, height: 76 * s * 1.3, background: `linear-gradient(135deg, ${c}, #fff 120%)`, borderColor: '#00000033' }}>
      <span className="mk-display text-[28px]" style={{ color: INK, fontSize: 28 * s * 1.3 }}>
        {tl} TL
      </span>
      <span className="absolute left-2 top-1 text-[11px] font-black opacity-60">{tl}</span>
    </div>
  )
}
function CoinV({ kr, s }: { kr: number; s: number }) {
  return (
    <div className="grid place-items-center rounded-full border-4 border-[#9a9a9a] bg-gradient-to-br from-[#f4f4f4] to-[#bdbdbd] shadow" style={{ width: 62 * s * 1.4, height: 62 * s * 1.4 }}>
      <span className="mk-display text-[17px] leading-none text-[#444]">{kr} kr</span>
    </div>
  )
}

function WordBoxes({ img, word, hide, s }: { img?: string; word: string; hide: number[]; s: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {img && (
        <div className="mk-float">
          <Obj name={img} size={170 * s} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-1.5">
        {[...word].map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="w-3" />
          ) : (
            <span
              key={i}
              className="mk-display grid h-[54px] w-[46px] place-items-center rounded-xl text-[32px]"
              style={{
                background: hide.includes(i) ? '#fff' : 'rgba(255,255,255,0.88)',
                border: hide.includes(i) ? '3px dashed #ff9a2e' : '3px solid #e9cf9c',
                boxShadow: '0 4px 0 rgba(0,0,0,0.12)',
              }}
            >
              {hide.includes(i) ? '?' : upperTR(ch)}
            </span>
          ),
        )}
      </div>
    </div>
  )
}
