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
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] -z-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 10%, rgba(33,145,140,0.35) 0%, rgba(94,201,98,0.10) 40%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(68,1,84,0.55), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-48 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(253,231,37,0.30), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[55%] h-[280px] w-[680px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(94,201,98,0.30), transparent 70%)',
        }}
      />

      <div className="container-doc relative z-10 text-center">
        <div className="lab-label mb-4">small-rna-metavir / v1.0 · documentation</div>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="heading-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.05] text-cream-50"
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
          className="mx-auto mt-6 max-w-2xl text-pretty text-base md:text-lg text-cream-200/75"
        >
          Automated viral sequence identification through small RNA profiling. Discover novel
          viruses invisible to BLAST, through the molecular signatures of RNA interference.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: SILK }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-[0.78rem] text-cream-200/70"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-viridis-primary/30 bg-viridis-800/40 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-viridis-lime shadow-[0_0_8px_rgba(94,201,98,0.9)]" />
            <span className="data-mono">21 nt</span> siRNA
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-viridis-primary/30 bg-viridis-800/40 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-viridis-sun shadow-[0_0_8px_rgba(253,231,37,0.9)]" />
            <span className="data-mono">24–30 nt</span> piRNA
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-viridis-primary/30 bg-viridis-800/40 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-viridis-deep shadow-[0_0_8px_rgba(59,82,139,0.9)]" />
            <span className="data-mono">~92.5%</span> RF accuracy
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: SILK }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#about"
            className="group inline-flex items-center gap-2 rounded-full bg-viridis-lime px-6 py-3 text-sm font-semibold text-viridis-900 shadow-neon-lime hover:bg-viridis-400 hover:text-viridis-900 transition"
          >
            Explore the Docs
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://github.com/v-rogana/small-rna-metavir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-viridis-primary/40 bg-viridis-800/40 backdrop-blur px-6 py-3 text-sm font-semibold text-cream-100 hover:border-viridis-lime hover:text-viridis-lime transition"
          >
            <ExternalLink className="h-4 w-4" />
            Pipeline Repository
          </a>
        </motion.div>
      </div>
    </header>
  );
}
