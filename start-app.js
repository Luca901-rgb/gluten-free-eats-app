
#!/usr/bin/env node

// Patch for Rollup native modules issue
console.log("⚙️ Starting application with Rollup native modules patching...");

// Set environment variables to disable native modules before anything else
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';
process.env.NODE_OPTIONS = '--no-native-modules';

// Monkey patch the require function to block native module loading
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(path) {
  // Block any attempt to load @rollup/rollup-* native modules
  if (typeof path === 'string' && (
      path.includes('@rollup/rollup-linux-') || 
      path.includes('@rollup/rollup-darwin-') || 
      path.includes('@rollup/rollup-win32-'))) {
    console.log(`🛡️ Blocked loading of native module: ${path}`);
    
    // Return a mock module instead of the native module
    return {
      isNativeEsmSupported: false,
      getDefaultRollup: () => null,
      getLogicPath: () => null
    };
  }
  
  // For the native.js file itself, we can intercept it as well
  if (path === 'rollup/dist/native.js' || path.endsWith('/rollup/dist/native.js')) {
    console.log("🛡️ Intercepting native.js module");
    return {
      isNativeEsmSupported: false,
      getDefaultRollup: () => null,
      getLogicPath: () => null
    };
  }
  
  // Normal require for everything else
  return originalRequire.apply(this, arguments);
};

// Start Vite using the child_process module
const { spawn } = require('child_process');
const path = require('path');

const viteExecutable = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');

console.log("🚀 Starting Vite development server...");

// Launch Vite with the patched environment
const viteProcess = spawn(viteExecutable, process.argv.slice(2), {
  stdio: 'inherit',
  env: {
    ...process.env,
    ROLLUP_NATIVE: 'false',
    ROLLUP_NATIVE_BUILD: 'false',
    npm_config_rollup_native_build: 'false'
  }
});

// Handle Vite process events
viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});
