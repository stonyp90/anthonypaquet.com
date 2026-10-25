import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../lib/projects.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { getPersonalProjects, getStudio, personalProjectCopy } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const locales = ['en', 'fr']
const visibleBrands = (locale) => [getStudio(locale), ...getPersonalProjects(locale)]

test('each locale presents one parent studio and the same five distinct products', () => {
  for (const locale of locales) {
    const studio = getStudio(locale)
    const projects = getPersonalProjects(locale)
    assert.equal(studio.id, 'scaleforged')
    assert.equal(studio.name, 'ScaleForge')
    assert.equal(studio.url, 'https://scaleforged.io')
    assert.deepEqual(projects.map(({ name }) => name), ['GoNota', 'Tablix', 'Control Craft', 'Ursly', 'Offer Jewel'])
    assert.deepEqual(projects.map(({ url }) => url), [
      'https://gonota.ca', 'https://tablix.ca', 'https://controlcraft.io', 'https://ursly.io', undefined,
    ])
    assert.equal(new Set(visibleBrands(locale).map(({ id }) => id)).size, 6)
    assert.ok(!projects.some(({ id }) => id === studio.id), 'The studio is not another product card')
    assert.ok(personalProjectCopy[locale].heading)
    assert.ok(personalProjectCopy[locale].productsHeading)
  }
})

test('Offer Jewel is included without an invented destination, logo or feature claim', () => {
  for (const locale of locales) {
    const project = getPersonalProjects(locale).find(({ id }) => id === 'offer-jewel')
    assert.ok(project)
    assert.equal(project.inDevelopment, true)
    assert.equal(project.url, undefined)
    assert.equal(project.visual, undefined)
    assert.deepEqual(project.focus, [])
    assert.doesNotMatch(project.description, /jewel(?:lery|ry)|negotiat|marketplace|OfferDuel|Le Salon/i)
    assert.ok(personalProjectCopy[locale].development)
    assert.ok(personalProjectCopy[locale].contactSubject.includes('Offer Jewel'))
  }
})

test('Control Craft replaces the retired product identity while old fragment links resolve', async () => {
  for (const locale of locales) {
    const project = getPersonalProjects(locale).find(({ id }) => id === 'control-craft')
    assert.equal(project.name, 'Control Craft')
    assert.equal(project.url, 'https://controlcraft.io')
    assert.equal(project.visual.src, '/images/logos/control-craft.svg')
    assert.doesNotMatch(JSON.stringify(visibleBrands(locale)), /Lunorive|Lunarive|Lunar Rave/i)
  }
  const component = await readFile(new URL('../components/PersonalProjects.tsx', import.meta.url), 'utf8')
  assert.match(component, /id="lunorive"[^>]*aria-hidden="true"/, 'Retain the old page fragment without displaying the retired name')
})

test('Ursly retains the three-part brand signature in each locale', () => {
  assert.deepEqual(getPersonalProjects('fr').find(({ id }) => id === 'ursly').slogan, [
    'Vos sens.', 'Vos données.', 'Votre choix.',
  ])
  assert.deepEqual(getPersonalProjects('en').find(({ id }) => id === 'ursly').slogan, [
    'Your senses.', 'Your data.', 'Your choice.',
  ])
})

test('verified local visuals exist and reserve their canonical proportions', async () => {
  const brands = visibleBrands('en').filter(({ visual }) => visual)
  assert.equal(brands.length, 5, 'One studio and four products have verified brand files')
  for (const brand of brands) {
    assert.ok(brand.visual.width > 0 && brand.visual.height > 0)
    assert.ok(brand.visual.src.startsWith('/images/logos/'), `${brand.name} uses its own mark`)
    const asset = await readFile(new URL(`../public${brand.visual.src}`, import.meta.url))
    assert.ok(asset.length > 0)
  }
  assert.equal(getStudio('en').visual.src, '/images/logos/scaleforge-empreinte.svg')
})

test('French descriptions, categories and studio positioning are localized', () => {
  const english = visibleBrands('en')
  const french = visibleBrands('fr')
  for (let index = 0; index < english.length; index += 1) {
    assert.equal(english[index].id, french[index].id)
    assert.equal(english[index].name, french[index].name)
    assert.notEqual(english[index].description, french[index].description)
    assert.notEqual(english[index].category, french[index].category)
  }
  assert.notEqual(personalProjectCopy.en.productsHeading, personalProjectCopy.fr.productsHeading)
})

// The manifest is an executable provenance gate. It covers both the studio and
// product marks; projects awaiting verified artwork intentionally have no image.
test('each rendered brand visual is active, source-pinned and byte-identical', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../docs/project-brand-assets-2026-10-02.json', import.meta.url), 'utf8')
  )
  const byOutput = new Map(manifest.assets.map((asset) => [asset.output, asset]))
  for (const locale of locales) {
    for (const brand of visibleBrands(locale).filter(({ visual }) => visual)) {
      const entry = byOutput.get(`public${brand.visual.src}`)
      assert.ok(entry, `${brand.name} ships a visual with no manifest provenance`)
      assert.match(entry.usage ?? '', /^Active/, `${brand.name} uses a historical asset`)
      assert.equal(entry.transformation, 'Byte-identical copy', `${brand.name} mark must not be adapted here`)
      assert.match(entry.commit ?? '', /^[0-9a-f]{40}$/, `${brand.name} mark must be pinned to a source commit`)
      assert.equal(entry.sourceSha256, entry.outputSha256, `${brand.name} copy differs from its recorded source`)
      const bytes = await readFile(new URL(`../public${brand.visual.src}`, import.meta.url))
      assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.outputSha256, `${brand.name} visual hash drifted`)
      assert.equal(bytes.length, entry.outputBytes, `${brand.name} visual byte length drifted`)
      if (entry.sourceGitBlobSha) {
        const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
        assert.equal(blob, entry.sourceGitBlobSha, `${brand.name} differs from the pinned Git blob`)
      }
      const declared = brand.visual.width / brand.visual.height
      const recorded = entry.width / entry.height
      assert.ok(Math.abs(declared - recorded) / recorded < 0.01, `${brand.name} visual geometry drifted`)
    }
  }
  for (const output of ['public/images/logos/scaleforge-mark.svg', 'public/images/logos/lunorive-mark.png']) {
    assert.match(byOutput.get(output).usage, /^Superseded/, `${output} must remain historical`)
  }
})

// Only the already verified studio company profile is exposed. A founder's
// personal profile and an unverified company account cannot substitute for it.
test('the studio links only the verified company LinkedIn page', () => {
  const verified = ['https://www.linkedin.com/company/scaleforged/']
  for (const locale of locales) {
    assert.deepEqual(getStudio(locale).socialLinks.map(({ href }) => href), verified)
  }
  for (const forbidden of ['facebook.com', 'x.com', 'twitter.com', 'instagram.com', 'youtube.com']) {
    assert.equal(source.toLowerCase().includes(forbidden), false, `${forbidden} is not a verified profile in this catalog`)
  }
})

// Preserve the existing investor-pitch release gate when the section changes.
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
