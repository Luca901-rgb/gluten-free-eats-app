
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Force environment variables to disable native modules
  process.env.ROLLUP_NATIVE = 'false';
  process.env.ROLLUP_NATIVE_BUILD = 'false';
  process.env.npm_config_rollup_native_build = 'false';

  return {
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
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2020',
      rollupOptions: {
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
    // Explicitly disable Rollup native modules
    define: {
      'process.env.ROLLUP_NATIVE': 'false',
      '__ROLLUP_NATIVE_SUPPORT__': 'false',
      'process.env.ROLLUP_NATIVE_BUILD': 'false',
      'process.env.npm_config_rollup_native_build': 'false'
    }
  };
});
