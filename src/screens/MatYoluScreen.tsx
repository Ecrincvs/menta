/**
 * MATEMATİK YOLU — 1. sınıf Matematik kitabının 7 teması birer "tema adası" (ortak ada ekranları: YolScreen).
 */
import { Robo } from '../characters/Robo'
import { TEMALAR } from '../content/generators/matYolu'
import { temaOyunlari } from '../content/matYoluGames'
import { YolAda, YolHarita, type YolConfig } from './YolScreen'

const MAT_YOLU: YolConfig = {
  title: 'Matematik Yolu',
  icon: 'abacus',
  color: '#9b6ef3',
  backdrop: 'park',
  unit: 'Tema',
  adalar: TEMALAR,
  oyunlari: temaOyunlari,
  adaScreen: (id) => ({ name: 'tema', tema: id }),
  host: (pose, size) => <Robo pose={pose} size={size} />,
  hostName: 'Robo',
  doneMsg: 'Muhteşem! Bütün matematik adalarını tamamladın!',
}

export const MatYoluScreen = () => <YolHarita cfg={MAT_YOLU} />
export const TemaScreen = ({ temaId }: { temaId: string }) => <YolAda cfg={MAT_YOLU} temaId={temaId} />
