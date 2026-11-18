/**
 * Sesli yönergeler — Web Speech API (tr-TR).
 * Okuma bilmeyen 1. sınıf öğrencileri için her yönerge seslendirilir.
 * Cihazda Türkçe ses yoksa sessizce geçer.
 * İleride: profesyonel seslendirme dosyaları (public/assets/sounds/voice/<anahtar>.mp3) eklenince
 * `speak()` önce kayıt dosyasını çalacak şekilde genişletilecek.
 */
import { useGame } from '../state/store'

/** Harflerin okunuşu: TTS tek harfi yanlış okuyabildiği için ses değerine yakın okunuş verilir */
export const LETTER_SOUNDS: Record<string, string> = {
  a: 'a', b: 'be', c: 'ce', ç: 'çe', d: 'de', e: 'e', f: 'fe', g: 'ge', ğ: 'yumuşak ge', h: 'he',
  ı: 'ı', i: 'i', j: 'je', k: 'ke', l: 'le', m: 'me', n: 'ne', o: 'o', ö: 'ö', p: 'pe', r: 're',
  s: 'se', ş: 'şe', t: 'te', u: 'u', ü: 'ü', v: 've', y: 'ye', z: 'ze',
}

let voice: SpeechSynthesisVoice | null = null
let voicesReady = false

function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return
  const vs = speechSynthesis.getVoices()
  if (!vs.length) return
  voicesReady = true
  const tr = vs.filter((v) => v.lang.toLowerCase().startsWith('tr'))
  // Doğal sesler (Online/Natural) daha kaliteli
  voice = tr.find((v) => /natural|online|neural/i.test(v.name)) ?? tr[0] ?? null
}

if (typeof speechSynthesis !== 'undefined') {
  pickVoice()
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
}

export const hasTurkishVoice = () => {
  if (!voicesReady) pickVoice()
  return !!voice
}

export function speak(text: string, opts: { rate?: number; pitch?: number; force?: boolean } = {}) {
  if (typeof speechSynthesis === 'undefined') return
  if (!opts.force && !useGame.getState().settings.voice) return
  if (!voicesReady) pickVoice()
  try {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'tr-TR'
    if (voice) u.voice = voice
    u.rate = opts.rate ?? 0.92
    u.pitch = opts.pitch ?? 1.15
    speechSynthesis.speak(u)
  } catch {
    /* yok say */
  }
}

export const speakLetter = (l: string) => speak(LETTER_SOUNDS[l] ?? l, { rate: 0.8, force: true })

export function stopSpeaking() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}
