import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173'
const artifactDir = process.env.BROWSER_ARTIFACT_DIR || 'tmp/browser'
await mkdir(artifactDir, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' })
const failures = []
const checks = []

try {
  for (const route of ['/', '/fr/']) {
    const locale = route === '/' ? 'en' : 'fr'
    const staticContext = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' })
    const staticPage = await staticContext.newPage()
    await staticPage.goto(`${baseURL}${route}`)
    assert.equal(await staticPage.locator('html').getAttribute('lang'), locale, 'Correct static document language')
    assert.equal(await staticPage.locator('#about > div').evaluate(el => getComputedStyle(el).opacity), '1', 'About must remain readable without JavaScript')
    const hiddenServices = await staticPage.locator('#services [style]').evaluateAll(elements => elements.filter(el => getComputedStyle(el).opacity === '0').length)
    assert.equal(hiddenServices, 0, 'Services must remain readable without JavaScript')
    assert.equal(await staticPage.locator('.project-card').count(), 5, 'All five projects must be in exported HTML')
    assert.equal(await staticPage.locator('#personal-projects').count(), 1, 'One independent projects section')
    // Contact is by email. The exported document must carry the inbox and no
    // third-party booking page.
    const hrefs = await staticPage.locator('a[href]').evaluateAll(links => links.map(l => l.getAttribute('href')))
    assert.equal(hrefs.filter(h => /calendly|savvycal|tidycal|\bcal\.com\b/i.test(h ?? '')).length, 0, 'No exported booking scheduler link')
    assert.ok(hrefs.filter(h => (h ?? '').startsWith('mailto:')).length >= 3, 'The exported HTML must offer the inbox')
    assert.match(await staticPage.locator('.hero-actions .btn-primary').getAttribute('href'), /^mailto:/, 'Hero CTA opens the mail client')
    await staticContext.close()
    checks.push(`${locale}: readable exported HTML`)

    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
      assert.equal(await page.locator('html').getAttribute('lang'), locale)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      assert.equal(overflow, false, `No page overflow at ${width}px`)
      assert.match(await page.locator('#top img').getAttribute('src'), /anthony-paquet-portrait\.webp/)
      assert.equal(await page.locator('#top img').evaluate(img => img.complete && img.naturalWidth > 0), true)
      // Personal-project names belong to #personal-projects only. The company
      // "Nota" legitimately heads #experience, so match its project card name.
      assert.doesNotMatch(await page.locator('#experience').textContent(), /GoNota|Tablix|Ursly|ScaleForged|Lunorive/)
      // The lifecycle remains one standalone section, as requested after the
      // earlier Lunorive callout was removed.
      assert.equal(await page.locator('#how-i-work').count(), 1)
      assert.equal(await page.locator('#how-i-work a[href="#lunorive"]').count(), 0)
      await page.locator('.site-nav a[href="#personal-projects"]').click()
      await page.locator('#personal-projects').scrollIntoViewIfNeeded()
      assert.equal(await page.locator('#personal-projects').evaluate(el => getComputedStyle(el.parentElement).opacity), '1')
      // Every project with a public URL links out. Lunorive has none yet.
      assert.equal(await page.locator('.project-card a').count(), 4)
      // The index shows one project at a time, so open each entry, then wait
      // for its mark to finish loading before naturalWidth is meaningful.
      const projectTriggers = page.locator('#personal-projects .reveal-trigger')
      const panels = page.locator('#personal-projects .project-card')
      for (let index = 0; index < await projectTriggers.count(); index += 1) {
        const trigger = projectTriggers.nth(index)
        if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click()
        const image = panels.nth(index).locator('img')
        await image.scrollIntoViewIfNeeded()
        const loaded = await image.evaluate(async (img) => {
          try { await img.decode() } catch { /* measured below */ }
          return img.complete && img.naturalWidth > 0
        })
        assert.equal(loaded, true, `Brand image loaded: ${await image.getAttribute('src')}`)
        const id = (await panels.nth(index).getAttribute('class')).match(/project-card--([\w-]+)/)[1]
        await panels.nth(index).screenshot({ path: `${artifactDir}/${locale}-${width}-${id}.png` })
      }
      await page.screenshot({ path: `${artifactDir}/${locale}-${width}-projects.png` })
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
      await page.screenshot({ path: `${artifactDir}/${locale}-${width}-hero.png` })
      // Side by side, the arrow keys move through the index and reveal as they
      // go. Stacked, Enter opens and closes an entry in place.
      const roles = page.locator('#experience .reveal-trigger')
      await roles.first().focus()
      if (width >= 1024) {
        await roles.first().press('ArrowDown')
        assert.equal(await roles.nth(1).getAttribute('aria-expanded'), 'true', 'Experience follows the arrow keys')
      } else {
        const previous = await roles.first().getAttribute('aria-expanded')
        await roles.first().press('Enter')
        assert.notEqual(await roles.first().getAttribute('aria-expanded'), previous, 'Experience works with keyboard')
      }
      assert.equal(errors.length, 0, errors.join('\n'))
      checks.push(`${locale}: ${width}px, reduced motion, project links/images, keyboard, no console errors`)
      await context.close()
    }
  }
  const context = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await page.goto(`${baseURL}/fr/`, { waitUntil: 'networkidle' })
  await page.locator('#how-i-work').scrollIntoViewIfNeeded()
  const stations = page.locator('#how-i-work .loop-station')
  assert.equal(await stations.count(), 12, 'All twelve lifecycle steps are interactive')
  await stations.nth(7).click()
  assert.equal(await stations.nth(7).getAttribute('aria-pressed'), 'true', 'Click pins a lifecycle step')
  await stations.nth(7).click()
  await stations.nth(7).evaluate(element => element.blur())
  await page.mouse.move(0, 0)
  assert.equal(await stations.nth(7).getAttribute('aria-pressed'), 'false', 'Click releases the pinned step')
  const orbitCoordinates = () => page.locator('#how-i-work svg[viewBox] circle').evaluateAll(circles => circles.map(circle => [circle.getAttribute('cx'), circle.getAttribute('cy')]))
  const beforeOrbit = JSON.stringify(await orbitCoordinates())
  await page.waitForFunction(before => JSON.stringify([...document.querySelectorAll('#how-i-work svg[viewBox] circle')].map(circle => [circle.getAttribute('cx'), circle.getAttribute('cy')])) !== before, beforeOrbit)
  checks.push('normal motion: twelve stations, pin/release and moving orbit')
  await page.locator('#personal-projects').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#personal-projects').parentElement).opacity === '1')
  assert.equal(await page.locator('.reveal-pending #personal-projects').count(), 0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => document.querySelectorAll('.reveal-pending').length === 0)
  await page.waitForFunction(() => document.querySelector('#how-i-work ol') !== null)
  await context.close()
  checks.push('normal motion: scroll reveal and live reduced-motion change')
} catch (error) { failures.push(error.message) }
finally { await browser.close() }
console.log(JSON.stringify({ baseURL, checks, failures }, null, 2))
if (failures.length) process.exitCode = 1
