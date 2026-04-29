'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/cn';
import { SILK } from '@/lib/easing';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'span' | 'li';
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0,
  });

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: SILK, delay },
        },
      };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
