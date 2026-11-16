import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { business } from '../data/business';

// The base HTML remains navigable and legible if JavaScript is unavailable.
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const serviceNavigation = document.querySelector('[data-service-navigation]');
const mobile = matchMedia('(max-width: 760px)');
header.classList.add('is-enhanced');
function syncMenu() {
  menu.hidden = !mobile.matches;
  nav.hidden = mobile.matches;
  menu.setAttribute('aria-expanded', 'false');
  if (serviceNavigation) serviceNavigation.open = false;
}
syncMenu();
mobile.addEventListener('change', syncMenu);
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.hidden = open;
  if (serviceNavigation) serviceNavigation.open = false;
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobile.matches && serviceNavigation?.open) {
    serviceNavigation.open = false;
    serviceNavigation.querySelector('summary').focus();
  }
  if (e.key === 'Escape' && mobile.matches && !nav.hidden) {
    syncMenu();
    menu.focus();
  }
});
document.addEventListener('click', (e) => {
  if (!mobile.matches && serviceNavigation && !serviceNavigation.contains(e.target)) {
    serviceNavigation.open = false;
  }
  if (mobile.matches && !nav.hidden && !header.contains(e.target)) syncMenu();
});
gsap.registerPlugin(ScrollTrigger);
const motion = gsap.matchMedia();
// Category facts remain readable; only the supporting accent moves once.
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const fact = document.querySelector('[data-category-fact]');
  if (fact) {
    gsap.from(fact.querySelector('.category-fact-accent'), {
      x: -24,
      duration: 0.45,
      ease: 'power2.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: fact, start: 'top 80%', once: true },
    });
  }
});
motion.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
  const process = document.querySelector('[data-paint-process]');
  if (process) {
    gsap.fromTo(
      process.querySelector('.category-process-line span'),
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: process, start: 'top 75%', end: 'center 45%', scrub: 0.3 },
      },
    );
  }
});
motion.add('(prefers-reduced-motion: no-preference)', () => {
  if (document.querySelector('.hero-stage')) {
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrance
      .from('.hero-art', { scale: 1.075, duration: 1.7 }, 0)
      .from(
        '.title-mask > span',
        { yPercent: 110, duration: 1.1, stagger: 0.12, clearProps: 'transform' },
        0.12,
      )
      .from(
        '.hero-topline, .hero-stance, .hero-actions',
        { opacity: 0, y: 12, duration: 0.65, stagger: 0.1, clearProps: 'all' },
        0.7,
      )
      .from('.hero-film', { opacity: 0, y: 18, duration: 0.75, clearProps: 'all' }, 0.9);
  }
  // One layered photographic moment responds to the scroll, without taking it over.
  if (document.querySelector('.coating-collage')) {
    gsap.fromTo(
      '.coating-detail-image',
      { y: 24 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.coating-collage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      },
    );
  }
  if (document.querySelector('.gallery-hero-art')) {
    gsap.from('.gallery-hero-main, .gallery-hero-inset', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.16,
      ease: 'power3.out',
      clearProps: 'all',
    });
  }
});
const fontsReady = document.fonts.ready.then(() => ScrollTrigger.refresh());
const initialFragment = location.hash;
if (initialFragment && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') {
  let interacted = false;
  const inputEvents = ['pointerdown', 'wheel', 'touchstart', 'keydown'];
  const cancelRestore = () => {
    interacted = true;
  };
  inputEvents.forEach((type) =>
    addEventListener(type, cancelRestore, { passive: true, once: true }),
  );
  const pageLoaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => addEventListener('load', resolve, { once: true }));
  Promise.all([fontsReady, pageLoaded]).then(() =>
    requestAnimationFrame(() => {
      inputEvents.forEach((type) => removeEventListener(type, cancelRestore));
      if (interacted || location.hash !== initialFragment) return;
      let targetId;
      try {
        targetId = decodeURIComponent(initialFragment.slice(1));
      } catch {
        return;
      }
      // Startup refreshes can cancel the browser's smooth fragment scroll. Restore
      // the initial link once layout is ready, without moving a reader who interacted.
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      ScrollTrigger.update();
    }),
  );
}

const workTrack = document.querySelector('.work-track');
if (workTrack) {
  document.querySelector('.track-controls').hidden = false;
  document.querySelectorAll('[data-track-step]').forEach((button) => {
    button.addEventListener('click', () =>
      workTrack.scrollBy({
        left:
          Number(button.dataset.trackStep) *
          (workTrack.querySelector('.work-frame').getBoundingClientRect().width + 26),
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      }),
    );
  });
}

const finishVideo = document.querySelector('.finish-loop');
if (finishVideo) {
  const control = document.querySelector('.motion-control');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let requested = !reduced.matches && !navigator.connection?.saveData;
  let visible = false;
  control.hidden = false;
  function updateControl() {
    const playing = !finishVideo.paused;
    control.setAttribute('aria-label', playing ? 'Pause finish preview' : 'Play finish preview');
    control.setAttribute('aria-pressed', String(playing));
    control.querySelector('.control-symbol').textContent = playing ? 'Ⅱ' : '▶';
  }
  function syncPlayback() {
    if (requested && visible && !document.hidden) {
      if (!finishVideo.src) finishVideo.src = finishVideo.dataset.src;
      finishVideo.play().catch(updateControl);
    } else finishVideo.pause();
    updateControl();
  }
  finishVideo.addEventListener('play', updateControl);
  finishVideo.addEventListener('pause', updateControl);
  control.addEventListener('click', () => {
    requested = finishVideo.paused;
    syncPlayback();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    },
    { threshold: 0.2 },
  ).observe(finishVideo);
  reduced.addEventListener('change', () => {
    requested = !reduced.matches && !navigator.connection?.saveData;
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
}

document.querySelectorAll('[data-video-shell]').forEach((shell) => {
  const video = shell.querySelector('video');
  const playButton = shell.querySelector('[data-video-play]');
  if (!video || !playButton) return;
  const syncVideoButton = () => {
    playButton.hidden = !video.paused;
  };
  playButton.addEventListener('click', () => video.play().catch(syncVideoButton));
  video.addEventListener('play', syncVideoButton);
  video.addEventListener('pause', syncVideoButton);
  video.addEventListener('ended', syncVideoButton);
  syncVideoButton();
});

const filters = document.querySelector('.filter-buttons');
if (filters) {
  filters.hidden = false;
  const items = [...document.querySelectorAll('.gallery-item')];
  const buttons = [...filters.querySelectorAll('button')];
  function filterWork(value, updateURL = true) {
    if (!buttons.some((b) => b.dataset.filter === value)) value = 'all';
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
    items.forEach((item) => {
      item.hidden = value !== 'all' && item.dataset.category !== value;
    });
    const count = items.filter((item) => !item.hidden).length;
    document.querySelector('#gallery-count').textContent =
      `${count} selected ${count === 1 ? 'detail' : 'details'}`;
    ScrollTrigger.refresh();
    if (updateURL) {
      const url = new URL(location.href);
      if (value === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', value);
      history.pushState({}, '', url);
    }
  }
  buttons.forEach((button) =>
    button.addEventListener('click', () => filterWork(button.dataset.filter)),
  );
  filterWork(new URLSearchParams(location.search).get('filter') || 'all', false);
  addEventListener('popstate', () =>
    filterWork(new URLSearchParams(location.search).get('filter') || 'all', false),
  );
}

const dialog = document.querySelector('#gallery-dialog');
if (dialog) {
  let opener;
  document.querySelectorAll('.gallery-open').forEach((link) =>
    link.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      opener = link;
      const image = dialog.querySelector('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      dialog.querySelector('#dialog-caption').textContent = link.dataset.title;
      dialog.showModal();
    }),
  );
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    }
  });
  dialog.addEventListener('close', () => opener?.focus());
}

const form = document.querySelector('#quote-form');
if (form) {
  document.querySelector('#quote-builder').hidden = false;
  const service = form.querySelector('#service');
  const requested = new URLSearchParams(location.search).get('service');
  if ([...service.options].some((option) => option.value === requested)) service.value = requested;
  const status = document.querySelector('#quote-status');
  const result = document.querySelector('#quote-result');
  let preparedMessage = '';
  const fields = ['name', 'postcode', 'vehicle'];
  const errors = {
    name: 'Enter your name so we know who to reply to.',
    postcode: 'Enter a valid UK postcode so we can check your location.',
    vehicle: 'Enter your vehicle make and model.',
  };
  function validate(id) {
    const input = form.elements[id];
    const value = input.value.trim();
    const valid =
      id === 'postcode'
        ? /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i.test(value)
        : value.length > 0;
    input.setAttribute('aria-invalid', String(!valid));
    input.setAttribute('aria-describedby', `${id}-error`);
    document.getElementById(`${id}-error`).textContent = valid ? '' : errors[id];
    return valid;
  }
  fields.forEach((id) =>
    form.elements[id].addEventListener('input', () => {
      if (form.elements[id].getAttribute('aria-invalid') === 'true') validate(id);
    }),
  );
  form.addEventListener('input', () => {
    result.hidden = true;
    status.textContent = '';
  });
  service.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('service', service.value);
    history.replaceState({}, '', url);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = fields.filter((id) => !validate(id));
    if (invalid.length) {
      status.textContent = 'Please check the highlighted details.';
      form.elements[invalid[0]].focus();
      return;
    }
    const values = new FormData(form);
    const serviceText = service.selectedOptions[0].textContent;
    preparedMessage = `Hi, I’d like to enquire about a detail.\n\nName: ${values.get('name').trim()}\nPostcode: ${values.get('postcode').trim().toUpperCase()}\nVehicle: ${values.get('vehicle').trim()}\nService: ${serviceText}${values.get('details').trim() ? '\n\n' + values.get('details').trim() : ''}\n\nPlease let me know the suitable options and availability.`;
    const email = e.submitter?.value === 'email';
    const link = document.querySelector('#send-message');
    link.href = email
      ? `mailto:${business.email}?subject=${encodeURIComponent('Vehicle detailing enquiry')}&body=${encodeURIComponent(preparedMessage)}`
      : `${business.whatsapp}?text=${encodeURIComponent(preparedMessage)}`;
    link.textContent = email ? 'Open email to send' : 'Open WhatsApp to send';
    document.querySelector('#message-preview').textContent = preparedMessage;
    result.hidden = false;
    status.textContent = 'Your message is ready to review. It has not been sent.';
    link.focus({ preventScroll: true });
    link.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'center',
    });
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preparedMessage);
      status.textContent = 'Message copied. Paste it into WhatsApp or email to send.';
    } catch {
      status.textContent =
        'Copy was unavailable. Select and copy the message above, then paste it into WhatsApp or email.';
    }
  });
}

// Keep manually played media quiet when the page is no longer visible.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('video').forEach((video) => video.pause());
});
