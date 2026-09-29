# Deploy

The landing site is Cloudflare Pages project `codech-ai-landing` (https://codech-ai-landing.pages.dev), deployed with wrangler from `site/codech-ai-landing/_deploy/`. Other Claude sessions work on the same site (e.g. one added link-preview tags and `og-image.jpg`), so deploys need care.

## Multi-session protocol
Agreed with the other Codech session: **neither edits `site/codech-ai-landing/index.html` or deploys without messaging the other first.**
1. `ListAgents` to see who is working on this project.
2. `SendMessage` to them: what you'll change (work/ only, or also index.html), and when. First line = the summary.
3. Wait briefly for pending-edit news; don't deploy their half-finished changes.
4. After deploying, tell them the deployment id and what you verified.

## Staging and deploying
```
python scripts/stage_deploy.py <site> [--with-index] [--dry-run] [--force]
```
- Mirrors `work/` into `_deploy/work/`, skipping underscore folders except `_shared` (`_film`, `_qa`), `case.json`, `*-test.html`.
- Root files in `_deploy/` (other sessions' assets) are never touched; `--with-index` copies only `index.html` (needed after `upsert_story.py`).
- **Guard**: live `index.html` must equal `_deploy/index.html`. If not, someone deployed from elsewhere. Fetch live, merge their change into local `index.html`, copy it to `_deploy/`, then rerun. `--force` only when the user says to overwrite.
- Verifies every staged file's Content-Type on the new deployment URL. Pages returns the homepage with **200** for missing files, so a status check alone says nothing; a `.js` served as `text/html` means the file didn't ship.

## After deploying
- Production URLs can serve a stale edge copy for a minute; check with `?v=<n>` or the deployment URL.
- Tell the user phones may show a cached old version until refreshed (they sent a screenshot of an old deploy once).
- The site's own URL is still the Pages preview domain; when production moves to the real domain, update `site_url` in every case.json and rebuild (OG images use it).
