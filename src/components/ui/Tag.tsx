import { cn } from '@/lib/cn';

type Tone = 'teal' | 'gold' | 'blue' | 'red' | 'purple' | 'lime';

const TONES: Record<Tone, string> = {
  teal: 'bg-viridis-primary/10 text-viridis-primary ring-viridis-primary/30',
  gold: 'bg-viridis-sun/15 text-[#7d6b0a] ring-viridis-sun/40',
  blue: 'bg-viridis-deep/10 text-viridis-deep ring-viridis-deep/30',
  red: 'bg-terracotta/12 text-terracotta ring-terracotta/30',
  purple: 'bg-viridis-dark/10 text-viridis-dark ring-viridis-dark/30',
  lime: 'bg-viridis-lime/15 text-[#1d6e2a] ring-viridis-lime/40',
};

export default function Tag({
  children,
  tone = 'teal',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[0.7rem] font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
