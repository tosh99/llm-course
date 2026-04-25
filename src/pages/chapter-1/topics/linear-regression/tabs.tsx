import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
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
            title: "Gauss — Least Squares and the Normal Equations",
            challenge:
                "Chapter 0 gave us the mathematical tools: systems of linear equations, the derivative, and the covariance matrix. But these were abstract. The first concrete problem in the history of machine learning arrived with the discovery of the dwarf planet Ceres on January 1, 1801. Astronomers had tracked it for 41 days before it vanished behind the sun. Each pair of observations gave a slightly different orbit estimate, and there was no way to reconcile dozens of contradictory measurements into a single prediction. How do you find the best orbit when no exact solution exists?",
            what:
                "Carl Friedrich Gauss, then 24 years old, formalised the method of least squares: choose the parameters that minimise the sum of squared residuals — the squared differences between observed and predicted positions. He derived the closed-form normal equations: beta = (X-transpose times X) inverse times X-transpose times y. Using this method, Gauss predicted exactly where Ceres would reappear, and the astronomer Franz Xaver von Zach found it almost exactly where Gauss said it would be. Gauss later claimed to have used the method since 1795 but published it only in his 1809 book Theoria Motus.",
            impact:
                "Every regression model in machine learning — from linear regression to the output layer of a neural network — is, at its core, Gauss's least squares principle applied to increasingly complex function classes. The normal equations are the direct ancestor of gradient descent: when the problem is too large to solve the normal equations directly, you approximate them iteratively. The insight that 'best fit' means 'minimum squared error' is the foundational axiom of supervised learning.",
        },
        {
            year: "1805",
            title: "Legendre — First Publication of Least Squares",
            challenge:
                "Gauss had used the method privately since 1795, but mathematics advances by publication and reproducibility, not private notebooks. Astronomers and geodesists surveying the shape of the Earth needed a standardised, documented procedure for combining many imperfect measurements. Without a published method, every scientist invented their own ad hoc combination rule — some averaging, some weighted averaging, some picking the observation they trusted most.",
            what:
                "Adrien-Marie Legendre published the method of least squares in 1805 as an appendix to his work on cometary orbits, explicitly stating the objective: minimise the sum of squared errors. His presentation was clear, practical, and self-contained — any mathematician could read it and apply it immediately. He made no claims about why squared errors (rather than absolute errors or maximum errors) were the right objective, but the computational convenience of differentiation made it the natural choice.",
            impact:
                "Legendre's publication ignited one of the most famous priority disputes in the history of science — Gauss claimed he had used the method for years before Legendre published. Regardless of priority, Legendre's clarity is what put the method into general scientific practice. The dispute itself illustrates something important about machine learning: the same idea appears independently when the underlying need is pressing enough. Least squares was discovered at least three times (Legendre, Gauss, and Adrain in America in 1808) because the problem was genuinely urgent.",
        },
        {
            year: "1886 – 1896",
            title: "Galton and Pearson — The Statistical Regression Model",
            challenge:
                "Victorian biometricians wanted more than a curve-fitting tool — they wanted a statistical theory. Francis Galton had noticed something striking: the sons of very tall fathers were, on average, shorter than their fathers, and the sons of very short fathers were taller than their fathers. He called this 'regression to mediocrity' and needed a mathematical framework to describe it. The least-squares method of Gauss and Legendre treated errors as nuisances to be minimised; Galton wanted to treat the variability itself as the signal.",
            what:
                "Galton (1886) drew the first regression line through bivariate data and coined the term 'regression' — though he applied it narrowly to biological inheritance. Karl Pearson formalised the linear regression model y = beta-zero plus beta-one times x plus epsilon, where epsilon is a random error term with mean zero and constant variance. He derived the sampling distributions of the regression coefficients under normality assumptions, introduced R-squared as the fraction of variance explained, and connected regression to correlation via the formula: the estimated slope equals the correlation coefficient times the ratio of standard deviations.",
            impact:
                "Pearson turned Gauss's ad-hoc least squares into a full statistical theory with estimators, confidence intervals, hypothesis tests, and goodness-of-fit measures. Modern statistical software — from R's lm() to sklearn's LinearRegression — implements Pearson's framework directly. The conceptual shift from 'fitting a curve' to 'learning a statistical relationship' is the shift from numerical analysis to statistical machine learning.",
        },
        {
            year: "1922",
            title: "Fisher — Maximum Likelihood and the Geometry of Least Squares",
            challenge:
                "Pearson's framework was rigorous but lacked a foundational justification for why squared errors were the right loss function. Why not absolute errors? Why not fourth powers? There was also no unified framework connecting the regression model to probability theory in a way that would generalise to other problems beyond normally-distributed errors.",
            what:
                "Ronald Fisher showed in 1922 that minimising the sum of squared errors is identical to maximising the likelihood of the observed data under the assumption that errors are normally distributed. If epsilon-i is drawn from Normal(0, sigma-squared), then the log-likelihood of the data given the parameters equals negative one divided by two sigma-squared times the sum of squared residuals, plus a constant. Minimising RSS equals maximising the Gaussian log-likelihood. Fisher also introduced the concept of sufficient statistics — showing that the OLS estimator captures everything the data has to say about the regression coefficients under the Gaussian model.",
            impact:
                "Fisher's unification of least squares with maximum likelihood is the deepest conceptual bridge in all of machine learning. It explains why cross-entropy loss is used for classification (it is the negative log-likelihood under a Bernoulli model) and why mean squared error is used for regression (it is the negative log-likelihood under a Gaussian model). Every loss function in modern deep learning is a negative log-likelihood in disguise — Fisher made this explicit in 1922.",
        },
        {
            year: "1958 – 1970",
            title: "Ridge Regression — Hoerl, Kennard, and the Bias-Variance Tradeoff",
            challenge:
                "When the design matrix X is ill-conditioned — when predictors are nearly collinear — the ordinary least-squares estimate becomes numerically catastrophic. The matrix X-transpose X is nearly singular, so its inverse amplifies noise by huge factors. A small change in one observation can cause wild swings in the estimated coefficients. This is the bias-variance tradeoff made concrete: the OLS estimator has zero bias but potentially enormous variance.",
            what:
                "Arthur Hoerl and Robert Kennard proposed in 1970 adding a small constant lambda to the diagonal of X-transpose X before inverting: beta-ridge = (X-transpose X + lambda I) inverse times X-transpose y. This 'ridge' shrinks coefficients toward zero, trading a small amount of bias for a large reduction in variance. They showed that for any dataset, there always exists a value of lambda for which ridge regression has lower mean squared error than OLS — even though it is technically biased. They also showed that the ridge estimate is the posterior mode under a Gaussian prior on the coefficients.",
            impact:
                "Ridge regression is the prototype for all modern regularisation in machine learning. The idea — that adding a penalty term to the objective function controls model complexity and prevents overfitting — directly inspired LASSO (Tibshirani, 1996), elastic net (Zou and Hastie, 2005), weight decay in neural networks (which is exactly L2 regularisation on weights), and dropout (which approximates an L2 penalty). The bias-variance tradeoff that ridge regression makes explicit is the central organising principle of generalisation theory.",
        },
        {
            year: "1996 – 2005",
            title: "LASSO and Elastic Net — Sparsity and High Dimensions",
            challenge:
                "Ridge regression shrinks all coefficients toward zero but never sets any to exactly zero. In high-dimensional problems — genomics with 20,000 gene expression features, text classification with 100,000 word features — you need a method that simultaneously performs variable selection and estimation. Ridge gives you a dense model with all 20,000 small coefficients; you want a sparse model with 50 important coefficients and the rest exactly zero.",
            what:
                "Tibshirani (1996) replaced the L2 penalty on the coefficients with an L1 penalty — the sum of absolute values — giving the LASSO (Least Absolute Shrinkage and Selection Operator). The L1 constraint region is a diamond (in 2D) or cross-polytope (in higher dimensions). The corners of a diamond lie on the coordinate axes; when the elliptical contours of the residual sum of squares first touch the diamond, they are most likely to touch at a corner, where one or more coefficients are exactly zero. Zou and Hastie (2005) combined L1 and L2 penalties into the elastic net, handling correlated predictors that LASSO arbitrarily selects among.",
            impact:
                "The LASSO sparked the field of sparse statistical learning and compressed sensing. The geometric insight — that the shape of the constraint region determines the sparsity pattern of solutions — applies throughout machine learning. Attention sparsity in Transformers, pruned neural networks, and the success of low-rank approximations in LoRA fine-tuning all rely on sparsity-inducing geometry that the LASSO first made precise. The same L1 vs L2 distinction appears in every regularised loss function in modern deep learning.",
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

            <Analogy label="The goal — the closest line to all the dots">
                Imagine you have a bunch of dots on a piece of graph paper and you want to draw one straight line that goes as close as possible to all of them. <strong>Linear regression</strong> is the mathematical way of finding that line — and "as close as possible" means the total distance from every dot to the line is as small as it can be.
                <br /><br />
                Gauss needed this to predict where the asteroid Ceres would appear after vanishing behind the sun. He had dozens of noisy position measurements — each one slightly different. He needed the single best orbit. His method: find the line (or curve) that minimises the total squared error to all observations.
            </Analogy>

            <Analogy label="The cost — why we square the errors">
                We measure "distance" by drawing a vertical line from each dot straight up or down to the regression line. Then we square that distance (make it always positive) and add them all up. We want to make this total as small as possible.
                <br /><br />
                Why square? If a dot is 5 units above the line, squaring gives 25. If another is 5 units below, squaring gives 25 too. Adding gives 50. Without squaring, +5 and -5 would cancel out to 0 — which would make a terrible line look perfect. Squaring also penalises large errors more than small ones: being off by 10 is four times as bad as being off by 5, not just twice as bad.
            </Analogy>

            <DiagramBlock title="Linear regression — fitting the best line through noisy data">
                <RegressionDiagram />
            </DiagramBlock>

            <Analogy label="The equation — slope and intercept">
                Every straight line has two numbers that define it: the <strong>slope</strong> w (how steep) and the <strong>intercept</strong> b (where it crosses the y-axis). Linear regression finds the best w and b for your data.
                <br /><br />
                With more features: the prediction is w1 times x1 plus w2 times x2 plus ... plus wn times xn plus b. Still just a weighted sum — that's why it's called <em>linear</em>. The weights tell you how much each feature matters. A large positive weight means "more of this feature predicts a higher output." A negative weight means the opposite.
            </Analogy>

            <Analogy label="Underfitting vs overfitting — the sweet spot">
                If you use too simple a model (a flat horizontal line), it's <strong>underfitting</strong> — it misses the pattern entirely. If you use something too complicated (a wildly wiggly curve that passes through every single dot), it's <strong>overfitting</strong> — it's memorising the noise in your training data, not learning the real underlying pattern.
                <br /><br />
                Think of it like studying for a test: studying too little means you miss the real patterns (underfitting). Memorising exact past questions without understanding them means you'll fail when slightly different questions appear (overfitting). The sweet spot is a model that generalises — one that learned something real, not just noise.
            </Analogy>

            <DiagramBlock title="Bias-variance tradeoff — finding the right complexity">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <Analogy label="Regularisation — adding a penalty for complexity">
                Ridge regression adds a penalty: the more the weights grow, the more extra cost is added. This forces the model to stay simple unless the data really justifies complexity. Think of it like a budget: you can spend your budget on fitting the data closely, but each extra dollar of model complexity costs extra. Regularisation makes the model earn its complexity.
                <br /><br />
                LASSO goes further: it can set some weights to exactly zero, which means "this feature is not useful at all." This is called <em>feature selection</em> — the model automatically identifies which inputs are worth using. With thousands of possible features, this is enormously valuable.
            </Analogy>

            <Analogy label="Why this matters for AI">
                Every neural network is secretly linear regression layered on top of itself, with nonlinear squashing functions between layers (ReLU, sigmoid). The output of each layer becomes the input to the next. Finding the best weights is exactly the same least-squares minimisation — just at enormous scale with millions of parameters instead of two.
                <br /><br />
                The loss function that neural networks minimise (cross-entropy, MSE) is always a sum of squared or log-probability errors at heart. Regularisation — weight decay in neural networks — is exactly ridge regression applied to millions of parameters simultaneously. Gauss's 1801 insight is everywhere in modern AI.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The method of least squares</h2>

            <p>
                Given n data points (x<sub>1</sub>, y<sub>1</sub>), ..., (x<sub>n</sub>, y<sub>n</sub>), we want the straight line that best fits them. "Best" means minimising the <strong>residual sum of squares (RSS)</strong>:
            </p>
            <MathBlock tex="\text{RSS}(w,b) = \sum_{i=1}^n (y_i - \hat{y}_i)^2 = \sum_{i=1}^n (y_i - wx_i - b)^2" />
            <p>
                Take partial derivatives with respect to w and b, set to zero, and solve — this gives the <strong>normal equations</strong> for the simple case:
            </p>
            <MathBlock tex="\hat{w} = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2} = \frac{\text{Cov}(x,y)}{\text{Var}(x)}" />
            <MathBlock tex="\hat{b} = \bar{y} - \hat{w}\,\bar{x}" />

            <h3>Multiple Linear Regression</h3>
            <p>
                With p features, write the model in matrix form: y = X beta + epsilon, where X is in R-to-the-n-by-p (n samples, p features, with a column of 1s for the intercept). The least-squares solution is:
            </p>
            <MathBlock tex="\hat{\beta} = (X^\top X)^{-1} X^\top y" />
            <p>
                This requires X-transpose-X to be invertible (full column rank). When it is singular or near-singular — for instance when two features are highly correlated — we use regularisation, adding a penalty to the diagonal before inverting.
            </p>

            <h3>Goodness of Fit — R-squared</h3>
            <p>
                R-squared measures the fraction of variance in y explained by the model:
            </p>
            <MathBlock tex="R^2 = 1 - \frac{\text{SS}_{\text{res}}}{\text{SS}_{\text{tot}}} = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}" />
            <p>
                R-squared equals 1 means perfect prediction; R-squared equals 0 means the model is no better than predicting the mean. Beware: adding more features always increases R-squared, even if those features are pure noise. Use <strong>adjusted R-squared</strong> or cross-validation to detect this.
            </p>

            <h3>Assumptions of Linear Regression</h3>
            <ul>
                <li><strong>Linearity:</strong> the expected value of y given x is a linear function of x</li>
                <li><strong>Independence:</strong> the errors epsilon-i are independent of each other</li>
                <li><strong>Homoscedasticity:</strong> the variance of epsilon-i is constant across all values of x</li>
                <li><strong>Normality:</strong> errors follow a Normal distribution (needed for inference, not just prediction)</li>
                <li><strong>No perfect multicollinearity:</strong> columns of X are linearly independent</li>
            </ul>

            <h3>Regularised Regression at a Glance</h3>
            <ul>
                <li><strong>Ridge (L2):</strong> add lambda times the sum of squared coefficients — shrinks all coefficients, never sets any to zero</li>
                <li><strong>LASSO (L1):</strong> add lambda times the sum of absolute values — can set coefficients to exactly zero (feature selection)</li>
                <li><strong>Elastic net:</strong> combines L1 and L2 — handles correlated predictors while maintaining sparsity</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The key insight:</strong> Linear regression is the simplest instance of a parametric supervised learning model. Its three components — model family (linear functions), loss function (MSE), and optimisation (closed-form or gradient descent) — define the template for nearly every learning algorithm that followed. Neural networks replace "linear functions" with "compositions of linear functions and nonlinearities" — but the loss and optimisation strategy are the same.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal proofs · Gauss-Markov · bias-variance decomposition</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">NumPy · OLS · Ridge · LASSO · cross-validation</span>
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
                Given design matrix X in R-to-the-n-by-p and response y in R-to-the-n, the linear regression model assumes y = X beta + epsilon, where epsilon is distributed as Normal(0, sigma-squared times I-n). The OLS estimator minimises the loss L(beta) = norm of (y minus X-beta) squared, yielding the closed-form solution beta-hat = (X-transpose X) inverse X-transpose y when X has full column rank.
            </DefBlock>

            <h3>Properties of the OLS Estimator</h3>
            <p>
                The OLS estimator is <strong>unbiased</strong>: E[beta-hat] = beta. Its covariance matrix is:
            </p>
            <MathBlock tex="\text{Cov}(\hat{\beta}) = \sigma^2 (X^\top X)^{-1}" />
            <p>
                The <strong>Gauss-Markov theorem</strong> states that among all linear unbiased estimators, OLS has the minimum variance — it is the Best Linear Unbiased Estimator (BLUE). But "unbiased" is a strong constraint. In high-dimensional settings, a slightly biased estimator with lower variance often has lower mean squared error overall.
            </p>

            <h3>Regularised Regression</h3>
            <p>
                Ridge regression adds an L2 penalty to the loss to control coefficient magnitude:
            </p>
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda\|\beta\|_2^2" />
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = (X^\top X + \lambda I)^{-1} X^\top y" />
            <p>
                The added lambda times I ensures X-transpose-X plus lambda-I is always invertible, even when X-transpose-X is singular. LASSO replaces the L2 penalty with L1:
            </p>
            <MathBlock tex="\hat{\beta}^{\text{lasso}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda\|\beta\|_1" />
            <p>
                The L1 ball in p dimensions has 2p corners on the coordinate axes. When the elliptical level sets of the residual sum of squares first contact the L1 ball, they most likely touch at a corner, where one or more coordinates are exactly zero. This is the geometric mechanism for sparsity.
            </p>

            <DiagramBlock title="L1 (LASSO) vs L2 (Ridge) penalty regions — why L1 gives sparse solutions">
                <RidgeLassoDiagram />
            </DiagramBlock>

            <h3>Bias-Variance Decomposition</h3>
            <p>
                For a regression model at point x, the expected test MSE decomposes as:
            </p>
            <MathBlock tex="\mathbb{E}[(y - \hat{f}(x))^2] = \sigma^2 + \text{Bias}^2[\hat{f}(x)] + \text{Var}[\hat{f}(x)]" />
            <ul>
                <li><strong>sigma-squared</strong> — irreducible noise, the same for all models</li>
                <li><strong>Bias-squared</strong> — systematic error from using the wrong model class</li>
                <li><strong>Variance</strong> — sensitivity to the particular training set drawn</li>
            </ul>
            <p>
                Ridge regression increases bias (coefficients are shrunk toward zero) but decreases variance (the model is less sensitive to noisy observations). The net effect on MSE is always beneficial for some lambda greater than zero — proved by Hoerl and Kennard.
            </p>

            <DiagramBlock title="Bias-variance tradeoff — the sweet spot between underfitting and overfitting">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <h3>Connection to Neural Networks</h3>
            <p>
                A single linear layer is y-hat = Wx + b — exactly the linear regression model with multiple outputs. Training via gradient descent on MSE loss minimises the sum of squared errors, just as Gauss proposed. Stacking linear layers with nonlinear activations creates nonlinear function approximators. But the optimisation principle — minimise sum of squared or cross-entropy errors — is unchanged from 1801.
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

# beta_hat = (X'X)^-1 X'y
XtX_inv = np.linalg.inv(X.T @ X)
beta = XtX_inv @ (X.T @ y)
print("Coefficients:", beta)    # [intercept, w1, w2]

# Predictions and R-squared
y_hat = X @ beta
residuals = y - y_hat
ss_res = np.sum(residuals**2)
ss_tot = np.sum((y - y.mean())**2)
r2 = 1 - ss_res / ss_tot
print(f"RSS: {ss_res:.4f}  |  R^2: {r2:.4f}")

# ── Ridge Regression ────────────────────────────────────────────
lam = 1.5
I = np.eye(X.shape[1])
I[0, 0] = 0          # don't regularise the intercept
beta_ridge = np.linalg.inv(X.T @ X + lam * I) @ (X.T @ y)
print("Ridge coefficients:", beta_ridge)

# ── LASSO via sklearn ─────────────────────────────────────────
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[:, 1:])   # scale features only

lasso = Lasso(alpha=0.1)
lasso.fit(X_scaled, y - y.mean())
print("LASSO coeffs (scaled):", lasso.coef_)   # some may be zero
print("LASSO intercept:", lasso.intercept_)

# ── Cross-validation to pick the best lambda ─────────────────
from sklearn.linear_model import RidgeCV

ridge = RidgeCV(alphas=[0.01, 0.1, 0.5, 1.0, 5.0, 10.0], cv=5)
ridge.fit(X[:, 1:], y)         # sklearn adds intercept automatically
print(f"Best lambda (CV): {ridge.alpha_:.2f}")
print(f"Ridge coefs: {ridge.coef_}")

# ── NumPy gradient descent for comparison ─────────────────────
w = np.zeros(X.shape[1])
lr = 0.005
for _ in range(5000):
    y_pred = X @ w
    grad = -2 * X.T @ (y - y_pred) / len(y)
    w -= lr * grad
print("Gradient descent coefs:", w)`

function PythonContent() {
    return (
        <>
            <p>
                NumPy's matrix operations make closed-form OLS and Ridge one-liners. For LASSO and other regularised models, scikit-learn provides efficient coordinate descent solvers. The gradient descent implementation at the bottom shows how the same minimum is reached iteratively — the approach used in deep learning.
            </p>
            <CodeBlock code={PY_CODE} filename="linear_regression.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Use RidgeCV or LassoCV for automatic lambda selection via cross-validation. Always scale features before applying L1 or L2 penalties — otherwise the penalty unfairly disadvantages features with larger numerical ranges.
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
