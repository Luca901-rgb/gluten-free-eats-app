
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Pulizia cache browser
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
      console.log(`Cache ${cacheName} eliminata`);
    });
  });
}

// Pulizia localStorage per dati vecchi
function clearOutdatedCache() {
  try {
    localStorage.removeItem('cachedRestaurants');
    localStorage.removeItem('lastCacheTime');
    console.log('Cache locale ripulita all\'avvio');
    
    // Aggiungiamo timestamp di questa build
    localStorage.setItem('buildTimestamp', Date.now().toString());
  } catch (e) {
    console.error('Errore nella pulizia della cache:', e);
  }
}

// Pulisci la cache all'avvio
clearOutdatedCache();

// Inizializzazione dell'app con supporto PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.log('Service worker registration failed:', error);
    });
  });
}

// Inizializzazione per capacitor/mobile
document.addEventListener('deviceready', () => {
  console.log('Device is ready');
  // Forza pulizia cache su dispositivi mobili
  clearOutdatedCache();
}, false);

createRoot(document.getElementById("root")!).render(<App />);
