/**
 * ANA OYUN DÜNYASI — 3D yüzen adalar.
 * Bkz. .claude/skills/3d-environment-designer/SKILL.md
 */
import { OrbitControls, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { SubjectId } from '../content/types'
import { SUBJECTS, subjectOpenFor } from '../content/subjects'
import { useGame } from '../state/store'
import { makeRng } from '../learning/rng'
import { FloatingIsland } from './parts/Island'
import { Birds, Bridge, Bunny, Cloud, Crystals, Flowers, HotAirBalloon, River, Rock, Trees, Waterfall, type TreeSpec } from './parts/Nature'
import { BookHouse, CastleHouse, LabHouse, LifeHouse, MathHouse } from './parts/Buildings'
import { Fox3D } from './parts/Fox3D'
import { TreasureChest } from './parts/Treasure'
import { Obj } from '../components/ui/Obj'
import { sfx } from '../audio/sfx'

type V3 = [number, number, number]

/* ------------------------- yerleşim ------------------------- */
export const BUILDING_POS: Record<SubjectId, { p: V3; rot: number }> = {
  turkce: { p: [-5, 0, 0.6], rot: 0.4 },
  matematik: { p: [0.4, 0, -3.8], rot: 0 },
  fen: { p: [5.3, 0, -0.4], rot: -0.4 },
  hayat: { p: [-10, -1.5, 13], rot: 0.35 },
  tarih: { p: [10, -1.8, 12.5], rot: -0.35 },
}

const PLAZA: V3 = [-0.4, 0, 3.4]
const RIVER_FRONT: V3[] = [
  [3.1, 0.04, 3.9],
  [2.9, 0.04, 5.8],
  [2.5, 0.04, 7.8],
  [2.3, 0.04, 9.7],
]
const RIVER_BACK: V3[] = [
  [-2.8, 0.04, -7.4],
  [-5.2, 0.04, -6.3],
  [-7.5, 0.04, -4.2],
  [-9.7, 0.04, -1.6],
]
const FOX_PATH: V3[] = Array.from({ length: 10 }).map((_, i) => {
  const a = (i / 10) * Math.PI * 2
  return [PLAZA[0] + Math.cos(a) * 2.4, 0.02, PLAZA[2] + Math.sin(a) * 1.9] as V3
})

function dist2(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

function useScatter() {
  return useMemo(() => {
    const rng = makeRng(42)
    const avoid: { p: [number, number]; r: number }[] = [
      ...Object.values(BUILDING_POS)
        .filter((b) => b.p[1] === 0)
        .flatMap((b) => [
          { p: [b.p[0], b.p[2]] as [number, number], r: 2.3 },
          { p: [b.p[0] * 0.85, b.p[2] + 2.6] as [number, number], r: 2.2 },
          { p: [b.p[0] * 0.7, b.p[2] + 4.6] as [number, number], r: 1.8 },
        ]),
      { p: [PLAZA[0], PLAZA[2]], r: 3.4 },
      ...[...RIVER_FRONT, ...RIVER_BACK].map((p) => ({ p: [p[0], p[2]] as [number, number], r: 1.2 })),
      { p: [-5.9, 7.6], r: 1.6 },
      { p: [5.9, 7.4], r: 1.6 },
      { p: [-2.6, -8.2], r: 1.5 },
    ]
    const ok = (x: number, z: number, pad = 0) => avoid.every((a) => dist2([x, z], a.p) > a.r + pad)
    const trees: TreeSpec[] = []
    let tries = 0
    while (trees.length < 26 && tries++ < 800) {
      const a = rng() * Math.PI * 2
      const r = 5.5 + rng() * 3.3
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (z > 6.5 && Math.abs(x) < 4) continue // ön görüşü açık tut
      if (!ok(x, z)) continue
      if (trees.some((t) => dist2([t.p[0], t.p[2]], [x, z]) < 1.5)) continue
      trees.push({ p: [x, 0, z], s: 0.75 + rng() * 0.5, kind: rng() > 0.72 ? 'pine' : 'round', tint: Math.floor(rng() * 5) })
    }
    // ön adalar + arka tepe
    const extra: TreeSpec[] = [
      { p: [-12.2, -1.5, 12], s: 0.9 },
      { p: [-11.6, -1.5, 15], s: 0.7, kind: 'pine' },
      { p: [-7.8, -1.5, 14.6], s: 0.65 },
      { p: [12.4, -1.8, 11.5], s: 0.85, kind: 'pine' },
      { p: [11.8, -1.8, 14.6], s: 0.7 },
      { p: [7.6, -1.8, 14.2], s: 0.6, kind: 'pine' },
      { p: [-5.2, 4.5, -14.5], s: 0.9, kind: 'pine' },
      { p: [0.6, 4.5, -15], s: 0.8, kind: 'pine' },
      { p: [-0.2, 4.5, -11.5], s: 0.7 },
      { p: [-5.6, 4.5, -11.8], s: 0.75 },
    ]
    const flowers: V3[] = []
    tries = 0
    while (flowers.length < 110 && tries++ < 2000) {
      const a = rng() * Math.PI * 2
      const r = Math.sqrt(rng()) * 9
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      if (!ok(x, z, -0.6)) continue
      flowers.push([x, 0, z])
    }
    for (let i = 0; i < 24; i++) {
      const a = rng() * Math.PI * 2
      const r = 1.4 + rng() * 2.2
      const isL = i % 2 === 0
      const c = isL ? BUILDING_POS.hayat.p : BUILDING_POS.tarih.p
      if (r < 1.8) continue
      flowers.push([c[0] + Math.cos(a) * r, c[1], c[2] + Math.sin(a) * r])
    }
    return { trees: [...trees, ...extra], flowers }
  }, [])
}

/* ------------------------- kamera ------------------------- */
type CamMode = { kind: 'intro' } | { kind: 'free' } | { kind: 'focus'; target: THREE.Vector3; pos: THREE.Vector3 }

function CameraRig({ mode, controls, onIntroDone }: { mode: CamMode; controls: React.RefObject<OrbitControlsImpl | null>; onIntroDone: () => void }) {
  const { camera, size } = useThree()
  const start = useRef<number | null>(null)
  const aspect = size.width / size.height
  const k = aspect >= 1.7 ? 1.18 : aspect >= 1.25 ? 1.32 : aspect >= 0.9 ? 1.6 : 2.25
  const home = useMemo(() => new THREE.Vector3(0, 13.5 * k, 26 * k), [k])
  const homeTarget = useMemo(() => new THREE.Vector3(0, -1.2, 3.5), [])
  const from = useMemo(() => new THREE.Vector3(-26, 34, 62), [])
  const done = useRef(false)

  useFrame(({ clock }, dt) => {
    const c = controls.current
    if (mode.kind === 'intro') {
      if (start.current === null) start.current = clock.elapsedTime
      const t = Math.min(1, (clock.elapsedTime - start.current) / 2.6)
      const e = 1 - Math.pow(1 - t, 3)
      camera.position.lerpVectors(from, home, e)
      if (c) {
        c.target.copy(homeTarget)
        c.update()
      } else camera.lookAt(homeTarget)
      if (t >= 1 && !done.current) {
        done.current = true
        onIntroDone()
      }
    } else if (mode.kind === 'focus') {
      const a = 1 - Math.pow(0.02, dt)
      camera.position.lerp(mode.pos, a)
      if (c) {
        c.target.lerp(mode.target, a)
        c.update()
      }
    }
  })
  return null
}

/* ------------------------- etiket ------------------------- */
function BuildingLabel({ subject, locked, onClick }: { subject: SubjectId; locked: boolean; onClick: () => void }) {
  const s = SUBJECTS.find((x) => x.id === subject)!
  const [first, ...rest] = s.name.split(' ')
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={`${s.name}${locked ? ', yakında' : ''}`}
      className="mk-card group relative flex items-center gap-1.5 whitespace-nowrap rounded-[18px] px-3.5 py-1.5 transition-transform hover:scale-110 active:scale-95"
      style={{ borderColor: s.accent, boxShadow: `inset 0 3px 0 #fff, 0 5px 0 ${s.accentDark}, 0 10px 18px rgba(0,0,0,0.25)` }}
    >
      <span className="flex flex-col items-center leading-[0.95]">
        <span className="mk-display text-[19px] text-ink">{first === 'Keşif' ? 'Keşif ve Tarih' : first === 'Hayat' ? 'Hayat Bilgisi' : first === 'Fen' ? 'Fen Bilimleri' : first}</span>
        <span className="mk-display text-[15px] text-[var(--mk-ink-soft)]">{rest[rest.length - 1]}</span>
      </span>
      {locked && (
        <span className="ml-0.5 grid h-8 w-8 place-items-center rounded-full bg-white/80">
          <Obj name="lock" size={24} shadow={false} />
        </span>
      )}
    </button>
  )
}

function Building({
  subject,
  locked,
  onSelect,
  children,
}: {
  subject: SubjectId
  locked: boolean
  onSelect: (s: SubjectId) => void
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const { p, rot } = BUILDING_POS[subject]
  void locked
  useFrame((_, dt) => {
    if (!ref.current) return
    const target = hover ? 1.08 : 1
    const s = ref.current.scale.x + (target - ref.current.scale.x) * Math.min(1, dt * 10)
    ref.current.scale.setScalar(s)
  })
  return (
    <group position={p}>
      <group
        ref={ref}
        rotation={[0, rot, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(subject)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = 'default'
        }}
      >
        {children}
      </group>
    </group>
  )
}

/* ------------------------- etiket projeksiyonu ------------------------- */
const LABEL_IDS = Object.keys(BUILDING_POS) as SubjectId[]
type LabelRefs = React.MutableRefObject<Partial<Record<SubjectId, HTMLDivElement | null>>>

/** 3D bina konumlarını ekrana yansıtır ve DOM etiketlerini taşır (React kökü açmadan, setState olmadan) */
function LabelProjector({ refs }: { refs: LabelRefs }) {
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    for (const id of LABEL_IDS) {
      const el = refs.current[id]
      if (!el) continue
      const p = BUILDING_POS[id].p
      v.set(p[0], p[1] + 3.7, p[2]).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      const dist = Math.hypot(camera.position.x - p[0], camera.position.y - p[1], camera.position.z - p[2])
      const sc = Math.max(0.7, Math.min(1.25, 34 / dist))
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${sc})`
      el.style.opacity = v.z < 1 ? '1' : '0'
    }
  })
  return null
}

/* ------------------------- yüzen dekor adası ------------------------- */
function MiniIsland({ p, r, seed, phase, children }: { p: V3; r: number; seed: number; phase: number; children?: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = p[1] + Math.sin(clock.elapsedTime * 0.5 + phase) * 0.35
  })
  return (
    <group ref={ref} position={p}>
      <FloatingIsland radius={r} depth={r * 1.6} seed={seed} />
      {children}
    </group>
  )
}

/* ------------------------- sahne ------------------------- */
export interface WorldSceneProps {
  onSelect: (s: SubjectId) => void
  focus: SubjectId | null
  showLabels: boolean
}

function SceneContent({ onSelect, focus, labelRefs }: Omit<WorldSceneProps, 'showLabels'> & { labelRefs: LabelRefs }) {
  const quality = useGame((s) => s.settings.quality)
  const calm = useGame((s) => s.settings.calm)
  const treasures = useGame((s) => s.treasures)
  const findTreasure = useGame((s) => s.findTreasure)
  const today = new Date().toISOString().slice(0, 10)
  const found = treasures.day === today ? treasures.found : []
  const controls = useRef<OrbitControlsImpl>(null)
  const [introDone, setIntroDone] = useState(calm)
  const { trees, flowers } = useScatter()

  const mode: CamMode = useMemo(() => {
    if (focus) {
      const b = BUILDING_POS[focus]
      const t = new THREE.Vector3(b.p[0], b.p[1] + 1, b.p[2])
      return { kind: 'focus', target: t, pos: t.clone().add(new THREE.Vector3(0, 3.2, 6.5)) }
    }
    return introDone ? { kind: 'free' } : { kind: 'intro' }
  }, [focus, introDone])

  const grade = useGame((s) => s.grade)
  const locked = (id: SubjectId) => !subjectOpenFor(id, grade)
  const shadows = quality !== 'low'

  return (
    <>
      <hemisphereLight args={['#dff3ff', '#7cbf5a', 1.1]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[14, 22, 10]}
        intensity={2.4}
        color="#fff0d6"
        castShadow={shadows}
        shadow-mapSize={[quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* arka/kenar ışığı: silüetlerde soğuk rim */}
      <directionalLight position={[-10, 8, -18]} intensity={0.7} color="#b9e6ff" />
      <fog attach="fog" args={['#cdeeff', 50, 120]} />
      <CloudSea />

      <CameraRig mode={mode} controls={controls} onIntroDone={() => setIntroDone(true)} />
      <LabelProjector refs={labelRefs} />
      <OrbitControls
        ref={controls}
        enabled={mode.kind === 'free'}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minPolarAngle={0.75}
        maxPolarAngle={1.15}
        minAzimuthAngle={-0.6}
        maxAzimuthAngle={0.6}
        autoRotate={!calm && mode.kind === 'free'}
        autoRotateSpeed={0.15}
      />

      {/* ANA ADA */}
      <FloatingIsland radius={9.5} depth={9} seed={3} />
      {/* meydan + çeşme */}
      <mesh position={[PLAZA[0], 0.02, PLAZA[2]]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 40]} />
        <meshStandardMaterial color="#f3e2bf" roughness={0.95} />
      </mesh>
      <group position={[PLAZA[0], 0, PLAZA[2]]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.75, 0.3, 24]} />
          <meshStandardMaterial color="#d8c7a8" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.06, 24]} />
          <meshStandardMaterial color="#6fd6f7" emissive="#59c8f0" emissiveIntensity={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.7, 12]} />
          <meshStandardMaterial color="#d8c7a8" />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#9fe8ff" emissive="#6fd6f7" emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      </group>
      {/* patika taşları: meydandan binalara */}
      {(['turkce', 'matematik', 'fen'] as SubjectId[]).map((id) => {
        const b = BUILDING_POS[id].p
        const n = 6
        return Array.from({ length: n }).map((_, i) => {
          const t = (i + 1) / (n + 1)
          const x = PLAZA[0] + (b[0] - PLAZA[0]) * t
          const z = PLAZA[2] + (b[2] + 1 - PLAZA[2]) * t
          return (
            <mesh key={`${id}${i}`} position={[x, 0.02, z]} rotation={[0, i, 0]} receiveShadow>
              <cylinderGeometry args={[0.32, 0.34, 0.05, 9]} />
              <meshStandardMaterial color="#efdcb4" roughness={1} />
            </mesh>
          )
        })
      })}

      <River points={RIVER_FRONT} width={1.1} />
      <mesh position={[3.1, 0.035, 3.6]}>
        <cylinderGeometry args={[0.95, 0.95, 0.04, 24]} />
        <meshStandardMaterial color="#7fdcff" emissive="#59c8f0" emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
      <Rock position={[3.9, 0.1, 3.0]} s={0.45} />
      <Waterfall position={[2.3, 0.04, 9.85]} width={1.1} height={10} />
      <River points={RIVER_BACK} width={1.0} />
      <mesh position={[-2.8, 0.035, -7.7]}>
        <cylinderGeometry args={[1.1, 1.1, 0.04, 24]} />
        <meshStandardMaterial color="#7fdcff" emissive="#59c8f0" emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
      <Waterfall position={[-9.85, 0.04, -1.6]} rotation={[0, -Math.PI / 2, 0]} width={1} height={9} />

      {/* BİNALAR */}
      <Building subject="turkce" locked={locked('turkce')} onSelect={onSelect}>
        <BookHouse />
      </Building>
      <Building subject="matematik" locked={locked('matematik')} onSelect={onSelect}>
        <MathHouse />
      </Building>
      <Building subject="fen" locked={locked('fen')} onSelect={onSelect}>
        <LabHouse />
      </Building>

      {/* ÖN SOL ADA — Hayat Bilgisi */}
      <FloatingIsland radius={4.2} depth={5} seed={7} position={[-10, -1.5, 13]} />
      <Building subject="hayat" locked={locked('hayat')} onSelect={onSelect}>
        <LifeHouse />
      </Building>
      <Bridge from={[-5.9, 0.0, 7.7]} to={[-7.7, -1.45, 10.0]} sag={0.25} />

      {/* ÖN SAĞ ADA — Keşif ve Tarih */}
      <FloatingIsland radius={4.2} depth={5.5} seed={11} position={[10, -1.8, 12.5]} />
      <Building subject="tarih" locked={locked('tarih')} onSelect={onSelect}>
        <CastleHouse />
      </Building>
      <Bridge from={[5.9, 0.0, 7.5]} to={[7.7, -1.75, 9.6]} sag={0.25} />

      {/* ARKA KRİSTAL TEPESİ */}
      <FloatingIsland radius={5} depth={7} seed={5} position={[-2.5, 4.5, -13.5]} grass="#86d65a" />
      <Crystals position={[-3.2, 4.5, -14]} scale={1.3} />
      <group position={[0.8, 4.5, -13.8]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 2.4, 20]} />
          <meshStandardMaterial color="#efe3ff" />
        </mesh>
        <mesh position={[0, 2.8, 0]} castShadow>
          <coneGeometry args={[0.75, 1.1, 20]} />
          <meshStandardMaterial color="#9b6ef3" />
        </mesh>
        <mesh position={[0, 1.5, 0.52]}>
          <circleGeometry args={[0.2, 16]} />
          <meshStandardMaterial color="#ffe28a" emissive="#ffc93c" emissiveIntensity={0.9} />
        </mesh>
      </group>
      <Waterfall position={[-2.6, 4.5, -8.45]} width={1.3} height={4.6} />
      <River points={[[-3.2, 4.54, -12], [-2.9, 4.54, -10], [-2.6, 4.54, -8.4]]} width={1.1} />

      {/* UZAK YÜZEN ADALAR */}
      <MiniIsland p={[17, 3, -9]} r={2.2} seed={13} phase={0}>
        <Trees trees={[{ p: [0, 0, 0], s: 0.8 }]} />
        <TreasureChest
          position={[0.9, 0, 0.7]}
          opened={found.includes('uzak-ada')}
          onOpen={() => {
            if (findTreasure('uzak-ada', 15)) sfx('coin')
          }}
        />
      </MiniIsland>
      <MiniIsland p={[-18, 5, -7]} r={2.5} seed={17} phase={2}>
        <Trees trees={[{ p: [0.4, 0, -0.3], s: 0.9, kind: 'pine' }, { p: [-0.8, 0, 0.5], s: 0.6 }]} />
      </MiniIsland>
      <MiniIsland p={[13, 8, -24]} r={2} seed={19} phase={4} />
      <MiniIsland p={[-13, -5, -22]} r={2.4} seed={23} phase={1}>
        <Crystals scale={0.7} />
      </MiniIsland>

      {/* DOĞA */}
      <Trees trees={trees} />
      {quality !== 'low' && <Flowers points={flowers} />}
      <Rock position={[-8.3, 0.1, 3.5]} s={0.5} />
      <Rock position={[7.6, 0.1, -3.6]} s={0.6} color="#b8a48e" />
      <Rock position={[-11.6, -1.4, 10.8]} s={0.4} />

      {/* GİZLİ HAZİNELER */}
      <TreasureChest
        position={[7.3, 0, -5.2]}
        rotation={[0, -0.6, 0]}
        opened={found.includes('agac-arkasi')}
        onOpen={() => {
          if (findTreasure('agac-arkasi', 15)) sfx('coin')
        }}
      />
      <TreasureChest
        position={[-4.6, 4.5, -11.4]}
        rotation={[0, 0.4, 0]}
        opened={found.includes('kristal-tepe')}
        onOpen={() => {
          if (findTreasure('kristal-tepe', 15)) sfx('coin')
        }}
      />

      {/* CANLILAR */}
      <Fox3D path={FOX_PATH} />
      <Bunny center={[-10.5, -1.5, 14.6]} radius={1.1} />
      <Bunny center={[3.5, 0, -6.5]} radius={0.9} speed={0.45} />
      <Birds count={quality === 'low' ? 3 : 6} />

      {/* GÖKYÜZÜ */}
      <Cloud radius={30} angle={0.2} height={9} scale={1.6} speed={0.012} />
      <Cloud radius={34} angle={1.6} height={5} scale={2} speed={0.01} />
      <Cloud radius={28} angle={2.8} height={12} scale={1.3} speed={0.014} />
      <Cloud radius={32} angle={4.2} height={2} scale={1.8} speed={0.011} />
      <Cloud radius={26} angle={5.4} height={-6} scale={2.4} speed={0.008} />
      <HotAirBalloon position={[-14, 9, 2]} colors={['#ff7aa8', '#ffd23f']} />
      <HotAirBalloon position={[15, 11, -2]} colors={['#2ec4c9', '#ffffff']} phase={2} scale={0.8} />
      <HotAirBalloon position={[4, 15, -18]} colors={['#9b6ef3', '#ff9a2e']} phase={4} scale={0.7} />
      {quality === 'high' && !calm && <Sparkles count={60} scale={[26, 10, 26]} position={[0, 4, 0]} size={4} speed={0.3} color="#fff6b0" />}
    </>
  )
}

/** Adaların altında bulut denizi: adalar gökyüzünde durur */
function CloudSea() {
  const ref = useRef<THREE.Group>(null)
  const puffs = useMemo(() => {
    const rng = makeRng(7)
    return Array.from({ length: 46 }).map(() => {
      const a = rng() * Math.PI * 2
      const r = 6 + rng() * 34
      return { p: [Math.cos(a) * r, -13 - rng() * 4, Math.sin(a) * r - 2] as V3, s: 3 + rng() * 4.5 }
    })
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.004
  })
  return (
    <group ref={ref}>
      {puffs.map((c, i) => (
        <mesh key={i} position={c.p} scale={[c.s, c.s * 0.55, c.s]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#eaf6ff" emissiveIntensity={0.45} roughness={1} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  )
}

function Effects() {
  const quality = useGame((s) => s.settings.quality)
  if (quality === 'low') return null
  if (quality === 'medium')
    return (
      <EffectComposer>
        <Vignette offset={0.3} darkness={0.4} />
      </EffectComposer>
    )
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.78} intensity={0.6} />
      <Vignette offset={0.3} darkness={0.45} />
      <SMAA />
    </EffectComposer>
  )
}

export default function WorldScene({ showLabels, ...props }: WorldSceneProps) {
  const quality = useGame((s) => s.settings.quality)
  const labelRefs: LabelRefs = useRef({})
  const dpr: [number, number] = quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [1, 1]
  return (
    <div className="absolute inset-0">
    <Canvas
      shadows={quality !== 'low'}
      dpr={dpr}
      camera={{ position: [-26, 34, 62], fov: 38, near: 0.5, far: 220 }}
      gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Suspense fallback={null}>
        <SceneContent {...props} labelRefs={labelRefs} />
        <Effects />
      </Suspense>
    </Canvas>
      {/* bina etiketleri (DOM): erişilebilir butonlar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ visibility: showLabels ? 'visible' : 'hidden' }}>
        {LABEL_IDS.map((id) => (
          <div
            key={id}
            ref={(el) => {
              labelRefs.current[id] = el
            }}
            className="pointer-events-auto absolute left-0 top-0 will-change-transform"
            style={{ transform: 'translate(-9999px,-9999px)' }}
          >
            <BuildingLabel subject={id} locked={!subjectOpenFor(id, useGame.getState().grade)} onClick={() => props.onSelect(id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
