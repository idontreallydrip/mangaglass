const CACHE = 'mangaglass-v1';
const STATIC = ['/mangaglass/', '/mangaglass/index.html', '/mangaglass/manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('mangadex.org') || url.includes('uploads.mangadex.org') || url.includes('corsproxy.io')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/mangaglass/index.html')))
  );
});
