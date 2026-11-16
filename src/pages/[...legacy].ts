import type { APIRoute } from 'astro';
import { legacyRedirects } from '../data/legacy-redirects.js';

export function getStaticPaths() {
  return legacyRedirects.map((redirect) => ({
    params: { legacy: redirect.path },
    props: redirect,
  }));
}

function escapeHTML(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!,
  );
}

export const GET: APIRoute = ({ props, site }) => {
  const target = props.target as string;
  const canonical = new URL(target, site);
  canonical.hash = '';
  const fallback = escapeHTML(target);
  // The destinations come only from our manifest, never from the visitor's URL.
  const data = JSON.stringify({ target, fragments: props.fragments || {} }).replace(
    /</g,
    '\\u003c',
  );

  return new Response(
    `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${escapeHTML(canonical.href)}">
  <title>Page moved | Polished &amp; Pristine</title>
  <script>
    (() => {
      const redirect = ${data};
      const fragmentTarget = redirect.fragments[location.hash];
      const destination = new URL(fragmentTarget || redirect.target, location.origin);
      destination.search = location.search;
      if (!fragmentTarget && location.hash) destination.hash = location.hash;
      location.replace(destination.href);
    })();
  </script>
  <meta http-equiv="refresh" content="0; url=${fallback}">
</head>
<body>
  <p>This page has moved. <a href="${fallback}">Continue to Polished &amp; Pristine</a>.</p>
</body>
</html>`,
    {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    },
  );
};
