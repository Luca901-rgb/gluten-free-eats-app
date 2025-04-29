
// Service worker ottimizzato per l'app mobile
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Service Worker installato con successo');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker attivato con successo');
});

// Gestione base della cache per i file principali
const CACHE_NAME = 'gluten-free-eats-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/assets/index.css'
];

// Caching strategico per migliorare le prestazioni offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Restituisci la risposta dalla cache se disponibile
        if (response) {
          return response;
        }
        
        // Altrimenti, scarica dalla rete
        return fetch(event.request)
          .then(response => {
            // Non memorizzare nella cache se non è una risposta valida o è un'API
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.url.includes('/api/')) {
              return response;
            }
            
            // Clona la risposta per memorizzarla nella cache e restituirla
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Fallback per risorse offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

console.log('Service Worker v5 caricato - Ottimizzato per mobile');
