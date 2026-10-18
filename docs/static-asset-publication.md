# Static asset publication

## Finder metadata exclusion

The production check on 2026-10-18 found that `/.DS_Store` was publicly served.
The source file is ignored by Git, but Next.js 15.5.9 copies it from `public/`
into `out/`. Git ignore rules do not govern a Cloudflare Workers asset upload.

`npm run build` now prepares the generated export in its `postbuild` step:

- `scripts/prepare-static-assets.mjs` removes only files named `.DS_Store`
  from `out/`, including nested folders. Originals in `public/` are preserved.
- Directory symlinks are not traversed. A symlinked export root and an unexpected
  directory named `.DS_Store` fail the build instead of deleting their contents.
- `public/.assetsignore` is copied by Next into the export. Its
  `**/.DS_Store` rule also excludes Finder metadata from Wrangler's manifest
  if Finder creates a new file after the build. Wrangler excludes the root
  `.assetsignore` file itself. Other dotfiles, including `.well-known/`, remain
  eligible for publication.

This changes build preparation only. The Worker, canonical redirects, language
selection, asset directory, HTML handling and custom 404 policy stay as configured.

## Verification

The fixture test uses the locked Next version's real public-copy helper. It first
proves that the original copy includes root and nested Finder files, then checks
that export preparation excludes them, preserves the originals and keeps public
assets byte-identical. It also covers idempotence, symlinks and an unexpected
directory bearing the metadata filename.

Run `node --test tests/static-assets.test.mjs`, then the required `npm run check`.
After a clean build, inspect the real `out/` and Wrangler asset manifest before
deployment. After deployment, verify that `/.DS_Store` and a nested metadata URL
return 404, alongside successful page, asset and locale checks. Unit tests do not
establish a live HTTP result.

## Sources and decision

Reviewed on 2026-10-18 against locked Next.js 15.5.9 and cached Wrangler 4.148.0.
No dependency or runtime upgrade is part of this change. The pinned Node 22.16.0
baseline supports the standard filesystem APIs used here.

- [Cloudflare Workers asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/#ignoring-assets)
  documents `.assetsignore` in the asset-directory root using Git ignore syntax.
- [Next.js 15.5.9 export source](https://github.com/vercel/next.js/blob/v15.5.9/packages/next/src/export/index.ts)
  copies `public/` with a page-conflict filter.
- [Next.js 15.5.9 copy helper](https://github.com/vercel/next.js/blob/v15.5.9/packages/next/src/lib/recursive-copy.ts)
  copies dotfiles without a Finder-specific exclusion.
- [Node 22.16.0 filesystem API](https://nodejs.org/download/release/v22.16.0/docs/api/fs.html)
  documents `readdir` directory entries, `lstat` and non-recursive `unlink`.

AI judgment, release engineering: use the provider's supported exclusion rule
and a narrow export preparation step instead of changing request routing. This
keeps Finder metadata out of both generated output and upload selection while
preserving legitimate public files. The owner can reverse the change by reverting
the commit. The session model handled this source repair and the independent
review. Local Qwen3-Coder was considered but was not evaluated or used. No paid
model API was used for this work.
