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
            year: "1984",
            title: "The State of the Art Before Backprop — CART and Symbolic AI",
            challenge:
                "Chapter 4 showed that by 1984, Breiman's CART algorithm had become the dominant learnable model for structured data. CART split the feature space into axis-aligned boxes, selecting splits greedily to minimise impurity. It was interpretable, reliable, and required no gradient computation whatsoever. Meanwhile, the broader AI community was dominated by expert systems — programs that encoded human knowledge as hand-written rules. Both approaches shared a fatal limitation: they required feature engineering by humans. No algorithm could look at raw pixels or raw audio and learn useful representations from scratch.",
            what: "The period 1979–1984 also saw the maturation of pattern recognition theory. Vapnik's VC dimension gave a rigorous framework for generalisation. Hopfield networks (1982) showed that associative memory could be modelled with recurrent networks trained by energy minimisation, not gradient descent. The stage was being set for a different kind of learning — one that did not require humans to specify what features mattered.",
            impact:
                "CART's success crystallised the field's split: on one side, classical ML methods (decision trees, nearest neighbours, SVMs-to-come) that were mathematically tractable and interpretable; on the other, neural networks that were biologically inspired but computationally intractable for anything deeper than one layer. Backpropagation would rupture that split permanently.",
        },
        {
            year: "1970 – 1974",
            title: "Linnainmaa and Werbos — Two Independent Discoveries Nobody Noticed",
            challenge:
                "Training a neural network with multiple layers required computing partial derivatives of the loss with respect to every weight. For a network with thousands of weights, computing each partial separately — perturbing one weight at a time and measuring the change in loss — was computationally ruinous. Finite-difference approximation was orders of magnitude too slow. The chain rule of calculus implied that derivatives of compositions could be computed efficiently, but no one had worked out the algorithm for network graphs.",
            what: "Seppo Linnainmaa described a general method for automatic differentiation of nested computational expressions in his 1970 University of Helsinki master's thesis — the first complete description of reverse-mode automatic differentiation (AD). Paul Werbos independently derived the backpropagation algorithm in his 1974 Harvard PhD dissertation, explicitly targeting multi-layer network training. He demonstrated it on economic forecasting models. Both papers derived the exact algorithm used in modern deep learning frameworks.",
            impact:
                "Neither result was widely read. Linnainmaa's thesis was in Finnish. Werbos's dissertation was published in a field (systems science) distant from AI. The algorithm existed — complete and correct — but the field was in its first AI winter, and there was no community to receive it. This makes backpropagation one of the clearest examples of a discovery whose time had not yet come: a correct algorithm waiting a decade for the community to be ready for it.",
        },
        {
            year: "1982 – 1985",
            title: "Parker, Le Cun — Three Rediscoveries in Rapid Succession",
            challenge:
                "The early 1980s saw a renaissance of neural network interest driven by Hopfield networks and the growing Parallel Distributed Processing (PDP) research group at UCSD. Researchers working independently — without knowledge of Werbos or Linnainmaa — were converging on the same algorithm. The intellectual pressure to train multi-layer networks had become intense enough that multiple groups found backpropagation simultaneously.",
            what: "David Parker rediscovered backpropagation in 1982 (MIT Technical Report, 1985) and patented it. Yann Le Cun independently derived it in 1985 while at ESIEE Paris, applied it to character recognition, and published in a French workshop proceedings. The PDP group at UCSD — Rumelhart, Hinton, McClelland, and colleagues — was also closing in on the algorithm. Three independent simultaneous derivations of the same algorithm in three years signals that an idea's moment has genuinely arrived.",
            impact:
                "Le Cun's early character recognition experiments hinted at what would become LeNet and modern computer vision. Parker's patent (never enforced) created early commercial interest. Most importantly, the multiple independent discoveries meant that by 1985, the idea was in the air across several research communities — setting up the 1986 Nature paper as an instant landmark rather than an obscure contribution.",
        },
        {
            year: "1986",
            title: "Rumelhart, Hinton and Williams — Learning Internal Representations",
            challenge:
                "The PDP group needed a clean, definitive presentation of backpropagation that would convince the broader cognitive science and AI community. The key conceptual barrier was not mathematical — the chain rule was taught in every calculus course — but interpretive: researchers hadn't seen hidden layers as computing meaningful intermediate representations. The question was whether backprop could train hidden layers to form useful internal codes, not just output mappings.",
            what: "David Rumelhart, Geoffrey Hinton, and Ronald Williams published 'Learning representations by back-propagating errors' in Nature (October 9, 1986). The paper demonstrated backprop on three illustrative tasks: the XOR problem, a symmetry detection task, and — most strikingly — an encoder network that learned to represent 8 mutually exclusive inputs in just 3 hidden bits, discovering binary arithmetic autonomously. The presentation was pellucid: the algorithm was presented as a communication protocol flowing error signals backward through layers, not merely as an application of the chain rule.",
            impact:
                "This paper ended the first AI winter for neural networks. Its publication in Nature (not an AI conference) signalled a result of broad scientific interest. Within five years, connectionists were applying backprop to speech recognition (CMU, 1987), NLP (Elman nets, 1990), and image recognition (LeCun's LeNet, 1989). The paper split the field into connectionists (who trained distributed representations) and classicists (who hand-coded symbolic rules) — a debate that lasted until 2012 when deep learning won definitively on ImageNet.",
        },
        {
            year: "1989 – 1998",
            title: "LeCun, Bottou — Scaling Backprop to Real Problems",
            challenge:
                "Pure backpropagation on fully connected networks was computationally expensive and suffered from local minima on complex tasks. For it to work on real pattern recognition problems — handwritten digits, speech phonemes — researchers needed architectural insights that reduced the search space and made training tractable. The challenge was engineering, not theory: the algorithm was known; the question was how to make it work at scale.",
            what: "Yann LeCun combined backpropagation with convolutional architectures and weight sharing at Bell Labs (1989), producing LeNet for digit recognition. Léon Bottou and LeCun formalised stochastic (online) backpropagation: update weights after each sample rather than the full batch. This made training on large datasets practical and produced an implicit regularisation effect — the gradient noise from individual samples helped escape sharp local minima.",
            impact:
                "LeCun's convolutional networks demonstrated that backpropagation wasn't just a toy algorithm — it could power real deployed systems. AT&amp;T's check-reading system (LeNet-based) was processing millions of cheques per day by 1995. Stochastic gradient descent became the default training algorithm for every neural network built since, eventually evolving into the Adam optimiser that trains GPT models today.",
        },
        {
            year: "2000 – present",
            title: "Automatic Differentiation — Backprop Generalised",
            challenge:
                "By 2000, backpropagation was well understood for feedforward networks, but applying it manually to new architectures — attention mechanisms, graph networks, dynamic computation graphs — required error-prone hand derivation of gradient equations. Researchers wanted a system that would compute exact gradients automatically for any differentiable computation, not just feed-forward neural networks.",
            what: "The development of automatic differentiation (AD) frameworks — Theano (2010), Torch (2011), TensorFlow (2015), PyTorch (2017) — generalised backpropagation from a specific neural network algorithm to a general-purpose tool for differentiating arbitrary programs. Reverse-mode AD (the generalisation of backprop) computes exact gradients of scalar outputs with respect to all inputs in one backward pass, regardless of the program's structure.",
            impact:
                "Modern AD frameworks made backpropagation invisible. Researchers no longer derive gradient equations by hand — they write the forward computation and call .backward(). This democratisation was crucial: Transformer architectures, graph neural networks, and neural ODEs were all discovered and trained without any hand-coded gradients. The 1986 paper's core insight — apply the chain rule layer by layer — is now a general computation primitive underlying all of modern machine learning.",
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
            <h2>How does a neural network learn from its mistakes?</h2>

            <p className="ch-story-intro">
                Chapter 4 gave computers the ability to ask yes/no questions — decision trees that learned interpretable rules from labeled data. But trees drew rigid, blocky boundaries. The same year CART was published (1984), Geoffrey Hinton was working on something fundamentally different: networks of units inspired by neurons, trained by flowing error signals backwards through layers. That paper — published in Nature in 1986 — ended the AI Winter and launched a new era.
            </p>

            <Analogy label="The Blame Game">
                Imagine you're playing a game where you have to guess a secret number. Your friend tells you every time you're wrong — but not just "wrong"; they tell you <em>how</em> wrong and <em>which part</em> of your guess was responsible.
                <br /><br />
                That's exactly what <strong>backpropagation</strong> does. When the network makes a mistake at the end, it works backwards through every layer to figure out how much each part contributed to the error — like tracing a leak back to its source. The algorithm assigns a "blame score" to every single weight in the network, all in one efficient pass.
                <br /><br />
                Before backpropagation, the only way to adjust a weight was to try changing it and see if the network got better. With 10,000 weights, that meant 10,000 separate experiments just to take one step. Backprop computes the blame score for all 10,000 weights simultaneously, in the same time as two forward passes.
            </Analogy>

            <Analogy label="Passing Blame Up the Chain">
                Think of a relay race where the baton drops. The last runner says: "I dropped it because you passed it too slowly." That runner tells the runner before: "You made me rush." And so on backwards — all the way to the first runner.
                <br /><br />
                Backpropagation is the same idea: the <em>output layer</em> says "the middle layer contributed X% to my error", the middle layer tells the <em>input layer</em> "you contributed Y%", and everyone adjusts accordingly. The signal flows backward through the chain.
                <br /><br />
                The reason this works is the <strong>chain rule</strong> from calculus. Each layer only needs to know two things: how wrong the <em>next</em> layer was, and how its own output affects the next layer. Those two pieces of information are enough to compute its own blame score — no global information needed.
            </Analogy>

            <Analogy label="Why It Took So Long To Be Discovered">
                The mathematical idea behind backpropagation — the chain rule — has been in every calculus textbook since Leibniz invented it in 1675. So why wasn't backpropagation discovered until the 1970s?
                <br /><br />
                The missing step was viewing the chain rule as a <em>backward message-passing protocol</em>, not just a mathematical formula. You have to think of the network as a directed graph, imagine error signals as messages that can travel backward through the edges, and see that each node only needs to receive one message to compute its own gradient. That's a computational insight, not a mathematical one. It's the kind of idea that seems obvious in hindsight but requires the right way of thinking about the problem.
                <br /><br />
                Werbos had the idea in 1974; Le Cun, Parker, and Rumelhart rediscovered it independently by 1985. Three groups found the same thing within a decade of each other — a sure sign the idea's time had come.
            </Analogy>

            <Analogy label="The Bottleneck Experiment That Changed Everything">
                In the famous 1986 paper, Rumelhart and Hinton ran an experiment: they gave a network 8 input units, forced the signal through just 3 hidden units, and asked it to reproduce the input on 8 output units.
                <br /><br />
                The 3 hidden units had to somehow encode 8 different patterns in 3 numbers. After training with backprop, the network's hidden units had spontaneously learned to represent each input as a 3-bit binary number — it had discovered binary counting on its own!
                <br /><br />
                Nobody told it to use binary. It figured that out because binary code is the most efficient way to encode 8 alternatives in 3 bits. This showed something profound: backpropagation didn't just train weights — it discovered structure in data. The algorithm was finding <em>internal representations</em>, not just fitting a function.
            </Analogy>

            <Analogy label="Modern Backprop — It's Now Automatic">
                Today you don't write backpropagation by hand. You write the forward pass — how the network computes its output — and PyTorch or TensorFlow automatically computes all the gradients for you with a call to .backward().
                <br /><br />
                This is called <em>automatic differentiation</em>. The framework records every computation you make (building a computation graph), then runs the chain rule backward through that graph. The same idea works for attention mechanisms, graph networks, and architectures that Rumelhart and Hinton couldn't have imagined in 1986.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Backpropagation: the chain rule in a loop</h2>

            <h3>The forward pass</h3>
            <p>
                Given input <strong>x</strong>, each layer <em>l</em> computes its pre-activation and activation:
            </p>
            <MathBlock tex="z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \qquad a^{(l)} = \sigma(z^{(l)})" />
            <p>
                where <InlineMath tex="a^{(0)} = x" /> is the input. The final output <InlineMath tex="\hat{y} = a^{(L)}" /> is compared to the true label using a loss <InlineMath tex="L(y, \hat{y})" />, most commonly mean squared error for regression or cross-entropy for classification.
            </p>

            <h3>The backward pass — applying the chain rule</h3>
            <p>
                Backprop computes <InlineMath tex="\partial L / \partial W^{(l)}" /> for every layer by repeatedly applying the chain rule. Starting from the output layer and working inward, define the error signal at layer <em>l</em> as:
            </p>
            <MathBlock tex="\delta^{(l)} = \frac{\partial L}{\partial z^{(l)}}" />
            <p>
                At the output layer, this is the gradient of the loss directly. For every hidden layer, the chain rule gives the recursive formula:
            </p>
            <MathBlock tex="\delta^{(l)} = \left(W^{(l+1)}\right)^\top \delta^{(l+1)} \odot \sigma'(z^{(l)})" />
            <p>
                where <InlineMath tex="\odot" /> is element-wise multiplication. This says: take the downstream error signal, weight it by the transposed connection matrix, then scale by the local gradient of the activation function.
            </p>

            <h3>The weight gradient</h3>
            <p>
                Once <InlineMath tex="\delta^{(l)}" /> is known, the gradient of the loss with respect to the weights and biases in layer <em>l</em> is simply:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial W^{(l)}} = \delta^{(l)} \left(a^{(l-1)}\right)^\top, \qquad \frac{\partial L}{\partial b^{(l)}} = \delta^{(l)}" />

            <h3>The weight update</h3>
            <p>
                All weights are updated in the direction of steepest descent:
            </p>
            <MathBlock tex="W^{(l)} \leftarrow W^{(l)} - \eta\, \frac{\partial L}{\partial W^{(l)}}" />
            <p>
                where <InlineMath tex="\eta" /> is the learning rate — a hyperparameter controlling the step size. Too large and training diverges; too small and training is prohibitively slow.
            </p>

            <h3>Why the algorithm is efficient</h3>
            <p>
                A naive approach would compute each weight's gradient by perturbing it slightly and measuring the change in loss — one forward pass per weight. For a million-weight network, that's a million forward passes just to take one gradient step. Backprop reuses computed <InlineMath tex="\delta^{(l)}" /> signals across all weights in the same layer, reducing the total cost to roughly two forward passes regardless of the number of weights.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The efficiency insight:</strong> naive finite-difference gradient computation costs O(W) forward passes where W is the number of weights. Backpropagation computes the same gradient in O(1) forward passes — a speedup that makes training million-parameter models feasible. This is why backprop is not just convenient but fundamentally enabling.
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
            <h2>Formal derivation of backpropagation</h2>

            <DefBlock label="Loss Function">
                The loss <InlineMath tex="L: \mathbb{R}^K \times \mathbb{R}^K \to \mathbb{R}" /> measures discrepancy between the network's prediction <InlineMath tex="\hat{y} = f(\mathbf{x}; \mathbf{W})" /> and the true label <strong>y</strong>. Common choices: mean squared error <InlineMath tex="L = \frac{1}{2}\|y - \hat{y}\|^2" /> for regression; cross-entropy <InlineMath tex="L = -\sum_k y_k \log \hat{y}_k" /> for classification.
            </DefBlock>

            <h3>Two-phase computation</h3>
            <p>
                A network with <em>L</em> layers computes the function composition:
            </p>
            <MathBlock tex="f(\mathbf{x}; \mathbf{W}) = \sigma_L\!\left(W^{(L)} \sigma_{L-1}\!\left(W^{(L-1)} \cdots \sigma_1(W^{(1)}\mathbf{x} + b^{(1)}) \cdots + b^{(L-1)}\right) + b^{(L)}\right)" />
            <p>
                The <strong>forward pass</strong> computes all intermediate activations <InlineMath tex="z^{(l)}, a^{(l)}" /> for <InlineMath tex="l = 1, \ldots, L" /> and caches them. The <strong>backward pass</strong> then computes gradients from the loss outward, reusing these cached values.
            </p>

            <h3>Gradient at the output layer</h3>
            <p>
                For cross-entropy loss with softmax output, the gradient at layer <em>L</em> simplifies beautifully:
            </p>
            <MathBlock tex="\delta^{(L)} = \frac{\partial L}{\partial z^{(L)}} = \hat{y} - y" />
            <p>
                This elegant result arises because softmax and cross-entropy are a conjugate pair: the softmax Jacobian and the cross-entropy gradient cancel to leave just prediction minus truth. This is why cross-entropy + softmax is the canonical pairing for classification.
            </p>

            <h3>Recursive delta rule — the core of backprop</h3>
            <p>
                For any hidden layer <InlineMath tex="l < L" />, the chain rule gives:
            </p>
            <MathBlock tex="\delta^{(l)} = \frac{\partial L}{\partial z^{(l)}} = \underbrace{\left(W^{(l+1)}\right)^\top \delta^{(l+1)}}_{\text{upstream error}} \odot \underbrace{\sigma'(z^{(l)})}_{\text{local gradient}}" />
            <p>
                The error signal <InlineMath tex="\delta^{(l)}" /> is the downstream error weighted by the transposed weight matrix (reversing the forward-pass transformation), then modulated by how sensitive the activation function is at the current pre-activation value.
            </p>

            <h3>Weight gradients</h3>
            <p>
                Once <InlineMath tex="\delta^{(l)}" /> is known for all layers, weight gradients follow immediately:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial W^{(l)}} = \delta^{(l)} \left(a^{(l-1)}\right)^\top" />
            <MathBlock tex="\frac{\partial L}{\partial b^{(l)}} = \delta^{(l)}" />
            <p>
                For mini-batch training, these are averaged over all examples in the batch before applying the update.
            </p>

            <DefBlock label="Automatic Differentiation (Reverse Mode)">
                Modern frameworks implement backpropagation as <em>reverse-mode automatic differentiation</em> on a computation graph. Each node stores its output value (forward pass) and a function to compute its contribution to the incoming gradient (backward pass). The backward pass is exactly the chain-rule recursion above, applied to arbitrary computation graphs — not just layer-stacked MLPs. This is what enables gradients for attention, graph networks, and any differentiable program.
            </DefBlock>

            <div className="ch-callout">
                <strong>Computational complexity:</strong> backprop performs O(L) sequential chain-rule steps, each involving matrix operations of size determined by layer widths. Total cost is <InlineMath tex="O\!\left(\sum_l n_l \cdot n_{l-1}\right)" /> — proportional to the number of weights — roughly 2× the cost of a single forward pass. This is the fundamental reason deep learning is computationally tractable.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

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
def forward(X, W1, b1, W2, b2):
    z1 = X @ W1.T + b1          # (batch, 4)
    a1 = sigmoid(z1)            # (batch, 4)
    z2 = a1 @ W2.T + b2         # (batch, 1)
    a2 = sigmoid(z2)            # (batch, 1)
    return z1, a1, z2, a2

def backward(X, y, z1, a1, z2, a2, W2):
    batch = X.shape[0]
    # Output layer gradient
    delta2 = (a2 - y) * sigmoid_grad(z2)   # (batch, 1)
    grad_W2 = (delta2.T @ a1) / batch
    grad_b2 = delta2.mean(axis=0)
    # Hidden layer gradient via chain rule
    delta1 = (delta2 @ W2) * sigmoid_grad(z1)  # (batch, 4)
    grad_W1 = (delta1.T @ X) / batch
    grad_b1 = delta1.mean(axis=0)
    return grad_W1, grad_b1, grad_W2, grad_b2

# ── Train on XOR ─────────────────────────────────────────────────────────────
np.random.seed(42)
W1 = np.random.randn(4, 2) * 0.5
b1 = np.zeros(4)
W2 = np.random.randn(1, 4) * 0.5
b2 = np.zeros(1)

X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)

lr = 1.5
for epoch in range(15000):
    z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
    loss = mse(y, a2)
    gW1, gb1, gW2, gb2 = backward(X, y, z1, a1, z2, a2, W2)
    W1 -= lr * gW1;  b1 -= lr * gb1
    W2 -= lr * gW2;  b2 -= lr * gb2
    if epoch % 3000 == 0:
        print(f"Epoch {epoch:5d} | Loss: {loss:.5f}")

_, _, _, a2_final = forward(X, W1, b1, W2, b2)
print("\\nFinal predictions:")
for i in range(4):
    print(f"  Input {[int(x) for x in X[i]]} -> {a2_final[i,0]:.4f} (target: {int(y[i,0])})")

# ── PyTorch version (automatic differentiation) ───────────────────────────────
import torch
import torch.nn as nn

class TinyMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 4), nn.Sigmoid(),
            nn.Linear(4, 1), nn.Sigmoid(),
        )
    def forward(self, x):
        return self.net(x)

model  = TinyMLP()
opt    = torch.optim.SGD(model.parameters(), lr=1.5)
X_t    = torch.tensor(X, dtype=torch.float32)
y_t    = torch.tensor(y, dtype=torch.float32)

for epoch in range(15000):
    pred = model(X_t)
    loss = 0.5 * ((pred - y_t) ** 2).mean()
    opt.zero_grad()
    loss.backward()   # backprop is automatic
    opt.step()

print("\\nPyTorch final predictions:")
with torch.no_grad():
    for i, (xi, yi) in enumerate(zip(X_t, y_t)):
        print(f"  {xi.tolist()} -> {model(xi.unsqueeze(0)).item():.4f} (target: {int(yi.item())})")`

function PythonContent() {
    return (
        <>
            <p>
                Two implementations of backpropagation for a 2&#8594;4&#8594;1 MLP trained on XOR:
                a pure NumPy version that makes the gradient equations explicit, and a PyTorch
                version that uses automatic differentiation. XOR requires a hidden layer —
                this is exactly the problem Minsky proved a single perceptron cannot solve.
            </p>
            <CodeBlock code={PY_CODE} filename="backprop.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>What to observe:</strong> the NumPy version makes every gradient equation
                visible — delta2, delta1, and the outer products for weight gradients. The PyTorch
                version achieves the same result with a single .backward() call. After ~15,000 epochs
                both converge: the network learns that (0,0) and (1,1) produce 0 while (0,1) and
                (1,0) produce 1 — something no single perceptron can represent.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const BACKPROPAGATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
