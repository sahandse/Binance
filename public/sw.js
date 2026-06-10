const CACHE_NAME = 'bazaar-zende-v3';

const API_ORIGINS = [
  'api.binance.com',
  'api.kraken.com',
  'api.frankfurter.app',
  'open.er-api.com',
  'api.alternative.me',
  'api.coingecko.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'brsapi.ir',
  'corsproxy.io',
];

self.addEventListener('install', (event) => {
  // Skip waiting immediately so new SW takes over ASAP
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete all old caches so stale HTML/JS never gets served
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-only for API calls (never cache live data)
  if (API_ORIGINS.some((origin) => url.hostname.includes(origin))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For hashed JS/CSS assets: cache-first (they never change once deployed)
  if (url.pathname.match(/\/assets\/.+\.(js|css)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // For HTML (index.html) and everything else: network-first so updates are seen immediately
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
