import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useGame, type Quality } from '../state/store'
import { CandyButton } from './ui/Controls'
import { sfx } from '../audio/sfx'
import { hasTurkishVoice } from '../audio/speech'

export function Modal({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(30,20,60,0.45)] p-4 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="mk-card relative w-full max-w-[520px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => {
        sfx('tap')
        onChange(!on)
      }}
      className="flex min-h-[60px] w-full items-center justify-between rounded-2xl bg-white/70 px-4 text-left"
    >
      <span className="mk-display text-[22px]">{label}</span>
      <span className={`relative h-9 w-16 rounded-full transition ${on ? 'bg-[var(--mk-green)]' : 'bg-[#d9c7a6]'}`}>
        <motion.span layout className="absolute top-1 h-7 w-7 rounded-full bg-white shadow" style={{ left: on ? 32 : 4 }} />
      </span>
    </button>
  )
}

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { settings, setSetting, go } = useGame()
  const [gate, setGate] = useState(false)
  const voiceOk = useMemo(() => hasTurkishVoice(), [])
  return (
    <Modal onClose={onClose} label="Ayarlar">
      {gate ? (
        <ParentGate
          onPass={() => {
            onClose()
            go({ name: 'parent' })
          }}
          onCancel={() => setGate(false)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="mk-title mb-2 text-center text-[36px]">Ayarlar</h2>
          <Toggle label="Sesli anlatım" on={settings.voice} onChange={(v) => setSetting('voice', v)} />
          {!voiceOk && settings.voice && (
            <p className="px-2 text-[14px] font-bold text-[var(--mk-ink-soft)]">Bu cihazda Türkçe ses bulunamadı. Cihaz ayarlarından Türkçe konuşma sesi eklenebilir.</p>
          )}
          <Toggle label="Ses efektleri" on={settings.sfx} onChange={(v) => setSetting('sfx', v)} />
          <Toggle label="Sakin mod (az hareket)" on={settings.calm} onChange={(v) => setSetting('calm', v)} />
          <Toggle label="3D dünya (deneysel)" on={settings.world3d} onChange={(v) => setSetting('world3d', v)} />
          <div className="flex min-h-[60px] items-center justify-between rounded-2xl bg-white/70 px-4">
            <span className="mk-display text-[22px]">Görüntü kalitesi</span>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as Quality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    sfx('tap')
                    setSetting('quality', q)
                  }}
                  className={`mk-display rounded-xl px-3 py-2 text-[16px] ${settings.quality === q ? 'bg-[var(--mk-turquoise)] text-white' : 'bg-white'}`}
                >
                  {q === 'low' ? 'Hızlı' : q === 'medium' ? 'Dengeli' : 'Yüksek'}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <CandyButton color="purple" onClick={() => setGate(true)}>
              Ebeveyn Paneli
            </CandyButton>
            <CandyButton color="green" onClick={onClose}>
              Tamam
            </CandyButton>
          </div>
        </div>
      )}
    </Modal>
  )
}

/** Ebeveyn kapısı: okuma bilen bir yetişkinin çözebileceği yazılı çarpma sorusu */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [q] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4)
    const b = 6 + Math.floor(Math.random() * 4)
    return { a, b }
  })
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)
  const words = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="mk-title text-[30px]">Ebeveyn Kontrolü</h2>
      <p className="text-[18px] font-extrabold">
        Devam etmek için yazıyla verilen işlemi çözün:
        <br />
        <span className="mk-display text-[24px]">
          {words[q.a]} çarpı {words[q.b]} kaç eder?
        </span>
      </p>
      <input
        inputMode="numeric"
        aria-label="Cevap"
        value={val}
        onChange={(e) => {
          setErr(false)
          setVal(e.target.value.replace(/\D/g, '').slice(0, 3))
        }}
        className="mk-display h-16 w-40 rounded-2xl border-4 border-[var(--mk-cream-edge)] bg-white text-center text-[32px] outline-none focus:border-[var(--mk-sky)]"
      />
      {err && <p className="font-black text-[var(--mk-red-dark)]">Cevap hatalı, tekrar deneyin.</p>}
      <div className="flex gap-3">
        <CandyButton color="orange" onClick={onCancel}>
          Vazgeç
        </CandyButton>
        <CandyButton
          color="green"
          onClick={() => {
            if (Number(val) === q.a * q.b) onPass()
            else setErr(true)
          }}
        >
          Gir
        </CandyButton>
      </div>
    </div>
  )
}
