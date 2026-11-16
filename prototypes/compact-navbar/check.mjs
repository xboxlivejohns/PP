import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4335' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let checks = 0;
async function check(name, action) {
  await action();
  console.log(`PASS ${++checks}: ${name}`);
}
async function scrollTo(progress) {
  await page.evaluate(
    (p) =>
      window.scrollTo({
        top: (document.documentElement.scrollHeight - innerHeight) * p,
        behavior: 'instant',
      }),
    progress,
  );
  await page.waitForFunction(
    (p) =>
      Math.abs(Number(document.querySelector('[data-compact-progress]').dataset.progress) - p) <
      0.003,
    progress,
  );
}
try {
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1199, height: 900 },
    { width: 1200, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await check(
      `Compact dimensions, grounded scene and functional menus at ${viewport.width}px`,
      async () => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForSelector('[data-compact-progress][data-motion]');
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => {
          const header = document.querySelector('.site-header').getBoundingClientRect();
          const brand = document.querySelector('.site-header .brand').getBoundingClientRect();
          const actor = document.querySelector('[data-detail-actor]').getBoundingClientRect();
          const svg = document.querySelector('[data-detail-actor] svg');
          const rail = document
            .querySelector('.site-header > .header-detail-rail')
            .getBoundingClientRect();
          const ground = new DOMPoint(409, 240).matrixTransform(svg.getScreenCTM()).y;
          return {
            height: header.height,
            overlap: actor.left < brand.right,
            ground,
            floor: rail.top,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        assert.equal(geometry.height, viewport.width <= 760 ? 72 : 82);
        assert.equal(geometry.overlap, false);
        assert.equal(geometry.overflow, false);
        assert.ok(Math.abs(geometry.ground - geometry.floor) < 0.1);
        const nav = page.locator('#main-nav');
        if (viewport.width < 1200) {
          await page.locator('.menu-toggle').click();
          assert.equal(await nav.isVisible(), true);
          assert.equal((await page.locator('.site-header').boundingBox()).height, geometry.height);
          // Changing height alone must not shut the menu (mobile browser chrome).
          await page.setViewportSize({ ...viewport, height: viewport.height - 20 });
          assert.equal(await nav.isVisible(), true);
        } else await nav.locator('[data-service-navigation] summary').click();
        const coating = nav.locator('a[href="/ceramic-coating/"]');
        assert.equal(await coating.isVisible(), true);
        await coating.click();
        assert.ok(page.url().endsWith('/ceramic-coating/'));
        await page.goto('/');
        await page.waitForSelector('[data-compact-progress][data-motion]');
      },
    );
  }
  await check('Stationary scene changes cleaning stages and reverses with scrolling', async () => {
    const actor = page.locator('[data-detail-actor]');
    const initialX = (await actor.boundingBox()).x;
    for (const [progress, stage] of [
      [0.1, 'vacuum'],
      [0.36, 'foam'],
      [0.56, 'wash'],
      [0.84, 'dry'],
      [1, 'complete'],
      [0, 'ready'],
    ]) {
      await scrollTo(progress);
      assert.equal(await actor.getAttribute('data-stage'), stage);
      assert.ok(Math.abs((await actor.boundingBox()).x - initialX) < 0.1);
    }
  });
  await check(
    'Reduced motion leaves a clean stationary car and a working progress line',
    async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(
        () => document.querySelector('[data-compact-progress]').dataset.motion === 'reduced',
      );
      const before = await page.locator('[data-detail-actor]').innerHTML();
      await scrollTo(0.56);
      assert.equal(
        await page.locator('[data-detail-actor]').getAttribute('data-stage'),
        'complete',
      );
      assert.equal(await page.locator('[data-detail-actor]').innerHTML(), before);
      const scale = await page
        .locator('[data-detail-fill]')
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
      assert.ok(Math.abs(scale - 0.56) < 0.003);
    },
  );
  await check('Header accessibility at phone, tablet and desktop widths', async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForSelector('[data-compact-progress][data-motion]');
      if (width < 1200) await page.locator('.menu-toggle').click();
      else await page.locator('[data-service-navigation] summary').click();
      const result = await new AxeBuilder({ page })
        .include('.site-header')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      assert.deepEqual(
        result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        [],
      );
      await page.keyboard.press('Escape');
    }
  });
  await check('No-JS fallback remains navigable; the main website is unchanged', async () => {
    const plain = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    const p = await plain.newPage();
    await p.goto('http://127.0.0.1:4335/');
    assert.equal(await p.locator('#main-nav').isVisible(), true);
    assert.equal(await p.locator('[data-compact-progress]').isVisible(), false);
    await plain.close();
    const live = await context.request.get('http://127.0.0.1:4321/');
    const html = await live.text();
    assert.ok(html.includes('data-detail-progress'));
    assert.ok(!html.includes('data-compact-progress'));
    assert.ok(!html.includes('/study/app.js'));
    assert.equal((await context.request.get('/src/scripts/site.js')).status(), 404);
  });
  assert.deepEqual(errors, []);
  console.log(`\n${checks} checks passed; no browser errors. Main site remains at port 4321.`);
} finally {
  await browser.close();
}
