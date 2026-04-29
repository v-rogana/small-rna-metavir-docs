import { cn } from '@/lib/cn';
import Reveal from './Reveal';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  inverse?: boolean;
};

export default function SectionHeading({ eyebrow, title, description, align = 'left', className, inverse }: Props) {
  return (
    <div className={cn('mb-8 md:mb-12', align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              'inline-flex items-center gap-2 text-[0.72rem] font-mono uppercase tracking-[0.18em]',
              inverse ? 'text-accent-bright' : 'text-accent',
            )}
          >
            <span className={cn('h-px w-8', inverse ? 'bg-accent-bright/60' : 'bg-accent/60')} />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            'heading-display mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)]',
            inverse ? 'text-cream-50' : 'text-ink-900',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className={cn('mt-4 text-base md:text-lg text-pretty', inverse ? 'text-cream-200/80' : 'text-ink-500')}>
            {description}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.15}>
        <div className={cn('mt-6 viridis-rule', align === 'center' && 'mx-auto max-w-[60%]')} />
      </Reveal>
    </div>
  );
}
