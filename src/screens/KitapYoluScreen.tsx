/**
 * KİTAP YOLU (2. sınıf ve sonrası) — content/yollar.ts kaydındaki her yol için ortak harita + ada ekranı.
 */
import { Mascot } from '../characters/Mascot'
import { Robo } from '../characters/Robo'
import { adaOyunlari, yolBul } from '../content/yollar'
import { YolAda, YolHarita, type YolConfig } from './YolScreen'

function cfgFor(yolId: string): YolConfig | null {
  const y = yolBul(yolId)
  if (!y) return null
  return {
    title: `${y.sinif}. Sınıf ${y.baslik}`,
    icon: y.icon,
    color: y.renk,
    backdrop: y.backdrop,
    unit: y.birim,
    adalar: y.adalar,
    oyunlari: (id) => adaOyunlari(y.id, id),
    adaScreen: (id) => ({ name: 'ada', yol: y.id, ada: id }),
    host: (pose, size) => (y.host === 'robo' ? <Robo pose={pose} size={size} /> : <Mascot pose={pose} size={size} />),
    hostName: y.host === 'robo' ? 'Robo' : 'Fındık',
    doneMsg: y.bitis,
  }
}

export function KitapYoluScreen({ yolId }: { yolId: string }) {
  const cfg = cfgFor(yolId)
  return cfg ? <YolHarita cfg={cfg} /> : null
}
export function KitapAdaScreen({ yolId, adaId }: { yolId: string; adaId: string }) {
  const cfg = cfgFor(yolId)
  return cfg ? <YolAda cfg={cfg} temaId={adaId} /> : null
}
