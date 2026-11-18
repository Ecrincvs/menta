import { motion } from 'framer-motion'
import { Mascot } from '../characters/Mascot'

/** 3D dünya yüklenirken gösterilen sevimli bekleme ekranı */
export function LoadingIsland() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-2">
        <Mascot pose="run" size={150} />
        <motion.p
          className="mk-title text-[30px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          Dünya hazırlanıyor...
        </motion.p>
      </div>
    </div>
  )
}
