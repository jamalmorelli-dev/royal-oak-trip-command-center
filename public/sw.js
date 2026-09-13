/** Royal Oak Trip Command Center — offline-safe service worker. */
const CACHE_NAME='royal-oak-trip-v2';
const SAFE=['./','./manifest.json','./icon.svg','./travel-docs/PRINTING_RULES.txt'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SAFE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;if(url.pathname.startsWith('/api/vault'))return;event.respondWith(caches.match(req).then(cached=>{const network=fetch(req).then(res=>{if(res&&res.status===200){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{})}return res}).catch(()=>cached);return cached||network}))});
