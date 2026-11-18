import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#ffd23f', '#ff9a2e', '#2ec4c9', '#9b6ef3', '#5bc236', '#ff7aa8', '#5ab8f5']

/** Kutlama konfetisi — yalnızca transform/opacity, kısa ömürlü */
export function Confetti({ count = 60, duration = 2.6 }: { count?: number; duration?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rot: Math.random() * 720 - 360,
        drift: Math.random() * 30 - 15,
        color: COLORS[i % COLORS.length],
        w: 8 + Math.random() * 8,
        h: 12 + Math.random() * 10,
        round: Math.random() > 0.6,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.x}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', x: `${p.x + p.drift}vw`, rotate: p.rot, opacity: [1, 1, 0.8] }}
          transition={{ duration: duration + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? '50%' : 3,
          }}
        />
      ))}
    </div>
  )
}

/** Bir noktadan fışkıran yıldız parçacıkları (doğru cevap) */
export function StarBurst({ x = '50%', y = '50%', count = 12 }: { x?: string; y?: string; count?: number }) {
  const parts = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({ a: (i / count) * Math.PI * 2, d: 70 + Math.random() * 60, s: 0.6 + Math.random() * 0.6 })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }} aria-hidden>
      {parts.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={26 * p.s}
          height={26 * p.s}
          initial={{ x: -12, y: -12, scale: 0, opacity: 1 }}
          animate={{ x: Math.cos(p.a) * p.d - 12, y: Math.sin(p.a) * p.d - 12, scale: 1, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ position: 'absolute' }}
        >
          <path d="M12 1 L15 9 L23 9 L17 14 L19 22 L12 17 L5 22 L7 14 L1 9 L9 9 Z" fill={i % 2 ? '#ffd23f' : '#fff3a0'} stroke="#e8a40c" strokeWidth="1.2" />
        </motion.svg>
      ))}
    </div>
  )
}
