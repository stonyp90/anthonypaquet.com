import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { access, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const here = (path) => new URL(`../${path}`, import.meta.url)

// Each of these was superseded by its product's own canonical brand file. They
// stay listed so a stale mark cannot quietly return to the repository.
const retired = [
  'public/images/logos/gonota.svg',
  'public/images/logos/scaleforged.svg',
  'public/images/logos/tablix-personal.svg',
  'public/images/logos/tablix-personal.webp',
  'public/images/logos/tablix-icon.svg',
  'public/images/logos/tablix-icon-512.png',
  'public/images/logos/tablix-og.png',
  'public/images/logos/lunorive-wordmark.svg',
]

test('a retired mark stays out of the repository', async () => {
  for (const path of retired) {
    const gone = await access(here(path)).then(() => false, () => true)
    assert.ok(gone, `${path} is superseded; its product's canonical mark replaced it`)
  }
})

// Source repositories can be absent in CI, but every pinned output must still
// pass its manifest hash and byte-count checks, including the Tablix PNG.
test('every pinned mark still matches its product repository', () => {
  let report
  try {
    report = execFileSync(process.execPath, ['scripts/sync-product-logos.mjs', '--check'], { encoding: 'utf8' })
  } catch (error) {
    assert.fail(`Mark sync reported drift:\n${error.stdout ?? ''}${error.stderr ?? ''}`)
  }
  assert.doesNotMatch(report, /^FAIL/m, report)
  assert.match(report, /0 red/)
})

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')

async function logoFixture(t, { count = 1, missingRepo = false, badSourceHash = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-product-logos-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const repo = join(root, 'source')
  const outputDirectory = join(root, 'public/images/logos')
  await Promise.all([
    mkdir(join(root, 'scripts')),
    mkdir(join(root, 'docs')),
    mkdir(repo),
    mkdir(outputDirectory, { recursive: true }),
  ])
  await copyFile(here('scripts/sync-product-logos.mjs'), join(root, 'scripts/sync-product-logos.mjs'))
  const bytes = Buffer.from('<svg>canonical product mark</svg>\n')
  await writeFile(join(repo, 'mark.svg'), bytes)
  const git = (...args) => execFileSync('git', ['-C', repo, '-c', 'core.hooksPath=/dev/null', ...args], { encoding: 'utf8' })
  git('init', '--quiet')
  git('add', 'mark.svg')
  git('-c', 'user.name=Logo fixture', '-c', 'user.email=logo-fixture@example.invalid', 'commit', '--quiet', '-m', 'Pinned fixture mark')
  const commit = git('rev-parse', 'HEAD').trim()
  const assets = Array.from({ length: count }, (_, index) => ({
    product: index === 5 ? 'Tablix PNG' : `Fixture ${index + 1}`,
    remote: 'fixture/product',
    repo: missingRepo ? 'missing-source' : 'source',
    commit,
    source: `${missingRepo ? 'missing-source' : 'source'}/mark.svg`,
    output: `public/images/logos/${index === 5 ? 'tablix-mark.png' : `fixture-${index + 1}.svg`}`,
    transformation: 'Byte-identical copy',
    sourceSha256: badSourceHash ? digest(Buffer.from('unrelated source')) : digest(bytes),
    outputSha256: digest(bytes),
    sourceBytes: bytes.length,
    outputBytes: bytes.length,
  }))
  await writeFile(join(root, 'docs/project-brand-assets-2026-10-02.json'), JSON.stringify({ assets }))
  for (const asset of assets) await writeFile(join(root, asset.output), bytes)
  return {
    bytes,
    outputs: assets.map((asset) => join(root, asset.output)),
    run: (...args) => spawnSync(process.execPath, ['scripts/sync-product-logos.mjs', ...args], {
      cwd: root,
      encoding: 'utf8',
      timeout: 3000,
      maxBuffer: 64 * 1024,
    }),
  }
}

test('default sync restores a missing pinned output from its verified commit', async (t) => {
  const fixture = await logoFixture(t)
  await rm(fixture.outputs[0])
  const result = fixture.run()
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`)
  assert.deepEqual(await readFile(fixture.outputs[0]), fixture.bytes)
  assert.match(result.stdout, /1 restored/)
})

test('default sync replaces a corrupt same-length output with the exact source bytes', async (t) => {
  const fixture = await logoFixture(t)
  const corrupt = Buffer.from(fixture.bytes)
  corrupt[0] ^= 1
  await writeFile(fixture.outputs[0], corrupt)
  const result = fixture.run()
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`)
  assert.deepEqual(await readFile(fixture.outputs[0]), fixture.bytes)
  assert.match(result.stdout, /1 restored/)
})

test('check mode rejects missing outputs without creating them', async (t) => {
  const fixture = await logoFixture(t)
  await rm(fixture.outputs[0])
  const result = fixture.run('--check')
  assert.equal(result.status, 1, `${result.stdout}${result.stderr}`)
  assert.match(result.stderr, /shipped mark is missing/)
  assert.equal(await access(fixture.outputs[0]).then(() => true, () => false), false)
})

test('check mode rejects same-length drift without changing the output', async (t) => {
  const fixture = await logoFixture(t)
  const corrupt = Buffer.from(fixture.bytes)
  corrupt[0] ^= 1
  await writeFile(fixture.outputs[0], corrupt)
  const result = fixture.run('--check')
  assert.equal(result.status, 1, `${result.stdout}${result.stderr}`)
  assert.match(result.stderr, /shipped mark no longer matches/)
  assert.deepEqual(await readFile(fixture.outputs[0]), corrupt)
})

test('missing source repositories still allow all six intact outputs to be checked', async (t) => {
  const fixture = await logoFixture(t, { count: 6, missingRepo: true })
  const result = fixture.run('--check')
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`)
  assert.match(result.stdout, /6 pinned marks: 0 red, 6 skipped/)
})

test('an absent source repo cannot hide a corrupt sixth Tablix PNG in either mode', async (t) => {
  const fixture = await logoFixture(t, { count: 6, missingRepo: true })
  const corrupt = Buffer.from(fixture.bytes)
  corrupt[0] ^= 1
  await writeFile(fixture.outputs[5], corrupt)
  for (const args of [[], ['--check']]) {
    const result = fixture.run(...args)
    assert.equal(result.status, 1, `${args}: ${result.stdout}${result.stderr}`)
    assert.match(result.stderr, /Tablix PNG.*shipped mark no longer matches/)
    assert.deepEqual(await readFile(fixture.outputs[5]), corrupt)
  }
})

test('an absent source repo cannot hide a missing sixth Tablix PNG in either mode', async (t) => {
  const fixture = await logoFixture(t, { count: 6, missingRepo: true })
  await rm(fixture.outputs[5])
  for (const args of [[], ['--check']]) {
    const result = fixture.run(...args)
    assert.equal(result.status, 1, `${args}: ${result.stdout}${result.stderr}`)
    assert.match(result.stderr, /Tablix PNG.*shipped mark is missing/)
    assert.equal(await access(fixture.outputs[5]).then(() => true, () => false), false)
  }
})

test('a source hash mismatch never overwrites a drifted shipped mark', async (t) => {
  const fixture = await logoFixture(t, { badSourceHash: true })
  const corrupt = Buffer.from('existing output must be preserved')
  await writeFile(fixture.outputs[0], corrupt)
  const result = fixture.run()
  assert.equal(result.status, 1, `${result.stdout}${result.stderr}`)
  assert.match(result.stderr, /no longer holds the recorded bytes/)
  assert.deepEqual(await readFile(fixture.outputs[0]), corrupt)
})
