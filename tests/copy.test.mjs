import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

// Site copy is published without dashes used as punctuation and without
// semicolons. The guard reads the shipped catalogues and components as syntax,
// so it follows the real strings instead of a hand-kept list of files.
const BANNED = [
  { pattern: /[—–−]/, label: 'em or en dash' },
  { pattern: / \d+ - \d+ | \w+ - \w+ /, label: 'spaced hyphen separator' },
  { pattern: /\d-\d/, label: 'hyphenated numeric range' },
  { pattern: /;/, label: 'semicolon' },
]

// ISO dates, URLs, colours, and Tailwind or CSS values legitimately use hyphens.
const EXCUSED = [
  /^\d{4}-\d{2}-\d{2}/,
  /^[a-z]+:\/\//,
  /^#[0-9a-f]{3,8}$/i,
  /^https?:\/\//,
  /^\.[\w-]+$/,
  /^[\w-]+:[\w-]+$/,
]

function violation(value) {
  const raw = typeof value === 'string' ? value : value.text
  // HTML and JSX character references end in a semicolon that is markup, not copy.
  const text = raw.replace(/&(?:[a-zA-Z]+|#\d+);/g, ' ').trim()
  if (!text) return null
  if (EXCUSED.some((pattern) => pattern.test(text))) return null
  const hit = BANNED.find(({ pattern }) => pattern.test(text))
  return hit ? `${hit.label}: ${JSON.stringify(text.slice(0, 90))}` : null
}

function literalsIn(sourceText, fileName) {
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX
  )
  const found = []
  const check = (value) => {
    if (typeof value === 'string') {
      if (value.trim()) found.push({ text: value })
    } else {
      found.push(value)
    }
  }
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) check(node)
    else if (ts.isTemplateExpression(node)) {
      check(node.head.text)
      for (const span of node.templateSpans) check(span.literal)
    } else if (ts.isJsxText(node)) check(node)
    ts.forEachChild(node, visit)
  }
  visit(source)
  return found
}

const SHIPPED = [
  'lib/data.ts',
  'lib/content/en.ts',
  'lib/content/fr.ts',
  'lib/content/mission.ts',
  'lib/projects.ts',
]

const COMPONENTS = readdirSync(new URL('../components', import.meta.url))
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => `components/${name}`)

const TEXT_FILES = [
  'public/robots.txt',
  'public/humans.txt',
  'public/llms.txt',
  'public/manifest.json',
]

test('catalogue strings carry no dashes used as punctuation', async () => {
  const problems = []
  let inspected = 0
  for (const file of SHIPPED) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    for (const node of literalsIn(source, file)) {
      inspected += 1
      const problem = violation(node)
      if (problem) problems.push(`${file}: ${problem}`)
    }
  }
  assert.ok(inspected > 400, `guard inspected only ${inspected} literals, expected the catalogues to be walked`)
  assert.deepEqual(problems, [])
})

test('component strings and accessible labels carry no dashes used as punctuation', async () => {
  const problems = []
  let inspected = 0
  for (const file of COMPONENTS) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    for (const node of literalsIn(source, file)) {
      inspected += 1
      const problem = violation(node)
      if (problem) problems.push(`${file}: ${problem}`)
    }
  }
  assert.ok(inspected > 100, `guard inspected only ${inspected} literals, expected components to be walked`)
  assert.deepEqual(problems, [])
})

test('plain text responses carry no dashes used as punctuation', async () => {
  const problems = []
  for (const file of TEXT_FILES) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    for (const [index, line] of source.split('\n').entries()) {
      const text = file.endsWith('.json')
        ? (line.match(/"(?:[^"\\]|\\.)*"/g) ?? []).join(' ')
        : line.replace(/^\s*[^:]+:/, '')
      const problem = violation(text)
      if (problem) problems.push(`${file}:${index + 1}: ${problem}`)
    }
  }
  assert.deepEqual(problems, [])
})
