import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  },
  build: {
    outDir: 'dist-admin',
    rollupOptions: {
      input: {
        main: './src/AdminApp.jsx'
      }
    }
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
});
