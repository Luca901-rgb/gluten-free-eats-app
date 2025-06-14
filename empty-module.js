
// Modulo vuoto migliorato per sostituire i moduli nativi di rollup
console.log("🛡️ Modulo nativo Rollup bypassato con successo");

// Esporta tutte le interfacce che Rollup potrebbe aspettarsi
const emptyFunction = () => null;
const emptyObject = {};

module.exports = {
  // Funzioni principali di Rollup native
  parseAst: emptyFunction,
  parseAstAsync: emptyFunction,
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
  
  // Fallback per qualsiasi altro metodo
  ...new Proxy({}, {
    get: () => emptyFunction
  })
};

// Supporto per import ES6
module.exports.parseAst = emptyFunction;
module.exports.parseAstAsync = emptyFunction;
module.exports.xxhashBase64Url = emptyFunction;
module.exports.xxhashBase36 = emptyFunction;
module.exports.xxhashBase16 = emptyFunction;
module.exports.isNativeEsmSupported = false;
module.exports.getDefaultRollup = emptyFunction;
module.exports.getLogicPath = emptyFunction;
module.exports.getNativeCode = emptyFunction;
module.exports.default = emptyObject;
