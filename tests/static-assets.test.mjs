import assert from 'node:assert/strict'
import { lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { prepareStaticAssets } from '../scripts/prepare-static-assets.mjs'

// Exercise the locked Next version's real public-copy implementation, which
// copies dotfiles unless the application prepares its generated export.
const require = createRequire(import.meta.url)
const { recursiveCopy } = require('next/dist/lib/recursive-copy')
const assetIgnore = await readFile(new URL('../public/.assetsignore', import.meta.url), 'utf8')

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-static-assets-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

test('the export excludes root and nested Finder metadata while preserving public assets', async (t) => {
  const root = await fixture(t)
  const publicDirectory = join(root, 'public')
  const output = join(root, 'out')
  const metadata = ['.DS_Store', 'images/.DS_Store', '.well-known/.DS_Store']
  const assets = {
    '.assetsignore': assetIgnore,
    '.well-known/security.txt': 'Contact: mailto:security@example.test\n',
    'images/brand.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
    'images/.DS_Store.txt': 'A distinct, allowed filename.\n',
    'index.html': '<!doctype html><title>Public page</title>',
  }
  for (const [name, content] of Object.entries({
    ...assets,
    ...Object.fromEntries(metadata.map((name) => [name, `Finder metadata: ${name}`])),
  })) {
    const file = join(publicDirectory, name)
    await mkdir(join(file, '..'), { recursive: true })
    await writeFile(file, content)
  }

  await recursiveCopy(publicDirectory, output)
  for (const name of metadata) {
    // The negative control demonstrates the original export exposed these
    // exact fixture files. Their later absence cannot pass vacuously.
    assert.equal(await readFile(join(output, name), 'utf8'), `Finder metadata: ${name}`)
  }

  assert.deepEqual((await prepareStaticAssets(output)).sort(), metadata.sort())
  for (const name of metadata) {
    await assert.rejects(lstat(join(output, name)), { code: 'ENOENT' })
    assert.equal(await readFile(join(publicDirectory, name), 'utf8'), `Finder metadata: ${name}`)
  }
  for (const [name, content] of Object.entries(assets)) {
    assert.equal(await readFile(join(output, name), 'utf8'), content)
  }
  assert.deepEqual(await prepareStaticAssets(output), [])
  assert.deepEqual(assetIgnore.split('\n').filter((line) => line && !line.startsWith('#')), ['**/.DS_Store'])
})

test('export preparation never follows a directory symlink or deletes its target', async (t) => {
  const root = await fixture(t)
  const output = join(root, 'out')
  const outside = join(root, 'outside')
  await mkdir(output)
  await mkdir(outside)
  await writeFile(join(outside, '.DS_Store'), 'Keep the original.')
  await symlink(outside, join(output, 'linked-directory'), 'dir')
  await symlink(join(outside, '.DS_Store'), join(output, '.DS_Store'))

  assert.deepEqual(await prepareStaticAssets(output), ['.DS_Store'])
  assert.equal(await readFile(join(outside, '.DS_Store'), 'utf8'), 'Keep the original.')
  assert.equal((await lstat(join(output, 'linked-directory'))).isSymbolicLink(), true)
  await assert.rejects(lstat(join(output, '.DS_Store')), { code: 'ENOENT' })
})

test('a symlinked export root is rejected before touching the original directory', async (t) => {
  const root = await fixture(t)
  const original = join(root, 'original')
  const output = join(root, 'out')
  await mkdir(original)
  await writeFile(join(original, '.DS_Store'), 'Keep the original.')
  await symlink(original, output, 'dir')

  await assert.rejects(prepareStaticAssets(output), /Export root must be a real directory/)
  assert.equal(await readFile(join(original, '.DS_Store'), 'utf8'), 'Keep the original.')
})

test('an unexpected directory named .DS_Store is rejected instead of recursively deleted', async (t) => {
  const root = await fixture(t)
  const output = join(root, 'out')
  await mkdir(join(output, '.DS_Store'), { recursive: true })
  await writeFile(join(output, '.DS_Store', 'keep.txt'), 'Keep unexpected contents.')

  await assert.rejects(prepareStaticAssets(output), /Refusing to remove a directory/)
  assert.equal(await readFile(join(output, '.DS_Store', 'keep.txt'), 'utf8'), 'Keep unexpected contents.')
})
