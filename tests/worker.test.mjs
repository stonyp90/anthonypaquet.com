import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

// Load the production Worker unchanged in Node without changing the module type
// of the project's CommonJS Next/PostCSS/Tailwind configuration files.
const source = await readFile(new URL('../worker/index.js', import.meta.url), 'utf8')
const { default: worker } = await import(`data:text/javascript,${encodeURIComponent(source)}`)

test('an alternate custom domain redirects to canonical HTTPS with its path and query', async () => {
  const request = new Request('http://anthonypaquet.com/fr/?source=portfolio')
  const response = await worker.fetch(request, {
    CANONICAL_HOST: 'www.anthonypaquet.com',
    ASSETS: { fetch: () => assert.fail('redirects must not fetch an asset') },
  })

  assert.equal(response.status, 301)
  assert.equal(response.headers.get('Location'), 'https://www.anthonypaquet.com/fr/?source=portfolio')
})

for (const [name, url, canonical] of [
  ['canonical domain', 'https://www.anthonypaquet.com/fr/', 'www.anthonypaquet.com'],
  ['Workers preview', 'https://portfolio-preview.workers.dev/fr/', 'www.anthonypaquet.com'],
  ['local environment without canonical configuration', 'http://localhost:3000/fr/', undefined],
]) {
  test(`${name} forwards the original request and the asset response`, async () => {
    const request = new Request(url)
    const assetResponse = new Response('<html lang="fr"></html>', { status: 200 })
    let receivedRequest
    const response = await worker.fetch(request, {
      CANONICAL_HOST: canonical,
      ASSETS: {
        fetch: (value) => {
          receivedRequest = value
          return assetResponse
        },
      },
    })

    assert.equal(receivedRequest, request)
    assert.equal(response, assetResponse)
  })
}

/* ---- Language: French browsers land on /fr/, explicit choices win ---------- */

const htmlAsset = (lang) => ({
  fetch: () => new Response(`<html lang="${lang}"></html>`, { status: 200, headers: { 'Content-Type': 'text/html' } }),
})
const visit = (url, headers = {}) =>
  worker.fetch(new Request(url, { headers }), { CANONICAL_HOST: 'www.anthonypaquet.com', ASSETS: htmlAsset('en') })

for (const header of ['fr-CA,fr;q=0.9,en-US;q=0.8,en;q=0.7', 'fr', 'es-ES,fr;q=0.8,en;q=0.5']) {
  test(`a French-first browser (${header}) opening the English home page goes to /fr/`, async () => {
    const response = await visit('https://www.anthonypaquet.com/', { 'Accept-Language': header })
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), 'https://www.anthonypaquet.com/fr/')
    assert.match(response.headers.get('Vary'), /Accept-Language/)
    assert.match(response.headers.get('Cache-Control'), /no-store/)
  })
}

for (const header of ['en-US,en;q=0.9,fr;q=0.8', 'de-DE,de;q=0.9', '', undefined]) {
  test(`a browser that does not prefer French (${header ?? 'no header'}) gets English`, async () => {
    const response = await visit('https://www.anthonypaquet.com/', header === undefined ? {} : { 'Accept-Language': header })
    assert.equal(response.status, 200)
    assert.equal(await response.text(), '<html lang="en"></html>')
    assert.match(response.headers.get('Vary'), /Accept-Language/)
  })
}

test('the language picked with the switch beats a French browser', async () => {
  const response = await visit('https://www.anthonypaquet.com/', {
    'Accept-Language': 'fr-CA,fr;q=0.9',
    Cookie: 'theme=dark; lang=en',
  })
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '<html lang="en"></html>')
})

test('a French choice sends an English browser from the home page to /fr/', async () => {
  const response = await visit('https://www.anthonypaquet.com/', { 'Accept-Language': 'en-US', Cookie: 'lang=fr' })
  assert.equal(response.status, 302)
  assert.equal(response.headers.get('Location'), 'https://www.anthonypaquet.com/fr/')
})

test('the French page is never redirected, whatever the browser says', async () => {
  const response = await visit('https://www.anthonypaquet.com/fr/', { 'Accept-Language': 'en-US,en;q=0.9' })
  assert.equal(response.status, 200)
})

for (const [from, lang, location] of [
  ['https://www.anthonypaquet.com/fr/?lang=en', 'en', 'https://www.anthonypaquet.com/'],
  ['https://www.anthonypaquet.com/?lang=fr&ref=card', 'fr', 'https://www.anthonypaquet.com/fr/?ref=card'],
]) {
  test(`?lang=${lang} remembers the choice and lands on a clean URL`, async () => {
    const response = await visit(from, { 'Accept-Language': lang === 'en' ? 'fr-CA' : 'en-US' })
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('Location'), location)
    const cookie = response.headers.get('Set-Cookie')
    assert.match(cookie, new RegExp(`^lang=${lang};`))
    assert.match(cookie, /Path=\//)
    assert.match(cookie, /SameSite=Lax/)
    assert.match(cookie, /Secure/)
  })
}

test('assets and the CV are served untouched for a French browser', async () => {
  const pdf = new Response('%PDF-', { status: 200 })
  const request = new Request('https://www.anthonypaquet.com/AnthonyPaquet.pdf', { headers: { 'Accept-Language': 'fr-CA' } })
  const response = await worker.fetch(request, { CANONICAL_HOST: 'www.anthonypaquet.com', ASSETS: { fetch: () => pdf } })
  assert.equal(response, pdf)
})
