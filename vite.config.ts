
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    cors: true
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['@radix-ui/react-navigation-menu', '@radix-ui/react-dialog']
        }
      },
      // Forza Rollup a usare l'implementazione JavaScript
      context: 'globalThis',
      treeshake: {
        moduleSideEffects: true,
      }
    }
  },
  // Forza la disabilitazione dei moduli nativi e usa l'implementazione JavaScript
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Definizioni esplicite per disabilitare il codice nativo di Rollup
  define: {
    'process.env.ROLLUP_NATIVE': 'false',
    '__ROLLUP_NATIVE_SUPPORT__': 'false',
    'process.env.ROLLUP_NATIVE_BUILD': 'false',
    // Aggiunta ulteriori variabili di ambiente per assicurarci che Rollup non utilizzi moduli nativi
    'process.env.npm_config_rollup_native_build': 'false'
  }
}));
