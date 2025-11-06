import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        exp01: resolve(__dirname, 'experiments/01-particle-dissolution/index.html'),
        // Future experiments will be added here
      }
    }
  },
  server: {
    open: '/index.html',
    port: 3000
  }
});
