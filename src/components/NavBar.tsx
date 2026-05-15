'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#installation', label: 'Installation' },
  { href: '#parameters', label: 'Parameters' },
  { href: '#examples', label: 'Examples' },
  { href: '#glossary', label: 'Glossary' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('#about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean,
    ) as Element[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-88px 0px -55% 0px', threshold: 0.01 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-silk',
        scrolled
          ? 'bg-viridis-900/85 backdrop-blur-md border-b border-viridis-primary/20 shadow-soft'
          : 'bg-transparent',
      )}
    >
      <div className="container-doc flex h-[68px] items-center justify-between gap-4">
        <a href="#" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl text-cream-50 group-hover:text-viridis-lime transition">
            sRNA MetaVir
          </span>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-viridis-lime/60">
            docs
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition rounded-md',
                active === l.href
                  ? 'text-viridis-lime'
                  : 'text-cream-200/75 hover:text-cream-50',
              )}
            >
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-viridis-lime shadow-[0_0_8px_rgba(94,201,98,0.8)]"
                  transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                />
              )}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-cream-200 hover:text-viridis-lime"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-viridis-primary/20 bg-viridis-900/95 backdrop-blur"
          >
            <div className="container-doc flex flex-col py-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'py-2 text-sm font-medium transition',
                    active === l.href ? 'text-viridis-lime' : 'text-cream-200/80',
                  )}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
