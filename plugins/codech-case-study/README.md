# codech-case-study

Turn finished Codech client work into portfolio case studies and marketing films, in three modes:

| Mode | Run it in | Produces |
|---|---|---|
| **A · Gather** | the finished client project (repo, specs, prototype, running app) | a portfolio asset pack: `PROJECT_BRIEF.md`, `README.md`, `stats.json`, `brand/`, `screenshots/` (2x desktop, mobile, UI crops), `prototype/`, `proposal/`, redacted `docs/` |
| **B · Build** | the Codech Marketing project (`site/codech-ai-landing`) | a live case study: animated product demos, Results-carousel card, `work/<slug>/` page, embedded proposal + prototype, product film, deploy |
| **C · Marketing film** | the Codech Marketing project (`video/<slug>-marketing/`) | a ClickUp-style motion-graphic product showcase: storyboard artifact, Remotion film, fitted royalty-free soundtrack + synced SFX, MP4 master + preview |

The typical flow: **ship a project → Gather → Build → keep the case study updated** (edit `case.json`, rebuild).

## Triggers

- _"The project is done, gather the portfolio assets / screenshots / prototype and save them"_
- _"Add <client> to our Results" / "make a case study for <project>" / "showcase this project"_
- _"Team Chat is live now, update the OTSO case study"_ / _"re-film the demo video"_
- _"Make a marketing / product showcase / motion graphic video for <client>"_ / _"change the soundtrack"_ / _"add sound effects"_
- Uploading an `AI Portfolio Assets/...` pack folder

## What's inside

```
skills/codech-case-study/
├── SKILL.md                      two-mode workflow
├── references/
│   ├── gather.md                 Mode A: building the asset pack
│   ├── intake-and-accuracy.md    live vs in-build, consent, claims, sensitive content
│   ├── case-json.md              schema for work/<slug>/case.json
│   ├── vignettes.md              product-demo engine, scene recipe, CSS scoping
│   ├── embeds.md                 hosting proposal/prototype, phone-layout shell
│   ├── film.md                   captioned film + social cut, posters, OG image
│   ├── deploy.md                 staging, multi-session protocol, verification
│   ├── lessons.md                every bug hit so far, with fixes
│   └── marketing-film.md         Mode C: rules, motion language, workflow, gotchas
├── scripts/
│   ├── gather_stats.py           measured "By the numbers" from git + code
│   ├── capture_screens.py        plan-driven Playwright screenshots (2x, mobile, crops)
│   ├── scan_pack.py              secrets / IPs / hostnames / confidential-label scan
│   ├── build_case.py             case.json → case-study page + film stage
│   ├── upsert_story.py           case.json → landing Results card (marked blocks only)
│   ├── host_embed.py             sanitised hosted copies of proposal/prototype
│   ├── preview_scenes.py         timed screenshots of each product demo
│   ├── record_film.py            CDP screencast → H.264 MP4, poster, OG cover
│   ├── qa_shots.py               desktop + phone QA screenshots, overflow/errors
│   ├── stage_deploy.py           guarded Cloudflare Pages deploy + content-type check
│   ├── mf_music.py               Mode C: find/rank Mixkit tracks, analyse tempo + drop, bar-exact fit
│   ├── mf_sfx.py                 Mode C: fetch the SFX palette as trimmed .npy
│   ├── mf_mix.py                 Mode C: cue sheet + music → final mix
│   └── mf_encode.py              Mode C: JPEG sequence + mix → MP4, previews, contact sheets
├── assets/
│   ├── shared/                   vignette engine (ov.js/css), page styles/script, film template
│   ├── pack-template/            PROJECT_BRIEF.md and README.md templates
│   └── marketing-film/           Remotion starter, storyboard generator, music shortlist page, cue template
└── examples/
    ├── otso-ai-hub/              worked example: case.json, scenes.js, scenes.css
    └── shingtik-marketing-film/  worked Mode C example: Remotion scenes, 231-cue sheet, storyboard data
```

## Requirements

- Python 3.10+ with `playwright` (+ `python -m playwright install chromium`), `pillow`, `imageio-ffmpeg`
- `git` (Gather stats), `npx wrangler` authenticated to the Codech Cloudflare account (deploy)
- Mode C: Node 18+ (`npm i` in the copied Remotion starter), `numpy`, optional `segno` (WhatsApp QR)

## Principles baked in

- Product visuals are **code-built demos of the real screens**, not AI-generated images (image models garble UI text and invent screens).
- Anything not shipped is labelled **In build** everywhere; numbers are measured and dated; no invented quotes or metrics.
- Client naming needs confirmed consent; confidential material is flagged for a human decision, never silently published.
- The landing page is shared: message other sessions before editing `index.html` or deploying; the deploy script refuses to overwrite a live site someone else changed.

## Composes with

`codech-project-superpower` (specs + prototype) → `codech-client-proposal` (proposal site) → *project delivered* → **`codech-case-study`** (portfolio).
