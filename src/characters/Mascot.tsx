/**
 * FINDIK — Minik Kaşifler'in özgün maskotu.
 * Kaşif gözlüklü, turkuaz atkılı, meraklı bir tilki.
 *
 * Parçalı SVG rig'i + Framer Motion. Her poz, parça başına bir animasyon tanımıdır.
 * Rive'a geçişte bu bileşenin dış arayüzü (pose, size) aynı kalır.
 */
import { motion, type TargetAndTransition, type Transition } from 'framer-motion'
import { useId, type CSSProperties } from 'react'
import { useGame } from '../state/store'
import { useCharacterArt } from '../art/artRegistry'

export type MascotPose = 'idle' | 'wave' | 'cheer' | 'think' | 'surprised' | 'sad' | 'clap' | 'jump' | 'walk' | 'run'

type Eyes = 'open' | 'happy' | 'wide' | 'down' | 'up'
type Mouth = 'smile' | 'open' | 'o' | 'frown' | 'hmm'

const FACE: Record<MascotPose, { eyes: Eyes; mouth: Mouth }> = {
  idle: { eyes: 'open', mouth: 'smile' },
  wave: { eyes: 'open', mouth: 'open' },
  cheer: { eyes: 'happy', mouth: 'open' },
  think: { eyes: 'up', mouth: 'hmm' },
  surprised: { eyes: 'wide', mouth: 'o' },
  sad: { eyes: 'down', mouth: 'frown' },
  clap: { eyes: 'happy', mouth: 'open' },
  jump: { eyes: 'happy', mouth: 'open' },
  walk: { eyes: 'open', mouth: 'smile' },
  run: { eyes: 'open', mouth: 'open' },
}

type Part = 'root' | 'body' | 'head' | 'armL' | 'armR' | 'legL' | 'legR' | 'tail' | 'earL' | 'earR'
type PoseDef = Partial<Record<Part, TargetAndTransition>>

const loop = (duration: number, extra: Transition = {}): Transition => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut',
  ...extra,
})

const POSES: Record<MascotPose, PoseDef> = {
  idle: {
    root: { y: 0, rotate: 0 },
    body: { scaleY: [1, 1.025, 1], transition: loop(2.6) },
    head: { rotate: [-2, 2, -2], y: [0, -2, 0], transition: loop(3.2) },
    armL: { rotate: [6, 2, 6], transition: loop(2.6) },
    armR: { rotate: [-6, -2, -6], transition: loop(2.6) },
    earL: { rotate: [0, -6, 0, 0], transition: loop(3.5, { times: [0, 0.1, 0.2, 1] }) },
    earR: { rotate: 0 },
  },
  wave: {
    head: { rotate: [4, 8, 4], transition: loop(1.2) },
    armL: { rotate: 8 },
    armR: { rotate: [-150, -120, -150], transition: loop(0.55) },
    body: { scaleY: 1 },
  },
  cheer: {
    root: { y: [0, -36, 0, 0], transition: loop(0.9, { times: [0, 0.35, 0.6, 1] }) },
    body: { scaleY: [0.92, 1.06, 0.95, 1], scaleX: [1.06, 0.96, 1.04, 1], transition: loop(0.9, { times: [0, 0.35, 0.6, 1] }) },
    armL: { rotate: [150, 165, 150], transition: loop(0.45) },
    armR: { rotate: [-150, -165, -150], transition: loop(0.45) },
    head: { rotate: [-4, 4, -4], transition: loop(0.9) },
    earL: { rotate: -8 },
    earR: { rotate: 8 },
  },
  think: {
    head: { rotate: [8, 11, 8], transition: loop(2.4) },
    armR: { rotate: 117 },
    armL: { rotate: 10 },
    body: { scaleY: [1, 1.015, 1], transition: loop(2.4) },
    earR: { rotate: [0, 10, 0], transition: loop(2.4) },
  },
  surprised: {
    root: { y: [0, -18, 0], transition: { duration: 0.35 } },
    armL: { rotate: 60 },
    armR: { rotate: -60 },
    earL: { rotate: -12 },
    earR: { rotate: 12 },
    head: { rotate: 0, scale: [1, 1.06, 1], transition: { duration: 0.4 } },
  },
  sad: {
    head: { rotate: -6, y: 8 },
    earL: { rotate: 28 },
    earR: { rotate: -28 },
    armL: { rotate: 2 },
    armR: { rotate: -2 },
    tail: { rotate: 18 },
    body: { scaleY: 0.97 },
  },
  clap: {
    armL: { rotate: [-40, -62, -40], transition: loop(0.32) },
    armR: { rotate: [40, 62, 40], transition: loop(0.32) },
    root: { y: [0, -6, 0], transition: loop(0.64) },
    head: { rotate: [-3, 3, -3], transition: loop(0.64) },
  },
  jump: {
    root: { y: [0, 6, -60, 0, 0], transition: loop(1.1, { times: [0, 0.15, 0.45, 0.75, 1] }) },
    body: { scaleY: [1, 0.86, 1.08, 0.9, 1], transition: loop(1.1, { times: [0, 0.15, 0.45, 0.75, 1] }) },
    armL: { rotate: [10, 30, 130, 20, 10], transition: loop(1.1, { times: [0, 0.15, 0.45, 0.75, 1] }) },
    armR: { rotate: [-10, -30, -130, -20, -10], transition: loop(1.1, { times: [0, 0.15, 0.45, 0.75, 1] }) },
  },
  walk: {
    root: { y: [0, -5, 0, -5, 0], transition: loop(0.8, { ease: 'linear' }) },
    legL: { rotate: [18, -18, 18], transition: loop(0.8) },
    legR: { rotate: [-18, 18, -18], transition: loop(0.8) },
    armL: { rotate: [-20, 20, -20], transition: loop(0.8) },
    armR: { rotate: [-20, 20, -20], transition: loop(0.8) },
    head: { rotate: [-2, 2, -2], transition: loop(0.8) },
  },
  run: {
    root: { y: [0, -14, 0, -14, 0], rotate: 6, transition: { y: loop(0.45, { ease: 'linear' }) } },
    legL: { rotate: [35, -35, 35], transition: loop(0.45) },
    legR: { rotate: [-35, 35, -35], transition: loop(0.45) },
    armL: { rotate: [-50, 50, -50], transition: loop(0.45) },
    armR: { rotate: [-50, 50, -50], transition: loop(0.45) },
    earL: { rotate: 14 },
    earR: { rotate: -14 },
  },
}

const REST: Record<Part, TargetAndTransition> = {
  root: { y: 0, rotate: 0 },
  body: { scaleY: 1, scaleX: 1 },
  head: { rotate: 0, y: 0, scale: 1 },
  armL: { rotate: 8 },
  armR: { rotate: -8 },
  legL: { rotate: 0 },
  legR: { rotate: 0 },
  tail: { rotate: 0 },
  earL: { rotate: 0 },
  earR: { rotate: 0 },
}

interface Props {
  pose?: MascotPose
  size?: number
  className?: string
  style?: CSSProperties
  /** Bakış yönü */
  flip?: boolean
  title?: string
}

export function Mascot(props: Props) {
  const art = useCharacterArt('findik', props.pose ?? 'idle')
  if (art) return <ArtCharacter src={art} {...props} />
  return <MascotSvg {...props} />
}

/** Sanat yuvasındaki raster karakter (referans kalitesi) — hafif nefes/zıplama animasyonu */
function ArtCharacter({ src, pose = 'idle', size = 260, className, style, flip, title = 'Fındık' }: Props & { src: string }) {
  const calm = useGame((s) => s.settings.calm)
  const bouncy = pose === 'cheer' || pose === 'jump'
  return (
    <motion.img
      key={src}
      src={src}
      alt={title}
      className={className}
      style={{ width: size, height: (size * 360) / 300, objectFit: 'contain', transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={calm ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: bouncy ? [0, -24, 0] : [0, -4, 0] }}
      transition={{ y: { duration: bouncy ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.25 } }}
      draggable={false}
    />
  )
}

function MascotSvg({ pose = 'idle', size = 260, className, style, flip, title = 'Fındık' }: Props) {
  const calm = useGame((s) => s.settings.calm)
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${n}-${uid}`
  const face = FACE[pose]
  const def = POSES[pose]

  const anim = (p: Part): TargetAndTransition => {
    const target = { ...REST[p], ...(def[p] ?? {}) }
    if (calm) {
      // sakin modda döngüleri durdur, son pozu koru
      const still: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(target)) {
        if (k === 'transition') continue
        still[k] = Array.isArray(v) ? v[0] : v
      }
      return { ...(still as TargetAndTransition), transition: { duration: 0.3 } }
    }
    return { transition: { type: 'spring', stiffness: 260, damping: 18 }, ...target }
  }

  const g = (p: Part, ox: number, oy: number) => ({
    animate: anim(p),
    style: { originX: ox, originY: oy } as CSSProperties,
  })

  return (
    <svg
      viewBox="0 0 300 360"
      width={size}
      height={(size * 360) / 300}
      className={className}
      style={{ overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      role="img"
      aria-label={title}
    >
      <defs>
        <radialGradient id={id('fur')} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#ffb860" />
          <stop offset="0.55" stopColor="#f5862b" />
          <stop offset="1" stopColor="#d4621a" />
        </radialGradient>
        <radialGradient id={id('furHead')} cx="38%" cy="30%" r="78%">
          <stop offset="0" stopColor="#ffc06c" />
          <stop offset="0.6" stopColor="#f68a2d" />
          <stop offset="1" stopColor="#d9661c" />
        </radialGradient>
        <radialGradient id={id('cream')} cx="45%" cy="25%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe9cf" />
        </radialGradient>
        <radialGradient id={id('lens')} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#c9fbff" />
          <stop offset="0.5" stopColor="#4fd3dd" />
          <stop offset="1" stopColor="#127f8a" />
        </radialGradient>
        <linearGradient id={id('brass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b8791b" />
        </linearGradient>
        <linearGradient id={id('scarf')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ee0e4" />
          <stop offset="1" stopColor="#139aa1" />
        </linearGradient>
        <radialGradient id={id('iris')} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#6b3d1c" />
          <stop offset="1" stopColor="#1f120a" />
        </radialGradient>
      </defs>

      {/* zemin gölgesi */}
      <motion.ellipse
        cx="150"
        cy="346"
        rx="72"
        ry="11"
        fill="rgba(40,20,0,0.22)"
        animate={pose === 'jump' || pose === 'cheer' ? { scaleX: [1, 0.7, 1] } : { scaleX: 1 }}
        transition={{ duration: pose === 'jump' ? 1.1 : 0.9, repeat: calm ? 0 : Infinity }}
        style={{ originX: 0.5, originY: 0.5 }}
      />

      <motion.g {...g('root', 0.5, 1)}>
        {/* KUYRUK */}
        <motion.g
          animate={
            calm
              ? { rotate: 0 }
              : { rotate: def.tail ? (def.tail.rotate as number) : [-6, 8, -6] }
          }
          transition={{ duration: 1.6, repeat: def.tail || calm ? 0 : Infinity, ease: 'easeInOut' }}
          style={{ originX: 0.05, originY: 0.85 }}
        >
          <path
            d="M182 292 C 246 300, 292 248, 278 186 C 270 152, 238 140, 228 168 C 244 214, 226 252, 178 260 Z"
            fill={`url(#${id('fur')})`}
          />
          <path d="M228 170 C 226 146, 252 132, 272 152 C 284 166, 282 186, 278 196 C 262 188, 240 186, 228 170 Z" fill={`url(#${id('cream')})`} />
          <path d="M200 286 C 236 286, 264 262, 270 228" stroke="#c75a17" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.45" />
        </motion.g>

        {/* BACAKLAR */}
        <motion.g {...g('legL', 0.5, 0.05)}>
          <rect x="116" y="284" width="30" height="44" rx="14" fill="#e3711f" />
          <path d="M108 322 Q108 310 122 310 L142 310 Q152 310 152 322 L152 330 Q152 340 140 340 L116 340 Q108 340 108 330 Z" fill="#6b3a1a" />
          <rect x="112" y="312" width="38" height="6" rx="3" fill="#8f5428" />
        </motion.g>
        <motion.g {...g('legR', 0.5, 0.05)}>
          <rect x="154" y="284" width="30" height="44" rx="14" fill="#e3711f" />
          <path d="M148 322 Q148 310 158 310 L178 310 Q192 310 192 322 L192 330 Q192 340 184 340 L160 340 Q148 340 148 330 Z" fill="#6b3a1a" />
          <rect x="150" y="312" width="38" height="6" rx="3" fill="#8f5428" />
        </motion.g>

        {/* GÖVDE */}
        <motion.g {...g('body', 0.5, 1)}>
          {/* sırt çantası (arkada) */}
          <rect x="96" y="232" width="108" height="66" rx="24" fill="#8a5a2b" />
          <path d="M98 270 L 202 270" stroke="#6e4620" strokeWidth="4" />
          <path d="M150 220 C 205 220, 206 300, 150 304 C 94 300, 95 220, 150 220 Z" fill={`url(#${id('fur')})`} />
          <ellipse cx="150" cy="276" rx="31" ry="26" fill={`url(#${id('cream')})`} />
          {/* çanta askıları */}
          <path d="M118 230 C 112 254, 114 276, 120 296" stroke="#7a4b20" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M182 230 C 188 254, 186 276, 180 296" stroke="#7a4b20" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="116" cy="262" r="4" fill={`url(#${id('brass')})`} />
          <circle cx="184" cy="262" r="4" fill={`url(#${id('brass')})`} />
          {/* atkı */}
          <path d="M104 222 Q150 244 196 222 L198 234 Q150 258 102 234 Z" fill={`url(#${id('scarf')})`} />
          <path d="M168 238 L 182 276 L 166 280 L 158 244 Z" fill="#139aa1" />
          <path d="M170 262 L 178 272" stroke="#7beef0" strokeWidth="3" />
        </motion.g>

        {/* KOLLAR */}
        <motion.g {...g('armL', 0.5, 0.08)}>
          <rect x="88" y="226" width="26" height="62" rx="13" fill={`url(#${id('fur')})`} transform="rotate(14 101 230)" />
          <circle cx="92" cy="288" r="13" fill="#5a3119" />
        </motion.g>
        <motion.g {...g('armR', 0.5, 0.08)}>
          <rect x="186" y="226" width="26" height="62" rx="13" fill={`url(#${id('fur')})`} transform="rotate(-14 199 230)" />
          <circle cx="208" cy="288" r="13" fill="#5a3119" />
        </motion.g>

        {/* KAFA */}
        <motion.g {...g('head', 0.5, 0.85)}>
          {/* kulaklar */}
          <motion.g {...g('earL', 0.7, 0.9)}>
            <path d="M74 124 C 66 84, 78 44, 100 30 C 118 46, 136 72, 138 98 Z" fill={`url(#${id('furHead')})`} />
            <path d="M88 108 C 84 82, 90 58, 102 48 C 114 62, 124 80, 124 98 Z" fill="#ffd2c2" />
            <path d="M92 44 C 96 36, 99 32, 100 30 C 108 36, 114 42, 118 48 C 108 46, 98 46, 92 44 Z" fill="#4a2a17" />
          </motion.g>
          <motion.g {...g('earR', 0.3, 0.9)}>
            <path d="M226 124 C 234 84, 222 44, 200 30 C 182 46, 164 72, 162 98 Z" fill={`url(#${id('furHead')})`} />
            <path d="M212 108 C 216 82, 210 58, 198 48 C 186 62, 176 80, 176 98 Z" fill="#ffd2c2" />
            <path d="M208 44 C 204 36, 201 32, 200 30 C 192 36, 186 42, 182 48 C 192 46, 202 46, 208 44 Z" fill="#4a2a17" />
          </motion.g>

          {/* kafa şekli */}
          <path
            d="M150 66 C 214 66, 250 106, 248 150 C 246 198, 206 226, 150 226 C 94 226, 54 198, 52 150 C 50 106, 86 66, 150 66 Z"
            fill={`url(#${id('furHead')})`}
          />
          {/* tepe perçemi */}
          <path d="M134 72 C 136 56, 150 50, 158 58 C 160 50, 172 50, 172 62 C 166 66, 150 70, 134 72 Z" fill="#f68a2d" />
          {/* yanak tüyleri + ağız bölgesi */}
          <path
            d="M60 156 C 84 172, 118 166, 150 186 C 182 166, 216 172, 240 156 C 236 204, 198 226, 150 226 C 102 226, 64 204, 60 156 Z"
            fill={`url(#${id('cream')})`}
          />
          <path d="M60 158 L 50 168 L 64 170 Z M240 158 L 250 168 L 236 170 Z" fill="#ffe9cf" />

          {/* kaşif gözlüğü (alında) */}
          <path d="M60 108 C 100 92, 200 92, 240 108 L 238 122 C 200 106, 100 106, 62 122 Z" fill="#6b3a1a" />
          <g>
            <circle cx="120" cy="104" r="22" fill={`url(#${id('brass')})`} />
            <circle cx="120" cy="104" r="15.5" fill={`url(#${id('lens')})`} />
            <ellipse cx="114" cy="98" rx="6" ry="4" fill="#fff" opacity="0.8" />
            <circle cx="180" cy="104" r="22" fill={`url(#${id('brass')})`} />
            <circle cx="180" cy="104" r="15.5" fill={`url(#${id('lens')})`} />
            <ellipse cx="174" cy="98" rx="6" ry="4" fill="#fff" opacity="0.8" />
            <rect x="140" y="100" width="20" height="7" rx="3" fill="#b8791b" />
          </g>

          {/* yanak pembeliği */}
          <ellipse cx="94" cy="178" rx="15" ry="9" fill="#ff8a8a" opacity="0.45" />
          <ellipse cx="206" cy="178" rx="15" ry="9" fill="#ff8a8a" opacity="0.45" />

          {/* GÖZLER */}
          <motion.g
            animate={calm ? { scaleY: 1 } : { scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 0.25, times: [0, 0.3, 0.6, 1], repeat: Infinity, repeatDelay: 3.4 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <EyePair kind={face.eyes} irisId={id('iris')} />
          </motion.g>

          {/* burun */}
          <ellipse cx="150" cy="184" rx="11" ry="7.5" fill="#2b170c" />
          <ellipse cx="146" cy="181" rx="4" ry="2.2" fill="#fff" opacity="0.7" />

          {/* AĞIZ */}
          <MouthShape kind={face.mouth} />
        </motion.g>
      </motion.g>
    </svg>
  )
}

function EyePair({ kind, irisId }: { kind: Eyes; irisId: string }) {
  if (kind === 'happy') {
    return (
      <g stroke="#2b170c" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M104 152 Q 120 134 136 152" />
        <path d="M164 152 Q 180 134 196 152" />
      </g>
    )
  }
  const big = kind === 'wide'
  const dy = kind === 'down' ? 5 : kind === 'up' ? -5 : 0
  const dx = kind === 'up' ? 4 : 0
  const rx = big ? 17 : 15
  const ry = big ? 21 : 18.5
  return (
    <g>
      {[120, 180].map((cx) => (
        <g key={cx}>
          {big && <ellipse cx={cx} cy={148} rx={rx + 5} ry={ry + 5} fill="#fff" />}
          <ellipse cx={cx + dx} cy={148 + dy} rx={rx} ry={ry} fill={`url(#${irisId})`} />
          <ellipse cx={cx + dx - 5} cy={148 + dy - 7} rx={big ? 6.5 : 5.5} ry={big ? 7.5 : 6.5} fill="#fff" />
          <circle cx={cx + dx + 6} cy={148 + dy + 7} r="2.6" fill="#fff" opacity="0.85" />
        </g>
      ))}
      {kind === 'down' && (
        <g stroke="#7a3a12" strokeWidth="5" strokeLinecap="round">
          <path d="M104 124 L 130 132" />
          <path d="M196 124 L 170 132" />
        </g>
      )}
      {kind === 'up' && (
        <g stroke="#7a3a12" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M104 126 Q 118 118 132 124" />
          <path d="M168 120 Q 182 114 196 122" />
        </g>
      )}
    </g>
  )
}

function MouthShape({ kind }: { kind: Mouth }) {
  switch (kind) {
    case 'open':
      return (
        <g>
          <path d="M132 196 Q 150 226 168 196 Q 150 204 132 196 Z" fill="#5a1f12" />
          <path d="M140 208 Q 150 220 160 208 Q 150 204 140 208 Z" fill="#ff7d7d" />
        </g>
      )
    case 'o':
      return <ellipse cx="150" cy="206" rx="7" ry="9" fill="#5a1f12" />
    case 'frown':
      return <path d="M136 208 Q 150 196 164 208" stroke="#2b170c" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    case 'hmm':
      return <path d="M140 204 Q 152 200 162 206" stroke="#2b170c" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    default:
      return (
        <path d="M134 194 Q 142 204 150 194 Q 158 204 166 194" stroke="#2b170c" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )
  }
}
