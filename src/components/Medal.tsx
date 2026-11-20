/**
 * Rozet madalyası: kurdele + kademeli çerçeve (bronz/gümüş/altın) + ortada 3D ikon.
 * Kazanılmamış rozet: soluk, gri, kilitli.
 */
import { useId } from 'react'
import { Obj } from './ui/Obj'
import type { Tier } from '../rewards/badges'

export const TIER: Record<Tier, { rim: [string, string, string]; ribbon: [string, string]; label: string }> = {
  bronz: { rim: ['#ffd3a8', '#d2884a', '#8f4f1f'], ribbon: ['#ff7a59', '#d4463a'], label: 'Bronz' },
  gumus: { rim: ['#ffffff', '#b9c6d6', '#6f7f94'], ribbon: ['#4fa8ff', '#2f6fd1'], label: 'Gümüş' },
  altin: { rim: ['#fff6b8', '#ffc533', '#c48300'], ribbon: ['#9b6ef3', '#6b43c4'], label: 'Altın' },
}

export function Medal({ icon, tier, earned, size = 96 }: { icon: string; tier: Tier; earned: boolean; size?: number }) {
  const uid = useId().replace(/:/g, '')
  const t = TIER[tier]
  const grey = !earned
  return (
    <span className="relative inline-block" style={{ width: size, height: size * 1.18 }} aria-hidden>
      <svg viewBox="0 0 100 118" width={size} height={size * 1.18} className="absolute inset-0" style={{ filter: grey ? 'grayscale(1) opacity(0.55)' : 'drop-shadow(0 6px 8px rgba(60,30,0,0.28))' }}>
        <defs>
          <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.rim[0]} />
            <stop offset="0.45" stopColor={t.rim[1]} />
            <stop offset="1" stopColor={t.rim[2]} />
          </linearGradient>
          <radialGradient id={`face-${uid}`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#fffdf6" />
            <stop offset="1" stopColor="#f3e3c2" />
          </radialGradient>
        </defs>
        {/* kurdeleler */}
        <path d="M30 70 L 18 114 L 32 106 L 40 118 L 50 76 Z" fill={t.ribbon[1]} />
        <path d="M70 70 L 82 114 L 68 106 L 60 118 L 50 76 Z" fill={t.ribbon[0]} />
        {/* dişli çerçeve */}
        <g transform="translate(50 48)">
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={Math.cos((i / 16) * Math.PI * 2) * 40} cy={Math.sin((i / 16) * Math.PI * 2) * 40} r="7" fill={`url(#rim-${uid})`} />
          ))}
          <circle r="41" fill={`url(#rim-${uid})`} />
          <circle r="33" fill={`url(#face-${uid})`} stroke={t.rim[2]} strokeOpacity="0.5" strokeWidth="2" />
          <path d="M-26 -14 A 30 30 0 0 1 10 -30" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <span className="absolute grid place-items-center" style={{ left: '50%', top: size * 0.41, transform: 'translate(-50%,-50%)', filter: grey ? 'grayscale(1) opacity(0.45)' : undefined }}>
        <Obj name={icon} size={size * 0.44} shadow={false} />
      </span>
      {grey && (
        <span className="absolute grid place-items-center rounded-full bg-white shadow" style={{ right: size * 0.06, top: size * 0.62, width: size * 0.3, height: size * 0.3 }}>
          <Obj name="lock" size={size * 0.2} shadow={false} />
        </span>
      )}
    </span>
  )
}
