<?php
/**
 * Codech site monitor — e-mails ONLY when something is wrong.
 * Runs from the web user's crontab (www-data) every 15 min. No root needed.
 *
 * Checks: site up (public URL, 2 fails in a row) · code files added/changed/deleted
 *         · admin-level users changed · PHP files in uploads · disk space
 *         · (optional) a custom freshness query, e.g. a data-sync table.
 *
 * Install (see references/monitor.md):
 *   1. Fill every __PLACEHOLDER__ below. Never commit a filled-in copy.
 *   2. Put it in wp-content/<prefix>-monitor/monitor.php with an .htaccess "Require all denied"
 *      (and verify the URL returns 403 — on nginx .htaccess does nothing).
 *   3. php monitor.php --baseline    then    php monitor.php --test   (check the mail arrives)
 *   4. crontab (as www-data), keeping the existing lines — exact line and fallbacks in references/monitor.md
 *
 * Usage: php monitor.php            normal run
 *        php monitor.php --baseline record the current state without alerting (after planned changes)
 *        php monitor.php --test     send a test e-mail
 */

if (PHP_SAPI !== 'cli') { http_response_code(403); exit; }

define('MON_SITE_NAME', '__SITE_NAME__');                  // e.g. example.com
define('MON_ALERT_TO', '__ALERT_EMAIL__');                 // the team inbox, not the client
define('MON_SITE_URL', 'https://__HOST__/');
define('MON_HOMEPAGE_MARKER', '__TEXT_ALWAYS_ON_HOMEPAGE__'); // e.g. the brand name; proves it is the real page
define('MON_WP_LOAD', '__ABSPATH__/wp-load.php');          // e.g. /var/www/html/wp-load.php
define('MON_ADMIN_ROLES', 'administrator');                // comma list; add custom admin-like roles
define('MON_EXTRA_ROOTS', '');                             // comma list of extra code dirs under ABSPATH, e.g. "data"
define('MON_STATE', __DIR__ . '/state');
define('MON_REPEAT_SECONDS', 6 * 3600);                    // same alert at most every 6 h
define('MON_DISK_MAX_PCT', 90);
// Optional freshness check: SQL returning a datetime, max age in seconds, and its timezone. Leave SQL empty to skip.
define('MON_FRESH_SQL', '');                               // e.g. "SELECT MAX(SyncedAt) FROM LISTINGS"
define('MON_FRESH_MAX_AGE', 2 * 3600);
define('MON_FRESH_TZ', 'UTC');

$args = array_slice($argv, 1);
$baseline = in_array('--baseline', $args, true);
$test     = in_array('--test', $args, true);

if (!is_dir(MON_STATE)) { mkdir(MON_STATE, 0700, true); }

// Single instance (a slow run must not overlap the next one).
$lock = fopen(MON_STATE . '/monitor.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) { exit(0); }

// ---- 1. Site up: checked BEFORE loading WordPress, through the public URL ---------------
$site_problem = null;
$ch = curl_init(MON_SITE_URL);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 45, CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => 'Codech-Monitor/1.0']);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$secs = round(curl_getinfo($ch, CURLINFO_TOTAL_TIME), 1);
$err  = curl_error($ch);
curl_close($ch);
if ($code !== 200 || stripos((string) $body, MON_HOMEPAGE_MARKER) === false) {
    $site_problem = $code ? "Homepage returned HTTP $code after {$secs}s" : "Homepage did not respond ($err)";
}
// Alert only after 2 failures in a row (short slow spikes are normal on busy sites).
$fails_file = MON_STATE . '/site_fails';
$fails = $site_problem ? ((int) @file_get_contents($fails_file)) + 1 : 0;
file_put_contents($fails_file, (string) $fails);

// ---- Load WordPress (wp_mail through the site's SMTP plugin, users, DB) ------------------
$host = parse_url(MON_SITE_URL, PHP_URL_HOST);
$_SERVER['HTTP_HOST'] = $host;
$_SERVER['REQUEST_URI'] = '/';
define('WP_USE_THEMES', false);
require MON_WP_LOAD;
global $wpdb;

$problems = [];   // key => message

if ($site_problem && $fails >= 2) {
    $problems['site_down'] = "SITE DOWN: $site_problem (failed $fails checks in a row).";
}

// ---- 2. Code files: new / changed / deleted ---------------------------------------------
$roots = [ABSPATH . 'wp-admin', ABSPATH . 'wp-includes', WP_CONTENT_DIR . '/plugins',
          WP_CONTENT_DIR . '/themes', WP_CONTENT_DIR . '/mu-plugins'];
foreach (array_filter(array_map('trim', explode(',', MON_EXTRA_ROOTS))) as $extra) { $roots[] = ABSPATH . $extra; }
$single = array_merge(glob(ABSPATH . '*.php') ?: [], glob(WP_CONTENT_DIR . '/*.php') ?: [], [ABSPATH . '.htaccess']);
$code_ext = '/\.(php|phtml|phar|php\d|js|htaccess|ini|sh)$|\/\.htaccess$/i';

$manifest_file = MON_STATE . '/files.json';
$old = is_file($manifest_file) ? json_decode(file_get_contents($manifest_file), true) : [];
$new = [];
$add_file = function ($path) use (&$new, $old) {
    $st = @stat($path);
    if (!$st) { return; }
    $sig = $st['size'] . ':' . $st['mtime'];
    if (isset($old[$path]) && strpos($old[$path], $sig . ':') === 0) {
        $new[$path] = $old[$path];                       // unchanged size+mtime: reuse hash, no disk read
    } else {
        $new[$path] = $sig . ':' . md5_file($path);
    }
};
foreach ($roots as $root) {
    if (!is_dir($root)) { continue; }
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $f) {
        if ($f->isFile() && preg_match($code_ext, $f->getPathname())) { $add_file($f->getPathname()); }
    }
}
foreach ($single as $p) { if (is_file($p)) { $add_file($p); } }

// PHP in uploads is never legitimate, except the empty "silence is golden" index.php placeholders.
$uploads_php = [];
$found = (string) shell_exec('find ' . escapeshellarg(WP_CONTENT_DIR . '/uploads') . ' -type f \( -iname "*.php" -o -iname "*.phtml" -o -iname "*.phar" -o -iname "*.php[0-9]" \) 2>/dev/null');
foreach (array_filter(explode("\n", trim($found))) as $path) {
    $c = @file_get_contents($path, false, null, 0, 200);
    if (!preg_match('/^\s*(<\?php\s*(\/\/[^\n]*)?\s*)?$/i', (string) $c)) {
        $uploads_php[] = $path;
    }
}
if ($uploads_php) {
    $problems['uploads_php_' . md5(implode('|', $uploads_php))] =
        "PHP FILE(S) IN UPLOADS (almost always malware):\n  " . implode("\n  ", array_slice($uploads_php, 0, 30));
}

if ($old) {
    $added = array_diff_key($new, $old);
    $removed = array_diff_key($old, $new);
    $changed = [];
    foreach (array_intersect_key($new, $old) as $p => $v) {
        if (substr($v, strrpos($v, ':') + 1) !== substr($old[$p], strrpos($old[$p], ':') + 1)) { $changed[] = $p; }
    }
    $strip = function ($p) { return str_replace(ABSPATH, '/', $p); };
    $lines = [];
    foreach (['Added' => array_keys($added), 'Changed' => $changed, 'Deleted' => array_keys($removed)] as $label => $list) {
        if (!$list) { continue; }
        $lines[] = "$label (" . count($list) . "):\n  " . implode("\n  ", array_map($strip, array_slice($list, 0, 40)))
            . (count($list) > 40 ? "\n  ... and " . (count($list) - 40) . ' more' : '');
    }
    if ($lines) {
        // File changes are always reported once (no repeat suppression), then become the new baseline.
        $problems['files_' . microtime(true)] = "CODE FILES CHANGED since the last check (plugin/theme updates also show here):\n" . implode("\n", $lines);
    }
}
file_put_contents($manifest_file, json_encode($new));

// ---- 3. Admin-level users ----------------------------------------------------------------
$admins = [];
foreach (get_users(['role__in' => array_map('trim', explode(',', MON_ADMIN_ROLES))]) as $u) {
    $admins[$u->user_login] = implode(',', $u->roles) . ' <' . $u->user_email . '>';
}
ksort($admins);
$admins_file = MON_STATE . '/admins.json';
$old_admins = is_file($admins_file) ? json_decode(file_get_contents($admins_file), true) : null;
if (is_array($old_admins) && $old_admins !== $admins) {
    $diff = [];
    foreach (array_diff_key($admins, $old_admins) as $l => $v) { $diff[] = "NEW: $l $v"; }
    foreach (array_diff_key($old_admins, $admins) as $l => $v) { $diff[] = "REMOVED: $l $v"; }
    foreach (array_intersect_key($admins, $old_admins) as $l => $v) { if ($v !== $old_admins[$l]) { $diff[] = "CHANGED: $l {$old_admins[$l]} -> $v"; } }
    $problems['admins_' . md5(json_encode($admins))] = "ADMIN ACCOUNTS CHANGED:\n  " . implode("\n  ", $diff);
}
file_put_contents($admins_file, json_encode($admins));

// ---- 4. Disk -----------------------------------------------------------------------------
$total = disk_total_space(ABSPATH); $free = disk_free_space(ABSPATH);
$pct = $total ? round(100 - $free / $total * 100) : 0;
if ($pct >= MON_DISK_MAX_PCT) {
    $problems['disk'] = "DISK {$pct}% FULL (" . round($free / 1073741824, 1) . ' GB free).';
}

// ---- 5. Optional data freshness ------------------------------------------------------------
$last = null;
if (MON_FRESH_SQL !== '') {
    $last = $wpdb->get_var(MON_FRESH_SQL);
    $age = $last ? time() - strtotime($last . ' ' . MON_FRESH_TZ) : PHP_INT_MAX;
    if ($age > MON_FRESH_MAX_AGE) {
        $problems['fresh'] = 'DATA NOT UPDATING: last update ' . ($last ?: 'never') . ' (' . round($age / 3600, 1) . ' h ago).';
    }
}

// ---- Send ----------------------------------------------------------------------------------
if ($baseline) { echo 'baseline recorded: ' . count($new) . ' files, ' . count($admins) . " admins\n"; exit(0); }

$sent_file = MON_STATE . '/sent.json';
$sent = is_file($sent_file) ? json_decode(file_get_contents($sent_file), true) : [];
$now = time();
$to_send = [];
foreach ($problems as $key => $msg) {
    if (strpos($key, 'files_') === 0 || empty($sent[$key]) || $now - $sent[$key] > MON_REPEAT_SECONDS) {
        $to_send[] = $msg;
        $sent[$key] = $now;
    }
}
foreach ($sent as $k => $t) { if ($now - $t > 7 * 86400) { unset($sent[$k]); } }
file_put_contents($sent_file, json_encode($sent));

if ($test) {
    $to_send = ['TEST: the ' . MON_SITE_NAME . " monitor is installed and can send e-mail.\nHomepage: HTTP $code in {$secs}s · disk {$pct}% · "
        . count($new) . ' code files watched · ' . count($admins) . ' admin accounts' . ($last ? " · data last updated $last" : '') . '.'];
}

// Alerts that could not be mailed (site mail broken) are queued and re-sent with the next mail.
$queue_file = MON_STATE . '/unsent.json';
$queue = is_file($queue_file) ? (json_decode(file_get_contents($queue_file), true) ?: []) : [];
foreach ($to_send as $m) { $queue[] = '[' . wp_date('Y-m-d H:i') . '] ' . $m; }
$queue = array_slice($queue, -50);

if ($queue) {
    $subject = '[' . MON_SITE_NAME . ' monitor] ' . ($test ? 'Test e-mail' : count($queue) . ' problem(s)');
    $text = implode("\n\n----\n\n", $queue) . "\n\n--\nSent by " . __FILE__ . ' (www-data crontab, every 15 min) at ' . wp_date('Y-m-d H:i T') . '.';
    $ok = wp_mail(MON_ALERT_TO, $subject, $text);
    if ($ok) {
        @unlink($queue_file);
    } else {
        file_put_contents($queue_file, json_encode($queue));
    }
    echo ($ok ? 'sent: ' : 'MAIL FAILED (queued, ' . count($queue) . ' alerts): ') . $subject . "\n";
} else {
    echo 'ok ' . date('c') . "\n";
}
