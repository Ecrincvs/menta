import type { GameMeta } from './types'
import { ALANLAR } from './generators/hbYolu'

/** Hayat Bilgisi Yolu: 6 öğrenme alanı adası — sıralı etkinlikler + sonda oyun(lar) (id: hb-<alan>-<tür>) */
export const HB_GAMES: GameMeta[] = ALANLAR.flatMap((t) =>
  t.acts.map(
    (a): GameMeta => ({
      id: `hb-${t.id}-${a.kind}`,
      subject: 'hayat',
      title: a.title,
      blurb: `${t.no}. Öğrenme Alanı · ${t.title}`,
      icon: a.icon,
      grades: [1],
      skill: `hb.${t.id}`,
      meb: { 1: [a.meb] },
      theme: `${t.no}. Öğrenme Alanı · ${t.title}`,
      available: true,
      hidden: true,
      tint: '#fff1dc',
      mechanic: 'choice',
      backdrop: 'town',
      host: 'findik',
      total: a.total,
      lesson: { text: a.ders, points: a.points, visual: a.visual },
    }),
  ),
)

/** Bir alanın etkinlikleri (sırayla) ve oyunları */
export const alanOyunlari = (alanId: string) => {
  const t = ALANLAR.find((x) => x.id === alanId)!
  const all = HB_GAMES.filter((g) => g.id.startsWith(`hb-${alanId}-`))
  const games = t.acts.filter((a) => a.oyun).map((a) => `hb-${alanId}-${a.kind}`)
  return { tema: t, acts: all.filter((g) => !games.includes(g.id)), games: all.filter((g) => games.includes(g.id)) }
}
