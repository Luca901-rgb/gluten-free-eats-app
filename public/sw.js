
// Service worker semplificato e più affidabile
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

// Non intercetta richieste di rete per evitare problemi di caching
self.addEventListener('fetch', event => {
  // Bypass caching per tutte le richieste
  return;
});

// Per debug
console.log('Service Worker v2 caricato');
