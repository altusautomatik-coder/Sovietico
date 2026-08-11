const CACHE = 'gestao-sov-v7';
const URLS = ['/', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    ))
  );
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const cacheRes = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cacheRes));
        return res;
      })
      .catch(() => caches.match(e.request).then(res => res || new Response('Offline', { status: 503 })))
  );
});
