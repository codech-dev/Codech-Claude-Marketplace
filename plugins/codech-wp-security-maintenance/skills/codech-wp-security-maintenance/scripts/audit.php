<?php
/**
 * Read-only WordPress security audit. Changes nothing except refreshing the plugin update-check
 * cache (the same thing wp-admin > Updates does). Shell steps run as the web user and are skipped if shell_exec is off.
 * Run inside WordPress (Novamira execute-php, wp eval-file, or a CLI script that requires wp-load.php).
 * Through Novamira, paste the body (without the opening php tag) as the `code` parameter.
 * Paste the output into the audit notes; every section maps to a row in references/audit.md.
 */
if (!defined('ABSPATH')) { exit("load WordPress first\n"); }
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/update.php';
global $wpdb, $wp_version;

$h = function ($t) { echo "\n== $t\n"; };
$short = function ($p) { return str_replace(ABSPATH, '/', $p); };
$sh = function ($cmd) { return function_exists('shell_exec') ? trim((string) shell_exec($cmd . ' 2>&1')) : '(shell_exec disabled)'; };

$h('Environment');
echo 'WP ', $wp_version, ' | PHP ', PHP_VERSION, ' | user ', $sh('whoami'), ' | server ', $_SERVER['SERVER_SOFTWARE'] ?? php_sapi_name(), "\n";
echo 'siteurl ', get_option('siteurl'), ' | home ', get_option('home'), ' | blog_public ', get_option('blog_public'), "\n";
$t = wp_get_theme();
echo 'theme ', $t->get('Name'), ' ', $t->get('Version'), $t->parent() ? ' (parent ' . $t->parent()->get('Name') . ' ' . $t->parent()->get('Version') . ')' : '', "\n";
$tot = disk_total_space(ABSPATH); $free = disk_free_space(ABSPATH);
echo 'disk ', round(100 - $free / $tot * 100), '% used, ', round($free / 1073741824, 1), " GB free\n";
echo 'DISALLOW_FILE_EDIT ', defined('DISALLOW_FILE_EDIT') && DISALLOW_FILE_EDIT ? 'yes' : 'NO',
     ' | WP_DEBUG ', WP_DEBUG ? 'ON' : 'off', ' | wp-config perms ', substr(sprintf('%o', fileperms(ABSPATH . 'wp-config.php')), -4), "\n";

$h('Plugins (active first) — "update" = wp.org has a newer version; premium ones may not show');
delete_site_transient('update_plugins'); wp_update_plugins();
$upd = get_site_transient('update_plugins');
$active = (array) get_option('active_plugins');
if (count($active) !== count(array_unique($active))) { echo "!! active_plugins has DUPLICATES\n"; }
$all = get_plugins();
uksort($all, function ($a, $b) use ($active) { return in_array($b, $active) <=> in_array($a, $active) ?: strcmp($a, $b); });
foreach ($all as $file => $d) {
    $new = $upd->response[$file]->new_version ?? '';
    $req = trim(($d['Elementor tested up to'] ?? '') . ' ' . ($d['Requires Plugins'] ?? ''));
    printf("%-8s %-45s %-10s %s%s\n", in_array($file, $active) ? 'ACTIVE' : 'inactive', dirname($file) ?: $file, $d['Version'],
        $new ? "-> $new" : '', $req ? "  [$req]" : '');
}
echo 'mu-plugins: ', implode(', ', array_keys(get_mu_plugins())) ?: 'none', "\n";
echo 'drop-ins: ', implode(', ', array_keys(get_dropins())) ?: 'none', "\n";

$h('Users with admin-level capabilities');
foreach (get_users(['capability' => 'manage_options']) as $u) {
    echo $u->ID, ' ', $u->user_login, ' <', $u->user_email, '> ', implode(',', $u->roles), ' registered ', $u->user_registered, "\n";
}
echo 'users_can_register ', get_option('users_can_register'), ' | default_role ', get_option('default_role'), "\n";
echo "login 'admin' exists: ", username_exists('admin') ? 'YES (bot target)' : 'no', "\n";

$h('Archives / backups / dumps / logs in the web root, with the HTTP status a stranger gets (200/206 = DOWNLOADABLE)');
$found = $sh('find ' . escapeshellarg(ABSPATH) . ' -maxdepth 7 -type f \( -iname "*.wpress" -o -iname "*.sql" -o -iname "*.sql.gz" -o -iname "*.zip" -o -iname "*.tar" -o -iname "*.tar.gz" -o -iname "*.tgz" -o -iname "*.bak" -o -iname "*.old" -o -iname "*.log" -o -iname "*.csv" -o -iname "*.xlsx" -o -name ".env" \) -size +0 -not -path "*/node_modules/*" -printf "%s\t%TY-%Tm-%Td\t%p\n" | sort -rn | head -60');
foreach (array_filter(explode("\n", $found)) as $line) {
    list($size, $date, $path) = explode("\t", $line);
    $r = wp_remote_get(home_url('/' . ltrim($short($path), '/')), ['timeout' => 15, 'redirection' => 0, 'sslverify' => false,
        'headers' => ['Range' => 'bytes=0-99'], 'limit_response_size' => 100]);
    $code = is_wp_error($r) ? 'ERR' : wp_remote_retrieve_response_code($r);
    printf("%s %-4s %8s KB  %s  %s\n", in_array($code, [200, 206]) ? '!!' : '  ', $code, number_format($size / 1024), $date, $short($path));
}

$h('PHP in uploads (non-empty) — never legitimate');
$bad = [];
foreach (array_filter(explode("\n", $sh('find ' . escapeshellarg(WP_CONTENT_DIR . '/uploads') . ' -type f \( -iname "*.php*" -o -iname "*.phtml" -o -iname "*.phar" \) | head -200'))) as $p) {
    $c = (string) @file_get_contents($p, false, null, 0, 200);
    if (!preg_match('/^\s*(<\?php\s*(\/\/[^\n]*)?\s*)?$/i', $c)) { $bad[] = $short($p); }   // skip empty "silence is golden" placeholders
}
echo $bad ? implode("\n", $bad) : 'none', "\n";

$h('Custom code: unauthenticated AJAX handlers (wp_ajax_nopriv_) in the child theme + mu-plugins — read each one');
$custom = array_unique([get_stylesheet_directory(), WPMU_PLUGIN_DIR]);
echo $sh('grep -rn --include=*.php "^[^/]*wp_ajax_nopriv_" ' . implode(' ', array_map('escapeshellarg', $custom)) . ' | grep -v "\.bak" | cut -c1-200 | head -40') ?: 'none', "\n";
if (get_template_directory() !== get_stylesheet_directory()) {
    echo '(parent theme registers ', $sh('grep -rn --include=*.php "wp_ajax_nopriv_" ' . escapeshellarg(get_template_directory()) . ' | wc -l'),
         " nopriv handlers — vendor code, covered by keeping the theme updated)\n";
}

$h('Custom code: theme PHP files that run when requested directly (no ABSPATH guard) and touch the DB or input');
foreach (array_unique([get_stylesheet_directory()]) as $root) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $f) {
        if (!preg_match('/\.php$/', $f)) { continue; }
        $c = (string) @file_get_contents($f);
        $guard = preg_match('/defined\(\s*[\'"]ABSPATH|current_user_can|is_user_logged_in|check_ajax_referer|wp_verify_nonce/', $c);
        $loads = preg_match('/wp-load\.php|wp-config\.php|new\s+PDO|mysqli_connect/', $c);
        $input = preg_match('/\$_(GET|POST|REQUEST)/', $c);
        if ($loads && !$guard) { echo 'DIRECT-RUN ', $input ? '+INPUT ' : '', $short($f), "\n"; }
    }
}

$h('Custom code: hardcoded credentials / dangerous calls in the child theme');
echo $sh('grep -rnE --include=*.php "(password|passwd|pwd|secret|api_key)\s*[=>]+\s*[\'\"][^\'\"]{4,}|new PDO\(|eval\(|base64_decode\(|gzinflate\(|assert\(" ' . escapeshellarg(get_stylesheet_directory()) . ' | grep -v "\.bak" | cut -c1-120 | sed -E "s/([\x27\"])[^\x27\"]{4,}([\x27\"])/\1***\2/g" | head -30') ?: 'none', "\n";   // values masked: never paste secrets into notes/chat
echo 'backup copies beside theme files: ', $sh('find ' . escapeshellarg(get_stylesheet_directory()) . ' -name "*.bak*" -o -name "*.old" -o -name "*-copy*" | wc -l'), "\n";

$h('Heavy or risky hooks on every admin/page load (admin_init / init doing bulk writes)');
echo $sh('grep -rnE --include=*.php "add_action\(\s*[\'\"](admin_init|init|wp_loaded)[\'\"]" ' . escapeshellarg(get_stylesheet_directory()) . ' | head -30') ?: 'none', "\n";

$h('Public endpoints (logged-out view)');
foreach (['wp-json/wp/v2/users', '?author=1', 'xmlrpc.php', 'readme.html', 'wp-content/debug.log', 'robots.txt', 'sitemap_index.xml', 'wp-sitemap.xml'] as $p) {
    $r = wp_remote_get(home_url('/' . $p), ['timeout' => 20, 'redirection' => 0, 'sslverify' => false]);
    echo str_pad(is_wp_error($r) ? 'ERR' : wp_remote_retrieve_response_code($r), 5), $p, "\n";
}

$h('Cron: web-user crontab + overdue WP-Cron events');
echo preg_replace('/(pass\w*|pwd|token|key)=\S+/i', '$1=***', $sh('crontab -l | grep -v "^#" | cut -c1-160')), "\n";
echo "(check each job actually RUNS: compare its log/data timestamps with the schedule; a '>> file' the user can't write silently skips the job)\n";
$late = 0; foreach ((array) _get_cron_array() as $ts => $ev) { if ($ts < time() - 3600) { $late += count($ev); } }
echo "WP-Cron events overdue >1h: $late | DISABLE_WP_CRON ", defined('DISABLE_WP_CRON') && DISABLE_WP_CRON ? 'yes' : 'no', "\n";

$h('Site e-mail health (last 14 days, if an SMTP log plugin exists)');
foreach (['fsmpt_email_logs' => 'status', 'wpml_mails' => null, 'wpmailsmtp_emails_log' => 'status'] as $tbl => $col) {
    $t = $wpdb->prefix . $tbl;
    if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $t)) !== $t) { continue; }
    echo $tbl, ': ', $col ? json_encode($wpdb->get_results("SELECT $col, COUNT(*) n FROM $t WHERE created_at > NOW() - INTERVAL 14 DAY GROUP BY $col")) : $wpdb->get_var("SELECT COUNT(*) FROM $t"), "\n";
}

$h('Security plugins present');
foreach (['wordfence', 'wordfence-login-security', 'better-wp-security', 'all-in-one-wp-security-and-firewall', 'sucuri-scanner', 'two-factor', 'limit-login-attempts-reloaded'] as $s) {
    if (is_dir(WP_PLUGIN_DIR . "/$s")) { echo $s, is_plugin_active("$s/$s.php") ? ' (active)' : ' (present)', "\n"; }
}
echo "\n== end of audit (read-only, nothing changed)\n";
