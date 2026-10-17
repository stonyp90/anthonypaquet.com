#!/usr/bin/env node
// Pin the shared Maison tokens. design-system/maison.css must stay
// byte-identical in anthonypaquet.com and scaleforged.io; the lock makes an
// edit in one repo fail its tests until it is made on purpose in both.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync('design-system/maison.css');
const version = css.toString().match(/Version (\d+\.\d+\.\d+)/)?.[1];
if (!version) throw new Error('design-system/maison.css is missing its "Version x.y.z" header');
const lock = `${version} sha256:${createHash('sha256').update(css).digest('hex')}\n`;

writeFileSync('design-system/maison.lock', lock);
console.log(`maison ${lock.trim()}`);
