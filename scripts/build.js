import { build } from 'esbuild'

build({
  outfile: './dist/qrono.js',
  entryPoints: ['./src/qrono.js'],
  format: 'esm',
  target: 'esnext',
  sourcemap: true,
  bundle: true
})

build({
  outfile: './dist/qrono.min.js',
  entryPoints: ['./src/qrono.js'],
  format: 'iife',
  target: 'esnext',
  sourcemap: true,
  bundle: true,
  minify: true
})

// Node
build({
  outfile: './dist/qrono.mjs',
  entryPoints: ['./src/qrono.js'],
  format: 'esm',
  target: 'es2015',
  platform: 'node',
  sourcemap: true,
  bundle: true
})

// CommonJS
build({
  outfile: './dist/qrono.cjs',
  entryPoints: ['./src/qrono.js'],
  format: 'cjs',
  target: 'es2015',
  platform: 'node',
  sourcemap: true,
  bundle: true
})
