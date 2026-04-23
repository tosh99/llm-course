import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Global statistics meet local context windows</h2>
            <p>
                GloVe (Global Vectors for Word Representation) was introduced by Jeffrey Pennington,
                Richard Socher, and Christopher Manning at Stanford in 2014. It offered a principled
                criticism of Word2Vec: despite its success, Word2Vec only ever saw local context
                windows, missing global corpus statistics. GloVe aimed to combine the advantages of
                two older traditions: matrix factorization methods (like LSA) and local context window
                methods (like Word2Vec).
            </p>

            <div className="ch10-timeline">
                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">1990s</div>
                    <div className="ch10-tl-section-label">Matrix Factorization Era</div>
                    <div className="ch10-tl-title">LSA — Latent Semantic Analysis</div>
                    <div className="ch10-tl-body">
                        Latent Semantic Analysis (Deerwester et al., 1990) built a term-document or
                        term-term co-occurrence matrix and applied Singular Value Decomposition (SVD)
                        to produce low-dimensional word representations. LSA captures global statistics
                        of the corpus — which words co-occur globally — and produces representations
                        with excellent analogical reasoning. But it scales poorly to large vocabularies
                        (SVD of a 100,000 × 100,000 matrix is expensive) and doesn't handle frequency
                        distributions well (very frequent words dominate).
                    </div>
                    <div className="ch10-tl-impact">Context: LSA showed matrix factorization gives semantic structure; Word2Vec showed local context is enough</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2013</div>
                    <div className="ch10-tl-section-label">The Gap</div>
                    <div className="ch10-tl-title">Word2Vec — local only</div>
                    <div className="ch10-tl-body">
                        Word2Vec's Skip-gram and CBOW train on individual (word, context) pairs from a
                        sliding window. Each training step sees only one pair — the global co-occurrence
                        statistics are never explicitly used. A word pair that co-occurs 10,000 times
                        contributes 10,000 individual training examples, each treated identically.
                        This is statistically inefficient: the model needs to see each pair thousands
                        of times to converge to statistics that were already available in the corpus.
                    </div>
                    <div className="ch10-tl-impact">Context: Word2Vec's window-based approach ignores the full co-occurrence count matrix</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2014</div>
                    <div className="ch10-tl-section-label">Synthesis</div>
                    <div className="ch10-tl-title">GloVe — Pennington, Socher, Manning (EMNLP 2014)</div>
                    <div className="ch10-tl-body">
                        Pennington et al. proposed a global matrix factorization approach: first
                        compute the full word-word co-occurrence matrix X (X<sub>ij</sub> = number of
                        times word j appears in context of word i across the entire corpus). Then train
                        embeddings to predict log(X<sub>ij</sub>) using a weighted least-squares
                        objective. The weighting function f(X<sub>ij</sub>) gives less importance to
                        very frequent pairs (which would otherwise dominate) while preserving signal
                        from less frequent but meaningful co-occurrences.
                    </div>
                    <div className="ch10-tl-impact">Impact: State-of-the-art on word similarity and analogy tasks; competitive with Word2Vec; widely used in NLP</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2015–2017</div>
                    <div className="ch10-tl-section-label">Impact</div>
                    <div className="ch10-tl-title">GloVe in pre-Transformer NLP</div>
                    <div className="ch10-tl-body">
                        GloVe vectors became one of the two standard initializations for NLP models
                        (alongside Word2Vec) in the pre-Transformer era. Nearly every NLP paper from
                        2014–2018 either initialized embeddings with GloVe or Word2Vec. Stanford's
                        pre-trained GloVe vectors on Common Crawl (840B tokens, 300-dimensional) were
                        downloaded millions of times and are still used today for smaller models.
                    </div>
                    <div className="ch10-tl-impact">Impact: Standard pre-trained embedding for the NLP field 2015–2018; superseded by contextual embeddings (ELMo, BERT)</div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Using the whole book, not just one page at a time</h2>

            <Analogy label="Word2Vec's Limitation: Only Looking Locally">
                Word2Vec reads a sentence and slides a window of 5 words across it. It only ever
                sees 5 words at a time. If "ice" and "steam" both appear frequently near "water,"
                Word2Vec might learn this — but it has to see each pair separately, over and over.
                <br /><br />
                It's like trying to learn vocabulary by reading one line at a time from a billion
                books, but you can't flip to the index to see all the places a word appears.
            </Analogy>

            <Analogy label="GloVe: Count Everything First">
                GloVe takes a different approach: before training anything, it reads the entire
                corpus and counts every time two words appear near each other. It builds a giant
                table: "ice" appeared near "cold" 5,000 times, near "steam" 100 times, near "solid"
                800 times.
                <br /><br />
                Then it trains embeddings to match these global counts — not pair by pair, but all
                at once. It's like studying from an index rather than re-reading every sentence.
                The training is more efficient because it uses all the statistical information
                from the corpus in one structured form.
            </Analogy>

            <Analogy label="The Ratio Insight">
                Here's GloVe's brilliant insight. Instead of predicting raw co-occurrence counts,
                consider the ratio: P("solid"|"ice") / P("solid"|"steam"). "Ice" is solid but steam
                is not, so this ratio is large. P("gas"|"ice") / P("gas"|"steam") — steam can be
                a gas, ice cannot — so this ratio is small.
                <br /><br />
                The ratios encode the relationship between words more cleanly than raw counts.
                GloVe's objective is designed so that word vectors capture these ratios — and
                since the ratios are related to logarithms of co-occurrence counts, the result
                is that word vector differences correspond to log-ratio differences.
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
                For a corpus of T words with vocabulary V, define the co-occurrence matrix
                X ∈ ℝ<sup>|V|×|V|</sup> where X<sub>ij</sub> = total number of times word j
                appears in the context window of word i.
            </p>
            <p>
                This matrix is built once from the corpus — no training required yet. It fully
                summarizes all co-occurrence statistics.
            </p>

            <h3>Step 2: The GloVe Objective</h3>
            <p>
                Train word vectors w<sub>i</sub>, context vectors w̃<sub>j</sub>, and bias
                terms b<sub>i</sub>, b̃<sub>j</sub> to minimize:
            </p>
            <MathBlock tex="J = \sum_{i,j=1}^{V} f(X_{ij})\, \left(w_i^\top \tilde{w}_j + b_i + \tilde{b}_j - \log X_{ij}\right)^2" />
            <p>
                Only pairs with X<sub>ij</sub> &gt; 0 contribute (zero co-occurrences are skipped).
            </p>

            <h3>The Weighting Function f</h3>
            <MathBlock tex="f(x) = \begin{cases} (x / x_{\max})^\alpha & x < x_{\max} \\ 1 & x \geq x_{\max} \end{cases}" />
            <p>
                Typical values: x<sub>max</sub> = 100, α = 3/4. Pairs that co-occur very frequently
                (like "the" and "a") would otherwise dominate training — f caps their weight at 1.
                Rare co-occurrences get fractional weight proportional to their count.
            </p>

            <h3>What the Objective Encodes</h3>
            <p>
                The model predicts log X<sub>ij</sub> from w<sub>i</sub>·w̃<sub>j</sub> + biases.
                After training: w<sub>i</sub>·w̃<sub>j</sub> ≈ log X<sub>ij</sub> − log X<sub>i</sub> − log X<sub>j</sub>.
                This is the pointwise mutual information (PMI) — the same quantity that Word2Vec
                implicitly factorizes.
            </p>

            <hr className="ch10-sep" />
            <div className="ch10-callout">
                <strong>Using GloVe in practice:</strong> Final embeddings are typically
                w<sub>i</sub> + w̃<sub>i</sub> (sum of word and context vectors), which empirically
                outperforms using either alone. Stanford provides pre-trained GloVe vectors on
                Common Crawl (840B tokens), Wikipedia+Gigaword (6B tokens), and Twitter (27B tokens).
            </div>
        </>
    )
}

function MathsTab() {
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
                X<sub>ij</sub> = X<sub>i</sub> · P(j|i) where X<sub>i</sub> = Σ<sub>k</sub>X<sub>ik</sub>
                is the total context count of word i. Therefore:
            </p>
            <MathBlock tex="\log X_{ij} = \log P(j \mid i) + \log X_i" />
            <p>
                Absorbing log X<sub>i</sub> into the bias term b<sub>i</sub>:
            </p>
            <MathBlock tex="w_i^\top \tilde{w}_j \approx \log P(j \mid i) = \text{PMI}(i, j) - \log P(j)" />
            <p>
                GloVe vectors thus factorize a shifted PMI matrix — exactly what Levy & Goldberg
                (2014) proved Word2Vec with negative sampling does. The key difference is that
                GloVe does this explicitly with weighted least squares on the full co-occurrence
                matrix.
            </p>

            <h3>Optimization</h3>
            <p>
                The objective is a sum of weighted squared errors — optimized with AdaGrad (per-parameter
                adaptive learning rates). The key computational advantage: the non-zero entries of
                X (the training data) are computed once and stored sparsely. For a vocabulary of 100K
                words, X has at most 10<sup>10</sup> entries — but in practice only ~10<sup>8</sup>
                are non-zero.
            </p>

            <h3>Ratio Interpretation</h3>
            <p>
                For words i, j, k — the ratio of co-occurrence probabilities:
            </p>
            <MathBlock tex="\frac{P(k \mid i)}{P(k \mid j)} \approx \exp\!\left(w_k^\top (w_i - w_j)\right)" />
            <p>
                The difference vector w<sub>i</sub> − w<sub>j</sub> encodes the "semantic
                direction" from word j to word i. This is why analogy arithmetic works: the
                direction from "man" to "woman" should be the same as from "king" to "queen."
            </p>

            <div className="ch10-callout">
                <strong>GloVe vs Word2Vec in practice:</strong> On word similarity benchmarks
                (WordSim-353, SimLex-999), GloVe and Word2Vec perform similarly. On analogy tasks
                (Google Analogy), GloVe slightly outperforms. For downstream NLP tasks (POS tagging,
                NER, sentiment), performance is nearly identical. The choice between them is mostly
                about preference — both are superseded by contextual embeddings for most applications.
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
print(f"Co-occurrence matrix: {V}×{V} = {V*V} entries")
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

# ── Step 2: GloVe objective (simplified training on toy corpus) ────────────────

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

# Simplified gradient descent (one step)
print()
print("GloVe Training (simplified):")
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
`

function PythonTab() {
    return (
        <>
            <p>
                Building a co-occurrence matrix from a toy corpus about ice, water, and steam —
                then implementing a simplified GloVe training loop with the weighted least-squares
                objective. Shows the full pipeline: count → weight → optimize.
            </p>
            <CodeBlock code={PY_CODE} filename="glove_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── GloVe — TypeScript: Co-occurrence matrix and objective ───────────────────

type CoOccurrence = Map<string, Map<string, number>>

// ── Build co-occurrence matrix ────────────────────────────────────────────────
function buildCooccurrence(sentences: string[][], window: number): CoOccurrence {
  const X: CoOccurrence = new Map()

  for (const sent of sentences) {
    for (let i = 0; i < sent.length; i++) {
      const wi = sent[i]
      if (!X.has(wi)) X.set(wi, new Map())

      for (let j = Math.max(0, i - window); j <= Math.min(sent.length - 1, i + window); j++) {
        if (i === j) continue
        const wj = sent[j]
        const count = X.get(wi)!.get(wj) ?? 0
        X.get(wi)!.set(wj, count + 1)
      }
    }
  }
  return X
}

// ── GloVe weighting function ──────────────────────────────────────────────────
function fWeight(x: number, xMax = 100, alpha = 0.75): number {
  return x < xMax ? Math.pow(x / xMax, alpha) : 1
}

// ── GloVe loss for a single (i, j) pair ───────────────────────────────────────
function glovePairLoss(
  wi: number[],
  wj: number[],
  bi: number,
  bj: number,
  xij: number
): number {
  const dot = wi.reduce((s, v, k) => s + v * wj[k], 0)
  const diff = dot + bi + bj - Math.log(xij + 1e-8)
  return fWeight(xij) * diff * diff
}

// ── Log-PMI: what GloVe implicitly computes ───────────────────────────────────
function logPMI(X: CoOccurrence, wi: string, wj: string): number {
  const Xij = X.get(wi)?.get(wj) ?? 0
  if (Xij === 0) return -Infinity

  const Xi = Array.from(X.get(wi)!.values()).reduce((s, v) => s + v, 0)
  const Xj = Array.from(X.entries()).reduce((s, [, row]) => s + (row.get(wj) ?? 0), 0)
  const total = Array.from(X.values()).reduce(
    (s, row) => s + Array.from(row.values()).reduce((rs, v) => rs + v, 0),
    0
  )

  const pij = Xij / total
  const pi  = Xi  / total
  const pj  = Xj  / total

  return Math.log(pij / (pi * pj))
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const corpus = [
  ["ice", "is", "cold", "and", "solid"],
  ["steam", "is", "hot", "and", "gas"],
  ["water", "is", "liquid", "not", "solid", "not", "gas"],
  ["ice", "melts", "into", "water"],
  ["water", "evaporates", "into", "steam"],
]

const X = buildCooccurrence(corpus, 2)

console.log("Co-occurrence counts for 'ice':")
console.log("─".repeat(35))
const iceRow = X.get("ice")
if (iceRow) {
  const sorted = Array.from(iceRow.entries()).sort((a, b) => b[1] - a[1])
  for (const [word, count] of sorted) {
    console.log(\`  X[ice, \${word.padEnd(10)}] = \${count}\`)
  }
}

console.log()
console.log("Log-PMI values (w.r.t. 'water'):")
console.log("─".repeat(40))
for (const word of ["ice", "steam", "cold", "hot", "liquid", "gas"]) {
  const pmi = logPMI(X, "water", word)
  const bar = pmi > 0 ? "+".repeat(Math.min(10, Math.floor(pmi))) : "-".repeat(Math.min(10, Math.floor(-pmi)))
  console.log(\`  PMI(water, \${word.padEnd(8)}) = \${pmi.toFixed(3).padEnd(8)} |\${bar}\`)
}

console.log()
console.log("GloVe trains embeddings to approximate these PMI values")
console.log("so that w_i · w_j ≈ PMI(i, j)")
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of co-occurrence matrix construction, the GloVe weighting
                function, and log-PMI computation. Demonstrates the core GloVe relationship:
                trained embeddings approximate the pointwise mutual information matrix.
            </p>
            <CodeBlock code={TS_CODE} filename="glove.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GLOVE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
