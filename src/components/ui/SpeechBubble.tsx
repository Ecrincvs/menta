import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { speak } from '../../audio/speech'
import { sfx } from '../../audio/sfx'

/**
 * Krem konuşma balonu + 🔊 sesli okuma butonu.
 * `autoSpeak` ile metin ekrana gelince otomatik seslendirilir (okuma bilmeyen çocuklar için).
 */
export function SpeechBubble({
  text,
  spoken,
  autoSpeak = true,
  tail = 'left',
  className = '',
  size = 'md',
}: {
  text: string
  /** Seslendirilecek metin (görünen metinden farklı olabilir) */
  spoken?: string
  autoSpeak?: boolean
  tail?: 'left' | 'right' | 'bottom' | 'none'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const say = spoken ?? text
  useEffect(() => {
    if (!autoSpeak) return
    const t = setTimeout(() => speak(say), 250)
    return () => clearTimeout(t)
  }, [say, autoSpeak])

  const fs = size === 'lg' ? 'text-[clamp(22px,2.6vw,32px)]' : size === 'sm' ? 'text-[clamp(16px,1.8vw,20px)]' : 'text-[clamp(19px,2.2vw,26px)]'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ scale: 0.6, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className={`mk-card relative flex items-center gap-3 px-4 py-3 ${className}`}
        role="status"
        aria-live="polite"
      >
        <button
          aria-label="Sesli dinle"
          onClick={() => {
            sfx('tap')
            speak(say, { force: true })
          }}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--mk-sky-light)] shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] transition active:scale-90"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
            <path d="M5 12 H11 L18 6 V26 L11 20 H5 Z" fill="#2a7fd4" />
            <path d="M22 11 Q26 16 22 21" stroke="#2a7fd4" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M25 7 Q32 16 25 25" stroke="#2a7fd4" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <p className={`mk-display leading-tight text-ink ${fs}`}>{text}</p>
        {tail !== 'none' && (
          <span
            aria-hidden
            className="absolute h-6 w-6 rotate-45 border-[var(--mk-cream-edge)] bg-[var(--mk-cream)]"
            style={
              tail === 'left'
                ? { left: -13, top: '50%', marginTop: -12, borderLeftWidth: 3, borderBottomWidth: 3 }
                : tail === 'right'
                  ? { right: -13, top: '50%', marginTop: -12, borderRightWidth: 3, borderTopWidth: 3 }
                  : { bottom: -13, left: '50%', marginLeft: -12, borderRightWidth: 3, borderBottomWidth: 3 }
            }
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
