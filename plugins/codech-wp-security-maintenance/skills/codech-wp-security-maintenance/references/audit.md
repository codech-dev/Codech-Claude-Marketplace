# Round 0 — Audit (read-only)

Goal: a complete list of findings **before** anything changes, so the boss approves a plan instead
of reacting to surprises. Nothing in this round writes to the site.

## 1. Run the script

`scripts/audit.php` — through Novamira, call `novamira/execute-php` with the file body (without the
opening `<?php` tag) as `code`. It takes ~10 s on a 30-plugin site. Save the output to the project's
`maintenance/audit-YYYY-MM-DD.txt`.

## 2. Read the output — what each section means

| Section | Bad sign | Usual fix (round 3/4) |
|---|---|---|
| Environment | PHP past end-of-life; `siteurl`/`home` on `http://`; `DISALLOW_FILE_EDIT` = NO; wp-config 644/755; `WP_DEBUG` ON | config fixes; http→https is its own tested change |
| Plugins | updates available; duplicate entries in `active_plugins`; premium plugins with no update path (expired licence); unknown/"-master"/"nulled"-looking folders; inactive plugins | updates (round 4), move inactive out, ask the boss about licences |
| mu-plugins / drop-ins | anything you can't explain | ask before touching; note in report |
| Admin users | unknown accounts; a login named `admin`; shared accounts | client confirms list; rename `admin` (login-and-email.md) |
| Archives with HTTP status | any `!!` (200/206) | move out of the web root (fixes.md §2) |
| PHP in uploads | anything except empty placeholder `index.php` | **stop — possible compromise**, report before maintenance |
| nopriv handlers (custom) | handler that writes, deletes, TRUNCATEs, imports or sends mail | disable or add a capability check (fixes.md §1) |
| DIRECT-RUN files | theme PHP that loads WordPress/DB with no auth check | capability check → 403 (fixes.md §1) |
| Credentials in theme | hardcoded DB/API passwords | report; moving them is a code change for the owner |
| Heavy hooks | `admin_init`/`init` doing bulk updates every load | comment out with a dated note (fixes.md §1) |
| Public endpoints | `/wp-json/wp/v2/users` 200; `?author=1` 200/301 to a username; `xmlrpc.php` 405 (= enabled) | public-data snippet (fixes.md §5) |
| Cron | jobs whose log/data is older than the schedule | find why (fixes.md §8) |
| Mail | `failed` > 0 in the log | fix before 2FA/monitor (login-and-email.md) |
| Security plugins | none, or two overlapping | Wordfence (login-and-email.md) |

## 3. Manual checks the script can't do

- **Known vulnerabilities**: install/run the Wordfence scan later (round 7) or look up each outdated
  plugin on Patchstack/WPScan. List the ones you **cannot** update (licence, builder compatibility)
  with their CVSS — the boss decides on licence renewals, not you.
- **Page-builder compatibility map**: write down builder core + Pro versions and every add-on that
  depends on them. This list decides what is safe to update (plugin-updates.md).
- **Custom code read-through**: open each nopriv handler and DIRECT-RUN file the script lists. Ask:
  can a logged-out stranger make this write, delete, import, e-mail, or reveal data?
- **Data jobs**: if the site imports data (cron sync from an office DB, feeds), check the newest
  record's timestamp. A silently dead sync is a common inherited fault.
- **Who edits the site**: the team/client may edit live files directly (many `.bak` copies beside
  `functions.php` are the tell). Then: never overwrite a file from your local copy — edit the live
  one, and re-read it right before editing.
- **Baseline pages**: write `pages.txt` (template) and run `bash scripts/check_pages.sh <url> pages.txt > pages.before.tsv`
  from your machine.

## 4. Signs of an existing compromise → stop

Unknown admin, non-empty PHP in uploads, obfuscated code (`eval(base64_decode`, `gzinflate`) in
theme/plugins, unexpected mu-plugins, core files differing from checksums. Do **not** update or
clean up first — that destroys evidence. Report it as an incident and agree the next steps.
