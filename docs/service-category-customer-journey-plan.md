# Service category pages and customer journey

Planning date: 14 November 2026. Proposal only: no customer-facing pages changed by this plan.

## Implementation status

Local implementation completed 14 November 2026: Valeting and Paintwork pages are built, homepage pathways and footer links connected, Services category links added, long paintwork process reduced to a teaser on the hub, sitemap updated, and optional GSAP accent/process motion added. Ceramic retains its dedicated page with a contextual polishing link. All service anchors, centrally sourced prices and current enquiry routes are retained. This is a local preview, not a publication.

Verification: static build passed; 14 Playwright tests passed against the production preview, including new category-price and selected-service handoff tests, desktop/mobile accessibility, narrow layouts, no-JavaScript content and existing site functionality. Desktop and mobile screenshots reviewed. The normal local dev server remains separate from the temporary production test preview. Coverage wording remains an outstanding editorial issue; no unrelated coverage copy or per-service travel policy was changed.

## 1. Decision

Build two substantial category pages, retain the dedicated ceramic-coating page, and keep Services & Prices as the quick comparison hub. Keep the homepage as an introduction and signpost; do not rebuild it or repeat all the new detail there.

The customer should be able to answer four questions without detailing knowledge: “Is this what my car needs?”, “Can I see real work?”, “What does it cost?”, and “What do I do next?” A visitor who already knows the service should be able to enquire immediately.

```text
Homepage ──→ Services & Prices ──→ Valeting & interior cleaning ──→ Service enquiry
    │                │          Paint enhancement & correction ──→ Service enquiry
    │                └────────→ Ceramic coating (existing) ──────→ Coating enquiry
    └──────── direct links to each category ─────────────────────┘

Search / shared link ──→ any category directly (no mandatory homepage visit)
Gallery / Reviews ──→ relevant category or enquiry
```

Proposed routes:

- `/services/`: the existing comparison hub; retain every existing service anchor.
- `/valeting/`: Valeting & interior cleaning.
- `/paint-correction/`: Paint enhancement & correction, including decontamination.
- `/ceramic-coating/`: existing individual service page, retained.
- Specialist services remain on `/services/#specialist`. Do not create thin pages for PPF, caravans or motorhomes, or add unconfirmed packages.

These are proposed new routes, not currently live links.

## 2. Customer paths

| Customer intent | Entry and next choice | Evidence needed | Enquiry handoff |
|---|---|---|---|
| “The family car needs a good clean” | Homepage or Services → Valeting | Interior results, plain-language comparison of regular/deep cleaning | Chosen service preselected |
| “The seats are dirty” | Direct Valeting entry → Interior Deep Clean anchor | Same-job seat photos and Gordon's actual review | `service=interior-deep-clean` |
| “The paint looks dull or scratched” | Services → Paintwork | Enhancement/correction comparison; assessment, polishing and finished photographs | Specific service, or advice if uncertain |
| “I want ceramic protection” | Direct Ceramic entry or homepage category link | Emerald BMW, coating preparation, product, Ian's quote, existing terms | `service=ceramic-coating` |
| “I'm not sure” | Any page → advice enquiry | Reassurance that condition and goals determine the recommendation | `service=not-sure`; do not guess a package |
| “I've used you before” | Services → price/service anchor → enquiry | Price and contact routes immediately available | No forced educational journey |

An enquiry is not a confirmed booking. Preserve the current process: website prepares the message; customer sends it through WhatsApp or email; work, price, time and location are agreed directly. No new calendar, payment, account, customer database or form provider in this project.

## 3. Visual direction and restraint

Continue the existing design rather than introduce a new theme:

- Paper `#f1f2ef`, pale grey-green `#e3e7e5`, ink `#152027`, deep `#090f13`, blue accent `#315ee7`, muted text `#536169`.
- Existing Barlow Condensed headings and Manrope body text. Reuse semantic CSS variables and existing buttons/icons.
- Left-aligned copy, restrained section rhythm, readable body text at least 16px. Captions should be readable, not tiny decorative labels.
- Real customer cars and actual work carry the visual identity. No generated vehicle results, cartoon owner, stock-detailer imagery or additional selfie placements.
- About retains the small mirrored owner portrait. Other pages build personal trust through direct language, real jobs and genuine reviews.

Considered a repeated full-screen hero/gallery layout and rejected it: it would repeat the current site's strongest visual device while delaying service selection. Instead, use a compact opening followed by practical comparison and photographic evidence.

```text
Desktop category opening             Mobile category opening
[ Clear H1 + explanation ][ Photo ]   [ Clear H1 + brief explanation ]
[ Starting price + action ][       ]  [ Price + enquiry / see prices ]
[ Short, readable reassurance ]      [ Compact relevant photo ]
[ Compare suitable options ]         [ Compare options, stacked ]
```

## 4. Homepage: light-touch changes only

Keep the current hero, trust ribbon, three pathways, selected work, personal introduction and enquiry routes.

1. Change the valeting pathway destination from the Services anchor to `/valeting/`.
2. Change the paintwork pathway to `/paint-correction/`.
3. Keep the ceramic pathway and feature pointing to `/ceramic-coating/`.
4. Keep Services & Prices as the cross-category comparison destination.
5. Retain centrally sourced price labels; do not add another price list.
6. Only trim copy if it repeats a new category explanation word for word. Do not remove the homepage's overview role.

Avoid making the header wider with two additional top-level links. Keep Services as the main route to categories; show clear category links on the hub and contextual links in the footer. No new dropdown dependency required.

## 5. Services & Prices hub

Keep prices easy to reach: do not move them to the bottom to force scrolling.

- Opening: short explanation, three category links with confirmed starting prices and an advice route.
- Retain the popular-service price snapshot and category anchors.
- Each category summary: what it solves, concise price comparison and a prominent “Explore…” link.
- Preserve service IDs such as `#full-valet`, `#paint-enhancement` and `#ceramic-coating`, plus direct enquiry links.
- Keep a concise version of the existing menu and native inclusion disclosures in the first release. Do not remove useful content or break old links during the move.
- Move the longer paint-process story to the paintwork page; leave a compact teaser on the hub. The hub compares; the category page explains.
- Specialist entries remain available with their current enquiry wording and prices.

## 6. Valeting & interior cleaning: page sequence

1. **Recognise the need.** Suggested heading: “A regular refresh. Or a deeper clean.” Explain that a valet cleans the car, while polishing addresses paint marks. Use a relevant interior photograph, not an enormous luxury-car montage.
2. **Visible price and shortcuts.** Show Essential Clean from £45, with “Compare cleaning options” and the primary enquiry action. Link directly to package anchors so returning customers can skip the story.
3. **Choose the level.** Compare Essential Clean, Full Valet and Interior Deep Clean by customer need, inside/outside scope, confirmed inclusions, duration and price. Essential is upkeep; Full Valet is deeper inside-and-out cleaning; Interior is cabin-only care. Explain maintenance separately as an agreed return-visit plan, with no invented frequency or saving.
4. **See a real interior clean.** Reuse `seat-before` and `seat-after` side by side/stacked, with their honest different-angle/light note. Not an aligned drag slider: the photographs are not matched viewpoints. Supporting `honda-interior`, `mercedes-interior` or `light-leather-interior` images can show materials, but must not be presented as the same job.
5. **One useful preparation fact.** “We bring our own water and power.” Follow with what the customer needs to discuss: location and vehicle condition. Do not invent access, drainage or electricity requirements.
6. **Relevant reviews.** Gordon beside interior cleaning; Nadine alongside the general valeting comparison. Do not rename Nadine's service as a specific package. Link to original platform profiles.
7. **Set expectations.** Existing wear may remain; send condition photos to discuss suitability. Do not promise every stain/odour will be removed, sanitisation, or an as-new restoration.
8. **FAQs and handoff.** Explain choosing a level, maintenance enquiries, vehicle size/condition and location. Repeat specific service enquiries and one advice route. No automatic upsell to polishing.

## 7. Paint enhancement & correction: page sequence

1. **State the problem plainly.** Suggested heading: “Dull paint. Swirls. A clearer way forward.” Explain swirls as fine circular-looking marks, often most noticeable in strong light.
2. **Price and choice early.** Enhancement £170; Correction £200. Include an advice option rather than assume that scratches mean correction.
3. **Side-by-side comparison.** Enhancement: single-stage polishing focused on light marks and gloss. Correction: more intensive polishing for noticeable marks where the paint allows. Include existing preparation/protection and approximate durations. Clearly state deep marks may remain; never claim a universal correction percentage.
4. **The real process.** `range-assessment` → `polishing` → `range-detail`, each with a separate image window and caption outside it. On mobile, use a clean vertical sequence instead of overlapping stacks. Keep assessment, work and result identifiable.
5. **Blue BMW supporting result.** Use `blue-bmw-finish` as a separate finished-work example. It is not stage four of the Range Rover job, not Ian's vehicle, and not evidence of a specific coating/package without confirmation.
6. **One educational fact.** “A coating protects paint; polishing improves its appearance.” Explain the distinction without implying all marks disappear. Place the link to ceramic coating here for customers seeking protection, not as a prerequisite to enquiry.
7. **Customer evidence.** Leslie's verified paintwork quote, described as paintwork care. It supports the category but does not prove the named Correction package. Ian can support polishing plus coating only where labelled accurately; avoid repeating him throughout this page unnecessarily.
8. **Practical questions.** Which level is appropriate, deep scratches, expected timing and suitable conditions. Use approved source facts or ask the owner; no invented paint-thickness procedures/equipment claims.
9. **Enquire with context.** Buttons preselect enhancement or correction; “Help me choose” leaves advice selected. Encourage photos without suggesting the website uploads or stores them.

## 8. Ceramic coating: preserve, connect, refine

Keep the existing dedicated page, Emerald BMW story/video, Range Rover polishing and Matrix Blue bottle. Do not turn it into another category hub or replace its design.

- Keep “From £250”, approximate full day, 20% deposit, vehicle-size/condition caveat and suitable dry-weather/curing conditions.
- Keep Ian's Google excerpt with the current Google profile link and honest excerpt label.
- Link to the paintwork explanation only when customers need to understand polishing; the coating package already includes its stated preparation and single-stage polish. Do not imply a compulsory extra £170 or £200 charge.
- No new aftercare promise, included wash, maintenance interval or warranty conditions without owner confirmation.

## 9. Price and fact lock

Read prices/inclusions from [the existing service data](../content/services.json), not copied page constants or external booking profiles.

| Service | Existing published price | Existing timing |
|---|---|---|
| Essential Clean | From £45 | Approx. 2 hours |
| Full Valet | From £85 | Approx. 3–4 hours; varies with vehicle size |
| Interior Deep Clean | From £80 | Approx. 2–3 hours |
| Maintenance Plans | Enquire for pricing | Not specified |
| Paint Decontamination | From £60 | Not specified |
| Paint Enhancement | £170 | Approx. 3–4 hours |
| Paint Correction | £200 | Approx. 5 hours / most of a day |
| 3-year Ceramic Coating | From £250 | Approx. one full day |
| Headlight Restoration | £60 | Approx. 1–2 hours |
| Caravan & Motorhome | Enquire for pricing | Not specified |
| PPF | Enquire for pricing | Not specified |

Do not add “from” to the fixed prices, invent durations for unspecified work, create combined-package totals, discounts or savings, or introduce soft-top pricing. Confirm the service/quote before work.

Review totals remain the dated central snapshot, not an automatically verified live feed. Preserve customer wording and supported service matches; do not invent individual review URLs or put a named review beside an unrelated car as though they are the same job.

Coverage requires careful handling: the owner instructed 20 miles for website/online safeguarding, with up to 25 miles considered by phone/messages. Current homepage, About and Booking still say roughly 25 miles. Flag this inconsistency; do not silently expand coverage, invent per-service travel rules, or change unrelated existing pages as part of this plan. Before publishing new pages, settle the exact public wording with the owner; proposed wording is “Based in Darlington. Online service area within 20 miles; contact us about locations up to 25 miles.” No radius enforcement exists in the current enquiry form.

## 10. Animation: useful emphasis, not a scrolling obstacle

Reuse installed GSAP and ScrollTrigger. No new animation service or subscription. Existing [site script](../src/scripts/site.js) already registers ScrollTrigger and uses reduced-motion matching.

| Moment | Proposed treatment | Why / limits |
|---|---|---|
| Relevant fact beside real work | A short line/accent sweeps 20–24px into its resting position over about 0.45 seconds, once | Draw attention to one useful explanation; text is already readable, remains still afterwards |
| Paint preparation sequence | Connecting accent line progresses with normal scrolling on wider screens; images/captions stay stationary | Clarifies sequence without simulating a change to the paint |
| Package inclusions / FAQs | Immediate native disclosure, optional small icon rotation | Responds to the customer's action, not a timed sales presentation |
| Existing video | Clear play button, caption below controls, deliberate customer playback | No sound autoplay or controls hidden behind captions |

At most one signature scroll treatment per new page. No sweeping every paragraph, full-screen pinning, scroll hijacking, horizontal-scroll stories, animated review counters, text flying across the screen, or artificial shine wipes over photographs. Prices, CTA buttons and safety caveats never wait for animation.

Reduced-motion: render the final static state and omit translation, drawing/scrubbing and decorative autoplay. No-JavaScript: all text, prices, links and evidence remain visible. Keep factual text in HTML rather than canvas or an animation-only layer.

Technical guardrails: scope new triggers to category pages; create them in document order; animate transforms/opacity rather than layout dimensions; reserve media space; avoid forced scroll handlers; refresh after fonts/media affect geometry; clean up responsive animation contexts. Do not attach a child ScrollTrigger inside a controlling timeline. Use a single coherent entrance trigger rather than combining scrub and toggle playback for the same effect.

Sources for implementation: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP responsive and reduced-motion matching](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), and [W3C guidance on disabling non-essential interaction animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). W3C's cited interaction-animation criterion is AAA; reduced-motion support is a deliberate design requirement here, not a claim that every suggestion is an AA requirement.

## 11. Build order and acceptance

1. Build Valeting first, using the existing design and shared data. Review desktop/mobile before duplicating any structure.
2. Build Paintwork with its own evidence-led composition, not a text-swapped clone.
3. Add hub/category/homepage/footer links and preserve old anchors. Keep ceramic changes limited to useful cross-links.
4. Add selected motion only after the static journey works.
5. Add the routes to the sitemap and page/accessibility/link tests; verify titles, descriptions and canonical URLs. No promises of search rankings and no invented review rich-result markup.
6. Check all displayed prices against the central data; confirm every package CTA preserves the service through the current message builder.
7. Test 320, 390, 768, 1024 and 1440px, landscape, 200% zoom, keyboard, no-JavaScript and reduced motion. Check no horizontal overflow, clipped captions, broken media or fixed bars covering focused controls. Keep touch targets comfortably usable (aim 44px).
8. Check static build and all existing tests, add route-specific tests, and visually inspect both new pages. Existing services, quote routes and ceramic terms must remain intact.

No new analytics/tracking integrations are needed. First assess the journey with actual task walkthroughs: find an interior service and its price; explain enhancement versus correction; find ceramic terms; send the correct service enquiry. Any later conversion analytics is a separate decision.

Completion means a customer can choose, inspect proof, find the price and enquire without needing to understand detailing terminology or sit through animation. This plan does not authorise replacing the current enquiry system, changing prices or rebuilding the homepage.
