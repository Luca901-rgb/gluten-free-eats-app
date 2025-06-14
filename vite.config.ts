
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Forza le variabili d'ambiente per disabilitare i moduli nativi
  process.env.ROLLUP_NATIVE = 'false';
  process.env.ROLLUP_NATIVE_BUILD = 'false';
  process.env.npm_config_rollup_native_build = 'false';

  const plugins: PluginOption[] = [react()];
  
  if (mode === 'development') {
    plugins.push(componentTagger());
  }

  // Plugin migliorato per bloccare completamente i moduli nativi
  plugins.push({
    name: 'rollup-native-blocker',
    enforce: 'pre',
    configResolved() {
      // Override delle funzioni native di Rollup a livello globale
      if (typeof globalThis !== 'undefined') {
        (globalThis as any).__ROLLUP_NATIVE_SUPPORT__ = false;
      }
    },
    resolveId(id: string) {
      // Blocca qualsiasi tentativo di caricare moduli nativi
      if (id.includes('@rollup/rollup-') || 
          id.includes('rollup/dist/native') ||
          id.endsWith('/native.js') ||
          id.includes('rollup-linux') ||
          id.includes('rollup-darwin') ||
          id.includes('rollup-win32')) {
        console.log(`🛡️ Bloccato modulo nativo: ${id}`);
        return '\0virtual:rollup-native-replacement';
      }
      return null;
    },
    load(id: string) {
      if (id === '\0virtual:rollup-native-replacement') {
        console.log(`🛡️ Sostituito con modulo virtuale`);
        return `
          // Sostituzione virtuale per moduli nativi Rollup
          export const isNativeEsmSupported = false;
          export const getDefaultRollup = () => null;
          export const getLogicPath = () => null;
          export default {
            isNativeEsmSupported: false,
            getDefaultRollup: () => null,
            getLogicPath: () => null
          };
        `;
      }
      return null;
    }
  });

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
      cors: true
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Alias per reindirizzare i moduli nativi
        '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-linux-x64-musl': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-darwin-x64': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-darwin-arm64': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-win32-x64-msvc': path.resolve(__dirname, './empty-module.js'),
        'rollup/dist/native': path.resolve(__dirname, './empty-module.js'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2020',
      rollupOptions: {
        external: [
          '@rollup/rollup-linux-x64-gnu', 
          '@rollup/rollup-linux-x64-musl', 
          '@rollup/rollup-darwin-x64',
          '@rollup/rollup-darwin-arm64',
          '@rollup/rollup-win32-x64-msvc',
          'rollup/dist/native'
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ui: ['@radix-ui/react-navigation-menu', '@radix-ui/react-dialog']
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      },
      exclude: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc',
        'rollup/dist/native'
      ]
    },
    // Disabilita esplicitamente i moduli nativi di Rollup
    define: {
      'process.env.ROLLUP_NATIVE': JSON.stringify('false'),
      '__ROLLUP_NATIVE_SUPPORT__': 'false',
      'process.env.ROLLUP_NATIVE_BUILD': JSON.stringify('false'),
      'process.env.npm_config_rollup_native_build': JSON.stringify('false'),
      'global.__ROLLUP_NATIVE_MODULE__': 'undefined',
      'globalThis.__ROLLUP_NATIVE_SUPPORT__': 'false'
    }
  };
});
