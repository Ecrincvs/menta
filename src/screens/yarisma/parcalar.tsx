/**
 * Yarışma Modu ortak görsel parçaları — referans: docs/reference/yarisma-modu-referans.png
 * Mor-lacivert ışıklı arena, cam kartlar, renkli (kırmızı/mavi/sarı/yeşil) cevap butonları, podyum.
 */
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import QRCode from 'qrcode'
import { Avatar } from '../../characters/Avatar'
import { Mascot } from '../../characters/Mascot'
import { Robo } from '../../characters/Robo'
import { Obj } from '../../components/ui/Obj'

/* ---------------------------------------------------------------- arka plan */
export function Arena({ children }: { children?: ReactNode }) {
  const parilti = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 2 + (i % 4) * 1.5,
        d: 2 + (i % 5) * 0.7,
        k: i % 3,
      })),
    [],
  )
  const konfeti = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 29) % 70, r: (i * 47) % 180, c: ['#ffd23f', '#ff7aa8', '#5ee1ff', '#a3ff7a'][i % 4] })), [])
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'radial-gradient(1100px 620px at 55% -8%, #9d6bff 0%, rgba(157,107,255,0) 62%), radial-gradient(900px 600px at 0% 100%, #3a1a99 0%, rgba(58,26,153,0) 60%), linear-gradient(160deg, #241060 0%, #3b1690 38%, #5a26c9 70%, #2c0f75 100%)' }}>
      {/* ışık huzmeleri */}
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[140%] w-[140%] -translate-x-1/2 opacity-25" style={{ background: 'repeating-conic-gradient(from 0deg at 50% 0%, rgba(255,255,255,0.22) 0deg 6deg, rgba(255,255,255,0) 6deg 18deg)' }} />
      {/* bokeh */}
      <div className="pointer-events-none absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-[#ff7aa8] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[8%] right-[6%] h-72 w-72 rounded-full bg-[#5ee1ff] opacity-20 blur-3xl" />
      {parilti.map((p, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: p.k === 0 ? '#fff' : p.k === 1 ? '#ffe27a' : '#c7b5ff', boxShadow: '0 0 8px currentColor' }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: p.d, repeat: Infinity, delay: i * 0.13 }}
        />
      ))}
      {konfeti.map((c, i) => (
        <motion.span
          key={`k${i}`}
          className="pointer-events-none absolute h-3 w-1.5 rounded-sm opacity-70"
          style={{ left: `${c.x}%`, top: `${c.y}%`, background: c.c, rotate: c.r }}
          animate={{ y: [0, 14, 0], rotate: [c.r, c.r + 40, c.r] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------- cam kart ve başlık */
export function Cam({ children, className = '', parlak = false }: { children: ReactNode; className?: string; parlak?: boolean }) {
  return (
    <div
      className={`relative rounded-[28px] border backdrop-blur-md ${parlak ? 'border-[#ffd23f]/70' : 'border-white/25'} ${className}`}
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))', boxShadow: `0 14px 40px rgba(20,0,70,0.45), inset 0 1px 0 rgba(255,255,255,0.35)${parlak ? ', 0 0 0 3px rgba(255,210,63,0.35), 0 0 30px rgba(255,210,63,0.35)' : ''}` }}
    >
      {children}
    </div>
  )
}
export function BolumBaslik({ no, children }: { no?: number; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#2a1270]/70 py-1 pl-1 pr-5 shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
      {no !== undefined && <span className="mk-display grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-[#b48bff] to-[#7c4dff] text-[20px] text-white shadow-inner">{no}</span>}
      <span className="mk-display text-[clamp(16px,1.8vw,22px)] text-white">{children}</span>
    </div>
  )
}
export const Yazi = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`mk-display text-white [text-shadow:0_3px_0_rgba(40,10,110,0.55)] ${className}`}>{children}</span>
)

/* ---------------------------------------------------------------- karakterler */
export function Kim({ avatar, size = 120, bust = false, pose = 'idle' }: { avatar: string; size?: number; bust?: boolean; pose?: 'idle' | 'cheer' | 'wave' }) {
  if (avatar === 'findik') return <Mascot pose={pose === 'cheer' ? 'cheer' : pose === 'wave' ? 'wave' : 'idle'} size={size} />
  if (avatar === 'robo') return <Robo pose={pose === 'cheer' ? 'cheer' : 'idle'} size={size} />
  return <Avatar config={{ preset: avatar }} size={size} bust={bust} still={bust} pose={pose} />
}
/** yuvarlak profil rozeti */
export function Rozet({ avatar, size = 44, renk = '#ffd23f' }: { avatar: string; size?: number; renk?: string }) {
  return (
    <span className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-[#fff3c9] to-[#ffd6f0]" style={{ width: size, height: size, boxShadow: `0 0 0 3px ${renk}` }}>
      <span className="absolute inset-x-0 top-0 flex justify-center">
        <Kim avatar={avatar} size={size} bust />
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------- cevap butonları */
export const CEVAP_RENK = [
  { bg: 'linear-gradient(180deg,#ff6b6b,#e53935)', alt: '#a8231f', sekil: '▲', harf: 'A' },
  { bg: 'linear-gradient(180deg,#5aa8ff,#2f6fe0)', alt: '#1d4aa8', sekil: '◆', harf: 'B' },
  { bg: 'linear-gradient(180deg,#ffd447,#f5a500)', alt: '#b27400', sekil: '●', harf: 'C' },
  { bg: 'linear-gradient(180deg,#5fe07a,#22a845)', alt: '#157a2f', sekil: '■', harf: 'D' },
]

/* ---------------------------------------------------------------- zaman halkası */
export function useKalan(kalanMs: number, anahtar: string) {
  const [bitis, setBitis] = useState(() => Date.now() + kalanMs)
  const [simdi, setSimdi] = useState(() => Date.now())
  useEffect(() => {
    setBitis(Date.now() + kalanMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anahtar])
  useEffect(() => {
    const t = setInterval(() => setSimdi(Date.now()), 100)
    return () => clearInterval(t)
  }, [])
  return Math.max(0, bitis - simdi)
}
export function ZamanHalkasi({ kalan, toplam, size = 84 }: { kalan: number; toplam: number; size?: number }) {
  const oran = toplam ? kalan / toplam : 0
  const sn = Math.ceil(kalan / 1000)
  const r = 42
  const c = 2 * Math.PI * r
  const renk = oran > 0.5 ? '#5fe07a' : oran > 0.25 ? '#ffd447' : '#ff6b6b'
  return (
    <motion.div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} animate={sn <= 5 && sn > 0 ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} role="timer" aria-label={`${sn} saniye`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r + 6} fill="#21105a" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={renk} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - oran)} style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }} />
      </svg>
      <span className="mk-display relative text-[clamp(26px,3vw,36px)] text-white">{sn}</span>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- podyum */
export interface SiraSatir {
  id: string
  ad: string
  avatar: string
  puan: number
}
const PODYUM = [
  { yer: 1, h: 'clamp(92px,15vh,150px)', renk: 'linear-gradient(180deg,#ffe27a,#f5b400)', kenar: '#b57f00' },
  { yer: 0, h: 'clamp(70px,11vh,112px)', renk: 'linear-gradient(180deg,#eef2ff,#aab4cf)', kenar: '#7d88a6' },
  { yer: 2, h: 'clamp(56px,8.5vh,88px)', renk: 'linear-gradient(180deg,#ffc08a,#d9772e)', kenar: '#9c4d14' },
]
export function Podyum({ ilk, benimId }: { ilk: SiraSatir[]; benimId?: string | null }) {
  // sıra: 2. – 1. – 3.
  const duzen = [ilk[1], ilk[0], ilk[2]]
  const stil = [PODYUM[1], PODYUM[0], PODYUM[2]]
  return (
    <div className="flex items-end justify-center gap-[clamp(6px,1.4vw,18px)]">
      {duzen.map((o, i) =>
        o ? (
          <motion.div key={o.id} layout initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: [0.25, 0.5, 0][i] + 0.1, type: 'spring', stiffness: 180, damping: 16 }} className="flex w-[clamp(96px,13vw,150px)] flex-col items-center">
            <div className="relative">
              {i === 1 && (
                <motion.div className="absolute -top-7 left-1/2 z-10 -translate-x-1/2" animate={{ rotate: [-8, 8, -8], y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Obj name="crown" size={44} />
                </motion.div>
              )}
              <motion.div animate={i === 1 ? { y: [0, -8, 0] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
                <Rozet avatar={o.avatar} size={i === 1 ? 92 : 74} renk={i === 1 ? '#ffd23f' : i === 0 ? '#dfe6ff' : '#ffb27a'} />
              </motion.div>
            </div>
            <div className={`mt-1 w-full rounded-t-2xl px-1 pt-1 text-center ${o.id === benimId ? 'ring-4 ring-[#5ee1ff]' : ''}`} style={{ background: 'rgba(30,10,90,0.75)' }}>
              <div className="mk-display truncate text-[clamp(14px,1.5vw,19px)] text-white">{o.ad}</div>
              <div className="mk-display text-[clamp(13px,1.3vw,17px)] text-[#ffe27a]">{o.puan.toLocaleString('tr-TR')} P</div>
            </div>
            <div className="grid w-full place-items-center rounded-b-xl" style={{ height: stil[i].h, background: stil[i].renk, boxShadow: `inset 0 -6px 0 ${stil[i].kenar}, 0 10px 24px rgba(0,0,0,0.35)` }}>
              <span className="mk-display grid h-10 w-10 place-items-center rounded-full border-4 border-white/80 text-[22px] text-white" style={{ background: stil[i].kenar }}>
                {[2, 1, 3][i]}
              </span>
            </div>
          </motion.div>
        ) : (
          <div key={i} className="w-[clamp(96px,13vw,150px)]" />
        ),
      )}
    </div>
  )
}
export function SiraListesi({ list, bas = 4, benimId }: { list: SiraSatir[]; bas?: number; benimId?: string | null }) {
  return (
    <div className="flex flex-col gap-1.5">
      {list.map((o, i) => (
        <motion.div
          key={o.id}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={`flex items-center gap-3 rounded-2xl px-3 py-1.5 ${o.id === benimId ? 'bg-[#5ee1ff]/25 ring-2 ring-[#5ee1ff]' : 'bg-[#1d0b5c]/60'}`}
        >
          <span className="mk-display grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-[16px] text-white">{bas + i}</span>
          <Rozet avatar={o.avatar} size={32} renk="rgba(255,255,255,0.5)" />
          <span className="mk-display flex-1 truncate text-[16px] text-white">{o.ad}</span>
          <span className="mk-display text-[16px] text-[#ffe27a]">{o.puan.toLocaleString('tr-TR')} P</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- QR */
export function QR({ url, size = 150 }: { url: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    let iptal = false
    QRCode.toDataURL(url, { margin: 1, width: size * 2, color: { dark: '#24105f', light: '#ffffff' } })
      .then((d) => !iptal && setSrc(d))
      .catch(() => setSrc(null))
    return () => {
      iptal = true
    }
  }, [url, size])
  return (
    <div className="grid place-items-center rounded-2xl bg-white p-2 shadow-[0_6px_20px_rgba(0,0,0,0.3)]" style={{ width: size + 16, height: size + 16 }}>
      {src ? <img src={src} width={size} height={size} alt="Katılım QR kodu" /> : <Obj name="lock" size={40} />}
    </div>
  )
}

/* ---------------------------------------------------------------- büyük buton */
export function ParlakButon({ children, onClick, renk = 'sari', className = '', disabled, ariaLabel }: { children: ReactNode; onClick?: () => void; renk?: 'sari' | 'yesil' | 'mor' | 'pembe'; className?: string; disabled?: boolean; ariaLabel?: string }) {
  const R = { sari: ['#ffe066', '#f5a500', '#a86c00', '#3b2400'], yesil: ['#7cf08f', '#22b04a', '#127a2c', '#fff'], mor: ['#b48bff', '#7c4dff', '#4b25b0', '#fff'], pembe: ['#ff9ccc', '#ff4f9a', '#b8246a', '#fff'] }[renk]
  return (
    <motion.button
      whileHover={disabled ? {} : { y: -3, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.96, y: 2 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`mk-display inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full px-7 text-[clamp(18px,2vw,24px)] disabled:opacity-50 ${className}`}
      style={{ background: `linear-gradient(180deg, ${R[0]}, ${R[1]})`, color: R[3], boxShadow: `0 6px 0 ${R[2]}, 0 12px 24px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.55)` }}
    >
      {children}
    </motion.button>
  )
}
export function Secenek<T extends string | number>({ deger, secili, onSec, children }: { deger: T; secili: T; onSec: (v: T) => void; children: ReactNode }) {
  const aktif = deger === secili
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onSec(deger)}
      aria-pressed={aktif}
      className={`mk-display flex min-h-[48px] items-center gap-2 rounded-2xl border-2 px-4 text-[17px] text-white transition-colors ${aktif ? 'border-[#ffd23f] bg-[#7c4dff] shadow-[0_0_18px_rgba(255,210,63,0.45)]' : 'border-white/25 bg-white/10 hover:bg-white/20'}`}
    >
      {children}
    </motion.button>
  )
}
