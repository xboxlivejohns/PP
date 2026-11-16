import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const project = path.resolve(root, '../..');
const dist = path.join(project, 'dist');
const study = new Map([
  ['/study/styles.css', path.join(root, 'styles.css')],
  ['/study/app.js', path.join(root, 'app.js')],
  ['/study/boot.js', path.join(root, 'boot.js')],
  ['/study/detailing-scene.js', path.join(project, 'src/scripts/detailing-scene.js')],
]);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

async function compactPage(html) {
  const scene = await readFile(path.join(project, 'src/assets/detailing-scene.svg'), 'utf8');
  // Work only on the served response. No generated build or production source is changed.
  const oldLane =
    /<div class="header-detail" data-detail-progress aria-hidden="true">[\s\S]*?<\/svg>\s*<\/div><span class="header-detail-rail"><span data-detail-fill><\/span><\/span><\/div>/;
  if (!oldLane.test(html)) throw new Error('Build the current website before opening this study.');
  html = html.replace(oldLane, '');
  const pocket = `<div class="header-detail" data-compact-progress aria-hidden="true"><div class="header-detail-actor" data-detail-actor>${scene}</div></div>`;
  return html
    .replace('<html ', '<html class="compact-study" ')
    .replace('<head>', '<head><script src="/study/boot.js"></script>')
    .replace('</head>', '<link rel="stylesheet" href="/study/styles.css"></head>')
    .replace(/(<header class="site-header">[\s\S]*?<\/a>)/, '$1' + pocket)
    .replace(
      '</header>',
      '<span class="header-detail-rail" aria-hidden="true"><span data-detail-fill></span></span></header>',
    )
    .replace('</body>', '<script type="module" src="/study/app.js"></script></body>');
}

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const name = decodeURIComponent(url.pathname);
      let file = study.get(name);
      if (!file) {
        const candidate = path.resolve(dist, '.' + name);
        const relative = path.relative(dist, candidate);
        if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid path');
        const isPage = !path.extname(name) || name.endsWith('.html');
        if (
          !isPage &&
          !name.startsWith('/_astro/') &&
          !name.startsWith('/media/') &&
          name !== '/favicon.svg'
        )
          throw new Error('Not allowed');
        file = (await stat(candidate)).isDirectory()
          ? path.join(candidate, 'index.html')
          : candidate;
      }
      let data = await readFile(file);
      if (path.extname(file) === '.html') data = await compactPage(data.toString());
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Preview unavailable. Run npm run build first, then open a website page.');
    }
  })
  .listen(4335, '127.0.0.1', () =>
    console.log('Compact navbar comparison: http://127.0.0.1:4335/ — port 4321 is unchanged.'),
  );
