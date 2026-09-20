#!/usr/bin/env node
/**
 * Static PWA export for Grok Build / GitHub Pages.
 * Temporarily moves app/api out of the tree because Next.js cannot
 * `output: 'export'` while Route Handlers exist. Restores them after.
 * Never copies private_docs/ into out/.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const api = path.join(root, 'app', 'api');
const stash = path.join(root, '.api-stash');

function restore() {
  if (fs.existsSync(stash) && !fs.existsSync(api)) {
    fs.renameSync(stash, api);
  }
}

process.on('exit', restore);
process.on('SIGINT', () => {
  restore();
  process.exit(1);
});

if (fs.existsSync(api)) {
  fs.rmSync(stash, { recursive: true, force: true });
  fs.renameSync(api, stash);
}

const result = spawnSync('npx', ['next', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GROK_PWA_EXPORT: '1' },
});

restore();

const out = path.join(root, 'out');
if (result.status === 0 && fs.existsSync(out)) {
  fs.writeFileSync(path.join(out, '.nojekyll'), '');
  const forbidden = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const rel = path.relative(out, p);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/private_docs|Passport\.jpeg|PA_Driver_License|PennDOT_Temporary/i.test(rel)) {
        forbidden.push(rel);
      }
    }
  }
  walk(out);
  if (forbidden.length) {
    console.error('Refusing to publish: private travel files leaked into out/', forbidden);
    process.exit(1);
  }
  console.log('PWA static export ready in out/ (no private_docs).');
}

process.exit(result.status ?? 1);
