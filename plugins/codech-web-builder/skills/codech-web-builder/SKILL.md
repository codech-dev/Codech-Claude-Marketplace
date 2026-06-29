---
name: codech-web-builder
description: Build a website from reference site(s) plus a brand logo, then deploy it. Extracts a color palette from the logo, captures and analyzes the reference sites, generates a design system + HTML prototype via a taste skill, converts to a target stack (WordPress or static), and deploys. Use when the user wants to build or design a site "like" a reference, turn a logo + references into a website, derive a brand palette from a logo, generate a design system from examples, or convert an approved design into WordPress or a static site and deploy it.
---

# codech-web-builder

Turns reference website(s) + a brand logo into a deployed site. Stack-agnostic:
a stack-neutral core produces one portable artifact, and a thin per-stack adapter
converts + deploys it.

## Inputs to collect first

- The brand **logo** (image file).
- One or more **reference site URLs** (and which page types to reproduce).
- The **target stack** (WordPress or static). If unsure, default to static.

## Pipeline (run in order)

0. **Preflight** - check dependencies BEFORE any work. Confirm a taste skill is
   installed, run `node scripts/preflight.mjs` for tools, and confirm the logo +
   references. If anything REQUIRED is missing, STOP and ask the user to install
   or provide it first. See [references/00-preflight.md](references/00-preflight.md).
1. **Palette** - read the logo and write `artifact/brand-tokens.md`.
   See [references/01-palette-from-logo.md](references/01-palette-from-logo.md).
2. **Capture references** - screenshot + analyze the references into
   `reference-analysis.md` + `content-map.md`.
   See [references/02-capture-references.md](references/02-capture-references.md).
2b. **Source imagery** - download real, topical images locally (one per image
   slot in the content map) so the prototype is never empty gray boxes.
   See [references/06-source-images.md](references/06-source-images.md).
3. **Design** - hand tokens + analysis to a taste skill, which produces
   `artifact/DESIGN-SYSTEM.md` + `artifact/prototype/`.
   See [references/03-design-handoff.md](references/03-design-handoff.md).
   **>> GATE 1: user approves the design before continuing.**
4. **Convert** - select the adapter for the target stack and map the artifact
   into it. Runs autonomously (no gate). The converted, ready-to-deploy build is
   the skill's primary deliverable.
5. **Deploy (OPTIONAL)** - deployment is not compulsory. First ask whether the
   user wants to deploy at all; if not, stop at the built artifact and hand them
   the deploy instructions. If yes: **>> GATE 2: user approves**, then the
   adapter runs its own deploy recipe; verify with a live screenshot.

The artifact every adapter consumes is defined in
[references/04-conversion-contract.md](references/04-conversion-contract.md).
Both gates and the post-deploy QA are in
[references/05-gates-and-qa.md](references/05-gates-and-qa.md).

## Adapters

Pick the one matching the target stack:

- WordPress (catalog/agent-style sites): [adapters/wordpress.md](adapters/wordpress.md)
- Static site (universal fallback): [adapters/static.md](adapters/static.md)

If no adapter matches the user's stack, use the static adapter as the fallback,
or add a new `adapters/<stack>.md` (the core does not change). Never invent a
deploy step outside an adapter.

## Dependencies

- **Taste skill** (`design-taste-frontend` or `frontend-design`) - REQUIRED design
  engine (phase 3). Stop and ask the user to install it if absent.
- **Playwright** - reference capture + QA screenshots (`scripts/capture.mjs`).
- **Firecrawl** - optional structured extraction; the skill degrades without it.
- **Images** - `scripts/fetch-images.mjs` uses `PEXELS_API_KEY` or
  `UNSPLASH_ACCESS_KEY` if set (better quality), else Openverse (no key).
- **coway-starter** checkout - WordPress adapter only.
- **Cloudflare / wrangler** - static adapter deploy.
