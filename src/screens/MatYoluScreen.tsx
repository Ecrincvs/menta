/**
 * MATEMATİK YOLU — 1. sınıf Matematik kitabının 7 teması birer "tema adası".
 * Harita: kıvrımlı yol üzerinde 7 ada (hepsi açık; kitap sırası önerilir).
 * Tema ekranı: bölüm bölüm sıralı etkinlikler (sırayla açılır) + sonda oyun(lar) (etkinlikler bitince açılır).
 */
import { motion } from 'framer-motion'
import { Backdrop } from '../components/Backdrop'
import { Hud } from '../components/Hud'
import { BackButton, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Robo } from '../characters/Robo'
import { TEMALAR } from '../content/generators/matYolu'
import { temaOyunlari } from '../content/matYoluGames'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

function Stars({ n, size = 18 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} yıldız`}>
      {[1, 2, 3].map((s) => (
        <svg key={s} viewBox="0 0 24 24" width={size} height={size} aria-hidden>
          <path d="M12 1.5 L14.9 8.6 L22.5 9.2 L16.7 14.1 L18.5 21.6 L12 17.6 L5.5 21.6 L7.3 14.1 L1.5 9.2 L9.1 8.6 Z" fill={s <= n ? '#ffd23f' : '#eadcc0'} stroke={s <= n ? '#e8a40c' : '#d6c39e'} strokeWidth="1.5" />
        </svg>
      ))}
    </span>
  )
}

const progressOf = (temaId: string, results: Record<string, unknown>) => {
  const { acts, games } = temaOyunlari(temaId)
  const done = acts.filter((a) => results[a.id]).length
  return { done, total: acts.length, gamesDone: games.filter((g) => results[g.id]).length, games: games.length }
}

// ───────────────────────── HARİTA
export function MatYoluScreen() {
  const { gameResults, go } = useGame()
  const next = TEMALAR.find((t) => {
    const p = progressOf(t.id, gameResults)
    return p.done < p.total || p.gamesDone < p.games
  })
  const msg = next ? `Merhaba! Ben Robo. Önerdiğim sıradaki ada: ${next.no}. Tema, ${next.title}. İstediğin adaya da gidebilirsin.` : 'Muhteşem! Bütün matematik adalarını tamamladın!'

  return (
    <div className="absolute inset-0">
      <Backdrop kind="park" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton />
        <div className="mt-3 hidden md:block">
          <WoodSign icon="abacus" color="#9b6ef3">
            Matematik Yolu
          </WoodSign>
        </div>
        <Hud />
      </header>

      <motion.div className="absolute bottom-0 left-[1%] z-30 hidden w-[240px] flex-col items-start sm:flex" initial={{ x: -200 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.3 }}>
        <div className="mb-2 w-full">
          <SpeechBubble tail="bottom" text={msg} size="sm" />
        </div>
        <Robo pose="idle" size={160} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 top-[96px] z-10 overflow-y-auto px-4 pb-10 sm:left-[250px] sm:right-4 md:top-[112px]">
        <div className="relative mx-auto flex max-w-[860px] flex-col gap-4 pt-2">
          {/* yol */}
          <svg className="pointer-events-none absolute left-1/2 top-10 h-[calc(100%-80px)] w-[60%] -translate-x-1/2" viewBox="0 0 100 700" preserveAspectRatio="none" aria-hidden>
            <path d="M30 0 C 90 60, 90 100, 70 150 S 10 250, 30 300 S 90 400, 70 450 S 10 550, 30 600 S 80 680, 60 700" stroke="#fff" strokeOpacity="0.75" strokeWidth="6" strokeDasharray="2 12" strokeLinecap="round" fill="none" />
          </svg>
          {TEMALAR.map((t, i) => {
            const p = progressOf(t.id, gameResults)
            const complete = p.done === p.total && p.gamesDone === p.games
            const isNext = next?.id === t.id
            return (
              <motion.button
                key={t.id}
                initial={{ x: i % 2 ? 60 : -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, type: 'spring', stiffness: 220, damping: 20 }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sfx('whoosh')
                  go({ name: 'tema', tema: t.id })
                }}
                aria-label={`${t.no}. Tema: ${t.title}, ${p.done} / ${p.total} etkinlik`}
                className={`relative flex w-[min(560px,100%)] items-center gap-4 rounded-[30px] p-3 pr-5 text-left ${i % 2 ? 'self-end' : 'self-start'}`}
                style={{ background: '#fffaf0', boxShadow: isNext ? `0 0 0 4px ${t.color}, 0 7px 0 ${t.dark}, 0 14px 26px rgba(0,0,0,0.2)` : '0 6px 0 #e2cfa6, 0 12px 22px rgba(0,0,0,0.15)' }}
              >
                {isNext && <motion.span className="absolute inset-0 rounded-[30px]" animate={{ boxShadow: [`0 0 0 0 ${t.color}66`, `0 0 0 16px ${t.color}00`] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                <span className="relative grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[26px]" style={{ background: `radial-gradient(circle at 35% 25%, #ffffff88 0%, ${t.color} 50%, ${t.dark} 100%)`, boxShadow: `0 5px 0 ${t.dark}` }}>
                  <Obj name={t.icon} size={58} />
                  <span className="mk-display absolute -left-2 -top-2 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-[18px] text-white" style={{ background: t.dark }}>
                    {t.no}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-[12px] font-black uppercase tracking-wider" style={{ color: t.dark }}>
                    {t.no}. Tema
                  </span>
                  <span className="mk-display text-[24px] leading-tight">{t.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-[#efe3c8]">
                      <span className="block h-full rounded-full" style={{ width: `${(p.done / p.total) * 100}%`, background: t.color }} />
                    </span>
                    <span className="text-[13px] font-black text-[var(--mk-ink-soft)]">
                      {p.done}/{p.total}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-extrabold text-[var(--mk-ink-soft)]">
                    <Obj name="videogame" size={18} shadow={false} /> {p.gamesDone}/{p.games} oyun
                  </span>
                </span>
                {complete && <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[var(--mk-green)] text-[16px] font-black text-white shadow">✓</span>}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ───────────────────────── TEMA ADASI
export function TemaScreen({ temaId }: { temaId: string }) {
  const { gameResults, go } = useGame()
  const { tema: t, acts, games } = temaOyunlari(temaId)
  const done = (id: string) => !!gameResults[id]
  const doneN = acts.filter((g) => done(g.id)).length
  const nextIdx = acts.findIndex((g) => !done(g.id))
  const gamesOpen = nextIdx === -1
  const msg = gamesOpen
    ? games.every((g) => done(g.id))
      ? `Bu adayı tamamladın! İstediğin etkinliği tekrar oynayabilirsin.`
      : `Bütün etkinlikleri bitirdin! Şimdi oyun zamanı: ${games.map((g) => g.title).join(' ve ')}!`
    : doneN === 0
      ? `${t.title} adasına hoş geldin! İlk etkinlikle başlayalım.`
      : `Harika gidiyorsun! Sıradaki: ${acts[nextIdx].title}.`

  const open = (id: string, locked: boolean) => {
    if (locked) {
      sfx('wrong')
      speak('Önce sıradaki etkinliği bitirelim!')
      return
    }
    sfx('whoosh')
    go({ name: 'game', gameId: id })
  }

  return (
    <div className="absolute inset-0">
      <Backdrop kind="park" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton />
        <div className="mt-3 hidden md:block">
          <WoodSign icon={t.icon} color={t.color}>
            {`${t.no}. ${t.title}`}
          </WoodSign>
        </div>
        <Hud />
      </header>

      <div className="absolute inset-x-0 bottom-0 top-[96px] z-10 flex flex-col gap-4 overflow-y-auto px-3 pb-6 md:top-[112px] lg:flex-row lg:px-6">
        <aside className="flex shrink-0 flex-row items-center gap-4 lg:w-[260px] lg:flex-col lg:items-stretch">
          <motion.div
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="relative grid h-[150px] w-[150px] shrink-0 place-items-center rounded-[34px] text-white lg:h-[190px] lg:w-full"
            style={{ background: `radial-gradient(circle at 35% 25%, #ffffff66 0%, ${t.color} 45%, ${t.dark} 100%)`, boxShadow: `0 8px 0 ${t.dark}, 0 16px 26px rgba(0,0,0,0.22)`, border: '6px solid #fff' }}
          >
            <Obj name={t.icon} size={96} />
            <span className="mk-display absolute left-3 top-2 text-[34px]" style={{ textShadow: '0 3px 0 rgba(0,0,0,0.2)' }}>
              {t.no}
            </span>
          </motion.div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="mk-card p-3">
              <div className="mb-1 flex items-center justify-between text-[14px] font-black text-[var(--mk-ink-soft)]">
                <span>İlerleme</span>
                <span>
                  {doneN}/{acts.length}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#efe3c8]">
                <motion.div className="h-full rounded-full" style={{ background: t.color }} initial={{ width: 0 }} animate={{ width: `${(doneN / acts.length) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
              </div>
            </div>
            <div className="hidden flex-col items-center gap-1 lg:flex">
              <div className="w-full">
                <SpeechBubble tail="bottom" text={msg} size="sm" />
              </div>
              <Robo pose={gamesOpen ? 'cheer' : 'idle'} size={120} />
            </div>
            <div className="lg:hidden">
              <SpeechBubble tail="none" text={msg} size="sm" />
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {acts.map((g, k) => {
              const isDone = done(g.id)
              const locked = nextIdx !== -1 && k > nextIdx
              const isNext = k === nextIdx
              const best = gameResults[g.id]?.best ?? 0
              return (
                <motion.button
                  key={g.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * k, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={!locked ? { y: -4 } : {}}
                  whileTap={!locked ? { scale: 0.96 } : {}}
                  onClick={() => open(g.id, locked)}
                  aria-label={`${k + 1}. ${g.title}${locked ? ', kilitli' : isDone ? `, ${best} yıldız` : ''}`}
                  className="relative flex min-h-[132px] flex-col items-center justify-center gap-1 rounded-[24px] p-3 text-center"
                  style={{
                    background: locked ? 'linear-gradient(180deg,#f3ecdf,#e6dac2)' : '#fffaf0',
                    boxShadow: isNext ? `0 0 0 4px ${t.color}, 0 6px 0 ${t.dark}` : locked ? '0 4px 0 #cdbf9f' : '0 5px 0 #e2cfa6',
                    opacity: locked ? 0.75 : 1,
                  }}
                >
                  <span className="mk-display absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full text-[16px] text-white" style={{ background: locked ? '#c9b48c' : t.color }}>
                    {k + 1}
                  </span>
                  {isNext && <motion.span className="absolute inset-0 rounded-[24px]" animate={{ boxShadow: [`0 0 0 0 ${t.color}66`, `0 0 0 14px ${t.color}00`] }} transition={{ duration: 1.4, repeat: Infinity }} />}
                  <span className={locked ? 'grayscale' : ''}>
                    <Obj name={g.icon} size={52} />
                  </span>
                  <span className="mk-display text-[17px] leading-tight">{g.title}</span>
                  {locked ? <Obj name="lock" size={22} shadow={false} /> : <Stars n={best} />}
                  {isDone && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--mk-green)] text-[14px] font-black text-white shadow">✓</span>}
                </motion.button>
              )
            })}
            {games.map((game, gi) => (
              <motion.button
                key={game.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.04 * (acts.length + gi), type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={gamesOpen ? { y: -4, scale: 1.02 } : {}}
                whileTap={gamesOpen ? { scale: 0.96 } : {}}
                onClick={() => open(game.id, !gamesOpen)}
                aria-label={`Oyun: ${game.title}${gamesOpen ? '' : ', kilitli'}`}
                className="relative col-span-2 flex min-h-[132px] items-center justify-center gap-4 overflow-hidden rounded-[24px] p-4 text-white"
                style={{
                  background: gamesOpen ? 'linear-gradient(135deg,#ffd75e 0%,#ffa62e 55%,#ff7a3d 100%)' : 'linear-gradient(135deg,#d9cdb6,#bfb196)',
                  boxShadow: gamesOpen ? '0 6px 0 #c76a12, 0 12px 24px rgba(200,110,20,0.35)' : '0 5px 0 #a8997c',
                }}
              >
                {gamesOpen && (
                  <motion.span
                    className="pointer-events-none absolute -inset-10"
                    style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.18) 0deg 12deg, rgba(255,255,255,0) 12deg 26deg)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                <span className={`relative ${gamesOpen ? '' : 'grayscale'}`}>
                  <Obj name={gamesOpen ? game.icon : 'lock'} size={64} />
                </span>
                <span className="relative flex flex-col items-start">
                  <span className="text-[13px] font-black uppercase tracking-wider opacity-90">Oyun</span>
                  <span className="mk-title text-[28px] leading-tight">{game.title}</span>
                  {gamesOpen ? <Stars n={gameResults[game.id]?.best ?? 0} size={20} /> : <span className="text-[14px] font-extrabold opacity-90">Bütün etkinlikleri bitirince açılır</span>}
                </span>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
