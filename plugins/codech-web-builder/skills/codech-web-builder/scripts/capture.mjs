#!/usr/bin/env node
// Usage: node capture.mjs <url> <outDir>
// Captures desktop + mobile screenshots and rendered DOM of a reference page.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [url, outDir] = process.argv.slice(2);
if (!url || !outDir) {
  console.error('Usage: node capture.mjs <url> <outDir>');
  process.exit(1);
}

// Imported after arg validation so the usage message works without Playwright.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright not installed. Run: npm i -g playwright && npx playwright install chromium');
  process.exit(2);
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, viewport] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
    if (name === 'desktop') {
      const dom = await page.content();
      await writeFile(path.join(outDir, 'dom.html'), dom, 'utf8');
    }
    await ctx.close();
  }
  console.log(`Captured ${url} -> ${outDir} (desktop.png, mobile.png, dom.html)`);
} finally {
  await browser.close();
}
