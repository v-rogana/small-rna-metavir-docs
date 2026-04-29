#!/usr/bin/env node
// Extracts the PIPELINE_MERMAID template literal from src/data/pipelineMermaid.ts
// and renders it to PNG + SVG using @mermaid-js/mermaid-cli (mmdc).
// Run with: npm run figures:pipeline

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const sourceTs = join(repoRoot, 'src', 'data', 'pipelineMermaid.ts');
const outDir = join(here, 'figures');
const mmdPath = join(here, 'pipeline.mmd');
const pngPath = join(outDir, 'pipeline.png');
const svgPath = join(outDir, 'pipeline.svg');

const src = readFileSync(sourceTs, 'utf8');
const match = src.match(/PIPELINE_MERMAID\s*=\s*`([\s\S]*?)`;/);
if (!match) {
  console.error(`Could not find PIPELINE_MERMAID template literal in ${sourceTs}`);
  process.exit(1);
}

// The TS source contains `\\n` (escaped in the template literal). When read as
// raw text those are two literal backslashes + n. Mermaid label syntax wants a
// single backslash + n, so collapse `\\n` -> `\n` and unescape backticks.
const mermaidSource = match[1].replace(/\\\\n/g, '\\n').replace(/\\`/g, '`');

mkdirSync(outDir, { recursive: true });
writeFileSync(mmdPath, mermaidSource, 'utf8');

const mmdcBin = process.platform === 'win32' ? 'mmdc.cmd' : 'mmdc';
const mmdc = join(repoRoot, 'node_modules', '.bin', mmdcBin);

function runMmdc(outPath, extraArgs = []) {
  const args = ['-i', mmdPath, '-o', outPath, '-b', 'transparent', '-s', '2', ...extraArgs];
  console.log(`mmdc ${args.join(' ')}`);
  // shell:true is required on Windows so node can launch the .cmd shim.
  execFileSync(mmdc, args, { stdio: 'inherit', shell: process.platform === 'win32' });
}

runMmdc(pngPath, ['-w', '1600']);
runMmdc(svgPath);

console.log(`\nWrote:\n  ${pngPath}\n  ${svgPath}`);
