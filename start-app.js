
#!/usr/bin/env node

// Sistema di patch migliorato per problemi con moduli nativi di Rollup
console.log("⚙️ Avvio dell'applicazione con patch migliorata per moduli nativi Rollup...");

// Imposta variabili d'ambiente per disattivare i moduli nativi prima di qualsiasi altra cosa
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';
process.env.NODE_OPTIONS = '--no-native-modules';

// Patch del sistema di require per bloccare il caricamento di moduli nativi
const Module = require('module');
const fs = require('fs');
const path = require('path');
const originalRequire = Module.prototype.require;

// Creiamo un modulo vuoto come sostituto per i moduli nativi di rollup
const emptyModulePath = path.join(__dirname, 'empty-module.js');

// Funzione per verificare se un modulo è un modulo nativo di rollup
function isRollupNativeModule(modulePath) {
  return typeof modulePath === 'string' && (
    modulePath.includes('@rollup/rollup-linux-') || 
    modulePath.includes('@rollup/rollup-darwin-') || 
    modulePath.includes('@rollup/rollup-win32-') ||
    modulePath === 'rollup/dist/native' ||
    modulePath.endsWith('/rollup/dist/native.js')
  );
}

// Patch di Module.prototype.require per intercettare richieste di moduli nativi
Module.prototype.require = function(path) {
  if (isRollupNativeModule(path)) {
    console.log(`🛡️ Intercettato caricamento del modulo nativo: ${path}`);
    try {
      if (fs.existsSync(emptyModulePath)) {
        // Restituisci il nostro modulo vuoto
        return require(emptyModulePath);
      } else {
        // Modulo di fallback in memoria
        return {
          isNativeEsmSupported: false,
          getDefaultRollup: () => null,
          getLogicPath: () => null
        };
      }
    } catch (err) {
      console.warn(`⚠️ Errore nel caricamento del modulo sostitutivo, uso fallback in memoria: ${err.message}`);
      return {
        isNativeEsmSupported: false,
        getDefaultRollup: () => null,
        getLogicPath: () => null
      };
    }
  }
  
  // Gestione normale per tutti gli altri moduli
  return originalRequire.apply(this, arguments);
};

// Patch specifica per il file native.js di rollup
const rollupNativePath = path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js');
if (fs.existsSync(rollupNativePath)) {
  try {
    console.log("🔧 Tentativo di applicare patch diretta al file native.js di Rollup");
    
    // Leggi il contenuto attuale
    const originalContent = fs.readFileSync(rollupNativePath, 'utf8');
    
    // Verifica se il file è già patchato
    if (!originalContent.includes('// PATCHED_BY_GLUTEN_FREE_EATS')) {
      // Prepara il contenuto patchato
      const patchedContent = `// PATCHED_BY_GLUTEN_FREE_EATS
export const isNativeEsmSupported = false;
export function getDefaultRollup() { return null; }
export function getLogicPath() { return null; }
export default {};
`;
      
      // Backup del file originale
      fs.writeFileSync(rollupNativePath + '.bak', originalContent);
      
      // Scrivi il file patchato
      fs.writeFileSync(rollupNativePath, patchedContent);
      console.log("✅ Patch applicata con successo al file native.js di Rollup");
    } else {
      console.log("✅ Il file native.js di Rollup è già stato patchato");
    }
  } catch (err) {
    console.error("❌ Impossibile applicare patch al file native.js:", err.message);
    console.log("⚠️ Continuazione con intercettazione a runtime");
  }
}

// Avvia Vite usando il modulo child_process
const { spawn } = require('child_process');
const viteExecutable = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');

console.log("🚀 Avvio del server di sviluppo Vite con protezione moduli nativi...");

// Avvia Vite con l'ambiente patchato
const viteProcess = spawn(viteExecutable, process.argv.slice(2), {
  stdio: 'inherit',
  env: {
    ...process.env,
    ROLLUP_NATIVE: 'false',
    ROLLUP_NATIVE_BUILD: 'false',
    npm_config_rollup_native_build: 'false',
    NODE_OPTIONS: '--no-native-modules'
  }
});

// Gestisci gli eventi del processo Vite
viteProcess.on('error', (err) => {
  console.error('Impossibile avviare Vite:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Processo Vite terminato con codice ${code}`);
  process.exit(code);
});
