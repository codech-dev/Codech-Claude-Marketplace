---
name: codech-wp-security-maintenance
description: Use when asked to do security maintenance, a security audit, hardening, plugin/core updates, 2FA, login protection, or file-change monitoring on a LIVE client WordPress site — especially through a WordPress MCP (Novamira execute-php) or wp-admin only, running as the web user (www-data) with no root/SSH. Also use when a client site has outdated or licence-expired plugins, an inherited child theme with custom code, bot password-reset e-mails, broken site e-mail, or when something broke after maintenance and you need to know "was it us?".
---

# Codech WordPress Security Maintenance

Secure and update a live client WordPress site from the **application layer** (MCP / wp-admin,
web-user permissions) without breaking it and without surprising the client.

**Core principle:** the client sees every mistake. Audit read-only first, get approval, back up,
change one thing at a time, verify **both** the public pages **and** the admin/editor, and write
every change with its undo into a changelog *as you go*.

Server-level work (firewall, fail2ban, php-fpm, Cloudflare origin lockdown) needs root and lives in
`codech-web-hardening`. This skill is the WordPress layer.

## The rounds (in order — never skip a gate)

| # | Round | Changes anything? | Detail |
|---|---|---|---|
| 0 | **Audit** — run `scripts/audit.php` (read-only) + the manual checks | No | `references/audit.md` |
| 1 | **Report + approval** — findings, proposed fix, risk, undo, and what needs a client/boss decision | No | `references/reporting.md` |
| 2 | **Backup** — `scripts/backup.php`, verified not downloadable, copied off the server | Adds files | `references/backup-and-undo.md` |
| 3 | **Security fixes** — custom-code holes, public files, config, public data, robots | Yes | `references/fixes.md` |
| 4 | **Updates** — one plugin at a time, page checks + editor test + sitemap after each | Yes | `references/plugin-updates.md` |
| 5 | **Site e-mail** — prove mail is delivered (fix SMTP if not) | Maybe | `references/login-and-email.md` §1 |
| 6 | **Monitor** — `templates/monitor.php` on the web user's crontab | Yes | `references/monitor.md` |
| 7 | **Security plugin + 2FA** — Wordfence without locking out the MCP, 2FA with grace | Yes | `references/login-and-email.md` §2–4 |
| 8 | **Handover** — changelog, pending list, backup clean-up date, client message | No | `references/reporting.md` |

Each round is its own approval. "Do everything today" approves the plan, not each risky step:
deletions, licence decisions, 2FA timing and anything client-visible still go to the boss first,
and the boss (not you) tells the client. To keep "today" realistic: send the findings report within
the first hour, ask for all round approvals in one message, and do the read-only and backup work
while you wait. Plugin updates and Wordfence's first scan go in the site's low-traffic window.

## Rules that the obvious plan misses

- **Audit the custom code, not just versions.** Inherited child themes ship `wp_ajax_nopriv_*`
  handlers that write/TRUNCATE tables, PHP files that run when requested directly, hardcoded DB
  credentials, and `admin_init` hooks that bulk-update posts. Updates never fix these.
- **Find files a stranger can download** — `.wpress`/`.sql`/`.tar`/`.zip` exports anywhere under the
  web root. Test each over HTTP; "it's in a plugin folder" is not protection.
- **A backup folder inside the web root must be proven blocked** (canary → 403) before the dump is
  written. nginx ignores `.htaccess`.
- **After every plugin update test three things:** front-end pages with a cache-busting query,
  **open the Elementor/page-builder editor**, and `/sitemap_index.xml`. Front-end-only checks let
  an editor fatal reach the client.
- **When the page builder is pinned old, its add-ons are pinned too.** Check the add-on's required
  builder version before updating; a "free, minor" update can 500 the homepage.
- **A rollback is not finished until generated assets are deleted and their URLs change** (page
  builder per-page JS/CSS), and the page cache is purged.
- **Move, don't delete** inactive plugins and old files (no uninstall hooks run; instant undo).
- **Fix site e-mail before anything that sends e-mail** (monitor alerts, 2FA, password resets) —
  then expect the bot noise that starts arriving.
- **Security plugins can cut off your own access** (Wordfence disables application passwords by
  default → the MCP gets 401). Know the wp-admin recovery path before activating.
- **Never test on real accounts or as the client** — a test user with your own e-mail, deleted
  afterwards; test users still trigger e-mails to the site admin.

## Changelog (write it during the work, not after)

Every change gets one row in `CHANGELOG.md` (template: `templates/CHANGELOG.md`): time, exact
change (file/option/plugin + versions), how it was verified, and the **undo**. When something breaks
days later, this is how you answer "was it us?" in one minute. Also record what you deliberately did
**not** change.

## Files

| Path | Use |
|---|---|
| `scripts/audit.php` | Read-only audit — run first, paste output into notes |
| `scripts/backup.php` | DB + code + state backup as the web user, with 403 proof + checksums |
| `scripts/check_pages.sh` / `compare_pages.sh` | Cache-busted before/after page snapshot (run locally) |
| `templates/monitor.php` | File-change / admin / uploads-PHP / disk / site-down monitor |
| `templates/public-data-hardening.php` | Code Snippets: XML-RPC off, REST `/wp/v2` + author enumeration closed |
| `templates/robots-ai-search.txt` | robots.txt pattern: allow AI *search* bots, block *training* bots |
| `templates/CHANGELOG.md`, `templates/pages.txt` | Change log and page-check list to copy per site |
| `references/gotchas.md` | **Read when anything behaves strangely** — every incident we have caused or hit |

Placeholders are `__UPPERCASE__`. Never commit a filled-in copy; client names, IPs, e-mails and
secrets stay in the project folder, not in this repo.

## Related skills

- `codech-web-hardening` — root-level server hardening, capacity, Cloudflare, events
- `superpowers:verification-before-completion` — before telling the boss something is fixed
- `superpowers:systematic-debugging` — when an update broke something and the cause is unclear
