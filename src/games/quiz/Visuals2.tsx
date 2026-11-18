/**
 * 1. sınıf matematik kitabının görsel modelleri (docs/meb-kitaplar/analiz/matematik-1.md):
 * konum sahnesi, kareli zeminde yol, sıra dizisi, uzunluk, eşit kollu terazi, örüntü, nesne grafiği, çetele, alt alta işlem.
 */
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { Relation, Visual } from './types'
import { Obj } from '../../components/ui/Obj'

const INK = '#4a2c17'

export function ExtraVisual({ v, s }: { v: Visual; s: number }) {
  switch (v.kind) {
    case 'position':
      return <Position subject={v.subject} refImg={v.ref} rel={v.rel} third={v.third} s={s} />
    case 'grid':
      return <Grid v={v} s={s} />
    case 'row':
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-1.5">
            {v.imgs.map((img, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="relative grid place-items-center rounded-2xl p-1"
                style={{ background: v.highlight === i ? '#fff3a0' : 'transparent', boxShadow: v.highlight === i ? '0 0 0 4px #ffb020' : 'none' }}
              >
                <Obj name={img} size={Math.max(34, 62 - v.imgs.length * 2) * s * 1.4} shadow={false} />
              </motion.div>
            ))}
          </div>
          {v.arrow && (
            <div className="flex items-center gap-2 text-[14px] font-black text-[var(--mk-ink-soft)]">
              {v.arrow === 'ltr' ? 'Baş → ' : '← Baş'}
              <svg width="120" height="12" viewBox="0 0 120 12" aria-hidden>
                <path d={v.arrow === 'ltr' ? 'M2 6 H110 M104 1 L114 6 L104 11' : 'M118 6 H10 M16 1 L6 6 L16 11'} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      )
    case 'lengths':
      return (
        <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-3">
          {v.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              {it.label && <span className="mk-display w-8 text-center text-[22px]">{it.label}</span>}
              <div className="flex flex-col">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: it.len * 26 * s * 1.6 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 120, damping: 18 }}
                  className="relative h-7 rounded-l-md"
                  style={{ background: `linear-gradient(180deg, ${it.color}, ${it.color}cc)`, boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.4), 0 3px 0 rgba(0,0,0,0.15)' }}
                >
                  <span className="absolute -right-4 top-0 h-0 w-0 border-y-[14px] border-l-[16px] border-y-transparent" style={{ borderLeftColor: '#f3d9a4' }} />
                </motion.div>
                {v.unit && (
                  <div className="mt-1 flex gap-[2px]">
                    {Array.from({ length: v.unit.count[i] ?? 0 }).map((_, k) => (
                      <Obj key={k} name={v.unit!.img} size={24 * s * 1.6} shadow={false} style={{ width: 26 * s * 1.6 - 2 }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    case 'balance':
      return <Balance v={v} s={s} />
    case 'pattern':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {v.items.map((img, i) =>
            img ? (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} className="rounded-2xl bg-white/80 p-1.5">
                <Obj name={img} size={58 * s * 1.4} shadow={false} />
              </motion.div>
            ) : (
              <span key={i} className="mk-display grid h-[82px] w-[82px] place-items-center rounded-2xl border-4 border-dashed border-[#ff9a2e] bg-white text-[40px]">
                ?
              </span>
            ),
          )}
        </div>
      )
    case 'pictograph':
      return (
        <div className="rounded-2xl border-4 border-[#e9cf9c] bg-white/90 p-2">
          {v.rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2 border-b-2 border-dashed border-[#efe0c0] py-1 last:border-0">
              <span className="mk-display w-[92px] text-right text-[18px]">{r.label}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: r.count }).map((_, k) => (
                  <motion.div key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 + k * 0.03 }}>
                    <Obj name={r.img} size={30 * s * 1.5} shadow={false} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-1 text-center text-[12px] font-black text-[var(--mk-ink-soft)]">Her resim 1 tane gösterir.</p>
        </div>
      )
    case 'tally':
      return (
        <div className="rounded-2xl border-4 border-[#e9cf9c] bg-white/90 p-2">
          {v.rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3 border-b-2 border-dashed border-[#efe0c0] py-1.5 last:border-0">
              {r.img && <Obj name={r.img} size={34} shadow={false} />}
              <span className="mk-display w-[80px] text-[18px]">{r.label}</span>
              <Tally n={r.count} />
            </div>
          ))}
        </div>
      )
    case 'column':
      return (
        <div className="mk-wood rounded-[22px] px-6 py-3">
          <div className="mk-title grid grid-cols-[auto_auto] gap-x-3 text-right text-[clamp(36px,4.6vw,56px)] leading-[1.05]">
            <span />
            <span>{v.a}</span>
            <span>{v.op}</span>
            <span>{v.b}</span>
            <span className="col-span-2 my-1 h-1.5 rounded bg-white" />
            <span />
            <span className="text-[#ffe066]">?</span>
          </div>
        </div>
      )
    default:
      return null
  }
}

function Tally({ n }: { n: number }) {
  const groups = Math.floor(n / 5)
  const rest = n % 5
  return (
    <svg width={groups * 46 + rest * 9 + 10} height="40" viewBox={`0 0 ${groups * 46 + rest * 9 + 10} 40`} aria-label={`${n} çetele çizgisi`}>
      {Array.from({ length: groups }).map((_, g) => (
        <g key={g} transform={`translate(${4 + g * 46} 4)`}>
          {[0, 1, 2, 3].map((k) => (
            <line key={k} x1={k * 9} y1="0" x2={k * 9} y2="32" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          ))}
          <line x1="-4" y1="28" x2="31" y2="4" stroke="#e8463c" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      ))}
      {Array.from({ length: rest }).map((_, k) => (
        <line key={k} x1={4 + groups * 46 + k * 9} y1="4" x2={4 + groups * 46 + k * 9} y2="36" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      ))}
    </svg>
  )
}

/** konum sahnesi: referans nesne + özne (izleyiciye göre sağ/sol) */
function Position({ subject, refImg, rel, third, s }: { subject: string; refImg: string; rel: Relation; third?: string; s: number }) {
  const W = 300 * s * 1.3
  const H = 230 * s * 1.3
  const R = 120 * s * 1.3
  const P = 78 * s * 1.3
  const refPos: CSSProperties = { left: (W - R) / 2, top: H - R - 10 }
  let subj: CSSProperties = {}
  let subZ = 2
  let subSize = P
  switch (rel) {
    case 'ustunde':
      subj = { left: (W - P) / 2, top: H - R - P + 6 }
      break
    case 'altinda':
      refPos.top = 4
      subj = { left: (W - P) / 2, top: H - P - 4 }
      break
    case 'icinde':
      subSize = P * 0.75
      subj = { left: (W - subSize) / 2, top: H - R / 2 - subSize / 2 - 10 }
      subZ = 1
      break
    case 'disinda':
      subj = { left: W - P + 10, top: H - P - 10 }
      break
    case 'onunde':
      subSize = P * 1.05
      subj = { left: (W - subSize) / 2 - 10, top: H - subSize + 6 }
      subZ = 3
      break
    case 'arkasinda':
      subSize = P * 0.85
      subj = { left: (W - subSize) / 2 + 26, top: H - R - subSize / 2 }
      subZ = 0
      break
    case 'saginda':
      subj = { left: W - P - 2, top: H - P - 10 }
      break
    case 'solunda':
      subj = { left: 2, top: H - P - 10 }
      break
    case 'yaninda':
      subj = { left: (W + R) / 2 - 10, top: H - P - 10 }
      break
    case 'arasinda':
      subj = { left: (W - P) / 2, top: H - P - 10 }
      break
  }
  return (
    <div className="relative rounded-2xl bg-white/50" style={{ width: W, height: H }} role="img" aria-label="konum sahnesi">
      <div className="absolute inset-x-3 bottom-2 h-3 rounded-full bg-[rgba(60,40,10,0.15)]" />
      {rel === 'arasinda' ? (
        <>
          <div className="absolute" style={{ left: 0, top: H - R * 0.8 - 10, zIndex: 1 }}>
            <Obj name={refImg} size={R * 0.8} />
          </div>
          <div className="absolute" style={{ right: 0, top: H - R * 0.8 - 10, zIndex: 1 }}>
            <Obj name={third ?? refImg} size={R * 0.8} />
          </div>
        </>
      ) : (
        <div className="absolute" style={{ ...refPos, zIndex: 1 }}>
          <Obj name={refImg} size={R} />
        </div>
      )}
      <motion.div className="absolute" style={{ ...subj, zIndex: subZ }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
        <Obj name={subject} size={subSize} />
      </motion.div>
    </div>
  )
}

function Grid({ v, s }: { v: Extract<Visual, { kind: 'grid' }>; s: number }) {
  const c = 50 * s * 1.4
  return (
    <div className="relative rounded-2xl border-4 border-[#e9cf9c] bg-white/90 p-1" role="img" aria-label="kareli zemin">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${v.cols}, ${c}px)` }}>
        {Array.from({ length: v.rows * v.cols }).map((_, i) => {
          const x = i % v.cols
          const y = Math.floor(i / v.cols)
          const item = v.items.find((it) => it.at[0] === x && it.at[1] === y)
          const isStart = v.start[0] === x && v.start[1] === y
          const onPath = v.path?.some(([px, py]) => px === x && py === y)
          return (
            <div key={i} className="grid place-items-center rounded-md" style={{ width: c, height: c, background: isStart ? '#d4f6f4' : onPath ? '#fff3a0' : (x + y) % 2 ? '#fdf3dd' : '#fffaf0' }}>
              {isStart ? <Obj name="fox" size={c * 0.8} shadow={false} /> : item ? <Obj name={item.img} size={c * 0.78} shadow={false} /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Balance({ v, s }: { v: Extract<Visual, { kind: 'balance' }>; s: number }) {
  const ang = v.tilt * 9
  const pan = (side: typeof v.left) => (
    <div className="flex max-w-[150px] flex-wrap items-end justify-center gap-0.5">
      {side.text ? (
        <span className="mk-display rounded-xl bg-white px-2 py-0.5 text-[24px] shadow">{side.text}</span>
      ) : (
        Array.from({ length: side.count ?? 1 }).map((_, i) => <Obj key={i} name={side.img!} size={((side.count ?? 1) > 3 ? 34 : 54) * s * 1.4} shadow={false} />)
      )}
    </div>
  )
  return (
    <div className="relative flex flex-col items-center" style={{ width: 360 * s * 1.3 }} role="img" aria-label="eşit kollu terazi">
      <motion.div className="relative flex w-full items-end justify-between" initial={{ rotate: 0 }} animate={{ rotate: ang }} transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.3 }}>
        <motion.div className="flex w-[44%] flex-col items-center" animate={{ rotate: -ang }} transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.3 }}>
          {pan(v.left)}
          <div className="mt-1 h-3 w-full rounded-b-full bg-[#c98a4b]" />
        </motion.div>
        <motion.div className="flex w-[44%] flex-col items-center" animate={{ rotate: -ang }} transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.3 }}>
          {pan(v.right)}
          <div className="mt-1 h-3 w-full rounded-b-full bg-[#c98a4b]" />
        </motion.div>
        <div className="absolute -bottom-2 left-[6%] right-[6%] h-2.5 rounded-full bg-[#7a4a22]" />
      </motion.div>
      <div className="h-16 w-3 rounded bg-[#7a4a22]" />
      <div className="h-3 w-28 rounded-full bg-[#5c3415]" />
    </div>
  )
}
