'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { GLOSSARY } from '@/data/glossary';
import { cn } from '@/lib/cn';

export default function GlossarySection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="glossary" className="border-y border-viridis-primary/15 bg-viridis-800/20 py-24 md:py-28">
      <div className="container-doc">
        <SectionHeading
          figureRef="Glossary"
          eyebrow="Reference vocabulary"
          title="The vocabulary of small RNA virology"
          description="Three categories: molecular biology, genomics, and the machine learning concepts that underpin the classifier."
        />

        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {GLOSSARY.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.07}>
              <h3 className="font-serif text-xl text-cream-50">{group.category}</h3>
              <div className="mt-4 divide-y divide-viridis-primary/15 rounded-xl border border-viridis-primary/20 bg-viridis-800/40 backdrop-blur-sm shadow-soft">
                {group.terms.map((t) => {
                  const id = `${group.category}-${t.term}`;
                  const isOpen = open === id;
                  return (
                    <div key={t.term}>
                      <button
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-viridis-primary/10"
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                      >
                        <span className="font-mono text-[0.82rem] text-viridis-lime">{t.term}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-cream-200/60 transition-transform',
                            isOpen && 'rotate-180 text-viridis-lime',
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-sm text-cream-200/85">{t.def}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
