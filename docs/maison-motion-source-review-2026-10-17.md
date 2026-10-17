# Shared Maison motion rule: source review

October17,2026. Isolated branch based on portfolio main `761c413169130bd6ade5b440dd2141b0a04715e0`. The canonical portfolio checkout remains unchanged.

The guide now explains in English and Québec French that a product’s brand motion uses that product’s own files, pinned to a commit and hash-checked. The README records the same rule. A single paragraph is added under the existing motion guidance. No token, component interface, dependency or module boundary changes; no new service, API or provider.

The two shared files are byte-identical to the current studio integration candidate:

- `design-system/README.md`: `6d152adbb57bea70acdcc8414226d18e0a287d2293f635750fbab3edaad2bb97`
- `components/maison-guide.tsx`: `bd8f8726cc0d47b4d6515a350f80ac6e106b1c9a67b71a7dba7d3bd7f4ed31dd`

Existing Maison CSS/TS/lock bytes remain identical across the two repositories. No new mirror test was added for this small copy update.

Source checks passed: scoped ESLint with zero warnings;13 existing Maison, terminology and copy tests; `git diff --check`. Installed versions: Next15.5.9, React19.2.3, ESLint9.39.2, Node22.16.0. React markup uses existing elements with no API change; [official v19.2.3 source](https://github.com/react/react/blob/v19.2.3/packages/react/src/ReactHooks.js) was checked. No dependency upgrades or model/provider calls. Session model handles integration; a local model remains a runner-up pending measured task quality. Cost added: zero.

AI implementation judgment: keep the rule in the shared guide, because faithful source reuse is the owner’s accepted brand direction; reversible by reverting this commit. This source commit does not establish full typecheck, build, browser layout, deployment or owner visual acceptance. Those gates require a separate coordinated resource slot before merge/release. No push, merge or deployment performed here.


Hosted qualification follow-up: the local source checkpoint `83e6128` used a CI-skip marker while builds were held. This evidence-only follow-up commit has no skip marker so the PR head can receive the required quality and browser checks. The two shared guide files retain the pinned hashes above; canonical portfolio main remains `761c413`. No merge or deployment is authorized by a pending hosted check. GitHub documents the [HEAD-message behavior](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs).
