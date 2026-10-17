import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

// WCAG 2.2 AA audit of both locales with axe-core. Like Playwright, axe-core is
// a test tool kept outside the shipped site: AXE_CORE_PATH points at its
// axe.min.js, or it resolves from a local install.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const axePath = process.env.AXE_CORE_PATH || createRequire(import.meta.url).resolve('axe-core/axe.min.js')
const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173'
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' })
const failures = []
const checks = []

try {
  for (const route of ['/', '/fr/']) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
      await page.addScriptTag({ path: axePath })
      const violations = await page.evaluate(async () => {
        const { violations } = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
        })
        return violations.map(({ id, impact, help, nodes }) => ({
          id, impact, help, targets: nodes.map(({ target }) => target.join(' ')),
        }))
      })
      const label = `${route} at ${width}px`
      try {
        assert.deepEqual(violations, [], `${label}: ${JSON.stringify(violations, null, 2)}`)
        checks.push(`${label}: no WCAG 2.2 AA violations`)
      } catch (error) { failures.push(error.message) }
      await page.close()
    }
  }
} catch (error) { failures.push(error.stack) }
finally { await browser.close() }
console.log(JSON.stringify({ baseURL, checks, failures }, null, 2))
if (failures.length) process.exitCode = 1
