import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

// Both logos are drawn from the same locked colours: the shared iron and brass
// tie the venture studio to the personal brand.
test('both logo files and BrandMark use only the locked mark colours', async () => {
  const globals = await read('app/globals.css')
  const mark = [...globals.matchAll(/--mark-[\w-]+:\s*(#[0-9a-f]{6})/gi)].map(([, hex]) => hex.toLowerCase())
  assert.equal(mark.length, 4, 'iron, brass, ember and bone are declared in app/globals.css')
  for (const file of ['public/favicon.svg', 'public/images/logos/scaleforged.svg']) {
    const fills = [...(await read(file)).matchAll(/fill="(#[0-9a-f]{6})"/gi)].map(([, hex]) => hex.toLowerCase())
    assert.ok(fills.length >= 3, `${file} must have its mark fills`)
    for (const hex of fills) assert.ok(mark.includes(hex), `${file} uses ${hex}, which is not a locked mark colour`)
  }
  const component = await read('components/BrandMark.tsx')
  assert.doesNotMatch(component, /#[0-9a-f]{3,8}\b/i, 'BrandMark draws from --mark-* tokens, never raw hex')
})

test('the personal brand signs with its own monogram, not the ScaleForge bars', async () => {
  assert.match(await read('components/Footer.tsx'), /<BrandMark brand="anthony-paquet"/)
  assert.doesNotMatch(await read('app/globals.css'), /\.brand-mark\b/, 'The three-bar mark belongs to ScaleForge')
})
