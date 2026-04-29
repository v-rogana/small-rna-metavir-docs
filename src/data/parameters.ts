export type ParamRow = {
  flag: string;
  type?: string;
  description: string;
  example?: string;
};

export const REQUIRED_PARAMS: ParamRow[] = [
  {
    flag: '-fasta <path>',
    type: 'Path',
    description: 'Input reads in FASTA format (.fasta, .fa, .gz). Skips Trim Galore/FastQC.',
    example: '-fasta /data/lib_trimmed.fasta',
  },
  {
    flag: '-fastq <path>',
    type: 'Path',
    description: 'Input reads in FASTQ format. Runs Trim Galore + FastQC automatically.',
    example: '-fastq /data/raw.fq.gz',
  },
  {
    flag: '-hostgenome <path>',
    type: 'Path',
    description: 'Host genome FASTA with pre-built Bowtie index. Not needed with -nohostfilter.',
    example: '-hostgenome /refs/Aae.fasta',
  },
  { flag: '-prefix <str>', type: 'String', description: 'Output file prefix for all generated files.', example: '-prefix SRR1652436' },
  { flag: '-size <int>', type: 'Integer', description: 'Expected target virus genome size in bp.', example: '-size 20000' },
  { flag: '-si <int>', type: 'Integer', description: 'Minimum read length to use (recommended: 15).', example: '-si 15' },
  { flag: '-se <int>', type: 'Integer', description: 'Maximum read length to use (recommended: 35).', example: '-se 35' },
  { flag: '-process <int>', type: 'Integer', description: 'Number of CPU threads.', example: '-process 20' },
  {
    flag: '-exec-id <str>',
    type: 'String',
    description: 'Unique run identifier. Defines output directory under ./runs/.',
    example: '-exec-id val-SRR1652436',
  },
];

export const OPTIONAL_PARAMS: ParamRow[] = [
  { flag: '-hash <int>', type: '15', description: 'Velvet hash (k-mer) length for fixed-hash assembly. Try 13 or 17 if default yields poor results.' },
  { flag: '-nohostfilter', type: 'off', description: 'Skip host genome filtering. Reads go directly to bacterial filtering. Dispenses -hostgenome.' },
  { flag: '-nononviralprofiles', type: 'off', description: 'Skip sRNA profile generation for non-viral contigs. Saves significant time.' },
  { flag: '-clean', type: 'off', description: 'Remove large intermediate files (SAMs, assembly dirs). Saves 50-80% disk space.' },
  { flag: '-largeindex', type: 'off', description: 'Use Bowtie --large-index for host genomes exceeding 4 GB.' },
  { flag: '-degradation', type: 'off', description: 'Enable additional 24-30 nt assembly (piRNA-focused). Partially disabled in current code.' },
  { flag: '-h', type: '—', description: 'Display help message and exit.' },
];

export const HARDCODED_CONSTANTS = [
  { tool: 'Bowtie (mapping)', param: '-v / -k', value: '1 mismatch / 1 alignment' },
  { tool: 'VelvetOptimiser', param: 'hash range', value: '13–19 (auto)' },
  { tool: 'SPAdes (optimized)', param: '-k', value: '13,15,17,19' },
  { tool: 'BLASTn', param: 'evalue / alignments', value: '1e-5 / 5' },
  { tool: 'Diamond', param: 'evalue / sensitivity', value: '0.001 / very-sensitive' },
  { tool: 'Trim Galore', param: 'min length', value: '18 nt' },
  { tool: 'sRNA Profiling', param: 'size range', value: '18–35 nt' },
  { tool: 'Merge contigs', param: 'pid / plen', value: '60% / 60%' },
];
