# Round 3 — Security fixes (application layer)

Each fix: backup taken → change → verify → changelog row with undo. One at a time.
Edit live files in place (the team may have changed them since your last read — re-read first).
Keep a copy of every original in the backup's `files-before-edit/` folder.

## 1. Custom code holes (child theme / mu-plugins)

**Unauthenticated AJAX that writes data** — comment out only the `nopriv` registration; the
logged-in `wp_ajax_` one keeps the admin button working:

```php
// add_action('wp_ajax_nopriv_import_data', 'import_data'); // disabled YYYY-MM-DD Codech: public trigger of a TRUNCATE+reload; admin button still works
```

Leave read-only public handlers (search, load-more, contact forms) alone — the site needs them.

**Theme PHP files that run when requested directly** (they `require wp-load.php` and act on
`$_POST`) — add a capability check right after WordPress loads:

```php
if ( ! current_user_can( 'manage_options' ) ) { status_header( 403 ); exit( 'Forbidden' ); } // added YYYY-MM-DD Codech
```

Verify: logged-out request → 403; the admin feature that uses it still works.

**Heavy hooks** (`add_action('admin_init', 'update_all_posts_…')`) — comment out with a dated note
and **record the side effect** (e.g. drafts are no longer auto-published) in the changelog and the
client message.

**Hardcoded credentials** — report them; don't rotate a client's DB/office-system password without
the owner. If agreed, move them to `wp-config.php` constants.

## 2. Files a stranger can download

Backups (`ai1wm-backups/*.wpress`), theme/plugin `.tar`/`.zip` copies, export `.zip`/`.csv` in
uploads, `.sql` dumps, `debug.log`.
- **Move** them into the web-blocked backup folder (instant undo), unless the boss approves deleting
  (huge files when disk is short). Deleting is not reversible — get the yes in writing.
- Re-test the old URL → 403/404.

## 3. wp-config.php

```php
define( 'DISALLOW_FILE_EDIT', true );   // no theme/plugin code editor in wp-admin
```
Permissions 640 (owner www-data, readable by the group). Before saving: copy the original, and after
saving load the homepage **and** wp-admin — one typo in wp-config takes the whole site down.
Not `DISALLOW_FILE_MODS` unless agreed: it also blocks plugin updates from wp-admin.

## 4. Inactive plugins / unused themes

Move folders to `<backup-dir>/inactive-plugins-moved-YYYYMMDD/`. Moving skips `uninstall.php`
(no data deleted) and is undone by moving back. Keep one default theme for recovery.
Also check `active_plugins` for duplicates and de-duplicate.

## 5. Public data exposure

Add `templates/public-data-hardening.php` as a Code Snippets snippet (scope global). First confirm
nothing public uses `/wp-json/wp/v2` or XML-RPC (headless front end, mobile app, Jetpack).
Verify logged out: `/wp-json/wp/v2/users` 401, `/?author=1` → home, the site's forms still submit.

## 6. robots.txt

Usually requested by the SEO team. Find where it is generated (Rank Math: option
`rank-math-options-general[robots_txt_content]`; Yoast/AIOSEO: their editors; or a physical file).
Save the old text first. Pattern: `templates/robots-ai-search.txt` — a **named `User-agent` group
does not inherit the `*` rules**, so repeat the exclusions in every named group.
Verify the live `/robots.txt` matches byte-for-byte (purge cache).

## 7. Users

Client confirms the admin list. Remove/downgrade only with written OK. Rename a login called
`admin` (login-and-email.md). Check `users_can_register` = 0 unless the site needs sign-up, and
`default_role` = subscriber.

## 8. Dead cron jobs (common in inherited sites)

Compare each crontab line with its log/data timestamp. Classic cause: the job's
`>> /var/log/x.log` redirect points at a file the web user can't write (logrotate recreates it as
root) → the shell refuses to run the command at all, silently. Without root: redirect to a
web-user-writable, web-blocked folder with `>` (keeps only the last run, so it can't fill the disk).
Run the job once by hand and confirm the data timestamp moves.

## 9. Things that need root — list them, don't work around them

PHP version upgrade, server packages, firewall, real log rotation, server snapshots. Put them in the
report's "needs root / hosting" list.
