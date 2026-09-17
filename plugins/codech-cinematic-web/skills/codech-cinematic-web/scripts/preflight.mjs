#!/usr/bin/env node
/** preflight.mjs - check tooling before starting. Exits 1 if a REQUIRED item
 *  is missing, so a pipeline can stop before doing half the work. */
import { execSync } from 'node:child_process';

const check = (label, cmd, required, fix) => {
  try {
    const v = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim().split('\n')[0];
    console.log(`  OK       ${label.padEnd(22)} ${v.slice(0, 48)}`);
    return true;
  } catch {
    console.log(`  ${required ? 'MISSING ' : 'optional'} ${label.padEnd(22)} ${fix}`);
    return !required;
  }
};

console.log('codech-cinematic-web preflight\n');
const r = [
  check('node', 'node -v', true, 'install Node 18+'),
  check('python3', 'python3 -V', true, 'install Python 3'),
  check('numpy + Pillow', 'python3 -c "import numpy,PIL;print(numpy.__version__)"',
        true, 'pip install numpy Pillow'),
  check('playwright', 'node -e "import(\'playwright\').then(()=>console.log(\'ok\'))"',
        false, 'npm i -D playwright && npx playwright install chromium'),
  check('pngjs', 'node -e "import(\'pngjs\').then(()=>console.log(\'ok\'))"',
        false, 'npm i -D pngjs   (needed by verify_render.mjs)'),
  check('ffmpeg', 'ffmpeg -version', false, 'brew install ffmpeg (video work only)'),
  check('ffprobe', 'ffprobe -version', false, 'ships with ffmpeg')
];

console.log(r.every(Boolean)
  ? '\nREADY - required tooling present.'
  : '\nBLOCKED - install the MISSING items above before continuing.');
process.exit(r.every(Boolean) ? 0 : 1);
