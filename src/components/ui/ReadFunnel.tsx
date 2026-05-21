'use client';

import { useRef, useState } from 'react';
import type { FunnelStep } from '@/data/results';
import { ChartTooltip } from './chartUi';

const C = {
  text: '#ece2c8',
  muted: 'rgba(236,226,200,0.62)',
  faint: 'rgba(236,226,200,0.45)',
  lime: '#5ec962',
  track: 'rgba(33,145,140,0.16)',
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} K`;
  return String(n);
}

/**
 * Horizontal funnel of the read-processing pipeline. Bars are centered and
 * sized proportionally to the reads remaining at each stage, so the silhouette
 * tapers from the full library down to the viral fraction. Labels, counts and
 * the per-stage note all sit off the bars (left/right) to stay readable even
 * when a bar collapses to a sliver; the final viral bar is emphasized.
 * Hovering a row dims the others and shows a tooltip.
 */
export default function ReadFunnel({ steps }: { steps: FunnelStep[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hi, setHi] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const W = 720;
  const left = 6;
  const right = 6;
  const labelH = 18; // label + count row
  const noteH = 15; // muted sub-label
  const rowH = 26; // bar height
  const rowGap = 18; // connector gap below each bar
  const top = 4;
  const block = labelH + noteH + rowH + rowGap;
  const H = top + steps.length * block;
  const plotW = W - left - right;
  const max = steps[0].reads;
  const bw = (v: number) => Math.max((v / max) * plotW, 4);
  const barYof = (i: number) => top + i * block + labelH + noteH;

  const active = hi !== null ? steps[hi] : null;

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => {
        setHi(null);
        setPos(null);
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Read funnel: ${fmt(steps[0].reads)} raw reads narrowing to ${fmt(
          steps[steps.length - 1].reads,
        )} viral reads`}
      >
        <defs>
          <linearGradient id="funnelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b528b" />
            <stop offset="55%" stopColor="#21918c" />
            <stop offset="100%" stopColor="#5ec962" />
          </linearGradient>
        </defs>

        {steps.map((s, i) => {
          const y = top + i * block;
          const barY = barYof(i);
          const w = bw(s.reads);
          const cx = left + (plotW - w) / 2; // center bars → funnel taper
          const pct = (s.reads / max) * 100;
          const isViral = s.tone === 'lime';
          const dim = hi !== null && hi !== i;

          // short trapezoid in the gap, tapering toward the next (narrower) bar
          let connector = null;
          if (i < steps.length - 1) {
            const nw = bw(steps[i + 1].reads);
            const ncx = left + (plotW - nw) / 2;
            const yb = barY + rowH;
            const yn = barY + rowH + rowGap;
            connector = (
              <polygon
                points={`${cx},${yb} ${cx + w},${yb} ${ncx + nw},${yn} ${ncx},${yn}`}
                fill={C.track}
              />
            );
          }

          return (
            <g key={s.key}>
              {connector}
              <text
                x={left}
                y={y + 13}
                fontSize={12.5}
                fontFamily="var(--font-mono), monospace"
                fontWeight={isViral ? 700 : 600}
                fill={isViral ? C.lime : C.text}
                opacity={dim ? 0.4 : 1}
              >
                {s.label}
              </text>
              <text
                x={W - right}
                y={y + 13}
                textAnchor="end"
                fontSize={12.5}
                fontFamily="var(--font-mono), monospace"
                fontWeight={isViral ? 700 : 500}
                fill={isViral ? C.lime : C.muted}
                opacity={dim ? 0.4 : 1}
              >
                {s.reads.toLocaleString('en-US')} · {pct.toFixed(pct < 10 ? 2 : 1)}%
              </text>
              {s.note && (
                <text
                  x={left}
                  y={y + labelH + 11}
                  fontSize={10.5}
                  fontFamily="var(--font-mono), monospace"
                  fill={isViral ? 'rgba(94,201,98,0.7)' : C.faint}
                  opacity={dim ? 0.4 : 1}
                >
                  {s.note}
                </text>
              )}
              <rect
                x={cx}
                y={barY}
                width={w}
                height={rowH}
                rx={5}
                fill={isViral ? C.lime : 'url(#funnelGrad)'}
                opacity={dim ? 0.4 : 1}
                style={{ transition: 'opacity 120ms' }}
              />
              {/* full-row hover target */}
              <rect
                x={0}
                y={y}
                width={W}
                height={block}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHi(i)}
              />
            </g>
          );
        })}
      </svg>

      <ChartTooltip pos={active ? pos : null}>
        {active && (
          <>
            <div className="font-semibold text-cream-50">{active.label}</div>
            <div className="text-cream-200/80">
              {active.reads.toLocaleString('en-US')} reads · {((active.reads / max) * 100).toFixed(2)}%
            </div>
            {active.note && <div className="text-cream-200/55">{active.note}</div>}
          </>
        )}
      </ChartTooltip>
    </div>
  );
}
