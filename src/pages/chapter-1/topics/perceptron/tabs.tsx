import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function PerceptronDiagramSVG() {
    return (
        <div style={{ padding: "20px", background: "#17171d" }}>
            <svg viewBox="0 0 520 260" style={{ width: "100%", height: "auto" }}>
                {/* Input nodes */}
                {[[80, 70], [80, 130], [80, 190]].map(([x, y], i) => (
                    <g key={i}>
                        <circle cx={x} cy={y} r={18} fill="#111115" stroke="#252530" strokeWidth={1.5} />
                        <text x={x} y={y + 4} textAnchor="middle" fill="#8e8a82" fontSize={13} fontFamily="JetBrains Mono, monospace">
                            x{i + 1}
                        </text>
                    </g>
                ))}

                {/* Connection lines */}
                {[[80, 70], [80, 130], [80, 190]].map(([, y], i) => (
                    <line
                        key={i}
                        x1={98} y1={y}
                        x2={190} y2={130}
                        stroke="#252530"
                        strokeWidth={1.2}
                        opacity={0.7}
                    />
                ))}

                {/* Hidden/perceptron node */}
                <circle cx={190} cy={130} r={24} fill="#111115" stroke="#e8a838" strokeWidth={2} />
                <text x={190} y={130 + 5} textAnchor="middle" fill="#e8a838" fontSize={14} fontFamily="JetBrains Mono, monospace">
                    Σ + θ
                </text>

                {/* Output arrow */}
                <line x1={214} y1={130} x2={280} y2={130} stroke="#e8a838" strokeWidth={1.5} markerEnd="url(#arrow)" />

                {/* Output node */}
                <circle cx={310} cy={130} r={18} fill="#111115" stroke="#5ab98c" strokeWidth={1.5} />
                <text x={310} y={130 + 4} textAnchor="middle" fill="#5ab98c" fontSize={12} fontFamily="JetBrains Mono, monospace">
                    ŷ
                </text>

                {/* Weight labels */}
                <text x={148} y={98} textAnchor="middle" fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono, monospace">w₁</text>
                <text x={148} y={158} textAnchor="middle" fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono, monospace">w₂</text>
                <text x={148} y={218} textAnchor="middle" fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono, monospace">w₃</text>

                {/* Bias label */}
                <line x1={190} y1={104} x2={190} y2={80} stroke="#5a9ab9" strokeWidth={1.2} />
                <text x={205} y={92} fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono, monospace">b</text>

                {/* Legend */}
                <text x={360} y={90} fill="#8e8a82" fontSize={12} fontFamily="Crimson Pro, serif">Single-layer perceptron</text>
                <text x={360} y={112} fill="#5e5b56" fontSize={11} fontFamily="Crimson Pro, serif">Input → Weighted sum →</text>
                <text x={360} y={128} fill="#5e5b56" fontSize={11} fontFamily="Crimson Pro, serif">Threshold → Binary output</text>

                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#e8a838" />
                    </marker>
                </defs>
            </svg>
        </div>
    )
}

function HistoryTab() {
    return (
        <>
            <h2>The First Trainable Neural Network</h2>

            <div className="ch1-timeline">
                <div className="ch1-tl-item">
                    <div className="ch1-tl-year">1957</div>
                    <div className="ch1-tl-title">Rosenblatt's Mark I Perceptron</div>
                    <div className="ch1-tl-section-label">The breakthrough</div>
                    <div className="ch1-tl-body">
                        Frank Rosenblatt built the first hardware implementation of a trainable neural network: the Mark I Perceptron. It used 400 photodetectors as input sensors, connected via adjustable potentiometers (weights) to 512 output units. The key innovation was the <em>perceptron learning rule</em> — a simple procedure that automatically adjusted the potentiometer settings based on errors, enabling the machine to learn from data rather than having weights set by hand.
                    </div>
                    <div className="ch1-tl-section-label">Why it mattered</div>
                    <div className="ch1-tl-body ch1-tl-impact">
                        This was the first demonstration that a machine could learn a pattern classification task from examples. The New York Times reported it as "the first device to think like a human brain." It attracted massive government funding from ARPA and launched a decade of excitement around neural networks.
                    </div>
                </div>

                <div className="ch1-tl-item">
                    <div className="ch1-tl-year">1958 – 1960</div>
                    <div className="ch1-tl-title">Widrow & Hoff — The LMS Rule</div>
                    <div className="ch1-tl-section-label">Parallel development</div>
                    <div className="ch1-tl-body">
                        Bernard Widrow and Ted Hoff at Stanford independently developed the <strong>Least Mean Squares (LMS)</strong> algorithm, also called the Widrow-Hoff rule or delta rule. Instead of Rosenblatt's mistake-driven binary update, they used continuous error signals: <InlineMath tex="\Delta w_{ij} = \eta\,(y - \hat{y})\,x_i" />. This was a crucial step toward gradient-based learning — it used the actual error magnitude, not just its sign.
                    </div>
                    <div className="ch1-tl-section-label">Why it mattered</div>
                    <div className="ch1-tl-body ch1-tl-impact">
                        LMS was faster and more stable than the perceptron rule, and it minimised mean squared error rather than just fixing misclassifications. The Widrow-Hoff rule is mathematically equivalent to gradient descent on the MSE loss — a direct precursor to backpropagation. Widrow networks (ADALINE, MADALINE) were deployed in real applications including echo cancellation and pattern recognition.
                    </div>
                </div>

                <div className="ch1-tl-item">
                    <div className="ch1-tl-year">1969</div>
                    <div className="ch1-tl-title">Minsky & Papert — The Shutdown</div>
                    <div className="ch1-tl-section-label">The crash</div>
                    <div className="ch1-tl-body">
                        Marvin Minsky and Seymour Papert published Perceptrons: An Introduction to Computational Geometry, proving mathematically that single-layer perceptrons could not learn XOR or any non-linearly-separable function. Worse: they showed that adding hidden layers made training exponentially hard. The book essentially ended federal funding for neural network research for a decade. The field wouldn't recover until Rumelhart & Hinton's 1986 paper on backpropagation demonstrated that hidden layers could be trained efficiently.
                    </div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The Machine That Could Learn from Mistakes</h2>

            <Analogy label="Guessing the Number">
                Think of a game where someone thinks of a secret number between 1 and 100, and you have to guess it. If you guess 60 and they say "higher," you know you need to guess a bigger number next time. So you update your thinking upward.
                <br /><br />
                The perceptron works the same way: it makes a guess, gets told if it's wrong, and <em>adjusts its guess slightly</em> in the right direction. Repeat this enough times and you get very good.
            </Analogy>

            <Analogy label="Finding the Right Line">
                Imagine you're trying to draw a single straight line that separates cats from dogs on a piece of paper. Some drawings are right, others are wrong. The perceptron learning rule is like this: if a cat ends up on the wrong side of the line, you move the line a little. Keep doing this, and eventually the line separates all cats from all dogs.
                <br /><br />
                <strong>The catch:</strong> this only works if there IS a straight line that separates the groups. If cats and dogs are all mixed up, no single line will work — and the perceptron can never succeed. This is exactly the XOR problem.
            </Analogy>

            <Analogy label="Rosenblatt's Hardware">
                In 1957, Rosenblatt didn't have a computer — he built a physical machine the size of a small room! 400 lights fed into circuits that turned knobs (the weights). When it made a mistake, motors physically turned the knobs slightly. It could recognise simple shapes — a big achievement at the time, even if today's phones are millions of times more powerful.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>How the Perceptron Learns</h2>

            <DiagramBlock title="Single-layer perceptron — inputs, weights, threshold, output">
                <PerceptronDiagramSVG />
            </DiagramBlock>

            <h3>The Learning Algorithm</h3>
            <p>
                For each training example (<strong>x</strong>, y) where y &#8712; &#123;+1, &#8722;1&#125;:
            </p>
            <ol>
                <li><strong>Compute prediction:</strong> <InlineMath tex="\hat{y} = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" /></li>
                <li><strong>If correct</strong> (y · ŷ &gt; 0): do nothing — no learning needed</li>
                <li><strong>If wrong</strong> (y · ŷ &lt; 0): update weights and bias:
                    <MathBlock tex="\mathbf{w} \leftarrow \mathbf{w} + \eta\, y\, \mathbf{x}" />
                    <MathBlock tex="b \leftarrow b + \eta\, y" />
                </li>
            </ol>

            <h3>Geometric Intuition</h3>
            <p>
                Each weight update moves the decision hyperplane slightly toward the correct side of the
                misclassified point. The term <InlineMath tex="y \cdot \mathbf{x}" /> says: "move the boundary
                in the direction of this point, but toward the side with label y."
            </p>
            <p>
                If <InlineMath tex="y = +1" /> and the point is misclassified as negative, the update pushes the
                hyperplane toward the point. If <InlineMath tex="y = -1" />, it pushes the hyperplane away.
            </p>

            <h3>Convergence</h3>
            <p>
                If the data is linearly separable, the perceptron <em>will</em> converge to a perfect classifier
                in finite time (Block-Novikoff theorem). If not linearly separable, it oscillates — cycling
                through weight configurations forever without settling.
            </p>

            <div className="ch1-callout">
                <strong>Key limitation:</strong> The perceptron can only learn hyperplanes. It will
                <em>never</em> solve XOR because XOR points cannot be separated by a single straight line.
                You need at least one hidden layer of neurons to bend the decision boundary.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Perceptron: Theory and Limitations</h2>

            <DefBlock label="Perceptron Model">
                A single-layer perceptron computes:
                <MathBlock tex="f(\mathbf{x}) = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />
                where <InlineMath tex="\text{sign}(z) = +1" /> if z ≥ 0 and −1 otherwise.
                The decision boundary is the hyperplane <InlineMath tex="\mathbf{w}^\top \mathbf{x} + b = 0" />.
            </DefBlock>

            <h3>Perceptron Learning Rule</h3>
            <p>For a misclassified example (<strong>x</strong>, y):</p>
            <MathBlock tex="\mathbf{w} \leftarrow \mathbf{w} + \eta\, y\, \mathbf{x}" />
            <MathBlock tex="b \leftarrow b + \eta\, y" />
            <p>
                This is equivalent to stochastic gradient descent on the hinge loss
                <InlineMath tex="\mathcal{L} = \max(0, -y(\mathbf{w}^\top \mathbf{x} + b))" />,
                where the gradient is simply −y · <strong>x</strong> when the margin is negative.
            </p>

            <h3>Block-Novikoff Convergence Theorem</h3>
            <p>
                If there exists a vector <strong>u</strong> and constant γ &gt; 0 such that
                <InlineMath tex="y_i(\mathbf{u}^\top \mathbf{x}_i + b) \geq \gamma" /> for all i (strict linear separability),
                then the perceptron converges in at most <InlineMath tex="R^2 / \gamma^2" /> iterations,
                where R is the maximum norm of any input vector.
            </p>

            <h3>Decision Regions</h3>
            <p>
                A single perceptron divides input space into two half-spaces separated by a hyperplane.
                For n-dimensional input, the decision region is an (n−1)-dimensional hyperplane in ℝⁿ.
                Multiple perceptrons (one per class) can create multiple hyperplanes and partition space into
                multiple convex regions — but each region is always a convex polytope.
            </p>

            <h3>The XOR Case: No Separating Hyperplane</h3>
            <p>
                The XOR data points in ℝ²:
            </p>
            <table className="ch1-truth-table">
                <thead><tr><th>x₁</th><th>x₂</th><th>y</th><th>Label</th></tr></thead>
                <tbody>
                    <tr><td>0</td><td>0</td><td>0</td><td>−1 (negative)</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td><td>+1 (positive)</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td><td>+1 (positive)</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td><td>−1 (negative)</td></tr>
                </tbody>
            </table>
            <p>
                No line can separate &#123;+1&#125; &#123;(0,1), (1,0)&#125; from &#123;&#8722;1&#125; &#123;(0,0), (1,1)&#125;. A two-layer
                network can: the hidden layer encodes two intermediate features, and the output neuron combines
                them to compute XOR. But without an efficient gradient signal, Minsky & Papert argued (correctly
                at the time) that training such networks was intractable.
            </p>

            <div className="ch1-callout">
                <strong>Resolution (1986):</strong> Rumelhart, Hinton & Williams showed that backpropagation
                provides exactly the gradient signal needed to train hidden layers. A 2-layer network with
                2 hidden units can solve XOR trivially. The crisis was not the architecture — it was the
                lack of a training algorithm. Backpropagation solved both.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Rosenblatt Perceptron ───────────────────────────────────────────────────
def perceptron_predict(X, w, b):
    """Binary prediction: +1 or -1"""
    z = X @ w + b
    return np.where(z >= 0, 1, -1)

def perceptron_train(X, y, lr=0.1, max_epochs=200, seed=42):
    """
    Train a perceptron using the Rosenblatt rule.
    Converges iff data is linearly separable.
    """
    np.random.seed(seed)
    n_features = X.shape[1]
    w = np.zeros(n_features)
    b = 0.0

    for epoch in range(max_epochs):
        mistakes = 0
        for xi, yi in zip(X, y):
            z = np.dot(w, xi) + b
            y_hat = 1 if z >= 0 else -1
            if yi * y_hat <= 0:           # misclassified
                w += lr * yi * xi          # ← Rosenblatt update
                b += lr * yi
                mistakes += 1
        if mistakes == 0:
            print(f"Converged in {epoch} epochs")
            break
    return w, b

# ── AND (linearly separable → converges) ────────────────────────────────────
X_and = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y_and = np.array([-1, -1, -1,  1])
w, b = perceptron_train(X_and, y_and)
print("AND predictions:", perceptron_predict(X_and, w, b))  # [-1 -1 -1  1] ✓

# ── XOR (NOT linearly separable → never converges) ─────────────────────────
X_xor = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y_xor = np.array([-1,  1,  1, -1])
w_xor, b_xor = perceptron_train(X_xor, y_xor, max_epochs=500)
print("XOR predictions after 500 epochs:", perceptron_predict(X_xor, w_xor, b_xor))
# → will never get all 4 correct simultaneously

# ── Visualise: what's the decision boundary? ────────────────────────────────
import matplotlib.pyplot as plt

def plot_decision_boundary(X, y, w, b, title):
    ax = plt.gca()
    ax.scatter(X[y==1, 0], X[y==1, 1], c='#5ab98c', s=60, label='+1')
    ax.scatter(X[y==-1,0], X[y==-1,1], c='#b95a5a', s=60, label='-1')

    xlim = ax.get_xlim(); ylim = ax.get_ylim()
    xx = np.linspace(xlim[0]-0.5, xlim[1]+0.5, 200)
    if abs(w[1]) > 1e-9:
        yy = -(w[0]*xx + b) / w[1]
        ax.plot(xx, yy, 'k--', lw=1, alpha=0.5)
    ax.set_xlim(xlim); ax.set_ylim(ylim)
    ax.set_title(title); ax.legend()
    plt.tight_layout()

plt.figure(figsize=(10,4))
plt.subplot(1,2,1)
plot_decision_boundary(X_and, y_and, w, b, "AND — perceptron succeeds")
plt.subplot(1,2,2)
plot_decision_boundary(X_xor, y_xor, w_xor, b_xor, "XOR — perceptron fails")
plt.show()`

function PythonTab() {
    return (
        <>
            <p>
                NumPy perceptron training with visual decision boundaries. AND converges to a separating
                hyperplane; XOR oscillates forever because no such hyperplane exists.
            </p>
            <CodeBlock code={PY_CODE} filename="perceptron.py" lang="python" langLabel="Python" />
            <div className="ch1-callout">
                <strong>Run it:</strong> The XOR plot will show a decision boundary that misclassifies
                at least one point — no matter how long you train. This is the geometric consequence of
                non-linear separability.
            </div>
        </>
    )
}

const TS_CODE = `// ── Rosenblatt Perceptron ────────────────────────────────────────────────────

type Vec = number[];
type Mat = number[][];

interface Perceptron {
  w: Vec;      // weights
  b: number;   // bias
}

function predict({ w, b }: Perceptron, x: Vec): number {
  const z = w.reduce((s, wi, i) => s + wi * x[i], 0) + b;
  return z >= 0 ? 1 : -1;
}

function train(
  X: Vec[], y: number[], lr = 0.1, maxEpochs = 200
): Perceptron {
  const n = X[0].length;
  let w = new Array(n).fill(0);
  let b = 0;

  for (let epoch = 0; epoch < maxEpochs; epoch++) {
    let mistakes = 0;
    for (let i = 0; i < X.length; i++) {
      const x = X[i], yi = y[i];
      const yHat = predict({ w, b }, x);
      if (yi * yHat <= 0) {       // misclassified
        for (let j = 0; j < n; j++) w[j] += lr * yi * x[j];
        b += lr * yi;
        mistakes++;
      }
    }
    if (mistakes === 0) {
      console.log(\`Converged at epoch \${epoch}\`);
      break;
    }
  }
  return { w, b };
}

// ── AND: linearly separable ─────────────────────────────────────────────────
const X_and = [[0,0],[0,1],[1,0],[1,1]];
const y_and = [-1, -1, -1, 1];
const pAnd = train(X_and, y_and);
console.log("AND:", X_and.map(x => predict(pAnd, x)));
// → [-1, -1, -1, 1] ✓

// ── XOR: NOT linearly separable ─────────────────────────────────────────────
const X_xor = [[0,0],[0,1],[1,0],[1,1]];
const y_xor = [-1, 1, 1, -1];
const pXor = train(X_xor, y_xor, 0.1, 500);
console.log("XOR (500 epochs):", X_xor.map(x => predict(pXor, x)));
// → always at least 1 misclassification — no hyperplane exists!

// ── Visualise the decision boundary ────────────────────────────────────────
function plotBoundary(
  X: Vec[], y: number[], { w, b }: Perceptron, label: string
) {
  const pts = X.map((x, i) => ({ x, y: y[i] }));
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.x);

  console.log(\`\\n=== \${label} ===\`);
  pts.forEach(({ x, y: yi }) => {
    const pred = predict({ w, b }, x);
    console.log(\`  [\${x}] → pred=\${pred} (true=\${yi}) \${pred === yi ? "✓" : "✗"}\`);
  });

  if (Math.abs(w[1]) > 1e-9) {
    const x0 = Math.min(...xs) - 0.5;
    const x1 = Math.max(...xs) + 0.5;
    const yAt0 = -(w[0] * x0 + b) / w[1];
    const yAt1 = -(w[0] * x1 + b) / w[1];
    console.log(\`  Boundary: y = \${(-w[0]/w[1]).toFixed(2)}x + \${(-b/w[1]).toFixed(2)}\`);
  }
}

plotBoundary(X_and, y_and, pAnd, "AND");
plotBoundary(X_xor, y_xor, pXor, "XOR");`

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript perceptron — the exact Rosenblatt algorithm, 60+ lines, no dependencies.
                Run it and observe: AND converges perfectly, XOR oscillates indefinitely.
            </p>
            <CodeBlock code={TS_CODE} filename="perceptron.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch1-callout">
                <strong>The crucial difference:</strong> AND separates into two classes by a straight line.
                XOR's positive and negative examples interleave — to separate them, you need at least two
                intersecting lines, which requires a hidden layer.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PERCEPTRON_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
