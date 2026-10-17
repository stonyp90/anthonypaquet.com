/* Reproduce the personal-project marks from their own product repositories.
   Every pinned asset is a byte-identical copy: this site never redraws, retightens
   or recolours another brand, because an adaptation is how a mark goes stale.
   Run without arguments to restore the copies, or with --check to gate on drift.
   Source repositories are only on the owner's machine, so a missing repository is
   reported and skipped; the shipped bytes stay guarded by tests/projects.test.mjs. */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifestFile = 'docs/project-brand-assets-2026-10-02.json'
const checkOnly = process.argv.slice(2).includes('--check')
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

const manifest = JSON.parse(await readFile(resolve(root, manifestFile), 'utf8'))
const pinned = manifest.assets.filter((asset) => asset.commit)
if (pinned.length === 0) {
  console.error(`${manifestFile} pins no mark; nothing to do`)
  process.exit(1)
}

let failures = 0
let skipped = 0
let restored = 0

for (const asset of pinned) {
  const label = `${asset.product} → ${asset.output}`
  if (asset.transformation !== 'Byte-identical copy') {
    console.error(`FAIL  ${label} is recorded as "${asset.transformation}"; only byte-identical copies may be synced`)
    failures += 1
    continue
  }
  const repo = resolve(root, asset.repo)
  if (!existsSync(repo)) {
    console.log(`skip  ${label} — ${asset.remote} is not checked out here`)
    skipped += 1
    continue
  }
  const from = relative(repo, resolve(root, asset.source))
  let source
  try {
    source = execFileSync('git', ['-C', repo, 'show', `${asset.commit}:${from}`], { maxBuffer: 64 * 1024 * 1024 })
  } catch {
    console.error(`FAIL  ${label} — ${asset.remote} has no ${asset.commit.slice(0, 12)}:${from}`)
    failures += 1
    continue
  }
  if (sha256(source) !== asset.sourceSha256) {
    console.error(`FAIL  ${label} — ${asset.remote} ${asset.commit.slice(0, 12)} no longer holds the recorded bytes; re-pin the commit deliberately`)
    failures += 1
    continue
  }
  const shipped = await readFile(resolve(root, asset.output)).catch(() => null)
  if (shipped === null) {
    console.error(`FAIL  ${label} — the shipped mark is missing`)
    failures += 1
    continue
  }
  if (sha256(shipped) !== asset.outputSha256 || shipped.length !== asset.outputBytes) {
    console.error(`FAIL  ${label} — the shipped mark no longer matches its recorded hash`)
    failures += 1
    continue
  }
  if (checkOnly) {
    console.log(`ok    ${label} — byte-exact at ${asset.remote} ${asset.commit.slice(0, 12)}`)
    continue
  }
  if (sha256(source) === sha256(shipped)) {
    console.log(`ok    ${label} — already byte-exact`)
    continue
  }
  await writeFile(resolve(root, asset.output), source)
  restored += 1
  console.log(`wrote ${label} from ${asset.remote} ${asset.commit.slice(0, 12)}:${from}`)
}

console.log(`\n${pinned.length} pinned mark${pinned.length === 1 ? '' : 's'}: ${failures} red, ${skipped} skipped, ${restored} restored${checkOnly ? ', check only' : ''}`)
process.exitCode = failures > 0 ? 1 : 0
