
// Configurazione delle variabili d'ambiente per disabilitare moduli nativi
function setupEnvironment() {
  process.env.ROLLUP_NATIVE = 'false';
  process.env.ROLLUP_NATIVE_BUILD = 'false';
  process.env.npm_config_rollup_native_build = 'false';
  process.env.NODE_OPTIONS = '--no-native-modules';
  
  console.log("✅ Variabili d'ambiente configurate");
}

module.exports = { setupEnvironment };
