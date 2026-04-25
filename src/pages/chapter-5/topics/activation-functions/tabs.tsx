import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Timeline ──────────────────────────────────────────────────────────────────

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
            year: "1943 – 1958",
            title: "The Step Function — Biological Inspiration, Mathematical Pain",
            challenge:
                "McCulloch and Pitts modelled the neuron in 1943 as a binary unit: either it fires (output 1) or it doesn't (output 0), depending on whether the weighted sum of its inputs exceeds a threshold. This was biologically motivated — real neurons fire action potentials that are approximately all-or-nothing. The step function is perfectly interpretable and matched the neuroscience. But it created an immediate mathematical problem: the step function is not differentiable anywhere. Its derivative is either 0 (flat regions) or undefined (at the threshold). This made gradient-based learning impossible.",
            what: "Rosenblatt's perceptron (1958) used the step function but avoided calculus entirely — its learning rule was based on error correction, not gradient descent. If the perceptron made a wrong binary prediction, the rule nudged the weights slightly toward correctness. This worked for single-layer networks on linearly separable data but could not be extended to multi-layer networks because there was no gradient to propagate backward through the step.",
            impact:
                "The step function set the template for what an activation function needed to do: squash unbounded linear combinations into a bounded output range. Every subsequent activation function is a smoother, differentiable version of the step. The biological motivation (all-or-nothing firing) was gradually replaced by a mathematical one: choose an activation that keeps gradients alive through backpropagation.",
        },
        {
            year: "1960s – 1986",
            title: "Sigmoid — The Differentiable Step",
            challenge:
                "When Rumelhart, Hinton, and Williams needed an activation function they could differentiate through in 1986, the sigmoid function was the natural choice. It was smooth (infinitely differentiable), bounded (output in (0, 1)), and had a particularly clean derivative: <InlineMath tex='\\sigma(x)(1-\\sigma(x))' />. The product of the activation and its complement — no transcendental functions needed to compute the gradient. Biologically, you could interpret it as a firing rate rather than a binary spike.",
            what: "The logistic sigmoid <InlineMath tex='\\sigma(x) = 1/(1+e^{-x})' /> became the standard hidden-layer activation in 1986-era neural networks. Its S-shaped curve squashes all real inputs to (0, 1), acting like a smooth version of the step function. The gradient of the sigmoid vanishes at both ends: for large positive or negative inputs, <InlineMath tex='\\sigma(x)' /> saturates to 0 or 1, and <InlineMath tex=\"\\sigma'(x) \\to 0\" />.",
            impact:
                "Sigmoid activation dominated neural network research for two decades. Every MLP in the 1986–2006 era used it. Its saturation property — which seemed benign for shallow networks — turned out to be catastrophic for deep ones: the vanishing gradient problem that paralysed deep network training was directly caused by sigmoid's saturating gradients. The 2010s would replace sigmoid almost entirely in hidden layers, while keeping it for output layers in binary classification.",
        },
        {
            year: "1986 – 1997",
            title: "Tanh — Zero-Centring the Sigmoid",
            challenge:
                "Researchers noticed that sigmoid's outputs were always positive (range (0, 1)). This meant that the gradients of weights in the next layer were always the same sign — all positive or all negative depending on the error signal. This caused zig-zagging gradient updates: when updating a weight matrix, all weights would increase together or decrease together, creating inefficient diagonal movement in the loss landscape. A zero-centred activation would allow mixed signs and more efficient updates.",
            what: "The hyperbolic tangent function <InlineMath tex='\\tanh(x) = (e^x - e^{-x})/(e^x + e^{-x})' /> is mathematically equivalent to a shifted and scaled sigmoid: <InlineMath tex='\\tanh(x) = 2\\sigma(2x) - 1' />. Its output ranges from -1 to +1, centred at 0. Its maximum gradient is 1 (compared to 0.25 for sigmoid), making it a stronger signal carrier for early training. Tanh was widely used in the 1990s and was chosen as the activation for LSTM gates (Hochreiter and Schmidhuber, 1997).",
            impact:
                "Tanh became the preferred hidden-layer activation when LeCun and colleagues formalised recommendations in their 1998 neural network training advice paper. It was strictly better than sigmoid for hidden layers in most settings. But it still saturated for large inputs and still caused vanishing gradients in deep networks. The fundamental problem — saturation — was inherent to any bounded smooth function, not specific to sigmoid vs. tanh.",
        },
        {
            year: "2000 – 2010",
            title: "ReLU — The Breakthrough That Made Deep Learning Possible",
            challenge:
                "Through the 2000s, the deep learning community (Hinton, LeCun, Bengio and colleagues) was working on making deep networks trainable. Restricted Boltzmann Machines and greedy layer-wise pretraining (Hinton et al., 2006) were partial solutions but not general ones. Researchers also noticed that neuroscience had moved away from the all-or-nothing firing model: real neurons have rectified linear responses in their rate-coded behaviour — they fire more as the stimulus strengthens, with zero firing for sub-threshold stimuli.",
            what: "Nair and Hinton (2010, ICML) showed that replacing sigmoid with the Rectified Linear Unit <InlineMath tex='f(x) = \\max(0, x)' /> dramatically improved training of deep networks. ReLU's gradient is exactly 1 for positive inputs (no saturation in the positive half) and exactly 0 for negative inputs. This means active neurons pass gradients unchanged — eliminating vanishing gradients for the active half of the network. Training became 6–10× faster than with sigmoid.",
            impact:
                "ReLU was the activation function that made AlexNet possible. Krizhevsky, Sutskever, and Hinton's 2012 ImageNet paper explicitly cited ReLU as a key reason for their 7-layer network's success — several times faster to train than tanh networks. From 2012 onward, ReLU became the default activation for hidden layers in almost every deep network architecture. It remains dominant today, though variants (Leaky ReLU, GELU, SiLU) have refined it.",
        },
        {
            year: "2013 – 2016",
            title: "Leaky ReLU, PReLU, ELU — Fixing the Dying Neuron Problem",
            challenge:
                "ReLU's zero-gradient for negative inputs created a failure mode: if a neuron's weights were initialised badly or received a large negative update, all its inputs might produce negative pre-activations. The neuron would output 0 for every input, receive a gradient of 0 from backprop, and never recover. This 'dying ReLU' problem could silently kill large fractions of a network's neurons — a network with 50% dead neurons was half-wasted.",
            what: "Several variants addressed dying ReLU: Leaky ReLU (Maas et al., 2013) sets <InlineMath tex='f(x) = x' /> for <InlineMath tex='x > 0' /> and <InlineMath tex='f(x) = 0.01x' /> for <InlineMath tex='x \\leq 0' /> — a small gradient in the negative region. PReLU (He et al., 2015) learns the negative slope as a parameter. ELU (Djork-Arné Clevert et al., 2015) uses <InlineMath tex='\\alpha(e^x - 1)' /> for negative inputs — smooth and negative-mean, which helps centre gradients. None became as universally dominant as ReLU itself.",
            impact:
                "These variants showed that ReLU was not the endpoint but a point on a design spectrum. The ideal activation function would be: non-saturating for positive inputs (no vanishing gradient), with a small but non-zero gradient for negative inputs (no dying neurons), smooth (for well-behaved gradient flow), and computationally cheap. No single function perfectly satisfies all these criteria — hence the continued proliferation of variants.",
        },
        {
            year: "2016 – present",
            title: "GELU, SiLU and the Transformer Era",
            challenge:
                "The rise of Transformer architectures (Vaswani et al., 2017) opened a new round of activation function research. Transformers needed activations in their feed-forward sub-layers that would work well at very large scale (billions of parameters), train stably with Adam optimisers, and compose well with layer normalisation. ReLU's non-smooth derivative at zero became a concern as researchers observed that smooth activations sometimes generalised better on language tasks.",
            what: "The Gaussian Error Linear Unit (GELU, Hendrycks and Gimpel, 2016) approximates the expected value of a ReLU applied to a Gaussian random variable: <InlineMath tex='\\text{GELU}(x) = x \\cdot \\Phi(x)' /> where <InlineMath tex='\\Phi' /> is the standard Gaussian CDF. In practice approximated as <InlineMath tex='0.5x(1 + \\tanh(\\sqrt{2/\\pi}(x + 0.044715 x^3)))' />. SiLU (or Swish), proposed independently by multiple groups, is <InlineMath tex='x \\cdot \\sigma(x)' /> — the product of the input with its sigmoid. Both are smooth, non-monotonic, and bounded below.",
            impact:
                "GELU is used in BERT, GPT-2, GPT-3, and most subsequent large language models. SiLU appears in EfficientNet and many recent vision models. The shift from ReLU to GELU in the Transformer era is subtle — GELU outperforms ReLU by a small margin that nonetheless accumulates significantly at scale. The era of treating activation function choice as a fixed hyperparameter is over: modern neural architecture search routinely includes activation function as a searchable design dimension.",
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

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Why does a network need squishing functions?</h2>

            <Analogy label="The Step Function — All or Nothing">
                The very first artificial neurons were simple: if the input signal was strong enough, fire (output 1). If not, stay quiet (output 0). Like a light switch — fully on or fully off.
                <br /><br />
                This is called a <strong>step function</strong>. It matched how real neurons seemed to work (all-or-nothing action potentials). But it had a fatal flaw for learning: its "slope" is either 0 (flat on both sides) or undefined (at the threshold). Backpropagation needs a slope to figure out which direction to nudge the weights. A step function provides no information at all.
            </Analogy>

            <Analogy label="The Sigmoid — A Soft Light Dimmer">
                The sigmoid function is the step function's smoother cousin. Instead of snapping instantly from 0 to 1, it glides gradually — spending most of its time near 0 for very negative inputs and near 1 for very positive inputs, with a smooth S-shaped curve in between.
                <br /><br />
                Think of it as a <em>dimmer switch</em> rather than a light switch. It still squashes all possible inputs into the range (0, 1), but it does so smoothly. Every point on the curve has a well-defined slope — which means backpropagation always has a signal to work with. This is why sigmoid was the default activation for the entire 1986–2010 era.
                <br /><br />
                The problem: for very large positive or negative inputs, the sigmoid saturates — it gets almost perfectly flat. A slope near zero means "I don't know which direction to adjust" — which is almost as bad as the step function.
            </Analogy>

            <Analogy label="ReLU — The Bouncer With a Rule">
                The Rectified Linear Unit has a beautifully simple rule: if the input is positive, pass it straight through unchanged. If negative, output zero.
                <br /><br />
                Like a bouncer at a club: "Are you positive? Come through exactly as you are. Are you negative? Zero admission."
                <br /><br />
                For positive inputs, the gradient is exactly 1 — the signal passes through perfectly, no weakening. For negative inputs, the gradient is 0 — the neuron is off. This means ReLU never weakens the gradient for active neurons, solving the vanishing gradient problem that plagued sigmoid networks.
                <br /><br />
                The catch: if a neuron gets stuck with all-negative inputs, it stays permanently silent. The "dying ReLU" problem. Leaky ReLU fixes this by letting a tiny signal through even for negative inputs.
            </Analogy>

            <Analogy label="Why Non-Linearity Matters — The Stacking Paradox">
                Here's a puzzle: if each layer in a neural network is just a matrix multiplication (a linear transformation), what do you get when you stack two linear layers?
                <br /><br />
                Another linear transformation. Matrix times matrix equals matrix. No matter how many linear layers you stack, the whole thing collapses to a single linear transformation. Depth buys you nothing.
                <br /><br />
                Activation functions break this collapse. After each linear layer, you apply a non-linear function. The composition of linear and non-linear is genuinely more complex than a single linear function. This is the entire point of activation functions: without them, neural networks are just fancy linear regression.
            </Analogy>

            <Analogy label="GELU and the Modern Era — Smooth with a Purpose">
                Modern large language models (GPT, BERT) use GELU — the Gaussian Error Linear Unit. It's like a smooth, smart version of ReLU: it mutes small negative values, passes large positive values unchanged, and has a gentle, smooth transition between the two.
                <br /><br />
                The formula involves the standard Gaussian curve (bell curve), which seems exotic but turns out to work remarkably well at scale. The difference between ReLU and GELU is subtle — a fraction of a percent on most small tasks — but accumulates meaningfully when training models with hundreds of billions of parameters.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The main activation functions</h2>

            <h3>Sigmoid</h3>
            <MathBlock tex="\sigma(x) = \frac{1}{1 + e^{-x}}, \qquad \sigma'(x) = \sigma(x)\bigl(1 - \sigma(x)\bigr)" />
            <p>
                Output range: (0, 1). Maximum gradient: 0.25 (at x = 0). Saturates for large |x|, causing vanishing gradients in deep networks. Used in output layers for binary classification. Historically dominant in hidden layers from 1986 to ~2010.
            </p>

            <h3>Hyperbolic tangent</h3>
            <MathBlock tex="\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}} = 2\sigma(2x) - 1, \qquad \tanh'(x) = 1 - \tanh^2(x)" />
            <p>
                Output range: (-1, 1). Zero-centred: mean output is 0, which reduces bias in weight updates for the next layer. Maximum gradient: 1.0 (at x = 0). Still saturates for large |x| but has stronger gradients than sigmoid. Preferred over sigmoid for hidden layers when both are available. Used in LSTM gates.
            </p>

            <h3>ReLU — Rectified Linear Unit</h3>
            <MathBlock tex="\text{ReLU}(x) = \max(0, x) = \begin{cases} x & x > 0 \\ 0 & x \leq 0 \end{cases}" />
            <p>
                Gradient: 1 for x &gt; 0, 0 for x &lt; 0 (undefined at 0, set to 0 in practice). Does not saturate for positive inputs — gradient is always exactly 1, preventing vanishing gradients in active neurons. Computationally trivial. Default choice for deep network hidden layers since 2012.
            </p>

            <h3>Leaky ReLU and GELU</h3>
            <MathBlock tex="\text{Leaky ReLU}(x) = \begin{cases} x & x > 0 \\ 0.01x & x \leq 0 \end{cases}" />
            <MathBlock tex="\text{GELU}(x) \approx 0.5x\!\left(1 + \tanh\!\left(\sqrt{2/\pi}\,(x + 0.044715x^3)\right)\right)" />
            <p>
                Leaky ReLU prevents dying neurons by allowing a small gradient (0.01) for negative inputs. GELU — used in BERT and GPT models — is a smooth, non-monotonic function: it slightly suppresses near-zero inputs and passes large positive inputs unchanged. Its non-monotonicity gives it richer representational capacity than ReLU.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Design principles:</strong> a good activation function should be (1) non-linear — otherwise layers collapse; (2) differentiable almost everywhere — for backpropagation; (3) non-saturating for at least some inputs — to prevent vanishing gradients; (4) computationally cheap — called millions of times per training step. ReLU satisfies all four. GELU trades computational simplicity for smoother gradient flow.
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

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Formal properties of activation functions</h2>

            <DefBlock label="Required properties for backprop">
                An activation function <InlineMath tex="\sigma: \mathbb{R} \to \mathbb{R}" /> must satisfy:
                <ol style={{ marginTop: "8px" }}>
                    <li><strong>Differentiable almost everywhere</strong> — needed for gradient computation via the chain rule</li>
                    <li><strong>Non-constant</strong> — otherwise all outputs are the same regardless of input</li>
                    <li><strong>Non-polynomial (for UAT)</strong> — Leshno et al. (1993) proved that a network with any non-polynomial activation is a universal approximator; polynomial activations fail this</li>
                </ol>
                Together, these ensure the chain rule applies and backpropagation produces meaningful gradients.
            </DefBlock>

            <h3>Gradient magnitudes in deep sigmoid networks</h3>
            <p>
                For a network with <em>L</em> hidden layers and sigmoid activations, the gradient of the loss w.r.t. the first layer is a product of <em>L</em> Jacobian factors:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial z^{(1)}} = \prod_{l=1}^{L} \left(\text{diag}\!\left(\sigma'(z^{(l)})\right) W^{(l+1)\top}\right) \cdot \frac{\partial L}{\partial z^{\text{out}}}" />
            <p>
                Since <InlineMath tex="0 < \sigma'(x) \leq 0.25" /> for sigmoid, each factor of <InlineMath tex="\text{diag}(\sigma')" /> contracts the gradient by at least 4×. After 10 layers: gradient ≤ (0.25)<sup>10</sup> ≈ 10<sup>-6</sup>. The first layer receives essentially no learning signal.
            </p>

            <h3>ReLU gradient geometry</h3>
            <p>
                ReLU partitions the input space into two regions:
            </p>
            <ul>
                <li><strong>Active region</strong> (x &gt; 0): gradient = 1, input passes through unchanged</li>
                <li><strong>Dead region</strong> (x &lt; 0): gradient = 0, no learning signal</li>
            </ul>
            <p>
                At x = 0, the function is not differentiable in the classical sense. In practice, frameworks set the subgradient to 0 at x = 0. The subgradient satisfies all conditions needed for backprop to converge — the set of non-differentiable points has measure zero and is rarely encountered in floating-point arithmetic.
            </p>

            <h3>GELU derivation</h3>
            <p>
                GELU is defined as <InlineMath tex="\text{GELU}(x) = x \cdot P(Z \leq x)" /> where <InlineMath tex="Z \sim \mathcal{N}(0,1)" />. This is the expected value of a ReLU applied to a Gaussian-scaled input:
            </p>
            <MathBlock tex="\text{GELU}(x) = x \cdot \Phi(x) = x \cdot \frac{1}{2}\left[1 + \text{erf}\!\left(\frac{x}{\sqrt{2}}\right)\right]" />
            <p>
                The gradient is <InlineMath tex="\Phi(x) + x \cdot \phi(x)" /> where <InlineMath tex="\phi" /> is the Gaussian PDF. This is always positive for large positive <em>x</em>, slightly negative for <em>x</em> near -0.75, then approaches 0 for very negative <em>x</em> — the non-monotonic shape that distinguishes GELU from ReLU.
            </p>

            <div className="ch-callout">
                <strong>Why ReLU still wins on speed:</strong> GELU requires evaluating erf or its tanh approximation — multiple floating-point operations. ReLU is a single max(0, x) — a comparison and a conditional copy. On modern GPUs, activation functions are memory-bound (data movement dominates), so ReLU's throughput advantage is smaller than expected. But for trillion-parameter models, every operation counts.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── NumPy implementations ─────────────────────────────────────────────────────
x = np.linspace(-5, 5, 300)

def sigmoid_np(x):   return 1 / (1 + np.exp(-x))
def tanh_np(x):      return np.tanh(x)
def relu_np(x):      return np.maximum(0, x)
def leaky_relu(x, a=0.01): return np.where(x > 0, x, a * x)
def gelu_np(x):
    # Tanh approximation (used in most frameworks)
    return 0.5 * x * (1 + np.tanh(np.sqrt(2/np.pi) * (x + 0.044715 * x**3)))

# Gradients (analytic)
def sigmoid_grad(x): s = sigmoid_np(x); return s * (1 - s)
def tanh_grad(x):    return 1 - np.tanh(x)**2
def relu_grad(x):    return (x > 0).astype(float)
def gelu_grad(x):
    from scipy.stats import norm
    return norm.cdf(x) + x * norm.pdf(x)   # Phi(x) + x*phi(x)

print("Gradient magnitudes at key x values:")
print(f"{'Function':>12} | x=-3   | x=-1   | x= 0   | x= 1   | x= 3")
print("-" * 65)
for name, g in [("sigmoid", sigmoid_grad), ("tanh", tanh_grad),
                ("relu", relu_grad), ("gelu", gelu_grad)]:
    vals = [g(xi) for xi in [-3, -1, 0, 1, 3]]
    print(f"{name:>12} | " + " | ".join(f"{v:6.4f}" for v in vals))

# ── PyTorch: compare convergence speed with different activations ──────────────
def train_and_time(activation_fn, X, y, epochs=5000, lr=0.1):
    import time
    model = nn.Sequential(
        nn.Linear(2, 16), activation_fn(),
        nn.Linear(16, 16), activation_fn(),
        nn.Linear(16, 1), nn.Sigmoid(),
    )
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    t0 = time.time()
    for _ in range(epochs):
        loss = nn.functional.binary_cross_entropy(model(X), y)
        opt.zero_grad(); loss.backward(); opt.step()
    elapsed = time.time() - t0
    final_loss = nn.functional.binary_cross_entropy(model(X), y).item()
    return elapsed, final_loss

X = torch.tensor([[0,0],[0,1],[1,0],[1,1]], dtype=torch.float32)
y = torch.tensor([[0],[1],[1],[0]], dtype=torch.float32)
torch.manual_seed(42)

print("\\nConvergence comparison on XOR (5000 epochs):")
for name, act in [("Sigmoid", nn.Sigmoid), ("Tanh", nn.Tanh),
                  ("ReLU", nn.ReLU), ("GELU", nn.GELU)]:
    torch.manual_seed(42)
    t, loss = train_and_time(act, X, y)
    print(f"  {name:>8}: final_loss={loss:.5f}  time={t:.3f}s")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of all major activation functions and their analytic gradients,
                plus a PyTorch convergence comparison on XOR. The gradient table makes sigmoid's
                saturation problem concrete: at x = 3, sigmoid's gradient is only 0.0452 — a 22x
                reduction from maximum, compounding with each layer.
            </p>
            <CodeBlock code={PY_CODE} filename="activations.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>What to look for:</strong> in the gradient table, ReLU has gradient 1.0 at
                x = 1 and x = 3 — no decay. Sigmoid has 0.197 at x = 1 and 0.045 at x = 3. In
                a 10-layer network, sigmoid's gradient at x = 3 compounds to (0.045)<sup>10</sup> &#8776; 10<sup>-13</sup>.
                That is the vanishing gradient problem in numbers.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const ACTIVATION_FUNCTIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
