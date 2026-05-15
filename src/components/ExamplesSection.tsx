import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import CodeBlock from './ui/CodeBlock';
import Tag from './ui/Tag';
import DataTable from './ui/DataTable';
import { EXAMPLES, INTERPRETATION_MATRIX } from '@/data/examples';

const TONE_MAP = {
  red: 'red',
  gold: 'gold',
  teal: 'teal',
} as const;

export default function ExamplesSection() {
  return (
    <section id="examples" className="container-doc py-24 md:py-28">
      <SectionHeading
        figureRef="Use cases"
        eyebrow="Examples"
        title="Five common usage scenarios"
        description="Adapt these to your data. Each command is copy-paste ready."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {EXAMPLES.map((ex, i) => (
          <Reveal key={ex.title} delay={i * 0.05} className="h-full">
            <article className="group h-full card-dark p-6 transition hover:-translate-y-0.5 hover:shadow-neon hover:border-viridis-lime/40">
              <header className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-cream-50">{ex.title}</h3>
                <span className="data-mono text-[0.7rem] uppercase tracking-widest opacity-70">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </header>
              <CodeBlock code={ex.command} />
              {ex.note && (
                <p className="mt-3 text-xs text-cream-200/70">{ex.note}</p>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      <h3 className="lab-label mt-16">Table 6 — Interpreting classification results</h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Similarity', 'ML class', 'Interpretation']}
          rows={INTERPRETATION_MATRIX.map((r) => [
            <Tag key="s" tone={TONE_MAP[r.tone]}>{r.similarity}</Tag>,
            <Tag key="m" tone={r.mlClass === 'eve' ? 'gold' : 'red'}>{r.mlClass}</Tag>,
            <span key="i" className="text-cream-200/90">{r.interpretation}</span>,
          ])}
        />
      </Reveal>
    </section>
  );
}
