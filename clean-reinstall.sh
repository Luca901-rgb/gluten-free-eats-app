
#!/bin/bash
echo "Cleaning development environment..."

# Set environment variables to avoid native modules
export ROLLUP_NATIVE=false
export ROLLUP_NATIVE_BUILD=false
export npm_config_rollup_native_build=false

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "Removing node_modules directory..."
    rm -rf node_modules
    echo "Successfully removed node_modules directory."
else
    echo "node_modules directory doesn't exist."
fi

# Remove package-lock.json
if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json file..."
    rm package-lock.json
    echo "Successfully removed package-lock.json file."
else
    echo "package-lock.json file doesn't exist."
fi

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install --no-optional --ignore-scripts

echo ""
echo "Clean and reinstall complete!"
echo "You can start the application using run-dev.sh"
