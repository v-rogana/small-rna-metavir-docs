import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import DataTable from './ui/DataTable';
import Tag from './ui/Tag';
import ReadFunnel from './ui/ReadFunnel';
import ClassificationChart from './ui/ClassificationChart';
import SizeProfileChart from './ui/SizeProfileChart';
import CoverageTrack from './ui/CoverageTrack';
import {
  CASE_STUDY,
  READ_FUNNEL,
  SIZE_CLASS_SPLIT,
  READ_FATE,
  CLASS_COMBINED,
  CLASS_BY_TOOL,
  CONTIG_TOTAL,
  ML_VIRUS_EVE,
  TOP_VIRAL_HITS,
  HIGHLIGHTS,
  AGGREGATE_SIZE_PROFILE,
  RAW_FIGURES,
} from '@/data/results';

const STATS = [
  { value: `${(CASE_STUDY.rawReads / 1_000_000).toFixed(2)} M`, label: 'raw small-RNA reads' },
  { value: CASE_STUDY.viralReads.toLocaleString('en-US'), label: 'reads assigned to viruses' },
  { value: String(CASE_STUDY.viralContigs), label: 'viral contigs (> 200 nt)' },
  { value: String(CASE_STUDY.viruses.length), label: 'viruses recovered' },
];

// Shows which pipeline output folder/file a chart was built from.
function SourceTag({ path, className = '' }: { path: string; className?: string }) {
  return (
    <p className={`font-mono text-[11px] text-cream-200/45 ${className}`}>
      <span className="text-cream-200/35">output </span>
      <span className="text-cream-200/70">{path}</span>
    </p>
  );
}

export default function ResultsSection() {
  return (
    <section
      id="results"
      className="relative border-y border-viridis-primary/15 bg-viridis-900 text-cream-100 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(55% 45% at 20% 0%, rgba(94,201,98,0.16) 0%, transparent 65%), radial-gradient(45% 45% at 90% 80%, rgba(59,82,139,0.28) 0%, transparent 70%)',
        }}
      />
      <div className="container-doc relative">
        <SectionHeading
          figureRef="Case study · real sample"
          eyebrow="Aedes aegypti · sample sRNACrnGmqlN"
          title="Two viruses recovered from one mosquito library"
          description="One Aedes aegypti small-RNA library processed through the full pipeline. Host and bacterial reads are removed, the remaining reads are assembled, and two viruses are recovered: Aedes orbi-like virus and Aedes partiti-like virus 1. The small-RNA size profile then separates an actively replicating virus from a viral sequence integrated into the host genome (an EVE)."
        />

        {/* stat strip */}
        <Reveal>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card-dark p-4">
                <dt className="data-mono text-2xl text-viridis-lime">{s.value}</dt>
                <dd className="mt-1 text-xs text-cream-200/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* read funnel */}
        <h3 className="lab-label mt-16">Read funnel</h3>
        <Reveal className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="card-dark flex flex-col p-5 md:p-6">
              <ReadFunnel steps={READ_FUNNEL} />
              <SourceTag path="*_summary.tsv" className="mt-4" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="card-dark p-5">
                <p className="lab-label mb-3">Small-RNA window · by size class</p>
                <ClassificationChart
                  buckets={SIZE_CLASS_SPLIT.map((s) => ({
                    key: s.key,
                    label: s.label,
                    count: s.reads,
                    tone: s.tone,
                  }))}
                />
                <SourceTag path="*_summary.tsv" className="mt-3" />
              </div>
              <div className="card-dark p-5">
                <p className="lab-label mb-3">Read fate · by similarity</p>
                <ClassificationChart
                  buckets={READ_FATE.map((s) => ({
                    key: s.key,
                    label: s.label,
                    count: s.reads,
                    tone: s.tone,
                  }))}
                />
                <SourceTag path="08_*_similarity_class/" className="mt-3" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* contig classification */}
        <h3 className="lab-label mt-16">Contig classification · {CONTIG_TOTAL} contigs over 200 nt</h3>
        <Reveal className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-dark flex flex-col p-6">
              <ClassificationChart buckets={CLASS_COMBINED} title="Similarity verdict (BLASTn ∪ DIAMOND)" />
              <ul className="mt-5 space-y-1.5 text-xs text-cream-200/75">
                {CLASS_BY_TOOL.map((t) => (
                  <li key={t.tool} className="flex items-center justify-between gap-3">
                    <span className="font-mono">{t.tool}</span>
                    <span className="data-mono">
                      {t.viral} viral · {t.nonviral} non-viral
                    </span>
                  </li>
                ))}
              </ul>
              <SourceTag path="06_blastn/ + 07_*_diamond/" className="mt-auto pt-5" />
            </div>
            <div className="card-dark flex flex-col p-6">
              <ClassificationChart buckets={ML_VIRUS_EVE} title="Random Forest · virus × EVE" />
              <p className="mt-5 text-xs leading-relaxed text-cream-200/75">
                The classifier re-examines every viral contig. It flags{' '}
                <span className="text-viridis-sun">2 as EVEs</span>, viral fragments integrated into
                the mosquito genome rather than signs of an active infection.
              </p>
              <SourceTag path="*-viral-eve.csv" className="mt-auto pt-5" />
            </div>
          </div>
        </Reveal>

        {/* top hits */}
        <h3 className="lab-label mt-16">Top viral hits · BLASTn vs NCBI nt</h3>
        <Reveal className="mt-4">
          <SourceTag path="06_blastn/*_viral_BestHits_blastn.tab.class.tab" className="mb-3" />
          <DataTable
            headers={['Contig', '% Identity', 'Coverage', 'E-value', 'Species', 'Family']}
            rows={TOP_VIRAL_HITS.map((h) => [
              <span key="c" className="data-mono">
                {h.contig}
                {h.segment && <span className="text-cream-200/55"> · {h.segment}</span>}
              </span>,
              <span key="i" className="data-mono">
                {h.identity.toFixed(2)}%
              </span>,
              <span key="cov" className="data-mono">
                {h.coverage}%
              </span>,
              <span key="e" className="data-mono">
                {h.evalue}
              </span>,
              <span key="s" className="text-cream-50">
                {h.species}
              </span>,
              <Tag key="f" tone={h.family === 'Partitiviridae' ? 'purple' : 'teal'}>
                {h.family}
              </Tag>,
            ])}
          />
        </Reveal>

        {/* highlight contigs */}
        <h3 className="lab-label mt-16">Active virus versus integrated EVE</h3>
        <Reveal className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {HIGHLIGHTS.map((c) => (
              <article key={c.id} className="card-dark flex flex-col p-6">
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-serif text-lg text-cream-50">{c.title}</h4>
                  <Tag tone={c.classification === 'eve' ? 'gold' : 'lime'}>
                    {c.classification === 'eve' ? 'EVE' : 'active virus'}
                  </Tag>
                </header>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-cream-200/70">
                  <span className="data-mono">{c.id}</span>
                  <span>·</span>
                  <span>{c.species}</span>
                  <span>·</span>
                  <span>{c.lengthNt} nt</span>
                  {c.baseBias && (
                    <>
                      <span>·</span>
                      <span className="text-viridis-sun">{c.baseBias}</span>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <SizeProfileChart data={c.sizeProfile} peakNt={c.peakNt} height={260} />
                </div>

                {c.coverage && (
                  <div className="mt-3">
                    <p className="lab-label mb-2">Coverage along contig</p>
                    <CoverageTrack data={c.coverage} lengthNt={c.lengthNt} />
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-cream-200/80">{c.signature}</p>
                <SourceTag path={c.source} className="mt-auto pt-4" />
              </article>
            ))}
          </div>
        </Reveal>

        {/* aggregate signature */}
        <h3 className="lab-label mt-16">Aggregate viral small-RNA signature</h3>
        <Reveal className="mt-4">
          <div className="card-dark p-6">
            <p className="mb-4 text-sm text-cream-200/75">
              Summed across all 33 viral contigs, the profile shows a dominant 21 nt peak on both
              strands (the exo-siRNA signature of mosquito antiviral immunity) over a broader
              27–29 nt piRNA shoulder.
            </p>
            <SizeProfileChart
              data={AGGREGATE_SIZE_PROFILE}
              peakNt={21}
              height={300}
              ariaLabel="Aggregate viral small-RNA size profile, dominant 21 nt peak on both strands"
            />
            <SourceTag path="08_*_similarity_class/*_all_viral.Geral_base_distribution" className="mt-4" />
          </div>
        </Reveal>

        {/* raw figures gallery */}
        <h3 className="lab-label mt-16">Raw pipeline figures</h3>
        <Reveal className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RAW_FIGURES.map((f) => (
              <figure
                key={f.src}
                className="rounded-xl border border-viridis-primary/20 bg-cream-50 p-3 shadow-soft"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.caption} className="block h-auto w-full" loading="lazy" />
                <figcaption className="lab-label mt-2 text-ink-700">{f.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-cream-200/55">
            Unedited ggplot2 output from the pipeline (converted from PDF to SVG), shown next to the
            styled charts above.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
