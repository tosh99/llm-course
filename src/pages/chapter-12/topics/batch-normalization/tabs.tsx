import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Taming internal covariate shift</h2>
            <p>
                Batch Normalization, introduced by Sergey Ioffe and Christian Szegedy at Google in 2015, is one of the most impactful engineering innovations in deep learning. A single normalization layer — applied between a linear transformation and its activation — reduced training time by an order of magnitude and enabled networks that were previously untrainable to converge reliably. The paper became one of the most cited in the history of machine learning.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Pre-2015</div>
                    <div className="ch-tl-section-label">The Problem</div>
                    <div className="ch-tl-title">Internal Covariate Shift</div>
                    <div className="ch-tl-body">
                        As parameters of earlier layers change during training, the distribution of inputs to later layers changes continuously. Each layer must constantly adapt to a shifting input distribution — a phenomenon Ioffe and Szegedy named "internal covariate shift." A layer that learned to handle inputs with mean 0.5 and variance 2.0 must re-learn its weights when those statistics shift to mean −1.2 and variance 5.0 after a few gradient steps.
                        <br /><br />
                        This forced practitioners to use very small learning rates (to keep each step's distributional shift small), careful initialization (Xavier/He to start with well-scaled activations), dropout, and saturating nonlinearities — all band-aids for a deeper problem. The fundamental challenge was that each layer's learning problem was moving even as the layer tried to learn it.
                        <br /><br />
                        Deep networks (10+ layers) were especially vulnerable: covariate shift compounds multiplicatively through layers, making the later layers' learning problems increasingly unstable. This was a major barrier to training very deep networks before BatchNorm.
                    </div>
                    <div className="ch-tl-impact">Context: Deep nets required huge tuning effort; training was brittle and slow; limited practical depth to ~5-8 layers</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Batch Normalization — Ioffe and Szegedy (ICML 2015)</div>
                    <div className="ch-tl-body">
                        Sergey Ioffe and Christian Szegedy's paper "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift" proposed a strikingly simple fix: normalize each layer's activations to zero mean and unit variance within each mini-batch, then apply learnable scale (γ) and shift (β) parameters. This stabilizes the distribution of each layer's inputs throughout training.
                        <br /><br />
                        The results were dramatic. On ImageNet, BN allowed training with 14× fewer steps while matching the previous best accuracy — a speedup no other technique had achieved. It enabled the use of learning rates 10× higher than usual, because normalized activations prevented exploding gradient signals. BN also provided a regularization effect comparable to dropout, allowing many practitioners to eliminate dropout entirely when using BN.
                        <br /><br />
                        The learnable scale (γ) and shift (β) parameters are crucial: they allow the network to learn the optimal post-normalization distribution for each layer. If the identity transform (γ=σ, β=μ) is optimal for a particular layer, the network can learn that too — BatchNorm never forces a specific output distribution, it just normalizes and then lets the network adjust.
                    </div>
                    <div className="ch-tl-impact">Impact: 14× speedup on ImageNet; 10× higher learning rates; universal in CNNs; enabled ResNet and all major architectures 2015–2019</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015–2020</div>
                    <div className="ch-tl-section-label">Dominance</div>
                    <div className="ch-tl-title">BatchNorm in Every Major CNN</div>
                    <div className="ch-tl-body">
                        ResNet (He et al., 2015) — the network that won ILSVRC 2015 with 152 layers — would not have been trainable without BatchNorm. DenseNet, EfficientNet, MobileNet, and virtually every competitive image classification architecture used BatchNorm after 2015. It became so fundamental that some researchers described it as a structural component of modern CNNs — not a regularizer or trick, but a necessary layer type alongside linear and convolutional layers.
                        <br /><br />
                        In convolutional networks, BatchNorm is applied per-channel: for an activation map of shape (batch, channels, height, width), normalization statistics are computed over (batch, height, width) for each channel independently. This means a convolutional layer with 64 output channels has 128 learnable BN parameters (64 γs and 64 βs) — a tiny addition compared to the filter weights.
                    </div>
                    <div className="ch-tl-impact">Impact: Standard component of CNN architectures; ResNet's 152-layer victory at ILSVRC 2015 demonstrated its enabling role</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Why Does It Actually Work?</div>
                    <div className="ch-tl-title">Landscape Smoothing — Santurkar et al.</div>
                    <div className="ch-tl-body">
                        Shibani Santurkar, Dimitris Tsipras, Andrew Ilyas, and Aleksander Madry published "How Does Batch Normalization Help Optimization?" at NeurIPS 2018 — challenging the "internal covariate shift" explanation. Their experiments showed that BatchNorm still helps even when artificial noise is added to recreate ICS, and that the distribution shift reduction is not strongly correlated with training speed.
                        <br /><br />
                        Their alternative explanation: BatchNorm smooths the loss landscape, making gradients more predictable and allowing larger learning rates. Specifically, the Lipschitz constant of the loss and the β-smoothness of gradients are both reduced by a factor proportional to γ/σ<sub>B</sub> — the ratio of the learned scale to the batch standard deviation. Smoother landscape means stable gradient directions, which means larger steps are safe.
                    </div>
                    <div className="ch-tl-impact">Impact: Revealed BatchNorm's benefit may be landscape smoothing rather than ICS reduction; sparked ongoing debate about the true mechanism</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016–2018</div>
                    <div className="ch-tl-section-label">Variants</div>
                    <div className="ch-tl-title">Group Norm, Instance Norm, and Ghost BatchNorm</div>
                    <div className="ch-tl-body">
                        BatchNorm's dependence on batch statistics created practical limitations. For detection and segmentation tasks, small batches (1–4 images) due to high resolution caused unreliable statistics — leading to Group Normalization (Wu and He, 2018), which normalizes over groups of channels within a single example and works identically across all batch sizes.
                        <br /><br />
                        Ghost BatchNorm (Hoffer et al., 2017) addressed large-batch training: when using very large batches (1024+ examples for distributed training), BN statistics become too stable and lose their implicit regularization effect. Ghost BN artificially divides the large batch into smaller "ghost" batches for statistics computation, preserving BN's regularization while still parallelizing gradient computation.
                    </div>
                    <div className="ch-tl-impact">Impact: Group Norm enabled small-batch training for detection; Ghost BN enabled large-batch training; both are used in modern pipelines</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The NLP problem:</strong> BatchNorm normalizes over the batch dimension. For NLP sequences, batch size 1 is common at inference, and sequences vary in length — making batch statistics unreliable. This limitation directly motivated Layer Normalization (Ba et al., 2016), which became the standard for Transformers.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Keeping activations in a comfortable range</h2>

            <Analogy label="The Shifting Goalposts Problem">
                Imagine you're learning to catch balls. On day 1, balls come from 1 meter away. On day 2, someone moved the throwing machine — now balls come from 10 meters. On day 3, it's back to 3 meters. Every day you have to completely re-learn where to stand.
                <br /><br />
                That's internal covariate shift. Each layer in a neural network has to learn to handle its inputs — but as earlier layers change, the distribution of those inputs keeps shifting. The network has to keep re-learning.
            </Analogy>

            <Analogy label="BatchNorm: Fix the Distribution">
                Batch Normalization solves this by saying: no matter what the inputs look like, we'll normalize them to have mean 0 and standard deviation 1 before they go into the next layer.
                <br /><br />
                It's like having a magical machine that always re-centers the balls to come from exactly 5 meters, no matter where the throwing machine is. The catcher never has to relearn — the distribution is always the same.
                <br /><br />
                Then it adds back two learnable parameters — scale (γ) and shift (β) — so the network can still choose a different range if that's what the task needs.
            </Analogy>

            <Analogy label="Why It Speeds Training 10×">
                Without BatchNorm, you need a tiny learning rate — if you take too big a step, the activations might explode or vanish, and everything breaks.
                <br /><br />
                With BatchNorm, activations are always normalized. You can take much bigger steps because there's a safety net ensuring nothing goes too far. That's why training is 10× faster — you can learn much faster at each step.
            </Analogy>

            <Analogy label="Training vs Inference — Two Modes">
                During training, BatchNorm uses the statistics from the current mini-batch — the mean and variance of the 32 (or 64, or 128) examples being processed right now. This gives fresh, accurate estimates at every step.
                <br /><br />
                But at test time, you often process one image at a time. You can't compute a "batch" mean from a single example. So during training, BatchNorm quietly keeps a running average of all the batch statistics it has seen. At test time, it uses these stored averages instead — essentially asking "what was the typical mean and variance during training?"
                <br /><br />
                This means BatchNorm has two different behaviors depending on whether the model is in training mode or evaluation mode — a subtle but important distinction that catches many beginners off guard.
            </Analogy>

            <Analogy label="Why CNNs Love BatchNorm">
                In a convolutional network, each layer produces a feature map — a grid of numbers for each filter. BatchNorm for CNNs normalizes each filter's output across the whole batch and all spatial positions. The "batch" for each filter might be 32 images × 56×56 = 100,352 values — a very stable estimate of the mean and variance.
                <br /><br />
                This is why BatchNorm works so well for image tasks: the statistics are computed over thousands of values, giving reliable estimates that stabilize the entire training process.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Normalize, scale, shift — then undo at test time</h2>

            <h3>Training: Normalize Over the Mini-Batch</h3>
            <p>
                Given a mini-batch of m examples with activations x₁, ..., x<sub>m</sub> (for a single neuron — repeat independently per neuron):
            </p>
            <MathBlock tex="\mu_B = \frac{1}{m}\sum_{i=1}^{m} x_i \qquad \sigma^2_B = \frac{1}{m}\sum_{i=1}^{m}(x_i - \mu_B)^2" />
            <p>Normalize to zero mean and unit variance:</p>
            <MathBlock tex="\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma^2_B + \varepsilon}}" />
            <p>
                Apply learnable scale γ and shift β (initialized to γ=1, β=0):
            </p>
            <MathBlock tex="y_i = \gamma \hat{x}_i + \beta" />
            <p>
                γ and β are trained by backpropagation alongside all other parameters. They allow BatchNorm to represent the identity transform (γ=σ, β=μ) if needed.
            </p>

            <h3>Test Time: Use Running Statistics</h3>
            <p>
                At test time, there may be only one example (batch size = 1). We can't compute batch statistics from a single example. Solution: during training, maintain exponential moving averages:
            </p>
            <MathBlock tex="\mu_{\text{run}} \leftarrow 0.9 \cdot \mu_{\text{run}} + 0.1 \cdot \mu_B" />
            <MathBlock tex="\sigma^2_{\text{run}} \leftarrow 0.9 \cdot \sigma^2_{\text{run}} + 0.1 \cdot \sigma^2_B" />
            <p>At test time:</p>
            <MathBlock tex="y = \gamma \cdot \frac{x - \mu_{\text{run}}}{\sqrt{\sigma^2_{\text{run}} + \varepsilon}} + \beta" />

            <h3>Where to Place BatchNorm?</h3>
            <ul>
                <li><strong>Original paper</strong>: before the activation — Linear → BN → ReLU</li>
                <li><strong>Pre-activation ResNet</strong>: before linear layer — BN → Linear → ReLU</li>
                <li>For CNNs: normalize over (batch, H, W) for each channel independently</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Why not just normalize inputs once?</strong> You could normalize the raw input data — and that's always recommended. But as the network applies layers of nonlinear transformations, the distributions of intermediate activations drift away from well-behaved distributions. BatchNorm normalizes at <em>each layer</em>, ensuring all layers always receive well-conditioned inputs.
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
            <h2>Gradients through BatchNorm, landscape smoothing, and variants</h2>

            <DefBlock label="Batch Normalization (Ioffe and Szegedy, 2015)">
                For mini-batch B = &#123; x₁, ..., x<sub>m</sub> &#125; and learnable parameters γ, β:
                <br /><br />
                μ<sub>B</sub> = (1/m)Σx<sub>i</sub>
                <br />
                σ²<sub>B</sub> = (1/m)Σ(x<sub>i</sub> − μ<sub>B</sub>)²
                <br />
                x̂<sub>i</sub> = (x<sub>i</sub> − μ<sub>B</sub>) / √(σ²<sub>B</sub> + ε)
                <br />
                y<sub>i</sub> = γ x̂<sub>i</sub> + β
            </DefBlock>

            <h3>Gradients Through BatchNorm (Chain Rule)</h3>
            <p>
                The normalized output x̂<sub>i</sub> depends on all inputs in the batch through μ<sub>B</sub> and σ²<sub>B</sub>. The gradient is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{m\sigma_B} \left[ m \frac{\partial \mathcal{L}}{\partial y_i} - \sum_j \frac{\partial \mathcal{L}}{\partial y_j} - \hat{x}_i \sum_j \frac{\partial \mathcal{L}}{\partial y_j} \hat{x}_j \right]" />
            <p>
                Key property: the gradient w.r.t. x<sub>i</sub> depends on the gradients from all other examples in the batch. This introduces a form of batch-level regularization — each example's gradient is modified by its peers.
            </p>

            <h3>Gradients w.r.t. Learnable Parameters</h3>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \gamma} = \sum_{i=1}^{m} \frac{\partial \mathcal{L}}{\partial y_i} \hat{x}_i \qquad \frac{\partial \mathcal{L}}{\partial \beta} = \sum_{i=1}^{m} \frac{\partial \mathcal{L}}{\partial y_i}" />

            <h3>Landscape Smoothing (Santurkar et al., 2018)</h3>
            <p>
                The gradient of the loss at a point θ is Lipschitz with constant proportional to the spectral norm of the weight matrix times the activation magnitude. By keeping activations normalized:
            </p>
            <MathBlock tex="\|\nabla_\theta \mathcal{L}_{\text{BN}}\| \leq \frac{\gamma}{\sigma_B} \|\nabla_\theta \mathcal{L}\|" />
            <p>
                The effective gradient magnitude is reduced by a factor of γ/σ<sub>B</sub>. If σ<sub>B</sub> is large (activations varied across the batch), the gradient is scaled down — preventing large unstable updates.
            </p>

            <h3>Normalization Variants</h3>
            <MathBlock tex="\begin{array}{lll} \textbf{Method} & \textbf{Normalize over} & \textbf{Best for} \\ \hline \text{BatchNorm} & \text{batch } B \text{ per feature} & \text{CNNs, large batch} \\ \text{LayerNorm} & \text{features per example} & \text{Transformers, RNNs} \\ \text{GroupNorm} & \text{groups of channels} & \text{Small batch CNNs} \\ \text{InstanceNorm} & \text{spatial per example} & \text{Style transfer} \\ \end{array}" />

            <div className="ch-callout">
                <strong>The γ, β necessity:</strong> Without the learnable scale and shift, BatchNorm would force every layer to output zero-mean unit-variance activations. But some layers may need different distributions — e.g., a sigmoid needs inputs near 0, but a ReLU layer downstream may prefer activations with a positive mean. γ and β allow the network to learn the optimal post-normalization distribution, making the identity transform possible if that's optimal.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── Manual BatchNorm (NumPy) ───────────────────────────────────────────────────

class BatchNorm1D:
    """Manual BatchNorm for 1D features (batch_size, features)."""

    def __init__(self, num_features, eps=1e-5, momentum=0.1):
        self.eps      = eps
        self.momentum = momentum
        self.gamma    = np.ones(num_features)   # learnable scale
        self.beta     = np.zeros(num_features)  # learnable shift
        self.running_mean = np.zeros(num_features)
        self.running_var  = np.ones(num_features)
        self.training = True

    def forward(self, x):
        """x: (batch_size, num_features)"""
        if self.training:
            mu    = x.mean(axis=0)                         # (num_features,)
            sigma2 = ((x - mu)**2).mean(axis=0)           # (num_features,)

            # Update running statistics (used at test time)
            self.running_mean = (1 - self.momentum) * self.running_mean + self.momentum * mu
            self.running_var  = (1 - self.momentum) * self.running_var  + self.momentum * sigma2
        else:
            mu    = self.running_mean
            sigma2 = self.running_var

        x_hat = (x - mu) / np.sqrt(sigma2 + self.eps)     # normalize
        return self.gamma * x_hat + self.beta              # scale + shift

# ── Demonstrate: normalizing effect ───────────────────────────────────────────
np.random.seed(42)
batch_size, features = 32, 8

# Badly scaled input (mean=5, std=3)
x_raw = np.random.randn(batch_size, features) * 3 + 5

bn = BatchNorm1D(features)
x_norm = bn.forward(x_raw)

print("=" * 60)
print("BatchNorm: Before vs After Normalization")
print("=" * 60)
print(f"Input  — mean: {x_raw.mean(axis=0)[:3].round(3)}, std: {x_raw.std(axis=0)[:3].round(3)}")
print(f"Output — mean: {x_norm.mean(axis=0)[:3].round(3)}, std: {x_norm.std(axis=0)[:3].round(3)}")
print()

# ── PyTorch BatchNorm2D for CNNs ───────────────────────────────────────────────
print("PyTorch BatchNorm2d in a simple CNN block:")
print("-" * 45)

class ConvBNReLU(nn.Module):
    def __init__(self, in_c, out_c, kernel=3, padding=1):
        super().__init__()
        self.conv = nn.Conv2d(in_c, out_c, kernel, padding=padding, bias=False)
        self.bn   = nn.BatchNorm2d(out_c)  # normalize over (batch, H, W) per channel
        self.relu = nn.ReLU()

    def forward(self, x):
        return self.relu(self.bn(self.conv(x)))

block = ConvBNReLU(3, 32)
x_img = torch.randn(8, 3, 64, 64)  # batch=8, RGB, 64x64

# Training mode: uses batch statistics
block.train()
y_train = block(x_img)
print(f"Training mode output: {y_train.shape}")
print(f"  BN running_mean[:3]: {block.bn.running_mean[:3].detach().numpy().round(4)}")

# Eval mode: uses running statistics
block.eval()
y_eval = block(x_img)
print(f"Eval mode output:     {y_eval.shape}")
print()

# ── Training speedup intuition ─────────────────────────────────────────────────
print("Effect of BatchNorm on gradient scale (Santurkar et al.):")
print("  Effective gradient = (gamma/sigma_B) * raw_gradient")
for sigma in [0.1, 0.5, 1.0, 5.0, 10.0]:
    scale = 1.0 / sigma  # gamma=1 case
    print(f"  sigma_B={sigma:5.1f}: scale factor = {scale:.3f} (larger sigma -> smaller grad)")

print()
print("Large sigma means varied activations -> smaller effective gradient")
print("-> more stable updates -> safe to use 10x higher LR!")
`

function PythonContent() {
    return (
        <>
            <p>
                Manual NumPy BatchNorm implementation showing the training/inference modes, running statistics update, and gradient scale effect. Followed by a PyTorch ConvBN-ReLU block demonstrating how BatchNorm is used in practice within CNNs.
            </p>
            <CodeBlock code={PY_CODE} filename="batchnorm_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BATCH_NORMALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
