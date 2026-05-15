import { Layers, Sparkles, Workflow, Zap } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import Tag from './ui/Tag';
import DataTable from './ui/DataTable';

export default function AboutSection() {
  return (
    <section id="about" className="container-doc py-24 md:py-28">
      <SectionHeading
        figureRef="Biological context"
        eyebrow="About"
        title="Discovering viruses through their RNAi footprint"
        description="small RNA MetaVir detects viral sequences in arthropod sRNA-seq data — including novel viruses with no database match — by exploiting the molecular signatures of RNA interference."
      />

      <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:gap-14">
        <Reveal className="prose-doc text-[1.02rem] md:text-base">
          <h3 className="font-serif text-xl text-cream-50">
            The biological principle: RNAi as antiviral defense
          </h3>
          <p className="mt-3">
            In arthropods such as mosquitoes, flies, and ticks, the RNAi pathway serves as a
            primary antiviral defense. When a virus infects an insect cell, the host enzyme{' '}
            <strong>Dicer-2</strong> recognizes viral double-stranded RNA (dsRNA) replication
            intermediates and cleaves them into <strong>small interfering RNAs (siRNAs)</strong>{' '}
            of a characteristic length — predominantly{' '}
            <span className="data-mono">21</span> nucleotides. These virus-derived siRNAs (vsRNAs)
            then guide the <strong>RISC</strong> complex to degrade the viral genome. This leaves a
            detectable molecular signature: an enrichment of <span className="data-mono">21 nt</span>{' '}
            reads mapping to the viral sequence.
          </p>
          <p>
            By contrast, <strong>endogenous viral elements (EVEs)</strong> — ancient viral
            sequences integrated into the host genome — produce a different class of small RNAs
            called <strong>piRNAs</strong> (PIWI-interacting RNAs), which are typically{' '}
            <span className="data-mono">24–30 nt</span> in length and show a characteristic
            ping-pong amplification signature.
          </p>
        </Reveal>

        <div className="grid gap-4">
          <Reveal>
            <article className="group relative card-dark p-6 transition hover:-translate-y-1 hover:shadow-neon">
              <div className="flex items-center gap-2 text-terracotta">
                <Zap className="h-5 w-5 drop-shadow-[0_0_8px_rgba(232,138,106,0.55)]" />
                <h4 className="font-serif text-lg text-cream-50">Active virus — siRNA</h4>
              </div>
              <p className="mt-2 text-sm text-cream-200/80">
                Strong peak at <span className="data-mono">21 nt</span>. Reads on both sense and
                antisense strands. Produced by Dicer-2 cleavage of viral dsRNA replication
                intermediates.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone="red">21 nt peak</Tag>
                <Tag tone="blue">Dicer-2</Tag>
                <Tag tone="teal">RISC</Tag>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="group relative card-dark p-6 transition hover:-translate-y-1 hover:shadow-neon">
              <div className="flex items-center gap-2 text-viridis-sun">
                <Layers className="h-5 w-5 drop-shadow-[0_0_8px_rgba(253,231,37,0.45)]" />
                <h4 className="font-serif text-lg text-cream-50">EVE — piRNA</h4>
              </div>
              <p className="mt-2 text-sm text-cream-200/80">
                Broad distribution at <span className="data-mono">24–30 nt</span>. Ping-pong
                amplification pattern (A at pos <span className="data-mono">10</span>). Produced
                from genomically integrated viral sequences.
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

      <h3 className="lab-label mt-16">Key features</h3>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: 'Similarity-Independent',
            text: 'Finds novel "dark matter" viruses with no database matches through their RNAi footprint.',
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
            <article className="group h-full card-dark p-6 transition hover:-translate-y-1 hover:shadow-neon hover:border-viridis-lime/50">
              <c.icon className="h-6 w-6 text-viridis-lime drop-shadow-[0_0_8px_rgba(94,201,98,0.5)] transition group-hover:scale-110" />
              <h4 className="mt-4 font-serif text-lg text-cream-50">{c.title}</h4>
              <p className="mt-2 text-sm text-cream-200/80">{c.text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <h3 className="lab-label mt-16">Table 1 — Hardware requirements</h3>
      <Reveal className="mt-4">
        <DataTable
          headers={['Resource', 'Minimum', 'Recommended']}
          rows={[
            ['CPU Cores', <span key="c1" className="data-mono">8</span>, <span key="c2" className="data-mono">20+</span>],
            ['RAM', <span key="r1" className="data-mono">32 GB</span>, <span key="r2" className="data-mono">64 GB</span>],
            ['Disk Space', <span key="d1" className="data-mono">500 GB</span>, <span key="d2" className="data-mono">1 TB+</span>],
          ]}
        />
      </Reveal>
    </section>
  );
}
