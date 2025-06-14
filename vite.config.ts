
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from 'vite';

// Helper per generare tutti gli alias dei moduli nativi Rollup
const createRollupNativeAliases = () => {
  const emptyModulePath = path.resolve(__dirname, './empty-module.js');
  const platforms = [
    'linux-x64-gnu',
    'linux-x64-musl', 
    'linux-arm64-gnu',
    'linux-arm64-musl',
    'darwin-x64',
    'darwin-arm64',
    'win32-x64-msvc',
    'win32-ia32-msvc',
    'win32-arm64-msvc'
  ];
  
  const aliases: Record<string, string> = {};
  
  // Alias per tutti i moduli nativi specifici della piattaforma
  platforms.forEach(platform => {
    aliases[`@rollup/rollup-${platform}`] = emptyModulePath;
  });
  
  // Alias per percorsi diretti
  aliases['rollup/dist/native'] = emptyModulePath;
  aliases['rollup/dist/native.js'] = emptyModulePath;
  
  return aliases;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react()];
  
  if (mode === 'development') {
    plugins.push(componentTagger());
  }
  
  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
      cors: true,
      // Miglioramento: gestione errori dev server
      hmr: {
        overlay: true
      }
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Usa la funzione helper per generare tutti gli alias
        ...createRollupNativeAliases(),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ui: ['@radix-ui/react-navigation-menu', '@radix-ui/react-dialog']
          }
        },
        // Miglioramento: ignora warnings sui moduli nativi
        onwarn(warning, warn) {
          // Ignora warnings sui moduli nativi Rollup
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              warning.source?.includes('@rollup/rollup-')) {
            return;
          }
          warn(warning);
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      },
      // Escludi i moduli nativi dall'ottimizzazione
      exclude: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-win32-ia32-msvc',
        '@rollup/rollup-win32-arm64-msvc'
      ]
    },
    define: {
      'process.env.ROLLUP_NATIVE_BUILD': JSON.stringify('false'),
      'process.env.ROLLUP_NATIVE': JSON.stringify('false'),
      'process.env.ROLLUP_WASM': JSON.stringify('true'), // Forza uso WASM
      'global': 'globalThis',
    },
    // Miglioramento: configurazione CSS per ShadCN
    css: {
      postcss: {
        plugins: []
      }
    },
    // Logging per debug
    logLevel: mode === 'development' ? 'info' : 'warn'
  };
});
