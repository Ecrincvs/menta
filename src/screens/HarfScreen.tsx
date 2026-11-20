/**
 * HARF ADASI — bir harfin bütün okuma yazma etkinlikleri (sıralı) + sonda harf oyunu.
 * Kitaptaki akış: ses → harf → yazma → hece → kelime → cümle → metin → oyun.
 * Etkinlikler sırayla açılır; oyun, bütün etkinlikler bitince açılır. Harf, oyun bitince "öğrenildi" sayılır.
 */
import { motion } from 'framer-motion'
import { Backdrop } from '../components/Backdrop'
import { Hud } from '../components/Hud'
import { BackButton, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Mascot } from '../characters/Mascot'
import { harfOyunlari } from '../content/okumaYazmaGames'
import { LETTER_ORDER } from '../content/letters'
import { upperTR } from '../content/words'
import { LETTER_SOUNDS, speak } from '../audio/speech'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'

const GROUP_COLORS = [
  ['#ff9a2e', '#d8670b'],
  ['#2ec4c9', '#149aa0'],
  ['#9b6ef3', '#6b43c4'],
  ['#5bc236', '#3a8f1d'],
  ['#e8463c', '#b8302c'],
]
const groupOf = (i: number) => (i <= 5 ? 0 : i <= 11 ? 1 : i <= 17 ? 2 : i <= 22 ? 3 : 4)

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

export function HarfScreen({ letter }: { letter: string }) {
  const { gameResults, go } = useGame()
  const i = LETTER_ORDER.indexOf(letter)
  const [color, dark] = GROUP_COLORS[groupOf(i)]
  const U = upperTR(letter)
  const sound = LETTER_SOUNDS[letter] ?? letter
  const list = harfOyunlari(letter)
  const acts = list.filter((g) => !g.id.endsWith('-oyun'))
  const game = list.find((g) => g.id.endsWith('-oyun'))!
  const done = (id: string) => !!gameResults[id]
  const doneN = acts.filter((g) => done(g.id)).length
  // ilk bitmemiş etkinlik = sıradaki
  const nextIdx = acts.findIndex((g) => !done(g.id))
  const gameOpen = nextIdx === -1
  const msg = gameOpen
    ? done(game.id)
      ? `Harika! “${letter}” harfini öğrendin. İstediğin etkinliği tekrar oynayabilirsin.`
      : `Bütün etkinlikleri bitirdin! Şimdi ödül oyunu: ${game.title}!`
    : doneN === 0
      ? `“${letter}” harf adasına hoş geldin! Önce sesini dinleyelim.`
      : `Süper gidiyorsun! Sıradaki etkinlik: ${acts[nextIdx].title}.`

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
      <Backdrop kind="meadow" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton />
        <div className="mt-3 hidden md:block">
          <WoodSign icon="abc" color={color}>
            “{letter}” Harf Adası
          </WoodSign>
        </div>
        <Hud />
      </header>

      <div className="absolute inset-x-0 bottom-0 top-[96px] z-10 flex flex-col gap-4 overflow-y-auto px-3 pb-6 md:top-[112px] lg:flex-row lg:px-6">
        {/* harf kartı + Fındık */}
        <aside className="flex shrink-0 flex-row items-center gap-4 lg:w-[260px] lg:flex-col lg:items-stretch">
          <motion.button
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            onClick={() => speak(`${sound}. ${letter} harfi. Küçük ${letter}, büyük ${U}.`)}
            aria-label={`${letter} harfinin sesini dinle`}
            className="relative grid h-[150px] w-[150px] shrink-0 place-items-center rounded-[34px] text-white lg:h-[200px] lg:w-full"
            style={{ background: `radial-gradient(circle at 35% 25%, #ffffff66 0%, ${color} 45%, ${dark} 100%)`, boxShadow: `0 8px 0 ${dark}, 0 16px 26px rgba(0,0,0,0.22)`, border: '6px solid #fff' }}
          >
            <span className="mk-display leading-none" style={{ fontSize: 'clamp(70px, 9vw, 110px)', textShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
              {letter}
              <span className="ml-1 text-[0.6em] opacity-90">{U}</span>
            </span>
            <span className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow">
              <Obj name="speaker" size={26} shadow={false} />
            </span>
          </motion.button>
          <div className="flex flex-1 flex-col gap-2">
            <div className="mk-card p-3">
              <div className="mb-1 flex items-center justify-between text-[14px] font-black text-[var(--mk-ink-soft)]">
                <span>İlerleme</span>
                <span>
                  {doneN}/{acts.length}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#efe3c8]">
                <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(doneN / acts.length) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
              </div>
            </div>
            <div className="hidden flex-col items-center gap-1 lg:flex">
              <div className="w-full">
                <SpeechBubble tail="bottom" text={msg} size="sm" />
              </div>
              <Mascot pose={gameOpen ? 'cheer' : 'wave'} size={130} />
            </div>
            <div className="lg:hidden">
              <SpeechBubble tail="none" text={msg} size="sm" />
            </div>
          </div>
        </aside>

        {/* etkinlik yolu */}
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
                  transition={{ delay: 0.05 * k, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={!locked ? { y: -4 } : {}}
                  whileTap={!locked ? { scale: 0.96 } : {}}
                  onClick={() => open(g.id, locked)}
                  aria-label={`${k + 1}. ${g.title}${locked ? ', kilitli' : isDone ? `, ${best} yıldız` : ''}`}
                  className="relative flex min-h-[132px] flex-col items-center justify-center gap-1 rounded-[24px] p-3 text-center"
                  style={{
                    background: locked ? 'linear-gradient(180deg,#f3ecdf,#e6dac2)' : '#fffaf0',
                    boxShadow: isNext ? `0 0 0 4px ${color}, 0 6px 0 ${dark}` : locked ? '0 4px 0 #cdbf9f' : '0 5px 0 #e2cfa6',
                    opacity: locked ? 0.75 : 1,
                  }}
                >
                  <span className="mk-display absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full text-[16px] text-white" style={{ background: locked ? '#c9b48c' : color }}>
                    {k + 1}
                  </span>
                  {isNext && (
                    <motion.span className="absolute inset-0 rounded-[24px]" animate={{ boxShadow: [`0 0 0 0 ${color}66`, `0 0 0 14px ${color}00`] }} transition={{ duration: 1.4, repeat: Infinity }} />
                  )}
                  <span className={locked ? 'grayscale' : ''}>
                    <Obj name={g.icon} size={54} />
                  </span>
                  <span className="mk-display text-[18px] leading-tight">{g.title}</span>
                  {locked ? <Obj name="lock" size={22} shadow={false} /> : <Stars n={best} />}
                  {isDone && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--mk-green)] text-[14px] font-black text-white shadow">✓</span>}
                </motion.button>
              )
            })}

            {/* harf oyunu (ödül) */}
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * acts.length, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={gameOpen ? { y: -4, scale: 1.02 } : {}}
              whileTap={gameOpen ? { scale: 0.96 } : {}}
              onClick={() => open(game.id, !gameOpen)}
              aria-label={`Harf oyunu: ${game.title}${gameOpen ? '' : ', kilitli'}`}
              className="relative col-span-2 flex min-h-[132px] items-center justify-center gap-4 overflow-hidden rounded-[24px] p-4 text-white sm:col-span-3 xl:col-span-2"
              style={{
                background: gameOpen ? 'linear-gradient(135deg,#ffd75e 0%,#ffa62e 55%,#ff7a3d 100%)' : 'linear-gradient(135deg,#d9cdb6,#bfb196)',
                boxShadow: gameOpen ? '0 6px 0 #c76a12, 0 12px 24px rgba(200,110,20,0.35)' : '0 5px 0 #a8997c',
              }}
            >
              {gameOpen && (
                <motion.span
                  className="pointer-events-none absolute -inset-10"
                  style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.18) 0deg 12deg, rgba(255,255,255,0) 12deg 26deg)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <span className={`relative ${gameOpen ? '' : 'grayscale'}`}>
                <Obj name={gameOpen ? 'videogame' : 'lock'} size={70} />
              </span>
              <span className="relative flex flex-col items-start">
                <span className="text-[13px] font-black uppercase tracking-wider opacity-90">Harf Oyunu</span>
                <span className="mk-title text-[30px] leading-tight">{game.title}</span>
                {gameOpen ? <Stars n={gameResults[game.id]?.best ?? 0} size={20} /> : <span className="text-[14px] font-extrabold opacity-90">Bütün etkinlikleri bitirince açılır</span>}
              </span>
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  )
}
