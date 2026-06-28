# Screenshot Pipeline

How to capture prototype mockups as PNGs so mobile users see clean images instead of squished HTML. Skip this entire workflow if the proposal has no `.prototype-mockup` elements.

---

## §when When to use

- Proposal has mockups embedded as live HTML (with class `prototype-mockup`)
- Mockups break on mobile (multi-column grids squish, sidebars overflow)
- Client will view the proposal on phones — most do

Skip if the proposal is text-and-cards only with no embedded UI previews.

---

## §prereqs Prerequisites

- Node.js and `npx` installed
- `wrangler` installed (you probably already have this for deploy)
- Playwright tools available (via Claude's MCP playwright integration, or local `npm install @playwright/test`)
- Python 3 OR Node `http-server` (for local serving)
- The proposal HTML file is complete with `prototype-mockup` class on every mockup wrapper

---

## §workflow Workflow

```
1. Tag every mockup with class="prototype-mockup"
2. Start a local HTTP server (file:// won't work in Playwright)
3. Navigate Playwright to the proposal URL
4. Force anim-up to settled state (skip animation gates)
5. Remove any "Tap to enlarge" mobile hints
6. Tag each mockup with data-mockup="<id>" for selector
7. Take element screenshots (one per mockup) at 1280px viewport
8. Save PNGs to screenshots/ folder with module-named filenames
9. Wire up the mobile lightbox JS to load them (see visual-idioms §lightbox)
```

---

## §local-server Local HTTP server

Quick Python option (works on Mac/Linux/Windows with Python installed):

```bash
cd "path/to/proposal/folder"
python -m http.server 8765
```

Then navigate Playwright to `http://localhost:8765/proposal.html`.

Don't use `file://` URLs — Playwright blocks them by default.

---

## §playwright-script Playwright capture script

The reusable runner is at `scripts/capture-screenshots.mjs`. It expects:

- The proposal HTML served at a URL (passed as arg or default `http://localhost:8765/index.html`)
- A `screenshots/` folder (created automatically if missing)
- Mockup labels mapped to filenames (edit the `LABELS` constant in the script)

Run it:

```bash
node scripts/capture-screenshots.mjs
# or with explicit URL:
node scripts/capture-screenshots.mjs http://localhost:8765/proposal.html
```

Outputs:
```
screenshots/
  module-01-workspace.png
  module-01-project.png
  module-02-assistant.png
  module-03-meetings.png
  module-03-meeting-detail.png
  module-04-knowledge.png
```

---

## §mcp-playwright Using Claude's Playwright MCP

If you're driving the build through Claude (with MCP playwright tools), the pipeline is:

```javascript
// 1. Navigate
await browser_navigate({ url: 'http://localhost:8765/proposal.html' });

// 2. Force settled state and tag mockups
await browser_evaluate({
  function: `() => {
    document.querySelectorAll('.anim-up').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.prototype-mockup-hint').forEach(el => el.remove());
    const labels = ['module-01-workspace', 'module-01-project', /* ... */];
    const mockups = document.querySelectorAll('.prototype-mockup');
    mockups.forEach((m, i) => { m.setAttribute('data-mockup', labels[i]); });
  }`
});

// 3. Screenshot each
await browser_take_screenshot({
  element: 'Module 01 workspace',
  target: '[data-mockup="module-01-workspace"]',
  filename: 'module-01-workspace.png',
  type: 'png',
});
// ... repeat for each mockup
```

The screenshots save to Playwright's CWD; you may need to move them to your project's `screenshots/` folder afterwards.

---

## §post-capture After capturing

Once PNGs exist:

1. Verify each screenshot looks clean (no animation gates triggered, no mobile hints visible, no scroll bars)
2. Optimise file sizes if needed (`pngquant` or `oxipng`)
3. Wire up the mobile lightbox JS (`references/visual-idioms.md` §lightbox) with the right filenames
4. Test on mobile viewport: should see clean PNG, tap opens lightbox

---

## §sizing Sizing notes

- **Viewport for capture:** 1280×900 (matches `max-w-container` of 1280px)
- **Element screenshot mode:** `scale: 'css'` (don't double-resolution — file sizes balloon)
- **Typical file sizes:** 100–250KB per mockup for the JY Global proposal (uncompressed PNG)
- **`loading="lazy"` always set** on the `<img>` tags so desktop never loads them

---

## §troubleshooting Troubleshooting

| Symptom | Fix |
|---|---|
| Animations trigger mid-capture (faded sections in screenshot) | Make sure the JS `is-visible` force runs BEFORE `take_screenshot` |
| Mobile hint pill appears in screenshot | The viewport is below 768px; resize to ≥1280px first |
| Image is full page instead of mockup only | You passed `fullPage: true` — remove it for element screenshots |
| Element selector returns nothing | `data-mockup` attribute wasn't set; re-run the evaluate step |
| File saves to wrong path | Use absolute path in `filename` or move files after |
