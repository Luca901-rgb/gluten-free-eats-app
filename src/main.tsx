
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
    // Pulisci tutto il localStorage
    localStorage.clear();
    console.log('Cache locale ripulita all\'avvio');
    
    // Aggiungiamo timestamp di questa build
    localStorage.setItem('buildTimestamp', Date.now().toString());
  } catch (e) {
    console.error('Errore nella pulizia della cache:', e);
  }
}

// Esponiamo la funzione di refresh globalmente
(window as any).refreshRestaurants = () => {
  try {
    console.log("Refresh globale dei ristoranti chiamato dalla WebView nativa");
    localStorage.removeItem('cachedRestaurants');
    localStorage.removeItem('lastCacheTime');
    localStorage.setItem('forceRefresh', Date.now().toString());
    
    // Se l'app è già caricata, forziamo un refresh della pagina
    if (document.readyState === 'complete') {
      console.log("Forzo refresh della pagina");
      window.location.reload();
    }
  } catch (e) {
    console.error("Errore nel refresh globale:", e);
  }
};

// Pulisci la cache all'avvio
clearOutdatedCache();

// Inizializzazione dell'app con supporto PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Forziamo la registrazione di un nuovo service worker con timestamp
    const swPath = `/sw.js?v=${Date.now()}`;
    navigator.serviceWorker.register(swPath).catch(error => {
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
