
#!/bin/bash
# Script to build and run the application with Rollup native support disabled

# Set environment variables to disable Rollup native support
export ROLLUP_NATIVE_BUILD=false
export ROLLUP_NATIVE=false
export NODE_OPTIONS="--no-native-modules"

# Run the application
npm run build
