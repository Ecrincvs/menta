/** Ücretsiz: karakter görsellerini opak sınırlara göre yeniden kırp (silik kenar pikselleri kırpmayı bozmasın). */
import path from 'node:path'
import sharp from 'sharp'
const ROOT = path.resolve(import.meta.dirname, '../..')
for (const id of process.argv.slice(2)) {
  const src = path.join(ROOT, 'public/assets/art/raw', `${id}.png`)
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const W = info.width, Hh = info.height, A = (x, y) => data[(y * W + x) * 4 + 3] > 120
  // ince artıkları yok say: en az 15 opak pikseli olan sütun/satırlar
  const colOk = (x) => { let c = 0; for (let y = 0; y < Hh; y++) if (A(x, y) && ++c >= 15) return true; return false }
  const rowOk = (y) => { let c = 0; for (let x = 0; x < W; x++) if (A(x, y) && ++c >= 15) return true; return false }
  // kenardaki ince çizgileri at: yalnızca 40 pikselden geniş sütun blokları sayılır
  const ok = Array.from({ length: W }, (_, x) => colOk(x))
  const blocks = []
  for (let x = 0, s = -1; x <= W; x++) { if (x < W && ok[x]) { if (s < 0) s = x } else if (s >= 0) { if (x - s > 40) blocks.push([s, x - 1]); s = -1 } }
  const x0 = blocks[0][0], x1 = blocks[blocks.length - 1][1]
  let y0 = 0; while (y0 < Hh && !rowOk(y0)) y0++
  let y1 = Hh - 1; while (y1 > y0 && !rowOk(y1)) y1--
  const p = 4, left = Math.max(0, x0 - p), top = Math.max(0, y0 - p)
  await sharp(src).extract({ left, top, width: Math.min(info.width, x1 + p) - left, height: Math.min(info.height, y1 + p) - top }).resize({ height: 900, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(ROOT, 'public/assets/art/characters', `${id}.webp`))
  console.log(id, x0, y0, x1, y1)
}
