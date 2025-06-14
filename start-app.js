
#!/usr/bin/env node

console.log("🚀 Avvio Gluten Free Eats con patch Rollup avanzato...");

// Patch preventivo per i moduli nativi di Rollup
const Module = require('module');
const originalRequire = Module.prototype.require;

// Lista completa dei moduli nativi da bloccare
const BLOCKED_MODULES = [
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

// Modulo sostitutivo vuoto
const EMPTY_MODULE = {
  parseAst: () => null,
  parseAstAsync: () => Promise.resolve(null),
  xxhashBase64Url: () => null,
  xxhashBase36: () => null,
  xxhashBase16: () => null,
  default: {},
  __esModule: true
};

// Funzione per verificare se un modulo deve essere bloccato
function shouldBlockModule(id) {
  return BLOCKED_MODULES.some(blocked => 
    id === blocked || 
    id.includes(blocked) || 
    id.endsWith(blocked)
  );
}

// Patch globale del sistema require
Module.prototype.require = function(id) {
  if (shouldBlockModule(id)) {
    console.log(`🛡️ Modulo nativo Rollup bloccato: ${id}`);
    return EMPTY_MODULE;
  }
  return originalRequire.apply(this, arguments);
};

// Configurazione variabili d'ambiente
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';
process.env.NODE_OPTIONS = '--no-native-modules';

console.log("✅ Sistema di patch Rollup applicato globalmente");
console.log("✅ Variabili d'ambiente configurate");

// Avvio di Vite con gestione errori
const { spawn } = require('child_process');

const viteCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const viteArgs = ['run', 'vite-dev'];

console.log("🚀 Avvio Vite con protezione Rollup...");

const viteProcess = spawn(viteCommand, viteArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ROLLUP_NATIVE: 'false',
    ROLLUP_NATIVE_BUILD: 'false'
  }
});

viteProcess.on('error', (err) => {
  console.error('❌ Errore Vite:', err.message);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  process.exit(code || 0);
});

// Gestione segnali di terminazione
process.on('SIGINT', () => {
  console.log("\n🛑 Terminazione richiesta...");
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Terminazione forzata...");
  viteProcess.kill('SIGTERM');
});

console.log("✅ Sistema di protezione Rollup completamente attivato");
