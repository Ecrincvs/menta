import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

/** Basit, tohumlu 1B gürültü (açıya bağlı kenar dalgalanması) */
function wobble(seed: number) {
  const a = [Math.sin(seed * 12.9) * 0.5 + 0.5, Math.sin(seed * 78.2) * 0.5 + 0.5, Math.sin(seed * 37.7) * 0.5 + 0.5]
  return (t: number) =>
    1 +
    0.07 * Math.sin(t * 3 + a[0] * 6) +
    0.05 * Math.sin(t * 5 + a[1] * 6) +
    0.03 * Math.sin(t * 9 + a[2] * 6)
}

/** Çim kapak: dalgalı kenarlı, yuvarlatılmış kenarlı (bevel) extrude */
function makeTop(radius: number, seed: number) {
  const w = wobble(seed)
  const shape = new THREE.Shape()
  const N = 72
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    const r = radius * w(t)
    const x = Math.cos(t) * r
    const y = Math.sin(t) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelSize: 0.45,
    bevelThickness: 0.35,
    bevelSegments: 4,
    curveSegments: 72,
  })
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, -0.85, 0)
  geo.computeVertexNormals()
  return geo
}

/** Kaya alt kısım: aşağı doğru daralan, katmanlı, köşeli (stilize kaya) */
function makeRock(radius: number, depth: number, seed: number) {
  const w = wobble(seed)
  const N = 40
  const K = 9
  const pos: number[] = []
  const col: number[] = []
  const cTop = new THREE.Color('#d9a066')
  const cMid = new THREE.Color('#b97b4b')
  const cBot = new THREE.Color('#7d5236')
  const band = new THREE.Color('#e8b77d')
  const rings: THREE.Vector3[][] = []
  for (let k = 0; k <= K; k++) {
    const f = k / K
    // profil: üstte geniş, sonra hızla daralan sivri uç
    const s = k === K ? 0 : Math.pow(1 - f, 0.85) * (1 - 0.12 * Math.sin(f * Math.PI * 3))
    const y = -0.45 - f * depth
    const ring: THREE.Vector3[] = []
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2
      const jag = 1 + 0.08 * Math.sin(i * 2.3 + k * 1.7 + seed)
      const r = radius * 0.98 * w(t) * s * jag
      ring.push(new THREE.Vector3(Math.cos(t) * r, y + 0.25 * Math.sin(i * 1.3 + k + seed) * (k > 0 ? 1 : 0), Math.sin(t) * r))
    }
    rings.push(ring)
  }
  const colorAt = (k: number) => {
    const f = k / K
    const c = f < 0.5 ? cTop.clone().lerp(cMid, f * 2) : cMid.clone().lerp(cBot, (f - 0.5) * 2)
    if (k === 2 || k === 5) c.lerp(band, 0.45)
    return c
  }
  for (let k = 0; k < K; k++) {
    for (let i = 0; i < N; i++) {
      const a = rings[k][i]
      const b = rings[k][(i + 1) % N]
      const c = rings[k + 1][i]
      const d = rings[k + 1][(i + 1) % N]
      const ca = colorAt(k)
      const cc = colorAt(k + 1)
      for (const [v, cl] of [
        [a, ca], [c, cc], [b, ca],
        [b, ca], [c, cc], [d, cc],
      ] as [THREE.Vector3, THREE.Color][]) {
        pos.push(v.x, v.y, v.z)
        col.push(cl.r, cl.g, cl.b)
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  geo.computeVertexNormals()
  return geo
}

export function FloatingIsland({
  radius = 8,
  depth = 7,
  seed = 1,
  grass = '#7ccf4c',
  ...props
}: { radius?: number; depth?: number; seed?: number; grass?: string } & ThreeElements['group']) {
  const top = useMemo(() => makeTop(radius, seed), [radius, seed])
  const rock = useMemo(() => makeRock(radius, depth, seed), [radius, depth, seed])
  return (
    <group {...props}>
      <mesh geometry={top} receiveShadow castShadow>
        <meshStandardMaterial color={grass} roughness={0.85} />
      </mesh>
      {/* çim kenar sarkması: koyu yeşil ince halka */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.0, radius * 0.97, 0.35, 48]} />
        <meshStandardMaterial color="#5aa83a" roughness={0.9} />
      </mesh>
      <mesh geometry={rock} castShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} />
      </mesh>
    </group>
  )
}
