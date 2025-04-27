
// Simple service worker that doesn't interfere with app startup
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Don't intercept any network requests to avoid blocking the app
self.addEventListener('fetch', event => {
  // Pass through all requests without caching
});
