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
            <div className="ch-tl-section-label">The challenge</div>
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
            year: "1943 – 1956",
            title: "From McCulloch-Pitts to the Need for Learning",
            challenge:
                "McCulloch and Pitts (1943) had shown that networks of threshold neurons could compute any logical function. Hebb (1949) had proposed a biological mechanism for learning. But no one had combined these ideas into a working machine that could actually be trained from data. The gap between 'can compute anything' (a static logical circuit) and 'can learn anything from examples' (a trainable machine) was enormous. Hebb's rule was biologically motivated but had no convergence guarantees and no error signal. What was needed was a systematic algorithm for adjusting weights to match observed data.",
            what:
                "During 1943-1956, several related threads converged. Norbert Wiener's Cybernetics (1948) established feedback as the mechanism of goal-directed behaviour. Von Neumann's automata theory connected neural computation to Turing machines. Donald Mackay (1951) proposed error-correcting feedback in artificial networks. The theoretical groundwork was being laid for a machine that would not just compute a fixed function but would learn from its mistakes through systematic weight adjustment.",
            impact:
                "This pre-history established the conceptual vocabulary: feedback, error, correction, learning. The perceptron would synthesise all of it into a single concrete algorithm with a hardware implementation. The key insight — that learning could be mistake-driven (adjust only when wrong) rather than always-on (Hebbian) — came from thinking about classification as an error-minimisation problem.",
        },
        {
            year: "1957 – 1958",
            title: "Rosenblatt — The Mark I Perceptron",
            challenge:
                "Frank Rosenblatt, a psychologist and neuroscientist at the Cornell Aeronautical Laboratory, was reading both McCulloch-Pitts and Hebb. He wanted to build a machine that could learn to recognise patterns — not just compute a fixed logical function, but actually adapt to training data. The challenge was practical: how do you translate Hebb's vague 'neurons that fire together wire together' into a precise algorithm that converges to a correct solution in finite time?",
            what:
                "Rosenblatt built the Mark I Perceptron in 1957 — physical hardware with 400 photocells as input sensors, connected via adjustable potentiometers (motor-driven resistors) to 512 output units. The perceptron learning rule: for each training example (x, y), compute prediction y-hat = sign(w-transpose x + b). If y-hat equals y, do nothing. If wrong: update w += eta times y times x, and b += eta times y. The rule is mistake-driven — weights change only on errors — and converges to a perfect classifier if one exists. Rosenblatt called this a 'self-organising system'.",
            impact:
                "The perceptron was the first demonstration that a machine could learn a pattern classification task from examples without being explicitly programmed. The New York Times (July 8, 1958) ran the headline 'New Navy Device Learns by Doing.' It attracted enormous funding from ARPA and ONR. Rosenblatt's 1958 paper 'The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain' became one of the most cited in the history of AI.",
        },
        {
            year: "1958 – 1960",
            title: "Widrow and Hoff — The LMS Rule and ADALINE",
            challenge:
                "Rosenblatt's perceptron used discrete binary updates: the weight moved by a fixed amount in the correct direction. This was robust and simple, but it converged slowly and oscillated near the solution boundary. Bernard Widrow at Stanford asked: what if the update used the actual magnitude of the error, not just its sign? Could continuous gradient information improve convergence and generalise better?",
            what:
                "Widrow and Ted Hoff (1960) introduced the Least Mean Squares (LMS) algorithm and the ADALINE (Adaptive Linear Neuron) device. Instead of Rosenblatt's discrete update, LMS uses the error magnitude: Delta-w = eta times (y minus y-hat) times x, where y-hat is the continuous linear output (before thresholding). This is equivalent to gradient descent on the mean squared error loss. They also built MADALINE (Multiple ADALINE) — networks of adaptive linear neurons deployed for real applications: telephone echo cancellation (still used today), radar signal processing, and character recognition.",
            impact:
                "LMS/Widrow-Hoff is mathematically equivalent to gradient descent on mean squared error — the direct precursor to backpropagation. MADALINE (1963) was the first multilayer network trained with a systematic algorithm, predating Rumelhart's backpropagation by 23 years. Widrow's echo canceller, patented in 1965, is implemented in every telephone switching system and remains one of the most commercially successful applications of neural network ideas. The Widrow-Hoff rule is still taught as a fundamental adaptive filtering algorithm in digital signal processing.",
        },
        {
            year: "1962",
            title: "Block and Novikoff — The Convergence Theorem",
            challenge:
                "Rosenblatt claimed the perceptron would converge, and empirical experiments supported this claim. But there was no mathematical proof. Without a proof, the guarantee could break down for adversarial data, unusual weight initialisations, or specific orderings of training examples. Skeptics could reasonably question whether the perceptron was merely empirically reliable or provably correct.",
            what:
                "Block (1962) and Novikoff (1962) independently proved the perceptron convergence theorem: if the training data is linearly separable with margin gamma (the distance from the nearest point to the optimal separating hyperplane), and if all inputs have norm at most R, then the perceptron learning algorithm makes at most R-squared divided by gamma-squared mistakes, regardless of training order. After at most that many mistakes, it converges to a perfect classifier.",
            impact:
                "The convergence theorem established the perceptron as a mathematically guaranteed algorithm — not just an empirical heuristic. This was the first convergence proof for a neural network learning algorithm. The bound R-squared divided by gamma-squared reveals something important: the larger the margin, the faster the convergence. This insight directly motivates the Support Vector Machine (Vapnik and Cortes, 1995) — find not just any separating hyperplane, but the one with the maximum margin. The SVM is the perceptron with a margin objective.",
        },
        {
            year: "1969",
            title: "Minsky and Papert — The Formal Critique",
            challenge:
                "The decade of the 1960s had seen enormous excitement and investment in perceptrons. Rosenblatt's claims had grown increasingly ambitious — he suggested perceptrons might eventually explain perception, memory, and cognition. This triggered a backlash from symbolic AI researchers who believed logical rule-based systems were the right approach. Minsky and Papert, both at MIT, mounted a systematic mathematical critique.",
            what:
                "Minsky and Papert's 'Perceptrons: An Introduction to Computational Geometry' (1969) proved: (1) single-layer perceptrons cannot compute XOR or any non-linearly-separable predicate; (2) computing the predicate 'does this image contain a connected figure?' requires order-n connections where n is the number of input pixels — making it computationally intractable for local perceptrons; (3) adding hidden layers ('higher-order perceptrons') exponentially multiplied the number of weights needed. Their analysis was correct but applied only to the training algorithms of 1969.",
            impact:
                "The book effectively ended federal funding for neural network research for a decade — the first AI Winter. Researchers pivoted to symbolic AI and expert systems. The critique was technically correct for 1969 algorithms. What Minsky and Papert could not know was that backpropagation (Rumelhart, Hinton, Williams 1986) would solve the hidden-layer training problem. A 2-layer network with 2 hidden units and sigmoid activations solves XOR trivially — Minsky's own student Rumelhart demonstrated this. The limitation was never the architecture; it was the training algorithm.",
        },
        {
            year: "1986 – present",
            title: "Backpropagation — The Resolution",
            challenge:
                "Minsky and Papert had correctly identified that hidden layers needed an efficient gradient signal to train. The gradient of the output error with respect to the weights in a hidden layer involves multiplying by all downstream weights — a chain rule calculation. Computing this efficiently for networks with many hidden layers seemed to require exponential time. Was there a smarter way?",
            what:
                "Rumelhart, Hinton, and Williams (1986) published 'Learning representations by back-propagating errors' in Nature. They showed that the chain rule, applied backward from the output through each layer, could compute the gradient of the loss with respect to every weight in O(number of weights) time — linear, not exponential. The key insight: store intermediate activations during the forward pass, then reuse them to compute gradients in the backward pass. This is the backpropagation algorithm, independently discovered earlier by Linnainmaa (1970), Werbos (1974), and Parker (1985).",
            impact:
                "Backpropagation ended the AI Winter for neural networks. By 1989, Yann LeCun had applied it to convolutional networks reading handwritten zip codes for the US Postal Service. By 1997, LSTMs used backpropagation through time for sequence modelling. By 2012, AlexNet used backpropagation to train 60 million parameters on ImageNet. The perceptron's learning rule — mistake-driven weight update — extended through hidden layers by the chain rule, scaled from Rosenblatt's 400 inputs to GPT-4's hundreds of billions of parameters.",
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
            <h2>The machine that could learn from mistakes</h2>

            <Analogy label="Guessing a secret number">
                Think of a game where someone thinks of a secret number between 1 and 100 and you have to guess it. If you guess 60 and they say "higher," you know you need a bigger number next time. So you adjust upward. If they say "lower," you adjust downward.
                <br /><br />
                The perceptron works the same way: it makes a prediction, gets told whether it is right or wrong, and adjusts its internal settings slightly in the direction that would have been correct. Repeat this enough times with enough examples and it gets very good.
            </Analogy>

            <Analogy label="Finding the right line through the dots">
                Imagine you are trying to draw a single straight line that separates cats from dogs on a piece of graph paper. Some drawings are right, others are wrong. The perceptron learning rule works like this: if a cat ends up on the wrong side of the line, you shift the line a little toward the cat. If a dog ends up on the wrong side, you shift away.
                <br /><br />
                <strong>The catch:</strong> this only works if there IS a straight line that separates the groups. If cats and dogs are completely mixed together, no single line will work — and the perceptron will never converge. This is exactly the XOR problem.
            </Analogy>

            <Analogy label="Rosenblatt's room-sized learning machine">
                In 1957, Rosenblatt did not write a computer program — he built a physical machine the size of a small room. 400 light sensors fed signals into a wall of circuits. When it made a mistake, electric motors physically turned knobs (the weights) by small amounts. It could learn to tell the difference between simple shapes — a huge achievement at the time, even though today's smartphones are billions of times more powerful.
                <br /><br />
                The New York Times ran the headline: "New Navy Device Learns by Doing." It attracted massive government funding. Researchers believed they were a few years away from machines that could see, talk, and think. They were wrong — but for a specific reason.
            </Analogy>

            <Analogy label="Widrow-Hoff — a smoother version of learning">
                Rosenblatt's perceptron moved by a fixed amount each time it was wrong. Bernard Widrow (1960) asked: what if the size of the adjustment depended on how wrong you were? If you're only slightly wrong, make a small correction. If you're very wrong, make a large correction.
                <br /><br />
                This smoother version — the Widrow-Hoff rule — is equivalent to gradient descent on mean squared error. Widrow's version of the idea is still used today in every telephone call you make: his "echo canceller" removes the echo that would otherwise occur in telephone lines, and it uses exactly this adaptive learning rule.
            </Analogy>

            <Analogy label="What the perceptron cannot do — and why it matters">
                The perceptron draws one straight line. One line can separate many things: large numbers from small, images with mostly red from images with mostly blue. But some things cannot be separated by any single line — and XOR is the classic example.
                <br /><br />
                XOR says YES when exactly one of two switches is on (not both, not neither). The four cases form a pattern that no straight line can divide correctly. Minsky proved this mathematically in 1969, and research funding dried up. But the solution existed: use multiple lines (multiple layers). The missing piece was an efficient way to train hidden layers — which backpropagation provided in 1986.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>How the Perceptron Learns</h2>

            <DiagramBlock title="Single-layer perceptron — inputs, weights, threshold, binary output">
                <PerceptronDiagramSVG />
            </DiagramBlock>

            <h3>The Learning Algorithm</h3>
            <p>
                For each training example (x, y) where y is in &#123;+1, -1&#125;:
            </p>
            <ol>
                <li><strong>Compute prediction:</strong> <InlineMath tex="\hat{y} = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" /></li>
                <li><strong>If correct</strong> (y times y-hat is greater than 0): do nothing</li>
                <li><strong>If wrong</strong> (y times y-hat is at most 0): update weights and bias:
                    <MathBlock tex="\mathbf{w} \leftarrow \mathbf{w} + \eta\, y\, \mathbf{x}" />
                    <MathBlock tex="b \leftarrow b + \eta\, y" />
                </li>
            </ol>

            <h3>Geometric Intuition</h3>
            <p>
                Each weight update moves the decision hyperplane slightly toward the correct side of the
                misclassified point. The term y times x says: "move the boundary in the direction of this point,
                toward the side with label y." After finitely many such corrections (if the data is linearly separable),
                the boundary will correctly classify all training examples.
            </p>

            <h3>Convergence</h3>
            <p>
                If the data is linearly separable with margin gamma and all inputs have norm at most R, the perceptron
                converges in at most R<sup>2</sup>/gamma<sup>2</sup> mistakes (Block-Novikoff theorem). If data is not linearly
                separable, it oscillates forever without settling.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Key limitation:</strong> The perceptron can only learn hyperplanes. It will <em>never</em> solve XOR because XOR points cannot be separated by a single straight line. You need at least one hidden layer of neurons with nonlinear activations to bend the decision boundary. Backpropagation (1986) provided the training algorithm that makes hidden layers practical.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Block-Novikoff theorem · margin · VC dimension</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">NumPy perceptron · AND convergence · XOR failure</span>
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
            <h2>Perceptron: Theory and Limitations</h2>

            <DefBlock label="Perceptron Model">
                A single-layer perceptron computes:
                <MathBlock tex="f(\mathbf{x}) = \text{sign}(\mathbf{w}^\top \mathbf{x} + b)" />
                where sign(z) = +1 if z is at least 0 and -1 otherwise.
                The decision boundary is the hyperplane <InlineMath tex="\mathbf{w}^\top \mathbf{x} + b = 0" />.
            </DefBlock>

            <h3>Block-Novikoff Convergence Theorem</h3>
            <p>
                Assume there exists a unit vector u and margin gamma greater than 0 such that
                <InlineMath tex="y_i(\mathbf{u}^\top \mathbf{x}_i) \geq \gamma" /> for all training examples.
                Let R = max norm of x-i. Then the perceptron makes at most:
            </p>
            <MathBlock tex="\text{mistakes} \leq \left(\frac{R}{\gamma}\right)^2" />
            <p>
                mistakes before converging to a perfect classifier. The proof constructs a potential function:
                at each mistake, the inner product w-t-plus-1 dotted with u increases by at least gamma, while
                the norm of w grows by at most R-squared. After T mistakes, w-T dotted with u is at least T times gamma
                while the norm of w-T is at most T times R. This gives a contradiction for T greater than R-squared divided
                by gamma-squared.
            </p>

            <h3>Connection to SVM</h3>
            <p>
                The perceptron finds <em>any</em> separating hyperplane. The SVM (Vapnik and Cortes, 1995) finds the one with
                maximum margin gamma: maximise gamma subject to y-i times (w-transpose x-i + b) is at least gamma times norm of w.
                This is exactly the quantity in the convergence bound — maximum margin gives the fewest mistakes during learning.
            </p>
            <MathBlock tex="\text{SVM: } \max_{w,b} \frac{1}{\|w\|} \quad \text{subject to } y_i(w^\top x_i + b) \geq 1 \;\forall i" />

            <h3>VC Dimension and Generalisation</h3>
            <p>
                The VC dimension of a linear threshold in d dimensions is d + 1. This means a perceptron in d dimensions can correctly classify all 2<sup>d+1</sup> possible labelings of d + 1 points in general position, but not all 2<sup>d+2</sup> labelings of d + 2 points. By the fundamental theorem of statistical learning:
            </p>
            <MathBlock tex="\text{generalisation error} \leq \text{empirical error} + O\!\left(\sqrt{\frac{d \ln n}{n}}\right)" />
            <p>
                With n much larger than d, the generalisation error is close to the training error — the perceptron generalises well when it has many more examples than features.
            </p>

            <div className="ch-callout">
                <strong>Resolution (1986):</strong> Rumelhart, Hinton, and Williams showed that backpropagation provides exactly the gradient signal needed to train hidden layers. A 2-layer network with 2 hidden units can solve XOR trivially with learned weights. The crisis was not the architecture — it was the lack of a training algorithm. Backpropagation solved both problems simultaneously.
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
    Returns: (weights, bias, number of epochs until convergence)
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
                w += lr * yi * xi          # Rosenblatt update
                b += lr * yi
                mistakes += 1
        if mistakes == 0:
            print(f"Converged in {epoch + 1} epochs")
            return w, b, epoch + 1
    print(f"Did not converge in {max_epochs} epochs")
    return w, b, max_epochs

# ── AND (linearly separable -> converges) ────────────────────────────────────
X_and = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y_and = np.array([-1, -1, -1,  1])
w, b, epochs = perceptron_train(X_and, y_and)
print("AND predictions:", perceptron_predict(X_and, w, b))  # [-1 -1 -1  1]

# ── XOR (NOT linearly separable -> never converges) ─────────────────────────
X_xor = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y_xor = np.array([-1,  1,  1, -1])
w_xor, b_xor, _ = perceptron_train(X_xor, y_xor, max_epochs=500)
print("XOR predictions (after 500 epochs):", perceptron_predict(X_xor, w_xor, b_xor))
# -> will never get all 4 correct simultaneously

# ── Widrow-Hoff (LMS / Delta Rule) ─────────────────────────────────────────
# Uses continuous error magnitude, not binary mistake signal
def lms_train(X, y, lr=0.01, epochs=500):
    """
    Widrow-Hoff LMS rule: delta_w = eta * (y - y_hat) * x
    y_hat is the continuous linear output (before thresholding).
    Equivalent to gradient descent on MSE.
    """
    w = np.zeros(X.shape[1])
    b = 0.0
    for _ in range(epochs):
        for xi, yi in zip(X, y):
            y_hat_cont = np.dot(w, xi) + b   # continuous output
            error = yi - y_hat_cont
            w += lr * error * xi             # proportional to error magnitude
            b += lr * error
    return w, b

w_lms, b_lms = lms_train(X_and, y_and.astype(float))
print("\\nLMS (Widrow-Hoff) AND predictions:",
      perceptron_predict(X_and, w_lms, b_lms))

# ── Block-Novikoff bound: theoretical max mistakes ────────────────────────────
# For AND gate: optimal margin hyperplane separates with some margin gamma
# For AND: a separating hyperplane exists with w=[1,1], b=-1.5
# Margin gamma = distance from nearest point to hyperplane
w_opt = np.array([1.0, 1.0])
b_opt = -1.5
# Margin = min_i y_i * (w'x_i + b) / ||w||
margins = y_and * (X_and @ w_opt + b_opt) / np.linalg.norm(w_opt)
gamma = margins.min()
R = np.linalg.norm(X_and, axis=1).max()
max_mistakes_bound = int(np.ceil((R / gamma)**2))
print(f"\\nBlock-Novikoff bound: at most {max_mistakes_bound} mistakes for AND")`

function PythonContent() {
    return (
        <>
            <p>
                Rosenblatt's perceptron and Widrow-Hoff's LMS rule implemented in NumPy. AND converges to a separating hyperplane; XOR oscillates indefinitely. The Block-Novikoff bound gives the theoretical maximum number of mistakes.
            </p>
            <CodeBlock code={PY_CODE} filename="perceptron.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Run it:</strong> The XOR experiment will never reach zero mistakes — no matter how long you train. The Block-Novikoff calculation shows that for AND (which has a comfortable margin), convergence is guaranteed in very few steps. For XOR (which has no separating hyperplane), the bound is infinite.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const PERCEPTRON_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
