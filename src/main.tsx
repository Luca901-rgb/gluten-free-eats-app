
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
}, false);

createRoot(document.getElementById("root")!).render(<App />);
