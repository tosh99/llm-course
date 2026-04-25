import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Global statistics meet local context windows</h2>
            <p>
                GloVe (Global Vectors for Word Representation) was introduced by Jeffrey Pennington, Richard Socher, and Christopher Manning at Stanford in 2014. It offered a principled criticism of Word2Vec: despite its success, Word2Vec only ever saw local context windows, missing global corpus statistics. GloVe aimed to combine the advantages of two older traditions — matrix factorization methods (like LSA) and local context window methods (like Word2Vec) — by explicitly incorporating global co-occurrence counts into the training objective.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1990s</div>
                    <div className="ch-tl-section-label">Matrix Factorization Era</div>
                    <div className="ch-tl-title">LSA — Latent Semantic Analysis</div>
                    <div className="ch-tl-body">
                        Latent Semantic Analysis (Deerwester et al., 1990) built a term-document or term-term co-occurrence matrix and applied Singular Value Decomposition (SVD) to produce low-dimensional word representations. LSA captures global statistics of the corpus — which words co-occur globally — and produces representations with excellent analogical reasoning. The term-document version became fundamental to information retrieval.
                        <br /><br />
                        LSA's limitations were computational and statistical. SVD of a 100,000 × 100,000 matrix is expensive. Very frequent words (stop words) dominate the matrix statistics, drowning out more informative co-occurrences. And LSA had no principled way to handle the non-linear relationship between co-occurrence counts and semantic similarity.
                    </div>
                    <div className="ch-tl-impact">Context: LSA showed global matrix factorization gives semantic structure; set the stage for GloVe's synthesis</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">The Gap</div>
                    <div className="ch-tl-title">Word2Vec's Local-Only Limitation</div>
                    <div className="ch-tl-body">
                        Word2Vec's Skip-gram and CBOW train on individual (word, context) pairs from a sliding window. Each training step sees only one pair at a time — the global co-occurrence statistics are never explicitly used. A word pair that co-occurs 10,000 times contributes 10,000 individual training examples, each treated identically.
                        <br /><br />
                        This is statistically inefficient: the model needs to see each pair thousands of times to converge to statistics that were already available in the corpus. The global information is implicit — the model will eventually learn it through many local observations — but this wastes computation and may not fully capture subtle statistical patterns that would be obvious in a global view.
                    </div>
                    <div className="ch-tl-impact">Context: Word2Vec's window-based approach is statistically inefficient; GloVe exploits global corpus statistics directly</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Synthesis</div>
                    <div className="ch-tl-title">GloVe — Pennington, Socher, and Manning (EMNLP 2014)</div>
                    <div className="ch-tl-body">
                        Pennington et al. proposed a global matrix factorization approach: first compute the full word-word co-occurrence matrix X (X<sub>ij</sub> = number of times word j appears in context of word i across the entire corpus). Then train embeddings to predict log(X<sub>ij</sub>) using a weighted least-squares objective. The weighting function f(X<sub>ij</sub>) gives less importance to very frequent pairs (which would otherwise dominate) while preserving signal from less frequent but meaningful co-occurrences.
                        <br /><br />
                        The key insight motivating this objective came from studying ratios of co-occurrence probabilities. The ratio P("solid"|"ice") / P("solid"|"steam") is large because ice is solid and steam is not. The ratio P("gas"|"ice") / P("gas"|"steam") is small because steam can be a gas. These ratios encode the relationship between words more cleanly than raw counts, and GloVe's log-bilinear model is designed to capture exactly these ratios in the dot product of word vectors.
                    </div>
                    <div className="ch-tl-impact">Impact: State-of-the-art on word analogy and similarity tasks; combined global statistics with efficient local training; widely adopted for NLP 2014–2018</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Theoretical Unification</div>
                    <div className="ch-tl-title">PMI Equivalence — Levy and Goldberg</div>
                    <div className="ch-tl-body">
                        Shortly after GloVe's publication, Levy and Goldberg (2014) showed that both GloVe and Word2Vec with negative sampling are implicitly factorizing a variant of the Pointwise Mutual Information (PMI) matrix. GloVe does this explicitly through weighted least squares on log co-occurrence counts; Word2Vec does it implicitly through gradient descent on local pairs. Both methods ultimately encode the same global statistical structure — they differ in computational approach rather than the information they use.
                        <br /><br />
                        This theoretical equivalence partially deflated the argument that GloVe is fundamentally different from Word2Vec. In practice, empirical performance on downstream tasks was similar, and researchers began comparing methods based on training efficiency and practical hyperparameter sensitivity rather than theoretical claims.
                    </div>
                    <div className="ch-tl-impact">Impact: Unified GloVe and Word2Vec as PMI factorization methods; shifted research focus to downstream task performance and efficiency</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015–2018</div>
                    <div className="ch-tl-section-label">Impact</div>
                    <div className="ch-tl-title">GloVe in Pre-Transformer NLP</div>
                    <div className="ch-tl-body">
                        GloVe vectors became one of the two standard initializations for NLP models (alongside Word2Vec) in the pre-Transformer era. Stanford released pre-trained GloVe vectors at multiple scales: Wikipedia+Gigaword (6B tokens, 400K vocab, dimensions 50/100/200/300), Common Crawl (42B and 840B tokens, 300 dimensions), and Twitter (27B tokens, 200 dimensions). The 840B Common Crawl vectors were downloaded millions of times.
                        <br /><br />
                        Nearly every NLP paper from 2014–2018 either initialized embeddings with GloVe or Word2Vec and reported which was better for the specific task. GloVe typically performed slightly better on analogy tasks; Word2Vec slightly better on some classification tasks. Both were superseded by ELMo (2018) and BERT (2018) for most applications, but GloVe remains valuable for tasks where lightweight, non-contextual embeddings are preferred.
                    </div>
                    <div className="ch-tl-impact">Impact: Standard pre-trained embedding for NLP 2015–2018; 840B Common Crawl vectors still widely used for lightweight models</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>GloVe in practice:</strong> The final GloVe embedding for a word is typically w<sub>i</sub> + w̃<sub>i</sub> (sum of word and context vectors), which empirically outperforms using either alone. This is different from Word2Vec, where the context matrix is usually discarded. The dimension choices matter: 50d is fast but loses nuance; 300d captures richer structure; 200d is often the sweet spot for downstream tasks.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Using the whole book, not just one page at a time</h2>

            <Analogy label="Word2Vec's Limitation: Only Looking Locally">
                Word2Vec reads a sentence and slides a window of 5 words across it. It only ever sees 5 words at a time. If "ice" and "steam" both appear frequently near "water," Word2Vec might learn this — but it has to see each pair separately, over and over.
                <br /><br />
                It's like trying to learn vocabulary by reading one line at a time from a billion books, but you can't flip to the index to see all the places a word appears.
            </Analogy>

            <Analogy label="GloVe: Count Everything First">
                GloVe takes a different approach: before training anything, it reads the entire corpus and counts every time two words appear near each other. It builds a giant table: "ice" appeared near "cold" 5,000 times, near "steam" 100 times, near "solid" 800 times.
                <br /><br />
                Then it trains embeddings to match these global counts — not pair by pair, but all at once. It's like studying from an index rather than re-reading every sentence. The training is more efficient because it uses all the statistical information from the corpus in one structured form.
            </Analogy>

            <Analogy label="The Ratio Insight">
                Here's GloVe's brilliant insight. Instead of predicting raw co-occurrence counts, consider the ratio: P("solid"|"ice") / P("solid"|"steam"). "Ice" is solid but steam is not, so this ratio is large. P("gas"|"ice") / P("gas"|"steam") — steam can be a gas, ice cannot — so this ratio is small.
                <br /><br />
                The ratios encode the relationship between words more cleanly than raw counts. GloVe's objective is designed so that word vectors capture these ratios — and since the ratios are related to logarithms of co-occurrence counts, the result is that word vector differences correspond to log-ratio differences.
            </Analogy>

            <Analogy label="Weighting: Not All Co-occurrences Are Equal">
                One problem: the word "the" appears near almost every other word. If GloVe treated "the-ice" the same as "cold-ice," the massive count of "the" would overwhelm everything and "the" would become the most central word in the embedding space.
                <br /><br />
                GloVe's weighting function reduces the importance of very frequent co-occurrences — word pairs that co-occur more than 100 times get their contribution capped. Rare but meaningful co-occurrences (like "cold-ice") are preserved at full weight. This is like a smart student who learns from unusual observations more carefully than from boring, obvious ones.
            </Analogy>

            <Analogy label="50d vs 300d — How Many Numbers Per Word?">
                GloVe was released in several sizes: 50 numbers per word (50-dimensional), 100, 200, and 300. More dimensions means more nuance — a 300d vector can encode more subtle distinctions between words than a 50d vector.
                <br /><br />
                But more dimensions also means slower computation and more memory. For a small model that needs fast inference, 50d GloVe embeddings are often enough. For research tasks requiring high accuracy, 300d Common Crawl embeddings trained on 840 billion words capture an extraordinary breadth of semantic relationships.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Co-occurrence matrix and weighted least squares</h2>

            <h3>Step 1: Build the Co-occurrence Matrix</h3>
            <p>
                For a corpus of T words with vocabulary V, define the co-occurrence matrix X ∈ ℝ<sup>|V|×|V|</sup> where X<sub>ij</sub> = total number of times word j appears in the context window of word i.
            </p>
            <p>
                This matrix is built once from the corpus — no training required yet. It fully summarizes all co-occurrence statistics.
            </p>

            <h3>Step 2: The GloVe Objective</h3>
            <p>
                Train word vectors w<sub>i</sub>, context vectors w̃<sub>j</sub>, and bias terms b<sub>i</sub>, b̃<sub>j</sub> to minimize:
            </p>
            <MathBlock tex="J = \sum_{i,j=1}^{V} f(X_{ij})\, \left(w_i^\top \tilde{w}_j + b_i + \tilde{b}_j - \log X_{ij}\right)^2" />
            <p>
                Only pairs with X<sub>ij</sub> &gt; 0 contribute (zero co-occurrences are skipped).
            </p>

            <h3>The Weighting Function f</h3>
            <MathBlock tex="f(x) = \begin{cases} (x / x_{\max})^\alpha & x < x_{\max} \\ 1 & x \geq x_{\max} \end{cases}" />
            <p>
                Typical values: x<sub>max</sub> = 100, α = 3/4. Pairs that co-occur very frequently (like "the" and "a") would otherwise dominate training — f caps their weight at 1. Rare co-occurrences get fractional weight proportional to their count.
            </p>

            <h3>What the Objective Encodes</h3>
            <p>
                The model predicts log X<sub>ij</sub> from w<sub>i</sub>·w̃<sub>j</sub> + biases. After training: w<sub>i</sub>·w̃<sub>j</sub> ≈ log X<sub>ij</sub> − log X<sub>i</sub> − log X<sub>j</sub>. This is the pointwise mutual information (PMI) — the same quantity that Word2Vec implicitly factorizes.
            </p>

            <h3>Ratio Interpretation — Why the Log Matters</h3>
            <p>
                For words i, j, probe word k — the ratio of co-occurrence probabilities:
            </p>
            <MathBlock tex="\frac{P(k \mid i)}{P(k \mid j)} \approx \exp\!\left(w_k^\top (w_i - w_j)\right)" />
            <p>
                The difference vector w<sub>i</sub> − w<sub>j</sub> encodes the semantic direction from word j to word i. This is why analogy arithmetic works: the direction from "man" to "woman" should be the same as from "king" to "queen."
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Using GloVe in practice:</strong> Final embeddings are typically w<sub>i</sub> + w̃<sub>i</sub> (sum of word and context vectors), which empirically outperforms using either alone. Stanford provides pre-trained GloVe vectors on Common Crawl (840B tokens, 300d), Wikipedia+Gigaword (6B tokens, 50/100/200/300d), and Twitter (27B tokens, 200d).
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
            <h2>Log-bilinear model, PMI connection, and optimization</h2>

            <DefBlock label="GloVe Objective (Pennington et al., 2014)">
                Co-occurrence matrix X ∈ ℝ<sup>V×V</sup>, word vectors w<sub>i</sub> ∈ ℝ<sup>d</sup>,
                context vectors w̃<sub>j</sub> ∈ ℝ<sup>d</sup>, biases b<sub>i</sub>, b̃<sub>j</sub> ∈ ℝ.
                <br /><br />
                Minimize: J = Σ<sub>i,j: X<sub>ij</sub>&gt;0</sub> f(X<sub>ij</sub>) (w<sub>i</sub>·w̃<sub>j</sub> + b<sub>i</sub> + b̃<sub>j</sub> − log X<sub>ij</sub>)²
            </DefBlock>

            <h3>PMI Connection</h3>
            <p>
                X<sub>ij</sub> = X<sub>i</sub> · P(j|i) where X<sub>i</sub> = Σ<sub>k</sub>X<sub>ik</sub> is the total context count of word i. Therefore:
            </p>
            <MathBlock tex="\log X_{ij} = \log P(j \mid i) + \log X_i" />
            <p>
                Absorbing log X<sub>i</sub> into the bias term b<sub>i</sub>:
            </p>
            <MathBlock tex="w_i^\top \tilde{w}_j \approx \log P(j \mid i) = \text{PMI}(i, j) - \log P(j)" />
            <p>
                GloVe vectors thus factorize a shifted PMI matrix — exactly what Levy and Goldberg (2014) proved Word2Vec with negative sampling does. The key difference is that GloVe does this explicitly with weighted least squares on the full co-occurrence matrix.
            </p>

            <h3>Optimization</h3>
            <p>
                The objective is a sum of weighted squared errors — optimized with AdaGrad (per-parameter adaptive learning rates). The key computational advantage: the non-zero entries of X (the training data) are computed once and stored sparsely. For a vocabulary of 100K words, X has at most 10<sup>10</sup> entries — but in practice only ~10<sup>8</sup> are non-zero.
            </p>

            <h3>Ratio Interpretation</h3>
            <MathBlock tex="\frac{P(k \mid i)}{P(k \mid j)} \approx \exp\!\left(w_k^\top (w_i - w_j)\right)" />
            <p>
                The difference vector w<sub>i</sub> − w<sub>j</sub> encodes the "semantic direction" from word j to word i. This is why analogy arithmetic works: the direction from "man" to "woman" should be the same as from "king" to "queen."
            </p>

            <div className="ch-callout">
                <strong>GloVe vs Word2Vec in practice:</strong> On word similarity benchmarks (WordSim-353, SimLex-999), GloVe and Word2Vec perform similarly. On analogy tasks (Google Analogy), GloVe slightly outperforms. For downstream NLP tasks (POS tagging, NER, sentiment), performance is nearly identical. The choice between them is mostly about preference — both are superseded by contextual embeddings for most applications.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from collections import defaultdict

# ── Step 1: Build co-occurrence matrix from a toy corpus ───────────────────────

corpus = [
    "the ice is cold and solid",
    "the steam is hot and gas",
    "water is liquid not solid not gas",
    "ice melts into water when heated",
    "water evaporates into steam when heated",
    "ice and water are both made of h2o",
    "steam condenses into water when cooled",
]

# Tokenize
tokens = [sent.lower().split() for sent in corpus]
vocab = list(set(w for sent in tokens for w in sent))
w2i = {w: i for i, w in enumerate(vocab)}
V = len(vocab)

# Build co-occurrence matrix with window=2
X = np.zeros((V, V))
window = 2

for sent in tokens:
    for i, word in enumerate(sent):
        for j in range(max(0, i-window), min(len(sent), i+window+1)):
            if i != j:
                X[w2i[word], w2i[sent[j]]] += 1

print("=" * 60)
print(f"Co-occurrence matrix: {V}x{V} = {V*V} entries")
print(f"Non-zero entries: {np.count_nonzero(X)}")
print()

# Show some co-occurrence counts for "ice"
if "ice" in w2i:
    ice_idx = w2i["ice"]
    print("Co-occurrence counts for 'ice':")
    counts = [(vocab[j], int(X[ice_idx, j])) for j in range(V) if X[ice_idx, j] > 0]
    counts.sort(key=lambda x: -x[1])
    for word, count in counts:
        print(f"  X[ice, {word:10s}] = {count}")

# ── Step 2: GloVe objective and training ──────────────────────────────────────

d = 20         # embedding dimension
x_max = 2      # weighting cap
alpha = 0.75   # weighting exponent

# Initialize
W     = np.random.randn(V, d) * 0.01   # word vectors
W_ctx = np.random.randn(V, d) * 0.01   # context vectors
b     = np.zeros(V)                     # word biases
b_ctx = np.zeros(V)                     # context biases

def f_weight(x, x_max=x_max, alpha=alpha):
    """GloVe weighting function."""
    return np.where(x < x_max, (x / x_max)**alpha, 1.0)

def glove_loss():
    loss = 0.0
    for i in range(V):
        for j in range(V):
            if X[i, j] > 0:
                diff = W[i] @ W_ctx[j] + b[i] + b_ctx[j] - np.log(X[i, j] + 1e-8)
                loss += f_weight(X[i, j]) * diff**2
    return loss

print()
print("GloVe Training (simplified gradient descent):")
print(f"Initial loss: {glove_loss():.4f}")

lr = 0.01
for step in range(100):
    for i in range(V):
        for j in range(V):
            if X[i, j] > 0:
                weight = f_weight(X[i, j])
                diff = W[i] @ W_ctx[j] + b[i] + b_ctx[j] - np.log(X[i, j] + 1e-8)
                grad = 2 * weight * diff
                W[i]     -= lr * grad * W_ctx[j]
                W_ctx[j] -= lr * grad * W[i]
                b[i]     -= lr * grad
                b_ctx[j] -= lr * grad

print(f"Loss after 100 steps: {glove_loss():.4f}")

# Final embeddings: w + w_ctx (standard GloVe practice)
embeddings = W + W_ctx
print()
print("Embedding norms (first 5 words):")
for i, word in enumerate(vocab[:5]):
    print(f"  {word:15s}: ||e|| = {np.linalg.norm(embeddings[i]):.4f}")

# ── PMI connection demonstration ───────────────────────────────────────────────
print()
print("PMI values (approx from co-occurrence counts):")
Xi = X.sum(axis=1)  # row sums
Xj = X.sum(axis=0)  # col sums
N  = X.sum()
for w1 in ["ice", "steam"]:
    for w2 in ["cold", "hot", "water"]:
        if w1 in w2i and w2 in w2i:
            i, j = w2i[w1], w2i[w2]
            if X[i,j] > 0 and Xi[i] > 0 and Xj[j] > 0:
                pmi = np.log(X[i,j]*N / (Xi[i]*Xj[j]))
                print(f"  PMI({w1:5s}, {w2:5s}) = {pmi:+.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Building a co-occurrence matrix from a toy corpus about ice, water, and steam — then implementing a simplified GloVe training loop with the weighted least-squares objective. Shows the full pipeline: count → weight → optimize, plus PMI values demonstrating the theoretical connection.
            </p>
            <CodeBlock code={PY_CODE} filename="glove_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const GLOVE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
