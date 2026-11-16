# Polished & Pristine: an owned booking system

Research date: 14 November 2026. Status: proposal, not implemented.

## Recommendation

Build a purpose-made booking system in the existing Astro project, with a private owner dashboard and a portable PostgreSQL database. Use open-source components for the application and authentication. Use Stripe for card processing, not as the booking system. Hosting and email delivery remain replaceable infrastructure services.

This recommendation supersedes the initial comparison of rented booking platforms. No booking-platform subscription is proposed. No customer-facing website content or functionality has been changed by this research.

Ownership means the business controls the repository, deployment accounts, database exports, backups, domain and payment account. Third-party open-source components retain their own licences; the business controls its custom booking logic and customer records. Ownership does not remove hosting costs, payment fees or maintenance work.

## Confirmed requirements and boundaries

- Fast, mobile-friendly booking, with no mandatory customer account for an ordinary booking.
- Safe handling of customer details and payments.
- Online booking limited to 20 miles from the agreed Darlington base, with service-specific restrictions.
- Enquiries up to 25 miles can be discussed by phone or message, then booked manually if worthwhile. This is not an automatic extension of online coverage.
- An owner dashboard suitable for use on a phone between jobs.
- Discounts, loyalty and rewards supported by the design.
- Preserve the present website's appearance; do not redesign unrelated pages.

Not yet decided: exact base postcode, straight-line versus road-distance measurement, individual service boundaries, working hours, confirmed bookable prices and durations, and cancellation/rescheduling terms. Monthly infrastructure budget is also unconfirmed. These are setup decisions, not reasons to delay architecture research.

## What the current website actually does

The site is a static Astro build. The current quote builder prepares WhatsApp/email messages locally; it does not store enquiries, reserve appointments or take payments. Service prices and approximate durations are held in [services.json](../content/services.json). The ceramic package has an existing 20% deposit policy. Several other services have starting prices or enquiry-only pricing.

Public coverage wording currently refers to roughly 25 miles in places. It has been left untouched as instructed. A future booking-page implementation must explain the separate online boundary without silently rewriting other copy.

## Proposed technical foundation

| Part | Proposed approach | Why |
| --- | --- | --- |
| Public booking journey | Existing Astro site, matching current typography and colours | No website rebuild or third-party booking widget |
| Backend | TypeScript server endpoints through Astro's Node adapter | One codebase, own rules and validation |
| Database | PostgreSQL under the business's hosting account | Portable bookings, customers, payment references and rewards |
| Owner access | Better Auth with authenticator-app two-factor authentication and recovery codes | Maintained open-source authentication, not home-written password handling |
| Card payment | Stripe-hosted Checkout initially | Card details go to the processor rather than our server |
| Email | Replaceable transactional email API/SMTP provider | Confirmations, reminders and secure customer links |
| Background tasks | Database-backed jobs/outbox and a small worker | Reliable reminders, retries and hold cleanup |
| Deployment | Portable containers, HTTPS, database on a private network | Can move hosting provider without rebuilding the product |

Astro supports opting individual routes into server rendering while the rest remain pre-rendered. A Node adapter supplies the required runtime; uploading static files alone would no longer be sufficient for the booking features. [Astro rendering documentation](https://docs.astro.build/en/guides/on-demand-rendering/), [Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/).

Better Auth documents Astro integration and TOTP/recovery-code support; its core is MIT-licensed. It is a library we run, not a rented booking service. [Integration](https://better-auth.com/docs/integrations/astro), [two-factor authentication](https://better-auth.com/docs/plugins/2fa), [licence](https://github.com/better-auth/better-auth/blob/main/LICENSE.md).

For initial production, a small server plus PostgreSQL and encrypted off-server backups is viable. A managed PostgreSQL host is an optional operational choice, not a requirement or transfer of booking ownership. Either way, the deployed system runs continuously on hosting, not on John's laptop. Security updates and backup restoration remain real responsibilities.

## Customer journey

1. Select a service, or arrive with it already selected from its existing website button.
2. Enter the postcode. Show eligibility before requesting full contact details or payment.
3. Give the vehicle type and only the condition/access details needed for that service.
4. Choose an available appointment or request an assessment where a firm price is not possible.
5. See the full agreed price, discount, deposit and balance clearly before payment.
6. Pay the required deposit and receive confirmation, or receive a clearly labelled pending-review acknowledgement.

No app installation, account-creation wall or forced marketing signup. Provide phone/WhatsApp fallback without forcing every customer into a conversation. Customers can later use a verified, expiring email link to manage their booking or access rewards. Sensitive actions must not be triggered by simply opening a link: email scanners can open links automatically.

Do not invent a price calculator from the current starting prices. Before switching a service to instant booking, agree its vehicle-size/condition rules and firm durations. If the answers require a quote, show that before asking for money.

## Coverage and service-specific restrictions

Use a private base coordinate and a server-side rule for each service. Do not treat all DL or TS postcodes as eligible. A postcode lookup can supply coordinates; it is an approximation of an area, not an exact address. Borderline cases should receive address-level checking or manual review. Postcodes.io documents coordinate and accuracy fields and has a self-hostable open-source implementation. [Lookup documentation](https://api.postcodes.io/docs/api/lookup-postcode/), [source](https://github.com/ideal-postcodes/postcodes.io).

Proposed defaults, pending confirmation:

| Distance | Website action |
| --- | --- |
| Within the selected service's approved online area, never exceeding 20 miles | Allow eligible online services |
| Inside 20 miles but outside that service's smaller boundary | Offer a discussion; do not silently change the service or price |
| Over 20 and up to 25 miles | No self-service booking; offer phone/message enquiry |
| Beyond 25 miles | No automatic booking or coverage promise |

All area decisions must be repeated on the server when creating and rescheduling a booking. A browser-only postcode checker is not enforcement. An owner override for a manually agreed job records who approved it and why; it does not change public coverage.

Keep geographical eligibility separate from travel allowance. A 20-mile straight-line radius does not mean a 20-mile drive, and two customers on opposite edges of the area can be far apart. Start with conservative travel/setup buffers and maximum daily capacity. Add road-time calculations if the simpler approach is too restrictive. Do not depend on browser GPS or IP location to establish the job address.

## Which services should be instantly bookable?

These are recommendations based on the published menu, not new business policies:

| Services | Recommended starting behaviour |
| --- | --- |
| Essential Clean, Full Valet, Interior Deep Clean | Instant booking only once size, condition and price rules are agreed; unusual condition routes to review |
| Headlight Restoration | Potentially bookable after scope, lens suitability and duration are defined |
| Paint Enhancement and Paint Correction | Review/photos first where paint condition changes the work required |
| Ceramic Coating | Review vehicle, location and suitable conditions; agree price/date, then request the existing 20% deposit |
| Maintenance Plans | Owner-approved customer eligibility following the initial Full Valet; controlled repeat scheduling |
| Paint Decontamination | Define standalone duration and pricing rules before enabling slots |
| Caravan/Motorhome and PPF | Enquiry only until a priced, deliverable package is agreed |

Payment, approval and appointment status must be separate. A paid deposit is not evidence that weather or site conditions are suitable. For assessed services, approve the quote before opening the payment step. Do not auto-cancel or auto-refund jobs based solely on a weather forecast.

## Booking reliability

Availability must account for service duration, setup/pack-down, travel, breaks, leave and a full-day job's impact. Display local dates in Europe/London and store precise timestamps consistently so daylight-saving changes do not shift appointments.

The database must prevent overlapping reservations, not just hide occupied slots in the browser. PostgreSQL supports non-overlapping time-range exclusion constraints; use these with transactions for active reservations and holds. [PostgreSQL range constraints](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT).

For deposit bookings, reserve the slot during checkout and align the reservation's expiry with the payment session. Stripe's timed Checkout expiry has a 30-minute minimum; shorter custom holds require actively expiring the session and reconciling races. Do not release a slot while it can still be paid for. [Checkout expiry](https://docs.stripe.com/payments/checkout/managing-limited-inventory.md?ui=full-page).

Confirm payment from a verified Stripe event and process it only once, even if delivery is retried. A browser success page is not sufficient evidence of payment. Keep payment reference, deposit, remaining balance and refund status in our own records. Reconcile delayed payment events and alert the owner to conflicts rather than issuing a second appointment. [Stripe fulfilment](https://docs.stripe.com/checkout/fulfillment.md?ui=full-page).

The booking database is the schedule of record. Phone/message jobs must also be entered there. Calendar export can come first; later calendar sync must handle delays and must not be relied on as a double-booking lock.

## Owner dashboard

Initial dashboard:

- Today's jobs and week view, address, vehicle, booked work and contact shortcuts.
- New requests, quote approval and manual phone/message bookings.
- Block days, set hours, adjust durations and buffers.
- Deposit paid, balance due, payment failure and refund status.
- Weather rescheduling without accidentally charging or rewarding twice.
- Customer/vehicle history and private job notes.
- Per-service online coverage and logged manual exceptions.
- Promotion controls and reward balances, with an audit trail.
- Export bookings/customers and inspect notification failures.

Start with one owner and one working calendar, while modelling a resource identifier so another detailer can be added later. A private URL is not access control: protect both dashboard pages and every underlying endpoint.

## Discounts, loyalty and rewards

Use the booking backend as the authoritative calculator. Store money in integer pence and save a price/policy snapshot for each booking. A discount applies to the eligible service total before calculating its deposit; it is not merely a coupon attached to the deposit charge.

Support expiry, service eligibility, minimum spend, per-customer limits, redemption caps and explicit non-stacking rules. Reserve a redemption during checkout and release it when the attempt expires. Protect margin with configurable minimum prices; no reward should bypass an area rule.

Build a rewards ledger with separate earn, reserve, redeem and reversal entries. Award rewards after a job is completed and paid, not simply after someone books a slot. Reverse appropriately on refunds/cancellations and ensure retries cannot grant points twice. Verify access before showing a customer history or letting someone spend an existing balance. Knowing an email address alone must not allow redemption.

Launch with a simple return-visit credit or stamp scheme, not a complicated tier system. Reward amounts, eligible services and any expiry remain John's decisions. Referral rewards can follow once completed-job tracking is proven. Maintenance-plan eligibility is distinct from general loyalty.

Transactional booking messages and promotional campaigns need separate handling. Use optional, channel-specific marketing choices and keep unsubscribe records; do not make marketing consent a booking requirement. ICO guidance distinguishes administrative reminders from promotions and explains consent/soft-opt-in rules. [ICO guidance](https://ico.org.uk/for-organisations/advice-for-small-organisations/direct-marketing-and-data-protection/making-marketing-work-for-you-and-your-customers/), [service-message distinction](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/identify-direct-marketing/).

## Security and operations required before taking live bookings

- HTTPS, server-side validation and pricing; database credentials never exposed to customers.
- Owner two-factor authentication, secure sessions, role checks, rate limiting and protected state-changing requests.
- Stripe-hosted card entry; store references, never raw card numbers. This reduces card-data handling, but does not remove business compliance obligations. [Stripe security guide](https://docs.stripe.com/security/guide).
- Minimum necessary customer data; private photos if uploads are introduced, restricted types/sizes and no public customer-media bucket.
- Expiring customer tokens, no sensitive details in analytics, and redaction of secrets/customer data from logs.
- Updated privacy and booking terms reflecting actual storage, payment, cancellation and weather procedures before launch.
- Encrypted off-server backups, a tested restoration procedure, deployment rollback and monitoring of payment/email failures.
- Durable notification retries: an email failure must not delete a valid booking or silently lose the owner's notice.

## Costs and practical trade-offs

The custom application has no booking-platform subscription. Hosting, database operation/backups, domain, email and optional SMS still cost money. A provisional low-volume infrastructure allowance is £20–£60/month, excluding VAT, development, maintenance, SMS and card fees. This is an engineering estimate, not a hosting quote; managed database/support choices can take it higher.

Stripe's published standard UK-card fee is 1.5% + 20p per transaction. On a £50 ceramic deposit that is £0.95; a separate balance payment incurs its own fee. Premium/international cards and other products have different charges. [Stripe UK pricing](https://stripe.com/gb/pricing).

Owning the system is a good fit for the specific rules, but it is not maintenance-free or automatically safer than a mature hosted product. Budget for dependency/security updates, monitoring, backups and someone responsible for incidents. No production cost or implementation time should be promised before hosting and final scope are selected.

## Suggested delivery sequence

1. Agree booking rules and prototype the customer flow/dashboard with test data, preserving the existing design.
2. Implement postcode/service enforcement, real availability, owner access and manual booking. Keep all money in test mode.
3. Add deposit checkout, payment reconciliation, reminders, cancellations and rescheduling.
4. Activate controlled discounts and the simple rewards scheme after completion/refund accounting is working.
5. Run an isolated staging pilot, then launch only after production accounts, terms, backups and acceptance checks are ready.

Keep service data single-source. Initially import or consume the current JSON, without introducing a second independently editable price list. If dashboard editing later makes the database authoritative, explicitly migrate the website's service reads or publishing process at the same time. Existing paid bookings retain their original agreed price.

## Acceptance checks

- Inside/outside/borderline locations and each service restriction; a direct API call cannot bypass them.
- Manual 20–25-mile bookings work only for an authenticated owner with an audit record.
- Two customers selecting the same slot cannot both reserve it; travel and full-day jobs block the right time.
- Payment decline, abandonment, session expiry, delayed/duplicate events, refunds and a lost return-page connection.
- Discount/reward abuse, concurrent redemption, cancellations and completion retries.
- Unauthenticated access cannot expose bookings, vehicle history, addresses or rewards.
- Mobile/keyboard booking, clock changes, reminder retries and backup restoration.

Research is complete enough to choose the owned architecture. Exact service rules and production configuration still need agreement before implementation. No accounts have been created, purchases made, customer data uploaded or website source changed.
