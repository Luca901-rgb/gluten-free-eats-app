
// Service Worker per Gluten Free Eats - NON CACHING VERSION
const CACHE_NAME = 'gluten-free-eats-cache-v' + new Date().getTime();

// Intercept fetch events but don't cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(error => {
        console.error('Fetch error:', error);
        return new Response('Network error', { status: 408 });
      })
  );
});

// On install, clear all caches
self.addEventListener('install', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.skipWaiting())
  );
});

// On activate, clear all caches again
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});
