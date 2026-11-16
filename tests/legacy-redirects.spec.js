import { test, expect } from '@playwright/test';
import { legacyRedirects } from '../src/data/legacy-redirects.js';

test('Existing index.html URLs serve the replacement pages directly', async ({ request }) => {
  for (const route of ['/', '/services/', '/gallery/', '/booking/', '/ceramic-coating/']) {
    const response = await request.get(`${route}index.html`);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html, route).toContain(
      `rel="canonical" href="https://polishedpristinedetailing.co.uk${route}"`,
    );
    expect(html, route).toContain('<header class="site-header"');
  }
});

test('Legacy filenames have static HTML fallbacks and canonical destinations', async ({
  request,
}) => {
  for (const redirect of legacyRedirects) {
    const response = await request.get(`/${redirect.path}`);
    expect(response.status(), redirect.path).toBe(200);
    expect(response.headers()['content-type'], redirect.path).toContain('text/html');
    const html = await response.text();
    const canonical = new URL(redirect.target, 'https://polishedpristinedetailing.co.uk');
    canonical.hash = '';
    expect(html, redirect.path).toContain(`rel="canonical" href="${canonical.href}"`);
    expect(html, redirect.path).toContain('content="noindex, follow"');
    expect(html, redirect.path).toContain(`content="0; url=${redirect.target}"`);
    expect(html, redirect.path).toContain(`<a href="${redirect.target}">`);
  }
});

test('Old booking links retain the selected service, query string and fragment', async ({
  page,
}) => {
  await page.goto('/booking.html?service=ceramic-coating&source=old-link#quote-form');
  await expect(page).toHaveURL(/\/booking\/\?service=ceramic-coating&source=old-link#quote-form$/);
  await expect(page.locator('#quote-form')).toBeVisible();
  await expect(page.locator('#service')).toHaveValue('ceramic-coating');
});

test('Old protection links send PPF enquiries to the relevant service', async ({ page }) => {
  await page.goto('/protection/?source=old-link#ppf');
  await expect(page).toHaveURL(/\/services\/\?source=old-link#ppf$/);
  await expect(page.locator('#ppf')).toBeInViewport();
});

test('A cold direct service fragment reaches its target after animation setup', async ({
  page,
}) => {
  await page.goto('/services/#ppf');
  await expect(page.locator('#ppf')).toBeInViewport();
});

test('Historical maintenance sections reach the current maintenance service', async ({ page }) => {
  await page.goto('/maintenance/#schedule');
  await expect(page).toHaveURL(/\/valeting\/#maintenance-plans$/);
  await expect(page.locator('#maintenance-plans')).toBeInViewport();
});

test('Old service category anchors work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const aliases = {
      'clean-maintain': 'valeting',
      'restore-refine': 'paintwork',
      'protect-preserve': 'protection',
      'specialist-care': 'specialist',
    };
    for (const [oldId, currentId] of Object.entries(aliases)) {
      // Each saved customer URL starts a fresh navigation. Reusing a document
      // would overlap the previous native smooth scroll with the next fragment.
      const page = await context.newPage();
      try {
        await page.goto(`/services/#${oldId}`);
        const target = page.locator(`#${currentId} #${oldId}`);
        await expect(target).toHaveCount(1);
        await expect(target).toBeInViewport();
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
  }
});

test('Live-linked homepage and coating fragments remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  try {
    await page.goto('/#services-intro');
    await expect(page.locator('#the-detail #services-intro')).toBeInViewport();
    await page.goto('/ceramic-coating/#real-results');
    await expect(page.locator('#real-results')).toBeInViewport();
    await page.goto('/booking/#top');
    await expect(page.locator('header#top')).toBeInViewport();
  } finally {
    await context.close();
  }
});
