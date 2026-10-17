# Canonical product marks: source checkpoint, 2026-10-17

Status: isolated source cohort; not a production release or merge qualification.

## Scope and ownership

The original peer checkout is on `claude/canonical-product-marks-20261017` at
`a775472158e4ab0f19bfddc5c230a48d2d0abd23`. Its 26 dirty paths include eight
staged retired-asset deletions. No completion handoff was found. At 22:18:02 UTC,
only the 18 changed/new files and eight deletions were copied to the owned
`codex/portfolio-canonical-marks-20261017` worktree. The original branch, files
and index were preserved. The copy manifest and per-file hashes are retained in
the ignored `.retained/portfolio-marks-audit-20261017/` directory of the canonical checkout.

The published portfolio remains the separately verified `a775472` release.
This source checkpoint does not change that production result.

## Design and structure

Product data remains in `lib/projects.ts`; React, CSS and structured-data consumers
reference each product's actual asset. The AP monogram remains a personal mark.
The sync script is a filesystem/Git adapter around the pinned asset registry, with
fixture tests exercising its CLI. No runtime service, API, dependency or framework
version was added or changed. The existing static-export architecture is preserved.

AI judgment, software engineering: preserve the six pinned marks byte for byte,
rather than reinterpret their shapes or adopt an unapproved newer identity.
All six output files matched their pinned Git objects, lengths and SHA-256 values
during the read-only source audit. Current HEAD versions of those asset files
also match; this does not imply every source repository HEAD equals its pin.

## Pinned assets

| Output | Source repository | Commit | SHA-256 | Bytes |
| --- | --- | --- | --- | --- |
| `public/images/logos/nota-mark.png` | `stonyp90/nota` | `8278632bce33ae5e4132523f52c5beb816526b2a` | `a72cd40f699a051dd384ac97499fbe0d1a6ad9108316d06cede06d40ed82715c` | 187558 |
| `public/images/logos/tablix-mark.svg` | `stonyp90/tablix` | `86aecc58f8f7a751583a71385ec1b5cea20e679c` | `78599a13aec003fb747b426ac4fb3d6722f22d83a079b88ef7cddfb0e8a6a5f9` | 362 |
| `public/images/logos/tablix-mark.png` | `stonyp90/tablix` | `86aecc58f8f7a751583a71385ec1b5cea20e679c` | `ad0b4a87918932626dfe8fdd77d7514e6ab9f863796729458287ecbdb294736c` | 9991 |
| `public/images/logos/ursly-mark.svg` | `stonyp90/ursly` | `74694a1764d24aa54dfafd8c9ab5a8ec825f8021` | `75d0a0d68523dd74013b8b6e4a0088ad7064b4cbe29a58dda808afd25f1c390a` | 3186 |
| `public/images/logos/scaleforge-mark.svg` | `stonyp90/scaleforged-website` | `1db1bb132d809534e4683b4f47d346a69177571b` | `7cd3d0a9e72dc2f19ba61938bc710cf26952a91ab20824fd3a7f8cf2037cd0f2` | 400 |
| `public/images/logos/lunorive-mark.png` | `stonyp90/lunorive` | `533fabea0721fff4f8666555694cf749c99ac0da` | `8bcd7c3112b3bb1d1778a8e41c734e5fa88fa1bfd9ce7599e724decd56ca79f1` | 54152 |

No active application consumer still referenced any of the eight retired paths
at the audit snapshot. Historical documentation intentionally retains the old names.

## Demonstrated defects and repair

The default sync command rejected missing or drifted outputs before its write
path, so it could not restore them. A missing product repository skipped output
validation; the sixth asset, the Tablix PNG used by structured data, was not covered
by the five project-card assertions.

The isolated repair separates strict check mode from restoration. Default sync
restores only after the pinned source hash, length and identical-output metadata
are verified. Check mode never writes. Every output is validated even when its
source repository is absent; only the source comparison is skipped. A bad source
hash cannot overwrite an existing output.

## Actual focused validation

The unchanged fixture test file reproduced four intended failures (6/10 passed)
against the original script, then passed 10/10 after the script repair. It covers
missing/corrupt restoration, strict nonmutating checks, six outputs without source
repositories, and source-hash mismatch. The red result is retained as evidence.

| Check | Result | Elapsed seconds | Sampled owned RSS MiB |
| --- | --- | --- | --- |
| `product-logos-red` | fail | 1.61 | 143.33 |
| `product-logos-green` | pass | 1.905 | 143.86 |
| `sync-syntax` | pass | 0.339 | 14.91 |
| `brand-marks` | pass | 0.364 | 43.95 |
| `projects` | pass | 0.499 | 181.28 |
| `logo-pins` | pass | 0.33 | 45.31 |
| `lint-1` | pass | 1.972 | 219.98 |
| `lint-2` | pass | 0.869 | 208.97 |
| `lint-3` | pass | 0.864 | 214.75 |
| `lint-4` | pass | 0.804 | 215.31 |
| `lint-5` | pass | 0.909 | 219.53 |
| `lint-6` | pass | 0.855 | 222.19 |
| `lint-7` | pass | 1.002 | 222.89 |
| `lint-8` | pass | 0.828 | 218.45 |
| `lint-9` | pass | 0.807 | 218.39 |

All checks ran sequentially under 15 seconds and 512 MiB per command; owned
process cleanup passed. The red run is the expected regression demonstration.
Nine changed JavaScript/TypeScript files passed ESLint with zero warnings.

Full repository lint, typecheck, the complete unit suite, static build and browser
qualification have not been run on this cohort. They remain mandatory before merge.
The coordinator explicitly authorized a normal source-backup push and its existing
hosted CI jobs. Local heavy build/browser work remains deferred until its queue slot.
This checkpoint is not merge-ready until all required checks pass. No deployment
or provider generation was performed.

## Versions, documentation and model decision

Execution used Node.js 22.16.0. Installed project versions observed in the shared
checkout: Next.js 15.5.9, React 19.2.3, TypeScript 5.9.3, ESLint 9.39.2 and
Tailwind CSS 3.4.19. The dependency manifests are unchanged except for two script
entries; no lockfile change is needed. Official Node documentation was checked
on 2026-10-17 for the existing built-in runner and child-process APIs:

- https://nodejs.org/download/release/v22.16.0/docs/api/test.html
- https://nodejs.org/download/release/v22.16.0/docs/api/child_process.html

The session model performed the scoped audit and repair; GPT-6.1 Sol was the
runner-up. No model benchmark is claimed, no paid API was called, and no local
model download or training was performed.

The original author's asset/consumer changes are preserved as a snapshot. The
sync repair, regression tests and this evidence record were produced in the
isolated Codex worktree; they are not attributed to the peer.
