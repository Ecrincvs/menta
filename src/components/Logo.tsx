import { motion } from 'framer-motion'

/** "Minik Kaşifler" oyun logosu: kalın konturlu harfler, yıldızlar, slogan kurdelesi */
export function Logo({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const big = size === 'lg'
  const word = (text: string, colors: string[], delay: number) => (
    <span className="flex">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="mk-title inline-block"
          style={{ color: colors[i % colors.length] }}
          initial={{ y: -40, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: (i % 2 ? 1 : -1) * 3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: delay + i * 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
  return (
    <div className="relative flex flex-col items-center" aria-label="Minik Kaşifler" role="img">
      <div className={`flex flex-col items-center ${big ? 'text-[clamp(52px,7.5vw,104px)]' : 'text-[clamp(30px,3.4vw,44px)]'} leading-[0.85]`}>
        {word('Minik', ['#ffd23f', '#ff9a2e', '#ffd23f', '#ff9a2e', '#ffd23f'], 0.1)}
        {word('Kaşifler', ['#5ee0e4', '#ffffff', '#ffd23f', '#ff9a2e', '#5bc236', '#ff7aa8', '#9b6ef3', '#5ab8f5'], 0.35)}
      </div>
      {big && (
        <>
          <Star className="absolute -left-10 top-0" size={46} delay={0.9} />
          <Star className="absolute -right-8 top-6" size={36} delay={1.1} />
          <Star className="absolute -right-14 bottom-16" size={26} delay={1.3} />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 16 }}
            className="mk-wood mt-3 rounded-full px-5 py-1"
          >
            <span className="mk-display whitespace-nowrap text-[clamp(16px,2vw,24px)] text-white" style={{ textShadow: '0 2px 0 #5c3415' }}>
              Öğren • Keşfet • Oyna • Başar
            </span>
          </motion.div>
        </>
      )}
    </div>
  )
}

function Star({ className, size, delay }: { className: string; size: number; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: [0, 1.2, 1], rotate: 0 }}
      transition={{ delay, duration: 0.6 }}
      aria-hidden
    >
      <motion.path
        d="M12 1.5 L14.9 8.6 L22.5 9.2 L16.7 14.1 L18.5 21.6 L12 17.6 L5.5 21.6 L7.3 14.1 L1.5 9.2 L9.1 8.6 Z"
        fill="#ffd23f"
        stroke="#e8a40c"
        strokeWidth="1.5"
        strokeLinejoin="round"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      />
    </motion.svg>
  )
}
