import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

export default defineConfig({
  plugins: [vue()], // Support for Vue.js
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'), // Resolves to the src directory
    },
  },
  test: {
    setupFiles: './src/tests/setup.js',
    environment: 'jsdom', // Simulates the DOM for tests
    globals: true, // Enables global variables like describe, it, expect
  },
});