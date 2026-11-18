/**
 * Elma Toplama soru üreticisi (1–2. sınıf, MEB Maarif matematik sınırlarıyla).
 *  1. sınıf: 20'ye kadar (20 dâhil) ELDESİZ toplama, ONLUK BOZMADAN çıkarma, iki terimli. (MAT.1.2.1–1.2.4)
 *  2. sınıf: 100'e kadar; seviye 2'de eldeli toplama, seviye 3'te onluk bozarak çıkarma. (MAT.2.2.1–2.2.3)
 * Sürüklenecek elma sayısı (b) her zaman 1–6 arasında kalır.
 */
import type { Grade } from '../content/types'
import type { Level } from './mastery'
import { randInt, shuffle, type Rng } from './rng'

export interface AppleQuestion {
  op: '+' | '-'
  a: number
  b: number
  answer: number
  options: number[]
  story: string
  explain: string
}

const eldesiz = (a: number, b: number) => (a % 10) + (b % 10) < 10
const bozmadan = (a: number, b: number) => a % 10 >= b % 10

export function appleQuestion(rng: Rng, grade: Grade, level: Level): AppleQuestion {
  let op: '+' | '-' = '+'
  let a = 0
  let b = 0
  for (let tries = 0; tries < 200; tries++) {
    if (grade === 1) {
      if (level === 1) {
        a = randInt(rng, 1, 5)
        b = randInt(rng, 1, 3)
      } else if (level === 2) {
        a = randInt(rng, 2, 16)
        b = randInt(rng, 1, Math.min(6, 20 - a))
      } else {
        op = rng() < 0.5 ? '-' : '+'
        a = op === '-' ? randInt(rng, 4, 20) : randInt(rng, 2, 16)
        b = op === '-' ? randInt(rng, 1, Math.min(6, a - 1)) : randInt(rng, 1, Math.min(6, 20 - a))
      }
      if (op === '+' ? a + b <= 20 && eldesiz(a, b) : a - b >= 0 && bozmadan(a, b)) break
    } else {
      if (level === 1) {
        a = randInt(rng, 11, 89)
        b = randInt(rng, 1, 6)
        if (eldesiz(a, b)) break
      } else if (level === 2) {
        a = randInt(rng, 14, 93)
        b = randInt(rng, 2, 6)
        if (!eldesiz(a, b) && a + b <= 100) break // onluğa geçişli (eldeli)
      } else {
        op = rng() < 0.6 ? '-' : '+'
        a = randInt(rng, 21, 99)
        b = randInt(rng, 2, 6)
        if (op === '-' ? !bozmadan(a, b) : a + b <= 100) break // onluk bozarak
      }
    }
  }
  const answer = op === '+' ? a + b : a - b

  const opts = new Set<number>([answer])
  const near = shuffle(rng, [answer - 1, answer + 1, answer - 2, answer + 2, answer + 10, op === '+' ? a - b : a + b].filter((n) => n >= 0 && n !== answer))
  for (const n of near) {
    if (opts.size >= 3) break
    opts.add(n)
  }
  const options = [...opts].sort((x, y) => x - y)
  const counts = op === '+' ? Array.from({ length: b }, (_, i) => a + i + 1).join(', ') : Array.from({ length: b }, (_, i) => a - i - 1).join(', ')
  const story =
    op === '+' ? `Sepette ${a} elma var. ${b} elma daha eklersen toplam kaç elma olur?` : `Sepette ${a} elma var. Robo'ya ${b} elma verirsen sepette kaç elma kalır?`
  const explain =
    op === '+'
      ? `${a} sayısından ileri doğru ${b} sayarız: ${counts}. Yani ${a} + ${b} = ${answer}.`
      : `${a} sayısından geriye doğru ${b} sayarız: ${counts}. Yani ${a} − ${b} = ${answer}.`
  return { op, a, b, answer, options, story, explain }
}
