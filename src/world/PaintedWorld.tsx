/**
 * BOYANMIŞ ANA DÜNYA — referans kalitesindeki illüstrasyon (public/assets/art/backgrounds/bg-world.webp)
 * üzerine etkileşim ve canlılık katmanları:
 *  - tıklanabilir bina sıcak noktaları + ahşap/krem tabelalar (kilit: o sınıfta olmayan dersler)
 *  - nefes alan kamera, imleçle paralaks, seçilen binaya yakınlaşma
 *  - şelale ışıltıları, kristal parıltıları, süzülen bulutlar, uçan kuşlar
 * Koordinatlar görselin yüzdesi cinsindendir (3:2 oranlı sahne, ekranı kaplayacak şekilde ölçeklenir).
 */
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { SubjectId } from '../content/types'
import { SUBJECTS, subjectOpenFor } from '../content/subjects'
import { useGame } from '../state/store'
import { Obj } from '../components/ui/Obj'
import { sfx } from '../audio/sfx'
import { makeRng } from '../learning/rng'
import { STEP, SUBJECT_BG } from './enter'
import { EntryOverlay, type Door } from './DoorEntry'
import { artUrl, useArt, useBackgroundArt, type BackgroundId } from '../art/artRegistry'

interface Spot {
  id: SubjectId
  /** bina merkezi (%) */
  x: number
  y: number
  /** sıcak nokta yarıçapı (% genişlik) */
  r: number
  /** tabela konumu (%) */
  lx: number
  ly: number
}

export const WORLD_SPOTS: Spot[] = [
  { id: 'turkce', x: 26, y: 31, r: 11, lx: 24, ly: 13 },
  { id: 'matematik', x: 49.5, y: 20, r: 10, lx: 49.5, ly: 3.5 },
  { id: 'fen', x: 73, y: 28, r: 10.5, lx: 85, ly: 31 },
  { id: 'hayat', x: 29, y: 63, r: 10, lx: 22, ly: 48 },
  { id: 'tarih', x: 72, y: 62, r: 11, lx: 79, ly: 47 },
]

/**
 * Binaların KAPILARI (görselin yüzdesi; bg-world.webp üzerinde ölçüldü).
 * Giriş geçişi: kamera kapıya doğru hızlanarak yaklaşır → kanatlar içe açılır → içeriden sıcak ışık taşar.
 * Kale: kapı yerine altın halka → dönen ışık geçidi.
 */
export const DOORS: Record<SubjectId, Door> = {
  turkce: { x: 30.2, y: 38.6, w: 3.3, h: 6.6, shape: 'arch' },
  matematik: { x: 51.1, y: 24.8, w: 2.7, h: 6.1, shape: 'arch' },
  fen: { x: 68.5, y: 37.2, w: 2.6, h: 5.0, shape: 'arch' },
  hayat: { x: 32.5, y: 68.4, w: 2.7, h: 6.0, shape: 'arch' },
  tarih: { x: 74.9, y: 68.6, w: 3.9, h: 8.0, shape: 'portal' },
}

const WATERFALLS = [
  [19.5, 52, 4, 12],
  [53, 63, 3.5, 13],
  [83, 89, 3, 10],
  [90, 47, 2.6, 10],
  [61, 84, 3, 12],
]

export default function PaintedWorld({ src, focus, showLabels, onSelect }: { src: string; focus: SubjectId | null; showLabels: boolean; onSelect: (s: SubjectId) => void }) {
  const calm = useGame((s) => s.settings.calm)
  const grade = useGame((s) => s.grade)
  const [hover, setHover] = useState<SubjectId | null>(null)
  const [loaded, setLoaded] = useState(false)

  // imleç paralaksı
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })
  const px = useTransform(sx, (v) => v * -14)
  const py = useTransform(sy, (v) => v * -10)
  const cx = useTransform(sx, (v) => v * -34)
  const cy = useTransform(sy, (v) => v * -18)

  useEffect(() => {
    if (calm) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [calm, mx, my])

  const f = focus ? WORLD_SPOTS.find((s) => s.id === focus) : null
  // dikey ekran: harita ekrandan geniş → parmakla yatay kaydırılabilir
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  // TAM EKRAN: dünya (3:2) ekranı kaplar. Çok geniş ekranlarda evler kesilmesin diye en fazla %6 taşar;
  // kalan ince kenarı gökyüzü + bulutlar doldurur (görsel kenarı yumuşakça gökyüzüne karışır).
  // Dikey ekranda kaplar ve parmakla yana kaydırılır.
  const landscape = vp.w / vp.h >= 1.1
  const coverW = Math.max(vp.w, vp.h * 1.5)
  const containW = Math.min(vp.w, vp.h * 1.5)
  const bw = landscape ? Math.min(coverW, containW * 1.06) : coverW
  const box = { width: bw, height: bw / 1.5 }
  const gapX = Math.max(0, (vp.w - bw) / 2)
  const gapY = Math.max(0, (vp.h - bw / 1.5) / 2)
  const edgeMask = gapX > 2 ? 'linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)' : gapY > 2 ? 'linear-gradient(180deg, transparent 0%, #000 6%, #000 94%, transparent 100%)' : undefined
  const overflow = landscape ? 0 : (coverW - vp.w) / 2
  // GİRİŞ (referans: kapı açılma hikâye tahtası) — kapı ekran yüksekliğinin ~%45'i olana kadar yaklaş
  const door = f ? DOORS[f.id] : null
  const doorH = door ? (door.h / 100) * box.height : 1
  const enterScale = door ? Math.min(7, Math.max(3, (0.45 * vp.h) / doorH)) : 1
  const houseScale = Math.min(2.4, Math.max(1.4, enterScale * 0.42))
  // kapı ekranda yerinde kalır (yakınlaşma merkezi kapı) → kapının ekrandaki yeri ve açılınca boyutu
  const doorScreen = door ? { x: vp.w / 2 - bw / 2 + (door.x / 100) * bw, y: vp.h / 2 - bw / 3 + (door.y / 100) * (bw / 1.5) } : null
  // binanın içi = dersin dünyası (kapının ardında görünür, sonra ekranı doldurur)
  const interior = useBackgroundArt((f ? SUBJECT_BG[f.id] : 'forest') as BackgroundId)
  // tek ev yakın çekimi (kapalı + açık kapı) — 5 bina ortak
  const closeSrc = useBackgroundArt('door')
  const openSrc = useBackgroundArt('door-open')
  const allBg = useArt((s) => s.manifest.backgrounds)
  useEffect(() => {
    // iç mekân görselleri önceden yüklensin (kapı açılınca boş görünmesin)
    ;[...Object.values(SUBJECT_BG), 'door', 'door-open'].forEach((k) => {
      const file = allBg?.[k as BackgroundId]
      if (file) new Image().src = artUrl(file)
    })
  }, [allBg])
  const setVeil = useGame((s) => s.setVeil)
  const [worldHidden, setWorldHidden] = useState(false)
  useEffect(() => {
    if (!f) return setWorldHidden(false)
    const t = setTimeout(() => setWorldHidden(true), (STEP.closeup + 0.15) * 1000)
    return () => clearTimeout(t)
  }, [f])
  useEffect(() => {
    if (!f) return
    const ts = [
      setTimeout(() => sfx('star'), STEP.closeup * 1000),
      setTimeout(() => sfx(DOORS[f.id].shape === 'portal' ? 'unlock' : 'door'), STEP.glow * 1000),
      setTimeout(() => sfx('enter'), STEP.open * 1000),
      setTimeout(() => sfx('whoosh'), STEP.gather * 1000),
    ]
    // içerisi ekranı doldurunca perde = aynı arka plan → ders dünyası kesintisiz açılır
    // perde = içerinin aynı arka planı; şimdiden hazırlanır, yalnızca ders dünyasına geçince görünür (zamanlamadan bağımsız)
    if (interior) setVeil(`#2a1a5e url("${interior}") center / cover no-repeat`)
    return () => ts.forEach(clearTimeout)
  }, [f, interior, setVeil])

  const sparkles = useMemo(() => {
    const r = makeRng(21)
    return Array.from({ length: 22 }).map(() => ({ x: 44 + r() * 14, y: 36 + r() * 16, d: r() * 3, s: 4 + r() * 6 }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, #6fc0f6 0%, #9fd8fb 45%, #d9f0ff 100%)' }}>
      {/* geniş ekranda kenar boşluğu: gökyüzü + kabarık bulutlar */}
      {(gapX > 2 || gapY > 2) && <EdgeClouds sides={gapX > 2 ? 'x' : 'y'} calm={calm} />}
      <motion.div
        className="absolute inset-0"
        drag={overflow > 40 && !focus ? 'x' : false}
        dragConstraints={{ left: -overflow, right: overflow }}
        dragElastic={0.08}
        style={{ touchAction: overflow > 40 ? 'pan-y' : 'auto' }}
      >
      {/* sahne: 3:2, ekranı kaplar */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        // yakınlaşma merkezi = kapı (kapı ekranda yerinde kalır, dünya etrafında büyür → "kapıya yürüyoruz" hissi)
        // yakın çekim ekranı kaplayınca dev ölçekli dünya çizilmesin (ekran kartını yormasın, görüntü düşmesin)
        style={{ ...box, x: '-50%', y: '-50%', originX: door ? door.x / 100 : 0.5, originY: door ? door.y / 100 : 0.5, visibility: worldHidden ? 'hidden' : 'visible' }}
        initial={{ scale: 1.12, opacity: 0, filter: 'blur(8px)' }}
        animate={
          f
            ? { scale: [1, houseScale, enterScale], opacity: 1, filter: 'blur(0px)' }
            : { scale: loaded ? (calm ? 1 : [1, 1.015, 1]) : 1.12, opacity: loaded ? 1 : 0, filter: 'blur(0px)' }
        }
        transition={
          f
            ? { scale: { duration: STEP.closeup + 0.2, times: [0, 0.55, 1], ease: ['easeOut', 'easeIn'] } }
            : { scale: { duration: loaded ? 24 : 1.8, repeat: loaded && !calm ? Infinity : 0, ease: 'easeInOut' }, opacity: { duration: 1 }, filter: { duration: 1.4 } }
        }
      >
        <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
          <img src={src} alt="" onLoad={() => setLoaded(true)} className="absolute inset-0 h-full w-full select-none object-cover" draggable={false} style={{ maskImage: edgeMask, WebkitMaskImage: edgeMask }} />

          {/* şelale ışıltıları */}
          {!calm &&
            WATERFALLS.map(([x, y, w, h], i) => (
              <div key={i} className="pointer-events-none absolute overflow-hidden" style={{ left: `${x - w / 2}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, maskImage: 'linear-gradient(180deg, transparent, #000 20%, #000 70%, transparent)' }}>
                {[0, 1, 2].map((k) => (
                  <motion.div
                    key={k}
                    className="absolute left-[15%] h-[35%] w-[70%] rounded-full"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', filter: 'blur(2px)' }}
                    animate={{ top: ['-40%', '110%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: k * 0.47 + i * 0.2 }}
                  />
                ))}
              </div>
            ))}

          {/* kristal parıltıları */}
          {!calm &&
            sparkles.map((p, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute rounded-full"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: 'radial-gradient(circle, #fff 0%, #bff3ff 40%, rgba(150,230,255,0) 70%)' }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4], y: [0, -24, -40] }}
                transition={{ duration: 2.4 + p.d, repeat: Infinity, delay: p.d }}
              />
            ))}

          {/* seçilen binanın kapısı açılır (dünyayla birlikte büyür) */}

          {/* bina sıcak noktaları */}
          {WORLD_SPOTS.map((s) => {
            const open = subjectOpenFor(s.id, grade)
            const hov = hover === s.id
            return (
              <button
                key={s.id}
                aria-label={SUBJECTS.find((x) => x.id === s.id)!.name}
                className="absolute rounded-full"
                style={{ left: `${s.x - s.r}%`, top: `${s.y - s.r * 1.5}%`, width: `${s.r * 2}%`, height: `${s.r * 3}%` }}
                onPointerEnter={() => {
                  setHover(s.id)
                  if (open) sfx('tap')
                }}
                onPointerLeave={() => setHover(null)}
                onClick={() => onSelect(s.id)}
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.8 }}
                  style={{ background: open ? 'radial-gradient(circle, rgba(255,240,170,0.55) 0%, rgba(255,240,170,0) 65%)' : 'radial-gradient(circle, rgba(200,200,220,0.45) 0%, rgba(200,200,220,0) 65%)' }}
                />
              </button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* tabelalar (paralaksla birlikte hareket eder) */}
      {showLabels && !focus && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ ...box, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div className="absolute inset-0" style={{ x: px, y: py, scale: 1.035 }}>
            {WORLD_SPOTS.map((s, i) => (
              <Sign key={s.id} spot={s} open={subjectOpenFor(s.id, grade)} hover={hover === s.id} delay={0.9 + i * 0.12} onClick={() => onSelect(s.id)} onHover={(h) => setHover(h ? s.id : null)} />
            ))}
          </motion.div>
        </motion.div>
      )}

      </motion.div>

      {/* giriş efektleri: hız çizgileri, ışıltılar, kaşif + robot, büyülü sarmal, kapıdan geçiş */}
      {f && door && doorScreen && <EntryOverlay at={doorScreen} interior={interior} closeSrc={closeSrc} openSrc={openSrc} vp={vp} calm={calm} />}

      {/* ön plan bulutları (paralaks) */}
      {!calm && !f && (
        <motion.div className="pointer-events-none absolute inset-0" style={{ x: cx, y: cy }}>
          {[
            { l: '-14%', t: '90%', w: 380, d: 70 },
            { l: '78%', t: '92%', w: 420, d: 90 },
            { l: '-12%', t: '6%', w: 360, d: 80 },
          ].map((c, i) => (
            <motion.div key={i} className="absolute" style={{ left: c.l, top: c.t, width: c.w, height: c.w * 0.38 }} animate={{ x: [0, 90, 0] }} transition={{ duration: c.d, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="absolute inset-0 rounded-full bg-white/80 blur-[6px]" />
              <div className="absolute -top-[35%] left-[18%] h-[95%] w-[45%] rounded-full bg-white/85 blur-[4px]" />
              <div className="absolute -top-[15%] left-[48%] h-[80%] w-[40%] rounded-full bg-white/85 blur-[4px]" />
            </motion.div>
          ))}
          <Birds />
        </motion.div>
      )}

      {/* hafif vinyet */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(10,40,80,0.28) 100%)' }} />
    </div>
  )
}

/** Bina tabelası: kompakt, tek satır "cam" hap (simge rozeti + ad); kilitliyse soluk + küçük kilit rozeti */
function Sign({ spot, open, hover, delay, onClick, onHover }: { spot: Spot; open: boolean; hover: boolean; delay: number; onClick: () => void; onHover: (h: boolean) => void }) {
  const s = SUBJECTS.find((x) => x.id === spot.id)!
  const title = s.name.replace(' Dünyası', '')
  return (
    <motion.button
      className="pointer-events-auto absolute flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full py-[3px] pl-[3px] pr-3 backdrop-blur-md"
      style={{
        left: `${spot.lx}%`,
        top: `${spot.ly}%`,
        background: open ? 'rgba(255,255,255,0.9)' : 'rgba(240,236,230,0.78)',
        border: `2px solid ${open ? s.accent : 'rgba(150,140,125,0.6)'}`,
        boxShadow: open ? `0 3px 0 ${s.accentDark}, 0 8px 16px rgba(20,30,60,0.22)` : '0 2px 0 rgba(110,100,90,0.5), 0 6px 12px rgba(20,30,60,0.15)',
      }}
      initial={{ y: -16, opacity: 0, scale: 0.8 }}
      animate={{ y: hover ? -4 : 0, opacity: 1, scale: hover ? 1.08 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20, delay: hover ? 0 : delay }}
      onClick={onClick}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      title={open ? s.name : `${s.name}: ${s.grades[0]}. sınıfta açılır`}
      aria-label={`${s.name}${open ? '' : ', bu sınıfta kilitli'}`}
    >
      <span className="relative grid h-[clamp(26px,2.4vw,32px)] w-[clamp(26px,2.4vw,32px)] place-items-center rounded-full" style={{ background: open ? s.accent : '#b9b0a2' }}>
        <Obj name={s.icon} size={20} shadow={false} style={{ filter: open ? 'none' : 'grayscale(1) opacity(0.8)' }} />
        {!open && (
          <span className="absolute -bottom-1 -right-1 grid h-[15px] w-[15px] place-items-center rounded-full bg-white shadow">
            <Obj name="lock" size={11} shadow={false} />
          </span>
        )}
      </span>
      <span className="mk-display text-[clamp(13px,1.25vw,17px)] leading-none" style={{ color: open ? '#2e2140' : '#7d7466' }}>
        {title}
      </span>
    </motion.button>
  )
}

function Birds() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 40 20"
          width={26 - i * 4}
          className="absolute"
          style={{ top: `${12 + i * 5}%` }}
          initial={{ left: '-5%' }}
          animate={{ left: '105%', y: [0, -10, 0, 8, 0] }}
          transition={{ left: { duration: 26 + i * 4, repeat: Infinity, delay: i * 3, ease: 'linear' }, y: { duration: 4, repeat: Infinity } }}
        >
          <motion.path d="M2 10 Q 10 2 20 10 Q 30 2 38 10" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ d: ['M2 10 Q 10 2 20 10 Q 30 2 38 10', 'M2 6 Q 10 14 20 10 Q 30 14 38 6', 'M2 10 Q 10 2 20 10 Q 30 2 38 10'] }} transition={{ duration: 0.6, repeat: Infinity }} />
        </motion.svg>
      ))}
    </>
  )
}

/** Kenar bulutları: dünya görseli ekrana tam oturmadığında boşluğu doldurur */
function EdgeClouds({ sides, calm }: { sides: 'x' | 'y'; calm: boolean }) {
  const puffs =
    sides === 'x'
      ? [
          { l: '-6%', t: '8%', w: 300 }, { l: '-9%', t: '38%', w: 360 }, { l: '-5%', t: '70%', w: 320 },
          { l: '88%', t: '14%', w: 320 }, { l: '91%', t: '46%', w: 360 }, { l: '87%', t: '76%', w: 300 },
        ]
      : [
          { l: '4%', t: '-6%', w: 380 }, { l: '40%', t: '-8%', w: 420 }, { l: '76%', t: '-6%', w: 380 },
          { l: '10%', t: '92%', w: 400 }, { l: '62%', t: '93%', w: 420 },
        ]
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {puffs.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: c.l, top: c.t, width: c.w, height: c.w * 0.5 }}
          animate={calm ? {} : { x: [0, i % 2 ? 14 : -14, 0], y: [0, -6, 0] }}
          transition={{ duration: 9 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[60%] rounded-full bg-white/95 shadow-[inset_0_-10px_18px_rgba(150,190,230,0.35)]" />
          <div className="absolute bottom-[30%] left-[12%] h-[70%] w-[44%] rounded-full bg-white" />
          <div className="absolute bottom-[34%] left-[42%] h-[85%] w-[46%] rounded-full bg-white shadow-[inset_0_-8px_14px_rgba(150,190,230,0.3)]" />
        </motion.div>
      ))}
    </div>
  )
}

