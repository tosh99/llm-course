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
            year: "1949",
            title: "Hebb — The Organization of Behavior",
            challenge:
                "McCulloch and Pitts (1943) had shown that networks of threshold neurons could compute any logical function. But the weights in their model had to be set by hand — there was no mechanism for a network to change its own connections based on experience. How does the brain physically store memories? What is the mechanism by which repeated experiences alter the strength of synaptic connections? Neuroscience in 1949 had no satisfactory answer. Donald Hebb, a Canadian psychologist at McGill University, provided the first scientifically grounded proposal.",
            what:
                "Hebb's central postulate, published in 'The Organization of Behavior' (1949): when neuron A repeatedly and persistently takes part in firing neuron B, some growth process or metabolic change occurs in one or both cells such that A's efficiency in firing B is increased. The modern shorthand: 'Neurons that fire together, wire together.' Formally, Hebb proposed that synaptic weight w-ij increases when presynaptic neuron i and postsynaptic neuron j are both active simultaneously. The rule is entirely local — no global error signal is needed, only the activity of the two directly connected neurons.",
            impact:
                "Hebb's rule was the first scientifically grounded theory of synaptic plasticity. It provided a mechanistic account of how experience could physically alter the brain's connectivity — how memory could be encoded in the strengths of synaptic connections rather than in some central store. It also inspired every artificial learning rule that followed: the perceptron update (Chapter 2), the Widrow-Hoff delta rule, and even backpropagation are all Hebbian in spirit — reinforce connections that contribute to desired outcomes.",
        },
        {
            year: "1957 – 1973",
            title: "From Biology to Engineering — Early Hebbian Models",
            challenge:
                "Hebb's postulate was stated in biological terms — 'growth processes' and 'metabolic changes'. Translating this into a precise mathematical rule that could be implemented in a computer simulation or electronic hardware required abstraction and formalisation. Researchers also quickly noticed the fundamental problem with pure Hebbian learning: there is no mechanism to prevent weights from growing without bound.",
            what:
                "Farley and Clark (1954) implemented the first computer simulation of a Hebbian network at MIT. Rosenblatt's perceptron (1957) used error-driven learning — a closely related but distinct rule that incorporates a desired output signal. Widrow and Hoff (1960) introduced the Least Mean Squares (LMS) rule, which combines Hebbian correlation with an error correction term: Delta-w = eta times (y minus y-hat) times x. Kohonen (1982) developed self-organising maps using competitive Hebbian learning — where only the most active neuron updates its weights.",
            impact:
                "These engineering adaptations showed that Hebb's biological insight could be formalised into computationally effective algorithms. The LMS rule, in particular, is mathematically equivalent to gradient descent on mean squared error — connecting Hebbian biology to the optimisation theory that underlies all modern neural network training. LMS is still used in adaptive filtering (noise cancellation, echo removal) and is the ancestor of the backpropagation algorithm.",
        },
        {
            year: "1982",
            title: "Oja's Rule — Stable Hebbian Learning and PCA",
            challenge:
                "Pure Hebbian learning is unstable. If two neurons fire together and their connection strengthens, the stronger connection causes them to fire together more often, which strengthens it further — an exponential runaway. In the limit, weights grow without bound and the neuron fires constantly. Real brains must have homeostatic mechanisms preventing this; artificial Hebbian rules needed a mathematically principled stabilisation.",
            what:
                "Erkki Oja (1982) derived a simple normalisation term that stabilises Hebbian learning: Delta-w-ij = eta times y-j times (x-i minus y-j times w-ij). The second term 'forgets' old information proportionally to the squared norm of the weight vector, preventing unbounded growth. Oja proved that this rule converges to the eigenvector of the input covariance matrix corresponding to the largest eigenvalue — that is, it extracts the first principal component of the data. Running multiple Oja units with lateral inhibition gives all principal components.",
            impact:
                "Oja's rule connects Hebbian learning directly to PCA (Chapter 1) — the most important result in classical unsupervised learning theory. It shows that a biologically plausible local learning rule, with one stabilising term added, discovers the same structure as PCA's global eigendecomposition. This connection between local biological rules and global statistical optimality is profound: evolution found the right algorithm, and it corresponds to PCA. Modern contrastive learning methods (SimCLR, BYOL) can be understood as Hebbian learning at scale, where the 'lateral inhibition' is replaced by explicit negative pairs.",
        },
        {
            year: "1986 – 1998",
            title: "Hebbian Principles in Modern Neural Networks",
            challenge:
                "Backpropagation (Rumelhart, Hinton, Williams 1986) was technically not Hebbian — it used global error signals computed by the chain rule rather than local co-activity. This created a conceptual divide between biologically motivated learning and the computationally successful gradient-based methods. Some researchers viewed backpropagation as biologically implausible; others argued this was irrelevant. Could Hebbian principles and gradient methods be reconciled?",
            what:
                "Contrastive Hebbian learning (Movellan 1991, Xie and Seung 2003) showed that Hebbian updates on positive and negative examples combined to approximate backpropagation gradients. Spike-timing-dependent plasticity (STDP, Bi and Poo 1998) discovered that real synapses strengthen if the presynaptic neuron fires just before the postsynaptic (causal direction) and weaken in the reverse order — a temporal version of Hebbian learning with directional causal structure. Temporal difference learning in reinforcement learning uses Hebbian-like reward-modulated updates.",
            impact:
                "STDP resolved the temporal ambiguity in Hebb's rule: it is not just simultaneous firing that matters, but the causal order of firing — a synapse that consistently predicts postsynaptic activity is strengthened. Modern self-supervised learning (BYOL, SimCLR 2020) is effectively Hebbian: maximise agreement between two representations of the same input. The models that set ImageNet records in 2021-2022 use objectives that are information-theoretically equivalent to maximising the correlation (Hebbian measure) between views.",
        },
        {
            year: "2000 – present",
            title: "Modern Hebbian Connections — Weight Tying and Contrastive Learning",
            challenge:
                "Large language models and vision models learn representations without explicit Hebbian rules. Yet the representations they learn share striking properties with Hebbian predictions: they are distributed, they encode statistical co-occurrence, and they cluster semantically related inputs together. Is there a formal connection between the gradient descent training of modern networks and the Hebbian principles proposed in 1949?",
            what:
                "Word2Vec (Mikolov et al. 2013) trains embeddings to predict co-occurring words — a direct analogue of Hebbian strengthening of connections between words that appear together. GloVe (Pennington et al. 2014) explicitly optimises weighted co-occurrence correlations — the inner product of embedding vectors approximates log co-occurrence frequency, which is Hebbian co-activation. The CLIP model (Radford et al. 2021) trains image and text encoders by maximising cosine similarity between matched image-text pairs (positive Hebbian updates) and minimising similarity for mismatched pairs (anti-Hebbian updates). This is contrastive Hebbian learning at the scale of 400 million examples.",
            impact:
                "Hebb's 1949 postulate — 'neurons that fire together, wire together' — turns out to describe the learning objective of the most powerful self-supervised models ever built. The mathematical connection is not metaphorical: maximising cosine similarity between positive pairs (CLIP's contrastive loss) and minimising it for negative pairs is formally equivalent to running contrastive Hebbian learning on a distributed representation. The biological insight from 1949 was right; it just took 70 years and hundreds of millions of parameters to implement it at sufficient scale to be impressive.",
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
            <h2>How do neurons learn to get better?</h2>

            <Analogy label="The dance lesson analogy">
                Imagine you are learning a new dance. Every time you practice a particular sequence of moves with a partner, your body gets a little better at coordinating with theirs. The connection between your movements strengthens with use. If you never dance that sequence again, the connection weakens.
                <br /><br />
                <strong>Hebb's rule</strong> says the same thing happens in your brain: the connections between neurons that fire together repeatedly grow stronger. Connections between neurons that never fire together weaken over time. This is how your brain physically stores memories and builds skills.
            </Analogy>

            <Analogy label="Guitar and muscle memory">
                Think of learning to play guitar. When you strum a chord correctly and it sounds right, the precise finger positions and muscle movements involved get reinforced — the nerve connections controlling them grow more efficient. Hebb called this "neurons that fire together, wire together."
                <br /><br />
                The more often you play that chord, the stronger those connections become, and the easier the chord becomes to play. This is not a metaphor — physical changes in synaptic strength (measured by neuroscientists since Hebb) are exactly what underlies skill learning and memory formation.
            </Analogy>

            <Analogy label="The problem — runaway excitation">
                Here is the tricky part: pure Hebbian learning on its own just reinforces <em>everything</em>. If two neurons keep firing together, their connection keeps getting stronger — forever. In a real brain, this would lead to runaway excitement where one neuron firing eventually causes every connected neuron to fire.
                <br /><br />
                Real brains solve this with <strong>homeostatic plasticity</strong> — mechanisms that scale down all connection strengths if a neuron fires too often. Erkki Oja (1982) solved the mathematical version of this problem with a normalisation term that prevents weights from growing without bound, and proved that the resulting rule converges to the most important direction in the data — the first principal component.
            </Analogy>

            <Analogy label="Word2Vec and linguistic Hebb">
                When a large language model like GPT is trained on text, words that appear near each other frequently develop similar internal representations. "Doctor" ends up near "hospital" because they co-occur. "Cat" ends up near "kitten" for the same reason.
                <br /><br />
                This is Hebbian learning at the scale of billions of word co-occurrences. Words that are used together end up with representations that "fire together" — their inner product is large. The famous word2vec model from 2013 made this explicit: it trained word embeddings by maximising the probability of observing co-occurring words, which is mathematically equivalent to strengthening connections between words that appear together.
            </Analogy>

            <Analogy label="CLIP — Hebbian learning across modalities">
                The CLIP model (2021) learned to match images with text captions by training on 400 million image-text pairs from the internet. For matched pairs (positive examples), it pushed the image representation and text representation closer together — Hebbian strengthening. For mismatched pairs, it pushed them apart — anti-Hebbian weakening.
                <br /><br />
                The result: CLIP can recognise any object you describe in words, without ever being explicitly trained on that category. This zero-shot ability comes from the Hebbian structure of its representations — things that appear together in human-generated content end up with similar internal representations.
            </Analogy>

            <Analogy label="What comes next — the perceptron learns from mistakes">
                Hebb's rule learns from co-activity — no teacher required, just the simultaneous firing of neurons. The next step in the story is a different kind of learning: mistake-driven correction. Rosenblatt's perceptron (1957) updated its weights specifically when it was wrong, using the error signal to push the decision boundary in the right direction. This supervised learning — using external feedback rather than just co-activity — is the foundation of all modern neural network training.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The Mathematics of Synaptic Strengthening</h2>

            <h3>Hebb's Postulate (Mathematical Form)</h3>
            <p>
                When a presynaptic neuron fires (<InlineMath tex="x_i = 1" />) and the postsynaptic neuron fires
                (<InlineMath tex="y_j = 1" />), the connection between them strengthens:
            </p>
            <MathBlock tex="\Delta w_{ij} = \eta \cdot x_i \cdot y_j" />
            <p>
                Delta-w-ij is the change in synaptic weight; eta is the learning rate.
                If both neurons fire simultaneously, the weight increases by eta. Otherwise, no change.
                In vector form: the update is the outer product of the input vector x with the output y — a rank-1 update to the weight matrix.
            </p>

            <h3>Activity-Based vs Error-Based Learning</h3>
            <p>
                Hebbian learning is <strong>unsupervised</strong> — it requires no external teacher, only co-activity.
                This is fundamentally different from the perceptron's error-driven learning.
            </p>
            <ul>
                <li><strong>Hebbian (unsupervised):</strong> reinforce co-activating patterns — discovers statistical structure from raw data without labels</li>
                <li><strong>Perceptron (error-driven):</strong> adjusts based on label mismatch — requires a teacher signal specifying the correct class</li>
                <li><strong>Backprop (gradient-based):</strong> uses the full error gradient from output back through all layers — the most powerful of the three, though least biologically plausible</li>
            </ul>

            <h3>Oja's Rule — Stable Hebbian PCA</h3>
            <p>
                Oja's 1982 modification stabilises Hebbian learning with a normalisation term:
            </p>
            <MathBlock tex="\Delta w_{ij} = \eta\, y_j\,(x_i - y_j\, w_{ij})" />
            <p>
                The subtracted term prevents unbounded weight growth. Oja proved that this rule converges to
                the first eigenvector of the input covariance matrix — the first principal component. Extending to
                multiple units with lateral inhibition extracts all principal components.
            </p>

            <h3>Hebbian Learning and Correlation Detection</h3>
            <p>
                The basic Hebbian update Delta-w = eta times x times y essentially detects statistical correlations in the input. If input features x<sub>1</sub> and x<sub>2</sub> consistently co-activate, their shared downstream connection becomes strong. The long-run weight vector converges to a direction that tracks co-variance. This is precisely the first principal component — the direction of maximum variance in the input distribution.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The grand connection:</strong> Oja's rule and PCA (Chapter 1) are the same computation implemented differently. PCA computes the covariance matrix and extracts eigenvectors globally. Oja's rule achieves the same result online, one sample at a time, using only local information at each synapse. This equivalence — between a biologically plausible local rule and a globally optimal statistical procedure — is one of the most beautiful results in machine learning theory.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Stability analysis · Oja convergence proof · covariance rule</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Pure Hebbian · Oja's rule · PCA comparison</span>
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
            <h2>Hebbian Learning: Formulation and Analysis</h2>

            <DefBlock label="Hebbian Weight Update">
                The classic Hebbian rule updates weights as:
                <MathBlock tex="\Delta w_{ij} = \eta\, x_i\, y_j" />
                where x-i is the presynaptic activity, y-j is the postsynaptic activity, and eta is the learning rate.
                In vector form: <InlineMath tex="\Delta \mathbf{w} = \eta\, \mathbf{x}\, y" />.
                This is the outer product of the input vector with the scalar output — a rank-1 update.
                The expected weight update equals eta times the covariance between x and y.
            </DefBlock>

            <h3>Variants of Hebbian Learning</h3>
            <ul>
                <li>
                    <strong>Covariance rule:</strong> subtracts mean activities to center around zero, avoiding systematic weight drift:
                    <MathBlock tex="\Delta w_{ij} = \eta\,(x_i - \bar{x})(y_j - \bar{y})" />
                </li>
                <li>
                    <strong>Oja's rule (1982):</strong> adds a normalisation term to prevent weight explosion:
                    <MathBlock tex="\Delta w_{ij} = \eta\, y_j\,(x_i - y_j\, w_{ij})" />
                    Oja's rule extracts the first principal component of the input — equivalent to online PCA.
                </li>
                <li>
                    <strong>Anti-Hebbian:</strong> <InlineMath tex="\Delta w_{ij} = -\eta\, x_i\, y_j" /> — connections weaken with correlated firing; used in competitive learning and lateral inhibition networks.
                </li>
            </ul>

            <h3>Stability Analysis of Pure Hebbian Learning</h3>
            <p>
                Raw Hebbian learning (<InlineMath tex="\Delta w = \eta\, x\, y" />) is unstable: as weights grow,
                outputs y grow, which increases <InlineMath tex="\Delta w" /> further, leading to exponential divergence.
                Expected weight dynamics: E[w(t)] = (I + eta times C) to the power of t times w(0), where C is the input covariance matrix. Since the largest eigenvalue of I + eta times C is greater than 1, the weights diverge geometrically.
            </p>
            <p>
                The <strong>runaway weight problem</strong> is why all practical Hebbian rules include a stabilising mechanism: Oja's normalisation, covariance subtraction, weight decay, or hard normalisation to unit norm.
            </p>

            <h3>Oja Convergence to PCA</h3>
            <p>
                Oja (1982) proved that his rule converges to the first eigenvector of the covariance matrix C. The proof uses the Lyapunov function method: define V(w) = minus w-transpose times e-1, where e-1 is the first eigenvector. Show that V decreases in expectation under the Oja update. The normalised weight iterates converge to plus or minus e-1 regardless of initialisation.
            </p>
            <MathBlock tex="\mathbf{w}^* = \text{eigenvector of } C \text{ with largest eigenvalue } \lambda_1" />
            <p>
                With lateral inhibition between k output neurons (Sanger 1989), the k Oja units extract the first k principal components in order — online PCA with no explicit covariance matrix computation.
            </p>

            <div className="ch-callout">
                <strong>Connection to modern ML:</strong> SimCLR and BYOL can be understood as Hebbian learning at scale. SimCLR maximises the cosine similarity between representations of augmented views of the same image (positive Hebbian update) while minimising it for different images (anti-Hebbian). The resulting representations learn the principal components of the visual data manifold — exactly what Oja's rule would converge to if applied to image patches.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Pure Hebbian Learning ────────────────────────────────────────────────────
# WARNING: unnormalised Hebbian weights grow without bound

def hebbian_update(w, x, y, lr=0.01):
    """Pure Hebbian: delta_w = eta * x * y -- grows without limit"""
    return w + lr * x * y

# ── Oja's Rule (stable Hebbian = online PCA) ─────────────────────────────────
# Oja's rule is Hebbian learning + a normalisation term.
# It extracts the FIRST principal component of the data.

def oja_update(w, x, y, lr=0.01):
    """Oja's rule: delta_w = eta * y * (x - y * w)"""
    return w + lr * y * (x - y * w)

def train_oja(X, lr=0.01, epochs=200):
    """
    Train Oja's rule to find the dominant principal component.
    X: (n_samples, n_features) -- assumes zero-mean data
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

# Data stretched more along v1 than v2 -- v1 is the principal component
v1 = np.array([0.707, 0.707])
v2 = np.array([-0.707, 0.707])
X = (np.random.randn(500, 2) @ np.diag([3.0, 1.0])) @ np.vstack([v1, v2])
X -= X.mean(axis=0)              # centre to zero mean

w_learned = train_oja(X.copy(), lr=0.02, epochs=100)
true_pc = v1 / np.linalg.norm(v1)

print(f"True principal component:  [{true_pc[0]:.4f}, {true_pc[1]:.4f}]")
print(f"Oja's learned direction:   [{w_learned[0]:.4f}, {w_learned[1]:.4f}]")
print(f"Cosine similarity: {abs(np.dot(w_learned, true_pc)):.4f}")
# Should be ~1.00 -- Oja recovered the principal axis!

# ── Compare with numpy SVD (true PCA) ─────────────────────────────────────
_, _, Vt = np.linalg.svd(X, full_matrices=False)
pca_pc1 = Vt[0]
print(f"\\nPCA (SVD) direction:       [{pca_pc1[0]:.4f}, {pca_pc1[1]:.4f}]")
print(f"Oja vs PCA match: {abs(np.dot(w_learned, pca_pc1)):.4f}")

# ── Anti-Hebbian Learning ──────────────────────────────────────────────────
def anti_hebbian_update(w, x, y, lr=0.01):
    """Anti-Hebbian: delta_w = -eta * x * y"""
    return w - lr * x * y

print("\\nHebbian variants demonstrated.")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of Hebbian learning variants — from the unstable raw rule to Oja's
                stable learning rule, which converges to the first principal component. The final comparison
                confirms that Oja's biological rule finds the same direction as numpy's SVD-based PCA.
            </p>
            <CodeBlock code={PY_CODE} filename="hebbian_learning.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Oja's rule is Hebbian learning with a built-in normalising term.
                It automatically discovers the direction of maximum variance in the data — the same direction
                that PCA finds globally. The biological rule and the statistical procedure converge to the same answer.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const HEBBIAN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
