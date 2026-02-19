import { defineConfig } from 'vite'
import oxlint from 'vite-plugin-oxlint'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/qrono.js'),
      name: 'Qrono',
      formats: ['es', 'cjs', 'iife'],
      fileName: format => {
        if (format === 'es') return 'qrono.js'
        if (format === 'cjs') return 'qrono.cjs'
        if (format === 'iife') return 'qrono.min.js'
        return `qrono.${format}.js`
      },
    },
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        exports: 'named',
        plugins: [],
      },
    },
  },

  test: {
    globals: true,
    environment: 'node',
    globalSetup: './vitest.setup.js',
    setupFiles: [],
    include: [
      'tests/**/*.{js,mjs,cjs,ts,tsx,jsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'dist/', '**/*.config.js'],
    },
  },

  // Plugins
  plugins: [
    // Oxlint for fast linting during development
    oxlint({
      path: 'src',
      configFile: './oxlint.json',
    }),
    oxlint({
      path: 'tests',
      configFile: './oxlint.json',
    }),
  ],
})
