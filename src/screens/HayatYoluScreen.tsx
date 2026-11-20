/**
 * HAYAT BİLGİSİ YOLU — 1. sınıf Hayat Bilgisi kitabının 6 öğrenme alanı birer "ada" (ortak ada ekranları: YolScreen).
 */
import { Mascot } from '../characters/Mascot'
import { ALANLAR } from '../content/generators/hbYolu'
import { alanOyunlari } from '../content/hbYoluGames'
import { YolAda, YolHarita, type YolConfig } from './YolScreen'

const HB_YOLU: YolConfig = {
  title: 'Hayat Bilgisi Yolu',
  icon: 'housegarden',
  color: '#f08a24',
  backdrop: 'town',
  unit: 'Öğrenme Alanı',
  adalar: ALANLAR,
  oyunlari: alanOyunlari,
  adaScreen: (id) => ({ name: 'hb-alan', alan: id }),
  host: (pose, size) => <Mascot pose={pose} size={size} />,
  hostName: 'Fındık',
  doneMsg: 'Harikasın! Bütün Hayat Bilgisi adalarını tamamladın!',
}

export const HayatYoluScreen = () => <YolHarita cfg={HB_YOLU} />
export const AlanScreen = ({ alanId }: { alanId: string }) => <YolAda cfg={HB_YOLU} temaId={alanId} />
