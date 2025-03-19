import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

export default defineConfig({
  plugins: [vue()], 
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'), // Définit '@' comme alias pour le dossier 'src'
    },
  },
  test: {
    setupFiles: './src/tests/setup.js',  // Fichier de configuration pour les tests
    environment: 'jsdom', 
    globals: true, 
  },
});