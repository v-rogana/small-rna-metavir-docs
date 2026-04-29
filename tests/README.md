# tests/ — figuras reprodutíveis

Duas pipelines independentes:

1. **`pipeline.png`** — diagrama do pipeline a partir do markup Mermaid em `src/data/pipelineMermaid.ts`.
2. **`chatbot_eval.png`** — avaliação estatística do chatbot (gpt-4o-mini) contra um benchmark fechado de 30 perguntas.

## 1. Figura do pipeline

```bash
npm install                # instala @mermaid-js/mermaid-cli (devDependency)
npm run figures:pipeline   # gera tests/figures/pipeline.{png,svg}
```

`tests/render-pipeline.mjs` extrai o template literal `PIPELINE_MERMAID` do TS, escreve em `tests/pipeline.mmd` (gitignored) e chama `mmdc`. Se você editar o diagrama no site, basta rodar de novo — não há fonte duplicada.

## 2. Avaliação estatística do chatbot

### Setup

```bash
python -m venv tests/.venv
# Windows
tests\.venv\Scripts\activate
# macOS/Linux
source tests/.venv/bin/activate

pip install -r tests/requirements.txt
```

### Execução

```bash
export OPENAI_API_KEY=sk-...   # ou setx OPENAI_API_KEY ... no Windows
python tests/chatbot_eval.py --seed 42 --k 5
```

Custo: ~150 chamadas a gpt-4o-mini, ~US$ 0,05–0,10 por execução.

### O que ele faz

- Lê o **mesmo system prompt** que o site usa em runtime (extraído de `src/data/chatbotPrompt.ts`) — sem duplicação.
- Roda cada pergunta de `chatbot_benchmark.json` `k` vezes contra a API.
- Calcula 3 métricas por resposta:
  - `keyword_recall` — fração das `expected_keywords` presentes (objetivo, reprodutível).
  - `language_match` — idioma da resposta bate com o da pergunta (heurística por stopwords PT vs EN).
  - `refusal` — para a categoria `offtopic`, detecta se a resposta recusa/redireciona.
- Por categoria: média + **IC 95% via bootstrap** (10 000 resamples) + **teste binomial unilateral** contra H0 = 0.5.

### Outputs

- `tests/results/runs/<timestamp>.jsonl` — todas as respostas brutas, gitignored.
- `tests/results/summary.json` — médias, ICs, p-valores por categoria.
- `tests/figures/chatbot_eval.png` — barras horizontais com IC + matriz de confusão de idioma.

### Reprodutibilidade

A flag `--seed` controla os seeds repassados para a API em cada chamada, mas o gpt-4o-mini só garante reprodutibilidade *aproximada* (não bit-exact) mesmo com seed fixo. Diferenças entre execuções devem ficar dentro do IC reportado.

### Editar o benchmark

`chatbot_benchmark.json` tem 5 categorias × 6 perguntas. Para adicionar uma pergunta, copie um item e mantenha as `expected_keywords` baseadas em fatos do system prompt ou do `main.pl`. Para a categoria `offtopic`, deixe `expected_keywords: []` — a métrica usada é `refusal` em vez de `keyword_recall`.
