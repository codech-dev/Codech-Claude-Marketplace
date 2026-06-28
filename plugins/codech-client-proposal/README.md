# Codech Client Proposal

> A Claude Code skill that turns a Codech engagement into a deployed, client-shareable HTML proposal. Applies a per-client design system to the canonical proposal anatomy, captures prototype screenshots, deploys to Cloudflare Pages. The delivery layer of the Codech client engagement.

**Version:** 1.0.0 · **License:** MIT · **Status:** Production

---

## What this skill does

A 6-step workflow that takes you from "design system + prototype HTML in hand" to "deployed `*.pages.dev` URL ready to send to the client" — without leaving Claude Code.

```
1. DISCOVER → check for design-system.md; if missing, offer /codech-mockup-design
2. GATHER   → client name, industry, deliverables, pricing model, timeline
3. BUILD    → generate proposal.html applying design tokens + canonical sections
4. CAPTURE  → (optional) Playwright screenshots of prototype-app/*.html for mobile lightbox
5. DEPLOY   → wrangler pages create + deploy → return *.pages.dev URL
6. HANDOFF  → give user the URL + redeploy command + project structure
```

## When the skill triggers

| You say | Skill activates |
|---|---|
| "Build a proposal" / "draft a client proposal" | Step 1 onwards |
| "Deploy the proposal" / "Cloudflare Pages proposal" | Step 5 |
| "Make a proposal site" / "package as proposal" | Full workflow |
| "Capture mockup screenshots for the proposal" | Step 4 |
| "Add password protection" | Optional Basic Auth middleware |
| (a `design-system.md` and `prototype-app/*.html` are detected) | Step 1 onwards |

## What you get out of the box

| Deliverable | Format | Where |
|---|---|---|
| `proposal.html` | Single-file HTML, Tailwind CDN + Phosphor + Manrope | Your project root |
| `screenshots/*.png` | Captured prototype mockups (for mobile lightbox) | `screenshots/` folder |
| `_deploy/` | Ready-to-upload Cloudflare Pages folder | Your project root |
| Live `*.pages.dev` URL | Public, shareable proposal site | Cloudflare Pages |
| Redeploy command | One-liner for future edits | Your terminal |

## The canonical proposal anatomy

| Section | Purpose |
|---|---|
| Utility bar | Centred confidentiality pill |
| Sticky section nav | Scroll-active anchor links |
| Hero | Eyebrow + cyan-period headline + lead + at-a-glance pills |
| What we're building | 4-up overview (when delivering multiple modules) |
| Module deep dives | One per major deliverable, with browser-chrome mockup |
| Architecture | Vertical layered diagram (technical proposals) |
| Tech stack | 6 layer cards (technical proposals) |
| Scope of work | Function-pillars OR module-cards + "Not in this milestone" panel |
| Pricing | Phase-based linear OR module-based à la carte with bundles |
| Closing | **Locked** Codech identity — logo + contact card + WhatsApp CTA |

Each section is optional except where marked **Required** (see `skills/codech-client-proposal/references/proposal-anatomy.md`).

## Visual idioms (locked across all client design systems)

- **Eyebrow pills** — uppercase + cyan dot, 3 surface variants
- **Cyan period accents** on every display H2
- **Featured dark cards** with cyan radial glow (one per section, breaks visual symmetry)
- **Browser-chrome mockup wrappers** for every prototype preview
- **Mobile image lightbox** with fit-to-screen default + tap-to-toggle native zoom
- **Anim-up reveals** with JS-gated default-visible + 3-second safety net
- **Sticky nav** with scroll-active state tracking

Full markup in `skills/codech-client-proposal/references/visual-idioms.md`.

## Composition with other Codech skills

| Upstream | Hand off to |
|---|---|
| `codech-project-superpower` produces the FSD/SAD/TDD/SRS + prototype HTML | `codech-client-proposal` packages it into the proposal site |
| `codech-mockup-design` produces the design-system.md | `codech-client-proposal` applies it to the proposal anatomy |

This skill is the **delivery layer** — pre-developed artefacts go in, a deployed URL comes out.

## Voice defaults

- Short clauses with full stops
- Cyan period accents on display headlines
- No marketing puffery (banned: *leading, world-class, innovative, leveraging, synergies, empowering, robust*)
- British spelling by default
- Honest scope language — explicit "Not in this milestone" panel

Override defaults via the voice preset (currently: professional-services).

## Worked example

The JY Global AI Portal proposal — live at https://jy-global-proposal-ai-portal.pages.dev — is the reference build this skill is reverse-engineered from. See `skills/codech-client-proposal/examples/jy-global-reference.md` for the full iteration history.

## Prerequisites

- Node.js (for Playwright capture script)
- `wrangler` installed and authenticated (`wrangler login`)
- Cloudflare account (Codech default: `dev.codech@gmail.com`)
- A `design-system.md` (existing or freshly generated via `/codech-mockup-design`)

## Install

Via the Codech marketplace:

```bash
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install codech-client-proposal@codech-marketplace
```

Then invoke with `/codech-client-proposal` or just say "build a proposal" / "deploy as proposal".
