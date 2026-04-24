import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

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
            year: "2012",
            title: "Early Observations — Hinton et al.",
            challenge:
                "Deep networks were powerful but prone to overfitting. With millions of parameters and limited training data, they simply memorized the training set instead of learning general patterns.",
            what:
                "Geoffrey Hinton's team noticed that randomly dropping out neurons during training forced the network to learn redundant representations. If one path was blocked, another had to take over.",
            impact:
                "This observation led to the formalization of dropout as a regularization technique. The key insight: training with stochastic noise creates an implicit ensemble of many sub-networks.",
        },
        {
            year: "2014",
            title: "Dropout—Srivastava et al.",
            challenge:
                "Despite architectural advances, deep networks still overfit on medium-sized datasets. Existing regularization (L2 weight decay) wasn't sufficient for the emerging deep CNNs.",
            what:
                "Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever, and Ruslan Salakhutdinov published 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting' in JMLR. During training, randomly set each neuron's output to zero with probability p (typically 0.5), and scale activations by 1/(1-p) during testing.",
            impact:
                "Dropout became the standard regularization technique for deep learning. It reduced error rates on ImageNet, MNIST, and many other benchmarks. AlexNet already used dropout to achieve its breakthrough results.",
        },
        {
            year: "2014–2016",
            title: "Dropout Variants and Adoption",
            challenge:
                "Standard dropout worked well for fully-connected layers, but convolutional layers needed different treatment. Also, some tasks needed structured dropout.",
            what:
                "Spatial Dropout: drops entire feature maps (better for CNNs). DropConnect: drops weights instead of activations. Variational Dropout: learned dropout rates. Monte Carlo Dropout: using dropout at test time for uncertainty estimation.",
            impact:
                "Dropout became ubiquitous in deep learning pipelines. Modern architectures still use it, though techniques like Batch Normalization have partially reduced its necessity in some cases.",
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
            <h2>What is Dropout and why does it work?</h2>

            <Analogy label="The Team Sport">
                Imagine a basketball team where during practice, random players have to sit out each play. This forces every player to be ready to step up at any time—and prevents the team from relying too heavily on one star player.
                <br /><br />
                Dropout does the same thing. During training, random neurons are "benched," forcing the network to develop redundant skills and not rely too heavily on any single neuron.
            </Analogy>

            <Analogy label="The Cramming Student">
                A student who memorizes every detail of their notes will fail a test with slightly different questions. A student who truly understands the concepts will generalize better.
                <br /><br />
                Dropout prevents the network from "cramming" (memorizing the training data) by constantly changing what's available to memorize from.
            </Analogy>

            <Analogy label="The Implicit Ensemble">
                It's like training 1000 different smaller networks and averaging their answers. Dropout during training approximates this—each dropped-out configuration is a different "expert."
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Dropout: Randomness as regularization</h2>

            <h3>The overfitting problem</h3>
            <p>
                Modern neural networks have millions or billions of parameters. With limited training data, they can easily memorize every example instead of learning general patterns.
                This is overfitting: perfect on training data, terrible on new data.
            </p>

            <h3>How dropout works</h3>
            <p>
                During training, for each forward pass:
            </p>
            <ol>
                <li>For each neuron, flip a coin (with probability p, typically 0.5)</li>
                <li>If heads, set that neuron's output to zero</li>
                <li>Backpropagate through the remaining active neurons</li>
            </ol>
            <p>
                This means every training example sees a different, smaller network.
                The network learns to work even when parts are missing—forcing robust representations.
            </p>

            <h3>Test time: scaling</h3>
            <p>
                At test time, we use the full network—but we need to compensate for having more active neurons than during training. We multiply all activations by the keep probability (1-p):
            </p>
            <MathBlock tex="y_{\\text{test}} = (1-p) \\cdot W x = p_{\\text{keep}} \\cdot W x" />

            <h3>Why it prevents overfitting</h3>
            <ul>
                <li><strong>Prevents co-adaptation:</strong> Neurons can't rely on specific other neurons being present</li>
                <li><strong>Implicit ensemble:</strong> Training with dropout is like training 2^n sub-networks</li>
                <li><strong>Stochastic averaging:</strong> The final network averages predictions from many configurations</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>AlexNet used dropout:</strong> Krizhevsky et al. applied dropout to the
                fully-connected layers of AlexNet with p=0.5. This was crucial for achieving
                their ImageNet breakthrough.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Dropout: Mathematical formulation</h2>

            <DefBlock label="Dropout Operation">
                Given a layer input x, dropout creates a masked version:
                <MathBlock tex="y = m \\odot x" />
                where m is a mask vector with elements drawn from Bernoulli(p), i.e., m_i ~ Bernoulli(p) independently. At test time:
                <MathBlock tex="y_{\\text{test}} = p \\cdot x = \\mathbb{E}[m] \\odot x" />
            </DefBlock>

            <h3>Training as ensemble learning</h3>
            <p>
                Consider a network with n neurons. Dropout creates 2^n possible sub-networks.
                During training, each mini-batch samples from this ensemble. The expected output is:
            </p>
            <MathBlock tex="\\mathbb{E}[y] = \\sum_{m} P(m) \\cdot f(x; m \\odot W)" />
            <p>
                where f is the network function and the sum is over all 2^n possible masks.
                At test time, using the full network with scaling approximates this expectation.
            </p>

            <h3>Regularization effect</h3>
            <p>
                Dropout can be viewed as adding noise to the learning process. The effective objective becomes:
            </p>
            <MathBlock tex="L_{\\text{dropout}}(W) = \\mathbb{E}_{m \\sim \\text{Bernoulli}(p)} [L(W, m)]" />
            <p>
                This expectation acts as a form of data augmentation—it's harder to fit noise when the
                network structure keeps changing.
            </p>

            <h3>Inverse dropout (modern practice)</h3>
            <p>
                Rather than scaling at test time, many frameworks now use "inverse dropout" where activations
                are scaled by 1/(1-p) during training:
            </p>
            <MathBlock tex="y_{\\text{train}} = \\frac{1}{1-p} \\cdot (m \\odot x)" />
            <p>
                This means no scaling is needed at test time—the test code looks identical to training code
                (except without dropout).
            </p>

            <div className="ch-callout">
                <strong>Connection to Bayesian learning:</strong> Gal and Ghahramani (2016) showed
                that dropout can be interpreted as approximate Bayesian inference, with the dropout
                mask acting as a variational distribution over network weights.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Dropout Implementation ───────────────────────────────────────────────────
def dropout(x, p=0.5, training=True):
    """
    Apply dropout to input x.

    x: input array
    p: dropout probability (fraction of units to drop)
    training: if True, apply dropout; if False, return scaled input
    """
    if not training:
        # At test time, scale by keep probability
        return x * (1 - p)

    # Training: create mask and apply
    mask = (np.random.rand(*x.shape) > p).astype(float)
    # Inverse dropout: scale during training
    return x * mask / (1 - p)

# ── Demonstration ────────────────────────────────────────────────────────────
np.random.seed(42)

# Simulate layer activations
x = np.random.randn(10)
print("Original activations:", x.round(3))

# Apply dropout multiple times to see different masks
print("\nDropout samples (p=0.5):")
for i in range(3):
    dropped = dropout(x, p=0.5, training=True)
    print(f"Sample {i+1}: {dropped.round(3)}")

# Test time (no dropout, just scaling)
test_out = dropout(x, p=0.5, training=False)
print(f"\nTest time (scaled by 0.5): {test_out.round(3)}")

# ── Expected value comparison ────────────────────────────────────────────────
print("\n" + "="*50)
print("Testing: E[dropout(x)] should ≈ x * (1-p)")
print("="*50)

x = np.ones(1000) * 2.0  # All 2s
num_trials = 1000
total = np.zeros_like(x)

for _ in range(num_trials):
    total += dropout(x, p=0.5, training=True)

empirical_mean = total / num_trials
theoretical_mean = x * 0.5

print(f"Input: all 2.0")
print(f"Empirical mean of dropout outputs: {empirical_mean[0]:.4f}")
print(f"Theoretical mean (x * 0.5): {theoretical_mean[0]:.4f}")

# ── Dropout in a layer ───────────────────────────────────────────────────────
class DropoutLayer:
    def __init__(self, p=0.5):
        self.p = p
        self.mask = None

    def forward(self, x, training=True):
        if training:
            self.mask = (np.random.rand(*x.shape) > self.p).astype(float)
            return x * self.mask / (1 - self.p)
        else:
            return x

    def backward(self, dL_dout):
        # Gradient only flows through active neurons
        return dL_dout * self.mask / (1 - self.p)

# Test in network context
layer = DropoutLayer(p=0.3)
x = np.random.randn(5, 10)  # Batch of 5, 10 features

out_train = layer.forward(x, training=True)
out_test = layer.forward(x, training=False)

print(f"\nDropout layer test (p=0.3):")
print(f"Input shape: {x.shape}")
print(f"Training output sparsity: {(out_train == 0).mean()*100:.1f}%")
print(f"Test output sparsity: {(out_test == 0).mean()*100:.1f}%")`;

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of dropout showing the masking operation and inverse dropout scaling.
            </p>
            <CodeBlock code={PY_CODE} filename="dropout_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Implementation detail:</strong> Modern frameworks use "inverse dropout"
                where scaling happens during training, making test-time code cleaner.
            </div>
        </>
    )
}

const TS_CODE = `// ── Dropout in TypeScript ──────────────────────────────────────────────────

type Vec = number[];
type Mat = number[][];

function dropoutVec(x: Vec, p: number, training: boolean): Vec {
  if (!training) {
    // Test time: scale by keep probability
    return x.map(v => v * (1 - p));
  }

  // Training: apply random mask with inverse scaling
  return x.map(v => {
    const keep = Math.random() > p ? 1 : 0;
    return v * keep / (1 - p);
  });
}

function dropoutMat(X: Mat, p: number, training: boolean): Mat {
  if (!training) {
    return X.map(row => row.map(v => v * (1 - p)));
  }

  return X.map(row => row.map(v => {
    const keep = Math.random() > p ? 1 : 0;
    return v * keep / (1 - p);
  }));
}

// ── Dropout Layer Class ─────────────────────────────────────────────────────
class DropoutLayer {
  p: number;
  mask: Mat | null = null;

  constructor(p = 0.5) {
    this.p = p;
  }

  forward(X: Mat, training = true): Mat {
    if (!training) {
      return X.map(row => row.map(v => v * (1 - this.p)));
    }

    // Create and store mask for backward pass
    this.mask = X.map(row =>
      row.map(() => Math.random() > this.p ? 1 : 0)
    );

    // Apply mask with inverse scaling
    return X.map((row, i) =>
      row.map((v, j) => v * this.mask![i][j] / (1 - this.p))
    );
  }

  backward(dL_dout: Mat): Mat {
    if (!this.mask) {
      throw new Error("Must call forward before backward");
    }
    return dL_dout.map((row, i) =>
      row.map((grad, j) => grad * this.mask![i][j] / (1 - this.p))
    );
  }
}

// ── Demonstration ───────────────────────────────────────────────────────────
const x: Vec = [1, 2, 3, 4, 5];

console.log("Dropout demonstration (p=0.5):");
console.log("Input:", x);

// Training samples
console.log("\nTraining samples:");
for (let i = 0; i < 3; i++) {
  const dropped = dropoutVec(x, 0.5, true);
  console.log(\`Sample \${i + 1}: [\${dropped.map(v => v.toFixed(2)).join(", ")}]\`);
}

// Test time
const testOut = dropoutVec(x, 0.5, false);
console.log(\`\nTest time (scaled by 0.5): [\${testOut.map(v => v.toFixed(2)).join(", ")}]\`);

// ── Layer demonstration ─────────────────────────────────────────────────────
console.log("\n" + "=".repeat(40));
console.log("Dropout Layer with batch");
console.log("=".repeat(40));

const dropoutLayer = new DropoutLayer(0.3);
const batch: Mat = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const trainOut = dropoutLayer.forward(batch, true);
console.log("Input:");
batch.forEach(row => console.log(\`  [\${row.join(", ")}]\`));
console.log("Training output (some values zeroed):");
trainOut.forEach(row => console.log(\`  [\${row.map(v => v.toFixed(2)).join(", ")}]\`));

const testOut2 = dropoutLayer.forward(batch, false);
console.log("Test output (uniformly scaled):");
testOut2.forEach(row => console.log(\`  [\${row.map(v => v.toFixed(2)).join(", ")}]\`));

// ── Expected value verification ─────────────────────────────────────────────
console.log("\n" + "=".repeat(40));
console.log("Expected value verification");
console.log("=".repeat(40));

const testInput: Vec = new Array(1000).fill(2.0);
const numTrials = 1000;
let sum = 0;

for (let i = 0; i < numTrials; i++) {
  const out = dropoutVec(testInput, 0.5, true);
  sum += out[0]; // Sum first element across trials
}

const empMean = sum / numTrials;
const theoMean = 2.0 * 0.5;

console.log(\`Input value: 2.0\`);
console.log(\`Empirical mean after dropout: \${empMean.toFixed(4)}\`);
console.log(\`Theoretical mean (2.0 * 0.5): \${theoMean.toFixed(4)}\`);`;

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript implementation of dropout with layer abstraction.
            </p>
            <CodeBlock code={TS_CODE} filename="dropout.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Practical note:</strong> The mask is saved during forward pass
                so the backward pass knows which gradients to propagate.
            </div>
        </>
    )
}

export const DROPOUT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
