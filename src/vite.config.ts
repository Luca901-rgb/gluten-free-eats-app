
import { defineConfig, ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    cors: true
  },
  plugins: [
    react(),
    // Fix for Rollup issue
    {
      name: 'configure-response-headers',
      enforce: 'pre' as const,
      resolveId(id: string) {
        if (id === 'virtual:module') {
          return id;
        }
        return null;
      },
      load(id: string) {
        if (id === 'virtual:module') {
          return `export default {}; export const isNativeEsmSupported = false; export const getDefaultRollup = () => null; export const getLogicPath = () => null;`;
        }
        return null;
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
