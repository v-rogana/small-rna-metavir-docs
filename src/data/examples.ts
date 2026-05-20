export type Example = {
  title: string;
  command: string;
  note?: string;
};

export const EXAMPLES: Example[] = [
  {
    title: 'Aedes aegypti Virome Analysis',
    command: `perl main.pl \\
    -fasta /small-rna-metavir/asset/libs/RNPM162_trimmed.fq.fasta \\
    -hostgenome /small-rna-metavir/asset/refs/ref_hosts/refs_Aae_Aalb_Agam_culex.fasta \\
    -process 20 -si 15 -se 35 -size 20000 \\
    -exec-id RNPM162 -prefix RNPM162`,
    note: 'Runtime: ~2-6 hours • Disk: 5-20 GB per library',
  },
  {
    title: 'Raw FASTQ with Automatic Trimming',
    command: `perl main.pl \\
    -fastq /data/raw/library_R1.fastq.gz \\
    -hostgenome /small-rna-metavir/asset/refs/ref_hosts/refs_Aae_Aalb_Agam_culex.fasta \\
    -process 20 -si 15 -se 35 -size 20000 \\
    -exec-id raw-lib01 -prefix RAWLIB01`,
    note: 'Trim Galore + FastQC run automatically before the pipeline.',
  },
  {
    title: 'No Host Reference (Non-Model Organism)',
    command: `perl main.pl \\
    -fasta /data/nonmodel_trimmed.fasta \\
    -nohostfilter \\
    -process 20 -si 15 -se 35 -size 20000 \\
    -exec-id nonmodel-01 -prefix NM01`,
  },
  {
    title: 'Large Library with Disk Optimization',
    command: `perl main.pl \\
    -fasta /data/large_library.fasta \\
    -hostgenome /refs/host.fasta \\
    -process 40 -si 15 -se 35 -size 20000 \\
    -exec-id prod-01 -prefix LARGE01 \\
    -clean -nononviralprofiles`,
    note: '-clean saves 50-80% disk; -nononviralprofiles reduces runtime.',
  },
  {
    title: 'SRA Data Re-analysis',
    command: `# Download from SRA
fasterq-dump SRR1652436 -O /data/sra/ -e 8

# Run the pipeline
perl main.pl \\
    -fasta /data/sra/SRR1652436_trimmed.fq.fasta \\
    -hostgenome /small-rna-metavir/asset/refs/ref_hosts/refs_Aae_Aalb_Agam_culex.fasta \\
    -process 40 -si 15 -se 35 -size 20000 \\
    -exec-id val-SRR1652436 -prefix SRR1652436`,
  },
];

export const INTERPRETATION_MATRIX = [
  { similarity: 'viral', mlClass: 'viral', interpretation: 'Confirmed active virus. Known virus with siRNA-like profile.', tone: 'red' as const },
  { similarity: 'viral', mlClass: 'eve', interpretation: 'Possible EVE. Known virus but piRNA-like profile, may be integrated.', tone: 'gold' as const },
  { similarity: 'nohit', mlClass: 'viral', interpretation: 'Novel viral candidate! No database match but viral sRNA signature.', tone: 'red' as const },
  { similarity: 'nohit', mlClass: 'eve', interpretation: 'Unknown sequence with EVE-like profile.', tone: 'gold' as const },
  { similarity: 'nonviral', mlClass: 'viral', interpretation: 'Non-viral hit but viral profile. Inspect manually.', tone: 'teal' as const },
  { similarity: 'nonviral', mlClass: 'eve', interpretation: 'Non-viral / host-derived with EVE-like profile.', tone: 'teal' as const },
];
