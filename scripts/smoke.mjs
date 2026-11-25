/**
 * Uçtan uca duman testi + ekran görüntüleri.
 * Gerçek Chrome ile uygulamayı açar, ekranları gezer, iki oyunu baştan sona oynar.
 *   npm run dev  (ayrı terminalde)  →  npm run smoke
 * Ortam değişkenleri: URL (varsayılan http://localhost:5173), CHROME (chrome.exe yolu)
 */
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const URL = process.env.URL ?? 'http://localhost:5173'
const CHROME =
  process.env.CHROME ??
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) =>
    fs.existsSync(p),
  )
const OUT = path.resolve('screenshots')
fs.mkdirSync(OUT, { recursive: true })

const errors = []
const log = (...a) => console.log('•', ...a)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
})

async function newPage(viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: false })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  return page
}
const shot = async (page, name) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) })
  log('ekran:', name)
}

/** Oyun döngüsü: tamamlanma ekranı gelene kadar oynar */
async function playUntilDone(page, stepFn, label) {
  for (let i = 0; i < 80; i++) {
    if (await page.getByRole('dialog', { name: 'Görevi tamamladın' }).isVisible().catch(() => false)) return true
    const devam = page.getByRole('button', { name: 'Devam et', exact: true })
    if (await devam.isVisible().catch(() => false)) {
      await devam.click({ force: true, timeout: 2000 }).catch(() => {})
      await sleep(700)
      continue
    }
    await stepFn(i)
  }
  throw new Error(`${label}: oyun tamamlanamadı`)
}

// ---------------------------------------------------------------- TABLET
const page = await newPage({ width: 1180, height: 820 })
await page.goto(URL)
await page.evaluate(() => localStorage.clear())
await page.reload()
await sleep(4200)
await shot(page, '01-karsilama')

await page.getByRole('button', { name: 'Maceraya başla' }).click({ force: true })
await sleep(1500)
await shot(page, '02-sinif-secimi')
await page.getByRole('button', { name: /^1\. Sınıf/ }).click({ force: true })
await sleep(700)
await shot(page, '02b-sinif-secildi')
await sleep(2200)
await sleep(3200) // kamera girişi
await shot(page, '03-ana-dunya')

// kilitli bina
await page.getByRole('button', { name: /Fen Bilimleri Dünyası, bu sınıfta kilitli/ }).click({ force: true })
await sleep(900)
await shot(page, '03b-kilitli-bina')

// Türkçe
// (dersler yan menüden kaldırıldı; haritadaki binaya dokunarak girilir)
await page.evaluate(() => window.dispatchEvent(new CustomEvent('mk-select', { detail: 'turkce' })))
await sleep(700)
await shot(page, '03c-binaya-yaklasma')
await sleep(1800)
await shot(page, '04-turkce-dunyasi')

await page.getByRole('button', { name: 'Sesi Bul', exact: true }).click({ force: true })
await sleep(1500)
await shot(page, '05-harf-avi-giris')
await page.getByRole('button', { name: 'Başla' }).click({ force: true })
await sleep(1500)
await shot(page, '06-harf-avi-oyun')

let tookWrong = false
await playUntilDone(
  page,
  async () => {
    const tiles = page.getByRole('group', { name: 'Cevaplar' }).locator('button:not([disabled])')
    const n = await tiles.count()
    if (!n) return void (await sleep(500))
    await tiles.first().click({ force: true })
    await sleep(350)
    if (!tookWrong && (await page.getByText(/Bir daha deneyelim|Az kaldı|Hmm/).first().isVisible().catch(() => false))) {
      tookWrong = true
      await sleep(250)
      await shot(page, '07-harf-avi-yanlis')
    }
    await sleep(1700)
  },
  'Sesi Bul',
)
await sleep(2800)
await shot(page, '08-gorev-tamamlandi')
await page.getByRole('button', { name: 'Devam et', exact: true }).click({ force: true })
await sleep(1200)
await shot(page, '08b-turkce-sonrasi')

// Matematik
await page.getByRole('button', { name: 'Dünyaya dön' }).click({ force: true })
await sleep(1500)
await page.evaluate(() => window.dispatchEvent(new CustomEvent('mk-select', { detail: 'matematik' })))
await sleep(2600)
await shot(page, '09-matematik-dunyasi')
await page.getByRole('button', { name: 'Elma Toplama', exact: true }).click({ force: true })
await sleep(1500)
await page.getByRole('button', { name: 'Başla' }).click({ force: true })
await sleep(1500)
await shot(page, '10-elma-toplama-oyun')

let dragShot = false
let answerShot = false
await playUntilDone(
  page,
  async () => {
    const apples = page.getByRole('button', { name: 'Elma', exact: true })
    if ((await apples.count()) > 0) {
      const a = await apples.first().boundingBox({ timeout: 2000 }).catch(() => null)
      const basket = await page.locator('[aria-label^="Sepet"]').boundingBox({ timeout: 2000 }).catch(() => null)
      if (a && basket) {
        await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
        await page.mouse.down()
        const tx = basket.x + basket.width / 2
        const ty = basket.y + basket.height / 2
        for (let k = 1; k <= 12; k++) await page.mouse.move(a.x + (tx - a.x) * (k / 12), a.y + (ty - a.y) * (k / 12))
        if (!dragShot) {
          dragShot = true
          await shot(page, '11-elma-surukleniyor')
        }
        await page.mouse.up()
        await sleep(450)
      }
      return
    }
    const tiles = page.getByRole('group', { name: 'Cevaplar' }).getByRole('button')
    if ((await tiles.count()) > 0) {
      if (!answerShot) {
        answerShot = true
        await sleep(600)
        await shot(page, '11b-elma-cevap')
      }
      await tiles.first().click({ force: true })
      await sleep(2900)
      return
    }
    await sleep(500)
  },
  'Elma Toplama',
)
await sleep(2800)
await shot(page, '12-elma-tamamlandi')
await page.getByRole('button', { name: 'Devam et', exact: true }).click({ force: true })
await sleep(1200)
await shot(page, '12b-matematik-yildizlar')

// Avatar
await page.getByRole('button', { name: 'Kaşifimi düzenle' }).first().click({ force: true })
await sleep(1200)
await page.getByRole('button', { name: 'Evcil Dost', exact: true }).click({ force: true })
await sleep(400)
await page.getByRole('button', { name: 'Kedi', exact: true }).click({ force: true })
await sleep(500)
await shot(page, '13-avatar')
await page.getByRole('button', { name: 'Kaydet' }).click({ force: true })
await sleep(1200)

// Ebeveyn paneli (ebeveyn kapısı)
await page.getByRole('button', { name: 'Ayarlar' }).first().click({ force: true })
await sleep(600)
await shot(page, '14-ayarlar')
await page.getByRole('button', { name: 'Ebeveyn Paneli' }).click({ force: true })
await sleep(500)
const q = await page.locator('text=/çarpı/').first().innerText()
const words = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
const m = q.match(/(\S+) çarpı (\S+)/)
await page.getByLabel('Cevap').fill(String(words.indexOf(m[1]) * words.indexOf(m[2])))
await page.getByRole('button', { name: 'Gir' }).click({ force: true })
await sleep(1000)
await shot(page, '15-ebeveyn-paneli')

// ---------------------------------------------------------------- YARIŞMA MODU (karakterlere karşı hızlı yarış)
log('Yarışma Modu')
await page.evaluate(() => window.__mkStore?.getState().go({ name: 'yarisma' }))
await sleep(1500)
await shot(page, '16-yarisma-ana')
await page.getByRole('button', { name: 'Matematik hızlı yarış' }).click({ force: true })
await sleep(4200)
await shot(page, '17-yarisma-soru')
await page.locator('[aria-label^="A:"]').first().click({ force: true })
await page.getByText(/Doğru!|Bu sefer olmadı|Süre bitti/).first().waitFor({ timeout: 40000 })
await shot(page, '18-yarisma-cevap')

// ---------------------------------------------------------------- TELEFON
const phone = await newPage({ width: 390, height: 844 })
await phone.goto(URL)
await sleep(4000)
await shot(phone, '20-telefon-karsilama')
await phone.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('minik-kasifler-v1') ?? '{"state":{}}')
  s.state.grade = 1
  localStorage.setItem('minik-kasifler-v1', JSON.stringify(s))
})
await phone.reload()
await sleep(1500)
await phone.getByRole('button', { name: 'Maceraya başla' }).click({ force: true })
await sleep(4500)
await shot(phone, '21-telefon-dunya')
await phone.evaluate(() => window.dispatchEvent(new CustomEvent('mk-select', { detail: 'turkce' })))
await sleep(2600)
await shot(phone, '22-telefon-turkce')
await phone.getByRole('button', { name: 'Harf Avı', exact: true }).click({ force: true })
await sleep(1200)
await phone.getByRole('button', { name: 'Başla' }).click({ force: true })
await sleep(1500)
await shot(phone, '23-telefon-harf-avi')

// telefon yatay
const land = await newPage({ width: 844, height: 390 })
await land.goto(URL)
await sleep(3500)
await shot(land, '24-telefon-yatay')

await browser.close()

const overflow = errors.filter((e) => !/WebGL|GPU stall|swiftshader|Automatic fallback/i.test(e))
console.log('\n=== Konsol/sayfa hataları:', overflow.length)
for (const e of [...new Set(overflow)].slice(0, 30)) console.log(e)
process.exit(overflow.length ? 1 : 0)
