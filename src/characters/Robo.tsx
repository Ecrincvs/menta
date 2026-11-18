/** ROBO — matematik oyunlarının rehber robotu (sanat yuvası; yoksa 3D emoji yedeği) */
import { motion } from 'framer-motion'
import { useCharacterArt } from '../art/artRegistry'
import { useGame } from '../state/store'
import { Obj } from '../components/ui/Obj'
import type { MascotPose } from './Mascot'

export function Robo({ pose = 'idle', size = 200 }: { pose?: MascotPose; size?: number }) {
  const art = useCharacterArt('robo', pose === 'wave' ? 'idle' : pose === 'clap' || pose === 'jump' ? 'cheer' : pose)
  const calm = useGame((s) => s.settings.calm)
  const happy = pose === 'cheer' || pose === 'clap' || pose === 'jump'
  return (
    <motion.div
      animate={calm ? {} : { y: happy ? [0, -22, 0] : [0, -8, 0], rotate: pose === 'sad' ? -6 : 0 }}
      transition={{ duration: happy ? 0.7 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size * 1.1 }}
      className="grid place-items-end justify-center"
      role="img"
      aria-label="Robo"
    >
      {art ? <img src={art} alt="" draggable={false} style={{ width: size, height: size * 1.1, objectFit: 'contain' }} /> : <Obj name="robot2" size={size * 0.9} />}
    </motion.div>
  )
}
