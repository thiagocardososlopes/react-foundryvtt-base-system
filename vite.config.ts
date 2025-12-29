import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'main.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return 'assets/[name][extname]';
        },
        format: 'es',
      },
    },
  
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'meu-sistema-v13',
      fileName: 'main',
      formats: ['es']
    }
  },

  base: './'
});