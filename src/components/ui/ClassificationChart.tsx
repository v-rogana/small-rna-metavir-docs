import type { ClassBucket, Tone } from '@/data/results';

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
 * Exact small counts are labeled on each segment.
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
  const total = buckets.reduce((s, b) => s + b.count, 0);
  const W = 360;
  const barH = 40;
  let acc = 0;

  return (
    <div className={className}>
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
          return (
            <g key={b.key}>
              <rect x={x} y={0} width={Math.max(w - 1.5, 0)} height={barH} fill={TONE_HEX[b.tone]} rx={3} />
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
        {buckets.map((b) => (
          <li key={b.key} className="flex items-center gap-1.5 text-xs text-cream-200/80">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: TONE_HEX[b.tone] }}
            />
            <span>
              {b.label} <span className="data-mono">· {b.count}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
