import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From additive scores to scaled dot-products</h2>
            <p>
                The attention mechanism is parameterized by a scoring function — a way of measuring how compatible a decoder state is with a given encoder state. Bahdanau's original choice was not the only option. Over 2014–2017, a progression of scoring functions emerged, each trading off expressiveness, computation, and numerical stability. The final form — scaled dot-product attention — became the foundation of the Transformer and every LLM built since.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">First scoring function</div>
                    <div className="ch-tl-title">Additive (MLP) Attention — Bahdanau et al.</div>
                    <div className="ch-tl-body">
                        <p>
                            Bahdanau's energy function e<sub>tj</sub> = v<sub>a</sub><sup>T</sup> tanh(W<sub>a</sub>s + U<sub>a</sub>h) uses a one-hidden-layer MLP to compute compatibility. It is called "additive" because it adds the projected decoder state and the projected encoder state before passing through tanh. It is also called "concat" attention because some implementations concatenate s and h before projecting, which is mathematically equivalent.
                        </p>
                        <p>
                            The design is parameter-efficient: W<sub>a</sub> projects the decoder state from its dimensionality to the attention dimension d; U<sub>a</sub> projects the encoder state. Since U<sub>a</sub>H can be precomputed once before decoding, only the W<sub>a</sub>s<sub>t-1</sub> term must be computed at each decoder step — reducing per-step cost. The tanh nonlinearity gives the scoring function expressive power to capture complex compatibility relationships between encoder and decoder states.
                        </p>
                        <p>
                            The additive scoring function works when encoder and decoder states have different dimensionalities — W<sub>a</sub> and U<sub>a</sub> can project them into a shared attention space of dimension d regardless of their original sizes. This flexibility is important in architectures where the encoder and decoder have different hidden dimensions. However, the tanh saturation can cause gradients to vanish for very well-aligned (high-confidence) pairs.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Most expressive and flexible scoring function; the standard from 2014–2015; still used in architectures with mismatched encoder/decoder dims</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">Dot-Product and General — Luong, Pham &amp; Manning</div>
                    <div className="ch-tl-body">
                        <p>
                            Minh-Thang Luong, Hieu Pham, and Christopher Manning proposed two simpler alternatives in "Effective Approaches to Attention-based Neural Machine Translation" (EMNLP 2015). The <em>dot</em> scoring function — s<sup>T</sup>h — requires no parameters at all. It computes compatibility as the dot product between the decoder state and encoder state: two vectors pointing in the same direction (high dot product) are considered compatible. The requirement is that s and h have the same dimensionality.
                        </p>
                        <p>
                            The <em>general</em> (bilinear) scoring function — s<sup>T</sup>Wh — introduces a single learnable weight matrix W that transforms h before the dot product with s. This generalizes the dot product (when W = I it reduces exactly to dot scoring) and works when s and h have different dimensions if W is rectangular. The bilinear form can learn to emphasize certain dimensions of the encoder state more than others, capturing structured compatibility.
                        </p>
                        <p>
                            Empirically, both dot and general scoring functions performed comparably or better than additive attention across multiple language pairs while being significantly cheaper to compute. This was a surprising result — the more expressive additive scoring function did not consistently outperform simpler alternatives. The finding suggested that the attention weights themselves (not the scoring function's expressiveness) were the key to the mechanism's power, and that a simpler scoring function that produces the right distribution is sufficient.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Showed simpler scoring was sufficient; reduced attention overhead significantly; dot and general became standard alternatives to additive</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Pointer networks</div>
                    <div className="ch-tl-title">Vinyals et al. — Dot-Product Attention for Copying</div>
                    <div className="ch-tl-body">
                        <p>
                            Vinyals, Fortunato, and Jaitly's "Pointer Networks" (NeurIPS 2015) used dot-product attention in a novel way: not to compute a context vector, but to select one input element directly. The model learned to "point" to an input position by computing attention scores and treating the argmax as a hard selection. This enabled the model to solve tasks requiring copying or selection from the input — convex hull, traveling salesman, sorting — where the output is a permutation of input elements.
                        </p>
                        <p>
                            Pointer networks established that the same scoring mechanism could serve both soft (weighted combination) and hard (selection) objectives depending on how the attention weights were used. The dot-product scoring function was key to this flexibility: it required no parameters and could be directly interpreted as a relevance score for pointing. Copy mechanisms in subsequent MT systems (Gu et al., 2016) used similar ideas to handle rare words by copying them directly from the source.
                        </p>
                        <p>
                            The pointer network framework also showed that attention scores could represent a probability distribution over discrete choices — a property that would be exploited in neural reading comprehension (pointing to the answer span in a document) and extraction-based summarization (pointing to summary sentences). The scoring function was doing double duty: measuring compatibility for soft attention and providing a probability for discrete selection.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Extended attention scoring to hard selection / copying; influenced copy mechanisms in MT and extraction-based NLP</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Scaling insight</div>
                    <div className="ch-tl-title">Scaled Dot-Product — Vaswani et al. (Transformer)</div>
                    <div className="ch-tl-body">
                        <p>
                            The Transformer introduced one critical modification to dot-product attention: divide the dot product by √d<sub>k</sub> before softmax. The reasoning is probabilistic: if q and k are random vectors with zero mean and unit variance, each of the d<sub>k</sub> terms in the dot product q<sup>T</sup>k has unit variance. Their sum has variance d<sub>k</sub>, so the standard deviation grows as √d<sub>k</sub>. For d<sub>k</sub> = 64, typical scores have magnitude ~8; for d<sub>k</sub> = 512, scores have magnitude ~22.
                        </p>
                        <p>
                            The problem with large scores: when softmax receives inputs of magnitude 22, its output is nearly one-hot — all weight concentrates on one position, and the gradient through softmax (which depends on the soft distribution, not a hard selection) becomes nearly zero. Training stalls. Dividing by √d<sub>k</sub> normalizes the variance of the inputs to softmax to approximately 1 regardless of dimensionality, maintaining the soft distribution that allows meaningful gradient flow.
                        </p>
                        <p>
                            The Transformer also introduced multi-head attention: instead of one set of Q/K/V projections, use h independent sets and concatenate their outputs. Each "head" can attend to different aspects of the input simultaneously — one head might attend to syntactic relationships, another to semantic similarity, another to positional proximity. This parallelism in the attention computation gives the Transformer vastly more representational power than single-head attention at the same computational cost.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: The √d<sub>k</sub> scaling trick made deep stacks of attention layers trainable; multi-head attention became the foundation of every modern LLM</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present</div>
                    <div className="ch-tl-section-label">Efficient attention</div>
                    <div className="ch-tl-title">FlashAttention, Sparse Attention, and Linear Attention</div>
                    <div className="ch-tl-body">
                        <p>
                            As Transformers scaled to handle sequences of thousands or millions of tokens, the O(n²) complexity of full dot-product attention became a bottleneck. Researchers explored two directions: algorithmic improvements to exact attention and approximations that sacrifice some expressiveness for efficiency.
                        </p>
                        <p>
                            FlashAttention (Dao et al., 2022) keeps the exact attention computation but reorganizes it to minimize memory bandwidth — the actual bottleneck on modern GPUs. By computing attention in tiles that fit in fast on-chip SRAM rather than reading/writing the n×n attention matrix to slow HBM, FlashAttention achieves 2–4× speedup over naive scaled dot-product attention while producing identical results. FlashAttention-2 and FlashAttention-3 extended these ideas and are now standard in all major LLM training frameworks.
                        </p>
                        <p>
                            Sparse attention (Longformer, BigBird, 2020) restricts each token to attend to a local window of neighbors plus a few global tokens, reducing complexity from O(n²) to O(n). Linear attention (Performers, 2020) approximates the softmax attention with kernel methods, achieving O(n) complexity but with approximation error. State space models (Mamba, 2023) take the different approach of replacing attention with efficient linear recurrences — architecturally descending from GRU rather than from dot-product attention, but achieving similar quality with linear complexity.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: FlashAttention made scaled dot-product attention practical at long contexts; sparse and linear attention extend it to sequences of millions of tokens</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The progression in one line:</strong> additive (expressive, expensive) →
                dot-product (cheap, unstable at high d) → scaled dot-product (cheap, stable) →
                multi-head scaled dot-product (parallel, powerful) → efficient variants for long
                contexts. Each step traded a little expressiveness for a lot of practical tractability.
                The convergence on scaled dot-product attention is why every Transformer from BERT
                to GPT-4 uses the same core operation.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Different ways to ask "do these match?"</h2>

            <Analogy label="The Matching Problem">
                When the decoder is generating a word, it has to ask each encoder position:
                "How relevant are you right now?" The scoring function is the specific way it
                asks that question. Different scoring functions ask the question differently —
                some are more expensive, some are cheaper, and they have different strengths.
                The choice of scoring function turns out to matter less than you'd expect —
                all four major variants work well in practice.
            </Analogy>

            <Analogy label="Additive Score — Ask a Tiny Network">
                The Bahdanau approach is like asking a small helper: "Here is the decoder's
                current state AND here is the encoder position — run them both through a small
                brain and tell me how well they match." The small brain (one layer + tanh)
                can learn complicated notions of compatibility. But it's slower, because you
                have to run this brain for every encoder position at every decoder step.
                <br /><br />
                The advantage: the brain can work with decoder and encoder states of different
                sizes, because it projects both into a common "attention space" before comparing.
            </Analogy>

            <Analogy label="Dot-Product Score — Check Direction">
                The simpler approach: just multiply the two vectors together element-by-element
                and add up. This is a dot product. Two vectors pointing in the same direction
                have a high dot product — they're similar. No extra parameters needed.
                <br /><br />
                Think of it like checking if two arrows point the same direction: if your decoder
                is looking for a "subject noun" and the encoder has encoded a subject noun at
                position 3, their vector representations will point in similar directions, giving
                a high dot product. The decoder naturally finds what it's looking for.
            </Analogy>

            <Analogy label="General Score — A Learnable Lens">
                The bilinear score (general scoring) sits between additive and dot-product.
                It's like putting a learnable lens between the two vectors before taking their
                dot product. The lens (a weight matrix W) can stretch or shrink certain dimensions,
                teaching the model to emphasize the dimensions that matter most for alignment.
                <br /><br />
                When W = identity matrix, general scoring reduces to dot-product scoring.
                So dot-product is a special case of general scoring. The W matrix gives extra
                flexibility — but in practice, dot-product often works just as well.
            </Analogy>

            <Analogy label="Scaled Dot-Product — Fix the Volume Knob">
                As vectors get longer (higher dimension), their dot products get larger and
                larger by chance, even for random vectors. Before feeding into softmax, huge
                scores cause softmax to become almost one-hot — all attention collapses
                onto one position. The gradient through this near-one-hot softmax is nearly
                zero: training stalls.
                <br /><br />
                Dividing by the square root of the dimension is like turning down the volume
                so the softmax stays soft and informative. For d = 512, you divide by √512 ≈ 22.6.
                This keeps the pre-softmax scores at a magnitude of around 1 regardless of how
                large d is, preserving healthy gradients throughout training.
            </Analogy>

            <Analogy label="Multi-Head Attention — Many Perspectives">
                Instead of asking one question ("does this encoder position match?"), the Transformer
                asks many questions in parallel — 8, 12, or 16 separate "heads," each with its own
                Q/K/V projection matrices. One head might ask "are these syntactically related?"
                Another might ask "do these refer to the same entity?" A third might ask "are these
                close in position?"
                <br /><br />
                Each head produces its own attention pattern and context vector; they're concatenated
                and projected to form the final output. Multi-head attention is like reading a
                document through 8 different colored filters simultaneously — each filter highlights
                different aspects, and you combine all 8 views for a richer understanding.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Four scoring functions compared</h2>

            <h3>1 — Additive (Bahdanau)</h3>
            <MathBlock tex="\text{score}(\mathbf{s}, \mathbf{h}) = \mathbf{v}_a^\top \tanh\!\left(\mathbf{W}_a \mathbf{s} + \mathbf{U}_a \mathbf{h}\right)" />
            <p>
                Parameters: W<sub>a</sub> ∈ ℝ<sup>d×n_s</sup>, U<sub>a</sub> ∈ ℝ<sup>d×n_h</sup>,
                v<sub>a</sub> ∈ ℝ<sup>d</sup>. Works when s and h have different dimensions.
                Most expressive. Cost: O(d · n) per (s, h) pair.
            </p>

            <h3>2 — Dot-Product (Luong)</h3>
            <MathBlock tex="\text{score}(\mathbf{s}, \mathbf{h}) = \mathbf{s}^\top \mathbf{h}" />
            <p>
                No parameters. Requires dim(s) = dim(h). Cheapest possible.
                Works well in practice when encoder and decoder share the same representation space.
            </p>

            <h3>3 — General / Bilinear (Luong)</h3>
            <MathBlock tex="\text{score}(\mathbf{s}, \mathbf{h}) = \mathbf{s}^\top \mathbf{W}_a \mathbf{h}" />
            <p>
                One weight matrix W<sub>a</sub> ∈ ℝ<sup>n×n</sup>. Generalizes the dot product —
                when W<sub>a</sub> = I it reduces to the dot score. Allows different dimensions
                if W<sub>a</sub> is rectangular.
            </p>

            <h3>4 — Scaled Dot-Product (Transformer)</h3>
            <MathBlock tex="\text{score}(\mathbf{q}, \mathbf{k}) = \frac{\mathbf{q}^\top \mathbf{k}}{\sqrt{d_k}}" />
            <p>
                Queries q and keys k are linear projections of the input: q = W<sub>Q</sub>x,
                k = W<sub>K</sub>x. Dividing by √d<sub>k</sub> prevents softmax saturation.
                This is the operation in every Transformer layer.
            </p>

            <h3>Multi-Head Attention</h3>
            <MathBlock tex="\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)\, W^O" />
            <MathBlock tex="\text{head}_i = \text{Attention}(QW_i^Q,\, KW_i^K,\, VW_i^V)" />
            <p>
                h parallel attention heads, each with independent projection matrices.
                The outputs are concatenated and projected back to the model dimension.
            </p>

            <h3>Batch Matrix Multiplication Efficiency</h3>
            <p>
                For the full attention computation over T encoder positions and a batch of B examples,
                scaled dot-product can be computed as a batch matrix multiply:
            </p>
            <MathBlock tex="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V" />
            <p>
                Q ∈ ℝ<sup>B×T<sub>q</sub>×d<sub>k</sub></sup>, K ∈ ℝ<sup>B×T<sub>k</sub>×d<sub>k</sub></sup>,
                V ∈ ℝ<sup>B×T<sub>k</sub>×d<sub>v</sub></sup>. The matrix multiply QK<sup>T</sup>
                produces B attention matrices of shape T<sub>q</sub> × T<sub>k</sub> in one GPU operation.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Summary comparison:</strong>
                additive scoring handles mismatched dims, has O(d) attention-specific params, and includes a tanh nonlinearity;
                dot-product scoring has zero attention params but requires same dims and risks saturation;
                general scoring has O(n²) params and handles different dims;
                scaled dot-product has zero extra params, normalizes by √d<sub>k</sub>, and is the Transformer standard — now used in every production LLM.
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
            <h2>Properties, variance analysis, and the scaling argument</h2>

            <DefBlock label="Four Scoring Functions — Formal Comparison">
                Let s ∈ ℝ<sup>m</sup> (decoder), h ∈ ℝ<sup>n</sup> (encoder), d<sub>a</sub> = attention dim.
                Additive: v<sup>T</sup>tanh(Ws + Uh), params (m+n)d<sub>a</sub> + d<sub>a</sub>.
                Dot: s<sup>T</sup>h, requires m=n, zero params.
                General: s<sup>T</sup>Wh, W ∈ ℝ<sup>m×n</sup>, mn params.
                Scaled dot: (q<sup>T</sup>k)/√d<sub>k</sub>, q=W<sub>Q</sub>x, k=W<sub>K</sub>x.
            </DefBlock>

            <h3>Why Scaling Is Necessary — Variance Analysis</h3>
            <p>
                Assume q, k ∈ ℝ<sup>d<sub>k</sub></sup> are drawn i.i.d. with zero mean and
                unit variance. The dot product e = q<sup>T</sup>k is a sum of d<sub>k</sub>
                products of independent unit-variance variables:
            </p>
            <MathBlock tex="\text{Var}(e) = \text{Var}\!\left(\sum_{i=1}^{d_k} q_i k_i\right) = d_k \cdot \text{Var}(q_i k_i) = d_k" />
            <p>
                So std(e) = √d<sub>k</sub>. For d<sub>k</sub> = 512, typical dot products have magnitude ~22.
                Dividing by √d<sub>k</sub> restores Var(e/√d<sub>k</sub>) = 1, preventing softmax saturation:
            </p>
            <MathBlock tex="\text{softmax}\!\left(\frac{\mathbf{e}}{\sqrt{d_k}}\right) \approx \text{one-hot}\!\left(\arg\max \mathbf{e}\right)\quad \text{without scaling, as } d_k \to \infty" />

            <h3>Gradient Comparison — Additive vs Scaled Dot-Product</h3>
            <MathBlock tex="\frac{\partial}{\partial \mathbf{s}} \mathbf{v}^\top \tanh(\mathbf{W}\mathbf{s} + \mathbf{U}\mathbf{h}) = \mathbf{W}^\top \left(\mathbf{v} \odot \text{sech}^2(\mathbf{W}\mathbf{s} + \mathbf{U}\mathbf{h})\right)" />
            <MathBlock tex="\frac{\partial}{\partial \mathbf{q}}\, \mathbf{q}^\top \mathbf{k} / \sqrt{d_k} = \mathbf{k} / \sqrt{d_k}" />
            <p>
                The additive gradient includes sech²(·) — saturating for large pre-tanh values (high-confidence alignments).
                The scaled dot-product gradient is constant: k/√d<sub>k</sub>. No saturation regardless of score magnitude.
            </p>

            <div className="ch-callout">
                <strong>Empirical finding from Luong et al.:</strong> The <em>general</em> scoring
                function (bilinear) outperformed dot but underperformed additive on some language
                pairs. However, scaled dot-product in the Transformer context (with separate
                Q/K/V projections) outperforms all of them at scale, suggesting the projections
                do the heavy lifting that the MLP did in additive attention.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Four scoring functions ────────────────────────────────────────────────────

def score_additive(s, h, W_a, U_a, v_a):
    """v_a^T tanh(W_a s + U_a h)"""
    return v_a @ np.tanh(W_a @ s + U_a @ h)

def score_dot(s, h):
    """s^T h   (requires same dimension)"""
    return s @ h

def score_general(s, h, W_a):
    """s^T W_a h"""
    return s @ W_a @ h

def score_scaled_dot(q, k, d_k):
    """q^T k / sqrt(d_k)"""
    return (q @ k) / np.sqrt(d_k)

def softmax(e):
    e = e - e.max()
    ex = np.exp(e)
    return ex / ex.sum()

# ── Compare on the same vectors ───────────────────────────────────────────────
rng = np.random.default_rng(42)
dim = 8   # s and h dimension
attn_dim = 4

s = rng.normal(0, 1, dim)
H = rng.normal(0, 1, (6, dim))   # 6 encoder positions

W_a_add = rng.normal(0, 0.1, (attn_dim, dim))
U_a_add = rng.normal(0, 0.1, (attn_dim, dim))
v_a_add = rng.normal(0, 0.1, attn_dim)
W_a_gen = rng.normal(0, 0.1, (dim, dim))

print("Alignment weights -- four scoring functions")
print("=" * 60)
print(f"{'pos':<5}  {'additive':>10}  {'dot':>10}  {'general':>10}  {'scaled_dot':>12}")
print("-" * 60)

# Raw energies
e_add = np.array([score_additive(s, h, W_a_add, U_a_add, v_a_add) for h in H])
e_dot = np.array([score_dot(s, h)                                    for h in H])
e_gen = np.array([score_general(s, h, W_a_gen)                       for h in H])
e_sca = np.array([score_scaled_dot(s, h, dim)                        for h in H])

a_add = softmax(e_add)
a_dot = softmax(e_dot)
a_gen = softmax(e_gen)
a_sca = softmax(e_sca)

for j in range(len(H)):
    print(f"  {j:<3}  {a_add[j]:>10.4f}  {a_dot[j]:>10.4f}  {a_gen[j]:>10.4f}  {a_sca[j]:>12.4f}")

print()
print("Entropy of attention distribution (higher = softer attention):")
def entropy(a):
    a = a + 1e-10
    return -(a * np.log(a)).sum()
print(f"  additive   : {entropy(a_add):.4f}")
print(f"  dot        : {entropy(a_dot):.4f}")
print(f"  general    : {entropy(a_gen):.4f}")
print(f"  scaled_dot : {entropy(a_sca):.4f}")

# ── Show softmax saturation as dim increases ──────────────────────────────────
print()
print("Softmax peak weight vs dimension (dot-product, no scaling):")
print("-" * 40)
for d in [4, 16, 64, 256, 1024]:
    q = rng.normal(0, 1, d)
    K = rng.normal(0, 1, (8, d))
    e_unscaled = K @ q
    e_scaled   = K @ q / np.sqrt(d)
    peak_u = softmax(e_unscaled).max()
    peak_s = softmax(e_scaled).max()
    print(f"  d={d:<5}  unscaled peak={peak_u:.4f}  scaled peak={peak_s:.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                All four scoring functions compared on the same encoder/decoder states,
                followed by an entropy comparison of the resulting distributions. The saturation
                experiment shows how dot-product attention without scaling degrades as
                dimensionality increases.
            </p>
            <CodeBlock code={PY_CODE} filename="scoring_functions.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ALIGNMENT_SCORES_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
