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
            year: "2000",
            title: "Hahnloser et al. — Digital Rectification in Computational Neuroscience",
            challenge:
                "Computational neuroscientists were modelling the visual cortex and building circuits that performed nonlinear operations while maintaining biological plausibility. The standard sigmoid neuron model had problems: it saturated for large inputs, it was always active (unlike real neurons that have a resting state), and it could not represent precise zero values. Real neurons can be genuinely silent. A biologically motivated activation function that was zero below threshold and linear above was attractive theoretically but had not been systematically evaluated in multi-layer networks.",
            what:
                "Richard Hahnloser, Rahul Sarpeshkar, Misha Mahowald, Rodney Douglas, and Sebastian Seung published 'Digital Selection and Analogue Amplification Coexist in a Cortex-Inspired Silicon Circuit' in Nature (2000). They showed that half-wave rectification — setting negative values to zero while passing positive values unchanged — arose naturally in cortical circuits as a mechanism for winner-take-all competition and sparse coding. The function f(x) = max(0, x) was implemented in VLSI silicon and shown to perform stable analogue-digital computation. This is the earliest published use of what would become the ReLU activation function, motivated by neuroscience rather than gradient flow. The paper did not discuss deep network training; the connection to backpropagation came a decade later.",
            impact:
                "The neuroscience origin of ReLU is historically important because it shows that the most influential activation function in deep learning came from biology, not from numerical optimisation. When Nair and Hinton (2010) proposed ReLU for RBMs, they cited the sparsity and efficiency properties that neuroscience had motivated. The biological justification gave the function early credibility before its empirical dominance was established.",
        },
        {
            year: "2009 – 2010",
            title: "Jarrett et al. & Nair-Hinton — Activation Function Comparison and ReLU for RBMs",
            challenge:
                "With DBN pretraining available, researchers began systematically evaluating which architectural choices mattered most for deep network performance. The standard activation was the logistic sigmoid: sigma(x) = 1/(1+exp(-x)), used since the 1980s. For deep networks, sigmoid saturated for |x| > 4, producing near-zero gradients. Tanh was slightly better but still saturated. Could a non-saturating activation function fix the vanishing gradient problem from the activation function's side rather than the initialisation side?",
            what:
                "Kevin Jarrett, Koray Kavukcuoglu, Marc'Aurelio Ranzato, and Yann LeCun (2009) systematically compared activation functions — sigmoid, tanh, absolute value, max-pooling, and rectified linear units — on vision benchmarks and found that non-linear activation combined with local contrast normalisation worked best; their evaluation included rectified linear units but did not advocate for them specifically. Vinod Nair and Geoffrey Hinton (2010) published 'Rectified Linear Units Improve Restricted Boltzmann Machines', explicitly showing that ReLU hidden units (with Gaussian rather than binary visible units) learned better features and trained faster than sigmoid RBMs. They also showed that ReLU units could be modelled as an infinite stack of binary units with shared weights but different biases.",
            impact:
                "The Nair-Hinton paper was the first explicit advocacy for ReLU in deep networks. It demonstrated that the sparse, non-saturating activation improved both representation quality and training speed for RBMs. Within a year, researchers began applying ReLU to feedforward networks and CNNs, finding consistent improvements. The paper's timing — just before the deep learning explosion of 2012 — meant that ReLU was ready to be included in AlexNet.",
        },
        {
            year: "2011",
            title: "Glorot, Bordes & Bengio — Deep Sparse Rectifier Neural Networks",
            challenge:
                "Nair and Hinton had shown ReLU benefits in RBMs, but the theoretical justification for feedforward networks was lacking. Why exactly did ReLU help with training? Was it the sparsity (many neurons outputting zero), the non-saturating gradient for positive inputs, or something else? And did ReLU actually solve the vanishing gradient problem, or just delay it?",
            what:
                "Xavier Glorot, Antoine Bordes, and Yoshua Bengio published a systematic theoretical and empirical analysis of ReLU in feedforward networks. Their key findings: (1) ReLU creates sparse representations (approximately 50% of neurons are inactive), which is computationally efficient and statistically beneficial; (2) for positive inputs, the gradient is exactly 1, preventing multiplicative attenuation across layers; (3) ReLU networks achieve representational disentanglement — different neurons specialise for different inputs without gradient interference; (4) empirically, 6-layer ReLU networks without pretraining matched or exceeded pretrained sigmoid networks on text classification and image recognition.",
            impact:
                "Glorot et al. 2011 established the theoretical case for ReLU and showed empirically that ReLU allowed training deep networks from random initialisation — removing the need for DBN pretraining. This was a critical bridge between the pretraining era and the AlexNet era. When Krizhevsky chose ReLU for AlexNet in 2012, he was building on this empirical and theoretical foundation. The paper also coined the term 'rectifier networks' that appears in subsequent literature.",
        },
        {
            year: "2012",
            title: "AlexNet — ReLU at Scale",
            challenge:
                "Before AlexNet, no one had trained an 8-layer CNN on a dataset as large as ImageNet (1.2 million images, 1,000 classes) using consumer hardware. The computational cost was the binding constraint. Sigmoid activations required expensive exponential computations; deep sigmoid networks converged slowly due to gradient attenuation. ReLU's potential for speedup was known theoretically but not demonstrated at this scale.",
            what:
                "Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton used ReLU throughout AlexNet and explicitly reported that ReLU training was 6x faster than an equivalent sigmoid network on the same architecture. In their paper, they wrote: 'We refer to neurons with this nonlinearity as Rectified Linear Units (ReLUs). Deep convolutional neural networks with ReLUs train several times faster than their equivalents with tanh units.' The choice of ReLU was not incidental — it was essential to making 8-layer training feasible on two GPUs in a reasonable timeframe.",
            impact:
                "AlexNet's ImageNet result (Chapter 10) was the watershed moment of the deep learning revolution. ReLU was as responsible for that result as the GPU training or the dropout regularisation. Every major deep network architecture since 2012 — VGG, ResNet, Inception, BERT, GPT, ViT — uses ReLU or a ReLU variant as its default activation. The function f(x) = max(0, x) is the most deployed mathematical operation in production ML systems today.",
        },
        {
            year: "2013 – 2016",
            title: "ReLU Variants — Leaky ReLU, PReLU, ELU, and the Dying Neuron Problem",
            challenge:
                "Standard ReLU had a failure mode: if a neuron received consistently negative pre-activations during training — because the weights were poorly initialised or a large gradient update pushed the bias negative — the neuron would output zero for all inputs, receiving zero gradient, and never recover. This was the 'dying ReLU' problem. In practice, 5-40% of neurons could die in poorly configured networks, significantly reducing capacity.",
            what:
                "Multiple variants addressed the dying neuron problem. Leaky ReLU (Maas et al. 2013): f(x) = max(alpha*x, x) with alpha = 0.01 — allows a small negative slope, keeping dying neurons weakly alive. PReLU (He et al. 2015): same form but alpha is a learned parameter per channel, tuned by backpropagation. ELU (Clevert, Unterthiner, Hochreiter 2015): f(x) = x if x > 0, alpha*(exp(x)-1) otherwise — smooth, has negative saturation that brings mean activations closer to zero, helping with gradient flow. SELU (Klambauer et al. 2017): self-normalising variant derived to maintain zero mean and unit variance through layers.",
            impact:
                "The ReLU variant ecosystem showed that the precise form of the activation function mattered but not as much as having non-saturation for positive inputs. Leaky ReLU and ELU outperformed ReLU on some tasks; standard ReLU remained the most common choice due to simplicity. The dying neuron problem is largely avoided by good initialisation (He init) and careful learning rate selection — showing that architectural and optimisation choices interact.",
        },
        {
            year: "2016",
            title: "GELU — Gaussian Error Linear Units for Language Models",
            challenge:
                "As Transformer architectures (Chapter 19) replaced CNNs for language tasks, researchers revisited whether ReLU was optimal for the attention-based, high-dimensional setting of language modelling. ReLU's hard threshold at zero was intuitive for vision (edge detection analogy) but lacked stochasticity. A smoother activation that blended ReLU's non-saturation with a probabilistic interpretation might suit the Transformer's gradient flow better.",
            what:
                "Dan Hendrycks and Kevin Gimpel (2016) introduced the Gaussian Error Linear Unit: GELU(x) = x * Phi(x), where Phi is the standard normal CDF. GELU multiplies x by the probability that a standard normal variable is less than x — weighting the input by how much the value exceeds typical activation noise. GELU is smooth, has no exactly-zero region (unlike ReLU), and can be approximated by 0.5x(1 + tanh(sqrt(2/pi)(x + 0.044715x^3))). BERT and GPT-2 adopted GELU; GPT-3 and subsequent language models continued using it.",
            impact:
                "GELU became the dominant activation function for language models and Transformers. Its smooth, stochastic interpretation aligned well with the self-attention mechanism's probabilistic weighting of tokens. The success of GELU in language models while ReLU remained dominant in vision tasks demonstrated that the optimal activation function is task-specific — a principle that remains true: SwiGLU (Noam Shazeer 2020) became the activation of choice for LLaMA and Mistral models.",
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
            <h2>The on/off switch that fixed a decade-long problem</h2>

            <Analogy label="The old activation — a dimmer switch that forgets">
                Sigmoid and tanh activations are like dimmer switches. You can turn them up to full brightness or down to dim — but they always give some light, even when the room should be dark. More importantly: as the input signal gets very large or very small, the dimmer responds less and less to small changes. It saturates.
                <br /><br />
                In deep networks, this saturation multiplied across layers. If each layer's activation function reduced the gradient by a factor of 0.5, then after 10 layers the gradient was 0.5^10 = 0.001 of its original size — effectively zero. Early layers learned nothing. This was the vanishing gradient problem.
            </Analogy>

            <Analogy label="ReLU — the simple solution">
                The Rectified Linear Unit is just: if the input is negative, output zero. If positive, pass it through unchanged. That is the complete function: f(x) = max(0, x).
                <br /><br />
                The gradient of ReLU is equally simple: if the input was positive, the gradient is 1 — passes through at full strength. If the input was negative, the gradient is 0 — completely blocked. No saturation, no fading, no computation beyond a single comparison and max operation.
            </Analogy>

            <Analogy label="Why sparsity is a feature, not a bug">
                About 50% of neurons in a ReLU network output zero at any given time. From a classical perspective this seems wasteful. From an information theory perspective it is efficient: sparse representations are easier to separate, easier to interpret, and harder to overfit.
                <br /><br />
                The brain works similarly. Most cortical neurons are silent most of the time — only a small fraction fires in response to any given stimulus. ReLU implements the same sparse coding principle that neuroscience has described for decades.
            </Analogy>

            <Analogy label="The dying neuron problem — and how to avoid it">
                ReLU has one failure mode: if a neuron gets a large negative gradient update that pushes all its weights negative, the neuron will output zero for every input it ever sees — permanently. It receives zero gradient (because the output is always zero) and never recovers. This is called a dying neuron.
                <br /><br />
                The fix is Leaky ReLU: instead of outputting exactly zero for negative inputs, output a tiny fraction (1% of the input). The neuron stays weakly alive and can recover from bad updates. More sophisticated variants (ELU, GELU) solve the problem with smoother formulations, but simple Leaky ReLU is usually sufficient.
            </Analogy>

            <Analogy label="GELU — the language model upgrade">
                ReLU has a sharp threshold: exactly zero is the cutoff. GELU (Gaussian Error Linear Unit) is a smoother version: instead of a hard cutoff, it weights the input by how much the value exceeds typical activation noise — computed via the Gaussian cumulative distribution function.
                <br /><br />
                BERT, GPT-2, and most modern language models use GELU rather than ReLU because the smooth, probabilistic weighting matches how Transformer attention distributes probability over tokens. The lesson: the best activation function depends on the architecture and task — ReLU for vision, GELU for language, SwiGLU for the largest models.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Gradient Flow Analysis — ReLU vs Sigmoid</h3>
            <p>
                For a network with L layers and sigmoid activations, the gradient of the loss with respect to weights in layer 1 involves a product of L terms:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_1} = \frac{\partial \mathcal{L}}{\partial h_L} \cdot \prod_{\ell=2}^{L} \frac{\partial h_\ell}{\partial h_{\ell-1}}" />
            <p>
                For sigmoid sigma(z), the derivative is sigma(z)(1 − sigma(z)) &lt;= 0.25 for all z, with maximum at z = 0. For a typical deep network with random initialisation, most pre-activations are large, making each factor much less than 0.25. The product of L such factors decays as 0.25^L — exponentially in depth.
            </p>
            <MathBlock tex="\text{ReLU: } \frac{d}{dx}\text{ReLU}(x) = \mathbf{1}_{x > 0} \in \{0, 1\}" />
            <p>
                For ReLU, each factor in the product is either 0 (inactive neuron) or 1 (active neuron). There is no multiplicative decay for active neurons — the gradient passes through at full strength. If a path from output to input has k active ReLU neurons, the gradient is multiplied by exactly 1^k = 1. This is the key property that prevents vanishing gradients.
            </p>

            <h3>Sparsity and Representational Efficiency</h3>
            <MathBlock tex="\mathbb{E}[\mathbf{1}_{\text{ReLU}(z) = 0}] \approx 0.5 \text{ for } z \sim \mathcal{N}(0, \sigma^2)" />
            <p>
                With He initialisation, pre-activations are approximately Gaussian with zero mean, so roughly 50% of ReLU activations are zero. Sparse representations have information-theoretic advantages: they maximise entropy for a given mean activation, are linearly separable by fewer samples, and are more robust to noise. The L0 "pseudo-norm" of a ReLU network is approximately n/2 where n is the number of neurons.
            </p>

            <h3>GELU — Smooth Stochastic Rectification</h3>
            <MathBlock tex="\text{GELU}(x) = x \cdot \Phi(x) = x \cdot \frac{1}{2}\left[1 + \text{erf}\!\left(\frac{x}{\sqrt{2}}\right)\right]" />
            <p>
                GELU weights the input x by the probability that a standard normal variate is less than x. The derivative: GELU'(x) = Phi(x) + x * phi(x) where phi is the standard normal PDF. Unlike ReLU, GELU is smooth everywhere and has non-zero gradient for all x. The approximation GELU(x) ≈ 0.5x(1 + tanh(0.7978(x + 0.0447x^3))) is used in practice.
            </p>
        </>
    )
}

const PY_RELU = `import numpy as np

# ── Activation Functions ──────────────────────────────────────────────────────
def relu(x):
    return np.maximum(0, x)

def relu_grad(x):
    return (x > 0).astype(float)

def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)

def leaky_relu_grad(x, alpha=0.01):
    return np.where(x > 0, 1.0, alpha)

def elu(x, alpha=1.0):
    return np.where(x > 0, x, alpha * (np.exp(np.clip(x, -50, 0)) - 1))

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_grad(x):
    s = sigmoid(x)
    return s * (1 - s)

def gelu(x):
    """GELU approximation used in BERT/GPT."""
    return 0.5 * x * (1 + np.tanh(np.sqrt(2 / np.pi) * (x + 0.044715 * x**3)))


# ── Gradient Flow Simulation ──────────────────────────────────────────────────
def simulate_gradient_flow(activation, grad_fn, n_layers=20, n_units=256,
                            n_steps=50):
    """
    Simulate gradient magnitude through a deep network with a given activation.
    Returns the mean absolute gradient at each layer over n_steps mini-batches.
    """
    np.random.seed(42)
    W = [np.random.randn(n_units, n_units) * 0.1 for _ in range(n_layers)]
    grad_norms = np.zeros(n_layers)

    for _ in range(n_steps):
        x = np.random.randn(32, n_units)

        # Forward pass: save pre-activations
        pre_acts = []
        h = x
        for l in range(n_layers):
            z = h @ W[l].T
            pre_acts.append(z)
            h = activation(z)

        # Backward pass from output gradient = 1
        dh = np.ones_like(h)
        for l in reversed(range(n_layers)):
            dz = dh * grad_fn(pre_acts[l])
            grad_norms[l] += np.mean(np.abs(dz))
            dh = dz @ W[l]

    return grad_norms / n_steps


print("Gradient magnitude at each layer (deeper = earlier layer)")
print("=" * 65)

for name, act, grad in [
    ("Sigmoid", sigmoid, sigmoid_grad),
    ("ReLU   ", relu,    relu_grad),
    ("L-ReLU ", leaky_relu, leaky_relu_grad),
]:
    norms = simulate_gradient_flow(act, grad, n_layers=20)
    last = norms[-1]
    first = norms[0]
    ratio = first / last if last > 0 else float("inf")
    print(f"\n{name}: layer-1 grad / layer-20 grad = {ratio:.2f}x")
    print(f"  Layer 1 (closest to output): {first:.4f}")
    print(f"  Layer 20 (earliest layer):   {norms[-1]:.4f}")
    status = "STABLE" if ratio < 10 else "VANISHING"
    print(f"  Status: {status}")


# ── Activation Comparison on a Single Forward Pass ────────────────────────────
print("\n\nActivation properties for x in [-3, -1, 0, 1, 3]:")
print("-" * 55)
xs = np.array([-3, -1, 0, 1, 3], dtype=float)
print(f"{'x':>6} | {'sigmoid':>8} | {'ReLU':>8} | {'LeakyReLU':>10} | {'GELU':>8}")
print("-" * 55)
for x in xs:
    print(f"{x:>6.1f} | {sigmoid(x):>8.4f} | {relu(x):>8.4f} | "
          f"{leaky_relu(x):>10.4f} | {gelu(x):>8.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation comparing activation functions by simulating gradient flow through a 20-layer network, demonstrating the vanishing gradient problem with sigmoid and the stable gradient flow with ReLU.
            </p>
            <CodeBlock code={PY_RELU} filename="relu_comparison.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> With sigmoid, the gradient at the earliest layers is a tiny fraction of the gradient at the output — gradients have vanished. With ReLU, the gradient magnitude is similar at all depths. This single property explains why deep networks became trainable in 2012.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>ReLU — simple activation, revolutionary gradient flow</h2>

            <h3>The Vanishing Gradient Problem with Sigmoid</h3>
            <p>
                Sigmoid and tanh activations saturate: their derivatives approach zero for large |x|. In a deep network, the chain rule multiplies these derivatives across all layers — creating an exponentially decaying signal that makes early layers untrainable. For a 10-layer sigmoid network, the gradient at layer 1 may be 0.25^10 ≈ 10^{-6} of the gradient at layer 10.
            </p>

            <h3>ReLU Definition and Gradient</h3>
            <MathBlock tex="\text{ReLU}(x) = \max(0, x) = \begin{cases} x & x > 0 \\ 0 & x \leq 0 \end{cases}" />
            <MathBlock tex="\frac{d}{dx}\text{ReLU}(x) = \begin{cases} 1 & x > 0 \\ 0 & x < 0 \end{cases}" />
            <p>
                The gradient is either exactly 1 (active neurons, gradient passes through unchanged) or exactly 0 (inactive neurons, gradient is blocked). No multiplicative attenuation for active neurons — this is what prevents vanishing gradients.
            </p>

            <h3>ReLU Variants</h3>
            <MathBlock tex="\text{Leaky ReLU: } f(x) = \max(\alpha x, x), \;\; \alpha = 0.01 \quad \text{(prevents dying neurons)}" />
            <MathBlock tex="\text{ELU: } f(x) = \begin{cases} x & x > 0 \\ \alpha(e^x - 1) & x \leq 0 \end{cases} \quad \text{(smooth, negative saturation)}" />
            <MathBlock tex="\text{GELU: } f(x) = x \cdot \Phi(x) \quad \text{(smooth, used in BERT, GPT)}" />

            <h3>Why Sparsity Helps</h3>
            <p>
                Approximately 50% of ReLU activations are zero for typical Gaussian pre-activations. Sparse representations are linearly separable with fewer samples, are robust to noise in the inactive dimensions, and reduce computation (zero activations require no subsequent multiply-accumulate operations). This natural sparsity is one reason ReLU networks generalise better than sigmoid networks with the same width and depth.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Historical impact:</strong> Krizhevsky reported in the AlexNet paper that a 5-layer ReLU network reached 25% training error on CIFAR-10 in 6 epochs, while an equivalent tanh network required 35 epochs to reach the same error — a 6x speedup. This training speed difference was essential for making 8-layer ImageNet training feasible on two GTX 580 GPUs. ReLU did not just help performance; it made the experiment possible at all.
            </div>

            <DefBlock label="Activation Function Comparison">
                Sigmoid: output in (0,1); derivative &lt;= 0.25; saturates at both ends; not zero-centred — causes zig-zag gradient updates<br /><br />
                Tanh: output in (-1,1); derivative &lt;= 1; saturates at both ends; zero-centred but still vanishes<br /><br />
                ReLU: output in [0, inf); derivative is 0 or 1; no saturation for positive inputs; 50% sparse; dying neuron risk<br /><br />
                GELU: output in (-0.17, inf) approx; smooth everywhere; used in BERT, GPT-2/3/4, T5, Gemini
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

export const RELU_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
