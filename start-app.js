
#!/usr/bin/env node

console.log("🚀 Avvio Gluten Free Eats con patch Rollup...");

// Importa i moduli helper
const { setupEnvironment } = require('./scripts/env-setup');
const { applyRollupPatch } = require('./scripts/rollup-patch');
const { launchVite } = require('./scripts/vite-launcher');

// Configura l'ambiente
setupEnvironment();

// Applica il patch per i moduli nativi
applyRollupPatch();

// Avvia Vite
launchVite();
