'use client';

import { motion } from 'framer-motion';
import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

type Tab = { id: string; label: string; content: React.ReactNode };

export default function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();

  return (
    <div className={cn('w-full', className)}>
      <div role="tablist" className="inline-flex rounded-full border border-viridis-primary/25 bg-viridis-800/60 backdrop-blur p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`${baseId}-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              'relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition',
              active === t.id ? 'text-viridis-900' : 'text-cream-200/70 hover:text-cream-50',
            )}
          >
            {active === t.id && (
              <motion.span
                layoutId={`${baseId}-pill`}
                className="absolute inset-0 -z-10 rounded-full bg-viridis-lime shadow-[0_0_18px_-2px_rgba(94,201,98,0.65)]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${baseId}-${t.id}`}
          role="tabpanel"
          hidden={active !== t.id}
          className="mt-5"
        >
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
