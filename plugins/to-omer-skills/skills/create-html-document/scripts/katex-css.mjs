#!/usr/bin/env node
// Run from the generation directory where the chosen KaTeX version is installed.
// Usage: node /path/to/create-html-document/scripts/katex-css.mjs > katex-inline.css
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const katexRoot = path.dirname(require.resolve('katex/package.json'));
const dist = path.join(katexRoot, 'dist');
const original = fs.readFileSync(path.join(dist, 'katex.min.css'), 'utf8');
let fontCount = 0;
const css = original.replace(/@font-face\{[^}]*\}/g, rule => {
  const match = rule.match(/url\((?:["'])?(fonts\/[^)"']+\.woff2)(?:["'])?\)/);
  if (!match) throw new Error('A KaTeX font face has no WOFF2 source.');
  const encoded = fs.readFileSync(path.join(dist, match[1])).toString('base64');
  const source = 'src:url("data:font/woff2;base64,' + encoded + '") format("woff2");';
  if (!/src:[^;}]*[;}]/.test(rule)) throw new Error('A KaTeX font face has no src declaration.');
  fontCount++;
  // The match is bounded by this one rule, so adjacent font faces stay separate.
  return rule.replace(/src:[^;}]*(?:;|(?=\}))/, source);
}).replace(/\.katex \.katex-mathml\{[^}]*\}/g, '');

if (!fontCount || fontCount !== (css.match(/@font-face\{/g) || []).length) {
  throw new Error('The number of KaTeX font faces changed during embedding.');
}
if (/url\(["']?fonts\//.test(css)) throw new Error('An external font path remains.');
if (!/\.katex\{[^}]*font:/.test(css)) throw new Error('The KaTeX root font declaration is missing.');
process.stdout.write(css + '\n');
