
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

  // Plugin migliorato per prevenire moduli nativi di rollup
  plugins.push({
    name: 'prevent-rollup-native',
    enforce: 'pre',
    resolveId(id: string, importer?: string) {
      // Blocca qualsiasi tentativo di risolvere moduli nativi
      if (id.includes('@rollup/rollup-') || 
          id.includes('rollup/dist/native') ||
          id === 'rollup/dist/native.js' ||
          id.endsWith('/native.js')) {
        console.log(`🛡️ Blocco risoluzione modulo nativo: ${id}`);
        // Ritorna un modulo vuoto invece di null
        return this.resolve(path.resolve(__dirname, 'empty-module.js'), importer, { skipSelf: true });
      }
      return null;
    },
    load(id: string) {
      // Intercetta anche il caricamento diretto
      if (id.includes('rollup/dist/native') || 
          id.includes('@rollup/rollup-') ||
          id.endsWith('empty-module.js')) {
        console.log(`🛡️ Blocco caricamento modulo: ${id}`);
        return `
          // Modulo vuoto per sostituire i moduli nativi di rollup
          export default {};
          export const isNativeEsmSupported = false;
          export const getDefaultRollup = () => null;
          export const getLogicPath = () => null;
        `;
      }
      return null;
    },
    buildStart() {
      // Disabilita esplicitamente i moduli nativi all'inizio del build
      console.log('🛡️ Disabilitazione moduli nativi Rollup attiva');
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
        // Aliasing per evitare il caricamento di moduli nativi
        "rollup/dist/native": path.resolve(__dirname, "empty-module.js"),
        "rollup/dist/native.js": path.resolve(__dirname, "empty-module.js")
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
        '@rollup/rollup-win32-x64-msvc'
      ]
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
