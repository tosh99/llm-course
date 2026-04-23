import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Breaking the information bottleneck</h2>
            <p>
                In 2014, the seq2seq model from Sutskever, Vinyals, and Le showed that two RNNs
                connected in series could translate sentences. But there was a problem baked into
                its design: the entire source sentence had to be compressed into a single
                fixed-dimensional vector — the last hidden state of the encoder — before the decoder
                could begin generating. For short sentences this worked. For long sentences it
                catastrophically failed. Bahdanau attention was the direct response.
            </p>

            <div className="ch12-timeline">
                <div className="ch12-tl-item">
                    <div className="ch12-tl-year">2014 Jun</div>
                    <div className="ch12-tl-section-label">The Problem</div>
                    <div className="ch12-tl-title">Cho et al. — Encoder-Decoder for MT</div>
                    <div className="ch12-tl-body">
                        Kyunghyun Cho, Bart van Merrienboer, and Yoshua Bengio published the
                        encoder-decoder architecture for neural machine translation. The encoder RNN
                        reads the source sentence and produces a context vector c — the final hidden
                        state. The decoder RNN generates the translation conditioned on c. The authors
                        themselves noted that performance degraded badly for sentences longer than about
                        20 words: one fixed vector could not carry all the information.
                    </div>
                    <div className="ch12-tl-impact">Impact: Established encoder-decoder; immediately revealed the fixed-context bottleneck</div>
                </div>

                <div className="ch12-tl-item">
                    <div className="ch12-tl-year">2014 Sep</div>
                    <div className="ch12-tl-section-label">The Solution</div>
                    <div className="ch12-tl-title">Bahdanau, Cho, Bengio — Jointly Learning to Align</div>
                    <div className="ch12-tl-body">
                        Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio posted "Neural Machine
                        Translation by Jointly Learning to Align and Translate" to arXiv in September
                        2014 (published ICLR 2015). The core idea: instead of compressing the source
                        into one vector, let the decoder attend to all encoder hidden states at every
                        decoding step, with learned weights. Each decoding step computes a different
                        weighted mixture of the encoder states, effectively letting the model decide
                        which parts of the source to focus on when generating each target word.
                    </div>
                    <div className="ch12-tl-impact">Impact: Removed the fixed-context constraint; BLEU improved especially on long sentences</div>
                </div>

                <div className="ch12-tl-item">
                    <div className="ch12-tl-year">2015</div>
                    <div className="ch12-tl-section-label">Insight</div>
                    <div className="ch12-tl-title">Alignment Matrices — Interpretability Surprise</div>
                    <div className="ch12-tl-body">
                        A striking result from the original paper: visualizing the attention weights
                        α<sub>tj</sub> as a matrix (target position t, source position j) revealed
                        near-diagonal structure for English↔French translation, with off-diagonal
                        patterns appearing exactly where the two languages reorder words differently
                        (adjective-noun order reversal, for instance). The model had learned
                        linguistically meaningful alignments without any alignment supervision — only
                        from translation pairs.
                    </div>
                    <div className="ch12-tl-impact">Impact: Attention weights became the first interpretability tool in neural NLP</div>
                </div>

                <div className="ch12-tl-item">
                    <div className="ch12-tl-year">2015 – 2017</div>
                    <div className="ch12-tl-section-label">Proliferation</div>
                    <div className="ch12-tl-title">Attention Everywhere</div>
                    <div className="ch12-tl-body">
                        Within two years, attention appeared in image captioning (Xu et al., 2015),
                        reading comprehension, question answering, speech recognition (Chan et al.
                        Listen Attend Spell, 2015), and summarization. Luong et al. (2015) refined the
                        mechanism with simpler scoring functions. Vaswani et al. (2017) took the logical
                        extreme: remove the RNN entirely and build a model from attention alone —
                        the Transformer. Every modern LLM is built on that paper.
                    </div>
                    <div className="ch12-tl-impact">Impact: Became the universal building block; the direct predecessor of self-attention and Transformers</div>
                </div>
            </div>

            <div className="ch12-callout">
                <strong>Why it mattered beyond MT:</strong> Bahdanau attention established that
                neural networks could learn <em>where to look</em> rather than being told where to
                look. The alignment is end-to-end differentiable — no hand-engineered rules, no
                separate alignment model. This principle — differentiable selection over a set of
                representations — is the conceptual core of every Transformer, from BERT to GPT-4.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The translator who looks back</h2>

            <Analogy label="The Old Way — Memorize Everything">
                Imagine you're translating a long paragraph from French to English. But there's
                a strange rule: you must read the entire French text, close your eyes, and then
                translate from memory — without looking back.
                <br /><br />
                For a short sentence like "Le chat est rouge" ("The cat is red"), this works fine.
                But for a paragraph with 50 words? By the time you're translating the last sentence,
                you've forgotten the details from the first sentence. This is exactly the problem
                with the original seq2seq model — it squeezed the whole source into one memory slot.
            </Analogy>

            <Analogy label="The New Way — Look Back Freely">
                Now imagine a different rule: you can look back at the original French text as
                much as you want while translating. And here's the clever part — the model
                <em> learns which French words to look at</em> when generating each English word.
                <br /><br />
                When you're translating a word for "house," you look mostly at "maison."
                When you're translating a word for "red," you look at "rouge." The model
                figures this out automatically, just by practicing on millions of translation pairs.
            </Analogy>

            <Analogy label="The Spotlight Analogy">
                Think of it like a spotlight in a theater. The old model had only one spotlight
                position it had to choose before the play started. Bahdanau attention lets the
                spotlight move at every moment of the performance, shining on different actors
                depending on what's happening right now.
                <br /><br />
                The model doesn't just pick <em>one</em> source word either — it spreads the
                spotlight over several, with different brightness levels. The context it uses at
                each step is a weighted blend of all the source words. The weights are what
                we call "attention weights."
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Alignment scores, context vectors, and the decoder</h2>

            <h3>Setup: Bidirectional Encoder</h3>
            <p>
                Bahdanau used a bidirectional RNN encoder. For each source position j, two hidden
                states are computed — a forward pass h⃗<sub>j</sub> (reads left to right) and a
                backward pass h⃖<sub>j</sub> (reads right to left). These are concatenated:
            </p>
            <MathBlock tex="h_j = \left[\overrightarrow{h}_j;\; \overleftarrow{h}_j\right] \in \mathbb{R}^{2n}" />
            <p>
                This gives each position context from both its left and right neighbors — much
                richer than a unidirectional encoder that only sees the past.
            </p>

            <h3>Step 1: Alignment Scores</h3>
            <p>
                For decoding step t, compute an alignment score e<sub>tj</sub> for each source
                position j. This score measures how well the decoder's current state
                s<sub>t-1</sub> "matches" the encoder state h<sub>j</sub>:
            </p>
            <MathBlock tex="e_{tj} = \mathbf{v}_a^\top \tanh\!\left(\mathbf{W}_a\, \mathbf{s}_{t-1} + \mathbf{U}_a\, \mathbf{h}_j\right)" />
            <p>
                W<sub>a</sub>, U<sub>a</sub>, and v<sub>a</sub> are learned weight matrices. The
                tanh maps to (-1, 1) and the dot with v<sub>a</sub> collapses to a scalar score.
                This is called <em>additive attention</em> or an <em>alignment model</em>.
            </p>

            <h3>Step 2: Attention Weights</h3>
            <p>
                Normalize the scores over all source positions using softmax to get
                attention weights α<sub>tj</sub>:
            </p>
            <MathBlock tex="\alpha_{tj} = \frac{\exp(e_{tj})}{\sum_{k=1}^{T_x} \exp(e_{tk})}" />
            <p>
                The α<sub>tj</sub> sum to 1 across j. They represent a probability distribution
                over source positions — "how much to attend to each source word."
            </p>

            <h3>Step 3: Context Vector</h3>
            <p>
                Compute the context vector c<sub>t</sub> as a weighted sum of encoder states:
            </p>
            <MathBlock tex="\mathbf{c}_t = \sum_{j=1}^{T_x} \alpha_{tj}\, \mathbf{h}_j" />
            <p>
                c<sub>t</sub> is a different vector at every decoding step — it adapts to whatever
                the decoder needs at that moment.
            </p>

            <h3>Step 4: Decoder Update</h3>
            <p>
                The decoder GRU produces its new hidden state using s<sub>t-1</sub>, the previous
                output y<sub>t-1</sub>, and the context vector c<sub>t</sub>:
            </p>
            <MathBlock tex="\mathbf{s}_t = f\!\left(\mathbf{s}_{t-1},\; y_{t-1},\; \mathbf{c}_t\right)" />
            <p>
                The output distribution is then: P(y<sub>t</sub>) = softmax(W<sub>o</sub>[s<sub>t</sub>; c<sub>t</sub>; Ey<sub>t-1</sub>])
                where E is the target-word embedding matrix.
            </p>

            <hr className="ch12-sep" />
            <div className="ch12-callout">
                <strong>Key difference from standard seq2seq:</strong> In vanilla seq2seq, the
                context vector c is constant — the final encoder state used for all decoder steps.
                In Bahdanau attention, c<sub>t</sub> is recomputed at every step, attending
                to the full encoder output sequence. This adds O(T<sub>x</sub>) computation
                per decoder step but completely solves the bottleneck.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Full derivation and gradient analysis</h2>

            <DefBlock label="Bahdanau Attention — Formal Specification">
                Source sequence: x = (x<sub>1</sub>, …, x<sub>Tx</sub>).
                Encoder hidden states: H = (h<sub>1</sub>, …, h<sub>Tx</sub>), each h<sub>j</sub> ∈ ℝ<sup>2n</sup>.
                Decoder state at step t: s<sub>t</sub> ∈ ℝ<sup>n</sup>.
                Attention parameters: W<sub>a</sub> ∈ ℝ<sup>d×n</sup>, U<sub>a</sub> ∈ ℝ<sup>d×2n</sup>, v<sub>a</sub> ∈ ℝ<sup>d</sup>.
                d is the attention dimensionality (hyperparameter).
            </DefBlock>

            <h3>Scoring Function (Additive / MLP)</h3>
            <MathBlock tex="e_{tj} = \mathbf{v}_a^\top \tanh\!\bigl(\mathbf{W}_a \mathbf{s}_{t-1} + \mathbf{U}_a \mathbf{h}_j\bigr)" />
            <p>
                Note: W<sub>a</sub> s<sub>t-1</sub> does not depend on j, so it can be precomputed
                once per decoder step. Only the U<sub>a</sub> h<sub>j</sub> terms vary with j.
                In practice the U<sub>a</sub> H product is precomputed over all positions once
                before decoding begins — reducing computation from O(T<sub>x</sub> · n · d) to
                O(T<sub>x</sub> · 2n · d) offline + O(d) per step per position.
            </p>

            <h3>Attention Weights</h3>
            <MathBlock tex="\boldsymbol{\alpha}_t = \text{softmax}(\mathbf{e}_t) \in \Delta^{T_x - 1}" />
            <p>
                α<sub>t</sub> lies on the probability simplex. The softmax is the
                unique differentiable function mapping scores to a distribution.
            </p>

            <h3>Context Vector</h3>
            <MathBlock tex="\mathbf{c}_t = \mathbf{H}\boldsymbol{\alpha}_t = \sum_{j=1}^{T_x} \alpha_{tj}\, \mathbf{h}_j" />

            <h3>Gradient Through Attention</h3>
            <p>
                The entire attention mechanism is differentiable. Backprop through c<sub>t</sub>:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_j} = \sum_{t} \frac{\partial \mathcal{L}}{\partial \mathbf{c}_t} \cdot \alpha_{tj}" />
            <p>
                And through the alignment scores (using the softmax Jacobian):
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial e_{tj}} = \alpha_{tj}\!\left(\frac{\partial \mathcal{L}}{\partial \mathbf{c}_t} \cdot \mathbf{h}_j - \sum_{k} \alpha_{tk}\, \frac{\partial \mathcal{L}}{\partial \mathbf{c}_t} \cdot \mathbf{h}_k\right)" />
            <p>
                This means every encoder state h<sub>j</sub> receives gradient at every decoder
                step, weighted by how much attention it received. Highly attended positions get
                larger gradient signals — the network is incentivized to put relevant information
                in positions that the decoder can easily attend to.
            </p>

            <h3>Gradient w.r.t. Attention Parameters</h3>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{v}_a} = \sum_t \sum_j \frac{\partial \mathcal{L}}{\partial e_{tj}} \tanh\!\bigl(\mathbf{W}_a \mathbf{s}_{t-1} + \mathbf{U}_a \mathbf{h}_j\bigr)" />

            <div className="ch12-callout">
                <strong>Why additive attention has O(d) parameters vs O(d²) for bilinear:</strong>
                The additive formulation projects s and h into a shared d-dimensional space via two
                separate matrices, then combines them with a scalar projection. The bilinear form
                s<sup>T</sup>Wh requires a full d<sub>s</sub> × d<sub>h</sub> matrix W. For
                d<sub>s</sub> = d<sub>h</sub> = 512, that's 262K parameters vs 2 × 512 × d for
                additive. Additive is more parameter-efficient at the cost of an extra nonlinearity.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Utilities ─────────────────────────────────────────────────────────────────
def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

# ── Bahdanau Attention ────────────────────────────────────────────────────────
class BahdanauAttention:
    """Additive (MLP) attention: score(s, h) = v^T tanh(W s + U h)"""
    def __init__(self, enc_dim, dec_dim, attn_dim, seed=42):
        rng = np.random.default_rng(seed)
        self.W_a = rng.normal(0, 0.1, (attn_dim, dec_dim))   # (d, dec_dim)
        self.U_a = rng.normal(0, 0.1, (attn_dim, enc_dim))   # (d, enc_dim)
        self.v_a = rng.normal(0, 0.1, attn_dim)              # (d,)
        # Precompute U_a @ H after encoder finishes (H shape: T_enc x enc_dim)
        self._UH_cache = None

    def precompute(self, H):
        """Cache U_a H — only depends on encoder output, not decoder state."""
        self._UH_cache = H @ self.U_a.T   # (T_enc, d)

    def score(self, s_prev):
        """Compute all alignment scores for one decoder step.
        s_prev: (dec_dim,)  →  returns energies: (T_enc,)
        """
        Ws = self.W_a @ s_prev                           # (d,)
        combined = np.tanh(self._UH_cache + Ws)          # (T_enc, d)  broadcast
        return combined @ self.v_a                       # (T_enc,)

    def forward(self, s_prev, H):
        """Full attention step.
        Returns: context (enc_dim,), alphas (T_enc,)
        """
        if self._UH_cache is None or self._UH_cache.shape[0] != H.shape[0]:
            self.precompute(H)
        energies = self.score(s_prev)    # (T_enc,)
        alphas   = softmax(energies)     # (T_enc,)
        context  = alphas @ H            # (enc_dim,)
        return context, alphas


# ── Demo ──────────────────────────────────────────────────────────────────────
T_enc, enc_dim, dec_dim, attn_dim = 6, 8, 8, 4
rng = np.random.default_rng(0)

# Encoder hidden states (bidirectional RNN → enc_dim = 2 * hidden)
H      = rng.normal(0, 0.5, (T_enc, enc_dim))
s_prev = rng.normal(0, 0.5, dec_dim)

attn = BahdanauAttention(enc_dim, dec_dim, attn_dim)
context, alphas = attn.forward(s_prev, H)

print("Bahdanau Attention Demo")
print("=" * 50)
print(f"Source length : {T_enc}  Enc dim: {enc_dim}  Attn dim: {attn_dim}")
print()
print("Alignment weights α (should sum to 1):")
for j, a in enumerate(alphas):
    bar = "█" * int(a * 40)
    print(f"  pos {j}: {a:.4f}  {bar}")
print(f"  sum  : {alphas.sum():.6f}")
print()
print(f"Context vector  : {context.round(4)}")
print(f"Context norm    : {np.linalg.norm(context):.4f}")
print()

# ── Simulate 3 decoder steps to show context adapts ─────────────────────────
print("Context vectors across decoder steps:")
print("-" * 50)
for step in range(3):
    s = rng.normal(0, 0.5, dec_dim)
    ctx, alp = attn.forward(s, H)
    top_pos = alp.argmax()
    print(f"  step {step}: peak attention at pos {top_pos}"
          f"  (α={alp[top_pos]:.3f})  ||c|| = {np.linalg.norm(ctx):.3f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of Bahdanau additive attention with precomputed
                encoder projections. The demo runs a single attention step and then simulates
                three decoder steps to show how context adapts.
            </p>
            <CodeBlock code={PY_CODE} filename="bahdanau_attention.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Bahdanau Attention — TypeScript ──────────────────────────────────────────

type Vec = number[]
type Mat = number[][]

function dot(a: Vec, b: Vec): number {
  return a.reduce((s, ai, i) => s + ai * b[i], 0)
}

function matVec(M: Mat, v: Vec): Vec {
  return M.map(row => dot(row, v))
}

function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((ai, i) => ai + b[i])
}

function tanhVec(v: Vec): Vec {
  return v.map(x => Math.tanh(x))
}

function softmax(scores: Vec): Vec {
  const max = Math.max(...scores)
  const exps = scores.map(x => Math.exp(x - max))
  const sum  = exps.reduce((a, b) => a + b, 0)
  return exps.map(x => x / sum)
}

// score(s_prev, h_j) = v_a · tanh(W_a s_prev + U_a h_j)
function bahdanauScore(
  sPrev: Vec, hJ: Vec,
  Wa: Mat, Ua: Mat, va: Vec
): number {
  const Ws = matVec(Wa, sPrev)
  const Uh = matVec(Ua, hJ)
  return dot(va, tanhVec(vecAdd(Ws, Uh)))
}

// Full attention step: returns context vector and attention weights
function bahdanauAttention(
  sPrev: Vec,
  H: Mat,          // (T_enc, enc_dim)
  Wa: Mat, Ua: Mat, va: Vec
): { context: Vec; alphas: Vec } {
  const energies = H.map(hJ => bahdanauScore(sPrev, hJ, Wa, Ua, va))
  const alphas   = softmax(energies)
  const dim      = H[0].length
  const context  = Array.from({ length: dim }, (_, d) =>
    H.reduce((sum, hJ, j) => sum + alphas[j] * hJ[d], 0)
  )
  return { context, alphas }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
// Toy embeddings: each encoder state encodes one word in 4D
// Dimensions: [subject, verb, object, location]
const H: Mat = [
  [0.9,  0.1,  0.1,  0.0],   // "The"
  [0.8,  0.1,  0.0,  0.0],   // "cat"
  [0.0,  0.9,  0.0,  0.0],   // "sat"
  [0.0,  0.1,  0.8,  0.0],   // "on"
  [0.0,  0.0,  0.1,  0.9],   // "the mat"
]

const ENC_DIM = 4, DEC_DIM = 4, ATTN_DIM = 3
const rand = (r: number, c: number): Mat =>
  Array.from({ length: r }, () =>
    Array.from({ length: c }, () => (Math.random() - 0.5) * 0.3)
  )

const Wa = rand(ATTN_DIM, DEC_DIM)
const Ua = rand(ATTN_DIM, ENC_DIM)
const va: Vec = Array.from({ length: ATTN_DIM }, () => (Math.random() - 0.5) * 0.3)

// Decoder is "looking for the subject" — high subject dimension
const sPrev: Vec = [0.8, 0.0, 0.0, 0.0]

const { context, alphas } = bahdanauAttention(sPrev, H, Wa, Ua, va)

const words = ["The", "cat", "sat", "on", "the mat"]
console.log("Bahdanau Attention — TypeScript")
console.log("─".repeat(42))
console.log("Decoder looking for subject-related content:")
alphas.forEach((a, j) => {
  const bar = "█".repeat(Math.floor(a * 35))
  console.log(\`  \${words[j].padEnd(8)} α=\${a.toFixed(4)}  \${bar}\`)
})
console.log(\`\\nContext: [\${context.map(x => x.toFixed(3)).join(", ")}]\`)
console.log(\`α sum:   \${alphas.reduce((a, b) => a + b, 0).toFixed(6)}\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript Bahdanau attention over a toy 5-word sequence. The decoder state
                is set to emphasize the subject dimension — observe how the alignment
                concentrates on subject-related encoder positions.
            </p>
            <CodeBlock code={TS_CODE} filename="bahdanau.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const BAHDANAU_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
