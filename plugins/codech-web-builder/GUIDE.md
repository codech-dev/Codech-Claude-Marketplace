# codech-web-builder - team guide (end-to-end flow)

This is the human-facing overview of what the skill does, in order, and where you
(or the client) make decisions. The agent-facing instructions live in
`skills/codech-web-builder/SKILL.md`; this guide is for the team to understand the
whole flow at a glance.

## What it does, in one line

Reference website(s) + a brand logo go in. A designed, ready-to-deploy website
comes out. Deployment is an optional last step.

## The flow

```
  INPUTS:  brand logo  +  reference URL(s)  +  target stack (static | wordpress)
     |
 [0] PREFLIGHT ............ check deps. Missing something REQUIRED?
     |                      --> STOP, ask the user to install/provide it first.
     | ok
 [1] PALETTE (vision) ..... read the logo -> brand-tokens.md (colors, type,
     |                      spacing; every text/bg pair WCAG AA checked)
     |
 [2] CAPTURE REFERENCES ... screenshot + analyze the references
     |                      -> reference-analysis.md + content-map.md
     |
 [2b] SOURCE IMAGES ....... download real, topical images locally (no hotlinking)
     |                      -> assets/img/* (+ license/attribution recorded)
     |
 [3] DESIGN HOME PAGE ..... taste skill builds the HOME PAGE prototype only
     |   (taste skill)        (real HTML, real images). No design system yet.
     |
     === GATE 1: you review + confirm the HOME PAGE ===
     |   not happy? --> loop back to [3] with feedback (expect adjustments)
     | confirmed
 [3b] WRITE DESIGN SYSTEM . derive DESIGN-SYSTEM.md FROM the approved home page,
     |                      then build any other page types to match it
     |
 [4] CONVERT (adapter) .... map the artifact into the target stack
     |                      -> the BUILD (static: dist/  |  wordpress: theme + config)
     |                         <-- this is the primary deliverable
     |
     === DEPLOY?  (OPTIONAL - not compulsory) ===
     |   no  --> hand over the build + deploy instructions.  DONE.
     | yes
     === GATE 2: you approve the deploy target ===
     |   no  --> stop at the build.  DONE.
     | yes
 [5] DEPLOY (adapter recipe) -> live URL + QA screenshot.  DONE.
```

## Phase by phase

| # | Phase | You provide / decide | The skill produces |
|---|---|---|---|
| 0 | Preflight | (nothing) | A go/no-go report; asks you to install missing required deps |
| 1 | Palette | the logo | `artifact/brand-tokens.md` (WCAG-checked tokens + motion dials) |
| 2 | Capture | reference URL(s) | `reference-analysis.md`, `content-map.md` |
| 2b | Images | (optional API key) | `artifact/assets/img/*` + `credits.json` |
| 3 | Design home page | review + confirm at GATE 1 | `artifact/prototype/index.html` (home page only) |
| 3b | Write design system | (after GATE 1) | `artifact/DESIGN-SYSTEM.md` (derived from approved home page) + any other pages |
| 4 | Convert | target stack | the build (static `dist/` or WordPress theme + `site.config.json`) |
| 5 | Deploy | opt in at GATE 2 | live URL + QA screenshot |

## Decision points (what the team actually chooses)

1. **Target stack** - `static` (Cloudflare Pages) or `wordpress` (coway-starter).
   If unsure, static is the safe default. Other stacks are added later as one
   adapter file; the core never changes.
2. **GATE 1 - home page confirmation** - the HOME PAGE prototype is shown for
   review FIRST. Iterate here until it is right; this is the cheap place to change
   things. The design system is written only after you confirm the home page (so
   it documents the approved design, not a guess ahead of it).
3. **Deploy yes/no** - deployment is OPTIONAL. The converted build is a complete
   deliverable. Choose to stop there (review locally / hand to client / deploy
   yourself) or let the skill deploy.
4. **GATE 2 - deploy target** - if deploying, confirm the exact destination
   before anything is published.

## Dependencies (checked at Phase 0)

- **Required:** a taste skill (`design-taste-frontend` or `frontend-design`),
  Node >= 18, the logo + references.
- **Capture (need one):** Playwright (npm or MCP), Firecrawl, or your screenshots.
- **Conditional (only if deploying):** wrangler + Cloudflare (static);
  coway-starter + SSH/WP-CLI or the no-SSH MCP path (wordpress).
- **Optional:** `PEXELS_API_KEY` / `UNSPLASH_ACCESS_KEY` for better imagery
  (otherwise Openverse, which is topical but more amateur).

See `skills/codech-web-builder/references/00-preflight.md` for the full tiering.

## Worked example (dummy brand)

For "Verda" (an invented plant store, logo = green leaf + serif wordmark):
- Palette: forest green primary + terracotta accent + bone neutrals (all AA).
- References: an indoor-plants store; analysis -> hero, product rail, category
  tiles, trust strip, contact.
- Images: real monstera / snake plant / fiddle-leaf fig photos sourced locally.
- Design: asymmetric split hero, serif display, restrained motion.
- Convert: static `dist/` served and screenshot-verified.
- Deploy: skipped (optional).

## Outputs you can hand off

- `artifact/` - the portable, stack-neutral design (tokens + design system +
  prototype + local assets). Reusable to target a different stack later.
- The **build** for your chosen stack (the thing you deploy).
- Image `credits.json` for attribution.
