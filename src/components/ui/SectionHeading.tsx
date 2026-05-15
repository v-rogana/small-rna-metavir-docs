import { cn } from '@/lib/cn';
import Reveal from './Reveal';

type Props = {
  eyebrow?: string;
  figureRef?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  inverse?: boolean;
};

export default function SectionHeading({
  eyebrow,
  figureRef,
  title,
  description,
  align = 'left',
  className,
  inverse,
}: Props) {
  return (
    <div className={cn('mb-8 md:mb-12', align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {figureRef && (
        <Reveal>
          <div className="lab-label mb-3">{figureRef}</div>
        </Reveal>
      )}
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-mono uppercase tracking-[0.18em] text-viridis-lime">
            <span className="h-px w-8 bg-viridis-lime/60" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="heading-display mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)] text-cream-50">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base md:text-lg text-pretty text-cream-200/80">
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
