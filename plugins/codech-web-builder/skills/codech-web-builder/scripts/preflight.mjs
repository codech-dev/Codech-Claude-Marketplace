#!/usr/bin/env node
// Preflight tool check. Reports which CLI tools / env keys are present so the
// skill can gate the pipeline. Skills (taste skill) are NOT checkable here - the
// agent verifies those from its own available-skills list. Usage: node preflight.mjs
import { spawnSync } from 'node:child_process';

function has(cmd, args = ['--version']) {
  try {
    const r = spawnSync(cmd, args, { stdio: 'ignore', shell: process.platform === 'win32' });
    return r.status === 0;
  } catch { return false; }
}
function nodeOk() {
  const major = Number(process.versions.node.split('.')[0]);
  return major >= 18; // global fetch + the scripts need >= 18
}
function resolvable(mod) {
  try { import.meta.resolve ? import.meta.resolve(mod) : require.resolve(mod); return true; }
  catch { return false; }
}

const checks = [
  ['node >= 18',        nodeOk(),                              'REQUIRED', 'Runtime for the bundled scripts (fetch, capture).'],
  ['playwright',        has('npx', ['--no-install', 'playwright', '--version']), 'CAPTURE', 'Preferred reference capture + QA screenshots. Degrades to Firecrawl or user screenshots.'],
  ['wrangler',          has('npx', ['--no-install', 'wrangler', '--version']),   'DEPLOY:static', 'Only if deploying via the static adapter (Cloudflare Pages).'],
  ['git',               has('git'),                            'DEPLOY:wordpress', 'Only for the WordPress adapter (coway-starter checkout).'],
  ['ssh',               has('ssh', ['-V']),                    'DEPLOY:wordpress', 'Only for WordPress provisioning over SSH (or use the no-SSH MCP path).'],
  ['PEXELS_API_KEY',    !!process.env.PEXELS_API_KEY,          'OPTIONAL', 'Better stock imagery. Without any key, image sourcing falls back to Openverse.'],
  ['UNSPLASH_ACCESS_KEY', !!process.env.UNSPLASH_ACCESS_KEY,   'OPTIONAL', 'Alternative stock provider. Openverse used if absent.'],
];

let hardMissing = 0;
console.log('codech-web-builder preflight (tools)\n');
for (const [name, ok, tier, note] of checks) {
  const mark = ok ? 'OK  ' : 'MISS';
  if (!ok && tier === 'REQUIRED') hardMissing++;
  console.log(`  [${mark}] ${name.padEnd(20)} ${tier.padEnd(18)} ${ok ? '' : '- ' + note}`);
}
console.log('\nTiers: REQUIRED = must have. CAPTURE = need at least one capture path.');
console.log('DEPLOY:* = only if you deploy via that adapter. OPTIONAL = quality/convenience.');
console.log(hardMissing ? `\n${hardMissing} REQUIRED tool(s) missing - resolve before running the pipeline.`
                        : '\nAll REQUIRED tools present.');
process.exit(hardMissing ? 1 : 0);
