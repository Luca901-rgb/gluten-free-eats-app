
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

console.log("App inizializzazione alle", new Date().toISOString());

// Gestione degli errori globale migliorata
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Errore globale rilevato:", message);
  console.error("Dettagli:", { source, lineno, colno });
  if (error && error.stack) {
    console.error("Stack:", error.stack);
  }
  return false;
};

// Cattura anche le promise non gestite
window.addEventListener('unhandledrejection', function(event) {
  console.error('Promessa non gestita:', event.reason);
});

// Inizializza l'app con una gestione robusta degli errori
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    console.log("Elemento root trovato, rendering app...");
    const root = createRoot(rootElement);
    
    // Avvolgiamo il rendering in un try-catch aggiuntivo e assicuriamo che BrowserRouter avvolga App
    try {
      root.render(
        <BrowserRouter>
          <App />
          <Toaster />
          <SonnerToaster position="top-right" />
        </BrowserRouter>
      );
      console.log("App renderizzata con successo");
    } catch (renderError) {
      console.error("Errore durante il rendering dell'app:", renderError);
      
      // Fallback in caso di errore di rendering
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Si è verificato un errore</h1>
          <p>L'app non può essere caricata. Prova a ricaricare.</p>
          <button onclick="window.location.reload()">Ricarica app</button>
        </div>
      `;
    }
  } else {
    console.error("Elemento root non trovato");
  }
} catch (e) {
  console.error("Errore critico durante l'inizializzazione dell'app:", e);
}
