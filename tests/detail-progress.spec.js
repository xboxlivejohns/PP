import { test, expect } from '@playwright/test';

async function ready(page, route = '/paint-correction/') {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  await expect(page.locator('[data-detail-progress]')).toHaveAttribute('data-motion', 'scroll');
  await page.evaluate(() => document.fonts.ready);
}

async function scrollToFraction(page, progress) {
  await page.evaluate((p) => {
    window.scrollTo({
      top: (document.documentElement.scrollHeight - innerHeight) * p,
      behavior: 'instant',
    });
  }, progress);
  await expect
    .poll(async () =>
      Number(await page.locator('[data-detail-progress]').getAttribute('data-progress')),
    )
    .toBeCloseTo(progress, 2);
}

async function geometry(page) {
  return page.evaluate(() => {
    const header = document.querySelector('.site-header').getBoundingClientRect();
    const lane = document.querySelector('[data-detail-progress]').getBoundingClientRect();
    const actor = document.querySelector('[data-detail-actor]').getBoundingClientRect();
    const svg = document.querySelector('[data-detail-actor] svg');
    const floor = document.querySelector('.header-detail-rail').getBoundingClientRect().top;
    const ground = new DOMPoint(409, 240).matrixTransform(svg.getScreenCTM()).y;
    return {
      header: { top: header.top, bottom: header.bottom, right: header.right, height: header.height },
      lane: { top: lane.top, bottom: lane.bottom, left: lane.left, right: lane.right },
      actor: { left: actor.left, right: actor.right, top: actor.top },
      floor,
      ground,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
}

test('Navbar progress follows every cleaning stage, reverses and stays still without scrolling', async ({
  page,
}) => {
  await ready(page);
  const actor = page.locator('[data-detail-actor]');
  for (const [progress, stage] of [
    [0, 'ready'],
    [0.1, 'vacuum'],
    [0.215, 'wheels'],
    [0.36, 'foam'],
    [0.44, 'rinse'],
    [0.56, 'wash'],
    [0.69, 'final-rinse'],
    [0.84, 'dry'],
    [1, 'complete'],
    [0, 'ready'],
  ]) {
    await scrollToFraction(page, progress);
    await expect(actor).toHaveAttribute('data-stage', stage);
    const g = await geometry(page);
    expect(Math.abs(g.ground - g.floor)).toBeLessThan(0.1);
    expect(g.actor.left).toBeGreaterThanOrEqual(g.lane.left - 0.1);
    expect(g.actor.right).toBeLessThanOrEqual(g.lane.right + 0.1);
    expect(g.header.height).toBeLessThanOrEqual(120);
    expect(g.overflow).toBe(false);
  }
  await expect(actor.locator('[data-dirt]')).toHaveAttribute('opacity', '0.65');
  const still = await actor.innerHTML();
  await page.waitForTimeout(200);
  expect(await actor.innerHTML()).toBe(still);
});

test('Scene resizes inside the header without interfering with desktop and mobile menus', async ({
  page,
}) => {
  await ready(page, '/');
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 640, height: 900 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await scrollToFraction(page, 0.56);
    await expect(page.locator('[data-detail-actor]')).toHaveAttribute('data-stage', 'wash');
    const g = await geometry(page);
    expect(g.overflow).toBe(false);
    expect(Math.abs(g.floor - g.ground)).toBeLessThan(0.1);
    expect(g.actor.right).toBeLessThanOrEqual(g.lane.right + 0.1);
    expect(g.actor.top).toBeGreaterThanOrEqual(g.lane.top - 0.1);
    const nav = page.locator('#main-nav');
    if (viewport.width <= 760) {
      await page.locator('.menu-toggle').click();
      await expect(nav).toBeVisible();
      const expanded = await geometry(page);
      expect(expanded.floor).toBeCloseTo(g.floor, 1);
      expect((await nav.boundingBox()).y).toBeGreaterThan(g.header.bottom);
      await page.keyboard.press('Escape');
      await expect(nav).toBeHidden();
    } else {
      const navBounds = await nav.boundingBox();
      expect(navBounds.x + navBounds.width).toBeLessThanOrEqual(g.header.right - 8);
      await nav.locator('[data-service-navigation] summary').click();
      const link = nav.locator('a[href="/ceramic-coating/"]');
      await expect(link).toBeVisible();
      const position = await link.boundingBox();
      expect(position.y).toBeGreaterThan(g.header.bottom);
      await page.keyboard.press('Escape');
    }
    const sceneX = (await page.locator('[data-detail-actor]').boundingBox()).x;
    await scrollToFraction(page, 1);
    const end = await geometry(page);
    if (viewport.width <= 760) {
      expect(end.actor.left).toBeCloseTo(sceneX, 1);
      expect(await page.locator('[data-detail-actor] [data-person]').evaluate(el => getComputedStyle(el).display)).not.toBe('none');
      expect(await page.locator('[data-detail-actor] svg').getAttribute('viewBox')).toBe('130 40 660 200');
    } else {
      expect(Math.abs(end.actor.right - end.lane.right)).toBeLessThan(0.2);
    }
  }
});

test('Reduced motion keeps a stationary clean car while the simple progress line still updates', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/services/');
  const lane = page.locator('[data-detail-progress]');
  const actor = page.locator('[data-detail-actor]');
  await expect(lane).toHaveAttribute('data-motion', 'reduced');
  await expect(actor).toHaveAttribute('data-stage', 'complete');
  const initial = await actor.innerHTML();
  const x = (await actor.boundingBox()).x;
  await scrollToFraction(page, 0.56);
  expect((await actor.boundingBox()).x).toBeCloseTo(x, 1);
  expect(await actor.innerHTML()).toBe(initial);
  const scale = await page
    .locator('[data-detail-fill]')
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
  expect(scale).toBeCloseTo(0.56, 2);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(lane).toHaveAttribute('data-motion', 'scroll');
  await expect(actor).toHaveAttribute('data-stage', 'wash');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(actor).toHaveAttribute('data-stage', 'complete');
});

test('Mitt and towel remain on the body panel and walking soles do not cross the ground', async ({
  page,
}) => {
  await ready(page);
  for (const progress of [
    0.036, 0.039, 0.043, 0.172, 0.175, 0.18, 0.263, 0.267, 0.503, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62,
    0.645, 0.65, 0.654, 0.735, 0.74, 0.766, 0.79, 0.82, 0.85, 0.88, 0.91, 0.938, 0.945,
  ]) {
    await scrollToFraction(page, progress);
    const result = await page.locator('[data-detail-actor] svg').evaluate((svg) => {
      const inverse = svg.getScreenCTM().inverse();
      const world = (el, x, y) =>
        new DOMPoint(x, y).matrixTransform(el.getScreenCTM()).matrixTransform(inverse);
      const hand = svg.querySelector('[data-hand]');
      const contact = world(hand, Number(hand.getAttribute('cx')), Number(hand.getAttribute('cy')));
      const feet = [
        [
          'back',
          [
            [187, 240],
            [211, 240],
          ],
        ],
        [
          'front',
          [
            [236, 240],
            [263, 240],
          ],
        ],
      ].flatMap(([side, points]) =>
        points.map(([x, y]) => world(svg.querySelector(`[data-leg-${side}]`), x, y).y),
      );
      return {
        x: contact.x,
        y: contact.y,
        maxSole: Math.max(...feet),
        tool: ['mitt', 'towel'].some(
          (name) => svg.querySelector(`[data-${name}]`).getAttribute('opacity') === '1',
        ),
      };
    });
    expect(result.maxSole).toBeLessThanOrEqual(240.03);
    expect(result.maxSole).toBeGreaterThanOrEqual(239.97);
    if (result.tool) {
      expect(result.x).toBeGreaterThanOrEqual(436);
      expect(result.x).toBeLessThanOrEqual(462);
      expect(result.y).toBeGreaterThanOrEqual(146);
      expect(result.y).toBeLessThanOrEqual(154);
    }
  }
});
