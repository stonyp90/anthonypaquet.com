import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const currentBespokeClaim = /(?:currently (?:engaged )?(?:with|doing this at) Bespoke Labs|Bespoke Labs \(current\)|Current Engagements \(2026\))/i

for (const file of ['components/SiteDocument.tsx', 'public/llms.txt']) {
  test(`${file} does not present the previous Bespoke engagement as current`, async () => {
    const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.equal(currentBespokeClaim.test(content), false, 'Previous engagement must not be current in metadata')
  })
}

test('structured employment does not contradict the previous-role record', async () => {
  const content = await readFile(new URL('../components/SiteDocument.tsx', import.meta.url), 'utf8')
  assert.equal(/worksFor:\s*\{[^}]*name: 'Bespoke Labs'/s.test(content), false)
})
