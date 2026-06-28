# Proposal Anatomy

The canonical section order and purpose for a Codech single-page HTML proposal. Each section is **optional except where marked Required** — skip sections that don't fit the engagement.

Worked example: `examples/jy-global-reference.md`.

---

## Section order (top → bottom)

| # | Section | Required? | When to include |
|---|---|---|---|
| 01 | Utility bar (top strip) | **Required** | Always — holds the centred confidentiality pill |
| 02 | Sticky section nav | Recommended | Whenever the proposal has 4+ scrolling sections |
| 03 | Hero | **Required** | Always — eyebrow + headline + lead paragraph + at-a-glance pills |
| 04 | What we're building (overview) | Recommended | When you're delivering multiple modules / features |
| 05 | Module / feature deep dives | **Required** | One per major deliverable |
| 06 | Architecture diagram | When technical | Software/platform proposals only |
| 07 | Technology stack | When technical | Software/platform proposals only |
| 08 | Scope of work | **Required** | Always — by function or by module, with "Not in this milestone" panel |
| 09 | Timeline & investment / Modular pricing | **Required** | Always — pick phase-based OR module-based variant |
| 10 | Closing — Prepared by Codech Solutions | **Required** | Always — locked Codech identity |
| 11 | "End of proposal" marker | Recommended | Subtle sign-off line |

---

## §01 Utility bar

`hidden md:block` navy-deep strip at the very top, 13px text. After the JY Global iteration we settled on **right-removed / centre-only**: just a centred confidentiality pill on the right of the bar (visual centre when nav row below is also right-aligned).

```html
<div class="hidden md:block bg-navy-deep text-white/85 text-[13px]">
  <div class="max-w-container mx-auto px-6 py-2.5 flex items-center justify-center">
    <div class="inline-flex items-center gap-2 text-white/75">
      <i class="ph ph-shield-check text-cyan text-[15px]"></i>
      <span>Confidential · [PROPOSAL NAME] for [CLIENT NAME]</span>
    </div>
  </div>
</div>
```

**Locked:** The "Confidential · …" pill uses the same shield-check icon and `text-cyan` accent regardless of client design system.

---

## §02 Sticky section nav

`sticky top-[72px] z-30 bg-white/85 backdrop-blur-md border-b border-line/60`. Holds icon-prefixed section links. Active link tracked via scroll position in JS (see `references/visual-idioms.md` §scroll-active).

Link items follow the section order: Overview, then one per major section. Use Phosphor icons matching the section's content (`ph-house` for Overview, `ph-chat-circle-dots` for chat workspace, `ph-stack` for tech stack, `ph-list-checks` for scope, `ph-calendar` for timeline, `ph-currency-circle-dollar` for pricing).

---

## §03 Hero

Centred layout, `bg-white py-24 lg:py-32`, max width `[860px]`. Five elements stacked:

1. **Eyebrow pill** — uppercase, with cyan dot (e.g., `Pilot Milestone 1 · Proposal`)
2. **Display headline** — extrabold, 2–3 lines, cyan period accent at the end. Use `<br>` for visual line breaks
3. **Lead paragraph** — under the heading, max 720px width, professional voice
4. **At-a-glance pill row** — clickable links to the major sections, with icons
5. **Scroll cue** — small "Scroll to read the proposal" hint at bottom

```html
<h1 class="font-extrabold text-[44px] sm:text-[58px] lg:text-[72px] leading-[1.03]
           tracking-[-0.028em] text-ink text-balance">
  Internal AI Portal<br>
  built for [CLIENT NAME]<span class="text-cyan-deep">.</span>
</h1>
```

**Don't** put module names in the headline — keep them in the at-a-glance pill row and in the dedicated sections below.

---

## §04 What we're building (overview)

A short section under the hero showing 4 module cards in a grid. One card is rendered **featured dark** (navy + cyan glow) to break visual symmetry. Clicking a card jumps to its detailed section.

When to skip: if the proposal has 1–2 deliverables instead of 3+, skip this overview section entirely.

---

## §05 Module / feature sections

One section per deliverable, each with:

- **Eyebrow pill** with module number (`Module 02 · Personal Assistant`)
- **H2** with cyan period accent
- **Lead paragraph** explaining the value
- **Mockup** — full-width browser-chrome card showing the prototype (use `class="prototype-mockup"` so the mobile lightbox swap engages — see `references/visual-idioms.md` §lightbox)
- **Optional small disclaimer** below the mockup: *"Illustrative prototype — shown for reference only. Final UI will be confirmed during Phase 02."*

For Module 02-style featured sections, alternate background colour (`bg-navy text-white` with cyan radial glow) to give the page rhythm.

---

## §06 Architecture diagram

Vertical layered diagram inside a `bg-white rounded-2xl border border-line p-5 sm:p-8 lg:p-12 card-shadow` card. Layers stack top-to-bottom with cyan down-arrows between:

1. **Entry points** — `grid grid-cols-1 sm:grid-cols-2 gap-3` (or 4 if richer)
2. **Authentication + Coordinator** — featured dark navy card spanning full width
3. **Modules** — `grid grid-cols-2 sm:grid-cols-4 gap-3` for 4 modules
4. **Memory tiers** — `grid grid-cols-1 sm:grid-cols-3 gap-3` for 3 tiers, third tier rendered dark (featured)
5. **Infrastructure** — bottom dark card, single row on lg+ with title / description / TBC chips

**Mobile-critical:** every grid in the architecture diagram must collapse cleanly. Use `grid grid-cols-1 sm:grid-cols-X` not bare `grid grid-cols-X`. JY Global proposal had to be retrofitted for this — bake it in from the start.

---

## §07 Technology stack

Header + 4-stat banner (dark navy) + 6 layer cards in 3×2 grid:
- Application & UI
- Backend services
- Data & memory
- **AI models** (featured dark card, lists Reasoning / Drafting / Triage / Retrieval pipeline with primary + alternate model choices)
- Channels & integrations
- Operations & hosting

End with a "Stage 0 decisions" strip listing what gets confirmed at Discovery (cloud region, vector DB host, observability host, etc.).

---

## §08 Scope of work

**Two valid variants** — pick one per proposal:

### Variant A: By function (pillars)

Top stats strip (`functional pillars · capabilities · milestones · duration`), then 7–8 functional pillars in a 2-column grid. One pillar rendered **featured dark** (typically the most differentiating capability — for JY Global this was "Three-Tier Memory & Retrieval").

### Variant B: By module

Foundation card (mandatory, featured dark) + one card per optional module. Each module card shows: eyebrow + title + description + includes-list + price + duration estimate.

**Both variants** end with a `Not in [Milestone 1] / Honest boundaries` panel listing deferred items grouped by deferral milestone. This panel is non-negotiable — it's load-bearing for the proposal's credibility.

---

## §09 Timeline & investment / Modular pricing

Two pricing models, also pick one:

### Phase-based (linear delivery)

5 stacked phase cards (Requirements → Design → Development [featured dark] → Testing → Delivery), each showing: eyebrow + title + activities list + fee + duration. Horizontal allocation bar above shows phase durations as proportional segments.

### Module-based (à la carte)

- Full bundle summary banner (dark navy) with total / module count / timeline range / quote type
- Foundation card (mandatory, featured dark) with included-list + price
- One card per optional module with includes-list + price + duration
- **Suggested bundles grid** — 4 cards showing common configurations (Minimum viable / Compliance focus / Productivity focus / Full pilot recommended). The "Recommended" card is dark navy.
- Terms strip at the bottom (payment schedule, quote validity, deferred-module pricing rule)

When to pick which: **Phase-based** when the engagement is single-scope and client just wants a delivery plan. **Module-based** when the client may need to choose / defer modules based on budget — gives them clear off-ramps.

---

## §10 Closing — Prepared by Codech Solutions

**LOCKED.** Always uses Codech identity regardless of client design system. Markup in `assets/codech-closing-section.html`:

- Dark navy card with subtle cyan radial glow
- Left column: eyebrow `Prepared by` + Codech logo (h-20 lg:h-24) + `Codech Solutions.` H2 + thank-you paragraph
- Right column: white-tinted contact card with website + email + phone + WhatsApp rows, plus a green "Message us on WhatsApp" CTA button

This section is the seller's brand stamp. Never re-theme it per client.

---

## §11 End of proposal marker

A subtle centred sign-off below the closing card:

```html
<div class="mt-16 flex items-center justify-center gap-4 anim-up">
  <span class="h-px w-16 bg-line"></span>
  <span class="text-[10px] uppercase tracking-eyebrow font-bold text-muted-light">
    End of proposal<span class="text-cyan-deep">.</span>
  </span>
  <span class="h-px w-16 bg-line"></span>
</div>
```

---

## Per-section checklist

Before declaring a proposal done:

- [ ] Utility bar shows centred confidentiality pill with client name
- [ ] Hero uses extrabold display headline with cyan period accents
- [ ] At-a-glance pill row links to all major sections
- [ ] Each module section has a `.prototype-mockup`-classed mockup (for mobile lightbox)
- [ ] Each module mockup has an illustrative-prototype disclaimer below it
- [ ] Architecture grids use `grid-cols-1 sm:grid-cols-X` not bare `grid-cols-X`
- [ ] "Not in this milestone" panel lists deferred items
- [ ] Closing section uses Codech identity verbatim (logo, contacts, WhatsApp)
- [ ] Page title in `<head>` differentiates this proposal version
- [ ] All anim-up reveals have JS-gated default-visible fallback
- [ ] Sticky nav active state JS includes all section IDs
