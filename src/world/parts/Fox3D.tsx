import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * 3D Fındık — 2D maskotla aynı renk ve parçalar (turuncu kürk, krem yanak, turkuaz atkı, pirinç gözlük).
 * Adadaki patika eğrisi boyunca yürür, ara sıra durup etrafa bakar.
 */
export function Fox3D({ path, speed = 0.035 }: { path: [number, number, number][]; speed?: number }) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const legs = useRef<THREE.Mesh[]>([])
  const t = useRef(0)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(...p)), true), [path])

  useFrame(({ clock }, dt) => {
    const time = clock.elapsedTime
    // her 9 saniyede ~2 sn dur (etrafı izle)
    const walking = time % 9 < 7
    if (walking) t.current = (t.current + dt * speed) % 1
    const p = curve.getPointAt(t.current)
    const ahead = curve.getPointAt((t.current + 0.01) % 1)
    if (root.current) {
      root.current.position.copy(p)
      const yaw = Math.atan2(ahead.x - p.x, ahead.z - p.z)
      root.current.rotation.y = walking ? yaw : yaw + Math.sin(time * 2) * 0.6
    }
    const step = walking ? time * 10 : 0
    if (body.current) body.current.position.y = 0.42 + (walking ? Math.abs(Math.sin(step)) * 0.06 : Math.sin(time * 2) * 0.01)
    legs.current.forEach((l, i) => l && (l.rotation.x = walking ? Math.sin(step + (i % 2 ? Math.PI : 0)) * 0.6 : 0))
    if (tail.current) tail.current.rotation.y = Math.sin(time * (walking ? 6 : 3)) * 0.4
  })

  const fur = <meshStandardMaterial color="#f5862b" roughness={0.7} />
  const cream = <meshStandardMaterial color="#fff3e2" roughness={0.8} />
  const dark = <meshStandardMaterial color="#3a2012" roughness={0.6} />

  return (
    <group ref={root} scale={1.05}>
      {[
        [-0.15, 0.15],
        [0.15, 0.15],
        [-0.15, -0.15],
        [0.15, -0.15],
      ].map(([x, z], i) => (
        <mesh key={i} ref={(el) => el && (legs.current[i] = el)} position={[x, 0.2, z]} castShadow>
          <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
          {dark}
        </mesh>
      ))}
      <group ref={body}>
        <mesh castShadow scale={[1, 0.95, 1.2]}>
          <sphereGeometry args={[0.32, 20, 16]} />
          {fur}
        </mesh>
        <mesh position={[0, -0.04, 0.2]} scale={[0.7, 0.8, 0.6]}>
          <sphereGeometry args={[0.28, 16, 12]} />
          {cream}
        </mesh>
        {/* atkı */}
        <mesh position={[0, 0.2, 0.18]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.2, 0.06, 10, 24]} />
          <meshStandardMaterial color="#2ec4c9" roughness={0.6} />
        </mesh>
        {/* kafa */}
        <group position={[0, 0.45, 0.25]}>
          <mesh castShadow scale={[1.1, 1, 1]}>
            <sphereGeometry args={[0.32, 24, 18]} />
            {fur}
          </mesh>
          <mesh position={[0, -0.1, 0.18]} scale={[1, 0.7, 0.9]}>
            <sphereGeometry args={[0.22, 16, 12]} />
            {cream}
          </mesh>
          <mesh position={[0, -0.06, 0.37]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            {dark}
          </mesh>
          {[-0.12, 0.12].map((x) => (
            <mesh key={x} position={[x, 0.04, 0.28]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              {dark}
            </mesh>
          ))}
          {/* kulaklar */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.19, 0.3, 0]} rotation={[0, 0, s * -0.3]}>
              <mesh castShadow>
                <coneGeometry args={[0.12, 0.3, 12]} />
                {fur}
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <coneGeometry args={[0.05, 0.08, 10]} />
                {dark}
              </mesh>
            </group>
          ))}
          {/* kaşif gözlüğü */}
          {[-0.11, 0.11].map((x) => (
            <mesh key={x} position={[x, 0.2, 0.22]} rotation={[-0.5, 0, 0]}>
              <torusGeometry args={[0.065, 0.025, 8, 16]} />
              <meshStandardMaterial color="#e2a945" metalness={0.4} roughness={0.3} />
            </mesh>
          ))}
        </group>
        {/* kuyruk */}
        <group ref={tail} position={[0, 0.05, -0.32]}>
          <mesh position={[0, 0.12, -0.2]} rotation={[-0.9, 0, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.35, 6, 12]} />
            {fur}
          </mesh>
          <mesh position={[0, 0.32, -0.38]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            {cream}
          </mesh>
        </group>
      </group>
    </group>
  )
}
