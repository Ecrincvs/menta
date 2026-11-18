import { lazy, Suspense, useState, type ComponentType } from 'react'
import { gameById } from '../content/games'
import { LoadingIsland } from '../components/LoadingIsland'
import { useGame } from '../state/store'
import { CandyButton } from '../components/ui/Controls'

/** Oyun kaydı — her oyun ayrı parça (lazy) olarak yüklenir */
const REGISTRY: Record<string, ComponentType<{ onReplay: () => void }>> = {
  'elma-toplama': lazy(() => import('./ElmaToplama')),
}
const QuizGame = lazy(() => import('./quiz/QuizGame'))

export function GameHost({ gameId }: { gameId: string }) {
  const [run, setRun] = useState(0)
  const back = useGame((s) => s.back)
  const meta = gameById(gameId)
  const Game = REGISTRY[gameId]
  if (!meta || !meta.available) {
    return (
      <div className="grid h-full place-items-center">
        <div className="mk-card p-8 text-center">
          <p className="mk-display mb-4 text-[26px]">Bu oyun çok yakında burada!</p>
          <CandyButton onClick={back}>Geri dön</CandyButton>
        </div>
      </div>
    )
  }
  return (
    <Suspense fallback={<LoadingIsland />}>
      {Game ? <Game key={run} onReplay={() => setRun((r) => r + 1)} /> : <QuizGame key={run} gameId={gameId} onReplay={() => setRun((r) => r + 1)} />}
    </Suspense>
  )
}
