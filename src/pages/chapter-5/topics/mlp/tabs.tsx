import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Timeline ──────────────────────────────────────────────────────────────────

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
            year: "1943 – 1958",
            title: "McCulloch-Pitts and Rosenblatt — The First Neural Computation Models",
            challenge:
                "The 1940s and 1950s were a period of wild interdisciplinary optimism. Norbert Wiener's cybernetics movement proposed that animals and machines were fundamentally the same kind of information-processing system. Warren McCulloch (a neurophysiologist) and Walter Pitts (a logician) asked a concrete question: could a formal model of a neuron be both biologically plausible and mathematically precise? Their 1943 paper answered yes. But the McCulloch-Pitts neuron had fixed, hand-set weights — it could compute, but it could not learn.",
            what: "Frank Rosenblatt's perceptron (1958, Cornell Aeronautical Laboratory) added the missing piece: a learning rule. The perceptron had adjustable weights updated by a simple rule — if the output was wrong, nudge the weights toward the correct answer. Rosenblatt proved the <em>perceptron convergence theorem</em>: if the training data is linearly separable, the perceptron will find a separating hyperplane in a finite number of steps. This was the first proof that a machine could learn a function from examples.",
            impact:
                "Rosenblatt's demonstrations (the Mark I Perceptron hardware, 1958) and grandiose claims ('the embryo of an electronic computer that will be able to walk, talk, see, write, reproduce itself, and be conscious of its existence') attracted enormous press and government funding. But the perceptron's single-layer limitation was about to be exposed.",
        },
        {
            year: "1969",
            title: "Minsky and Papert — Perceptrons and the First AI Winter",
            challenge:
                "By the late 1960s, Rosenblatt's perceptrons had been deployed on real pattern recognition tasks and were failing to generalise. The US Navy's funding for perceptron research was producing results far below expectations. Marvin Minsky and Seymour Papert, leaders of the symbolic AI approach at MIT, undertook a mathematical analysis of what perceptrons could and could not compute.",
            what: "Minsky and Papert's book 'Perceptrons' (1969) proved, rigorously, that a single-layer perceptron cannot compute the XOR function. More generally, it cannot compute any function that requires detecting the coincidence of two features unless those features are within a bounded distance of each other. The book was technically correct and carefully argued. But it was also interpreted — by funding agencies, if not by Minsky and Papert themselves — as a proof that all neural networks were limited.",
            impact:
                "Federal funding for neural network research in the US dried up almost completely in the early 1970s. The first AI winter, caused partly by the perceptron disillusionment, lasted until the early 1980s. But Minsky and Papert's analysis of single-layer networks said nothing about multi-layer networks — a point they acknowledged in a footnote that went largely unread for over a decade.",
        },
        {
            year: "1986",
            title: "Rumelhart, Hinton and Williams — Multi-Layer Networks Come Alive",
            challenge:
                "The PDP (Parallel Distributed Processing) research group at UCSD had been building a theoretical framework for connectionism through the early 1980s. They believed multi-layer networks were fundamentally more powerful than single-layer perceptrons, but they had no way to train them. The chain rule implied that gradient could flow backward through compositions of functions, but the specific algorithm for networks — including the handling of non-linear activations — needed to be worked out precisely.",
            what: "The 1986 Nature paper presented backpropagation as a method for training networks with hidden layers. Crucially, it also demonstrated that hidden layers learned <em>internal representations</em> — not just combinations of inputs, but genuinely new features constructed by the network. The XOR experiment showed a 2-hidden-unit network discovering the two features (A AND NOT B) and (B AND NOT A) that together implement XOR. The network had decomposed a non-linear problem into a composition of simpler ones.",
            impact:
                "The multi-layer perceptron became the foundational architecture of the neural network renaissance. Every architecture in this curriculum — CNNs, RNNs, Transformers — is a variant of the MLP idea: linear transformation followed by non-linear activation, stacked. The 1986 paper also launched an empirical research programme: how deep? how wide? what activations? what initialisation? Those questions occupied researchers for the next 25 years.",
        },
        {
            year: "1989 – 1991",
            title: "Cybenko, Hornik — The Universal Approximation Theorem",
            challenge:
                "The empirical success of MLPs on pattern recognition tasks called for a theoretical explanation. Why should stacking layers of sigmoids be enough to learn complex functions? Was there a mathematical guarantee that MLPs were not just empirically useful but fundamentally expressive? Researchers needed a theorem — something that would place MLPs in the same category as Fourier series or polynomial approximations as general function approximators.",
            what: "George Cybenko proved (1989, Mathematics of Control, Signals, and Systems) that a single hidden layer with a continuous sigmoidal activation can approximate any continuous function on a compact domain to arbitrary accuracy, given enough hidden units. Hornik, Stinchcombe, and White independently proved (1989) that the result holds for any non-polynomial activation — including step functions. The theorem guarantees existence of an approximator, not that gradient descent will find it.",
            impact:
                "The universal approximation theorem provided intellectual legitimacy for the MLP. It said: whatever target function you want to approximate, an MLP with a sufficient number of hidden units <em>can</em> represent it. This is analogous to the Stone-Weierstrass theorem for polynomials. But like Stone-Weierstrass, it is an existence result — it says nothing about the number of units needed (which can be exponential) or whether training will succeed.",
        },
        {
            year: "1995 – 2006",
            title: "The Second Winter — Depth Fails in Practice",
            challenge:
                "The 1990s saw MLPs applied widely to practical problems — speech recognition, handwriting, time-series prediction. But researchers found a persistent frustration: adding more layers consistently failed to improve performance, and often made training unstable. The vanishing gradient problem (identified formally by Hochreiter in 1991) meant that early layers in deep networks received gradients too small to be useful. Shallow MLPs (1–2 hidden layers) with many units were more practical than deep MLPs.",
            what: "The research community developed workarounds: careful weight initialisation (LeCun 1998), momentum-based optimisation, and principled regularisation techniques (dropout would come later). For classification tasks, SVMs and other kernel methods — which could be analysed with statistical learning theory — were often preferred over deep MLPs in this period. MLPs remained in use but rarely exceeded two hidden layers in practice.",
            impact:
                "This period forced researchers to confront that depth, not just width, was the key dimension of neural network expressiveness — and that making depth work required solving the vanishing gradient problem. The solutions that emerged between 2006 and 2015 (pre-training, ReLU, batch normalisation, residual connections) transformed the MLP's deep cousin, the deep neural network, from a theoretical curiosity into a practical powerhouse.",
        },
        {
            year: "2012 – present",
            title: "Deep Networks — The MLP Returns as a Building Block",
            challenge:
                "AlexNet's 2012 ImageNet victory (Krizhevsky, Sutskever, Hinton) used a deep convolutional network with ReLU activations, dropout, and GPU training. The convolutional layers were the headline, but fully connected MLP layers at the top made the final classification decision. From that point, the field never looked back. The MLP — the basic architecture from 1986 — became an indispensable component inside every larger architecture.",
            what: "Modern deep learning stacks MLP layers inside convolutional, recurrent, and attention architectures. In Transformers (Ch.17), the feed-forward sub-layer is a two-layer MLP applied independently to each token. In graph neural networks, node update functions are MLPs. In reinforcement learning, value functions and policies are MLPs. The 1986 architecture did not become obsolete — it became infrastructure.",
            impact:
                "The MLP's persistence across 65 years of neural network research is testament to its simplicity and expressiveness. Every subsequent architectural innovation has been a modification of the MLP idea: replace the dense linear transformation with a sparse convolution (CNN), a recurrent state (RNN), or a self-attention operation (Transformer). Understanding the MLP deeply is understanding the foundation of all of modern deep learning.",
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

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Why one layer isn't enough — and how more layers fix everything</h2>

            <Analogy label="The Perceptron — A One-Layer Thinker">
                A single perceptron can only draw <em>one straight line</em> through the data. Imagine trying to separate cats from dogs where some cats look like small dogs and vice versa — what if the cats are scattered in two separate clusters? One straight line can't separate them. The perceptron is stuck.
                <br /><br />
                Minsky and Papert proved this precisely in 1969: XOR (output 1 if exactly one of two inputs is 1, else 0) cannot be learned by a single perceptron. You can try every possible weight setting — it won't work. The four XOR points can't be separated by a straight line, no matter where you draw it.
            </Analogy>

            <Analogy label="Two Layers — A Team That Solves XOR">
                An MLP with one hidden layer is a team of thinkers. The first layer draws multiple lines (one per hidden neuron). Each line separates the data in a different way. The second layer looks at all those lines and combines their answers into a final decision.
                <br /><br />
                For XOR: one hidden neuron learns "both inputs are 1", another learns "both inputs are 0". The output neuron combines them: "if neither is true — that's an XOR case". No single line can do this. Two lines, combined, can.
                <br /><br />
                Rumelhart and Hinton showed this in their 1986 paper. They took the exact problem Minsky and Papert had proven was unsolvable, added one hidden layer, and solved it with backpropagation. The perceptron's limitation was not fundamental to neural networks — it was a limitation of single layers.
            </Analogy>

            <Analogy label="Deep Networks — A Hierarchy of Concepts">
                A deep MLP (many hidden layers) builds a hierarchy of concepts. The first layer might detect edges in an image. The second layer might detect shapes made of edges. The third layer might detect objects made of shapes. Each layer transforms the data into something more abstract.
                <br /><br />
                This is how your brain processes vision too: your visual cortex has distinct layers that process progressively more abstract features. Simple cells detect edges; complex cells detect motions; higher areas recognise faces. A deep network rediscovers this hierarchical structure automatically from data.
            </Analogy>

            <Analogy label="The Universal Approximation Theorem — A Magic Blanket">
                Mathematicians proved something remarkable: if you give a single-hidden-layer network enough hidden neurons, it can theoretically learn <em>any</em> function — any shape, any pattern. It's like saying: with enough tiny square tiles, you can cover any shape on a map.
                <br /><br />
                But there's a catch: you might need an astronomical number of tiles. With multiple layers, you can cover the same shape using far fewer, cleverer tiles — because each layer can reuse features from the previous one. Depth provides compositional efficiency that width cannot match.
            </Analogy>

            <Analogy label="Why Non-Linearity is the Magic Ingredient">
                Here's the key question: why do we need activation functions at all? Why not just stack linear layers?
                <br /><br />
                If you stack two linear transformations, you always get another linear transformation. Matrix times matrix equals a matrix. No matter how many linear layers you stack, the entire network is equivalent to one linear layer. All that depth buys you nothing.
                <br /><br />
                Activation functions like ReLU or sigmoid introduce non-linearity. They bend and warp the space the data lives in — turning it from a flat plane into a curved surface. With enough bending, any shape can be represented. Without non-linearity, no depth helps at all.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Architecture of a Multi-Layer Perceptron</h2>

            <h3>Structure — the building block</h3>
            <p>
                An MLP has <strong>L</strong> layers: an input layer (no transformation), <InlineMath tex="L-1" /> hidden layers, and one output layer. Each layer <em>l</em> applies a linear transformation followed by a non-linear activation:
            </p>
            <MathBlock tex="z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \qquad a^{(l)} = \sigma(z^{(l)})" />
            <p>
                where <InlineMath tex="a^{(0)} = x" /> is the input and <InlineMath tex="a^{(L)} = \hat{y}" /> is the output. The parameters to learn are the weight matrices <InlineMath tex="W^{(l)} \in \mathbb{R}^{n_l \times n_{l-1}}" /> and bias vectors <InlineMath tex="b^{(l)} \in \mathbb{R}^{n_l}" /> for each layer.
            </p>

            <h3>XOR — why one layer fails, two succeed</h3>
            <p>
                XOR requires classifying four points <InlineMath tex="(0,0), (0,1), (1,0), (1,1)" /> where outputs are 0, 1, 1, 0 respectively. No hyperplane in <InlineMath tex="\mathbb{R}^2" /> separates the two classes — the problem is not linearly separable. A 2-hidden-unit MLP can solve it:
            </p>
            <MathBlock tex="\hat{y} = \sigma\!\left(w_1^{(2)}\, h_1 + w_2^{(2)}\, h_2 + b^{(2)}\right)" />
            <p>
                where <InlineMath tex="h_1, h_2" /> are the hidden activations. The hidden layer transforms the input so that the two classes become linearly separable in the 2D hidden space — then the output layer draws the separating line there.
            </p>

            <h3>Why non-linearity is essential</h3>
            <p>
                If <InlineMath tex="\sigma" /> is the identity (linear activation), the entire network collapses to a single linear transformation regardless of depth:
            </p>
            <MathBlock tex="W^{(L)} W^{(L-1)} \cdots W^{(1)} x + \text{bias} = \tilde{W} x + \tilde{b}" />
            <p>
                Non-linear activations break this collapse. Each activation function introduces a non-linear "bend" in the data manifold, allowing the composition of layers to represent functions that no single linear layer could approximate.
            </p>

            <h3>Depth vs. width — two routes to expressiveness</h3>
            <p>
                The universal approximation theorem (Cybenko 1989, Hornik 1991) guarantees that a single hidden layer with enough units can approximate any continuous function. But "enough" can be exponential in the input dimension. Depth provides a more efficient route: functions that require exponential width at depth 2 can be represented with polynomial width at depth <em>O(log n)</em>.
            </p>
            <p>
                Intuitively: depth allows layers to reuse intermediate computations. A deep network computing <InlineMath tex="x^{2^k}" /> can be implemented as <em>k</em> squaring layers, each reusing the output of the previous. A single hidden layer must represent this exponential separately for each term.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Capacity vs. efficiency:</strong> the universal approximation theorem says a single hidden layer <em>can</em> represent any continuous function. In practice, deep networks (many layers, moderate width) learn from data far more efficiently than single wide layers because natural data — images, text, speech — has hierarchical compositional structure that matches the layer-by-layer computation of MLPs.
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

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Formal MLP theory</h2>

            <DefBlock label="Universal Approximation Theorem (Cybenko, 1989)">
                Let <InlineMath tex="\sigma: \mathbb{R} \to \mathbb{R}" /> be any continuous sigmoidal function (i.e. <InlineMath tex="\sigma(t) \to 1" /> as <InlineMath tex="t \to +\infty" /> and <InlineMath tex="\sigma(t) \to 0" /> as <InlineMath tex="t \to -\infty" />). For any continuous function <InlineMath tex="f: [0,1]^n \to \mathbb{R}" /> and any <InlineMath tex="\epsilon > 0" />, there exists <InlineMath tex="M \in \mathbb{N}" /> and parameters <InlineMath tex="\alpha_j, w_j, b_j" /> such that:
                <MathBlock tex="\left| f(x) - \sum_{j=1}^M \alpha_j\, \sigma(w_j^\top x + b_j) \right| < \epsilon \quad \forall x \in [0,1]^n" />
                The theorem guarantees existence of such parameters; it says nothing about whether gradient descent will find them or how large <em>M</em> must be.
            </DefBlock>

            <h3>Expressive power of depth — a separation theorem</h3>
            <p>
                Telgarsky (2016) proved depth separation theorems: there exist functions on <InlineMath tex="[0,1]" /> that can be computed by a network of depth <em>k</em> with <em>O(1)</em> nodes per layer, but any network of depth <InlineMath tex="\leq k/2" /> needs <InlineMath tex="\Omega(2^k)" /> nodes. Concretely:
            </p>
            <ul>
                <li>Boolean parity on <em>n</em> bits: computable with depth <InlineMath tex="O(\log n)" /> and width <InlineMath tex="O(n)" />, but requires width <InlineMath tex="\Omega(2^n)" /> in a single hidden layer</li>
                <li>Iterated squaring <InlineMath tex="x^{2^k}" />: needs only <em>k</em> layers of width 1, but a single hidden layer needs <InlineMath tex="\Omega(2^k)" /> units</li>
            </ul>
            <p>
                This explains why deep networks work so well in practice: natural data has hierarchical structure that matches the layer-by-layer decomposition, and depth exploits this with exponentially fewer parameters than a single wide layer.
            </p>

            <h3>VC dimension and generalisation</h3>
            <p>
                The VC dimension of an MLP with <em>W</em> weights and <em>L</em> layers using threshold activations is <InlineMath tex="\Theta(W \log W)" /> (Goldberg &amp; Jerrum, 1995). For smooth activations, the pseudo-dimension is <InlineMath tex="O(W \cdot L)" />. More weights means more capacity, which comes with a generalisation risk: a model with too much capacity will fit training noise rather than the underlying function.
            </p>

            <h3>Output activation choices</h3>
            <p>
                The output activation and loss function form a conjugate pair:
            </p>
            <ul>
                <li><strong>Regression:</strong> identity activation, loss <InlineMath tex="L = \tfrac{1}{2}\|y - \hat{y}\|^2" /></li>
                <li><strong>Binary classification:</strong> sigmoid, loss = binary cross-entropy <InlineMath tex="L = -[y \log \hat{y} + (1-y)\log(1-\hat{y})]" /></li>
                <li><strong>Multi-class:</strong> softmax <InlineMath tex="\hat{y}_k = e^{z_k} / \sum_j e^{z_j}" />, loss = categorical cross-entropy <InlineMath tex="L = -\sum_k y_k \log \hat{y}_k" /></li>
            </ul>
            <p>
                Each pairing produces a clean gradient at the output layer (prediction minus truth), which is why these combinations are standard.
            </p>

            <DefBlock label="Batch vs. Online vs. Mini-batch Learning">
                Three training paradigms for MLPs: (1) <em>Batch learning</em> — compute gradients over the full dataset, update once; (2) <em>Online (stochastic) learning</em> — update weights after each single example; (3) <em>Mini-batch learning</em> — update after computing gradients over a small random subset (typically 32–512 examples). Mini-batch is the modern standard: it balances gradient accuracy (better than online) with speed (better than batch) and provides noise that can help escape sharp local minima.
            </DefBlock>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── NumPy MLP for XOR ─────────────────────────────────────────────────────────
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

class MLP:
    """
    Two-layer MLP (1 hidden layer) trained with backpropagation.
    Demonstrates the minimal architecture that solves XOR.
    """
    def __init__(self, n_in, n_hidden, n_out, lr=1.5):
        # Xavier initialisation: keeps gradients in a stable range at start
        self.W1 = np.random.randn(n_hidden, n_in) * np.sqrt(2.0 / n_in)
        self.b1 = np.zeros(n_hidden)
        self.W2 = np.random.randn(n_out, n_hidden) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros(n_out)
        self.lr = lr

    def forward(self, X):
        self.z1 = X @ self.W1.T + self.b1
        self.a1 = sigmoid(self.z1)
        self.z2 = self.a1 @ self.W2.T + self.b2
        self.a2 = sigmoid(self.z2)
        return self.a2

    def backward(self, X, y):
        n = X.shape[0]
        # Output layer error signal
        d2 = (self.a2 - y) * self.a2 * (1 - self.a2)
        # Hidden layer error signal (chain rule)
        d1 = (d2 @ self.W2) * self.a1 * (1 - self.a1)
        # Gradient descent updates
        self.W2 -= self.lr * (d2.T @ self.a1) / n
        self.b2 -= self.lr * d2.mean(axis=0)
        self.W1 -= self.lr * (d1.T @ X) / n
        self.b1 -= self.lr * d1.mean(axis=0)

    def train(self, X, y, epochs=15000):
        for epoch in range(epochs):
            pred = self.forward(X)
            self.backward(X, y)
            if epoch % 3000 == 0:
                loss = 0.5 * np.mean((pred - y) ** 2)
                print(f"Epoch {epoch:5d} | MSE: {loss:.6f}")

X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)
np.random.seed(42)

mlp = MLP(n_in=2, n_hidden=4, n_out=1, lr=1.5)
mlp.train(X, y)

print("\\nNumPy MLP predictions (XOR):")
for i in range(4):
    p = mlp.forward(X[i:i+1])[0,0]
    print(f"  {X[i].tolist()} -> {p:.4f}  target={int(y[i,0])}")

# ── PyTorch: easily extend to deeper networks ─────────────────────────────────
def make_mlp(layer_sizes, activation=nn.ReLU):
    """Build an MLP from a list of layer sizes."""
    layers = []
    for i in range(len(layer_sizes) - 1):
        layers.append(nn.Linear(layer_sizes[i], layer_sizes[i+1]))
        if i < len(layer_sizes) - 2:      # no activation after final layer
            layers.append(activation())
    return nn.Sequential(*layers)

# Shallow (1 hidden layer)
shallow = make_mlp([2, 8, 1], activation=nn.Sigmoid)
# Deeper (3 hidden layers)
deep    = make_mlp([2, 16, 16, 8, 1], activation=nn.ReLU)

X_t = torch.tensor(X, dtype=torch.float32)
y_t = torch.tensor(y, dtype=torch.float32)

for name, model in [("Shallow (sigmoid)", shallow), ("Deep (relu)", deep)]:
    opt = torch.optim.SGD(model.parameters(), lr=1.5)
    for epoch in range(8000):
        pred = model(X_t)
        loss = nn.functional.mse_loss(pred, y_t)
        opt.zero_grad(); loss.backward(); opt.step()
    print(f"\\n{name} final predictions:")
    with torch.no_grad():
        for xi, yi in zip(X_t, y_t):
            print(f"  {xi.tolist()} -> {model(xi.unsqueeze(0)).item():.4f}  target={int(yi.item())}")`

function PythonContent() {
    return (
        <>
            <p>
                Three implementations showing the MLP at different levels of abstraction: a NumPy
                class that exposes every gradient equation, a shallow PyTorch model, and a deeper
                PyTorch model. The <code>make_mlp</code> helper lets you experiment with depth
                and width by changing a single list of layer sizes.
            </p>
            <CodeBlock code={PY_CODE} filename="mlp.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key experiment:</strong> try changing the shallow network's hidden size from 8 to 2.
                It still solves XOR. Now try a single layer (no hidden layer at all — just
                nn.Linear(2, 1) with sigmoid). It cannot converge, no matter how long you train.
                That is Minsky and Papert's 1969 result reproduced in code.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const MLP_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
