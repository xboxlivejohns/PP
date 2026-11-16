import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const failures = [];
let checks = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
    checks++;
  } catch (error) {
    failures.push(name);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
const external = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('request', (request) => {
  if (!request.url().startsWith('http://127.0.0.1:4333/')) external.push(request.url());
});
try {
  await page.goto('http://127.0.0.1:4333/');
  await page.waitForFunction(() => Boolean(window.detailPreview));
  await check('Reduced-motion preview starts paused', async () => {
    assert.equal(await page.evaluate(() => window.detailPreview.playing), false);
    assert.equal(await page.evaluate(() => window.detailPreview.progress), 0);
  });
  await check('Both scenes have unique SVG masks and gradients', async () => {
    assert.equal(await page.locator('[data-scene] svg').count(), 2);
    const ids = await page.locator('[id]').evaluateAll((els) => els.map((el) => el.id));
    assert.equal(new Set(ids).size, ids.length);
  });
  await check(
    'Foam builds, rinse clears it, mitt washes, towel dries and the finish appears',
    async () => {
      await page.getByRole('button', { name: 'Snow foam', exact: true }).click();
      assert.equal(await page.locator('body').getAttribute('data-stage'), 'foam');
      assert.ok(
        Number(await page.locator('.large-scene [data-foam-build]').getAttribute('width')) > 300,
      );
      assert.equal(
        (await page.locator('.large-scene [data-jet]').getAttribute('opacity')) === '0',
        false,
      );
      await page.getByRole('button', { name: 'Rinse', exact: true }).click();
      const partial = Number(
        await page.locator('.large-scene [data-foam-clear]').getAttribute('width'),
      );
      assert.ok(partial > 0 && partial < 480);
      await page.getByRole('button', { name: 'Wash', exact: true }).click();
      assert.equal(await page.locator('.large-scene [data-mitt]').getAttribute('opacity'), '1');
      assert.equal(await page.locator('.large-scene [data-bucket]').getAttribute('opacity'), '1');
      assert.equal(await page.locator('.large-scene [data-lance]').getAttribute('opacity'), '0');
      await page.getByRole('button', { name: 'Dry', exact: true }).click();
      assert.equal(await page.locator('.large-scene [data-towel]').getAttribute('opacity'), '1');
      assert.equal(await page.locator('.large-scene [data-mitt]').getAttribute('opacity'), '0');
      assert.equal(await page.locator('.large-scene [data-dirt]').getAttribute('opacity'), '0');
      await page.getByRole('button', { name: 'Finished', exact: true }).click();
      assert.equal(await page.locator('body').getAttribute('data-stage'), 'complete');
      assert.equal(await page.locator('.large-scene [data-foam-clear]').getAttribute('width'), '0');
      assert.equal(await page.locator('.large-scene [data-sparkles]').getAttribute('opacity'), '1');
    },
  );
  await check('Vacuum is recognisable and only works with the door open', async () => {
    await page.getByRole('button', { name: 'Vacuum', exact: true }).click();
    for (const name of ['vacuum', 'vac-nozzle', 'door'])
      assert.equal(
        await page.locator('.large-scene [data-' + name + ']').getAttribute('opacity'),
        '1',
      );
    await page.getByRole('button', { name: 'Snow foam', exact: true }).click();
    for (const name of ['vacuum', 'vac-nozzle', 'door'])
      assert.equal(
        await page.locator('.large-scene [data-' + name + ']').getAttribute('opacity'),
        '0',
      );
  });
  await check(
    'The sequence contains wash, rinse and dry, with no polishing or decontamination',
    async () => {
      const moments = [
        [0.1, 'vacuum'],
        [0.215, 'wheels'],
        [0.36, 'foam'],
        [0.44, 'rinse'],
        [0.56, 'wash'],
        [0.69, 'final-rinse'],
        [0.84, 'dry'],
        [1, 'complete'],
      ];
      for (const [p, id] of moments) {
        await page.evaluate((n) => window.detailPreview.seek(n), p);
        assert.equal(await page.locator('body').getAttribute('data-stage'), id);
      }
      assert.equal(
        await page.locator('[data-polisher],[data-pad],[data-decontamination]').count(),
        0,
      );
      assert.equal(await page.getByRole('button', { name: 'Polish', exact: true }).count(), 0);
    },
  );
  await check('Seeking backwards reconstructs initial dirt and foam state', async () => {
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    assert.equal(await page.evaluate(() => window.detailPreview.progress), 0);
    assert.equal(await page.locator('.large-scene [data-foam-build]').getAttribute('width'), '0');
    assert.equal(await page.locator('.large-scene [data-dirt]').getAttribute('opacity'), '0.65');
  });
  await check('Native range responds to keyboard and exposes stage text', async () => {
    const slider = page.getByRole('slider');
    await slider.focus();
    await slider.press('End');
    assert.match(await slider.getAttribute('aria-valuetext'), /100%, Clean & dry/);
    await slider.press('Home');
    assert.equal(await page.evaluate(() => window.detailPreview.progress), 0);
  });
  await check('Explicit playback advances, pause stops it, restart resets it', async () => {
    await page.getByRole('button', { name: 'Play preview', exact: true }).click();
    await page.waitForFunction(() => window.detailPreview.progress > 0.02);
    await page.getByRole('button', { name: 'Pause preview', exact: true }).click();
    const p = await page.evaluate(() => window.detailPreview.progress);
    await page.waitForTimeout(120);
    assert.equal(await page.evaluate(() => window.detailPreview.progress), p);
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    assert.equal(await page.evaluate(() => window.detailPreview.progress), 0);
  });
  await check(
    'Normal motion travels horizontally; real scrolling reaches both endpoints',
    async () => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.getByRole('checkbox').check();
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForFunction(() => window.detailPreview.progress > 0.995);
      const transform = await page
        .locator('.nav-actor')
        .evaluate((el) => getComputedStyle(el).transform);
      assert.ok(new DOMMatrixFallback(transform).x > 100);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForFunction(() => window.detailPreview.progress < 0.005);
      await page.getByRole('checkbox').uncheck();
    },
  );
  for (const width of [320, 390, 768, 1440]) {
    await check(`Layout and accessibility at ${width}px`, async () => {
      await page.setViewportSize({ width, height: 950 });
      await page.evaluate(() => window.detailPreview.seek(0.77));
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
      );
      const baseline = await page.locator('.nav-actor svg').evaluate((svg) => {
        const point = svg.createSVGPoint();
        point.x = 409;
        point.y = 240;
        const floor = point.matrixTransform(svg.getScreenCTM()).y;
        return Math.abs(floor - document.querySelector('.rail').getBoundingClientRect().top);
      });
      assert.ok(baseline < 1, 'Scene feet and wheels must sit directly on the navbar line');
      const result = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(
        result.violations.map((v) => `${v.id}: ${v.description}`),
        [],
      );
    });
  }
  await check('No external requests or browser errors', async () => {
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  });
  const hidden = await page.request.get('http://127.0.0.1:4333/../../src/data/business.js');
  await check('Preview server does not expose website files', async () =>
    assert.equal(hidden.status(), 404),
  );
} finally {
  await browser.close();
}
console.log(`\n${checks} checks passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;

function DOMMatrixFallback(value) {
  this.x = Number(value.match(/matrix\(([^)]+)\)/)?.[1].split(',')[4] || 0);
}
