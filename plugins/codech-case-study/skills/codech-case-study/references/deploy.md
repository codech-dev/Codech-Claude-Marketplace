# Publish (staging first, codech.co only on the owner's word)

Since 2026-10-21 the website is **codech.co**: an Astro build of the `codech-site` repo (github devcodech/codech-site), with content in Directus (https://admin.codech.co), built on the VPS by site-builder.
- Branch `staging` builds **https://staging.codech.co** (public, never indexed; shows draft content and every case).
- Branch `main` builds **https://codech.co** (published content only; owner-only "live hides" apply). Directus "Publish site" rebuilds it too.
- `site/codech-ai-landing` (the old landing site) is **frozen**: it is only the build workspace for `work/<slug>/`. Never edit its index.html and never deploy it. Cloudflare Pages (`codech-ai-landing.pages.dev`) is not the website any more; `stage_deploy.py` and `upsert_story.py` are retired (they refuse to run).

How a case reaches the site:
- **Case page** `/work/<slug>/`: the built folder, copied into codech-site `public/work/<slug>/`. The build injects the site's header, footer and favicons, so the folder's own header/footer don't matter.
- **Card** (case-study list, home page results, footer link, AI audit showcase, sitemap): the Directus `case_studies` item.
- **Videos**: not in git or the build. They live in `/srv/site/media` on the VPS and nginx serves `/work/**.mp4|webm` from there.
- **Shared files** `public/work/_shared/` (ov, case, chrome, chrome-chat, vendor) belong to **codech-site**; the copy step never touches them. If this skill improves `assets/shared/*`, port the change to codech-site in its own commit on `staging`.

## The approval rule (owner, standing)
Nothing goes to codech.co without the owner's explicit go for that publish ("publish"). Preview on staging, show the links, then stop and ask. Merging or pushing to codech-site `main`, pressing "Publish site", `--approve` and changing `hide_cases` all count as publishing.

## Steps
```
python scripts/publish_case.py <site> <slug> --codech-site <codech-site clone> [--dry-run] [--push]
       [--solutions agents,docs,automation,insights] [--video assets/marketing-film-v1.mp4 --video-title "..."]
```
The codech-site clone today is `.worktrees/website-foundation/site/codech-site` in the Codech Marketing project (branch `staging`). Run `--dry-run` first and read it.
1. **Guard**: codech-site must be on `staging` with nothing uncommitted in `public/work/<slug>/`. If codech-site has commits to that folder after its last bundle sync, the script stops and lists them. Footer/header edits and the known fixes (step 3) are safe to overwrite (`--overwrite`); any other fix must be redone in the case first, or it is lost.
2. **Copy** with codech-site's `npm run sync -- --bundle <slug>` (no videos, no `_film/`, `_qa/`).
3. **codech-site fixes** on the copy:
   - prototype import maps point at `/work/_shared/vendor/*.js` instead of esm.sh;
   - `codech-ai-landing.pages.dev` becomes `codech.co`;
   - `codech.co@gmail.com` becomes `contact@codech.co`.
   An esm.sh package without a vendored copy stops the run: add it to codech-site `tools/vendor/build-vendor.mjs` first.
4. **Videos** go to `/srv/site/media/work/<slug>/` (`--no-media` to skip).
5. **Directus card**: built from case.json, using the same mapping as codech-site's migration (a dry run against JY Global matched its live card field for field).
   - A **new** card is created as a draft, and the slug is added to `site_settings.hide_cases`, so codech.co leaves the case out entirely until approval. Without that, its page would be reachable by URL after any unrelated publish.
   - An **existing** card is never overwritten silently: the script lists the fields that differ from case.json, and `--update-card` writes them. Status, sort and nav_label stay the editors'.
   - The card's video is `--video` (the Mode C marketing film, e.g. `assets/marketing-film-v1.mp4`) or else `assets/film.mp4`.
   - Solution tags (`--solutions` or case.json `"solutions"`) drive the /case-studies/ filter.
6. **Push** `staging` (`--push`, or run the printed git commands). The builder publishes staging.codech.co in about 3 minutes.

Then check https://staging.codech.co/work/<slug>/ and the card on https://staging.codech.co/case-studies/ (see QA in SKILL.md), show the owner, and wait.

## After the owner says "publish"
1. `publish_case.py <site> <slug> --codech-site <clone> --approve`: the card becomes published and the slug leaves `hide_cases`.
2. Production build. Either fast-forward codech-site `main` to `staging`, or press **Publish site** in Directus (site_settings) if the code is already on main.
   **Before fast-forwarding, run `git log origin/main..origin/staging`**: every commit listed goes live. Another session's pending change needs its own approval; ask rather than ship it.
3. Verify on codech.co:
   - the case page;
   - the card on /case-studies/ and the home page;
   - the film plays and seeks (206);
   - header menus open (click Solutions, Our work and Resources);
   - no console errors.

## Updating a live case
Same steps. The card already exists, so nothing is hidden. Review the card diff and use `--update-card` only for fields that really changed. Publishing the update needs the owner's go like any publish.

## Multi-session etiquette
Other Claude sessions push to codech-site `staging` too. Before pushing, `ListAgents` and tell the active ones what you're adding. After a merge or push, diff what's live against what you expected. Never move `main` over someone else's unapproved commit.

## Caching
- Case pages link the shared files with `?v=<hash>` (the build adds it), so a deploy is picked up at once.
- Each film needs a **new filename per version** (`marketing-film-v2.mp4`), or phones keep playing the cached copy.
- Tell the owner that phones may show an older page until refreshed.
