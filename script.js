const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const faqButtons = document.querySelectorAll('.faq-question');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });

    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
    answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
  });
});

const galleryItems = [
  {
    file: 'finished car.jpg',
    category: 'featured',
    title: 'Exterior detailing',
    description: 'A clean, refined finish across the full vehicle.',
    alt: 'Silver vehicle with a clean finish after detailing',
    featured: true
  },
  {
    file: 'blue porshe.jpg',
    category: 'featured',
    title: 'Gloss and protection',
    description: 'Premium paintwork presented with a deep, even gloss.',
    alt: 'Blue Porsche with glossy paint after detailing',
    featured: true
  },
  {
    file: 'black gle shiney.jpg',
    category: 'featured',
    title: 'Paint enhancement',
    description: 'Clarity and reflection brought back to a black Mercedes GLE.',
    alt: 'Black Mercedes GLE with deep glossy paint after detailing',
    featured: true
  },
  {
    file: 'seat finished car.jpg',
    category: 'featured',
    title: 'Careful finishing',
    description: 'A freshly detailed SEAT, finished with attention to every panel.',
    alt: 'SEAT car with a clean finished exterior after detailing',
    featured: true
  },
  {
    file: 'finished car 2.jpg',
    category: 'featured',
    title: 'Full exterior finish',
    description: 'A bright, even finish across a larger family vehicle.',
    alt: 'Silver family SUV with a clean finish after detailing',
    featured: true
  },
  {
    file: 'iron fallout removal.jpg',
    category: 'specialist',
    title: 'Iron fallout removal',
    description: 'The purple reaction shows embedded iron contamination being safely dissolved.',
    alt: 'Purple iron fallout remover reacting on white vehicle paint'
  },
  {
    file: 'gle interior.jpg',
    category: 'specialist',
    title: 'Interior deep clean',
    description: 'Careful cleaning for a fresher, more cared-for cabin.',
    alt: 'Clean Mercedes GLE interior after detailing'
  },
  {
    file: 'engine bay clean.jpg',
    category: 'specialist',
    title: 'Engine bay detailing',
    description: 'A clean, presentable engine bay to complete the detail.',
    alt: 'Clean engine bay after professional detailing'
  },
  {
    file: 'egine bay clean.jpg',
    category: 'specialist',
    title: 'Engine bay finishing',
    description: 'A second view showing the finish across the engine bay.',
    alt: 'Detailed engine bay shown from a second angle'
  }
];

document.querySelectorAll('[data-gallery-category]').forEach((gallery) => {
  const category = gallery.dataset.galleryCategory;
  gallery.innerHTML = galleryItems
    .filter((item) => item.category === category)
    .map((item) => `
      <article class="gallery-card${item.featured ? ' gallery-card-featured' : ''} reveal">
        <img src="assets/images/${item.file}" alt="${item.alt}" loading="lazy" decoding="async">
        <div class="gallery-card-copy">
          <p class="gallery-card-label">Detailing result</p>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `)
    .join('');
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const beforeAfterSliders = document.querySelectorAll('.ba-slider');

beforeAfterSliders.forEach((slider) => {
  const range = slider.querySelector('.ba-range');

  if (!range) return;
  let isDragging = false;

  const updateSlider = (value) => {
    const percentage = Math.max(0, Math.min(100, Number(value)));
    slider.style.setProperty('--pos', `${percentage}%`);
    range.value = String(percentage);
  };

  range.addEventListener('input', () => updateSlider(range.value));

  const updateFromPointer = (event) => {
    const bounds = slider.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    updateSlider(position);
  };

  slider.addEventListener('pointerdown', (event) => {
    isDragging = true;
    slider.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });
  slider.addEventListener('pointermove', (event) => {
    if (isDragging) updateFromPointer(event);
  });
  slider.addEventListener('pointerup', () => { isDragging = false; });
  slider.addEventListener('pointercancel', () => { isDragging = false; });
});
