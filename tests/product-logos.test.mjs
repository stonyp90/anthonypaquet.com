import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { access } from 'node:fs/promises'
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

// The product repositories live only on the owner's machine, so the script skips
// what is absent; the shipped bytes stay hash-guarded by tests/projects.test.mjs.
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
