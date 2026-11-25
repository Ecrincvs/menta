/**
 * YARIŞMA ODASI
 *  - OdaYonetici: yarışmayı yöneten cihaz (tek cihaz modları ya da sınıf ağında kurucu/öğretmen).
 *    Evreler: lobi → hazır (soru okunur) → soru (geri sayım) → cevap (doğru şık + açıklama) → sıralama → … → sonuç
 *  - OdaIstemci: sınıf ağında koda katılan oyuncu; ekranı yöneticiden gelen görünümle çizer, sadece cevap gönderir.
 * Doğru cevap, cevap evresinden önce oyunculara gönderilmez (hile olmasın).
 */
import { makeRng } from '../learning/rng'
import { adBenzersiz, adTemizle, botCevap, botYap, cevapIsle, cevapsizIsle, kodUret, sirala, takimPuanlari, type Ayar, type Gorunum, type Oyuncu, type YSoru } from './motor'
import { baglan } from './ag'

export const SURE = { hazir: 3200, cevap: 4200, siralama: 4500 }
export const AZAMI_OYUNCU = 40

export interface Mac {
  rol: 'yonetici' | 'oyuncu'
  benimId: string | null
  /** aynı cihazdaki oyuncular (düello/takım) */
  yerel: string[]
  gorunum(): Gorunum
  /** görünüm değişince çağrılır */
  abone(fn: () => void): () => void
  cevapla(secim: number, pid?: string): void
  kapat(): void
  // yönetici
  baslat?(): void
  sonraki?(): void
  at?(pid: string): void
  kilitle?(on: boolean): void
  botEkle?(): void
  agDurumu?: () => 'yok' | 'baglaniyor' | 'bagli'
  agiAc?(): Promise<void>
  katilimAdresi?: () => string | null
  hata?: () => string | null
}

type Dinleyici = () => void

export class OdaYonetici implements Mac {
  rol = 'yonetici' as const
  benimId: string | null
  yerel: string[]
  private oyuncular: Oyuncu[] = []
  private ayrilan = new Set<string>()
  private evre: Gorunum['evre'] = 'lobi'
  private no = 0
  private evreBitis = 0
  private soruBasla = 0
  private kilitli = false
  private zaman: ReturnType<typeof setTimeout>[] = []
  private dinleyiciler = new Set<Dinleyici>()
  private rng = makeRng(Date.now() % 100000)
  private ws: WebSocket | null = null
  private ag: 'yok' | 'baglaniyor' | 'bagli' = 'yok'
  private adres: string | null = null
  private kod: string
  private onbellek: Gorunum | null = null

  constructor(
    public ayar: Ayar,
    private sorular: YSoru[],
    opts: { yerel: Oyuncu[]; botlar?: Oyuncu[]; ag?: boolean; otomatik?: boolean },
  ) {
    this.oyuncular = [...opts.yerel, ...(opts.botlar ?? [])]
    this.yerel = opts.yerel.map((o) => o.id)
    this.benimId = opts.yerel[0]?.id ?? null
    this.otomatik = opts.otomatik ?? true
    this.kod = kodUret(this.rng)
    if (opts.ag) void this.agiAc()
  }
  private otomatik: boolean

  /* ------------------------------------------------------------ ağ (sınıf sunucusu) */
  /** sınıf ağını aç: kod sunucudan alınır, arkadaşlar katılabilir */
  async agiAc() {
    if (this.ag !== 'yok' || this.ws) return
    this.ag = 'baglaniyor'
    this.yay()
    const ws = await baglan()
    if (!ws) {
      this.ag = 'yok'
      this.yay()
      return
    }
    this.ws = ws
    ws.onmessage = (e) => {
      let m: { t: string; [k: string]: unknown }
      try {
        m = JSON.parse(String(e.data))
      } catch {
        return
      }
      if (m.t === 'kod') {
        this.kod = String(m.kod)
        this.adres = katilimUrl(this.kod, m.lan as string | undefined)
        this.ag = 'bagli'
        this.yay()
      } else if (m.t === 'katil') {
        const pid = String(m.pid)
        if (this.evre !== 'lobi' || this.kilitli || this.oyuncular.length >= AZAMI_OYUNCU) {
          this.gonder({ t: 'reddet', pid, neden: this.kilitli ? 'Oda kilitli.' : this.evre !== 'lobi' ? 'Yarışma başladı.' : 'Oda dolu.' })
          return
        }
        const ad = adBenzersiz(adTemizle(String(m.ad ?? '')), this.oyuncular.map((o) => o.ad))
        const takim = this.ayar.mod === 'takim' ? ((this.oyuncular.filter((o) => o.takim === 0).length <= this.oyuncular.filter((o) => o.takim === 1).length ? 0 : 1) as 0 | 1) : undefined
        this.oyuncular.push({ id: pid, ad, avatar: avatarTemizle(String(m.avatar ?? '')), takim, puan: 0, seri: 0, dogru: 0, cevaplar: {} })
        this.yay()
      } else if (m.t === 'cevap') {
        this.cevapla(Number(m.secim), String(m.pid), Number(m.no))
      } else if (m.t === 'ayrildi') {
        const pid = String(m.pid)
        if (this.evre === 'lobi') this.oyuncular = this.oyuncular.filter((o) => o.id !== pid)
        else this.ayrilan.add(pid)
        this.yay()
      }
    }
    ws.onclose = () => {
      this.ws = null
      this.ag = 'yok'
      this.yay()
    }
    this.gonder({ t: 'olustur', ad: this.ayar.ad })
  }
  private gonder(m: object) {
    if (this.ws?.readyState === 1) this.ws.send(JSON.stringify(m))
  }
  agDurumu = () => this.ag
  katilimAdresi = () => this.adres
  hata = () => null

  /* ------------------------------------------------------------ akış */
  baslat() {
    if (this.evre !== 'lobi' || this.oyuncular.length === 0) return
    this.no = 0
    this.hazir()
  }
  private hazir() {
    this.temizle()
    this.evre = 'hazir'
    this.evreBitis = Date.now() + SURE.hazir
    this.zaman.push(setTimeout(() => this.soru(), SURE.hazir))
    this.yay()
  }
  private soru() {
    this.temizle()
    this.evre = 'soru'
    const sureMs = this.ayar.sure * 1000
    this.soruBasla = Date.now()
    this.evreBitis = this.soruBasla + sureMs
    const q = this.sorular[this.no]
    for (const b of this.oyuncular.filter((o) => o.bot)) {
      const [secim, ms] = botCevap(b, q, sureMs, this.rng)
      this.zaman.push(setTimeout(() => this.cevapla(secim, b.id), ms))
    }
    this.zaman.push(setTimeout(() => this.soruBitir(), sureMs + 150))
    this.yay()
  }
  cevapla(secim: number, pid?: string, no?: number) {
    const id = pid ?? this.benimId
    if (!id || this.evre !== 'soru' || (no !== undefined && no !== this.no)) return
    const q = this.sorular[this.no]
    if (!Number.isInteger(secim) || secim < 0 || secim >= q.options.length) return
    const i = this.oyuncular.findIndex((o) => o.id === id)
    if (i < 0) return
    const ms = Math.min(Date.now() - this.soruBasla, this.ayar.sure * 1000)
    this.oyuncular[i] = cevapIsle(this.oyuncular[i], this.no, secim, ms, q, this.ayar.sure * 1000)
    const aktif = this.oyuncular.filter((o) => !this.ayrilan.has(o.id))
    if (aktif.every((o) => o.cevaplar[this.no])) this.soruBitir()
    else this.yay()
  }
  private soruBitir() {
    if (this.evre !== 'soru') return
    this.temizle()
    this.oyuncular = this.oyuncular.map((o) => cevapsizIsle(o, this.no))
    this.evre = 'cevap'
    this.evreBitis = Date.now() + SURE.cevap
    this.zaman.push(setTimeout(() => this.siralama(), SURE.cevap))
    this.yay()
  }
  private siralama() {
    this.temizle()
    const son = this.no >= this.sorular.length - 1
    if (son) {
      this.evre = 'sonuc'
      this.evreBitis = 0
      this.yay()
      return
    }
    this.evre = 'siralama'
    this.evreBitis = this.otomatik ? Date.now() + SURE.siralama : 0
    if (this.otomatik) this.zaman.push(setTimeout(() => this.sonraki(), SURE.siralama))
    this.yay()
  }
  /** sıralamadan sonraki soruya geç (sınıf modunda öğretmen basar) */
  sonraki() {
    if (this.evre === 'cevap') return this.siralama()
    if (this.evre !== 'siralama') return
    this.no++
    this.hazir()
  }
  at(pid: string) {
    if (this.yerel.includes(pid)) return
    this.oyuncular = this.oyuncular.filter((o) => o.id !== pid)
    this.gonder({ t: 'at', pid })
    this.yay()
  }
  kilitle(on: boolean) {
    this.kilitli = on
    this.gonder({ t: 'kilit', on })
    this.yay()
  }
  botEkle() {
    if (this.evre !== 'lobi') return
    const var_ = this.oyuncular.filter((o) => o.bot).length
    if (var_ >= 7) return
    const b = botYap(var_, 2, this.rng, this.oyuncular.map((o) => o.avatar))
    if (this.ayar.mod === 'takim') b.takim = (var_ % 2) as 0 | 1
    this.oyuncular.push(b)
    this.yay()
  }
  kapat() {
    this.temizle()
    this.gonder({ t: 'kapat' })
    this.ws?.close()
    this.dinleyiciler.clear()
  }
  private temizle() {
    for (const z of this.zaman) clearTimeout(z)
    this.zaman = []
  }

  /* ------------------------------------------------------------ görünüm */
  abone(fn: Dinleyici) {
    this.dinleyiciler.add(fn)
    return () => {
      this.dinleyiciler.delete(fn)
    }
  }
  private yay() {
    this.onbellek = null
    const g = this.gorunum()
    this.gonder({ t: 'durum', g })
    for (const f of this.dinleyiciler) f()
  }
  gorunum(): Gorunum {
    if (this.onbellek) return this.onbellek
    const q = this.evre === 'lobi' ? null : this.sorular[this.no]
    const acik = this.evre === 'cevap' || this.evre === 'siralama' || this.evre === 'sonuc'
    const oyuncular = sirala(this.oyuncular.filter((o) => !this.ayrilan.has(o.id) || this.evre !== 'lobi')).map((o) => ({
      id: o.id,
      ad: o.ad,
      avatar: o.avatar,
      takim: o.takim,
      puan: o.puan,
      dogru: o.dogru,
      seri: o.seri,
      cevapladi: !!o.cevaplar[this.no],
      son: acik ? o.cevaplar[this.no] : undefined,
      bot: !!o.bot,
    }))
    const g: Gorunum = {
      kod: this.kod,
      ayar: this.ayar,
      evre: this.evre,
      no: this.no,
      toplam: this.sorular.length,
      soru: q ? { prompt: q.prompt, spoken: q.spoken, options: this.evre === 'hazir' ? [] : q.options, visual: q.visual, konu: q.konu } : null,
      dogru: acik && q ? q.answer : undefined,
      aciklama: acik && q ? q.explain : undefined,
      kalanMs: this.evreBitis ? Math.max(0, this.evreBitis - Date.now()) : 0,
      oyuncular,
      dagilim: acik && q ? q.options.map((_, i) => this.oyuncular.filter((o) => o.cevaplar[this.no]?.secim === i).length) : undefined,
      kilitli: this.kilitli,
      takimPuan: this.ayar.mod === 'takim' ? takimPuanlari(this.oyuncular) : undefined,
      sorular: this.evre === 'sonuc' ? this.sorular : undefined,
    }
    this.onbellek = g
    return g
  }
  /** sonuç ekranı için: oyuncunun tüm cevapları */
  cevaplari(pid: string) {
    return this.oyuncular.find((o) => o.id === pid)?.cevaplar ?? {}
  }
}

/* ---------------------------------------------------------------------------------------------- */
export class OdaIstemci implements Mac {
  rol = 'oyuncu' as const
  benimId: string | null = null
  yerel: string[] = []
  private son: Gorunum | null = null
  private dinleyiciler = new Set<Dinleyici>()
  private ws: WebSocket | null = null
  private hataMesaji: string | null = null
  /** sonuçta yanlışları göstermek için kendi cevaplarımız */
  benimCevaplar: Record<number, number> = {}

  constructor(
    private kod: string,
    private ad: string,
    private avatar: string,
  ) {
    void this.ac()
  }
  private async ac() {
    const ws = await baglan()
    if (!ws) {
      return this.hataYay('Sınıf sunucusuna ulaşılamadı. Öğretmenin yarışmayı açtığından ve aynı ağda olduğundan emin ol.')
    }
    this.ws = ws
    ws.onmessage = (e) => {
      let m: { t: string; [k: string]: unknown }
      try {
        m = JSON.parse(String(e.data))
      } catch {
        return
      }
      if (m.t === 'katildi') {
        this.benimId = String(m.pid)
        this.yerel = [this.benimId]
      } else if (m.t === 'durum') this.son = m.g as Gorunum
      else if (m.t === 'hata' || m.t === 'reddet') return this.hataYay(String(m.neden ?? 'Katılamadın.'))
      else if (m.t === 'atildin') return this.hataYay('Öğretmen seni yarışmadan çıkardı.')
      else if (m.t === 'kapandi') return this.hataYay(this.son?.evre === 'sonuc' ? '' : 'Yarışma kurucu tarafından kapatıldı.')
      this.yay()
    }
    ws.onclose = () => {
      if (!this.hataMesaji && this.son?.evre !== 'sonuc') return this.hataYay('Bağlantı koptu.')
      this.yay()
    }
    ws.send(JSON.stringify({ t: 'katil', kod: this.kod, ad: this.ad, avatar: this.avatar }))
  }
  hata = () => this.hataMesaji
  /** hata değişince ekran yenilensin diye görünümün kimliğini değiştir */
  private hataYay(m: string) {
    this.hataMesaji = m || null
    if (this.son) this.son = { ...this.son }
    this.bos = null
    this.yay()
  }
  private bos: Gorunum | null = null
  gorunum(): Gorunum {
    return (
      this.son ??
      (this.bos ??= {
        kod: this.kod,
        ayar: { ad: '', kategori: 'matematik', sinif: 1, soruSayisi: 0, sure: 20, mod: 'canli' },
        evre: 'lobi',
        no: 0,
        toplam: 0,
        soru: null,
        kalanMs: 0,
        oyuncular: [],
      })
    )
  }
  abone(fn: Dinleyici) {
    this.dinleyiciler.add(fn)
    return () => {
      this.dinleyiciler.delete(fn)
    }
  }
  private yay() {
    for (const f of this.dinleyiciler) f()
  }
  cevapla(secim: number) {
    const g = this.son
    if (!g || g.evre !== 'soru' || this.benimCevaplar[g.no] !== undefined) return
    this.benimCevaplar[g.no] = secim
    this.ws?.send(JSON.stringify({ t: 'cevap', no: g.no, secim }))
    this.yay()
  }
  kapat() {
    this.ws?.close()
    this.dinleyiciler.clear()
  }
}

/* ---------------------------------------------------------------------------------------------- */
const AVATARLAR = ['findik', 'robo', 'kasif-pembe', 'kasif-mor', 'kasif-lacivert', 'kasif-bilim', 'kasif-okul', 'kasif-sporcu', 'kasif-doga', 'kasif-kis', 'kasif-uzay']
export const avatarTemizle = (a: string) => (AVATARLAR.includes(a) ? a : 'kasif-lacivert')

/** QR ve paylaşım için katılım adresi: sunucunun bildirdiği okul ağı adresi + uygulamanın portu */
export function katilimUrl(kod: string, lan?: string) {
  const h = location.hostname
  const yerelMi = h === 'localhost' || h === '127.0.0.1'
  const host = yerelMi && lan ? lan : h
  const port = location.port ? `:${location.port}` : ''
  return `${location.protocol}//${host}${port}/?kod=${kod}`
}
