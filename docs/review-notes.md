# Website review record

Initial build reviewed on 12 November; creative redesign completed and reviewed locally on 13 November 2026. This website has not been deployed.

## Content and enquiry behavior

- The 11 services, prices, durations and package inclusions are consumed from [the approved service data](../content/services.json). Business details were checked against [the approved business reference](../content/business.md).
- Telephone **07776 732135** and WhatsApp **07468 286651** remain separate, approved contact routes.
- Ceramic coating retains the 20% booking deposit, approximate full-day duration, suitable weather and curing conditions, and vehicle-dependent final quote.
- Service coverage is described as roughly 25 miles around Darlington, with availability confirmed for the customer's address.
- The quote builder prepares a message locally. A customer must open WhatsApp or email and send the message there; preparing it does not submit an enquiry or reserve an appointment.
- Editing a prepared enquiry hides the previous result until it is prepared again. Unknown service URLs default to advice. Local and session storage remain empty.
- No invented testimonials, review counts, opening hours, fixed appointment availability or guaranteed paint-correction percentages have been introduced.

## Static hosting

- Astro generates directory-index pages, a sitemap, robots instructions and a custom 404 page into [dist/](../dist/).
- Upload only the built output. The original library, media review catalogue, project sources and development dependencies do not belong in the public deployment.
- No server adapter, database, API key or host-side Node process is needed. Configure the host to serve `404.html` for missing routes, without an SPA fallback.
- Canonical URLs and sitemap entries use `https://polishedpristinedetailing.co.uk/`.
- Fonts and selected optimized media are self-hosted. Contact links are external only when the visitor chooses to open them.

## Automated regression coverage

[The Playwright suite](../tests/website.spec.js) checks narrow mobile, tablet, landscape and desktop layout, image loading, browser errors, axe accessibility rules, approved service data, enquiry validation and contact destinations, mobile navigation, gallery filtering/history and keyboard lightbox behavior, no-JavaScript routes, internal links and gallery video playback.

The initial technical review reproduced a narrow-phone overflow on the services page at 320px. The redesign resolves it with explicit minimum grid tracks and full-row service headings. Visual review also caught percentage row gaps disturbing vertical flow; these now use fixed responsive gaps, with a regression assertion that service content stays inside its section.

## Final redesign validation

- Production static build passes with Astro 7.4.11 and Node 24.21.0. Editor diagnostics report no errors. Dependency audit reports zero known vulnerabilities.
- All **12 Playwright tests pass**. Seven primary routes are checked at 390px and 1440px for loaded images, page errors, viewport overflow and axe WCAG 2 A/AA, 2.1 AA and 2.2 AA rules. Additional layout checks cover 320px, 375px, 768px, 1024px and 844px landscape.
- Manual browser inspection covered the desktop opening, service photography, coating collage, work mosaic, personal section, inner pages, and narrow-phone homepage, gallery, coating feature and services flow. The mobile Porsche composition was changed after review so it shows the recognisable vehicle front rather than an abstract crop of blue paint.
- Rechecked all approved service prices and inclusions, enquiry validation, WhatsApp/email encoding, stale-message invalidation, unknown-service defaults, native disclosures, navigation without JavaScript, gallery filters/history, enlarged-photo keyboard controls, internal media links and sitemap.
- New motion checks cover reduced-motion still fallback, explicit play/pause, offscreen video pause and next/previous portfolio controls. The separate gallery video remains user initiated.
- A long-message mobile enquiry test confirms the focused send action stays between the fixed header and bottom contact bar. The flow still prepares locally and sends only through the customer's chosen app.
- Fonts and responsive AVIF/WebP media are self-hosted; critical Latin fonts are preloaded. New image crops and the short silent finish film retain documented original provenance.
- Decorative outlined lettering is kept out of assistive content. Functional text and controls pass the automated contrast checks.
- Following visual feedback, PROTECT now appears as legible light blue-grey display text above the coating photographs. The gallery navigation label is explicit, and additional finished-work images appear in the services opening, service groups, homepage track and About page. These revisions pass the same regression suite; the larger mobile service photographs were also inspected in-browser.

The local preview is available at http://127.0.0.1:4321/. Build and hosting instructions are in the [README](../README.md). Automated accessibility checks supplement, rather than replace, the keyboard and visual checks above.

## Photographic and readability edit

The final edit enlarges primary reading text to 16px, reduces repeated labels and photo tilts, and removes the mobile hero's fixed 980px minimum height. The finished photo now appears directly below the headline. A regression checks that a 375px phone sees the photograph before 400px and the quote action above its fixed contact bar. The complete 12-test suite passes.

Four additional reviewed finished selections broaden the portfolio, and a separately labelled Range Rover assessment/preparation/finish story complements the verified seat comparison. Different panels and lighting are explained; no quantified correction claim or extra matching pair is invented. Exact source selections and stage notes are in the editorial media record.
