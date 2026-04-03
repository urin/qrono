import { defineConfig } from 'vite'
import { resolve } from 'path'

const entry = resolve(__dirname, 'src/qrono.js')

export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'qrono.js' : 'qrono.cjs'),
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    target: 'esnext',
    rolldownOptions: {
      output: {
        exports: 'named',
      },
    },
  },
})
