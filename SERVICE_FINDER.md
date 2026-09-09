# SERVICE_FINDER.md

## Polished & Pristine Mobile — Interactive Service Finder Specification

**This file is the authoritative specification for the interactive Service Finder.**

`SERVICES.md` is the factual source of truth for services, pricing, durations, inclusions and exclusions.

`SERVICE_FINDER.md` is the source of truth for the Finder's user journey, questions, branching logic, recommendations and behaviour.

The two files must never contradict each other.

AI coding agents must not invent, rename, combine, remove or alter services, prices, durations or service details.

---

# 1. Purpose

The Service Finder is a small interactive web-app-style experience embedded within the Polished & Pristine website.

Its purpose is to help customers who:

* Know roughly what they want but do not know the correct service name
* Are unsure which service their vehicle needs
* Want to compare suitable options without repeatedly opening and leaving service pages
* Need a simple recommendation based on what they are trying to achieve

The Finder should make the decision easier without making the customer feel like they are completing a long questionnaire.

The customer should normally reach a recommendation within approximately 2–5 decisions.

---

# 2. Core Principle

The customer describes the problem or desired result.

The Finder translates that requirement into the appropriate Polished & Pristine service.

The customer does not need to understand detailing terminology.

For example:

Customer:

> "My paint looks dull."

Finder:

> Paint Enhancement

Customer:

> "I've got loads of swirl marks."

Finder:

> Paint Correction

Customer:

> "I want the paint improved and protected for years."

Finder:

> Ceramic Coating

The Finder performs the decision-making.

---

# 3. Entry Point

The existing website section:

> What does your car need?

should act as the main entry point into the Service Finder.

Primary CTA:

> Help me choose

Secondary option:

> Browse all services

The customer must always have the option to bypass the Finder and browse the full service list.

The Finder must never trap the customer inside the decision process.

---

# 4. Overall User Journey

The preferred journey is:

1. Introduction
2. First decision
3. Relevant follow-up question
4. Optional additional question
5. Recommendation
6. Service details / quote CTA
7. Optional alternative services
8. Ability to change answers or restart

Questions must branch according to previous answers.

Do not show irrelevant questions.

---

# 5. Introduction Screen

Suggested wording:

> ## Let's find the right service for your car
>
> Answer a few quick questions and we'll point you towards the service that's right for your vehicle.

Primary button:

> Help me choose

Secondary button:

> Browse all services

The introduction should be brief.

Do not create a long explanation before the Finder begins.

---

# 6. Question 1 — Main Requirement

Question:

> ## What are you looking to achieve?

Display large selectable cards.

### Answer A — Get it properly clean

Description:

> Give the interior and/or exterior a thorough clean.

Branch:

`CLEANING`

---

### Answer B — Improve the paintwork

Description:

> Bring back gloss, clarity and improve the finish.

Branch:

`PAINT`

---

### Answer C — Protect the paintwork

Description:

> Add long-lasting protection and make future maintenance easier.

Branch:

`PROTECTION`

---

### Answer D — Restore something that's looking tired

Description:

> Improve a specific area such as faded or cloudy headlights.

Branch:

`RESTORATION`

---

### Answer E — Caravan or motorhome

Description:

> Tell us what your caravan or motorhome needs.

Branch:

`CARAVAN_MOTORHOME`

---

### Answer F — I'm not sure

Description:

> Ask me a few simple questions and help me work it out.

Branch:

`UNSURE`

---

# 7. CLEANING Branch

Question:

> ## What needs the most attention?

### Answer A — The whole car

Recommendation:

**Full Valet**

Reason:

The customer wants a thorough clean of both the interior and exterior.

Display factual information from `SERVICES.md`:

* From £85
* Approx. 3–4 hours depending on vehicle size
* Complete interior deep clean
* Thorough exterior clean

Do not invent additional inclusions.

---

### Answer B — Mainly the interior

Recommendation:

**Interior Deep Clean**

Reason:

The customer's main requirement is a deep interior clean and they do not primarily require an exterior service.

Display:

* From £80
* Approx. 2–3 hours
* Interior-only deep cleaning

---

### Answer C — It's already fairly clean

Recommendation:

**Essential Clean**

Reason:

The vehicle mainly requires a standard maintenance clean rather than a deep interior clean or paint correction.

Display:

* From £45
* Approx. 2 hours

---

### Answer D — I want regular upkeep

Recommendation:

**Maintenance Plans**

Reason:

The customer is looking for ongoing professional maintenance rather than a one-off deep clean.

Important:

Maintenance Plans require an initial Full Valet before entering the plan.

No Maintenance Plan price or fixed duration may be displayed because these have not been defined in `SERVICES.md`.

The Finder may explain the Full Valet requirement using information from `SERVICES.md`.

Do not invent a Maintenance Plan price.

---

# 8. PAINT Branch

Question:

> ## What's bothering you most about the paint?

### Answer A — It's dull or lacks gloss

Recommendation:

**Paint Enhancement**

Reason:

Paint Enhancement is designed for tired, dull or lacklustre paintwork where the main goal is restoring gloss, clarity and depth.

Display:

* £170
* Approx. 3–4 hours
* Paint Decontamination included
* Machine polishing
* Fine polishing and finishing
* Up-to-3-month paint protection

Do not describe Paint Enhancement as intensive correction.

Do not promise removal of all defects.

---

### Answer B — I'm seeing swirls and paint defects

Recommendation:

**Paint Correction**

Reason:

Paint Correction is designed for paintwork with swirl marks and suitable defects that can safely be corrected within the clear coat.

Display:

* £200
* Approximately 5 hours / most of a day
* Paint Decontamination included
* Machine polishing/correction
* Approximately 95% correction of suitable defects
* Finishing stage where required
* Up-to-3-month paint protection

Never promise 100% correction.

Never imply that deep scratches requiring sanding and paint repair are included.

---

### Answer C — I want the paint improved and protected

Recommendation:

**Ceramic Coating**

Reason:

Ceramic Coating combines paint preparation and machine polishing with long-term ceramic protection.

Display:

* From £250 depending on vehicle size
* Approximately one full day
* 3-year ceramic coating
* Paint Decontamination included
* Fallout removal included
* Machine polishing included
* Wheel face coating included
* Exterior glass coating included

Never create alternative coating durations.

There is only one Ceramic Coating service.

---

### Answer D — The paint feels rough / contaminated

Recommendation:

**Paint Decontamination**

Reason:

The vehicle may primarily require bonded and embedded contamination to be removed from the paintwork.

Display:

* From £60
* Duration must not be displayed because it is not defined in `SERVICES.md`
* Tar removal
* Road grease and grime removal
* Bird lime removal
* Mould removal
* Iron fallout removal
* Clay bar process

Important:

If the customer also wants paint correction, enhancement or ceramic protection, the Finder should recommend the relevant complete service instead of telling them to book Paint Decontamination separately.

For example:

Customer:

> "The paint feels rough and I want it glossy."

Recommendation:

**Paint Enhancement**

with Paint Decontamination shown as included preparation.

Customer:

> "The paint feels rough and I want long-term protection."

Recommendation:

**Ceramic Coating**

with Paint Decontamination shown as included preparation.

---

### Answer E — I'm not sure

Ask:

> ## What matters most to you?

Answers:

**More gloss and a better finish**

→ Paint Enhancement

**Reduce swirls and visible defects**

→ Paint Correction

**Long-term protection**

→ Ceramic Coating

If still uncertain, show a comparison between:

* Paint Enhancement
* Paint Correction
* Ceramic Coating

The comparison must use factual information from `SERVICES.md`.

---

# 9. PROTECTION Branch

Question:

> ## What type of protection are you looking for?

### Answer A — Long-term protection for my paint

Recommendation:

**Ceramic Coating**

Use the Ceramic Coating result specification above.

---

### Answer B — Protection as part of regular cleaning

Recommendation:

**Essential Clean** or **Full Valet**, depending on the customer's cleaning requirement.

The Finder must not present the high-SiO₂ spray ceramic sealant as a ceramic coating service.

It must be described as the regular protection step included within Essential Clean and Full Valet.

---

### Answer C — I'm interested in PPF

Recommendation:

**PPF (Paint Protection Film)**

Because PPF details have not yet been fully defined in `SERVICES.md`:

* Do not display invented pricing
* Do not display invented duration
* Do not invent package options
* Do not invent areas of coverage
* Do not invent film specifications
* Do not invent guarantees

The result should instead direct the customer towards an enquiry / quote.

Example:

> **PPF (Paint Protection Film)**
>
> PPF is available, but we'll need a few details about your vehicle and what you want protected.
>
> **Get a quote**

---

### Answer D — I'm not sure

Recommendation:

Ask:

> ## Do you want the paint improved before it's protected?

**Yes**

→ Ceramic Coating

**No / mainly regular cleaning**

→ Essential Clean or Full Valet depending on cleaning requirement

---

# 10. RESTORATION Branch

Question:

> ## What would you like to restore?

### Answer A — Headlights

Recommendation:

**Headlight Restoration**

Display:

* £60
* Approx. 1–2 hours
* Specialist cleaning
* Progressive wet sanding
* Two-stage machine polishing
* 3-year ceramic coating protection

Do not call this service "Resto" in customer-facing copy.

---

### Answer B — Paintwork

Branch:

`PAINT`

Ask the paintwork question:

> What's bothering you most about the paint?

Then follow the PAINT decision tree.

---

### Answer C — Something else

Do not invent a service.

Show:

> **Let's take a closer look**
>
> We don't want to point you towards the wrong service. Tell us what you'd like restored and we'll help you work out the best option.

CTA:

> Get a quote

---

# 11. CARAVAN_MOTORHOME Branch

Recommendation:

**Caravan & Motorhome**

Because the service specification is not yet fully defined in `SERVICES.md`:

Do not display:

* Invented pricing
* Invented durations
* Invented package names
* Invented inclusions
* Invented exclusions

Result should direct the customer towards an enquiry.

Suggested result:

> **Caravan & Motorhome**
>
> We offer services for caravans and motorhomes. Tell us a little about your vehicle and what you'd like done and we'll advise you on the best option.

CTA:

> Get a quote

---

# 12. UNSURE Branch

The Finder should help customers who genuinely don't know what they need.

Question:

> ## What's the main thing you're unhappy with?

Answers:

### It's just generally dirty

→ CLEANING

### The interior is particularly dirty

→ Interior Deep Clean

### The paint looks dull

→ Paint Enhancement

### The paint has swirls or defects

→ Paint Correction

### I want long-term protection

→ Ceramic Coating

### The headlights are cloudy or faded

→ Headlight Restoration

### I want regular professional upkeep

→ Maintenance Plans

### Something else

→ Get a quote / human assistance

---

# 13. Recommendation Priority Rules

When more than one service appears relevant, use the following priority logic.

## Rule 1 — Specific problem beats general cleaning

If the customer identifies a specific specialist requirement, recommend the relevant specialist service.

Example:

> "The car is dirty but the headlights are cloudy."

→ Headlight Restoration should be recommended for the headlight requirement.

Do not automatically recommend Full Valet just because the vehicle is dirty.

---

## Rule 2 — Long-term protection means Ceramic Coating

If the customer's primary goal is:

> improve the paint + long-term protection

recommend:

**Ceramic Coating**

Do not recommend Paint Enhancement plus a separately invented coating.

---

## Rule 3 — Paint Decontamination is not automatically a separate booking

If Paint Decontamination is required as part of:

* Paint Enhancement
* Paint Correction
* Ceramic Coating

it is included within that service.

The Finder must not tell the customer to book Paint Decontamination separately.

---

## Rule 4 — Cleaning services stay cleaning services

Do not recommend:

* Paint Enhancement
* Paint Correction
* Ceramic Coating

simply because the customer wants their car cleaned.

Only recommend specialist paint services when the customer's stated requirement supports them.

---

## Rule 5 — Never manufacture missing services

If the customer describes something that is not covered by the defined services:

Do not guess.

Send them towards:

**Get a quote**

or

**Contact us**

---

# 14. Result Screen

The recommendation screen should feel like the destination of the Finder.

Suggested structure:

> ## We'd recommend
>
> # Paint Correction
>
> **£200 · Approximately 5 hours**
>
> Based on what you've told us, Paint Correction is the best fit for improving the appearance of your paintwork and tackling suitable swirl marks and defects.

Then:

### Why we recommend it

A short explanation specifically referring to the customer's answers.

Avoid generic marketing copy.

---

### What's included

Display a concise selection of factual inclusions from `SERVICES.md`.

Do not rewrite or invent service specifications.

---

### Buttons

Primary:

> Get a quote

Secondary:

> View full service

Additional:

> Change my answers

---

# 15. Alternative Services

Where useful, the result may show up to **two relevant alternatives**.

Example:

### Your best match

**Paint Correction**

### You might also consider

**Paint Enhancement**

For a customer choosing Ceramic Coating:

**Ceramic Coating**

Alternative:

**Paint Correction**

if they primarily want correction without long-term ceramic protection.

Alternatives must only be services that genuinely relate to the customer's answers.

Do not show unrelated services merely to fill space.

---

# 16. Back and Change Answer Behaviour

The customer must be able to go backwards.

A visible:

> Back

control should be available during the question flow.

When going backwards:

* Previous answer remains selected
* Customer can change it
* Finder recalculates the following path
* Old answers that are no longer relevant are discarded
* Customer does not have to restart unless they choose to

On the result screen:

> Change my answers

must return the customer to the relevant decision point rather than restarting unnecessarily.

---

# 17. Restart

Provide a subtle:

> Start again

option.

Restarting must clear:

* Answers
* Recommendation
* Alternative services
* Progress state

The customer should then return to the introduction or first question.

---

# 18. Progress Indicator

The Finder should communicate progress without making the customer feel they are filling out a long form.

Use a subtle indicator such as:

> 1 of 3

or a minimal visual progress indicator.

The total number should be dynamic where possible.

Do not display:

> 1 of 10

if the customer will only need three questions.

---

# 19. Live Answer Summary

Where visually appropriate, show a compact summary of the customer's choices.

Example:

> **Your requirements**
>
> ✨ Improve paintwork
>
> 🌀 Swirls & defects

This summary should update as the customer progresses.

It should remain visually secondary to the current question.

---

# 20. Visual Design Direction

The Finder should feel like a premium part of the Polished & Pristine website rather than a generic form.

Design characteristics:

* Premium
* Clean
* Modern
* Automotive
* Dark/luxury aesthetic where consistent with the website
* High readability
* Strong typography
* Generous spacing
* Large touch-friendly cards
* Clear hierarchy
* Subtle depth
* Minimal clutter

Avoid:

* Generic form styling
* Huge walls of text
* Giant accordions
* Horizontal tab interfaces
* Tiny buttons
* Excessive gradients
* Excessive animation
* Novelty effects that reduce usability

---

# 21. Animation Direction

The initial preferred animation style is:

**Smooth card transition + subtle fade/movement.**

However, the animation implementation must remain replaceable.

The Finder must not be architecturally dependent on a single animation technique.

Potential future animation styles may include:

* Crossfade
* Slide
* Horizontal card movement
* Morphing
* More immersive transitions

The decision logic must continue working independently of whichever animation system is used.

Do not build the decision engine directly around animation code.

---

# 22. Interaction Behaviour

When the customer selects an answer:

1. Selected card receives clear visual feedback
2. Interaction feels immediate
3. Next question transitions smoothly into place
4. Previous question is removed from the active view
5. Answer is stored in Finder state
6. Next branch is calculated
7. No full page reload occurs

The experience should feel like a small application.

---

# 23. Mobile-First Requirements

The Finder must be designed for mobile first.

Requirements:

* Large touch targets
* Cards comfortable to tap with one hand
* No tiny text
* No horizontal scrolling
* No reliance on hover
* Buttons remain easy to reach
* Content fits naturally on phone screens
* Animations remain smooth on lower-powered mobile devices
* Avoid unnecessary full-screen effects
* Respect reduced-motion preferences

Desktop should then scale naturally from the mobile design.

---

# 24. Accessibility

The Finder must be usable with:

* Keyboard
* Screen readers
* Touch
* Mouse

Interactive cards must behave as genuine controls.

Do not create clickable `<div>` elements where a semantic button or link is appropriate.

Maintain:

* Visible focus states
* Sufficient contrast
* Clear labels
* Logical keyboard order
* Accessible status updates when questions change

Do not rely solely on colour to indicate the selected answer.

---

# 25. Reduced Motion

If the user's device/browser requests reduced motion:

* Disable or significantly reduce transitions
* Do not remove functionality
* Keep question changes clear
* Keep selected-state feedback visible

The Finder must remain fully usable without animation.

---

# 26. Performance

The Finder should be lightweight.

Prefer:

* Existing HTML
* Existing CSS
* Vanilla JavaScript
* CSS transitions
* Minimal JavaScript state management

Do not introduce a framework unless explicitly approved.

Do not introduce a dependency simply to create basic transitions.

Avoid:

* Heavy animation libraries
* Large UI libraries
* Unnecessary external APIs
* AI services
* External recommendation engines

The Finder does not require AI.

---

# 27. Architecture Requirements

The Finder should be separated into logical layers.

Preferred architecture:

```text
SERVICES.md
    ↓
Service data
    ↓
Recommendation logic
    ↓
Finder state
    ↓
UI
    ↓
Animation layer
```

Each layer should have a clearly defined responsibility.

---

## Service Data

Contains structured representations of services based on `SERVICES.md`.

Example conceptual structure:

```text
service name
price
duration
purpose
included items
exclusions
available in finder
```

Do not duplicate factual information unnecessarily.

Where practical, service information should have a single structured source that can be used by the Finder UI.

---

## Recommendation Logic

Responsible only for determining:

> Given these answers, which service should be recommended?

It must not contain:

* Animation code
* DOM styling
* Marketing copy
* Hard-coded unrelated UI behaviour

---

## Finder State

Stores:

* Current question
* Answers
* Previous answers
* Current branch
* Recommendation
* Alternatives

Back navigation and answer editing should operate on this state.

---

## UI Layer

Responsible for displaying:

* Questions
* Answer cards
* Progress
* Answer summary
* Recommendation
* Buttons
* Service information

---

## Animation Layer

Responsible only for visual transitions.

The recommendation engine must not depend on a particular animation.

---

# 28. Source of Truth Rules

`SERVICES.md` is authoritative for:

* Service names
* Prices
* Durations
* Inclusions
* Exclusions
* Service relationships
* Coating duration
* Terminology

`SERVICE_FINDER.md` is authoritative for:

* Finder questions
* Branches
* Recommendation logic
* Result behaviour
* Finder UX
* Interaction behaviour

If information conflicts:

**SERVICES.md wins for factual service information.**

**SERVICE_FINDER.md wins for Finder behaviour.**

If a required fact does not exist in `SERVICES.md`:

**Do not guess.**

---

# 29. Service Availability Within Finder

The Finder may recommend only defined services.

Current defined services:

* Essential Clean
* Full Valet
* Interior Deep Clean
* Maintenance Plans
* Paint Decontamination
* Paint Enhancement
* Paint Correction
* Ceramic Coating
* Headlight Restoration
* Caravan & Motorhome
* PPF (Paint Protection Film)

Caravan & Motorhome and PPF may be routed to enquiry/quote because their full service specifications have not yet been defined.

---

# 30. Critical Terminology

Use the exact service names from `SERVICES.md`.

Use:

**Paint Enhancement**

not alternative names.

Use:

**Paint Correction**

for machine polishing/correction intended to address swirl marks and suitable defects.

Use:

**Ceramic Coating**

for the single 3-year ceramic coating service.

Use:

**Headlight Restoration**

not "Resto" in customer-facing copy.

Use:

**Professional vacuuming**

or

**Professional vacuum**

when referring to vacuuming.

---

# 31. Ceramic Coating Rules

The Finder must never create:

* 1-year ceramic coating
* 2-year ceramic coating
* 5-year ceramic coating
* Entry-level ceramic coating
* Premium ceramic coating
* Bronze/Silver/Gold coating tiers
* Separate wheel coating package
* Separate glass coating package

There is one service:

**Ceramic Coating — 3 years — from £250**

Included preparation:

* Paint Decontamination
* Fallout removal
* Cleaning/preparation
* Machine polishing

Included protection:

* 3-year ceramic coating
* Wheel face coating
* Exterior glass coating

---

# 32. Paint Decontamination Rules

Paint Decontamination is:

**From £60**

It can be recommended as a standalone service.

However, when required for:

* Paint Enhancement
* Paint Correction
* Ceramic Coating

it is included in that service.

The Finder must never tell a customer to book Paint Decontamination separately when the customer's chosen service already includes it.

---

# 33. Pet Hair Rule

Pet hair removal is not included in any service.

The Finder must not imply that any service includes pet hair removal.

If the customer specifically mentions significant pet hair, the Finder may direct them towards:

> Get a quote

rather than inventing a pet-hair-removal service or price.

---

# 34. Quote Handoff

The Finder's primary commercial CTA should ultimately lead to the existing Polished & Pristine quote/contact process.

The Finder should pass through useful information where technically practical, such as:

* Recommended service
* Customer's answers
* Vehicle information if already collected elsewhere

Do not require the customer to repeat information unnecessarily.

The Finder must not invent or assume:

* Vehicle size
* Vehicle condition
* Registration
* Customer details

unless those details have actually been provided.

---

# 35. SEO and Service Pages

The Finder does not replace individual service pages.

Individual service pages remain important for:

* SEO
* Detailed service information
* Customers researching a specific service
* Search engine indexing
* Full inclusions/exclusions
* Detailed explanations

The Finder acts as the decision-making front door.

The recommendation screen should include:

> View full service

which links to the relevant service page.

---

# 36. No Page Reload

Moving through the Finder should not require page reloads.

The Finder should behave like an embedded application.

Do not navigate the customer away to another page after every question.

Only leave the Finder when the customer intentionally chooses something such as:

* View full service
* Get a quote
* Contact us
* Browse all services

---

# 37. No Forced Registration

The Finder must not require:

* Account creation
* Login
* Email address
* Phone number

just to receive a recommendation.

The customer should be able to complete the Finder anonymously.

---

# 38. No AI

The Service Finder must not use AI to decide which service to recommend.

Recommendation logic must be deterministic and based on the defined decision tree.

This provides:

* Predictable results
* Fast response
* No API cost
* No external dependency
* Easier testing
* Easier maintenance
* No hallucinated services

---

# 39. Prototype Before Integration

The Finder must first be built as an isolated prototype.

Do not immediately modify the live website.

The prototype should allow testing of:

* Question layout
* Card size
* Typography
* Spacing
* Animation
* Back navigation
* Answer selection
* Recommendation screen
* Mobile behaviour
* Desktop behaviour

The prototype should use the same decision logic specified here but remain visually and technically isolated from the existing website.

Only integrate into the live website after the prototype has been reviewed and approved.

---

# 40. Do Not Rewrite the Existing Website

Building the Finder must not involve:

* Rebuilding the entire website
* Replacing the existing CSS unnecessarily
* Replacing the existing JavaScript unnecessarily
* Changing unrelated service pages
* Changing SEO content unrelated to the Finder
* Changing the existing quote process without instruction
* Changing the site's service definitions

The Finder is an incremental feature.

---

# 41. Future-Proofing

The Finder should be designed so that future changes can be made without rebuilding the entire system.

Examples:

* Adding a new question
* Changing an answer
* Changing recommendation logic
* Changing card design
* Changing animation style
* Adding another service
* Changing the recommendation explanation
* Changing the result layout

These should be possible without tightly coupling the entire Finder together.

Any future service additions must first be reflected in `SERVICES.md`.

---

# 42. Final Decision Tree Summary

```text
START
│
├── Get it properly clean
│   │
│   ├── Whole car
│   │   └── FULL VALET
│   │
│   ├── Mainly interior
│   │   └── INTERIOR DEEP CLEAN
│   │
│   ├── Already fairly clean
│   │   └── ESSENTIAL CLEAN
│   │
│   └── Regular upkeep
│       └── MAINTENANCE PLANS
│
├── Improve the paintwork
│   │
│   ├── Dull / lacks gloss
│   │   └── PAINT ENHANCEMENT
│   │
│   ├── Swirls / defects
│   │   └── PAINT CORRECTION
│   │
│   ├── Improve + long-term protection
│   │   └── CERAMIC COATING
│   │
│   ├── Rough / contaminated
│   │   └── PAINT DECONTAMINATION
│   │
│   └── Not sure
│       └── Additional decision
│
├── Protect the paintwork
│   │
│   ├── Long-term paint protection
│   │   └── CERAMIC COATING
│   │
│   ├── Protection as part of regular cleaning
│   │   └── ESSENTIAL CLEAN / FULL VALET
│   │
│   ├── PPF
│   │   └── PPF ENQUIRY
│   │
│   └── Not sure
│       └── Additional decision
│
├── Restore something
│   │
│   ├── Headlights
│   │   └── HEADLIGHT RESTORATION
│   │
│   ├── Paintwork
│   │   └── PAINT BRANCH
│   │
│   └── Something else
│       └── GET A QUOTE
│
├── Caravan or motorhome
│   └── CARAVAN & MOTORHOME ENQUIRY
│
└── I'm not sure
    │
    └── Identify main problem
        │
        ├── Generally dirty
        │   └── CLEANING BRANCH
        │
        ├── Interior dirty
        │   └── INTERIOR DEEP CLEAN
        │
        ├── Paint dull
        │   └── PAINT ENHANCEMENT
        │
        ├── Swirls / defects
        │   └── PAINT CORRECTION
        │
        ├── Long-term protection
        │   └── CERAMIC COATING
        │
        ├── Cloudy headlights
        │   └── HEADLIGHT RESTORATION
        │
        ├── Regular upkeep
        │   └── MAINTENANCE PLANS
        │
        └── Something else
            └── GET A QUOTE
```

---

# 43. Acceptance Criteria

The Service Finder is considered successful when:

* A customer can understand the first question immediately
* A customer does not need detailing knowledge
* Most customers reach an appropriate recommendation within 2–5 decisions
* Irrelevant questions are avoided
* Back navigation works correctly
* Changing an answer recalculates the result
* Recommendations always match `SERVICES.md`
* No unsupported service information is invented
* Pricing and durations are accurate
* Paint Decontamination is not incorrectly sold twice
* Ceramic Coating remains a single 3-year service
* Wheel and glass coating are not presented as standalone services
* Pet hair removal is never presented as included
* Caravan & Motorhome and PPF do not receive invented details
* The Finder works properly on mobile
* The Finder works without JavaScript frameworks
* The Finder does not require AI
* The Finder does not require external APIs
* Animation can be changed independently of recommendation logic
* The existing website remains unaffected outside the intended Finder integration
* The prototype can be tested and approved before live integration

---

# 44. Agent Instruction

When implementing the Service Finder:

**Read `SERVICES.md` first.**

Then read this file.

Treat:

```text
SERVICES.md
```

as the factual service authority.

Treat:

```text
SERVICE_FINDER.md
```

as the Finder UX and decision authority.

Do not make assumptions where either file is silent.

Do not invent.

Do not redesign the decision tree without explicit instruction.

Do not integrate directly into the live website until the isolated prototype has been reviewed and approved.

Do not choose an animation technology that makes the recommendation engine dependent on that animation.

Build the system so that the visual design and animation can change later without rebuilding the decision logic.

The goal is not to create a complicated questionnaire.

The goal is to make choosing the right Polished & Pristine service feel **simple, fast, premium and genuinely useful**.
