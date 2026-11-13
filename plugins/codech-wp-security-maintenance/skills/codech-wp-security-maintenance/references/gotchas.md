# Gotchas — incidents we caused or hit

Format: symptom → cause → fix. Add new ones at the top of their section (CONTRIBUTING.md).

## Updates and rollbacks

### Client gets WordPress "Technical issue" / recovery-mode e-mail hours after updates; front end fine
**Cause:** Code Snippets 3.10.x adds an Elementor editor control using `Controls_Manager::NOTICE`,
which doesn't exist in Elementor 3.16 → fatal only when someone opens the Elementor editor. Page
checks were front-end only.
**Fix:** roll back to 3.9.3 (snippets in the DB are unaffected). Pin Code Snippets ≤ 3.9.x while
Elementor < 3.2x. Always open the editor after updating anything that hooks into the builder.

### Homepage 500 right after a "free" add-on update
**Cause:** Essential Addons 6.x is incompatible with Elementor 3.16 / Pro 3.14 (old builder pinned by
an expired Pro licence). Also seen: OoohBoi Steroids > 2.1.6 needs Elementor ≥ 3.20.
**Fix:** roll back immediately; pin builder add-ons to versions that support the pinned builder.

### After rolling back the add-on, homepage tabs/widgets empty, mostly on mobile, no tab selected
**Cause:** in its minute live, the newer Essential Addons regenerated per-page assets
(`uploads/essential-addons-elementor/eael-<page-id>.js|css`). The old plugin then loaded new-version JS
→ `eael is not defined`. Desktop sometimes worked by timing luck.
**Fix:** delete those generated files (keep copies), load the pages uncached to regenerate, purge the
page cache, test mobile + desktop in every language.

### …still broken for the boss/client after that fix, but fine for you
**Cause:** their **browser** cached the bad file under the same URL. EA's `?ver=` is the page's
`post_modified`, unchanged by the rollback; the server sent no Cache-Control so browsers cache heuristically.
**Fix:** bump the page's `post_modified` (direct `$wpdb` update; save the old value) → new `?ver`, purge.
Lesson: when you replace a generated asset, change its URL too.

### Sitemaps 404 after a plugin update or activation
**Cause:** the update/activation rebuilt rewrite rules without the SEO plugin's (Rank Math) rules.
**Fix:** `flush_rewrite_rules( false )` from a normal request, or Settings → Permalinks → Save.
Check `/sitemap_index.xml` after every update and every security-plugin activation.

### `Plugin_Upgrader::upgrade()` returns false, no error, nothing happens
**Cause:** the `update_plugins` site transient is empty/stale.
**Fix:** `delete_site_transient('update_plugins'); wp_update_plugins();` then upgrade.

### Font Awesome plugin update adds a mixed-content stylesheet
**Cause:** `siteurl`/`home` stored as `http://` on an https site; newer plugin builds URLs from them.
Harmless (browser blocks it) but it's a sign to schedule the http→https option change (tested separately).

## Access and security plugins

### Turning on IP blocking takes the whole site down for everyone
**Cause:** the site is behind Cloudflare/CloudFront and the security plugin (or custom code) reads
`REMOTE_ADDR` = the CDN edge. Seen on a live site: every "failed login" was attributed to CloudFront
edge IPs; blocking on that would have cut off all visitors behind those edges.
**Fix:** set the real-IP source first (login-and-email.md "Behind a CDN"), verify it reports your own
IP, and make custom blocks fail open when no real IP is known.

### Database at 100 %, WordPress down, other apps on the same stack fine
**Cause:** an unthrottled brute-force attack — every attempt boots WordPress, checks a password and
writes a log row. The installed "security" monitor only logged and never blocked.
**Fix:** real lockouts (after the IP fix), XML-RPC off (multicall bypasses login guards).

### PHP file edited through the MCP, but the site still runs the old code
**Cause:** OPcache. **Fix:** `opcache_invalidate( $file, true );` after writing the file, then re-test.

### Code Snippets / WPCode change made in the database doesn't take effect
**Cause:** WPCode caches snippets. **Fix:** after `wp_update_post()` on a WPCode snippet call its
cache rebuild (or save it once in wp-admin). Code Snippets: edit through its API/UI, not raw SQL.

### Hosting panel "fixed" the site by turning plugins off / updating them
**Cause:** Hostinger's AI troubleshooter clears fatals by deactivating plugins; Hostinger "Smart
auto-updates" bumps free plugins past their paid add-ons. Both look like "up but broken".
**Fix:** compare active plugins with the backup's `state.json`; read the real PHP fatal; switch those
host features off for pinned plugins.

### MCP suddenly returns 401 right after installing Wordfence
**Cause:** Wordfence → All Options → "Disable WordPress application passwords" is ON by default.
**Fix:** untick it in wp-admin. Keep a wp-admin session open when activating security plugins.

### MCP says "Session not found" after updating Novamira
**Cause:** the local MCP proxy holds the old session. **Fix:** reload the editor / reconnect.
Update the access tool last, with wp-admin open as a fallback.

### 2FA: "code does not match"
**Cause:** Wordfence's 2FA setup page creates a new secret on every reload.
**Fix:** delete the authenticator entry, rescan once, don't refresh.

### Admins get no grace period / risk instant lockout
**Cause:** Wordfence gives administrators 0 grace unless set per user; enforcement starts once one admin has 2FA.
**Fix:** grant each admin grace first, then require the role.

## E-mail

### Site e-mail "broken for months", nobody noticed; SMTP log all `failed`
**Cause:** Microsoft 365 OAuth connection — the Azure app client secret expired/was deleted
(`AADSTS7000215`). **Fix:** login-and-email.md §1. Record the new secret's expiry date.

### Client suddenly flooded with password-reset e-mails after you fixed e-mail
**Cause:** bots had been requesting resets for `admin` all along; now they're delivered.
**Fix:** rename the `admin` login; turn off the security plugin's "password recovery attempted" alerts.

### Client gets "Password changed" notice about an account they don't know
**Cause:** your 2FA test user. **Fix:** warn first / delete the test user right after testing.

## Inherited sites

### Data sync from the office system stopped months ago; cron line looks fine
**Cause:** cron moved to the web user, but `logrotate` recreates `/var/log/sync.log` as root → the
`>>` redirect fails and the shell never runs the command. No error anywhere.
**Fix (no root):** redirect to a web-user-writable, web-blocked folder with `>`; run once by hand;
confirm the newest data timestamp moves. Add the freshness check to the monitor.

### Drafts no longer auto-publish after hardening
**Cause:** you disabled an `admin_init` hook that republished all posts on every admin page load.
**Fix:** expected side effect — tell the client; publish manually or schedule a proper job.

### File you edited is "different" next time / your change vanished
**Cause:** the team or client edits live theme files directly (look for many `.bak-*` copies).
**Fix:** always re-read the live file right before editing; never upload a local copy over it.

### Public backups / archives you didn't know about
**Cause:** All-in-One WP Migration backups (`ai1wm-backups/*.wpress`), `Archive.tar` copies of
themes/plugins, WP All Export `exports/*.zip` — all downloadable by URL.
**Fix:** audit lists them with their HTTP status; move them out; re-test.

## Tooling

### Page checks say OK but the site is broken
**Cause:** page cache (WP Rocket) serves the old good HTML. **Fix:** cache-busting query on every check (`check_pages.sh` does it).

### Redirect test fails although the rule exists
**Cause:** Redirection plugin rules are exact-match; your test URL had a query string. **Fix:** test without the query.

### MCP calls time out during traffic spikes
Retry later; keep each execute-php call short; run long jobs (backups) in the background with nohup.

### CLI PHP prints "Unable to load dynamic library pdo_<driver>" warnings
Harmless duplicate-extension warning when the driver is already loaded; don't "fix" php.ini without root.
