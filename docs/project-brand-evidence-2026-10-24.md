# ScaleForge mark refresh: Québec F, 2026-10-24

Status: implemented and verified locally; not deployed.

## Finding

On 2026-10-17 the portfolio pinned `public/brand/strike-mark.svg` from
`stonyp90/scaleforged-website` at `1db1bb1`. The studio retired that identity on
2026-10-19 when it published the Québec F, revision 3. The live
`https://scaleforged.io/` serves `/brand/quebec-wordmark.svg` in its header, and
`public/brand/quebec-mark.svg` is the canonical square symbol in
`docs/brand/quebec-identity.md`. The portfolio card was showing a retired mark.

The same review found copy drift. `public/llms.txt` described ScaleForge as an
enterprise cloud architecture practice, while the live site, the portfolio card
and the Organization schema describe a venture studio in Québec.

## Decision

AI engineering and brand judgment, reversible by the owner:

- Replace the card mark with a byte-identical copy of
  `public/brand/quebec-mark.svg` at
  `44c6b49c9a71ba85635465f989e2cf02871fbab5`. SHA-256
  `dca1a606d6b87578f42160228879bb3a52b7343f942bd01e79f168f0047ea8b6`, 4690
  bytes, 512 × 512. No redraw, crop or recolour.
- Pin the provenance manifest to that commit and set the card dimensions to
  512 × 512.
- All five marks are square, so both CSS caps become 4.5rem. The 6.33rem
  portrait cap existed only for the retired 106 × 210 strike-F.
- Align the ScaleForge card descriptions and the ScaleForge sections of
  `public/llms.txt` with the live positioning: a venture studio in Québec that
  designs and builds useful software with the people who use it.
- Leave the AP monogram, the Maison system and the other four marks unchanged.

Sources checked 2026-10-24:

- https://scaleforged.io/ and https://scaleforged.io/en/ (live title, description
  and header wordmark)
- `~/Github/scaleforged-website/docs/brand/quebec-identity.md`
- `~/Github/scaleforged-website/public/brand/provenance.json`

## Verification

| Check | Result |
| --- | --- |
| `npm run logos:check` before the copy | fail: the shipped mark no longer matches its recorded hash |
| `npm run logos:check` after the copy | pass: 6 pinned marks, 0 red, 0 skipped |
| `npm test` | pass: 94 tests |
| `npm run check` | pass: lint, typecheck, tests and static build, 10 pages exported |
| Exported `out/images/logos/scaleforge-mark.svg` | SHA-256 matches the pin |
| Rendered at 1440 × 1000 | mark 72 × 72, area 5184, centre offset 0,0, no spill |
| Rendered at 390 × 844 | mark 72 × 72, area 5184, centre offset 0,0, no spill |
| Five-mark area spread at both widths | 0% |

The Québec file keeps its own transparent margins. Its silhouette occupies
318 × 420 of the 512 square, which is 22.8% ink coverage. The card renders the
whole file, as the byte-exact brand rule requires, so the visible silhouette is
about 45 × 59 px inside the 72 × 72 element. Enlarging it would break the equal
area rule shared by all five cards.
