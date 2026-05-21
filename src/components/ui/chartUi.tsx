'use client';

import type { ReactNode } from 'react';

/**
 * Floating tooltip for the hand-rolled SVG charts. Positioned in pixel space
 * relative to a `position: relative` wrapper; `pos = null` hides it. Kept as an
 * HTML overlay (not SVG text) so it stays crisp regardless of the SVG scaling.
 */
export function ChartTooltip({
  pos,
  children,
}: {
  pos: { x: number; y: number } | null;
  children: ReactNode;
}) {
  return (
    <div
      role="tooltip"
      aria-hidden={!pos}
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-lg border border-viridis-primary/30 bg-viridis-900/95 px-2.5 py-1.5 font-mono text-[11px] leading-snug text-cream-100 shadow-soft backdrop-blur transition-opacity duration-100"
      style={{ left: pos?.x ?? 0, top: pos?.y ?? 0, opacity: pos ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
