import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From additive scores to scaled dot-products</h2>
            <p>
                The attention mechanism is parameterized by a scoring function — a way of
                measuring how compatible a decoder state is with a given encoder state. Bahdanau's
                original choice was not the only option. Over 2014–2017, a progression of scoring
                functions emerged, each trading off expressiveness, computation, and stability.
                The final form — scaled dot-product attention — became the foundation of the
                Transformer.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">First Scoring Function</div>
                    <div className="ch-tl-title">Additive (MLP) Attention — Bahdanau et al.</div>
                    <div className="ch-tl-body">
                        Bahdanau's energy function e<sub>tj</sub> = v<sub>a</sub><sup>T</sup> tanh(W<sub>a</sub>s + U<sub>a</sub>h)
                        uses a one-hidden-layer MLP to compute compatibility. This is sometimes called
                        "concat" attention because it concatenates (or projects and adds) the two
                        vectors before scoring. It requires three weight matrices and a nonlinearity
                        but is very flexible — the MLP can learn arbitrary compatibility functions
                        between states of different dimensionality.
                    </div>
                    <div className="ch-tl-impact">Impact: Most expressive scoring function; standard for years</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">Dot-Product and General — Luong et al.</div>
                    <div className="ch-tl-body">
                        Minh-Thang Luong, Hieu Pham, and Christopher Manning proposed two simpler
                        alternatives in "Effective Approaches to Attention-based Neural Machine
                        Translation" (EMNLP 2015). The <em>dot</em> score s<sup>T</sup>h requires
                        no parameters at all — just a dot product. The <em>general</em> score
                        s<sup>T</sup>Wh introduces a single bilinear weight matrix W. Both are far
                        cheaper to compute than additive attention. Empirically they performed
                        comparably or better despite the simplicity.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that simpler scoring was sufficient; reduced attention overhead significantly</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Scaling Insight</div>
                    <div className="ch-tl-title">Scaled Dot-Product — Vaswani et al. (Transformer)</div>
                    <div className="ch-tl-body">
                        The Transformer introduced one critical modification: divide the dot product
                        by √d<sub>k</sub> before softmax. The reasoning: for large embedding
                        dimensions d<sub>k</sub>, the dot product e = q<sup>T</sup>k tends to grow
                        proportionally to √d<sub>k</sub> (by the variance of a sum of d<sub>k</sub>
                        products of unit-variance variables). Without scaling, large dot products push
                        softmax into its saturation regime where gradients vanish. Dividing by
                        √d<sub>k</sub> keeps the variance of e at approximately 1, regardless of
                        dimension, preserving healthy gradient magnitudes.
                    </div>
                    <div className="ch-tl-impact">Impact: The scaling trick made deep stacks of attention layers trainable at high dimensions</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The progression in one line:</strong> additive (expressive, expensive) →
                dot-product (cheap, unstable at high d) → scaled dot-product (cheap, stable).
                This convergence on scaled dot-product attention is why every Transformer
                from BERT to GPT-4 uses the same core operation.
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
            </Analogy>

            <Analogy label="Additive Score — Ask a Tiny Network">
                The Bahdanau approach is like asking a small helper: "Here is the decoder's
                current state AND here is the encoder position — run them both through a small
                brain and tell me how well they match." The small brain (one layer + tanh)
                can learn complicated notions of compatibility. But it's slower, because you
                have to run this brain for every encoder position at every decoder step.
            </Analogy>

            <Analogy label="Dot-Product Score — Check Direction">
                The simpler approach: just multiply the two vectors together element-by-element
                and add up. This is a dot product. Two vectors with a high dot product are
                "pointing in the same direction" — they're similar. No extra parameters needed.
                The weakness: it only works well when the encoder and decoder use the same
                dimensional space naturally.
            </Analogy>

            <Analogy label="Scaled Dot-Product — Fix the Volume Knob">
                As vectors get longer (higher dimension), their dot products get larger and
                larger by chance, even for random vectors. Before feeding into softmax, huge
                scores cause the softmax to become almost one-hot — all attention collapses
                onto one position. Dividing by the square root of the dimension is like turning
                down the volume so the softmax stays soft and gradients can flow.
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
                Parameters: W<sub>a</sub> ∈ ℝ<sup>d×n</sup>, U<sub>a</sub> ∈ ℝ<sup>d×2n</sup>,
                v<sub>a</sub> ∈ ℝ<sup>d</sup>. Works when s and h have different dimensions.
                Most expressive. Cost: O(d·n) per (s, h) pair.
            </p>

            <h3>2 — Dot-Product (Luong)</h3>
            <MathBlock tex="\text{score}(\mathbf{s}, \mathbf{h}) = \mathbf{s}^\top \mathbf{h}" />
            <p>
                No parameters. Requires dim(s) = dim(h). Cheapest possible.
                Works surprisingly well in practice when both encoder and decoder states
                live in the same space.
            </p>

            <h3>3 — General / Bilinear (Luong)</h3>
            <MathBlock tex="\text{score}(\mathbf{s}, \mathbf{h}) = \mathbf{s}^\top \mathbf{W}_a \mathbf{h}" />
            <p>
                One weight matrix W<sub>a</sub> ∈ ℝ<sup>n×n</sup>. Generalizes the dot product —
                when W<sub>a</sub> = I it reduces to the dot score. Allows s and h to have different
                dimensions if W<sub>a</sub> is rectangular.
            </p>

            <h3>4 — Scaled Dot-Product (Transformer)</h3>
            <MathBlock tex="\text{score}(\mathbf{q}, \mathbf{k}) = \frac{\mathbf{q}^\top \mathbf{k}}{\sqrt{d_k}}" />
            <p>
                The queries q and keys k are linear projections of the input:
                q = W<sub>Q</sub>x, k = W<sub>K</sub>x. Dividing by √d<sub>k</sub> prevents
                softmax saturation. This is the operation in every Transformer layer.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Summary table:</strong>
                additive: best for mismatched dims, O(d) params;
                dot: zero params, requires same dim;
                general: O(n²) params, flexible dims;
                scaled dot: zero extra params, √d<sub>k</sub> normalization, Transformer standard.
            </div>
        </>
    )
}

function MathsTab() {
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
                So the standard deviation of e grows as √d<sub>k</sub>. For d<sub>k</sub> = 512,
                typical dot products have magnitude ~22. The softmax of values in this range
                becomes extremely peaked:
            </p>
            <MathBlock tex="\text{softmax}\!\left(\frac{\mathbf{e}}{\sqrt{d_k}}\right) \approx \text{one-hot}\!\left(\arg\max \mathbf{e}\right)\quad \text{for large } d_k \text{ without scaling}" />
            <p>
                The gradient of softmax near a one-hot is near zero — training stalls.
                Dividing by √d<sub>k</sub> restores the variance of the pre-softmax inputs
                to approximately 1, regardless of d<sub>k</sub>.
            </p>

            <h3>Bahdanau vs Luong — What the Gradient Sees</h3>
            <p>
                For additive attention, the gradient of the score w.r.t. s passes through
                a tanh, which saturates for large inputs (derivative → 0). The saturation
                region corresponds to high-confidence alignment — when the model is very
                sure, gradients through the score to s and h become tiny. Dot-product
                attention has no tanh; its gradient w.r.t. q is simply k. This is more
                gradient-friendly but less expressive.
            </p>
            <MathBlock tex="\frac{\partial}{\partial \mathbf{s}} \mathbf{v}^\top \tanh(\mathbf{W}\mathbf{s} + \mathbf{U}\mathbf{h}) = \mathbf{W}^\top \left(\mathbf{v} \odot \text{sech}^2(\mathbf{W}\mathbf{s} + \mathbf{U}\mathbf{h})\right)" />
            <MathBlock tex="\frac{\partial}{\partial \mathbf{q}}\, \mathbf{q}^\top \mathbf{k} / \sqrt{d_k} = \mathbf{k} / \sqrt{d_k}" />

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

print("Alignment weights — four scoring functions")
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

function PythonTab() {
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
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
