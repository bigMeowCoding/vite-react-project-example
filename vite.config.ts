import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dependencyMapPlugin from './build/dependency-map';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dependencyMapPlugin({
      verbose: true,
      onlyProjectModules: true,
      includeNodeModules: false,
      filter: (fileName) => fileName.includes('src/'),
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
