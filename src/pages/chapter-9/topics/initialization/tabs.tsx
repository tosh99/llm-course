import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

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
            year: "Pre-2010",
            title: "The Initialisation Problem — Why Small Random Weights Failed",
            challenge:
                "The standard initialisation prescription before 2010 was simple: draw weights from N(0, 0.01) and biases from zero. This had worked for shallow networks and seemed conservative. For deep networks, it was catastrophic. With many layers and weights of magnitude 0.01, the forward pass multiplied activations by small numbers at every layer — pre-activations shrank to near zero by layer 5, and sigmoid/tanh activations were identically near 0.5 (for near-zero pre-activations), producing nearly zero gradients throughout. The network was effectively untrained regardless of how long you ran SGD. Hinton's solution (DBN pretraining) worked around the problem by providing better initialisation via unsupervised training. But what was the principled mathematical solution?",
            what:
                "The research question was: what statistical properties must weight initialisation have so that a deep network can train from random starting points? The intuitive answer — scale weights so that signals neither vanish nor explode — needed to be made precise. This required tracking how the distribution of activations and gradients evolved layer by layer as a function of weight distribution, depth, and activation function.",
            impact:
                "The demand for a principled initialisation theory was the catalyst for signal propagation analysis — a mathematical framework that tracks how distributions evolve through deep networks. This framework, developed by Glorot & Bengio (2010) and He et al. (2015), is the ancestor of every modern initialisation scheme and of the mean field analysis of deep networks developed by Poole, Lahiri, Raghu, Sohl-Dickstein, and Ganguli (2016) that proved deep networks can represent exponentially complex functions.",
        },
        {
            year: "2010",
            title: "Glorot & Bengio — Xavier Initialisation",
            challenge:
                "Xavier Glorot and Yoshua Bengio at the Université de Montréal recognised that the initialisation problem could be stated precisely: find Var(W) such that the variance of activations remains approximately constant across layers, preventing both vanishing and exploding signals. They analysed the forward pass (signal propagation) and backward pass (gradient propagation) separately and found they imposed conflicting requirements on Var(W).",
            what:
                "Published as 'Understanding the Difficulty of Training Deep Feedforward Neural Networks' at AISTATS 2010, the paper derived that for linear or approximately linear activations (sigmoid near zero, tanh near zero): the forward pass requires Var(W) = 1/n_in to preserve activation variance, while the backward pass requires Var(W) = 1/n_out to preserve gradient variance. Since n_in and n_out typically differ, neither requirement can be exactly satisfied. The Xavier (Glorot) compromise: Var(W) = 2/(n_in + n_out), the harmonic mean. For uniform distribution: W ~ U[-sqrt(6/(n_in + n_out)), sqrt(6/(n_in + n_out))]. For Gaussian: W ~ N(0, sqrt(2/(n_in + n_out))).",
            impact:
                "Xavier initialisation became the default for sigmoid and tanh networks immediately. Training became dramatically more stable: 4-6 layer networks that previously required DBN pretraining could now be trained from scratch. The paper also introduced the concept of 'effective' learning rates per layer (gradients scaled by layer width) that shaped the development of learning rate warmup schedules and adaptive optimisers (Adam, Chapter 11). PyTorch uses Xavier initialisation as the default for linear layers with tanh activation (torch.nn.init.xavier_uniform_).",
        },
        {
            year: "2015",
            title: "He, Zhang, Ren & Sun — He (Kaiming) Initialisation for ReLU",
            challenge:
                "As ReLU became the dominant activation (Nair & Hinton 2010, Glorot et al. 2011, AlexNet 2012), Xavier initialisation became suboptimal. The Xavier derivation assumed activations were approximately linear near zero — a good assumption for sigmoid and tanh, but wrong for ReLU. ReLU sets all negative pre-activations to zero, which eliminates half the activation variance at each layer. A network with Xavier initialisation and ReLU activations lost half its signal per layer — vanishing in log_2(n) layers.",
            what:
                "Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun at Microsoft Research Asia published 'Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification' at ICCV 2015. The key derivation: for ReLU, the variance of the output of a layer is Var(y) = (n_in / 2) * Var(W) * Var(x), because ReLU zeros out the negative half of the input (reducing variance by exactly half compared to the full input). To preserve variance, Var(W) = 2/n_in. For the backward pass, the symmetric derivation gives Var(W) = 2/n_out. The recommendation: use forward-mode Var(W) = 2/n_in (the He/Kaiming normal initialisation). For Gaussian: W ~ N(0, sqrt(2/n_in)). For uniform: W ~ U[-sqrt(6/n_in), sqrt(6/n_in)].",
            impact:
                "He initialisation enabled training very deep networks from random initialisation without any pretraining. The paper demonstrated a 22-layer fully convolutional network trained from scratch with He init, outperforming all previous methods on ImageNet. This directly enabled ResNet: without He initialisation, ResNet-152 (152 layers) could not be trained from scratch at all. PyTorch uses He initialisation (torch.nn.init.kaiming_normal_) as the default for convolutional and linear layers with ReLU activation.",
        },
        {
            year: "2015",
            title: "Mishkin & Matas — LSUV: Layer-Sequential Unit Variance",
            challenge:
                "Xavier and He initialisation were derived under simplifying assumptions: linear layers, no biases, no normalisation, independent inputs. For complex modern architectures with non-standard connectivity — skip connections, attention layers, grouped convolutions — the theoretical assumptions might not hold. Could there be a more empirical, data-driven initialisation that guaranteed unit variance at every layer without requiring a closed-form derivation?",
            what:
                "Dmytro Mishkin and Jiri Matas proposed Layer-Sequential Unit Variance (LSUV) initialisation: (1) initialise all weights with orthogonal initialisation; (2) for each layer in sequence, do one forward pass with a mini-batch of data; (3) measure the variance of the layer's output; (4) scale the layer's weights by 1/sqrt(variance) so the output has unit variance. Repeat until all layers have unit-variance outputs. This is an empirical algorithm that does not require any assumptions about the network architecture or activation function.",
            impact:
                "LSUV outperformed Xavier and He initialisation on several benchmarks in 2015 and demonstrated that data-dependent initialisation could be superior to theory-derived initialisation. The idea of using data to calibrate initialisation directly prefigures modern techniques: MetaInit (2019), GradInit (2021), and the per-layer learning rate schemes in modern Adam optimisers. LSUV also introduced the orthogonal weight matrix as a starting point — a separately important development for RNN training.",
        },
        {
            year: "2016",
            title: "Orthogonal Initialisation for RNNs and Deep Linear Networks",
            challenge:
                "Recurrent neural networks (RNNs, Chapter 12) face an extreme version of the initialisation problem. The same weight matrix W is multiplied by itself T times during the forward pass (once per time step) — so the effective depth is the sequence length T, which might be hundreds or thousands. Xavier or He initialisation produced weights with singular values scattered around 1 — but any deviation from exactly 1 compounded over T steps. The singular values of W^T either exploded (if any eigenvalue &gt; 1) or vanished (if any eigenvalue &lt; 1).",
            what:
                "Saxe, McClelland, and Ganguli (2013, published ICLR 2014) analysed deep linear networks and proved that orthogonal weight matrices — with all singular values exactly equal to 1 — were optimal for signal propagation. They showed that random orthogonal matrices (drawn from the Haar distribution over the orthogonal group) preserved both activation variance and gradient variance exactly through any depth, with no assumptions about the activation function. For RNNs, Le et al. (2015) showed that initialising the recurrent weight matrix as the identity matrix (a special case of orthogonal) enabled training RNNs on tasks requiring memory of 1,000+ steps.",
            impact:
                "Orthogonal initialisation became the standard for RNNs and the foundation for understanding why residual connections work (ResNets are approximately identity-initialised in the residual branch). The analysis of deep linear networks by Saxe et al. produced exact solutions for gradient flow and learning dynamics that became the mathematical foundation for the 'mean field theory of deep learning' developed by the Google Brain team in 2016–2018, which explained why deep networks have more expressive power than shallow ones.",
        },
        {
            year: "2017 – present",
            title: "Transformer Initialisation — Small Weights, Residual Scaling, and Warmup",
            challenge:
                "Transformer architectures (Chapter 19) introduced new initialisation challenges. The architecture has residual connections at every layer, attention mechanisms that compute dot products of queries and keys (which can have large variance for high-dimensional embeddings), and layer normalisation that interacts with initialisation in non-obvious ways. Naive application of Xavier or He initialisation to Transformers caused instability — particularly in the early training steps where large gradient updates could cause attention weights to collapse to near-uniform or near-one-hot distributions.",
            what:
                "The Transformer paper (Vaswani et al. 2017) used Xavier uniform initialisation with a learning rate warmup schedule: linearly increase the learning rate for the first 4,000 steps, then decay proportionally to 1/sqrt(step). The warmup allowed the model to find a reasonable gradient direction before taking large steps. GPT-2 introduced 'scaled initialisation of residual projections': divide the weights in residual connections by sqrt(2 * n_layers), so the residual branch adds less variance at initialisation and the network starts closer to the identity function. This prevents early training instability from residual accumulation.",
            impact:
                "Residual branch scaling became the standard for Transformer initialisation. GPT-3, PaLM, LLaMA, and every major language model uses a version of this approach. The learning rate warmup schedule — ubiquitous in Transformer training — is a direct consequence of initialisation sensitivity: without warmup, the large early learning rates destabilise the initialisation and cause training divergence. Initialisation and learning rate schedule are now understood as coupled: you cannot design one without considering the other.",
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

// ── Kid Tab ──────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Starting in the right place — why the first step matters most</h2>

            <Analogy label="The treasure hunt analogy">
                Imagine you are searching for treasure buried somewhere in a vast desert. You start at a random position and walk in the direction the ground slopes downhill. If you start in a good location — near the treasure — you find it quickly. If you start at the edge of the desert, you might walk for years in the wrong direction before finding the right valley.
                <br /><br />
                Neural network training is exactly this. The weights are your position, the loss function is the terrain height, and SGD is the downhill walker. Bad initialisation means starting at the wrong end of the desert — and sometimes in terrain so flat or so steep that you can never move at all.
            </Analogy>

            <Analogy label="The telephone game — why scale matters">
                In the telephone game, each person whispers the message to the next. If everyone whispers very quietly, the message fades to silence after a few people. If everyone shouts, the message distorts into noise. The goal is for each person to pass the message at exactly the same volume.
                <br /><br />
                Weight initialisation is the same problem. If weights are too small, signals shrink to zero as they pass through layers. If too large, signals explode to infinity. The activation variance must stay roughly constant from layer to layer — neither shrinking nor growing. Glorot and Bengio (2010) derived exactly what weight scale achieves this.
            </Analogy>

            <Analogy label="Why ReLU changes everything">
                Glorot's formula worked for sigmoid and tanh networks. But ReLU throws away half the signal — everything below zero becomes zero. It's like whispering half the message at each step: the signal halves at every layer.
                <br /><br />
                He initialisation fixes this by starting twice as loud. If half the signal will be thrown away at each layer, start with twice the variance so the surviving half has the right amount. W ~ N(0, sqrt(2/n_in)) rather than sqrt(1/n_in). Doubling the starting variance compensates exactly for ReLU's halving effect.
            </Analogy>

            <Analogy label="Orthogonal initialisation — the identity shortcut">
                RNNs are even harder: the same weight matrix is applied T times (T = sequence length). Even a slight deviation from "preserve all information" compounds over T steps. Start with a weight matrix that maps every input to an output of the same size without any distortion — an orthogonal matrix, where every singular value is exactly 1.
                <br /><br />
                This is not just mathematically convenient. An orthogonal matrix is the continuous analogue of a perfect relay: it passes everything through at the same volume without adding or removing energy. At step 1 of training, the RNN is essentially the identity function — it passes information forward unchanged — giving gradient descent a maximally informative starting position.
            </Analogy>

            <Analogy label="What comes next — putting it all together">
                Chapter 9 gave neural networks four new tools: Deep Belief Networks proved depth was possible, ReLU solved vanishing gradients from the activation side, Dropout solved overfitting with implicit ensembles, and Xavier/He initialisation solved the starting point problem. In 2012, Alex Krizhevsky assembled all four on two gaming GPUs. The result — AlexNet — cut ImageNet error from 26% to 15% in a single year, shocking the computer vision community and launching the modern AI era. Chapter 10 tells that story.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Signal Propagation Analysis — Variance Through Layers</h3>
            <p>
                For a linear layer y = Wx, with x having variance Var(x) and W having i.i.d. elements with variance Var(W), and n_in inputs:
            </p>
            <MathBlock tex="\text{Var}(y_j) = \sum_{i=1}^{n_{in}} \text{Var}(W_{ij}) \cdot \text{Var}(x_i) = n_{in} \cdot \text{Var}(W) \cdot \text{Var}(x)" />
            <p>
                For variance to be preserved (Var(y) = Var(x)): Var(W) = 1/n_in. For the backward pass with gradient g = W^T delta: Var(delta_prev) = n_out * Var(W) * Var(delta), requiring Var(W) = 1/n_out. The Xavier compromise: Var(W) = 2/(n_in + n_out).
            </p>

            <h3>He Initialisation — ReLU Variance Correction</h3>
            <p>
                For a ReLU layer y = ReLU(Wx), assuming Wx ~ N(0, sigma^2):
            </p>
            <MathBlock tex="\text{Var}(\text{ReLU}(z)) = \frac{1}{2}\,\text{Var}(z) \quad \text{for } z \sim \mathcal{N}(0,\, \sigma^2)" />
            <p>
                Proof: E[ReLU(z)^2] = E[z^2 * 1_&#123;z&gt;0&#125;] = (1/2) E[z^2] = sigma^2/2 by symmetry of the Gaussian. To compensate, use Var(W) = 2/n_in:
            </p>
            <MathBlock tex="\text{Var}(y) = n_{in} \cdot \frac{2}{n_{in}} \cdot \text{Var}(x) \cdot \frac{1}{2} = \text{Var}(x) \quad \checkmark" />

            <h3>Orthogonal Initialisation and Singular Value Analysis</h3>
            <p>
                For a weight matrix W with SVD W = U S V^T, the singular values of W^L are S^L. For S = I (orthogonal matrix), W^L = U I V^T — singular values remain 1 at all depths. For S near I with small perturbation epsilon, (1 + epsilon)^L grows as e^&#123;epsilon * L&#125; — exponentially in depth. Hence even small deviations from unit singular values compound rapidly in deep or RNN networks.
            </p>
        </>
    )
}

const PY_INIT = `import numpy as np

# ── Initialisation Schemes ────────────────────────────────────────────────────
def glorot_normal(n_in, n_out):
    """Xavier/Glorot (2010): optimal for sigmoid/tanh, variance = 2/(n_in+n_out)"""
    std = np.sqrt(2.0 / (n_in + n_out))
    return np.random.normal(0, std, (n_in, n_out))

def glorot_uniform(n_in, n_out):
    limit = np.sqrt(6.0 / (n_in + n_out))
    return np.random.uniform(-limit, limit, (n_in, n_out))

def he_normal(n_in, n_out):
    """He/Kaiming (2015): optimal for ReLU, variance = 2/n_in"""
    std = np.sqrt(2.0 / n_in)
    return np.random.normal(0, std, (n_in, n_out))

def orthogonal(n_in, n_out):
    """Saxe et al. (2014): orthogonal matrix preserves singular values."""
    flat = np.random.randn(max(n_in, n_out), min(n_in, n_out))
    U, _, Vt = np.linalg.svd(flat, full_matrices=False)
    Q = U if n_in >= n_out else Vt
    return Q[:n_in, :n_out]

def small_random(n_in, n_out):
    """Naive: N(0, 0.01) — causes vanishing activations in deep networks"""
    return np.random.normal(0, 0.01, (n_in, n_out))

def large_random(n_in, n_out):
    """Naive: N(0, 1) — causes exploding activations"""
    return np.random.normal(0, 1.0, (n_in, n_out))


# ── Activation Functions ──────────────────────────────────────────────────────
def relu(x):
    return np.maximum(0, x)

def tanh(x):
    return np.tanh(x)


# ── Signal Propagation Simulation ─────────────────────────────────────────────
def trace_signal_propagation(init_fn, activation, n_layers=30, n_units=512,
                              batch_size=128):
    """
    Trace the standard deviation of activations through a deep network.
    Returns std at each layer.
    """
    x = np.random.randn(batch_size, n_units)
    stds = [x.std()]

    for _ in range(n_layers):
        W = init_fn(n_units, n_units)
        x = activation(x @ W)
        stds.append(x.std())

    return np.array(stds)


# ── Compare Initialisations ───────────────────────────────────────────────────
configs = [
    ("He normal + ReLU",       he_normal,     relu),
    ("Glorot normal + ReLU",   glorot_normal, relu),
    ("Small random + ReLU",    small_random,  relu),
    ("Large random + ReLU",    large_random,  relu),
    ("Glorot normal + tanh",   glorot_normal, tanh),
    ("Small random + tanh",    small_random,  tanh),
]

print("Signal propagation through 30-layer networks")
print(f"{'Configuration':<30} | {'Layer 1 std':>11} | {'Layer 15 std':>12} | {'Layer 30 std':>12} | {'Status':>10}")
print("-" * 90)

for name, init_fn, act_fn in configs:
    np.random.seed(42)
    stds = trace_signal_propagation(init_fn, act_fn, n_layers=30)
    s1, s15, s30 = stds[1], stds[15], stds[30]

    if s30 < 1e-5:
        status = "VANISHED"
    elif s30 > 100:
        status = "EXPLODED"
    else:
        status = "Stable"

    print(f"{name:<30} | {s1:>11.5f} | {s15:>12.5f} | {s30:>12.5f} | {status:>10}")


# ── Verify He Initialisation Derivation ──────────────────────────────────────
print("\n\nHe initialisation: theoretical vs empirical variance")
print("=" * 55)

np.random.seed(42)
n_in = 512
n_out = 256
batch = 1000

W = he_normal(n_in, n_out)
x = np.random.randn(batch, n_in)
z = x @ W
y = relu(z)

print(f"n_in = {n_in}, n_out = {n_out}")
print(f"Input variance:      {x.var():.4f} (expected 1.0)")
print(f"Pre-ReLU variance:   {z.var():.4f} (expected 1.0 with He init)")
print(f"Post-ReLU variance:  {y.var():.4f} (expected 0.5, then next layer's")
print(f"                                    He init compensates for the halving)")
print(f"\nHe init std = sqrt(2/{n_in}) = {np.sqrt(2/n_in):.5f}")
print(f"Actual W std =               {W.std():.5f}")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation comparing six initialisation schemes on a 30-layer network, tracing activation standard deviation through depth. Demonstrates how He initialisation maintains stable signal propagation for ReLU networks while all other schemes either vanish or explode.
            </p>
            <CodeBlock code={PY_INIT} filename="initialization_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> Only He normal + ReLU maintains a stable standard deviation through 30 layers. All other combinations either vanish (signal reaches zero) or explode (signal grows to infinity). This is why He initialisation was a prerequisite for training ResNet-152 — without it, the 152-layer network was untrainable regardless of any other architectural choice.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Weight initialisation — principled signal propagation</h2>

            <h3>The Signal Propagation Framework</h3>
            <p>
                For a layer y = activation(Wx) with n_in inputs, if x has variance Var(x) and W has i.i.d. entries with variance Var(W), then Var(Wx) = n_in * Var(W) * Var(x). For variance to be preserved at every layer, we need n_in * Var(W) = 1 per layer. This simple requirement, applied to both the forward and backward passes, determines the initialisation scale.
            </p>

            <h3>Xavier/Glorot Initialisation — For Sigmoid/Tanh</h3>
            <MathBlock tex="\text{Var}(W) = \frac{2}{n_{in} + n_{out}} \quad \Longleftrightarrow \quad W \sim \mathcal{N}\!\left(0,\; \sqrt{\frac{2}{n_{in}+n_{out}}}\right)" />
            <p>
                Compromise between forward (requires 1/n_in) and backward (requires 1/n_out) variance preservation. Derived under the assumption that activations are approximately linear at initialisation — true for tanh and sigmoid near zero but not for ReLU.
            </p>

            <h3>He (Kaiming) Initialisation — For ReLU</h3>
            <MathBlock tex="\text{Var}(W) = \frac{2}{n_{in}} \quad \Longleftrightarrow \quad W \sim \mathcal{N}\!\left(0,\; \sqrt{\frac{2}{n_{in}}}\right)" />
            <p>
                The factor of 2 accounts for ReLU setting negative values to zero — reducing the effective variance by half at each layer. The derivation: E[ReLU(z)^2] = E[z^2]/2 = Var(W) * n_in * Var(x) / 2. Setting this equal to Var(x) gives Var(W) = 2/n_in. Used by default in PyTorch for Conv2d and Linear layers with ReLU (torch.nn.init.kaiming_normal_).
            </p>

            <h3>Orthogonal Initialisation — For RNNs</h3>
            <MathBlock tex="W = U\Sigma V^\top \text{ from SVD of random Gaussian},\;\; \text{then rescale so all singular values} = 1" />
            <p>
                An orthogonal weight matrix has all singular values equal to 1. W^T applied T times (T = sequence length in an RNN) preserves all singular values: 1^T = 1. Prevents both vanishing and exploding gradients in recurrent networks regardless of sequence length. Draw from the Haar distribution: generate random Gaussian, take SVD, set singular values to 1, reconstruct. Used in PyTorch as torch.nn.init.orthogonal_.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Chapter 9 complete. The four ingredients assembled:</strong> Deep Belief Networks (2006) proved that training deep networks was possible via layer-wise pretraining. ReLU (2010–2011) solved vanishing gradients for positive inputs. Dropout (2012–2014) solved overfitting by implicit ensemble learning. He initialisation (2015) solved the starting point problem for ReLU networks. In 2012, AlexNet combined these ingredients and trained an 8-layer CNN on two gaming GPUs, cutting ImageNet error from 26% to 15%. Chapter 10 tells the story of that experiment and its consequences for the entire technology industry.
            </div>

            <DefBlock label="Initialisation Scheme Selection Guide">
                Xavier uniform/normal: default for linear layers with tanh or sigmoid; PyTorch default for nn.Linear<br /><br />
                He normal (Kaiming): default for layers followed by ReLU or Leaky ReLU; PyTorch default for nn.Conv2d<br /><br />
                Orthogonal: default for recurrent weight matrices (nn.RNN, nn.LSTM hidden-to-hidden weights)<br /><br />
                Residual branch scaling (1/sqrt(2*n_layers)): for Transformer residual projections; prevents residual accumulation<br /><br />
                Zero: biases are initialised to zero (or small constant) by default in all frameworks
            </DefBlock>

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

// ── Tab content map ─────────────────────────────────────────────────────────

export const INITIALIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
