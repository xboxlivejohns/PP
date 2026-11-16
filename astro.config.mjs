import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://polishedpristinedetailing.co.uk',
  output: 'static',
  trailingSlash: 'always',
  server: { host: '127.0.0.1', port: 4321 },
});
