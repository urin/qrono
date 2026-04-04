import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const src = 'dist/qrono.min.js'
const badgePath = 'images/size.svg'
const label = 'brotli'
const color = '#007ec6'
const leftWidth = 39
const height = 20
const minRightWidth = 43

function getBrotliSize(filePath) {
  const buffer = fs.readFileSync(filePath)
  const compressed = zlib.brotliCompressSync(buffer, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  })
  return `${(compressed.length / 1024).toFixed(1)}kB`
}

function createBadgeSvg(labelText, messageText) {
  const rightWidth = Math.max(minRightWidth, messageText.length * 7 + 9)
  const width = leftWidth + rightWidth
  const labelCenter = leftWidth / 2
  const messageCenter = leftWidth + rightWidth / 2
  const labelTextLength = 30
  const messageTextLength = messageText.length * 7
  const title = `${labelText}: ${messageText}`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${title}">
  <title>${title}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${width}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${color}"/>
    <rect width="${width}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelCenter * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${labelTextLength * 10}">${labelText}</text>
    <text x="${labelCenter * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${labelTextLength * 10}">${labelText}</text>
    <text aria-hidden="true" x="${messageCenter * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${messageTextLength * 10}">${messageText}</text>
    <text x="${messageCenter * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${messageTextLength * 10}">${messageText}</text>
  </g>
</svg>
`
}

try {
  const size = getBrotliSize(src)
  const svg = createBadgeSvg(label, size)
  fs.mkdirSync(path.dirname(badgePath), { recursive: true })
  fs.writeFileSync(badgePath, svg, 'utf-8')
  console.log(`Badge updated: ${badgePath}`)
} catch (err) {
  console.error('Failed to update badge:', err.message)
  process.exitCode = 1
}
