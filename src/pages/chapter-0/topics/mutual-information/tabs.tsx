import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { MutualInfoDiagram } from "../information-theory/diagrams"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TlItem }) {
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
            year: "1955",
            title: "Kelly — Gambling, Side Information, and the Growth Rate Function",
            challenge:
                "A gambler with a favourable bet has a problem: how much of their bankroll should they wager each round to maximise long-term growth? Bet too little and gains are slow; bet too much and ruin is likely. Shannon's information theory had not yet been applied to decision-making under uncertainty.",
            what: "John Kelly, working at Bell Labs, showed that the optimal growth rate of wealth under repeated favourable bets is exactly Shannon's channel capacity. His 'Kelly criterion' states: bet a fraction f of your bankroll equal to your edge/odds. The logarithm in Shannon's entropy turns out to be the right function because log-returns compound multiplicatively — and the long-run growth rate is maximised by the same information-theoretic principle that governs communication capacity.",
            impact: "Kelly's paper is the intellectual bridge between information theory and decision theory. It explains why log probability is the 'right' scoring rule for probabilistic predictions — it rewards honesty. Modern applications include optimal portfolio construction, reinforcement learning (which maximise expected cumulative log-reward), and the connection between perplexity in language models and the Kelly-optimal prediction strategy.",
        },
        {
            year: "1961",
            title: "Blahut — Efficient Computation of Capacity",
            challenge:
                "Shannon proved that channel capacity exists and is achievable, but gave no practical algorithm for computing it. For real channels with complex noise structures, finding the capacity C required solving a high-dimensional optimisation problem that seemed intractable.",
            what: "Richard Blahut, also at IBM, derived an iterative algorithm that computes channel capacity directly from the channel transition probabilities — no searching required. The Blahut-Arimoto algorithm alternates between estimating the optimal input distribution and computing the mutual information, converging to the true capacity.",
            impact: "This was the first major algorithmic contribution to information theory. It made capacity a computable quantity for any discrete channel, enabling practical engineering of communication systems. In modern ML, the same algorithmic pattern appears in clustering (k-means), in EM algorithms for mixture models, and in contrastive learning objectives.",
        },
        {
            year: "1991",
            title: "Bell — The Information Bottleneck Method",
            challenge:
                "How much information should a representation retain about its input, and how much should be discarded? Too much retention and the representation is inefficient; too little and it loses what matters for the task. There was no principled theory for this tradeoff between compression and relevance.",
            what: "Naftali Tishby, Fernando Pereira, and William Bialek introduced the Information Bottleneck (IB) method: find the best tradeoff between compressing the input X into a representation T, while preserving the information T retains about the target Y. This formalises the idea that good representations discard everything irrelevant to the task — only the task-relevant information survives.",
            impact: "The IB method provides a theoretical framework for understanding deep learning. The layers of a neural network can be viewed as progressively discarding irrelevant information about X while retaining information about Y. Several papers have shown that the final layer of a trained network represents a Pareto-optimal IB tradeoff. It also underlies concept bottleneck models and representation learning theory.",
        },
        {
            year: "2020",
            title: "Contrastive Learning — Maximising Mutual Information",
            challenge:
                "How do you learn good representations from unlabeled data? You have millions of images but no labels. What objective could possibly tell you which representations are useful?",
            what: "Contrastive learning methods (SimCLR, CLIP, MoCo) learn representations by maximising the mutual information between augmented views of the same image while minimising it between views of different images. The key insight: I(view₁; view₂) is a valid objective because it doesn't require labels — just the assumption that different augmentations of the same image share more information than augmentations of different images.",
            impact: "CLIP, SimCLR, and BYOL all fundamentally maximise mutual information between paired views. This is the modern foundation of self-supervised learning: instead of predicting labels, predict which data points belong together. The quality of the representation is directly bounded by how much task-relevant mutual information the model captures.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>How much does knowing one thing help you guess another?</h2>

            <Analogy label="Mutual information = shared information">
                Imagine you're trying to guess someone's age. You're not very sure — maybe ±20 years. But if I tell you their shoe size, that doesn't help much. Shoe size and age have low <strong>mutual information</strong>. But if I tell you how many years of work experience they have, that helps a lot. Work experience and age have high mutual information — they share information.
                <br />
                <br />
                <strong>Mutual information</strong> I(X; Y) measures exactly how much knowing X reduces your uncertainty about Y.
            </Analogy>

            <Analogy label="The Venn diagram picture">
                Think of two circles overlapping — one circle represents everything you know about X, the other represents everything you know about Y. Their <strong>overlap</strong> is the mutual information. If the circles barely overlap, knowing X doesn't help much with Y. If they mostly overlap, knowing X tells you almost everything about Y.
            </Analogy>

            <DiagramBlock title="Mutual information — what X and Y share">
                <MutualInfoDiagram />
            </DiagramBlock>

            <Analogy label="Independent variables = zero mutual information">
                If knowing one variable tells you absolutely nothing about the other, they are <strong>independent</strong>. Shoe size and favourite colour have near-zero mutual information — knowing one tells you nothing about the other. P(X, Y) = P(X) · P(Y). When X and Y are independent, I(X; Y) = 0.
            </Analogy>

            <Analogy label="Where AI uses mutual information">
                <strong>Contrastive learning (CLIP, SimCLR)</strong>: maximise I(image₁; image₂) for different views of the same image, minimise it for views of different images. The representation that maximises this is useful for downstream tasks.
                <br />
                <br />
                <strong>Variational autoencoders</strong>: maximise I(x; z) — how much the latent code captures information about the image. More mutual information means a better representation.
                <br />
                <br />
                <strong>Feature selection</strong>: choose features with high I(feature; target) — features that share information with what you're trying to predict.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Quantifying how much two things tell each other</h2>

            <h3>Definition of Mutual Information</h3>
            <p>
                Mutual information I(X; Y) measures how much knowing one variable reduces uncertainty about another.
                It can be expressed in three equivalent forms:
            </p>
            <MathBlock tex="I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X, Y)" />
            <p>
                <strong>Interpretation:</strong>
            </p>
            <ul>
                <li>H(X) − H(X|Y): reduction in uncertainty about X after knowing Y</li>
                <li>H(X) + H(Y) − H(X, Y): total information that X and Y share</li>
            </ul>

            <h3>From the chain rule for entropy</h3>
            <p>
                Remember the entropy chain rule: H(X, Y) = H(X) + H(Y|X). Rearranging:
            </p>
            <MathBlock tex="H(X) - H(X|Y) = H(X) + H(Y) - H(X, Y)" />
            <p>
                This confirms all three forms are equivalent.
            </p>

            <DiagramBlock title="Mutual information — the overlap between X and Y">
                <MutualInfoDiagram />
            </DiagramBlock>

            <h3>Properties of Mutual Information</h3>
            <ul>
                <li>
                    <strong>Symmetry</strong>: I(X; Y) = I(Y; X) — knowing X helps you know Y as much as knowing Y helps you know X
                </li>
                <li>
                    <strong>Non-negativity</strong>: I(X; Y) ≥ 0 always — entropy is always non-negative, so H(X) ≥ H(X|Y)
                </li>
                <li>
                    <strong>Zero iff independent</strong>: I(X; Y) = 0 iff X and Y are independent (knowing one tells you nothing about the other)
                </li>
                <li>
                    <strong>Maximum = min(H(X), H(Y))</strong>: mutual information can't exceed the entropy of either variable
                </li>
            </ul>

            <h3>The Data Processing Inequality</h3>
            <p>
                If X → Y → Z is a Markov chain (Z depends on X only through Y), then:
            </p>
            <MathBlock tex="I(X; Z) \leq I(X; Y)" />
            <p>
                Information cannot increase by processing alone. In neural networks, this means: the
                information that the input X contains about the output Y cannot increase as we pass
                through layers — it can only stay the same or decrease. This is why deeper networks
                must be careful not to lose task-relevant information.
            </p>

            <h3>Why It Matters in Machine Learning</h3>
            <ul>
                <li>
                    <strong>Contrastive learning</strong>: maximise I(view₁; view₂) for same-image pairs
                </li>
                <li>
                    <strong>InfoNCE loss</strong>: a lower bound on I(X; Y) used to train contrastive models
                </li>
                <li>
                    <strong>Representation learning</strong>: maximise I(representation; task-relevant information)
                </li>
                <li>
                    <strong>Feature selection</strong>: choose features with highest I(feature; target)
                </li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mutual information and its applications</h2>

            <DefBlock label="Definition — Mutual Information">
                For discrete random variables X, Y with joint distribution p(x, y) and marginals p(x), p(y):
                <MathBlock tex="I(X; Y) = \sum_x \sum_y p(x, y)\,\log\frac{p(x, y)}{p(x)\,p(y)}" />
                This is the KL divergence between the joint distribution and the product of marginals:
                <MathBlock tex="I(X; Y) = D_{\text{KL}}\!\big(p(X, Y) \| p(X)\,p(Y)\big)" />
                When X and Y are independent, p(X, Y) = p(X)p(Y) and the KL divergence is zero.
            </DefBlock>

            <h3>Equivalence of Formulations</h3>
            <p>
                Starting from the KL definition:
            </p>
            <MathBlock tex="I(X; Y) = D_{\text{KL}}(p(X,Y) \| p(X)p(Y)) = \sum_{x,y} p(x,y)\log\frac{p(x,y)}{p(x)p(y)}" />
            <p>
                Using p(x|y) = p(x,y)/p(y):
            </p>
            <MathBlock tex="= \sum_{x,y} p(x,y)\log\frac{p(x|y)}{p(x)} = \sum_x p(x)\sum_y p(y|x)\log\frac{p(x|y)}{p(x)}" />
            <MathBlock tex="= - \sum_x p(x)\log p(x) + \sum_{x,y} p(x,y)\log p(x|y) = H(X) - H(X|Y)" />
            <p>
                By symmetry, I(X; Y) = H(X) − H(X|Y) = H(Y) − H(Y|X) = H(X) + H(Y) − H(X, Y).
            </p>

            <h3>The Data Processing Inequality</h3>
            <p>
                For any Markov chain X → Y → Z (Z is conditionally independent of X given Y):
            </p>
            <MathBlock tex="I(X; Z) \leq I(X; Y)" />
            <p>
                <strong>Proof:</strong> Using the chain rule for mutual information:
            </p>
            <MathBlock tex="I(X; Y, Z) = I(X; Y) + I(X; Z | Y)" />
            <p>
                But Z is independent of X given Y, so I(X; Z | Y) = 0. Also, (Y, Z) forms a Markov chain
                with Z, so I(X; Y, Z) = I(X; Z). Therefore I(X; Z) = I(X; Y).
            </p>
            <p>
                In deep learning: as data passes through layers, I(input; output) can only decrease or stay
                the same. This is why information bottleneck theory argues that good training pushes networks
                to the Pareto frontier of: minimise I(X; hidden) while maximising I(hidden; Y).
            </p>

            <h3>InfoNCE — Contrastive Learning Loss</h3>
            <p>
                Noise Contrastive Estimation (InfoNCE) provides a tractable lower bound on mutual information.
                Given a batch of N pairs (xᵢ, yᵢ) where yᵢ is a positive pair and the others are negatives:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{InfoNCE}} = -\mathbb{E}\left[\log\frac{\exp(f(x_i, y_i)/\tau)}{\sum_{j=1}^N \exp(f(x_i, y_j)/\tau)}\right]" />
            <p>
                where τ is a temperature hyperparameter and f is a critic network. It's shown that:
            </p>
            <MathBlock tex="I(x_i; y_i) \geq \log N - \mathcal{L}_{\text{InfoNCE}}" />
            <p>
                So minimising InfoNCE is equivalent to maximising a lower bound on the mutual information
                between positive pairs. This is the loss behind SimCLR, CLIP, MoCo, and most modern
                self-supervised learning methods.
            </p>

            <h3>Multivariate Mutual Information</h3>
            <p>
                For more than two variables, mutual information generalises to the <strong>total correlation</strong>
                (also called multivariate mutual information or协同信息):
            </p>
            <MathBlock tex="I(X_1; X_2; ...; X_n) = D_{\text{KL}}\!\left(p(X_1,...,X_n) \| \prod_i p(X_i)\right)" />
            <p>
                This measures the total shared information across all n variables. For n = 2 it reduces to
                the standard I(X; Y). In representation learning, we want our representations to capture
                all the task-relevant information while discarding unnecessary information — which is exactly
                a multivariate mutual information objective.
            </p>

            <h3>Applications in ML</h3>
            <ul>
                <li>
                    <strong>CLIP / contrastive learning</strong>: I(image; text) is what we want to maximise
                    when aligning images and captions. InfoNCE is the tractable proxy.
                </li>
                <li>
                    <strong>VAEs</strong>: the ELBO can be decomposed as reconstruction loss minus
                    I(x; z) — more latent information about the input means better reconstruction.
                </li>
                <li>
                    <strong>Information bottleneck in deep networks</strong>: train to minimise I(X; T)
                    (compression) while maximising I(T; Y) (relevance), where T is a hidden layer's
                    representation.
                </li>
                <li>
                    <strong>Feature selection</strong>: mutual information filter selects features with
                    high I(Xᵢ; Y), equivalent to the most informative features for prediction.
                </li>
                <li>
                    <strong>RLHF / alignment</strong>: the KL penalty between policy distributions in
                    RLHF can be viewed as bounding the mutual information between the learned policy
                    and the original policy.
                </li>
            </ul>

            <div className="ch-callout">
                <strong>Key insight:</strong> The mutual information I(X; Y) is the single unifying
                quantity for understanding representation learning, contrastive learning, and
                information compression. Every objective in self-supervised learning is a tractable
                lower bound on some mutual information that we want to maximise.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Mutual Information ──────────────────────────────────────────
# I(X; Y) = H(X) - H(X|Y)  =  H(X) + H(Y) - H(X,Y)
# Simulated: two correlated variables

np.random.seed(42)
n = 10000
# X is random; Y is X plus noise → correlated
X = np.random.randn(n)
Y = 0.8 * X + 0.5 * np.random.randn(n)

# Discretise to compute empirical MI
bins = 20
x_b = np.digitize(X, np.linspace(X.min(), X.max(), bins + 1))
y_b = np.digitize(Y, np.linspace(Y.min(), Y.max(), bins + 1))

def empirical_mi(x_binned, y_binned, n_bins):
    counts_xy = np.zeros((n_bins, n_bins))
    for a, b in zip(x_binned, y_binned):
        counts_xy[a - 1, b - 1] += 1
    p_xy = counts_xy / counts_xy.sum()
    p_x  = p_xy.sum(axis=1)
    p_y  = p_xy.sum(axis=0)
    mi = 0.0
    for i in range(n_bins):
        for j in range(n_bins):
            if p_xy[i, j] > 0 and p_x[i] > 0 and p_y[j] > 0:
                mi += p_xy[i, j] * np.log2(p_xy[i, j] / (p_x[i] * p_y[j]))
    return mi

mi = empirical_mi(x_b, y_b, bins)
print(f"Empirical mutual information I(X;Y): {mi:.4f} bits")
print("(High MI means X and Y carry information about each other)")

# Independent version: product of marginals (should give MI ≈ 0)
def joint_entropy(x_binned, y_binned, n_bins):
    counts_xy = np.zeros((n_bins, n_bins))
    for a, b in zip(x_binned, y_binned):
        counts_xy[a - 1, b - 1] += 1
    p_xy = counts_xy / counts_xy.sum()
    return -np.sum(p_xy[p_xy > 0] * np.log2(p_xy[p_xy > 0]))

def marginal_entropy(x_binned, n_bins):
    counts = np.zeros(n_bins)
    for a in x_binned:
        counts[a - 1] += 1
    p = counts / counts.sum()
    return -np.sum(p[p > 0] * np.log2(p[p > 0]))

H_x = marginal_entropy(x_b, bins)
H_y = marginal_entropy(y_b, bins)
H_xy = joint_entropy(x_b, y_b, bins)
mi_from_components = H_x + H_y - H_xy
print(f"MI via entropy: {mi_from_components:.4f} bits")

# Verify independence: if we generate truly independent variables
X_ind = np.random.randn(n)
Y_ind = np.random.randn(n)
x_ind_b = np.digitize(X_ind, np.linspace(X_ind.min(), X_ind.max(), bins + 1))
y_ind_b = np.digitize(Y_ind, np.linspace(Y_ind.min(), Y_ind.max(), bins + 1))
mi_indep = empirical_mi(x_ind_b, y_ind_b, bins)
print(f"MI for independent vars: {mi_indep:.6f} bits ≈ 0 ✓")

# ── InfoNCE (contrastive loss) ───────────────────────────────────
def infonce_loss(view_similarities, temperature=0.1):
    """
    InfoNCE loss for contrastive learning.
    view_similarities: array of shape (batch_size,) with similarity to positive view
    Returns scalar loss.
    """
    # similarities[i] = similarity between view_i and its positive pair
    # All other pairs are negatives
    # Loss = -E[log exp(sim_pos) / sum_exp(all_pairs)]
    exp_sims = np.exp(view_similarities / temperature)
    # For each i, denominator includes exp(sim_i_positive) + exp(sim_i_negative_j) for all j != i
    # Simplified batch version (one positive per sample)
    batch_size = len(view_similarities)
    # Denominator: for each i, sum over all j of exp(sim_ij / tau)
    # Assuming symmetric similarities and one positive per diagonal
    denom = np.sum(exp_sims, axis=0)  # sum over positive pair contributions
    # Numerator: only the diagonal (positive pair)
    numerators = np.diag(exp_sims)
    loss = -np.mean(np.log(numerators / denom + 1e-10))
    return loss

# Simulate: positive pairs have high similarity, negatives have low
np.random.seed(0)
batch_size = 256
# Positive pairs: cosine similarity ~0.8 + noise
pos_sim = 0.8 + 0.05 * np.random.randn(batch_size)
pos_sim = np.clip(pos_sim, 0, 1)
# Negative pairs: near-zero similarity
neg_sim = -0.1 + 0.1 * np.random.randn(batch_size)

# Stack as [positive, negative] pairs for each sample
all_sims = np.stack([pos_sim, neg_sim], axis=1)  # (batch, 2)

# InfoNCE: each sample's loss uses its own positive similarity
# Simpler version: each row has one positive (sim[:,0]) and one negative (sim[:,1])
exp_sims = np.exp(all_sims / 0.1)
numerators = exp_sims[:, 0]  # positive similarity
denominators = exp_sims.sum(axis=1)  # positive + negative
loss = -np.mean(np.log(numerators / denominators + 1e-10))

print(f"\\nInfoNCE loss: {loss:.4f}")
print(f"(Lower loss = higher mutual information between positive pairs)")

# ── Data Processing Inequality demo ──────────────────────────────
# X → Y → Z chain: Z = Y + noise, Y = X + noise
# MI(X;Z) < MI(X;Y) because Z loses some information about X
np.random.seed(42)
X = np.random.randn(5000)
Y = 0.8 * X + 0.6 * np.random.randn(5000)  # X → Y
Z = 0.8 * Y + 0.6 * np.random.randn(5000)  # Y → Z

def discretised_mi(a, b, n_bins=15):
    a_b = np.digitize(a, np.linspace(a.min(), a.max(), n_bins + 1))
    b_b = np.digitize(b, np.linspace(b.min(), b.max(), n_bins + 1))
    return empirical_mi(a_b, b_b, n_bins)

mi_xy = discretised_mi(X, Y)
mi_xz = discretised_mi(X, Z)
print(f"\\nData Processing Inequality:")
print(f"I(X; Y) = {mi_xy:.4f} bits")
print(f"I(X; Z) = {mi_xz:.4f} bits")
print(f"I(X; Z) ≤ I(X; Y): {'✓' if mi_xz <= mi_xy + 0.05 else '✗'}")`

function PythonTab() {
    return (
        <>
            <p>
                NumPy for empirical mutual information estimation and InfoNCE. The discretisation
                approach is simple but shows the core idea. In practice, use parameterised estimators
                (e.g., neural network critic) for high-dimensional data.
            </p>
            <CodeBlock code={PY_CODE} filename="mutual_information.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> InfoNCE is the workhorse of modern contrastive learning
                (CLIP, SimCLR, MoCo). It maximises a lower bound on I(view₁; view₂) — the mutual
                information between different views of the same data point. The temperature τ
                controls how peaked the distribution is: lower τ focuses on the hardest negatives.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MUTUAL_INFORMATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
