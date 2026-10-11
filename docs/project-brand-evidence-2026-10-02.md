# Personal project section — source and implementation evidence

Checked October 2, 2026, America/Toronto. This change adds an independent personal-project section; it does not add a job to experience or a project to the résumé. Browser acceptance belongs to the integrated website validation.

## Architecture

`lib/projects.ts` owns a typed EN/FR product catalog and section copy, with no I/O or framework runtime dependency. Its only import is the existing locale type. `components/PersonalProjects.tsx` is the presentation adapter: it reads the current locale, renders accessible project articles and uses ordinary external anchors. Local image files are a static asset adapter. No service, API, new port or new dependency is introduced. Site composition and CSS remain outside this component.

The section is labelled by `personal-projects-heading`, linked through `#personal-projects`, and uses stable product IDs. All external links use HTTPS and `rel="noopener noreferrer"`. Native lazy-loaded `next/image` elements have explicit intrinsic dimensions; the existing static-export configuration retains `images.unoptimized: true`, so compressed local assets are prepared before build.

## Current brand sources

| Project | Source checked | Decision |
| --- | --- | --- |
| GoNota | `/Users/tony/Github/nota/docs/brand-guidelines.md`, `/Users/tony/Github/nota/apps/web/public/nota-logo-light.svg`, existing portfolio domain `https://gonota.ca` | Display GoNota as requested and retain the existing Nota visual identity. Describe notarial software without an unverified launch or performance claim. |
| Tablix | `/Users/tony/Github/tablix/frontend/public/assets/brand/README.md`, `/Users/tony/Github/tablix/frontend/public/icon.svg`, `/Users/tony/Github/tablix/frontend/src/app/layout.tsx` | Use the official green identity and `https://tablix.ca`. The symbol is the three exact squares from the native icon SVG, with only its black favicon background removed. |
| Ursly | `/Users/tony/Github/entersense/docs/brand-recommendation.md:5`, `/Users/tony/Github/entersense/docs/design-system.md`, reference and master below | September 30 owner decision explicitly confirms Ursly and `https://ursly.io`. “Earsly” is treated as dictation of that established brand, pending any correction from the owner. Keep descriptions exploratory. |
| ScaleForged | `/Users/tony/Github/scaleforged-website/lib/structured-data.ts`, `/Users/tony/Github/scaleforged-website/components/layout/header.tsx`, `/Users/tony/Github/scaleforged-website/public/icon.svg` | Use ScaleForged and `https://scaleforged.io`. The current header uses the three-bar mark, matching `icon.svg`; the older violet `logo.png` is not the current header identity. |

Domain strings above were confirmed against local source, not tested as a deployment or service-health claim.

The Ursly selected image is `/Users/tony/Documents/Codex/2026-10-01/applications-mentioned-by-the-user-appshot-2/outputs/Ursly-brand/ursly-reference-retenue.png`, visually inspected at its native 1672 × 941 size. It carries the exact signature **Vos sens. Vos données. Votre choix.** The selected transparent derivative is `ursly-connected-master.png` in that same directory, with provenance in `ursly-connected-master.json` (checked October 2; native 1914 × 822). That derivative contains the humanoid and Ursly wordmark without background or embedded tagline. The card used it then so the signature remained live, readable HTML; the October 6, 2026 card parity revision below replaces it with the Open Profile mark and keeps the signature as HTML. English copy is the corresponding translation **Your senses. Your data. Your choice.**

`brand/BRAND.md` in the EnterSense repository is explicitly superseded. Its former claims about a shipped olfactory SDK, working personal AI and old product names are not copied.

## Assets and reproducibility

The exact source/output paths, SHA-256 values, bytes and transforms are recorded in [`project-brand-assets-2026-10-02.json`](project-brand-assets-2026-10-02.json). GoNota is a byte-identical SVG copy. Tablix and ScaleForged reuse their native source SVG symbols, removing only the background rectangle and tightening the viewport to the unchanged painted shapes. Raster conversion uses installed Sharp 0.34.5, proportional resize with `withoutEnlargement: true`, WebP quality 84 and effort 6. No raster is cropped, creatively retouched or upscaled.

| Asset | Output dimensions | Source bytes | Output bytes |
| --- | ---: | ---: | ---: |
| GoNota | SVG | 1,163 | 1,163 |
| Tablix | SVG, viewBox 91 91 330 330 | 386 | 329 |
| Ursly | 900 × 387, alpha retained | 1,112,573 | 72,252 |
| ScaleForged | SVG, viewBox 20 20 24 24 | 443 | 389 |
| Ursly Open Profile mark, October 6, 2026 | SVG, viewBox 0 0 240 240 | 686 | 682 |

The compressed Ursly output was visually inspected after conversion. Intrinsic dimensions in the data match the decoded output metadata.

### Transparent-symbol revision after integrated screenshots

The first integrated screenshot exposed the white raster background behind Tablix and the beige favicon background behind ScaleForged. The native Tablix source `/Users/tony/Github/tablix/frontend/public/icon.svg` has the exact official palette (`#2C5F34`, `#50B848`, `#8AE62C`) and three original rectangle geometries. Its 512 × 512 background rectangle is removed only from the copied local asset; `viewBox="91 91 330 330"` fits the original symbol's painted bounds. ScaleForged removes its copied 64 × 64 background rectangle and uses `viewBox="20 20 24 24"`, keeping every original bar coordinate, radius, color and group transform. Catalog dimensions now match those viewport proportions. No external repository is modified.

The earlier `tablix-personal.webp` (600 × 335, 3,832 bytes) remains as historical output and is not referenced by the catalog. It is labelled historical in the asset manifest. The approximate Tablix portfolio SVG from ScaleForged is not used because its opacity and palette differ from the exact native Tablix source. The white email logo is also unsuitable for the site's light cards.

Native SVG transparency was verified by rendering into RGBA in memory: Tablix contains 32,206 fully transparent pixels and 76,126 fully opaque painted pixels at 330 × 330; ScaleForged contains 228 fully transparent pixels and 312 fully opaque pixels at 24 × 24. All three remaining rectangle elements are byte-identical to the corresponding source elements. This checks vector transparency and shape preservation; it is not a new raster-editing operation.

## Card parity revision, October 6, 2026

Owner instruction: the Ursly card must not read as a dark panel and must follow the same pattern as the other three cards.

Two things made it different. `app/globals.css` carried a dedicated five-token Ursly palette (`--color-ursly-surface`, `-signal`, `-ink`, `-muted`, `-border`) and seven `.project-card--ursly` rules that repainted the card, its band, its text and its focus ring. And `lib/projects.ts` gave Ursly the only `kind: 'artwork'` visual, a 900 × 387 brand illustration rendered at `width: 100%` across the whole band while the other three cards show a compact symbol.

The card now uses the current authoritative Ursly symbol. `/Users/tony/Github/entersense/docs/design-system.md` (decision record updated October 6, 2026) names the bespoke Open Profile mark with the Glacier default as the identity, and `brand/interface-mark.svg` supplies its geometry. The copied asset keeps all three paths, the `viewBox` and the title byte-for-byte; only the fill fallback changes. The source declares `fill: var(--es-pore, currentColor)`, and the same design system states that a standalone image does not inherit the surrounding document's custom properties, so `currentColor` would resolve to black inside `<img>`. The fallback becomes `#007170`, the light Glacier signature from `brand/tokens.css` (`:root[data-theme="light"][data-palette="cyan"]`), which measures 5.29:1 against the card band `--color-paper-soft` `#faf3e6`. The `--es-pore` token contract stays intact for any future inline use.

Retired with it: the five Ursly palette tokens, the seven per-card rules, the `.project-artwork` rule, and the `visual.kind` branch in the catalog and the adapter. All four cards now render one `project-logo` at `sizes="300px"`, and the square marks share one sizing rule. `public/images/projects/ursly-connected.webp` is retained as historical output and is no longer referenced, the same treatment as `tablix-personal.webp`; the manifest labels both.

The three-part signature stays. It is guarded by `tests/projects.test.mjs` and it is the brand's own line, so the card keeps it, but `.project-slogan` now uses the description's rhythm (`margin: 1rem 0 1.5rem`) instead of its own `padding-bottom`, so the link sits at the same distance as on the other cards.

A new guard makes the pattern a rule rather than a preference: every catalogued visual must live under `/images/logos/`, and no `.project-card--*` rule may set `background`, `color` or `border-color`. Per-project rules may size a card, never re-theme it.

A second guard turns the manifest itself into a runtime gate. Every card visual must appear in `docs/project-brand-assets-2026-10-02.json` with an active `usage`, and the shipped file must match its recorded SHA-256, byte length and aspect ratio. Three reds were demonstrated against the working tree before it was restored: appending one byte to `ursly-mark.svg` fails the hash, pointing Ursly back at `ursly-connected.webp` fails both the mark rule and the historical-asset rule, and pointing ScaleForged at the undeclared `tablix-icon.svg` fails provenance. `public/images/logos/gonota.svg` gained the `width`, `height`, `alpha` and `usage` fields that manifest entries need for that comparison; its declared geometry is the SVG `viewBox` (`-16 -16 204.3977142857 96`) and the catalog rounds it to 204 × 96, so the guard compares ratios within one percent rather than exact integers.

### Upstream source drift found while re-measuring

Re-checking every manifest entry on October 6, 2026 left all six shipped assets byte-identical to their recorded `outputSha256`, so the site is unchanged. Two of the four external *source* paths have moved since the October 2 check, and the manifest's top-level `checkedAt: 2026-10-02` is what date-bounds those source hashes:

- `/Users/tony/Github/nota/apps/web/public/nota-logo-light.svg` is now 814,386 bytes, not the 1,163 recorded. The GoNota asset here is the frozen 1,163-byte copy, still matching its recorded hash.
- `/Users/tony/Github/tablix/frontend/public/icon.svg` no longer exists after a Tablix restructure. The nearest successor is `/Users/tony/Github/tablix/admin/public/icon.svg` at 702 bytes, which adds `#1A1A1A` fills and different geometry, so it is not a drop-in replacement for the 386-byte source this asset was cut from.

Neither drift changes this site, and no asset was regenerated from the newer upstream files. The command below re-measures both sides so a future reader can see the gap rather than trust this paragraph.

`scripts/serve-out.mjs` and `scripts/grid-shot.mjs` are tracked in this repository, so the following re-measurement runs from a fresh clone. Playwright itself stays outside the site and is supplied through `PLAYWRIGHT_MODULE`.

```sh
cd /Users/tony/Github/anthonypaquet.com
node --test tests/projects.test.mjs
npm run check
node scripts/serve-out.mjs out 4173 &
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
PORTFOLIO_URL=http://127.0.0.1:4173 BROWSER_ARTIFACT_DIR=tmp/browser node tests/browser/portfolio.mjs
PLAYWRIGHT_MODULE=/Users/tony/Github/nota/node_modules/playwright/index.mjs \
node scripts/grid-shot.mjs   # tmp/live/{en,fr}-projects-grid.png
```

## Lunorive, October 11, 2026

Owner instruction: show Lunorive, his newest product, as an output of the agent loop. Its card follows the shared pattern (a mark on the light card, a description, a signature line) with one difference: no outbound link, because no public URL for Lunorive is confirmed yet. `url` is optional in the catalog for that case, the adapter renders the link tile only when a URL exists, and `tests/projects.test.mjs` pins Lunorive's destination as absent so a guessed link cannot slip in. Add the official URL there once the domain exists.

No Lunorive logo file was available to copy, so `public/images/logos/lunorive-wordmark.svg` is authored for this site, and the manifest says so: the product name set in Playfair Display Bold (the site's own display face) and converted to outlines, with the terminal period in the site's accent, like the site's brand name. It is a typographic stand-in, not the product's own lettering, and it shows no product imagery. Outlines rather than `<text>` because an `<img>` cannot use the page's web fonts. One sizing rule, `.project-card--lunorive .project-logo`, sets its height, and nothing re-themes the card.

The signature line, "Keep the world close." / « Le monde, près de vous. », is the storefront's own tagline.

Every index entry now carries its project id as an anchor, and a link to that anchor opens the entry: How I Work links to `#lunorive`. Side by side, the whole index scrolls into view so the details beside it are visible. Stacked, the entry itself does. The browser suite opens each entry before checking its mark, since the index shows one project at a time, and checks that the How I Work link opens Lunorive.

## Official guidance checked

Actual installed versions: Next.js **15.5.9**, React **19.2.3**, TypeScript **5.9.3**, Node.js **22.16.0**, Sharp **0.34.5**. Existing package ranges remain unchanged by this feature.

| Official source | Checked | Decision |
| --- | --- | --- |
| [Next.js 15 Image component](https://nextjs.org/docs/15/app/api-reference/components/image) | 2026-10-02 | Set intrinsic dimensions to reserve the correct aspect ratio; leave rendered size to CSS. Below-fold imagery keeps default lazy loading. The 15.x docs cover the installed 15.5.9 interface; no upgrade is made. |
| [React rendering lists](https://react.dev/learn/rendering-lists) | 2026-10-02 | Stable project IDs and stable phrases supply keys. |
| [TypeScript Record utility](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type) | 2026-10-02 | `Record<Locale, ...>` requires both existing locales. No runtime locale inference is added. |
| [Node.js 22.16.0 test runner](https://nodejs.org/download/release/v22.16.0/docs/api/test.html) | 2026-10-02 | Use the existing runtime's `node:test` and strict assertions; no test dependency is introduced. |
| [Sharp resize](https://sharp.pixelplumbing.com/api-resize/), [WebP output](https://sharp.pixelplumbing.com/api-output/#webp) | 2026-10-02 | Resize proportionally without enlargement, retain alpha, and prepare a compressed static output. The installed 0.34.5 methods support the documented options. |

## Verification

`node --test tests/projects.test.mjs` first failed with exit 1 before `lib/projects.ts` existed. Re-run that command for the current tally rather than trusting a number frozen here; a test added by a later change would make any count in this document stale. The suite covers both locale catalogs, official destinations, distinct IDs, the exact Ursly signature, localized descriptions and categories, readable local assets with positive dimensions, and the card parity rule recorded below. TypeScript transpilation in the test executes the data module; integrated type checking, lint, build and browser checks are separate release evidence.

`npm run check` (lint, typecheck, unit tests, static export plus the sitemap postbuild) and `node tests/browser/portfolio.mjs` were both green for the October 2 feature, again for the October 6 card parity revision, and again for the October 11 Lunorive card. The browser suite's pass criterion is its own `"failures": []` report; it covers the five-project count in JavaScript-disabled HTML and the absence of horizontal overflow at 1440, 390 and 320 px in both locales.
