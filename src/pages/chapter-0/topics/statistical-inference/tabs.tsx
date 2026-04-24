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
            impact: "Every A/B test, clinical trial, and model comparison uses the t-test when sample sizes are small. In ML, t-tests compare model performance with limited test sets or few training runs. Without Gosset, practitioners would report overconfident conclusions — exactly the statistical error behind many irreproducible ML benchmarks. This gap between 'best fit' and 'statistically confirmed' is what statistical inference is designed to close.",
        },
        {
            year: "1922 — Fisher — Maximum Likelihood & Significance",
            title: "Fitting models to data rigorously",
            challenge: "Scientists wanted a principled method for fitting models to data and quantifying how confident they should be. Existing methods (like method of moments) were ad-hoc. There was no unified framework for: (1) estimating parameters from data, (2) measuring how good the fit is, (3) deciding whether a model is 'true' or the data just looks that way by chance.",
            what: "Ronald Fisher developed Maximum Likelihood Estimation (MLE) as the unifying framework: choose parameters that maximise the probability of observing the data you got. He also formalised p-values and null hypothesis significance testing: compute the probability of observing data this extreme if the null hypothesis were true — if p < 0.05, call it statistically significant.",
            impact: "MLE is the foundation of every trained ML model. Cross-entropy loss equals minimising negative log-likelihood. Perplexity is the exponentiated average negative log-likelihood. Fisher's significance framework is how the field decides what is a real result versus noise. But Fisher measured how much data supports a specific hypothesis. Shannon (1948) went further and asked: how much information does the data contain, independent of any hypothesis? That shift — from likelihood to information — is the bridge to our next topic.",
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
            impact: "Wald's framework is the precise mathematical language for model selection, regularisation, and RLHF alignment. L2 regularisation adds a Gaussian prior penalty; choosing its strength λ is choosing the prior variance — a decision-theoretic choice. RLHF's KL penalty constrains how far the policy moves from the reference model — a Wald-style bound on decision cost. Statistical inference completes the mathematical toolkit from probability and linear algebra. The next question is deeper: how do we measure the information content of data itself, independent of any model or hypothesis? That is entropy.",
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

            <p className="ch-story-intro">
                SVD and least squares find the best-fitting patterns in data. But "best fit on the data I saw" doesn't mean "real pattern in the world." What if the pattern was a coincidence — a fluke of the specific examples I happened to use? Statistical inference is how we tell the difference.
            </p>

            <Analogy label="Sample mean vs true mean">
                You want to know the average height of all teenagers in your city, but you can't measure everyone. So you pick 100 at random and compute the average. Your <strong>sample mean</strong> is an estimate — but never exactly right. There is always some error from random sampling.
                <br /><br />
                In ML, we split data into train and test sets. The model's test performance is a sample estimate of true generalisation. The gap between training accuracy and test accuracy is exactly this sampling error — and understanding it is the whole point of statistical inference.
            </Analogy>

            <Analogy label="Confidence interval = estimate plus honest uncertainty">
                Instead of "the average height is 170 cm," say "I'm 95% confident it's between 168 and 172 cm." That <strong>confidence interval</strong> tells you not just the estimate but how uncertain you should be. A wider interval means less certainty.
                <br /><br />
                In ML, reporting test accuracy as "82.3% ± 1.4%" is far more honest than just "82.3%." The ± comes from statistical inference, and leaving it out is one of the ways benchmark results mislead.
            </Analogy>

            <Analogy label="Statistical significance = unlikely to be a coincidence">
                You flip a coin 10 times and get 8 heads. Is the coin biased? Not necessarily — a fair coin does this about 5.5% of the time. <strong>Statistical significance</strong> quantifies the doubt: if p = 0.055, that means "if the coin were fair, you'd see this result 5.5% of the time." Small p = strong evidence against coincidence.
                <br /><br />
                In ML, "Model A beats Model B with p = 0.003" means: if they were truly equal, there's only a 0.3% chance of seeing this big a gap by random test-set sampling. That's strong evidence the difference is real.
            </Analogy>

            <Analogy label="Bias-variance tradeoff = underfitting vs overfitting">
                A model that predicts "50%" for everyone is <strong>biased</strong> — systematically wrong in the same direction. A model that memorises every training example is <strong>high variance</strong> — it changes wildly if you swap in different training data.
                <br /><br />
                The fundamental theorem of statistical learning: total error = bias² + variance + irreducible noise. Making the model more complex reduces bias but increases variance. The best model finds the sweet spot — and statistical inference gives us the tools to measure where that sweet spot is.
            </Analogy>

            <Analogy label="What comes next — measuring information itself">
                Statistical inference tells us whether a learned pattern is real. But there's a deeper question underneath: how much <em>information</em> does the data actually contain — regardless of what patterns we're looking for? Shannon (1948) answered this with the concept of entropy. And entropy turns out to be the foundation of every loss function in modern deep learning.
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
import torch
from scipy import stats

# ── 1. Point estimation — NumPy + SciPy baseline ─────────────────────────
np.random.seed(42)
true_mu, sigma, n = 5.0, 2.0, 100
data_np = np.random.normal(true_mu, sigma, n)

x_bar  = data_np.mean()
s      = data_np.std(ddof=1)
t_crit = stats.t.ppf(0.975, df=n - 1)
margin = t_crit * s / np.sqrt(n)
print(f"[SciPy]  95% CI: [{x_bar - margin:.3f}, {x_bar + margin:.3f}]  (true μ={true_mu})")

t_stat, p_val = stats.ttest_1samp(data_np, true_mu)
print(f"         t-test p={p_val:.4f}  → {'fail to reject H₀' if p_val > 0.05 else 'reject H₀'}")

# ── 2. Two-sample t-test — comparing two models ──────────────────────────
print("\\n[Model comparison] two-sample t-test")

model_a = np.array([0.82, 0.85, 0.79, 0.87, 0.84, 0.81, 0.83])
model_b = np.array([0.78, 0.81, 0.75, 0.79, 0.77])
t_stat, p_val = stats.ttest_ind(model_a, model_b)
print(f"  A: {model_a.mean():.4f} ± {model_a.std(ddof=1):.4f}")
print(f"  B: {model_b.mean():.4f} ± {model_b.std(ddof=1):.4f}")
print(f"  p={p_val:.4f}  → {'significant' if p_val < 0.05 else 'not significant'} at α=0.05")

# ── 3. PyTorch bootstrap — 10 000 resamples, no Python loop ──────────────
print("\\n[Bootstrap] vectorised with PyTorch — 10k resamples, no Python loop")

torch.manual_seed(0)
data   = torch.tensor(data_np, dtype=torch.float32)
n_boot = 10_000

idx          = torch.randint(0, n, (n_boot, n))   # (n_boot, n) indices
resamples    = data[idx]                           # (n_boot, n) — all resamples at once
boot_means   = resamples.mean(dim=1)              # (n_boot,)

lo, hi = torch.quantile(boot_means, torch.tensor([0.025, 0.975]))
print(f"  Bootstrap 95% CI: [{lo:.3f}, {hi:.3f}]  (n_boot={n_boot:,})")
print(f"  Bootstrap SE: {boot_means.std():.4f}  (σ/√n = {sigma/n**0.5:.4f})")

# Any statistic — just change .mean() to .median(), .std(), ...
boot_med = resamples.median(dim=1).values
lo_m, hi_m = torch.quantile(boot_med, torch.tensor([0.025, 0.975]))
print(f"  Bootstrap 95% CI (median): [{lo_m:.3f}, {hi_m:.3f}]")

# ── 4. Paired comparison — batched over many test sets ───────────────────
print("\\n[Paired bootstrap] 500 test sets simultaneously")

torch.manual_seed(1)
n_sets, n_test = 500, 50
acc_A = 0.82 + 0.03 * torch.randn(n_sets, n_test)
acc_B = 0.80 + 0.03 * torch.randn(n_sets, n_test)
diffs = (acc_A - acc_B).mean(dim=1)              # (500,)
sig_rate = (diffs.abs() > 0.01).float().mean()
print(f"  Mean Δ: {diffs.mean():.4f} ± {diffs.std():.4f}")
print(f"  {sig_rate*100:.1f}% of test sets show |Δ| > 0.01")

# ── 5. Bayesian update — conjugate Gaussian ───────────────────────────────
print("\\n[Bayesian] conjugate normal update")

mu_0, sigma_0, sigma_lik = 5.0, 2.0, 2.0
data_pt = torch.normal(torch.full((n,), true_mu), torch.tensor(sigma_lik))
x_bar_pt = data_pt.mean()

prec_0  = 1 / sigma_0**2
prec_n  = prec_0 + n / sigma_lik**2
mu_n    = (prec_0 * mu_0 + (n / sigma_lik**2) * x_bar_pt) / prec_n
sigma_n = prec_n**-0.5
print(f"  Prior:     N({mu_0}, {sigma_0}²)")
print(f"  Posterior: N({mu_n:.3f}, {sigma_n:.3f}²)  (true μ={true_mu})")`

function PythonContent() {
    return (
        <>
            <p>
                SciPy for parametric tests, PyTorch for vectorised bootstrap — 10 000 resamples
                with a single index operation, no Python loop, any statistic.
            </p>
            <CodeBlock code={PY_CODE} filename="statistical_inference.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The bootstrap CI is the gold standard for reporting
                model comparisons — it works for any statistic (accuracy, F1, AUC) with no
                distributional assumption. PyTorch vectorises all <code>n_boot</code> resamples
                as a single matrix index operation, making 10 k iterations nearly free.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const STATISTICAL_INFERENCE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
