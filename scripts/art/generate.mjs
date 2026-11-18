/**
 * OpenAI ile görsel üretimi → public/assets/art/
 *   node scripts/art/generate.mjs --only findik-wave,bg-forest [--quality high] [--force]
 * Anahtar: .env.local içindeki OPENAI_API_KEY (asla ekrana yazılmaz).
 * Her görsel: ham PNG (art/raw, git dışı) → optimize WebP → manifest.json güncellenir.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { JOBS, STYLE } from './prompts.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const ART = path.join(ROOT, 'public/assets/art')
const RAW = path.join(ART, 'raw')
const REF = path.join(ROOT, 'docs/reference')
// arka planlar: gpt-image-2 (en iyi sahne kalitesi) · karakterler: gpt-image-1.5 (şeffaf arka plan destekli)
const MODEL_BG = process.env.IMAGE_MODEL ?? 'gpt-image-2'
const MODEL_CHAR = process.env.IMAGE_MODEL ?? 'gpt-image-1.5'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : d
}
const only = opt('only', '')?.split(',').filter(Boolean)
const quality = opt('quality', 'high')

const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
const KEY = env.match(/OPENAI_API_KEY=(\S+)/)?.[1]
if (!KEY) throw new Error('.env.local içinde OPENAI_API_KEY yok')

fs.mkdirSync(RAW, { recursive: true })
fs.mkdirSync(path.join(ART, 'characters'), { recursive: true })
fs.mkdirSync(path.join(ART, 'backgrounds'), { recursive: true })

const refCache = new Map()
async function refBlob(name) {
  if (!refCache.has(name)) {
    // referansı küçült: daha az girdi maliyeti, stil bilgisi korunur
    // 'raw:' öneki: daha önce üretilmiş onaylı karakter (tutarlılık için model referansı)
    const src = name.startsWith('raw:') ? path.join(RAW, name.slice(4)) : path.join(REF, name)
    const buf = await sharp(src).resize({ width: 1024, withoutEnlargement: true }).png().toBuffer()
    refCache.set(name, new Blob([buf], { type: 'image/png' }))
  }
  return refCache.get(name)
}

async function generate(job) {
  const isChar = job.type === 'character' || job.type === 'sheet'
  const form = new FormData()
  form.append('model', isChar ? MODEL_CHAR : MODEL_BG)
  form.append('prompt', `${STYLE}\n\nUse the attached image(s) ONLY as a style reference (rendering, lighting, color, material). Create a new image:\n${job.prompt}`)
  form.append('size', job.size ?? (isChar ? '1024x1024' : '1536x1024'))
  form.append('quality', quality)
  form.append('n', '1')
  if (isChar) form.append('background', 'transparent')
  form.append('output_format', 'png')
  for (const r of job.refs ?? []) form.append('image[]', await refBlob(r), r)

  const res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(`${res.status} ${json?.error?.message ?? JSON.stringify(json).slice(0, 300)}`)
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('yanıtta görsel yok')
  return { buf: Buffer.from(b64, 'base64'), usage: json.usage }
}

async function optimize(job, raw) {
  if (job.type === 'sheet') {
    // ızgarayı hücrelere böl, her hücreyi kırp → characters/<char>-<ad>.webp
    const meta = await sharp(raw).metadata()
    const [cols, rows] = job.grid
    const cw = Math.floor(meta.width / cols), ch = Math.floor(meta.height / rows)
    const files = []
    for (let i = 0; i < job.names.length; i++) {
      const file = 'characters/' + job.char + '-' + job.names[i] + '.webp'
      const cell = await sharp(raw).extract({ left: (i % cols) * cw, top: Math.floor(i / cols) * ch, width: cw, height: ch }).png().toBuffer()
      await sharp(cell).trim({ threshold: 1 }).resize({ height: 360, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(ART, file))
      files.push([job.names[i], file])
    }
    return files
  }
  if (job.type === 'character') {
    const file = `characters/${job.id}.webp`
    await sharp(raw).trim({ threshold: 1 }).resize({ height: 900, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(ART, file))
    return file
  }
  const file = `backgrounds/${job.id}.webp`
  await sharp(raw).resize({ width: 2048, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(ART, file))
  return file
}

function updateManifest(job, file) {
  const mp = path.join(ART, 'manifest.json')
  const m = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, 'utf8')) : {}
  m.characters ??= {}
  m.backgrounds ??= {}
  if (job.type === 'sheet') {
    m.characters[job.char] ??= {}
    for (const [n, f] of file) m.characters[job.char][n] = f
  } else if (job.type === 'character') {
    m.characters[job.char] ??= {}
    m.characters[job.char][job.pose] = file
  } else m.backgrounds[job.bg] = file
  fs.writeFileSync(mp, JSON.stringify(m, null, 2) + '\n')
}

const todo = JOBS.filter((j) => (only?.length ? only.includes(j.id) : true))
console.log(`Model: ${MODEL_CHAR}/${MODEL_BG} · kalite: ${quality} · ${todo.length} görsel`)
const log = []
for (const job of todo) {
  const rawPath = path.join(RAW, `${job.id}.png`)
  if (fs.existsSync(rawPath) && !flag('force')) {
    console.log(`= ${job.id} (zaten var, atlandı)`)
    continue
  }
  const t = Date.now()
  try {
    const { buf, usage } = await generate(job)
    fs.writeFileSync(rawPath, buf)
    const file = await optimize(job, buf)
    updateManifest(job, file)
    const kb = Array.isArray(file) ? file.length : Math.round(fs.statSync(path.join(ART, file)).size / 1024)
    console.log(`✓ ${job.id} → ${file} (${kb} KB, ${Math.round((Date.now() - t) / 1000)} sn) usage=${JSON.stringify(usage ?? {})}`)
    log.push({ id: job.id, usage, date: new Date().toISOString() })
  } catch (e) {
    console.log(`✗ ${job.id}: ${e.message}`)
  }
}
fs.appendFileSync(path.join(ART, 'generation-log.jsonl'), log.map((l) => JSON.stringify(l)).join('\n') + (log.length ? '\n' : ''))
