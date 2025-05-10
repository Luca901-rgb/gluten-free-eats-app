
#!/bin/bash
echo "==================================="
echo "Starting Gluten Free Eats Development"
echo "==================================="

# Set environment variables to disable Rollup native modules
export ROLLUP_NATIVE=false
export ROLLUP_NATIVE_BUILD=false
export npm_config_rollup_native_build=false
export NODE_OPTIONS="--no-native-modules"

echo "Running patched development server..."
node start-app.js

