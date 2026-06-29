# Adapter: static site (Cloudflare Pages)

The simplest adapter and the universal fallback when no other adapter matches the
user's stack. Because the portable artifact already contains an HTML/CSS/JS
prototype, this adapter is almost a pass-through.

Consumes: `artifact/` (see 04-conversion-contract.md). Produces: a `dist/` site
root and deploys it to Cloudflare Pages.

## Convert

1. Create `dist/`.
2. Copy `artifact/prototype/` into `dist/` as-is. Preserve it byte-for-byte; this
   stack imposes no templating, so there is no divergence from the approved
   prototype.
3. Copy `artifact/assets/` into `dist/assets/` (keep the paths the prototype
   references; fix relative links only if the prototype expected a different
   root).
4. Ensure the brand token CSS is present: if `prototype/` links a tokens
   stylesheet, copy it; if tokens live in `brand-tokens.md` only, write them into
   `dist/assets/css/tokens.css` and link it from the pages' `<head>`.
5. Confirm `dist/index.html` opens standalone with all assets resolving.

## Deploy (GATE 2 first)

Do not run any deploy command until GATE 2 has passed (see 05-gates-and-qa.md):
confirm the project name and that the user wants to publish.

One-time, if the Pages project does not exist yet:

```
npx wrangler pages project create <slug> --production-branch main
```

Deploy:

```
npx wrangler pages deploy dist --project-name <slug>
```

Auth note: `wrangler` needs a Cloudflare login (`npx wrangler login`) or a
`CLOUDFLARE_API_TOKEN` env var with Pages write scope. If neither is present,
stop at the built `dist/` and give the user the two commands above to run
themselves.

Pages scope gotcha: a default `wrangler login` token may carry only
`workers (write)` and NOT Cloudflare Pages edit. With a workers-only token,
`pages project create` fails with a generic API error (code 8000000) and the
deploy then reports "Project not found" (code 8000007). Check scopes with
`npx wrangler whoami`; if `pages` is absent, the user must re-auth with Pages
edit permission (`wrangler login` and grant Pages, or use a
`CLOUDFLARE_API_TOKEN` with the "Cloudflare Pages: Edit" template). Do not treat
this as a build failure - the `dist/` is valid; only the publish step is blocked.

## Post-deploy

Emit the `https://<slug>.pages.dev` URL and run the post-deploy QA screenshot
comparison from 05-gates-and-qa.md.
