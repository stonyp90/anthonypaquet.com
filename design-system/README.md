# Maison design system

One house, two voices: the shared design system of anthonypaquet.com
(`stonyp90/stonyp90`) and scaleforged.io (`stonyp90/scaleforged-website`).

| File | Role |
| --- | --- |
| `maison.css` | Tokens: primitives (`--maison-*`), semantic roles (`--color-*`, `--space-*`, ...), brand voices (`[data-brand]`) |
| `maison.ts` | Token catalogue rendered by the living style guide |
| `maison-guide.css` | Styles for the guide itself, built from tokens only |
| `maison.lock` | Version and hash of `maison.css` |

Every file in this folder, `components/maison-guide.tsx` and the
`maison.test.mjs` test are identical in both repositories.

Living style guide: `/brand/` (FR) and `/en/brand/` on scaleforged.io,
`/brand/` (EN) and `/fr/brand/` on anthonypaquet.com.

## Rules

- Components use semantic tokens, never `--maison-*` primitives or raw hex.
- Brass (`--color-accent`) is decorative on light surfaces. Text, links and
  icons use `--color-accent-text`.
- `<html>` carries `data-brand="anthony-paquet"` or `data-brand="scaleforged"`.
  The voices differ only in display face and display tracking.
- Motion reads `--duration-*` and `--motion-*`, which drop to zero under
  `prefers-reduced-motion`.

## Changing a token

1. Edit `maison.css` (and `maison.ts` if a colour changed) in one repo.
2. Bump the version in the header and run `npm run design:lock`.
3. Copy the folder to the other repo and open a PR in both.

The tests check WCAG AA contrast pairs, both voices, reduced motion, the
catalogue against the CSS, and the lock.
