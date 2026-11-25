/**
 * HARFİ YAZALIM — parmakla iz sürme (kitaptaki “x Harfini Yazalım” sayfası, T.Y.1.3.b).
 * Değerlendirme: harfin ne kadarı çizgiyle kaplandı (≥ %60) ve ne kadarı dışarı taştı (≤ %40).
 */
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { TraceQ } from './types'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { StarBurst } from '../../components/fx/Confetti'
import { sfx } from '../../audio/sfx'
import type { Feedback } from '../useRoundEngine'

type Answer = (correct: boolean, opts?: { explain?: string; hint?: string; delay?: number }) => void
const SIZE = 340
const FONT = `800 ${Math.round(SIZE * 0.78)}px "Baloo 2", Nunito, sans-serif`

function drawGlyph(ctx: CanvasRenderingContext2D, ch: string, mode: 'fill' | 'guide' | 'zone') {
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.font = FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const y = SIZE * 0.78
  if (mode === 'guide') {
    ctx.fillStyle = '#efe3c8'
    ctx.fillText(ch, SIZE / 2, y)
    ctx.setLineDash([10, 9])
    ctx.lineWidth = 3
    ctx.strokeStyle = '#c9a76e'
    ctx.strokeText(ch, SIZE / 2, y)
    ctx.setLineDash([])
  } else {
    ctx.fillStyle = '#000'
    ctx.fillText(ch, SIZE / 2, y)
    if (mode === 'zone') {
      ctx.lineWidth = 34
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#000'
      ctx.strokeText(ch, SIZE / 2, y)
    }
  }
}

export function TraceView({ q, feedback, answer }: { q: TraceQ; feedback: Feedback; answer: Answer }) {
  const guide = useRef<HTMLCanvasElement>(null)
  const ink = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<[number, number] | null>(null)
  const [hasInk, setHasInk] = useState(false)
  const [shake, setShake] = useState(false)
  const solved = feedback === 'correct' || feedback === 'reveal'

  useEffect(() => {
    const draw = () => {
      const g = guide.current?.getContext('2d')
      if (g) drawGlyph(g, q.letter, 'guide')
    }
    draw()
    // yazı tipi geç yüklenirse yeniden çiz
    void document.fonts?.ready.then(draw)
  }, [q.letter])

  useEffect(() => {
    if (feedback === 'reveal' && ink.current) {
      const c = ink.current.getContext('2d')!
      c.globalAlpha = 0.9
      drawGlyph(c, q.letter, 'fill')
      c.globalCompositeOperation = 'source-in'
      c.fillStyle = '#2a7fd4'
      c.fillRect(0, 0, SIZE, SIZE)
      c.globalCompositeOperation = 'source-over'
    }
  }, [feedback, q.letter])

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = ink.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE]
  }
  const down = (e: React.PointerEvent) => {
    if (solved) return
    ;(e.target as Element).setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pos(e)
    const c = ink.current!.getContext('2d')!
    c.fillStyle = '#ff7a29'
    c.beginPath()
    c.arc(last.current[0], last.current[1], 11, 0, Math.PI * 2)
    c.fill()
    setHasInk(true)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || solved) return
    const p = pos(e)
    const c = ink.current!.getContext('2d')!
    c.strokeStyle = '#ff7a29'
    c.lineWidth = 22
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.beginPath()
    c.moveTo(last.current![0], last.current![1])
    c.lineTo(p[0], p[1])
    c.stroke()
    last.current = p
  }
  const up = () => {
    drawing.current = false
    last.current = null
  }
  const clear = () => {
    ink.current?.getContext('2d')?.clearRect(0, 0, SIZE, SIZE)
    setHasInk(false)
  }

  const check = () => {
    if (solved || !hasInk) return
    const glyph = document.createElement('canvas')
    glyph.width = glyph.height = SIZE
    const zone = document.createElement('canvas')
    zone.width = zone.height = SIZE
    drawGlyph(glyph.getContext('2d')!, q.letter, 'fill')
    drawGlyph(zone.getContext('2d')!, q.letter, 'zone')
    const G = glyph.getContext('2d')!.getImageData(0, 0, SIZE, SIZE).data
    const Z = zone.getContext('2d')!.getImageData(0, 0, SIZE, SIZE).data
    const I = ink.current!.getContext('2d')!.getImageData(0, 0, SIZE, SIZE).data
    let gTotal = 0
    let gCovered = 0
    let iTotal = 0
    let iOut = 0
    for (let k = 3; k < G.length; k += 4 * 3) {
      const g = G[k] > 40
      const z = Z[k] > 40
      const i = I[k] > 40
      if (g) {
        gTotal++
        if (i) gCovered++
      }
      if (i) {
        iTotal++
        if (!z) iOut++
      }
    }
    const cover = gTotal ? gCovered / gTotal : 0
    const spill = iTotal ? iOut / iTotal : 1
    if (cover >= 0.6 && spill <= 0.4) {
      sfx('star')
      answer(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      clear()
      answer(false, {
        explain: q.explain,
        hint: cover < 0.6 ? 'Harfin her yerinden geç; boş yer kalmasın. Bir daha deneyelim!' : 'Çizginin dışına taştın. Harfin üstünden dikkatlice geçelim!',
      })
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-3 px-3">
      <div className="w-[min(720px,92vw)]">
        <SpeechBubble soru text={q.prompt} spoken={q.spoken} tail="none" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 md:flex-row md:gap-8">
        <motion.div
          animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }}
          className="relative rounded-[28px] border-[5px] border-[#e9cf9c] bg-[#fffdf6] shadow-[0_8px_0_#d9b77a,0_16px_30px_rgba(0,0,0,0.2)]"
          style={{ width: `min(${SIZE}px, 70vw, 48vh)`, aspectRatio: '1' }}
        >
          {/* yazı satırı çizgileri */}
          <div className="pointer-events-none absolute inset-x-4 top-[22%] border-t-2 border-dashed border-[#e9d6b0]" />
          <div className="pointer-events-none absolute inset-x-4 top-[78%] border-t-[3px] border-[#e9b866]" />
          <canvas ref={guide} width={SIZE} height={SIZE} className="absolute inset-0 h-full w-full" />
          <canvas
            ref={ink}
            width={SIZE}
            height={SIZE}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
            aria-label={`${q.letter} harfini parmağınla yaz`}
            role="img"
          />
          {feedback === 'correct' && <StarBurst x="50%" y="50%" />}
        </motion.div>
        <div className="flex gap-3 md:flex-col">
          <motion.button whileTap={{ scale: 0.9 }} onClick={clear} aria-label="Sil" className="mk-candy !min-h-[64px] !px-6" style={{ ['--c' as string]: 'var(--mk-orange)', ['--c-dark' as string]: 'var(--mk-orange-dark)' }}>
            ⌫ Sil
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={check} aria-label="Bitti, kontrol et" className="mk-candy !min-h-[64px] !px-8" style={{ ['--c' as string]: 'var(--mk-green)', ['--c-dark' as string]: 'var(--mk-green-dark)' }}>
            ✓ Bitti
          </motion.button>
        </div>
      </div>
    </div>
  )
}
