import { lstat, readdir, unlink } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const FINDER_METADATA = '.DS_Store'

// Next copies public/ into out/, including Finder metadata. Only the generated
// export is prepared here; the original files in public/ remain untouched.
export async function prepareStaticAssets(exportDirectory) {
  const root = resolve(exportDirectory)
  const state = await lstat(root)
  if (!state.isDirectory() || state.isSymbolicLink()) {
    throw new Error('Export root must be a real directory, not a symlink')
  }

  const removed = []
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name)
      if (entry.name === FINDER_METADATA) {
        if (entry.isDirectory()) throw new Error(`Refusing to remove a directory: ${file}`)
        // unlink removes a file or the link itself, never the link's target.
        await unlink(file)
        removed.push(relative(root, file))
      } else if (entry.isDirectory()) {
        await visit(file)
      }
      // Directory symlinks are deliberately not traversed.
    }
  }
  await visit(root)
  return removed
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2) throw new Error('This command only prepares the project out/ directory')
  const removed = await prepareStaticAssets(fileURLToPath(new URL('../out/', import.meta.url)))
  console.log(`static assets: excluded ${removed.length} Finder metadata file(s) from out/`)
}
