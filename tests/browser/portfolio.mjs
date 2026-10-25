import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import ts from 'typescript'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173'
const artifactDir = process.env.BROWSER_ARTIFACT_DIR || 'tmp/browser'
await mkdir(artifactDir, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' })
// Expected project destinations come from the catalog itself, so adding a
// verified link updates this contract instead of breaking a hard-coded count.
const catalogSource = await readFile(new URL('../../lib/projects.ts', import.meta.url), 'utf8')
const { getPersonalProjects, getStudio } = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(catalogSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString('base64')}`)
const projectHrefs = locale => getPersonalProjects(locale).map(({ url }) => url).filter(Boolean)
const studioRole = locale => ({ title: locale === 'en' ? 'Builder' : 'Bâtisseur', duration: locale === 'en' ? '2 years' : '2 ans', current: locale === 'en' ? 'Current' : 'Actuel' })
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
    const expectedRole = studioRole(locale)
    const staticStudioHead = staticPage.locator('#experience .reveal-head').first()
    const staticStudioPanel = staticPage.locator('#experience .reveal-panel').first()
    assert.equal(await staticStudioHead.getAttribute('id'), 'scaleforged', 'ScaleForge is the first Experience role')
    assert.equal(await staticStudioHead.locator('.reveal-title').textContent(), 'ScaleForge')
    assert.ok((await staticStudioHead.locator('.reveal-sub').textContent()).includes(expectedRole.title))
    assert.ok((await staticStudioHead.locator('.role-duration').textContent()).includes(expectedRole.duration))
    assert.equal(await staticStudioHead.locator('.reveal-flag').textContent(), expectedRole.current)
    assert.equal(await staticStudioHead.locator('.reveal-trigger').getAttribute('aria-expanded'), 'true', 'Current role opens by default')
    assert.equal(await staticStudioPanel.locator('.role-studio-logo').getAttribute('src'), '/images/logos/scaleforge-empreinte.svg')
    assert.equal(await staticPage.locator('#experience #personal-projects.role-projects').count(), 1, 'Projects live inside Experience')
    assert.equal(await staticPage.locator('section#personal-projects, .studio-feature, .venture-card').count(), 0, 'No standalone studio or product-card section remains')
    assert.equal(await staticPage.locator('.role-project-list > li.role-project').count(), 5, 'All five products are exported inside the current role')
    assert.deepEqual(await staticPage.locator('.role-project-name').allTextContents(), getPersonalProjects(locale).map(({ name }) => name))
    assert.equal(await staticPage.locator('#offerduel img').count(), 0, 'No unverified OfferDuel logo is invented')
    assert.equal(await staticPage.locator('#offerduel .role-project-link').getAttribute('href'), 'https://offerduel.io', 'OfferDuel uses its verified destination')
    assert.equal(await staticPage.locator('#offerduel #offer-jewel[aria-hidden="true"]').count(), 1, 'Previous fragment resolves inside OfferDuel')
    assert.equal(await staticPage.locator('#control-craft #lunorive[aria-hidden="true"]').count(), 1, 'Legacy fragment resolves inside Control Craft')
    assert.equal(await staticPage.locator('.role-project-list').getAttribute('aria-labelledby'), 'role-projects-heading')
    assert.equal(await staticPage.locator('.site-nav a[href="#personal-projects"]').count(), 0, 'Navigation has no dedicated projects section')
    assert.equal(await staticPage.locator('.hero-project-link').getAttribute('href'), '#scaleforged', 'Hero opens the current studio role')
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
      // Third-party hosts (the Credly badge images) can be down or blocked
      // without the site being at fault, so only same-origin failures count.
      page.on('console', message => {
        if (message.type() !== 'error') return
        const source = message.location().url
        if (source && new URL(source).origin !== new URL(baseURL).origin) return
        errors.push(message.text())
      })
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
      assert.equal(await page.locator('html').getAttribute('lang'), locale)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      assert.equal(overflow, false, `No page overflow at ${width}px`)
      assert.match(await page.locator('#top img').getAttribute('src'), /anthony-paquet-portrait\.webp/)
      assert.equal(await page.locator('#top img').evaluate(img => img.complete && img.naturalWidth > 0), true)
      const expectedRole = studioRole(locale)
      const studioHead = page.locator('#experience .reveal-head').first()
      const studioTrigger = studioHead.locator('.reveal-trigger')
      const studioPanel = page.locator('#experience .reveal-panel').first()
      assert.equal(await studioHead.getAttribute('id'), 'scaleforged')
      assert.equal(await studioHead.locator('.reveal-title').textContent(), 'ScaleForge')
      assert.ok((await studioHead.locator('.reveal-sub').textContent()).includes(expectedRole.title))
      assert.ok((await studioHead.locator('.role-duration').textContent()).includes(expectedRole.duration))
      assert.equal(await studioHead.locator('.reveal-flag').textContent(), expectedRole.current)
      assert.equal(await studioTrigger.getAttribute('aria-expanded'), 'true')
      assert.equal(await page.locator('section#personal-projects, .studio-feature, .venture-card').count(), 0)
      assert.equal(await page.locator('#how-i-work').count(), 1)
      assert.equal(await page.locator('#how-i-work a[href="#lunorive"]').count(), 0)
      assert.equal(await page.locator('.site-nav a[href="#personal-projects"]').count(), 0)
      assert.equal(await page.locator('.site-nav a[href="#experience"]').isVisible(), true, 'Experience remains accessible on phones')
      await page.locator('.hero-project-link').click()
      await studioHead.scrollIntoViewIfNeeded()
      assert.equal(await studioPanel.isVisible(), true, 'Hero opens the ScaleForge role')
      assert.equal(await studioPanel.locator('.role-title').textContent(), expectedRole.title)
      assert.equal(await studioPanel.locator('.role-company a').getAttribute('href'), getStudio(locale).url)
      assert.equal(await studioPanel.locator('#personal-projects').count(), 1)
      assert.deepEqual(
        await studioPanel.locator('.role-project-link[href^="https://"]').evaluateAll(links => links.map(link => link.getAttribute('href'))),
        projectHrefs(locale),
        'Compact project destinations match the verified catalog'
      )
      assert.equal(await page.locator('.role-project-list > .role-project').count(), 5)
      assert.equal(await studioPanel.locator('a[href*="/pitch/"]').count(), 0, 'Pending pitch remains gated')
      assert.equal(await page.locator('#offerduel .role-project-name').textContent(), 'OfferDuel')
      assert.equal(await page.locator('#offerduel .role-project-link').getAttribute('href'), 'https://offerduel.io')
      assert.equal(await page.locator('#offerduel img').count(), 0, 'No unverified OfferDuel logo is invented')
      for (const brand of [getStudio(locale), ...getPersonalProjects(locale)]) {
        const container = brand.id === 'scaleforged' ? studioPanel : page.locator(`#${brand.id}`)
        await container.scrollIntoViewIfNeeded()
        assert.equal(await container.isVisible(), true, `${brand.name} is visible in the current role`)
        if (brand.visual) {
          const image = brand.id === 'scaleforged' ? container.locator('.role-studio-logo') : container.locator('.role-project-logo')
          const geometry = await image.evaluate(async (img) => {
            try { await img.decode() } catch { /* measured below */ }
            const bounds = img.getBoundingClientRect()
            return {
              loaded: img.complete && img.naturalWidth > 0 && img.naturalHeight > 0,
              rendered: bounds.width / bounds.height,
              natural: img.naturalWidth / img.naturalHeight,
              objectFit: getComputedStyle(img).objectFit,
            }
          })
          assert.equal(geometry.loaded, true, `Brand image loaded: ${brand.visual.src}`)
          assert.ok(Math.abs(geometry.rendered - geometry.natural) / geometry.natural < 0.02 || geometry.objectFit === 'contain', `${brand.name} retains its canonical proportions`)
        }
        const action = container.locator('a').first()
        await action.focus()
        assert.equal(await action.evaluate(element => element === document.activeElement), true, `${brand.name} action is keyboard-focusable`)
      }
      await studioPanel.screenshot({ path: `${artifactDir}/${locale}-${width}-scaleforge-experience.png` })
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
      if (await roles.nth(1).getAttribute('aria-expanded') !== 'true') await roles.nth(1).click()
      assert.equal(await roles.nth(1).getAttribute('aria-expanded'), 'true')
      for (const fragment of ['control-craft', 'lunorive', 'offerduel', 'offer-jewel', 'personal-projects']) {
        await page.evaluate(fragment => { window.location.hash = fragment }, fragment)
        await page.waitForFunction(() => document.querySelector('#scaleforged .reveal-trigger')?.getAttribute('aria-expanded') === 'true')
        assert.equal(await page.locator(fragment.startsWith('offer') ? '#offerduel' : '#control-craft').isVisible(), true, `#${fragment} reopens the parent studio role`)
        await roles.nth(1).click()
      }
      assert.equal(errors.length, 0, errors.join('\n'))
      checks.push(`${locale}: ${width}px, reduced motion, current studio role, compact project links/images, keyboard, no console errors`)
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
  await page.locator('#experience').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#experience').parentElement).opacity === '1')
  assert.equal(await page.locator('.reveal-pending #experience').count(), 0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => document.querySelectorAll('.reveal-pending').length === 0)
  await page.waitForFunction(() => document.querySelector('#how-i-work ol') !== null)
  await context.close()
  checks.push('normal motion: scroll reveal and live reduced-motion change')
} catch (error) { failures.push(error.message) }
finally { await browser.close() }
console.log(JSON.stringify({ baseURL, checks, failures }, null, 2))
if (failures.length) process.exitCode = 1
