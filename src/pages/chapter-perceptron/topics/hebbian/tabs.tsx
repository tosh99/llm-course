import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Hebb's Rule — The Biological Origin of Learning</h2>

            <div className="ch-timeline" style={{ paddingLeft: 26 }}>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1949</div>
                    <div className="ch-tl-title">The Organization of Behavior</div>
                    <div className="ch-tl-section-label">The question</div>
                    <div className="ch-tl-body">
                        How does the brain physically store memories? And how do synaptic connections between neurons change based on experience? There was no mechanistic account of learning in biological neural networks.
                    </div>
                    <div className="ch-tl-section-label">What Hebb proposed</div>
                    <div className="ch-tl-body">
                        Hebb's central postulate: when neuron A repeatedly and persistently takes part in firing neuron B, some growth process or metabolic change occurs in one or both cells such that A's efficiency in firing B is increased. In modern shorthand: <em>"Neurons that fire together, wire together."</em>
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Hebb's rule was the first scientifically grounded theory of synaptic plasticity. It explained how experience could physically alter the brain. It also inspired every artificial learning rule — from the perceptron's weight updates to modern backpropagation, all are Hebbian in spirit: reinforce connections that contribute to desired outcomes.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1957 – 1973</div>
                    <div className="ch-tl-title">From Biology to Engineering</div>
                    <div className="ch-tl-section-label">The bridge</div>
                    <div className="ch-tl-body">
                        researchers quickly translated Hebb's biological intuition into a mathematical rule: <InlineMath tex="\Delta w_{ij} = \eta \cdot x_i \cdot y_j" /> — when presynaptic neuron i fires and postsynaptic neuron j fires, strengthen the connection by η. The term became <strong>Hebbian learning</strong>.
                    </div>
                    <div className="ch-tl-section-label">Key developments</div>
                    <div className="ch-tl-body">
                        <strong>ECHO</strong> (Farley & Selfridge, 1955): first simulation of Hebbian-like reinforcement. <strong>Widrow-Hoff</strong> (1960): the least-mean-square (LMS) rule, a continuous analogue of Hebbian learning with error signals. <strong> SOM</strong> (Kohonen, 1982): self-organising maps using competitive Hebbian learning.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986 – present</div>
                    <div className="ch-tl-title">Hebbian Learning in Deep Networks</div>
                    <div className="ch-tl-section-label">The modern picture</div>
                    <div className="ch-tl-body">
                        Backpropagation is technically not Hebbian — it uses error gradients rather than simultaneous firing. But modern insights reconnect them: <strong>contrastive Hebbian learning</strong>, <strong>TD learning</strong>, and <strong>STDP</strong> (spike-timing-dependent plasticity, Bi & Poo 1998) all show that biological neurons use Hebbian principles. Modern self-supervised methods (e.g., BYOL, SimCLR) are effectively Hebbian — maximising agreement between two views of the same input.
                    </div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How do you teach neurons to get better?</h2>

            <Analogy label="Learning a Dance">
                Imagine you're in a room with 100 people doing different dances. You want to get better at dancing — so you watch the people who dance really well and try to copy their moves. If your dance looked like theirs, you keep doing it. If not, you try something different.
                <br /><br />
                <strong>Hebb's rule</strong> says: the connections in your brain get stronger when you do something and it works. If a connection was already part of the winning dance move, it stays strong.
            </Analogy>

            <Analogy label="Guitar Learning">
                Think of learning to play guitar. When you strum a chord and it sounds right, your fingers get better at making that exact shape next time. The muscles that helped — and the nerve connections that controlled them — all get slightly stronger together.
                <br /><br />
                That's Hebbian learning in your brain: <strong>use it and strengthen it</strong>. Connections that fire at the same time get more efficient together.
            </Analogy>

            <Analogy label="The Problem with Hebbian Learning">
                Here's the tricky part: Hebbian learning on its own just reinforces <em>everything</em>. If two neurons keep firing together, their connection keeps getting stronger — forever. In a real brain, this would lead to runaway excitement, where one neuron firing eventually makes every connected neuron fire.
                <br /><br />
                Real brains have <strong>homeostatic plasticity</strong> — mechanisms that prevent connections from getting too strong. Modern AI networks use <strong>regularisation</strong> for the same reason: to prevent the model from just memorising everything.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The Mathematics of Synaptic Strengthening</h2>

            <h3>Hebb's Postulate (simplified)</h3>
            <p>
                When a presynaptic neuron fires (<InlineMath tex="x_i = 1" />) and the postsynaptic neuron fires
                (<InlineMath tex="y_j = 1" />), the connection between them strengthens:
            </p>
            <MathBlock tex="\Delta w_{ij} = \eta \cdot x_i \cdot y_j" />
            <p>
                <InlineMath tex="\Delta w_{ij}" /> is the change in synaptic weight; η is the learning rate.
                If both neurons fire simultaneously, the weight increases by η. Otherwise, no change.
            </p>

            <h3>Activity-Based vs Error-Based Learning</h3>
            <p>
                Hebbian learning is <strong>unsupervised</strong> — it only requires that two neurons fire together.
                There's no 'teacher' telling it the correct answer. This is different from the perceptron's
                error-driven learning, which adjusts weights based on how wrong the prediction was.
            </p>
            <ul>
                <li><strong>Hebbian (unsupervised):</strong> reinforce co-activating patterns — discovers structure from raw data</li>
                <li><strong>Perceptron (error-driven):</strong> adjusts based on label — requires a teacher telling you the right answer</li>
                <li><strong>Backprop (gradient-based):</strong> uses full error signal from output back through the network — the most powerful of the three</li>
            </ul>

            <h3>Hebbian Learning and Correlation Detection</h3>
            <p>
                Hebbian learning essentially detects statistical correlations in the input data. If input features
                x₁ and x₂ consistently co-activate, their shared downstream connection becomes strong. This is why
                Hebbian learning is sometimes called <strong>correlation-based learning</strong>.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The big picture:</strong> Hebbian learning is the foundation of all neural network learning.
                Every algorithm — from perceptron updates to backpropagation — modifies synaptic weights based on
                correlated activity. Hebb's 1949 intuition was remarkably prescient.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Hebbian Learning: Formulation and Analysis</h2>

            <DefBlock label="Hebbian Weight Update">
                The classic Hebbian rule updates weights as:
                <MathBlock tex="\Delta w_{ij} = \eta\, x_i\, y_j" />
                where xᵢ is the postsynaptic activity, yⱼ is the postsynaptic activity, and η &gt; 0 is the learning rate.
                In vector form: <InlineMath tex="\Delta \mathbf{w} = \eta\, \mathbf{x}\, y" />.
                This is the <strong>outer product</strong> of the input vector with the output — a rank-1 update.
            </DefBlock>

            <h3>Variants of Hebbian Learning</h3>
            <ul>
                <li>
                    <strong>Covariance rule</strong>: subtracts the mean activities to avoid runaway excitation:
                    <MathBlock tex="\Delta w_{ij} = \eta\,(x_i - \bar{x})(y_j - \bar{y})" />
                </li>
                <li>
                    <strong>Oja's rule (1982)</strong>: adds a normalisation term to ensure weights don't grow without bound:
                    <MathBlock tex="\Delta w_{ij} = \eta\, y_j\,(x_i - y_j\, w_{ij})" />
                    Oja's rule extracts the first principal component of the input — equivalent to PCA.
                </li>
                <li>
                    <strong>Anti-Hebbian</strong>: <InlineMath tex="\Delta w_{ij} = -\eta\, x_i\, y_j" /> — connections weaken with correlated firing (used in competitive learning)
                </li>
            </ul>

            <h3>Hebbian Learning as PCA</h3>
            <p>
                Oja's rule converges to the first principal component of the input distribution. Iterating over
                multiple output units (with lateral inhibition) gives all principal components. This is Hebbian
                learning doing <strong>unsupervised dimensionality reduction</strong> — finding the directions
                of maximum variance in data, exactly as PCA does.
            </p>
            <MathBlock tex="\mathbf{w}_{new} = \frac{\mathbf{w} + \eta\, y\,\mathbf{x}}{\|\mathbf{w} + \eta\, y\,\mathbf{x}\|}" />
            <p>
                The normalisation step prevents unbounded weight growth and ensures the learned direction has unit norm.
                Without normalisation, Hebbian weights diverge exponentially with iterations.
            </p>

            <h3>Stability Analysis</h3>
            <p>
                Raw Hebbian learning (<InlineMath tex="\Delta w = \eta\, x\, y" />) is unstable: as weights grow,
                outputs y grow, which increases <InlineMath tex="\Delta w" /> further, leading to exponential divergence.
                This is called the <strong>runaway weight problem</strong>. Oja's normalisation, covariance subtraction,
                and weight decay are all solutions to this instability.
            </p>

            <div className="ch-callout">
                <strong>Connection to modern ML:</strong> Oja's rule and the covariance rule are ancestors of
                <strong> contrastive learning</strong> (SimCLR, BYOL). These methods also maximise the correlation
                between representations of the same input under different views — a Hebbian objective with modern
                engineering to prevent collapse.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Pure Hebbian Learning ────────────────────────────────────────────────────
# WARNING: unnormalised Hebbian weights grow without bound (runaway excitation)

def hebbian_update(w, x, y, lr=0.01):
    """Pure Hebbian: Δw = η * x * y — grows without limit"""
    return w + lr * x * y

# ── Oja's Rule (stable Hebbian) ─────────────────────────────────────────────
# Oja's rule is Hebbian learning + a normalisation term.
# It extracts the FIRST principal component of the data.

def oja_update(w, x, y, lr=0.01):
    """Oja's rule: Δw = η * y * (x - y * w)"""
    return w + lr * y * (x - y * w)

def train_oja(X, n_components=1, lr=0.01, epochs=200):
    """
    Train Oja's rule to find the dominant principal component.
    X: (n_samples, n_features) — assumes zero-mean data
    Returns: weight vector w (n_features,)
    """
    n_features = X.shape[1]
    w = np.random.randn(n_features)
    w /= np.linalg.norm(w)   # initialise to unit norm

    for epoch in range(epochs):
        np.random.shuffle(X)
        for x in X:
            y = np.dot(w, x)              # scalar projection
            w = oja_update(w, x, y, lr)   # Oja update
            w /= np.linalg.norm(w)        # renormalise

    return w

# ── Test on synthetic data ──────────────────────────────────────────────────
np.random.seed(42)

# Data stretched more along v1 than v2 → v1 is the principal component
v1 = np.array([0.707, 0.707])
v2 = np.array([-0.707, 0.707])
X = (np.random.randn(500, 2) @ np.diag([3.0, 1.0])) @ np.vstack([v1, v2])
X -= X.mean(axis=0)              # centre to zero mean

w_learned = train_oja(X.copy(), lr=0.02, epochs=100)
true_pc = v1 / np.linalg.norm(v1)

print(f"True principal component:  [{true_pc[0]:.4f}, {true_pc[1]:.4f}]")
print(f"Oja's learned direction:  [{w_learned[0]:.4f}, {w_learned[1]:.4f}]")
print(f"Cosine similarity: {np.dot(w_learned, true_pc):.4f}")
# → ~0.99 — Oja's rule recovered the principal axis of the data!

# ── Anti-Hebbian Learning ──────────────────────────────────────────────────
# Weakens connections for correlated firing — used in competitive learning

def anti_hebbian_update(w, x, y, lr=0.01):
    """Anti-Hebbian: Δw = -η * x * y"""
    return w - lr * x * y

# ── Trace Learning (temporal Hebbian) ─────────────────────────────────────
# Strengthens connections when pre fires BEFORE post fires (causality).

def trace_update(w, x, y, eligibility, lr=0.01, gamma=0.9):
    """
    eligibility trace: stores recent pre-synaptic activity.
    Learning: strengthen if pre-trace aligns with post.
    Δw = η * x * (γ * eligibility + y)
    """
    new_eligibility = gamma * eligibility + x
    dw = lr * y * new_eligibility
    return w + dw, new_eligibility

print("\\nHebbian & variants implemented.")`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementations of Hebbian learning variants — from the raw rule to Oja's stable learning
                rule, which is equivalent to extracting the first principal component of data.
            </p>
            <CodeBlock code={PY_CODE} filename="hebbian_learning.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Oja's rule is Hebbian learning with a built-in normalising term.
                It automatically discovers the direction of maximum variance in the data — the same direction
                that PCA would find, but learned online without a batch computation of the covariance matrix.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const HEBBIAN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
