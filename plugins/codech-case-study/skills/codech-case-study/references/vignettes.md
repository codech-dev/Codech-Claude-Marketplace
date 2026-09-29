# Vignettes (animated product demos)

A vignette is one feature, enlarged, doing its job: a simplified recreation of the real screen on a fixed 600×420 stage, a cursor that clicks and types, and a dark callout pill that names the benefit. This is the Arcade (arcade.software) pattern. It's what makes the card, the page and the film readable; full screenshots shrunk to card size are just grey texture.

## Files
- `work/_shared/ov.js` + `ov.css`: the engine (from this skill's `assets/shared/`; don't edit per project).
- `work/<slug>/assets/scenes.js` + `scenes.css`: the project's scenes.
- Worked example: `examples/otso-ai-hub/scenes.js|css` (search, AI summary, assistant with confirm, chat with locked file, Quick Send dialog, @ai mention). Reuse its structures; most B2B products have a search, a detail/AI panel, an assistant, a list/table, a dialog.

## scenes.js skeleton
```js
(() => {
  const { ic, note, pdf } = OV.h;          // icon svg, callout pill, file-type tile
  const V = {};
  V.search = {
    cls: 'v-search',                        // scene class; CSS lives under .ovp-<slug>.v-search
    hold: 2600,                             // ms to hold the final frame before looping
    html: `<div class="ov-win"> …markup… </div>${note('Found by meaning, not keywords')}`,
    async run(T) {                          // the script; T = toolbox bound to this stage
      T.cur(true, 470, 360); await T.wait(300);
      await T.click('.sbox', { fx:.35 }); T.add('.sbox', 'focus');
      await T.type('.q', 'passport expiring soon', 17);
      T.in('.r1'); await T.wait(220); T.in('.r2');
      T.in('.v-search .ov-note'); T.cur(false);
    }
  };
  for (const [name, scene] of Object.entries(V)) OV.define('<slug>', name, scene);
})();
```
Toolbox `T`: `wait(ms)`, `type(sel, text, cps)`, `move(sel, {fx, fy, dur})`, `click(sel, opts)`, `cur(on, x, y)`, `in(sel)` (add `.in`), `reveal(sel)` (un-hide + animate), `show/hide(sel)` (`.gone`), `add/rm(sel, cls)`, `stagger(sel, gap)`, `q/qa(sel)`, `rect(sel)`. Selectors are scoped to the scene. Everything respects `prefers-reduced-motion` (final state, no animation) and `window.OV_SPEED` (the film sets 1.2).
Helpers `.fx` (fade-up on `.in`), `.pop` (scale-in on `.in`), `.gone` (display:none). Extra icons: `OV.icon('name', '<path d="…"/>')` before defining scenes.

## scenes.css rules
- **Scope every rule to `.ovp-<slug>`**: `.ovp-acme.v-search .sbox{…}` for the scene root, `.ovp-acme .cs-side{…}` for shared parts. The landing page loads every project's scenes at once, and the case page loads Codech's own CSS; unscoped generic class names (`.sec`, `.tag`, `.row`, `.who`, `.live`, `.bar`) collided with landing styles in OTSO and broke layouts. Prefix your own class names too (`ov-row`, not `row`).
- Re-theme with variables on `.ovp-<slug>`: `--navy --navy-deep --acc --acc-strong --acc-tint --ink --mut --line --wash`. Take values from the client's design tokens; use their font if it's on Google Fonts, else Manrope.
- Design at 600×420. Text 10–15px (it scales down on cards, up in the film). Leave 18–26px stage margin around the window.

## Designing a scene (what worked)
1. **One feature per scene**, 8–16 s. Open on a meaningful state, not a blank window (OTSO's summary scene starts with faded skeleton sections that fill in).
2. **Show the "aha"**: the result appearing, a match %, a locked file, a warning panel, a confirm button being clicked.
3. **Callout note** (`note('…')`) at the end: the benefit in ≤6 words. Place it over the window margin, never over the key content (it covered a "Private" badge until moved to `top:-4px`).
4. **Demo content in the client's domain** (KYC files for a brokerage), fictional names, consistent across scenes (the same client "Acme Capital" and people "Wei Liang", "Siti J." recur).
5. **Honest to the product**: only show what the product does (or, for In build areas, what the approved prototype shows). Assistant writes must show the product's real safety model (OTSO: propose → confirm).
6. **Height budget**: count it. Dialogs overflowed twice in OTSO (courtesy panel clipped, cursor clicking empty space); remove a row rather than shrink text.

## Preview and check
`python scripts/preview_scenes.py <site> <slug> [--scene x] [--times 1500,5000,9000]` writes `_qa/preview.html` and timed PNGs. Look at the start frame, the middle and the end of each scene; confirm the cursor lands on its target and nothing is clipped. Iterate until each one reads at a glance.

## Where scenes are used
- Case page: every feature card autoplays while on screen; the hero reel plays each scene once in order (`reel` in case.json).
- Landing card: `card.demos` (2 scenes) play once each, then the carousel advances.
- Film: every feature with a `film` entry, in group order.
