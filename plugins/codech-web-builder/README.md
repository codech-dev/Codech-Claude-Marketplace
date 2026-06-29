# codech-web-builder

Turn reference website(s) + a brand logo into a deployed website. The skill
drives the whole arc and stays stack-agnostic through a portable core plus thin
per-stack adapters.

> **Team walkthrough:** for the complete end-to-end flow (diagram, phase-by-phase,
> decision points, worked example) see [GUIDE.md](GUIDE.md).

## Install

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install codech-web-builder@codech-marketplace
```

Then start a session and say something like "build a site like these references
using this logo" and the skill activates.

## Pipeline (phases + three gates)

0. **Preflight** - check required skills/tools/inputs; stop and ask if anything
   required is missing.
1. **Palette** - read the logo (vision) and emit a token system (`brand-tokens.md`)
   with WCAG-checked text-on-background pairs. No color-extraction dependency.
2. **Reference capture** - screenshot references at desktop + mobile and dump the
   rendered DOM (Playwright), plus structured content (Firecrawl, optional);
   write `reference-analysis.md` + `content-map.md`. Then source real images locally.
3. **Design the home page** - the taste skill builds the home page prototype.
   **GATE 1: you confirm the home page.**
3b. **Design system + pages** - derive `DESIGN-SYSTEM.md` from the approved home
   page, then build the other pages to match. **GATE 2: you confirm the remaining
   pages** (skipped for single-page sites).
4. **Convert** - load the chosen adapter and map the portable artifact into the
   target stack. Runs autonomously. The build is the primary deliverable.
5. **Deploy (optional)** - **GATE 3: you approve**, then the adapter runs its own
   deploy recipe; a live screenshot verifies the result.

## v1 adapters

- **WordPress** - reuses the `coway-starter` base theme + skin + provisioner.
- **Static** - ships the prototype as a static site to Cloudflare Pages.

Adding a stack later means dropping one file into `adapters/` - the core never
changes.

## Dependencies

- A taste skill (`design-taste-frontend` or `frontend-design`) - required design engine.
- Playwright - reference capture (and post-deploy QA screenshots).
- Firecrawl - optional structured extraction; the skill degrades without it.
- `coway-starter` checkout - WordPress adapter only.
- Cloudflare / `wrangler` - static adapter deploy.
