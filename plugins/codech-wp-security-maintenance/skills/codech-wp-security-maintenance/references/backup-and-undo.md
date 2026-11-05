# Round 2 — Backup, off-server copy, undo

## Take it

`scripts/backup.php` (execute-php). It:
- prefers a folder **outside** the web root; otherwise `wp-content/<prefix>-maint-backups/` with a
  deny-all `.htaccess`, and **stops** unless a canary file there returns 403/404 over HTTP;
- dumps the DB with `mysqldump --single-transaction` (no table locks on InnoDB) via a temporary
  0600 credentials file, and checks the dump ends with "Dump completed";
- tars plugins, themes, mu-plugins, drop-ins, wp-config.php, .htaccess (no uploads, no cache);
- saves `state.json` (active plugins, versions, crontab, robots.txt, rewrite-rule count…) and `SHA256SUMS`.

Check free disk first (audit). Take a new backup before each round that changes code/plugins.
Before editing a single file/option, also save that original into `<backup>/files-before-edit/`
(or the option value as JSON) — restoring one file is faster than untarring.

Also save before changing them: the web user's crontab, robots.txt text, any option you edit,
rewrite rules before a flush, a drop-in you replace (`object-cache.php`).

## Copy it off the server

A backup only on the same server dies with the server. Without SSH:
- a **temporary** download script in the web root guarded by a long random key, serving only an
  allow-list of files from the backup folder, deleted immediately after (verify 404); or
- ask the host/client for an SFTP pull.
Verify the local copy against `SHA256SUMS`. It contains the client's DB and wp-config → keep it in a
private project folder, never in git or chat. Ask the user before running this step — it moves
client data off the server.

## Undo recipes (as the web user)

| Undo | How |
|---|---|
| One plugin | move the current folder aside; `tar -xzf code.tar.gz wp-content/plugins/<folder>`; then the rollback steps in plugin-updates.md |
| One file | copy back from `files-before-edit/` (or extract that path from code.tar.gz) |
| One option | `update_option()` with the saved JSON value |
| Crontab | `crontab <saved-file>` as the web user |
| Database | last resort: `.maintenance` file on, `gunzip -c db.sql.gz | mysql …`, off. Loses every order/form/post since the backup — boss decision |

## Retention

Agree a date (1–2 weeks after the work is stable), write it in the handover, then delete the
in-webroot backups (they hold the DB + wp-config). Leave the off-server copy per the client's policy.
