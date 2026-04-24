import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>A small model that punched above its weight</h2>
            <p>
                In September 2023, a French startup called Mistral AI released Mistral 7B — a
                model with only 7 billion parameters that outperformed LLaMA 2 13B and approached
                LLaMA 1 34B on many benchmarks. It achieved this through two key architectural
                innovations: Grouped-Query Attention (GQA) and Sliding Window Attention (SWA).
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Context</div>
                    <div className="ch-tl-title">Bigger Is the Only Way?</div>
                    <div className="ch-tl-body">
                        The dominant narrative held that model quality scaled primarily with size.
                        LLaMA 2 70B was impressive but required multiple GPUs. The community
                        lacked a truly excellent small model that could run on a single consumer GPU.
                    </div>
                    <div className="ch-tl-impact">Impact: Small models were treated as toys, not tools</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Sept 2023</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Mistral 7B — Quality at the Edge</div>
                    <div className="ch-tl-body">
                        Mistral AI released Mistral 7B under the Apache 2.0 license. It used
                        Sliding Window Attention (SWA) to handle long contexts efficiently and
                        Grouped-Query Attention (GQA) to speed up inference by sharing key/value
                        heads across query heads. The result: LLaMA-2-13B quality at half the size.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved architecture beats brute-force scaling</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Dec 2023</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">Mixtral 8×7B — Sparse Mixture of Experts</div>
                    <div className="ch-tl-body">
                        Mistral released Mixtral, a sparse MoE model with 8 expert networks (7B each)
                        and a router. Despite having 47B total parameters, only 13B are active per
                        token, making inference faster than dense 70B models while matching or
                        beating LLaMA 2 70B and GPT-3.5 on benchmarks.
                    </div>
                    <div className="ch-tl-impact">Impact: Brought MoE efficiency to the open-source mainstream</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Attention architecture matters as much as scale.
                By using GQA to reduce KV-cache memory and SWA to extend context cheaply, Mistral 7B
                achieved flagship performance in a footprint small enough for edge devices.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A tiny brain that beats bigger brains</h2>

            <Analogy label="The Library Card">
                Imagine you need to read a really long book, but you can only remember a few pages
                at a time. Most big brains solve this by hiring a huge team of readers — expensive
                and slow. Mistral's trick was giving each reader a shared notebook (GQA) and only
                reading chapters near the current page (SWA), so a tiny team could finish faster.
            </Analogy>

            <Analogy label="The Specialist Room">
                Mixtral is like a room full of 8 specialist advisors. When you ask a question, a
                doorkeeper picks the 2 best experts to answer. The room has 8 advisors, but only
                2 work on each question — so it's fast, even though the collective knowledge is huge.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Architectural innovations in Mistral 7B</h2>

            <h3>Grouped-Query Attention (GQA)</h3>
            <p>
                In standard Multi-Head Attention, each query head has its own key and value head.
                This creates a large KV cache during inference. GQA groups query heads to share
                key/value heads, reducing memory bandwidth and cache size:
            </p>
            <ul>
                <li><strong>MHA:</strong> N query heads, N key heads, N value heads</li>
                <li><strong>GQA:</strong> N query heads, G key/value groups (G &lt; N)</li>
                <li><strong>MQA:</strong> N query heads, 1 key/value head (extreme case)</li>
            </ul>
            <p>
                Mistral 7B uses GQA with 8 key/value groups, striking a balance between quality
                and memory efficiency.
            </p>

            <h3>Sliding Window Attention (SWA)</h3>
            <p>
                Standard attention computes pairwise scores across the full sequence — O(n²)
                complexity. SWA restricts each token to attend only to the previous W tokens
                (W = 4096 in Mistral). This reduces complexity to O(n·W) and allows handling
                arbitrarily long sequences by stacking layers.
            </p>

            <h3>Mixture of Experts (MoE)</h3>
            <p>
                Mixtral 8×7B contains 8 feed-forward "expert" networks. A gating network (router)
                selects the top-k experts (k=2) for each token. Only the selected experts are
                computed, so despite 47B total parameters, inference uses only ~13B active
                parameters per token.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> Mistral 7B matched LLaMA 2 13B quality with 46% fewer
                parameters and faster inference. Mixtral 8×7B matched GPT-3.5 with a fraction of
                the active compute.
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
            <h2>GQA, SWA, and MoE mathematics</h2>

            <DefBlock label="Grouped-Query Attention">
                Let Q<sub>h</sub> be query head h, and let g(h) map heads to groups. The attention
                output for head h uses shared keys and values:
                <MathBlock tex="\text{Attention}_h(Q, K, V) = \text{softmax}\left(\frac{Q_h K_{g(h)}^\top}{\sqrt{d_k}}\right) V_{g(h)}" />
                Where K<sub>g(h)</sub> and V<sub>g(h)</sub> are the shared key/value projections
                for group g(h). This reduces the KV cache from O(N·L·d) to O(G·L·d).
            </DefBlock>

            <h3>Sliding Window Attention Mask</h3>
            <p>
                SWA applies a causal banded mask where each position i attends only to positions
                j satisfying i − W ≤ j ≤ i:
            </p>
            <MathBlock tex="M_{ij} = \begin{cases} 0 & \text{if } i - W \leq j \leq i \\ -\infty & \text{otherwise} \end{cases}" />
            <p>
                After L layers with window W, the effective receptive field grows to L·W,
                allowing distant interactions through intermediate layers.
            </p>

            <h3>Mixture of Experts Routing</h3>
            <p>
                Given input x and E experts, the router computes gating scores and selects top-k:
            </p>
            <MathBlock tex="g(x) = \text{softmax}(x \cdot W_g), \quad \mathcal{E}(x) = \text{TopK}(g(x), k)" />
            <p>
                The output is a weighted sum over selected experts, with load-balancing auxiliary
                loss to prevent collapse to a single expert:
            </p>
            <MathBlock tex="y = \sum_{e \in \mathcal{E}(x)} g(x)_e \cdot \text{FFN}_e(x)" />
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Grouped-Query Attention — NumPy ───────────────────────────────────────────
def grouped_query_attention(Q, K_shared, V_shared, num_groups, mask=None):
    """
    Q: (batch, num_heads, seq, head_dim)
    K_shared, V_shared: (batch, num_groups, seq, head_dim)
    """
    B, H, L, d = Q.shape
    G = num_groups
    heads_per_group = H // G

    # Repeat shared K/V to match query heads
    K = np.repeat(K_shared, heads_per_group, axis=1)
    V = np.repeat(V_shared, heads_per_group, axis=1)

    scores = np.matmul(Q, K.transpose(0, 1, 3, 2)) / np.sqrt(d)
    if mask is not None:
        scores += mask
    attn = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attn /= np.sum(attn, axis=-1, keepdims=True)
    return np.matmul(attn, V)

# ── Sliding Window Mask — NumPy ───────────────────────────────────────────────
def sliding_window_mask(seq_len, window_size):
    """Returns causal banded mask for SWA."""
    mask = np.full((seq_len, seq_len), -1e9)
    for i in range(seq_len):
        start = max(0, i - window_size)
        mask[i, start:i+1] = 0.0
    return mask

# ── Top-K Router — NumPy ──────────────────────────────────────────────────────
def moe_route(x, W_g, k=2):
    """
    x: input vector (d,)
    W_g: router weights (d, num_experts)
    """
    logits = x @ W_g
    probs = np.exp(logits - np.max(logits))
    probs /= np.sum(probs)
    topk_idx = np.argpartition(probs, -k)[-k:]
    return topk_idx, probs[topk_idx]

# ── Demo ──────────────────────────────────────────────────────────────────────
L, d = 8, 32
mask = sliding_window_mask(L, window_size=4)
print("SWA mask shape:", mask.shape, "non-inf:", np.sum(mask > -1))

x = np.random.randn(d)
W_g = np.random.randn(d, 8)
idx, weights = moe_route(x, W_g, k=2)
print("Selected experts:", idx, "weights:", weights.round(3))
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of Grouped-Query Attention, Sliding Window masking, and
                Mixture-of-Experts routing.
            </p>
            <CodeBlock code={PY_CODE} filename="mistral_ops.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MISTRAL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
