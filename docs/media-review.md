# Media decisions

Initial review: 12 November 2026. All 12 existing job contact sheets were inspected to understand the 320-asset library. Selected original photographs and sampled video frames were then inspected more closely. The first build used 13 image sets and one silent clip; subsequent selections and the current use are documented below.

## Condition classification

The selected assets and exact source paths are in [media-selection.json](../content/media-selection.json). The full source inventory is classified in the local-only `asset-review/site-classification.json`. Assets not selected remain **uncertain** for publication: contact-sheet review alone is not approval of every frame or a claim about a particular treatment.

| Condition | Website use |
| --- | --- |
| After | Homepage Porsche, finished blue paint details, grey Range Rover finish, BMW ceramic-job still, clean Porsche/Honda/Taycan/Mercedes interiors, cleaned passenger seat, BMW reflection clip |
| During | Machine polisher working on the Range Rover; coating-product context beside the vehicle |
| Before | Marked passenger seat and visible debris at the console and rail |
| Uncertain | Unselected originals; no use on the public site |

## Important correction to the earlier shortlist

The seat capture `video_capture_1785437872407.jpeg` shows visible dirt despite its later capture filename. It is classified **before**, not after. The selected after image is `video_capture_1785437894553.jpeg`: the passenger-seat lever, console, pattern and blue sill identify the corresponding seat, with the cleaned fabric and rail visible.

The two frames have different viewpoints and lighting. They appear side by side with explicit captions and that limitation, retaining their full source framing. They are not presented as a perfectly aligned slider. No stains, scratches or dirt have been digitally removed.

## Promotional imagery

The finished blue Porsche front leads the homepage, using a documented 4:3 crop from the real portrait original. Desktop immerses the headline in the blue paintwork; mobile presents the recognisable front immediately after the headline, ahead of the supporting copy and enquiry action. The original driveway context is retained. No foam-covered car or dirty interior is used as the main promotional image.

Range Rover and BMW photographs come from ceramic-job folders. Captions describe the work context; reflections alone are not treated as proof of coating performance, application or a measured correction percentage. The product bottle is labelled preparation/context rather than a coating demonstration.

## Derivatives and video

Images are resized without enlargement into up to four widths: 480, 800, 1200 and 1600 pixels. AVIF and WebP files are generated without retained EXIF/GPS metadata. Source colours and defects are not retouched. Full-frame derivatives are retained; layout crops only change composition.

The green BMW still is extracted at 0.68 seconds from `PXL_20260808_170527676.mp4`. The separate reflection video uses 1.04–4.14 seconds from `PXL_20260808_170609742.mp4`, converted to 720px H.264 at 30fps, with its audio removed. It is user initiated, has native controls and a written visual description. It pauses if the browser page becomes hidden.

Original photographs, videos, catalogue files and private tooling do not enter the static deployment. Only explicitly selected derivatives are in the public directory.

## Creative redesign selections — 13 November 2026

The library's exterior contact sheets were reconsidered for stronger photographic composition. Selected originals were inspected individually, including distributed video frames. Exact provenance, crop coordinates, dimensions, output sizes and stage classifications are recorded in [art-media-selection.json](../content/art-media-selection.json). Reproduce these with [build-art-media.mjs](../tools/build-art-media.mjs).

The blue Porsche front crop, emerald BMW rear quarter, black Mercedes exterior and Porsche centre console add different angles and scales to the redesigned portfolio. All are classified after. Existing machine-polishing and product-context images remain explicitly process material. The marked seat remains confined to a labelled transformation.

The homepage's new four-second silent Mercedes excerpt shows the headlight and reflective bonnet. Fourteen distributed frames, including both edit points, were checked for finished condition. A matching poster is supplied. The excerpt is 1280×720 H.264, about 1.12 MB, with no audio. It plays only while visible, offers a pause control, and defaults to a still under reduced motion or data-saving preferences. This is separate from the user-initiated BMW gallery film.

New crops and encodes do not remove objects, retouch defects or change vehicle colours. Unselected assets remain uncertain for public use rather than being automatically labelled finished work.

## Photographic edit and job stories — 13 November 2026

The three mixed-exterior contact sheets, interior sheet, seat sheet and Range Rover sheet were reconsidered for variety and evidence. Selected original photographs and exact extracted frames were inspected individually. [Editorial selection provenance](../content/editorial-media-selection.json) records five further image sets, produced by [the editorial media builder](../tools/build-editorial-media.mjs).

- After: a white Vauxhall Insignia, blue BMW front, Audi wheel/rear quarter and light-leather passenger cabin. These are finished-looking results, with no unsupported claim about which treatment each received.
- Before: the Range Rover door during initial assessment, with visible fine marks and droplets. Its same-job machine-polishing photograph and completed vehicle photographs support a clearly labelled assessment → preparation → finish story. Different panels and lighting are disclosed. It is not an aligned comparison or evidence of a measured defect-removal percentage.
- The passenger-seat pair remains the verified interior before/after example. Its fabric, console and rail provide matching context; differing light and angles remain explicit. Existing wear has not been retouched.

The gallery now contains sixteen portfolio images plus the two job-story sections and the existing user-initiated film. More of the selected work appears across the homepage, Services and About, rather than repeatedly relying on the same few vehicles. No extra before/after pair was manufactured to reach a target number of case studies.
