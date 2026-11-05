# Ceramic coating page — development preview

One new static page for the existing Polished & Pristine site. No deployment, no commit, no framework migration. Development branch: `dev/ceramic-coating-cinematic`.

## Preview

Double-click [preview.cmd](./preview.cmd), or from this directory run `npm run dev`, then open **http://127.0.0.1:4173/ceramic-coating/**. The launcher handles this PC's Node executable even if Node is absent from PATH. The local server serves the existing repository so header links and shared styles work normally. It binds only to localhost. The website itself needs no server beyond GitHub Pages.

The page loads local browser bundles from `vendor/`. Visitors do not install Node or connect to ComfyUI. All asset paths in the new page are relative. The only existing-file edit is the ceramic-coating service-picker destination in `../services/index.html`.

## Story and assets

Seven scroll-controlled chapters: vehicle → paint macro → decontamination → single-stage polishing → coating application → water beading → vehicle reveal. GSAP ScrollTrigger pins one scene; one normalised scroll value controls camera motion, procedural surface effects, tool passes and refracting droplets. No clock-based film or image-sequence downloads. Reverse scrolling reconstructs the same state. Rendering is on demand, not a continuously redrawn background.

The new car image was generated via the existing local ComfyUI API, SDXL base 1.0, 1152×640, batch 1, Euler, 24 steps, seed 760682914, approximately 95.87 seconds of execution. Existing emerald paint macro imagery was reused to match its colour. Native AMD torch/ROCm packages were not installed, upgraded or changed. The generation server was stopped afterwards.

- `assets/vehicle.webp` and `assets/paint.webp`: AI illustration only; the cinematic scene is labelled accordingly.
- Gallery and real-work callout: optimised copies of existing gallery photographs. These are described as detailing results, **not asserted to all be ceramic coating jobs**.
- `asset-provenance.json`: local raw source and generation details.
- Raw car: `C:/ComfyUI/outputs/raw/pp_ceramic_cinematic_vehicle_00001_.png`.
- Saved generation graph: `C:/ComfyUI/workflows/pp_ceramic_cinematic_vehicle.api.json`.
- No new model, refiner, paid service or cloud generation.

The SDXL checkpoint is covered by [CreativeML Open RAIL++-M](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/LICENSE.md). Use restrictions apply; generated images are explanatory, not photographs of completed customer work.

## Chosen tools and official references

| Tool | Use here | Official source |
| --- | --- | --- |
| Lenis 1.3.27 | Desktop inertial wheel scrolling; touch retains native scrolling. One GSAP ticker, documented scroll synchronisation. | [Docs and GitHub](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger), MIT |
| GSAP / ScrollTrigger 3.15.1 | Pinned scene and scroll-state choreography. | [ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GitHub](https://github.com/greensock/GSAP), [no-charge licence](https://gsap.com/standard-license/) |
| ScrollCraft patterns | Chapter planning and camera-led progression; not a new runtime library. The name is ambiguous, so no unrelated builder was installed. | [nateherkai/scroll-craft design guidance](https://github.com/nateherkai/scroll-craft); separate [ScrollCraft builder](https://github.com/singhharsh1708/scrollcraft) |
| React Bits | Small vanilla adaptation of SpotlightCard's pointer-position radial lighting on real-work cards. No React dependency. | [SpotlightCard](https://reactbits.dev/components/spotlight-card), [GitHub](https://github.com/DavidHDev/react-bits), MIT + Commons Clause (retained in vendor) |
| 21st.dev | Restrained pointer-parallax tilt pattern from the free MIT Motion Primitives reference. No hosted UI generation. | [21st Tilt component](https://21st.dev/@ibelick/components/tilt), [Tilt docs](https://motion-primitives.com/docs/tilt), [upstream](https://github.com/ibelick/motion-primitives) |

The shader, paint effects and tool illustrations are page-native code; they are not represented as third-party shader components. The React-only references were adapted within this application to honour the repository's vanilla-only rule and avoid unnecessary runtime dependencies.

### Agent integrations researched

- Free React Bits components can be discovered through its public registry/shadcn MCP. [Official introduction](https://reactbits.dev/get-started/introduction). React Bits Pro and its licence-key integration are separate and not used.
- [21st MCP](https://21st.dev/mcp) supports Codex and other MCP clients. It requires sign-in or a key. Search is free; free accounts have limited daily component retrievals; hosted AI generation spends credits. No account, global configuration or paid/credit-backed integration was installed. Public upstream source was sufficient.
- Lenis and GSAP are configured directly from their official packages. No extra MCP server is needed to run this static page.

## Accessibility, mobile and safety

- “See Real Results ↓” is always an ordinary anchor; works with JavaScript disabled and bypasses the entire scene. With JS it also focuses the gallery heading area.
- `prefers-reduced-motion` removes the pin and camera sequence, leaving a static car, concise process summary, full service details and gallery. A page-local motion button offers the same option.
- Keyboard-accessible chapter controls and native photo dialog, Escape close, focus restoration. Shared mobile menu/contact bar preserved.
- WebGL failure/context loss falls back to the static poster. Pixel ratio capped at 1.5 desktop / 1.25 mobile. No continuous shader animation, heavy 3D framework or autoplay video.
- Existing telephone, email, social and WhatsApp destinations reused exactly, including the site's existing distinction between telephone and WhatsApp numbers.
- Service details use the supplied brief and existing source of truth. No new price tiers, scratch-resistance claims or guarantees.
- Page remains `noindex, nofollow` during approval. Do not remove the development robots directive or publish without approval. The existing sitemap and robots files were not edited.

## Development commands

`npm ci` installs only page-local tooling. `npm run check` checks JS syntax. `npm run prepare:assets` optimises local source images and copies vendor browser files. It requires the ignored `.cache-vehicle-path.json` written by `node tools/generate.mjs`; that generator explicitly queues one local ComfyUI workflow and never installs Python dependencies.

`node tools/verify.mjs` uses the existing Microsoft Edge executable for desktop, mobile, reduced-motion, no-JS, dialog and deterministic reverse-scroll checks. Screenshots and report are saved in ignored `qa/`. It does not install browser binaries. `sharp` and `playwright` are development-only dependencies.

Not yet deployed. Visual performance checks are desktop browser/mobile emulation, not a claim of measured performance on a physical low-end phone.
