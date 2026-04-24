import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From recurrence to direct comparison</h2>
            <p>
                By 2017, LSTMs and GRUs had dominated sequence modeling for three years, but
                their sequential nature made them fundamentally slow to train. You cannot
                process token 100 until you have finished token 99. Researchers began asking:
                what if we removed recurrence entirely and let every position attend to every
                other position directly?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Bahdanau et al. — Neural Machine Translation by Jointly Learning to Align and Translate</div>
                    <div className="ch-tl-body">
                        Dzmitry Bahdanau introduced the first neural attention mechanism for sequence
                        models. In an encoder-decoder LSTM, the decoder would compute a weighted
                        sum over all encoder hidden states to decide which source words to focus on.
                        This was a breakthrough, but attention was still bolted onto a recurrent
                        backbone. The RNN did the heavy lifting; attention merely helped.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that soft alignment via weighted averaging works</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — Attention Is All You Need</div>
                    <div className="ch-tl-body">
                        Ashish Vaswani and his co-authors at Google Brain and Google Research
                        published the Transformer architecture. The radical claim: attention alone
                        is sufficient — no recurrence, no convolution. The core operation is
                        <em> scaled dot-product attention</em>, where every token emits a Query
                        vector, a Key vector, and a Value vector. The output for a token is a
                        weighted sum of all Value vectors, where the weights come from the
                        softmax of Query-Key dot products, scaled by the square root of the
                        key dimension.
                    </div>
                    <div className="ch-tl-impact">Impact: Replaced RNNs in NLP within 18 months; enabled GPT and BERT</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – 2018</div>
                    <div className="ch-tl-section-label">Validation</div>
                    <div className="ch-tl-title">State-of-the-Art on WMT &amp; GLUE</div>
                    <div className="ch-tl-body">
                        The original Transformer achieved 28.4 BLEU on WMT 2014 English-to-German,
                        surpassing all existing models including ensembles. Training took 3.5 days
                        on 8 P100 GPUs — faster than the RNN baselines it beat. The research
                        community quickly reproduced the results and found that Transformers
                        scaled far better to large datasets than LSTMs.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that parallelism + attention beats recurrence + attention</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – Present</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">Transformer Becomes the Universal Architecture</div>
                    <div className="ch-tl-body">
                        GPT (2018), BERT (2018), T5 (2019), Vision Transformer (2020), and
                        eventually GPT-3/4, Claude, and Gemini all used the same scaled
                        dot-product attention as their foundation. The operation is now as
                        fundamental to deep learning as convolution was to computer vision.
                    </div>
                    <div className="ch-tl-impact">Impact: The default building block of modern deep learning</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Recurrence forces information to travel one
                step at a time. Attention creates a complete graph: every token talks to every
                other token in a single layer. The path length between any two positions is
                O(1) instead of O(sequence length), solving the vanishing gradient problem
                structurally rather than with gates.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A classroom where everyone raises their hand at once</h2>

            <Analogy label="The Old Way (RNN / LSTM)">
                Imagine a game of telephone. You whisper a message to the person next to you,
                they whisper to the next, and so on. By the time the message reaches the 50th
                person, it is garbled. Worse, everyone must wait for the person before them;
                you cannot whisper to two people at the same time. That is what recurrence
                feels like for a computer.
            </Analogy>

            <Analogy label="The New Way (Attention)">
                Now imagine a classroom where the teacher asks: "Who can help Alice understand
                math?" Every student holds up a card with two numbers: how much they know
                about math (their <em>Key</em>) and how relevant their knowledge is to Alice's
                question (their <em>Value</em>). Alice also holds up a card saying what she is
                looking for (her <em>Query</em>).
                <br /><br />
                The teacher compares Alice's Query to everyone's Key. If Bob's Key matches
                Alice's Query perfectly, Bob gets a high score. The teacher takes a weighted
                average of everyone's Value, weighted by these scores, and hands the result to
                Alice. Alice now has a custom answer built from the most relevant students —
                and every student in the room did this <em>at the same time</em>. No waiting,
                no whisper chain.
            </Analogy>

            <Analogy label="Why Scale by Square Root?">
                If the cards have lots of numbers on them (say, 64 numbers), the dot products
                tend to get very large just by chance. When you feed giant numbers into
                softmax, the winner gets a score near 1.0 and everyone else gets near 0.0.
                That is like letting only the loudest student speak. Dividing by the square
                root of the card size calms the numbers down so that several students can
                contribute meaningfully.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Query, Key, Value, and the softmax map</h2>

            <h3>The Search Engine Analogy</h3>
            <p>
                Think of attention as a search engine. You type a <strong>Query</strong> (what
                you want). The search engine compares your Query to every document's
                <strong> Key</strong> (what the document is about). It returns a weighted blend
                of the documents' <strong>Values</strong> (the actual content). In the
                Transformer, every word in a sentence plays all three roles simultaneously.
            </p>

            <h3>Scaled Dot-Product Attention</h3>
            <p>
                Given a Query matrix <strong>Q</strong> (one row per token), Key matrix
                <strong> K</strong>, and Value matrix <strong>V</strong>:
            </p>
            <MathBlock tex="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V" />

            <h3>Step-by-step</h3>
            <ol>
                <li>
                    <strong>Compute scores:</strong> Multiply Q by K<sup>⊤</sup>. Entry (i, j)
                    measures how much token i "attends to" token j. This is a dot product, so
                    it ranges from strongly negative to strongly positive.
                </li>
                <li>
                    <strong>Scale:</strong> Divide every score by √d<sub>k</sub>, where d<sub>k</sub>
                    is the dimension of each Key vector. This prevents the softmax from becoming
                    too sharp when d<sub>k</sub> is large.
                </li>
                <li>
                    <strong>Softmax:</strong> Apply softmax row-wise so each row sums to 1. These
                    are the attention weights — a probability distribution over which positions
                    to read from.
                </li>
                <li>
                    <strong>Weighted sum:</strong> Multiply the weight matrix by V. Each output
                    row is a convex combination of Value vectors, weighted by relevance.
                </li>
            </ol>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why no RNN?</strong> In an RNN, the hidden state at time t is a function
                of the hidden state at t−1. In attention, the output at position i is a function
                of <em>all</em> positions in a single matrix multiplication. This means the
                entire layer can be computed with highly optimized linear algebra on a GPU —
                no loops, no sequential dependency.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Full specification and complexity analysis</h2>

            <DefBlock label="Scaled Dot-Product Attention — Formal Specification">
                Input: Q ∈ ℝ<sup>n×d<sub>k</sub></sup>, K ∈ ℝ<sup>n×d<sub>k</sub></sup>,
                V ∈ ℝ<sup>n×d<sub>v</sub></sup>, where n is the sequence length.
                Output: O ∈ ℝ<sup>n×d<sub>v</sub></sup>.
                The scaling factor is √d<sub>k</sub>. Softmax is applied row-wise.
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="S = \frac{QK^{\top}}{\sqrt{d_k}} \in \mathbb{R}^{n \times n}" />
            <MathBlock tex="A = \text{softmax}(S) \in \mathbb{R}^{n \times n}" />
            <MathBlock tex="O = AV \in \mathbb{R}^{n \times d_v}" />

            <h3>Softmax Definition (Row-wise)</h3>
            <MathBlock tex="A_{ij} = \frac{\exp(S_{ij})}{\sum_{k=1}^{n} \exp(S_{ik})}" />

            <h3>Why Scale by √d<sub>k</sub>?</h3>
            <p>
                Assume entries of Q and K are i.i.d. with mean 0 and variance 1. The dot product
                q · k = Σ<sub>m=1</sub><sup>d<sub>k</sub></sup> q<sub>m</sub> k<sub>m</sub> is a sum
                of d<sub>k</sub> independent products. Each product has variance 1, so the sum
                has variance d<sub>k</sub>. Dividing by √d<sub>k</sub> normalizes the variance
                back to 1, keeping the softmax in a regime where gradients are healthy and
                the distribution is not too peaky.
            </p>

            <h3>Computational Complexity</h3>
            <p>
                The QK<sup>⊤</sup> multiplication costs O(n<sup>2</sup> · d<sub>k</sub>). The
                AV multiplication costs O(n<sup>2</sup> · d<sub>v</sub>). For typical settings
                where d<sub>k</sub> = d<sub>v</sub> = d, the total is O(n<sup>2</sup> d).
            </p>
            <p>
                Contrast with an RNN: each time step costs O(d<sup>2</sup>), and there are n
                steps, so total forward cost is also O(n d<sup>2</sup>). The RNN is cheaper when
                n &gt;&gt; d, but the Transformer can process all n steps in parallel, making
                wall-clock training time dramatically shorter on modern hardware.
            </p>

            <h3>Memory Complexity</h3>
            <p>
                The attention matrix S is n × n. For n = 2048, this is 4M entries; at float32,
                16 MB. For n = 32,768, it is 4.3B entries (~17 GB). This quadratic memory cost
                is the primary bottleneck for long-context Transformers and motivates techniques
                like Flash Attention and sparse attention patterns.
            </p>

            <div className="ch-callout">
                <strong>Gradient flow:</strong> Because attention is a single differentiable
                weighted sum, gradients flow directly from output position i back to every
                input position j, weighted by A<sub>ij</sub>. There is no multiplicative
                recurrence, so there is no vanishing gradient through time — only the usual
                vanishing gradient through depth, which residual connections mitigate.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Scaled Dot-Product Attention — NumPy ──────────────────────────────────────

def softmax(x, axis=-1):
    """Stable softmax."""
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V : (n, d_k), (n, d_k), (n, d_v)
    mask    : (n, n) optional — set entries to -inf to block attention
    Returns : (n, d_v), attention_weights (n, n)
    """
    d_k = Q.shape[1]
    scores = Q @ K.T / np.sqrt(d_k)          # (n, n)
    if mask is not None:
        scores = scores + mask
    attn = softmax(scores, axis=-1)          # (n, n)
    output = attn @ V                         # (n, d_v)
    return output, attn


# ── Demo ──────────────────────────────────────────────────────────────────────
n, d_k, d_v = 8, 4, 4
rng = np.random.default_rng(42)
Q = rng.normal(0, 1, (n, d_k))
K = rng.normal(0, 1, (n, d_k))
V = rng.normal(0, 1, (n, d_v))

out, attn = scaled_dot_product_attention(Q, K, V)

print("Scaled Dot-Product Attention Demo")
print("=" * 45)
print(f"Sequence length (n) : {n}")
print(f"Key dim   (d_k)     : {d_k}")
print(f"Value dim (d_v)     : {d_v}")
print()
print("Attention matrix (first 5x5):")
print(np.round(attn[:5, :5], 3))
print()
print(f"Attention row sums  : {attn.sum(axis=-1).round(3)}")
print(f"Output shape        : {out.shape}")
print()

# Verify causal mask (decoder-style): position i can only attend to j <= i
causal_mask = np.triu(np.full((n, n), -np.inf), k=1)
out_causal, attn_causal = scaled_dot_product_attention(Q, K, V, mask=causal_mask)
print("With causal mask:")
print(np.round(attn_causal[:5, :5], 3))
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of scaled dot-product attention with optional masking.
                The demo shows attention weights and verifies that causal masking correctly
                zeros out future positions.
            </p>
            <CodeBlock code={PY_CODE} filename="attention.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Scaled Dot-Product Attention — TypeScript ───────────────────────────────

type Mat = number[][]

function matMul(A: Mat, B: Mat): Mat {
  const n = A.length, m = B[0].length, p = B.length
  const C: Mat = Array.from({ length: n }, () => Array(m).fill(0))
  for (let i = 0; i < n; i++)
    for (let k = 0; k < p; k++)
      for (let j = 0; j < m; j++)
        C[i][j] += A[i][k] * B[k][j]
  return C
}

function transpose(A: Mat): Mat {
  return A[0].map((_, j) => A.map(row => row[j]))
}

function softmaxRows(M: Mat): Mat {
  return M.map(row => {
    const max = Math.max(...row)
    const exps = row.map(v => Math.exp(v - max))
    const sum = exps.reduce((a, b) => a + b, 0)
    return exps.map(e => e / sum)
  })
}

function scale(M: Mat, s: number): Mat {
  return M.map(row => row.map(v => v * s))
}

function scaledDotProductAttention(
  Q: Mat, K: Mat, V: Mat
): { output: Mat; attn: Mat } {
  const d_k = Q[0].length
  const scores = matMul(Q, transpose(K))
  const scaled = scale(scores, 1 / Math.sqrt(d_k))
  const attn = softmaxRows(scaled)
  const output = matMul(attn, V)
  return { output, attn }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
function randMat(rows: number, cols: number): Mat {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * 2))
}

const n = 6, d_k = 4, d_v = 4
const Q = randMat(n, d_k)
const K = randMat(n, d_k)
const V = randMat(n, d_v)

const { output, attn } = scaledDotProductAttention(Q, K, V)

console.log("Scaled Dot-Product Attention — TypeScript")
console.log("─".repeat(40))
console.log("Attention weights (row 0):", attn[0].map(v => v.toFixed(3)))
console.log("Row sum:", attn[0].reduce((a, b) => a + b, 0).toFixed(4))
console.log("Output shape:", output.length, "x", output[0].length)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation with naive matrix multiplication. Useful for
                understanding the data flow; production code should use a GPU-accelerated
                linear algebra library.
            </p>
            <CodeBlock code={TS_CODE} filename="attention.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const SCALED_DOT_PRODUCT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
