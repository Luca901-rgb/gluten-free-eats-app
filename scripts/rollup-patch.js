
// Modulo per gestire il patch dei moduli nativi di Rollup
const Module = require('module');

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

function isBlockedModule(id) {
  return BLOCKED_MODULES.some(blocked => id.includes(blocked));
}

function applyRollupPatch() {
  const originalRequire = Module.prototype.require;
  
  Module.prototype.require = function(id) {
    if (isBlockedModule(id)) {
      console.log(`🛡️ Modulo nativo bloccato: ${id}`);
      return EMPTY_MODULE;
    }
    return originalRequire.apply(this, arguments);
  };
  
  console.log("✅ Sistema di patch Rollup attivato");
}

module.exports = { applyRollupPatch };
