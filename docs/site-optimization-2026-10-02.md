# Portfolio optimization — October 2, 2026

Checked in America/Toronto. Base commit: `d6c6ed85f705031728661458a082618ed82ee5b8`.
Changes are committed on `main` and deployed to production; see "Production deployment and verification".

## Delivered behavior and architecture

The entry section now carries the exact approved pitch JPG with a separate alpha mask: its photographic background and arch frame are removed, while the original RGB photograph stays unchanged. The responsive editorial composition prioritizes desktop readability. The downloaded CV contains the pitch portrait while retaining its original texts, geometry, links, tags, and two-page format; see `portrait-evidence-2026-10-02.md`.

`lib/projects.ts` is the framework-independent, typed bilingual catalog. `PersonalProjects` is its presentation adapter. GoNota, Tablix, Ursly, and ScaleForged appear in the independent personal-project section, after professional experience and credentials. Nota is the current role at the head of the professional experience catalog and GoNota stays in the personal projects beside it. The French overrides are merged by `Company::Position` key rather than by array index, so a reordered catalog cannot silently shift a card. The pre-existing PDF already separates its personal projects from the summary and employment history, so its wording was preserved. Brand sources, owner naming decisions, and hashes are in `project-brand-evidence-2026-10-02.md` and its asset manifest.

The server routes select one locale and pass serializable content to `LocaleProvider`. Both language catalogs are therefore absent from the client module graph. Separate Next route groups share `SiteDocument` while exporting correct `html lang` values for `/` and `/fr/` even without JavaScript. The existing public URLs, static export, metadata, canonical URLs and hreflang links remain in place. Crossing the language root layouts performs a full document navigation, as documented by Next 15. Redundant manual metadata tags and unused font-origin preconnects were removed; Next font assets remain self-hosted.

`MotionProvider` is an isolated browser adapter. All essential sections remain visible in exported HTML, and only off-screen sections acquire a reveal state after hydration. The provider shares `LazyMotion`/`m` features, avoiding the full `motion` feature bundle in rendered components. `useMotionPreference` subscribes to the browser media query with an accessible server snapshot. It fixes the installed Framer Motion 11 hook's static preference snapshot and prevents an SSR/client markup mismatch. The development orbit stops outside the viewport, when the page is hidden, and when reduced motion is requested. Decorative background animations and the full-screen startup loader were removed. Service transitions and experience expansion remain interactive; experience controls are native buttons with expanded state, associated details, and inert collapsed content.

Existing color values are centralized in CSS tokens and consumed by Tailwind. Card shadows and new brand surfaces also use tokens. No runtime service, database, external API or business HTTP API was introduced; an OpenAPI document would not describe this static portfolio. Docker Compose supplies the static server required to run its export independently. CI runs quality checks on pushes and pull requests; the existing deployment job now runs those checks before publishing and uses the same Node version file. See `tooling-evidence-2026-10-02.md`.

## Actual versions and official guidance

No existing runtime/library versions were upgraded. Lockfile versions inspected locally: Next 15.5.9, React/React DOM 19.2.3, Framer Motion 11.18.2, TypeScript 5.9.3, Tailwind 3.4.19, ESLint 9.39.2, Lucide React 0.468.0, React Icons 5.5.0, Node 22.16.0. Browser verification uses bundled Playwright 1.62.1 with installed Chrome. Existing icons were reused without selecting or changing icon-library behavior.

Sources checked October 2, 2026:

- [Next 15 static export](https://nextjs.org/docs/15/app/guides/static-exports): preserve `output: export`, directory routes, and prepared static image assets; no server-only feature added. The docs branch currently shows 15.5.27 but the relevant APIs are present in installed 15.5.9.
- [Next 15 server/client composition](https://nextjs.org/docs/15/app/getting-started/server-and-client-components): select locale on the server and pass serializable data to the client provider.
- [Next 15 route groups](https://nextjs.org/docs/15/app/api-reference/file-conventions/route-groups): independent root layouts retain the current URLs and accurate static language attributes; language switches fully reload the document.
- [React server components](https://react.dev/reference/rsc/server-components), [external store subscriptions](https://react.dev/reference/react/useSyncExternalStore): render the provider from the server and use a consistent SSR media-query snapshot. Docs currently identify React 19.3; these documented APIs exist in installed 19.2.3 and no underlying RSC bundler API is modified.
- [Motion feature bundle](https://motion.dev/docs/react-reduce-bundle-size), [MotionConfig](https://motion.dev/docs/react-motion-config), [reduced motion](https://motion.dev/docs/react-use-reduced-motion): retain the installed `framer-motion` package and use its existing `m`, `LazyMotion`, `domAnimation`, `MotionConfig`, `animate`, and `useInView` exports. Current docs use newer package naming; no migration to `motion/react` is made. Compatibility was checked against installed `dist/index.d.ts` and package source. The installed reduced-motion hook stores its initial value without updating React state; a local subscribed hook handles live preference changes.
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API): progressive, once-only scroll reveal with feature detection and observer cleanup.
- [Tailwind 3 colors](https://v3.tailwindcss.com/docs/customizing-colors): reference CSS design tokens from existing theme keys.
- [Playwright emulated media](https://playwright.dev/docs/api/class-page#page-emulate-media), [browser channels](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge): test preference changes and use installed Chrome because the bundled Playwright browser executable was absent.

Additional Node, TypeScript, ESLint, Docker, PDF and image-transform sources/version decisions are recorded in the other evidence files.

## Measurements and red/green evidence

| Local artifact | Before | After | Interpretation |
| --- | ---: | ---: | --- |
| Next-reported first-load JavaScript, both routes | 184 kB | 158 kB | 14.1% reduction in the build estimate despite the new section; not production network timing |
| Active pitch portrait and transparent mask | old website JPEG 125890 bytes | 109771 + 50082 bytes | Exact original JPG plus lossless alpha; the previous 50454-byte WebP is retained as an unused derivative. The cutout adds image bytes; identity preservation takes priority over recompressing the face. |
| Downloaded CV | 596632 bytes | 289886 bytes | 51.4% smaller, with document invariants preserved |
| Active four-project brand assets combined | — | 74133 bytes | Transparent native Tablix/ScaleForged SVGs replace opaque assets; lazy-loaded, not all requested on entry |

The original static export failed the browser assertion for readable About content without JavaScript (`opacity 0`, expected `1`), and contained Nota in professional experience. It also failed the static French document-language assertion (`en`, expected `fr`). The new catalog test failed before its implementation, then passed. Reduced-motion browser QA exposed React hydration error 418 before the consistent snapshot fix. Independent review found hidden service content, a full `motion` import under strict LazyMotion, and the stale installed media-query hook; all three findings were corrected and rechecked.

Completed checks on the integrated local source/export:

- Production static build: exit 0, `/` and `/fr/` each report 158 kB first-load JS.
- ESLint with zero warnings, TypeScript check, and `git diff --check`: exit 0.
- Node tests: 8 passed, 0 failed (project contracts and Worker routing).
- `tests/browser/portfolio.mjs`: exit 0 on both locales at 1440, 390, and 320 px. Correct static language; exported About/services/projects visible without JavaScript; correct portrait; all four brand images and links; no project in professional experience; keyboard expansion; no horizontal page overflow; no console/page errors.
- Normal motion: section reveal works; live change to reduced motion removes pending reveals and displays the full static phase list. Independent read-only review also observed the orbit icon stop and no console errors.
- Visual correction: `tests/browser/visual-backgrounds.mjs` first failed because the portrait had no mask, then passed after the cutout integration. The added desktop assertion first failed because the CV button wrapped at 1024 px, then passed after reducing the desktop button gap. Final checks cover 1024×768, 1280×800, 1440×900 and 1920×1080: actions fit on one row and remain above the fold, and the heading retains its line rhythm on wider screens. The title now caps at 48 px. At the user's narrower 907×929 preview, a further red/green check verifies the primary action occupies one row and LinkedIn/CV share the next row evenly. Independent EN/FR review found no horizontal overflow or console errors at the four larger desktop sizes. Portrait mask decoding, removal of the arch frame, and transparent logos were also verified at 1440 and 390 px. The user's existing browser tab was reloaded and inspected with the updated cutout and action layout.
- PDF: two pages visually inspected; text, links and content streams preserved; page 2 unchanged pixel-for-pixel. Full evidence and hashes recorded separately.
- Compose configuration: exit 0; static server image manifest available. Docker daemon did not respond, so container execution is unverified.

Browser screenshots are local QA files under ignored `tmp/browser/`. These checks do not prove production Core Web Vitals, real mobile-device behavior, third-party service availability, CI execution on GitHub, or a deployment. The build retains the pre-existing stale Browserslist database notice; no unrelated dependency update was made.

## Reproduce browser verification

Build and serve `out/` with any static server, then run:

```sh
PORTFOLIO_URL=http://127.0.0.1:4173 \
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
BROWSER_CHANNEL=chrome node tests/browser/portfolio.mjs
```

`tests/browser/accessibility.mjs` runs an axe-core WCAG 2.2 AA audit of both locales the same way; set `AXE_CORE_PATH` to its `axe.min.js`. Since 17 October 2026 CI runs all three browser scripts on every push and pull request.

The test dependency is deliberately external to the shipped site. `PLAYWRIGHT_MODULE` can be omitted where `playwright` is locally installed. `BROWSER_ARTIFACT_DIR` controls the screenshot destination. `npm run check` runs the ordinary source/build checks; `docker compose up --build` serves the export.

## Production deployment and verification (2026-10-06)

Target: Cloudflare Workers Static Assets, worker `anthonypaquet-com`, custom-domain routes `www.anthonypaquet.com` and `anthonypaquet.com`.

- `npx wrangler deploy` uploaded the export and reported version `bdd41c60-f89d-4949-b115-e6c1c57d0d3f`.
- The rollback command was captured from `npx wrangler deployments list` before deploying: `npx wrangler rollback 94f98025-e7e0-49ca-866d-85761c0c1396`.

Evidence was read from the live hostnames, not from the local export:

- Both `https://www.anthonypaquet.com/` and the `workers.dev` hostname reference `anthony-paquet-pitch.jpg`, `anthony-paquet-pitch.webp` and `anthony-paquet-cutout-mask.webp`, with no reference to the superseded `anthony-paquet.jpg`. The `workers.dev` check matters because the edge cache key excludes the query string, so a cache hit can mask a fresh deploy.
- `https://www.anthonypaquet.com/AnthonyPaquet.pdf` is byte-identical to `public/AnthonyPaquet.pdf`.
- `/fr/` returns 200, and `/sitemap.xml` returns 200 with one `<url>` per exported page per locale and no `/fr/index/` entry.
- The rendered text of both locales contains no dash and no semicolon.
- `tests/browser/portfolio.mjs` exits 0 against production.

Re-measure rather than trusting the tallies above, since a commit can change them:

```sh
npm test
npx wrangler deployments list
shasum -a 256 public/AnthonyPaquet.pdf
curl -s https://www.anthonypaquet.com/AnthonyPaquet.pdf | shasum -a 256
PORTFOLIO_URL=https://www.anthonypaquet.com \
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
BROWSER_ARTIFACT_DIR=tmp/browser/live node tests/browser/portfolio.mjs
```

The brand image assertion failed in production while passing locally, and the measurement was at fault rather than the assets. Each card image is `loading="lazy"`, so `complete && naturalWidth > 0` was read before the browser had started the fetch. The check now scrolls every card into view and awaits `img.decode()` before measuring, so an offscreen lazy image can no longer be judged broken while a genuinely missing file still fails. Positive control: the same evaluation returns `true` for a loadable lazy image and `false` for a missing one.

Cloudflare still has no `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` or `SITE_URL` repository variable or secret, so `.github/workflows/deploy.yml` reports `ready=false` and skips its deploy job; the deployment above was performed with local `wrangler` credentials. The obsolete `CLOUDFRONT_DIST_ID`, `S3_BUCKET` and `AWS_ROLE_ARN` entries remain from the previous host.

## CV rebuilt against the site catalogue and redeployed (2026-10-06, later the same day)

The CV is generated outside this repository, from `/Users/tony/Documents/Resume`, which is not under version control. `generate.mjs` writes `cv-<variant>.html` and `build.sh` prints the PDFs with headless Chrome. Only the English PDF ships here, as `public/AnthonyPaquet.pdf`, linked from `components/Hero.tsx`.

Content parity with `lib/data.ts`:

- Nota heads the employment history as the current role. Bespoke Labs is dated 2025 to 2026 and no longer carries a present badge.
- `assertMatchesSite()` in the generator compares every printed role with the site catalogue on the `Company::Position` key and fails the build on drift. `SITE_DATA_TS` overrides the catalogue path for a worktree.
- `check-pdf.mjs` now runs at the end of `build.sh`, so the pagination gate is a build hook rather than a reminder. It checks the page budget, the ink fill of each page, and that every role the HTML claims appears in the printed text. Both reds were demonstrated before the green was trusted: a deliberately overlong build failed on page count, and a stale PDF failed on the missing Nota role.
- All six variants print inside the two page budget: `en`, `fr`, `handshake`, `handshakeFr`, `nrcan`, `stackadapt`.

Pagination findings, because Chrome print layout is not obvious:

- The columns are `display: table` cells. A `display: flex` column fragments once and silently dumps the remainder of the long column onto a later page.
- Every inter-block bottom margin uses the `:not(:last-child)` idiom. A trailing margin inside a table cell is invisible but still counts toward the row height, and Chrome opens a completely empty page for it.
- `.ctx` is deliberately absent from the `break-after: avoid` group. That property is transitive across siblings, so including it chains the rest of the column into one unbreakable run.
- French runs on `body.lang-fr { line-height: 1.18 }`, the loosest leading that still fits, measured by bisect: 1.17 and 1.18 fit, 1.19 and looser overflow. Spacing overrides cannot substitute: those margins collapse, so three successive attempts changed the page height by exactly nothing.

Deployment: `npx wrangler deploy` reported version `85ed7b9b-5910-4b6c-9cf0-aa496ff8f4d0`. Rollback captured from `npx wrangler deployments list` beforehand: `npx wrangler rollback bdd41c60-f89d-4949-b115-e6c1c57d0d3f`.

Live evidence, read from both hostnames:

- `public/AnthonyPaquet.pdf`, `out/AnthonyPaquet.pdf`, `https://www.anthonypaquet.com/AnthonyPaquet.pdf` and the `workers.dev` hostname all return the same digest, `45472a49…111007` at the time of writing. Re-measure it below rather than trusting this line.
- `#experience` leads with Nota in both locales: `Founder & President` and `Fondateur et président`.
- The French page prints `2008 à 2011` in the education block. The string was fixed in `lib/content/fr.ts`, the source of both the page and the CV row, rather than patched in the CV alone.
- `tests/browser/portfolio.mjs` against production: 9 checks, 0 failures.
- The rasterized pages of the PDF downloaded from production show the pitch portrait, the full 12 role history, and no blank page.

```sh
shasum -a 256 public/AnthonyPaquet.pdf out/AnthonyPaquet.pdf
curl -s https://www.anthonypaquet.com/AnthonyPaquet.pdf | shasum -a 256
PORTFOLIO_URL=https://www.anthonypaquet.com \
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
BROWSER_ARTIFACT_DIR=tmp/browser/live node tests/browser/portfolio.mjs
cd /Users/tony/Documents/Resume && ./build.sh en fr   # ends with node check-pdf.mjs
```

Open item: the dates `Bespoke Labs 2025 to 2026` and `Nota 2026 to present` were inferred from the existing catalogue and the venture launch, not supplied by the owner. Correcting either one means editing `lib/data.ts` and rerunning the CV build, where `assertMatchesSite()` will catch a half done change.

## Ursly card parity shipped (2026-10-06, later the same day)

The personal-project grid shipped with one card themed as a dark panel. The change, its
reasoning and its guards are recorded in
[`project-brand-evidence-2026-10-02.md`](project-brand-evidence-2026-10-02.md).

Deployment: `npx wrangler deploy` reported version `52e7ad97-a80a-46f9-be30-ee302216e44f`.
Rollback captured beforehand: `npx wrangler rollback 85ed7b9b-5910-4b6c-9cf0-aa496ff8f4d0`.

Live evidence, read from `www.anthonypaquet.com`, `anthonypaquet.com` and the `workers.dev`
hostname, all returning 200 for `/`, `/fr/` and `/images/logos/ursly-mark.svg`:

- Each locale's HTML references `ursly-mark.svg` once, `ursly-connected` zero times,
  `project-artwork` zero times, and carries four `class="project-logo"` images.
- The served stylesheet `/_next/static/css/f56fc4d74368f179.css` contains no
  `--color-ursly` token, no `.project-artwork` rule, and one rule mentioning
  `.project-card--ursly`, whose full text is
  `.project-card--scaleforged .project-logo,.project-card--tablix .project-logo,.project-card--ursly .project-logo{height:4.5rem}`.
  A per-project selector now only sizes a mark.
- `tests/browser/portfolio.mjs` against production: 0 failures.
- `node scripts/grid-shot.mjs` against production wrote the same PNG byte counts it wrote
  against the local export, 67,331 English and 70,086 French, so the edge is serving the
  verified build rather than a stale cache.

```sh
npx wrangler deployments list
node --input-type=module -e '
for (const u of ["https://www.anthonypaquet.com/", "https://www.anthonypaquet.com/fr/"]) {
  const h = await (await fetch(u, { cache: "no-store" })).text()
  console.log(u, "mark", (h.match(/ursly-mark\.svg/g) || []).length,
    "artwork", (h.match(/project-artwork/g) || []).length,
    "logos", (h.match(/class="project-logo"/g) || []).length)
}'
node --input-type=module -e '
const css = await (await fetch("https://www.anthonypaquet.com/_next/static/css/f56fc4d74368f179.css")).text()
console.log(css.match(/\.project-card--[\w-]+[^{]*\{[^}]*\}/g))'
PORTFOLIO_URL=https://www.anthonypaquet.com \
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
BROWSER_ARTIFACT_DIR=tmp/browser/live node tests/browser/portfolio.mjs
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
PORTFOLIO_URL=https://www.anthonypaquet.com node scripts/grid-shot.mjs
```

The stylesheet filename is a build hash, so it changes on the next deploy. Read it from the
live `<link href>` rather than reusing the value above.

## Contact moved from Calendly to the inbox (2026-10-06, later the same day)

The Calendly subscription lapsed, so every booking link on the site pointed at a page that
can no longer convert a visitor. Two routes existed: adopt a replacement scheduler, or drop
booking and push email. No scheduler was adopted, because choosing one is a component
technology decision that needs at least three options and an explicit owner choice. Removal
was taken instead: `mailto:me@anthonypaquet.com` reception is already live, so this route
adds no dependency, no cost and no data-sharing surface. Recorded as an AI judgment; it is
reversible by the owner, who can name a scheduler and the guard will be widened to allow it.

`personalInfo.calendlyUrl` is deleted from `lib/data.ts`, leaving `socialLinks.email` as the
single contact source of truth. The primary CTA in `Hero`, `Services` and `Footer` now opens
the inbox with an envelope icon and no longer forces a new tab. Copy: `Email me`,
`Email me about your project`, and a hint that asks for the outcome and the constraints
instead of a calendar slot; French mirrors it with `Écrivez-moi`. `public/llms.txt` now states
`Booking: by email` so AI assistants are told the channel rather than being handed a link.
`components/ConsultingBrands.tsx` was deleted: it was unreferenced legacy presentation code
and carried the only two hardcoded booking URLs, so leaving it in place would have kept a
dead booking surface in the shipped corpus.

`tests/contact.test.mjs` turns this into a build failure rather than a review nit. Six tests
walk `app`, `components`, `lib` and the plain-text responses as syntax: no shipped source may
name a third-party scheduler; the catalogue must keep the inbox/`mailto` relationship and must
not carry a booking field; each of the three primary CTAs must be a `btn-primary` anchor whose
`href` is `c.socialLinks.email`, with no `target`; every shipped anchor href is checked; the
CTA copy must ask for an email and never a booking, per locale; and the shipped CV is scanned
for booking destinations. The CV is rebuilt outside this repository, so its link destinations
are read from the produced PDF's uncompressed `/URI` annotations, and that scan carries its own
positive controls (the profile and portfolio destinations must be visible) so a producer change
that compresses object streams fails loudly instead of passing an empty set.
`tests/browser/portfolio.mjs` additionally asserts the exported document offers the inbox and
that the hero CTA opens a mail client. Each guard carries a positive
control (the corpus must still contain the LinkedIn profile, the CTA keys must still be declared
the recorded number of times) so a shrinking corpus cannot pass by vacuity.

Open and left to the owner: the CV's own contact line links
`mailto:anthonypaquet1508@gmail.com` while the site now pushes `me@anthonypaquet.com`. Both
inboxes reach the same reader, so this was not changed unilaterally; one word from the owner
resolves it, and the CV source lives outside this repository.

Local evidence at commit `82ba3a5`: `npm run check` exit 0 (lint, typecheck, 25 unit tests
passing, static export, sitemap), and the exported `out/index.html`, `out/fr/index.html` and
`out/llms.txt` contain zero occurrences of the retired booking host.

Deployment: `npx wrangler deploy` reported version `114fb804-3391-405a-b6e3-e4e6b8ee8b20`.
Rollback captured beforehand: `npx wrangler rollback 52e7ad97-a80a-46f9-be30-ee302216e44f`.

Live evidence, read from `www.anthonypaquet.com`, `anthonypaquet.com` and the `workers.dev`
hostname: `/`, `/fr/` and `/llms.txt` return zero booking-host occurrences on all three, each
locale page carries six `mailto:` anchors (five to the inbox plus the share link; a seventh
`mailto:` string sits in the embedded React payload), and the served `llms.txt` line 111 reads
`Booking: by email, me@anthonypaquet.com`. The production run of
`tests/browser/portfolio.mjs` reported nine checks and no failures. `tmp/cta-shot.mjs` captured
the live hero, services and footer CTA clusters for both locales into `tmp/live/`, confirming
the envelope icon and the email wording render as designed.

```sh
git log --oneline -1
node --test tests/contact.test.mjs
node --input-type=module -e '
import { readFile } from "node:fs/promises"
const text = (await readFile("public/AnthonyPaquet.pdf")).toString("latin1")
console.log([...text.matchAll(/\/URI\s*\(([^)]*)\)/g)].map((m) => m[1]))'
for h in www.anthonypaquet.com anthonypaquet.com \
         anthonypaquet-com.anthony-paquet-portfolio.workers.dev; do
  for p in / /fr/ /llms.txt; do
    printf '%s%s ' "$h" "$p"
    curl -sSL -H 'Cache-Control: no-cache' "https://$h$p" \
      | grep -c -i -E 'calendly|savvycal|tidycal|setmore|books\.meeting'
  done
done
PORTFOLIO_URL=https://www.anthonypaquet.com \
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
BROWSER_ARTIFACT_DIR=tmp/live node tests/browser/portfolio.mjs
PORTFOLIO_URL=https://www.anthonypaquet.com node tmp/cta-shot.mjs
npx wrangler deployments list
```
