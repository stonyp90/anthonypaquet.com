# Agent authorship

Purpose: distinguish work implemented by this agent from work implemented by a previous
provider (Codex / Claude Code) in the same repository.

## Convention

- Branches created by this agent: `qoder/<topic>`.
- Every commit made by this agent carries the trailer `Agent: qoder (session <id>)`.
- Commits with no trailer were not authored by this agent.
- This file records the split. It is append-only for a session; rewrite it only when the
  whole listed work is reverted.

## Sessions

| Session | Provider | Date | Scope | Refs |
|---|---|---|---|---|
| `01a14109-eec4-7c02-9b63-9745745c9936` | Codex | 2026-10-15 | ScaleForge pitch authoring: deck/narration/splash/brand, player, films, website entry. Threads A-F. | `docs/scaleforge-pitch/.coord/*-report.*` |
| `12aad3f2-e061-487a-b504-1a8bfb5b22c2` | Qoder (peer) | 2026-10-16 | Owner-authorized branch inventory and merge of the Codex-authored pitch entry to main; player defect report `peer-web-fixes.json`. | `9e0a78c` |
| `f51d9464-7b3b-4af7-89ef-33965921f5c8` | Qoder | 2026-10-16 | Resume of the authoring after the Codex token limit: owner revision 2026-10-16b (25 chapters, five spoken studio brands, per-brand pronunciation, retired-brand leak guard), generator regeneration and guard completion. | `docs/scaleforge-pitch/.coord/H2.json`, `change-log.txt` |

## Boundary of the Qoder authoring session

Codex-authored content is unchanged unless listed here.

Qoder-authored changes on 2026-10-16:

- `docs/scaleforge-pitch/deck.json`, `deck.fr.json` - SST Diamantex and Diaspor chapters
  removed, studio portfolio rebalanced to five brands, five brands spoken (owner revision
  REQ-90..REQ-93).
- `docs/scaleforge-pitch/narration-en.json`, `narration-fr.json` - same revision.
- `docs/scaleforge-pitch/narrative.json`, `output/Presenter-Notes.txt`,
  `output/Presenter-Notes.fr.txt` - regenerated from the revised sources.
- `docs/scaleforge-pitch/tools/build-idempotence.test.mjs` - page-number assertion corrected
  to match the deck design (cover and close carry no page number); 25-chapter, retired-brand
  leak, studio five-brand and pronunciation assertions added under this session.
- `docs/scaleforge-pitch/.coord/` - orchestration and readiness records for this session.

## Git state at the time of writing

`main` is at `9e0a78c` ("feat: add gated ScaleForge pitch entry and verified company
LinkedIn link"), content authored under the Codex session and squash-merged plus pushed by
the peer session on owner instruction. The pitch authoring directory `docs/scaleforge-pitch/`
is gitignored, so the work listed above is not yet represented by any commit. When it is
committed it must use a `qoder/` branch and the trailer
`Agent: qoder (session f51d9464-7b3b-4af7-89ef-33965921f5c8)`.
