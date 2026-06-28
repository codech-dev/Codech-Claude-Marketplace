# Cloudflare Pages Deploy

How to deploy a proposal to a `*.pages.dev` URL using `wrangler`. Codech's default delivery channel.

---

## §prereqs Prerequisites

- `wrangler` installed (`npm install -g wrangler` or it's already in your shell)
- Cloudflare account authenticated (`wrangler whoami` should show your account)
- Codech default account: `dev.codech@gmail.com` (account ID `d5b9da34996d1a8ebaf34c1dd490b5c5`)

Check auth:
```bash
wrangler whoami
```

If not authenticated:
```bash
wrangler login
# Opens browser for OAuth flow
```

---

## §folder Deploy folder structure

Prepare a `_deploy/` folder containing exactly what should be served:

```
_deploy/
  index.html              ← the proposal (renamed from "Client Name Proposal.html")
  codech-logo.png         ← Codech identity, referenced by closing section
  screenshots/            ← prototype mockup PNGs (if captured)
    module-01-*.png
    module-02-*.png
    ...
  (optional)
  functions/
    _middleware.js        ← only if Basic Auth password protection is enabled
```

**Key points:**
- The entry point MUST be `index.html` (Cloudflare Pages serves this at the project root)
- Asset paths in the HTML must be relative (`screenshots/module-01.png`, `codech-logo.png`) so they resolve correctly
- Don't include the prototype-app/ source files unless they're needed

Quick way to populate it:
```bash
mkdir -p _deploy/screenshots
cp "Client Name Proposal.html" _deploy/index.html
cp codech-logo.png _deploy/
cp screenshots/*.png _deploy/screenshots/
```

---

## §project-name Project naming

Convention: `{client-slug}-proposal` or `{client-slug}-{deliverable-slug}`. Examples:
- `jy-global-proposal-ai-portal`
- `acme-rebrand-proposal`
- `globex-saas-launch-proposal`

Rules:
- Lowercase, hyphens only, no spaces or special chars
- Max 58 chars (Cloudflare limit)
- Resolves to `https://{project-name}.pages.dev`

---

## §first-deploy First-time deploy

```bash
# 1. Create the project (one-time)
wrangler pages project create CLIENT-PROPOSAL --production-branch=main

# 2. Deploy the folder
wrangler pages deploy _deploy \
  --project-name=CLIENT-PROPOSAL \
  --branch=main \
  --commit-dirty=true
```

Output ends with:
```
✨ Deployment complete! Take a peek over at https://abc12345.CLIENT-PROPOSAL.pages.dev
```

Both URLs work:
- `https://CLIENT-PROPOSAL.pages.dev` — production URL (always points at latest main deploy)
- `https://abc12345.CLIENT-PROPOSAL.pages.dev` — specific deploy URL (frozen at this deployment)

Send the client the production URL.

---

## §redeploy Redeploy after edits

```bash
cp "Client Name Proposal.html" _deploy/index.html

wrangler pages deploy _deploy \
  --project-name=CLIENT-PROPOSAL \
  --branch=main \
  --commit-dirty=true
```

Wrangler caches asset hashes; if only the HTML changed, the screenshots and logo skip upload. Typical redeploy is ~2 seconds.

The convenience wrapper at `scripts/deploy.sh` bundles these two commands.

---

## §rename Renaming the URL

Cloudflare Pages **does not support renaming** projects. To change the URL:

1. Create a new project with the new name: `wrangler pages project create new-name`
2. Deploy to it: `wrangler pages deploy _deploy --project-name=new-name --branch=main --commit-dirty=true`
3. Verify the new URL works
4. Delete the old project: `wrangler pages project delete old-name --yes`

The old `*.pages.dev` URL stops working immediately after deletion (HTTP 530).

---

## §password Optional password protection

Cloudflare Pages Functions can gate the site behind HTTP Basic Auth.

**Setup** — drop a `_middleware.js` into `_deploy/functions/`:

```javascript
// _deploy/functions/_middleware.js
export async function onRequest(context) {
  const { request, env, next } = context;
  const realm = 'Client Proposal';

  const username = env.PROPOSAL_USERNAME || 'client';
  const password = env.PROPOSAL_PASSWORD;

  // If no password is set, skip auth (graceful fallback)
  if (!password) return next();

  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      const providedUser = decoded.slice(0, sep);
      const providedPass = decoded.slice(sep + 1);
      if (providedUser === username && providedPass === password) return next();
    } catch (_) {}
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
```

**Set the password** (must be done by the user, not the agent — agents must not invent credentials):

```bash
# Username (optional, defaults to "client"):
echo "jyglobal" | wrangler pages secret put PROPOSAL_USERNAME --project-name=CLIENT-PROPOSAL

# Password (required):
echo "ChosenPasswordValue" | wrangler pages secret put PROPOSAL_PASSWORD --project-name=CLIENT-PROPOSAL
```

**Redeploy** to activate the middleware. The first request now prompts for username + password.

To remove protection later: delete `_deploy/functions/` folder and redeploy. The site goes back to public.

The convenience wrapper at `scripts/add-password.sh` walks through this setup.

---

## §custom-domain Custom domain (optional)

To map a custom domain like `proposal.codech.co`:

```bash
wrangler pages project domain add proposal.codech.co --project-name=CLIENT-PROPOSAL
# Then add the DNS CNAME in Cloudflare DNS pointing to CLIENT-PROPOSAL.pages.dev
```

Useful for keeping a stable URL across multiple client engagements (e.g., `proposal-2026-q3.codech.co` for the current quarter's pitch).

---

## §troubleshooting Troubleshooting

| Symptom | Fix |
|---|---|
| `Project not found` on first deploy | Run `wrangler pages project create` first |
| `Unauthorized` from wrangler | Run `wrangler login` |
| Screenshots 404 on the deployed page | Check relative paths in HTML — must be `screenshots/...` not `/screenshots/...` |
| Logo not loading | Confirm `codech-logo.png` is at `_deploy/` root, referenced as `codech-logo.png` (no leading slash) |
| Password prompt won't accept correct password | The secret was set on the wrong project name — verify with `wrangler pages secret list --project-name=...` |
| Old project still appears in dashboard after delete | Cache; refresh after 30s |

---

## §checklist Deploy checklist

- [ ] `wrangler whoami` returns Codech account
- [ ] `_deploy/index.html` is the proposal (not a placeholder)
- [ ] `_deploy/codech-logo.png` exists
- [ ] `_deploy/screenshots/` exists (if proposal uses mockups)
- [ ] Project name follows convention
- [ ] First deploy returns 200 from the production URL
- [ ] (If password) Secret set and tested with a wrong-password attempt
- [ ] Production URL handed to user (not the deploy-specific URL)
