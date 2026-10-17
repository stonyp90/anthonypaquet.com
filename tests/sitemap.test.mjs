import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('../scripts/generate-sitemap.mjs', import.meta.url))

// Mirrors what `next build` emits with trailingSlash: true.
function fixture(pages) {
  const root = mkdtempSync(path.join(tmpdir(), 'sitemap-'))
  for (const rel of pages) {
    const file = path.join(root, rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, '<html><body>page</body></html>')
  }
  return root
}

function run(root) {
  return spawnSync(process.execPath, [SCRIPT, root], {
    encoding: 'utf8',
    env: { ...process.env, SITE_URL: 'https://example.test/' },
  })
}

const locsOf = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)

test('directory index documents become clean URLs and error or dynamic routes are dropped', () => {
  const root = fixture([
    'index.html',
    '404.html',
    'fr/index.html',
    'fr/404/index.html',
    'blog/[slug]/index.html',
  ])
  try {
    const build = run(root)
    assert.equal(build.status, 0, build.stderr)
    const xml = readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    assert.deepEqual(locsOf(xml).sort(), ['https://example.test/', 'https://example.test/fr/'])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('each locale ships its alternates, an x-default, and a real lastmod', () => {
  const root = fixture(['index.html', 'fr/index.html'])
  try {
    assert.equal(run(root).status, 0)
    const xml = readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    const blocks = xml.split('<url>').slice(1)
    assert.equal(blocks.length, 2)
    for (const block of blocks) {
      const hreflangs = [...block.matchAll(/hreflang="([^"]+)"/g)].map(([, v]) => v).sort()
      assert.deepEqual(hreflangs, ['en-CA', 'fr-CA', 'x-default'])
      assert.match(block, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
      assert.ok(!block.includes('#'), 'fragment URLs are not indexable')
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a nested page is listed under its own locale group', () => {
  const root = fixture(['index.html', 'pricing/index.html', 'fr/pricing/index.html'])
  try {
    assert.equal(run(root).status, 0)
    const xml = readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    assert.deepEqual(locsOf(xml).sort(), [
      'https://example.test/',
      'https://example.test/fr/pricing/',
      'https://example.test/pricing/',
    ])
    const pricing = xml.split('<url>').slice(1).find((block) => block.includes('hreflang="x-default"') && !block.includes('<loc>https://example.test/</loc>'))
    const alternates = Object.fromEntries(
      [...pricing.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(([, lang, href]) => [lang, href])
    )
    assert.deepEqual(alternates, {
      'en-CA': 'https://example.test/pricing/',
      'fr-CA': 'https://example.test/fr/pricing/',
      'x-default': 'https://example.test/pricing/',
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('pages marked noindex stay out of the sitemap', () => {
  const root = fixture(['index.html', 'brand/index.html'])
  try {
    writeFileSync(path.join(root, 'brand/index.html'), '<html><head><meta name="robots" content="noindex, follow"/></head><body>guide</body></html>')
    assert.equal(run(root).status, 0)
    const xml = readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    assert.deepEqual(locsOf(xml), ['https://example.test/'])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('an export with no indexable page fails the build', () => {
  const root = fixture(['404/index.html'])
  try {
    const build = run(root)
    assert.equal(build.status, 1)
    assert.match(build.stderr, /no indexable pages/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
