
#!/bin/bash
# Script to start the application with Rollup native support disabled

# Set environment variables to disable Rollup native support
export ROLLUP_NATIVE_BUILD=false
export ROLLUP_NATIVE=false

# Run the application
npm run dev
