// Maison design system: contrast and parity guarantees shared by
// anthonypaquet.com and scaleforged.io. Keep this file identical in both repos.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync('design-system/maison.css', 'utf8');
const primitive = (name) => {
  const value = css.match(new RegExp(`--maison-${name}:\\s*(#[0-9a-f]{6})\\b`, 'i'))?.[1];
  assert.ok(value, `--maison-${name} is defined as a 6-digit hex`);
  return value;
};
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(primitive(a)), luminance(primitive(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('text pairs meet WCAG AA on every shared surface', () => {
  const pairs = [
    ['ink', 'cream', 7], ['ink', 'paper', 7], ['ink', 'sand', 7],
    ['ink-soft', 'cream', 4.5], ['ink-soft', 'sand', 4.5], ['ink-soft', 'paper-soft', 4.5],
    ['stone', 'cream', 4.5], ['stone', 'sand', 4.5], ['stone', 'paper', 4.5],
    ['brass-deep', 'cream', 4.5], ['brass-deep', 'paper', 4.5], ['brass-deep', 'brass-wash', 4.5], ['brass-deep', 'sand', 4.5],
    ['moss', 'moss-wash', 4.5], ['rust', 'rust-wash', 4.5],
    ['cream', 'ink', 7], ['line-strong', 'ink', 4.5], ['brass-soft', 'ink', 4.5], ['brass', 'ink', 4.5],
  ];
  for (const [fg, bg, min] of pairs) {
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= min, `${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
  }
});

test('brass stays decorative on light surfaces', () => {
  assert.ok(contrast('brass', 'cream') < 4.5, 'if brass ever passes AA on cream, revisit --color-accent-text');
  assert.match(css, /--color-accent-text:\s*var\(--maison-brass-deep\)/);
});

test('both brand voices are defined and differ only in display type', () => {
  for (const brand of ['anthony-paquet', 'scaleforged']) {
    const block = css.match(new RegExp(`\\[data-brand="${brand}"\\]\\s*\\{([^}]*)\\}`))?.[1];
    assert.ok(block, `[data-brand="${brand}"] theme exists`);
    const props = [...block.matchAll(/(--[\w-]+):/g)].map((m) => m[1]).sort();
    assert.deepEqual(props, ['--brand-display-family', '--brand-display-tracking']);
  }
});

test('reduced motion zeroes every motion token', () => {
  const reduced = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  for (const token of ['--duration-fast', '--duration-base', '--motion-duration', '--motion-distance', '--motion-section-duration', '--motion-section-distance']) {
    assert.match(reduced, new RegExp(`${token}:\\s*0(ms|px)`), `${token} is zeroed under reduced motion`);
  }
});

test('shared file matches its lock, so both sites carry the same version', () => {
  const [version, hash] = readFileSync('design-system/maison.lock', 'utf8').trim().split(' ');
  assert.equal(css.match(/Version (\d+\.\d+\.\d+)/)?.[1], version, 'header version matches the lock');
  assert.equal(`sha256:${createHash('sha256').update(css).digest('hex')}`, hash, 'run npm run design:lock after a deliberate change made in both repos');
});

test('style guide catalogue mirrors the CSS primitives', () => {
  const catalogue = readFileSync('design-system/maison.ts', 'utf8');
  const listed = [...catalogue.matchAll(/token: '(--maison-[\w-]+)', role: '(--[\w-]+)', hex: '(#[0-9a-f]{6})'/g)];
  const defined = [...css.matchAll(/(--maison-[\w-]+):\s*(#[0-9a-f]{6})\b/g)].map(([, token, hex]) => [token, hex]);
  assert.deepEqual(listed.map(([, token, , hex]) => [token, hex]), defined, 'maison.ts lists every 6-digit primitive, in order, with the same hex');
  for (const [, token, role] of listed) {
    assert.match(css, new RegExp(`${role}:\\s*var\\(${token}\\)`), `${role} maps to ${token}`);
  }
});
