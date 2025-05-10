
@echo off
echo ===================================
echo Avvio di Gluten Free Eats Development
echo ===================================

REM Imposta variabili d'ambiente per disabilitare moduli nativi di Rollup
set ROLLUP_NATIVE=false
set ROLLUP_NATIVE_BUILD=false
set npm_config_rollup_native_build=false
set NODE_OPTIONS=--no-native-modules

echo Avvio del server di sviluppo patchato...
node start-app.js

pause
