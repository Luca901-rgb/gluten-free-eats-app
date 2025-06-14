
#!/usr/bin/env node

console.log("🚀 Avvio sistema di patch avanzato per moduli nativi Rollup...");

// ============================================================================
// FASE 1: CONFIGURAZIONE AMBIENTE GLOBALE
// ============================================================================

// Imposta variabili d'ambiente PRIMA di tutto
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';
process.env.ROLLUP_WASM = 'true';
process.env.NODE_OPTIONS = '--no-native-modules';

console.log("✅ Variabili d'ambiente configurate");

// ============================================================================
// FASE 2: PATCH AGGRESSIVA DEL SISTEMA REQUIRE
// ============================================================================

const Module = require('module');
const fs = require('fs');
const path = require('path');

// Backup del require originale
const originalRequire = Module.prototype.require;
const originalResolve = Module._resolveFilename;

// Lista completa dei moduli nativi da bloccare
const BLOCKED_NATIVE_MODULES = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-linux-x64-musl',
  '@rollup/rollup-linux-arm64-gnu', 
  '@rollup/rollup-linux-arm64-musl',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64',
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-win32-ia32-msvc',
  '@rollup/rollup-win32-arm64-msvc',
  'rollup/dist/native',
  'rollup/dist/native.js'
];

// Funzione per verificare se un modulo è bloccato
function isBlockedNativeModule(modulePath) {
  if (typeof modulePath !== 'string') return false;
  
  return BLOCKED_NATIVE_MODULES.some(blocked => {
    return modulePath === blocked || 
           modulePath.includes(blocked) ||
           modulePath.endsWith('/' + blocked);
  });
}

// Modulo di sostituzione in memoria
const REPLACEMENT_MODULE = {
  isNativeEsmSupported: false,
  getDefaultRollup: () => null,
  getLogicPath: () => null,
  getNativeCode: () => null,
  parseAst: () => null,
  parseAstAsync: () => Promise.resolve(null),
  xxhashBase64Url: () => null,
  xxhashBase36: () => null,
  xxhashBase16: () => null,
  SUPPORTED_ROLLUP_VERSION: true,
  default: {},
  __esModule: true
};

// ============================================================================
// PATCH 1: Module._resolveFilename (blocca la risoluzione)
// ============================================================================

Module._resolveFilename = function(request, parent, isMain) {
  if (isBlockedNativeModule(request)) {
    console.log(`🛡️ Bloccata risoluzione: ${request}`);
    // Restituisci il percorso del nostro modulo vuoto invece di fallire
    return path.resolve(__dirname, 'empty-module.js');
  }
  
  return originalResolve.apply(this, arguments);
};

// ============================================================================
// PATCH 2: Module.prototype.require (intercetta i require)
// ============================================================================

Module.prototype.require = function(id) {
  if (isBlockedNativeModule(id)) {
    console.log(`🛡️ Intercettato require: ${id}`);
    
    // Prova a usare il modulo vuoto se esiste
    const emptyModulePath = path.join(__dirname, 'empty-module.js');
    if (fs.existsSync(emptyModulePath)) {
      try {
        return originalRequire.call(this, emptyModulePath);
      } catch (err) {
        console.warn(`⚠️ Errore caricamento modulo vuoto: ${err.message}`);
      }
    }
    
    // Fallback: modulo in memoria
    return REPLACEMENT_MODULE;
  }
  
  return originalRequire.apply(this, arguments);
};

console.log("✅ Sistema require patchato");

// ============================================================================
// FASE 3: PATCH DIRETTA DEI FILE PROBLEMATICI
// ============================================================================

const rollupNativePath = path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(rollupNativePath)) {
  try {
    const originalContent = fs.readFileSync(rollupNativePath, 'utf8');
    
    if (!originalContent.includes('// PATCHED_BY_GLUTEN_FREE_EATS')) {
      console.log("🔧 Applicazione patch diretta a native.js...");
      
      // Backup
      fs.writeFileSync(rollupNativePath + '.original', originalContent);
      
      // Contenuto patchato che bypassa completamente il caricamento nativo
      const patchedContent = `// PATCHED_BY_GLUTEN_FREE_EATS
// Questo file è stato patchato per evitare errori con moduli nativi

console.log("🛡️ Rollup native.js bypassato");

// Esportazioni sicure che non tentano di caricare moduli nativi
module.exports = {
  isNativeEsmSupported: false,
  getDefaultRollup: function() { return null; },
  getLogicPath: function() { return null; },
  getNativeCode: function() { return null; },
  parseAst: function() { return null; },
  parseAstAsync: function() { return Promise.resolve(null); },
  xxhashBase64Url: function() { return null; },
  xxhashBase36: function() { return null; },
  xxhashBase16: function() { return null; },
  SUPPORTED_ROLLUP_VERSION: true
};

// Supporto ESM
module.exports.__esModule = true;
module.exports.default = module.exports;
`;
      
      fs.writeFileSync(rollupNativePath, patchedContent);
      console.log("✅ Patch diretta applicata con successo");
    } else {
      console.log("✅ native.js già patchato");
    }
  } catch (err) {
    console.error(`❌ Errore nella patch diretta: ${err.message}`);
    console.log("⚠️ Continuazione con patch runtime");
  }
} else {
  console.log("ℹ️ File native.js non trovato, skip patch diretta");
}

// ============================================================================
// FASE 4: AVVIO VITE CON AMBIENTE PROTETTO
// ============================================================================

const { spawn } = require('child_process');

// Determina il comando Vite corretto
let viteCommand;
const isWindows = process.platform === 'win32';

// Cerca vite nei vari percorsi possibili
const possiblePaths = [
  path.join(__dirname, 'node_modules', '.bin', isWindows ? 'vite.cmd' : 'vite'),
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  'npx vite'
];

for (const viteePath of possiblePaths) {
  if (viteePath === 'npx vite' || fs.existsSync(viteePath)) {
    viteCommand = viteePath;
    break;
  }
}

if (!viteCommand) {
  console.error("❌ Impossibile trovare eseguibile Vite");
  process.exit(1);
}

console.log(`🚀 Avvio Vite con protezione completa: ${viteCommand}`);

// Ambiente completamente protetto
const protectedEnv = {
  ...process.env,
  ROLLUP_NATIVE: 'false',
  ROLLUP_NATIVE_BUILD: 'false',
  npm_config_rollup_native_build: 'false',
  ROLLUP_WASM: 'true',
  NODE_OPTIONS: '--no-native-modules',
  // Forza Vite a usare la modalità WASM
  VITE_ROLLUP_WASM: 'true'
};

// Avvia Vite
const viteArgs = process.argv.slice(2);
const viteProcess = spawn(viteCommand, viteArgs, {
  stdio: 'inherit',
  env: protectedEnv,
  shell: isWindows
});

// Gestione eventi
viteProcess.on('error', (err) => {
  console.error('❌ Errore avvio Vite:', err.message);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`📋 Vite terminato con codice: ${code}`);
  process.exit(code || 0);
});

viteProcess.on('exit', (code) => {
  console.log(`🏁 Processo Vite uscito con codice: ${code}`);
  process.exit(code || 0);
});

// Gestione segnali
process.on('SIGINT', () => {
  console.log("\n🛑 Ricevuto SIGINT, terminazione...");
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Ricevuto SIGTERM, terminazione...");
  viteProcess.kill('SIGTERM');
});

console.log("✅ Sistema di protezione attivo, Vite in esecuzione...");
