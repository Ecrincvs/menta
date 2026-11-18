/** Ücretsiz: mevcut ham sayfayı opak bölgelere göre yeniden kes (ızgaraya oturmayan çıkartmalar için). */
import path from 'node:path'
import sharp from 'sharp'
const ROOT = path.resolve(import.meta.dirname, '../..')
const [, , name = 'pets', prefix = 'pet', ...names] = process.argv
const NAMES = names.length ? names : ['kopek', 'kedi', 'tavsan', 'civciv', 'tilki', 'kaplumbaga', 'panda', 'ejderha']
const src = path.join(ROOT, 'public/assets/art/raw', `${name}.png`)
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: Hh } = info
const A = (x, y) => data[(y * W + x) * 4 + 3]
const spans = (n, solid) => {
  const out = []
  let s = -1
  for (let i = 0; i < n; i++) {
    if (solid(i) && s < 0) s = i
    if (!solid(i) && s >= 0) { if (i - s > 40) out.push([s, i]); s = -1 }
  }
  if (s >= 0) out.push([s, n])
  return out
}
const rowSolid = (y) => { let c = 0; for (let x = 0; x < W; x++) if (A(x, y) > 200) c++; return c > 3 }
const rows = spans(Hh, rowSolid)
let k = 0
for (const [y0, y1] of rows) {
  const cols = spans(W, (x) => { for (let y = y0; y < y1; y++) if (A(x, y) > 200) return true; return false })
  for (const [x0, x1] of cols) {
    const pad = 6
    const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad)
    const file = `public/assets/art/characters/${prefix}-${NAMES[k++]}.webp`
    await sharp(src).extract({ left, top, width: Math.min(W, x1 + pad) - left, height: Math.min(Hh, y1 + pad) - top }).resize({ height: 360, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(ROOT, file))
    console.log(file, x0, x1, y0, y1)
  }
}
