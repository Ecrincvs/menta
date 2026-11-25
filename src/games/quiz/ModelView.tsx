/**
 * MODEL KUR — çizimdeki boş etiket yuvalarına doğru adları yerleştir (fen modelleri).
 * Dokun-seç: önce alttan bir etikete, sonra çizimdeki kutucuğa dokun (ya da tersi).
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import type { ModelQ } from './types'
import { MODELLER } from './modeller'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { sfx } from '../../audio/sfx'
import { makeRng, shuffle } from '../../learning/rng'

type Answer = (correct: boolean, opts?: { explain?: string; hint?: string; delay?: number }) => void

export function ModelView({ q, answer }: { q: ModelQ; answer: Answer }) {
  const model = MODELLER[q.sahne]
  const etiketler = useMemo(() => shuffle(makeRng(q.etiketler.join().length * 31), q.etiketler), [q])
  const [yerlesen, setYerlesen] = useState<Record<string, string>>({})
  const [secili, setSecili] = useState<string | null>(null)
  const [seciliYuva, setSeciliYuva] = useState<string | null>(null)
  const [salla, setSalla] = useState<string | null>(null)
  const bitti = useRef(false)
  if (!model) return null
  const kullanilan = new Set(Object.values(yerlesen))

  const dene = (yuva: string, etiket: string) => {
    if (bitti.current || yerlesen[yuva]) return
    const dogru = q.yuvalar.find((y) => y.id === yuva)?.dogru
    if (etiket === dogru) {
      sfx('pick')
      const yeni = { ...yerlesen, [yuva]: etiket }
      setYerlesen(yeni)
      setSecili(null)
      setSeciliYuva(null)
      if (q.yuvalar.every((y) => yeni[y.id])) {
        bitti.current = true
        sfx('correct')
        setTimeout(() => answer(true, { delay: 1800 }), 450)
      }
    } else {
      sfx('wrong')
      setSalla(yuva)
      setTimeout(() => setSalla(null), 450)
      setSecili(null)
      setSeciliYuva(null)
    }
  }
  const etiketSec = (e: string) => {
    if (kullanilan.has(e) || bitti.current) return
    sfx('tap')
    if (seciliYuva) dene(seciliYuva, e)
    else setSecili(e === secili ? null : e)
  }
  const yuvaSec = (id: string) => {
    if (yerlesen[id] || bitti.current) return
    if (secili) dene(id, secili)
    else setSeciliYuva(id === seciliYuva ? null : id)
  }

  return (
    <div className="flex h-full flex-col items-center gap-2 px-3">
      <div className="w-[min(760px,94vw)]">
        <SpeechBubble soru text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      <div className="relative w-[min(560px,92vw,calc((100dvh-330px)*4/3))] min-w-[280px] rounded-[26px] bg-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.15)]" style={{ aspectRatio: '4 / 3' }}>
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-label={model.ad} role="img">
          {model.ciz()}
          {q.yuvalar.map((y) => {
            const p = model.yuvalar[y.id]
            if (!p) return null
            return (
              <g key={y.id}>
                <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly} stroke="#3a2a5e" strokeWidth="2" strokeDasharray={yerlesen[y.id] ? undefined : '5 4'} />
                <circle cx={p.x} cy={p.y} r="5" fill="#3a2a5e" />
              </g>
            )
          })}
        </svg>
        {q.yuvalar.map((y) => {
          const p = model.yuvalar[y.id]
          if (!p) return null
          const dolu = yerlesen[y.id]
          const aktif = seciliYuva === y.id || (!!secili && !dolu)
          return (
            <motion.button
              key={y.id}
              onClick={() => yuvaSec(y.id)}
              animate={salla === y.id ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              aria-label={dolu ? `${dolu} yerleşti` : 'Boş etiket yeri'}
              className="mk-display absolute grid min-h-[34px] min-w-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border-[3px] px-2 text-[clamp(13px,1.6vw,17px)]"
              style={{
                left: `${(p.lx / 400) * 100}%`,
                top: `${(p.ly / 300) * 100}%`,
                background: dolu ? '#5fe07a' : aktif ? '#fff6c8' : 'rgba(255,255,255,0.95)',
                borderColor: dolu ? '#22a845' : seciliYuva === y.id ? '#ff9a2e' : '#c9b48c',
                borderStyle: dolu ? 'solid' : 'dashed',
                color: dolu ? '#fff' : '#9a8a6a',
              }}
            >
              {dolu ?? '?'}
            </motion.button>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Etiketler">
        <AnimatePresence>
          {etiketler.map((e) =>
            kullanilan.has(e) ? null : (
              <motion.button
                key={e}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: secili === e ? 1.08 : 1 }}
                exit={{ scale: 0 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => etiketSec(e)}
                className="mk-display rounded-2xl px-4 py-2 text-[clamp(15px,1.8vw,20px)] text-[#3a2a5e] shadow-[0_4px_0_rgba(0,0,0,0.15)]"
                style={{ background: secili === e ? '#ffd23f' : '#fff', outline: secili === e ? '3px solid #ff9a2e' : undefined }}
              >
                {e}
              </motion.button>
            ),
          )}
        </AnimatePresence>
      </div>
      <p className="text-[13px] font-bold text-[var(--mk-ink-soft)]">Önce bir etikete, sonra çizimdeki kutucuğa dokun.</p>
    </div>
  )
}
