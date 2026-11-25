// Protected build for client-facing Cloudflare Pages deploys (codech-mockup-design, references/protected-share.md).
// Usage: node protect-build.mjs --src <assembled site dir> --out <dist site dir> --expires <ISO datetime>
//          [--ref CDX-ABC-DD-261124] [--site <pages project>] [--sites sites.json]
//          [--wa 60139473347] [--tz Asia/Kuala_Lumpur] [--about "the website preview link"]
// Output: <out>/public (static assets) + <out>/functions/_middleware.js
//         (expiry page, direct-prototype block, visit tracking, /_stats dashboard).
// Site layout it expects: index.html (+ other top-level pages) and an optional prototype/ folder whose pages
// load prototype/assets/tw.js (Tailwind config) + prototype/assets/site.css. Pages with an inline
// tailwind.config get their own <page>.styles.css.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import CleanCSS from 'clean-css';
import { minify } from 'html-minifier-terser';
import JavaScriptObfuscator from 'javascript-obfuscator';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, a) => (v.startsWith('--') ? [...acc, [v.slice(2), a[i + 1]]] : acc), []));
const SRC = path.resolve(args.src), OUT = path.resolve(args.out), PUB = path.join(OUT, 'public');
const REF = args.ref || 'CDX-UNSET', EXPIRES = args.expires, WA = (args.wa || '60139473347').replace(/\D/g, '');
const TZ = args.tz || 'Asia/Kuala_Lumpur', ABOUT = args.about || 'the website preview link';
if (!args.src || !args.out || !EXPIRES || isNaN(Date.parse(EXPIRES))) { console.error('need --src --out --expires <ISO>'); process.exit(1); }
const BANNER = `/*! © ${new Date().getFullYear()} Codech Solutions · Confidential prototype · Not licensed for reuse · ref ${REF} */`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, PUB, { recursive: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(PUB);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const jsFiles = files.filter((f) => f.endsWith('.js'));
const rel = (f) => path.relative(PUB, f).split(path.sep).join('/');
const html = Object.fromEntries(htmlFiles.map((f) => [f, fs.readFileSync(f, 'utf8')]));

const CDN = /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g;
const TWJS = /<script src="([^"]*?)tw\.js"><\/script>/;
const INLINE_CFG = /<script>(?:(?!<\/script>)[\s\S])*?tailwind\.config\s*=[\s\S]*?<\/script>/;
const evalConfig = (code) => { const sb = { tailwind: {} }; vm.runInNewContext(code, sb); return sb.tailwind.config; };

async function compile(config, rawContent, extraCss = '') {
  const cfg = { ...config, content: [{ raw: rawContent, extension: 'html' }] };
  // Same cascade as the Tailwind CDN: custom CSS sits before utilities so utility classes win.
  const input = '@tailwind base;@tailwind components;\n' + extraCss + '\n@tailwind utilities;';
  const out = await postcss([tailwind(cfg)]).process(input, { from: undefined });
  return BANNER + '\n' + new CleanCSS({ level: 1 }).minify(out.css).styles;
}

// --- Group 1: pages using prototype assets/tw.js (shared app.css) ---
const twPages = htmlFiles.filter((f) => TWJS.test(html[f]));
if (twPages.length) {
  const twFile = files.find((f) => rel(f).endsWith('prototype/assets/tw.js'));
  const siteCss = files.find((f) => rel(f).endsWith('prototype/assets/site.css'));
  const config = evalConfig(fs.readFileSync(twFile, 'utf8'));
  const raw = twPages.map((f) => html[f]).join('\n') + jsFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const css = await compile(config, raw, fs.readFileSync(siteCss, 'utf8'));
  fs.writeFileSync(path.join(path.dirname(twFile), 'app.css'), css);
  for (const f of twPages) {
    const prefix = html[f].match(TWJS)[1];
    html[f] = html[f].replace(TWJS, `<link rel="stylesheet" href="${prefix}app.css">`)
      .replace(new RegExp(`<link rel="stylesheet" href="${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}site\\.css">\\s*`), '');
  }
  fs.rmSync(twFile); fs.rmSync(siteCss);
  console.log(`app.css  ${Math.round(css.length / 1024)} KB  ← ${twPages.map(rel).join(', ')}`);
}

// --- Group 2: pages with their own inline tailwind.config ---
for (const f of htmlFiles.filter((f) => !TWJS.test(html[f]) && INLINE_CFG.test(html[f]))) {
  const block = html[f].match(INLINE_CFG)[0];
  const config = evalConfig(block.replace(/^<script>|<\/script>$/g, ''));
  const css = await compile(config, html[f]);
  const name = path.basename(f, '.html') + '.styles.css';
  fs.writeFileSync(path.join(path.dirname(f), name), css);
  html[f] = html[f].replace(block, `<link rel="stylesheet" href="${name}">`);
  console.log(`${name}  ${Math.round(css.length / 1024)} KB  ← ${rel(f)}`);
}

// --- Copyright meta, fingerprint, watermark, minify ---
// Reading-time / scroll / sections beacon for tracked pages (visit id is injected by the middleware).
const BEACON = `<script>(function(){var m=document.querySelector('meta[name="cdx-visit"]');if(!m||!navigator.sendBeacon)return;var v=m.content,vis=0,last=Date.now(),on=!document.hidden,mx=0,seen={};
function tick(){var n=Date.now();if(on)vis+=n-last;last=n}
function sc(){var h=document.documentElement,p=Math.round((h.scrollTop+innerHeight)/h.scrollHeight*100);if(p>mx)mx=Math.min(100,p)}
addEventListener('scroll',sc,{passive:true});sc();
if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)seen[e.target.id]=1})},{threshold:.3});document.querySelectorAll('section[id]').forEach(function(s){io.observe(s)})}
function send(){tick();navigator.sendBeacon('/_t',JSON.stringify({v:v,s:Math.round(vis/1000),sc:mx,sec:Object.keys(seen).join(',')}))}
document.addEventListener('visibilitychange',function(){tick();on=!document.hidden;if(!on)send()});addEventListener('pagehide',send);setInterval(function(){if(!document.hidden)send()},15000)})();</script>`;
const WATERMARK ='<div aria-hidden="true" style="position:fixed;left:12px;bottom:12px;z-index:60;pointer-events:none;user-select:none;font:600 11px/1 system-ui,sans-serif;letter-spacing:.04em;color:rgba(20,33,61,.55);background:rgba(255,255,255,.75);padding:6px 9px;border-radius:999px;border:1px solid rgba(20,33,61,.12)" class="cdx-wm">Prototype © Codech Solutions · Confidential</div><style>@media (max-width:767px){.cdx-wm{bottom:84px!important}}</style>';
for (const f of htmlFiles) {
  let h = html[f].replace(CDN, '');
  if (/(cdn\.tailwindcss|tw\.js)/.test(h)) throw new Error('Tailwind runtime still referenced in ' + rel(f));
  h = h.replace('<head>', `<head><meta name="copyright" content="© ${new Date().getFullYear()} Codech Solutions. Confidential prototype, not licensed for reuse."><meta name="x-cdx-ref" content="${REF}">`);
  if (rel(f).startsWith('prototype/')) h = h.replace('</body>', WATERMARK + '</body>');
  else h = h.replace('</body>', BEACON + '</body>');
  h = await minify(h, { collapseWhitespace: true, conservativeCollapse: true, removeComments: true, minifyCSS: true, minifyJS: true, removeRedundantAttributes: true, useShortDoctype: true });
  fs.writeFileSync(f, h);
}
console.log(`minified ${htmlFiles.length} HTML files`);

// --- Obfuscate JS ---
for (const f of jsFiles.filter((f) => fs.existsSync(f))) {
  const src = fs.readFileSync(f, 'utf8').replace(/\}\)\(\);\s*$/, `console.info('%c© Codech Solutions','font-weight:bold','— confidential prototype, ref ${REF}');\n})();`);
  const ob = JavaScriptObfuscator.obfuscate(src, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5, deadCodeInjection: true, deadCodeInjectionThreshold: 0.2, stringArray: true, stringArrayEncoding: ['base64'], stringArrayThreshold: 0.8, identifierNamesGenerator: 'hexadecimal', renameGlobals: false, selfDefending: false }).getObfuscatedCode();
  fs.writeFileSync(f, BANNER + '\n' + ob);
  console.log(`obfuscated ${rel(f)}`);
}

// --- Middleware: expiry + block direct opening of /prototype/ pages ---
const expired = `<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>預覽已過期 · Preview expired</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1F35;color:#fff;font-family:system-ui,'Noto Sans HK',sans-serif;padding:24px;text-align:center}h1{font-size:28px;margin:0 0 8px}p{color:rgba(255,255,255,.7);line-height:1.7;margin:0 0 24px}a{display:inline-flex;gap:8px;align-items:center;background:#25D366;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px}small{display:block;margin-top:18px;color:rgba(255,255,255,.5)}</style></head><body><main><h1>此預覽連結已過期</h1><p>如需延長查看期限，歡迎聯絡我哋申請延期。<br>This preview link has expired. Contact us to request an extension.</p><a href="https://wa.me/${WA}?text=${encodeURIComponent(`Hi Codech，我想申請延長預覽連結嘅查看期限。Hi Codech, I would like to request an extension for ${ABOUT}.`)}">WhatsApp 申請延期 · Request extension</a><small>Codech Solutions · codech.co · codech.co@gmail.com · +${WA.replace(/^(\d{2})(\d{2})(\d{3})(\d+)$/, '$1 $2-$3 $4')}</small></main></body></html>`;
// Tracked pages = every non-prototype HTML page, as served paths ("/", "/design/").
const trackedPaths = htmlFiles.map(rel).filter((r) => !r.startsWith('prototype/')).map((r) => '/' + r.replace(/index\.html$/, '').replace(/\.html$/, ''));
const sites = args.sites ? JSON.parse(fs.readFileSync(path.resolve(args.sites), 'utf8')) : {};
const template = fs.readFileSync(new URL('./middleware.template.js', import.meta.url), 'utf8');
const middleware = template
  .replace('__EXPIRES__', `${Date.parse(EXPIRES)} /* ${new Date(Date.parse(EXPIRES)).toISOString()} */`)
  .replace('__REF__', JSON.stringify(REF))
  .replace('__SITE__', JSON.stringify(args.site || ''))
  .replace('__SITES__', JSON.stringify(sites))
  .replace('__TZ__', JSON.stringify(TZ))
  .replace('__PAGES__', JSON.stringify(trackedPaths))
  .replace('__EXPIRED_HTML__', () => JSON.stringify(expired));
fs.mkdirSync(path.join(OUT, 'functions'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'functions', '_middleware.js'), middleware);
console.log(`middleware: expires ${new Date(Date.parse(EXPIRES)).toISOString()}, ref ${REF}, tracking ${trackedPaths.join(' ')}`);
