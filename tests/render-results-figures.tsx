#!/usr/bin/env node
// Renders every themed chart shown in the Results / case-study section
// (#results) to a standalone SVG file under public/results/.
// The charts are pure-SVG React components, rendered here with
// react-dom/server. ClassificationChart wraps its bar in an HTML legend, so its
// standalone version (bar + legend) is composed directly below.
//
// Run with: npm run figures:results

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ReactElement } from 'react';

import ReadFunnel from '../src/components/ui/ReadFunnel';
import SizeProfileChart from '../src/components/ui/SizeProfileChart';
import CoverageTrack from '../src/components/ui/CoverageTrack';
import {
  READ_FUNNEL,
  SIZE_CLASS_SPLIT,
  READ_FATE,
  CLASS_COMBINED,
  ML_VIRUS_EVE,
  HIGHLIGHTS,
  AGGREGATE_SIZE_PROFILE,
} from '../src/data/results';
import type { ClassBucket, Tone } from '../src/data/results';

// The chart components target the automatic JSX runtime (no React import). When
// transpiled to classic createElement here, they look up a bare `React`, so make
// it global before any component renders.
(globalThis as { React?: typeof React }).React = React;

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'public', 'results');

const BG = '#0a1a18'; // viridis-900, matches the results section background
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Wrap a component-rendered SVG: extract the <svg> (components return a div
// wrapper for the interactive tooltip), then add real width/height, xmlns, a
// dark background, and a concrete monospace font (the CSS var does not resolve
// outside the site).
function finalize(markup: string): string {
  const svg = markup.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? markup;
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const w = vb ? vb[1] : '720';
  const h = vb ? vb[2] : '400';
  return svg
    .replace(/var\(--font-mono\), monospace/g, MONO)
    .replace(/^<svg /, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `)
    .replace(/(<svg[^>]*>)/, `$1<rect x="0" y="0" width="${w}" height="${h}" fill="${BG}"/>`);
}

function writeSvg(name: string, svg: string): void {
  writeFileSync(join(outDir, `${name}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`, 'utf8');
  console.log(`  ${name}.svg`);
}

function renderComponent(name: string, el: ReactElement): void {
  writeSvg(name, finalize(renderToStaticMarkup(el)));
}

// ── ClassificationChart: stacked bar + legend, composed as standalone SVG ──
const TONE_HEX: Record<Tone, string> = {
  teal: '#21918c',
  lime: '#5ec962',
  deep: '#3b528b',
  dark: '#440154',
  sun: '#fde725',
  red: '#e88a6a',
  purple: '#7a3b9a',
};
const LIGHT_LABEL: Tone[] = ['teal', 'deep', 'dark', 'purple'];

function classificationSvg(buckets: ClassBucket[], title: string): string {
  const W = 420;
  const pad = 18;
  const barH = 40;
  const rowH = 22;
  const barW = W - 2 * pad;
  const total = buckets.reduce((s, b) => s + b.count, 0);
  const parts: string[] = [];

  let y = pad;
  parts.push(
    `<text x="${pad}" y="${y + 12}" font-size="12" font-weight="700" font-family="${MONO}" letter-spacing="0.08em" fill="#5ec962">${esc(
      title.toUpperCase(),
    )}</text>`,
  );
  y += 26;

  const barY = y;
  let acc = 0;
  for (const b of buckets) {
    const w = (b.count / total) * barW;
    const x = pad + acc;
    acc += w;
    parts.push(
      `<rect x="${x.toFixed(1)}" y="${barY}" width="${Math.max(w - 1.5, 0).toFixed(1)}" height="${barH}" rx="3" fill="${TONE_HEX[b.tone]}"/>`,
    );
    if (w > 22) {
      const light = LIGHT_LABEL.includes(b.tone);
      parts.push(
        `<text x="${(x + w / 2).toFixed(1)}" y="${barY + barH / 2 + 5}" text-anchor="middle" font-size="15" font-weight="700" font-family="${MONO}" fill="${light ? '#fbf8f1' : '#0a1a18'}">${b.count}</text>`,
      );
    }
  }

  y = barY + barH + 20;
  for (const b of buckets) {
    parts.push(`<rect x="${pad}" y="${y - 9}" width="11" height="11" rx="2" fill="${TONE_HEX[b.tone]}"/>`);
    parts.push(
      `<text x="${pad + 18}" y="${y}" font-size="12" font-family="${MONO}" fill="rgba(236,226,200,0.85)">${esc(b.label)} · ${b.count}</text>`,
    );
    y += rowH;
  }

  const H = y - rowH + 9 + pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="0" y="0" width="${W}" height="${H}" fill="${BG}"/>${parts.join('')}</svg>`;
}

const toBuckets = (rows: { key: string; label: string; reads: number; tone: Tone }[]): ClassBucket[] =>
  rows.map((r) => ({ key: r.key, label: r.label, count: r.reads, tone: r.tone }));

const [contig37, eve] = HIGHLIGHTS;

console.log('Rendering results figures to public/results/:');

// Component charts (pure SVG; renderToStaticMarkup gives the final state)
renderComponent('read-funnel', <ReadFunnel steps={READ_FUNNEL} />);
renderComponent('contig37-size-profile', <SizeProfileChart data={contig37.sizeProfile} peakNt={contig37.peakNt} height={260} />);
renderComponent('contig37-coverage-track', <CoverageTrack data={contig37.coverage!} lengthNt={contig37.lengthNt} />);
renderComponent('eve-size-profile', <SizeProfileChart data={eve.sizeProfile} peakNt={eve.peakNt} height={260} />);
renderComponent('aggregate-size-profile', <SizeProfileChart data={AGGREGATE_SIZE_PROFILE} peakNt={21} height={300} />);

// Stacked-bar classification charts (bar + legend)
writeSvg('size-class-split', classificationSvg(toBuckets(SIZE_CLASS_SPLIT), 'Small-RNA window · by size class'));
writeSvg('read-fate', classificationSvg(toBuckets(READ_FATE), 'Read fate · by similarity'));
writeSvg('contig-classification', classificationSvg(CLASS_COMBINED, 'Similarity verdict (BLASTn ∪ DIAMOND)'));
writeSvg('ml-virus-eve', classificationSvg(ML_VIRUS_EVE, 'Random Forest · virus × EVE'));

console.log('Done.');
