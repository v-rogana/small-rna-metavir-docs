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
        eyebrow="Examples"
        title="Five common usage scenarios"
        description="Adapt these to your data. Each command is copy-paste ready."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {EXAMPLES.map((ex, i) => (
          <Reveal key={ex.title} delay={i * 0.05} className="h-full">
            <article className="group h-full rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow hover:border-accent/40">
              <header className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-ink-900">{ex.title}</h3>
                <span className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </header>
              <CodeBlock code={ex.command} />
              {ex.note && (
                <p className="mt-3 text-xs text-ink-500">{ex.note}</p>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      <h3 className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
        Interpreting classification results
      </h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Similarity', 'ML class', 'Interpretation']}
          rows={INTERPRETATION_MATRIX.map((r) => [
            <Tag key="s" tone={TONE_MAP[r.tone]}>{r.similarity}</Tag>,
            <Tag key="m" tone={r.mlClass === 'eve' ? 'gold' : 'red'}>{r.mlClass}</Tag>,
            <span key="i" className="text-ink-700">{r.interpretation}</span>,
          ])}
        />
      </Reveal>
    </section>
  );
}
