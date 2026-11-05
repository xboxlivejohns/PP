# Matched paint refinement

The local prototype uses a single fixed bonnet crop (915, 305, 330 × 186) from [the hero photograph](assets/master-vehicle.webp). All five full-frame paint photographs map to that crop, with no per-stage camera drift. Smooth scroll-linked opacity dissolves reveal each state. No hand, tool, scratch, dirt or water overlays are drawn.

| State | Complete image |
| --- | --- |
| Before preparation | [paint-unprepared.webp](assets/paint-unprepared.webp) |
| After decontamination and clay; swirls remain | [paint-before.webp](assets/paint-before.webp) |
| After polishing | [paint-corrected.webp](assets/paint-corrected.webp) |
| After coating | [paint-coated.webp](assets/paint-coated.webp) |
| Hydrophobic result | [paint-beading.webp](assets/paint-beading.webp) |

The hero, swirled, corrected and coated plates were retained from the existing local prototype. The unprepared and water-beading plates were created with the built-in OpenAI image generation tool on 5 November 2026. ComfyUI was not used. Each new image preserves the source composition, and is resized to 1672 × 941 and encoded as an opaque WebP using [prepare-matched-states.mjs](tools/prepare-matched-states.mjs). The beading plate is a complete generated photograph, never a transparent droplet overlay. Existing unused tool assets are not loaded by this page.

Reduced motion and JavaScript-free viewing show all five photographs as a normal document sequence. The real customer gallery remains separate and unchanged.

## Generation prompts

### Hydrophobic state

Use case: precise-object-edit. Asset type: full-frame photographic hydrophobic paint state for a premium detailing website. Edit target: the attached emerald green paint-coated image. Keep the EXACT camera, crop, panel seams, sharp diagonal crease, metallic emerald colour, lighting and ALL broad white studio reflections in their exact pixel positions. Change only surface wetness: show naturally scattered clean water beads on this same ceramic-coated bonnet, physically plausible high contact angles, varied small bead sizes with a few medium beads, subtle refraction of the existing green paint and white light, real contact shadows. Fairly sparse elegant rainfall beading, clearly visible in the central paint area. Entire output is a complete opaque photograph of the same paint surface with water resting on it. No separate droplets or transparency, no floating droplets, no tools, hands, text, graphics, spray, puddles or change of perspective. Preserve the wide 1672:941 composition. Premium real macro automotive photograph, not CGI.

### Before preparation

Use case: precise-object-edit. Asset type: full-frame BEFORE PREPARATION photograph for a premium detailing website. Edit target: attached emerald green paint-before photograph. Preserve EXACT camera, framing, emerald hue, lighting, ALL white studio reflection shapes and positions, seams and diagonal crease. Keep every existing fine wash swirl and light marring intact. Add only LIGHT realistic bonded contamination: sparse tiny dull grey-brown road fallout flecks and minute tar specks adhering to the paint, scattered irregularly and visibly across the central paint area, subtle accumulated road film. This should still look like an expensive green bonnet, not a filthy or rusty car. Must register closely to reference for a crossfade. Full opaque photograph, same wide 1672:941 composition. No hands, tools, foam, water, text, illustrations, graphics or change in viewpoint. Do not polish away the swirls or move reflections.

## Local verification

Run `node tools/verify-matched-states.mjs` from this directory with the local preview running on port 4173. The check covers desktop, tablet, mobile, short landscape screens, forward/reverse scrubbing, full photographic states, chapter navigation, gallery shortcut and dialog, reduced-motion toggling, JavaScript-free viewing, asset failures and browser errors. Screenshots and a report are written to the ignored QA directory.

This refinement is local only. No push, deployment or publication was performed.
