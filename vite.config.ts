
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from 'vite';

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
      hmr: { overlay: true }
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Blocco completo dei moduli nativi Rollup
        "@rollup/rollup-linux-x64-gnu": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-linux-x64-musl": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-linux-arm64-gnu": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-linux-arm64-musl": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-darwin-x64": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-darwin-arm64": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-win32-x64-msvc": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-win32-ia32-msvc": path.resolve(__dirname, "./empty-module.js"),
        "@rollup/rollup-win32-arm64-msvc": path.resolve(__dirname, "./empty-module.js"),
        "rollup/dist/native": path.resolve(__dirname, "./empty-module.js"),
        "rollup/dist/native.js": path.resolve(__dirname, "./empty-module.js"),
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
          '@rollup/rollup-linux-arm64-gnu', 
          '@rollup/rollup-linux-arm64-musl',
          '@rollup/rollup-darwin-x64',
          '@rollup/rollup-darwin-arm64',
          '@rollup/rollup-win32-x64-msvc',
          '@rollup/rollup-win32-ia32-msvc',
          '@rollup/rollup-win32-arm64-msvc'
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ui: ['@radix-ui/react-navigation-menu', '@radix-ui/react-dialog']
          }
        },
        onwarn(warning, warn) {
          // Ignora tutti gli avvisi sui moduli nativi di Rollup
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              (warning.id?.includes('@rollup/rollup-') || warning.id?.includes('rollup/dist/native'))) {
            return;
          }
          // Ignora anche gli avvisi sui moduli esterni
          if (warning.code === 'UNRESOLVED_IMPORT' && warning.id?.includes('@rollup/rollup-')) {
            return;
          }
          warn(warning);
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: { target: 'es2020' },
      // Esclusione completa dei moduli nativi
      exclude: [
        '@rollup/rollup-linux-x64-gnu', '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-linux-arm64-gnu', '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-darwin-x64', '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-win32-x64-msvc', '@rollup/rollup-win32-ia32-msvc', '@rollup/rollup-win32-arm64-msvc',
        'rollup/dist/native', 'rollup/dist/native.js'
      ]
    },
    define: {
      'process.env.ROLLUP_NATIVE_BUILD': JSON.stringify('false'),
      'process.env.ROLLUP_NATIVE': JSON.stringify('false'),
      'global': 'globalThis',
    },
    css: { postcss: { plugins: [] } },
    logLevel: mode === 'development' ? 'info' : 'warn'
  };
});
