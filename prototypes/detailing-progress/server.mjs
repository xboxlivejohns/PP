import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'scene.svg']);
const vendor = new Map([
  ['vendor/gsap.min.js', '../../node_modules/gsap/dist/gsap.min.js'],
  [
    'fonts/barlow.woff2',
    '../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',
  ],
  [
    'fonts/manrope.woff2',
    '../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
  ],
]);
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const name = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
      const file = vendor.has(name)
        ? path.resolve(root, vendor.get(name))
        : allowed.has(name)
          ? path.join(root, name)
          : null;
      if (!file) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const data = await readFile(file);
      res.writeHead(200, {
        'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  })
  .listen(4333, '127.0.0.1', () =>
    console.log('Standalone animation preview: http://127.0.0.1:4333/ — website unchanged.'),
  );
