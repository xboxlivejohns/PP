import { createDetailingScene } from '/study/detailing-scene.js';

const header = document.querySelector('.site-header');
const lane = header.querySelector('[data-compact-progress]');
const actor = lane.querySelector('[data-detail-actor]');
const svg = actor.querySelector('svg');
const fill = header.querySelector('[data-detail-fill]');
const scene = createDetailingScene(actor);
const menu = header.querySelector('.menu-toggle');
const nav = header.querySelector('#main-nav');
const services = header.querySelector('[data-service-navigation]');
const collapsed = matchMedia('(max-width: 1199px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let queued = false;
let lastFrame = -1;
let previousCollapsed;

function draw() {
  queued = false;
  if (document.hidden) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = Math.max(0, Math.min(1, max > 0 ? scrollY / max : 0));
  fill.style.transform = `scaleX(${progress})`;
  const frame = reduced.matches ? 1 : Math.round(progress * 6000) / 6000;
  if (frame !== lastFrame) {
    scene.render(frame);
    lastFrame = frame;
  }
  lane.dataset.progress = progress.toFixed(4);
  lane.dataset.motion = reduced.matches ? 'reduced' : 'scroll';
}
function queue() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(draw);
  }
}
function closeMenu() {
  delete nav.dataset.studyOpen;
  menu.setAttribute('aria-expanded', 'false');
  nav.hidden = collapsed.matches;
}
function syncLayout() {
  menu.hidden = !collapsed.matches;
  if (previousCollapsed !== collapsed.matches) {
    closeMenu();
    if (services) services.open = collapsed.matches;
    previousCollapsed = collapsed.matches;
  } else {
    nav.hidden = collapsed.matches && !nav.hasAttribute('data-study-open');
  }
  svg.setAttribute('viewBox', '130 40 660 200');
  queue();
}
// Capture this study's menu button only, before the original site's narrower menu handler.
header.addEventListener(
  'click',
  (event) => {
    if (!event.target.closest('.menu-toggle')) return;
    event.stopImmediatePropagation();
    const open = menu.getAttribute('aria-expanded') === 'true';
    nav.hidden = open;
    nav.toggleAttribute('data-study-open', !open);
    menu.setAttribute('aria-expanded', String(!open));
  },
  true,
);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && collapsed.matches && nav.hasAttribute('data-study-open')) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (collapsed.matches && !header.contains(event.target)) closeMenu();
});
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', syncLayout);
addEventListener('pageshow', queue);
document.addEventListener('visibilitychange', queue);
reduced.addEventListener('change', queue);
document.fonts.ready.then(queue);
new ResizeObserver(queue).observe(document.body);
syncLayout();
