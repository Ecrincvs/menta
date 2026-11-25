import { vary, type Gen } from './helpers'
import * as x from './g1extra'
import { harfEtkinlikleri, harfGen } from './harfEtkinlik'
import { TEMALAR } from './matYolu'
import { problemMix } from './problem1'
import { STAGES } from '../okumaYazma'
import { G1_MATEMATIK } from '../gamesG1'
import { anlamsizCumle, benzetme, boslukAc, buyukHarf, buyukKucuk, cumleKur, harfAvi1, harfHeceSay, heceBirlestir, heceTreni1, karisikHarf, kayipHarf, miMi, miniMetin, noktalama1, olaySirala, resimKelime, resimleTamamla, sesiBul } from './tr1'
import { cokAz, esiniBul, esitlik1, islem1, kacinci, konumKasifi, onlukBirlik, para1, ritmikOruntu, sayiAvcisi1, sekiller1, tahmin, temaDegerlendirme, terazi, uzunluk, veri1, yolBulmaca } from './mat1'
import { ALANLAR } from './hbYolu'
import { yolUreticileri } from '../yollar'
import { anlamDedektifi, deyimAtasozu, heceTreni, kelimeHazinesi, noktalama, okumaHikayesi } from './turkce'
import { bolmePaylasma, carpmaYarisi, geometri, islemRobotu, kesirler, olasilik, para, saatZaman, sayiDedektifi } from './matematik'
import {
  canlilar, dijitalVatandas, dogaCevre, dunyamiz, ekonomi, elektrik, haritaYon, kuvvetMiknatis, madde, okulAile, ortakMiras, saglikliYasam, trafikGuvenlik, ulkem,
} from './diger'

/** Etkinlik kimliği → soru üreticisi (elma-toplama kendi bileşenini kullanır) */
export const GENERATORS: Record<string, Gen> = {
  // ---- 1. sınıf Türkçe (kitap sırası) ----
  'harf-avi': harfAvi1,
  'sesi-bul': sesiBul,
  'buyuk-kucuk': buyukKucuk,
  'hece-birlestir': heceBirlestir,
  'hece-treni': heceTreni1,
  'kayip-harf': kayipHarf,
  'resim-kelime': resimKelime,
  'karisik-harf': karisikHarf,
  'cumle-kur': cumleKur,
  'resimle-tamamla': resimleTamamla,
  'noktalama-1': noktalama1,
  'mini-metin': miniMetin,
  'harf-hece-say': harfHeceSay,
  'bosluk-ac': boslukAc,
  'olay-sirala': olaySirala,
  'buyuk-harf': buyukHarf,
  benzetme,
  'mi-mi': miMi,
  'anlamsiz-cumle': anlamsizCumle,
  'okuma-hikayesi-1': (rng, _g, l, h) => okumaHikayesi(rng, 1, l, h),
  // ---- 1. sınıf Matematik (kitap sırası) ----
  'm1-konum': konumKasifi,
  'm1-yol': yolBulmaca,
  'm1-esini-bul': esiniBul,
  'm1-sayi-avcisi': sayiAvcisi1,
  'm1-onluk-birlik': onlukBirlik,
  'm1-kacinci': kacinci,
  'm1-cok-az': cokAz,
  'm1-ritmik': ritmikOruntu,
  'm1-tahmin': tahmin,
  'm1-uzunluk': uzunluk,
  'm1-terazi': terazi,
  'm1-islem': islem1,
  'm1-esitlik': esitlik1,
  'm1-para': para1,
  'm1-sekiller': sekiller1,
  'm1-veri': veri1,
  'm1-problem': problemMix,
  // ---- 2–4. sınıf ----
  'hece-treni-2': heceTreni,
  'okuma-hikayesi': okumaHikayesi,
  'kelime-hazinesi': kelimeHazinesi,
  noktalama,
  'deyim-atasozu': deyimAtasozu,
  'anlam-dedektifi': anlamDedektifi,
  'sayi-dedektifi': sayiDedektifi,
  'islem-robotu': islemRobotu,
  'carpma-yarisi': carpmaYarisi,
  'bolme-paylasma': bolmePaylasma,
  geometri,
  'saat-zaman': saatZaman,
  kesirler,
  para,
  olasilik,
  'trafik-guvenlik': trafikGuvenlik,
  'saglikli-yasam': saglikliYasam,
  ulkem,
  'doga-cevre': dogaCevre,
  'okul-aile': okulAile,
  canlilar,
  madde,
  'kuvvet-miknatis': kuvvetMiknatis,
  elektrik,
  dunyamiz,
  'harita-yon': haritaYon,
  ekonomi,
  'ortak-miras': ortakMiras,
  'dijital-vatandas': dijitalVatandas,
}

// çeşitlilik: seçmeli soruların arasına eşleştirme, cevap yazma ve hafıza soruları (öğretici etkileşim)
const V: Record<string, [Gen[], number?]> = {
  'm1-sayi-avcisi': [[x.sayYaz, x.sayiGrupEsle]],
  'm1-onluk-birlik': [[x.onlukEsle, x.blokYaz]],
  'm1-cok-az': [[x.farkYaz]],
  'm1-ritmik': [[x.ritmikYaz]],
  'm1-uzunluk': [[x.atasYaz]],
  'm1-islem': [[x.islemEsle, x.islemYaz, x.islemHafiza], 0.5],
  'm1-esitlik': [[x.bilinmeyenYaz]],
  'm1-para': [[x.paraEsle, x.paraToplamYaz]],
  'm1-sekiller': [[x.sekilHafiza, x.nesneSekilEsle, x.koseYaz], 0.5],
  'm1-veri': [[x.grafikYaz]],
  'harf-avi': [[x.harfHafiza], 0.3],
  'buyuk-kucuk': [[x.buyukKucukEsle, x.harfHafiza], 0.5],
  'resim-kelime': [[x.resimKelimeEsle, x.resimKelimeHafiza], 0.5],
  'kayip-harf': [[x.kayipHarfYaz], 0.5],
  'hece-treni': [[x.heceEsle], 0.35],
  'harf-hece-say': [[x.heceSayYaz], 0.5],
}
for (const [id, [extras, p]] of Object.entries(V)) GENERATORS[id] = vary(GENERATORS[id], extras, p ?? 0.4)

// tema değerlendirmeleri: o temanın bölümlerini karıştırır
for (const g of G1_MATEMATIK) if (g.mix) GENERATORS[g.id] = temaDegerlendirme(g.mix.map((id) => GENERATORS[id]))

// Okuma Yazma Yolu: her harf durağı
// Matematik Yolu: 7 tema adası (my-<tema>-<tür>)
for (const t of TEMALAR) for (const a of t.acts) GENERATORS[`my-${t.id}-${a.kind}`] = a.gen
// Hayat Bilgisi Yolu: 6 öğrenme alanı adası (hb-<alan>-<tür>)
for (const t of ALANLAR) for (const a of t.acts) GENERATORS[`hb-${t.id}-${a.kind}`] = a.gen
// 2. sınıf kitap yolları (tr2-, my2-, hb2-)
for (const [id, gen] of yolUreticileri()) GENERATORS[id] = gen
// Okuma Yazma Yolu: her harf için etkinlikler + harf oyunu (oy-<harf>-<tür>)
for (const st of STAGES) for (const k of harfEtkinlikleri(st.letter)) GENERATORS[`oy-${st.letter}-${k}`] = harfGen(st.letter, k)
