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
            year: "1908",
            title: "Gosset — The t-Distribution and Small-Sample Statistics",
            challenge:
                "By 1908, Pearson's correlation and regression were powerful — but they assumed large samples. William Sealy Gosset, a chemist at the Guinness Brewery in Dublin, faced a problem Pearson had never encountered: he needed to decide whether a new barley variety produced better beer from just five or six experimental batches. The normal distribution tables Pearson relied on required dozens of observations for accuracy. With only a handful of samples, confidence intervals based on the normal approximation were badly miscalibrated — they were too narrow, making differences appear significant when they weren't. Guinness forbade employees from publishing proprietary methods, so Gosset published under the pseudonym 'Student'.",
            what:
                "Gosset derived the t-distribution: a family of bell-shaped curves with heavier tails than the normal distribution, indexed by degrees of freedom n minus 1. For small n the tails are very heavy, reflecting high uncertainty, and as n approaches infinity the t-distribution converges to the standard normal. He showed that the test statistic t = (x-bar minus mu) divided by (s divided by square-root-n) follows this distribution exactly when the data are normally distributed, regardless of the unknown population standard deviation. This provided valid confidence intervals and hypothesis tests for any sample size, not just large ones.",
            impact:
                "The t-test is used in every A/B test, clinical trial, and model comparison where sample sizes are limited. In machine learning, when a researcher reports that model A outperforms model B with p = 0.02 on a test set of 500 examples, they are applying Gosset's 1908 insight. The deeper lesson: PCA finds patterns in data, but confidence intervals tell you how much to trust those patterns given the sample you actually collected. Small test sets produce unreliable benchmark rankings — a problem that plagues machine learning even today.",
        },
        {
            year: "1922 – 1935",
            title: "Fisher — Maximum Likelihood, p-Values, and ANOVA",
            challenge:
                "Correlation measured association, regression fit lines, PCA compressed data — but there was no unified framework for fitting models to data, choosing among competing models, and deciding whether an observed difference was genuine. Ronald Fisher, working at the Rothamsted agricultural research station, needed to compare crop yields across dozens of experimental plots while simultaneously accounting for soil variation, seasonal effects, and measurement error. His experiments often had very large numbers of comparisons, making ad-hoc testing unreliable.",
            what:
                "Fisher introduced three foundational ideas. First, Maximum Likelihood Estimation (1922): choose model parameters that maximise the probability of observing the data you saw. This unified all parameter estimation — OLS, logistic regression, Poisson regression — under one principle. Second, the p-value and null hypothesis significance testing (1925): compute the probability that a test statistic at least as extreme as observed would occur if the null hypothesis were true; reject the null if p is less than 0.05. Third, Analysis of Variance (1925): decompose total variation into within-group and between-group components to compare multiple means simultaneously without inflating the false positive rate.",
            impact:
                "MLE is the foundation of every trained machine learning model. Cross-entropy loss equals minimising negative log-likelihood under a Bernoulli or categorical distribution. Mean squared error equals minimising negative log-likelihood under a Gaussian distribution. Fisher's insight that 'fitting a model' and 'maximising likelihood' are the same thing is the deepest unifying principle of statistical machine learning — and it bridges directly to the logistic regression model we will study next.",
        },
        {
            year: "1933",
            title: "Neyman and Pearson — Decision Theory and Error Control",
            challenge:
                "Fisher's significance testing had a fundamental flaw: the p-value tells you how surprising your data is under the null hypothesis, but it does not tell you how to trade off false positives against false negatives. A pharmaceutical company needs to control both simultaneously: declaring an ineffective drug effective (Type I error) harms patients; declaring an effective drug ineffective (Type II error) denies patients treatment. Fisher's framework had no mechanism for setting these rates in advance of an experiment.",
            what:
                "Jerzy Neyman and Egon Pearson formalised hypothesis testing as a decision problem with two explicit error types. Type I error (alpha): the probability of rejecting a true null hypothesis, set before the experiment. Type II error (beta): the probability of failing to reject a false null hypothesis, which decreases as sample size increases. Power = 1 minus beta is the probability of correctly detecting a real effect. They proved the Neyman-Pearson lemma: among all tests with Type I error at most alpha, the Likelihood Ratio Test achieves the maximum power. This is the most powerful test that can be constructed.",
            impact:
                "Every controlled experiment and clinical trial sets alpha before running — this is the 'design principle' Neyman-Pearson introduced. In machine learning, the choice between two models is implicitly a hypothesis test about generalisation. Multiple comparisons — testing hundreds of hyperparameter configurations — requires Bonferroni correction or similar adjustments derived from the Neyman-Pearson framework. The distinction between Type I and Type II errors is the mathematical foundation for precision-recall tradeoffs in classifier evaluation.",
        },
        {
            year: "1956",
            title: "Wald — Statistical Decision Theory",
            challenge:
                "Point estimation, interval estimation, hypothesis testing, and prediction all seemed like separate problems requiring separate methods. There was no single mathematical framework that could specify what it means to make an 'optimal' choice under uncertainty about the true state of the world, or connect the choice of loss function to the optimal estimator.",
            what:
                "Abraham Wald unified all of statistics under decision theory. Every statistical problem is a decision problem: choose an action from a set of available actions to minimise expected loss under uncertainty. The Bayes risk minimises expected loss averaged over a prior distribution on the parameter. The minimax risk minimises worst-case expected loss over all possible parameter values. Wald showed that every admissible decision rule (one that can't be uniformly improved upon) is a Bayes rule for some prior — connecting frequentist and Bayesian statistics.",
            impact:
                "Wald's framework is the mathematical language of regularisation and model selection. L2 weight decay (ridge regression) adds a Gaussian prior and computes the MAP estimate — Wald's Bayes risk with squared error loss. L1 regularisation corresponds to a Laplace prior. RLHF's KL-divergence penalty on language model outputs is a minimax bound on decision cost. Every regularisation technique in modern deep learning is a Wald decision rule in disguise.",
        },
        {
            year: "1979",
            title: "Efron — The Bootstrap and Computational Inference",
            challenge:
                "Many estimators — cross-validated error rates, ensemble model predictions, complex nonlinear statistics — had no tractable closed-form sampling distribution. The t-distribution and normal approximations applied only to simple cases. When a researcher trains a random forest and wants a confidence interval on its test accuracy, there is no formula to apply.",
            what:
                "Bradley Efron introduced the bootstrap: sample n observations with replacement from the n-observation dataset, compute the statistic on the resample, and repeat B times (typically B = 1000-10000). The distribution of the statistic across bootstrap samples approximates its true sampling distribution. This works for virtually any statistic — means, medians, regression coefficients, cross-validated accuracy, AUC — without any distributional assumptions.",
            impact:
                "The bootstrap made valid statistical inference available to the entire modern machine learning toolkit. Confidence intervals on benchmark metrics, variance estimation for ensemble models, and uncertainty quantification in neural network predictions all rely on bootstrap or bootstrap-like resampling. The computational feasibility of the bootstrap — which requires many model evaluations — was impractical in 1979 but routine today. It is the primary tool for honest uncertainty quantification in empirical ML research.",
        },
        {
            year: "1995 – present",
            title: "Multiple Testing, False Discovery Rate, and the Reproducibility Crisis",
            challenge:
                "Modern machine learning research compares hundreds of model variants. Genomics studies test associations for 20,000 genes simultaneously. Any study with many comparisons will produce many false positives at p less than 0.05 by chance alone — roughly 5% of all tests when the null hypothesis is true. The Bonferroni correction (require p less than 0.05 divided by the number of tests) is too conservative when testing thousands of hypotheses.",
            what:
                "Benjamini and Hochberg (1995) introduced the False Discovery Rate (FDR): control the expected fraction of rejected hypotheses that are false positives, rather than controlling the probability of any false positive. An FDR of 5% means that among all the comparisons you call significant, 5% are expected to be wrong — a much more sensible criterion for exploratory research with many tests. The BH procedure is provably valid under certain dependence conditions and widely used in genomics, neuroscience, and machine learning benchmarking.",
            impact:
                "The reproducibility crisis in science — where published results frequently fail to replicate — is partly a statistical inference crisis. Machine learning is not immune: many benchmark improvements are within the noise of test-set sampling variance. Proper use of confidence intervals, paired tests, and FDR control is essential for honest claims about model improvements. Understanding statistical inference is not just mathematics — it is the foundation of scientific integrity in empirical ML research.",
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
            <h2>Is this pattern real, or just lucky?</h2>

            <p className="ch-story-intro">
                Pearson's correlation told us how strongly two things move together, and PCA found the hidden directions of maximum variation. But there is a trap: if you look at enough correlations, some will appear just by chance. Measure 50 things per person and you have 1,225 pairs to check — roughly 61 of those will look significant at the 5% level purely by luck, even if nothing is actually related to anything else. Statistical inference is the science of telling real patterns from lucky coincidences.
            </p>

            <Analogy label="Sample mean vs true mean — we can never know exactly">
                You want to know the average height of teenagers in your city, but you can only measure 100 of them. Your <strong>sample mean</strong> is an estimate — always a little off from the true answer. There is always some error from random sampling, and with a different 100 students you'd get a slightly different answer.
                <br /><br />
                In machine learning, we split data into train and test sets and measure how well the model does on the test set. That test accuracy is a sample estimate of true generalisation — it is never perfectly accurate. With a test set of 500 examples, the accuracy could easily be 1-2% higher or lower just by the luck of which examples ended up in the test set.
            </Analogy>

            <Analogy label="Confidence interval — estimate plus honest uncertainty">
                Instead of saying "the average height is 170 cm," a statistician says "I am 95% confident it is between 168 and 172 cm." That <strong>confidence interval</strong> tells you not just the estimate but how uncertain you should be about it.
                <br /><br />
                In machine learning, reporting test accuracy as "82.3% plus or minus 1.4%" is far more honest than just "82.3%." The plus or minus comes from statistical inference. Omitting it is one of the main ways benchmark results mislead the field — a model claiming 82.3% versus another claiming 81.9% is very likely just noise when test sets are small.
            </Analogy>

            <Analogy label="p-value — how surprised should you be?">
                You flip a coin 10 times and get 8 heads. Is the coin biased? Maybe — a fair coin does this about 5.5% of the time. The <strong>p-value</strong> is exactly that probability: if the null hypothesis (fair coin) were true, how often would you see a result at least this extreme just by chance?
                <br /><br />
                In machine learning, "model A beats model B with p = 0.003" means: if they were truly equally good, there is only a 0.3% chance of seeing this large a gap by random test-set sampling. That is strong evidence the difference is real — but even then, 0.3% of tests will be false positives if you test hundreds of pairs.
            </Analogy>

            <Analogy label="Maximum Likelihood — the unifying principle">
                Fisher had a beautiful idea: choose the parameters that make your observed data as probable as possible. If you see 70 heads in 100 flips, the MLE of the coin's bias is 0.70 — because p = 0.70 makes seeing exactly 70 heads more probable than any other value of p.
                <br /><br />
                Every neural network in this course does exactly this, just at enormous scale. The cross-entropy loss that networks minimise is the negative log-likelihood — the exact quantity Fisher proposed maximising in 1922. Training a neural network and maximising likelihood are mathematically the same thing.
            </Analogy>

            <Analogy label="Type I and Type II errors — the two ways to be wrong">
                When testing whether a drug works, there are two distinct ways to err. A <strong>Type I error</strong> (false positive) means declaring the drug works when it doesn't — potentially giving patients a useless treatment. A <strong>Type II error</strong> (false negative) means declaring the drug doesn't work when it does — denying patients an effective treatment.
                <br /><br />
                These two error types trade off against each other. If you set the evidence bar very high (require p less than 0.001), you make fewer Type I errors but more Type II errors. If you set the bar low (require p less than 0.1), the reverse. Neyman and Pearson (1933) formalised this tradeoff and showed you have to decide in advance — before seeing the data — how to balance them.
            </Analogy>

            <Analogy label="What comes next — predicting categories, not numbers">
                Regression predicts a continuous number (house price, temperature). But many real problems ask for a category: spam or not spam? Cancer or benign? Dog or cat? The first classification model — logistic regression — uses the sigmoid function to squeeze Fisher's likelihood principle into a probability between 0 and 1. It is also the last piece of the classical statistical toolkit before the story of neural networks begins.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From sample to population — the formal framework</h2>

            <h3>Point Estimation and MLE</h3>
            <p>
                A <strong>point estimator</strong> theta-hat = g(X<sub>1</sub>,...,X<sub>n</sub>) estimates the true parameter theta. The Maximum Likelihood Estimator chooses theta to maximise the probability of the observed data:
            </p>
            <MathBlock tex="\hat{\theta}_{\text{MLE}} = \arg\max_\theta \prod_{i=1}^n p(x_i \mid \theta) = \arg\max_\theta \sum_{i=1}^n \log p(x_i \mid \theta)" />
            <p>
                The log-sum form is numerically stable and turns products into sums. For Gaussian noise (epsilon distributed as N(0, sigma-squared)), maximising log-likelihood of y = X-beta + epsilon is identical to minimising mean-squared error — connecting Fisher's framework directly to Gauss's 1801 least squares.
            </p>

            <h3>Confidence Intervals</h3>
            <p>
                A 95% confidence interval [L, U] satisfies P(L is less than or equal to theta is less than or equal to U) = 0.95. For the sample mean with unknown variance, use Student's t-distribution:
            </p>
            <MathBlock tex="\bar{X} \pm t_{n-1,\, 0.025} \cdot \frac{S}{\sqrt{n}}" />
            <p>
                where t(n minus 1, 0.025) is the critical value from the t-distribution with n minus 1 degrees of freedom. As n approaches infinity, this converges to plus or minus 1.96 times sigma divided by square-root-n (the normal approximation).
            </p>

            <h3>Hypothesis Testing</h3>
            <p>
                Set up H<sub>0</sub> (null hypothesis) and H<sub>1</sub> (alternative). Compute a test statistic. The p-value is P(test statistic is at least as extreme as observed, given H<sub>0</sub> is true). Reject H<sub>0</sub> if p is less than alpha. Two fundamental error types:
            </p>
            <MathBlock tex="\text{Type I}: P(\text{reject } H_0 \mid H_0 \text{ true}) = \alpha \quad \text{Type II}: P(\text{fail to reject} \mid H_1 \text{ true}) = \beta" />
            <p>
                Power = 1 minus beta. Increasing sample size increases power for any fixed effect size and fixed alpha.
            </p>

            <h3>The Bias-Variance Decomposition</h3>
            <p>
                For any estimator theta-hat, the mean squared error decomposes into bias and variance:
            </p>
            <MathBlock tex="\text{MSE}(\hat{\theta}) = \text{Bias}^2(\hat{\theta}) + \text{Var}(\hat{\theta})" />
            <p>
                This is the bias-variance tradeoff. Ridge regression adds bias (shrinks coefficients toward zero) to dramatically reduce variance — overall lowering MSE despite being technically biased. This is the mathematical justification for regularisation in all of machine learning.
            </p>

            <h3>Bayesian Inference</h3>
            <p>
                The Bayesian alternative treats theta as a random variable with a prior p(theta). Observing data D updates it via Bayes' theorem:
            </p>
            <MathBlock tex="p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta) \, p(\theta)}{p(\mathcal{D})}" />
            <p>
                MAP (Maximum A Posteriori) estimation chooses the posterior mode — equivalent to MLE with a regularisation penalty equal to negative log p(theta). L2 regularisation (weight decay) is MAP with a Gaussian prior. L1 regularisation is MAP with a Laplace prior.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The grand unification:</strong> Gauss (1801) minimised squared error. Fisher (1922) showed this equals maximising Gaussian log-likelihood. Neyman-Pearson (1933) turned model comparison into a decision problem. Wald (1956) showed regularisation equals Bayesian MAP. Every ML training loop is this chain applied at scale. The next algorithm — logistic regression — applies the same MLE principle to classification, completing the classical statistical toolkit.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Fisher information · Cramer-Rao bound · Bayesian posteriors</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Bootstrap · t-tests · confidence intervals · MLE</span>
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
            <h2>Formal Inference Theory</h2>

            <DefBlock label="Key Formulas at a Glance">
                MLE: theta-hat = argmax sum of log p(x-i given theta)<br />
                Ridge = MLE + Gaussian prior: argmin norm(y minus X-beta) squared + lambda times norm(beta) squared<br />
                Lasso = MLE + Laplace prior: argmin norm(y minus X-beta) squared + lambda times norm(beta) one<br />
                t-statistic: t = (x-bar minus mu-zero) divided by (s divided by square-root-n) distributed as t(n minus 1) under H<sub>0</sub><br />
                95% CI: x-bar plus or minus t(n minus 1, 0.025) times s divided by square-root-n
            </DefBlock>

            <h3>Fisher Information and the Cramer-Rao Bound</h3>
            <p>
                The Fisher information quantifies how much a single observation tells you about theta:
            </p>
            <MathBlock tex="\mathcal{I}(\theta) = \mathbb{E}\!\left[\left(\frac{\partial \log p(X\mid\theta)}{\partial \theta}\right)^{\!2}\right] = -\mathbb{E}\!\left[\frac{\partial^2 \log p(X\mid\theta)}{\partial \theta^2}\right]" />
            <p>
                The Cramer-Rao lower bound states that no unbiased estimator can have variance less than 1 divided by (n times the Fisher information). The MLE achieves this bound asymptotically — it is the most efficient unbiased estimator for large samples.
            </p>
            <MathBlock tex="\text{Var}(\hat{\theta}) \geq \frac{1}{n \mathcal{I}(\theta)}" />

            <h3>Bootstrap Confidence Intervals</h3>
            <p>
                For an estimator theta-hat with no known closed-form distribution: draw B bootstrap samples by sampling n observations with replacement, compute theta-hat<sub>b</sub> on each, and use the empirical distribution:
            </p>
            <MathBlock tex="\text{CI}_{95\%}: \left[\hat{\theta}^*_{(0.025)},\; \hat{\theta}^*_{(0.975)}\right]" />
            <p>
                where the asterisk denotes quantiles of the bootstrap distribution. The bootstrap is consistent — it converges to the true sampling distribution as n approaches infinity for smooth statistics.
            </p>

            <h3>False Discovery Rate</h3>
            <p>
                When testing m hypotheses simultaneously, define the False Discovery Rate as:
            </p>
            <MathBlock tex="\text{FDR} = \mathbb{E}\!\left[\frac{V}{\max(R, 1)}\right]" />
            <p>
                where V is the number of false rejections and R is the total number of rejections. The Benjamini-Hochberg procedure controls FDR at level q: sort p-values p<sub>(1)</sub> less than or equal to ... less than or equal to p<sub>(m)</sub>, and reject H<sub>(i)</sub> for all i less than or equal to k, where k = max i such that p<sub>(i)</sub> is at most i times q divided by m. Unlike Bonferroni (which controls FWER), BH is far less conservative for large-scale testing.
            </p>

            <div className="ch-callout">
                <strong>ML relevance:</strong> Every hyperparameter search over hundreds of configurations is a multiple testing problem. Reporting the best configuration without correction inflates the Type I error rate dramatically. Proper reporting requires accounting for the number of configurations tested — either via corrections or by holding out a final test set that is never used during search.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from scipy import stats

np.random.seed(42)

# ── MLE for a Gaussian ──────────────────────────────────────────────────────
# True parameters: mu = 5, sigma = 2
data = np.random.normal(loc=5, scale=2, size=50)

mu_mle = data.mean()
sigma_mle = data.std(ddof=0)    # MLE uses n in denominator
print(f"MLE mu: {mu_mle:.3f}  (true: 5.000)")
print(f"MLE sigma: {sigma_mle:.3f}  (true: 2.000)")

# ── t-test ─────────────────────────────────────────────────────────────────
# Is the sample mean significantly different from 4.5?
t_stat, p_value = stats.ttest_1samp(data, popmean=4.5)
print(f"\\nt-test: t = {t_stat:.3f}, p = {p_value:.4f}")
print("Reject H0 (mu != 4.5):", p_value < 0.05)

# 95% confidence interval for the mean
n = len(data)
se = data.std(ddof=1) / np.sqrt(n)
t_crit = stats.t.ppf(0.975, df=n - 1)
ci_low = mu_mle - t_crit * se
ci_high = mu_mle + t_crit * se
print(f"95% CI for mu: ({ci_low:.3f}, {ci_high:.3f})")

# ── Bootstrap confidence interval ─────────────────────────────────────────
B = 10_000
bootstrap_means = np.array([
    np.random.choice(data, size=n, replace=True).mean()
    for _ in range(B)
])
boot_ci = np.percentile(bootstrap_means, [2.5, 97.5])
print(f"Bootstrap 95% CI: ({boot_ci[0]:.3f}, {boot_ci[1]:.3f})")

# ── Two-sample t-test (model comparison) ──────────────────────────────────
# Simulating test accuracy across 20 evaluation runs for two models
model_a = np.random.normal(0.82, 0.02, 20)
model_b = np.random.normal(0.80, 0.02, 20)

t2, p2 = stats.ttest_rel(model_a, model_b)   # paired test
print(f"\\nModel A vs B: t = {t2:.3f}, p = {p2:.4f}")
print(f"Model A mean: {model_a.mean():.4f}")
print(f"Model B mean: {model_b.mean():.4f}")
if p2 < 0.05:
    print("Statistically significant difference (p < 0.05)")
else:
    print("No significant difference — could be noise")

# ── False Discovery Rate (Benjamini-Hochberg) ─────────────────────────────
# Simulating 100 hypothesis tests, 10 truly non-null
p_values = np.concatenate([
    np.random.uniform(0, 0.01, 10),   # truly significant (small p)
    np.random.uniform(0, 1.0, 90),    # null hypotheses (uniform p)
])

def bh_correction(p_vals, q=0.05):
    m = len(p_vals)
    sorted_idx = np.argsort(p_vals)
    sorted_p = p_vals[sorted_idx]
    threshold = np.arange(1, m + 1) * q / m
    below = sorted_p <= threshold
    if not below.any():
        return np.zeros(m, dtype=bool)
    k = np.where(below)[0][-1]
    rejected = np.zeros(m, dtype=bool)
    rejected[sorted_idx[:k + 1]] = True
    return rejected

rejected = bh_correction(p_values, q=0.05)
print(f"\\nBH FDR correction: {rejected.sum()} hypotheses rejected at FDR=5%")`

function PythonContent() {
    return (
        <>
            <p>
                Scipy provides t-tests and bootstrap sampling. The Benjamini-Hochberg procedure for controlling the False Discovery Rate is implemented from scratch to show the mechanism. The model comparison example illustrates why paired tests matter when comparing two ML models evaluated on the same test splits.
            </p>
            <CodeBlock code={PY_CODE} filename="statistical_inference.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Always use paired tests when comparing two models on the same dataset — the within-sample correlation dramatically reduces the variance of the difference and increases power. Reporting a single accuracy number without confidence intervals is statistically meaningless for small test sets.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const STATISTICAL_INFERENCE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
