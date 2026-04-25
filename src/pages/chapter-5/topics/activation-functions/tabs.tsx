import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

function HistoryTab() {
    return (
        <>
            <h2>From biological inspiration to mathematical necessity</h2>

            <h3>1960s – 1980s: Sigmoid dominance</h3>
            <p>
                The sigmoid function <InlineMath tex="\sigma(x) = 1/(1+e^{-x})" /> dominated early neural networks for three reasons: it was biologically inspired (firing rates), smoothly differentiable, and had a nice gradient <InlineMath tex="\sigma'(x) = \sigma(x)(1-\sigma(x))" />. The McCulloch-Pitts neuron used hard thresholds; the sigmoid was its smooth counterpart.
            </p>

            <h3>The vanishing gradient roots</h3>
            <p>
                The sigmoid's output is in (0, 1), and its maximum gradient is only 0.25 (at x=0). When sigmoid activations are composed in deep networks, gradients shrink exponentially as they propagate backwards. This became the central pathology of deep MLPs in the 1990s.
            </p>

            <h3>tanh: the zero-centered alternative</h3>
            <p>
                The hyperbolic tangent <InlineMath tex="\tanh(x) = (e^x - e^{-x})/(e^x + e^{-x})" /> was introduced as an improvement: its output ranges from −1 to +1 (zero-centered), and its gradient is stronger (max 1.0 at x=0). LSTMs (1997) used tanh in their gates for this reason. However, tanh still suffers from saturation.
            </p>

            <h3>2010: ReLU changes everything</h3>
            <p>
                Nair & Hinton (2010) showed that Rectified Linear Units <InlineMath tex="f(x) = \max(0, x)" /> dramatically outperformed sigmoid/tanh in deep networks. Dying ReLU problem (neurons that output 0 for all inputs) led to Leaky ReLU and PReLU variants. By 2015, ReLU and its variants were standard in nearly all deep networks.
            </p>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why does a network need squishing functions?</h2>

            <Analogy label="The Sigmoid — A Soft Light Dimmer">
                A neuron in real life fires or doesn't fire (all-or-nothing). The sigmoid function is like a <em>smooth dimmer switch</em>: instead of snapping instantly from off to on, it glides gradually from 0 to 1 as the signal gets stronger.
                <br /><br />
                It's differentiable everywhere (unlike a real neuron's step function), which is exactly what backpropagation needs.
            </Analogy>

            <Analogy label="ReLU — The On/Off Switch">
                The Rectified Linear Unit is the simplest possible non-linearity: if the signal is positive, pass it through unchanged; if it's negative, shut it off (output 0).
                <br /><br />
                Think of it like a bouncer: "are you on the guest list? Come in. Are you not? Get out." No partial credit, no smooth transition.
            </Analogy>

            <Analogy label="Why Non-Linearity Matters">
                Imagine stacking two linear transformations: <em>Linear 1 → Linear 2</em>. What does this simplify to? Just <em>another linear transformation</em>. You gained nothing from the extra layer!
                <br /><br />
                Non-linear activation functions break this chain. They make each layer <em>genuinely different</em> from the one before it. Without them, 100 layers = 1 layer.
            </Analogy>

            <Analogy label="Dead Neurons — When ReLU Goes Too Far">
                Sometimes a ReLU neuron's weights change so much that every input gives a negative output — so it always outputs 0. It's permanently "dead." The neuron still contributes a gradient of 0 to backprop, so it never recovers.
                <br /><br />
                Leaky ReLU fixes this by letting a tiny positive signal through even for negative inputs.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The main activation functions</h2>

            <h3>Sigmoid</h3>
            <MathBlock tex="\sigma(x) = \frac{1}{1 + e^{-x}}" />
            <p>
                Output range: (0, 1). Gradient: <InlineMath tex="\sigma'(x) = \sigma(x)(1 - \sigma(x))" />.
                Maximum gradient = 0.25. Saturates for large |x|. Historically common in output layers for binary classification.
            </p>

            <h3>Hyperbolic tangent (tanh)</h3>
            <MathBlock tex="\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}" />
            <p>
                Output range: (−1, +1). Zero-centered (better than sigmoid for hidden layers).
                Gradient: <InlineMath tex="\tanh'(x) = 1 - \tanh^2(x)" />. Max gradient = 1.0.
            </p>

            <h3>ReLU (Rectified Linear Unit)</h3>
            <MathBlock tex="f(x) = \max(0, x) = \begin{cases} x & x > 0 \\ 0 & x \leq 0 \end{cases}" />
            <p>
                Computationally trivial. Doesn&apos;t saturate for positive inputs. Gradient is 1 for x &gt; 0, 0 for x ≤ 0. The default choice for modern deep networks.
            </p>

            <h3>Leaky ReLU</h3>
            <MathBlock tex="f(x) = \begin{cases} x & x > 0 \\ 0.01x & x \leq 0 \end{cases}" />
            <p>
                Prevents dead neurons by allowing a small gradient (typically α=0.01) for negative inputs.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Rule of thumb (pre-2015):</strong> use tanh in hidden layers for symmetric zero-centered activations.
                <strong>Rule of thumb (2015–present):</strong> default to ReLU. Only use sigmoid for binary classification output layers.
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
            <h2>Formal properties of activation functions</h2>

            <DefBlock label="Required properties for backprop">
                An activation function <InlineMath tex="\sigma: \mathbb{R} \to \mathbb{R}" /> must satisfy:
                <ol style={{ marginTop: "8px" }}>
                    <li><strong>Differentiable</strong> (almost everywhere) — needed for gradient computation</li>
                    <li><strong>Non-constant</strong> — otherwise layers are degenerate</li>
                    <li><strong>Monotonic</strong> — ensures the loss landscape has useful structure</li>
                </ol>
                Together, these ensure the chain rule applies and backprop produces meaningful gradients.
            </DefBlock>

            <h3>Gradient magnitudes in deep sigmoid networks</h3>
            <p>
                For a network with <em>L</em> sigmoid layers, the gradient of the loss w.r.t. the first layer's pre-activation is:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial z^{(1)}} = \frac{\partial L}{\partial a^{(L)}} \prod_{l=1}^{L} \sigma'(z^{(l)}) W^{(l+1)\top}" />
            <p>
                Since <InlineMath tex="0 < \sigma'(x) \leq 0.25" /> for sigmoid, and <InlineMath tex="\|W^{(l+1)\top}\|" /> is typically around 1, each multiplicative factor reduces the gradient by at least 4×. After 10 layers: gradient ≤ (0.25)<sup>10</sup> ≈ 10<sup>−6</sup> of the original.
            </p>

            <h3>ReLU gradient geometry</h3>
            <p>
                The ReLU's derivative is 0 for x &lt; 0 (dead region) and 1 for x &gt; 0 (active region). At x = 0, it's undefined — in practice, subgradient <InlineMath tex="\partial f(0)/\partial x \in [0, 1]" /> (commonly set to 0).
            </p>

            <div className="ch-callout">
                <strong>Why ReLU helps:</strong> positive inputs pass gradients unchanged (no vanishing for active neurons), and the function is computationally trivial. The combination of non-saturation and speed is why it replaced sigmoid/tanh so quickly.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5, 5, 300)

# ── Activation functions ─────────────────────────────────────────────────────
sigmoid = 1 / (1 + np.exp(-x))
tanh    = np.tanh(x)
relu    = np.maximum(0, x)
leaky   = np.where(x > 0, x, 0.01 * x)

# ── Gradients (analytic) ─────────────────────────────────────────────────────
sigmoid_g = sigmoid * (1 - sigmoid)
tanh_g    = 1 - tanh**2
relu_g    = (x > 0).astype(float)
leaky_g   = np.where(x > 0, 1.0, 0.01)

# ── Quick plot ────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
labels = ["Sigmoid", "Tanh", "ReLU", "Leaky ReLU"]
colors = ["#5a9ab9", "#9b7fc7", "#5ab98c", "#e8a838"]

for ax, (acts, grads, title) in zip(axes, [
    ([sigmoid, tanh, relu, leaky], [sigmoid_g, tanh_g, relu_g, leaky_g], "Activations"),
    ([sigmoid_g, tanh_g, relu_g, leaky_g], [None]*4, "Gradients"),
]):
    for act, c, lbl in zip(acts, colors, labels):
        ax.plot(x, act, color=c, label=lbl, linewidth=2)
    ax.axhline(0, color="#252530", linewidth=1)
    ax.axvline(0, color="#252530", linewidth=1)
    ax.set_title(title, fontsize=14, pad=10)
    ax.set_xlabel("x"); ax.set_ylabel(title)
    ax.legend(); ax.grid(True, alpha=0.2)
    ax.set_xlim(-5, 5)

plt.suptitle("Activation Functions & Their Gradients", fontsize=16)
plt.tight_layout()
plt.savefig("activations.png", dpi=150, facecolor="#0d0d10")
print("Saved activations.png")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy + Matplotlib visualization of sigmoid, tanh, ReLU, and Leaky ReLU — both
                the functions and their gradients. This makes the vanishing gradient problem
                visually obvious: sigmoid's gradient collapses for |x| &gt; 3.
            </p>
            <CodeBlock code={PY_CODE} filename="activations.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>What to look for in the gradient plot:</strong> sigmoid's gradient approaches
                zero for large |x|, while ReLU's is either 0 (dead) or 1 (active). Leaky ReLU
                maintains a small positive gradient even for negative inputs.
            </div>
        </>
    )
}




// ── Tab content map ──────────────────────────────────────────────────────────

export const ACTIVATION_FUNCTIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
