const fs = require('fs')
const md = fs.readFileSync('docs/meb-kitaplar/analiz/web-kaynaklar.md', 'utf8')
const ORDER = 'a n e t i l o k u r ı m ü s ö y d z ç b g c ş p h v ğ f j'.split(' ')
const low = (s) => s.toLocaleLowerCase('tr-TR')
const BAN = new Set(['it', 'kel', 'kötü', 'köstek', 'tekel', 'atilla', 'kötü kokar'])
// 1) kelimeler
const words = {}
const sec1 = md.split(/\n## 1\. /)[1].split(/\n## 2\. /)[0]
for (const block of sec1.split('### ').slice(1)) {
  const m = block.match(/^\d+\.\s+\S+\s+(\S+)/)
  if (!m) continue
  const l = low(m[1])
  const line = block.split('\n').find((x) => x.includes('Kelimeler:'))
  if (!line) continue
  // yalnızca tek ve düz kelimeler (ör. "alto + önceki: lale" gibi açıklama artıklarını at)
  words[l] = line
    .split('Kelimeler:')[1]
    .split(/[,+]/)
    .map((w) => w.replace(/\(r\)/g, '').trim())
    .filter((w) => /^[A-Za-zÇĞİÖŞÜçğıöşüÂâ]+$/.test(w) && !BAN.has(low(w)))
}
// 2) cümleler
const sents = {}
const sec2 = md.split(/\n## 2\. /)[1].split(/\n## 3\. /)[0]
for (const line of sec2.split('\n')) {
  const m = line.match(/^\*\*(\S+)\s+(\S+):\*\*\s*(.*)$/)
  if (!m) continue
  sents[low(m[2])] = m[3].split(' / ').map((s) => s.trim()).filter((s) => s && !/kötü/i.test(s))
}
// 3) problemler
const sec42 = md.split('### 4.2')[1].split('## 5.')[0]
const probs = []
for (const line of sec42.split('\n')) {
  const m = line.match(/^\d+\.\s+(.*)$/)
  if (m) probs.push(m[1].trim())
}
const order = ORDER.filter((l) => words[l] || sents[l])
let out = `/**\n * İnternet araştırmasından derlenen ek içerik (docs/meb-kitaplar/analiz/web-kaynaklar.md).\n * Kelime ve cümleler harf sırasına göre denetlendi (ajan + learning.test.ts). Çocuğa uygun olmayan birkaç kelime çıkarıldı.\n * Bu dosya scripts/parse-web.cjs ile üretilir; elle düzenlemeyin.\n */\n`
out += `export const WEB_WORDS: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(ORDER.map((l) => [l, words[l] ?? []])), null, 1)}\n\n`
out += `export const WEB_SENTENCES: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(ORDER.map((l) => [l, sents[l] ?? []])), null, 1)}\n\n`
out += `export const WEB_PROBLEMS: string[] = ${JSON.stringify(probs, null, 1)}\n`
fs.writeFileSync('src/content/webBank.ts', out)
console.log('kelime', Object.values(words).flat().length, 'cümle', Object.values(sents).flat().length, 'problem', probs.length, 'harf', order.length)
