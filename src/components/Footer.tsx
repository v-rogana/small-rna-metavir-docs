import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-cream-200 bg-cream-100/60">
      <div className="bg-viridis-gradient h-[3px] opacity-70" aria-hidden />
      <div className="container-doc grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-ink-900">small RNA MetaVir</p>
          <p className="mt-2 text-sm text-ink-500">
            Federal University of Minas Gerais (UFMG), Brazil.
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">Source</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/v-rogana/small-rna-metavir"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-700 hover:text-accent transition"
              >
                <Github className="h-4 w-4" />
                Pipeline source code
              </a>
            </li>
            <li>
              <a
                href="https://github.com/rnai-bioinfo/small-rna-metavir-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-700 hover:text-accent transition"
              >
                <Github className="h-4 w-4" />
                Documentation source
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
            Quick links
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            {[
              ['#about', 'About'],
              ['#pipeline', 'Pipeline'],
              ['#installation', 'Installation'],
              ['#parameters', 'Parameters'],
              ['#examples', 'Examples'],
              ['#glossary', 'Glossary'],
            ].map(([h, l]) => (
              <li key={h}>
                <a href={h} className="text-ink-700 hover:text-accent transition">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-doc border-t border-cream-200 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} small RNA MetaVir contributors. Documentation licensed under
        the project repository terms.
      </div>
    </footer>
  );
}
