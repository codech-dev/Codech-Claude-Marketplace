# Round 4 — Plugin updates (one at a time)

## Before the first update

1. Fresh backup (`scripts/backup.php`, label `pre-updates`) — it records every plugin version.
2. `pages.before.tsv` from `scripts/check_pages.sh` (cache-busted).
3. Open the page-builder editor on the homepage once, so you know what "working" looks like.
4. Sort the update list into groups and get the boss's yes on the list:

| Group | Examples | Rule |
|---|---|---|
| A — safe | small free utilities, SEO, redirects, SMTP, object-cache | update one by one |
| B — tied to the page builder | Elementor add-ons (Essential Addons, OoohBoi, UAE…), anything that hooks into the editor (Code Snippets has an Elementor integration) | read the add-on's required builder version first; if the builder is pinned old, **pin these too** |
| C — licence needed / major | builder Pro, premium theme, ACF PRO, WPML/TranslatePress Business, WP Rocket | boss/client decision; never nulled copies |
| Skip | plugins with local custom edits, your own access tool (do it last with wp-admin open as a safety net) | note why in the changelog |

Plugins with local modifications: diff against the stock version of the same release before
updating; an update silently removes the edit (and whatever depends on it).

**Page builder free + Pro pair:** when Pro can't be updated (expired licence), keep the free core on
the same major line Pro supports — update core only within the minor range Pro's changelog lists.
Elementor core 4.x under Pro 3.x silently breaks Pro widgets (carousels lose their styles, layouts
shift) with no error. Updating core is a Group C decision together with the Pro licence.

**Premium parent theme** (Houzez, Avada, Betheme…): Group C. Bundled theme plugins must update in
step with the theme. Before updating, list the child theme's template overrides and diff each one
against the new parent version — heavily edited overrides break silently (search, listing pages).
Use staging if one exists; otherwise a low-traffic window and a fresh backup.

## The loop — per plugin

```php
// Through execute-php. Refresh the update info first: Plugin_Upgrader returns false (no error)
// when the update transient is empty.
require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
delete_site_transient( 'update_plugins' ); wp_update_plugins();
$u = new Plugin_Upgrader( new Automatic_Upgrader_Skin() );
var_dump( $u->upgrade( 'plugin-folder/plugin-file.php' ) );   // true = done; check the version after
```

After **each** one:
1. `bash scripts/compare_pages.sh <url> pages.txt pages.before.tsv` → `ALL PAGES OK`.
2. Open the **editor** on one page (Elementor: `/wp-admin/post.php?post=<id>&action=elementor`,
   load fully, no "critical error"). Editor fatals do not show on the front end.
3. `/sitemap_index.xml` (or the SEO plugin's sitemap) → 200. If 404: the update rebuilt rewrite
   rules without the SEO plugin's → `flush_rewrite_rules( false );` from a normal request, or
   Settings → Permalinks → Save. Re-test.
4. Changelog row: plugin, old → new version, checks passed, undo.

Something broke → roll back **that one plugin** immediately (below), then investigate.

## Rollback of one plugin

Restore the folder from `code.tar.gz` (move the broken one aside, don't delete — it's evidence):
```bash
tar -C /var/www/html -xzf <backup>/code.tar.gz wp-content/plugins/<folder>
```
Then:
- **Delete generated assets** the newer version built (e.g. `uploads/essential-addons-elementor/eael-*.js|css`,
  Elementor `uploads/elementor/css/*`) — the old plugin will otherwise load the new version's JS.
  Keep copies in the backup folder.
- **Change the asset URL** if it is versioned by something the rollback didn't change (EA uses the
  page's `post_modified` as `?ver=`): bump that value, or browsers keep the broken file for days
  (no Cache-Control headers = heuristic caching).
- Purge the page cache (WP Rocket: `rocket_clean_domain()`), reload the pages uncached so the
  assets regenerate, test on **mobile and desktop**.

## Core updates

Minor core updates are low-risk; still backup + page checks + editor test. Major core with an old
page builder: check the builder's "tested up to" first.

## After the round

- Re-baseline the monitor (`php monitor.php --baseline`) — it will otherwise e-mail the whole update.
- Changelog: list what was **not** updated and why (licence, builder pin, custom edit).
- Keep the "never update" list in the project notes (e.g. "Code Snippets stays 3.9.x while
  Elementor is 3.16") so the next person or auto-update doesn't repeat the incident.
- Turn off host auto-updaters (Hostinger "Smart auto-updates", Jetpack auto-updates) for pinned
  plugins, or they undo the pin.
