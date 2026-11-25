import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import { emptySkill, levelFromXp, mastery, rewardsFor, starsFor, updateSkill, type Level, type SkillStat } from './mastery'
import { appleQuestion } from './questions'
import { makeRng } from './rng'
import type { Grade } from '../content/types'
import { GAMES } from '../content/games'
import { SUBJECTS } from '../content/subjects'
import { GENERATORS } from '../content/generators'
import { LETTER_ORDER, isAllowed, setLearnedIdx } from '../content/letters'
import type { Question, Visual } from '../games/quiz/types'
import { STAGES } from '../content/okumaYazma'
import { harfEtkinlikleri } from '../content/generators/harfEtkinlik'
import { TEMALAR } from '../content/generators/matYolu'
import { ALANLAR } from '../content/generators/hbYolu'
import { YOLLAR } from '../content/yollar'
import { MODELLER } from '../games/quiz/modeller'

const run = (seq: boolean[], start?: SkillStat) => seq.reduce<SkillStat>((s, c) => updateSkill(s, c), start ?? emptySkill())
const imgExists = (n: string) => fs.existsSync(`public/assets/objects/${n}.png`)

describe('akıllı öğrenme — ustalık', () => {
  it('art arda başarıda seviye atlar, pencere sıfırlanır', () => {
    expect(run([true, true, true, true, true]).level).toBe(2)
    expect(run([true, true, true, true, true, true]).level).toBe(2)
  })
  it('sürekli hatada seviye düşer ve yeniden anlatım işaretlenir', () => {
    const s = run([false, false, false, false], run([true, true, true, true, true]))
    expect(s.level).toBe(1)
    expect(s.needsReview).toBe(true)
  })
  it('seviye 1–3 aralığında kalır', () => {
    expect(run(Array(12).fill(false)).level).toBe(1)
    expect(run(Array(30).fill(true)).level).toBe(3)
  })
  it('yeniden anlatım işareti 3 doğru ile kalkar', () => {
    expect(run([false, false, false, false, true, true, true]).needsReview).toBe(false)
  })
  it('ustalık başarıyla artar', () => {
    expect(mastery(run([true, true, true, true]))).toBeGreaterThan(mastery(run([false, true, false, false])))
  })
})

describe('ödüller', () => {
  it('yıldız ve para', () => {
    expect(starsFor(6, 6)).toBe(3)
    expect(starsFor(4, 6)).toBe(2)
    expect(starsFor(2, 6)).toBe(1)
    expect(rewardsFor(3, 6, true).coins).toBe(50)
    expect(levelFromXp(60).level).toBe(2)
  })
})

describe('katalog — sınıfa uygunluk', () => {
  it('her etkinlik yalnızca dersinin programda olduğu sınıflara açılır', () => {
    for (const g of GAMES) {
      const s = SUBJECTS.find((x) => x.id === g.subject)!
      for (const gr of g.grades) expect(s.grades, `${g.id} → ${gr}. sınıf`).toContain(gr)
    }
  })
  it('ilk okuma yazma etkinlikleri 4. sınıfa açılmaz', () => {
    expect(GAMES.find((g) => g.id === 'harf-avi')!.grades).toEqual([1])
    expect(GAMES.find((g) => g.id === 'hece-treni')!.grades).not.toContain(4)
  })
  it('her sınıf ve her dersinde en az 2 etkinlik var', () => {
    for (const s of SUBJECTS)
      for (const gr of s.grades) expect(GAMES.filter((g) => g.subject === s.id && g.grades.includes(gr)).length, `${s.id} ${gr}`).toBeGreaterThanOrEqual(2)
  })
  it('Öğrenelim kartlarındaki görseller mevcut ve 1. sınıfın her etkinliğinde konu anlatımı var', () => {
    for (const g of GAMES) {
      if (g.grades.includes(1) && (g.subject === 'turkce' || g.subject === 'matematik') && g.mechanic !== 'apples') expect(g.lesson, `${g.id} lesson`).toBeTruthy()
      for (const i of visualImgs(g.lesson?.visual)) expect(imgExists(i), `${g.id} ${i}`).toBe(true)
    }
  })
  it('her etkinliğin ikonu ve üreticisi var', () => {
    for (const g of GAMES) {
      expect(imgExists(g.icon), `ikon ${g.icon}`).toBe(true)
      if (g.mechanic !== 'apples') expect(GENERATORS[g.id], g.id).toBeTypeOf('function')
    }
  })
})

function visualImgs(v?: Visual): string[] {
  if (!v) return []
  if (v.kind === 'image' || v.kind === 'objects' || v.kind === 'groups' || v.kind === 'share') return [v.img]
  if (v.kind === 'images') return v.imgs
  if (v.kind === 'compare') return [v.left.img, v.right.img]
  if (v.kind === 'word' && v.img) return [v.img]
  return []
}

function validate(q: Question, where: string) {
  expect(q.prompt.length, where).toBeGreaterThan(3)
  expect(q.explain.length, where).toBeGreaterThan(3)
  if (q.type === 'choice') {
    expect(q.options.length, where).toBeGreaterThanOrEqual(2)
    expect(q.answer, where).toBeGreaterThanOrEqual(0)
    expect(q.answer, where).toBeLessThan(q.options.length)
    const keys = q.options.map((o) => o.label ?? o.img ?? JSON.stringify(o.visual))
    expect(new Set(keys).size, `${where} benzersiz seçenek: ${keys}`).toBe(keys.length)
    for (const o of q.options) {
      if (o.img) expect(imgExists(o.img), `${where} ${o.img}`).toBe(true)
      for (const i of visualImgs(o.visual)) expect(imgExists(i), `${where} ${i}`).toBe(true)
    }
    for (const i of visualImgs(q.visual)) expect(imgExists(i), `${where} ${i}`).toBe(true)
    if (q.passage?.img) expect(imgExists(q.passage.img), where).toBe(true)
  } else if (q.type === 'order') {
    expect(q.pieces.length, where).toBeGreaterThanOrEqual(2)
    for (const e of q.extra ?? []) expect(q.pieces, where).not.toContain(e)
    if (q.img) expect(imgExists(q.img), `${where} ${q.img}`).toBe(true)
  } else if (q.type === 'match' || q.type === 'memory') {
    const pairs = q.type === 'match' ? q.pairs.map((p) => [p.left, p.right]) : q.pairs.map((p) => [p.a, p.b])
    expect(pairs.length, where).toBeGreaterThanOrEqual(2)
    const k = (o: { label?: string; img?: string; visual?: Visual }) => o.label ?? o.img ?? JSON.stringify(o.visual)
    // her iki sütunda da öğeler benzersiz olmalı (yoksa eşleştirme belirsiz olur)
    expect(new Set(pairs.map((p) => k(p[0]))).size, `${where} sol benzersiz`).toBe(pairs.length)
    expect(new Set(pairs.map((p) => k(p[1]))).size, `${where} sağ benzersiz`).toBe(pairs.length)
    for (const p of pairs)
      for (const o of p) {
        if (o.img) expect(imgExists(o.img), `${where} ${o.img}`).toBe(true)
        for (const i of visualImgs(o.visual)) expect(imgExists(i), `${where} ${i}`).toBe(true)
      }
  } else if (q.type === 'pop') {
    const hit = q.items.filter((x) => (q.hits ? q.hits.includes(x) : q.target.length === 1 && x.length === 1 ? x === q.target : x.toLocaleLowerCase('tr-TR').includes(q.target.toLocaleLowerCase('tr-TR'))))
    expect(hit.length, `${where} balon: yeterli doğru balon`).toBeGreaterThanOrEqual(q.need)
    expect(q.need, where).toBeGreaterThanOrEqual(2)
    expect(q.items.length - hit.length, `${where} balon: çeldirici`).toBeGreaterThanOrEqual(2)
  } else if (q.type === 'model') {
    const m = MODELLER[q.sahne]
    expect(m, `${where} model: ${q.sahne}`).toBeTruthy()
    for (const y of q.yuvalar) {
      expect(m.yuvalar[y.id], `${where} yuva ${y.id}`).toBeTruthy()
      expect(q.etiketler, where).toContain(y.dogru)
    }
    expect(new Set(q.etiketler).size, `${where} etiketler benzersiz`).toBe(q.etiketler.length)
    expect(q.etiketler.length, `${where} çeldirici`).toBeGreaterThan(q.yuvalar.length)
  } else if (q.type === 'search') {
    expect(q.words.length, where).toBeGreaterThanOrEqual(3)
    for (const p of q.placed) expect(p.cells.map(([r, c]) => q.grid[r][c]).join(''), `${where} kelime yerleşimi`).toBe(p.word)
  } else if (q.type === 'trace') {
    expect(q.letter.length, where).toBe(1)
  } else if (q.type === 'input') {
    expect(q.answer.length, where).toBeGreaterThan(0)
    if (q.keys === 'digits') expect(/^\d+$/.test(q.answer), `${where} sayısal cevap`).toBe(true)
    else for (const ch of q.answer) expect(q.keys, `${where} cevap tuşlarla yazılabilmeli`).toContain(ch)
    for (const i of visualImgs(q.visual)) expect(imgExists(i), `${where} ${i}`).toBe(true)
  } else {
    const bins = new Set(q.bins.map((b) => b.id))
    expect(q.items.length, where).toBeGreaterThanOrEqual(2)
    for (const it of q.items) {
      expect(bins.has(it.bin), where).toBe(true)
      if (it.img) expect(imgExists(it.img), `${where} ${it.img}`).toBe(true)
    }
    for (const b of q.bins) if (b.img) expect(imgExists(b.img), `${where} ${b.img}`).toBe(true)
  }
}

describe('tüm etkinlikler × sınıflar × seviyeler — içerik doğrulama', () => {
  for (const g of GAMES.filter((x) => x.mechanic !== 'apples')) {
    it(g.id, () => {
      for (const grade of g.grades)
        for (const level of [1, 2, 3] as Level[]) {
          const rng = makeRng(grade * 1000 + level * 17 + g.id.length)
          const hist: Question[] = []
          for (let i = 0; i < 40; i++) {
            const q = GENERATORS[g.id](rng, grade, level, hist)
            validate(q, `${g.id} ${grade}.sınıf sv${level} #${i}`)
            hist.push(q)
          }
        }
    })
  }
})

/** "a + b = ?" metninden sayıları ayıkla */
const nums = (t: string) => (t.match(/[\d.]+/g) ?? []).map((x) => Number(x.replace(/\./g, '')))

describe('matematik — program sınırları', () => {
  it('1. sınıf işlemler: 20’yi aşmaz, toplama eldesiz, çıkarma onluk bozmadan', () => {
    const rng = makeRng(5)
    for (const level of [1, 2, 3] as Level[])
      for (let i = 0; i < 200; i++) {
        const q = GENERATORS['islem-robotu'](rng, 1, level, [])
        if (q.type !== 'choice' || q.visual?.kind !== 'equation') continue
        const t = q.visual.text
        const [a, b, c] = nums(t)
        if (t.includes('?') && t.indexOf('?') < t.indexOf('=')) {
          // verilmeyen terim: a + ? = c
          expect(b).toBeLessThanOrEqual(20)
          expect((a % 10) + ((b - a) % 10)).toBeLessThan(10)
          continue
        }
        void c
        if (t.includes('+')) {
          expect(a + b).toBeLessThanOrEqual(20)
          expect((a % 10) + (b % 10)).toBeLessThan(10)
        } else {
          expect(a).toBeLessThanOrEqual(20)
          expect(a % 10).toBeGreaterThanOrEqual(b % 10)
        }
        expect(Number(q.options[q.answer].label!.replace(/\./g, ''))).toBe(t.includes('+') ? a + b : a - b)
      }
  })
  it('2. sınıf çarpma: 5’e kadar çarpım tablosu', () => {
    const rng = makeRng(9)
    for (let i = 0; i < 200; i++) {
      const q = GENERATORS['carpma-yarisi'](rng, 2, 2, [])
      if (q.type === 'choice' && q.visual?.kind === 'groups') {
        expect(q.visual.per).toBeLessThanOrEqual(5)
        expect(q.visual.groups).toBeLessThanOrEqual(10)
        expect(Number(q.options[q.answer].label)).toBe(q.visual.per * q.visual.groups)
      }
    }
  })
  it('2. sınıf bölme: kalansız, 20’ye kadar, 2–5’e bölme', () => {
    const rng = makeRng(11)
    for (let i = 0; i < 200; i++) {
      const q = GENERATORS['bolme-paylasma'](rng, 2, 2, [])
      if (q.type === 'choice' && q.visual?.kind === 'share') {
        expect(q.visual.total).toBeLessThanOrEqual(20)
        expect(q.visual.plates).toBeGreaterThanOrEqual(2)
        expect(q.visual.plates).toBeLessThanOrEqual(5)
        expect(q.visual.total % q.visual.plates).toBe(0)
        expect(Number(q.options[q.answer].label)).toBe(q.visual.total / q.visual.plates)
      }
    }
  })
  it('3–4. sınıf bölmede kalan bölenden küçük', () => {
    for (const grade of [3, 4] as Grade[]) {
      const rng = makeRng(grade)
      for (let i = 0; i < 200; i++) {
        const q = GENERATORS['bolme-paylasma'](rng, grade, 3, [])
        if (q.type !== 'choice' || q.visual?.kind !== 'equation') continue
        const [n, d] = nums(q.visual.text)
        const lab = q.options[q.answer].label!
        const [qq, r = 0] = nums(lab)
        expect(d * qq + r, `${q.visual.text} → ${lab}`).toBe(n)
        expect(r).toBeLessThan(d)
      }
    }
  })
  it('Elma Toplama: 1. sınıf eldesiz/onluk bozmadan ≤20; sürüklenen elma ≤6', () => {
    for (const grade of [1, 2] as Grade[])
      for (const level of [1, 2, 3] as Level[]) {
        const rng = makeRng(grade * 10 + level)
        for (let i = 0; i < 300; i++) {
          const q = appleQuestion(rng, grade, level)
          expect(q.answer).toBe(q.op === '+' ? q.a + q.b : q.a - q.b)
          expect(q.b).toBeGreaterThanOrEqual(1)
          expect(q.b).toBeLessThanOrEqual(6)
          expect(q.options).toContain(q.answer)
          if (grade === 1) {
            expect(Math.max(q.a, q.answer)).toBeLessThanOrEqual(20)
            if (q.op === '+') expect((q.a % 10) + (q.b % 10)).toBeLessThan(10)
            else expect(q.a % 10).toBeGreaterThanOrEqual(q.b % 10)
          } else expect(q.answer).toBeLessThanOrEqual(100)
        }
      }
  })
})

describe('1. sınıf Türkçe — kitap kuralı: yalnızca öğrenilmiş harfler', () => {
  const visibleTexts = (q: Question): string[] => {
    if (q.type === 'choice') {
      const t = q.options.map((o) => o.label ?? '')
      if (q.visual?.kind === 'word') t.push(q.visual.word)
      if (q.passage) t.push(q.passage.text)
      return t
    }
    if (q.type === 'order') return [...q.pieces, ...(q.extra ?? [])]
    if (q.type === 'match') return q.pairs.flatMap((p) => [p.left.label ?? '', p.right.label ?? ''])
    if (q.type === 'memory') return q.pairs.flatMap((p) => [p.a.label ?? '', p.b.label ?? ''])
    if (q.type === 'input') return [q.answer, ...(q.keys === 'digits' ? [] : q.keys), ...(q.visual?.kind === 'word' ? [q.visual.word] : [])]
    return q.items.map((i) => i.label)
  }
  const ioy = GAMES.filter((g) => g.subject === 'turkce' && g.grades.includes(1) && g.minLetter && g.minLetter !== 'j')
  for (const g of ioy) {
    it(g.id, () => {
      for (let idx = LETTER_ORDER.indexOf(g.minLetter!); idx < LETTER_ORDER.length; idx += 2) {
        setLearnedIdx(idx)
        const rng = makeRng(idx * 31 + g.id.length)
        const hist: Question[] = []
        for (let i = 0; i < 20; i++) {
          const q = GENERATORS[g.id](rng, 1, ((i % 3) + 1) as Level, hist)
          validate(q, `${g.id} harf=${LETTER_ORDER[idx]} #${i}`)
          for (const t of visibleTexts(q)) expect(isAllowed(t, idx), `${g.id} harf=${LETTER_ORDER[idx]}: “${t}”`).toBe(true)
          hist.push(q)
        }
      }
      setLearnedIdx(11)
    })
  }
  it('Harf Avı: “l”ye kadar öğrenildiyse yalnızca a n e t i l', () => {
    setLearnedIdx(5)
    const rng = makeRng(3)
    for (let i = 0; i < 80; i++) {
      const q = GENERATORS['harf-avi'](rng, 1, 1, [])
      if (q.type === 'choice') q.options.forEach((o) => expect(['a', 'n', 'e', 't', 'i', 'l']).toContain(o.label!.toLocaleLowerCase('tr-TR')))
    }
    setLearnedIdx(11)
  })
  it('1. sınıfta eş/zıt anlam yok (kitaplarda yok)', () => {
    expect(GAMES.find((g) => g.id === 'kelime-hazinesi')!.grades).not.toContain(1)
  })
})

describe('1. sınıf Matematik — kitap sınırları', () => {
  it('işlemler 20’yi aşmaz; alt alta işlem eldesiz / onluk bozmadan', () => {
    const rng = makeRng(77)
    for (const level of [1, 2, 3] as Level[])
      for (let i = 0; i < 300; i++) {
        const q = GENERATORS['m1-islem'](rng, 1, level, [])
        if (q.type !== 'choice') continue
        const lab = q.options[q.answer].label ?? ''
        if (/^\d+$/.test(lab)) expect(Number(lab)).toBeLessThanOrEqual(20)
        if (q.visual?.kind === 'column') {
          const { a, b, op } = q.visual
          if (op === '+') expect((a % 10) + (b % 10)).toBeLessThan(10)
          else expect(a % 10).toBeGreaterThanOrEqual(b % 10)
          expect(Number(lab)).toBe(op === '+' ? a + b : a - b)
        }
      }
  })
  it('sayılar 0–20, ritmik sayma 100’e kadar', () => {
    const rng = makeRng(5)
    for (let i = 0; i < 300; i++) {
      const q = GENERATORS['m1-sayi-avcisi'](rng, 1, 3, [])
      if (q.type === 'choice' && q.visual?.kind === 'objects') expect(q.visual.count).toBeLessThanOrEqual(20)
      const r = GENERATORS['m1-ritmik'](rng, 1, 3, [])
      if (r.type === 'choice' && r.visual?.kind === 'sequence') r.visual.items.forEach((x) => typeof x === 'number' && expect(x).toBeLessThanOrEqual(100))
    }
  })
  it('veri ≤ 14', () => {
    const rng = makeRng(8)
    for (let i = 0; i < 200; i++) {
      const q = GENERATORS['m1-veri'](rng, 1, 3, [])
      if (q.type === 'choice' && (q.visual?.kind === 'pictograph' || q.visual?.kind === 'tally')) q.visual.rows.forEach((r) => expect(r.count).toBeLessThanOrEqual(14))
    }
  })
  it('kitaptaki 7 temanın her birinin değerlendirmesi var', () => {
    for (let n = 1; n <= 7; n++) expect(GENERATORS[`m1-degerlendirme-${n}`], String(n)).toBeTypeOf('function')
  })
})

describe('Okuma Yazma Yolu — 29 harf adası', () => {
  const visible = (q: Question): string[] => {
    if (q.type === 'choice') return [...q.options.map((o) => o.label ?? ''), ...(q.visual?.kind === 'word' ? [q.visual.word] : []), ...(q.passage ? [q.passage.text] : [])]
    if (q.type === 'order') return [...q.pieces, ...(q.extra ?? [])]
    if (q.type === 'match') return q.pairs.flatMap((p) => [p.left.label ?? '', p.right.label ?? ''])
    if (q.type === 'memory') return q.pairs.flatMap((p) => [p.a.label ?? '', p.b.label ?? ''])
    if (q.type === 'input') return [q.answer, ...(q.keys === 'digits' ? [] : q.keys)]
    if (q.type === 'pop') return q.items
    if (q.type === 'search') return [...q.words, ...q.grid.flat()]
    if (q.type === 'trace') return [q.letter]
    return q.items.map((x) => x.label)
  }
  it('kitaptaki harf sırasıyla 29 harf', () => {
    expect(STAGES.map((x) => x.letter)).toEqual(LETTER_ORDER)
  })
  it('her harfte en az 4 etkinlik ve sonda oyun; toplamda 250+ etkinlik', () => {
    let n = 0
    for (const l of LETTER_ORDER) {
      const k = harfEtkinlikleri(l)
      expect(k.length, l).toBeGreaterThanOrEqual(4)
      expect(k[k.length - 1], l).toBe('oyun')
      n += k.length
    }
    expect(n).toBeGreaterThanOrEqual(250)
  })
  for (const st of STAGES) {
    it(`“${st.letter}” adası: tüm etkinlikler geçerli ve yalnızca öğrenilmiş harfler`, () => {
      const idx = LETTER_ORDER.indexOf(st.letter)
      const texts = [...st.heceler, ...st.kelimeler, ...(st.cumleler ?? []), ...(st.metin ? [st.metin.text, st.metin.a, ...st.metin.w] : [])]
      for (const t of texts) expect(isAllowed(t, idx), `${st.letter}: “${t}”`).toBe(true)
      setLearnedIdx(idx)
      for (const kind of harfEtkinlikleri(st.letter)) {
        const id = `oy-${st.letter}-${kind}`
        const meta = GAMES.find((g) => g.id === id)
        expect(meta, id).toBeTruthy()
        expect(GENERATORS[id], id).toBeTypeOf('function')
        for (let run = 0; run < 3; run++) {
          const rng = makeRng(idx * 13 + run + kind.length)
          const hist: Question[] = []
          for (let i = 0; i < meta!.total; i++) {
            const q = GENERATORS[id](rng, 1, 1, hist)
            validate(q, `${id} #${i}`)
            for (const t of visible(q)) expect(isAllowed(t, idx), `${id} #${i}: “${t}”`).toBe(true)
            hist.push(q)
          }
        }
      }
      setLearnedIdx(11)
    })
  }
})

describe('Matematik Yolu — 7 tema adası (1. sınıf kitabı)', () => {
  it('7 tema, en az 70 etkinlik, her temada sonda oyun', () => {
    expect(TEMALAR.map((t) => t.no)).toEqual([1, 2, 3, 4, 5, 6, 7])
    const acts = TEMALAR.flatMap((t) => t.acts.filter((a) => !a.oyun))
    expect(acts.length).toBeGreaterThanOrEqual(70)
    for (const t of TEMALAR) expect(t.acts.some((a) => a.oyun), t.id).toBe(true)
  })
  for (const t of TEMALAR) {
    it(`${t.no}. tema: her etkinlik geçerli ve odaklı`, () => {
      for (const a of t.acts) {
        const id = `my-${t.id}-${a.kind}`
        expect(GAMES.find((g) => g.id === id), id).toBeTruthy()
        expect(GENERATORS[id], id).toBeTypeOf('function')
        const prompts = new Set<string>()
        for (let run = 0; run < 4; run++) {
          const rng = makeRng(run * 101 + a.kind.length * 7 + t.no)
          const hist: Question[] = []
          for (let i = 0; i < a.total; i++) {
            const q = GENERATORS[id](rng, 1, 1, hist)
            validate(q, `${id} #${i}`)
            prompts.add(q.prompt.replace(/\d+/g, '#'))
            // 4. tema: işlemlerde kitabın 20 sınırı
            if (t.id === 't4' && q.type === 'choice' && q.visual?.kind === 'equation')
              for (const n of q.visual.text.match(/\d+/g) ?? []) expect(Number(n), `${id}: ${q.visual.text}`).toBeLessThanOrEqual(20)
            hist.push(q)
          }
        }
        expect(prompts.size, `${id} en az bir soru biçimi`).toBeGreaterThanOrEqual(1)
      }
    })
  }
  it('odaklı etkinlikler gerçekten o bölümün sorusunu sorar', () => {
    const want: Record<string, RegExp> = {
      'my-t4-eksik-sayi': /Verilmeyen/, 'my-t4-alt-alta': /Alt alta/, 'my-t4-artma-azalma': /artma mı/, 'my-t4-tahmin': /EN YAKIN/,
      'my-t3-atas': /ataş/, 'my-t3-birim': /birim/, 'my-t1-es-yok': /Eşi olmayan/, 'my-t5-odeme': /hangi paraları/, 'my-t6-sekil-ad': /adı nedir/,
      'my-t7-en-cok-az': /EN /, 'my-t2-oruntu-sekil': /Örüntüde/,
    }
    for (const [id, re] of Object.entries(want)) {
      const rng = makeRng(5)
      for (let i = 0; i < 12; i++) expect(GENERATORS[id](rng, 1, 1, []).prompt, id).toMatch(re)
    }
  })
})

describe('Hayat Bilgisi Yolu — 6 öğrenme alanı adası (1. sınıf kitabı)', () => {
  const textOf = (q: Question): string =>
    [
      q.prompt,
      q.explain,
      q.type === 'choice' ? q.options.map((o) => o.label ?? '').join(' ') : '',
      q.type === 'sort' ? q.items.map((i) => i.label).join(' ') : '',
      q.type === 'match' ? q.pairs.map((p) => `${p.left.label} ${p.right.label}`).join(' ') : '',
      q.type === 'memory' ? q.pairs.map((p) => `${p.a.label} ${p.b.label}`).join(' ') : '',
      q.type === 'pop' ? q.items.join(' ') : '',
      q.type === 'order' ? q.pieces.join(' ') : '',
    ].join(' ')

  it('6 alan, 23 konunun hepsi, her alanda sonda oyun', () => {
    expect(ALANLAR.map((t) => t.no)).toEqual([1, 2, 3, 4, 5, 6])
    const acts = ALANLAR.flatMap((t) => t.acts.filter((a) => !a.oyun))
    expect(acts.length).toBeGreaterThanOrEqual(90)
    const codes = new Set(acts.map((a) => a.meb))
    expect(codes.size, [...codes].join()).toBe(23)
    for (const t of ALANLAR) expect(t.acts.filter((a) => a.oyun).length, t.id).toBeGreaterThanOrEqual(2)
  })

  for (const t of ALANLAR) {
    it(`${t.no}. alan: geçerli içerik, hassas içerik kuralları`, () => {
      for (const a of t.acts) {
        const id = `hb-${t.id}-${a.kind}`
        expect(GAMES.find((g) => g.id === id), id).toBeTruthy()
        expect(a.meb, id).toMatch(/^HB\.1\.\d\.\d$/)
        const rng = makeRng(11)
        for (const level of [1, 2, 3] as Level[]) {
          const h: Question[] = []
          for (let i = 0; i < 10; i++) {
            const q = GENERATORS[id](rng, 1, level, h)
            const s = textOf(q)
            // 112 dışında gerçek acil numaralar (155, 110, 156, 177) çeldirici olarak kullanılmaz
            expect(s, `${id}: acil numara`).not.toMatch(/\b(155|110|156|177)\b/)
            // yıl verilmez (1. sınıf 1000'den büyük sayı bilmez)
            expect(s, `${id}: yıl`).not.toMatch(/\b1[89]\d\d\b/)
            h.push(q)
          }
        }
      }
    })
  }

  it('doğru/yanlış soruları dengeli (iki cevap da gelir)', () => {
    const rng = makeRng(3)
    const id = 'hb-a1-kurallar'
    const ans = new Set<number>()
    const h: Question[] = []
    for (let i = 0; i < 20; i++) {
      const q = GENERATORS[id](rng, 1, 2, h)
      if (q.type === 'choice') ans.add(q.answer)
      h.push(q)
    }
    expect([...ans].sort()).toEqual([0, 1])
  })
})

describe('Kitap yolları (1–3. sınıf)', () => {
  it('her yolda adalar var; her adada en az 2 oyun ve 4 etkinlik', () => {
    for (const y of YOLLAR) {
      // 1. sınıf Türkçe ders kitabında 4 tema var (5–8); diğer kitaplarda en az 6
      expect(y.adalar.length, y.id).toBeGreaterThanOrEqual(y.id === 'tr1' ? 4 : 6)
      for (const t of y.adalar) {
        expect(t.acts.filter((a) => a.oyun).length, `${y.id}/${t.id}`).toBeGreaterThanOrEqual(2)
        expect(t.acts.filter((a) => !a.oyun).length, `${y.id}/${t.id}`).toBeGreaterThanOrEqual(4)
        for (const a of t.acts) expect(GAMES.find((g) => g.id === `${y.onek}-${t.id}-${a.kind}`), `${y.onek}-${t.id}-${a.kind}`).toBeTruthy()
      }
    }
  })
  it('kazanım kodları doğru biçimde', () => {
    const re: Record<string, RegExp> = {
      tr1: /^T\.[A-ZÖÇŞİÜ]+\.1\./,
      tr2: /^T\.[A-ZÖÇŞİÜ]+\.2\./,
      mat2: /^MAT\.2\.\d\.\d+$/,
      hb2: /^HB\.2\.\d\.\d$/,
      tr3: /^T\.[A-ZÖÇŞİÜ]+\.3\./,
      mat3: /^MAT\.3\.\d\.\d+$/,
      hb3: /^HB\.3\.\d\.\d$/,
      fen3: /^FB\.3\.\d\.\d$/,
    }
    for (const y of YOLLAR) for (const t of y.adalar) for (const a of t.acts) expect(a.meb, `${y.id}/${t.id}/${a.kind}`).toMatch(re[y.id])
  })
  it('Matematik: 2. sınıf sınırları (sayılar ≤ 100, çarpım ≤ 50, bölünen ≤ 20)', () => {
    const y = YOLLAR.find((x) => x.id === 'mat2')!
    for (const t of y.adalar)
      for (const a of t.acts) {
        const rng = makeRng(13)
        const h: Question[] = []
        for (let i = 0; i < 25; i++) {
          const q = GENERATORS[`my2-${t.id}-${a.kind}`](rng, 2, (1 + (i % 3)) as Level, h)
          h.push(q)
          const s = q.prompt.replace(/\d+ TL/g, '')
          for (const n of s.match(/\d+/g) ?? []) expect(Number(n), `${a.kind}: ${q.prompt}`).toBeLessThanOrEqual(100)
          const m = q.prompt.match(/(\d+) × (\d+)/)
          if (m) expect(Number(m[1]) * Number(m[2]), q.prompt).toBeLessThanOrEqual(50)
          const d = q.prompt.match(/(\d+) ÷ (\d+)/)
          if (d) {
            expect(Number(d[1]), q.prompt).toBeLessThanOrEqual(20)
            expect(Number(d[1]) % Number(d[2]), q.prompt).toBe(0)
          }
          expect(q.prompt, q.prompt).not.toMatch(/[<>]/)
        }
      }
  })
  it('Hayat Bilgisi 2: 112 dışında acil numara yok, yıl yok', () => {
    const y = YOLLAR.find((x) => x.id === 'hb2')!
    for (const t of y.adalar)
      for (const a of t.acts) {
        const rng = makeRng(5)
        const h: Question[] = []
        for (let i = 0; i < 10; i++) {
          const q = GENERATORS[`hb2-${t.id}-${a.kind}`](rng, 2, 2, h)
          h.push(q)
          const s = JSON.stringify(q)
          expect(s, a.kind).not.toMatch(/\b(155|110|156|177)\b/)
          expect(s, a.kind).not.toMatch(/\b1[89]\d\d\b/)
        }
      }
  })
})
