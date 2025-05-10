
// Patch for Rollup native modules issue
const originalRequire = module.constructor.prototype.require;

// Intercept require calls to block problematic modules
module.constructor.prototype.require = function(path) {
  // Block any attempt to load @rollup/rollup-* native modules
  if (path.startsWith('@rollup/rollup-') && (
      path.includes('-linux-') || 
      path.includes('-darwin-') || 
      path.includes('-win32-'))) {
    console.log(`⚠️ Prevented loading of native module: ${path}`);
    return {}; // Return empty object instead of the native module
  }
  return originalRequire.apply(this, arguments);
};

// Set environment variables
process.env.ROLLUP_NATIVE = 'false';
process.env.ROLLUP_NATIVE_BUILD = 'false';
process.env.npm_config_rollup_native_build = 'false';

// Load the actual command
require('./node_modules/vite/bin/vite.js');
