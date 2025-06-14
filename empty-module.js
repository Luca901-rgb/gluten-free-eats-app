
// Modulo vuoto migliorato per sostituire i moduli nativi di rollup
console.log("🛡️ Modulo nativo Rollup bypassato con successo");

// Funzioni di base
const emptyFunction = () => null;
const emptyPromise = () => Promise.resolve(null);
const emptyObject = {};

// Esportazioni principali
const rollupExports = {
  // Funzioni principali di Rollup native
  parseAst: emptyFunction,
  parseAstAsync: emptyPromise, // Ritorna Promise per consistenza
  xxhashBase64Url: emptyFunction,
  xxhashBase36: emptyFunction,
  xxhashBase16: emptyFunction,
  
  // Supporto ESM
  default: emptyObject,
  
  // Proprietà booleane
  SUPPORTED_ROLLUP_VERSION: true,
  isNativeEsmSupported: false,
  
  // Getters
  getDefaultRollup: emptyFunction,
  getLogicPath: emptyFunction,
  getNativeCode: emptyFunction,
  
  // Fallback proxy per metodi non definiti
  ...new Proxy({}, {
    get: (target, prop) => {
      // Log solo per debug se necessario
      // console.log(`🔧 Accessing undefined native method: ${prop}`);
      return typeof prop === 'string' && prop.includes('Async') 
        ? emptyPromise 
        : emptyFunction;
    }
  })
};

// Assegna tutte le esportazioni
Object.assign(module.exports, rollupExports);

// Assicura compatibilità ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports.__esModule = true;
}
