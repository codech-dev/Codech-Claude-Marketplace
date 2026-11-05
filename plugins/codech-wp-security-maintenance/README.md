# codech-wp-security-maintenance

Security maintenance for **live client WordPress sites**, done from the application layer — a
WordPress MCP (Novamira `execute-php`) or wp-admin, running as the web user, with no root/SSH.

Built from a real engagement (a high-traffic property-listing site, Oct 2026: Houzez + Elementor 3.16,
expired premium licences, heavily edited child theme, office-database sync). Every rule in it comes
from something that went right or wrong there, including the two client-visible incidents we caused.

## What it covers

| Round | What happens |
|---|---|
| 0 Audit | `scripts/audit.php` — read-only: versions, updates, admin users, files a stranger can download (HTTP-tested), PHP in uploads, unauthenticated AJAX + direct-run files in custom code, hardcoded credentials, public endpoints, cron health, e-mail health |
| 1 Report | findings + decisions for the boss before any change |
| 2 Backup | `scripts/backup.php` — DB + code + state as the web user, proven not downloadable, checksums, off-server copy |
| 3 Fixes | custom-code holes, public files, wp-config, public data (REST users / author / XML-RPC), robots.txt, users, dead cron jobs |
| 4 Updates | one plugin at a time; front-end + **editor** + sitemap checks; page-builder pinning; full rollback incl. generated assets |
| 5 E-mail | prove site mail is delivered; fix SMTP (M365 OAuth) before anything relies on it |
| 6 Monitor | `templates/monitor.php` — e-mails on file changes, admin changes, PHP in uploads, disk, site down |
| 7 Wordfence + 2FA | without locking out the MCP; 2FA with grace periods; bot reset e-mails |
| 8 Handover | changelog with undo per change, pending list, key dates |

## Install

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install codech-wp-security-maintenance@codech-marketplace
```

Triggers on: "security maintenance", "secure this WordPress site", "update the plugins safely",
"set up 2FA", "monitor file changes", "something broke after the update — was it us?".

## Scope

Root-level server work (firewall, fail2ban, php-fpm sizing, Cloudflare origin lockdown) is not
covered here — see `codech-web-hardening` where available.

## Safety

- Nothing changes before the audit report is approved.
- The scripts mask credentials in their output; templates use `__PLACEHOLDERS__`. Never commit a
  filled-in copy or any client data to this repo.
