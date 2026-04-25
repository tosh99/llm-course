import { Analogy, CodeBlock, MathBlock } from "../../shared"
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
            year: "2001 – 2005",
            title: "The Dark Years — SVMs and Random Forests Dominate",
            challenge:
                "Chapter 8 showed how SVMs (1992), AdaBoost (1996), and Random Forests (2001) dominated applied ML through the early 2000s. By 2003, every major ML benchmark was topped by SVMs or ensemble methods. Neural networks beyond two layers were essentially untrained — backpropagation suffered from vanishing gradients, random initialisation led to poor local minima, and the computational cost of deep networks was prohibitive. Yann LeCun's group had demonstrated convolutional networks for vision (1998), but they could not scale beyond carefully constrained tasks. The neural network field had been stagnant for nearly a decade. Many senior ML researchers had concluded that depth was fundamentally misguided — that the human intuition about hierarchical representations was simply wrong as a computational principle.",
            what:
                "This period produced no major neural network breakthroughs. The field fragmented: kernel methods researchers developed more powerful kernels, Bayesian researchers developed Gaussian processes and structured probabilistic models, and the neural network community ran small experiments and waited. Hinton's group at the University of Toronto continued believing in depth but lacked a training method that worked.",
            impact:
                "The five-year dominance of SVMs and Random Forests over neural networks set up the 2006 paper as a genuine scientific surprise. When Hinton demonstrated that deep networks could be trained reliably — and could outperform SVMs on MNIST — it was shocking precisely because the field had concluded this was impossible. The surprise factor was essential to deep learning's eventual adoption: it forced researchers to update beliefs they had held confidently for years.",
        },
        {
            year: "2006",
            title: "Hinton — A Fast Learning Algorithm for Deep Belief Nets",
            challenge:
                "The core problem with training deep neural networks was initialisation. Random initialisation placed the network parameters in a region of the loss landscape surrounded by poor local minima — saddle points and flat plateaus where gradients were tiny. Backpropagation could not escape these regions because the gradient signal from the output layer was geometrically attenuated by factors of less than 1 at each layer (the vanishing gradient problem). The network had no way to form useful internal representations before being asked to solve the supervised task.",
            what:
                "Geoffrey Hinton, Simon Osindero, and Yee-Whye Teh proposed greedy layer-wise pretraining using Restricted Boltzmann Machines. An RBM is an energy-based generative model with visible units v and hidden units h, connected by weights W but with no within-layer connections. Each RBM is trained unsupervised using Contrastive Divergence (CD-1): run one step of Gibbs sampling to get a 'fantasy' data sample, then update weights by W += eta * (v h^T - v_fantasy h_fantasy^T). After training one RBM, treat its hidden activations as the input to a new RBM and repeat. Stack multiple RBMs to form a Deep Belief Network; then fine-tune the whole stack with supervised backpropagation from a small labelled dataset.",
            impact:
                "The paper demonstrated that a 4-layer network pretrained with DBNs outperformed SVMs on MNIST and produced representations that were useful for handwritten digit recognition. More importantly, it proved the feasibility principle: deep networks can be trained if initialisation is handled correctly. This reopened neural network research as a viable direction and catalysed an explosion of investment at Google Brain, DeepMind, Facebook AI Research, and Microsoft Research over the next five years.",
        },
        {
            year: "2006 – 2009",
            title: "Energy-Based Models — Boltzmann Machines and the Statistical Mechanics Connection",
            challenge:
                "To understand why RBMs work, researchers needed the statistical mechanics interpretation. An RBM defines a probability distribution over visible and hidden states via an energy function. Training maximises the log-likelihood of the visible data — equivalent to minimising the Kullback-Leibler divergence between the data distribution and the model distribution. But computing the exact log-likelihood gradient requires summing over all 2^n possible hidden states — exponential and intractable.",
            what:
                "The RBM energy function is E(v, h) = −b^T v − c^T h − v^T W h, where b are visible biases, c are hidden biases, and W is the weight matrix. The joint probability is P(v, h) = exp(−E(v,h)) / Z, where Z = sum_{v,h} exp(−E(v,h)) is the intractable partition function. Because there are no within-layer connections, the conditional distributions factorise: P(h_j = 1 | v) = sigma(c_j + W_j · v) and P(v_i = 1 | h) = sigma(b_i + W_i · h). Hinton's Contrastive Divergence approximation replaces the intractable model expectation with a one-step Gibbs sample — biased but empirically effective.",
            impact:
                "The energy-based model framework connected neural network training to statistical mechanics, thermodynamics, and information theory. Every modern generative model — VAEs, diffusion models, energy-based models, normalising flows — traces its theoretical foundation to this statistical mechanics interpretation. The partition function intractability that Contrastive Divergence bypasses is the same intractability that motivated variational inference in VAEs (Chapter 17) and score-based diffusion models (Chapter 18).",
        },
        {
            year: "2009",
            title: "Salakhutdinov & Hinton — Deep Boltzmann Machines",
            challenge:
                "DBNs had a hybrid architecture: the top two layers formed an undirected RBM while lower layers formed directed belief networks. This asymmetry made inference and generation awkward. Could a fully undirected deep generative model be trained? And could such a model learn even richer representations than DBNs?",
            what:
                "Ruslan Salakhutdinov and Geoffrey Hinton introduced the Deep Boltzmann Machine (DBM): a fully undirected multi-layer RBM where all connections are symmetric. Training required a more sophisticated variant of Contrastive Divergence with upward and downward passes to propagate uncertainty through all layers simultaneously. They showed that DBMs learned representations useful for classification on MNIST and NORB (object recognition from 3D viewpoints).",
            impact:
                "The DBM was the peak of the pretraining era. Within three years, ReLU activations and better initialisation (Chapter 9, ReLU and Initialization topics) would make pretraining unnecessary — deep networks could be trained end-to-end from random initialisation without unsupervised warming. The pretraining approach became obsolete surprisingly quickly. But the conceptual legacy remained: the idea that layer-by-layer representation learning is possible and useful directly shaped the transfer learning paradigm (Chapter 14) and self-supervised pretraining in BERT and GPT (Chapters 19–21).",
        },
        {
            year: "2006 – 2012",
            title: "Speech Recognition — The First Large-Scale Success",
            challenge:
                "Image recognition benchmarks were too small to conclusively demonstrate deep learning's advantage. MNIST had only 60,000 training examples — large enough for SVMs to be competitive. A more demanding test was automatic speech recognition (ASR): continuous speech from varied speakers, with millions of labelled audio frames. If deep networks could beat the hidden Markov model (HMM) systems that had dominated ASR for 20 years, it would be a watershed moment.",
            what:
                "George Dahl, Dong Yu, Li Deng, and Alex Acero at Microsoft Research (2012) trained deep networks using DBN pretraining on phone recognition from the TIMIT corpus, achieving a 20.7% error rate versus the HMM baseline of 24.4% — a 16% relative improvement. Abdel-Hamid et al. extended this to CNN-based acoustic models. The results convinced speech recognition teams at Google, Microsoft, IBM, and Baidu to switch from GMM-HMM systems to deep networks by 2013.",
            impact:
                "The ASR breakthrough was the first large-scale commercial validation of deep learning. Speech recognition products deployed by Google Voice Search (2012), Siri, and Cortana were the first consumer-facing applications of deep learning, reaching hundreds of millions of users. This commercial success created the investment pressure that funded AlexNet's hardware, ImageNet's curation, and the entire GPU deep learning ecosystem. Without the speech recognition success, the ImageNet moment (Chapter 10) might have arrived years later.",
        },
        {
            year: "2012",
            title: "The Transition — Pretraining Becomes Optional",
            challenge:
                "By 2012, researchers noticed that DBN pretraining — which had been essential in 2006 — was becoming less necessary. As datasets grew larger, as ReLU replaced sigmoid activations, and as He initialisation replaced random Gaussian initialisation, networks trained end-to-end from scratch began matching and then exceeding pretrained networks. Was pretraining fundamentally necessary, or had it just been compensating for other deficiencies?",
            what:
                "The consensus that emerged: pretraining was solving the wrong problem. It compensated for three deficiencies that better techniques could address directly: (1) poor initialisation — solved by Xavier and He initialisation; (2) vanishing gradients — solved by ReLU; (3) overfitting — solved by dropout and data augmentation. AlexNet (2012) trained from random initialisation with He-like initialisation, ReLU activations, and dropout, and outperformed all pretrained networks by a large margin on ImageNet.",
            impact:
                "The obsolescence of pretraining was the moment the deep learning field found its stable toolkit. The four ingredients of the modern era — depth (DBNs proved it was possible), ReLU (solved vanishing gradients), dropout (solved overfitting), and He initialisation (solved the initialisation problem) — came together in AlexNet. Chapter 10 tells the story of how Alex Krizhevsky assembled these ingredients on two gaming GPUs and produced the result that reshaped the entire technology industry.",
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

// ── Kid Tab ──────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>How do you start climbing a mountain in the dark?</h2>

            <p className="ch-story-intro">
                For five years — 2001 to 2006 — Random Forests and SVMs won every ML competition. Neural networks were considered a dead end for anything beyond two layers. The problem was not the idea of deep networks; it was training them. Then in 2006, Geoffrey Hinton published a paper that restarted the clock and launched the modern deep learning era.
            </p>

            <Analogy label="The problem — lost in a dark maze">
                Training a deep neural network is like navigating a maze in complete darkness. You start at a random position (random initialisation) and try to find the exit (the minimum of the loss function) by feeling your way along the walls (gradient descent).
                <br /><br />
                In a shallow network (one or two layers), the maze is manageable. In a deep network (five or more layers), the maze becomes so vast and dark that you wander in circles forever — the gradient signal from the destination fades before it reaches the early layers. Researchers called this vanishing gradients.
            </Analogy>

            <Analogy label="Hinton's solution — warm up layer by layer">
                Hinton's insight: before trying to navigate the whole maze in the dark, light a small torch and explore each room separately. Train the first layer of the network on raw data — no labels, no supervision — just to find patterns. Then use those patterns as input to train the second layer. Then the third. Each layer gets a warm start from the one below.
                <br /><br />
                This is greedy layer-wise pretraining. "Greedy" because you optimise one layer at a time without worrying about the full network. "Layer-wise" because you train one layer before adding the next. "Pretraining" because this is a warm-up before the real supervised training begins.
            </Analogy>

            <Analogy label="The Restricted Boltzmann Machine — an unsupervised pattern finder">
                Each layer is pretrained as a Restricted Boltzmann Machine (RBM) — a two-layer network that learns to reconstruct its inputs without any labels. An RBM is like a compression machine that finds the most important patterns in the data and stores them in its hidden layer.
                <br /><br />
                After training, the hidden layer of the RBM becomes the input to the next RBM. Each successive layer finds patterns in the patterns — increasingly abstract representations. By the time you have four layers, the top layer sees the world through a lens of learned features, not raw pixels.
            </Analogy>

            <Analogy label="The energy model — patterns as valleys">
                RBMs are energy-based models. Think of the network's state space as a landscape with valleys and mountains. Patterns that the network has learned correspond to valleys — low-energy states the network naturally settles into. Unlearned patterns are mountains — high-energy states the network avoids.
                <br /><br />
                Training an RBM lowers the energy of training data (making those states easy to reach) and raises the energy of randomly generated states (making those hard to reach). The result: the RBM's energy landscape is a map of what the training data looks like.
            </Analogy>

            <Analogy label="Why pretraining mattered — and why it became obsolete">
                Pretraining gave deep networks a meaningful starting point instead of random initialisation. But by 2012, three better solutions appeared: ReLU activations (stopped gradients from vanishing), He initialisation (gave a smart starting point without unsupervised training), and dropout (prevented overfitting without needing careful pretraining). The warm-up became unnecessary.
                <br /><br />
                Deep Belief Networks did not succeed as the final form of deep learning. They succeeded as proof of concept — demonstrating that depth was possible and that hierarchical representations were real. Everything that came after (AlexNet, ResNets, Transformers, GPT) built on that proof.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>RBM Energy Function and Partition Function</h3>
            <MathBlock tex="E(v, h) = -b^\top v - c^\top h - v^\top W h" />
            <MathBlock tex="P(v, h) = \frac{e^{-E(v,h)}}{Z}, \quad Z = \sum_{v,h} e^{-E(v,h)}" />
            <p>
                The partition function Z sums over all 2^(n_v + n_h) states — exponentially intractable. The log-likelihood gradient with respect to W is:
            </p>
            <MathBlock tex="\frac{\partial \log P(v)}{\partial W_{ij}} = \langle v_i h_j \rangle_{\text{data}} - \langle v_i h_j \rangle_{\text{model}}" />
            <p>
                The data term (E under the data distribution) is tractable: compute h | v exactly via sigma(c + W^T v). The model term (E under the full joint distribution) is intractable — requires the partition function. Contrastive Divergence approximates the model term with a k-step Gibbs chain from the data.
            </p>

            <h3>Contrastive Divergence (CD-k)</h3>
            <p>
                CD-k approximates the log-likelihood gradient by running k Gibbs steps starting from the training data:
            </p>
            <MathBlock tex="\Delta W \approx \eta\bigl(\langle v^{(0)} h^{(0)\top} \rangle_{\text{data}} - \langle v^{(k)} h^{(k)\top} \rangle_{\text{recon}}\right)" />
            <p>
                In practice k = 1 (CD-1) works well. The algorithm: (1) clamp v to data; (2) sample h^0 from P(h | v^0); (3) sample v^1 from P(v | h^0); (4) sample h^1 from P(h | v^1); (5) update W += eta * (v^0 h^&#123;0T&#125; − v^1 h^&#123;1T&#125;). CD-1 is biased (not the true gradient) but consistently improves the model — proven empirically across thousands of experiments.
            </p>

            <h3>DBN Generative Model — Directed + Undirected Layers</h3>
            <p>
                A 3-layer DBN defines a joint probability: P(v, h^1, h^2) = P(h^1, h^2) * P(v | h^1), where P(h^1, h^2) is the RBM joint at the top two layers and P(v | h^1) is the directed sigmoid belief network from the first RBM. Greedy pretraining provides a lower bound on the log-likelihood that improves with each added layer — the theoretical justification for layer-by-layer training.
            </p>
        </>
    )
}

const PY_DBN = `import numpy as np

# ── Sigmoid ───────────────────────────────────────────────────────────────────
def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -250, 250)))

def sample_binary(probs):
    return (np.random.rand(*probs.shape) < probs).astype(float)


# ── Restricted Boltzmann Machine ──────────────────────────────────────────────
class RBM:
    """
    Hinton et al. (2006) Restricted Boltzmann Machine.
    Trained with Contrastive Divergence (CD-1).
    Energy: E(v,h) = -b'v - c'h - v'Wh
    """

    def __init__(self, n_visible, n_hidden, lr=0.01):
        self.W = np.random.randn(n_visible, n_hidden) * 0.01
        self.b = np.zeros(n_visible)   # Visible bias
        self.c = np.zeros(n_hidden)    # Hidden bias
        self.lr = lr

    def h_given_v(self, v):
        """P(h=1 | v) = sigma(c + Wv)"""
        return sigmoid(v @ self.W + self.c)

    def v_given_h(self, h):
        """P(v=1 | h) = sigma(b + W'h)"""
        return sigmoid(h @ self.W.T + self.b)

    def contrastive_divergence(self, v0, k=1):
        """CD-k training step."""
        # Positive phase: data
        h0_prob = self.h_given_v(v0)
        h0 = sample_binary(h0_prob)

        # Negative phase: k Gibbs steps
        vk, hk = v0.copy(), h0.copy()
        for _ in range(k):
            vk_prob = self.v_given_h(hk)
            vk = sample_binary(vk_prob)
            hk_prob = self.h_given_v(vk)
            hk = sample_binary(hk_prob)

        # Weight update: data correlation - reconstruction correlation
        batch_size = v0.shape[0]
        dW = (v0.T @ h0_prob - vk.T @ hk_prob) / batch_size
        db = (v0 - vk).mean(axis=0)
        dc = (h0_prob - hk_prob).mean(axis=0)

        self.W += self.lr * dW
        self.b += self.lr * db
        self.c += self.lr * dc

        # Reconstruction error (L2)
        return np.mean((v0 - vk_prob) ** 2)

    def transform(self, v):
        """Extract hidden representation (deterministic)."""
        return self.h_given_v(v)


# ── Deep Belief Network ───────────────────────────────────────────────────────
class DBN:
    """
    Hinton, Osindero & Teh (2006) Deep Belief Network.
    Stack of RBMs trained greedily layer by layer.
    """

    def __init__(self, layer_sizes, lr=0.01):
        """
        layer_sizes: [n_visible, n_hidden1, n_hidden2, ...]
        """
        self.rbms = []
        for i in range(len(layer_sizes) - 1):
            rbm = RBM(layer_sizes[i], layer_sizes[i+1], lr=lr)
            self.rbms.append(rbm)

    def pretrain(self, X, n_epochs=10, batch_size=64):
        """Greedy layer-wise pretraining."""
        data = X.copy()
        for layer_idx, rbm in enumerate(self.rbms):
            print(f"\nPretraining layer {layer_idx+1} "
                  f"({rbm.W.shape[0]} -> {rbm.W.shape[1]} units)")

            n = data.shape[0]
            for epoch in range(n_epochs):
                # Mini-batch SGD
                idx = np.random.permutation(n)
                total_error = 0
                n_batches = 0

                for start in range(0, n, batch_size):
                    batch = data[idx[start:start + batch_size]]
                    error = rbm.contrastive_divergence(batch, k=1)
                    total_error += error
                    n_batches += 1

                if epoch % 5 == 0:
                    print(f"  Epoch {epoch:3d}: recon error = "
                          f"{total_error / n_batches:.4f}")

            # Pass data through this layer for the next RBM
            data = rbm.transform(data)
            print(f"  Hidden activations shape: {data.shape}")

        return self

    def transform(self, X):
        """Forward pass through all layers (deterministic)."""
        h = X
        for rbm in self.rbms:
            h = rbm.transform(h)
        return h


# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# Synthetic MNIST-like: 784-dimensional binary data
n_samples = 2000
# Create structured data: 10 clusters (like 10 digit classes)
X = np.zeros((n_samples, 784))
for i in range(n_samples):
    cluster = np.random.randint(10)
    # Each cluster activates a different pattern of pixels
    base = np.zeros(784)
    base[cluster*78:(cluster+1)*78] = 1
    X[i] = (np.random.rand(784) < (0.1 + 0.7 * base)).astype(float)

print("Training DBN with greedy layer-wise pretraining")
print(f"Input shape: {X.shape}")
print("Architecture: 784 -> 500 -> 250")
print("=" * 50)

dbn = DBN(layer_sizes=[784, 500, 250], lr=0.05)
dbn.pretrain(X, n_epochs=20, batch_size=128)

# Extract deep representations
representations = dbn.transform(X)
print(f"\nDeep representation shape: {representations.shape}")
print(f"Representation mean: {representations.mean():.3f}")
print(f"Representation sparsity: {(representations < 0.1).mean()*100:.1f}% near-zero")`

function PythonContent() {
    return (
        <>
            <p>
                Pure NumPy implementation of a Deep Belief Network with greedy layer-wise pretraining using Contrastive Divergence. Demonstrates the full DBN training pipeline: RBM training on raw data, passing hidden representations to the next layer, and extracting deep features.
            </p>
            <CodeBlock code={PY_DBN} filename="dbn_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Each RBM is trained on the output of the previous one — the network learns increasingly abstract representations without any labels. This unsupervised pretraining is what gave deep networks a good initialisation before supervised fine-tuning, solving the training problem that had stalled the field since 1986.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Deep Belief Networks — greedy layer-wise pretraining</h2>

            <h3>The Problem with Deep Networks Before 2006</h3>
            <p>
                Backpropagation through 5+ layer networks failed because sigmoid activations saturated: for large or small pre-activation values, the sigmoid derivative is near zero. Multiplying near-zero derivatives across layers caused the gradient to vanish exponentially. Random initialisation placed networks in regions of the loss landscape from which gradient descent could not escape. The field needed a way to initialise deep networks in good regions before supervised training began.
            </p>

            <h3>The RBM Building Block</h3>
            <p>
                A Restricted Boltzmann Machine is an energy-based model with visible layer v and hidden layer h, connected by weights W with no within-layer connections. The energy function:
            </p>
            <MathBlock tex="E(v, h) = -b^\top v - c^\top h - v^\top W h" />
            <p>
                Because there are no within-layer connections, conditional distributions factorise completely — each hidden unit is conditionally independent of others given v, and vice versa:
            </p>
            <MathBlock tex="P(h_j = 1 \mid v) = \sigma(c_j + W_j \cdot v) \qquad P(v_i = 1 \mid h) = \sigma(b_i + W_i \cdot h)" />

            <h3>Contrastive Divergence Training</h3>
            <p>
                CD-k approximates the log-likelihood gradient by running k Gibbs steps from the data distribution. The weight update:
            </p>
            <MathBlock tex="\Delta W_{ij} \approx \eta \Bigl(\langle v_i h_j \rangle_{\text{data}} - \langle v_i h_j \rangle_{\text{k-step recon}}\Bigr)" />
            <p>
                CD-1 (one Gibbs step) is biased but empirically effective — reconstructions after one step are much closer to the data distribution than random states, so the negative phase approximation is reasonable.
            </p>

            <h3>Greedy Layer-Wise Pretraining Algorithm</h3>
            <ol>
                <li>Train RBM_1 on raw data X; extract hidden representations H_1 = sigma(c_1 + X W_1)</li>
                <li>Train RBM_2 on H_1; extract H_2 = sigma(c_2 + H_1 W_2)</li>
                <li>Repeat for as many layers as desired</li>
                <li>Stack into a DBN; add a softmax layer; fine-tune with backpropagation on labelled data</li>
            </ol>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Why pretraining helped:</strong> The pretrained weights placed the network in a region of parameter space where the loss surface was locally convex — the representations learned by each RBM were meaningful starting points for the supervised task. Fine-tuning then adjusted these representations without needing to discover them from scratch. By 2012, ReLU and He initialisation made pretraining unnecessary — but the principle of good initialisation it established became the foundation of the entire field.
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

// ── Tab content map ─────────────────────────────────────────────────────────

export const DEEP_BELIEF_NETWORKS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
