import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'
import { adBenzersiz, adTemizle, botCevap, botYap, cevapIsle, odul, puanHesapla, sirala, takimPuanlari, type Ayar, type Oyuncu, type YSoru } from '../yarisma/motor'
import { kategorilerFor, soruSeti, KATEGORILER } from '../yarisma/sorular'
import { OdaYonetici, SURE } from '../yarisma/oda'
import { makeRng } from './rng'

const yeni = (id: string, extra: Partial<Oyuncu> = {}): Oyuncu => ({ id, ad: id, avatar: 'kasif-pembe', puan: 0, seri: 0, dogru: 0, cevaplar: {}, ...extra })
const soru: YSoru = { prompt: '2 + 2 = ?', options: [{ label: '3' }, { label: '4' }, { label: '5' }, { label: '6' }], answer: 1, explain: '2 + 2 = 4', konu: 'Toplama' }

describe('Yarışma — puanlama', () => {
  it('yanlış cevap puan almaz, eksi puan yok', () => {
    expect(puanHesapla(false, 100, 20000, 0)).toBe(0)
  })
  it('doğru cevap: 500 taban + en çok 300 hız; öğrenme hızdan ağır basar', () => {
    expect(puanHesapla(true, 0, 20000, 1)).toBe(800)
    expect(puanHesapla(true, 20000, 20000, 1)).toBe(500)
    // en yavaş doğru, en hızlı yanlıştan her zaman fazla
    expect(puanHesapla(true, 19999, 20000, 1)).toBeGreaterThan(puanHesapla(false, 1, 20000, 0))
  })
  it('seri bonusu adım adım artar ve sınırlıdır', () => {
    const a = puanHesapla(true, 20000, 20000, 2)
    const b = puanHesapla(true, 20000, 20000, 3)
    expect(b - a).toBe(50)
    expect(puanHesapla(true, 20000, 20000, 50)).toBe(500 + 4 * 50)
  })
  it('aynı soruya ikinci cevap sayılmaz; seri yanlışta sıfırlanır', () => {
    let o = cevapIsle(yeni('a'), 0, 1, 1000, soru, 20000)
    const p = o.puan
    o = cevapIsle(o, 0, 1, 500, soru, 20000)
    expect(o.puan).toBe(p)
    expect(o.seri).toBe(1)
    o = cevapIsle(o, 1, 0, 500, soru, 20000)
    expect(o.seri).toBe(0)
    expect(o.dogru).toBe(1)
  })
  it('sıralama: puan, sonra doğru sayısı', () => {
    const l = sirala([yeni('a', { puan: 100, dogru: 1 }), yeni('b', { puan: 300, dogru: 1 }), yeni('c', { puan: 100, dogru: 2 })])
    expect(l.map((x) => x.id)).toEqual(['b', 'c', 'a'])
  })
  it('takım puanı üye ortalamasıdır', () => {
    expect(takimPuanlari([yeni('a', { takim: 0, puan: 100 }), yeni('b', { takim: 0, puan: 300 }), yeni('c', { takim: 1, puan: 150 })])).toEqual([200, 150])
  })
  it('ödül: yıldız doğruluk oranına, XP sıraya göre', () => {
    expect(odul(yeni('a', { dogru: 10 }), 10, 1)).toMatchObject({ yildiz: 3, xp: 130 })
    expect(odul(yeni('a', { dogru: 0 }), 10, 5).yildiz).toBe(0)
  })
})

describe('Yarışma — çocuk güvenliği', () => {
  it('takma ad: yalnızca harf, rakam, boşluk; en çok 14 karakter', () => {
    expect(adTemizle('<b>Ece</b> http://x.com')).toBe('bEceb httpxcom')
    expect(adTemizle('   ')).toBe('Kaşif')
    expect(adTemizle('Çok uzun bir takma ad yazdım').length).toBeLessThanOrEqual(14)
  })
  it('aynı adlar ayrışır', () => {
    expect(adBenzersiz('Ece', ['Ece', 'Ece 2'])).toBe('Ece 3')
  })
  it('karakter rakip her zaman geçerli bir şık seçer', () => {
    const rng = makeRng(4)
    const b = botYap(0, 2, rng)
    for (let i = 0; i < 30; i++) {
      const [s, ms] = botCevap(b, soru, 20000, rng)
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThan(4)
      expect(ms).toBeLessThanOrEqual(20000)
    }
  })
})

describe('Yarışma — soru havuzu (tüm ders × sınıf)', () => {
  const imgOk = (n: string) => fs.existsSync(`public/assets/objects/${n}.png`)
  for (const k of KATEGORILER)
    for (const s of k.siniflar)
      it(`${k.ad} · ${s}. sınıf`, () => {
        const qs = soruSeti(k.id, s, 10, 7)
        expect(qs.length, `${k.id}-${s}`).toBeGreaterThanOrEqual(8)
        for (const q of qs) {
          expect(q.options.length).toBeGreaterThanOrEqual(2)
          expect(q.options.length).toBeLessThanOrEqual(4)
          expect(q.answer).toBeGreaterThanOrEqual(0)
          expect(q.answer).toBeLessThan(q.options.length)
          expect(q.explain.length).toBeGreaterThan(3)
          const keys = q.options.map((o) => o.label ?? o.img ?? JSON.stringify(o.visual))
          expect(new Set(keys).size, q.prompt).toBe(keys.length)
          for (const o of q.options) if (o.img) expect(imgOk(o.img), o.img).toBe(true)
        }
      })
  it('Fen yalnızca 3–4. sınıfta, İngilizce yok', () => {
    expect(kategorilerFor(1).map((k) => k.id)).not.toContain('fen')
    expect(KATEGORILER.map((k) => k.id as string)).not.toContain('ingilizce')
  })
})

describe('Yarışma — oda akışı (tek cihaz, karakter rakipli)', () => {
  afterEach(() => vi.useRealTimers())
  it('lobi → hazır → soru → cevap → sıralama → … → sonuç; puanlar doğru işlenir', () => {
    vi.useFakeTimers()
    const ayar: Ayar = { ad: 'Test', kategori: 'matematik', sinif: 2, soruSayisi: 2, sure: 10, mod: 'canli' }
    const mac = new OdaYonetici(ayar, [soru, { ...soru, answer: 2 }], { yerel: [yeni('ben')], botlar: [botYap(0, 1, makeRng(1))] })
    expect(mac.gorunum().evre).toBe('lobi')
    mac.baslat()
    expect(mac.gorunum().evre).toBe('hazir')
    // hazır evresinde şıklar ve doğru cevap gizli
    expect(mac.gorunum().soru?.options.length).toBe(0)
    vi.advanceTimersByTime(SURE.hazir + 10)
    const g = mac.gorunum()
    expect(g.evre).toBe('soru')
    expect(g.dogru).toBeUndefined()
    mac.cevapla(1)
    // herkes cevaplayınca süre dolmadan cevap evresine geçilir: evre değişene kadar adım adım ilerle
    for (let t = 0; t < 10_200 && mac.gorunum().evre === 'soru'; t += 100) vi.advanceTimersByTime(100)
    expect(mac.gorunum().evre).toBe('cevap')
    expect(mac.gorunum().dogru).toBe(1)
    const ben = mac.gorunum().oyuncular.find((o) => o.id === 'ben')!
    expect(ben.puan).toBeGreaterThanOrEqual(500)
    vi.advanceTimersByTime(SURE.cevap + 10)
    expect(mac.gorunum().evre).toBe('siralama')
    vi.advanceTimersByTime(SURE.siralama + SURE.hazir + 20)
    expect(mac.gorunum().evre).toBe('soru')
    expect(mac.gorunum().no).toBe(1)
    mac.cevapla(0) // yanlış
    vi.advanceTimersByTime(10_200 + SURE.cevap + 10)
    expect(mac.gorunum().evre).toBe('sonuc')
    expect(mac.gorunum().sorular?.length).toBe(2)
    expect(mac.cevaplari('ben')[1].dogru).toBe(false)
    mac.kapat()
  })
  it('sınıf modu: öğretmen oynamaz, sıralamadan sonra öğretmen ilerletir', () => {
    vi.useFakeTimers()
    const ayar: Ayar = { ad: 'Sınıf', kategori: 'kultur', sinif: 3, soruSayisi: 2, sure: 10, mod: 'sinif' }
    const mac = new OdaYonetici(ayar, [soru, soru], { yerel: [], botlar: [botYap(0, 2, makeRng(2))], otomatik: false })
    expect(mac.benimId).toBeNull()
    mac.baslat()
    vi.advanceTimersByTime(SURE.hazir + 10_300 + SURE.cevap + 20)
    expect(mac.gorunum().evre).toBe('siralama')
    vi.advanceTimersByTime(30_000)
    expect(mac.gorunum().evre).toBe('siralama')
    mac.sonraki()
    expect(mac.gorunum().evre).toBe('hazir')
    mac.kapat()
  })
  it('geçersiz cevaplar yok sayılır', () => {
    vi.useFakeTimers()
    const mac = new OdaYonetici({ ad: 'x', kategori: 'mantik', sinif: 1, soruSayisi: 1, sure: 10, mod: 'canli' }, [soru], { yerel: [yeni('ben')] })
    mac.cevapla(1) // lobide
    mac.baslat()
    vi.advanceTimersByTime(SURE.hazir + 10)
    mac.cevapla(9)
    mac.cevapla(1, 'olmayan')
    expect(mac.gorunum().oyuncular[0].cevapladi).toBe(false)
    mac.kapat()
  })
})
