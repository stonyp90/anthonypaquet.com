import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173'
await mkdir('tmp/browser', { recursive: true })
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' })
try {
  const headingHeights = []
  for (const [width, height] of [[1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
    await page.goto(`${baseURL}/fr/`, { waitUntil: 'networkidle' })
    const actionRects = await page.locator('.hero-actions a').evaluateAll(elements => elements.map(el => {
      const { top, bottom } = el.getBoundingClientRect()
      return { top, bottom }
    }))
    assert.ok(actionRects.every(rect => Math.abs(rect.top - actionRects[0].top) < 1), `Desktop actions share one row at ${width}px`)
    const projectRect = await page.locator('.hero-project-link').boundingBox()
    assert.ok(projectRect.y + projectRect.height <= height, `Desktop actions visible without scrolling at ${width}px`)
    if (width >= 1440) headingHeights.push((await page.locator('#hero-heading').boundingBox()).height)
    await page.close()
  }
  assert.ok(headingHeights[1] <= headingHeights[0] * 1.05, 'The hero heading keeps its line rhythm on wider desktops')
  const narrowDesktop = await browser.newPage({ viewport: { width: 907, height: 929 }, reducedMotion: 'reduce' })
  await narrowDesktop.goto(`${baseURL}/fr/`, { waitUntil: 'networkidle' })
  const narrowActionRows = await narrowDesktop.locator('.hero-actions a').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().top))
  assert.ok(narrowActionRows[0] < narrowActionRows[1] && Math.abs(narrowActionRows[1] - narrowActionRows[2]) < 1, 'The narrower desktop puts the primary action above a balanced LinkedIn/CV row')
  await narrowDesktop.screenshot({ path: 'tmp/browser/fr-907-desktop-hero.png' })
  await narrowDesktop.close()
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    await page.goto(`${baseURL}/fr/`, { waitUntil: 'networkidle' })
    const portrait = page.locator('.hero-photo')
    assert.notEqual(await portrait.evaluate(el => getComputedStyle(el).maskImage), 'none', 'Portrait has a transparent cutout mask')
    await portrait.evaluate(async el => {
      const mask = new Image()
      mask.src = getComputedStyle(el).maskImage.match(/url\("?(.*?)"?\)/)[1]
      await mask.decode()
    })
    assert.match(await portrait.getAttribute('src'), /anthony-paquet-portrait\.webp$/, 'The actual face uses the unchanged original photograph')
    assert.equal(await page.locator('.hero-portrait-frame').count(), 0, 'No arch or photo frame')
    assert.match(await page.locator('.project-card--tablix img').getAttribute('src'), /\.svg$/, 'Tablix uses a transparent native SVG')
    await page.screenshot({ path: `tmp/browser/fr-${width}-transparent-hero.png` })
    // One mark band, one grammar: every mark holds the same optical area and sits
    // centred in its band, whatever proportions its own brand file is drawn at.
    const areas = []
    for (const project of ['gonota', 'tablix', 'ursly', 'scaleforged', 'lunorive']) {
      // The index reveals one project at a time: open the entry before measuring it.
      const trigger = page.locator(`#${project} .reveal-trigger`)
      if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click()
      const box = await page.locator(`.project-card--${project} .project-logo`).evaluate((el) => {
        const r = el.getBoundingClientRect()
        const b = el.closest('.project-visual').getBoundingClientRect()
        return {
          area: r.width * r.height,
          dx: b.left + b.width / 2 - (r.left + r.width / 2),
          dy: b.top + b.height / 2 - (r.top + r.height / 2),
          spills: r.height > b.height,
        }
      })
      areas.push(box.area)
      assert.ok(Math.abs(box.dx) < 1 && Math.abs(box.dy) < 1, `${project} mark is centred in its band at ${width}px`)
      assert.equal(box.spills, false, `${project} mark stays inside its band at ${width}px`)
      await page.locator(`.project-card--${project}`).screenshot({ path: `tmp/browser/fr-${width}-${project}-transparent.png` })
    }
    const spread = (Math.max(...areas) - Math.min(...areas)) / Math.min(...areas)
    assert.ok(spread < 0.03, `The five marks keep equal optical area at ${width}px (spread ${(spread * 100).toFixed(1)}%)`)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.close()
  }
  console.log('Transparent portrait and native brand assets: desktop/mobile checks passed')
} finally { await browser.close() }
