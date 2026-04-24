import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Normalization without the batch</h2>
            <p>
                Layer Normalization was introduced by Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey
                Hinton in 2016. It arose from a specific failure mode of Batch Normalization:
                when the batch size is small, or when sequences vary in length (as in NLP), BatchNorm's
                statistics become unreliable. Layer Normalization solved this by normalizing over
                the feature dimension rather than the batch dimension.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">The Problem with BatchNorm</div>
                    <div className="ch-tl-title">BatchNorm breaks for RNNs and small batches</div>
                    <div className="ch-tl-body">
                        BatchNorm requires a large batch to compute reliable statistics. In an RNN,
                        the sequence length varies between examples, making it impossible to normalize
                        across a batch at each timestep. At inference time with batch size 1, the
                        batch mean and variance are just the single example's values — making
                        normalization meaningless. BatchNorm's design assumptions were fundamentally
                        incompatible with the recurrent setting.
                    </div>
                    <div className="ch-tl-impact">Context: BatchNorm revolutionized CNNs but could not be applied to RNNs or NLP</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Solution</div>
                    <div className="ch-tl-title">Layer Normalization — Ba, Kiros, Hinton (2016)</div>
                    <div className="ch-tl-body">
                        The fix: instead of normalizing over the batch dimension for each feature,
                        normalize over the feature dimension for each example. For a hidden state
                        h ∈ ℝ<sup>H</sup>, compute mean and variance across the H features —
                        completely independent of the batch. This works with batch size 1, arbitrary
                        sequence lengths, and is identical at training and inference time. The paper
                        demonstrated LayerNorm improved training stability and final performance for
                        RNNs on machine translation, reading comprehension, and order-agnostic tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: Made normalization viable for RNNs; later became the standard for Transformers</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–present</div>
                    <div className="ch-tl-section-label">Transformer Era</div>
                    <div className="ch-tl-title">LayerNorm as the Transformer standard</div>
                    <div className="ch-tl-body">
                        "Attention Is All You Need" (Vaswani et al., 2017) used LayerNorm throughout
                        the Transformer architecture — after each sub-layer (attention and FFN).
                        Every major language model since then — BERT, GPT-2, GPT-3, LLaMA, Claude —
                        uses LayerNorm. The "Pre-LN" Transformer variant (applying LayerNorm before
                        each sub-layer rather than after) became standard in large model training
                        due to better gradient flow in early training.
                    </div>
                    <div className="ch-tl-impact">Impact: The normalization layer in every major Transformer and LLM</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>RMSNorm:</strong> A simplified variant — Root Mean Square Layer Normalization
                (Zhang & Sennrich, 2019) — removes the mean subtraction: ŷ<sub>i</sub> = y<sub>i</sub>/RMS(y),
                RMS = √(1/H Σy<sub>i</sub>²). LLaMA and many modern LLMs use RMSNorm for its
                computational efficiency while matching LayerNorm performance.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Normalizing each example by itself</h2>

            <Analogy label="BatchNorm vs LayerNorm — Two Different Directions">
                Imagine a grid of numbers, where rows are different examples (sentences) and
                columns are different features (word meanings). BatchNorm normalizes each
                column — comparing all examples on the same feature. LayerNorm normalizes
                each row — comparing all features within the same example.
                <br /><br />
                BatchNorm says: "Make sure feature 7 has mean 0 across all 32 examples."
                LayerNorm says: "Make sure example 3's 512 features have mean 0."
                <br /><br />
                For NLP, the LayerNorm approach is better: each sentence can be processed
                independently, regardless of how many sentences are in the batch.
            </Analogy>

            <Analogy label="Why RNNs Need LayerNorm">
                In an RNN, we process sentences word by word. Each sentence has a different
                number of words. At step t, we're processing word t of the sentence.
                <br /><br />
                BatchNorm would need to compare word 5 of sentence 1 with word 5 of sentence 2 —
                but what if sentence 2 only has 3 words? And at test time, when we process one
                sentence at a time, there's no "batch" to compare against at all.
                <br /><br />
                LayerNorm fixes this: normalize the 512-dimensional hidden state of each
                word representation independently. Every word, every sentence, at training
                and inference — the normalization is always valid.
            </Analogy>

            <Analogy label="The Transformer Connection">
                Every Transformer — the architecture behind BERT, GPT, and Claude — uses
                LayerNorm. After each attention operation and after each feedforward network,
                the activations are LayerNorm-ed.
                <br /><br />
                Without LayerNorm, Transformers become unstable as they get deeper. With it,
                you can stack 96 layers (as in GPT-3) and still train reliably.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Normalizing over features, not over the batch</h2>

            <h3>The Key Difference from BatchNorm</h3>
            <p>
                Consider an activation matrix X of shape (batch_size, features).
            </p>
            <ul>
                <li><strong>BatchNorm</strong>: For each feature j, compute mean/var over the batch dimension → μ<sub>j</sub>, σ²<sub>j</sub> from m examples</li>
                <li><strong>LayerNorm</strong>: For each example i, compute mean/var over the feature dimension → μ<sub>i</sub>, σ²<sub>i</sub> from H features</li>
            </ul>

            <h3>LayerNorm Equations</h3>
            <p>
                For a single example h ∈ ℝ<sup>H</sup> (e.g., a hidden state with H features):
            </p>
            <MathBlock tex="\mu = \frac{1}{H}\sum_{i=1}^{H} h_i \qquad \sigma^2 = \frac{1}{H}\sum_{i=1}^{H}(h_i - \mu)^2" />
            <p>Normalize:</p>
            <MathBlock tex="\hat{h}_i = \frac{h_i - \mu}{\sqrt{\sigma^2 + \varepsilon}}" />
            <p>Scale and shift with learnable parameters γ, β ∈ ℝ<sup>H</sup>:</p>
            <MathBlock tex="y_i = \gamma_i \hat{h}_i + \beta_i" />
            <p>
                Crucially: μ and σ² are computed per-example, so the normalization is independent
                of batch size and works identically at training and inference time.
            </p>

            <h3>In the Transformer</h3>
            <p>
                "Attention Is All You Need" placed LayerNorm after each sub-layer (Post-LN):
            </p>
            <MathBlock tex="x \leftarrow \text{LayerNorm}(x + \text{Sublayer}(x))" />
            <p>
                Modern LLMs (GPT-2 onward) use Pre-LN — LayerNorm before each sub-layer —
                which provides better gradient flow at the start of training:
            </p>
            <MathBlock tex="x \leftarrow x + \text{Sublayer}(\text{LayerNorm}(x))" />

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>No running statistics needed:</strong> Unlike BatchNorm, LayerNorm computes
                statistics fresh for each example, at every step. There are no "running mean" or
                "running variance" buffers to maintain. This makes LayerNorm simpler to implement
                and eliminates the training/inference discrepancy that requires BatchNorm's
                separate inference path.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>BatchNorm vs LayerNorm: formal comparison and gradient analysis</h2>

            <DefBlock label="Layer Normalization (Ba et al., 2016)">
                For input h ∈ ℝ<sup>H</sup> and learnable parameters γ, β ∈ ℝ<sup>H</sup>:
                <br /><br />
                μ = (1/H)Σ<sub>i</sub>h<sub>i</sub>
                &emsp; (scalar mean over features)
                <br />
                σ² = (1/H)Σ<sub>i</sub>(h<sub>i</sub>−μ)²
                &emsp; (scalar variance over features)
                <br />
                ĥ<sub>i</sub> = (h<sub>i</sub>−μ) / √(σ²+ε)
                &emsp; (normalized)
                <br />
                y<sub>i</sub> = γ<sub>i</sub>ĥ<sub>i</sub> + β<sub>i</sub>
                &emsp; (scale + shift)
            </DefBlock>

            <h3>Comparison Table</h3>
            <MathBlock tex="\begin{array}{lll} & \textbf{BatchNorm} & \textbf{LayerNorm} \\ \hline \text{Normalize over} & \text{batch (per feature)} & \text{features (per example)} \\ \text{Statistics from} & m \text{ examples} & H \text{ features} \\ \text{Training vs Inference} & \text{different modes} & \text{same mode} \\ \text{Batch size 1?} & \text{fails} & \text{works fine} \\ \text{Variable seq length?} & \text{fails} & \text{works fine} \\ \text{Used in} & \text{CNNs (ResNet)} & \text{Transformers (GPT, BERT)} \end{array}" />

            <h3>Gradient Through LayerNorm</h3>
            <p>The gradient w.r.t. input h<sub>j</sub>:</p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial h_j} = \frac{\gamma_j}{\sigma} \left[\frac{\partial \mathcal{L}}{\partial y_j} - \frac{1}{H}\sum_k \frac{\partial \mathcal{L}}{\partial y_k} - \hat{h}_j \frac{1}{H}\sum_k \frac{\partial \mathcal{L}}{\partial y_k}\hat{h}_k \right]" />
            <p>
                The gradient is fully determined by the single example's statistics (μ, σ²),
                not the batch. This makes LayerNorm gradients independent across examples
                in the batch — no gradient coupling between different training examples.
            </p>

            <h3>RMSNorm — Simplified LayerNorm</h3>
            <p>
                Omit the mean subtraction; normalize only by the root mean square:
            </p>
            <MathBlock tex="\text{RMS}(h) = \sqrt{\frac{1}{H}\sum_{i=1}^H h_i^2 + \varepsilon}" />
            <MathBlock tex="y_i = \frac{\gamma_i \cdot h_i}{\text{RMS}(h)}" />
            <p>
                RMSNorm has H fewer parameters (no β shift), is faster to compute, and
                is used in LLaMA, Mistral, and many recent large language models.
                Empirically matches LayerNorm performance while being computationally cheaper.
            </p>

            <div className="ch-callout">
                <strong>Pre-LN vs Post-LN stability:</strong> Post-LN (original Transformer)
                places LayerNorm after residual connections: x + Sublayer(x) → LN(...).
                Pre-LN places it before: x + Sublayer(LN(x)). Pre-LN preserves the magnitude
                of residual connections through the network, preventing gradient vanishing in
                deep Transformers. Modern LLMs universally use Pre-LN or its variants.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── Manual LayerNorm (NumPy) ───────────────────────────────────────────────────

def layer_norm(h, gamma, beta, eps=1e-5):
    """
    h:     (seq_len, hidden_dim) or (hidden_dim,)
    gamma, beta: (hidden_dim,)
    Normalizes over the LAST dimension (features).
    """
    mu    = h.mean(axis=-1, keepdims=True)
    sigma2 = ((h - mu)**2).mean(axis=-1, keepdims=True)
    h_hat = (h - mu) / np.sqrt(sigma2 + eps)
    return gamma * h_hat + beta

# ── BatchNorm vs LayerNorm: same batch, different behavior ─────────────────────

np.random.seed(42)
batch_size = 4
hidden_dim = 8

# Activations with different means per example
X = np.array([
    np.random.randn(hidden_dim) * 2 + 10,   # example 0: mean~10
    np.random.randn(hidden_dim) * 0.5 + 0,  # example 1: mean~0
    np.random.randn(hidden_dim) * 3 - 5,    # example 2: mean~-5
    np.random.randn(hidden_dim) * 1 + 2,    # example 3: mean~2
])

gamma = np.ones(hidden_dim)
beta  = np.zeros(hidden_dim)

# LayerNorm: each row normalized independently
Y_ln = layer_norm(X, gamma, beta)

# BatchNorm: each column normalized over batch
mu_bn     = X.mean(axis=0)
sigma_bn  = X.std(axis=0)
Y_bn      = (X - mu_bn) / (sigma_bn + 1e-5)

print("=" * 60)
print("BatchNorm vs LayerNorm on 4 examples × 8 features")
print("=" * 60)
print(f"{'':20} {'Mean':>8} {'Std':>8}")
print("-" * 40)
for i in range(batch_size):
    print(f"Input  example {i}:   {X[i].mean():>8.3f} {X[i].std():>8.3f}")
print()
for i in range(batch_size):
    print(f"LayerNorm example {i}: {Y_ln[i].mean():>8.3f} {Y_ln[i].std():>8.3f}  <- each row norm'd")
print()
for j in range(min(3, hidden_dim)):
    print(f"BatchNorm feature {j}: mean={Y_bn[:,j].mean():.3f}  <- each col norm'd")

# ── PyTorch comparison ─────────────────────────────────────────────────────────
print()
print("PyTorch LayerNorm in a Transformer block:")
print("-" * 45)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, nhead, dim_ff):
        super().__init__()
        self.attn  = nn.MultiheadAttention(d_model, nhead, batch_first=True)
        self.ff    = nn.Sequential(nn.Linear(d_model, dim_ff), nn.ReLU(),
                                   nn.Linear(dim_ff, d_model))
        self.norm1 = nn.LayerNorm(d_model)  # Pre-LN: normalize before attention
        self.norm2 = nn.LayerNorm(d_model)  # Pre-LN: normalize before FF

    def forward(self, x):
        # Pre-LN Transformer (modern standard)
        x = x + self.attn(self.norm1(x), self.norm1(x), self.norm1(x))[0]
        x = x + self.ff(self.norm2(x))
        return x

block = TransformerBlock(d_model=512, nhead=8, dim_ff=2048)
x = torch.randn(2, 20, 512)  # batch=2, seq_len=20, d_model=512
y = block(x)
print(f"Input  shape: {x.shape}")
print(f"Output shape: {y.shape}")
print(f"LayerNorm params: {sum(p.numel() for p in block.norm1.parameters())}")
print(f"  gamma (scale): {block.norm1.weight.shape} initialized to ones")
print(f"  beta  (shift): {block.norm1.bias.shape}   initialized to zeros")
`

function PythonTab() {
    return (
        <>
            <p>
                Manual NumPy implementation of LayerNorm demonstrating the per-example normalization,
                contrasted with BatchNorm. Then a PyTorch Pre-LN Transformer block showing how
                LayerNorm is used in modern architectures.
            </p>
            <CodeBlock code={PY_CODE} filename="layernorm_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Layer Normalization — TypeScript ─────────────────────────────────────────

type Vec = number[]

function mean(xs: Vec): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length
}

function variance(xs: Vec, mu: number): number {
  return xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length
}

// ── LayerNorm ─────────────────────────────────────────────────────────────────
interface LayerNormParams {
  gamma: Vec   // learnable scale (init 1)
  beta:  Vec   // learnable shift (init 0)
}

function createLayerNorm(features: number): LayerNormParams {
  return {
    gamma: new Array(features).fill(1),
    beta:  new Array(features).fill(0),
  }
}

function layerNorm(h: Vec, params: LayerNormParams, eps = 1e-5): Vec {
  const mu    = mean(h)
  const sigma2 = variance(h, mu)
  const inv   = 1 / Math.sqrt(sigma2 + eps)

  return h.map((hi, i) => {
    const hHat = (hi - mu) * inv
    return params.gamma[i] * hHat + params.beta[i]
  })
}

// ── RMSNorm (used in LLaMA, Mistral) ─────────────────────────────────────────
function rmsNorm(h: Vec, gamma: Vec, eps = 1e-5): Vec {
  const rms = Math.sqrt(h.reduce((s, x) => s + x * x, 0) / h.length + eps)
  return h.map((hi, i) => gamma[i] * hi / rms)
}

// ── Compare: BatchNorm vs LayerNorm behavior ──────────────────────────────────
function batchNorm(X: Vec[], eps = 1e-5): Vec[] {
  const features = X[0].length
  // Normalize each FEATURE across the batch
  return X.map(x => {
    // Note: real BN computes per-feature stats; simplified here per-example for demo
    const mu    = mean(x)
    const sigma2 = variance(x, mu)
    return x.map(xi => (xi - mu) / Math.sqrt(sigma2 + eps))
  })
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const hiddenDim = 8
const ln = createLayerNorm(hiddenDim)
const rmsGamma = new Array(hiddenDim).fill(1)

// Examples with very different scales
const examples: Vec[] = [
  Array.from({ length: hiddenDim }, () => Math.random() * 6 + 10),  // mean≈13
  Array.from({ length: hiddenDim }, () => Math.random() - 0.5),      // mean≈0
  Array.from({ length: hiddenDim }, () => Math.random() * 2 - 5),    // mean≈-4
]

console.log("LayerNorm: per-example normalization")
console.log("─".repeat(50))
console.log(\`\${"".padEnd(20)} \${"Input mean".padEnd(14)} \${"LN mean".padEnd(12)} LN std\`)

for (let i = 0; i < examples.length; i++) {
  const h   = examples[i]
  const y   = layerNorm(h, ln)
  const mu  = mean(h)
  const yMu = mean(y)
  const yStd = Math.sqrt(variance(y, yMu))
  console.log(\`Example \${i}:           \${mu.toFixed(3).padEnd(14)} \${yMu.toFixed(4).padEnd(12)} \${yStd.toFixed(4)}\`)
}

console.log()
console.log("Key: each example independently normalized → mean≈0, std≈1")
console.log("Works with batch_size=1 (no running statistics needed)")

// ── RMSNorm comparison ────────────────────────────────────────────────────────
console.log()
const h = examples[0]
const yLN  = layerNorm(h, ln)
const yRMS = rmsNorm(h, rmsGamma)
console.log("LayerNorm vs RMSNorm (no mean subtraction):")
console.log(\`LayerNorm [0:3]: [\${yLN.slice(0,3).map(v => v.toFixed(4)).join(", ")}]\`)
console.log(\`RMSNorm   [0:3]: [\${yRMS.slice(0,3).map(v => v.toFixed(4)).join(", ")}]\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of LayerNorm and RMSNorm (the LLaMA/Mistral variant).
                Demonstrates the core property: each example is normalized independently over
                its feature dimension, making it invariant to batch size.
            </p>
            <CodeBlock code={TS_CODE} filename="layernorm.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const LAYER_NORMALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
