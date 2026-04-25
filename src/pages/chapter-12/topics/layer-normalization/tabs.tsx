import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Normalization without the batch</h2>
            <p>
                Layer Normalization was introduced by Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey Hinton in 2016. It arose from a specific failure mode of Batch Normalization: when the batch size is small, or when sequences vary in length (as in NLP), BatchNorm's statistics become unreliable. Layer Normalization solved this by normalizing over the feature dimension rather than the batch dimension — a change that made normalization viable for recurrent networks and, later, for the Transformer architecture that powers every modern language model.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">The Problem with BatchNorm</div>
                    <div className="ch-tl-title">BatchNorm Breaks for RNNs and Small Batches</div>
                    <div className="ch-tl-body">
                        BatchNorm's dependence on batch statistics creates fundamental incompatibilities with recurrent networks. In an RNN processing sequences, different examples in a batch have different sequence lengths — so at timestep t, some examples have ended and others are still running. Computing statistics across the batch at each timestep mixes apples and oranges.
                        <br /><br />
                        Furthermore, at inference time with a single sequence (batch size = 1), the batch mean and variance are just the single example's values — the statistics computed from one example are far too noisy to normalize reliably. The running averages accumulated during training do not transfer because inference sequences may differ from training sequences in length and content.
                        <br /><br />
                        BatchNorm's design assumptions were fundamentally incompatible with the recurrent setting: it assumes a fixed batch of i.i.d. examples, whereas RNNs process variable-length sequences one at a time. This was a significant barrier to training competitive RNN language models.
                    </div>
                    <div className="ch-tl-impact">Context: BatchNorm revolutionized CNNs but could not be applied to RNNs or NLP — the most important application domain</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Solution</div>
                    <div className="ch-tl-title">Layer Normalization — Ba, Kiros, and Hinton</div>
                    <div className="ch-tl-body">
                        Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey Hinton published "Layer Normalization" in 2016. The fix required only one conceptual shift: instead of normalizing each feature across the batch dimension, normalize all features within each example. For a hidden state h ∈ ℝ<sup>H</sup>, compute mean and variance across the H features — completely independent of the batch.
                        <br /><br />
                        This works with batch size 1, arbitrary sequence lengths, and is identical at training and inference time — because it uses only the example's own features, not statistics from other examples. The paper demonstrated LayerNorm improved training stability and final performance for RNNs on machine translation, reading comprehension, and order-agnostic tasks. No running statistics need to be maintained; no training/inference discrepancy exists.
                        <br /><br />
                        The learnable parameters γ and β are now vectors of size H (one per feature dimension) rather than per-feature-per-neuron — keeping the parameter count manageable even for large hidden states.
                    </div>
                    <div className="ch-tl-impact">Impact: Made normalization viable for RNNs; later became the universal normalization standard for Transformers</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Transformer Era</div>
                    <div className="ch-tl-title">Post-LN Transformer — Vaswani et al.</div>
                    <div className="ch-tl-body">
                        "Attention Is All You Need" (Vaswani et al., 2017) used LayerNorm after each sub-layer (attention and FFN) in the original Post-LN formulation: x ← LayerNorm(x + Sublayer(x)). This Post-LN arrangement places LayerNorm after the residual connection, which was standard for the original Transformer used in machine translation.
                        <br /><br />
                        However, Post-LN Transformers trained with large learning rates were found to be unstable in early training — the residual pathway is unnormalized, and gradients flowing through the residual connection before hitting LayerNorm can be very large at initialization. This instability required careful learning rate warmup scheduling to avoid divergence in the first few thousand steps.
                    </div>
                    <div className="ch-tl-impact">Impact: LayerNorm became the standard for Transformers; Post-LN remains in widespread use but requires careful warmup</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018–2020</div>
                    <div className="ch-tl-section-label">Pre-LN Standard</div>
                    <div className="ch-tl-title">Pre-LN Transformer — GPT-2 and Beyond</div>
                    <div className="ch-tl-body">
                        GPT-2 (Radford et al., 2019) introduced the Pre-LN variant: x ← x + Sublayer(LayerNorm(x)). Placing LayerNorm before each sub-layer, inside the residual branch, preserves gradient flow through the residual connection unchanged. The residual pathway is always clean: at any depth, the gradient of the loss flows directly through residual connections without passing through any normalization.
                        <br /><br />
                        Pre-LN Transformers are more stable in early training, tolerate larger learning rates, and can be trained without warmup in some configurations. Every major LLM trained since 2019 — including GPT-3, LLaMA, Mistral, and Claude — uses Pre-LN or a close variant. Post-LN has largely been replaced for large-scale training.
                    </div>
                    <div className="ch-tl-impact">Impact: Pre-LN became the standard for LLMs; better gradient flow enables deeper, larger models without training instabilities</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">RMSNorm — Zhang and Sennrich</div>
                    <div className="ch-tl-body">
                        Biao Zhang and Rico Sennrich published "Root Mean Square Layer Normalization" in 2019, proposing a simplified variant that removes the mean subtraction step. Instead of centering activations (subtract mean) then scaling (divide by std), RMSNorm only scales: divide each activation by the root mean square of all activations in the layer.
                        <br /><br />
                        The motivation: mean subtraction in LayerNorm involves a redundant re-centering operation when followed by learnable parameters γ and β, since β can represent any shift. Empirically, removing mean subtraction has negligible impact on quality while reducing computation. LLaMA (Meta, 2023), Mistral, and many recent large language models use RMSNorm as a drop-in replacement for LayerNorm, achieving comparable performance with lower computational cost.
                    </div>
                    <div className="ch-tl-impact">Impact: RMSNorm used in LLaMA, Mistral, and recent LLMs; ~10% speedup over LayerNorm with no quality loss</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>RMSNorm:</strong> A simplified variant — Root Mean Square Layer Normalization (Zhang and Sennrich, 2019) — removes the mean subtraction: ŷ<sub>i</sub> = γ<sub>i</sub> · y<sub>i</sub> / RMS(y), RMS = √(1/H Σy<sub>i</sub>²). LLaMA and many modern LLMs use RMSNorm for its computational efficiency while matching LayerNorm performance.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Normalizing each example by itself</h2>

            <Analogy label="BatchNorm vs LayerNorm — Two Different Directions">
                Imagine a grid of numbers, where rows are different examples (sentences) and columns are different features (word meanings). BatchNorm normalizes each column — comparing all examples on the same feature. LayerNorm normalizes each row — comparing all features within the same example.
                <br /><br />
                BatchNorm says: "Make sure feature 7 has mean 0 across all 32 examples."
                LayerNorm says: "Make sure example 3's 512 features have mean 0."
                <br /><br />
                For NLP, the LayerNorm approach is better: each sentence can be processed independently, regardless of how many sentences are in the batch.
            </Analogy>

            <Analogy label="Why RNNs Need LayerNorm">
                In an RNN, we process sentences word by word. Each sentence has a different number of words. At step t, we're processing word t of the sentence.
                <br /><br />
                BatchNorm would need to compare word 5 of sentence 1 with word 5 of sentence 2 — but what if sentence 2 only has 3 words? And at test time, when we process one sentence at a time, there's no "batch" to compare against at all.
                <br /><br />
                LayerNorm fixes this: normalize the 512-dimensional hidden state of each word representation independently. Every word, every sentence, at training and inference — the normalization is always valid.
            </Analogy>

            <Analogy label="The Transformer Connection">
                Every Transformer — the architecture behind BERT, GPT, and Claude — uses LayerNorm. After each attention operation and after each feedforward network, the activations are LayerNorm-ed.
                <br /><br />
                Without LayerNorm, Transformers become unstable as they get deeper. With it, you can stack 96 layers (as in GPT-3) and still train reliably.
            </Analogy>

            <Analogy label="Pre-LN vs Post-LN — Where You Put the Normalization Matters">
                In the original 2017 Transformer, LayerNorm was placed after the attention and feedforward layers — at the end of each block. This is called Post-LN.
                <br /><br />
                Researchers discovered a problem: at the very start of training, with random weights, the gradients flowing through a deep Post-LN Transformer can be huge and unstable. It was like trying to steer a car by making tiny steering wheel adjustments, but the car is going 200 mph.
                <br /><br />
                Modern LLMs use Pre-LN: LayerNorm is placed at the start of each block, before the attention and feedforward layers. This keeps the residual connections clean and gradients stable throughout training — even at the first step.
            </Analogy>

            <Analogy label="RMSNorm — A Simpler Sibling">
                LayerNorm does two things: centers activations to mean 0 (subtracts the average), then scales them to have variance 1 (divides by the standard deviation). But there's a redundancy: since LayerNorm also has a learnable shift parameter β, the centering step is somewhat pointless — β can already shift things wherever needed.
                <br /><br />
                RMSNorm skips the centering step and just scales by the root-mean-square of the activations. It's simpler, slightly faster, and works just as well. LLaMA, one of the most widely used open-source language models, uses RMSNorm throughout.
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
                Crucially: μ and σ² are computed per-example, so the normalization is independent of batch size and works identically at training and inference time.
            </p>

            <h3>In the Transformer — Post-LN vs Pre-LN</h3>
            <p>
                "Attention Is All You Need" placed LayerNorm after each sub-layer (Post-LN):
            </p>
            <MathBlock tex="x \leftarrow \text{LayerNorm}(x + \text{Sublayer}(x))" />
            <p>
                Modern LLMs (GPT-2 onward) use Pre-LN — LayerNorm before each sub-layer — which provides better gradient flow at the start of training:
            </p>
            <MathBlock tex="x \leftarrow x + \text{Sublayer}(\text{LayerNorm}(x))" />

            <h3>RMSNorm (Zhang and Sennrich, 2019)</h3>
            <p>
                Simplified LayerNorm that omits the mean subtraction — normalize only by the root mean square:
            </p>
            <MathBlock tex="\text{RMS}(h) = \sqrt{\frac{1}{H}\sum_{i=1}^H h_i^2 + \varepsilon}" />
            <MathBlock tex="y_i = \frac{\gamma_i \cdot h_i}{\text{RMS}(h)}" />
            <p>
                RMSNorm has H fewer parameters (no β shift), is faster, and is used in LLaMA and many recent large language models.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>No running statistics needed:</strong> Unlike BatchNorm, LayerNorm computes statistics fresh for each example, at every step. There are no "running mean" or "running variance" buffers to maintain. This makes LayerNorm simpler to implement and eliminates the training/inference discrepancy that requires BatchNorm's separate inference path.
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
                The gradient is fully determined by the single example's statistics (μ, σ²), not the batch. This makes LayerNorm gradients independent across examples in the batch — no gradient coupling between different training examples.
            </p>

            <h3>RMSNorm — Simplified LayerNorm</h3>
            <p>
                Omit the mean subtraction; normalize only by the root mean square:
            </p>
            <MathBlock tex="\text{RMS}(h) = \sqrt{\frac{1}{H}\sum_{i=1}^H h_i^2 + \varepsilon}" />
            <MathBlock tex="y_i = \frac{\gamma_i \cdot h_i}{\text{RMS}(h)}" />
            <p>
                RMSNorm has H fewer parameters (no β shift), is faster to compute, and is used in LLaMA, Mistral, and many recent large language models. Empirically matches LayerNorm performance while being computationally cheaper.
            </p>

            <div className="ch-callout">
                <strong>Pre-LN vs Post-LN stability:</strong> Post-LN (original Transformer) places LayerNorm after residual connections: x + Sublayer(x) → LN(...). Pre-LN places it before: x + Sublayer(LN(x)). Pre-LN preserves the magnitude of residual connections through the network, preventing gradient vanishing in deep Transformers. Modern LLMs universally use Pre-LN or its variants.
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

def rms_norm(h, gamma, eps=1e-5):
    """RMSNorm: no mean subtraction, just scale by RMS."""
    rms = np.sqrt((h**2).mean(axis=-1, keepdims=True) + eps)
    return gamma * h / rms

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

# RMSNorm: each row scaled by RMS
Y_rms = rms_norm(X, gamma)

# BatchNorm: each column normalized over batch
mu_bn     = X.mean(axis=0)
sigma_bn  = X.std(axis=0)
Y_bn      = (X - mu_bn) / (sigma_bn + 1e-5)

print("=" * 60)
print("BatchNorm vs LayerNorm on 4 examples x 8 features")
print("=" * 60)
for i in range(batch_size):
    print(f"Input  example {i}:   mean={X[i].mean():>7.3f}  std={X[i].std():>6.3f}")
print()
for i in range(batch_size):
    print(f"LayerNorm example {i}: mean={Y_ln[i].mean():>7.3f}  std={Y_ln[i].std():>6.3f}  <- per row")
print()
for j in range(min(3, hidden_dim)):
    print(f"BatchNorm feature {j}: mean={Y_bn[:,j].mean():.3f}  <- per column")

# ── PyTorch Pre-LN Transformer block ──────────────────────────────────────────
print()
print("PyTorch Pre-LN Transformer block (modern standard):")
print("-" * 45)

class PreLNTransformerBlock(nn.Module):
    def __init__(self, d_model, nhead, dim_ff):
        super().__init__()
        self.attn  = nn.MultiheadAttention(d_model, nhead, batch_first=True)
        self.ff    = nn.Sequential(nn.Linear(d_model, dim_ff), nn.ReLU(),
                                   nn.Linear(dim_ff, d_model))
        self.norm1 = nn.LayerNorm(d_model)  # Pre-LN: before attention
        self.norm2 = nn.LayerNorm(d_model)  # Pre-LN: before FF

    def forward(self, x):
        # Pre-LN: normalize BEFORE each sub-layer
        normed = self.norm1(x)
        x = x + self.attn(normed, normed, normed)[0]
        x = x + self.ff(self.norm2(x))
        return x

block = PreLNTransformerBlock(d_model=512, nhead=8, dim_ff=2048)
x = torch.randn(2, 20, 512)  # batch=2, seq_len=20, d_model=512
y = block(x)
print(f"Input  shape: {x.shape}")
print(f"Output shape: {y.shape}")
print(f"LayerNorm params: {sum(p.numel() for p in block.norm1.parameters())}")
print(f"  gamma (scale): {block.norm1.weight.shape}")
print(f"  beta  (shift): {block.norm1.bias.shape}")

# ── RMSNorm comparison ─────────────────────────────────────────────────────────
print()
print("LayerNorm vs RMSNorm output comparison:")
h = np.random.randn(8) * 3 + 1.5
ln_out  = layer_norm(h, gamma, beta)
rms_out = rms_norm(h, gamma)
print(f"Input:    mean={h.mean():.4f}  std={h.std():.4f}")
print(f"LN out:   mean={ln_out.mean():.4f}  std={ln_out.std():.4f}")
print(f"RMS out:  mean={rms_out.mean():.4f}  std={rms_out.std():.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Manual NumPy implementation of LayerNorm and RMSNorm demonstrating the per-example normalization, contrasted with BatchNorm. Then a PyTorch Pre-LN Transformer block showing how LayerNorm is used in modern architectures.
            </p>
            <CodeBlock code={PY_CODE} filename="layernorm_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LAYER_NORMALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
