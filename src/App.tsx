import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useGame, type Screen } from './state/store'
import type { SubjectId } from './content/types'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { GradeSelectScreen } from './screens/GradeSelectScreen'
import { WorldOverlay } from './screens/WorldScreen'
import { SubjectScreen } from './screens/SubjectScreen'
import { AvatarScreen } from './screens/AvatarScreen'
import { ParentScreen } from './screens/ParentScreen'
import { OkumaYazmaScreen } from './screens/OkumaYazmaScreen'
import { GameHost } from './games/GameHost'
import { LoadingIsland } from './components/LoadingIsland'
import { stopSpeaking } from './audio/speech'
import { useBackgroundArt } from './art/artRegistry'
import { setLearnedIdx } from './content/letters'

const WorldScene = lazy(() => import('./world/WorldScene'))
const PaintedWorld = lazy(() => import('./world/PaintedWorld'))

function screenKey(s: Screen) {
  if (s.name === 'subject') return `subject-${s.subject}`
  if (s.name === 'game') return `game-${s.gameId}`
  return s.name
}

export default function App() {
  const screen = useGame((s) => s.screen)
  const calm = useGame((s) => s.settings.calm)
  const [focus, setFocus] = useState<SubjectId | null>(null)
  const worldArt = useBackgroundArt('world')
  const world3d = useGame((s) => s.settings.world3d)
  const letterIdx = useGame((s) => s.letterIdx)
  // soru üreticileri öğrenilen harfi buradan okur
  setLearnedIdx(letterIdx ?? 11)
  const select = (s: SubjectId) => window.dispatchEvent(new CustomEvent('mk-select', { detail: s }))
  const worldVisible = screen.name === 'welcome' || screen.name === 'world'

  useEffect(() => {
    // ekran değişince yarım kalan konuşmayı kes, odak sıfırla
    stopSpeaking()
    if (screen.name !== 'world') setFocus(null)
  }, [screen])

  return (
    <MotionConfig reducedMotion={calm ? 'always' : 'user'}>
      <div className={`relative h-full w-full overflow-hidden ${calm ? 'calm' : ''}`}>
        {/* Kalıcı 3D dünya katmanı: karşılama ve dünya ekranlarında aynı sahne (yeniden yükleme yok) */}
        {worldVisible && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(1200px 600px at 78% 8%, #fff7cf 0%, rgba(255,247,207,0) 55%), linear-gradient(180deg, #5ab8f5 0%, #9fdcff 45%, #dff4ff 100%)',
            }}
          >
            <Suspense fallback={<LoadingIsland />}>
              <div className="absolute inset-0" style={{ pointerEvents: screen.name === 'world' ? 'auto' : 'none' }}>
                {worldArt && !world3d ? (
                  <PaintedWorld src={worldArt} focus={focus} showLabels={screen.name === 'world'} onSelect={select} />
                ) : (
                  <WorldScene focus={focus} showLabels={screen.name === 'world'} onSelect={select} />
                )}
              </div>
            </Suspense>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey(screen)}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: 'none' }}
          >
            {/* dünya ekranında katman tıklamaları 3D sahneye geçirir; etkileşimli öğeler kendileri 'auto' alır */}
            <div className="absolute inset-0" style={{ pointerEvents: screen.name === 'world' ? 'none' : 'auto' }} data-screen={screen.name}>
              {screen.name === 'welcome' && <WelcomeScreen />}
              {screen.name === 'grade' && <GradeSelectScreen />}
              {screen.name === 'world' && <WorldOverlay focus={focus} setFocus={setFocus} />}
              {screen.name === 'subject' && <SubjectScreen subject={screen.subject} />}
              {screen.name === 'game' && <GameHost gameId={screen.gameId} />}
              {screen.name === 'avatar' && <AvatarScreen />}
              {screen.name === 'parent' && <ParentScreen />}
              {screen.name === 'okuma-yazma' && <OkumaYazmaScreen />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
