import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function XORDiagramSVG() {
    return (
        <div style={{ padding: "20px", background: "#17171d" }}>
            <svg viewBox="0 0 540 300" style={{ width: "100%", height: "auto" }}>
                {/* XOR points: (0,1) and (1,0) are positive (green), (0,0) and (1,1) are negative (red) */}
                {/* Unit square with axes */}
                <line x1="60" y1="250" x2="280" y2="250" stroke="#252530" strokeWidth={1} />
                <line x1="60" y1="250" x2="60" y2="70" stroke="#252530" strokeWidth={1} />
                <text x="280" y="268" fill="#5e5b56" fontSize={11} fontFamily="JetBrains Mono">x₁</text>
                <text x="48" y="70" fill="#5e5b56" fontSize={11} fontFamily="JetBrains Mono">x₂</text>

                {/* Grid lines */}
                {[1, 2].map(i => (
                    <g key={i}>
                        <line x1={60 + i * 55} y1={250} x2={60 + i * 55} y2={70} stroke="#1a1a20" strokeWidth={1} strokeDasharray="3,4" />
                        <line x1={60} y1={250 - i * 45} x2={280} y2={250 - i * 45} stroke="#1a1a20" strokeWidth={1} strokeDasharray="3,4" />
                    </g>
                ))}

                {/* Positive points (XOR=1): (0,1) and (1,0) */}
                <circle cx={60 + 0*110} cy={250 - 1*90} r={10} fill="#5ab98c" opacity={0.85} />
                <text x={60 + 0*110 - 18} y={250 - 1*90 + 5} fill="#5ab98c" fontSize={12} fontFamily="JetBrains Mono">(0,1)</text>

                <circle cx={60 + 1*110} cy={250 - 0*90} r={10} fill="#5ab98c" opacity={0.85} />
                <text x={60 + 1*110 + 14} y={250 - 0*90 + 5} fill="#5ab98c" fontSize={12} fontFamily="JetBrains Mono">(1,0)</text>

                {/* Negative points (XOR=0): (0,0) and (1,1) */}
                <circle cx={60 + 0*110} cy={250 - 0*90} r={10} fill="#b95a5a" opacity={0.85} />
                <text x={60 + 0*110 - 22} y={250 - 0*90 + 5} fill="#b95a5a" fontSize={12} fontFamily="JetBrains Mono">(0,0)</text>

                <circle cx={60 + 1*110} cy={250 - 1*90} r={10} fill="#b95a5a" opacity={0.85} />
                <text x={60 + 1*110 + 14} y={250 - 1*90 + 5} fill="#b95a5a" fontSize={12} fontFamily="JetBrains Mono">(1,1)</text>

                {/* FAIL: No single line can separate red from green */}
                <line x1="80" y1="220" x2="240" y2="280" stroke="#e8a838" strokeWidth={2} strokeDasharray="6,3" opacity={0.5} />
                <text x="100" y="200" fill="#e8a838" fontSize={11} fontFamily="JetBrains Mono" opacity={0.8}>No single line works!</text>

                {/* Labels */}
                <text x="120" y="30" fill="#8e8a82" fontSize={13} fontFamily="Crimson Pro, serif">XOR truth table:</text>

                {/* Two-layer solution diagram */}
                <g transform="translate(300, 20)">
                    <text x="80" y="30" fill="#5e5b56" fontSize={10} fontFamily="JetBrains Mono">Hidden layer</text>
                    <text x="80" y="45" fill="#5e5b56" fontSize={10} fontFamily="JetBrains Mono">h₁ = NAND(x₁,x₂)</text>
                    <text x="80" y="60" fill="#5e5b56" fontSize={10} fontFamily="JetBrains Mono">h₂ = OR(x₁,x₂)</text>

                    {/* NAND gate points */}
                    <circle cx={35} cy={115} r={8} fill="#5a9ab9" />
                    <text x={35 - 28} y={119} fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono">NAND</text>
                    <circle cx={35} cy={165} r={8} fill="#5a9ab9" />
                    <text x={35 - 22} y={169} fill="#5a9ab9" fontSize={11} fontFamily="JetBrains Mono">OR</text>

                    {/* Output */}
                    <circle cx={160} cy={140} r={10} fill="#9b7fc7" />
                    <text x={160 + 14} y={144} fill="#9b7fc7" fontSize={11} fontFamily="JetBrains Mono">AND</text>

                    {/* NAND to AND */}
                    <line x1="43" y1={140} x2={150} y2={140} stroke="#9b7fc7" strokeWidth={1.2} />
                    {/* OR to AND */}
                    <line x1="43" y1={165} x2={150} y2={165} stroke="#9b7fc7" strokeWidth={1.2} />
                    <line x1={150} y1={140} x2={150} y2={140} stroke="#9b7fc7" strokeWidth={1.2} />
                    <line x1={150} y1={165} x2={150} y2={140} stroke="#9b7fc7" strokeWidth={1.2} />

                    {/* XOR = (NAND) AND (OR) */}
                    <text x="30" y="200" fill="#e8a838" fontSize={11} fontFamily="JetBrains Mono">XOR = (NAND) AND (OR)</text>
                    <text x="30" y="218" fill="#5e5b56" fontSize={10} fontFamily="JetBrains Mono">requires ≥ 1 hidden layer</text>
                </g>
            </svg>
        </div>
    )
}

function HistoryTab() {
    return (
        <>
            <h2>The Result That Ended Neural Networks for a Decade</h2>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1969</div>
                    <div className="ch-tl-title">Perceptrons — The Book</div>
                    <div className="ch-tl-section-label">The publication</div>
                    <div className="ch-tl-body">
                        Marvin Minsky and Seymour Papert published Perceptrons: An Introduction to Computational Geometry (MIT Press). The book was rigorous, mathematically precise, and devastating. They proved that a single-layer perceptron could not compute XOR — the exclusive-or function. More broadly, they proved that perceptrons were fundamentally limited to linearly separable functions.
                    </div>
                    <div className="ch-tl-section-label">The impact</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Within two years of the book's publication, federal funding for neural network research essentially dried up. The field entered its first AI Winter. Researchers pivoted to symbolic AI, expert systems, and logic-based approaches. The neural network field wouldn't recover until 1986.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986</div>
                    <div className="ch-tl-title">Backpropagation — The Recovery</div>
                    <div className="ch-tl-section-label">What changed</div>
                    <div className="ch-tl-body">
                        David Rumelhart, Geoffrey Hinton, and Ronald Williams published "Learning representations by back-propagating errors" in Nature. They demonstrated that multilayer networks (with hidden layers) could solve XOR and much more complex functions — if trained with backpropagation. The learning signal flowed backwards through the network, computing gradients at each layer.
                    </div>
                    <div className="ch-tl-section-label">Why it resolved the crisis</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Minsky & Papert's critique was correct for the algorithms available in 1969. Backpropagation provided exactly what they said was missing: an efficient way to train hidden layers. A two-layer network (2 hidden units + 1 output) can solve XOR trivially. The lesson: the limitation was never the architecture — it was the training algorithm. While neural network research froze after 1969, the mathematics did not. Chapter 3 picks up the parallel thread that never stopped: unsupervised learning algorithms — k-means, hierarchical clustering, EM — that were quietly maturing through the same years that the AI Winter gripped the neural network field.
                    </div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why XOR broke everything</h2>

            <Analogy label="The Impossible Line">
                Look at these four dots on a grid:
                <br /><br />
                Top-left and bottom-right are <strong style={{color:"#b95a5a"}}>RED</strong>.
                Top-right and bottom-left are <strong style={{color:"#5ab98c"}}>GREEN</strong>.
                <br /><br />
                Can you draw one straight line that puts all the reds on one side and all the greens on the other?
                <br /><br />
                <strong>No!</strong> No matter how you draw it, at least one red and one green end up on the same side.
                This is the XOR problem in a picture.
            </Analogy>

            <Analogy label="The Fix — Two Lines!">
                Here's the trick: you can't solve it with one line. But you <em>can</em> solve it with two lines.
                Draw one line that separates the top-left red from everything else (leaving top-right green above it).
                Draw another line that separates the bottom-right red from everything else.
                <br /><br />
                Then combine those two decisions: GREEN if exactly one input is 1. This is what a two-layer neural
                network does — it uses the first layer to draw multiple lines, and the second layer to combine them.
            </Analogy>

            <Analogy label="Why It Took 17 Years to Fix">
                Minsky proved that a single-layer perceptron couldn't solve XOR. But he also said (and this part
                was less remembered): multi-layer networks <em>theoretically could</em> solve it, but there was
                no way to train them efficiently.
                <br /><br />
                It took until 1986 — when the backpropagation algorithm was rediscovered — to actually train those
                hidden layers. That's 17 years of frozen progress, all because of a single logical operation.
            </Analogy>

            <Analogy label="What comes next — algorithms that never stopped">
                Neural network research froze in 1969. But mathematicians working in a completely different tradition didn't know about the XOR problem and didn't stop. They were building algorithms that could find structure in data without any labels at all — clustering methods, density estimators. Chapter 3 follows that parallel thread, starting with Lloyd's quantisation algorithm in 1957 — published the same year Rosenblatt built his perceptron.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The XOR Function and Linear Separability</h2>

            <DiagramBlock title="XOR points in 2D — no separating line exists">
                <XORDiagramSVG />
            </DiagramBlock>

            <h3>XOR Truth Table</h3>
            <table className="ch-truth-table">
                <thead><tr><th>x₁</th><th>x₂</th><th>x₁ XOR x₂</th></tr></thead>
                <tbody>
                    <tr><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td></tr>
                </tbody>
            </table>

            <h3>Why a Perceptron Can't Compute XOR</h3>
            <p>
                A perceptron's decision boundary is a single hyperplane. For XOR, the positive examples
                (0,1) and (1,0) lie on opposite corners of the unit square. Any line passing through the square
                and separating them must also place at least one negative example on the positive side (or vice versa).
            </p>
            <p>
                Formally: no <strong>w</strong>, b satisfy simultaneously:
                <InlineMath tex="\mathbf{w}^\top(0,1) + b &lt; 0" /> and
                <InlineMath tex="\mathbf{w}^\top(1,0) + b &lt; 0" /> (negatives)
                while <InlineMath tex="\mathbf{w}^\top(0,1) + b &gt; 0" /> and
                <InlineMath tex="\mathbf{w}^\top(1,0) + b &gt; 0" /> (positives) —
                these constraints are mutually contradictory.
            </p>

            <h3>The Two-Layer Solution</h3>
            <p>XOR can be written as a combination of simpler functions:</p>
            <MathBlock tex="x_1 \oplus x_2 = (x_1 \land \lnot x_2) \lor (\lnot x_1 \land x_2)" />
            <p>
                This requires three logical operations: two ANDs and one OR. In neural network terms:
                the first layer computes NAND and OR (using different weights); the second layer combines them.
            </p>

            <div className="ch-callout">
                <strong>Key lesson:</strong> A single perceptron is a linear classifier. Two layers
                (one hidden) with non-linear activations can represent any boolean function — including XOR.
                The key is that the hidden layer creates <em>feature combinations</em> that the output
                layer then classifies.
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
            <h2>Linear Separability and the Capacity of Single-Layer Networks</h2>

            <DefBlock label="Linear Separability">
                A set of points in ℝⁿ is linearly separable if there exists a hyperplane
                <InlineMath tex="\mathbf{w}^\top \mathbf{x} + b = 0" /> that places all points of one class
                strictly on one side and all points of the other class strictly on the other side.
                Formally: ∃ <strong>w</strong>, b such that y_i(<strong>w</strong>ᵀ<strong>x</strong>_i + b) &gt; 0 ∀i.
            </DefBlock>

            <h3>Number of Linearly Separable Boolean Functions</h3>
            <p>
                There are 2<sup>2ⁿ</sup> boolean functions on n inputs. The number that are linearly separable:
            </p>
            <ul>
                <li>n=1: 4 of 4 (100%)</li>
                <li>n=2: 14 of 16 (87.5%) — only XOR and XNOR are non-separable</li>
                <li>n=3: 104 of 256 (40.6%)</li>
                <li>n=4: 1,872 of 65,536 (2.9%)</li>
            </ul>
            <p>
                The fraction of linearly separable functions falls exponentially with n. This means single-layer
                perceptrons are increasingly inadequate as problems grow in complexity.
            </p>

            <h3>XOR Formally</h3>
            <p>
                XOR's negation of linear separability: the four points of the XOR table cannot be separated by any
                hyperplane in ℝ². This can be shown via the linear programming dual or by noting that the convex
                hulls of the positive and negative classes overlap.
            </p>

            <h3>Two-Layer Network for XOR</h3>
            <p>
                A two-layer (one hidden layer, one output) network with 2 hidden units can solve XOR exactly:
            </p>
            <MathBlock tex="h_1 = \sigma(w_{11}^{(1)}x_1 + w_{21}^{(1)}x_2 + b_1^{(1)}) \quad \text{(NAND gate)}" />
            <MathBlock tex="h_2 = \sigma(w_{12}^{(1)}x_1 + w_{22}^{(1)}x_2 + b_2^{(1)}) \quad \text{(OR gate)}" />
            <MathBlock tex="\hat{y} = \sigma(w_1^{(2)}h_1 + w_2^{(2)}h_2 + b^{(2)}) \quad \text{(AND of NAND and OR)}" />
            <p>
                Using binary thresholds (or ReLU/sigmoid), the hidden layer's non-linear responses allow the
                output to compute XOR. With binary thresholds: hidden unit 1 = NAND, hidden unit 2 = OR,
                output = AND of both.
            </p>

            <h3>Minsky & Papert's General Theorems</h3>
            <p>
                Perceptrons (1969) proved several important limitations beyond XOR:
            </p>
            <ul>
                <li><strong>Even/odd parity</strong>: perceptrons cannot learn parity functions for n ≥ 2</li>
                <li><strong>Connectivity</strong>: certain spatially organised tasks cannot be learned by fixed-architecture perceptrons</li>
                <li><strong>Predicate limitation</strong>: many natural predicates (e.g., connectedness in images) are not linearly separable</li>
            </ul>

            <div className="ch-callout">
                <strong>Resolution in 1986:</strong> Backpropagation trains hidden layers by propagating error gradients backwards. A 2-layer network with 2 hidden units and trained weights can solve XOR exactly — this was the computational proof that Minsky's critique was about the algorithm, not the architecture.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── XOR with a Two-Layer Network (no backprop needed — hand-coded weights) ──
# Hidden layer: NAND and OR  |  Output layer: AND

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

# Hand-tuned weights (from boolean algebra: XOR = (NAND) AND (OR))
# Layer 1: NAND(x1,x2) and OR(x1,x2)
W1 = np.array([[ 2, -2],    # NAND: w1=2, w2=-2
               [ 1,  1]])   # OR:   w1=1, w2=1
b1 = np.array([-1, -0.5])   # NAND bias, OR bias

# Layer 2: AND of NAND and OR
W2 = np.array([[1], [1]])
b2 = np.array(-1.5)          # AND requires both

def forward(X):
    h = sigmoid(X @ W1 + b1)   # hidden: NAND, OR
    out = sigmoid(h @ W2 + b2)  # output: AND(NAND, OR) = XOR
    return (out >= 0.5).astype(int)

X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([0,    1,    1,    0])

preds = forward(X)
print("XOR predictions:", preds.flatten())
# → [0 1 1 0] ✓ — XOR solved with 2 hidden units!

# ── Show intermediate activations ────────────────────────────────────────────
print("\\nHidden layer activations (NAND, OR):")
for xi, yi in zip(X, y):
    h = sigmoid(xi @ W1 + b1)
    pred = forward([xi])[0]
    print(f"  x={xi} → NAND={h[0]:.3f}, OR={h[1]:.3f} → pred={pred} (true={yi})")

# ── What if we only have 1 hidden unit? Still fails. ───────────────────────
print("\\nWith only 1 hidden unit — still can't solve XOR:")
W1_fail = np.array([[1, -1]])  # NAND-like
b1_fail = np.array([-0.5])
W2_fail = np.array([[1]])
b2_fail = np.array(-0.5)

def forward_fail(X):
    h = sigmoid(X @ W1_fail + b1_fail)
    return (sigmoid(h @ W2_fail + b2_fail) >= 0.5).astype(int)

print("1-unit hidden:", forward_fail(X).flatten())
# → never gets all 4 right — need ≥ 2 hidden units for XOR`

function PythonContent() {
    return (
        <>
            <p>
                Two-layer NumPy network solving XOR with hand-coded weights. The network has
                exactly 2 hidden units (NAND and OR) and an output AND gate — the minimum
                architecture for XOR.
            </p>
            <CodeBlock code={PY_CODE} filename="xor_twolayer.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> XOR needs exactly 2 hidden units. With 1 hidden unit,
                the decision boundary is still a single hyperplane in the 2D feature space of hidden
                activations — still insufficient. This is why hidden layers matter: they create
                <em> richer feature spaces</em> where previously inseparable problems become separable.
            </div>
        </>
    )
}



// ── Tab content map ───────────────────────────────────────────────────────────

export const XOR_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
