import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Backdrop, type BackdropKind } from '../components/Backdrop'
import { Hud } from '../components/Hud'
import { BackButton, WoodSign } from '../components/ui/Controls'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Avatar } from '../characters/Avatar'
import { Mascot } from '../characters/Mascot'
import { Robo } from '../characters/Robo'
import { gamesFor, themeFor } from '../content/games'
import { subjectById } from '../content/subjects'
import { GRADES } from '../content/grades'
import type { GameMeta, Grade, SubjectId } from '../content/types'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { mastery } from '../learning/mastery'
import { HarfYolu } from '../components/HarfYolu'
import { LETTER_ORDER } from '../content/letters'
import { speak } from '../audio/speech'
import { yolFor, type Yol } from '../content/yollar'
import { Obj as LockIcon } from '../components/ui/Obj'

const SUBJECT_BG: Record<SubjectId, BackdropKind> = { turkce: 'forest', matematik: 'park', fen: 'lab', hayat: 'town', tarih: 'history' }
const WELCOME: Record<SubjectId, string> = {
  turkce: 'Masal Ormanı’na hoş geldin! Bir okuma ya da kelime macerası seç.',
  matematik: 'Sayılar Macera Parkı’na hoş geldin! Hangi görevle başlayalım?',
  fen: 'Keşif Laboratuvarı’na hoş geldin! Bugün neyi araştıralım?',
  hayat: 'Mutlu Mahalle’ye hoş geldin! Güvenli ve sağlıklı yaşamı keşfedelim.',
  tarih: 'Zaman Makinesi Kalesi’ne hoş geldin! Haritalar ve tarih seni bekliyor.',
}

export function SubjectScreen({ subject }: { subject: SubjectId }) {
  const { grade, go, home, gameResults, skills } = useGame()
  const s = subjectById(subject)
  const g = (grade ?? 1) as Grade
  const games = gamesFor(subject, g)
  const gm = GRADES.find((x) => x.grade === g)!
  const [msg, setMsg] = useState(WELCOME[subject])
  const letterIdx = useGame((st) => st.letterIdx)
  const lockedBy = (game: GameMeta) => (g === 1 && game.minLetter && LETTER_ORDER.indexOf(game.minLetter) > letterIdx ? game.minLetter : null)

  // program temalarına göre grupla
  const groups = useMemo(() => {
    const m = new Map<string, GameMeta[]>()
    for (const game of games) {
      const t = themeFor(game, g) || 'Etkinlikler'
      m.set(t, [...(m.get(t) ?? []), game])
    }
    // kitaptaki tema sırası: başlıktaki numaraya göre (numarasızlar başta)
    const num = (t: string) => Number(t.match(/^(d+)./)?.[1] ?? 0)
    return [...m.entries()].sort((a, b) => num(a[0]) - num(b[0]))
  }, [games, g])

  const open = (game: GameMeta) => {
    const lk = lockedBy(game)
    if (lk) {
      sfx('wrong')
      const t = lk === 'j' ? `${game.title} tüm harfleri öğrenince açılacak!` : `${game.title} “${lk}” harfini öğrenince açılacak!`
      setMsg(t)
      speak(t)
      return
    }
    sfx('whoosh')
    go({ name: 'game', gameId: game.id })
  }

  let idx = 0
  return (
    <div className="absolute inset-0">
      <Backdrop kind={SUBJECT_BG[subject]} />

      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton onClick={home} label="Dünyaya dön" />
        <div className="mt-3 hidden md:block">
          <WoodSign icon={s.icon} color={s.accent}>
            {s.name}
          </WoodSign>
        </div>
        <Hud />
      </header>
      <div className="absolute left-1/2 top-[86px] z-10 -translate-x-1/2 md:hidden">
        <WoodSign icon={s.icon} color={s.accent}>
          {s.short}
        </WoodSign>
      </div>

      {/* rehber karakter */}
      <motion.div
        className="absolute bottom-0 left-[1%] z-30 hidden w-[230px] flex-col items-start sm:flex lg:w-[255px]"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 16 }}
      >
        <div className="mb-2 w-full">
          <SpeechBubble tail="bottom" text={msg} size="sm" />
        </div>
        {subject === 'matematik' ? (
          <Robo pose="wave" size={190} />
        ) : subject === 'turkce' || subject === 'hayat' ? (
          <Avatar artId={`sinif${g}` as const} config={gm.avatar} pose="wave" size={180} />
        ) : (
          <Mascot pose="wave" size={190} />
        )}
      </motion.div>

      {/* tema grupları + oyun kartları */}
      <div className="absolute inset-x-0 bottom-0 top-[150px] z-10 overflow-y-auto px-4 pb-6 sm:left-[230px] sm:right-4 md:top-[112px] lg:left-[260px]">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-4 pt-2">
          {g === 1 && subject === 'turkce' && (
            <motion.button
              onClick={() => {
                sfx('whoosh')
                go({ name: 'okuma-yazma' })
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 rounded-[28px] border-4 border-[#e8463c] bg-[linear-gradient(135deg,#fff3d1,#ffd9c7)] p-4 text-left shadow-[0_8px_0_#b8302c,0_16px_28px_rgba(0,0,0,0.25)]"
              aria-label="Okuma Yazma Yolu"
            >
              <Obj name="abc" size={84} />
              <span className="flex flex-1 flex-col">
                <span className="mk-display text-[clamp(24px,3vw,34px)] leading-none text-[#b8302c]">Okuma Yazma Yolu</span>
                <span className="mt-1 text-[15px] font-extrabold text-[var(--mk-ink-soft)]">Harf harf öğren: sesi tanı, harfi yaz, hece ve kelime oku, cümle kur. 29 durak!</span>
              </span>
              <span className="mk-candy !min-h-[56px] !px-6 !text-[20px]" style={{ ['--c' as string]: 'var(--mk-red)', ['--c-dark' as string]: 'var(--mk-red-dark)' }}>Başla</span>
            </motion.button>
          )}
          {g === 1 && subject === 'matematik' && (
            <motion.button
              onClick={() => {
                sfx('whoosh')
                go({ name: 'matematik-yolu' })
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 rounded-[28px] border-4 border-[#9b6ef3] bg-[linear-gradient(135deg,#f3ecff,#dcd0ff)] p-4 text-left shadow-[0_8px_0_#6b43c4,0_16px_28px_rgba(0,0,0,0.25)]"
              aria-label="Matematik Yolu"
            >
              <Obj name="abacus" size={84} />
              <span className="flex flex-1 flex-col">
                <span className="mk-display text-[clamp(24px,3vw,34px)] leading-none text-[#6b43c4]">Matematik Yolu</span>
                <span className="mt-1 text-[15px] font-extrabold text-[var(--mk-ink-soft)]">Kitaptaki 7 tema, adım adım: sayılar, ölçme, toplama–çıkarma, para, şekiller, veri. 70+ etkinlik ve oyunlar!</span>
              </span>
              <span className="mk-candy !min-h-[56px] !px-6 !text-[20px]" style={{ ['--c' as string]: 'var(--mk-purple)', ['--c-dark' as string]: 'var(--mk-purple-dark)' }}>Başla</span>
            </motion.button>
          )}
          {g === 1 && subject === 'hayat' && (
            <motion.button
              onClick={() => {
                sfx('whoosh')
                go({ name: 'hayat-yolu' })
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 rounded-[28px] border-4 border-[#f08a24] bg-[linear-gradient(135deg,#fff4dc,#ffdcb8)] p-4 text-left shadow-[0_8px_0_#b85f0c,0_16px_28px_rgba(0,0,0,0.25)]"
              aria-label="Hayat Bilgisi Yolu"
            >
              <Obj name="housegarden" size={84} />
              <span className="flex flex-1 flex-col">
                <span className="mk-display text-[clamp(24px,3vw,34px)] leading-none text-[#b85f0c]">Hayat Bilgisi Yolu</span>
                <span className="mt-1 text-[15px] font-extrabold text-[var(--mk-ink-soft)]">Kitaptaki 6 öğrenme alanı, konu konu: okulum, sağlığım, ailem, ülkem, doğa, bilim ve sanat. Bol etkinlik ve oyun!</span>
              </span>
              <span className="mk-candy !min-h-[56px] !px-6 !text-[20px]" style={{ ['--c' as string]: 'var(--mk-orange)', ['--c-dark' as string]: 'var(--mk-orange-dark)' }}>Başla</span>
            </motion.button>
          )}
          {(() => {
            const y = yolFor(subject, g)
            return y ? <YolBandi y={y} /> : null
          })()}
          {g === 1 && subject === 'turkce' && <HarfYolu />}
          {groups.map(([theme, list]) => (
            <section key={theme}>
              <h2 className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1 shadow" style={{ color: s.accentDark }}>
                <span className="text-[12px] font-black uppercase tracking-wide opacity-70">Tema</span>
                <span className="mk-display text-[18px]">{theme}</span>
              </h2>
              <div className="grid grid-cols-2 gap-[clamp(10px,1.6vw,20px)] md:grid-cols-3 xl:grid-cols-4">
                {list.map((game) => {
                  const i = idx++
                  const best = gameResults[game.id]?.best ?? 0
                  const m = mastery(skills[game.skill])
                  const codes = game.meb[g]
                  const lk = lockedBy(game)
                  return (
                    <motion.button
                      key={game.id}
                      initial={{ y: 50, opacity: 0, scale: 0.85 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.12 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                      whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => open(game)}
                      aria-label={game.title}
                      className="relative flex aspect-[5/4] flex-col items-center justify-center gap-1 rounded-[26px] p-3 pb-6 text-center"
                      style={{
                        background: `linear-gradient(180deg, rgba(255,253,246,0.97) 0%, ${game.tint} 100%)`,
                        border: `4px solid ${s.accent}`,
                        boxShadow: `inset 0 3px 0 #fff, 0 7px 0 ${s.accentDark}, 0 16px 28px rgba(0,0,0,0.25)`,
                      }}
                    >
                      <div className="mk-float">
                        <Obj name={game.icon} size={'clamp(52px, 6.5vw, 80px)'} />
                      </div>
                      <span className="mk-display text-[clamp(17px,1.9vw,23px)] leading-[1.05] text-ink">{game.title}</span>
                      <span className="text-[clamp(12px,1.2vw,14px)] font-extrabold leading-tight text-[var(--mk-ink-soft)]">{game.blurb}</span>
                      <div className="mt-0.5 flex gap-0.5" aria-label={`En iyi: ${best} yıldız`}>
                        {[1, 2, 3].map((k) => (
                          <svg key={k} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                            <path d="M12 1.5 L14.9 8.6 L22.5 9.2 L16.7 14.1 L18.5 21.6 L12 17.6 L5.5 21.6 L7.3 14.1 L1.5 9.2 L9.1 8.6 Z" fill={k <= best ? '#ffd23f' : '#eadcc0'} stroke={k <= best ? '#e8a40c' : '#d6c39e'} strokeWidth="1.5" />
                          </svg>
                        ))}
                      </div>
                      {codes && codes.length > 0 && (
                        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-[var(--mk-ink-soft)] shadow" title="MEB öğrenme çıktısı">
                          {codes[0]}
                        </span>
                      )}
                      {lk && (
                        <span className="absolute inset-0 grid place-items-center rounded-[22px] bg-[rgba(255,250,240,0.72)]">
                          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow">
                            <LockIcon name="lock" size={22} shadow={false} />
                            <span className="mk-display text-[14px] text-[var(--mk-ink-soft)]">{lk === 'j' ? 'Tüm harflerden sonra' : `“${lk}” harfinden sonra`}</span>
                          </span>
                        </span>
                      )}
                      {m > 0 && <span className="absolute left-2 top-2 rounded-full bg-[var(--mk-green)] px-2 py-0.5 text-[11px] font-black text-white shadow">Ustalık %{Math.round(m * 100)}</span>}
                      <span className="mk-candy absolute -bottom-4 !min-h-[38px] !px-4 !text-[17px]" style={{ ['--c' as string]: 'var(--mk-green)', ['--c-dark' as string]: 'var(--mk-green-dark)', ['--mk-depth' as string]: '4px' }}>
                        Oyna
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 2. sınıf ve sonrası: dersin kitap yolu bandı */
function YolBandi({ y }: { y: Yol }) {
  const go = useGame((st) => st.go)
  const etkinlik = y.adalar.reduce((n, a) => n + a.acts.filter((x) => !x.oyun).length, 0)
  const oyun = y.adalar.reduce((n, a) => n + a.acts.filter((x) => x.oyun).length, 0)
  return (
    <motion.button
      onClick={() => {
        sfx('whoosh')
        go({ name: 'yol', yol: y.id })
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-4 rounded-[28px] border-4 p-4 text-left"
      style={{ borderColor: y.renk, background: `linear-gradient(135deg,#fffaf0,${y.renk}33)`, boxShadow: `0 8px 0 ${y.koyu},0 16px 28px rgba(0,0,0,0.25)` }}
      aria-label={y.baslik}
    >
      <Obj name={y.icon} size={84} />
      <span className="flex flex-1 flex-col">
        <span className="mk-display text-[clamp(24px,3vw,34px)] leading-none" style={{ color: y.koyu }}>
          {y.sinif}. Sınıf {y.baslik}
        </span>
        <span className="mt-1 text-[15px] font-extrabold text-[var(--mk-ink-soft)]">
          {y.aciklama} {y.adalar.length} ada · {etkinlik} etkinlik · {oyun} oyun
        </span>
      </span>
      <span className="mk-candy !min-h-[56px] !px-6 !text-[20px]" style={{ ['--c' as string]: y.renk, ['--c-dark' as string]: y.koyu }}>
        Başla
      </span>
    </motion.button>
  )
}
