# Reference-led paint sequence

This revision uses the three images supplied by the user as the visual source. It replaces the previous bonnet-crop interpretation.

| Shot | Source / runtime asset |
| --- | --- |
| Hero | [Supplied coupe](assets/Emerald%20Coupe%20in%20Dramatic%20Studio%20Light.png), [WebP](assets/reference-vehicle.webp) |
| Before | [Supplied paint](assets/Emerald%20Paint%20Before%20Ceramic%20Coating.png), [WebP](assets/reference-before.webp) |
| Clay treatment | [Supplied clay photograph](assets/Clay%20Detailing%20on%20Emerald%20Green%20Paint.png), [WebP](assets/reference-clay.webp) |
| Clean, still swirled | [Generated edit](assets/reference-clean.webp) |
| Machine polished | [Generated edit](assets/reference-polished.webp) |
| Ceramic protected | [Generated edit](assets/reference-protected.webp) |
| Hydrophobic result | [Generated full image](assets/reference-hydrophobic.webp) |

The four missing conditions were generated with the built-in OpenAI image tool, each referencing the supplied before photograph and preserving its perspective, metallic emerald colour and inspection-light reflections. The complete [prompt set](reference-image-prompts.json) is retained. ComfyUI was not used. The water-beading result is one full opaque image, not transparent droplets or a procedural overlay.

The supplied clay photograph appears as a complete treatment image between the before and clean states. Its hand is part of that original photograph; it never moves independently or enters as an overlay. Clay treatment and the clean-but-still-swirled result are separate beats, with accurate short explanations.

The hero camera pushes into the bonnet and dissolves into the supplied close-up. The close-up is a separate reference composition, not claimed to be an exact crop of the hero. Subsequent paint conditions use the same framing and gentle opacity dissolves. Portrait viewports preserve a wider view of the photograph with the caption below. Reduced motion and JavaScript-free viewing show all six process photographs in document order.

The existing customer photographs, shortcut, service details and booking destinations are retained. Browser verification covers desktop, tablet, mobile, short landscape, forward/reverse scrubbing, chapter controls, gallery shortcut/dialog, reduced-motion toggling, no JavaScript and failed image/library loading. Run `npm run verify:matched`; results are saved in the ignored QA directory.

Local prototype only. No push, merge or deployment.
