import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const origin = 'https://polishedpristinedetailing.co.uk';
const errors = [];
const html = new Map();
const files = [];
const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

async function inventory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await inventory(filename);
    else {
      files.push(filename);
      if (entry.name.endsWith('.html')) html.set(filename, await readFile(filename, 'utf8'));
    }
  }
}
await inventory(root);

async function resolveFile(pathname) {
  const filename = path.resolve(root, `.${decodeURIComponent(pathname)}`);
  if (filename !== root && !filename.startsWith(root + path.sep))
    throw new Error('Path leaves dist');
  for (const candidate of [filename, path.join(filename, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

let references = 0;
async function checkReference(value, source, base, anchor = false) {
  if (!value || /^(?:data:|mailto:|tel:|javascript:)/i.test(value)) return;
  const url = new URL(decode(value), base);
  if (url.origin !== origin) return;
  references++;
  const target = await resolveFile(url.pathname);
  if (!target) {
    errors.push(`${path.relative(root, source)}: missing ${url.pathname}`);
  } else if (anchor && url.hash && html.has(target)) {
    const id = decodeURIComponent(url.hash.slice(1));
    const ids = [...html.get(target).matchAll(/\bid=["']([^"']+)["']/g)].map((match) =>
      decode(match[1]),
    );
    if (!ids.includes(id))
      errors.push(`${path.relative(root, source)}: missing anchor ${url.pathname}#${id}`);
  }
}

const indexed = new Set();
for (const [filename, source] of html) {
  const relative = path.relative(root, filename).split(path.sep).join('/');
  const route = relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
  const base = new URL(route, origin);
  assert(!/https?:\/\/(?:localhost|127\.0\.0\.1)/.test(source), `${relative}: local URL published`);
  for (const match of source.matchAll(/\b(href|src|poster|data-src)=["']([^"']*)["']/g)) {
    await checkReference(match[2], filename, base, match[1] === 'href');
  }
  for (const match of source.matchAll(/\bsrcset=["']([^"']+)["']/g)) {
    for (const item of match[1].split(','))
      await checkReference(item.trim().split(/\s+/)[0], filename, base);
  }
  const canonical = source.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  assert(canonical, `${relative}: missing canonical`);
  assert(canonical.startsWith(origin + '/'), `${relative}: incorrect canonical domain`);
  if (!/name="robots" content="noindex/.test(source)) {
    assert.equal(canonical, base.href, `${relative}: incorrect canonical path`);
    assert(
      source.includes(`property="og:url" content="${canonical}"`),
      `${relative}: incorrect social URL`,
    );
    const socialImage = source.match(/property="og:image" content="([^"]+)"/)?.[1];
    assert(socialImage?.startsWith(origin + '/'), `${relative}: missing social image`);
    await checkReference(socialImage, filename, base);
    indexed.add(canonical);
  }
}

for (const filename of files.filter((name) => name.endsWith('.css'))) {
  const base = new URL('/' + path.relative(root, filename).split(path.sep).join('/'), origin);
  for (const match of (await readFile(filename, 'utf8')).matchAll(
    /url\(\s*["']?([^\s"')]+)["']?\s*\)/g,
  )) {
    if (!match[1].startsWith('#')) await checkReference(match[1], filename, base);
  }
}

assert.equal((await readFile(path.join(root, 'CNAME'), 'utf8')).trim(), new URL(origin).hostname);
assert((await stat(path.join(root, '.nojekyll'))).isFile());
assert(
  (await readFile(path.join(root, 'robots.txt'), 'utf8')).includes(
    `Sitemap: ${origin}/sitemap.xml`,
  ),
);
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const locations = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
assert.deepEqual(
  [...locations].sort(),
  [...indexed].sort(),
  'Sitemap must include exactly the indexable pages',
);
assert(/name="robots" content="noindex/.test(await readFile(path.join(root, '404.html'), 'utf8')));
for (const obsolete of ['home.css', 'styles.css', 'script.js', '_config.yml', 'assets']) {
  assert(
    !files.some((filename) => path.relative(root, filename).split(path.sep)[0] === obsolete),
    `Old site remains: ${obsolete}`,
  );
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log(
  `Static site verified: ${indexed.size} indexable pages, ${html.size} HTML files, ${references} local references, ${files.length} files; domain, sitemap, metadata and old-site removal passed.`,
);
