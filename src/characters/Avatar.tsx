/**
 * Çocuk avatarı — kişiselleştirilebilir kaşif karakteri (chibi oranları: büyük kafa, kısa gövde).
 * Katman sırası: pelerin/çanta/arka saç → bacaklar+ayakkabı → boyun+gövde+kıyafet → kollar → kafa → ön saç → baş aksesuarları.
 * `view` ile yalnızca bir bölge çizilebilir (seçim karolarında aynı çizim kullanılır → tutarlı görünüm).
 */
import { motion, type TargetAndTransition } from 'framer-motion'
import { useId, useMemo, type CSSProperties, type ReactNode } from 'react'
import {
  HEIGHTS, bottomById, normalizeAvatar, shoeById, topById,
  type AvatarConfig, type AvatarInput, type BottomItem, type ShoeItem, type TopItem,
} from './avatarTypes'
import { useGame } from '../state/store'
import { useCharacterArt, type CharacterId } from '../art/artRegistry'

export type AvatarPose = 'idle' | 'wave' | 'cheer' | 'think'
export type AvatarView = 'full' | 'bust' | 'torso' | 'legs' | 'feet'

export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  const r = c(n >> 16)
  const g = c((n >> 8) & 255)
  const b = c(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

interface Props {
  config: AvatarInput
  pose?: AvatarPose
  size?: number
  className?: string
  style?: CSSProperties
  /** Sadece kafa ve omuzlar (HUD rozeti için) — view="bust" ile aynı */
  bust?: boolean
  view?: AvatarView
  /** Animasyonsuz (seçim karoları için) */
  still?: boolean
  /** Sanat yuvasında bu karakterin raster çizimi varsa onu kullan (kaşif: yalnızca varsayılan görünümde) */
  artId?: CharacterId
}

export function Avatar(props: Props) {
  const cfg = useMemo(() => normalizeAvatar(props.config), [props.config])
  const artKey: string = props.artId ?? cfg.preset ?? 'none'
  const art = useCharacterArt(artKey as CharacterId, props.pose ?? 'idle')
  const view = props.bust ? 'bust' : (props.view ?? 'full')
  const size = props.size ?? 220
  if (art && artKey !== 'none') {
    if (view === 'bust') return <RasterBust src={art} size={size} className={props.className} style={props.style} />
    if (view === 'full') {
      // tek pozlu hazır kaşiflerde sevinç/el sallama hareketle verilir
      const single = artKey.startsWith('kasif-')
      const motionAnim = !single || props.still ? undefined : props.pose === 'cheer' ? { y: [0, -18, 0], rotate: [0, -2, 0] } : props.pose === 'wave' ? { rotate: [0, 2, 0] } : { y: [0, -3, 0] }
      return (
        <motion.img
          src={art}
          alt="Kaşif"
          draggable={false}
          className={props.className}
          animate={motionAnim}
          transition={{ duration: props.pose === 'cheer' ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: size, height: (size * 320) / 240, objectFit: 'contain', objectPosition: 'bottom', transformOrigin: '50% 100%', ...props.style }}
        />
      )
    }
  }
  return <AvatarSvg {...props} cfg={cfg} view={view} />
}

/** Raster karakterin baş-omuz kırpımı (HUD rozeti, seçim karoları) */
function RasterBust({ src, size, className, style }: { src: string; size: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={`relative block overflow-hidden ${className ?? ''}`} style={{ width: size, height: size, ...style }} role="img" aria-label="Kaşif avatarı">
      <img src={src} alt="" draggable={false} style={{ position: 'absolute', left: '50%', top: '4%', height: size * 1.85, maxWidth: 'none', transform: 'translateX(-50%)' }} />
    </span>
  )
}

const LONG_SLEEVE = new Set(['ceket', 'hoodie', 'onluk', 'uzay', 'mont', 'pelerin'])

function AvatarSvg({ cfg, view, pose = 'idle', size = 220, className, style, still }: Props & { cfg: AvatarConfig; view: AvatarView }) {
  const calmSetting = useGame((s) => s.settings.calm)
  const calm = calmSetting || !!still
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${n}-${uid}`
  const url = (n: string) => `url(#${id(n)})`

  const top = topById(cfg.top)
  const bottom = bottomById(cfg.bottom)
  const shoe = shoeById(cfg.shoes)
  const legs = HEIGHTS.find((h) => h.id === cfg.height)?.legs ?? 42
  const H = 298 - legs // kalça
  const dy = H - 256 // üst gövde kayması (tasarım H=256 için yapıldı)
  const skinDark = shade(cfg.skin, -0.1)
  const hairDark = shade(cfg.hairColor, -0.14)
  const sleeveColor = top.kind === 'yelek' || top.kind === 'pelerin' ? top.inner : top.color
  const longSleeve = LONG_SLEEVE.has(top.kind)

  // animasyonlar
  const L = (t: TargetAndTransition): TargetAndTransition => (calm ? { ...t, transition: { duration: 0 } } : t)
  const rep = { repeat: Infinity, ease: 'easeInOut' as const }
  const pick = (t: TargetAndTransition, rest: TargetAndTransition) => (calm ? rest : t)
  const armR: TargetAndTransition =
    pose === 'wave' ? pick({ rotate: [-150, -120, -150], transition: { duration: 0.6, ...rep } }, { rotate: -140 })
      : pose === 'cheer' ? pick({ rotate: [-155, -168, -155], transition: { duration: 0.5, ...rep } }, { rotate: -160 })
        : pose === 'think' ? { rotate: 128 } : { rotate: -10 }
  const armL: TargetAndTransition = pose === 'cheer' ? pick({ rotate: [155, 168, 155], transition: { duration: 0.5, ...rep } }, { rotate: 160 }) : { rotate: 10 }
  const root: TargetAndTransition = pose === 'cheer' ? pick({ y: [0, -20, 0], transition: { duration: 0.8, ...rep } }, { y: 0 }) : pick({ y: [0, -3, 0], transition: { duration: 3, ...rep } }, { y: 0 })
  const head: TargetAndTransition = pose === 'think' ? { rotate: 7 } : pose === 'wave' ? pick({ rotate: [3, 6, 3], transition: { duration: 1.2, ...rep } }, { rotate: 3 }) : pick({ rotate: [-2, 2, -2], transition: { duration: 3.4, ...rep } }, { rotate: 0 })

  // görünüm kutusu
  const vb =
    view === 'bust' ? [30, 20 + dy, 180, 180]
      : view === 'torso' ? [78, 188 + dy, 84, 84]
        : view === 'legs' ? [74, H - 8, 92, 92]
          : view === 'feet' ? [84, 262, 72, 72]
            : [0, 0, 240, 320]
  const w = view === 'full' ? size : size
  const h = view === 'full' ? (size * 320) / 240 : size

  const grad = (name: string, c: string) => (
    <linearGradient id={id(name)} x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0" stopColor={shade(c, 0.1)} />
      <stop offset="0.5" stopColor={c} />
      <stop offset="1" stopColor={shade(c, -0.16)} />
    </linearGradient>
  )

  return (
    <svg viewBox={vb.join(' ')} width={w} height={h} preserveAspectRatio="xMidYMid meet" className={className} style={{ overflow: view === 'full' ? 'visible' : 'hidden', ...style }} role="img" aria-label="Kaşif avatarı">
      <defs>
        <radialGradient id={id('skin')} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor={shade(cfg.skin, 0.06)} />
          <stop offset="1" stopColor={skinDark} />
        </radialGradient>
        <linearGradient id={id('hair')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={shade(cfg.hairColor, 0.16)} />
          <stop offset="0.55" stopColor={cfg.hairColor} />
          <stop offset="1" stopColor={hairDark} />
        </linearGradient>
        <radialGradient id={id('iris')} cx="45%" cy="60%" r="60%">
          <stop offset="0" stopColor={shade(cfg.eye, 0.22)} />
          <stop offset="1" stopColor={shade(cfg.eye, -0.08)} />
        </radialGradient>
        {grad('top', top.color)}
        {grad('inner', top.inner)}
        {grad('sleeve', sleeveColor)}
        {grad('bottom', bottom.color)}
        {grad('shoe', shoe.color)}
      </defs>

      {view === 'full' && <ellipse cx="120" cy="313" rx="64" ry="8" fill="rgba(30,10,40,0.22)" />}

      <motion.g animate={L(root)}>
        {/* ARKA KATMAN: pelerin, çanta, uzun saç */}
        <g transform={`translate(0 ${dy})`}>
          {top.kind === 'pelerin' && (
            <motion.path
              d="M86 200 Q 58 262 60 300 Q 120 314 180 300 Q 182 262 154 200 Z"
              fill={url('top')}
              animate={calm ? {} : { skewX: [-2, 2, -2] }}
              transition={{ duration: 2.6, repeat: Infinity }}
              style={{ originY: 0 }}
            />
          )}
          {cfg.acc.sirt === 'canta' && (
            <g>
              <path d="M70 206 Q 68 196 80 194 L 160 194 Q 172 196 170 206 L 172 252 Q 120 260 68 252 Z" fill="#8a5a2e" />
              <path d="M70 230 L 66 250 Q 68 256 76 256 L 78 228 Z M170 230 L 174 250 Q 172 256 164 256 L 162 228 Z" fill="#6e4520" />
            </g>
          )}
          <BackHair style={cfg.hair} fill={url('hair')} dark={hairDark} />
        </g>

        {/* BACAKLAR + AYAKKABI */}
        <Legs H={H} bottom={bottom} shoe={shoe} skin={url('skin')} skinDark={skinDark} fillB={url('bottom')} fillS={url('shoe')} />

        {/* ÜST GÖVDE */}
        <g transform={`translate(0 ${dy})`}>
          <rect x="109" y="184" width="22" height="24" rx="8" fill={skinDark} />
          <Torso top={top} bottom={bottom} url={url} skinDark={skinDark} />
          {cfg.acc.sirt === 'canta' && <path d="M96 198 Q 92 220 94 244 M144 198 Q 148 220 146 244" stroke="#6e4520" strokeWidth="7" strokeLinecap="round" fill="none" />}
          {cfg.acc.boyun === 'atki' && (
            <g>
              <path d="M90 194 Q 120 212 150 194 L 152 207 Q 120 226 88 207 Z" fill="#e8463c" />
              <path d="M136 206 L 152 204 L 156 240 L 140 242 Z" fill="#d1352c" />
              <path d="M100 202 L 102 212 M114 206 L 115 216 M128 206 L 127 216 M140 240 L 156 238" stroke="#fff" strokeWidth="3" opacity="0.7" />
            </g>
          )}
          {cfg.acc.boyun === 'kolye' && (
            <g>
              <path d="M104 198 Q 120 222 136 198" stroke="#e8b33a" strokeWidth="2.5" fill="none" />
              <path d="M120 214 l3.5 7 7.5 1 -5.5 5 1.4 7.5 -6.9 -3.6 -6.9 3.6 1.4 -7.5 -5.5 -5 7.5 -1 Z" fill="#ffd23f" stroke="#d99a12" strokeWidth="1.5" />
            </g>
          )}

          {/* kollar */}
          <motion.g animate={L(armL)} style={{ originX: 0.5, originY: 0.08 }}>
            <Arm x={82} y={204} long={longSleeve} fill={url('sleeve')} cuff={top.kind === 'uzay' ? top.accent : shade(sleeveColor, -0.12)} skin={url('skin')} watch={cfg.acc.bilek === 'saat'} mont={top.kind === 'mont'} />
          </motion.g>
          <motion.g animate={L(armR)} style={{ originX: 0.5, originY: 0.08 }}>
            <Arm x={158} y={204} long={longSleeve} fill={url('sleeve')} cuff={top.kind === 'uzay' ? top.accent : shade(sleeveColor, -0.12)} skin={url('skin')} mont={top.kind === 'mont'} />
          </motion.g>

          {/* KAFA */}
          <motion.g animate={L(head)} style={{ originX: 0.5, originY: 0.9 }}>
            <ellipse cx="48" cy="128" rx="12" ry="15" fill={url('skin')} />
            <ellipse cx="192" cy="128" rx="12" ry="15" fill={url('skin')} />
            <path d="M120 44 C 172 44, 196 80, 194 124 C 192 172, 160 200, 120 200 C 80 200, 48 172, 46 124 C 44 80, 68 44, 120 44 Z" fill={url('skin')} />
            <Face cfg={cfg} pose={pose} calm={calm} skinDark={skinDark} hairDark={hairDark} iris={url('iris')} />
            <FrontHair style={cfg.hair} fill={url('hair')} dark={hairDark} />
            <HeadAcc acc={cfg.acc} />
          </motion.g>
        </g>
      </motion.g>
    </svg>
  )
}

// ───────────────────────── gövde ve kıyafet
function Torso({ top, bottom, url, skinDark }: { top: TopItem; bottom: BottomItem; url: (n: string) => string; skinDark: string }) {
  const body = 'M82 206 C 86 198, 100 195, 120 195 C 140 195, 154 198, 158 206 L 164 252 C 150 261, 90 261, 76 252 Z'
  const panelL = 'M82 206 C 86 198, 96 195, 108 196 L 112 260 C 98 260, 84 257, 76 252 Z'
  const panelR = 'M158 206 C 154 198, 144 195, 132 196 L 128 260 C 142 260, 156 257, 164 252 Z'
  const neck = <path d="M106 196 Q 120 211 134 196 Z" fill={skinDark} />
  const star = (x: number, y: number, c: string, s = 1) => (
    <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -8 l2.4 5 5.5 .7 -4 3.8 1 5.4 -4.9 -2.6 -4.9 2.6 1 -5.4 -4 -3.8 5.5 -.7 Z" fill={c} />
  )
  const shading = <path d="M146 204 C 156 214, 162 238, 164 252 C 156 257, 148 258, 140 259 C 146 240, 148 220, 146 204 Z" fill="#000" opacity="0.08" />
  const bib = bottom.kind === 'tulum' && (
    <g>
      <path d="M98 220 L 142 220 L 144 258 L 96 258 Z" fill={url('bottom')} />
      <path d="M98 222 L 92 198 M142 222 L 148 198" stroke={shade(bottom.color, -0.1)} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="226" r="3.5" fill="#e8b33a" />
      <circle cx="140" cy="226" r="3.5" fill="#e8b33a" />
      <rect x="110" y="232" width="20" height="14" rx="3" fill={shade(bottom.color, -0.08)} />
    </g>
  )

  switch (top.kind) {
    case 'ceket':
    case 'yelek':
    case 'onluk':
      return (
        <g>
          <path d={body} fill={url('inner')} />
          {neck}
          {top.kind !== 'onluk' && star(120, 228, top.kind === 'yelek' ? top.accent : top.color, 1.2)}
          {top.kind === 'onluk' && <path d="M112 200 L 120 214 L 128 200" fill="none" stroke={shade(top.inner, -0.2)} strokeWidth="3" />}
          {bib}
          {top.kind === 'onluk' ? (
            <g>
              <path d="M82 206 C 86 198, 96 195, 108 196 L 112 284 C 98 285, 82 282, 72 278 Z" fill={url('top')} />
              <path d="M158 206 C 154 198, 144 195, 132 196 L 128 284 C 142 285, 158 282, 168 278 Z" fill={url('top')} />
              <path d="M108 196 L 100 222 L 110 230 M132 196 L 140 222 L 130 230" fill="none" stroke="#d7deec" strokeWidth="3" />
              <rect x="138" y="236" width="18" height="16" rx="3" fill="#e9eef8" stroke="#cfd7e6" strokeWidth="2" />
              <rect x="144" y="228" width="4" height="12" rx="2" fill={top.accent} />
            </g>
          ) : (
            <g>
              <path d={panelL} fill={url('top')} />
              <path d={panelR} fill={url('top')} />
              <path d="M108 197 L 112 259 M132 197 L 128 259" stroke={top.accent} strokeWidth="3.5" strokeLinecap="round" />
              {top.kind === 'ceket' && (
                <g>
                  <path d="M96 192 Q 120 206 144 192 Q 150 184 142 182 Q 120 196 98 182 Q 90 184 96 192 Z" fill={shade(top.color, -0.06)} />
                  <rect x="84" y="232" width="18" height="14" rx="3" fill={shade(top.color, -0.1)} />
                  <rect x="138" y="232" width="18" height="14" rx="3" fill={shade(top.color, -0.1)} />
                  <path d="M86 236 L 100 236 M140 236 L 154 236" stroke={top.accent} strokeWidth="2" />
                  <path d="M77 250 C 90 258, 104 259, 112 259 L 112 254 C 100 254, 88 252, 78 246 Z M163 250 C 150 258, 136 259, 128 259 L 128 254 C 140 254, 152 252, 162 246 Z" fill={shade(top.color, -0.14)} />
                </g>
              )}
              {top.kind === 'yelek' && <path d="M90 214 L 102 214 M138 214 L 150 214 M88 230 L 104 230 M136 230 L 152 230" stroke={shade(top.color, -0.2)} strokeWidth="2.5" />}
            </g>
          )}
          {shading}
        </g>
      )
    case 'hoodie':
    case 'mont':
      return (
        <g>
          <path d="M88 206 Q 80 184 100 180 L 140 180 Q 160 184 152 206 Z" fill={shade(top.color, -0.1)} />
          <path d={body} fill={url('top')} transform={top.kind === 'mont' ? 'translate(120 228) scale(1.06 1.02) translate(-120 -228)' : undefined} />
          {neck}
          {top.kind === 'hoodie' ? (
            <g>
              <path d="M98 232 Q 120 228 142 232 L 146 252 Q 120 256 94 252 Z" fill={shade(top.color, -0.08)} />
              <path d="M112 202 L 110 222 M128 202 L 130 222" stroke={top.accent} strokeWidth="3" strokeLinecap="round" />
              <circle cx="110" cy="224" r="2.6" fill={top.accent} />
              <circle cx="130" cy="224" r="2.6" fill={top.accent} />
              <path d="M78 250 C 100 260, 140 260, 162 250 L 163 256 C 140 264, 100 264, 77 256 Z" fill={shade(top.color, -0.12)} />
            </g>
          ) : (
            <g>
              <path d="M84 196 Q 120 214 156 196 Q 160 188 150 186 Q 120 202 90 186 Q 80 188 84 196 Z" fill={top.accent} />
              <path d="M76 222 Q 120 230 164 222 M75 240 Q 120 248 165 240" stroke={shade(top.color, -0.14)} strokeWidth="2.5" fill="none" />
              <path d="M120 204 L 120 260" stroke={shade(top.color, -0.25)} strokeWidth="2.5" />
            </g>
          )}
          {shading}
        </g>
      )
    case 'uzay':
      return (
        <g>
          <path d={body} fill={url('top')} />
          <path d="M92 194 Q 120 210 148 194 L 150 202 Q 120 218 90 202 Z" fill="#c9d2e3" />
          {neck}
          <rect x="104" y="218" width="32" height="24" rx="5" fill="#3b4a6b" />
          <circle cx="112" cy="226" r="3" fill="#ff5a4f" />
          <circle cx="121" cy="226" r="3" fill="#ffd23f" />
          <circle cx="130" cy="226" r="3" fill="#5bc236" />
          <rect x="108" y="233" width="24" height="4" rx="2" fill="#7fd6ff" />
          <path d="M80 214 L 96 216 M144 216 L 160 214" stroke={top.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M76 250 Q 120 262 164 250" stroke="#c9d2e3" strokeWidth="6" fill="none" />
          {shading}
        </g>
      )
    case 'pelerin':
      return (
        <g>
          <path d={body} fill={url('inner')} />
          {neck}
          {star(120, 226, top.accent, 1.5)}
          <rect x="78" y="246" width="84" height="8" rx="3" fill={top.accent} />
          <circle cx="90" cy="202" r="6" fill={top.accent} stroke={shade(top.accent, -0.2)} strokeWidth="2" />
          <circle cx="150" cy="202" r="6" fill={top.accent} stroke={shade(top.accent, -0.2)} strokeWidth="2" />
          {shading}
        </g>
      )
    case 'forma':
      return (
        <g>
          <path d={body} fill={url('top')} />
          {neck}
          <path d="M104 196 Q 120 214 136 196" stroke={top.accent} strokeWidth="3.5" fill="none" />
          <path d="M84 210 L 80 252 M156 210 L 160 252" stroke={top.accent} strokeWidth="5" />
          <text x="120" y="244" textAnchor="middle" fontSize="26" fontWeight="900" fill={top.accent} fontFamily="Fredoka, sans-serif">7</text>
          {bib}
          {shading}
        </g>
      )
    case 'polo':
      return (
        <g>
          <path d={body} fill={url('top')} />
          {neck}
          <path d="M104 194 L 120 204 L 112 214 Z M136 194 L 120 204 L 128 214 Z" fill={top.accent} stroke={shade(top.color, -0.15)} strokeWidth="1.5" />
          <circle cx="120" cy="212" r="2.4" fill={top.accent} />
          <circle cx="120" cy="222" r="2.4" fill={top.accent} />
          {star(144, 220, top.accent, 0.8)}
          {bib}
          {shading}
        </g>
      )
    default: // tişört
      return (
        <g>
          <path d={body} fill={url('top')} />
          {neck}
          <path d="M104 196 Q 120 214 136 196" stroke={top.accent} strokeWidth="3.5" fill="none" />
          {star(120, 230, top.accent, 1.5)}
          {bib}
          {shading}
        </g>
      )
  }
}

function Arm({ x, y, long, fill, cuff, skin, watch, mont }: { x: number; y: number; long: boolean; fill: string; cuff: string; skin: string; watch?: boolean; mont?: boolean }) {
  const wd = mont ? 13 : 11
  return (
    <g transform={`translate(${x} ${y})`}>
      {long ? (
        <g>
          <rect x={-wd} y={-6} width={wd * 2} height={46} rx={wd} fill={fill} />
          <rect x={-wd} y={32} width={wd * 2} height={8} rx={4} fill={cuff} />
        </g>
      ) : (
        <g>
          <rect x={-8} y={4} width={16} height={38} rx={8} fill={skin} />
          <rect x={-12} y={-6} width={24} height={22} rx={10} fill={fill} />
        </g>
      )}
      <circle cx={0} cy={47} r={10} fill={skin} />
      <ellipse cx={-7} cy={43} rx={4} ry={5} fill={skin} />
      {watch && (
        <g>
          <rect x={-10} y={long ? 28 : 30} width={20} height={6} rx={3} fill="#6b43c4" />
          <circle cx={0} cy={long ? 31 : 33} r={5} fill="#ffd23f" stroke="#6b43c4" strokeWidth="2" />
        </g>
      )}
    </g>
  )
}

function Legs({ H, bottom, shoe, skin, skinDark, fillB, fillS }: { H: number; bottom: BottomItem; shoe: ShoeItem; skin: string; skinDark: string; fillB: string; fillS: string }) {
  const lx = [106, 134]
  const k = bottom.kind
  const pantsTo = k === 'sort' ? H + 22 : k === 'etek' ? H : 296
  const socks = (k === 'sort' || k === 'etek') && shoe.kind === 'spor'
  return (
    <g>
      {/* çıplak bacak (şort/etek) */}
      {(k === 'sort' || k === 'etek') && lx.map((x) => <rect key={x} x={x - 8} y={H + 8} width={16} height={298 - H} rx={7} fill={skin} />)}
      {socks && lx.map((x) => (
        <g key={x}>
          <rect x={x - 9} y={282} width={18} height={16} rx={4} fill="#fff" />
          <path d={`M${x - 9} 286 L ${x + 9} 286`} stroke={bottom.accent} strokeWidth="2.5" />
        </g>
      ))}
      {/* pantolon / şort paçaları */}
      {k !== 'etek' && (
        <g>
          {lx.map((x) => (
            <rect key={x} x={x - (k === 'sort' ? 14 : 12)} y={H - 4} width={k === 'sort' ? 28 : 24} height={pantsTo - H + 4} rx={8} fill={fillB} />
          ))}
          <path d={`M80 ${H - 6} L 160 ${H - 6} L 160 ${H + 8} Q 120 ${H + 12} 80 ${H + 8} Z`} fill={fillB} />
          <path d={`M120 ${H + 6} L 120 ${H + 16}`} stroke={shade(bottom.color, -0.2)} strokeWidth="2" />
          {(k === 'pantolon' || k === 'tulum' || k === 'uzay') && lx.map((x) => <rect key={x} x={x - 12.5} y={286} width={25} height={9} rx={4} fill={bottom.accent} />)}
          {k === 'sort' && lx.map((x) => <rect key={x} x={x - 14.5} y={H + 14} width={29} height={7} rx={3} fill={bottom.accent} />)}
          {k === 'esofman' && lx.map((x, i) => <path key={x} d={`M${x + (i ? 10 : -10)} ${H + 2} L ${x + (i ? 10 : -10)} 292`} stroke={bottom.accent} strokeWidth="3" />)}
          {k === 'uzay' && lx.map((x) => <rect key={x} x={x - 10} y={H + (296 - H) / 2 - 6} width={20} height={12} rx={5} fill={bottom.accent} />)}
        </g>
      )}
      {k === 'etek' && (
        <g>
          <path d={`M82 ${H - 6} L 158 ${H - 6} L 172 ${H + 26} Q 120 ${H + 34} 68 ${H + 26} Z`} fill={fillB} />
          <path d={`M100 ${H} L 94 ${H + 28} M120 ${H} L 120 ${H + 30} M140 ${H} L 146 ${H + 28}`} stroke={shade(bottom.color, -0.14)} strokeWidth="2" />
          <path d={`M69 ${H + 24} Q 120 ${H + 32} 171 ${H + 24}`} stroke={bottom.accent} strokeWidth="3" fill="none" />
          {bottom.id === 'etek-sihir' && [86, 112, 136, 156].map((x, i) => <circle key={x} cx={x} cy={H + 10 + (i % 2) * 8} r="2.6" fill={bottom.accent} />)}
        </g>
      )}
      {/* ayakkabılar */}
      {lx.map((x, i) => (
        <g key={x} transform={i === 0 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
          {shoe.kind === 'bot' && <rect x={x - 12} y={276} width={24} height={26} rx={6} fill={fillS} />}
          {shoe.kind === 'bot' && <rect x={x - 13} y={274} width={26} height={7} rx={3} fill={shade(shoe.color, -0.12)} />}
          <path d={`M${x - 12} 304 Q ${x - 13} 290 ${x} 290 Q ${x + 12} 290 ${x + 17} 301 L ${x + 18} 306 L ${x - 12} 306 Z`} fill={fillS} />
          <rect x={x - 14} y={303} width={33} height={8} rx={4} fill={shoe.kind === 'bot' ? shade(shoe.color, -0.3) : '#f4f1ea'} />
          <path d={`M${x - 14} 307 L ${x + 19} 307`} stroke={shoe.accent} strokeWidth="1.8" opacity="0.8" />
          <path d={`M${x - 4} 294 L ${x + 4} 296 M${x - 5} 298 L ${x + 5} 300`} stroke={shoe.kind === 'bot' ? shoe.accent : shoe.color === '#ffffff' ? shoe.accent : '#fff'} strokeWidth="2" strokeLinecap="round" />
          {shoe.kind === 'spor' && <path d={`M${x + 8} 296 Q ${x + 14} 298 ${x + 16} 302`} stroke={shoe.accent} strokeWidth="3" fill="none" strokeLinecap="round" />}
        </g>
      ))}
      <rect x={0} y={0} width={0} height={0} fill={skinDark} />
    </g>
  )
}

// ───────────────────────── yüz
function Face({ cfg, pose, calm, skinDark, hairDark, iris }: { cfg: AvatarConfig; pose: AvatarPose; calm: boolean; skinDark: string; hairDark: string; iris: string }) {
  const ex = pose === 'cheer' ? 'kahkaha' : cfg.expression
  const think = pose === 'think'
  const blushO = cfg.detail === 'allik' || ex === 'utangac' ? 0.7 : 0.38
  const happyEye = (cx: number) => <path key={cx} d={`M${cx - 14} 134 Q ${cx} 116 ${cx + 14} 134`} stroke="#2b170c" strokeWidth="6" strokeLinecap="round" fill="none" />
  const eye = (cx: number) => {
    const big = ex === 'saskin' ? 2.5 : 0
    const look = think ? { x: 3, y: -4 } : ex === 'utangac' ? { x: 0, y: 4 } : { x: 0, y: 0 }
    return (
      <g key={cx}>
        <ellipse cx={cx} cy={130} rx={15 + big * 0.6} ry={18 + big} fill="#2b170c" />
        <ellipse cx={cx} cy={130.5} rx={13 + big * 0.6} ry={16 + big} fill="#fff" />
        <ellipse cx={cx + look.x} cy={133 + look.y} rx={11} ry={13} fill={iris} />
        <ellipse cx={cx + look.x} cy={134 + look.y} rx={6} ry={7} fill="#1a0f08" />
        <ellipse cx={cx - 4 + look.x} cy={126 + look.y} rx={5} ry={6} fill="#fff" />
        <circle cx={cx + 5 + look.x} cy={139 + look.y} r={2.4} fill="#fff" opacity="0.85" />
        {ex === 'havali' && <path d={`M${cx - 16} 116 L ${cx + 16} 116 L ${cx + 16} 128 Q ${cx} 122 ${cx - 16} 128 Z`} fill={skinDark} />}
      </g>
    )
  }
  let eyes: ReactNode
  if (ex === 'kahkaha') eyes = [94, 146].map(happyEye)
  else if (ex === 'kirpma') eyes = [eye(94), happyEye(146)]
  else eyes = [94, 146].map(eye)

  let mouth: ReactNode
  if (think) mouth = <path d="M110 170 Q 122 166 132 170" stroke="#5a1f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
  else if (ex === 'kahkaha')
    mouth = (
      <g>
        <path d="M98 160 Q 120 196 142 160 Q 120 166 98 160 Z" fill="#5a1f12" />
        <path d="M108 176 Q 120 188 132 176 Q 120 171 108 176 Z" fill="#ff7d7d" />
        <path d="M102 161 Q 120 166 138 161 L 136 166 Q 120 170 104 166 Z" fill="#fff" />
      </g>
    )
  else if (ex === 'mutlu' || ex === 'utangac') mouth = <path d={ex === 'utangac' ? 'M110 166 Q 120 173 130 166' : 'M104 162 Q 120 178 136 162'} stroke="#5a1f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
  else if (ex === 'saskin') mouth = <ellipse cx="120" cy="170" rx="8" ry="10" fill="#5a1f12" />
  else if (ex === 'havali') mouth = <path d="M106 168 Q 124 172 136 160" stroke="#5a1f12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
  else
    mouth = (
      <g>
        <path d="M102 162 Q 120 188 138 162 Q 120 168 102 162 Z" fill="#5a1f12" />
        <path d="M110 174 Q 120 182 130 174 Q 120 170 110 174 Z" fill="#ff7d7d" />
        <path d="M106 163 Q 120 167 134 163 L 132 167 Q 120 170 108 167 Z" fill="#fff" />
      </g>
    )

  const browY = ex === 'saskin' ? -6 : 0
  return (
    <g>
      <ellipse cx="76" cy="156" rx={ex === 'utangac' ? 16 : 13} ry="8" fill="#ff7f8a" opacity={blushO} />
      <ellipse cx="164" cy="156" rx={ex === 'utangac' ? 16 : 13} ry="8" fill="#ff7f8a" opacity={blushO} />
      <motion.g
        animate={calm || ex === 'kahkaha' ? {} : { scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 0.25, times: [0, 0.3, 0.6, 1], repeat: Infinity, repeatDelay: 4 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {eyes}
      </motion.g>
      <path d={`M80 ${106 + browY} Q 94 ${98 + browY} 108 ${104 + browY} M132 ${104 + browY} Q 146 ${98 + browY} 160 ${106 + browY}`} stroke={hairDark} strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="120" cy="151" rx="5" ry="3.5" fill={skinDark} opacity="0.7" />
      <ellipse cx="118.5" cy="149.5" rx="2" ry="1.2" fill="#fff" opacity="0.5" />
      {mouth}
      {cfg.detail === 'cil' && (
        <g fill="#b5643a" opacity="0.55">
          {[[70, 148], [78, 144], [84, 151], [74, 156], [156, 148], [164, 144], [170, 151], [160, 156], [112, 142], [128, 142]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />)}
        </g>
      )}
      {cfg.detail === 'kalp' && <path d="M166 160 c -3 -5 -10 -3 -9 2 c 1 4 9 9 9 9 c 0 0 8 -5 9 -9 c 1 -5 -6 -7 -9 -2 Z" fill="#ff4f86" />}
      {cfg.detail === 'yildiz' && <path transform="translate(74 158) scale(0.9)" d="M0 -8 l2.4 5 5.5 .7 -4 3.8 1 5.4 -4.9 -2.6 -4.9 2.6 1 -5.4 -4 -3.8 5.5 -.7 Z" fill="#ffd23f" stroke="#e8a40c" strokeWidth="1" />}
      {cfg.detail === 'yarabandi' && (
        <g transform="rotate(-18 150 162)">
          <rect x="136" y="156" width="28" height="11" rx="5" fill="#f2c79a" stroke="#d9a576" strokeWidth="1.2" />
          <rect x="145" y="157" width="10" height="9" rx="2" fill="#e6b184" />
        </g>
      )}
    </g>
  )
}

// ───────────────────────── saç
function BackHair({ style, fill, dark }: { style: AvatarConfig['hair']; fill: string; dark: string }) {
  switch (style) {
    case 'dalgali':
      return <path d="M46 104 C 28 160, 36 212, 62 240 C 58 222, 70 214, 66 198 C 74 186, 78 176, 84 170 L 156 170 C 162 176, 166 186, 174 198 C 170 214, 182 222, 178 240 C 204 212, 212 160, 194 104 Z" fill={fill} />
    case 'atkuyrugu':
      return <path d="M174 86 C 216 92, 230 150, 206 202 C 198 176, 186 146, 168 124 Z" fill={fill} />
    case 'orgulu':
      return (
        <g fill={fill}>
          {[50, 190].map((x) => (
            <g key={x}>
              {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={x} cy={152 + i * 20} rx={13 - i} ry={12} />)}
              <circle cx={x} cy={230} r="7" fill="#ff7aa8" />
            </g>
          ))}
        </g>
      )
    case 'topuz':
      return (
        <g>
          {[66, 174].map((x) => (
            <g key={x}>
              <circle cx={x} cy={56} r={25} fill={fill} />
              <path d={`M${x - 12} 50 Q ${x} 38 ${x + 12} 52`} stroke={dark} strokeWidth="2.5" fill="none" />
              <path d={`M${x - 8} 62 Q ${x + 2} 54 ${x + 12} 64`} stroke={dark} strokeWidth="2.5" fill="none" />
            </g>
          ))}
        </g>
      )
    case 'kakul':
      return <path d="M42 100 C 34 150, 38 180, 56 186 L 184 186 C 202 180, 206 150, 198 100 Z" fill={fill} />
    case 'uzunKivircik':
      return (
        <g fill={fill}>
          {[[44, 120], [38, 150], [42, 180], [52, 208], [196, 120], [202, 150], [198, 180], [188, 208], [60, 228], [180, 228]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={22} />)}
        </g>
      )
    case 'kasif':
      return <path d="M50 120 C 40 160, 54 186, 70 196 L 80 140 Z M190 120 C 200 160, 186 186, 170 196 L 160 140 Z" fill={fill} />
    default:
      return null
  }
}

function FrontHair({ style, fill, dark }: { style: AvatarConfig['hair']; fill: string; dark: string }) {
  const shine = <path d="M86 54 C 100 46, 116 46, 130 50" stroke="#fff" strokeOpacity="0.22" strokeWidth="6" fill="none" strokeLinecap="round" />
  switch (style) {
    case 'kisa':
      return (
        <g fill={fill}>
          <path d="M46 116 C 42 66, 80 36, 122 38 C 166 38, 198 66, 194 116 C 182 96, 170 84, 150 80 C 130 92, 96 96, 70 88 C 60 96, 52 104, 46 116 Z" />
          {shine}
        </g>
      )
    case 'kivircik':
    case 'uzunKivircik':
      return (
        <g fill={fill}>
          {[[56, 100, 22], [74, 72, 24], [100, 54, 24], [130, 50, 25], [160, 60, 24], [182, 84, 22], [190, 110, 17], [50, 124, 15], [90, 82, 18], [120, 76, 18], [150, 82, 18]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
          <circle cx="104" cy="56" r="7" fill="#fff" opacity="0.2" />
          <circle cx="138" cy="52" r="5" fill="#fff" opacity="0.16" />
        </g>
      )
    case 'atkuyrugu':
      return (
        <g fill={fill}>
          <path d="M46 120 C 40 64, 82 38, 122 40 C 166 40, 200 66, 194 120 C 186 98, 176 86, 164 80 C 140 96, 100 100, 74 92 C 62 100, 52 110, 46 120 Z" />
          <circle cx="176" cy="84" r="9" fill="#ff7aa8" />
          {shine}
        </g>
      )
    case 'orgulu':
    case 'topuz':
    case 'dalgali':
      return (
        <g fill={fill}>
          <path d="M44 132 C 38 70, 80 40, 120 40 C 160 40, 202 70, 196 132 C 188 104, 170 84, 122 80 C 70 84, 52 104, 44 132 Z" />
          {style === 'dalgali' && <path d="M44 132 C 40 112, 50 96, 64 90 C 58 104, 56 118, 60 134 Z M196 132 C 200 112, 190 96, 176 90 C 182 104, 184 118, 180 134 Z" />}
          <path d="M120 42 L 120 80" stroke={dark} strokeWidth="3" />
          {shine}
        </g>
      )
    case 'kakul':
      return (
        <g fill={fill}>
          <path d="M44 128 C 38 66, 80 36, 120 36 C 160 36, 202 66, 196 128 C 192 112, 188 102, 182 98 Q 172 104 162 98 Q 152 104 142 98 Q 132 104 122 98 Q 112 104 102 98 Q 92 104 82 98 Q 72 104 60 98 C 54 104, 48 114, 44 128 Z" />
          {shine}
        </g>
      )
    case 'dagnik':
      return (
        <g fill={fill}>
          <path d="M44 122 C 38 80, 56 52, 78 44 L 72 26 L 96 36 L 102 16 L 118 32 L 134 14 L 142 34 L 164 24 L 160 46 C 186 56, 202 84, 196 122 C 186 102, 174 92, 160 88 L 152 100 L 140 88 L 126 102 L 114 88 L 98 100 L 92 88 C 72 94, 54 106, 44 122 Z" />
          {shine}
        </g>
      )
    case 'yanayatik':
      return (
        <g fill={fill}>
          <path d="M44 124 C 36 70, 76 36, 124 38 C 170 38, 204 70, 196 124 C 192 102, 184 90, 172 84 C 140 80, 100 88, 72 106 C 62 112, 50 118, 44 124 Z" />
          <path d="M84 46 Q 90 60 86 78" stroke={dark} strokeWidth="3" fill="none" />
          <path d="M100 60 C 124 52, 152 54, 176 66" stroke="#fff" strokeOpacity="0.2" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )
    default: // kaşif (referanstaki dağınık dalgalı)
      return (
        <g fill={fill}>
          <path d="M44 128 C 32 70, 74 30, 124 34 C 176 36, 206 74, 196 128 C 190 108, 182 96, 172 90 C 176 104, 168 112, 160 112 C 156 98, 146 88, 134 84 C 132 98, 120 104, 108 100 C 110 90, 104 84, 96 84 C 88 98, 72 104, 62 100 C 56 110, 50 118, 44 128 Z" />
          <path d="M120 36 C 126 22, 142 18, 150 26 C 140 28, 132 32, 128 40 Z" />
          {shine}
        </g>
      )
  }
}

function HeadAcc({ acc }: { acc: AvatarConfig['acc'] }) {
  return (
    <g>
      {acc.kulak === 'kulaklik' && (
        <g>
          <path d="M48 116 C 40 34, 200 34, 192 116" stroke="#6b43c4" strokeWidth="9" fill="none" strokeLinecap="round" />
          {[44, 196].map((x) => (
            <g key={x}>
              <rect x={x - 13} y={108} width={26} height={38} rx={12} fill="#8e6cf0" />
              <rect x={x - 8} y={114} width={16} height={26} rx={8} fill="#c9b8ff" />
            </g>
          ))}
        </g>
      )}
      {acc.goz === 'gozluk' && (
        <g fill="none" stroke="#3a2a6e" strokeWidth="4.5">
          <circle cx="94" cy="131" r="22" fill="rgba(255,255,255,0.12)" />
          <circle cx="146" cy="131" r="22" fill="rgba(255,255,255,0.12)" />
          <path d="M116 129 Q 120 125 124 129 M72 128 L 52 122 M168 128 L 188 122" />
        </g>
      )}
      {acc.goz === 'gunesGozlugu' && (
        <g>
          <path d="M70 118 L 116 118 L 112 144 Q 92 152 74 142 Z M124 118 L 170 118 L 166 142 Q 148 152 128 144 Z" fill="#2a2440" stroke="#ff5d9e" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M116 122 L 124 122" stroke="#ff5d9e" strokeWidth="3.5" />
          <path d="M80 124 L 92 124 M134 124 L 146 124" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        </g>
      )}
      {acc.bas === 'kasifGozlugu' && (
        <g>
          <path d="M44 84 C 90 64, 150 64, 196 84 L 194 96 C 150 78, 90 78, 46 96 Z" fill="#6b3a1a" />
          {[92, 148].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="74" r="19" fill="#e2a945" stroke="#9c6416" strokeWidth="3" />
              <circle cx={cx} cy="74" r="13" fill="#4fd3dd" />
              <ellipse cx={cx - 5} cy="69" rx="5" ry="3.5" fill="#fff" opacity="0.85" />
            </g>
          ))}
        </g>
      )}
      {acc.bas === 'sapka' && (
        <g>
          <path d="M40 96 C 30 92, 30 84, 50 82 L 190 82 C 210 84, 210 92, 200 96 Z" fill="#a8743e" />
          <path d="M60 84 C 58 46, 86 30, 120 30 C 154 30, 182 46, 180 84 Z" fill="#c48c4e" />
          <path d="M60 76 L 180 76 L 180 84 L 60 84 Z" fill="#6b3a1a" />
          <path d="M92 44 C 106 38, 124 38, 136 42" stroke="#fff" strokeOpacity="0.3" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )}
      {acc.bas === 'kep' && (
        <g>
          <path d="M46 96 C 44 50, 84 28, 122 28 C 162 28, 196 50, 194 96 Z" fill="#2f4f8f" />
          <path d="M118 92 C 160 86, 202 90, 216 104 C 190 112, 150 106, 116 102 Z" fill="#22396a" />
          <circle cx="120" cy="30" r="5" fill="#22396a" />
          <path transform="translate(120 66) scale(1.6)" d="M0 -8 l2.4 5 5.5 .7 -4 3.8 1 5.4 -4.9 -2.6 -4.9 2.6 1 -5.4 -4 -3.8 5.5 -.7 Z" fill="#ffd23f" />
        </g>
      )}
      {acc.bas === 'bere' && (
        <g>
          <path d="M44 100 C 42 50, 82 26, 120 26 C 158 26, 198 50, 196 100 Z" fill="#ff7aa8" />
          <path d="M42 86 Q 120 70 198 86 L 198 104 Q 120 88 42 104 Z" fill="#f45a92" />
          <path d="M70 80 L 70 96 M95 76 L 95 92 M120 74 L 120 90 M145 76 L 145 92 M170 80 L 170 96" stroke="#ff9cc2" strokeWidth="3" />
          <circle cx="120" cy="24" r="15" fill="#fff" />
          <circle cx="114" cy="19" r="5" fill="#fff" opacity="0.9" />
        </g>
      )}
      {acc.bas === 'toka' && (
        <g transform="translate(162 70)">
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-10" rx="8" ry="11" fill="#ff7aa8" transform={`rotate(${a})`} />)}
          <circle r="7" fill="#ffd23f" />
        </g>
      )}
      {acc.bas === 'tac' && (
        <g>
          <path d="M70 62 L 82 30 L 100 52 L 120 22 L 140 52 L 158 30 L 170 62 Z" fill="#ffd23f" stroke="#e8a40c" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="120" cy="46" r="6" fill="#ff7aa8" />
          <circle cx="92" cy="54" r="4" fill="#2ec4c9" />
          <circle cx="148" cy="54" r="4" fill="#2ec4c9" />
        </g>
      )}
    </g>
  )
}
