
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from 'vite';

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
      cors: true
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Reindirizza i moduli nativi di Rollup al modulo vuoto
        '@rollup/rollup-linux-x64-gnu': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-linux-x64-musl': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-darwin-x64': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-darwin-arm64': path.resolve(__dirname, './empty-module.js'),
        '@rollup/rollup-win32-x64-msvc': path.resolve(__dirname, './empty-module.js'),
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
    define: {
      'process.env.ROLLUP_NATIVE_BUILD': JSON.stringify('false'),
    }
  };
});
