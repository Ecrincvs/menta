/**
 * BİNAYA GİRİŞ GEÇİŞİ — referans: "Menta – Ev Kapısı Açılma Animasyonu (Adım Adım)"
 * 1 evi seç → 2 yakınlaşma (~0.6 sn) → 3 kapı aydınlanır (~0.5 sn) → 4 kapı açılır, içerisi görünür (~0.75 sn)
 * → 5 geçiş: kamera kapının ışığına doğru ilerler → ışınlanma (ışık ekranı doldurur)
 * → 6 ev içi menü (ders dünyası).
 */
import type { SubjectId } from '../content/types'
import type { BackdropKind } from '../components/Backdrop'

/** adım sınırları (saniye, tıklamadan itibaren) */
/** approach: dünyada binaya yaklaşma · closeup: yakın çekim tam görünür · glow: kapı parlıyor, açılmaya başlar · open: kapı açık
 *  gather: kamera kapının ışığına vardı, ışınlanma · through: dersin dünyası ışığın içinden belirdi */
export const STEP = { approach: 0.7, closeup: 1.15, glow: 2.0, open: 2.5, gather: 3.45, through: 4.2 }
/** toplam süre (ms): bu sürenin sonunda ders dünyasına geçilir */
export const ENTER_MS = 4250

/** her binanın içi = o dersin dünyasının arka planı (kapının ardında görünür, sonra ekranı doldurur) */
export const SUBJECT_BG: Record<SubjectId, BackdropKind> = { turkce: 'forest', matematik: 'park', fen: 'lab', hayat: 'town', tarih: 'history' }
