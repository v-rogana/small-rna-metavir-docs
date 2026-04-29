'use client';

import { useEffect, useId, useState } from 'react';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import Tag from './ui/Tag';
import { PIPELINE_MERMAID } from '@/data/pipelineMermaid';

export default function PipelineSection() {
  const renderId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          flowchart: { htmlLabels: true, curve: 'basis' },
        });
        const { svg: out } = await mermaid.render(`metavir-${renderId}`, PIPELINE_MERMAID);
        if (!cancelled) setSvg(out);
      } catch (e) {
        console.error('Mermaid render failed', e);
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [renderId]);

  return (
    <section id="pipeline" className="relative bg-ink-900 text-cream-100 py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(33,145,140,0.25) 0%, transparent 70%)',
        }}
      />
      <div className="container-doc relative">
        <SectionHeading
          eyebrow="Pipeline architecture"
          title="From raw reads to virus / EVE classification"
          description="The pipeline orchestrates 12+ stages, color-coded by stage type. Each step is implemented in Perl, Python, or R, and runs inside the Docker / Podman image."
          inverse
        />

        <Reveal>
          <div className="mermaid-host overflow-x-auto rounded-2xl border border-ink-700 bg-cream-50 p-6 md:p-10 shadow-glow-lg">
            {svg ? (
              <div
                className="mermaid flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : failed ? (
              <p className="text-sm text-ink-500">
                Pipeline diagram failed to render. Reload the page or check the console.
              </p>
            ) : (
              <p className="text-sm text-ink-500">Loading pipeline diagram…</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-cream-200/90">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-cream-200/60">
              Legend
            </span>
            <span className="flex items-center gap-2">
              <Tag tone="blue">Filtering</Tag> Host, bacteria, size
            </span>
            <span className="flex items-center gap-2">
              <Tag tone="teal">Assembly</Tag> Velvet, SPAdes, CAP3
            </span>
            <span className="flex items-center gap-2">
              <Tag tone="gold">Similarity</Tag> BLAST, Diamond
            </span>
            <span className="flex items-center gap-2">
              <Tag tone="purple">ML</Tag> Profiling, Z-scores, RF
            </span>
          </div>
        </Reveal>

        <h3 className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-cream-200/70">
          Technology stack
        </h3>
        <Reveal className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-900/40 backdrop-blur">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-ink-700/40">
                  <th className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-cream-200/60">
                    Category
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-cream-200/60">
                    Tools &amp; versions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Languages', 'Perl 5.36 (pipeline core), Python 3.9 (ML, filtering), R 4.0 (plotting, feature matrix)'],
                  ['Quality Control', 'Trim Galore 0.6.10, FastQC 0.12.1, cutadapt 3.2, FASTX-Toolkit'],
                  ['Read Mapping', 'Bowtie 1.3.0 (short-read aligner), samtools (SAM/BAM processing)'],
                  ['De Novo Assembly', 'Velvet / VelvetOptimiser 2.2.6, SPAdes 3.13.1, CAP3 (meta-assembler)'],
                  ['Similarity Search', 'BLAST+ 2.14.0 (BLASTn), legacy BLAST 2.2.26 (formatdb/blastall), Diamond 2.1.6 (BLASTx)'],
                  ['Machine Learning', 'scikit-learn 1.1.3 (Random Forest, 50 estimators), joblib 1.3.1, pandas 2.0.3'],
                  ['Perl Modules', 'Bio::SeqIO, Bio::SearchIO, Statistics::Basic, Statistics::RankCorrelation'],
                  ['R Packages', 'ggplot2, reshape2, Rtsne, umap, ComplexHeatmap'],
                  ['Containerization', 'Docker (multi-stage Dockerfile) / Podman'],
                ].map(([cat, tools]) => (
                  <tr key={cat} className="border-t border-ink-700/60 hover:bg-ink-700/30">
                    <td className="px-4 py-3 align-top text-cream-100 font-medium">{cat}</td>
                    <td className="px-4 py-3 align-top text-cream-200/85">{tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
