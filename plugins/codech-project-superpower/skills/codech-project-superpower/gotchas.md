# Gotchas — Battle-Tested Pitfalls

> READ THIS BEFORE EVERY PHASE. Each item caused real time loss during the CGG project. Pre-empt them.

## HTML Proposals

### Cover page splits across PDF pages

**Symptom:** Cover content (title, metadata) renders on page 1 with a phantom green strip on page 2. Or only metadata shows, title cut off.

**Cause:** Three things compound:
1. `.cover { margin: 20px auto }` for screen carries into print
2. `min-height: 297mm` lets Chrome split the cover element
3. `cover-meta` is `position: absolute; bottom: 28mm` — absolute children can render on a different page than their parent

**Fix:** Use flex layout for the cover, push metadata with `margin-top: auto`, lock height in print:

```css
.cover {
  /* ...existing... */
  display: flex;
  flex-direction: column;
  min-height: 297mm;
}
.cover-meta {
  margin-top: auto;       /* push to bottom of flex column */
  display: grid;
  /* remove: position: absolute; bottom: 28mm; left: 22mm; right: 22mm; */
}
@media print {
  .cover {
    margin: 0 !important;
    box-shadow: none !important;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    page-break-after: always;
  }
}
```

### Section headings crammed at bottom of previous page

**Symptom:** A `<h1 class="section">` for §04 appears at the bottom of the page that ends §03, with the section content forced to the next page.

**Cause:** `h1.section:first-of-type { page-break-before: avoid }`. The `:first-of-type` pseudo-class matches the first `h1.section` element **among its parent's children** — not the first one in the document. Since each `<section class="page">` wraps exactly one `h1.section`, every section heading gets the override.

**Fix:** Remove the `:first-of-type` override entirely. The cover's `page-break-after: always` already handles the cover → TOC break:

```css
/* DELETE this rule: */
h1.section:first-of-type { page-break-before: avoid; }

/* Keep this on h1.section: */
h1.section {
  page-break-before: always;
  page-break-after: avoid;
}
```

### Cards split mid-height

**Symptom:** Stat cards in a grid show their top half on one page and bottom half on the next.

**Fix:** Add both legacy and modern page-break properties to card-like components:

```css
.stat-card, .callout {
  page-break-inside: avoid;
  break-inside: avoid;
}
```

Already covered for `table`, `pre`, `.gantt` in our base CSS.

---

## Prototype HTML

### Page renders completely blank, no console errors

**Symptom:** Open `Prototype.html`, see a blank page. Console shows nothing useful.

**Cause:** JSX (`<div>...</div>`) inside `<script type="module">`. Browsers cannot parse JSX natively. The script fails at parse time, before any error handler can catch it.

**Fix:** Add Babel Standalone and change the script type:

```html
<!-- Add before importmap or alongside it -->
<script src="https://unpkg.com/@babel/standalone@7.25.6/babel.min.js"></script>

<!-- Change this: -->
<script type="module">
<!-- To this: -->
<script type="text/babel" data-type="module" data-presets="react">
```

The `data-type="module"` is critical — without it, Babel produces a non-module script and your `import` statements break.

### Babel can't find `react/jsx-runtime`

**Symptom:** Error in console: `Failed to fetch dynamically imported module: .../jsx-runtime`.

**Fix:** Include `react/jsx-runtime` in the importmap:

```json
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "framer-motion": "https://esm.sh/framer-motion@11.5.4?external=react",
    "lucide-react": "https://esm.sh/lucide-react@0.453.0?external=react"
  }
}
```

The `?external=react` query tells esm.sh to leave React as an external (so all packages share the React instance). Without it, you'll get duplicate React errors.

### Right cluster floats mid-header instead of right-aligning

**Symptom:** Top bar's user profile + actions sit in the middle of the header, leaving empty space on the right.

**Cause:** Search bar has `flex-1 max-w-xl`. Once it hits 576px it stops growing, and the spare flex space lands AFTER the right cluster.

**Fix:** Add `ml-auto` to the right cluster:

```jsx
<div className="ml-auto flex items-center gap-1">
  {/* nav, profile, logout */}
</div>
```

This absorbs the spare margin before the cluster, pinning it to the right edge.

### Animations stutter on Safari

**Cause:** Animating `width`, `height`, `top`, `left` triggers reflow. Use `transform` and `opacity` only.

**Fix:** Replace layout-property animations with `scale`, `translateX/Y`, `opacity`. In Framer Motion:

```jsx
// ❌ Bad
animate={{ width: 300, top: 10 }}

// ✅ Good
animate={{ scale: 1.1, y: 10, opacity: 1 }}
```

### Avatar with 2 Chinese characters looks cramped at 36px

**Fix:** Use 1 character as initial, at 32px:

```jsx
<Avatar name="陳" className="w-8 h-8 text-xs" />
```

---

## PDF Export (Chrome Headless)

### Output PDF is empty / write fails on second run

**Symptom:** First export works, second export fails silently.

**Cause:** Chrome holds a profile lock from the previous run.

**Fix:** Use a temporary profile directory per export:

```powershell
$tmpDir = "$env:TEMP\chrome-pdf-$(Get-Random)"
& $chrome --headless=new --user-data-dir="$tmpDir" ... 
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
```

### Chrome prints its own URL/date in headers

**Symptom:** PDF has Chrome's default header (URL) and footer (timestamp + URL).

**Fix:** Add `--no-pdf-header-footer` flag. The `@page` CSS rule will then render your custom footer.

### Fonts fall back to system fonts

**Symptom:** PDF uses Times New Roman or similar instead of Noto Sans TC / Inter.

**Cause:** Google Fonts haven't finished loading when Chrome captures.

**Fix:** Add `--virtual-time-budget=15000` (15 seconds). This is enough for fonts to load even on slow CDN responses.

### Background colors stripped

**Symptom:** PDF has white backgrounds where green/gradient should be.

**Fix:** Already in our CSS:

```css
html, body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

If still stripped, check Chrome's `--print-to-pdf-no-header` flag isn't accidentally aliased differently.

### "GCM PHONE_REGISTRATION_ERROR" in stderr

**Cause:** Harmless. Chrome's cloud messaging tries to register on first run.

**Fix:** Ignore. Or redirect stderr: `2>&1 | Out-Null` in PowerShell.

---

## Architecture Diagrams (Inline SVG)

### Dashed connector paths "dangle" off-canvas

**Symptom:** Lines from services curve out and end at coordinates outside the viewBox or far from any target.

**Cause:** Path endpoints don't match target element coordinates.

**Fix:** Snap endpoints to actual target boxes. Verify with viewBox math:

```svg
<!-- ❌ Bad: ends at x=30, but data box starts at x=40 -->
<path d="M 107,328 C 107,500 30,650 30,778"/>

<!-- ✅ Good: ends at PostgreSQL box center (x=125) -->
<path d="M 107,323 C 70,420 55,680 125,775"
      marker-end="url(#arrMuted)"/>
```

### Orphaned legend entries

**Symptom:** Legend lists colors/lines that don't appear in the diagram.

**Fix:** When removing diagram elements, audit the legend. Remove orphaned swatches.

---

## docx Reading

### `pandoc` not found on Windows

**Fix:** Use the Python unpack script bundled with the `docx` skill:

```powershell
$env:PYTHONIOENCODING="utf-8"
python "C:\Users\<user>\.claude\skills\docx\scripts\office\unpack.py" `
  "input.docx" `
  "$env:TEMP\unpacked"
```

Then read `unpacked/word/document.xml`.

### UnicodeEncodeError on Windows

**Cause:** Default Windows code page (cp1252) can't encode CJK characters when Python writes to stdout.

**Fix:** Always set `PYTHONIOENCODING=utf-8` before running scripts that process CJK:

```powershell
$env:PYTHONIOENCODING = "utf-8"
```

Or in Python:

```python
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
```

### Bash heredoc fails with EOF error when script contains single quotes

**Cause:** Bash heredoc `<< 'EOF'` typically handles single quotes fine, but Git Bash on Windows can have parsing edge cases.

**Fix:** Write the script to a file with the Write tool, then run it:

```bash
# Instead of: python << 'PYEOF' ... PYEOF
# Do:
# 1. Write script.py via Write tool
# 2. python script.py
```

---

## Markdown / Editing

### `Edit` tool fails with "string not found" on complex Chinese content

**Cause:** Visually identical Chinese characters sometimes differ in encoding (full-width vs half-width punctuation, combining marks). The Edit tool requires byte-exact match.

**Fix:** Use Python regex replacement via a script file, or use shorter unique anchors.

### Large file Read truncated

**Fix:** Use `offset` and `limit`:

```
Read(file_path, offset=500, limit=200)
```

For files over 2000 lines, plan the read in segments.

---

## Locale / Bilingual

### Trad vs Simp Chinese mix-up

**Symptom:** Simplified Chinese characters appear in a Trad Chinese document.

**Cause:** Source content was copy-pasted from a mixed source, or AI defaulted to Simp.

**Fix:** Spot-check key characters:
- 體 (Trad) vs 体 (Simp) — common in 系統 (system)
- 證 (Trad) vs 证 (Simp) — common in 認證 (certification)
- 個 (Trad) vs 个 (Simp) — common pronoun
- 麼 (Trad) vs 么 (Simp)
- 為 (Trad) vs 为 (Simp)

If found, do find-replace across all documents.

### English version doesn't carry brand color cues

**Fix:** Both versions share the SAME CSS file or share gradient values. Don't recolor the English version.

---

## General Workflow

### "Just adding one section" turns into a 2-hour edit

**Fix:** Use the appropriate template (`templates/proposal-structure.md` or `templates/pre-dev-docs-structure.md`) and copy the section's exact pattern. Don't improvise.

### Generating documents in wrong order

**Required order:** Proposal → FSD → SAD → TDD → SRS

**Why:** Each builds on the prior. SRS REQ IDs reference FSD feature IDs. TDD code structure mirrors SAD components. Skipping order means rework.

### Prototype goes blank after fresh download

**First step:** Open browser DevTools console. 99% of blank-page issues are caught here.

| Console error | See gotcha |
|---|---|
| "Refused to load" / MIME type | CDN blocked by network — use Edge/Firefox |
| "Failed to fetch dynamically imported module" | Slow CDN — wait 5s and refresh |
| `SyntaxError: Unexpected token <` | Forgot Babel — see "Page renders completely blank" above |
| Nothing in console | Probably `data-type="module"` missing on Babel script |

---

## Pattern Reference: Resilient Defaults

When in doubt, use these defaults:

| Element | Default |
|---|---|
| Page size | A4 (210×297mm) |
| Font stack | `'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'Inter', sans-serif` |
| Mono font | `'JetBrains Mono', 'ui-monospace', 'Consolas', monospace` |
| Primary color (agri) | `#2E7D32` |
| Accent color (agri) | `#FFB300` |
| Text color | `#0F172A` (dark) / `#FFFFFF` (light) |
| Border color | `#E5E7EB` |
| Muted text | `#64748B` |
| Card radius | `0.5rem` (`rounded-lg`) |
| Card shadow | `0 1px 3px rgba(0,0,0,0.07)` |
| Animation duration | 150-300ms |
| Easing | `ease-out` for enter, `ease-in` for exit |
| Stagger delay | 30-50ms per item |
