# Compact navbar comparison

Owner-requested comparison, **not a production edit**. Main website stays at http://127.0.0.1:4321/; this study runs at http://127.0.0.1:4335/.

## Design plan

- Existing palette: graphite `#101619`, deep `#090f13`, silver `#f1f2ef`, cobalt `#315ee7`, light blue `#8baaff`.
- Keep Barlow Condensed for navigation/branding and Manrope for body text. No new fonts, prices, copy or claims.
- One compact row: `brand | fixed detailing scene | links / Menu`. The full-width 2px progress line sits on the inside bottom edge. No extra row or travelling scene.
- Desktop gets the full navigation when space permits. Tablet gets the familiar expandable Menu, not squeezed links. All phones retain the car and detailer; below 380px the complete scene scales down together.
- Preserve native disclosures, touch targets, visible focus, reduced-motion alternatives and no-JS content. CSS reserves the enhanced mobile layout before paint to avoid the expanded-to-collapsed menu jump in the comparison.

The distinguishing feature is one miniature detailing scene, grounded in the actual business and existing identity. No additional illustration badges, pills, fake labels, new colours or repeated decorative motifs.

## Preview

```powershell
node prototypes/compact-navbar/server.mjs
```

Uses the existing static build read-only. Do not rebuild unless production changes need refreshing. The preview transforms only HTTP responses and serves explicit study files plus build pages, fonts and media. Binds only to localhost. Never stop port 4321 to run this.

The preview stylesheet and controller are deliberately outside the main site. Menu capture in the study allows comparison with the original built menu without editing it; a final integration would update the main menu's responsive breakpoint directly instead.

## Verification

Run `node prototypes/compact-navbar/check.mjs` while the comparison server is running. Thirteen checks cover nine viewport sizes (320–1440px), menu links, height-only resizes, scene grounding, scroll/reverse behaviour, reduced motion, header accessibility, no-JS navigation and separation from the main site.

The comparison measures 82px high on desktop/tablet and 72px on phones. A cold-cache simulated mobile check (150ms latency, 1.6Mbps download, 4× CPU slowdown) recorded 0.0054 cumulative layout shift, compared with approximately 0.362 in the earlier integrated-layout diagnostic. These are local lab samples, not real-user field results.
