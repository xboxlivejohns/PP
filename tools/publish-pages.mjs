import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdtemp, realpath, rmdir, stat, unlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const expectedRepository = 'xboxlivejohns/pp';
const sourceRef = 'refs/remotes/origin/main';
const publishedRef = 'refs/remotes/origin/gh-pages';

function run(command, args, { capture = false, env = process.env, label = command } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env,
      shell: false,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
    let stdout = '';
    if (capture) {
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => (stdout += chunk));
      // Git errors can contain credential-bearing remote URLs. Keep them private.
      child.stderr.resume();
    }
    child.on('error', () => reject(new Error(`${label} could not start.`)));
    child.on('close', (code, signal) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`${label} failed (${signal || `exit ${code}`}).`));
    });
  });
}

const git = (args, options = {}) =>
  run('git', ['--no-optional-locks', ...args], {
    capture: true,
    label: `Git ${args[0]}`,
    ...options,
  });

function isExpectedRemote(value) {
  const scp = /^git@github\.com:([^\s]+)$/i.exec(value);
  if (scp) return scp[1].replace(/\.git\/?$/i, '').toLowerCase() === expectedRepository;
  try {
    const url = new URL(value);
    return (
      ['https:', 'ssh:'].includes(url.protocol) &&
      url.hostname.toLowerCase() === 'github.com' &&
      !url.password &&
      (!url.username || (url.protocol === 'ssh:' && url.username === 'git')) &&
      !url.port &&
      !url.search &&
      !url.hash &&
      url.pathname
        .replace(/^\//, '')
        .replace(/\.git\/?$/i, '')
        .toLowerCase() === expectedRepository
    );
  } catch {
    return false;
  }
}

async function requireExpectedOrigin() {
  for (const options of [[], ['--push']]) {
    const urls = (await git(['remote', 'get-url', ...options, '--all', 'origin'])).split('\n');
    assert(
      urls.length === 1 && isExpectedRemote(urls[0]),
      'Origin must have one fetch and push URL for github.com/xboxlivejohns/PP.',
    );
  }
}

async function requireCleanSource(expectedHead) {
  assert.equal(
    await git(['symbolic-ref', '--quiet', '--short', 'HEAD']),
    'main',
    'Use source main.',
  );
  assert.equal(
    await git(['status', '--porcelain=v1', '--untracked-files=all']),
    '',
    'Commit or protect source changes before publishing; the source checkout must be clean.',
  );
  const head = await git(['rev-parse', '--verify', 'HEAD']);
  if (expectedHead) assert.equal(head, expectedHead, 'Source HEAD changed during validation.');
  return head;
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
};

function isWithinOutput(filename) {
  const relative = path.relative(output, filename);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

async function serveFile(request, response, filename, statusCode = 200) {
  const resolved = await realpath(filename);
  assert(isWithinOutput(resolved), 'A static file resolves outside dist.');
  const info = await stat(resolved);
  assert(info.isFile(), 'Expected a static file.');
  const headers = {
    'Content-Type':
      contentTypes[path.extname(resolved).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'Accept-Ranges': 'bytes',
  };
  let start = 0;
  let end = info.size - 1;
  if (request.headers.range && statusCode === 200) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
    if (range && (range[1] || range[2])) {
      if (range[1]) {
        start = Number(range[1]);
        if (range[2]) end = Math.min(Number(range[2]), end);
      } else start = Math.max(0, info.size - Number(range[2]));
    } else start = -1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end) {
      response.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
      response.end();
      return;
    }
    statusCode = 206;
    headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length'] = String(Math.max(0, end - start + 1));
  response.writeHead(statusCode, headers);
  if (request.method === 'HEAD' || info.size === 0) response.end();
  else await pipeline(createReadStream(resolved, { start, end }), response);
}

async function startPreview() {
  const server = createServer((request, response) => {
    const serve = async () => {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end();
        return;
      }
      const url = new URL(request.url, 'http://127.0.0.1');
      let filename;
      try {
        filename = path.resolve(output, `.${decodeURIComponent(url.pathname)}`);
      } catch {
        response.writeHead(400);
        response.end();
        return;
      }
      if (!isWithinOutput(filename)) {
        response.writeHead(403);
        response.end();
        return;
      }
      let info;
      try {
        info = await stat(filename);
      } catch (error) {
        if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
      }
      if (info?.isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
          response.end();
          return;
        }
        filename = path.join(filename, 'index.html');
        try {
          info = await stat(filename);
        } catch (error) {
          if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
          info = undefined;
        }
      }
      if (info?.isFile()) await serveFile(request, response, filename);
      else await serveFile(request, response, path.join(output, '404.html'), 404);
    };
    serve().catch(() => {
      if (!response.headersSent) response.writeHead(500);
      response.end();
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    baseURL: `http://127.0.0.1:${server.address().port}`,
    stop: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  };
}

async function main() {
  for (const variable of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_INDEX_FILE',
    'GIT_COMMON_DIR',
    'GIT_NAMESPACE',
  ])
    assert(!process.env[variable], `Unset ${variable} before publishing from the source checkout.`);
  assert.equal(
    path.relative(root, await git(['rev-parse', '--show-toplevel'])),
    '',
    'Run from the source repository.',
  );
  await requireExpectedOrigin();
  const sourceHead = await requireCleanSource();
  await git(
    [
      'fetch',
      '--no-tags',
      'origin',
      'refs/heads/main:refs/remotes/origin/main',
      'refs/heads/gh-pages:refs/remotes/origin/gh-pages',
    ],
    { label: 'Fetch source and published branches; check GitHub access if this fails' },
  );
  assert.equal(
    sourceHead,
    await git(['rev-parse', '--verify', sourceRef]),
    'Source main must match origin/main.',
  );
  const publishedHead = await git(['rev-parse', '--verify', publishedRef]);
  const publishedTree = await git(['rev-parse', `${publishedHead}^{tree}`]);
  console.log(`Source commit: ${sourceHead}`);

  await run(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
    label: 'Production build',
  });
  await run(process.execPath, [path.join(root, 'tools/check-built-site.mjs')], {
    label: 'Static site validation',
  });

  const temporary = await mkdtemp(path.join(tmpdir(), 'pp-pages-publish-'));
  const index = path.join(temporary, 'index');
  try {
    const gitDirectory = await git(['rev-parse', '--absolute-git-dir']);
    const isolatedGit = (args) =>
      git(
        [
          `--git-dir=${gitDirectory}`,
          `--work-tree=${output}`,
          '-C',
          output,
          '-c',
          'core.autocrlf=false',
          '-c',
          'core.filemode=false',
          ...args,
        ],
        {
          env: { ...process.env, GIT_INDEX_FILE: index },
          label: 'Prepare isolated deployment tree',
        },
      );
    const captureTree = async () => {
      await isolatedGit(['read-tree', '--empty']);
      await isolatedGit(['add', '--force', '--all', '--', '.']);
      return isolatedGit(['write-tree']);
    };
    const testedTree = await captureTree();
    const preview = await startPreview();
    try {
      console.log(`Testing production output at ${preview.baseURL}`);
      await run(
        process.execPath,
        [path.join(root, 'node_modules/@playwright/test/cli.js'), 'test'],
        {
          env: { ...process.env, PLAYWRIGHT_BASE_URL: preview.baseURL },
          label: 'Production browser tests',
        },
      );
    } finally {
      await preview.stop();
    }
    assert.equal(await captureTree(), testedTree, 'Built files changed while tests were running.');
    await requireExpectedOrigin();
    await requireCleanSource(sourceHead);
    const remoteRefs = new Map(
      (await git(['ls-remote', '--exit-code', 'origin', 'refs/heads/main', 'refs/heads/gh-pages']))
        .split('\n')
        .map((line) => line.split(/\s+/).reverse()),
    );
    assert.equal(
      remoteRefs.get('refs/heads/main'),
      sourceHead,
      'Remote main changed; update source and retry.',
    );
    assert.equal(
      remoteRefs.get('refs/heads/gh-pages'),
      publishedHead,
      'Published branch changed; retry from its latest revision.',
    );
    if (testedTree === publishedTree) {
      console.log(
        `Published commit: ${publishedHead} (tested output is already current; no push needed).`,
      );
      return;
    }
    const deployment = await git([
      'commit-tree',
      testedTree,
      '-p',
      publishedHead,
      '-m',
      `Publish tested website from source ${sourceHead}`,
    ]);
    await git(['push', 'origin', `${deployment}:refs/heads/gh-pages`], {
      label: 'Publish gh-pages with a normal non-force push; retry if the remote changed',
    });
    console.log(`Published commit: ${deployment}`);
    console.log(
      'GitHub Pages will deploy the tested gh-pages branch. Verify the live domain after deployment.',
    );
  } finally {
    for (const filename of [index, `${index}.lock`]) {
      try {
        await unlink(filename);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    await rmdir(temporary);
  }
}

main().catch((error) => {
  console.error(`Publishing stopped: ${error.message}`);
  process.exitCode = 1;
});
