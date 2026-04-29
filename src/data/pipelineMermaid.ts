export const PIPELINE_MERMAID = `%%{init:{'theme':'base','themeVariables':{'fontSize':'13px','primaryColor':'#fbf8f1','primaryBorderColor':'#56635f','lineColor':'#21918c','primaryTextColor':'#1b2422'}}}%%
flowchart TD
    classDef input fill:#f5efe1,stroke:#56635f,color:#1b2422
    classDef filter fill:#e6eef5,stroke:#3b528b,color:#1b2422
    classDef assembly fill:#dff3ef,stroke:#21918c,color:#0d403d
    classDef similarity fill:#fbf3c4,stroke:#a89320,color:#3a3308
    classDef ml fill:#ece0f5,stroke:#7a4ba8,color:#2e1b48
    classDef output fill:#dff3ef,stroke:#5ec962,color:#0d403d

    IN["INPUT\\nFASTA / FASTQ reads"]:::input

    S0["Step 0: Quality Control\\nTrim Galore + FastQC\\n(only with -fastq input)"]:::filter
    S1["Step 1: Host Filtering\\nBowtie vs host genome\\n(-v 1, -k 1)"]:::filter
    S2["Step 2: Bacterial Filtering\\nBowtie vs bacterial genomes\\n(--large-index)"]:::filter
    S3["Step 3: Size Selection\\nfilter_fasta_by_size.py"]:::filter

    A1["Velvet Optimiser\\nhash auto 13-19"]:::assembly
    A2["Velvet Fixed\\nhash = 15"]:::assembly
    A3["SPAdes\\nk = 13,15,17,19"]:::assembly
    A4["20-23 nt Assembly\\nsiRNA-focused"]:::assembly
    CAP["Step 5: CAP3 Meta-Assembly\\nMerge + filter ≥200 nt"]:::assembly

    BN["Step 6: BLASTn vs nt\\nevalue 1e-5\\nClassify: viral / non-viral / no-hit"]:::similarity
    DM["Step 7: Diamond BLASTx vs nr\\nevalue 0.001, very-sensitive\\n(no-hit contigs only)"]:::similarity

    MAP["Step 8-9: Read Mapping & sRNA Profiling\\nBowtie map reads to contigs\\nSize profiles 18-35 nt per contig"]:::ml
    ZS["Step 10: Z-Score Features\\nNormalize profiles\\n48 features per contig"]:::ml
    RF["Step 11: Random Forest Classifier\\n50 trees, 2315 training sequences\\nviral vs eve prediction"]:::ml

    OUT["OUTPUT\\nviral-eve.csv\\nsummary.tsv\\nFASTA per class\\nsRNA profiles"]:::output

    IN --> S0 --> S1 --> S2 --> S3
    S3 --> A1 & A2 & A3 & A4
    A1 & A2 & A3 & A4 --> CAP
    CAP --> BN --> DM
    DM --> MAP --> ZS --> RF --> OUT
`;
