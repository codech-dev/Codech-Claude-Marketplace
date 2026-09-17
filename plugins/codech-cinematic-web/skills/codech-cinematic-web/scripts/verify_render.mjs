#!/usr/bin/env node
/**
 * verify_render.mjs --url <url> [checks...]
 *
 * The checks that catch what looking at the page in one browser does not.
 * Every one of these corresponds to a bug that shipped in a real engagement.
 *
 *   --layout    composition at every breakpoint; crest-to-headline clearance
 *   --rim       peak rim colour per size/DPR; must be size independent
 *   --profile   angular-median luminance into the rim; must not band
 *   --hover     cursor interaction falloff
 *   --novideo   every panel must survive with all video blocked
 *   --all       all of the above
 *
 *   --bare      hide CSS scrims/copy before sampling (isolates the shader)
 *   --selector  hero card selector            (default #heroCard)
 *   --canvas    canvas selector               (default #heroCanvas)
 *   --title     headline selector    (default .hero__title, #heroTitle, h1)
 *   --out       screenshot directory          (default ./verify-out)
 *
 * Needs: npm i -D playwright  &&  npx playwright install chromium
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1] : d;
};
const has = (k) => process.argv.includes(k) || process.argv.includes('--all');

const URL      = arg('--url', 'http://localhost:8080/index.html');
const CARD     = arg('--selector', '#heroCard');
const CANVAS   = arg('--canvas', '#heroCanvas');
const TITLE    = arg('--title', '.hero__title, #heroTitle, .hero__card h1, h1');
const OUT      = arg('--out', './verify-out');
const BARE     = process.argv.includes('--bare');

const SIZES = [[390, 844], [1440, 900], [1920, 1080], [2560, 1440]];
mkdirSync(OUT, { recursive: true });

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function readPNG(buf) {
  const p = PNG.sync.read(buf);
  return { w: p.width, h: p.height, at(x, y) {
    const i = (p.width * Math.round(y) + Math.round(x)) << 2;
    return [p.data[i], p.data[i + 1], p.data[i + 2]];
  }};
}

/** Geometry read back FROM THE PAGE, never re-derived from our own formula. */
async function geometry(page) {
  return page.evaluate(([cardSel, titleSel]) => {
    const card = document.querySelector(cardSel);
    if (!card) return null;
    const cb = card.getBoundingClientRect();
    // querySelector with a comma list returns the first match in DOM order,
    // which may be outside the card; prefer one inside it.
    const t = card.querySelector(titleSel) || document.querySelector(titleSel);
    const crestRaw = getComputedStyle(card).getPropertyValue('--crest-y').trim();
    const crest = parseFloat(crestRaw);
    return {
      cardW: Math.round(cb.width), cardH: Math.round(cb.height),
      pctViewport: Math.round(cb.height / window.innerHeight * 100),
      crestY: Number.isFinite(crest) ? Math.round(crest) : null,
      headlineTop: t ? Math.round(t.getBoundingClientRect().top - cb.top) : null,
      clearance: (t && Number.isFinite(crest))
        ? Math.round(t.getBoundingClientRect().top - cb.top - crest) : null,
      dpr: window.devicePixelRatio
    };
  }, [CARD, TITLE]);
}

async function hideOverlays(page) {
  await page.evaluate(() => {
    for (const s of ['.herofx__falloff', '.herofx__grid', '.herofx__fallback',
                     '.hero__inner', '.jurbar']) {
      const el = document.querySelector(s);
      if (el) { el.style.opacity = '0'; el.style.visibility = 'hidden'; }
    }
  });
}

async function shot(browser, w, h, dpr, tag, { bare = false, block = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: dpr,
    isMobile: w < 700, hasTouch: w < 700
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text()); });
  if (block) await page.route('**/*.mp4', r => r.abort());
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(4200);              // entrance + first frames
  if (bare) { await hideOverlays(page); await page.waitForTimeout(500); }
  const geom = await geometry(page);
  const el = await page.$(CARD);
  const buf = el ? await el.screenshot() : await page.screenshot();
  writeFileSync(`${OUT}/${tag}.png`, buf);
  return { page, ctx, geom, buf, errors };
}

/* ---------------------------------------------------------------- layout */
async function checkLayout(browser) {
  console.log('\n=== COMPOSITION ===');
  console.log('size        dpr  cardH  %vp  crestY  headTop  clearance  errors');
  let pass = true;
  for (const dpr of [1, 2]) for (const [w, h] of SIZES) {
    const { ctx, geom, errors } = await shot(browser, w, h, dpr, `layout_${w}x${h}@${dpr}`);
    const desktop = w >= 1024;
    const ok = !desktop || geom?.clearance == null || geom.clearance >= 60;
    if (!ok || errors.length) pass = false;
    console.log(
      `${String(w + 'x' + h).padEnd(11)} ${dpr}   ` +
      `${String(geom?.cardH ?? '-').padStart(5)} ` +
      `${String(geom?.pctViewport ?? '-').padStart(4)} ` +
      `${String(geom?.crestY ?? '-').padStart(7)} ` +
      `${String(geom?.headlineTop ?? '-').padStart(8)} ` +
      `${String(geom?.clearance ?? '-').padStart(10)}  ` +
      `${errors.length ? 'ERR ' + errors[0].slice(0, 40) : 'none'}` +
      `${desktop && !ok ? '   <-- FAIL (<60px)' : ''}`);
    await ctx.close();
  }
  console.log(pass ? 'PASS' : 'FAIL - desktop clearance must be >= 60px, console must be clean');
  return pass;
}

/* ------------------------------------------------------------------- rim */
async function checkRim(browser) {
  console.log('\n=== RIM COLOUR (row median, middle 20% of columns) ===');
  const rows = [];
  for (const dpr of [1, 2]) for (const [w, h] of SIZES) {
    const { ctx, geom, buf } = await shot(browser, w, h, dpr,
      `rim_${w}x${h}@${dpr}`, { bare: BARE });
    if (geom?.crestY == null) { await ctx.close(); continue; }
    const img = readPNG(buf);
    const y0 = geom.crestY * dpr;
    let best = null;
    for (let y = Math.max(0, y0 - 26); y < Math.min(img.h, y0 + 26); y++) {
      const vals = [];
      for (let x = Math.floor(img.w * 0.40); x < img.w * 0.60; x++) {
        const [r, g, b] = img.at(x, y); vals.push(lum(r, g, b));
      }
      vals.sort((a, b) => a - b);
      const med = vals[vals.length >> 1];
      if (!best || med > best.med) best = { y, med };
    }
    rows.push({ tag: `${w}x${h}@${dpr}`, lum: best.med });
    await ctx.close();
  }
  if (!rows.length) { console.log('no --crest-y published; cannot sample'); return false; }
  const base = rows[0].lum;
  let pass = true;
  for (const r of rows) {
    const d = (r.lum - base) / base * 100;
    const ok = Math.abs(d) <= 10; if (!ok) pass = false;
    console.log(`  ${ok ? 'PASS' : 'FAIL'} ${r.tag.padEnd(14)} lum ${r.lum.toFixed(1).padStart(6)}  ${d >= 0 ? '+' : ''}${d.toFixed(1)}%`);
  }
  console.log(pass ? 'PASS - size independent' :
    'FAIL - check CSS overlays over the crest FIRST, then glow-width constants');
  return pass;
}

/* --------------------------------------------------------------- profile */
async function checkProfile(browser) {
  console.log('\n=== GLOW PROFILE (angular median, +/-12 deg fan) ===');
  const { ctx, geom, buf } = await shot(browser, 1440, 900, 1, 'profile', { bare: true });
  if (geom?.crestY == null) { await ctx.close(); console.log('no --crest-y'); return false; }
  const img = readPNG(buf);
  const R = geom.cardH - geom.crestY > 0 ? (geom.cardH - geom.crestY) : geom.cardW * 0.42;
  const cx = img.w / 2, cy = geom.crestY + R;
  let pass = true;

  for (const [name, ctr] of [['crest', 0], ['flank 45', 45], ['flank 70', 70]]) {
    const rows = [];
    for (let d = Math.round(R) + 200; d > R + 24; d -= 4) {
      const vals = [];
      for (let k = -12; k <= 12; k += 1) {
        const a = (ctr + k) * Math.PI / 180;
        const x = cx + Math.sin(a) * d, y = cy - Math.cos(a) * d;
        if (x < 1 || y < 1 || x >= img.w - 1 || y >= img.h - 1) continue;
        const [r, g, b] = img.at(x, y); vals.push(lum(r, g, b));
      }
      if (vals.length > 12) {
        vals.sort((p, q) => p - q);
        rows.push([d - R, vals[vals.length >> 1]]);
      }
    }
    if (rows.length < 8) { console.log(`  ${name}: too few samples`); continue; }
    const v = rows.map(r => r[1]);
    const dv = v.slice(1).map((x, i) => x - v[i]);
    const flips = dv.slice(1).map((x, i) => [rows[i + 1][0], dv[i], x])
      .filter(([, a, b]) => a * b < 0 && Math.max(Math.abs(a), Math.abs(b)) > 0.8);
    const maxStep = Math.max(...dv.map(Math.abs));
    const ok = flips.length === 0; if (!ok) pass = false;
    console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name.padEnd(9)} range ${Math.min(...v).toFixed(1)}..${Math.max(...v).toFixed(1)}  max step ${maxStep.toFixed(2)}  band edges: ${flips.length || 'NONE'}`);
  }
  await ctx.close();
  console.log(pass ? 'PASS - no band edges' :
    'FAIL - stacked fresnel shells produce exactly this; use one analytic pass');
  return pass;
}

/* ----------------------------------------------------------------- hover */
async function checkHover(browser) {
  console.log('\n=== CURSOR INTERACTION ===');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const el = await page.$(CARD);
  if (!el) { await ctx.close(); console.log('card not found'); return false; }
  const b = await el.boundingBox();
  const px = b.x + b.width * 0.78, py = b.y + b.height * 0.72;
  await page.mouse.move(px - 300, py); await page.waitForTimeout(500);
  const before = readPNG(await el.screenshot());
  await page.mouse.move(px, py, { steps: 12 }); await page.waitForTimeout(450);
  const after = readPNG(await el.screenshot());

  const cx = px - b.x, cy = py - b.y;
  const bins = [0, 60, 120, 180, 240, 300];
  const sums = bins.map(() => ({ s: 0, n: 0 }));
  let far = { s: 0, n: 0 };
  for (let y = 0; y < before.h; y += 2) for (let x = 0; x < before.w; x += 2) {
    const [r1, g1, b1] = before.at(x, y), [r2, g2, b2] = after.at(x, y);
    const d = lum(r2, g2, b2) - lum(r1, g1, b1);
    const dist = Math.hypot(x - cx, y - cy);
    if (dist > 500) { far.s += d; far.n++; continue; }
    for (let i = bins.length - 1; i >= 0; i--) {
      if (dist >= bins[i]) { sums[i].s += d; sums[i].n++; break; }
    }
  }
  const baseline = far.n ? far.s / far.n : 0;
  console.log(`  far-field baseline (rotation only): ${baseline >= 0 ? '+' : ''}${baseline.toFixed(2)}`);
  sums.forEach((s, i) => {
    const m = s.n ? s.s / s.n : 0;
    console.log(`  ${String(bins[i]).padStart(3)}-${String(bins[i + 1] ?? '...').padEnd(3)}px  ${m >= 0 ? '+' : ''}${m.toFixed(2)}`);
  });
  const near = sums[0].n ? sums[0].s / sums[0].n : 0;
  const pass = near > Math.abs(baseline) + 2;
  console.log(pass ? 'PASS - localised brightening at the cursor'
                   : 'FAIL - no measurable hover response');
  await ctx.close();
  return pass;
}

/* --------------------------------------------------------------- novideo */
async function checkNoVideo(browser) {
  console.log('\n=== FALLBACK WITH ALL VIDEO BLOCKED ===');
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.route('**/*.mp4', r => r.abort());
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    const s = document.querySelector('#entities') || document.querySelector('.svc-scroller');
    if (s) s.scrollIntoView();
  });
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(3500);
  writeFileSync(`${OUT}/novideo.png`, await page.screenshot());
  const st = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('.svc-bg__pair')]
      .filter(p => getComputedStyle(p).display !== 'none');
    return vis.map(p => {
      const slot = p.closest('.svc-bg__slot');
      const plate = p.querySelector('.svc-bg__plate');
      return {
        slot: slot?.getAttribute('data-slot'),
        slotOpacity: slot ? +getComputedStyle(slot).opacity : 0,
        plateOpacity: plate ? +getComputedStyle(plate).opacity : null
      };
    }).filter(r => r.slotOpacity > 0.01);
  });
  const live = st.filter(r => r.plateOpacity !== null);
  const pass = live.length > 0 && live.every(r => r.plateOpacity > 0.5);
  console.log(live.length ? JSON.stringify(live) : '  no visible panel found');
  console.log(pass ? 'PASS - poster visible with video blocked'
                   : 'FAIL - a panel is empty when video cannot load; add poster plates');
  await ctx.close();
  return pass;
}

/* ------------------------------------------------------------------ main */
const browser = await chromium.launch();
const any = ['--layout', '--rim', '--profile', '--hover', '--novideo', '--all']
  .some(f => process.argv.includes(f));
const results = [];
try {
  if (has('--layout')  || !any) results.push(['layout',  await checkLayout(browser)]);
  if (has('--rim'))              results.push(['rim',     await checkRim(browser)]);
  if (has('--profile'))          results.push(['profile', await checkProfile(browser)]);
  if (has('--hover'))            results.push(['hover',   await checkHover(browser)]);
  if (has('--novideo'))          results.push(['novideo', await checkNoVideo(browser)]);
} finally {
  await browser.close();
}
console.log('\n=== SUMMARY ===');
for (const [n, ok] of results) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${n}`);
console.log(`screenshots in ${OUT}`);
process.exit(results.every(([, ok]) => ok) ? 0 : 1);
