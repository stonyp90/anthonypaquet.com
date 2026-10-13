import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'

// How I Work tells the whole lifecycle as one loop, from the voice note to the
// sale and back. Each locale must tell the same loop, and the component must
// hold one icon per step, or a station renders without its chip.
async function parse(file) {
  const text = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
  return ts.createSourceFile(file, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX)
}

function find(node, match) {
  if (match(node)) return node
  return ts.forEachChild(node, (child) => find(child, match))
}

const named = (name) => (node) => ts.isPropertyAssignment(node) && node.name.getText() === name

async function workOf(locale) {
  const source = await parse(`lib/content/${locale}.ts`)
  const work = find(source, (node) => named('work')(node) && Boolean(find(node, named('phases'))))
  assert.ok(work, `${locale}: the work section exists`)
  return work.initializer
}

async function phasesOf(locale) {
  const phases = find(await workOf(locale), named('phases'))
  return new Function(`return ${phases.initializer.getText()}`)()
}

test('each locale tells the same lifecycle, longer than the four-step loop', async () => {
  const en = await phasesOf('en')
  const fr = await phasesOf('fr')
  assert.ok(en.length > 4, `the loop has only ${en.length} steps`)
  assert.equal(fr.length, en.length)
  for (const phases of [en, fr]) {
    assert.deepEqual(phases.map(({ tag }) => tag), phases.map((_, i) => String(i + 1).padStart(2, '0')))
    assert.equal(new Set(phases.map(({ title }) => title)).size, phases.length, 'step titles are unique')
    for (const { title, blurb } of phases) assert.ok(title && blurb, 'every step has a title and a blurb')
  }
})

test('the lists under the loop are folded into its steps', async () => {
  for (const locale of ['en', 'fr']) {
    assert.equal(find(await workOf(locale), named('foundations')), undefined, `${locale}: no separate lists remain`)
  }
})

test('the loop starts with a plan, iterates locally, and learns from customers', async () => {
  const expectedTitles = {
    en: ['Speak', 'Plan', 'Unblock', 'Design', 'Build', 'Iterate', 'Test', 'Review', 'Ship', 'Learn', 'Improve', 'Repeat'],
    fr: ['Dicter', 'Planifier', 'Débloquer', 'Concevoir', 'Implémenter', 'Itérer', 'Tester', 'Réviser', 'Déployer', 'Observer', 'Améliorer', 'Reboucler'],
  }

  for (const locale of ['en', 'fr']) {
    const phases = await phasesOf(locale)
    assert.deepEqual(phases.map(({ title }) => title), expectedTitles[locale])
    const lifecycle = phases.map(({ blurb }) => blurb).join(' ')
    for (const keyword of locale === 'en'
      ? ['plan', 'local', 'customer', 'beta', 'coexist']
      : ['plan', 'local', 'client', 'bêta', 'coexister']) {
      assert.match(lifecycle.toLocaleLowerCase(), new RegExp(keyword), `${locale}: lifecycle mentions ${keyword}`)
    }
  }
})

test('the animated loop exposes a live active-step console', async () => {
  const source = await readFile(new URL('../components/IterationLoop.tsx', import.meta.url), 'utf8')
  assert.match(source, /className="loop-console"/)
  assert.match(source, /aria-live="polite"/)
})

test('the agent loop stays focused on the loop itself', async () => {
  const source = await readFile(new URL('../components/DevelopmentCycle.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /LoopProof|loop-output|proof=/, 'the retired output block is not rendered here')
})

test('the component holds one icon per step', async () => {
  const source = await parse('components/DevelopmentCycle.tsx')
  const icons = find(source, (node) => ts.isVariableDeclaration(node) && node.name.getText() === 'PHASE_ICONS')
  assert.ok(icons, 'PHASE_ICONS is declared')
  assert.equal(icons.initializer.elements.length, (await phasesOf('en')).length)
})

const orbitSource = await readFile(new URL('../lib/loopOrbit.ts', import.meta.url), 'utf8')
const { buildLoop, stepAt, snapTarget, labelSide, GLIDE } = await import(
  `data:text/javascript;base64,${Buffer.from(
    ts.transpileModule(orbitSource, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  ).toString('base64')}`
)

test('the comet dwells on every step in order, then glides to the next', () => {
  const count = 12
  const { angles, times, ease } = buildLoop(60, count)
  assert.equal(angles.length, times.length)
  assert.equal(ease.length, angles.length - 1)
  assert.equal(times[0], 0)
  assert.equal(times.at(-1), 1)
  assert.equal(angles.at(-1) - angles[0], 360, 'one lap returns to where it started')
  for (let i = 1; i < times.length; i += 1) assert.ok(times[i] > times[i - 1], 'time only moves forward')
  for (let i = 0; i < count; i += 1) {
    // Segment 2i holds the step still, segment 2i + 1 moves on to the next.
    assert.equal(angles[2 * i + 1], angles[2 * i], `step ${i} is held`)
    assert.equal(angles[2 * i + 2] - angles[2 * i + 1], 30, `step ${i} glides one step on`)
    assert.ok(Math.abs(times[2 * i + 2] - times[2 * i + 1] - GLIDE / count) < 1e-9)
    assert.equal(stepAt(angles[2 * i + 1], count), (i + 2) % count)
  }
})

test('a focused step is reached by the shortest way round', () => {
  assert.equal(snapTarget(0, 11, 12), -30)
  assert.equal(snapTarget(0, 1, 12), 30)
  assert.equal(snapTarget(725, 0, 12), 720)
  assert.equal(stepAt(-30, 12), 11)
  assert.equal(stepAt(374, 12), 0)
})

test('titles point away from the centre', () => {
  assert.deepEqual([0, 30, 150, 180, 210, 330].map(labelSide), ['top', 'right', 'right', 'bottom', 'left', 'left'])
})
