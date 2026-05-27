# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation site for the **small RNA MetaVir** bioinformatics pipeline (viral sequence identification via small RNA profiling). Built with **Next.js 14** (App Router, TypeScript, Tailwind CSS) and exported as a static site for GitHub Pages.

Live site: https://rnai-bioinfo.github.io/small-rna-metavir-docs/
Pipeline source: https://github.com/rnai-bioinfo/small-rna-metavir

## Development

```
npm install
npm run dev      # local dev server at http://localhost:3000
npm run build    # produces ./out/ for static deploy
npm run lint
npm run figures:pipeline   # CLI render of the Mermaid pipeline via @mermaid-js/mermaid-cli
```

## Deployment

`next.config.mjs` sets `output: 'export'` so `npm run build` writes a fully static site to `out/`. GitHub Pages serves from `main`. The `.nojekyll` file in `public/` disables Jekyll processing. `basePath` and `assetPrefix` are driven by `NEXT_PUBLIC_BASE_PATH` for sub-path hosting.

## Architecture

**Routing**: App Router under `src/app/` (`layout.tsx`, `page.tsx`). Single landing page composed of section components from `src/components/`.

**Styling**: Tailwind CSS (`tailwind.config.ts`) with a Viridis-inspired palette (`ink-*`, `cream-*`, plus accent tokens). Global styles and CSS variables in `src/app/globals.css`. Fonts loaded in `layout.tsx`: DM Serif Display (headings), DM Sans (body), JetBrains Mono (code).

**Section components** (`src/components/`):
- `PipelineSection.tsx` — renders the pipeline diagram, legend, and tech-stack table
- `ResultsSection.tsx` — real-sample case study (*Aedes aegypti*, sample `sRNACrnGmqlN`): read funnel, contig classification, top BLASTn hits, two highlight contigs (active siRNA virus vs genome-integrated EVE), aggregate small-RNA signature, and a gallery of real pipeline figures
- Other sections for About, Installation, Parameters, Examples, Glossary
- `ui/` — shared primitives: `Reveal` (scroll-triggered fade-in via `react-intersection-observer` + Framer Motion), `SectionHeading`, `Tag`, etc.

**Results / case-study section**: order in `page.tsx` is About → Pipeline → Installation → Parameters → Examples → **Results** (`#results`) → Glossary; the anchor is mirrored in `NavBar.tsx` (`NAV_LINKS`) and `Footer.tsx` quick links.
- Data lives in `src/data/results.ts` as typed static constants extracted from one example output tree (read funnel, classification buckets, top viral hits, highlight-contig size/coverage arrays, aggregate base distribution, case-study metadata). No runtime parsing — edit this file to swap in a different sample.
- Charts are hand-rolled inline SVG (no charting library) in `src/components/ui/`: `ReadFunnel`, `ClassificationChart`, `SizeProfileChart` (the strand-split size profile, reused for both highlight contigs and the aggregate), and `CoverageTrack`. Colors are hardcoded hex matching the Tailwind viridis tokens; animation comes from wrapping each block in `Reveal`.
- The 3 authentic figures in `public/results/*.svg` are converted from pipeline PDF outputs via PyMuPDF: `pip install pymupdf`, then `fitz.open(pdf)[0].get_svg_image()`. Re-run that one-liner to refresh them; they're referenced by `RAW_FIGURES` in `results.ts` and respect `NEXT_PUBLIC_BASE_PATH`.

**Pipeline diagram**: `public/pipeline_refined.drawio.svg`, exported from a draw.io source. The diagram is organized in **four phases** with a Tailwind-style palette: Phase 1 — Preprocessing & Filtering (sky), Phase 2 — De Novo Assembly (green), Phase 3 — Meta-Assembly & Similarity (amber), Phase 4 — Profiling & Classification (purple). `PipelineSection.tsx` loads it via `<img>` and respects `NEXT_PUBLIC_BASE_PATH` for sub-path hosting. The legend below the diagram mirrors the chip colors from the SVG so readers can map phases at a glance.

To edit the diagram: open the SVG at [app.diagrams.net](https://app.diagrams.net) (drawio embeds the editable XML inside the SVG via the `content` attribute), refine, then File → Export as → SVG and overwrite `public/pipeline_refined.drawio.svg`. If you also want to update the legend colors, edit the `PHASES` array in `src/components/PipelineSection.tsx`.

**Legacy Mermaid (not rendered)**: `src/data/pipelineMermaid.ts` and the `mermaid` npm dependency remain only to support the `npm run figures:pipeline` CLI script (`tests/render-pipeline.mjs`), which produces a PNG/SVG of the older Mermaid flowchart for external/static use. The Mermaid diagram is no longer shown on the page.

**Scroll animations**: `Reveal` wrapper handles fade-in + slide-up on intersection. Respects `prefers-reduced-motion`.

**Chatbot**: Calls OpenAI API (gpt-4o-mini) client-side with a system prompt containing pipeline knowledge. API key entered at runtime, held only in JS memory.

## Key Dependencies

- `next` 14.2 (App Router, static export)
- `mermaid` 11 — used only by the `figures:pipeline` CLI script, not bundled in the page
- `framer-motion`, `react-intersection-observer` — scroll animations
- `lucide-react` — icons
- `react-markdown`, `remark-gfm` — markdown rendering
- `@mermaid-js/mermaid-cli` (dev) — used by `tests/render-pipeline.mjs` for `figures:pipeline`
