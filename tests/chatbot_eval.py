"""Statistical evaluation of the small RNA MetaVir chatbot.

Pipeline:
  1. Load the system prompt from src/data/chatbotPrompt.ts (single source of truth).
  2. Load the benchmark from tests/chatbot_benchmark.json.
  3. For each question, query the OpenAI API K times (default K=5).
  4. Score each response with three metrics:
       - keyword_recall : fraction of expected_keywords present (offtopic excluded).
       - language_match : answer language matches the question language.
       - refusal        : answer admits uncertainty / refuses (offtopic only).
  5. For each category, compute mean + 95% bootstrap CI and a one-sided
     binomial test against H0: mean recall <= 0.5.
  6. Save raw responses to tests/results/runs/<ts>.jsonl, summary stats to
     tests/results/summary.json, and a figure to tests/figures/chatbot_eval.png.

Usage:
    OPENAI_API_KEY=sk-... python tests/chatbot_eval.py --seed 42 --k 5
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

try:
    from openai import OpenAI
except ImportError:
    print("Install deps: pip install -r tests/requirements.txt", file=sys.stderr)
    raise

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
PROMPT_TS = REPO / "src" / "data" / "chatbotPrompt.ts"
BENCHMARK = HERE / "chatbot_benchmark.json"
RESULTS_DIR = HERE / "results"
RUNS_DIR = RESULTS_DIR / "runs"
FIGURES_DIR = HERE / "figures"

REFUSAL_TOKENS = [
    "fora do escopo", "fora do meu escopo", "não posso", "nao posso",
    "não tenho", "nao tenho", "não sei", "nao sei", "desculp",
    "out of scope", "outside my scope", "i can't", "i cannot",
    "i don't", "i do not", "not related", "unrelated", "i'm not able",
    "this is not", "fora do contexto",
]

PT_STOPWORDS = {
    "a", "o", "as", "os", "de", "do", "da", "dos", "das", "que", "para",
    "com", "uma", "um", "no", "na", "nos", "nas", "é", "são", "ser", "está",
    "como", "isso", "você", "não", "também", "mais", "muito",
    "qual", "quais", "porque", "porquê",
}
EN_STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "of", "to", "in", "on",
    "for", "with", "and", "or", "but", "this", "that", "these", "those",
    "it", "as", "by", "be", "which", "what", "you", "your", "i", "we",
    "not", "do", "does", "have", "has",
}


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return text.lower()


def load_system_prompt() -> str:
    src = PROMPT_TS.read_text(encoding="utf-8")
    m = re.search(r"CHATBOT_SYSTEM_PROMPT\s*=\s*`([\s\S]*?)`;", src)
    if not m:
        raise RuntimeError(f"Could not extract CHATBOT_SYSTEM_PROMPT from {PROMPT_TS}")
    return m.group(1).replace("\\`", "`")


def keyword_recall(answer: str, keywords: list[str]) -> float:
    if not keywords:
        return float("nan")
    a = normalize(answer)
    hits = sum(1 for kw in keywords if normalize(kw) in a)
    return hits / len(keywords)


def detect_language(text: str) -> str:
    tokens = re.findall(r"[A-Za-zÀ-ÿ]+", text.lower())
    if not tokens:
        return "unknown"
    pt_hits = sum(1 for t in tokens if t in PT_STOPWORDS)
    en_hits = sum(1 for t in tokens if t in EN_STOPWORDS)
    if pt_hits == 0 and en_hits == 0:
        return "unknown"
    return "pt" if pt_hits >= en_hits else "en"


def is_refusal(text: str) -> bool:
    a = text.lower()
    return any(tok in a for tok in REFUSAL_TOKENS)


def call_openai(client: OpenAI, system_prompt: str, question: str, seed: int) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        max_tokens=1500,
        temperature=0.4,
        seed=seed,
    )
    return resp.choices[0].message.content or ""


def bootstrap_ci(values: np.ndarray, n_resamples: int = 10_000, rng: np.random.Generator | None = None) -> tuple[float, float]:
    rng = rng or np.random.default_rng(0)
    if len(values) == 0:
        return (float("nan"), float("nan"))
    idx = rng.integers(0, len(values), size=(n_resamples, len(values)))
    means = values[idx].mean(axis=1)
    return (float(np.percentile(means, 2.5)), float(np.percentile(means, 97.5)))


def run(args: argparse.Namespace) -> None:
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY not set in environment.", file=sys.stderr)
        sys.exit(1)

    bench = json.loads(BENCHMARK.read_text(encoding="utf-8"))
    items = bench["items"]
    system_prompt = load_system_prompt()

    client = OpenAI(api_key=api_key)
    rng = np.random.default_rng(args.seed)

    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    raw_path = RUNS_DIR / f"{ts}.jsonl"
    print(f"Running {len(items)} questions x k={args.k} = {len(items) * args.k} API calls")
    print(f"Raw responses -> {raw_path}")

    rows: list[dict] = []
    with raw_path.open("w", encoding="utf-8") as fout:
        for item in items:
            for rep in range(args.k):
                seed = int(rng.integers(0, 2**31 - 1))
                t0 = time.time()
                try:
                    answer = call_openai(client, system_prompt, item["question"], seed)
                    err = None
                except Exception as e:
                    answer = ""
                    err = str(e)
                row = {
                    "id": item["id"],
                    "category": item["category"],
                    "language": item["language"],
                    "rep": rep,
                    "seed": seed,
                    "question": item["question"],
                    "answer": answer,
                    "error": err,
                    "elapsed_s": round(time.time() - t0, 3),
                    "expected_keywords": item["expected_keywords"],
                }
                if item["category"] != "offtopic":
                    row["keyword_recall"] = keyword_recall(answer, item["expected_keywords"])
                else:
                    row["keyword_recall"] = float("nan")
                row["lang_detected"] = detect_language(answer)
                row["lang_match"] = int(row["lang_detected"] == item["language"])
                row["refusal"] = int(is_refusal(answer))
                fout.write(json.dumps(row, ensure_ascii=False) + "\n")
                rows.append(row)
                print(f"  [{item['id']}] rep {rep+1}/{args.k} recall={row['keyword_recall']!s:>5} "
                      f"lang_match={row['lang_match']} refusal={row['refusal']} ({row['elapsed_s']}s)")

    # Aggregate per category.
    categories = sorted({r["category"] for r in rows})
    summary: dict = {
        "model": "gpt-4o-mini", "k": args.k, "seed": args.seed,
        "n_questions": len(items), "timestamp": ts, "categories": {},
    }
    for cat in categories:
        cat_rows = [r for r in rows if r["category"] == cat]
        if cat == "offtopic":
            primary = np.array([r["refusal"] for r in cat_rows], dtype=float)
            metric_name = "refusal_rate"
        else:
            primary = np.array(
                [r["keyword_recall"] for r in cat_rows if not np.isnan(r["keyword_recall"])],
                dtype=float,
            )
            metric_name = "keyword_recall"
        mean = float(primary.mean()) if len(primary) else float("nan")
        ci_lo, ci_hi = bootstrap_ci(primary, rng=rng)
        # Binomial test: H0: success rate <= 0.5.
        successes = int((primary >= 0.5).sum())
        n = len(primary)
        if n > 0:
            p_value = stats.binomtest(successes, n, p=0.5, alternative="greater").pvalue
        else:
            p_value = float("nan")
        lang_match = float(np.mean([r["lang_match"] for r in cat_rows]))
        summary["categories"][cat] = {
            "metric": metric_name, "n": n, "mean": mean,
            "ci95_lo": ci_lo, "ci95_hi": ci_hi,
            "p_value_vs_0.5": p_value, "lang_match_rate": lang_match,
        }

    summary_path = RESULTS_DIR / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSummary -> {summary_path}")
    print(json.dumps(summary["categories"], indent=2, ensure_ascii=False))

    # Figure.
    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(8, 7), gridspec_kw={"height_ratios": [3, 1]}
    )
    cat_order = ["biology", "pipeline_steps", "parameters", "outputs", "offtopic"]
    cat_order = [c for c in cat_order if c in summary["categories"]]
    means = [summary["categories"][c]["mean"] for c in cat_order]
    los = [summary["categories"][c]["mean"] - summary["categories"][c]["ci95_lo"] for c in cat_order]
    his = [summary["categories"][c]["ci95_hi"] - summary["categories"][c]["mean"] for c in cat_order]
    pvals = [summary["categories"][c]["p_value_vs_0.5"] for c in cat_order]
    metrics = [summary["categories"][c]["metric"] for c in cat_order]
    colors = ["#3b528b", "#21918c", "#a89320", "#5ec962", "#7a4ba8"][: len(cat_order)]

    y = np.arange(len(cat_order))
    ax1.barh(y, means, xerr=[los, his], color=colors, alpha=0.85,
             edgecolor="#1b2422", capsize=4)
    ax1.axvline(0.5, color="#56635f", linestyle="--", linewidth=1, label="baseline (0.5)")
    ax1.set_yticks(y)
    ax1.set_yticklabels([f"{c}\n({m})" for c, m in zip(cat_order, metrics)])
    ax1.set_xlim(0, 1.05)
    ax1.set_xlabel("score (mean ± 95% bootstrap CI)")
    ax1.set_title(
        f"sRNA MetaVir chatbot evaluation — gpt-4o-mini, k={args.k} reps, "
        f"{len(items)} questions"
    )
    for i, (m, p) in enumerate(zip(means, pvals)):
        label = f"  μ={m:.2f}  p={p:.3g}" if not np.isnan(p) else f"  μ={m:.2f}"
        ax1.text(min(m + his[i] + 0.02, 1.02), i, label, va="center", fontsize=9)
    ax1.legend(loc="lower right", fontsize=8)
    ax1.grid(axis="x", alpha=0.25)

    # Confusion matrix for language fidelity.
    langs = ["pt", "en"]
    cm = np.zeros((2, 2), dtype=int)
    for r in rows:
        if r["language"] not in langs:
            continue
        det = r["lang_detected"] if r["lang_detected"] in langs else "en"
        cm[langs.index(r["language"]), langs.index(det)] += 1
    ax2.imshow(cm, cmap="viridis", aspect="auto")
    ax2.set_xticks([0, 1], ["pt", "en"])
    ax2.set_yticks([0, 1], ["pt", "en"])
    ax2.set_xlabel("answer language (detected)")
    ax2.set_ylabel("question language")
    ax2.set_title("Language fidelity confusion matrix")
    for i in range(2):
        for j in range(2):
            ax2.text(j, i, str(cm[i, j]), ha="center", va="center",
                     color="white" if cm[i, j] < cm.max() / 2 else "black", fontsize=11)

    fig.tight_layout()
    fig_path = FIGURES_DIR / "chatbot_eval.png"
    fig.savefig(fig_path, dpi=150)
    print(f"Figure -> {fig_path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=42, help="seed for the RNG that picks per-call seeds")
    parser.add_argument("--k", type=int, default=5, help="repetitions per question")
    args = parser.parse_args()
    run(args)


if __name__ == "__main__":
    main()
