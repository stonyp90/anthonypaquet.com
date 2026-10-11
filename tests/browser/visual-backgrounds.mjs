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
    for (const project of ['tablix', 'scaleforged']) {
      await page.locator(`.project-card--${project}`).screenshot({ path: `tmp/browser/fr-${width}-${project}-transparent.png` })
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.close()
  }
  console.log('Transparent portrait and native brand assets: desktop/mobile checks passed')
} finally { await browser.close() }
