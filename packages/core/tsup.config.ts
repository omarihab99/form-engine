import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
  },
  {
    entry: { 'form-engine.min': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'FormEngine',
    outDir: '../../dist',
    minify: true,
    sourcemap: true,
    injectStyle: true,
  },
]);
