'use client';

import { useRef, useState } from 'react';
import type { SizePoint } from '@/data/results';
import { ChartTooltip } from './chartUi';

// Viridis palette hexes (mirror tailwind.config.ts tokens)
const C = {
  sense: '#21918c', // viridis-primary
  sensePeak: '#5ec962', // viridis-lime
  anti: '#3b528b', // viridis-deep
  antiPeak: '#fde725', // viridis-sun
  baseline: 'rgba(94,201,98,0.30)',
  grid: 'rgba(33,145,140,0.14)',
  text: '#ece2c8', // cream-200
  muted: 'rgba(236,226,200,0.55)',
};

type Props = {
  data: SizePoint[];
  peakNt: number;
  domain?: [number, number];
  height?: number;
  className?: string;
  ariaLabel?: string;
};

/**
 * Strand-split small-RNA size profile, the signature figure of the pipeline.
 * Sense reads grow up from a central baseline, antisense reads grow down.
 * The dominant size class (`peakNt`) is highlighted. Hovering a size column
 * shows its sense/antisense counts and dims the rest.
 */
export default function SizeProfileChart({
  data,
  peakNt,
  domain = [15, 35],
  height = 300,
  className,
  ariaLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hi, setHi] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const W = 720;
  const H = height;
  const left = 16;
  const right = 12;
  const top = 30; // headroom so the peak callout clears the tallest bar
  const bottom = 34;
  const [d0, d1] = domain;
  const sizes = Array.from({ length: d1 - d0 + 1 }, (_, i) => d0 + i);
  const plotW = W - left - right;
  const band = plotW / sizes.length;
  const barW = band * 0.6;
  const pad = (band - barW) / 2;
  const yMid = (top + (H - bottom)) / 2;
  const max = Math.max(1, ...data.flatMap((d) => [d.sense, d.antisense]));
  const upSpan = yMid - top;
  const dnSpan = H - bottom - yMid;
  const bx = (s: number) => left + (s - d0) * band + pad;
  const upH = (v: number) => (v / max) * upSpan;
  const dnH = (v: number) => (v / max) * dnSpan;
  const bySize = new Map(data.map((d) => [d.size, d]));

  const active = hi !== null ? bySize.get(hi) : undefined;

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ''}`}
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
        aria-label={
          ariaLabel ?? `Strand-split small-RNA size profile, dominant peak at ${peakNt} nt`
        }
      >
        {/* peak highlight band */}
        {bySize.has(peakNt) && (
          <rect
            x={bx(peakNt) - pad}
            y={top - 22}
            width={band}
            height={H - bottom - top + 28}
            fill="rgba(94,201,98,0.08)"
            rx={3}
          />
        )}

        {/* hover highlight band */}
        {hi !== null && bySize.has(hi) && hi !== peakNt && (
          <rect
            x={bx(hi) - pad}
            y={top - 22}
            width={band}
            height={H - bottom - top + 28}
            fill="rgba(236,226,200,0.07)"
            rx={3}
          />
        )}

        {/* central baseline */}
        <line x1={left} x2={W - right} y1={yMid} y2={yMid} stroke={C.baseline} strokeWidth={1} />

        {sizes.map((s) => {
          const d = bySize.get(s);
          if (!d) return null;
          const isPeak = s === peakNt;
          const sH = upH(d.sense);
          const aH = dnH(d.antisense);
          const dim = hi !== null && hi !== s;
          return (
            <g key={s} opacity={dim ? 0.4 : 1} style={{ transition: 'opacity 120ms' }}>
              {d.sense > 0 && (
                <rect
                  x={bx(s)}
                  y={yMid - sH}
                  width={barW}
                  height={sH}
                  rx={1.5}
                  fill={isPeak ? C.sensePeak : C.sense}
                />
              )}
              {d.antisense > 0 && (
                <rect
                  x={bx(s)}
                  y={yMid}
                  width={barW}
                  height={aH}
                  rx={1.5}
                  fill={isPeak ? C.antiPeak : C.anti}
                />
              )}
              {(s % 2 === 1 || isPeak) && (
                <text
                  x={bx(s) + barW / 2}
                  y={H - bottom + 15}
                  textAnchor="middle"
                  fontSize={isPeak ? 11 : 10}
                  fontFamily="var(--font-mono), monospace"
                  fontWeight={isPeak ? 700 : 400}
                  fill={isPeak ? C.sensePeak : C.muted}
                >
                  {s}
                </text>
              )}
            </g>
          );
        })}

        {/* full-height hover targets per size column */}
        {sizes.map((s) =>
          bySize.has(s) ? (
            <rect
              key={`hit-${s}`}
              x={left + (s - d0) * band}
              y={top - 22}
              width={band}
              height={H - bottom - top + 22}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHi(s)}
            />
          ) : null,
        )}

        {/* peak callout */}
        {bySize.has(peakNt) && (
          <text
            x={bx(peakNt) + barW / 2}
            y={top - 8}
            textAnchor="middle"
            fontSize={11}
            fontFamily="var(--font-mono), monospace"
            fontWeight={700}
            fill={C.sensePeak}
          >
            {peakNt} nt
          </text>
        )}

        {/* strand labels */}
        <text x={left + 2} y={top + 2} fontSize={10} fontFamily="var(--font-mono), monospace" fill={C.sensePeak}>
          sense (+)
        </text>
        <text
          x={left + 2}
          y={H - bottom - 4}
          fontSize={10}
          fontFamily="var(--font-mono), monospace"
          fill="#a8b9e8"
        >
          antisense (−)
        </text>

        {/* x-axis caption */}
        <text
          x={left + plotW / 2}
          y={H - 2}
          textAnchor="middle"
          fontSize={10}
          fontFamily="var(--font-mono), monospace"
          fill={C.muted}
        >
          small RNA length (nt)
        </text>
      </svg>

      <ChartTooltip pos={active ? pos : null}>
        {active && (
          <>
            <div className="font-semibold text-cream-50">{active.size} nt</div>
            <div style={{ color: C.sensePeak }}>sense {active.sense.toLocaleString('en-US')}</div>
            <div style={{ color: '#a8b9e8' }}>antisense {active.antisense.toLocaleString('en-US')}</div>
          </>
        )}
      </ChartTooltip>
    </div>
  );
}
