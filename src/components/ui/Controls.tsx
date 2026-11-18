import { motion, type HTMLMotionProps } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { sfx } from '../../audio/sfx'
import { useGame } from '../../state/store'
import { Obj } from './Obj'

type Color = 'green' | 'orange' | 'turquoise' | 'purple' | 'yellow' | 'red' | 'sky'

const COLORS: Record<Color, [string, string]> = {
  green: ['var(--mk-green)', 'var(--mk-green-dark)'],
  orange: ['var(--mk-orange)', 'var(--mk-orange-dark)'],
  turquoise: ['var(--mk-turquoise)', 'var(--mk-turquoise-dark)'],
  purple: ['var(--mk-purple)', 'var(--mk-purple-dark)'],
  yellow: ['var(--mk-yellow)', 'var(--mk-yellow-dark)'],
  red: ['var(--mk-red)', 'var(--mk-red-dark)'],
  sky: ['var(--mk-sky)', 'var(--mk-sky-dark)'],
}

export function CandyButton({
  color = 'green',
  children,
  className = '',
  style,
  onClick,
  ...rest
}: { color?: Color; children: ReactNode } & HTMLMotionProps<'button'>) {
  const [c, d] = COLORS[color]
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`mk-candy ${className}`}
      style={{ ['--c' as string]: c, ['--c-dark' as string]: d, ...(style as CSSProperties) }}
      onClick={(e) => {
        sfx('tap')
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** Sol üstteki turuncu yuvarlak geri butonu — her ekranda aynı yerde */
export function BackButton({ onClick, label = 'Geri' }: { onClick?: () => void; label?: string }) {
  const back = useGame((s) => s.back)
  return (
    <motion.button
      aria-label={label}
      whileHover={{ scale: 1.08, rotate: -4 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        sfx('tap')
        ;(onClick ?? back)()
      }}
      className="mk-candy !p-0 shrink-0"
      style={{
        ['--c' as string]: 'var(--mk-orange)',
        ['--c-dark' as string]: 'var(--mk-orange-dark)',
        width: 'clamp(60px, 7vw, 76px)',
        height: 'clamp(60px, 7vw, 76px)',
        minHeight: 0,
        borderRadius: '50%',
      }}
    >
      <svg viewBox="0 0 40 40" width="58%" height="58%" aria-hidden>
        <path d="M24 9 L 12 20 L 24 31" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 20 L 31 20" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </motion.button>
  )
}

/** Yuvarlak ikon butonu (ayarlar, ses vb.) */
export function RoundIconButton({
  label,
  onClick,
  children,
  color = 'sky',
  size = 64,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  color?: Color
  size?: number
}) {
  const [c, d] = COLORS[color]
  return (
    <motion.button
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        sfx('tap')
        onClick()
      }}
      className="mk-candy !p-0 shrink-0"
      style={{ ['--c' as string]: c, ['--c-dark' as string]: d, width: size, height: size, minHeight: 0, borderRadius: '50%' }}
    >
      {children}
    </motion.button>
  )
}

/** Ahşap tabela başlık + kurdele uçları */
export function WoodSign({ children, icon, color }: { children: ReactNode; icon?: string; color?: string }) {
  return (
    <motion.div
      initial={{ y: -80, rotate: -4, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
      className="relative flex items-center"
    >
      {/* asma ipleri */}
      <div className="absolute -top-6 left-[18%] h-8 w-1.5 rounded bg-[#7a4a22]" />
      <div className="absolute -top-6 right-[18%] h-8 w-1.5 rounded bg-[#7a4a22]" />
      {/* kurdele uçları */}
      {color && (
        <>
          <div className="absolute -left-7 top-4 h-12 w-14 rounded-l-lg" style={{ background: color, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%,22% 50%)', filter: 'brightness(0.85)' }} />
          <div className="absolute -right-7 top-4 h-12 w-14 rounded-r-lg" style={{ background: color, clipPath: 'polygon(0 0,100% 0,78% 50%,100% 100%,0 100%)', filter: 'brightness(0.85)' }} />
        </>
      )}
      <div className="mk-wood relative flex items-center gap-2 rounded-[22px] px-6 py-1.5 sm:px-8">
        {icon && <Obj name={icon} size={44} />}
        <h1 className="mk-title whitespace-nowrap text-[clamp(24px,3.4vw,42px)]">{children}</h1>
      </div>
    </motion.div>
  )
}

export function Hearts({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="mk-card flex items-center gap-1 rounded-full px-3 py-1.5" aria-label={`${count} can`}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          animate={i < count ? { scale: [1, 1.15, 1], opacity: 1, filter: 'grayscale(0)' } : { scale: 0.85, opacity: 0.4, filter: 'grayscale(1)' }}
          transition={{ duration: 0.4 }}
        >
          <Obj name="heart" size={34} shadow={false} />
        </motion.div>
      ))}
    </div>
  )
}

export function Pill({ icon, value, label }: { icon: string; value: ReactNode; label: string }) {
  return (
    <div className="mk-card flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-4" aria-label={label}>
      <Obj name={icon} size={36} shadow={false} />
      <span className="mk-display text-[clamp(18px,2vw,24px)] leading-none text-ink">{value}</span>
    </div>
  )
}
