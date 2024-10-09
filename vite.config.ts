import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy({
    targets: [
      '> 0.25%',
      'chromeAndroid>=54',
      'chrome>=54',
      'safari >= 11',
      'not IE 11',
    ],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    polyfills: [
      'es.string.replace-all',
      'web.queue-microtask',
      'es.promise',
      'es.symbol',
      'es.string.pad-start',
      'es.string.pad-end',
      'es.string.trim',
    ],
    modernPolyfills: ['es.string.replace-all', 'web.queue-microtask'],
  }),],
  base: '/activity',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   host: '0.0.0.0',
  // },
})
