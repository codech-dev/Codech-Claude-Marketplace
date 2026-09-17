---
name: codech-cinematic-web
description: Build cinematic marketing-page effects - a Three.js hero object (dot-matrix planet, orb, product form) lit by an analytic screen-space atmosphere, and a sticky scroll deck where one swipe advances exactly one panel over full-bleed video. Use when the user asks for an animated 3D/WebGL hero, a particle globe or glowing orb, a "space"/"orbital" hero, a scroll-jacked or sticky section deck, one-swipe-per-slide scrolling, full-bleed video section backgrounds, or points at a reference video/site with these effects and asks to reproduce it.
---

# codech-cinematic-web

Two effects that carry a marketing page, and the discipline that makes them
survive contact with real devices:

1. **Hero object** - a WebGL form (planet, orb, product) with a luminous rim,
   an atmosphere that does not band, dot-matrix surface detail, and cursor
   interaction done on the GPU.
2. **Scroll deck** - a sticky stage where one gesture advances exactly one
   panel, each panel backed by full-bleed video that actually plays on iOS.

Both are easy to get 80% right and very hard to finish. This skill exists
because the last 20% is not intuition - it is a small number of specific
failures, each with a specific fix and a specific measurement that proves it.

## Before you start: the one rule

**Measure, then place. Never solve geometry or brightness by eye from a
screenshot.**

Every serious error in the engagement this skill came from was a number
assumed rather than measured:

- A hero object framed from a still was placed with its crest cropped out of
  frame. Tracing the rim and fitting a circle gave centre 49.6% width /
  100% height, radius 43.8% width, residual 2.5px - and the composition was
  right immediately.
- A rim measured "3x dimmer on desktop" was not a shader bug at all. A CSS
  scrim pool centred at 38% of card height was painting over a crest that sat
  at 40%. The shader was innocent.
- "The globe is not showing on iPhone" was not a WebGL failure. The object was
  rendering correctly and had been pushed below the fold by a layout that
  measured a button position before webfonts landed.

If you find yourself typing a magic number, stop and measure it instead.
`scripts/measure_geometry.py` and `scripts/verify_render.mjs` exist for this.

## Pick your path

| The user wants | Read |
|---|---|
| A 3D hero object, glowing orb, particle globe, "orbital"/space hero | [references/01-hero-object.md](references/01-hero-object.md) |
| The atmosphere/glow specifically, or it is banding in rings | [references/02-atmosphere.md](references/02-atmosphere.md) |
| Sticky sections, one-swipe-per-slide, scroll-jacking | [references/03-scroll-deck.md](references/03-scroll-deck.md) |
| Video backgrounds per section, or video that will not play on iOS | [references/04-video-backgrounds.md](references/04-video-backgrounds.md) |
| To know what to check before saying it is done | [references/05-verification.md](references/05-verification.md) |
| A working file to copy and adapt | [reference-impl/](reference-impl/) |

Read only what the task needs. The references are independent.

## Non-negotiables

These are not style preferences. Each one is a bug that shipped, was found on
a real device, and cost a round trip.

**Hero object**

- Build the atmosphere as **one analytic screen-space pass**, never as stacked
  fresnel shells. A back-side fresnel shell is brightest at its own silhouette,
  so every shell terminates in a hard ring. Three shells = three visible rings,
  and no amount of radius tuning removes them. See
  [references/02-atmosphere.md](references/02-atmosphere.md).
- Express glow width, rim width and point size as **constants in CSS pixels
  multiplied by DPR**, never as a fraction of canvas width or of the object's
  radius. Deriving them from viewport size makes the effect a third as bright
  on desktop as on mobile, for the same code.
- Drive cursor interaction from **one uniform in the vertex shader**. Never
  loop over points in JS per frame.
- Handle `webglcontextlost` / `webglcontextrestored`. iOS discards contexts
  under memory pressure and will not restore them unaided; without a handler
  the hero silently disappears for good.
- Honour `prefers-reduced-motion`: render one static frame, then return.

**Scroll deck**

- Snap on **gesture direction** (wheel/touch delta sign), not on net scroll
  position. Position-based snapping lets one fast swipe skip two panels, and
  a small scroll back to where it started.
- Engage the snap **only once inside the deck**. A title that fades on scroll
  above the deck is not a panel and must not be a stop.
- Every video needs a **poster plate underneath it**. An intro clip whose first
  frame is deliberately empty shows nothing while parked or buffering.

**Both**

- Cap `devicePixelRatio` at 2. Fewer points and no hover work on touch.
- Verify in a browser with a screenshot or a measurement, never by assuming the
  code does what it reads like. `canvas.toDataURL()` and `gl.readPixels()`
  return blank on a composited WebGL canvas - compare screenshots instead.

## Workflow

1. **Collect the brief.** A reference video or site if there is one; the copy
   and CTAs that must sit over the effect; the brand colours.
2. **Measure the reference** before writing any shader or layout code.
   `python3 scripts/measure_geometry.py <frame.png>` fits the silhouette and
   prints centre/radius as fractions of frame size. Extract frames from a
   reference video with ffmpeg first.
3. **Start from `reference-impl/`**, not from scratch. Copy the file, then
   change geometry, palette and content. The shader structure is the part that
   took the longest to get right.
4. **Wire the layout to the measurement.** Publish the solved crest position to
   CSS as a custom property and place copy against it, so the text and the
   object cannot drift apart when the viewport changes.
5. **Verify** with `scripts/verify_render.mjs` before reporting done. It checks
   the things that are invisible until a client opens the page on a phone.
   See [references/05-verification.md](references/05-verification.md).

## Dependencies

- **Three.js** r128+ (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
  Pin an exact version.
- **Node + Playwright** for the verification scripts (`npx playwright install chromium`).
- **Python 3 + numpy + Pillow** for the measurement scripts.
- **ffmpeg** if the work involves video backgrounds.

`node scripts/preflight.mjs` checks all of these and reports what is missing.
