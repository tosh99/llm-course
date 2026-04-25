import { Analogy, DefBlock, MathBlock } from "../../shared"
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
                "By 1908 Pearson's correlation and regression were powerful — but they assumed large samples. William Sealy Gosset, a chemist at the Guinness Brewery in Dublin, faced a problem Pearson had not: he needed to decide whether a new barley variety produced better beer from just a handful of experimental batches. The normal distribution tables Pearson relied on required dozens of observations to give accurate results; Gosset had five or six. He published under the pseudonym 'Student' because Guinness forbade employees from publishing proprietary methods.",
            what:
                "Gosset derived the t-distribution: a family of bell-shaped curves heavier in the tails than the normal, indexed by degrees of freedom n−1. For small n the tails are very heavy (high uncertainty), and as n → ∞ the t-distribution converges to the standard normal. He showed that the test statistic t = (x̄ − μ) / (s/√n) follows this distribution exactly when the data are normally distributed, providing valid confidence intervals and hypothesis tests for any sample size.",
            impact:
                "The t-test is used in every A/B test, clinical trial, and model comparison where sample sizes are limited. In machine learning, when a researcher reports that model A outperforms model B with p = 0.02 on a test set of 500 examples, they are applying Gosset's 1908 insight. The deeper lesson: PCA finds patterns in data, but confidence intervals tell you how much to trust those patterns given the sample you actually had.",
        },
        {
            year: "1922 – 1935",
            title: "Fisher — Maximum Likelihood, Significance Testing, and ANOVA",
            challenge:
                "Correlation measured association, regression fit lines, PCA compressed data — but there was no unified framework for fitting models to data and deciding whether the fit was genuine. Ronald Fisher, working at the Rothamsted agricultural research station, needed to compare crop yields across dozens of experimental plots while accounting for soil variation, seasonal effects, and measurement error.",
            what:
                "Fisher introduced three foundational ideas. First, Maximum Likelihood Estimation (MLE, 1922): choose model parameters that maximise the probability of observing the data you saw. Second, the p-value and null hypothesis testing (1925): compute the probability that a test statistic at least as extreme as observed would occur if the null hypothesis were true; call the result 'statistically significant' if p < 0.05. Third, Analysis of Variance (ANOVA, 1925): decompose total variation into within-group and between-group components to compare multiple means simultaneously without inflating false positive rates.",
            impact:
                "MLE is the foundation of every trained machine learning model. Cross-entropy loss equals minimising negative log-likelihood under a Bernoulli or categorical distribution. Mean squared error equals minimising negative log-likelihood under a Gaussian distribution. Fisher's insight that 'fitting a model' and 'maximising likelihood' are the same thing is the deepest unifying principle of statistical machine learning — and it bridges directly to the logistic regression model we will study next.",
        },
        {
            year: "1933",
            title: "Neyman & Pearson — Decision Theory and Error Control",
            challenge:
                "Fisher's significance testing had a flaw: the p-value tells you how surprising your data is under H₀, but it doesn't tell you how to trade off false positives against false negatives. A pharmaceutical company needs to control both: declaring an ineffective drug effective (Type I error) harms patients; declaring an effective drug ineffective (Type II error) denies patients treatment. Fisher's framework provided no way to set these rates in advance.",
            what:
                "Jerzy Neyman and Egon Pearson formalised hypothesis testing as a decision problem with two explicit error rates: α (Type I error: false positive rate, set before the experiment) and β (Type II error: false negative rate, which decreases as sample size increases). They proved the Neyman-Pearson lemma: the Likelihood Ratio Test is the most powerful test for any given α. Power = 1 − β is the probability of correctly detecting a real effect.",
            impact:
                "Every controlled experiment sets α before running — this is the 'design principle' Neyman-Pearson introduced. In machine learning, when a practitioner says 'we run 1,000 hyperparameter experiments and accept only those with p < 0.001 to control the family-wise error rate', they are applying this framework. It also shapes how ML practitioners think about model selection: the choice between two models is a hypothesis test about generalisation.",
        },
        {
            year: "1956",
            title: "Wald — Statistical Decision Theory",
            challenge:
                "Estimation, hypothesis testing, and prediction all seemed like separate problems with separate methods. There was no single framework that could handle all of them, specify what it meant to make an 'optimal' choice, and connect statistical uncertainty to practical decisions.",
            what:
                "Abraham Wald unified statistics under decision theory. Every statistical problem is a decision problem: choose an action from a set of available actions to minimise the expected loss under uncertainty about the true state of the world. Point estimation, interval estimation, hypothesis testing, and prediction are all special cases. The Bayes risk minimises expected loss averaged over a prior distribution. The minimax risk minimises worst-case expected loss. MLE, MAP estimation, and Bayes estimators are all Wald-optimal under different loss functions and priors.",
            impact:
                "Wald's framework is the mathematical language of regularisation and model selection. L2 weight decay (ridge regression) adds a Gaussian prior and computes the MAP estimate — Wald's Bayes risk with squared error loss. RLHF's KL-divergence penalty on language model outputs constrains how far the policy moves from a reference — a minimax bound on decision cost. With statistical inference in hand, the final piece of the statistical learning picture is the classification problem: not fitting a line to continuous targets, but predicting a discrete class. That is logistic regression.",
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
                Pearson's correlation told us how strongly two things move together, and PCA found the hidden directions of maximum variation. But there's a trap: if you look at enough correlations, some will appear just by chance. Measure 50 things per person and you have 1,225 pairs to check — roughly 61 of those will look significant at the 5% level purely by luck, even if nothing is actually related to anything else. Statistical inference is the science of telling real patterns from lucky coincidences.
            </p>

            <Analogy label="Sample mean vs true mean">
                You want to know the average height of teenagers in your city, but you can only measure 100 of them. Your <strong>sample mean</strong> is an estimate — always a little off from the true answer. There is always some error from random sampling.
                <br /><br />
                In machine learning, we split data into train and test sets and measure how well the model does on the test set. That test accuracy is a sample estimate of true generalisation — it's never perfectly accurate.
            </Analogy>

            <Analogy label="Confidence interval = estimate plus honest uncertainty">
                Instead of saying "the average height is 170 cm," you say "I'm 95% confident it's between 168 and 172 cm." That <strong>confidence interval</strong> tells you not just the estimate but how uncertain you should be.
                <br /><br />
                In machine learning, reporting test accuracy as "82.3% ± 1.4%" is far more honest than just "82.3%." The ± comes from statistical inference, and omitting it is one of the ways benchmark results mislead the field.
            </Analogy>

            <Analogy label="Statistical significance = unlikely to be a coincidence">
                You flip a coin 10 times and get 8 heads. Is the coin biased? Maybe — a fair coin does this about 5.5% of the time. The <strong>p-value</strong> quantifies the doubt: p = 0.055 means "if the coin were fair, you'd see this result 5.5% of the time by chance."
                <br /><br />
                In machine learning, "model A beats model B with p = 0.003" means: if they were truly equally good, there's only a 0.3% chance of seeing this big a gap by random test-set sampling. That's strong evidence the difference is real.
            </Analogy>

            <Analogy label="Maximum Likelihood — the unifying principle">
                Fisher had a beautiful idea: choose the parameters that make your observed data most probable. If you see 70 heads in 100 flips, the MLE of the coin's bias is 0.70 — because p=0.70 makes seeing exactly 70 heads more likely than any other value.
                <br /><br />
                Every neural network in this course does exactly this, just at enormous scale. The cross-entropy loss that networks minimise is the negative log-likelihood — the exact quantity Fisher proposed maximising in 1922.
            </Analogy>

            <Analogy label="What comes next — predicting categories, not numbers">
                Regression predicts a continuous number (house price, temperature). But many real problems ask for a category: spam or not spam? Cancer or benign? Dog or cat? The first classification model — logistic regression — uses the sigmoid function to squeeze Fisher's likelihood principle into a probability between 0 and 1. It's also the last piece of the statistical toolbox before the story of neural networks begins.
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
                A <strong>point estimator</strong> θ̂ = g(X₁,...,Xₙ) estimates the true parameter θ. The Maximum Likelihood Estimator chooses θ to maximise the likelihood of the observed data:
            </p>
            <MathBlock tex="\hat{\theta}_{\text{MLE}} = \arg\max_\theta \prod_{i=1}^n p(x_i \mid \theta) = \arg\max_\theta \sum_{i=1}^n \log p(x_i \mid \theta)" />
            <p>
                The log-sum form is numerically stable and turns products into sums. For Gaussian noise (ε ~ N(0,σ²)), maximising log-likelihood of y = Xβ + ε is identical to minimising mean-squared error — connecting Fisher's framework directly to Gauss's 1801 least squares.
            </p>

            <h3>Confidence Intervals</h3>
            <p>
                A 95% confidence interval [L, U] satisfies P(L ≤ θ ≤ U) = 0.95. For the sample mean with unknown variance (Student's t-distribution):
            </p>
            <MathBlock tex="\bar{X} \pm t_{n-1,\, 0.025} \cdot \frac{S}{\sqrt{n}}" />
            <p>
                where t(n−1, 0.025) is the critical value from the t-distribution with n−1 degrees of freedom. As n → ∞, this converges to ±1.96σ/√n (the normal approximation).
            </p>

            <h3>Hypothesis Testing</h3>
            <p>
                Set up H₀ (null) and H₁ (alternative). Compute a test statistic. The p-value is P(test statistic ≥ observed | H₀ true). Reject H₀ if p &lt; α. Two fundamental error types:
            </p>
            <MathBlock tex="\text{Type I}: P(\text{reject } H_0 \mid H_0 \text{ true}) = \alpha \quad \text{Type II}: P(\text{fail to reject} \mid H_1 \text{ true}) = \beta" />
            <p>Power = 1 − β. Increasing sample size increases power for any fixed effect size.</p>

            <h3>The Bias-Variance Decomposition</h3>
            <p>
                For any estimator θ̂, the mean squared error decomposes:
            </p>
            <MathBlock tex="\text{MSE}(\hat{\theta}) = \text{Bias}^2(\hat{\theta}) + \text{Var}(\hat{\theta})" />
            <p>
                This is the bias-variance tradeoff. Ridge regression adds bias (shrinks coefficients toward zero) to dramatically reduce variance — overall lowering MSE despite being technically biased. This is the mathematical justification for regularisation in all of machine learning.
            </p>

            <h3>Bayesian Inference</h3>
            <p>
                The Bayesian alternative treats θ as a random variable with a prior p(θ):
            </p>
            <MathBlock tex="p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta) \, p(\theta)}{p(\mathcal{D})}" />
            <p>
                The posterior p(θ|D) is updated by the data. MAP (Maximum A Posteriori) estimation chooses the posterior mode — equivalent to MLE with a regularisation penalty equal to −log p(θ). L2 regularisation (weight decay) is MAP with a Gaussian prior; L1 regularisation is MAP with a Laplace prior.
            </p>

            <div className="ch-callout">
                <strong>The grand unification:</strong> Gauss (1801) minimised squared error → Fisher (1922) showed this equals maximising Gaussian log-likelihood → Neyman-Pearson (1933) turned model comparison into a decision problem → Wald (1956) showed regularisation equals Bayesian MAP. Every ML training loop is this chain applied at scale. The next algorithm — logistic regression — applies the same MLE principle to classification, completing the classical statistical toolkit.
            </div>

            <DefBlock label="Key Formulas at a Glance">
                MLE: θ̂ = argmax Σ log p(xᵢ|θ)<br />
                Ridge = MLE + Gaussian prior: argmin ‖y−Xβ‖² + λ‖β‖²<br />
                Lasso = MLE + Laplace prior: argmin ‖y−Xβ‖² + λ‖β‖₁<br />
                t-statistic: t = (x̄ − μ₀) / (s/√n) ~ t(n−1) under H₀<br />
                95% CI: x̄ ± t(n−1, 0.025) · s/√n
            </DefBlock>
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
