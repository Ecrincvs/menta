/**
 * KARAKTERİNİ ÖZELLEŞTİR — referans: docs/reference/karakter-referans.png
 * Sol: kategori menüsü · Orta: platformdaki kaşif + evcil dost · Sağ: mor cam paneller, altın onaylı karolar.
 * Yalnızca hazır kaşifler (Pixar kalitesinde raster) + evcil dost, özel özellik, arka plan.
 * Kilitli parçalar oyunlardan kazanılan yıldızlarla açılır (satın alma yok).
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Backdrop } from '../components/Backdrop'
import { BackButton } from '../components/ui/Controls'
import { Obj } from '../components/ui/Obj'
import { Avatar, type AvatarPose } from '../characters/Avatar'
import { BACKGROUNDS, MAX_TRAITS, PETS, PRESETS, TRAITS, normalizeAvatar, type AvatarConfig } from '../characters/avatarTypes'
import { useArt, artUrl, useBackgroundArt, useCharacterArt, type BackgroundId } from '../art/artRegistry'
import type { BackdropKind } from '../components/Backdrop'
import { useGame } from '../state/store'
import { BuySheet } from './TreasureScreen'
import { sfx } from '../audio/sfx'
import { speak } from '../audio/speech'

type Cat = 'genel' | 'evcil' | 'ozellik' | 'arkaplan'
const CATS: { id: Cat; label: string; icon: string }[] = [
  { id: 'genel', label: 'Genel', icon: 'walking' },
  { id: 'evcil', label: 'Evcil Dost', icon: 'paw' },
  { id: 'ozellik', label: 'Özel Özellik', icon: 'star' },
  { id: 'arkaplan', label: 'Arka Plan', icon: 'mountain' },
]

// referans paleti: gece moru cam paneller, lavanta karolar, altın seçim
const C = {
  panel: 'linear-gradient(180deg, rgba(104,72,196,0.93) 0%, rgba(72,44,150,0.93) 100%)',
  panelEdge: 'rgba(196,170,255,0.55)',
  tile: 'linear-gradient(180deg,#faf6ff 0%,#e6dafc 100%)',
  tileEdge: '#c9b6f2',
  gold: '#ffc533',
  goldDark: '#d99a12',
}

export function AvatarScreen() {
  const { avatar, setAvatar, coins, owned, buy, nickname, setNickname, back, grade, go } = useGame()
  const [shop, setShop] = useState<{ key: string; label: string; price: number; img?: string; apply: () => void } | null>(null)
  const [draft, setDraft] = useState<AvatarConfig>(() => normalizeAvatar(avatar))
  const [cat, setCat] = useState<Cat>('genel')
  const [name, setName] = useState(nickname)
  const [pose, setPose] = useState<AvatarPose>('wave')
  const [bump, setBump] = useState(0)

  const cheer = () => {
    setBump((b) => b + 1)
    setPose('cheer')
    window.setTimeout(() => setPose('idle'), 900)
  }
  /** hazır kaşifi koruyan değişiklik (evcil dost, özellik, arka plan, hazır kaşif seçimi) */
  const set = (patch: Partial<AvatarConfig>) => {
    sfx('pop')
    setDraft((d) => ({ ...d, ...patch }))
    cheer()
  }
  /** ücretsizse ya da daha önce alındıysa uygula; değilse altınla alma onayını aç */
  const acquire: AcquireFn = (key, price, label, apply, img) => {
    if (price === 0 || owned.includes(key)) apply()
    else {
      sfx('tap')
      setShop({ key, label, price, img, apply })
    }
  }
  const has = (key: string, price: number) => price === 0 || owned.includes(key)

  const save = () => {
    sfx('fanfare')
    setAvatar(draft)
    setNickname(name.trim() || 'Kaşif')
    speak('Harika görünüyorsun kaşif!')
    if (grade === null) go({ name: 'grade' })
    else back()
  }

  const surprise = () => {
    const r = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    const pets = PETS.filter((p) => has(`pet:${p.id}`, p.cost))
    const bgs = BACKGROUNDS.filter((b) => has(`bg:${b.id}`, b.cost))
    set({ preset: r(PRESETS).id, pet: r(pets).id, bg: r(bgs).id })
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a1a5e]">
      <SceneBackground bg={draft.bg} />

      {/* başlık */}
      <header className="absolute left-0 right-0 top-0 z-30 flex items-start gap-3 p-3 sm:p-4 lg:right-auto">
        <BackButton />
        <div className="mt-1 flex flex-col items-center">
          <motion.div initial={{ y: -60, rotate: -3, opacity: 0 }} animate={{ y: 0, rotate: -2, opacity: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 14 }} className="mk-wood rounded-[22px] px-5 py-1.5 sm:px-7">
            <h1 className="mk-title whitespace-nowrap text-[clamp(22px,3vw,38px)]">Karakterini Özelleştir</h1>
          </motion.div>
          <p className="mk-display relative z-10 mt-1.5 rounded-full bg-[#fff6e3] px-4 py-0.5 text-[clamp(12px,1.3vw,16px)] text-[#5a3a17] shadow">Kendi kaşifini oluştur, tarzını yansıt!</p>
        </div>
        <div className="ml-auto hidden items-center gap-1 rounded-full bg-white/90 py-1 pl-1 pr-3 shadow sm:flex lg:hidden" aria-label={`${coins} altın`}>
          <Obj name="coin" size={30} shadow={false} />
          <span className="mk-display text-[20px]">{coins}</span>
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-0 top-[104px] z-10 flex flex-col gap-3 px-3 pb-3 lg:top-[118px] lg:flex-row lg:px-4 lg:pb-4">
        {/* sol menü */}
        <nav aria-label="Kategoriler" className="flex shrink-0 gap-2 overflow-x-auto rounded-[22px] p-2 lg:w-[178px] lg:flex-col lg:self-start lg:overflow-visible" style={{ background: C.panel, border: `3px solid ${C.panelEdge}` }}>
          {CATS.map((c) => {
            const on = cat === c.id
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  sfx('tap')
                  setCat(c.id)
                }}
                aria-pressed={on}
                className="mk-display flex min-h-[50px] shrink-0 items-center gap-2 rounded-2xl px-3 text-[17px] transition"
                style={
                  on
                    ? { background: 'linear-gradient(180deg,#ffe27a,#ffbf2e)', color: '#4a2a06', boxShadow: '0 4px 0 #c98a0e, inset 0 2px 0 #fff4c2' }
                    : { background: 'linear-gradient(180deg,#f3ecff,#ddcffa)', color: '#3d2a73', boxShadow: '0 3px 0 #9b84d6' }
                }
              >
                <Obj name={c.icon} size={30} shadow={false} />
                <span className="whitespace-nowrap">{c.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* sahne */}
        <Stage draft={draft} pose={pose} bump={bump} name={name.trim() || 'Kaşif'} onTap={cheer} />

        {/* seçenek panelleri */}
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence mode="wait">
              <motion.div key={cat} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }} className="grid gap-3 lg:grid-cols-2">
                {cat === 'genel' && <GeneralPanels draft={draft} set={set} name={name} setName={setName} />}
                {cat === 'evcil' && <PetPanel draft={draft} set={set} acquire={acquire} has={has} />}
                {cat === 'ozellik' && <TraitPanel draft={draft} set={set} />}
                {cat === 'arkaplan' && <BackgroundPanel draft={draft} set={set} acquire={acquire} has={has} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="mr-auto hidden items-center gap-1 rounded-full bg-white/90 py-1 pl-1 pr-3 shadow lg:flex" aria-label={`${coins} altın`}>
              <Obj name="coin" size={34} shadow={false} />
              <span className="mk-display text-[22px]">{coins}</span>
            </div>
            <motion.button whileTap={{ scale: 0.94 }} onClick={surprise} className="mk-display flex min-h-[60px] items-center gap-2 rounded-[20px] px-5 text-[20px] text-white" style={{ background: 'linear-gradient(180deg,#b896ff,#8e6cf0)', boxShadow: '0 5px 0 #5c3fb8' }}>
              <Obj name="sparkles" size={30} shadow={false} /> Sürpriz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={save}
              className="mk-display flex min-h-[72px] items-center gap-3 rounded-[24px] px-10 text-[30px] text-white"
              style={{ background: 'linear-gradient(180deg,#8ff05a 0%,#4fc22c 55%,#36a01b 100%)', boxShadow: '0 6px 0 #23780f, 0 10px 24px rgba(0,0,0,0.3), inset 0 3px 0 rgba(255,255,255,0.45)', textShadow: '0 2px 0 rgba(0,80,0,0.35)', border: '3px solid #c8ff9e' }}
            >
              Kaydet
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[24px] text-[#36a01b]">✓</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* altınla sahiplenme onayı (yalnızca kazanılmış altın) */}
      <AnimatePresence>
        {shop && (
          <BuySheet
            title={shop.label}
            img={shop.img}
            icon="paw"
            price={shop.price}
            coins={coins}
            onCancel={() => setShop(null)}
            onBuy={() => {
              if (buy(shop.key, shop.price)) {
                sfx('coin')
                speak(`${shop.label} artık senin!`)
                shop.apply()
              }
              setShop(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ───────────────────────── sahne
function SceneBackground({ bg }: { bg: string }) {
  const url = useBackgroundArt(bg as BackgroundId)
  return (
    <div className="absolute inset-0" aria-hidden>
      {url ? <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <Backdrop kind={(bg as BackdropKind) ?? 'glade'} />}
      {/* referanstaki gece-mor büyülü ton: sağ taraf paneller için koyulaşır */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(40,20,90,0.25) 0%, rgba(50,26,110,0.35) 35%, rgba(36,18,86,0.82) 62%, rgba(30,14,72,0.9) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 28% 60%, rgba(255,214,140,0.28) 0%, rgba(0,0,0,0) 45%)' }} />
    </div>
  )
}

function Stage({ draft, pose, bump, name, onTap }: { draft: AvatarConfig; pose: AvatarPose; bump: number; name: string; onTap: () => void }) {
  const pet = useCharacterArt('pet', draft.pet)
  const size = Math.round(window.innerWidth < 1024 ? Math.min(240, window.innerHeight * 0.24) : Math.min(300, Math.max(170, window.innerWidth * 0.2), window.innerHeight * 0.42))
  return (
    <section aria-label="Önizleme" className="relative flex shrink-0 flex-col items-center justify-end lg:w-[min(32vw,380px)]">
      {/* platform */}
      <div className="absolute bottom-[54px] left-1/2 h-[64px] w-[86%] -translate-x-1/2 rounded-[50%]" style={{ background: 'radial-gradient(ellipse at 50% 40%, #d9c8a8 0%, #a8916c 60%, #7a6446 100%)', boxShadow: '0 0 0 5px rgba(255,214,120,0.35), 0 0 40px 10px rgba(255,200,90,0.45), inset 0 -8px 0 rgba(0,0,0,0.18)' }} />
      <motion.div className="absolute bottom-[62px] left-1/2 h-[40px] w-[70%] -translate-x-1/2 rounded-[50%]" style={{ border: '3px solid rgba(255,236,170,0.75)' }} animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.03, 0.96] }} transition={{ duration: 2.4, repeat: Infinity }} />
      {/* ışık kıvılcımları */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} className="absolute h-2 w-2 rounded-full bg-[#fff3b0]" style={{ left: `${18 + i * 16}%`, bottom: 90 + (i % 3) * 60, boxShadow: '0 0 10px 3px #ffe27a' }} animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.6, delay: i * 0.5, repeat: Infinity }} />
      ))}

      <div className="relative z-10 flex items-end" style={{ marginBottom: 74 }}>
        <motion.button key={bump} onClick={onTap} aria-label="Kaşifine dokun" initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
          <Avatar config={draft} pose={pose} size={size} style={{ filter: 'drop-shadow(0 10px 14px rgba(20,0,50,0.35))' }} />
        </motion.button>
        <AnimatePresence>
          {pet && (
            <motion.img
              key={draft.pet}
              src={pet}
              alt=""
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: [0, -6, 0] }}
              exit={{ scale: 0 }}
              transition={{ y: { duration: 1.6, repeat: Infinity }, scale: { type: 'spring', stiffness: 260, damping: 14 } }}
              className="-ml-[12%]"
              style={{ width: size * 0.36, height: size * 0.36, objectFit: 'contain', objectPosition: 'bottom', filter: 'drop-shadow(0 6px 8px rgba(20,0,50,0.35))' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* isim + özellik rozetleri */}
      <div className="absolute bottom-0 z-20 flex flex-col items-center gap-1">
        <span className="mk-display rounded-full px-5 py-1 text-[20px] text-white" style={{ background: 'linear-gradient(180deg,#8e6cf0,#5c3fb8)', border: '3px solid #d9c8ff', boxShadow: '0 4px 0 #3d2580' }}>
          {name}
        </span>
        {draft.traits.length > 0 && (
          <div className="flex gap-1">
            {draft.traits.map((t) => {
              const tr = TRAITS.find((x) => x.id === t)
              return tr ? (
                <span key={t} className="grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow" title={tr.label}>
                  <Obj name={tr.icon} size={26} shadow={false} />
                </span>
              ) : null
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ───────────────────────── ortak parçalar
function Panel({ title, icon, children, wide, extra }: { title: string; icon: string; children: ReactNode; wide?: boolean; extra?: ReactNode }) {
  return (
    <section className={`rounded-[22px] p-3 ${wide ? 'lg:col-span-2' : ''}`} style={{ background: C.panel, border: `3px solid ${C.panelEdge}`, boxShadow: '0 8px 24px rgba(20,0,60,0.35), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="mk-display flex items-center gap-1.5 rounded-full bg-white/15 py-0.5 pl-1 pr-3 text-[17px] text-white">
          <Obj name={icon} size={26} shadow={false} />
          {title}
        </h2>
        {extra}
      </div>
      {children}
    </section>
  )
}

function Tile({ active, onClick, label, children, price = 0, size = 76, caption }: { active: boolean; onClick: () => void; label: string; children: ReactNode; price?: number; size?: number; caption?: string }) {
  const isLocked = price > 0
  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.button
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        aria-label={isLocked ? `${label}, ${price} altın` : label}
        aria-pressed={active}
        className="relative grid place-items-center overflow-hidden rounded-[16px]"
        style={{
          width: size,
          height: size,
          background: C.tile,
          border: `3px solid ${active ? C.gold : C.tileEdge}`,
          boxShadow: active ? `0 0 0 3px rgba(255,197,51,0.45), 0 4px 0 ${C.goldDark}` : '0 3px 0 #8f78cf',
        }}
      >
        <div className={isLocked ? 'opacity-60 saturate-50' : ''}>{children}</div>
        {isLocked && <PriceTag price={price} />}
      </motion.button>
      {caption && <span className="max-w-[90px] text-center text-[12px] font-extrabold leading-tight text-white/90">{caption}</span>}
    </div>
  )
}

/** satın alınmamış parçada altın fiyatı */
function PriceTag({ price }: { price: number }) {
  return (
    <span className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded-full bg-[#fff3c4] px-1.5 text-[12px] font-black text-[#6b4a06] shadow">
      <Obj name="coin" size={15} shadow={false} />
      {price}
    </span>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2.5">{children}</div>
}

function Check() {
  return <span className="absolute -right-1.5 -top-1.5 z-10 grid h-6 w-6 place-items-center rounded-full text-[13px] font-black text-white" style={{ background: 'linear-gradient(180deg,#ffd75e,#f2a90f)', border: '2px solid #fff', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}>✓</span>
}

function Chip({ on, onClick, children, color = '#8e6cf0' }: { on: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      onClick={() => {
        sfx('tap')
        onClick()
      }}
      aria-pressed={on}
      className="mk-display min-h-[38px] rounded-full px-3.5 text-[15px] transition"
      style={on ? { background: 'linear-gradient(180deg,#ffe27a,#ffbf2e)', color: '#4a2a06', boxShadow: '0 3px 0 #c98a0e' } : { background: 'rgba(255,255,255,0.16)', color: '#fff', border: `2px solid ${color}55` }}
    >
      {children}
    </button>
  )
}

type SetFn = (p: Partial<AvatarConfig>) => void
type AcquireFn = (key: string, price: number, label: string, apply: () => void, img?: string) => void
type HasFn = (key: string, price: number) => boolean

// ───────────────────────── GENEL
function GeneralPanels({ draft, set, name, setName }: { draft: AvatarConfig; set: SetFn; name: string; setName: (s: string) => void }) {
  const [look, setLook] = useState<'hepsi' | 'kiz' | 'erkek'>('hepsi')
  const art = useArt((s) => s.manifest.characters)
  const list = PRESETS.filter((p) => look === 'hepsi' || p.look === look)
  return (
    <>
      <Panel
        title="Kaşifini Seç"
        icon="walking"
        wide
        extra={
          <div className="flex gap-1.5">
            <Chip on={look === 'hepsi'} onClick={() => setLook('hepsi')}>Hepsi</Chip>
            <Chip on={look === 'kiz'} onClick={() => setLook('kiz')} color="#ff5d9e">♀ Kız</Chip>
            <Chip on={look === 'erkek'} onClick={() => setLook('erkek')} color="#3e9bff">♂ Erkek</Chip>
          </div>
        }
      >
        <Grid>
          {list.map((p) => {
            const file = art?.[p.id]?.idle ?? (art?.[p.id] ? Object.values(art[p.id]!)[0] : undefined)
            return (
              <div key={p.id} className="relative">
                <Tile active={draft.preset === p.id} onClick={() => set({ preset: p.id })} label={p.label} size={96} caption={p.label}>
                  <Avatar config={{ ...draft, preset: file ? p.id : null }} bust size={90} still />
                </Tile>
                {draft.preset === p.id && <Check />}
              </div>
            )
          })}
        </Grid>
      </Panel>
      <Panel title="Takma Ad" icon="memo" wide>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            aria-label="Takma ad"
            className="mk-display w-[220px] rounded-2xl border-[3px] border-[#d9c8ff] bg-white px-3 py-2 text-[22px] text-[#3d2a73] outline-none focus:border-[#ffc533]"
          />
          <p className="max-w-[320px] text-[14px] font-bold text-white/85">Gerçek adını yazmana gerek yok, bir takma ad yeter.</p>
        </div>
      </Panel>
    </>
  )
}

/** seçili karoya altın onay rozeti ekler */
function Sel({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      {on && <Check />}
    </div>
  )
}

// ───────────────────────── EVCİL DOST
function PetPanel({ draft, set, acquire, has }: { draft: AvatarConfig; set: SetFn; acquire: AcquireFn; has: HasFn }) {
  const art = useArt((s) => s.manifest.characters?.pet)
  return (
    <Panel title="Evcil Dost" icon="paw" wide>
      <p className="mb-2 text-[14px] font-bold text-white/80">Maceralarında sana eşlik edecek bir dost seç! Bazı dostları kazandığın altınla sahiplenebilirsin.</p>
      <Grid>
        {PETS.map((p) => (
          <Sel key={p.id} on={draft.pet === p.id}>
            <Tile
              active={draft.pet === p.id}
              onClick={() => acquire(`pet:${p.id}`, p.cost, p.label, () => set({ pet: p.id }), art?.[p.id] ? artUrl(art[p.id]) : undefined)}
              label={p.label}
              price={has(`pet:${p.id}`, p.cost) ? 0 : p.cost}
              size={92}
              caption={p.label}
            >
              {p.id === 'yok' ? <span className="mk-display text-[30px] text-[#9b84d6]">✕</span> : art?.[p.id] ? <img src={artUrl(art[p.id])} alt="" draggable={false} style={{ width: 78, height: 78, objectFit: 'contain' }} /> : <Obj name="paw" size={56} />}
            </Tile>
          </Sel>
        ))}
      </Grid>
    </Panel>
  )
}

// ───────────────────────── ÖZEL ÖZELLİK
function TraitPanel({ draft, set }: { draft: AvatarConfig; set: SetFn }) {
  return (
    <Panel title="Özel Özellikler" icon="star" wide>
      <p className="mb-2 text-[14px] font-bold text-white/80">Kaşifine en fazla {MAX_TRAITS} ilgi alanı ekle! ({draft.traits.length}/{MAX_TRAITS})</p>
      <Grid>
        {TRAITS.map((t) => {
          const isOn = draft.traits.includes(t.id)
          return (
            <Sel key={t.id} on={isOn}>
              <Tile
                active={isOn}
                onClick={() => {
                  if (isOn) set({ traits: draft.traits.filter((x) => x !== t.id) })
                  else if (draft.traits.length >= MAX_TRAITS) {
                    sfx('wrong')
                    speak(`En fazla ${MAX_TRAITS} özellik seçebilirsin. Önce birini çıkar.`)
                  } else set({ traits: [...draft.traits, t.id] })
                }}
                label={t.label}
                size={92}
                caption={t.label}
              >
                <Obj name={t.icon} size={60} />
              </Tile>
            </Sel>
          )
        })}
      </Grid>
    </Panel>
  )
}

// ───────────────────────── ARKA PLAN
function BackgroundPanel({ draft, set, acquire, has }: { draft: AvatarConfig; set: SetFn; acquire: AcquireFn; has: HasFn }) {
  const bgs = useArt((s) => s.manifest.backgrounds)
  return (
    <Panel title="Arka Plan" icon="mountain" wide>
      <div className="flex flex-wrap gap-3">
        {BACKGROUNDS.map((b) => {
          const f = bgs?.[b.id as BackgroundId]
          const isOn = draft.bg === b.id
          const isLocked = !has(`bg:${b.id}`, b.cost)
          return (
            <div key={b.id} className="relative flex flex-col items-center gap-1">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => acquire(`bg:${b.id}`, b.cost, b.label, () => set({ bg: b.id }), f ? artUrl(f) : undefined)}
                aria-label={isLocked ? `${b.label}, ${b.cost} altın` : b.label}
                aria-pressed={isOn}
                className="relative h-[86px] w-[128px] overflow-hidden rounded-[16px]"
                style={{ border: `3px solid ${isOn ? C.gold : C.tileEdge}`, boxShadow: isOn ? `0 0 0 3px rgba(255,197,51,0.45), 0 4px 0 ${C.goldDark}` : '0 3px 0 #8f78cf' }}
              >
                {f ? <img src={artUrl(f)} alt="" className={`h-full w-full object-cover ${isLocked ? 'opacity-70 saturate-50' : ''}`} /> : <span className="block h-full w-full bg-[#cdbdf5]" />}
                {isLocked && <PriceTag price={b.cost} />}
              </motion.button>
              {isOn && <Check />}
              <span className="text-[12px] font-extrabold text-white/90">{b.label}</span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
