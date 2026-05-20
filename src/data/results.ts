// Example pipeline outputs from a single real run (sample `sRNACrnGmqlN`,
// an Aedes aegypti small-RNA library). All numbers are extracted statically
// from the pipeline output tree, no runtime parsing. Edit this file to swap
// in a different example sample.
//
// Sources:
//   summary.tsv ............ sRNACrnGmqlN_smallRNAMetavir_summary.tsv
//   top hits ............... 06_blastn/..._viral_BestHits_blastn.tab.class.tab
//   highlight (viral) ...... 09_..._profiles_viral/...Contig37_36.distribution / .density
//   highlight (eve) ........ 09_..._profiles_non_viral/...Contig14_13.distribution / .base_distribution
//   aggregate signature .... 08_..._similarity_class/..._all_viral.Geral_base_distribution

export type Tone = 'teal' | 'lime' | 'deep' | 'dark' | 'sun' | 'red' | 'purple';

// ── Case-study metadata ───────────────────────────────────────────
export const CASE_STUDY = {
  sample: 'sRNACrnGmqlN',
  host: 'Aedes aegypti',
  viruses: ['Aedes orbi-like virus', 'Aedes partiti-like virus 1'],
  rawReads: 20_154_886,
  viralReads: 88_454,
  viralContigs: 33,
} as const;

// ── 1. Read funnel ────────────────────────────────────────────────
export type FunnelStep = {
  key: string;
  label: string;
  reads: number;
  note?: string;
  tone?: Tone;
};

// reads remaining at each stage (host/bacteria are subtractions of the prior step)
export const READ_FUNNEL: FunnelStep[] = [
  { key: 'raw', label: 'Raw reads', reads: 20_154_886, note: 'sequencer output' },
  { key: 'trimmed', label: 'Adapter-trimmed', reads: 20_045_961, note: 'Trim Galore + FastQC' },
  { key: 'nonhost', label: 'Host-depleted', reads: 1_167_575, note: '18.88 M Aedes reads removed' },
  { key: 'nonbact', label: 'Bacteria-depleted', reads: 1_049_558, note: '118 K bacterial reads removed' },
  { key: 'userrange', label: 'Size-selected 18–35 nt', reads: 931_261, note: 'small-RNA window' },
  { key: 'viral', label: 'Viral reads', reads: 88_454, note: 'mapped to viral contigs', tone: 'lime' },
];

// secondary split of the small-RNA window by size class
export const SIZE_CLASS_SPLIT: { key: string; label: string; reads: number; tone: Tone }[] = [
  { key: 'si', label: '20–23 nt · siRNA', reads: 253_547, tone: 'lime' },
  { key: 'pi', label: '24–30 nt · piRNA', reads: 646_461, tone: 'deep' },
];

// final fate of reads assigned to contigs
export const READ_FATE: { key: string; label: string; reads: number; tone: Tone }[] = [
  { key: 'viral', label: 'Viral', reads: 88_454, tone: 'lime' },
  { key: 'nonviral', label: 'Non-viral', reads: 57_166, tone: 'teal' },
  { key: 'unknown', label: 'Unknown', reads: 10_050, tone: 'sun' },
];

// ── 2. Contig classification ──────────────────────────────────────
export type ClassBucket = { key: string; label: string; count: number; tone: Tone };

export const CONTIG_TOTAL = 45; // contigs > 200 nt

// combined similarity verdict (BLASTn ∪ DIAMOND)
export const CLASS_COMBINED: ClassBucket[] = [
  { key: 'viral', label: 'Viral', count: 33, tone: 'lime' },
  { key: 'nonviral', label: 'Non-viral', count: 10, tone: 'teal' },
  { key: 'unknown', label: 'Unknown', count: 2, tone: 'sun' },
];

// per-tool similarity hits (compact comparison)
export const CLASS_BY_TOOL: { tool: string; viral: number; nonviral: number }[] = [
  { tool: 'BLASTn (nt)', viral: 30, nonviral: 8 },
  { tool: 'DIAMOND blastx (nr)', viral: 3, nonviral: 2 },
];

// Random-Forest virus × EVE refinement of the viral set
export const ML_VIRUS_EVE: ClassBucket[] = [
  { key: 'vv', label: 'Virus · virus', count: 31, tone: 'lime' },
  { key: 've', label: 'Virus · EVE', count: 2, tone: 'sun' },
  { key: 'nv', label: 'No-hit · virus', count: 2, tone: 'deep' },
];

// ── 3. Top viral hits (BLASTn class.tab) ──────────────────────────
export type ViralHit = {
  contig: string;
  identity: number;
  coverage: number;
  evalue: string;
  species: string;
  family: string;
  segment?: string;
};

export const TOP_VIRAL_HITS: ViralHit[] = [
  { contig: 'Contig37_36', identity: 99.78, coverage: 100, evalue: '0.0', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP1' },
  { contig: 'Contig60_59', identity: 100.0, coverage: 100, evalue: '7.5e-148', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP2' },
  { contig: 'Contig100_99', identity: 100.0, coverage: 100, evalue: '4.2e-135', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP5' },
  { contig: 'Contig101_100', identity: 100.0, coverage: 96, evalue: '1.5e-175', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP4' },
  { contig: 'Contig141_140', identity: 100.0, coverage: 91, evalue: '4.5e-176', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP7' },
  { contig: 'Contig46_45', identity: 100.0, coverage: 87, evalue: '7.6e-169', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP3' },
  { contig: 'Contig51_50', identity: 100.0, coverage: 97, evalue: '2.5e-178', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP6' },
  { contig: 'Contig866_865', identity: 100.0, coverage: 85, evalue: '0.0', species: 'Aedes orbi-like virus', family: 'Sedoreoviridae', segment: 'VP1' },
  { contig: 'Contig3_2', identity: 98.85, coverage: 100, evalue: '0.0', species: 'Aedes partiti-like virus 1', family: 'Partitiviridae', segment: 'capsid' },
  { contig: 'Contig837_836', identity: 99.77, coverage: 86, evalue: '0.0', species: 'Aedes partiti-like virus 1', family: 'Partitiviridae', segment: 'capsid' },
];

// ── 4. Highlight contigs (static deep-dives) ──────────────────────
// `antisense` is stored positive; charts render it below the baseline.
export type SizePoint = { size: number; sense: number; antisense: number };
export type CoveragePoint = { pos: number; positive: number; negative: number };

export type HighlightContig = {
  id: string;
  title: string;
  classification: 'viral' | 'eve';
  species: string;
  family: string;
  segment?: string;
  lengthNt: number;
  peakNt: number;
  tone: Tone;
  signature: string;
  baseBias?: string;
  source: string; // pipeline output folder this contig's profile comes from
  sizeProfile: SizePoint[];
  coverage?: CoveragePoint[];
};

const CONTIG37_SIZE: SizePoint[] = [
  { size: 18, sense: 0, antisense: 0 },
  { size: 19, sense: 2, antisense: 3 },
  { size: 20, sense: 56, antisense: 19 },
  { size: 21, sense: 1968, antisense: 1309 },
  { size: 22, sense: 232, antisense: 58 },
  { size: 23, sense: 152, antisense: 20 },
  { size: 24, sense: 155, antisense: 22 },
  { size: 25, sense: 174, antisense: 8 },
  { size: 26, sense: 161, antisense: 9 },
  { size: 27, sense: 375, antisense: 15 },
  { size: 28, sense: 176, antisense: 9 },
  { size: 29, sense: 203, antisense: 5 },
  { size: 30, sense: 47, antisense: 4 },
  { size: 31, sense: 14, antisense: 3 },
  { size: 32, sense: 11, antisense: 4 },
  { size: 33, sense: 7, antisense: 1 },
  { size: 34, sense: 4, antisense: 0 },
  { size: 35, sense: 6, antisense: 0 },
];

// downsampled (~every 6 nt) coverage along the 436 nt contig
const CONTIG37_COVERAGE: CoveragePoint[] = [
  { pos: 1, positive: 3, negative: 32 }, { pos: 7, positive: 325, negative: 4 }, { pos: 13, positive: 633, negative: 7 }, { pos: 19, positive: 648, negative: 21 }, { pos: 25, positive: 604, negative: 80 }, { pos: 31, positive: 430, negative: 79 }, { pos: 37, positive: 80, negative: 80 }, { pos: 43, positive: 130, negative: 25 }, { pos: 49, positive: 251, negative: 12 }, { pos: 55, positive: 284, negative: 16 }, { pos: 61, positive: 322, negative: 27 }, { pos: 67, positive: 147, negative: 155 }, { pos: 73, positive: 135, negative: 157 }, { pos: 79, positive: 172, negative: 668 }, { pos: 85, positive: 120, negative: 583 }, { pos: 91, positive: 127, negative: 563 }, { pos: 97, positive: 108, negative: 557 }, { pos: 103, positive: 25, negative: 2 }, { pos: 109, positive: 44, negative: 2 }, { pos: 115, positive: 23, negative: 3 }, { pos: 121, positive: 88, negative: 12 }, { pos: 127, positive: 93, negative: 11 }, { pos: 133, positive: 99, negative: 11 }, { pos: 139, positive: 112, negative: 5 }, { pos: 145, positive: 111, negative: 5 }, { pos: 151, positive: 114, negative: 8 }, { pos: 157, positive: 184, negative: 11 }, { pos: 163, positive: 346, negative: 11 }, { pos: 169, positive: 297, negative: 11 }, { pos: 175, positive: 279, negative: 9 }, { pos: 181, positive: 212, negative: 38 }, { pos: 187, positive: 117, negative: 41 }, { pos: 193, positive: 134, negative: 40 }, { pos: 199, positive: 90, negative: 3 }, { pos: 205, positive: 115, negative: 2 }, { pos: 211, positive: 53, negative: 2 }, { pos: 217, positive: 36, negative: 2 }, { pos: 223, positive: 12, negative: 0 }, { pos: 229, positive: 77, negative: 1 }, { pos: 235, positive: 169, negative: 2 }, { pos: 241, positive: 249, negative: 2 }, { pos: 247, positive: 258, negative: 2 }, { pos: 253, positive: 197, negative: 15 }, { pos: 259, positive: 84, negative: 27 }, { pos: 265, positive: 24, negative: 27 }, { pos: 271, positive: 49, negative: 21 }, { pos: 277, positive: 50, negative: 14 }, { pos: 283, positive: 48, negative: 1 }, { pos: 289, positive: 27, negative: 1 }, { pos: 295, positive: 67, negative: 1 }, { pos: 301, positive: 81, negative: 5 }, { pos: 307, positive: 82, negative: 342 }, { pos: 313, positive: 84, negative: 345 }, { pos: 319, positive: 20, negative: 364 }, { pos: 325, positive: 48, negative: 75 }, { pos: 331, positive: 67, negative: 94 }, { pos: 337, positive: 62, negative: 112 }, { pos: 343, positive: 126, negative: 70 }, { pos: 349, positive: 210, negative: 40 }, { pos: 355, positive: 251, negative: 36 }, { pos: 361, positive: 239, negative: 7 }, { pos: 367, positive: 196, negative: 4 }, { pos: 373, positive: 62, negative: 4 }, { pos: 379, positive: 41, negative: 1 }, { pos: 385, positive: 39, negative: 2 }, { pos: 391, positive: 36, negative: 9 }, { pos: 397, positive: 164, negative: 18 }, { pos: 403, positive: 456, negative: 37 }, { pos: 409, positive: 1178, negative: 74 }, { pos: 415, positive: 1178, negative: 69 }, { pos: 421, positive: 1030, negative: 64 }, { pos: 427, positive: 706, negative: 15 }, { pos: 433, positive: 24, negative: 0 }, { pos: 436, positive: 12, negative: 0 },
];

const EVE_SIZE: SizePoint[] = [
  { size: 18, sense: 0, antisense: 0 },
  { size: 19, sense: 10, antisense: 1 },
  { size: 20, sense: 44, antisense: 39 },
  { size: 21, sense: 555, antisense: 1193 },
  { size: 22, sense: 108, antisense: 84 },
  { size: 23, sense: 901, antisense: 49 },
  { size: 24, sense: 690, antisense: 34 },
  { size: 25, sense: 16513, antisense: 25 },
  { size: 26, sense: 280, antisense: 23 },
  { size: 27, sense: 1231, antisense: 15 },
  { size: 28, sense: 495, antisense: 15 },
  { size: 29, sense: 248, antisense: 17 },
  { size: 30, sense: 209, antisense: 8 },
  { size: 31, sense: 33, antisense: 10 },
  { size: 32, sense: 11, antisense: 1 },
  { size: 33, sense: 10, antisense: 3 },
  { size: 34, sense: 3, antisense: 1 },
  { size: 35, sense: 0, antisense: 0 },
];

export const HIGHLIGHTS: HighlightContig[] = [
  {
    id: 'Contig37_36',
    title: 'Active virus · orbi-like VP1',
    classification: 'viral',
    species: 'Aedes orbi-like virus',
    family: 'Sedoreoviridae',
    segment: 'VP1',
    lengthNt: 436,
    peakNt: 21,
    tone: 'lime',
    source: '09_*_profiles_viral/',
    signature:
      'Sharp 21 nt peak on both strands, produced by the Dicer-2 siRNA antiviral response. This is the profile expected from a virus that is replicating and being processed by the host.',
    sizeProfile: CONTIG37_SIZE,
    coverage: CONTIG37_COVERAGE,
  },
  {
    id: 'Contig14_13',
    title: 'Genome-integrated EVE · piRNA-like',
    classification: 'eve',
    species: 'orbi-like-derived EVE',
    family: 'Sedoreoviridae',
    lengthNt: 322,
    peakNt: 25,
    tone: 'sun',
    baseBias: '99% U (T) at 25 nt',
    source: '09_*_profiles_non_viral/',
    signature:
      'A 25 nt peak concentrated on one strand, with a strong 5′-U bias. This is a piRNA profile, typical of an endogenous viral element (EVE) integrated into the host genome rather than an active infection.',
    sizeProfile: EVE_SIZE,
  },
];

// ── 5. Aggregate viral small-RNA signature (stage 08) ─────────────
// summed A+C+G+T per strand per size from all 33 viral contigs.
export const AGGREGATE_SIZE_PROFILE: SizePoint[] = [
  { size: 15, sense: 0, antisense: 0 },
  { size: 16, sense: 0, antisense: 0 },
  { size: 17, sense: 0, antisense: 0 },
  { size: 18, sense: 7, antisense: 1 },
  { size: 19, sense: 119, antisense: 55 },
  { size: 20, sense: 830, antisense: 628 },
  { size: 21, sense: 23998, antisense: 29429 },
  { size: 22, sense: 2796, antisense: 1877 },
  { size: 23, sense: 2174, antisense: 1289 },
  { size: 24, sense: 1887, antisense: 897 },
  { size: 25, sense: 1872, antisense: 1005 },
  { size: 26, sense: 2221, antisense: 862 },
  { size: 27, sense: 3711, antisense: 695 },
  { size: 28, sense: 4187, antisense: 614 },
  { size: 29, sense: 3247, antisense: 431 },
  { size: 30, sense: 2204, antisense: 296 },
  { size: 31, sense: 387, antisense: 156 },
  { size: 32, sense: 223, antisense: 68 },
  { size: 33, sense: 104, antisense: 28 },
  { size: 34, sense: 60, antisense: 10 },
  { size: 35, sense: 29, antisense: 9 },
];

// ── Raw pipeline figures (real ggplot output, converted PDF → SVG) ─
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const RAW_FIGURES: { src: string; caption: string }[] = [
  {
    src: `${BASE_PATH}/results/contig37-size-distribution.svg`,
    caption: 'Contig37 · size distribution · raw pipeline figure',
  },
  {
    src: `${BASE_PATH}/results/contig37-coverage.svg`,
    caption: 'Contig37 · strand coverage · raw pipeline figure',
  },
  {
    src: `${BASE_PATH}/results/eve-base-distribution.svg`,
    caption: 'EVE · base/size distribution · raw pipeline figure',
  },
];
