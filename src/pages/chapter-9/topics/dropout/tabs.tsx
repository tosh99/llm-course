import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
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
            year: "2012",
            title: "The Overfitting Problem — Why Regularisation Was Urgent",
            challenge:
                "AlexNet had 60 million parameters and was trained on 1.2 million ImageNet images — roughly 50 parameters per training example. Classical statistics said this ratio guaranteed severe overfitting: the model would memorise training examples rather than learn generalisable features. L2 weight decay alone was insufficient at this scale. SVMs and Random Forests had theoretical reasons for not overfitting; deep networks had no such guarantee. The question was not whether AlexNet would overfit, but how badly — and whether any regularisation technique could control it.",
            what:
                "Hinton's group at the University of Toronto had been experimenting with randomly dropping neurons during training since at least 2010. The idea appeared in early unpublished technical reports and in Krizhevsky's AlexNet implementation (submitted to ImageNet competition in 2012) before the formal paper. Dropout was applied to the two fully connected layers (4,096 neurons each) with dropout probability p = 0.5, halving the effective number of parameters in those layers on each forward pass.",
            impact:
                "The AlexNet paper reported that without dropout, the network substantially overfitted the training data — the gap between training and validation accuracy was unacceptably large. With dropout, the network achieved a top-5 error rate of 15.3%, compared to 26.2% for the second-best submission (using SVMs). Dropout was directly responsible for making this margin possible. The technique worked so well that it became the standard regularisation method for deep learning within a year of the paper's publication.",
        },
        {
            year: "2014",
            title: "Srivastava, Hinton, Krizhevsky, Sutskever & Salakhutdinov — The JMLR Paper",
            challenge:
                "Despite dropout's success in AlexNet, the technique lacked formal mathematical analysis. How exactly did random neuron masking act as regularisation? What was the relationship between dropout and Bayesian model averaging? Was there a principled way to choose the dropout probability p? And could the heuristic of multiplying activations by (1 − p) at test time be justified theoretically?",
            what:
                "Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever, and Ruslan Salakhutdinov published 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting' in JMLR 2014 — the most thorough analysis of the technique. Key contributions: (1) The ensemble interpretation: a network with n units has 2^n possible subnetworks; training with dropout is equivalent to training an exponentially large ensemble where weights are shared. At test time, using the full network with scaled weights approximates the geometric mean of ensemble predictions. (2) Inverted dropout: scale activations by 1/(1−p) during training so test time requires no scaling. (3) Empirical results on 7 datasets showing dropout reduced error rates by 10-25% relative across vision, speech, and text tasks.",
            impact:
                "The JMLR paper gave dropout the theoretical foundation it had lacked. The ensemble interpretation was particularly powerful: dropout was not just a heuristic noise injection — it was principled approximate Bayesian model averaging over exponentially many architectures. This framework enabled subsequent work on variational dropout (Gal & Ghahramani 2016) and Monte Carlo dropout for uncertainty estimation. The paper remains one of the most cited ML papers of all time (60,000+ citations).",
        },
        {
            year: "2016",
            title: "Gal & Ghahramani — Variational Dropout and Bayesian Deep Learning",
            challenge:
                "Deep learning networks produced predictions but not uncertainty estimates. A network might predict 'dog' with 95% confidence on an out-of-distribution image of a cat — a catastrophic failure for safety-critical applications like medical diagnosis or autonomous driving. Bayesian neural networks could provide uncertainty estimates but were computationally intractable for large networks. Could dropout be repurposed to approximate Bayesian inference at training scale?",
            what:
                "Yarin Gal and Zoubin Ghahramani proved that a neural network with dropout applied before every weight layer is mathematically equivalent to a deep Gaussian process — specifically, to variational inference in a Bayesian neural network with a specific weight prior. The result: running dropout at test time (applying dropout masks during inference, not just training) and averaging over multiple stochastic forward passes gives an approximation to the Bayesian posterior predictive distribution. Prediction variance across MC-dropout samples measures model uncertainty.",
            impact:
                "Monte Carlo dropout became the standard uncertainty estimation method for deep learning applications. Medical AI systems use it to flag uncertain predictions for human review. Robotic planning systems use it to distinguish aleatoric uncertainty (noise in the data) from epistemic uncertainty (model ignorance). The Bayesian interpretation showed that dropout was not just a regularisation trick — it was a computationally tractable approximation to Bayesian inference, connecting deep learning to its probabilistic foundations in Chapter 1.",
        },
        {
            year: "2015",
            title: "Batch Normalisation — Dropout's Complement and Competitor",
            challenge:
                "As networks grew deeper (VGG with 16-19 layers, ResNet with 50-152 layers), training instability increased. Internal covariate shift — the change in layer input distribution as weights of preceding layers changed — slowed convergence and required careful learning rate tuning. Dropout was effective but slowed training (because dropped neurons reduced information flow). Could a normalisation technique stabilise training without the noise penalty?",
            what:
                "Sergey Ioffe and Christian Szegedy introduced Batch Normalisation (2015): normalise each layer's inputs to have zero mean and unit variance over the mini-batch, then apply learnable scale and shift parameters gamma and beta. BN acts as a regulariser by adding noise to activations (the mini-batch statistics are noisy estimates of the true statistics), reducing the need for dropout in convolutional layers. BN became standard in CNNs: VGG16 trained with BN and no dropout in convolutional layers, only dropout in fully connected layers.",
            impact:
                "Batch Normalisation partially replaced dropout in convolutional architectures but complemented it in fully connected layers. Modern vision networks (ResNet, EfficientNet, ViT) use BN (or Layer Normalisation in Transformers) in conv layers and often no dropout in those layers. The interaction between BN and dropout is complex: using both in the same layer can cause variance shifts at test time. The practical guidance: BN in convolutional layers, dropout in fully connected layers, attention dropout in Transformers.",
        },
        {
            year: "2015 – 2017",
            title: "Dropout Variants — Spatial Dropout, DropConnect, and Variational Dropout",
            challenge:
                "Standard dropout was designed for fully connected layers. Convolutional layers presented a different challenge: neighbouring pixels are highly correlated, so dropping individual pixels provided little decorrelation between the kept and dropped information. Dropping entire feature maps (channels) at once would be more effective. Similarly, applying dropout to weights rather than activations offered a different trade-off.",
            what:
                "Spatial Dropout (Tompson et al. 2015): drop entire feature maps from a convolutional layer rather than individual units. If a feature map is dropped, all spatial positions in that channel are zero — producing genuine independence between channels. DropConnect (Wan et al. 2013): drop individual weight connections rather than neuron activations, providing a more granular form of the ensemble approximation. Variational Dropout (Kingma, Salimans, Welling 2015): learned dropout rates per weight, derived from a variational Bayesian objective, producing sparse networks where many weights are effectively pruned.",
            impact:
                "Spatial Dropout became the standard for convolutional networks. DropConnect showed that the unit of stochastic masking could be weights rather than activations without sacrificing the regularisation benefit. Variational Dropout connected dropout to network pruning: networks trained with variational dropout often had 90%+ of weights effectively zeroed, producing compressed models without separate pruning steps. These ideas anticipate the sparse attention and weight pruning techniques used in efficient Transformers (Chapter 31).",
        },
        {
            year: "2017 – present",
            title: "Attention Dropout and Dropout in Transformers",
            challenge:
                "Transformer architectures (Chapter 19) introduced self-attention, a fundamentally different computation from feedforward layers. How should dropout be applied to attention weights? Should full attention heads be dropped? Should individual tokens be masked? Each choice had different regularisation properties and training stability implications.",
            what:
                "Standard Transformers apply dropout in three places: (1) embedding dropout — applied to the token embeddings before the first layer; (2) attention dropout — applied to the attention weight matrix after softmax, zeroing some attention connections; (3) residual dropout — applied to the output of each sub-layer before adding the residual connection. Typical rates: 0.1 for smaller models, 0 for very large models (GPT-3: no dropout, regularised by weight decay and data scale alone). Stochastic Depth (Huang et al. 2016) randomly drops entire Transformer blocks, equivalent to random depth sampling.",
            impact:
                "The experience with Transformers showed that at sufficient scale (billions of parameters, trillions of tokens), dropout becomes unnecessary — data scale alone acts as the regulariser. GPT-3 trained without dropout at all. This scale threshold for regularisation-free training is one of the defining properties of modern foundation models and remains an active research question: how large is 'large enough' that dropout provides no benefit?",
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
            <h2>Benching random players — and why it makes the team better</h2>

            <Analogy label="The team sport analogy">
                Imagine a basketball team where during practice, the coach randomly benches players — a different random set each play. This forces every player to learn every role and prevents the team from becoming too reliant on one star. When all five start together in the real game, each is more versatile and the team is more resilient.
                <br /><br />
                Dropout does exactly this. During training, random neurons are "benched" (set to zero) each forward pass. The network cannot rely on any single neuron — because that neuron might not be present in the next mini-batch. Every neuron must learn to be independently useful.
            </Analogy>

            <Analogy label="Preventing the cramming student">
                A student who memorises every fact verbatim fails the moment a question is phrased differently. A student who genuinely understands the material can answer questions they have never seen before.
                <br /><br />
                Dropout prevents the network from "cramming" the training data. Because different neurons are active each time, the network cannot memorise which specific combination of neurons fires for each training example. Instead, it learns more robust, distributed representations that generalise.
            </Analogy>

            <Analogy label="The implicit ensemble — millions of models for the price of one">
                A network with 1,000 neurons and 50% dropout can produce 2^{1000} different sub-networks — each the result of a different random masking. During training, we sample from this vast ensemble. At test time, we use the full network — which effectively averages the predictions of the entire ensemble at once.
                <br /><br />
                This geometric mean over exponentially many models is a powerful regulariser. AdaBoost explicitly trained multiple classifiers; dropout implicitly trains an exponentially large ensemble by weight sharing, for essentially the same computational cost as training one model.
            </Analogy>

            <Analogy label="Inverted dropout — the engineering trick">
                During training with 50% dropout, only half the neurons are active. Their outputs are twice as large on average than at test time (when all neurons are active). If we don't correct for this, the network will be biased at test time.
                <br /><br />
                The fix (inverted dropout): during training, scale up surviving activations by 1/(1-p). This keeps expected activation values the same between training and test time, so no correction is needed at inference. All modern frameworks (PyTorch, TensorFlow, JAX) implement inverted dropout — the test-time code looks identical to training code (just without the masking).
            </Analogy>

            <Analogy label="Uncertainty estimation — a surprising bonus">
                Gal and Ghahramani (2016) discovered something unexpected: if you keep dropout active at test time and run the network many times with different random masks, the variance of the predictions measures uncertainty. High variance: the model is unsure. Low variance: the model is confident.
                <br /><br />
                This Monte Carlo dropout gives neural networks a way to say "I don't know" — essential for medical AI, robotic planning, and any safety-critical application where overconfident predictions are dangerous.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Dropout as Approximate Model Averaging</h3>
            <p>
                A network with n units has 2^n possible subnetworks (by including or excluding each unit). Let m denote a binary mask (m_i ~ Bernoulli(1-p)). The dropout training objective is:
            </p>
            <MathBlock tex="\min_W \mathbb{E}_{m \sim \text{Bern}(1-p)} \bigl[\mathcal{L}(W,\, m)\bigr]" />
            <p>
                Training with SGD on this expectation samples a new m for each mini-batch. The expected loss is a regularised objective. At test time, using the full network with all units active and multiplying outputs by (1-p) approximates the geometric mean over all 2^n subnetworks — a consequence of the weight sharing across all masks.
            </p>

            <h3>Inverted Dropout — Variance Correction</h3>
            <MathBlock tex="y_{\text{train}} = \frac{m \odot x}{1 - p} \quad m_i \sim \text{Bernoulli}(1-p)" />
            <MathBlock tex="\mathbb{E}[y_{\text{train}}] = \frac{(1-p) \cdot x}{1-p} = x = y_{\text{test}}" />
            <p>
                Dividing by (1−p) during training preserves the expected activation magnitude. At test time, no scaling is needed — the full network with all units active produces the same expected output as the dropout network. This is why PyTorch's nn.Dropout applies scaling during training, not test time.
            </p>

            <h3>MC-Dropout Uncertainty Estimation</h3>
            <p>
                Run T forward passes with dropout at test time. The MC estimate of the predictive mean and variance:
            </p>
            <MathBlock tex="\hat{y} = \frac{1}{T}\sum_{t=1}^T f_{\hat{W},\, m_t}(x) \qquad \hat{\sigma}^2 = \frac{1}{T}\sum_{t=1}^T f_{\hat{W},\, m_t}(x)^2 - \hat{y}^2" />
            <p>
                Gal &amp; Ghahramani (2016) showed this is mathematically equivalent to variational inference in a Bayesian neural network with a specific prior, making MC-dropout a principled (though approximate) uncertainty estimator.
            </p>
        </>
    )
}

const PY_DROPOUT = `import numpy as np

# ── Dropout Implementation ────────────────────────────────────────────────────
def dropout(x, p=0.5, training=True):
    """
    Inverted dropout: scale surviving activations by 1/(1-p) during training
    so no correction is needed at test time.

    x: input array (any shape)
    p: probability of dropping each unit (p=0.5 is the standard default)
    training: apply dropout only during training
    """
    if not training:
        return x   # No dropout, no scaling — test time is clean

    keep_prob = 1.0 - p
    mask = (np.random.rand(*x.shape) < keep_prob).astype(float)
    # Inverted dropout: divide by keep_prob to maintain expected value
    return x * mask / keep_prob


# ── Verify Expected Value Invariance ─────────────────────────────────────────
np.random.seed(42)
x = np.ones((10000,)) * 2.0   # All 2.0

train_outputs = np.array([dropout(x, p=0.5, training=True) for _ in range(100)])
test_output = dropout(x, p=0.5, training=False)

print("Expected value invariance check:")
print(f"  Input mean:          {x.mean():.4f}")
print(f"  Training mean (avg): {train_outputs.mean():.4f}  (should be 2.0)")
print(f"  Test output mean:    {test_output.mean():.4f}  (should be 2.0)")


# ── Dropout Layer with Backprop ────────────────────────────────────────────────
class DropoutLayer:
    """
    Stateful dropout layer that saves the mask for backpropagation.
    Gradient only flows through active neurons.
    """

    def __init__(self, p=0.5):
        self.p = p
        self.mask = None

    def forward(self, x, training=True):
        if training:
            keep_prob = 1.0 - self.p
            self.mask = (np.random.rand(*x.shape) < keep_prob).astype(float)
            return x * self.mask / keep_prob
        return x   # No mask at test time

    def backward(self, dL_dout):
        """Gradient flows only through active (non-dropped) neurons."""
        if self.mask is None:
            return dL_dout
        return dL_dout * self.mask / (1.0 - self.p)


# ── Monte Carlo Dropout for Uncertainty Estimation ───────────────────────────
class MCDropoutNetwork:
    """
    Simple feedforward network that supports MC-Dropout uncertainty estimation.
    """

    def __init__(self, n_in, n_hidden, n_out, p=0.5):
        self.W1 = np.random.randn(n_in, n_hidden) * 0.1
        self.W2 = np.random.randn(n_hidden, n_out) * 0.1
        self.p = p

    def forward(self, x, training=True):
        h = np.maximum(0, x @ self.W1)   # ReLU
        h = dropout(h, p=self.p, training=training)
        return h @ self.W2   # Linear output

    def predict_with_uncertainty(self, x, n_samples=100):
        """MC-Dropout: run n_samples forward passes with dropout active."""
        preds = np.array([self.forward(x, training=True) for _ in range(n_samples)])
        # preds shape: (n_samples, batch, n_out)
        mean = preds.mean(axis=0)
        variance = preds.var(axis=0)
        return mean, variance


# ── Demo: Uncertainty on In vs Out-of-Distribution Data ──────────────────────
np.random.seed(42)
net = MCDropoutNetwork(n_in=10, n_hidden=64, n_out=1, p=0.5)

# In-distribution: data similar to training data
x_in = np.random.randn(5, 10) * 1.0
# Out-of-distribution: data far from training distribution
x_out = np.random.randn(5, 10) * 10.0

mean_in, var_in = net.predict_with_uncertainty(x_in, n_samples=200)
mean_out, var_out = net.predict_with_uncertainty(x_out, n_samples=200)

print("\nMC-Dropout uncertainty estimation:")
print(f"In-distribution  — mean var: {var_in.mean():.4f}")
print(f"Out-of-distribution — mean var: {var_out.mean():.4f}")
print(f"Uncertainty ratio: {var_out.mean() / var_in.mean():.1f}x higher OOD")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of inverted dropout with backpropagation support, plus Monte Carlo dropout for uncertainty estimation — demonstrating how a single technique serves both regularisation and Bayesian uncertainty goals.
            </p>
            <CodeBlock code={PY_DROPOUT} filename="dropout_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> The inverted dropout implementation produces the same expected activation value during training and test — no test-time correction needed. MC-Dropout shows higher variance on out-of-distribution inputs, providing a practical uncertainty signal without any architectural changes.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Dropout — randomness as regularisation and approximate Bayesian inference</h2>

            <h3>The Overfitting Problem at Scale</h3>
            <p>
                AlexNet had 60 million parameters trained on 1.2 million examples — 50 parameters per training example. Without regularisation, the network memorised training examples and failed to generalise. L2 weight decay was insufficient alone. Dropout was the additional regulariser that made AlexNet's generalisation performance possible.
            </p>

            <h3>Forward Pass with Dropout</h3>
            <MathBlock tex="y = \frac{1}{1-p} \cdot (m \odot x), \quad m_i \sim \text{Bernoulli}(1-p), \quad \mathbb{E}[y] = x" />
            <p>
                During training: sample mask m (each element is 1 with probability 1−p, 0 with probability p). Scale surviving activations by 1/(1−p) to preserve expected value. During test time: use full network without masking or scaling. Gradient flows only through active neurons: dL/dx = dL/dy * m / (1−p).
            </p>

            <h3>Ensemble Interpretation</h3>
            <p>
                A network with n neurons has 2^n possible dropout masks. Training with dropout approximates training this ensemble with shared weights. The ensemble prediction is the geometric mean over all 2^n subnetwork outputs — which the test-time full network (with scaled weights) approximates. This is why dropout generalises: the implicit ensemble reduces variance, just as Random Forests reduce variance by averaging correlated trees.
            </p>

            <h3>MC-Dropout for Uncertainty</h3>
            <MathBlock tex="\hat{\sigma}^2_{\text{MC}}(x) = \frac{1}{T}\sum_{t=1}^T f_t(x)^2 - \left(\frac{1}{T}\sum_{t=1}^T f_t(x)\right)^2" />
            <p>
                Run T stochastic forward passes with dropout active at test time. The variance of predictions over the T passes estimates epistemic uncertainty (model uncertainty from lack of knowledge) — distinct from aleatoric uncertainty (inherent data noise). High epistemic uncertainty signals out-of-distribution inputs where the model should not be trusted.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Dropout vs Batch Normalisation:</strong> BN and Dropout both regularise, but differently. BN normalises activations within each mini-batch (reducing internal covariate shift), which already acts as a regulariser. Using both in the same layer can cause a "variance shift" problem at test time. Modern practice: BN in convolutional layers (no dropout), dropout in fully connected layers and Transformer feed-forward sub-layers at 0.1 rate.
            </div>

            <DefBlock label="Dropout Probability p — Practical Guidance">
                p = 0.5 (original AlexNet default): appropriate for large fully-connected layers; halves the effective width<br /><br />
                p = 0.1 to 0.3: standard for Transformers (BERT, GPT-2); conservative to avoid instability in attention layers<br /><br />
                p = 0.0 at large scale: GPT-3 and larger models use no dropout — data scale is sufficient regularisation<br /><br />
                Spatial Dropout for CNNs: drop entire feature maps (channels) rather than individual spatial units; more effective decorrelation for spatially correlated feature maps
            </DefBlock>

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

export const DROPOUT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
