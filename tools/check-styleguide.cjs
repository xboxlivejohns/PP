// Pass the path to an installed Playwright package as the first argument.
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const failures = [];
      page.on('pageerror', error => failures.push(error.message));
      await page.goto('http://127.0.0.1:4173/styleguide/');
      await page.evaluate(() => document.fonts.ready);
      // Load lazy images before full-page capture.
      for (const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
      await page.evaluate(async () => { await Promise.all([...document.images].map(img => img.decode())); });
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex,nofollow');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Horizontal overflow');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('.button .section, .button .benefit, .button .note').count(), 0, 'Malformed button nesting');
      assert.equal(await page.locator('.button').evaluateAll(nodes => nodes.filter(n => n.getClientRects().length).every(n => n.getBoundingClientRect().height >= 48)), true, 'Small button target');
      await page.locator('#comparison').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#comparison').inputValue(), '51');
      await page.locator('.faq summary').first().click();
      assert.equal(await page.locator('.faq').first().getAttribute('open'), '');
      await page.locator('.faq summary').first().click();
      await page.locator('#name').fill('Preview');
      await page.locator('#vehicle').fill('Test vehicle');
      await page.locator('#postcode').fill('DL1 1AA');
      await page.locator('button[type=submit]').click();
      assert.match(await page.locator('#form-status').textContent(), /No enquiry or photos/);
      await page.locator('#preview-form').evaluate(form => form.reset());
      await page.locator('#form-status').evaluate(n => n.textContent = 'Preview only — nothing will be sent.');
      await page.locator('#comparison').fill('50');
      await page.locator('#comparison').dispatchEvent('input');
      await page.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
      await page.screenshot({ path: `review/showroom-noir-${width}.png`, fullPage: true });
      await page.screenshot({ path: `review/showroom-noir-${width}-hero.png` });
      assert.deepEqual(failures, []);
      console.log(`${width}px: no overflow or JS errors; images, tap targets, slider, FAQ and preview form passed.`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
