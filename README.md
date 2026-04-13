# small RNA MetaVir — Documentation Site

Interactive documentation and AI assistant for the **small RNA MetaVir** pipeline.

**Live site:** [https://rnai-bioinfo.github.io/small-rna-metavir-docs/](https://rnai-bioinfo.github.io/small-rna-metavir-docs/)

## About

small RNA MetaVir is an automated bioinformatics pipeline for identifying viral sequences in small RNA sequencing (sRNA-seq) data from arthropods. It exploits the RNA interference (RNAi) antiviral defense to detect viruses — including novel ones with no database matches — through their characteristic small RNA size profiles.

## Features of This Documentation Site

- **Interactive pipeline diagram** powered by Mermaid.js with color-coded stages
- **Complete parameter reference** with examples and recommendations
- **Installation guides** for Docker, Podman, and native setups
- **AI-powered assistant** (GPT-4o-mini) that answers questions about the pipeline in any language
- **Glossary** of molecular biology, bioinformatics, and machine learning terms
- **Dark theme** optimized for readability

## Pipeline Repository

The pipeline source code lives in a separate repository:
[https://github.com/v-rogana/small-rna-metavir](https://github.com/v-rogana/small-rna-metavir)

## Deploying

This site is deployed via GitHub Pages from the root of the `main` branch.

To enable:
1. Go to **Settings** > **Pages** in this repository
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `main` and folder to `/ (root)`
4. Save

The `.nojekyll` file ensures GitHub Pages serves the site without Jekyll processing.

## License

Developed by the Bioinformatics and RNA Interference research groups at the Federal University of Minas Gerais (UFMG), Brazil.
