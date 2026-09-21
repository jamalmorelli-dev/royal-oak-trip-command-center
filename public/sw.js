/**
 * Royal Oak Trip Command Center — Self-Purging Service Worker
 * Immediately clears old caches and claims clients to prevent stale chunk errors.
 */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Pass-through to network directly
self.addEventListener("fetch", (event) => {
  return;
});
