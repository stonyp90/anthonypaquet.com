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
    assert.deepEqual(projects.map(({ name }) => name), ['GoNota', 'Tablix', 'Ursly', 'ScaleForge', 'Lunorive'])
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
// shipped mark must match the hash recorded for it, no card may use an asset the
// manifest does not declare active, and each active mark must be pinned to a commit
// in its own product repository and copied byte for byte rather than adapted here.
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
      assert.equal(
        entry.transformation,
        'Byte-identical copy',
        `${project.name} mark must be copied byte for byte, never redrawn for this site`
      )
      assert.match(
        entry.commit ?? '',
        /^[0-9a-f]{40}$/,
        `${project.name} mark must be pinned to a commit in its product repository`
      )
      assert.equal(
        entry.sourceSha256,
        entry.outputSha256,
        `${project.name} shipped mark is not the byte-identical copy its manifest records`
      )
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

// A social destination ships only when its ownership is verified. The 2026-10-15
// studio social audit (docs/social evidence in the scaleforged-website repository)
// confirmed admin access to the ScaleForge LinkedIn company page. X, Facebook,
// Reddit and every other network stayed unverified, so none of them may appear
// in the catalogue, even as a placeholder.
test('ScaleForge links only the verified company LinkedIn page', () => {
  const verified = ['https://www.linkedin.com/company/scaleforged/']
  for (const locale of ['en', 'fr']) {
    const project = getPersonalProjects(locale).find(({ id }) => id === 'scaleforged')
    assert.deepEqual((project.socialLinks ?? []).map(({ href }) => href), verified)
  }
  for (const forbidden of ['facebook.com', 'x.com', 'twitter.com', 'instagram.com', 'youtube.com']) {
    assert.equal(source.toLowerCase().includes(forbidden), false, `${forbidden} is not a verified ScaleForge profile`)
  }
})

// The investor pitch is private until the final review passes and the owner
// releases it. The entry point is prepared in code, but the release gate keeps
// every pitch link out of the rendered cards while the status is not live.
test('the pitch entry point stays closed until the owner releases it', async () => {
  const configSource = await readFile(new URL('../config/pitch-release.json', import.meta.url), 'utf8')
  const config = JSON.parse(configSource)
  assert.equal(config.status, 'pending-owner-release')
  const compiledGate = ts.transpileModule(
    await readFile(new URL('../lib/pitch-release.ts', import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }
  ).outputText
  const { pitchLinks } = await import(
    `data:text/javascript;base64,${Buffer.from(compiledGate).toString('base64')}`
  )
  assert.equal(pitchLinks(config), null, 'A pending pitch must not create public links')
  const live = { ...config, status: 'live', verified: true }
  assert.ok(pitchLinks(live), 'A released pitch exposes its bilingual entries')
})
