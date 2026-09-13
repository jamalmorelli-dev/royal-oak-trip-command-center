#!/usr/bin/env node
/**
 * Publishes the PUBLIC PWA only (out/). Refuses if private_docs leaked.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const out = path.join(root, 'out');
if (!fs.existsSync(out)) {
  console.error('out/ missing. Run npm run build:pwa first.');
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else acc.push(path.relative(out, p));
  }
  return acc;
}

const leaked = walk(out).filter((rel) =>
  /private_docs|Passport\.jpeg|PA_Driver_License|PennDOT_Temporary/i.test(rel)
);
if (leaked.length) {
  console.error('Refusing gh-pages publish; private files in out/', leaked);
  process.exit(1);
}

const r = spawnSync(
  'bash',
  [
    '-lc',
    [
      'set -euo pipefail',
      'cd out',
      'git init -b gh-pages',
      'git add -A',
      "git commit -m 'Publish public Trip HQ PWA'",
      'git push -f https://github.com/jamalmorelli-dev/royal-oak-trip-command-center.git gh-pages',
    ].join(' && '),
  ],
  { cwd: root, stdio: 'inherit' }
);
process.exit(r.status ?? 1);
