# Phase 0: preflight (check dependencies BEFORE any work)

Run this first, before collecting inputs or doing any pipeline step. The point is
to fail fast: never get three phases deep and then discover the taste skill is
missing. Check everything up front, then stop and ask the user to install/provide
anything REQUIRED that is missing.

## Dependency tiers

**REQUIRED (hard stop if missing):**
- A **taste skill**: `design-taste-frontend` or `frontend-design`. This is the
  design engine for phase 3. Check your own available-skills list - if neither is
  present, STOP and ask the user to install one before continuing.
- **Node.js >= 18** to run the bundled scripts.
- **Inputs**: a brand logo (image file) and at least one reference URL (or
  screenshots). If missing, ask for them before starting.

**CAPTURE (need at least ONE of these for phase 2):**
- Playwright (npm) via `scripts/capture.mjs`, OR
- a Playwright MCP server (screenshots via MCP), OR
- Firecrawl (skill or MCP), OR
- user-supplied screenshots.
If none are available, ask the user to provide screenshots.

**CONDITIONAL (only if you will DEPLOY, which is optional):**
- Static adapter deploy: `wrangler` + a Cloudflare login with Pages edit scope.
- WordPress adapter: a `coway-starter` checkout + either SSH/WP-CLI or the no-SSH
  MCP path.
These are NOT needed to produce the build. Only check them if the user opts to
deploy (see 05-gates-and-qa.md).

**OPTIONAL (quality/convenience):**
- `PEXELS_API_KEY` or `UNSPLASH_ACCESS_KEY` for better imagery (else Openverse).

## How to run preflight

1. **Skills**: look at your available skills. Confirm a taste skill is present.
2. **Tools**: run the bundled check:
   ```
   node scripts/preflight.mjs
   ```
   It reports node / playwright / wrangler / git / ssh / image keys with their
   tier. Exit code is non-zero only if a REQUIRED tool is missing.
3. **Inputs**: confirm you have the logo and reference URL(s).

## Decision

- **Any REQUIRED item missing** (taste skill, Node >= 18, logo, or references):
  STOP. Tell the user exactly what is missing and how to install/provide it (e.g.
  "Install the taste skill, then re-run"). Do not start the pipeline.
- **No capture path available**: ask the user for screenshots before phase 2.
- **Conditional/optional missing**: do NOT block. Note it. Surface it again only
  at the point it matters (deploy gate, or the image-quality note).

Report a short preflight summary to the user (what is present, what is missing,
what you will do about each) before moving to phase 1.
