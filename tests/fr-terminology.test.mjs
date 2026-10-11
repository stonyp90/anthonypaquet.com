import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

// The French page speaks the way Québec tech teams speak. Literal translations of
// industry terms ("bac à sable" for sandbox) read as machine translation to the
// people this page is for, so the copy keeps the words they actually use.
const LITERAL_TRANSLATIONS = [
  [/bacs? à sable/i, 'sandbox'],
  [/carrés? de sable/i, 'sandbox'],
  [/infonuagique/i, 'cloud'],
  [/grilles? de notation/i, 'rubrics'],
  [/redimensionnement/i, 'rightsizing'],
  [/étiquetage/i, 'tagging'],
  [/reprise après sinistre/i, 'disaster recovery'],
  [/injection de requêtes/i, 'prompt injection'],
  [/passerelles? LLM/i, 'gateway LLM'],
  [/dévestiaire/i, 'divesting'],
  [/diffusion en continu/i, 'streaming'],
  [/flux de travail/i, 'workflows'],
  [/adéquation produit/i, 'product-market fit'],
  [/directeur technique/i, 'CTO'],
  [/feuille de route/i, 'roadmap'],
  [/surveillance continue/i, 'monitoring continu'],
  [/coûts de calcul/i, 'compute'],
]

const FRENCH_SOURCES = ['lib/content/fr.ts', 'app/(fr)/fr/page.tsx']

for (const file of FRENCH_SOURCES) {
  test(`${file} uses the industry term instead of a literal translation`, async () => {
    const text = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    const found = LITERAL_TRANSLATIONS.filter(([pattern]) => pattern.test(text)).map(
      ([pattern, term]) => `${pattern.source} should read "${term}"`,
    )
    assert.deepEqual(found, [])
  })
}

test('the French projects catalogue uses the industry terms too', async () => {
  const source = await readFile(new URL('../lib/projects.ts', import.meta.url), 'utf8')
  const french = source.slice(source.indexOf('  fr: ['))
  const found = LITERAL_TRANSLATIONS.filter(([pattern]) => pattern.test(french)).map(
    ([pattern, term]) => `${pattern.source} should read "${term}"`,
  )
  assert.deepEqual(found, [])
})

test('the guard catches the literal translation it exists for', () => {
  // Positive control: a list that matches nothing would pass every file above.
  assert.ok(LITERAL_TRANSLATIONS.some(([pattern]) => pattern.test('un bac à sable d’évaluation')))
  assert.ok(LITERAL_TRANSLATIONS.some(([pattern]) => pattern.test('un carré de sable')))
})
