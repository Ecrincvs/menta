/**
 * HAZİNE ODAM — rozet koleksiyonu + çıkartma albümü.
 * Altın burada anlam kazanır: çocuk kazandığı altınla İSTEDİĞİ çıkartmayı seçip alır (rastgele paket yok).
 * Gerçek para / uygulama içi satın alma yoktur; altın yalnızca oyun oynayarak kazanılır.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Backdrop } from '../components/Backdrop'
import { Hud } from '../components/Hud'
import { BackButton, CandyButton, WoodSign } from '../components/ui/Controls'
import { Obj } from '../components/ui/Obj'
import { Medal, TIER } from '../components/Medal'
import { Modal } from '../components/SettingsDialog'
import { badgesFor, type Badge } from '../rewards/badges'
import { STICKER_PAGES, stickerOwnedKey, type Sticker, type StickerPage } from '../rewards/stickers'
import { useGame } from '../state/store'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

type Tab = 'rozet' | 'album'

export function TreasureScreen({ initialTab = 'rozet' }: { initialTab?: Tab }) {
  const st = useGame()
  const [tab, setTab] = useState<Tab>(initialTab)
  const list = badgesFor(st.grade)
  const earnedN = list.filter((b) => st.badges[b.id]).length
  const stickersN = st.owned.filter((o) => o.startsWith('st:')).length
  const stickersAll = STICKER_PAGES.reduce((a, p) => a + p.items.length, 0)

  return (
    <div className="absolute inset-0">
      <Backdrop kind="glade" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:p-4">
        <BackButton />
        <div className="mt-3 hidden md:block">
          <WoodSign icon="trophy" color="#e8a40c">
            Hazine Odam
          </WoodSign>
        </div>
        <Hud />
      </header>

      <div className="absolute inset-x-0 bottom-0 top-[92px] z-10 flex flex-col items-center gap-3 px-3 pb-4 md:top-[112px]">
        {/* sekmeler */}
        <div className="mk-card flex gap-1 rounded-full p-1.5" role="tablist">
          {(
            [
              { id: 'rozet', label: 'Rozetlerim', icon: 'medal', count: `${earnedN}/${list.length}` },
              { id: 'album', label: 'Çıkartma Albümü', icon: 'book2', count: `${stickersN}/${stickersAll}` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                sfx('tap')
                setTab(t.id)
              }}
              className={`mk-display flex min-h-[54px] items-center gap-2 rounded-full px-4 text-[18px] transition ${tab === t.id ? 'bg-[var(--mk-purple)] text-white shadow-[0_4px_0_var(--mk-purple-dark)]' : ''}`}
            >
              <Obj name={t.icon} size={32} shadow={false} />
              {t.label}
              <span className={`rounded-full px-2 text-[14px] ${tab === t.id ? 'bg-white/25' : 'bg-[#f1e4c8]'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="w-full max-w-[1060px] flex-1 overflow-y-auto pb-2">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tab === 'rozet' ? <BadgeGrid list={list} earned={st.badges} /> : <Album />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────── ROZETLER
function BadgeGrid({ list, earned }: { list: Badge[]; earned: Record<string, string> }) {
  const st = useGame()
  const ctx = { grade: st.grade, stars: st.stars, letterIdx: st.letterIdx, sessions: st.sessions, gameResults: st.gameResults, owned: st.owned, treasureCount: st.treasureCount }
  const groups = Array.from(new Set(list.map((b) => b.group)))
  return (
    <div className="flex flex-col gap-4">
      {groups.map((g) => (
        <section key={g} className="mk-card p-3 sm:p-4">
          <h2 className="mk-display mb-2 text-[22px]">{g}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list
              .filter((b) => b.group === g)
              .map((b) => {
                const got = !!earned[b.id]
                const p = b.progress(ctx)
                const pct = Math.min(1, p.cur / p.target)
                return (
                  <motion.button
                    key={b.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      sfx('tap')
                      speak(got ? `${b.title} rozetini kazandın! ${b.desc}.` : `${b.title}: ${b.desc}. ${Math.max(0, p.target - p.cur)} tane kaldı.`)
                    }}
                    className={`relative flex flex-col items-center gap-1 rounded-[20px] p-3 text-center ${got ? 'bg-white' : 'bg-white/55'}`}
                    style={{ boxShadow: got ? `0 0 0 3px ${TIER[b.tier].rim[1]}, 0 5px 0 ${TIER[b.tier].rim[2]}` : '0 3px 0 #e2cfa6' }}
                    aria-label={`${b.title}. ${b.desc}. ${got ? 'Kazanıldı' : `${p.cur} / ${p.target}`}`}
                  >
                    <Medal icon={b.icon} tier={b.tier} earned={got} size={78} />
                    <span className="mk-display text-[17px] leading-tight">{b.title}</span>
                    <span className="text-[13px] font-bold leading-tight text-[var(--mk-ink-soft)]">{b.desc}</span>
                    {got ? (
                      <span className="mt-1 rounded-full bg-[var(--mk-pastel-mint)] px-2 text-[12px] font-black text-[var(--mk-green-dark)]">
                        Kazanıldı · {new Date(earned[b.id]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                    ) : (
                      <span className="mt-1 flex w-full items-center gap-1.5">
                        <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eadcbf]">
                          <span className="block h-full rounded-full" style={{ width: `${pct * 100}%`, background: TIER[b.tier].rim[1] }} />
                        </span>
                        <span className="text-[12px] font-black text-[var(--mk-ink-soft)]">
                          {Math.min(p.cur, p.target)}/{p.target}
                        </span>
                      </span>
                    )}
                    {!got && (
                      <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-[#fff3c4] px-1.5 text-[12px] font-black">
                        <Obj name="coin" size={14} shadow={false} />+{b.reward}
                      </span>
                    )}
                  </motion.button>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}

// ───────────────────────── ÇIKARTMA ALBÜMÜ
function Album() {
  const { owned, coins, buy } = useGame()
  const [pageId, setPageId] = useState(STICKER_PAGES[0].id)
  const [pick, setPick] = useState<{ s: Sticker; page: StickerPage } | null>(null)
  const [justGot, setJustGot] = useState<string | null>(null)
  const page = STICKER_PAGES.find((p) => p.id === pageId)!
  const have = page.items.filter((it) => owned.includes(stickerOwnedKey(it.id))).length
  const done = have === page.items.length

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {STICKER_PAGES.map((p) => {
          const n = p.items.filter((it) => owned.includes(stickerOwnedKey(it.id))).length
          const on = p.id === pageId
          return (
            <button
              key={p.id}
              onClick={() => {
                sfx('tap')
                setPageId(p.id)
              }}
              aria-pressed={on}
              className="mk-display flex min-h-[46px] items-center gap-1.5 rounded-full px-3.5 text-[16px] transition"
              style={on ? { background: p.color, color: '#fff', boxShadow: `0 4px 0 ${p.color}aa` } : { background: 'rgba(255,255,255,0.85)', boxShadow: '0 3px 0 #e2cfa6' }}
            >
              <Obj name={p.items[0].id} size={26} shadow={false} />
              {p.title}
              <span className={`rounded-full px-1.5 text-[12px] ${on ? 'bg-white/25' : 'bg-[#f1e4c8]'}`}>
                {n}/{p.items.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* albüm sayfası: kâğıt doku, köşebentler */}
      <motion.div key={page.id} initial={{ rotateY: -12, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="relative w-full max-w-[860px] rounded-[26px] p-4 sm:p-6" style={{ background: 'linear-gradient(180deg,#fffaf0,#f6ead2)', boxShadow: `0 0 0 6px ${page.color}, 0 12px 30px rgba(60,30,0,0.25)` }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="mk-title text-[30px]" style={{ color: page.color }}>
            {page.title}
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow">
            <Obj name="coin" size={24} shadow={false} />
            <span className="mk-display text-[16px]">Tanesi {page.price} altın</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {page.items.map((it, i) => {
            const got = owned.includes(stickerOwnedKey(it.id))
            return (
              <motion.button
                key={it.id}
                whileHover={!got ? { y: -4 } : {}}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  sfx('tap')
                  if (got) speak(it.label)
                  else setPick({ s: it, page })
                }}
                aria-label={got ? it.label : `${it.label}, ${page.price} altın`}
                className="relative flex aspect-square flex-col items-center justify-center rounded-[20px]"
                style={got ? { background: '#fff', transform: `rotate(${(i % 3) - 1}deg)`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' } : { border: '3px dashed #d9c49b', background: 'rgba(255,255,255,0.4)' }}
              >
                <motion.div initial={justGot === it.id ? { scale: 0, rotate: -30 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
                  <Obj name={it.id} size={84} shadow={got} style={got ? { filter: 'drop-shadow(0 0 0 #fff) drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)' } : { filter: 'grayscale(1) brightness(0.4)', opacity: 0.18 }} />
                </motion.div>
                <span className={`mk-display mt-1 text-[15px] ${got ? '' : 'text-[#b39a6c]'}`}>{got ? it.label : '?'}</span>
                {!got && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-[#fff3c4] px-1.5 text-[13px] font-black shadow-sm">
                    <Obj name="coin" size={16} shadow={false} />
                    {page.price}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
        {done && (
          <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mk-display mt-4 rounded-2xl bg-[var(--mk-pastel-mint)] p-3 text-center text-[20px] text-[var(--mk-green-dark)]">
            Bu sayfa tamamlandı! Harika bir koleksiyoncusun.
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {pick && (
          <BuySheet
            title={pick.s.label}
            icon={pick.s.id}
            price={pick.page.price}
            coins={coins}
            onCancel={() => setPick(null)}
            onBuy={() => {
              if (buy(stickerOwnedKey(pick.s.id), pick.page.price)) {
                sfx('coin')
                speak(`${pick.s.label} çıkartması albümüne eklendi!`)
                setJustGot(pick.s.id)
              }
              setPick(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/** Satın alma onayı (yalnızca kazanılmış altın) — avatar ekranında da kullanılır */
export function BuySheet({ title, icon, img, price, coins, onBuy, onCancel }: { title: string; icon?: string; img?: string; price: number; coins: number; onBuy: () => void; onCancel: () => void }) {
  const enough = coins >= price
  return (
    <Modal onClose={onCancel} label={`${title} al`}>
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: [0.6, 1.1, 1] }} transition={{ duration: 0.5 }}>
          {img ? <img src={img} alt="" className="h-[130px] w-[130px] object-contain" /> : <Obj name={icon ?? 'star'} size={120} />}
        </motion.div>
        <h2 className="mk-title text-[32px]">{title}</h2>
        <p className="flex items-center gap-1 text-[20px] font-extrabold">
          <Obj name="coin" size={30} shadow={false} /> {price} altın
          <span className="ml-2 text-[15px] font-bold text-[var(--mk-ink-soft)]">(sende {coins} var)</span>
        </p>
        {enough ? (
          <div className="flex gap-3">
            <CandyButton color="orange" onClick={onCancel}>
              Vazgeç
            </CandyButton>
            <CandyButton color="green" onClick={onBuy}>
              Al
            </CandyButton>
          </div>
        ) : (
          <>
            <p className="rounded-2xl bg-[var(--mk-pastel-peach)] p-3 text-[17px] font-extrabold">
              {price - coins} altın daha topla! Oyun oynadıkça ve rozet kazandıkça altının artar.
            </p>
            <CandyButton color="sky" onClick={onCancel}>
              Tamam
            </CandyButton>
          </>
        )}
      </div>
    </Modal>
  )
}
