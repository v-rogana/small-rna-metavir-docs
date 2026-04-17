# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static documentation site for the **small RNA MetaVir** bioinformatics pipeline (viral sequence identification via small RNA profiling). The entire site is a single `index.html` file — all HTML, CSS, and JavaScript are inline. There is no build system, no package manager, and no test suite.

Live site: https://rnai-bioinfo.github.io/small-rna-metavir-docs/
Pipeline source: https://github.com/v-rogana/small-rna-metavir

## Development

There are no build or install steps. To develop:
1. Edit `index.html` directly
2. Open in a browser to preview (or use a local HTTP server for full fidelity)
3. Push to `main` to deploy

## Deployment

GitHub Pages serves from the root of the `main` branch. The `.nojekyll` file disables Jekyll processing. Pushing to `main` triggers automatic deployment.

## Architecture of index.html

**CSS**: All styles in a single `<style>` block. Viridis-derived color palette via CSS custom properties on `:root` — five reference vars (`--v-purple` through `--v-yellow`) plus derived UI vars (`--accent`, `--bg`, `--card`, etc.). Fonts: `--ft` serif, `--fb` sans-serif, `--fc` monospace. Responsive breakpoints at 500px, 700px, and 768px. Viridis gradient used on `h2` border-bottom and footer border-top via `border-image`.

**SVG icon sprite**: Hidden `<svg>` block at top of `<body>` defines `<symbol>` elements (flask, zap, layers, external-link, message, bot). Referenced via `<svg class="icon"><use href="#icon-name"/></svg>`. Icons use `stroke="currentColor"` to inherit context color.

**HTML sections**: Fixed nav bar, hero, then content sections inside `.wrap`: About (`#about`), Pipeline (`#pipeline`), Installation (`#installation`), Parameters (`#parameters`), Examples (`#examples`), Glossary (`#glossary`), footer.

**Scroll animations**: Elements with `.reveal` class fade-in + slide-up (500ms cubic-bezier) when they enter the viewport. Grid containers with `.stagger` class apply incremental `transition-delay` (100ms per child) to `.reveal` children. Hero uses a CSS `@keyframes heroIn` animation on page load. All animations respect `prefers-reduced-motion: reduce`.

**Mermaid diagram**: Pipeline flowchart rendered client-side by Mermaid.js 11 (CDN). Viridis-themed via `%%{init}%%` directive and `classDef` (filter=blue, assembly=teal, similarity=gold, ml=purple, output=green). Edit the flowchart markup directly in the `<pre class="mermaid">` block.

**Chatbot**: Floating button + slide-in panel. Calls OpenAI API (gpt-4o-mini) client-side with a ~2,500-word system prompt containing full pipeline knowledge. API key entered by user at runtime, held only in JS memory. Chat history maintained in a `history` array for the session.

**Navigation highlighting**: IntersectionObserver watches `<section>` elements to set `.active` on nav links.

## External CDN Dependencies

- Mermaid.js 11: `cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js`
- Google Fonts: Fraunces (headings), Inter (body), JetBrains Mono (code)
