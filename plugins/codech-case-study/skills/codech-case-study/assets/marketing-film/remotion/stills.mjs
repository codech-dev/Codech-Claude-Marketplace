// Bundle once, render one still per storyboard beat: node stills.mjs <outDir> id=localSeconds ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';
const [out, ...picks] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync('src/timeline.json', 'utf8'));
const start = {}; let prev = null;
for (const e of TL) { const s = prev ? prev.s + prev.dur - (e.overlap || 0) : 0; start[e.id] = s; e.s = s; prev = e; }
const browserExecutable = path.resolve('node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Film', browserExecutable});
fs.mkdirSync(out, {recursive: true});
for (const p of picks) {
  const [name, spec] = p.split('=');
  const [id, lt] = spec.includes('@') ? spec.split('@') : [name, spec];
  const frame = Math.round((start[id] + parseFloat(lt)) * 30);
  await renderStill({serveUrl, composition, frame, output: path.join(out, name + '.jpg'), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  console.log(name, frame);
}
