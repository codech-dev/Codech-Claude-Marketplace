# Verification

Compliance copy must be verified against the **built output**, not just source. Conditional rendering, build transforms, and "fixed only the first instance" bugs all hide in source-only checks.

## Step 1 — Build the site

Use the project's real build. For a Next.js static export it's `npm run build` → output in `out/`. For other stacks, find the production build dir. If you need to serve it: static-export projects use `npx serve out` (NOT `next start`, which errors on `output: export`).

## Step 2 — Banned-terms scan (must return ZERO)

Grep the built HTML for every removed term. Tune `>Term<` anchors to avoid matching legitimate substrings.

```bash
H=out/index.html   # or the built page(s)
grep -ioE "buy btc|sell btc|order filled|live rate|updated just now|real-time rate|\
[0-9]+\.[0-9]{2,4}|[0-9]% spread|24h change|>Visa<|Mastercard|\
>Settled<|>Active<|>Instant<|T\+1|<2h|>Complete<|global payment rails|best price|market price" \
  "$H" | sort -u
# Expect: no output.
```

Investigate every hit. A leftover `>Settled<` in BNEVA came from an *on/off-ramp receipt* card that wasn't part of the main edits — find the component, fix it (e.g. `Settled` → `Approved`, `Complete` → `Illustrative`).

Note on `[0-9]+\.[0-9]{2,4}` (catches stray prices/rates): it will also match version numbers and legit decimals — eyeball hits rather than trusting the count.

## Step 3 — Verbatim approved-string scan (must be ALL present)

For each legal-approved block, confirm it's in the build **exactly**. `grep -F` (fixed-string) so punctuation/spacing must match.

```bash
H=out/index.html
chk(){ grep -qF "$1" "$H" && echo "  ☑ $2" || echo "  ☐ MISSING: $2"; }
chk "does not provide deposit-taking or banking services" "No-banking line"
chk "Virtual account and IBAN functionality is not currently available" "Virtual account"
chk "Virtual card functionality is not currently available" "Virtual card"
chk "are indicative only and may not all be currently available" "Indicative assets"
chk "Exchange rates are determined by the relevant service provider" "FX facilitation"
chk "should not be regarded as an endorsement" "Registration ≠ endorsement"
# … one line per approved block the document supplied.
```

A `☐ MISSING` usually means you paraphrased instead of pasting verbatim, or the build didn't pick up the change.

## Step 4 — Confirm old wording is GONE

```bash
grep -qF "<old phrase being replaced>" "$H" && echo "STILL PRESENT — fix" || echo "removed"
```
Beware false positives: a phrase ("internal risk acceptance policy") may legitimately survive in *other* sections (hero, CTA) while being removed from the *footer*. Scope the check to the file you changed (`grep -c "<phrase>" components/Footer.tsx`) when the term is reused elsewhere on purpose.

## Step 5 — Metadata / head

```bash
grep -oE "<title>[^<]*</title>" "$H"
grep -oE 'property="og:title"[^>]*' "$H"
grep -oE 'name="description"[^>]*' "$H"
```
Confirm none still carries the high-risk phrasing (e.g. the old "Global Payment Rails" title).

## Step 6 — Walk the document's own checklist

If the review/plan ships a pre-launch checklist, run each item against the built HTML (see `banned-terms-checklist.md` §7). Report every box as ☑/☐.

## Optional — live DOM check for interactive elements

Tabs/accordions render their content on interaction; static HTML may only contain the default tab. To verify a tab's de-risked content, drive it with the Playwright MCP browser: click the tab, **wait for the React re-render** (don't read the DOM synchronously in the same tick — state updates are async), then read `.innerText`. Screenshots saved by the browser MCP may land in its sandbox and not be readable via `Read`; prefer `browser_evaluate` returning text for assertions.

## Reporting

State results as: banned-terms count (must be 0), approved-strings checklist (all ☑), build status (compiled clean), and the document-checklist walk. Always end with the one box you can't tick: **final human legal/compliance sign-off on the rebuilt page before launch.**
