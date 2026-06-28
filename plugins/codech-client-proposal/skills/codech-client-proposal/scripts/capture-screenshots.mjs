#!/usr/bin/env node
/**
 * Capture prototype mockup screenshots from a proposal page.
 *
 * Usage:
 *   node capture-screenshots.mjs [URL] [--out=screenshots]
 *
 * Defaults:
 *   URL    = http://localhost:8765/index.html
 *   --out  = ./screenshots
 *
 * Prerequisites:
 *   npm install playwright   # if not already installed
 *   playwright install chromium
 *
 * Tag every mockup wrapper in your HTML with class="prototype-mockup"
 * before running this. Edit the LABELS array below to match your mockups
 * in DOM order.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// EDIT THIS: filenames in DOM order — one per .prototype-mockup element
const LABELS = [
  'module-01-workspace',
  'module-01-project',
  'module-02-assistant',
  'module-03-meetings',
  'module-03-meeting-detail',
  'module-04-knowledge',
];

const VIEWPORT = { width: 1280, height: 900 };

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--')) || 'http://localhost:8765/index.html';
const outArg = args.find(a => a.startsWith('--out='));
const outDir = resolve(outArg ? outArg.slice(6) : 'screenshots');

await mkdir(outDir, { recursive: true });

console.log(`→ launching chromium at ${VIEWPORT.width}×${VIEWPORT.height}`);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT });
const page = await ctx.newPage();

console.log(`→ navigating to ${url}`);
await page.goto(url, { waitUntil: 'networkidle' });

console.log('→ forcing settled state and tagging mockups');
await page.evaluate((labels) => {
  // Skip all anim-up gates
  document.querySelectorAll('.anim-up').forEach(el => el.classList.add('is-visible'));
  // Remove mobile-only tap hints if present
  document.querySelectorAll('.prototype-mockup-hint').forEach(el => el.remove());
  // Tag each mockup with a data attribute we can select by
  const mockups = document.querySelectorAll('.prototype-mockup');
  mockups.forEach((m, i) => {
    if (labels[i]) m.setAttribute('data-mockup', labels[i]);
  });
  return Array.from(mockups).map((m, i) => labels[i] || `unlabelled-${i}`);
}, LABELS);

// Wait a beat for any final layout settling
await page.waitForTimeout(300);

const mockupCount = await page.locator('.prototype-mockup').count();
console.log(`→ found ${mockupCount} mockup(s)`);

if (mockupCount > LABELS.length) {
  console.warn(`! ${mockupCount - LABELS.length} mockup(s) beyond LABELS array will be skipped`);
}

for (let i = 0; i < Math.min(mockupCount, LABELS.length); i++) {
  const label = LABELS[i];
  const file = resolve(outDir, `${label}.png`);
  const locator = page.locator(`[data-mockup="${label}"]`);
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await locator.screenshot({ path: file, scale: 'css', type: 'png' });
  console.log(`  ✓ ${label}.png`);
}

await browser.close();
console.log(`\n✨ done — ${Math.min(mockupCount, LABELS.length)} screenshots saved to ${outDir}`);
