/**
 * MENTA SINIF YARIŞMA SUNUCUSU (okul ağı içinde, internete veri göndermez)
 *   npm run build && npm run sinif     → uygulamayı ve yarışma odalarını http://<okul-ağı-ip>:5174 adresinde açar
 * Görevleri:
 *  - oyun kodu üretir, odaları tutar (kurucu = öğretmen/kurucu cihaz)
 *  - oyuncu katılımını kurucuya, cevapları kurucuya, ekran durumunu oyunculara iletir
 *  - SOHBET YOK: oyuncudan yalnızca "katıl" ve "cevap" mesajı kabul edilir; başka hiçbir içerik iletilmez
 *  - takma ad temizlenir, mesaj boyutu ve sıklığı sınırlıdır, kurucu oyuncu çıkarabilir ve odayı kilitleyebilir
 *  - kişisel veri saklanmaz; oda kurucu ayrılınca silinir
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { WebSocketServer } from 'ws'

const PORT = Number(process.env.PORT ?? 5174)
const DIST = path.resolve('dist')
const AZAMI_OYUNCU = 40
const AZAMI_MESAJ = 4096

const lanIp = () => {
  for (const list of Object.values(os.networkInterfaces()))
    for (const a of list ?? []) if (a.family === 'IPv4' && !a.internal) return a.address
  return 'localhost'
}

/* ---------------------------------------------------------------- statik dosyalar (derlenmiş uygulama) */
const TIPLER = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }
const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x')
  if (url.pathname === '/saglik') {
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify({ ok: true, odalar: odalar.size }))
    return
  }
  if (!fs.existsSync(DIST)) {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Yarışma sunucusu çalışıyor. Uygulamayı buradan açmak için önce "npm run build" çalıştırın.')
    return
  }
  let p = path.normalize(path.join(DIST, decodeURIComponent(url.pathname)))
  if (!p.startsWith(DIST)) {
    res.writeHead(403)
    res.end()
    return
  }
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': TIPLER[path.extname(p)] ?? 'application/octet-stream' })
  fs.createReadStream(p).pipe(res)
})

/* ---------------------------------------------------------------- odalar */
/** kod → { kurucu: ws, oyuncular: Map<pid, ws>, kilitli } */
const odalar = new Map()
const kodUret = () => {
  for (let i = 0; i < 100; i++) {
    const k = String(1000 + crypto.randomInt(9000))
    if (!odalar.has(k)) return k
  }
  return String(10000 + crypto.randomInt(90000))
}
const gonder = (ws, m) => {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(m))
}
const adTemizle = (s) => String(s ?? '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 14) || 'Kaşif'

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: AZAMI_MESAJ })
wss.on('connection', (ws) => {
  ws.rol = null // 'kurucu' | 'oyuncu'
  ws.kod = null
  ws.pid = null
  ws.sayac = { t: Date.now(), n: 0 }

  ws.on('message', (raw) => {
    // sıklık sınırı: saniyede en çok 20 mesaj
    const now = Date.now()
    if (now - ws.sayac.t > 1000) ws.sayac = { t: now, n: 0 }
    if (++ws.sayac.n > 20) return
    let m
    try {
      m = JSON.parse(String(raw))
    } catch {
      return
    }
    if (!m || typeof m.t !== 'string') return

    // ---- kurucu
    if (m.t === 'olustur' && !ws.rol) {
      const kod = kodUret()
      ws.rol = 'kurucu'
      ws.kod = kod
      odalar.set(kod, { kurucu: ws, oyuncular: new Map(), kilitli: false })
      gonder(ws, { t: 'kod', kod, lan: lanIp() })
      log(`oda açıldı ${kod}`)
      return
    }
    if (ws.rol === 'kurucu') {
      const oda = odalar.get(ws.kod)
      if (!oda) return
      if (m.t === 'durum') for (const o of oda.oyuncular.values()) gonder(o, { t: 'durum', g: m.g })
      else if (m.t === 'reddet' || m.t === 'at') {
        const o = oda.oyuncular.get(String(m.pid))
        if (o) {
          gonder(o, m.t === 'at' ? { t: 'atildin' } : { t: 'reddet', neden: String(m.neden ?? '') })
          oda.oyuncular.delete(String(m.pid))
          o.close()
        }
      } else if (m.t === 'kilit') oda.kilitli = !!m.on
      else if (m.t === 'kapat') odaKapat(ws.kod)
      return
    }

    // ---- oyuncu (yalnızca katıl ve cevap)
    if (m.t === 'katil' && !ws.rol) {
      const kod = String(m.kod ?? '')
      const oda = odalar.get(kod)
      if (!oda) return gonder(ws, { t: 'hata', neden: 'Bu kodla bir yarışma bulunamadı.' })
      if (oda.kilitli) return gonder(ws, { t: 'hata', neden: 'Oda kilitli.' })
      if (oda.oyuncular.size >= AZAMI_OYUNCU) return gonder(ws, { t: 'hata', neden: 'Oda dolu.' })
      ws.rol = 'oyuncu'
      ws.kod = kod
      ws.pid = 'p' + crypto.randomBytes(4).toString('hex')
      oda.oyuncular.set(ws.pid, ws)
      gonder(ws, { t: 'katildi', pid: ws.pid })
      gonder(oda.kurucu, { t: 'katil', pid: ws.pid, ad: adTemizle(m.ad), avatar: String(m.avatar ?? '').slice(0, 20) })
      return
    }
    if (m.t === 'cevap' && ws.rol === 'oyuncu') {
      const oda = odalar.get(ws.kod)
      if (oda) gonder(oda.kurucu, { t: 'cevap', pid: ws.pid, no: Number(m.no), secim: Number(m.secim) })
    }
  })

  ws.on('close', () => {
    if (ws.rol === 'kurucu') odaKapat(ws.kod)
    else if (ws.rol === 'oyuncu') {
      const oda = odalar.get(ws.kod)
      if (oda?.oyuncular.delete(ws.pid)) gonder(oda.kurucu, { t: 'ayrildi', pid: ws.pid })
    }
  })
})

function odaKapat(kod) {
  const oda = odalar.get(kod)
  if (!oda) return
  for (const o of oda.oyuncular.values()) {
    gonder(o, { t: 'kapandi' })
    o.close()
  }
  odalar.delete(kod)
  log(`oda kapandı ${kod}`)
}
const log = (...a) => console.log(new Date().toLocaleTimeString('tr-TR'), ...a)

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n  Menta Sınıf Yarışma Sunucusu hazır')
  console.log(`  Bu bilgisayarda:  http://localhost:${PORT}`)
  console.log(`  Sınıftaki cihazlar (aynı Wi-Fi): http://${lanIp()}:${PORT}\n`)
})
