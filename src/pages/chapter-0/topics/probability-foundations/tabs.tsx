import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import { DiagramBlock } from "../probability/diagrams"
import { NormalDistributionDiagram, BayesDiagram, VarianceDiagram } from "../probability/diagrams"

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
            challenge: "Gauss's least-squares method (from systems of equations) assumed that measurement errors followed a specific distribution. But what is a distribution, and where do the probability rules come from? To answer these questions, we need to go back further — to 1654 and a gambling dispute. The Chevalier de Méré needed to divide a prize pot when a game of chance was interrupted midway. Classical mathematics had no framework for reasoning about incomplete random events.",
            what: "Blaise Pascal and Pierre de Fermat exchanged a series of letters that solved the Problem of Points by systematically enumerating all possible future outcomes and assigning each a proportional share. This was the first rigorous computation of 'expected value' — the weighted average of outcomes by their likelihoods. They didn't just solve one game; they invented a general calculus of uncertainty that applies to any probabilistic situation.",
            impact: "Every machine learning model outputs probabilities. The expected value they defined is exactly the quantity that loss functions compute: L(θ) = E[ℓ(f(x; θ), y)] — the average loss across a distribution of possibilities. Cross-entropy loss, the standard loss for classification, is a direct descendant of their idea of weighting outcomes by probability.",
        },
        {
            year: "1713 — Bernoulli — The Law of Large Numbers",
            title: "From uncertainty to stability",
            challenge: "Pascal and Fermat could compute probabilities for specific games, but could anyone trust that observed frequencies would converge to theoretical probabilities in practice? A coin flipped 10 times might show 7 heads — does that mean it's biased? Without a mathematical proof connecting theory to observation, probability remained a intellectual exercise, not a practical science.",
            what: "Jacob Bernoulli proved the Law of Large Numbers: as the number of independent trials increases, the observed frequency of an event converges to its true probability. Flip a fair coin enough times and the proportion of heads approaches exactly 50%. This wasn't intuition — it was a rigorous theorem whose proof took him 20 years and was published posthumously in 1713.",
            impact: "This is why training works. A neural network sees thousands of examples and its average empirical performance converges to its true expected performance on the data distribution. Stochastic gradient descent relies on this directly: computing the gradient on a random mini-batch of 32 examples approximates the true gradient over millions of examples. Without Bernoulli's law, there would be no statistical guarantee that SGD-based training converges.",
        },
        {
            year: "1763 — Bayes — Inverse Probability",
            title: "Learning from evidence",
            challenge: "Probability theory could compute 'given a fair coin, what's the chance of 3 heads?' But science constantly needs the reverse: 'given 3 heads, what's the chance the coin is fair?' This inverse problem — reasoning from evidence back to causes — had no formal solution. Gauss's least-squares had implicitly solved a version of this, but without a general framework.",
            what: "Thomas Bayes (published posthumously by Richard Price in 1763) derived a formula for updating beliefs in light of new evidence. Given a prior belief P(hypothesis) and the likelihood of the data P(data | hypothesis), the posterior is P(hypothesis | data) ∝ P(data | hypothesis) · P(hypothesis). It provides a mathematical recipe for rational belief revision.",
            impact: "Bayes' theorem is the foundation of Bayesian ML, Bayesian optimisation (hyperparameter tuning), naive Bayes classifiers, and Bayesian neural networks. Every learning algorithm updates its 'beliefs' (model parameters) from data — Bayes just makes this update rule mathematically explicit and optimal. Modern RLHF fine-tuning has a Bayesian interpretation: the prior is the pre-trained model, the evidence is human feedback, and the posterior is the aligned model.",
        },
        {
            year: "1809 — Gauss — The Normal Distribution",
            title: "The bell curve and the justification for least squares",
            challenge: "Least squares was powerful, but Gauss needed to justify why minimising squared errors — rather than absolute errors or fourth-power errors — was the right choice. What mathematical model of measurement error makes squared errors the natural objective? Without an answer, least squares was just a convenient technique, not a principled method.",
            what: "Gauss showed that if measurement errors are independent, identically distributed, and satisfy minimal regularity conditions, they follow the normal distribution N(μ, σ²) — the bell curve. Under this model, the maximum likelihood estimate of the true value is exactly the least-squares solution. The normal distribution is fully described by two parameters: the mean μ (centre) and variance σ² (spread). The Central Limit Theorem later showed why it appears so naturally: sums of many independent random effects always converge to a normal, regardless of the original distribution.",
            impact: "The normal distribution is the most important distribution in ML. Weight initialisation uses N(0, σ²). Batch normalisation forces activations toward N(0, 1). Variational autoencoders model latent spaces as Gaussian. Diffusion models corrupt data with Gaussian noise and learn to reverse it. Understanding this distribution unlocks the mathematical explanation for nearly half of ML theory.",
        },
        {
            year: "1900 — Pearson — Statistical Hypothesis Testing",
            title: "Is this result real or just noise?",
            challenge: "By 1900, scientists could compute expected values and fit Gaussian curves to data. But they had no principled way to ask: 'is this difference significant, or could it have arisen by chance?' Biology, medicine, and economics were drowning in data but starved of rigorous inference. How do you tell signal from noise?",
            what: "Karl Pearson invented the chi-squared test and formalised the concept of a null hypothesis: the assumption that nothing interesting is happening. He showed how to compute a test statistic with a known probability distribution under the null hypothesis. If the observed statistic was extreme enough (low p-value), you could reject the null with quantifiable confidence. This introduced the idea that you reason about the probability of the data, not the probability of the hypothesis.",
            impact: "Every A/B test, every clinical trial, every model comparison in ML uses this framework. When we report 'model A beats model B with p < 0.01', we are using Pearson's methodology. This also bridges directly to the next topic: as we handle many variables simultaneously — many measurements per data point — we need vectors and matrices to organise them. Probability over many variables simultaneously is multivariate probability, and its natural language is linear algebra.",
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

            <p className="ch-story-intro">
                Systems of equations assumed we knew the right answers and just had to find them. But in the real world, measurements have random errors, outcomes are uncertain, and the data itself is noisy. Probability is the mathematics of uncertainty — and it's the language that all of AI speaks.
            </p>

            <Analogy label="Probability = How likely something is">
                Imagine you have a bag with 3 red marbles and 1 blue marble. You reach in without looking. The <strong>probability</strong> of pulling red is 3 out of 4 — pretty likely! Probability is just: <em>"how many ways can this happen"</em> divided by <em>"how many total things could happen."</em>
                <br /><br />
                In AI, probabilities are everywhere: the model says "I'm 92% sure this email is spam." The 92% is a probability — not a yes or a no, but a degree of confidence.
            </Analogy>

            <Analogy label="Expected value = The long-run average">
                If a game pays you $1 for heads and $0 for tails, and you play 100 times, you'd expect about $50 total. Your <strong>expected value</strong> per flip is $0.50 — the average you'd get if you played forever. It's not what happens each time; it's what tends to happen over many tries.
                <br /><br />
                In AI, the loss function is an expected value: the <em>average</em> prediction error across all possible inputs. Training is about reducing this expected error as much as possible.
            </Analogy>

            <Analogy label="Mean and variance = Centre and spread">
                Two classes take a test. Both average 70%. But Class A scores between 65–75%, while Class B scores between 40–100%. Same average, very different picture.
                <br /><br />
                The <strong>mean</strong> tells you the centre. The <strong>variance</strong> tells you the spread. In ML, variance measures how much the model's predictions would change if you trained on different data. High variance = overfitting. The bias-variance tradeoff is one of the most important ideas in all of ML.
            </Analogy>

            <Analogy label="Bayes' theorem = Changing your mind with evidence">
                Your friend says "I'm thinking of an animal." You guess: probably a dog — dogs are common. Then they say "it has stripes." Now you update to a cat or a zebra!
                <br /><br />
                <strong>Bayes' theorem</strong> is the mathematical rule for exactly this update. You start with a <em>prior</em> belief (dogs are common), receive <em>evidence</em> (stripes), and compute a <em>posterior</em> (new belief after evidence). Every learning algorithm is doing this — adjusting beliefs based on data.
            </Analogy>

            <Analogy label="The bell curve = Nature's favourite shape">
                Measure the heights of 1000 people. Plot them. You get a bell: most people near the average, fewer very tall or short. This <strong>normal distribution</strong> shows up everywhere — measurement errors, test scores, the random noise in training data, even the initial weights in a neural network.
                <br /><br />
                Why does it appear everywhere? Because whenever many small, independent random effects add up, the total always follows the bell curve — no matter what the individual effects look like. That's the <strong>Central Limit Theorem</strong>.
            </Analogy>

            <DiagramBlock title="The normal distribution — nature's favourite shape">
                <NormalDistributionDiagram />
            </DiagramBlock>

            <Analogy label="What comes next — many variables at once">
                Probability over one variable is manageable. But a real dataset has thousands of variables — one measurement per feature, per data point. When you want to ask "do these features tend to go up together?" or "which combinations are most informative?" you need to organise all those measurements into a compact notation. That's exactly what <strong>vectors and matrices</strong> — our next topic — provide.
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
                As probability scales to many variables simultaneously — the joint distribution of all features
                in a dataset — we need matrices to represent covariances and vectors to represent data points.
                That language of vectors and matrices is our next topic.
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

function MathsContent() {
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

const PY_CODE = `import torch
from torch.distributions import Normal, Bernoulli, Categorical, kl_divergence
import torch.nn.functional as F

# ── 1. Sampling with torch.distributions ─────────────────────────────────
print("[Sampling] torch.distributions")

torch.manual_seed(42)
coin    = Bernoulli(probs=torch.tensor(0.5))
flips   = coin.sample((1000,))
print(f"  P(heads) ≈ {flips.mean():.3f}  (Law of Large Numbers)")

dist    = Normal(loc=torch.tensor(0.0), scale=torch.tensor(1.0))
samples = dist.sample((10_000,))
print(f"  N(0,1):  mean={samples.mean():.4f}  std={samples.std():.4f}")
print(f"  within 1σ: {(samples.abs() < 1).float().mean()*100:.1f}%  (true: 68.3%)")
print(f"  log_prob(0.0) = {dist.log_prob(torch.tensor(0.0)).item():.4f}")

# ── 2. Batched distributions — many at once ───────────────────────────────
print("\\n[Batched] 100 distributions sampled simultaneously")

means   = torch.linspace(-3, 3, 100)
stds    = torch.ones(100) * 0.5
batch_d = Normal(means, stds)
s       = batch_d.sample((200,))     # (200, 100) — 200 draws from each of 100 dists
print(f"  max mean error: {(s.mean(0) - means).abs().max():.4f}")

# ── 3. Bayes' theorem — conjugate Normal-Normal update ────────────────────
print("\\n[Bayes] conjugate Normal-Normal update")

torch.manual_seed(0)
true_mu = torch.tensor(3.0)
obs     = Normal(true_mu, torch.tensor(1.0)).sample((20,))

mu_0, sigma_pr, sigma_lik, n = 0.0, 2.0, 1.0, 20
x_bar  = obs.mean()
prec_n = 1/sigma_pr**2 + n/sigma_lik**2
mu_n   = (mu_0/sigma_pr**2 + n*x_bar/sigma_lik**2) / prec_n
sig_n  = prec_n**-0.5

prior = Normal(torch.tensor(mu_0), torch.tensor(sigma_pr))
post  = Normal(mu_n, sig_n)
print(f"  Prior:     N({mu_0:.1f}, {sigma_pr:.1f}²)   log_prob(true) = {prior.log_prob(true_mu):.3f}")
print(f"  Posterior: N({mu_n:.2f}, {sig_n:.2f}²)  log_prob(true) = {post.log_prob(true_mu):.3f}")

# ── 4. MLE — gradient ascent on log-likelihood ────────────────────────────
print("\\n[MLE] fit parameters by gradient ascent")

torch.manual_seed(0)
data = Normal(torch.tensor(5.0), torch.tensor(2.0)).sample((500,))

mu_hat    = torch.tensor(0.0, requires_grad=True)
sigma_hat = torch.tensor(1.0, requires_grad=True)

for _ in range(500):
    log_lik = Normal(mu_hat, sigma_hat.abs() + 1e-6).log_prob(data).sum()
    (-log_lik).backward()
    with torch.no_grad():
        mu_hat    -= 0.01 * mu_hat.grad
        sigma_hat -= 0.01 * sigma_hat.grad
    mu_hat.grad.zero_();  sigma_hat.grad.zero_()

print(f"  True:  μ=5.0, σ=2.0")
print(f"  MLE:   μ̂={mu_hat.item():.3f}, σ̂={sigma_hat.abs().item():.3f}")

# ── 5. Cross-entropy and KL divergence ────────────────────────────────────
print("\\n[Cross-entropy & KL]")

logits  = torch.tensor([[2.0, 1.0, 0.1], [0.5, 2.1, 0.3]])
targets = torch.tensor([0, 1])
ce      = F.cross_entropy(logits, targets)
print(f"  CE loss: {ce.item():.4f}  (= -log P(true class))")

P = Categorical(probs=torch.tensor([0.7, 0.2, 0.1]))
Q = Categorical(probs=torch.tensor([0.6, 0.25, 0.15]))
kl = kl_divergence(P, Q)
print(f"  KL(P||Q) = {kl.item():.6f} nats  (≥ 0, = 0 iff P = Q)")`

function PythonContent() {
    return (
        <>
            <p>
                <code>torch.distributions</code> provides every common distribution with
                sampling, log-prob, entropy, and KL divergence — the exact building blocks
                of MLE, Bayesian inference, and variational methods.
            </p>
            <CodeBlock code={PY_CODE} filename="probability_foundations.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> <code>nn.CrossEntropyLoss</code> is MLE in disguise —
                it maximises the log-likelihood of correct class labels under the model's softmax
                distribution. Gradient ascent on log-likelihood and gradient descent on cross-entropy
                are the same operation.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const PROBABILITY_FOUNDATIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
