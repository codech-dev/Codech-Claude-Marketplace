// Cloudflare Pages middleware — generated from middleware.template.js by protect-build.mjs.
// Expiry page, direct-prototype block, visit tracking (D1 binding "DB") and a private dashboard at /_stats.
const EXPIRES = __EXPIRES__;
const REF = __REF__;
const SITE = __SITE__;
const SITES = __SITES__;          // { projectName: { url, name } }
const PAGES = __PAGES__;          // top-level paths that count as a visit
const EXPIRED_HTML = __EXPIRED_HTML__;
const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp\/|telegram|slack|linkedin|discord|skype|curl|wget|python|headless|lighthouse/i;
const TZ = __TZ__;                // dashboard display timezone
const HKT = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });

export async function onRequest(ctx) {
  const { request, env, next } = ctx;
  const url = new URL(request.url);
  const path = url.pathname.replace(/index\.html$/, '');
  const cookies = parseCookies(request.headers.get('cookie'));

  if (path === '/_t' && request.method === 'POST') return beacon(request, env);
  if (path === '/_stats' || path === '/_stats/') return stats(request, env, url, cookies);

  const expired = Date.now() > EXPIRES;
  const dest = request.headers.get('sec-fetch-dest');
  const isPage = request.method === 'GET' && PAGES.includes(path) && (dest === 'document' || !dest);
  const setCookies = [];
  let visitId = null;

  if (isPage && !cookies.cdx_me && env.DB) {
    const ua = request.headers.get('user-agent') || '';
    const isBot = !ua || BOT.test(ua) || /cloudflare|amazon|google llc|microsoft corp|digitalocean/i.test((request.cf || {}).asOrganization || '');
    const token = (url.searchParams.get('r') || cookies.cdx_r || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
    let vid = cookies.cdx_v;
    if (!isBot) {
      visitId = crypto.randomUUID();
      if (!vid) { vid = crypto.randomUUID().slice(0, 12); setCookies.push(cookie('cdx_v', vid, 31536000)); }
      if (url.searchParams.get('r')) setCookies.push(cookie('cdx_r', token, 2592000));
    }
    const cf = request.cf || {};
    ctx.waitUntil(env.DB.prepare(
      'INSERT INTO visits (id, ts, site, path, token, vid, ip, country, city, org, ua, device, referer, expired) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    ).bind(visitId || crypto.randomUUID(), Date.now(), SITE, path, token, isBot ? 'bot' : vid, request.headers.get('cf-connecting-ip') || '',
      cf.country || '', cf.city || '', cf.asOrganization || '', ua.slice(0, 300), device(ua), (request.headers.get('referer') || '').slice(0, 200), expired ? 1 : 0
    ).run().catch(() => {}));
  }

  if (expired && path !== '/favicon.png') {
    return withCookies(new Response(EXPIRED_HTML, { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } }), setCookies);
  }
  // Prototype pages only load inside the showcase frames; opening them directly in a tab goes home.
  if (path.startsWith('/prototype/') && dest === 'document') return Response.redirect(new URL('/', url).toString(), 302);

  let req = request;
  if (visitId) { const h = new Headers(request.headers); h.delete('if-none-match'); h.delete('if-modified-since'); req = new Request(request, { headers: h }); }
  const upstream = await next(req);
  const res = withCookies(new Response(upstream.body, upstream), setCookies);
  res.headers.set('x-cdx-ref', REF);
  if (visitId && (res.headers.get('content-type') || '').includes('text/html')) {
    res.headers.set('cache-control', 'no-store');
    return new HTMLRewriter().on('head', { element(e) { e.append(`<meta name="cdx-visit" content="${visitId}">`, { html: true }); } }).transform(res);
  }
  return res;
}

async function beacon(request, env) {
  try {
    const d = JSON.parse(await request.text());
    if (env.DB && /^[0-9a-f-]{36}$/.test(d.v)) {
      await env.DB.prepare('UPDATE visits SET seconds = MAX(seconds, ?), scroll = MAX(scroll, ?), sections = ? WHERE id = ?')
        .bind(Math.min(86400, d.s | 0), Math.min(100, d.sc | 0), String(d.sec || '').replace(/[^a-z0-9,_-]/gi, '').slice(0, 300), d.v).run();
    }
  } catch (_) {}
  return new Response(null, { status: 204 });
}

async function stats(request, env, url, cookies) {
  const key = url.searchParams.get('key') || cookies.cdx_key || '';
  const expected = String(env.STATS_KEY || '').trim();
  if (!expected || !env.DB || key !== expected) return new Response('Not found', { status: 404 });
  if (url.searchParams.get('key')) {
    // Remember the key, exclude this browser from tracking, and drop the key from the address bar.
    return new Response(null, { status: 302, headers: [['location', '/_stats'], ['set-cookie', cookie('cdx_key', key, 7776000, '/_stats')], ['set-cookie', cookie('cdx_me', '1', 31536000)]] });
  }
  let created = null;
  if (request.method === 'POST') {
    const f = await request.formData();
    const label = String(f.get('label') || '').trim().slice(0, 80);
    const site = String(f.get('site') || '');
    if (f.get('delete')) await env.DB.prepare('DELETE FROM links WHERE token = ?').bind(String(f.get('delete'))).run();
    else if (label && SITES[site]) {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
      await env.DB.prepare('INSERT INTO links (token, label, site, created) VALUES (?,?,?,?)').bind(token, label, site, Date.now()).run();
      created = { label, url: SITES[site].url + '?r=' + token };
    }
  }
  const [links, summary, recent] = await Promise.all([
    env.DB.prepare('SELECT * FROM links ORDER BY created DESC').all(),
    env.DB.prepare(`SELECT token, site, COUNT(*) AS visits, COUNT(DISTINCT vid) AS devices, SUM(seconds) AS secs, MAX(scroll) AS scroll,
      MAX(ts) AS last, GROUP_CONCAT(DISTINCT city) AS cities, SUM(expired) AS after_expiry FROM visits WHERE vid != 'bot' GROUP BY token, site ORDER BY last DESC`).all(),
    env.DB.prepare('SELECT * FROM visits ORDER BY ts DESC LIMIT 200').all(),
  ]);
  const label = Object.fromEntries(links.results.map((l) => [l.token, l.label]));
  const who = (t) => (t ? (label[t] ? esc(label[t]) : `<span class="mut">unknown link ${esc(t)}</span>`) : '<span class="mut">No tracking link</span>');
  const siteName = (s) => esc(SITES[s]?.name || s);
  const dur = (s) => (!s ? '—' : s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
  const when = (ts) => HKT.format(new Date(ts));
  const previews = recent.results.filter((v) => v.vid === 'bot').length;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Proposal visits</title>
<style>body{margin:0;font:14px/1.5 system-ui,'Noto Sans HK',sans-serif;background:#F6F7FB;color:#14213D}main{max-width:1200px;margin:0 auto;padding:28px 18px 60px}h1{font-size:24px;margin:0}h2{font-size:16px;margin:32px 0 10px}
.mut{color:#6B7488}.card{background:#fff;border:1px solid #E5E8F0;border-radius:14px;padding:16px;overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#6B7488;padding:8px;border-bottom:1px solid #E5E8F0;white-space:nowrap}
td{padding:8px;border-bottom:1px solid #F0F2F7;vertical-align:top}tr.bot td{color:#8A93A6;background:#FAFBFD}.pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700}.hot{background:#FFE7E0;color:#B3361A}.warn{background:#FFF3CC;color:#7A5A00}
form{display:flex;flex-wrap:wrap;gap:8px;align-items:center}input,select{font:inherit;padding:9px 12px;border:1px solid #D5DAE5;border-radius:10px;min-width:220px}button{font:inherit;font-weight:700;padding:9px 16px;border-radius:10px;border:0;background:#2452E0;color:#fff;cursor:pointer}
.new{margin-top:12px;padding:12px;border-radius:10px;background:#E8F8F1;border:1px solid #BDEBD6}.new code{font-size:14px;user-select:all;word-break:break-all}.del{background:none;color:#B3361A;padding:0;font-weight:600}.stats{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}.stat{background:#fff;border:1px solid #E5E8F0;border-radius:12px;padding:10px 14px}.stat b{font-size:20px;display:block}</style></head><body><main>
<h1>Proposal visits</h1><p class="mut">Times in ${esc(TZ)}. This browser is excluded from tracking. Link previews (WhatsApp, Telegram…) mean the link was shared somewhere.</p>
<div class="stats"><div class="stat"><b>${summary.results.reduce((a, r) => a + r.visits, 0)}</b><span class="mut">visits</span></div><div class="stat"><b>${summary.results.reduce((a, r) => a + r.devices, 0)}</b><span class="mut">devices</span></div><div class="stat"><b>${dur(summary.results.reduce((a, r) => a + (r.secs || 0), 0))}</b><span class="mut">total reading time</span></div><div class="stat"><b>${previews}</b><span class="mut">link previews</span></div></div>

<h2>Create a tracked link</h2><div class="card"><form method="post"><input name="label" placeholder="Who is it for? e.g. Mr Chan (owner)" required maxlength="80"><select name="site">${Object.entries(SITES).map(([k, s]) => `<option value="${k}"${k === SITE ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</select><button>Create link</button></form>
${created ? `<div class="new">Link for <b>${esc(created.label)}</b>: <code>${esc(created.url)}</code></div>` : ''}</div>

<h2>By person</h2><div class="card"><table><tr><th>Person</th><th>Site</th><th>Visits</th><th>Devices</th><th>Reading time</th><th>Max scroll</th><th>Last seen</th><th>Cities</th><th></th></tr>
${summary.results.map((r) => `<tr><td><b>${who(r.token)}</b></td><td>${siteName(r.site)}</td><td>${r.visits}</td><td>${r.devices}${r.devices > 1 ? ' <span class="pill warn">forwarded?</span>' : ''}</td><td>${dur(r.secs)}</td><td>${r.scroll || 0}%</td><td>${when(r.last)}</td><td>${esc(r.cities || '')}</td><td>${r.after_expiry ? '<span class="pill hot">opened after expiry</span>' : ''}</td></tr>`).join('') || '<tr><td colspan="9" class="mut">No visits yet.</td></tr>'}</table></div>

<h2>Recent visits</h2><div class="card"><table><tr><th>Time</th><th>Person</th><th>Page</th><th>Location</th><th>Network</th><th>Device</th><th>Reading</th><th>Scroll</th><th>Sections seen</th></tr>
${recent.results.map((v) => `<tr class="${v.vid === 'bot' ? 'bot' : ''}"><td>${when(v.ts)}</td><td>${who(v.token)}</td><td>${siteName(v.site)} ${esc(v.path)}${v.expired ? ' <span class="pill hot">expired</span>' : ''}</td><td>${esc([v.city, v.country].filter(Boolean).join(', '))}</td><td>${esc(v.org || '')}</td><td>${esc(v.device || '')}</td><td>${dur(v.seconds)}</td><td>${v.scroll ? v.scroll + '%' : '—'}</td><td class="mut">${esc((v.sections || '').replace(/,/g, ', '))}</td></tr>`).join('') || '<tr><td colspan="9" class="mut">No visits yet.</td></tr>'}</table></div>

<h2>Tracked links</h2><div class="card"><table><tr><th>Person</th><th>Link</th><th>Created</th><th></th></tr>
${links.results.map((l) => `<tr><td>${esc(l.label)}</td><td><code>${esc((SITES[l.site]?.url || '') + '?r=' + l.token)}</code></td><td>${when(l.created)}</td><td><form method="post"><button class="del" name="delete" value="${esc(l.token)}">Remove</button></form></td></tr>`).join('') || '<tr><td colspan="4" class="mut">No links yet.</td></tr>'}</table></div>
</main></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } });
}

function device(ua) {
  if (!ua) return 'Automated check (no browser)';
  if (BOT.test(ua)) { const m = ua.match(/(WhatsApp|facebookexternalhit|TelegramBot|Slackbot|LinkedInBot|Twitterbot|Discordbot|Googlebot|bingbot|SkypeUriPreview)/i); return 'Link preview · ' + (m ? m[1] : 'bot'); }
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : 'Other';
  const br = /WhatsApp/.test(ua) ? 'WhatsApp in-app' : /FBAN|FBAV|Instagram/.test(ua) ? 'Meta in-app' : /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Browser';
  return os + ' · ' + br;
}
function parseCookies(h) { return Object.fromEntries((h || '').split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])); }
function cookie(name, value, maxAge, path = '/') { return `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`; }
function withCookies(res, list) { list.forEach((c) => res.headers.append('set-cookie', c)); return res; }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
