import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

type G = ThreeElements['group']
const tmp = new THREE.Object3D()
const tmpColor = new THREE.Color()

/* ------------------------------------------------------------------ */
/* AĞAÇLAR — yuvarlak taçlı yaprak ağaçları, tek draw call/parça        */
/* ------------------------------------------------------------------ */
export interface TreeSpec {
  p: [number, number, number]
  s: number
  kind?: 'round' | 'pine'
  tint?: number
}

const LEAF = ['#5cb83a', '#74c94a', '#4aa43a', '#8fd14f', '#3f9a45']

export function Trees({ trees }: { trees: TreeSpec[] }) {
  const round = trees.filter((t) => t.kind !== 'pine')
  const pine = trees.filter((t) => t.kind === 'pine')
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const leafRef = useRef<THREE.InstancedMesh>(null)
  const pineTrunkRef = useRef<THREE.InstancedMesh>(null)
  const pineRef = useRef<THREE.InstancedMesh>(null)

  // 3 küre/ağaç → taç kümesi
  const blobs = useMemo(() => {
    const out: { p: THREE.Vector3; s: number; c: string }[] = []
    round.forEach((t, i) => {
      const [x, y, z] = t.p
      const c = LEAF[(t.tint ?? i) % LEAF.length]
      out.push({ p: new THREE.Vector3(x, y + 1.55 * t.s, z), s: 0.95 * t.s, c })
      out.push({ p: new THREE.Vector3(x + 0.5 * t.s, y + 1.2 * t.s, z + 0.15 * t.s), s: 0.68 * t.s, c })
      out.push({ p: new THREE.Vector3(x - 0.45 * t.s, y + 1.25 * t.s, z - 0.2 * t.s), s: 0.7 * t.s, c })
    })
    return out
  }, [round])

  useLayoutEffect(() => {
    {
      if (trunkRef.current) {
        round.forEach((t, i) => {
          tmp.position.set(t.p[0], t.p[1] + 0.5 * t.s, t.p[2])
          tmp.scale.setScalar(t.s)
          tmp.rotation.set(0, 0, 0)
          tmp.updateMatrix()
          trunkRef.current!.setMatrixAt(i, tmp.matrix)
        })
        trunkRef.current.instanceMatrix.needsUpdate = true
      }
      if (leafRef.current) {
        blobs.forEach((b, i) => {
          tmp.position.copy(b.p)
          tmp.scale.setScalar(b.s)
          tmp.updateMatrix()
          leafRef.current!.setMatrixAt(i, tmp.matrix)
          leafRef.current!.setColorAt(i, tmpColor.set(b.c))
        })
        leafRef.current.instanceMatrix.needsUpdate = true
        if (leafRef.current.instanceColor) leafRef.current.instanceColor.needsUpdate = true
      }
      if (pineTrunkRef.current && pineRef.current) {
        let k = 0
        pine.forEach((t, i) => {
          tmp.position.set(t.p[0], t.p[1] + 0.35 * t.s, t.p[2])
          tmp.scale.setScalar(t.s)
          tmp.updateMatrix()
          pineTrunkRef.current!.setMatrixAt(i, tmp.matrix)
          for (let j = 0; j < 3; j++) {
            tmp.position.set(t.p[0], t.p[1] + (0.95 + j * 0.55) * t.s, t.p[2])
            tmp.scale.set(t.s * (1 - j * 0.24), t.s * 0.9, t.s * (1 - j * 0.24))
            tmp.updateMatrix()
            pineRef.current!.setMatrixAt(k, tmp.matrix)
            pineRef.current!.setColorAt(k, tmpColor.set(j % 2 ? '#3f9a45' : '#2f8a4a'))
            k++
          }
        })
        pineTrunkRef.current.instanceMatrix.needsUpdate = true
        pineRef.current.instanceMatrix.needsUpdate = true
        if (pineRef.current.instanceColor) pineRef.current.instanceColor.needsUpdate = true
      }
    }
  }, [round, pine, blobs])

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, Math.max(1, round.length)]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 1, 8]} />
        <meshStandardMaterial color="#8a5a32" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[undefined, undefined, Math.max(1, blobs.length)]} castShadow receiveShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={pineTrunkRef} args={[undefined, undefined, Math.max(1, pine.length)]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.7, 6]} />
        <meshStandardMaterial color="#7a4e2c" />
      </instancedMesh>
      <instancedMesh ref={pineRef} args={[undefined, undefined, Math.max(1, pine.length * 3)]} castShadow>
        <coneGeometry args={[0.7, 1, 10]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* ÇİÇEKLER                                                            */
/* ------------------------------------------------------------------ */
const FLOWER_COLORS = ['#ff7aa8', '#ffd23f', '#ffffff', '#9b6ef3', '#ff9a2e', '#5ab8f5']
export function Flowers({ points }: { points: [number, number, number][] }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const stem = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    {
      if (ref.current && stem.current) {
      points.forEach((p, i) => {
        tmp.position.set(p[0], p[1] + 0.22, p[2])
        tmp.scale.setScalar(0.11 + (i % 3) * 0.02)
        tmp.updateMatrix()
        ref.current!.setMatrixAt(i, tmp.matrix)
        ref.current!.setColorAt(i, tmpColor.set(FLOWER_COLORS[i % FLOWER_COLORS.length]))
        tmp.position.set(p[0], p[1] + 0.1, p[2])
        tmp.scale.set(1, 1, 1)
        tmp.updateMatrix()
        stem.current!.setMatrixAt(i, tmp.matrix)
      })
      ref.current.instanceMatrix.needsUpdate = true
      stem.current.instanceMatrix.needsUpdate = true
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
      }
    }
  }, [points])
  return (
    <group>
      <instancedMesh ref={stem} args={[undefined, undefined, Math.max(1, points.length)]}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 4]} />
        <meshStandardMaterial color="#3f9a45" />
      </instancedMesh>
      <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, points.length)]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.6} emissive="#ffffff" emissiveIntensity={0.08} />
      </instancedMesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* SU — akan doku (canvas) ile şelale ve nehir                          */
/* ------------------------------------------------------------------ */
function makeWaterTexture(vertical: boolean) {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 64, 0)
  grad.addColorStop(0, '#6fd6f7')
  grad.addColorStop(0.5, '#a9ecff')
  grad.addColorStop(1, '#5cc8ef')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 256)
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(255,255,255,${0.35 + Math.random() * 0.5})`
    const x = Math.random() * 64
    const y = Math.random() * 256
    g.fillRect(x, y, 2 + Math.random() * 4, vertical ? 18 + Math.random() * 40 : 6 + Math.random() * 14)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function Waterfall({ width = 2, height = 8, speed = 1.2, ...props }: { width?: number; height?: number; speed?: number } & G) {
  const tex = useMemo(() => {
    const t = makeWaterTexture(true)
    t.repeat.set(1, height / 4)
    return t
  }, [height])
  const foam = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    tex.offset.y += dt * speed
    if (foam.current) {
      const t = performance.now() / 1000
      foam.current.children.forEach((m, i) => {
        const s = 0.85 + 0.2 * Math.sin(t * 4 + i * 1.7)
        m.scale.setScalar(s)
      })
    }
  })
  return (
    <group {...props}>
      <mesh position={[0, -height / 2, 0]}>
        <planeGeometry args={[width, height, 1, 1]} />
        <meshStandardMaterial map={tex} transparent opacity={0.92} roughness={0.2} emissive="#7fdcff" emissiveIntensity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <group ref={foam} position={[0, -height, 0.2]}>
        {[-0.6, 0, 0.6, -0.3, 0.3].map((x, i) => (
          <mesh key={i} position={[x * width * 0.6, (i % 2) * 0.15, (i % 3) * 0.15]}>
            <sphereGeometry args={[0.45 * (width / 2), 12, 10]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function River({ points, width = 1.4 }: { points: [number, number, number][]; width?: number }) {
  const { geo, tex } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
    const N = 80
    const pos: number[] = []
    const uv: number[] = []
    const idx: number[] = []
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const p = curve.getPointAt(t)
      const tan = curve.getTangentAt(t)
      const side = new THREE.Vector3(-tan.z, 0, tan.x).normalize().multiplyScalar(width / 2)
      pos.push(p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z)
      uv.push(0, t * 6, 1, t * 6)
      if (i < N) {
        const a = i * 2
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.setIndex(idx)
    g.computeVertexNormals()
    const tx = makeWaterTexture(false)
    return { geo: g, tex: tx }
  }, [points, width])
  useFrame((_, dt) => {
    tex.offset.y -= dt * 0.5
  })
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.15} emissive="#59c8f0" emissiveIntensity={0.2} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* KÖPRÜ — sarkan tahta köprü                                          */
/* ------------------------------------------------------------------ */
export function Bridge({ from, to, sag = 0.5 }: { from: [number, number, number]; to: [number, number, number]; sag?: number }) {
  const planks = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const len = dir.length()
    const n = Math.max(6, Math.round(len / 0.42))
    const yaw = Math.atan2(dir.x, dir.z)
    return Array.from({ length: n + 1 }).map((_, i) => {
      const t = i / n
      const p = a.clone().lerp(b, t)
      p.y -= Math.sin(t * Math.PI) * sag
      return { p, yaw, i }
    })
  }, [from, to, sag])
  return (
    <group>
      {planks.map(({ p, yaw, i }) => (
        <group key={i} position={p} rotation={[0, yaw, 0]}>
          <mesh castShadow receiveShadow rotation={[0, 0, (i % 2 ? 1 : -1) * 0.03]}>
            <boxGeometry args={[1.3, 0.12, 0.34]} />
            <meshStandardMaterial color={i % 2 ? '#c98a4b' : '#b97a3f'} roughness={0.9} />
          </mesh>
          {i % 3 === 0 && (
            <>
              <mesh position={[-0.65, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.06, 0.7, 6]} />
                <meshStandardMaterial color="#7a4a22" />
              </mesh>
              <mesh position={[0.65, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.06, 0.7, 6]} />
                <meshStandardMaterial color="#7a4a22" />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* BULUTLAR — yumuşak küre kümeleri, yavaşça süzülür                    */
/* ------------------------------------------------------------------ */
export function Cloud({ scale = 1, speed = 0.02, radius = 30, angle = 0, height = 6, ...props }: { scale?: number; speed?: number; radius?: number; angle?: number; height?: number } & G) {
  const ref = useRef<THREE.Group>(null)
  const a = useRef(angle)
  useFrame((_, dt) => {
    a.current += dt * speed
    if (ref.current) ref.current.position.set(Math.cos(a.current) * radius, height + Math.sin(a.current * 3) * 0.3, Math.sin(a.current) * radius - 6)
  })
  const puffs = useMemo(
    () => [
      [0, 0, 0, 1.4],
      [1.4, -0.2, 0.2, 1.05],
      [-1.4, -0.25, 0, 1.0],
      [0.6, 0.6, -0.2, 0.95],
      [-0.7, 0.45, 0.3, 0.85],
      [2.4, -0.45, 0, 0.7],
      [-2.3, -0.5, -0.1, 0.65],
    ],
    [],
  )
  return (
    <group ref={ref} scale={scale} {...props}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={1} emissive="#e8f6ff" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* SICAK HAVA BALONU                                                   */
/* ------------------------------------------------------------------ */
export function HotAirBalloon({ colors = ['#ff7aa8', '#ffd23f'], phase = 0, ...props }: { colors?: [string, string]; phase?: number } & G) {
  const ref = useRef<THREE.Group>(null)
  const base = useRef<THREE.Vector3 | null>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    if (!base.current) base.current = ref.current.position.clone()
    const t = clock.elapsedTime + phase
    ref.current.position.y = base.current.y + Math.sin(t * 0.6) * 0.6
    ref.current.position.x = base.current.x + Math.sin(t * 0.15) * 1.2
    ref.current.rotation.y = t * 0.2
  })
  return (
    <group ref={ref} {...props}>
      {/* dilimli zarf */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]} castShadow>
          <sphereGeometry args={[1.2, 10, 16, 0, Math.PI / 4, 0, Math.PI * 0.82]} />
          <meshStandardMaterial color={colors[i % 2]} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.38, 0.25, 0.25, 12]} />
        <meshStandardMaterial color={colors[0]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        return (
          <mesh key={i} position={[Math.cos(a) * 0.3, -1.55, Math.sin(a) * 0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 4]} />
            <meshStandardMaterial color="#6b3a1a" />
          </mesh>
        )
      })}
      <mesh position={[0, -2.0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.4, 0.55]} />
        <meshStandardMaterial color="#b97a3f" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* KUŞLAR — kanat çırpan küçük V'ler                                    */
/* ------------------------------------------------------------------ */
export function Birds({ count = 5, radius = 14, height = 9 }: { count?: number; radius?: number; height?: number }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((b, i) => {
      if (!b) return
      const a = t * 0.25 + i * 0.5
      const r = radius + (i % 2) * 1.5
      b.position.set(Math.cos(a) * r, height + Math.sin(t + i) * 0.4 + i * 0.2, Math.sin(a) * r - 4)
      b.rotation.y = -a
      const flap = Math.sin(t * 10 + i) * 0.6
      ;(b.children[0] as THREE.Object3D).rotation.z = flap
      ;(b.children[1] as THREE.Object3D).rotation.z = -flap
    })
  })
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} scale={0.5}>
          <mesh position={[-0.3, 0, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.25]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.25]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#ffe08a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* TAVŞAN — zıplayan küçük hayvan                                       */
/* ------------------------------------------------------------------ */
export function Bunny({ center = [0, 0, 0] as [number, number, number], radius = 1.2, speed = 0.6, ...props }: { center?: [number, number, number]; radius?: number; speed?: number } & G) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * speed
    const a = t
    ref.current.position.set(center[0] + Math.cos(a) * radius, center[1] + Math.abs(Math.sin(t * 6)) * 0.25, center[2] + Math.sin(a) * radius)
    ref.current.rotation.y = -a
  })
  return (
    <group ref={ref} {...props} scale={0.45}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.45, 14, 12]} />
        <meshStandardMaterial color="#f7f3ee" />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0.3]}>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color="#f7f3ee" />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, 1.3, 0.25]} rotation={[0.2, 0, x]}>
          <capsuleGeometry args={[0.07, 0.4, 4, 8]} />
          <meshStandardMaterial color="#f7f3ee" />
        </mesh>
      ))}
      <mesh position={[0, 0.45, -0.45]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.92, 0.58]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#2b170c" />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* KRİSTALLER (arka tepe)                                               */
/* ------------------------------------------------------------------ */
export function Crystals(props: G) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.children.forEach((c, i) => ((c as THREE.Mesh).position.y = c.userData.y + Math.sin(clock.elapsedTime * 1.5 + i) * 0.05))
  })
  const list: [number, number, number, number, string][] = [
    [0, 0.9, 0, 0.9, '#c9a6ff'],
    [0.6, 0.6, 0.2, 0.6, '#9fe8ff'],
    [-0.55, 0.55, 0.15, 0.55, '#ffb8e0'],
    [0.2, 0.45, 0.55, 0.45, '#c9a6ff'],
  ]
  return (
    <group ref={ref} {...props}>
      {list.map(([x, y, z, s, c], i) => (
        <mesh key={i} position={[x, y, z]} userData={{ y }} scale={[s * 0.6, s * 1.4, s * 0.6]} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.45} roughness={0.15} metalness={0.1} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  )
}

export function Rock({ s = 0.5, color = '#a99a8a', ...props }: { s?: number; color?: string } & G) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow scale={[s, s * 0.7, s]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.95} />
      </mesh>
    </group>
  )
}
