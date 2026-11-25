/**
 * YARIŞMA MODU — Kahoot tarzı bilgi yarışmaları (referans: docs/reference/yarisma-modu-referans.png)
 * Modlar: Canlı Yarışma · Takım Savaşı · Sınıf Modu · Düello · Turnuvalar
 *  - tek cihazda: karakter rakiplerle canlı yarışma, düello ve takım savaşı (bölünmüş ekran), turnuva
 *  - sınıf ağında: kurucu/öğretmen oda açar, öğrenciler kodla ya da QR ile katılır (npm run sinif)
 * Güvenlik: sohbet yok; yalnızca takma ad + karakter görünür; öğretmen oyuncu çıkarabilir, odayı kilitleyebilir.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Obj } from '../../components/ui/Obj'
import { ParentGate } from '../../components/SettingsDialog'
import { sfx } from '../../audio/sfx'
import { useGame } from '../../state/store'
import { makeRng } from '../../learning/rng'
import { adTemizle, botYap, KARAKTERLER, type Ayar, type Kategori, type Mod, type Oyuncu } from '../../yarisma/motor'
import { OdaIstemci, OdaYonetici, avatarTemizle, type Mac } from '../../yarisma/oda'
import { kategoriBilgi, kategorilerFor, soruSeti } from '../../yarisma/sorular'
import { MacEkrani, type MacSecenek } from './MacEkrani'
import { Arena, BolumBaslik, Cam, Kim, ParlakButon, Secenek, Yazi } from './parcalar'

type Sinif = 1 | 2 | 3 | 4
type Sayfa =
  | { t: 'ana' }
  | { t: 'olustur'; mod: Mod }
  | { t: 'katil'; kod?: string }
  | { t: 'kapi' }
  | { t: 'oyun'; mac: Mac; tekrar?: () => Mac; secenek?: MacSecenek }

const MODLAR: { id: Mod; ad: string; alt: string; icon: string; aciklama: string }[] = [
  { id: 'canli', ad: 'Canlı Yarışma', alt: 'Kahoot tarzı', icon: 'zap', aciklama: 'Yarışma oluştur, arkadaşların kodla katılsın ya da karakter rakiplerle hemen yarış!' },
  { id: 'takim', ad: 'Takım Savaşı', alt: 'Takım takım', icon: 'friends', aciklama: 'İki takım aynı ekranda karşı karşıya! Takım arkadaşınla konuş, birlikte cevapla.' },
  { id: 'sinif', ad: 'Sınıf Modu', alt: 'Öğretmen yönetir', icon: 'school', aciklama: 'Öğretmen yarışmayı açar, öğrenciler kendi cihazlarından kodla ya da QR ile katılır.' },
  { id: 'duello', ad: 'Düello', alt: '1’e 1', icon: 'swords', aciklama: 'İki oyuncu tek ekranda: soruyu birlikte gör, kim hızlı ve doğru cevaplayacak?' },
  { id: 'turnuva', ad: 'Turnuvalar', alt: 'Aşama aşama', icon: 'trophy', aciklama: 'Çeyrek final, yarı final, final! Karakter rakipleri geç, kupayı kazan.' },
]

export function YarismaScreen({ kod }: { kod?: string }) {
  const [sayfa, setSayfa] = useState<Sayfa>(kod ? { t: 'katil', kod } : { t: 'ana' })
  const [mod, setMod] = useState<Mod>('canli')
  const back = useGame((s) => s.back)
  const git = (s: Sayfa) => {
    sfx('whoosh')
    setSayfa(s)
  }
  const ana = () => git({ t: 'ana' })

  return (
    <div className="absolute inset-0">
      <Arena />
      <div className="absolute inset-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={sayfa.t === 'oyun' ? 'oyun' : sayfa.t} className="relative min-h-0 flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {sayfa.t === 'ana' && <AnaSayfa mod={mod} setMod={setMod} git={git} geri={back} />}
            {sayfa.t === 'olustur' && <Olustur mod={sayfa.mod} geri={ana} git={git} />}
            {sayfa.t === 'katil' && <Katil kod={sayfa.kod} geri={ana} git={git} />}
            {sayfa.t === 'kapi' && (
              <div className="grid h-full place-items-center">
                <ParentGate onPass={() => git({ t: 'olustur', mod: 'sinif' })} onCancel={ana} />
              </div>
            )}
            {sayfa.t === 'oyun' && <MacEkrani mac={sayfa.mac} secenek={sayfa.secenek} onCik={ana} onTekrar={sayfa.tekrar ? () => git({ t: 'oyun', mac: sayfa.tekrar!(), tekrar: sayfa.tekrar, secenek: sayfa.secenek }) : undefined} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ================================================================ ana sayfa */
function AnaSayfa({ mod, setMod, git, geri }: { mod: Mod; setMod: (m: Mod) => void; git: (s: Sayfa) => void; geri: () => void }) {
  const m = MODLAR.find((x) => x.id === mod)!
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden px-3 pb-6 sm:px-5">
      {/* başlık + karakterler */}
      <div className="relative flex items-start gap-3 pt-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={geri} aria-label="Geri" className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-white/40 bg-white/15 text-[28px] font-black text-white">
          ←
        </motion.button>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
              <Obj name="trophy" size={72} />
            </motion.div>
            <Yazi className="text-[clamp(32px,5vw,60px)] leading-none">Yarışma Modu</Yazi>
          </div>
          <p className="mk-display max-w-[560px] text-[clamp(15px,1.7vw,20px)] leading-snug text-white/90">Arkadaşlarınla ya da sınıfınla bilgi yarışmasına katıl! Hızlı düşün, doğru cevapla, zirveye çık!</p>
        </div>
        <Cam className="hidden shrink-0 flex-col gap-1.5 p-4 xl:flex">
          {['Gerçek zamanlı yarışma', 'Çoktan seçmeli sorular', 'Puan ve sıralama sistemi', 'Takım veya bireysel oyun'].map((t) => (
            <span key={t} className="mk-display flex items-center gap-2 text-[16px] text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#22c55e] text-[15px] font-black">✓</span> {t}
            </span>
          ))}
        </Cam>
      </div>

      {/* mod sekmeleri */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {MODLAR.map((x) => {
          const aktif = x.id === mod
          return (
            <motion.button
              key={x.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sfx('tap')
                setMod(x.id)
              }}
              aria-pressed={aktif}
              className={`flex shrink-0 items-center gap-2 rounded-[22px] border-2 px-4 py-2 text-left text-white ${aktif ? 'border-[#ffd23f] shadow-[0_0_22px_rgba(255,210,63,0.55)]' : 'border-white/25'}`}
              style={{ background: aktif ? 'linear-gradient(180deg,#8f5cff,#5b2bd6)' : 'rgba(255,255,255,0.10)' }}
            >
              <Obj name={x.icon} size={36} shadow={false} />
              <span className="flex flex-col leading-tight">
                <span className="mk-display text-[clamp(16px,1.6vw,20px)]">{x.ad}</span>
                <span className="text-[12px] font-extrabold text-white/75">{x.alt}</span>
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* seçili mod paneli */}
      <AnimatePresence mode="wait">
        <motion.div key={mod} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {mod === 'turnuva' ? (
            <Turnuvalar git={git} />
          ) : (
            <Cam className="mt-3 flex flex-col items-center gap-4 p-5 md:flex-row">
              <div className="shrink-0">
                <Kim avatar={mod === 'sinif' ? 'robo' : mod === 'duello' ? 'kasif-sporcu' : mod === 'takim' ? 'kasif-bilim' : 'findik'} size={170} pose="wave" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
                <BolumBaslik>{m.ad}</BolumBaslik>
                <p className="mk-display max-w-[640px] text-center text-[clamp(16px,1.9vw,22px)] text-white md:text-left">{m.aciklama}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {mod === 'canli' && (
                    <>
                      <ParlakButon onClick={() => git({ t: 'olustur', mod: 'canli' })}>
                        <Obj name="sparkles" size={28} shadow={false} /> Yarışma Oluştur
                      </ParlakButon>
                      <ParlakButon renk="mor" onClick={() => git({ t: 'katil' })}>
                        <Obj name="key2" size={28} shadow={false} /> Koda Katıl
                      </ParlakButon>
                    </>
                  )}
                  {mod === 'takim' && (
                    <ParlakButon onClick={() => git({ t: 'olustur', mod: 'takim' })}>
                      <Obj name="friends" size={28} shadow={false} /> Takım Savaşı Kur
                    </ParlakButon>
                  )}
                  {mod === 'duello' && (
                    <ParlakButon onClick={() => git({ t: 'olustur', mod: 'duello' })}>
                      <Obj name="swords" size={28} shadow={false} /> Düello Başlat
                    </ParlakButon>
                  )}
                  {mod === 'sinif' && (
                    <>
                      <ParlakButon onClick={() => git({ t: 'kapi' })}>
                        <Obj name="teacher" size={28} shadow={false} /> Öğretmen: Yarışma Aç
                      </ParlakButon>
                      <ParlakButon renk="mor" onClick={() => git({ t: 'katil' })}>
                        <Obj name="key2" size={28} shadow={false} /> Öğrenci: Koda Katıl
                      </ParlakButon>
                    </>
                  )}
                </div>
                {mod === 'sinif' && <p className="max-w-[640px] text-center text-[13px] font-bold text-white/75 md:text-left">Sınıf modu okulun kendi ağında çalışır: öğretmen bilgisayarında “npm run sinif” açılır, öğrenciler aynı Wi-Fi’den katılır. Veriler okul dışına çıkmaz; sohbet yoktur.</p>}
              </div>
            </Cam>
          )}
        </motion.div>
      </AnimatePresence>

      {mod !== 'turnuva' && <HizliYaris git={git} />}
    </div>
  )
}

/* ================================================================ hızlı yarış: bir dokunuşla karakterlere karşı */
function HizliYaris({ git }: { git: (s: Sayfa) => void }) {
  const st = useGame()
  const sinif = (st.grade ?? 1) as Sinif
  const basla = (kat: Kategori) => {
    const kur = (): Mac => {
      const rng = makeRng(Date.now() % 9999)
      const benimAvatar = avatarTemizle(st.avatar.preset ?? 'kasif-lacivert')
      const sorular = soruSeti(kat, sinif, 8)
      const mac = new OdaYonetici(
        { ad: `${kategoriBilgi(kat).ad} Hızlı Yarış`, kategori: kat, sinif, soruSayisi: sorular.length, sure: sinif <= 2 ? 30 : 20, mod: 'canli' },
        sorular,
        { yerel: [{ id: 'ben', ad: adTemizle(st.nickname), avatar: benimAvatar, puan: 0, seri: 0, dogru: 0, cevaplar: {} }], botlar: [0, 1, 2].map((i) => botYap(i + Math.floor(rng() * 5), 2, rng, [benimAvatar])) },
      )
      setTimeout(() => mac.baslat(), 50)
      return mac
    }
    git({ t: 'oyun', mac: kur(), tekrar: kur })
  }
  return (
    <div className="mt-4">
      <BolumBaslik>
        <span className="inline-flex items-center gap-2">
          <Obj name="zap" size={24} shadow={false} /> Hızlı Yarış · karakterlere karşı hemen başla
        </span>
      </BolumBaslik>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kategorilerFor(sinif).map((k, i) => (
          <motion.button
            key={k.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => basla(k.id)}
            aria-label={`${k.ad} hızlı yarış`}
            className="relative flex flex-col items-center gap-2 overflow-hidden rounded-[24px] border-2 border-white/30 p-4 text-white"
            style={{ background: `linear-gradient(160deg, ${k.renk}, rgba(40,15,110,0.85))`, boxShadow: '0 8px 0 rgba(20,5,70,0.45), 0 14px 26px rgba(0,0,0,0.3)' }}
          >
            <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
            <Obj name={k.icon} size={64} />
            <span className="mk-display text-[19px] leading-tight">{k.ad}</span>
            <span className="rounded-full bg-black/20 px-3 py-0.5 text-[12px] font-black">8 soru · {sinif}. sınıf</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ================================================================ oluştur */
const TAKIM_ADLARI: [string, string][] = [
  ['Kırmızı Kartallar', 'Mavi Yunuslar'],
  ['Ateş Takımı', 'Su Takımı'],
  ['Yıldızlar', 'Gezegenler'],
]
function Olustur({ mod, geri, git }: { mod: Mod; geri: () => void; git: (s: Sayfa) => void }) {
  const st = useGame()
  const [sinif, setSinif] = useState<Sinif>((st.grade ?? 1) as Sinif)
  const kats = kategorilerFor(sinif)
  const [kategori, setKategori] = useState<Kategori>(kats[0].id)
  const kat = kats.some((k) => k.id === kategori) ? kategori : kats[0].id
  const [sayi, setSayi] = useState(mod === 'duello' || mod === 'takim' ? 8 : 10)
  const [sure, setSure] = useState(sinif <= 2 ? 30 : 20)
  const [takimAd, setTakimAd] = useState(0)
  const [rakip, setRakip] = useState('kasif-sporcu')
  const [ad, setAd] = useState('')
  const yarismaAdi = ad.trim() || `${kategoriBilgi(kat).ad} Bilgi Yarışması`

  const benimAvatar = avatarTemizle(st.avatar.preset ?? 'kasif-lacivert')
  const ben = (): Oyuncu => ({ id: 'ben', ad: adTemizle(st.nickname), avatar: benimAvatar, puan: 0, seri: 0, dogru: 0, cevaplar: {} })

  const kur = (): Mac => {
    const ayar: Ayar = { ad: yarismaAdi.slice(0, 40), kategori: kat, sinif, soruSayisi: sayi, sure, mod, takimlar: mod === 'takim' ? TAKIM_ADLARI[takimAd] : undefined }
    const sorular = soruSeti(kat, sinif, sayi)
    ayar.soruSayisi = sorular.length
    if (mod === 'sinif') return new OdaYonetici(ayar, sorular, { yerel: [], ag: true, otomatik: false })
    if (mod === 'duello') {
      const k = KARAKTERLER.find((x) => x.avatar === rakip)
      return new OdaYonetici(ayar, sorular, { yerel: [ben(), { id: 'ikinci', ad: k?.ad ?? 'Oyuncu 2', avatar: rakip, puan: 0, seri: 0, dogru: 0, cevaplar: {} }] })
    }
    if (mod === 'takim') {
      const [a, b] = TAKIM_ADLARI[takimAd]
      return new OdaYonetici(ayar, sorular, {
        yerel: [
          { id: 'takim-0', ad: a, avatar: 'kasif-pembe', takim: 0, puan: 0, seri: 0, dogru: 0, cevaplar: {} },
          { id: 'takim-1', ad: b, avatar: 'kasif-lacivert', takim: 1, puan: 0, seri: 0, dogru: 0, cevaplar: {} },
        ],
      })
    }
    return new OdaYonetici(ayar, sorular, { yerel: [ben()] })
  }

  const baslik = { canli: 'Yarışma Oluştur', takim: 'Takım Savaşı Kur', sinif: 'Sınıf Yarışması Aç', duello: 'Düello Kur', turnuva: 'Turnuva' }[mod]
  return (
    <div className="absolute inset-0 overflow-y-auto px-3 pb-6 pt-3 sm:px-5">
      <div className="mb-3 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={geri} aria-label="Geri" className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/40 bg-white/15 text-[28px] font-black text-white">
          ←
        </motion.button>
        <Yazi className="text-[clamp(26px,3.6vw,44px)]">{baslik}</Yazi>
      </div>
      <Cam className="mx-auto flex max-w-[980px] flex-col gap-5 p-4 sm:p-6">
        <Alan baslik="Yarışma adı">
          <input
            value={ad}
            onChange={(e) => setAd(e.target.value.slice(0, 40))}
            placeholder={`${kategoriBilgi(kat).ad} Bilgi Yarışması`}
            aria-label="Yarışma adı"
            className="mk-display w-full max-w-[520px] rounded-2xl border-2 border-white/30 bg-white/90 px-4 py-3 text-[20px] text-[#2b1468] outline-none focus:border-[#ffd23f]"
          />
        </Alan>
        <Alan baslik="Sınıf">
          {([1, 2, 3, 4] as Sinif[]).map((s) => (
            <Secenek key={s} deger={s} secili={sinif} onSec={setSinif}>
              {s}. sınıf
            </Secenek>
          ))}
        </Alan>
        <Alan baslik="Ders">
          {kats.map((k) => (
            <Secenek key={k.id} deger={k.id} secili={kat} onSec={setKategori}>
              <Obj name={k.icon} size={28} shadow={false} /> {k.ad}
            </Secenek>
          ))}
        </Alan>
        <div className="flex flex-wrap gap-6">
          <Alan baslik="Soru sayısı">
            {[5, 8, 10, 15, 20].map((n) => (
              <Secenek key={n} deger={n} secili={sayi} onSec={setSayi}>
                {n}
              </Secenek>
            ))}
          </Alan>
          <Alan baslik="Soru başına süre">
            {[10, 20, 30, 45].map((n) => (
              <Secenek key={n} deger={n} secili={sure} onSec={setSure}>
                {n} sn
              </Secenek>
            ))}
          </Alan>
        </div>
        {mod === 'takim' && (
          <Alan baslik="Takımlar">
            {TAKIM_ADLARI.map(([a, b], i) => (
              <Secenek key={a} deger={i} secili={takimAd} onSec={setTakimAd}>
                <span className="text-[#ffb3b3]">{a}</span> – <span className="text-[#b3d4ff]">{b}</span>
              </Secenek>
            ))}
          </Alan>
        )}
        {mod === 'duello' && (
          <Alan baslik="Rakibin karakteri (aynı cihazda ikinci oyuncu)">
            {KARAKTERLER.filter((k) => k.avatar !== benimAvatar).slice(0, 6).map((k) => (
              <Secenek key={k.avatar} deger={k.avatar} secili={rakip} onSec={setRakip}>
                <span className="-my-2">
                  <Kim avatar={k.avatar} size={40} bust />
                </span>
                {k.ad}
              </Secenek>
            ))}
          </Alan>
        )}
        <div className="flex justify-center pt-1">
          <ParlakButon
            className="!min-h-[64px] w-[min(420px,100%)]"
            onClick={() => {
              sfx('fanfare')
              git({ t: 'oyun', mac: kur(), tekrar: kur })
            }}
          >
            <Obj name="rocket" size={30} shadow={false} /> {mod === 'sinif' ? 'Yarışmayı Aç' : 'Devam'}
          </ParlakButon>
        </div>
      </Cam>
    </div>
  )
}
function Alan({ baslik, children }: { baslik: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-black uppercase tracking-wider text-white/75">{baslik}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

/* ================================================================ katıl */
function Katil({ kod: ilk, geri, git }: { kod?: string; geri: () => void; git: (s: Sayfa) => void }) {
  const st = useGame()
  const [kod, setKod] = useState(ilk ?? '')
  const ad = adTemizle(st.nickname)
  const avatar = avatarTemizle(st.avatar.preset ?? 'kasif-lacivert')
  const bas = (d: string) => {
    sfx('tap')
    setKod((k) => (d === '⌫' ? k.slice(0, -1) : k.length < 5 ? k + d : k))
  }
  return (
    <div className="absolute inset-0 overflow-y-auto px-3 pb-6 pt-3 sm:px-5">
      <div className="mb-3 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={geri} aria-label="Geri" className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/40 bg-white/15 text-[28px] font-black text-white">
          ←
        </motion.button>
        <Yazi className="text-[clamp(26px,3.6vw,44px)]">Yarışmaya Katıl</Yazi>
      </div>
      <Cam className="mx-auto flex max-w-[760px] flex-col items-center gap-4 p-5 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2">
          <Kim avatar={avatar} size={160} pose="wave" />
          <span className="mk-display rounded-full bg-white/15 px-4 py-1 text-[18px] text-white">{ad}</span>
          <span className="max-w-[200px] text-center text-[12px] font-bold text-white/70">Diğer oyuncular yalnızca takma adını ve karakterini görür.</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-3">
          <span className="mk-display text-[18px] text-white/85">Oyun kodunu gir</span>
          <div className="flex gap-2" aria-live="polite" aria-label={`Girilen kod ${kod.split('').join(' ')}`}>
            {Array.from({ length: Math.max(4, kod.length) }).map((_, i) => (
              <span key={i} className="mk-title grid h-16 w-14 place-items-center rounded-2xl bg-[#24105f] text-[38px] text-white shadow-inner">
                {kod[i] ?? ''}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0'].map((d) => (
              <motion.button key={d} whileTap={{ scale: 0.9 }} onClick={() => bas(d)} aria-label={d === '⌫' ? 'Sil' : d} className="mk-display grid h-14 w-[72px] place-items-center rounded-2xl bg-white/90 text-[28px] text-[#2b1468] shadow-[0_4px_0_rgba(40,10,110,0.35)]">
                {d}
              </motion.button>
            ))}
            <ParlakButon renk="yesil" className="!min-h-[56px] !px-3" disabled={kod.length < 4} onClick={() => git({ t: 'oyun', mac: new OdaIstemci(kod, ad, avatar) })} ariaLabel="Katıl">
              ✓
            </ParlakButon>
          </div>
        </div>
      </Cam>
    </div>
  )
}

/* ================================================================ turnuvalar */
const ASAMALAR = [
  { ad: 'Çeyrek Final', rakip: 2, zorluk: 1 as const, gec: 2 },
  { ad: 'Yarı Final', rakip: 3, zorluk: 2 as const, gec: 2 },
  { ad: 'Final', rakip: 4, zorluk: 3 as const, gec: 1 },
]
function Turnuvalar({ git }: { git: (s: Sayfa) => void }) {
  const st = useGame()
  const sinif = (st.grade ?? 1) as Sinif
  const basla = (kat: Kategori, asama: number) => {
    const key = `${kat}-${sinif}`
    const a = ASAMALAR[asama]
    const kur = (): Mac => {
      const rng = makeRng(Date.now() % 9999)
      const benimAvatar = avatarTemizle(st.avatar.preset ?? 'kasif-lacivert')
      const botlar = Array.from({ length: a.rakip }, (_, i) => botYap(i + asama, a.zorluk, rng, [benimAvatar]))
      const sorular = soruSeti(kat, sinif, 6)
      const mac = new OdaYonetici(
        { ad: `${kategoriBilgi(kat).ad} Turnuvası · ${a.ad}`, kategori: kat, sinif, soruSayisi: sorular.length, sure: sinif <= 2 ? 30 : 20, mod: 'turnuva' },
        sorular,
        { yerel: [{ id: 'ben', ad: adTemizle(st.nickname), avatar: benimAvatar, puan: 0, seri: 0, dogru: 0, cevaplar: {} }], botlar },
      )
      setTimeout(() => mac.baslat(), 50)
      return mac
    }
    git({ t: 'oyun', mac: kur(), tekrar: kur, secenek: { turnuva: { asama, gecmeSirasi: a.gec, onSonuc: (sira) => sira <= a.gec && st.turnuvaIlerle(key, asama + 1) } } })
  }
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {kategorilerFor(sinif).map((k) => {
        const gecilen = st.turnuva[`${k.id}-${sinif}`] ?? 0
        return (
          <Cam key={k.id} className="flex flex-col gap-3 p-4" parlak={gecilen >= 3}>
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: k.renk }}>
                <Obj name={k.icon} size={40} shadow={false} />
              </span>
              <div className="flex-1">
                <Yazi className="text-[22px]">{k.ad}</Yazi>
                <div className="text-[13px] font-extrabold text-white/75">{gecilen >= 3 ? 'Şampiyon oldun!' : `${sinif}. sınıf turnuvası`}</div>
              </div>
              {gecilen >= 3 && <Obj name="trophy" size={44} />}
            </div>
            <div className="flex items-center gap-1">
              {ASAMALAR.map((a, i) => {
                const acik = i <= gecilen
                const bitti = i < gecilen
                return (
                  <motion.button
                    key={a.ad}
                    whileTap={acik ? { scale: 0.95 } : {}}
                    onClick={() => acik && basla(k.id, i)}
                    disabled={!acik}
                    aria-label={`${k.ad} ${a.ad}${acik ? '' : ', kilitli'}`}
                    className={`mk-display flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[13px] text-white ${i === gecilen && gecilen < 3 ? 'bg-[#7c4dff] ring-2 ring-[#ffd23f]' : bitti ? 'bg-[#22a845]/80' : 'bg-white/10 opacity-60'}`}
                  >
                    <Obj name={bitti ? 'medal' : acik ? (i === 2 ? 'trophy' : 'target') : 'lock'} size={30} shadow={false} />
                    {a.ad}
                  </motion.button>
                )
              })}
            </div>
          </Cam>
        )
      })}
    </div>
  )
}
