/**
 * KAPIDAN GİRİŞ — referans: "Menta – Ev Kapısı Açılma Animasyonu (Adım Adım)" (docs/reference/kapi-referans.png)
 * Tek bir ev yakın çekimi (backgrounds/door.webp + door-open.webp) 5 binanın hepsinde kullanılır;
 * kapının ardında her zaman o dersin kendi dünyası görünür.
 *   1 seç → 2 dünyada binaya yaklaşma + hız çizgileri → yakın çekime geçiş
 *   3 kapı aydınlanır (kemer parlar, fenerler titrer, ışıltılar) → 4 kapı açılır (ışık patlaması)
 *   5 kamera kapının ışığına doğru ilerler (ışık yoğunlaşır) → IŞINLANMA: ışık her yöne patlar, ekran ışıkla dolar
 *     → dersin dünyası ışığın içinden belirir (kare/çerçeve yok)
 *   6 ders dünyası (ev içi menü) açılır
 * Zamanlama: ./enter.ts (STEP)
 */
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { STEP } from './enter'
import { makeRng } from '../learning/rng'

export interface Door {
  x: number
  y: number
  w: number
  h: number
  shape: 'arch' | 'portal'
}

/** yakın çekim görselinde (1536×1024) kapı açıklığı ve fenerler — yüzde */
const IMG = { w: 1536, h: 1024 }
const DOORWAY = { l: 34.5, r: 65, t: 9.5, b: 79 }
const LANTERNS = [
  { x: 23, y: 33 },
  { x: 77, y: 33 },
]

export function EntryOverlay({ at, interior, closeSrc, openSrc, vp, calm }: { at: { x: number; y: number }; interior: string | null; closeSrc: string | null; openSrc: string | null; vp: { w: number; h: number }; calm: boolean }) {
  // yakın çekim ekranı kaplar (object-cover) → kapı açıklığının ekrandaki yeri
  const sc = Math.max(vp.w / IMG.w, vp.h / IMG.h)
  const dw = IMG.w * sc
  const dh = IMG.h * sc
  const ox = (vp.w - dw) / 2
  const oy = (vp.h - dh) / 2
  const X = (p: number) => ox + (p / 100) * dw
  const Y = (p: number) => oy + (p / 100) * dh
  const door = { l: X(DOORWAY.l), r: X(DOORWAY.r), t: Y(DOORWAY.t), b: Y(DOORWAY.b) }
  const dWidth = door.r - door.l
  const dHeight = door.b - door.t
  const dc = { x: (door.l + door.r) / 2, y: (door.t + door.b) / 2 }

  const sparks = useMemo(() => {
    const r = makeRng(7)
    return Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2 + r() * 0.4
      return { x: Math.cos(a) * (0.62 + r() * 0.3), y: Math.sin(a) * (0.55 + r() * 0.3), s: 10 + r() * 14, d: r() * 0.45 }
    })
  }, [])

  // 5. adım: kamera kapının ışığına doğru ilerler (yakın çekim kapı merkezinde PUSH kat büyür), sonra ışınlanma
  const rTop = dWidth / 2
  const PUSH = Math.min(2.2, (vp.h * 0.92) / dHeight)
  const through = STEP.through - STEP.gather

  const imgScaleT = [0, (STEP.glow - STEP.approach) / (STEP.open - STEP.approach), 1]

  return (
    <>
      {/* 2. adım: dünyada binaya yaklaşırken hız çizgileri */}
      {!calm && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `repeating-conic-gradient(from 0deg at ${at.x}px ${at.y}px, rgba(255,255,255,0) 0deg 5deg, rgba(255,255,255,0.6) 5deg 5.6deg, rgba(255,255,255,0) 5.6deg 9deg)`,
            maskImage: `radial-gradient(circle at ${at.x}px ${at.y}px, transparent 16%, #000 55%)`,
            WebkitMaskImage: `radial-gradient(circle at ${at.x}px ${at.y}px, transparent 16%, #000 55%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0], display: ['block', 'block', 'none'] }}
          transition={{ duration: STEP.closeup + 0.1, times: [0, 0.45, 1] }}
        />
      )}

      {/* YAKIN ÇEKİM: dünyadan yumuşakça geçilir, kamera kapıya doğru süzülmeye devam eder */}
      <motion.div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: STEP.approach, duration: STEP.closeup - STEP.approach, ease: 'easeInOut' }}>
        {/* kamera itişi: kapı açıldıktan sonra kapının ışığına doğru ilerle */}
        <motion.div className="absolute inset-0" style={{ transformOrigin: `${dc.x}px ${dc.y}px` }} initial={{ scale: 1 }} animate={{ scale: PUSH }} transition={{ delay: STEP.open, duration: STEP.gather - STEP.open, ease: [0.45, 0, 0.75, 0.6] }}>
        {closeSrc && (
          <motion.img
            src={closeSrc}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transformOrigin: `${dc.x}px ${dc.y}px` }}
            initial={{ scale: 1.16 }}
            animate={{ scale: [1.16, 1.02, 1] }}
            transition={{ delay: STEP.approach, duration: STEP.open - STEP.approach, times: imgScaleT, ease: 'easeOut' }}
          />
        )}

        {/* 3. adım: fenerler titrer, kemer nabız gibi parlar */}
        {LANTERNS.map((l, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: X(l.x) - dWidth * 0.35, top: Y(l.y) - dWidth * 0.35, width: dWidth * 0.7, height: dWidth * 0.7, background: 'radial-gradient(circle, rgba(255,236,170,0.75) 0%, rgba(255,200,90,0.25) 45%, rgba(255,200,90,0) 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.55, 1, 0.7, 1] }}
            transition={{ delay: STEP.closeup, duration: STEP.gather - STEP.closeup, ease: 'easeInOut' }}
          />
        ))}
        <motion.div
          className="absolute"
          style={{ left: door.l - 6, top: door.t - 6, width: dWidth + 12, height: dHeight + 8, borderRadius: `${rTop + 6}px ${rTop + 6}px 6px 6px`, border: '3px solid rgba(255,248,210,0.95)', boxShadow: '0 0 18px 6px rgba(255,205,90,0.85), 0 0 46px 14px rgba(255,190,70,0.45), inset 0 0 18px 4px rgba(255,215,110,0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.55, 1, 0.8] }}
          transition={{ delay: STEP.closeup, duration: STEP.open - STEP.closeup + 0.3 }}
        />

        {/* 4. adım: kapı açılır — açık kapı görseli + ışık patlaması */}
        {openSrc && (
          <motion.img
            src={openSrc}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transformOrigin: `${dc.x}px ${dc.y}px` }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: STEP.glow, duration: STEP.open - STEP.glow, ease: 'easeInOut' }}
          />
        )}
        <motion.div
          className="absolute"
          style={{ left: dc.x - dWidth * 1.6, top: dc.y - dHeight * 0.9, width: dWidth * 3.2, height: dHeight * 1.8, background: 'radial-gradient(ellipse, rgba(255,253,240,0.95) 0%, rgba(255,232,170,0.6) 35%, rgba(255,210,120,0) 70%)' }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0.35], scale: [0.4, 1.1, 1] }}
          transition={{ delay: STEP.glow + 0.05, duration: STEP.open - STEP.glow + 0.35, ease: 'easeOut' }}
        />
        </motion.div>
        {/* ilerledikçe kapının ışığı yoğunlaşır (ekranın ortası aydınlanır, kenarlar yumuşakça kararır) */}
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse ${vp.w * 0.5}px ${vp.h * 0.55}px at ${dc.x}px ${dc.y}px, rgba(255,252,236,0.9) 0%, rgba(255,232,170,0.45) 45%, rgba(255,210,130,0) 75%), radial-gradient(circle at ${dc.x}px ${dc.y}px, rgba(0,0,0,0) 45%, rgba(40,20,10,0.35) 100%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STEP.open + 0.1, duration: STEP.gather - STEP.open, ease: 'easeIn' }}
        />
      </motion.div>

      {/* 3–4. adım: kapının etrafında ışıltılar */}
      {!calm &&
        sparks.map((p, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            width={p.s}
            height={p.s}
            className="pointer-events-none absolute z-[25]"
            style={{ left: dc.x + p.x * dWidth * 1.1 - p.s / 2, top: dc.y + p.y * dHeight * 0.75 - p.s / 2, filter: 'drop-shadow(0 0 5px #ffd36b)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1, 0], scale: [0, 1.2, 0.8, 1.1, 0], rotate: 90 }}
            transition={{ delay: STEP.closeup + p.d, duration: STEP.gather - STEP.closeup }}
            aria-hidden
          >
            <path d="M12 0 C 13 8, 16 11, 24 12 C 16 13, 13 16, 12 24 C 11 16, 8 13, 0 12 C 8 11, 11 8, 12 0 Z" fill="#fff8d6" />
          </motion.svg>
        ))}

      {/* 5. adım: IŞINLANMA — kapının ışığı her yöne patlar ve ekranı doldurur */}
      {!calm && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background: `repeating-conic-gradient(from 0deg at ${dc.x}px ${dc.y}px, rgba(255,255,255,0) 0deg 3deg, rgba(255,250,225,0.9) 3deg 3.8deg, rgba(255,255,255,0) 3.8deg 7deg)`,
            maskImage: `radial-gradient(circle at ${dc.x}px ${dc.y}px, transparent 6%, #000 30%, transparent 75%)`,
            WebkitMaskImage: `radial-gradient(circle at ${dc.x}px ${dc.y}px, transparent 6%, #000 30%, transparent 75%)`,
            transformOrigin: `${dc.x}px ${dc.y}px`,
          }}
          initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 2.4], rotate: 8 }}
          transition={{ delay: STEP.gather - 0.2, duration: 0.7, ease: 'easeOut', times: [0, 0.4, 1] }}
        />
      )}
      {(() => {
        const R = Math.hypot(vp.w, vp.h)
        return (
          <motion.div
            className="pointer-events-none absolute z-30 rounded-full"
            style={{ left: dc.x - R, top: dc.y - R, width: R * 2, height: R * 2, background: 'radial-gradient(circle, #ffffff 0%, #fffbea 30%, #fff1c8 52%, rgba(255,232,170,0.85) 64%, rgba(255,225,160,0) 72%)' }}
            initial={{ scale: 0.05, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 1 }}
            transition={{ delay: STEP.gather - 0.2, duration: 0.45, ease: [0.5, 0, 0.8, 0.4] }}
          />
        )
      })()}

      {/* varış: dersin dünyası ışığın içinden belirir, hafifçe yerine oturur; ışık parçacıkları dağılır */}
      <motion.div className="pointer-events-none absolute inset-0 z-[31] overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: STEP.gather + 0.2, duration: 0.01 }}>
        {interior && (
          <motion.img
            src={interior}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ delay: STEP.gather + 0.2, duration: through + 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fffaeb 45%, #fff0c6 100%)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: STEP.gather + 0.25, duration: through, ease: 'easeOut' }}
        />
        {!calm &&
          sparks.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: vp.w / 2, top: vp.h / 2, width: p.s * 0.5, height: p.s * 0.5, boxShadow: '0 0 12px 4px rgba(255,225,150,0.9)' }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: p.x * vp.w * 0.6, y: p.y * vp.h * 0.6, opacity: [0, 1, 0] }}
              transition={{ delay: STEP.gather + 0.25 + p.d * 0.3, duration: through + 0.2, ease: 'easeOut' }}
            />
          ))}
      </motion.div>
    </>
  )
}

