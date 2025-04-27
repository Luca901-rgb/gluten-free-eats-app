
// Service Worker for Gluten Free Eats - Modified to be lightweight and non-blocking
const CACHE_NAME = 'gluten-free-eats-cache-v' + new Date().getTime();

// Only handle fetch events without caching
self.addEventListener('fetch', event => {
  // Don't intercept fetch requests to prevent blocking app startup
  // Just let the browser handle the request normally
});

// On install, clear all caches and activate immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// On activate, claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
