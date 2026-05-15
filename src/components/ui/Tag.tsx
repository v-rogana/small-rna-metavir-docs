import { cn } from '@/lib/cn';

type Tone = 'teal' | 'gold' | 'blue' | 'red' | 'purple' | 'lime';

const TONES: Record<Tone, string> = {
  teal: 'bg-viridis-primary/15 text-[#7fded8] ring-viridis-primary/40',
  gold: 'bg-viridis-sun/15 text-viridis-sun ring-viridis-sun/40',
  blue: 'bg-viridis-deep/25 text-[#a8b9e8] ring-viridis-deep/50',
  red: 'bg-terracotta/15 text-terracotta ring-terracotta/40',
  purple: 'bg-viridis-dark/30 text-[#e0c8ff] ring-viridis-dark/60',
  lime: 'bg-viridis-lime/15 text-viridis-lime ring-viridis-lime/40',
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
