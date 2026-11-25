import { useCallback, useMemo, useRef, useState } from 'react'
import { useGame } from '../state/store'
import type { Level } from '../learning/mastery'
import { rewardsFor, starsFor } from '../learning/mastery'
import { makeRng, type Rng } from '../learning/rng'
import type { Grade } from '../content/types'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

export type Feedback = null | 'correct' | 'wrong' | 'reveal'

export interface GameResultSummary {
  stars: 1 | 2 | 3
  coins: number
  xp: number
  correctFirstTry: number
  total: number
  firstCompletion: boolean
  levelBefore: Level
  levelAfter: Level
}

const PRAISE = ['Harikasın! Bunu başardın!', 'Süpersin!', 'Aferin kaşif!', 'Çok güzel!', 'Mükemmel!', 'Bravo, doğru cevap!']
const ENCOURAGE = ['Bir daha deneyelim, sana güveniyorum!', 'Az kaldı, tekrar dene!', 'Hmm, bir daha düşünelim!']

/**
 * Ortak tur motoru: soru akışı, denemeler, kalpler, uyarlanabilir seviye, ödül.
 * Her cevap akıllı öğrenme sistemine (`recordAttempt`) kaydedilir; bir sonraki soru güncel seviyeyle üretilir.
 */
export function useRoundEngine<Q>({
  gameId,
  skill,
  total,
  make,
}: {
  gameId: string
  skill: string
  total: number
  make: (rng: Rng, grade: Grade, level: Level, history: Q[]) => Q
}) {
  const rng = useMemo(() => makeRng(), [])
  const grade = (useGame.getState().grade ?? 1) as Grade
  const levelBefore = useRef<Level>(useGame.getState().skills[skill]?.level ?? 1).current
  const recordAttempt = useGame((s) => s.recordAttempt)
  const finishGame = useGame((s) => s.finishGame)
  const startedAt = useRef(Date.now())

  const [history, setHistory] = useState<Q[]>(() => [make(rng, grade, levelBefore, [])])
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [correctFirstTry, setCorrectFirstTry] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [result, setResult] = useState<GameResultSummary | null>(null)
  const busy = useRef(false)

  const question = history[index]
  const level = (useGame((s) => s.skills[skill]?.level) ?? 1) as Level

  const finish = useCallback(
    (cft: number) => {
      const stars = starsFor(cft, total)
      const first = !useGame.getState().gameResults[gameId]
      const r = rewardsFor(stars, cft, first)
      const acc = cft / total
      finishGame({ gameId, stars, accuracy: acc, seconds: Math.round((Date.now() - startedAt.current) / 1000), coins: r.coins, xp: r.xp })
      setResult({
        stars,
        ...r,
        correctFirstTry: cft,
        total,
        firstCompletion: first,
        levelBefore,
        levelAfter: (useGame.getState().skills[skill]?.level ?? 1) as Level,
      })
    },
    [finishGame, gameId, levelBefore, skill, total],
  )

  const next = useCallback(
    (cft: number) => {
      busy.current = false
      setFeedback(null)
      setMessage(null)
      setAttempts(0)
      if (index + 1 >= total) {
        finish(cft)
        return
      }
      const lv = (useGame.getState().skills[skill]?.level ?? 1) as Level
      setHistory((h) => [...h, make(rng, grade, lv, h)])
      setIndex((i) => i + 1)
    },
    [finish, grade, index, make, rng, skill, total],
  )

  /** Cevap ver. `explain` ikinci yanlışta gösterilecek çözüm açıklaması. */
  const answer = useCallback(
    (correct: boolean, opts: { explain?: string; hint?: string; delay?: number } = {}) => {
      if (busy.current || result) return
      recordAttempt(skill, correct)
      if (correct) {
        busy.current = true
        const first = attempts === 0
        const cft = correctFirstTry + (first ? 1 : 0)
        if (first) setCorrectFirstTry(cft)
        setFeedback('correct')
        const p = PRAISE[Math.floor(Math.random() * PRAISE.length)]
        setMessage(p)
        sfx('correct')
        setTimeout(() => sfx('star'), 250)
        setTimeout(() => next(cft), opts.delay ?? 1700)
      } else {
        const n = attempts + 1
        setAttempts(n)
        setHearts((h) => Math.max(0, h - 1))
        sfx('wrong')
        if (n >= 2) {
          busy.current = true
          setFeedback('reveal')
          const m = opts.explain ?? 'Doğru cevaba birlikte bakalım.'
          setMessage(m)
          speak(m)
        } else {
          setFeedback('wrong')
          const e = opts.hint ?? ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]
          setMessage(e)
          if (opts.hint) speak(e)
          setTimeout(() => setFeedback((f) => (f === 'wrong' ? null : f)), 900)
        }
      }
    },
    [attempts, correctFirstTry, next, recordAttempt, result, skill],
  )

  /** Açıklama gösterildikten sonra çocuk "Devam" der */
  const continueAfterReveal = useCallback(() => next(correctFirstTry), [next, correctFirstTry])

  return {
    question,
    index,
    total,
    attempts,
    hearts,
    feedback,
    message,
    result,
    level,
    grade,
    answer,
    continueAfterReveal,
  }
}
