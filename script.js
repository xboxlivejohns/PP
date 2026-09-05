const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const faqButtons = document.querySelectorAll('.faq-question');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const serviceFinder = document.querySelector('.service-finder');

if (serviceFinder) {
  const options = serviceFinder.querySelectorAll('.service-finder-option');
  const details = serviceFinder.querySelector('.service-finder-details');
  const backButton = serviceFinder.querySelector('.service-finder-back');
  const categoryLabel = serviceFinder.querySelector('#service-finder-category-label');
  const detailTitle = serviceFinder.querySelector('#service-finder-detail-title');
  const detailIntro = serviceFinder.querySelector('#service-finder-detail-intro');
  const services = serviceFinder.querySelector('#service-finder-services');
  const note = serviceFinder.querySelector('#service-finder-note');
  const categories = {
    appearance: {
      label: 'A cleaner, fresher car',
      title: 'Make it look better',
      intro: 'A good place to start when your car needs a complete clean-up, inside, outside or both.',
      note: 'We can recommend the most suitable level after seeing your vehicle’s condition.',
      services: [
        ['Essential Clean / Mini Valet', 'A practical clean for a car that needs a tidy, refreshed finish.'],
        ['Full Valet', 'A more thorough clean inside and out for a deeper overall reset.'],
        ['Interior Deep Clean', 'Focused cleaning for built-up dirt and grime in the cabin.']
      ]
    },
    paint: {
      label: 'More gloss and clarity',
      title: 'Improve the paint',
      intro: 'For paintwork that looks dull, feels rough or has swirls and more noticeable defects.',
      note: 'The right polishing approach depends on the paint condition and the finish you want to achieve.',
      services: [
        ['Paint Enhancement', 'Improve gloss, clarity and the overall appearance of the paint.'],
        ['Paint Correction', 'More intensive machine polishing for swirls, scratches and noticeable defects.'],
        ['Paint Decontamination', 'Remove embedded contamination so the paint is cleaner and better prepared.'],
        ['Headlight Restoration', 'Improve the appearance of tired or cloudy headlight lenses.']
      ]
    },
    protection: {
      label: 'Protection for the finish',
      title: 'Protect it',
      intro: 'Add protection where it matters, from the painted panels to the wheels and glass.',
      note: 'Ceramic coating is Autosmart Matrix Blue and all coatings offered are three-year coatings.',
      services: [
        ['3-Year Autosmart Matrix Blue Ceramic Coating', 'A three-year ceramic coating for paint protection and a cared-for finish.'],
        ['Wheel Coating', 'Matrix Blue can also be used on wheels, applied as two coats.'],
        ['Glass Protection', 'Matrix Blue can also be used to provide protection for exterior glass.'],
        ['PPF (Paint Protection Film)', 'A protective film option for selected painted areas of the vehicle.']
      ]
    },
    maintenance: {
      label: 'Ongoing professional care',
      title: 'Keep it looking good',
      intro: 'A recurring maintenance programme for existing customers who want their car cared for throughout the year.',
      note: 'Choose a visit every 4, 6 or 8 weeks and receive approximately 15% loyalty saving.',
      services: [
        ['Maintenance Valet', 'Regular professional maintenance to keep a previously detailed car looking good.'],
        ['Every 4 weeks', 'The most frequent option for cars that need consistent attention.'],
        ['Every 6 weeks', 'A balanced schedule for keeping your finish in good condition.'],
        ['Every 8 weeks', 'A less frequent maintenance rhythm for vehicles that are already well cared for.']
      ]
    }
  };

  const showCategory = (key) => {
    const category = categories[key];
    if (!category) return;

    categoryLabel.textContent = category.label;
    detailTitle.textContent = category.title;
    detailIntro.textContent = category.intro;
    note.textContent = category.note;
    services.innerHTML = category.services.map(([title, description]) => `
      <article class="service-finder-service">
        <span class="service-finder-check" aria-hidden="true">✓</span>
        <div><h4>${title}</h4><p>${description}</p></div>
      </article>
    `).join('');

    options.forEach((option) => {
      option.hidden = true;
      option.setAttribute('aria-expanded', 'false');
    });
    details.hidden = false;
    serviceFinder.classList.add('service-finder-expanded');
    serviceFinder.querySelector('.service-finder-back').focus();
  };

  options.forEach((option) => {
    option.addEventListener('click', () => showCategory(option.dataset.serviceCategory));
  });

  backButton.addEventListener('click', () => {
    details.hidden = true;
    serviceFinder.classList.remove('service-finder-expanded');
    options.forEach((option) => {
      option.hidden = false;
      option.setAttribute('aria-expanded', 'false');
    });
  });
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
        <img src="/assets/images/${item.file}" alt="${item.alt}" loading="lazy" decoding="async">
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

const processVideos = document.querySelectorAll('.video-showcase-section .video-card video');

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        if (!video.dataset.initialised) {
          video.load();
          video.dataset.initialised = 'true';
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '250px 0px', threshold: 0.1 });

  processVideos.forEach((video) => videoObserver.observe(video));
} else {
  processVideos.forEach((video) => {
    video.load();
    video.play().catch(() => {});
  });
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
