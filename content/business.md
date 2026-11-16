# Polished & Pristine — Business reference

**Information source:** [current live website](https://polishedpristinedetailing.co.uk/) and its linked pages, checked **12 November 2026**. This file records published information for the new website build. For structured service prices and inclusions, use `services.json`.

## Business and positioning

- **Published trading name:** Polished & Pristine Mobile (brand: Polished & Pristine).
- **Base:** Darlington, County Durham, England.
- **Business type:** Professional, fully mobile vehicle detailing and valeting.
- **Core specialisms:** Paint enhancement, paint correction, ceramic coating, interior and exterior valeting.
- **Customer convenience:** Work at customers’ homes or workplaces; the business says it carries its own water, power and professional equipment.
- **Water claim on current website:** Deionised/pure water for spot-free results.
- **Insurance claim on current website:** Fully insured.
- **Owner:** John (the homepage introduces the detailer as John; the biography is currently unfinished).
- **Review totals confirmed by the owner on 14 November 2026:** Google 21 reviews at 5/5; Clean Me 64 reviews at 5/5; Facebook 7 reviews with 100% recommending. Total: 92 platform reviews, not necessarily 92 distinct customers. The supplied Clean Me and Facebook screenshots support those platform figures; the Clean Me profile was also checked directly. Store dated totals and profile links centrally in `src/data/reviews.js`; these are snapshots, not a live feed. Do not combine the platforms into a single star rating.

## Contact and enquiries

| Contact route | Value on current website |
| --- | --- |
| Website | https://polishedpristinedetailing.co.uk/ |
| Email | polishedpristinemobile@gmail.com |
| Telephone displayed for calls | 07776 732135 |
| WhatsApp link number | +44 7468 286651 (07468 286651) |
| WhatsApp URL | https://wa.me/447468286651?text=Hi+John%2C+I%27d+like+to+get+a+quote+for+a+detail |
| Quote page | https://polishedpristinedetailing.co.uk/booking/ |

**Action to verify:** The displayed telephone number and the number used by the WhatsApp links differ. Confirm that both are intended before publishing the new site. Preserve them as separate contact routes unless corrected. (verified by user now)

### Booking process described on the website

1. Customer describes the vehicle and the work needed by WhatsApp, phone or email.
2. The service, approximate duration, availability and quote are confirmed.
3. Mobile service is provided at the agreed home or workplace location.

The current website says quoted prices can depend on vehicle size and condition. No opening hours or guaranteed response time are published.

## Service area

- Based in **Darlington**, serving the wider North East.
- **Current owner-confirmed coverage:** The advertised website service area is within **18 miles of Darlington**. Anything farther away is by direct enquiry; do not publish a guaranteed outer limit, travel charge or per-service restriction without confirmation. This supersedes the older 20/25-mile wording. Nearby town names are illustrative, not a guarantee for every address. Central coverage wording and radius live in `src/data/business.js`; the current enquiry form does not automatically calculate or enforce distance.
- **Custom coverage map created with the owner signed in, 14 November 2026:** Google My Map `16J7yGnqVkX79KCuSRwe20k6c4Fvxkac`, viewable by anyone with the link (view only). The custom map replaces the original town-only Google embed. It contains one shaded 18-statute-mile geodesic polygon calculated on WGS84 around the public Darlington reference point 54.5311948, -1.55334835, not the owner's private base address. This is a straight-line guide, not driving distance or automatic postcode approval. No home marker is published. KML backup: `maps/darlington-18-mile-coverage.kml`. Embed/viewer URLs are central in `src/data/business.js`. The separate `googleMaps` business-profile link must not be confused with the custom coverage map.
- Other pages use broader descriptions. Avoid implying that every address throughout County Durham, Teesside or North Yorkshire is covered automatically. Confirm travel availability for enquiries outside the normal area.

## Services and policies

The complete structured service menu is in `services.json`; current advertised prices are:

| Service | Published price |
| --- | --- |
| Essential Clean | From £45 |
| Full Valet | From £85 |
| Interior Deep Clean | From £80 |
| Maintenance Plans | Enquire |
| Paint Decontamination | From £60 |
| Paint Enhancement | £170 |
| Paint Correction | £200 |
| 3-year Ceramic Coating | From £250 |
| Headlight Restoration | £60 |
| Caravan & Motorhome | Enquire |
| Paint Protection Film (PPF) | Enquire |

**Ceramic coating details from the dedicated page:** Autosmart Matrix Blue, three-year coating; includes decontamination, single-stage machine enhancement, panel preparation, and coating of exterior glass and wheel faces. Suitable dry weather and curing conditions are required; a 20% booking deposit applies. The website estimates about one full day for the service.

**Maintenance plans:** The current site states that an initial Full Valet establishes the clean baseline, with later visits based on Essential Clean. Frequency and fees are not published.

**Headlight restoration:** Website describes progressive wet sanding, two-stage polishing and three-year ceramic protection.

**Specialist enquiries:** Caravan/motorhome and PPF are enquiry categories, not fully priced packages on the live site.

## Website content and structure to preserve or assess

- [Homepage](https://polishedpristinedetailing.co.uk/): Hero, selected services, detailing process, before/after, real-world results, owner introduction, Google reviews, quote calls to action.
- [Services](https://polishedpristinedetailing.co.uk/services/): Current full pricing and service inclusions.
- [Gallery](https://polishedpristinedetailing.co.uk/gallery/): Real work, before/after slider, photographs and video examples.
- [Ceramic coating](https://polishedpristinedetailing.co.uk/ceramic-coating/): Autosmart Matrix Blue service and explanatory visual sequence.
- [Booking](https://polishedpristinedetailing.co.uk/booking/): WhatsApp, phone and email quote routes.

### Authenticity and review notes

- **Customer quotations updated 16 November 2026:** Display full reviews only. Six Clean Me reviews were transcribed from owner-supplied screenshots (Tomas, Gordon, Leslie, Nadine, Paul and Carl). Preserve their text exactly, including spelling, punctuation and capitalisation; do not shorten or paraphrase it. Use quotation marks and italic styling. Display surnames as initials only. The owner supplied Ian S.'s complete Google review on 16 November 2026: publish that exact text without an excerpt label. The supplied relative date, “4 weeks ago”, is not an exact publication date. Dates are shown only when present in the evidence. Quotations are stored centrally in `src/data/reviews.js`.
- **Service matching:** Gordon explicitly describes interior deep cleaning; Nadine describes valeting (not a confirmed particular package); Leslie describes smooth, polished paint (not a confirmed correction package); Ian explicitly mentions machine polishing and ceramic coating. Roof reviews appear on Reviews only because the current service menu does not list a soft-top package. Do not fill unverified service gaps with unrelated testimonials. The owner confirms Jessie's earlier four-star rating was subsequently corrected to five; the supplied screenshot predates that correction.

- The ceramic coating page clearly marks its emerald-green studio imagery as **AI-generated illustrative content**, distinct from the real customer-work gallery. Preserve this distinction if any illustrative media is reused.
- The homepage displays three named Google-review excerpts and a five-star rating. Reuse customer quotes only after confirming the associated review links and current permission/accuracy; the complete review text has **not** been copied into this reference file.
- The homepage currently has an unfinished owner-bio placeholder. Use a confirmed biography rather than copying that placeholder into the new site.
- The Google link labelled “Read more reviews” appeared to point to a **write-review** URL (`https://g.page/r/CdCapvxgK3U1EBM/review`), so locate the proper read-reviews/profile link before adding a read-reviews button.
- **Review links added on 14 November 2026:** The Google short link without `/review` (`https://g.page/r/CdCapvxgK3U1EBM`) resolves to the business Maps profile. Owner-supplied profiles: Clean Me `https://booking.cleanme.co.uk/washer/polished-pristine-mobile`; Facebook `https://www.facebook.com/PolishedandPristine`. Link to the original platforms; do not invent review text, reviewer names or a cross-platform aggregate rating.

## Information not established by the website

Business opening hours, detailed business address, legal registration, fixed booking availability, exact maintenance-plan frequency, cancellation policy, social-media profiles other than the confirmed Facebook page, and precise general coating curing time are not confirmed here. Obtain confirmation before making specific claims. Review counts are the dated owner-confirmed snapshot above.

## Editing guidance for the new site

- Treat `services.json` as the **single editable source for prices, durations and service inclusions**; components should consume it rather than duplicate these details in HTML.
- This `business.md` records verified contact, policies, coverage and messaging. It is background content for Codex, not itself a page to publish.
- The customer-approved media library is in the project's `source-photos/` directory. Use genuine work for portfolio/result claims.
- Publish only after resolving the contact-number discrepancy and reviewing the business facts.

## Source pages

1. https://polishedpristinedetailing.co.uk/
2. https://polishedpristinedetailing.co.uk/services/
3. https://polishedpristinedetailing.co.uk/gallery/
4. https://polishedpristinedetailing.co.uk/ceramic-coating/
5. https://polishedpristinedetailing.co.uk/booking/
