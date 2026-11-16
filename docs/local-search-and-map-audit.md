# Local search, map and interface audit

14 November 2026. Local implementation only; not published or submitted to Google.

## Correction: custom coverage map now implemented

After the owner clarified the requirement and signed in to Google My Maps, a custom coverage map was created in their account: [view the map](https://www.google.com/maps/d/viewer?mid=16J7yGnqVkX79KCuSRwe20k6c4Fvxkac). Its blue, lightly shaded polygon represents an 18-statute-mile straight-line radius around a public Darlington reference point. The 361-vertex closed polygon was calculated on WGS84 and imported from [the KML backup](../content/maps/darlington-18-mile-coverage.kml). No private home marker is present. Link sharing permits viewing, not editing; Google search discovery was not enabled separately. Google's embed option suppresses the owner's profile in the website header, though My Maps may still show ownership in its fullscreen/Drive interfaces.

The website now embeds this custom map, not the town-only embed described in the original audit below. The site still loads the map only on request, and profile identity links remain separate. The earlier town-map limitation has been resolved. Real anonymous rendering and mobile/desktop display were checked; all 17 regression tests passed with the updated map URL. The coverage map is saved on Google; the website changes remain a local preview until publication. No Google Business Profile settings were changed.

## Findings and changes

- [GoogleAreaMap.astro:8](../src/components/GoogleAreaMap.astro) — added a genuine Google Maps embed for Darlington, obtained through Google Maps → Share → Embed a map. The previous 18-mile graphic is CSS artwork, not an AI image or geographic map. Both are labelled honestly; the Google map does not pretend to draw the service boundary or show customer premises.
- [GoogleAreaMap.astro:39](../src/components/GoogleAreaMap.astro) — iframe has a descriptive title, reserved dimensions, referrer policy and no initial `src`. A keyboard-operable button loads/removes it. Google is not contacted by the embed before the visitor selects it; an external Maps link remains usable without JavaScript. Loading third-party content is disclosed before the action, and no consent preference is stored.
- [areas-covered.astro:9](../src/pages/areas-covered.astro) — added WebPage/BreadcrumbList JSON-LD, a visible breadcrumb and a link to the confirmed Google business profile. Existing canonical URL, sitemap entry, navigation, nearby-area text and 18-mile enquiry wording are retained.
- [Layout.astro:30](../src/layouts/Layout.astro) — shared business identity now has a stable `@id`, confirmed profile `sameAs` URLs, `hasMap` linking to the business's Google profile, and the actual coverage policy in its description. No made-up address, business coordinates, opening hours, prices or aggregate review stars were introduced.
- [privacy.astro](../src/pages/privacy.astro) — optional map connection and Google privacy link added. This is a factual website disclosure, not a legal-compliance certification.
- [business.js:16](../src/data/business.js) — 18-mile published area and farther-away-by-enquiry policy remain central. No postcode enforcement or automatic availability claim.

## Important Google distinctions

Google describes local ranking in terms of relevance, distance and prominence/popularity. It recommends complete, accurate Business Profile information, verification, reviews and photographs. Its guidance does not promise a ranking improvement from simply inserting a website map. The map is a useful visitor feature, not a guaranteed SEO boost. [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en).

The map comes from Google's own documented sharing workflow. It shows the town, not the owner's home or a claimed customer-facing workshop. [Google map sharing/embedding instructions](https://support.google.com/maps/answer/7101463?hl=en).

A service-area business that does not receive customers at its address should remove the public address from its Business Profile. Google uses named cities/postcodes/areas, not an editable radius, for profile service areas. The website's 18-mile policy and the Business Profile's area configuration are separate things. [Google service-area guidance](https://support.google.com/business/answer/9157481?hl=en).

### Remaining structured-data limitation

[Layout.astro:30](../src/layouts/Layout.astro) — the existing AutomotiveBusiness (LocalBusiness subtype) identity intentionally lacks a physical address. Schema vocabulary can describe the identity, but Google's LocalBusiness rich-result documentation requires an address. Therefore do **not** describe this as fully eligible LocalBusiness rich-result markup or promise a map pack/rich-result outcome. A made-up address or the town-centre map coordinates must not be used as the business's premises. No owner-approved public business address is available, so this remains an intentional limitation. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Self-promotional aggregate-rating markup has not been added. Visible genuine customer quotes and links remain separate from Google's rich-result eligibility rules.

## Skill-guided interface review

Used the installed frontend-design guidance and web-design-guidelines skill, fetching its current rule set. The review focused on the location page, map controls, shared navigation/layout, privacy implications and sitewide regression checks—not a claim of individually reviewing every line of the entire repository.

- [GoogleAreaMap.astro](../src/components/GoogleAreaMap.astro) — pass: native button, accessible expanded state, status feedback, titled iframe, no external load before visitor action, reserved layout space and no-JavaScript fallback.
- [areas-covered.astro](../src/pages/areas-covered.astro) — pass: one H1, readable copy, accessible links, accurate service policy and mobile layout. Diagram is not misrepresented as a map.
- [Layout.astro](../src/layouts/Layout.astro) — pass for reviewed navigation/canonical/identity changes; intentional rich-result address limitation above.
- [privacy.astro](../src/pages/privacy.astro) — optional map behaviour documented; no claims of automatically booking or storing enquiry details.

Existing brand typography and the approved Services dropdown were preserved rather than introducing a new visual system. Review quotations retain original spelling rather than being changed to satisfy generic copy-style rules.

## Verification completed

- Production static build passed.
- All 17 Playwright tests passed: opt-in map request gating, metadata identity, coverage, navigation, prices/inclusions, service-preserving enquiries, mobile layouts, accessibility, gallery/video and no-JavaScript behaviour.
- Additional metadata audit passed for all 11 normal public pages: canonical URLs, index/follow tags, descriptions, one main H1 and parseable JSON-LD.
- Real, unmocked Google map loaded and visually inspected on desktop and mobile. Automated request-gating tests use a controlled map response; these are separate checks.
- Changed Astro/JS files reported no editor diagnostics.
- No Google profile edits, Search Console submissions, payments, API-key setup, new account connections or website publication were performed.

## Owner-account steps after publication

These cannot be completed in the website source or local preview:

1. Check the existing Google Business Profile is verified and reflects the correct name, call number, website and services. Do not create duplicate profiles for nearby towns.
2. If customers do not visit the base, ensure its street address is hidden. Select accurate cities/postcodes for the actual service area; do not look for an “18-mile radius” profile control.
3. Confirm business hours directly rather than importing conflicting third-party listing hours.
4. Keep adding genuine work and responding to reviews through the profile.
5. Once the website is published, use Google Search Console's URL Inspection for the new location page and confirm the sitemap is submitted. Local `127.0.0.1` URLs cannot be indexed as the live website.

No rankings or indexing outcomes are guaranteed.
