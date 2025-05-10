
#!/bin/bash
# Script to start the application with Rollup native support disabled

# Set environment variables to disable Rollup native support
export ROLLUP_NATIVE_BUILD=false
export ROLLUP_NATIVE=false
export npm_config_rollup_native_build=false
export NODE_OPTIONS="--no-native-modules"

echo "Starting application with native Rollup modules disabled..."

# Run the application
npm run dev
