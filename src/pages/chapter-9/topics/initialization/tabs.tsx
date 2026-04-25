import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The context</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2010",
            title: "Xavier Initialization—Glorot & Bengio",
            challenge:
                "Deep networks failed to train because of poor weight initialization. Small random values led to vanishing gradients; large values led to exploding gradients and saturation.",
            what:
                "Xavier Glorot and Yoshua Bengio proposed 'Understanding the difficulty of training deep feedforward neural networks,' introducing a principled initialization based on preserving variance through layers. Weights should be drawn from a distribution with variance inversely proportional to the average of input and output dimensions.",
            impact:
                "Xavier initialization became the default for sigmoid and tanh networks. Training became more stable, and deeper networks (8+ layers) became trainable without pre-training.",
        },
        {
            year: "2015",
            title: "He Initialization—Kaiming He et al.",
            challenge:
                "As ReLU became the dominant activation, Xavier initialization turned out to be suboptimal. ReLU zeros out half the inputs, so variance wasn't preserved properly.",
            what:
                "Kaiming He et al. (Microsoft Research) proposed He initialization in 'Delving Deep into Rectifiers.' Specifically designed for ReLU activations, the variance should be 2/n_in rather than 1/n_avg, accounting for ReLU's sparsity.",
            impact:
                "He initialization enabled training of very deep networks (ResNet-152, DenseNet). Modern deep learning frameworks use He initialization as the default for convolutional layers with ReLU.",
        },
        {
            year: "2015–2018",
            title: "Modern Initialization Practices",
            challenge:
                "As architectures became more varied (ResNets with skip connections, attention mechanisms), initialization strategies needed adaptation.",
            what:
                "Researchers developed initialization schemes for specific cases: orthogonal initialization for RNNs, LSUV (Layer-Sequential Unit Variance) for automatic tuning, and scaling factors for residual branches.",
            impact:
                "Proper initialization is now taken for granted in deep learning. It enables training networks with hundreds of layers (ResNet, DenseNet, Transformer) without the instability that plagued early deep networks.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why does weight initialization matter?</h2>

            <Analogy label="The Balance Beam">
                Imagine walking on a balance beam. Start too far to one side, and you fall off immediately. Start in the middle, and you can adjust as you walk.
                <br /><br />
                Neural networks are similar. Bad initialization is like starting skewed—gradients explode (become huge) or vanish (become tiny), and the network can't learn.
            </Analogy>

            <Analogy label="The Telephone Game">
                In a game of telephone, a message passed through many people gets distorted. Some people whisper (vanishing), others shout (exploding).
                <br /><br />
                Good initialization ensures everyone speaks at the right volume—the signal passes clearly through all layers.
            </Analogy>

            <Analogy label="Lighting a Candle">
                Xavier and He initialization are like carefully adjusting the wick before lighting. Get it wrong, and the flame sputters out (vanishing) or explodes.
                Get it right, and the flame burns steadily through the entire network.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Weight Initialization: Starting on the right foot</h2>

            <h3>The problem: exploding and vanishing gradients</h3>
            <p>
                When you have a deep network with many layers, small initialization differences compound.
                If weights are slightly too large, activations grow exponentially (exploding).
                If slightly too small, activations shrink to near zero (vanishing).
                Both make learning impossible.
            </p>

            <h3>Variance preservation</h3>
            <p>
                The key insight: we want the variance of activations to stay roughly constant across layers.
                If input to layer l has variance σ², output should also have variance σ².
            </p>

            <h3>Xavier/Glorot Initialization</h3>
            <p>
                For sigmoid/tanh activations, Xavier initialization uses:
            </p>
            <MathBlock tex="W \\sim \\mathcal{U}\\left[-\\sqrt{\\frac{6}{n_{in} + n_{out}}}, \\sqrt{\\frac{6}{n_{in} + n_{out}}}\\right]" />
            <p>
                Or equivalently, Normal distribution with variance 2/(n_in + n_out).
                This preserves variance for activations that saturate at both ends.
            </p>

            <h3>He Initialization for ReLU</h3>
            <p>
                ReLU zeros out negative values, so the standard Xavier formula doesn't work.
                He initialization uses:
            </p>
            <MathBlock tex="W \\sim \\mathcal{N}\\left(0, \\sqrt{\\frac{2}{n_{in}}}\\right)" />
            <p>
                The factor of 2 accounts for ReLU setting half the values to zero.
                Using Xavier with ReLU leads to vanishing activations in deep networks.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Modern default:</strong> PyTorch and TensorFlow use Kaiming (He)
                initialization by default for Conv2d and Linear layers with ReLU.
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
            <h2>Weight initialization: Mathematical derivation</h2>

            <DefBlock label="Variance Preservation Principle">
                For a linear layer y = Wx + b with inputs x having variance Var(x),
                we want Var(y) ≈ Var(x). Under assumptions of zero-mean, independent inputs:
                <MathBlock tex="\\text{Var}(y) = n_{in} \\cdot \\text{Var}(W) \\cdot \\text{Var}(x)" />
                For variance to be preserved, we need Var(W) = 1/n_in.
            </DefBlock>

            <h3>Xavier/Glorot initialization</h3>
            <p>
                Glorot and Bengio considered both forward and backward passes.
                For the forward pass, we need Var(W) = 1/n_in.
                For the backward pass, we need Var(W) = 1/n_out.
            </p>
            <p>
                The Xavier compromise averages these:
            </p>
            <MathBlock tex="\\text{Var}(W) = \\frac{2}{n_{in} + n_{out}}" />
            <p>
                Uniform initialization: W ~ U[-√(6/(n_in + n_out)), √(6/(n_in + n_out))]
                <br />
                Normal initialization: W ~ N(0, √(2/(n_in + n_out)))
            </p>

            <h3>He initialization for ReLU</h3>
            <p>
                For ReLU: y = max(0, x), the negative half of inputs is zeroed.
                Assuming symmetric pre-activation, this means effectively:
            </p>
            <MathBlock tex="\\mathbb{E}[\\text{ReLU}(x)^2] = \\frac{1}{2} \\mathbb{E}[x^2]" />
            <p>
                To compensate for losing half the variance, we need twice the initial variance:
            </p>
            <MathBlock tex="\\text{Var}(W) = \\frac{2}{n_{in}}" />

            <h3>Derivation sketch</h3>
            <p>
                For a single neuron: y = Σ W_i x_i. Assuming independence:
            </p>
            <MathBlock tex="\\text{Var}(y) = \\sum_{i=1}^{n_{in}} \\text{Var}(W_i x_i) = n_{in} \\cdot \\text{Var}(W) \\cdot \\text{Var}(x)" />
            <p>
                Setting Var(y) = Var(x) gives Var(W) = 1/n_in for linear activations.
                For ReLU which passes only positive values, multiply by 2.
            </p>

            <div className="ch-callout">
                <strong>Why not always use He?</strong> For activations that don't zero
                out values (tanh, sigmoid), Xavier is still appropriate. But for ReLU
                and its variants, He initialization is essential for deep networks.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib.pyplot as plt

# ── Initialization Schemes ───────────────────────────────────────────────────
def glorot_uniform(n_in, n_out):
    """Xavier/Glorot uniform initialization"""
    limit = np.sqrt(6.0 / (n_in + n_out))
    return np.random.uniform(-limit, limit, (n_out, n_in))

def glorot_normal(n_in, n_out):
    """Xavier/Glorot normal initialization"""
    std = np.sqrt(2.0 / (n_in + n_out))
    return np.random.normal(0, std, (n_out, n_in))

def he_uniform(n_in, n_out):
    """He/Kaiming uniform initialization for ReLU"""
    limit = np.sqrt(6.0 / n_in)
    return np.random.uniform(-limit, limit, (n_out, n_in))

def he_normal(n_in, n_out):
    """He/Kaiming normal initialization for ReLU"""
    std = np.sqrt(2.0 / n_in)
    return np.random.normal(0, std, (n_out, n_in))

def bad_small_init(n_in, n_out):
    """Too small - causes vanishing gradients"""
    return np.random.randn(n_out, n_in) * 0.01

def bad_large_init(n_in, n_out):
    """Too large - causes exploding gradients"""
    return np.random.randn(n_out, n_in) * 2.0

# ── Activation Functions ─────────────────────────────────────────────────────
def relu(x):
    return np.maximum(0, x)

def tanh(x):
    return np.tanh(x)

# ── Simulate Forward Pass Through Deep Network ───────────────────────────────
def forward_deep(W_init_fn, activation_fn, n_layers=20, n_units=500):
    """Forward pass through a deep network, track layer statistics"""
    x = np.random.randn(1000, n_units)  # Input batch
    means = []
    stds = []

    for layer in range(n_layers):
        W = W_init_fn(n_units, n_units)
        x = activation_fn(x @ W.T)
        means.append(np.mean(x))
        stds.append(np.std(x))

    return means, stds

# Compare different initializations with ReLU
print("Comparing initialization schemes with ReLU activation:")
print("=" * 60)

inits = [
    ("He (correct)", he_normal),
    ("Glorot (suboptimal)", glorot_normal),
    ("Too small", bad_small_init),
    ("Too large", bad_large_init),
]

for name, init_fn in inits:
    means, stds = forward_deep(init_fn, relu, n_layers=20)
    final_std = stds[-1]
    print(f"\n{name}:")
    print(f"  Layer 1 std:  {stds[0]:.4f}")
    print(f"  Layer 10 std: {stds[9]:.4f}")
    print(f"  Layer 20 std: {final_std:.4f}")
    if final_std < 0.01:
        print(f"  -> VANISHING! (std → 0)")
    elif final_std > 10:
        print(f"  -> EXPLODING! (std → ∞)")
    else:
        print(f"  -> Stable! ✓")

# ── Visualize Activation Flow ────────────────────────────────────────────────
def compare_init_viz():
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))

    inits_viz = [
        ("He (correct)", he_normal),
        ("Glorot", glorot_normal),
        ("Too small", bad_small_init),
        ("Too large", bad_large_init),
    ]

    for idx, (name, init_fn) in enumerate(inits_viz):
        ax = axes[idx // 2, idx % 2]
        means, stds = forward_deep(init_fn, relu, n_layers=30)
        ax.plot(range(1, 31), stds, 'b-', linewidth=2, label='Std dev')
        ax.axhline(y=1, color='r', linestyle='--', alpha=0.5, label='Target')
        ax.set_xlabel('Layer')
        ax.set_ylabel('Standard Deviation')
        ax.set_title(f'{name} - ReLU')
        ax.legend()
        ax.set_ylim(0, 5)

    plt.tight_layout()
    plt.savefig('init_comparison.png', dpi=150)
    print("\nVisualization saved to init_comparison.png")

# Uncomment to generate visualization:
# compare_init_viz()

# ── Concrete Example: Initializing a Layer ───────────────────────────────────
n_in, n_out = 784, 256

print("\n" + "=" * 60)
print("Example: Initializing a layer (784 → 256)")
print("=" * 60)

W_he = he_normal(n_in, n_out)
W_glorot = glorot_normal(n_in, n_out)

print(f"\nHe initialization:")
print(f"  Std: {np.std(W_he):.4f} (theoretical: {np.sqrt(2/n_in):.4f})")
print(f"  Range: [{np.min(W_he):.4f}, {np.max(W_he):.4f}]")

print(f"\nGlorot initialization:")
print(f"  Std: {np.std(W_glorot):.4f} (theoretical: {np.sqrt(2/(n_in+n_out)):.4f})")
print(f"  Range: [{np.min(W_glorot):.4f}, {np.max(W_glorot):.4f}]")`;

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of Xavier and He initialization, demonstrating
                the vanishing/exploding gradient problem with different schemes.
            </p>
            <CodeBlock code={PY_CODE} filename="initialization_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Experiment:</strong> Run this code to see how different
                initializations affect signal propagation through 20+ layers.
            </div>
        </>
    )
}




export const INITIALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
