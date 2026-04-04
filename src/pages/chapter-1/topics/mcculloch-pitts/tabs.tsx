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
        <div className="ch1-tl-item">
            <div className="ch1-tl-year">{item.year}</div>
            <div className="ch1-tl-title">{item.title}</div>
            <div className="ch1-tl-section-label">The context</div>
            <div className="ch1-tl-body">{item.challenge}</div>
            <div className="ch1-tl-section-label">What was introduced</div>
            <div className="ch1-tl-body">{item.what}</div>
            <div className="ch1-tl-section-label">Why it mattered</div>
            <div className="ch1-tl-body ch1-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1900 – 1943",
            title: "From Cajal to Turing: The Biological Precedent",
            challenge:
                "Neuroscientists had established by the early 1900s that the brain was composed of discrete neurons connected by synapses. But no one had translated this biological machinery into a mathematical formalism that could be studied computationally.",
            what: "Santiago Ramón y Cajal's histological studies (1900–1911) established neurons as discrete processing units. Alan Turing (1948) proposed 'unorganised machines' — random networks that could be trained. Warren McCulloch, a neurophysiologist, and Walter Pitts, a logician, bridged biology and mathematics directly.",
            impact:
                "The McCulloch-Pitts neuron was the first formal model linking thresholded summation of binary inputs to logical computation. It proved that a network of simplified neurons could — in principle — compute anything a Turing machine could.",
        },
        {
            year: "1943",
            title: "A Logical Calculus of the Ideas Immanent in Nervous Activity",
            challenge:
                "How does a nervous system — made of discrete cells each firing or not firing — produce the complex behaviour of a whole organism? The gap between the neuron and cognition seemed insurmountable without a formal bridge.",
            what: "McCulloch and Pitts proposed a simplified neuron model: inputs are binary (0 or 1), each has a fixed weight, the neuron fires (output = 1) if the weighted sum meets or exceeds a threshold θ. They showed how to wire these neurons to compute any logical proposition — AND, OR, NOT — using the right thresholds and weights.",
            impact:
                "This was the conceptual birth of computational neuroscience and neural networks. It established the neuron as a thresholded weighted sum — a model so simple it could be analysed mathematically, yet expressive enough to be the foundation of everything that followed.",
        },
        {
            year: "1949",
            title: "Hebb's Rule — The Biological Learning Principle",
            challenge:
                "The McCulloch-Pitts neuron was a static logical circuit — its weights had to be set by hand. How could synaptic strengths change based on experience? How does the brain encode memory?",
            what: "Donald Hebb proposed in The Organization of Behavior that when two neurons fire simultaneously, the synaptic connection between them strengthens. Formally: 'Neurons that fire together wire together.' Hebbian plasticity became the dominant model of biological learning and inspired all subsequent artificial learning rules.",
            impact:
                "Every learning algorithm in neural networks traces its lineage to Hebb's rule. Weight update rules in modern networks — including backprop — are Hebbian in spirit: connections are reinforced when they contribute to correct output. It was also the first account of how memories could be stored in a physical network.",
        },
        {
            year: "1957",
            title: "Rosenblatt's Perceptron — The First Learning Machine",
            challenge:
                "McCulloch-Pitts neurons required hand-tuned weights. Hebbian learning was biologically plausible but noisy and slow. There was no algorithm that could automatically adjust weights from data.",
            what: "Frank Rosenblatt built the Mark I Perceptron — hardware with 400 photodetectors connected to 512 output units via adjustable potentiometers. He introduced the perceptron learning rule: for a misclassified point, shift weights in the direction that would correct the error (w ← w + η·(y − ŷ)·x). The perceptron converged to a separating hyperplane if one existed.",
            impact:
                "The perceptron was the first working implementation of a trainable neural network. It generated enormous excitement and federal funding. It also established the hyperplane as the decision boundary in linear classification — the geometric primitive that underlies SVMs and logistic regression.",
        },
        {
            year: "1969",
            title: "Minsky & Papert — The XOR Assassination",
            challenge:
                "Despite the perceptron's success, researchers knew it could only learn linearly separable functions. But no one had rigorously characterised exactly which functions were learnable and which were not.",
            what: "Marvin Minsky and Seymour Papert published Perceptrons: An Introduction to Computational Geometry (1969), proving mathematically that the perceptron could not learn the XOR function or any non-linearly-separable function. More damning: they showed that adding hidden layers — to make the network non-linear — made the learning problem exponentially harder.",
            impact:
                "This single result caused a decade-long collapse in neural network research (the first 'AI Winter'). Federal funding evaporated. Researchers turned to symbolic AI and expert systems. The neural network field wouldn't recover until Rumelhart, Hinton, and Williams demonstrated backpropagation in 1986.",
        },
    ]

    return (
        <div className="ch1-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>What is a neuron, and what does it have to do with AI?</h2>

            <Analogy label="Your Brain's Light Switches">
                Your brain is made of billions of tiny cells called <strong>neurons</strong>. Each one is like a little light switch — it can be OFF (not firing) or ON (firing). When it's ON, it sends a tiny zap to the neurons it's connected to.
                <br /><br />
                The <strong>McCulloch-Pitts neuron</strong> was the very first mathematical model of this idea. It was like drawing a picture of a neuron using only math.
            </Analogy>

            <Analogy label="The Simplest Possible Decision Maker">
                Imagine a tiny robot that looks at two lights — red and green. It has a rule: <em>"if at least 2 lights are on, shout YES; otherwise, stay quiet."</em>
                <br /><br />
                That's exactly what a McCulloch-Pitts neuron does: it counts up all its inputs (each multiplied by its importance), and shouts YES if the total is big enough (above the <strong>threshold</strong>).
            </Analogy>

            <Analogy label="Hebb's Rule — How to Get Smarter">
                <strong>Donald Hebb</strong> had a brilliant idea: when two neurons fire at the same time, the connection between them gets stronger. Think of it like two kids who keep playing together — the more they play, the stronger their friendship becomes.
                <br /><br />
                Hebb said: <em>"Neurons that fire together, wire together."</em> This is how your brain learns — and it inspired every learning algorithm in AI.
            </Analogy>

            <Analogy label="The Perceptron — A Robot That Learns from Mistakes">
                <strong>Frank Rosenblatt</strong> built the first robot that could actually learn. It worked like this:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li>Look at a picture and guess what it is</li>
                    <li>If wrong — <em>shift your attention slightly</em> in the right direction</li>
                    <li>Keep doing this until you get it right (most of the time)</li>
                </ol>
                This is the <strong>perceptron learning rule</strong>. It's incredibly simple, but it only works when the right answer is findable by drawing a single straight line between groups.
            </Analogy>

            <Analogy label="The XOR Problem — When a Line Isn't Enough">
                Here's a trick question: there are four combinations of two switches. The answer is YES for exactly two of them (when exactly one switch is ON — but not both, not neither). Can you draw a single straight line to separate YES from NO?
                <br /><br />
                <strong>No!</strong> You can't. This is the famous XOR problem. A single perceptron — drawing one line — can't solve it. You need more than one step, which is why neural networks needed hidden layers. But Minsky proved that learning in hidden layers was incredibly hard... so research stopped for 10 years.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From binary decisions to trainable machines</h2>

            <h3>The McCulloch-Pitts Neuron</h3>
            <p>
                The M-P neuron is the simplest possible artificial neuron. Each input xᵢ is either 0 (off) or 1 (on), multiplied by a weight wᵢ, summed, and compared to a threshold θ:
            </p>
            <MathBlock tex="\text{output} = \begin{cases} 1 & \text{if } \sum_i w_i x_i \geq \theta \\ 0 & \text{otherwise} \end{cases}" />
            <p>
                By choosing the right weights and threshold, you can build any logical gate:
            </p>
            <ul>
                <li><strong>AND</strong>: w₁ = w₂ = 1, θ = 2 → fires only when both inputs are 1</li>
                <li><strong>OR</strong>: w₁ = w₂ = 1, θ = 1 → fires when at least one input is 1</li>
                <li><strong>NOT</strong>: single input w₁ = −1, θ = −0.5 → fires when input is 0</li>
            </ul>
            <p>
                Any boolean function can be built from these gates, meaning M-P neurons are <em>computationally complete</em> — equivalent in power to a Turing machine.
            </p>

            <h3>The Perceptron Learning Rule</h3>
            <p>
                The key difference from M-P neurons: the perceptron <em>learns</em> its weights from data. Given input <strong>x</strong>, true label y &#8712; &#123;&#8722;1, +1&#125;, and prediction <InlineMath tex="\hat{y} = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />:
            </p>
            <MathBlock tex="\mathbf{w} \leftarrow \mathbf{w} + \eta\,(y - \hat{y})\,\mathbf{x}" />
            <p>
                If the prediction is correct, weights don't change. If wrong, they shift in the direction of the true label — by a step size η (the learning rate). This is a <strong>mistake-driven</strong> learning algorithm: it only changes when it's wrong.
            </p>

            <h3>Linear Separability</h3>
            <p>
                A perceptron can only learn decision boundaries that are <strong>hyperplanes</strong> — straight lines (or their higher-dimensional generalisations). The function is learnable if and only if positive and negative examples can be separated by a hyperplane.
            </p>
            <p>
                The <strong>XOR</strong> function is not linearly separable — no straight line can separate the (1,0) and (0,1) cases from the (1,1) and (0,0) cases simultaneously. This is why the perceptron fails on XOR.
            </p>

            <hr className="ch1-sep" />

            <div className="ch1-callout">
                <strong>The geometric picture:</strong> The perceptron is drawing a hyperplane through data. If such a hyperplane exists, the perceptron will eventually find it (it converges). If not, it will oscillate forever without finding a solution.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Neuron Models and Their Limitations</h2>

            <DefBlock label="McCulloch-Pitts Neuron">
                A binary threshold unit: given inputs <InlineMath tex="x_1,\ldots,x_n \in \\{0,1\\}" /> and weights
                <InlineMath tex="w_1,\ldots,w_n \in \mathbb{R}" /> and threshold <InlineMath tex="\theta \in \mathbb{R}" />,
                output = 1 iff <InlineMath tex="\sum_i w_i x_i \geq \theta" />. This is equivalent to
                <InlineMath tex="\text{sign}(\mathbf{w}^\top \mathbf{x} - \theta)" />.
                The unit is called a <strong>linear threshold gate (LTG)</strong>.
            </DefBlock>

            <h3>Boolean Function Representation</h3>
            <p>
                Any boolean function on n inputs can be represented as a network of LTGs (Post machine theorem).
                For small n, enumerating all 2<sup>2ⁿ</sup> boolean functions shows which are linearly separable:
            </p>
            <ul>
                <li>n=1: 4 functions (identity, NOT, constant-0, constant-1) — all LTG-representable</li>
                <li>n=2: 16 total functions; only 4 are non-separable: XOR (⊕) and its complement XNOR</li>
                <li>n=3: Only ~104 of 256 functions are linearly separable</li>
                <li>As n grows, the fraction of linearly separable functions approaches zero exponentially</li>
            </ul>

            <h3>Perceptron Convergence Theorem</h3>
            <p>
                The perceptron learning algorithm converges in finite steps if the training data is <strong>linearly separable</strong>.
                The proof (Block & Novikoff, 1962) shows the number of mistakes is bounded by <InlineMath tex="R^2 / \gamma^2" />,
                where R is the maximum norm of any input and γ is the margin (distance from the nearest point to the hyperplane).
            </p>
            <p>
                If data is <em>not</em> linearly separable, the perceptron makes infinitely many mistakes — it never converges.
            </p>

            <h3>The XOR Problem Formally</h3>
            <p>
                XOR truth table (inputs x₁, x₂; output y = x₁ ⊕ x₂):
            </p>
            <table className="ch1-truth-table">
                <thead>
                    <tr>
                        <th>x₁</th><th>x₂</th><th>y = x₁ ⊕ x₂</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td></tr>
                </tbody>
            </table>
            <p>
                No vector <strong>w</strong> and bias b satisfy <InlineMath tex="\text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />
                for all four points simultaneously. Geometrically: the positive examples (0,1) and (1,0) lie at opposite
                corners of the unit square, with the negative examples (0,0) and (1,1) forming the other diagonal — no
                straight line separates them.
            </p>

            <h3>Capacity of a Single Perceptron</h3>
            <p>
                The maximum number of points in d dimensions that can be perfectly shattered (separated in all 2<sup>k</sup> possible labelings) by a single hyperplane is d + 1 (the VC dimension of a linear threshold in d dimensions).
                This means a single perceptron has limited expressive power — it cannot distinguish complex pattern classes without help from hidden layers.
            </p>

            <div className="ch1-callout">
                <strong>Key insight:</strong> XOR requires at least two threshold decisions combined non-linearly.
                A two-layer network (one hidden layer) can solve XOR by representing it as:
                <InlineMath tex="x_1 \oplus x_2 = (x_1 \land \lnot x_2) \lor (\lnot x_1 \land x_2)" />.
                But Minsky & Papert showed that <em>training</em> such networks was intractable without an efficient
                gradient signal — a problem only solved by backpropagation in 1986.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── McCulloch-Pitts Neuron ──────────────────────────────────────────────────
# All-or-nothing threshold logic. Output is 1 if weighted sum >= threshold.

def mp_neuron(inputs, weights, threshold):
    """McCulloch-Pitts neuron: fires if sum(w_i * x_i) >= threshold"""
    return int(sum(w * x for w, x in zip(weights, inputs)) >= threshold)

# Logical AND: fire only when both inputs are 1
# weights = [1, 1], threshold = 2
print("AND gate:")
print(f"  [0,0] -> {mp_neuron([0,0], [1,1], 2)}")  # 0
print(f"  [0,1] -> {mp_neuron([0,1], [1,1], 2)}")  # 0
print(f"  [1,0] -> {mp_neuron([1,0], [1,1], 2)}")  # 0
print(f"  [1,1] -> {mp_neuron([1,1], [1,1], 2)}")  # 1 ✓

# Logical OR: fire if at least one input is 1
# weights = [1, 1], threshold = 1
print("\\nOR gate:")
print(f"  [0,0] -> {mp_neuron([0,0], [1,1], 1)}")  # 0
print(f"  [0,1] -> {mp_neuron([0,1], [1,1], 1)}")  # 1 ✓
print(f"  [1,0] -> {mp_neuron([1,0], [1,1], 1)}")  # 1 ✓
print(f"  [1,1] -> {mp_neuron([1,1], [1,1], 1)}")  # 1 ✓

# ── Perceptron Learning Rule ────────────────────────────────────────────────
# Mistake-driven: update weights when the prediction is wrong.

def perceptron_train(X, y, lr=0.1, epochs=100):
    """
    Train a perceptron using the Rosenblatt rule.
    X: (n_samples, n_features), y: (n_samples,) ∈ {+1, -1}
    Returns: (weights, bias)
    """
    n_features = X.shape[1]
    w = np.zeros(n_features)
    b = 0.0

    for _ in range(epochs):
        for xi, yi in zip(X, y):
            z = np.dot(w, xi) + b
            y_hat = np.sign(z) if z != 0 else 1
            if yi * y_hat <= 0:        # misclassified
                w += lr * yi * xi
                b += lr * yi

    return w, b

def perceptron_predict(X, w, b):
    z = np.dot(X, w) + b
    return np.where(z >= 0, 1, -1)

# ── Test on linearly separable data ─────────────────────────────────────────
# AND is linearly separable → perceptron will learn it
X_and = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y_and = np.array([-1,  -1,  -1,   1])

w, b = perceptron_train(X_and, y_and, lr=0.1, epochs=200)
preds = perceptron_predict(X_and, w, b)
print(f"\\nPerceptron AND: {preds} (targets: {y_and})")
print(f"Weights: {w}, bias: {b}")

# ── XOR: NOT linearly separable → perceptron fails ───────────────────────────
X_xor = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y_xor = np.array([-1,   1,   1,  -1])  # XOR: 1 iff exactly one input is 1

w_xor, b_xor = perceptron_train(X_xor, y_xor, lr=0.1, epochs=1000)
preds_xor = perceptron_predict(X_xor, w_xor, b_xor)
print(f"\\nPerceptron XOR: {preds_xor} (targets: {y_xor})")
print(f"Never converges — no hyperplane exists!")`

function PythonTab() {
    return (
        <>
            <p>
                Pure NumPy implementations of the McCulloch-Pitts neuron and Rosenblatt perceptron.
                No PyTorch needed — these are the original, hand-implemented algorithms.
            </p>
            <CodeBlock code={PY_CODE} filename="mcp_perceptron.py" lang="python" langLabel="Python" />
            <div className="ch1-callout">
                <strong>Note:</strong> The XOR experiment will never converge — the perceptron oscillates
                indefinitely because no hyperplane exists. This is the exact failure Minsky & Papert proved.
            </div>
        </>
    )
}

const TS_CODE = `// ── McCulloch-Pitts Neuron ───────────────────────────────────────────────
type Vec = number[];

/** Fires if sum(w_i * x_i) >= threshold */
function mpNeuron(inputs: Vec, weights: Vec, threshold: number): number {
  const sum = inputs.reduce((acc, x, i) => acc + weights[i] * x, 0);
  return sum >= threshold ? 1 : 0;
}

// AND gate: w=[1,1], θ=2
console.log("AND:", mpNeuron([0,0],[1,1],2),  // 0
                 mpNeuron([0,1],[1,1],2),   // 0
                 mpNeuron([1,0],[1,1],2),   // 0
                 mpNeuron([1,1],[1,1],2));  // 1

// OR gate: w=[1,1], θ=1
console.log("OR:",  mpNeuron([0,0],[1,1],1),  // 0
                 mpNeuron([0,1],[1,1],1),   // 1
                 mpNeuron([1,0],[1,1],1),   // 1
                 mpNeuron([1,1],[1,1],1));  // 1

// ── Perceptron (Rosenblatt, 1957) ──────────────────────────────────────────

interface DataPoint { x: Vec; y: number } // y ∈ {+1, -1}

function sign(z: number): number { return z >= 0 ? 1 : -1; }

function perceptronStep(
  point: DataPoint, w: Vec, b: number, lr: number
): { w: Vec; b: number; updated: boolean } {
  const z = point.x.reduce((s, xi, i) => s + w[i] * xi, 0) + b;
  const yHat = sign(z);

  if (point.y * yHat <= 0) {          // misclassified → update
    return {
      w: w.map((wi, i) => wi + lr * point.y * point.x[i]),
      b: b + lr * point.y,
      updated: true,
    };
  }
  return { w, b, updated: false };
}

function trainPerceptron(
  data: DataPoint[], lr = 0.1, epochs = 200
): { w: Vec; b: number } {
  const n = data[0].x.length;
  let w = new Array(n).fill(0);
  let b = 0;

  for (let e = 0; e < epochs; e++) {
    let mistakes = 0;
    for (const pt of data) {
      const { w: w2, b: b2, updated } = perceptronStep(pt, w, b, lr);
      w = w2; b = b2;
      if (updated) mistakes++;
    }
    if (mistakes === 0) { console.log(\`Converged at epoch \${e}\`); break; }
  }
  return { w, b };
}

function predict(w: Vec, b: number, x: Vec): number {
  const z = x.reduce((s, xi, i) => s + w[i] * xi, 0) + b;
  return sign(z);
}

// ── AND is linearly separable ───────────────────────────────────────────────
const andData: DataPoint[] = [
  { x: [0,0], y: -1 },
  { x: [0,1], y: -1 },
  { x: [1,0], y: -1 },
  { x: [1,1], y:  1 },
];

const { w: wAnd, b: bAnd } = trainPerceptron(andData);
console.log("AND predictions:", andData.map(p => predict(wAnd, bAnd, p.x)));
// → [-1, -1, -1, 1] ✓

// ── XOR is NOT linearly separable ──────────────────────────────────────────
const xorData: DataPoint[] = [
  { x: [0,0], y: -1 },
  { x: [0,1], y:  1 },
  { x: [1,0], y:  1 },
  { x: [1,1], y: -1 },
];

const { w: wXor, b: bXor } = trainPerceptron(xorData, 0.1, 200);
console.log("XOR predictions:", xorData.map(p => predict(wXor, bXor, p.x)));
// → oscillates, never gets all 4 right — no separating hyperplane exists!`

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript implementations of the McCulloch-Pitts neuron and perceptron.
                No libraries — just arrays and math, matching the 1957 paper exactly.
            </p>
            <CodeBlock code={TS_CODE} filename="mcp-perceptron.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch1-callout">
                <strong>Historical note:</strong> In 1957, Rosenblatt implemented the perceptron in
                hardware (the Mark I) using potentiometers and motors. The weights were literally
                turned by electric motors when mistakes were made. Today's equivalent runs on a GPU
                in microseconds.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const MCCULLOCH_PITTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
