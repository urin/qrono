import { defineConfig } from 'vite'
import { resolve } from 'path'

const entry = resolve(__dirname, 'src/qrono.js')

export default defineConfig({
  build: {
    lib: {
      entry,
      name: 'Qrono',
      formats: ['iife'],
      fileName: () => 'qrono.min.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: true,
    target: 'esnext',
    rolldownOptions: {
      output: {
        exports: 'named',
      },
    },
  },
})
