// Import Workbox from Google's CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Set a name for the cache
const CACHE_NAME = 'tidal-power-fitness-cache-v1';

// Let Workbox handle the precaching of assets
workbox.precaching.precacheAndRoute([]);

// Caching strategy for pages (Stale-While-Revalidate)
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Cache up to 50 pages
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Caching strategy for static assets (Cache First)
// CSS, JavaScript, and Web Fonts
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Caching strategy for images (Cache First)
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Caching strategy for API requests (Network First)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 24 Hours
      }),
      new workbox.backgroundSync.BackgroundSyncPlugin('workout-sync-queue', {
        maxRetentionTime: 24 * 60 // Retry for max 24 Hours
      }),
    ],
  })
);

// Basic offline fallback page
workbox.routing.setCatchHandler(({ event }) => {
    if (event.request.mode === 'navigate') {
        return caches.match('/offline.html'); // This file doesn't exist yet, but we're setting up the logic
    }
    return Response.error();
});

// Message event listener to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
