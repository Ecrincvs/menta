/**
 * Sınıf ağı bağlantısı. Sunucu: `npm run sinif` (scripts/yarisma-sunucu.mjs, port 5174).
 * Uygulama sunucunun kendisinden açıldıysa aynı adres kullanılır; geliştirmede 5174 portuna bağlanılır.
 * İleride internet üzerinden oynamak için VITE_YARISMA_WS ile başka bir sunucu adresi verilebilir.
 */
export const SUNUCU_PORT = 5174

export function sunucuAdresi() {
  const env = import.meta.env.VITE_YARISMA_WS as string | undefined
  if (env) return env
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  const port = `:${SUNUCU_PORT}`
  return `${proto}://${location.hostname}${port}/ws`
}

/** Sunucuya bağlanmayı dener; ulaşılamazsa null (tek cihaz modlarına düşülür) */
export function baglan(sureMs = 1800): Promise<WebSocket | null> {
  return new Promise((resolve) => {
    let bitti = false
    let ws: WebSocket
    try {
      ws = new WebSocket(sunucuAdresi())
    } catch {
      resolve(null)
      return
    }
    const t = setTimeout(() => {
      if (bitti) return
      bitti = true
      try {
        ws.close()
      } catch {
        /* yok say */
      }
      resolve(null)
    }, sureMs)
    ws.onopen = () => {
      if (bitti) return
      bitti = true
      clearTimeout(t)
      resolve(ws)
    }
    ws.onerror = () => {
      if (bitti) return
      bitti = true
      clearTimeout(t)
      resolve(null)
    }
  })
}
