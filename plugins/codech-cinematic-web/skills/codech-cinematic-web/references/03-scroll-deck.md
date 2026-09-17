# The sticky scroll deck

One gesture advances exactly one panel. A tall scroller drives a sticky stage;
panels cross-fade and lift as scroll progress passes their window.

This is the effect users describe as "swipe once, go to the next one" - and it
took four corrections to get right in the engagement this came from. The
corrections are all here.

## Structure

```html
<section class="svc-scroller is-armed" id="scroller">   <!-- tall: 360vh -->
  <div class="svc-stage" id="stage">                    <!-- sticky: 100vh -->
    <h2 class="deck-title">Our Services</h2>            <!-- NOT a panel -->
    <div class="svc-bg" id="bg"><!-- video slots --></div>
    <div class="svc-deck">
      <div class="svc-slot" data-slot="0"><article class="svc">...</article></div>
      <!-- one per panel -->
    </div>
  </div>
</section>
```

`is-armed` is added by JS. Without it the section is plain stacked cards, so
the page degrades gracefully when scripting is off.

## Progress and windows

```js
const CARDS_START = 0.15;   // p at which panel 0 begins to rise; below this
                            // the title is still fading - it is NOT a stop
const CFG = { overlap: 0.35, fade: 0.55, lift: 60, scale: 0.94, damp: 0.6 };

function progress(){
  const r = scroller.getBoundingClientRect();
  const span = scroller.offsetHeight - window.innerHeight;
  return clamp((-r.top) / span, 0, 1);
}

function windows(){
  const n = slots.length;
  const span = 1 - CARDS_START;
  const len  = span / (n - (n - 1) * CFG.overlap);
  return { len, step: len * (1 - CFG.overlap) };
}
```

Each panel `i` occupies `[CARDS_START + i*step, ... + len]`, and is brightest at
the centre of its window.

## Direction-driven snapping

**This is the part that matters.** Snapping to the nearest panel by scroll
position is wrong in two directions at once:

- one fast swipe travels far enough to land nearest panel 3, skipping two;
- a small nudge does not travel far enough to change the nearest panel, so it
  springs back and the user cannot advance.

Both were reported verbatim: *"I can swipe once and it will swipe to the third
and fourth directly"* and *"I do a minor scroll and it still goes back to the
same slide, instead of my minor scroll direction next slide."*

Snap on the **sign of the gesture**, not on where it ended up:

```js
const SETTLE = 220;   // ms of quiet that counts as "the gesture ended"
const GLIDE  = 420;   // ms to ease into the snapped position

let dir = 0, timer = null;

function gesture(delta){
  if (!inDeck()) return;              // only once inside the deck
  if (delta) dir = Math.sign(delta);  // remember the DIRECTION
  clearTimeout(timer);
  timer = setTimeout(commit, SETTLE);
}

function commit(){
  if (!inDeck() || !dir) return;
  const cur  = nearestIndex();        // where we are now
  const next = clamp(cur + dir, 0, slots.length - 1);
  glideTo(scrollYFor(next));          // exactly one panel, in the gesture's
  dir = 0;                            // direction
}

function inDeck(){
  const r = stage.getBoundingClientRect();
  if (r.top > 1 || r.bottom < window.innerHeight - 1) return false;
  return progress() >= CARDS_START;   // the title is not a stop
}

addEventListener('wheel', (e) => {
  if (inDeck()) { e.preventDefault(); scrollBy(0, e.deltaY * CFG.damp); }
  gesture(e.deltaY);
}, { passive: false });
```

For touch, track `touchstart`/`touchmove` Y and feed the delta to the same
`gesture()`.

## The title is not a panel

*"Technically the title is not a slide, it's a scroll-driven fade in fade out
title."*

A heading that fades in above the panels must **not** be a snap stop. Two rules
enforce this:

1. `inDeck()` requires `progress() >= CARDS_START`. Above that the deck does not
   intercept scrolling at all.
2. There is no stop at index -1. The first stop is panel 0.

The related report - *"it directly gets absorbed by the first entity slide, the
absorb should only work once we enter the first slide"* - is the same bug: the
snap was engaging while the title was still fading. If a user cannot scroll to
read the deck's own heading, `inDeck()` is returning true too early.

## Rendering a frame

```js
function render(p){
  const W = windows();
  // title: a scroll-driven fade, not a stop
  const tIn  = easeOutCubic(clamp((p + TITLE_IN) / TITLE_IN, 0, 1));
  const dim  = 1 - clamp((p - (CARDS_START - 0.04)) / 0.04, 0, 1);
  title.style.opacity = tIn * dim;

  let best = -1, bestO = 0;
  for (let i = 0; i < slots.length; i++){
    const t = (p - (CARDS_START + i * W.step)) / W.len;
    const o = (t < 0 || t > 1) ? 0
            : Math.min(easeOutCubic(clamp(t / CFG.fade, 0, 1)),
                       easeOutCubic(clamp((1 - t) / CFG.fade, 0, 1)));
    const rise = easeOutCubic(clamp(t / (CFG.fade * 0.85), 0, 1));
    slots[i].style.opacity   = o;
    slots[i].style.transform =
      `translateY(${(1-rise) * CFG.lift}px) scale(${CFG.scale + (1-CFG.scale)*rise})`;
    if (o > bestO){ bestO = o; best = i; }
  }
  for (let i = 0; i < slots.length; i++) setLive(slots[i], i === best);
}
```

Drive `render()` from `requestAnimationFrame`, not from the scroll event, so it
keeps painting while a glide animation runs.

## Centring the deck heading

Two reports - *"Our Services is not at the center"* and *"I can see 30% of the
previous section's white background"* - both come from the sticky stage being
taller than the viewport or carrying inherited padding. The stage must be
exactly `100vh`/`100svh` with its own centring, independent of the section's
padding.

## The header over the deck

If the deck runs full-bleed video under a sticky header, **drop the header's
`backdrop-filter` for that stretch**. Blurring a moving picture reads as a
smeared band, not as glass; the effect depends on what is behind it being
still.

```js
const r = deckEl.getBoundingClientRect();
const probe = nav.getBoundingClientRect().bottom - 2;   // 2px in: no flicker
                                                        // at the exact boundary
nav.toggleAttribute('data-deck', r.top <= probe && r.bottom > probe);
```
```css
@supports (backdrop-filter: blur(1px)) {
  .nav { backdrop-filter: saturate(180%) blur(20px); }
  .nav[data-deck] { backdrop-filter: none; }   /* and on any glass button */
}
```

Measure against the scroller's own box rather than the painted ground, so the
state does not flicker as each panel's wash fades.

**Scope check:** if the nav script lives in a different `<script>` block from
where the deck element is declared, a top-level `var` is *not* shared - look the
element up inside that scope. A `scroller is not defined` error thrown every
frame silently disabled the nav's entire dark-ground treatment in the worked
example, and went unnoticed because nothing visibly broke.
