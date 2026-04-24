import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import { EntropyDiagram, KLDiagram, MutualInfoDiagram } from "./diagrams"
import type { TabId } from "../../types"

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
            year: "1928",
            title: "Hartley — Measuring Information Logarithmically",
            challenge:
                "Engineers at Bell Labs designing early telegraph and radio systems needed a way to quantify how much information a signal could carry. Was there a fundamental limit to how many distinct messages you could send over a noisy channel?",
            what: "Ralph Hartley proposed that if you have N equally likely possible messages, the natural measure of information content is log(N). Why logarithm? Because adding a new binary digit (bit) doubles the number of distinguishable messages — a logarithmic relationship. A system with 8 possible symbols carries log₂(8) = 3 bits of information per symbol.",
            impact: "Hartley's insight was the first mathematical definition of information. Though limited to equally-likely cases, it established the logarithmic foundation that Shannon later generalised. Every digital communication system — from Morse code to 5G to WiFi — uses Hartley's principle as its theoretical bedrock.",
        },
        {
            year: "1948",
            title: "Shannon — A Mathematical Theory of Communication",
            challenge:
                "Communication engineers had struggled for decades with a paradox: why does adding redundancy (repeating a message) help fight noise, but reduce the effective data rate? Is there a fundamental capacity limit for any channel, and if so, what determines it?",
            what: "Claude Shannon's landmark paper 'A Mathematical Theory of Communication' solved both problems simultaneously. He introduced entropy H(X) = −Σ p(x) log₂ p(x) as the fundamental measure of information, proved that any discrete channel has a finite capacity C (bits/second), and showed that you can communicate arbitrarily close to capacity with codes that add just enough structured redundancy — without sacrificing efficiency.",
            impact: "Shannon single-handedly founded the field of information theory. His source-coding theorem says entropy is the lower bound for lossless compression. His channel-coding theorem says capacity is the upper bound for reliable communication. Together they define the two fundamental limits of all digital systems. Every modern error-correcting code (used in CDs, satellite TV, LTE, and deep-space communication) is a practical implementation of Shannon's theorems.",
        },
        {
            year: "1951",
            title: "Kullback & Leibler — Relative Entropy",
            challenge:
                "Shannon's entropy measured uncertainty in a single distribution. But in statistics and communication, you constantly need to compare two distributions: the true distribution P over outcomes versus an approximation Q that you use instead. How do you quantify the 'loss' from using Q instead of P?",
            what: "Solomon Kullback and Richard Leibler introduced the relative entropy — now called KL divergence: D(P‖Q) = Σ P(x) log(P(x)/Q(x)). This measures the extra bits needed to encode samples from P using a code optimised for Q. Crucially, it is always ≥ 0, and = 0 only when P = Q exactly.",
            impact: "KL divergence is everywhere in modern ML. It appears as the cross-entropy loss when Q is your model and P is the true data distribution. Variational inference uses KL divergence to approximate intractable posteriors. The ELBO (evidence lower bound) in VAEs is a KL regulariser. Generative models like VAEs, diffusion models, and language models all minimise KL-style objectives.",
        },
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
            <h2>Surprise and information are the same thing</h2>

            <Analogy label="Information = Surprise">
                Think about a friend telling you something. If they say <em>"The sun rose this morning"</em> — you already knew that. No new information. Zero surprise. But if they say <em>"A snowstorm hit Hawaii!"</em> — that's shocking. A lot of new information. The more surprised you are, the more information you just received.
            </Analogy>

            <Analogy label="The fair coin = maximum suspense">
                Flip a completely fair coin. Before you look, you have no idea what it will be. Heads or tails — both equally likely. This is maximum <strong>entropy</strong> — the most uncertain, the most suspenseful. The outcome teaches you exactly 1 bit of information.
            </Analogy>

            <Analogy label="The biased coin = less suspense">
                Now flip a coin that comes up heads 99% of the time. Before you flip, you're almost certain it will be heads. Not very suspenseful. Almost no information when it lands heads. Very little surprise — and therefore very little information — when heads lands.
            </Analogy>

            <DiagramBlock title="Entropy — fair coin (max surprise) vs biased coin (low surprise)">
                <EntropyDiagram />
            </DiagramBlock>

            <Analogy label="Entropy = how much suspense there is on average">
                <strong>Entropy</strong> is the average amount of surprise across all possible outcomes. Think of it as the average "information content" of a random event. A fair coin has 1 bit of entropy — you learn 1 bit on average per flip. A completely predictable coin has 0 bits — you already know what will happen.
            </Analogy>

            <Analogy label="Why does entropy matter for AI?">
                A language model that always says the same word has zero entropy — it's useless. A good language model spreads its probability across many possible next words, especially for surprising contexts. The cross-entropy loss measures exactly how well your model matches the true entropy of human language. When the model becomes as "surprised" by the real next word as the real world would be — you've minimised cross-entropy. You've learned to model language as well as a human does.
            </Analogy>

            <Analogy label="KL divergence = how much your approximation costs you">
                Imagine the true distribution of outcomes is P — the actual world. You approximate it with Q — your model or hypothesis. KL(P‖Q) measures the <em>extra cost</em> in surprise bits when you use Q to encode P. It's always ≥ 0, and it's only zero if your approximation is perfect. In ML, your model is Q and the real data is P — you want to minimise KL(P‖Q) as a loss.
            </Analogy>

            <DiagramBlock title="KL divergence — the extra cost of using Q instead of P">
                <KLDiagram />
            </DiagramBlock>

            <Analogy label="Mutual information = how much knowing one thing helps you guess another">
                If knowing Y tells you a lot about X, they have high <strong>mutual information</strong>. Temperature outside and coat-wearing behaviour have high mutual information — knowing the temperature helps you predict whether someone wears a coat. Shoe size and favourite colour have near-zero mutual information — knowing one tells you nothing about the other.
            </Analogy>

            <DiagramBlock title="Mutual information — what X and Y share">
                <MutualInfoDiagram />
            </DiagramBlock>

            <Analogy label="Where AI uses all of this">
                Transformers maximise the mutual information between input tokens and the representations they build. VAEs minimise KL divergence between a learned latent distribution and a prior. Perplexity is exp(entropy) — measuring how "surprised" a language model is by real text. Contrastive learning (CLIP, SimCLR) maximises mutual information between paired views of the same data.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From coin flips to logarithms</h2>

            <p>
                You already know that a probability is a number between 0 and 1. <strong>Information theory</strong>{" "}
                asks: if an event with probability p happens, how much information does that convey? The answer
                turns out to be <InlineMath tex="-\log_2 p" /> bits.
            </p>

            <h3>Why a logarithm?</h3>
            <p>
                If you flip two fair coins independently, there are 4 equally likely outcomes. You've learned{" "}
                <strong>2 bits</strong> of information — and log₂(4) = 2. With n independent fair coin flips,
                there are 2ⁿ equally likely outcomes, so each outcome carries n bits of information — and
                log₂(2ⁿ) = n. The logarithm is the natural answer because it converts the multiplicative
                number of equally-likely outcomes into an additive information measure.
            </p>

            <h3>Shannon Entropy</h3>
            <p>
                Entropy is the <em>average</em> information across all possible outcomes, weighted by their
                probabilities:
            </p>
            <MathBlock tex="H(X) = -\sum_{x} p(x)\,\log_2 p(x)" />
            <p>
                H is always ≥ 0. It reaches its maximum when all outcomes are equally likely (maximum
                uncertainty). If one outcome is certain (p = 1), H = 0 because there's no information gained.
            </p>
            <p>
                <strong>Example — Fair coin:</strong> p(H) = p(T) = 0.5
            </p>
            <MathBlock tex="H = -[0.5 \times (-1) + 0.5 \times (-1)] = 1\;\text{bit}" />
            <p>
                <strong>Example — Biased coin (p(H) = 0.9, p(T) = 0.1):</strong>
            </p>
            <MathBlock tex="H = -[0.9 \log_2 0.9 + 0.1 \log_2 0.1] \approx 0.47\;\text{bits}" />
            <p>
                The biased coin is less surprising on average — less entropy.
            </p>

            <DiagramBlock title="Entropy comparison — fair vs biased">
                <EntropyDiagram />
            </DiagramBlock>

            <h3>Cross-Entropy and KL Divergence</h3>
            <p>
                The cross-entropy H(P, Q) measures the average bits needed to encode events from the true
                distribution P using a code optimised for approximation Q:
            </p>
            <MathBlock tex="H(P, Q) = -\sum_x p(x)\,\log_2 q(x)" />
            <p>
                The <strong>KL divergence</strong> measures the extra cost — the inefficiency — of using Q
                instead of the true P:
            </p>
            <MathBlock tex="D_{\text{KL}}(P \| Q) = \sum_x p(x)\,\log_2 \frac{p(x)}{q(x)} = H(P, Q) - H(P)" />
            <p>
                Since log(1) = 0, when P = Q the KL divergence is zero. By a fundamental result (Gibbs'
                inequality), KL divergence is always ≥ 0 and only zero when P = Q. This is why it makes a
                natural loss function — you can minimise it towards zero but never go below.
            </p>

            <DiagramBlock title="KL divergence — the gap between P and Q">
                <KLDiagram />
            </DiagramBlock>

            <h3>Mutual Information</h3>
            <p>
                Mutual information I(X; Y) measures how much knowing one variable reduces uncertainty about
                another:
            </p>
            <MathBlock tex="I(X; Y) = H(X) + H(Y) - H(X, Y)" />
            <p>
                Equivalently, I(X; Y) = H(X) − H(X | Y) — the reduction in X's entropy when Y is known.
                When X and Y are independent, H(X | Y) = H(X), so I(X; Y) = 0. When Y completely determines
                X, H(X | Y) = 0, so I(X; Y) = H(X).
            </p>

            <DiagramBlock title="Mutual information — the overlap between X and Y">
                <MutualInfoDiagram />
            </DiagramBlock>

            <h3>Why This Matters in Machine Learning</h3>
            <ul>
                <li>
                    <strong>Cross-entropy loss</strong> is the standard loss for classification — it's exactly
                    H(P, Q) where P is the one-hot true label and Q is your model's predicted probabilities.
                </li>
                <li>
                    <strong>Perplexity</strong> of a language model = 2<sup>H</sup>, where H is the cross-entropy
                    of the model's next-token distribution vs real text. Lower perplexity = better model.
                </li>
                <li>
                    <strong>KL divergence</strong> appears in VAEs (as a regulariser between the posterior and
                    a prior), in reinforcement learning (as KL constraint on policy updates), and in
                    fine-tuning (to keep the new model close to the original).
                </li>
                <li>
                    <strong>Mutual information</strong> is maximised in contrastive learning (CLIP, SimCLR)
                    and in variational inference (maximising I(data; latent)).
                </li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Foundations</h2>

            <DefBlock label="Definition — Self-Information">
                For a discrete random variable X with probability mass function p(x) = Pr(X = x), the{" "}
                <strong>self-information</strong> of the event X = x is:
                <MathBlock tex="I(x) = -\log_2 p(x) \quad \text{[bits]}" />
                Self-information is non-negative, equals 0 when p(x) = 1 (certain), and increases as p(x)
                → 0 (rare events are highly informative). It is additive for independent events: I(x,y) =
                I(x) + I(y) because p(x,y) = p(x)p(y) implies −log p(x,y) = −log p(x) − log p(y).
            </DefBlock>

            <h3>Shannon Entropy</h3>
            <p>
                The <strong>entropy</strong> of a discrete random variable X is the expected self-information —
                the average number of bits needed to encode outcomes drawn from p:
            </p>
            <MathBlock tex="H(X) = \mathbb{E}_{x \sim p}[I(x)] = -\sum_{x} p(x)\,\log_2 p(x)" />
            <p>
                H(X) = 0 iff X is deterministic (one outcome has probability 1). H(X) is maximised when X
                is uniformly distributed. For a d-ary uniform source, H(X) = log₂ d.
            </p>
            <p>
                In ML we almost always use natural log (ln) in theory, yielding units of{" "}
                <em>nats</em> rather than bits. The base change is just a constant factor (1 nat = 1/ln 2
                bits).
            </p>

            <h3>Joint and Conditional Entropy</h3>
            <p>
                <strong>Joint entropy</strong> extends the definition to pairs of variables:
            </p>
            <MathBlock tex="H(X, Y) = -\sum_x \sum_y p(x, y)\,\log_2 p(x, y)" />
            <p>
                <strong>Conditional entropy</strong> H(Y | X) is the expected entropy of Y after observing X:
            </p>
            <MathBlock tex="H(Y|X) = \sum_x p(x)\,H(Y|X=x) = -\sum_x \sum_y p(x, y)\,\log_2 p(y|x)" />
            <p>
                The <strong>chain rule</strong> relates joint and conditional:
            </p>
            <MathBlock tex="H(X, Y) = H(X) + H(Y|X)" />
            <p>
                This is a fundamental decomposition — the total uncertainty in (X, Y) equals the uncertainty
                in X plus the remaining uncertainty in Y after X is known.
            </p>

            <h3>KL Divergence</h3>
            <p>
                The <strong>KL divergence</strong> from P to Q measures the relative entropy — the
                inefficiency of using Q to encode samples from P:
            </p>
            <MathBlock tex="D_{\text{KL}}(P \| Q) = \sum_x p(x)\,\log\frac{p(x)}{q(x)}" />
            <p>
                Two key properties:
            </p>
            <ul>
                <li>
                    <strong>Non-negativity</strong> (Gibbs' inequality):{" "}
                    <InlineMath tex="D_{\text{KL}}(P \| Q) \geq 0" />, with equality iff P = Q
                </li>
                <li>
                    <strong>Asymmetry</strong>:{" "}
                    <InlineMath tex="D_{\text{KL}}(P \| Q) \neq D_{\text{KL}}(Q \| P)" /> in general. This
                    matters — fitting Q to P is not the same as fitting P to Q.
                </li>
            </ul>
            <p>
                The <strong>cross-entropy</strong> H(P, Q) is:
            </p>
            <MathBlock tex="H(P, Q) = -\sum_x p(x)\,\log_2 q(x) = H(P) + D_{\text{KL}}(P \| Q)" />
            <p>
                Since H(P) is constant with respect to Q, minimising H(P, Q) is equivalent to minimising
                D<sub>KL</sub>(P ‖ Q). This is why cross-entropy loss is used for classification — it is the
                KL divergence between the true label distribution and the model's predicted distribution.
            </p>

            <DiagramBlock title="KL divergence — P (true) vs Q (model)">
                <KLDiagram />
            </DiagramBlock>

            <h3>Mutual Information</h3>
            <p>
                <strong>Mutual information</strong> I(X; Y) is the shared information between two variables —
                equivalently, the reduction in uncertainty of one given knowledge of the other:
            </p>
            <MathBlock tex="I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X, Y)" />
            <p>
                Symmetry: I(X; Y) = I(Y; X). Also, I(X; X) = H(X) — a variable is maximally informative
                about itself.
            </p>
            <p>
                The <strong>data processing inequality</strong> states that for any Markov chain X → Y → Z
                (i.e., Z depends on X only through Y):
            </p>
            <MathBlock tex="I(X; Z) \leq I(X; Y)" />
            <p>
                Information cannot increase by processing alone — you cannot extract more information about
                X from Z than was already in Y. This is a fundamental constraint in representation
                learning.
            </p>

            <DiagramBlock title="Mutual information — shared entropy between X and Y">
                <MutualInfoDiagram />
            </DiagramBlock>

            <h3>Connections to Machine Learning</h3>
            <ul>
                <li>
                    <strong>Cross-entropy loss</strong> = H(truth, model) = H(truth) + D<sub>KL</sub>(truth ‖
                    model). Since H(truth) is fixed for one-hot labels, minimising cross-entropy is
                    equivalent to minimising KL divergence from the true distribution to the model's
                    distribution.
                </li>
                <li>
                    <strong>Language model perplexity</strong> = 2<sup>H</sup> where H is the cross-entropy
                    of the model on real text. Perplexity is the effective branching factor — a perplexity
                    of 50 means the model is as uncertain as a 50-sided die at each step.
                </li>
                <li>
                    <strong>VAE ELBO</strong>: The evidence lower bound is a lower bound on log p(data) that
                    decomposes as reconstruction loss minus KL(latent | prior).
                </li>
                <li>
                    <strong>InfoNCE</strong> (contrastive learning): A lower bound on the mutual information
                    between two views of the same data — the loss that trains CLIP and SimCLR.
                </li>
                <li>
                    <strong>Maximum likelihood</strong> in generative models is equivalent to minimising
                    D<sub>KL</sub>(data ‖ model) — the same objective that cross-entropy loss minimises for
                    discrete data.
                </li>
            </ul>
        </>
    )
}

const PY_CODE = `import numpy as np
from scipy.stats import entropy

# ── Entropy ──────────────────────────────────────────────────────
# H(X) = -Σ p(x) · log₂ p(x)

# Fair coin
p_fair = np.array([0.5, 0.5])
H_fair = entropy(p_fair, base=2)
print(f"Fair coin entropy:  {H_fair:.4f} bits")   # → 1.0000

# Biased coin (p(H)=0.9)
p_biased = np.array([0.9, 0.1])
H_biased = entropy(p_biased, base=2)
print(f"Biased coin entropy: {H_biased:.4f} bits")  # → 0.4690

# Four equally likely outcomes (2 bits = log₂ 4)
p_uniform4 = np.array([0.25, 0.25, 0.25, 0.25])
print(f"Uniform-4 entropy:   {entropy(p_uniform4, base=2):.4f} bits")  # → 2.0000

# ── Cross-Entropy and KL Divergence ──────────────────────────────
# H(P, Q) = -Σ p(x) · log₂ q(x)
# D_KL(P||Q) = Σ p(x) · log₂(p(x)/q(x)) = H(P, Q) - H(P)

p_true = np.array([0.7, 0.2, 0.1])
p_model = np.array([0.6, 0.25, 0.15])

H_pe = entropy(p_true, qk=p_model, base=2)          # cross-entropy
H_pr = entropy(p_true, base=2)                     # true entropy
D_kl  = H_pe - H_pr                                  # KL divergence

print(f"Cross-entropy H(P,Q): {H_pe:.4f} bits")
print(f"True entropy H(P):    {H_pr:.4f} bits")
print(f"KL divergence D_KL:   {D_kl:.4f} bits")    # always ≥ 0

# Verify: D_KL(P||Q) ≥ 0
print(f"D_KL ≥ 0: {D_kl >= -1e-10}")               # True

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
print(f"\nEmpirical mutual information I(X;Y): {mi:.4f} bits")
print("(High MI means X and Y carry information about each other)")

# ── Perplexity (cross-entropy in exponent) ───────────────────────
# perplexity = 2^{H}  — effective branching factor
cross_ent = 2.1     # suppose cross-entropy loss is 2.1 nats on test set
perplexity = np.exp(cross_ent)
print(f"\nModel perplexity: {perplexity:.1f}")
print("(A perplexity of 50 = as uncertain as a 50-sided die)")

# ── KL Divergence in VAE / regularised learning ──────────────────
# In a VAE: ELBO = E[log p(x|z)] - D_KL(q(z|x) || p(z))
# Here we simulate the KL term between a learned Gaussian and N(0,1)

mu_q   = np.array([0.1, -0.05])
sigma_q = np.array([0.8, 0.9])
# Prior: standard normal
mu_p   = np.array([0.0, 0.0])
sigma_p = np.array([1.0, 1.0])

# KL(N(mu_q, sigma_q) || N(mu_p, sigma_p))
kl = np.sum(
    np.log(sigma_p / sigma_q)
    + (sigma_q**2 + (mu_q - mu_p)**2) / (2 * sigma_p**2)
    - 0.5
)
print(f"\nVAE KL(latent || prior): {kl:.4f} nats")
print("(Minimising this pushes the latent posterior toward the prior)")`

function PythonTab() {
    return (
        <>
            <p>
                NumPy and SciPy provide all the building blocks for information-theoretic computations.
                No specialised library is required.
            </p>
            <CodeBlock code={PY_CODE} filename="information_theory.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> <code>entropy(pk, qk=qk)</code> is cross-entropy;{" "}
                <code>entropy(pk)</code> is Shannon entropy. The difference is the KL divergence. In
                PyTorch, <code>nn.CrossEntropyLoss</code> is the KL divergence between the true
                one-hot distribution and the model's softmax output — exactly as described in the Maths
                tab.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const INFORMATION_THEORY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
