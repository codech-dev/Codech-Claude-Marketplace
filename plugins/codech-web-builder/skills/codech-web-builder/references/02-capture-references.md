# Phase 2: capture + analyze reference sites

Capture the reference site(s) the user gave, then distil them into two files the
design phase consumes: `reference-analysis.md` and `content-map.md`.

## Primary path: Playwright (visual + DOM)

For each reference URL, run the bundled capture script:

```
node scripts/capture.mjs <url> <outDir>
```

It writes `desktop.png`, `mobile.png`, and `dom.html` into `<outDir>`. Capture
the key pages the user cares about (home first; then any page types they want
reproduced).

If Playwright is not installed, the script prints the install command
(`npm i -g playwright && npx playwright install chromium`). Offer to install it.

## Structured path: Firecrawl (optional)

When Firecrawl (skill or MCP) is available, also pull structured content for each
URL: markdown body, metadata (title/description), and the sitemap if you need the
page inventory. This gives cleaner copy and structure than scraping the DOM by
eye.

## Degradation ladder (follow in order)

- **Playwright unavailable** -> fall back to Firecrawl screenshots + content.
- **Both Playwright and Firecrawl unavailable** -> ask the user to supply
  screenshots of the references; proceed from those.
- **Firecrawl unavailable (Playwright fine)** -> proceed with Playwright
  screenshots + `dom.html` only, and note that structured extraction was reduced.

Always state which path you used so the user knows the fidelity.

## Analyze -> `reference-analysis.md`

From the screenshots + DOM, write `reference-analysis.md` with these sections:

- **Layout patterns** - grid system, container widths, header/footer shape,
  recurring section rhythm.
- **Section inventory** - the ordered list of sections on each captured page
  (hero, trust bar, feature grid, testimonial, pricing, contact, etc.).
- **Motion read** - what animates and how much (scroll reveals, parallax,
  hovers). Translate into a MOTION_INTENSITY sense.
- **Density read** - whitespace vs content density -> a VISUAL_DENSITY sense.
- **Color + type observations** - note the reference's choices, but remember the
  brand tokens from phase 1 win; references inform layout/feel, not brand color.

## Map -> `content-map.md`

Write `content-map.md`: for each section the new site will have, the copy and
structural notes (headline, subcopy, list items, CTA label and intent). This is
what the prototype's sections get filled with. Keep copy real and specific; do
not invent facts about the user's business that they did not provide.
