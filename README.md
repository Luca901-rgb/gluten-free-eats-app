
# Gluten Free Eats

## Development Instructions

Due to issues with Rollup native modules in some environments, please use the following scripts to run the application:

### Windows:
```
run-dev.bat
```

### Linux/MacOS:
```
chmod +x run-dev.sh
./run-dev.sh
```

These scripts include necessary patches to prevent errors with Rollup native modules.

## First Time Setup

If this is your first time running the application, or if you encounter module loading errors:

### Windows:
```
clean-reinstall.bat
```
And then run:
```
run-dev.bat
```

### Linux/MacOS:
```
chmod +x make-scripts-executable.sh
./make-scripts-executable.sh
chmod +x clean-reinstall.sh
./clean-reinstall.sh
./run-dev.sh
```

## Troubleshooting

If you still encounter errors with Rollup native modules:

1. Make sure Node.js is updated to a recent version
2. Clear the node_modules folder and package-lock.json
3. Run the clean-reinstall script for your platform
4. Use the run-dev script to start the application

The patched startup scripts work by intercepting and blocking the problematic native module loading.
