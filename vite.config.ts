
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

  // Plugin personalizzato per prevenire moduli nativi di rollup
  plugins.push({
    name: 'prevent-rollup-native',
    enforce: 'pre',
    resolveId(id: string) {
      // Blocca la risoluzione dei moduli nativi
      if (id.includes('@rollup/rollup-linux-') || 
          id.includes('@rollup/rollup-darwin-') || 
          id.includes('@rollup/rollup-win32-') ||
          id.includes('rollup/dist/native')) {
        console.log(`🛡️ Blocco risoluzione modulo nativo: ${id}`);
        return path.resolve(__dirname, 'empty-module.js');
      }
      return null;
    },
    load(id: string) {
      // Sostituisci il contenuto dei moduli nativi
      if (id.includes('rollup/dist/native')) {
        console.log('🛡️ Blocco caricamento modulo native.js');
        return 'export default {}; export const isNativeEsmSupported = false; export const getDefaultRollup = () => null; export const getLogicPath = () => null;';
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
          '@rollup/rollup-win32-x64-msvc'
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
      }
    },
    // Disabilita esplicitamente i moduli nativi di Rollup
    define: {
      'process.env.ROLLUP_NATIVE': JSON.stringify('false'),
      '__ROLLUP_NATIVE_SUPPORT__': 'false',
      'process.env.ROLLUP_NATIVE_BUILD': JSON.stringify('false'),
      'process.env.npm_config_rollup_native_build': JSON.stringify('false')
    }
  };
});
