import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import ts from 'typescript'

// One portrait of record: the t-shirt photograph the owner also uses on social
// profiles. The suit portrait belongs to the Nota pitch deck only, so a second
// portrait file or a leftover reference here is a build failure.
const PORTRAIT_FILE = /\/images\/anthony-paquet-[\w-]+\.\w+/g

const SOURCE_DIRS = ['app', 'components', 'lib']
const SOURCE_SUFFIXES = ['.ts', '.tsx', '.css']
const TEXT_FILES = ['public/llms.txt', 'public/humans.txt', 'public/manifest.json']

const root = new URL('../', import.meta.url)
const publicPath = (path) => fileURLToPath(new URL(`public${path}`, root))

const data = await readFile(new URL('lib/data.ts', root), 'utf8')
const compiled = ts.transpileModule(data, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { personalInfo } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const portraitOfRecord = [personalInfo.photo, personalInfo.photoMask]

function walk(dir) {
  const found = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) found.push(...walk(new URL(`${entry.name}/`, dir)))
    else if (SOURCE_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) {
      found.push(new URL(entry.name, dir))
    }
  }
  return found
}

test('the hero portrait is the social photograph, with a cutout mask of the same size', async () => {
  assert.equal(personalInfo.photo, '/images/anthony-paquet-portrait.webp')
  const photo = await sharp(publicPath(personalInfo.photo)).metadata()
  const mask = await sharp(publicPath(personalInfo.photoMask)).metadata()
  assert.deepEqual([photo.width, photo.height], [personalInfo.photoWidth, personalInfo.photoHeight])
  assert.deepEqual([mask.width, mask.height], [photo.width, photo.height])
  assert.ok(mask.hasAlpha, 'The mask carries the cutout in its alpha channel')
})

test('the site ships no other portrait of the owner', () => {
  const shipped = readdirSync(new URL('public/images/', root))
    .filter((name) => name.startsWith('anthony-paquet-'))
    .map((name) => `/images/${name}`)
  assert.deepEqual(shipped.sort(), [...portraitOfRecord].sort())
})

test('every portrait reference in the shipped sources is the portrait of record', async () => {
  const files = [
    ...SOURCE_DIRS.flatMap((dir) => walk(new URL(`${dir}/`, root))),
    ...TEXT_FILES.map((file) => new URL(file, root)),
  ]
  for (const file of files) {
    const references = (await readFile(file, 'utf8')).match(PORTRAIT_FILE) ?? []
    for (const reference of references) {
      assert.ok(portraitOfRecord.includes(reference), `${file.pathname} shows ${reference}`)
    }
  }
})
