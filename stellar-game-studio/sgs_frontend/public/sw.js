// Guitar Pizza Service Worker (PWA Cache & Offline Resilience)
const CACHE_NAME = 'guitar-pizza-cache-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './mafia-theme.css',
  './game/guitar-pizza-engine.js',
  './game/assets/Benny.png',
  './game/assets/benny_transparent.png',
  './game/assets/don_transparent.png',
  './game/assets/pizzeria_bg.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core game assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Non-fatal pre-cache failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and WebSockets / API calls / RPC endpoints
  if (event.request.method !== 'GET' || url.protocol.startsWith('ws') || url.pathname.includes('/api/')) {
    return;
  }

  // Stale-while-revalidate for local assets (audio, images, css, js)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
