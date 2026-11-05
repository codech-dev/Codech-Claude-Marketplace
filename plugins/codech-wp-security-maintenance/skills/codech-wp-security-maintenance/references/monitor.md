# Round 6 — Monitor (file changes, admins, uploads PHP, disk, site down)

`templates/monitor.php` runs as the web user from its crontab. It e-mails **only when something is
wrong**, through the site's own `wp_mail` (so the SMTP plugin is used). No root needed.

## What it checks

| Check | Alerts when |
|---|---|
| Homepage (public URL, before WordPress loads) | non-200 or the marker text missing, **2 runs in a row** |
| Code files (wp-admin, wp-includes, plugins, themes, mu-plugins, extra dirs, root PHP, .htaccess) | any file added / changed / deleted (size+mtime, md5 confirms) |
| Admin-level users | added, removed, role or e-mail changed |
| PHP in uploads | any non-empty PHP file |
| Disk | ≥ 90 % |
| Optional freshness SQL | data older than the limit (e.g. a sync table) |

Same alert repeats at most every 6 h; file changes are reported once then become the baseline.
If mail fails, alerts queue in `state/unsent.json` and go out with the next successful mail.

## Install

1. Copy to `wp-content/<prefix>-monitor/monitor.php`, fill the placeholders (alert address = the
   team inbox, never the client).
2. `.htaccess` in that folder: `Require all denied`. Test the URL → 403 (nginx: needs a server rule
   or put it outside the web root).
3. `php monitor.php --baseline`, then `php monitor.php --test` → confirm the e-mail **arrives**.
4. Crontab as the web user — keep the existing lines (save `crontab -l` to the backup first):
   ```
   7,22,37,52 * * * * cd /path/<prefix>-monitor && nice -n 19 ionice -c3 /usr/bin/php monitor.php > /path/<prefix>-monitor/monitor.log 2>&1
   ```
   Odd minutes avoid colliding with other :00/:15 jobs. One run on ~15k files ≈ 1 min at idle IO.
   `>` (not `>>`) keeps only the last run's output, so the log can't grow.
   Install with `(crontab -l; echo '<line>') | crontab -` after saving `crontab -l` to the backup.
5. Undo: remove the crontab line and the folder.

**No crontab for the web user** (`crontab` missing, shell_exec disabled, managed hosting): use the
host panel's cron (cPanel/hPanel "Cron Jobs") with the same command. Don't use WP-Cron for this —
it only fires on uncached visits and dies with the site, which is exactly when you need the alert.
No cron at all → say so in the report and rely on the security plugin's file scan + an external
uptime monitor.

## Living with it

- After **planned** changes (updates, your own edits) run `--baseline`, or the team gets a long
  e-mail — and clear queued alerts that were your own changes.
- An alert you can't explain = treat as an incident until proven otherwise.
- Limits: it runs as the same user an attacker would get, so it is an early-warning tool, not
  tamper-proof. Recommend an external uptime monitor and host-level integrity checks too.
