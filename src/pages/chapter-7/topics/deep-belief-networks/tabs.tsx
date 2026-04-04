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
        <div className="ch7-tl-item">
            <div className="ch7-tl-year">{item.year}</div>
            <div className="ch7-tl-title">{item.title}</div>
            <div className="ch7-tl-section-label">The context</div>
            <div className="ch7-tl-body">{item.challenge}</div>
            <div className="ch7-tl-section-label">What was introduced</div>
            <div className="ch7-tl-body">{item.what}</div>
            <div className="ch7-tl-section-label">Why it mattered</div>
            <div className="ch7-tl-body ch7-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2006",
            title: "Hinton's Breakthrough — Greedy Layer-Wise Training",
            challenge:
                "Deep neural networks (>2 hidden layers) were nearly impossible to train. Backpropagation suffered from vanishing gradients, and random initialization led to poor local minima. The neural network field had stagnated since the 1990s.",
            what:
                "Geoffrey Hinton proposed training deep networks layer by layer, using unsupervised pre-training with Restricted Boltzmann Machines (RBMs). Each RBM learns good feature representations before the next layer is added, guiding the network to a reasonable starting point.",
            impact:
                "This was the spark that ignited the deep learning revolution. For the first time, networks with 5+ layers could be trained effectively. It proved that depth wasn't the problem — initialization and training strategy were.",
        },
        {
            year: "2006",
            title: "Deep Belief Networks Take Shape",
            challenge:
                "Training a complete deep architecture end-to-end was failing. The problem was that gradients propagated poorly through random initializations of deep stacks.",
            what:
                "Hinton et al. published 'A Fast Learning Algorithm for Deep Belief Nets' introducing a greedy layer-wise pretraining strategy. Train an RBM on raw data, treat its hidden activations as new data, train another RBM, and finally fine-tune the entire stack with supervised backpropagation.",
            impact:
                "DBNs outperformed all existing methods on MNIST and other benchmarks. Suddenly deep networks were competitive again — and deeper was actually better.",
        },
        {
            year: "2007–2009",
            title: "Pretraining Becomes Standard",
            challenge:
                "The deep learning community needed to validate whether this approach worked beyond toy problems. Could it scale to real vision and speech tasks?",
            what:
                "Researchers applied deep autoencoders and DBNs to speech recognition (Dahl et al., 2009) and computer vision. Pretraining + fine-tuning became the standard recipe for training deep networks.",
            impact:
                "Major tech companies (Google, Microsoft, IBM) started investing heavily in deep learning. Speech recognition error rates dropped by 30% — enough to silence skeptics.",
        },
    ]

    return (
        <div className="ch7-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why couldn't we train deep neural networks?</h2>

            <Analogy label="The Thousand-Mile Journey">
                Imagine starting a journey in a completely random direction. The deeper your network, the harder it is to find the right path — you're lost in a massive maze with no map.
                <br /><br />
                Deep Belief Networks gave us a <strong>tour guide</strong>: first learn simple patterns, then build on them. Each layer gets a head start from the previous one.
            </Analogy>

            <Analogy label="Lego Blocks">
                Building a tall Lego tower from the top down would be impossible. But if you build layer by layer, starting from a solid foundation, it works!
                <br /><br />
                That is what unsupervised pretraining does — it builds each layer's understanding before stacking more on top.
            </Analogy>

            <Analogy label="The Warm-Up">
                Before running a marathon, you warm up. Before asking a deep network to solve a hard problem, you let it "warm up" by learning patterns in the data without labels.
                <br /><br />
                This warm-up (pretraining) puts the network in the right "starting position" so backpropagation can finish the training.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Deep Belief Networks: A breakthrough in depth</h2>

            <h3>The problem with deep networks</h3>
            <p>
                After the 1986 backpropagation breakthrough, researchers discovered a frustrating limitation:
                networks with more than 2-3 hidden layers were nearly impossible to train. Gradients would
                become vanishingly small in early layers, and random initialization led to terrible local minima.
            </p>

            <h3>The RBM building block</h3>
            <p>
                A Restricted Boltzmann Machine is a two-layer neural network with a visible layer and hidden layer.
                Unlike normal networks, RBMs are <strong>energy-based models</strong>
                that learn to reconstruct their input. The energy function is:
            </p>
            <MathBlock tex="E(v, h) = -\\sum_i b_i v_i - \\sum_j c_j h_j - \\sum_{i,j} v_i W_{ij} h_j" />
            <p>
                During training, the RBM learns weights that capture the statistical structure
                of the data — all <em>without labels</em>.
            </p>

            <h3>Greedy layer-wise pretraining</h3>
            <ol>
                <li>Train an RBM on raw input data (e.g., images)</li>
                <li>Use the RBM's hidden activations as new "data"</li>
                <li>Train another RBM on these features</li>
                <li>Repeat for as many layers as desired</li>
                <li>Stack them together and fine-tune with labeled data using backpropagation</li>
            </ol>

            <hr className="ch7-sep" />

            <div className="ch7-callout">
                <strong>Key insight:</strong> Each layer learns increasingly abstract features.
                The first RBM learns edges, the second learns corners and edges-of-edges,
                the third learns object parts, and so on — all automatically.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Deep Belief Networks: Mathematical foundations</h2>

            <DefBlock label="Restricted Boltzmann Machine">
                An RBM defines a joint probability distribution over visible units
                and hidden units via the energy function:
                <MathBlock tex="E(v,h) = -b^T v - c^T h - v^T W h" />
                where W is the weight matrix, b and c are biases. The probability of a configuration is:
                <MathBlock tex="P(v,h) = \\frac{1}{Z} e^{-E(v,h)}" />
                where Z is the partition function.
            </DefBlock>

            <h3>Conditional distributions</h3>
            <p>Due to the bipartite structure (no connections within layers):</p>
            <MathBlock tex="P(h_j = 1 | v) = \\sigma(c_j + \\sum_i W_{ij} v_i)" />
            <MathBlock tex="P(v_i = 1 | h) = \\sigma(b_i + \\sum_j W_{ij} h_j)" />
            <p>where σ(x) = 1/(1+e^(-x)) is the sigmoid function.</p>

            <h3>Contrastive Divergence (CD-k)</h3>
            <p>
                Training RBMs directly requires computing the partition function Z,
                which is intractable. Hinton proposed <strong>Contrastive Divergence</strong>:
            </p>
            <ol>
                <li>Sample hidden units given visible data</li>
                <li>Reconstruct visible units from the hidden sample</li>
                <li>Sample hidden units again from the reconstruction</li>
                <li>Update weights based on the difference between initial and reconstructed activations</li>
            </ol>

            <h3>Deep Belief Network construction</h3>
            <p>
                A DBN is formed by stacking RBMs. The top two layers form an RBM, while lower layers
                form directed sigmoid belief networks.
            </p>

            <div className="ch7-callout">
                <strong>Why CD works:</strong> Even one step (CD-1) gives a surprisingly good
                gradient estimate because the reconstruction is already closer to the
                true data distribution than random initialization.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Sigmoid and binary sampling ────────────────────────────────────────────────
def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -250, 250)))

def sample_binary(probs):
    return (np.random.rand(*probs.shape) < probs).astype(float)

# ── Restricted Boltzmann Machine ───────────────────────────────────────────────
class RBM:
    def __init__(self, n_visible, n_hidden, lr=0.1):
        self.n_visible = n_visible
        self.n_hidden = n_hidden
        self.lr = lr
        self.W = np.random.randn(n_hidden, n_visible) * 0.01
        self.h_bias = np.zeros(n_hidden)
        self.v_bias = np.zeros(n_visible)

    def forward(self, v):
        h_prob = sigmoid(self.h_bias + v @ self.W.T)
        h_sample = sample_binary(h_prob)
        return h_prob, h_sample

    def backward(self, h):
        v_prob = sigmoid(self.v_bias + h @ self.W)
        v_sample = sample_binary(v_prob)
        return v_prob, v_sample

    def contrastive_divergence(self, v0, k=1):
        h0_prob, h0 = self.forward(v0)
        vk = v0.copy()
        for _ in range(k):
            _, hk = self.forward(vk)
            _, vk = self.backward(hk)
        hk_prob, _ = self.forward(vk)

        self.W += self.lr * (h0_prob.T @ v0 - hk_prob.T @ vk) / v0.shape[0]
        self.v_bias += self.lr * (v0.mean(0) - vk.mean(0))
        self.h_bias += self.lr * (h0_prob.mean(0) - hk_prob.mean(0))
        return np.mean((v0 - vk) ** 2)

# Train on binary data
X = np.random.rand(1000, 784).astype(float)
rbm = RBM(n_visible=784, n_hidden=500, lr=0.1)
for epoch in range(10):
    error = rbm.contrastive_divergence(X, k=1)
    if epoch % 2 == 0:
        print(f"Epoch {epoch} | Recon error: {error:.4f}")

# Extract features for next layer
h_features, _ = rbm.forward(X)
print(f"Hidden features shape: {h_features.shape}")`;

function PythonTab() {
    return (
        <>
            <p>
                Pure NumPy implementation of an RBM with Contrastive Divergence training.
            </p>
            <CodeBlock code={PY_CODE} filename="rbm.py" lang="python" langLabel="Python" />
            <div className="ch7-callout">
                <strong>Key insight:</strong> The RBM is learning to reconstruct its input.
                After training, its hidden activations form a compressed, meaningful representation.
            </div>
        </>
    )
}

const TS_CODE = `// ── Restricted Boltzmann Machine in TypeScript ─────────────────────────────

type Vec = number[];
type Mat = number[][];

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, x))));
}

class RBM {
  W: Mat;
  vBias: Vec;
  hBias: Vec;
  lr: number;

  constructor(nVisible: number, nHidden: number, lr = 0.1) {
    this.lr = lr;
    this.W = Array.from({length: nHidden}, () =>
      Array.from({length: nVisible}, () => (Math.random() - 0.5) * 0.02)
    );
    this.vBias = new Array(nVisible).fill(0);
    this.hBias = new Array(nHidden).fill(0);
  }

  sampleH(v: Vec): [Vec, Vec] {
    const hProb = this.hBias.map((b, i) =>
      b + this.W[i].reduce((sum, w, j) => sum + w * v[j], 0)
    ).map(sigmoid);
    const hSample = hProb.map(p => Math.random() < p ? 1 : 0);
    return [hProb, hSample];
  }

  sampleV(h: Vec): [Vec, Vec] {
    const vProb = this.vBias.map((b, i) =>
      b + this.W.reduce((sum, w, j) => sum + w[i] * h[j], 0)
    ).map(sigmoid);
    const vSample = vProb.map(p => Math.random() < p ? 1 : 0);
    return [vProb, vSample];
  }

  contrastiveDivergence(v0: Vec, k: number): number {
    let vk = [...v0];
    const [h0Prob, h0] = this.sampleH(v0);
    let hk = [...h0];
    for (let step = 0; step < k; step++) {
      const [, vSample] = this.sampleV(hk);
      vk = vSample;
      const [, hSample] = this.sampleH(vk);
      hk = hSample;
    }
    const [hkProb] = this.sampleH(vk);

    for (let i = 0; i < this.W.length; i++) {
      for (let j = 0; j < this.W[0].length; j++) {
        this.W[i][j] += this.lr * (h0Prob[i] * v0[j] - hkProb[i] * vk[j]);
      }
    }
    for (let j = 0; j < this.vBias.length; j++) {
      this.vBias[j] += this.lr * (v0[j] - vk[j]);
    }
    for (let i = 0; i < this.hBias.length; i++) {
      this.hBias[i] += this.lr * (h0Prob[i] - hkProb[i]);
    }
    return v0.reduce((sum, v, i) => sum + (v - vk[i]) ** 2, 0);
  }
}

const rbm = new RBM(784, 500, 0.1);
const sample = Array.from({length: 784}, () => Math.random() < 0.3 ? 1 : 0);
for (let epoch = 0; epoch < 1000; epoch++) {
  if (epoch % 200 === 0) {
    console.log(\`Epoch \${epoch}, error: \${rbm.contrastiveDivergence(sample, 1).toFixed(4)}\`);
  }
}`;

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript implementation of an RBM with Contrastive Divergence.
            </p>
            <CodeBlock code={TS_CODE} filename="rbm.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch7-callout">
                <strong>Historical note:</strong> This CD-1 algorithm was crucial for making
                RBMs practical.
            </div>
        </>
    )
}

export const DEEP_BELIEF_NETWORKS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
