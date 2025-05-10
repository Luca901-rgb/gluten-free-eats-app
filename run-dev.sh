
#!/bin/bash
echo "==================================="
echo "Avvio di Gluten Free Eats Development"
echo "==================================="

# Imposta variabili d'ambiente per disabilitare moduli nativi di Rollup
export ROLLUP_NATIVE=false
export ROLLUP_NATIVE_BUILD=false
export npm_config_rollup_native_build=false
export NODE_OPTIONS="--no-native-modules"

echo "Avvio del server di sviluppo patchato..."
chmod +x start-app.js
node start-app.js
