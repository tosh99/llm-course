import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The open-source large language model revolution</h2>
            <p>
                Before February 2023, state-of-the-art language models were tightly controlled by
                a handful of labs. GPT-3 was API-only; GPT-4 hadn't even been announced. Then Meta
                released LLaMA — a family of foundation models from 7B to 65B parameters — and
                deliberately leaked the weights to the research community, igniting an explosion of
                open-source innovation.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Context</div>
                    <div className="ch-tl-title">Closed Models Dominate</div>
                    <div className="ch-tl-body">
                        OpenAI's GPT-3 and InstructGPT are available only through APIs. Researchers
                        and developers cannot study weights, modify architectures, or fine-tune on
                        private data. The open-source community lacks competitive alternatives.
                    </div>
                    <div className="ch-tl-impact">Impact: Centralization of AI capability in a few corporations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Feb 2023</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Touvron et al. — LLaMA: Open and Efficient Foundation Language Models</div>
                    <div className="ch-tl-body">
                        Meta AI trained LLaMA models at 7B, 13B, 33B, and 65B parameters using only
                        publicly available datasets. The key innovation was training smaller models
                        on <em>far more tokens</em> than previous work — following the Chinchilla
                        scaling laws. LLaMA-13B outperformed GPT-3 (175B) on most benchmarks.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved open models could match closed giants</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2023</div>
                    <div className="ch-tl-section-label">Community</div>
                    <div className="ch-tl-title">The Weights Leak and the Ecosystem Explodes</div>
                    <div className="ch-tl-body">
                        LLaMA weights were distributed via torrent, and within weeks the community
                        built Alpaca (Stanford), Vicuna, Koala, WizardLM, and dozens more fine-tuned
                        variants. For the first time, anyone with a consumer GPU could run and
                        modify a GPT-3-class model locally.
                    </div>
                    <div className="ch-tl-impact">Impact: Democratized access to large language models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">July 2023</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">LLaMA 2 — Commercially Usable Open Weights</div>
                    <div className="ch-tl-body">
                        Meta released LLaMA 2 with a commercially permissive license. The suite
                        included 7B, 13B, and 70B base models plus chat-tuned variants trained with
                        RLHF. LLaMA 2-70B approached GPT-3.5 performance, and the model became the
                        default foundation for open-source development.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the open-weights standard for enterprise use</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Chinchilla-optimal training — smaller models
                trained on more data — produces better inference efficiency than giant models
                trained on too few tokens. LLaMA traded training compute for inference accessibility.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Sharing the recipe for a super-smart robot</h2>

            <Analogy label="The Secret Sauce">
                Imagine the world's best chefs had been making amazing cakes, but they never shared
                the recipes. You could buy a slice, but you couldn't bake your own, change the
                flavors, or make a cake for your friend's birthday party. That's what AI was like
                before LLaMA.
            </Analogy>

            <Analogy label="Meta's Cookbook">
                Meta said, "Here is our recipe!" They shared LLaMA, a really smart talking robot
                brain. It wasn't the biggest brain, but they trained it extra hard — like studying
                every book in the library instead of just the big ones. Because of this, the smaller
                brain was surprisingly clever.
            </Analogy>

            <Analogy label="The Baking Party">
                Once the recipe leaked out, scientists and tinkerers everywhere started baking their
                own versions. They added different flavors — some made it better at coding, some at
                answering questions, some at speaking other languages. It was like a worldwide
                baking contest, and everyone got to play.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>LLaMA: training smaller models on more data</h2>

            <h3>Chinchilla-Optimal Training</h3>
            <p>
                Hoffmann et al. (2022) showed that most large models were <em>undertrained</em> —
                they had too many parameters and not enough training tokens. The optimal compute
                allocation suggests training a model on roughly 20 tokens per parameter. LLaMA
                applied this insight aggressively:
            </p>
            <ul>
                <li><strong>LLaMA-7B:</strong> Trained on 1.0T tokens (~143 tokens/param)</li>
                <li><strong>LLaMA-13B:</strong> Trained on 1.0T tokens (~77 tokens/param)</li>
                <li><strong>LLaMA-65B:</strong> Trained on 1.4T tokens (~22 tokens/param)</li>
            </ul>

            <h3>Architecture Details</h3>
            <p>
                LLaMA uses the standard Transformer decoder with several efficiency improvements
                borrowed from later research:
            </p>
            <ul>
                <li><strong>Pre-normalization:</strong> RMSNorm applied to inputs of each sub-layer (not post)</li>
                <li><strong>SwiGLU activation:</strong> Replaces ReLU for better performance</li>
                <li><strong>Rotary Positional Embeddings (RoPE):</strong> Encodes position via rotation matrices</li>
                <li><strong>KV Cache:</strong> Reuses key/value tensors during autoregressive generation</li>
            </ul>

            <h3>Training Data</h3>
            <p>
                LLaMA was trained exclusively on publicly available datasets — no proprietary data.
                The corpus included CommonCrawl, C4, GitHub, Wikipedia, Books, ArXiv, and Stack
                Exchange. All data was deduplicated and filtered for quality.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> LLaMA-13B outperformed GPT-3 (175B) on most benchmarks
                despite being 13× smaller. The trade-off was longer training time, but the resulting
                model was far cheaper to run at inference.
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
            <h2>Chinchilla scaling and training efficiency</h2>

            <DefBlock label="Chinchilla Compute-Optimal Loss">
                Given model parameters N and training tokens D, the cross-entropy loss follows a
                power-law relationship. Hoffmann et al. showed the compute-optimal frontier
                satisfies N<sub>opt</sub> ∝ C<sup>0.50</sup> and D<sub>opt</sub> ∝ C<sup>0.50</sup>,
                where C is total FLOPs:
                <MathBlock tex="L(N, D) = \frac{A}{N^\alpha} + \frac{B}{D^\beta} + L_\infty" />
                With fitted constants α ≈ 0.34 and β ≈ 0.28. For a fixed compute budget, smaller
                models trained longer often outperform larger models trained briefly.
            </DefBlock>

            <h3>RMSNorm</h3>
            <p>
                LLaMA uses Root Mean Square Layer Normalization instead of standard LayerNorm,
                removing the mean-centering step and learnable bias:
            </p>
            <MathBlock tex="\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{n}\sum_{i=1}^n x_i^2 + \epsilon}} \cdot \gamma" />

            <h3>SwiGLU Activation</h3>
            <p>
                The SwiGLU feed-forward layer uses a gating mechanism with Swish (SiLU) activation:
            </p>
            <MathBlock tex="\text{SwiGLU}(x, W, V, b, c) = \text{Swish}_1(xW + b) \otimes (xV + c)" />
            <p>
                Where Swish<sub>β</sub>(x) = x · σ(βx). In practice this requires three weight
                matrices instead of two, increasing parameters by 50% in the FFN layer.
            </p>

            <h3>Rotary Position Embedding (RoPE)</h3>
            <p>
                RoPE encodes relative position by rotating query/key vectors in 2D subspaces:
            </p>
            <MathBlock tex="R_{\Theta, m} = \begin{pmatrix} \cos m\theta_1 & -\sin m\theta_1 \\ \sin m\theta_1 & \cos m\theta_1 \end{pmatrix} \otimes \cdots \otimes \begin{pmatrix} \cos m\theta_{d/2} & -\sin m\theta_{d/2} \\ \sin m\theta_{d/2} & \cos m\theta_{d/2} \end{pmatrix}" />
            <p>
                Where θ<sub>i</sub> = 10000<sup>−2(i−1)/d</sup>. This naturally decays attention
                scores with relative distance.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── RMSNorm — NumPy ───────────────────────────────────────────────────────────
def rmsnorm(x, gamma, eps=1e-6):
    """
    x: input vector (n,)
    gamma: learnable scale (n,)
    """
    rms = np.sqrt(np.mean(x ** 2) + eps)
    return (x / rms) * gamma

# ── Swish / SiLU — NumPy ──────────────────────────────────────────────────────
def swish(x, beta=1.0):
    return x * (1 / (1 + np.exp(-beta * x)))

def swiglu(x, W, V, b, c):
    """
    x: input (d,)
    W, V: weight matrices (d, hidden)
    b, c: biases (hidden,)
    """
    return swish(x @ W + b) * (x @ V + c)

# ── RoPE rotation — NumPy ─────────────────────────────────────────────────────
def apply_rope(x, m, theta_base=10000.0):
    """
    x: query or key vector (d,), must be even d
    m: position index
    """
    d = x.shape[0]
    x = x.reshape(-1, 2)
    thetas = theta_base ** (-2 * np.arange(d // 2) / d)
    angles = m * thetas
    rot = np.stack([
        x[:, 0] * np.cos(angles) - x[:, 1] * np.sin(angles),
        x[:, 0] * np.sin(angles) + x[:, 1] * np.cos(angles)
    ], axis=1)
    return rot.flatten()

# ── Demo ──────────────────────────────────────────────────────────────────────
x = np.random.randn(512)
gamma = np.ones(512)
normed = rmsnorm(x, gamma)
print("RMSNorm mean:", np.mean(normed).round(4), "std:", np.std(normed).round(4))

rotated = apply_rope(x[:8], m=42)
print("RoPE rotated:", rotated.round(3))
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of LLaMA's core architectural components: RMSNorm, SwiGLU
                gating, and Rotary Position Embeddings.
            </p>
            <CodeBlock code={PY_CODE} filename="llama_ops.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LLAMA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
