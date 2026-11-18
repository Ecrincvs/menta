/**
 * EBEVEYN PANELİ (ebeveyn kapısı arkasında).
 * Tüm veriler cihazda tutulur; kişisel bilgi toplanmaz.
 */
import { useState } from 'react'
import { BackButton, CandyButton } from '../components/ui/Controls'
import { Obj } from '../components/ui/Obj'
import { useGame } from '../state/store'
import { GAMES, gameById } from '../content/games'
import { mastery } from '../learning/mastery'
import { GRADES } from '../content/grades'

const SKILL_LABELS: Record<string, string> = {
  'turkce.ses.ilkses': 'Ses farkındalığı (ilk/son ses)',
  'mat.toplama': 'Toplama ve çıkarma (somut)',
}

export function ParentScreen() {
  const st = useGame()
  const [confirm, setConfirm] = useState(false)
  const gm = GRADES.find((g) => g.grade === st.grade)
  const sessions = st.sessions
  const totalMin = Math.round(sessions.reduce((a, s) => a + s.seconds, 0) / 60)
  const avgAcc = sessions.length ? sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length : 0
  const bySubject = (sub: 'turkce' | 'matematik') => {
    const ss = sessions.filter((s) => gameById(s.gameId)?.subject === sub)
    return { n: ss.length, acc: ss.length ? ss.reduce((a, s) => a + s.accuracy, 0) / ss.length : 0 }
  }
  const tr = bySubject('turkce')
  const mat = bySubject('matematik')
  const skillRows = Object.entries(st.skills).map(([k, v]) => ({ key: k, label: SKILL_LABELS[k] ?? k, stat: v, m: mastery(v) }))
  const struggling = skillRows.filter((r) => r.stat.needsReview || (r.stat.attempts >= 6 && r.m < 0.5))

  // son 7 gün etkinlik
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const ss = sessions.filter((s) => s.date.slice(0, 10) === key)
    return { key, label: d.toLocaleDateString('tr-TR', { weekday: 'short' }), n: ss.length, min: Math.round(ss.reduce((a, s) => a + s.seconds, 0) / 60) }
  })
  const maxN = Math.max(1, ...days.map((d) => d.n))

  return (
    <div className="absolute inset-0 overflow-y-auto bg-[linear-gradient(180deg,#eef8ff,#fff8e9)]">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-white/80 p-3 backdrop-blur sm:p-4">
        <BackButton />
        <div>
          <h1 className="mk-display text-[28px] leading-none">Ebeveyn Paneli</h1>
          <p className="text-[14px] font-bold text-[var(--mk-ink-soft)]">
            {st.nickname} · {gm?.label ?? 'Sınıf seçilmedi'} · Veriler yalnızca bu cihazda saklanır
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-4 p-4 md:grid-cols-4">
        <Kpi icon="trophy" label="Tamamlanan oyun" value={String(sessions.length)} />
        <Kpi icon="target" label="Ortalama başarı" value={`%${Math.round(avgAcc * 100)}`} />
        <Kpi icon="clock" label="Toplam süre" value={`${totalMin} dk`} />
        <Kpi icon="star" label="Kazanılan yıldız" value={String(st.stars)} />

        <section className="mk-card p-4 md:col-span-2">
          <h2 className="mk-display mb-3 text-[22px]">Ders performansı</h2>
          <Bar label="Türkçe" sub={`${tr.n} oyun`} value={tr.acc} color="var(--mk-red)" />
          <Bar label="Matematik" sub={`${mat.n} oyun`} value={mat.acc} color="var(--mk-purple)" />
        </section>

        <section className="mk-card p-4 md:col-span-2">
          <h2 className="mk-display mb-3 text-[22px]">Son 7 gün</h2>
          <div className="flex h-[120px] items-end gap-2" role="img" aria-label="Son yedi günde oynanan oyun sayısı">
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[12px] font-black text-[var(--mk-ink-soft)]">{d.n || ''}</span>
                <div className="w-full rounded-t-lg bg-[var(--mk-turquoise)]" style={{ height: `${(d.n / maxN) * 80}px`, minHeight: d.n ? 6 : 2, opacity: d.n ? 1 : 0.25 }} />
                <span className="text-[12px] font-bold">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-card p-4 md:col-span-2">
          <h2 className="mk-display mb-3 text-[22px]">Beceri ustalığı</h2>
          {skillRows.length === 0 && <p className="font-bold text-[var(--mk-ink-soft)]">Henüz veri yok. Birkaç oyun oynandıktan sonra burada görünecek.</p>}
          {skillRows.map((r) => (
            <Bar key={r.key} label={r.label} sub={`Seviye ${r.stat.level} · ${r.stat.correct}/${r.stat.attempts} doğru`} value={r.m} color="var(--mk-green)" />
          ))}
        </section>

        <section className="mk-card p-4 md:col-span-2">
          <h2 className="mk-display mb-3 text-[22px]">Zorlanılan konular ve öneriler</h2>
          {struggling.length === 0 ? (
            <p className="font-bold text-[var(--mk-green-dark)]">Şu an belirgin bir zorlanma görünmüyor. Harika gidiyor!</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {struggling.map((r) => (
                <li key={r.key} className="rounded-xl bg-[var(--mk-pastel-peach)] p-3 font-bold">
                  <b>{r.label}</b>: son denemelerde zorlanıyor. Uygulama bu konuyu otomatik olarak yeniden anlatıp daha kolay sorularla devam edecek. Evde de kısa tekrar önerilir
                  {r.key.startsWith('mat') ? ' (ör. masadaki nesneleri birlikte sayma).' : ' (ör. nesnelerin adını söyleyip ilk sesi bulma oyunu).'}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[13px] font-bold text-[var(--mk-ink-soft)]">
            Önerilen kullanım: günde 15–20 dakika. Uygulamada reklam, sohbet veya uygulama içi satın alma yoktur.
          </p>
        </section>

        <section className="mk-card p-4 md:col-span-4">
          <h2 className="mk-display mb-2 text-[22px]">Oyunlar</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {GAMES.filter((g) => g.available).map((g) => {
              const r = st.gameResults[g.id]
              return (
                <div key={g.id} className="flex items-center gap-3 rounded-xl bg-white/70 p-2">
                  <Obj name={g.icon} size={40} shadow={false} />
                  <div className="flex-1">
                    <p className="mk-display text-[18px] leading-none">{g.title}</p>
                    <p className="text-[13px] font-bold text-[var(--mk-ink-soft)]">{r ? `${r.plays} kez oynandı · en iyi ${r.best}★ · son başarı %${Math.round(r.lastAccuracy * 100)}` : 'Henüz oynanmadı'}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {confirm ? (
              <>
                <span className="font-black text-[var(--mk-red-dark)]">Tüm ilerleme silinecek. Emin misiniz?</span>
                <CandyButton color="red" onClick={() => st.resetProgress()}>
                  Evet, sil
                </CandyButton>
                <CandyButton color="sky" onClick={() => setConfirm(false)}>
                  Vazgeç
                </CandyButton>
              </>
            ) : (
              <CandyButton color="orange" onClick={() => setConfirm(true)} className="!min-h-[56px] !text-[18px]">
                İlerlemeyi sıfırla
              </CandyButton>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Kpi({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="mk-card flex items-center gap-3 p-4">
      <Obj name={icon} size={48} shadow={false} />
      <div>
        <p className="mk-display text-[28px] leading-none">{value}</p>
        <p className="text-[14px] font-bold text-[var(--mk-ink-soft)]">{label}</p>
      </div>
    </div>
  )
}

function Bar({ label, sub, value, color }: { label: string; sub: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between">
        <span className="font-black">{label}</span>
        <span className="text-[13px] font-bold text-[var(--mk-ink-soft)]">
          {sub} · %{Math.round(value * 100)}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-[#efe3c8]">
        <div className="h-full rounded-full" style={{ width: `${Math.round(value * 100)}%`, background: color }} />
      </div>
    </div>
  )
}
