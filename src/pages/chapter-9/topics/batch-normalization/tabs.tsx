import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Taming internal covariate shift</h2>
            <p>
                Batch Normalization, introduced by Sergey Ioffe and Christian Szegedy at Google
                in 2015, is one of the most impactful engineering innovations in deep learning.
                A single normalization layer — applied between a linear transformation and its
                activation — reduced training time by an order of magnitude and enabled networks
                that were previously untrainable to converge reliably.
            </p>

            <div className="ch9-timeline">
                <div className="ch9-tl-item">
                    <div className="ch9-tl-year">Pre-2015</div>
                    <div className="ch9-tl-section-label">The Problem</div>
                    <div className="ch9-tl-title">Internal Covariate Shift</div>
                    <div className="ch9-tl-body">
                        As parameters of earlier layers change during training, the distribution of
                        inputs to later layers changes continuously. Each layer must constantly
                        adapt to a shifting input distribution — a phenomenon Ioffe and Szegedy
                        named "internal covariate shift." This forced practitioners to use very
                        small learning rates, careful initialization (Xavier/He), dropout, and
                        saturating nonlinearities — all band-aids for a deeper problem.
                    </div>
                    <div className="ch9-tl-impact">Context: Deep nets required huge tuning effort; training was brittle and slow</div>
                </div>

                <div className="ch9-tl-item">
                    <div className="ch9-tl-year">2015</div>
                    <div className="ch9-tl-section-label">Breakthrough</div>
                    <div className="ch9-tl-title">Batch Normalization — Ioffe & Szegedy (ICML 2015)</div>
                    <div className="ch9-tl-body">
                        The key insight: normalize each layer's activations to zero mean and unit
                        variance <em>within each mini-batch</em>, then apply learnable scale (γ) and
                        shift (β) parameters. This keeps the distribution of activations stable
                        throughout training. The results were dramatic: 14× speedup on ImageNet
                        training, ability to use 10× higher learning rates, and the ability to
                        match Dropout's regularization effect without dropout.
                    </div>
                    <div className="ch9-tl-impact">Impact: 10× faster training; became universal in CNNs; enabled VGGNet, ResNet, Inception</div>
                </div>

                <div className="ch9-tl-item">
                    <div className="ch9-tl-year">2015–2020</div>
                    <div className="ch9-tl-section-label">Dominance</div>
                    <div className="ch9-tl-title">BatchNorm in every major CNN</div>
                    <div className="ch9-tl-body">
                        ResNet (He et al., 2015), DenseNet, EfficientNet, and virtually every
                        competitive image classification architecture used BatchNorm after 2015.
                        It became so fundamental that some researchers described it as a structural
                        component of modern CNNs — not a regularizer or trick, but a necessary
                        layer type alongside linear and convolutional layers.
                    </div>
                    <div className="ch9-tl-impact">Impact: Standard component of CNN architectures; won 2015 ILSVRC with ResNet</div>
                </div>

                <div className="ch9-tl-item">
                    <div className="ch9-tl-year">2016–2018</div>
                    <div className="ch9-tl-section-label">Debate & Understanding</div>
                    <div className="ch9-tl-title">Why does BatchNorm actually work?</div>
                    <div className="ch9-tl-body">
                        Santurkar et al. (2018) challenged the "internal covariate shift" explanation
                        with experiments showing BatchNorm still helps even when artificial noise is
                        added to induces ICS. Their alternative: BatchNorm smooths the loss landscape,
                        making gradients more predictable and allowing larger learning rates. The
                        debate remains partly open — BatchNorm likely works for multiple reasons
                        simultaneously.
                    </div>
                    <div className="ch9-tl-impact">Impact: Revealed BatchNorm's benefit may be landscape smoothing, not ICS reduction</div>
                </div>
            </div>

            <div className="ch9-callout">
                <strong>The NLP problem:</strong> BatchNorm normalizes over the batch dimension.
                For NLP sequences, batch size 1 is common at inference, and sequences vary in
                length — making batch statistics unreliable. This limitation directly motivated
                Layer Normalization (Ba et al., 2016), which became the standard for Transformers.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Keeping activations in a comfortable range</h2>

            <Analogy label="The Shifting Goalposts Problem">
                Imagine you're learning to catch balls. On day 1, balls come from 1 meter away.
                On day 2, someone moved the throwing machine — now balls come from 10 meters.
                On day 3, it's back to 3 meters. Every day you have to completely re-learn
                where to stand.
                <br /><br />
                That's internal covariate shift. Each layer in a neural network has to learn
                to handle its inputs — but as earlier layers change, the distribution of those
                inputs keeps shifting. The network has to keep re-learning.
            </Analogy>

            <Analogy label="BatchNorm: Fix the Distribution">
                Batch Normalization solves this by saying: no matter what the inputs look like,
                we'll normalize them to have mean 0 and standard deviation 1 before they go
                into the next layer.
                <br /><br />
                It's like having a magical machine that always re-centers the balls to come from
                exactly 5 meters, no matter where the throwing machine is. The catcher never
                has to relearn — the distribution is always the same.
                <br /><br />
                Then it adds back two learnable parameters — scale (γ) and shift (β) — so
                the network can still choose a different range if that's what the task needs.
            </Analogy>

            <Analogy label="Why It Speeds Training 10×">
                Without BatchNorm, you need a tiny learning rate — if you take too big a step,
                the activations might explode or vanish, and everything breaks.
                <br /><br />
                With BatchNorm, activations are always normalized. You can take much bigger
                steps because there's a safety net ensuring nothing goes too far. That's why
                training is 10× faster — you can learn much faster at each step.
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
                Given a mini-batch of m examples with activations x₁, ..., x<sub>m</sub>
                (for a single neuron — repeat independently per neuron):
            </p>
            <MathBlock tex="\mu_B = \frac{1}{m}\sum_{i=1}^{m} x_i \qquad \sigma^2_B = \frac{1}{m}\sum_{i=1}^{m}(x_i - \mu_B)^2" />
            <p>Normalize to zero mean and unit variance:</p>
            <MathBlock tex="\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma^2_B + \varepsilon}}" />
            <p>
                Apply learnable scale γ and shift β (initialized to γ=1, β=0):
            </p>
            <MathBlock tex="y_i = \gamma \hat{x}_i + \beta" />
            <p>
                γ and β are trained by backpropagation alongside all other parameters.
                They allow BatchNorm to represent the identity transform (γ=σ, β=μ) if needed.
            </p>

            <h3>Test Time: Use Running Statistics</h3>
            <p>
                At test time, there may be only one example (batch size = 1). We can't compute
                batch statistics from a single example. Solution: during training, maintain
                exponential moving averages:
            </p>
            <MathBlock tex="\mu_{\text{run}} \leftarrow 0.9 \cdot \mu_{\text{run}} + 0.1 \cdot \mu_B" />
            <MathBlock tex="\sigma^2_{\text{run}} \leftarrow 0.9 \cdot \sigma^2_{\text{run}} + 0.1 \cdot \sigma^2_B" />
            <p>At test time:</p>
            <MathBlock tex="y = \gamma \cdot \frac{x - \mu_{\text{run}}}{\sqrt{\sigma^2_{\text{run}} + \varepsilon}} + \beta" />

            <h3>Where to Place BatchNorm?</h3>
            <ul>
                <li><strong>Original paper</strong>: before the activation — BN → ReLU</li>
                <li><strong>Pre-activation ResNet</strong>: before linear layer — BN → Linear → ReLU</li>
                <li>For CNNs: normalize over (batch, H, W) for each channel independently</li>
            </ul>

            <hr className="ch9-sep" />

            <div className="ch9-callout">
                <strong>Why not just normalize inputs once?</strong> You could normalize the raw
                input data — and that's always recommended. But as the network applies layers
                of nonlinear transformations, the distributions of intermediate activations drift
                away from well-behaved distributions. BatchNorm normalizes at <em>each layer</em>,
                ensuring all layers always receive well-conditioned inputs.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Gradients through BatchNorm, landscape smoothing, and variants</h2>

            <DefBlock label="Batch Normalization (Ioffe & Szegedy, 2015)">
                For mini-batch B = {'{'} x₁, ..., x<sub>m</sub> {'}'} and learnable parameters γ, β:
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
                The normalized output x̂<sub>i</sub> depends on all inputs in the batch through
                μ<sub>B</sub> and σ²<sub>B</sub>. The gradient is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{m\sigma_B} \left[ m \frac{\partial \mathcal{L}}{\partial y_i} - \sum_j \frac{\partial \mathcal{L}}{\partial y_j} - \hat{x}_i \sum_j \frac{\partial \mathcal{L}}{\partial y_j} \hat{x}_j \right]" />
            <p>
                Key property: the gradient w.r.t. x<sub>i</sub> depends on the gradients from
                all other examples in the batch. This introduces a form of batch-level
                regularization — each example's gradient is modified by its peers.
            </p>

            <h3>Gradients w.r.t. Learnable Parameters</h3>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \gamma} = \sum_{i=1}^{m} \frac{\partial \mathcal{L}}{\partial y_i} \hat{x}_i \qquad \frac{\partial \mathcal{L}}{\partial \beta} = \sum_{i=1}^{m} \frac{\partial \mathcal{L}}{\partial y_i}" />

            <h3>Landscape Smoothing (Santurkar et al., 2018)</h3>
            <p>
                The gradient of the loss at a point θ is Lipschitz with constant proportional
                to the spectral norm of the weight matrix times the activation magnitude. By
                keeping activations normalized:
            </p>
            <MathBlock tex="\|\nabla_\theta \mathcal{L}_{\text{BN}}\| \leq \frac{\gamma}{\sigma_B} \|\nabla_\theta \mathcal{L}\|" />
            <p>
                The effective gradient magnitude is reduced by a factor of γ/σ<sub>B</sub>.
                If σ<sub>B</sub> is large (activations varied across the batch), the gradient
                is scaled down — preventing large unstable updates.
            </p>

            <h3>Normalization Variants</h3>
            <MathBlock tex="\begin{array}{lll} \textbf{Method} & \textbf{Normalize over} & \textbf{Best for} \\ \hline \text{BatchNorm} & \text{batch } B \text{ per feature} & \text{CNNs, large batch} \\ \text{LayerNorm} & \text{features per example} & \text{Transformers, RNNs} \\ \text{GroupNorm} & \text{groups of channels} & \text{Small batch CNNs} \\ \text{InstanceNorm} & \text{spatial per example} & \text{Style transfer} \\ \end{array}" />

            <div className="ch9-callout">
                <strong>The γ, β necessity:</strong> Without the learnable scale and shift,
                BatchNorm would force every layer to output zero-mean unit-variance activations.
                But some layers may need different distributions — e.g., a sigmoid needs
                inputs near 0, but a ReLU layer downstream may prefer activations with a
                positive mean. γ and β allow the network to learn the optimal post-normalization
                distribution, making the identity transform possible if that's optimal.
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
x_img = torch.randn(8, 3, 224, 224)  # batch=8, RGB, 224×224

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
print("Effect of BatchNorm on gradient scale:")
print("With BN: effective gradient = gamma/sigma * raw_gradient")
for sigma in [0.1, 0.5, 1.0, 5.0, 10.0]:
    scale = 1.0 / sigma  # gamma=1 case
    print(f"  sigma_B={sigma:5.1f}: scale factor = {scale:.3f}")

print()
print("Large sigma → smaller gradient → more stable updates")
print("This is why BatchNorm allows 10× higher learning rates!")
`

function PythonTab() {
    return (
        <>
            <p>
                Manual NumPy BatchNorm implementation showing the training/inference modes,
                running statistics update, and gradient scale effect. Followed by a PyTorch
                ConvBN-ReLU block demonstrating how BatchNorm is used in practice within CNNs.
            </p>
            <CodeBlock code={PY_CODE} filename="batchnorm_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── BatchNorm 1D — TypeScript ────────────────────────────────────────────────

type Vec = number[]
type Mat = number[][]  // [batch, features]

function colMean(X: Mat): Vec {
  const [m, n] = [X.length, X[0].length]
  return Array.from({ length: n }, (_, j) =>
    X.reduce((s, row) => s + row[j], 0) / m
  )
}

function colVar(X: Mat, mean: Vec): Vec {
  const [m, n] = [X.length, X[0].length]
  return Array.from({ length: n }, (_, j) =>
    X.reduce((s, row) => s + (row[j] - mean[j]) ** 2, 0) / m
  )
}

// ── BatchNorm state ───────────────────────────────────────────────────────────
interface BNState {
  gamma:       Vec  // learnable scale (init 1)
  beta:        Vec  // learnable shift (init 0)
  runningMean: Vec  // for inference
  runningVar:  Vec  // for inference
}

function createBN(features: number): BNState {
  return {
    gamma:       new Array(features).fill(1),
    beta:        new Array(features).fill(0),
    runningMean: new Array(features).fill(0),
    runningVar:  new Array(features).fill(1),
  }
}

// ── Forward pass (training mode) ──────────────────────────────────────────────
function batchNormTrain(
  X: Mat,
  state: BNState,
  eps = 1e-5,
  momentum = 0.1
): { Y: Mat; mean: Vec; variance: Vec; xHat: Mat } {
  const mean     = colMean(X)
  const variance = colVar(X, mean)

  // Update running statistics
  state.runningMean = state.runningMean.map((m, i) =>
    (1 - momentum) * m + momentum * mean[i]
  )
  state.runningVar = state.runningVar.map((v, i) =>
    (1 - momentum) * v + momentum * variance[i]
  )

  // Normalize
  const xHat: Mat = X.map(row =>
    row.map((x, j) => (x - mean[j]) / Math.sqrt(variance[j] + eps))
  )

  // Scale and shift
  const Y: Mat = xHat.map(row =>
    row.map((xh, j) => state.gamma[j] * xh + state.beta[j])
  )

  return { Y, mean, variance, xHat }
}

// ── Inference mode: use running stats ─────────────────────────────────────────
function batchNormInfer(x: Vec, state: BNState, eps = 1e-5): Vec {
  return x.map((xi, j) => {
    const xHat = (xi - state.runningMean[j]) / Math.sqrt(state.runningVar[j] + eps)
    return state.gamma[j] * xHat + state.beta[j]
  })
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const features = 4
const bn = createBN(features)

// Simulate badly-scaled batch (mean≈5, std≈3)
const X: Mat = Array.from({ length: 16 }, () =>
  Array.from({ length: features }, () => Math.random() * 6 + 2)
)

const { Y, mean, variance } = batchNormTrain(X, bn)

console.log("BatchNorm 1D Demo")
console.log("─".repeat(40))
console.log("Input  mean:", mean.map(v => v.toFixed(3)))
console.log("Input  var: ", variance.map(v => v.toFixed(3)))

const outMean = colMean(Y)
const outVar  = colVar(Y, outMean)
console.log("Output mean:", outMean.map(v => v.toFixed(3)))
console.log("Output var: ", outVar.map(v => v.toFixed(3)))
console.log()
console.log("After BN: mean≈0, var≈1 (plus gamma/beta correction)")
console.log("Running mean (for inference):", bn.runningMean.map(v => v.toFixed(4)))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of BatchNorm 1D with full training and inference modes.
                Shows the running statistics update and demonstrates how arbitrary input distributions
                are normalized to mean ≈ 0, variance ≈ 1.
            </p>
            <CodeBlock code={TS_CODE} filename="batchnorm.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const BATCH_NORMALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
