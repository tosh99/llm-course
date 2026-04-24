import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"

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
            year: "1908 — Student's t-distribution",
            title: "Small sample statistics",
            challenge: "William Gosset (\u201CStudent\u201D) worked at Guinness Brewery. He needed to make quality decisions from tiny samples — tasting just a few batches to decide whether a new brewing process was better. The normal distribution assumption required large samples, but Guinness could only afford to test a few batches at a time.",
            what: "Gosset derived the t-distribution — a heavy-tailed distribution that properly accounts for uncertainty when estimating the mean of a normally distributed population with unknown variance and small sample size n. The t-distribution approaches the normal as n → ∞, but for small n it properly inflates the confidence intervals.",
            impact: "Every A/B test, clinical trial, and model comparison in the world uses the t-test when sample sizes are small. In ML, we use t-tests to compare model performance when we have limited test sets or when comparing few runs. Without Gosset, we'd either waste samples or report overconfident conclusions.",
        },
        {
            year: "1922 — Fisher — Maximum Likelihood & Significance",
            title: "Fitting models to data rigorously",
            challenge: "Scientists wanted a principled method for fitting models to data and quantifying how confident they should be. Existing methods (like method of moments) were ad-hoc. There was no unified framework for: (1) estimating parameters from data, (2) measuring how good the fit is, (3) deciding whether a model is 'true' or the data just looks that way by chance.",
            what: "Ronald Fisher developed Maximum Likelihood Estimation (MLE) as the unifying framework: choose parameters that maximise the probability of observing the data you got. He also formalised p-values and null hypothesis significance testing: compute the probability of observing data this extreme if the null hypothesis were true — if p < 0.05, call it statistically significant.",
            impact: "MLE is the foundation of every trained ML model. Cross-entropy loss = minimising negative log-likelihood. Fisher's significance testing framework is how the field decides what is a real result vs noise. When Google reports 'model X outperforms Y with p < 0.001', they are using Fisher's framework.",
        },
        {
            year: "1933 — Neyman-Pearson — Decision Theory",
            title: "Optimal testing and the false positive tradeoff",
            challenge: "Fisher's significance testing was powerful but had a problem: the p-value depends on the data you observed, not on what you were willing to tolerate in terms of false positives. Scientists couldn't formally trade off Type I errors (false positives, crying wolf) against Type II errors (false negatives, missing real effects).",
            what: "Jerzy Neyman and Egon Pearson formulated hypothesis testing as a decision problem. They introduced: the null and alternative hypotheses, Type I error rate (α = probability of false positive), Type II error rate (β), and the power of a test (1 − β = probability of detecting a true effect). They proved the Likelihood Ratio Test is the most powerful test.",
            impact: "Every controlled experiment, A/B test, and clinical trial uses the Neyman-Pearson framework to set the false positive rate before running the experiment. In ML, when we choose a significance threshold or run a cross-validation comparison, we are implicitly using this framework.",
        },
        {
            year: "1935 — Fisher — Analysis of Variance (ANOVA)",
            title: "Comparing many groups at once",
            challenge: "Comparing two groups with a t-test works for two groups. But what if you have five different model architectures, or ten different hyperparameter settings? Running all pairwise t-tests inflates the false positive rate dramatically — with 10 groups, there are 45 pairwise comparisons.",
            what: "Fisher invented ANOVA (Analysis of Variance) to compare multiple group means simultaneously. The key insight: instead of comparing means directly, ANOVA compares the variance BETWEEN groups to the variance WITHIN groups. If between-group variance is much larger than within-group variance, at least one group mean differs significantly.",
            impact: "ANOVA and its descendants (MANOVA, ANCOVA) are the workhorses of experimental science and ML model comparison. In neural architecture search and hyperparameter tuning, ANOVA-style reasoning tells us whether any configuration difference is real or just noise.",
        },
        {
            year: "1956 — Wald — Statistical Decision Theory",
            title: "Decision theory as the unifying framework",
            challenge: "Estimation, hypothesis testing, and prediction all seemed like different problems. There was no unified theory that could tell you: given a loss function and a data distribution, what is the optimal decision procedure?",
            what: "Abraham Wald unified statistics and decision theory: every statistical problem is a decision problem. Choose an action (estimate, reject, predict) that minimises the expected loss (risk). The Bayes risk minimises expected loss over the prior. The minimax risk minimises the worst-case expected loss. MLE, MAP, and Bayes estimators are all special cases of this framework.",
            impact: "Wald's framework is the precise mathematical language for model selection, regularisation, and RLHF alignment. Regularisation = adding a penalty (increased loss) to prevent overfitting. When we choose λ in LASSO or set the KL divergence weight in VAEs, we're doing Wald-style decision theory.",
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
            <h2>Is this result real, or just lucky?</h2>

            <Analogy label="Sample mean vs true mean">
                If you want to know the average height of all 18-year-olds in your city, you can't measure everyone. So you pick 100 people at random and compute their average. Your <strong>sample mean</strong> is an estimate of the true average. But your estimate is never exactly right — there is always some error from random sampling.
                <br />
                <br />
                In ML, we split data into train and test sets. The model's performance on the test set is a sample estimate of its true generalisation performance.
            </Analogy>

            <Analogy label="Confidence interval = our best guess plus uncertainty">
                Instead of saying "the average height is 170 cm," you could say "I'm 95% confident the true average is between 168 cm and 172 cm." That <strong>confidence interval</strong> tells you not just the estimate but how uncertain we should be about it. A wider interval means we're less sure.
                <br />
                <br />
                In ML, reporting accuracy as "65% ± 2%" (with a confidence interval) is much more honest than just "65%".
            </Analogy>

            <Analogy label="Statistical significance = unlikely to be chance">
                If you flip a coin 10 times and get 8 heads, is the coin biased? Not necessarily — there's a small chance a fair coin does that. <strong>Statistical significance</strong> quantifies this: we say a result is "significant" if the probability of seeing it by pure chance is very small (typically less than 5%).
                <br />
                <br />
                In ML, when we say "Model A beats Model B with p = 0.003", we mean: if they were truly equal, there's only a 0.3% chance of seeing this big a difference by random sampling.
            </Analogy>

            <Analogy label="Bias-variance tradeoff = underfitting vs overfitting">
                Imagine trying to predict exam scores. A model that just predicts "50%" for everyone (the mean) is <strong>biased</strong> — it's always wrong in the same way (missing individual variation). A model that memorises every training example is <strong>high variance</strong> — it changes wildly if you swap in a different training set.
                <br />
                <br />
                The bias-variance tradeoff says: as you make the model more complex, bias decreases but variance increases. The best model minimises total error = bias² + variance.
            </Analogy>

            <Analogy label="Bayesian inference = updating beliefs with evidence">
                Start with a guess (prior belief): "this coin is probably fair." Then flip it 10 times and get 8 heads. Update your belief: "hmm, 8 heads is unusual for a fair coin — maybe it's biased." <strong>Bayesian inference</strong> does this formally: it starts with a prior, incorporates data to get a posterior, and makes predictions by averaging over all possible parameter values weighted by how probable they are.
                <br />
                <br />
                Bayesian neural networks do exactly this: instead of point estimates of weights, they maintain a distribution over weights.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From sample to population</h2>

            <h3>Point Estimation</h3>
            <p>
                A <strong>point estimator</strong> θ̂ is a single number computed from data that estimates
                the true parameter θ. Common estimators:
            </p>
            <ul>
                <li>Sample mean: μ̂ = x̄ = (1/n) Σxᵢ estimates the true mean μ</li>
                <li>Sample variance: σ̂² = (1/(n−1)) Σ(xᵢ − x̄)² estimates true variance σ²</li>
                <li>MLE: choose θ̂ to maximise the likelihood of the observed data</li>
            </ul>
            <p>
                In ML: the learned parameters θ̂ are point estimates. After training, we have one specific
                model, not a distribution over models.
            </p>

            <h3>Bias and Variance of Estimators</h3>
            <p>
                The <strong>bias</strong> of an estimator is the difference between its expected value and the
                true parameter:
            </p>
            <MathBlock tex="\text{Bias}(\hat{\theta}) = \mathbb{E}[\hat{\theta}] - \theta" />
            <p>
                An estimator is <strong>unbiased</strong> if bias = 0. The sample variance with (n−1) in the
                denominator is unbiased; using n gives a biased estimate.
            </p>
            <p>
                The <strong>variance</strong> of an estimator measures how much it would vary across different
                samples:
            </p>
            <MathBlock tex="\text{Var}(\hat{\theta}) = \mathbb{E}[(\hat{\theta} - \mathbb{E}[\hat{\theta}])^2]" />
            <p>
                A good estimator has low bias AND low variance. This is the bias-variance tradeoff.
            </p>

            <h3>Confidence Intervals</h3>
            <p>
                A <strong>confidence interval</strong> doesn't give a single number — it gives a range
                that's likely to contain the true parameter. For a 95% CI: if we repeated the experiment
                many times, 95% of the computed intervals would contain the true value.
            </p>
            <MathBlock tex="\bar{x} \pm t_{\alpha/2, n-1} \cdot \frac{s}{\sqrt{n}}" />
            <p>
                where t is the critical value from the t-distribution with n−1 degrees of freedom.
                In ML, we report test accuracy as: accuracy ± margin of error at some confidence level.
            </p>

            <h3>Hypothesis Testing — is the difference real?</h3>
            <p>
                To compare two models, we set up a <strong>null hypothesis</strong> H₀: there is no
                difference (any observed difference is due to sampling noise). We compute a{" "}
                <strong>test statistic</strong> and ask: if H₀ were true, what's the probability of
                observing this statistic?
            </p>
            <ul>
                <li>p &lt; 0.05: "statistically significant" — reject H₀ at the 5% level</li>
                <li>p &lt; 0.01: "highly significant" — reject H₀ at the 1% level</li>
                <li>p ≥ 0.05: "not significant" — insufficient evidence to reject H₀</li>
            </ul>
            <p>
                In ML, we use paired t-tests or McNemar's test to compare classifiers on the same
                test set, and report p-values alongside accuracy numbers.
            </p>

            <h3>Type I and Type II Errors</h3>
            <ul>
                <li><strong>Type I error (α)</strong>: rejecting H₀ when it's actually true — false positive</li>
                <li><strong>Type II error (β)</strong>: failing to reject H₀ when it's false — false negative</li>
            </ul>
            <MathBlock tex="\text{Power} = 1 - \beta = P(\text{reject } H_0 | H_0 \text{ is false})" />
            <p>
                More power requires larger samples or bigger effect sizes. In ML benchmarks, we need
                enough test examples to have power to detect the minimum effect size we care about.
            </p>

            <div className="ch-callout">
                <strong>Connection to ML:</strong> Every model comparison is a hypothesis test. Every
                reported accuracy should come with a confidence interval. Regularisation is Bayesian
                shrinkage toward a prior. Understanding these ideas means understanding why training
                works, not just how to call the APIs.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Estimation theory, testing, and decision theory</h2>

            <DefBlock label="Definition — Point Estimator">
                An estimator θ̂ = g(X₁, ..., Xₙ) is a function of the observed data (a statistic) that
                produces a single-number estimate of the true parameter θ. Properties:
                <ul>
                    <li><strong>Unbiased</strong>: E[θ̂] = θ for all θ</li>
                    <li><strong>Consistent</strong>: θ̂ → θ as n → ∞</li>
                    <li><strong>Efficient</strong>: has minimum variance among unbiased estimators (Cramér-Rao bound)</li>
                </ul>
            </DefBlock>

            <h3>The Bias-Variance Decomposition of Error</h3>
            <p>
                For a regression problem with squared error loss, the expected test error decomposes:
            </p>
            <MathBlock tex="\mathbb{E}[(y - \hat{f}(x))^2] = \text{Bias}^2[\hat{f}] + \text{Var}[\hat{f}] + \sigma^2" />
            <p>
                where σ² is irreducible noise (aleatoric uncertainty). This is the fundamental tradeoff:
            </p>
            <ul>
                <li><strong>High bias</strong>: underfitting — model is too simple to capture the pattern</li>
                <li><strong>High variance</strong>: overfitting — model is too sensitive to training data</li>
            </ul>
            <p>
                Regularisation (L2 weight decay, dropout) adds bias to reduce variance. Early stopping
                does the same. This is why they improve generalisation even when they hurt training loss.
            </p>

            <h3>Confidence Intervals — the frequentist approach</h3>
            <p>
                A confidence interval [L, U] satisfies: P(L ≤ θ ≤ U) = 1 − α. For the mean of a normal
                distribution with unknown variance:
            </p>
            <MathBlock tex="\bar{X} \pm t_{n-1, \alpha/2} \cdot \frac{S}{\sqrt{n}}" />
            <p>
                In ML, we use bootstrapping for arbitrary estimators: resample the data B times,
                compute the estimator on each resample, and use the α/2 and 1−α/2 quantiles as the
                confidence interval endpoints.
            </p>

            <h3>Likelihood Ratio Test — optimal hypothesis testing</h3>
            <p>
                The Neyman-Pearson lemma states: for simple hypotheses, the Likelihood Ratio Test (LRT)
                is the most powerful test:
            </p>
            <MathBlock tex="\Lambda(x) = \frac{L(\theta_0 | x)}{L(\theta_1 | x)}" />
            <p>
                Reject H₀ if Λ(x) ≤ c for some threshold c. In ML, the LRT underlies Wald tests
                (based on parameter estimates) and Score tests (based on gradient of likelihood).
            </p>

            <h3>Bayesian Inference — updating a distribution over parameters</h3>
            <p>
                In Bayesian inference, parameters θ are random variables with a prior distribution
                p(θ). After observing data D, we update to the posterior using Bayes' rule:
            </p>
            <MathBlock tex="p(\theta | D) = \frac{p(D | \theta)\,p(\theta)}{p(D)} = \frac{\text{likelihood} \times \text{prior}}{\text{evidence}}" />
            <p>
                The <strong>posterior predictive distribution</strong> makes predictions by averaging over
                the posterior:
            </p>
            <MathBlock tex="p(y | x, D) = \int p(y | x, \theta)\,p(\theta | D)\,d\theta" />
            <p>
                This naturally incorporates uncertainty about parameters — unlike MLE which returns a
                single point estimate.
            </p>

            <h3>Bayes Risk and Decision Theory</h3>
            <p>
                Given a loss function L(θ, a) (cost of taking action a when true parameter is θ), the
                <strong>Bayes risk</strong> is:
            </p>
            <MathBlock tex="R(\delta) = \int L(\theta, \delta(\theta))\,p(\theta)\,d\theta" />
            <p>
                The <strong>Bayes estimator</strong> δ* minimises this risk. For squared error loss,
                the Bayes estimator is the posterior mean E[θ | D]. For 0-1 loss, it's the posterior
                mode (MAP).
            </p>

            <h3>Model Selection — AIC, BIC, and cross-validation</h3>
            <p>
                <strong>AIC</strong> (Akaike Information Criterion) balances fit vs complexity:
            </p>
            <MathBlock tex="\text{AIC} = -2\log L(\hat{\theta}) + 2k" />
            <p>
                <strong>BIC</strong> (Bayesian Information Criterion) adds a stronger penalty for complexity,
                derived from Bayesian model selection:
            </p>
            <MathBlock tex="\text{BIC} = -2\log L(\hat{\theta}) + k\log n" />
            <p>
                <strong>Cross-validation</strong> provides a non-parametric model selection criterion by
                estimating generalisation error through held-out folds. In ML, we almost always use
                CV for model selection rather than AIC/BIC because it makes no distributional assumptions.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> Regularisation is Bayesian decision theory. L2 regularisation
                adds a penalty −λ‖θ‖², which is equivalent to placing a Gaussian prior on θ and doing
                MAP estimation. Dropout approximates Bayesian model averaging over a distribution of
                sub-networks. Understanding these connections transforms regularisation from a hack
                into a principled design choice.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from scipy import stats

# ── Point estimation and bias-variance ─────────────────────────
np.random.seed(42)

true_mu, true_sigma = 5.0, 2.0
n_samples = 100
n_experiments = 1000

# Collect sample means from many experiments
sample_means = [
    np.random.normal(true_mu, true_sigma, n_samples).mean()
    for _ in range(n_experiments)
]
sample_means = np.array(sample_means)

print(f"True mean:              {true_mu}")
print(f"Average of sample means: {sample_means.mean():.4f}")  # ≈ true_mu (unbiased)
print(f"Std of sample means:     {sample_means.std():.4f}")   # ≈ sigma/sqrt(n)
print(f"Expected std:            {true_sigma / np.sqrt(n_samples):.4f}")

# ── Confidence intervals ───────────────────────────────────────
# 95% CI for the mean: x̄ ± t_{n-1, 0.025} * s/√n

data = np.random.normal(true_mu, true_sigma, n_samples)
x_bar = data.mean()
s = data.std(ddof=1)  # sample std with Bessel's correction
t_crit = stats.t.ppf(0.975, df=n_samples - 1)
margin = t_crit * s / np.sqrt(n_samples)

print(f"\\n95% CI for mean: [{x_bar - margin:.3f}, {x_bar + margin:.3f}]")
print(f"True mean {true_mu} is {'in' if true_mu >= x_bar - margin and true_mu <= x_bar + margin else 'OUT OF'} the interval")

# ── t-test: is this sample mean different from a hypothesised value?
# H0: mu = 5.0 (true value). Is our sample mean significantly different?
t_stat, p_value = stats.ttest_1samp(data, true_mu)
print(f"\\nt-test H0: mu = {true_mu}")
print(f"t-statistic: {t_stat:.4f}, p-value: {p_value:.4f}")
print(f"Conclusion: {'Reject H0' if p_value < 0.05 else 'Fail to reject H0'} at α=0.05")

# ── Comparing two models (two-sample t-test) ─────────────────
model_a_scores = np.array([0.82, 0.85, 0.79, 0.87, 0.84, 0.81, 0.83])
model_b_scores = np.array([0.78, 0.81, 0.75, 0.79, 0.77])

t_stat, p_value = stats.ttest_ind(model_a_scores, model_b_scores)
print(f"\\nTwo-sample t-test:")
print(f"Model A: {model_a_scores.mean():.4f} ± {model_a_scores.std(ddof=1):.4f}")
print(f"Model B: {model_b_scores.mean():.4f} ± {model_b_scores.std(ddof=1):.4f}")
print(f"t={t_stat:.3f}, p={p_value:.4f} ({'significant' if p_value < 0.05 else 'not significant'})")

# ── Paired t-test (better when comparing same test set) ─────────
# Simulate paired comparisons
np.random.seed(0)
n_test = 50
model_a_acc = 0.82 + 0.02 * np.random.randn(n_test)
model_b_acc = 0.80 + 0.02 * np.random.randn(n_test)

t_stat, p_value = stats.ttest_rel(model_a_acc, model_b_acc)
print(f"\\nPaired t-test (n={n_test}):")
print(f"Mean difference: {(model_a_acc - model_b_acc).mean():.4f}")
print(f"p-value: {p_value:.4f} ({'significant' if p_value < 0.05 else 'not significant'})")

# ── Bootstrap confidence interval ─────────────────────────────
# Non-parametric: doesn't assume any distribution
def bootstrap_ci(data, stat_fn=np.mean, n_bootstrap=10000, ci=0.95):
    """Compute bootstrap CI for any statistic."""
    stats = [stat_fn(np.random.choice(data, size=len(data), replace=True)))
             for _ in range(n_bootstrap)]
    alpha = (1 - ci) / 2
    return np.percentile(stats, [alpha * 100, (1 - alpha) * 100])

data = np.random.exponential(scale=2, size=100)
ci_mean = bootstrap_ci(data, np.mean)
ci_median = bootstrap_ci(data, np.median)

print(f"\\nBootstrap 95% CI:")
print(f"  Mean:   {ci_mean[0]:.3f} – {ci_mean[1]:.3f}")
print(f"  Median: {ci_median[0]:.3f} – {ci_median[1]:.3f}")

# ── Bayesian inference (conjugate normal) ─────────────────────
# Prior: p(mu) = Normal(mu_0, sigma_0²)
# Data: X_i ~ Normal(mu, sigma²) with known sigma
# Posterior: p(mu | data) = Normal(mu_n, sigma_n²)

mu_0, sigma_0 = 5.0, 2.0   # prior mean and std
sigma = 2.0                 # known data std
n = 20
data = np.random.normal(true_mu, sigma, n)  # observed data

x_bar = data.mean()
mu_n = (mu_0 / sigma_0**2 + n * x_bar / sigma**2) / (1 / sigma_0**2 + n / sigma**2)
sigma_n = np.sqrt(1 / (1 / sigma_0**2 + n / sigma**2))

print(f"\\nBayesian inference (Normal-Normal):")
print(f"Prior:     N({mu_0}, {sigma_0}²)")
print(f"Posterior: N({mu_n:.3f}, {sigma_n:.3f}²)")
print(f"True mu:   {true_mu}")`;

function PythonTab() {
    return (
        <>
            <p>
                SciPy for statistical tests and confidence intervals. NumPy for bias-variance
                demonstrations. These are the tools for rigorously comparing models and quantifying
                uncertainty — essential for responsible ML reporting.
            </p>
            <CodeBlock code={PY_CODE} filename="statistical_inference.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The t-test and bootstrap CI are the minimum standards
                for reporting model comparisons. Never report a single number without uncertainty
                estimates. The bootstrap works for any statistic — accuracy, F1, AUC — with no
                distributional assumptions.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const STATISTICAL_INFERENCE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
