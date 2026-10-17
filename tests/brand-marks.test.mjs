import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

// Only the personal monogram is drawn in code. Every product mark is a byte-exact
// copy of its own brand file, so the monogram is the one thing these tokens guard.
test('the AP monogram and the favicon share the locked mark colours', async () => {
  const globals = await read('app/globals.css')
  const mark = [...globals.matchAll(/--mark-[\w-]+:\s*(#[0-9a-f]{6})/gi)].map(([, hex]) => hex.toLowerCase())
  assert.deepEqual(mark, ['#1a1a1a', '#d9892a', '#fbf5ea'], 'iron, brass and bone are the locked monogram colours')
  const fills = [...(await read('public/favicon.svg')).matchAll(/fill="(#[0-9a-f]{6})"/gi)].map(([, hex]) => hex.toLowerCase())
  assert.ok(fills.length >= 3, 'public/favicon.svg must carry its mark fills')
  for (const hex of fills) assert.ok(mark.includes(hex), `public/favicon.svg uses ${hex}, which is not a locked mark colour`)
  const component = await read('components/BrandMark.tsx')
  assert.doesNotMatch(component, /#[0-9a-f]{3,8}\b/i, 'BrandMark draws from --mark-* tokens, never raw hex')
})

test('no component redraws another brand', async () => {
  const component = await read('components/BrandMark.tsx')
  assert.doesNotMatch(component, /scaleforge|forge|bar\b|bars/i, 'Product marks ship as their own files, never as drawn bars')
  assert.match(await read('components/Footer.tsx'), /<BrandMark\b/, 'The personal brand signs with its own monogram')
  assert.doesNotMatch(await read('app/globals.css'), /\.brand-mark\b/, 'The retired three-bar mark must not return')
})
