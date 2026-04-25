import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The rise and critique of automatic translation and summarization metrics</h2>
            <p>
                Before neural machine translation became dominant, evaluating translation quality required expensive human judgments. BLEU and ROUGE changed that by providing automatic, reproducible, and cheap metrics that correlate reasonably well with human assessments. They became the standard benchmarks of the 2000s and 2010s, though modern research has increasingly questioned their limitations and moved toward neural and human evaluation methods.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2002</div>
                    <div className="ch-tl-section-label">Translation metric</div>
                    <div className="ch-tl-title">BLEU — Papineni, Roukos, Ward &amp; Zhu (IBM)</div>
                    <div className="ch-tl-body">
                        <p>
                            Kishore Papineni, Salim Roukos, Todd Ward, and Wei-Jing Zhu at IBM published "BLEU: a Method for Automatic Evaluation of Machine Translation" at ACL 2002. The problem they addressed was practical and urgent: IBM's MT group needed to evaluate dozens of system variations quickly, and human evaluation (which required bilingual judges rating translation quality on a 5-point scale) was expensive, slow, and inconsistent between judges.
                        </p>
                        <p>
                            BLEU's core idea was elegant: count how many contiguous word sequences (n-grams) in the machine translation appear in any of several reference human translations. Unigrams capture vocabulary accuracy, bigrams and trigrams capture local fluency, 4-grams capture longer phrases. The counts are clipped to prevent a pathological strategy of repeating high-frequency words. All four n-gram precisions are combined geometrically, and a brevity penalty discourages short translations that game the precision scores.
                        </p>
                        <p>
                            On their development data, BLEU correlated well with human judgments — the system with the highest BLEU score was also the system that human judges preferred. This was enough to establish BLEU as the standard metric. Within a few years it was ubiquitous: every MT paper reported BLEU, and gains of 0.5–1.0 BLEU points on WMT benchmarks were considered meaningful research contributions. The metric became so dominant that optimizing BLEU displaced human judgment as the primary research objective — a Goodhart's Law situation that would cause problems as the field matured.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default MT evaluation metric for nearly two decades; enabled rapid iteration and comparison across MT systems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2004</div>
                    <div className="ch-tl-section-label">Summarization metric</div>
                    <div className="ch-tl-title">ROUGE — Lin (USC Information Sciences Institute)</div>
                    <div className="ch-tl-body">
                        <p>
                            Chin-Yew Lin introduced ROUGE (Recall-Oriented Understudy for Gisting Evaluation) for automatic summarization evaluation at ACL 2004. The design philosophy was the complement of BLEU: while BLEU is precision-focused (what fraction of the candidate's n-grams appear in the reference?), ROUGE is recall-focused (what fraction of the reference's n-grams appear in the candidate?). For summarization, recall is the more natural objective — a good summary should cover the important content of the reference, even if it includes extra words.
                        </p>
                        <p>
                            ROUGE comes in several variants. ROUGE-1 counts unigram overlap: what fraction of words in the reference appear in the summary? ROUGE-2 counts bigram overlap: what fraction of two-word sequences are shared? ROUGE-L uses the longest common subsequence (LCS) — the longest sequence of words that appear in both reference and candidate in the same order, but not necessarily contiguously. LCS-based scoring captures word order without requiring exact phrase matches, making it more robust to paraphrasing.
                        </p>
                        <p>
                            ROUGE-L became particularly valuable for evaluating abstractive summarization — systems that paraphrase rather than copy sentences from the source — because it doesn't penalize valid paraphrases as harshly as n-gram counting. As abstractive summarization models improved, ROUGE-L's tolerance for paraphrase became increasingly important. Today ROUGE-1, ROUGE-2, and ROUGE-L are reported together as a standard suite in nearly every summarization paper.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Standard evaluation metric for summarization; ROUGE-L's LCS approach enables more robust evaluation of paraphrasing systems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2005</div>
                    <div className="ch-tl-section-label">Alternative MT metric</div>
                    <div className="ch-tl-title">METEOR — Banerjee &amp; Lavie (CMU)</div>
                    <div className="ch-tl-body">
                        <p>
                            Satanjeev Banerjee and Alon Lavie at Carnegie Mellon University published METEOR (Metric for Evaluation of Translation with Explicit ORdering) to address BLEU's known weaknesses. METEOR incorporated several features BLEU lacked: stemming (matching "runs" with "run"), synonym matching (matching "large" with "big" using WordNet), and explicit recall component (not just precision). METEOR also computes an explicit alignment between candidate and reference words before scoring.
                        </p>
                        <p>
                            METEOR consistently correlated better with human judgments than BLEU in evaluations on news translation tasks. It was particularly better at capturing semantic equivalence between paraphrases. However, its dependence on WordNet made it language-dependent (high-quality synonym data existed mainly for English), and its more complex computation made it slower to run at scale. These practical limitations prevented METEOR from displacing BLEU despite its better correlation with human judgment on English MT tasks.
                        </p>
                        <p>
                            METEOR's contribution was less in its adoption and more in demonstrating that synonym matching and stemming could improve automatic metric quality — a lesson that would inform all subsequent work on MT evaluation and eventually motivate the move to neural embedding-based metrics that capture semantic similarity more generally.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that synonym matching improves metric correlation; influenced design of all subsequent MT metrics</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Character-level metric</div>
                    <div className="ch-tl-title">chrF — Popovic (Saarland University)</div>
                    <div className="ch-tl-body">
                        <p>
                            Maja Popovic introduced chrF (character n-gram F-score) to address BLEU's word-level granularity, which handles morphologically rich languages (German, Finnish, Turkish, Arabic) poorly. In morphologically rich languages, a word like the German "Entscheidungsträger" ("decision maker") will never match a BLEU n-gram if the exact form is missing, even if "Entscheidung" and "Träger" appear separately. Character n-grams capture partial matches and morphological similarity naturally.
                        </p>
                        <p>
                            chrF computes precision and recall over character n-grams (typically 1-6 character sequences) rather than word n-grams. The resulting F-score balances precision and recall, analogous to ROUGE-L but at the character level. Studies showed chrF correlated better than BLEU with human judgment on morphologically rich target languages, and matched or exceeded BLEU correlation on English.
                        </p>
                        <p>
                            chrF++ (2017) added word n-grams to the character n-gram mix, providing a hybrid metric. sacreBleu — the standard BLEU implementation used in modern MT research — also includes chrF as a built-in metric, making it easy to report alongside BLEU. For any MT task involving highly inflected target languages, chrF is now the preferred complement to BLEU.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Better MT evaluation for morphologically rich languages; now standard alongside BLEU in multilingual MT evaluation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020</div>
                    <div className="ch-tl-section-label">Neural metrics</div>
                    <div className="ch-tl-title">BERTScore — Zhang et al.</div>
                    <div className="ch-tl-body">
                        <p>
                            Tianyi Zhang, Varsha Kishore, Felix Wu, Kilian Q. Weinberger, and Yoona Artzi published BERTScore at ICLR 2020. The key insight: instead of counting exact word matches, use contextual embeddings from BERT to measure semantic similarity between candidate and reference tokens. A candidate token and a reference token are matched using their cosine similarity in BERT's embedding space — "large" and "big" will have high cosine similarity because BERT learned them from similar contexts.
                        </p>
                        <p>
                            BERTScore computes precision (average max-similarity of each candidate token to any reference token), recall (average max-similarity of each reference token to any candidate token), and F1 combining them. Because embeddings capture semantic meaning rather than surface form, BERTScore is robust to synonym substitution, paraphrasing, and minor grammatical variation — all cases where BLEU fails. On standard correlation benchmarks, BERTScore significantly outperformed BLEU in correlation with human judgment.
                        </p>
                        <p>
                            The limitation: BERTScore is expensive to compute (requires running BERT inference), model-dependent (results vary with which BERT variant is used), and slightly harder to interpret (there's no obvious unit the way "n-gram overlap" provides). Despite these limitations, BERTScore adoption has grown rapidly and it is now standard in summarization and MT evaluation alongside BLEU and ROUGE.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: First widely adopted neural metric; demonstrated that embedding-based evaluation significantly outperforms n-gram matching in human correlation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present</div>
                    <div className="ch-tl-section-label">Human and model evaluation</div>
                    <div className="ch-tl-title">COMET, MQM, and LLM-as-a-Judge</div>
                    <div className="ch-tl-body">
                        <p>
                            COMET (Crosslingual Optimized Metric for Evaluation of Translation), developed by Ricardo Rei and colleagues and published at EMNLP 2020, takes the neural metric approach further: instead of using embeddings from a general-purpose model, COMET trains a neural regressor directly on human quality judgments from the WMT shared task quality estimation tracks. The model takes (source, hypothesis, reference) triples and predicts a human quality score, training on thousands of human-annotated examples.
                        </p>
                        <p>
                            Multidimensional Quality Metrics (MQM) provides a hierarchical taxonomy of translation errors (accuracy, fluency, terminology, style) with severity ratings. Professional translators annotate errors using this framework, producing fine-grained quality assessments that capture what BLEU cannot: the difference between a minor stylistic preference and a factual mistranslation.
                        </p>
                        <p>
                            Most recently, large language models are being used as evaluators — "LLM-as-a-Judge" prompts GPT-4 or Claude to score translations and summaries on multiple dimensions, providing human-like judgments at scale and lower cost than professional annotation. For many tasks, GPT-4 judging correlates better with human judgment than BLEU. This closes the long-standing loop: the models that generate text are now good enough to evaluate text, potentially replacing the n-gram matching shortcuts that BLEU represented for two decades.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Neural and LLM-based evaluation now complement n-gram metrics; COMET and MQM are standard in MT shared tasks alongside BLEU</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why BLEU and ROUGE still matter:</strong> Despite their flaws, BLEU and ROUGE
                remain ubiquitous because they are fast, deterministic, and implementation-independent.
                Modern papers still report them alongside newer metrics so results remain comparable
                to decades of prior work. The correlation problem (BLEU doesn't always agree with human
                judgment) is well-known but acceptable for rapid iteration — BLEU is used to filter
                bad models, not to make final quality assessments.
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> BLEU and ROUGE gave machine translation a quantitative target to optimize. But even with good metrics, Seq2Seq had a fundamental bottleneck: the entire input sentence had to be compressed into a single fixed-size context vector. Long sentences lost critical information. In 2014, Bahdanau et al. proposed attention — allowing the decoder to look back at every encoder state selectively, rather than relying on a single bottleneck vector. Chapter 15 follows the invention and refinement of attention mechanisms.
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
                <em> brevity penalty</em>. She wants you to write a translation that's roughly the
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

            <Analogy label="METEOR — The Smarter Teacher">
                METEOR is like a teacher who has a thesaurus. She knows that "big" and "large"
                are synonyms, so if you write "big" when the answer says "large," she gives you
                partial credit. She also knows that "runs" and "run" are the same word in different
                forms, so she counts those as matches too.
                <br /><br />
                METEOR correlates better with what human judges think of a translation, but it's
                slower and harder to compute — which is why BLEU remained more popular despite
                being dumber about synonyms.
            </Analogy>

            <Analogy label="BERTScore — The Understanding Teacher">
                BERTScore is like a teacher who deeply understands the meaning of words, not just
                their spelling. Instead of checking if "big" and "large" are the same word, it
                checks if they mean the same thing by looking at how they're used across millions
                of sentences. If they're used in similar contexts, they get a high similarity score.
                <br /><br />
                BERTScore uses a powerful language model (BERT) to compare sentences at the level of
                meaning, not just surface spelling. A semantically perfect translation that uses
                different words than the reference will score well on BERTScore but poorly on BLEU.
                The downside: it's slower and harder to compute than simple n-gram counting.
            </Analogy>

            <Analogy label="Why Exact Matching Is Tricky">
                Both BLEU and ROUGE are like teachers who don't understand synonyms. If you write
                "happy" and the answer key says "joyful," you get zero credit. Modern tools like
                BERTScore are like smarter teachers who understand that "happy" and "joyful" mean
                basically the same thing — they give you partial credit.
                <br /><br />
                But the old teachers (BLEU and ROUGE) are still useful because they're fast, fair,
                and everyone knows how to use them. Researchers report scores from both the old
                teachers and the new smart teachers so that their results can be compared to
                20+ years of prior work.
            </Analogy>

            <Analogy label="Human Evaluation — The Gold Standard">
                The most reliable way to evaluate a translation is still to ask a bilingual human
                expert. Human evaluators can judge fluency (does it sound natural?), adequacy (does
                it mean the same thing?), and style (is it appropriate for the domain?). Automatic
                metrics approximate these judgments cheaply.
                <br /><br />
                Modern research uses automatic metrics for quick iteration during development, then
                runs expensive human evaluation on the best systems before publishing results.
                LLM-as-a-judge — using GPT-4 to score translations — is becoming a middle ground:
                better than BLEU, cheaper than human judges, good enough for many purposes.
            </Analogy>

            <Analogy label="What comes next — Paying selective attention">
                BLEU scores let researchers measure translation quality and improve systematically. But Seq2Seq still had one big problem: it had to cram the whole input sentence into a single vector — like a student memorizing an entire book as one summary. Bahdanau's attention mechanism in Chapter 15 gave the decoder a way to look back at every word in the input, consulting the original text exactly when it needed to.
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
                precisions for n = 1 to 4, then multiplying by a brevity penalty. The precision
                for each n-gram order is "modified" — clipped to prevent gaming by repetition:
            </p>
            <ul>
                <li><strong>Modified precision:</strong> count candidate n-grams, but cap each count at the maximum count in any single reference (prevents repeating "the the the" to boost unigram precision)</li>
                <li><strong>Geometric mean:</strong> multiply all four precisions together (not sum) — ensures zero 4-gram overlap collapses the whole score to zero</li>
                <li><strong>Brevity Penalty (BP):</strong> exp(1 − r/c) if candidate shorter than reference, else 1.0</li>
            </ul>

            <h3>ROUGE: Recall-Oriented Understudy for Gisting Evaluation</h3>
            <p>
                ROUGE measures recall: of all n-grams in the reference, how many appear in the
                candidate? Three common variants:
            </p>
            <ul>
                <li><strong>ROUGE-1:</strong> Unigram recall — what fraction of reference words appear in candidate?</li>
                <li><strong>ROUGE-2:</strong> Bigram recall — what fraction of reference bigrams appear in candidate?</li>
                <li><strong>ROUGE-L:</strong> LCS-based — longest common subsequence / reference length. Captures word order without requiring contiguous matches.</li>
            </ul>

            <h3>BERTScore — Embedding-Based Similarity</h3>
            <p>
                BERTScore uses contextual token embeddings (from BERT or similar models) rather than
                exact word matching. For each token in the candidate, find the most similar token in
                the reference (by cosine similarity). Average these max-similarities for precision,
                recall, and F1:
            </p>
            <ul>
                <li><strong>Precision:</strong> average max cosine similarity of each candidate token to any reference token</li>
                <li><strong>Recall:</strong> average max cosine similarity of each reference token to any candidate token</li>
                <li><strong>F1:</strong> harmonic mean of precision and recall</li>
            </ul>

            <h3>Metric Comparison</h3>
            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Orientation</th>
                        <th>Handles Synonyms</th>
                        <th>Typical Use</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BLEU</td>
                        <td>Precision</td>
                        <td>No</td>
                        <td>MT</td>
                    </tr>
                    <tr>
                        <td>ROUGE-1/2</td>
                        <td>Recall</td>
                        <td>No</td>
                        <td>Summarization</td>
                    </tr>
                    <tr>
                        <td>ROUGE-L</td>
                        <td>F1 (LCS)</td>
                        <td>Partially</td>
                        <td>Summarization</td>
                    </tr>
                    <tr>
                        <td>METEOR</td>
                        <td>F1</td>
                        <td>Yes (WordNet)</td>
                        <td>MT (English)</td>
                    </tr>
                    <tr>
                        <td>chrF</td>
                        <td>F1</td>
                        <td>Partially</td>
                        <td>MT (morphologically rich)</td>
                    </tr>
                    <tr>
                        <td>BERTScore</td>
                        <td>F1</td>
                        <td>Yes (embeddings)</td>
                        <td>MT, summarization</td>
                    </tr>
                </tbody>
            </table>

            <h3>The Correlation Problem</h3>
            <p>
                BLEU does not always agree with human judgment, especially for high-quality systems.
                As MT quality improved past a certain threshold, systems with higher BLEU were no longer
                consistently preferred by human judges. This is Goodhart's Law in action: when a measure
                becomes a target, it ceases to be a good measure. Research optimized for BLEU in ways
                that did not always translate to human-perceived quality improvements.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Both BLEU and ROUGE share a critical weakness:</strong> they are surface-form metrics.
                They count exact word matches and cannot recognize paraphrases, synonyms, or meaning
                equivalence that doesn't share the same words. A translation that is semantically
                perfect but lexically different will score poorly on both. BERTScore and COMET
                address this by operating in semantic space, but at higher computational cost.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations · proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · NumPy · PyTorch</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

function MathsContent() {
    return (
        <>
            <h2>Formal definitions of BLEU, ROUGE, and BERTScore</h2>

            <DefBlock label="BLEU Score (Papineni et al., 2002)">
                Let c be the candidate length and r the closest reference length.
                The brevity penalty is:
                <MathBlock tex="\text{BP} = \begin{cases} 1 & \text{if } c > r \\ \exp(1 - r/c) & \text{if } c \leq r \end{cases}" />
                The modified n-gram precision p<sub>n</sub> is the count of matched n-grams
                clipped by reference maxima, divided by total candidate n-grams. The BLEU score is:
                <MathBlock tex="\text{BLEU} = \text{BP} \cdot \exp\!\left(\sum_{n=1}^{N} w_n \log p_n\right)" />
                where w<sub>n</sub> = 1/N (uniform weights, typically N = 4).
            </DefBlock>

            <h3>Modified N-gram Precision</h3>
            <MathBlock tex="p_n = \frac{\sum_{g \in \text{candidate}} \min\!\left(C_n(g, \text{cand}),\; \max_r C_n(g, r)\right)}{\sum_{g \in \text{candidate}} C_n(g, \text{cand})}" />

            <h3>ROUGE-L: Longest Common Subsequence</h3>
            <p>
                Let X be the reference (length m) and Y the candidate (length n).
                Let LCS(X, Y) be the length of the longest common subsequence.
            </p>
            <MathBlock tex="R_{\text{LCS}} = \frac{\text{LCS}(X, Y)}{m}, \qquad P_{\text{LCS}} = \frac{\text{LCS}(X, Y)}{n}" />
            <MathBlock tex="\text{ROUGE-L} = \frac{(1 + \beta^2) \cdot R_{\text{LCS}} \cdot P_{\text{LCS}}}{R_{\text{LCS}} + \beta^2 \cdot P_{\text{LCS}}}" />
            <p>where β controls recall/precision balance (typically β = 1 for balanced F1).</p>

            <h3>BERTScore</h3>
            <MathBlock tex="\text{BERTScore-P} = \frac{1}{|{\hat{y}}|}\sum_{\hat{y}_j \in \hat{y}} \max_{y_i \in y} \cos(\mathbf{e}_{\hat{y}_j}, \mathbf{e}_{y_i})" />
            <MathBlock tex="\text{BERTScore-R} = \frac{1}{|y|}\sum_{y_i \in y} \max_{\hat{y}_j \in \hat{y}} \cos(\mathbf{e}_{y_i}, \mathbf{e}_{\hat{y}_j})" />
            <p>
                where e<sub>y_i</sub> are contextual token embeddings from BERT. The F1 is the harmonic
                mean. Importance weighting using IDF can down-weight common function words.
            </p>

            <div className="ch-callout">
                <strong>Smoothing note:</strong> When a candidate contains no matching 4-grams,
                p<sub>4</sub> = 0 and BLEU collapses to zero. Smoothing techniques (e.g., add-1 smoothing
                or the Chen &amp; Cherry 2014 smoothing) add a small constant to zero precisions to avoid
                this collapse, especially for short sentences where 4-gram matches are rare by chance.
                sacreBleu supports multiple smoothing methods for reproducible BLEU reporting.
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

function PythonContent() {
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
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
