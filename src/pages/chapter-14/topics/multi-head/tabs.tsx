import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>One head is never enough</h2>
            <p>
                The original Bahdanau attention used a single scalar score for each
                encoder-decoder pair. But human attention is not one-dimensional: when reading
                a sentence, you simultaneously track syntax, semantics, coreference, and
                sentiment. Multi-head attention was designed to let the model do the same.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014 – 2016</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Single-Score Attention in RNNs</div>
                    <div className="ch-tl-body">
                        Bahdanau and Luong attention computed a single relevance score per
                        source token. This worked well for alignment in machine translation,
                        but a single vector dot product can only capture one type of relationship
                        at a time. A model trying to resolve a pronoun and translate a verb
                        tense simultaneously would have to squeeze both tasks into the same
                        attention distribution.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed attention works, but one head is limiting</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — Multi-Head Attention</div>
                    <div className="ch-tl-body">
                        The Transformer paper introduced multi-head attention as a way to run
                        h independent attention operations in parallel, each with its own
                        learned projections. The outputs are concatenated and projected once
                        more. The analogy to convolutional neural networks is deliberate: just
                        as a CNN learns multiple filters to detect edges, textures, and shapes,
                        a Transformer learns multiple attention heads to detect different
                        linguistic relationships.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled the model to jointly attend to information from different representation subspaces</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">Voita et al. — Analyzing Multi-Head Self-Attention</div>
                    <div className="ch-tl-body">
                        Elena Voita and colleagues at the University of Edinburgh showed that
                        different heads specialize: some attend to adjacent tokens (syntax),
                        some attend to distant coreferent mentions (semantics), and some attend
                        to fixed positions (positional bias). They also found that many heads
                        are redundant and can be pruned with minimal accuracy loss.
                    </div>
                    <div className="ch-tl-impact">Impact: Empirically validated the "specialized heads" hypothesis</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2024</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">Multi-Query and Grouped-Query Attention</div>
                    <div className="ch-tl-body">
                        To reduce memory bandwidth during autoregressive decoding, researchers
                        introduced Multi-Query Attention (MQA), where all heads share a single
                        Key and Value projection. Grouped-Query Attention (GQA) is a middle
                        ground, grouping heads to share K/V projections. These variants trade
                        a small amount of expressivity for significant inference speedups.
                    </div>
                    <div className="ch-tl-impact">Impact: MQA and GQA are now standard in production LLMs like LLaMA and Mistral</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> A single attention distribution is a
                bottleneck. By splitting the model's representational space into h subspaces
                and attending independently in each, the model can learn diverse relational
                features — syntax, semantics, position, and more — without increasing the
                asymptotic complexity.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Asking the same question in different friend groups</h2>

            <Analogy label="One Friend Group (Single-Head Attention)">
                Imagine you need advice on three things: what to wear, what to eat, and how
                to solve a math problem. If you ask a single group of friends, they have to
                juggle all three topics at once. Their advice gets muddled because no one
                person is an expert in all three areas.
            </Analogy>

            <Analogy label="Multiple Friend Groups (Multi-Head Attention)">
                Now imagine you split into three separate chats. Chat A is with fashion
                friends, Chat B is with foodies, and Chat C is with math nerds. Each group
                gives you focused advice on their topic. At the end, you collect all three
                pieces of advice and combine them into one action plan.
                <br /><br />
                Multi-head attention does exactly this: it splits the "brain" of the model
                into several parallel groups (heads). Each head learns to pay attention to
                a different kind of relationship. One head learns grammar, another learns
                word meaning, another learns who "he" or "she" refers to. Then they merge
                their findings.
            </Analogy>

            <Analogy label="The Merge Step">
                After getting advice from all groups, you do not simply pile the papers on
                your desk. You synthesize: wear the jacket (fashion), go to the sushi place
                (food), and use the quadratic formula (math). The final linear projection
                W<sup>O</sup> is that synthesis step — it learns how much to trust each
                group's advice for the final decision.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Parallel attention in learned subspaces</h2>

            <h3>Motivation</h3>
            <p>
                A single attention head computes one weighted average of Values. But language
                is rich: a pronoun might need to attend to its antecedent, a verb to its
                object, and an adjective to its noun — all in the same layer. Multi-head
                attention gives the model h separate "channels" to learn these different
                relationships.
            </p>

            <h3>How It Works</h3>
            <p>
                For each head i (from 1 to h), we learn separate projection matrices
                W<sup>Q</sup><sub>i</sub>, W<sup>K</sup><sub>i</sub>, W<sup>V</sup><sub>i</sub>.
                The input X is projected into h different Query, Key, and Value spaces:
            </p>
            <MathBlock tex="Q_i = XW_i^{Q}, \quad K_i = XW_i^{K}, \quad V_i = XW_i^{V}" />
            <p>
                Each head runs scaled dot-product attention independently:
            </p>
            <MathBlock tex="\text{head}_i = \text{Attention}(Q_i, K_i, V_i) = \text{softmax}\!\left(\frac{Q_i K_i^{\top}}{\sqrt{d_k}}\right)V_i" />
            <p>
                The outputs are concatenated and projected one final time:
            </p>
            <MathBlock tex="\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)\,W^{O}" />

            <h3>Dimension Budget</h3>
            <p>
                If the model dimension is d<sub>model</sub> = 512 and we use h = 8 heads,
                then each head has d<sub>k</sub> = d<sub>v</sub> = d<sub>model</sub> / h = 64.
                The total parameter count is the same as a single large attention layer,
                because we split the dimensions rather than stacking them. The only extra
                parameters are in W<sup>O</sup> ∈ ℝ<sup>d<sub>model</sub> × d<sub>model</sub></sup>.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Head specialization:</strong> In practice, different heads do specialize.
                Some heads attend broadly to the next or previous token (local syntax). Others
                attend to specific semantic relationships, like subject-verb agreement or
                coreference. A few heads even learn to attend to fixed positions regardless
                of content, acting as a crude positional bias.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Full multi-head specification and parameter analysis</h2>

            <DefBlock label="Multi-Head Attention — Formal Specification">
                Input: X ∈ ℝ<sup>n×d<sub>model</sub></sup>. Number of heads: h.
                Dimensions per head: d<sub>k</sub> = d<sub>v</sub> = d<sub>model</sub> / h.
                Weight matrices: W<sup>Q</sup><sub>i</sub>, W<sup>K</sup><sub>i</sub> ∈ ℝ<sup>d<sub>model</sub>×d<sub>k</sub></sup>;
                W<sup>V</sup><sub>i</sub> ∈ ℝ<sup>d<sub>model</sub>×d<sub>v</sub></sup> for i = 1..h.
                Output projection: W<sup>O</sup> ∈ ℝ<sup>h·d<sub>v</sub>×d<sub>model</sub></sup>.
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="Q_i = XW_i^{Q}, \quad K_i = XW_i^{K}, \quad V_i = XW_i^{V} \quad \text{for } i = 1,\dots,h" />
            <MathBlock tex="\text{head}_i = \text{softmax}\!\left(\frac{Q_i K_i^{\top}}{\sqrt{d_k}}\right)V_i" />
            <MathBlock tex="\text{MultiHead}(X) = \bigl[\text{head}_1 \;|\; \dots \;|\; \text{head}_h\bigr] \, W^{O}" />

            <h3>Parameter Count</h3>
            <p>
                Each head has 3 projection matrices of size d<sub>model</sub> × d<sub>k</sub>:
            </p>
            <MathBlock tex="\text{Params per head} = 3 \cdot d_{\text{model}} \cdot d_k = 3 \cdot d_{\text{model}} \cdot \frac{d_{\text{model}}}{h} = \frac{3 d_{\text{model}}^2}{h}" />
            <p>
                Across h heads, plus the output projection W<sup>O</sup> of size
                (h·d<sub>v</sub>) × d<sub>model</sub> = d<sub>model</sub> × d<sub>model</sub>:
            </p>
            <MathBlock tex="\text{Total MHA params} = h \cdot \frac{3 d_{\text{model}}^2}{h} + d_{\text{model}}^2 = 4 d_{\text{model}}^2" />
            <p>
                For d<sub>model</sub> = 512, this is 4 × 512<sup>2</sup> = 1,048,576 parameters.
                A single large attention layer with the same total parameter budget would also
                have ~4d<sup>2</sup> parameters, so multi-head attention does not increase
                capacity — it increases <em>structure</em>.
            </p>

            <h3>Computational Complexity</h3>
            <p>
                Each head computes attention on a sequence of length n with dimension d<sub>k</sub>.
                The cost per head is O(n<sup>2</sup> d<sub>k</sub>). With h heads:
            </p>
            <MathBlock tex="\text{Total cost} = h \cdot O(n^2 d_k) = h \cdot O\!\left(n^2 \frac{d_{\text{model}}}{h}\right) = O(n^2 d_{\text{model}})" />
            <p>
                The h cancels! Multi-head attention has the same asymptotic complexity as
                single-head attention with dimension d<sub>model</sub>. The benefit is not
                speed but <em>representational diversity</em>.
            </p>

            <div className="ch-callout">
                <strong>Why concatenate and not add?</strong> Concatenation preserves the
                information from each head in distinct slots. The output projection W<sup>O</sup>
                learns to mix these slots. If we added instead, heads would interfere destructively
                and the model could not learn to trust one head for syntax and another for
                semantics.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Multi-Head Attention — NumPy ──────────────────────────────────────────────

def softmax(x, axis=-1):
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[1]
    scores = Q @ K.T / np.sqrt(d_k)
    attn = softmax(scores, axis=-1)
    return attn @ V

class MultiHeadAttention:
    def __init__(self, d_model, num_heads, seed=42):
        assert d_model % num_heads == 0
        rng = np.random.default_rng(seed)
        self.num_heads = num_heads
        self.d_model = d_model
        self.d_k = d_model // num_heads

        self.W_q = rng.normal(0, 0.01, (d_model, d_model))
        self.W_k = rng.normal(0, 0.01, (d_model, d_model))
        self.W_v = rng.normal(0, 0.01, (d_model, d_model))
        self.W_o = rng.normal(0, 0.01, (d_model, d_model))

    def forward(self, X):
        """X: (n, d_model) → output: (n, d_model)"""
        n = X.shape[0]
        Q = X @ self.W_q          # (n, d_model)
        K = X @ self.W_k
        V = X @ self.W_v

        # Reshape into (num_heads, n, d_k)
        Q = Q.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)
        K = K.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)
        V = V.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)

        # Attention per head
        heads = []
        for i in range(self.num_heads):
            heads.append(scaled_dot_product_attention(Q[i], K[i], V[i]))

        # Concatenate: (n, num_heads, d_k) → (n, d_model)
        concat = np.stack(heads, axis=1).transpose(1, 0, 2).reshape(n, self.d_model)
        return concat @ self.W_o


# ── Demo ──────────────────────────────────────────────────────────────────────
n, d_model, num_heads = 10, 64, 8
rng = np.random.default_rng(7)
X = rng.normal(0, 0.5, (n, d_model))

mha = MultiHeadAttention(d_model, num_heads)
out = mha.forward(X)

print("Multi-Head Attention Demo")
print("=" * 45)
print(f"Sequence length : {n}")
print(f"Model dim       : {d_model}")
print(f"Heads           : {num_heads}")
print(f"Dim per head    : {mha.d_k}")
print(f"Output shape    : {out.shape}")
print()
print(f"Parameters      : {sum(w.size for w in [mha.W_q, mha.W_k, mha.W_v, mha.W_o])}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of multi-head self-attention with explicit reshaping
                into per-head tensors. Demonstrates the parameter count and output shape.
            </p>
            <CodeBlock code={PY_CODE} filename="multi_head_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MULTI_HEAD_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
