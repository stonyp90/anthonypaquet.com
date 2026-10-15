import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts', '.wrangler/**', '.claude/worktrees/**', 'tmp/**', 'output/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['worker/**/*.js'],
    // Cloudflare documents an exported handler object for module Workers.
    rules: { 'import/no-anonymous-default-export': ['error', { allowObject: true }] },
  },
]

export default eslintConfig
