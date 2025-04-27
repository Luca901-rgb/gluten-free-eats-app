
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("App initializing at", new Date().toISOString());

// Simple error boundary
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global error caught:", message, error);
  return false;
};

// Initialize app with error handling
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    console.log("Root element found, rendering app...");
    createRoot(rootElement).render(<App />);
    console.log("App rendered successfully");
  } else {
    console.error("Root element not found");
  }
} catch (e) {
  console.error("Critical error rendering app:", e);
}
