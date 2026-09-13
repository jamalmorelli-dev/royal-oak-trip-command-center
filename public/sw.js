/** Royal Oak Trip HQ PWA — never cache private vault or concierge APIs. */
const CACHE_NAME = 'royal-oak-trip-pwa-v3';

function scopeUrl(rel) {
  return new URL(rel, self.registration.scope).toString();
}

function isPrivateApi(url) {
  return url.pathname.includes('/api/vault') || url.pathname.includes('/api/concierge');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const precache = [
        './',
        './manifest.json',
        './icon-192.png',
        './icon-512.png',
        './apple-touch-icon.png',
        './icon.svg',
        './travel-docs/PRINTING_RULES.txt',
      ].map(scopeUrl);
      await Promise.all(
        precache.map((u) => cache.add(u).catch(() => null))
      );
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (isPrivateApi(url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const isNav = req.mode === 'navigate';
      const isNextStatic = url.pathname.includes('/_next/static/');

      if (isNextStatic) {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      }

      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch (err) {
        const cached = await cache.match(req);
        if (cached) return cached;
        if (isNav) {
          const home = await cache.match(scopeUrl('./'));
          if (home) return home;
        }
        throw err;
      }
    })()
  );
});
