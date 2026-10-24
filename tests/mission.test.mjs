import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

// The owner dictated these words. They are the requirement, not a copy of the
// implementation, so they are pinned here and every published copy is checked
// against them.
const OWNER_QUOTE =
  'My goal is to unify the world. I would like AI running each and every decision based on data. Why? Creating war, why being against technology. I, Anthony Paquet, AnthonyPaquet.com, want to bring peace, leveraging AI to spend more time with family, more joy and help the society.'

const LOCALES = ['en', 'fr', 'zh']

const MISSION_URLS = [
  'https://www.anthonypaquet.com/mission/',
  'https://www.anthonypaquet.com/fr/mission/',
  'https://www.anthonypaquet.com/zh/mission/',
]

// Crawlers that publish a user agent and matter for the Chinese-speaking
// audience the mission page exists for. Bytespider (ByteDance) was already
// allowed and stays in the list so a rewrite cannot silently drop it.
const CHINESE_CRAWLERS = [
  'Baiduspider',
  'Sogou web spider',
  '360Spider',
  'YisouSpider',
  'PetalBot',
  'Bytespider',
]

const source = await readFile(new URL('../lib/content/mission.ts', import.meta.url), 'utf8')
const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8')
const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8')
const sitemapScript = await readFile(
  new URL('../scripts/generate-sitemap.mjs', import.meta.url),
  'utf8',
)

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1
}

function localeBlock(code) {
  const marker = `  ${code}: {\n    code: '${code}',`
  const start = source.indexOf(marker)
  assert.ok(start !== -1, `mission.ts has no ${code} block`)
  const rest = source.slice(start + marker.length)
  const next = rest.search(/\n  (?:en|fr|zh): \{\n    code:/)
  const end = next === -1 ? rest.indexOf('\nconst HREFLANG') : next
  assert.ok(end > 0, `mission.ts ${code} block has no end`)
  return rest.slice(0, end)
}

// Minimal robots.txt group reader: a user agent is allowed only when its own
// group carries Allow: /. A positive control below proves it does not simply
// find "Allow: /" anywhere in the file.
function allows(text, userAgent) {
  return text
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#')),
    )
    .some((lines) => {
      const agents = lines
        .filter((line) => /^user-agent:/i.test(line))
        .map((line) => line.slice(line.indexOf(':') + 1).trim().toLowerCase())
      const allowsAll = lines.some((line) => /^allow:\s*\/\s*$/i.test(line))
      return allowsAll && agents.includes(userAgent.toLowerCase())
    })
}

test('the owner quote exists once in the copy module and once in llms.txt', () => {
  assert.equal(occurrences(source, OWNER_QUOTE), 1, 'the quote must have one source in mission.ts')
  assert.equal(occurrences(llms, OWNER_QUOTE), 1, 'llms.txt must quote the same wording')
})

test('every mission locale carries a title, a scope note and three commitments', () => {
  for (const code of LOCALES) {
    const block = localeBlock(code)
    assert.match(block, /metaTitle: '/, `${code} has no metaTitle`)
    assert.match(block, /lead: '/, `${code} has no lead`)
    assert.ok(block.includes('scopeBody:'), `${code} has no scope note`)
    // Count only the entries inside `principles`, not the page title field.
    const start = block.indexOf('principles: [')
    assert.ok(start !== -1, `${code} has no principles array`)
    const principles = block.slice(start, block.indexOf(']', start))
    assert.equal(
      (principles.match(/title: '/g) ?? []).length,
      3,
      `${code} should carry exactly three commitments`,
    )
  }
})

test('English is the original and French and Chinese carry a labelled translation', () => {
  assert.ok(localeBlock('en').includes('translation: null'), 'English must not claim a translation')
  for (const code of ['fr', 'zh']) {
    const block = localeBlock(code)
    assert.ok(!block.includes('translation: null'), `${code} must ship a translation`)
    assert.match(block, /translationLabel: '/, `${code} must label the translation as one`)
  }
})

test('each locale page renders the shared component for its own locale', async () => {
  const expected = [
    ['../app/(en)/mission/page.tsx', 'en'],
    ['../app/(fr)/fr/mission/page.tsx', 'fr'],
    ['../app/(zh)/zh/mission/page.tsx', 'zh'],
  ]
  for (const [file, code] of expected) {
    const page = await readFile(new URL(file, import.meta.url), 'utf8')
    assert.ok(page.includes(`<Mission locale="${code}" />`), `${file} does not render ${code}`)
    assert.ok(page.includes(`missionMetadata('${code}')`), `${file} has no ${code} metadata`)
  }
})

test('llms.txt points at all three mission pages', () => {
  for (const url of MISSION_URLS) {
    assert.ok(llms.includes(url), `llms.txt is missing ${url}`)
  }
  assert.ok(llms.includes('## Mission'), 'llms.txt has no mission section')
})

test('robots.txt names every Chinese crawler the page depends on', () => {
  for (const agent of CHINESE_CRAWLERS) {
    assert.ok(allows(robots, agent), `robots.txt does not allow ${agent}`)
  }
})

test('the robots reader is not vacuous', () => {
  // Positive control: a wildcard does not stand in for a named agent.
  assert.equal(allows('User-agent: *\nAllow: /\n', 'Baiduspider'), false)
  assert.equal(allows('User-agent: Baiduspider\nAllow: /\n', 'Baiduspider'), true)
})

test('the sitemap groups Chinese under the same canonical path as zh-CN', () => {
  assert.match(sitemapScript, /LOCALIZED_PREFIXES = \['fr', 'zh'\]/)
  assert.match(sitemapScript, /zh: 'zh-CN'/)
})
