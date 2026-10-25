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
    assert.match(await page.locator('#tablix .venture-logo').getAttribute('src'), /\.svg$/, 'Tablix uses a transparent native SVG')
    await page.screenshot({ path: `tmp/browser/fr-${width}-transparent-hero.png` })
    // The studio has a prominent yellow identity panel above the products.
    // Each canonical mark keeps its own proportions and fits its own container;
    // the studio wordmark and product logos intentionally have different sizes.
    assert.equal(await page.locator('#scaleforged.studio-feature').count(), 1)
    assert.equal(await page.locator('.studio-products > .venture-card').count(), 5)
    assert.equal(await page.locator('#personal-projects .reveal-trigger').count(), 0, 'Products are visible without an accordion')
    assert.equal(
      await page.locator('.studio-identity').evaluate(element => getComputedStyle(element).backgroundColor),
      'rgb(255, 212, 56)',
      'The studio uses the approved vivid forge yellow'
    )
    const brands = [
      { id: 'scaleforged', image: '.studio-wordmark', container: '.studio-identity', src: '/images/logos/scaleforge-empreinte.svg' },
      { id: 'gonota', image: '.venture-logo', container: '.venture-card-top', src: '/images/logos/nota-mark.png' },
      { id: 'tablix', image: '.venture-logo', container: '.venture-card-top', src: '/images/logos/tablix-mark.svg' },
      { id: 'control-craft', image: '.venture-logo', container: '.venture-card-top', src: '/images/logos/control-craft.svg' },
      { id: 'ursly', image: '.venture-logo', container: '.venture-card-top', src: '/images/logos/ursly-mark.svg' },
    ]
    for (const brand of brands) {
      const panel = page.locator(`#${brand.id}`)
      const image = panel.locator(brand.image)
      await panel.scrollIntoViewIfNeeded()
      assert.equal(await panel.isVisible(), true, `${brand.id} stays discoverable at ${width}px`)
      assert.equal(await image.getAttribute('src'), brand.src, `${brand.id} uses the current canonical asset`)
      const geometry = await image.evaluate(async (element, containerSelector) => {
        try { await element.decode() } catch { /* readiness is measured below */ }
        const imageBox = element.getBoundingClientRect()
        const container = element.closest(containerSelector)
        const containerBox = container.getBoundingClientRect()
        const renderedRatio = imageBox.width / imageBox.height
        const naturalRatio = element.naturalWidth / element.naturalHeight
        return {
          loaded: element.complete && element.naturalWidth > 0 && element.naturalHeight > 0,
          visibleArea: imageBox.width * imageBox.height,
          proportionError: Math.abs(renderedRatio - naturalRatio) / naturalRatio,
          objectFit: getComputedStyle(element).objectFit,
          contained: imageBox.left >= containerBox.left - 1 && imageBox.right <= containerBox.right + 1 &&
            imageBox.top >= containerBox.top - 1 && imageBox.bottom <= containerBox.bottom + 1,
          overflow: container.scrollWidth > container.clientWidth + 1,
        }
      }, brand.container)
      assert.equal(geometry.loaded, true, `${brand.id} image loads at ${width}px`)
      assert.ok(geometry.visibleArea > 0, `${brand.id} mark has a visible size at ${width}px`)
      assert.ok(geometry.proportionError < 0.02 || geometry.objectFit === 'contain', `${brand.id} retains its natural proportions at ${width}px`)
      assert.equal(geometry.contained, true, `${brand.id} mark fits its own container at ${width}px`)
      assert.equal(geometry.overflow, false, `${brand.id} identity container does not overflow at ${width}px`)
      await panel.screenshot({ path: `tmp/browser/fr-${width}-${brand.id}-transparent.png` })
    }
    assert.equal(await page.locator('#offer-jewel').count(), 1, 'Offer Jewel is included')
    assert.equal(await page.locator('#offer-jewel img').count(), 0, 'No unverified Offer Jewel logo is invented')
    assert.equal(await page.locator('#offer-jewel a[href^="https://"]').count(), 0, 'No unverified Offer Jewel destination is invented')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.close()
  }
  console.log('Transparent portrait, yellow studio identity and canonical product proportions: desktop/mobile checks passed')
} finally { await browser.close() }
