import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import { DiagramBlock } from "./diagrams"
import { NormalDistributionDiagram, BayesDiagram, VarianceDiagram } from "./diagrams"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
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
    const items: TimelineItem[] = [
        {
            year: "1654 — Pascal & Fermat — The Problem of Points",
            title: "Probability is born from a gambling dispute",
            challenge: "The Chevalier de Méré, a French nobleman and gambler, posed a problem: a game of chance is interrupted before completion. Two players have different scores. How should the pot be divided fairly? Classical mathematics had no framework for reasoning about incomplete random events.",
            what:
                "Blaise Pascal and Pierre de Fermat exchanged a series of letters that solved the Problem of Points by systematically enumerating all possible future outcomes and assigning each a proportional share. This was the first time 'expected value' was computed — the weighted average of outcomes by their likelihoods. They didn't just solve one game; they invented a general calculus of uncertainty.",
            impact:
                "Every machine learning model outputs probabilities. The expected value they defined is exactly the quantity that loss functions compute: the average outcome across a distribution of possibilities. Cross-entropy loss, the standard loss for classification in neural networks, is a direct descendant of their idea of weighting outcomes by probability.",
        },
        {
            year: "1713 — Bernoulli — The Law of Large Numbers",
            title: "From uncertainty to stability",
            challenge: "Pascal and Fermat could compute probabilities for dice and cards, but could anyone trust that observed frequencies converge to theoretical probabilities? A coin flipped 10 times might show 7 heads — does that mean it's biased? No mathematical proof connected theory to observation.",
            what:
                "Jacob Bernoulli proved the Law of Large Numbers: as the number of independent trials increases, the observed frequency of an event converges to its true probability. Flip a fair coin enough times and the proportion of heads will approach 50%. This wasn't just intuition — it was a rigorous theorem with a proof that took him 20 years.",
            impact:
                "This is why training works. A neural network sees thousands of examples and its average performance converges to its expected performance on the true data distribution. Stochastic gradient descent relies on this: small random batches approximate the full gradient. Without Bernoulli's law, there would be no statistical guarantee that training converges.",
        },
        {
            year: "1763 — Bayes — Inverse Probability",
            title: "Learning from evidence",
            challenge: "Probability theory could compute 'given a fair coin, what's the chance of 3 heads?' But the real question in science is the reverse: 'given 3 heads, what's the chance the coin is fair?' This inverse problem — reasoning from evidence back to causes — had no formal solution.",
            what:
                "Thomas Bayes (published posthumously by Richard Price) derived a formula for updating beliefs in light of new evidence. Bayes' theorem states that the posterior probability of a hypothesis is proportional to the likelihood of the data given that hypothesis, times the prior probability of the hypothesis. It provides a mathematical recipe for changing your mind rationally.",
            impact:
                "Bayes' theorem is the foundation of Bayesian machine learning, Bayesian optimisation (used for hyperparameter tuning), naive Bayes classifiers, and Bayesian neural networks that output uncertainty estimates. The concept of 'updating beliefs from data' is what all learning algorithms do — Bayes just made it rigorous. Modern LLM fine-tuning methods like RLHF have Bayesian interpretations.",
        },
        {
            year: "1809 — Gauss — The Normal Distribution",
            title: "The bell curve explains everything",
            challenge: "Astronomers, surveyors, and physicists all encountered measurement errors. Every telescope reading was slightly off. No one knew the mathematical shape of these errors — only that small errors were more common than large ones. Without a model for error, there was no principled way to combine multiple noisy measurements.",
            what:
                "Carl Friedrich Gauss showed that if measurement errors are independent and identically distributed, they follow a specific bell-shaped curve — the Gaussian (normal) distribution. He used it to justify least-squares estimation: the mean of repeated measurements is the most probable true value. The shape is fully described by two parameters: the mean (centre) and variance (spread).",
            impact:
                "The normal distribution is everywhere in ML. Weight initialisation uses N(0, 0.02). Batch normalisation explicitly forces activations toward a Gaussian. Variational autoencoders model latent spaces as Gaussian. The central limit theorem guarantees that sums of random effects tend toward Gaussian — which is why it appears so often in real data. Understanding this single distribution unlocks half of ML theory.",
        },
        {
            year: "1900 — Pearson — Statistical Hypothesis Testing",
            title: "Is this result real or just noise?",
            challenge: "By the late 19th century, scientists could collect data and compute averages, but they had no principled way to ask: 'is this difference statistically significant, or could it have arisen by chance?' Biology, medicine, and social science were drowning in data but starved of rigorous inference.",
            what:
                "Karl Pearson invented the chi-squared test, a method for determining whether observed data is consistent with a hypothesised distribution. He introduced the concept of a null hypothesis and a test statistic with a known probability distribution. If the observed statistic was extreme enough (low p-value), you could reject the null hypothesis with confidence.",
            impact:
                "Every A/B test in industry, every clinical trial, every ML model comparison uses hypothesis testing. When you compare two models and ask 'is model A really better than model B?', you're doing a statistical test. Cross-validation with statistical significance tests is how we distinguish real improvements from random variation in benchmarks.",
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
            <h2>Guessing, dice, and changing your mind</h2>

            <Analogy label="Probability = How likely something is">
                Imagine you have a bag with 3 red marbles and 1 blue marble. You reach in without looking.
                The <strong>probability</strong> of pulling out a red marble is 3 out of 4 — it's pretty likely!
                Probability is just a way of saying <em>"how many ways can this happen"</em> divided by{" "}
                <em>"how many total things could happen."</em>
            </Analogy>

            <Analogy label="Expected value = The long-run average">
                If a game pays you $1 for heads and nothing for tails, and you play 100 times, you'd expect
                about $50. Your <strong>expected value</strong> per flip is $0.50 — the average you'd get if you
                played forever. It's not what happens each time; it's what tends to happen over many tries.
                <br />
                <br />
                In AI, the "game" is the model making predictions, and the "prize" is getting the answer right.
                Training is about making the expected prize as big as possible.
            </Analogy>

            <Analogy label="Mean and variance = Centre and spread">
                Imagine two classes take a test. Both get an average of 70%. But in Class A, everyone scored
                between 65–75%. In Class B, scores ranged from 40–100%. Same average, very different pictures!
                <br />
                <br />
                The <strong>mean</strong> (average) tells you where the centre is. The <strong>variance</strong>{" "}
                tells you how spread out things are. High variance = wild, unpredictable. Low variance = consistent,
                bunched together.
            </Analogy>

            <Analogy label="Bayes' theorem = Changing your mind with evidence">
                Suppose your friend says "I'm thinking of an animal." You guess: it's probably a dog (because
                dogs are common). Then they say "it has stripes." Now you change your guess to a cat or a zebra!
                <br />
                <br />
                <strong>Bayes' theorem</strong> is the mathematical rule for exactly this: how to update your
                belief when you get new clues. You start with a <em>prior</em> guess (dogs are common), you get{" "}
                <em>evidence</em> (stripes), and you compute a <em>posterior</em> (new guess). AI systems do this
                millions of times per second.
            </Analogy>

            <Analogy label="The bell curve = Nature's favourite shape">
                If you measure the heights of 1000 people and plot them, you get a bell shape: most people are
                near average, with fewer very tall or very short people. This is the <strong>normal distribution</strong>{" "}
                (bell curve), and it shows up everywhere — test scores, measurement errors, even the weights inside
                a neural network when it starts training.
            </Analogy>

            <DiagramBlock title="The normal distribution — nature's favourite shape">
                <NormalDistributionDiagram />
            </DiagramBlock>

            <Analogy label="Why probability matters for AI">
                An AI doesn't know anything for certain. When it looks at a photo, it doesn't say "this IS a cat."
                It says "I'm 94% sure this is a cat." Everything in AI is a probability — a degree of confidence.
                Probability theory is the language AI uses to express how sure it is, and to get surer over time
                by learning from data.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From counting outcomes to continuous distributions</h2>

            <p>
                You've computed averages and maybe drawn bar charts. Statistics proper starts with two questions:
                <em>what's likely to happen?</em> (probability) and <em>what does the data tell us?</em> (inference).
            </p>

            <h3>Probability — the mathematics of uncertainty</h3>
            <p>
                A <strong>probability</strong> P(A) is a number between 0 and 1 that measures how likely event A is.
                It's defined as favourable outcomes divided by total outcomes:
            </p>
            <MathBlock tex="P(A) = \frac{\text{outcomes where A happens}}{\text{all possible outcomes}}" />
            <p>
                Two events A and B can combine in useful ways. The <strong>union</strong> (A or B) and{" "}
                <strong>intersection</strong> (A and B):
            </p>
            <MathBlock tex="P(A \cup B) = P(A) + P(B) - P(A \cap B)" />
            <p>
                If A and B are <strong>independent</strong> (knowing one tells you nothing about the other), then
                P(A ∩ B) = P(A) · P(B). This is the product rule, and it's used every time a neural network
                computes the likelihood of a sequence of tokens — each token is conditionally independent given
                the model's state.
            </p>

            <h3>Conditional Probability — probabilities that depend on context</h3>
            <p>
                <strong>Conditional probability</strong> P(A|B) is the probability of A <em>given that</em> B has
                already happened:
            </p>
            <MathBlock tex="P(A|B) = \frac{P(A \cap B)}{P(B)}" />
            <p>
                Read: "probability of A given B." In an LLM, P("cat"|"the fluffy") is the probability that "cat"
                follows "the fluffy." The entire job of a language model is to compute conditional probabilities.
            </p>

            <h3>Bayes' Theorem — flipping the condition</h3>
            <p>
                Bayes' theorem lets you reverse the condition — from P(B|A) to P(A|B):
            </p>
            <MathBlock tex="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" />

            <DiagramBlock title="Bayes' theorem — updating beliefs with evidence">
                <BayesDiagram />
            </DiagramBlock>

            <p>
                The four components: <strong>P(A)</strong> is the <em>prior</em> (your belief before seeing data),
                <strong>P(B|A)</strong> is the <em>likelihood</em> (how probable is the data if A is true),
                <strong>P(B)</strong> is the <em>evidence</em> (total probability of the data), and{" "}
                <strong>P(A|B)</strong> is the <em>posterior</em> (your updated belief after seeing data).
            </p>

            <h3>Mean, Variance, and Standard Deviation</h3>
            <p>
                Given data points x₁, x₂, ..., xₙ, the <strong>mean</strong> (average) is:
            </p>
            <MathBlock tex="\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i" />
            <p>
                The <strong>variance</strong> measures how spread out the data is — the average squared distance
                from the mean:
            </p>
            <MathBlock tex="\sigma^2 = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2" />
            <p>
                The <strong>standard deviation</strong> σ = √σ² is in the same units as the data. In ML, variance
                appears in weight decay, batch normalisation, and model uncertainty estimation.
            </p>

            <DiagramBlock title="Variance — how spread out the data points are from the mean">
                <VarianceDiagram />
            </DiagramBlock>

            <h3>The Normal Distribution — the bell curve</h3>
            <p>
                The most important distribution in all of statistics. Its probability density function (PDF) is:
            </p>
            <MathBlock tex="f(x) = \frac{1}{\sigma\sqrt{2\pi}}\,\exp\!\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)" />
            <p>
                Two parameters control everything: <strong>μ</strong> (mean — where it's centred) and{" "}
                <strong>σ</strong> (standard deviation — how wide it is). About 68% of data falls within one σ
                of the mean, 95% within two σ.
            </p>

            <DiagramBlock title="The normal (Gaussian) distribution">
                <NormalDistributionDiagram />
            </DiagramBlock>

            <div className="ch-callout">
                <strong>Connection to ML:</strong> Cross-entropy loss (used to train classifiers and LLMs)
                comes directly from probability theory: it measures how surprised the model is by the correct
                answer. Weight initialisation draws from N(0, 0.02). Batch normalisation centres activations
                to μ=0, σ=1. Variance measures model confidence. Every core ML concept is statistical.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Probability spaces, distributions, and inference</h2>
            <p>
                What follows is the probability theory that underpins every loss function, every uncertainty
                estimate, and every generative model in machine learning.
            </p>

            <DefBlock label="Definition — Probability Space">
                A probability space is a triple (Ω, F, P) where Ω is the sample space (set of all outcomes),
                F is a σ-algebra on Ω (the set of measurable events), and P: F → [0,1] is a measure satisfying
                P(Ω) = 1 and countable additivity. Every random variable, distribution, and expectation is
                defined relative to this triple.
            </DefBlock>

            <h3>Random Variables and Distributions</h3>
            <p>
                A <strong>random variable</strong> X: Ω → ℝ assigns a number to each outcome. Its distribution
                is described by the <strong>cumulative distribution function</strong> (CDF):
            </p>
            <MathBlock tex="F(x) = P(X \leq x)" />
            <p>
                For continuous random variables, the <strong>probability density function</strong> (PDF) f(x)
                satisfies F(x) = ∫₋∞ˣ f(t) dt. Note: f(x) is not a probability — it can exceed 1. Only
                integrals of f over intervals give probabilities.
            </p>

            <h3>Expectation — the weighted average</h3>
            <p>
                The <strong>expected value</strong> of a random variable X is:
            </p>
            <MathBlock tex="\mathbb{E}[X] = \int_{-\infty}^{\infty} x\,f(x)\,dx" />
            <p>
                For discrete X, this becomes Σ xᵢ P(X = xᵢ). Expectation is linear — for any random variables
                X, Y and constants a, b:
            </p>
            <MathBlock tex="\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]" />
            <p>
                In ML, the loss function is an expectation: L(θ) = 𝔼[ℓ(f(x; θ), y)] over the data distribution.
                SGD approximates this expectation using mini-batches.
            </p>

            <h3>Variance — measuring uncertainty</h3>
            <p>
                The <strong>variance</strong> measures the spread of X around its mean:
            </p>
            <MathBlock tex="\text{Var}(X) = \mathbb{E}\left[(X - \mathbb{E}[X])^2\right] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2" />
            <p>
                The standard deviation σ = √Var(X) is in the same units as X. In ML, variance quantifies
                model uncertainty, and the <strong>bias-variance tradeoff</strong> decomposes prediction error
                into systematic error (bias) and sensitivity to training data (variance).
            </p>

            <h3>Covariance and Correlation</h3>
            <p>
                For two random variables X, Y, the <strong>covariance</strong> measures how they co-vary:
            </p>
            <MathBlock tex="\text{Cov}(X, Y) = \mathbb{E}[(X - \mu_X)(Y - \mu_Y)]" />
            <p>
                Dividing by both standard deviations gives the <strong>correlation coefficient</strong> ρ ∈ [-1, 1].
                The covariance matrix Σ with Σᵢⱼ = Cov(Xᵢ, Xⱼ) is the central object in PCA, Gaussian models,
                and Mahalanobis distance.
            </p>

            <h3>Maximum Likelihood Estimation (MLE)</h3>
            <p>
                Given observed data D = {"{x₁, ..., xₙ}"}, MLE finds the parameters θ that make the data most
                probable under the model:
            </p>
            <MathBlock tex="\theta_{\text{MLE}} = \arg\max_\theta \prod_{i=1}^n p(x_i | \theta)" />
            <p>
                In practice, we maximise the <strong>log-likelihood</strong> (log turns products into sums,
                avoids numerical underflow):
            </p>
            <MathBlock tex="\theta_{\text{MLE}} = \arg\max_\theta \sum_{i=1}^n \log p(x_i | \theta)" />
            <p>
                Minimising cross-entropy loss in a neural network <em>is exactly MLE</em>. The model outputs
                p(y|x; θ) and training maximises the log-likelihood of the correct labels. MSE loss is MLE
                under a Gaussian noise assumption.
            </p>

            <h3>KL Divergence — measuring distributional distance</h3>
            <p>
                The <strong>Kullback-Leibler divergence</strong> measures how one distribution diverges from another:
            </p>
            <MathBlock tex="D_{\text{KL}}(P \| Q) = \sum_x P(x) \log \frac{P(x)}{Q(x)}" />
            <p>
                KL divergence is non-negative and zero only when P = Q. It is not symmetric (not a true distance).
                In ML, it appears in: variational inference (VAEs minimise KL(q‖p)), knowledge distillation
                (training a small model to match a large one), and regularisation (keeping learned distributions
                close to priors).
            </p>

            <h3>Cross-Entropy — the standard classification loss</h3>
            <p>
                Cross-entropy combines the entropy of P with the KL divergence:
            </p>
            <MathBlock tex="H(P, Q) = -\sum_x P(x) \log Q(x) = H(P) + D_{\text{KL}}(P \| Q)" />
            <p>
                When P is the true distribution (one-hot labels) and Q is the model's prediction, minimising
                cross-entropy is equivalent to maximising log-likelihood. This is why{" "}
                <strong>every classifier and language model uses cross-entropy loss</strong>.
            </p>

            <h3>The Central Limit Theorem</h3>
            <p>
                If X₁, ..., Xₙ are i.i.d. with mean μ and variance σ², then the sample mean converges
                in distribution to a normal:
            </p>
            <MathBlock tex="\frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)" />
            <p>
                This explains why the Gaussian appears everywhere: any process that aggregates many small
                independent contributions tends toward normality. In ML, it justifies Gaussian noise models,
                explains the shape of gradient distributions during training, and underpins the theoretical
                analysis of SGD convergence.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> Machine learning is applied statistics. Every model defines a
                probability distribution p(y|x; θ), training is MLE (or MAP), loss functions are negative
                log-likelihoods, and regularisation is Bayesian priors. Understanding probability theory means
                understanding <em>why</em> these methods work, not just <em>how</em> to call the APIs.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Basic probability ──────────────────────────────────────
# Coin flip: P(heads) = 0.5
flips = np.random.choice(["H", "T"], size=1000)
p_heads = (flips == "H").mean()
print(f"P(heads) ≈ {p_heads}")  # ≈ 0.5 (Law of Large Numbers)

# ── Mean, variance, standard deviation ─────────────────────
data = np.array([2.1, 3.5, 1.8, 4.2, 3.1, 2.7, 3.9, 2.4])

mu = data.mean()
var = data.var()           # population variance
std = data.std()           # population std deviation
var_ddof = data.var(ddof=1)  # sample variance (unbiased)

print(f"Mean:     {mu:.3f}")
print(f"Variance: {var:.3f}")
print(f"Std Dev:  {std:.3f}")
print(f"Sample Var (n-1): {var_ddof:.3f}")

# ── Normal distribution ────────────────────────────────────
# The most important distribution in ML
# PDF: f(x) = (1/σ√2π) exp(-(x-μ)²/2σ²)

mu, sigma = 0.0, 1.0
samples = np.random.normal(mu, sigma, 10000)

print(f"\\nSamples from N({mu}, {sigma}²):")
print(f"  Sample mean: {samples.mean():.4f}")
print(f"  Sample std:  {samples.std():.4f}")
print(f"  % within 1σ: {((samples > -1) & (samples < 1)).mean():.3f}")   # ≈ 0.683
print(f"  % within 2σ: {((samples > -2) & (samples < 2)).mean():.3f}")   # ≈ 0.954

# ── Covariance matrix ──────────────────────────────────────
np.random.seed(42)
X = np.random.randn(100, 3)
X[:, 1] += 0.5 * X[:, 0]   # make feature 1 correlated with feature 0

cov_matrix = np.cov(X, rowvar=False)
print(f"\\nCovariance matrix (3×3):")
print(cov_matrix.round(3))

# ── Maximum Likelihood Estimation ──────────────────────────
# Suppose data comes from N(μ, σ²) — find μ, σ that maximise likelihood
# MLE for Gaussian: μ̂ = x̄, σ̂² = (1/n) Σ(xᵢ - x̄)²

true_mu, true_sigma = 5.0, 2.0
data = np.random.normal(true_mu, true_sigma, 500)

mu_mle = data.mean()
sigma2_mle = data.var()
sigma_mle = np.sqrt(sigma2_mle)

print(f"\\nMLE for N(μ, σ²):")
print(f"  True:  μ={true_mu}, σ={true_sigma}")
print(f"  MLE:   μ̂={mu_mle:.3f}, σ̂={sigma_mle:.3f}")

# Log-likelihood: Σ log N(xᵢ | μ, σ²)
def log_likelihood(data, mu, sigma):
    return np.sum(-0.5 * ((data - mu) / sigma)**2 - np.log(sigma) - 0.5 * np.log(2 * np.pi))

ll = log_likelihood(data, mu_mle, sigma_mle)
print(f"  Log-likelihood: {ll:.2f}")

# ── Cross-entropy (the standard ML loss) ───────────────────
# Cross-entropy = -Σ yᵢ log(pᵢ)  where y are true labels, p are predicted probs

def cross_entropy(y_true, y_pred):
    """Binary cross-entropy for a single example."""
    return -(y_true * np.log(y_pred + 1e-15) + (1 - y_true) * np.log(1 - y_pred + 1e-15))

# Perfect prediction
print(f"\\nCross-entropy (perfect):  {cross_entropy(1, 0.99):.4f}")
print(f"Cross-entropy (wrong):    {cross_entropy(1, 0.01):.4f}")
print(f"Cross-entropy (uncertain): {cross_entropy(1, 0.5):.4f}")

# ── KL divergence ──────────────────────────────────────────
def kl_divergence(p, q):
    """KL(P || Q) = Σ P(x) log(P(x) / Q(x))"""
    return np.sum(p * np.log((p + 1e-15) / (q + 1e-15)))

p = np.array([0.4, 0.3, 0.2, 0.1])
q1 = np.array([0.4, 0.3, 0.2, 0.1])   # same as p
q2 = np.array([0.25, 0.25, 0.25, 0.25]) # uniform

print(f"\\nKL(p||p) = {kl_divergence(p, q1):.4f}")    # 0 (identical)
print(f"KL(p||uniform) = {kl_divergence(p, q2):.4f}")  # > 0`

function PythonTab() {
    return (
        <>
            <p>
                NumPy for probability, statistics, and the core ML loss functions. Cross-entropy and MLE
                are the statistical foundations of every neural network's training loop.
            </p>
            <CodeBlock code={PY_CODE} filename="probability.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Every neural network classifier outputs probabilities via softmax,
                and is trained with cross-entropy loss. This is MLE in disguise — maximising the log-likelihood
                of correct labels. In PyTorch: <code>nn.CrossEntropyLoss()</code> combines log-softmax + NLL loss
                in one numerically stable operation.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const PROBABILITY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
