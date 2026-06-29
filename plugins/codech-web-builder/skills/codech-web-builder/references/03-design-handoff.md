# Phase 3: design handoff to the taste skill

This phase turns the brand tokens + reference analysis into the design system and
the HTML prototype. The web-builder does NOT do the visual design itself; it
hands off to a taste skill and supplies the constraints.

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

## Required outputs (and where they land)

The taste skill must produce, written into the artifact:

- **`artifact/DESIGN-SYSTEM.md`** - the full design system (tokens in use,
  components, section patterns, copy rules).
- **`artifact/prototype/`** - a section-structured HTML/CSS/JS prototype with
  `index.html` as the entry, plus any additional page types the user asked for.
  All images live under `artifact/assets/` and are listed in
  `artifact/assets/manifest.json` (see 04-conversion-contract.md).

The prototype is the visual source of truth for every downstream adapter, so it
must be self-contained and openable in a browser with no build step.

## End of phase

This phase ends at GATE 1. Do not proceed to conversion until the user has
visually approved the prototype. See 05-gates-and-qa.md.
