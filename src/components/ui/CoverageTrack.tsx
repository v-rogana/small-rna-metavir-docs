'use client';

import { useRef, useState } from 'react';
import type { CoveragePoint } from '@/data/results';
import { ChartTooltip } from './chartUi';

const C = {
  pos: '#21918c', // viridis-primary (sense, up)
  posLine: '#5ec962',
  neg: '#8a6d3b', // muted brown (antisense, down), echoes the ggplot figure
  negLine: '#c79a4e',
  baseline: 'rgba(94,201,98,0.30)',
  muted: 'rgba(236,226,200,0.55)',
};

/**
 * Strand-specific small-RNA coverage along a contig. Positive strand fills up
 * from the baseline, negative strand fills down, showing where on the viral
 * genome the small RNAs map. Hovering snaps a marker to the nearest position and
 * shows its per-strand counts.
 */
export default function CoverageTrack({
  data,
  lengthNt,
  className,
}: {
  data: CoveragePoint[];
  lengthNt: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ai, setAi] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const W = 720;
  const H = 180;
  const left = 8;
  const right = 8;
  const top = 14;
  const bottom = 26;
  const plotW = W - left - right;
  const yMid = (top + (H - bottom)) / 2;
  const upSpan = yMid - top;
  const dnSpan = H - bottom - yMid;
  const max = Math.max(1, ...data.flatMap((d) => [d.positive, d.negative]));
  const x = (p: number) => left + (p / lengthNt) * plotW;
  const up = (v: number) => yMid - (v / max) * upSpan;
  const dn = (v: number) => yMid + (v / max) * dnSpan;

  const posArea =
    `M ${x(data[0].pos)} ${yMid} ` +
    data.map((d) => `L ${x(d.pos).toFixed(1)} ${up(d.positive).toFixed(1)}`).join(' ') +
    ` L ${x(data[data.length - 1].pos)} ${yMid} Z`;
  const negArea =
    `M ${x(data[0].pos)} ${yMid} ` +
    data.map((d) => `L ${x(d.pos).toFixed(1)} ${dn(d.negative).toFixed(1)}`).join(' ') +
    ` L ${x(data[data.length - 1].pos)} ${yMid} Z`;
  const posLine = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.pos).toFixed(1)} ${up(d.positive).toFixed(1)}`)
    .join(' ');
  const negLine = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.pos).toFixed(1)} ${dn(d.negative).toFixed(1)}`)
    .join(' ');

  const active = ai !== null ? data[ai] : null;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ''}`}
      onMouseMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        const vbX = ((e.clientX - r.left) / r.width) * W;
        let best = 0;
        let bd = Infinity;
        data.forEach((d, idx) => {
          const dx = Math.abs(x(d.pos) - vbX);
          if (dx < bd) {
            bd = dx;
            best = idx;
          }
        });
        setAi(best);
      }}
      onMouseLeave={() => {
        setAi(null);
        setPos(null);
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Strand coverage across the ${lengthNt} nt contig`}
      >
        <path d={posArea} fill={C.pos} fillOpacity={0.45} />
        <path d={posLine} fill="none" stroke={C.posLine} strokeWidth={1.2} />
        <path d={negArea} fill={C.neg} fillOpacity={0.5} />
        <path d={negLine} fill="none" stroke={C.negLine} strokeWidth={1.2} />
        <line x1={left} x2={W - right} y1={yMid} y2={yMid} stroke={C.baseline} strokeWidth={1} />

        <text x={left} y={top + 2} fontSize={10} fontFamily="var(--font-mono), monospace" fill={C.posLine}>
          + strand
        </text>
        <text x={left} y={H - bottom - 4} fontSize={10} fontFamily="var(--font-mono), monospace" fill={C.negLine}>
          − strand
        </text>
        {/* x ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <text
            key={f}
            x={left + f * plotW}
            y={H - 6}
            textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}
            fontSize={10}
            fontFamily="var(--font-mono), monospace"
            fill={C.muted}
          >
            {Math.round(f * lengthNt)}
          </text>
        ))}

        {/* hover markers on the nearest sampled position */}
        {active && (
          <g>
            <circle cx={x(active.pos)} cy={up(active.positive)} r={3.5} fill={C.posLine} stroke="#0a1a18" strokeWidth={1} />
            <circle cx={x(active.pos)} cy={dn(active.negative)} r={3.5} fill={C.negLine} stroke="#0a1a18" strokeWidth={1} />
          </g>
        )}
      </svg>

      <ChartTooltip pos={active ? pos : null}>
        {active && (
          <>
            <div className="font-semibold text-cream-50">pos {active.pos} nt</div>
            <div style={{ color: C.posLine }}>+ strand {active.positive.toLocaleString('en-US')}</div>
            <div style={{ color: C.negLine }}>− strand {active.negative.toLocaleString('en-US')}</div>
          </>
        )}
      </ChartTooltip>
    </div>
  );
}
