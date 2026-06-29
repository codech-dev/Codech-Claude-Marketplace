#!/usr/bin/env node
// Source topical stock images locally (honors the "images local, no hotlink" rule).
// Usage: node fetch-images.mjs <queries.json> <outDir>
//   queries.json: [{ "slug": "hero", "query": "indoor plants living room", "orientation": "landscape" }, ...]
// Provider priority (first available wins):
//   PEXELS_API_KEY      -> Pexels      (highest quality)
//   UNSPLASH_ACCESS_KEY -> Unsplash
//   (neither)           -> Openverse   (CC-licensed, no key, topical-but-amateur)
// Writes <outDir>/<slug>.<ext> and <outDir>/credits.json (file/role/alt/source/license/attribution/sourceUrl).
import { mkdir, writeFile } from 'node:fs/promises';

const [queriesPath, outDir] = process.argv.slice(2);
if (!queriesPath || !outDir) {
  console.error('Usage: node fetch-images.mjs <queries.json> <outDir>');
  process.exit(1);
}

const { readFile } = await import('node:fs/promises');
const jobs = JSON.parse(await readFile(queriesPath, 'utf8'));
const UA = 'codech-web-builder/0.1 (team@codech.dev)';
const PEXELS = process.env.PEXELS_API_KEY;
const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY;
const provider = PEXELS ? 'pexels' : UNSPLASH ? 'unsplash' : 'openverse';
console.log(`Image provider: ${provider}`);

await mkdir(outDir, { recursive: true });
const credits = [];

async function download(url, slug) {
  const img = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!img.ok) return null;
  const ct = img.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) return null;
  const buf = Buffer.from(await img.arrayBuffer());
  if (buf.length < 8000) return null;
  const ext = ct.includes('png') ? 'png' : 'jpg';
  const file = `${slug}.${ext}`;
  await writeFile(`${outDir}/${file}`, buf);
  return { file, kb: (buf.length / 1024) | 0 };
}

async function viaPexels({ slug, query, orientation = 'landscape' }) {
  const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`;
  const r = await fetch(u, { headers: { Authorization: PEXELS } });
  const j = await r.json();
  const p = j.photos && j.photos[0];
  if (!p) return null;
  const d = await download(p.src.large2x || p.src.large, slug);
  if (!d) return null;
  return { ...d, source: 'Pexels', license: 'Pexels License', attribution: `Photo by ${p.photographer}`, sourceUrl: p.url };
}

async function viaUnsplash({ slug, query, orientation = 'landscape' }) {
  const u = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`;
  const r = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  const j = await r.json();
  const p = j.results && j.results[0];
  if (!p) return null;
  const d = await download(p.urls.regular, slug);
  if (!d) return null;
  return { ...d, source: 'Unsplash', license: 'Unsplash License', attribution: `Photo by ${p.user.name}`, sourceUrl: p.links.html };
}

async function viaOpenverse({ slug, query }) {
  const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=8&license_type=commercial&mature=false`;
  const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  const j = await r.json();
  for (const res of (j.results || [])) {
    if (!res.url) continue;
    const d = await download(res.url, slug);
    if (!d) continue;
    return { ...d, source: 'Openverse', license: `${res.license} ${res.license_version || ''}`.trim(),
      attribution: `${res.title || 'Untitled'} by ${res.creator || 'Unknown'}`, sourceUrl: res.foreign_landing_url || res.url };
  }
  return null;
}

const fn = provider === 'pexels' ? viaPexels : provider === 'unsplash' ? viaUnsplash : viaOpenverse;

for (const job of jobs) {
  try {
    const out = await fn(job);
    if (out) {
      credits.push({ file: out.file, role: 'image', alt: job.query, source: out.source,
        license: out.license, attribution: out.attribution, sourceUrl: out.sourceUrl });
      console.log(`OK   ${job.slug} <- ${out.file} (${out.kb}KB) [${out.license}]`);
    } else {
      console.log(`MISS ${job.slug} (no downloadable result)`);
    }
  } catch (e) {
    console.log(`ERR  ${job.slug}: ${e.message}`);
  }
}

await writeFile(`${outDir}/credits.json`, JSON.stringify(credits, null, 2));
console.log(`\nDownloaded ${credits.length}/${jobs.length}. Credits -> ${outDir}/credits.json`);
