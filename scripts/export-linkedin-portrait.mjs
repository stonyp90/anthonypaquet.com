// Format the existing imagegen alpha + original photograph for a circular avatar.
// Original subject pixels are retained; generated pixels may extend clothing below it.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { parseArgs } from 'node:util'
import sharp from 'sharp'

const { values } = parseArgs({ options: {
  portrait: { type: 'string', default: 'public/images/anthony-paquet-portrait.webp' },
  mask: { type: 'string', default: 'public/images/anthony-paquet-portrait-mask.webp' },
  tokens: { type: 'string', default: 'app/globals.css' },
  'background-token': { type: 'string', default: '--color-paper' },
  side: { type: 'string', default: '1280' },
  extension: { type: 'string' },
  'protected-top': { type: 'string' },
  'extension-blend-height': { type: 'string', default: '64' },
  output: { type: 'string', default: 'output/portraits/AnthonyPaquet-LinkedIn.png' },
} })
const side = Number(values.side)
const source = await sharp(values.portrait).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height } = source.info
assert.ok(Number.isInteger(side) && side >= Math.max(width, height), 'Canvas must hold the source without scaling')
const mask = await sharp(values.mask).extractChannel('alpha').raw().toBuffer({ resolveWithObject: true })
assert.equal(mask.info.width, width)
assert.equal(mask.info.height, height)
const left = Math.floor((side - width) / 2)
const top = Math.floor((side - height) / 2)
const tokens = await readFile(values.tokens, 'utf8')
const background = tokens.split('\n').find(line => line.trim().startsWith(`${values['background-token']}:`))?.split(':')[1].split(';')[0].trim()
assert.ok(background, 'Background must come from an existing design token')
const subject = await sharp(source.data, { raw: { width, height, channels: 3 } })
  .joinChannel(mask.data, { raw: { width, height, channels: 1 } }).png().toBuffer()
await mkdir(dirname(values.output), { recursive: true })
const square = await sharp({ create: { width: side, height: side, channels: 3, background } })
  .composite([{ input: subject, left, top }]).removeAlpha().png().toBuffer()
let final = sharp(square)
let protectedTop
if (values.extension) {
  protectedTop = Number(values['protected-top'])
  assert.ok(Number.isInteger(protectedTop) && protectedTop > top && protectedTop < top + height, 'Define the upper region to preserve')
  const originalTop = await sharp(square).extract({ left: 0, top: 0, width: side, height: protectedTop }).png().toBuffer()
  const remainingSubject = await sharp(subject).extract({ left: 0, top: protectedTop - top, width, height: height - protectedTop + top }).png().toBuffer()
  const blendHeight = Number(values['extension-blend-height'])
  assert.ok(Number.isInteger(blendHeight) && blendHeight > 0 && top + height + blendHeight <= side, 'Extension blend must stay below the original photograph')
  const generated = await sharp(values.extension).resize(side, side, { fit: 'fill' }).removeAlpha().raw().toBuffer()
  const seam = Buffer.alloc(width * blendHeight * 4)
  for (let y = 0; y < blendHeight; y++) {
    for (let x = 0; x < width; x++) {
      const sourcePixel = (height - 1) * width + x
      const seamPixel = y * width + x
      const generatedPixel = (top + height + y) * side + left + x
      const generatedEdge = (top + height) * side + left + x
      const amount = 1 - y / blendHeight
      for (let channel = 0; channel < 3; channel++) {
        const correction = source.data[sourcePixel * 3 + channel] - generated[generatedEdge * 3 + channel]
        seam[seamPixel * 4 + channel] = Math.max(0, Math.min(255, Math.round(generated[generatedPixel * 3 + channel] + correction * amount)))
      }
      seam[seamPixel * 4 + 3] = mask.data[sourcePixel]
    }
  }
  final = sharp(await sharp(values.extension).resize(side, side, { fit: 'fill' }).png().toBuffer())
    .composite([
      { input: originalTop, left: 0, top: 0 },
      { input: remainingSubject, left, top: protectedTop },
      { input: seam, raw: { width, height: blendHeight, channels: 4 }, left, top: top + height },
    ])
}
await final.removeAlpha().png({ compressionLevel: 9 }).toFile(values.output)

// Verify every fully opaque subject pixel still equals the decoded source RGB.
const result = await sharp(values.output).removeAlpha().raw().toBuffer()
let comparedPixels = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixel = y * width + x
    if (mask.data[pixel] !== 255) continue
    const outputPixel = (y + top) * side + x + left
    for (let channel = 0; channel < 3; channel++) {
      assert.equal(result[outputPixel * 3 + channel], source.data[pixel * 3 + channel], 'Source RGB must remain unchanged')
    }
    comparedPixels++
  }
}
const bytes = await readFile(values.output)
assert.ok(side >= 400 && bytes.length < 8_000_000, 'LinkedIn PNG upload constraints')
const report = {
  output: values.output, side, width, height, left, top, backgroundToken: values['background-token'],
  lowerExtension: values.extension, protectedTop,
  originalOpaquePixelsCompared: comparedPixels, changedRGBValues: 0,
  bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
  sourceSha256: createHash('sha256').update(await readFile(values.portrait)).digest('hex'),
}
await writeFile(`${values.output}.json`, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
