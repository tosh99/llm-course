import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

function HistoryTab() {
    return (
        <>
            <h2>From perceptrons to deep networks</h2>

            <h3>1943 – 1985: The quiet years</h3>
            <p>
                After Minsky & Papert's 1969 result, single-layer perceptrons were abandoned. But researchers never stopped wondering: what if you stacked multiple layers? The theoretical appeal was clear — a two-layer network could represent any boolean function — but without an efficient training algorithm, these "multi-layer perceptrons" remained theoretical curiosities.
            </p>

            <h3>1986: Backprop brings MLPs to life</h3>
            <p>
                Rumelhart, Hinton & Williams showed that backpropagation could train multi-layer networks end-to-end. A two-layer network (one hidden layer + output layer) could solve XOR, learn internal representations, and approximate any continuous function. MLPs were reborn.
            </p>

            <h3>The universal approximation theorem</h3>
            <p>
                Cybenko (1989) and Hornik et al. (1989) independently proved that a single hidden layer with a non-linear activation can approximate any continuous function on a compact domain — given enough hidden units. This mathematical guarantee explained why MLPs were so expressive, even if the theorem said nothing about how to <em>learn</em> the right weights.
            </p>

            <div className="ch4-callout">
                <strong>The depth trade-off:</strong> a single wide hidden layer <em>can</em> approximate any function in theory. In practice, deep networks (many layers) often learn more efficiently and generalize better than a single extremely wide layer — a phenomenon explored more fully in the ResNet era (2015 onward).
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why one layer isn't enough — and how more layers fix everything</h2>

            <Analogy label="The Perceptron is a One-Layer Thinker">
                A single perceptron can only draw <em>one straight line</em> through the data. Imagine trying to separate cats from dogs with just one line — what if some cats look like dogs and vice versa? One line can't handle it.
            </Analogy>

            <Analogy label="The MLP: A Team of Layers">
                An MLP is like a team of judges stacked in a row. The first layer makes simple decisions: "is there a pointy ear?" The second layer takes those simple decisions and combines them into more complex ones: "pointy ears AND a small nose might mean a cat." A third layer combines those, and so on.
                <br /><br />
                Each layer doesn't need to solve the whole problem — it just needs to transform the data into something slightly more useful for the next layer.
            </Analogy>

            <Analogy label="Breaking XOR with Two Layers">
                Remember XOR? One line can't separate the four XOR points. But two lines can:
                <br /><br />
                Draw one line that separates (0,1) from the others. Draw another that separates (1,0). Now combine them with an OR operation — and XOR is solved!
                <br /><br />
                The <em>first hidden layer</em> draws those lines. The <em>second layer</em> combines them. Two layers beat one perceptron.
            </Analogy>

            <Analogy label="The Universal Approximation Theorem — A Magic Blanket">
                Mathematicians proved something amazing: if you give a single-layer network enough tiny hidden units, it can theoretically learn <em>anything</em> — any shape, any pattern. It's like saying: with enough tiny squares, you can cover any shape on a map.
                <br /><br />
                But there's a catch: you might need <em>billions</em> of squares. With multiple layers, you can cover the same shape using fewer, smarter squares — and the network learns faster.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Architecture of a Multi-Layer Perceptron</h2>

            <h3>Structure</h3>
            <p>
                An MLP has <strong>L</strong> layers: an input layer (no activation), <em>L−1</em> hidden layers, and an output layer. Each layer <em>l</em> applies a linear transformation followed by a non-linear activation:
            </p>
            <MathBlock tex="z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \qquad a^{(l)} = \sigma(z^{(l)})" />
            <p>
                where <InlineMath tex="a^{(0)} = x" /> is the input and <InlineMath tex="a^{(L)} = \hat{y}" /> is the output.
            </p>

            <h3>XOR as a two-layer problem</h3>
            <p>
                A two-layer MLP (one hidden layer, one output unit) solves XOR:
            </p>
            <MathBlock tex="\hat{y} = \sigma\big( w_1^{(2)} \sigma(w_{11}^{(1)} x_1 + w_{21}^{(1)} x_2 + b_1^{(1)}) + w_2^{(2)} \sigma(w_{12}^{(1)} x_1 + w_{22}^{(1)} x_2 + b_2^{(1)}) + b^{(2)} \big)" />
            <p>
                The hidden layer (with 2 units) learns to draw the two diagonal separating lines. The output layer ORs them together — XOR solved.
            </p>

            <h3>Why non-linearity is essential</h3>
            <p>
                If <InlineMath tex="\sigma" /> were the identity function (linear activation), the entire network would collapse to a single linear transformation — no matter how many layers. Deep networks only gain their expressive power from non-linear activations at each layer.
            </p>

            <hr className="ch4-sep" />

            <div className="ch4-callout">
                <strong>Capacity vs. efficiency:</strong> the universal approximation theorem says a single hidden layer can represent <em>any</em> function. But "can" ≠ "efficiently." Deep networks exploit compositional structure in data (images, language, audio) far better than a single wide layer would.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal MLP theory</h2>

            <DefBlock label="Universal Approximation Theorem (Cybenko, 1989)">
                Let <InlineMath tex="\sigma" /> be any continuous, non-polynomial activation function (e.g., sigmoid). For any continuous function <InlineMath tex="f: [0,1]^n \to \mathbb{R}" /> and any <InlineMath tex="\epsilon > 0" />, there exists a single-hidden-layer network with a finite number <em>M</em> of hidden units such that:
                <InlineMath tex="\big| f(x) - \sum_{j=1}^M \alpha_j \sigma(w_j^\top x + b_j) \big| < \epsilon \quad \forall x \in [0,1]^n" />
                The theorem guarantees existence, not that backprop can find those weights.
            </DefBlock>

            <h3>Expressive power of depth</h3>
            <p>
                While width (number of hidden units in a layer) gives raw capacity, depth (number of layers) gives compositional efficiency. Telgadsky (2017) showed that there exist functions where depth <em>exponentially reduces</em> the width needed:
            </p>
            <ul>
                <li>Boolean parity functions: depth <em>O(log n)</em> with width <em>O(1)</em> requires width <em>O(2ⁿ)</em> in a single layer</li>
                <li>Image-like hierarchical patterns: shallow networks need exponentially more units than deep networks</li>
                <li>Poelman & Goodman (2016): modular arithmetic can be represented compactly in deeper networks</li>
            </ul>

            <h3>VC dimension of MLPs</h3>
            <p>
                The VC dimension of an MLP with <em>W</em> weights and <em>L</em> layers is <InlineMath tex="O(W \cdot L)" /> ( Baum & Haussler, 1989). More weights → more expressive → greater risk of overfitting. This motivates regularization.
            </p>

            <h3>Output activation choices</h3>
            <p>
                The output layer activation depends on the task:
            </p>
            <ul>
                <li><strong>Regression</strong>: identity (no activation), loss = MSE</li>
                <li><strong>Binary classification</strong>: sigmoid, loss = binary cross-entropy</li>
                <li><strong>Multi-class classification</strong>: softmax, loss = categorical cross-entropy</li>
            </ul>
        </>
    )
}

const PY_CODE = `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

class MLP:
    """
    A simple multi-layer perceptron with one hidden layer.
    Trains on XOR — the canonical problem single-layer perceptrons can't solve.
    """

    def __init__(self, n_in, n_hidden, n_out, lr=0.5):
        # Xavier-style initialization
        self.W1 = np.random.randn(n_hidden, n_in) * np.sqrt(2.0 / n_in)
        self.b1 = np.zeros(n_hidden)
        self.W2 = np.random.randn(n_out, n_hidden) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros(n_out)
        self.lr = lr

    def forward(self, X):
        # Hidden layer
        self.z1 = X @ self.W1.T + self.b1
        self.a1 = sigmoid(self.z1)
        # Output layer
        self.z2 = self.a1 @ self.W2.T + self.b2
        self.a2 = sigmoid(self.z2)
        return self.a2

    def backward(self, X, y):
        n = X.shape[0]
        # Output delta
        delta2 = (self.a2 - y) * self.a2 * (1 - self.a2)
        # Hidden delta
        delta1 = (delta2 @ self.W2) * self.a1 * (1 - self.a1)
        # Gradients
        self.W2 -= self.lr * delta2.T @ self.a1 / n
        self.b2 -= self.lr * delta2.mean(axis=0)
        self.W1 -= self.lr * delta1.T @ X / n
        self.b1 -= self.lr * delta1.mean(axis=0)

    def train(self, X, y, epochs=10000):
        for epoch in range(epochs):
            pred = self.forward(X)
            self.backward(X, y)
            if epoch % 2000 == 0:
                loss = 0.5 * np.mean((pred - y) ** 2)
                print(f"Epoch {epoch:5d} | MSE: {loss:.6f}")

# ── Train on XOR ─────────────────────────────────────────────────────────────
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)

mlp = MLP(n_in=2, n_hidden=4, n_out=1, lr=1.5)
mlp.train(X, y, epochs=15000)

print("\\nFinal predictions:")
for i in range(4):
    p = mlp.forward(X[i:i+1])[0,0]
    print(f"  {X[i]} -> {p:.4f} (target: {int(y[i,0])})")`

function PythonTab() {
    return (
        <>
            <p>
                A minimal MLP class in NumPy, trained on XOR. The key is the hidden layer:
                without it, no amount of training can separate the XOR points.
            </p>
            <CodeBlock code={PY_CODE} filename="mlp.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── MLP: 2 → hidden → 1 ──────────────────────────────────────────────────
type Vec = number[];
type Mat = number[][];

function sigmoid(x: number): number {
  const c = Math.max(-500, Math.min(500, x));
  return 1 / (1 + Math.exp(-c));
}

function sigmoidPrime(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

class MLP {
  W1: Mat; b1: Vec; W2: Mat; b2: Vec;
  private z1: Vec = []; private a1: Vec = [];

  constructor(
    private nIn: number,
    private nHidden: number,
    private nOut: number,
    private lr = 0.5
  ) {
    const s1 = Math.sqrt(2 / nIn);
    this.W1 = Array.from({ length: nHidden }, () =>
      Array.from({ length: nIn }, () => (Math.random() * 2 - 1) * s1));
    this.b1 = new Array(nHidden).fill(0);

    const s2 = Math.sqrt(2 / nHidden);
    this.W2 = Array.from({ length: nOut }, () =>
      Array.from({ length: nHidden }, () => (Math.random() * 2 - 1) * s2));
    this.b2 = new Array(nOut).fill(0);
  }

  private dotVec(A: Mat, x: Vec): Vec {
    return A.map(row => row.reduce((s, a, i) => s + a * x[i], 0));
  }

  private addVec(a: Vec, b: Vec): Vec { return a.map((x, i) => x + b[i]); }

  forward(x: Vec): Vec {
    this.z1 = this.addVec(this.dotVec(this.W1, x), this.b1);
    this.a1 = this.z1.map(sigmoid);
    const z2 = this.addVec(this.dotVec(this.W2, this.a1), this.b2);
    return z2.map(sigmoid);
  }

  backward(x: Vec, y: number): void {
    const yHat = this.forward(x);
    const outErr = yHat.map((p, i) => (p - y) * sigmoidPrime(yHat[i]));
    const hErr = this.W2[0].map((w, i) => outErr[0] * w * sigmoidPrime(this.z1[i]));

    for (let j = 0; j < this.nHidden; j++) {
      this.W1[j] = this.W1[j].map((w, k) => w - this.lr * hErr[j] * x[k]);
      this.b1[j] -= this.lr * hErr[j];
    }
    for (let j = 0; j < this.nHidden; j++) {
      this.W2[0][j] -= this.lr * outErr[0] * this.a1[j];
      this.b2[0] -= this.lr * outErr[0];
    }
  }

  train(X: Vec[], y: number[], epochs = 10000): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < X.length; i++) this.backward(X[i], y[i]);
      if (epoch % 2000 === 0) {
        const loss = X.reduce((s, xi, i) => {
          const p = this.forward(xi)[0];
          return s + 0.5 * (p - y[i]) ** 2;
        }, 0) / X.length;
        console.log(\`Epoch \${epoch} | Loss: \${loss.toFixed(6)}\`);
      }
    }
  }
}

// ── Train on XOR ─────────────────────────────────────────────────────────────
const mlp = new MLP(2, 4, 1, 1.5);
const X: Vec[] = [[0,0],[0,1],[1,0],[1,1]];
const y: number[] = [0, 1, 1, 0];
mlp.train(X, y, 15000);

console.log("\\nFinal:");
X.forEach((xi, i) => console.log(\`  [\${xi}] -> \${mlp.forward(xi)[0].toFixed(4)} (target: \${y[i]})\`));`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript MLP class for XOR. The architecture mirrors the 1986 Rumelhart
                et al. paper: one hidden layer with sigmoid activations, trained by backpropagation.
            </p>
            <CodeBlock code={TS_CODE} filename="mlp.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const MLP_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
