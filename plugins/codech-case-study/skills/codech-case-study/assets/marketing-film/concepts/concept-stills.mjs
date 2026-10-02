// Mode C concept pitch: bundle once, render one still per concept composition.
// Copy into remotion/, register the compositions in Root.tsx, then: node concept-stills.mjs ../concepts [ids...] [--frame=45]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--')) ?? '../concepts';
const frame = Number((args.find((a) => a.startsWith('--frame=')) ?? '--frame=45').split('=')[1]);
let ids = args.filter((a) => a !== out && !a.startsWith('--'));
if (!ids.length) ids = ['VaultHero', 'VaultProduct', 'InkHero', 'InkProduct', 'CanvasHero', 'CanvasProduct'];
fs.mkdirSync(out, {recursive: true});
// junctioned node_modules (OneDrive): point at the real chrome-headless-shell
const browserExecutable = path.resolve('node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  await renderStill({serveUrl, composition, frame, output: path.join(out, id + '.jpg'), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  console.log(id);
}
