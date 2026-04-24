import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The rise and critique of automatic translation and summarization metrics</h2>
            <p>
                Before neural machine translation became dominant, evaluating translation quality
                required expensive human judgments. BLEU and ROUGE changed that by providing
                automatic, reproducible, and cheap metrics that correlate reasonably well with
                human assessments. They became the standard benchmarks of the 2000s and 2010s,
                though modern research has increasingly questioned their limitations.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2002</div>
                    <div className="ch-tl-section-label">Translation metric</div>
                    <div className="ch-tl-title">BLEU — Papineni, Roukos, Ward & Zhu</div>
                    <div className="ch-tl-body">
                        Kishore Papineni and colleagues at IBM published "BLEU: a Method for Automatic
                        Evaluation of Machine Translation." BLEU scores a candidate translation by
                        counting matching n-grams (contiguous word sequences) against one or more
                        reference translations, then multiplying by a brevity penalty to discourage
                        overly short outputs. It was designed to approximate human judgment at a
                        fraction of the cost.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default MT evaluation metric for nearly two decades</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2004</div>
                    <div className="ch-tl-section-label">Summarization metric</div>
                    <div className="ch-tl-title">ROUGE — Lin</div>
                    <div className="ch-tl-body">
                        Chin-Yew Lin introduced ROUGE (Recall-Oriented Understudy for Gisting Evaluation)
                        for automatic summarization evaluation. While BLEU is precision-focused,
                        ROUGE is recall-focused: it measures how many n-grams from the reference
                        summary appear in the candidate. ROUGE-1 counts unigrams, ROUGE-2 counts
                        bigrams, and ROUGE-L uses the longest common subsequence to capture word
                        order without requiring exact contiguous matches.
                    </div>
                    <div className="ch-tl-impact">Impact: Standard metric for summarization and later for text generation tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2010s</div>
                    <div className="ch-tl-section-label">Dominance and criticism</div>
                    <div className="ch-tl-title">The BLEU ceiling and semantic blindness</div>
                    <div className="ch-tl-body">
                        As neural MT improved, BLEU's limitations became acute. It ignores synonymy
                        ("large" vs. "big" are treated as mismatches), fails to capture semantic
                        equivalence, and rewards fluent but inaccurate translations. Research showed
                        that BLEU correlates poorly with human judgment for high-quality systems.
                        The community began searching for alternatives that evaluate meaning, not
                        just surface-form overlap.
                    </div>
                    <div className="ch-tl-impact">Impact: Sparked a wave of research into semantic evaluation metrics</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019–present</div>
                    <div className="ch-tl-section-label">Modern alternatives</div>
                    <div className="ch-tl-title">BERTScore, COMET, and LLM-as-a-judge</div>
                    <div className="ch-tl-body">
                        BERTScore (Zhang et al., 2019) uses contextual embeddings to measure semantic
                        similarity between candidate and reference tokens, solving the synonymy problem.
                        COMET (Rei et al., 2020) trains a neural regressor on human quality judgments.
                        Most recently, researchers use large language models as judges (LLM-as-a-judge),
                        prompting GPT-4 or Claude to score translations and summaries on multiple
                        dimensions. These methods are more expensive but correlate far better with
                        human assessments.
                    </div>
                    <div className="ch-tl-impact">Impact: Evaluation is shifting from n-gram overlap to deep semantic and neural metrics</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why BLEU and ROUGE still matter:</strong> Despite their flaws, BLEU and ROUGE
                remain ubiquitous because they are fast, deterministic, and implementation-independent.
                Modern papers still report them alongside newer metrics so results remain comparable
                to decades of prior work.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A teacher checking your homework</h2>

            <Analogy label="BLEU: The Strict Translation Teacher">
                Imagine you translated a French sentence into English for homework. Your teacher
                has the "correct" answer written down. She compares your sentence word-for-word
                with hers.
                <br /><br />
                If you write "The big dog ran," and the answer key says "The large dog ran," she
                marks "big" as wrong because it's not the exact same word. Even though "big" and
                "large" mean the same thing! BLEU is that strict teacher. It only cares about exact
                word matches, not meaning.
                <br /><br />
                If your translation is too short, she also takes off extra points — that's the
                <em>brevity penalty</em>. She wants you to write a translation that's roughly the
                same length as the correct one.
            </Analogy>

            <Analogy label="ROUGE: The Summary Checker">
                Now imagine you wrote a summary of a long article. Your teacher checks how many
                important words from the original article made it into your summary. If the original
                says "The spaceship launched into orbit" and your summary says "The rocket entered
                orbit," ROUGE notices that "orbit" matched but "spaceship/rocket" and "launched/entered"
                didn't match exactly.
                <br /><br />
                ROUGE is especially focused on <em>recall</em>: did you include enough of the important
                words? It's less worried about whether you added extra words (unlike BLEU, which
                punishes extra words harshly). That's why ROUGE is used for summaries, where being
                comprehensive matters more than being concise.
            </Analogy>

            <Analogy label="Why Exact Matching Is Tricky">
                Both BLEU and ROUGE are like teachers who don't understand synonyms. If you write
                "happy" and the answer key says "joyful," you get zero credit. Modern tools like
                BERTScore are like smarter teachers who understand that "happy" and "joyful" mean
                basically the same thing — they give you partial credit.
                <br /><br />
                But the old teachers (BLEU and ROUGE) are still useful because they're fast, fair,
                and everyone knows how to use them. Researchers report scores from both the old
                teachers and the new smart teachers.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>N-gram overlap, brevity penalty, and recall-oriented scoring</h2>

            <h3>BLEU: Bilingual Evaluation Understudy</h3>
            <p>
                BLEU scores a candidate translation by computing the geometric mean of n-gram
                precisions for n = 1 to 4, then multiplying by a brevity penalty that penalizes
                candidates shorter than the reference.
            </p>
            <ul>
                <li><strong>Precision:</strong> Of all n-grams in the candidate, how many appear in any reference?</li>
                <li><strong>Modified precision:</strong> Counts are clipped to the maximum frequency in any single reference (prevents over-rewarding repeated words).</li>
                <li><strong>Brevity Penalty (BP):</strong> If the candidate is shorter than the reference, the score is scaled down.</li>
            </ul>
            <p>
                A BLEU score ranges from 0 to 1 (or 0 to 100). Human translations typically score
                30–50 on news-domain test sets.
            </p>

            <h3>ROUGE: Recall-Oriented Understudy for Gisting Evaluation</h3>
            <p>
                ROUGE measures recall: of all n-grams in the reference, how many appear in the
                candidate? This makes it ideal for summarization, where the goal is to cover as
                much reference content as possible.
            </p>
            <ul>
                <li><strong>ROUGE-1:</strong> Overlap of unigrams (single words).</li>
                <li><strong>ROUGE-2:</strong> Overlap of bigrams (two-word sequences).</li>
                <li><strong>ROUGE-L:</strong> Longest Common Subsequence (LCS) — captures word order without requiring exact contiguous matching.</li>
            </ul>

            <h3>Key Differences</h3>
            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>BLEU</th>
                        <th>ROUGE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Primary orientation</td>
                        <td>Precision</td>
                        <td>Recall</td>
                    </tr>
                    <tr>
                        <td>Brevity penalty</td>
                        <td>Yes</td>
                        <td>No</td>
                    </tr>
                    <tr>
                        <td>Typical use</td>
                        <td>Machine translation</td>
                        <td>Summarization</td>
                    </tr>
                    <tr>
                        <td>Captures fluency</td>
                        <td>Strongly (via high-order n-grams)</td>
                        <td>Weakly (ROUGE-L only)</td>
                    </tr>
                </tbody>
            </table>

            <div className="ch-callout">
                <strong>Both metrics share a critical weakness:</strong> they are surface-form metrics.
                They count exact word matches and cannot recognize paraphrases, synonyms, or meaning
                equivalence that doesn't share the same words. A translation that is semantically
                perfect but lexically different will score poorly on both.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal definitions of BLEU and ROUGE</h2>

            <DefBlock label="BLEU Score (Papineni et al., 2002)">
                Let <em>c</em> be the candidate length and <em>r</em> the closest reference length.
                The brevity penalty is:
                <MathBlock tex="\text{BP} = \begin{cases} 1 & \text{if } c > r \\ \exp(1 - r/c) & \text{if } c \leq r \end{cases}" />
                The modified n-gram precision <em>p<sub>n</sub></em> is the count of matched n-grams
                clipped by reference maxima, divided by total candidate n-grams. The BLEU score is:
                <MathBlock tex="\text{BLEU} = \text{BP} \cdot \exp\!\left(\sum_{n=1}^{N} w_n \log p_n\right)" />
                where <em>w<sub>n</sub> = 1/N</em> (uniform weights, typically N = 4).
            </DefBlock>

            <h3>N-gram Precision Details</h3>
            <p>
                For each n-gram order <em>n</em>, let <em>C<sub>n</sub></em> be the count of each
                n-gram in the candidate and <em>R<sub>n</sub></em> its count in the reference.
                The clipped count is:
            </p>
            <MathBlock tex="\text{Count}_{\text{clip}}(n\text{-gram}) = \min\big(C_n(n\text{-gram}),\; R_n(n\text{-gram})\big)" />
            <p>
                Modified precision:
            </p>
            <MathBlock tex="p_n = \frac{\sum_{g \in \text{candidate}} \text{Count}_{\text{clip}}(g)}{\sum_{g \in \text{candidate}} C_n(g)}" />

            <h3>ROUGE-L: Longest Common Subsequence</h3>
            <p>
                Let <em>X</em> be the reference (length <em>m</em>) and <em>Y</em> the candidate
                (length <em>n</em>). Let <em>LCS(X, Y)</em> be the length of the longest common
                subsequence. ROUGE-L precision and recall are:
            </p>
            <MathBlock tex="R_{\text{LCS}} = \frac{\text{LCS}(X, Y)}{m}, \qquad P_{\text{LCS}} = \frac{\text{LCS}(X, Y)}{n}" />
            <p>
                The F1 score:
            </p>
            <MathBlock tex="\text{ROUGE-L} = \frac{(1 + \beta^2) \cdot R_{\text{LCS}} \cdot P_{\text{LCS}}}{R_{\text{LCS}} + \beta^2 \cdot P_{\text{LCS}}}" />
            <p>
                where <em>β</em> controls the relative importance of recall to precision (typically
                <em>β = 1</em> for balanced F1).
            </p>

            <h3>ROUGE-N (N-gram Recall)</h3>
            <MathBlock tex="\text{ROUGE-}N = \frac{\sum_{S \in \{\text{references}\}} \sum_{g \in S} \text{Count}_{\text{match}}(g)}{\sum_{S \in \{\text{references}\}} \sum_{g \in S} C_n(g)}" />
            <p>
                The numerator counts n-grams in references that also appear in the candidate;
                the denominator counts total n-grams in references. This is pure recall — there is
                no brevity penalty and no precision term unless combined into F1.
            </p>

            <div className="ch-callout">
                <strong>Smoothing note:</strong> When a candidate contains no matching 4-grams,
                <em>p<sub>4</sub> = 0</em> and BLEU becomes zero. In practice, smoothing techniques
                (e.g., adding a small constant to zero precisions) are applied to avoid this collapse.
            </div>
        </>
    )
}

const PY_CODE = `from sacrebleu import BLEU
from rouge_score import rouge_scorer

# ── Candidate and references ──────────────────────────────────────────────────
candidate = "The quick brown fox jumps over the lazy dog."
references = [
    "The fast brown fox jumps over the lazy dog.",
    "A quick brown fox leaps over the lazy dog.",
]

# ── BLEU with sacrebleu ───────────────────────────────────────────────────────
print("=" * 50)
print("BLEU Score (sacrebleu)")
print("=" * 50)

bleu = BLEU()
# sacrebleu expects a list of candidates and a list of reference lists
score = bleu.corpus_score([candidate], [[ref] for ref in references])
print(score)

# ── ROUGE with rouge-score ────────────────────────────────────────────────────
print()
print("=" * 50)
print("ROUGE Scores (rouge-score)")
print("=" * 50)

scorer = rouge_scorer.RougeScorer(
    ["rouge1", "rouge2", "rougeL"],
    use_stemmer=True
)

# Compute against the first reference
scores = scorer.score(references[0], candidate)
for key, val in scores.items():
    print(f"{key:10s}  P={val.precision:.4f}  R={val.recall:.4f}  F1={val.fmeasure:.4f}")

# ── Manual n-gram extraction ──────────────────────────────────────────────────
print()
print("=" * 50)
print("Manual n-gram overlap")
print("=" * 50)

from collections import Counter

def ngrams(tokens, n):
    return [tuple(tokens[i:i+n]) for i in range(len(tokens)-n+1)]

def overlap(candidate, reference, n):
    c_ng = Counter(ngrams(candidate.split(), n))
    r_ng = Counter(ngrams(reference.split(), n))
    matches = sum((c_ng & r_ng).values())
    return matches, sum(c_ng.values())

for n in [1, 2, 3]:
    m, total = overlap(candidate, references[0], n)
    print(f"{n}-gram: {m}/{total} match  (precision = {m/total:.4f})")
`

function PythonTab() {
    return (
        <>
            <p>
                Compute BLEU with <code>sacrebleu</code> and ROUGE with <code>rouge-score</code> on
                a toy candidate against two references. Includes manual n-gram extraction to show
                the underlying counting logic.
            </p>
            <CodeBlock code={PY_CODE} filename="bleu_rouge_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const EVALUATION_METRICS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
