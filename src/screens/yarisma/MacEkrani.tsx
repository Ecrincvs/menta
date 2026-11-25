/**
 * Yarışma oyun ekranı — bir Mac'i (yönetici ya da istemci) evrelerine göre çizer:
 * lobi → hazır → soru → cevap → sıralama → … → sonuç (+ yanlışlarımı çalış)
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Obj } from '../../components/ui/Obj'
import { VisualView } from '../../games/quiz/Visuals'
import type { Option } from '../../games/quiz/types'
import { sfx } from '../../audio/sfx'
import { speak, stopSpeaking } from '../../audio/speech'
import { useGame } from '../../state/store'
import { odul, type Gorunum, type YSoru } from '../../yarisma/motor'
import { OdaIstemci, OdaYonetici, type Mac } from '../../yarisma/oda'
import { kategoriBilgi } from '../../yarisma/sorular'
import { BolumBaslik, Cam, CEVAP_RENK, Kim, ParlakButon, Podyum, QR, Rozet, SiraListesi, useKalan, Yazi, ZamanHalkasi } from './parcalar'

export interface MacSecenek {
  /** turnuva: sonuçta sıralamaya göre ilerleme */
  turnuva?: { asama: number; gecmeSirasi: number; onSonuc: (sira: number) => void }
}

export function MacEkrani({ mac, onCik, onTekrar, secenek }: { mac: Mac; onCik: () => void; onTekrar?: () => void; secenek?: MacSecenek }) {
  const g = useSyncExternalStore(
    (f) => mac.abone(f),
    () => mac.gorunum(),
  )
  const hata = mac.hata?.()
  // ekrandan çıkınca odayı kapat (StrictMode'un deneme amaçlı söküp takmasında kapatma)
  const aktif = useRef(true)
  useEffect(() => {
    aktif.current = true
    return () => {
      aktif.current = false
      setTimeout(() => !aktif.current && mac.kapat(), 0)
    }
  }, [mac])

  // soru okunsun
  useEffect(() => {
    if (g.evre === 'hazir' && g.soru) speak(g.soru.spoken ?? g.soru.prompt)
    if (g.evre === 'sonuc') stopSpeaking()
  }, [g.evre, g.no]) // eslint-disable-line react-hooks/exhaustive-deps

  if (hata)
    return (
      <div className="grid h-full place-items-center p-4">
        <Cam className="flex max-w-[520px] flex-col items-center gap-4 p-6 text-center">
          <Obj name="thinking" size={84} />
          <Yazi className="text-[24px]">{hata}</Yazi>
          <ParlakButon onClick={onCik}>Yarışmalara dön</ParlakButon>
        </Cam>
      </div>
    )

  return (
    <div className="relative flex h-full flex-col">
      <UstBar g={g} mac={mac} onCik={onCik} />
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={`${g.evre}-${g.evre === 'lobi' || g.evre === 'sonuc' ? 0 : g.no}`} className="absolute inset-0 overflow-y-auto overflow-x-hidden px-3 pb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            {g.evre === 'lobi' && <Lobi g={g} mac={mac} />}
            {(g.evre === 'hazir' || g.evre === 'soru' || g.evre === 'cevap') && <SoruAlani g={g} mac={mac} />}
            {g.evre === 'siralama' && <Siralama g={g} mac={mac} />}
            {g.evre === 'sonuc' && <Sonuc g={g} mac={mac} onCik={onCik} onTekrar={onTekrar} secenek={secenek} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ================================================================ üst çubuk */
function UstBar({ g, mac, onCik }: { g: Gorunum; mac: Mac; onCik: () => void }) {
  const ben = g.oyuncular.find((o) => o.id === mac.benimId)
  const k = kategoriBilgi(g.ayar.kategori)
  return (
    <div className="flex items-center gap-2 p-3 sm:gap-3">
      <motion.button whileTap={{ scale: 0.9 }} onClick={onCik} aria-label="Yarışmadan çık" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-white/40 bg-white/15 text-[22px] font-black text-white">
        ✕
      </motion.button>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/25 bg-[#24105f]/60 py-1 pl-1 pr-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: k.renk }}>
          <Obj name={k.icon} size={28} shadow={false} />
        </span>
        <Yazi className="truncate text-[clamp(15px,1.8vw,21px)]">{g.ayar.ad || 'Yarışma'}</Yazi>
      </div>
      {g.evre !== 'lobi' && g.evre !== 'sonuc' && (
        <span className="mk-display shrink-0 rounded-full border border-white/30 bg-[#24105f]/70 px-4 py-2 text-[18px] text-white">
          {g.no + 1} / {g.toplam}
        </span>
      )}
      {ben && g.evre !== 'lobi' && (
        <span className="mk-display hidden shrink-0 items-center gap-1 rounded-full bg-[#ffd23f] px-4 py-2 text-[18px] text-[#3b2400] shadow sm:flex">
          <Obj name="star" size={22} shadow={false} /> {ben.puan.toLocaleString('tr-TR')}
        </span>
      )}
    </div>
  )
}

/* ================================================================ lobi */
function Lobi({ g, mac }: { g: Gorunum; mac: Mac }) {
  const yonetici = mac.rol === 'yonetici'
  const ag = mac.agDurumu?.() ?? 'yok'
  const adres = mac.katilimAdresi?.() ?? null
  const sinif = g.ayar.mod === 'sinif'
  const yerelBolunmus = mac.yerel.length === 2
  const [agDenendi, setAgDenendi] = useState(false)
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-4 lg:flex-row lg:items-start">
      <Cam className="flex flex-1 flex-col items-center gap-3 p-4 sm:p-6">
        <BolumBaslik no={1}>Yarışma Lobisi</BolumBaslik>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-end">
          <div className="hidden shrink-0 md:block">
            <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>
              <Kim avatar="robo" size={170} />
            </motion.div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-3 rounded-[24px] border border-white/25 bg-[#1d0b5c]/55 p-4">
            <Yazi className="text-center text-[clamp(22px,2.6vw,32px)]">{g.ayar.ad}</Yazi>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                ['memo', `${g.ayar.soruSayisi} Soru`],
                ['stopwatch', `Soru başı ${g.ayar.sure} sn`],
                ['friends', `${g.oyuncular.length} Katılımcı`],
                ['school', `${g.ayar.sinif}. sınıf`],
              ].map(([i, t]) => (
                <span key={t} className="mk-display flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[15px] text-white">
                  <Obj name={i} size={20} shadow={false} /> {t}
                </span>
              ))}
            </div>
            {!yerelBolunmus && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex flex-col items-center rounded-2xl bg-[#24105f] px-6 py-2 shadow-inner">
                  <span className="mk-display text-[15px] text-white/80">Oyun Kodu</span>
                  <span className="mk-title text-[clamp(44px,6vw,64px)] leading-none tracking-[0.12em] text-white" aria-label={`Oyun kodu ${g.kod.split('').join(' ')}`}>
                    {ag === 'bagli' || mac.rol === 'oyuncu' ? g.kod : '— — — —'}
                  </span>
                </div>
                {adres && <QR url={adres} size={130} />}
              </div>
            )}
            {yonetici && !yerelBolunmus && ag !== 'bagli' && (
              <p className="max-w-[460px] text-center text-[14px] font-bold text-white/85">
                {ag === 'baglaniyor'
                  ? 'Sınıf ağına bağlanılıyor…'
                  : agDenendi || sinif
                    ? 'Sınıf sunucusu bulunamadı. Öğretmen bilgisayarında "npm run sinif" açıkken, aynı Wi-Fi’deki cihazlar kodla katılabilir. Şimdilik karakter rakiplerle yarışabilirsin.'
                    : 'Arkadaşların kendi cihazlarından katılsın istersen sınıf ağını aç; ya da karakter rakipler ekleyip hemen başla!'}
              </p>
            )}
            {yonetici && (
              <div className="flex flex-wrap justify-center gap-3">
                {!yerelBolunmus && ag !== 'bagli' && (
                  <ParlakButon
                    renk="mor"
                    onClick={() => {
                      setAgDenendi(true)
                      void mac.agiAc?.()
                    }}
                    disabled={ag === 'baglaniyor'}
                  >
                    <Obj name="friends" size={28} shadow={false} /> Arkadaşlarını davet et
                  </ParlakButon>
                )}
                {!sinif && !yerelBolunmus && (
                  <ParlakButon renk="pembe" onClick={() => mac.botEkle?.()} ariaLabel="Karakter rakip ekle">
                    <Obj name="robot" size={28} shadow={false} /> Karakter rakip ekle
                  </ParlakButon>
                )}
                {sinif && ag === 'bagli' && (
                  <ParlakButon renk="mor" onClick={() => mac.kilitle?.(!g.kilitli)}>
                    <Obj name={g.kilitli ? 'lock' : 'key2'} size={26} shadow={false} /> {g.kilitli ? 'Odayı aç' : 'Odayı kilitle'}
                  </ParlakButon>
                )}
              </div>
            )}
            {yonetici ? (
              <ParlakButon
                className="!min-h-[64px] w-[min(380px,90%)]"
                disabled={g.oyuncular.length === 0}
                onClick={() => {
                  sfx('fanfare')
                  mac.baslat?.()
                }}
              >
                <Obj name="rocket" size={30} shadow={false} /> Yarışmayı Başlat
              </ParlakButon>
            ) : (
              <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <Yazi className="text-[20px]">Katıldın! Öğretmen başlatınca yarışma başlayacak…</Yazi>
              </motion.div>
            )}
          </div>
        </div>
      </Cam>
      <Cam className="flex w-full flex-col gap-3 p-4 lg:w-[360px]">
        <BolumBaslik>Oyuncular ({g.oyuncular.length})</BolumBaslik>
        {g.oyuncular.length === 0 && <p className="text-center font-bold text-white/80">Henüz kimse yok. Kodu paylaş!</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          <AnimatePresence>
            {g.oyuncular.map((o) => (
              <motion.div key={o.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`relative flex flex-col items-center gap-1 rounded-2xl p-2 ${o.id === mac.benimId ? 'bg-[#5ee1ff]/25 ring-2 ring-[#5ee1ff]' : 'bg-white/10'}`}>
                <Rozet avatar={o.avatar} size={56} renk={o.takim === 1 ? '#5aa8ff' : o.takim === 0 ? '#ff6b6b' : '#ffd23f'} />
                <span className="mk-display max-w-full truncate text-[15px] text-white">{o.ad}</span>
                {o.bot && <span className="text-[11px] font-black uppercase tracking-wide text-white/70">karakter</span>}
                {yonetici && !mac.yerel.includes(o.id) && (
                  <button onClick={() => mac.at?.(o.id)} aria-label={`${o.ad} oyuncusunu çıkar`} className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-[#e53935] text-[13px] font-black text-white shadow">
                    ✕
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Cam>
    </div>
  )
}

/* ================================================================ soru / cevap */
function SoruAlani({ g, mac }: { g: Gorunum; mac: Mac }) {
  const toplamMs = g.evre === 'soru' ? g.ayar.sure * 1000 : 3200
  const kalan = useKalan(g.kalanMs, `${g.evre}-${g.no}`)
  const sn = Math.ceil(kalan / 1000)
  const sonSn = useRef(-1)
  useEffect(() => {
    if (g.evre === 'soru' && sn <= 5 && sn > 0 && sn !== sonSn.current) {
      sonSn.current = sn
      sfx('tap')
    }
  }, [sn, g.evre])
  const [secim, setSecim] = useState<Record<string, number>>({})
  useEffect(() => setSecim({}), [g.no])
  const soru = g.soru!
  const bolunmus = mac.yerel.length === 2
  const ogretmen = mac.rol === 'yonetici' && mac.yerel.length === 0
  const acik = g.evre === 'cevap'

  // cevap evresinde ses
  const ben = g.oyuncular.find((o) => o.id === (bolunmus ? null : mac.benimId))
  useEffect(() => {
    if (!acik) return
    if (bolunmus || ogretmen) sfx('pop')
    else if (ben?.son?.dogru) {
      sfx('correct')
      setTimeout(() => sfx('star'), 250)
    } else sfx('wrong')
  }, [acik]) // eslint-disable-line react-hooks/exhaustive-deps

  const sec = (i: number, pid?: string) => {
    const id = pid ?? mac.benimId ?? ''
    if (g.evre !== 'soru' || secim[id] !== undefined) return
    sfx('pick')
    setSecim((s) => ({ ...s, [id]: i }))
    mac.cevapla(i, pid)
  }
  const cevaplayan = g.oyuncular.filter((o) => o.cevapladi).length

  return (
    <div className="mx-auto flex h-full max-w-[1180px] flex-col gap-3">
      <Cam className="flex flex-1 flex-col gap-3 p-3 sm:p-5">
        <div className="flex items-start gap-3">
          {g.evre !== 'cevap' && <ZamanHalkasi kalan={kalan} toplam={toplamMs} size={g.evre === 'hazir' ? 64 : 84} />}
          <div className="flex-1 rounded-[24px] bg-white px-4 py-3 shadow-[0_8px_0_rgba(40,10,110,0.25)]">
            <p className="mk-display text-center text-[clamp(18px,2.4vw,30px)] leading-snug text-[#2b1468]">{soru.prompt}</p>
          </div>
          {ogretmen && g.evre === 'soru' && (
            <span className="mk-display shrink-0 rounded-2xl bg-white/15 px-3 py-2 text-center text-[15px] text-white">
              <span className="block text-[28px]">{cevaplayan}</span>/{g.oyuncular.length} cevap
            </span>
          )}
        </div>
        {g.evre === 'hazir' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            {soru.visual && (
              <div className="rounded-[24px] bg-white/85 p-3">
                <VisualView v={soru.visual} />
              </div>
            )}
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
              <Yazi className="text-[clamp(28px,4vw,48px)]">Hazır ol!</Yazi>
            </motion.div>
            <div className="h-3 w-[min(420px,80%)] overflow-hidden rounded-full bg-white/20">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ffd23f] to-[#ff7aa8]" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: g.kalanMs / 1000, ease: 'linear' }} />
            </div>
          </div>
        ) : (
          <div className={`flex flex-1 flex-col items-stretch gap-3 ${soru.visual && !bolunmus ? 'md:flex-row md:items-center' : ''}`}>
            {soru.visual && (
              <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} className={`grid place-items-center self-center rounded-[24px] bg-white/85 p-3 shadow-lg ${bolunmus ? '[zoom:0.7]' : 'md:w-[34%]'} [@media(max-height:560px)]:[zoom:0.6]`}>
                <VisualView v={soru.visual} />
              </motion.div>
            )}
            {bolunmus ? (
              <div className="grid flex-1 grid-cols-2 gap-3">
                {mac.yerel.map((pid) => {
                  const o = g.oyuncular.find((x) => x.id === pid)!
                  return (
                    <div key={pid} className="flex flex-col gap-2 rounded-[22px] bg-[#1d0b5c]/55 p-2">
                      <div className="flex items-center gap-2">
                        <Rozet avatar={o.avatar} size={36} renk={o.takim === 1 ? '#5aa8ff' : '#ff6b6b'} />
                        <Yazi className="flex-1 truncate text-[17px]">{o.ad}</Yazi>
                        <span className="mk-display text-[16px] text-[#ffe27a]">{o.puan.toLocaleString('tr-TR')}</span>
                      </div>
                      <Secenekler options={soru.options} onSec={(i) => sec(i, pid)} secilen={secim[pid]} dogru={g.dogru} acik={acik} kucuk kilit={secim[pid] !== undefined || g.evre !== 'soru'} />
                      {acik && <SonucSeridi son={o.son} kucuk />}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center gap-3">
                <Secenekler options={soru.options} onSec={(i) => sec(i)} secilen={mac.benimId ? secim[mac.benimId] : undefined} dogru={g.dogru} acik={acik} kilit={ogretmen || (mac.benimId ? secim[mac.benimId] !== undefined : true) || g.evre !== 'soru'} dagilim={ogretmen || acik ? g.dagilim : undefined} />
                {!ogretmen && g.evre === 'soru' && mac.benimId && secim[mac.benimId] !== undefined && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mk-display text-center text-[18px] text-white">
                    Cevabın alındı! Diğerleri bekleniyor… ({cevaplayan}/{g.oyuncular.length})
                  </motion.p>
                )}
              </div>
            )}
          </div>
        )}
        {acik && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-2">
            {!bolunmus && !ogretmen && <SonucSeridi son={ben?.son} seri={ben?.seri} />}
            {g.aciklama && (
              <div className="flex w-full max-w-[860px] items-center gap-3 rounded-2xl bg-white/90 px-4 py-2 shadow">
                <Obj name="bulb" size={34} shadow={false} />
                <p className="text-[clamp(15px,1.7vw,19px)] font-extrabold text-[#2b1468]">{g.aciklama}</p>
              </div>
            )}
          </motion.div>
        )}
      </Cam>
    </div>
  )
}

function Secenekler({ options, onSec, secilen, dogru, acik, kilit, kucuk, dagilim }: { options: Option[]; onSec: (i: number) => void; secilen?: number; dogru?: number; acik: boolean; kilit: boolean; kucuk?: boolean; dagilim?: number[] }) {
  return (
    <div className={`grid gap-[clamp(8px,1.2vw,14px)] ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`} role="group" aria-label="Cevaplar">
      {options.map((o, i) => {
        const r = CEVAP_RENK[i]
        const dogruMu = acik && i === dogru
        const soluk = (acik && i !== dogru) || (!acik && secilen !== undefined && secilen !== i)
        return (
          <motion.button
            key={i}
            onClick={() => !kilit && onSec(i)}
            disabled={kilit && !acik}
            aria-label={`${r.harf}: ${o.label ?? o.img ?? 'seçenek'}`}
            whileHover={!kilit ? { y: -3, scale: 1.01 } : {}}
            whileTap={!kilit ? { scale: 0.96, y: 3 } : {}}
            animate={dogruMu ? { scale: [1, 1.05, 1] } : secilen === i && !acik ? { scale: 0.97 } : { scale: 1 }}
            transition={dogruMu ? { duration: 0.8, repeat: 2 } : { duration: 0.15 }}
            className={`relative flex items-center gap-3 rounded-[24px] text-left text-white ${options.length === 3 && i === 2 ? 'col-span-2' : ''} ${kucuk ? 'min-h-[clamp(60px,13vh,120px)] px-2 py-1.5' : 'min-h-[clamp(72px,17vh,150px)] px-4 py-2'}`}
            style={{ background: r.bg, boxShadow: `0 6px 0 ${r.alt}, 0 10px 20px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.45)`, opacity: soluk ? 0.38 : 1, outline: secilen === i ? '4px solid #fff' : undefined, outlineOffset: 2 }}
          >
            <span className={`mk-display grid shrink-0 place-items-center rounded-full bg-white/90 ${kucuk ? 'h-10 w-10 text-[20px]' : 'h-14 w-14 text-[28px]'}`} style={{ color: r.alt }} aria-hidden>
              {r.sekil}
            </span>
            {o.img && <Obj name={o.img} size={kucuk ? 34 : 'clamp(36px,6vh,56px)'} shadow={false} />}
            {o.visual && (
              <span className="rounded-xl bg-white/90 p-1 [zoom:0.6]">
                <VisualView v={o.visual} size="sm" />
              </span>
            )}
            {o.label && <span className={`mk-display flex-1 leading-tight [text-shadow:0_2px_0_rgba(0,0,0,0.25)] ${kucuk ? 'text-[clamp(15px,1.9vw,24px)]' : 'text-[clamp(20px,2.7vw,36px)]'}`}>{o.label}</span>}
            {dogruMu && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[24px] font-black text-[#22a845] shadow">
                ✓
              </motion.span>
            )}
            {dagilim && <span className="mk-display shrink-0 rounded-full bg-black/25 px-3 py-1 text-[16px]">{dagilim[i]}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}

function SonucSeridi({ son, seri, kucuk }: { son?: { dogru: boolean; kazanc: number }; seri?: number; kucuk?: boolean }) {
  const metin = !son ? 'Süre bitti! Bir sonrakinde yetişirsin.' : son.dogru ? `Doğru! +${son.kazanc} puan` : 'Bu sefer olmadı, olsun! Doğrusunu öğrendin.'
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`mk-display flex items-center justify-center gap-2 rounded-full px-5 py-2 text-white shadow-lg ${kucuk ? 'text-[15px]' : 'text-[clamp(18px,2.2vw,26px)]'}`}
      style={{ background: son?.dogru ? 'linear-gradient(180deg,#5fe07a,#22a845)' : 'linear-gradient(180deg,#b48bff,#7c4dff)' }}
    >
      <Obj name={son?.dogru ? 'star' : 'heart'} size={kucuk ? 22 : 32} shadow={false} />
      {metin}
      {son?.dogru && seri && seri >= 2 ? <span className="rounded-full bg-[#ff7a1a] px-2 text-[0.8em]">🔥 {seri} seri</span> : null}
    </motion.div>
  )
}

/* ================================================================ sıralama */
function Siralama({ g, mac }: { g: Gorunum; mac: Mac }) {
  const list = g.oyuncular
  const ogretmen = mac.rol === 'yonetici' && mac.yerel.length === 0
  useEffect(() => sfx('whoosh'), [])
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-3">
      <Cam className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BolumBaslik no={3}>Canlı Sıralama</BolumBaslik>
          {g.takimPuan && <TakimSkor g={g} />}
        </div>
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-end lg:justify-center">
          <Podyum ilk={list.slice(0, 3)} benimId={mac.benimId} />
          {list.length > 3 && (
            <div className="w-full max-w-[380px]">
              <SiraListesi list={list.slice(3, 7)} benimId={mac.benimId} />
            </div>
          )}
        </div>
        {ogretmen && (
          <div className="flex justify-center">
            <ParlakButon onClick={() => mac.sonraki?.()}>Sonraki Soru ➜</ParlakButon>
          </div>
        )}
      </Cam>
    </div>
  )
}
function TakimSkor({ g }: { g: Gorunum }) {
  const [a, b] = g.takimPuan!
  const ad = g.ayar.takimlar ?? ['Kırmızı Takım', 'Mavi Takım']
  return (
    <div className="flex items-center gap-2">
      <span className="mk-display rounded-full bg-[#e53935] px-4 py-1.5 text-[17px] text-white shadow">
        {ad[0]}: {a.toLocaleString('tr-TR')}
      </span>
      <span className="mk-display text-white">vs</span>
      <span className="mk-display rounded-full bg-[#2f6fe0] px-4 py-1.5 text-[17px] text-white shadow">
        {ad[1]}: {b.toLocaleString('tr-TR')}
      </span>
    </div>
  )
}

/* ================================================================ sonuç */
function Sonuc({ g, mac, onCik, onTekrar, secenek }: { g: Gorunum; mac: Mac; onCik: () => void; onTekrar?: () => void; secenek?: MacSecenek }) {
  const { finishGame } = useGame()
  const benId = mac.yerel[0] ?? mac.benimId
  const ben = g.oyuncular.find((o) => o.id === benId)
  const sira = ben ? g.oyuncular.findIndex((o) => o.id === benId) + 1 : 0
  const odulu = ben ? odul({ ...ben, cevaplar: {}, bot: undefined }, g.toplam, sira) : null
  const verildi = useRef(false)
  const [tekrar, setTekrar] = useState(false)
  useEffect(() => {
    sfx('fanfare')
    if (verildi.current || !ben || !odulu) return
    verildi.current = true
    finishGame({ gameId: `yarisma-${g.ayar.kategori}`, stars: odulu.yildiz, accuracy: odulu.oran, seconds: g.toplam * g.ayar.sure, coins: odulu.altin, xp: odulu.xp })
    secenek?.turnuva?.onSonuc(sira)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // yanlış/cevapsız sorular
  const yanlislar = useMemo(() => {
    const qs = g.sorular ?? []
    const cev: Record<number, number | undefined> =
      mac instanceof OdaYonetici && benId ? Object.fromEntries(Object.entries(mac.cevaplari(benId)).map(([k, v]) => [k, v.secim])) : mac instanceof OdaIstemci ? mac.benimCevaplar : {}
    return qs.filter((q, i) => cev[i] !== q.answer)
  }, [g.sorular, mac, benId])
  const konular = [...new Set((g.sorular ?? []).map((q) => q.konu))].slice(0, 6)
  const bolunmus = mac.yerel.length === 2
  const kazanan = g.oyuncular[0]
  const takimKazanan = g.takimPuan ? (g.takimPuan[0] === g.takimPuan[1] ? null : g.takimPuan[0] > g.takimPuan[1] ? 0 : 1) : undefined
  const turnuvaGecti = secenek?.turnuva && sira > 0 && sira <= secenek.turnuva.gecmeSirasi

  if (tekrar) return <YanlisCalis sorular={yanlislar} onBitti={() => setTekrar(false)} />

  const baslik =
    takimKazanan !== undefined
      ? takimKazanan === null
        ? 'Berabere! İki takım da harikaydı!'
        : `${(g.ayar.takimlar ?? ['Kırmızı Takım', 'Mavi Takım'])[takimKazanan]} kazandı!`
      : bolunmus
        ? `${kazanan?.ad} kazandı!`
        : sira === 1
          ? 'Tebrikler! 1. Oldun!'
          : sira > 0
            ? `Harika! ${sira}. oldun!`
            : `${kazanan?.ad ?? ''} birinci oldu!`

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-3 lg:flex-row">
      <Cam className="flex flex-1 flex-col gap-3 p-4 sm:p-6">
        <BolumBaslik no={4}>Sonuç ve Ödüller</BolumBaslik>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }} className="shrink-0">
            <Kim avatar={(bolunmus ? kazanan : ben ?? kazanan)?.avatar ?? 'findik'} size={190} pose="cheer" />
          </motion.div>
          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <Obj name="trophy" size={64} />
              </motion.div>
              <Yazi className="text-[clamp(26px,3.4vw,42px)] leading-tight">{baslik}</Yazi>
            </div>
            {turnuvaGecti !== undefined && secenek?.turnuva && (
              <span className={`mk-display rounded-full px-4 py-1.5 text-[18px] text-white ${turnuvaGecti ? 'bg-[#22a845]' : 'bg-[#7c4dff]'}`}>
                {turnuvaGecti ? (secenek.turnuva.asama >= 2 ? '🏆 Turnuva şampiyonu oldun!' : '✓ Bir sonraki aşamaya yükseldin!') : 'Bu aşamayı geçmek için ilk ' + secenek.turnuva.gecmeSirasi + ' içinde olmalısın. Tekrar dene!'}
              </span>
            )}
            {odulu && (
              <div className="flex flex-wrap gap-2">
                {[
                  ['star', `+${odulu.yildiz} yıldız`],
                  ['sparkles', `+${odulu.xp} XP`],
                  ['coin', `+${odulu.altin} altın`],
                  ['target', `${ben!.dogru}/${g.toplam} doğru`],
                ].map(([i, t]) => (
                  <motion.span key={t} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mk-display flex items-center gap-1.5 rounded-2xl bg-white/15 px-3 py-2 text-[17px] text-white">
                    <Obj name={i} size={28} shadow={false} /> {t}
                  </motion.span>
                ))}
              </div>
            )}
            {konular.length > 0 && (
              <div className="w-full">
                <span className="text-[13px] font-black uppercase tracking-wide text-white/70">Öğrenilen konular</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {konular.map((k) => (
                    <span key={k} className="rounded-full bg-[#24105f]/70 px-3 py-1 text-[14px] font-extrabold text-white">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start">
          {onTekrar && (
            <ParlakButon renk="yesil" onClick={onTekrar}>
              ⟳ Tekrar Yarış
            </ParlakButon>
          )}
          {!bolunmus && ben && yanlislar.length > 0 && (
            <ParlakButon renk="mor" onClick={() => setTekrar(true)}>
              <Obj name="bulb" size={26} shadow={false} /> Yanlışlarımı Çalış ({yanlislar.length})
            </ParlakButon>
          )}
          <ParlakButon renk="sari" onClick={onCik}>
            Yarışmalar
          </ParlakButon>
        </div>
      </Cam>
      <Cam className="flex w-full flex-col gap-2 p-4 lg:w-[380px]">
        <BolumBaslik>
          <span className="inline-flex items-center gap-2">
            <Obj name="trophy" size={24} shadow={false} /> Genel Sıralama
          </span>
        </BolumBaslik>
        {g.takimPuan && <TakimSkor g={g} />}
        <SiraListesi list={g.oyuncular.slice(0, 8)} bas={1} benimId={benId} />
      </Cam>
    </div>
  )
}

/* ================================================================ yanlışlarımı çalış */
function YanlisCalis({ sorular, onBitti }: { sorular: YSoru[]; onBitti: () => void }) {
  const [i, setI] = useState(0)
  const [secilen, setSecilen] = useState<number | null>(null)
  const [dogruSayi, setDogruSayi] = useState(0)
  const { finishGame } = useGame()
  const q = sorular[i]
  const bitti = i >= sorular.length
  const verildi = useRef(false)
  useEffect(() => {
    if (bitti && !verildi.current) {
      verildi.current = true
      if (dogruSayi > 0) {
        sfx('coin')
        finishGame({ gameId: 'yarisma-tekrar', stars: dogruSayi >= sorular.length ? 2 : 1, accuracy: dogruSayi / sorular.length, seconds: 0, coins: dogruSayi * 3, xp: dogruSayi * 5 })
      }
    }
  }, [bitti]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (q) speak(q.spoken ?? q.prompt)
  }, [i]) // eslint-disable-line react-hooks/exhaustive-deps
  if (bitti)
    return (
      <div className="grid h-full place-items-center">
        <Cam className="flex max-w-[560px] flex-col items-center gap-4 p-6 text-center">
          <Obj name="medal" size={96} />
          <Yazi className="text-[28px]">
            {dogruSayi}/{sorular.length} soruyu bu kez doğru yaptın!
          </Yazi>
          {dogruSayi > 0 && (
            <span className="mk-display rounded-full bg-[#ffd23f] px-4 py-1.5 text-[18px] text-[#3b2400]">
              +{dogruSayi * 3} altın · +{dogruSayi * 5} XP
            </span>
          )}
          <ParlakButon onClick={onBitti}>Sonuçlara dön</ParlakButon>
        </Cam>
      </div>
    )
  const sec = (k: number) => {
    if (secilen !== null) return
    setSecilen(k)
    if (k === q.answer) {
      sfx('correct')
      setDogruSayi((n) => n + 1)
    } else sfx('wrong')
  }
  return (
    <div className="mx-auto flex max-w-[980px] flex-col gap-3">
      <Cam className="flex flex-col gap-3 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <BolumBaslik>Yanlışlarımı Çalış</BolumBaslik>
          <span className="mk-display rounded-full bg-white/15 px-3 py-1 text-white">
            {i + 1} / {sorular.length}
          </span>
        </div>
        <div className="rounded-[24px] bg-white px-4 py-3">
          <p className="mk-display text-center text-[clamp(18px,2.4vw,28px)] text-[#2b1468]">{q.prompt}</p>
        </div>
        {q.visual && (
          <div className="self-center rounded-[24px] bg-white/85 p-3">
            <VisualView v={q.visual} />
          </div>
        )}
        <Secenekler options={q.options} onSec={sec} secilen={secilen ?? undefined} dogru={q.answer} acik={secilen !== null} kilit={secilen !== null} />
        {secilen !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
            <div className="flex w-full items-center gap-3 rounded-2xl bg-white/90 px-4 py-2">
              <Obj name={secilen === q.answer ? 'star' : 'bulb'} size={34} shadow={false} />
              <p className="text-[17px] font-extrabold text-[#2b1468]">{q.explain}</p>
            </div>
            <ParlakButon
              onClick={() => {
                setSecilen(null)
                setI((n) => n + 1)
              }}
            >
              {i + 1 < sorular.length ? 'Sonraki ➜' : 'Bitir'}
            </ParlakButon>
          </motion.div>
        )}
      </Cam>
    </div>
  )
}
