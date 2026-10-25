# Showroom Noir — styleguide preview

This is an additive design preview, not the page rollout. Existing site pages have not been restyled yet. Nothing has been deployed.

## Preview locally

From the project root, run `node tools/preview.mjs`, then open http://127.0.0.1:4173/styleguide/.

The page is unlinked from the existing website, excluded from the sitemap and marked `noindex,nofollow`. It is not access-controlled: noindex is not a privacy mechanism.

## Design

- Original logo green (#87D87B) as the single accent; specified noir surfaces and typography colours.
- Manrope headings, Inter body, both with `font-display: swap` via Google Fonts.
- 1200px layout, 8px spacing foundation, 20px cards, pill buttons and consistent inline line icons.
- Featured ceramic coating, benefits, numbered process, existing before/after photos, existing reviews, service-area chips, FAQ, quote form preview, CTA band and four-column footer.
- Existing photographs converted to WebP alongside untouched JPG originals.
- Only short interaction transitions and a single initial fade; reduced-motion override.

## Screenshot review

- [390px full page](./showroom-noir-390.png) and [hero](./showroom-noir-390-hero.png).
- [1440px full page](./showroom-noir-1440.png) and [hero](./showroom-noir-1440-hero.png).
- Corrected a missing closing anchor discovered in the initial screenshot review.
- Final review: consistent card edges and gutters, aligned desktop service prices/actions, clear heading hierarchy, mobile content fits without horizontal scrolling, sticky contact controls remain visible.
- Desktop hero deliberately uses a portrait crop; mobile uses 4:3 to preserve more of the image within a shorter scroll.
- Long mobile page is expected for a component catalogue; it is not a proposal to put every catalogue component on every production page.

## Verification

At 390px and 1440px: checked no horizontal overflow or browser script errors, images decode, visible buttons are at least 48px tall, comparison works by keyboard, FAQ toggles, and form preview never sends data. Editor diagnostics and Git whitespace checks pass.

Calculated token contrast: muted on raised 6.63:1; primary text on surface 17.20:1; primary button text on accent 10.73:1. Full Lighthouse and page-by-page accessibility checks remain part of the later rollout.

The repeatable browser check is `node tools/check-styleguide.cjs <path-to-playwright-package>` and uses installed Microsoft Edge.

## Outstanding facts and implementation

- Confirm Google review count.
- Confirm the scope and exclusions of the 3-year coating claim, whether there is a warranty, and its conditions.
- Confirm aftercare requirements and maintenance wash timing, price and inclusion.
- Connect the quote delivery mechanism and define optional photo handling. The styleguide form is explicitly a non-sending demonstration.
- Page rollout, campaign tracking, dedicated service/town pages, manual video components and final performance/accessibility testing are still outstanding.

Calls remain 07776 732135; WhatsApp remains 07468 286651. Existing domain corrections are separate from this design preview.
