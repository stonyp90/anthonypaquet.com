import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../lib/projects.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { getPersonalProjects, personalProjectCopy } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

// Lunorive has no confirmed public URL yet, so it ships without a link rather
// than a guessed one. Give it its official destination once the domain exists.
test('each locale exposes the five personal projects with their official destinations', () => {
  for (const locale of ['en', 'fr']) {
    const projects = getPersonalProjects(locale)
    assert.deepEqual(projects.map(({ name }) => name), ['GoNota', 'Tablix', 'Ursly', 'ScaleForged', 'Lunorive'])
    assert.deepEqual(projects.map(({ url }) => url), [
      'https://gonota.ca', 'https://tablix.ca', 'https://ursly.io', 'https://scaleforged.io', undefined,
    ])
    assert.equal(new Set(projects.map(({ id }) => id)).size, 5)
    assert.ok(personalProjectCopy[locale].heading)
  }
})

test('Ursly retains the three-part brand signature in each locale', () => {
  assert.deepEqual(getPersonalProjects('fr').find(({ id }) => id === 'ursly').slogan, [
    'Vos sens.', 'Vos données.', 'Votre choix.',
  ])
  assert.deepEqual(getPersonalProjects('en').find(({ id }) => id === 'ursly').slogan, [
    'Your senses.', 'Your data.', 'Your choice.',
  ])
})

test('local visuals reserve their natural proportions and exist before rendering', async () => {
  for (const project of getPersonalProjects('en')) {
    assert.ok(project.visual.width > 0 && project.visual.height > 0)
    assert.ok(project.visual.src.startsWith('/images/'))
    const asset = await readFile(new URL(`../public${project.visual.src}`, import.meta.url))
    assert.ok(asset.length > 0)
  }
})

test('French descriptions and project categories are localized', () => {
  const english = getPersonalProjects('en')
  const french = getPersonalProjects('fr')
  for (let index = 0; index < english.length; index += 1) {
    assert.notEqual(english[index].description, french[index].description)
    assert.notEqual(english[index].category, french[index].category)
  }
})

// Every card is one pattern: a brand mark on the shared light card. A per-project
// palette is what made one card read as a dark panel inside a light grid.
test('every project card uses a mark on the shared light card', async () => {
  const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8')
  for (const locale of ['en', 'fr']) {
    for (const project of getPersonalProjects(locale)) {
      assert.ok(
        project.visual.src.startsWith('/images/logos/'),
        `${project.name} must present a brand mark, not artwork`
      )
    }
  }
  const themed = css
    .split('\n')
    .filter((line) => /^\.project-card--[\w-]+[^{]*\{/.test(line))
    .filter((line) => /(background|color|border-color):/.test(line))
  assert.deepEqual(themed, [], 'Per-project rules may size a card, never re-theme it')
  assert.doesNotMatch(css, /--color-ursly-/, 'The retired Ursly dark palette must not return')
})

// Brand provenance is a runtime gate, not a document a reader has to trust: every
// shipped mark must match the hash recorded for it, and no card may use an asset
// the manifest does not declare active.
test('every card visual is declared active and matches its recorded brand manifest', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../docs/project-brand-assets-2026-10-02.json', import.meta.url), 'utf8')
  )
  const byOutput = new Map(manifest.assets.map((asset) => [asset.output, asset]))
  for (const locale of ['en', 'fr']) {
    for (const project of getPersonalProjects(locale)) {
      const entry = byOutput.get(`public${project.visual.src}`)
      assert.ok(entry, `${project.name} ships a visual with no manifest provenance`)
      assert.match(entry.usage ?? 'Active', /^Active/, `${project.name} uses a historical asset`)
      const bytes = await readFile(new URL(`../public${project.visual.src}`, import.meta.url))
      assert.equal(
        createHash('sha256').update(bytes).digest('hex'),
        entry.outputSha256,
        `${project.name} visual no longer matches its recorded hash`
      )
      assert.equal(bytes.length, entry.outputBytes, `${project.name} visual byte length drifted`)
      const declared = project.visual.width / project.visual.height
      const recorded = entry.width / entry.height
      assert.ok(
        Math.abs(declared - recorded) / recorded < 0.01,
        `${project.name} visual aspect ratio no longer matches its recorded geometry`
      )
    }
  }
})
