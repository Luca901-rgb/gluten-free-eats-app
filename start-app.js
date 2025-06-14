
#!/usr/bin/env node

console.log("🚀 Avvio Gluten Free Eats con patch Rollup...");

// Imposta variabili d'ambiente per disabilitare moduli nativi
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';

console.log("✅ Variabili d'ambiente configurate");

// Patch del sistema require per bloccare moduli nativi problematici
const Module = require('module');
const fs = require('fs');
const path = require('path');

const originalRequire = Module.prototype.require;

// Lista dei moduli nativi da bloccare
const BLOCKED_MODULES = [
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-linux-x64-musl',
  '@rollup/rollup-linux-arm64-gnu',
  '@rollup/rollup-linux-arm64-musl',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64',
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-win32-ia32-msvc',
  '@rollup/rollup-win32-arm64-msvc'
];

function isBlockedModule(id) {
  return BLOCKED_MODULES.some(blocked => id.includes(blocked));
}

// Modulo di sostituzione semplificato
const EMPTY_MODULE = {
  parseAst: () => null,
  parseAstAsync: () => Promise.resolve(null),
  xxhashBase64Url: () => null,
  xxhashBase36: () => null,
  xxhashBase16: () => null,
  default: {},
  __esModule: true
};

// Patch del require
Module.prototype.require = function(id) {
  if (isBlockedModule(id)) {
    console.log(`🛡️ Modulo nativo bloccato: ${id}`);
    return EMPTY_MODULE;
  }
  return originalRequire.apply(this, arguments);
};

console.log("✅ Sistema di patch attivato");

// Avvio di Vite
const { spawn } = require('child_process');

const viteCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const viteArgs = ['run', 'vite-dev'];

console.log("🚀 Avvio Vite...");

const viteProcess = spawn(viteCommand, viteArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ROLLUP_NATIVE: 'false',
    ROLLUP_NATIVE_BUILD: 'false'
  }
});

viteProcess.on('error', (err) => {
  console.error('❌ Errore:', err.message);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  process.exit(code || 0);
});

// Gestione segnali
process.on('SIGINT', () => {
  console.log("\n🛑 Terminazione...");
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log("\n🛑 Terminazione...");
  viteProcess.kill('SIGTERM');
});

console.log("✅ Sistema protetto attivo");
