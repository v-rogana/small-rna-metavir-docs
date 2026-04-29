export type GlossaryTerm = { term: string; def: string };

export type GlossaryGroup = {
  category: string;
  terms: GlossaryTerm[];
};

export const GLOSSARY: GlossaryGroup[] = [
  {
    category: 'Molecular Biology & RNA Interference',
    terms: [
      {
        term: 'Dicer / Dicer-2',
        def: 'RNase III enzyme that cleaves viral dsRNA into 21-23 nt siRNA duplexes. The 21 nt peak is a hallmark of Dicer activity against active viruses. Dicer-2 is the specific isoform involved in antiviral RNAi in insects.',
      },
      { term: 'dsRNA (Double-Stranded RNA)', def: 'RNA with two complementary strands. Viral replication intermediates form dsRNA, triggering the RNAi pathway.' },
      {
        term: 'EVE (Endogenous Viral Element)',
        def: 'A viral sequence integrated into the host genome. EVEs are inherited vertically and produce piRNAs (24-30 nt) instead of siRNAs. Distinguishing EVEs from active infections is a key goal of this pipeline.',
      },
      {
        term: 'Ping-Pong Cycle',
        def: 'An amplification loop in the piRNA pathway. PIWI proteins cleave target RNA at position 10, generating a new piRNA with a 10 nt overlap. Computationally detectable as a bias for adenine at position 10.',
      },
      {
        term: 'piRNA (PIWI-Interacting RNA)',
        def: 'Small non-coding RNA, 24-30 nt, that interacts with PIWI-family proteins. Involved in transposon silencing. A dominant piRNA peak suggests the sequence is an EVE.',
      },
      { term: 'RISC (RNA-Induced Silencing Complex)', def: 'Multiprotein complex that uses siRNA guides to find and degrade complementary viral RNA. The catalytic component is Argonaute-2.' },
      { term: 'RNAi (RNA Interference)', def: 'Conserved antiviral mechanism: viral dsRNA → Dicer-2 → siRNAs → RISC → viral RNA degradation. The biological foundation of this pipeline.' },
      { term: 'siRNA (Small Interfering RNA)', def: '20-23 nt RNA produced by Dicer. The 21 nt peak is the molecular signature of active viral replication in arthropods.' },
      { term: 'vsRNA (Virus-Derived Small RNA)', def: 'Small RNAs from viral sequences. Can be siRNAs (active virus, Dicer) or piRNAs (EVE, ping-pong). The size profile reveals the origin.' },
    ],
  },
  {
    category: 'Genomics & Bioinformatics',
    terms: [
      { term: 'Assembly (De Novo)', def: 'Reconstructing longer sequences (contigs) from short reads without a reference genome. This pipeline uses Velvet, SPAdes, and CAP3.' },
      { term: 'BLAST (Basic Local Alignment Search Tool)', def: 'Algorithm for comparing sequences against databases. BLASTn (nucleotide) is used with evalue 1e-5 against the NCBI nt database.' },
      { term: 'Bowtie', def: 'Fast short-read aligner for mapping reads to references. Used with -v 1 (1 mismatch), -k 1 (1 alignment), -f (FASTA input).' },
      { term: 'CAP3', def: 'Meta-assembler that merges overlapping contigs from different assemblies into a non-redundant set.' },
      { term: 'Contig', def: 'Contiguous sequence assembled from overlapping reads. Contigs ≥200 nt are analyzed by the pipeline.' },
      { term: 'Diamond', def: 'Fast protein aligner (BLASTx alternative). Used with evalue 0.001, very-sensitive mode, for contigs with no nucleotide-level hits.' },
      { term: 'E-value (Expect Value)', def: 'Statistical measure of alignment significance. Lower = better. BLASTn uses 1e-5; Diamond uses 0.001.' },
      { term: 'Metagenomics', def: 'Study of genetic material from environmental samples without culturing. sRNA metagenomics targets the small RNA fraction for viral discovery.' },
      { term: 'Scaffold', def: 'Sequence from SPAdes that may contain gaps bridged by assembly graph information. Merged with Velvet contigs.' },
      { term: 'Virome', def: 'The complete collection of viruses in a sample or organism.' },
    ],
  },
  {
    category: 'Machine Learning & Statistics',
    terms: [
      {
        term: 'Feature Matrix',
        def: 'Tabular representation: rows = contigs, columns = 48 features (21 sense Z-scores + 21 antisense Z-scores + 6 density/ratio features). Input to the classifier.',
      },
      {
        term: 'Random Forest',
        def: 'Ensemble ML algorithm using 50 decision trees by majority vote. Trained on 2,315 sequences (1,321 viral + 994 EVE). ~92.5% test accuracy.',
      },
      {
        term: 'Similarity Label',
        def: 'Initial contig classification by BLASTn/Diamond: viral, nonviral, or nohit. Distinct from the ML-based class (viral/eve).',
      },
      {
        term: 'Z-Score',
        def: 'Normalized value: (x - mean) / stddev. Makes sRNA profiles comparable across contigs regardless of read depth. Computed for sizes 15-35 nt on both strands.',
      },
    ],
  },
];
