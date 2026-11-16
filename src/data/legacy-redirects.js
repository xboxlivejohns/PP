// Paths used by previous versions of the public site. Explicit filenames keep
// these working on GitHub Pages without relying on server-side redirect rules.
const pageAliases = [
  ['services.html', '/services/'],
  ['gallery.html', '/gallery/'],
  ['booking.html', '/booking/'],
  ['valeting.html', '/valeting/'],
  ['paint-correction.html', '/paint-correction/'],
  ['ceramic-coating.html', '/ceramic-coating/'],
  ['reviews.html', '/reviews/'],
  ['about.html', '/about/'],
  ['areas-covered.html', '/areas-covered/'],
  ['privacy.html', '/privacy/'],
];

const previousPages = [
  { name: 'portfolio', target: '/gallery/' },
  { name: 'contact', target: '/booking/' },
  {
    name: 'maintenance',
    target: '/valeting/#maintenance-plans',
    fragments: {
      '#maintenance-valet': '/valeting/#maintenance-plans',
      '#schedule': '/valeting/#maintenance-plans',
      '#faq': '/valeting/#maintenance-plans',
    },
  },
  {
    name: 'paint-enhancement',
    target: '/paint-correction/',
    fragments: { '#headlight-restoration': '/services/#headlight-restoration' },
  },
  {
    name: 'protection',
    target: '/ceramic-coating/',
    fragments: {
      '#ceramic-coating': '/ceramic-coating/',
      '#ppf': '/services/#ppf',
    },
  },
  { name: 'service-finder-prototype', target: '/services/' },
];

export const legacyRedirects = [
  ...pageAliases.map(([path, target]) => ({ path, target })),
  ...previousPages.flatMap(({ name, ...redirect }) => [
    { path: `${name}.html`, ...redirect },
    { path: `${name}/index.html`, ...redirect },
  ]),
];
