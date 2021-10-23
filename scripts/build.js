import { build } from 'esbuild'

// Browser and ECMAScript module
build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.js',
  target: 'es2020',
  sourcemap: true,
  bundle: true
})

build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.min.js',
  target: 'es2020',
  sourcemap: true,
  bundle: true,
  minify: true
})

// CommonJS
build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.cjs',
  platform: 'node',
  sourcemap: true,
  bundle: true
})
