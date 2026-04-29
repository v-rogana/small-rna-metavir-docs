'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { SILK } from '@/lib/easing';

const TITLE = 'small RNA MetaVir';

export default function Hero() {
  const reduced = useReducedMotion();

  const wordVariants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: SILK },
        },
      };

  const words = TITLE.split(' ');

  return (
    <header className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] -z-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 10%, rgba(33,145,140,0.18) 0%, rgba(94,201,98,0.06) 35%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(68,1,84,0.35), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-48 h-[360px] w-[360px] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(253,231,37,0.35), transparent 60%)',
        }}
      />

      <div className="container-doc relative z-10 text-center">
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="heading-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.05] text-ink-900"
        >
          {words.map((w, i) => (
            <motion.span key={i} variants={wordVariants} className="inline-block pr-[0.25em]">
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: SILK }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base md:text-lg text-ink-500"
        >
          Automated viral sequence identification through small RNA profiling. Discover novel
          viruses invisible to BLAST — via the molecular signatures of RNA interference.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: SILK }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#about"
            className="group inline-flex items-center gap-2 rounded-full bg-viridis-primary px-6 py-3 text-sm font-semibold text-cream-50 shadow-glow hover:bg-accent-hover hover:shadow-glow-lg transition"
          >
            Explore the Docs
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://github.com/v-rogana/small-rna-metavir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink-700/15 bg-cream-50/60 backdrop-blur px-6 py-3 text-sm font-semibold text-ink-900 hover:border-accent hover:text-accent transition"
          >
            <ExternalLink className="h-4 w-4" />
            Pipeline Repository
          </a>
        </motion.div>
      </div>
    </header>
  );
}
