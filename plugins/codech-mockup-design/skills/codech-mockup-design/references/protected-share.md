# Protected client share: expiry, visit tracking, copy protection

Use this to send a client a link to the design direction, prototype or proposal, typically a `*.pages.dev` URL on Cloudflare Pages. It adds:

| Layer | What the client experiences | What it protects |
|---|---|---|
| **Expiry** | After the date, every page returns **410** with a bilingual 「此預覽連結已過期」 page and a **WhatsApp "申請延期 · Request extension"** button | Stops old links circulating. Extension requests become sales conversations. |
| **Visit tracking** | Nothing visible | You see who opened which link, how long they read, how far they scrolled, which sections they saw, devices and cities |
| **Copy protection** | Nothing visible, except a small "Prototype © Codech Solutions · Confidential" pill on prototype pages | Compiled and minified CSS/HTML, obfuscated JS, a per-build fingerprint `ref`, copyright meta. Prototype pages refuse to open in their own tab (302 to `/`), so they only render inside the showcase frames. |
| **noindex** | — | `_headers` sends `X-Robots-Tag: noindex, nofollow`, plus `robots.txt` disallow |

There is no password gate by default; the link itself is the access. If the user asks for one, add Basic Auth in the middleware.

Toolkit: `scripts/protected-share/` contains `protect-build.mjs`, `middleware.template.js`, `tracking-schema.sql`, `package.json`, `build.example.ps1` and `sites.example.json`.

## Project layout

```
<project>/
├── docs/design/design-direction-client.html   # client-facing page (references ../../prototype-app/)
├── docs/design/design-showcase.html           # internal showcase
├── prototype-app/                             # prototype pages + assets/tw.js + assets/site.css + images/
├── proposal/                                  # proposal index.html, og-image.jpg, favicon.png
├── tools/                                     # ← copy scripts/protected-share/* here
│   ├── build.ps1  (from build.example.ps1)
│   ├── sites.json (from sites.example.json)
│   └── stats-key.txt                          # dashboard key — gitignore it
├── deploy/<project>/   # READABLE assembled site (input to protect-build; NEVER deploy this)
└── dist/<project>/     # protected output: public/ + functions/_middleware.js + wrangler.toml (deploy THIS)
```

**Why prototype pages use `assets/tw.js` + `assets/site.css`:** `protect-build.mjs` finds every page that loads `tw.js`, compiles that Tailwind config into one `app.css`, and deletes the runtime. Pages with an inline `tailwind.config` (the proposal) get their own `<page>.styles.css`. The build fails loudly if a Tailwind CDN reference survives.

## One-time setup (per Codech Cloudflare account)

Run `wrangler whoami` to confirm you're logged in to the Codech account. If not, run `wrangler login`.

All proposals share one D1 database, separated by the `site` column. Check it exists before creating it:

```bash
wrangler d1 list                                            # look for cdx-proposal-tracking
wrangler d1 create cdx-proposal-tracking                    # only if missing; note the database_id
wrangler d1 execute cdx-proposal-tracking --remote --file tools/tracking-schema.sql
```

## Per-project setup

1. `cd tools && npm install` (installs the dependencies from `package.json`).
2. Copy `build.example.ps1` to `tools/build.ps1` and fill in the CONFIG block:
   - client code
   - timezone
   - `about` text for the extension message
   - D1 `database_id`
   - Pages project names
3. Write `tools/sites.json`, mapping each Pages project to `{url, name}`. This drives the dashboard's site picker and the tracked-link URLs.
4. Create the Pages projects: `wrangler pages project create <name> --production-branch main`.
5. Generate the dashboard key and set it as a Pages secret on **every** project. Use a JSON file: piping from PowerShell appends a CR, which caused the key mismatch and a 404.
   ```powershell
   $k = -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 24 | % {[char]$_}); Set-Content tools/stats-key.txt $k -NoNewline
   '{"STATS_KEY":"' + $k + '"}' | Set-Content "$env:TEMP\s.json" -Encoding ascii
   wrangler pages secret bulk "$env:TEMP\s.json" --project-name <name>; Remove-Item "$env:TEMP\s.json"
   ```
6. Build and deploy **from the project root**: `powershell -ExecutionPolicy Bypass -File .\tools\build.ps1 -Deploy`.

**Expiry date.** The default is **1 week** from the day you send the link; the user chose 1 week over 30 days. For any other length, the user's number of days wins. Compute `-Expires` as send date + N days at 23:59:59 in the client's timezone, with its UTC offset (for example `2026-12-01T23:59:59+08:00`). Edit the `-Expires` default in `build.ps1` too, so a plain rebuild doesn't revert the date. State the date in the page footer and the proposal hero ("This link is valid until …").

**Pages to include.** The design-direction site serves `docs/design/design-direction-client.html`. This is a client-friendly cut of the showcase with:
- direction, colours by plain names (no hex), type, look and feel, desktop and mobile prototype frames;
- a feedback CTA and the Codech contact footer;
- no scope, pricing or internal notes.

Build it from the approved showcase before Phase 8. Tracked links can only be created after the first deploy, because they live in the dashboard.

## Daily use

| Task | How |
|---|---|
| Open the dashboard | `https://<project>.pages.dev/_stats?key=<stats-key.txt>`. The key is stored as a cookie, and **this browser is excluded from tracking** (`cdx_me`). Open it once on every device you check the links from: phone, office PC. |
| Make a per-person link | Dashboard → "Create a tracked link" → label ("Mr Chan (owner)") + site → copy `…pages.dev/?r=<token>`. Send each person their own link. |
| Extend a link | Rebuild with a new `-Expires` and redeploy. Tracked links keep working. |
| Change content | Edit the source, then rebuild and deploy. Never edit `dist/` or `deploy/`. |
| Check live without logging a visit | `curl.exe -s -b "cdx_me=1" https://<project>.pages.dev/`. For prototype pages add `-H "Sec-Fetch-Dest: iframe"` and use the clean URL `/prototype/` (`/prototype/index.html` 308-redirects). |
| Test the expiry page | Build with a past `-Expires`, deploy with `--branch=expiry-test`, check the preview URL returns 410, then delete that deployment. |
| Query raw visits | `wrangler d1 execute cdx-proposal-tracking --remote --json --command "SELECT … FROM visits WHERE site='<project>' ORDER BY ts DESC"` |

## Reading the dashboard

- **"No tracking link" rows within hours of first deploy are scanners, not leaks.** Every new `*.pages.dev` certificate is published in public Certificate Transparency logs. Security and threat-intel crawlers (Palo Alto, Recorded Future, urlscan and others) then fetch the site from server hosts: Contabo, Hetzner, OVH, M247, Leaseweb, EGIHosting, AWS, GCP. Signs:
  - 0 s reading time and 0% scroll;
  - fake or ancient user agents (iPod on iOS 3);
  - referers pointing at `/prototype/index.html`.
  
  The site you haven't sent yet collects these too.
- **Self-named bots** (WhatsApp/Telegram link previews, empty user agent, Cloudflare/AWS/Google networks) are stored as `bot` and greyed out. A **WhatsApp preview on a tracked link** means it was pasted into a chat.
- **"forwarded?"** means more than one device opened the same token. On an untokened row it is usually scanners.
- **Your own office** shows up unless every office device has opened `/_stats?key=…` once. Compare IP and city with the client's market: a HK client shows a Hong Kong city and an HK ISP (HKBN, PCCW-HKT, China Mobile HK, SmarTone).
- **Is it a real person or a scanner?** People run JavaScript, so they produce reading time and scroll. This query lists untracked visits that show engagement, which are the only untracked rows worth a second look:
  ```bash
  wrangler d1 execute cdx-proposal-tracking --remote --json --command "SELECT datetime(ts/1000,'unixepoch','+8 hours') AS t, path, ip, city, org, device, seconds, scroll FROM visits WHERE site='<project>' AND token='' AND vid!='bot' AND (seconds>0 OR scroll>0) ORDER BY ts DESC"
  ```
  Rows from your own office IP are you. Rows with a few seconds from Palo Alto or EGIHosting are sandbox renders. A residential ISP in the client's city with minutes of reading is a real person who got the bare link.
- Reading time comes from a `sendBeacon` every 15 s and on tab-hide, counting only while the tab is visible. Scroll % and sections seen (`section[id]` at 30% visibility) are max values.

## Common mistakes

| Mistake | Result | Fix |
|---|---|---|
| Deploying `deploy/<project>` instead of `dist/<project>` | Readable source goes public, with no expiry or tracking | Always deploy from `dist/`, which is where `wrangler.toml` lives |
| Running the build with the shell's cwd inside `dist/` | `EPERM` when the folder is deleted and rebuilt | `cd` to the project root first |
| Custom CSS after `@tailwind utilities` | `.font-display` etc. override utility classes (letter-spacing broke) | `protect-build` puts site.css **before** utilities. Keep that order. |
| Reveal-on-scroll prototype inside iframes | Blank frames in the showcase | Prototype JS reveals everything when `window.self !== window.top` |
| Secret set via a PowerShell pipe | Dashboard 404s with the correct key | `wrangler pages secret bulk <json>`. The template also `.trim()`s the key. |
| Expiry date only in the middleware | Client is surprised when the link dies | State the date on the page footer and in the proposal hero |
