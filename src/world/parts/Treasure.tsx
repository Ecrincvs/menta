import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Gizli hazine sandığı — dünyayı keşfetmeyi ödüllendirir.
 * Her sandık günde bir kez açılır (bağımlılık yaratmayan küçük sürpriz).
 */
export function TreasureChest({
  opened,
  onOpen,
  ...props
}: { opened: boolean; onOpen: () => void } & ThreeElements['group']) {
  const lid = useRef<THREE.Group>(null)
  const glow = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)

  useFrame(({ clock }, dt) => {
    if (lid.current) {
      const target = opened ? -1.9 : hover ? -0.25 : 0
      lid.current.rotation.x += (target - lid.current.rotation.x) * Math.min(1, dt * 8)
    }
    if (glow.current) {
      const m = glow.current.material as THREE.MeshStandardMaterial
      m.opacity = opened ? 0 : 0.35 + Math.sin(clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <group
      {...props}
      onClick={(e) => {
        e.stopPropagation()
        if (!opened) {
          onOpen()
          window.dispatchEvent(new CustomEvent('mk-treasure'))
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        document.body.style.cursor = opened ? 'default' : 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'default'
      }}
    >
      <mesh ref={glow} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffd23f" emissiveIntensity={1} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <RoundedBox args={[0.6, 0.36, 0.42]} radius={0.05} position={[0, 0.18, 0]} castShadow>
        <meshStandardMaterial color="#a0612b" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.18, 0.215]}>
        <boxGeometry args={[0.62, 0.06, 0.01]} />
        <meshStandardMaterial color="#e2a945" metalness={0.4} roughness={0.3} />
      </mesh>
      <group ref={lid} position={[0, 0.36, -0.21]}>
        <mesh position={[0, 0.06, 0.21]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.21, 0.21, 0.6, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#b8732f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.42]}>
          <boxGeometry args={[0.1, 0.12, 0.04]} />
          <meshStandardMaterial color="#ffd23f" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
      {opened && (
        <mesh position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#ffd23f" emissive="#ffb000" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
        </mesh>
      )}
    </group>
  )
}
