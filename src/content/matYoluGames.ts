import type { GameMeta } from './types'
import { TEMALAR } from './generators/matYolu'

/** Matematik Yolu: 7 tema adası — sıralı etkinlikler + sonda oyun(lar) (id: my-<tema>-<tür>) */
export const MY_GAMES: GameMeta[] = TEMALAR.flatMap((t) =>
  t.acts.map(
    (a): GameMeta => ({
      id: `my-${t.id}-${a.kind}`,
      subject: 'matematik',
      title: a.title,
      blurb: `${t.no}. Tema · ${t.title}`,
      icon: a.icon,
      grades: [1],
      skill: `my.${t.id}`,
      meb: { 1: [a.meb] },
      theme: `${t.no}. Tema · ${t.title}`,
      available: true,
      hidden: true,
      tint: '#e6f4ff',
      mechanic: 'choice',
      backdrop: 'park',
      host: 'robo',
      total: a.total,
      lesson: { text: a.ders, points: a.points, visual: a.visual },
    }),
  ),
)

/** Bir temanın etkinlikleri (sırayla) ve oyunları */
export const temaOyunlari = (temaId: string) => {
  const t = TEMALAR.find((x) => x.id === temaId)!
  const all = MY_GAMES.filter((g) => g.id.startsWith(`my-${temaId}-`))
  const games = t.acts.filter((a) => a.oyun).map((a) => `my-${temaId}-${a.kind}`)
  return { tema: t, acts: all.filter((g) => !games.includes(g.id)), games: all.filter((g) => games.includes(g.id)) }
}
