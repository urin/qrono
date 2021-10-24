import { build } from 'esbuild'

// Browser and ECMAScript module
build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.js',
  format: 'esm',
  target: 'esnext',
  sourcemap: true,
  bundle: true
})

build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.min.js',
  format: 'esm',
  target: 'esnext',
  sourcemap: true,
  bundle: true,
  minify: true
})

// Node
build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.mjs',
  format: 'esm',
  target: 'es2015',
  platform: 'node',
  sourcemap: true,
  bundle: true
})

// CommonJS
build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.cjs',
  format: 'cjs',
  target: 'es2015',
  platform: 'node',
  sourcemap: true,
  bundle: true
})
