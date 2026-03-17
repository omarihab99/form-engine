import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2017',
  external: [
    '@omarihab/form-engine-core',
    '@microsoft/sp-core-library',
    '@microsoft/sp-webpart-base',
    '@microsoft/sp-application-base',
    '@microsoft/sp-http',
    '@pnp/sp',
    '@pnp/graph',
  ],
});
