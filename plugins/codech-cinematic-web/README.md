# codech-cinematic-web

Build the two effects that carry a cinematic marketing page, and ship them
without the failures they are prone to:

1. **A WebGL hero object** — a dot-matrix planet, glowing orb or product form
   with a luminous rim, an atmosphere that does not band, and cursor
   interaction done on the GPU.
2. **A sticky scroll deck** — one gesture advances exactly one panel, each
   backed by full-bleed video that actually plays on iOS.

Both are straightforward to get 80% right and genuinely hard to finish. This
plugin exists because the last 20% is not intuition — it is a small set of
specific failures, each with a specific fix and a measurement that proves it.

## Install

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install codech-cinematic-web@codech-marketplace
```

Then just describe what you want — "animated globe hero", "make each scroll
swipe move one section", "reproduce the effect in this video" — and the skill
loads itself.

## What it contains

```
skills/codech-cinematic-web/
  SKILL.md                     entry point; routes to the right reference
  references/
    01-hero-object.md          geometry, surface, cursor, framing, survival
    02-atmosphere.md           the analytic glow; why shells cannot work
    03-scroll-deck.md          progress model, direction-driven snapping
    04-video-backgrounds.md    posters, iOS autoplay, Range requests, encoding
    05-verification.md         what to check before claiming it works
    06-generating-clips.md     still -> seamless looping video, end to end
  reference-impl/
    hero-object.html           complete working hero, copy and adapt
    scroll-deck.html           complete working deck, copy and adapt
  scripts/
    measure_geometry.py        fit a reference frame's silhouette
    make_clip_pair.sh          join an intro/loop pair + measure every seam
    verify_render.mjs          layout / rim / profile / hover / novideo checks
    preflight.mjs              dependency check
```

## The headline lessons

**Measure, then place.** Every serious error in the engagement this came from
was a number assumed rather than measured. A hero framed by eye had its crest
cropped out of frame; tracing the rim and fitting a circle gave
centre 49.6% × 100%, radius 43.8%, residual 2.5px — and the composition was
right immediately.

**One analytic glow, never stacked shells.** A back-side fresnel shell is
brightest at its own silhouette, so each shell ends in a hard ring. Three
shells = three visible rings, and no radius tuning removes them. Compute the
falloff analytically in screen space instead: maximum exactly at the rim,
monotonic outward, with ±1/255 dither.

**Brightness is a property of the light, not the viewport.** Deriving glow
width from canvas width made the same code a third as bright on desktop as on
mobile. Express widths as CSS-pixel constants × DPR.

**Check the CSS before blaming the shader.** A "3× dimmer rim" turned out to be
a legibility scrim painting over the crest. The shader was innocent.

**One gesture, one panel — keyed on direction.** Snapping by nearest position
lets a fast swipe skip two panels and a small nudge spring back. Step from the
last *settled* index in the gesture's direction.

**Two clips per section, sharing one frame.** A loop needs its first and last
frames identical; an entrance starts somewhere else. One clip cannot be both.
Generate an intro (empty plate -> rest pose) and a loop (rest pose -> rest
pose) with a model that accepts an end frame, then blend the intro's tail into
the loop's exact first frame **in raw YUV** - ffmpeg's `xfade` reverts mid-fade
and an RGB round trip biases by ~1.3 levels, both visible as a flash.

**Assume the video will not play.** iOS refuses autoplay without `muted` as a
property; rejects `play()` when `preload="none"` leaves no buffered data; and
stalls entirely when the host does not serve `206` to Range requests. Put a
poster plate under every clip and verify with all video blocked.

## Verified, not asserted

The reference implementations were measured in-browser, not eyeballed:

| check | result |
|---|---|
| Hero rim present at crest | RGB(98,177,254), lum 165.6 |
| Glow band edges (crest ray) | **none** over a monotonic 10.6→66.6 climb |
| Crest-to-headline clearance | exactly **60px** at 1440×900 and 1920×1080 |
| Deck, one gesture one panel | 0→1→2→3→3→2→1→0, both directions, any gesture size |
| Deck title readable on approach | opacity 1.0 throughout — a fade, not a stop |
| `prefers-reduced-motion` | deck unarmed, all panels visible, stage static |
| Console errors | none |
| `make_clip_pair.sh` on real clips | loop wrap 1.01 vs p95 1.07 (invisible); join 0.64, signed [0.05,0.05,0.05] (clean); intro ends still |

`measure_geometry.py` independently reproduced the manual measurement of the
original reference frame to within 1% (49.5% vs 49.6% centre, 22.1% vs 22%
crest).

## Requirements

Three.js r128+ (CDN). Node + Playwright + pngjs for verification. Python 3 +
numpy + Pillow for measurement. ffmpeg for video work. Run
`node scripts/preflight.mjs` to check.

## License

MIT © Codech
