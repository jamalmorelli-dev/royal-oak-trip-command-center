import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');

describe('PWA publish contract', () => {
  it('has a valid web app manifest', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'public/manifest.json'), 'utf8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./');
    expect(manifest.icons.some((i) => i.sizes === '192x192')).toBe(true);
    expect(manifest.icons.some((i) => i.sizes === '512x512')).toBe(true);
    expect(manifest.name).toMatch(/Royal Oak Trip/i);
  });

  it('service worker skips private vault APIs', () => {
    const sw = readFileSync(join(root, 'public/sw.js'), 'utf8');
    expect(sw).toContain('/api/vault');
    expect(sw).toContain('skipWaiting');
  });

  it('PWA export script exists and never copies private_docs', () => {
    const script = readFileSync(join(root, 'scripts/build-pwa.js'), 'utf8');
    expect(script).toContain('GROK_PWA_EXPORT');
    expect(script).toContain('private_docs');
    expect(script).toMatch(/Refusing to publish/);
  });

  it('does not track private identity files', () => {
    expect(existsSync(join(root, 'public/Benjamin_Prentiss_Passport.jpeg'))).toBe(false);
    expect(existsSync(join(root, 'public/PA_Driver_License_Front.jpeg'))).toBe(false);
  });
});
