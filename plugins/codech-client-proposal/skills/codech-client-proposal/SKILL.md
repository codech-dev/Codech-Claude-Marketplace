---
name: codech-client-proposal
description: Use when building a Codech client proposal as a single-page HTML deliverable that needs to be hosted publicly. Use when the user says "build a proposal", "draft a client proposal", "make a proposal site", "deploy the proposal", "Cloudflare Pages proposal", or "package as proposal". Use when a Codech engagement has a design-system.md and prototype-app/*.html files and needs to be packaged into a shareable *.pages.dev URL. Use when redeploying an existing proposal or adding password protection.
---

# Codech Client Proposal

## Overview

A reusable workflow for turning a Codech engagement into a deployed, client-shareable HTML proposal. The skill applies a **per-client design system** to a **canonical proposal anatomy** with **locked Codech identity** in the closing section, optionally captures prototype mockup screenshots, and deploys to **Cloudflare Pages**.

**Core principle:** The visual idioms (eyebrow pills, featured dark cards, browser-chrome mockups, anim-up reveals, mobile lightbox, desktop-recommended banner, optional bilingual toggle) are reusable across clients; the design tokens (color, font, voice) are per-client; the closing section ("Prepared by Codech Solutions") is always Codech-branded.

**Worked references:** The JY Global AI Portal proposal (`examples/jy-global-reference.md`) — the four-module baseline. The OTSO AI Hub proposal (`examples/otso-ai-hub-reference.md`) — bilingual, two-module, and the worked example for the desktop banner / EN ⇄ 中文 toggle / 820px lightbox idioms.

## When to Use

- Building a single-page HTML proposal for a Codech client
- Need to host the proposal at a `*.pages.dev` URL to share with the client
- Have prototype mockups in HTML and want them captured as images for mobile
- Have a `design-system.md` (or willing to generate one via `/codech-mockup-design`)

**Don't use for:**
- Multi-page proposals or PDF deliverables — this is single-page HTML only
- Full project lifecycle including FSD/SAD/TDD — use `/codech-project-superpower`
- Generating the design system from scratch — delegate to `/codech-mockup-design`

## The 6-Step Workflow

```
1. DISCOVER → check for design-system.md; if missing, offer /codech-mockup-design
2. GATHER   → ask client name, industry, deliverables, pricing model, timeline (one at a time)
3. BUILD    → generate proposal.html from skeleton + design tokens + canonical sections
4. CAPTURE  → (optional) Playwright screenshots of prototype-app/*.html for mobile lightbox
5. DEPLOY   → wrangler pages create + deploy → return *.pages.dev URL
6. HANDOFF  → give user the URL + redeploy command + project structure
```

Each step has a corresponding reference document:

| Step | Reference |
|---|---|
| Build proposal sections | `references/proposal-anatomy.md` |
| Apply reusable visual patterns | `references/visual-idioms.md` |
| Map a design system into the proposal | `references/using-design-system.md` |
| Add a bilingual (EN ⇄ second-language) toggle | `references/multilanguage.md` |
| Capture prototype screenshots | `references/screenshot-pipeline.md` + `scripts/capture-screenshots.mjs` |
| Deploy to Cloudflare Pages | `references/cloudflare-deploy.md` + `scripts/deploy.sh` |

## Quick Reference

| What you need | Where |
|---|---|
| Empty starter HTML with all sections stubbed | `assets/proposal-skeleton.html` |
| The locked Codech closing section markup | `assets/codech-closing-section.html` |
| Codech logo (PNG, white version) | `assets/codech-logo.png` |
| Screenshot pipeline (Playwright runner) | `scripts/capture-screenshots.mjs` |
| Cloudflare deploy wrapper | `scripts/deploy.sh` |
| Optional Basic Auth password middleware | `scripts/add-password.sh` |
| Worked example — 4-module baseline | `examples/jy-global-reference.md` |
| Worked example — bilingual, 2-module, new idioms | `examples/otso-ai-hub-reference.md` |

## Locked Idioms (don't re-theme per client)

These elements use Codech identity regardless of client design system:

1. **Closing section** — Always uses Codech logo + contact card (website, email, phone, WhatsApp). Markup: `assets/codech-closing-section.html`.
2. **Confidentiality pill** in top utility bar — centred, navy chip with shield icon: `Confidential · [Proposal name] for [Client]`.
3. **Mobile lightbox** UX — fit-to-screen default, tap outside / Esc / × to close. Pattern in `references/visual-idioms.md` §lightbox.
4. **Desktop-recommended banner** — mobile-only navy strip telling the reader the proposal is best viewed on desktop and that app screens appear as tap-to-enlarge images. Default-on for every proposal; markup in `references/proposal-anatomy.md` §02b.

Everything else (hero, modules, architecture, scope, pricing) is themed per the client's design system.

## Composition with other skills

| If you need... | Use |
|---|---|
| Create a design system from a client's brand | `/codech-mockup-design` |
| Full project docs (FSD/SAD/TDD/SRS) | `/codech-project-superpower` |
| Generate the prototype-app HTML pages | `/codech-mockup-design` or `/codech-project-superpower` Phase 3 |

## Voice Defaults

Until a per-client voice preset is specified, use:
- Short clauses with full stops (`A pragmatic, modern stack. No moonshots.`)
- Cyan period accents on display headlines (`<span class="text-cyan-deep">.</span>`)
- No marketing puffery — banned words: *leading, world-class, innovative, leveraging, synergies, empowering, robust*
- British spelling by default (organisation, licence-noun)
- Honest scope language — explicit "Not in this milestone" panel listing deferred items

See `references/voice-and-copy.md` for the full distilled set.
