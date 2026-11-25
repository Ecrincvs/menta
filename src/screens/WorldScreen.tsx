import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Hud } from '../components/Hud'
import { Logo } from '../components/Logo'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Obj } from '../components/ui/Obj'
import { Mascot, type MascotPose } from '../characters/Mascot'
import { SUBJECTS, subjectOpenFor } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { GRADES } from '../content/grades'
import { gameById } from '../content/games'
import { ENTER_MS } from '../world/enter'
import type { ReactNode } from 'react'

/**
 * ANA DÜNYA — 3D sahnenin üzerindeki arayüz katmanı.
 * Bina seçimi (3D'deki bina veya etiket) → kamera yaklaşır → ders dünyasına geçiş.
 */
export function WorldOverlay({ focus, setFocus }: { focus: SubjectId | null; setFocus: (s: SubjectId | null) => void }) {
  const { go, grade, sessions, setGrade } = useGame()
  const gm = GRADES.find((g) => g.grade === grade)
  const [msg, setMsg] = useState(gm ? `${gm.world}'ne hoş geldin! Bir binaya dokun ve keşfe başla.` : 'Bir binaya dokun ve keşfe başla!')
  const [pose, setPose] = useState<MascotPose>('wave')
  // balon binaların önünü kapatmasın: birkaç saniye görünür, sonra kaybolur (Fındık'a dokununca tekrar çıkar)
  const [balon, setBalon] = useState(true)
  useEffect(() => {
    setBalon(true)
    const t = setTimeout(() => setBalon(false), 6000)
    return () => clearTimeout(t)
  }, [msg])
  const [menuOpen, setMenuOpen] = useState(false)
  const world3d = useGame((s) => s.settings.world3d)
  // menüden sınıf değişince Fındık yeni dünyayı karşılasın
  const ilkSinif = useRef(grade)
  useEffect(() => {
    if (ilkSinif.current === grade || !gm) return
    ilkSinif.current = grade
    setPose('cheer')
    setMsg(`${gm.label}! ${gm.world}'ne hoş geldin! Bir binaya dokun ve keşfe başla.`)
  }, [grade]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onSel = (e: Event) => {
      const id = (e as CustomEvent<SubjectId>).detail
      const s = SUBJECTS.find((x) => x.id === id)!
      const g = useGame.getState().grade
      if (!subjectOpenFor(id, g)) {
        sfx('wrong')
        setPose('think')
        setMsg(`${s.short} dersi ${s.grades[0]}. sınıfta başlıyor! Şimdilik senin sınıfının dünyalarını keşfedelim.`)
        return
      }
      sfx('whoosh')
      setPose('cheer')
      setMsg(`Hadi ${s.name}'na gidelim!`)
      setFocus(id)
      // boyanmış dünyada kapıdan giriş geçişi bitince (3D dünyada kamera uçuşu) ders dünyasına geç
      const painted = !useGame.getState().settings.world3d
      setTimeout(() => go({ name: 'subject', subject: id }), painted ? ENTER_MS : 1100)
    }
    const onTreasure = () => {
      setPose('cheer')
      setMsg('Vay! Gizli bir hazine buldun: +15 altın! Dünyada başka sandıklar da saklanıyor olabilir...')
      setTimeout(() => setPose('idle'), 2500)
    }
    window.addEventListener('mk-select', onSel)
    window.addEventListener('mk-treasure', onTreasure)
    return () => {
      window.removeEventListener('mk-select', onSel)
      window.removeEventListener('mk-treasure', onTreasure)
    }
  }, [go, setFocus])

  useEffect(() => {
    if (pose === 'wave') {
      const t = setTimeout(() => setPose('idle'), 3000)
      return () => clearTimeout(t)
    }
  }, [pose])

  // günlük görevler: bugünkü oyunlardan türetilir (en fazla 3, ödül öğrenmeye bağlı)
  const today = new Date().toISOString().slice(0, 10)
  const todays = sessions.filter((s) => s.date.slice(0, 10) === today)
  const quests = [
    { id: 'turkce', label: '1 Türkçe oyunu', icon: 'openbook', done: todays.some((s) => gameById(s.gameId)?.subject === 'turkce') },
    { id: 'mat', label: '1 Matematik oyunu', icon: 'abacus', done: todays.some((s) => gameById(s.gameId)?.subject === 'matematik') },
    { id: 'star3', label: '3 yıldız kazan', icon: 'star', done: todays.some((s) => s.stars === 3) },
  ]
  const allDone = quests.every((q) => q.done)
  // bugün kazanılan rozet sayısı (Hazinem düğmesinde rozet işareti)
  const badges = useGame((s) => s.badges)
  const newBadges = Object.values(badges).filter((d) => d.slice(0, 10) === today).length
  const doneN = quests.filter((q) => q.done).length
  // menü öğesi: önce paneli kapat, sonra git (geçiş animasyonu üst üste binmesin)
  const open = (fn: () => void) => {
    sfx('whoosh')
    setMenuOpen(false)
    setTimeout(fn, 180)
  }
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <motion.div className="absolute inset-0" style={{ pointerEvents: 'none' }} animate={{ opacity: focus && !world3d ? 0 : 1 }} transition={{ duration: 0.35 }}>
      <div className="absolute left-3 top-2 origin-top-left scale-[0.8] sm:left-5 sm:top-3 sm:scale-100" style={{ pointerEvents: 'auto' }}>
        <Logo size="sm" />
      </div>
      <div className="absolute right-3 top-3 z-30 sm:right-5" style={{ pointerEvents: 'auto' }}>
        <Hud />
      </div>

      {/* Fındık + mesaj */}
      <motion.div
        className="absolute bottom-0 left-0 flex items-end"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 140, damping: 16 }}
        style={{ pointerEvents: 'auto' }}
      >
        <button
          aria-label="Fındık"
          onClick={() => {
            sfx('pop')
            setPose('jump')
            setTimeout(() => setPose('idle'), 1100)
            setBalon((b) => !b)
          }}
        >
          <Mascot pose={pose} size={Math.min(190, window.innerWidth * 0.17)} />
        </button>
        <AnimatePresence>
          {balon && (
            <motion.div
              key="balon"
              initial={{ opacity: 0, scale: 0.85, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -10 }}
              className="mb-[clamp(40px,7vh,80px)] -ml-3 w-max max-w-[min(300px,40vw)] origin-left"
            >
              <SpeechBubble tail="left" text={msg} size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* YAN MENÜ: sağ kenardaki "Menü" düğmesi → yandan açılan panel (dünyalar, hazine, görevler, kaşif) */}
      <motion.button
        initial={{ x: 120 }}
        animate={{ x: menuOpen ? 120 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: menuOpen ? 0 : 0.5 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          sfx('tap')
          setMenuOpen(true)
        }}
        aria-expanded={menuOpen}
        aria-controls="yan-menu"
        aria-label="Menüyü aç"
        className="absolute right-0 top-1/2 z-30 flex flex-col items-center gap-1 rounded-l-[26px] py-4 pl-3 pr-2.5 text-white"
        style={{ y: '-50%', pointerEvents: 'auto', background: 'linear-gradient(180deg,#8e6cf0,#6b43c4)', boxShadow: '-4px 6px 0 #4a2c9a, -6px 10px 22px rgba(30,10,70,0.35)', border: '3px solid #d9c8ff', borderRight: 'none' }}
      >
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden>
            <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {(newBadges > 0 || doneN < 3) && (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-[var(--mk-red)] px-1 text-[12px] font-black">{newBadges > 0 ? newBadges : '!'}</span>
          )}
        </span>
        <span className="mk-display text-[16px] leading-none">Menü</span>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="absolute inset-0 z-40 bg-[rgba(30,20,60,0.35)] backdrop-blur-[2px]"
              style={{ pointerEvents: 'auto' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              id="yan-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menü"
              className="absolute bottom-0 right-0 top-0 z-50 flex w-[min(380px,92vw)] flex-col gap-3 overflow-y-auto p-4"
              style={{ pointerEvents: 'auto', background: 'linear-gradient(180deg,#fffaf0 0%,#fbefd6 100%)', boxShadow: '-10px 0 40px rgba(30,10,60,0.35)', borderLeft: '5px solid #d9b77a', borderRadius: '28px 0 0 28px' }}
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="mk-title text-[32px]">Menü</h2>
                <button
                  onClick={() => {
                    sfx('tap')
                    setMenuOpen(false)
                  }}
                  aria-label="Menüyü kapat"
                  className="grid h-12 w-12 place-items-center rounded-full bg-white text-[24px] font-black text-[var(--mk-ink-soft)] shadow-[0_3px_0_#e2cfa6] active:scale-90"
                >
                  ✕
                </button>
              </div>

              <MenuGroup title="Sınıfım">
                <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Sınıf seç">
                  {GRADES.map((g) => {
                    const aktif = g.grade === grade
                    return (
                      <motion.button
                        key={g.grade}
                        role="radio"
                        aria-checked={aktif}
                        aria-label={`${g.label} · ${g.world}`}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          if (aktif) return
                          sfx('unlock')
                          setGrade(g.grade)
                          setMenuOpen(false)
                        }}
                        className="flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-center"
                        style={{
                          background: aktif ? g.color : '#fff',
                          color: aktif ? '#fff' : 'var(--mk-ink)',
                          boxShadow: aktif ? `0 4px 0 ${g.colorDark}, 0 0 0 3px #fff, 0 0 0 5px ${g.color}` : '0 3px 0 #e2cfa6',
                        }}
                      >
                        <span className="mk-display text-[24px] leading-none">{g.grade}.</span>
                        <span className="mk-display text-[15px] leading-none">Sınıf</span>
                        <span className="mt-0.5 text-[10px] font-bold leading-tight opacity-80">{g.world}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </MenuGroup>

              <MenuGroup title="Yarış">
                <MenuItem icon="trophy" bg="#ece2ff" label="Yarışma Modu" sub="Arkadaşlarınla bilgi yarışması" onClick={() => open(() => go({ name: 'yarisma' }))} />
              </MenuGroup>


              <MenuGroup title="Günlük Görevler" right={`${doneN}/3`}>
                <div className="flex flex-col gap-1.5 rounded-2xl bg-white/70 p-2">
                  {quests.map((q) => (
                    <div key={q.id} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${q.done ? 'bg-[var(--mk-pastel-mint)]' : ''}`}>
                      <Obj name={q.icon} size={28} shadow={false} />
                      <span className={`flex-1 text-[16px] font-extrabold ${q.done ? 'text-[var(--mk-green-dark)] line-through' : ''}`}>{q.label}</span>
                      <span className={`grid h-7 w-7 place-items-center rounded-full text-[15px] font-black text-white ${q.done ? 'bg-[var(--mk-green)]' : 'bg-[#e3d2ae]'}`}>{q.done ? '✓' : ''}</span>
                    </div>
                  ))}
                  {allDone && <p className="px-2 text-[14px] font-extrabold text-[var(--mk-green-dark)]">Bugünlük harika iş! Biraz dinlenme zamanı.</p>}
                </div>
              </MenuGroup>

              <MenuGroup title="Benim Köşem">
                <MenuItem icon="trophy" bg="#fff1c2" label="Hazine Odam" sub="Rozetler ve çıkartma albümü" badge={newBadges} onClick={() => open(() => go({ name: 'hazine' }))} />
                <MenuItem icon="paint" bg="#efe6ff" label="Kaşifimi Tasarla" sub="Kaşif, evcil dost, arka plan" onClick={() => open(() => go({ name: 'avatar' }))} />
              </MenuGroup>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 3D dünyada beyaz geçiş; boyanmış dünyada kapı + ışık geçişi PaintedWorld içinde */}
        {focus && world3d && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9] }}
            transition={{ duration: 1.1, times: [0, 0.6, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MenuGroup({ title, right, children }: { title: string; right?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center justify-between px-1 text-[13px] font-black uppercase tracking-wider text-[var(--mk-ink-soft)]">
        {title}
        {right && <span className="rounded-full bg-white px-2 py-0.5 text-[13px] shadow-sm">{right}</span>}
      </h3>
      {children}
    </section>
  )
}

function MenuItem({ icon, bg, label, sub, badge, onClick }: { icon: string; bg: string; label: string; sub: string; badge?: number; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-label={label}
      className="flex min-h-[66px] items-center gap-3 rounded-2xl bg-white px-2.5 py-2 text-left shadow-[0_3px_0_#e2cfa6]"
    >
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: bg }}>
        <Obj name={icon} size={36} shadow={false} />
        {!!badge && <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-[var(--mk-red)] px-1 text-[12px] font-black text-white">{badge}</span>}
      </span>
      <span className="flex flex-1 flex-col">
        <span className="mk-display text-[19px] leading-tight">{label}</span>
        <span className="text-[13px] font-bold text-[var(--mk-ink-soft)]">{sub}</span>
      </span>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M9 5l7 7-7 7" stroke="#c9a978" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}
