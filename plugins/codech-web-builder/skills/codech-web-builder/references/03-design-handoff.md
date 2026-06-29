# Phase 3: design handoff to the taste skill

This phase turns the brand tokens + reference analysis into a confirmed home page
and then a design system derived from it. The web-builder does NOT do the visual
design itself; it hands off to a taste skill and supplies the constraints. The
order matters: home page first, user confirms, THEN the design system (see below).

## Design engine

Invoke a taste skill as the design engine, in this order of preference:

1. `design-taste-frontend`
2. `frontend-design`

If neither is installed, STOP. The taste skill is a required dependency of
codech-web-builder; name it to the user and ask them to install it (it is not
something to improvise).

## Inputs to feed the taste skill

- **`artifact/brand-tokens.md`** - the brand constraint. The taste skill must
  style WITHIN these tokens. It does not re-pick brand colors; the palette came
  from the logo in phase 1. It may add tints/shades from the provided ramp.
- **`reference-analysis.md`** - layout patterns, section inventory, motion read,
  density read. This drives the structure and feel.
- **`content-map.md`** - the real copy and per-section structure to lay in.
- The motion dials (DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY) from
  `brand-tokens.md` - pass these through as the taste skill's dials.
- **The sourced local images** in `artifact/assets/img/` (phase 2b, see
  06-source-images.md). The prototype must use these REAL images for every image
  slot (hero, product/feature shots, category tiles). Empty gray placeholder
  boxes are not acceptable output. If a slot has no suitable image, source one
  (06) before building, do not ship a placeholder.

## Order: home page FIRST, design system AFTER approval

Do NOT write the design system up front. The design system is DERIVED from the
approved home page (the way the Coway DESIGN-SYSTEM.md was "derived from the
approved homepage"), so the page is confirmed first and the doc records what was
actually shipped. Two steps with the gate between them:

### Step A - build the home page prototype (taste skill)

The taste skill builds ONLY the home page into `artifact/prototype/index.html`
(self-contained HTML/CSS/JS, openable with no build step, using the real local
images). Do not write `DESIGN-SYSTEM.md` in this step, and do not build other
page types yet.

**>> GATE 1 (see 05-gates-and-qa.md): show the home page, the user reviews and
confirms.** Expect adjustments; loop back into Step A with the feedback and
re-present until the user approves. Nothing downstream happens until then.

### Step B - write the design system from the APPROVED home page

Only after GATE 1 approval:

- Write **`artifact/DESIGN-SYSTEM.md`** by reading the approved home page and
  recording what it actually uses: tokens in use, components, section patterns,
  spacing/shape/motion rules, copy rules. It documents reality, it does not
  prescribe ahead of it.
- Build any **additional page types** the user asked for, consistent with that
  design system, reusing the confirmed home-page components.

All images live under `artifact/assets/` and are listed in
`artifact/assets/manifest.json` (see 04-conversion-contract.md). The approved
home page is the visual source of truth for every downstream adapter.

After Step B the artifact is complete; proceed to conversion (phase 4).
