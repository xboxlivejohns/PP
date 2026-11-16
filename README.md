# Polished & Pristine website

A complete, static Astro website for Polished & Pristine Mobile, Darlington. The original media catalogue and tooling are retained alongside it.

## Review locally

```powershell
npm install
npm run build
npm run preview
```

Open **http://127.0.0.1:4321/**. For live editing, use `npm run dev` instead of preview. Do not run both on the same port. VS Code tasks named **Website: build** and **Website: preview** are also provided. Use Node 24, as the deployment workflow does (Astro requires Node 22.23.4 or later).

## Pages

- Home: finished-work imagery, service pathways, ceramic feature, personal service and FAQs.
- Services: photographic opening, paired finished-work images, all 11 approved services, prices, durations and expandable inclusions.
- Ceramic coating: preparation, package, booking conditions and FAQs.
- Gallery: filterable portfolio, keyboard-accessible enlarged photos, a labelled seat transformation and a user-initiated silent video. The navigation explicitly labels this page Gallery.
- About: John, mobile service, coverage information and a finished-work photo collection.
- Get a quote: direct contact routes and an optional message builder.
- Privacy and a custom 404 page.

## Content

- [content/services.json](content/services.json) is the source for service prices, durations and inclusions. Rebuild after editing it.
- [content/business.md](content/business.md) is the approved business reference. Displayed contact routes are centralised in [src/data/business.js](src/data/business.js).
- The call number **07776 732135** and WhatsApp number **07468 286651** are intentionally separate, as confirmed in the approved content.
- [content/media-selection.json](content/media-selection.json) records the initial selected originals and condition classifications. [content/art-media-selection.json](content/art-media-selection.json) records the redesigned photographic crops, extra portfolio selections and finish-film excerpt. [docs/media-review.md](docs/media-review.md) explains the visual decisions.
- [content/editorial-media-selection.json](content/editorial-media-selection.json) records the wider finished-work selection and the Range Rover assessment frame used in its job story. The Gallery combines sixteen portfolio images with the seat comparison and Range Rover preparation-to-finish sequence.
- [design-system/polished-pristine/MASTER.md](design-system/polished-pristine/MASTER.md) records the visual direction.

## Enquiries

The quote form prepares a message locally. It validates name, vehicle and UK postcode, and retains the selected service from service links. The customer reviews the message, then explicitly opens WhatsApp or their email app to send it. **There is no website inbox, server submission, automatic booking or payment collection.** Direct phone, WhatsApp and email links work without JavaScript. No enquiry details are saved in local storage.

The ceramic deposit is explained, not collected. Dates and availability are confirmed by John. No unverified testimonials, precise review count or opening hours have been invented.

## Media

Only selected derivatives live in [public/media/](public/media/). Photographs have AVIF and WebP variants, explicit dimensions and responsive source sets. The hero loads eagerly; other photos are lazy-loaded. Barlow Condensed and Manrope are self-hosted, with critical Latin fonts preloaded. Source media is untouched.

The small homepage finish film is silent, has a visible play/pause control, and plays only while visible. It starts as a still for reduced-motion and data-saving preferences. The gallery's separate silent BMW video has native controls and is user initiated. Both pause when the page is hidden.

To regenerate media with the original library present:

```powershell
npm run media:build
node tools/build-art-media.mjs
node tools/build-editorial-media.mjs
```

Run these in order: the final script updates the local media classification record with all published photo/frame selections. Unselected media remains conservatively marked uncertain until individually reviewed. The original catalogue still runs with `npm run review` at **http://127.0.0.1:4177/**. Do not publish that catalogue or the original library.

## Validation

With the built-site preview running:

```powershell
npm test
npm run check:site
```

Tests use installed Google Chrome through Playwright. They cover mobile and desktop rendering, accessibility with axe, all prices and inclusions, internal links, enquiry validation and route generation, keyboard gallery controls, no-JavaScript content and video playback. See [docs/review-notes.md](docs/review-notes.md) for the final review record.

Format maintained source with `npm run format`. Shared foundation styles are in [src/styles/global.css](src/styles/global.css), the redesigned identity and shared components in [src/styles/art-direction.css](src/styles/art-direction.css), and photographic page compositions in [src/styles/home.css](src/styles/home.css) and [src/styles/gallery.css](src/styles/gallery.css). Native HTML handles disclosures. GSAP choreographs the homepage entrance, gallery photographic entrance and a restrained scroll-linked coating collage. Normal scrolling is preserved, including a native horizontal portfolio track with button and keyboard access. Motion respects reduced-motion preferences.

## Static hosting

The existing [xboxlivejohns/PP repository](https://github.com/xboxlivejohns/PP) hosts this site for free on GitHub Pages. Push source changes to `main`: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) installs locked dependencies with Node 24, builds, checks the generated files and runs the browser tests before deploying **only the contents of [dist/](dist/)**. GitHub Pages serves directory indexes and the generated `404.html`. No SPA rewrite, database, API key, server adapter or runtime Node process is required on the host.

The canonical domain, sitemap and metadata use **https://polishedpristinedetailing.co.uk/**. Change [astro.config.mjs](astro.config.mjs), [src/pages/sitemap.xml.ts](src/pages/sitemap.xml.ts) and [public/robots.txt](public/robots.txt) if the production domain changes. Use your host’s private/noindex preview setting for any public staging copy.

[public/CNAME](public/CNAME) preserves the existing domain. Keep Pages configured to deploy with **GitHub Actions** and **Enforce HTTPS** enabled. Historical URLs are mapped in [src/data/legacy-redirects.js](src/data/legacy-redirects.js); static HTML redirects retain old customer links, queries and service anchors. GitHub Pages does not support custom server-side 301 rules.

The old live version is preserved in the remote branch `backup/live-before-workspace-migration-20261116` and annotated tag `live-before-workspace-migration-20261116`. The original approved workspace also has a local `workspace-before-migration-20261116` branch. See [docs/migration.md](docs/migration.md) for the migration record and recovery procedure. Original media and local review tools are retained; only the compiled website is published.
