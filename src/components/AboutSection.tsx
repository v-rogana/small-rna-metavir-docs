import { Layers, Sparkles, Workflow, Zap } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import Tag from './ui/Tag';
import DataTable from './ui/DataTable';

export default function AboutSection() {
  return (
    <section id="about" className="container-doc py-24 md:py-28">
      <SectionHeading
        eyebrow="About"
        title="Discovering viruses through their RNAi footprint"
        description="small RNA MetaVir detects viral sequences in arthropod sRNA-seq data — including novel viruses with no database match — by exploiting the molecular signatures of RNA interference."
      />

      <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:gap-14">
        <Reveal className="prose-doc text-[1.02rem] md:text-base">
          <h3 className="font-serif text-xl text-ink-900">
            The biological principle: RNAi as antiviral defense
          </h3>
          <p className="mt-3">
            In arthropods such as mosquitoes, flies, and ticks, the RNAi pathway serves as a
            primary antiviral defense. When a virus infects an insect cell, the host enzyme{' '}
            <strong>Dicer-2</strong> recognizes viral double-stranded RNA (dsRNA) replication
            intermediates and cleaves them into <strong>small interfering RNAs (siRNAs)</strong>{' '}
            of a characteristic length — predominantly <strong>21 nucleotides</strong>. These
            virus-derived siRNAs (vsRNAs) then guide the <strong>RISC</strong> complex to degrade
            the viral genome. This leaves a detectable molecular signature: an enrichment of 21
            nt reads mapping to the viral sequence.
          </p>
          <p>
            By contrast, <strong>endogenous viral elements (EVEs)</strong> — ancient viral
            sequences integrated into the host genome — produce a different class of small RNAs
            called <strong>piRNAs</strong> (PIWI-interacting RNAs), which are typically{' '}
            <strong>24–30 nt</strong> in length and show a characteristic ping-pong amplification
            signature.
          </p>
        </Reveal>

        <div className="grid gap-4">
          <Reveal>
            <article className="group relative rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <div className="flex items-center gap-2 text-terracotta">
                <Zap className="h-5 w-5" />
                <h4 className="font-serif text-lg text-ink-900">Active virus — siRNA</h4>
              </div>
              <p className="mt-2 text-sm text-ink-700">
                Strong peak at <strong>21 nt</strong>. Reads on both sense and antisense strands.
                Produced by Dicer-2 cleavage of viral dsRNA replication intermediates.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone="red">21 nt peak</Tag>
                <Tag tone="blue">Dicer-2</Tag>
                <Tag tone="teal">RISC</Tag>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="group relative rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <div className="flex items-center gap-2 text-viridis-dark">
                <Layers className="h-5 w-5" />
                <h4 className="font-serif text-lg text-ink-900">EVE — piRNA</h4>
              </div>
              <p className="mt-2 text-sm text-ink-700">
                Broad distribution at <strong>24–30 nt</strong>. Ping-pong amplification pattern
                (A at pos 10). Produced from genomically integrated viral sequences.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone="gold">24–30 nt</Tag>
                <Tag tone="purple">PIWI</Tag>
                <Tag tone="teal">Ping-pong</Tag>
              </div>
            </article>
          </Reveal>
        </div>
      </div>

      <h3 className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
        Key features
      </h3>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: 'Similarity-Independent',
            text: 'Finds novel “dark matter” viruses with no database matches through their RNAi footprint.',
          },
          {
            icon: Workflow,
            title: 'Virus vs. EVE Classifier',
            text: 'Random Forest trained on 2,315 curated sequences (~92.5% accuracy). 48 features from sRNA size profiles.',
          },
          {
            icon: Layers,
            title: 'Multi-Assembler Strategy',
            text: 'Four parallel assemblies (Velvet + SPAdes) merged by CAP3 to maximize contig recovery from short reads.',
          },
        ].map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <article className="group h-full rounded-2xl border border-cream-200 bg-cream-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow hover:border-accent/40">
              <c.icon className="h-6 w-6 text-viridis-primary transition group-hover:scale-110" />
              <h4 className="mt-4 font-serif text-lg text-ink-900">{c.title}</h4>
              <p className="mt-2 text-sm text-ink-700">{c.text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <h3 className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-500">
        Hardware requirements
      </h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Resource', 'Minimum', 'Recommended']}
          rows={[
            ['CPU Cores', '8', '20+'],
            ['RAM', '32 GB', '64 GB'],
            ['Disk Space', '500 GB', '1 TB+'],
          ]}
        />
      </Reveal>
    </section>
  );
}
