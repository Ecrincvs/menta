import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
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

/**
 * ANA DÜNYA — 3D sahnenin üzerindeki arayüz katmanı.
 * Bina seçimi (3D'deki bina veya etiket) → kamera yaklaşır → ders dünyasına geçiş.
 */
export function WorldOverlay({ focus, setFocus }: { focus: SubjectId | null; setFocus: (s: SubjectId | null) => void }) {
  const { go, grade, sessions } = useGame()
  const gm = GRADES.find((g) => g.grade === grade)
  const [msg, setMsg] = useState(gm ? `${gm.world}'ne hoş geldin! Bir binaya dokun ve keşfe başla.` : 'Bir binaya dokun ve keşfe başla!')
  const [pose, setPose] = useState<MascotPose>('wave')
  const [questsOpen, setQuestsOpen] = useState(false)

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
      setTimeout(() => go({ name: 'subject', subject: id }), 1100)
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

  return (
    <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
      <div className="absolute left-3 top-2 origin-top-left scale-[0.8] sm:left-5 sm:top-3 sm:scale-100" style={{ pointerEvents: 'auto' }}>
        <Logo size="sm" />
      </div>
      <div className="absolute right-3 top-3 z-30 sm:right-5" style={{ pointerEvents: 'auto' }}>
        <Hud />
      </div>

      {/* günlük görevler: açılır rozet (dünya tabelalarını kapatmaz) */}
      <div className="absolute bottom-[86px] right-3 z-20 flex flex-col items-end gap-2" style={{ pointerEvents: 'auto' }}>
        <AnimatePresence>
          {questsOpen && (
            <motion.aside
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="mk-card flex w-[240px] flex-col gap-1.5 p-3"
              aria-label="Günlük görevler"
            >
              {quests.map((q) => (
                <div key={q.id} className={`flex items-center gap-2 rounded-xl px-2 py-1 ${q.done ? 'bg-[var(--mk-pastel-mint)]' : 'bg-white/60'}`}>
                  <Obj name={q.icon} size={26} shadow={false} />
                  <span className={`flex-1 text-[15px] font-extrabold ${q.done ? 'text-[var(--mk-green-dark)] line-through' : ''}`}>{q.label}</span>
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-[14px] font-black text-white ${q.done ? 'bg-[var(--mk-green)]' : 'bg-[#e3d2ae]'}`}>{q.done ? '✓' : ''}</span>
                </div>
              ))}
              {allDone && <p className="text-center text-[14px] font-extrabold text-[var(--mk-green-dark)]">Bugünlük harika iş! Biraz dinlenme zamanı.</p>}
            </motion.aside>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            sfx('tap')
            setQuestsOpen((o) => !o)
          }}
          aria-expanded={questsOpen}
          className="mk-card flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 transition active:scale-95"
        >
          <Obj name="map" size={34} shadow={false} />
          <span className="mk-display text-[17px]">Görevler {quests.filter((q) => q.done).length}/3</span>
        </button>
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
          }}
        >
          <Mascot pose={pose} size={Math.min(190, window.innerWidth * 0.17)} />
        </button>
        <div className="mb-[clamp(90px,14vh,150px)] -ml-2 max-w-[min(420px,48vw)]">
          <SpeechBubble tail="left" text={msg} />
        </div>
      </motion.div>

      {/* hızlı erişim düğmeleri (erişilebilirlik: 3D'ye dokunmadan da ders seçilebilsin) */}
      <nav className="absolute bottom-3 right-3 flex gap-2" style={{ pointerEvents: 'auto' }} aria-label="Dünyalar">
        {grade === 1 && (
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              sfx('whoosh')
              go({ name: 'okuma-yazma' })
            }}
            className="mk-card flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4"
            style={{ borderColor: '#e8463c' }}
            aria-label="Okuma Yazma Yolu"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ffe3d9]">
              <Obj name="abc" size={36} shadow={false} />
            </span>
            <span className="mk-display hidden text-[18px] lg:inline">Okuma Yazma</span>
          </motion.button>
        )}
        {SUBJECTS.filter((s) => subjectOpenFor(s.id, grade)).map((s) => (
          <motion.button
            key={s.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.dispatchEvent(new CustomEvent('mk-select', { detail: s.id }))}
            className="mk-card flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4"
            style={{ borderColor: s.accent }}
            aria-label={s.name}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: s.pastel }}>
              <Obj name={s.icon} size={36} shadow={false} />
            </span>
            <span className="mk-display hidden text-[18px] lg:inline">{s.short}</span>
          </motion.button>
        ))}
      </nav>

      <AnimatePresence>
        {focus && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9] }}
            transition={{ duration: 1.1, times: [0, 0.6, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
