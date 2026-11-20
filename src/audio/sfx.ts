/**
 * Ses efektleri — Web Audio API ile çalışma anında sentezlenir.
 * Lisans sorunu yok, indirme yok. İleride gerçek ses dosyaları public/assets/sounds/
 * altına eklenirse `play()` önce dosyayı deneyecek şekilde genişletilebilir.
 */
import { useGame } from '../state/store'

let ctx: AudioContext | null = null
function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

type Wave = OscillatorType

function tone(freq: number, start: number, dur: number, type: Wave = 'sine', gain = 0.18, slideTo?: number) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + start
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

function noise(start: number, dur: number, gain = 0.08, hp = 1200) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + start
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = hp
  const g = c.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(c.destination)
  src.start(t0)
}

const SOUNDS = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.12, 880),
  pop: () => tone(420, 0, 0.12, 'sine', 0.2, 900),
  pick: () => tone(520, 0, 0.1, 'triangle', 0.14, 700),
  drop: () => {
    tone(300, 0, 0.14, 'sine', 0.2, 180)
    noise(0, 0.08, 0.04, 2500)
  },
  correct: () => {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.07, 0.22, 'triangle', 0.14))
  },
  wrong: () => {
    // nazik, cezalandırmayan "hmm" sesi
    tone(330, 0, 0.18, 'sine', 0.12, 290)
    tone(294, 0.16, 0.22, 'sine', 0.1, 262)
  },
  coin: () => {
    tone(988, 0, 0.08, 'square', 0.06)
    tone(1319, 0.07, 0.25, 'square', 0.06)
  },
  star: () => {
    ;[1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, i * 0.05, 0.3, 'sine', 0.08))
  },
  whoosh: () => noise(0, 0.35, 0.06, 600),
  /** ahşap kapı açılışı: alçak gıcırtı + hafif tık */
  door: () => {
    noise(0, 0.06, 0.05, 2400)
    tone(150, 0.04, 0.55, 'sawtooth', 0.035, 205)
    tone(95, 0.06, 0.5, 'triangle', 0.05, 128)
  },
  /** içeri adım: yükselen ışıltı */
  enter: () => {
    noise(0, 0.5, 0.05, 900)
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.05 + i * 0.07, 0.35, 'sine', 0.07))
  },
  fanfare: () => {
    const n = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5]
    n.forEach((f, i) => tone(f, i * 0.11, i === n.length - 1 ? 0.7 : 0.18, 'triangle', 0.13))
    n.forEach((f, i) => tone(f / 2, i * 0.11, 0.18, 'sine', 0.06))
  },
  unlock: () => {
    tone(392, 0, 0.12, 'triangle', 0.12)
    tone(587, 0.1, 0.3, 'triangle', 0.12)
  },
} as const

export type SoundName = keyof typeof SOUNDS

export function sfx(name: SoundName) {
  if (!useGame.getState().settings.sfx) return
  try {
    SOUNDS[name]()
  } catch {
    /* ses kapalı cihazlarda sessizce geç */
  }
}
