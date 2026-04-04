import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
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
        <div className="ch4-tl-item">
            <div className="ch4-tl-year">{item.year}</div>
            <div className="ch4-tl-title">{item.title}</div>
            <div className="ch4-tl-section-label">The context</div>
            <div className="ch4-tl-body">{item.challenge}</div>
            <div className="ch4-tl-section-label">What was introduced</div>
            <div className="ch4-tl-body">{item.what}</div>
            <div className="ch4-tl-section-label">Why it mattered</div>
            <div className="ch4-tl-body ch4-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1960 – 1974",
            title: "Linnainmaa, Werbos, and the Independent Discovery",
            challenge:
                "After Minsky & Papert's 1969 result, researchers knew that multi-layer networks could theoretically solve XOR — but had no algorithm to train them. The key insight required applying the chain rule of calculus recursively through the network, which nobody had worked out.",
            what: "Seppo Linnainmaa published a general method for automatic differentiation of nested functions in his 1970 master's thesis (University of Helsinki). Paul Werbos independently derived backpropagation in his 1974 Harvard dissertation, specifically targeting neural network training. Neither result was widely noticed at the time.",
            impact:
                "Linnainmaa's work gave the broader optimization community the chain-rule autodiff algorithm. Werbos showed it could train multi-layer networks, but the AI field was in its first winter and the result attracted little interest.",
        },
        {
            year: "1986",
            title: "Rumelhart, Hinton & Williams — Learning Internal Representations",
            challenge:
                "By the mid-1980s, the AI winter was thawing. Researchers had good reasons to believe multi-layer networks were powerful — the universal approximation theorem was known in spirit — but no practical algorithm to train them. Connectionism needed a breakthrough.",
            what: "David Rumelhart, Geoffrey Hinton, and Ronald Williams published 'Learning representations by back-propagating errors' in Nature (1986). They presented backpropagation clearly, showed it could train networks with hidden layers, and demonstrated it on interesting problems (learning past-tense verb inflections and XOR). The key was viewing the chain rule as a communication protocol between layers, not just a mathematical trick.",
            impact:
                "This single paper ended the first AI winter for neural networks. It proved that multi-layer networks could learn non-linear functions automatically. Within a few years, the field split into connectionists (neural networks + backprop) and symbolists (expert systems) — a schism that lasted until the deep learning revolution of 2012.",
        },
        {
            year: "1989",
            title: "LeCun — Backpropagation in Practice",
            challenge:
                "Pure backpropagation was computationally expensive and suffered from local minima. For it to be useful on real problems, researchers needed to understand how to structure networks, initialize weights, and tune hyperparameters.",
            what: "Yann LeCun's team at Bell Labs applied backpropagation to train convolutional neural networks for handwritten zip code recognition (1989), later developing the more complete LeNet architecture (1998). They also introduced the key insight of weight sharing through convolutions to make training tractable.",
            impact:
                "LeCun showed backpropagation wasn't just a toy algorithm — it could solve real pattern recognition problems at human-competitive accuracy. This work was the foundation of computer vision's eventual takeover by deep learning.",
        },
        {
            year: "1998",
            title: "Bottou & LeCun — Online Learning and Large-Scale Training",
            challenge:
                "Batch backpropagation (computing gradients over the entire dataset) was prohibitively slow for large datasets. Practical applications needed a way to learn incrementally.",
            what: "Léon Bottou and Yann LeCun formalized stochastic (online) backpropagation: update weights after each sample (or small mini-batch). They proved convergence properties and demonstrated it on large-scale problems. This became the standard training procedure for all neural networks.",
            impact:
                "Online learning made it possible to train on datasets that couldn't fit in memory. Every modern deep learning framework uses mini-batch stochastic gradient descent — a direct descendant of this work.",
        },
    ]

    return (
        <div className="ch4-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>How does a neural network learn from its mistakes?</h2>

            <Analogy label="The Blame Game">
                Imagine you're playing a game where you have to guess a secret number. Your friend tells you every time you're wrong — but not just "wrong", they tell you <em>how</em> wrong and <em>which part</em> of your guess was responsible.
                <br /><br />
                That's exactly what <strong>backpropagation</strong> does. When the network makes a mistake at the end, it works backwards through every layer to figure out how much each part contributed to the error — like tracing a leak back to its source.
            </Analogy>

            <Analogy label="Passing Blame Up the Chain">
                Think of a relay race where the baton drops. The last runner says: "I dropped it because you passed it too slowly." That runner tells the second runner: "You made me rush." And so on backwards.
                <br /><br />
                Backpropagation is the same idea: the <em>output layer</em> says "the middle layer contributed X% to my error", the middle layer tells the <em>input layer</em> "you contributed Y%", and everyone adjusts accordingly.
            </Analogy>

            <Analogy label="The Chain Rule — Your Teacher's Secret Weapon">
                Remember the chain rule from calculus? "Derivative of the outside × derivative of the inside." Backpropagation is just the chain rule applied over and over — once for every layer. Each neuron gets a <strong>gradient</strong>: a number telling it which direction and how much to change its weights to reduce the error.
            </Analogy>

            <Analogy label="Why It Took So Long">
                The idea of backpropagation wasn't <em>invented</em> in 1986 — parts of it existed earlier. The breakthrough was realising it could train <em>hidden layers</em>, not just the output. Minsky had killed single-layer perceptrons; backprop brought them back to life with extra layers stacked on top.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Backpropagation: the chain rule in a loop</h2>

            <h3>Forward pass</h3>
            <p>
                Given input <strong>x</strong>, each layer computes its output as
                <InlineMath tex="z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}" /> and
                <InlineMath tex="a^{(l)} = \sigma(z^{(l)})" />,
                where <InlineMath tex="\sigma" /> is the activation function.
                The final output <InlineMath tex="\hat{y}" /> is compared to the true label using a loss <InlineMath tex="L(y, \hat{y})" />.
            </p>

            <h3>Backward pass — the chain rule</h3>
            <p>
                Backprop computes how much each weight contributed to the error by applying the chain rule layer by layer. Starting from the output:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial W^{(L)}} = \frac{\partial L}{\partial a^{(L)}} \cdot \frac{\partial a^{(L)}}{\partial z^{(L)}} \cdot \frac{\partial z^{(L)}}{\partial W^{(L)}}" />
            <p>
                This pattern repeats for each layer, propagating the error signal backwards. The gradient of the loss with respect to layer <em>l</em>'s pre-activation is:
            </p>
            <MathBlock tex="\delta^{(l)} = (W^{(l+1)})^\top \delta^{(l+1)} \odot \sigma'(z^{(l)})" />
            <p>
                where <InlineMath tex="\odot" /> is element-wise multiplication (Hadamard product), and <InlineMath tex="\delta^{(L)} = \nabla_a L \odot \sigma'(z^{(L)})" />.
            </p>

            <h3>Weight update</h3>
            <p>
                Once gradients are computed, weights are updated in the opposite direction of the gradient:
            </p>
            <MathBlock tex="W^{(l)} \leftarrow W^{(l)} - \eta\, \frac{\partial L}{\partial W^{(l)}}" />
            <p>
                where <InlineMath tex="\eta" /> is the learning rate. This is gradient descent applied to each weight individually.
            </p>

            <hr className="ch4-sep" />

            <div className="ch4-callout">
                <strong>The efficiency insight:</strong> naive computation of each weight's gradient would require a forward pass per weight. Backprop reuses computed gradients across layers, making a full gradient computation cost roughly the same as a single forward pass — about 2× the forward pass total.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal derivation of backpropagation</h2>

            <DefBlock label="Loss Function">
                The loss <InlineMath tex="L: \mathbb{R}^K \times \mathbb{R}^K \to \mathbb{R}" /> measures the discrepancy between the network's prediction <InlineMath tex="\hat{y} = f(\mathbf{x}; \mathbf{W})" /> and the true label <strong>y</strong>. Common choices: mean squared error <InlineMath tex="L = \frac{1}{2}\|y - \hat{y}\|^2" /> for regression; cross-entropy <InlineMath tex="L = -\sum_k y_k \log \hat{y}_k" /> for classification.
            </DefBlock>

            <h3>Two-phase computation</h3>
            <p>
                A network with <em>L</em> layers computes the function composition:
            </p>
            <MathBlock tex="f(\mathbf{x}; \mathbf{W}) = \sigma_L(W^{(L)} \sigma_{L-1}(W^{(L-1)} \cdots \sigma_1(W^{(1)}\mathbf{x} + b^{(1)}) \cdots + b^{(L-1)}) + b^{(L)})" />
            <p>
                <strong>Forward pass</strong>: compute all intermediate activations <InlineMath tex="z^{(l)}, a^{(l)}" /> for each layer <em>l</em>.
            </p>
            <p>
                <strong>Backward pass</strong>: compute gradients from the loss outward using the chain rule.
            </p>

            <h3>Gradient at the output layer</h3>
            <p>
                For MSE loss with softmax output, the gradient at layer <em>L</em> is simply:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial z^{(L)}} = \hat{y} - y" />
            <p>
                This elegant result — the prediction minus the truth — is why cross-entropy + softmax is such a natural pairing: the gradient has no dependence on the softmax derivative.
            </p>

            <h3>Recursive delta rule</h3>
            <p>
                For any hidden layer <em>l</em> (where <InlineMath tex="l < L" />):
            </p>
            <MathBlock tex="\delta^{(l)} = \frac{\partial L}{\partial z^{(l)}} = (W^{(l+1)})^\top \delta^{(l+1)} \odot \sigma'(z^{(l)})" />
            <p>
                The error signal <InlineMath tex="\delta^{(l)}" /> is the downstream error weighted by the transposed weight matrix, then scaled by the local gradient of the activation function. This is the core recursive equation of backpropagation.
            </p>

            <h3>Weight gradients</h3>
            <p>
                Once <InlineMath tex="\delta^{(l)}" /> is known, the weight gradient is:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial W^{(l)}} = \delta^{(l)} (a^{(l-1)})^\top" />
            <MathBlock tex="\frac{\partial L}{\partial b^{(l)}} = \delta^{(l)}" />
            <p>
                All gradients are accumulated over the training set (or mini-batch), then applied.
            </p>

            <div className="ch4-callout">
                <strong>Computational complexity:</strong> backprop performs <em>O(L)</em> sequential chain-rule steps (one per layer), each involving matrix multiplications of size determined by layer widths. The total is <InlineMath tex="O(\sum_l n_l \cdot n_{l-1})" /> — roughly proportional to the number of weights, which is why deeper networks need more computation.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Sigmoid activation and its derivative ───────────────────────────────────
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def sigmoid_grad(z):
    s = sigmoid(z)
    return s * (1 - s)

# ── MSE loss ─────────────────────────────────────────────────────────────────
def mse(y_true, y_pred):
    return 0.5 * np.mean((y_true - y_pred) ** 2)

# ── Tiny MLP: 2-input, 1 hidden (4 units), 1 output ──────────────────────────
# Forward pass
def forward(X, W1, b1, W2, b2):
    # Hidden layer
    z1 = X @ W1.T + b1          # (batch, 4)
    a1 = sigmoid(z1)            # (batch, 4)
    # Output layer
    z2 = a1 @ W2.T + b2         # (batch, 1)
    a2 = sigmoid(z2)            # (batch, 1)
    return z1, a1, z2, a2

# Backward pass (backpropagation)
def backward(X, y, z1, a1, z2, a2, W2):
    batch = X.shape[0]

    # Output layer gradient: δ^(L) = (ŷ - y) ⊙ σ'(z^(L))
    delta2 = (a2 - y) * sigmoid_grad(z2)   # (batch, 1)

    # Gradient of loss w.r.t. W2, b2
    grad_W2 = (delta2.T @ a1) / batch       # (1, 4)
    grad_b2 = delta2.mean(axis=0)            # (1,)

    # Hidden layer gradient: δ^(l) = (W^(l+1))ᵀ δ^(l+1) ⊙ σ'(z^(l))
    delta1 = (delta2 @ W2) * sigmoid_grad(z1)  # (batch, 4)

    # Gradient of loss w.r.t. W1, b1
    grad_W1 = (delta1.T @ X) / batch          # (4, 2)
    grad_b1 = delta1.mean(axis=0)              # (4,)

    return grad_W1, grad_b1, grad_W2, grad_b2

# ── Train the tiny MLP ───────────────────────────────────────────────────────
np.random.seed(42)
W1 = np.random.randn(4, 2) * 0.5   # 4 hidden units, 2 inputs
b1 = np.zeros(4)
W2 = np.random.randn(1, 4) * 0.5  # 1 output
b2 = np.zeros(1)

# XOR data
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)

lr = 1.5
for epoch in range(15000):
    z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
    loss = mse(y, a2)
    gW1, gb1, gW2, gb2 = backward(X, y, z1, a1, z2, a2, W2)

    # Gradient descent update
    W1 -= lr * gW1;  b1 -= lr * gb1
    W2 -= lr * gW2;  b2 -= lr * gb2

    if epoch % 3000 == 0:
        print(f"Epoch {epoch:5d} | Loss: {loss:.5f}")

# ── Final predictions ────────────────────────────────────────────────────────
_, _, _, a2_final = forward(X, W1, b1, W2, b2)
print("\\nFinal predictions:")
for i in range(4):
    print(f"  Input {[int(x) for x in X[i]]} -> {a2_final[i,0]:.4f} (target: {int(y[i,0])})")`

function PythonTab() {
    return (
        <>
            <p>
                Pure NumPy implementation of backpropagation for a 2→4→1 MLP trained on XOR.
                XOR requires a hidden layer — this is exactly the problem Minsky proved a single perceptron couldn't solve.
            </p>
            <CodeBlock code={PY_CODE} filename="backprop.py" lang="python" langLabel="Python" />
            <div className="ch4-callout">
                <strong>What you're seeing:</strong> after ~15,000 epochs, the network learns XOR —
                something impossible for a single perceptron. The hidden layer's 4 units discover
                an internal representation that makes the problem linearly separable in the hidden space.
            </div>
        </>
    )
}

const TS_CODE = `// ── Backpropagation for a tiny 2→4→1 MLP ──────────────────────────────────
type Mat = number[][];
type Vec = number[];

function sigmoid(z: number): number {
  const clipped = Math.max(-500, Math.min(500, z));
  return 1 / (1 + Math.exp(-clipped));
}

function sigmoidGrad(z: number): number {
  const s = sigmoid(z);
  return s * (1 - s);
}

function matMul(A: Mat, B: Mat): Mat {
  return A.map(row => B[0].map((_, j) =>
    row.reduce((sum, a, i) => sum + a * B[i][j], 0)
  ));
}

function matVecMul(A: Mat, v: Vec): Vec {
  return A.map(row => row.reduce((s, a, i) => s + a * v[i], 0));
}

function vecAdd(a: Vec, b: Vec): Vec { return a.map((x, i) => x + b[i]); }
function vecSub(a: Vec, b: Vec): Vec { return a.map((x, i) => x - b[i]); }
function vecScale(v: Vec, s: number): Vec { return v.map(x => x * s); }

function transpose(A: Mat): Mat {
  return A[0].map((_, j) => A.map(row => row[j]));
}

// ── Forward pass ─────────────────────────────────────────────────────────────
function forward(
  x: Vec, W1: Mat, b1: Vec, W2: Mat, b2: Vec
): { z1: Vec; a1: Vec; z2: Vec; a2: Vec } {
  const z1 = vecAdd(matVecMul(W1, x), b1);
  const a1 = z1.map(sigmoid);
  const z2 = [vecAdd(matVecMul(W2, a1), b2)[0]];
  const a2 = [sigmoid(z2[0])];
  return { z1, a1, z2, a2 };
}

// ── Backward pass ────────────────────────────────────────────────────────────
function backward(
  x: Vec, y: number,
  { z1, a1, z2, a2 }: { z1: Vec; a1: Vec; z2: Vec; a2: Vec },
  W2: Mat
): { gW1: Mat; gb1: Vec; gW2: Mat; gb2: Vec } {
  // Output delta: δ^(L) = (ŷ - y) ⊙ σ'(z^(L))
  const delta2 = [(a2[0] - y) * sigmoidGrad(z2[0])];

  // Gradient w.r.t. W2, b2
  const gW2 = transpose([delta2.map(d => d * a1[0]),
                          delta2.map(d => d * a1[1]),
                          delta2.map(d => d * a1[2]),
                          delta2.map(d => d * a1[3])]);
  const gb2 = delta2;

  // Hidden delta: δ^(l) = (W^(l+1))ᵀ δ^(l+1) ⊙ σ'(z^(l))
  const W2t = transpose(W2);
  const delta1 = z1.map((z, i) => sigmoidGrad(z) * (W2t[i][0] * delta2[0]));

  // Gradient w.r.t. W1, b1
  const gW1 = transpose(delta1.map(d => [d * x[0], d * x[1]]));
  const gb1 = delta1;

  return { gW1, gb1, gW2, gb2 };
}

function addMat(A: Mat, B: Mat, lr: number): Mat {
  return A.map((row, i) => row.map((a, j) => a - lr * B[i][j]));
}
function addVec(a: Vec, b: Vec, lr: number): Vec {
  return a.map((x, i) => x - lr * b[i]);
}

// ── Training ──────────────────────────────────────────────────────────────────
const W1: Mat = [[0.5,-0.3],[0.1,0.2],[-0.4,0.5],[0.3,-0.2]];
const b1: Vec = [0, 0, 0, 0];
const W2: Mat = [[0.3,-0.1,0.2,0.1]];
const b2: Vec = [0];

const X: Vec[] = [[0,0],[0,1],[1,0],[1,1]];
const y: number[] = [0, 1, 1, 0];
const lr = 1.0;

for (let epoch = 0; epoch < 15000; epoch++) {
  for (let i = 0; i < 4; i++) {
    const { z1, a1, z2, a2 } = forward(X[i], W1, b1, W2, b2);
    const { gW1, gb1, gW2, gb2 } = backward(X[i], y[i], { z1, a1, z2, a2 }, W2);
    // Update weights
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) W1[r][c] -= lr * gW1[r][c];
    for (let r = 0; r < 4; r++) b1[r] -= lr * gb1[r];
    for (let c = 0; c < 4; c++) W2[0][c] -= lr * gW2[0][c];
    b2[0] -= lr * gb2[0];
  }
  if (epoch % 3000 === 0) {
    const preds = X.map(xi => forward(xi, W1, b1, W2, b2).a2[0]);
    const loss = preds.reduce((s, p, i) => s + 0.5*(p-y[i])**2, 0) / 4;
    console.log(\`Epoch \${epoch} | Loss: \${loss.toFixed(5)}\`);
  }
}

// ── Final predictions ───────────────────────────────────────────────────────
console.log("\\nFinal predictions:");
X.forEach((xi, i) => {
  const { a2 } = forward(xi, W1, b1, W2, b2);
  console.log(\`  [\${xi}] -> \${a2[0].toFixed(4)} (target: \${y[i]})\`);
});`

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript backpropagation for a 2→4→1 MLP on XOR.
                No libraries — just arrays, elementary calculus, and the chain rule.
            </p>
            <CodeBlock code={TS_CODE} filename="backprop.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch4-callout">
                <strong>Historical note:</strong> the original 1986 paper computed gradients by hand
                for small networks. Modern frameworks (PyTorch, JAX) compute backprop automatically
                via computational graphs — but they all use the same chain-rule mathematics.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const BACKPROPAGATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
