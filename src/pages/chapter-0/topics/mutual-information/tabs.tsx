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
            impact: "Kelly's paper is the intellectual bridge between information theory and decision theory. Shannon's entropy (from our previous topic) measured information in a signal. Kelly showed that the same logarithmic function determines optimal decision-making under uncertainty. This explains why log probability is the natural scoring rule for probabilistic predictions — it's the Kelly-optimal strategy. Modern applications include reinforcement learning (maximising expected cumulative log-reward) and the connection between language model perplexity and Kelly-optimal prediction.",
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
            impact: "CLIP, SimCLR, and BYOL fundamentally maximise mutual information between paired views. This is the modern foundation of self-supervised learning: instead of predicting labels, predict which data points belong together. The hardware story from our previous topic is inseparable from this: CLIP trained on 400 million image-text pairs across thousands of GPU-days. The mathematical concept existed in 1961; the hardware made it tractable in 2021. To express all of these algorithms in runnable code — integrals, gradients, matrix operations, probability distributions, entropy, GPU kernels — requires a single unified programming environment. That is our final topic: Python.",
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

            <p className="ch-story-intro">
                Fast GPUs make it possible to run algorithms across hundreds of millions of examples. But what should we optimise when we have no labels — just raw data? Mutual information: the measure of how much knowing one thing helps you predict another. It turns out to be the unifying objective of self-supervised learning.
            </p>

            <Analogy label="Mutual information = shared information">
                You're trying to guess someone's age. If I tell you their shoe size, it barely helps — shoe size and age have low <strong>mutual information</strong>. If I tell you their years of work experience, that helps a lot — high mutual information. Work experience and age share a lot of information.
                <br /><br />
                <strong>Mutual information</strong> I(X; Y) measures exactly how much knowing X reduces your uncertainty about Y — using entropy H(X) from our previous topic: I(X; Y) = H(X) − H(X|Y).
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
                <strong>Contrastive learning (CLIP, SimCLR)</strong>: maximise I(image₁; image₂) for different augmented views of the same image. The representation that maximises this is useful for downstream tasks — without any labels.
                <br /><br />
                <strong>Variational autoencoders</strong>: maximise I(x; z) — how much the latent code captures information about the image. More mutual information = better reconstruction.
                <br /><br />
                <strong>Feature selection</strong>: choose features with high I(feature; target). These are the features that share the most information with what you're trying to predict.
            </Analogy>

            <Analogy label="What comes next — writing all of this in code">
                We have now covered everything: calculus (for gradients), linear algebra (for matrix operations), probability and statistics (for distributions and inference), entropy and mutual information (for loss functions and objectives), and computing hardware (for running it fast). The last piece is a programming language that makes all of this expressible in a few lines. That is Python — our final topic, and the end of Chapter 0.
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

function MathsContent() {
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

const PY_CODE = `import torch
import torch.nn.functional as F
import numpy as np

# ── 1. Empirical MI — vectorised histogram, no Python loops ──────────────
print("[Empirical MI] vectorised binning")

torch.manual_seed(42)
n    = 10_000
X    = torch.randn(n)
Y    = 0.8 * X + 0.5 * torch.randn(n)   # correlated

bins = 20
x_idx = torch.bucketize(X, torch.linspace(X.min(), X.max(), bins + 1)[1:-1])
y_idx = torch.bucketize(Y, torch.linspace(Y.min(), Y.max(), bins + 1)[1:-1])

# Joint counts — torch.bincount replaces the double Python loop
counts  = torch.bincount(x_idx * bins + y_idx, minlength=bins*bins).float().reshape(bins, bins)
p_xy    = counts / counts.sum()
p_x     = p_xy.sum(dim=1, keepdim=True)
p_y     = p_xy.sum(dim=0, keepdim=True)
mask    = p_xy > 0
mi_corr = (p_xy[mask] * torch.log2(p_xy[mask] / (p_x * p_y).clamp(min=1e-12)[mask])).sum()

# Independent pair — MI should be near 0
Xi    = torch.randn(n);  Yi = torch.randn(n)
xi_idx = torch.bucketize(Xi, torch.linspace(Xi.min(), Xi.max(), bins+1)[1:-1])
yi_idx = torch.bucketize(Yi, torch.linspace(Yi.min(), Yi.max(), bins+1)[1:-1])
c_ind  = torch.bincount(xi_idx*bins + yi_idx, minlength=bins*bins).float().reshape(bins, bins)
p_ind  = c_ind / c_ind.sum()
px_i   = p_ind.sum(1, keepdim=True);  py_i = p_ind.sum(0, keepdim=True)
m_ind  = p_ind > 0
mi_ind = (p_ind[m_ind] * torch.log2(p_ind[m_ind] / (px_i*py_i).clamp(1e-12)[m_ind])).sum()

print(f"  I(X;Y) correlated = {mi_corr.item():.4f} bits")
print(f"  I(X;Y) independent = {mi_ind.item():.4f} bits  (near 0 ✓)")

# ── 2. InfoNCE loss — PyTorch native implementation ──────────────────────
print("\\n[InfoNCE] contrastive loss")

torch.manual_seed(0)
B, d, tau = 256, 128, 0.07   # batch size, embed dim, temperature

z1 = F.normalize(torch.randn(B, d), dim=1)
z2 = F.normalize(z1 + 0.2 * torch.randn(B, d), dim=1)   # augmented positives

sim    = (z1 @ z2.T) / tau            # (B, B) similarity matrix
labels = torch.arange(B)             # positive pair is on the diagonal
loss   = F.cross_entropy(sim, labels)  # exactly the InfoNCE formula

recall = (sim.argmax(dim=1) == labels).float().mean()
print(f"  B={B}, d={d}, τ={tau}  →  InfoNCE = {loss.item():.4f}")
print(f"  top-1 recall: {recall*100:.1f}%")

# Lower τ → sharper distribution → harder negatives
for temp in [0.5, 0.1, 0.05, 0.01]:
    l = F.cross_entropy((z1 @ z2.T) / temp, labels)
    print(f"  τ={temp}  loss={l.item():.3f}  recall={(( (z1@z2.T)/temp).argmax(1)==labels).float().mean()*100:.0f}%")

# ── 3. Data Processing Inequality ─────────────────────────────────────────
print("\\n[DPI] I(X;Z) ≤ I(X;Y) for Markov chain X → Y → Z")

def fast_mi(a, b, bins=15):
    ae = torch.linspace(a.min(), a.max(), bins+1)[1:-1]
    be = torch.linspace(b.min(), b.max(), bins+1)[1:-1]
    c  = torch.bincount(torch.bucketize(a,ae)*bins + torch.bucketize(b,be),
                        minlength=bins*bins).float().reshape(bins, bins)
    p  = c / c.sum()
    px = p.sum(1, keepdim=True);  py = p.sum(0, keepdim=True)
    m  = p > 0
    return (p[m] * torch.log2(p[m] / (px*py).clamp(1e-12)[m])).sum().item()

torch.manual_seed(1)
Xd = torch.randn(5000)
Yd = 0.8*Xd + 0.6*torch.randn(5000)
Zd = 0.8*Yd + 0.6*torch.randn(5000)
print(f"  I(X;Y) = {fast_mi(Xd,Yd):.4f} bits")
print(f"  I(X;Z) = {fast_mi(Xd,Zd):.4f} bits  (≤ I(X;Y) ✓ — each layer loses info)")`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch's <code>torch.bincount</code> vectorises mutual information estimation
                — no Python loops over samples. InfoNCE reduces to a single cross-entropy call,
                exactly as used in CLIP, SimCLR, and MoCo.
            </p>
            <CodeBlock code={PY_CODE} filename="mutual_information.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> InfoNCE is <code>F.cross_entropy(sim / τ, labels)</code>
                where <code>sim</code> is the B×B cosine similarity matrix. Temperature τ controls
                hardness: lower τ concentrates probability on the nearest negatives, providing
                stronger training signal but risking collapse.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MUTUAL_INFORMATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
