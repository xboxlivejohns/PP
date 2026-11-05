# Ceramic coating page — development preview

Dedicated static page for the existing Polished & Pristine site. Refined locally with a matched photographic paint sequence. No deployment or framework migration.

## Preview

Double-click [preview.cmd](./preview.cmd), or from this directory run `npm run dev`, then open **http://127.0.0.1:4173/ceramic-coating/**. The launcher handles this PC's Node executable even if Node is absent from PATH. The local server serves the existing repository so header links and shared styles work normally. It binds only to localhost. The website itself needs no server beyond GitHub Pages.

The page loads local browser bundles from the shared [vendor directory](../assets/ceramic-coating/vendor/). All runtime images are local WebP files. Visitors need no generation service or Node installation.

## Story and assets

The supplied emerald coupe, before-paint photograph and clay photograph now drive the page. The hero camera pushes towards the bonnet, then dissolves into the supplied inspection-light close-up. The clay image appears as a complete photographic treatment beat. Four condition-only edits show the same composition after cleaning, polishing, coating and wetting. No independently animated hands, tools or water droplets are used.

The four missing images were generated with the built-in OpenAI image tool from the supplied before photograph. The hydrophobic result is a full opaque image. ComfyUI was not used. See [asset paths, method and generation prompts](MATCHED-PAINT.md).

A fixed close-up framing and scroll-linked crossfades keep the paint conditions visually matched. Portrait layouts show a wider image above the caption. Reduced motion and JavaScript-free viewing provide a static sequence of all six process photographs. The real customer gallery remains separate and unchanged.

## Chosen tools and official references

| Tool | Use here | Official source |
| --- | --- | --- |
| Lenis 1.3.27 | Desktop inertial wheel scrolling; touch retains native scrolling. One GSAP ticker, documented scroll synchronisation. | [Docs and GitHub](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger), MIT |
| GSAP / ScrollTrigger 3.15.1 | Pinned scene and scroll-state choreography. | [ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GitHub](https://github.com/greensock/GSAP), [no-charge licence](https://gsap.com/standard-license/) |
| ScrollCraft patterns | Chapter planning and camera-led progression; not a new runtime library. The name is ambiguous, so no unrelated builder was installed. | [nateherkai/scroll-craft design guidance](https://github.com/nateherkai/scroll-craft); separate [ScrollCraft builder](https://github.com/singhharsh1708/scrollcraft) |
| React Bits | Small vanilla adaptation of SpotlightCard's pointer-position radial lighting on real-work cards. No React dependency. | [SpotlightCard](https://reactbits.dev/components/spotlight-card), [GitHub](https://github.com/DavidHDev/react-bits), MIT + Commons Clause (retained in vendor) |
| 21st.dev | Restrained pointer-parallax tilt pattern from the free MIT Motion Primitives reference. No hosted UI generation. | [21st Tilt component](https://21st.dev/@ibelick/components/tilt), [Tilt docs](https://motion-primitives.com/docs/tilt), [upstream](https://github.com/ibelick/motion-primitives) |

The canvas camera and full-photograph crossfades are page-native code. The React-only references were adapted within this application to honour the repository's vanilla-only rule and avoid unnecessary runtime dependencies.

### Agent integrations researched

- Free React Bits components can be discovered through its public registry/shadcn MCP. [Official introduction](https://reactbits.dev/get-started/introduction). React Bits Pro and its licence-key integration are separate and not used.
- [21st MCP](https://21st.dev/mcp) supports Codex and other MCP clients. It requires sign-in or a key. Search is free; free accounts have limited daily component retrievals; hosted AI generation spends credits. No account, global configuration or paid/credit-backed integration was installed. Public upstream source was sufficient.
- Lenis and GSAP are configured directly from their official packages. No extra MCP server is needed to run this static page.

## Accessibility, mobile and safety

- “See Real Results ↓” is always an ordinary anchor; works with JavaScript disabled and bypasses the entire scene. With JS it also focuses the gallery heading area.
- `prefers-reduced-motion` removes the pin and camera sequence, leaving a static car, all six process photographs with concise explanations, full service details and gallery. A page-local motion button offers the same option.
- Keyboard-accessible chapter controls and native photo dialog, Escape close, focus restoration. Shared mobile menu/contact bar preserved.
- Canvas/image-load failure falls back to the static poster and document sequence. Gallery interaction remains available. Canvas pixel ratio is capped at 1.5, with a 1600-pixel width cap. No continuous shader animation, heavy 3D framework or autoplay video.
- Existing telephone, email, social and WhatsApp destinations reused exactly, including the site's existing distinction between telephone and WhatsApp numbers.
- Service details use the supplied brief and existing source of truth. No new price tiers, scratch-resistance claims or guarantees.
- Publication removes the prototype `noindex` directive and lists the page in the sitemap. The existing site robots policy still allows indexing.

## Development commands

Run `npm run dev` for the local preview, `npm run check` for JavaScript syntax checks, and `npm run verify:matched` for the current browser verification suite. The browser checks use the installed Microsoft Edge executable and cover desktop, tablet, mobile, landscape, reverse scrolling, chapter links, gallery dialogs, reduced motion, JavaScript-free viewing and dependency failures. Screenshots and the report are written to the ignored QA directory. Sharp and Playwright are development-only dependencies.

The final images are checked in; regeneration is unnecessary to preview the page. [prepare-matched-states.mjs](tools/prepare-matched-states.mjs) optionally encodes the three supplied references and four full generated images supplied on its command line. Older generation/preparation/verification scripts describe superseded prototypes and are not part of the current refinement workflow.

Published through the repository's GitHub Pages main branch. Browser checks use desktop and mobile emulation, not physical mobile hardware.
