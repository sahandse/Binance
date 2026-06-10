const CACHE_NAME = 'bazaar-zende-v1';
const APP_SHELL = [
  '/Binance/',
  '/Binance/index.html',
  '/Binance/manifest.json',
  '/Binance/icon-192.svg',
  '/Binance/icon-512.svg',
];

const API_ORIGINS = [
  'api.binance.com',
  'api.kraken.com',
  'api.frankfurter.app',
  'open.er-api.com',
  'api.alternative.me',
  'api.coingecko.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-only for API calls
  if (API_ORIGINS.some((origin) => url.hostname.includes(origin))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for app shell
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
});
