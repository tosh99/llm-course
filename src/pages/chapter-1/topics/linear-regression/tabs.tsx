import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import { RegressionDiagram, BiasVarianceDiagram, RidgeLassoDiagram } from "./diagrams"
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
            year: "1801 – 1809",
            title: "Gauss — Least Squares & the Normal Equations",
            challenge:
                "Chapter 0 gave us the mathematical tools: systems of linear equations (Xβ = y), the derivative (∂L/∂β), and the covariance matrix (XᵀX). But these were abstract. The first question in the history of machine learning is concrete: astronomers tracking Ceres after its discovery in 1801 had far more noisy observations than unknowns. Any two data points gave a slightly different orbit. How do you find the single best orbit when there is no exact solution?",
            what:
                "Gauss formalised the method of least squares: choose the parameters that minimise the sum of squared residuals — the squared differences between observed and predicted values. He derived the closed-form normal equations: β = (XᵀX)⁻¹Xᵀy.",
            impact:
                "Every regression model in ML — from linear regression to the output layer of a neural network — is, at its core, Gauss's least squares principle applied to increasingly complex function classes. The normal equations are the direct ancestor of gradient descent.",
        },
        {
            year: "1805",
            title: "Legendre — First Publication of Least Squares",
            challenge:
                "Gauss had used the method privately since 1795, but the mathematical community needed an explicit, reproducible method that others could apply to their own problems.",
            what:
                "Adrien-Marie Legendre published the method of least squares as a standalone technique for combining astronomical observations, explicitly stating the objective: minimise the sum of squared errors. He made no claims of priority but Gauss disputed this.",
            impact:
                "Legendre's public claim ensured the method entered the scientific canon. The priority dispute with Gauss is one of the most famous in mathematics history — but it didn't diminish Legendre's contribution of making the method reproducible and accessible.",
        },
        {
            year: "1888",
            title: "Pearson — The Linear Regression Model",
            challenge:
                "Biometricians in the late 19th century wanted a rigorous way to describe the relationship between two biological measurements — e.g., a parent's height and a child's height — and to quantify the strength of that relationship.",
            what:
                "Karl Pearson formalised the linear regression model y = β₀ + β₁x + ε, introduced the concept of the regression line that minimises expected squared loss, and derived the sampling distributions of regression coefficients under normality assumptions.",
            impact:
                "Pearson turned Gauss's ad-hoc least squares into a full statistical theory: estimators, sampling distributions, hypothesis tests, R² as a measure of fit. Modern statistical software is built on Pearson's framework.",
        },
        {
            year: "1958",
            title: "Ridge Regression — Hoerl & Kennard",
            challenge:
                "When XᵀX is ill-conditioned — nearly singular — the OLS estimate (XᵀX)⁻¹Xᵀy becomes numerically unstable. Small changes in data produce huge changes in estimated coefficients. This is the bias-variance tradeoff made concrete.",
            what:
                "Hoerl and Kennard proposed adding a ridge (λ ≥ 0) to the diagonal of XᵀX: β_ridge = (XᵀX + λI)⁻¹Xᵀy. This 'conditioning number' shrinks coefficients toward zero, trading a small increase in bias for a large reduction in variance.",
            impact:
                "Ridge regression is the prototype for all modern regularisation. The idea — that adding a penalty term to the objective function controls overfitting — directly inspired LASSO, elastic net, weight decay in neural networks, and dropout.",
        },
        {
            year: "1996",
            title: "Tibshirani — LASSO (Least Absolute Shrinkage)",
            challenge:
                "Ridge regression shrinks all coefficients but never sets any to exactly zero. In high-dimensional settings (p >> n), this makes interpretation impossible. Scientists wanted a method that simultaneously performs variable selection and regularisation.",
            what:
                "Tibshirani replaced the L2 penalty ||β||₂² with an L1 penalty ||β||₁, giving the LASSO: minimis  ||y − Xβ||² + λ||β||₁. The L1 ball's vertices cause exact zeros for some coefficients — automatic feature selection.",
            impact:
                "The LASSO sparked an entire field of 'sparse' methods. It showed that the geometry of the constraint region (L1 diamond vs L2 sphere) determines whether you get sparse solutions. This geometric insight applies to compressed sensing, group LASSO, and the success of sparse models in modern deep learning.",
        },
        {
            year: "2005",
            title: "Elastic Net — Zou & Hastie",
            challenge:
                "The LASSO has limitations: it selects at most n variables when p > n, and when variables are highly correlated, it tends to select only one and ignore the others.",
            what:
                "Zou and Hastie combined L1 and L2 penalties: λ₂||β||₂² + λ₁||β||₁. This encourages grouping of correlated variables (L2 handles the correlation; L1 handles sparsity) while being computationally tractable via coordinate descent.",
            impact:
                "Elastic net became a workhorse for high-dimensional genomics, finance, and text classification where correlated predictors are the norm. It is still widely used as a strong baseline alongside modern methods.",
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
            <h2>Fitting the best straight line</h2>

            <p className="ch-story-intro">
                Chapter 0 gave you calculus, linear algebra, and probability — the mathematical scaffolding. Chapter 1 begins the actual history. The year is 1801. A planet has gone missing, and a 24-year-old mathematician named Carl Friedrich Gauss is about to invent the first machine learning algorithm.
            </p>

            <Analogy label="The goal">
                Imagine you have a bunch of dots on a piece of graph paper and you want to draw one straight line that goes as close as possible to all of them.{" "}
                <strong>Linear regression</strong> is the mathematical way of finding that line — and "as close as possible" means the total distance from every dot to the line is as small as it can be.
            </Analogy>

            <Analogy label="The cost — squared error">
                We measure "distance" by drawing a vertical line from each dot straight up or down to the regression line. Then we square that distance (make it always positive) and add them all up. We want to make this total as small as possible.
                <br /><br />
                Why square? If a dot is 5 units above the line, squaring it gives 25. If another is 5 units below, squaring gives 25 too. Adding gives 50. Without squaring, +5 and −5 would cancel out to 0 — which would make a terrible line look perfect!
            </Analogy>

            <DiagramBlock title="Linear regression — fitting ŷ = 0.95x + 1.1 through noisy data">
                <RegressionDiagram />
            </DiagramBlock>

            <Analogy label="The equation — ŷ = wx + b">
                Every straight line has two numbers that define it: the <strong>slope</strong> w (how steep) and the <strong>intercept</strong> b (where it crosses the y-axis). Linear regression finds the best w and b for your data.
                <br /><br />
                With more features: ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b. Still just a weighted sum — that's why it's called <em>linear</em>.
            </Analogy>

            <Analogy label="Underfitting vs overfitting — the sweet spot">
                If you use too simple a model (a flat line), it's <strong>underfitting</strong> — it misses the pattern. If you use something too complicated (a wildly wiggly curve that hits every dot), it's <strong>overfitting</strong> — it's just memorising the dots, not learning the real pattern.
                <br /><br />
                Think of it like a test: studying too little → you miss patterns (underfitting). Studying too much (memorising exact past questions) → you fail when questions change (overfitting). The sweet spot is somewhere in between.
            </Analogy>

            <DiagramBlock title="Bias-variance tradeoff — where does your model sit?">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <Analogy label="Why this matters for AI">
                Every neural network is secretly linear regression layered on top of itself, with non-linear squashing functions between layers (ReLU, sigmoid). The output of each layer becomes the input (x) to the next. Finding the best weights is exactly the same least-squares minimisation — just at enormous scale.
                <br /><br />
                The loss function that neural networks minimise (cross-entropy, MSE) is always a sum of squared errors at heart.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The method of least squares</h2>

            <p>
                Given n data points (x₁, y₁), …, (xₙ, yₙ), we want the straight line ŷ = wₓ + b that best fits them. "Best" means minimising the <strong>residual sum of squares (RSS)</strong>:
            </p>
            <MathBlock tex="\text{RSS}(w,b) = \sum_{i=1}^n (y_i - \hat{y}_i)^2 = \sum_{i=1}^n (y_i - wx_i - b)^2" />
            <p>
                Take partial derivatives with respect to w and b, set to zero, solve — this gives the <strong>normal equations</strong>:
            </p>
            <MathBlock tex="\hat{w} = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2} = \frac{\text{Cov}(x,y)}{\text{Var}(x)}" />
            <MathBlock tex="\hat{b} = \bar{y} - \hat{w}\,\bar{x}" />

            <h3>Multiple Linear Regression</h3>
            <p>
                With p features, write the model in matrix form: <InlineMath tex="y = X\beta + \varepsilon" />, where X ∈ ℝⁿˣᵖ (n samples, p features, column of 1s for intercept). The least-squares solution is:
            </p>
            <MathBlock tex="\hat{\beta} = (X^\top X)^{-1} X^\top y" />
            <p>
                This requires XᵀX to be invertible (full column rank). When it's singular or near-singular, we use regularisation — adding a penalty to the diagonal before inverting.
            </p>

            <h3>Goodness of Fit — R²</h3>
            <p>
                R² measures the fraction of variance in y explained by the model:
            </p>
            <MathBlock tex="R^2 = 1 - \frac{\text{SS}_{\text{res}}}{\text{SS}_{\text{tot}}} = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}" />
            <p>
                R² = 1 means perfect prediction; R² = 0 means the model is no better than predicting the mean. Beware: adding more features always increases R², even if they're useless. Use <strong>adjusted R²</strong> or cross-validation to penalise unnecessary complexity.
            </p>

            <h3>Assumptions of Linear Regression</h3>
            <ul>
                <li><strong>Linearity:</strong> E[y|x] is a linear function of x</li>
                <li><strong>Independence:</strong> Errors εᵢ are independent of each other</li>
                <li><strong>Homoscedasticity:</strong> Var(εᵢ) = σ² is constant (same spread at all x)</li>
                <li><strong>Normality:</strong> εᵢ ~ Normal(0, σ²) (needed for inference, not prediction)</li>
                <li><strong>No perfect multicollinearity:</strong> Columns of X are linearly independent</li>
            </ul>

            <h3>Extensions at a Glance</h3>
            <ul>
                <li><strong>Polynomial regression:</strong> Add x², x³ … — still linear in parameters β, just non-linear in x</li>
                <li><strong>Logistic regression:</strong> Replace ŷ with σ(wx + b) to model probabilities — used for classification</li>
                <li><strong>Poisson regression:</strong> For count data (y ≥ 0, integer) — models log(E[y]) = Xβ</li>
            </ul>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal proofs · Gauss-Markov · bias-variance</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">NumPy · OLS · Ridge · LASSO · CV</span>
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
            <h2>Formal Statistical Framework</h2>

            <DefBlock label="The Linear Regression Model">
                Given design matrix X ∈ ℝⁿˣᵖ and response y ∈ ℝⁿ, the linear regression model assumes:
                y = Xβ + ε,  where ε ~ Normal(0, σ²Iₙ).
                <br /><br />
                The OLS estimator minimises the loss ℒ(β) = ||y − Xβ||², yielding the closed-form solution β̂ = (XᵀX)⁻¹Xᵀy when X has full column rank.
            </DefBlock>

            <h3>Properties of β̂</h3>
            <p>
                β̂ is <strong>unbiased</strong>: E[β̂] = β. Its covariance matrix is:
            </p>
            <MathBlock tex="\text{Cov}(\hat{\beta}) = \sigma^2 (X^\top X)^{-1}" />
            <p>
                The <strong>Gauss-Markov theorem</strong> states that among all linear unbiased estimators, OLS has the minimum variance. But "unbiased" is a strong assumption — in high-dimensional settings, a slightly biased estimator (ridge, LASSO) often has lower mean squared error.
            </p>

            <h3>Regularised Regression</h3>
            <p>
                Add a penalty term to the loss to control coefficient magnitude:
            </p>
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = \arg\min_\beta \underbrace{\|y - X\beta\|^2}_{\text{fit}} + \underbrace{\lambda\|\beta\|_2^2}_{\text{L2 penalty}}" />
            <p>
                Ridge closed form: β̂_ridge = (XᵀX + λI)⁻¹Xᵀy. The added λI ensures XᵀX + λI is always invertible, even when XᵀX is singular.
            </p>
            <MathBlock tex="\hat{\beta}^{\text{lasso}} = \arg\min_\beta \underbrace{\|y - X\beta\|^2}_{\text{fit}} + \underbrace{\lambda\|\beta\|_1}_{\text{L1 penalty}}" />
            <p>
                The L1 penalty ||β||₁ = Σ|βᵢ| creates a diamond-shaped constraint region. The solution touches the diamond's corners — at those points, some βᵢ = 0 exactly. This is the mechanism for sparsity.
            </p>

            <DiagramBlock title="L1 (Lasso) vs L2 (Ridge) penalty regions — why L1 gives sparse solutions">
                <RidgeLassoDiagram />
            </DiagramBlock>

            <h3>Bias-Variance Decomposition of MSE</h3>
            <p>
                For a regression model at point x, the expected test MSE decomposes as:
            </p>
            <MathBlock tex="\mathbb{E}[(y - \hat{f}(x))^2] = \sigma^2 + \text{Bias}^2[\hat{f}(x)] + \text{Var}[\hat{f}(x)]" />
            <ul>
                <li><strong>σ²</strong> — irreducible noise, same for all models</li>
                <li><strong>Bias²</strong> — systematic error from wrong model class (underfitting)</li>
                <li><strong>Variance</strong> — sensitivity to training set (overfitting)</li>
            </ul>
            <p>
                Simpler models (linear regression with few features) → high bias, low variance. Complex models (high-degree polynomial) → low bias, high variance. Regularisation controls variance at the cost of a small bias increase.
            </p>

            <DiagramBlock title="The bias-variance tradeoff — finding the sweet spot">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <h3>Connection to Neural Networks</h3>
            <p>
                A single linear layer is ŷ = Wx + b — exactly the linear regression model with multiple outputs. Training via gradient descent on MSE loss is minimising Σ(yᵢ − ŷᵢ)², just as Gauss proposed. The difference is composition: stacking multiple linear layers with non-linearities creates non-linear function approximators. But the optimisation principle — minimise sum of squared errors — is unchanged.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> Linear regression is the simplest instance of a <em>parametric supervised learning</em> model. Its three components — model family (linear functions), loss function (MSE), and optimisation (closed-form or gradient descent) — define the template for nearly every learning algorithm that followed.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── OLS via Normal Equations ─────────────────────────────────
X = np.array([                # n=6 samples, p=2 features + intercept
    [1, 1.0, 2.0],
    [1, 2.0, 4.0],
    [1, 3.0, 1.5],
    [1, 4.0, 3.0],
    [1, 5.0, 2.5],
    [1, 6.0, 5.0],
])
y = np.array([3.2, 5.1, 4.3, 6.8, 7.1, 9.4])

# β̂ = (XᵀX)⁻¹ Xᵀy
XtX_inv = np.linalg.inv(X.T @ X)
beta = XtX_inv @ (X.T @ y)
print("Coefficients:", beta)    # [intercept, w1, w2]

# Predictions
y_hat = X @ beta
residuals = y - y_hat
print("RSS:", np.sum(residuals**2))

# R²
ss_res = np.sum(residuals**2)
ss_tot = np.sum((y - y.mean())**2)
r2 = 1 - ss_res / ss_tot
print(f"R² = {r2:.4f}")

# ── Ridge Regression ────────────────────────────────────────────
lam = 1.5
I = np.eye(X.shape[1])
I[0, 0] = 0          # don't regularise the intercept
beta_ridge = np.linalg.inv(X.T @ X + lam * I) @ (X.T @ y)
print("Ridge coefficients:", beta_ridge)

# ── LASSO via sklearn ─────────────────────────────────────────
from sklearn.linear_model import Lasso, LinearRegression
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[:, 1:])  # scale features only

lasso = Lasso(alpha=0.1)
lasso.fit(X_scaled, y - y.mean())
print("LASSO coeffs (scaled):", lasso.coef_)   # some may be zero
print("LASSO intercept:", lasso.intercept_)

# ── Cross-validation to pick λ ─────────────────────────────────
from sklearn.linear_model import RidgeCV

ridge = RidgeCV(alphas=[0.01, 0.1, 0.5, 1.0, 5.0, 10.0], cv=5)
ridge.fit(X[:, 1:], y)         # sklearn adds intercept automatically
print(f"Best λ by CV: {ridge.alpha_:.2f}")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy's matrix operations make closed-form OLS and Ridge one-liners. For LASSO and other regularised models, scikit-learn provides efficient coordinate descent solvers.
            </p>
            <CodeBlock code={PY_CODE} filename="linear_regression.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Use <code>RidgeCV</code> / <code>LassoCV</code> for automatic λ selection via cross-validation. Always scale features before applying L1/L2 penalties — otherwise the penalty unfairly disadvantages features with larger numerical ranges.
            </div>
        </>
    )
}




// ── Tab content map ─────────────────────────────────────────────────────────

export const LINEAR_REGRESSION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
