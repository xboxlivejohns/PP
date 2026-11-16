export function GET() {
  const pages = [
    '',
    'services/',
    'valeting/',
    'paint-correction/',
    'ceramic-coating/',
    'gallery/',
    'reviews/',
    'about/',
    'areas-covered/',
    'booking/',
    'privacy/',
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((path) => `<url><loc>https://polishedpristinedetailing.co.uk/${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
