
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple console log for debugging
console.log("App initializing at", new Date().toISOString());

// Simple cache cleaning without complex logic
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log('Cache locale ripulita all\'avvio');
  localStorage.setItem('buildTimestamp', Date.now().toString());
} catch (e) {
  console.error('Errore nella pulizia della cache:', e);
}

// Simplified service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.log('Service worker registration failed:', error);
    });
  });
}

// Simple initialization for React app
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
    console.log("App rendered successfully");
  } else {
    console.error("Root element not found");
  }
} catch (e) {
  console.error("Error rendering app:", e);
}
