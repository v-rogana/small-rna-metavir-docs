'use client';

import { useRef, useState } from 'react';
import type { ClassBucket, Tone } from '@/data/results';
import { ChartTooltip } from './chartUi';

const TONE_HEX: Record<Tone, string> = {
  teal: '#21918c',
  lime: '#5ec962',
  deep: '#3b528b',
  dark: '#440154',
  sun: '#fde725',
  red: '#e88a6a',
  purple: '#7a3b9a',
};

// dark text reads better on the bright lime/sun segments
const LIGHT_LABEL: Tone[] = ['teal', 'deep', 'dark', 'purple'];

/**
 * Horizontal stacked bar of contig classification buckets, with a legend.
 * Exact small counts are labeled on each segment. Hovering a segment or legend
 * row dims the others and shows a tooltip.
 */
export default function ClassificationChart({
  buckets,
  title,
  className,
}: {
  buckets: ClassBucket[];
  title?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hk, setHk] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const total = buckets.reduce((s, b) => s + b.count, 0);
  const W = 360;
  const barH = 40;
  let acc = 0;

  const active = hk !== null ? buckets.find((b) => b.key === hk) : undefined;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ''}`}
      onMouseMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => {
        setHk(null);
        setPos(null);
      }}
    >
      {title && <p className="lab-label mb-3">{title}</p>}
      <svg
        viewBox={`0 0 ${W} ${barH}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title ?? 'Classification'}: ${buckets
          .map((b) => `${b.count} ${b.label}`)
          .join(', ')}`}
      >
        {buckets.map((b) => {
          const w = (b.count / total) * W;
          const x = acc;
          acc += w;
          const useLight = LIGHT_LABEL.includes(b.tone);
          const dim = hk !== null && hk !== b.key;
          return (
            <g
              key={b.key}
              opacity={dim ? 0.35 : 1}
              style={{ transition: 'opacity 120ms', cursor: 'pointer' }}
              onMouseEnter={() => setHk(b.key)}
            >
              <rect
                x={x}
                y={0}
                width={Math.max(w - 1.5, 0)}
                height={barH}
                fill={TONE_HEX[b.tone]}
                rx={3}
              />
              {w > 22 && (
                <text
                  x={x + w / 2}
                  y={barH / 2 + 5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={700}
                  fontFamily="var(--font-mono), monospace"
                  fill={useLight ? '#fbf8f1' : '#0a1a18'}
                >
                  {b.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {buckets.map((b) => {
          const dim = hk !== null && hk !== b.key;
          return (
            <li
              key={b.key}
              className="flex items-center gap-1.5 text-xs text-cream-200/80 transition-opacity"
              style={{ opacity: dim ? 0.4 : 1, cursor: 'pointer' }}
              onMouseEnter={() => setHk(b.key)}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: TONE_HEX[b.tone] }}
              />
              <span>
                {b.label} <span className="data-mono">· {b.count}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <ChartTooltip pos={active ? pos : null}>
        {active && (
          <>
            <div className="font-semibold text-cream-50">{active.label}</div>
            <div className="text-cream-200/80">
              {active.count.toLocaleString('en-US')} · {((active.count / total) * 100).toFixed(1)}%
            </div>
          </>
        )}
      </ChartTooltip>
    </div>
  );
}
