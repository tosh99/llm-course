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
            year: "1900 – 1943",
            title: "Cajal, Sherrington, and the Neuron Doctrine",
            challenge:
                "Chapter 1 traced the statistical tradition: from Gauss's least squares (1801) through Pearson's correlation and PCA (1901), Fisher's maximum likelihood (1922), and Cox's logistic regression (1958). All of these methods shared one assumption — the model class (linear, logistic) was chosen by the researcher. The next question was more radical: could a machine choose its own internal representation, inspired not by statistics but by biology? The answer required understanding how the brain itself processed information. In the early 20th century, that understanding was just arriving.",
            what:
                "Santiago Ramon y Cajal's histological studies (1900-1911) established neurons as discrete processing units — the neuron doctrine. He showed that the nervous system is made of individual cells communicating across synaptic gaps, not a continuous network. Charles Sherrington (1906) coined the word 'synapse' and showed that neurons integrate excitatory and inhibitory inputs. These biological facts — discrete units, weighted inputs, threshold firing — would become the mathematical primitives of artificial neural networks.",
            impact:
                "The neuron doctrine established the biological unit of computation: a cell that sums its inputs and fires if the sum exceeds a threshold. This is exactly the McCulloch-Pitts neuron. Biology had been running neural networks for 500 million years; mathematicians were about to formalise why they worked. The key insight — that information processing could be understood in terms of discrete threshold units — was waiting to be abstracted from biology into mathematics.",
        },
        {
            year: "1943",
            title: "McCulloch and Pitts — A Logical Calculus of Nervous Activity",
            challenge:
                "How does a nervous system made of discrete cells, each firing or not firing, produce the complex behaviour of a whole organism? The gap between a single neuron and cognition seemed insurmountable without a formal bridge. Warren McCulloch, a neurophysiologist at the Illinois Neuropsychiatric Institute, had spent years thinking about this. Walter Pitts, a 17-year-old mathematical prodigy who had run away from home to become Bertrand Russell's informal student at the University of Chicago, provided the formal logic.",
            what:
                "McCulloch and Pitts proposed a simplified neuron model: inputs are binary (0 or 1), each has a fixed weight (positive for excitatory, negative for inhibitory), the neuron fires (output = 1) if the weighted sum meets or exceeds a threshold theta. In their 1943 paper 'A Logical Calculus of the Ideas Immanent in Nervous Activity', they showed how to wire these neurons to compute any logical proposition — AND, OR, NOT, and by composition, any boolean function. They also noted the formal equivalence to Turing machines: networks of McCulloch-Pitts neurons are computationally universal.",
            impact:
                "This was the conceptual birth of both computational neuroscience and artificial neural networks. It established the neuron as a thresholded weighted sum — a model so simple it could be analysed mathematically, yet expressive enough to be the foundation of everything that followed. Every artificial neuron ever built traces its direct intellectual lineage to this 1943 paper. The idea that biological neurons could be abstracted into mathematical objects with defined computation was the first step toward the entire field of deep learning.",
        },
        {
            year: "1948 – 1950",
            title: "Turing, von Neumann, and the Macy Conferences",
            challenge:
                "McCulloch and Pitts had shown that neural networks could compute — in principle. But the concept of a 'learning' machine, one that could modify its own connections based on experience, was still absent. Alan Turing was independently thinking about machine intelligence at Bletchley Park and then Manchester. John von Neumann was working on stored-program computers and also reading the McCulloch-Pitts paper carefully. The Macy Conferences (1946-1953) brought these thinkers together.",
            what:
                "Turing's 1948 report 'Intelligent Machinery' proposed 'unorganised machines' — random neural networks that could be trained by a teacher. He described two types: B-type machines that could learn connections through reinforcement, and A-type machines that could be broken and reorganised. His 1950 paper 'Computing Machinery and Intelligence' introduced the Turing Test. Von Neumann's 1951 lectures on automata theory showed how McCulloch-Pitts networks related to formal computation. Norbert Wiener's Cybernetics (1948) introduced the idea of feedback as the mechanism of goal-directed behaviour.",
            impact:
                "Turing's unorganised machines were the first proposal for a trainable neural network — predating Rosenblatt's perceptron by nearly a decade. His insight that intelligence might emerge from random networks trained by reinforcement anticipated modern deep reinforcement learning. The Macy Conferences created the cross-disciplinary foundation: neuroscience (McCulloch), computation (Turing, von Neumann), information theory (Shannon), and cybernetics (Wiener) all converged on the same question — how does a physical system process information in a goal-directed way?",
        },
        {
            year: "1949",
            title: "Hebb — The Biological Learning Rule",
            challenge:
                "The McCulloch-Pitts neuron was a static logical circuit — its weights had to be set by hand. How could synaptic strengths change based on experience? How does the brain encode memory without a central programmer setting every synapse? Donald Hebb, a Canadian psychologist at McGill University, published his answer in 'The Organization of Behavior' — a book that would influence AI as much as neuroscience.",
            what:
                "Hebb's central postulate: when neuron A repeatedly and persistently takes part in firing neuron B, some growth process or metabolic change occurs in one or both cells such that A's efficiency in firing B is increased. The modern shorthand: 'Neurons that fire together, wire together.' Mathematically: Delta-w-ij = eta times x-i times y-j. If both the presynaptic neuron i and postsynaptic neuron j are active simultaneously, the synaptic weight between them increases by a small amount. The rule is local — it depends only on the activity of the two connected neurons, not on any global error signal.",
            impact:
                "Hebb's rule was the first scientifically grounded theory of synaptic plasticity. It explained how experience could physically alter the brain. It also inspired every artificial learning rule — from the perceptron's weight updates to modern backpropagation, all are Hebbian in spirit: reinforce connections that contribute to correct output. Oja (1982) showed that Hebb's rule with normalisation converges to the first principal component of the input — connecting Hebbian learning directly to PCA from Chapter 1.",
        },
        {
            year: "1957 – 1958",
            title: "Rosenblatt — The Mark I Perceptron and the Learning Rule",
            challenge:
                "McCulloch-Pitts neurons required hand-tuned weights. Hebbian learning was biologically plausible but had no guarantee of convergence to a correct solution. There was no algorithm that could automatically learn the right weights from labelled examples — a machine that could look at examples, make mistakes, and improve. Frank Rosenblatt, a psychologist at the Cornell Aeronautical Laboratory, set out to build one.",
            what:
                "Rosenblatt built the Mark I Perceptron in 1957 — physical hardware with 400 photodetectors connected to 512 output units via adjustable potentiometers (motor-driven resistors that physically changed value). The perceptron learning rule: for a misclassified point with true label y and prediction y-hat, update weights by Delta-w = eta times (y minus y-hat) times x. If the prediction is wrong by +1 (predicted negative when positive), push the weights toward x. If wrong by -1, push away. The rule converges to a separating hyperplane if one exists.",
            impact:
                "The perceptron was the first working implementation of a trainable neural network. The New York Times reported it as 'the first device to think as a human brain.' It attracted enormous ARPA funding. It established the hyperplane as the decision boundary — the geometric primitive underlying SVMs and logistic regression. And it set up the crisis that would come a decade later: because the perceptron can only learn linear functions, and many important functions are not linear.",
        },
        {
            year: "1969",
            title: "Minsky and Papert — The XOR Result and the First AI Winter",
            challenge:
                "Despite the perceptron's success, researchers knew it could only learn linearly separable functions. But no one had rigorously characterised exactly which functions were learnable and which were not. The optimism of the late 1950s had produced excessive claims — military reports spoke of machines that would 'walk, talk, see, write, reproduce itself, and be conscious of its existence.' Critics wanted rigorous limits.",
            what:
                "Marvin Minsky and Seymour Papert published 'Perceptrons: An Introduction to Computational Geometry' (1969), proving mathematically that single-layer perceptrons could not learn the XOR function or any non-linearly-separable function. More damaging: they showed that adding hidden layers — the obvious fix — made training exponentially harder with the algorithms available at the time. The book was rigorous, beautifully written, and devastating to federal funding.",
            impact:
                "Within two years, ARPA funding for neural network research essentially dried up. The field entered its first AI Winter. Researchers pivoted to symbolic AI, expert systems, and logic-based approaches. The neural network field would not recover until Rumelhart, Hinton, and Williams demonstrated backpropagation in 1986. But — critically — Minsky and Papert's analysis was about the algorithm available in 1969, not the architecture. Backpropagation provided exactly what they said was missing: an efficient gradient signal for training hidden layers.",
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
            <h2>What is a neuron, and what does it have to do with AI?</h2>

            <p className="ch-story-intro">
                Chapter 1 traced the statisticians: Gauss, Pearson, Fisher, Cox — people who built mathematical models of data using equations they designed by hand. Chapter 2 follows a completely different group. In 1943, a neurophysiologist and a teenage runaway mathematician asked: what if instead of designing the equations, we copied the brain?
            </p>

            <Analogy label="Your brain's light switches">
                Your brain is made of roughly 86 billion tiny cells called <strong>neurons</strong>. Each one is like a little light switch — it can be OFF (not firing) or ON (firing an electrical signal). When it fires, it sends a tiny zap through a connection called a synapse to neighbouring neurons. Those neurons add up the signals they receive; if the total is big enough, they fire too.
                <br /><br />
                The <strong>McCulloch-Pitts neuron</strong>, published in 1943, was the very first mathematical model of this idea. It was like drawing a picture of a neuron using only logic and arithmetic.
            </Analogy>

            <Analogy label="The simplest decision maker in the world">
                Imagine a tiny robot that looks at two lights — red and green. It has a rule: "if at least 2 lights are on, shout YES; otherwise, stay quiet." That is exactly what a McCulloch-Pitts neuron does: it counts up all its inputs (each multiplied by its importance), and shouts YES if the total meets or exceeds a <strong>threshold</strong>.
                <br /><br />
                With the right thresholds and weights, you can build any logical operation from these simple units: AND (both inputs must be on), OR (either input is enough), NOT (inverts the input). String them together and you can compute anything — McCulloch and Pitts proved this in 1943.
            </Analogy>

            <Analogy label="Hebb's rule — how neurons learn">
                <strong>Donald Hebb</strong> had a brilliant idea in 1949: when two neurons fire at the same time, the connection between them gets stronger. Think of two kids who keep doing homework together — the more they work together, the better they get at coordinating. Hebb said: <em>"Neurons that fire together, wire together."</em>
                <br /><br />
                This is how your brain encodes memories — not by any central programmer rewriting connections, but by local rules at each synapse. Connections that are used together grow stronger; connections that are never activated together weaken. This biological principle inspired every artificial learning rule in AI history.
            </Analogy>

            <Analogy label="Rosenblatt's perceptron — a robot that learns from mistakes">
                <strong>Frank Rosenblatt</strong> in 1957 built the first robot that could actually learn. It worked like this: (1) look at a picture and guess what it is; (2) if wrong, shift your weights slightly in the right direction; (3) repeat until correct. This is the <strong>perceptron learning rule</strong>. It only works when the correct answer is findable by drawing a single straight line between groups — a "linearly separable" problem.
                <br /><br />
                Rosenblatt's machine was not a computer program — it was physical hardware the size of a small room, with motors that actually turned knobs (the weights) when it made mistakes. The New York Times said it was the first machine to think like a brain.
            </Analogy>

            <Analogy label="The XOR problem — when a line isn't enough">
                Here is a trick question. There are four combinations of two switches. The answer is YES when exactly one switch is ON (but not both, not neither). Can you draw a single straight line to separate YES from NO on a grid?
                <br /><br />
                <strong>No!</strong> No matter how you draw the line, at least one YES ends up on the NO side. This is the XOR problem — exclusive OR. A single perceptron drawing one line cannot solve it. Minsky and Papert proved this mathematically in 1969, and funding for neural networks dried up for a decade. The solution — multiple layers — existed in theory, but nobody knew how to train them efficiently. That problem took until 1986 to solve.
            </Analogy>

            <Analogy label="Why this chapter exists — the biological bridge">
                Every neural network in this course is directly descended from the 1943 McCulloch-Pitts neuron. The idea that intelligence can emerge from many simple threshold units — each just adding weighted inputs and firing if the sum is big enough — is the foundation of deep learning. Modern neurons (ReLU units, sigmoid units) are more sophisticated versions of the same concept. The weights are still learned, the threshold is still there, and the network still fires pattern by pattern through millions of connections.
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
                The M-P neuron is the simplest possible artificial neuron. Each input x<sub>i</sub> is either 0 (off) or 1 (on), multiplied by a weight w<sub>i</sub>, summed, and compared to a threshold theta:
            </p>
            <MathBlock tex="\text{output} = \begin{cases} 1 & \text{if } \sum_i w_i x_i \geq \theta \\ 0 & \text{otherwise} \end{cases}" />
            <p>
                By choosing the right weights and threshold, you can build any logical gate:
            </p>
            <ul>
                <li><strong>AND:</strong> w<sub>1</sub> = w<sub>2</sub> = 1, theta = 2 — fires only when both inputs are 1</li>
                <li><strong>OR:</strong> w<sub>1</sub> = w<sub>2</sub> = 1, theta = 1 — fires when at least one input is 1</li>
                <li><strong>NOT:</strong> single input w<sub>1</sub> = -1, theta = -0.5 — fires when input is 0</li>
            </ul>
            <p>
                Any boolean function can be built from AND, OR, NOT gates, meaning M-P neuron networks are computationally complete — equivalent in expressive power to a Turing machine.
            </p>

            <h3>The Perceptron Learning Rule</h3>
            <p>
                The key difference from M-P neurons: the perceptron <em>learns</em> its weights from data. Given input x, true label y in &#123;-1, +1&#125;, and prediction <InlineMath tex="\hat{y} = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />:
            </p>
            <MathBlock tex="\mathbf{w} \leftarrow \mathbf{w} + \eta\,(y - \hat{y})\,\mathbf{x}" />
            <p>
                If the prediction is correct, weights do not change. If wrong, they shift in the direction of the true label by a step size eta (the learning rate). This is a <strong>mistake-driven</strong> learning algorithm: it only updates when it errs.
            </p>

            <h3>Linear Separability</h3>
            <p>
                A perceptron can only learn decision boundaries that are <strong>hyperplanes</strong> — straight lines or their higher-dimensional generalisations. A problem is learnable by a perceptron if and only if positive and negative examples can be separated by a hyperplane.
            </p>
            <p>
                The <strong>XOR</strong> function is not linearly separable — no straight line can separate the positive examples (1,0) and (0,1) from the negative examples (0,0) and (1,1). This is why the perceptron fails on XOR.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The geometric picture:</strong> The perceptron is drawing a hyperplane through data. If such a hyperplane exists, the perceptron will eventually find it (Block-Novikoff convergence theorem). If no separating hyperplane exists, the perceptron oscillates indefinitely — never settling on a solution. The XOR problem is the canonical example of the latter.
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
            <h2>Formal Neuron Models and Their Limitations</h2>

            <DefBlock label="McCulloch-Pitts Neuron">
                A binary threshold unit: given inputs <InlineMath tex="x_1,\ldots,x_n \in \{0,1\}" /> and weights
                <InlineMath tex="w_1,\ldots,w_n \in \mathbb{R}" /> and threshold <InlineMath tex="\theta \in \mathbb{R}" />,
                output = 1 iff <InlineMath tex="\sum_i w_i x_i \geq \theta" />. This is equivalent to
                <InlineMath tex="\text{sign}(\mathbf{w}^\top \mathbf{x} - \theta)" />.
                The unit is called a <strong>linear threshold gate (LTG)</strong>.
            </DefBlock>

            <h3>Boolean Function Representation</h3>
            <p>
                Any boolean function on n inputs can be represented as a network of LTGs (Post machine theorem).
                For small n, enumerating all 2<sup>2n</sup> boolean functions shows which are linearly separable:
            </p>
            <ul>
                <li>n=1: 4 functions (identity, NOT, constant-0, constant-1) — all LTG-representable</li>
                <li>n=2: 16 total functions; only 4 are non-separable: XOR and XNOR</li>
                <li>n=3: only ~104 of 256 functions are linearly separable</li>
                <li>As n grows, the fraction of linearly separable functions approaches zero exponentially</li>
            </ul>

            <h3>Perceptron Convergence Theorem</h3>
            <p>
                The perceptron learning algorithm converges in finite steps if the training data is <strong>linearly separable</strong>.
                The proof (Block and Novikoff, 1962) shows the number of mistakes is bounded by <InlineMath tex="R^2 / \gamma^2" />,
                where R is the maximum norm of any input and gamma is the margin (distance from the nearest point to the hyperplane).
            </p>
            <MathBlock tex="\text{Mistakes} \leq \frac{R^2}{\gamma^2}" />
            <p>
                If data is <em>not</em> linearly separable, the perceptron makes infinitely many mistakes — it never converges.
            </p>

            <h3>The XOR Problem Formally</h3>
            <p>
                XOR truth table (inputs x<sub>1</sub>, x<sub>2</sub>; output y = x<sub>1</sub> XOR x<sub>2</sub>):
            </p>
            <table className="ch-truth-table">
                <thead>
                    <tr>
                        <th>x<sub>1</sub></th><th>x<sub>2</sub></th><th>y = x<sub>1</sub> XOR x<sub>2</sub></th>
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
                No vector w and bias b satisfy <InlineMath tex="\text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />
                for all four points simultaneously. Geometrically: the positive examples (0,1) and (1,0) lie at opposite
                corners of the unit square, with the negative examples (0,0) and (1,1) forming the other diagonal — no
                straight line separates them.
            </p>

            <h3>VC Dimension of a Single Perceptron</h3>
            <p>
                The maximum number of points in d dimensions that can be perfectly shattered (correctly labelled in all 2<sup>k</sup> possible ways) by a single hyperplane is d + 1 (the VC dimension of a linear threshold in d dimensions). This is a measure of expressive power: a perceptron in 2D can shatter at most 3 points, meaning it cannot correctly classify all patterns on 4 points.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> XOR requires at least two threshold decisions combined non-linearly.
                A two-layer network (one hidden layer) can solve XOR by representing it as:
                <InlineMath tex="x_1 \oplus x_2 = (x_1 \land \lnot x_2) \lor (\lnot x_1 \land x_2)" />.
                But Minsky and Papert showed that <em>training</em> such networks was intractable without an efficient
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
print(f"  [1,1] -> {mp_neuron([1,1], [1,1], 2)}")  # 1

# Logical OR: fire if at least one input is 1
# weights = [1, 1], threshold = 1
print("\\nOR gate:")
print(f"  [0,0] -> {mp_neuron([0,0], [1,1], 1)}")  # 0
print(f"  [0,1] -> {mp_neuron([0,1], [1,1], 1)}")  # 1
print(f"  [1,0] -> {mp_neuron([1,0], [1,1], 1)}")  # 1
print(f"  [1,1] -> {mp_neuron([1,1], [1,1], 1)}")  # 1

# ── Perceptron Learning Rule ────────────────────────────────────────────────
# Mistake-driven: update weights when the prediction is wrong.

def perceptron_train(X, y, lr=0.1, epochs=100):
    """
    Train a perceptron using the Rosenblatt rule.
    X: (n_samples, n_features), y: (n_samples,) in {+1, -1}
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
# AND is linearly separable -> perceptron will learn it
X_and = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y_and = np.array([-1,  -1,  -1,   1])

w, b = perceptron_train(X_and, y_and, lr=0.1, epochs=200)
preds = perceptron_predict(X_and, w, b)
print(f"\\nPerceptron AND: {preds} (targets: {y_and})")
print(f"Weights: {w}, bias: {b}")

# ── XOR: NOT linearly separable -> perceptron fails ───────────────────────────
X_xor = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y_xor = np.array([-1,   1,   1,  -1])  # XOR: 1 iff exactly one input is 1

w_xor, b_xor = perceptron_train(X_xor, y_xor, lr=0.1, epochs=1000)
preds_xor = perceptron_predict(X_xor, w_xor, b_xor)
print(f"\\nPerceptron XOR: {preds_xor} (targets: {y_xor})")
print(f"Never converges -- no hyperplane exists!")`

function PythonContent() {
    return (
        <>
            <p>
                Pure NumPy implementations of the McCulloch-Pitts neuron and Rosenblatt perceptron.
                No PyTorch needed — these are the original, hand-implemented algorithms from 1943 and 1957.
            </p>
            <CodeBlock code={PY_CODE} filename="mcp_perceptron.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Note:</strong> The XOR experiment will never converge — the perceptron oscillates
                indefinitely because no separating hyperplane exists. This is the exact failure that Minsky and Papert proved in 1969, leading to the first AI Winter.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MCCULLOCH_PITTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
