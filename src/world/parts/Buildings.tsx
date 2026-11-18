import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type G = ThreeElements['group']

const M = ({ c, r = 0.7, e, ei = 0 }: { c: string; r?: number; e?: string; ei?: number }) => (
  <meshStandardMaterial color={c} roughness={r} emissive={e ?? '#000'} emissiveIntensity={ei} />
)

/** Sıcak ışıklı pencere */
function Window({ p, w = 0.38, h = 0.46, frame = '#7a4a22' }: { p: [number, number, number]; w?: number; h?: number; frame?: string }) {
  return (
    <group position={p}>
      <RoundedBox args={[w + 0.1, h + 0.1, 0.06]} radius={0.04} smoothness={3}>
        <M c={frame} />
      </RoundedBox>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#ffe28a" emissive="#ffc93c" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.03, h, 0.01]} />
        <M c={frame} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[w, 0.03, 0.01]} />
        <M c={frame} />
      </mesh>
    </group>
  )
}

function Door({ p, color = '#8a4a22' }: { p: [number, number, number]; color?: string }) {
  return (
    <group position={p}>
      <RoundedBox args={[0.5, 0.75, 0.08]} radius={0.06} smoothness={3} position={[0, 0.375, 0]}>
        <M c={color} />
      </RoundedBox>
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 16, 1, false, 0, Math.PI]} />
        <M c={color} />
      </mesh>
      <mesh position={[0.15, 0.38, 0.06]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <M c="#ffd23f" r={0.3} />
      </mesh>
    </group>
  )
}

/* ============ TÜRKÇE — Kitap Evi ============ */
export function BookHouse(props: G) {
  const pages = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (pages.current) pages.current.rotation.z = Math.sin(clock.elapsedTime * 1.4) * 0.12 - 0.2
  })
  return (
    <group {...props}>
      {/* temel */}
      <RoundedBox args={[2.2, 0.2, 1.8]} radius={0.08} position={[0, 0.1, 0]} receiveShadow>
        <M c="#d9c3a0" />
      </RoundedBox>
      {/* duvarlar */}
      <RoundedBox args={[1.9, 1.3, 1.5]} radius={0.12} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <M c="#fff1d6" />
      </RoundedBox>
      {/* ahşap kirişler */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.85, 0.76]} castShadow>
          <boxGeometry args={[0.12, 1.3, 0.06]} />
          <M c="#b5652f" />
        </mesh>
      ))}
      <Door p={[0, 0.2, 0.76]} color="#c0392b" />
      <Window p={[-0.55, 1.0, 0.77]} />
      <Window p={[0.55, 1.0, 0.77]} />
      {/* çatı: açık kitap */}
      <group position={[0, 1.55, 0]}>
        {[-1, 1].map((s) => (
          <group key={s} rotation={[0, 0, s * -0.42]} position={[s * 0.52, 0.22, 0]}>
            <RoundedBox args={[1.25, 0.1, 1.85]} radius={0.04} castShadow>
              <M c="#e0453a" />
            </RoundedBox>
            <RoundedBox args={[1.15, 0.14, 1.7]} radius={0.05} position={[0, 0.1, 0]} castShadow>
              <M c="#fffaf0" r={0.9} />
            </RoundedBox>
            {/* sayfa çizgileri */}
            {[-0.3, -0.1, 0.1, 0.3].map((z) => (
              <mesh key={z} position={[0, 0.175, z]}>
                <boxGeometry args={[0.8, 0.005, 0.03]} />
                <M c="#c9b89a" />
              </mesh>
            ))}
          </group>
        ))}
        {/* uçuşan sayfa */}
        <group ref={pages} position={[0.15, 0.55, 0]}>
          <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.7, 0.02, 1.4]} />
            <M c="#ffffff" />
          </mesh>
        </group>
        {/* kitap sırtı */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.85, 12]} />
          <M c="#b8302c" />
        </mesh>
      </group>
      {/* yan kitap yığını */}
      <group position={[1.35, 0.2, 0.55]}>
        {[
          ['#5ab8f5', 0.0, 0.1],
          ['#5bc236', 0.2, -0.15],
          ['#ffd23f', 0.4, 0.08],
        ].map(([c, y, r], i) => (
          <RoundedBox key={i} args={[0.6, 0.18, 0.45]} radius={0.04} position={[0, (y as number) + 0.09, 0]} rotation={[0, r as number, 0]} castShadow>
            <M c={c as string} />
          </RoundedBox>
        ))}
      </group>
      {/* sokak lambası */}
      <group position={[-1.3, 0.2, 0.7]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 8]} />
          <M c="#3d2b1f" />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#fff2b0" emissive="#ffd23f" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  )
}

/* ============ MATEMATİK — Sayılar Konağı ============ */
function SymbolBlock({ p, color, sym, rot = 0 }: { p: [number, number, number]; color: string; sym: '+' | '-' | 'x' | '÷'; rot?: number }) {
  const ref = useRef<THREE.Group>(null)
  const phase = useRef(Math.random() * 6)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = p[1] + Math.sin(clock.elapsedTime * 1.3 + phase.current) * 0.08
  })
  const white = <M c="#ffffff" r={0.4} />
  const bar = (rz: number, key: string) => (
    <mesh key={key} position={[0, 0, 0.29]} rotation={[0, 0, rz]}>
      <boxGeometry args={[0.36, 0.09, 0.03]} />
      {white}
    </mesh>
  )
  return (
    <group ref={ref} position={p} rotation={[0, rot, 0]}>
      <RoundedBox args={[0.56, 0.56, 0.56]} radius={0.09} smoothness={4} castShadow>
        <M c={color} r={0.5} />
      </RoundedBox>
      {sym === '+' && [bar(0, 'a'), bar(Math.PI / 2, 'b')]}
      {sym === '-' && bar(0, 'a')}
      {sym === 'x' && [bar(Math.PI / 4, 'a'), bar(-Math.PI / 4, 'b')]}
      {sym === '÷' && (
        <>
          {bar(0, 'a')}
          {[0.12, -0.12].map((y) => (
            <mesh key={y} position={[0, y, 0.29]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              {white}
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

export function MathHouse(props: G) {
  return (
    <group {...props}>
      <RoundedBox args={[2.2, 0.2, 1.8]} radius={0.08} position={[0, 0.1, 0]} receiveShadow>
        <M c="#d6c8ee" />
      </RoundedBox>
      <RoundedBox args={[1.8, 1.4, 1.4]} radius={0.14} smoothness={4} position={[0, 0.9, 0]} castShadow receiveShadow>
        <M c="#b48cff" />
      </RoundedBox>
      {/* çatı (yuvarlak üçgen prizma) */}
      <mesh position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.45, 0.9, 4]} />
        <M c="#7d55d9" />
      </mesh>
      <Door p={[0, 0.2, 0.71]} color="#ffd23f" />
      <Window p={[-0.5, 1.05, 0.72]} frame="#5a37a8" />
      <Window p={[0.5, 1.05, 0.72]} frame="#5a37a8" />
      {/* uçan sembol blokları */}
      <SymbolBlock p={[-0.75, 2.65, 0.1]} color="#ffd23f" sym="+" rot={0.2} />
      <SymbolBlock p={[0.0, 3.0, 0.0]} color="#2ec4c9" sym="x" rot={-0.1} />
      <SymbolBlock p={[0.75, 2.6, 0.15]} color="#ff9a2e" sym="-" rot={-0.25} />
      <SymbolBlock p={[1.25, 1.75, 0.5]} color="#5bc236" sym="÷" rot={-0.4} />
      {/* bahçe geometrik şekilleri */}
      <mesh position={[-1.3, 0.45, 0.6]} castShadow>
        <coneGeometry args={[0.32, 0.55, 4]} />
        <M c="#ff7aa8" />
      </mesh>
      <mesh position={[-1.25, 0.38, -0.3]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <M c="#5ab8f5" />
      </mesh>
      <mesh position={[1.3, 0.38, -0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.36, 16]} />
        <M c="#ffd23f" />
      </mesh>
    </group>
  )
}

/* ============ FEN — Keşif Laboratuvarı ============ */
export function LabHouse(props: G) {
  const liquid = useRef<THREE.Mesh>(null)
  const scope = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (liquid.current) (liquid.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.25
    if (scope.current) scope.current.rotation.y = Math.sin(t * 0.4) * 0.5
  })
  return (
    <group {...props}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.25, 0.2, 32]} />
        <M c="#cfd8e8" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.0, 1.1, 32]} />
        <M c="#eef0ff" />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[1.02, 1.02, 0.14, 32]} />
        <M c="#8c6fe0" />
      </mesh>
      {/* cam kubbe */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#bfe9ff" transparent opacity={0.45} roughness={0.05} />
      </mesh>
      {/* dev deney şişesi */}
      <group position={[0, 1.55, 0]}>
        <mesh ref={liquid}>
          <sphereGeometry args={[0.45, 24, 20]} />
          <meshStandardMaterial color="#b07cff" emissive="#9b6ef3" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.6, 16]} />
          <meshStandardMaterial color="#dff6ff" transparent opacity={0.7} roughness={0.05} />
        </mesh>
        {/* baloncuklar */}
        {[0, 1, 2].map((i) => (
          <Bubble key={i} i={i} />
        ))}
      </group>
      <Door p={[0, 0.2, 0.95]} color="#2ec4c9" />
      <Window p={[-0.6, 0.85, 0.78]} frame="#5a6aa8" />
      {/* teleskop */}
      <group ref={scope} position={[0.95, 1.4, -0.3]}>
        <mesh rotation={[0, 0, 0.9]} position={[0.2, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.16, 0.9, 16]} />
          <M c="#5a6aa8" r={0.4} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <M c="#333" />
        </mesh>
      </group>
    </group>
  )
}

function Bubble({ i }: { i: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * 0.6 + i / 3) % 1
    ref.current.position.set(Math.sin(i * 2 + t * 6) * 0.08, 0.9 + t * 1.1, 0)
    ref.current.scale.setScalar(0.5 + t)
    ;(ref.current.material as THREE.MeshStandardMaterial).opacity = 1 - t
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshStandardMaterial color="#e6d6ff" transparent emissive="#c9a6ff" emissiveIntensity={0.5} />
    </mesh>
  )
}

/* ============ HAYAT BİLGİSİ — Mutlu Mahalle ============ */
export function LifeHouse(props: G) {
  const lights = useRef<THREE.Mesh[]>([])
  useFrame(({ clock }) => {
    const phase = Math.floor(clock.elapsedTime / 2) % 3
    lights.current.forEach((m, i) => {
      if (m) (m.material as THREE.MeshStandardMaterial).emissiveIntensity = i === phase ? 1.4 : 0.05
    })
  })
  return (
    <group {...props}>
      <RoundedBox args={[2.0, 0.2, 1.7]} radius={0.08} position={[0, 0.1, 0]} receiveShadow>
        <M c="#d6e8c8" />
      </RoundedBox>
      <RoundedBox args={[1.5, 1.1, 1.2]} radius={0.12} smoothness={4} position={[0, 0.75, 0]} castShadow receiveShadow>
        <M c="#9fd3ff" />
      </RoundedBox>
      <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.25, 0.8, 4]} />
        <M c="#4f7fd9" />
      </mesh>
      <mesh position={[0.45, 1.85, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.45, 0.22]} />
        <M c="#c0392b" />
      </mesh>
      <Door p={[0, 0.2, 0.61]} color="#ff9a2e" />
      <Window p={[-0.45, 0.85, 0.62]} frame="#2f5aa8" />
      <Window p={[0.45, 0.85, 0.62]} frame="#2f5aa8" />
      {/* trafik ışığı */}
      <group position={[1.15, 0.2, 0.55]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.1, 8]} />
          <M c="#3a3a3a" />
        </mesh>
        <RoundedBox args={[0.26, 0.64, 0.2]} radius={0.06} position={[0, 1.3, 0]} castShadow>
          <M c="#2f2f2f" />
        </RoundedBox>
        {['#ff4d4d', '#ffcf33', '#3ddc6a'].map((c, i) => (
          <mesh key={c} ref={(el) => el && (lights.current[i] = el)} position={[0, 1.5 - i * 0.2, 0.105]}>
            <circleGeometry args={[0.07, 16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.1} />
          </mesh>
        ))}
      </group>
      {/* bank */}
      <group position={[-1.1, 0.2, 0.55]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.7, 0.06, 0.25]} />
          <M c="#c98a4b" />
        </mesh>
        <mesh position={[0, 0.42, -0.11]}>
          <boxGeometry args={[0.7, 0.2, 0.04]} />
          <M c="#c98a4b" />
        </mesh>
      </group>
    </group>
  )
}

/* ============ KEŞİF VE TARİH — Zaman Kalesi ============ */
export function CastleHouse(props: G) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.8
  })
  const stone = '#e3c9a0'
  const stoneDark = '#c7a97c'
  return (
    <group {...props}>
      <RoundedBox args={[2.4, 0.2, 2.0]} radius={0.08} position={[0, 0.1, 0]} receiveShadow>
        <M c={stoneDark} />
      </RoundedBox>
      <RoundedBox args={[1.8, 1.0, 1.3]} radius={0.06} position={[0, 0.7, 0]} castShadow receiveShadow>
        <M c={stone} r={0.9} />
      </RoundedBox>
      {/* mazgallar */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((x) => (
        <mesh key={x} position={[x, 1.3, 0.55]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <M c={stone} r={0.9} />
        </mesh>
      ))}
      {[
        [-0.95, -0.65],
        [0.95, -0.65],
        [-0.95, 0.65],
        [0.95, 0.65],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.34, 1.6, 16]} />
            <M c={stone} r={0.9} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow>
            <coneGeometry args={[0.4, 0.6, 16]} />
            <M c="#ff8a3d" />
          </mesh>
          <mesh position={[0, 2.38, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <M c="#ffd23f" />
          </mesh>
        </group>
      ))}
      <Door p={[0, 0.2, 0.66]} color="#7a4a22" />
      {/* zaman makinesi halkası */}
      <group position={[0, 2.0, 0]}>
        <mesh ref={ring}>
          <torusGeometry args={[0.45, 0.07, 12, 32]} />
          <meshStandardMaterial color="#ffd23f" emissive="#ffb000" emissiveIntensity={0.5} metalness={0.3} roughness={0.3} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.38, 32]} />
          <meshStandardMaterial color="#6fd6f7" emissive="#59c8f0" emissiveIntensity={0.7} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
