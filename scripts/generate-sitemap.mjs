#!/usr/bin/env node
// Generate out/sitemap.xml from the static export so lastmod and the alternate
// language links can never drift from the pages that actually ship.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.argv[2] ?? 'out'
const SITE_URL = (process.env.SITE_URL ?? 'https://www.anthonypaquet.com').replace(/\/+$/, '')
const LOCALIZED_PREFIXES = ['fr', 'zh']

function htmlFiles(dir, base = '') {
  const found = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const rel = path.posix.join(base, entry.name)
    if (entry.isDirectory()) found.push(...htmlFiles(path.join(dir, entry.name), rel))
    else if (entry.name.endsWith('.html')) {
      const file = path.join(dir, entry.name)
      // Pages that opt out of indexing (the /brand style guide) stay out of the sitemap.
      if (/<meta name="robots" content="[^"]*noindex/i.test(readFileSync(file, 'utf8'))) continue
      found.push({ rel, mtime: statSync(file).mtime })
    }
  }
  return found
}

function toPath(rel) {
  const segments = rel.replace(/\.html$/, '').split('/')
  // Error pages are not indexable and dynamic placeholders never export statically.
  if (segments.includes('404') || segments.some((s) => /^\[.*\]$/.test(s))) return null
  // trailingSlash: true writes each page as <dir>/index.html, so the document
  // name is not part of the URL.
  if (segments.pop() !== 'index') return `/${segments.join('/')}.html`
  return `/${segments.join('/')}${segments.length ? '/' : ''}`
}

function splitLocale(urlPath) {
  const parts = urlPath.split('/').filter(Boolean)
  if (!LOCALIZED_PREFIXES.includes(parts[0])) return { locale: 'en', key: urlPath }
  const rest = parts.slice(1)
  return { locale: parts[0], key: rest.length ? `/${rest.join('/')}/` : '/' }
}

// Every exported page is listed, and pages sharing a canonical path are
// alternates of each other.
const pages = []
for (const { rel, mtime } of htmlFiles(ROOT)) {
  const urlPath = toPath(rel)
  if (!urlPath) continue
  const { locale, key } = splitLocale(urlPath)
  pages.push({ urlPath, locale, key, lastmod: mtime.toISOString().slice(0, 10) })
}

if (pages.length === 0) {
  console.error(`sitemap: no indexable pages found under ${ROOT}/`)
  process.exit(1)
}

const groups = new Map()
for (const page of pages) {
  const group = groups.get(page.key) ?? []
  group.push(page)
  groups.set(page.key, group)
}

const urlFor = (urlPath) => SITE_URL + urlPath
// Chinese is zh-CN, not a Canadian locale: the country suffix is a language
// tag here, not a market claim.
const HREFLANG = { en: 'en-CA', fr: 'fr-CA', zh: 'zh-CN' }
const hreflang = (locale) => HREFLANG[locale] ?? `${locale}-CA`

const blocks = []
for (const [key, group] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const alternates = group
    .slice()
    .sort((a, b) => a.locale.localeCompare(b.locale))
    .map((page) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang(page.locale)}" href="${urlFor(page.urlPath)}" />`)
  if (group.length > 1) {
    const fallback = group.find((page) => page.locale === 'en') ?? group[0]
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(fallback.urlPath)}" />`)
  }
  const lastmod = group.map((page) => page.lastmod).sort().at(-1)
  for (const page of group) {
    blocks.push([
      '  <url>',
      `    <loc>${urlFor(page.urlPath)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${page.urlPath === '/' ? '1.0' : '0.8'}</priority>`,
      ...alternates,
      '  </url>',
    ].join('\n'))
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...blocks,
  '</urlset>',
  '',
].join('\n')

writeFileSync(path.join(ROOT, 'sitemap.xml'), xml)
console.log(`sitemap: wrote ${path.join(ROOT, 'sitemap.xml')} with ${blocks.length} urls`)
for (const page of pages) console.log(`  ${page.urlPath} ${page.lastmod} (${page.locale})`)
