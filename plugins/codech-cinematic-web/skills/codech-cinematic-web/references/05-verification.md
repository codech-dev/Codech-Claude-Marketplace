# Verification

Effects like these fail invisibly. The page looks right in the browser you built
it in and is broken on the client's phone. This is the checklist that turns
"looks good" into evidence.

## Methods that do not work

Learn these before wasting time on them:

- **`canvas.toDataURL()` and `gl.readPixels()` return blank** on a composited
  WebGL canvas. Compare Playwright screenshots instead.
- **A single-ray luminance profile is noise.** Individual points, orbit arcs and
  field lines cross the ray. Use an angular median over a ±12° fan.
- **Sampling "the brightest pixel near the crest" catches UI, not the effect.**
  In the worked engagement this repeatedly returned RGB(190,255,255) - a
  clipped white value that was the jurisdiction bar's highlight edge, not the
  rim. Take a **row median across the middle 20% of columns**, and hide overlays
  before measuring.
- **Deriving the object's on-screen position from your own formula** rather than
  reading it back. A DPR mix-up made every measurement land 2x off and the
  resulting numbers looked plausible. Read `--crest-y` from the live page.

## The checks

### 1. Composition, every breakpoint

```bash
node scripts/verify_render.mjs --url http://localhost:8080/index.html --layout
```

Reports per size: card height, % of viewport, object radius, crest y, headline
top, and **clearance** (crest to headline).

Pass: clearance >= 60px on desktop at every size; the object keeps a guaranteed
share of the card on phones (~28%+ below the crest).

### 2. Rim brightness is size independent

```bash
node scripts/verify_render.mjs --rim
```

Samples the peak rim colour at the measured crest across 390/1440/1920/2560 at
DPR 1 and 2, and reports deviation from the smallest size.

Pass: every size within ±10%. Reference result after the fixes in
[02-atmosphere.md](02-atmosphere.md): **-3.5% to 0%**.

If a size is far dimmer, check for a **CSS overlay painting over the rim**
before touching the shader - re-run with `--bare` (hides scrims and copy).

### 3. The glow does not band

```bash
node scripts/verify_render.mjs --profile
```

Angular-median luminance from deep space into the rim, at the crest and two
flank angles.

Pass: peak at `d - R ≈ 0`; monotonic rise into the peak; no secondary peaks
outside the rim; no slope sign-flip above ~1 level in the glow field (excluding
the rim spike itself). Reference: peak at **+3px** on all three rays, max
adjacent step 4-9 levels over a monotonic 10->79 climb, **zero band edges**.

A shell-based glow fails this loudly: a step of 10-30 levels at a fixed radius.

### 4. Cursor interaction

```bash
node scripts/verify_render.mjs --hover
```

Diffs two screenshots and bins *brightening* by distance from the pointer,
against a far-field baseline (the object is rotating between frames).

Pass: strong near the cursor, decaying to ~0 by the intended radius. Reference:
+12.0 / +10.4 / +3.3 / ~0 levels at 0-60 / 60-120 / 120-180 / 240px, baseline
+0.05.

### 5. Video fallback with video disabled

```bash
node scripts/verify_render.mjs --novideo
```

Blocks every `.mp4` and screenshots each panel. Pass: every panel still looks
complete - poster visible, no empty coloured rectangle.

### 6. Range requests

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" -r 0-1023 <video-url>
```

Pass: `206` and 1024 bytes. A `200` with the full file means the host ignores
Range - use the blob path in
[04-video-backgrounds.md](04-video-backgrounds.md).

### 7. Console, on every breakpoint

Zero page errors. A thrown `ReferenceError` in a `requestAnimationFrame` loop
silently disables whole features while the page still looks fine - this is
exactly how a nav's dark-ground treatment stayed broken without anyone noticing.

### 8. Reduced motion and touch

- `prefers-reduced-motion: reduce` renders one complete static frame.
- Touch: no hover work, reduced point count, `devicePixelRatio` capped at 2.

## Reporting

State what you measured and what the number was. "All sizes within ±10% (worst
-3.5%)" is a report. "Looks consistent now" is not.

If a check is still failing, say which one and what the number is, rather than
reporting the work as done.
