# Detailing progress — isolated animation study

Open **http://127.0.0.1:4333/** while the standalone preview server is running.

This folder is outside Astro's `src` and `public` directories. Nothing here is imported by the website or included in its normal static build. It has no external requests, accounts, analytics or storage, and uses the existing local GSAP package and locally served Manrope/Barlow font files.

## Preview

```powershell
node prototypes/detailing-progress/server.mjs
```

The server binds only to `127.0.0.1:4333`. It serves an explicit allowlist of prototype assets plus the existing GSAP runtime, not the rest of the project. Stop it with Ctrl+C if running in a terminal.

If it was started in the background, find and stop only this preview process:

```powershell
$animationPreviewPid = (Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 4333 -State Listen).OwningProcess
Get-CimInstance Win32_Process -Filter "ProcessId = $animationPreviewPid" | Select-Object ProcessId, CommandLine
# After confirming the command line points to this folder's server.mjs:
Stop-Process -Id $animationPreviewPid
```

Do not stop port 4321: that is the separate website preview.

## What is implemented

- Simplified silver silhouettes of the car and backwards-cap detailer, with blue tools. Faces, clothing textures, paint gradients and detailed wheel spokes have been removed.
- One 26-second GSAP timeline. Motion is deterministic, so seeking forwards/backwards reconstructs the same pose and effects.
- Vacuum with open door, wheels, snow foam, rinse, mitt/bucket contact wash, final rinse, microfibre towel drying and clean-car finish. Polishing, decontamination and coating actions are deliberately excluded at the owner's request.
- Foam builds and rinses off; remaining grime clears during the contact wash; water beads disappear during drying. Arm joints follow the tool using a two-link pose calculation.
- Two synchronised views: a travelling miniature standing on the bottom line **inside** the themed navbar mock-up, and an enlarged inspection view. The mock-up reuses the site's palette, fonts and emblem but is not imported by the site. Local SVG IDs are namespaced.
- Play/pause/replay, restart, native keyboard-accessible progress slider, nine moment buttons, and optional real page-scroll linking. Stage labels are preview-only, not proposed educational website copy.
- Reduced motion: no autoplay, stepping/bobbing or horizontal scene travel. Stages remain manually inspectable and explicit playback is possible. Tab hiding pauses playback; a previously playing sample resumes on return only when appropriate.
- No automatic endless loop, sound or scroll interception. The stage percentages are storytelling divisions, not actual service timing or proof of a customer's work.

## Tests

```powershell
node prototypes/detailing-progress/check.mjs
```

Requires the standalone preview server. Uses the existing Playwright/Chrome and Axe dependencies. Covers stage rendering, reversing, keyboard controls, playback, real scrolling, narrow layouts, ID uniqueness, no external requests, reduced motion and accessibility. It is intentionally outside the production test suite.

Version 02 passes 15 checks, including tool changes, no polishing assets, and a baseline-alignment assertion at 320, 390, 768 and 1440px. See [process research](./process-research.md) for the source-backed sequence and tool choices.

## Production integration

The owner approved website integration on 14 November 2026. This folder retains the original, independent inspection preview; the website uses its own [component](../../src/components/DetailProgress.astro), [scene renderer](../../src/scripts/detailing-scene.js), [scroll controller](../../src/scripts/detail-progress.js) and [responsive styling](../../src/styles/detail-progress.css).

The integrated version includes corrected mitt/towel contact, grounded walking soles, a compact bottom lane inside the actual navbar, resize-aware horizontal travel and a stationary clean-car alternative for reduced motion. It advances only with page scroll, not elapsed time. The mock header and preview controls are not shipped. Prices, service descriptions and contact details are unchanged.

Run `npm run build` and the production [navbar tests](../../tests/detail-progress.spec.js), alongside the existing website suite, against an Astro preview server. The standalone checks above still apply only to the archived prototype.
