import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { peerDependencies } from './package.json';
import { resolve } from 'path';
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import { presetAttributify } from 'unocss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [presetAttributify(), presetWind()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: ext => `index.${ext}.js`
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)]
    },
    target: 'esnext',
    sourcemap: true
  }
});
