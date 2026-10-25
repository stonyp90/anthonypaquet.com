# Studio hierarchy and current product identities, 2026-10-25

## Request and scope

The owner supplied a screenshot of the personal website's projects section and
requested the approved yellow ScaleForge identity, the Control Craft name in
place of Lunar Rave / Lunorive, inclusion of Offer Jewel, and a clear explanation
that ScaleForge is the studio building the products.

The personal website section now distinguishes the parent studio from its
products. `getStudio(locale)` supplies the studio feature. `getPersonalProjects`
supplies GoNota, Tablix, Control Craft, Ursly and Offer Jewel. The studio and every
product are present in the exported HTML, in both English and French, without
requiring a visitor to open a project accordion.

## Brand decisions and source evidence

### ScaleForge studio feature

The owner explicitly selected the yellow Empreinte direction. The recovered
`ScaleForged-Complete-Prints-and-Resume/RESUME_PROMPT.md` identifies the approved
stacked SCALE / FORGED lettering, vivid yellow `#FFD438`, near-black `#151714`, and
signature « Forgé ici. Bâti pour durer. ». It rejects SF initials, the old
three-track symbol and metallic-gold drift. The capital final D remains in the
canonical artwork; no letter was edited to match the site's conversational
ScaleForge display name.

The source repository's `public/brand/provenance.json` records the Empreinte
artwork as approved on 2026-10-22 and its vector master as traced on 2026-10-24.
The existing transparent ink vector is used on the yellow studio surface, with
its exact original paths, fill and proportions.

- Repository: `stonyp90/scaleforged-website`.
- Commit: `3c702833f4de69a0dc967586c303a78c8e98813d`.
- Source: `public/brand/empreinte-wordmark.svg`.
- [Pinned source](https://github.com/stonyp90/scaleforged-website/blob/3c702833f4de69a0dc967586c303a78c8e98813d/public/brand/empreinte-wordmark.svg).
- Local copy: `public/images/logos/scaleforge-empreinte.svg`.
- ViewBox: `0 0 1000 386.68`.
- Bytes: 5940.
- SHA-256: `5aa278d16ce455192279bb947213b7cf2671a1b81e084544944567a92d5aa244`.
- Git blob SHA: `3df2fc4fb80e0d3e1f7b61e0d839fe0f42fcc38a`.

The previous blue Québec-F entry stays in the provenance manifest as
**superseded**, together with its historical file. It is no longer selected by
the current catalog. Files named `scaleforged-wordmark-approved.png` in an older
studio-portfolio bundle were visually inspected during recovery and contain a
retired gold-on-black identity; those files were not reused.

### Control Craft product card

The product name and verified destination are Control Craft and
`https://controlcraft.io`. The card uses the existing light-surface Cadrage
stacked wordmark from the product repository, without editing its lettering,
colours, geometry or transparency.

- Repository: `stonyp90/controlcraft-website`.
- Commit: `77f5952c50c71400ba9ec22dfe70998538cada6d`.
- Source: `public/brand-cadrage/cadrage-stacked-light.svg`.
- [Pinned source](https://github.com/stonyp90/controlcraft-website/blob/77f5952c50c71400ba9ec22dfe70998538cada6d/public/brand-cadrage/cadrage-stacked-light.svg).
- Local copy: `public/images/logos/control-craft.svg`.
- ViewBox: `0 0 3775 1640`.
- Bytes: 3426.
- SHA-256: `cdbdb6cbe81a719d82396c4a229eb4e75045287ecb511cb25b4dc032fb1533a6`.
- Git blob SHA: `32ba18db45eb714b0ed02982ea85537e6c20f74e`.

The old Lunorive mark remains historical in the manifest and is not rendered.
The `#lunorive` fragment is retained as an invisible compatibility anchor inside
Control Craft, so existing bookmarks still resolve to the renamed product.

### Offer Jewel

The owner explicitly requested Offer Jewel's inclusion. A confirmed public URL,
canonical logo and specific product capabilities were not established by the
available evidence. The catalog therefore presents the exact requested name,
a localized **In development** label, a restrained development description and
a contact action. It does not substitute OfferDuel / Le Salon, invent a domain,
or imply features or readiness that have not been verified.

### Existing marks and pitch gate

The previously pinned Nota, Tablix and Ursly marks remain unchanged. The studio
keeps its verified LinkedIn company link. The existing investor-pitch release
gate is preserved: pending pitch content does not gain a public link through
this section update.

## Regression coverage

`tests/projects.test.mjs` now checks:

- A separate parent studio and five distinct products in both locales.
- Verified product destinations and the absence of an invented Offer Jewel URL,
  artwork or feature claims.
- The Control Craft rename and retained legacy fragment.
- Ursly's bilingual three-part signature.
- Local brand files, canonical aspect ratios and localized copy.
- Active provenance records, pinned source commits, exact byte lengths,
  SHA-256 hashes and, for the new copies, Git blob identities.
- Superseded status of the prior Québec-F and Lunorive marks.
- Verified studio social links and the unchanged pitch release gate.

`tests/browser/portfolio.mjs` was updated to cover the studio/product hierarchy,
all products in static HTML, keyboard-focusable actions, exact destinations,
undistorted loaded marks, responsive overflow checks and the honest Offer Jewel
contact action. Existing experience and lifecycle interaction checks remain.

`tests/browser/visual-backgrounds.mjs` also preserves its hero portrait and
responsive hero checks while replacing the retired project accordion and
equal-square-area contract. It now checks the separate vivid-yellow studio
panel, current image sources, natural proportions or containment fitting,
loaded images, per-container bounds and overflow, and Offer Jewel’s absence
of unverified artwork or an external destination. The studio wordmark is
intentionally allowed to be larger than individual product marks.

## Verification performed for this change

| Check | Result |
| --- | --- |
| Exact new SVG bytes against the pinned Git blob SHAs | Pass |
| `node --test --test-isolation=none --test-reporter=spec tests/projects.test.mjs` | Pass, 9 tests |
| `node --check tests/browser/portfolio.mjs` | Exit 0 |
| `node --check tests/browser/visual-backgrounds.mjs` | Exit 0 |
| `node scripts/sync-product-logos.mjs --check` | Exit 0; all eight shipped output hashes match their manifest records |

The logo checker skipped upstream source comparisons because the manifest's
owner-machine repository paths are not mounted in this workspace. The two new
copies were independently checked against their pinned Git blob identities.
The browser scripts were updated and syntax-checked, but this note does not
claim that they were executed. Build, rendered browser review and publication are
recorded separately by the integrating task.
