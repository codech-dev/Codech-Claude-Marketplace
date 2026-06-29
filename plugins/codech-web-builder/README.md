# codech-web-builder

Turn reference website(s) + a brand logo into a deployed website. The skill
drives the whole arc and stays stack-agnostic through a portable core plus thin
per-stack adapters.

## Install

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install codech-web-builder@codech-marketplace
```

Then start a session and say something like "build a site like these references
using this logo" and the skill activates.

## Pipeline (five phases, two gates)

1. **Palette** - read the logo (vision) and emit a token system (`brand-tokens.md`)
   with WCAG-checked text-on-background pairs. No color-extraction dependency.
2. **Reference capture** - screenshot references at desktop + mobile and dump the
   rendered DOM (Playwright), plus structured content (Firecrawl, optional);
   write `reference-analysis.md` + `content-map.md`.
3. **Design** - hand the tokens + analysis to the taste skill, which produces
   `DESIGN-SYSTEM.md` + an HTML/CSS prototype. **GATE 1: you approve the design.**
4. **Convert** - load the chosen adapter and map the portable artifact into the
   target stack. Runs autonomously.
5. **Deploy** - **GATE 2: you approve**, then the adapter runs its own deploy
   recipe; a live screenshot verifies the result.

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
