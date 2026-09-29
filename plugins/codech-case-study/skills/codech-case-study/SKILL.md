---
name: codech-case-study
description: >-
  End-to-end Codech portfolio workflow in two modes. (A) Gather: when a client project is finished or hits a milestone, collect its resources into a portfolio asset pack (measured project stats, factual PROJECT_BRIEF, brand assets, app/prototype screenshots, the clickable prototype and proposal, redacted specs) saved to the Codech Marketing 'AI Portfolio Assets' folder. (B) Build: turn such a pack into a case study on the Codech AI landing site: animated code-built product demos ("vignettes"), a Results-carousel card, a case-study page built from case.json, embedded proposal + prototype, a captioned product film, and a Cloudflare Pages deploy. Use this whenever the user says a project is done and wants its assets, screenshots, prototype or project details gathered/collected/packaged/saved for the portfolio; or wants to add a project or client work to the landing page, Results section, portfolio or case studies ("case study", "showcase this project", "add <client> to our results", "portfolio pack", "portfolio assets", "demo video of the project"); or uploads an asset pack folder; or wants to update, re-film or redeploy an existing case study (a feature went live, new numbers, client consent changed).
---

# Codech case study

Two modes; pick by where you are and what the user asked:
- **Mode A: Gather** (run inside a finished client project): collect everything a case study needs into a portfolio asset pack. Read `references/gather.md` and follow it; templates are in `assets/pack-template/`, helpers are `scripts/gather_stats.py`, `scripts/capture_screens.py`, `scripts/scan_pack.py`. Stop after the pack is saved and reported, unless the user also wants the case study built.
- **Mode B: Build** (run in the Codech Marketing project): turn a pack into a live case study. Everything below this line.

## Mode B: Build the case study

Turn a Codech project's asset pack into a case study on `site/codech-ai-landing`, the same way the OTSO AI Hub case study was made (see `examples/otso-ai-hub/`). One `case.json` per project is the source of truth; scripts render the page, the landing card and the film from it, so updating a case study means editing `case.json` and re-running a script.

What a finished case study has:
- **Vignettes**: small animated recreations of the real product screens (cursor, typing, reveal), built in HTML/CSS on the shared engine. Not AI-generated images: image models garble UI text and invent screens, which misrepresents real client work.
- **Landing card** in the Results carousel: headline, 3 KPIs, client logo, two live demos labelled Live / In build, link to the page.
- **Case-study page** `work/<slug>/`: hero + showreel of every demo, stats, problem, one section per product area with Arcade-style feature cards, optional design-decision band, pipeline, "How we delivered" viewer embedding the proposal and prototype, engineering notes, CTA.
- **Film**: 60–90 s widescreen tour (captions only) embedded on the page, a 20–35 s portrait social cut, poster and OG image, all recorded from the vignettes.

## Site layout

```
site/codech-ai-landing/
  index.html                     landing page (shared with other sessions; touch only via upsert_story.py)
  work/_shared/                  ov.js ov.css case.css case.js chrome.js (from this skill) + chrome.css (generated)
                                 Header/footer are the LANDING page's, copied in by build_case.py from its
                                 <!-- @chrome:header/footer --> + /* @chrome:css */ markers: edit them on the landing page, rebuild cases.
  work/<slug>/case.json          source of truth (not deployed)
  work/<slug>/index.html         built page (don't hand-edit)
  work/<slug>/assets/            logo, scenes.js, scenes.css, film.mp4, film-poster.jpg, og-cover.jpg
  work/<slug>/proposal/ prototype/   hosted, sanitised copies (host_embed.py)
  work/<slug>/_film/ _qa/        film stage, social cut, QA shots (underscore = never deployed)
  _deploy/                       what goes to Cloudflare Pages (stage_deploy.py manages work/)
```

Scripts live in this skill's `scripts/` folder; run them with the site root as the first argument, e.g. `python <skill>/scripts/build_case.py site/codech-ai-landing acme-portal`. They need Python 3 with `playwright`, `pillow`, `imageio-ffmpeg` (film/QA only) and `npx wrangler` (deploy only).

## Workflow

Work through these in order. Save a short plan to `docs/superpowers/specs/<date>-<slug>-case-study.md` first; the user likes plans written down before building.

### 1. Intake (read `references/intake-and-accuracy.md`)
Read the pack's brief/README first, then look at the key screenshots and the prototype. Establish, and confirm with the user where the brief is unclear:
- the product areas to feature (the user may narrow or reframe them; OTSO went from "document hub" to "workspace = document inventory + team chat"),
- **status per area**: live, or designed / in build. Anything not live gets an "In build" label everywhere; never present it as shipped,
- **client consent** to be named, and whether numbers, incidents and URLs may be public (`client.consent_confirmed`),
- claims that sound right but aren't (e.g. "self-hosted AI" when the model is an external API),
- sensitive content in anything you will publish (confidential banners, prices, real hostnames, emails).

### 2. Write case.json (read `references/case-json.md`)
Copy `examples/otso-ai-hub/case.json` into `work/<slug>/case.json` and rewrite every field. Use numbers from the brief only, stated precisely ("37 days", not "under 5 weeks"); no invented quotes or metrics. Copy is authored HTML (inline `<b>` is fine).

### 3. Build the vignettes (read `references/vignettes.md`)
Write `work/<slug>/assets/scenes.js` + `scenes.css`: typically 2–4 scenes per product area, each showing one feature doing its job with a cursor and a callout note. Scenes register with `OV.define('<slug>', '<scene>', {...})` and all CSS is scoped to `.ovp-<slug>`. Run `build_case.py` once (it syncs the shared engine), then `python scripts/preview_scenes.py <site> <slug>` and look at the timed screenshots before moving on; broken timing, clipped panels and a cursor clicking empty space only show up visually.

### 4. Embeds (read `references/embeds.md`)
Host sanitised copies of the proposal and prototype with `scripts/host_embed.py` (keeps the client-facing proposal URL out of our page, adds noindex, reports sensitive strings). Give the prototype a phone layout if it lacks one. Point `delivery.tabs[].src` at `proposal/` and `prototype/`. If the user wants to keep embedding the live proposal URL for now, that's their call; record it.

### 5. Build the page and landing card
```
python scripts/build_case.py   <site> <slug>     # page + film stage; syncs work/_shared
python scripts/upsert_story.py <site> <slug>     # landing card + engine/scene includes
```
Before `upsert_story.py`, message any other session working on the site (see deploy reference): it edits the shared `index.html`.

### 6. Film (read `references/film.md`)
`python scripts/record_film.py <site> <slug>` records the widescreen film (→ `assets/film.mp4`, poster, OG cover) and the social cut (→ `_film/social.mp4`). Pull stills from the MP4 and check them: the poster must not be caught mid-fade. Re-run `build_case.py` afterwards so the page picks up the "Watch the film" button.

### 7. QA
`python scripts/qa_shots.py <site> <slug>` then actually look at the PNGs: desktop and phone case page, landing card. Check `references/lessons.md` for the failure modes we've already hit (blank hero, no gutters on mobile, frames that won't scroll, class clashes, cached old deploys).

### 8. Deploy (read `references/deploy.md`)
Tell other sessions, then `python scripts/stage_deploy.py <site> [--with-index]` (`--with-index` only when `upsert_story.py` changed the landing page). It refuses to overwrite a live site someone else changed, deploys, and checks every file's content type on the new deployment.

### 9. Report
Tell the user what's live (links), what you checked, and every open decision: client consent, confidential material, In-build labels to flip later. Remind them phones may show a cached older version until refreshed.

## Updating an existing case study
Edit `work/<slug>/case.json` (e.g. flip a group's `"status"` to `"live"`, change stats), then `build_case.py` → `upsert_story.py` (if the card changed) → `record_film.py` (if scenes or captions changed) → QA → deploy. Edit scenes in `assets/scenes.js`; never hand-edit the built `index.html`.

## Reference files
- `references/gather.md`: Mode A, building the portfolio asset pack from a finished project
- `references/intake-and-accuracy.md`: reading the pack; status, consent and sensitive-content rules
- `references/case-json.md`: every field of case.json
- `references/vignettes.md`: engine API, scene recipe, design and CSS-scoping rules, preview/testing
- `references/embeds.md`: proposal/prototype hosting, sanitising, phone layout shell
- `references/film.md`: film structure, recording, posters, social cut
- `references/deploy.md`: staging, multi-session protocol, verification, caching
- `references/lessons.md`: bugs already hit and their fixes; read before QA
- `examples/otso-ai-hub/`: complete worked example (case.json, scenes.js, scenes.css); its source pack is `AI Portfolio Assets/OTSO AI Portal- portfolio-assets/` in the marketing project
- `assets/pack-template/`: PROJECT_BRIEF.md and README.md templates for Mode A
