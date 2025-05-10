
@echo off
echo ===================================
echo Starting Gluten Free Eats Development
echo ===================================

REM Set environment variables to disable Rollup native modules
set ROLLUP_NATIVE=false
set ROLLUP_NATIVE_BUILD=false
set npm_config_rollup_native_build=false
set NODE_OPTIONS=--no-native-modules

echo Running patched development server...
node start-app.js

pause
