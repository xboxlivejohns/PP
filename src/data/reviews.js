// Owner-confirmed totals. Update this snapshot when the source profiles change.
// These are platform review counts, not a count of unique customers.
export const reviewsConfirmedOn = '2026-11-14';
export const reviewsConfirmedLabel = '14 November 2026';

export const reviewSources = [
  {
    id: 'google',
    name: 'Google',
    count: 21,
    rating: '5.0 / 5',
    ratingLabel: 'Rated five out of five',
    href: 'https://g.page/r/CdCapvxgK3U1EBM',
    note: 'Customer feedback on our Google business profile.',
  },
  {
    id: 'clean-me',
    name: 'Clean Me',
    count: 64,
    rating: '5.0 / 5',
    ratingLabel: 'Rated five out of five',
    href: 'https://booking.cleanme.co.uk/washer/polished-pristine-mobile',
    note: 'Reviews on our mobile valeting and detailing profile.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    count: 7,
    rating: '100% recommend',
    ratingLabel: 'One hundred per cent recommend',
    href: 'https://www.facebook.com/PolishedandPristine',
    note: 'Reviews and recommendations on our Facebook page.',
  },
];

export const totalReviews = reviewSources.reduce((total, source) => total + source.count, 0);

// Clean Me quotes transcribed from owner-supplied screenshots, 14 November 2026.
// Keep customer spelling/capitalisation. Service matches must be supported by the text.
// Full review bodies are source text: never shorten, paraphrase or correct them.
// Display names may abbreviate surnames; review bodies must remain untouched.
// Ian's complete Google review was supplied directly by the owner, 16 November 2026.
export const customerReviews = [
  {
    id: 'ian-coating',
    name: 'Ian S.',
    source: 'Google',
    href: reviewSources[0].href,
    sourceLabel: 'Google',
    topic: 'Machine polishing & ceramic coating',
    quote:
      'Once again John delivered a fantastic service carrying out a machine polish and ceramic coating.',
    serviceId: 'ceramic-coating',
  },
  {
    id: 'gordon-interior',
    name: 'gordon',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-07-06',
    dateLabel: '6 July 2026',
    topic: 'Interior deep cleaning',
    quote:
      'Very friendly came out to do a deep clean inside my car my vw golf it was dirty and it looks like a show car now very happy and I will get him back again to do a deep clean on my bMW when I get it back',
    serviceId: 'interior-deep-clean',
  },
  {
    id: 'leslie-paintwork',
    name: 'Leslie',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-07-23',
    dateLabel: '23 July 2026',
    topic: 'Paintwork care',
    quote:
      'John arrived on time and quickly got to work on my car\'s paintwork concerns ie flat and " rough " to the touch. After John\'s magic touch it is now smooth and well polished. Will be booking again in a few weeks',
    groupId: 'paintwork',
  },
  {
    id: 'nadine-valeting',
    name: 'Nadine',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-08-01',
    dateLabel: '1 August 2026',
    topic: 'Valeting',
    quote:
      'Great service, both cars valeted and washed. Never been so clean! Would fully recommend!',
    groupId: 'valeting',
  },
  {
    id: 'paul-roof',
    name: 'Paul',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-09-09',
    dateLabel: '9 September 2026',
    topic: 'Convertible roof cleaning',
    quote:
      'John did a spectacular convertible roof clean, waterproofing and wash of my Audi R8 recently, communication was good and I would use him again',
  },
  {
    id: 'carl-roof',
    name: 'Carl',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-08-18',
    dateLabel: '18 August 2026',
    topic: 'Convertible roof cleaning',
    quote:
      'what an amazing job John did. my soft top roof was a good camouflage shade of green and black from previous owners... all gone. back to black. the car looks new now. superb skills and service. Definitely will be rebooking in the future. Thankyou.',
  },
  {
    id: 'tomas-service',
    name: 'Tomas',
    source: 'Clean Me',
    href: reviewSources[1].href,
    date: '2026-09-25',
    dateLabel: '25 September 2026',
    topic: 'Communication & care',
    quote: 'Kept me updated with expected arrival time and cleaned car to a very high standard',
  },
];
