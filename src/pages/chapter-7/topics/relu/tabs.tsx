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
        <div className="ch7-tl-item">
            <div className="ch7-tl-year">{item.year}</div>
            <div className="ch7-tl-title">{item.title}</div>
            <div className="ch7-tl-section-label">The context</div>
            <div className="ch7-tl-body">{item.challenge}</div>
            <div className="ch7-tl-section-label">What was introduced</div>
            <div className="ch7-tl-body">{item.what}</div>
            <div className="ch7-tl-section-label">Why it mattered</div>
            <div className="ch7-tl-body ch7-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2010",
            title: "Rectified Linear Units — Nair & Hinton",
            challenge:
                "Sigmoid and tanh activations were the standard for decades, but they suffered from the vanishing gradient problem. As networks got deeper, gradients became smaller and smaller, making training impossible.",
            what:
                "Vinod Nair and Geoffrey Hinton introduced the Rectified Linear Unit (ReLU): f(x) = max(0, x). Simple, efficient, and critically, its derivative is either 0 or 1— no saturation for positive inputs.",
            impact:
                "ReLU became the default activation for deep networks. Training deep CNNs suddenly became possible. AlexNet used ReLU to train 8-layer networks efficiently—unthinkable with sigmoid.",
        },
        {
            year: "2011–2013",
            title: "ReLU Goes Mainstream",
            challenge:
                "Deep networks were still difficult to train. Researchers tried various tricks: careful initialization, unsupervised pretraining, and various activation functions.",
            what:
                "Multiple papers confirmed ReLU's superiority across vision tasks. The sparse activation pattern (many zeros) actually helped prevent overfitting and improved computational efficiency.",
            impact:
                "ReLU became ubiquitous. Every major architecture from 2012 onwards used ReLU or a variant. The deep learning revolution accelerated because training was now 6x faster.",
        },
        {
            year: "2015–2016",
            title: "ReLU Variants—Leaky, PReLU, ELU",
            challenge:
                "The 'dying ReLU' problem: neurons could get stuck with negative inputs, never activating again (gradient = 0). Also, the sharp discontinuity at zero caused optimization issues in some cases.",
            what:
                "Leaky ReLU (Maas et al., 2013): small negative slope (0.01). PReLU (He et al., 2015): learnable negative slope. ELU (Clevert et al., 2015): smooth negative region with mean closer to zero.",
            impact:
                "These variants solved the dying ReLU problem and improved convergence in some networks. While standard ReLU remained most common, practitioners now had tools for stubborn optimization problems.",
        },
    ]

    return (
        <div className="ch7-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>What is ReLU and why is it special?</h2>

            <Analogy label="The On/Off Switch">
                Imagine a neuron as a light switch. Old activation functions were like dimmer switches—always on a little bit, even when they shouldn't be.
                <br /><br />
                ReLU is like a simple switch: <strong>off</strong> (zero) when input is negative, <strong>fully on</strong> (pass through) when input is positive.
            </Analogy>

            <Analogy label="No More Fading">
                Remember the vanishing gradient problem? It's like shouting instructions down a long hallway—the message gets quieter and quieter.
                <br /><br />
                ReLU doesn't fade. When it's on, the signal passes through at full strength. This lets information flow through many layers without getting lost.
            </Analogy>

            <Analogy label="The Dead Battery Problem">
                One downside: if a ReLU neuron always gets negative input, it stays off forever—like a dead battery. This is called "dying ReLU."
                <br /><br />
                Leaky ReLU fixes this by allowing a tiny bit of negative signal through even when "off"—keeping the battery barely alive.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>ReLU: Simple but revolutionary</h2>

            <h3>The problem with sigmoid and tanh</h3>
            <p>
                For decades, neural networks used sigmoid and tanh activations. These squash any input into a fixed range (0 to 1 for sigmoid, -1 to 1 for tanh).
                The problem: as input gets large (positive or negative), the function becomes flat—the derivative approaches zero.
            </p>
            <p>
                During backpropagation, this kills the gradient. Multiply small numbers many times in a deep network, and they become vanishingly small.
                Early layers barely learn anything.
            </p>

            <h3>The ReLU solution</h3>
            <MathBlock tex="\\text{ReLU}(x) = \\max(0, x) = \\begin{cases} x & \text{if } x > 0 \\ 0 & \text{if } x \\leq 0 \\end{cases}" />
            <p>
                The derivative is beautifully simple:
            </p>
            <MathBlock tex="\\frac{d}{dx}\\text{ReLU}(x) = \\begin{cases} 1 & \text{if } x > 0 \\ 0 & \text{if } x < 0 \\end{cases}" />
            <p>
                For positive inputs, gradients flow through unchanged (no vanishing!). For negative inputs, the neuron is inactive. This sparsity is actually beneficial—fewer computations, less overfitting.
            </p>

            <h3>Why it trains faster</h3>
            <ul>
                <li><strong>No expensive exponentials:</strong> ReLU is just a comparison and max operation</li>
                <li><strong>Linear for positive values:</strong> No saturation, gradients don't diminish</li>
                <li><strong>Induces sparsity:</strong> About 50% of neurons are typically inactive</li>
            </ul>

            <hr className="ch7-sep" />

            <div className="ch7-callout">
                <strong>Historical impact:</strong> ReLU made training AlexNet feasible.
                With sigmoid, the 8-layer network would have taken weeks to train.
                ReLU reduced this to days.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>ReLU: Mathematical analysis</h2>

            <DefBlock label="Rectified Linear Unit">
                The ReLU activation function is defined as:
                <MathBlock tex="\\text{ReLU}(x) = \\max(0, x)" />
                It is piecewise linear with a kink at the origin. The subderivative at x = 0 is typically taken as either 0 or 1 (commonly 0 or left undefined for automatic differentiation).
            </DefBlock>

            <h3>Gradient properties</h3>
            <p>
                The gradient of ReLU is:
            </p>
            <MathBlock tex="\\nabla \\text{ReLU}(x) = \\mathbf{1}_{x > 0}" />
            <p>
                where 1 is the indicator function. This is either 0 or 1, never a small fraction. This prevents the multiplicative decay that causes vanishing gradients in sigmoid networks.
            </p>

            <h3>Gating interpretation</h3>
            <p>
                ReLU can be viewed as a gating mechanism. Let z = Wx + b be the pre-activation. Then:
            </p>
            <MathBlock tex="a = \\text{ReLU}(z) = z \\odot \\mathbf{1}_{z > 0}" />
            <p>
                The gate (the indicator) is data-dependent and learned jointly with the weights. This differs from fixed gating in architectures like LSTMs.
            </p>

            <h3>Variants and their derivatives</h3>
            <p><strong>Leaky ReLU:</strong></p>
            <MathBlock tex="f(x) = \\max(\\alpha x, x) = \\begin{cases} x & x > 0 \\ \\alpha x & x \\leq 0 \\end{cases}" />
            <p>
                where α is typically 0.01. Derivative: 1 for x &gt; 0, α for x &lt; 0. This prevents neurons from permanently dying.
            </p>

            <p><strong>Parametric ReLU (PReLU):</strong></p>
            <MathBlock tex="f(x) = \\begin{cases} x & x > 0 \\ \\alpha x & x \\leq 0 \\end{cases}" />
            <p>where α is a learned parameter per channel/neuron.</p>

            <p><strong>Exponential Linear Unit (ELU):</strong></p>
            <MathBlock tex="f(x) = \\begin{cases} x & x > 0 \\ \\alpha(e^x - 1) & x \\leq 0 \\end{cases}" />

            <div className="ch7-callout">
                <strong>Why simplicity wins:</strong> Despite many proposed variants,
                standard ReLU remains the default because it is simple, fast, and works
                well in practice. The benefits of more complex activations are often marginal.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Activation Functions ──────────────────────────────────────────────────────
def relu(x):
    """Standard ReLU: max(0, x)"""
    return np.maximum(0, x)

def relu_derivative(x):
    """Derivative of ReLU: 1 if x > 0, else 0"""
    return (x > 0).astype(float)

def leaky_relu(x, alpha=0.01):
    """Leaky ReLU: allows small negative gradient"""
    return np.where(x > 0, x, alpha * x)

def sigmoid(x):
    """Old activation - for comparison"""
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_derivative(x):
    """Derivative of sigmoid: small values cause vanishing gradients"""
    s = sigmoid(x)
    return s * (1 - s)

# ── Compare gradient flow ─────────────────────────────────────────────────────
def compare_gradients():
    print("Comparing gradients for different inputs:")
    print("=" * 50)

    test_inputs = [-5, -1, 0, 1, 5]

    for x in test_inputs:
        sig_grad = sigmoid_derivative(np.array([x]))[0]
        relu_grad = relu_derivative(np.array([x]))[0]
        print(f"x = {x:2d} | sigmoid': {sig_grad:.4f} | relu': {relu_grad:.4f}")

    print("\nNotice: Sigmoid gradients become tiny (vanishing) for large |x|")
    print("ReLU gradients are either 0 or 1 — no vanishing for positive inputs!")

compare_gradients()

# ── Simple forward pass with ReLU ─────────────────────────────────────────────
X = np.random.randn(100, 784)  # 100 samples, 784 features
W = np.random.randn(256, 784) * 0.01
b = np.zeros(256)

# Linear transformation
z = X @ W.T + b  # (100, 256)

# ReLU activation
a = relu(z)  # (100, 256)

print(f"\nPre-activation range: [{z.min():.2f}, {z.max():.2f}]")
print(f"Post-ReLU range: [{a.min():.2f}, {a.max():.2f}]")
print(f"Sparsity: {(a == 0).mean()*100:.1f}% of activations are zero")

# ── Backward pass: gradients flow where ReLU is active ───────────────────────
def backward_pass(dL_da, z):
    """
    dL_da: gradient from next layer
    z: pre-activation (saved from forward pass)
    Returns: dL_dz
    """
    # Gradient flows where ReLU was active (z > 0)
    return dL_da * relu_derivative(z)

# Simulate gradient from next layer
dL_da = np.random.randn(100, 256)
dL_dz = backward_pass(dL_da, z)

print(f"\nGradient magnitude where ReLU active: {np.abs(dL_dz[z > 0]).mean():.4f}")
print(f"Gradient magnitude where ReLU inactive: {np.abs(dL_dz[z <= 0]).mean():.4f}")`;

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation comparing ReLU with sigmoid, demonstrating the vanishing gradient problem.
            </p>
            <CodeBlock code={PY_CODE} filename="relu_demo.py" lang="python" langLabel="Python" />
            <div className="ch7-callout">
                <strong>Key observation:</strong> Sigmoid derivatives become vanishingly small
                for large inputs. ReLU maintains full gradient (1) for all positive activations.
            </div>
        </>
    )
}

const TS_CODE = `// ── ReLU Activation in TypeScript ──────────────────────────────────────────

function relu(x: number): number {
  return Math.max(0, x);
}

function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0;
}

function leakyRelu(x: number, alpha = 0.01): number {
  return x > 0 ? x : alpha * x;
}

function leakyReluDerivative(x: number, alpha = 0.01): number {
  return x > 0 ? 1 : alpha;
}

// ── Vectorized versions ──────────────────────────────────────────────────────
function reluVec(x: number[]): number[] {
  return x.map(v => Math.max(0, v));
}

function reluDerivativeVec(x: number[]): number[] {
  return x.map(v => v > 0 ? 1 : 0);
}

// ── Compare with Sigmoid ─────────────────────────────────────────────────────
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
}

function sigmoidDerivative(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

// Demonstrate vanishing gradient problem
console.log("Vanishing gradient comparison:");
console.log("Input | Sigmoid' | ReLU'");
console.log("-".repeat(30));

const testInputs = [-5, -2, -1, 0, 1, 2, 5];
for (const x of testInputs) {
  const sigGrad = sigmoidDerivative(x);
  const reluGrad = reluDerivative(x);
  console.log(\`\${x.toString().padStart(5)} | \${sigGrad.toFixed(4).padStart(8)} | \${reluGrad.toString().padStart(5)}\`);
}

// ── Forward pass through a layer ────────────────────────────────────────────
type Vec = number[];
type Mat = number[][];

function matVecMul(A: Mat, v: Vec): Vec {
  return A.map(row => row.reduce((sum, a, i) => sum + a * v[i], 0));
}

function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x + b[i]);
}

function layerForward(x: Vec, W: Mat, b: Vec): { z: Vec; a: Vec } {
  const z = vecAdd(matVecMul(W, x), b);
  const a = reluVec(z);
  return { z, a };
}

// Example: 5 inputs → 3 outputs
const W: Mat = [[0.1, -0.2, 0.3, 0.0, -0.1],
                [-0.3, 0.2, 0.1, -0.2, 0.3],
                [0.2, 0.1, -0.1, 0.3, -0.2]];
const b: Vec = [0.1, -0.1, 0.0];
const x: Vec = [1.0, -0.5, 0.3, -0.2, 0.8];

const { z, a } = layerForward(x, W, b);
console.log("\nLayer forward pass:");
console.log("Pre-activation (z):", z.map(v => v.toFixed(3)));
console.log("Post-ReLU (a):   ", a.map(v => v.toFixed(3)));
console.log(\`Sparsity: \${a.filter(v => v === 0).length}/\${a.length} neurons inactive\`);

// ── Backward pass ───────────────────────────────────────────────────────────
function layerBackward(dL_da: Vec, z: Vec): Vec {
  // dL_dz = dL_da * relu'(z)
  return dL_da.map((grad, i) => grad * reluDerivative(z[i]));
}

const dL_da: Vec = [0.5, -0.3, 0.8];
const dL_dz = layerBackward(dL_da, z);
console.log("\nBackward pass (gradient flow):");
console.log("dL/da from next layer:", dL_da);
console.log("dL/dz after ReLU:    ", dL_dz);
console.log("Note: Gradients only flow where z > 0");`;

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript implementation of ReLU and variants.
            </p>
            <CodeBlock code={TS_CODE} filename="relu.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch7-callout">
                <strong>Simplicity is power:</strong> ReLU's implementation is just
                Math.max(0, x), yet it solved one of deep learning's biggest obstacles.
            </div>
        </>
    )
}

export const RELU_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
