
// Service worker ridotto al minimo per evitare problemi
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

// Non intercettiamo richieste di rete per evitare problemi
self.addEventListener('fetch', event => {
  // Non facciamo nulla, lasciamo che il browser gestisca normalmente le richieste
  return;
});

console.log('Service Worker v3 caricato con successo');
