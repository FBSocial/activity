import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import Info from 'unplugin-info/vite';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';


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
      'es.promise',
      'es.symbol',
      'es.array.iterator',
      'es.object.to-string',
      'web.dom-collections.iterator',
    ],
    modernPolyfills: [
      'es.string.replace-all',
      'web.queue-microtask',
    ],
  }), compression({
    algorithm: 'gzip',
    exclude: [/\.(html)$/],
  }), Info()],
  base: '/activity',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 相关库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
