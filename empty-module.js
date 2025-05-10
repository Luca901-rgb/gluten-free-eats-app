
// Modulo vuoto per sostituire i moduli nativi di rollup
// Questo file viene caricato al posto dei moduli nativi problematici

// Esporta interfacce compatibili con quelle attese da rollup
export default {};
export const isNativeEsmSupported = false;
export const getDefaultRollup = () => null;
export const getLogicPath = () => null;
