# Preserved header detailing animation

Removed from the active website on 16 November 2026 at the owner's request. The complete animation is preserved here for future use; none of its artwork or animation logic has been discarded. Each moved file was verified against its original SHA-256 hash.

## Contents

- [Astro component](./src/components/DetailProgress.astro)
- [Original SVG artwork](./src/assets/detailing-scene.svg)
- [Scroll integration](./src/scripts/detail-progress.js)
- [Cleaning scene renderer](./src/scripts/detailing-scene.js)
- [Original styling and header spacing](./src/styles/detail-progress.css)
- [Original browser tests](./tests/detail-progress.spec.js)

The original folder structure and relative imports are preserved. This folder is outside the site's pages, public assets and active test directory, so it is not published, bundled or run on the live site.

## Restoring or reusing it

1. Copy the archived `src` files into the matching project paths. The animation uses the existing GSAP dependency.
2. In the shared layout, import `DetailProgress` from `../components/DetailProgress.astro` and place `<DetailProgress />` after the header's inner navigation container.
3. Import `../styles/detail-progress.css` after the header stylesheet. Reconcile its original header spacing with the compact header rules now in the active stylesheet.
4. In the site's script, import `{ initDetailProgress }` from `./detail-progress` and call `initDetailProgress(header)` after registering GSAP's ScrollTrigger plugin.
5. Restore the archived browser test to the project's `tests` folder, then build and run the tests against the production preview.

The animation follows page scroll, reverses when scrolling backwards, stays still without scrolling, keeps the car centred on mobile, and shows a stationary finished car for reduced motion. For use within a page section, update the ScrollTrigger range and container styling to suit that section.
