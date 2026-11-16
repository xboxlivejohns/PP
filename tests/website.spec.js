import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { customerReviews, reviewSources } from '../src/data/reviews.js';
import { business } from '../src/data/business.js';

test('Area map is opt-in and location metadata uses confirmed business identities', async ({
  page,
  browser,
  baseURL,
}) => {
  const googleRequests = [];
  page.on('request', (request) => {
    if (/https:\/\/(?:[^/]+\.)?(?:google\.com|gstatic\.com|googleapis\.com)\//.test(request.url()))
      googleRequests.push(request.url());
  });
  await page.route('https://www.google.com/maps/d/embed?**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html lang="en"><title>Map test</title><body>Map test</body></html>',
    }),
  );
  await page.goto('/areas-covered/');
  const frame = page.locator('#darlington-map');
  await expect(frame).not.toHaveAttribute('src');
  expect(googleRequests).toEqual([]);
  await page.getByRole('button', { name: 'Load Google map' }).click();
  await expect(frame).toBeVisible();
  await expect(frame).toHaveAttribute('src', business.coverageMapEmbedUrl);
  await expect.poll(() => googleRequests.length).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Hide Google map' }).click();
  await expect(frame).toBeHidden();
  await expect(frame).not.toHaveAttribute('src');
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent)));
  const identity = schemas.find((schema) => schema['@type'] === 'AutomotiveBusiness');
  expect(identity.hasMap).toBe(business.googleMaps);
  expect(identity.sameAs).toEqual(business.socialProfiles);
  expect(identity.email).toBe(business.email);
  expect(identity.address).toBeUndefined();
  expect(identity.aggregateRating).toBeUndefined();
  expect(identity.description).toContain('18 miles');
  expect(
    schemas.some((schema) => schema['@graph']?.some((item) => item['@type'] === 'BreadcrumbList')),
  ).toBe(true);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://polishedpristinedetailing.co.uk/areas-covered/',
  );
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('/areas-covered/');
  await expect(
    plain.getByRole('link', { name: /Open the coverage map in Google Maps/ }),
  ).toBeVisible();
  await expect(plain.locator('#darlington-map')).not.toHaveAttribute('src');
  await context.close();
});

test('Coverage uses the owner-confirmed 18-mile area and is discoverable', async ({ page }) => {
  expect(business.coverageRadiusMiles).toBe(18);
  for (const route of ['/', '/about/', '/booking/', '/areas-covered/']) {
    await page.goto(route);
    await expect(page.locator('main')).not.toContainText(/(?:20|25)[ -]miles?/i);
    await expect(page.locator('.site-footer a[href="/areas-covered/"]')).toBeVisible();
  }
  await expect(page.locator('main')).toContainText('within 18 miles of Darlington');
  await expect(page.locator('main')).toContainText('Farther away? Get in touch');
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Enquire with your postcode' }).click();
  await expect(page).toHaveURL(/\/booking\/#postcode$/);
  await expect(page.locator('#postcode')).toBeVisible();
});

test('Main Services navigation exposes category pages on desktop and mobile', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    if (width < 761) await page.locator('.menu-toggle').click();
    const disclosure = navigation.locator('[data-service-navigation]');
    if (width >= 761) {
      await disclosure.locator('summary').focus();
      await page.keyboard.press('Enter');
    }
    for (const destination of [
      '/services/',
      '/valeting/',
      '/paint-correction/',
      '/ceramic-coating/',
    ]) {
      await expect(disclosure.locator(`a[href="${destination}"]`)).toBeVisible();
    }
    if (width >= 761) {
      await page.keyboard.press('Escape');
      await expect(disclosure).not.toHaveAttribute('open');
      await expect(disclosure.locator('summary')).toBeFocused();
      await disclosure.locator('summary').click();
    }
    await expect(navigation.locator(':scope > a[href="/ceramic-coating/"]')).toHaveCount(0);
    await disclosure.getByRole('link', { name: /^Valeting & interior cleaning/ }).click();
    await expect(page).toHaveURL(/\/valeting\/$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('Customer quotes retain their wording, sources and supported service matches', async ({
  page,
}) => {
  await page.goto('/reviews/');
  await expect(page.locator('main .customer-review')).toHaveCount(customerReviews.length);
  for (const review of customerReviews) {
    const quote = page.locator(`main [data-review-id="${review.id}"]`);
    await expect(quote.locator('blockquote')).toHaveText(review.quote);
    await expect(quote.locator('a')).toHaveAttribute('href', review.href);
    if (review.date) await expect(quote.locator('time')).toHaveAttribute('datetime', review.date);
    await expect(quote.locator('blockquote q')).toHaveText(review.quote);
    await expect(quote.locator('blockquote p')).toHaveCSS('font-style', 'italic');
  }
  await page.goto('/services/');
  for (const review of customerReviews.filter((review) => review.serviceId || review.groupId)) {
    const section = page.locator(`#${review.serviceId || review.groupId}`);
    await expect(section.locator(`[data-review-id="${review.id}"]`)).toHaveCount(1);
  }
  for (const id of ['paint-correction', 'headlight-restoration', 'ppf']) {
    await expect(page.locator(`#${id} .customer-review`)).toHaveCount(0);
  }
  await page.goto('/ceramic-coating/');
  await expect(page.locator('[data-review-id="ian-coating"]')).toHaveCount(0);
  await expect(page.locator('main .customer-review')).toHaveCount(0);
  const googleReviews = page.locator('.site-footer').getByRole('link', { name: /^Google/ });
  await expect(googleReviews).toBeVisible();
  await expect(googleReviews).toHaveAttribute(
    'href',
    reviewSources.find((source) => source.id === 'google').href,
  );
});

test('Ceramic coating keeps package information together and every quote route selects the service', async ({
  page,
}) => {
  const data = JSON.parse(await readFile('content/services.json', 'utf8'));
  const service = data.services.find((item) => item.id === 'ceramic-coating');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ceramic-coating/');

  const details = page.locator('.coating-details');
  for (const text of [
    service.product,
    service.price.display,
    service.duration,
    service.deposit.description,
    ...service.includes,
    ...service.booking_notes,
  ]) {
    await expect(details).toContainText(text);
  }
  await expect(page.locator('.coating-bmw-collage img')).toBeVisible();
  const film = page.locator('.coating-bmw-collage video');
  await expect(film).toBeVisible();
  await expect(film.locator('source')).toHaveAttribute('src', '/media/bmw-finish.mp4');
  await expect(film).not.toHaveAttribute('autoplay');
  await expect(page.getByRole('button', { name: 'Play the BMW finish video' })).toBeVisible();
  const questions = page.locator('.faq-section summary');
  await expect(questions).toHaveCount(3);
  await expect(questions).toContainText([
    'Does ceramic coating remove scratches?',
    'Is my car still going to need washing?',
    'Can you apply a coating at my home?',
  ]);

  for (const [width, selector] of [
    [1440, '.coating-hero .button'],
    [1440, '.coating-bmw-story .button'],
    [1440, '.coating-details .button'],
    [1440, '.cta-section .button'],
    [1440, '.site-header nav > a.button'],
    [390, '.mobile-contact a[href*="/booking/"]'],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ceramic-coating/');
    await page.locator(selector).click();
    await expect(page).toHaveURL(/\/booking\/\?service=ceramic-coating$/);
    await expect(page.getByLabel('What can we help with?')).toHaveValue(service.id);
  }
});

test('Narrow phones, tablet and landscape layouts keep content within the viewport', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of [
      '/',
      '/services/',
      '/valeting/',
      '/paint-correction/',
      '/gallery/',
      '/reviews/',
      '/booking/',
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${viewport.width}`,
      ).toBeTruthy();
      if (route === '/services/') {
        expect(
          await page
            .locator('.service-group')
            .evaluateAll((groups) =>
              groups.every(
                (group) =>
                  group.querySelector('.service-entries').getBoundingClientRect().bottom <=
                  group.getBoundingClientRect().bottom + 1,
              ),
            ),
          `Service content stays inside its section at ${viewport.width}`,
        ).toBeTruthy();
      }
    }
  }
});
const routes = [
  '/',
  '/services/',
  '/valeting/',
  '/paint-correction/',
  '/ceramic-coating/',
  '/gallery/',
  '/reviews/',
  '/about/',
  '/areas-covered/',
  '/booking/',
  '/privacy/',
];

for (const width of [390, 1440]) {
  test(`All pages render, load media and pass accessibility checks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of routes) {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(async () => {
        for (const image of document.images) {
          if (!image.closest('dialog')) image.loading = 'eager';
        }
        await Promise.all(
          [...document.images]
            .filter((i) => !i.closest('dialog'))
            .map((i) => i.decode().catch(() => {})),
        );
        await document.fonts.ready;
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Overflow at ${path}`,
      ).toBeTruthy();
      expect(
        await page
          .locator('main img:not(dialog img)')
          .evaluateAll((images) => images.every((i) => i.complete && i.naturalWidth > 0)),
        `Broken media at ${path}`,
      ).toBeTruthy();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const a11y = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        a11y.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        `Accessibility at ${path}`,
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test('Category pages use approved prices, preserve service enquiries and work without motion', async ({
  page,
  browser,
  baseURL,
}) => {
  const data = JSON.parse(await readFile('content/services.json', 'utf8'));
  const categories = [
    { route: '/valeting/', ids: ['essential-clean', 'full-valet', 'interior-deep-clean'] },
    { route: '/paint-correction/', ids: ['paint-enhancement', 'paint-correction'] },
  ];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const category of categories) {
    await page.goto(category.route);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.category-option')).toHaveCount(category.ids.length);
    for (const id of category.ids) {
      const service = data.services.find((s) => s.id === id);
      const entry = page.locator(`article#${id}`);
      await expect(entry).toContainText(service.price.display);
      await entry.locator('summary').click();
      for (const item of service.includes) await expect(entry).toContainText(item);
      await entry.locator('a').click();
      await expect(page.locator('#service')).toHaveValue(id);
      await page.goto(category.route);
    }
    await page.setViewportSize({ width: 640, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto('/');
  for (const category of categories)
    await expect(page.locator(`.pathway-photo[href="${category.route}"]`)).toHaveCount(1);
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const plain = await context.newPage();
  for (const category of categories) {
    await plain.goto(category.route);
    await expect(plain.locator('main h1')).toBeVisible();
    await plain.locator('.category-option summary').first().click();
    await expect(plain.locator('.category-option ul').first()).toBeVisible();
  }
  await context.close();
});

test('Approved service prices and inclusions are in the static page', async ({ page }) => {
  const data = JSON.parse(await readFile('content/services.json', 'utf8'));
  await page.goto('/services/');
  for (const service of data.services) {
    const entry = page.locator(`article#${service.id}`);
    await expect(entry).toContainText(service.price.display);
    if (service.includes.length) {
      await entry.locator('summary').click();
      for (const item of service.includes) await expect(entry).toContainText(item);
    }
    await expect(entry.locator('a').first()).toHaveAttribute(
      'href',
      `/booking/?service=${service.id}`,
    );
  }
});

test('Quote validates input, preserves service and prepares correct WhatsApp and email routes', async ({
  page,
}) => {
  await page.goto('/booking/?service=ceramic-coating');
  await expect(page.locator('#service')).toHaveValue('ceramic-coating');
  await page.getByRole('button', { name: 'Prepare WhatsApp message' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name-error')).not.toBeEmpty();
  await page.getByLabel('Your name').fill('Alex & Sam');
  await page.getByLabel('Your postcode').fill('not a postcode');
  await page.getByLabel('Your vehicle').fill('BMW 320i 2022');
  await page.getByRole('button', { name: 'Prepare WhatsApp message' }).click();
  await expect(page.locator('#postcode')).toBeFocused();
  await page.getByLabel('Your postcode').fill('DL1 1AA');
  await page.getByLabel('Anything else?').fill('Light swirls & interior care, please.');
  await page.getByRole('button', { name: 'Prepare WhatsApp message' }).click();
  const target = new URL(await page.locator('#send-message').getAttribute('href'));
  expect(target.hostname).toBe('wa.me');
  expect(target.pathname).toBe('/447468286651');
  expect(target.searchParams.get('text')).toContain('Alex & Sam');
  expect(target.searchParams.get('text')).toContain('3-year Ceramic Coating');
  expect(target.searchParams.get('text')).toContain('Light swirls & interior care');
  await expect(page.locator('#quote-status')).toContainText('not been sent');
  await page.getByRole('button', { name: 'Prepare an email instead' }).click();
  expect(await page.locator('#send-message').getAttribute('href')).toContain(
    'mailto:polishedpristinemobile@gmail.com?',
  );
  const email = new URL(await page.locator('#send-message').getAttribute('href'));
  expect(email.searchParams.get('body')).toContain('Alex & Sam');
  expect(email.searchParams.get('body')).toContain('Light swirls & interior care');
  await page.getByLabel('Your vehicle').fill('Volvo XC60 2024');
  await expect(page.locator('#quote-result')).toBeHidden();
  await expect(page.locator('#quote-status')).toBeEmpty();
  await page.getByRole('button', { name: 'Prepare WhatsApp message' }).click();
  await expect(page.locator('#message-preview')).toContainText('Volvo XC60 2024');
  await expect(page.locator('#message-preview')).not.toContainText('BMW 320i 2022');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  await page.goto('/booking/?service=unrecognised-service');
  await expect(page.locator('#service')).toHaveValue('not-sure');
});

test('Mobile menu, gallery filters, history and lightbox support keyboard use', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  const totalCount = await page.locator('.gallery-item').count();
  const interiorCount = await page.locator('.gallery-item[data-category="interiors"]').count();
  expect(interiorCount).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Interiors', exact: true }).click();
  await expect(page.locator('.gallery-item:visible')).toHaveCount(interiorCount);
  await expect(page.locator('#gallery-count')).toContainText(String(interiorCount));
  await expect(page).toHaveURL(/filter=interiors/);
  const photo = page.locator('.gallery-item:visible .gallery-open').first();
  await photo.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gallery-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(photo).toBeFocused();
  await page.goBack();
  await expect(page.locator('.gallery-item:visible')).toHaveCount(totalCount);
});

test('Content, service disclosures and contact routes work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.goto('/services/');
  const entry = page.locator('#ceramic-coating');
  await entry.locator('summary').click();
  await expect(entry.locator('ul')).toBeVisible();
  await page.goto('/booking/');
  await expect(
    page.locator('.contact-options').getByRole('link', { name: /Message on WhatsApp/ }),
  ).toBeVisible();
  await expect(page.locator('noscript')).toBeVisible();
  await context.close();
});

test('Internal links and media destinations resolve in the static build', async ({
  page,
  request,
}) => {
  const targets = new Set();
  for (const route of routes) {
    await page.goto(route);
    const links = await page
      .locator('a[href]')
      .evaluateAll((els) =>
        els.map((a) => a.getAttribute('href')).filter((h) => h.startsWith('/')),
      );
    links.forEach((link) => targets.add(link.split('#')[0]));
  }
  for (const target of targets) expect((await request.get(target)).status(), target).toBe(200);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
});

test('Silent gallery video plays on demand and does not autoplay', async ({ page }) => {
  await page.goto('/gallery/');
  const video = page.locator('video');
  await expect(video).not.toHaveAttribute('autoplay');
  await video.evaluate(async (v) => {
    v.muted = true;
    await v.play();
  });
  await expect.poll(() => video.evaluate((v) => v.currentTime)).toBeGreaterThan(0.2);
  expect(await video.evaluate((v) => v.videoWidth)).toBe(720);
});

test('Finish preview respects reduced motion, pause controls and visibility; work track has button controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const video = page.locator('.finish-loop');
  expect(await video.evaluate((v) => v.paused)).toBe(true);
  await expect(video).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play finish preview' }).click();
  await expect.poll(() => video.evaluate((v) => v.currentTime)).toBeGreaterThan(0.1);
  await page.getByRole('button', { name: 'Pause finish preview' }).click();
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await page.getByRole('button', { name: 'Play finish preview' }).click();
  await page.locator('.work-story').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  const track = page.locator('.work-track');
  const before = await track.evaluate((el) => el.scrollLeft);
  await page.getByRole('button', { name: 'Next work photograph' }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before + 100);
});

test('A long mobile enquiry keeps its focused send action clear of fixed navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/booking/');
  await page.getByLabel('Your name').fill('Alex');
  await page.getByLabel('Your postcode').fill('DL1 1AA');
  await page.getByLabel('Your vehicle').fill('Porsche 911');
  await page
    .getByLabel('Anything else?')
    .fill('I would like to discuss the paintwork and interior. '.repeat(22));
  await page.getByRole('button', { name: 'Prepare WhatsApp message' }).click();
  const link = page.locator('#send-message');
  await expect(link).toBeFocused();
  const position = await link.boundingBox();
  expect(position.y).toBeGreaterThan(98);
  expect(position.y + position.height).toBeLessThan(844 - 55);
});

test('Mobile opening shows finished work early and keeps the quote action within the first screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const photo = await page.locator('.hero-art').boundingBox();
  expect(photo.y).toBeLessThan(400);
  expect(photo.height).toBeGreaterThan(200);
  const quote = page
    .locator('.hero-actions')
    .getByRole('link', { name: 'Get a quote', exact: true });
  const action = await quote.boundingBox();
  expect(action.y + action.height).toBeLessThan(812 - 55);
  expect(
    await page
      .locator('.hero-stance p')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});
