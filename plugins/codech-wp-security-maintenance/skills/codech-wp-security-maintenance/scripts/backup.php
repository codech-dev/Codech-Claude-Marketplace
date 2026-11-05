<?php
/**
 * Pre-change backup as the WEB USER (no root): database + code + state, with checksums.
 * Run inside WordPress (Novamira execute-php: paste without the opening php tag; or wp eval-file).
 *
 * Output: <dir>/<timestamp>/{db.sql.gz, code.tar.gz, state.json, SHA256SUMS}
 * <dir> = outside the web root when the web user can write there, otherwise
 *         wp-content/<prefix>-maint-backups with a deny-all .htaccess — and the script then
 *         PROVES the folder is not downloadable (canary file must return 403/404). If the canary is
 *         downloadable (nginx ignores .htaccess, LiteSpeed configs vary) the backup is deleted and it stops.
 *
 * Big sites: if the MCP call would time out, run the same commands with nohup in the background and poll
 * progress.log. Skip huge blob tables you can rebuild (set $skip_tables) and record that in the changelog.
 */
if (!defined('ABSPATH')) { exit("load WordPress first\n"); }
global $wpdb;

$prefix      = 'cdx';                 // short site prefix for folder names
$skip_tables = [];                    // e.g. ['IMAGES'] — rebuildable blob tables; schema is still dumped
$ts          = wp_date('Ymd-His');
$label       = '';                    // e.g. 'pre-plugin-updates'

// 1. Choose the folder.
$outside = dirname(rtrim(ABSPATH, '/')) . "/{$prefix}-maint-backups";
if ((is_dir($outside) || @mkdir($outside, 0700)) && is_writable($outside)) {
    $base = $outside; $in_webroot = false;
} else {
    $base = WP_CONTENT_DIR . "/{$prefix}-maint-backups"; $in_webroot = true;
    if (!is_dir($base)) { mkdir($base, 0700); }
    file_put_contents("$base/.htaccess", "Require all denied\nDeny from all\n");
    file_put_contents("$base/index.php", "<?php http_response_code(403);");
}
$out = "$base/$ts" . ($label ? "-$label" : '');
mkdir($out, 0700);

// 2. Prove it is not public BEFORE writing anything sensitive.
if ($in_webroot) {
    file_put_contents("$out/canary.txt", 'canary');
    $r = wp_remote_get(content_url(basename($base) . '/' . basename($out) . '/canary.txt'), ['timeout' => 20, 'sslverify' => false]);
    $code = is_wp_error($r) ? 0 : wp_remote_retrieve_response_code($r);
    unlink("$out/canary.txt");
    if (!in_array($code, [401, 403, 404], true)) {
        rmdir($out);
        exit("STOP: the backup folder is publicly readable (canary returned HTTP $code). Ask for root/hosting backup instead.\n");
    }
    echo "backup folder is web-blocked (canary HTTP $code)\n";
}

// 3. Database via mysqldump with a temporary credentials file (password never on the command line).
$cnf = tempnam(sys_get_temp_dir(), 'cdx'); chmod($cnf, 0600);
list($host, $port) = array_pad(explode(':', DB_HOST, 2), 2, '');
file_put_contents($cnf, "[client]\nuser=" . DB_USER . "\npassword=\"" . addcslashes(DB_PASSWORD, '"\\') . "\"\nhost=$host\n" . ($port ? (is_numeric($port) ? "port=$port\n" : "socket=$port\n") : ''));
$ignore = implode(' ', array_map(function ($t) { return '--ignore-table=' . escapeshellarg(DB_NAME . '.' . $t); }, $skip_tables));
$dump = 'nice -n 19 mysqldump --defaults-extra-file=' . escapeshellarg($cnf) . ' --single-transaction --quick --routines --triggers --default-character-set=utf8mb4 '
      . "$ignore " . escapeshellarg(DB_NAME) . ' 2>' . escapeshellarg("$out/dump.err") . ' | gzip -6 > ' . escapeshellarg("$out/db.sql.gz");
shell_exec($dump);
foreach ($skip_tables as $t) {
    shell_exec('mysqldump --defaults-extra-file=' . escapeshellarg($cnf) . ' --no-data ' . escapeshellarg(DB_NAME) . ' ' . escapeshellarg($t) . ' | gzip >> ' . escapeshellarg("$out/db-skipped-schema.sql.gz"));
}
unlink($cnf);
$err = trim((string) @file_get_contents("$out/dump.err")); @unlink("$out/dump.err");
$tail = (string) shell_exec('gunzip -c ' . escapeshellarg("$out/db.sql.gz") . ' | tail -c 200');
if (strpos($tail, 'Dump completed') === false) { exit("STOP: database dump incomplete. mysqldump said: $err\n"); }
echo 'db.sql.gz ', size_format(filesize("$out/db.sql.gz")), " (dump completed)\n";

// 4. Code (not uploads, not caches).
$items = ['wp-content/plugins', 'wp-content/themes', 'wp-config.php', '.htaccess'];
if (is_dir(WPMU_PLUGIN_DIR)) { $items[] = 'wp-content/mu-plugins'; }
foreach (['object-cache.php', 'advanced-cache.php', 'db.php'] as $dropin) { if (is_file(WP_CONTENT_DIR . "/$dropin")) { $items[] = "wp-content/$dropin"; } }
$items = array_filter($items, function ($i) { return file_exists(ABSPATH . $i); });
shell_exec('nice -n 19 tar -C ' . escapeshellarg(rtrim(ABSPATH, '/')) . ' --exclude=wp-content/cache --exclude="*/node_modules" -czf '
    . escapeshellarg("$out/code.tar.gz") . ' ' . implode(' ', array_map('escapeshellarg', $items)) . ' 2>&1');
echo 'code.tar.gz ', size_format(filesize("$out/code.tar.gz")), "\n";

// 5. State: what you need to undo option-level changes.
if (!function_exists('get_plugins')) { require_once ABSPATH . 'wp-admin/includes/plugin.php'; }
$state = [
    'taken' => $ts, 'wp' => get_bloginfo('version'), 'php' => PHP_VERSION,
    'active_plugins' => get_option('active_plugins'),
    'plugin_versions' => array_map(function ($p) { return $p['Version']; }, get_plugins()),
    'theme' => get_stylesheet(), 'siteurl' => get_option('siteurl'), 'home' => get_option('home'),
    'rewrite_rules_count' => count((array) get_option('rewrite_rules')),
    'crontab' => (string) shell_exec('crontab -l 2>&1'),
    'robots_txt' => wp_remote_retrieve_body(wp_remote_get(home_url('/robots.txt'), ['sslverify' => false])),
    'disk_free_gb' => round(disk_free_space(ABSPATH) / 1073741824, 1),
];
file_put_contents("$out/state.json", json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

// 6. Checksums (used before any restore, and to verify the off-server copy).
shell_exec('cd ' . escapeshellarg($out) . ' && sha256sum * > SHA256SUMS');
echo "done: $out\n", (string) shell_exec('ls -la ' . escapeshellarg($out));
echo "Next: copy it OFF the server (see references/backup-and-undo.md) and log the path in CHANGELOG.md.\n";
