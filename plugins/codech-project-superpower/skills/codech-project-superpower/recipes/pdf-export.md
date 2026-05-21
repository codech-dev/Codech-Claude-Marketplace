# Recipe: PDF Export via Chrome Headless

> Convert any HTML proposal or document to a print-quality PDF. Battle-tested settings; preserves CSS, SVG, gradients, fonts.

## When to use

- Exporting `Project_Proposal.html` to `Project_Proposal.pdf`
- Same for `Project_Proposal_EN.html`
- Any other HTML doc with `@page` print rules

## Prerequisites

- Google Chrome installed (any modern version)
- Default install path on Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`

## The command (Windows PowerShell)

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$inputFile  = "<absolute path to .html>"
$outputFile = "<absolute path to .pdf>"
$inputUrl   = "file:///" + ($inputFile -replace '\\', '/' -replace ' ', '%20')
$tmpDir     = "$env:TEMP\chrome-pdf-$(Get-Random)"

if (Test-Path $outputFile) { Remove-Item $outputFile -Force }

& $chrome `
  --headless=new `
  --disable-gpu `
  --user-data-dir="$tmpDir" `
  --no-pdf-header-footer `
  --virtual-time-budget=15000 `
  "--print-to-pdf=$outputFile" `
  $inputUrl 2>&1 | Out-Null

# Verify
if (Test-Path $outputFile) {
    $bytes = [System.IO.File]::ReadAllBytes($outputFile)
    $content = [System.Text.Encoding]::ASCII.GetString($bytes)
    $pageCount = ([regex]::Matches($content, '/Type\s*/Page[^s]')).Count
    Write-Host ("OK: {0:N0} bytes ({1:N2} MB), {2} pages" -f $bytes.Length, ($bytes.Length / 1MB), $pageCount)
} else {
    Write-Host "FAIL: PDF not created"
}

# Clean up temp profile
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
```

## The command (macOS / Linux Bash)

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # macOS
# CHROME="/usr/bin/google-chrome"                                        # Linux

INPUT="<absolute path to .html>"
OUTPUT="<absolute path to .pdf>"
TMP_DIR="/tmp/chrome-pdf-$RANDOM"

rm -f "$OUTPUT"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --user-data-dir="$TMP_DIR" \
  --no-pdf-header-footer \
  --virtual-time-budget=15000 \
  "--print-to-pdf=$OUTPUT" \
  "file://$INPUT" 2>/dev/null

[ -f "$OUTPUT" ] && echo "OK: $(du -h "$OUTPUT" | cut -f1)" || echo "FAIL"
rm -rf "$TMP_DIR"
```

## Why each flag

| Flag | Why |
|---|---|
| `--headless=new` | Chrome 109+ uses the new headless mode (better print fidelity than legacy) |
| `--disable-gpu` | Avoids GPU init errors on systems without one |
| `--user-data-dir="$tmpDir"` | **Per-export temp profile** — avoids file lock when re-running |
| `--no-pdf-header-footer` | Suppresses Chrome's default header (URL) and footer (date + URL); your `@page` rule renders instead |
| `--virtual-time-budget=15000` | Gives 15s for Google Fonts + images to load before capture |
| `--print-to-pdf="$outputFile"` | Output destination |
| `file:///...` URL | Required for local files; URL-encode spaces as `%20` |

## Required HTML setup

Your HTML must have these CSS rules for clean PDF output:

```css
@page {
  size: A4;
  margin: 18mm 16mm 20mm 16mm;
  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    color: #888;
  }
  @bottom-right {
    content: "<PROJECT> v1.0";
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    color: #aaa;
  }
}
@page :first { margin: 0; @bottom-center { content: ""; } @bottom-right { content: ""; } }

html, body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@media print {
  body { background: #fff; }
  .page { box-shadow: none; margin: 0; padding: 0; max-width: none; min-height: 0; }
  /* Per-element print overrides */
}

/* Section page breaks */
h1.section { page-break-before: always; page-break-after: avoid; }

/* Card/callout split prevention */
.stat-card, .callout, table, pre, .gantt {
  page-break-inside: avoid;
  break-inside: avoid;
}
```

## Verification

After export, sanity-check:

| Metric | Healthy range |
|---|---|
| File size | 1.5 MB – 3 MB (most proposals) |
| Page count | 30 – 60 pages |
| First page (cover) | Full-bleed gradient, no white margin |
| Page numbers | "Page N of M" in bottom-center (not "Page N of N+1") |
| Colors | Match the HTML (green, gold, gradient) — not flat gray |
| Fonts | Look like Inter / Noto Sans TC, NOT Times New Roman |

If any of these fail, see `gotchas.md` § PDF Export.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `OK: N bytes` but file is empty | Chrome lock from previous run | Use `--user-data-dir="$tmpDir"` (per-export) |
| Cover page has white space at top | `.cover` has `margin: 20px auto` for screen | Add `@media print { .cover { margin: 0 !important } }` |
| Sections start at bottom of previous page | `h1.section:first-of-type { page-break-before: avoid }` matches every section | Remove that rule entirely |
| Stat cards split mid-card | Missing page-break rule | Add `page-break-inside: avoid` + `break-inside: avoid` to `.stat-card` |
| Fonts are Times New Roman | Google Fonts didn't load in time | Increase `--virtual-time-budget=30000` |
| Background colors stripped | Missing print-color-adjust | Add `print-color-adjust: exact` to html, body |
| Chrome prints its own header | Missing `--no-pdf-header-footer` | Add the flag |
| `GCM PHONE_REGISTRATION_ERROR` in stderr | Harmless | Ignore or redirect: `2>&1 | Out-Null` |

## Alternative tools (if Chrome unavailable)

| Tool | Pros | Cons |
|---|---|---|
| **wkhtmltopdf** | Smaller binary, scriptable | Old WebKit, may break modern CSS |
| **Playwright headless** | More automation hooks | Heavier install |
| **Pandoc + LaTeX** | Beautiful typography | Doesn't preserve HTML/CSS fidelity |
| **WeasyPrint** | Pure Python | CSS support is limited |

**Default to Chrome.** It's installed on virtually every machine and produces the best output.

## Microsoft Edge as a drop-in

Edge is Chromium-based, so the same flags work:

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless=new --disable-gpu --user-data-dir="$tmpDir" `
        --no-pdf-header-footer --virtual-time-budget=15000 `
        "--print-to-pdf=$outputFile" $inputUrl
```

Useful when Chrome isn't installed.

## Quality bar

Before considering the PDF "client-ready":

- [ ] Opens in Adobe Acrobat / Preview / Edge PDF viewer correctly
- [ ] All section headings start on a new page
- [ ] All tables/cards/code blocks are intact (no mid-element splits)
- [ ] Cover is full-bleed and beautiful
- [ ] Page numbers show "Page N of M" with correct totals
- [ ] No console errors during generation (other than GCM noise)
- [ ] Bilingual: both PDFs have identical page counts (or very close)
