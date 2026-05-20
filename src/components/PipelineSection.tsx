import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { CASE_STUDY, READ_FUNNEL, CONTIG_TOTAL, CLASS_COMBINED, ML_VIRUS_EVE } from '@/data/results';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const PIPELINE_SVG_SRC = `${BASE_PATH}/pipeline_refined.drawio.svg`;

// Short reads formatter, mirrors ReadFunnel's fmt (no space, e.g. "20.15M", "931K").
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// Example-output numbers derived from the real case-study run (single source: results.ts).
const RAW_READS = READ_FUNNEL.find((s) => s.key === 'raw')!.reads;
const SIZE_SELECTED = READ_FUNNEL.find((s) => s.key === 'userrange')!.reads;
const VIRAL_CONTIGS = CLASS_COMBINED.find((b) => b.key === 'viral')!.count;
const EVE_COUNT = ML_VIRUS_EVE.find((b) => b.key === 've')!.count;

type Phase = {
  num: string;
  title: string;
  steps: string;
  example?: string;
  bg: string;
  border: string;
  fg: string;
};

const PHASES: Phase[] = [
  {
    num: '01',
    title: 'Preprocessing & Filtering',
    steps: 'Trim Galore + FastQC, Bowtie vs host, Bowtie vs bacteria, size selection',
    example: `${fmt(RAW_READS)} raw reads → ${fmt(SIZE_SELECTED)} size-selected (18–35 nt)`,
    bg: '#1a2738',
    border: '#3b82f6',
    fg: '#a3bbff',
  },
  {
    num: '02',
    title: 'De Novo Assembly',
    steps: 'Velvet Optimiser, Velvet fixed (k=15), SPAdes (k=13–19), siRNA-focused (20–23 nt)',
    example: '4 parallel assemblies · Velvet + SPAdes',
    bg: '#072311',
    border: '#22c55e',
    fg: '#8cc2a2',
  },
  {
    num: '03',
    title: 'Meta-Assembly & Similarity',
    steps: 'CAP3 merge (≥200 nt), BLASTn vs NCBI nt, Diamond BLASTx vs NCBI nr',
    example: `${CONTIG_TOTAL} contigs ≥200 nt → ${VIRAL_CONTIGS} viral`,
    bg: '#271e00',
    border: '#d97706',
    fg: '#e6ac8c',
  },
  {
    num: '04',
    title: 'Profiling & Classification',
    steps: 'Bowtie remap, sRNA size profiles (18–35 nt), Z-scores, Random Forest (viral vs EVE)',
    example: `${CASE_STUDY.viralReads.toLocaleString('en-US')} viral reads · 21 nt peak · ${EVE_COUNT} EVEs`,
    bg: '#291f33',
    border: '#a855f7',
    fg: '#e6b2ff',
  },
];

export default function PipelineSection() {
  return (
    <section
      id="pipeline"
      className="relative border-y border-viridis-primary/15 bg-viridis-900 text-cream-100 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(94,201,98,0.18) 0%, transparent 65%), radial-gradient(40% 40% at 80% 90%, rgba(68,1,84,0.30) 0%, transparent 70%)',
        }}
      />
      <div className="container-doc relative">
        <SectionHeading
          figureRef="Pipeline architecture"
          eyebrow="From raw reads to classification"
          title="Twelve stages, four phases, one container"
          description="The pipeline orchestrates 12+ stages grouped into four phases. Each step is implemented in Perl, Python, or R, and runs inside the Docker / Podman image."
        />

        <Reveal>
          <figure className="overflow-x-auto py-2">
            <img
              src={PIPELINE_SVG_SRC}
              alt="small RNA MetaVir pipeline architecture, four phases from preprocessing to classification"
              className="mx-auto block h-auto w-full max-w-5xl"
            />
            <figcaption className="lab-label mt-4 text-center">
              Fig. 1 · Four-phase pipeline · preprocessing → assembly → similarity → classification
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10">
            <div className="lab-label mb-4">Phase legend</div>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PHASES.map((p) => (
                <li
                  key={p.num}
                  className="card-dark group p-4 transition hover:shadow-neon hover:-translate-y-0.5"
                  style={{ borderColor: `${p.border}55` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-full px-2 font-mono text-[0.72rem] font-semibold"
                      style={{ backgroundColor: p.bg, color: p.fg }}
                    >
                      {p.num}
                    </span>
                    <span className="font-medium text-sm text-cream-50">{p.title}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-cream-200/75">{p.steps}</p>
                  {p.example && (
                    <p className="mt-3 border-t border-viridis-primary/15 pt-2 font-mono text-[0.7rem] leading-relaxed text-cream-200/65">
                      <span style={{ color: p.fg }}>ex · </span>
                      {p.example}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-cream-200/45">
              Example outputs from case study {CASE_STUDY.sample} (<em>{CASE_STUDY.host}</em>).
            </p>
          </div>
        </Reveal>

        <h3 className="lab-label mt-16">Technology stack</h3>
        <Reveal className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-viridis-primary/20 bg-viridis-800/40 backdrop-blur">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-viridis-800/70 border-b border-viridis-primary/20">
                  <th className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-viridis-lime/80">
                    Category
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wider text-viridis-lime/80">
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
                  <tr
                    key={cat}
                    className="border-t border-viridis-primary/10 transition hover:bg-viridis-primary/10"
                  >
                    <td className="px-4 py-3 align-top text-viridis-lime font-mono text-[0.85rem]">{cat}</td>
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
