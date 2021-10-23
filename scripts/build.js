import { build } from 'esbuild'

build({
  entryPoints: ['./src/qrono.js'],
  outfile: './dist/qrono.min.js',
  target: 'es2020',
  sourcemap: true,
  bundle: true,
  minify: true
})
