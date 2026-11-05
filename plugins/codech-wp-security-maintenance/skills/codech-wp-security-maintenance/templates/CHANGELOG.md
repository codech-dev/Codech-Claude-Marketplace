# __SITE__ — maintenance change log

Server/backups: `__BACKUP_DIR__` (web-blocked, 403 verified YYYY-MM-DD) · off-server copy: `__LOCAL_PATH__`
Approved by: __BOSS__ · Times in __TIMEZONE__ · Access: __MCP / wp-admin / SSH__

## YYYY-MM-DD — Round N: __name__ (approval: "__quote__")
Backup: `__backup folder__` (db + code, SHA256SUMS verified)

| Time | Change (exact: file / option / plugin old → new) | Verified | Undo |
|---|---|---|---|
| 10:05 | example: child `functions.php` L1989 — commented out `wp_ajax_nopriv_import_data` | logged-out POST → 0; admin import still works | copy `files-before-edit/functions.php` back |
| 10:20 | example: Redirection 5.5.2 → 5.10.1 | 15 pages OK, editor opens, sitemap 200 | restore folder from code.tar.gz |

**Incidents:** time · symptom · cause · what we did · lesson (also add to the skill's gotchas.md)

**Not changed on purpose:** plugin/file · reason (licence / builder pin / custom edit / client decision)

## Pending
- [ ] item · waiting on whom · date

## Dates to remember
- Firewall learning mode ends: · 2FA grace ends: · SMTP secret expires: · Delete backups after:
