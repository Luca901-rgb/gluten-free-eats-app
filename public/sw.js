
// Service worker essenziale
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Nessuna interceptazione delle richieste di rete
self.addEventListener('fetch', event => {
  return;
});

console.log('Service Worker v4 caricato');
